import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(1).max(120),
  title: z.string().min(1).max(160),
  badge: z.string().max(80),
  bio: z.string().max(2000),
  avatarInitials: z.string().max(4),
  email: z.string().email(),
  telegram: z.string().max(80),
  statProjects: z.string().max(20),
  statExperience: z.string().max(20),
  statAvailability: z.string().max(20),
});

export async function GET() {
  const row = await db.select().from(profile).get();
  return NextResponse.json(row ?? null);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.select().from(profile).get();
  const now = new Date();

  if (existing) {
    await db.update(profile).set({ ...parsed.data, updatedAt: now }).run();
  } else {
    await db.insert(profile).values({ ...parsed.data, updatedAt: now }).run();
  }

  const updated = await db.select().from(profile).get();
  return NextResponse.json(updated);
}
