<script lang="ts">
	import { HeartHandshake, Sun, Moon, Wifi, WifiOff, LogOut, User, Settings } from 'lucide-svelte';
	import { theme } from '$lib/stores';
	import { authStore } from '$lib/auth-store';

	interface Props {
		apiConnected: boolean;
		onShowLogoutModal: () => void;
		onShowProfileModal: () => void;
		currentTheme: 'dark' | 'light';
	}

	let {
		apiConnected,
		onShowLogoutModal,
		onShowProfileModal,
		currentTheme
	}: Props = $props();

	const headerBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200');
	const textMuted = $derived(currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500');
	const textSecondary = $derived(currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700');

	function toggleTheme() {
		theme.update((v) => (v === 'dark' ? 'light' : 'dark'));
	}
</script>

<header class="border-b {headerBorder} pb-6 pt-7 mb-7">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
		<div class="flex items-center gap-3">
			<div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-lg">
				<HeartHandshake size={22} class="text-white" />
			</div>
			<div>
				<h1 class="text-xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
					Sistem Informasi Infaq & Jariyah
				</h1>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<!-- API Connection Status -->
			<div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg {currentTheme === 'dark' ? 'bg-[#334155]' : 'bg-slate-200'}">
				{#if apiConnected}
					<Wifi size={16} color="#10b981" />
					<span class="text-xs text-[#10b981]">MySQL Connected</span>
				{:else}
					<WifiOff size={16} color="#ef4444" />
					<span class="text-xs text-[#ef4444]">Disconnected</span>
				{/if}
			</div>

			<!-- User Info -->
			{#if $authStore.isAuthenticated && $authStore.user}
				<button
					onclick={onShowProfileModal}
					class="flex items-center gap-2 px-3 py-1.5 rounded-lg {currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155] hover:bg-[#334155]' : 'bg-slate-100 border border-slate-200 hover:bg-slate-200'} transition-colors"
					title="Edit Profil"
				>
					{#if $authStore.user.foto_url}
						<img
							src={$authStore.user.foto_url}
							alt="Foto Profil"
							class="w-6 h-6 rounded-full object-cover"
							onerror={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent($authStore.user.nama_lengkap || $authStore.user.username || 'Admin') + '&background=10b981&color=fff&size=32';
							}}
						/>
					{:else}
						<div class="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
							<span class="text-xs font-bold text-white">
								{($authStore.user.nama_lengkap || $authStore.user.username || 'A').charAt(0).toUpperCase()}
							</span>
						</div>
					{/if}
					<span class="text-xs {currentTheme === 'dark' ? 'text-[#f1f5f9] hidden sm:inline' : 'text-slate-900 hidden sm:inline'}">
						{$authStore.user.nama_lengkap || $authStore.user.username}
					</span>
					<Settings size={14} class={currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'} />
				</button>
				<button
					onclick={onShowLogoutModal}
					class="p-2.5 rounded-xl transition-all bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20"
					title="Logout"
				>
					<LogOut size={18} />
				</button>
			{/if}

			<button
				onclick={toggleTheme}
				class="p-2.5 rounded-xl transition-all {currentTheme === 'dark' ? 'bg-[#334155] text-[#f1f5f9]' : 'bg-slate-200 text-slate-700'}"
				title="Toggle tema"
			>
				{#if currentTheme === 'dark'}
					<Sun size={20} />
				{:else}
					<Moon size={20} />
				{/if}
			</button>
		</div>
	</div>
	<p class="text-sm ml-13 {textMuted}">Kelola donasi infaq dan jariyah dengan mudah</p>
</header>
