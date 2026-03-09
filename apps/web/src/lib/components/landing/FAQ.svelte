<script lang="ts">
	import Accordion from '../ui/Accordion.svelte';
	import GradientText from '../ui/GradientText.svelte';
	import Badge from '../ui/Badge.svelte';

	const faqs = [
		{
			question: 'What is VEX?',
			answer:
				'VEX is an AI-powered agent for the Solana ecosystem. It helps you execute on-chain actions like token swaps, portfolio tracking, and market analysis through natural language commands.',
			icon: '◈'
		},
		{
			question: 'How does VEX ensure my funds are safe?',
			answer:
				'VEX never has direct access to your funds. All transactions require explicit approval through your connected wallet. We use Jupiter for swaps with optimal routing and built-in rug detection.',
			icon: '⊘'
		},
		{
			question: 'What can I do with VEX?',
			answer:
				'You can swap tokens, check trending coins, analyze token safety (rug checks), track your portfolio P&L, launch tokens on Pump.fun, and get real-time market insights - all through simple chat commands.',
			icon: '⇄'
		},
		{
			question: 'Which wallets are supported?',
			answer:
				'VEX supports all major Solana wallets including Phantom, Solflare, Backpack, and more through the Solana Wallet Adapter.',
			icon: '◎'
		},
		{
			question: 'Is VEX free to use?',
			answer:
				'VEX is currently in beta and free to use. Standard network transaction fees apply when executing swaps or other on-chain actions.',
			icon: '◉'
		},
		{
			question: 'How accurate is the AI?',
			answer:
				'VEX is powered by Qwen 2.5 72B, a state-of-the-art language model. While highly capable, we recommend always reviewing transaction details before approval.',
			icon: '⟐'
		}
	];

	let openIndex: number | null = null;

	function toggleFaq(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<section class="relative py-24">
	<div class="mx-auto max-w-3xl px-6">
		<!-- Header -->
		<div class="mb-12 text-center">
			<Badge variant="lime">FAQ</Badge>
			<h2 class="mt-4 font-display text-4xl uppercase text-vex-white md:text-5xl">
				Got <GradientText variant="lime">Questions?</GradientText>
			</h2>
			<p class="mt-4 font-serif text-lg italic text-vex-muted">
				Everything you need to know about VEX
			</p>
		</div>

		<!-- FAQ list -->
		<div class="rounded-2xl border border-vex-border bg-vex-surface/30 p-6">
			{#each faqs as faq, i}
				<div class="border-b border-vex-border/50 last:border-b-0">
					<button
						on:click={() => toggleFaq(i)}
						class="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-vex-lime"
					>
						<div class="flex items-center gap-3">
							<span class="text-vex-lime">{faq.icon}</span>
							<span class="font-mono text-sm text-vex-white">{faq.question}</span>
						</div>
						<svg
							class="h-4 w-4 shrink-0 text-vex-muted transition-transform duration-200"
							class:rotate-180={openIndex === i}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M6 9l6 6 6-6" />
						</svg>
					</button>

					{#if openIndex === i}
						<div class="overflow-hidden pb-5">
							<p class="pl-8 text-sm leading-relaxed text-vex-muted">
								{faq.answer}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Contact CTA -->
		<div class="mt-8 text-center">
			<p class="text-sm text-vex-muted">
				Still have questions?
				<a href="https://x.com/vex_agent" target="_blank" rel="noopener noreferrer" class="text-vex-lime hover:underline">Follow us on X</a>
				or
				<a href="mailto:support@vex.app" class="text-vex-lime hover:underline">contact support</a>
			</p>
		</div>
	</div>
</section>
