import type { StreamEvent } from '@vex/shared';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiClient {
	private getHeaders(): HeadersInit {
		return {
			'Content-Type': 'application/json'
		};
	}

	// Health check
	async health(): Promise<{ status: string; timestamp: number }> {
		const res = await fetch(`${API_BASE}/health`);
		return res.json();
	}

	// Agent chat - returns EventSource for SSE
	streamChat(
		message: string,
		sessionId: string,
		onEvent: (event: StreamEvent) => void,
		onError?: (error: Error) => void
	): () => void {
		const controller = new AbortController();

		const fetchStream = async () => {
			try {
				const res = await fetch(`${API_BASE}/agent/chat`, {
					method: 'POST',
					headers: this.getHeaders(),
					body: JSON.stringify({ message, sessionId }),
					signal: controller.signal
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || 'Chat request failed');
				}

				const reader = res.body?.getReader();
				if (!reader) throw new Error('No response body');

				const decoder = new TextDecoder();
				let buffer = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');
					buffer = lines.pop() || '';

					for (const line of lines) {
						if (line.startsWith('data: ')) {
							try {
								const event = JSON.parse(line.slice(6)) as StreamEvent;
								onEvent(event);
							} catch {
								// Skip malformed JSON
							}
						}
					}
				}
			} catch (error) {
				if (error instanceof Error && error.name !== 'AbortError') {
					onError?.(error);
				}
			}
		};

		fetchStream();

		// Return abort function
		return () => controller.abort();
	}

	// Approve tool execution
	async approveToolCall(
		toolCallId: string,
		approved: boolean,
		signature?: string
	): Promise<{ success: boolean; events: StreamEvent[] }> {
		const res = await fetch(`${API_BASE}/agent/approve`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify({ toolCallId, approved, signature })
		});
		if (!res.ok) throw new Error('Failed to approve tool call');
		return res.json();
	}

	// Clear session
	async clearSession(sessionId: string): Promise<void> {
		const res = await fetch(`${API_BASE}/agent/session/${sessionId}`, {
			method: 'DELETE',
			headers: this.getHeaders()
		});
		if (!res.ok) throw new Error('Failed to clear session');
	}
}

export const api = new ApiClient();
