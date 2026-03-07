import { writable, derived } from 'svelte/store';
import type { StreamEvent } from '@vex/shared';

interface AgentState {
	activeTool: string | null;
	toolProgress: Map<string, 'running' | 'done' | 'error'>;
	lastEvent: StreamEvent | null;
}

const initialState: AgentState = {
	activeTool: null,
	toolProgress: new Map(),
	lastEvent: null
};

function createAgentStore() {
	const { subscribe, set, update } = writable<AgentState>(initialState);

	return {
		subscribe,

		handleEvent: (event: StreamEvent) => {
			update((s) => {
				const newProgress = new Map(s.toolProgress);

				if (event.type === 'tool_start' && event.tool) {
					newProgress.set(event.tool, 'running');
					return {
						...s,
						activeTool: event.tool,
						toolProgress: newProgress,
						lastEvent: event
					};
				}

				if (event.type === 'tool_result' && event.tool) {
					const status = event.result?.success ? 'done' : 'error';
					newProgress.set(event.tool, status);
					return {
						...s,
						activeTool: null,
						toolProgress: newProgress,
						lastEvent: event
					};
				}

				return {
					...s,
					lastEvent: event
				};
			});
		},

		reset: () => {
			set(initialState);
		}
	};
}

export const agent = createAgentStore();

// Derived stores
export const activeTool = derived(agent, ($agent) => $agent.activeTool);
export const isToolRunning = derived(agent, ($agent) => $agent.activeTool !== null);
