/**
 * GET /api/transaksi/:id - Get transaksi by ID
 * PUT /api/transaksi/:id - Update transaksi
 * DELETE /api/transaksi/:id - Delete transaksi
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Transaksi } from '$lib/server/models/Transaksi';
import { auth } from '$lib/server/auth';
import { Siswa } from '$lib/server/models/Siswa';

function canAccessTransaksi(
	role: string,
	sessionSekolahId: string | null,
	transaksiSekolahId: string | null
) {
	return role === 'superadmin' || sessionSekolahId === transaksiSekolahId;
}

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);
		const transaksi = await Transaksi.findById(params.id);

		if (!transaksi) {
			return json(
				{
					success: false,
					message: 'Transaksi not found',
				},
				{ status: 404 }
			);
		}

		if (!canAccessTransaksi(session.role, session.sekolah_id, transaksi.sekolah_id || null)) {
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
				data: Transaksi.toDTO(transaksi),
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
		const transaksi = await Transaksi.findById(params.id);

		if (!transaksi) {
			return json(
				{
					success: false,
					message: 'Transaksi not found',
				},
				{ status: 404 }
			);
		}

		if (!canAccessTransaksi(session.role, session.sekolah_id, transaksi.sekolah_id || null)) {
			return json(
				{
					success: false,
					message: 'Akses ditolak',
				},
				{ status: 403 }
			);
		}

		const data = await request.json();

		const updateData: Partial<Transaksi> = {};

		if (data.tanggal !== undefined) {
			let tanggal = data.tanggal;
			if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
				tanggal = new Date(tanggal).toISOString().split('T')[0];
			}
			updateData.tanggal = tanggal;
		}
		if (data.keterangan !== undefined) updateData.keterangan = data.keterangan;
		if (data.kategori !== undefined) updateData.kategori = data.kategori;
		if (data.jenis !== undefined) updateData.jenis = data.jenis;
		if (data.jumlah !== undefined) updateData.jumlah = parseFloat(data.jumlah);
		if (data.metode !== undefined) updateData.metode = data.metode;
		if (data.siswaId !== undefined) {
			if (data.siswaId) {
				const siswa = await Siswa.findById(data.siswaId);
				if (!siswa) {
					return json(
						{
							success: false,
							message: 'Siswa tidak ditemukan',
						},
						{ status: 404 }
					);
				}

				if (!canAccessTransaksi(session.role, session.sekolah_id, siswa.sekolah_id || null)) {
					return json(
						{
							success: false,
							message: 'Akses ditolak untuk siswa dari sekolah lain',
						},
						{ status: 403 }
					);
				}
			}

			updateData.siswa_id = data.siswaId || null;
		}
		if (data.namaPengirim !== undefined) updateData.nama_pengirim = data.namaPengirim || null;
		if (data.kelasPengirim !== undefined) updateData.kelas_pengirim = data.kelasPengirim || null;
		if (data.nomorAkun !== undefined) updateData.nomor_akun = data.nomorAkun || null;
		if (data.bulan !== undefined) updateData.bulan = data.bulan || null;

		const updated = await Transaksi.update(params.id, updateData as any);

		if (!updated) {
			return json(
				{
					success: false,
					message: 'Failed to update transaksi',
				},
				{ status: 500 }
			);
		}

		return json(
			{
				success: true,
				data: Transaksi.toDTO(updated),
				message: 'Transaksi updated successfully',
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
		const transaksi = await Transaksi.findById(params.id);

		if (!transaksi) {
			return json(
				{
					success: false,
					message: 'Transaksi not found',
				},
				{ status: 404 }
			);
		}

		if (!canAccessTransaksi(session.role, session.sekolah_id, transaksi.sekolah_id || null)) {
			return json(
				{
					success: false,
					message: 'Akses ditolak',
				},
				{ status: 403 }
			);
		}

		await Transaksi.delete(params.id);

		return json(
			{
				success: true,
				message: 'Transaksi deleted successfully',
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
