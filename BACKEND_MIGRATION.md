# SvelteKit Backend Migration

Backend SvelteKit untuk Sistem Informasi Infaq & Jariyah dengan SQLite database.

## 📋 Ringkasan Migrasi

Backend telah dimigrasi dari **Flask (Python)** ke **SvelteKit (TypeScript)** dengan fitur:

- ✅ **Single Server** - Tidak perlu Flask lagi, semua dalam 1 server Node.js
- ✅ **SQLite Database** - Database file-based di `/data/infaq_jariyah.db`
- ✅ **API Routes** - Semua endpoint Flask tersedia di `/api/*`
- ✅ **Session Management** - Cookie-based authentication
- ✅ **TypeScript** - Full type safety

## 🏗️ Struktur Folder

```
sveltekit/
├── src/
│   ├── lib/
│   │   ├── server/           # Server-side code
│   │   │   ├── db/           # Database connection
│   │   │   ├── models/       # Data models (User, Siswa, Transaksi, Kategori)
│   │   │   └── auth/         # Authentication utilities
│   │   ├── api.ts            # API client (updated for /api)
│   │   └── auth.ts           # Auth client (updated for /api)
│   └── routes/
│       ├── api/              # API endpoints
│       │   ├── auth/         # Login, logout, me, reset-password, change-password
│       │   ├── siswa/        # CRUD + upload-excel + download-template
│       │   ├── transaksi/    # CRUD + stats + senders
│       │   ├── kategori/     # CRUD
│       │   └── health/       # Health check
│       └── (frontend pages)
├── data/
│   └── infaq_jariyah.db      # SQLite database
└── build/                     # Production build
```

## 🚀 Cara Menjalankan

### Development

```bash
cd sveltekit
npm install
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Production Build

```bash
cd sveltekit
npm run build
node build
```

## 📡 API Endpoints

Semua endpoint tersedia di `/api/*`

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password

### Siswa
- `GET /api/siswa` - Get all siswa
- `POST /api/siswa` - Create siswa
- `GET /api/siswa/:id` - Get siswa by ID
- `PUT /api/siswa/:id` - Update siswa
- `DELETE /api/siswa/:id` - Delete siswa
- `POST /api/siswa/upload-excel` - Upload Excel file
- `GET /api/siswa/download-template` - Download template Excel

### Transaksi
- `GET /api/transaksi` - Get all transaksi (with filters)
- `POST /api/transaksi` - Create transaksi
- `GET /api/transaksi/:id` - Get transaksi by ID
- `PUT /api/transaksi/:id` - Update transaksi
- `DELETE /api/transaksi/:id` - Delete transaksi
- `GET /api/transaksi/stats` - Get statistics
- `GET /api/transaksi/senders` - Get sender summaries

### Kategori
- `GET /api/kategori` - Get all kategori
- `POST /api/kategori` - Create kategori
- `DELETE /api/kategori/:id` - Delete kategori

### Health
- `GET /api/health` - Health check

## 🗄️ Database

Database SQLite disimpan di:
```
/data/infaq_jariyah.db
```

### Backup Database
```bash
cp /data/infaq_jariyah.db /backup/infaq_jariyah_backup.db
```

### Migrasi dari MySQL
Jika ingin migrasi dari MySQL ke SQLite:
```bash
cd flask_backend
python export_to_sqlite.py
```

## 🔐 Authentication

Authentication menggunakan **cookie-based session**:
- Session disimpan di cookie `session_user_id`
- Session timeout: 7 hari
- Cookie hanya dikirim via HTTPS di production

## 📦 Dependencies

### Runtime
- `better-sqlite3` - SQLite database
- `bcryptjs` - Password hashing
- `uuid` - ID generation
- `xlsx` - Excel file handling

### Development
- `@sveltejs/adapter-node` - Node.js deployment
- `@types/better-sqlite3` - TypeScript types
- `@types/bcryptjs` - TypeScript types
- `@types/uuid` - TypeScript types

## 🛠️ Troubleshooting

### Database tidak ditemukan
Pastikan folder `/data` ada dan file database ada:
```bash
ls -la /data/
```

### Permission error
Berikan permission yang tepat:
```bash
chmod 644 /data/infaq_jariyah.db
chmod 755 /data/
```

### Build error
Clean dan rebuild:
```bash
rm -rf node_modules build .svelte-kit
npm install
npm run build
```

## 📊 Perbandingan Flask vs SvelteKit

| Aspek | Flask (Old) | SvelteKit (New) |
|-------|-------------|-----------------|
| Language | Python | TypeScript |
| Database | MySQL | SQLite |
| Server | 2 servers (Flask + SvelteKit) | 1 server |
| CORS | Required | Not needed |
| Type Safety | ❌ | ✅ |
| File Upload | Flask | Native SvelteKit |
| Session | Flask session | Cookie-based |

## 🎯 Next Steps

1. ✅ Migration completed
2. ✅ All endpoints working
3. ⏳ Test frontend integration
4. ⏳ Deploy to production
5. ⏳ Remove Flask backend

## 📝 Notes

- Frontend tidak perlu diubah karena API endpoint sama (`/api/*`)
- Base URL berubah dari `http://localhost:5000/api` menjadi `/api`
- File `api.ts` dan `auth.ts` sudah diupdate untuk menggunakan relative path
