<script lang="ts">
	import { onMount } from 'svelte';

	// Stats with animated counters
	const stats = [
		{ value: 15000, prefix: '$', suffix: '+', label: 'Volume Processed', duration: 2000 },
		{ value: 234, prefix: '', suffix: '+', label: 'Transactions', duration: 1800 },
		{ value: 47, prefix: '', suffix: '', label: 'Active Users', duration: 1500 },
		{ value: 98.5, prefix: '', suffix: '%', label: 'Success Rate', duration: 1600, decimals: 1 }
	];

	let displayValues = stats.map(() => 0);
	let statsVisible = false;

	function animateValue(index: number, start: number, end: number, duration: number, decimals = 0) {
		const startTime = performance.now();

		const update = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function for smooth animation
			const easeOut = 1 - Math.pow(1 - progress, 3);
			const current = start + (end - start) * easeOut;

			displayValues[index] = decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current);
			displayValues = displayValues; // Trigger reactivity

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		};

		requestAnimationFrame(update);
	}

	function formatNumber(num: number): string {
		if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		}
		return num.toString();
	}

	const commands = [
		'> swap 10 SOL for WIF',
		'> check rug score for PUMP',
		'> show my pnl this week',
		'> launch token $DEGEN',
		'> get trending tokens',
		'> buy 0.5 SOL of BONK'
	];

	let currentCommand = '';
	let commandIndex = 0;
	let charIndex = 0;
	let isDeleting = false;
	let showCursor = true;

	let statsElement: HTMLElement;

	onMount(() => {
		const typeSpeed = 80;
		const deleteSpeed = 40;
		const pauseTime = 2000;

		const type = () => {
			const fullCommand = commands[commandIndex];

			if (!isDeleting) {
				currentCommand = fullCommand.slice(0, charIndex + 1);
				charIndex++;

				if (charIndex === fullCommand.length) {
					setTimeout(() => {
						isDeleting = true;
						type();
					}, pauseTime);
					return;
				}
			} else {
				currentCommand = fullCommand.slice(0, charIndex - 1);
				charIndex--;

				if (charIndex === 0) {
					isDeleting = false;
					commandIndex = (commandIndex + 1) % commands.length;
				}
			}

			setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
		};

		type();

		const cursorInterval = setInterval(() => {
			showCursor = !showCursor;
		}, 530);

		// Intersection Observer for stats animation
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !statsVisible) {
						statsVisible = true;
						stats.forEach((stat, index) => {
							setTimeout(() => {
								animateValue(index, 0, stat.value, stat.duration, stat.decimals || 0);
							}, index * 150);
						});
					}
				});
			},
			{ threshold: 0.5 }
		);

		if (statsElement) {
			observer.observe(statsElement);
		}

		return () => {
			clearInterval(cursorInterval);
			observer.disconnect();
		};
	});
</script>

<section class="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
	<!-- Content -->
	<div class="relative z-10 max-w-[1400px] mx-auto w-full">
		<!-- Main headline -->
		<h1 class="font-display text-[clamp(4rem,15vw,12rem)] leading-none-tight tracking-tight mb-8">
			<span class="text-[var(--white)] inline-block hover:text-glow-lime transition-all duration-300">YOUR</span>
			<br />
			<span class="text-[var(--lime)] text-glow-lime inline-block animate-pulse-slow">SOLANA</span>
			<br />
			<span class="text-outline inline-block hover:scale-105 transition-transform duration-300">CO-PILOT</span>
		</h1>

		<!-- Subheadline -->
		<p class="font-serif italic text-xl md:text-2xl text-[var(--muted)] max-w-xl mb-4">
			Talk to VEX like a friend. Swap, snipe, launch — all from one chat.
		</p>

		<!-- Powered by -->
		<div class="flex items-center gap-2 mb-8">
			<span class="text-xs text-[var(--muted)] uppercase tracking-wider">Powered by</span>
			<span class="text-sm font-mono text-[var(--lime)] font-bold px-2 py-1 bg-[var(--lime)]/10 border border-[var(--lime)]/20 rounded">
				Qwen2.5-72B
			</span>
			<span class="text-xs text-[var(--muted)]">via OpenRouter</span>
		</div>

		<!-- CTA Buttons -->
		<div class="flex flex-wrap gap-4 mb-10">
			<a
				href="/demo"
				class="btn-primary"
			>
				Try Demo
			</a>
			<a
				href="/how-it-works"
				class="inline-flex items-center gap-2 bg-[var(--lime)]/10 text-[var(--lime)] font-mono text-xs uppercase tracking-wider px-6 py-4 border border-[var(--lime)]/30 hover:border-[var(--lime)] hover:bg-[var(--lime)]/20 transition-all duration-300"
			>
				<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
				How it Works
			</a>
			<a
				href="#features"
				class="inline-flex items-center gap-2 bg-transparent text-[var(--muted)] font-mono text-xs uppercase tracking-wider px-6 py-4 border border-[var(--border)] hover:border-[var(--lime)]/30 hover:text-[var(--white)] hover:bg-[var(--lime)]/5 transition-all duration-300"
			>
				See Features
			</a>
		</div>

		<!-- Terminal mockup with enhanced styling -->
		<div class="relative max-w-2xl group">
			<!-- Glow effect behind terminal -->
			<div class="absolute -inset-1 bg-gradient-to-r from-[var(--lime)]/20 via-[var(--lime)]/10 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

			<div class="relative glass border border-[var(--border)] rounded-lg overflow-hidden card-hover">
				<!-- Terminal header -->
				<div class="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/50">
					<div class="w-3 h-3 rounded-full bg-[var(--red)] shadow-lg shadow-red-500/20"></div>
					<div class="w-3 h-3 rounded-full bg-[var(--warning)] shadow-lg shadow-yellow-500/20"></div>
					<div class="w-3 h-3 rounded-full bg-[var(--success)] shadow-lg shadow-green-500/20"></div>
					<span class="ml-4 text-xs text-[var(--muted)] font-mono">vex-terminal</span>
					<div class="ml-auto flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
						<span class="text-[10px] text-[var(--lime)] font-mono">LIVE</span>
					</div>
				</div>
				<!-- Terminal body with scanlines -->
				<div class="relative p-6 font-mono text-sm md:text-base min-h-[80px] scanlines">
					<span class="text-[var(--lime)] text-glow-lime">{currentCommand}</span>
					<span
						class="text-[var(--lime)] animate-blink"
						class:opacity-0={!showCursor}
					>█</span>
				</div>
			</div>
		</div>

		<!-- Stats row with animated counters -->
		<div bind:this={statsElement} class="flex flex-wrap gap-8 md:gap-12 mt-16 pt-8 border-t border-[var(--border)]">
			{#each stats as stat, index}
				<div class="group">
					<div class="text-4xl md:text-5xl font-display {index === 0 ? 'text-[var(--lime)] text-glow-lime' : 'text-[var(--white)] group-hover:text-[var(--lime)] group-hover:text-glow-lime'} transition-all duration-300 group-hover:scale-110">
						{stat.prefix}{stat.value >= 1000 ? formatNumber(displayValues[index]) : displayValues[index]}{stat.suffix}
					</div>
					<div class="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
		<span class="text-[10px] text-[var(--muted)] uppercase tracking-widest">Scroll</span>
		<div class="w-px h-8 bg-gradient-to-b from-[var(--lime)] to-transparent animate-bounce-slow"></div>
	</div>
</section>
