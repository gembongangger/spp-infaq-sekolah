# 🚀 Setup Database Turso Anda

Database Turso Anda sudah ada:
- **Database:** `infaqsekolahdb`
- **URL:** `libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io`

## 📋 Langkah Lengkap (Step-by-Step)

### **Step 1: Install Turso CLI**

```bash
# macOS
brew install tursodatabase/tap/turso

# Verifikasi install
turso --version
```

### **Step 2: Login ke Turso**

```bash
turso auth login
```

Browser akan terbuka. Login dengan akun Turso Anda.

### **Step 3: Import Schema**

```bash
# Pastikan Anda di folder project
cd /mnt/data/web/daddyProjectInfaq_sqlite/sveltekit_linux_infaq_multitenant

# Import schema ke database
turso db shell infaqsekolahdb < schema.sql
```

**Verifikasi schema berhasil:**

```bash
turso db shell infaqsekolahdb

# Di dalam shell, ketik:
.tables

# Anda harus melihat:
# kategori    siswa       transaksi   user        sekolah

# Keluar:
.exit
```

### **Step 4: Buat Auth Token**

```bash
turso db tokens create infaqsekolahdb
```

**Output akan seperti ini:**
```
eyJhbGciOiJFZERTQSIsImlhdCI6...
```

**⚠️ PENTING: Copy token ini! Anda akan membutuhkannya.**

### **Step 5: Install Dependencies**

```bash
npm install
```

### **Step 6: Setup Environment Variables**

Edit file `.env.local` (sudah dibuat):

```bash
# Buka file .env.local
nano .env.local
# atau
code .env.local
```

Update dengan token Anda:

```env
TURSO_CONNECTION_URL=libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=<PASTE_TOKEN_ANDA_DISINI>

# Session secret (bebas, minimal 32 karakter)
SESSION_SECRET=my-super-secret-key-for-development-123456

NODE_ENV=development
```

### **Step 7: Buat Superadmin User**

```bash
# Jalankan script create superadmin
node scripts/create-superadmin.js
```

Script akan menanyakan:
```
🚀 Create Superadmin User

📡 Connecting to: libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io

✅ Connected to database

Enter superadmin details:

Email: admin@sekolah.com
Password (min 6 chars): admin123
Full Name: Administrator
Phone Number (optional): 08123456789
```

**Output sukses:**
```
✅ Superadmin created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID:       xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Email:    admin@sekolah.com
Username: admin
Name:     Administrator
Role:     superadmin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You can now login at: http://localhost:5173/login
```

### **Step 8: Test Aplikasi**

```bash
# Jalankan development server
npm run dev

# Buka browser: http://localhost:5173
# Login dengan:
# Email: admin@sekolah.com
# Password: admin123 (atau yang Anda set)
```

### **Step 9: Verify Database Connection**

```bash
# Test health endpoint
curl http://localhost:5173/api/health

# Expected:
# {"success":true,"message":"API is running","database":"connected"}
```

## 🎯 Quick Commands (Cheat Sheet)

```bash
# Install deps
npm install

# Import schema
turso db shell infaqsekolahdb < schema.sql

# Create token
turso db tokens create infaqsekolahdb

# Create superadmin
node scripts/create-superadmin.js

# Run dev
npm run dev

# Build
npm run build

# Preview production
npm run preview
```

## 📊 Database Tables

Setelah import schema, database Anda akan punya 5 tables:

| Table | Deskripsi |
|-------|-----------|
| `user` | User accounts (superadmin & admin) |
| `sekolah` | Data sekolah (multi-tenant) |
| `siswa` | Data siswa |
| `kategori` | Kategori transaksi (infaq, jariyah, dll) |
| `transaksi` | Transaksi keuangan |

## 🔧 Troubleshooting

### **Error: "table already exists"**

✅ **Tidak masalah!** Tables sudah ada dari sebelumnya. Lanjutkan ke step berikutnya.

### **Error: "authentication failed"**

```bash
# Re-login
turso auth login

# Create token baru
turso db tokens create infaqsekolahdb

# Update .env.local dengan token baru
```

### **Error: "database not found"**

```bash
# Check database ada
turso db list

# Verify database
turso db show infaqsekolahdb
```

### **Error saat create superadmin**

```bash
# Check .env.local sudah benar
cat .env.local

# Test connection langsung
turso db shell infaqsekolahdb "SELECT 1"
```

### **App tidak bisa connect ke database**

1. Check `.env.local` - pastikan `TURSO_AUTH_TOKEN` benar
2. Check token belum expired
3. Recreate token: `turso db tokens create infaqsekolahdb`

## 🌐 Deploy ke Netlify

Setelah sukses di lokal:

### **1. Push Code**
```bash
git add .
git commit -m "Setup Turso database"
git push origin main
```

### **2. Set Netlify Environment Variables**

Di Netlify Dashboard → Site settings → Environment variables:

```
TURSO_CONNECTION_URL=libsql://infaqsekolahdb-gembongangger.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=<token-anda>
SESSION_SECRET=<random-secret-min-32-chars>
NODE_ENV=production
```

### **3. Deploy**

```bash
netlify deploy --prod
```

Atau via dashboard: klik "Deploy site"

## 📚 File-file Penting

| File | Deskripsi |
|------|-----------|
| `schema.sql` | Database schema (5 tables) |
| `.env.local` | Environment variables lokal |
| `setup-turso.sh` | Script setup otomatis |
| `scripts/create-superadmin.js` | Script buat user pertama |
| `SETUP_TURSO_DATABASE.md` | Dokumentasi lengkap |

## ✅ Checklist Setup

- [ ] Turso CLI terinstall
- [ ] Login ke Turso (`turso auth login`)
- [ ] Schema imported (`turso db shell infaqsekolahdb < schema.sql`)
- [ ] Auth token dibuat
- [ ] `.env.local` diupdate dengan token
- [ ] Dependencies installed (`npm install`)
- [ ] Superadmin dibuat (`node scripts/create-superadmin.js`)
- [ ] App running (`npm run dev`)
- [ ] Login berhasil
- [ ] Health check passing

---

**Database Anda siap digunakan! 🎉**

Jika ada masalah, check file: `SETUP_TURSO_DATABASE.md` untuk troubleshooting detail.
