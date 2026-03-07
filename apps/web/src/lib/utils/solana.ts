import { PublicKey } from '@solana/web3.js';

/**
 * Validate a Solana public key
 */
export function isValidPublicKey(address: string): boolean {
	try {
		new PublicKey(address);
		return true;
	} catch {
		return false;
	}
}

/**
 * Convert address to PublicKey, returns null if invalid
 */
export function toPublicKey(address: string): PublicKey | null {
	try {
		return new PublicKey(address);
	} catch {
		return null;
	}
}

/**
 * Native SOL mint address
 */
export const SOL_MINT = 'So11111111111111111111111111111111111111112';

/**
 * Check if mint is native SOL
 */
export function isNativeSol(mint: string): boolean {
	return mint === SOL_MINT || mint.toUpperCase() === 'SOL';
}

/**
 * Get Solscan URL for transaction
 */
export function getSolscanTxUrl(signature: string): string {
	return `https://solscan.io/tx/${signature}`;
}

/**
 * Get Solscan URL for token
 */
export function getSolscanTokenUrl(mint: string): string {
	return `https://solscan.io/token/${mint}`;
}

/**
 * Get Solscan URL for wallet
 */
export function getSolscanWalletUrl(address: string): string {
	return `https://solscan.io/account/${address}`;
}
