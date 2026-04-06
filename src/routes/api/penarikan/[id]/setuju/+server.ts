/**
 * POST /api/penarikan/[id]/setuju - Approve permintaan penarikan
 */
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Penarikan } from "$lib/server/models/Penarikan";
import { Transaksi } from "$lib/server/models/Transaksi";
import { auth } from "$lib/server/auth";

export const POST: RequestHandler = async ({ params, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);

    if (session.role !== "admin" && session.role !== "superadmin") {
      return json(
        {
          success: false,
          message: "Hanya admin yang dapat menyetujui permintaan penarikan",
        },
        { status: 403 },
      );
    }

    const penarikanId = params.id;
    const penarikan = await Penarikan.getByIdWithUser(penarikanId);

    if (!penarikan) {
      return json(
        {
          success: false,
          message: "Permintaan penarikan tidak ditemukan",
        },
        { status: 404 },
      );
    }

    if (
      session.role === "admin" &&
      session.sekolah_id !== penarikan.sekolah_id
    ) {
      return json(
        {
          success: false,
          message: "Akses ditolak - permintaan bukan dari sekolah Anda",
        },
        { status: 403 },
      );
    }

    if (penarikan.status !== "menunggu") {
      return json(
        {
          success: false,
          message: "Permintaan penarikan sudah diproses",
        },
        { status: 400 },
      );
    }

    const approveSuccess = await Penarikan.approve(
      penarikanId,
      session.user_id,
    );

    if (!approveSuccess) {
      return json(
        {
          success: false,
          message: "Gagal menyetujui permintaan penarikan",
        },
        { status: 500 },
      );
    }

    await Transaksi.create({
      tanggal: new Date().toISOString().split("T")[0],
      keterangan: `Penarikan Dana - ${penarikan.keterangan || "Tanpa Keterangan"}`,
      kategori: "penarikan",
      jenis: "keluar",
      jumlah: penarikan.jumlah,
      metode: "transfer",
      siswaId: null,
      namaPengirim: penarikan.nama_pembuat || "Bagian Keuangan",
      kelasPengirim: null,
      nomorAkun: null,
      bulan: null,
      sekolah_id: penarikan.sekolah_id,
    });

    return json(
      {
        success: true,
        message:
          "Permintaan penarikan berhasil disetujui dan dicatat sebagai transaksi keluar",
      },
      { status: 200 },
    );
  } catch (error) {
    return json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
};
