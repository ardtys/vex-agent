import { getEnv } from '../lib/env.js';
import { ExternalServiceError } from '../lib/errors.js';
import type { ToolDefinition } from '@vex/shared';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string;
	tool_calls?: ToolCall[];
	tool_call_id?: string;
	name?: string;
}

export interface ToolCall {
	id: string;
	type: 'function';
	function: {
		name: string;
		arguments: string;
	};
}

export interface StreamChunk {
	type: 'text' | 'tool_call' | 'done';
	text?: string;
	toolCall?: ToolCall;
	finishReason?: string;
}

export interface OpenRouterTool {
	type: 'function';
	function: {
		name: string;
		description: string;
		parameters: Record<string, unknown>;
	};
}

function convertToOpenRouterTools(tools: ToolDefinition[]): OpenRouterTool[] {
	return tools.map((tool) => ({
		type: 'function' as const,
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.parameters
		}
	}));
}

export async function* streamCompletion(
	messages: ChatMessage[],
	tools?: ToolDefinition[]
): AsyncGenerator<StreamChunk> {
	const env = getEnv();

	const body: Record<string, unknown> = {
		model: env.OPENROUTER_MODEL,
		messages,
		stream: true,
		temperature: 0.7,
		max_tokens: 4096
	};

	if (tools && tools.length > 0) {
		body.tools = convertToOpenRouterTools(tools);
		body.tool_choice = 'auto';
	}

	const response = await fetch(OPENROUTER_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
			'HTTP-Referer': 'https://vex.app',
			'X-Title': 'VEX'
		},
		body: JSON.stringify(body)
	}) as globalThis.Response;

	if (!response.ok) {
		const error = await response.text();
		throw new ExternalServiceError(`OpenRouter error: ${error}`, 'openrouter');
	}

	const reader = response.body?.getReader();
	if (!reader) {
		throw new ExternalServiceError('No response body', 'openrouter');
	}

	const decoder = new TextDecoder();
	let buffer = '';
	let currentToolCall: Partial<ToolCall> | null = null;
	let toolCallArgumentsBuffer = '';

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (!line.startsWith('data: ')) continue;
				const data = line.slice(6).trim();
				if (data === '[DONE]') {
					if (currentToolCall && currentToolCall.id) {
						yield {
							type: 'tool_call',
							toolCall: {
								id: currentToolCall.id,
								type: 'function',
								function: {
									name: currentToolCall.function?.name || '',
									arguments: toolCallArgumentsBuffer
								}
							}
						};
					}
					yield { type: 'done' };
					return;
				}

				try {
					const parsed = JSON.parse(data);
					const delta = parsed.choices?.[0]?.delta;
					const finishReason = parsed.choices?.[0]?.finish_reason;

					if (delta?.content) {
						yield { type: 'text', text: delta.content };
					}

					if (delta?.tool_calls) {
						for (const tc of delta.tool_calls) {
							if (tc.id) {
								// New tool call starting
								if (currentToolCall && currentToolCall.id) {
									yield {
										type: 'tool_call',
										toolCall: {
											id: currentToolCall.id,
											type: 'function',
											function: {
												name: currentToolCall.function?.name || '',
												arguments: toolCallArgumentsBuffer
											}
										}
									};
								}
								currentToolCall = {
									id: tc.id,
									type: 'function',
									function: { name: tc.function?.name || '', arguments: '' }
								};
								toolCallArgumentsBuffer = tc.function?.arguments || '';
							} else if (tc.function?.arguments) {
								toolCallArgumentsBuffer += tc.function.arguments;
							}
							if (tc.function?.name && currentToolCall?.function) {
								currentToolCall.function.name = tc.function.name;
							}
						}
					}

					if (finishReason === 'tool_calls' && currentToolCall && currentToolCall.id) {
						yield {
							type: 'tool_call',
							toolCall: {
								id: currentToolCall.id,
								type: 'function',
								function: {
									name: currentToolCall.function?.name || '',
									arguments: toolCallArgumentsBuffer
								}
							}
						};
						currentToolCall = null;
						toolCallArgumentsBuffer = '';
					}

					if (finishReason === 'stop') {
						yield { type: 'done', finishReason: 'stop' };
						return;
					}
				} catch {
					// Skip malformed JSON
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}

export async function complete(
	messages: ChatMessage[],
	tools?: ToolDefinition[]
): Promise<{ content: string; toolCalls?: ToolCall[] }> {
	const env = getEnv();

	const body: Record<string, unknown> = {
		model: env.OPENROUTER_MODEL,
		messages,
		temperature: 0.7,
		max_tokens: 4096
	};

	if (tools && tools.length > 0) {
		body.tools = convertToOpenRouterTools(tools);
		body.tool_choice = 'auto';
	}

	const response = await fetch(OPENROUTER_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
			'HTTP-Referer': 'https://vex.app',
			'X-Title': 'VEX'
		},
		body: JSON.stringify(body)
	}) as globalThis.Response;

	if (!response.ok) {
		const error = await response.text();
		throw new ExternalServiceError(`OpenRouter error: ${error}`, 'openrouter');
	}

	const data = (await response.json()) as {
		choices?: Array<{
			message?: {
				content?: string;
				tool_calls?: ToolCall[];
			};
		}>;
	};
	const choice = data.choices?.[0];

	return {
		content: choice?.message?.content || '',
		toolCalls: choice?.message?.tool_calls
	};
}
