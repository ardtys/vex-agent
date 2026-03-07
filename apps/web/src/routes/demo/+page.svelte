<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Nav from '$lib/components/landing/Nav.svelte';
	import AnimatedBackground from '$lib/components/landing/AnimatedBackground.svelte';

	// Token data simulation
	interface Token {
		symbol: string;
		name: string;
		price: number;
		change24h: number;
		volume: string;
		marketCap: string;
		logo: string;
		sparkline: number[];
	}

	let tokens: Token[] = [
		{ symbol: 'SOL', name: 'Solana', price: 178.45, change24h: 5.23, volume: '$2.4B', marketCap: '$82B', logo: 'S', sparkline: [] },
		{ symbol: 'BONK', name: 'Bonk', price: 0.0000234, change24h: -2.15, volume: '$456M', marketCap: '$1.8B', logo: 'B', sparkline: [] },
		{ symbol: 'WIF', name: 'dogwifhat', price: 2.89, change24h: 12.45, volume: '$890M', marketCap: '$2.9B', logo: 'W', sparkline: [] },
		{ symbol: 'JUP', name: 'Jupiter', price: 1.23, change24h: 3.67, volume: '$234M', marketCap: '$1.5B', logo: 'J', sparkline: [] },
		{ symbol: 'PYTH', name: 'Pyth Network', price: 0.456, change24h: -1.23, volume: '$123M', marketCap: '$890M', logo: 'P', sparkline: [] },
		{ symbol: 'RAY', name: 'Raydium', price: 4.56, change24h: 8.90, volume: '$345M', marketCap: '$567M', logo: 'R', sparkline: [] },
	];

	// Portfolio simulation
	interface PortfolioItem {
		token: string;
		amount: number;
		value: number;
		pnl: number;
		pnlPercent: number;
	}

	let portfolio: PortfolioItem[] = [
		{ token: 'SOL', amount: 25.5, value: 4550.48, pnl: 234.56, pnlPercent: 5.43 },
		{ token: 'BONK', amount: 50000000, value: 1170.00, pnl: -45.23, pnlPercent: -3.72 },
		{ token: 'WIF', amount: 500, value: 1445.00, pnl: 180.50, pnlPercent: 14.27 },
		{ token: 'JUP', amount: 1000, value: 1230.00, pnl: 45.00, pnlPercent: 3.80 },
	];

	// Chat simulation
	interface ChatMessage {
		role: 'user' | 'assistant' | 'tool';
		content: string;
		toolName?: string;
		typing?: boolean;
	}

	let chatMessages: ChatMessage[] = [];
	let currentChatIndex = 0;
	let isTyping = false;

	const demoConversation: ChatMessage[] = [
		{ role: 'user', content: 'What are the trending tokens right now?' },
		{ role: 'tool', content: 'Fetching trending tokens from DexScreener...', toolName: 'get_trending' },
		{ role: 'assistant', content: 'Here are the top trending tokens on Solana:\n\n1. WIF (+12.45%) - $2.89\n2. BONK (-2.15%) - $0.0000234\n3. JUP (+3.67%) - $1.23\n\nWIF is showing strong momentum with high volume.' },
		{ role: 'user', content: 'Swap 1 SOL for WIF' },
		{ role: 'tool', content: 'Getting swap quote from Jupiter...', toolName: 'swap_token' },
		{ role: 'assistant', content: 'Ready to swap:\n\n- From: 1 SOL (~$178.45)\n- To: ~61.7 WIF\n- Price Impact: 0.02%\n- Route: SOL > USDC > WIF\n\nApprove transaction to continue.' },
	];

	// Trading simulator state
	let fromToken = 'SOL';
	let toToken = 'WIF';
	let fromAmount = '1';
	let toAmount = '61.74';
	let isSwapping = false;
	let swapSuccess = false;

	// Live price update interval
	let priceInterval: ReturnType<typeof setInterval>;
	let chatInterval: ReturnType<typeof setInterval>;

	// Generate sparkline data
	function generateSparkline(): number[] {
		const points: number[] = [];
		let value = 50;
		for (let i = 0; i < 20; i++) {
			value += (Math.random() - 0.5) * 10;
			value = Math.max(20, Math.min(80, value));
			points.push(value);
		}
		return points;
	}

	// Update token prices with realistic fluctuation
	function updatePrices() {
		tokens = tokens.map(token => {
			const fluctuation = (Math.random() - 0.5) * 0.02;
			const newPrice = token.price * (1 + fluctuation);
			const newChange = token.change24h + (Math.random() - 0.5) * 0.5;

			// Update sparkline
			const newSparkline = [...token.sparkline.slice(1), 50 + newChange * 2];

			return {
				...token,
				price: newPrice,
				change24h: Math.max(-20, Math.min(20, newChange)),
				sparkline: newSparkline
			};
		});

		// Update portfolio values
		portfolio = portfolio.map(item => {
			const token = tokens.find(t => t.symbol === item.token);
			if (token) {
				const newValue = item.amount * token.price;
				const pnlChange = (Math.random() - 0.5) * 10;
				return {
					...item,
					value: newValue,
					pnl: item.pnl + pnlChange,
					pnlPercent: item.pnlPercent + (Math.random() - 0.5) * 0.5
				};
			}
			return item;
		});
	}

	// Simulate chat typing
	function simulateChat() {
		if (currentChatIndex >= demoConversation.length) {
			currentChatIndex = 0;
			chatMessages = [];
			return;
		}

		const msg = demoConversation[currentChatIndex];
		isTyping = true;

		setTimeout(() => {
			chatMessages = [...chatMessages, msg];
			isTyping = false;
			currentChatIndex++;
		}, msg.role === 'tool' ? 800 : 1500);
	}

	// Handle swap simulation
	function handleSwap() {
		isSwapping = true;
		swapSuccess = false;

		setTimeout(() => {
			isSwapping = false;
			swapSuccess = true;

			setTimeout(() => {
				swapSuccess = false;
			}, 3000);
		}, 2000);
	}

	// Calculate swap output
	function calculateSwap() {
		const fromTokenData = tokens.find(t => t.symbol === fromToken);
		const toTokenData = tokens.find(t => t.symbol === toToken);

		if (fromTokenData && toTokenData && fromAmount) {
			const fromValue = parseFloat(fromAmount) * fromTokenData.price;
			toAmount = (fromValue / toTokenData.price).toFixed(2);
		}
	}

	$: fromAmount, fromToken, toToken, calculateSwap();

	// Active tab state
	let activeTab: 'tokens' | 'portfolio' | 'chat' | 'swap' = 'tokens';

	// Total portfolio value
	$: totalValue = portfolio.reduce((acc, item) => acc + item.value, 0);
	$: totalPnl = portfolio.reduce((acc, item) => acc + item.pnl, 0);

	onMount(() => {
		// Initialize sparklines
		tokens = tokens.map(t => ({ ...t, sparkline: generateSparkline() }));

		// Start live price updates
		priceInterval = setInterval(updatePrices, 2000);

		// Start chat simulation
		chatInterval = setInterval(simulateChat, 4000);
		simulateChat();
	});

	onDestroy(() => {
		if (priceInterval) clearInterval(priceInterval);
		if (chatInterval) clearInterval(chatInterval);
	});

	// Format price based on magnitude
	function formatPrice(price: number): string {
		if (price < 0.0001) return price.toFixed(8);
		if (price < 1) return price.toFixed(6);
		if (price < 100) return price.toFixed(2);
		return price.toFixed(2);
	}

	// Format large numbers
	function formatValue(value: number): string {
		if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
		if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
		return `$${value.toFixed(2)}`;
	}

	// Draw sparkline SVG path
	function getSparklinePath(data: number[]): string {
		if (data.length < 2) return '';
		const width = 80;
		const height = 30;
		const stepX = width / (data.length - 1);

		return data.map((y, i) => {
			const x = i * stepX;
			const normalizedY = height - (y / 100) * height;
			return `${i === 0 ? 'M' : 'L'} ${x} ${normalizedY}`;
		}).join(' ');
	}
</script>

<svelte:head>
	<title>VEX Demo - Interactive Trading Simulator</title>
	<meta name="description" content="Try VEX's interactive demo - experience AI-powered Solana trading without connecting your wallet." />
</svelte:head>

<AnimatedBackground />
<Nav />

<main class="relative min-h-screen pt-24 pb-16 px-4 md:px-6">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--lime)]/10 border border-[var(--lime)]/20 mb-6">
				<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
				<span class="text-xs font-mono text-[var(--lime)] uppercase tracking-wider">Live Demo Mode</span>
			</div>

			<h1 class="font-display text-5xl md:text-7xl text-[var(--white)] mb-4">
				INTERACTIVE <span class="text-[var(--lime)] text-glow-lime">DEMO</span>
			</h1>
			<p class="text-[var(--muted)] text-lg max-w-2xl mx-auto">
				Experience VEX's powerful features without connecting your wallet.
				All data is simulated for demonstration purposes.
			</p>
		</div>

		<!-- Tab Navigation -->
		<div class="flex justify-center gap-2 mb-8 flex-wrap">
			{#each ['tokens', 'portfolio', 'chat', 'swap'] as tab}
				<button
					class="px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all duration-300
						{activeTab === tab
							? 'bg-[var(--lime)] text-[var(--black)]'
							: 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--white)] border border-[var(--border)] hover:border-[var(--lime)]/30'}"
					on:click={() => activeTab = tab}
				>
					{tab === 'tokens' ? 'Live Tokens' : tab === 'portfolio' ? 'Portfolio' : tab === 'chat' ? 'AI Chat' : 'Swap'}
				</button>
			{/each}
		</div>

		<!-- Content Panels -->
		<div class="relative">
			<!-- Live Tokens Panel -->
			{#if activeTab === 'tokens'}
				<div class="animate-fade-in-up">
					<div class="grid gap-4">
						<!-- Header Row -->
						<div class="hidden md:grid grid-cols-6 gap-4 px-6 py-3 text-xs text-[var(--muted)] uppercase tracking-wider">
							<span>Token</span>
							<span class="text-right">Price</span>
							<span class="text-right">24h Change</span>
							<span class="text-right">Volume</span>
							<span class="text-right">Market Cap</span>
							<span class="text-right">Trend</span>
						</div>

						<!-- Token Rows -->
						{#each tokens as token, i}
							<div
								class="glass border border-[var(--border)] rounded-lg p-4 md:p-6 card-hover group"
								style="animation-delay: {i * 100}ms"
							>
								<div class="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
									<!-- Token Info -->
									<div class="flex items-center gap-3">
										<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--lime)]/20 to-[var(--lime)]/5 flex items-center justify-center text-[var(--lime)] font-bold text-lg border border-[var(--lime)]/20">
											{token.logo}
										</div>
										<div>
											<div class="font-bold text-[var(--white)] group-hover:text-[var(--lime)] transition-colors">
												{token.symbol}
											</div>
											<div class="text-xs text-[var(--muted)]">{token.name}</div>
										</div>
									</div>

									<!-- Price -->
									<div class="text-right">
										<div class="font-mono text-[var(--white)]">
											${formatPrice(token.price)}
										</div>
									</div>

									<!-- 24h Change -->
									<div class="text-right">
										<span class="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-mono
											{token.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
											{token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
										</span>
									</div>

									<!-- Volume -->
									<div class="text-right text-[var(--muted)] font-mono hidden md:block">
										{token.volume}
									</div>

									<!-- Market Cap -->
									<div class="text-right text-[var(--muted)] font-mono hidden md:block">
										{token.marketCap}
									</div>

									<!-- Sparkline -->
									<div class="justify-self-end hidden md:block">
										<svg width="80" height="30" class="overflow-visible">
											<path
												d={getSparklinePath(token.sparkline)}
												fill="none"
												stroke={token.change24h >= 0 ? '#27c93f' : '#ff2d2d'}
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- Live indicator -->
					<div class="flex items-center justify-center gap-2 mt-6 text-xs text-[var(--muted)]">
						<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
						Prices updating every 2 seconds
					</div>
				</div>
			{/if}

			<!-- Portfolio Panel -->
			{#if activeTab === 'portfolio'}
				<div class="animate-fade-in-up">
					<!-- Portfolio Summary -->
					<div class="glass border border-[var(--border)] rounded-lg p-6 mb-6">
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Total Value</div>
								<div class="font-display text-4xl text-[var(--white)]">
									{formatValue(totalValue)}
								</div>
							</div>
							<div>
								<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Total P&L</div>
								<div class="font-display text-4xl {totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}">
									{totalPnl >= 0 ? '+' : ''}{formatValue(Math.abs(totalPnl))}
								</div>
							</div>
							<div>
								<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Assets</div>
								<div class="font-display text-4xl text-[var(--white)]">
									{portfolio.length}
								</div>
							</div>
						</div>
					</div>

					<!-- Portfolio Items -->
					<div class="grid gap-4">
						{#each portfolio as item, i}
							<div
								class="glass border border-[var(--border)] rounded-lg p-6 card-hover cursor-grab active:cursor-grabbing group"
								style="animation-delay: {i * 100}ms"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-4">
										<div class="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--lime)]/20 to-[var(--lime)]/5 flex items-center justify-center text-[var(--lime)] font-bold text-xl border border-[var(--lime)]/20">
											{item.token.charAt(0)}
										</div>
										<div>
											<div class="font-bold text-lg text-[var(--white)] group-hover:text-[var(--lime)] transition-colors">
												{item.token}
											</div>
											<div class="text-sm text-[var(--muted)] font-mono">
												{item.amount.toLocaleString()} tokens
											</div>
										</div>
									</div>

									<div class="text-right">
										<div class="font-mono text-lg text-[var(--white)]">
											{formatValue(item.value)}
										</div>
										<div class="flex items-center justify-end gap-2">
											<span class="text-sm font-mono {item.pnl >= 0 ? 'text-green-400' : 'text-red-400'}">
												{item.pnl >= 0 ? '+' : ''}{formatValue(Math.abs(item.pnl))}
											</span>
											<span class="text-xs px-2 py-0.5 rounded {item.pnlPercent >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
												{item.pnlPercent >= 0 ? '+' : ''}{item.pnlPercent.toFixed(2)}%
											</span>
										</div>
									</div>
								</div>

								<!-- Progress bar -->
								<div class="mt-4 h-1 bg-[var(--border)] rounded-full overflow-hidden">
									<div
										class="h-full bg-gradient-to-r from-[var(--lime)] to-[var(--lime)]/50 transition-all duration-500"
										style="width: {(item.value / totalValue) * 100}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- AI Chat Panel -->
			{#if activeTab === 'chat'}
				<div class="animate-fade-in-up max-w-3xl mx-auto">
					<div class="glass border border-[var(--border)] rounded-lg overflow-hidden">
						<!-- Chat Header -->
						<div class="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]/50">
							<div class="flex items-center gap-3">
								<div class="w-8 h-8 rounded-full bg-[var(--lime)] flex items-center justify-center">
									<span class="text-[var(--black)] font-bold text-sm">V</span>
								</div>
								<div>
									<div class="font-bold text-[var(--white)]">VEX Agent</div>
									<div class="text-xs text-[var(--muted)]">Powered by Qwen2.5-72B</div>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
								<span class="text-xs text-[var(--lime)]">Online</span>
							</div>
						</div>

						<!-- Chat Messages -->
						<div class="p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
							{#each chatMessages as msg, i}
								<div
									class="animate-fade-in-up"
									style="animation-delay: {i * 100}ms"
								>
									{#if msg.role === 'user'}
										<div class="flex justify-end">
											<div class="bg-[var(--lime)]/10 border border-[var(--lime)]/20 rounded-lg px-4 py-3 max-w-[80%]">
												<p class="text-[var(--white)] text-sm">{msg.content}</p>
											</div>
										</div>
									{:else if msg.role === 'tool'}
										<div class="flex items-center gap-2 text-xs text-[var(--muted)] py-2">
											<div class="w-4 h-4 border-2 border-[var(--lime)]/30 border-t-[var(--lime)] rounded-full animate-spin"></div>
											<span class="font-mono">{msg.toolName}</span>
											<span>-</span>
											<span>{msg.content}</span>
										</div>
									{:else}
										<div class="flex gap-3">
											<div class="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
												<span class="text-[var(--lime)] font-bold text-xs">V</span>
											</div>
											<div class="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 max-w-[80%]">
												<p class="text-[var(--white)] text-sm whitespace-pre-line">{msg.content}</p>
											</div>
										</div>
									{/if}
								</div>
							{/each}

							{#if isTyping}
								<div class="flex gap-3">
									<div class="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
										<span class="text-[var(--lime)] font-bold text-xs">V</span>
									</div>
									<div class="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3">
										<div class="flex gap-1">
											<span class="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style="animation-delay: 0ms"></span>
											<span class="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style="animation-delay: 150ms"></span>
											<span class="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style="animation-delay: 300ms"></span>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Chat Input (disabled for demo) -->
						<div class="px-6 py-4 border-t border-[var(--border)]">
							<div class="flex gap-3">
								<input
									type="text"
									placeholder="Connect wallet to chat with VEX..."
									class="input-field flex-1 opacity-50 cursor-not-allowed"
									disabled
								/>
								<button class="btn-primary opacity-50 cursor-not-allowed" disabled>
									Send
								</button>
							</div>
						</div>
					</div>

					<p class="text-center text-xs text-[var(--muted)] mt-4">
						This is a simulated conversation. Connect your wallet to chat with VEX.
					</p>
				</div>
			{/if}

			<!-- Swap Panel -->
			{#if activeTab === 'swap'}
				<div class="animate-fade-in-up max-w-lg mx-auto">
					<div class="glass border border-[var(--border)] rounded-lg p-6">
						<h3 class="font-display text-2xl text-[var(--white)] mb-6">Swap Tokens</h3>

						<!-- From Token -->
						<div class="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-2">
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs text-[var(--muted)] uppercase">From</span>
								<span class="text-xs text-[var(--muted)]">Balance: 25.5 SOL</span>
							</div>
							<div class="flex items-center gap-4">
								<input
									type="number"
									bind:value={fromAmount}
									class="flex-1 bg-transparent text-2xl font-mono text-[var(--white)] outline-none"
									placeholder="0.0"
								/>
								<select
									bind:value={fromToken}
									class="bg-[var(--black)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--white)] font-mono cursor-pointer"
								>
									{#each tokens as token}
										<option value={token.symbol}>{token.symbol}</option>
									{/each}
								</select>
							</div>
						</div>

						<!-- Swap Arrow -->
						<div class="flex justify-center -my-2 relative z-10">
							<button
								class="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--lime)] hover:bg-[var(--lime)] hover:text-[var(--black)] transition-all duration-300"
								on:click={() => {
									const temp = fromToken;
									fromToken = toToken;
									toToken = temp;
								}}
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
								</svg>
							</button>
						</div>

						<!-- To Token -->
						<div class="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-6">
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs text-[var(--muted)] uppercase">To (estimated)</span>
								<span class="text-xs text-[var(--muted)]">Balance: 0 {toToken}</span>
							</div>
							<div class="flex items-center gap-4">
								<input
									type="text"
									value={toAmount}
									class="flex-1 bg-transparent text-2xl font-mono text-[var(--white)] outline-none"
									placeholder="0.0"
									disabled
								/>
								<select
									bind:value={toToken}
									class="bg-[var(--black)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--white)] font-mono cursor-pointer"
								>
									{#each tokens as token}
										<option value={token.symbol}>{token.symbol}</option>
									{/each}
								</select>
							</div>
						</div>

						<!-- Swap Details -->
						<div class="space-y-2 mb-6 text-sm">
							<div class="flex justify-between text-[var(--muted)]">
								<span>Rate</span>
								<span class="font-mono">1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount || '1')).toFixed(4)} {toToken}</span>
							</div>
							<div class="flex justify-between text-[var(--muted)]">
								<span>Price Impact</span>
								<span class="font-mono text-green-400">&lt;0.01%</span>
							</div>
							<div class="flex justify-between text-[var(--muted)]">
								<span>Network Fee</span>
								<span class="font-mono">~0.00005 SOL</span>
							</div>
							<div class="flex justify-between text-[var(--muted)]">
								<span>Route</span>
								<span class="font-mono text-[var(--lime)]">{fromToken} → USDC → {toToken}</span>
							</div>
						</div>

						<!-- Swap Button -->
						<button
							class="w-full btn-primary py-4 text-base relative overflow-hidden"
							on:click={handleSwap}
							disabled={isSwapping}
						>
							{#if isSwapping}
								<span class="flex items-center justify-center gap-2">
									<span class="w-4 h-4 border-2 border-[var(--black)]/30 border-t-[var(--black)] rounded-full animate-spin"></span>
									Processing...
								</span>
							{:else if swapSuccess}
								<span class="flex items-center justify-center gap-2 text-green-600">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Swap Successful!
								</span>
							{:else}
								Swap {fromToken} for {toToken}
							{/if}
						</button>

						<p class="text-center text-xs text-[var(--muted)] mt-4">
							Demo mode - No real transactions
						</p>
					</div>

					<!-- Powered by Jupiter -->
					<div class="flex items-center justify-center gap-2 mt-6 text-sm text-[var(--muted)]">
						<span>Powered by</span>
						<span class="font-bold text-[var(--white)]">Jupiter</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- CTA Section -->
		<div class="text-center mt-16 pt-16 border-t border-[var(--border)]">
			<h2 class="font-display text-3xl md:text-4xl text-[var(--white)] mb-4">
				Ready to trade for real?
			</h2>
			<p class="text-[var(--muted)] mb-8 max-w-md mx-auto">
				Connect your Solana wallet and start trading with VEX's AI-powered agent.
			</p>
			<a href="/app" class="btn-primary text-lg px-8 py-4">
				Launch App
			</a>
		</div>
	</div>
</main>

<style>
	.animate-fade-in-up {
		animation: fade-in-up 0.5s ease-out forwards;
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
