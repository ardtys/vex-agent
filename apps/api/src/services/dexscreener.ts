import { ExternalServiceError } from '../lib/errors.js';
import type { TokenData, TrendingToken } from '@vex/shared';

const DEXSCREENER_API_URL = 'https://api.dexscreener.com';

interface DexScreenerPair {
	chainId: string;
	dexId: string;
	url: string;
	pairAddress: string;
	baseToken: {
		address: string;
		name: string;
		symbol: string;
	};
	quoteToken: {
		address: string;
		name: string;
		symbol: string;
	};
	priceNative: string;
	priceUsd: string;
	txns: {
		h24: { buys: number; sells: number };
		h6: { buys: number; sells: number };
		h1: { buys: number; sells: number };
		m5: { buys: number; sells: number };
	};
	volume: {
		h24: number;
		h6: number;
		h1: number;
		m5: number;
	};
	priceChange: {
		h24: number;
		h6: number;
		h1: number;
		m5: number;
	};
	liquidity?: {
		usd: number;
		base: number;
		quote: number;
	};
	fdv?: number;
	marketCap?: number;
	pairCreatedAt?: number;
	boosts?: {
		active: number;
	};
}

interface BoostedToken {
	url: string;
	chainId: string;
	tokenAddress: string;
	icon?: string;
	header?: string;
	openGraph?: string;
	description?: string;
	links?: Array<{ label: string; url: string }>;
	amount: number;
	totalAmount: number;
}

async function dexFetch<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${DEXSCREENER_API_URL}${endpoint}`, {
		headers: {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new ExternalServiceError(
			`DexScreener API error: ${response.status}`,
			'dexscreener'
		);
	}

	return (await response.json()) as T;
}

export async function getTokenData(mint: string): Promise<TokenData | null> {
	try {
		// DexScreener returns array directly for token endpoint
		const pairs = await dexFetch<DexScreenerPair[]>(
			`/tokens/v1/solana/${mint}`
		);

		if (!pairs || pairs.length === 0) {
			return null;
		}

		// Get the pair with highest liquidity
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
			holders: 0, // Not available in DexScreener
			liquidity: pair.liquidity?.usd || 0,
			createdAt: pair.pairCreatedAt || 0
		};
	} catch (error) {
		if (error instanceof ExternalServiceError) throw error;
		console.error('Failed to fetch token data:', error);
		return null;
	}
}

export async function getTrending(
	_timeframe: string = '24h',
	limit: number = 10
): Promise<TrendingToken[]> {
	try {
		// Use top boosted tokens as "trending"
		const boosted = await dexFetch<BoostedToken[]>('/token-boosts/top/v1');

		// Filter for Solana tokens only
		const solanaTokens = boosted
			.filter(token => token.chainId === 'solana')
			.slice(0, limit);

		if (solanaTokens.length === 0) {
			// Fallback: search for popular Solana pairs
			return await searchTrendingPairs(limit);
		}

		// Get detailed data for each token
		const tokens: TrendingToken[] = [];

		for (const token of solanaTokens) {
			try {
				const tokenData = await getTokenData(token.tokenAddress);
				if (tokenData) {
					tokens.push({
						mint: tokenData.mint,
						symbol: tokenData.symbol,
						name: tokenData.name,
						price: tokenData.price,
						mcap: tokenData.mcap,
						priceChange: tokenData.priceChange24h,
						volume: tokenData.volume24h,
						rank: tokens.length + 1
					});
				}
			} catch {
				// Skip tokens that fail
			}
		}

		return tokens;
	} catch (error) {
		console.error('Failed to fetch trending from DexScreener:', error);
		// Fallback to search
		return await searchTrendingPairs(limit);
	}
}

async function searchTrendingPairs(limit: number): Promise<TrendingToken[]> {
	try {
		// Search for popular Solana memecoins
		const searchTerms = ['SOL', 'BONK', 'WIF', 'POPCAT', 'MEW'];
		const allPairs: DexScreenerPair[] = [];

		for (const term of searchTerms) {
			try {
				const data = await dexFetch<{ pairs: DexScreenerPair[] | null }>(
					`/latest/dex/search?q=${term}`
				);
				if (data.pairs) {
					// Only add Solana pairs
					const solanaPairs = data.pairs.filter(p => p.chainId === 'solana');
					allPairs.push(...solanaPairs);
				}
			} catch {
				// Continue with other terms
			}
		}

		// Remove duplicates and sort by volume
		const uniquePairs = Array.from(
			new Map(allPairs.map(p => [p.baseToken.address, p])).values()
		);

		const sorted = uniquePairs
			.sort((a, b) => (b.volume.h24 || 0) - (a.volume.h24 || 0))
			.slice(0, limit);

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
		console.error('Failed to search trending pairs:', error);
		return [];
	}
}

export async function getTopGainers(
	_timeframe: string = '24h',
	limit: number = 10
): Promise<TrendingToken[]> {
	try {
		// Search and sort by price change
		const trending = await searchTrendingPairs(50);

		return trending
			.sort((a, b) => b.priceChange - a.priceChange)
			.slice(0, limit);
	} catch (error) {
		console.error('Failed to fetch gainers:', error);
		return [];
	}
}

export async function getTokenPrice(mint: string): Promise<{ price: number; priceChange24h: number } | null> {
	try {
		const data = await getTokenData(mint);
		if (!data) return null;

		return {
			price: data.price,
			priceChange24h: data.priceChange24h
		};
	} catch {
		return null;
	}
}

export async function getBatchPrices(
	mints: string[]
): Promise<Map<string, { price: number; priceChange24h: number }>> {
	const results = new Map<string, { price: number; priceChange24h: number }>();

	// DexScreener supports comma-separated addresses
	try {
		const addresses = mints.join(',');
		// Token endpoint returns array directly
		const pairs = await dexFetch<DexScreenerPair[]>(
			`/tokens/v1/solana/${addresses}`
		);

		if (pairs && pairs.length > 0) {
			for (const pair of pairs) {
				if (!results.has(pair.baseToken.address)) {
					results.set(pair.baseToken.address, {
						price: parseFloat(pair.priceUsd) || 0,
						priceChange24h: pair.priceChange.h24 || 0
					});
				}
			}
		}
	} catch (error) {
		console.error('Failed to fetch batch prices:', error);
	}

	return results;
}

export async function getSolPrice(): Promise<number> {
	try {
		const SOL_MINT = 'So11111111111111111111111111111111111111112';
		const price = await getTokenPrice(SOL_MINT);
		return price?.price || 150; // Fallback
	} catch {
		return 150; // Fallback
	}
}
