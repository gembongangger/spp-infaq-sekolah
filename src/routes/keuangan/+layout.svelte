<script lang="ts">
	import { Wallet, LayoutDashboard, ArrowLeftRight, LogOut, ChevronDown, Bell } from 'lucide-svelte';
	import { authStore, logout } from '$lib/auth-store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let showUserMenu = $state(false);
	let pendingCount = $state(0);

	onMount(async () => {
		if (!$authStore.isAuthenticated) {
			goto('/login');
			return;
		}

		if ($authStore.user?.role !== 'keuangan') {
			goto('/');
			return;
		}

		await fetchPendingCount();
	});

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

<div class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
	<!-- Header -->
	<header class="bg-[#1e293b] border-b border-[#334155] shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo and Title -->
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#059669] shadow-lg shadow-emerald-500/20">
						<Wallet size={20} color="#fff" />
					</div>
					<div>
						<h1 class="text-lg font-bold text-[#f1f5f9]">
							Bagian Keuangan
						</h1>
						<p class="text-xs text-[#64748b]">
							Permintaan Penarikan Dana
						</p>
					</div>
				</div>

				<!-- User Menu -->
				<div class="relative">
					<button
						onclick={() => showUserMenu = !showUserMenu}
						class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] hover:bg-[#334155] transition-colors"
					>
						<div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white font-semibold text-sm">
							{($authStore.user?.email || 'K')[0].toUpperCase()}
						</div>
						<span class="text-sm font-medium">{$authStore.user?.email || 'Keuangan'}</span>
						<ChevronDown size={16} class="text-[#64748b]" />
					</button>

					{#if showUserMenu}
						<div class="absolute right-0 mt-2 w-64 rounded-xl bg-[#1e293b] border border-[#334155] shadow-xl z-50">
							<div class="p-4 border-b border-[#334155]">
								<p class="text-sm font-medium text-[#f1f5f9]">{$authStore.user?.email}</p>
								<p class="text-xs text-[#64748b] mt-1">Role: Keuangan</p>
								{#if $authStore.user?.nama_lengkap}
									<p class="text-xs text-[#94a3b8] mt-1">{$authStore.user.nama_lengkap}</p>
								{/if}
							</div>
							<div class="p-2">
								<button
									onclick={handleLogout}
									class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
	</header>

	<!-- Navigation Tabs -->
	<div class="bg-[#1e293b] border-b border-[#334155]">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex gap-2 py-3">
				<a
					href="/keuangan/dashboard"
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors {isActive('/keuangan/dashboard') ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white' : 'text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]'}"
				>
					<LayoutDashboard size={18} />
					Dashboard
				</a>
				<a
					href="/keuangan/penarikan"
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors relative {isActive('/keuangan/penarikan') ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white' : 'text-[#64748b] hover:bg-[#334155] hover:text-[#94a3b8]'}"
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
