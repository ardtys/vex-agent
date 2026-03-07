import { z } from 'zod';

// Helper to transform empty strings to undefined
const optionalString = z.string().transform((val) => (val === '' ? undefined : val)).pipe(z.string().optional());
const optionalUrl = z.string().transform((val) => (val === '' ? undefined : val)).pipe(z.string().url().optional());

const envSchema = z.object({
	// Solana
	HELIUS_API_KEY: z.string().min(1),
	HELIUS_RPC_URL: z.string().url(),

	// AI
	OPENROUTER_API_KEY: z.string().min(1),
	OPENROUTER_MODEL: z.string().default('qwen/qwen-2.5-72b-instruct'),

	// Market Data
	BIRDEYE_API_KEY: z.string().min(1),

	// Optional
	TWITTER_BEARER_TOKEN: optionalString,
	PUMPFUN_PRIVATE_KEY: optionalString,

	// Session / Rate Limiting
	UPSTASH_REDIS_REST_URL: optionalUrl,
	UPSTASH_REDIS_REST_TOKEN: optionalString,

	// Security
	CORS_ORIGIN: z.string().default('http://localhost:5173'),
	JWT_SECRET: optionalString,

	// Environment
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.coerce.number().default(3001)
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
	if (cachedEnv) return cachedEnv;

	const parsed = envSchema.safeParse(process.env);

	if (!parsed.success) {
		console.error('Invalid environment variables:');
		console.error(parsed.error.format());
		throw new Error('Invalid environment variables');
	}

	cachedEnv = parsed.data;
	return cachedEnv;
}

export function isDev(): boolean {
	return getEnv().NODE_ENV === 'development';
}

export function isProd(): boolean {
	return getEnv().NODE_ENV === 'production';
}
