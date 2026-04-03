/**
 * Sekolah Model (Async for Turso/LibSQL)
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
	async getAll(): Promise<Sekolah[]> {
		const result = await db.execute('SELECT * FROM sekolah ORDER BY nama ASC');
		return result.rows as unknown as Sekolah[];
	},

	/** Get active schools only */
	async getActive(): Promise<Sekolah[]> {
		const result = await db.execute('SELECT * FROM sekolah WHERE is_active = 1 ORDER BY nama ASC');
		return result.rows as unknown as Sekolah[];
	},

	/** Get school by ID */
	async findById(id: string): Promise<Sekolah | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM sekolah WHERE id = ?',
			args: [id]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as Sekolah;
	},

	/** Get school by kode */
	async findByKode(kode: string): Promise<Sekolah | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM sekolah WHERE kode = ?',
			args: [kode]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as Sekolah;
	},

	/** Create new school */
	async create(data: SekolahCreateDTO): Promise<Sekolah> {
		const id = uuidv4();
		const now = new Date().toISOString();

		await db.execute({
			sql: `
				INSERT INTO sekolah (id, nama, kode, alamat, npsn, nama_kepala, no_hp_kepala, logo_url, is_active, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			args: [
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
			]
		});

		const sekolah = await this.findById(id);
		return sekolah!;
	},

	/** Update school */
	async update(id: string, data: SekolahUpdateDTO): Promise<Sekolah | null> {
		const now = new Date().toISOString();
		const updates: string[] = [];
		const values: (string | number | null)[] = [];

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
			return await this.findById(id);
		}

		updates.push('updated_at = ?');
		values.push(now);
		values.push(id);

		await db.execute({
			sql: `
				UPDATE sekolah
				SET ${updates.join(', ')}
				WHERE id = ?
			`,
			args: values
		});

		return await this.findById(id);
	},

	/** Delete school (soft delete by setting is_active = 0) */
	async softDelete(id: string): Promise<boolean> {
		const now = new Date().toISOString();
		const result = await db.execute({
			sql: `
				UPDATE sekolah
				SET is_active = 0, updated_at = ?
				WHERE id = ?
			`,
			args: [now, id]
		});
		return result.rowsAffected > 0;
	},

	/** Hard delete school (use with caution) */
	async delete(id: string): Promise<boolean> {
		const result = await db.execute({
			sql: 'DELETE FROM sekolah WHERE id = ?',
			args: [id]
		});
		return result.rowsAffected > 0;
	},

	/** Get school statistics */
	async getStats(sekolahId: string): Promise<{
		totalUsers: number;
		totalSiswa: number;
		totalTransaksi: number;
		totalKategori: number;
	}> {
		const totalUsersResult = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM user WHERE sekolah_id = ?',
			args: [sekolahId]
		});
		const totalUsers = (totalUsersResult.rows[0] as any).count;

		const totalSiswaResult = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM siswa WHERE sekolah_id = ?',
			args: [sekolahId]
		});
		const totalSiswa = (totalSiswaResult.rows[0] as any).count;

		const totalTransaksiResult = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM transaksi WHERE sekolah_id = ?',
			args: [sekolahId]
		});
		const totalTransaksi = (totalTransaksiResult.rows[0] as any).count;

		const totalKategoriResult = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM kategori WHERE sekolah_id = ?',
			args: [sekolahId]
		});
		const totalKategori = (totalKategoriResult.rows[0] as any).count;

		return {
			totalUsers,
			totalSiswa,
			totalTransaksi,
			totalKategori,
		};
	},
};
