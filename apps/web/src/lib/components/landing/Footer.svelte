<script lang="ts">
	const currentYear = new Date().getFullYear();

	const productLinks = [
		{ label: 'Demo', href: '/demo' },
		{ label: 'How it Works', href: '/how-it-works' },
		{ label: 'Tools', href: '/tools' },
		{ label: 'Docs', href: '/docs' }
	];

	const socialLinks = [
		{
			label: 'X',
			href: 'https://x.com/vex_agent',
			icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
		},
		{
			label: 'Telegram',
			href: 'https://t.me/vexagentcommunity',
			icon: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'
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
