/**
 * PUT /api/admin/profile
 * Update admin profile
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/server/models/User';
import { auth } from '$lib/server/auth';

export const PUT: RequestHandler = async ({ request, cookies }) => {
	try {
		// Require authentication
		const session = await auth.requireAuth(cookies);

		const body = await request.json();
		const { nama_lengkap, no_hp, foto_url } = body;

		// Validate input
		if (!nama_lengkap && !no_hp && !foto_url) {
			return json(
				{
					success: false,
					message: 'Tidak ada data yang diubah',
				},
				{ status: 400 }
			);
		}

		// Update profile
		const updated = await User.updateProfile(session.user_id, {
			nama_lengkap: nama_lengkap ?? null,
			no_hp: no_hp ?? null,
			foto_url: foto_url ?? null,
		});

		if (!updated) {
			return json(
				{
					success: false,
					message: 'Gagal mengupdate profil',
				},
				{ status: 500 }
			);
		}

		// Get updated user data
		const updatedUser = await User.findById(session.user_id);

		if (!updatedUser) {
			return json(
				{
					success: false,
					message: 'User tidak ditemukan',
				},
				{ status: 404 }
			);
		}

		return json(
			{
				success: true,
				message: 'Profil berhasil diupdate',
				data: User.toDTO(updatedUser),
			},
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{
				success: false,
				message: `Error: ${(error as Error).message}`,
			},
			{ status: 500 }
		);
	}
};
