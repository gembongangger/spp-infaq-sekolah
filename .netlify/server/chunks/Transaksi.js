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
      sekolahId: transaksi.sekolah_id || null,
      createdAt: transaksi.created_at,
      updatedAt: transaksi.updated_at
    };
  },
  /** Get all transaksi with optional filters */
  async getAll(filters) {
    let query = "SELECT * FROM transaksi WHERE 1=1";
    const params = [];
    if (filters?.sekolahId) {
      query += " AND sekolah_id = ?";
      params.push(filters.sekolahId);
    }
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
    const result = await db.execute({ sql: query, args: params });
    return result.rows;
  },
  /** Get transaksi by ID */
  async findById(id) {
    const result = await db.execute({
      sql: "SELECT * FROM transaksi WHERE id = ?",
      args: [id]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Create new transaksi */
  async create(data) {
    const id = v4();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const sekolah_id = data.sekolah_id || null;
    await db.execute({
      sql: `
				INSERT INTO transaksi (id, tanggal, keterangan, kategori, jenis, jumlah, metode,
					siswa_id, nama_pengirim, kelas_pengirim, nomor_akun, bulan, sekolah_id, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
      args: [
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
        sekolah_id,
        now,
        now
      ]
    });
    const transaksi = await this.findById(id);
    return transaksi;
  },
  /** Update transaksi */
  async update(id, data) {
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
      bulan: "bulan",
      sekolahId: "sekolah_id"
    };
    for (const [key, dbField] of Object.entries(fieldMappings)) {
      if (data[key] !== void 0) {
        updates.push(`${dbField} = ?`);
        values.push(data[key]);
      }
    }
    if (updates.length === 0) {
      return await this.findById(id);
    }
    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);
    await db.execute({
      sql: `
				UPDATE transaksi
				SET ${updates.join(", ")}
				WHERE id = ?
			`,
      args: values
    });
    return await this.findById(id);
  },
  /** Delete transaksi */
  async delete(id) {
    const result = await db.execute({
      sql: "DELETE FROM transaksi WHERE id = ?",
      args: [id]
    });
    return result.rowsAffected > 0;
  },
  /** Get statistics */
  async getStats(sekolahId) {
    const params = sekolahId ? [sekolahId] : [];
    const totalInfaqResult = await db.execute({
      sql: `SELECT COALESCE(SUM(jumlah), 0) as total FROM transaksi WHERE LOWER(kategori) = LOWER(?) AND LOWER(jenis) = LOWER(?) ${sekolahId ? "AND sekolah_id = ?" : ""}`,
      args: ["infaq", "masuk", ...params]
    });
    const totalInfaq = totalInfaqResult.rows[0].total;
    const totalJariyahResult = await db.execute({
      sql: `SELECT COALESCE(SUM(jumlah), 0) as total FROM transaksi WHERE LOWER(kategori) = LOWER(?) AND LOWER(jenis) = LOWER(?) ${sekolahId ? "AND sekolah_id = ?" : ""}`,
      args: ["jariyah", "masuk", ...params]
    });
    const totalJariyah = totalJariyahResult.rows[0].total;
    const totalKeluarResult = await db.execute({
      sql: `SELECT COALESCE(SUM(jumlah), 0) as total FROM transaksi WHERE LOWER(jenis) = LOWER(?) ${sekolahId ? "AND sekolah_id = ?" : ""}`,
      args: ["keluar", ...params]
    });
    const totalKeluar = totalKeluarResult.rows[0].total;
    return {
      totalInfaq,
      totalJariyah,
      totalKeluar,
      saldo: totalInfaq + totalJariyah - totalKeluar
    };
  },
  /** Get sender summaries */
  async getSenders(sekolahId) {
    const whereClause = sekolahId ? "AND sekolah_id = ?" : "";
    const params = sekolahId ? [sekolahId] : [];
    const query = `
			SELECT
				nama_pengirim,
				kelas_pengirim,
				nomor_akun,
				SUM(CASE WHEN LOWER(kategori) = LOWER('infaq') THEN jumlah ELSE 0 END) as total_infaq,
				SUM(CASE WHEN LOWER(kategori) = LOWER('jariyah') THEN jumlah ELSE 0 END) as total_jariyah
			FROM transaksi
			WHERE nama_pengirim IS NOT NULL AND LOWER(jenis) = LOWER('masuk') ${whereClause}
			GROUP BY nama_pengirim, kelas_pengirim, nomor_akun
			ORDER BY total_infaq + total_jariyah DESC
		`;
    const result = await db.execute({ sql: query, args: params });
    const rows = result.rows;
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
