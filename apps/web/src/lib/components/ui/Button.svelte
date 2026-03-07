<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';

	export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let loading: boolean = false;
	export let disabled: boolean = false;
	export let fullWidth: boolean = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';

	const baseClasses =
		'inline-flex items-center justify-center gap-2 font-mono font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses = {
		primary:
			'bg-vex-lime text-vex-black hover:shadow-[4px_4px_0_0_rgba(200,255,0,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none',
		secondary:
			'bg-vex-surface text-vex-white border border-vex-border hover:border-vex-lime/50 hover:bg-vex-surface/80',
		ghost: 'text-vex-muted hover:text-vex-white hover:bg-vex-surface/50',
		danger:
			'bg-vex-red text-vex-white hover:shadow-[4px_4px_0_0_rgba(255,45,45,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5',
		outline:
			'border border-vex-lime text-vex-lime hover:bg-vex-lime/10 hover:shadow-[0_0_20px_rgba(200,255,0,0.2)]'
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};
</script>

<button
	{type}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]}"
	class:w-full={fullWidth}
	disabled={disabled || loading}
	on:click
	on:mouseenter
	on:mouseleave
>
	{#if loading}
		<LoadingSpinner size="sm" color={variant === 'primary' ? 'muted' : 'lime'} />
	{/if}
	<slot />
</button>
