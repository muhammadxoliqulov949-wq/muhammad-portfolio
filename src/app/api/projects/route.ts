import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(2000),
  link: z.string().max(500).optional().default(""),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

export async function GET(req: NextRequest) {
  const session = await getSession();
  const showAll = req.nextUrl.searchParams.get("all") === "1" && !!session;

  const rows = showAll
    ? await db.select().from(projects).orderBy(asc(projects.order)).all()
    : await db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.order)).all();

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() }, { status: 400 });
  }

  const inserted = await db
    .insert(projects)
    .values({ ...parsed.data, createdAt: new Date() })
    .returning()
    .get();

  return NextResponse.json(inserted, { status: 201 });
}
