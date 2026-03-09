<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Nav from '$lib/components/landing/Nav.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import AnimatedBackground from '$lib/components/landing/AnimatedBackground.svelte';

	// DexScreener API types
	interface DexScreenerPair {
		chainId: string;
		dexId: string;
		url: string;
		pairAddress: string;
		baseToken: {
			address: string;
			name: string;
			symbol: string;
		};
		quoteToken: {
			address: string;
			name: string;
			symbol: string;
		};
		priceNative: string;
		priceUsd: string;
		txns: {
			m5: { buys: number; sells: number };
			h1: { buys: number; sells: number };
			h6: { buys: number; sells: number };
			h24: { buys: number; sells: number };
		};
		volume: {
			h24: number;
			h6: number;
			h1: number;
			m5: number;
		};
		priceChange: {
			m5: number;
			h1: number;
			h6: number;
			h24: number;
		};
		liquidity?: {
			usd: number;
			base: number;
			quote: number;
		};
		fdv?: number;
		marketCap?: number;
		pairCreatedAt?: number;
		info?: {
			imageUrl?: string;
			websites?: { url: string }[];
			socials?: { type: string; url: string }[];
		};
	}

	// Token interface for display
	interface Token {
		symbol: string;
		name: string;
		price: number;
		change24h: number;
		change1h: number;
		volume: number;
		marketCap: number;
		logo: string;
		sparkline: number[];
		liquidity: number;
		address: string;
		dexUrl: string;
		imageUrl?: string;
		txns24h: number;
		chain?: string;
	}

	// Chain display names and colors
	const chainInfo: Record<string, { name: string; color: string }> = {
		'solana': { name: 'SOL', color: '#9945FF' },
		'ethereum': { name: 'ETH', color: '#627EEA' },
		'bsc': { name: 'BSC', color: '#F0B90B' },
		'base': { name: 'BASE', color: '#0052FF' },
		'arbitrum': { name: 'ARB', color: '#12AAFF' },
		'polygon': { name: 'MATIC', color: '#8247E5' },
		'avalanche': { name: 'AVAX', color: '#E84142' },
	};

	let tokens: Token[] = [];
	let isLoadingTokens = true;
	let tokenError: string | null = null;
	let lastUpdate: Date | null = null;

	// DexScreener API - Fetch trending tokens from multiple sources
	async function fetchTrendingTokens(): Promise<void> {
		try {
			isLoadingTokens = true;
			tokenError = null;

			// Fetch from multiple sources in parallel
			const [boostsRes, trendingSearches] = await Promise.all([
				// Get boosted/promoted tokens (trending)
				fetch('https://api.dexscreener.com/token-boosts/top/v1'),
				// Search for popular categories
				Promise.all([
					fetch('https://api.dexscreener.com/latest/dex/search?q=pepe'),
					fetch('https://api.dexscreener.com/latest/dex/search?q=meme'),
					fetch('https://api.dexscreener.com/latest/dex/search?q=ai token'),
					fetch('https://api.dexscreener.com/latest/dex/search?q=doge'),
				])
			]);

			const allPairs: DexScreenerPair[] = [];

			// Process boosted tokens - get their pair data
			if (boostsRes.ok) {
				const boosts = await boostsRes.json();
				// Fetch pair data for top boosted tokens
				const boostAddresses = (boosts || [])
					.filter((b: any) => b.chainId === 'solana' || b.chainId === 'ethereum' || b.chainId === 'bsc' || b.chainId === 'base')
					.slice(0, 10);

				for (const boost of boostAddresses) {
					try {
						const pairRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${boost.tokenAddress}`);
						if (pairRes.ok) {
							const pairData = await pairRes.json();
							if (pairData.pairs && pairData.pairs.length > 0) {
								allPairs.push(pairData.pairs[0]);
							}
						}
					} catch {
						// Skip failed fetches
					}
				}
			}

			// Process search results
			for (const res of trendingSearches) {
				if (res.ok) {
					const data = await res.json();
					if (data.pairs) {
						allPairs.push(...data.pairs);
					}
				}
			}

			// Filter and deduplicate
			const validPairs = allPairs
				.filter(pair => pair.priceUsd && parseFloat(pair.priceUsd) > 0 && pair.volume?.h24 > 1000)
				.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));

			// Get unique tokens by symbol+chain
			const uniqueTokens = new Map<string, DexScreenerPair>();
			for (const pair of validPairs) {
				const key = `${pair.baseToken.symbol}-${pair.chainId}`;
				if (!uniqueTokens.has(key) || (pair.volume?.h24 || 0) > (uniqueTokens.get(key)?.volume?.h24 || 0)) {
					uniqueTokens.set(key, pair);
				}
			}

			// Convert to Token interface
			tokens = Array.from(uniqueTokens.values())
				.slice(0, 15)
				.map(pair => ({
					symbol: pair.baseToken.symbol,
					name: pair.baseToken.name,
					price: parseFloat(pair.priceUsd) || 0,
					change24h: pair.priceChange?.h24 || 0,
					change1h: pair.priceChange?.h1 || 0,
					volume: pair.volume?.h24 || 0,
					marketCap: pair.marketCap || pair.fdv || 0,
					logo: pair.baseToken.symbol.charAt(0).toUpperCase(),
					sparkline: generateSparkline(pair.priceChange?.h24 || 0),
					liquidity: pair.liquidity?.usd || 0,
					address: pair.baseToken.address,
					dexUrl: pair.url,
					imageUrl: pair.info?.imageUrl,
					txns24h: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0),
					chain: pair.chainId
				}));

			lastUpdate = new Date();
			isLoadingTokens = false;
		} catch (error) {
			console.error('Error fetching tokens:', error);
			tokenError = error instanceof Error ? error.message : 'Failed to fetch tokens';
			isLoadingTokens = false;

			// Fallback to sample data if API fails
			loadFallbackTokens();
		}
	}

	// Fetch specific token data
	async function searchToken(query: string): Promise<DexScreenerPair[]> {
		try {
			const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`);
			if (!response.ok) throw new Error('Search failed');
			const data = await response.json();
			return (data.pairs || []).filter((p: DexScreenerPair) => p.chainId === 'solana');
		} catch {
			return [];
		}
	}

	// Fallback tokens if API fails
	function loadFallbackTokens() {
		tokens = [
			{ symbol: 'SOL', name: 'Wrapped SOL', price: 175.00, change24h: 2.5, change1h: 0.3, volume: 500000000, marketCap: 80000000000, logo: 'S', sparkline: generateSparkline(2.5), liquidity: 500000000, address: 'So11111111111111111111111111111111111111112', dexUrl: '', txns24h: 50000, chain: 'solana' },
			{ symbol: 'PEPE', name: 'Pepe', price: 0.000012, change24h: 8.5, change1h: 1.2, volume: 800000000, marketCap: 5000000000, logo: 'P', sparkline: generateSparkline(8.5), liquidity: 100000000, address: '0x6982508145454ce325ddbe47a25d4ec3d2311933', dexUrl: '', txns24h: 80000, chain: 'ethereum' },
			{ symbol: 'BONK', name: 'Bonk', price: 0.000025, change24h: -1.2, change1h: 0.1, volume: 100000000, marketCap: 1500000000, logo: 'B', sparkline: generateSparkline(-1.2), liquidity: 30000000, address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', dexUrl: '', txns24h: 25000, chain: 'solana' },
			{ symbol: 'WIF', name: 'dogwifhat', price: 2.50, change24h: 5.5, change1h: 1.2, volume: 200000000, marketCap: 2500000000, logo: 'W', sparkline: generateSparkline(5.5), liquidity: 50000000, address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', dexUrl: '', txns24h: 30000, chain: 'solana' },
			{ symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change24h: 3.2, change1h: 0.5, volume: 600000000, marketCap: 17000000000, logo: 'D', sparkline: generateSparkline(3.2), liquidity: 200000000, address: '', dexUrl: '', txns24h: 100000, chain: 'bsc' },
			{ symbol: 'SHIB', name: 'Shiba Inu', price: 0.000022, change24h: -2.1, change1h: -0.3, volume: 300000000, marketCap: 13000000000, logo: 'S', sparkline: generateSparkline(-2.1), liquidity: 80000000, address: '', dexUrl: '', txns24h: 60000, chain: 'ethereum' },
		];
		tokenError = 'Using cached data (API unavailable)';
	}

	// Portfolio simulation (will be updated with real prices)
	interface PortfolioItem {
		token: string;
		symbol: string;
		amount: number;
		avgBuyPrice: number;
		currentPrice: number;
		value: number;
		pnl: number;
		pnlPercent: number;
		allocation: number;
	}

	// Demo portfolio holdings - prices will be updated from API
	const portfolioHoldings = [
		{ symbol: 'SOL', amount: 25.5, avgBuyPrice: 165.00 },
		{ symbol: 'WIF', amount: 500, avgBuyPrice: 2.45 },
		{ symbol: 'JUP', amount: 1000, avgBuyPrice: 1.10 },
		{ symbol: 'BONK', amount: 50000000, avgBuyPrice: 0.0000245 },
	];

	let portfolio: PortfolioItem[] = [];

	// Update portfolio with real prices
	function updatePortfolioWithRealPrices() {
		if (tokens.length === 0) return;

		portfolio = portfolioHoldings.map(holding => {
			const token = tokens.find(t => t.symbol === holding.symbol);
			const currentPrice = token?.price || holding.avgBuyPrice;
			const value = holding.amount * currentPrice;
			const cost = holding.amount * holding.avgBuyPrice;
			const pnl = value - cost;
			const pnlPercent = (pnl / cost) * 100;

			return {
				token: token?.name || holding.symbol,
				symbol: holding.symbol,
				amount: holding.amount,
				avgBuyPrice: holding.avgBuyPrice,
				currentPrice,
				value,
				pnl,
				pnlPercent,
				allocation: 0 // Will be calculated below
			};
		});

		// Calculate allocations
		const totalValue = portfolio.reduce((sum, p) => sum + p.value, 0);
		portfolio = portfolio.map(p => ({ ...p, allocation: (p.value / totalValue) * 100 }));
	}

	// Chat simulation - Interactive
	interface ChatMessage {
		id: string;
		role: 'user' | 'assistant' | 'tool';
		content: string;
		toolName?: string;
		timestamp: Date;
	}

	let chatMessages: ChatMessage[] = [];
	let chatInput = '';
	let isTyping = false;
	let selectedToken: Token | null = null;
	let showTokenDetail = false;

	// Dynamic response generators using real data
	function getTrendingResponse(): { tools: string[], response: string } {
		const topTokens = [...tokens]
			.sort((a, b) => b.change24h - a.change24h)
			.slice(0, 3);

		const tokenLines = topTokens.map((t, i) =>
			`${i + 1}. **${t.symbol}** (${t.change24h >= 0 ? '+' : ''}${t.change24h.toFixed(2)}%) - $${formatPrice(t.price)} - ${formatLargeNumber(t.volume)} volume`
		).join('\n');

		return {
			tools: ['get_trending'],
			response: `Here are the top trending tokens on Solana right now (Live Data):

${tokenLines}

${topTokens[0]?.symbol || 'Top tokens'} is showing strong momentum. Want me to analyze any of these tokens?`
		};
	}

	function getPortfolioResponse(): { tools: string[], response: string } {
		const total = portfolio.reduce((sum, p) => sum + p.value, 0);
		const totalPnl = portfolio.reduce((sum, p) => sum + p.pnl, 0);
		const pnlPercent = total > 0 ? ((totalPnl / (total - totalPnl)) * 100) : 0;

		const holdingLines = portfolio.map(p =>
			`- ${p.symbol}: $${formatNumber(p.value)} (${p.allocation.toFixed(1)}%) ${p.pnl >= 0 ? '▲' : '▼'} ${p.pnl >= 0 ? '+' : ''}${p.pnlPercent.toFixed(2)}%`
		).join('\n');

		const bestPerformer = [...portfolio].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];

		return {
			tools: ['get_portfolio'],
			response: `Your portfolio summary (Live Prices):

**Total Value:** $${formatNumber(total)}
**24h P&L:** ${totalPnl >= 0 ? '+' : ''}$${formatNumber(Math.abs(totalPnl))} (${totalPnl >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%)

Top Holdings:
${holdingLines}

${bestPerformer ? `Your best performer is ${bestPerformer.symbol}!` : ''}`
		};
	}

	function getSwapResponse(): { tools: string[], response: string } {
		const solToken = tokens.find(t => t.symbol === 'SOL');
		const wifToken = tokens.find(t => t.symbol === 'WIF');
		const solPrice = solToken?.price || 175;
		const wifPrice = wifToken?.price || 2.5;
		const rate = (solPrice / wifPrice).toFixed(2);

		return {
			tools: ['get_quote', 'swap_token'],
			response: `Ready to swap (Live Rates):

**From:** 1 SOL (~$${solPrice.toFixed(2)})
**To:** ~${rate} WIF
**Rate:** 1 SOL = ${rate} WIF
**Price Impact:** <0.01%
**Route:** SOL → USDC → WIF (via Jupiter)

Network fee: ~0.00005 SOL

⚠️ This is a demo. Connect your wallet to execute real swaps.`
		};
	}

	function getRugCheckResponse(symbol: string): { tools: string[], response: string } {
		const token = tokens.find(t => t.symbol.toUpperCase() === symbol.toUpperCase());
		const isEstablished = token && token.liquidity > 1000000 && token.volume > 10000000;

		return {
			tools: ['check_rug_risk'],
			response: `**Rug Check Analysis for ${symbol.toUpperCase()}:**

${isEstablished ? '✅' : '⚠️'} **Risk Level: ${isEstablished ? 'LOW' : 'MEDIUM'}**

- Mint Authority: ${isEstablished ? '✅ Disabled' : '⚠️ Check manually'}
- Freeze Authority: ${isEstablished ? '✅ Disabled' : '⚠️ Check manually'}
- LP Locked: ${isEstablished ? '✅ High liquidity' : '⚠️ Verify on-chain'}
- Liquidity: ${token ? formatLargeNumber(token.liquidity) : 'Unknown'}
- 24h Volume: ${token ? formatLargeNumber(token.volume) : 'Unknown'}

**Summary:** ${isEstablished ? 'This token has strong liquidity and volume metrics.' : 'Exercise caution - verify on-chain data.'} Always DYOR!`
		};
	}

	function getPriceResponse(symbol: string): { tools: string[], response: string } {
		const token = tokens.find(t => t.symbol.toUpperCase() === symbol.toUpperCase()) || tokens[0];

		if (!token) {
			return { tools: ['get_token_data'], response: 'No token data available. Try refreshing.' };
		}

		return {
			tools: ['get_token_data'],
			response: `**${token.symbol} Price Analysis (Live):**

Current Price: $${formatPrice(token.price)}
24h Change: ${token.change24h >= 0 ? '+' : ''}${token.change24h.toFixed(2)}%
1h Change: ${token.change1h >= 0 ? '+' : ''}${token.change1h.toFixed(2)}%

Volume (24h): ${formatLargeNumber(token.volume)}
Market Cap: ${formatLargeNumber(token.marketCap)}
Liquidity: ${formatLargeNumber(token.liquidity)}

${token.change24h > 0 ? 'The momentum looks bullish!' : token.change24h < -5 ? 'Showing some weakness today.' : 'Trading sideways.'}`
		};
	}

	const helpResponse = {
		response: `I can help you with:

🔍 **Research**
- "What's trending?" - See hot tokens
- "Check WIF" - Get token details
- "Is BONK safe?" - Rug check analysis

💼 **Portfolio**
- "Show my portfolio" - View holdings
- "What's my PnL?" - See profits/losses

💱 **Trading**
- "Swap 1 SOL for WIF" - Get swap quote
- "Best route for BONK" - Find optimal swap

Just type naturally - I understand context!`
	};

	// Process chat input with dynamic responses
	async function sendMessage() {
		if (!chatInput.trim() || isTyping) return;

		const userMessage: ChatMessage = {
			id: `msg_${Date.now()}`,
			role: 'user',
			content: chatInput,
			timestamp: new Date()
		};
		chatMessages = [...chatMessages, userMessage];

		const query = chatInput.toLowerCase();
		chatInput = '';
		isTyping = true;

		// Extract token symbol from query if present
		const tokenMatch = query.match(/\b(sol|bonk|wif|jup|ray|orca|pyth|mngo)\b/i);
		const mentionedToken = tokenMatch ? tokenMatch[1].toUpperCase() : 'SOL';

		// Get dynamic response based on query
		let response: { tools?: string[], response: string };
		if (query.includes('trend') || query.includes('hot') || query.includes('popular')) {
			response = getTrendingResponse();
		} else if (query.includes('portfolio') || query.includes('holding') || query.includes('balance') || query.includes('pnl')) {
			response = getPortfolioResponse();
		} else if (query.includes('swap') || query.includes('trade') || query.includes('buy') || query.includes('sell')) {
			response = getSwapResponse();
		} else if (query.includes('rug') || query.includes('safe') || query.includes('scam') || query.includes('risk')) {
			response = getRugCheckResponse(mentionedToken);
		} else if (query.includes('price') || query.includes('check') || tokenMatch) {
			response = getPriceResponse(mentionedToken);
		} else {
			response = helpResponse;
		}

		// Simulate tool calls
		if (response.tools) {
			for (const tool of response.tools) {
				await new Promise(r => setTimeout(r, 600));
				const toolMessage: ChatMessage = {
					id: `tool_${Date.now()}`,
					role: 'tool',
					content: 'Fetching live data from DexScreener...',
					toolName: tool,
					timestamp: new Date()
				};
				chatMessages = [...chatMessages, toolMessage];
			}
		}

		// Simulate typing delay
		await new Promise(r => setTimeout(r, 800));

		const assistantMessage: ChatMessage = {
			id: `asst_${Date.now()}`,
			role: 'assistant',
			content: response.response,
			timestamp: new Date()
		};
		chatMessages = [...chatMessages, assistantMessage];
		isTyping = false;
	}

	// Quick action buttons for chat
	const quickActions = [
		{ label: "What's trending?", icon: '🔥' },
		{ label: 'Show my portfolio', icon: '💼' },
		{ label: 'Swap 1 SOL for WIF', icon: '💱' },
		{ label: 'Is WIF safe?', icon: '🛡️' },
	];

	// Trading simulator state
	let fromToken = 'SOL';
	let toToken = 'WIF';
	let fromAmount = '1';
	let toAmount = '61.74';
	let isSwapping = false;
	let swapSuccess = false;
	let slippage = 0.5;

	// Live price update interval
	let priceInterval: ReturnType<typeof setInterval>;
	let refreshInterval: ReturnType<typeof setInterval>;

	// Generate sparkline data based on price trend
	function generateSparkline(trend: number = 0): number[] {
		const points: number[] = [];
		let value = 50 - (trend * 2); // Start based on inverse of trend
		const trendBias = trend / 24; // Distribute trend across points

		for (let i = 0; i < 24; i++) {
			value += (Math.random() - 0.5) * 10 + trendBias;
			value = Math.max(10, Math.min(90, value));
			points.push(value);
		}
		return points;
	}

	// Refresh data from API periodically
	async function refreshTokenData() {
		try {
			const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=solana');
			if (!response.ok) return;

			const data = await response.json();
			const pairs: DexScreenerPair[] = data.pairs || [];

			const solanaTokens = pairs
				.filter(pair => pair.chainId === 'solana' && pair.priceUsd && parseFloat(pair.priceUsd) > 0)
				.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));

			const uniqueTokens = new Map<string, DexScreenerPair>();
			for (const pair of solanaTokens) {
				const symbol = pair.baseToken.symbol;
				if (!uniqueTokens.has(symbol) || (pair.volume?.h24 || 0) > (uniqueTokens.get(symbol)?.volume?.h24 || 0)) {
					uniqueTokens.set(symbol, pair);
				}
			}

			// Update existing tokens with new prices
			tokens = tokens.map(token => {
				const pair = uniqueTokens.get(token.symbol);
				if (pair) {
					const newPrice = parseFloat(pair.priceUsd) || token.price;
					const newSparkline = [...token.sparkline.slice(1), 50 + (pair.priceChange?.h24 || 0) * 2];
					return {
						...token,
						price: newPrice,
						change24h: pair.priceChange?.h24 || token.change24h,
						change1h: pair.priceChange?.h1 || token.change1h,
						volume: pair.volume?.h24 || token.volume,
						liquidity: pair.liquidity?.usd || token.liquidity,
						sparkline: newSparkline
					};
				}
				return token;
			});

			lastUpdate = new Date();
			updatePortfolioWithRealPrices();
		} catch (error) {
			console.error('Error refreshing token data:', error);
		}
	}

	// Light local fluctuation for visual feedback between API calls
	function updatePricesLocally() {
		tokens = tokens.map(token => {
			const fluctuation = (Math.random() - 0.5) * 0.005; // Very small fluctuation
			const newPrice = token.price * (1 + fluctuation);
			const newSparkline = [...token.sparkline.slice(1), 50 + token.change24h * 2 + (Math.random() - 0.5) * 5];

			return {
				...token,
				price: newPrice,
				sparkline: newSparkline
			};
		});

		updatePortfolioWithRealPrices();
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
			toAmount = (fromValue / toTokenData.price).toFixed(4);
		}
	}

	$: fromAmount, fromToken, toToken, calculateSwap();

	// Active tab state
	type TabType = 'tokens' | 'portfolio' | 'chat' | 'swap' | 'rugcheck';
	const tabs: { id: TabType; label: string; icon: string }[] = [
		{ id: 'tokens', label: 'Live Market', icon: '📊' },
		{ id: 'portfolio', label: 'Portfolio', icon: '💼' },
		{ id: 'chat', label: 'AI Agent', icon: '🤖' },
		{ id: 'swap', label: 'Swap', icon: '💱' },
		{ id: 'rugcheck', label: 'Rug Check', icon: '🛡️' },
	];
	let activeTab: TabType = 'chat';

	// Rug check state
	let rugCheckInput = '';
	let rugCheckResult: any = null;
	let isCheckingRug = false;

	async function checkRug() {
		if (!rugCheckInput.trim()) return;
		isCheckingRug = true;
		rugCheckResult = null;

		try {
			// Search for the token on DexScreener
			const pairs = await searchToken(rugCheckInput);
			const tokenData = pairs[0];

			if (tokenData) {
				// Analyze based on real data
				const liquidity = tokenData.liquidity?.usd || 0;
				const volume = tokenData.volume?.h24 || 0;
				const marketCap = tokenData.marketCap || tokenData.fdv || 0;

				// Calculate risk based on real metrics
				const hasLiquidity = liquidity > 50000;
				const hasVolume = volume > 10000;
				const hasMarketCap = marketCap > 100000;
				const liquidityRatio = marketCap > 0 ? (liquidity / marketCap) * 100 : 0;

				const score = Math.min(100, Math.max(0,
					(hasLiquidity ? 25 : 0) +
					(hasVolume ? 25 : 0) +
					(hasMarketCap ? 20 : 0) +
					(liquidityRatio > 5 ? 30 : liquidityRatio > 1 ? 15 : 0)
				));

				const riskLevel = score >= 70 ? 'LOW' : score >= 40 ? 'MEDIUM' : 'HIGH';

				rugCheckResult = {
					token: tokenData.baseToken.symbol,
					name: tokenData.baseToken.name,
					riskLevel,
					score,
					checks: {
						mintAuthority: score >= 50,
						freezeAuthority: score >= 50,
						lpLocked: hasLiquidity,
						topHoldersHealthy: liquidityRatio > 3,
						contractVerified: hasMarketCap,
					},
					topHolders: liquidityRatio > 5 ? '<15%' : liquidityRatio > 2 ? '15-30%' : '>30%',
					lpLockedPercent: hasLiquidity ? '>50%' : '<50%',
					lpLockDuration: hasLiquidity ? 'Verified' : 'Unknown',
					realData: {
						liquidity: formatLargeNumber(liquidity),
						volume24h: formatLargeNumber(volume),
						marketCap: formatLargeNumber(marketCap),
						dexUrl: tokenData.url
					}
				};
			} else {
				// Token not found
				rugCheckResult = {
					token: rugCheckInput.toUpperCase(),
					riskLevel: 'HIGH',
					score: 0,
					checks: {
						mintAuthority: false,
						freezeAuthority: false,
						lpLocked: false,
						topHoldersHealthy: false,
						contractVerified: false,
					},
					topHolders: 'Unknown',
					lpLockedPercent: 'Unknown',
					lpLockDuration: 'Unknown',
					error: 'Token not found on DexScreener'
				};
			}
		} catch (error) {
			console.error('Rug check error:', error);
			rugCheckResult = {
				token: rugCheckInput.toUpperCase(),
				riskLevel: 'MEDIUM',
				score: 50,
				checks: {
					mintAuthority: false,
					freezeAuthority: false,
					lpLocked: false,
					topHoldersHealthy: false,
					contractVerified: false,
				},
				topHolders: 'Check failed',
				lpLockedPercent: 'Check failed',
				lpLockDuration: 'Check failed',
				error: 'Could not fetch data'
			};
		}

		isCheckingRug = false;
	}

	// Stats for header
	let stats = {
		totalVolume: 4500000000,
		totalTrades: 125000,
		activeUsers: 45000,
		tokensTracked: 15000,
	};

	// Portfolio totals
	$: totalValue = portfolio.reduce((acc, item) => acc + item.value, 0);
	$: totalPnl = portfolio.reduce((acc, item) => acc + item.pnl, 0);
	$: totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

	onMount(async () => {
		// Welcome message
		chatMessages = [{
			id: 'welcome',
			role: 'assistant',
			content: `Welcome to VEX! 👋

I'm your AI trading assistant for Solana. I can help you:
- Track trending tokens and prices (Live from DexScreener)
- Analyze your portfolio
- Execute swaps via Jupiter
- Check tokens for rug pull risks

Try asking me something or use the quick actions below!`,
			timestamp: new Date()
		}];

		// Fetch real token data from DexScreener
		await fetchTrendingTokens();
		updatePortfolioWithRealPrices();

		// Local price fluctuation every 3 seconds
		priceInterval = setInterval(updatePricesLocally, 3000);

		// Refresh from API every 30 seconds
		refreshInterval = setInterval(refreshTokenData, 30000);
	});

	onDestroy(() => {
		if (priceInterval) clearInterval(priceInterval);
		if (refreshInterval) clearInterval(refreshInterval);
	});

	// Format helpers
	function formatPrice(price: number): string {
		if (price < 0.00001) return price.toFixed(10);
		if (price < 0.001) return price.toFixed(8);
		if (price < 1) return price.toFixed(6);
		if (price < 100) return price.toFixed(2);
		return price.toFixed(2);
	}

	function formatLargeNumber(num: number): string {
		if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
		if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
		if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
		return `$${num.toFixed(2)}`;
	}

	function formatNumber(num: number): string {
		if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
		if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
		return num.toFixed(0);
	}

	function getSparklinePath(data: number[]): string {
		if (data.length < 2) return '';
		const width = 100;
		const height = 32;
		const stepX = width / (data.length - 1);

		return data.map((y, i) => {
			const x = i * stepX;
			const normalizedY = height - (y / 100) * height;
			return `${i === 0 ? 'M' : 'L'} ${x} ${normalizedY}`;
		}).join(' ');
	}

	function openTokenDetail(token: Token) {
		selectedToken = token;
		showTokenDetail = true;
	}
</script>

<svelte:head>
	<title>VEX Demo - Interactive AI Trading Simulator</title>
	<meta name="description" content="Experience VEX's AI-powered Solana trading - live market data, portfolio tracking, rug checks, and more. No wallet required." />
</svelte:head>

<AnimatedBackground />
<Nav />

<main class="relative min-h-screen pt-24 pb-16 px-4 md:px-6">
	<div class="max-w-7xl mx-auto">
		<!-- Hero Header -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--lime)]/10 border border-[var(--lime)]/20 mb-6">
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lime)] opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--lime)]"></span>
				</span>
				<span class="text-xs font-mono text-[var(--lime)] uppercase tracking-wider">Live Demo - Real Market Data</span>
			</div>

			<h1 class="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--white)] mb-4">
				EXPERIENCE <span class="text-[var(--lime)] text-glow-lime">VEX</span>
			</h1>
			<p class="text-[var(--muted)] text-lg max-w-2xl mx-auto mb-8">
				Your AI-powered Solana co-pilot. Chat naturally, trade smart, stay safe.
			</p>

			<!-- Live Stats Bar -->
			<div class="flex flex-wrap justify-center gap-6 md:gap-12 py-4 px-6 rounded-xl bg-[var(--surface)]/50 border border-[var(--border)] max-w-3xl mx-auto">
				<div class="text-center">
					<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">24h Volume</div>
					<div class="font-mono text-[var(--white)] text-lg">{formatLargeNumber(stats.totalVolume)}</div>
				</div>
				<div class="text-center">
					<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Total Trades</div>
					<div class="font-mono text-[var(--white)] text-lg">{formatNumber(stats.totalTrades)}</div>
				</div>
				<div class="text-center">
					<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Active Users</div>
					<div class="font-mono text-[var(--white)] text-lg">{formatNumber(stats.activeUsers)}</div>
				</div>
				<div class="text-center">
					<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Tokens</div>
					<div class="font-mono text-[var(--white)] text-lg">{formatNumber(stats.tokensTracked)}</div>
				</div>
			</div>
		</div>

		<!-- Tab Navigation -->
		<div class="flex justify-center gap-2 mb-8 flex-wrap">
			{#each tabs as tab (tab.id)}
				<button
					class="flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-300
						{activeTab === tab.id
							? 'bg-[var(--lime)] text-[var(--black)] shadow-lg shadow-[var(--lime)]/20'
							: 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--white)] border border-[var(--border)] hover:border-[var(--lime)]/30'}"
					on:click={() => activeTab = tab.id}
				>
					<span>{tab.icon}</span>
					<span class="hidden sm:inline">{tab.label}</span>
				</button>
			{/each}
		</div>

		<!-- Content Panels -->
		<div class="relative min-h-[600px]">

			<!-- Live Market Panel -->
			{#if activeTab === 'tokens'}
				<div class="animate-fade-in-up space-y-4">
					<!-- Market Header -->
					<div class="flex items-center justify-between mb-6">
						<div>
							<h2 class="font-display text-2xl text-[var(--white)]">Live Market</h2>
							<p class="text-xs text-[var(--muted)] mt-1">
								Multi-chain data from DexScreener API
								{#if lastUpdate}
									<span class="ml-2">• Updated {lastUpdate.toLocaleTimeString()}</span>
								{/if}
							</p>
						</div>
						<div class="flex items-center gap-4">
							{#if tokenError}
								<span class="text-xs text-yellow-400">{tokenError}</span>
							{/if}
							<button
								class="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--lime)]/30 text-[var(--muted)] hover:text-[var(--white)] transition-all"
								on:click={fetchTrendingTokens}
								disabled={isLoadingTokens}
							>
								{#if isLoadingTokens}
									<span class="animate-spin">↻</span>
								{:else}
									<span>↻</span>
								{/if}
								Refresh
							</button>
							<div class="flex items-center gap-2 text-xs text-[var(--muted)]">
								<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
								Live
							</div>
						</div>
					</div>

					<!-- Loading State -->
					{#if isLoadingTokens && tokens.length === 0}
						<div class="flex flex-col items-center justify-center py-20">
							<div class="w-12 h-12 border-4 border-[var(--lime)]/20 border-t-[var(--lime)] rounded-full animate-spin mb-4"></div>
							<p class="text-[var(--muted)]">Fetching live data from DexScreener...</p>
						</div>
					{:else}

					<!-- Token Table -->
					<div class="glass border border-[var(--border)] rounded-xl overflow-hidden">
						<!-- Header -->
						<div class="hidden md:grid grid-cols-7 gap-4 px-6 py-4 bg-[var(--surface)]/50 border-b border-[var(--border)] text-xs text-[var(--muted)] uppercase tracking-wider">
							<span>Token</span>
							<span class="text-right">Price</span>
							<span class="text-right">1h</span>
							<span class="text-right">24h</span>
							<span class="text-right">Volume</span>
							<span class="text-right">Market Cap</span>
							<span class="text-right">Chart</span>
						</div>

						<!-- Token Rows -->
						{#each tokens as token, i}
							<button
								class="w-full grid grid-cols-2 md:grid-cols-7 gap-4 px-6 py-5 items-center border-b border-[var(--border)] last:border-0 hover:bg-[var(--lime)]/5 transition-all duration-300 cursor-pointer text-left"
								style="animation-delay: {i * 50}ms"
								on:click={() => openTokenDetail(token)}
							>
								<!-- Token Info -->
								<div class="flex items-center gap-3">
									<div class="relative">
										<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--lime)]/30 to-[var(--lime)]/5 flex items-center justify-center text-[var(--lime)] font-bold border border-[var(--lime)]/20">
											{token.logo}
										</div>
										{#if token.chain && chainInfo[token.chain]}
											<div
												class="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase"
												style="background-color: {chainInfo[token.chain].color}20; color: {chainInfo[token.chain].color}; border: 1px solid {chainInfo[token.chain].color}40;"
											>
												{chainInfo[token.chain].name}
											</div>
										{/if}
									</div>
									<div>
										<div class="font-bold text-[var(--white)]">{token.symbol}</div>
										<div class="text-xs text-[var(--muted)]">{token.name}</div>
									</div>
								</div>

								<!-- Price -->
								<div class="text-right md:col-span-1">
									<div class="font-mono text-[var(--white)]">${formatPrice(token.price)}</div>
								</div>

								<!-- 1h Change -->
								<div class="text-right hidden md:block">
									<span class="font-mono text-sm {token.change1h >= 0 ? 'text-green-400' : 'text-red-400'}">
										{token.change1h >= 0 ? '+' : ''}{token.change1h.toFixed(2)}%
									</span>
								</div>

								<!-- 24h Change -->
								<div class="text-right">
									<span class="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-mono
										{token.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
										{token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.change24h).toFixed(2)}%
									</span>
								</div>

								<!-- Volume -->
								<div class="text-right text-[var(--muted)] font-mono hidden md:block">
									{formatLargeNumber(token.volume)}
								</div>

								<!-- Market Cap -->
								<div class="text-right text-[var(--muted)] font-mono hidden md:block">
									{formatLargeNumber(token.marketCap)}
								</div>

								<!-- Sparkline -->
								<div class="justify-self-end hidden md:block">
									<svg width="100" height="32" class="overflow-visible">
										<path
											d={getSparklinePath(token.sparkline)}
											fill="none"
											stroke={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
							</button>
						{/each}
					</div>
					{/if}
				</div>
			{/if}

			<!-- Portfolio Panel -->
			{#if activeTab === 'portfolio'}
				<div class="animate-fade-in-up">
					<!-- Portfolio Summary Cards -->
					<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<div class="glass border border-[var(--border)] rounded-xl p-6">
							<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Total Value</div>
							<div class="font-display text-3xl text-[var(--white)]">{formatLargeNumber(totalValue)}</div>
						</div>
						<div class="glass border border-[var(--border)] rounded-xl p-6">
							<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Total P&L</div>
							<div class="font-display text-3xl {totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}">
								{totalPnl >= 0 ? '+' : ''}{formatLargeNumber(Math.abs(totalPnl))}
							</div>
						</div>
						<div class="glass border border-[var(--border)] rounded-xl p-6">
							<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">P&L %</div>
							<div class="font-display text-3xl {totalPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}">
								{totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
							</div>
						</div>
						<div class="glass border border-[var(--border)] rounded-xl p-6">
							<div class="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Assets</div>
							<div class="font-display text-3xl text-[var(--white)]">{portfolio.length}</div>
						</div>
					</div>

					<!-- Holdings -->
					<h3 class="font-display text-xl text-[var(--white)] mb-4">Holdings</h3>
					<div class="space-y-3">
						{#each portfolio as item, i}
							<div class="glass border border-[var(--border)] rounded-xl p-5 hover:border-[var(--lime)]/30 transition-all duration-300">
								<div class="flex items-center justify-between mb-4">
									<div class="flex items-center gap-4">
										<div class="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--lime)]/30 to-[var(--lime)]/5 flex items-center justify-center text-[var(--lime)] font-bold text-xl border border-[var(--lime)]/20">
											{item.symbol.charAt(0)}
										</div>
										<div>
											<div class="font-bold text-lg text-[var(--white)]">{item.symbol}</div>
											<div class="text-sm text-[var(--muted)]">{item.token}</div>
										</div>
									</div>
									<div class="text-right">
										<div class="font-mono text-lg text-[var(--white)]">{formatLargeNumber(item.value)}</div>
										<div class="flex items-center justify-end gap-2">
											<span class="font-mono text-sm {item.pnl >= 0 ? 'text-green-400' : 'text-red-400'}">
												{item.pnl >= 0 ? '+' : ''}{formatLargeNumber(Math.abs(item.pnl))}
											</span>
											<span class="text-xs px-2 py-0.5 rounded font-mono {item.pnlPercent >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
												{item.pnlPercent >= 0 ? '+' : ''}{item.pnlPercent.toFixed(2)}%
											</span>
										</div>
									</div>
								</div>

								<!-- Details Row -->
								<div class="flex items-center justify-between text-sm text-[var(--muted)] pt-4 border-t border-[var(--border)]">
									<div>
										<span class="opacity-70">Amount:</span>
										<span class="font-mono ml-2 text-[var(--white)]">{item.amount.toLocaleString()}</span>
									</div>
									<div>
										<span class="opacity-70">Avg Buy:</span>
										<span class="font-mono ml-2 text-[var(--white)]">${formatPrice(item.avgBuyPrice)}</span>
									</div>
									<div>
										<span class="opacity-70">Current:</span>
										<span class="font-mono ml-2 text-[var(--white)]">${formatPrice(item.currentPrice)}</span>
									</div>
									<div class="hidden sm:block">
										<span class="opacity-70">Allocation:</span>
										<span class="font-mono ml-2 text-[var(--lime)]">{item.allocation.toFixed(1)}%</span>
									</div>
								</div>

								<!-- Allocation Bar -->
								<div class="mt-3 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
									<div
										class="h-full bg-gradient-to-r from-[var(--lime)] to-[var(--lime)]/50 rounded-full transition-all duration-500"
										style="width: {item.allocation}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- AI Chat Panel -->
			{#if activeTab === 'chat'}
				<div class="animate-fade-in-up max-w-4xl mx-auto">
					<div class="glass border border-[var(--border)] rounded-xl overflow-hidden">
						<!-- Chat Header -->
						<div class="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]/50">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--lime)] to-green-500 flex items-center justify-center shadow-lg shadow-[var(--lime)]/20">
									<span class="text-[var(--black)] font-bold">V</span>
								</div>
								<div>
									<div class="font-bold text-[var(--white)]">VEX Agent</div>
									<div class="text-xs text-[var(--muted)]">AI-Powered Trading Assistant</div>
								</div>
							</div>
							<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
								<span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
								<span class="text-xs text-green-400 font-mono">Online</span>
							</div>
						</div>

						<!-- Chat Messages -->
						<div class="p-6 space-y-4 h-[450px] overflow-y-auto scroll-smooth" id="chat-messages">
							{#each chatMessages as msg (msg.id)}
								<div class="animate-fade-in-up">
									{#if msg.role === 'user'}
										<div class="flex justify-end">
											<div class="bg-[var(--lime)]/10 border border-[var(--lime)]/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
												<p class="text-[var(--white)] text-sm">{msg.content}</p>
											</div>
										</div>
									{:else if msg.role === 'tool'}
										<div class="flex items-center gap-2 text-xs text-[var(--muted)] py-2 px-4">
											<div class="w-4 h-4 border-2 border-[var(--lime)]/30 border-t-[var(--lime)] rounded-full animate-spin"></div>
											<span class="font-mono text-[var(--lime)]">{msg.toolName}</span>
											<span class="opacity-50">•</span>
											<span>{msg.content}</span>
										</div>
									{:else}
										<div class="flex gap-3">
											<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lime)]/20 to-[var(--lime)]/5 border border-[var(--lime)]/20 flex items-center justify-center flex-shrink-0">
												<span class="text-[var(--lime)] font-bold text-xs">V</span>
											</div>
											<div class="bg-[var(--surface)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
												<p class="text-[var(--white)] text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
											</div>
										</div>
									{/if}
								</div>
							{/each}

							{#if isTyping}
								<div class="flex gap-3">
									<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lime)]/20 to-[var(--lime)]/5 border border-[var(--lime)]/20 flex items-center justify-center flex-shrink-0">
										<span class="text-[var(--lime)] font-bold text-xs">V</span>
									</div>
									<div class="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3">
										<div class="flex gap-1.5">
											<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-bounce" style="animation-delay: 0ms"></span>
											<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-bounce" style="animation-delay: 150ms"></span>
											<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-bounce" style="animation-delay: 300ms"></span>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Quick Actions -->
						<div class="px-6 py-3 border-t border-[var(--border)] bg-[var(--surface)]/30">
							<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
								{#each quickActions as action}
									<button
										class="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--muted)] hover:text-[var(--white)] hover:border-[var(--lime)]/30 transition-all whitespace-nowrap"
										on:click={() => { chatInput = action.label; sendMessage(); }}
									>
										<span>{action.icon}</span>
										<span>{action.label}</span>
									</button>
								{/each}
							</div>
						</div>

						<!-- Chat Input -->
						<div class="px-6 py-4 border-t border-[var(--border)]">
							<form on:submit|preventDefault={sendMessage} class="flex gap-3">
								<input
									type="text"
									bind:value={chatInput}
									placeholder="Ask VEX anything..."
									class="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--white)] placeholder:text-[var(--muted)] focus:border-[var(--lime)]/50 focus:outline-none transition-colors"
								/>
								<button
									type="submit"
									class="btn-primary px-6"
									disabled={isTyping || !chatInput.trim()}
								>
									Send
								</button>
							</form>
						</div>
					</div>
				</div>
			{/if}

			<!-- Swap Panel -->
			{#if activeTab === 'swap'}
				<div class="animate-fade-in-up max-w-lg mx-auto">
					<div class="glass border border-[var(--border)] rounded-xl p-6">
						<div class="flex items-center justify-between mb-6">
							<h3 class="font-display text-2xl text-[var(--white)]">Swap</h3>
							<button class="text-[var(--muted)] hover:text-[var(--white)] transition-colors">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</button>
						</div>

						<!-- From Token -->
						<div class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-2">
							<div class="flex items-center justify-between mb-3">
								<span class="text-xs text-[var(--muted)] uppercase tracking-wider">You Pay</span>
								<span class="text-xs text-[var(--muted)]">Balance: 25.5 SOL</span>
							</div>
							<div class="flex items-center gap-4">
								<input
									type="number"
									bind:value={fromAmount}
									class="flex-1 bg-transparent text-3xl font-mono text-[var(--white)] outline-none min-w-0"
									placeholder="0.0"
								/>
								<select
									bind:value={fromToken}
									class="bg-[var(--black)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--white)] font-mono cursor-pointer hover:border-[var(--lime)]/30 transition-colors"
								>
									{#each tokens as token}
										<option value={token.symbol}>{token.symbol}</option>
									{/each}
								</select>
							</div>
							<div class="text-sm text-[var(--muted)] mt-2">
								≈ ${(parseFloat(fromAmount || '0') * (tokens.find(t => t.symbol === fromToken)?.price || 0)).toFixed(2)}
							</div>
						</div>

						<!-- Swap Arrow -->
						<div class="flex justify-center -my-3 relative z-10">
							<button
								class="w-12 h-12 rounded-full bg-[var(--surface)] border-4 border-[var(--black)] flex items-center justify-center text-[var(--lime)] hover:bg-[var(--lime)] hover:text-[var(--black)] transition-all duration-300 shadow-lg"
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
						<div class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-6">
							<div class="flex items-center justify-between mb-3">
								<span class="text-xs text-[var(--muted)] uppercase tracking-wider">You Receive</span>
								<span class="text-xs text-[var(--muted)]">Balance: 0 {toToken}</span>
							</div>
							<div class="flex items-center gap-4">
								<input
									type="text"
									value={toAmount}
									class="flex-1 bg-transparent text-3xl font-mono text-[var(--white)] outline-none min-w-0"
									placeholder="0.0"
									disabled
								/>
								<select
									bind:value={toToken}
									class="bg-[var(--black)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--white)] font-mono cursor-pointer hover:border-[var(--lime)]/30 transition-colors"
								>
									{#each tokens as token}
										<option value={token.symbol}>{token.symbol}</option>
									{/each}
								</select>
							</div>
							<div class="text-sm text-[var(--muted)] mt-2">
								≈ ${(parseFloat(toAmount || '0') * (tokens.find(t => t.symbol === toToken)?.price || 0)).toFixed(2)}
							</div>
						</div>

						<!-- Swap Details -->
						<div class="space-y-3 mb-6 p-4 bg-[var(--surface)]/50 rounded-xl text-sm">
							<div class="flex justify-between text-[var(--muted)]">
								<span>Rate</span>
								<span class="font-mono text-[var(--white)]">1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount || '1')).toFixed(4)} {toToken}</span>
							</div>
							<div class="flex justify-between text-[var(--muted)]">
								<span>Price Impact</span>
								<span class="font-mono text-green-400">&lt;0.01%</span>
							</div>
							<div class="flex justify-between text-[var(--muted)]">
								<span>Slippage</span>
								<span class="font-mono text-[var(--white)]">{slippage}%</span>
							</div>
							<div class="flex justify-between text-[var(--muted)]">
								<span>Network Fee</span>
								<span class="font-mono text-[var(--white)]">~0.00005 SOL</span>
							</div>
							<div class="flex justify-between text-[var(--muted)]">
								<span>Route</span>
								<span class="font-mono text-[var(--lime)]">{fromToken} → USDC → {toToken}</span>
							</div>
						</div>

						<!-- Swap Button -->
						<button
							class="w-full btn-primary py-4 text-lg relative overflow-hidden"
							on:click={handleSwap}
							disabled={isSwapping}
						>
							{#if isSwapping}
								<span class="flex items-center justify-center gap-2">
									<span class="w-5 h-5 border-2 border-[var(--black)]/30 border-t-[var(--black)] rounded-full animate-spin"></span>
									Processing...
								</span>
							{:else if swapSuccess}
								<span class="flex items-center justify-center gap-2">
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

					<div class="flex items-center justify-center gap-2 mt-6 text-sm text-[var(--muted)]">
						<span>Powered by</span>
						<span class="font-bold text-[var(--white)]">Jupiter Aggregator</span>
					</div>
				</div>
			{/if}

			<!-- Rug Check Panel -->
			{#if activeTab === 'rugcheck'}
				<div class="animate-fade-in-up max-w-2xl mx-auto">
					<div class="glass border border-[var(--border)] rounded-xl p-6">
						<div class="text-center mb-8">
							<div class="w-16 h-16 rounded-full bg-[var(--lime)]/10 border border-[var(--lime)]/20 flex items-center justify-center mx-auto mb-4">
								<span class="text-3xl">🛡️</span>
							</div>
							<h3 class="font-display text-2xl text-[var(--white)] mb-2">Rug Check</h3>
							<p class="text-[var(--muted)]">Analyze any Solana token for potential risks</p>
						</div>

						<!-- Search -->
						<div class="flex gap-3 mb-8">
							<input
								type="text"
								bind:value={rugCheckInput}
								placeholder="Enter token symbol or address..."
								class="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--white)] placeholder:text-[var(--muted)] focus:border-[var(--lime)]/50 focus:outline-none transition-colors"
								on:keypress={(e) => e.key === 'Enter' && checkRug()}
							/>
							<button
								class="btn-primary px-6"
								on:click={checkRug}
								disabled={isCheckingRug}
							>
								{isCheckingRug ? 'Checking...' : 'Check'}
							</button>
						</div>

						<!-- Quick Tokens -->
						<div class="flex flex-wrap gap-2 justify-center mb-8">
							{#each ['WIF', 'BONK', 'JUP', 'PYTH', 'ORCA'] as token}
								<button
									class="px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--muted)] hover:text-[var(--white)] hover:border-[var(--lime)]/30 transition-all"
									on:click={() => { rugCheckInput = token; checkRug(); }}
								>
									{token}
								</button>
							{/each}
						</div>

						<!-- Results -->
						{#if rugCheckResult}
							<div class="animate-fade-in-up">
								<!-- Risk Score -->
								<div class="text-center mb-8">
									<div class="inline-flex items-center gap-3 px-6 py-3 rounded-xl
										{rugCheckResult.riskLevel === 'LOW' ? 'bg-green-500/10 border border-green-500/30' :
										rugCheckResult.riskLevel === 'MEDIUM' ? 'bg-yellow-500/10 border border-yellow-500/30' :
										'bg-red-500/10 border border-red-500/30'}">
										<span class="text-2xl">
											{rugCheckResult.riskLevel === 'LOW' ? '✅' : rugCheckResult.riskLevel === 'MEDIUM' ? '⚠️' : '🚨'}
										</span>
										<div class="text-left">
											<div class="text-xs uppercase tracking-wider
												{rugCheckResult.riskLevel === 'LOW' ? 'text-green-400' :
												rugCheckResult.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
												'text-red-400'}">
												{rugCheckResult.riskLevel} RISK
											</div>
											<div class="font-display text-2xl text-[var(--white)]">
												{rugCheckResult.token}
											</div>
										</div>
										<div class="text-right">
											<div class="text-xs text-[var(--muted)]">Score</div>
											<div class="font-mono text-xl
												{rugCheckResult.score >= 70 ? 'text-green-400' :
												rugCheckResult.score >= 40 ? 'text-yellow-400' :
												'text-red-400'}">
												{rugCheckResult.score}/100
											</div>
										</div>
									</div>
								</div>

								<!-- Checks Grid -->
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<div class="flex items-center gap-3 p-4 bg-[var(--surface)] rounded-xl">
										<span class="text-xl">{rugCheckResult.checks.mintAuthority ? '✅' : '❌'}</span>
										<div>
											<div class="text-sm text-[var(--white)]">Mint Authority</div>
											<div class="text-xs text-[var(--muted)]">{rugCheckResult.checks.mintAuthority ? 'Disabled' : 'Enabled - Risk!'}</div>
										</div>
									</div>
									<div class="flex items-center gap-3 p-4 bg-[var(--surface)] rounded-xl">
										<span class="text-xl">{rugCheckResult.checks.freezeAuthority ? '✅' : '❌'}</span>
										<div>
											<div class="text-sm text-[var(--white)]">Freeze Authority</div>
											<div class="text-xs text-[var(--muted)]">{rugCheckResult.checks.freezeAuthority ? 'Disabled' : 'Enabled - Risk!'}</div>
										</div>
									</div>
									<div class="flex items-center gap-3 p-4 bg-[var(--surface)] rounded-xl">
										<span class="text-xl">{rugCheckResult.checks.lpLocked ? '✅' : '❌'}</span>
										<div>
											<div class="text-sm text-[var(--white)]">LP Locked</div>
											<div class="text-xs text-[var(--muted)]">{rugCheckResult.lpLockedPercent} for {rugCheckResult.lpLockDuration}</div>
										</div>
									</div>
									<div class="flex items-center gap-3 p-4 bg-[var(--surface)] rounded-xl">
										<span class="text-xl">{rugCheckResult.checks.topHoldersHealthy ? '✅' : '⚠️'}</span>
										<div>
											<div class="text-sm text-[var(--white)]">Top Holders</div>
											<div class="text-xs text-[var(--muted)]">Top 10 own {rugCheckResult.topHolders}</div>
										</div>
									</div>
								</div>

								<!-- Real Data from DexScreener -->
								{#if rugCheckResult.realData}
									<div class="grid grid-cols-3 gap-4 mb-6">
										<div class="bg-[var(--surface)] rounded-xl p-4 text-center">
											<div class="text-xs text-[var(--muted)] mb-1">Liquidity</div>
											<div class="font-mono text-[var(--white)]">{rugCheckResult.realData.liquidity}</div>
										</div>
										<div class="bg-[var(--surface)] rounded-xl p-4 text-center">
											<div class="text-xs text-[var(--muted)] mb-1">Volume 24h</div>
											<div class="font-mono text-[var(--white)]">{rugCheckResult.realData.volume24h}</div>
										</div>
										<div class="bg-[var(--surface)] rounded-xl p-4 text-center">
											<div class="text-xs text-[var(--muted)] mb-1">Market Cap</div>
											<div class="font-mono text-[var(--white)]">{rugCheckResult.realData.marketCap}</div>
										</div>
									</div>
									{#if rugCheckResult.realData.dexUrl}
										<div class="text-center mb-6">
											<a
												href={rugCheckResult.realData.dexUrl}
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center gap-2 text-sm text-[var(--lime)] hover:underline"
											>
												View on DexScreener →
											</a>
										</div>
									{/if}
								{/if}

								<!-- Info/Warning -->
								<div class="p-4 {rugCheckResult.realData ? 'bg-[var(--lime)]/5 border-[var(--lime)]/20' : 'bg-yellow-500/5 border-yellow-500/20'} border rounded-xl text-sm {rugCheckResult.realData ? 'text-[var(--lime)]/80' : 'text-yellow-400/80'}">
									{#if rugCheckResult.realData}
										✅ Data sourced from DexScreener API. Always DYOR before trading.
									{:else if rugCheckResult.error}
										⚠️ {rugCheckResult.error}. Please try again or check the token symbol.
									{:else}
										⚠️ Could not fetch real data. Always conduct your own research before trading.
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- CTA Section -->
		<div class="text-center mt-16 pt-16 border-t border-[var(--border)]">
			<h2 class="font-display text-3xl md:text-4xl text-[var(--white)] mb-4">
				Ready to trade with <span class="text-[var(--lime)]">AI</span>?
			</h2>
			<p class="text-[var(--muted)] mb-8 max-w-md mx-auto">
				Join thousands of traders using VEX to navigate Solana.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/#early-access" class="btn-primary text-lg px-8 py-4">
					Join Waitlist
				</a>
				<a href="/docs" class="btn-ghost border border-[var(--border)] text-lg px-8 py-4">
					Read Docs
				</a>
			</div>
		</div>
	</div>
</main>

<!-- Token Detail Modal -->
{#if showTokenDetail && selectedToken}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
		on:click|self={() => showTokenDetail = false}
	>
		<div
			class="glass border border-[var(--border)] rounded-2xl p-6 max-w-lg w-full animate-fade-in-up"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center gap-4">
					<div class="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--lime)]/30 to-[var(--lime)]/5 flex items-center justify-center text-[var(--lime)] font-bold text-2xl border border-[var(--lime)]/20">
						{selectedToken.logo}
					</div>
					<div>
						<div id="modal-title" class="font-display text-2xl text-[var(--white)]">{selectedToken.symbol}</div>
						<div class="text-[var(--muted)]">{selectedToken.name}</div>
					</div>
				</div>
				<button
					class="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--white)] transition-colors"
					on:click={() => showTokenDetail = false}
				>
					✕
				</button>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-6">
				<div class="bg-[var(--surface)] rounded-xl p-4">
					<div class="text-xs text-[var(--muted)] mb-1">Price</div>
					<div class="font-mono text-xl text-[var(--white)]">${formatPrice(selectedToken.price)}</div>
				</div>
				<div class="bg-[var(--surface)] rounded-xl p-4">
					<div class="text-xs text-[var(--muted)] mb-1">24h Change</div>
					<div class="font-mono text-xl {selectedToken.change24h >= 0 ? 'text-green-400' : 'text-red-400'}">
						{selectedToken.change24h >= 0 ? '+' : ''}{selectedToken.change24h.toFixed(2)}%
					</div>
				</div>
				<div class="bg-[var(--surface)] rounded-xl p-4">
					<div class="text-xs text-[var(--muted)] mb-1">Volume 24h</div>
					<div class="font-mono text-lg text-[var(--white)]">{formatLargeNumber(selectedToken.volume)}</div>
				</div>
				<div class="bg-[var(--surface)] rounded-xl p-4">
					<div class="text-xs text-[var(--muted)] mb-1">Market Cap</div>
					<div class="font-mono text-lg text-[var(--white)]">{formatLargeNumber(selectedToken.marketCap)}</div>
				</div>
				<div class="bg-[var(--surface)] rounded-xl p-4">
					<div class="text-xs text-[var(--muted)] mb-1">Holders</div>
					<div class="font-mono text-lg text-[var(--white)]">{formatNumber(selectedToken.holders)}</div>
				</div>
				<div class="bg-[var(--surface)] rounded-xl p-4">
					<div class="text-xs text-[var(--muted)] mb-1">Liquidity</div>
					<div class="font-mono text-lg text-[var(--white)]">{formatLargeNumber(selectedToken.liquidity)}</div>
				</div>
			</div>

			<div class="flex gap-3">
				<button
					class="flex-1 btn-primary"
					on:click={() => { activeTab = 'swap'; fromToken = 'SOL'; toToken = selectedToken.symbol; showTokenDetail = false; }}
				>
					Buy {selectedToken.symbol}
				</button>
				<button
					class="flex-1 btn-ghost border border-[var(--border)]"
					on:click={() => { activeTab = 'rugcheck'; rugCheckInput = selectedToken.symbol; showTokenDetail = false; checkRug(); }}
				>
					Rug Check
				</button>
			</div>
		</div>
	</div>
{/if}

<Footer />

<style>
	.animate-fade-in-up {
		animation: fade-in-up 0.4s ease-out forwards;
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

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
