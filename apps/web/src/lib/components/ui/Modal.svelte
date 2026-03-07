<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let open: boolean = false;
	export let title: string = '';
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let closeOnBackdrop: boolean = true;
	export let closeOnEscape: boolean = true;

	const dispatch = createEventDispatcher<{ close: void }>();

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};

	function handleBackdropClick() {
		if (closeOnBackdrop) {
			dispatch('close');
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closeOnEscape) {
			dispatch('close');
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
	>
		<!-- Background overlay -->
		<div
			class="absolute inset-0 bg-vex-black/80 backdrop-blur-sm"
			on:click={handleBackdropClick}
			role="button"
			tabindex="-1"
			on:keypress={() => {}}
		></div>

		<!-- Modal content -->
		<div
			class="relative w-full rounded-2xl border border-vex-border bg-vex-surface shadow-2xl {sizeClasses[size]}"
			transition:scale={{ duration: 200, start: 0.95 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<!-- Header -->
			{#if title || $$slots.header}
				<div class="flex items-center justify-between border-b border-vex-border px-6 py-4">
					{#if $$slots.header}
						<slot name="header" />
					{:else}
						<h2 id="modal-title" class="font-display text-lg text-vex-white">{title}</h2>
					{/if}
					<button
						on:click={() => dispatch('close')}
						class="rounded-lg p-1 text-vex-muted transition-colors hover:bg-vex-border hover:text-vex-white"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class="px-6 py-4">
				<slot />
			</div>

			<!-- Footer -->
			{#if $$slots.footer}
				<div class="flex justify-end gap-2 border-t border-vex-border px-6 py-4">
					<slot name="footer" />
				</div>
			{/if}
		</div>
	</div>
{/if}
