<script lang="ts">
	import { reveal, stagger } from '$lib/actions/reveal';

	const steps = [
		{
			step: '01',
			title: 'Tell VEX What You Want',
			description: 'Type naturally. "Buy 2 SOL of trending tokens" or "Check if PUMP is a rug". VEX understands.',
			icon: '💬'
		},
		{
			step: '02',
			title: 'Review the Plan',
			description: 'VEX shows you exactly what will happen. Full transparency before any action.',
			icon: '📋'
		},
		{
			step: '03',
			title: 'Execute',
			description: 'Approve the transaction and let VEX handle the rest. Simple and efficient.',
			icon: '✨'
		}
	];
</script>

<section id="how-it-works" class="relative py-24 px-6 overflow-hidden">
	<!-- Background -->
	<div class="absolute inset-0 bg-[var(--surface)]"></div>
	<div class="absolute inset-0 bg-mesh opacity-30"></div>

	<div class="relative z-10 max-w-[1400px] mx-auto">
		<div class="section-label" use:reveal>
			<span>How it works</span>
		</div>

		<h2 class="font-display text-5xl md:text-7xl text-[var(--white)] mb-4" use:reveal={{ delay: 100 }}>
			THREE SIMPLE <span class="text-[var(--lime)] text-glow-lime">STEPS</span>
		</h2>
		<p class="text-[var(--muted)] text-lg max-w-xl mb-16" use:reveal={{ delay: 150 }}>
			From question to execution in under a minute. No complexity. No learning curve.
		</p>

		<div class="grid md:grid-cols-3 gap-8" use:stagger={{ staggerDelay: 200 }}>
			{#each steps as step, i}
				<div class="group relative">
					<!-- Connector line -->
					{#if i < steps.length - 1}
						<div class="hidden md:block absolute top-12 left-full w-full h-px z-20">
							<div class="h-full bg-gradient-to-r from-[var(--lime)]/30 via-[var(--border)] to-[var(--lime)]/30"></div>
							<!-- Animated dot -->
							<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></div>
						</div>
					{/if}

					<!-- Card -->
					<div class="relative glass border border-[var(--border)] rounded-xl p-8 hover:border-[var(--lime)]/30 transition-all duration-300 card-hover h-full">
						<!-- Glow on hover -->
						<div class="absolute -inset-px bg-gradient-to-b from-[var(--lime)]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

						<div class="relative z-10">
							<!-- Step number and icon -->
							<div class="flex items-start justify-between mb-6">
								<div class="font-display text-6xl md:text-7xl text-[var(--lime)]/20 group-hover:text-[var(--lime)]/40 transition-colors duration-300">
									{step.step}
								</div>
								<div class="w-12 h-12 rounded-xl bg-[var(--lime)]/10 border border-[var(--lime)]/20 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-[var(--lime)]/20 transition-all duration-300">
									{step.icon}
								</div>
							</div>

							<!-- Content -->
							<h3 class="font-display text-2xl md:text-3xl text-[var(--white)] mb-3 group-hover:text-[var(--lime)] transition-colors duration-300">
								{step.title}
							</h3>
							<p class="text-[var(--muted)] text-sm leading-relaxed group-hover:text-[var(--white)]/60 transition-colors duration-300">
								{step.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Bottom CTA -->
		<div class="mt-16 text-center" use:reveal={{ delay: 400 }}>
			<a
				href="/how-it-works"
				class="inline-flex items-center gap-2 text-sm text-[var(--lime)] font-mono hover:gap-4 transition-all duration-300"
			>
				<span>Learn more about how VEX works</span>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
				</svg>
			</a>
		</div>
	</div>
</section>
