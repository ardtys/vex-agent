<script lang="ts">
	export let symbol: string;
	export let name: string;
	export let price: number;
	export let change24h: number;
	export let volume: number | undefined = undefined;
	export let mcap: number | undefined = undefined;
	export let logoUrl: string | undefined = undefined;
	export let rank: number | undefined = undefined;

	$: isPositive = change24h >= 0;

	function formatPrice(price: number): string {
		if (price < 0.0001) return price.toExponential(2);
		if (price < 1) return price.toFixed(6);
		if (price < 100) return price.toFixed(4);
		return price.toFixed(2);
	}

	function formatLargeNumber(num: number): string {
		if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
		if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
		if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
		return `$${num.toFixed(0)}`;
	}
</script>

<div
	class="group relative overflow-hidden rounded-xl border border-vex-border bg-vex-surface/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-vex-lime/30 hover:shadow-[0_0_30px_rgba(200,255,0,0.1)]"
>
	<!-- Rank badge -->
	{#if rank !== undefined}
		<div
			class="absolute -right-6 -top-6 flex h-12 w-12 rotate-45 items-center justify-end bg-vex-lime/10 pr-1 pt-6"
		>
			<span class="origin-center -rotate-45 font-mono text-xs text-vex-lime">#{rank}</span>
		</div>
	{/if}

	<div class="flex items-start gap-3">
		<!-- Logo -->
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-vex-lime/20 to-vex-lime/5"
		>
			{#if logoUrl}
				<img src={logoUrl} alt={symbol} class="h-6 w-6 rounded-full" />
			{:else}
				<span class="font-display text-sm text-vex-lime">{symbol.slice(0, 2)}</span>
			{/if}
		</div>

		<!-- Info -->
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<span class="font-mono text-sm font-bold text-vex-white">{symbol}</span>
				<span
					class="rounded bg-vex-lime/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-vex-lime"
				>
					SOL
				</span>
			</div>
			<p class="truncate text-xs text-vex-muted">{name}</p>
		</div>

		<!-- Price & Change -->
		<div class="text-right">
			<p class="font-mono text-sm text-vex-white">${formatPrice(price)}</p>
			<p
				class="font-mono text-xs"
				class:text-vex-success={isPositive}
				class:text-vex-red={!isPositive}
			>
				{isPositive ? '+' : ''}{change24h.toFixed(2)}%
			</p>
		</div>
	</div>

	<!-- Stats row -->
	{#if volume !== undefined || mcap !== undefined}
		<div class="mt-3 flex gap-4 border-t border-vex-border/50 pt-3">
			{#if mcap !== undefined}
				<div>
					<p class="text-[10px] uppercase tracking-wider text-vex-muted">MCap</p>
					<p class="font-mono text-xs text-vex-white">{formatLargeNumber(mcap)}</p>
				</div>
			{/if}
			{#if volume !== undefined}
				<div>
					<p class="text-[10px] uppercase tracking-wider text-vex-muted">24h Vol</p>
					<p class="font-mono text-xs text-vex-white">{formatLargeNumber(volume)}</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Hover shimmer effect -->
	<div
		class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full"
	></div>
</div>
