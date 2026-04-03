/**
 * Kategori Model
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
	getAll(): Kategori[] {
		const stmt = db.prepare('SELECT * FROM kategori ORDER BY nama');
		return stmt.all() as Kategori[];
	},

	/** Get kategori by sekolah_id */
	getBySekolah(sekolahId: string): Kategori[] {
		const stmt = db.prepare('SELECT * FROM kategori WHERE sekolah_id = ? ORDER BY nama');
		return stmt.all(sekolahId) as Kategori[];
	},

	/** Get kategori by ID */
	findById(id: string): Kategori | null {
		const stmt = db.prepare('SELECT * FROM kategori WHERE id = ?');
		return stmt.get(id) as Kategori | null;
	},

	/** Get kategori by nama */
	findByNama(nama: string): Kategori | null {
		const stmt = db.prepare('SELECT * FROM kategori WHERE nama = ?');
		return stmt.get(nama) as Kategori | null;
	},

	/** Create new kategori */
	create(data: { nama: string; ikon?: string; warna?: string; sekolah_id?: string | null }): Kategori {
		const id = uuidv4();
		const ikon = data.ikon || 'Heart';
		const warna = data.warna || '#10b981';
		const sekolah_id = data.sekolah_id || null;

		const stmt = db.prepare(`
			INSERT INTO kategori (id, nama, ikon, warna, sekolah_id)
			VALUES (?, ?, ?, ?, ?)
		`);

		stmt.run(id, data.nama, ikon, warna, sekolah_id);

		return this.findById(id)!;
	},

	/** Delete kategori */
	delete(id: string): boolean {
		const stmt = db.prepare('DELETE FROM kategori WHERE id = ?');
		const result = stmt.run(id);
		return result.changes > 0;
	},
};
