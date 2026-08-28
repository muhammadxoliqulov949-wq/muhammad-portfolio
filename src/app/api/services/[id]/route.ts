import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { serviceSchema } from "../route";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }
  const { id } = await params;
  const serviceId = Number(id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ma'lumotlar noto'g'ri" }, { status: 400 });
  }
  const updated = await db
    .update(services)
    .set(parsed.data)
    .where(eq(services.id, serviceId))
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
  const serviceId = Number(id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
  }
  await db.delete(services).where(eq(services.id, serviceId)).run();
  return NextResponse.json({ ok: true });
}
