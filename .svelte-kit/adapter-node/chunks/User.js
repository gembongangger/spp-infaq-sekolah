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
      is_active: user.is_active === 1,
      nama_lengkap: user.nama_lengkap || null,
      no_hp: user.no_hp || null,
      foto_url: user.foto_url || null,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  },
  /** Find user by email */
  findByEmail(email) {
    const stmt = db.prepare("SELECT * FROM user WHERE email = ? AND is_active = 1");
    return stmt.get(email);
  },
  /** Find user by ID */
  findById(id) {
    const stmt = db.prepare("SELECT * FROM user WHERE id = ? AND is_active = 1");
    return stmt.get(id);
  },
  /** Find user by ID without active check */
  findByIdRaw(id) {
    const stmt = db.prepare("SELECT * FROM user WHERE id = ?");
    return stmt.get(id);
  },
  /** Create new user */
  create(data) {
    const id = v4();
    const password_hash = bcrypt.hashSync(data.password, 10);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const role = data.role || "admin";
    const is_active = 1;
    const stmt = db.prepare(`
			INSERT INTO user (id, username, email, password_hash, role, is_active, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`);
    stmt.run(id, data.username, data.email, password_hash, role, is_active, now, now);
    return this.findByIdRaw(id);
  },
  /** Update user password */
  updatePassword(id, newPassword) {
    const password_hash = bcrypt.hashSync(newPassword, 10);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const stmt = db.prepare(`
			UPDATE user 
			SET password_hash = ?, updated_at = ?
			WHERE id = ?
		`);
    const result = stmt.run(password_hash, now, id);
    return result.changes > 0;
  },
  /** Check password */
  checkPassword(user, password) {
    return bcrypt.compareSync(password, user.password_hash);
  },
  /** Get all users */
  getAll() {
    const stmt = db.prepare("SELECT * FROM user ORDER BY created_at DESC");
    return stmt.all();
  },
  /** Update user profile */
  updateProfile(id, data) {
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
    const stmt = db.prepare(`
			UPDATE user
			SET ${fields.join(", ")}
			WHERE id = ?
		`);
    const result = stmt.run(...values);
    return result.changes > 0;
  }
};
export {
  User as U
};
