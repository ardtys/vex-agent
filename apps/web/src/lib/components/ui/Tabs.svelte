<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Tab {
		id: string;
		label: string;
		icon?: string;
		badge?: string | number;
	}

	export let tabs: Tab[] = [];
	export let activeTab: string = tabs[0]?.id || '';
	export let variant: 'default' | 'pills' | 'underline' = 'default';

	const dispatch = createEventDispatcher<{ change: string }>();

	function selectTab(id: string) {
		activeTab = id;
		dispatch('change', id);
	}

	function getBadgeClass(isActive: boolean, isDefault: boolean): string {
		if (isActive && isDefault) return 'bg-vex-black';
		return 'bg-vex-lime/20';
	}
</script>

<div class="w-full">
	<!-- Tab headers -->
	<div
		class="flex"
		class:gap-1={variant === 'pills'}
		class:border-b={variant === 'underline'}
		class:border-vex-border={variant === 'underline'}
		class:rounded-lg={variant === 'default'}
		class:bg-vex-surface={variant === 'default'}
		class:p-1={variant === 'default'}
	>
		{#each tabs as tab (tab.id)}
			<button
				on:click={() => selectTab(tab.id)}
				class="relative flex items-center justify-center gap-2 px-4 py-2 font-mono text-sm transition-all duration-200 hover:text-vex-white"
				class:flex-1={variant === 'default'}
				class:rounded-md={variant === 'default' || variant === 'pills'}
				class:text-vex-white={activeTab === tab.id}
				class:bg-vex-lime={activeTab === tab.id && variant === 'default'}
				class:text-vex-black={activeTab === tab.id && variant === 'default'}
				class:bg-vex-surface={activeTab === tab.id && variant === 'pills'}
				class:text-vex-muted={activeTab !== tab.id}
			>
				{#if tab.icon}
					<span>{tab.icon}</span>
				{/if}
				{tab.label}
				{#if tab.badge !== undefined}
					<span
						class="rounded-full px-1.5 py-0.5 text-[10px] text-vex-lime {getBadgeClass(activeTab === tab.id, variant === 'default')}"
					>
						{tab.badge}
					</span>
				{/if}

				<!-- Underline indicator -->
				{#if variant === 'underline' && activeTab === tab.id}
					<div
						class="absolute -bottom-px left-0 right-0 h-0.5 bg-vex-lime"
					></div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Tab content -->
	<div class="mt-4">
		<slot {activeTab} />
	</div>
</div>
