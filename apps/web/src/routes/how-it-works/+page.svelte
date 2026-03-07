<script lang="ts">
	import Nav from '$lib/components/landing/Nav.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import { reveal, stagger } from '$lib/actions/reveal';

	const steps = [
		{
			number: '01',
			title: 'Describe Your Intent',
			subtitle: 'Natural Language Understanding',
			description: 'Tell VEX what you want to accomplish in plain English. No need to learn complex interfaces or memorize commands. VEX understands context, handles ambiguity, and asks clarifying questions when needed.',
			longDescription: 'Powered by Qwen2.5-72B, VEX processes your natural language input to understand your trading intent. The AI interprets not just keywords but context and nuance — it knows "buy some WIF" and "swap SOL for WIF" mean the same thing, and can handle complex multi-step requests.',
			details: [
				{ title: 'Flexible Syntax', desc: '"swap 5 SOL for WIF" or "buy WIF with 5 SOL" both work' },
				{ title: 'Context Awareness', desc: 'Remembers conversation history for follow-up requests' },
				{ title: 'Smart Clarification', desc: 'Asks questions when your request is ambiguous' },
				{ title: 'Multi-Step Planning', desc: 'Handles complex requests requiring multiple operations' },
				{ title: 'Error Recovery', desc: 'Suggests alternatives when something isn\'t possible' }
			],
			examples: [
				{ input: 'swap 5 SOL for WIF', output: 'Jupiter swap with best route calculation' },
				{ input: 'is this token safe? 7xKXtg...', output: 'RugCheck security analysis' },
				{ input: 'what\'s trending right now', output: 'Top tokens by volume and momentum' }
			],
			visual: 'chat'
		},
		{
			number: '02',
			title: 'Review the Execution Plan',
			subtitle: 'Full Transparency Before Action',
			description: 'Before any transaction, VEX shows you exactly what will happen. See the complete breakdown: input/output amounts, fees, price impact, and any risks. No hidden operations, no surprises.',
			longDescription: 'For every transaction, VEX provides a detailed preview including: exact token amounts, USD values, network fees, DEX fees (if applicable), price impact percentage, route path for swaps, and any relevant warnings. You have complete visibility into what will be signed.',
			details: [
				{ title: 'Transaction Preview', desc: 'Complete breakdown of inputs, outputs, and fees' },
				{ title: 'Price Impact Warning', desc: 'Alerts for high slippage or poor execution' },
				{ title: 'Fee Breakdown', desc: 'Network fees, priority fees, and protocol fees itemized' },
				{ title: 'Risk Indicators', desc: 'Security warnings for unverified tokens' },
				{ title: 'Route Visualization', desc: 'See the exact swap path through DEXs' },
				{ title: 'USD Estimates', desc: 'Real-time dollar values for all amounts' }
			],
			visual: 'preview'
		},
		{
			number: '03',
			title: 'Approve & Execute',
			subtitle: 'You Control the Final Step',
			description: 'Every transaction requires your explicit approval. VEX can plan, prepare, and optimize — but only you can authorize execution. One confirmation, and VEX handles the rest.',
			longDescription: 'When you approve a transaction, VEX prepares and executes the operation. The transaction is broadcast to the Solana network with optimized settings. VEX monitors confirmation status and provides real-time feedback on success or failure.',
			details: [
				{ title: 'Single Approval', desc: 'One confirmation per transaction' },
				{ title: 'Instant Broadcast', desc: 'Transaction submitted immediately after approval' },
				{ title: 'Priority Fee Optimization', desc: 'Dynamic fees for fast confirmation' },
				{ title: 'Real-Time Status', desc: 'Live tracking until confirmation' },
				{ title: 'Transaction Link', desc: 'Direct link to Solscan for verification' },
				{ title: 'Error Handling', desc: 'Clear explanations if transaction fails' }
			],
			visual: 'execute'
		}
	];

	const architecture = [
		{
			phase: 'Reason',
			icon: '🧠',
			title: 'Understand Intent',
			description: 'Qwen2.5-72B analyzes your request, extracts key parameters, and determines which tools are needed. The model considers conversation history and market conditions.',
			technical: 'ReAct prompting with tool definitions, context injection, streaming response generation'
		},
		{
			phase: 'Act',
			icon: '⚡',
			title: 'Execute Tools',
			description: 'The agent calls appropriate tools: fetching prices from DexScreener, getting quotes from Jupiter, checking security via RugCheck, or analyzing market data.',
			technical: 'Parallel tool execution, error handling with retries, result aggregation'
		},
		{
			phase: 'Observe',
			icon: '👁️',
			title: 'Process Results',
			description: 'Tool outputs are fed back to the model. It evaluates results, decides if goals are met, or if additional actions are needed. This loop continues until your request is fulfilled.',
			technical: 'Iterative reasoning loop, max 10 tool calls per request, graceful degradation'
		}
	];

	const security = [
		{
			title: 'Transparent Operations',
			description: 'See exactly what each transaction will do before approving. No hidden operations, no bundled transactions, no surprises.',
			icon: '👁️'
		},
		{
			title: 'Open Source',
			description: 'VEX code is open for inspection. Verify our security claims yourself — trust, but verify.',
			icon: '📖'
		},
		{
			title: 'No Data Storage',
			description: 'We don\'t store your transaction history permanently. Session data is temporary and cleared regularly.',
			icon: '🗑️'
		},
		{
			title: 'Rate Limited',
			description: 'Built-in rate limiting protects against abuse and ensures fair access for all users.',
			icon: '🛡️'
		}
	];

	const faqs = [
		{
			q: 'What AI model powers VEX?',
			a: 'VEX uses Qwen2.5-72B via OpenRouter for natural language understanding. This model excels at complex reasoning and tool use. We chose it for its strong performance on multi-step tasks and its ability to handle nuanced trading instructions.'
		},
		{
			q: 'How does VEX find the best swap rates?',
			a: 'VEX integrates with Jupiter Aggregator V6, which scans 20+ DEXs including Raydium, Orca, Meteora, and Phoenix. Jupiter automatically routes your trade through the path that gives you the best output, often splitting across multiple pools.'
		},
		{
			q: 'Are there fees for using VEX?',
			a: 'VEX itself is free during early access. You only pay standard costs: Solana network fees (~0.000005 SOL per transaction), priority fees (optional, for faster confirmation), and any protocol fees (like Jupiter\'s 0.5% partner fee on swaps).'
		},
		{
			q: 'What happens if a transaction fails?',
			a: 'If a transaction fails, VEX explains why and suggests solutions. Common issues include insufficient balance, high slippage, or network congestion. Failed transactions don\'t cost you anything beyond the small network fee.'
		},
		{
			q: 'How do I know a token is safe?',
			a: 'Use VEX\'s rug check feature before trading any new token. We integrate with RugCheck.xyz to analyze mint authority, freeze authority, LP locks, and holder concentration. Always DYOR — rug checks are helpful but not foolproof.'
		},
		{
			q: 'Can I use VEX on mobile?',
			a: 'Yes! VEX works on mobile browsers. The interface is fully responsive and optimized for touch interactions.'
		}
	];

	const comparisons = [
		{ feature: 'Natural Language Interface', vex: true, traditional: false },
		{ feature: 'No Learning Curve', vex: true, traditional: false },
		{ feature: 'Multi-DEX Aggregation', vex: true, traditional: 'Varies' },
		{ feature: 'Built-in Rug Checks', vex: true, traditional: false },
		{ feature: 'Market Analytics', vex: true, traditional: 'Varies' },
		{ feature: 'Transaction Preview', vex: true, traditional: true }
	];
</script>

<svelte:head>
	<title>How It Works - VEX | Natural Language Trading on Solana</title>
	<meta name="description" content="Learn how VEX works: describe what you want in plain English, review the plan, and execute. Trading made simple." />
</svelte:head>

<Nav />

<main class="pt-24 pb-16">
	<!-- Hero -->
	<section class="px-6 py-16">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>How It Works</span>
			</div>
			<h1 class="font-display text-5xl md:text-8xl text-[var(--white)] mb-6" use:reveal={{ delay: 100 }}>
				TRADING WITH<br /><span class="text-[var(--lime)]">NATURAL LANGUAGE</span>
			</h1>
			<p class="font-serif italic text-xl text-[var(--muted)] max-w-3xl mb-8" use:reveal={{ delay: 200 }}>
				VEX transforms your words into blockchain actions. No complicated interfaces, no technical knowledge required. Just tell VEX what you want, review the plan, and approve.
			</p>
			<div class="flex flex-wrap gap-6" use:reveal={{ delay: 300 }}>
				<div class="flex items-center gap-3">
					<span class="text-2xl">⚡</span>
					<span class="text-sm text-[var(--muted)]">Instant Execution</span>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-2xl">🛡️</span>
					<span class="text-sm text-[var(--muted)]">Transparent Operations</span>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-2xl">🎯</span>
					<span class="text-sm text-[var(--muted)]">Best Rates</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Main Steps -->
	<section class="px-6 py-16">
		<div class="max-w-[1400px] mx-auto">
			<div class="space-y-32">
				{#each steps as step, i}
					<div class="grid lg:grid-cols-2 gap-12 items-start" use:reveal>
						<!-- Left: Content -->
						<div class="{i % 2 === 1 ? 'lg:order-2' : ''}">
							<div class="flex items-center gap-4 mb-6">
								<div class="font-display text-7xl text-[var(--lime)] opacity-30">
									{step.number}
								</div>
								<div>
									<h2 class="font-display text-3xl md:text-4xl text-[var(--white)]">
										{step.title}
									</h2>
									<p class="text-sm text-[var(--lime)]">{step.subtitle}</p>
								</div>
							</div>
							<p class="text-lg text-[var(--muted)] leading-relaxed mb-4">
								{step.description}
							</p>
							<p class="text-sm text-[var(--muted)] leading-relaxed mb-8 opacity-80">
								{step.longDescription}
							</p>

							<!-- Details Grid -->
							<div class="space-y-3">
								{#each step.details as detail}
									<div class="flex items-start gap-3 bg-[var(--surface)] border border-[var(--border)] p-4">
										<span class="text-[var(--lime)] mt-0.5">→</span>
										<div>
											<h4 class="text-sm text-[var(--white)] font-medium">{detail.title}</h4>
											<p class="text-xs text-[var(--muted)]">{detail.desc}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Right: Visual / Examples -->
						<div class="{i % 2 === 1 ? 'lg:order-1' : ''}">
							{#if step.examples}
								<div class="bg-[var(--surface)] border border-[var(--border)] p-6">
									<h4 class="text-xs text-[var(--muted)] uppercase tracking-wider mb-4">Example Inputs → Actions</h4>
									<div class="space-y-4">
										{#each step.examples as ex}
											<div class="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
												<div class="bg-[var(--black)] px-3 py-2 font-mono text-sm mb-2">
													<span class="text-[var(--lime)]">&gt;</span>
													<span class="text-[var(--white)]"> {ex.input}</span>
												</div>
												<div class="text-xs text-[var(--muted)] flex items-center gap-2">
													<span class="text-[var(--lime)]">↳</span>
													{ex.output}
												</div>
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<div class="bg-[var(--surface)] border border-[var(--border)] p-8 flex items-center justify-center min-h-[300px]">
									<div class="text-center">
										<div class="text-6xl mb-4 opacity-50">
											{#if step.visual === 'preview'}📋{/if}
											{#if step.visual === 'execute'}✅{/if}
										</div>
										<p class="text-sm text-[var(--muted)]">
											{#if step.visual === 'preview'}Full transaction preview{/if}
											{#if step.visual === 'execute'}One-click execution{/if}
										</p>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Architecture: ReAct Pattern -->
	<section class="px-6 py-16 bg-[var(--surface)]">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>Under The Hood</span>
			</div>
			<h2 class="font-display text-4xl md:text-6xl text-[var(--white)] mb-4" use:reveal={{ delay: 100 }}>
				THE <span class="text-[var(--lime)]">ReAct</span> PATTERN
			</h2>
			<p class="text-[var(--muted)] mb-12 max-w-3xl" use:reveal={{ delay: 150 }}>
				VEX uses the ReAct (Reason + Act) pattern — a state-of-the-art approach for AI agents. The model reasons about your request, takes actions using tools, observes results, and iterates until your goal is achieved.
			</p>

			<div class="grid md:grid-cols-3 gap-8" use:stagger={{ staggerDelay: 150 }}>
				{#each architecture as phase}
					<div class="border border-[var(--border)] p-8 bg-[var(--black)]">
						<div class="flex items-center gap-4 mb-4">
							<span class="text-4xl">{phase.icon}</span>
							<div>
								<div class="text-[var(--lime)] text-xs font-mono tracking-wider">{phase.phase.toUpperCase()}</div>
								<h3 class="font-display text-2xl text-[var(--white)]">{phase.title}</h3>
							</div>
						</div>
						<p class="text-[var(--muted)] text-sm leading-relaxed mb-4">
							{phase.description}
						</p>
						<div class="text-xs text-[var(--muted)] opacity-60 font-mono">
							{phase.technical}
						</div>
					</div>
				{/each}
			</div>

			<!-- Flow Diagram -->
			<div class="mt-12 flex items-center justify-center gap-4 text-[var(--muted)]" use:reveal={{ delay: 400 }}>
				<span class="text-2xl">🧠</span>
				<span class="text-[var(--lime)]">→</span>
				<span class="text-2xl">⚡</span>
				<span class="text-[var(--lime)]">→</span>
				<span class="text-2xl">👁️</span>
				<span class="text-[var(--lime)]">→</span>
				<span class="text-sm">(loop until done)</span>
				<span class="text-[var(--lime)]">→</span>
				<span class="text-2xl">✅</span>
			</div>
		</div>
	</section>

	<!-- Security -->
	<section class="px-6 py-16">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>Security</span>
			</div>
			<h2 class="font-display text-4xl md:text-6xl text-[var(--white)] mb-4" use:reveal={{ delay: 100 }}>
				TRANSPARENT <span class="text-[var(--lime)]">OPERATIONS</span>
			</h2>
			<p class="text-[var(--muted)] mb-12 max-w-3xl" use:reveal={{ delay: 150 }}>
				VEX is built with security as a core principle. Every operation is transparent and requires your explicit approval.
			</p>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6" use:stagger={{ staggerDelay: 100 }}>
				{#each security as item}
					<div class="border border-[var(--border)] p-6 hover:border-[var(--lime)] transition-colors">
						<div class="flex items-start gap-4">
							<span class="text-3xl">{item.icon}</span>
							<div>
								<h3 class="font-display text-lg text-[var(--white)] mb-2">{item.title}</h3>
								<p class="text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Comparison -->
	<section class="px-6 py-16 bg-[var(--surface)]">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>Why VEX</span>
			</div>
			<h2 class="font-display text-4xl text-[var(--white)] mb-8" use:reveal={{ delay: 100 }}>
				VEX vs <span class="text-[var(--lime)]">TRADITIONAL DEXs</span>
			</h2>

			<div class="overflow-x-auto" use:reveal={{ delay: 150 }}>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-[var(--border)]">
							<th class="text-left py-4 text-[var(--muted)] font-normal">Feature</th>
							<th class="text-center py-4 text-[var(--lime)] font-display">VEX</th>
							<th class="text-center py-4 text-[var(--muted)] font-normal">Traditional DEX</th>
						</tr>
					</thead>
					<tbody>
						{#each comparisons as row}
							<tr class="border-b border-[var(--border)]">
								<td class="py-4 text-[var(--white)]">{row.feature}</td>
								<td class="py-4 text-center">
									{#if row.vex === true}
										<span class="text-[var(--lime)]">✓</span>
									{:else}
										<span class="text-red-500">✗</span>
									{/if}
								</td>
								<td class="py-4 text-center">
									{#if row.traditional === true}
										<span class="text-[var(--lime)]">✓</span>
									{:else if row.traditional === false}
										<span class="text-red-500">✗</span>
									{:else}
										<span class="text-yellow-500">{row.traditional}</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="px-6 py-16">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>FAQ</span>
			</div>
			<h2 class="font-display text-4xl text-[var(--white)] mb-12" use:reveal={{ delay: 100 }}>
				COMMON <span class="text-[var(--lime)]">QUESTIONS</span>
			</h2>

			<div class="grid md:grid-cols-2 gap-8" use:stagger={{ staggerDelay: 100 }}>
				{#each faqs as faq}
					<div class="border-b border-[var(--border)] pb-6">
						<h3 class="font-display text-lg text-[var(--white)] mb-3">{faq.q}</h3>
						<p class="text-sm text-[var(--muted)] leading-relaxed">{faq.a}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="px-6 py-16 bg-[var(--surface)]">
		<div class="max-w-[800px] mx-auto text-center" use:reveal>
			<h2 class="font-display text-4xl text-[var(--white)] mb-4">
				READY TO <span class="text-[var(--lime)]">GET STARTED?</span>
			</h2>
			<p class="text-[var(--muted)] mb-8">
				Experience the future of trading. No sign-up required — just start chatting.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/app" class="btn-primary">Launch App</a>
				<a href="/tools" class="btn-ghost border border-[var(--border)] px-6 py-3">Explore Tools</a>
			</div>
		</div>
	</section>
</main>

<Footer />
