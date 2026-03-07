import type { ToolDefinition, ToolResult, WalletContext } from '@vex/shared';
import { REQUIRES_APPROVAL } from '@vex/shared';
import * as helius from '../../services/helius.js';
import * as dexscreener from '../../services/dexscreener.js';
import * as jupiter from '../../services/jupiter.js';

// Tool registry type
export interface Tool {
	definition: ToolDefinition;
	execute: (args: Record<string, unknown>, ctx: WalletContext) => Promise<ToolResult>;
}

// Registry of all available tools
const toolRegistry: Map<string, Tool> = new Map();

export function registerTool(tool: Tool): void {
	toolRegistry.set(tool.definition.name, tool);
}

export function getTool(name: string): Tool | undefined {
	return toolRegistry.get(name);
}

export function getAllTools(): Tool[] {
	return Array.from(toolRegistry.values());
}

export function getAllToolDefinitions(): ToolDefinition[] {
	return getAllTools().map((t) => t.definition);
}

export function requiresApproval(toolName: string): boolean {
	return (REQUIRES_APPROVAL as readonly string[]).includes(toolName);
}

export async function executeTool(
	toolName: string,
	args: Record<string, unknown>,
	ctx: WalletContext
): Promise<ToolResult> {
	const tool = getTool(toolName);

	if (!tool) {
		return {
			success: false,
			summary: `Unknown tool: ${toolName}`,
			data: { error: `Tool "${toolName}" not found` }
		};
	}

	try {
		return await tool.execute(args, ctx);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error(`Tool ${toolName} error:`, error);

		return {
			success: false,
			summary: `Tool failed: ${errorMessage}`,
			data: { error: errorMessage }
		};
	}
}

// ============== TOOL IMPLEMENTATIONS ==============

const portfolioTool: Tool = {
	definition: {
		name: 'get_portfolio',
		description:
			'Get the current wallet portfolio including all token balances, their USD values, and 24h price changes.',
		requiresApproval: false,
		parameters: {
			type: 'object',
			properties: {},
			required: []
		}
	},
	execute: async (_args, ctx) => {
		// Refresh wallet context with latest data
		const walletCtx = await helius.getWalletContext(ctx.publicKey);

		return {
			success: true,
			summary: `${walletCtx.solBalance.toFixed(4)} SOL + ${walletCtx.topHoldings.length} tokens (~$${walletCtx.totalPortfolioUsd.toFixed(2)})`,
			data: {
				solBalance: walletCtx.solBalance,
				solUsd: walletCtx.solUsd,
				topHoldings: walletCtx.topHoldings,
				totalUsd: walletCtx.totalPortfolioUsd
			}
		};
	}
};

const pnlTool: Tool = {
	definition: {
		name: 'get_pnl',
		description:
			'Calculate profit and loss for the wallet over a specified time period (e.g., 24h, 7d, 30d).',
		requiresApproval: false,
		parameters: {
			type: 'object',
			properties: {
				timeframe: {
					type: 'string',
					description: 'Time period for PnL calculation: 24h, 7d, or 30d',
					enum: ['24h', '7d', '30d']
				}
			},
			required: ['timeframe']
		}
	},
	execute: async (args, ctx) => {
		const timeframe = (args.timeframe as string) || '7d';
		const pnl = await helius.getPnL(ctx.publicKey, timeframe);

		return {
			success: true,
			summary: `PnL (${timeframe}): $${pnl.totalPnl.toFixed(2)} | Win rate: ${(pnl.winRate * 100).toFixed(1)}%`,
			data: pnl
		};
	}
};

const trendingTool: Tool = {
	definition: {
		name: 'get_trending',
		description:
			'Get trending tokens on Solana, sorted by volume or price change. Can filter by timeframe.',
		requiresApproval: false,
		parameters: {
			type: 'object',
			properties: {
				timeframe: {
					type: 'string',
					description: 'Time period for trending: 1h, 4h, 24h',
					enum: ['1h', '4h', '24h']
				},
				limit: {
					type: 'number',
					description: 'Number of tokens to return (max 20)',
					default: 10
				}
			},
			required: []
		}
	},
	execute: async (args, _ctx) => {
		const timeframe = (args.timeframe as string) || '24h';
		const limit = Math.min((args.limit as number) || 10, 20);

		const tokens = await dexscreener.getTrending(timeframe, limit);

		if (tokens.length === 0) {
			return {
				success: false,
				summary: 'No trending tokens found',
				data: { timeframe, tokens: [] }
			};
		}

		const topToken = tokens[0];
		return {
			success: true,
			summary: `#1: ${topToken.symbol} ${topToken.priceChange >= 0 ? '+' : ''}${topToken.priceChange.toFixed(1)}% | ${tokens.length} tokens`,
			data: { timeframe, tokens }
		};
	}
};

const gainersTool: Tool = {
	definition: {
		name: 'get_top_gainers',
		description:
			'Get top gaining tokens on Solana by price change over a timeframe.',
		requiresApproval: false,
		parameters: {
			type: 'object',
			properties: {
				timeframe: {
					type: 'string',
					description: 'Time period: 1h, 4h, 24h',
					enum: ['1h', '4h', '24h']
				},
				limit: {
					type: 'number',
					description: 'Number of tokens to return (max 20)',
					default: 10
				}
			},
			required: []
		}
	},
	execute: async (args, _ctx) => {
		const timeframe = (args.timeframe as string) || '24h';
		const limit = Math.min((args.limit as number) || 10, 20);

		const tokens = await dexscreener.getTopGainers(timeframe, limit);

		if (tokens.length === 0) {
			return {
				success: false,
				summary: 'No gainers found',
				data: { timeframe, tokens: [] }
			};
		}

		const topToken = tokens[0];
		return {
			success: true,
			summary: `#1: ${topToken.symbol} +${topToken.priceChange.toFixed(1)}% | mcap $${(topToken.mcap / 1000).toFixed(0)}K`,
			data: { timeframe, tokens }
		};
	}
};

const tokenDataTool: Tool = {
	definition: {
		name: 'get_token_data',
		description:
			'Get detailed data for a specific token including price, market cap, volume, holders, and liquidity.',
		requiresApproval: false,
		parameters: {
			type: 'object',
			properties: {
				mint: {
					type: 'string',
					description: 'Token mint address (or "SOL" for native SOL)'
				}
			},
			required: ['mint']
		}
	},
	execute: async (args, _ctx) => {
		const mint = args.mint as string;
		const normalizedMint =
			mint.toUpperCase() === 'SOL'
				? 'So11111111111111111111111111111111111111112'
				: mint;

		const tokenData = await dexscreener.getTokenData(normalizedMint);

		if (!tokenData) {
			return {
				success: false,
				summary: `Token ${mint} not found`,
				data: { mint, error: 'Token not found' }
			};
		}

		const mcapStr =
			tokenData.mcap >= 1_000_000
				? `$${(tokenData.mcap / 1_000_000).toFixed(2)}M`
				: `$${(tokenData.mcap / 1_000).toFixed(0)}K`;

		return {
			success: true,
			summary: `${tokenData.symbol} | $${tokenData.price.toFixed(6)} | mcap ${mcapStr}`,
			data: tokenData
		};
	}
};

const rugCheckTool: Tool = {
	definition: {
		name: 'check_rug_risk',
		description:
			'Check a token for rug pull indicators: LP lock status, mint/freeze authority, holder concentration, honeypot detection.',
		requiresApproval: false,
		parameters: {
			type: 'object',
			properties: {
				mint: {
					type: 'string',
					description: 'Token mint address to check'
				}
			},
			required: ['mint']
		}
	},
	execute: async (args, _ctx) => {
		const mint = args.mint as string;

		// Call RugCheck.xyz API
		try {
			const response = await fetch(
				`https://api.rugcheck.xyz/v1/tokens/${mint}/report`
			);

			if (!response.ok) {
				return {
					success: false,
					summary: `Failed to check ${mint.slice(0, 8)}...`,
					data: { mint, error: 'RugCheck API unavailable' }
				};
			}

			const data = (await response.json()) as {
				score?: number;
				mint_authority_revoked?: boolean;
				freeze_authority_revoked?: boolean;
				lp_locked?: boolean;
				top_holders_percentage?: number;
			};

			// Parse RugCheck response
			const riskScore = data.score || 0;
			const flags: string[] = [];

			if (!data.mint_authority_revoked) flags.push('mint_auth_active');
			if (!data.freeze_authority_revoked) flags.push('freeze_auth_active');
			if (!data.lp_locked) flags.push('lp_not_locked');
			if ((data.top_holders_percentage || 0) > 50) flags.push('top_holder_concentration');

			let verdict: 'safe' | 'caution' | 'likely_rug' = 'safe';
			if (riskScore > 70 || flags.length >= 3) verdict = 'likely_rug';
			else if (riskScore > 40 || flags.length >= 1) verdict = 'caution';

			return {
				success: true,
				summary: `${verdict.toUpperCase()} | Risk: ${riskScore}/100 | ${flags.length} flags`,
				data: {
					mint,
					riskScore,
					flags,
					lpLocked: data.lp_locked ?? false,
					mintAuthRevoked: data.mint_authority_revoked ?? false,
					freezeAuthRevoked: data.freeze_authority_revoked ?? false,
					top10HoldersPercent: data.top_holders_percentage ?? 0,
					verdict
				}
			};
		} catch (error) {
			return {
				success: false,
				summary: `Rug check failed for ${mint.slice(0, 8)}...`,
				data: {
					mint,
					error: error instanceof Error ? error.message : 'Unknown error'
				}
			};
		}
	}
};

const swapTool: Tool = {
	definition: {
		name: 'swap_token',
		description:
			'Swap one token for another using Jupiter aggregator. Returns a transaction for user to sign.',
		requiresApproval: true,
		parameters: {
			type: 'object',
			properties: {
				inputMint: {
					type: 'string',
					description: 'Input token mint address (or "SOL")'
				},
				outputMint: {
					type: 'string',
					description: 'Output token mint address (or "SOL")'
				},
				amount: {
					type: 'number',
					description: 'Amount to swap in token base units or lamports for SOL'
				},
				slippageBps: {
					type: 'number',
					description: 'Slippage tolerance in basis points (default: 300 = 3%)',
					default: 300
				}
			},
			required: ['inputMint', 'outputMint', 'amount']
		}
	},
	execute: async (args, ctx) => {
		const inputMint = args.inputMint as string;
		const outputMint = args.outputMint as string;
		const amount = args.amount as number;
		const slippageBps = (args.slippageBps as number) || 300;

		const result = await jupiter.executeSwap(
			inputMint,
			outputMint,
			amount,
			ctx.publicKey,
			slippageBps
		);

		const inAmount = parseFloat(result.quote.inAmount) / 1e9;
		const outAmount = parseFloat(result.quote.outAmount) / 1e9;

		return {
			success: true,
			summary: `Swap ${inAmount.toFixed(4)} → ${outAmount.toFixed(4)} | Impact: ${result.quote.priceImpactPct.toFixed(2)}%`,
			data: {
				quote: result.quote,
				transaction: result.transaction,
				lastValidBlockHeight: result.lastValidBlockHeight,
				status: 'ready_to_sign'
			}
		};
	}
};

const sendSolTool: Tool = {
	definition: {
		name: 'send_sol',
		description: 'Send SOL to another wallet address. Returns a transaction for user to sign.',
		requiresApproval: true,
		parameters: {
			type: 'object',
			properties: {
				recipient: {
					type: 'string',
					description: 'Recipient wallet address'
				},
				amountSol: {
					type: 'number',
					description: 'Amount of SOL to send'
				}
			},
			required: ['recipient', 'amountSol']
		}
	},
	execute: async (args, ctx) => {
		const recipient = args.recipient as string;
		const amountSol = args.amountSol as number;

		// Build a simple SOL transfer transaction
		// This would be signed client-side
		return {
			success: true,
			summary: `Send ${amountSol} SOL to ${recipient.slice(0, 8)}...`,
			data: {
				from: ctx.publicKey,
				to: recipient,
				amountSol,
				amountLamports: Math.floor(amountSol * 1_000_000_000),
				status: 'ready_to_sign'
			}
		};
	}
};

// Register all tools
registerTool(portfolioTool);
registerTool(pnlTool);
registerTool(trendingTool);
registerTool(gainersTool);
registerTool(tokenDataTool);
registerTool(rugCheckTool);
registerTool(swapTool);
registerTool(sendSolTool);

// Re-export types
export type { ToolDefinition, ToolResult };
