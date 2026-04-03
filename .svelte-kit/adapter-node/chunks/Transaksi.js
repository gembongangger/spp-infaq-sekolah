import db from "./index3.js";
import { v4 } from "uuid";
const Transaksi = {
  /** Convert raw DB row to DTO */
  toDTO(transaksi) {
    return {
      id: transaksi.id,
      tanggal: transaksi.tanggal,
      keterangan: transaksi.keterangan,
      kategori: transaksi.kategori,
      jenis: transaksi.jenis,
      jumlah: transaksi.jumlah,
      metode: transaksi.metode,
      siswaId: transaksi.siswa_id,
      namaPengirim: transaksi.nama_pengirim,
      kelasPengirim: transaksi.kelas_pengirim,
      nomorAkun: transaksi.nomor_akun,
      bulan: transaksi.bulan,
      createdAt: transaksi.created_at,
      updatedAt: transaksi.updated_at
    };
  },
  /** Get all transaksi with optional filters */
  getAll(filters) {
    let query = "SELECT * FROM transaksi WHERE 1=1";
    const params = [];
    if (filters?.kategori) {
      query += " AND kategori = ?";
      params.push(filters.kategori);
    }
    if (filters?.jenis) {
      query += " AND jenis = ?";
      params.push(filters.jenis);
    }
    if (filters?.metode) {
      query += " AND metode = ?";
      params.push(filters.metode);
    }
    if (filters?.tanggal_from) {
      query += " AND tanggal >= ?";
      params.push(filters.tanggal_from);
    }
    if (filters?.tanggal_to) {
      query += " AND tanggal <= ?";
      params.push(filters.tanggal_to);
    }
    query += " ORDER BY tanggal DESC";
    if (filters?.limit) {
      query += " LIMIT ?";
      params.push(filters.limit);
    }
    const stmt = db.prepare(query);
    return stmt.all(...params);
  },
  /** Get transaksi by ID */
  findById(id) {
    const stmt = db.prepare("SELECT * FROM transaksi WHERE id = ?");
    return stmt.get(id);
  },
  /** Create new transaksi */
  create(data) {
    const id = v4();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const stmt = db.prepare(`
			INSERT INTO transaksi (id, tanggal, keterangan, kategori, jenis, jumlah, metode, 
				siswa_id, nama_pengirim, kelas_pengirim, nomor_akun, bulan, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);
    stmt.run(
      id,
      data.tanggal,
      data.keterangan,
      data.kategori,
      data.jenis,
      data.jumlah,
      data.metode,
      data.siswaId || null,
      data.namaPengirim || null,
      data.kelasPengirim || null,
      data.nomorAkun || null,
      data.bulan || null,
      now,
      now
    );
    return this.findById(id);
  },
  /** Update transaksi */
  update(id, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updates = [];
    const values = [];
    const fieldMappings = {
      tanggal: "tanggal",
      keterangan: "keterangan",
      kategori: "kategori",
      jenis: "jenis",
      jumlah: "jumlah",
      metode: "metode",
      siswaId: "siswa_id",
      namaPengirim: "nama_pengirim",
      kelasPengirim: "kelas_pengirim",
      nomorAkun: "nomor_akun",
      bulan: "bulan"
    };
    for (const [key, dbField] of Object.entries(fieldMappings)) {
      if (data[key] !== void 0) {
        updates.push(`${dbField} = ?`);
        values.push(data[key]);
      }
    }
    if (updates.length === 0) {
      return this.findById(id);
    }
    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);
    const stmt = db.prepare(`
			UPDATE transaksi 
			SET ${updates.join(", ")}
			WHERE id = ?
		`);
    stmt.run(...values);
    return this.findById(id);
  },
  /** Delete transaksi */
  delete(id) {
    const stmt = db.prepare("DELETE FROM transaksi WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },
  /** Get statistics */
  getStats() {
    const totalInfaq = db.prepare(
      "SELECT COALESCE(SUM(jumlah), 0) as total FROM transaksi WHERE LOWER(kategori) = LOWER(?) AND LOWER(jenis) = LOWER(?)"
    ).get("infaq", "masuk");
    const totalJariyah = db.prepare(
      "SELECT COALESCE(SUM(jumlah), 0) as total FROM transaksi WHERE LOWER(kategori) = LOWER(?) AND LOWER(jenis) = LOWER(?)"
    ).get("jariyah", "masuk");
    const totalKeluar = db.prepare("SELECT COALESCE(SUM(jumlah), 0) as total FROM transaksi WHERE LOWER(jenis) = LOWER(?)").get("keluar");
    return {
      totalInfaq: totalInfaq.total,
      totalJariyah: totalJariyah.total,
      totalKeluar: totalKeluar.total,
      saldo: totalInfaq.total + totalJariyah.total - totalKeluar.total
    };
  },
  /** Get sender summaries */
  getSenders() {
    const query = `
			SELECT
				nama_pengirim,
				kelas_pengirim,
				nomor_akun,
				SUM(CASE WHEN LOWER(kategori) = LOWER('infaq') THEN jumlah ELSE 0 END) as total_infaq,
				SUM(CASE WHEN LOWER(kategori) = LOWER('jariyah') THEN jumlah ELSE 0 END) as total_jariyah
			FROM transaksi
			WHERE nama_pengirim IS NOT NULL AND LOWER(jenis) = LOWER('masuk')
			GROUP BY nama_pengirim, kelas_pengirim, nomor_akun
			ORDER BY total_infaq + total_jariyah DESC
		`;
    const rows = db.prepare(query).all();
    return rows.map((row) => ({
      id: `${row.nama_pengirim}|${row.kelas_pengirim || ""}|${row.nomor_akun || ""}`,
      nama: row.nama_pengirim,
      kelas: row.kelas_pengirim || "",
      nomorAkun: row.nomor_akun || "",
      totalInfaq: row.total_infaq,
      totalJariyah: row.total_jariyah,
      totalDonasi: row.total_infaq + row.total_jariyah
    }));
  }
};
export {
  Transaksi as T
};
