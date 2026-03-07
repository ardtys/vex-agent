import type { Context, Next } from 'hono';
import { PublicKey } from '@solana/web3.js';
import { AuthError, ValidationError } from '../lib/errors.js';

export interface WalletAuthContext {
	walletAddress: string;
	publicKey: PublicKey;
}

export async function walletAuthMiddleware(c: Context, next: Next) {
	const walletAddress = c.req.header('x-wallet-address');

	if (!walletAddress) {
		throw new AuthError('Wallet address required');
	}

	// Validate the public key format
	try {
		const publicKey = new PublicKey(walletAddress);
		c.set('wallet', {
			walletAddress,
			publicKey
		} as WalletAuthContext);
	} catch {
		throw new ValidationError('Invalid wallet address format');
	}

	return next();
}

export function getWalletContext(c: Context): WalletAuthContext {
	const wallet = c.get('wallet') as WalletAuthContext | undefined;
	if (!wallet) {
		throw new AuthError('Wallet context not found');
	}
	return wallet;
}
