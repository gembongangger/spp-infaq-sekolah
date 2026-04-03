import { json } from "@sveltejs/kit";
import { S as Siswa } from "../../../../../chunks/Siswa.js";
import * as XLSX from "xlsx";
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return json(
        {
          success: false,
          message: "Tidak ada file yang diupload"
        },
        { status: 400 }
      );
    }
    const filename = file.name;
    const allowedExtensions = ["xlsx", "xls"];
    const fileExtension = filename.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return json(
        {
          success: false,
          message: "Format file tidak didukung. Gunakan format .xlsx atau .xls"
        },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const wb = XLSX.read(buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (data.length < 2) {
      return json(
        {
          success: false,
          message: "File Excel kosong atau tidak ada data"
        },
        { status: 400 }
      );
    }
    const rawHeaders = data[0].map((h) => h?.toString().trim() || "");
    const normalizedHeaders = rawHeaders.map((h) => h.toLowerCase().replace(/[_\s]+/g, ""));
    const requiredColumns = ["nomorakun", "nama", "kelas"];
    const missingColumns = requiredColumns.filter((col) => !normalizedHeaders.includes(col));
    if (missingColumns.length > 0) {
      return json(
        {
          success: false,
          message: `Kolom wajib missing: ${missingColumns.join(", ")}`
        },
        { status: 400 }
      );
    }
    const idxNomorAkun = normalizedHeaders.indexOf("nomorakun");
    const idxNama = normalizedHeaders.indexOf("nama");
    const idxKelas = normalizedHeaders.indexOf("kelas");
    const studentsToImport = [];
    const rowErrors = [];
    for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx];
      const rowNumber = rowIdx + 1;
      if (!row || !row.some((cell) => cell !== null && cell !== void 0 && cell !== "")) {
        continue;
      }
      const nomorAkun = row[idxNomorAkun]?.toString().trim() || "";
      const nama = row[idxNama]?.toString().trim() || "";
      const kelas = row[idxKelas]?.toString().trim() || "";
      if (!nomorAkun || !nama || !kelas) {
        rowErrors.push(`Baris ${rowNumber}: Data tidak lengkap`);
        continue;
      }
      studentsToImport.push({ nomorAkun, nama, kelas, rowNumber });
    }
    if (studentsToImport.length === 0) {
      return json(
        {
          success: false,
          message: "Tidak ada data valid yang dapat diimpor",
          data: {
            success: 0,
            duplicate: 0,
            failed: rowErrors.length,
            errors: rowErrors
          }
        },
        { status: 400 }
      );
    }
    const result = Siswa.batchCreate(studentsToImport);
    const mergedErrors = [...rowErrors, ...result.errors];
    const totalFailed = result.failed + rowErrors.length;
    const messageParts = [];
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
        message: messageParts.join(". "),
        data: {
          success: result.success,
          duplicate: result.duplicate,
          failed: totalFailed,
          errors: mergedErrors.slice(0, 30)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return json(
      {
        success: false,
        message: `Error: ${error.message}`
      },
      { status: 500 }
    );
  }
};
export {
  POST
};
