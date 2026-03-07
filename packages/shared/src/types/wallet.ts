export interface TokenBalance {
	mint: string;
	symbol: string;
	name: string;
	balance: number;
	decimals: number;
	usdValue: number;
	priceChange24h: number;
	logoUri?: string;
}

export interface WalletContext {
	publicKey: string;
	solBalance: number;
	solUsd: number;
	topHoldings: TokenBalance[];
	totalPortfolioUsd: number;
}

export interface PnLData {
	realizedPnl: number;
	unrealizedPnl: number;
	totalPnl: number;
	winRate: number;
	bestTrade: { token: string; gain: number };
	worstTrade: { token: string; loss: number };
	period: string;
}

export interface TransactionInfo {
	signature: string;
	timestamp: number;
	type: 'swap' | 'transfer' | 'mint' | 'burn' | 'other';
	amount?: number;
	token?: string;
	fee: number;
	status: 'success' | 'failed';
}
