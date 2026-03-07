import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';
import { ValidationError } from '../lib/errors.js';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';
import { runAgentLoop, handleApproval } from '../agent/core.js';
import type { StreamEvent, WalletContext, Message } from '@vex/shared';

const agent = new Hono();

// In-memory session store (replace with Redis in production)
const sessions = new Map<string, Message[]>();

const chatRequestSchema = z.object({
	message: z.string().min(1).max(2000),
	sessionId: z.string().min(1)
});

// POST /agent/chat - Main SSE streaming endpoint
agent.post('/chat', rateLimitMiddleware, async (c) => {
	const body = await c.req.json();
	const parsed = chatRequestSchema.safeParse(body);

	if (!parsed.success) {
		throw new ValidationError(parsed.error.issues[0]?.message || 'Invalid request');
	}

	const { message, sessionId } = parsed.data;

	// Get or create session history
	const history = sessions.get(sessionId) || [];

	// Build empty wallet context (wallet connection disabled)
	const agentWalletCtx: WalletContext = {
		publicKey: 'guest',
		solBalance: 0,
		solUsd: 0,
		topHoldings: [],
		totalPortfolioUsd: 0
	};

	return streamSSE(c, async (stream) => {
		try {
			for await (const event of runAgentLoop(message, agentWalletCtx, history)) {
				await stream.writeSSE({
					event: event.type,
					data: JSON.stringify(event)
				});
			}

			// Update session history after completion
			sessions.set(sessionId, history);
		} catch (error) {
			console.error('Agent error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			await stream.writeSSE({
				event: 'error',
				data: JSON.stringify({
					type: 'error',
					error: errorMessage
				} satisfies StreamEvent)
			});
		}
	});
});

// POST /agent/approve - Handle approval for tool execution
const approvalSchema = z.object({
	toolCallId: z.string().min(1),
	approved: z.boolean(),
	signature: z.string().optional()
});

agent.post('/approve', rateLimitMiddleware, async (c) => {
	const body = await c.req.json();
	const parsed = approvalSchema.safeParse(body);

	if (!parsed.success) {
		throw new ValidationError(parsed.error.issues[0]?.message || 'Invalid request');
	}

	const { toolCallId, approved, signature } = parsed.data;

	// Build empty wallet context (wallet connection disabled)
	const agentWalletCtx: WalletContext = {
		publicKey: 'guest',
		solBalance: 0,
		solUsd: 0,
		topHoldings: [],
		totalPortfolioUsd: 0
	};

	const events = await handleApproval(toolCallId, approved, signature, agentWalletCtx);

	return c.json({
		success: true,
		toolCallId,
		approved,
		events
	});
});

// DELETE /agent/session/:id - Clear session history
agent.delete('/session/:id', rateLimitMiddleware, async (c) => {
	const sessionId = c.req.param('id');
	sessions.delete(sessionId);
	return c.json({ success: true, sessionId });
});

export { agent };
