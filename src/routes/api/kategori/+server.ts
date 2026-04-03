/**
 * GET /api/kategori - Get all kategori
 * POST /api/kategori - Create new kategori
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Kategori } from '$lib/server/models/Kategori';
import { auth } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
		const sekolahId =
			session.role === 'superadmin'
				? url.searchParams.get('sekolah_id')
				: session.sekolah_id;
		const categories = sekolahId ? await Kategori.getBySekolah(sekolahId) : await Kategori.getAll();

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

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
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
		const sekolahId =
			session.role === 'superadmin'
				? data.sekolahId || data.sekolah_id || null
				: session.sekolah_id;

		if (session.role !== 'superadmin' && !sekolahId) {
			return json(
				{
					success: false,
					message: 'Admin tidak memiliki sekolah aktif',
				},
				{ status: 403 }
			);
		}

		const existing = await Kategori.findByNamaInSekolah(data.nama, sekolahId);
		if (existing) {
			return json(
				{
					success: false,
					message: `Kategori "${data.nama}" sudah ada`,
				},
				{ status: 400 }
			);
		}

		const newKategori = await Kategori.create({
			nama: data.nama,
			ikon: data.ikon || 'Heart',
			warna: data.warna || '#10b981',
			sekolah_id: sekolahId,
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
