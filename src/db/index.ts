import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Lokal development: fayl asosidagi SQLite (Turso talab qilinmaydi).
// Production (Vercel): TURSO_DATABASE_URL va TURSO_AUTH_TOKEN muhit
// o'zgaruvchilari orqali Turso'ga (bulutli, edge-uyg'un SQLite) ulanadi.
const url = process.env.TURSO_DATABASE_URL || `file:${process.env.DATABASE_PATH || "./data/app.db"}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient(
  authToken ? { url, authToken } : { url }
);

export const db = drizzle(client, { schema });
