<script lang="ts">
	import { Shield, School, Users, BarChart3, LogOut, ChevronDown, Sun, Moon } from 'lucide-svelte';
	import { authStore, logout } from '$lib/auth-store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores';
	import SekolahTab from './tabs/SekolahTab.svelte';
	import AdminTab from './tabs/AdminTab.svelte';
	import StatsTab from './tabs/StatsTab.svelte';

	let showUserMenu = $state(false);
	let currentTab = $state('sekolah');
	let currentTheme = $state<'dark' | 'light'>('dark');

	// Load theme from localStorage on mount
	onMount(() => {
		const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
		if (savedTheme) {
			currentTheme = savedTheme;
			theme.set(savedTheme);
		}

		if (!$authStore.isAuthenticated) {
			goto('/superadmin/login');
			return;
		}

		if ($authStore.user?.role !== 'superadmin') {
			goto('/');
			return;
		}
	});

	// Sync theme changes
	$effect(() => {
		const unsubscribe = theme.subscribe((v) => {
			currentTheme = v;
			if (typeof window !== 'undefined') {
				localStorage.setItem('theme', v);
				if (v === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		});
		return unsubscribe;
	});

	function toggleTheme() {
		theme.set(currentTheme === 'dark' ? 'light' : 'dark');
	}

	async function handleLogout() {
		if (confirm('Yakin ingin keluar?')) {
			await logout();
			goto('/superadmin/login');
		}
	}

	function switchTab(tab: string) {
		currentTab = tab;
	}
</script>

<svelte:head>
	<title>Superadmin Dashboard - Sistem Informasi Infaq & Jariyah</title>
</svelte:head>

<div class="min-h-screen {currentTheme === 'dark' ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} transition-colors duration-300">
	<!-- Header -->
	<header class="{currentTheme === 'dark' ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'} border-b shadow-lg transition-colors duration-300">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo and Title -->
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-blue-500/20">
						<Shield size={20} color="#fff" />
					</div>
					<div>
						<h1 class="text-lg font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
							Superadmin Dashboard
						</h1>
						<p class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}">
							Kelola Sekolah dan Admin
						</p>
					</div>
				</div>

				<!-- Right Side: Theme Toggle + User Menu -->
				<div class="flex items-center gap-3">
					<!-- Theme Toggle -->
					<button
						type="button"
						onclick={toggleTheme}
						class="p-2.5 rounded-xl {currentTheme === 'dark' ? 'bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:bg-[#334155]' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'} transition-all duration-300"
						aria-label="Toggle theme"
					>
						{#if currentTheme === 'dark'}
							<Sun size={18} />
						{:else}
							<Moon size={18} />
						{/if}
					</button>

					<!-- User Menu -->
					<div class="relative">
						<button
							onclick={() => showUserMenu = !showUserMenu}
							class="flex items-center gap-2 px-4 py-2 rounded-xl {currentTheme === 'dark' ? 'bg-[#0f172a] border border-[#334155] text-[#f1f5f9] hover:bg-[#334155]' : 'bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100'} transition-colors"
						>
							<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-sm">
								{($authStore.user?.email || 'S')[0].toUpperCase()}
							</div>
							<span class="text-sm font-medium">{$authStore.user?.email || 'Superadmin'}</span>
							<ChevronDown size={16} class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}" />
						</button>

						{#if showUserMenu}
							<div class="absolute right-0 mt-2 w-64 rounded-xl {currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} shadow-xl z-50">
								<div class="p-4 {currentTheme === 'dark' ? 'border-b border-[#334155]' : 'border-b border-slate-200'}">
									<p class="text-sm font-medium {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{$authStore.user?.email}</p>
									<p class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'} mt-1">Role: Superadmin</p>
								</div>
								<div class="p-2">
									<button
										onclick={handleLogout}
										class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 {currentTheme === 'dark' ? 'hover:bg-red-500/10' : 'hover:bg-red-50'} rounded-lg transition-colors"
									>
										<LogOut size={16} />
										Keluar
									</button>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Navigation Tabs -->
	<div class="{currentTheme === 'dark' ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'} border-b transition-colors duration-300">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex gap-2 py-3">
				<button
					onclick={() => switchTab('sekolah')}
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors {currentTab === 'sekolah' ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white' : (currentTheme === 'dark' ? 'text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700')}"
				>
					<School size={18} />
					Kelola Sekolah
				</button>
				<button
					onclick={() => switchTab('admin')}
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors {currentTab === 'admin' ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white' : (currentTheme === 'dark' ? 'text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700')}"
				>
					<Users size={18} />
					Kelola Admin
				</button>
				<button
					onclick={() => switchTab('stats')}
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors {currentTab === 'stats' ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white' : (currentTheme === 'dark' ? 'text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700')}"
				>
					<BarChart3 size={18} />
					Statistik
				</button>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if currentTab === 'sekolah'}
			<SekolahTab />
		{:else if currentTab === 'admin'}
			<AdminTab />
		{:else if currentTab === 'stats'}
			<StatsTab />
		{/if}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
