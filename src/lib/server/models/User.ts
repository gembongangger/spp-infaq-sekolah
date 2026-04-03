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
	async findByEmail(identifier: string): Promise<User | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM user WHERE (email = ? OR username = ?) AND is_active = 1',
			args: [identifier, identifier]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as User;
	},

	/** Find user by ID */
	async findById(id: string): Promise<User | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM user WHERE id = ? AND is_active = 1',
			args: [id]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as User;
	},

	/** Find user by ID without active check */
	async findByIdRaw(id: string): Promise<User | null> {
		const result = await db.execute({
			sql: 'SELECT * FROM user WHERE id = ?',
			args: [id]
		});
		if (result.rows.length === 0) return null;
		return result.rows[0] as unknown as User;
	},

	/** Create new user */
	async create(data: { username: string; email: string; password: string; role?: string; sekolah_id?: string | null }): Promise<User> {
		const id = uuidv4();
		const password_hash = await bcrypt.hash(data.password, 10);
		const now = new Date().toISOString();
		const role = data.role || 'admin';
		const is_active = 1;
		const sekolah_id = data.sekolah_id || null;

		await db.execute({
			sql: `
				INSERT INTO user (id, username, email, password_hash, role, sekolah_id, is_active, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			args: [id, data.username, data.email, password_hash, role, sekolah_id, is_active, now, now]
		});

		const user = await this.findByIdRaw(id);
		return user!;
	},

	/** Update user password */
	async updatePassword(id: string, newPassword: string): Promise<boolean> {
		const password_hash = await bcrypt.hash(newPassword, 10);
		const now = new Date().toISOString();

		const result = await db.execute({
			sql: `
				UPDATE user
				SET password_hash = ?, updated_at = ?
				WHERE id = ?
			`,
			args: [password_hash, now, id]
		});
		return result.rowsAffected > 0;
	},

	/** Check password */
	async checkPassword(user: User, password: string): Promise<boolean> {
		return await bcrypt.compare(password, user.password_hash);
	},

	/** Get all users */
	async getAll(): Promise<User[]> {
		const result = await db.execute('SELECT * FROM user ORDER BY created_at DESC');
		return result.rows as unknown as User[];
	},

	/** Get users by sekolah_id */
	async getBySekolah(sekolahId: string): Promise<User[]> {
		const result = await db.execute({
			sql: 'SELECT * FROM user WHERE sekolah_id = ? ORDER BY created_at DESC',
			args: [sekolahId]
		});
		return result.rows as unknown as User[];
	},

	/** Get all users with school info */
	async getAllWithSekolah(): Promise<Array<User & { sekolah_nama: string | null }>> {
		const result = await db.execute(`
			SELECT user.*, sekolah.nama as sekolah_nama
			FROM user
			LEFT JOIN sekolah ON user.sekolah_id = sekolah.id
			ORDER BY user.created_at DESC
		`);
		return result.rows as unknown as Array<User & { sekolah_nama: string | null }>;
	},

	/** Update user profile */
	async updateProfile(
		id: string,
		data: { nama_lengkap?: string | null; no_hp?: string | null; foto_url?: string | null }
	): Promise<boolean> {
		const now = new Date().toISOString();
		const fields: string[] = [];
		const values: (string | null)[] = [];

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

		const result = await db.execute({
			sql: `
				UPDATE user
				SET ${fields.join(', ')}
				WHERE id = ?
			`,
			args: values
		});
		return result.rowsAffected > 0;
	},
};
