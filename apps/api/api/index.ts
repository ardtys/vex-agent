import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// ============ LOCAL TYPES ============
interface TokenData {
	mint: string;
	symbol: string;
	name: string;
	price: number;
	mcap: number;
	volume24h: number;
	priceChange1h: number;
	priceChange24h: number;
	holders: number;
	liquidity: number;
	createdAt: number;
}

interface TrendingToken {
	mint: string;
	symbol: string;
	name: string;
	price: number;
	mcap: number;
	priceChange: number;
	volume: number;
	rank: number;
}

interface TokenBalance {
	mint: string;
	symbol: string;
	name: string;
	balance: number;
	decimals: number;
	usdValue: number;
	priceChange24h: number;
	logoUri?: string;
}

interface WalletContext {
	publicKey: string;
	solBalance: number;
	solUsd: number;
	topHoldings: TokenBalance[];
	totalPortfolioUsd: number;
}

interface LLMMessage {
	role: 'user' | 'assistant' | 'tool' | 'system';
	content: string;
	tool_calls?: any[];
	tool_call_id?: string;
}

interface StreamEvent {
	type: 'thinking' | 'tool_start' | 'tool_result' | 'final' | 'error';
	text?: string;
	tool?: string;
	args?: Record<string, unknown>;
	result?: string;
	error?: string;
}

// ============ CONFIGURATION ============
const corsOrigin = process.env.CORS_ORIGIN || '*';
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct';

// ============ ERROR HANDLING ============
class VexError extends Error {
	constructor(message: string, public code: string, public statusCode: number = 500) {
		super(message);
		this.name = 'VexError';
	}
}

class ExternalServiceError extends VexError {
	constructor(message: string, public service: string) {
		super(message, 'EXTERNAL_SERVICE_ERROR', 502);
	}
}

function isVexError(error: unknown): error is VexError {
	return error instanceof VexError;
}

function formatError(error: unknown): { message: string; code: string } {
	if (isVexError(error)) {
		return { message: error.message, code: error.code };
	}
	if (error instanceof Error) {
		return { message: error.message, code: 'UNKNOWN_ERROR' };
	}
	return { message: 'An unknown error occurred', code: 'UNKNOWN_ERROR' };
}

// ============ DEXSCREENER SERVICE ============
const DEXSCREENER_API_URL = 'https://api.dexscreener.com';

interface DexScreenerPair {
	chainId: string;
	baseToken: { address: string; name: string; symbol: string };
	priceUsd: string;
	volume: { h24: number };
	priceChange: { h24: number; h1: number };
	liquidity?: { usd: number };
	marketCap?: number;
	fdv?: number;
	pairCreatedAt?: number;
}

async function dexFetch<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${DEXSCREENER_API_URL}${endpoint}`, {
		headers: { 'Accept': 'application/json' }
	});
	if (!response.ok) {
		throw new ExternalServiceError(`DexScreener API error: ${response.status}`, 'dexscreener');
	}
	return (await response.json()) as T;
}

async function getTokenData(mint: string): Promise<TokenData | null> {
	try {
		const pairs = await dexFetch<DexScreenerPair[]>(`/tokens/v1/solana/${mint}`);
		if (!pairs || pairs.length === 0) return null;

		const pair = pairs.reduce((best, current) => {
			const bestLiq = best.liquidity?.usd || 0;
			const currentLiq = current.liquidity?.usd || 0;
			return currentLiq > bestLiq ? current : best;
		});

		return {
			mint: pair.baseToken.address,
			symbol: pair.baseToken.symbol,
			name: pair.baseToken.name,
			price: parseFloat(pair.priceUsd) || 0,
			mcap: pair.marketCap || pair.fdv || 0,
			volume24h: pair.volume.h24 || 0,
			priceChange1h: pair.priceChange.h1 || 0,
			priceChange24h: pair.priceChange.h24 || 0,
			holders: 0,
			liquidity: pair.liquidity?.usd || 0,
			createdAt: pair.pairCreatedAt || 0
		};
	} catch (error) {
		console.error('Failed to fetch token data:', error);
		return null;
	}
}

async function getTrending(limit: number = 10): Promise<TrendingToken[]> {
	try {
		const searchTerms = ['SOL', 'BONK', 'WIF', 'POPCAT', 'MEW'];
		const allPairs: DexScreenerPair[] = [];

		for (const term of searchTerms) {
			try {
				const data = await dexFetch<{ pairs: DexScreenerPair[] | null }>(`/latest/dex/search?q=${term}`);
				if (data.pairs) {
					const solanaPairs = data.pairs.filter(p => p.chainId === 'solana');
					allPairs.push(...solanaPairs);
				}
			} catch { /* continue */ }
		}

		const uniquePairs = Array.from(new Map(allPairs.map(p => [p.baseToken.address, p])).values());
		const sorted = uniquePairs.sort((a, b) => (b.volume.h24 || 0) - (a.volume.h24 || 0)).slice(0, limit);

		return sorted.map((pair, index) => ({
			mint: pair.baseToken.address,
			symbol: pair.baseToken.symbol,
			name: pair.baseToken.name,
			price: parseFloat(pair.priceUsd) || 0,
			mcap: pair.marketCap || pair.fdv || 0,
			priceChange: pair.priceChange.h24 || 0,
			volume: pair.volume.h24 || 0,
			rank: index + 1
		}));
	} catch (error) {
		console.error('Failed to fetch trending:', error);
		return [];
	}
}

async function getSolPrice(): Promise<number> {
	try {
		const SOL_MINT = 'So11111111111111111111111111111111111111112';
		const data = await getTokenData(SOL_MINT);
		return data?.price || 150;
	} catch {
		return 150;
	}
}

// ============ HELIUS SERVICE ============
let connection: Connection | null = null;

function getConnection(): Connection {
	if (connection) return connection;
	if (!HELIUS_RPC_URL) throw new Error('HELIUS_RPC_URL not configured');
	connection = new Connection(HELIUS_RPC_URL, 'confirmed');
	return connection;
}

interface HeliusAsset {
	id: string;
	interface: string;
	content: { metadata: { name: string; symbol: string }; links?: { image?: string } };
	token_info?: { balance: number; decimals: number; price_info?: { price_per_token: number } };
}

async function getAssetsByOwner(ownerAddress: string): Promise<HeliusAsset[]> {
	const response = await fetch(HELIUS_RPC_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 'vex-assets',
			method: 'getAssetsByOwner',
			params: { ownerAddress, page: 1, limit: 100, displayOptions: { showFungible: true, showNativeBalance: true } }
		})
	});

	if (!response.ok) throw new ExternalServiceError('Failed to fetch assets from Helius', 'helius');
	const data = await response.json();
	if (data.error) throw new ExternalServiceError(data.error.message, 'helius');
	return data.result?.items || [];
}

async function getWalletContext(publicKey: string): Promise<WalletContext> {
	const conn = getConnection();

	try {
		const pubkey = new PublicKey(publicKey);
		const solBalanceLamports = await conn.getBalance(pubkey);
		const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

		const assets = await getAssetsByOwner(publicKey);
		const tokenBalances = assets
			.filter(a => a.interface === 'FungibleToken' || a.interface === 'FungibleAsset')
			.map(asset => {
				const balance = asset.token_info?.balance || 0;
				const decimals = asset.token_info?.decimals || 0;
				const price = asset.token_info?.price_info?.price_per_token || 0;
				const adjustedBalance = balance / Math.pow(10, decimals);
				return {
					mint: asset.id,
					symbol: asset.content.metadata.symbol || 'UNKNOWN',
					name: asset.content.metadata.name || 'Unknown Token',
					balance: adjustedBalance,
					decimals,
					usdValue: adjustedBalance * price,
					priceChange24h: 0,
					logoUri: asset.content.links?.image
				};
			})
			.filter(t => t.usdValue > 0.01)
			.sort((a, b) => b.usdValue - a.usdValue);

		const solPrice = await getSolPrice();
		const solUsd = solBalance * solPrice;
		const totalPortfolioUsd = solUsd + tokenBalances.reduce((sum, t) => sum + t.usdValue, 0);

		return { publicKey, solBalance, solUsd, topHoldings: tokenBalances.slice(0, 20), totalPortfolioUsd };
	} catch (error) {
		if (error instanceof ExternalServiceError) throw error;
		throw new ExternalServiceError(`Failed to get wallet context: ${error instanceof Error ? error.message : 'Unknown'}`, 'helius');
	}
}

// ============ RUGCHECK SERVICE ============
async function checkRug(mint: string) {
	try {
		const response = await fetch(`https://api.rugcheck.xyz/v1/tokens/${mint}/report/summary`);
		if (!response.ok) return null;
		return await response.json();
	} catch {
		return null;
	}
}

// ============ AGENT TOOLS ============
const tools = {
	tokenInfo: {
		name: 'tokenInfo',
		description: 'Get detailed information about a Solana token',
		parameters: { type: 'object', properties: { symbol: { type: 'string' }, mint: { type: 'string' } } },
		execute: async (args: { symbol?: string; mint?: string }) => {
			const mint = args.mint || args.symbol;
			if (!mint) return { error: 'Token symbol or mint address required' };
			const data = await getTokenData(mint);
			return data || { error: 'Token not found' };
		}
	},
	trending: {
		name: 'trending',
		description: 'Get trending tokens on Solana',
		parameters: { type: 'object', properties: { limit: { type: 'number' } } },
		execute: async (args: { limit?: number }) => {
			return await getTrending(args.limit || 10);
		}
	},
	rugCheck: {
		name: 'rugCheck',
		description: 'Check if a token is safe or potentially a rug pull',
		parameters: { type: 'object', properties: { mint: { type: 'string' } }, required: ['mint'] },
		execute: async (args: { mint: string }) => {
			const result = await checkRug(args.mint);
			return result || { error: 'Could not analyze token' };
		}
	},
	portfolio: {
		name: 'portfolio',
		description: 'Get wallet portfolio and holdings',
		parameters: { type: 'object', properties: { address: { type: 'string' } } },
		execute: async (args: { address?: string }, ctx: WalletContext) => {
			const address = args.address || ctx.publicKey;
			if (!address || address === 'guest') return { error: 'No wallet address provided' };
			return await getWalletContext(address);
		}
	}
};

// ============ AGENT CORE ============
const systemPrompt = `You are VEX, an AI trading assistant for the Solana blockchain.

You help users with:
- Checking token prices and information
- Finding trending tokens
- Analyzing tokens for rug pull risks
- Viewing portfolio data

Always be helpful, concise, and accurate. When showing prices, format them nicely.
If you don't have enough information, ask for clarification.`;

async function callLLM(messages: LLMMessage[], toolDefs: any[]): Promise<any> {
	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
			'HTTP-Referer': 'https://vex.app',
			'X-Title': 'VEX Trading Agent'
		},
		body: JSON.stringify({
			model: OPENROUTER_MODEL,
			messages: [{ role: 'system', content: systemPrompt }, ...messages.map(m => ({ role: m.role, content: m.content, tool_calls: m.tool_calls, tool_call_id: m.tool_call_id }))],
			tools: toolDefs.map(t => ({ type: 'function', function: t })),
			stream: false
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new ExternalServiceError(`OpenRouter error: ${error}`, 'openrouter');
	}

	return await response.json();
}

async function* runAgentLoop(message: string, walletCtx: WalletContext, history: LLMMessage[]): AsyncGenerator<StreamEvent> {
	const userMessage: LLMMessage = { role: 'user', content: message };
	history.push(userMessage);

	const toolDefs = Object.values(tools).map(t => ({
		name: t.name,
		description: t.description,
		parameters: t.parameters
	}));

	let iterations = 0;
	const maxIterations = 5;

	while (iterations < maxIterations) {
		iterations++;
		yield { type: 'thinking', text: 'Processing...' };

		try {
			const response = await callLLM(history, toolDefs);
			const choice = response.choices?.[0];

			if (!choice) {
				yield { type: 'error', error: 'No response from AI' };
				return;
			}

			const assistantMessage = choice.message;

			if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
				history.push({ role: 'assistant', content: assistantMessage.content || '', tool_calls: assistantMessage.tool_calls });

				for (const toolCall of assistantMessage.tool_calls) {
					const toolName = toolCall.function.name;
					const tool = tools[toolName as keyof typeof tools];

					if (tool) {
						yield { type: 'tool_start', tool: toolName, args: JSON.parse(toolCall.function.arguments || '{}') };

						try {
							const args = JSON.parse(toolCall.function.arguments || '{}');
							const result = await tool.execute(args, walletCtx);
							const resultStr = JSON.stringify(result);

							history.push({ role: 'tool', content: resultStr, tool_call_id: toolCall.id });
							yield { type: 'tool_result', tool: toolName, result: resultStr };
						} catch (error) {
							const errorMsg = error instanceof Error ? error.message : 'Tool execution failed';
							history.push({ role: 'tool', content: JSON.stringify({ error: errorMsg }), tool_call_id: toolCall.id });
							yield { type: 'tool_result', tool: toolName, result: JSON.stringify({ error: errorMsg }) };
						}
					}
				}
			} else {
				const finalText = assistantMessage.content || 'I apologize, I could not generate a response.';
				history.push({ role: 'assistant', content: finalText });
				yield { type: 'final', text: finalText };
				return;
			}
		} catch (error) {
			yield { type: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
			return;
		}
	}

	yield { type: 'final', text: 'I reached my processing limit. Please try a simpler request.' };
}

// ============ HONO APP ============
const app = new Hono();

// CORS Middleware
app.use('*', cors({
	origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map(o => o.trim()),
	allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
	credentials: true
}));

// Health check
app.get('/', (c) => c.json({ name: 'VEX API', version: '0.1.0', status: 'operational' }));
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// Session store
const sessions = new Map<string, LLMMessage[]>();

// Chat endpoint
const chatSchema = z.object({ message: z.string().min(1).max(2000), sessionId: z.string().min(1) });

app.post('/agent/chat', async (c) => {
	const body = await c.req.json();
	const parsed = chatSchema.safeParse(body);

	if (!parsed.success) {
		return c.json({ message: 'Invalid request', code: 'VALIDATION_ERROR' }, 400);
	}

	const { message, sessionId } = parsed.data;
	const history = sessions.get(sessionId) || [];
	const walletCtx: WalletContext = { publicKey: 'guest', solBalance: 0, solUsd: 0, topHoldings: [], totalPortfolioUsd: 0 };

	// Stream SSE response
	return new Response(
		new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				try {
					for await (const event of runAgentLoop(message, walletCtx, history)) {
						controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
					}
					sessions.set(sessionId, history);
				} catch {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Stream failed' })}\n\n`));
				}
				controller.close();
			}
		}),
		{
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			}
		}
	);
});

// Clear session
app.delete('/agent/session/:id', (c) => {
	const sessionId = c.req.param('id')!;
	sessions.delete(sessionId);
	return c.json({ success: true, sessionId });
});

// Market endpoints
app.get('/market/trending', async (c) => {
	const trending = await getTrending(10);
	return c.json({ tokens: trending });
});

app.get('/market/token/:mint', async (c) => {
	const mint = c.req.param('mint')!;
	const data = await getTokenData(mint);
	if (!data) return c.json({ message: 'Token not found' }, 404);
	return c.json(data);
});

// Wallet endpoints
const pubkeySchema = z.string().refine((val) => {
	try { new PublicKey(val); return true; } catch { return false; }
}, { message: 'Invalid Solana public key' });

app.get('/wallet/:pubkey', async (c) => {
	const pubkey = c.req.param('pubkey')!;
	const parsed = pubkeySchema.safeParse(pubkey);
	if (!parsed.success) return c.json({ message: 'Invalid wallet address', code: 'VALIDATION_ERROR' }, 400);

	try {
		const walletContext = await getWalletContext(parsed.data);
		return c.json(walletContext);
	} catch (error) {
		return c.json(formatError(error), 500);
	}
});

// Error handler
app.onError((err, c) => {
	console.error('Error:', err);
	if (isVexError(err)) {
		return c.json(formatError(err), err.statusCode as any);
	}
	return c.json(formatError(err), 500);
});

app.notFound((c) => c.json({ message: 'Not found', code: 'NOT_FOUND' }, 404));

export default handle(app);
