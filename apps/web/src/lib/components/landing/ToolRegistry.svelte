<script lang="ts">
	import { reveal, stagger } from '$lib/actions/reveal';

	const tools = [
		{
			name: 'Jupiter Swap',
			description: 'Best price routing across all Solana DEXs',
			tag: 'TRADING',
			size: 'large',
			icon: '⚡',
			color: 'lime'
		},
		{
			name: 'Pump.fun Launch',
			description: 'Deploy memecoins instantly',
			tag: 'LAUNCH',
			size: 'small',
			icon: '🚀',
			color: 'purple'
		},
		{
			name: 'Rug Check',
			description: 'Scan tokens for red flags',
			tag: 'SECURITY',
			size: 'small',
			icon: '🛡️',
			color: 'emerald'
		},
		{
			name: 'Portfolio Tracker',
			description: 'Real-time balance & PnL tracking',
			tag: 'ANALYTICS',
			size: 'medium',
			icon: '📊',
			color: 'blue'
		},
		{
			name: 'Trending Scanner',
			description: 'Find hot tokens via Birdeye',
			tag: 'DISCOVERY',
			size: 'medium',
			icon: '🔥',
			color: 'orange'
		},
		{
			name: 'Token Info',
			description: 'Detailed token metadata & stats',
			tag: 'DATA',
			size: 'small',
			icon: '📋',
			color: 'cyan'
		}
	];

	function getColorClasses(color: string) {
		const colors: Record<string, { tag: string; glow: string }> = {
			lime: {
				tag: 'text-[var(--lime)] bg-[var(--lime)]/10 border-[var(--lime)]/20',
				glow: 'group-hover:shadow-[0_0_30px_rgba(200,255,0,0.3)]'
			},
			purple: {
				tag: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
				glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]'
			},
			emerald: {
				tag: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
				glow: 'group-hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]'
			},
			blue: {
				tag: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
				glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
			},
			orange: {
				tag: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
				glow: 'group-hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]'
			},
			cyan: {
				tag: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
				glow: 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]'
			}
		};
		return colors[color] || colors.lime;
	}
</script>

<section id="tools" class="relative py-24 px-6 overflow-hidden">
	<!-- Background -->
	<div class="absolute inset-0 dot-pattern opacity-30"></div>

	<div class="relative z-10 max-w-[1400px] mx-auto">
		<div class="section-label" use:reveal>
			<span>Tool Registry</span>
		</div>

		<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
			<div>
				<h2 class="font-display text-5xl md:text-7xl text-[var(--white)] mb-4" use:reveal={{ delay: 100 }}>
					BUILT FOR <span class="text-[var(--lime)] text-glow-lime">DEGENS</span>
				</h2>
				<p class="text-[var(--muted)] text-lg max-w-xl" use:reveal={{ delay: 150 }}>
					Powerful integrations. Zero complexity. Just say what you want.
				</p>
			</div>
			<a
				href="/tools"
				class="text-xs text-[var(--lime)] font-mono flex items-center gap-2 hover:gap-4 transition-all duration-300"
				use:reveal={{ delay: 200 }}
			>
				<span>View all tools</span>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</div>

		<!-- Bento grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" use:stagger={{ staggerDelay: 100 }}>
			{#each tools as tool}
				{@const colorClasses = getColorClasses(tool.color)}
				<div
					class="group relative {tool.size === 'large' ? 'col-span-2 row-span-2' : ''} {tool.size === 'medium' ? 'md:col-span-2' : ''}"
				>
					<div
						class="relative h-full glass border border-[var(--border)] rounded-xl p-5 md:p-6 hover:border-[var(--lime)]/30 transition-all duration-300 {colorClasses.glow}"
					>
						<!-- Shimmer effect -->
						<div class="absolute inset-0 rounded-xl overflow-hidden">
							<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
								<div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
							</div>
						</div>

						<div class="relative z-10 h-full flex flex-col">
							<!-- Tag and Icon row -->
							<div class="flex items-start justify-between mb-4">
								<span class="text-[10px] font-mono tracking-wider px-2 py-1 rounded border {colorClasses.tag}">
									{tool.tag}
								</span>
								<span class="text-2xl md:text-3xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
									{tool.icon}
								</span>
							</div>

							<!-- Content -->
							<div class="mt-auto">
								<h3 class="font-display text-xl md:text-2xl text-[var(--white)] mb-2 group-hover:text-[var(--lime)] transition-colors duration-300">
									{tool.name}
								</h3>
								<p class="text-[var(--muted)] text-xs leading-relaxed">
									{tool.description}
								</p>
							</div>

							<!-- Decorative line -->
							<div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lime)]/0 to-transparent group-hover:via-[var(--lime)]/30 transition-all duration-500"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Bottom CTA -->
		<div class="mt-12 text-center" use:reveal={{ delay: 300 }}>
			<p class="text-[var(--muted)] text-sm mb-4">
				And many more tools coming soon...
			</p>
			<div class="flex justify-center gap-4 text-xs text-[var(--muted)]">
				<span class="px-3 py-1 rounded-full border border-[var(--border)]">Limit Orders</span>
				<span class="px-3 py-1 rounded-full border border-[var(--border)]">DCA</span>
				<span class="px-3 py-1 rounded-full border border-[var(--border)]">NFT Minting</span>
				<span class="px-3 py-1 rounded-full border border-[var(--border)]">Staking</span>
			</div>
		</div>
	</div>
</section>
