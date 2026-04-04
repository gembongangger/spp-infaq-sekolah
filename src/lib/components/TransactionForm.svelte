<script lang="ts">
	import { PlusCircle, X, Edit2, Plus, Search, UserX } from 'lucide-svelte';
	import { transactions, students, categories, addTransaction, updateTransaction, addKategori } from '$lib/stores';
	import { Jenis, Metode, type TransaksiData } from '$lib/types';
	import { formatMonth } from '$lib/utils';
	import { theme } from '$lib/stores';

	let tanggal = $state(new Date().toISOString().split('T')[0]);
	let keterangan = $state('');
	let kategori = $state<string>('infaq');
	let jenis = $state<Jenis>(Jenis.MASUK);
	let metode = $state<Metode>(Metode.TUNAI);
	let jumlah = $state<number>(0);
	let selectedStudentId = $state('');
	let currentTheme = $derived($theme);
	let allStudents = $derived($students);
	let allCategories = $derived($categories);
	let isLoading = $state(false);

	// Search state
	let searchQuery = $state('');
	let isSearchOpen = $state(false);
	let filteredStudents = $derived(
		allStudents.filter(s => 
			searchQuery === '' || 
			s.nomorAkun.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
		).slice(0, 10)
	);

	// Props for theme-aware styling
	interface Props {
		cardBg?: string;
		cardBorder?: string;
		inputBg?: string;
		inputBorder?: string;
		inputText?: string;
		inputPlaceholder?: string;
		labelColor?: string;
		textMuted?: string;
	}

	let { 
		cardBg = currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white',
		cardBorder = currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200',
		inputBg = currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50',
		inputBorder = currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-500',
		inputText = currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900',
		inputPlaceholder = currentTheme === 'dark' ? 'placeholder:text-[#475569]' : 'placeholder:text-slate-500',
		labelColor = currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600',
		textMuted = currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'
	}: Props = $props();

	const months = [
		{ value: '01', label: 'Januari' },
		{ value: '02', label: 'Februari' },
		{ value: '03', label: 'Maret' },
		{ value: '04', label: 'April' },
		{ value: '05', label: 'Mei' },
		{ value: '06', label: 'Juni' },
		{ value: '07', label: 'Juli' },
		{ value: '08', label: 'Agustus' },
		{ value: '09', label: 'September' },
		{ value: '10', label: 'Oktober' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'Desember' }
	];

	const currentYearNum = new Date().getFullYear();
	const years = Array.from({ length: 5 }, (_, i) => (currentYearNum - 2 + i).toString());

	let selectedMonth = $state(new Date().toISOString().split('-')[1]);
	let selectedYear = $state(currentYearNum.toString());
	let bulan = $derived(`${selectedYear}-${selectedMonth}`);

	// Show add category modal
	let showAddCategory = $state(false);
	let newCategoryName = $state('');
	let newCategoryColor = $state('#10b981');

	// Edit mode
	let isEditMode = $state(false);
	let editingId = $state<string | null>(null);
	
	// Efek untuk otomatis mengisi keterangan SPP
	$effect(() => {
		if (kategori === 'infaq' && bulan) {
			keterangan = `Infaq/SPP Bulan ${formatMonth(bulan)}`;
		}
	});

	let selectedStudent = $derived(allStudents.find((s) => s.id === selectedStudentId));

	// Success notification state
	let showSuccessNotification = $state(false);
	let lastTransaction = $state<any>(null);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!tanggal || !keterangan || jumlah <= 0) return;

		isLoading = true;

		try {
			const payload = {
				tanggal,
				keterangan,
				kategori,
				jenis,
				jumlah,
				metode,
				siswaId: selectedStudentId || undefined,
				namaPengirim: selectedStudent?.nama || undefined,
				kelasPengirim: selectedStudent?.kelas || undefined,
				nomorAkun: selectedStudent?.nomorAkun || undefined,
				bulan: kategori === 'infaq' ? bulan : undefined
			};

			if (isEditMode && editingId) {
				await updateTransaction(editingId, payload);
				resetForm();
			} else {
				const result = await addTransaction(payload);
				console.log('Transaction added:', result);
				// Store last transaction for receipt
				lastTransaction = {
					...result,
					namaPengirim: selectedStudent?.nama,
					kelasPengirim: selectedStudent?.kelas,
					nomorAkun: selectedStudent?.nomorAkun
				};
				console.log('Last transaction:', lastTransaction);
				showSuccessNotification = true;
				console.log('Show notification:', showSuccessNotification);
				// Don't reset form yet, wait for user to close notification
			}
		} catch (error) {
			console.error('Transaction error:', error);
			alert('Gagal menyimpan transaksi: ' + (error instanceof Error ? error.message : error));
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		resetFormWithoutNotification();
		showSuccessNotification = false;
		lastTransaction = null;
	}

	function printReceipt() {
		if (!lastTransaction) return;
		
		const printWindow = window.open('', '_blank');
		const receiptHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Bukti Transaksi - ${lastTransaction.id}</title>
				<style>
					body { font-family: Arial, sans-serif; padding: 40px; }
					.receipt { max-width: 600px; margin: 0 auto; border: 2px solid #10b981; padding: 30px; border-radius: 12px; }
					.header { text-align: center; margin-bottom: 30px; }
					.header h1 { color: #10b981; margin: 0; font-size: 24px; }
					.header p { color: #64748b; margin: 5px 0; }
					.details { margin: 20px 0; }
					.row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; }
					.row:last-child { border-bottom: none; }
					.label { color: #64748b; font-weight: 500; }
					.value { color: #0f172a; font-weight: 600; }
					.amount { background: #10b981; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0; }
					.footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
					.badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
					.badge-masuk { background: #10b981; color: white; }
					.badge-keluar { background: #ef4444; color: white; }
					@media print { body { padding: 20px; } .receipt { border: 2px solid #000; } }
				</style>
			</head>
			<body>
				<div class="receipt">
					<div class="header">
						<h1>📄 BUKTI TRANSAKSI</h1>
						<p>Sistem Informasi Infaq & Jariyah</p>
						<p>ID: ${lastTransaction.id}</p>
					</div>
					<div class="details">
						<div class="row">
							<span class="label">Tanggal</span>
							<span class="value">${lastTransaction.tanggal}</span>
						</div>
						<div class="row">
							<span class="label">Jenis Transaksi</span>
							<span class="value"><span class="badge badge-${lastTransaction.jenis}">${lastTransaction.jenis === 'masuk' ? '💚 Masuk' : '❤️ Keluar'}</span></span>
						</div>
						<div class="row">
							<span class="label">Kategori</span>
							<span class="value">${lastTransaction.kategori}</span>
						</div>
						${lastTransaction.nomorAkun ? `
						<div class="row">
							<span class="label">Pengirim</span>
							<span class="value">${lastTransaction.namaPengirim || '-'} (#${lastTransaction.nomorAkun})</span>
						</div>
						<div class="row">
							<span class="label">Kelas</span>
							<span class="value">${lastTransaction.kelasPengirim || '-'}</span>
						</div>
						` : ''}
						<div class="row">
							<span class="label">Metode</span>
							<span class="value">${lastTransaction.metode === 'tunai' ? '💵 Tunai' : '🏦 Transfer'}</span>
						</div>
						<div class="row">
							<span class="label">Keterangan</span>
							<span class="value">${lastTransaction.keterangan}</span>
						</div>
					</div>
					<div class="amount">${lastTransaction.jenis === 'masuk' ? '+' : '-'} Rp ${lastTransaction.jumlah.toLocaleString('id-ID')}</div>
					<div class="footer">
						<p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
						<p>Terima kasih atas donasi Anda. Semoga menjadi amal jariyah yang terus mengalir.</p>
					</div>
				</div>
				<script>
					window.onload = function() {
						window.print();
						window.onafterprint = function() { window.close(); };
					};
				<\/script>
			</body>
			</html>
		`;
		printWindow.document.write(receiptHtml);
		printWindow.document.close();
	}

	function closeNotification() {
		showSuccessNotification = false;
		lastTransaction = null;
		// Reset form after closing notification
		resetFormWithoutNotification();
	}

	function resetFormWithoutNotification() {
		keterangan = '';
		jumlah = 0;
		selectedStudentId = '';
		selectedMonth = new Date().toISOString().split('-')[1];
		selectedYear = new Date().getFullYear().toString();
		isEditMode = false;
		editingId = null;
		tanggal = new Date().toISOString().split('T')[0];
		kategori = 'infaq';
	}

	function clearSender() {
		selectedStudentId = '';
	}

	async function handleAddCategory() {
		if (!newCategoryName.trim()) {
			alert('Nama kategori harus diisi');
			return;
		}

		try {
			await addKategori({
				nama: newCategoryName.trim().toLowerCase(),
				warna: newCategoryColor
			});
			newCategoryName = '';
			newCategoryColor = '#10b981';
			showAddCategory = false;
		} catch (error) {
			alert('Gagal menambah kategori: ' + (error instanceof Error ? error.message : error));
		}
	}

	// Function to set edit mode from parent
	export function setEditTransaction(transaction: any) {
		tanggal = transaction.tanggal;
		keterangan = transaction.keterangan;
		kategori = transaction.kategori;
		jenis = transaction.jenis;
		metode = transaction.metode;
		jumlah = transaction.jumlah;
		selectedStudentId = transaction.siswaId || '';

		if (transaction.bulan) {
			const [y, m] = transaction.bulan.split('-');
			selectedYear = y;
			selectedMonth = m;
		}

		editingId = transaction.id;
		isEditMode = true;
	}
</script>

<!-- Success Notification -->
{#if showSuccessNotification && lastTransaction}
	<div class="fixed top-4 right-4 z-50 animate-bounce-in">
		<div class="{currentTheme === 'dark' ? 'bg-[#10b981] text-white' : 'bg-green-600 text-white'} rounded-2xl p-4 shadow-2xl max-w-md">
			<div class="flex items-start gap-3">
				<div class="flex-shrink-0">
					<div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
				</div>
				<div class="flex-1">
					<h4 class="font-semibold text-sm mb-1">✅ Transaksi Berhasil!</h4>
					<p class="text-xs opacity-90 mb-3">Transaksi berhasil ditambahkan. Cetak bukti transaksi?</p>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={printReceipt}
							class="px-3 py-1.5 bg-white text-green-600 rounded-lg text-xs font-semibold hover:bg-green-50 transition-colors flex items-center gap-1"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
							</svg>
							Cetak Bukti
						</button>
						<button
							type="button"
							onclick={closeNotification}
							class="px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-semibold hover:bg-white/30 transition-colors"
						>
							Tutup
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="rounded-2xl p-5 mb-8 {cardBg} {cardBorder}">
	<h2 class="text-sm font-semibold mb-4 {textMuted}">
		{isEditMode ? '✏️ Edit Transaksi' : '➕ Tambah Transaksi'}
	</h2>
	<form onsubmit={handleSubmit} class="grid grid-cols-1 gap-3 mb-5">
		<div>
			<label for="input-tanggal" class="block text-xs font-medium mb-1.5 {labelColor}">Tanggal</label>
			<input
				type="date"
				id="input-tanggal"
				bind:value={tanggal}
				required
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
			/>
		</div>
		{#if kategori === 'infaq'}
			<div>
				<label for="input-bulan-m" class="block text-xs font-medium mb-1.5 {labelColor}">Bulan</label>
				<select
					id="input-bulan-m"
					bind:value={selectedMonth}
					class="w-full px-2 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				>
					{#each months as m}
						<option value={m.value}>{m.label}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="input-bulan-y" class="block text-xs font-medium mb-1.5 {labelColor}">Tahun</label>
				<select
					id="input-bulan-y"
					bind:value={selectedYear}
					class="w-full px-2 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
				>
					{#each years as y}
						<option value={y}>{y}</option>
					{/each}
				</select>
			</div>
		{/if}
		<div class={kategori === 'infaq' ? "" : ""}>
			<label for="input-keterangan" class="block text-xs font-medium mb-1.5 {labelColor}">Keterangan</label>
			<input
				type="text"
				id="input-keterangan"
				bind:value={keterangan}
				placeholder="Contoh: Donasi Jumat"
				required
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder}"
				autocomplete="off"
			/>
		</div>
		<div>
			<label for="input-kategori" class="block text-xs font-medium mb-1.5 {labelColor}">Kategori</label>
			<select
				id="input-kategori"
				bind:value={kategori}
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
			>
				{#each allCategories as cat}
					<option value={cat.nama}>{cat.nama}</option>
				{/each}
			</select>
			<button
				type="button"
				onclick={() => showAddCategory = true}
				class="mt-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#334155] to-[#475569] text-white"
				title="Tambah Kategori Baru"
			>
				<Plus size={16} /> Tambah Kategori
			</button>
		</div>
		<div>
			<label for="input-jenis" class="block text-xs font-medium mb-1.5 {labelColor}">Jenis</label>
			<select
				id="input-jenis"
				bind:value={jenis}
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
			>
				<option value={Jenis.MASUK}>Masuk</option>
				<option value={Jenis.KELUAR}>Keluar</option>
			</select>
		</div>
		<div>
			<label for="input-metode" class="block text-xs font-medium mb-1.5 {labelColor}">Metode</label>
			<select
				id="input-metode"
				bind:value={metode}
				required
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
			>
				<option value={Metode.TUNAI}>💵 Tunai</option>
				<option value={Metode.TRANSFER}>🏦 Transfer</option>
			</select>
		</div>
		<div>
			<label for="input-jumlah" class="block text-xs font-medium mb-1.5 {labelColor}">Jumlah (Rp)</label>
			<input
				type="number"
				id="input-jumlah"
				bind:value={jumlah}
				placeholder="0"
				required
				min="1"
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder}"
			/>
		</div>
		<div class="flex gap-2">
			{#if isEditMode}
				<button
					type="button"
					onclick={resetForm}
					class="px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#334155] to-[#475569] text-white flex items-center justify-center"
					title="Batal"
				>
					<X size={16} />
				</button>
			{/if}
			<button
				type="submit"
				class="btn-primary flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-br from-[#10b981] to-[#059669] text-white"
				disabled={isLoading}
			>
				{#if isEditMode}
					<Edit2 size={16} />
					<span>{isLoading ? '...' : 'Update'}</span>
				{:else}
					<PlusCircle size={16} />
					<span>{isLoading ? '...' : 'Tambah'}</span>
				{/if}
			</button>
		</div>
	</form>

	<div class="pt-5 border-t {currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200'}">
		<h3 class="text-xs font-semibold mb-3 {textMuted}">👤 Data Pengirim</h3>
		
		<!-- Search Input -->
		<div class="relative mb-3">
			<div class="flex gap-2">
				<div class="relative flex-1">
					<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 {textMuted}" />
					<input
						type="text"
						placeholder="Cari No. Akun, Nama, atau Kelas..."
						value={searchQuery}
						oninput={(e) => {
							searchQuery = e.currentTarget.value;
							isSearchOpen = true;
						}}
						onfocus={() => isSearchOpen = true}
						class="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-[#10b981]"
						autocomplete="off"
					/>
					{#if searchQuery}
						<button
							type="button"
							onclick={() => {
								searchQuery = '';
								isSearchOpen = false;
							}}
							class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[#334155] rounded-full {textMuted}"
						>
							<X size={14} />
						</button>
					{/if}
				</div>
				{#if selectedStudentId}
					<button
						type="button"
						onclick={clearSender}
						class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white whitespace-nowrap"
					>
						Reset
					</button>
				{/if}
			</div>

			<!-- Search Results Dropdown -->
			{#if isSearchOpen && searchQuery}
				<div class="absolute z-20 w-full mt-1 {cardBg} {cardBorder} rounded-xl shadow-2xl border max-h-64 overflow-y-auto">
					{#if filteredStudents.length > 0}
						{#each filteredStudents as student}
							<button
								type="button"
								onclick={() => {
									selectedStudentId = student.id;
									searchQuery = `#${student.nomorAkun} - ${student.nama}`;
									isSearchOpen = false;
								}}
								class="w-full text-left px-4 py-2.5 hover:{currentTheme === 'dark' ? 'bg-[#334155]' : 'bg-slate-100'} transition-colors border-b {currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200'} last:border-b-0"
							>
								<div class="flex items-center gap-3">
									<span class="font-semibold text-[#10b981] text-xs">#{student.nomorAkun}</span>
									<span class="flex-1 {inputText} text-sm">{student.nama}</span>
									<span class="{textMuted} text-xs">{student.kelas}</span>
								</div>
							</button>
						{/each}
					{:else}
						<div class="px-4 py-6 text-center {textMuted}">
							<UserX size={32} class="mx-auto mb-2 opacity-50" />
							<p class="text-sm">Tidak ditemukan siswa dengan pencarian "{searchQuery}"</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Selected Student Info -->
		{#if selectedStudent}
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl {currentTheme === 'dark' ? 'bg-[#0f172a] border border-[#334155]' : 'bg-slate-50 border border-slate-200'}">
				<div>
					<p class="text-xs {labelColor} mb-0.5">Nama Siswa</p>
					<p class="text-sm font-medium {inputText}">{selectedStudent.nama}</p>
				</div>
				<div>
					<p class="text-xs {labelColor} mb-0.5">Kelas</p>
					<p class="text-sm font-medium {inputText}">{selectedStudent.kelas}</p>
				</div>
				<div>
					<p class="text-xs {labelColor} mb-0.5">Nomor Akun</p>
					<p class="text-sm font-medium text-[#10b981]">#{selectedStudent.nomorAkun}</p>
				</div>
			</div>
		{:else}
			<p class="text-xs {textMuted} italic">💡 Klik pada hasil pencarian untuk memilih siswa</p>
		{/if}
	</div>
</div>

<!-- Modal Tambah Kategori -->
{#if showAddCategory}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
		<div class="{cardBg} {cardBorder} rounded-2xl p-6 w-full max-w-md">
			<h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} mb-4">➕ Tambah Kategori Baru</h3>

			<div class="space-y-4">
				<div>
					<label for="new-category-name" class="block text-xs font-medium mb-1.5 {labelColor}">Nama Kategori</label>
					<input
						type="text"
						id="new-category-name"
						bind:value={newCategoryName}
						placeholder="Contoh: qurban, dakwah, dll"
						class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder}"
						autocomplete="off"
					/>
				</div>

				<div>
					<label for="new-category-color" class="block text-xs font-medium mb-1.5 {labelColor}">Warna</label>
					<div class="flex gap-2 items-center">
						<input
							type="color"
							id="new-category-color"
							bind:value={newCategoryColor}
							class="w-12 h-10 rounded-lg border {currentTheme === 'dark' ? 'border-[#334155] bg-[#0f172a]' : 'border-slate-300 bg-white'} cursor-pointer"
						/>
						<input
							type="text"
							bind:value={newCategoryColor}
							class="flex-1 px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText}"
							placeholder="#10b981"
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-2 mt-6">
				<button
					type="button"
					onclick={() => {
						showAddCategory = false;
						newCategoryName = '';
						newCategoryColor = '#10b981';
					}}
					class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#334155] to-[#475569] text-white flex items-center justify-center gap-2"
				>
					<X size={16} />
					<span>Batal</span>
				</button>
				<button
					type="button"
					onclick={handleAddCategory}
					class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center gap-2"
				>
					<PlusCircle size={16} />
					<span>Simpan</span>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes bounce-in {
		0% {
			opacity: 0;
			transform: translateY(-20px) scale(0.9);
		}
		50% {
			transform: translateY(5px) scale(1.02);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	.animate-bounce-in {
		animation: bounce-in 0.4s ease-out;
	}
</style>
