import { writable, derived } from 'svelte/store';
import type { WalletContext, TokenBalance, PnLData } from '@vex/shared';

interface WalletState {
	connected: boolean;
	connecting: boolean;
	address: string | null;
	context: WalletContext | null;
	pnl: PnLData | null;
	loading: boolean;
	error: string | null;
}

const initialState: WalletState = {
	connected: false,
	connecting: false,
	address: null,
	context: null,
	pnl: null,
	loading: false,
	error: null
};

function createWalletStore() {
	const { subscribe, set, update } = writable<WalletState>(initialState);

	return {
		subscribe,

		// Wallet connection removed - these methods are stubs for compatibility
		connect: async (_address: string) => {
			// Connection disabled
			console.log('Wallet connection is disabled');
		},

		disconnect: () => {
			set(initialState);
		},

		refreshContext: async () => {
			// Refresh disabled without wallet connection
			console.log('Wallet refresh disabled');
		},

		refreshPnL: async (_timeframe: string = '7d') => {
			// PnL refresh disabled without wallet connection
			console.log('PnL refresh disabled');
		}
	};
}

export const wallet = createWalletStore();

// Derived stores - return defaults since wallet is disabled
export const solBalance = derived(wallet, ($wallet) => $wallet.context?.solBalance ?? 0);

export const topHoldings = derived(
	wallet,
	($wallet) => $wallet.context?.topHoldings ?? []
);

export const totalPortfolioUsd = derived(
	wallet,
	($wallet) => $wallet.context?.totalPortfolioUsd ?? 0
);
