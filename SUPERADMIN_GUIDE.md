# Superadmin Dashboard - Panduan Lengkap

## Overview
Superadmin Dashboard adalah panel kontrol khusus untuk pengelola sistem yang dapat:
- Mendaftarkan sekolah baru
- Mengelola admin untuk setiap sekolah
- Melihat statistik seluruh sistem

## Akses Superadmin

### URL
- **Login Superadmin**: `http://localhost:5173/superadmin/login`
- **Dashboard Superadmin**: `http://localhost:5173/superadmin/dashboard`

### Credentials Default
| Role | Username | Password | Email |
|------|----------|----------|-------|
| Superadmin | `superadmin` | `superadmin` | `superadmin@infaq.app` |

**Catatan**: Login menggunakan **email** (`superadmin@infaq.app`) atau **username** (`superadmin`) sama-sama bisa.

## Fitur Dashboard

### 1. Kelola Sekolah
Menambah, mengedit, dan menonaktifkan sekolah.

#### Menambah Sekolah Baru
1. Klik tab **"Kelola Sekolah"**
2. Klik tombol **"Tambah Sekolah"**
3. Isi form:
   - **Nama Sekolah** (wajib): Nama lengkap sekolah, contoh: "MAN 1 Jember"
   - **Kode Sekolah** (wajib): Kode unik dalam huruf kapital, contoh: "MAN1JEMBER"
   - **Alamat** (opsional): Alamat sekolah
   - **NPSN** (opsional): Nomor Pokok Sekolah Nasional
   - **Nama Kepala Sekolah** (opsional)
   - **No. HP Kepala Sekolah** (opsional)
4. Klik **"Tambah Sekolah"**

#### Edit Sekolah
1. Klik ikon **Edit** (pensil) pada sekolah yang ingin diedit
2. Ubah data yang diperlukan
3. Klik **"Simpan Perubahan"**

#### Nonaktifkan Sekolah
1. Klik ikon **Hapus** (tempat sampah) pada sekolah
2. Konfirmasi penghapusan
3. Sekolah akan dinonaktifkan (soft delete), data tetap ada tapi tidak aktif

### 2. Kelola Admin Sekolah
Menambah, mengedit, dan menonaktifkan admin untuk setiap sekolah.

#### Menambah Admin Sekolah Baru
1. Klik tab **"Kelola Admin"**
2. Klik tombol **"Tambah Admin"**
3. Isi form:
   - **Email** (wajib): Email admin, contoh: "admin@sekolah.com"
   - **Password** (wajib): Minimal 6 karakter
   - **Sekolah** (wajib): Pilih sekolah dari dropdown
   - **Role** (opsional): Pilih "Admin" atau "Operator"
   - **Nama Lengkap** (opsional)
   - **No. HP** (opsional)
4. Klik **"Tambah Admin"**

#### Edit Admin Sekolah
1. Klik ikon **Edit** (pensil) pada admin yang ingin diedit
2. Ubah data yang diperlukan
3. Untuk mengubah password, isi field **"Password Baru"**
4. Klik **"Simpan Perubahan"**

#### Nonaktifkan Admin
1. Klik ikon **Hapus** (tempat sampah) pada admin
2. Konfirmasi penghapusan
3. Admin akan dinonaktifkan (soft delete)

### 3. Statistik Sistem
Melihat ringkasan data seluruh sekolah dalam sistem.

#### Informasi yang Ditampilkan
- **Total Sekolah**: Jumlah sekolah yang terdaftar
- **Total Admin**: Jumlah admin seluruh sekolah
- **Total Siswa**: Jumlah siswa seluruh sekolah
- **Total Transaksi**: Jumlah transaksi seluruh sekolah

#### Tabel Detail Per Sekolah
Menampilkan breakdown data per sekolah:
- Nama dan kode sekolah
- Status (Aktif/Nonaktif)
- Jumlah admin
- Jumlah siswa
- Jumlah transaksi
- Jumlah kategori

## API Endpoints

### Sekolah Management

#### GET /api/superadmin/sekolah
Mendapatkan daftar semua sekolah beserta statistiknya.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sekolah_man1jember_001",
      "nama": "MAN 1 Jember",
      "kode": "MAN1JEMBER",
      "alamat": "Jember, Jawa Timur",
      "npsn": null,
      "namaKepala": null,
      "noHpKepala": null,
      "logoUrl": null,
      "isActive": true,
      "createdAt": "2026-04-03T05:44:06.737Z",
      "updatedAt": "2026-04-03T05:44:06.737Z",
      "stats": {
        "totalUsers": 1,
        "totalSiswa": 41,
        "totalTransaksi": 13,
        "totalKategori": 4
      }
    }
  ]
}
```

#### POST /api/superadmin/sekolah
Membuat sekolah baru.

**Request Body:**
```json
{
  "nama": "SMP 1 Jakarta",
  "kode": "SMP1JAKARTA",
  "alamat": "Jakarta Pusat",
  "npsn": "12345678",
  "namaKepala": "Drs. Ahmad",
  "noHpKepala": "081234567890"
}
```

#### PUT /api/superadmin/sekolah/[id]
Memperbarui data sekolah.

**Request Body:**
```json
{
  "nama": "MAN 1 Jember Updated",
  "alamat": "Jember, Jawa Timur (Updated)"
}
```

#### DELETE /api/superadmin/sekolah/[id]
Menonaktifkan sekolah (soft delete).

### Admin Sekolah Management

#### GET /api/superadmin/admin-sekolah
Mendapatkan daftar semua admin sekolah.

**Query Parameters:**
- `sekolah_id` (opsional): Filter berdasarkan sekolah

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_superadmin_001",
      "username": "superadmin",
      "email": "superadmin@infaq.app",
      "role": "superadmin",
      "sekolahId": null,
      "sekolahNama": null,
      "isActive": true,
      "namaLengkap": "Super Administrator",
      "noHp": null,
      "createdAt": "2026-04-03T05:44:06.824Z"
    }
  ]
}
```

#### POST /api/superadmin/admin-sekolah
Membuat admin sekolah baru.

**Request Body:**
```json
{
  "email": "admin@sekolah.com",
  "password": "admin123",
  "sekolah_id": "sekolah_man1jember_001",
  "role": "admin",
  "nama_lengkap": "Admin Sekolah",
  "no_hp": "081234567890"
}
```

#### PUT /api/superadmin/admin-sekolah/[id]
Memperbarui data admin sekolah.

**Request Body:**
```json
{
  "email": "admin@sekolah.com",
  "password": "newpassword123",
  "role": "admin",
  "sekolah_id": "sekolah_man1jember_001",
  "nama_lengkap": "Admin Updated",
  "no_hp": "081234567890",
  "is_active": true
}
```

#### DELETE /api/superadmin/admin-sekolah/[id]
Menonaktifkan admin sekolah (soft delete).

## Struktur File

### Routes
```
src/routes/
├── superadmin/
│   ├── login/
│   │   └── +page.svelte          # Halaman login superadmin
│   └── dashboard/
│       ├── +page.svelte           # Dashboard layout
│       └── tabs/
│           ├── SekolahTab.svelte  # Tab kelola sekolah
│           ├── AdminTab.svelte    # Tab kelola admin
│           ├── StatsTab.svelte    # Tab statistik
│           └── Modal.svelte       # Komponen modal
```

### API Routes
```
src/routes/api/
└── superadmin/
    ├── sekolah/
    │   ├── +server.ts             # GET, POST sekolah
    │   └── [id]/
    │       └── +server.ts         # GET, PUT, DELETE sekolah
    └── admin-sekolah/
        ├── +server.ts             # GET, POST admin
        └── [id]/
            └── +server.ts         # PUT, DELETE admin
```

## Keamanan

### Authentication Guard
- Semua endpoint `/api/superadmin/*` memerlukan autentikasi
- Hanya user dengan role `superadmin` yang dapat mengakses
- Jika user bukan superadmin, akan mendapat error 403 (Forbidden)

### Password Hashing
- Password di-hash menggunakan bcrypt dengan 10 salt rounds
- Password tidak pernah disimpan dalam plain text

### Soft Delete
- Penghapusan sekolah dan admin menggunakan soft delete
- Data tidak benar-benar dihapus, hanya di-set `is_active = 0`
- Memungkinkan untuk restore data jika diperlukan

## Workflow Khas

### Mendaftarkan Sekolah Baru dengan Adminnya

1. **Login sebagai Superadmin**
   - Buka: `http://localhost:5173/superadmin/login`
   - Login dengan: `superadmin@infaq.app` / `superadmin`

2. **Tambah Sekolah**
   - Di dashboard, klik tab **"Kelola Sekolah"**
   - Klik **"Tambah Sekolah"**
   - Isi data sekolah baru
   - Klik **"Tambah Sekolah"**

3. **Tambah Admin untuk Sekolah Tersebut**
   - Pindah ke tab **"Kelola Admin"**
   - Klik **"Tambah Admin"**
   - Isi email dan password untuk admin
   - Pilih sekolah yang baru dibuat
   - Klik **"Tambah Admin"**

4. **Selesai**
   - Admin sekarang bisa login di `/login` dengan email dan password yang dibuat
   - Admin hanya bisa melihat data sekolahnya sendiri

## Troubleshooting

### Tidak Bisa Login sebagai Superadmin
- Pastikan menggunakan email: `superadmin@infaq.app`
- Pastikan password: `superadmin`
- Cek apakah user superadmin ada di database

### Error 403 saat Akses API
- Pastikan sudah login sebagai superadmin
- Cek role user di database, harus `superadmin`

### Sekolah/Admin Tidak Muncul
- Cek apakah `is_active = 1` di database
- Data dengan `is_active = 0` tidak ditampilkan

## Database Schema

### Tabel Sekolah
```sql
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
```

### Tabel User (dengan sekolah_id)
```sql
ALTER TABLE user ADD COLUMN sekolah_id TEXT REFERENCES sekolah(id);
```

## Catatan Penting

1. **Superadmin tidak terikat pada sekolah tertentu** (`sekolah_id = NULL`)
2. **Admin sekolah harus terikat pada satu sekolah** (`sekolah_id` wajib diisi)
3. **Kode sekolah harus unik** dan disarankan dalam huruf kapital
4. **Soft delete** digunakan untuk menjaga integritas data historis
5. **Session** menggunakan cookie httpOnly dengan masa berlaku 7 hari

## Contoh Penggunaan

### Membuat Sekolah dan Admin Baru via API

```bash
# 1. Login dan simpan cookie
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@infaq.app","password":"superadmin"}' \
  -c /tmp/cookies.txt

# 2. Buat sekolah baru
curl -X POST http://localhost:5173/api/superadmin/sekolah \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "SMP 2 Bandung",
    "kode": "SMP2BANDUNG",
    "alamat": "Bandung, Jawa Barat"
  }'

# 3. Buat admin untuk sekolah tersebut
curl -X POST http://localhost:5173/api/superadmin/admin-sekolah \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@smp2bandung.com",
    "password": "admin123",
    "sekolah_id": "<sekolah_id_dari_response_sebelumnya>",
    "role": "admin"
  }'
```

## Support

Untuk pertanyaan atau masalah, silakan hubungi tim pengembang.
