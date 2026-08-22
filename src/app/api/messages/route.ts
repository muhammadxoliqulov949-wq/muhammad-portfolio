import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt)).all();
  return NextResponse.json(rows);
}
