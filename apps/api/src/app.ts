import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { isVexError, formatError } from './lib/errors.js';
import { agent } from './routes/agent.js';
import { wallet } from './routes/wallet.js';
import { market } from './routes/market.js';

export function createApp(corsOrigin: string) {
	const app = new Hono();

	// Parse multiple CORS origins
	const allowedOrigins = corsOrigin.split(',').map(o => o.trim());

	// Middleware
	app.use('*', logger());
	app.use(
		'*',
		cors({
			origin: (origin) => {
				// Allow requests with no origin (like mobile apps or curl)
				if (!origin) return allowedOrigins[0];
				// Check if origin is in allowed list
				if (allowedOrigins.includes(origin)) return origin;
				// Default to first origin
				return allowedOrigins[0];
			},
			allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
			allowHeaders: ['Content-Type', 'x-wallet-address', 'Authorization'],
			exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
			credentials: true
		})
	);

	// Health check
	app.get('/', (c) => {
		return c.json({
			name: 'VEX API',
			version: '0.1.0',
			status: 'operational'
		});
	});

	app.get('/health', (c) => {
		return c.json({ status: 'ok', timestamp: Date.now() });
	});

	// Routes
	app.route('/agent', agent);
	app.route('/wallet', wallet);
	app.route('/market', market);

	// Global error handler
	app.onError((err, c) => {
		console.error('Error:', err);

		if (isVexError(err)) {
			return c.json(formatError(err), err.statusCode as ContentfulStatusCode);
		}

		return c.json(formatError(err), 500);
	});

	// 404 handler
	app.notFound((c) => {
		return c.json({ message: 'Not found', code: 'NOT_FOUND' }, 404);
	});

	return app;
}
