<script lang="ts">
	const items = [
		'$SOL +12.4%',
		'$WIF +847%',
		'$BONK -2.1%',
		'$JUP +5.7%',
		'$PYTH +18.2%',
		'$RAY +9.3%',
		'$ORCA +4.8%',
		'$MNGO -1.2%'
	];
</script>

<div class="bg-[var(--lime)] text-[var(--black)] py-2 overflow-hidden mt-16">
	<div class="animate-ticker flex whitespace-nowrap">
		{#each [...items, ...items] as item}
			<span class="mx-8 text-xs font-mono font-bold uppercase tracking-wider">
				{item}
			</span>
		{/each}
		{#each [...items, ...items] as item}
			<span class="mx-8 text-xs font-mono font-bold uppercase tracking-wider">
				{item}
			</span>
		{/each}
	</div>
</div>
