/**
 * GET /api/siswa/:id - Get siswa by ID
 * PUT /api/siswa/:id - Update siswa
 * DELETE /api/siswa/:id - Delete siswa
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Siswa } from '$lib/server/models/Siswa';
import { auth } from '$lib/server/auth';

function canAccessSiswa(role: string, sessionSekolahId: string | null, siswaSekolahId: string | null) {
	return role === 'superadmin' || sessionSekolahId === siswaSekolahId;
}

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
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

		if (!canAccessSiswa(session.role, session.sekolah_id, siswa.sekolah_id || null)) {
			return json(
				{
					success: false,
					message: 'Akses ditolak',
				},
				{ status: 403 }
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

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
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

		if (!canAccessSiswa(session.role, session.sekolah_id, siswa.sekolah_id || null)) {
			return json(
				{
					success: false,
					message: 'Akses ditolak',
				},
				{ status: 403 }
			);
		}

		const data = await request.json();

		// Check duplicate nomor_akun if changed
		if (data.nomorAkun && data.nomorAkun !== siswa.nomor_akun) {
			const targetSekolahId =
				session.role === 'superadmin'
					? data.sekolahId || data.sekolah_id || siswa.sekolah_id || null
					: session.sekolah_id;
			const existing = await Siswa.findByNomorAkunInSekolah(data.nomorAkun, targetSekolahId);
			if (existing && existing.id !== params.id) {
				return json(
					{
						success: false,
						message: 'Nomor akun already exists in this school',
					},
					{ status: 400 }
				);
			}
		}

		const updated = await Siswa.update(params.id, {
			nomorAkun: data.nomorAkun,
			nama: data.nama,
			kelas: data.kelas,
			sekolah_id:
				session.role === 'superadmin'
					? data.sekolahId ?? data.sekolah_id ?? undefined
					: session.sekolah_id,
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

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
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

		if (!canAccessSiswa(session.role, session.sekolah_id, siswa.sekolah_id || null)) {
			return json(
				{
					success: false,
					message: 'Akses ditolak',
				},
				{ status: 403 }
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
