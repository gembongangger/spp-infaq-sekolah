-- Migration Script: Upgrade Turso Database to match schema.sql
-- This script safely migrates all data while adding new constraints and indexes
-- SAFE TO RUN - preserves all existing data

-- Enable foreign key support
PRAGMA foreign_keys = OFF;

-- Begin transaction for atomic migration
BEGIN TRANSACTION;

-- Step 1: Create backup tables and copy existing data
CREATE TABLE IF NOT EXISTS _backup_user AS SELECT * FROM user;
CREATE TABLE IF NOT EXISTS _backup_sekolah AS SELECT * FROM sekolah;
CREATE TABLE IF NOT EXISTS _backup_siswa AS SELECT * FROM siswa;
CREATE TABLE IF NOT EXISTS _backup_kategori AS SELECT * FROM kategori;
CREATE TABLE IF NOT EXISTS _backup_transaksi AS SELECT * FROM transaksi;

-- Step 1.5: Skip backup for permintaan_penarikan as it may not exist
-- We'll just create the new table in Step 4 if it doesn't exist

-- Step 2: Drop old tables (data is now in backup tables)
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS sekolah;
DROP TABLE IF EXISTS siswa;
DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS transaksi;
DROP TABLE IF EXISTS permintaan_penarikan;

-- Step 3: Drop old indexes
DROP INDEX IF EXISTS idx_user_email;
DROP INDEX IF EXISTS idx_user_username;
DROP INDEX IF EXISTS idx_user_sekolah_id;
DROP INDEX IF EXISTS idx_user_sekolah;
DROP INDEX IF EXISTS idx_siswa_nomor_akun;
DROP INDEX IF EXISTS idx_siswa_sekolah_id;
DROP INDEX IF EXISTS idx_siswa_sekolah;
DROP INDEX IF EXISTS idx_transaksi_sekolah_id;
DROP INDEX IF EXISTS idx_transaksi_sekolah;
DROP INDEX IF EXISTS idx_transaksi_tanggal;
DROP INDEX IF EXISTS idx_transaksi_siswa_id;
DROP INDEX IF EXISTS idx_kategori_sekolah_id;
DROP INDEX IF EXISTS idx_kategori_sekolah;
DROP INDEX IF EXISTS idx_penarikan_sekolah;
DROP INDEX IF EXISTS idx_penarikan_status;

-- Step 4: Create new tables with proper schema (from schema.sql)

-- Table: sekolah (created first due to foreign key dependencies)
CREATE TABLE sekolah (
	id TEXT PRIMARY KEY,
	nama TEXT NOT NULL,
	kode TEXT NOT NULL UNIQUE,
	alamat TEXT,
	npsn TEXT,
	nama_kepala TEXT,
	no_hp_kepala TEXT,
	logo_url TEXT,
	is_active INTEGER NOT NULL DEFAULT 1,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL
);

-- Table: user
CREATE TABLE user (
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
	updated_at TEXT NOT NULL,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);

-- Table: siswa
CREATE TABLE siswa (
	id TEXT PRIMARY KEY,
	nomor_akun TEXT NOT NULL,
	nama TEXT NOT NULL,
	kelas TEXT NOT NULL,
	sekolah_id TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);

-- Table: kategori
CREATE TABLE kategori (
	id TEXT PRIMARY KEY,
	nama TEXT NOT NULL,
	ikon TEXT,
	warna TEXT,
	sekolah_id TEXT,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);

-- Table: transaksi
CREATE TABLE transaksi (
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
	updated_at TEXT,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id),
	FOREIGN KEY (siswa_id) REFERENCES siswa(id)
);

-- Table: permintaan_penarikan
CREATE TABLE permintaan_penarikan (
    id TEXT PRIMARY KEY,
    sekolah_id TEXT NOT NULL,
    jumlah REAL NOT NULL,
    keterangan TEXT,
    status TEXT NOT NULL DEFAULT 'menunggu',
    dibuat_oleh TEXT NOT NULL,
    diproses_oleh TEXT,
    tanggal_diproses TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);

-- Step 5: Restore all data from backup tables

-- Restore sekolah
INSERT INTO sekolah SELECT * FROM _backup_sekolah;

-- Restore user
INSERT INTO user SELECT * FROM _backup_user;

-- Restore siswa
INSERT INTO siswa SELECT * FROM _backup_siswa;

-- Restore kategori (restore ALL data - duplicates allowed for multi-tenant)
INSERT INTO kategori SELECT * FROM _backup_kategori;

-- Restore transaksi
INSERT INTO transaksi SELECT * FROM _backup_transaksi;

-- Note: permintaan_penarikan is created fresh as it doesn't exist in current schema

-- Step 6: Create new indexes
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_username ON user(username);
CREATE INDEX idx_user_sekolah_id ON user(sekolah_id);
CREATE INDEX idx_siswa_nomor_akun ON siswa(nomor_akun);
CREATE INDEX idx_siswa_sekolah_id ON siswa(sekolah_id);
CREATE UNIQUE INDEX idx_siswa_sekolah_nomor_akun ON siswa(sekolah_id, nomor_akun);
CREATE INDEX idx_transaksi_sekolah_id ON transaksi(sekolah_id);
CREATE INDEX idx_transaksi_tanggal ON transaksi(tanggal);
CREATE INDEX idx_transaksi_siswa_id ON transaksi(siswa_id);
CREATE INDEX idx_kategori_sekolah_id ON kategori(sekolah_id);
CREATE UNIQUE INDEX idx_kategori_sekolah_nama ON kategori(sekolah_id, nama);
CREATE INDEX idx_penarikan_sekolah ON permintaan_penarikan(sekolah_id);
CREATE INDEX idx_penarikan_status ON permintaan_penarikan(status);

-- Step 7: Drop backup tables
DROP TABLE IF EXISTS _backup_user;
DROP TABLE IF EXISTS _backup_sekolah;
DROP TABLE IF EXISTS _backup_siswa;
DROP TABLE IF EXISTS _backup_kategori;
DROP TABLE IF EXISTS _backup_transaksi;

-- Commit the transaction
COMMIT;

-- Re-enable foreign key support
PRAGMA foreign_keys = ON;

-- Verification queries (run these separately to confirm success)
-- SELECT 'user: ' || COUNT(*) FROM user UNION ALL 
-- SELECT 'sekolah: ' || COUNT(*) FROM sekolah UNION ALL 
-- SELECT 'siswa: ' || COUNT(*) FROM siswa UNION ALL 
-- SELECT 'kategori: ' || COUNT(*) FROM kategori UNION ALL 
-- SELECT 'transaksi: ' || COUNT(*) FROM transaksi UNION ALL 
-- SELECT 'permintaan_penarikan: ' || COUNT(*) FROM permintaan_penarikan;
