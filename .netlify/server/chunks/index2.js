import { U as User } from "./User.js";
import crypto from "crypto";
const SESSION_COOKIE = "session_user_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
process.env.SESSION_SECRET || "infaq-jariyah-secret-key-2024";
const auth = {
  /** Set session cookie */
  setSession(cookies, user) {
    cookies.set(SESSION_COOKIE, user.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE
    });
  },
  /** Get session from cookies */
  async getSession(cookies) {
    const userId = cookies.get(SESSION_COOKIE);
    if (!userId) {
      return null;
    }
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    return {
      user_id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      sekolah_id: user.sekolah_id || null
    };
  },
  /** Clear session */
  clearSession(cookies) {
    cookies.delete(SESSION_COOKIE, {
      path: "/"
    });
  },
  /** Check if user is authenticated */
  async isAuthenticated(cookies) {
    return await this.getSession(cookies) !== null;
  },
  /** Require authentication, throw error if not authenticated */
  async requireAuth(cookies) {
    const session = await this.getSession(cookies);
    if (!session) {
      throw new Error("Not authenticated");
    }
    return session;
  },
  /** Generate CSRF token */
  generateCsrfToken() {
    return crypto.randomBytes(32).toString("hex");
  },
  /** Verify CSRF token */
  verifyCsrfToken(token) {
    return token.length === 64 && crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(token, "hex")
    );
  }
};
export {
  auth as a
};
