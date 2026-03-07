<script lang="ts">
	export let variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'lime' = 'default';
	export let size: 'sm' | 'md' = 'md';
	export let pulse: boolean = false;
	export let dot: boolean = false;

	const variantClasses = {
		default: 'bg-vex-surface border-vex-border text-vex-muted',
		success: 'bg-vex-success/10 border-vex-success/30 text-vex-success',
		warning: 'bg-vex-warning/10 border-vex-warning/30 text-vex-warning',
		error: 'bg-vex-red/10 border-vex-red/30 text-vex-red',
		info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
		lime: 'bg-vex-lime/10 border-vex-lime/30 text-vex-lime'
	};

	const dotColors = {
		default: 'bg-vex-muted',
		success: 'bg-vex-success',
		warning: 'bg-vex-warning',
		error: 'bg-vex-red',
		info: 'bg-blue-400',
		lime: 'bg-vex-lime'
	};

	const sizeClasses = {
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-2 py-1 text-xs'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider {variantClasses[variant]} {sizeClasses[size]}"
>
	{#if dot}
		<span class="relative flex h-1.5 w-1.5">
			{#if pulse}
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 {dotColors[variant]}"
				></span>
			{/if}
			<span class="relative inline-flex h-1.5 w-1.5 rounded-full {dotColors[variant]}"></span>
		</span>
	{/if}
	<slot />
</span>
