/**
 * API Service for SvelteKit Backend
 * Now using relative paths to /api instead of external Flask server
 */

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const url = `/api${endpoint}`;

	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
		
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || `API Error: ${response.status}`);
	}

	return data;
}

/**
 * Generic fetch wrapper for blob responses (file downloads)
 */
async function fetchBlob(endpoint: string, options?: RequestInit): Promise<Blob> {
	const url = `/api${endpoint}`;

	const response = await fetch(url, {
		...options,
		
	});

	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.message || `API Error: ${response.status}`);
	}

	return await response.blob();
}

// ==================== SISWA API ====================

export interface SiswaData {
	id: string;
	nomorAkun: string;
	nama: string;
	kelas: string;
	createdAt: string;
	updatedAt: string | null;
}

export const siswaApi = {
	/** Get all siswa */
	getAll: async (): Promise<SiswaData[]> => {
		const response = await fetchApi<{ success: boolean; data: SiswaData[] }>('/siswa');
		return response.data;
	},

	/** Search siswa with pagination */
	search: async (options: {
		query?: string;
		page?: number;
		limit?: number;
	}): Promise<{
		data: SiswaData[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			hasMore: boolean;
			totalPages: number;
		};
	}> => {
		const params = new URLSearchParams();
		if (options.query) params.set('q', options.query);
		if (options.page) params.set('page', options.page.toString());
		if (options.limit) params.set('limit', options.limit.toString());

		const response = await fetchApi<{
			success: boolean;
			data: SiswaData[];
			pagination: {
				page: number;
				limit: number;
				total: number;
				hasMore: boolean;
				totalPages: number;
			};
		}>(`/siswa/search?${params.toString()}`);
		return {
			data: response.data,
			pagination: response.pagination
		};
	},

	/** Get siswa by ID */
	getById: async (id: string): Promise<SiswaData> => {
		const response = await fetchApi<{ success: boolean; data: SiswaData }>(`/siswa/${id}`);
		return response.data;
	},

	/** Create new siswa */
	create: async (data: { nomorAkun: string; nama: string; kelas: string }): Promise<SiswaData> => {
		const response = await fetchApi<{ success: boolean; data: SiswaData }>('/siswa', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		return response.data;
	},

	/** Update siswa */
	update: async (
		id: string,
		data: Partial<{ nomorAkun: string; nama: string; kelas: string }>
	): Promise<SiswaData> => {
		const response = await fetchApi<{ success: boolean; data: SiswaData }>(`/siswa/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
		return response.data;
	},

	/** Delete siswa */
	delete: async (id: string): Promise<void> => {
		await fetchApi(`/siswa/${id}`, { method: 'DELETE' });
	},

	/** Upload Excel file */
	uploadExcel: async (file: File): Promise<{ success: number; duplicate: number; failed: number; errors: string[] }> => {
		const formData = new FormData();
		formData.append('file', file);

		const url = `/api/siswa/upload-excel`;
		const response = await fetch(url, {
			method: 'POST',
			body: formData
		});

		const text = await response.text();
		let data: any;
		try {
			data = text ? JSON.parse(text) : {};
		} catch (parseError) {
			throw new Error(
				`Upload Excel gagal: response tidak valid JSON (status ${response.status}). Response body: ${text.substring(0, 300)}`
			);
		}

		if (!response.ok) {
			throw new Error(data?.message || `API Error: ${response.status}`);
		}

		return data.data;
	},

	/** Download template Excel */
	downloadTemplate: async (): Promise<Blob> => {
		return await fetchBlob('/siswa/download-template');
	},
};

// ==================== TRANSAKSI API ====================

export interface TransaksiData {
	id: string;
	tanggal: string;
	keterangan: string;
	kategori: string;
	jenis: 'masuk' | 'keluar';
	jumlah: number;
	metode: 'tunai' | 'transfer';
	siswaId: string | null;
	namaPengirim: string | null;
	kelasPengirim: string | null;
	nomorAkun: string | null;
	bulan: string | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface TransaksiFilters {
	kategori?: string;
	jenis?: string;
	metode?: string;
	tanggal_from?: string;
	tanggal_to?: string;
	limit?: number;
}

export const transaksiApi = {
	/** Get all transaksi with optional filters */
	getAll: async (filters?: TransaksiFilters): Promise<TransaksiData[]> => {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					params.append(key, value.toString());
				}
			});
		}
		const queryString = params.toString();
		const endpoint = queryString ? `/transaksi?${queryString}` : '/transaksi';
		const response = await fetchApi<{ success: boolean; data: TransaksiData[] }>(endpoint);
		return response.data;
	},

	/** Get transaksi by ID */
	getById: async (id: string): Promise<TransaksiData> => {
		const response = await fetchApi<{ success: boolean; data: TransaksiData }>(`/transaksi/${id}`);
		return response.data;
	},

	/** Create new transaksi */
	create: async (data: {
		tanggal: string;
		keterangan: string;
		kategori: string;
		jenis: 'masuk' | 'keluar';
		jumlah: number;
		metode: 'tunai' | 'transfer';
		siswaId?: string | null;
		namaPengirim?: string | null;
		kelasPengirim?: string | null;
		nomorAkun?: string | null;
		bulan?: string | null;
	}): Promise<TransaksiData> => {
		const response = await fetchApi<{ success: boolean; data: TransaksiData }>('/transaksi', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		return response.data;
	},

	/** Update transaksi */
	update: async (id: string, data: Partial<TransaksiData>): Promise<TransaksiData> => {
		const response = await fetchApi<{ success: boolean; data: TransaksiData }>(`/transaksi/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
		return response.data;
	},

	/** Delete transaksi */
	delete: async (id: string): Promise<void> => {
		await fetchApi(`/transaksi/${id}`, { method: 'DELETE' });
	},

	/** Get statistics */
	getStats: async (): Promise<{
		totalInfaq: number;
		totalJariyah: number;
		totalKeluar: number;
		saldo: number;
	}> => {
		const response = await fetchApi<{ success: boolean; data: any }>('/transaksi/stats');
		return response.data;
	},

	/** Get sender summaries */
	getSenders: async (): Promise<Array<{
		id: string;
		nama: string;
		kelas: string;
		nomorAkun: string;
		totalInfaq: number;
		totalJariyah: number;
		totalDonasi: number;
	}>> => {
		const response = await fetchApi<{ success: boolean; data: any[] }>('/transaksi/senders');
		return response.data;
	},
};

// ==================== KATEGORI API ====================

export interface KategoriData {
	id: string;
	nama: string;
	ikon: string | null;
	warna: string | null;
}

export const kategoriApi = {
	/** Get all kategori */
	getAll: async (): Promise<KategoriData[]> => {
		const response = await fetchApi<{ success: boolean; data: KategoriData[] }>('/kategori');
		return response.data;
	},

	/** Create new kategori */
	create: async (data: { nama: string; ikon?: string; warna?: string }): Promise<KategoriData> => {
		const response = await fetchApi<{ success: boolean; data: KategoriData }>('/kategori', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		return response.data;
	},

	/** Delete kategori */
	delete: async (id: string): Promise<void> => {
		await fetchApi(`/kategori/${id}`, { method: 'DELETE' });
	},
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async (): Promise<boolean> => {
	try {
		const response = await fetchApi<{ success: boolean }>('/health');
		return response.success;
	} catch {
		return false;
	}
};
