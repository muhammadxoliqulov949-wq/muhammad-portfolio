import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { contactSchema, fieldErrors } from "@/lib/schemas";
import { clientIp, rateLimit, tooMany } from "@/lib/security";

/**
 * POST /api/contact — aloqa formasi.
 *
 * Himoya qatlamlari:
 *  1. sliding-window rate limit (bir IP'ga daqiqasiga 5 ta);
 *  2. honeypot (`website` maydoni to'ldirilgan bo'lsa — jimgina rad etamiz,
 *     botga "muvaffaqiyat" ko'rsatib o'zgartirishga undamaymiz);
 *  3. umumiy zod sxema (server ham, klient ham tekshiradi).
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimit(`contact:${ip}`, 5, 60_000)) return tooMany(60);

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ma'lumotlarni tekshirib chiqing", fields: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  await db
    .insert(messages)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      createdAt: new Date(),
    })
    .run();

  return NextResponse.json({ ok: true }, { status: 201 });
}
