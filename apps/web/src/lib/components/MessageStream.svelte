<script lang="ts">
	import { session, messages, isStreaming } from '$lib/stores/session';
	import ToolEvent from './ToolEvent.svelte';
	import type { StreamEvent } from '@vex/shared';

	// Tool icons mapping
	const toolIcons: Record<string, string> = {
		swap_token: '⇄',
		launch_token: '◈',
		get_trending: '↑',
		check_rug_risk: '⊘',
		get_pnl: 'Σ',
		get_portfolio: '◎',
		get_token_data: '◉',
		send_sol: '→',
		buy_pump: '▲',
		sell_pump: '▼'
	};

	function getToolIcon(tool: string): string {
		return toolIcons[tool] || '•';
	}
</script>

<div class="space-y-4">
	{#each $messages as message (message.id)}
		<div class="space-y-2">
			{#if message.role === 'user'}
				<!-- User message -->
				<div class="flex justify-end">
					<div class="bg-vex-surface border border-vex-border px-4 py-2 max-w-[80%]">
						<p class="text-vex-white whitespace-pre-wrap">{message.content}</p>
					</div>
				</div>
			{:else}
				<!-- Assistant message -->
				<div class="space-y-2">
					<!-- Tool events -->
					{#if message.events}
						{#each message.events as event}
							{#if event.type === 'tool_start' && event.tool}
								<ToolEvent
									tool={event.tool}
									icon={getToolIcon(event.tool)}
									status="running"
									args={event.args}
								/>
							{:else if event.type === 'tool_result' && event.tool}
								<ToolEvent
									tool={event.tool}
									icon={getToolIcon(event.tool)}
									status={event.result?.success ? 'done' : 'error'}
									result={event.result}
								/>
							{/if}
						{/each}
					{/if}

					<!-- Message content -->
					{#if message.content}
						<div class="text-vex-white">
							<p class="whitespace-pre-wrap">{message.content}</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/each}

	<!-- Current streaming content -->
	{#if $isStreaming}
		<div class="space-y-2">
			<!-- Show current tool events from session store -->
			{#each $session.currentStreamEvents as event}
				{#if event.type === 'tool_start' && event.tool}
					<ToolEvent
						tool={event.tool}
						icon={getToolIcon(event.tool)}
						status="running"
						args={event.args}
					/>
				{:else if event.type === 'tool_result' && event.tool}
					<ToolEvent
						tool={event.tool}
						icon={getToolIcon(event.tool)}
						status={event.result?.success ? 'done' : 'error'}
						result={event.result}
					/>
				{/if}
			{/each}

			<!-- Streaming text -->
			{#if $session.currentStreamText}
				<div class="text-vex-muted">
					<p class="whitespace-pre-wrap">{$session.currentStreamText}<span class="animate-blink">▋</span></p>
				</div>
			{:else}
				<div class="text-vex-muted animate-pulse">
					Thinking...
				</div>
			{/if}
		</div>
	{/if}
</div>
