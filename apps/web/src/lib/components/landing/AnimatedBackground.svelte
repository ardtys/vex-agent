<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationId: number;

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		alpha: number;
	}

	const particles: Particle[] = [];
	const particleCount = 50;
	const connectionDistance = 150;

	function initParticles(width: number, height: number) {
		particles.length = 0;
		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				size: Math.random() * 2 + 1,
				alpha: Math.random() * 0.5 + 0.2
			});
		}
	}

	function animate() {
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Update and draw particles
		for (const particle of particles) {
			particle.x += particle.vx;
			particle.y += particle.vy;

			// Wrap around edges
			if (particle.x < 0) particle.x = canvas.width;
			if (particle.x > canvas.width) particle.x = 0;
			if (particle.y < 0) particle.y = canvas.height;
			if (particle.y > canvas.height) particle.y = 0;

			// Draw particle
			ctx.beginPath();
			ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(200, 255, 0, ${particle.alpha * 0.3})`;
			ctx.fill();
		}

		// Draw connections
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const dx = particles[i].x - particles[j].x;
				const dy = particles[i].y - particles[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < connectionDistance) {
					const alpha = (1 - distance / connectionDistance) * 0.15;
					ctx.beginPath();
					ctx.moveTo(particles[i].x, particles[i].y);
					ctx.lineTo(particles[j].x, particles[j].y);
					ctx.strokeStyle = `rgba(200, 255, 0, ${alpha})`;
					ctx.lineWidth = 0.5;
					ctx.stroke();
				}
			}
		}

		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		initParticles(canvas.width, canvas.height);
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		handleResize();
		animate();

		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 pointer-events-none z-0"
	aria-hidden="true"
/>

<!-- Gradient orbs -->
<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
	<!-- Main lime orb -->
	<div
		class="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-30 animate-pulse-slow"
		style="background: radial-gradient(circle, rgba(200, 255, 0, 0.15) 0%, transparent 70%);"
	></div>

	<!-- Secondary orb -->
	<div
		class="absolute top-[40%] -right-[15%] w-[500px] h-[500px] rounded-full opacity-20 animate-pulse-slow"
		style="background: radial-gradient(circle, rgba(200, 255, 0, 0.1) 0%, transparent 70%); animation-delay: 2s;"
	></div>

	<!-- Bottom orb -->
	<div
		class="absolute -bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-25 animate-pulse-slow"
		style="background: radial-gradient(circle, rgba(200, 255, 0, 0.12) 0%, transparent 70%); animation-delay: 4s;"
	></div>
</div>

<!-- Grid overlay -->
<div
	class="fixed inset-0 pointer-events-none z-0 grid-pattern opacity-50"
	aria-hidden="true"
></div>
