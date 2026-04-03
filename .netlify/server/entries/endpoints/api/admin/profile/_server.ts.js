import { json } from "@sveltejs/kit";
import { U as User } from "../../../../../chunks/User.js";
import { a as auth } from "../../../../../chunks/index2.js";
const PUT = async ({ request, cookies }) => {
  try {
    const session = auth.requireAuth(cookies);
    const body = await request.json();
    const { nama_lengkap, no_hp, foto_url } = body;
    if (!nama_lengkap && !no_hp && !foto_url) {
      return json(
        {
          success: false,
          message: "Tidak ada data yang diubah"
        },
        { status: 400 }
      );
    }
    const updated = await User.updateProfile(session.user_id, {
      nama_lengkap: nama_lengkap ?? null,
      no_hp: no_hp ?? null,
      foto_url: foto_url ?? null
    });
    if (!updated) {
      return json(
        {
          success: false,
          message: "Gagal mengupdate profil"
        },
        { status: 500 }
      );
    }
    const updatedUser = await User.findById(session.user_id);
    if (!updatedUser) {
      return json(
        {
          success: false,
          message: "User tidak ditemukan"
        },
        { status: 404 }
      );
    }
    return json(
      {
        success: true,
        message: "Profil berhasil diupdate",
        data: User.toDTO(updatedUser)
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
  PUT
};
