import { writable, derived, readable } from 'svelte/store';
import { siswaApi, transaksiApi, kategoriApi, type SiswaData, type TransaksiData, type KategoriData } from './api';
import { Jenis, Metode } from './types';

// Store for API connection status
export const apiConnected = writable<boolean>(false);

// Check API connection on mount
export const apiStatus = readable<boolean>(false, (set) => {
	async function checkConnection() {
		try {
			const response = await fetch('http://localhost:5000/api/health');
			const data = await response.json();
			set(data.success);
			apiConnected.set(data.success);
		} catch {
			set(false);
			apiConnected.set(false);
		}
	}
	
	checkConnection();
	// Recheck every 30 seconds
	const interval = setInterval(checkConnection, 30000);
	
	return () => clearInterval(interval);
});

// Siswa store - fetches from API
export const students = writable<SiswaData[]>([]);
export const studentsLoading = writable<boolean>(false);
export const studentsError = writable<string | null>(null);

export async function loadStudents() {
	studentsLoading.set(true);
	studentsError.set(null);
	try {
		const data = await siswaApi.getAll();
		students.set(data);
	} catch (error) {
		studentsError.set(error instanceof Error ? error.message : 'Failed to load students');
	} finally {
		studentsLoading.set(false);
	}
}

// Transaksi store - fetches from API
export const transactions = writable<TransaksiData[]>([]);
export const transactionsLoading = writable<boolean>(false);
export const transactionsError = writable<string | null>(null);

export async function loadTransactions(filters?: any) {
	transactionsLoading.set(true);
	transactionsError.set(null);
	try {
		const data = await transaksiApi.getAll(filters);
		transactions.set(data);
	} catch (error) {
		transactionsError.set(error instanceof Error ? error.message : 'Failed to load transactions');
	} finally {
		transactionsLoading.set(false);
	}
}

// Kategori store
export const categories = writable<KategoriData[]>([]);

export async function loadKategori() {
	try {
		const data = await kategoriApi.getAll();
		categories.set(data);
	} catch (error) {
		console.error('Failed to load categories:', error);
	}
}

export async function addKategori(data: { nama: string; ikon?: string; warna?: string }) {
	try {
		const newKategori = await kategoriApi.create(data);
		categories.update((cats) => [...cats, newKategori]);
		return newKategori;
	} catch (error) {
		throw error;
	}
}

export async function deleteKategori(id: string) {
	try {
		await kategoriApi.delete(id);
		categories.update((cats) => cats.filter((c) => c.id !== id));
	} catch (error) {
		throw error;
	}
}

// Stats store - fetches from API
export const stats = writable({
	totalInfaq: 0,
	totalJariyah: 0,
	totalKeluar: 0,
	saldo: 0
});
export const statsLoading = writable<boolean>(false);

export async function loadStats() {
	statsLoading.set(true);
	try {
		const data = await transaksiApi.getStats();
		stats.set(data);
	} catch (error) {
		console.error('Failed to load stats:', error);
	} finally {
		statsLoading.set(false);
	}
}

// Senders store - fetches from API
export const senderSummaries = writable<Array<{
	id: string;
	nama: string;
	kelas: string;
	nomorAkun: string;
	totalInfaq: number;
	totalJariyah: number;
	totalDonasi: number;
}>>([]);

export async function loadSenders() {
	try {
		const data = await transaksiApi.getSenders();
		senderSummaries.set(data);
	} catch (error) {
		console.error('Failed to load senders:', error);
	}
}

// Active tab store (local state)
export const activeTab = writable<string>('dashboard');

// Theme store (local state with localStorage persistence)
export const theme = writable<'dark' | 'light'>('dark');

// Helper functions for CRUD operations
export async function addStudent(data: { nomorAkun: string; nama: string; kelas: string }) {
	try {
		const newStudent = await siswaApi.create(data);
		students.update((students) => [...students, newStudent]);
		return newStudent;
	} catch (error) {
		throw error;
	}
}

export async function updateStudent(id: string, data: { nomorAkun?: string; nama?: string; kelas?: string }) {
	try {
		const updatedStudent = await siswaApi.update(id, data);
		students.update((students) => 
			students.map((s) => (s.id === id ? updatedStudent : s))
		);
		return updatedStudent;
	} catch (error) {
		throw error;
	}
}

export async function deleteStudent(id: string) {
	try {
		await siswaApi.delete(id);
		students.update((students) => students.filter((s) => s.id !== id));
	} catch (error) {
		throw error;
	}
}

export async function uploadStudentExcel(file: File) {
	try {
		const result = await siswaApi.uploadExcel(file);
		// Reload students after upload
		await loadStudents();
		return result;
	} catch (error) {
		throw error;
	}
}

export async function addTransaction(data: any) {
	try {
		const newTransaction = await transaksiApi.create(data);
		transactions.update((t) => [newTransaction, ...t]);
		// Reload stats after adding transaction
		await loadStats();
		await loadSenders();
		return newTransaction;
	} catch (error) {
		throw error;
	}
}

export async function updateTransaction(id: string, data: any) {
	try {
		const updatedTransaction = await transaksiApi.update(id, data);
		transactions.update((t) => 
			t.map((item) => (item.id === id ? updatedTransaction : item))
		);
		// Reload stats after updating transaction
		await loadStats();
		await loadSenders();
		return updatedTransaction;
	} catch (error) {
		throw error;
	}
}

export async function deleteTransaction(id: string) {
	try {
		await transaksiApi.delete(id);
		transactions.update((t) => t.filter((item) => item.id !== id));
		// Reload stats after deleting transaction
		await loadStats();
		await loadSenders();
	} catch (error) {
		throw error;
	}
}
