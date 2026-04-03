import db from "./index3.js";
import { v4 } from "uuid";
const Sekolah = {
  /** Convert raw DB row to DTO */
  toDTO(sekolah) {
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
      updatedAt: sekolah.updated_at
    };
  },
  /** Get all schools */
  async getAll() {
    const result = await db.execute("SELECT * FROM sekolah ORDER BY nama ASC");
    return result.rows;
  },
  /** Get active schools only */
  async getActive() {
    const result = await db.execute("SELECT * FROM sekolah WHERE is_active = 1 ORDER BY nama ASC");
    return result.rows;
  },
  /** Get school by ID */
  async findById(id) {
    const result = await db.execute({
      sql: "SELECT * FROM sekolah WHERE id = ?",
      args: [id]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Get school by kode */
  async findByKode(kode) {
    const result = await db.execute({
      sql: "SELECT * FROM sekolah WHERE kode = ?",
      args: [kode]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Create new school */
  async create(data) {
    const id = v4();
    const now = (/* @__PURE__ */ new Date()).toISOString();
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
    return sekolah;
  },
  /** Update school */
  async update(id, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updates = [];
    const values = [];
    if (data.nama !== void 0) {
      updates.push("nama = ?");
      values.push(data.nama);
    }
    if (data.kode !== void 0) {
      updates.push("kode = ?");
      values.push(data.kode.toUpperCase());
    }
    if (data.alamat !== void 0) {
      updates.push("alamat = ?");
      values.push(data.alamat);
    }
    if (data.npsn !== void 0) {
      updates.push("npsn = ?");
      values.push(data.npsn);
    }
    if (data.namaKepala !== void 0) {
      updates.push("nama_kepala = ?");
      values.push(data.namaKepala);
    }
    if (data.noHpKepala !== void 0) {
      updates.push("no_hp_kepala = ?");
      values.push(data.noHpKepala);
    }
    if (data.logoUrl !== void 0) {
      updates.push("logo_url = ?");
      values.push(data.logoUrl);
    }
    if (data.isActive !== void 0) {
      updates.push("is_active = ?");
      values.push(data.isActive ? 1 : 0);
    }
    if (updates.length === 0) {
      return await this.findById(id);
    }
    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);
    await db.execute({
      sql: `
				UPDATE sekolah
				SET ${updates.join(", ")}
				WHERE id = ?
			`,
      args: values
    });
    return await this.findById(id);
  },
  /** Delete school (soft delete by setting is_active = 0) */
  async softDelete(id) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
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
  async delete(id) {
    const result = await db.execute({
      sql: "DELETE FROM sekolah WHERE id = ?",
      args: [id]
    });
    return result.rowsAffected > 0;
  },
  /** Get school statistics */
  async getStats(sekolahId) {
    const totalUsersResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM user WHERE sekolah_id = ?",
      args: [sekolahId]
    });
    const totalUsers = totalUsersResult.rows[0].count;
    const totalSiswaResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM siswa WHERE sekolah_id = ?",
      args: [sekolahId]
    });
    const totalSiswa = totalSiswaResult.rows[0].count;
    const totalTransaksiResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM transaksi WHERE sekolah_id = ?",
      args: [sekolahId]
    });
    const totalTransaksi = totalTransaksiResult.rows[0].count;
    const totalKategoriResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM kategori WHERE sekolah_id = ?",
      args: [sekolahId]
    });
    const totalKategori = totalKategoriResult.rows[0].count;
    return {
      totalUsers,
      totalSiswa,
      totalTransaksi,
      totalKategori
    };
  }
};
export {
  Sekolah as S
};
