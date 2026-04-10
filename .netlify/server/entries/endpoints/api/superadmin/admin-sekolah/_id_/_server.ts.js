import { json } from "@sveltejs/kit";
import { U as User } from "../../../../../../chunks/User.js";
import { a as auth } from "../../../../../../chunks/index2.js";
import "bcryptjs";
const PUT = async ({ params, request, cookies }) => {
  try {
    const session = await auth.requireAuth(cookies);
    if (session.role !== "superadmin") {
      return json(
        {
          success: false,
          message: "Akses ditolak. Hanya superadmin yang dapat mengakses."
        },
        { status: 403 }
      );
    }
    const data = await request.json();
    const user = await User.findByIdRaw(params.id);
    if (!user) {
      return json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }
    if (data.email && data.email !== user.email) {
      const existing = await User.findByEmail(data.email);
      if (existing) {
        return json(
          { success: false, message: "Email sudah terdaftar" },
          { status: 400 }
        );
      }
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updateData = {};
    if (data.email !== void 0) {
      updateData.email = data.email;
      if (user.username === user.email) {
        updateData.username = data.email;
      }
    }
    if (data.role !== void 0) updateData.role = data.role;
    if (data.sekolah_id !== void 0) updateData.sekolah_id = data.sekolah_id;
    if (data.nama_lengkap !== void 0)
      updateData.nama_lengkap = data.nama_lengkap;
    if (data.no_hp !== void 0) updateData.no_hp = data.no_hp;
    if (data.is_active !== void 0)
      updateData.is_active = data.is_active ? 1 : 0;
    if (data.password) {
      await User.updatePassword(params.id, data.password);
    }
    const db = (await import("../../../../../../chunks/index3.js")).default;
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(updateData)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
    if (updates.length > 0) {
      updates.push("updated_at = ?");
      values.push(now);
      values.push(params.id);
      await db.execute({
        sql: `UPDATE user SET ${updates.join(", ")} WHERE id = ?`,
        args: values
      });
    }
    const updatedUser = await User.findByIdRaw(params.id);
    return json(
      {
        success: true,
        message: "Admin berhasil diperbarui",
        data: User.toDTO(updatedUser)
      },
      { status: 200 }
    );
  } catch (error) {
    return json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
const DELETE = async ({ params, cookies, url }) => {
  try {
    const session = await auth.requireAuth(cookies);
    if (session.role !== "superadmin") {
      return json(
        {
          success: false,
          message: "Akses ditolak. Hanya superadmin yang dapat mengakses."
        },
        { status: 403 }
      );
    }
    const user = await User.findByIdRaw(params.id);
    if (!user) {
      return json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }
    if (user.role === "superadmin") {
      return json(
        { success: false, message: "Tidak dapat mengubah status superadmin" },
        { status: 400 }
      );
    }
    const db = (await import("../../../../../../chunks/index3.js")).default;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const isPermanent = url.searchParams.get("permanent") === "true";
    if (isPermanent) {
      await db.execute({
        sql: "DELETE FROM permintaan_penarikan WHERE dibuat_oleh = ? OR diproses_oleh = ?",
        args: [params.id, params.id]
      });
      await db.execute({
        sql: "DELETE FROM user WHERE id = ?",
        args: [params.id]
      });
      return json(
        { success: true, message: "Admin berhasil dihapus permanen" },
        { status: 200 }
      );
    }
    const newStatus = user.is_active === 1 ? 0 : 1;
    await db.execute({
      sql: "UPDATE user SET is_active = ?, updated_at = ? WHERE id = ?",
      args: [newStatus, now, params.id]
    });
    const message = newStatus === 1 ? "Admin berhasil diaktifkan" : "Admin berhasil dinonaktifkan";
    return json({ success: true, message }, { status: 200 });
  } catch (error) {
    return json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
export {
  DELETE,
  PUT
};
