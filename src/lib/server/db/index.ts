/**
 * Database connection using BetterSQLite3
 * Supports multiple environments: local, Railway, production
 */
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get database path from environment or use default
const envDbPath = process.env.DATABASE_PATH;

// Try multiple possible paths for database file
const possiblePaths = envDbPath
	? [envDbPath]
	: [
		// Railway: /app/data/infaq_jariyah.db
		'/app/data/infaq_jariyah.db',
		// Production: relative to build output
		path.resolve(__dirname, '../../../../data/infaq_jariyah.db'),
		// Development: relative to src/lib/server
		path.resolve(__dirname, '../../../../../data/infaq_jariyah.db'),
		// Fallback: relative to current working directory
		path.resolve(process.cwd(), 'data/infaq_jariyah.db'),
	];

let dbPath = possiblePaths.find((p) => {
	try {
		return fs.existsSync(p);
	} catch {
		return false;
	}
});

// If no existing database found, use the Railway path or production path
if (!dbPath) {
	dbPath = envDbPath || '/app/data/infaq_jariyah.db';
}

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Set journal mode for better concurrency (WAL for local, DELETE for Railway volume)
db.pragma('journal_mode = WAL');

export default db;
