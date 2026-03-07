<script lang="ts">
	export let src: string | undefined = undefined;
	export let alt: string = '';
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let fallback: string = '';
	export let status: 'online' | 'offline' | 'away' | 'busy' | undefined = undefined;
	export let bordered: boolean = false;

	let imageError = false;

	const sizeClasses = {
		xs: 'h-6 w-6 text-xs',
		sm: 'h-8 w-8 text-sm',
		md: 'h-10 w-10 text-base',
		lg: 'h-12 w-12 text-lg',
		xl: 'h-16 w-16 text-xl'
	};

	const statusSizes = {
		xs: 'h-1.5 w-1.5',
		sm: 'h-2 w-2',
		md: 'h-2.5 w-2.5',
		lg: 'h-3 w-3',
		xl: 'h-4 w-4'
	};

	const statusColors = {
		online: 'bg-vex-success',
		offline: 'bg-vex-muted',
		away: 'bg-vex-warning',
		busy: 'bg-vex-red'
	};

	$: initials = fallback || alt.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

	function handleError() {
		imageError = true;
	}
</script>

<div class="relative inline-block">
	<div
		class="flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-vex-lime/20 to-vex-lime/5 font-mono font-bold text-vex-lime {sizeClasses[size]}"
		class:ring-2={bordered}
		class:ring-vex-lime={bordered}
		class:ring-offset-2={bordered}
		class:ring-offset-vex-black={bordered}
	>
		{#if src && !imageError}
			<img
				{src}
				{alt}
				class="h-full w-full object-cover"
				on:error={handleError}
			/>
		{:else}
			{initials}
		{/if}
	</div>

	{#if status}
		<span
			class="absolute bottom-0 right-0 rounded-full ring-2 ring-vex-black {statusSizes[size]} {statusColors[status]}"
		></span>
	{/if}
</div>
