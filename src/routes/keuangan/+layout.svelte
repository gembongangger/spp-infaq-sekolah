<script lang="ts">
	import { Wallet, LayoutDashboard, ArrowLeftRight, LogOut, ChevronDown, Bell, Sun, Moon } from 'lucide-svelte';
	import { authStore, logout } from '$lib/auth-store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores';

	let { children } = $props();

	let showUserMenu = $state(false);
	let pendingCount = $state(0);
	let currentTheme = $state<'dark' | 'light'>('dark');

	// Load theme from localStorage on mount
	onMount(() => {
		const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
		if (savedTheme) {
			currentTheme = savedTheme;
			theme.set(savedTheme);
		}

		if (!$authStore.isAuthenticated) {
			goto('/login');
			return;
		}

		if ($authStore.user?.role !== 'keuangan') {
			goto('/');
			return;
		}

		fetchPendingCount();
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

	async function fetchPendingCount() {
		try {
			const response = await fetch('/api/penarikan?status=menunggu');
			const data = await response.json();
			if (data.success) {
				pendingCount = data.data.length;
			}
		} catch (e) {
			console.error('Failed to fetch pending count:', e);
		}
	}

	async function handleLogout() {
		if (confirm('Yakin ingin keluar?')) {
			await logout();
			goto('/login');
		}
	}

	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}

	$effect(() => {
		const unsubscribe = page.subscribe(() => {
			if ($authStore.isAuthenticated && $authStore.user?.role === 'keuangan') {
				fetchPendingCount();
			}
		});
		return unsubscribe;
	});
</script>

<svelte:head>
	<title>Dashboard Keuangan - Sistem Informasi Infaq & Jariyah</title>
</svelte:head>

<div class="min-h-screen {currentTheme === 'dark' ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} transition-colors duration-300">
	<!-- Header -->
	<header class="{currentTheme === 'dark' ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'} border-b shadow-lg transition-colors duration-300">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo and Title -->
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#059669] shadow-lg shadow-emerald-500/20">
						<Wallet size={20} color="#fff" />
					</div>
					<div>
						<h1 class="text-lg font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
							Bagian Keuangan
						</h1>
						<p class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}">
							Permintaan Penarikan Dana
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
							<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white font-semibold text-sm">
								{($authStore.user?.email || 'K')[0].toUpperCase()}
							</div>
							<span class="text-sm font-medium">{$authStore.user?.email || 'Keuangan'}</span>
							<ChevronDown size={16} class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}" />
						</button>

						{#if showUserMenu}
							<div class="absolute right-0 mt-2 w-64 rounded-xl {currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} shadow-xl z-50">
								<div class="p-4 {currentTheme === 'dark' ? 'border-b border-[#334155]' : 'border-b border-slate-200'}">
									<p class="text-sm font-medium {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{$authStore.user?.email}</p>
									<p class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'} mt-1">Role: Keuangan</p>
									{#if $authStore.user?.nama_lengkap}
										<p class="text-xs {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-600'} mt-1">{$authStore.user.nama_lengkap}</p>
									{/if}
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
				<a
					href="/keuangan/dashboard"
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors {isActive('/keuangan/dashboard') ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white' : (currentTheme === 'dark' ? 'text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700')}"
				>
					<LayoutDashboard size={18} />
					Dashboard
				</a>
				<a
					href="/keuangan/penarikan"
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors relative {isActive('/keuangan/penarikan') ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white' : (currentTheme === 'dark' ? 'text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700')}"
				>
					<ArrowLeftRight size={18} />
					Permintaan Penarikan
					{#if pendingCount > 0}
						<span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
							{pendingCount}
						</span>
					{/if}
				</a>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
