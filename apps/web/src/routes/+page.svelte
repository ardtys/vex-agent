<script lang="ts">
	import AnimatedBackground from '$lib/components/landing/AnimatedBackground.svelte';
	import Nav from '$lib/components/landing/Nav.svelte';
	import Ticker from '$lib/components/landing/Ticker.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Marquee from '$lib/components/landing/Marquee.svelte';
	import WhatItDoes from '$lib/components/landing/WhatItDoes.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import ToolRegistry from '$lib/components/landing/ToolRegistry.svelte';
	import Testimonials from '$lib/components/landing/Testimonials.svelte';
	import EarlyAccess from '$lib/components/landing/EarlyAccess.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import ContractAddress from '$lib/components/landing/ContractAddress.svelte';

	// New components
	import TrendingTokens from '$lib/components/landing/TrendingTokens.svelte';
	import LiveStats from '$lib/components/landing/LiveStats.svelte';
	import FAQ from '$lib/components/landing/FAQ.svelte';
	import Partners from '$lib/components/landing/Partners.svelte';
	import SupportedBy from '$lib/components/landing/SupportedBy.svelte';
	import { FloatingElements } from '$lib/components/ui';
	import { ToastContainer } from '$lib/components/ui';
</script>

<svelte:head>
	<title>VEX - Your Solana Co-Pilot</title>
	<meta name="description" content="Talk to VEX like a friend. Swap, snipe, launch — all from one chat. The AI agent for Solana degens." />
</svelte:head>

<!-- Toast notifications -->
<ToastContainer />

<!-- Floating decorative elements -->
<FloatingElements />

<AnimatedBackground />
<Nav />
<Ticker />
<Hero />
<ContractAddress />
<Marquee text="EXECUTE • DOMINATE • REPEAT" outlined={true} />
<WhatItDoes />
<LiveStats />
<HowItWorks />
<ToolRegistry />
<Marquee text="SWAP • LAUNCH • TRACK • PROFIT" />
<TrendingTokens />
<Partners />
<SupportedBy />
<Testimonials />
<FAQ />
<EarlyAccess />
<Footer />
