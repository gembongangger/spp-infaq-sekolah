/**
 * PUT /api/superadmin/admin-sekolah/[id]
 * Update school admin
 * 
 * DELETE /api/superadmin/admin-sekolah/[id]
 * Delete school admin
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/server/models/User';
import { auth } from '$lib/server/auth';
import bcrypt from 'bcryptjs';

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		const session = auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const data = await request.json();
		const user = User.findByIdRaw(params.id);

		if (!user) {
			return json(
				{ success: false, message: 'User tidak ditemukan' },
				{ status: 404 }
			);
		}

		// Check if email is being changed and if it already exists
		if (data.email && data.email !== user.email) {
			const existing = User.findByEmail(data.email);
			if (existing) {
				return json(
					{ success: false, message: 'Email sudah terdaftar' },
					{ status: 400 }
				);
			}
		}

		// Update user
		const now = new Date().toISOString();
		const updates: string[] = [];
		const values: any[] = [];

		if (data.email !== undefined) {
			updates.push('email = ?');
			values.push(data.email);
			// Also update username if it was the same as email
			if (user.username === user.email) {
				updates.push('username = ?');
				values.push(data.email);
			}
		}

		if (data.password) {
			const passwordHash = bcrypt.hashSync(data.password, 10);
			updates.push('password_hash = ?');
			values.push(passwordHash);
		}

		if (data.role !== undefined) {
			updates.push('role = ?');
			values.push(data.role);
		}

		if (data.sekolah_id !== undefined) {
			updates.push('sekolah_id = ?');
			values.push(data.sekolah_id);
		}

		if (data.nama_lengkap !== undefined) {
			updates.push('nama_lengkap = ?');
			values.push(data.nama_lengkap);
		}

		if (data.no_hp !== undefined) {
			updates.push('no_hp = ?');
			values.push(data.no_hp);
		}

		if (data.is_active !== undefined) {
			updates.push('is_active = ?');
			values.push(data.is_active ? 1 : 0);
		}

		if (updates.length === 0) {
			return json(
				{ success: false, message: 'Tidak ada data yang diperbarui' },
				{ status: 400 }
			);
		}

		updates.push('updated_at = ?');
		values.push(now);
		values.push(params.id);

		const db = (await import('$lib/server/db')).default;
		const stmt = db.prepare(`UPDATE user SET ${updates.join(', ')} WHERE id = ?`);
		stmt.run(...values);

		const updatedUser = User.findByIdRaw(params.id)!;

		return json(
			{ success: true, message: 'Admin berhasil diperbarui', data: User.toDTO(updatedUser) },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	try {
		const session = auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const user = User.findByIdRaw(params.id);
		if (!user) {
			return json(
				{ success: false, message: 'User tidak ditemukan' },
				{ status: 404 }
			);
		}

		// Prevent deleting superadmin
		if (user.role === 'superadmin') {
			return json(
				{ success: false, message: 'Tidak dapat menghapus akun superadmin' },
				{ status: 400 }
			);
		}

		// Soft delete by setting is_active to 0
		const now = new Date().toISOString();
		const db = (await import('$lib/server/db')).default;
		const stmt = db.prepare('UPDATE user SET is_active = 0, updated_at = ? WHERE id = ?');
		stmt.run(now, params.id);

		return json(
			{ success: true, message: 'Admin berhasil dinonaktifkan' },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
};
