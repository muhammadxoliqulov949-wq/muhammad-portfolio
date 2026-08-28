import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

/**
 * Migratsiyalarni qo'llash (Drizzle migratori orqali).
 *
 * Nima uchun `drizzle-kit migrate` emas: `file:` manziliga qaraganda
 * aynan shu drizzle-orm migratori production'da (Vercel build postinstall
 * yoki bir martalik `npm run db:migrate:run`) ishlashiga to'liq ishonch
 * beradi — bitta kod yo'li, lokal va prod bir xil.
 *
 * Ishlatish: `npm run db:migrate:run`
 */

const url = process.env.TURSO_DATABASE_URL || `file:${process.env.DATABASE_PATH || "./data/app.db"}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient(authToken ? { url, authToken } : { url });
const db = drizzle(client);

async function main() {
  if (!url.startsWith("http")) {
    // Lokal fayl uchun papkani tayyorlab olamiz
    const fs = await import("node:fs");
    const dir = url.replace(/^file:/, "").replace(/[^/]*$/, "");
    if (dir) fs.mkdirSync(dir, { recursive: true });
  }
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migratsiyalar qollandi (drizzle/).");
}

main()
  .catch((err) => {
    console.error("Migratsiya xatosi:", err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
