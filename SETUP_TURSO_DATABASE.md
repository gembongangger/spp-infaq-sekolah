# 🗄️ Setup Database Turso: infaqsekolahdb

Database Turso Anda sudah dibuat:
- **Nama:** `infaqsekolahdb`
- **URL:** `libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io`

## 📋 Langkah Setup

### **Step 1: Install Turso CLI**

```bash
# macOS
brew install tursodatabase/tap/turso

# Windows (dengan scoop)
scoop bucket add tursodatabase https://github.com/tursodatabase/scoop
scoop install turso

# Linux
curl -sSfL https://get.tur.so/install.sh | bash
```

### **Step 2: Login ke Turso**

```bash
turso auth login
```

Browser akan terbuka untuk login ke akun Turso Anda.

### **Step 3: Import Schema ke Database**

**Opsi A: Menggunakan Script Otomatis (Termudah)**

```bash
./setup-turso.sh
```

Script ini akan:
- ✅ Check Turso CLI terinstall
- ✅ Import schema.sql ke database
- ✅ Buat auth token
- ✅ Tampilkan connection details

**Opsi B: Manual**

```bash
# Import schema
turso db shell infaqsekolahdb < schema.sql

# Buat token
turso db tokens create infaqsekolahdb
```

**Opsi C: Via Shell Interaktif**

```bash
# Connect ke database
turso db shell infaqsekolahdb

# Di dalam shell, copy-paste isi schema.sql
# Atau: .read schema.sql

# Keluar
.exit
```

### **Step 4: Verifikasi Schema**

```bash
# Connect ke database
turso db shell infaqsekolahdb

# Check tables
.tables

# Check schema
.schema user
.schema sekolah
.schema siswa
.schema kategori
.schema transaksi

# Exit
.exit
```

Anda harus melihat 5 tables: `user`, `sekolah`, `siswa`, `kategori`, `transaksi`

### **Step 5: Konfigurasi Aplikasi**

Edit file `.env.local`:

```bash
# Copy token dari step 3
TURSO_CONNECTION_URL=libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=<token-dari-step-3>

# Session secret (bebas, minimal 32 karakter)
SESSION_SECRET=your-random-secret-key-here

NODE_ENV=development
```

### **Step 6: Test Connection**

```bash
# Jalankan aplikasi
npm run dev

# Buka browser: http://localhost:5173

# Test health endpoint
curl http://localhost:5173/api/health

# Expected response:
# {"success":true,"message":"API is running","database":"connected"}
```

## 🎯 Quick Start Commands

```bash
# 1. Install Turso CLI
brew install tursodatabase/tap/turso

# 2. Login
turso auth login

# 3. Setup database (otomatis)
./setup-turso.sh

# 4. Copy token yang ditampilkan

# 5. Update .env.local
# Paste token ke TURSO_AUTH_TOKEN

# 6. Run app
npm run dev
```

## 📊 Schema Database

Database memiliki 5 tables:

### **user**
Menyimpan data user (superadmin, admin sekolah)
- id, username, email, password_hash
- role (superadmin/admin)
- sekolah_id (untuk admin)
- Profile: nama_lengkap, no_hp, foto_url

### **sekolah**
Data sekolah (multi-tenant)
- id, nama, kode (unik)
- alamat, npsn
- kepala sekolah info

### **siswa**
Data siswa per sekolah
- id, nomor_akun, nama, kelas
- sekolah_id

### **kategori**
Kategori transaksi (infaq, jariyah, dll)
- id, nama, ikon, warna
- sekolah_id

### **transaksi**
Transaksi keuangan
- id, tanggal, keterangan
- kategori, jenis (masuk/keluar)
- jumlah, metode (tunai/transfer)
- siswa info (opsional)
- sekolah_id

## 🔧 Troubleshooting

### **Error: "table already exists"**

Tables sudah ada. Tidak masalah, lanjutkan setup.

```bash
# Check tables yang ada
turso db shell infaqsekolahdb ".tables"
```

### **Error: "authentication failed"**

```bash
# Re-login
turso auth login

# Recreate token
turso db tokens create infaqsekolahdb
```

### **Error: "database not found"**

```bash
# List databases
turso db list

# Verify database exists
turso db show infaqsekolahdb
```

### **Connection timeout**

Check URL benar:
```
libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io
```

## 🚀 Deploy ke Netlify

Setelah berhasil di lokal:

1. **Push code ke Git**
   ```bash
   git add .
   git commit -m "Setup Turso database"
   git push
   ```

2. **Set Environment Variables di Netlify**
   ```
   TURSO_CONNECTION_URL=libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io
   TURSO_AUTH_TOKEN=<your-token>
   SESSION_SECRET=<your-secret>
   NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## 📚 Resources

- **Turso Dashboard:** https://turso.tech/
- **Turso Docs:** https://docs.turso.tech/
- **Turso Discord:** https://discord.com/invite/chV3pYsBtQ

---

**Database Anda siap digunakan! 🎉**
