import { json } from "@sveltejs/kit";
import { S as Siswa } from "../../../../chunks/Siswa.js";
const GET = async () => {
  try {
    const siswaList = Siswa.getAll();
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
const POST = async ({ request }) => {
  try {
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
    const existing = Siswa.findByNomorAkun(data.nomorAkun);
    if (existing) {
      return json(
        {
          success: false,
          message: "Nomor akun already exists"
        },
        { status: 400 }
      );
    }
    const siswa = Siswa.create({
      nomorAkun: data.nomorAkun,
      nama: data.nama,
      kelas: data.kelas
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
