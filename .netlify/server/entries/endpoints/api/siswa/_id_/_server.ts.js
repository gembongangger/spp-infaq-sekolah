import { json } from "@sveltejs/kit";
import { S as Siswa } from "../../../../../chunks/Siswa.js";
const GET = async ({ params }) => {
  try {
    const siswa = await Siswa.findById(params.id);
    if (!siswa) {
      return json(
        {
          success: false,
          message: "Siswa not found"
        },
        { status: 404 }
      );
    }
    return json(
      {
        success: true,
        data: Siswa.toDTO(siswa)
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
const PUT = async ({ params, request }) => {
  try {
    const siswa = await Siswa.findById(params.id);
    if (!siswa) {
      return json(
        {
          success: false,
          message: "Siswa not found"
        },
        { status: 404 }
      );
    }
    const data = await request.json();
    if (data.nomorAkun && data.nomorAkun !== siswa.nomor_akun) {
      const existing = await Siswa.findByNomorAkun(data.nomorAkun);
      if (existing && existing.id !== params.id) {
        return json(
          {
            success: false,
            message: "Nomor akun already exists"
          },
          { status: 400 }
        );
      }
    }
    const updated = await Siswa.update(params.id, {
      nomorAkun: data.nomorAkun,
      nama: data.nama,
      kelas: data.kelas
    });
    if (!updated) {
      return json(
        {
          success: false,
          message: "Failed to update siswa"
        },
        { status: 500 }
      );
    }
    return json(
      {
        success: true,
        data: Siswa.toDTO(updated),
        message: "Siswa updated successfully"
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
const DELETE = async ({ params }) => {
  try {
    const siswa = await Siswa.findById(params.id);
    if (!siswa) {
      return json(
        {
          success: false,
          message: "Siswa not found"
        },
        { status: 404 }
      );
    }
    await Siswa.delete(params.id);
    return json(
      {
        success: true,
        message: "Siswa deleted successfully"
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
  DELETE,
  GET,
  PUT
};
