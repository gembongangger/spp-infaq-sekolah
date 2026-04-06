<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/auth-store';
	import { transaksiApi } from '$lib/api';
	import { TrendingUp, Heart, TrendingDown, Wallet } from 'lucide-svelte';
	import { theme } from '$lib/stores';

	let stats = $state({
		totalInfaq: 0,
		totalJariyah: 0,
		totalKeluar: 0,
		saldo: 0
	});
	let loading = $state(true);
	let error = $state('');
	let currentTheme = $state<'dark' | 'light'>('dark');

	onMount(async () => {
		// Load theme
		const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
		if (savedTheme) {
			currentTheme = savedTheme;
			theme.set(savedTheme);
		}

		$effect(() => {
			const unsubscribe = theme.subscribe((v) => {
				currentTheme = v;
			});
			return unsubscribe;
		});

		await loadStats();
	});

	async function loadStats() {
		try {
			loading = true;
			error = '';
			const data = await transaksiApi.getStats();
			stats = data;
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<div>
	<div class="mb-8">
		<h2 class="text-2xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} mb-2">Dashboard</h2>
		<p class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}">Statistik infaq dan jariyah sekolah</p>
	</div>

	{#if error}
		<div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
			<p class="text-red-400">{error}</p>
			<button onclick={loadStats} class="mt-2 text-sm text-red-400 hover:text-red-300">
				Coba lagi
			</button>
		</div>
	{/if}

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each [1, 2, 3, 4] as _}
				<div class="{currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'} rounded-2xl p-6 animate-pulse">
					<div class="h-4 {currentTheme === 'dark' ? 'bg-[#334155]' : 'bg-slate-200'} rounded w-1/2 mb-4"></div>
					<div class="h-8 {currentTheme === 'dark' ? 'bg-[#334155]' : 'bg-slate-200'} rounded w-3/4"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Total Infaq -->
			<div class="{currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
				<div class="flex items-center justify-between mb-4">
					<div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
						<TrendingUp size={24} class="text-emerald-500" />
					</div>
					<span class="text-xs text-emerald-500 font-medium">Infaq</span>
				</div>
				<h3 class="{currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'} text-sm mb-1">Total Infaq</h3>
				<p class="text-2xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{formatCurrency(stats.totalInfaq)}</p>
			</div>

			<!-- Total Jariyah -->
			<div class="{currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} rounded-2xl p-6 hover:border-pink-500/50 transition-colors">
				<div class="flex items-center justify-between mb-4">
					<div class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
						<Heart size={24} class="text-pink-500" />
					</div>
					<span class="text-xs text-pink-500 font-medium">Jariyah</span>
				</div>
				<h3 class="{currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'} text-sm mb-1">Total Jariyah</h3>
				<p class="text-2xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{formatCurrency(stats.totalJariyah)}</p>
			</div>

			<!-- Total Keluar -->
			<div class="{currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} rounded-2xl p-6 hover:border-red-500/50 transition-colors">
				<div class="flex items-center justify-between mb-4">
					<div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
						<TrendingDown size={24} class="text-red-500" />
					</div>
					<span class="text-xs text-red-500 font-medium">Pengeluaran</span>
				</div>
				<h3 class="{currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'} text-sm mb-1">Total Pengeluaran</h3>
				<p class="text-2xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{formatCurrency(stats.totalKeluar)}</p>
			</div>

			<!-- Saldo -->
			<div class="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
				<div class="flex items-center justify-between mb-4">
					<div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
						<Wallet size={24} class="text-white" />
					</div>
					<span class="text-xs text-white/80 font-medium">Saldo</span>
				</div>
				<h3 class="text-white/80 text-sm mb-1">Saldo Tersedia</h3>
				<p class="text-2xl font-bold text-white">{formatCurrency(stats.saldo)}</p>
			</div>
		</div>

		<!-- Info Card -->
		<div class="mt-8 {currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} rounded-2xl p-6">
			<h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} mb-4">Informasi</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="{currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50'} rounded-xl p-4">
					<p class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'} text-sm mb-1">Total Infaq + Jariyah</p>
					<p class="text-xl font-bold text-emerald-500">{formatCurrency(stats.totalInfaq + stats.totalJariyah)}</p>
				</div>
				<div class="{currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50'} rounded-xl p-4">
					<p class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'} text-sm mb-1">Total Pengeluaran</p>
					<p class="text-xl font-bold text-red-500">{formatCurrency(stats.totalKeluar)}</p>
				</div>
				<div class="{currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50'} rounded-xl p-4">
					<p class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'} text-sm mb-1">Saldo Tersedia</p>
					<p class="text-xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{formatCurrency(stats.saldo)}</p>
				</div>
			</div>
		</div>
	{/if}
</div>
