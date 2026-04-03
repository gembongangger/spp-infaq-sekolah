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
      sekolahId: siswa.sekolah_id || null,
      createdAt: siswa.created_at,
      updatedAt: siswa.updated_at || null
    };
  },
  /** Get all siswa */
  async getAll() {
    const result = await db.execute("SELECT * FROM siswa ORDER BY created_at DESC");
    return result.rows;
  },
  /** Get siswa by sekolah_id */
  async getBySekolah(sekolahId) {
    const result = await db.execute({
      sql: "SELECT * FROM siswa WHERE sekolah_id = ? ORDER BY created_at DESC",
      args: [sekolahId]
    });
    return result.rows;
  },
  /** Get siswa by ID */
  async findById(id) {
    const result = await db.execute({
      sql: "SELECT * FROM siswa WHERE id = ?",
      args: [id]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Get siswa by nomor_akun */
  async findByNomorAkun(nomorAkun) {
    const result = await db.execute({
      sql: "SELECT * FROM siswa WHERE nomor_akun = ?",
      args: [nomorAkun]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Create new siswa */
  async create(data) {
    const id = v4();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const sekolah_id = data.sekolah_id || null;
    await db.execute({
      sql: `
				INSERT INTO siswa (id, nomor_akun, nama, kelas, sekolah_id, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`,
      args: [id, data.nomorAkun, data.nama, data.kelas, sekolah_id, now, now]
    });
    const result = await this.findById(id);
    return result;
  },
  /** Update siswa */
  async update(id, data) {
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
    if (data.sekolah_id !== void 0) {
      updates.push("sekolah_id = ?");
      values.push(data.sekolah_id);
    }
    if (updates.length === 0) {
      return await this.findById(id);
    }
    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);
    await db.execute({
      sql: `
				UPDATE siswa 
				SET ${updates.join(", ")}
				WHERE id = ?
			`,
      args: values
    });
    return await this.findById(id);
  },
  /** Delete siswa */
  async delete(id) {
    const result = await db.execute({
      sql: "DELETE FROM siswa WHERE id = ?",
      args: [id]
    });
    return result.rowsAffected > 0;
  },
  /** Search siswa with pagination */
  async search(options) {
    const { query = "", sekolahId = null, limit = 20, offset = 0 } = options;
    let whereClause = "WHERE 1=1";
    let countParams = [];
    let searchParams = [];
    if (sekolahId) {
      whereClause += " AND sekolah_id = ?";
      countParams.push(sekolahId);
      searchParams.push(sekolahId);
    }
    if (query.trim()) {
      const searchPattern = `%${query.trim()}%`;
      whereClause += " AND (nama LIKE ? OR nomor_akun LIKE ? OR kelas LIKE ?)";
      countParams.push(searchPattern, searchPattern, searchPattern);
      searchParams.push(searchPattern, searchPattern, searchPattern);
    }
    const totalResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM siswa ${whereClause}`,
      args: countParams
    });
    const total = Number(totalResult.rows[0].count);
    const finalWhereClause = whereClause + " ORDER BY nama ASC LIMIT ? OFFSET ?";
    searchParams.push(limit, offset);
    const searchResult = await db.execute({
      sql: `SELECT * FROM siswa ${finalWhereClause}`,
      args: searchParams
    });
    const students = searchResult.rows;
    const hasMore = offset + students.length < total;
    return {
      students,
      total,
      hasMore
    };
  },
  /** Batch create for Excel import */
  async batchCreate(dataArray) {
    const result = {
      success: 0,
      duplicate: 0,
      failed: 0,
      errors: []
    };
    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      const rowNumber = data.rowNumber ?? i + 2;
      const sekolah_id = data.sekolah_id || null;
      try {
        const existing = await this.findByNomorAkun(data.nomorAkun);
        if (existing && existing.sekolah_id === sekolah_id) {
          result.duplicate++;
          result.errors.push(`Baris ${rowNumber}: Nomor akun "${data.nomorAkun}" sudah ada`);
          continue;
        }
        const id = v4();
        const now = (/* @__PURE__ */ new Date()).toISOString();
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
        result.errors.push(`Baris ${rowNumber}: ${error.message}`);
      }
    }
    return result;
  }
};
export {
  Siswa as S
};
