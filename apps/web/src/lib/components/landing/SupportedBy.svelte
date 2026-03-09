<script lang="ts">
	import { reveal, stagger } from '$lib/actions/reveal';
	import GradientText from '../ui/GradientText.svelte';

	const supporters = [
		{
			username: 'Elenism',
			displayName: '@Elenism',
			link: 'https://x.com/Elenism',
			avatar: 'https://unavatar.io/twitter/Elenism'
		},
		{
			username: 'icobeast',
			displayName: '@icobeast',
			link: 'https://x.com/icobeast',
			avatar: 'https://unavatar.io/twitter/icobeast'
		}
	];
</script>

<section class="relative py-20 px-6 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/30 to-transparent"></div>

	<div class="relative z-10 max-w-5xl mx-auto">
		<div class="text-center mb-12" use:reveal>
			<h3 class="font-display text-3xl md:text-4xl text-vex-white">
				<GradientText variant="lime">Supported by</GradientText>
			</h3>
		</div>

		<div class="flex flex-wrap justify-center gap-8" use:stagger={{ staggerDelay: 100 }}>
			{#each supporters as supporter}
				<a
					href={supporter.link}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex flex-col items-center gap-3 p-5 rounded-xl border border-vex-border/50 bg-vex-black/30 transition-all duration-300 hover:border-vex-lime/50 hover:bg-vex-surface/50 hover:scale-105"
				>
					<div class="relative">
						<div class="absolute -inset-1 bg-gradient-to-br from-vex-lime/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
						<img
							src={supporter.avatar}
							alt={supporter.displayName}
							class="relative w-20 h-20 rounded-full border-2 border-vex-border group-hover:border-vex-lime/50 transition-colors duration-300 object-cover"
							loading="lazy"
						/>
					</div>
					<p class="font-medium text-base text-vex-white group-hover:text-vex-lime transition-colors duration-300">
						{supporter.displayName}
					</p>
				</a>
			{/each}
		</div>

	</div>
</section>
