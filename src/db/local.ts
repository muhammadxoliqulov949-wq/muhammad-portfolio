/**
 * Lokal SQLite faylini ochishga tayyorlash.
 *
 * Nima uchun kerak: `data/` papkasi git'ga kirmaydi (`.gitignore`: `/data/*.db`),
 * shuning uchun yangi klon'da papka umuman mavjud emas va libsql `SQLITE_CANTOPEN`
 * (code 14) bilan darrov qulaydi — xato matnida "papkani yarat" deyilmaydi.
 * Shu yagona yordamchi bilan `npm run setup` birinchi urinishda ham ishlaydi.
 */

import { mkdirSync } from "node:fs";

export function localDbUrl(): string {
  return process.env.TURSO_DATABASE_URL || `file:${process.env.DATABASE_PATH || "./data/app.db"}`;
}

/** `file:` manzilidagi papkani yaratadi; Turso/http URL'larida hechnarsa qilmaydi. */
export function ensureLocalDbFolder(url = localDbUrl()): void {
  if (url.startsWith("http") || url.startsWith("libsql")) return;
  const dir = url.replace(/^file:/, "").replace(/[^/]*$/, "");
  if (dir) mkdirSync(dir, { recursive: true });
}
