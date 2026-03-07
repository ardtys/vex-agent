<script lang="ts">
	export let text = 'EXECUTE • DOMINATE • REPEAT';
	export let outlined = false;
</script>

<div class="py-8 overflow-hidden border-y border-[var(--border)]">
	<div class="animate-marquee flex whitespace-nowrap">
		{#each Array(10) as _}
			<span
				class="mx-8 font-display text-6xl md:text-8xl tracking-wider"
				class:text-outline={outlined}
				class:text-[var(--white)]={!outlined}
			>
				{text}
			</span>
		{/each}
	</div>
</div>
