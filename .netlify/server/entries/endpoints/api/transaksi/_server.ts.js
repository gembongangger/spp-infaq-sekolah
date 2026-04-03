import { json } from "@sveltejs/kit";
import { T as Transaksi } from "../../../../chunks/Transaksi.js";
const GET = async ({ url }) => {
  try {
    const filters = {};
    if (url.searchParams.has("kategori")) {
      filters.kategori = url.searchParams.get("kategori") || void 0;
    }
    if (url.searchParams.has("jenis")) {
      filters.jenis = url.searchParams.get("jenis") || void 0;
    }
    if (url.searchParams.has("metode")) {
      filters.metode = url.searchParams.get("metode") || void 0;
    }
    if (url.searchParams.has("tanggal_from")) {
      filters.tanggal_from = url.searchParams.get("tanggal_from") || void 0;
    }
    if (url.searchParams.has("tanggal_to")) {
      filters.tanggal_to = url.searchParams.get("tanggal_to") || void 0;
    }
    if (url.searchParams.has("limit")) {
      filters.limit = parseInt(url.searchParams.get("limit") || "0", 10);
    }
    const transaksiList = await Transaksi.getAll(filters);
    return json(
      {
        success: true,
        data: transaksiList.map(Transaksi.toDTO)
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
    const requiredFields = ["tanggal", "keterangan", "kategori", "jenis", "jumlah", "metode"];
    if (!data || !requiredFields.every((field) => Object.prototype.hasOwnProperty.call(data, field))) {
      return json(
        {
          success: false,
          message: `Missing required fields: ${requiredFields.join(", ")}`
        },
        { status: 400 }
      );
    }
    let tanggal = data.tanggal;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      tanggal = new Date(tanggal).toISOString().split("T")[0];
    }
    const transaksi = await Transaksi.create({
      tanggal,
      keterangan: data.keterangan,
      kategori: data.kategori,
      jenis: data.jenis,
      jumlah: parseFloat(data.jumlah),
      metode: data.metode,
      siswaId: data.siswaId || null,
      namaPengirim: data.namaPengirim || null,
      kelasPengirim: data.kelasPengirim || null,
      nomorAkun: data.nomorAkun || null,
      bulan: data.bulan || null
    });
    return json(
      {
        success: true,
        data: Transaksi.toDTO(transaksi),
        message: "Transaksi created successfully"
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
