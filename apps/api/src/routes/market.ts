import { Hono } from 'hono';
import { z } from 'zod';
import { PublicKey } from '@solana/web3.js';
import { ValidationError } from '../lib/errors.js';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';
import * as dexscreener from '../services/dexscreener.js';

const market = new Hono();

const mintSchema = z.string().refine(
	(val) => {
		try {
			new PublicKey(val);
			return true;
		} catch {
			return false;
		}
	},
	{ message: 'Invalid token mint address' }
);

// GET /market/trending - Get trending tokens
market.get('/trending', rateLimitMiddleware, async (c) => {
	const timeframe = c.req.query('timeframe') || '24h';
	const limit = parseInt(c.req.query('limit') || '10', 10);

	const trending = await dexscreener.getTrending(timeframe, Math.min(limit, 20));
	return c.json({ trending, timeframe });
});

// GET /market/gainers - Get top gainers
market.get('/gainers', rateLimitMiddleware, async (c) => {
	const timeframe = c.req.query('timeframe') || '24h';
	const limit = parseInt(c.req.query('limit') || '10', 10);

	const gainers = await dexscreener.getTopGainers(timeframe, Math.min(limit, 20));
	return c.json({ gainers, timeframe });
});

// GET /market/token/:mint - Get token data
market.get('/token/:mint', rateLimitMiddleware, async (c) => {
	const mint = c.req.param('mint');
	const parsed = mintSchema.safeParse(mint);

	if (!parsed.success) {
		throw new ValidationError('Invalid token mint address');
	}

	const tokenData = await dexscreener.getTokenData(mint);

	if (!tokenData) {
		return c.json({ error: 'Token not found' }, 404);
	}

	return c.json(tokenData);
});

// GET /market/price/:mint - Get token price
market.get('/price/:mint', rateLimitMiddleware, async (c) => {
	const mint = c.req.param('mint');
	const parsed = mintSchema.safeParse(mint);

	if (!parsed.success) {
		throw new ValidationError('Invalid token mint address');
	}

	const price = await dexscreener.getTokenPrice(mint);

	if (!price) {
		return c.json({ error: 'Price not found' }, 404);
	}

	return c.json({ mint, ...price });
});

// GET /market/sol-price - Get SOL price
market.get('/sol-price', rateLimitMiddleware, async (c) => {
	const price = await dexscreener.getSolPrice();
	return c.json({ price, symbol: 'SOL' });
});

export { market };
