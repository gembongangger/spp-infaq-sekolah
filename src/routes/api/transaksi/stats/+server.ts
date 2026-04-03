/**
 * GET /api/transaksi/stats - Get statistics for dashboard
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Transaksi } from '$lib/server/models/Transaksi';
import { auth } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
		const sekolahId =
			session.role === 'superadmin'
				? url.searchParams.get('sekolah_id') || undefined
				: session.sekolah_id || undefined;
		const stats = await Transaksi.getStats(sekolahId);

		return json(
			{
				success: true,
				data: stats,
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
