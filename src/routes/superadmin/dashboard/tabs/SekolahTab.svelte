<script lang="ts">
	import { Plus, Edit, Trash2, School, Users, FileText, DollarSign, CheckCircle, XCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';

	interface Sekolah {
		id: string;
		nama: string;
		kode: string;
		alamat: string | null;
		npsn: string | null;
		namaKepala: string | null;
		noHpKepala: string | null;
		logoUrl: string | null;
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
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
	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let editingSchool = $state<Sekolah | null>(null);

	// Form data
	let formData = $state({
		nama: '',
		kode: '',
		alamat: '',
		npsn: '',
		namaKepala: '',
		noHpKepala: '',
	});

	async function loadSchools() {
		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/superadmin/sekolah', {
				credentials: 'include',
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal memuat data sekolah');
			}

			schools = result.data || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	function openAddModal() {
		formData = {
			nama: '',
			kode: '',
			alamat: '',
			npsn: '',
			namaKepala: '',
			noHpKepala: '',
		};
		showAddModal = true;
	}

	function openEditModal(school: Sekolah) {
		editingSchool = school;
		formData = {
			nama: school.nama,
			kode: school.kode,
			alamat: school.alamat || '',
			npsn: school.npsn || '',
			namaKepala: school.namaKepala || '',
			noHpKepala: school.noHpKepala || '',
		};
		showEditModal = true;
	}

	async function handleAddSubmit(e: Event) {
		e.preventDefault();

		try {
			const response = await fetch('/api/superadmin/sekolah', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal menambahkan sekolah');
			}

			showAddModal = false;
			await loadSchools();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
		}
	}

	async function handleEditSubmit(e: Event) {
		e.preventDefault();

		if (!editingSchool) return;

		try {
			const response = await fetch(`/api/superadmin/sekolah/${editingSchool.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal memperbarui sekolah');
			}

			showEditModal = false;
			editingSchool = null;
			await loadSchools();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
		}
	}

	async function handleDelete(school: Sekolah) {
		if (!confirm(`Yakin ingin menonaktifkan sekolah "${school.nama}"?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/superadmin/sekolah/${school.id}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal menonaktifkan sekolah');
			}

			await loadSchools();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
		}
	}

	// Load on mount
	onMount(loadSchools);
</script>

<div>
	<!-- Header -->
	<div class="flex justify-between items-center mb-6">
		<div>
			<h2 class="text-2xl font-bold text-[#f1f5f9]">Kelola Sekolah</h2>
			<p class="text-sm text-[#64748b] mt-1">Tambah, edit, dan nonaktifkan sekolah</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-medium hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all"
		>
			<Plus size={18} />
			Tambah Sekolah
		</button>
	</div>

	{#if error}
		<div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
			{error}
		</div>
	{/if}

	{#if isLoading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
			<p class="mt-4 text-[#64748b]">Memuat data sekolah...</p>
		</div>
	{:else if schools.length === 0}
		<div class="text-center py-12 bg-[#1e293b] rounded-2xl border border-[#334155]">
			<School size={48} class="mx-auto text-[#64748b] mb-4" />
			<h3 class="text-lg font-semibold text-[#f1f5f9]">Belum ada sekolah</h3>
			<p class="text-sm text-[#64748b] mt-2">Klik tombol "Tambah Sekolah" untuk menambahkan sekolah baru</p>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each schools as school}
				<div class="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 hover:border-[#3b82f6] transition-colors">
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<h3 class="text-lg font-bold text-[#f1f5f9]">{school.nama}</h3>
								<span class="px-2 py-1 rounded-lg text-xs font-medium {school.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
									{school.isActive ? 'Aktif' : 'Nonaktif'}
								</span>
							</div>
							<p class="text-sm text-[#64748b] mb-3">Kode: <span class="text-[#94a3b8] font-mono">{school.kode}</span></p>
							
							{#if school.alamat || school.npsn || school.namaKepala}
								<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#334155]">
									{#if school.alamat}
										<div>
											<p class="text-xs text-[#64748b]">Alamat</p>
											<p class="text-sm text-[#94a3b8]">{school.alamat}</p>
										</div>
									{/if}
									{#if school.npsn}
										<div>
											<p class="text-xs text-[#64748b]">NPSN</p>
											<p class="text-sm text-[#94a3b8] font-mono">{school.npsn}</p>
										</div>
									{/if}
									{#if school.namaKepala}
										<div>
											<p class="text-xs text-[#64748b]">Kepala Sekolah</p>
											<p class="text-sm text-[#94a3b8]">{school.namaKepala}</p>
										</div>
									{/if}
								</div>
							{/if}

							<!-- Stats -->
							{#if school.stats}
								<div class="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#334155]">
									<div class="text-center">
										<div class="flex items-center justify-center gap-1 text-[#3b82f6]">
											<Users size={14} />
											<span class="text-lg font-bold">{school.stats.totalUsers}</span>
										</div>
										<p class="text-xs text-[#64748b] mt-1">Admin</p>
									</div>
									<div class="text-center">
										<div class="flex items-center justify-center gap-1 text-[#10b981]">
											<School size={14} />
											<span class="text-lg font-bold">{school.stats.totalSiswa}</span>
										</div>
										<p class="text-xs text-[#64748b] mt-1">Siswa</p>
									</div>
									<div class="text-center">
										<div class="flex items-center justify-center gap-1 text-[#f59e0b]">
											<FileText size={14} />
											<span class="text-lg font-bold">{school.stats.totalTransaksi}</span>
										</div>
										<p class="text-xs text-[#64748b] mt-1">Transaksi</p>
									</div>
									<div class="text-center">
										<div class="flex items-center justify-center gap-1 text-[#8b5cf6]">
											<DollarSign size={14} />
											<span class="text-lg font-bold">{school.stats.totalKategori}</span>
										</div>
										<p class="text-xs text-[#64748b] mt-1">Kategori</p>
									</div>
								</div>
							{/if}
						</div>

						<div class="flex gap-2 ml-4">
							<button
								onclick={() => openEditModal(school)}
								class="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
								title="Edit"
							>
								<Edit size={18} />
							</button>
							<button
								onclick={() => handleDelete(school)}
								class="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
								title="Nonaktifkan"
							>
								<Trash2 size={18} />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Add Modal -->
	{#if showAddModal}
		<Modal title="Tambah Sekolah Baru" onClose={() => showAddModal = false}>
			<form onsubmit={handleAddSubmit} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Nama Sekolah *</label>
					<input
						type="text"
						bind:value={formData.nama}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Contoh: MAN 1 Jember"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Kode Sekolah *</label>
					<input
						type="text"
						bind:value={formData.kode}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Contoh: MAN1JEMBER"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Alamat</label>
					<input
						type="text"
						bind:value={formData.alamat}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Alamat sekolah"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">NPSN</label>
					<input
						type="text"
						bind:value={formData.npsn}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Nomor Pokok Sekolah Nasional"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Nama Kepala Sekolah</label>
					<input
						type="text"
						bind:value={formData.namaKepala}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Nama kepala sekolah"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">No. HP Kepala Sekolah</label>
					<input
						type="text"
						bind:value={formData.noHpKepala}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="081234567890"
					/>
				</div>
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={() => showAddModal = false}
						class="flex-1 px-4 py-2 rounded-xl bg-[#334155] text-[#94a3b8] hover:bg-[#475569] transition-colors"
					>
						Batal
					</button>
					<button
						type="submit"
						class="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-medium hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all"
					>
						Tambah Sekolah
					</button>
				</div>
			</form>
		</Modal>
	{/if}

	<!-- Edit Modal -->
	{#if showEditModal && editingSchool}
		<Modal title="Edit Sekolah" onClose={() => { showEditModal = false; editingSchool = null; }}>
			<form onsubmit={handleEditSubmit} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Nama Sekolah *</label>
					<input
						type="text"
						bind:value={formData.nama}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Kode Sekolah *</label>
					<input
						type="text"
						bind:value={formData.kode}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Alamat</label>
					<input
						type="text"
						bind:value={formData.alamat}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">NPSN</label>
					<input
						type="text"
						bind:value={formData.npsn}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Nama Kepala Sekolah</label>
					<input
						type="text"
						bind:value={formData.namaKepala}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">No. HP Kepala Sekolah</label>
					<input
						type="text"
						bind:value={formData.noHpKepala}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={() => { showEditModal = false; editingSchool = null; }}
						class="flex-1 px-4 py-2 rounded-xl bg-[#334155] text-[#94a3b8] hover:bg-[#475569] transition-colors"
					>
						Batal
					</button>
					<button
						type="submit"
						class="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-medium hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all"
					>
						Simpan Perubahan
					</button>
				</div>
			</form>
		</Modal>
	{/if}
</div>
