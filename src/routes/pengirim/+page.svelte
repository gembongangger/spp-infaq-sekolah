<script lang="ts">
	import { authStore } from '$lib/auth-store';
	import { transactions } from '$lib/stores';
	import { loadTransactions } from '$lib/stores';
	import { siswaApi } from '$lib/api';
	import { formatRupiah, formatDate } from '$lib/utils';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Search, X, Printer, ArrowLeft, History, User, ChevronLeft, ChevronRight, Loader } from 'lucide-svelte';

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

	let currentTheme: 'dark' | 'light' = $state('dark');
	let searchQuery = $state('');
	let selectedStudent = $state<Student | null>(null);
	let showHistory = $state(false);
	let isLoading = $state(false);
	let currentPage = $state(1);
	let pagination = $state({ page: 1, limit: 20, total: 0, hasMore: false, totalPages: 0 });
	let studentsWithStats = $state<StudentWithStats[]>([]);
	let searchTimeout = $state(null);

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
			
			// Fetch transaction stats for displayed students only
			const allTransactions = $transactions;
			if (allTransactions.length > 0 && rawStudents.length > 0) {
				// Build stats map from transactions
				const statsMap = new Map();
				for (const t of allTransactions) {
					if (!t.nomorAkun || !t.namaPengirim) continue;
					if (!statsMap.has(t.nomorAkun)) {
						statsMap.set(t.nomorAkun, { totalInfaq: 0, totalJariyah: 0, totalDonasi: 0, totalTransaksi: 0 });
					}
					const stat = statsMap.get(t.nomorAkun);
					stat.totalTransaksi++;
					if (t.jenis === 'masuk') {
						stat.totalDonasi += t.jumlah;
						if (t.kategori === 'infaq') stat.totalInfaq += t.jumlah;
						else if (t.kategori === 'jariyah') stat.totalJariyah += t.jumlah;
					}
				}

				// Merge with stats
				studentsWithStats = rawStudents.map(s => ({
					...s,
					totalInfaq: statsMap.get(s.nomorAkun)?.totalInfaq || 0,
					totalJariyah: statsMap.get(s.nomorAkun)?.totalJariyah || 0,
					totalDonasi: statsMap.get(s.nomorAkun)?.totalDonasi || 0,
					totalTransaksi: statsMap.get(s.nomorAkun)?.totalTransaksi || 0
				}));
			} else {
				// No transactions, just use raw students
				studentsWithStats = rawStudents.map(s => ({
					...s,
					totalInfaq: 0,
					totalJariyah: 0,
					totalDonasi: 0,
					totalTransaksi: 0
				}));
			}
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
		
		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		
		// Set new timeout for debounced search
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

	// Helper function to get student transactions
	function getStudentTransactions() {
		if (!selectedStudent) return [];
		const studentNama = selectedStudent.nama.toLowerCase().trim();
		const studentNomorAkun = selectedStudent.nomorAkun ? selectedStudent.nomorAkun.trim() : '';
		
		console.log('[Pengirim History] Looking for transactions for:', { 
			nama: studentNama, 
			nomorAkun: studentNomorAkun,
			totalTransactions: $transactions.length
		});
		
		const filtered = $transactions.filter((t) => {
			const txNomorAkun = (t.nomorAkun || '').toLowerCase().trim();
			const txNamaPengirim = (t.namaPengirim || '').toLowerCase().trim();

			// Match by nomorAkun (exact normalized match)
			if (studentNomorAkun && txNomorAkun && txNomorAkun === studentNomorAkun) {
				console.log('[Pengirim History] ✅ Matched by nomorAkun:', t.nomorAkun);
				return true;
			}

			// Match by nama (case-insensitive and trimmed)
			if (studentNama && txNamaPengirim && txNamaPengirim === studentNama) {
				console.log('[Pengirim History] ✅ Matched by nama:', t.namaPengirim);
				return true;
			}

			return false;
		}).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
		
		console.log('[Pengirim History] Found', filtered.length, 'transactions');
		console.log('[Pengirim History] Sample transaction:', filtered[0]);
		
		return filtered;
	}

	// Theme detection
	onMount(() => {
		const html = document.documentElement;
		const observer = new MutationObserver(() => {
			currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
		});
		observer.observe(html, { attributes: true, attributeFilter: ['class'] });
		currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
	});

	// Auth check and initial load
	onMount(async () => {
		if (!$authStore.isAuthenticated) {
			goto('/login');
			return;
		}
		await loadTransactions();
		// Initial fetch - load first page
		fetchStudents('', 1);
	});

	// Theme-aware styles
	const cardBg = $derived(currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white');
	const cardBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200');
	const inputBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-white');
	const inputBorder = $derived(currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-300');
	const inputText = $derived(currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900');
	const inputPlaceholder = $derived(currentTheme === 'dark' ? 'placeholder:text-[#475569]' : 'placeholder:text-slate-400');
	const textMuted = $derived(currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500');
	const textSecondary = $derived(currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700');
	const tableHeaderBg = $derived(currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-100');
	const tableHeaderBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-200');
	const tableRowBorder = $derived(currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-100');
	const tableRowHover = $derived(currentTheme === 'dark' ? 'hover:bg-[#334155]/30' : 'hover:bg-slate-50');

	// Student stats
	let studentStats = $derived.by(() => {
		if (!selectedStudent) {
			console.log('[Pengirim History] No selected student, returning null');
			return null;
		}
		const txs = getStudentTransactions();
		console.log('[Pengirim History] Calculating stats from', txs.length, 'transactions');
		
		const infaqTxs = txs.filter(t => (t.kategori || '').toLowerCase().trim() === 'infaq' && t.jenis === 'masuk');
		const jariyahTxs = txs.filter(t => (t.kategori || '').toLowerCase().trim() === 'jariyah' && t.jenis === 'masuk');
		const keluarTxs = txs.filter(t => t.jenis === 'keluar');
		
		console.log('[Pengirim History] Infaq txs:', infaqTxs.length, 'Jariyah txs:', jariyahTxs.length, 'Keluar txs:', keluarTxs.length);
		console.log('[Pengirim History] Infaq transactions:', infaqTxs.map(t => ({ kategori: t.kategori, jumlah: t.jumlah })));
		
		const stats = {
			totalInfaq: infaqTxs.reduce((sum, t) => sum + t.jumlah, 0),
			totalJariyah: jariyahTxs.reduce((sum, t) => sum + t.jumlah, 0),
			totalKeluar: keluarTxs.reduce((sum, t) => sum + t.jumlah, 0),
			totalTransaksi: txs.length
		};
		console.log('[Pengirim History] ✅ Stats calculated:', stats);
		return stats;
	});

	function selectStudent(student: Student) {
		selectedStudent = student;
		showHistory = true;
		searchQuery = '';
	}

	function backToSearch() {
		showHistory = false;
		selectedStudent = null;
	}

	function printHistory() {
		window.print();
	}
</script>

<svelte:head>
	<title>Cetak Riwayat Transaksi - Infaq & Jariyah</title>
</svelte:head>

<div class="min-h-screen {currentTheme === 'dark' ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}">
	<div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<button
				onclick={() => goto('/')}
				class="text-sm {textMuted} hover:{currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} transition-colors flex items-center gap-2 mb-4"
			>
				<ArrowLeft size={16} />
				<span>Kembali ke Dashboard</span>
			</button>
			<h1 class="text-2xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
				📋 Cetak Riwayat Transaksi Siswa
			</h1>
			<p class="text-sm {textMuted} mt-1">
				Cari nama siswa untuk melihat dan mencetak riwayat transaksi
			</p>
		</div>

		{#if !showHistory}
			<!-- Search View -->
			<div class="fade-in">
				<!-- Search Card -->
				<div class="rounded-2xl overflow-hidden {cardBg} {cardBorder} mb-6">
					<div class="p-6">
						<div class="relative">
							<Search
								size={20}
								class="absolute left-4 top-1/2 -translate-y-1/2 {textMuted}"
							/>
							<input
								type="text"
								value={searchQuery}
								oninput={(e) => handleSearchInput(e.currentTarget.value)}
								placeholder="Cari nama siswa, nomor akun, atau kelas..."
								class="w-full pl-12 pr-12 py-3.5 rounded-xl text-base {inputBg} {inputBorder} {inputText} {inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-[#10b988] transition-all"
								autofocus
							/>
							{#if searchQuery}
								<button
									type="button"
									onclick={() => { searchQuery = ''; handleSearchInput(''); }}
									class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#334155] rounded-full {textMuted} transition-colors"
								>
									<X size={16} />
								</button>
							{/if}
						</div>
					</div>
				</div>

				<!-- Search Results -->
				<div class="rounded-2xl overflow-hidden {cardBg} {cardBorder}">
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
										<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">No. Akun</th>
										<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Nama Siswa</th>
										<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Kelas</th>
										<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#10b981]">Total Infaq</th>
										<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#a855f7]">Total Jariyah</th>
										<th class="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Aksi</th>
									</tr>
								</thead>
								<tbody>
									{#each studentsWithStats as student}
										<tr class="border-t {tableRowBorder} transition-all duration-150 {tableRowHover}">
											<td class="px-5 py-3 text-sm font-semibold text-[#10b981]">#{student.nomorAkun}</td>
											<td class="px-5 py-3 text-sm {textSecondary}">{student.nama}</td>
											<td class="px-5 py-3 text-sm {textSecondary}">{student.kelas}</td>
											<td class="px-5 py-3 text-sm text-right font-medium text-[#10b981]">{formatRupiah(student.totalInfaq)}</td>
											<td class="px-5 py-3 text-sm text-right font-medium text-[#a855f7]">{formatRupiah(student.totalJariyah)}</td>
											<td class="px-5 py-3 text-center">
												<button
													onclick={() => selectStudent(student)}
													class="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
												>
													<History size={16} />
													<span>Lihat Riwayat</span>
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
							<User size={48} class="mx-auto mb-3 {textMuted}" />
							<p class="text-sm {textMuted}">
								{searchQuery ? `Tidak ditemukan siswa dengan "${searchQuery}"` : 'Belum ada data siswa'}
							</p>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<!-- History View -->
			<div class="fade-in">
				<!-- Back Button -->
				<div class="mb-6">
					<button
						onclick={backToSearch}
						class="text-sm {textMuted} hover:{currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} transition-colors flex items-center gap-2 mb-4"
					>
						<ArrowLeft size={16} />
						<span>Kembali ke Pencarian</span>
					</button>
				</div>

				<!-- Student Info Card -->
				{#if selectedStudent}
					<div class="rounded-2xl overflow-hidden {cardBg} {cardBorder} mb-6 print:shadow-none print:border">
						<div class="p-6 border-b {cardBorder}">
							<div class="flex items-center justify-between flex-wrap gap-4">
								<div class="flex items-center gap-4">
									<div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
										<User size={28} class="text-white" />
									</div>
									<div>
										<h2 class="text-xl font-bold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">
											{selectedStudent.nama}
										</h2>
										<p class="text-sm {textMuted}">
											#{selectedStudent.nomorAkun} • {selectedStudent.kelas}
										</p>
									</div>
								</div>
								<button
									onclick={printHistory}
									class="px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white text-sm font-semibold transition-all flex items-center gap-2 print:hidden"
								>
									<Printer size={18} />
									<span>Cetak Riwayat</span>
								</button>
							</div>
						</div>

						<!-- Stats Cards -->
						{#if studentStats}
							<div class="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
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
					</div>

					<!-- Transactions Table -->
					{@const currentStudentTransactions = getStudentTransactions()}
					<div class="rounded-2xl overflow-hidden {cardBg} {cardBorder} print:shadow-none print:border">
						<div class="p-5 border-b {cardBorder} print:hidden">
							<h3 class="text-sm font-semibold {textSecondary} flex items-center gap-2">
								<History size={16} />
								Daftar Transaksi ({currentStudentTransactions.length})
							</h3>
						</div>

						{#if currentStudentTransactions.length > 0}
							<div class="overflow-x-auto">
								<table class="w-full text-sm">
									<thead>
										<tr class="{tableHeaderBg} {tableHeaderBorder} border-b print:bg-slate-100">
											<th class="text-left py-3 px-4 font-medium {textSecondary}">Tanggal</th>
											<th class="text-left py-3 px-4 font-medium {textSecondary}">Keterangan</th>
											<th class="text-left py-3 px-4 font-medium {textSecondary}">Kategori</th>
											<th class="text-center py-3 px-4 font-medium {textSecondary}">Jenis</th>
											<th class="text-center py-3 px-4 font-medium {textSecondary}">Metode</th>
											<th class="text-right py-3 px-4 font-medium {textSecondary}">Jumlah</th>
										</tr>
									</thead>
									<tbody>
										{#each currentStudentTransactions as t}
											<tr class="{tableRowBorder} border-b {tableRowHover} print:hover:bg-transparent">
												<td class="py-3 px-4 {textMuted}">{formatDate(t.tanggal)}</td>
												<td class="py-3 px-4 {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} print:text-slate-900">{t.keterangan}</td>
												<td class="py-3 px-4">
													<span class="px-2 py-1 rounded-lg text-xs font-medium {currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-200 text-slate-600'} print:bg-slate-200 print:text-slate-700">
														{t.kategori}
													</span>
												</td>
												<td class="text-center py-3 px-4">
													{#if t.jenis === 'masuk'}
														<span class="px-2 py-1 rounded-lg text-xs font-medium bg-[#10b981]/10 text-[#10b981] print:bg-green-100 print:text-green-800">Masuk</span>
													{:else}
														<span class="px-2 py-1 rounded-lg text-xs font-medium bg-[#ef4444]/10 text-[#ef4444] print:bg-red-100 print:text-red-800">Keluar</span>
													{/if}
												</td>
												<td class="text-center py-3 px-4 {textMuted} print:text-slate-600">{t.metode}</td>
												<td class="text-right py-3 px-4 font-medium {t.jenis === 'masuk' ? 'text-[#10b981]' : 'text-[#ef4444]'} print:text-slate-900">
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
								<p class="{textMuted}">Belum ada transaksi untuk siswa ini</p>
							</div>
						{/if}

						<!-- Print Footer -->
						<div class="hidden print:block mt-8 pt-4 border-t border-slate-300">
							<p class="text-xs text-slate-500 text-center">
								Dicetak pada {new Date().toLocaleDateString('id-ID', { 
									weekday: 'long', 
									year: 'numeric', 
									month: 'long', 
									day: 'numeric' 
								})}
							</p>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.fade-in {
		animation: fadeIn 0.3s ease-out;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media print {
		:global(body) {
			background: white !important;
			color: black !important;
		}
		:global(.no-print),
		:global(.print\\:hidden) {
			display: none !important;
		}
		:global(.print\\:shadow-none) {
			box-shadow: none !important;
			border: 1px solid #e2e8f0 !important;
		}
		:global(.print\\:border) {
			border: 1px solid #e2e8f0 !important;
		}
		:global(.print\\:hover\\:bg-transparent):hover {
			background: transparent !important;
		}
	}
</style>
