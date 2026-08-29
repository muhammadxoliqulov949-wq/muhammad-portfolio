import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/security";

type Ctx = { params: Promise<{ id: string }> };

const parseId = async (ctx: Ctx): Promise<number | null> => {
  const n = Number((await ctx.params).id);
  return Number.isInteger(n) && n > 0 ? n : null;
};

/** PATCH /api/messages/:id — { read: boolean } */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const id = await parseId(ctx);
  if (!id) return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as { read?: unknown } | null;
  if (!body || typeof body.read !== "boolean") {
    return NextResponse.json({ error: "`read` boolean bo'lishi kerak" }, { status: 400 });
  }

  const updated = await db.update(messages).set({ read: body.read }).where(eq(messages.id, id)).returning().get();
  if (!updated) return NextResponse.json({ error: "Xabar topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

/** DELETE /api/messages/:id */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const id = await parseId(ctx);
  if (!id) return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });

  const deleted = await db.delete(messages).where(eq(messages.id, id)).returning({ id: messages.id }).get();
  if (!deleted) return NextResponse.json({ error: "Xabar topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
