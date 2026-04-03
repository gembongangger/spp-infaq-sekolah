import { json } from "@sveltejs/kit";
import { K as Kategori } from "../../../../../chunks/Kategori.js";
const DELETE = async ({ params }) => {
  try {
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
