<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let variant: 'spinner' | 'dots' | 'pulse' | 'bars' = 'spinner';
	export let color: 'lime' | 'white' | 'muted' = 'lime';

	const sizes = {
		sm: 16,
		md: 24,
		lg: 32,
		xl: 48
	};

	const colors = {
		lime: '#c8ff00',
		white: '#f0ede6',
		muted: '#555555'
	};
</script>

{#if variant === 'spinner'}
	<svg
		width={sizes[size]}
		height={sizes[size]}
		viewBox="0 0 24 24"
		class="animate-spin"
		fill="none"
	>
		<circle cx="12" cy="12" r="10" stroke={colors[color]} stroke-width="2" opacity="0.2" />
		<path
			d="M12 2a10 10 0 0 1 10 10"
			stroke={colors[color]}
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
{:else if variant === 'dots'}
	<div class="flex items-center gap-1">
		{#each [0, 1, 2] as i}
			<div
				class="rounded-full"
				style="
					width: {sizes[size] / 3}px;
					height: {sizes[size] / 3}px;
					background-color: {colors[color]};
					animation: bounce-dot 1.4s ease-in-out infinite;
					animation-delay: {i * 0.16}s;
				"
			></div>
		{/each}
	</div>
{:else if variant === 'pulse'}
	<div class="relative" style="width: {sizes[size]}px; height: {sizes[size]}px;">
		<div
			class="absolute inset-0 rounded-full animate-ping"
			style="background-color: {colors[color]}; opacity: 0.4;"
		></div>
		<div
			class="absolute inset-2 rounded-full"
			style="background-color: {colors[color]};"
		></div>
	</div>
{:else if variant === 'bars'}
	<div class="flex items-end gap-0.5" style="height: {sizes[size]}px;">
		{#each [0, 1, 2, 3, 4] as i}
			<div
				class="rounded-sm"
				style="
					width: {sizes[size] / 6}px;
					background-color: {colors[color]};
					animation: bar-scale 1s ease-in-out infinite;
					animation-delay: {i * 0.1}s;
				"
			></div>
		{/each}
	</div>
{/if}

<style>
	@keyframes bounce-dot {
		0%,
		80%,
		100% {
			transform: scale(0.6);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes bar-scale {
		0%,
		40%,
		100% {
			height: 40%;
		}
		20% {
			height: 100%;
		}
	}
</style>
