<script lang="ts">
	import { onMount } from 'svelte';

	interface FloatingItem {
		id: number;
		icon: string;
		x: number;
		y: number;
		size: number;
		duration: number;
		delay: number;
		opacity: number;
	}

	const icons = ['◈', '◉', '◎', '⬡', '⬢', '△', '▽', '◇', '⟐', '⊕'];

	let items: FloatingItem[] = [];

	onMount(() => {
		items = Array.from({ length: 15 }, (_, i) => ({
			id: i,
			icon: icons[Math.floor(Math.random() * icons.length)],
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: 12 + Math.random() * 20,
			duration: 15 + Math.random() * 20,
			delay: Math.random() * -20,
			opacity: 0.05 + Math.random() * 0.1
		}));
	});
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden">
	{#each items as item (item.id)}
		<div
			class="absolute text-vex-lime"
			style="
				left: {item.x}%;
				top: {item.y}%;
				font-size: {item.size}px;
				opacity: {item.opacity};
				animation: float-around {item.duration}s ease-in-out infinite;
				animation-delay: {item.delay}s;
			"
		>
			{item.icon}
		</div>
	{/each}
</div>

<style>
	@keyframes float-around {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		25% {
			transform: translate(20px, -30px) rotate(90deg);
		}
		50% {
			transform: translate(-10px, -50px) rotate(180deg);
		}
		75% {
			transform: translate(-30px, -20px) rotate(270deg);
		}
	}
</style>
