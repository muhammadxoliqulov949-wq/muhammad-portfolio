import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { asc } from "drizzle-orm";
import { z } from "zod";
import type { AnySQLiteColumn, AnySQLiteTable } from "drizzle-orm/sqlite-core";

/**
 * CRUD API-lar uchun qayta ishlatiladigan fabrika.
 * Har bir jadval (skills, services, experience, testimonials) uchun
 * bitta konfiguratsiya bilan GET/POST endpointlar yaratiladi.
 * PUT/DELETE esa [id]/route.ts da alohida yoziladi.
 */

export function createCollectionRoutes(
  table: AnySQLiteTable,
  itemSchema: z.ZodTypeAny,
  orderColumn?: AnySQLiteColumn
) {
  return {
    async GET() {
      const rows = orderColumn
        ? await db.select().from(table).orderBy(asc(orderColumn)).all()
        : await db.select().from(table).all();
      return NextResponse.json(rows);
    },

    async POST(req: NextRequest) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
      }

      const body = await req.json().catch(() => null);
      const parsed = itemSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      // AnySQLiteTable bilan ishlaganda drizzle generic tipni aniq bilib
      // bo'lmaydi — qiymatlar zod schema orqali tekshirilgan.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inserted = await db.insert(table).values(parsed.data as any).returning().get();
      return NextResponse.json(inserted, { status: 201 });
    },
  };
}
