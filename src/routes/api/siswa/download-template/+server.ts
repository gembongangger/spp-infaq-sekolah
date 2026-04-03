/**
 * GET /api/siswa/download-template
 * Download Excel template for siswa import
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as xlsx from 'xlsx';

export const GET: RequestHandler = async () => {
	try {
		// Create new workbook
		const wb = xlsx.utils.book_new();

		// Create worksheet with headers and sample data
		const headers = ['Nomor Akun', 'Nama', 'Kelas'];
		const sampleData = [
			['001', 'Ahmad Fauzi', 'X IPA 1'],
			['002', 'Siti Nurhaliza', 'X IPA 2'],
			['003', 'Budi Santoso', 'X IPS 1'],
		];

		const wsData = [headers, ...sampleData];
		const ws = xlsx.utils.aoa_to_sheet(wsData);

		// Set column widths
		ws['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 15 }];

		// Add worksheet to workbook
		xlsx.utils.book_append_sheet(wb, ws, 'Data Siswa');

		// Write to buffer
		const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

		// Return as file download
		return new Response(buffer, {
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': 'attachment; filename="template_siswa.xlsx"',
			},
		});
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
