import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { ensureLocalDbFolder, localDbUrl } from "../src/db/local";

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

const url = localDbUrl();
const authToken = process.env.TURSO_AUTH_TOKEN;
// Papkani createClient'dan OLDIN yaratish shart — aks holda libsql ochilishda
// SQLITE_CANTOPEN beradi (yangi klon'da data/ papkasi yo'q).
ensureLocalDbFolder(url);

const client = createClient(authToken ? { url, authToken } : { url });
const db = drizzle(client);

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migratsiyalar qollandi (drizzle/).");
}

main()
  .catch((err) => {
    console.error("Migratsiya xatosi:", err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
