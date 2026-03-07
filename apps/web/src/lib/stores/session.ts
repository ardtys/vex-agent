import { writable, derived } from 'svelte/store';
import type { StreamEvent, PendingToolCall } from '@vex/shared';
import { api } from '$lib/api/client';
import { generateSessionId } from '$lib/utils/format';

export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: number;
	events?: StreamEvent[];
	pendingApproval?: PendingToolCall;
}

interface SessionState {
	sessionId: string;
	messages: ChatMessage[];
	isStreaming: boolean;
	currentStreamText: string;
	currentStreamEvents: StreamEvent[];
	pendingApproval: PendingToolCall | null;
	error: string | null;
}

const initialState: SessionState = {
	sessionId: generateSessionId(),
	messages: [],
	isStreaming: false,
	currentStreamText: '',
	currentStreamEvents: [],
	pendingApproval: null,
	error: null
};

function createSessionStore() {
	const { subscribe, set, update } = writable<SessionState>(initialState);

	let abortStream: (() => void) | null = null;

	return {
		subscribe,

		sendMessage: async (content: string) => {
			// Get current state
			const currentState = await new Promise<SessionState>((resolve) => {
				const unsub = subscribe((s) => {
					resolve(s);
					unsub();
				});
			});

			// Add user message
			const userMessage: ChatMessage = {
				id: `msg_${Date.now()}`,
				role: 'user',
				content,
				timestamp: Date.now()
			};

			update((s) => ({
				...s,
				messages: [...s.messages, userMessage],
				isStreaming: true,
				currentStreamText: '',
				currentStreamEvents: [],
				error: null
			}));

			// Start streaming
			abortStream = api.streamChat(
				content,
				currentState.sessionId,
				(event) => {
					update((s) => {
						const newEvents = [...s.currentStreamEvents, event];
						let newText = s.currentStreamText;
						let pendingApproval = s.pendingApproval;

						if (event.type === 'thinking' && event.text) {
							newText += event.text;
						}

						if (event.type === 'final' && event.text) {
							newText = event.text;
						}

						if (event.type === 'approval_required' && event.toolCall) {
							pendingApproval = event.toolCall;
						}

						if (event.type === 'cancelled') {
							pendingApproval = null;
						}

						return {
							...s,
							currentStreamText: newText,
							currentStreamEvents: newEvents,
							pendingApproval
						};
					});

					// Check if stream is done
					if (event.type === 'final' || event.type === 'error') {
						update((s) => {
							const assistantMessage: ChatMessage = {
								id: `msg_${Date.now()}`,
								role: 'assistant',
								content: s.currentStreamText || event.error || '',
								timestamp: Date.now(),
								events: s.currentStreamEvents
							};

							return {
								...s,
								messages: [...s.messages, assistantMessage],
								isStreaming: false,
								currentStreamText: '',
								currentStreamEvents: [],
								error: event.type === 'error' ? event.error : null
							};
						});
					}
				},
				(error) => {
					update((s) => ({
						...s,
						isStreaming: false,
						error: error.message
					}));
				}
			);
		},

		stopStreaming: () => {
			if (abortStream) {
				abortStream();
				abortStream = null;
			}
			update((s) => ({
				...s,
				isStreaming: false
			}));
		},

		approveToolCall: async (toolCallId: string, signature?: string) => {
			try {
				await api.approveToolCall(toolCallId, true, signature);
				update((s) => ({ ...s, pendingApproval: null }));
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Failed to approve';
				update((s) => ({ ...s, error: message }));
			}
		},

		rejectToolCall: async (toolCallId: string) => {
			try {
				await api.approveToolCall(toolCallId, false);
				update((s) => ({ ...s, pendingApproval: null }));
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Failed to reject';
				update((s) => ({ ...s, error: message }));
			}
		},

		clearSession: async () => {
			const currentState = await new Promise<SessionState>((resolve) => {
				const unsub = subscribe((s) => {
					resolve(s);
					unsub();
				});
			});

			try {
				await api.clearSession(currentState.sessionId);
			} catch {
				// Ignore errors when clearing
			}

			set({
				...initialState,
				sessionId: generateSessionId()
			});
		}
	};
}

export const session = createSessionStore();

// Derived stores
export const isStreaming = derived(session, ($session) => $session.isStreaming);
export const messages = derived(session, ($session) => $session.messages);
export const pendingApproval = derived(session, ($session) => $session.pendingApproval);
