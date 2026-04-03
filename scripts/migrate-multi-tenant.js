/**
 * Multi-Tenant Migration Script
 * 
 * This script:
 * 1. Creates the 'sekolah' table
 * 2. Adds sekolah_id to all existing tables (user, siswa, transaksi, kategori)
 * 3. Creates MAN1Jember school for existing data
 * 4. Migrates all existing data to MAN1Jember
 * 5. Creates superadmin user
 * 6. Updates admininfaqmajesa@gmail.com as MAN1Jember admin
 */

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path - use the correct database location for this project
const dbPath = process.env.DATABASE_PATH || '/mnt/data/web/daddyProjectInfaq_sqlite/sveltekit_linux_infaq_multitenant/data/infaq_jariyah.db';

console.log(`Using database at: ${dbPath}`);

// Check if database exists
if (!fs.existsSync(dbPath)) {
	console.error('❌ Database file not found. Please run the application first to initialize the database.');
	process.exit(1);
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = OFF'); // Disable during migration

function runMigration() {
	console.log('🚀 Starting multi-tenant migration...\n');

	const transaction = db.transaction(() => {
		// ==========================================
		// STEP 1: Create sekolah table
		// ==========================================
		console.log('📋 Step 1: Creating sekolah table...');
		
		const sekolahTableExists = db.prepare(
			"SELECT name FROM sqlite_master WHERE type='table' AND name='sekolah'"
		).get();

		if (!sekolahTableExists) {
			db.exec(`
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
				)
			`);
			console.log('  ✓ Sekolah table created');
		} else {
			console.log('  ⏭ Sekolah table already exists');
		}

		// ==========================================
		// STEP 2: Add sekolah_id to user table
		// ==========================================
		console.log('\n📋 Step 2: Adding sekolah_id to user table...');
		
		const userHasSekolahId = db.prepare(
			"PRAGMA table_info(user)"
		).all().some((col) => col.name === 'sekolah_id');

		if (!userHasSekolahId) {
			db.exec(`ALTER TABLE user ADD COLUMN sekolah_id TEXT REFERENCES sekolah(id)`);
			console.log('  ✓ sekolah_id added to user table');
		} else {
			console.log('  ⏭ sekolah_id already exists in user table');
		}

		// ==========================================
		// STEP 3: Add sekolah_id to siswa table
		// ==========================================
		console.log('\n📋 Step 3: Adding sekolah_id to siswa table...');
		
		const siswaHasSekolahId = db.prepare(
			"PRAGMA table_info(siswa)"
		).all().some((col) => col.name === 'sekolah_id');

		if (!siswaHasSekolahId) {
			db.exec(`ALTER TABLE siswa ADD COLUMN sekolah_id TEXT REFERENCES sekolah(id)`);
			console.log('  ✓ sekolah_id added to siswa table');
		} else {
			console.log('  ⏭ sekolah_id already exists in siswa table');
		}

		// ==========================================
		// STEP 4: Add sekolah_id to transaksi table
		// ==========================================
		console.log('\n📋 Step 4: Adding sekolah_id to transaksi table...');
		
		const transaksiHasSekolahId = db.prepare(
			"PRAGMA table_info(transaksi)"
		).all().some((col) => col.name === 'sekolah_id');

		if (!transaksiHasSekolahId) {
			db.exec(`ALTER TABLE transaksi ADD COLUMN sekolah_id TEXT REFERENCES sekolah(id)`);
			console.log('  ✓ sekolah_id added to transaksi table');
		} else {
			console.log('  ⏭ sekolah_id already exists in transaksi table');
		}

		// ==========================================
		// STEP 5: Add sekolah_id to kategori table
		// ==========================================
		console.log('\n📋 Step 5: Adding sekolah_id to kategori table...');
		
		const kategoriHasSekolahId = db.prepare(
			"PRAGMA table_info(kategori)"
		).all().some((col) => col.name === 'sekolah_id');

		if (!kategoriHasSekolahId) {
			db.exec(`ALTER TABLE kategori ADD COLUMN sekolah_id TEXT REFERENCES sekolah(id)`);
			console.log('  ✓ sekolah_id added to kategori table');
		} else {
			console.log('  ⏭ sekolah_id already exists in kategori table');
		}

		// ==========================================
		// STEP 6: Create MAN1Jember school
		// ==========================================
		console.log('\n📋 Step 6: Creating MAN1Jember school...');
		
		const existingSekolah = db.prepare(
			"SELECT id FROM sekolah WHERE kode = ?"
		).get('MAN1JEMBER');

		let sekolahId;

		if (!existingSekolah) {
			sekolahId = 'sekolah_man1jember_001';
			const now = new Date().toISOString();
			
			db.prepare(`
				INSERT INTO sekolah (id, nama, kode, alamat, is_active, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`).run(
				sekolahId,
				'MAN 1 Jember',
				'MAN1JEMBER',
				'Jember, Jawa Timur',
				1,
				now,
				now
			);
			console.log('  ✓ MAN1Jember school created');
		} else {
			sekolahId = existingSekolah.id;
			console.log('  ⏭ MAN1Jember school already exists');
		}

		// ==========================================
		// STEP 7: Migrate existing data to MAN1Jember
		// ==========================================
		console.log('\n📋 Step 7: Migrating existing data to MAN1Jember...');
		
		// Update user table
		const userUpdateResult = db.prepare(`
			UPDATE user SET sekolah_id = ? WHERE sekolah_id IS NULL
		`).run(sekolahId);
		console.log(`  ✓ Updated ${userUpdateResult.changes} user records`);

		// Update siswa table
		const siswaUpdateResult = db.prepare(`
			UPDATE siswa SET sekolah_id = ? WHERE sekolah_id IS NULL
		`).run(sekolahId);
		console.log(`  ✓ Updated ${siswaUpdateResult.changes} siswa records`);

		// Update transaksi table
		const transaksiUpdateResult = db.prepare(`
			UPDATE transaksi SET sekolah_id = ? WHERE sekolah_id IS NULL
		`).run(sekolahId);
		console.log(`  ✓ Updated ${transaksiUpdateResult.changes} transaksi records`);

		// Update kategori table
		const kategoriUpdateResult = db.prepare(`
			UPDATE kategori SET sekolah_id = ? WHERE sekolah_id IS NULL
		`).run(sekolahId);
		console.log(`  ✓ Updated ${kategoriUpdateResult.changes} kategori records`);

		// ==========================================
		// STEP 8: Update admininfaqmajesa@gmail.com
		// ==========================================
		console.log('\n📋 Step 8: Updating admininfaqmajesa@gmail.com...');
		
		const adminUser = db.prepare(
			"SELECT id FROM user WHERE email = ?"
		).get('admininfaqmajesa@gmail.com');

		if (adminUser) {
			db.prepare(`
				UPDATE user 
				SET sekolah_id = ?, role = 'admin', updated_at = ?
				WHERE email = 'admininfaqmajesa@gmail.com'
			`).run(sekolahId, new Date().toISOString());
			console.log('  ✓ admininfaqmajesa@gmail.com updated as MAN1Jember admin');
		} else {
			console.log('  ⚠ admininfaqmajesa@gmail.com not found, will be created in seed script');
		}

		// ==========================================
		// STEP 9: Create superadmin user
		// ==========================================
		console.log('\n📋 Step 9: Creating superadmin user...');
		
		const superadminExists = db.prepare(
			"SELECT id FROM user WHERE username = ?"
		).get('superadmin');

		if (!superadminExists) {
			const superadminId = 'user_superadmin_001';
			const passwordHash = bcrypt.hashSync('superadmin', 10);
			const now = new Date().toISOString();

			db.prepare(`
				INSERT INTO user (id, username, email, password_hash, role, sekolah_id, is_active, nama_lengkap, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).run(
				superadminId,
				'superadmin',
				'superadmin@infaq.app',
				passwordHash,
				'superadmin',
				null, // Superadmin has no sekolah_id (can access all)
				1,
				'Super Administrator',
				now,
				now
			);
			console.log('  ✓ Superadmin user created (username: superadmin, password: superadmin)');
		} else {
			// Update existing superadmin
			db.prepare(`
				UPDATE user 
				SET role = 'superadmin', sekolah_id = NULL, updated_at = ?
				WHERE username = 'superadmin'
			`).run(new Date().toISOString());
			console.log('  ⏭ Superadmin user already exists, updated role and sekolah_id');
		}

		// ==========================================
		// STEP 10: Add indexes for performance
		// ==========================================
		console.log('\n📋 Step 10: Adding indexes for performance...');
		
		const indexes = [
			'idx_user_sekolah_id ON user(sekolah_id)',
			'idx_siswa_sekolah_id ON siswa(sekolah_id)',
			'idx_transaksi_sekolah_id ON transaksi(sekolah_id)',
			'idx_kategori_sekolah_id ON kategori(sekolah_id)',
		];

		for (const indexDef of indexes) {
			try {
				db.exec(`CREATE INDEX IF NOT EXISTS ${indexDef}`);
				console.log(`  ✓ Index created: ${indexDef}`);
			} catch (error) {
				if (error.message.includes('already exists')) {
					console.log(`  ⏭ Index already exists: ${indexDef}`);
				} else {
					throw error;
				}
			}
		}
	});

	// Execute transaction
	try {
		transaction();
		console.log('\n✅ Migration completed successfully!');
	} catch (error) {
		console.error('\n❌ Migration failed:', error);
		throw error;
	}
}

// Run migration
try {
	runMigration();
	
	// Verify migration
	console.log('\n🔍 Verifying migration...');

	const sekolahCount = db.prepare('SELECT COUNT(*) as count FROM sekolah').get();
	const userCount = db.prepare('SELECT COUNT(*) as count FROM user WHERE sekolah_id IS NOT NULL').get();
	const siswaCount = db.prepare('SELECT COUNT(*) as count FROM siswa WHERE sekolah_id IS NOT NULL').get();
	const transaksiCount = db.prepare('SELECT COUNT(*) as count FROM transaksi WHERE sekolah_id IS NOT NULL').get();
	const kategoriCount = db.prepare('SELECT COUNT(*) as count FROM kategori WHERE sekolah_id IS NOT NULL').get();
	const superadmin = db.prepare("SELECT username, role FROM user WHERE username = 'superadmin'").get();

	console.log(`\n📊 Migration Summary:`);
	console.log(`  Sekolah: ${sekolahCount.count} school(s)`);
	console.log(`  Users with sekolah_id: ${userCount.count}`);
	console.log(`  Siswa with sekolah_id: ${siswaCount.count}`);
	console.log(`  Transaksi with sekolah_id: ${transaksiCount.count}`);
	console.log(`  Kategori with sekolah_id: ${kategoriCount.count}`);
	console.log(`  Superadmin user: ${superadmin ? '✓' : '✗'}`);

	db.close();
	console.log('\n✅ Database migration and verification completed successfully!');
} catch (error) {
	console.error('❌ Migration error:', error);
	db.close();
	process.exit(1);
}
