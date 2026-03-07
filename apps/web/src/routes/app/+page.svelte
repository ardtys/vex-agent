<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import WalletBar from '$lib/components/WalletBar.svelte';
	import { ToastContainer, NetworkStatus, Badge } from '$lib/components/ui';
</script>

<svelte:head>
	<title>VEX App - Chat</title>
</svelte:head>

<!-- Toast notifications -->
<ToastContainer />

<div class="flex flex-col h-screen bg-vex-black">
	<!-- Header -->
	<header class="flex items-center justify-between px-4 py-3 border-b border-vex-border bg-vex-surface/50 backdrop-blur-sm">
		<div class="flex items-center gap-4">
			<a href="/" class="flex items-center gap-2 font-display text-3xl tracking-wide text-vex-lime hover:opacity-80 transition-opacity">
				VEX
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-vex-lime opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-vex-lime"></span>
				</span>
			</a>
			<Badge variant="lime" size="sm">BETA</Badge>
		</div>

		<div class="flex items-center gap-4">
			<NetworkStatus />
			<div class="h-4 w-px bg-vex-border"></div>
			<WalletBar />
		</div>
	</header>

	<!-- Main content -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Chat area -->
		<main class="flex-1 flex flex-col overflow-hidden">
			<Chat />
		</main>
	</div>

	<!-- Footer status bar -->
	<footer class="flex items-center justify-between px-4 py-2 border-t border-vex-border bg-vex-surface/30 text-xs text-vex-muted">
		<div class="flex items-center gap-4">
			<span>Powered by <span class="text-vex-lime">Qwen 2.5 72B</span></span>
			<span class="h-3 w-px bg-vex-border"></span>
			<span>Jupiter Aggregator</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="h-1.5 w-1.5 rounded-full bg-vex-success animate-pulse"></span>
			<span>Connected to Solana Mainnet</span>
		</div>
	</footer>
</div>
