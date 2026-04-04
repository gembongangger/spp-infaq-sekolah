<script lang="ts">
	import { PlusCircle, X, Edit2, Upload, Download, FileSpreadsheet } from 'lucide-svelte';
	import { addStudent, updateStudent, students, loadStudents, uploadStudentExcel } from '$lib/stores';
	import { siswaApi } from '$lib/api';
	import type { SiswaData } from '$lib/api';
	import { theme } from '$lib/stores';

	let nomorAkun = $state('');
	let nama = $state('');
	let kelas = $state('');
	let allStudents = $derived($students);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let currentTheme = $derived($theme);

	// Upload Excel state
	let showUploadModal = $state(false);
	let isUploading = $state(false);
	let uploadResult = $state<{ success: number; duplicate: number; failed: number; errors: string[] } | null>(null);
	let selectedFile = $state<File | null>(null);

	// Edit mode
	let isEditMode = $state(false);
	let editingStudentId = $state<string | null>(null);
	
	// Props for theme-aware styling
	interface Props {
		onSaved?: () => void;
		cardBg?: string;
		cardBorder?: string;
		inputBg?: string;
		inputBorder?: string;
		inputText?: string;
		inputPlaceholder?: string;
		labelColor?: string;
		badgeBg?: string;
		badgeText?: string;
		textMuted?: string;
	}

	let { 
		onSaved,
		cardBg = currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white',
		cardBorder = currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200',
		inputBg = currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50',
		inputBorder = currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-500',
		inputText = currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900',
		inputPlaceholder = currentTheme === 'dark' ? 'placeholder:text-[#475569]' : 'placeholder:text-slate-500',
		labelColor = currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-600',
		badgeBg = currentTheme === 'dark' ? 'bg-[#334155]' : 'bg-slate-200',
		badgeText = currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700',
		textMuted = currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500'
	}: Props = $props();

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!nomorAkun || !nama || !kelas) return;

		// Check duplicate nomor_akun (only for create or when changing nomor_akun)
		const duplicate = allStudents.find((s) => s.nomorAkun === nomorAkun && s.id !== editingStudentId);
		if (duplicate) {
			alert('Nomor akun sudah terdaftar');
			return;
		}

		isLoading = true;
		error = null;

		try {
			if (isEditMode && editingStudentId) {
				await updateStudent(editingStudentId, { nomorAkun, nama, kelas });
			} else {
				await addStudent({ nomorAkun, nama, kelas });
			}
			await loadStudents();
			onSaved?.();
			// Reset form
			nomorAkun = '';
			nama = '';
			kelas = '';
			isEditMode = false;
			editingStudentId = null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal menyimpan siswa';
		} finally {
			isLoading = false;
		}
	}

	function cancelEdit() {
		nomorAkun = '';
		nama = '';
		kelas = '';
		isEditMode = false;
		editingStudentId = null;
		error = null;
	}

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			selectedFile = target.files[0];
		}
	}

	async function handleUploadExcel() {
		if (!selectedFile) {
			alert('Pilih file Excel terlebih dahulu');
			return;
		}

		isUploading = true;
		uploadResult = null;

		try {
			const result = await uploadStudentExcel(selectedFile);
			uploadResult = result;
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Gagal upload Excel');
		} finally {
			isUploading = false;
		}
	}

	function closeUploadModal() {
		showUploadModal = false;
		selectedFile = null;
		uploadResult = null;
		isUploading = false;
	}

	async function handleDownloadTemplate() {
		try {
			const blob = await siswaApi.downloadTemplate();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'template_siswa.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			alert('Gagal download template');
		}
	}

	// Function to set edit mode from parent
	export function setEditStudent(student: SiswaData) {
		nomorAkun = student.nomorAkun;
		nama = student.nama;
		kelas = student.kelas;
		editingStudentId = student.id;
		isEditMode = true;
	}
</script>

<div class="rounded-2xl p-5 mb-8 {cardBg} {cardBorder}">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-sm font-semibold {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-600'}">
			{isEditMode ? '✏️ Edit Identitas Siswa' : '📋 Tambah Identitas Siswa'}
		</h2>
		{#if !isEditMode}
			<div class="flex gap-2">
				<button
					type="button"
					onclick={handleDownloadTemplate}
					class="px-3 py-2 rounded-lg text-xs font-semibold {badgeBg} {badgeText} flex items-center gap-1.5 hover:opacity-80 transition-colors"
					title="Download Template Excel"
				>
					<Download size={14} />
					<span>Template</span>
				</button>
				<button
					type="button"
					onclick={() => showUploadModal = true}
					class="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center gap-1.5 hover:from-[#059669] hover:to-[#047857] transition-colors"
					title="Upload Excel"
				>
					<Upload size={14} />
					<span>Upload Excel</span>
				</button>
			</div>
		{/if}
	</div>
	{#if error}
		<div class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
			{error}
		</div>
	{/if}
	<form onsubmit={handleSubmit} class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
		<div>
			<label for="student-nomor-akun" class="block text-xs font-medium mb-1.5 {labelColor}">No. Akun</label>
			<input
				type="text"
				id="student-nomor-akun"
				bind:value={nomorAkun}
				placeholder="Contoh: 001"
				required
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder}"
				autocomplete="off"
			/>
		</div>
		<div>
			<label for="student-nama" class="block text-xs font-medium mb-1.5 {labelColor}">Nama Siswa</label>
			<input
				type="text"
				id="student-nama"
				bind:value={nama}
				placeholder="Nama lengkap"
				required
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder}"
				autocomplete="off"
			/>
		</div>
		<div>
			<label for="student-kelas" class="block text-xs font-medium mb-1.5 {labelColor}">Kelas</label>
			<input
				type="text"
				id="student-kelas"
				bind:value={kelas}
				placeholder="Contoh: X IPA 1"
				required
				class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} {inputPlaceholder}"
				autocomplete="off"
			/>
		</div>
		<div></div>
		{#if isEditMode}
			<button
				type="button"
				onclick={cancelEdit}
				class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold {badgeBg} {badgeText} flex items-center justify-center gap-2"
			>
				<X size={16} />
				<span>Batal</span>
			</button>
		{/if}
		<button
			type="submit"
			class="btn-primary w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white"
			disabled={isLoading}
		>
			{#if isEditMode}
				<Edit2 size={16} />
				<span>{isLoading ? 'Menyimpan...' : 'Update'}</span>
			{:else}
				<PlusCircle size={16} />
				<span>{isLoading ? 'Menyimpan...' : 'Tambah'}</span>
			{/if}
		</button>
	</form>
</div>

<!-- Modal Upload Excel -->
{#if showUploadModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
		<div class="{cardBg} {cardBorder} rounded-2xl p-6 w-full max-w-lg">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} flex items-center gap-2">
					<FileSpreadsheet size={20} color="#10b981" />
					Upload Data Siswa dari Excel
				</h3>
			</div>

			<div class="space-y-4">
				<div class="p-4 rounded-xl {inputBg} {inputBorder}">
					<h4 class="text-xs font-semibold {textMuted} mb-2">📋 Format File Excel:</h4>
					<ul class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'} space-y-1">
						<li>• Kolom 1: <strong class="{currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">Nomor Akun</strong></li>
						<li>• Kolom 2: <strong class="{currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">Nama</strong></li>
						<li>• Kolom 3: <strong class="{currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">Kelas</strong></li>
						<li>• Baris pertama adalah header</li>
						<li>• Format: .xlsx atau .xls</li>
					</ul>
				</div>

				<div>
					<label for="excel-file" class="block text-xs font-medium mb-1.5 {labelColor}">Pilih File Excel</label>
					<input
						type="file"
						id="excel-file"
						accept=".xlsx,.xls"
						onchange={handleFileChange}
						class="w-full px-3 py-2.5 rounded-xl text-sm {inputBg} {inputBorder} {inputText} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#10b981] file:text-white hover:file:bg-[#059669]"
					/>
					{#if selectedFile}
						<p class="mt-2 text-xs text-[#10b981]">✓ File terpilih: {selectedFile.name}</p>
					{/if}
				</div>

				{#if uploadResult}
					<div class="p-4 rounded-xl {inputBg} {inputBorder}">
						<h4 class="text-sm font-semibold {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'} mb-3">Hasil Upload:</h4>
						{#if uploadResult.success > 0}
							<div class="flex items-center gap-2 text-sm text-[#10b981] mb-2">
								<span class="w-2 h-2 rounded-full bg-[#10b981]"></span>
								<span>Berhasil: <strong>{uploadResult.success}</strong> data</span>
							</div>
						{/if}
						{#if uploadResult.duplicate > 0}
							<div class="flex items-center gap-2 text-sm text-[#f59e0b] mb-2">
								<span class="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
								<span>Duplikat: <strong>{uploadResult.duplicate}</strong> data (diabaikan)</span>
							</div>
						{/if}
						{#if uploadResult.failed > 0}
							<div class="flex items-center gap-2 text-sm text-[#ef4444] mb-2">
								<span class="w-2 h-2 rounded-full bg-[#ef4444]"></span>
								<span>Gagal: <strong>{uploadResult.failed}</strong> data</span>
							</div>
						{/if}
						{#if uploadResult.errors && uploadResult.errors.length > 0}
							<div class="mt-3 pt-3 border-t {currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-300'}">
								<p class="text-xs {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-500'} mb-1">Detail Error:</p>
								<ul class="text-xs text-[#ef4444] space-y-0.5 max-h-32 overflow-y-auto">
									{#each uploadResult.errors as err}
										<li>• {err}</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex gap-2 mt-6">
				<button
					type="button"
					onclick={closeUploadModal}
					class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold {badgeBg} {badgeText} flex items-center justify-center gap-2"
				>
					<X size={16} />
					<span>{uploadResult ? 'Tutup' : 'Batal'}</span>
				</button>
				<button
					type="button"
					onclick={handleUploadExcel}
					disabled={!selectedFile || isUploading}
					class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isUploading}
						<span class="animate-spin">⏳</span>
					{:else}
						<Upload size={16} />
					{/if}
					<span>{isUploading ? 'Mengupload...' : 'Upload Sekarang'}</span>
				</button>
			</div>
		</div>
	</div>
{/if}
