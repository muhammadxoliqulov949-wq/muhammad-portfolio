import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/security";
import { fieldErrors } from "@/lib/schemas";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invalidateSiteData } from "@/lib/content";
import type { AnySQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import type { z } from "zod";

/**
 * Koleksiya CRUD API-lari uchun fabrika.
 *
 * Nima uchun kerak: avval har bir entitet (skills/services/experience/
 * testimonials/projects) uchun kod nusxalanar edi — natijada validatsiya
 * qoidalari va xato formatlari har xil bo'lib qolgan edi. Endi bitta yo'l:
 * bir xil auth + Origin tekshiruvi, bir xil xato javobi, bir xil
 * `revalidatePath`si, bir xil reorder mantiqi.
 */

export type CollectionConfig = {
  label: string;
  table: SQLiteTable;
  schema: z.ZodObject<z.ZodRawShape>;
  orderColumn: AnySQLiteColumn;
  idColumn?: AnySQLiteColumn;
  /** Mutatsiyadan keyin yangilanadigan sayt yo'llari */
  revalidatePaths?: string[];
  /** GET uchun qo'shimcha filtr (masalan faqat published) */
  publicFilter?: AnySQLiteColumn;
  defaultSort?: "asc" | "desc";
};

const idOf = (raw: string): number | null => {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
};

function revalidate(cfg: CollectionConfig) {
  invalidateSiteData();
  for (const p of cfg.revalidatePaths ?? ["/"]) {
    revalidatePath(p, p.includes("[") ? "page" : "layout");
  }
}

/** GET (ochiq ro'yxat) va POST (admin). */
export function createCollectionRoutes(cfg: CollectionConfig) {
  const idCol = cfg.idColumn ?? ((cfg.table as unknown as Record<string, AnySQLiteColumn>).id as AnySQLiteColumn);

  return {
    async GET(req: NextRequest) {
      const session = await getSession();
      const wantAll = req.nextUrl.searchParams.get("all") === "1" && !!session;
      const filter = cfg.publicFilter;

      const rows =
        wantAll || !filter
          ? await db.select().from(cfg.table).orderBy(asc(cfg.orderColumn)).all()
          : await db
              .select()
              .from(cfg.table)
              .where(eq(filter, true))
              .orderBy(asc(cfg.orderColumn))
              .all();

      return NextResponse.json(rows, {
        headers: wantAll ? { "cache-control": "no-store" } : { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      });
    },

    async POST(req: NextRequest) {
      const auth = await requireAdmin(req);
      if (auth instanceof NextResponse) return auth;

      const body = await req.json().catch(() => null);
      const parsed = cfg.schema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Ba'zi maydonlarni tekshiring", fields: fieldErrors(parsed.error) },
          { status: 422 }
        );
      }

      const values: Record<string, unknown> = { ...parsed.data };
      if ((cfg.table as unknown as Record<string, unknown>).createdAt) {
        values.createdAt = new Date();
      }
      const inserted = await db
        .insert(cfg.table)
        // qiymatlar zod sxemasidan o'tgan
        .values(values as never)
        .returning()
        .get();

      revalidate(cfg);
      return NextResponse.json(inserted, { status: 201 });
    },

    /** POST /api/<collection>/reorder — { ids: [3,1,2] } */
    async POST_Reorder(req: NextRequest) {
      const auth = await requireAdmin(req);
      if (auth instanceof NextResponse) return auth;

      const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
      const ids = Array.isArray(body?.ids) ? body!.ids.map(Number) : null;
      if (!ids || ids.length === 0 || ids.some((n) => !Number.isInteger(n) || n <= 0)) {
        return NextResponse.json({ error: "`ids` massiv kutildi" }, { status: 400 });
      }

      for (const [index, id] of ids.entries()) {
        await db.update(cfg.table).set({ order: index } as never).where(eq(idCol, id)).run();
      }
      revalidate(cfg);
      return NextResponse.json({ ok: true });
    },

    async PUT_ID(req: NextRequest, params: Promise<{ id: string }>) {
      const auth = await requireAdmin(req);
      if (auth instanceof NextResponse) return auth;

      const id = idOf((await params).id);
      if (!id) return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });

      const body = await req.json().catch(() => null);
      const parsed = cfg.schema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Ba'zi maydonlarni tekshiring", fields: fieldErrors(parsed.error) },
          { status: 422 }
        );
      }

      const updated = await db
        .update(cfg.table)
        .set(parsed.data as never)
        .where(eq(idCol, id))
        .returning()
        .get();

      if (!updated) return NextResponse.json({ error: "Yozuv topilmadi" }, { status: 404 });
      revalidate(cfg);
      return NextResponse.json(updated);
    },

    /** Qisman yangilash (masalan "published" ni almashtirish) */
    async PATCH_ID(req: NextRequest, params: Promise<{ id: string }>) {
      const auth = await requireAdmin(req);
      if (auth instanceof NextResponse) return auth;

      const id = idOf((await params).id);
      if (!id) return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });

      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "Jism kutildi" }, { status: 400 });
      }

      const allowed = new Set(Object.keys(cfg.schema.shape));
      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(body)) {
        if (allowed.has(k)) patch[k] = v;
      }
      if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "Yangilanadigan maydon yo'q" }, { status: 400 });
      }

      const updated = await db.update(cfg.table).set(patch as never).where(eq(idCol, id)).returning().get();
      if (!updated) return NextResponse.json({ error: "Yozuv topilmadi" }, { status: 404 });
      revalidate(cfg);
      return NextResponse.json(updated);
    },

    async DELETE_ID(req: NextRequest, params: Promise<{ id: string }>) {
      const auth = await requireAdmin(req);
      if (auth instanceof NextResponse) return auth;

      const id = idOf((await params).id);
      if (!id) return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });

      const deleted = await db.delete(cfg.table).where(eq(idCol, id)).returning({ id: idCol }).get();
      if (!deleted) return NextResponse.json({ error: "Yozuv topilmadi" }, { status: 404 });

      revalidate(cfg);
      return NextResponse.json({ ok: true });
    },
  };
}

/** `sort=desc` bo'lgan jadval (xabarlar) uchun yordamchi. */
export const newest = (col: AnySQLiteColumn) => desc(col);
