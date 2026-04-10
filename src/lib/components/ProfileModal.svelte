<script lang="ts">
	import { X, User, Phone, Image as ImageIcon, Save, Mail } from 'lucide-svelte';
	import { authStore, updateProfile } from '$lib/auth-store';
	import type { User as UserType } from '$lib/auth-store';
	import Spinner from '$lib/components/Spinner.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let user = $derived($authStore.user);
	let isSaving = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);

	// Form state
	let nama_lengkap = $state('');
	let no_hp = $state('');
	let foto_url = $state('');

	// Reset form when modal opens
	$effect(() => {
		if (isOpen && user) {
			nama_lengkap = user.nama_lengkap || '';
			no_hp = user.no_hp || '';
			foto_url = user.foto_url || '';
			error = null;
			success = null;
		}
	});

	async function handleSave() {
		isSaving = true;
		error = null;
		success = null;

		try {
			await updateProfile({
				nama_lengkap: nama_lengkap || null,
				no_hp: no_hp || null,
				foto_url: foto_url || null,
			});
			success = 'Profil berhasil diupdate!';
			setTimeout(() => {
				onClose();
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal mengupdate profil';
		} finally {
			isSaving = false;
		}
	}

	function handleClose() {
		error = null;
		success = null;
		onClose();
	}
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		onclick={handleClose}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- Modal Content -->
		<div
			class="relative bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md border border-[#334155] overflow-hidden"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-[#334155]">
				<h2 id="modal-title" class="text-xl font-semibold text-[#f1f5f9]">
					Edit Profil Admin
				</h2>
				<button
					onclick={handleClose}
					class="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors p-1 hover:bg-[#334155] rounded-lg"
					aria-label="Tutup"
				>
					<X size={20} />
				</button>
			</div>

			<!-- Body -->
			<div class="p-6 space-y-5">
				<!-- Avatar Preview -->
				<div class="flex justify-center mb-6">
					<div class="relative">
						{#if foto_url}
							<img
								src={foto_url}
								alt="Foto Profil"
								class="w-24 h-24 rounded-full object-cover border-4 border-[#10b981] shadow-lg"
								onerror={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nama_lengkap || user?.username || 'Admin') + '&background=10b981&color=fff&size=128';
								}}
							/>
						{:else}
							<div class="w-24 h-24 rounded-full bg-[#10b981] flex items-center justify-center border-4 border-[#059669] shadow-lg">
								<span class="text-3xl font-bold text-white">
									{(nama_lengkap || user?.username || 'A').charAt(0).toUpperCase()}
								</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Nama Lengkap -->
				<div>
					<label for="nama_lengkap" class="flex items-center gap-2 text-sm font-medium text-[#94a3b8] mb-2">
						<User size={16} />
						Nama Lengkap
					</label>
					<input
						id="nama_lengkap"
						type="text"
						bind:value={nama_lengkap}
						placeholder="Masukkan nama lengkap"
						class="w-full px-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
					/>
				</div>

				<!-- Email (Read-only) -->
				<div>
					<label for="email" class="flex items-center gap-2 text-sm font-medium text-[#94a3b8] mb-2">
						<Mail size={16} />
						Email
					</label>
					<input
						id="email"
						type="email"
						value={user?.email || ''}
						disabled
						class="w-full px-4 py-2.5 bg-[#1e293b] border border-[#334155] rounded-xl text-[#64748b] cursor-not-allowed"
					/>
					<p class="text-xs text-[#64748b] mt-1">Email tidak dapat diubah</p>
				</div>

				<!-- No HP -->
				<div>
					<label for="no_hp" class="flex items-center gap-2 text-sm font-medium text-[#94a3b8] mb-2">
						<Phone size={16} />
						Nomor WhatsApp
					</label>
					<input
						id="no_hp"
						type="tel"
						bind:value={no_hp}
						placeholder="08123456789"
						class="w-full px-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
					/>
				</div>

				<!-- Foto URL -->
				<div>
					<label for="foto_url" class="flex items-center gap-2 text-sm font-medium text-[#94a3b8] mb-2">
						<ImageIcon size={16} />
						URL Foto Profil
					</label>
					<input
						id="foto_url"
						type="url"
						bind:value={foto_url}
						placeholder="https://example.com/foto.jpg"
						class="w-full px-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
					/>
					<p class="text-xs text-[#64748b] mt-1">Kosongkan untuk menggunakan inisial otomatis</p>
				</div>

				<!-- Alert Messages -->
				{#if error}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{error}
					</div>
				{/if}

				{#if success}
					<div class="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
						{success}
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="flex gap-3 p-6 border-t border-[#334155] bg-[#0f172a]/50">
				<button
					onclick={handleClose}
					disabled={isSaving}
					class="flex-1 px-4 py-2.5 bg-[#334155] hover:bg-[#475569] text-[#f1f5f9] rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Batal
				</button>
				<button
					onclick={handleSave}
					disabled={isSaving}
					class="flex-1 px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isSaving}
						<Spinner size="sm" color="white" />
						Menyimpan...
					{:else}
						<Save size={18} />
						Simpan Perubahan
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
