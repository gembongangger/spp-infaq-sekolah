/**
 * POST /api/auth/login
 * User login endpoint
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/server/models/User';
import { auth } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
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
		const password = data.password || '';

		if (!email || !password) {
			return json(
				{
					success: false,
					message: 'Email dan password harus diisi',
				},
				{ status: 400 }
			);
		}

		// Find user by email
		const user = User.findByEmail(email);

		if (!user) {
			return json(
				{
					success: false,
					message: 'Email tidak terdaftar',
				},
				{ status: 401 }
			);
		}

		// Check password
		if (!User.checkPassword(user, password)) {
			return json(
				{
					success: false,
					message: 'Password salah',
				},
				{ status: 401 }
			);
		}

		// Create session
		const userDTO = User.toDTO(user);
		auth.setSession(cookies, userDTO);

		return json(
			{
				success: true,
				message: 'Login berhasil',
				data: {
					id: userDTO.id,
					username: userDTO.username,
					email: userDTO.email,
					role: userDTO.role,
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
