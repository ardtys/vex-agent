<script lang="ts">
	import GradientText from '../ui/GradientText.svelte';

	const partners = [
		{ name: 'Jupiter', description: 'DEX Aggregator', icon: '⟐' },
		{ name: 'Helius', description: 'RPC Provider', icon: '◈' },
		{ name: 'Birdeye', description: 'Market Data', icon: '◉' },
		{ name: 'DexScreener', description: 'Token Analytics', icon: '◎' },
		{ name: 'RugCheck', description: 'Safety Analysis', icon: '⊘' },
		{ name: 'Pump.fun', description: 'Token Launches', icon: '▲' }
	];
</script>

<section class="relative border-y border-vex-border bg-vex-surface/20 py-16">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Header -->
		<div class="mb-10 text-center">
			<p class="font-mono text-xs uppercase tracking-widest text-vex-muted">Powered By</p>
			<h3 class="mt-2 font-display text-2xl text-vex-white">
				<GradientText variant="lime">Industry Leaders</GradientText>
			</h3>
		</div>

		<!-- Partners grid -->
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
			{#each partners as partner}
				<div
					class="group flex flex-col items-center rounded-xl border border-vex-border/50 bg-vex-black/30 p-6 text-center transition-all duration-300 hover:border-vex-lime/30 hover:bg-vex-surface/50"
				>
					<span
						class="text-3xl text-vex-muted transition-colors duration-300 group-hover:text-vex-lime"
					>
						{partner.icon}
					</span>
					<p class="mt-3 font-mono text-sm font-medium text-vex-white">{partner.name}</p>
					<p class="mt-1 text-[10px] uppercase tracking-wider text-vex-muted">
						{partner.description}
					</p>
				</div>
			{/each}
		</div>

		<!-- Trust badges -->
		<div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-vex-muted">
			<div class="flex items-center gap-2">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
				<span class="text-xs">Secure by Design</span>
			</div>
			<div class="flex items-center gap-2">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10" />
					<path d="M12 6v6l4 2" />
				</svg>
				<span class="text-xs">Real-time Data</span>
			</div>
			<div class="flex items-center gap-2">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<path d="M22 4L12 14.01l-3-3" />
				</svg>
				<span class="text-xs">Non-custodial</span>
			</div>
			<div class="flex items-center gap-2">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
					<path d="M7 11V7a5 5 0 0 1 10 0v4" />
				</svg>
				<span class="text-xs">User Approval Required</span>
			</div>
		</div>
	</div>
</section>
