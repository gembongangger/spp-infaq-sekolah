<script lang="ts">
	import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-svelte';
	import { authStore, login, logout } from '$lib/auth-store';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let showPassword = $state(false);

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

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
	<div class="w-full max-w-md">
		<!-- Logo and Title -->
		<div class="text-center mb-8">
			<div class="flex justify-center items-center gap-3 mb-4">
				<div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-blue-500/20">
					<Shield size={32} color="#fff" />
				</div>
			</div>
			<h1 class="text-3xl font-extrabold text-[#f1f5f9]">
				Superadmin Login
			</h1>
			<p class="mt-2 text-sm text-[#94a3b8]">
				Masuk untuk mengelola sekolah dan admin
			</p>
		</div>

		<!-- Login Form -->
		<div class="rounded-2xl p-8 bg-[#1e293b] border border-[#334155] shadow-xl">
			{#if error}
				<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
					<span>⚠️</span>
					{error}
				</div>
			{/if}

			<form onsubmit={handleLogin} class="space-y-6">
				<div>
					<label for="username" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">
						Username
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Mail size={18} class="text-[#64748b]" />
						</div>
						<input
							id="username"
							type="text"
							bind:value={username}
							placeholder="superadmin"
							required
							class="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
							autocomplete="username"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">
						Password
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Lock size={18} class="text-[#64748b]" />
						</div>
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							required
							class="w-full pl-11 pr-12 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
							autocomplete="current-password"
						/>
						<button
							type="button"
							onclick={() => showPassword = !showPassword}
							class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#64748b] hover:text-[#94a3b8] transition-colors"
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
					class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] focus:ring-offset-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isLoading}
						<span class="animate-spin">⏳</span>
						<span>Memproses...</span>
					{:else}
						<span>Masuk sebagai Superadmin</span>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					{/if}
				</button>
			</form>

			<div class="mt-6 pt-6 border-t border-[#334155] space-y-4">
				<div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
					<p class="text-xs text-[#64748b] mb-2 font-medium uppercase tracking-wider">Akses Sekolah</p>
					<a href="/login" class="inline-flex items-center gap-2 text-sm font-semibold text-[#10b981] hover:text-[#34d399] transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
						Kembali ke Login Sekolah
					</a>
				</div>
				<p class="text-center text-xs text-[#64748b]">
					Default superadmin: <strong class="text-[#94a3b8]">superadmin</strong> / <strong class="text-[#94a3b8]">superadmin</strong>
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
