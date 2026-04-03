import { json } from "@sveltejs/kit";
import { K as Kategori } from "../../../../chunks/Kategori.js";
import { a as auth } from "../../../../chunks/index2.js";
const GET = async ({ url, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
    const sekolahId = session.role === "superadmin" ? url.searchParams.get("sekolah_id") : session.sekolah_id;
    const categories = sekolahId ? await Kategori.getBySekolah(sekolahId) : await Kategori.getAll();
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
const POST = async ({ request, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
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
    const sekolahId = session.role === "superadmin" ? data.sekolahId || data.sekolah_id || null : session.sekolah_id;
    if (session.role !== "superadmin" && !sekolahId) {
      return json(
        {
          success: false,
          message: "Admin tidak memiliki sekolah aktif"
        },
        { status: 403 }
      );
    }
    const existing = await Kategori.findByNamaInSekolah(data.nama, sekolahId);
    if (existing) {
      return json(
        {
          success: false,
          message: `Kategori "${data.nama}" sudah ada`
        },
        { status: 400 }
      );
    }
    const newKategori = await Kategori.create({
      nama: data.nama,
      ikon: data.ikon || "Heart",
      warna: data.warna || "#10b981",
      sekolah_id: sekolahId
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
