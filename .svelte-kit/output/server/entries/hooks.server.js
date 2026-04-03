import { json } from "@sveltejs/kit";
import db from "../chunks/index3.js";
function migrate() {
  db.exec(`
		ALTER TABLE user ADD COLUMN nama_lengkap TEXT NULL;
	`);
  db.exec(`
		ALTER TABLE user ADD COLUMN no_hp TEXT NULL;
	`);
  db.exec(`
		ALTER TABLE user ADD COLUMN foto_url TEXT NULL;
	`);
  console.log("Migration completed: Added profile fields to user table");
}
try {
  migrate();
} catch (error) {
  if (!error.message.includes("duplicate column")) {
    console.error("Migration error:", error);
  }
}
const handle = async ({ event, resolve }) => {
  try {
    const response = await resolve(event);
    return response;
  } catch (error) {
    if (event.url.pathname.startsWith("/api/")) {
      return json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error"
        },
        { status: 500 }
      );
    }
    throw error;
  }
};
export {
  handle
};
