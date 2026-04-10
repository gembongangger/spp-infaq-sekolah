import db from "./index3.js";
import { v4 } from "uuid";
const Kategori = {
  /** Convert raw DB row to DTO */
  toDTO(kategori) {
    return {
      id: kategori.id,
      nama: kategori.nama,
      ikon: kategori.ikon,
      warna: kategori.warna,
      sekolahId: kategori.sekolah_id || null
    };
  },
  /** Get all kategori */
  async getAll() {
    const result = await db.execute("SELECT * FROM kategori ORDER BY nama");
    return result.rows;
  },
  /** Get kategori by sekolah_id */
  async getBySekolah(sekolahId) {
    const result = await db.execute({
      sql: "SELECT * FROM kategori WHERE sekolah_id = ? ORDER BY nama",
      args: [sekolahId]
    });
    return result.rows;
  },
  /** Get kategori by ID */
  async findById(id) {
    const result = await db.execute({
      sql: "SELECT * FROM kategori WHERE id = ?",
      args: [id]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Get kategori by nama */
  async findByNama(nama) {
    const result = await db.execute({
      sql: "SELECT * FROM kategori WHERE nama = ?",
      args: [nama]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Get kategori by nama within school */
  async findByNamaInSekolah(nama, sekolahId) {
    const result = await db.execute({
      sql: "SELECT * FROM kategori WHERE nama = ? AND sekolah_id IS ?",
      args: [nama, sekolahId]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Get kategori by nama and sekolah_id (exact match) */
  async findByNamaAndSekolahId(nama, sekolahId) {
    const result = await db.execute({
      sql: "SELECT * FROM kategori WHERE nama = ? AND sekolah_id = ?",
      args: [nama, sekolahId]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Create new kategori */
  async create(data) {
    const id = v4();
    const ikon = data.ikon || "Heart";
    const warna = data.warna || "#10b981";
    const sekolah_id = data.sekolah_id || null;
    await db.execute({
      sql: `
				INSERT INTO kategori (id, nama, ikon, warna, sekolah_id)
				VALUES (?, ?, ?, ?, ?)
			`,
      args: [id, data.nama, ikon, warna, sekolah_id]
    });
    const kategori = await this.findById(id);
    return kategori;
  },
  /** Delete kategori */
  async delete(id) {
    const result = await db.execute({
      sql: "DELETE FROM kategori WHERE id = ?",
      args: [id]
    });
    return result.rowsAffected > 0;
  }
};
export {
  Kategori as K
};
