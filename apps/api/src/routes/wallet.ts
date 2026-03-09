import { Hono } from 'hono';
import { z } from 'zod';
import { PublicKey } from '@solana/web3.js';
import { ValidationError } from '../lib/errors.js';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';
import * as helius from '../services/helius.js';
import type { TokenBalance } from '@vex/shared';

const wallet = new Hono();

const pubkeySchema = z.string().refine(
	(val) => {
		try {
			new PublicKey(val);
			return true;
		} catch {
			return false;
		}
	},
	{ message: 'Invalid Solana public key' }
);

// GET /wallet/:pubkey - Get wallet portfolio and context
wallet.get('/:pubkey', rateLimitMiddleware, async (c) => {
	const pubkey = c.req.param('pubkey');
	const parsed = pubkeySchema.safeParse(pubkey);

	if (!parsed.success) {
		throw new ValidationError('Invalid wallet address');
	}

	const walletContext = await helius.getWalletContext(parsed.data);
	return c.json(walletContext);
});

// GET /wallet/:pubkey/pnl - Get PnL data
wallet.get('/:pubkey/pnl', rateLimitMiddleware, async (c) => {
	const pubkey = c.req.param('pubkey');
	const timeframe = c.req.query('timeframe') || '7d';

	const parsed = pubkeySchema.safeParse(pubkey);

	if (!parsed.success) {
		throw new ValidationError('Invalid wallet address');
	}

	const pnl = await helius.getPnL(parsed.data, timeframe);
	return c.json(pnl);
});

// GET /wallet/:pubkey/balances - Get token balances
wallet.get('/:pubkey/balances', rateLimitMiddleware, async (c) => {
	const pubkey = c.req.param('pubkey');
	const parsed = pubkeySchema.safeParse(pubkey);

	if (!parsed.success) {
		throw new ValidationError('Invalid wallet address');
	}

	const walletContext = await helius.getWalletContext(parsed.data);
	const balances: TokenBalance[] = walletContext.topHoldings;

	return c.json({ balances });
});

export { wallet };
