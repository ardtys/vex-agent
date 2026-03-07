<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let label: string = '';

	const dispatch = createEventDispatcher<{ change: boolean }>();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		dispatch('change', checked);
	}

	const sizes = {
		sm: { track: 'h-4 w-8', thumb: 'h-3 w-3', translate: 'translate-x-4' },
		md: { track: 'h-5 w-10', thumb: 'h-4 w-4', translate: 'translate-x-5' },
		lg: { track: 'h-6 w-12', thumb: 'h-5 w-5', translate: 'translate-x-6' }
	};
</script>

<label class="inline-flex cursor-pointer items-center gap-3" class:cursor-not-allowed={disabled} class:opacity-50={disabled}>
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		{disabled}
		on:click={toggle}
		class="relative inline-flex shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vex-lime/50 {sizes[size].track}"
		class:bg-vex-lime={checked}
		class:bg-vex-surface={!checked}
	>
		<span
			class="pointer-events-none inline-block transform rounded-full shadow-lg transition-transform duration-200 {sizes[size].thumb}"
			class:translate-x-0.5={!checked}
			class:bg-vex-black={checked}
			class:bg-vex-muted={!checked}
			class:translate-x-4={checked && size === 'sm'}
			class:translate-x-5={checked && size === 'md'}
			class:translate-x-6={checked && size === 'lg'}
			style="margin-top: 0.125rem;"
		></span>
	</button>
	{#if label}
		<span class="font-mono text-sm text-vex-white">{label}</span>
	{/if}
</label>
