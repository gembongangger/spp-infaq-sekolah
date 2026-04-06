PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
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
INSERT INTO sekolah VALUES('aa7de486-6213-4209-898a-4dd25213ebc4','MAN 1 JEMBER','MAN1JEMBER','jl imam bonjol 40','3434333','mr. kepsek','33433223',NULL,1,'2026-04-03T10:38:06.911Z','2026-04-03T10:38:06.911Z');
INSERT INTO sekolah VALUES('654b92e2-13c1-45cf-8f45-a0a11e29cfcc','MAN 2 JEMBER','MAN2JEMBER','Gebang Jember','22344553','Kepsek Man 2 Jember','00988746634',NULL,1,'2026-04-06T01:34:39.793Z','2026-04-06T01:34:39.793Z');
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
INSERT INTO user VALUES('79f39e83-bf86-49ef-a1b2-3356b645e3a0','gembongangger','gembongangger@gmail.com','$2b$10$f/ToJS0VMes3.w2h/3cnguwyu19jCh5w11/ldNUZ4ICDFD/2vQkTK','superadmin',NULL,1,'gembong angger waspodo','085606143303',NULL,'2026-04-03T09:14:44.957Z','2026-04-03T09:14:44.957Z');
INSERT INTO user VALUES('1ef1a589-66e3-444a-b889-2648ee63975d','dedytugashms@gmail.com','dedytugashms@gmail.com','$2b$10$YPfySrSxVV8tJ/./GloLs.5fZC76yj.Bv8SPoYi9RkYWdJ2uq92ly','admin','aa7de486-6213-4209-898a-4dd25213ebc4',1,NULL,NULL,NULL,'2026-04-03T10:39:36.807Z','2026-04-03T10:39:36.807Z');
INSERT INTO user VALUES('20f7b1af-76ea-439e-a0c5-5f672fcd9880','adminman2jember@gmail.com','adminman2jember@gmail.com','$2b$10$t95q.LzI1p6yHWr0LqeKZeFn0DBEX8RC0muK2vubdCm6CTGnoaYdC','admin','654b92e2-13c1-45cf-8f45-a0a11e29cfcc',1,NULL,NULL,NULL,'2026-04-06T01:35:43.465Z','2026-04-06T01:35:43.465Z');
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
INSERT INTO siswa VALUES('4e3c6d40-bb95-4749-a37a-b210d3f99a69','112','adi sucipto','x ipa 1','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-03T11:16:01.594Z','2026-04-03T11:16:01.594Z');
INSERT INTO siswa VALUES('626474f5-f980-49a5-a6dd-4d858ab88f74','923','adnan sayid','x ipa 2','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-03T11:20:32.132Z','2026-04-03T11:20:32.132Z');
INSERT INTO siswa VALUES('80dddc1e-a6ba-449c-b331-a094bbfa1b76','s112','Ahmad Fauzi yaya','X IPA 1','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-03T11:43:20.677Z','2026-04-03T15:52:26.124Z');
INSERT INTO siswa VALUES('66a83be1-5652-413c-be31-665e66d3bf24','s234','Siti Nurhaliza','X IPA 2','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-03T11:43:21.054Z','2026-04-03T11:43:21.054Z');
INSERT INTO siswa VALUES('f9013c24-c7a2-42cf-be1c-9c560c538d73','s212','Budi Santoso','X IPS 1','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-03T11:43:21.492Z','2026-04-03T11:43:21.492Z');
INSERT INTO siswa VALUES('a0f3f917-075c-49eb-80a3-e0287c9b802a','s2124','santoso ali','x ipa 1','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-03T15:54:20.407Z','2026-04-03T15:54:20.407Z');
INSERT INTO siswa VALUES('2e440cdb-fedb-4a27-8e0d-fcd2692b02a3','123','Ahmad Fauzi MAN 2 Jember','X IPA 1','654b92e2-13c1-45cf-8f45-a0a11e29cfcc','2026-04-06T01:40:22.381Z','2026-04-06T01:40:22.381Z');
INSERT INTO siswa VALUES('df07f4ca-9349-40ab-94af-e5654b58db52','002','Siti Nurhaliza MAN 2 Jember','X IPA 2','654b92e2-13c1-45cf-8f45-a0a11e29cfcc','2026-04-06T01:40:22.751Z','2026-04-06T01:40:22.751Z');
INSERT INTO siswa VALUES('5558659a-a968-4808-914c-bb4c7f3eb5be','003','Budi Santoso MAN 2 Jember','X IPS 1','654b92e2-13c1-45cf-8f45-a0a11e29cfcc','2026-04-06T01:40:23.092Z','2026-04-06T01:40:23.092Z');
CREATE TABLE IF NOT EXISTS kategori (
	id TEXT PRIMARY KEY,
	nama TEXT NOT NULL,
	ikon TEXT,
	warna TEXT,
	sekolah_id TEXT,
	FOREIGN KEY (sekolah_id) REFERENCES sekolah(id)
);
INSERT INTO kategori VALUES('da4321aa-0621-46a7-8118-01e3462d8b13','penarikan uang','Heart','#c01c28','aa7de486-6213-4209-898a-4dd25213ebc4');
INSERT INTO kategori VALUES('01721103-0d31-40f7-8f95-c4659e7fb756','infaq','Heart','#10b981','654b92e2-13c1-45cf-8f45-a0a11e29cfcc');
INSERT INTO kategori VALUES('70533ded-cbc7-4f7b-9cff-e0c370e1e964','infaq','Heart','#10b981','aa7de486-6213-4209-898a-4dd25213ebc4');
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
INSERT INTO transaksi VALUES('e8bf1c6c-384e-4747-b912-b4f769bca046','2026-04-03','Infaq/SPP Bulan April 2026','infaq','masuk',350000,'tunai','626474f5-f980-49a5-a6dd-4d858ab88f74','adnan sayid','x ipa 2','923','2026-04','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-03T11:21:41.644Z','2026-04-03T11:21:41.644Z');
INSERT INTO transaksi VALUES('56f391d1-e8ac-43e6-8dac-cdf060153aac','2026-04-06','Infaq/SPP Bulan Maret 2026','infaq','masuk',250000,'tunai','df07f4ca-9349-40ab-94af-e5654b58db52','Siti Nurhaliza MAN 2 Jember','X IPA 2','002','2026-03','654b92e2-13c1-45cf-8f45-a0a11e29cfcc','2026-04-06T01:41:47.392Z','2026-04-06T01:41:47.392Z');
INSERT INTO transaksi VALUES('fc63b71a-ecd8-4a62-a4aa-270e3533476b','2026-04-06','Infaq/SPP Bulan April 2026','infaq','masuk',350000,'tunai','a0f3f917-075c-49eb-80a3-e0287c9b802a','santoso ali','x ipa 1','s2124','2026-04','aa7de486-6213-4209-898a-4dd25213ebc4','2026-04-06T08:50:12.079Z','2026-04-06T08:50:12.079Z');
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
COMMIT;
