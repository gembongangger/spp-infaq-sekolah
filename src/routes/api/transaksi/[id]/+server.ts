/**
 * GET /api/transaksi/:id - Get transaksi by ID
 * PUT /api/transaksi/:id - Update transaksi
 * DELETE /api/transaksi/:id - Delete transaksi
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Transaksi } from '$lib/server/models/Transaksi';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const transaksi = Transaksi.findById(params.id);

		if (!transaksi) {
			return json(
				{
					success: false,
					message: 'Transaksi not found',
				},
				{ status: 404 }
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

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const transaksi = Transaksi.findById(params.id);

		if (!transaksi) {
			return json(
				{
					success: false,
					message: 'Transaksi not found',
				},
				{ status: 404 }
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
		if (data.siswaId !== undefined) updateData.siswa_id = data.siswaId || null;
		if (data.namaPengirim !== undefined) updateData.nama_pengirim = data.namaPengirim || null;
		if (data.kelasPengirim !== undefined) updateData.kelas_pengirim = data.kelasPengirim || null;
		if (data.nomorAkun !== undefined) updateData.nomor_akun = data.nomorAkun || null;
		if (data.bulan !== undefined) updateData.bulan = data.bulan || null;

		const updated = Transaksi.update(params.id, updateData as any);

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

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const transaksi = Transaksi.findById(params.id);

		if (!transaksi) {
			return json(
				{
					success: false,
					message: 'Transaksi not found',
				},
				{ status: 404 }
			);
		}

		Transaksi.delete(params.id);

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
