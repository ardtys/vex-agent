<script lang="ts">
	export let variant: 'lime' | 'rainbow' | 'fire' | 'ocean' | 'purple' = 'lime';
	export let animate: boolean = true;
	export let className: string = '';

	const gradients = {
		lime: 'from-vex-lime via-green-400 to-vex-lime',
		rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
		fire: 'from-yellow-400 via-orange-500 to-red-500',
		ocean: 'from-cyan-400 via-blue-500 to-purple-500',
		purple: 'from-purple-400 via-pink-500 to-red-500'
	};
</script>

<span
	class="bg-gradient-to-r bg-clip-text text-transparent {gradients[variant]} {className}"
	class:animate-gradient-x={animate}
	style={animate ? 'background-size: 200% auto;' : ''}
>
	<slot />
</span>

<style>
	@keyframes gradient-x {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.animate-gradient-x {
		animation: gradient-x 3s ease infinite;
	}
</style>
