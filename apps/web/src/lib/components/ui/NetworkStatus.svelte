<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let showDetails: boolean = false;

	type Status = 'online' | 'degraded' | 'offline';

	let status: Status = 'online';
	let latency: number = 0;
	let tps: number = 0;
	let slot: number = 0;
	let interval: ReturnType<typeof setInterval>;

	// Simulated network stats (replace with real API calls)
	function updateStats() {
		// Simulate realistic values
		latency = 50 + Math.random() * 100;
		tps = 2000 + Math.random() * 1500;
		slot = slot + Math.floor(Math.random() * 3) + 1;

		// Randomly simulate status changes (for demo)
		const rand = Math.random();
		if (rand > 0.95) {
			status = 'degraded';
		} else if (rand > 0.99) {
			status = 'offline';
		} else {
			status = 'online';
		}
	}

	onMount(() => {
		slot = 280000000 + Math.floor(Math.random() * 1000000);
		updateStats();
		interval = setInterval(updateStats, 3000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	const statusConfig = {
		online: {
			color: 'bg-vex-success',
			text: 'Operational',
			textColor: 'text-vex-success'
		},
		degraded: {
			color: 'bg-vex-warning',
			text: 'Degraded',
			textColor: 'text-vex-warning'
		},
		offline: {
			color: 'bg-vex-red',
			text: 'Offline',
			textColor: 'text-vex-red'
		}
	};
</script>

<div class="flex items-center gap-2">
	<!-- Status indicator -->
	<div class="relative flex items-center gap-2">
		<div class="relative">
			<div class="h-2 w-2 rounded-full {statusConfig[status].color}"></div>
			{#if status === 'online'}
				<div class="absolute inset-0 h-2 w-2 animate-ping rounded-full {statusConfig[status].color} opacity-75"></div>
			{/if}
		</div>
		<span class="font-mono text-xs {statusConfig[status].textColor}">
			{statusConfig[status].text}
		</span>
	</div>

	{#if showDetails}
		<div class="flex items-center gap-3 border-l border-vex-border pl-3">
			<!-- Latency -->
			<div class="flex items-center gap-1">
				<svg class="h-3 w-3 text-vex-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
				</svg>
				<span class="font-mono text-xs text-vex-muted">{latency.toFixed(0)}ms</span>
			</div>

			<!-- TPS -->
			<div class="flex items-center gap-1">
				<svg class="h-3 w-3 text-vex-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
				</svg>
				<span class="font-mono text-xs text-vex-muted">{tps.toFixed(0)} TPS</span>
			</div>

			<!-- Slot -->
			<div class="flex items-center gap-1">
				<svg class="h-3 w-3 text-vex-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="3" y="3" width="18" height="18" rx="2" />
					<path d="M3 9h18M9 21V9" />
				</svg>
				<span class="font-mono text-xs text-vex-muted">#{slot.toLocaleString()}</span>
			</div>
		</div>
	{/if}
</div>
