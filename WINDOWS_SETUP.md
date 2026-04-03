# Windows Deployment Guide

## 🚀 Quick Start (Windows)

### 1. Install Dependencies

```powershell
# Open PowerShell or Command Prompt as Administrator
npm install
```

### 2. Run Development Server

**Option 1: Use batch script**
```cmd
dev.bat
```

**Option 2: Manual**
```cmd
npm run dev
```

### 3. Run Production Server

**Option 1: Use batch script**
```cmd
start.bat
```

**Option 2: Manual**
```cmd
npm run build
node build
```

---

## 📁 Database Location

Database SQLite disimpan di:
```
../data/infaq_jariyah.db
```

Atau dalam path absolut:
```
/mnt/data/web/daddyProjectInfaq_sqlite/data/infaq_jariyah.db
```

---

## 🔧 Windows-Specific Notes

### Path Separators

Windows menggunakan backslash (`\`) untuk path:
```
..\data\infaq_jariyah.db
```

Unix/Linux menggunakan forward slash (`/`):
```
../data/infaq_jariyah.db
```

### Environment Variables

**Set di Command Prompt:**
```cmd
set NODE_ENV=production
set SESSION_SECRET=your-secret-key
```

**Set di PowerShell:**
```powershell
$env:NODE_ENV="production"
$env:SESSION_SECRET="your-secret-key"
```

**Permanent (System Properties):**
1. Win + Pause/Break
2. Advanced system settings
3. Environment Variables
4. Add new variables

---

## 🛠️ Available Scripts (Windows)

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `dev.bat` | Build + run development |
| Start | `start.bat` | Run production server |
| Deploy | `deploy.bat` | Deploy to Railway |
| Build | `npm run build` | Build only |
| Clean | `rmdir /s /q build` | Remove build folder |

---

## 🐛 Troubleshooting (Windows)

### "npm is not recognized"

Install Node.js from https://nodejs.org

Atau add to PATH:
```
C:\Program Files\nodejs\
```

### "Access Denied" error

Run Command Prompt as Administrator:
1. Right-click CMD
2. Run as Administrator

### Build fails with node-gyp error

Install Windows Build Tools:
```powershell
npm install --global --production windows-build-tools
```

Or install manually:
- Visual Studio Build Tools
- Check "Desktop development with C++"

### Database locked error

Close all instances of the app, then:
```cmd
del ..\data\infaq_jariyah.db-journal
del ..\data\infaq_jariyah.db-wal
del ..\data\infaq_jariyah.db-shm
```

---

## 📦 Deploy to Railway from Windows

### 1. Install Railway CLI

```cmd
npm install -g @railway/cli
```

### 2. Login

```cmd
railway login
```

### 3. Upload Database

```cmd
railway volume upload ..\data\infaq_jariyah.db --path /app/data/infaq_jariyah.db
```

### 4. Deploy

```cmd
railway up
```

Or use the batch script:
```cmd
deploy.bat
```

---

## 🔐 Environment Variables (Windows)

Create `.env` file in `sveltekit` folder:

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/app/data/infaq_jariyah.db
SESSION_SECRET=your-secret-key-here
```

Generate secret key (PowerShell):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## 📊 Testing

Test health endpoint:
```cmd
curl http://localhost:3000/api/health
```

Or open browser:
```
http://localhost:3000/api/health
```

---

## 🎯 Checklist Windows Deployment

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Database exists (`..\data\infaq_jariyah.db`)
- [ ] `.env` file created (optional)
- [ ] Run `dev.bat` or `start.bat`
- [ ] Test endpoints
- [ ] Deploy to Railway (optional)

---

## 📞 Common Commands

**Check Node version:**
```cmd
node --version
```

**Check npm version:**
```cmd
npm --version
```

**List files:**
```cmd
dir
```

**Create directory:**
```cmd
mkdir data
```

**Copy database:**
```cmd
copy ..\flask_backend\data\infaq_jariyah.db ..\data\
```

---

## 🎉 Done!

Aplikasi siap dijalankan di Windows!

URL: `http://localhost:3000`
