import { NextRequest, NextResponse } from "next/server";
import { destroySession, getSession, revokeSessions } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";

/** POST /api/auth/logout — faqat same-origin (CSRF-bilan chiqishni oldini olish). */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Manba tekshiruvi muvaffaqiyatsiz" }, { status: 403 });
  }
  // Token stateless — cookie'ni o'chirish bilan birga uni bekor ham qilamiz,
  // aks holda chop etilgan token 7 kun davomida yashab qolardi.
  const session = await getSession();
  if (session) await revokeSessions(session.adminId);
  await destroySession();
  return NextResponse.json({ ok: true });
}
