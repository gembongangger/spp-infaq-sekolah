-- Schema untuk database Infaq Sekolah
-- Jalankan di Turso: turso db shell infaqsekolahdb < schema.sql

-- Table: sekolah (created first due to foreign key dependencies)
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
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL
);

-- Table: user
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
	updated_at TEXT NOT NULL,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);

-- Table: siswa
CREATE TABLE IF NOT EXISTS siswa (
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
CREATE TABLE IF NOT EXISTS kategori (
	id TEXT PRIMARY KEY,
	nama TEXT NOT NULL,
	ikon TEXT,
	warna TEXT,
	sekolah_id TEXT,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);

-- Table: transaksi
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
	updated_at TEXT,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id),
	FOREIGN KEY (siswa_id) REFERENCES siswa(id)
);

-- Table: permintaan_penarikan
CREATE TABLE IF NOT EXISTS permintaan_penarikan (
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

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON user(username);
CREATE INDEX IF NOT EXISTS idx_user_sekolah_id ON user(sekolah_id);
CREATE INDEX IF NOT EXISTS idx_siswa_nomor_akun ON siswa(nomor_akun);
CREATE INDEX IF NOT EXISTS idx_siswa_sekolah_id ON siswa(sekolah_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_siswa_sekolah_nomor_akun ON siswa(sekolah_id, nomor_akun);
CREATE INDEX IF NOT EXISTS idx_transaksi_sekolah_id ON transaksi(sekolah_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi(tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_siswa_id ON transaksi(siswa_id);
CREATE INDEX IF NOT EXISTS idx_kategori_sekolah_id ON kategori(sekolah_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_kategori_sekolah_nama ON kategori(sekolah_id, nama);
CREATE INDEX IF NOT EXISTS idx_penarikan_sekolah ON permintaan_penarikan(sekolah_id);
CREATE INDEX IF NOT EXISTS idx_penarikan_status ON permintaan_penarikan(status);
