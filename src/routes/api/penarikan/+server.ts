/**
 * GET /api/penarikan - Get all permintaan penarikan
 * POST /api/penarikan - Create new permintaan penarikan
 */
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Penarikan } from "$lib/server/models/Penarikan";
import { auth } from "$lib/server/auth";

export const GET: RequestHandler = async ({ url, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);

    if (
      session.role !== "superadmin" &&
      session.role !== "keuangan" &&
      session.role !== "admin"
    ) {
      return json(
        {
          success: false,
          message: "Akses ditolak",
        },
        { status: 403 },
      );
    }

    let sekolahId: string | undefined;
    if (session.role === "keuangan" || session.role === "admin") {
      sekolahId = session.sekolah_id || undefined;
    } else {
      sekolahId = url.searchParams.get("sekolah_id") || undefined;
    }

    const status = url.searchParams.get("status") || undefined;
    const penarikanList = await Penarikan.getAll(sekolahId, status);

    return json(
      {
        success: true,
        data: penarikanList,
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

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);

    if (session.role !== "keuangan") {
      return json(
        {
          success: false,
          message:
            "Hanya bagian keuangan yang dapat membuat permintaan penarikan",
        },
        { status: 403 },
      );
    }

    if (!session.sekolah_id) {
      return json(
        {
          success: false,
          message: "User keuangan tidak memiliki sekolah aktif",
        },
        { status: 403 },
      );
    }

    const data = await request.json();

    if (!data.jumlah || data.jumlah <= 0) {
      return json(
        {
          success: false,
          message: "Jumlah harus lebih dari 0",
        },
        { status: 400 },
      );
    }

    const penarikan = await Penarikan.create({
      sekolah_id: session.sekolah_id,
      jumlah: parseFloat(data.jumlah),
      keterangan: data.keterangan || null,
      dibuat_oleh: session.user_id,
    });

    return json(
      {
        success: true,
        data: Penarikan.toDTO(penarikan),
        message: "Permintaan penarikan berhasil dibuat",
      },
      { status: 201 },
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
