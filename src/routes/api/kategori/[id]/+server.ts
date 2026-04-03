/**
 * DELETE /api/kategori/:id - Delete kategori
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Kategori } from '$lib/server/models/Kategori';

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const kategori = await Kategori.findById(params.id);

		if (!kategori) {
			return json(
				{
					success: false,
					message: 'Kategori tidak ditemukan',
				},
				{ status: 404 }
			);
		}

		await Kategori.delete(params.id);

		return json(
			{
				success: true,
				message: 'Kategori berhasil dihapus',
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
