import { json } from "@sveltejs/kit";
import db from "../chunks/index3.js";
async function migrate() {
  console.log("Starting database migrations...");
  await db.execute(`
		CREATE TABLE IF NOT EXISTS user (
			id TEXT PRIMARY KEY,
			username TEXT NOT NULL UNIQUE,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			role TEXT NOT NULL DEFAULT 'admin',
			sekolah_id TEXT,
			is_active INTEGER NOT NULL DEFAULT 1,
			nama_lengkap TEXT,
			no_hp TEXT,
			foto_url TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)
	`);
  await db.execute(`
		CREATE TABLE IF NOT EXISTS sekolah (
			id TEXT PRIMARY KEY,
			nama TEXT NOT NULL,
			kode TEXT NOT NULL UNIQUE,
			alamat TEXT,
			npsn TEXT,
			nama_kepala TEXT,
			no_hp_kepala TEXT,
			logo_url TEXT,
			is_active INTEGER NOT NULL DEFAULT 1,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)
	`);
  await db.execute(`
		CREATE TABLE IF NOT EXISTS siswa (
			id TEXT PRIMARY KEY,
			nomor_akun TEXT NOT NULL,
			nama TEXT NOT NULL,
			kelas TEXT NOT NULL,
			sekolah_id TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT
		)
	`);
  await db.execute(`
		CREATE TABLE IF NOT EXISTS kategori (
			id TEXT PRIMARY KEY,
			nama TEXT NOT NULL,
			ikon TEXT,
			warna TEXT,
			sekolah_id TEXT
		)
	`);
  await db.execute(`
		CREATE TABLE IF NOT EXISTS transaksi (
			id TEXT PRIMARY KEY,
			tanggal TEXT NOT NULL,
			keterangan TEXT NOT NULL,
			kategori TEXT NOT NULL,
			jenis TEXT NOT NULL CHECK(jenis IN ('masuk', 'keluar')),
			jumlah REAL NOT NULL,
			metode TEXT NOT NULL CHECK(metode IN ('tunai', 'transfer')),
			siswa_id TEXT,
			nama_pengirim TEXT,
			kelas_pengirim TEXT,
			nomor_akun TEXT,
			bulan TEXT,
			sekolah_id TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT
		)
	`);
  try {
    await db.execute("ALTER TABLE user ADD COLUMN nama_lengkap TEXT");
    console.log("Added nama_lengkap column to user table");
  } catch (error) {
    if (!error.message.includes("duplicate column") && !error.message.includes("already exists")) {
      console.warn("Warning for nama_lengkap:", error.message);
    }
  }
  try {
    await db.execute("ALTER TABLE user ADD COLUMN no_hp TEXT");
    console.log("Added no_hp column to user table");
  } catch (error) {
    if (!error.message.includes("duplicate column") && !error.message.includes("already exists")) {
      console.warn("Warning for no_hp:", error.message);
    }
  }
  try {
    await db.execute("ALTER TABLE user ADD COLUMN foto_url TEXT");
    console.log("Added foto_url column to user table");
  } catch (error) {
    if (!error.message.includes("duplicate column") && !error.message.includes("already exists")) {
      console.warn("Warning for foto_url:", error.message);
    }
  }
  console.log("Database migrations completed successfully!");
}
migrate().catch((error) => {
  console.error("Migration error:", error);
});
const handle = async ({ event, resolve }) => {
  try {
    const response = await resolve(event);
    return response;
  } catch (error) {
    if (event.url.pathname.startsWith("/api/")) {
      return json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error"
        },
        { status: 500 }
      );
    }
    throw error;
  }
};
export {
  handle
};
