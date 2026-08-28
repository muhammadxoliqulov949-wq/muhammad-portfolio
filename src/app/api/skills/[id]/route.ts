import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { skillSchema } from "../route";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }
  const { id } = await params;
  const skillId = Number(id);
  if (!Number.isInteger(skillId)) {
    return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ma'lumotlar noto'g'ri" }, { status: 400 });
  }
  const updated = await db
    .update(skills)
    .set(parsed.data)
    .where(eq(skills.id, skillId))
    .returning()
    .get();
  if (!updated) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }
  const { id } = await params;
  const skillId = Number(id);
  if (!Number.isInteger(skillId)) {
    return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
  }
  await db.delete(skills).where(eq(skills.id, skillId)).run();
  return NextResponse.json({ ok: true });
}
