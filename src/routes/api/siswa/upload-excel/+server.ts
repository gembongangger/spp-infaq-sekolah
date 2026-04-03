/**
 * POST /api/siswa/upload-excel
 * Upload siswa data from Excel file
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Siswa } from '$lib/server/models/Siswa';
import { auth } from '$lib/server/auth';
import * as xlsx from 'xlsx';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const session = await auth.requireAuth(cookies);

		if (session.role !== 'superadmin' && !session.sekolah_id) {
			return json(
				{
					success: false,
					message: 'Admin tidak memiliki sekolah aktif',
				},
				{ status: 403 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			return json(
				{
					success: false,
					message: 'Tidak ada file yang diupload',
				},
				{ status: 400 }
			);
		}

		const filename = file.name;
		const allowedExtensions = ['xlsx', 'xls'];
		const fileExtension = filename.split('.').pop()?.toLowerCase();

		if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
			return json(
				{
					success: false,
					message: 'Format file tidak didukung. Gunakan format .xlsx atau .xls',
				},
				{ status: 400 }
			);
		}

		// Read file as array buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Load workbook
		const wb = xlsx.read(buffer, { type: 'buffer' });
		const sheet = wb.Sheets[wb.SheetNames[0]];

		// Convert to JSON
		const data: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

		if (data.length < 2) {
			return json(
				{
					success: false,
					message: 'File Excel kosong atau tidak ada data',
				},
				{ status: 400 }
			);
		}

		// Get headers from first row and normalize
		const rawHeaders = data[0].map((h: any) => h?.toString().trim() || '');
		const normalizedHeaders = rawHeaders.map((h: string) => h.toLowerCase().replace(/[_\s]+/g, ''));

		// Validate required columns (accepts "Nomor Akun", "nomor_akun", "nomorakun")
		const requiredColumns = ['nomorakun', 'nama', 'kelas'];
		const missingColumns = requiredColumns.filter((col) => !normalizedHeaders.includes(col));

		if (missingColumns.length > 0) {
			return json(
				{
					success: false,
					message: `Kolom wajib missing: ${missingColumns.join(', ')}`,
				},
				{ status: 400 }
			);
		}

		// Get column indices
		const idxNomorAkun = normalizedHeaders.indexOf('nomorakun');
		const idxNama = normalizedHeaders.indexOf('nama');
		const idxKelas = normalizedHeaders.indexOf('kelas');

		// Process data rows
		const sekolahId = session.role === 'superadmin' ? null : session.sekolah_id;
		const studentsToImport: { nomorAkun: string; nama: string; kelas: string; sekolah_id?: string | null; rowNumber: number }[] = [];
		const rowErrors: string[] = [];

		for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
			const row = data[rowIdx];
			const rowNumber = rowIdx + 1;

			// Skip completely empty rows
			if (!row || !row.some((cell: any) => cell !== null && cell !== undefined && cell !== '')) {
				continue;
			}

			const nomorAkun = row[idxNomorAkun]?.toString().trim() || '';
			const nama = row[idxNama]?.toString().trim() || '';
			const kelas = row[idxKelas]?.toString().trim() || '';

			if (!nomorAkun || !nama || !kelas) {
				rowErrors.push(`Baris ${rowNumber}: Data tidak lengkap`);
				continue;
			}

			studentsToImport.push({ nomorAkun, nama, kelas, sekolah_id: sekolahId, rowNumber });
		}

		if (studentsToImport.length === 0) {
			return json(
				{
					success: false,
					message: 'Tidak ada data valid yang dapat diimpor',
					data: {
						success: 0,
						duplicate: 0,
						failed: rowErrors.length,
						errors: rowErrors,
					},
				},
				{ status: 400 }
			);
		}

		// Batch import
		const result = await Siswa.batchCreate(studentsToImport);

		// Merge parsing errors & database errors
		const mergedErrors = [...rowErrors, ...result.errors];
		const totalFailed = result.failed + rowErrors.length;

		const messageParts: string[] = [];
		if (result.success > 0) {
			messageParts.push(`Berhasil mengimport ${result.success} data`);
		}
		if (result.duplicate > 0) {
			messageParts.push(`${result.duplicate} data duplikat diabaikan`);
		}
		if (totalFailed > 0) {
			messageParts.push(`${totalFailed} baris tidak diproses karena error`);
		}

		return json(
			{
				success: result.success > 0,
				message: messageParts.join('. '),
				data: {
					success: result.success,
					duplicate: result.duplicate,
					failed: totalFailed,
					errors: mergedErrors.slice(0, 30),
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{
				success: false,
				message: `Error: ${(error as Error).message}`,
			},
			{ status: 500 }
		);
	}
};
