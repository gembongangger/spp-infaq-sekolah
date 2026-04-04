<script lang="ts">
	import { Download, Eye, History, FileSpreadsheet, Search } from 'lucide-svelte';
	import { formatRupiah, formatDate } from '$lib/utils';
	import type { TransaksiData } from '$lib/types';

	interface Props {
		transactions: TransaksiData[];
		filteredTransactions: TransaksiData[];
		categories: string[];
		names: string[];
		classes: string[];
		methods: string[];
		filterKategori: string;
		filterNama: string;
		filterKelas: string;
		filterMetode: string;
		filterTanggalMulai: string;
		filterTanggalSelesai: string;
		onFilterKategoriChange: (value: string) => void;
		onFilterNamaChange: (value: string) => void;
		onFilterKelasChange: (value: string) => void;
		onFilterMetodeChange: (value: string) => void;
		onFilterTanggalMulaiChange: (value: string) => void;
		onFilterTanggalSelesaiChange: (value: string) => void;
		onPreviewReport: () => void;
		onDownloadPDF: () => void;
		onResetFilters: () => void;
		currentTheme: 'dark' | 'light';
	}

	let {
		transactions,
		filteredTransactions,
		categories,
		names,
		classes,
		methods,
		filterKategori,
		filterNama,
		filterKelas,
		filterMetode,
		filterTanggalMulai,
		filterTanggalSelesai,
		onFilterKategoriChange,
		onFilterNamaChange,
		onFilterKelasChange,
		onFilterMetodeChange,
		onFilterTanggalMulaiChange,
		onFilterTanggalSelesaiChange,
		onPreviewReport,
		onDownloadPDF,
		onResetFilters,
		currentTheme
	}: Props = $props();

	const cardBg = $derived(currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white');
	const cardBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200');
	const inputBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50');
	const inputBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-500');
	const inputText = $derived(currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900');
	const inputPlaceholder = $derived(currentTheme === 'dark' ? 'placeholder:text-[#475569]' : 'placeholder:text-slate-500');
	const labelColor = $derived(currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600');
	const textMuted = $derived(currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500');
	const textSecondary = $derived(currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700');
	const tableHeaderBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-100');
	const tableHeaderBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-200');
	const tableRowBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-100');
	const tableRowHover = $derived(currentTheme === 'dark' ? 'hover:bg-[#334155]/30' : 'hover:bg-slate-50');

	// Internal filter state
	let localFilterKategori = $state('');
	let localFilterNama = $state('');
	let localFilterKelas = $state('');
	let localFilterMetode = $state('');
	let localFilterTanggalMulai = $state('');
	let localFilterTanggalSelesai = $state('');
	let searchTriggered = $state(false);

	// Display transactions - only show when filter button is clicked
	let displayTransactions = $derived(searchTriggered ? filteredTransactions : []);

	// Calculate totals from display
	const totalInfaq = $derived(displayTransactions
		.filter(t => t.jenis === 'masuk' && t.kategori === 'infaq')
		.reduce((sum, t) => sum + t.jumlah, 0));

	const totalJariyah = $derived(displayTransactions
		.filter(t => t.jenis === 'masuk' && t.kategori === 'jariyah')
		.reduce((sum, t) => sum + t.jumlah, 0));

	const totalKeluar = $derived(displayTransactions
		.filter(t => t.jenis === 'keluar')
		.reduce((sum, t) => sum + t.jumlah, 0));

	// Apply filters with button
	function handleSearch() {
		searchTriggered = true;
		onFilterKategoriChange(localFilterKategori);
		onFilterNamaChange(localFilterNama);
		onFilterKelasChange(localFilterKelas);
		onFilterMetodeChange(localFilterMetode);
		onFilterTanggalMulaiChange(localFilterTanggalMulai);
		onFilterTanggalSelesaiChange(localFilterTanggalSelesai);
	}

	// Reset filters and clear trigger
	function handleReset() {
		localFilterKategori = '';
		localFilterNama = '';
		localFilterKelas = '';
		localFilterMetode = '';
		localFilterTanggalMulai = '';
		localFilterTanggalSelesai = '';
		searchTriggered = false;
		onResetFilters();
	}

	async function exportToExcel() {
		if (displayTransactions.length === 0) {
			alert('Tidak ada data untuk di-export');
			return;
		}

		const XLSX = await import('xlsx');

		const data = displayTransactions.map((t) => ({
			Tanggal: formatDate(t.tanggal),
			Keterangan: t.keterangan,
			Kategori: t.kategori,
			Jenis: t.jenis === 'masuk' ? 'Masuk' : 'Keluar',
			Metode: t.metode.toUpperCase(),
			Pengirim: t.namaPengirim || '-',
			Kelas: t.kelasPengirim || '-',
			Jumlah: t.jumlah
		}));

		// Add totals at the end
		data.push({
			Tanggal: '',
			Keterangan: 'TOTAL',
			Kategori: '',
			Jenis: '',
			Metode: '',
			Pengirim: '',
			Kelas: '',
			Jumlah: displayTransactions.reduce((sum, t) => sum + (t.jenis === 'masuk' ? t.jumlah : -t.jumlah), 0)
		} as any);

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

		// Generate filename based on filters
		let filename = 'Laporan_Keuangan';
		if (filterKategori) filename += `_${filterKategori}`;
		if (filterNama) filename += `_${filterNama.replace(/\s+/g, '_')}`;
		if (filterTanggalMulai) filename += `_${filterTanggalMulai}`;
		if (filterTanggalSelesai) filename += `_sd_${filterTanggalSelesai}`;
		filename += '.xlsx';

		XLSX.writeFile(workbook, filename);
	}
</script>

<div class="fade-in">
	<div class="rounded-2xl p-5 {cardBg} {cardBorder} mb-6">
		<h2 class="text-sm font-semibold mb-4 {textMuted}">
			<History size={16} class="inline mr-1" />
			Filter Laporan
		</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Kategori</label>
				<select
					value={localFilterKategori}
					onchange={(e) => localFilterKategori = e.currentTarget.value}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				>
					<option value="">Semua Kategori</option>
					{#each categories as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Nama Pengirim</label>
				<input
					type="text"
					value={localFilterNama}
					oninput={(e) => localFilterNama = e.currentTarget.value}
					placeholder="Cari nama pengirim..."
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder}"
				/>
			</div>

			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Kelas</label>
				<select
					value={localFilterKelas}
					onchange={(e) => localFilterKelas = e.currentTarget.value}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				>
					<option value="">Semua Kelas</option>
					{#each classes as cls}
						<option value={cls}>{cls}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Metode</label>
				<select
					value={localFilterMetode}
					onchange={(e) => localFilterMetode = e.currentTarget.value}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				>
					<option value="">Semua Metode</option>
					{#each methods as method}
						<option value={method}>{method}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Tanggal Mulai</label>
				<input
					type="date"
					value={localFilterTanggalMulai}
					oninput={(e) => localFilterTanggalMulai = e.currentTarget.value}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				/>
			</div>
			<div>
				<label class="block text-xs font-medium mb-1.5 {labelColor}">Tanggal Selesai</label>
				<input
					type="date"
					value={localFilterTanggalSelesai}
					oninput={(e) => localFilterTanggalSelesai = e.currentTarget.value}
					class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				/>
			</div>
		</div>

		<div class="flex gap-2 flex-wrap">
			<button
				type="button"
				onclick={handleSearch}
				class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center gap-2"
			>
				<Search size={16} />
				<span>Filter</span>
			</button>
			<button
				type="button"
				onclick={onPreviewReport}
				class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white flex items-center gap-2"
			>
				<Eye size={16} />
				<span>Preview</span>
			</button>
			<button
				type="button"
				onclick={onDownloadPDF}
				class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white flex items-center gap-2"
			>
				<Download size={16} />
				<span>Download PDF</span>
			</button>
			<button
				type="button"
				onclick={exportToExcel}
				class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#0f172a] to-[#334155] text-white flex items-center gap-2"
			>
				<FileSpreadsheet size={16} />
				<span>Export Excel</span>
			</button>
			<button
				type="button"
				onclick={handleReset}
				class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#64748b] to-[#94a3b8] text-white"
			>
				Reset
			</button>
		</div>
	</div>

	<!-- Summary Cards -->
	{#if displayTransactions.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
			<div class="rounded-xl p-4 {currentTheme === 'dark' ? 'bg-[#10b981]/10 border border-[#10b981]/30' : 'bg-green-50 border border-green-200'}">
				<p class="text-xs {textMuted} mb-1">Total Infaq</p>
				<p class="text-lg font-bold text-[#10b981]">{formatRupiah(totalInfaq)}</p>
			</div>
			<div class="rounded-xl p-4 {currentTheme === 'dark' ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/30' : 'bg-purple-50 border border-purple-200'}">
				<p class="text-xs {textMuted} mb-1">Total Jariyah</p>
				<p class="text-lg font-bold text-[#8b5cf6]">{formatRupiah(totalJariyah)}</p>
			</div>
			<div class="rounded-xl p-4 {currentTheme === 'dark' ? 'bg-[#ef4444]/10 border border-[#ef4444]/30' : 'bg-red-50 border border-red-200'}">
				<p class="text-xs {textMuted} mb-1">Total Keluar</p>
				<p class="text-lg font-bold text-[#ef4444]">{formatRupiah(totalKeluar)}</p>
			</div>
		</div>
	{/if}

	<!-- Preview Table -->
	<div class="rounded-2xl p-5 {cardBg} {cardBorder}" id="report-preview-table">
		<h3 class="text-sm font-semibold mb-4 {textSecondary}">
			📊 Preview Laporan ({displayTransactions.length} transaksi)
		</h3>

		{#if displayTransactions.length > 0}
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
						</tr>
					</thead>
					<tbody>
						{#each displayTransactions as t}
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
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="{textMuted}">
					{searchTriggered && displayTransactions.length === 0 ? 'Tidak ada data untuk filter yang dipilih' : 'Terapkan filter dengan tombol Filter'}
				</p>
			</div>
		{/if}
	</div>
</div>
