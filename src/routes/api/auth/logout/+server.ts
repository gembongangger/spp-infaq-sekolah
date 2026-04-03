/**
 * POST /api/auth/logout
 * User logout endpoint
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		auth.clearSession(cookies);

		return json(
			{
				success: true,
				message: 'Logout berhasil',
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
