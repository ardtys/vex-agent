<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let disabled = false;
	export let placeholder = 'tell vex what to do...';

	const dispatch = createEventDispatcher<{ send: string }>();

	let input = '';
	let textarea: HTMLTextAreaElement;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}

	function handleSend() {
		const trimmed = input.trim();
		if (!trimmed || disabled) return;

		dispatch('send', trimmed);
		input = '';

		// Reset textarea height
		if (textarea) {
			textarea.style.height = 'auto';
		}
	}

	function handleInput() {
		// Auto-resize textarea
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
		}
	}
</script>

<div class="flex items-end gap-2">
	<textarea
		bind:this={textarea}
		bind:value={input}
		on:keydown={handleKeydown}
		on:input={handleInput}
		{placeholder}
		{disabled}
		rows="1"
		class="input flex-1 resize-none min-h-[42px] max-h-[200px]"
		class:opacity-50={disabled}
	></textarea>
	<button
		on:click={handleSend}
		{disabled}
		class="btn btn-primary h-[42px] w-[42px] flex items-center justify-center"
		class:opacity-50={disabled}
	>
		{#if disabled}
			<span class="animate-pulse">...</span>
		{:else}
			<span class="text-lg">→</span>
		{/if}
	</button>
</div>
