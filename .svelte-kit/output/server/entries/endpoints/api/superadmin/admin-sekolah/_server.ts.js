import { json } from "@sveltejs/kit";
import { U as User } from "../../../../../chunks/User.js";
import { S as Sekolah } from "../../../../../chunks/Sekolah.js";
import { a as auth } from "../../../../../chunks/index2.js";
const GET = async ({ cookies, url }) => {
  try {
    const session = await auth.requireAuth(cookies);
    if (session.role !== "superadmin") {
      return json(
        { success: false, message: "Akses ditolak. Hanya superadmin yang dapat mengakses." },
        { status: 403 }
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
      sekolahId: admin.sekolah_id || null,
      sekolahNama: admin.sekolah_nama || null,
      isActive: admin.is_active === 1,
      namaLengkap: admin.nama_lengkap || null,
      noHp: admin.no_hp || null,
      createdAt: admin.created_at
    }));
    return json(
      { success: true, data: adminDTOs },
      { status: 200 }
    );
  } catch (error) {
    return json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
const POST = async ({ request, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
    if (session.role !== "superadmin") {
      return json(
        { success: false, message: "Akses ditolak. Hanya superadmin yang dapat mengakses." },
        { status: 403 }
      );
    }
    const data = await request.json();
    if (!data.email || !data.password || !data.sekolah_id) {
      return json(
        { success: false, message: "Email, password, dan sekolah harus diisi" },
        { status: 400 }
      );
    }
    const school = await Sekolah.findById(data.sekolah_id);
    if (!school) {
      return json(
        { success: false, message: "Sekolah tidak ditemukan" },
        { status: 404 }
      );
    }
    const existing = await User.findByEmail(data.email);
    if (existing) {
      return json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }
    const admin = await User.create({
      username: data.email,
      email: data.email,
      password: data.password,
      role: data.role || "admin",
      sekolah_id: data.sekolah_id
    });
    return json(
      {
        success: true,
        message: "Admin sekolah berhasil ditambahkan",
        data: User.toDTO(admin)
      },
      { status: 201 }
    );
  } catch (error) {
    return json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
export {
  GET,
  POST
};
