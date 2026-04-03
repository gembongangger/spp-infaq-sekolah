import { json } from "@sveltejs/kit";
import { U as User } from "../../../../../chunks/User.js";
import { a as auth } from "../../../../../chunks/index2.js";
const GET = async ({ cookies }) => {
  try {
    const session = await auth.getSession(cookies);
    if (!session) {
      return json(
        {
          success: false,
          message: "Not authenticated"
        },
        { status: 401 }
      );
    }
    const user = await User.findById(session.user_id);
    if (!user || !user.is_active) {
      auth.clearSession(cookies);
      return json(
        {
          success: false,
          message: "User not found"
        },
        { status: 404 }
      );
    }
    return json(
      {
        success: true,
        data: User.toDTO(user)
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
  GET
};
