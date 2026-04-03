/**
 * Kategori Model (Async for Turso/LibSQL)
 */
import db from '$lib/server/db';
import { v4 as uuidv4 } from 'uuid';

export interface Kategori {
	id: string;
	nama: string;
	ikon: string | null;
	warna: string | null;
	sekolah_id: string | null;
}

export interface KategoriDTO {
	id: string;
	nama: string;
	ikon: string | null;
	warna: string | null;
	sekolahId: string | null;
}

export const Kategori = {
	/** Convert raw DB row to DTO */
	toDTO(kategori: Kategori): KategoriDTO {
		return {
			id: kategori.id,
			nama: kategori.nama,
			ikon: kategori.ikon,
			warna: kategori.warna,
			sekolahId: kategori.sekolah_id || null,
		};
	},

	/** Get all kategori */
	async getAll(): Promise<Kategori[]> {
		const result = await db.execute('SELECT * FROM kategori ORDER BY nama');
		return result.rows as unknown as Kategori[];
	},

	/** Get kategori by sekolah_id */
	async getBySekolah(sekolahId: string): Promise<Kategori[]> {
		const result = await db.execute({
			sql: 'SELECT * FROM kategori WHERE sekolah_id = ? ORDER BY nama',
			args: [sekolahId]
		});
		return result.rows as unknown as Kategori[];
	},

	/** Get kategori by ID */
	async findById(id: string): Promise<Kategori | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM kategori WHERE id = ?',
			args: [id]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as Kategori;
	},

	/** Get kategori by nama */
	async findByNama(nama: string): Promise<Kategori | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM kategori WHERE nama = ?',
			args: [nama]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as Kategori;
	},

	/** Create new kategori */
	async create(data: { nama: string; ikon?: string; warna?: string; sekolah_id?: string | null }): Promise<Kategori> {
		const id = uuidv4();
		const ikon = data.ikon || 'Heart';
		const warna = data.warna || '#10b981';
		const sekolah_id = data.sekolah_id || null;

		await db.execute({
			sql: `
				INSERT INTO kategori (id, nama, ikon, warna, sekolah_id)
				VALUES (?, ?, ?, ?, ?)
			`,
			args: [id, data.nama, ikon, warna, sekolah_id]
		});

		const kategori = await this.findById(id);
		return kategori!;
	},

	/** Delete kategori */
	async delete(id: string): Promise<boolean> {
		const result = await db.execute({
			sql: 'DELETE FROM kategori WHERE id = ?',
			args: [id]
		});
		return result.rowsAffected > 0;
	},
};
