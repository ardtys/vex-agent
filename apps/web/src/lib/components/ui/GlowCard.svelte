<script lang="ts">
	export let variant: 'lime' | 'purple' | 'blue' | 'orange' = 'lime';
	export let hover: boolean = true;
	export let padding: 'sm' | 'md' | 'lg' = 'md';

	const glowColors = {
		lime: 'hover:shadow-[0_0_30px_rgba(200,255,0,0.15)]',
		purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
		blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
		orange: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]'
	};

	const borderColors = {
		lime: 'hover:border-vex-lime/50',
		purple: 'hover:border-purple-500/50',
		blue: 'hover:border-blue-500/50',
		orange: 'hover:border-orange-500/50'
	};

	const paddingClasses = {
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};
</script>

<div
	class="relative rounded-2xl border border-vex-border bg-vex-surface/50 backdrop-blur-sm transition-all duration-300
		{paddingClasses[padding]}
		{hover ? `${glowColors[variant]} ${borderColors[variant]} hover:-translate-y-1` : ''}"
>
	<!-- Gradient accent line -->
	<div
		class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300
			{variant === 'lime' ? 'text-vex-lime' : ''}
			{variant === 'purple' ? 'text-purple-500' : ''}
			{variant === 'blue' ? 'text-blue-500' : ''}
			{variant === 'orange' ? 'text-orange-500' : ''}"
		class:opacity-100={hover}
	></div>

	<slot />
</div>
