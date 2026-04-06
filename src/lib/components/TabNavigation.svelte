<script lang="ts">
	import { activeTab, theme } from '$lib/stores';
	import { LayoutGrid, UserCheck, PlusCircle, List, Users, BarChart3, ArrowRightLeft } from 'lucide-svelte';

	const tabs = [
		{ id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
		{ id: 'students', label: 'Identitas Siswa', icon: UserCheck },
		{ id: 'input', label: 'Input', icon: PlusCircle },
		{ id: 'transactions', label: 'Transaksi', icon: List },
		{ id: 'senders', label: 'Pengirim', icon: Users },
		{ id: 'reports', label: 'Laporan', icon: BarChart3 },
		{ id: 'penarikan', label: 'Penarikan', icon: ArrowRightLeft }
	];

	let currentTab = $derived($activeTab);
	let currentTheme = $derived($theme);
</script>

<div class="flex gap-2 mb-6 overflow-x-auto pb-2 border-b-2 {currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200'}">
	{#each tabs as tab}
		<button
			class="nav-tab flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap {currentTab === tab.id ? 'active' : (currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500')}"
			onclick={() => activeTab.set(tab.id)}
		>
			<tab.icon size={16} />
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.nav-tab {
		border-bottom: 3px solid transparent;
		transition: all 0.3s ease;
	}
	.nav-tab.active {
		color: #10b981 !important;
		border-bottom-color: #10b981;
		background: rgba(16, 185, 129, 0.05);
	}
</style>
