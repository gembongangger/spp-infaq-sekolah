import { json } from "@sveltejs/kit";
import db from "../../../../chunks/index3.js";
const GET = async () => {
  try {
    await db.execute("SELECT 1");
    return json(
      {
        success: true,
        message: "API is running",
        database: "connected"
      },
      { status: 200 }
    );
  } catch (error) {
    return json(
      {
        success: false,
        message: error.message,
        database: "disconnected"
      },
      { status: 500 }
    );
  }
};
export {
  GET
};
