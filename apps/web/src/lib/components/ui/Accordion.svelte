<script lang="ts">
	import { slide } from 'svelte/transition';

	export let title: string;
	export let open: boolean = false;
	export let icon: string | undefined = undefined;

	function toggle() {
		open = !open;
	}
</script>

<div class="border-b border-vex-border">
	<button
		on:click={toggle}
		class="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-vex-lime"
	>
		<div class="flex items-center gap-3">
			{#if icon}
				<span class="text-vex-lime">{icon}</span>
			{/if}
			<span class="font-mono text-sm text-vex-white">{title}</span>
		</div>
		<svg
			class="h-4 w-4 text-vex-muted transition-transform duration-200"
			class:rotate-180={open}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	</button>

	{#if open}
		<div transition:slide={{ duration: 200 }} class="pb-4">
			<div class="text-sm text-vex-muted">
				<slot />
			</div>
		</div>
	{/if}
</div>
