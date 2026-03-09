<script lang="ts">
	import Nav from '$lib/components/landing/Nav.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import { reveal } from '$lib/actions/reveal';

	let activeSection = 'getting-started';

	const sections = [
		{ id: 'getting-started', title: 'Getting Started' },
		{ id: 'architecture', title: 'Architecture' },
		{ id: 'commands', title: 'Commands' },
		{ id: 'tools', title: 'Tools & APIs' },
		{ id: 'security', title: 'Security' },
		{ id: 'faq', title: 'FAQ' }
	];
</script>

<svelte:head>
	<title>Documentation - VEX</title>
	<meta name="description" content="VEX documentation. Learn how to use VEX, understand the architecture, and master natural language trading on Solana." />
</svelte:head>

<Nav />

<main class="pt-24 pb-16">
	<div class="max-w-[1400px] mx-auto px-6">
		<div class="grid md:grid-cols-[280px_1fr] gap-12">
			<!-- Sidebar -->
			<aside class="hidden md:block">
				<div class="sticky top-24 space-y-1">
					<h3 class="text-xs text-[var(--muted)] uppercase tracking-wider mb-4">Documentation</h3>
					{#each sections as section}
						<a
							href="#{section.id}"
							class="block py-2 px-3 text-sm transition-colors rounded {activeSection === section.id ? 'text-[var(--lime)] bg-[var(--surface)]' : 'text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--surface)]'}"
							on:click={() => activeSection = section.id}
						>
							{section.title}
						</a>
					{/each}

					<div class="mt-8 pt-8 border-t border-[var(--border)]">
						<a href="/demo" class="btn-primary w-full text-center text-xs">Try Demo</a>
					</div>
				</div>
			</aside>

			<!-- Content -->
			<div class="space-y-32">
				<!-- Getting Started -->
				<section id="getting-started" use:reveal>
					<div class="mb-8">
						<span class="text-[10px] text-[var(--lime)] font-mono tracking-wider px-2 py-1 border border-[var(--lime)]">
							INTRODUCTION
						</span>
					</div>
					<h1 class="font-display text-5xl md:text-7xl text-[var(--white)] mb-6">
						<span class="text-[var(--lime)]">VEX</span> DOCUMENTATION
					</h1>
					<p class="text-[var(--muted)] text-lg leading-relaxed mb-8 max-w-2xl">
						Welcome to the VEX documentation. VEX is an AI-powered agent for the Solana ecosystem that enables you to trade, launch tokens, and manage your portfolio using natural language commands.
					</p>

					<div class="bg-[var(--surface)] border border-[var(--border)] p-8 mb-8">
						<h3 class="font-display text-2xl text-[var(--white)] mb-6">Quick Start Guide</h3>
						<div class="space-y-6">
							<div class="flex gap-4">
								<div class="flex-shrink-0 w-10 h-10 bg-[var(--lime)] text-[var(--black)] font-display text-xl flex items-center justify-center">1</div>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Open VEX App</h4>
									<p class="text-[var(--muted)] text-sm">Navigate to <a href="/app" class="text-[var(--lime)] underline">VEX App</a> to start chatting with the AI agent.</p>
								</div>
							</div>
							<div class="flex gap-4">
								<div class="flex-shrink-0 w-10 h-10 bg-[var(--lime)] text-[var(--black)] font-display text-xl flex items-center justify-center">2</div>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Enter Your Command</h4>
									<p class="text-[var(--muted)] text-sm">Use natural language to give instructions. For example: "what's trending?" or "check if this token is a rug".</p>
								</div>
							</div>
							<div class="flex gap-4">
								<div class="flex-shrink-0 w-10 h-10 bg-[var(--lime)] text-[var(--black)] font-display text-xl flex items-center justify-center">3</div>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Get Results</h4>
									<p class="text-[var(--muted)] text-sm">VEX will process your request and provide the information or action you need.</p>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-[var(--lime)] text-[var(--black)] p-8">
						<div class="flex items-start gap-4">
							<div class="text-4xl">🤖</div>
							<div>
								<h3 class="font-display text-2xl mb-2">Powered by Qwen2.5-72B</h3>
								<p class="text-sm leading-relaxed">
									VEX utilizes the Qwen2.5-72B AI model via OpenRouter. This model was selected for its exceptional ability to understand complex instructions, perform multi-step reasoning, and generate accurate outputs for blockchain operations.
								</p>
							</div>
						</div>
					</div>
				</section>

				<!-- Architecture -->
				<section id="architecture" use:reveal>
					<div class="mb-8">
						<span class="text-[10px] text-[var(--lime)] font-mono tracking-wider px-2 py-1 border border-[var(--lime)]">
							TECHNICAL
						</span>
					</div>
					<h2 class="font-display text-4xl md:text-5xl text-[var(--white)] mb-6">SYSTEM ARCHITECTURE</h2>
					<p class="text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
						VEX is built with a modern architecture that separates the frontend, backend, and AI agent into distinct components. Below are the main system components:
					</p>

					<div class="grid md:grid-cols-2 gap-6 mb-12">
						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--lime)] mb-3">Frontend (SvelteKit)</h3>
							<p class="text-[var(--muted)] text-sm mb-4">
								A web application built with SvelteKit and TailwindCSS. Handles the chat UI, wallet connections, and displays results from the agent.
							</p>
							<ul class="space-y-2 text-xs text-[var(--muted)]">
								<li>• SvelteKit for SSR and routing</li>
								<li>• TailwindCSS for styling</li>
								<li>• Solana Wallet Adapter for wallet connections</li>
								<li>• SSE (Server-Sent Events) for streaming</li>
							</ul>
						</div>
						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--lime)] mb-3">Backend (Hono)</h3>
							<p class="text-[var(--muted)] text-sm mb-4">
								An API server built with the Hono framework. Handles requests from the frontend and orchestrates the AI agent.
							</p>
							<ul class="space-y-2 text-xs text-[var(--muted)]">
								<li>• Hono for routing and middleware</li>
								<li>• Node.js runtime</li>
								<li>• SSE streaming for real-time responses</li>
								<li>• Integration with various external APIs</li>
							</ul>
						</div>
						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--lime)] mb-3">AI Agent (ReAct Pattern)</h3>
							<p class="text-[var(--muted)] text-sm mb-4">
								An agent that uses the ReAct (Reason + Act) pattern to process user instructions and execute appropriate tools.
							</p>
							<ul class="space-y-2 text-xs text-[var(--muted)]">
								<li>• Qwen2.5-72B via OpenRouter</li>
								<li>• Tool calling for execution</li>
								<li>• Memory for conversation context</li>
								<li>• Streaming responses</li>
							</ul>
						</div>
						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--lime)] mb-3">External APIs</h3>
							<p class="text-[var(--muted)] text-sm mb-4">
								VEX integrates with various APIs to access data and execute transactions on Solana.
							</p>
							<ul class="space-y-2 text-xs text-[var(--muted)]">
								<li>• Jupiter for swaps</li>
								<li>• Helius for wallet data</li>
								<li>• Birdeye for prices and trending</li>
								<li>• Pump.fun for token launches</li>
							</ul>
						</div>
					</div>

					<div class="bg-[var(--surface)] border border-[var(--border)] p-8">
						<h3 class="font-display text-xl text-[var(--white)] mb-6">The ReAct Pattern: How the Agent Works</h3>
						<div class="grid md:grid-cols-3 gap-6">
							<div>
								<div class="text-[var(--lime)] font-display text-4xl mb-2">01</div>
								<h4 class="text-[var(--white)] font-bold mb-2">REASON</h4>
								<p class="text-[var(--muted)] text-sm">
									The agent receives your input and analyzes what needs to be done. It determines which tools are required and in what order they should be executed.
								</p>
							</div>
							<div>
								<div class="text-[var(--lime)] font-display text-4xl mb-2">02</div>
								<h4 class="text-[var(--white)] font-bold mb-2">ACT</h4>
								<p class="text-[var(--muted)] text-sm">
									The agent executes the selected tool — for example, fetching token prices, preparing a swap, or checking token security.
								</p>
							</div>
							<div>
								<div class="text-[var(--lime)] font-display text-4xl mb-2">03</div>
								<h4 class="text-[var(--white)] font-bold mb-2">OBSERVE</h4>
								<p class="text-[var(--muted)] text-sm">
									The agent observes the results from the tool, then decides whether to run another tool or if it has sufficient information to respond to your request.
								</p>
							</div>
						</div>
					</div>
				</section>

				<!-- Commands -->
				<section id="commands" use:reveal>
					<div class="mb-8">
						<span class="text-[10px] text-[var(--lime)] font-mono tracking-wider px-2 py-1 border border-[var(--lime)]">
							REFERENCE
						</span>
					</div>
					<h2 class="font-display text-4xl md:text-5xl text-[var(--white)] mb-6">COMMANDS & EXAMPLES</h2>
					<p class="text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
						VEX understands natural language, so you don't need to use rigid syntax. Below are examples of commands you can use:
					</p>

					<!-- Trading Commands -->
					<div class="mb-12">
						<h3 class="text-sm text-[var(--lime)] uppercase tracking-wider mb-6 flex items-center gap-2">
							<span>⟲</span> Trading Commands
						</h3>
						<div class="space-y-4">
							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">swap [amount] [from] for [to]</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">Jupiter Aggregator</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Execute a token swap using Jupiter with optimal routing. Supports all SPL tokens available on Jupiter.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">swap 5 SOL for WIF</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">exchange 100 USDC for BONK</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">sell all my WIF for SOL</span>
									</div>
								</div>
							</div>

							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">buy [amount] of [token]</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">Jupiter Aggregator</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Purchase tokens using SOL or stablecoins. VEX will automatically calculate the required amounts.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">buy 2 SOL worth of BONK</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">buy $100 worth of WIF</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Portfolio Commands -->
					<div class="mb-12">
						<h3 class="text-sm text-[var(--lime)] uppercase tracking-wider mb-6 flex items-center gap-2">
							<span>◎</span> Portfolio Commands
						</h3>
						<div class="space-y-4">
							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">show my portfolio</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">Helius DAS</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Display all tokens you own along with their USD values.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">show my portfolio</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">what's my balance?</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">how much SOL do I have?</span>
									</div>
								</div>
							</div>

							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">check my PnL</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">Helius + Birdeye</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Calculate your profit and loss from trading over a specified time period.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">what's my PnL this week?</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">show my win rate</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Research Commands -->
					<div class="mb-12">
						<h3 class="text-sm text-[var(--lime)] uppercase tracking-wider mb-6 flex items-center gap-2">
							<span>⬡</span> Research Commands
						</h3>
						<div class="space-y-4">
							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">check if [token] is a rug</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">RugCheck.xyz</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Analyze a token for potential rug pull indicators: ownership concentration, liquidity, mint authority, and more.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">check if PUMP is a rug</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">analyze token safety for [mint address]</span>
									</div>
								</div>
							</div>

							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">info [token]</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">Birdeye</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Get detailed information about a token: price, market cap, volume, holders, and more.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">info WIF</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">what's the price of BONK?</span>
									</div>
								</div>
							</div>

							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">trending tokens</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">Birdeye</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Display trending tokens based on volume and price momentum.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">show trending tokens</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">what's hot right now?</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Launch Commands -->
					<div class="mb-12">
						<h3 class="text-sm text-[var(--lime)] uppercase tracking-wider mb-6 flex items-center gap-2">
							<span>◆</span> Launch Commands
						</h3>
						<div class="space-y-4">
							<div class="border border-[var(--border)] p-6">
								<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
									<code class="font-mono text-[var(--lime)]">launch token [name]</code>
									<span class="text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1">Pump.fun</span>
								</div>
								<p class="text-[var(--muted)] text-sm mb-4">
									Deploy a new token on Pump.fun with an automatic bonding curve.
								</p>
								<div class="space-y-2">
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">launch token $DEGEN</span>
									</div>
									<div class="bg-[var(--black)] px-4 py-3 font-mono text-sm flex items-center gap-2">
										<span class="text-[var(--lime)]">&gt;</span>
										<span class="text-[var(--white)]">create a memecoin called MOON</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Tools & APIs -->
				<section id="tools" use:reveal>
					<div class="mb-8">
						<span class="text-[10px] text-[var(--lime)] font-mono tracking-wider px-2 py-1 border border-[var(--lime)]">
							INTEGRATIONS
						</span>
					</div>
					<h2 class="font-display text-4xl md:text-5xl text-[var(--white)] mb-6">TOOLS & APIS</h2>
					<p class="text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
						VEX integrates with the best APIs and protocols in the Solana ecosystem to provide a comprehensive trading experience.
					</p>

					<div class="space-y-6">
						<div class="border border-[var(--border)] p-6">
							<div class="flex items-start justify-between mb-4">
								<div>
									<h3 class="font-display text-xl text-[var(--lime)]">Jupiter Aggregator v6</h3>
									<span class="text-xs text-[var(--muted)]">Trading & Swaps</span>
								</div>
								<a href="https://jup.ag" target="_blank" class="text-xs text-[var(--muted)] hover:text-[var(--white)]">jup.ag →</a>
							</div>
							<p class="text-[var(--muted)] text-sm mb-4">
								Jupiter is the largest DEX aggregator on Solana. VEX uses Jupiter to get the best prices with automatic routing across multiple DEXs like Raydium, Orca, Meteora, and more.
							</p>
							<div class="flex flex-wrap gap-2">
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Best Price Routing</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Multi-hop Swaps</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Slippage Protection</span>
							</div>
						</div>

						<div class="border border-[var(--border)] p-6">
							<div class="flex items-start justify-between mb-4">
								<div>
									<h3 class="font-display text-xl text-[var(--lime)]">Helius DAS API</h3>
									<span class="text-xs text-[var(--muted)]">Wallet Data & NFTs</span>
								</div>
								<a href="https://helius.dev" target="_blank" class="text-xs text-[var(--muted)] hover:text-[var(--white)]">helius.dev →</a>
							</div>
							<p class="text-[var(--muted)] text-sm mb-4">
								Helius provides the Digital Asset Standard (DAS) API for retrieving wallet data, token balances, NFTs, and transactions with high performance.
							</p>
							<div class="flex flex-wrap gap-2">
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Token Balances</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">NFT Metadata</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Transaction History</span>
							</div>
						</div>

						<div class="border border-[var(--border)] p-6">
							<div class="flex items-start justify-between mb-4">
								<div>
									<h3 class="font-display text-xl text-[var(--lime)]">Birdeye API</h3>
									<span class="text-xs text-[var(--muted)]">Market Data & Analytics</span>
								</div>
								<a href="https://birdeye.so" target="_blank" class="text-xs text-[var(--muted)] hover:text-[var(--white)]">birdeye.so →</a>
							</div>
							<p class="text-[var(--muted)] text-sm mb-4">
								Birdeye is an analytics platform for Solana DeFi. VEX uses Birdeye for real-time price data, trending tokens, and market analysis.
							</p>
							<div class="flex flex-wrap gap-2">
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Real-time Prices</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Trending Tokens</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">OHLCV Data</span>
							</div>
						</div>

						<div class="border border-[var(--border)] p-6">
							<div class="flex items-start justify-between mb-4">
								<div>
									<h3 class="font-display text-xl text-[var(--lime)]">Pump.fun API</h3>
									<span class="text-xs text-[var(--muted)]">Token Launch</span>
								</div>
								<a href="https://pump.fun" target="_blank" class="text-xs text-[var(--muted)] hover:text-[var(--white)]">pump.fun →</a>
							</div>
							<p class="text-[var(--muted)] text-sm mb-4">
								Pump.fun is a platform for launching memecoins with bonding curves. VEX allows you to create new tokens directly from the chat interface.
							</p>
							<div class="flex flex-wrap gap-2">
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Instant Launch</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Bonding Curve</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Auto Liquidity</span>
							</div>
						</div>

						<div class="border border-[var(--border)] p-6">
							<div class="flex items-start justify-between mb-4">
								<div>
									<h3 class="font-display text-xl text-[var(--lime)]">RugCheck.xyz</h3>
									<span class="text-xs text-[var(--muted)]">Security Analysis</span>
								</div>
								<a href="https://rugcheck.xyz" target="_blank" class="text-xs text-[var(--muted)] hover:text-[var(--white)]">rugcheck.xyz →</a>
							</div>
							<p class="text-[var(--muted)] text-sm mb-4">
								RugCheck analyzes tokens to detect potential rug pulls. VEX automatically checks token security before you trade.
							</p>
							<div class="flex flex-wrap gap-2">
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Ownership Analysis</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Liquidity Check</span>
								<span class="text-xs bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">Risk Score</span>
							</div>
						</div>
					</div>
				</section>

				<!-- Security -->
				<section id="security" use:reveal>
					<div class="mb-8">
						<span class="text-[10px] text-[var(--lime)] font-mono tracking-wider px-2 py-1 border border-[var(--lime)]">
							IMPORTANT
						</span>
					</div>
					<h2 class="font-display text-4xl md:text-5xl text-[var(--white)] mb-6">SECURITY</h2>
					<p class="text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
						Security is VEX's top priority. Below are the security principles we implement and tips for keeping your assets safe.
					</p>

					<div class="bg-[var(--surface)] border border-[var(--lime)] p-8 mb-8">
						<h3 class="font-display text-2xl text-[var(--lime)] mb-6">VEX Security Principles</h3>
						<div class="grid md:grid-cols-2 gap-6">
							<div class="flex gap-4">
								<span class="text-[var(--lime)] text-2xl">🔐</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">No Private Key Access</h4>
									<p class="text-[var(--muted)] text-sm">VEX never sees or stores your private keys. All transactions are signed within your wallet.</p>
								</div>
							</div>
							<div class="flex gap-4">
								<span class="text-[var(--lime)] text-2xl">✅</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Explicit Approval Required</h4>
									<p class="text-[var(--muted)] text-sm">Every transaction requires a signature from your wallet. VEX cannot execute without your approval.</p>
								</div>
							</div>
							<div class="flex gap-4">
								<span class="text-[var(--lime)] text-2xl">👁️</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Full Transparency</h4>
									<p class="text-[var(--muted)] text-sm">You can see complete transaction details before approving, including fee estimates and risks.</p>
								</div>
							</div>
							<div class="flex gap-4">
								<span class="text-[var(--lime)] text-2xl">🛡️</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Automatic Rug Checks</h4>
									<p class="text-[var(--muted)] text-sm">VEX automatically checks token security before trading to protect you from rug pulls.</p>
								</div>
							</div>
						</div>
					</div>

					<div class="border border-[var(--red)] p-8">
						<h3 class="font-display text-2xl text-[var(--red)] mb-6">Security Tips</h3>
						<div class="space-y-4">
							<div class="flex gap-4">
								<span class="text-[var(--red)]">⚠️</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Never Share Your Seed Phrase</h4>
									<p class="text-[var(--muted)] text-sm">Your seed phrase is the key to your wallet. Anyone who has it can access all your assets. VEX will never ask for it.</p>
								</div>
							</div>
							<div class="flex gap-4">
								<span class="text-[var(--red)]">⚠️</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Verify Before Signing</h4>
									<p class="text-[var(--muted)] text-sm">Always carefully review transaction details before signing. Ensure amounts and destination addresses are correct.</p>
								</div>
							</div>
							<div class="flex gap-4">
								<span class="text-[var(--red)]">⚠️</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Use a Hardware Wallet</h4>
									<p class="text-[var(--muted)] text-sm">For large amounts of assets, consider using a hardware wallet like Ledger for additional security.</p>
								</div>
							</div>
							<div class="flex gap-4">
								<span class="text-[var(--red)]">⚠️</span>
								<div>
									<h4 class="text-[var(--white)] font-bold mb-1">Beware of Phishing</h4>
									<p class="text-[var(--muted)] text-sm">Make sure you're accessing VEX from the correct URL. Bookmark the official site and don't click links from untrusted sources.</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- FAQ -->
				<section id="faq" use:reveal>
					<div class="mb-8">
						<span class="text-[10px] text-[var(--lime)] font-mono tracking-wider px-2 py-1 border border-[var(--lime)]">
							SUPPORT
						</span>
					</div>
					<h2 class="font-display text-4xl md:text-5xl text-[var(--white)] mb-6">FREQUENTLY ASKED QUESTIONS</h2>
					<p class="text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
						Common questions about VEX answered.
					</p>

					<div class="space-y-6">
						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--white)] mb-3">Is VEX free to use?</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed">
								Yes, VEX is free to use during the early access period. You only pay standard Solana network fees and DEX fees (such as Jupiter's 0.5% swap fee). There are no additional charges from VEX.
							</p>
						</div>

						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--white)] mb-3">What AI model does VEX use?</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed">
								VEX uses Qwen2.5-72B via OpenRouter. This model was chosen for its exceptional reasoning capabilities, ability to understand complex contexts, and accuracy in generating outputs for trading operations.
							</p>
						</div>

						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--white)] mb-3">Can VEX trade without my approval?</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed">
								No. Every transaction involving your assets requires a signature from your wallet. VEX can only plan and prepare transactions; execution always requires your explicit approval.
							</p>
						</div>

						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--white)] mb-3">What happens if a transaction fails?</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed">
								If a transaction fails, VEX will display an error message and suggest solutions. No funds are lost on failed transactions — you only pay a very small gas fee (usually less than $0.01).
							</p>
						</div>

						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--white)] mb-3">Is there a mobile app?</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed">
								There's no dedicated mobile app yet, but VEX works well in mobile browsers. Make sure your wallet is installed on your mobile device for a smooth connection.
							</p>
						</div>

						<div class="border border-[var(--border)] p-6">
							<h3 class="font-display text-xl text-[var(--white)] mb-3">How do I report bugs or provide feedback?</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed">
								You can reach us via Discord or Twitter. Links are available in the footer of this page. We greatly appreciate feedback to continuously improve VEX.
							</p>
						</div>
					</div>
				</section>

				<!-- CTA -->
				<section class="text-center py-16 border-t border-[var(--border)]" use:reveal>
					<h2 class="font-display text-4xl md:text-5xl text-[var(--white)] mb-4">
						READY TO <span class="text-[var(--lime)]">GET STARTED?</span>
					</h2>
					<p class="text-[var(--muted)] mb-8">Start trading with natural language now.</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="/demo" class="btn-primary">Try Demo</a>
						<a href="/#early-access" class="btn-ghost border border-[var(--border)] px-6 py-3">Join Waitlist</a>
					</div>
				</section>
			</div>
		</div>
	</div>
</main>

<Footer />
