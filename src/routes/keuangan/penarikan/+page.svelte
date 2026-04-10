<script lang="ts">
	import { onMount } from 'svelte';
	import { penarikanApi, type PenarikanData } from '$lib/api';
	import { ArrowUpRight, Clock, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';

	let penarikans = $state<PenarikanData[]>([]);
	let loading = $state(true);
	let submitting = $state(false);
	let error = $state('');
	let success = $state('');

	let jumlah = $state('');
	let keterangan = $state('');
	let filterStatus = $state('');

	onMount(async () => {
		await loadPenarikan();
	});

	async function loadPenarikan() {
		try {
			loading = true;
			error = '';
			const params: { status?: string } = {};
			if (filterStatus) params.status = filterStatus;
			penarikans = await penarikanApi.getAll(params);
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!jumlah || parseFloat(jumlah) <= 0) {
			error = 'Jumlah harus lebih dari 0';
			return;
		}

		try {
			submitting = true;
			error = '';
			success = '';
			await penarikanApi.create({
				jumlah: parseFloat(jumlah),
				keterangan: keterangan || undefined
			});
			success = 'Permintaan penarikan berhasil diajukan';
			jumlah = '';
			keterangan = '';
			await loadPenarikan();
		} catch (e) {
			error = (e as Error).message;
		} finally {
			submitting = false;
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
</script>

<div>
	<div class="mb-8">
		<h2 class="text-2xl font-bold text-[#f1f5f9] mb-2">Permintaan Penarikan Dana</h2>
		<p class="text-[#64748b]">Ajukan permintaan penarikan dana kepada admin</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Form Ajukan Penarikan -->
		<div class="lg:col-span-1">
			<div class="bg-[#1e293b] rounded-2xl p-6 border border-[#334155] sticky top-8">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
						<Plus size={20} class="text-emerald-500" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-[#f1f5f9]">Ajukan Penarikan</h3>
						<p class="text-xs text-[#64748b]">Isi form di bawah ini</p>
					</div>
				</div>

				{#if error}
					<div class="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
						<p class="text-red-400 text-sm">{error}</p>
					</div>
				{/if}

				{#if success}
					<div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
						<p class="text-emerald-400 text-sm">{success}</p>
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-4">
					<div>
						<label for="jumlah" class="block text-sm font-medium text-[#94a3b8] mb-2">
							Jumlah Penarikan (Rp)
						</label>
						<input
							type="number"
							id="jumlah"
							bind:value={jumlah}
							placeholder="Contoh: 500000"
							min="1"
							step="1"
							required
							class="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
						/>
					</div>

					<div>
						<label for="keterangan" class="block text-sm font-medium text-[#94a3b8] mb-2">
							Keterangan (Opsional)
						</label>
						<textarea
							id="keterangan"
							bind:value={keterangan}
							placeholder="Contoh: Untuk kebutuhan operasional sekolah..."
							rows="3"
							class="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={submitting}
						class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed"
					>
						{#if submitting}
							<Spinner size="sm" color="white" />
							<span>Mengirim...</span>
						{:else}
							<ArrowUpRight size={18} />
							<span>Ajukan Penarikan</span>
						{/if}
					</button>
				</form>
			</div>
		</div>

		<!-- Riwayat Penarikan -->
		<div class="lg:col-span-2">
			<div class="bg-[#1e293b] rounded-2xl p-6 border border-[#334155]">
				<div class="flex items-center justify-between mb-6">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
							<RefreshCw size={20} class="text-emerald-500" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-[#f1f5f9]">Riwayat Permintaan</h3>
							<p class="text-xs text-[#64748b]">{penarikans.length} permintaan</p>
						</div>
					</div>

					<select
						bind:value={filterStatus}
						onchange={handleFilterChange}
						class="px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-[#f1f5f9] text-sm focus:outline-none focus:border-emerald-500"
					>
						<option value="">Semua Status</option>
						<option value="menunggu">Menunggu</option>
						<option value="disetujui">Disetujui</option>
						<option value="ditolak">Ditolak</option>
					</select>
				</div>

				{#if loading}
					<div class="space-y-4">
						{#each [1, 2, 3] as _}
							<div class="bg-[#0f172a] rounded-xl p-4">
								<Skeleton width="w-1/3" height="h-4" className="bg-[#334155] mb-2" />
								<Skeleton width="w-1/2" height="h-3" className="bg-[#334155]" />
							</div>
						{/each}
					</div>
				{:else if penarikans.length === 0}
					<div class="text-center py-12">
						<div class="w-16 h-16 rounded-full bg-[#334155] flex items-center justify-center mx-auto mb-4">
							<Clock size={24} class="text-[#64748b]" />
						</div>
						<p class="text-[#64748b]">Belum ada permintaan penarikan</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each penarikans as penarikan}
							{@const badge = getStatusBadge(penarikan.status)}
							<div class="bg-[#0f172a] rounded-xl p-4 border border-[#334155] hover:border-[#475569] transition-colors">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<div class="flex items-center gap-2 mb-2">
											<span class="text-lg font-bold text-[#f1f5f9]">
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
											<span>Dibuat: {formatDate(penarikan.created_at)}</span>
											{#if penarikan.tanggal_diproses}
												<span>Diproses: {formatDate(penarikan.tanggal_diproses)}</span>
											{/if}
										</div>
										{#if penarikan.nama_pengolah}
											<p class="text-xs text-[#64748b] mt-1">
												Oleh: {penarikan.nama_pengolah}
											</p>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
