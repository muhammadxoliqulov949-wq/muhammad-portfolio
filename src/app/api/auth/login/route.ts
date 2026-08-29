import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession } from "@/lib/auth";
import { z } from "zod";
import { clientIp, rateLimit, tooMany } from "@/lib/security";

const loginSchema = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
});

/**
 * Soxta hash — foydalanuvchi mavjud bo'lmaganda ham bcrypt niqobini
 * saqlash uchun (timing oracle orqali email sanashni qiyinlashtiradi).
 */
const DUMMY_HASH = "$2b$10$C6Uk1l0d3m0h4shf0rTimingEqualityCheckAAAAAAAAAAAAAAAAAAAAA";

/** POST /api/auth/login — brent-forst + CSRF sessiyasi yaratadi. */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimit(`login:${ip}`, 8, 10 * 60_000)) return tooMany(10 * 60);

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email va parol kiriting" }, { status: 400 });
  }

  const admin = await db.select().from(admins).where(eq(admins.email, parsed.data.email)).get();
  const valid = await verifyPassword(parsed.data.password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) {
    // Bir xil xabar: hisob mavjudligini aniqlashning oldini oladi
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  await createSession({ adminId: admin.id, email: admin.email, name: admin.name });
  return NextResponse.json({ ok: true, name: admin.name });
}
