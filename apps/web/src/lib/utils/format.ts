/**
 * Format SOL amount with appropriate decimal places
 */
export function formatSol(lamports: number): string {
	const sol = lamports / 1_000_000_000;
	if (sol >= 1000) {
		return `${(sol / 1000).toFixed(2)}K`;
	}
	if (sol >= 1) {
		return sol.toFixed(4);
	}
	return sol.toFixed(6);
}

/**
 * Format USD amount with appropriate abbreviations
 */
export function formatUsd(amount: number): string {
	if (amount >= 1_000_000_000) {
		return `$${(amount / 1_000_000_000).toFixed(2)}B`;
	}
	if (amount >= 1_000_000) {
		return `$${(amount / 1_000_000).toFixed(2)}M`;
	}
	if (amount >= 1_000) {
		return `$${(amount / 1_000).toFixed(2)}K`;
	}
	if (amount >= 1) {
		return `$${amount.toFixed(2)}`;
	}
	return `$${amount.toFixed(4)}`;
}

/**
 * Format market cap with abbreviations
 */
export function formatMcap(mcap: number): string {
	if (mcap >= 1_000_000_000) {
		return `${(mcap / 1_000_000_000).toFixed(2)}B`;
	}
	if (mcap >= 1_000_000) {
		return `${(mcap / 1_000_000).toFixed(2)}M`;
	}
	if (mcap >= 1_000) {
		return `${(mcap / 1_000).toFixed(1)}K`;
	}
	return mcap.toFixed(0);
}

/**
 * Format percentage with color indicator
 */
export function formatPercent(percent: number): { value: string; isPositive: boolean } {
	const isPositive = percent >= 0;
	const sign = isPositive ? '+' : '';
	return {
		value: `${sign}${percent.toFixed(2)}%`,
		isPositive
	};
}

/**
 * Truncate wallet address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
	if (address.length <= chars * 2 + 3) return address;
	return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d ago`;
	if (hours > 0) return `${hours}h ago`;
	if (minutes > 0) return `${minutes}m ago`;
	return `${seconds}s ago`;
}

/**
 * Generate a random session ID
 */
export function generateSessionId(): string {
	return `vex_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
