import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const envDbPath = process.env.DATABASE_PATH;
const possiblePaths = envDbPath ? [envDbPath] : [
  // Railway: /app/data/infaq_jariyah.db
  "/app/data/infaq_jariyah.db",
  // Production: relative to build output
  path.resolve(__dirname$1, "../../../../data/infaq_jariyah.db"),
  // Development: relative to src/lib/server
  path.resolve(__dirname$1, "../../../../../data/infaq_jariyah.db"),
  // Fallback: relative to current working directory
  path.resolve(process.cwd(), "data/infaq_jariyah.db")
];
let dbPath = possiblePaths.find((p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
});
if (!dbPath) {
  dbPath = envDbPath || "/app/data/infaq_jariyah.db";
}
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
export {
  db as default
};
