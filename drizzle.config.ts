import type { Config } from "drizzle-kit";

const url = process.env.TURSO_DATABASE_URL || `file:${process.env.DATABASE_PATH || "./data/app.db"}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url,
    ...(authToken ? { authToken } : {}),
  },
} satisfies Config;
