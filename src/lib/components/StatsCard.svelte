<script lang="ts">
	import type { Component } from 'svelte';
	import * as Lucide from 'lucide-svelte';
	import { formatRupiah } from '$lib/utils';
	import { theme } from '$lib/stores';

	interface Props {
		label: string;
		value: number;
		icon: keyof typeof Lucide;
		color: string;
		borderColor: string;
		bgColor: string;
	}

	let { label, value, icon, color, borderColor, bgColor }: Props = $props();
	let currentTheme = $derived($theme);

	let Icon = $derived(Lucide[icon] as unknown as Component<{ size?: number; color?: string }>);
</script>

<div
	class="stat-card rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
	style="background: {currentTheme === 'dark' ? '#1e293b' : '#ffffff'}; border-color: {currentTheme === 'dark' ? borderColor : '#e2e8f0'};"
>
	<div class="flex items-center gap-2 mb-2">
		<div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: {bgColor};">
			<Icon size={16} color={color} />
		</div>
		<span class="text-xs font-semibold uppercase tracking-wider" style="color: {color};">
			{label}
		</span>
	</div>
	<p class="text-2xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
		{formatRupiah(value)}
	</p>
</div>

<style>
	.stat-card {
		background: #1e293b;
	}
</style>
