<script lang="ts">
	import { Plus, Edit, Trash2, Users, Mail, School } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';

	interface Admin {
		id: string;
		username: string;
		email: string;
		role: string;
		sekolahId: string | null;
		sekolahNama: string | null;
		isActive: boolean;
		namaLengkap: string | null;
		noHp: string | null;
		createdAt: string;
	}

	interface Sekolah {
		id: string;
		nama: string;
		kode: string;
	}

	let admins: Admin[] = $state([]);
	let schools: Sekolah[] = $state([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let editingAdmin = $state<Admin | null>(null);

	// Form data
	let formData = $state({
		email: '',
		password: '',
		sekolah_id: '',
		role: 'admin',
		nama_lengkap: '',
		no_hp: '',
	});

	async function loadData() {
		isLoading = true;
		error = null;

		try {
			// Load admins
			const adminsResponse = await fetch('/api/superadmin/admin-sekolah', {
				credentials: 'include',
			});
			const adminsResult = await adminsResponse.json();

			if (!adminsResponse.ok) {
				throw new Error(adminsResult.message || 'Gagal memuat data admin');
			}

			admins = adminsResult.data || [];

			// Load schools
			const schoolsResponse = await fetch('/api/superadmin/sekolah', {
				credentials: 'include',
			});
			const schoolsResult = await schoolsResponse.json();

			if (!schoolsResponse.ok) {
				throw new Error(schoolsResult.message || 'Gagal memuat data sekolah');
			}

			schools = schoolsResult.data || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Terjadi kesalahan';
		} finally {
			isLoading = false;
		}
	}

	function openAddModal() {
		formData = {
			email: '',
			password: '',
			sekolah_id: '',
			role: 'admin',
			nama_lengkap: '',
			no_hp: '',
		};
		showAddModal = true;
	}

	function openEditModal(admin: Admin) {
		editingAdmin = admin;
		formData = {
			email: admin.email,
			password: '',
			sekolah_id: admin.sekolahId || '',
			role: admin.role,
			nama_lengkap: admin.namaLengkap || '',
			no_hp: admin.noHp || '',
		};
		showEditModal = true;
	}

	async function handleAddSubmit(e: Event) {
		e.preventDefault();

		if (!formData.password) {
			alert('Password harus diisi');
			return;
		}

		try {
			const response = await fetch('/api/superadmin/admin-sekolah', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal menambahkan admin');
			}

			showAddModal = false;
			await loadData();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
		}
	}

	async function handleEditSubmit(e: Event) {
		e.preventDefault();

		if (!editingAdmin) return;

		try {
			const updateData: any = {
				email: formData.email,
				role: formData.role,
				sekolah_id: formData.sekolah_id,
				nama_lengkap: formData.nama_lengkap,
				no_hp: formData.no_hp,
			};

			// Only include password if provided
			if (formData.password) {
				updateData.password = formData.password;
			}

			const response = await fetch(`/api/superadmin/admin-sekolah/${editingAdmin.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(updateData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal memperbarui admin');
			}

			showEditModal = false;
			editingAdmin = null;
			await loadData();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
		}
	}

	async function handleDelete(admin: Admin) {
		if (!confirm(`Yakin ingin menonaktifkan admin "${admin.email}"?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/superadmin/admin-sekolah/${admin.id}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Gagal menonaktifkan admin');
			}

			await loadData();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Terjadi kesalahan');
		}
	}

	// Load on mount
	onMount(loadData);
</script>

<div>
	<!-- Header -->
	<div class="flex justify-between items-center mb-6">
		<div>
			<h2 class="text-2xl font-bold text-[#f1f5f9]">Kelola Admin Sekolah</h2>
			<p class="text-sm text-[#64748b] mt-1">Tambah, edit, dan nonaktifkan admin sekolah</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-medium hover:from-[#2563eb] hover:to-[#1d4ed8] transition-all"
		>
			<Plus size={18} />
			Tambah Admin
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
			<p class="mt-4 text-[#64748b]">Memuat data admin...</p>
		</div>
	{:else if admins.length === 0}
		<div class="text-center py-12 bg-[#1e293b] rounded-2xl border border-[#334155]">
			<Users size={48} class="mx-auto text-[#64748b] mb-4" />
			<h3 class="text-lg font-semibold text-[#f1f5f9]">Belum ada admin</h3>
			<p class="text-sm text-[#64748b] mt-2">Klik tombol "Tambah Admin" untuk menambahkan admin baru</p>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each admins as admin}
				<div class="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 hover:border-[#3b82f6] transition-colors">
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-semibold">
									{(admin.email || 'A')[0].toUpperCase()}
								</div>
								<div>
									<h3 class="text-lg font-bold text-[#f1f5f9]">{admin.email}</h3>
									<div class="flex items-center gap-2">
										<span class="px-2 py-1 rounded-lg text-xs font-medium {admin.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
											{admin.isActive ? 'Aktif' : 'Nonaktif'}
										</span>
										<span class="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
											{admin.role}
										</span>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#334155]">
								{#if admin.sekolahNama}
									<div class="flex items-center gap-2">
										<School size={16} class="text-[#64748b]" />
										<div>
											<p class="text-xs text-[#64748b]">Sekolah</p>
											<p class="text-sm text-[#94a3b8]">{admin.sekolahNama}</p>
										</div>
									</div>
								{/if}
								{#if admin.namaLengkap}
									<div>
										<p class="text-xs text-[#64748b]">Nama Lengkap</p>
										<p class="text-sm text-[#94a3b8]">{admin.namaLengkap}</p>
									</div>
								{/if}
								{#if admin.noHp}
									<div>
										<p class="text-xs text-[#64748b]">No. HP</p>
										<p class="text-sm text-[#94a3b8] font-mono">{admin.noHp}</p>
									</div>
								{/if}
								<div>
									<p class="text-xs text-[#64748b]">Terdaftar</p>
									<p class="text-sm text-[#94a3b8]">{new Date(admin.createdAt).toLocaleDateString('id-ID')}</p>
								</div>
							</div>
						</div>

						<div class="flex gap-2 ml-4">
							<button
								onclick={() => openEditModal(admin)}
								class="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
								title="Edit"
							>
								<Edit size={18} />
							</button>
							<button
								onclick={() => handleDelete(admin)}
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
		<Modal title="Tambah Admin Sekolah Baru" onClose={() => showAddModal = false}>
			<form onsubmit={handleAddSubmit} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Email *</label>
					<input
						type="email"
						bind:value={formData.email}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="admin@sekolah.com"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Password *</label>
					<input
						type="password"
						bind:value={formData.password}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Minimal 6 karakter"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Sekolah *</label>
					<select
						bind:value={formData.sekolah_id}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					>
						<option value="">Pilih Sekolah</option>
						{#each schools as school}
							<option value={school.id}>{school.nama}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Role</label>
					<select
						bind:value={formData.role}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					>
						<option value="admin">Admin</option>
						<option value="operator">Operator</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Nama Lengkap</label>
					<input
						type="text"
						bind:value={formData.nama_lengkap}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Nama lengkap admin"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">No. HP</label>
					<input
						type="text"
						bind:value={formData.no_hp}
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
						Tambah Admin
					</button>
				</div>
			</form>
		</Modal>
	{/if}

	<!-- Edit Modal -->
	{#if showEditModal && editingAdmin}
		<Modal title="Edit Admin Sekolah" onClose={() => { showEditModal = false; editingAdmin = null; }}>
			<form onsubmit={handleEditSubmit} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Email *</label>
					<input
						type="email"
						bind:value={formData.email}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Password Baru (kosongkan jika tidak diubah)</label>
					<input
						type="password"
						bind:value={formData.password}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
						placeholder="Minimal 6 karakter"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Sekolah *</label>
					<select
						bind:value={formData.sekolah_id}
						required
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					>
						<option value="">Pilih Sekolah</option>
						{#each schools as school}
							<option value={school.id}>{school.nama}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Role</label>
					<select
						bind:value={formData.role}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					>
						<option value="admin">Admin</option>
						<option value="operator">Operator</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">Nama Lengkap</label>
					<input
						type="text"
						bind:value={formData.nama_lengkap}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-[#94a3b8] mb-2">No. HP</label>
					<input
						type="text"
						bind:value={formData.no_hp}
						class="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
					/>
				</div>
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={() => { showEditModal = false; editingAdmin = null; }}
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
