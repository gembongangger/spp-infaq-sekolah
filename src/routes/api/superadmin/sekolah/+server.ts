/**
 * GET /api/superadmin/sekolah
 * Get all schools
 * 
 * POST /api/superadmin/sekolah
 * Create new school
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Sekolah } from '$lib/server/models/Sekolah';
import { auth } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// Require superadmin authentication
		const session = auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const schools = await Sekolah.getAll();
		const schoolsWithStats = await Promise.all(schools.map(async (school) => {
			const stats = await Sekolah.getStats(school.id);
			return {
				...Sekolah.toDTO(school),
				stats,
			};
		}));

		return json(
			{ success: true, data: schoolsWithStats },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Require superadmin authentication
		const session = auth.requireAuth(cookies);
		
		if (session.role !== 'superadmin') {
			return json(
				{ success: false, message: 'Akses ditolak. Hanya superadmin yang dapat mengakses.' },
				{ status: 403 }
			);
		}

		const data = await request.json();

		if (!data.nama || !data.kode) {
			return json(
				{ success: false, message: 'Nama dan kode sekolah harus diisi' },
				{ status: 400 }
			);
		}

		// Check if kode already exists
		const existing = await Sekolah.findByKode(data.kode.toUpperCase());
		if (existing) {
			return json(
				{ success: false, message: 'Kode sekolah sudah digunakan' },
				{ status: 400 }
			);
		}

		const school = await Sekolah.create({
			nama: data.nama,
			kode: data.kode.toUpperCase(),
			alamat: data.alamat || null,
			npsn: data.npsn || null,
			namaKepala: data.namaKepala || null,
			noHpKepala: data.noHpKepala || null,
			logoUrl: data.logoUrl || null,
		});

		return json(
			{ success: true, message: 'Sekolah berhasil ditambahkan', data: Sekolah.toDTO(school) },
			{ status: 201 }
		);
	} catch (error) {
		return json(
			{ success: false, message: (error as Error).message },
			{ status: 500 }
		);
	}
};
