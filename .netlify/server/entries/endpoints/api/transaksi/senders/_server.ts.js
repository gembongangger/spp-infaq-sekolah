import { json } from "@sveltejs/kit";
import { T as Transaksi } from "../../../../../chunks/Transaksi.js";
const GET = async () => {
  try {
    const senders = await Transaksi.getSenders();
    return json(
      {
        success: true,
        data: senders
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
