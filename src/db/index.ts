import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { ensureLocalDbFolder, localDbUrl } from "./local";

// Lokal development: fayl asosidagi SQLite (Turso talab qilinmaydi).
// Production (Vercel): TURSO_DATABASE_URL va TURSO_AUTH_TOKEN muhit
// o'zgaruvchilari orqali Turso'ga (bulutli, edge-uyg'un SQLite) ulanadi.
const url = localDbUrl();
const authToken = process.env.TURSO_AUTH_TOKEN;
ensureLocalDbFolder(url);

const client = createClient(
  authToken ? { url, authToken } : { url }
);

export const db = drizzle(client, { schema });
