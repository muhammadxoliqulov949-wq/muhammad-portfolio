import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/security";

/**
 * GET /api/messages?unread=1&limit=50 — admin uchun.
 * Xatolar endi aniq status kodlari bilan qaytadi (avval `res.ok` tekshirilmay,
 * bo'sh ro'yxat "xabar yo'q" deb ko'rsatilardi).
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const sp = req.nextUrl.searchParams;
  const onlyUnread = sp.get("unread") === "1";
  const limit = Math.min(Math.max(Number(sp.get("limit") ?? 100) || 100, 1), 200);

  const base = db.select().from(messages).orderBy(desc(messages.createdAt));
  const rows = (onlyUnread ? base.where(eq(messages.read, false)) : base).limit(limit).all();

  return NextResponse.json(await rows, { headers: { "cache-control": "no-store" } });
}
