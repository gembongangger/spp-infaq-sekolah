/**
 * GET /api/kategori - Get all kategori
 * POST /api/kategori - Create new kategori
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Kategori } from '$lib/server/models/Kategori';

export const GET: RequestHandler = async () => {
	try {
		const categories = Kategori.getAll();

		return json(
			{
				success: true,
				data: categories.map(Kategori.toDTO),
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

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		if (!data || !data.nama) {
			return json(
				{
					success: false,
					message: 'Nama kategori harus diisi',
				},
				{ status: 400 }
			);
		}

		// Check if already exists
		const existing = Kategori.findByNama(data.nama);
		if (existing) {
			return json(
				{
					success: false,
					message: `Kategori "${data.nama}" sudah ada`,
				},
				{ status: 400 }
			);
		}

		const newKategori = Kategori.create({
			nama: data.nama,
			ikon: data.ikon || 'Heart',
			warna: data.warna || '#10b981',
		});

		return json(
			{
				success: true,
				data: Kategori.toDTO(newKategori),
			},
			{ status: 201 }
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
