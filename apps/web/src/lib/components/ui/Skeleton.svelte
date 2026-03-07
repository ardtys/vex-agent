<script lang="ts">
	export let variant: 'text' | 'circular' | 'rectangular' = 'text';
	export let width: string = '100%';
	export let height: string | undefined = undefined;
	export let lines: number = 1;

	const defaultHeights = {
		text: '1rem',
		circular: '2.5rem',
		rectangular: '4rem'
	};

	$: computedHeight = height || defaultHeights[variant];
</script>

{#if variant === 'text' && lines > 1}
	<div class="flex flex-col gap-2" style="width: {width};">
		{#each Array(lines) as _, i}
			<div
				class="animate-pulse rounded bg-gradient-to-r from-vex-surface via-vex-border to-vex-surface"
				style="
					height: {computedHeight};
					width: {i === lines - 1 ? '70%' : '100%'};
					background-size: 200% 100%;
					animation: shimmer 1.5s infinite;
				"
			></div>
		{/each}
	</div>
{:else}
	<div
		class="animate-pulse bg-gradient-to-r from-vex-surface via-vex-border to-vex-surface"
		class:rounded-full={variant === 'circular'}
		class:rounded-lg={variant !== 'circular'}
		style="
			width: {variant === 'circular' ? computedHeight : width};
			height: {computedHeight};
			background-size: 200% 100%;
			animation: shimmer 1.5s infinite;
		"
	></div>
{/if}

<style>
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
