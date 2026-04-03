import { json } from "@sveltejs/kit";
import { a as auth } from "../../../../../chunks/index2.js";
const POST = async ({ cookies }) => {
  try {
    auth.clearSession(cookies);
    return json(
      {
        success: true,
        message: "Logout berhasil"
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
