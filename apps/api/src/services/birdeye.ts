import { getEnv } from '../lib/env.js';
import { ExternalServiceError } from '../lib/errors.js';
import type { TokenData, TrendingToken } from '@vex/shared';

const BIRDEYE_API_URL = 'https://public-api.birdeye.so';

interface BirdeyeResponse<T> {
	success: boolean;
	message?: string;
	data: T;
}

async function birdeyeFetch<T>(endpoint: string): Promise<T> {
	const env = getEnv();

	const response = await fetch(`${BIRDEYE_API_URL}${endpoint}`, {
		headers: {
			'X-API-KEY': env.BIRDEYE_API_KEY,
			'x-chain': 'solana'
		}
	});

	if (!response.ok) {
		throw new ExternalServiceError(
			`Birdeye API error: ${response.status}`,
			'birdeye'
		);
	}

	const data = (await response.json()) as BirdeyeResponse<T>;

	if (!data.success) {
		throw new ExternalServiceError(
			data.message || 'Birdeye request failed',
			'birdeye'
		);
	}

	return data.data;
}

export async function getTokenData(mint: string): Promise<TokenData | null> {
	try {
		const data = await birdeyeFetch<{
			address: string;
			symbol: string;
			name: string;
			price: number;
			mc: number;
			v24hUSD: number;
			priceChange1hPercent: number;
			priceChange24hPercent: number;
			holder: number;
			liquidity: number;
		}>(`/defi/token_overview?address=${mint}`);

		return {
			mint: data.address,
			symbol: data.symbol,
			name: data.name,
			price: data.price,
			mcap: data.mc,
			volume24h: data.v24hUSD,
			priceChange1h: data.priceChange1hPercent,
			priceChange24h: data.priceChange24hPercent,
			holders: data.holder,
			liquidity: data.liquidity,
			createdAt: 0 // Would need separate call
		};
	} catch (error) {
		if (error instanceof ExternalServiceError) throw error;
		return null;
	}
}

export async function getTrending(
	timeframe: string = '24h',
	limit: number = 10
): Promise<TrendingToken[]> {
	try {
		// Map timeframe to Birdeye sort type
		const sortType = timeframe === '1h' ? '1h' : timeframe === '4h' ? '4h' : '24h';

		const data = await birdeyeFetch<{
			tokens: Array<{
				address: string;
				symbol: string;
				name: string;
				price: number;
				mc: number;
				v24hUSD: number;
				priceChange24hPercent: number;
			}>;
		}>(`/defi/token_trending?sort_by=rank&sort_type=${sortType}&offset=0&limit=${limit}`);

		return data.tokens.map((token, index) => ({
			mint: token.address,
			symbol: token.symbol,
			name: token.name,
			price: token.price,
			mcap: token.mc,
			priceChange: token.priceChange24hPercent,
			volume: token.v24hUSD,
			rank: index + 1
		}));
	} catch (error) {
		console.error('Failed to fetch trending:', error);
		return [];
	}
}

export async function getTopGainers(
	timeframe: string = '24h',
	limit: number = 10
): Promise<TrendingToken[]> {
	try {
		const sortType = timeframe === '1h' ? '1h' : timeframe === '4h' ? '4h' : '24h';

		const data = await birdeyeFetch<{
			tokens: Array<{
				address: string;
				symbol: string;
				name: string;
				price: number;
				mc: number;
				v24hUSD: number;
				priceChange24hPercent: number;
			}>;
		}>(`/defi/token_trending?sort_by=price_change&sort_type=${sortType}&offset=0&limit=${limit}`);

		return data.tokens.map((token, index) => ({
			mint: token.address,
			symbol: token.symbol,
			name: token.name,
			price: token.price,
			mcap: token.mc,
			priceChange: token.priceChange24hPercent,
			volume: token.v24hUSD,
			rank: index + 1
		}));
	} catch (error) {
		console.error('Failed to fetch gainers:', error);
		return [];
	}
}

export async function getTokenPrice(mint: string): Promise<{ price: number; priceChange24h: number } | null> {
	try {
		const data = await birdeyeFetch<{
			value: number;
			priceChange24h: number;
		}>(`/defi/price?address=${mint}`);

		return {
			price: data.value,
			priceChange24h: data.priceChange24h || 0
		};
	} catch {
		return null;
	}
}

export async function getBatchPrices(
	mints: string[]
): Promise<Map<string, { price: number; priceChange24h: number }>> {
	const results = new Map();

	// Birdeye supports batch price queries
	try {
		const addresses = mints.join(',');
		const data = await birdeyeFetch<
			Record<string, { value: number; priceChange24h?: number }>
		>(`/defi/multi_price?list_address=${addresses}`);

		for (const [mint, priceData] of Object.entries(data)) {
			results.set(mint, {
				price: priceData.value,
				priceChange24h: priceData.priceChange24h || 0
			});
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
