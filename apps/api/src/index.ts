import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from root .env file (for local dev)
const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

import { serve } from '@hono/node-server';
import { getEnv } from './lib/env.js';
import { createApp } from './app.js';

const env = getEnv();
const app = createApp(env.CORS_ORIGIN);

// Start server (local development only)
serve({
	fetch: app.fetch,
	port: env.PORT
}, (info) => {
	console.log(`VEX API running on http://localhost:${info.port}`);
});
