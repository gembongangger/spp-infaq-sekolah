-- Migration Script: Update local database schema to match Turso
-- This safely migrates local SQLite to match Turso's multi-tenant schema

PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

-- Step 1: Create backup tables
CREATE TABLE IF NOT EXISTS _backup_user AS SELECT * FROM user;
CREATE TABLE IF NOT EXISTS _backup_sekolah AS SELECT * FROM sekolah;
CREATE TABLE IF NOT EXISTS _backup_siswa AS SELECT * FROM siswa;
CREATE TABLE IF NOT EXISTS _backup_kategori AS SELECT * FROM kategori;
CREATE TABLE IF NOT EXISTS _backup_transaksi AS SELECT * FROM transaksi;
CREATE TABLE IF NOT EXISTS _backup_permintaan_penarikan AS SELECT * FROM permintaan_penarikan;

-- Step 2: Drop old tables and indexes
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS sekolah;
DROP TABLE IF EXISTS siswa;
DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS transaksi;
DROP TABLE IF EXISTS permintaan_penarikan;

-- Step 3: Create new tables with Turso schema

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

CREATE TABLE kategori (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    ikon TEXT,
    warna TEXT,
    sekolah_id TEXT,
    FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);

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

-- Step 4: Restore all data (explicit column mapping to avoid order issues)

-- Restore sekolah
INSERT INTO sekolah (id, nama, kode, alamat, npsn, nama_kepala, no_hp_kepala, logo_url, is_active, created_at, updated_at)
SELECT id, nama, kode, alamat, npsn, nama_kepala, no_hp_kepala, logo_url, is_active, created_at, updated_at FROM _backup_sekolah;

-- Restore user
INSERT INTO user (id, username, email, password_hash, role, sekolah_id, is_active, nama_lengkap, no_hp, foto_url, created_at, updated_at)
SELECT id, username, email, password_hash, role, sekolah_id, is_active, nama_lengkap, no_hp, foto_url, created_at, updated_at FROM _backup_user;

-- Restore siswa
INSERT INTO siswa (id, nomor_akun, nama, kelas, sekolah_id, created_at, updated_at)
SELECT id, nomor_akun, nama, kelas, sekolah_id, created_at, updated_at FROM _backup_siswa;

-- Restore kategori
INSERT INTO kategori (id, nama, ikon, warna, sekolah_id)
SELECT id, nama, ikon, warna, sekolah_id FROM _backup_kategori;

-- Restore transaksi
INSERT INTO transaksi (id, tanggal, keterangan, kategori, jenis, jumlah, metode, siswa_id, nama_pengirim, kelas_pengirim, nomor_akun, bulan, sekolah_id, created_at, updated_at)
SELECT id, tanggal, keterangan, kategori, jenis, jumlah, metode, siswa_id, nama_pengirim, kelas_pengirim, nomor_akun, bulan, sekolah_id, created_at, updated_at FROM _backup_transaksi;

-- Restore permintaan_penarikan
INSERT INTO permintaan_penarikan (id, sekolah_id, jumlah, keterangan, status, dibuat_oleh, diproses_oleh, tanggal_diproses, created_at, updated_at)
SELECT id, sekolah_id, jumlah, keterangan, status, dibuat_oleh, diproses_oleh, tanggal_diproses, created_at, updated_at FROM _backup_permintaan_penarikan;

-- Step 5: Create indexes (including composite unique)
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

-- Step 6: Drop backup tables
DROP TABLE IF EXISTS _backup_user;
DROP TABLE IF EXISTS _backup_sekolah;
DROP TABLE IF EXISTS _backup_siswa;
DROP TABLE IF EXISTS _backup_kategori;
DROP TABLE IF EXISTS _backup_transaksi;
DROP TABLE IF EXISTS _backup_permintaan_penarikan;

COMMIT;

PRAGMA foreign_keys = ON;
