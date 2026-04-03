/**
 * Siswa Model (Async for Turso/LibSQL)
 */
import db from '$lib/server/db';
import { v4 as uuidv4 } from 'uuid';

export interface Siswa {
	id: string;
	nomor_akun: string;
	nama: string;
	kelas: string;
	sekolah_id: string | null;
	created_at: string;
	updated_at: string | null;
}

export interface SiswaDTO {
	id: string;
	nomorAkun: string;
	nama: string;
	kelas: string;
	sekolahId: string | null;
	createdAt: string;
	updatedAt: string | null;
}

export const Siswa = {
	/** Convert raw DB row to DTO */
	toDTO(siswa: any): SiswaDTO {
		return {
			id: siswa.id as string,
			nomorAkun: siswa.nomor_akun as string,
			nama: siswa.nama as string,
			kelas: siswa.kelas as string,
			sekolahId: (siswa.sekolah_id as string) || null,
			createdAt: siswa.created_at as string,
			updatedAt: (siswa.updated_at as string) || null,
		};
	},

	/** Get all siswa */
	async getAll(): Promise<Siswa[]> {
		const result = await db.execute('SELECT * FROM siswa ORDER BY created_at DESC');
		return result.rows as unknown as Siswa[];
	},

	/** Get siswa by sekolah_id */
	async getBySekolah(sekolahId: string): Promise<Siswa[]> {
		const result = await db.execute({
			sql: 'SELECT * FROM siswa WHERE sekolah_id = ? ORDER BY created_at DESC',
			args: [sekolahId]
		});
		return result.rows as unknown as Siswa[];
	},

	/** Get siswa by ID */
	async findById(id: string): Promise<Siswa | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM siswa WHERE id = ?',
			args: [id]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as Siswa;
	},

	/** Get siswa by nomor_akun */
	async findByNomorAkun(nomorAkun: string): Promise<Siswa | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM siswa WHERE nomor_akun = ?',
			args: [nomorAkun]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as Siswa;
	},

	/** Get siswa by nomor_akun within school */
	async findByNomorAkunInSekolah(nomorAkun: string, sekolahId: string | null): Promise<Siswa | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM siswa WHERE nomor_akun = ? AND sekolah_id IS ?',
			args: [nomorAkun, sekolahId]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as Siswa;
	},

	/** Create new siswa */
	async create(data: { nomorAkun: string; nama: string; kelas: string; sekolah_id?: string | null }): Promise<Siswa> {
		const id = uuidv4();
		const now = new Date().toISOString();
		const sekolah_id = data.sekolah_id || null;

		await db.execute({
			sql: `
				INSERT INTO siswa (id, nomor_akun, nama, kelas, sekolah_id, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`,
			args: [id, data.nomorAkun, data.nama, data.kelas, sekolah_id, now, now]
		});

		const result = await this.findById(id);
		return result!;
	},

	/** Update siswa */
	async update(id: string, data: Partial<{ nomorAkun: string; nama: string; kelas: string; sekolah_id: string | null }>): Promise<Siswa | null> {
		const now = new Date().toISOString();
		const updates: string[] = [];
		const values: (string | null | number)[] = [];

		if (data.nomorAkun !== undefined) {
			updates.push('nomor_akun = ?');
			values.push(data.nomorAkun);
		}
		if (data.nama !== undefined) {
			updates.push('nama = ?');
			values.push(data.nama);
		}
		if (data.kelas !== undefined) {
			updates.push('kelas = ?');
			values.push(data.kelas);
		}
		if (data.sekolah_id !== undefined) {
			updates.push('sekolah_id = ?');
			values.push(data.sekolah_id);
		}

		if (updates.length === 0) {
			return await this.findById(id);
		}

		updates.push('updated_at = ?');
		values.push(now);
		
		// Add ID for WHERE clause
		values.push(id);

		await db.execute({
			sql: `
				UPDATE siswa 
				SET ${updates.join(', ')}
				WHERE id = ?
			`,
			args: values
		});

		return await this.findById(id);
	},

	/** Delete siswa */
	async delete(id: string): Promise<boolean> {
		const result = await db.execute({
			sql: 'DELETE FROM siswa WHERE id = ?',
			args: [id]
		});
		return result.rowsAffected > 0;
	},

	/** Search siswa with pagination */
	async search(options: {
		query?: string;
		sekolahId?: string | null;
		limit?: number;
		offset?: number;
	}): Promise<{ students: Siswa[]; total: number; hasMore: boolean }> {
		const { query = '', sekolahId = null, limit = 20, offset = 0 } = options;

		// Build WHERE clause
		let whereClause = 'WHERE 1=1';
		let countParams: (string | number | null)[] = [];
		let searchParams: (string | number | null)[] = [];

		if (sekolahId) {
			whereClause += ' AND sekolah_id = ?';
			countParams.push(sekolahId);
			searchParams.push(sekolahId);
		}

		if (query.trim()) {
			const searchPattern = `%${query.trim()}%`;
			whereClause += ' AND (nama LIKE ? OR nomor_akun LIKE ? OR kelas LIKE ?)';
			countParams.push(searchPattern, searchPattern, searchPattern);
			searchParams.push(searchPattern, searchPattern, searchPattern);
		}

		// Count total matching records
		const totalResult = await db.execute({
			sql: `SELECT COUNT(*) as count FROM siswa ${whereClause}`,
			args: countParams
		});
		const total = Number((totalResult.rows[0] as any).count);

		// Get paginated results
		const finalWhereClause = whereClause + ' ORDER BY nama ASC LIMIT ? OFFSET ?';
		searchParams.push(limit, offset);

		const searchResult = await db.execute({
			sql: `SELECT * FROM siswa ${finalWhereClause}`,
			args: searchParams
		});
		const students = searchResult.rows as unknown as Siswa[];
		const hasMore = offset + students.length < total;

		return {
			students,
			total,
			hasMore
		};
	},

	/** Batch create for Excel import */
	async batchCreate(dataArray: { nomorAkun: string; nama: string; kelas: string; sekolah_id?: string | null; rowNumber?: number }[]): Promise<{
		success: number;
		duplicate: number;
		failed: number;
		errors: string[];
	}> {
		const result = {
			success: 0,
			duplicate: 0,
			failed: 0,
			errors: [] as string[],
		};

		// For batching in LibSQL, we should use transaction or batch()
		// But for simplicity and error handling per row, we'll do them sequentially or in a batch
		
		const queries = [];
		
		for (let i = 0; i < dataArray.length; i++) {
			const data = dataArray[i];
			const rowNumber = data.rowNumber ?? i + 2;
			const sekolah_id = data.sekolah_id || null;

			try {
				// Check duplicate (within same school) - must await because it's async now
				const existing = await this.findByNomorAkun(data.nomorAkun);
				// Filter check manually for sekolah_id if needed, but the original script only checked nomorAkun
				if (existing && existing.sekolah_id === sekolah_id) {
					result.duplicate++;
					result.errors.push(`Baris ${rowNumber}: Nomor akun "${data.nomorAkun}" sudah ada`);
					continue;
				}

				const id = uuidv4();
				const now = new Date().toISOString();
				
				await db.execute({
					sql: `
						INSERT INTO siswa (id, nomor_akun, nama, kelas, sekolah_id, created_at, updated_at)
						VALUES (?, ?, ?, ?, ?, ?, ?)
					`,
					args: [id, data.nomorAkun, data.nama, data.kelas, sekolah_id, now, now]
				});
				
				result.success++;
			} catch (error) {
				result.failed++;
				result.errors.push(`Baris ${rowNumber}: ${(error as Error).message}`);
			}
		}

		return result;
	},
};
