<script lang="ts">
	import { onMount } from 'svelte';
	import TokenCard from '../ui/TokenCard.svelte';
	import SparklineChart from '../ui/SparklineChart.svelte';
	import Badge from '../ui/Badge.svelte';
	import GradientText from '../ui/GradientText.svelte';

	// Simulated trending tokens data
	const trendingTokens = [
		{
			symbol: 'BONK',
			name: 'Bonk',
			price: 0.00002847,
			change24h: 15.42,
			mcap: 1_850_000_000,
			volume: 245_000_000,
			rank: 1,
			sparkline: [20, 22, 21, 25, 28, 26, 30, 32, 35, 33, 38, 42]
		},
		{
			symbol: 'WIF',
			name: 'dogwifhat',
			price: 2.34,
			change24h: 8.73,
			mcap: 2_340_000_000,
			volume: 180_000_000,
			rank: 2,
			sparkline: [100, 105, 102, 108, 112, 115, 118, 120, 122, 125, 128, 134]
		},
		{
			symbol: 'JTO',
			name: 'Jito',
			price: 3.56,
			change24h: -2.15,
			mcap: 428_000_000,
			volume: 52_000_000,
			rank: 3,
			sparkline: [150, 148, 152, 145, 142, 140, 138, 142, 140, 138, 135, 134]
		},
		{
			symbol: 'PYTH',
			name: 'Pyth Network',
			price: 0.42,
			change24h: 5.28,
			mcap: 756_000_000,
			volume: 89_000_000,
			rank: 4,
			sparkline: [35, 36, 38, 37, 39, 40, 41, 40, 42, 43, 44, 45]
		},
		{
			symbol: 'RAY',
			name: 'Raydium',
			price: 1.87,
			change24h: 12.34,
			mcap: 512_000_000,
			volume: 67_000_000,
			rank: 5,
			sparkline: [80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 110]
		},
		{
			symbol: 'ORCA',
			name: 'Orca',
			price: 4.12,
			change24h: -0.87,
			mcap: 234_000_000,
			volume: 28_000_000,
			rank: 6,
			sparkline: [200, 198, 202, 200, 198, 196, 198, 196, 195, 194, 193, 192]
		}
	];

	let visible = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible = true;
				}
			},
			{ threshold: 0.1 }
		);

		const section = document.getElementById('trending-section');
		if (section) observer.observe(section);

		return () => observer.disconnect();
	});
</script>

<section id="trending-section" class="relative py-24">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Header -->
		<div class="mb-12 text-center">
			<Badge variant="lime" dot pulse>LIVE DATA</Badge>
			<h2 class="mt-4 font-display text-4xl uppercase text-vex-white md:text-5xl">
				<GradientText variant="lime">Trending</GradientText> on Solana
			</h2>
			<p class="mt-4 font-serif text-lg italic text-vex-muted">
				Real-time insights into the hottest tokens
			</p>
		</div>

		<!-- Tokens grid -->
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each trendingTokens as token, i}
				<div
					class="transform transition-all duration-500"
					style="
						opacity: {visible ? 1 : 0};
						transform: translateY({visible ? 0 : 20}px);
						transition-delay: {i * 100}ms;
					"
				>
					<div
						class="group relative overflow-hidden rounded-xl border border-vex-border bg-vex-surface/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-vex-lime/30 hover:shadow-[0_0_30px_rgba(200,255,0,0.1)]"
					>
						<!-- Rank badge -->
						<div class="absolute -right-2 -top-2">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-vex-lime/10 font-mono text-xs font-bold text-vex-lime"
							>
								#{token.rank}
							</div>
						</div>

						<div class="flex items-start justify-between gap-4">
							<!-- Token info -->
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-vex-lime/20 to-vex-lime/5"
								>
									<span class="font-display text-sm text-vex-lime"
										>{token.symbol.slice(0, 2)}</span
									>
								</div>
								<div>
									<div class="flex items-center gap-2">
										<span class="font-mono text-sm font-bold text-vex-white">{token.symbol}</span>
									</div>
									<p class="text-xs text-vex-muted">{token.name}</p>
								</div>
							</div>

							<!-- Sparkline -->
							<div class="flex-shrink-0">
								<SparklineChart
									data={token.sparkline}
									width={80}
									height={32}
									color={token.change24h >= 0 ? 'lime' : 'red'}
								/>
							</div>
						</div>

						<!-- Price & stats -->
						<div class="mt-4 flex items-end justify-between">
							<div>
								<p class="font-mono text-lg text-vex-white">
									${token.price < 0.01
										? token.price.toFixed(6)
										: token.price.toFixed(2)}
								</p>
								<p
									class="font-mono text-sm"
									class:text-vex-success={token.change24h >= 0}
									class:text-vex-red={token.change24h < 0}
								>
									{token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
								</p>
							</div>

							<div class="text-right text-xs text-vex-muted">
								<p>MCap: ${(token.mcap / 1_000_000).toFixed(0)}M</p>
								<p>Vol: ${(token.volume / 1_000_000).toFixed(0)}M</p>
							</div>
						</div>

						<!-- Hover shimmer -->
						<div
							class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full"
						></div>
					</div>
				</div>
			{/each}
		</div>

		<!-- CTA -->
		<div class="mt-12 text-center">
			<a
				href="/app"
				class="inline-flex items-center gap-2 rounded-lg border border-vex-lime bg-vex-lime/10 px-6 py-3 font-mono text-sm text-vex-lime transition-all hover:bg-vex-lime hover:text-vex-black"
			>
				<span>Explore All Tokens</span>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	</div>
</section>
