<script lang="ts">
	import { HeartHandshake, Mail, Lock, Eye, EyeOff } from 'lucide-svelte';
	import { authStore, login } from '$lib/auth-store';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let showPassword = $state(false);

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

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
	<div class="w-full max-w-md">
		<!-- Logo and Title -->
		<div class="text-center mb-8">
			<div class="flex justify-center items-center gap-3 mb-4">
				<div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#a855f7] shadow-lg shadow-emerald-500/20">
					<HeartHandshake size={28} color="#fff" />
				</div>
			</div>
			<h1 class="text-3xl font-extrabold text-[#f1f5f9]">
				Sistem Informasi Infaq & Jariyah
			</h1>
			<p class="mt-2 text-sm text-[#94a3b8]">
				Silakan login untuk melanjutkan
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
					<label for="email" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">
						Email
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Mail size={18} class="text-[#64748b]" />
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="nama@email.com"
							required
							class="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
							autocomplete="email"
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
							class="w-full pl-11 pr-12 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
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

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							type="checkbox"
							class="h-4 w-4 rounded border-[#334155] bg-[#0f172a] text-[#10b981] focus:ring-[#10b981] focus:ring-offset-0"
						/>
						<label for="remember-me" class="ml-2 block text-xs text-[#64748b]">
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
					class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] focus:ring-offset-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

			<div class="mt-6 pt-6 border-t border-[#334155] space-y-4">
				<div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
					<p class="text-xs text-[#64748b] mb-2 font-medium uppercase tracking-wider">Akses Khusus</p>
					<a href="/superadmin/login" class="inline-flex items-center gap-2 text-sm font-semibold text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
						Login sebagai Superadmin
					</a>
				</div>
				<p class="text-center text-xs text-[#64748b]">
					Default login: <strong class="text-[#94a3b8]">admininfaqmajesa@gmail.com</strong> / <strong class="text-[#94a3b8]">admin123</strong>
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
