<script lang="ts">
	import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-svelte';
	import { resetPassword } from '$lib/auth-store';
	import { goto } from '$app/navigation';

	let email = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);
	let temporaryPassword = $state('');

	async function handleResetPassword(e: Event) {
		e.preventDefault();
		if (!email) {
			error = 'Email harus diisi';
			return;
		}

		isLoading = true;
		error = null;

		try {
			const result = await resetPassword(email);
			temporaryPassword = result.temporary_password;
			successMessage = 'Password berhasil direset!';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Reset password gagal';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password - Sistem Informasi Infaq & Jariyah</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
	<div class="w-full max-w-md">
		<!-- Back Button -->
		<button
			onclick={() => goto('/login')}
			class="mb-6 flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
		>
			<ArrowLeft size={16} />
			<span>Kembali ke Login</span>
		</button>

		<!-- Reset Password Card -->
		<div class="rounded-2xl p-8 bg-[#1e293b] border border-[#334155] shadow-xl">
			<!-- Header -->
			<div class="text-center mb-6">
				<div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10b981] to-[#059669] shadow-lg shadow-emerald-500/20 mx-auto mb-4">
					<Mail size={32} color="#fff" />
				</div>
				<h1 class="text-2xl font-bold text-[#f1f5f9]">
					Reset Password
				</h1>
				<p class="mt-2 text-sm text-[#94a3b8]">
					Masukkan email admin yang terdaftar untuk reset password
				</p>
			</div>

			{#if error}
				<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
					<AlertCircle size={20} class="flex-shrink-0 mt-0.5" />
					<div>
						{error}
					</div>
				</div>
			{/if}

			{#if successMessage}
				<div class="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
					<div class="flex items-start gap-3">
						<CheckCircle size={20} class="text-green-400 flex-shrink-0 mt-0.5" />
						<div class="flex-1">
							<p class="text-green-400 text-sm font-semibold mb-3">{successMessage}</p>
							
							{#if temporaryPassword}
								<div class="p-4 rounded-lg bg-[#0f172a] border border-[#334155]">
									<p class="text-xs text-[#64748b] mb-2">Password Sementara:</p>
									<div class="flex items-center justify-between gap-2">
										<p class="text-lg font-mono font-bold text-[#10b981] tracking-wider select-all">
											{temporaryPassword}
										</p>
										<button
											type="button"
											onclick={() => {
												navigator.clipboard.writeText(temporaryPassword);
												alert('Password disalin!');
											}}
											class="px-3 py-1.5 rounded-lg bg-[#10b981]/20 text-[#10b981] text-xs font-semibold hover:bg-[#10b981]/30 transition-colors"
										>
											Salin
										</button>
									</div>
								</div>
								<div class="mt-4 p-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30">
									<p class="text-xs text-[#f59e0b]">
										⚠️ <strong>Penting:</strong> Simpan password ini dan gunakan untuk login. Segera ubah password setelah login demi keamanan.
									</p>
								</div>
							{/if}

							<div class="mt-4">
								<button
									onclick={() => goto('/login')}
									class="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] transition-colors"
								>
									Kembali ke Login
								</button>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<form onsubmit={handleResetPassword} class="space-y-6">
					<div>
						<label for="email" class="block text-xs font-medium mb-2 text-[#64748b] uppercase tracking-wider">
							Email Admin
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Mail size={18} class="text-[#64748b]" />
							</div>
							<input
								id="email"
								type="email"
								bind:value={email}
								placeholder="admin@contoh.com"
								required
								class="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-[#0f172a] border border-[#334155] text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
								autocomplete="email"
							/>
						</div>
						<p class="mt-2 text-xs text-[#64748b]">
							💡 Email admin yang terdaftar: <strong class="text-[#94a3b8]">admininfaqmajesa@gmail.com</strong>
						</p>
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
							<span>Reset Password</span>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
						{/if}
					</button>
				</form>

				<div class="mt-6 pt-6 border-t border-[#334155]">
					<div class="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
						<h3 class="text-xs font-semibold text-[#94a3b8] mb-2">📝 Cara Reset Password:</h3>
						<ol class="text-xs text-[#64748b] space-y-1.5 list-decimal list-inside">
							<li>Masukkan email admin yang terdaftar</li>
							<li>Klik tombol "Reset Password"</li>
							<li>Salin password sementara yang ditampilkan</li>
							<li>Login dengan password sementara tersebut</li>
							<li>Segera ubah password setelah login</li>
						</ol>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
