<script lang="ts">
	import { HeartHandshake, Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-svelte';
	import { authStore, login } from '$lib/auth-store';
	import { goto } from '$app/navigation';
	import { theme } from '$lib/stores';
	import { onMount } from 'svelte';

	let email = $state('');
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

	// Redirect if already logged in
	if ($authStore.isAuthenticated) {
		if ($authStore.user?.role === 'superadmin') {
			goto('/superadmin/dashboard');
		} else if ($authStore.user?.role === 'keuangan') {
			goto('/keuangan/dashboard');
		} else {
			goto('/');
		}
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (!email || !password) {
			error = 'Email dan password harus diisi';
			return;
		}

		isLoading = true;
		error = null;

		try {
			const result = await login(email, password);

			// Role-based redirect
			const userRole = result.data?.role;

			if (userRole === 'superadmin') {
				// Superadmin goes to superadmin dashboard
				goto('/superadmin/dashboard');
			} else if (userRole === 'keuangan') {
				// Keuangan goes to keuangan dashboard
				goto('/keuangan/dashboard');
			} else {
				// Regular admin goes to school dashboard
				goto('/');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Sistem Informasi Infaq & Jariyah</title>
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
				<div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#a855f7] shadow-lg shadow-emerald-500/20">
					<HeartHandshake size={28} color="#fff" />
				</div>
			</div>
			<h1 class="text-3xl font-extrabold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
				Sistem Informasi Infaq & Jariyah
			</h1>
			<p class="mt-2 text-sm {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'}">
				Silakan login untuk melanjutkan
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
					<label for="email" class="block text-xs font-medium mb-2 {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'} uppercase tracking-wider">
						Email
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Mail size={18} class="{currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'}" />
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="nama@email.com"
							required
							class="w-full pl-11 pr-4 py-3 rounded-xl text-sm {currentTheme === 'dark' ? 'bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569]' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
							autocomplete="email"
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
							class="w-full pl-11 pr-12 py-3 rounded-xl text-sm {currentTheme === 'dark' ? 'bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569]' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
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

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							type="checkbox"
							class="h-4 w-4 rounded {currentTheme === 'dark' ? 'border-[#334155] bg-[#0f172a]' : 'border-slate-300 bg-slate-50'} text-[#10b981] focus:ring-[#10b981] focus:ring-offset-0"
						/>
						<label for="remember-me" class="ml-2 block text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'}">
							Ingat saya
						</label>
					</div>
					<a
						href="/reset-password"
						class="text-xs text-[#10b981] hover:text-[#059669] transition-colors"
					>
						Lupa password?
					</a>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] {currentTheme === 'dark' ? 'focus:ring-offset-[#1e293b]' : 'focus:ring-offset-white'} transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isLoading}
						<span class="animate-spin">⏳</span>
						<span>Memproses...</span>
					{:else}
						<span>Masuk</span>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					{/if}
				</button>
			</form>

			<div class="mt-6 pt-6 {currentTheme === 'dark' ? 'border-t border-[#334155]' : 'border-t border-slate-200'} space-y-4">
				<div class="p-4 rounded-xl {currentTheme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'} text-center">
					<p class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'} mb-2 font-medium uppercase tracking-wider">Akses Khusus</p>
					<a href="/superadmin/login" class="inline-flex items-center gap-2 text-sm font-semibold text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
						Login sebagai Superadmin
					</a>
				</div>
				<p class="text-center text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600'}">
					Default login: <strong class="{currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-700'}">admininfaqmajesa@gmail.com</strong> / <strong class="{currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-700'}">admin123</strong>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
</style>
