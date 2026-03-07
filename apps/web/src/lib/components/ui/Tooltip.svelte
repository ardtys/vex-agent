<script lang="ts">
	export let text: string;
	export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
	export let delay: number = 200;

	let visible = false;
	let timeout: ReturnType<typeof setTimeout>;

	function showTooltip() {
		timeout = setTimeout(() => {
			visible = true;
		}, delay);
	}

	function hideTooltip() {
		clearTimeout(timeout);
		visible = false;
	}

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrowClasses = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-vex-surface border-x-transparent border-b-transparent',
		bottom:
			'bottom-full left-1/2 -translate-x-1/2 border-b-vex-surface border-x-transparent border-t-transparent',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-vex-surface border-y-transparent border-r-transparent',
		right:
			'right-full top-1/2 -translate-y-1/2 border-r-vex-surface border-y-transparent border-l-transparent'
	};
</script>

<div class="relative inline-block" on:mouseenter={showTooltip} on:mouseleave={hideTooltip} role="tooltip">
	<slot />

	{#if visible}
		<div
			class="absolute z-50 whitespace-nowrap rounded-lg border border-vex-border bg-vex-surface px-3 py-1.5 text-xs text-vex-white shadow-lg {positionClasses[
				position
			]}"
			role="tooltip"
		>
			{text}
			<div class="absolute border-4 {arrowClasses[position]}"></div>
		</div>
	{/if}
</div>

<style>
	div[role='tooltip'] {
		animation: tooltip-fade-in 0.15s ease-out;
	}

	@keyframes tooltip-fade-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
