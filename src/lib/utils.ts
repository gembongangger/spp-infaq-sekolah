export function formatRupiah(num: number): string {
	if (!num || num === 0) return 'Rp 0';
	return 'Rp ' + Number(num).toLocaleString('id-ID');
}

export function formatDate(dateStr: string): string {
	if (!dateStr) return '-';
	const d = new Date(dateStr);
	return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateLong(dateStr: string): string {
	if (!dateStr) return '-';
	const d = new Date(dateStr);
	return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatMonth(monthStr: string): string {
	if (!monthStr || monthStr.length < 7) return '-';
	const [year, month] = monthStr.split('-');
	const date = new Date(parseInt(year), parseInt(month) - 1);
	return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

export function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}
