import { json } from "@sveltejs/kit";
import { K as Kategori } from "../../../../chunks/Kategori.js";
const GET = async () => {
  try {
    const categories = Kategori.getAll();
    return json(
      {
        success: true,
        data: categories.map(Kategori.toDTO)
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
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    if (!data || !data.nama) {
      return json(
        {
          success: false,
          message: "Nama kategori harus diisi"
        },
        { status: 400 }
      );
    }
    const existing = Kategori.findByNama(data.nama);
    if (existing) {
      return json(
        {
          success: false,
          message: `Kategori "${data.nama}" sudah ada`
        },
        { status: 400 }
      );
    }
    const newKategori = Kategori.create({
      nama: data.nama,
      ikon: data.ikon || "Heart",
      warna: data.warna || "#10b981"
    });
    return json(
      {
        success: true,
        data: Kategori.toDTO(newKategori)
      },
      { status: 201 }
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
  GET,
  POST
};
