# 🚀 Railway Deployment Guide

Deploy aplikasi Sistem Informasi Infaq & Jariyah ke Railway dengan SQLite persistent storage.

## 📋 Prerequisites

- ✅ Akun Railway (https://railway.app)
- ✅ Git repository (GitHub/GitLab)
- ✅ Database SQLite sudah di-export

## 🎯 Langkah Deployment

### 1. Persiapan File

Pastikan file berikut ada:

```
sveltekit/
├── Dockerfile              ✅
├── railway.json            ✅
├── .dockerignore           ✅
├── package.json            ✅
├── data/
│   └── infaq_jariyah.db    ✅ (akan di-upload terpisah)
└── ...
```

### 2. Push ke Git Repository

```bash
cd sveltekit

# Initialize git jika belum
git init
git add .
git commit -m "Initial commit for Railway deployment"

# Add remote (ganti dengan repo Anda)
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### 3. Deploy ke Railway

#### Cara 1: Dari GitHub (Recommended)

1. Login ke https://railway.app
2. Klik **"New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Pilih repository Anda
5. Railway akan otomatis detect `railway.json` dan `Dockerfile`

#### Cara 2: Dari CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 4. Upload Database

Karena SQLite file tidak bisa di-commit ke Git, upload terpisah:

#### Opsi A: Via Railway CLI (Recommended)

```bash
# Connect ke project Railway
railway link

# Upload database file
railway volume upload ./data/infaq_jariyah.db --path /app/data/infaq_jariyah.db
```

#### Opsi B: Via Railway Dashboard

1. Buka project di Railway dashboard
2. Klik **"Volumes"** tab
3. Klik **"Create Volume"**
4. Set mount path: `/app/data`
5. Upload file via SSH atau SCP:
   ```bash
   # Dapatkan SSH access dari Railway dashboard
   scp data/infaq_jariyah.db <user>@<host>:/app/data/
   ```

#### Opsi C: Via Docker Volume

Jika menggunakan Docker Compose lokal:

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - DATABASE_PATH=/app/data/infaq_jariyah.db
```

### 5. Set Environment Variables

Di Railway Dashboard → Variables:

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=/app/data/infaq_jariyah.db
SESSION_SECRET=<generate-random-string>
```

Generate secret key:
```bash
openssl rand -hex 32
```

### 6. Configure Domain (Optional)

1. Buka **"Settings"** di Railway
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"** atau add custom domain

### 7. Deploy!

Railway akan otomatis deploy setelah push ke Git:

```bash
git push origin main
```

Atau manual deploy via CLI:
```bash
railway up
```

## 🔍 Monitoring

### Logs
```bash
railway logs
```

### Health Check
```bash
curl https://<your-domain>.railway.app/api/health
```

### Metrics
- CPU usage
- Memory usage
- Request count
- Response time

Lihat di Railway Dashboard → Metrics

## 💰 Pricing

Railway Free Tier:
- $5 credit/month
- 512MB RAM
- 1GB disk storage
- Cukup untuk aplikasi ini!

Upgrade ke Hobby ($5/mo):
- More RAM
- More disk
- Priority support

## 🔧 Troubleshooting

### Database tidak ditemukan

Pastikan volume sudah di-mount:
```bash
railway run bash
ls -la /app/data/
```

Jika kosong, upload database:
```bash
railway volume upload ./data/infaq_jariyah.db --path /app/data/infaq_jariyah.db
```

### Build gagal

Check logs:
```bash
railway logs --build
```

Common issues:
- Node version mismatch → Update Dockerfile
- Missing dependencies → Check package.json
- Native module errors → Install build tools

### App crash loop

Check restart policy di `railway.json`:
```json
{
  "deploy": {
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 📊 Update Aplikasi

Setiap kali ada perubahan:

```bash
# Commit dan push
git add .
git commit -m "Update feature X"
git push origin main

# Railway akan auto-deploy!
```

Manual deploy:
```bash
railway up
```

## 🎯 Checklist Deployment

- [ ] Push code ke Git
- [ ] Create project di Railway
- [ ] Connect GitHub repo
- [ ] Upload database file
- [ ] Set environment variables
- [ ] Generate SESSION_SECRET
- [ ] Deploy
- [ ] Test health endpoint
- [ ] Test login
- [ ] Test CRUD operations
- [ ] Configure domain (optional)

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Issues: https://github.com/username/repo/issues

## 🎉 Done!

Aplikasi Anda sekarang live di Railway!

URL: `https://<project-name>.railway.app`
