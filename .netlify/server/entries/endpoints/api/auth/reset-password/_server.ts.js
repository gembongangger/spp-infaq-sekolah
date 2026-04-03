import { json } from "@sveltejs/kit";
import { U as User } from "../../../../../chunks/User.js";
import { v4 } from "uuid";
import db from "../../../../../chunks/index3.js";
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    if (!data) {
      return json(
        {
          success: false,
          message: "Data tidak ditemukan"
        },
        { status: 400 }
      );
    }
    const email = (data.email || "").toString().trim().toLowerCase();
    if (!email) {
      return json(
        {
          success: false,
          message: "Email harus diisi"
        },
        { status: 400 }
      );
    }
    const result = await db.execute({
      sql: "SELECT * FROM user WHERE email = ?",
      args: [email]
    });
    if (result.rows.length === 0) {
      return json(
        {
          success: false,
          message: "Email tidak terdaftar"
        },
        { status: 404 }
      );
    }
    const user = result.rows[0];
    const tempPassword = v4().slice(0, 8).toUpperCase();
    await User.updatePassword(user.id, tempPassword);
    return json(
      {
        success: true,
        message: "Password berhasil direset. Password sementara telah dibuat.",
        data: {
          email: user.email,
          temporary_password: tempPassword,
          note: "Simpan password ini dengan baik. Anda harus mengubahnya setelah login."
        }
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
  POST
};
