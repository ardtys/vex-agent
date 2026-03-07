<script lang="ts">
	import Nav from '$lib/components/landing/Nav.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import { reveal, stagger } from '$lib/actions/reveal';

	const tools = [
		{
			id: 'swap',
			name: 'Jupiter Swap',
			tag: 'TRADING',
			icon: '⚡',
			description: 'Execute token swaps with optimal routing across all major Solana DEXs. Jupiter aggregates liquidity from 20+ sources including Raydium, Orca, Meteora, Phoenix, and Lifinity to ensure you always get the best possible price.',
			longDescription: 'Jupiter is the most powerful swap aggregator on Solana, routing your trades through multiple DEXs simultaneously to minimize slippage and maximize output. VEX integrates directly with Jupiter V6 API, supporting advanced features like split routes, multi-hop swaps, and dynamic slippage protection.',
			commands: [
				{ cmd: 'swap 5 SOL for WIF', desc: 'Basic swap with automatic best route' },
				{ cmd: 'buy 100 USDC worth of BONK with 1% slippage', desc: 'Swap with custom slippage tolerance' },
				{ cmd: 'sell half my WIF for SOL', desc: 'Percentage-based selling' },
				{ cmd: 'swap all my USDC to SOL', desc: 'Full balance swap' }
			],
			features: [
				{ name: 'Best Price Routing', desc: 'Aggregates 20+ DEXs to find optimal swap path' },
				{ name: 'Slippage Protection', desc: 'Configurable slippage with MEV protection' },
				{ name: 'Multi-hop Swaps', desc: 'Routes through intermediate tokens for better rates' },
				{ name: 'Priority Fee Optimization', desc: 'Dynamic fees for faster confirmation' },
				{ name: 'Split Routes', desc: 'Splits large orders across multiple pools' },
				{ name: 'Price Impact Preview', desc: 'Shows estimated price impact before execution' }
			],
			api: 'Jupiter Aggregator V6',
			docsUrl: 'https://station.jup.ag/docs',
			riskLevel: 'LOW',
			requiresApproval: true
		},
		{
			id: 'portfolio',
			name: 'Portfolio Tracker',
			tag: 'ANALYTICS',
			icon: '📊',
			description: 'Real-time portfolio tracking with comprehensive PnL calculations, historical performance analysis, and detailed token breakdowns. Monitor your entire Solana portfolio in one place.',
			longDescription: 'Get instant visibility into your wallet holdings powered by Helius DAS API. VEX fetches real-time token balances, calculates USD values using Birdeye price feeds, and tracks your profit/loss over configurable time periods. Perfect for serious traders who need accurate performance metrics.',
			commands: [
				{ cmd: 'show my portfolio', desc: 'Display all holdings with current values' },
				{ cmd: "what's my PnL this week", desc: 'Calculate 7-day profit/loss' },
				{ cmd: 'show my top 5 holdings', desc: 'List largest positions by value' },
				{ cmd: 'how much SOL do I have', desc: 'Check specific token balance' },
				{ cmd: 'portfolio performance last 30 days', desc: 'Monthly performance summary' }
			],
			features: [
				{ name: 'Real-time Balances', desc: 'Live token balances via Helius DAS API' },
				{ name: 'USD Valuation', desc: 'Accurate pricing from Birdeye aggregated feeds' },
				{ name: 'PnL Tracking', desc: 'Realized and unrealized profit/loss calculations' },
				{ name: 'Win Rate Analysis', desc: 'Track your trading success percentage' },
				{ name: 'Historical Performance', desc: '24h, 7d, and 30d performance metrics' },
				{ name: 'Best/Worst Trades', desc: 'Identify your most profitable and losing positions' }
			],
			api: 'Helius DAS + Birdeye',
			docsUrl: 'https://docs.helius.dev',
			riskLevel: 'NONE',
			requiresApproval: false
		},
		{
			id: 'rugcheck',
			name: 'Rug Check Scanner',
			tag: 'SECURITY',
			icon: '🛡️',
			description: 'Comprehensive token security analysis to identify potential rug pull indicators. Checks ownership concentration, liquidity locks, contract permissions, mint authority, and historical risk patterns.',
			longDescription: 'Before you ape into a new token, let VEX analyze it for common rug pull indicators. We integrate with RugCheck.xyz to provide detailed security reports including LP lock status, mint/freeze authority analysis, top holder concentration, and historical pattern matching. Get a risk score and actionable insights before you trade.',
			commands: [
				{ cmd: 'check if PUMP is safe', desc: 'Full security analysis of token' },
				{ cmd: 'rug check this address: So11...', desc: 'Analyze token by mint address' },
				{ cmd: 'is WIF a rug', desc: 'Quick rug assessment' },
				{ cmd: 'analyze token safety for BONK', desc: 'Detailed safety report' },
				{ cmd: 'check liquidity lock for MYTOKEN', desc: 'LP lock verification' }
			],
			features: [
				{ name: 'Mint Authority Check', desc: 'Detects if token supply can be inflated' },
				{ name: 'Freeze Authority Check', desc: 'Identifies if tokens can be frozen' },
				{ name: 'LP Lock Verification', desc: 'Confirms liquidity is locked and for how long' },
				{ name: 'Holder Concentration', desc: 'Analyzes top wallet distribution' },
				{ name: 'Risk Score', desc: '0-100 risk rating with breakdown' },
				{ name: 'Historical Patterns', desc: 'Compares against known rug indicators' }
			],
			api: 'RugCheck.xyz API',
			docsUrl: 'https://rugcheck.xyz',
			riskLevel: 'NONE',
			requiresApproval: false
		},
		{
			id: 'trending',
			name: 'Trending Scanner',
			tag: 'DISCOVERY',
			icon: '🔥',
			description: 'Discover trending tokens on Solana in real-time. Find hot memecoins, top gainers, high-volume tokens, and emerging opportunities before they go mainstream.',
			longDescription: 'Stay ahead of the market with VEX trending scanner powered by Birdeye. Get real-time data on the hottest tokens sorted by volume, price change, or social momentum. Filter by timeframe (1h, 4h, 24h) and market cap to find opportunities that match your trading style.',
			commands: [
				{ cmd: 'show trending tokens', desc: 'Top 10 trending by volume' },
				{ cmd: "what's hot right now", desc: 'Real-time trending overview' },
				{ cmd: 'top gainers today', desc: 'Highest 24h price increases' },
				{ cmd: 'trending memecoins this hour', desc: 'Hot memes in last hour' },
				{ cmd: 'show me low cap gems', desc: 'Trending tokens under $1M mcap' }
			],
			features: [
				{ name: 'Real-time Trends', desc: 'Live data updated every minute' },
				{ name: 'Volume Analysis', desc: 'Track unusual volume spikes' },
				{ name: 'Price Momentum', desc: 'Identify tokens with strong momentum' },
				{ name: 'Timeframe Filters', desc: '1h, 4h, 24h trending windows' },
				{ name: 'Market Cap Filters', desc: 'Filter by micro, small, mid cap' },
				{ name: 'Social Signals', desc: 'Integration with social sentiment (coming soon)' }
			],
			api: 'Birdeye API',
			docsUrl: 'https://docs.birdeye.so',
			riskLevel: 'NONE',
			requiresApproval: false
		},
		{
			id: 'tokeninfo',
			name: 'Token Intelligence',
			tag: 'DATA',
			icon: '📈',
			description: 'Get comprehensive data about any Solana token including price, market cap, volume, holders, liquidity depth, and detailed metadata. Essential information for informed trading decisions.',
			longDescription: 'Make data-driven decisions with complete token intelligence. VEX combines data from Birdeye and Helius to provide you with everything you need to know about a token: current price, historical price changes, market cap ranking, 24h volume, holder count, liquidity depth, and token metadata including social links.',
			commands: [
				{ cmd: 'info on WIF', desc: 'Complete token overview' },
				{ cmd: "what's the price of BONK", desc: 'Current price with 24h change' },
				{ cmd: 'show me SOL market cap', desc: 'Market cap and ranking' },
				{ cmd: 'POPCAT volume today', desc: '24h trading volume' },
				{ cmd: 'how many holders does WIF have', desc: 'Holder count and distribution' },
				{ cmd: 'liquidity depth for MYTOKEN', desc: 'Available liquidity analysis' }
			],
			features: [
				{ name: 'Real-time Price', desc: 'Current price with update timestamp' },
				{ name: 'Price Changes', desc: '1h, 4h, 24h, 7d price movements' },
				{ name: 'Market Cap', desc: 'Fully diluted and circulating mcap' },
				{ name: 'Volume Analytics', desc: '24h volume with buy/sell ratio' },
				{ name: 'Holder Stats', desc: 'Total holders and distribution curve' },
				{ name: 'Liquidity Depth', desc: 'Available liquidity across DEXs' }
			],
			api: 'Birdeye + Helius',
			docsUrl: 'https://docs.birdeye.so',
			riskLevel: 'NONE',
			requiresApproval: false
		},
		{
			id: 'send',
			name: 'SOL Transfer',
			tag: 'WALLET',
			icon: '💸',
			description: 'Send SOL to any Solana wallet address securely. VEX prepares the transaction and you approve it with your wallet — simple, fast, and safe.',
			longDescription: 'Need to send SOL to another wallet? Just tell VEX the amount and destination. We build the transfer transaction with optimal compute budget, show you the exact details including fees, and wait for your wallet signature before broadcasting. All transactions are transparent and require your explicit approval.',
			commands: [
				{ cmd: 'send 1 SOL to Abc123...', desc: 'Basic SOL transfer' },
				{ cmd: 'transfer 0.5 SOL to my-friend.sol', desc: 'Send to SNS domain' },
				{ cmd: 'send all my SOL to backup wallet', desc: 'Full balance transfer' }
			],
			features: [
				{ name: 'Address Validation', desc: 'Verifies recipient is valid Solana address' },
				{ name: 'SNS Support', desc: 'Send to .sol domain names' },
				{ name: 'Fee Estimation', desc: 'Shows network fee before signing' },
				{ name: 'Balance Check', desc: 'Prevents sending more than available' },
				{ name: 'Transaction Preview', desc: 'Full details before approval' },
				{ name: 'Confirmation Tracking', desc: 'Real-time transaction status' }
			],
			api: 'Solana Web3.js',
			docsUrl: 'https://solana.com/docs',
			riskLevel: 'MEDIUM',
			requiresApproval: true
		},
		{
			id: 'launch',
			name: 'Pump.fun Launch',
			tag: 'LAUNCH',
			icon: '🚀',
			description: 'Deploy memecoins instantly on Pump.fun with automatic bonding curve setup. Set your token name, symbol, description, and image — VEX handles the rest.',
			longDescription: 'Launch your own memecoin in seconds. VEX integrates with Pump.fun to let you deploy tokens with full bonding curve mechanics. Just provide the token details (name, symbol, description, image URL) and we prepare the launch transaction. Your token will be tradeable immediately after deployment with automatic liquidity.',
			commands: [
				{ cmd: 'launch token called MYDEGEN', desc: 'Quick launch with name' },
				{ cmd: 'create memecoin $MOON with rocket emoji', desc: 'Launch with custom branding' },
				{ cmd: 'deploy token CATS description "For cat lovers"', desc: 'Launch with description' }
			],
			features: [
				{ name: 'Instant Deployment', desc: 'Token live in one transaction' },
				{ name: 'Bonding Curve', desc: 'Automatic price discovery mechanism' },
				{ name: 'Custom Metadata', desc: 'Set name, symbol, description, image' },
				{ name: 'Automatic Liquidity', desc: 'No manual LP needed' },
				{ name: 'Fair Launch', desc: 'No presale, everyone starts equal' },
				{ name: 'Graduation Path', desc: 'Migrate to Raydium at $69K mcap' }
			],
			api: 'Pump.fun API',
			docsUrl: 'https://pump.fun',
			riskLevel: 'HIGH',
			requiresApproval: true
		}
	];

	const comingSoon = [
		{
			name: 'Limit Orders',
			description: 'Set price targets for automatic buy/sell execution. Place orders that trigger when tokens hit your specified price.',
			eta: 'Q1 2025'
		},
		{
			name: 'DCA Bot',
			description: 'Dollar cost average into any token with scheduled recurring purchases. Set frequency, amount, and duration.',
			eta: 'Q1 2025'
		},
		{
			name: 'Copy Trading',
			description: 'Follow successful wallets and automatically mirror their trades. Set allocation limits and filters.',
			eta: 'Q2 2025'
		},
		{
			name: 'NFT Trading',
			description: 'Buy, sell, and analyze NFTs via Tensor and Magic Eden. Floor sweeping, trait sniping, and collection analytics.',
			eta: 'Q2 2025'
		},
		{
			name: 'Perps Trading',
			description: 'Leverage trading on Jupiter Perps. Open long/short positions with up to 100x leverage on SOL, ETH, BTC.',
			eta: 'Q2 2025'
		},
		{
			name: 'Yield Farming',
			description: 'Discover and enter yield opportunities across Solana DeFi. Auto-compound and manage LP positions.',
			eta: 'Q3 2025'
		}
	];
</script>

<svelte:head>
	<title>Tools - VEX | Complete Solana Trading Toolkit</title>
	<meta name="description" content="Explore VEX tools: Jupiter swaps, portfolio tracking, rug checks, trending scanner, token intelligence, and more. Everything you need for Solana trading." />
</svelte:head>

<Nav />

<main class="pt-24 pb-16">
	<!-- Hero -->
	<section class="px-6 py-16">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>Tool Registry</span>
			</div>
			<h1 class="font-display text-5xl md:text-8xl text-[var(--white)] mb-6" use:reveal={{ delay: 100 }}>
				POWERFUL TOOLS.<br /><span class="text-[var(--lime)]">SIMPLE COMMANDS.</span>
			</h1>
			<p class="font-serif italic text-xl text-[var(--muted)] max-w-3xl mb-8" use:reveal={{ delay: 200 }}>
				VEX integrates with the best infrastructure on Solana. Every tool is accessible through natural language — no complex interfaces, no learning curves. Just tell VEX what you want.
			</p>
			<div class="flex flex-wrap gap-4" use:reveal={{ delay: 300 }}>
				<div class="flex items-center gap-2 text-sm text-[var(--muted)]">
					<span class="w-2 h-2 bg-[var(--lime)] rounded-full"></span>
					<span>{tools.length} Active Tools</span>
				</div>
				<div class="flex items-center gap-2 text-sm text-[var(--muted)]">
					<span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
					<span>{comingSoon.length} Coming Soon</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Quick Navigation -->
	<section class="px-6 py-8 border-y border-[var(--border)]">
		<div class="max-w-[1400px] mx-auto">
			<div class="flex flex-wrap gap-3">
				{#each tools as tool}
					<a
						href="#{tool.id}"
						class="text-xs font-mono px-3 py-2 border border-[var(--border)] hover:border-[var(--lime)] hover:text-[var(--lime)] transition-colors"
					>
						{tool.icon} {tool.name}
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Tools Grid -->
	<section class="px-6 py-16">
		<div class="max-w-[1400px] mx-auto">
			<div class="space-y-24">
				{#each tools as tool, i}
					<div
						id={tool.id}
						class="scroll-mt-24"
						use:reveal
					>
						<!-- Header -->
						<div class="flex flex-wrap items-center gap-4 mb-6">
							<span class="text-4xl">{tool.icon}</span>
							<h2 class="font-display text-4xl md:text-5xl text-[var(--white)]">
								{tool.name}
							</h2>
							<span class="text-[10px] text-[var(--lime)] font-mono tracking-wider px-2 py-1 border border-[var(--lime)]">
								{tool.tag}
							</span>
							{#if tool.requiresApproval}
								<span class="text-[10px] text-yellow-500 font-mono tracking-wider px-2 py-1 border border-yellow-500">
									REQUIRES APPROVAL
								</span>
							{/if}
						</div>

						<!-- Description -->
						<p class="text-lg text-[var(--muted)] leading-relaxed mb-4 max-w-4xl">
							{tool.description}
						</p>
						<p class="text-sm text-[var(--muted)] leading-relaxed mb-8 max-w-4xl opacity-80">
							{tool.longDescription}
						</p>

						<div class="grid lg:grid-cols-3 gap-8">
							<!-- Features -->
							<div class="lg:col-span-2">
								<h4 class="text-xs text-[var(--muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
									<span class="w-8 h-[1px] bg-[var(--lime)]"></span>
									Features & Capabilities
								</h4>
								<div class="grid sm:grid-cols-2 gap-4">
									{#each tool.features as feature}
										<div class="bg-[var(--surface)] border border-[var(--border)] p-4">
											<h5 class="text-sm text-[var(--white)] font-medium mb-1 flex items-center gap-2">
												<span class="text-[var(--lime)]">✓</span>
												{feature.name}
											</h5>
											<p class="text-xs text-[var(--muted)]">{feature.desc}</p>
										</div>
									{/each}
								</div>
							</div>

							<!-- Example Commands -->
							<div>
								<h4 class="text-xs text-[var(--muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
									<span class="w-8 h-[1px] bg-[var(--lime)]"></span>
									Example Commands
								</h4>
								<div class="bg-[var(--surface)] border border-[var(--border)] p-4 space-y-4">
									{#each tool.commands as cmd}
										<div>
											<div class="bg-[var(--black)] px-3 py-2 font-mono text-sm mb-1">
												<span class="text-[var(--lime)]">&gt;</span>
												<span class="text-[var(--white)]"> {cmd.cmd}</span>
											</div>
											<p class="text-xs text-[var(--muted)] pl-3">{cmd.desc}</p>
										</div>
									{/each}
								</div>

								<!-- Meta Info -->
								<div class="mt-4 space-y-2 text-xs">
									<div class="flex justify-between text-[var(--muted)]">
										<span>API Provider</span>
										<span class="text-[var(--white)]">{tool.api}</span>
									</div>
									<div class="flex justify-between text-[var(--muted)]">
										<span>Risk Level</span>
										<span class="{tool.riskLevel === 'NONE' ? 'text-green-500' : tool.riskLevel === 'LOW' ? 'text-[var(--lime)]' : tool.riskLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-red-500'}">
											{tool.riskLevel}
										</span>
									</div>
								</div>
							</div>
						</div>

						{#if i < tools.length - 1}
							<div class="border-b border-[var(--border)] mt-16"></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Coming Soon -->
	<section class="px-6 py-16 bg-[var(--surface)]">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>Roadmap</span>
			</div>
			<h2 class="font-display text-4xl md:text-6xl text-[var(--white)] mb-4" use:reveal={{ delay: 100 }}>
				MORE <span class="text-[var(--lime)]">POWER</span> COMING
			</h2>
			<p class="text-[var(--muted)] mb-12 max-w-2xl" use:reveal={{ delay: 150 }}>
				We're constantly expanding VEX capabilities. Here's what's on our roadmap — all accessible through the same simple chat interface.
			</p>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" use:stagger={{ staggerDelay: 100 }}>
				{#each comingSoon as item}
					<div class="border border-[var(--border)] border-dashed p-6 hover:border-[var(--lime)] transition-colors group">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-display text-xl text-[var(--white)] group-hover:text-[var(--lime)] transition-colors">
								{item.name}
							</h3>
							<span class="text-[10px] font-mono text-[var(--muted)] px-2 py-1 bg-[var(--black)]">
								{item.eta}
							</span>
						</div>
						<p class="text-[var(--muted)] text-sm leading-relaxed">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Integration Partners -->
	<section class="px-6 py-16">
		<div class="max-w-[1400px] mx-auto">
			<div class="section-label" use:reveal>
				<span>Powered By</span>
			</div>
			<h2 class="font-display text-3xl text-[var(--white)] mb-8" use:reveal={{ delay: 100 }}>
				BEST-IN-CLASS <span class="text-[var(--lime)]">INFRASTRUCTURE</span>
			</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4" use:stagger={{ staggerDelay: 100 }}>
				<div class="border border-[var(--border)] p-6 text-center">
					<div class="font-display text-xl text-[var(--white)] mb-1">Jupiter</div>
					<div class="text-xs text-[var(--muted)]">Swap Aggregation</div>
				</div>
				<div class="border border-[var(--border)] p-6 text-center">
					<div class="font-display text-xl text-[var(--white)] mb-1">Helius</div>
					<div class="text-xs text-[var(--muted)]">RPC & DAS API</div>
				</div>
				<div class="border border-[var(--border)] p-6 text-center">
					<div class="font-display text-xl text-[var(--white)] mb-1">Birdeye</div>
					<div class="text-xs text-[var(--muted)]">Market Data</div>
				</div>
				<div class="border border-[var(--border)] p-6 text-center">
					<div class="font-display text-xl text-[var(--white)] mb-1">RugCheck</div>
					<div class="text-xs text-[var(--muted)]">Security Analysis</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="px-6 py-16 bg-[var(--surface)]">
		<div class="max-w-[800px] mx-auto text-center" use:reveal>
			<h2 class="font-display text-4xl text-[var(--white)] mb-4">
				READY TO <span class="text-[var(--lime)]">TRADE SMARTER?</span>
			</h2>
			<p class="text-[var(--muted)] mb-8">
				All these tools are available right now. Start trading with natural language.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/app" class="btn-primary">Launch App</a>
				<a href="/how-it-works" class="btn-ghost border border-[var(--border)] px-6 py-3">How It Works</a>
			</div>
		</div>
	</section>
</main>

<Footer />
