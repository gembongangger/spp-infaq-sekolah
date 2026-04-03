import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
path.dirname(fileURLToPath(import.meta.url));
const localDbPath = path.resolve(process.cwd(), "data/infaq_jariyah.db");
const dbDir = path.dirname(localDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const url = process.env.TURSO_CONNECTION_URL || `file:${localDbPath}`;
const authToken = process.env.TURSO_AUTH_TOKEN || "";
console.log(`Connecting to database at: ${url.startsWith("file:") ? "local file" : "Turso remote"}`);
const db = createClient({
  url,
  authToken
});
export {
  db as default
};
