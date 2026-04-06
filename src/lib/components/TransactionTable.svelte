<script lang="ts">
	import { Edit2, Trash2 } from 'lucide-svelte';
	import { deleteTransaction, categories, transactions } from '$lib/stores';
	import { formatDate, formatRupiah, formatMonth } from '$lib/utils';
	import { Jenis, type TransaksiData } from '$lib/types';
	import { theme } from '$lib/stores';

	interface Props {
		transactions?: TransaksiData[];
		limit?: number;
		showActions?: boolean;
		onEdit?: (transaction: TransaksiData) => void;
		tableHeaderBg?: string;
		tableHeaderBorder?: string;
		tableRowBorder?: string;
		tableRowHover?: string;
		textSecondary?: string;
		textMuted?: string;
	}

	let { 
		transactions: propTransactions, 
		limit, 
		showActions = true, 
		onEdit,
		tableHeaderBg,
		tableHeaderBorder,
		tableRowBorder,
		tableRowHover,
		textSecondary,
		textMuted
	}: Props = $props();
	
	let allCategories = $derived($categories);
	let isDeleting = $state(false);
	let currentTheme = $derived($theme);
	
	// Set defaults if not provided
	if (!tableHeaderBg) tableHeaderBg = currentTheme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-100';
	if (!tableHeaderBorder) tableHeaderBorder = currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-200';
	if (!tableRowBorder) tableRowBorder = currentTheme === 'dark' ? 'border-[#1e293b]' : 'border-slate-100';
	if (!tableRowHover) tableRowHover = currentTheme === 'dark' ? 'hover:bg-[#334155]/30' : 'hover:bg-slate-50';
	if (!textSecondary) textSecondary = currentTheme === 'dark' ? 'text-[#cbd5e1]' : 'text-slate-700';
	if (!textMuted) textMuted = currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-500';

	// Use provided transactions or fallback to store
	let displayTransactions = $derived(
		propTransactions 
			? [...propTransactions].sort((a, b) => b.tanggal.localeCompare(a.tanggal))
			: $transactions.sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, limit)
	);

	// Helper function to get category color
	function getCategoryColor(kategoriName: string): string {
		const cat = allCategories.find(c => c.nama === kategoriName);
		return cat?.warna || getDefaultColor(kategoriName);
	}

	function getDefaultColor(kategoriName: string): string {
		const name = kategoriName.toLowerCase();
		if (name === 'infaq') return '#10b981';
		if (name === 'jariyah') return '#a855f7';
		if (name === 'penarikan') return '#ef4444';
		return '#64748b';
	}

	function getCategoryEmoji(kategoriName: string): string {
		const name = kategoriName.toLowerCase();
		if (name === 'infaq') return '💚';
		if (name === 'jariyah') return '💜';
		if (name === 'penarikan') return '💸';
		return '📁';
	}

	async function handleDeleteTransaction(id: string) {
		if (confirm('Yakin ingin menghapus transaksi ini?')) {
			isDeleting = true;
			try {
				await deleteTransaction(id);
			} catch (error) {
				alert('Gagal menghapus transaksi: ' + (error instanceof Error ? error.message : error));
			} finally {
				isDeleting = false;
			}
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="{tableHeaderBg}">
				<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Tanggal</th>
				<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Bulan</th>
				<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Keterangan</th>
				<th class="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Kategori</th>
				<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#10b981]">Dana In</th>
				<th class="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-[#ef4444]">Dana Out</th>
				<th class="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Metode</th>
				<th class="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Pengirim</th>
				{#if showActions}
					<th class="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider {textMuted}">Aksi</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each displayTransactions as record (record.id)}
				<tr class="border-t {tableRowBorder} transition-all duration-150 {tableRowHover}">
					<td class="px-5 py-3 text-sm {textSecondary}">{formatDate(record.tanggal)}</td>
					<td class="px-5 py-3 text-sm {textSecondary}">
						{#if record.kategori === 'infaq' && record.bulan}
							<span class="px-2 py-1 rounded-md bg-[#10b981]/10 text-[#10b981] text-xs font-medium">
								{formatMonth(record.bulan)}
							</span>
						{:else}
							<span class="{textMuted}">-</span>
						{/if}
					</td>
					<td class="px-5 py-3 text-sm {currentTheme === 'dark' ? 'text-[#f1f5f9]' : 'text-slate-900'}">{record.keterangan}</td>
					<td
						class="px-5 py-3 text-sm text-center font-medium"
						style="color: {getCategoryColor(record.kategori)};"
					>
						{getCategoryEmoji(record.kategori)} {record.kategori}
					</td>
					<td class="px-5 py-3 text-sm text-right font-medium text-[#10b981]">
						{record.jenis === Jenis.MASUK ? formatRupiah(record.jumlah) : '-'}
					</td>
					<td class="px-5 py-3 text-sm text-right font-medium text-[#ef4444]">
						{record.jenis === Jenis.KELUAR ? formatRupiah(record.jumlah) : '-'}
					</td>
					<td class="px-5 py-3 text-sm text-center {textSecondary}">
						{record.metode === 'transfer' ? '🏦 Transfer' : '💵 Tunai'}
					</td>
					<td class="px-5 py-3 text-sm {textSecondary}">
						{record.namaPengirim ? `${record.namaPengirim} (${record.kelasPengirim})` : '-'}
					</td>
					{#if showActions}
						<td class="px-5 py-3 text-center flex gap-1 justify-center">
							<button
								onclick={() => onEdit?.(record)}
								class="p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
								title="Edit"
							>
								<Edit2 size={15} color="#3b82f6" />
							</button>
							<button
								onclick={() => handleDeleteTransaction(record.id)}
								class="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
								title="Hapus"
								disabled={isDeleting}
							>
								<Trash2 size={15} color="#ef4444" />
							</button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if displayTransactions.length === 0}
	<div class="py-12 text-center">
		<p class="text-sm {textMuted}">Belum ada data transaksi</p>
	</div>
{/if}
