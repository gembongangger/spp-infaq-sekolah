/**
 * POST /api/auth/reset-password
 * Reset password for admin user
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/server/models/User';
import { v4 as uuidv4 } from 'uuid';
import db from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		if (!data) {
			return json(
				{
					success: false,
					message: 'Data tidak ditemukan',
				},
				{ status: 400 }
			);
		}

		const email = (data.email || '').toString().trim().toLowerCase();

		if (!email) {
			return json(
				{
					success: false,
					message: 'Email harus diisi',
				},
				{ status: 400 }
			);
		}

		// Find user by email (without active check for reset)
		const result = await db.execute({
			sql: 'SELECT * FROM user WHERE email = ?',
			args: [email]
		});
		
		if (result.rows.length === 0) {
			return json(
				{
					success: false,
					message: 'Email tidak terdaftar',
				},
				{ status: 404 }
			);
		}

		const user = result.rows[0] as any;

		// Generate temporary password
		const tempPassword = uuidv4().slice(0, 8).toUpperCase();

		// Set new password
		await User.updatePassword(user.id, tempPassword);

		// In production, send this via email
		// For now, return it in response (only for demo)
		return json(
			{
				success: true,
				message: 'Password berhasil direset. Password sementara telah dibuat.',
				data: {
					email: user.email,
					temporary_password: tempPassword,
					note: 'Simpan password ini dengan baik. Anda harus mengubahnya setelah login.',
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{
				success: false,
				message: (error as Error).message,
			},
			{ status: 500 }
		);
	}
};
