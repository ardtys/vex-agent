<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'text' | 'email' | 'password' | 'number' | 'search' = 'text';
	export let value: string = '';
	export let placeholder: string = '';
	export let label: string = '';
	export let error: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let icon: string | undefined = undefined;

	const dispatch = createEventDispatcher<{
		input: string;
		focus: void;
		blur: void;
	}>();

	let focused = false;

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		dispatch('input', value);
	}
</script>

<div class="w-full">
	{#if label}
		<label class="mb-1.5 block font-mono text-xs uppercase tracking-wider text-vex-muted">
			{label}
			{#if required}
				<span class="text-vex-red">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative">
		{#if icon}
			<span class="absolute left-3 top-1/2 -translate-y-1/2 text-vex-muted">
				{icon}
			</span>
		{/if}

		<input
			{type}
			{value}
			{placeholder}
			{disabled}
			{required}
			on:input={handleInput}
			on:focus={() => {
				focused = true;
				dispatch('focus');
			}}
			on:blur={() => {
				focused = false;
				dispatch('blur');
			}}
			class="w-full rounded-lg border bg-vex-surface/50 px-4 py-2.5 font-mono text-sm text-vex-white placeholder-vex-muted/50 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			class:pl-10={icon}
			class:border-vex-border={!focused && !error}
			class:border-vex-lime={focused && !error}
			class:shadow-[0_0_0_2px_rgba(200,255,0,0.1)]={focused && !error}
			class:border-vex-red={error}
			class:shadow-[0_0_0_2px_rgba(255,45,45,0.1)]={error}
		/>

		<!-- Focus glow line -->
		<div
			class="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-vex-lime transition-all duration-300"
			class:w-full={focused}
		></div>
	</div>

	{#if error}
		<p class="mt-1.5 font-mono text-xs text-vex-red">{error}</p>
	{/if}
</div>
