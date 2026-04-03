import { json } from "@sveltejs/kit";
import { T as Transaksi } from "../../../../../chunks/Transaksi.js";
const GET = async ({ params }) => {
  try {
    const transaksi = await Transaksi.findById(params.id);
    if (!transaksi) {
      return json(
        {
          success: false,
          message: "Transaksi not found"
        },
        { status: 404 }
      );
    }
    return json(
      {
        success: true,
        data: Transaksi.toDTO(transaksi)
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
    const transaksi = await Transaksi.findById(params.id);
    if (!transaksi) {
      return json(
        {
          success: false,
          message: "Transaksi not found"
        },
        { status: 404 }
      );
    }
    const data = await request.json();
    const updateData = {};
    if (data.tanggal !== void 0) {
      let tanggal = data.tanggal;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
        tanggal = new Date(tanggal).toISOString().split("T")[0];
      }
      updateData.tanggal = tanggal;
    }
    if (data.keterangan !== void 0) updateData.keterangan = data.keterangan;
    if (data.kategori !== void 0) updateData.kategori = data.kategori;
    if (data.jenis !== void 0) updateData.jenis = data.jenis;
    if (data.jumlah !== void 0) updateData.jumlah = parseFloat(data.jumlah);
    if (data.metode !== void 0) updateData.metode = data.metode;
    if (data.siswaId !== void 0) updateData.siswa_id = data.siswaId || null;
    if (data.namaPengirim !== void 0) updateData.nama_pengirim = data.namaPengirim || null;
    if (data.kelasPengirim !== void 0) updateData.kelas_pengirim = data.kelasPengirim || null;
    if (data.nomorAkun !== void 0) updateData.nomor_akun = data.nomorAkun || null;
    if (data.bulan !== void 0) updateData.bulan = data.bulan || null;
    const updated = await Transaksi.update(params.id, updateData);
    if (!updated) {
      return json(
        {
          success: false,
          message: "Failed to update transaksi"
        },
        { status: 500 }
      );
    }
    return json(
      {
        success: true,
        data: Transaksi.toDTO(updated),
        message: "Transaksi updated successfully"
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
    const transaksi = await Transaksi.findById(params.id);
    if (!transaksi) {
      return json(
        {
          success: false,
          message: "Transaksi not found"
        },
        { status: 404 }
      );
    }
    await Transaksi.delete(params.id);
    return json(
      {
        success: true,
        message: "Transaksi deleted successfully"
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
