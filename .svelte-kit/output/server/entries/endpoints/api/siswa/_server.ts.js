import { json } from "@sveltejs/kit";
import { S as Siswa } from "../../../../chunks/Siswa.js";
import { a as auth } from "../../../../chunks/index2.js";
const GET = async ({ url, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
    const sekolahId = session.role === "superadmin" ? url.searchParams.get("sekolah_id") : session.sekolah_id;
    const siswaList = sekolahId ? await Siswa.getBySekolah(sekolahId) : await Siswa.getAll();
    return json(
      {
        success: true,
        data: siswaList.map(Siswa.toDTO)
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
    if (!data || !data.nomorAkun || !data.nama || !data.kelas) {
      return json(
        {
          success: false,
          message: "Missing required fields: nomorAkun, nama, kelas"
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
    const existing = await Siswa.findByNomorAkunInSekolah(data.nomorAkun, sekolahId);
    if (existing) {
      return json(
        {
          success: false,
          message: "Nomor akun already exists in this school"
        },
        { status: 400 }
      );
    }
    const siswa = await Siswa.create({
      nomorAkun: data.nomorAkun,
      nama: data.nama,
      kelas: data.kelas,
      sekolah_id: sekolahId
    });
    return json(
      {
        success: true,
        data: Siswa.toDTO(siswa),
        message: "Siswa created successfully"
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
