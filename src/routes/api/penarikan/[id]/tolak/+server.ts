/**
 * POST /api/penarikan/[id]/tolak - Reject permintaan penarikan
 */
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Penarikan } from "$lib/server/models/Penarikan";
import { auth } from "$lib/server/auth";

export const POST: RequestHandler = async ({ params, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);

    if (session.role !== "admin" && session.role !== "superadmin") {
      return json(
        {
          success: false,
          message: "Hanya admin yang dapat menolak permintaan penarikan",
        },
        { status: 403 },
      );
    }

    const penarikanId = params.id;
    const penarikan = await Penarikan.getById(penarikanId);

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

    const success = await Penarikan.reject(penarikanId, session.user_id);

    if (!success) {
      return json(
        {
          success: false,
          message: "Gagal menolak permintaan penarikan",
        },
        { status: 500 },
      );
    }

    return json(
      {
        success: true,
        message: "Permintaan penarikan berhasil ditolak",
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
