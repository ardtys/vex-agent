<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { session } from '$lib/stores/session';
	import type { PendingToolCall } from '@vex/shared';

	export let toolCall: PendingToolCall;

	let countdown = 60;
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				handleReject();
			}
		}, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	async function handleConfirm() {
		// In a real implementation, we would:
		// 1. Get the transaction from the tool result
		// 2. Sign it with the wallet adapter
		// 3. Send the signature back
		// For now, we'll just approve without a signature
		await session.approveToolCall(toolCall.id);
	}

	function handleReject() {
		session.rejectToolCall(toolCall.id);
	}

	// Format args for display
	function formatArgs(args: Record<string, unknown>): string {
		const entries = Object.entries(args).map(([key, value]) => {
			const displayValue = typeof value === 'string' && value.length > 20
				? `${value.slice(0, 8)}...${value.slice(-4)}`
				: value;
			return `${key}: ${displayValue}`;
		});
		return entries.join('\n');
	}
</script>

<div class="bg-vex-surface border-2 border-vex-lime p-4 space-y-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-vex-lime text-lg">⚠</span>
			<span class="font-display text-xl">Approval Required</span>
		</div>
		<span class="text-vex-muted text-sm">{countdown}s</span>
	</div>

	<div class="space-y-2">
		<div class="text-lg text-vex-white">{toolCall.humanLabel}</div>
		{#if toolCall.estimatedCost}
			<div class="text-sm text-vex-lime">Est. cost: {toolCall.estimatedCost}</div>
		{/if}
	</div>

	<div class="bg-vex-black p-2 text-xs text-vex-muted font-mono whitespace-pre-wrap">
		{formatArgs(toolCall.args)}
	</div>

	<div class="flex gap-3">
		<button on:click={handleConfirm} class="btn btn-primary flex-1">
			Confirm & Sign
		</button>
		<button on:click={handleReject} class="btn btn-danger flex-1">
			Cancel
		</button>
	</div>
</div>
