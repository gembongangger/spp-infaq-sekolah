/**
 * GET /api/auth/me
 * Get current logged in user
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/server/models/User';
import { auth } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const session = auth.getSession(cookies);

		if (!session) {
			return json(
				{
					success: false,
					message: 'Not authenticated',
				},
				{ status: 401 }
			);
		}

		const user = await User.findById(session.user_id);

		if (!user || !user.is_active) {
			auth.clearSession(cookies);
			return json(
				{
					success: false,
					message: 'User not found',
				},
				{ status: 404 }
			);
		}

		return json(
			{
				success: true,
				data: User.toDTO(user),
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
