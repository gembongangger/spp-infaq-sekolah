<script lang="ts">
	import { List, Edit2, Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-svelte';
	import { formatRupiah, formatDate } from '$lib/utils';
	import type { TransaksiData } from '$lib/types';

	interface Props {
		transactions: TransaksiData[];
		filteredTransactions: TransaksiData[];
		categories: string[];
		filterKategori: string;
		filterTanggalMulai: string;
		filterTanggalSelesai: string;
		onFilterKategoriChange: (value: string) => void;
		onFilterTanggalMulaiChange: (value: string) => void;
		onFilterTanggalSelesaiChange: (value: string) => void;
		onResetFilter: () => void;
		onEditTransaction: (transaction: TransaksiData) => void;
		onDeleteTransaction: (id: string) => void;
		currentTheme: 'dark' | 'light';
	}

	let {
		transactions,
		filteredTransactions,
		categories,
		filterKategori,
		filterTanggalMulai,
		filterTanggalSelesai,
		onFilterKategoriChange,
		onFilterTanggalMulaiChange,
		onFilterTanggalSelesaiChange,
		onResetFilter,
		onEditTransaction,
		onDeleteTransaction,
		currentTheme
	}: Props = $props();

	// Pagination state
	let currentPage = $state(1);
	const itemsPerPage = 5;

	// Reset page when filters change
	$effect(() => {
		filterKategori;
		filterTanggalMulai;
		filterTanggalSelesai;
		currentPage = 1;
	});

	const totalPages = $derived(Math.ceil(filteredTransactions.length / itemsPerPage));
	const paginatedTransactions = $derived(
		filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const cardBg = $derived(currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white');
	const cardBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200');
	const inputBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-white');
	const inputBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-300');
	const inputText = $derived(currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900');
	const labelColor = $derived(currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600');
	const textMuted = $derived(currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500');
	const textSecondary = $derived(currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700');
	const tableHeaderBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-100');
	const tableHeaderBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-200');
	const tableRowBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-100');
	const tableRowHover = $derived(currentTheme === 'dark' ? 'hover:bg-[#334155]/30' : 'hover:bg-slate-50');

	async function exportToExcel() {
		if (filteredTransactions.length === 0) {
			alert('Tidak ada data untuk di-export');
			return;
		}

		const XLSX = await import('xlsx');

		const data = filteredTransactions.map((t) => ({
			Tanggal: formatDate(t.tanggal),
			Keterangan: t.keterangan,
			Kategori: t.kategori,
			Jenis: t.jenis === 'masuk' ? 'Masuk' : 'Keluar',
			Metode: t.metode.toUpperCase(),
			Pengirim: t.namaPengirim || '-',
			Kelas: t.kelasPengirim || '-',
			Jumlah: t.jumlah
		}));

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');

		// Generate filename based on filters
		let filename = 'Laporan_Transaksi';
		if (filterKategori) filename += `_${filterKategori}`;
		if (filterTanggalMulai) filename += `_${filterTanggalMulai}`;
		if (filterTanggalSelesai) filename += `_sd_${filterTanggalSelesai}`;
		filename += '.xlsx';

		XLSX.writeFile(workbook, filename);
	}
</script>

<div class="fade-in">
	<div class="rounded-2xl p-5 {cardBg} {cardBorder}">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-sm font-semibold {textMuted}">
				<List size={16} class="inline mr-1" />
				Daftar Transaksi ({filteredTransactions.length})
			</h2>
			{#if totalPages > 1}
				<div class="flex items-center gap-2">
					<p class="text-xs {textMuted}">
						Hal {currentPage} dari {totalPages}
					</p>
					<div class="flex items-center gap-1">
						<button
							onclick={() => currentPage = Math.max(1, currentPage - 1)}
							disabled={currentPage === 1}
							class="p-1.5 rounded-lg {currentTheme === 'dark' ? 'bg-[#0f172a] text-[#94a3b8]' : 'bg-slate-100 text-slate-500'} disabled:opacity-50"
						>
							<ChevronLeft size={14} />
						</button>
						<button
							onclick={() => currentPage = Math.min(totalPages, currentPage + 1)}
							disabled={currentPage === totalPages}
							class="p-1.5 rounded-lg {currentTheme === 'dark' ? 'bg-[#0f172a] text-[#94a3b8]' : 'bg-slate-100 text-slate-500'} disabled:opacity-50"
						>
							<ChevronRight size={14} />
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Filters -->
		<div class="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Kategori</label>
				<select
					value={filterKategori}
					onchange={(e) => onFilterKategoriChange(e.currentTarget.value)}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				>
					<option value="">Semua Kategori</option>
					{#each categories as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Tanggal Mulai</label>
				<input
					type="date"
					value={filterTanggalMulai}
					oninput={(e) => onFilterTanggalMulaiChange(e.currentTarget.value)}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				/>
			</div>
			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Tanggal Selesai</label>
				<input
					type="date"
					value={filterTanggalSelesai}
					oninput={(e) => onFilterTanggalSelesaiChange(e.currentTarget.value)}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				/>
			</div>
			<div class="flex items-end">
				<button
					type="button"
					onclick={onResetFilter}
					class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#334155] to-[#475569] text-white"
				>
					Reset Filter
				</button>
			</div>
			<div class="flex items-end">
				<button
					type="button"
					onclick={exportToExcel}
					class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
				>
					<Download size={16} />
					Export Excel
				</button>
			</div>
		</div>

		<!-- Transactions Table -->
		{#if paginatedTransactions.length > 0}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="{tableHeaderBg} {tableHeaderBorder} border-b">
							<th class="text-left py-3 px-4 font-medium {textSecondary}">Tanggal</th>
							<th class="text-left py-3 px-4 font-medium {textSecondary}">Keterangan</th>
							<th class="text-left py-3 px-4 font-medium {textSecondary}">Kategori</th>
							<th class="text-center py-3 px-4 font-medium {textSecondary}">Jenis</th>
							<th class="text-center py-3 px-4 font-medium {textSecondary}">Metode</th>
							<th class="text-left py-3 px-4 font-medium {textSecondary}">Pengirim</th>
							<th class="text-right py-3 px-4 font-medium {textSecondary}">Jumlah</th>
							<th class="text-center py-3 px-4 font-medium {textSecondary}">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each paginatedTransactions as t}
							<tr class="{tableRowBorder} border-b {tableRowHover} transition-colors">
								<td class="py-3 px-4 {textMuted}">{formatDate(t.tanggal)}</td>
								<td class="py-3 px-4 {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{t.keterangan}</td>
								<td class="py-3 px-4">
									<span class="px-2 py-1 rounded-lg text-xs font-medium {currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-200 text-slate-600'}">
										{t.kategori}
									</span>
								</td>
								<td class="text-center py-3 px-4">
									{#if t.jenis === 'masuk'}
										<span class="px-2 py-1 rounded-lg text-xs font-medium bg-[#10b981]/10 text-[#10b981]">Masuk</span>
									{:else}
										<span class="px-2 py-1 rounded-lg text-xs font-medium bg-[#ef4444]/10 text-[#ef4444]">Keluar</span>
									{/if}
								</td>
								<td class="text-center py-3 px-4 {textMuted}">{t.metode}</td>
								<td class="py-3 px-4 {textMuted}">
									{#if t.namaPengirim}
										{t.namaPengirim}
									{:else}
										-
									{/if}
								</td>
								<td class="text-right py-3 px-4 font-medium {t.jenis === 'masuk' ? 'text-[#10b981]' : 'text-[#ef4444]'}">
									{t.jenis === 'masuk' ? '+' : '-'} {formatRupiah(t.jumlah)}
								</td>
								<td class="text-center py-3 px-4">
									<div class="flex items-center justify-center gap-1">
										<button
											onclick={() => onEditTransaction(t)}
											class="p-1.5 rounded-lg hover:bg-[#10b981]/10 text-[#10b981] transition-colors"
											title="Edit"
										>
											<Edit2 size={14} />
										</button>
										<button
											onclick={() => onDeleteTransaction(t.id)}
											class="p-1.5 rounded-lg hover:bg-[#ef4444]/10 text-[#ef4444] transition-colors"
											title="Hapus"
										>
											<Trash2 size={14} />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if totalPages > 1}
				<div class="mt-6 flex items-center justify-center gap-2">
					<button
						onclick={() => currentPage = Math.max(1, currentPage - 1)}
						disabled={currentPage === 1}
						class="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold {currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-100 text-slate-600'} disabled:opacity-50"
					>
						<ChevronLeft size={14} />
						Sebelumnya
					</button>
					
					<div class="flex items-center gap-1">
						{#each Array(totalPages) as _, i}
							{#if i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)}
								<button
									onclick={() => currentPage = i + 1}
									class="w-8 h-8 rounded-lg text-xs font-semibold transition-all {currentPage === i + 1 
										? 'bg-[#10b981] text-white shadow-md' 
										: (currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}"
								>
									{i + 1}
								</button>
							{:else if i + 1 === currentPage - 2 || i + 1 === currentPage + 2}
								<span class="px-1 text-xs {textMuted}">...</span>
							{/if}
						{/each}
					</div>

					<button
						onclick={() => currentPage = Math.min(totalPages, currentPage + 1)}
						disabled={currentPage === totalPages}
						class="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold {currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-100 text-slate-600'} disabled:opacity-50"
					>
						Berikutnya
						<ChevronRight size={14} />
					</button>
				</div>
			{/if}
		{:else}
			<div class="text-center py-12">
				<List size={48} class="mx-auto mb-3 {textMuted}" />
				<p class="{textMuted}">Belum ada transaksi</p>
			</div>
		{/if}
	</div>
</div>
