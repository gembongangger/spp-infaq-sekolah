/**
 * GET /api/superadmin/sekolah/[id]
 * Get school by ID
 * 
 * PUT /api/superadmin/sekolah/[id]
 * Update school
 * 
 * DELETE /api/superadmin/sekolah/[id]
 * Delete school
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Sekolah } from '$lib/server/models/Sekolah';
import { auth } from '$lib/server/auth';

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const school = await Sekolah.findById(params.id);
		if (!school) {
			return json(
				{ success: false, message: 'Sekolah tidak ditemukan' },
				{ status: 404 }
			);
		}

		const stats = await Sekolah.getStats(school.id);
		return json(
			{ success: true, data: { ...Sekolah.toDTO(school), stats } },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const data = await request.json();
		const school = await Sekolah.findById(params.id);

		if (!school) {
			return json(
				{ success: false, message: 'Sekolah tidak ditemukan' },
				{ status: 404 }
			);
		}

		// Check if kode is being changed and if it already exists
		if (data.kode && data.kode.toUpperCase() !== school.kode) {
			const existing = await Sekolah.findByKode(data.kode.toUpperCase());
			if (existing) {
				return json(
					{ success: false, message: 'Kode sekolah sudah digunakan' },
					{ status: 400 }
				);
			}
		}

		const updated = await Sekolah.update(params.id, {
			nama: data.nama,
			kode: data.kode,
			alamat: data.alamat,
			npsn: data.npsn,
			namaKepala: data.namaKepala,
			noHpKepala: data.noHpKepala,
			logoUrl: data.logoUrl,
			isActive: data.isActive,
		});

		return json(
			{ success: true, message: 'Sekolah berhasil diperbarui', data: Sekolah.toDTO(updated!) },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const school = await Sekolah.findById(params.id);
		if (!school) {
			return json(
				{ success: false, message: 'Sekolah tidak ditemukan' },
				{ status: 404 }
			);
		}

		// Soft delete
		await Sekolah.softDelete(params.id);

		return json(
			{ success: true, message: 'Sekolah berhasil dinonaktifkan' },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
};
