<script lang="ts">
	import { Shield, Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-svelte';
	import { authStore, login, logout } from '$lib/auth-store';
	import { goto } from '$app/navigation';
	import { theme } from '$lib/stores';
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let showPassword = $state(false);
	let currentTheme = $state<'dark' | 'light'>('dark');

	// Load theme from localStorage on mount
	onMount(() => {
		const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
		if (savedTheme) {
			currentTheme = savedTheme;
			theme.set(savedTheme);
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

	// Redirect if already logged in as superadmin
	if ($authStore.isAuthenticated && $authStore.user?.role === 'superadmin') {
		goto('/superadmin/dashboard');
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (!username || !password) {
			error = 'Username dan password harus diisi';
			return;
		}

		isLoading = true;
		error = null;

		try {
			const result = await login(username, password);

			// Check if user is superadmin
			if (result.data.role !== 'superadmin') {
				// Clear session
				await logout();
				throw new Error('Akses ditolak. Akun ini bukan superadmin.');
			}

			// Redirect to superadmin dashboard
			goto('/superadmin/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Superadmin Login - Sistem Informasi Infaq & Jariyah</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center {currentTheme === 'dark' ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
	<!-- Theme Toggle Button -->
	<button
		type="button"
		onclick={toggleTheme}
		class="fixed top-4 right-4 p-3 rounded-xl {currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155] text-[#94a3b8] hover:bg-[#334155]' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'} transition-all duration-300 shadow-lg"
		aria-label="Toggle theme"
	>
		{#if currentTheme === 'dark'}
			<Sun size={20} />
		{:else}
			<Moon size={20} />
		{/if}
	</button>

	<div class="w-full max-w-md">
		<!-- Logo and Title -->
		<div class="text-center mb-8">
			<div class="flex justify-center items-center gap-3 mb-4">
				<div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-blue-500/20">
					<Shield size={32} color="#fff" />
				</div>
			</div>
			<h1 class="text-3xl font-extrabold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
				Superadmin Login
			</h1>
			<p class="mt-2 text-sm {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'}">
				Masuk untuk mengelola sekolah dan admin
			</p>
		</div>

		<!-- Login Form -->
		<div class="rounded-2xl p-8 {currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} shadow-xl transition-colors duration-300">
			{#if error}
				<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
					<span>⚠️</span>
					{error}
				</div>
			{/if}

			<form onsubmit={handleLogin} class="space-y-6">
				<div>
					<label for="username" class="block text-xs font-medium mb-2 {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'} uppercase tracking-wider">
						Username
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Mail size={18} class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}" />
						</div>
						<input
							id="username"
							type="text"
							bind:value={username}
							placeholder="superadmin"
							required
							class="w-full pl-11 pr-4 py-3 rounded-xl text-sm {currentTheme === 'dark' ? 'bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569]' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
							autocomplete="username"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-xs font-medium mb-2 {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'} uppercase tracking-wider">
						Password
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Lock size={18} class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}" />
						</div>
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							required
							class="w-full pl-11 pr-12 py-3 rounded-xl text-sm {currentTheme === 'dark' ? 'bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569]' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
							autocomplete="current-password"
						/>
						<button
							type="button"
							onclick={() => showPassword = !showPassword}
							class="absolute inset-y-0 right-0 pr-4 flex items-center {currentTheme === 'dark' ? 'text-[#64748b] hover:text-[#94a3b8]' : 'text-slate-500 hover:text-slate-600'} transition-colors"
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] {currentTheme === 'dark' ? 'focus:ring-offset-[#1e293b]' : 'focus:ring-offset-white'} transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isLoading}
						<Spinner size="sm" color="blue" />
						<span>Memproses...</span>
					{:else}
						<span>Masuk sebagai Superadmin</span>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					{/if}
				</button>
			</form>

			<div class="mt-6 pt-6 {currentTheme === 'dark' ? 'border-t border-[#334155]' : 'border-t border-slate-200'} space-y-4">
				<div class="p-4 rounded-xl {currentTheme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'} text-center">
					<p class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'} mb-2 font-medium uppercase tracking-wider">Akses Sekolah</p>
					<a href="/login" class="inline-flex items-center gap-2 text-sm font-semibold text-[#10b981] hover:text-[#34d399] transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
						Kembali ke Login Sekolah
					</a>
				</div>
				<p class="text-center text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'}">
					Default superadmin: <strong class="{currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-700'}">superadmin</strong> / <strong class="{currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-700'}">superadmin</strong>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
