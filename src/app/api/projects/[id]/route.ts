import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(2000),
  link: z.string().max(500).optional().default(""),
  github: z.string().max(500).optional().default(""),
  image: z.string().max(1000).optional().default(""),
  tech: z.string().max(300).optional().default(""),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await db
    .update(projects)
    .set(parsed.data)
    .where(eq(projects.id, projectId))
    .returning()
    .get();

  if (!updated) {
    return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
  }

  await db.delete(projects).where(eq(projects.id, projectId)).run();
  return NextResponse.json({ ok: true });
}
