import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { profileSchema, fieldErrors } from "@/lib/schemas";
import { requireAdmin } from "@/lib/security";

/** GET /api/profile — ochiq (saytda allaqachon ko'rinadigan ma'lumot). */
export async function GET() {
  const row = await db.select().from(profile).get();
  return NextResponse.json(row ?? null, { headers: { "cache-control": "no-store" } });
}

/**
 * PUT /api/profile — singleton qatorni yangilaydi.
 * Sessiya + Origin tekshiruvi + yagona zod sxema (admin formasi bilan bir xil).
 */
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ba'zi maydonlarni tekshiring", fields: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  const now = new Date();
  const existing = await db.select().from(profile).get();
  if (existing) {
    await db.update(profile).set({ ...parsed.data, updatedAt: now }).run();
  } else {
    await db.insert(profile).values({ ...parsed.data, updatedAt: now }).run();
  }

  revalidatePath("/", "layout");
  revalidatePath("/projects", "layout");
  const updated = await db.select().from(profile).get();
  return NextResponse.json(updated);
}
