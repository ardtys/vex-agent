<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import AnimatedCounter from '../ui/AnimatedCounter.svelte';
	import NetworkStatus from '../ui/NetworkStatus.svelte';
	import Badge from '../ui/Badge.svelte';
	import GradientText from '../ui/GradientText.svelte';

	interface Stat {
		label: string;
		value: number;
		prefix?: string;
		suffix?: string;
		icon: string;
		color: string;
	}

	let stats: Stat[] = [
		{ label: 'Total Volume', value: 2_450_000, prefix: '$', suffix: '', icon: '◈', color: 'text-vex-lime' },
		{ label: 'Transactions', value: 12_847, prefix: '', suffix: '', icon: '⇄', color: 'text-blue-400' },
		{ label: 'Active Users', value: 847, prefix: '', suffix: '', icon: '◉', color: 'text-purple-400' },
		{ label: 'Tokens Tracked', value: 5_234, prefix: '', suffix: '', icon: '◎', color: 'text-orange-400' }
	];

	let recentTrades: { type: string; token: string; amount: string; time: string }[] = [];
	let interval: ReturnType<typeof setInterval>;

	const tokens = ['BONK', 'WIF', 'JTO', 'PYTH', 'RAY', 'ORCA', 'SOL', 'USDC'];
	const types = ['BUY', 'SELL', 'SWAP'];

	function generateTrade() {
		const type = types[Math.floor(Math.random() * types.length)];
		const token = tokens[Math.floor(Math.random() * tokens.length)];
		const amount = (Math.random() * 1000).toFixed(2);
		const time = 'Just now';

		recentTrades = [{ type, token, amount, time }, ...recentTrades.slice(0, 4)];
	}

	onMount(() => {
		// Generate initial trades
		for (let i = 0; i < 5; i++) {
			generateTrade();
		}

		// Update stats periodically
		interval = setInterval(() => {
			stats = stats.map((stat) => ({
				...stat,
				value: stat.value + Math.floor(Math.random() * 10)
			}));
			generateTrade();
		}, 3000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	function getTradeClasses(type: string): string {
		if (type === 'BUY') return 'bg-vex-success/20 text-vex-success';
		if (type === 'SELL') return 'bg-vex-red/20 text-vex-red';
		if (type === 'SWAP') return 'bg-blue-500/20 text-blue-400';
		return '';
	}
</script>

<section class="relative overflow-hidden border-y border-vex-border bg-vex-surface/30 py-16">
	<!-- Background grid -->
	<div
		class="absolute inset-0 opacity-5"
		style="background-image: linear-gradient(rgba(200,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.1) 1px, transparent 1px); background-size: 50px 50px;"
	></div>

	<div class="relative mx-auto max-w-7xl px-6">
		<!-- Header -->
		<div class="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
			<div class="flex items-center gap-4">
				<h3 class="font-display text-2xl uppercase text-vex-white">
					<GradientText variant="lime">Live</GradientText> Platform Stats
				</h3>
				<Badge variant="success" dot pulse size="sm">REAL-TIME</Badge>
			</div>
			<NetworkStatus showDetails />
		</div>

		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Stats cards -->
			<div class="lg:col-span-2">
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					{#each stats as stat}
						<div
							class="rounded-xl border border-vex-border bg-vex-black/50 p-4 transition-all hover:border-vex-lime/30"
						>
							<div class="flex items-center gap-2">
								<span class={stat.color}>{stat.icon}</span>
								<span class="text-xs uppercase tracking-wider text-vex-muted">{stat.label}</span>
							</div>
							<p class="mt-2 font-mono text-2xl text-vex-white">
								<AnimatedCounter
									value={stat.value}
									prefix={stat.prefix}
									suffix={stat.suffix}
									duration={1500}
								/>
							</p>
						</div>
					{/each}
				</div>

				<!-- Additional stats row -->
				<div class="mt-4 grid grid-cols-3 gap-4">
					<div class="rounded-lg border border-vex-border/50 bg-vex-black/30 p-3 text-center">
						<p class="text-[10px] uppercase tracking-wider text-vex-muted">Avg Response</p>
						<p class="font-mono text-lg text-vex-lime">1.2s</p>
					</div>
					<div class="rounded-lg border border-vex-border/50 bg-vex-black/30 p-3 text-center">
						<p class="text-[10px] uppercase tracking-wider text-vex-muted">Success Rate</p>
						<p class="font-mono text-lg text-vex-success">99.8%</p>
					</div>
					<div class="rounded-lg border border-vex-border/50 bg-vex-black/30 p-3 text-center">
						<p class="text-[10px] uppercase tracking-wider text-vex-muted">Uptime</p>
						<p class="font-mono text-lg text-vex-white">99.99%</p>
					</div>
				</div>
			</div>

			<!-- Recent activity feed -->
			<div class="rounded-xl border border-vex-border bg-vex-black/50 p-4">
				<div class="mb-4 flex items-center justify-between">
					<h4 class="font-mono text-sm text-vex-white">Recent Activity</h4>
					<div class="h-2 w-2 animate-pulse rounded-full bg-vex-lime"></div>
				</div>

				<div class="space-y-3">
					{#each recentTrades as trade, i}
						<div
							class="flex items-center justify-between rounded-lg bg-vex-surface/50 px-3 py-2 transition-all duration-300"
							style="animation: slide-in 0.3s ease-out; animation-delay: {i * 50}ms;"
						>
							<div class="flex items-center gap-2">
								<span class="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold {getTradeClasses(trade.type)}">
									{trade.type}
								</span>
								<span class="font-mono text-xs text-vex-white">{trade.token}</span>
							</div>
							<div class="text-right">
								<p class="font-mono text-xs text-vex-muted">${trade.amount}</p>
								<p class="text-[10px] text-vex-muted/50">{trade.time}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
