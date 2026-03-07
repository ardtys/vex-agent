<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ select: string }>();

	const examples = [
		"what's in my wallet?",
		"swap 50% of my SOL into the top gainer last 4h",
		"what's my PnL this week, roast me",
		"find safe tokens under 50k mcap trending on CT",
		"check if this token is a rug: [paste CA]",
		"what narrative is printing right now?"
	];

	function handleClick(prompt: string) {
		dispatch('select', prompt);
	}
</script>

<div class="flex flex-col items-center justify-center h-full space-y-8 py-12">
	<div class="text-center space-y-4">
		<h2 class="font-display text-6xl text-vex-lime">VEX</h2>
		<p class="text-vex-muted text-lg">your solana agent. do anything.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full px-4">
		{#each examples as prompt}
			<button
				on:click={() => handleClick(prompt)}
				class="text-left p-4 bg-vex-surface border border-vex-border hover:border-vex-lime transition-colors text-sm text-vex-muted hover:text-vex-white"
			>
				"{prompt}"
			</button>
		{/each}
	</div>

	<p class="text-xs text-vex-muted">click an example or type your own command</p>
</div>
