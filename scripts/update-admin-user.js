import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path - use the correct database location
const dbPath = process.env.DATABASE_PATH || '/home/gembong/Desktop/web/daddyProjectInfaq_sqlite/data/infaq_jariyah.db';

console.log(`Using database at: ${dbPath}`);

const NEW_EMAIL = 'admininfaqmajesa@gmail.com';
const OLD_EMAIL = 'gembongangger@gmail.com';
const PASSWORD = 'admin123';
const SALT_ROUNDS = 10;

try {
  const db = new Database(dbPath);

  // Check if user table exists
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='user'").get();
  
  if (!tableCheck) {
    console.log('User table does not exist. Creating table and inserting admin user...');
    
    // Create the user table
    db.exec(`
      CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        is_active INTEGER NOT NULL DEFAULT 1,
        nama_lengkap TEXT,
        no_hp TEXT,
        foto_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Hash password
    const passwordHash = bcrypt.hashSync(PASSWORD, SALT_ROUNDS);
    
    // Insert new admin user
    const insert = db.prepare(`
      INSERT INTO user (username, email, password_hash, role, is_active)
      VALUES (?, ?, ?, 'admin', 1)
    `);
    
    insert.run(NEW_EMAIL, NEW_EMAIL, passwordHash);
    console.log('✓ Admin user created successfully!');
    console.log(`  Email/Username: ${NEW_EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
  } else {
    console.log('User table exists. Checking for existing admin user...');
    
    // Check if old admin user exists
    const oldUser = db.prepare('SELECT * FROM user WHERE email = ?').get(OLD_EMAIL);
    const newUser = db.prepare('SELECT * FROM user WHERE email = ?').get(NEW_EMAIL);
    
    if (oldUser) {
      console.log(`Found old admin user: ${OLD_EMAIL}`);
      
      // Hash password
      const passwordHash = bcrypt.hashSync(PASSWORD, SALT_ROUNDS);
      
      // Update email and username
      const update = db.prepare(`
        UPDATE user 
        SET username = ?, email = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `);
      
      update.run(NEW_EMAIL, NEW_EMAIL, passwordHash, OLD_EMAIL);
      console.log('✓ Admin user updated successfully!');
      console.log(`  Old Email/Username: ${OLD_EMAIL}`);
      console.log(`  New Email/Username: ${NEW_EMAIL}`);
      console.log(`  Password: ${PASSWORD}`);
    } else if (newUser) {
      console.log(`Admin user with new email already exists: ${NEW_EMAIL}`);
      
      // Just update the password
      const passwordHash = bcrypt.hashSync(PASSWORD, SALT_ROUNDS);
      const update = db.prepare(`
        UPDATE user 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `);
      
      update.run(passwordHash, NEW_EMAIL);
      console.log('✓ Password updated for existing admin user!');
      console.log(`  Email/Username: ${NEW_EMAIL}`);
      console.log(`  Password: ${PASSWORD}`);
    } else {
      // Create new admin user
      console.log('No admin user found. Creating new admin user...');
      
      const passwordHash = bcrypt.hashSync(PASSWORD, SALT_ROUNDS);
      
      const insert = db.prepare(`
        INSERT INTO user (username, email, password_hash, role, is_active)
        VALUES (?, ?, ?, 'admin', 1)
      `);
      
      insert.run(NEW_EMAIL, NEW_EMAIL, passwordHash);
      console.log('✓ Admin user created successfully!');
      console.log(`  Email/Username: ${NEW_EMAIL}`);
      console.log(`  Password: ${PASSWORD}`);
    }
  }

  db.close();
  console.log('\n✅ Database update completed successfully!');
} catch (error) {
  console.error('❌ Error updating database:', error.message);
  process.exit(1);
}
