<script lang="ts">
	import { reveal, stagger } from '$lib/actions/reveal';

	const testimonials = [
		{
			quote: 'VEX made me mass-snipe 47 tokens in 30 min. Absolute game changer.',
			author: '@degen_larry',
			handle: 'Larry | SOL Maxi',
			avatar: 'L',
			color: 'from-purple-500 to-pink-500'
		},
		{
			quote: 'Finally someone built what I\'ve been asking for. Natural language trading is the future.',
			author: '@crypto_sarah',
			handle: 'Sarah | DeFi Dev',
			avatar: 'S',
			color: 'from-blue-500 to-cyan-500'
		},
		{
			quote: 'The rug check saved me from at least 3 rugs this week alone. Worth it.',
			author: '@solana_ape',
			handle: 'Ape | NFT Collector',
			avatar: 'A',
			color: 'from-[var(--lime)] to-emerald-500'
		}
	];
</script>

<section class="relative py-24 px-6 overflow-hidden">
	<!-- Background -->
	<div class="absolute inset-0 bg-[var(--surface)]"></div>
	<div class="absolute inset-0 dot-pattern opacity-20"></div>

	<div class="relative z-10 max-w-[1400px] mx-auto">
		<div class="section-label" use:reveal>
			<span>What degens say</span>
		</div>

		<h2 class="font-display text-5xl md:text-7xl text-[var(--white)] mb-12" use:reveal={{ delay: 100 }}>
			TRUSTED BY <span class="text-[var(--lime)] text-glow-lime">DEGENS</span>
		</h2>

		<div class="grid md:grid-cols-3 gap-6" use:stagger={{ staggerDelay: 150 }}>
			{#each testimonials as testimonial}
				<div class="group relative">
					<!-- Glow on hover -->
					<div class="absolute -inset-0.5 bg-gradient-to-b from-[var(--lime)]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>

					<div class="relative glass border border-[var(--border)] rounded-xl p-8 hover:border-[var(--lime)]/30 transition-all duration-300 h-full flex flex-col">
						<!-- Quote icon -->
						<div class="absolute -top-3 left-6 w-8 h-8 rounded-lg bg-[var(--lime)] flex items-center justify-center">
							<svg class="w-4 h-4 text-[var(--black)]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
							</svg>
						</div>

						<!-- Quote -->
						<p class="font-serif italic text-lg text-[var(--white)] mb-6 leading-relaxed pt-4 flex-grow">
							"{testimonial.quote}"
						</p>

						<!-- Author -->
						<div class="flex items-center gap-4 pt-6 border-t border-[var(--border)]">
							<div class="w-10 h-10 rounded-full bg-gradient-to-br {testimonial.color} flex items-center justify-center text-[var(--black)] font-bold">
								{testimonial.avatar}
							</div>
							<div>
								<div class="text-[var(--lime)] text-sm font-mono">
									{testimonial.author}
								</div>
								<div class="text-[var(--muted)] text-xs">
									{testimonial.handle}
								</div>
							</div>
						</div>

						<!-- Rating -->
						<div class="absolute top-6 right-6 text-[var(--lime)] text-xs">
							★★★★★
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Stats -->
		<div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8" use:reveal={{ delay: 300 }}>
			<div class="text-center">
				<div class="text-3xl md:text-4xl font-display text-[var(--lime)]">4.9/5</div>
				<div class="text-xs text-[var(--muted)] mt-1">Average Rating</div>
			</div>
			<div class="text-center">
				<div class="text-3xl md:text-4xl font-display text-[var(--white)]">500+</div>
				<div class="text-xs text-[var(--muted)] mt-1">Beta Testers</div>
			</div>
			<div class="text-center">
				<div class="text-3xl md:text-4xl font-display text-[var(--white)]">98%</div>
				<div class="text-xs text-[var(--muted)] mt-1">Satisfaction Rate</div>
			</div>
			<div class="text-center">
				<div class="text-3xl md:text-4xl font-display text-[var(--white)]">24/7</div>
				<div class="text-xs text-[var(--muted)] mt-1">Support Available</div>
			</div>
		</div>
	</div>
</section>
