/**
 * User Model
 */
import db from '$lib/server/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
	id: string;
	username: string;
	email: string;
	password_hash: string;
	role: string;
	sekolah_id: string | null;
	is_active: number;
	nama_lengkap: string | null;
	no_hp: string | null;
	foto_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface UserDTO {
	id: string;
	username: string;
	email: string;
	role: string;
	sekolahId: string | null;
	is_active: boolean;
	nama_lengkap: string | null;
	no_hp: string | null;
	foto_url: string | null;
	createdAt: string;
	updatedAt: string;
}

export const User = {
	/** Convert raw DB row to DTO */
	toDTO(user: User): UserDTO {
		return {
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			sekolahId: user.sekolah_id || null,
			is_active: user.is_active === 1,
			nama_lengkap: user.nama_lengkap || null,
			no_hp: user.no_hp || null,
			foto_url: user.foto_url || null,
			createdAt: user.created_at,
			updatedAt: user.updated_at,
		};
	},

	/** Find user by email or username */
	findByEmail(identifier: string): User | null {
		const stmt = db.prepare('SELECT * FROM user WHERE (email = ? OR username = ?) AND is_active = 1');
		return stmt.get(identifier, identifier) as User | null;
	},

	/** Find user by ID */
	findById(id: string): User | null {
		const stmt = db.prepare('SELECT * FROM user WHERE id = ? AND is_active = 1');
		return stmt.get(id) as User | null;
	},

	/** Find user by ID without active check */
	findByIdRaw(id: string): User | null {
		const stmt = db.prepare('SELECT * FROM user WHERE id = ?');
		return stmt.get(id) as User | null;
	},

	/** Create new user */
	create(data: { username: string; email: string; password: string; role?: string; sekolah_id?: string | null }): User {
		const id = uuidv4();
		const password_hash = bcrypt.hashSync(data.password, 10);
		const now = new Date().toISOString();
		const role = data.role || 'admin';
		const is_active = 1;
		const sekolah_id = data.sekolah_id || null;

		const stmt = db.prepare(`
			INSERT INTO user (id, username, email, password_hash, role, sekolah_id, is_active, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		stmt.run(id, data.username, data.email, password_hash, role, sekolah_id, is_active, now, now);

		return this.findByIdRaw(id)!;
	},

	/** Update user password */
	updatePassword(id: string, newPassword: string): boolean {
		const password_hash = bcrypt.hashSync(newPassword, 10);
		const now = new Date().toISOString();

		const stmt = db.prepare(`
			UPDATE user 
			SET password_hash = ?, updated_at = ?
			WHERE id = ?
		`);

		const result = stmt.run(password_hash, now, id);
		return result.changes > 0;
	},

	/** Check password */
	checkPassword(user: User, password: string): boolean {
		return bcrypt.compareSync(password, user.password_hash);
	},

	/** Get all users */
	getAll(): User[] {
		const stmt = db.prepare('SELECT * FROM user ORDER BY created_at DESC');
		return stmt.all() as User[];
	},

	/** Get users by sekolah_id */
	getBySekolah(sekolahId: string): User[] {
		const stmt = db.prepare('SELECT * FROM user WHERE sekolah_id = ? ORDER BY created_at DESC');
		return stmt.all(sekolahId) as User[];
	},

	/** Get all users with school info */
	getAllWithSekolah(): Array<User & { sekolah_nama: string | null }> {
		const stmt = db.prepare(`
			SELECT user.*, sekolah.nama as sekolah_nama 
			FROM user 
			LEFT JOIN sekolah ON user.sekolah_id = sekolah.id 
			ORDER BY user.created_at DESC
		`);
		return stmt.all() as Array<User & { sekolah_nama: string | null }>;
	},

	/** Update user profile */
	updateProfile(
		id: string,
		data: { nama_lengkap?: string | null; no_hp?: string | null; foto_url?: string | null }
	): boolean {
		const now = new Date().toISOString();
		const fields: string[] = [];
		const values: any[] = [];

		if (data.nama_lengkap !== undefined) {
			fields.push('nama_lengkap = ?');
			values.push(data.nama_lengkap);
		}
		if (data.no_hp !== undefined) {
			fields.push('no_hp = ?');
			values.push(data.no_hp);
		}
		if (data.foto_url !== undefined) {
			fields.push('foto_url = ?');
			values.push(data.foto_url);
		}

		if (fields.length === 0) {
			return false;
		}

		fields.push('updated_at = ?');
		values.push(now);
		values.push(id);

		const stmt = db.prepare(`
			UPDATE user
			SET ${fields.join(', ')}
			WHERE id = ?
		`);

		const result = stmt.run(...values);
		return result.changes > 0;
	},
};
