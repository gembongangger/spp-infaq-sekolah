import db from "./index3.js";
import { v4 } from "uuid";
const Kategori = {
  /** Convert raw DB row to DTO */
  toDTO(kategori) {
    return {
      id: kategori.id,
      nama: kategori.nama,
      ikon: kategori.ikon,
      warna: kategori.warna
    };
  },
  /** Get all kategori */
  getAll() {
    const stmt = db.prepare("SELECT * FROM kategori ORDER BY nama");
    return stmt.all();
  },
  /** Get kategori by ID */
  findById(id) {
    const stmt = db.prepare("SELECT * FROM kategori WHERE id = ?");
    return stmt.get(id);
  },
  /** Get kategori by nama */
  findByNama(nama) {
    const stmt = db.prepare("SELECT * FROM kategori WHERE nama = ?");
    return stmt.get(nama);
  },
  /** Create new kategori */
  create(data) {
    const id = v4();
    const ikon = data.ikon || "Heart";
    const warna = data.warna || "#10b981";
    const stmt = db.prepare(`
			INSERT INTO kategori (id, nama, ikon, warna)
			VALUES (?, ?, ?, ?)
		`);
    stmt.run(id, data.nama, ikon, warna);
    return this.findById(id);
  },
  /** Delete kategori */
  delete(id) {
    const stmt = db.prepare("DELETE FROM kategori WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
};
export {
  Kategori as K
};
