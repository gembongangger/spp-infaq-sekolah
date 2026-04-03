/**
 * POST /api/auth/change-password
 * Change password for logged in user
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/server/models/User';
import { auth } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);

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

		const currentPassword = data.current_password || '';
		const newPassword = data.new_password || '';

		if (!currentPassword || !newPassword) {
			return json(
				{
					success: false,
					message: 'Password lama dan password baru harus diisi',
				},
				{ status: 400 }
			);
		}

		if (newPassword.length < 6) {
			return json(
				{
					success: false,
					message: 'Password baru minimal 6 karakter',
				},
				{ status: 400 }
			);
		}

		const user = await User.findByIdRaw(session.user_id);

		if (!user) {
			return json(
				{
					success: false,
					message: 'User tidak ditemukan',
				},
				{ status: 404 }
			);
		}

		// Check current password
		if (!(await User.checkPassword(user, currentPassword))) {
			return json(
				{
					success: false,
					message: 'Password lama salah',
				},
				{ status: 401 }
			);
		}

		// Set new password
		await User.updatePassword(user.id, newPassword);

		return json(
			{
				success: true,
				message: 'Password berhasil diubah',
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
