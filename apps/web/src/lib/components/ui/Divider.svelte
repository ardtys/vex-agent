<script lang="ts">
	export let orientation: 'horizontal' | 'vertical' = 'horizontal';
	export let variant: 'solid' | 'dashed' | 'gradient' = 'solid';
	export let label: string = '';
</script>

{#if orientation === 'horizontal'}
	<div class="flex w-full items-center gap-4">
		{#if variant === 'gradient'}
			<div class="h-px flex-1 bg-gradient-to-r from-transparent via-vex-border to-transparent"></div>
		{:else}
			<div
				class="h-px flex-1 bg-vex-border"
				class:border-dashed={variant === 'dashed'}
			></div>
		{/if}

		{#if label}
			<span class="font-mono text-xs uppercase tracking-wider text-vex-muted">{label}</span>
			{#if variant === 'gradient'}
				<div class="h-px flex-1 bg-gradient-to-r from-transparent via-vex-border to-transparent"></div>
			{:else}
				<div
					class="h-px flex-1 bg-vex-border"
					class:border-dashed={variant === 'dashed'}
				></div>
			{/if}
		{/if}
	</div>
{:else}
	<div
		class="w-px self-stretch"
		class:bg-vex-border={variant !== 'gradient'}
		class:bg-gradient-to-b={variant === 'gradient'}
		class:from-transparent={variant === 'gradient'}
		class:via-vex-border={variant === 'gradient'}
		class:to-transparent={variant === 'gradient'}
	></div>
{/if}
