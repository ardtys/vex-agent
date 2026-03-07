<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let value: number = 0;
	export let max: number = 100;
	export let showLabel: boolean = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let variant: 'lime' | 'gradient' | 'success' | 'warning' | 'error' = 'lime';
	export let animated: boolean = true;
	export let striped: boolean = false;

	const progress = tweened(0, {
		duration: animated ? 800 : 0,
		easing: cubicOut
	});

	$: percentage = Math.min(Math.max((value / max) * 100, 0), 100);
	$: progress.set(percentage);

	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3'
	};

	const variantClasses = {
		lime: 'bg-vex-lime',
		gradient: 'bg-gradient-to-r from-vex-lime via-green-400 to-cyan-400',
		success: 'bg-vex-success',
		warning: 'bg-vex-warning',
		error: 'bg-vex-red'
	};
</script>

<div class="w-full">
	{#if showLabel}
		<div class="mb-1 flex justify-between">
			<span class="font-mono text-xs text-vex-muted">
				<slot name="label">Progress</slot>
			</span>
			<span class="font-mono text-xs text-vex-lime">{Math.round($progress)}%</span>
		</div>
	{/if}

	<div class="relative w-full overflow-hidden rounded-full bg-vex-surface {sizeClasses[size]}">
		<div
			class="h-full rounded-full transition-all duration-300 {variantClasses[variant]}"
			class:animate-stripe={striped}
			style="width: {$progress}%;"
		>
			{#if striped}
				<div class="h-full w-full bg-stripe opacity-20"></div>
			{/if}
		</div>

		<!-- Glow effect -->
		<div
			class="absolute inset-y-0 left-0 blur-sm {variantClasses[variant]} opacity-50"
			style="width: {$progress}%;"
		></div>
	</div>
</div>

<style>
	.bg-stripe {
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-size: 1rem 1rem;
	}

	.animate-stripe {
		animation: stripe-move 1s linear infinite;
	}

	@keyframes stripe-move {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 1rem 0;
		}
	}
</style>
