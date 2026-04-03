/**
 * Script untuk membuat superadmin user pertama
 * Jalankan: node scripts/create-superadmin.js
 */

import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import readline from 'readline';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
}

async function main() {
	console.log('🚀 Create Superadmin User\n');

	// Get database connection
	const url = process.env.TURSO_CONNECTION_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN;

	if (!url || !authToken) {
		console.error('❌ Error: TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN must be set in .env.local');
		process.exit(1);
	}

	console.log(`📡 Connecting to: ${url}\n`);

	const db = createClient({
		url,
		authToken
	});

	// Test connection
	try {
		await db.execute('SELECT 1');
		console.log('✅ Connected to database\n');
	} catch (error) {
		console.error('❌ Failed to connect:', error.message);
		process.exit(1);
	}

	// Get user input
	console.log('Enter superadmin details:\n');
	const email = await askQuestion('Email: ');
	const username = email.split('@')[0];
	const password = await askQuestion('Password (min 6 chars): ');
	const namaLengkap = await askQuestion('Full Name: ');
	const noHp = await askQuestion('Phone Number (optional): ') || null;

	// Validate
	if (!email || !password || password.length < 6) {
		console.error('\n❌ Error: Email and password (min 6 chars) are required');
		process.exit(1);
	}

	// Check if user already exists
	const existing = await db.execute({
		sql: 'SELECT id FROM user WHERE email = ?',
		args: [email.toLowerCase()]
	});

	if (existing.rows.length > 0) {
		console.error('\n❌ Error: User with this email already exists');
		process.exit(1);
	}

	// Create user
	const id = uuidv4();
	const password_hash = await bcrypt.hash(password, 10);
	const now = new Date().toISOString();

	try {
		await db.execute({
			sql: `
				INSERT INTO user (id, username, email, password_hash, role, is_active, nama_lengkap, no_hp, created_at, updated_at)
				VALUES (?, ?, ?, ?, 'superadmin', 1, ?, ?, ?, ?)
			`,
			args: [id, username, email.toLowerCase(), password_hash, namaLengkap, noHp, now, now]
		});

		console.log('\n✅ Superadmin created successfully!\n');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log(`ID:       ${id}`);
		console.log(`Email:    ${email}`);
		console.log(`Username: ${username}`);
		console.log(`Name:     ${namaLengkap}`);
		console.log(`Role:     superadmin`);
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
		console.log('You can now login at: http://localhost:5173/login\n');

	} catch (error) {
		console.error('\n❌ Failed to create user:', error.message);
		process.exit(1);
	}

	rl.close();
}

main().catch(console.error);
