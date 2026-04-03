# Update: Role-Based Login Redirect

## Masalah Sebelumnya
Ketika superadmin login melalui halaman `/login`, user diarahkan ke dashboard sekolah biasa (`/`) alih-alih ke superadmin dashboard (`/superadmin/dashboard`).

## Solusi
Menambahkan **role-based redirect** pada halaman login (`/login`):

### Perubahan pada `/src/routes/login/+page.svelte`

#### 1. Redirect Setelah Login Berhasil
```typescript
async function handleLogin(e: Event) {
    // ...
    const result = await login(email, password);
    
    // Role-based redirect
    const userRole = result.data?.role;
    
    if (userRole === 'superadmin') {
        // Superadmin goes to superadmin dashboard
        goto('/superadmin/dashboard');
    } else {
        // Regular admin goes to school dashboard
        goto('/');
    }
}
```

#### 2. Redirect untuk User yang Sudah Login
```typescript
// Redirect if already logged in
if ($authStore.isAuthenticated) {
    if ($authStore.user?.role === 'superadmin') {
        goto('/superadmin/dashboard');
    } else {
        goto('/');
    }
}
```

#### 3. Tambah Link ke Superadmin Login
```html
<div class="mt-6 pt-6 border-t border-[#334155]">
    <p class="text-center text-xs text-[#64748b]">
        Default login: <strong>admininfaqmajesa@gmail.com</strong> / <strong>admin123</strong>
    </p>
    <p class="text-center text-xs text-[#64748b] mt-2">
        <a href="/superadmin/login" class="text-[#10b981] hover:text-[#059669]">
            Login sebagai Superadmin →
        </a>
    </p>
</div>
```

## Cara Kerja Sekarang

### Login sebagai Superadmin
1. Buka: `http://localhost:5173/login`
2. Login dengan: `superadmin@infaq.app` / `superadmin`
3. **Otomatis diarahkan ke**: `/superadmin/dashboard` ✅

### Login sebagai Admin Sekolah
1. Buka: `http://localhost:5173/login`
2. Login dengan: `admininfaqmajesa@gmail.com` / `admin123`
3. **Otomatis diarahkan ke**: `/` (dashboard sekolah) ✅

### Login Langsung ke Superadmin
1. Buka: `http://localhost:5173/superadmin/login`
2. Login dengan: `superadmin@infaq.app` / `superadmin`
3. **Otomatis diarahkan ke**: `/superadmin/dashboard` ✅

## Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    HALAMAN LOGIN (/login)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Input: email + password                                 │
│         ↓                                                │
│  Login API                                               │
│         ↓                                                │
│  Cek role dari response:                                 │
│         ↓                                                │
│    ┌────────────────┐                                    │
│    │ role = ?       │                                    │
│    └────────┬───────┘                                    │
│             │                                            │
│      ┌──────┴──────┐                                     │
│      │             │                                     │
│  superadmin     admin/operator                           │
│      │             │                                     │
│      ↓             ↓                                     │
│  /superadmin    / (dashboard                             │
│  /dashboard     sekolah)                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Testing

### Test 1: Login Superadmin via /login
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@infaq.app","password":"superadmin"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "id": "user_superadmin_001",
    "username": "superadmin",
    "email": "superadmin@infaq.app",
    "role": "superadmin"
  }
}
```

**Expected Redirect:** `/superadmin/dashboard` ✅

### Test 2: Login Admin Sekolah via /login
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admininfaqmajesa@gmail.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "id": "74507a0e-4b35-41bf-9763-52719326b5e1",
    "username": "admininfaqmajesa@gmail.com",
    "email": "admininfaqmajesa@gmail.com",
    "role": "admin"
  }
}
```

**Expected Redirect:** `/` (dashboard sekolah) ✅

## User Credentials

| Role | Email | Password | Redirect To |
|------|-------|----------|-------------|
| Superadmin | `superadmin@infaq.app` | `superadmin` | `/superadmin/dashboard` |
| Admin Sekolah | `admininfaqmajesa@gmail.com` | `admin123` | `/` |

## Catatan Penting

1. **Superadmin bisa login dari 2 tempat:**
   - `/login` → otomatis redirect ke `/superadmin/dashboard`
   - `/superadmin/login` → langsung ke `/superadmin/dashboard`

2. **Admin sekolah hanya bisa login dari:**
   - `/login` → redirect ke `/`

3. **Jika superadmin mencoba akses `/` (dashboard sekolah):**
   - Akan diarahkan kembali ke `/superadmin/dashboard` (ada guard di dashboard)

4. **Jika admin sekolah mencoba akses `/superadmin/dashboard`:**
   - Akan diarahkan kembali ke `/` (ada guard di superadmin dashboard)

## File yang Diubah

- ✅ `/src/routes/login/+page.svelte` - Tambah role-based redirect logic
- ✅ `/src/routes/superadmin/login/+page.svelte` - Sudah ada (tidak diubah)
- ✅ `/src/routes/superadmin/dashboard/+page.svelte` - Sudah ada (tidak diubah)

## Kesimpulan

Sekarang sistem login sudah **smart** dan bisa membedakan role user:
- ✅ Superadmin → Superadmin Dashboard
- ✅ Admin Sekolah → Dashboard Sekolah
- ✅ Tidak ada lagi kebingungan atau salah redirect
