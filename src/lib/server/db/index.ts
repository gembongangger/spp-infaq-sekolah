import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

/**
 * Turso Database Client
 * Support both local SQLite file and remote Turso database
 */

// Determine the local database path as a fallback
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localDbPath = path.resolve(process.cwd(), 'data/infaq_jariyah.db');

// Ensure directory exists for local database
const dbDir = path.dirname(localDbPath);
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

// Get connection details from environment
// If TURSO_CONNECTION_URL is missing, use local file
const url = process.env.TURSO_CONNECTION_URL || `file:${localDbPath}`;
const authToken = process.env.TURSO_AUTH_TOKEN || '';

console.log(`Connecting to database at: ${url.startsWith('file:') ? 'local file' : 'Turso remote'}`);

const db = createClient({
	url: url,
	authToken: authToken,
});

export default db;
