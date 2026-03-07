<script lang="ts">
	import type { ToolResult } from '@vex/shared';

	export let tool: string;
	export let icon: string;
	export let status: 'running' | 'done' | 'error';
	export let args: Record<string, unknown> | undefined = undefined;
	export let result: ToolResult | undefined = undefined;

	// Human-readable tool labels
	const toolLabels: Record<string, string> = {
		swap_token: 'Swap Token',
		launch_token: 'Launch Token',
		get_trending: 'Get Trending',
		check_rug_risk: 'Check Rug Risk',
		get_pnl: 'Calculate PnL',
		get_portfolio: 'Get Portfolio',
		get_token_data: 'Get Token Data',
		send_sol: 'Send SOL',
		buy_pump: 'Buy on Pump.fun',
		sell_pump: 'Sell on Pump.fun'
	};

	$: label = toolLabels[tool] || tool;
</script>

<div
	class="flex items-center gap-2 text-sm py-1"
	class:text-vex-muted={status === 'running'}
	class:text-vex-lime={status === 'done'}
	class:text-vex-red={status === 'error'}
>
	<span class="w-5 text-center">{icon}</span>
	<span class="font-medium">{label}</span>
	<span class="text-xs">
		{#if status === 'running'}
			<span class="animate-pulse">...</span>
		{:else if status === 'done'}
			✓
		{:else}
			✗
		{/if}
	</span>
	{#if status === 'done' && result?.summary}
		<span class="text-vex-muted text-xs ml-2">— {result.summary}</span>
	{/if}
</div>

<!-- Show args for running tools -->
{#if status === 'running' && args && Object.keys(args).length > 0}
	<div class="ml-7 text-xs text-vex-muted bg-vex-surface px-2 py-1 mt-1">
		{JSON.stringify(args, null, 0)}
	</div>
{/if}
