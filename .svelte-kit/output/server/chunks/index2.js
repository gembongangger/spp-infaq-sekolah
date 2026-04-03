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
  getSession(cookies) {
    const userId = cookies.get(SESSION_COOKIE);
    if (!userId) {
      return null;
    }
    const user = User.findById(userId);
    if (!user) {
      return null;
    }
    return {
      user_id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  },
  /** Clear session */
  clearSession(cookies) {
    cookies.delete(SESSION_COOKIE, {
      path: "/"
    });
  },
  /** Check if user is authenticated */
  isAuthenticated(cookies) {
    return this.getSession(cookies) !== null;
  },
  /** Require authentication, throw error if not authenticated */
  requireAuth(cookies) {
    const session = this.getSession(cookies);
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
