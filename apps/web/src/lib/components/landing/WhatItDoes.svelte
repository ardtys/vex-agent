<script lang="ts">
	import { reveal, stagger } from '$lib/actions/reveal';

	const features = [
		{
			number: '01',
			title: 'Swap Any Token',
			description: 'Jupiter-powered swaps with best routes. Just say "swap 5 SOL for WIF" and watch it happen.',
			icon: '⟲',
			gradient: 'from-[var(--lime)]/20 to-transparent'
		},
		{
			number: '02',
			title: 'Launch Tokens',
			description: 'Deploy on Pump.fun instantly. Name it, set supply, launch. Your memecoin in seconds.',
			icon: '◆',
			gradient: 'from-purple-500/20 to-transparent'
		},
		{
			number: '03',
			title: 'Track Everything',
			description: 'Real-time PnL, portfolio value, win rate. Know exactly where you stand.',
			icon: '◎',
			gradient: 'from-blue-500/20 to-transparent'
		},
		{
			number: '04',
			title: 'Stay Safe',
			description: 'Automatic rug checks before every trade. We scan so you don\'t get burned.',
			icon: '⬡',
			gradient: 'from-emerald-500/20 to-transparent'
		}
	];
</script>

<section id="features" class="relative py-24 px-6 overflow-hidden">
	<!-- Background accent -->
	<div class="absolute inset-0 bg-mesh opacity-50"></div>

	<div class="relative z-10 max-w-[1400px] mx-auto">
		<div class="section-label" use:reveal>
			<span>What it does</span>
		</div>

		<h2 class="font-display text-5xl md:text-7xl text-[var(--white)] mb-4" use:reveal={{ delay: 100 }}>
			EVERYTHING YOU <span class="text-[var(--lime)] text-glow-lime">NEED</span>
		</h2>
		<p class="text-[var(--muted)] text-lg max-w-2xl mb-12" use:reveal={{ delay: 150 }}>
			One AI agent. Endless possibilities. Trade, track, and launch with natural language.
		</p>

		<div class="grid md:grid-cols-2 gap-4" use:stagger={{ staggerDelay: 150 }}>
			{#each features as feature, i}
				<div class="group relative">
					<!-- Hover glow effect -->
					<div class="absolute -inset-0.5 bg-gradient-to-r {feature.gradient} rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>

					<div class="relative glass border border-[var(--border)] rounded-xl p-8 md:p-10 hover:border-[var(--lime)]/30 transition-all duration-300 card-hover h-full">
						<!-- Background gradient on hover -->
						<div class="absolute inset-0 bg-gradient-to-br {feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

						<div class="relative z-10">
							<div class="flex items-start justify-between mb-6">
								<span class="text-xs text-[var(--muted)] font-mono px-2 py-1 bg-[var(--surface)] rounded">{feature.number}</span>
								<span class="text-4xl opacity-30 group-hover:opacity-100 group-hover:text-[var(--lime)] group-hover:text-glow-lime transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12">
									{feature.icon}
								</span>
							</div>
							<h3 class="font-display text-3xl md:text-4xl text-[var(--white)] mb-4 group-hover:text-[var(--lime)] transition-colors duration-300">
								{feature.title}
							</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed group-hover:text-[var(--white)]/70 transition-colors duration-300">
								{feature.description}
							</p>

							<!-- Learn more link -->
							<div class="mt-6 flex items-center gap-2 text-xs text-[var(--lime)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<span>Learn more</span>
								<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
