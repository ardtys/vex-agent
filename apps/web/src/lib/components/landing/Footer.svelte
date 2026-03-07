<script lang="ts">
	const currentYear = new Date().getFullYear();

	const productLinks = [
		{ label: 'How it Works', href: '/how-it-works' },
		{ label: 'Tools', href: '/tools' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Launch App', href: '/app' }
	];

	const socialLinks = [
		{
			label: 'Twitter',
			href: 'https://twitter.com/vex_sol',
			icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
		},
		{
			label: 'Discord',
			href: 'https://discord.gg/vex',
			icon: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z'
		},
		{
			label: 'GitHub',
			href: 'https://github.com/vex-sol',
			icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
		}
	];
</script>

<footer class="relative border-t border-[var(--border)] overflow-hidden">
	<!-- Background -->
	<div class="absolute inset-0 grid-pattern opacity-20"></div>

	<div class="relative z-10 max-w-[1400px] mx-auto px-6 py-16">
		<div class="grid md:grid-cols-4 gap-12 mb-16">
			<!-- Brand -->
			<div class="md:col-span-2">
				<div class="flex items-center gap-2 mb-4">
					<span class="font-display text-4xl text-[var(--lime)] text-glow-lime">VEX</span>
					<span class="text-xs text-[var(--muted)] font-mono px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)]">BETA</span>
				</div>
				<p class="text-[var(--muted)] text-sm max-w-md mb-6 leading-relaxed">
					Your AI-powered Solana co-pilot. Trade, track, and launch with natural language commands.
				</p>
				<!-- Social links -->
				<div class="flex items-center gap-4">
					{#each socialLinks as social}
						<a
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							class="w-10 h-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--lime)] hover:border-[var(--lime)]/30 transition-all duration-300"
							aria-label={social.label}
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<!-- Product links -->
			<div>
				<h4 class="text-xs text-[var(--white)] font-mono uppercase tracking-wider mb-4">Product</h4>
				<ul class="space-y-3">
					{#each productLinks as link}
						<li>
							<a
								href={link.href}
								class="text-[var(--muted)] text-sm hover:text-[var(--lime)] transition-colors duration-300"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Newsletter -->
			<div>
				<h4 class="text-xs text-[var(--white)] font-mono uppercase tracking-wider mb-4">Stay Updated</h4>
				<p class="text-[var(--muted)] text-xs mb-4">Get the latest updates and alpha.</p>
				<div class="flex gap-2">
					<input
						type="email"
						placeholder="Email"
						class="flex-1 min-w-0 bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-xs text-[var(--white)] placeholder:text-[var(--muted)] focus:border-[var(--lime)]/30 focus:outline-none transition-colors"
					/>
					<button class="px-3 py-2 bg-[var(--lime)] text-[var(--black)] text-xs font-mono font-bold rounded hover:glow-lime transition-all duration-300">
						GO
					</button>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
			<!-- Copyright -->
			<div class="text-[var(--muted)] text-xs flex items-center gap-2">
				<span>&copy; {currentYear} VEX.</span>
				<span class="text-[var(--lime)]">•</span>
				<span>DYOR. NFA.</span>
			</div>

			<!-- Status -->
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<span class="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
					<span class="text-xs text-[var(--muted)]">All systems operational</span>
				</div>
			</div>

			<!-- Legal links -->
			<div class="flex items-center gap-6 text-xs text-[var(--muted)]">
				<a href="/privacy" class="hover:text-[var(--white)] transition-colors">Privacy</a>
				<a href="/terms" class="hover:text-[var(--white)] transition-colors">Terms</a>
			</div>
		</div>
	</div>

	<!-- Disclaimer -->
	<div class="border-t border-[var(--border)] py-6 px-6">
		<p class="text-[var(--muted)] text-[10px] text-center max-w-3xl mx-auto leading-relaxed">
			VEX is an experimental AI agent. All transactions require your explicit approval.
			Trading cryptocurrency involves substantial risk of loss and is not suitable for every investor.
			Past performance is not indicative of future results. This is not financial advice. Always DYOR.
		</p>
	</div>
</footer>
