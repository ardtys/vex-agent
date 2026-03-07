<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	let email = '';
	let status: 'idle' | 'loading' | 'success' | 'error' = 'idle';

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!email) return;

		status = 'loading';

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		status = 'success';
		email = '';

		setTimeout(() => {
			status = 'idle';
		}, 3000);
	}
</script>

<section id="early-access" class="relative py-32 px-6 overflow-hidden">
	<!-- Background effects -->
	<div class="absolute inset-0">
		<!-- Radial gradient -->
		<div class="absolute inset-0 bg-gradient-radial from-[var(--lime)]/5 via-transparent to-transparent"></div>
		<!-- Grid pattern -->
		<div class="absolute inset-0 grid-pattern opacity-30"></div>
	</div>

	<!-- Floating orbs -->
	<div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[var(--lime)]/10 blur-3xl animate-pulse-slow"></div>
	<div class="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[var(--lime)]/5 blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>

	<div class="relative z-10 max-w-[800px] mx-auto text-center">
		<!-- Badge -->
		<div class="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border border-[var(--lime)]/20" use:reveal>
			<span class="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
			<span class="text-xs font-mono text-[var(--lime)]">LIMITED SPOTS AVAILABLE</span>
		</div>

		<h2 class="font-display text-6xl md:text-8xl text-[var(--white)] mb-4" use:reveal={{ delay: 100 }}>
			GET <span class="text-[var(--lime)] text-glow-lime">EARLY ACCESS</span>
		</h2>

		<p class="font-serif italic text-xl md:text-2xl text-[var(--muted)] mb-12" use:reveal={{ delay: 200 }}>
			Join the waitlist. Be first to trade with VEX.
		</p>

		<!-- Form with glow effect -->
		<div class="relative group" use:reveal={{ delay: 300 }}>
			<!-- Glow behind form -->
			<div class="absolute -inset-1 bg-gradient-to-r from-[var(--lime)]/30 via-[var(--lime)]/20 to-[var(--lime)]/30 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

			<form
				on:submit={handleSubmit}
				class="relative flex flex-col sm:flex-row gap-3 p-2 glass border border-[var(--border)] rounded-xl"
			>
				<div class="relative flex-1">
					<input
						type="email"
						bind:value={email}
						placeholder="your@email.com"
						class="w-full bg-transparent border-none text-[var(--white)] font-mono text-sm px-4 py-4 outline-none placeholder:text-[var(--muted)]"
						disabled={status === 'loading' || status === 'success'}
					/>
					<!-- Input focus line -->
					<div class="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[var(--lime)]/0 to-transparent focus-within:via-[var(--lime)] transition-all duration-300"></div>
				</div>
				<button
					type="submit"
					class="btn-primary glow-lime hover:glow-lime-intense transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px]"
					disabled={status === 'loading' || status === 'success'}
				>
					{#if status === 'loading'}
						<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Joining...</span>
					{:else if status === 'success'}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						<span>You're in!</span>
					{:else}
						<span>Join Waitlist</span>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					{/if}
				</button>
			</form>
		</div>

		{#if status === 'success'}
			<div class="mt-6 animate-fade-in-up">
				<p class="text-[var(--lime)] text-sm font-mono flex items-center justify-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					Welcome to VEX. We'll be in touch.
				</p>
			</div>
		{/if}

		<p class="text-[var(--muted)] text-xs mt-8 flex items-center justify-center gap-2" use:reveal={{ delay: 400 }}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
			</svg>
			No spam. Just alpha.
		</p>

		<!-- Social proof -->
		<div class="mt-12 flex flex-wrap items-center justify-center gap-8" use:reveal={{ delay: 500 }}>
			<div class="flex items-center gap-2">
				<div class="flex -space-x-2">
					<div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[var(--black)]"></div>
					<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-[var(--black)]"></div>
					<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lime)] to-emerald-500 border-2 border-[var(--black)]"></div>
				</div>
				<span class="text-xs text-[var(--muted)]">500+ on waitlist</span>
			</div>
			<div class="h-4 w-px bg-[var(--border)]"></div>
			<div class="flex items-center gap-2">
				<span class="text-[var(--lime)]">★★★★★</span>
				<span class="text-xs text-[var(--muted)]">Rated by early testers</span>
			</div>
		</div>
	</div>
</section>
