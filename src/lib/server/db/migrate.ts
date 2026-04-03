/**
 * Database Migration
 * Add profile fields to user table
 */
import db from './index';

export function migrate() {
	// Add profile columns to user table if not exists
	db.exec(`
		ALTER TABLE user ADD COLUMN nama_lengkap TEXT NULL;
	`);

	db.exec(`
		ALTER TABLE user ADD COLUMN no_hp TEXT NULL;
	`);

	db.exec(`
		ALTER TABLE user ADD COLUMN foto_url TEXT NULL;
	`);

	console.log('Migration completed: Added profile fields to user table');
}

// Run migration
try {
	migrate();
} catch (error) {
	// Ignore error if columns already exist
	if (!(error as Error).message.includes('duplicate column')) {
		console.error('Migration error:', error);
	}
}
