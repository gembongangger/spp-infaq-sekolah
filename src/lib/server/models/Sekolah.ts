/**
 * Sekolah Model
 * Multi-tenant school management
 */
import db from '$lib/server/db';
import { v4 as uuidv4 } from 'uuid';

export interface Sekolah {
	id: string;
	nama: string;
	kode: string;
	alamat: string | null;
	npsn: string | null;
	nama_kepala: string | null;
	no_hp_kepala: string | null;
	logo_url: string | null;
	is_active: number;
	created_at: string;
	updated_at: string;
}

export interface SekolahDTO {
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
}

export interface SekolahCreateDTO {
	nama: string;
	kode: string;
	alamat?: string | null;
	npsn?: string | null;
	namaKepala?: string | null;
	noHpKepala?: string | null;
	logoUrl?: string | null;
}

export interface SekolahUpdateDTO extends Partial<SekolahCreateDTO> {
	isActive?: boolean;
}

export const Sekolah = {
	/** Convert raw DB row to DTO */
	toDTO(sekolah: Sekolah): SekolahDTO {
		return {
			id: sekolah.id,
			nama: sekolah.nama,
			kode: sekolah.kode,
			alamat: sekolah.alamat,
			npsn: sekolah.npsn,
			namaKepala: sekolah.nama_kepala,
			noHpKepala: sekolah.no_hp_kepala,
			logoUrl: sekolah.logo_url,
			isActive: sekolah.is_active === 1,
			createdAt: sekolah.created_at,
			updatedAt: sekolah.updated_at,
		};
	},

	/** Get all schools */
	getAll(): Sekolah[] {
		const stmt = db.prepare('SELECT * FROM sekolah ORDER BY nama ASC');
		return stmt.all() as Sekolah[];
	},

	/** Get active schools only */
	getActive(): Sekolah[] {
		const stmt = db.prepare('SELECT * FROM sekolah WHERE is_active = 1 ORDER BY nama ASC');
		return stmt.all() as Sekolah[];
	},

	/** Get school by ID */
	findById(id: string): Sekolah | null {
		const stmt = db.prepare('SELECT * FROM sekolah WHERE id = ?');
		return stmt.get(id) as Sekolah | null;
	},

	/** Get school by kode */
	findByKode(kode: string): Sekolah | null {
		const stmt = db.prepare('SELECT * FROM sekolah WHERE kode = ?');
		return stmt.get(kode) as Sekolah | null;
	},

	/** Create new school */
	create(data: SekolahCreateDTO): Sekolah {
		const id = uuidv4();
		const now = new Date().toISOString();

		const stmt = db.prepare(`
			INSERT INTO sekolah (id, nama, kode, alamat, npsn, nama_kepala, no_hp_kepala, logo_url, is_active, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		stmt.run(
			id,
			data.nama,
			data.kode.toUpperCase(),
			data.alamat || null,
			data.npsn || null,
			data.namaKepala || null,
			data.noHpKepala || null,
			data.logoUrl || null,
			1,
			now,
			now
		);

		return this.findById(id)!;
	},

	/** Update school */
	update(id: string, data: SekolahUpdateDTO): Sekolah | null {
		const now = new Date().toISOString();
		const updates: string[] = [];
		const values: any[] = [];

		if (data.nama !== undefined) {
			updates.push('nama = ?');
			values.push(data.nama);
		}
		if (data.kode !== undefined) {
			updates.push('kode = ?');
			values.push(data.kode.toUpperCase());
		}
		if (data.alamat !== undefined) {
			updates.push('alamat = ?');
			values.push(data.alamat);
		}
		if (data.npsn !== undefined) {
			updates.push('npsn = ?');
			values.push(data.npsn);
		}
		if (data.namaKepala !== undefined) {
			updates.push('nama_kepala = ?');
			values.push(data.namaKepala);
		}
		if (data.noHpKepala !== undefined) {
			updates.push('no_hp_kepala = ?');
			values.push(data.noHpKepala);
		}
		if (data.logoUrl !== undefined) {
			updates.push('logo_url = ?');
			values.push(data.logoUrl);
		}
		if (data.isActive !== undefined) {
			updates.push('is_active = ?');
			values.push(data.isActive ? 1 : 0);
		}

		if (updates.length === 0) {
			return this.findById(id);
		}

		updates.push('updated_at = ?');
		values.push(now);
		values.push(id);

		const stmt = db.prepare(`
			UPDATE sekolah
			SET ${updates.join(', ')}
			WHERE id = ?
		`);

		stmt.run(...values);

		return this.findById(id);
	},

	/** Delete school (soft delete by setting is_active = 0) */
	softDelete(id: string): boolean {
		const now = new Date().toISOString();
		const stmt = db.prepare(`
			UPDATE sekolah
			SET is_active = 0, updated_at = ?
			WHERE id = ?
		`);
		const result = stmt.run(now, id);
		return result.changes > 0;
	},

	/** Hard delete school (use with caution) */
	delete(id: string): boolean {
		const stmt = db.prepare('DELETE FROM sekolah WHERE id = ?');
		const result = stmt.run(id);
		return result.changes > 0;
	},

	/** Get school statistics */
	getStats(sekolahId: string): {
		totalUsers: number;
		totalSiswa: number;
		totalTransaksi: number;
		totalKategori: number;
	} {
		const totalUsers = db.prepare(
			'SELECT COUNT(*) as count FROM user WHERE sekolah_id = ?'
		).get(sekolahId) as { count: number };

		const totalSiswa = db.prepare(
			'SELECT COUNT(*) as count FROM siswa WHERE sekolah_id = ?'
		).get(sekolahId) as { count: number };

		const totalTransaksi = db.prepare(
			'SELECT COUNT(*) as count FROM transaksi WHERE sekolah_id = ?'
		).get(sekolahId) as { count: number };

		const totalKategori = db.prepare(
			'SELECT COUNT(*) as count FROM kategori WHERE sekolah_id = ?'
		).get(sekolahId) as { count: number };

		return {
			totalUsers: totalUsers.count,
			totalSiswa: totalSiswa.count,
			totalTransaksi: totalTransaksi.count,
			totalKategori: totalKategori.count,
		};
	},
};
