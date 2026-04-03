import { json } from "@sveltejs/kit";
import { T as Transaksi } from "../../../../../chunks/Transaksi.js";
import { a as auth } from "../../../../../chunks/index2.js";
const GET = async ({ url, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
    const sekolahId = session.role === "superadmin" ? url.searchParams.get("sekolah_id") || void 0 : session.sekolah_id || void 0;
    const stats = await Transaksi.getStats(sekolahId);
    return json(
      {
        success: true,
        data: stats
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
