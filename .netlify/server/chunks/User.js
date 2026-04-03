import db from "./index3.js";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
const User = {
  /** Convert raw DB row to DTO */
  toDTO(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      sekolahId: user.sekolah_id || null,
      is_active: user.is_active === 1,
      nama_lengkap: user.nama_lengkap || null,
      no_hp: user.no_hp || null,
      foto_url: user.foto_url || null,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  },
  /** Find user by email or username */
  async findByEmail(identifier) {
    const result = await db.execute({
      sql: "SELECT * FROM user WHERE (email = ? OR username = ?) AND is_active = 1",
      args: [identifier, identifier]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Find user by ID */
  async findById(id) {
    const result = await db.execute({
      sql: "SELECT * FROM user WHERE id = ? AND is_active = 1",
      args: [id]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Find user by ID without active check */
  async findByIdRaw(id) {
    const result = await db.execute({
      sql: "SELECT * FROM user WHERE id = ?",
      args: [id]
    });
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  /** Create new user */
  async create(data) {
    const id = v4();
    const password_hash = await bcrypt.hash(data.password, 10);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const role = data.role || "admin";
    const is_active = 1;
    const sekolah_id = data.sekolah_id || null;
    await db.execute({
      sql: `
				INSERT INTO user (id, username, email, password_hash, role, sekolah_id, is_active, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
      args: [id, data.username, data.email, password_hash, role, sekolah_id, is_active, now, now]
    });
    const user = await this.findByIdRaw(id);
    return user;
  },
  /** Update user password */
  async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const result = await db.execute({
      sql: `
				UPDATE user
				SET password_hash = ?, updated_at = ?
				WHERE id = ?
			`,
      args: [password_hash, now, id]
    });
    return result.rowsAffected > 0;
  },
  /** Check password */
  async checkPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  },
  /** Get all users */
  async getAll() {
    const result = await db.execute("SELECT * FROM user ORDER BY created_at DESC");
    return result.rows;
  },
  /** Get users by sekolah_id */
  async getBySekolah(sekolahId) {
    const result = await db.execute({
      sql: "SELECT * FROM user WHERE sekolah_id = ? ORDER BY created_at DESC",
      args: [sekolahId]
    });
    return result.rows;
  },
  /** Get all users with school info */
  async getAllWithSekolah() {
    const result = await db.execute(`
			SELECT user.*, sekolah.nama as sekolah_nama
			FROM user
			LEFT JOIN sekolah ON user.sekolah_id = sekolah.id
			ORDER BY user.created_at DESC
		`);
    return result.rows;
  },
  /** Update user profile */
  async updateProfile(id, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const fields = [];
    const values = [];
    if (data.nama_lengkap !== void 0) {
      fields.push("nama_lengkap = ?");
      values.push(data.nama_lengkap);
    }
    if (data.no_hp !== void 0) {
      fields.push("no_hp = ?");
      values.push(data.no_hp);
    }
    if (data.foto_url !== void 0) {
      fields.push("foto_url = ?");
      values.push(data.foto_url);
    }
    if (fields.length === 0) {
      return false;
    }
    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);
    const result = await db.execute({
      sql: `
				UPDATE user
				SET ${fields.join(", ")}
				WHERE id = ?
			`,
      args: values
    });
    return result.rowsAffected > 0;
  }
};
export {
  User as U
};
