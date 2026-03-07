<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let value: number;
	export let duration: number = 2000;
	export let prefix: string = '';
	export let suffix: string = '';
	export let decimals: number = 0;
	export let startOnView: boolean = true;

	const displayValue = tweened(0, {
		duration,
		easing: cubicOut
	});

	let element: HTMLElement;
	let hasAnimated = false;

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toFixed(decimals);
	}

	onMount(() => {
		if (!startOnView) {
			displayValue.set(value);
			hasAnimated = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						displayValue.set(value);
						hasAnimated = true;
					}
				});
			},
			{ threshold: 0.5 }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<span bind:this={element} class="tabular-nums">
	{prefix}{formatNumber($displayValue)}{suffix}
</span>
