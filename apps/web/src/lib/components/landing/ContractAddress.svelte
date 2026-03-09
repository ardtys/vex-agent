<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import GradientText from '../ui/GradientText.svelte';

	const contractAddress = 'CLYoLKxFHqrYKy3zr7EtwPwRG3j3yYotYRpcy2P6pump';
	let copied = false;

	async function copyToClipboard() {
		if (contractAddress === 'COMING SOON') return;

		try {
			await navigator.clipboard.writeText(contractAddress);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<section class="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
	<!-- Background -->
	<div class="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--lime)]/5 to-transparent"></div>

	<div class="relative z-10 max-w-3xl mx-auto">
		<div class="text-center mb-8" use:reveal>
			<h3 class="font-display text-3xl sm:text-4xl md:text-5xl text-vex-white mb-2">
				<GradientText variant="lime">Contract Address</GradientText>
			</h3>
			<p class="text-vex-muted text-sm">$VEX token</p>
		</div>

		<!-- Contract Address Box -->
		<div
			class="group relative"
			use:reveal={{ delay: 100 }}
		>
			<!-- Glow effect -->
			<div class="absolute -inset-1 bg-gradient-to-r from-[var(--lime)]/20 via-[var(--lime)]/10 to-[var(--lime)]/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

			<div class="relative glass border border-[var(--border)] rounded-xl p-4 sm:p-6 hover:border-[var(--lime)]/30 transition-all duration-300">
				<div class="flex flex-col sm:flex-row items-center gap-4">
					<!-- Address -->
					<div class="flex-1 min-w-0 text-center sm:text-left">
						<p class="text-[10px] sm:text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Token Address</p>
						<p class="font-mono text-sm sm:text-base md:text-lg text-[var(--white)] break-all {contractAddress === 'COMING SOON' ? 'text-[var(--lime)] animate-pulse' : ''}">
							{contractAddress}
						</p>
					</div>

					<!-- Copy Button -->
					<button
						on:click={copyToClipboard}
						disabled={contractAddress === 'COMING SOON'}
						class="flex-shrink-0 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 touch-target
							{contractAddress === 'COMING SOON'
								? 'bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed'
								: 'bg-[var(--lime)] text-[var(--black)] hover:glow-lime'}"
					>
						{#if copied}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							<span>Copied!</span>
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
							<span>Copy</span>
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Info text -->
		<p class="text-center text-[var(--muted)] text-xs mt-4" use:reveal={{ delay: 200 }}>
			Always verify the contract address before trading
		</p>
	</div>
</section>
