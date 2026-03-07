<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { toasts, type Toast, type ToastType } from '$lib/stores/toast';

	const icons: Record<ToastType, string> = {
		success: '✓',
		error: '✕',
		warning: '!',
		info: 'i'
	};

	const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
		success: {
			bg: 'bg-vex-success/10',
			border: 'border-vex-success/30',
			icon: 'bg-vex-success text-vex-black'
		},
		error: {
			bg: 'bg-vex-red/10',
			border: 'border-vex-red/30',
			icon: 'bg-vex-red text-vex-white'
		},
		warning: {
			bg: 'bg-vex-warning/10',
			border: 'border-vex-warning/30',
			icon: 'bg-vex-warning text-vex-black'
		},
		info: {
			bg: 'bg-blue-500/10',
			border: 'border-blue-500/30',
			icon: 'bg-blue-500 text-vex-white'
		}
	};

	function dismiss(id: string) {
		toasts.remove(id);
	}
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
	{#each $toasts as toast (toast.id)}
		<div
			in:fly={{ x: 100, duration: 300 }}
			out:fly={{ x: 100, duration: 200 }}
			animate:flip={{ duration: 300 }}
			class="group relative w-80 overflow-hidden rounded-lg border backdrop-blur-sm {colors[toast.type].bg} {colors[toast.type].border}"
		>
			<!-- Progress bar -->
			{#if toast.duration && toast.duration > 0}
				<div
					class="absolute bottom-0 left-0 h-0.5 bg-current opacity-30"
					style="animation: shrink {toast.duration}ms linear forwards;"
				></div>
			{/if}

			<div class="flex gap-3 p-4">
				<!-- Icon -->
				<div
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold {colors[toast.type].icon}"
				>
					{icons[toast.type]}
				</div>

				<!-- Content -->
				<div class="min-w-0 flex-1">
					<p class="font-mono text-sm font-medium text-vex-white">{toast.title}</p>
					{#if toast.message}
						<p class="mt-1 text-xs text-vex-muted">{toast.message}</p>
					{/if}
					{#if toast.action}
						<button
							on:click={toast.action.onClick}
							class="mt-2 text-xs font-medium text-vex-lime hover:underline"
						>
							{toast.action.label}
						</button>
					{/if}
				</div>

				<!-- Close button -->
				<button
					on:click={() => dismiss(toast.id)}
					class="shrink-0 text-vex-muted opacity-0 transition-opacity hover:text-vex-white group-hover:opacity-100"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	@keyframes shrink {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>
