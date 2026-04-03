/**
 * Siswa Model
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
	toDTO(siswa: Siswa): SiswaDTO {
		return {
			id: siswa.id,
			nomorAkun: siswa.nomor_akun,
			nama: siswa.nama,
			kelas: siswa.kelas,
			sekolahId: siswa.sekolah_id || null,
			createdAt: siswa.created_at,
			updatedAt: siswa.updated_at,
		};
	},

	/** Get all siswa */
	getAll(): Siswa[] {
		const stmt = db.prepare('SELECT * FROM siswa ORDER BY created_at DESC');
		return stmt.all() as Siswa[];
	},

	/** Get siswa by sekolah_id */
	getBySekolah(sekolahId: string): Siswa[] {
		const stmt = db.prepare('SELECT * FROM siswa WHERE sekolah_id = ? ORDER BY created_at DESC');
		return stmt.all(sekolahId) as Siswa[];
	},

	/** Get siswa by ID */
	findById(id: string): Siswa | null {
		const stmt = db.prepare('SELECT * FROM siswa WHERE id = ?');
		return stmt.get(id) as Siswa | null;
	},

	/** Get siswa by nomor_akun */
	findByNomorAkun(nomorAkun: string): Siswa | null {
		const stmt = db.prepare('SELECT * FROM siswa WHERE nomor_akun = ?');
		return stmt.get(nomorAkun) as Siswa | null;
	},

	/** Create new siswa */
	create(data: { nomorAkun: string; nama: string; kelas: string; sekolah_id?: string | null }): Siswa {
		const id = uuidv4();
		const now = new Date().toISOString();
		const sekolah_id = data.sekolah_id || null;

		const stmt = db.prepare(`
			INSERT INTO siswa (id, nomor_akun, nama, kelas, sekolah_id, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`);

		stmt.run(id, data.nomorAkun, data.nama, data.kelas, sekolah_id, now, now);

		return this.findById(id)!;
	},

	/** Update siswa */
	update(id: string, data: Partial<{ nomorAkun: string; nama: string; kelas: string; sekolah_id: string | null }>): Siswa | null {
		const now = new Date().toISOString();
		const updates: string[] = [];
		const values: (string | null)[] = [];

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
			return this.findById(id);
		}

		updates.push('updated_at = ?');
		values.push(now);
		values.push(id);

		const stmt = db.prepare(`
			UPDATE siswa 
			SET ${updates.join(', ')}
			WHERE id = ?
		`);

		stmt.run(...values);

		return this.findById(id);
	},

	/** Delete siswa */
	delete(id: string): boolean {
		const stmt = db.prepare('DELETE FROM siswa WHERE id = ?');
		const result = stmt.run(id);
		return result.changes > 0;
	},

	/** Search siswa with pagination */
	search(options: {
		query?: string;
		sekolahId?: string | null;
		limit?: number;
		offset?: number;
	}): { students: Siswa[]; total: number; hasMore: boolean } {
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
		const countStmt = db.prepare(`SELECT COUNT(*) as count FROM siswa ${whereClause}`);
		const totalResult = countStmt.get(...countParams) as { count: number };
		const total = totalResult.count;

		// Get paginated results
		whereClause += ' ORDER BY nama ASC LIMIT ? OFFSET ?';
		searchParams.push(limit, offset);

		const searchStmt = db.prepare(`SELECT * FROM siswa ${whereClause}`);
		const students = searchStmt.all(...searchParams) as Siswa[];
		const hasMore = offset + students.length < total;

		return {
			students: students.map(s => s),
			total,
			hasMore
		};
	},

	/** Batch create for Excel import */
	batchCreate(dataArray: { nomorAkun: string; nama: string; kelas: string; sekolah_id?: string | null; rowNumber?: number }[]): {
		success: number;
		duplicate: number;
		failed: number;
		errors: string[];
	} {
		const result = {
			success: 0,
			duplicate: 0,
			failed: 0,
			errors: [] as string[],
		};

		const insertStmt = db.prepare(`
			INSERT INTO siswa (id, nomor_akun, nama, kelas, sekolah_id, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`);

		const checkStmt = db.prepare('SELECT id FROM siswa WHERE nomor_akun = ? AND sekolah_id = ?');

		const insertMany = db.transaction((students: typeof dataArray) => {
			for (let i = 0; i < students.length; i++) {
				const data = students[i];
				const rowNumber = data.rowNumber ?? i + 2; // Excel row number (header is row 1)
				const sekolah_id = data.sekolah_id || null;

				try {
					// Check duplicate (within same school)
					const existing = checkStmt.get(data.nomorAkun, sekolah_id);
					if (existing) {
						result.duplicate++;
						result.errors.push(`Baris ${rowNumber}: Nomor akun "${data.nomorAkun}" sudah ada`);
						continue;
					}

					const id = uuidv4();
					const now = new Date().toISOString();
					insertStmt.run(id, data.nomorAkun, data.nama, data.kelas, sekolah_id, now, now);
					result.success++;
				} catch (error) {
					result.failed++;
					result.errors.push(`Baris ${rowNumber}: ${(error as Error).message}`);
				}
			}
		});

		insertMany(dataArray);

		return result;
	},
};
