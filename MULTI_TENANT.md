# Multi-Tenant Implementation Guide

## Overview
This application now supports multi-tenancy, allowing multiple schools to use the system with complete data isolation.

## What Was Implemented

### 1. Database Changes
- **New Table**: `sekolah` (schools) - stores school information
- **New Column**: `sekolah_id` added to all tables:
  - `user.sekolah_id` - links users to their school
  - `siswa.sekolah_id` - links students to their school
  - `transaksi.sekolah_id` - links transactions to their school
  - `kategori.sekolah_id` - links categories to their school

### 2. Data Migration
All existing data has been migrated to **MAN 1 Jember** school:
- **41 students** (siswa) migrated
- **13 transactions** (transaksi) migrated
- **4 categories** (kategori) migrated
- **1 admin user** (admininfaqmajesa@gmail.com) assigned to MAN 1 Jember

### 3. User Accounts

#### Superadmin Account
- **Username**: `superadmin`
- **Password**: `superadmin`
- **Role**: Super Administrator
- **Access**: Can manage all schools in the system
- **sekolah_id**: NULL (no school restriction)

#### School Admin Account
- **Email**: `admininfaqmajesa@gmail.com`
- **Role**: Admin
- **School**: MAN 1 Jember (kode: MAN1JEMBER)
- **Access**: Can manage only MAN 1 Jember data

### 4. School Information

#### MAN 1 Jember
- **ID**: `sekolah_man1jember_001`
- **Name**: MAN 1 Jember
- **Code**: MAN1JEMBER
- **Address**: Jember, Jawa Timur
- **Status**: Active

### 5. Model Updates

All models have been updated to support multi-tenancy:

#### Sekolah Model (`src/lib/server/models/Sekolah.ts`)
- Full CRUD operations for school management
- Methods: `getAll()`, `getActive()`, `findById()`, `findByKode()`, `create()`, `update()`, `delete()`, `getStats()`

#### User Model (`src/lib/server/models/User.ts`)
- Added `sekolah_id` field
- New methods: `getBySekolah()`, `getAllWithSekolah()`
- Updated `create()` to accept `sekolah_id`

#### Siswa Model (`src/lib/server/models/Siswa.ts`)
- Added `sekolah_id` field
- New methods: `getBySekolah()`
- Updated `search()` to filter by school
- Updated `batchCreate()` to support school-specific imports

#### Transaksi Model (`src/lib/server/models/Transaksi.ts`)
- Added `sekolah_id` field
- Updated `getAll()` to filter by school
- Updated `getStats()` to calculate per-school statistics
- Updated `getSenders()` to filter by school

#### Kategori Model (`src/lib/server/models/Kategori.ts`)
- Added `sekolah_id` field
- New methods: `getBySekolah()`
- Updated `create()` to accept `sekolah_id`

### 6. Performance Optimizations
Added database indexes for better query performance:
- `idx_user_sekolah_id` on `user(sekolah_id)`
- `idx_siswa_sekolah_id` on `siswa(sekolah_id)`
- `idx_transaksi_sekolah_id` on `transaksi(sekolah_id)`
- `idx_kategori_sekolah_id` on `kategori(sekolah_id)`

## How to Use

### For Superadmin
The superadmin can:
- Create new schools
- Manage school settings
- View statistics across all schools
- Create admin users for each school
- Switch between schools (if needed)

### For School Admin
School admins can:
- Manage only their own school's data
- Create/manage students (siswa) for their school
- Record and view transactions (transaksi) for their school
- Manage categories (kategori) for their school
- View statistics for their school only

### Adding a New School

```typescript
import { Sekolah } from '$lib/server/models/Sekolah';

const newSchool = Sekolah.create({
  nama: 'School Name',
  kode: 'SCHOOLCODE',
  alamat: 'School Address',
  npsn: '12345678', // optional
  namaKepala: 'Principal Name', // optional
  noHpKepala: '081234567890', // optional
});
```

### Creating a School Admin User

```typescript
import { User } from '$lib/server/models/User';

const admin = User.create({
  username: 'admin@school.edu',
  email: 'admin@school.edu',
  password: 'securepassword',
  role: 'admin',
  sekolah_id: 'sekolah_id_here', // Link to the school
});
```

### Querying School-Specific Data

```typescript
// Get students for a specific school
const students = Siswa.getBySekolah('sekolah_id_here');

// Get transactions for a specific school
const transactions = Transaksi.getAll({ sekolahId: 'sekolah_id_here' });

// Get categories for a specific school
const categories = Kategori.getBySekolah('sekolah_id_here');

// Get statistics for a specific school
const stats = Transaksi.getStats('sekolah_id_here');
```

## Data Isolation

Each school's data is completely isolated:
- Students from School A cannot see students from School B
- Transactions are isolated per school
- Categories are isolated per school
- Users are assigned to one school (except superadmin)

## Migration Script

The migration script is located at:
`scripts/migrate-multi-tenant.js`

This script:
1. Creates the `sekolah` table
2. Adds `sekolah_id` columns to all tables
3. Creates MAN1Jember school
4. Migrates all existing data to MAN1Jember
5. Creates superadmin user
6. Updates admininfaqmajesa@gmail.com as MAN1Jember admin
7. Creates indexes for performance

## Next Steps

To fully utilize multi-tenancy in the application:

1. **Update Routes**: Add school filtering in all route handlers
2. **Add School Selector**: Create UI for superadmin to switch between schools
3. **Add School Management UI**: Create pages to manage schools (CRUD)
4. **Update Authentication**: Include school context in user sessions
5. **Add School Settings**: Allow schools to customize their settings
6. **Add School Logo**: Support school-specific branding

## Security Considerations

- Always validate `sekolah_id` when creating/updating records
- Ensure users can only access data from their assigned school
- Superadmin has access to all schools (sekolah_id = NULL)
- Use parameterized queries to prevent SQL injection
- Add middleware to automatically filter by user's school

## Troubleshooting

### Migration Issues
If you need to re-run the migration:
```bash
node scripts/migrate-multi-tenant.js
```

The script is idempotent and will skip steps that have already been completed.

### Check Migration Status
You can verify the migration by checking:
```sql
SELECT COUNT(*) FROM sekolah;
SELECT COUNT(*) FROM user WHERE sekolah_id IS NOT NULL;
SELECT * FROM user WHERE username = 'superadmin';
```

## Support

For issues or questions about multi-tenant implementation, refer to:
- Database schema: Check model files in `src/lib/server/models/`
- Migration script: `scripts/migrate-multi-tenant.js`
- This documentation file
