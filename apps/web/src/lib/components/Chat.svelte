<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { session, messages, isStreaming, pendingApproval } from '$lib/stores/session';
	import MessageStream from './MessageStream.svelte';
	import ChatInput from './ChatInput.svelte';
	import ApprovalGate from './ApprovalGate.svelte';
	import EmptyState from './EmptyState.svelte';

	let messagesContainer: HTMLDivElement;
	let autoScroll = true;

	// Auto-scroll to bottom when new messages arrive
	$: if ($messages.length > 0 || $isStreaming) {
		tick().then(() => {
			if (autoScroll && messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		});
	}

	function handleScroll() {
		if (!messagesContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		// If user scrolls up more than 100px from bottom, pause auto-scroll
		autoScroll = scrollHeight - scrollTop - clientHeight < 100;
	}

	function handleSend(event: CustomEvent<string>) {
		session.sendMessage(event.detail);
		autoScroll = true;
	}

	function handleExampleClick(prompt: string) {
		session.sendMessage(prompt);
		autoScroll = true;
	}
</script>

<div class="flex flex-col h-full">
	<!-- Messages area -->
	<div
		bind:this={messagesContainer}
		on:scroll={handleScroll}
		class="flex-1 overflow-y-auto p-4 space-y-4"
	>
		{#if $messages.length === 0 && !$isStreaming}
			<EmptyState on:select={(e) => handleExampleClick(e.detail)} />
		{:else}
			<MessageStream />
		{/if}

		<!-- Approval gate -->
		{#if $pendingApproval}
			<ApprovalGate toolCall={$pendingApproval} />
		{/if}
	</div>

	<!-- Input area -->
	<div class="border-t border-vex-border p-4">
		<ChatInput on:send={handleSend} disabled={$isStreaming} />
	</div>
</div>
