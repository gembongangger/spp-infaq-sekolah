<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/auth-store';
	import { Clock, CheckCircle, XCircle, RefreshCw, AlertCircle, ArrowRightLeft } from 'lucide-svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	interface PenarikanData {
		id: string;
		sekolah_id: string;
		sekolah_nama: string | null;
		jumlah: number;
		keterangan: string | null;
		status: string;
		dibuat_oleh: string;
		nama_pembuat: string | null;
		diproses_oleh: string | null;
		nama_pengolah: string | null;
		tanggal_diproses: string | null;
		created_at: string;
		updated_at: string;
	}

	let penarikans = $state<PenarikanData[]>([]);
	let loading = $state(true);
	let processing = $state<string | null>(null);
	let error = $state('');
	let success = $state('');
	let filterStatus = $state('');

	onMount(async () => {
		await loadPenarikan();
	});

	async function loadPenarikan() {
		try {
			loading = true;
			error = '';
			const params = new URLSearchParams();
			if (filterStatus) params.set('status', filterStatus);

			const queryString = params.toString();
			const endpoint = queryString ? `/api/penarikan?${queryString}` : '/api/penarikan';

			const response = await fetch(endpoint, {
				credentials: 'include',
			});
			const data = await response.json();

			if (!data.success) {
				throw new Error(data.message || 'Gagal memuat data');
			}

			penarikans = data.data;
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	}

	async function handleApprove(id: string) {
		if (!confirm('Yakin ingin menyetujui permintaan penarikan ini?')) return;

		try {
			processing = id;
			error = '';
			success = '';

			const response = await fetch(`/api/penarikan/${id}/setuju`, {
				method: 'POST',
				credentials: 'include',
			});
			const data = await response.json();

			if (!data.success) {
				throw new Error(data.message || 'Gagal menyetujui');
			}

			success = 'Permintaan penarikan berhasil disetujui';
			await loadPenarikan();
		} catch (e) {
			error = (e as Error).message;
		} finally {
			processing = null;
		}
	}

	async function handleReject(id: string) {
		if (!confirm('Yakin ingin menolak permintaan penarikan ini?')) return;

		try {
			processing = id;
			error = '';
			success = '';

			const response = await fetch(`/api/penarikan/${id}/tolak`, {
				method: 'POST',
				credentials: 'include',
			});
			const data = await response.json();

			if (!data.success) {
				throw new Error(data.message || 'Gagal menolak');
			}

			success = 'Permintaan penarikan berhasil ditolak';
			await loadPenarikan();
		} catch (e) {
			error = (e as Error).message;
		} finally {
			processing = null;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'menunggu':
				return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
			case 'disetujui':
				return { icon: CheckCircle, class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
			case 'ditolak':
				return { icon: XCircle, class: 'bg-red-500/10 text-red-500 border-red-500/20' };
			default:
				return { icon: Clock, class: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
		}
	}

	function getStatusLabel(status: string): string {
		switch (status) {
			case 'menunggu': return 'Menunggu';
			case 'disetujui': return 'Disetujui';
			case 'ditolak': return 'Ditolak';
			default: return status;
		}
	}

	async function handleFilterChange() {
		await loadPenarikan();
	}

	let filteredCount = $derived(penarikans.filter(p => p.status === 'menunggu').length);
</script>

<div>
	{#if error}
		<div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
			<div class="flex items-center gap-2">
				<AlertCircle size={18} class="text-red-500" />
				<p class="text-red-400">{error}</p>
			</div>
		</div>
	{/if}

	{#if success}
		<div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
			<div class="flex items-center gap-2">
				<CheckCircle size={18} class="text-emerald-500" />
				<p class="text-emerald-400">{success}</p>
			</div>
		</div>
	{/if}

	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
				<ArrowRightLeft size={24} class="text-emerald-500" />
			</div>
			<div>
				<h3 class="text-xl font-semibold text-[#f1f5f9]">Permintaan Penarikan Dana</h3>
				<p class="text-sm text-[#64748b]">Kelola permintaan penarikan dari bagian keuangan</p>
			</div>
		</div>

		{#if filteredCount > 0}
			<div class="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
				<span class="text-yellow-500 font-medium">{filteredCount} menunggu persetujuan</span>
			</div>
		{/if}
	</div>

	<!-- Filter -->
	<div class="bg-[#1e293b] rounded-xl p-4 border border-[#334155] mb-6">
		<div class="flex items-center gap-4">
			<div class="flex-1">
				<label for="filter-status" class="block text-sm font-medium text-[#94a3b8] mb-2">
					Status
				</label>
				<select
					id="filter-status"
					bind:value={filterStatus}
					onchange={handleFilterChange}
					class="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-[#f1f5f9] text-sm focus:outline-none focus:border-emerald-500"
				>
					<option value="">Semua Status</option>
					<option value="menunggu">Menunggu</option>
					<option value="disetujui">Disetujui</option>
					<option value="ditolak">Ditolak</option>
				</select>
			</div>

			<div class="flex items-end">
				<button
					onclick={loadPenarikan}
					class="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-[#f1f5f9] rounded-xl transition-colors flex items-center gap-2"
				>
					<RefreshCw size={16} />
					Refresh
				</button>
			</div>
		</div>
	</div>

	<!-- List -->
	<div class="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
		{#if loading}
			<div class="p-8 text-center">
				<Spinner size="lg" color="slate" />
				<p class="text-[#64748b] mt-3">Memuat data...</p>
			</div>
		{:else if penarikans.length === 0}
			<div class="p-8 text-center">
				<div class="w-16 h-16 rounded-full bg-[#334155] flex items-center justify-center mx-auto mb-4">
					<Clock size={24} class="text-[#64748b]" />
				</div>
				<p class="text-[#64748b]">Belum ada permintaan penarikan dari bagian keuangan</p>
			</div>
		{:else}
			<div class="divide-y divide-[#334155]">
				{#each penarikans as penarikan}
					{@const badge = getStatusBadge(penarikan.status)}
					<div class="p-4 hover:bg-[#0f172a]/50 transition-colors">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<span class="text-lg font-bold text-emerald-500">
										{formatCurrency(penarikan.jumlah)}
									</span>
									<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border {badge.class}">
										<svelte:component this={badge.icon} size={12} />
										{getStatusLabel(penarikan.status)}
									</span>
								</div>
								{#if penarikan.keterangan}
									<p class="text-sm text-[#94a3b8] mb-2">{penarikan.keterangan}</p>
								{/if}
								<div class="flex items-center gap-4 text-xs text-[#64748b]">
									<span>Diajukan: {formatDate(penarikan.created_at)}</span>
									{#if penarikan.nama_pembuat}
										<span>Oleh: {penarikan.nama_pembuat}</span>
									{/if}
								</div>
								{#if penarikan.tanggal_diproses && penarikan.nama_pengolah}
									<p class="text-xs text-[#64748b] mt-1">
										Diproses oleh {penarikan.nama_pengolah} pada {formatDate(penarikan.tanggal_diproses)}
									</p>
								{/if}
							</div>
							<div class="flex items-center gap-2 ml-4">
								{#if penarikan.status === 'menunggu'}
									<button
										onclick={() => handleApprove(penarikan.id)}
										disabled={processing === penarikan.id}
										class="flex items-center gap-1 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
									>
										{#if processing === penarikan.id}
											<Spinner size="sm" color="emerald" />
										{:else}
											<CheckCircle size={14} />
										{/if}
										Setuju
									</button>
									<button
										onclick={() => handleReject(penarikan.id)}
										disabled={processing === penarikan.id}
										class="flex items-center gap-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
									>
										{#if processing === penarikan.id}
											<Spinner size="sm" color="red" />
										{:else}
											<XCircle size={14} />
										{/if}
										Tolak
									</button>
								{:else}
									<span class="text-[#64748b] text-sm">-</span>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
