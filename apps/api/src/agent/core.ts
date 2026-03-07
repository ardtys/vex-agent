import type { StreamEvent, WalletContext, Message, PendingToolCall } from '@vex/shared';
import { streamCompletion, type ChatMessage } from '../services/openrouter.js';
import { buildSystemPrompt } from './prompt.js';
import { getAllToolDefinitions, executeTool, requiresApproval } from './tools/index.js';

const MAX_TOOL_CALLS = 10;

interface AgentLoopContext {
	walletContext: WalletContext;
	conversationHistory: Message[];
	pendingApprovals: Map<string, PendingToolCall>;
}

function messagesToChatMessages(messages: Message[], systemPrompt: string): ChatMessage[] {
	const chatMessages: ChatMessage[] = [{ role: 'system', content: systemPrompt }];

	for (const msg of messages) {
		if (msg.role === 'user' || msg.role === 'assistant') {
			chatMessages.push({ role: msg.role, content: msg.content });
		} else if (msg.role === 'tool' && msg.toolResult) {
			chatMessages.push({
				role: 'tool',
				content: JSON.stringify(msg.toolResult.data),
				tool_call_id: msg.toolCall?.id || '',
				name: msg.toolCall?.tool || ''
			});
		}
	}

	return chatMessages;
}

function parseToolArgs(argsString: string): Record<string, unknown> {
	try {
		return JSON.parse(argsString);
	} catch {
		return {};
	}
}

function formatHumanLabel(toolName: string, args: Record<string, unknown>): string {
	switch (toolName) {
		case 'swap_token':
			return `Swap ${args.amount} ${args.inputMint} → ${args.outputMint}`;
		case 'send_sol':
			return `Send ${args.amountSol} SOL to ${String(args.recipient).slice(0, 8)}...`;
		case 'launch_token':
			return `Launch token: ${args.name} (${args.symbol})`;
		case 'buy_pump':
			return `Buy ${args.amount} SOL worth of ${args.mint}`;
		case 'sell_pump':
			return `Sell ${args.percent}% of ${args.mint}`;
		default:
			return `Execute ${toolName}`;
	}
}

function formatEstimatedCost(
	toolName: string,
	args: Record<string, unknown>,
	ctx: WalletContext
): string | undefined {
	switch (toolName) {
		case 'swap_token': {
			if (args.inputMint === 'SOL' || args.inputMint === 'So11111111111111111111111111111111111111112') {
				const amountSol = (args.amount as number) / 1_000_000_000;
				const usdEstimate = amountSol * (ctx.solUsd / ctx.solBalance);
				return `~${amountSol.toFixed(4)} SOL (~$${usdEstimate.toFixed(2)}) + fees`;
			}
			return undefined;
		}
		case 'send_sol': {
			const amount = args.amountSol as number;
			const usdEstimate = amount * (ctx.solUsd / ctx.solBalance);
			return `${amount} SOL (~$${usdEstimate.toFixed(2)}) + 0.000005 SOL fee`;
		}
		case 'buy_pump':
			return `${args.amount} SOL + fees`;
		default:
			return undefined;
	}
}

export async function* runAgentLoop(
	userMessage: string,
	walletContext: WalletContext,
	conversationHistory: Message[]
): AsyncGenerator<StreamEvent> {
	const context: AgentLoopContext = {
		walletContext,
		conversationHistory: [...conversationHistory],
		pendingApprovals: new Map()
	};

	// Add user message to history
	context.conversationHistory.push({
		role: 'user',
		content: userMessage,
		timestamp: Date.now()
	});

	const systemPrompt = buildSystemPrompt(walletContext);
	const tools = getAllToolDefinitions();

	let toolCallCount = 0;
	let continueLoop = true;

	while (continueLoop && toolCallCount < MAX_TOOL_CALLS) {
		const chatMessages = messagesToChatMessages(context.conversationHistory, systemPrompt);

		let currentText = '';
		let hasToolCall = false;

		for await (const chunk of streamCompletion(chatMessages, tools)) {
			if (chunk.type === 'text' && chunk.text) {
				currentText += chunk.text;
				yield { type: 'thinking', text: chunk.text };
			}

			if (chunk.type === 'tool_call' && chunk.toolCall) {
				hasToolCall = true;
				toolCallCount++;

				const toolCall = chunk.toolCall;
				const args = parseToolArgs(toolCall.function.arguments);
				const toolName = toolCall.function.name;

				// Check if this tool requires approval
				if (requiresApproval(toolName)) {
					const pendingCall: PendingToolCall = {
						id: toolCall.id,
						tool: toolName,
						args,
						humanLabel: formatHumanLabel(toolName, args),
						estimatedCost: formatEstimatedCost(toolName, args, walletContext)
					};

					context.pendingApprovals.set(toolCall.id, pendingCall);

					yield {
						type: 'approval_required',
						toolCall: pendingCall
					};

					// For now, auto-reject pending approvals in the loop
					// Real implementation would wait for user approval
					yield { type: 'cancelled' };

					// Add assistant message with the text so far
					if (currentText) {
						context.conversationHistory.push({
							role: 'assistant',
							content: currentText,
							timestamp: Date.now()
						});
					}

					continueLoop = false;
					break;
				}

				// Execute tool without approval
				yield {
					type: 'tool_start',
					tool: toolName,
					args
				};

				const result = await executeTool(toolName, args, walletContext);

				yield {
					type: 'tool_result',
					tool: toolName,
					result
				};

				// Add assistant message if there was text before the tool call
				if (currentText) {
					context.conversationHistory.push({
						role: 'assistant',
						content: currentText,
						timestamp: Date.now()
					});
					currentText = '';
				}

				// Add tool result to history
				context.conversationHistory.push({
					role: 'tool',
					content: JSON.stringify(result.data),
					toolCall: {
						id: toolCall.id,
						tool: toolName,
						args,
						humanLabel: formatHumanLabel(toolName, args)
					},
					toolResult: result,
					timestamp: Date.now()
				});
			}

			if (chunk.type === 'done') {
				if (!hasToolCall) {
					// Final response with no tool calls
					if (currentText) {
						context.conversationHistory.push({
							role: 'assistant',
							content: currentText,
							timestamp: Date.now()
						});
						yield { type: 'final', text: currentText };
					}
					continueLoop = false;
				}
				break;
			}
		}

		// If we had tool calls but no final response, continue the loop
		if (hasToolCall && continueLoop) {
			// Continue to let the model process tool results
			continue;
		}

		if (!hasToolCall) {
			continueLoop = false;
		}
	}

	if (toolCallCount >= MAX_TOOL_CALLS) {
		yield {
			type: 'error',
			error: 'Maximum tool calls exceeded. Please simplify your request.'
		};
	}
}

export async function handleApproval(
	_toolCallId: string,
	approved: boolean,
	signature?: string,
	_walletContext?: WalletContext
): Promise<StreamEvent[]> {
	// This would be called when user approves/rejects a pending tool call
	// For now, just return a simple response
	const events: StreamEvent[] = [];

	if (!approved) {
		events.push({
			type: 'cancelled'
		});
		events.push({
			type: 'final',
			text: 'Transaction cancelled by user.'
		});
	} else if (signature) {
		events.push({
			type: 'final',
			text: `Transaction submitted! View on Solscan: https://solscan.io/tx/${signature}`
		});
	}

	return events;
}
