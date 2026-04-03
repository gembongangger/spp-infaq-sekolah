/**
 * GET /api/siswa/:id - Get siswa by ID
 * PUT /api/siswa/:id - Update siswa
 * DELETE /api/siswa/:id - Delete siswa
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Siswa } from '$lib/server/models/Siswa';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const siswa = await Siswa.findById(params.id);

		if (!siswa) {
			return json(
				{
					success: false,
					message: 'Siswa not found',
				},
				{ status: 404 }
			);
		}

		return json(
			{
				success: true,
				data: Siswa.toDTO(siswa),
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

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const siswa = await Siswa.findById(params.id);

		if (!siswa) {
			return json(
				{
					success: false,
					message: 'Siswa not found',
				},
				{ status: 404 }
			);
		}

		const data = await request.json();

		// Check duplicate nomor_akun if changed
		if (data.nomorAkun && data.nomorAkun !== siswa.nomor_akun) {
			const existing = await Siswa.findByNomorAkun(data.nomorAkun);
			if (existing && existing.id !== params.id) {
				return json(
					{
						success: false,
						message: 'Nomor akun already exists',
					},
					{ status: 400 }
				);
			}
		}

		const updated = await Siswa.update(params.id, {
			nomorAkun: data.nomorAkun,
			nama: data.nama,
			kelas: data.kelas,
		});

		if (!updated) {
			return json(
				{
					success: false,
					message: 'Failed to update siswa',
				},
				{ status: 500 }
			);
		}

		return json(
			{
				success: true,
				data: Siswa.toDTO(updated),
				message: 'Siswa updated successfully',
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

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const siswa = await Siswa.findById(params.id);

		if (!siswa) {
			return json(
				{
					success: false,
					message: 'Siswa not found',
				},
				{ status: 404 }
			);
		}

		await Siswa.delete(params.id);

		return json(
			{
				success: true,
				message: 'Siswa deleted successfully',
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
