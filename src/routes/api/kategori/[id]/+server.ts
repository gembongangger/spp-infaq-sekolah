/**
 * DELETE /api/kategori/:id - Delete kategori
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Kategori } from '$lib/server/models/Kategori';
import { auth } from '$lib/server/auth';

function canAccessKategori(
	role: string,
	sessionSekolahId: string | null,
	kategoriSekolahId: string | null
) {
	return role === 'superadmin' || sessionSekolahId === kategoriSekolahId;
}

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
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

		if (!canAccessKategori(session.role, session.sekolah_id, kategori.sekolah_id || null)) {
			return json(
				{
					success: false,
					message: 'Akses ditolak',
				},
				{ status: 403 }
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
