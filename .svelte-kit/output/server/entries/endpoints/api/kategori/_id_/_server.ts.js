import { json } from "@sveltejs/kit";
import { K as Kategori } from "../../../../../chunks/Kategori.js";
import { a as auth } from "../../../../../chunks/index2.js";
function canAccessKategori(role, sessionSekolahId, kategoriSekolahId) {
  return role === "superadmin" || sessionSekolahId === kategoriSekolahId;
}
const DELETE = async ({ params, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
    const kategori = await Kategori.findById(params.id);
    if (!kategori) {
      return json(
        {
          success: false,
          message: "Kategori tidak ditemukan"
        },
        { status: 404 }
      );
    }
    if (!canAccessKategori(session.role, session.sekolah_id, kategori.sekolah_id || null)) {
      return json(
        {
          success: false,
          message: "Akses ditolak"
        },
        { status: 403 }
      );
    }
    await Kategori.delete(params.id);
    return json(
      {
        success: true,
        message: "Kategori berhasil dihapus"
      },
      { status: 200 }
    );
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
  DELETE
};
