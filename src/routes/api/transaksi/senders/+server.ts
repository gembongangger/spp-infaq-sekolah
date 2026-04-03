/**
 * GET /api/transaksi/senders - Get sender summaries
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Transaksi } from '$lib/server/models/Transaksi';

export const GET: RequestHandler = async () => {
	try {
		const senders = Transaksi.getSenders();

		return json(
			{
				success: true,
				data: senders,
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
