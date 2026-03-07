<script lang="ts">
	import { onMount } from 'svelte';

	export let data: number[] = [];
	export let width: number = 100;
	export let height: number = 32;
	export let color: 'auto' | 'lime' | 'red' = 'auto';
	export let showArea: boolean = true;
	export let animated: boolean = true;

	let pathD: string = '';
	let areaD: string = '';
	let strokeColor: string;
	let fillColor: string;

	$: {
		if (data.length > 1) {
			const min = Math.min(...data);
			const max = Math.max(...data);
			const range = max - min || 1;

			const points = data.map((value, index) => {
				const x = (index / (data.length - 1)) * width;
				const y = height - ((value - min) / range) * height * 0.8 - height * 0.1;
				return { x, y };
			});

			// Create smooth curve using quadratic bezier
			pathD = points.reduce((acc, point, i) => {
				if (i === 0) return `M ${point.x} ${point.y}`;
				const prev = points[i - 1];
				const cpX = (prev.x + point.x) / 2;
				return `${acc} Q ${cpX} ${prev.y} ${point.x} ${point.y}`;
			}, '');

			// Area path
			areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

			// Determine color based on trend
			const trend = data[data.length - 1] - data[0];
			if (color === 'auto') {
				strokeColor = trend >= 0 ? '#c8ff00' : '#ff2d2d';
				fillColor = trend >= 0 ? 'rgba(200, 255, 0, 0.1)' : 'rgba(255, 45, 45, 0.1)';
			} else if (color === 'lime') {
				strokeColor = '#c8ff00';
				fillColor = 'rgba(200, 255, 0, 0.1)';
			} else {
				strokeColor = '#ff2d2d';
				fillColor = 'rgba(255, 45, 45, 0.1)';
			}
		}
	}

	let mounted = false;
	onMount(() => {
		if (animated) {
			setTimeout(() => (mounted = true), 100);
		} else {
			mounted = true;
		}
	});
</script>

<svg {width} {height} class="overflow-visible">
	<defs>
		<linearGradient id="sparkline-gradient-{color}" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" style="stop-color: {strokeColor}; stop-opacity: 0.3" />
			<stop offset="100%" style="stop-color: {strokeColor}; stop-opacity: 0" />
		</linearGradient>
	</defs>

	{#if data.length > 1}
		<!-- Area fill -->
		{#if showArea}
			<path
				d={areaD}
				fill="url(#sparkline-gradient-{color})"
				class="transition-opacity duration-500"
				class:opacity-0={!mounted}
				class:opacity-100={mounted}
			/>
		{/if}

		<!-- Line -->
		<path
			d={pathD}
			fill="none"
			stroke={strokeColor}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="transition-all duration-700"
			style={animated ? `stroke-dasharray: ${mounted ? '0' : '1000'}; stroke-dashoffset: ${mounted ? '0' : '1000'};` : ''}
		/>

		<!-- End dot -->
		{#if mounted && data.length > 0}
			{@const lastPoint = {
				x: width,
				y:
					height -
					((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) *
						height *
						0.8 -
					height * 0.1
			}}
			<circle cx={lastPoint.x} cy={lastPoint.y} r="2" fill={strokeColor} class="animate-pulse" />
		{/if}
	{/if}
</svg>
