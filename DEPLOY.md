# 🚀 Quick Deploy Guide

## Deploy ke Railway (5 Menit)

### 1. Persiapan Code

```bash
cd sveltekit

# Pastikan semua file sudah ada
ls -la Dockerfile railway.json .dockerignore
```

### 2. Push ke Git

```bash
git init
git add .
git commit -m "Ready for Railway deployment"

# Buat repo di GitHub, lalu:
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### 3. Deploy di Railway

1. Buka https://railway.app
2. Login dengan GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Pilih repo Anda
5. **Deploy**

### 4. Upload Database

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link ke project
railway link

# Upload database
railway volume upload ../data/infaq_jariyah.db --path /app/data/infaq_jariyah.db
```

### 5. Set Environment Variables

Di Railway Dashboard → Variables:

```
NODE_ENV=production
PORT=3000
DATABASE_PATH=/app/data/infaq_jariyah.db
SESSION_SECRET=<random-string>
```

Generate secret:
```bash
openssl rand -hex 32
```

### 6. Done! 🎉

Aplikasi live di: `https://<project>.railway.app`

---

## Local Testing

### Build & Run Production

```bash
npm run dev
# atau
npm run build && node build
```

Test:
```bash
curl http://localhost:3000/api/health
```

---

## Checklist Deployment

- [ ] Code di Git
- [ ] Railway project created
- [ ] Database uploaded
- [ ] Environment variables set
- [ ] Health check passed
- [ ] Login test
- [ ] CRUD test

---

## Troubleshooting

**Database not found:**
```bash
railway run bash
ls -la /app/data/
```

**Build failed:**
```bash
railway logs --build
```

**App crash:**
```bash
railway logs
```

---

## Costs

Railway Free:
- $5 credit/month
- Cukup untuk aplikasi ini!
- 512MB RAM, 1GB disk

---

## Next Steps

1. Setup custom domain (optional)
2. Enable HTTPS (automatic)
3. Setup backup database
4. Monitor di Railway dashboard
