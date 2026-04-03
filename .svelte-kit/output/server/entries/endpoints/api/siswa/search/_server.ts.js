import { json } from "@sveltejs/kit";
import { S as Siswa } from "../../../../../chunks/Siswa.js";
import { a as auth } from "../../../../../chunks/index2.js";
const GET = async ({ url, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
    const query = url.searchParams.get("q") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    console.log("[API Search] Query:", { q: query, page, limit, fullUrl: url.toString() });
    const offset = (page - 1) * limit;
    const result = await Siswa.search({
      query,
      sekolahId: session.role === "superadmin" ? url.searchParams.get("sekolah_id") : session.sekolah_id,
      limit,
      offset
    });
    const students = result.students.map((s) => ({
      id: s.id,
      nomorAkun: s.nomor_akun,
      nama: s.nama,
      kelas: s.kelas,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    }));
    console.log("[API Search] Result:", { total: result.total, returned: students.length });
    return json(
      {
        success: true,
        data: students,
        pagination: {
          page,
          limit,
          total: result.total,
          hasMore: result.hasMore,
          totalPages: Math.ceil(result.total / limit)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Search] Error:", error);
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
