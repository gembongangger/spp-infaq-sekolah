<script lang="ts">
	import { UserX, History, X, Edit2, ChevronLeft, ChevronRight, Loader, FileSpreadsheet } from 'lucide-svelte';
	import { formatRupiah, formatDate } from '$lib/utils';
	import { siswaApi } from '$lib/api';
	import { transactions as transactionsStore } from '$lib/stores';
	import type { TransaksiData } from '$lib/types';
	import * as XLSX from 'xlsx';

	interface Student {
		id: string;
		nomorAkun: string;
		nama: string;
		kelas: string;
		createdAt: string;
		updatedAt: string | null;
	}

	interface StudentWithStats extends Student {
		totalInfaq: number;
		totalJariyah: number;
		totalDonasi: number;
		totalTransaksi: number;
	}

	interface Props {
		students: Student[];
		transactions: TransaksiData[];
		onEditSender: (student: Student) => void;
		currentTheme: 'dark' | 'light';
	}

	let { students, transactions, onEditSender, currentTheme }: Props = $props();

	// Search and pagination state
	let searchQuery = $state('');
	let selectedStudent = $state<Student | null>(null);
	let showHistory = $state(false);
	let isLoading = $state(false);
	let currentPage = $state(1);
	let pagination = $state({ page: 1, limit: 20, total: 0, hasMore: false, totalPages: 0 });
	let studentsWithStats = $state<StudentWithStats[]>([]);
	let searchTimeout: any = null;

	// Use store transactions if props is empty
	let effectiveTransactions = $derived(transactions.length > 0 ? transactions : $transactionsStore);

	const cardBg = $derived(currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white');
	const cardBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200');
	const inputBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-white');
	const inputBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-300');
	const inputText = $derived(currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900');
	const inputPlaceholder = $derived(currentTheme === 'dark' ? 'placeholder:text-[#475569]' : 'placeholder:text-slate-400');
	const labelColor = $derived(currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600');
	const textMuted = $derived(currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500');
	const textSecondary = $derived(currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700');
	const tableHeaderBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-100');
	const tableHeaderBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-200');
	const tableRowBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-100');
	const tableRowHover = $derived(currentTheme === 'dark' ? 'hover:bg-[#334155]/30' : 'hover:bg-slate-50');

	// Fetch students function
	async function fetchStudents(query = '', page = 1) {
		isLoading = true;
		try {
			const result = await siswaApi.search({
				query: query || undefined,
				page,
				limit: 20
			});

			const rawStudents = result.data;
			pagination = result.pagination;

			// Build stats map from transactions
			const statsMap = new Map();
			const txs = effectiveTransactions;
			
			console.log('[SendersTab] Transactions count:', txs.length);
			console.log('[SendersTab] Raw students count:', rawStudents.length);
			console.log('[SendersTab] First transaction sample:', txs[0]);
			console.log('[SendersTab] First student sample:', rawStudents[0]);
			
			if (txs.length > 0 && rawStudents.length > 0) {
				// Build stats map keyed by nomorAkun AND by namaPengirim for fallback
				for (const t of txs) {
					const nomorAkun = t.nomorAkun;
					const namaPengirim = t.namaPengirim;
					
					// Skip if no identifier at all
					if (!nomorAkun && !namaPengirim) continue;
					
					// Try nomorAkun first, fallback to namaPengirim (normalized/lowercase for matching)
					const key = nomorAkun || namaPengirim;
					const normalizedKey = key ? key.toLowerCase().trim() : '';
					
					if (!statsMap.has(normalizedKey)) {
						statsMap.set(normalizedKey, { totalInfaq: 0, totalJariyah: 0, totalDonasi: 0, totalTransaksi: 0 });
					}
					const stat = statsMap.get(normalizedKey);
					stat.totalTransaksi++;
					if (t.jenis === 'masuk') {
						stat.totalDonasi += t.jumlah;
						if (t.kategori === 'infaq') stat.totalInfaq += t.jumlah;
						else if (t.kategori === 'jariyah') stat.totalJariyah += t.jumlah;
					}
				}
				
				console.log('[SendersTab] Stats map size:', statsMap.size);
				console.log('[SendersTab] Stats map keys:', Array.from(statsMap.keys()).slice(0, 5));
				console.log('[SendersTab] Sample stats:', Array.from(statsMap.entries()).slice(0, 3));

				// Merge with stats - try matching by nomorAkun first, then by nama (case-insensitive)
				studentsWithStats = rawStudents.map(s => {
					// Try nomorAkun first (normalized)
					const nomorAkunKey = s.nomorAkun ? s.nomorAkun.toLowerCase().trim() : '';
					let stats = nomorAkunKey ? statsMap.get(nomorAkunKey) : null;
					
					// Fallback to nama matching if no nomorAkun match (normalized)
					if (!stats && s.nama) {
						const namaKey = s.nama.toLowerCase().trim();
						stats = statsMap.get(namaKey);
					}
					
					const result = {
						...s,
						totalInfaq: stats?.totalInfaq || 0,
						totalJariyah: stats?.totalJariyah || 0,
						totalDonasi: stats?.totalDonasi || 0,
						totalTransaksi: stats?.totalTransaksi || 0
					};
					// Log if student has transactions
					if (stats && stats.totalTransaksi > 0) {
						console.log('[SendersTab] ✅ Student with stats:', s.nama, s.nomorAkun, stats);
					} else {
						console.log('[SendersTab] ❌ Student without stats:', s.nama, s.nomorAkun);
					}
					return result;
				});
			} else {
				console.log('[SendersTab] No transactions or students, using zero stats');
				studentsWithStats = rawStudents.map(s => ({
					...s,
					totalInfaq: 0,
					totalJariyah: 0,
					totalDonasi: 0,
					totalTransaksi: 0
				}));
			}
			console.log('[SendersTab] Final studentsWithStats:', studentsWithStats.length);
			console.log('[SendersTab] Students with non-zero stats:', studentsWithStats.filter(s => s.totalInfaq > 0 || s.totalJariyah > 0).length);
		} catch (error) {
			console.error('Failed to search students:', error);
			studentsWithStats = [];
		} finally {
			isLoading = false;
		}
	}

	// Debounced search handler
	function handleSearchInput(value: string) {
		searchQuery = value;
		
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			fetchStudents(value, 1);
		}, 300);
	}

	// Handle page change
	function handlePageChange(page: number) {
		currentPage = page;
		fetchStudents(searchQuery, page);
	}

	// Initial load - re-fetch when transactions change
	$effect(() => {
		// Read transactions to trigger re-run when they change
		const txs = effectiveTransactions;
		const query = searchQuery;
		const page = currentPage;
		
		// Only fetch if we have transactions loaded
		if (txs.length > 0) {
			fetchStudents(query, page);
		}
	});

	// Student transactions
	let studentTransactions = $derived(
		selectedStudent
			? effectiveTransactions
				.filter((t) => {
					const studentNama = selectedStudent.nama.toLowerCase().trim();
					const studentNo = selectedStudent.nomorAkun.toLowerCase().trim();
					const txNama = (t.namaPengirim || '').toLowerCase().trim();
					const txNo = (t.nomorAkun || '').toLowerCase().trim();

					return (studentNo && txNo && txNo === studentNo) || (studentNama && txNama && txNama === studentNama);
				})
				.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
			: []
	);

	// Student stats
	let studentStats = $derived.by(() => {
		if (!selectedStudent) return null;
		const txs = studentTransactions;
		const infaqTxs = txs.filter((t) => (t.kategori || '').toLowerCase().trim() === 'infaq' && t.jenis === 'masuk');
		const jariyahTxs = txs.filter((t) => (t.kategori || '').toLowerCase().trim() === 'jariyah' && t.jenis === 'masuk');
		const keluarTxs = txs.filter((t) => t.jenis === 'keluar');

		return {
			totalInfaq: infaqTxs.reduce((sum, t) => sum + t.jumlah, 0),
			totalJariyah: jariyahTxs.reduce((sum, t) => sum + t.jumlah, 0),
			totalKeluar: keluarTxs.reduce((sum, t) => sum + t.jumlah, 0),
			totalTransaksi: txs.length,
			firstTransaction: txs.length > 0 ? txs[txs.length - 1].tanggal : null,
			lastTransaction: txs.length > 0 ? txs[0].tanggal : null
		};
	});

	function viewHistory(student: Student) {
		selectedStudent = student;
		showHistory = true;
	}

	function closeHistory() {
		showHistory = false;
		selectedStudent = null;
		searchQuery = '';
	}

	function exportHistoryToExcel() {
		if (!selectedStudent || studentTransactions.length === 0) {
			alert('Tidak ada data untuk di-export');
			return;
		}

		const data = studentTransactions.map((t) => ({
			Tanggal: formatDate(t.tanggal),
			Keterangan: t.keterangan,
			Kategori: t.kategori,
			Jenis: t.jenis === 'masuk' ? 'Masuk' : 'Keluar',
			Metode: t.metode.toUpperCase(),
			Jumlah: t.jumlah
		}));

		// Add totals at the end
		if (studentStats) {
			data.push({
				Tanggal: '',
				Keterangan: 'TOTAL',
				Kategori: '',
				Jenis: '',
				Metode: '',
				Jumlah: studentStats.totalInfaq + studentStats.totalJariyah - studentStats.totalKeluar
			} as any);
		}

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat');

		const filename = `Riwayat_${selectedStudent.nama.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

		XLSX.writeFile(workbook, filename);
	}
</script>

<div class="fade-in">
	{#if showHistory && selectedStudent}
		<!-- History View -->
		<div class="mb-6">
			<div class="flex items-center justify-between mb-4">
				<div>
					<button
						onclick={closeHistory}
						class="text-sm {textMuted} hover:{currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} transition-colors flex items-center gap-2 mb-2"
					>
						<X size={16} />
						<span>Kembali ke Daftar Pengirim</span>
					</button>
					<h2 class="text-lg font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
						📋 Riwayat Transaksi
					</h2>
					<p class="text-sm {textMuted}">
						{selectedStudent.nama} - #{selectedStudent.nomorAkun} ({selectedStudent.kelas})
					</p>
				</div>
			</div>

			<!-- Stats Cards -->
			{#if studentStats}
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
					<div class="rounded-xl p-4 {currentTheme === 'dark' ? 'bg-[#10b981]/10 border border-[#10b981]/30' : 'bg-green-50 border border-green-200'}">
						<p class="text-xs {textMuted} mb-1">Total Infaq</p>
						<p class="text-lg font-bold text-[#10b981]">{formatRupiah(studentStats.totalInfaq)}</p>
					</div>
					<div class="rounded-xl p-4 {currentTheme === 'dark' ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/30' : 'bg-purple-50 border border-purple-200'}">
						<p class="text-xs {textMuted} mb-1">Total Jariyah</p>
						<p class="text-lg font-bold text-[#8b5cf6]">{formatRupiah(studentStats.totalJariyah)}</p>
					</div>
					<div class="rounded-xl p-4 {currentTheme === 'dark' ? 'bg-[#ef4444]/10 border border-[#ef4444]/30' : 'bg-red-50 border border-red-200'}">
						<p class="text-xs {textMuted} mb-1">Total Keluar</p>
						<p class="text-lg font-bold text-[#ef4444]">{formatRupiah(studentStats.totalKeluar)}</p>
					</div>
					<div class="rounded-xl p-4 {currentTheme === 'dark' ? 'bg-[#3b82f6]/10 border border-[#3b82f6]/30' : 'bg-blue-50 border border-blue-200'}">
						<p class="text-xs {textMuted} mb-1">Total Transaksi</p>
						<p class="text-lg font-bold text-[#3b82f6]">{studentStats.totalTransaksi}</p>
					</div>
				</div>
			{/if}

			<!-- Transactions Table -->
			<div class="rounded-2xl overflow-hidden {cardBg} {cardBorder}">
				<div class="p-5 flex items-center justify-between border-b {cardBorder}">
					<h3 class="text-sm font-semibold {textSecondary}">
						<History size={16} class="inline mr-2" />
						Daftar Transaksi ({studentTransactions.length})
					</h3>
					{#if studentTransactions.length > 0}
						<button
							onclick={exportHistoryToExcel}
							class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10b981] text-white hover:bg-[#059669] transition-colors"
						>
							<FileSpreadsheet size={14} />
							Export Excel
						</button>
					{/if}
				</div>

				{#if studentTransactions.length > 0}
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="{tableHeaderBg} {tableHeaderBorder} border-b">
									<th class="text-left py-3 px-4 font-medium {textSecondary}">Tanggal</th>
									<th class="text-left py-3 px-4 font-medium {textSecondary}">Keterangan</th>
									<th class="text-left py-3 px-4 font-medium {textSecondary}">Kategori</th>
									<th class="text-center py-3 px-4 font-medium {textSecondary}">Jenis</th>
									<th class="text-center py-3 px-4 font-medium {textSecondary}">Metode</th>
									<th class="text-right py-3 px-4 font-medium {textSecondary}">Jumlah</th>
								</tr>
							</thead>
							<tbody>
								{#each studentTransactions as t}
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
						<History size={48} class="mx-auto mb-3 {textMuted}" />
						<p class="{textMuted}">Belum ada transaksi untuk anggota ini</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Students List View -->
		<div class="rounded-2xl overflow-hidden {cardBg} {cardBorder}">
			<!-- Search Bar -->
			<div class="p-5 border-b {cardBorder}">
				<div class="relative">
					<input
						type="text"
						value={searchQuery}
						oninput={(e) => handleSearchInput(e.currentTarget.value)}
						placeholder="Cari nama, nomor akun, atau kelas..."
						class="w-full pl-4 pr-12 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-[#10b981]"
					/>
					{#if searchQuery}
						<button
							type="button"
							onclick={() => { searchQuery = ''; handleSearchInput(''); }}
							class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[#334155] rounded-full {textMuted}"
						>
							<X size={14} />
						</button>
					{/if}
				</div>
			</div>

			<!-- Results Info -->
			<div class="p-4 border-b {cardBorder} flex items-center justify-between">
				<p class="text-sm {textMuted}">
					{#if searchQuery}
						Ditemukan {pagination.total} siswa
					{:else}
						Total {pagination.total} siswa
					{/if}
				</p>
				{#if pagination.totalPages > 1}
					<p class="text-xs {textMuted}">
						Halaman {pagination.page} dari {pagination.totalPages}
					</p>
				{/if}
			</div>

			{#if isLoading}
				<div class="py-12 text-center">
					<Loader size={48} class="mx-auto mb-3 {textMuted} animate-spin" />
					<p class="text-sm {textMuted}">Memuat data...</p>
				</div>
			{:else if studentsWithStats.length > 0}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="{tableHeaderBg}">
								<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {labelColor}">No. Akun</th>
								<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {labelColor}">Nama Siswa</th>
								<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {labelColor}">Kelas</th>
								<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#10b981]">Total Infaq</th>
								<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#a855f7]">Total Jariyah</th>					<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#3b82f6]">Total Donasi</th>								<th class="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider {labelColor}">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each studentsWithStats as student}
								<tr class="border-t {tableRowBorder} transition-all duration-150 {tableRowHover}">
									<td class="px-5 py-3 text-sm font-semibold text-[#10b981]">#{student.nomorAkun}</td>
									<td class="px-5 py-3 text-sm {textSecondary}">{student.nama}</td>
									<td class="px-5 py-3 text-sm {textSecondary}">{student.kelas}</td>
									<td class="px-5 py-3 text-sm text-right font-medium text-[#10b981]">{formatRupiah(student.totalInfaq)}</td>
									<td class="px-5 py-3 text-sm text-right font-medium text-[#a855f7]">{formatRupiah(student.totalJariyah)}</td>					<td class="px-5 py-3 text-sm text-right font-medium text-[#3b82f6]">{formatRupiah(student.totalDonasi)}</td>									<td class="px-5 py-3 text-center flex gap-1 justify-center">
										<button
											onclick={() => viewHistory(student)}
											class="p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
											title="Lihat Riwayat"
										>
											<History size={15} color="#3b82f6" />
										</button>
										<button
											onclick={() => onEditSender(student)}
											class="p-1.5 rounded-lg hover:bg-green-500/10 transition-colors"
											title="Edit Identitas Siswa"
										>
											<Edit2 size={15} color="#10b981" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				{#if pagination.totalPages > 1}
					<div class="p-4 border-t {cardBorder} flex items-center justify-between">
						<button
							onclick={() => handlePageChange(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							class="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 {currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-200 text-slate-600'} disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-colors"
						>
							<ChevronLeft size={16} />
							<span>Sebelumnya</span>
						</button>

						<div class="flex items-center gap-2">
							{#each Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
								const totalPages = pagination.totalPages;
								let pageNum;
								if (totalPages <= 5) {
									pageNum = i + 1;
								} else if (currentPage <= 3) {
									pageNum = i + 1;
								} else if (currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i;
								} else {
									pageNum = currentPage - 2 + i;
								}
								return pageNum;
							}) as pageNum}
								<button
									onclick={() => handlePageChange(pageNum)}
									class="w-8 h-8 rounded-lg text-sm font-medium {currentPage === pageNum ? 'bg-[#10b981] text-white' : (currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-200 text-slate-600')} hover:opacity-80 transition-colors"
								>
									{pageNum}
								</button>
							{/each}
						</div>

						<button
							onclick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
							disabled={currentPage === pagination.totalPages}
							class="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 {currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-200 text-slate-600'} disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-colors"
						>
							<span>Berikutnya</span>
							<ChevronRight size={16} />
						</button>
					</div>
				{/if}
			{:else}
				<div class="py-12 text-center">
					<UserX size={48} class="mx-auto mb-3 {textMuted}" />
					<p class="text-sm {textMuted}">
						{searchQuery ? `Tidak ditemukan siswa dengan "${searchQuery}"` : 'Belum ada data siswa'}
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
