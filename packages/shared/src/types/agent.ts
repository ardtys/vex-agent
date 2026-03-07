export type StreamEventType =
	| 'thinking'
	| 'tool_start'
	| 'tool_result'
	| 'approval_required'
	| 'cancelled'
	| 'final'
	| 'error';

export interface StreamEvent {
	type: StreamEventType;
	text?: string;
	tool?: string;
	args?: Record<string, unknown>;
	result?: ToolResult;
	toolCall?: PendingToolCall;
	error?: string;
}

export interface ToolResult {
	success: boolean;
	summary: string;
	data: unknown;
	txSignature?: string;
}

export interface PendingToolCall {
	id: string;
	tool: string;
	args: Record<string, unknown>;
	humanLabel: string;
	estimatedCost?: string;
}

export interface Message {
	role: 'user' | 'assistant' | 'tool' | 'system';
	content: string;
	toolCall?: PendingToolCall;
	toolResult?: ToolResult;
	timestamp: number;
}

export interface ToolDefinition {
	name: string;
	description: string;
	requiresApproval: boolean;
	parameters: Record<string, unknown>;
}

export const REQUIRES_APPROVAL = [
	'swap_token',
	'launch_token',
	'buy_pump',
	'sell_pump',
	'send_sol'
] as const;

export type ApprovalRequiredTool = (typeof REQUIRES_APPROVAL)[number];
