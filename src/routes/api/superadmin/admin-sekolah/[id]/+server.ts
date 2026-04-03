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
		const session = await auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const data = await request.json();
		const user = await User.findByIdRaw(params.id);

		if (!user) {
			return json(
				{ success: false, message: 'User tidak ditemukan' },
				{ status: 404 }
			);
		}

		// Check if email is being changed and if it already exists
		if (data.email && data.email !== user.email) {
			const existing = await User.findByEmail(data.email);
			if (existing) {
				return json(
					{ success: false, message: 'Email sudah terdaftar' },
					{ status: 400 }
				);
			}
		}

		// Update user fields manually since we don't have a generic update method
		const now = new Date().toISOString();
		const updateData: any = {};
		
		if (data.email !== undefined) {
			updateData.email = data.email;
			// Also update username if it was the same as email
			if (user.username === user.email) {
				updateData.username = data.email;
			}
		}
		if (data.role !== undefined) updateData.role = data.role;
		if (data.sekolah_id !== undefined) updateData.sekolah_id = data.sekolah_id;
		if (data.nama_lengkap !== undefined) updateData.nama_lengkap = data.nama_lengkap;
		if (data.no_hp !== undefined) updateData.no_hp = data.no_hp;
		if (data.is_active !== undefined) updateData.is_active = data.is_active ? 1 : 0;

		// Update password if provided
		if (data.password) {
			await User.updatePassword(params.id, data.password);
		}

		// Update other fields using direct db query
		const db = (await import('$lib/server/db')).default;
		const updates: string[] = [];
		const values: any[] = [];

		for (const [key, value] of Object.entries(updateData)) {
			updates.push(`${key} = ?`);
			values.push(value);
		}

		if (updates.length > 0) {
			updates.push('updated_at = ?');
			values.push(now);
			values.push(params.id);

			await db.execute({
				sql: `UPDATE user SET ${updates.join(', ')} WHERE id = ?`,
				args: values
			});
		}

		const updatedUser = await User.findByIdRaw(params.id)!;

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
		const session = await auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const user = await User.findByIdRaw(params.id);
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
		await db.execute({
			sql: 'UPDATE user SET is_active = 0, updated_at = ? WHERE id = ?',
			args: [now, params.id]
		});

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
