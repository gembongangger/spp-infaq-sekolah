<script lang="ts">
	import { activeTab, theme, stats, transactions, students, senderSummaries, categories, apiConnected } from '$lib/stores';
	import { loadStudents, loadTransactions, loadStats, loadSenders, loadKategori, deleteStudent, deleteTransaction } from '$lib/stores';
	import { authStore, logout } from '$lib/auth-store';
	import TabNavigation from '$lib/components/TabNavigation.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';

	const dashboardTabPromise = import('$lib/components/DashboardTab.svelte');
	const studentFormPromise = import('$lib/components/StudentForm.svelte');
	const studentTablePromise = import('$lib/components/StudentTable.svelte');
	const transactionFormPromise = import('$lib/components/TransactionForm.svelte');
	const transactionsTabPromise = import('$lib/components/TransactionsTab.svelte');
	const sendersTabPromise = import('$lib/components/SendersTab.svelte');
	const reportTabPromise = import('$lib/components/ReportTab.svelte');
	const profileModalPromise = import('$lib/components/ProfileModal.svelte');

	let showLogoutModal = $state(false);
	let showProfileModal = $state(false);
	let currentTheme = $derived($theme);
	let studentTableRefreshKey = $state(0);
	let dataLoaded = $state({
		stats: false,
		students: false,
		transactions: false,
		senders: false,
		categories: false
	});

	const pendingLoads: Record<keyof typeof dataLoaded, Promise<void> | null> = {
		stats: null,
		students: null,
		transactions: null,
		senders: null,
		categories: null
	};

	// Report filters
	let reportKategori = $state('');
	let reportNama = $state('');
	let reportKelas = $state('');
	let reportMetode = $state('');
	let reportTanggalMulai = $state('');
	let reportTanggalSelesai = $state('');

	// Transaction tab filters
	let filterTanggalMulai = $state('');
	let filterTanggalSelesai = $state('');
	let filterKategori = $state('');

	// Derived state for filtered transactions
	let reportFilteredTransactions = $derived(
		$transactions.filter(t => {
			const matchKategori = !reportKategori || t.kategori === reportKategori;
			const matchNama = !reportNama || t.namaPengirim === reportNama;
			const matchKelas = !reportKelas || t.kelasPengirim === reportKelas;
			const matchMetode = !reportMetode || t.metode === reportMetode;
			const transactionDate = t.tanggal;
			const matchTanggalMulai = !reportTanggalMulai || transactionDate >= reportTanggalMulai;
			const matchTanggalSelesai = !reportTanggalSelesai || transactionDate <= reportTanggalSelesai;
			return matchKategori && matchNama && matchKelas && matchMetode && matchTanggalMulai && matchTanggalSelesai;
		})
	);

	let filteredTransactions = $derived(
		$transactions.filter(t => {
			const matchKategori = !filterKategori || t.kategori === filterKategori;
			const matchTanggalMulai = !filterTanggalMulai || t.tanggal >= filterTanggalMulai;
			const matchTanggalSelesai = !filterTanggalSelesai || t.tanggal <= filterTanggalSelesai;
			return matchKategori && matchTanggalMulai && matchTanggalSelesai;
		})
	);

	function resetFilter() {
		filterTanggalMulai = '';
		filterTanggalSelesai = '';
		filterKategori = '';
	}

	function handlePreviewReport() {
		if (reportFilteredTransactions.length === 0) {
			alert('Tidak ada data untuk periode/kategori yang dipilih');
			return;
		}
		const tableElement = document.getElementById('report-preview-table');
		if (tableElement) {
			tableElement.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function handleDownloadPDF() {
		if (reportFilteredTransactions.length === 0) {
			alert('Tidak ada data untuk diunduh');
			return;
		}
		window.print();
	}

	function resetFilters() {
		reportKategori = '';
		reportNama = '';
		reportKelas = '';
		reportMetode = '';
		reportTanggalMulai = '';
		reportTanggalSelesai = '';
	}

	async function handleLogout() {
		try {
			await logout();
			goto('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function switchTab(tab: string) {
		activeTab.set(tab);
	}

	function refreshStudentTable() {
		studentTableRefreshKey += 1;
	}

	function queueDataLoad(
		key: keyof typeof dataLoaded,
		loader: () => Promise<unknown>,
		force = false
	) {
		if (dataLoaded[key] && !force) {
			return Promise.resolve();
		}

		if (pendingLoads[key] && !force) {
			return pendingLoads[key]!;
		}

		const task = (async () => {
			await loader();
			dataLoaded[key] = true;
		})().finally(() => {
			pendingLoads[key] = null;
		});

		pendingLoads[key] = task;
		return task;
	}

	function ensureStatsLoaded(force = false) {
		return queueDataLoad('stats', () => loadStats(), force);
	}

	function ensureStudentsLoaded(force = false) {
		return queueDataLoad('students', () => loadStudents(), force);
	}

	function ensureTransactionsLoaded(force = false) {
		return queueDataLoad('transactions', () => loadTransactions(), force);
	}

	function ensureSendersLoaded(force = false) {
		return queueDataLoad('senders', () => loadSenders(), force);
	}

	function ensureCategoriesLoaded(force = false) {
		return queueDataLoad('categories', () => loadKategori(), force);
	}

	async function ensureTabData(tab: string, force = false) {
		switch (tab) {
			case 'dashboard':
				await ensureStatsLoaded(force);
				break;
			case 'students':
				await ensureStudentsLoaded(force);
				break;
			case 'input':
				await Promise.all([ensureStudentsLoaded(force), ensureCategoriesLoaded(force)]);
				break;
			case 'transactions':
				await Promise.all([ensureTransactionsLoaded(force), ensureCategoriesLoaded(force)]);
				break;
			case 'senders':
				await Promise.all([ensureStudentsLoaded(force), ensureTransactionsLoaded(force)]);
				break;
			case 'reports':
				await Promise.all([
					ensureTransactionsLoaded(force),
					ensureCategoriesLoaded(force),
					ensureSendersLoaded(force)
				]);
				break;
		}
	}

	async function handleEditStudent(student: any) {
		await ensureTabData('students');
		activeTab.set('students');
		await tick();
		let attempts = 0;
		const checkForm = setInterval(() => {
			if (studentForm && typeof studentForm.setEditStudent === 'function') {
				clearInterval(checkForm);
				studentForm.setEditStudent(student);
				setTimeout(() => {
					document.querySelector('.rounded-2xl.p-5.mb-8')?.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}, 50);
			}
			if (++attempts > 20) clearInterval(checkForm);
		}, 50);
	}

	async function handleEditTransaction(transaction: any) {
		await ensureTabData('input');
		activeTab.set('input');
		await tick();
		let attempts = 0;
		const checkForm = setInterval(() => {
			if (transactionForm && typeof transactionForm.setEditTransaction === 'function') {
				clearInterval(checkForm);
				transactionForm.setEditTransaction(transaction);
				setTimeout(() => {
					document.querySelector('.rounded-2xl.p-5.mb-8')?.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}, 50);
			}
			if (++attempts > 20) clearInterval(checkForm);
		}, 50);
	}

	function handleEditSender(sender: any) {
		const student = $students.find(s => s.nomorAkun === sender.nomorAkun || s.nama === sender.nama);
		if (student) {
			handleEditStudent(student);
		} else {
			alert('Data siswa tidak ditemukan untuk pengirim ini');
		}
	}

	// Store subscriptions
	let currentStats = $derived($stats);
	let allSenderSummaries = $derived($senderSummaries);
	let isConnected = $derived($apiConnected);

	// Form references
	let studentForm = $state<{ setEditStudent?: (student: any) => void }>({});
	let transactionForm = $state<{ setEditTransaction?: (transaction: any) => void }>({});

	// Load data from API on mount
	onMount(async () => {
		if (!$authStore.isAuthenticated) {
			goto('/login');
			return;
		}

		await ensureTabData($activeTab || 'dashboard');
	});

	$effect(() => {
		if (!$authStore.isAuthenticated) return;

		const currentTab = $activeTab;
		void ensureTabData(currentTab);
	});
</script>

<div class="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
	<AppHeader
		apiConnected={isConnected}
		{currentTheme}
		onShowLogoutModal={() => showLogoutModal = true}
		onShowProfileModal={() => showProfileModal = true}
	/>

	<!-- Quick Action: Cetak Riwayat Transaksi -->
	<div class="mb-6">
		<a
			href="/pengirim"
			class="block rounded-xl p-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all shadow-lg hover:shadow-xl"
		>
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
						<path d="M6 9V2h12v7"/>
						<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
						<path d="M6 14h12v8H6z"/>
					</svg>
				</div>
				<div class="text-white">
					<h3 class="font-bold text-lg">📋 Cetak Riwayat Transaksi Siswa</h3>
					<p class="text-sm text-white/80">Cari dan cetak riwayat transaksi siswa berdasarkan nama</p>
				</div>
			</div>
		</a>
	</div>

	<TabNavigation />

	{#if $activeTab === 'dashboard'}
		{#await dashboardTabPromise then module}
			{@const DashboardTab = module.default}
			<DashboardTab stats={currentStats} />
		{/await}
	{/if}

	{#if $activeTab === 'students'}
		<div class="fade-in">
			{#await studentFormPromise then module}
				{@const StudentForm = module.default}
				<StudentForm bind:this={studentForm} onSaved={refreshStudentTable} />
			{/await}
			{#await studentTablePromise then module}
				{@const StudentTable = module.default}
				<StudentTable onEdit={handleEditStudent} refreshKey={studentTableRefreshKey} />
			{/await}
		</div>
	{/if}

	{#if $activeTab === 'input'}
		<div class="fade-in">
			{#await transactionFormPromise then module}
				{@const TransactionForm = module.default}
				<TransactionForm bind:this={transactionForm} />
			{/await}
		</div>
	{/if}

	{#if $activeTab === 'transactions'}
		{#await transactionsTabPromise then module}
			{@const TransactionsTab = module.default}
			<TransactionsTab
				transactions={$transactions}
				filteredTransactions={filteredTransactions}
				categories={$categories.map(c => c.nama)}
				filterKategori={filterKategori}
				filterTanggalMulai={filterTanggalMulai}
				filterTanggalSelesai={filterTanggalSelesai}
				onFilterKategoriChange={(v) => filterKategori = v}
				onFilterTanggalMulaiChange={(v) => filterTanggalMulai = v}
				onFilterTanggalSelesaiChange={(v) => filterTanggalSelesai = v}
				onResetFilter={resetFilter}
				onEditTransaction={handleEditTransaction}
				onDeleteTransaction={(id) => deleteTransaction(id)}
				{currentTheme}
			/>
		{/await}
	{/if}

	{#if $activeTab === 'senders'}
		{#await sendersTabPromise then module}
			{@const SendersTab = module.default}
			<SendersTab
				students={$students}
				transactions={$transactions}
				onEditSender={handleEditSender}
				{currentTheme}
			/>
		{/await}
	{/if}

	{#if $activeTab === 'reports'}
		{#await reportTabPromise then module}
			{@const ReportTab = module.default}
			<ReportTab
				transactions={$transactions}
				filteredTransactions={reportFilteredTransactions}
				categories={$categories.map(c => c.nama)}
				names={Array.from(new Set(allSenderSummaries.map(s => s.nama)))}
				classes={Array.from(new Set(allSenderSummaries.map(s => s.kelas))).sort()}
				methods={['tunai', 'transfer']}
				filterKategori={reportKategori}
				filterNama={reportNama}
				filterKelas={reportKelas}
				filterMetode={reportMetode}
				filterTanggalMulai={reportTanggalMulai}
				filterTanggalSelesai={reportTanggalSelesai}
				onFilterKategoriChange={(v) => reportKategori = v}
				onFilterNamaChange={(v) => reportNama = v}
				onFilterKelasChange={(v) => reportKelas = v}
				onFilterMetodeChange={(v) => reportMetode = v}
				onFilterTanggalMulaiChange={(v) => reportTanggalMulai = v}
				onFilterTanggalSelesaiChange={(v) => reportTanggalSelesai = v}
				onPreviewReport={handlePreviewReport}
				onDownloadPDF={handleDownloadPDF}
				onResetFilters={resetFilters}
				{currentTheme}
			/>
		{/await}
	{/if}
</div>

<!-- Logout Modal -->
{#if showLogoutModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
		<div class="{currentTheme === 'dark' ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-slate-200'} rounded-2xl p-6 w-full max-w-sm">
			<div class="text-center mb-4">
				<div class="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center mx-auto mb-3">
					<svg width="24" height="24" class="text-[#ef4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">Logout</h3>
				<p class="text-sm {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'} mt-1">Apakah Anda yakin ingin keluar?</p>
			</div>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={() => showLogoutModal = false}
					class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold {currentTheme === 'dark' ? 'bg-[#334155] text-[#94a3b8]' : 'bg-slate-200 text-slate-600'} hover:opacity-80 transition-colors"
				>
					Batal
				</button>
				<button
					type="button"
					onclick={handleLogout}
					class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white hover:from-[#dc2626] hover:to-[#b91c1c] transition-colors"
				>
					Logout
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Profile Modal -->
{#await profileModalPromise then module}
	{@const ProfileModal = module.default}
	<ProfileModal isOpen={showProfileModal} onClose={() => showProfileModal = false} />
{/await}

<style>
	.fade-in {
		animation: fadeIn 0.4s ease-out;
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
		:global(.no-print) {
			display: none !important;
		}
	}
</style>
