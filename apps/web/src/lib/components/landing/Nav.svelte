<script lang="ts">
	import { onMount } from 'svelte';

	let scrolled = false;
	let mobileMenuOpen = false;

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 {scrolled ? 'py-2' : 'py-4'}"
>
	<!-- Background with blur -->
	<div
		class="absolute inset-0 transition-all duration-500 {scrolled ? 'glass-dark' : ''}"
	></div>

	<!-- Border bottom on scroll -->
	<div
		class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lime)]/20 to-transparent transition-opacity duration-500"
		class:opacity-0={!scrolled}
	></div>

	<div class="relative max-w-[1400px] mx-auto px-6 flex items-center justify-between">
		<!-- Logo with glow -->
		<a href="/" class="group flex items-center gap-2">
			<div class="relative">
				<span class="font-display text-3xl text-[var(--lime)] tracking-wider group-hover:text-glow-lime transition-all duration-300">
					VEX
				</span>
				<!-- Logo dot accent -->
				<span class="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
			</div>
		</a>

		<!-- Center Links - Desktop -->
		<div class="hidden md:flex items-center gap-1">
			<a href="/demo" class="nav-link nav-link-highlight">
				Demo
			</a>
			<a href="/how-it-works" class="nav-link">
				How it works
			</a>
			<a href="/tools" class="nav-link">
				Tools
			</a>
			<a href="/docs" class="nav-link">
				Docs
			</a>
		</div>

		<!-- Right side -->
		<div class="flex items-center gap-3">
			<!-- Status indicator -->
			<div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
				<span class="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
				<span class="text-[10px] text-[var(--muted)] font-mono">MAINNET</span>
			</div>

			<a
				href="/demo"
				class="btn-primary"
			>
				Try Demo
			</a>

			<!-- Mobile menu button -->
			<button
				class="md:hidden relative w-10 h-10 flex items-center justify-center text-[var(--white)]"
				on:click={() => mobileMenuOpen = !mobileMenuOpen}
				aria-label="Toggle menu"
			>
				<div class="relative w-5 h-4">
					<span
						class="absolute left-0 w-full h-0.5 bg-current transition-all duration-300 {mobileMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}"
					></span>
					<span
						class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current transition-all duration-300 {mobileMenuOpen ? 'opacity-0' : ''}"
					></span>
					<span
						class="absolute left-0 w-full h-0.5 bg-current transition-all duration-300 {mobileMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}"
					></span>
				</div>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden absolute top-full left-0 right-0 glass-dark border-t border-[var(--border)] animate-fade-in-up">
			<div class="px-6 py-6 flex flex-col gap-4">
				<a
					href="/demo"
					class="text-[var(--lime)] text-sm uppercase tracking-widest flex items-center justify-between bg-[var(--lime)]/5 -mx-2 px-2 py-2 rounded-lg border border-[var(--lime)]/20"
					on:click={() => mobileMenuOpen = false}
				>
					<span class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
						Demo
					</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
				<a
					href="/how-it-works"
					class="text-[var(--muted)] text-sm uppercase tracking-widest hover:text-[var(--white)] transition-colors flex items-center justify-between"
					on:click={() => mobileMenuOpen = false}
				>
					<span>How it works</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
				<a
					href="/tools"
					class="text-[var(--muted)] text-sm uppercase tracking-widest hover:text-[var(--white)] transition-colors flex items-center justify-between"
					on:click={() => mobileMenuOpen = false}
				>
					<span>Tools</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
				<a
					href="/docs"
					class="text-[var(--muted)] text-sm uppercase tracking-widest hover:text-[var(--white)] transition-colors flex items-center justify-between"
					on:click={() => mobileMenuOpen = false}
				>
					<span>Docs</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>

				<div class="h-px bg-[var(--border)] my-2"></div>

				<a
					href="/demo"
					class="text-[var(--lime)] text-sm uppercase tracking-widest flex items-center justify-between"
					on:click={() => mobileMenuOpen = false}
				>
					<span>Try Demo</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</a>
			</div>
		</div>
	{/if}
</nav>

<style>
	.nav-link {
		@apply px-4 py-2 text-xs uppercase tracking-widest rounded-lg transition-all duration-300;
		color: var(--muted);
	}

	.nav-link:hover {
		color: var(--white);
		background: var(--surface);
	}

	.nav-link-highlight {
		color: var(--lime);
		border: 1px solid rgba(200, 255, 0, 0.3);
		background: rgba(200, 255, 0, 0.05);
	}

	.nav-link-highlight:hover {
		background: rgba(200, 255, 0, 0.1);
		border-color: rgba(200, 255, 0, 0.5);
	}
</style>
