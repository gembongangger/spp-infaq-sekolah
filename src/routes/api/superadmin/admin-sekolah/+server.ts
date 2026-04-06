/**
 * GET /api/superadmin/admin-sekolah
 * Get all school admins
 *
 * POST /api/superadmin/admin-sekolah
 * Create new school admin
 */
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { User } from "$lib/server/models/User";
import { Sekolah } from "$lib/server/models/Sekolah";
import { Kategori } from "$lib/server/models/Kategori";
import { auth } from "$lib/server/auth";

export const GET: RequestHandler = async ({ cookies, url }) => {
  try {
    const session = await auth.requireAuth(cookies);

    if (session.role !== "superadmin") {
      return json(
        {
          success: false,
          message: "Akses ditolak. Hanya superadmin yang dapat mengakses.",
        },
        { status: 403 },
      );
    }

    const sekolahId = url.searchParams.get("sekolah_id");

    let admins;
    if (sekolahId) {
      admins = await User.getBySekolah(sekolahId);
    } else {
      admins = await User.getAllWithSekolah();
    }

    const adminDTOs = admins.map((admin) => ({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      sekolahId: (admin as any).sekolah_id || null,
      sekolahNama: (admin as any).sekolah_nama || null,
      isActive: admin.is_active === 1,
      namaLengkap: admin.nama_lengkap || null,
      noHp: admin.no_hp || null,
      createdAt: admin.created_at,
    }));

    return json({ success: true, data: adminDTOs }, { status: 200 });
  } catch (error) {
    return json(
      { success: false, message: (error as Error).message },
      { status: 500 },
    );
  }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);

    if (session.role !== "superadmin") {
      return json(
        {
          success: false,
          message: "Akses ditolak. Hanya superadmin yang dapat mengakses.",
        },
        { status: 403 },
      );
    }

    const data = await request.json();

    if (!data.email || !data.password || !data.sekolah_id) {
      return json(
        { success: false, message: "Email, password, dan sekolah harus diisi" },
        { status: 400 },
      );
    }

    // Check if school exists
    const school = await Sekolah.findById(data.sekolah_id);
    if (!school) {
      return json(
        { success: false, message: "Sekolah tidak ditemukan" },
        { status: 404 },
      );
    }

    // Check if email already exists
    const existing = await User.findByEmail(data.email);
    if (existing) {
      return json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // Create admin user
    const admin = await User.create({
      username: data.email,
      email: data.email,
      password: data.password,
      role: data.role || "admin",
      sekolah_id: data.sekolah_id,
    });

    // Jika role keuangan, buat kategori "penarikan" untuk sekolah
    if (data.role === "keuangan") {
      try {
        // Cek apakah sudah ada kategori dengan nama "penarikan" untuk sekolah ini
        const existingKat = await Kategori.findByNamaAndSekolahId(
          "penarikan",
          data.sekolah_id,
        );

        // Jika tidak ada, cek apakah ada dengan NULL (global)
        if (!existingKat) {
          const existingGlobal = await Kategori.findByNama("penarikan");

          // Jika ada global "penarikan" dengan NULL, skip (asumsikan sudah ada)
          // Jika tidak ada sama sekali, buat baru
          if (!existingGlobal) {
            await Kategori.create({
              nama: "penarikan",
              ikon: "ArrowDownCircle",
              warna: "#ef4444",
              sekolah_id: data.sekolah_id,
            });
          }
        }
      } catch (katError) {
        // Jika error UNIQUE constraint, abaikan (kategori sudah ada)
        console.warn("Kategori penarikan mungkin sudah ada:", katError);
      }
    }

    return json(
      {
        success: true,
        message: "Admin sekolah berhasil ditambahkan",
        data: User.toDTO(admin),
      },
      { status: 201 },
    );
  } catch (error) {
    return json(
      { success: false, message: (error as Error).message },
      { status: 500 },
    );
  }
};
