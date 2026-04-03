import { json } from "@sveltejs/kit";
import { U as User } from "../../../../../chunks/User.js";
import { a as auth } from "../../../../../chunks/index2.js";
const POST = async ({ request, cookies }) => {
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
    const password = data.password || "";
    if (!email || !password) {
      return json(
        {
          success: false,
          message: "Email dan password harus diisi"
        },
        { status: 400 }
      );
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return json(
        {
          success: false,
          message: "Email tidak terdaftar"
        },
        { status: 401 }
      );
    }
    if (!await User.checkPassword(user, password)) {
      return json(
        {
          success: false,
          message: "Password salah"
        },
        { status: 401 }
      );
    }
    const userDTO = User.toDTO(user);
    auth.setSession(cookies, userDTO);
    return json(
      {
        success: true,
        message: "Login berhasil",
        data: {
          id: userDTO.id,
          username: userDTO.username,
          email: userDTO.email,
          role: userDTO.role
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
