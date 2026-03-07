export interface TokenData {
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
	logoUri?: string;
}

export interface TrendingToken {
	mint: string;
	symbol: string;
	name: string;
	price: number;
	mcap: number;
	priceChange: number;
	volume: number;
	rank: number;
}

export interface RugCheckResult {
	mint: string;
	riskScore: number;
	flags: RugFlag[];
	lpLocked: boolean;
	mintAuthRevoked: boolean;
	freezeAuthRevoked: boolean;
	top10HoldersPercent: number;
	verdict: 'safe' | 'caution' | 'likely_rug';
}

export type RugFlag =
	| 'mint_auth_active'
	| 'freeze_auth_active'
	| 'lp_not_locked'
	| 'top_holder_concentration'
	| 'no_metadata'
	| 'honeypot_suspected';

export interface SwapQuote {
	inputMint: string;
	outputMint: string;
	inAmount: string;
	outAmount: string;
	priceImpactPct: number;
	slippageBps: number;
	routePlan: RoutePlan[];
}

export interface RoutePlan {
	swapInfo: {
		ammKey: string;
		label: string;
		inputMint: string;
		outputMint: string;
		inAmount: string;
		outAmount: string;
		feeAmount: string;
		feeMint: string;
	};
	percent: number;
}

export interface PumpFunToken {
	mint: string;
	name: string;
	symbol: string;
	description: string;
	imageUri: string;
	creator: string;
	mcap: number;
	bondingCurveProgress: number;
	createdAt: number;
}
