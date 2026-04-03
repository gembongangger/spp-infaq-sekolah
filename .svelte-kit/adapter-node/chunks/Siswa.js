import db from "./index3.js";
import { v4 } from "uuid";
const Siswa = {
  /** Convert raw DB row to DTO */
  toDTO(siswa) {
    return {
      id: siswa.id,
      nomorAkun: siswa.nomor_akun,
      nama: siswa.nama,
      kelas: siswa.kelas,
      createdAt: siswa.created_at,
      updatedAt: siswa.updated_at
    };
  },
  /** Get all siswa */
  getAll() {
    const stmt = db.prepare("SELECT * FROM siswa ORDER BY created_at DESC");
    return stmt.all();
  },
  /** Get siswa by ID */
  findById(id) {
    const stmt = db.prepare("SELECT * FROM siswa WHERE id = ?");
    return stmt.get(id);
  },
  /** Get siswa by nomor_akun */
  findByNomorAkun(nomorAkun) {
    const stmt = db.prepare("SELECT * FROM siswa WHERE nomor_akun = ?");
    return stmt.get(nomorAkun);
  },
  /** Create new siswa */
  create(data) {
    const id = v4();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const stmt = db.prepare(`
			INSERT INTO siswa (id, nomor_akun, nama, kelas, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?)
		`);
    stmt.run(id, data.nomorAkun, data.nama, data.kelas, now, now);
    return this.findById(id);
  },
  /** Update siswa */
  update(id, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updates = [];
    const values = [];
    if (data.nomorAkun !== void 0) {
      updates.push("nomor_akun = ?");
      values.push(data.nomorAkun);
    }
    if (data.nama !== void 0) {
      updates.push("nama = ?");
      values.push(data.nama);
    }
    if (data.kelas !== void 0) {
      updates.push("kelas = ?");
      values.push(data.kelas);
    }
    if (updates.length === 0) {
      return this.findById(id);
    }
    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);
    const stmt = db.prepare(`
			UPDATE siswa 
			SET ${updates.join(", ")}
			WHERE id = ?
		`);
    stmt.run(...values);
    return this.findById(id);
  },
  /** Delete siswa */
  delete(id) {
    const stmt = db.prepare("DELETE FROM siswa WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },
  /** Search siswa with pagination */
  search(options) {
    const { query = "", limit = 20, offset = 0 } = options;
    let countStmt;
    let countParams = [];
    if (query.trim()) {
      const searchPattern = `%${query.trim()}%`;
      countStmt = db.prepare(`
				SELECT COUNT(*) as count
				FROM siswa
				WHERE nama LIKE ? OR nomor_akun LIKE ? OR kelas LIKE ?
			`);
      countParams = [searchPattern, searchPattern, searchPattern];
    } else {
      countStmt = db.prepare("SELECT COUNT(*) as count FROM siswa");
    }
    const totalResult = countStmt.get(...countParams);
    const total = totalResult.count;
    let searchStmt;
    let searchParams = [];
    if (query.trim()) {
      const searchPattern = `%${query.trim()}%`;
      searchStmt = db.prepare(`
				SELECT * FROM siswa
				WHERE nama LIKE ? OR nomor_akun LIKE ? OR kelas LIKE ?
				ORDER BY nama ASC
				LIMIT ? OFFSET ?
			`);
      searchParams = [searchPattern, searchPattern, searchPattern, limit, offset];
    } else {
      searchStmt = db.prepare(`
				SELECT * FROM siswa
				ORDER BY nama ASC
				LIMIT ? OFFSET ?
			`);
      searchParams = [limit, offset];
    }
    const students = searchStmt.all(...searchParams);
    const hasMore = offset + students.length < total;
    return {
      students: students.map((s) => s),
      total,
      hasMore
    };
  },
  /** Batch create for Excel import */
  batchCreate(dataArray) {
    const result = {
      success: 0,
      duplicate: 0,
      failed: 0,
      errors: []
    };
    const insertStmt = db.prepare(`
			INSERT INTO siswa (id, nomor_akun, nama, kelas, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?)
		`);
    const checkStmt = db.prepare("SELECT id FROM siswa WHERE nomor_akun = ?");
    const insertMany = db.transaction((students) => {
      for (let i = 0; i < students.length; i++) {
        const data = students[i];
        const rowNumber = data.rowNumber ?? i + 2;
        try {
          const existing = checkStmt.get(data.nomorAkun);
          if (existing) {
            result.duplicate++;
            result.errors.push(`Baris ${rowNumber}: Nomor akun "${data.nomorAkun}" sudah ada`);
            continue;
          }
          const id = v4();
          const now = (/* @__PURE__ */ new Date()).toISOString();
          insertStmt.run(id, data.nomorAkun, data.nama, data.kelas, now, now);
          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push(`Baris ${rowNumber}: ${error.message}`);
        }
      }
    });
    insertMany(dataArray);
    return result;
  }
};
export {
  Siswa as S
};
