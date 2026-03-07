import type { Context, Next } from 'hono';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getEnv } from '../lib/env.js';
import { RateLimitError } from '../lib/errors.js';

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
	if (ratelimit) return ratelimit;

	const env = getEnv();
	if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
		return null;
	}

	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN
	});

	ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(10, '1 m'),
		analytics: true,
		prefix: 'vex:ratelimit'
	});

	return ratelimit;
}

export async function rateLimitMiddleware(c: Context, next: Next) {
	const rl = getRatelimit();

	// Skip rate limiting if Redis is not configured (dev mode)
	if (!rl) {
		return next();
	}

	// Use wallet address or IP as identifier
	const walletAddress = c.req.header('x-wallet-address');
	const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
	const identifier = walletAddress || ip;

	const { success, limit, remaining, reset } = await rl.limit(identifier);

	c.header('X-RateLimit-Limit', limit.toString());
	c.header('X-RateLimit-Remaining', remaining.toString());
	c.header('X-RateLimit-Reset', reset.toString());

	if (!success) {
		throw new RateLimitError('Rate limit exceeded. Try again in a minute.');
	}

	return next();
}
