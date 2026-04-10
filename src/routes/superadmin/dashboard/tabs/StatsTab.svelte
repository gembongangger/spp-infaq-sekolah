<script lang="ts">
	import { School, Users, FileText, DollarSign, TrendingUp } from 'lucide-svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	interface Sekolah {
		id: string;
		nama: string;
		kode: string;
		isActive: boolean;
		stats?: {
			totalUsers: number;
			totalSiswa: number;
			totalTransaksi: number;
			totalKategori: number;
		};
	}

	let schools: Sekolah[] = $state([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	async function loadData() {
		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/superadmin/sekolah', {
				credentials: 'include',
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal memuat data');
			}

			schools = result.data || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	// Calculate totals
	let totalUsers = $derived(schools.reduce((sum, s) => sum + (s.stats?.totalUsers || 0), 0));
	let totalSiswa = $derived(schools.reduce((sum, s) => sum + (s.stats?.totalSiswa || 0), 0));
	let totalTransaksi = $derived(schools.reduce((sum, s) => sum + (s.stats?.totalTransaksi || 0), 0));
	let totalKategori = $derived(schools.reduce((sum, s) => sum + (s.stats?.totalKategori || 0), 0));

	import { onMount } from 'svelte';
	onMount(loadData);
</script>

<div>
	<!-- Header -->
	<div class="mb-6">
		<h2 class="text-2xl font-bold text-[#f1f5f9]">Statistik Sistem</h2>
		<p class="text-sm text-[#64748b] mt-1">Ringkasan data seluruh sekolah</p>
	</div>

	{#if error}
		<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
			{error}
		</div>
	{/if}

	{#if isLoading}
		<div class="text-center py-12">
			<Spinner size="lg" color="blue" />
			<p class="mt-4 text-[#64748b]">Memuat statistik...</p>
		</div>
	{:else}
		<!-- Summary Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<div class="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
				<div class="flex items-center justify-between mb-4">
					<School size={24} class="text-blue-400" />
					<TrendingUp size={20} class="text-blue-400" />
				</div>
				<p class="text-3xl font-bold text-blue-400">{schools.length}</p>
				<p class="text-sm text-[#94a3b8] mt-1">Total Sekolah</p>
			</div>

			<div class="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
				<div class="flex items-center justify-between mb-4">
					<Users size={24} class="text-green-400" />
					<TrendingUp size={20} class="text-green-400" />
				</div>
				<p class="text-3xl font-bold text-green-400">{totalUsers}</p>
				<p class="text-sm text-[#94a3b8] mt-1">Total Admin</p>
			</div>

			<div class="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
				<div class="flex items-center justify-between mb-4">
					<School size={24} class="text-purple-400" />
					<TrendingUp size={20} class="text-purple-400" />
				</div>
				<p class="text-3xl font-bold text-purple-400">{totalSiswa}</p>
				<p class="text-sm text-[#94a3b8] mt-1">Total Siswa</p>
			</div>

			<div class="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6">
				<div class="flex items-center justify-between mb-4">
					<FileText size={24} class="text-amber-400" />
					<TrendingUp size={20} class="text-amber-400" />
				</div>
				<p class="text-3xl font-bold text-amber-400">{totalTransaksi}</p>
				<p class="text-sm text-[#94a3b8] mt-1">Total Transaksi</p>
			</div>
		</div>

		<!-- School Details -->
		<div class="bg-[#1e293b] rounded-2xl border border-[#334155] p-6">
			<h3 class="text-lg font-bold text-[#f1f5f9] mb-4">Detail Per Sekolah</h3>

			{#if schools.length === 0}
				<p class="text-center text-[#64748b] py-8">Belum ada sekolah terdaftar</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-[#334155]">
								<th class="text-left py-3 px-4 text-xs font-medium text-[#64748b] uppercase tracking-wider">Sekolah</th>
								<th class="text-center py-3 px-4 text-xs font-medium text-[#64748b] uppercase tracking-wider">Status</th>
								<th class="text-center py-3 px-4 text-xs font-medium text-[#64748b] uppercase tracking-wider">Admin</th>
								<th class="text-center py-3 px-4 text-xs font-medium text-[#64748b] uppercase tracking-wider">Siswa</th>
								<th class="text-center py-3 px-4 text-xs font-medium text-[#64748b] uppercase tracking-wider">Transaksi</th>
								<th class="text-center py-3 px-4 text-xs font-medium text-[#64748b] uppercase tracking-wider">Kategori</th>
							</tr>
						</thead>
						<tbody>
							{#each schools as school}
								<tr class="border-b border-[#334155] hover:bg-[#334155]/50 transition-colors">
									<td class="py-3 px-4">
										<p class="font-medium text-[#f1f5f9]">{school.nama}</p>
										<p class="text-xs text-[#64748b] font-mono">{school.kode}</p>
									</td>
									<td class="py-3 px-4 text-center">
										<span class="px-2 py-1 rounded-lg text-xs font-medium {school.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
											{school.isActive ? 'Aktif' : 'Nonaktif'}
										</span>
									</td>
									<td class="py-3 px-4 text-center">
										<span class="text-lg font-bold text-green-400">{school.stats?.totalUsers || 0}</span>
									</td>
									<td class="py-3 px-4 text-center">
										<span class="text-lg font-bold text-purple-400">{school.stats?.totalSiswa || 0}</span>
									</td>
									<td class="py-3 px-4 text-center">
										<span class="text-lg font-bold text-amber-400">{school.stats?.totalTransaksi || 0}</span>
									</td>
									<td class="py-3 px-4 text-center">
										<span class="text-lg font-bold text-blue-400">{school.stats?.totalKategori || 0}</span>
									</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="border-t-2 border-[#334155] bg-[#0f172a]/50">
								<td class="py-3 px-4 font-bold text-[#f1f5f9]">Total</td>
								<td class="py-3 px-4"></td>
								<td class="py-3 px-4 text-center">
									<span class="text-lg font-bold text-green-400">{totalUsers}</span>
								</td>
								<td class="py-3 px-4 text-center">
									<span class="text-lg font-bold text-purple-400">{totalSiswa}</span>
								</td>
								<td class="py-3 px-4 text-center">
									<span class="text-lg font-bold text-amber-400">{totalTransaksi}</span>
								</td>
								<td class="py-3 px-4 text-center">
									<span class="text-lg font-bold text-blue-400">{totalKategori}</span>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			{/if}
		</div>
	{/if}
</div>
