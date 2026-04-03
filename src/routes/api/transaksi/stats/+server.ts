/**
 * GET /api/transaksi/stats - Get statistics for dashboard
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Transaksi } from '$lib/server/models/Transaksi';

export const GET: RequestHandler = async () => {
	try {
		const stats = Transaksi.getStats();

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
