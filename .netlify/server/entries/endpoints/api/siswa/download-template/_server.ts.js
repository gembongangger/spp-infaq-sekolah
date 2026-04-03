import { json } from "@sveltejs/kit";
import * as XLSX from "xlsx";
const GET = async () => {
  try {
    const wb = XLSX.utils.book_new();
    const headers = ["Nomor Akun", "Nama", "Kelas"];
    const sampleData = [
      ["001", "Ahmad Fauzi", "X IPA 1"],
      ["002", "Siti Nurhaliza", "X IPA 2"],
      ["003", "Budi Santoso", "X IPS 1"]
    ];
    const wsData = [headers, ...sampleData];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 15 }, { wch: 30 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="template_siswa.xlsx"'
      }
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    );
  }
};
export {
  GET
};
