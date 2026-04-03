<script lang="ts">
	import { Edit2, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { deleteStudent } from '$lib/stores';
	import { siswaApi } from '$lib/api';
	import type { SiswaData } from '$lib/api';
	import { theme } from '$lib/stores';

	let isDeleting = $state(false);
	let currentTheme = $derived($theme);
	
	// Pagination state
	let searchQuery = $state('');
	let currentPage = $state(1);
	let pagination = $state({ page: 1, limit: 20, total: 0, hasMore: false, totalPages: 0 });
	let students = $state<SiswaData[]>([]);
	let isLoading = $state(false);
	let searchTimeout: any = null;

	// Props Svelte 5
	interface Props {
		onEdit?: (student: SiswaData) => void;
		refreshKey?: number;
		cardBg?: string;
		cardBorder?: string;
		tableHeaderBg?: string;
		tableHeaderBorder?: string;
		tableRowBorder?: string;
		tableRowHover?: string;
		textSecondary?: string;
		textMuted?: string;
		badgeBg?: string;
		badgeText?: string;
	}

	let {
		onEdit,
		refreshKey = 0,
		cardBg = currentTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white',
		cardBorder = currentTheme === 'dark' ? 'border-[#334155]' : 'border-slate-200',
		tableHeaderBg = currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-100',
		tableHeaderBorder = currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-200',
		tableRowBorder = currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-100',
		tableRowHover = currentTheme === 'dark' ? 'hover:bg-[#334155]/30' : 'hover:bg-slate-50',
		textSecondary = currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700',
		textMuted = currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500',
		badgeBg = currentTheme === 'dark' ? 'bg-[#334155]' : 'bg-slate-200',
		badgeText = currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-600'
	}: Props = $props();

	// Fetch students function
	async function fetchStudents(query = '', page = 1) {
		isLoading = true;
		try {
			const result = await siswaApi.search({
				query: query || undefined,
				page,
				limit: 20
			});
			
			students = result.data;
			pagination = result.pagination;
		} catch (error) {
			console.error('Failed to fetch students:', error);
			students = [];
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

	// Initial load and external refresh trigger
	$effect(() => {
		refreshKey;
		fetchStudents(searchQuery, currentPage);
	});

	async function handleDeleteStudent(id: string) {
		if (confirm('Yakin ingin menghapus data siswa ini?')) {
			isDeleting = true;
			try {
				await deleteStudent(id);
				// Refresh current page after delete
				fetchStudents(searchQuery, currentPage);
			} catch (error) {
				alert('Gagal menghapus siswa: ' + (error instanceof Error ? error.message : error));
			} finally {
				isDeleting = false;
			}
		}
	}
</script>

<div class="rounded-2xl overflow-hidden {cardBg} {cardBorder}">
	<!-- Search Bar -->
	<div class="p-5 border-b {cardBorder}">
		<div class="flex items-center justify-between gap-4 flex-wrap">
			<h2 class="text-sm font-semibold {textMuted}">👥 Daftar Identitas Siswa</h2>
			<div class="flex items-center gap-2">
				<span class="text-xs px-2.5 py-1 rounded-full {badgeBg} {badgeText}">
					{pagination.total} siswa
				</span>
				{#if pagination.totalPages > 1}
					<span class="text-xs {textMuted}">
						(Halaman {pagination.page}/{pagination.totalPages})
					</span>
				{/if}
			</div>
		</div>
		<div class="mt-3 relative">
			<input
				type="text"
				value={searchQuery}
				oninput={(e) => handleSearchInput(e.currentTarget.value)}
				placeholder="Cari nama, nomor akun, atau kelas..."
				class="w-full pl-4 pr-12 py-2.5 rounded-xl text-sm {currentTheme === 'dark' ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] placeholder:text-[#475569]' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'} focus:outline-none focus:ring-2 focus:ring-[#10b981] border"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => { searchQuery = ''; handleSearchInput(''); }}
					class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[#334155] rounded-full {textMuted}"
				>
					<Users size={14} />
				</button>
			{/if}
		</div>
	</div>

	{#if isLoading}
		<div class="py-12 text-center">
			<div class="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-[#10b981]/20 border-t-[#10b981] animate-spin"></div>
			<p class="text-sm {textMuted}">Memuat data...</p>
		</div>
	{:else if students.length > 0}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="{tableHeaderBg}">
						<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">No. Akun</th>
						<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Nama Siswa</th>
						<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Kelas</th>
						<th class="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each students as student (student.id)}
						<tr class="border-t {tableRowBorder} transition-all duration-150 {tableRowHover}">
							<td class="px-5 py-3 text-sm font-medium {textSecondary}">#{student.nomorAkun}</td>
							<td class="px-5 py-3 text-sm {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{student.nama}</td>
							<td class="px-5 py-3 text-sm {textSecondary}">{student.kelas}</td>
							<td class="px-5 py-3 text-center flex gap-1 justify-center">
								<button
									onclick={() => onEdit?.(student)}
									class="p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
									title="Edit"
								>
									<Edit2 size={15} color="#3b82f6" />
								</button>
								<button
									onclick={() => handleDeleteStudent(student.id)}
									class="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
									title="Hapus"
									disabled={isDeleting}
								>
									<Trash2 size={15} color="#ef4444" />
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
			<div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center {currentTheme === 'dark' ? 'bg-slate-800/10' : 'bg-slate-100'}">
				<Users size={28} color="#475569" />
			</div>
			<p class="text-sm {textMuted}">
				{searchQuery ? `Tidak ditemukan siswa dengan "${searchQuery}"` : 'Belum ada data siswa'}
			</p>
			<p class="text-xs mt-1 {currentTheme === 'dark' ? 'text-[#334155]' : 'text-slate-400'}">
				{searchQuery ? 'Coba kata kunci lain' : 'Tambahkan identitas siswa melalui form di atas'}
			</p>
		</div>
	{/if}
</div>
