import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getEnv } from '../lib/env.js';
import { ExternalServiceError } from '../lib/errors.js';
import { getSolPrice } from './dexscreener.js';
import type { WalletContext, TokenBalance, PnLData } from '@vex/shared';

let connection: Connection | null = null;

function getConnection(): Connection {
	if (connection) return connection;
	const env = getEnv();
	connection = new Connection(env.HELIUS_RPC_URL, 'confirmed');
	return connection;
}

interface HeliusAsset {
	id: string;
	interface: string;
	content: {
		metadata: {
			name: string;
			symbol: string;
		};
		links?: {
			image?: string;
		};
	};
	token_info?: {
		balance: number;
		decimals: number;
		price_info?: {
			price_per_token: number;
			currency: string;
		};
	};
}

interface HeliusRpcResponse {
	jsonrpc: string;
	id: string;
	result?: {
		items: HeliusAsset[];
		total: number;
		page: number;
	};
	error?: {
		code: number;
		message: string;
	};
}

export async function getAssetsByOwner(ownerAddress: string): Promise<HeliusAsset[]> {
	const env = getEnv();

	const response = await fetch(env.HELIUS_RPC_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 'vex-assets',
			method: 'getAssetsByOwner',
			params: {
				ownerAddress,
				page: 1,
				limit: 100,
				displayOptions: {
					showFungible: true,
					showNativeBalance: true
				}
			}
		})
	});

	if (!response.ok) {
		throw new ExternalServiceError('Failed to fetch assets from Helius', 'helius');
	}

	const data = (await response.json()) as HeliusRpcResponse;

	if (data.error) {
		throw new ExternalServiceError(data.error.message, 'helius');
	}

	return data.result?.items || [];
}

export async function getWalletContext(publicKey: string): Promise<WalletContext> {
	const conn = getConnection();

	try {
		// Get SOL balance
		const pubkey = new PublicKey(publicKey);
		const solBalanceLamports = await conn.getBalance(pubkey);
		const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

		// Get token assets via DAS API
		const assets = await getAssetsByOwner(publicKey);

		// Filter and transform fungible tokens
		const tokenBalances: TokenBalance[] = assets
			.filter((asset) => asset.interface === 'FungibleToken' || asset.interface === 'FungibleAsset')
			.map((asset) => {
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
					priceChange24h: 0, // Would need DexScreener batch call for this
					logoUri: asset.content.links?.image
				};
			})
			.filter((t) => t.usdValue > 0.01) // Filter dust
			.sort((a, b) => b.usdValue - a.usdValue);

		// Get SOL price from DexScreener
		const solPrice = await getSolPrice();
		const solUsd = solBalance * solPrice;

		const totalPortfolioUsd =
			solUsd + tokenBalances.reduce((sum, t) => sum + t.usdValue, 0);

		return {
			publicKey,
			solBalance,
			solUsd,
			topHoldings: tokenBalances.slice(0, 20),
			totalPortfolioUsd
		};
	} catch (error) {
		if (error instanceof ExternalServiceError) throw error;
		const message = error instanceof Error ? error.message : 'Unknown error';
		throw new ExternalServiceError(`Failed to get wallet context: ${message}`, 'helius');
	}
}

export async function getPnL(
	_publicKey: string,
	timeframe: string = '7d'
): Promise<PnLData> {
	// This would require analyzing transaction history
	// For MVP, return placeholder data
	// Full implementation would use getSignaturesForAddress and getParsedTransactions

	return {
		realizedPnl: 0,
		unrealizedPnl: 0,
		totalPnl: 0,
		winRate: 0,
		bestTrade: { token: 'N/A', gain: 0 },
		worstTrade: { token: 'N/A', loss: 0 },
		period: timeframe
	};
}
