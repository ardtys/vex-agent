<script lang="ts">
	import { wallet, solBalance, topHoldings, totalPortfolioUsd } from '$lib/stores/wallet';
	import { formatSol, formatUsd, formatPercent } from '$lib/utils/format';

	$: solUsd = $wallet.context?.solUsd ?? 0;

	// Compute PnL formatting reactively
	$: pnlFormatted = $wallet.pnl
		? formatPercent(($wallet.pnl.totalPnl / Math.max($totalPortfolioUsd, 1)) * 100)
		: { value: '0%', isPositive: true };
</script>

<div class="p-4 space-y-6">
	<!-- SOL Balance -->
	<div class="space-y-2">
		<h3 class="text-xs text-vex-muted uppercase tracking-wider">SOL Balance</h3>
		<div class="text-2xl font-display text-vex-lime">
			{formatSol($solBalance * 1_000_000_000)} SOL
		</div>
		<div class="text-sm text-vex-muted">
			{formatUsd(solUsd)}
		</div>
	</div>

	<!-- Total Portfolio -->
	<div class="space-y-2">
		<h3 class="text-xs text-vex-muted uppercase tracking-wider">Portfolio Value</h3>
		<div class="text-xl">
			{formatUsd($totalPortfolioUsd)}
		</div>
	</div>

	<!-- PnL -->
	{#if $wallet.pnl}
		<div class="space-y-2">
			<h3 class="text-xs text-vex-muted uppercase tracking-wider">PnL ({$wallet.pnl.period})</h3>
			<div class="text-lg" class:text-vex-lime={pnlFormatted.isPositive} class:text-vex-red={!pnlFormatted.isPositive}>
				{formatUsd($wallet.pnl.totalPnl)} ({pnlFormatted.value})
			</div>
			<div class="text-xs text-vex-muted">
				Win Rate: {($wallet.pnl.winRate * 100).toFixed(1)}%
			</div>
		</div>
	{/if}

	<!-- Top Holdings -->
	<div class="space-y-2">
		<h3 class="text-xs text-vex-muted uppercase tracking-wider">Top Holdings</h3>
		{#if $topHoldings.length === 0}
			<p class="text-sm text-vex-muted italic">No tokens found</p>
		{:else}
			<div class="space-y-2">
				{#each $topHoldings.slice(0, 5) as token}
					{@const change = formatPercent(token.priceChange24h)}
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2">
							{#if token.logoUri}
								<img src={token.logoUri} alt={token.symbol} class="w-5 h-5 rounded" />
							{:else}
								<div class="w-5 h-5 bg-vex-surface rounded flex items-center justify-center text-xs">
									{token.symbol[0]}
								</div>
							{/if}
							<span>{token.symbol}</span>
						</div>
						<div class="text-right">
							<div class="text-vex-white">{formatUsd(token.usdValue)}</div>
							<div class="text-xs" class:text-vex-lime={change.isPositive} class:text-vex-red={!change.isPositive}>
								{change.value}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Refresh button -->
	<button
		on:click={() => wallet.refreshContext()}
		disabled={$wallet.loading}
		class="btn btn-ghost w-full text-xs"
	>
		{$wallet.loading ? 'Refreshing...' : 'Refresh Portfolio'}
	</button>
</div>
