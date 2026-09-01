import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media, profile } from "@/db/schema";
import {
  MAX_INPUT_BYTES,
  MEDIA_CACHE,
  MediaError,
  PORTRAIT_URL,
  decodeMedia,
  processImage,
} from "@/lib/media";
import { clientIp, rateLimit, requireAdmin, tooMany } from "@/lib/security";
import { invalidateSiteData } from "@/lib/content";

/**
 * /api/media/[key] — sayt rasmlari.
 *
 *  - `GET`    ochiq: rasmning o'zi (base64 → bytes), qisqa cache + `ETag`.
 *  - `POST`   admin: `multipart/form-data` (`file`) — yuklash/almashtirish.
 *  - `DELETE` admin: nusxani o'chirish (sayt monogramga qaytadi).
 *
 * Rasm DB'da saqlanadi, chunki Vercel'da fayl tizimi read-only (`public/media`ga
 * yozib bo'lmaydi). Portret uchun `profile.photoUrl` avtomatik
 * `/api/media/portrait` qo'yiladi — admin panelda «qaerga ishora qilayotgani»
 * ko'rinib turadi.
 */

const KEY_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;

type Ctx = { params: Promise<{ key: string }> };

function bad(message: string, status = 422, fields?: Record<string, string>) {
  return NextResponse.json({ error: message, ...(fields ? { fields } : {}) }, { status });
}

async function rowFor(key: string) {
  return db.select().from(media).where(eq(media.key, key)).get();
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { key } = await ctx.params;
  if (!KEY_RE.test(key)) return bad("Bunday rasm yo'q", 404);

  const row = await rowFor(key);
  if (!row) {
    return new NextResponse(null, { status: 404, headers: { "cache-control": "no-store" } });
  }

  const etag = `"${row.etag}"`;
  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers: { etag, "cache-control": MEDIA_CACHE } });
  }

  const body = decodeMedia(row.data);
  return new NextResponse(Buffer.from(body), {
    headers: {
      "content-type": row.mime,
      "content-length": String(row.bytes),
      "cache-control": MEDIA_CACHE,
      etag,
      // Kadrlash ma'lumoti — admin paneli va tashqi mijozlar uchun foydali
      "x-image-width": String(row.width ?? ""),
      "x-image-height": String(row.height ?? ""),
    },
  });
}

/** Yuklash faqat admin uchun va cheklangan (fayl almashinuvi orqali DB shishmasin). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const { key } = await ctx.params;
  if (!KEY_RE.test(key)) return bad("Noto'g'ri kalit", 400);

  const auth = await requireAdmin(req, { allowMultipart: true });
  if (auth instanceof NextResponse) return auth;

  if (rateLimit(`media:${clientIp(req)}`, 15, 10 * 60_000)) return tooMany(10 * 60);

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("multipart/form-data")) {
    return bad("`multipart/form-data` bilan yuboring", 415);
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const value = form.get("file");
    file = value instanceof File ? value : null;
  } catch {
    return bad("Forma o'qilmadi", 400);
  }
  if (!file) return bad("Fayl tanlanmagan", 422, { file: "Fayl tanlang" });
  if (!file.type.startsWith("image/")) return bad("Faqat rasm fayllari (jpg, png, webp)", 422, { file: "Fayl turi rasm bo'lishi kerak" });
  if (file.size > MAX_INPUT_BYTES) {
    return bad(`Fayl ${Math.round(MAX_INPUT_BYTES / 1024 / 1024)} MB dan oshmasin`, 422, { file: "Fayl juda katta" });
  }

  let img: Awaited<ReturnType<typeof processImage>>;
  try {
    img = await processImage(Buffer.from(await file.arrayBuffer()), key);
  } catch (e) {
    if (e instanceof MediaError) return bad(e.message, 422, { file: e.message });
    throw e;
  }

  const now = new Date();
  const existing = await rowFor(key);
  if (existing) {
    await db
      .update(media)
      .set({
        data: img.data,
        bytes: img.bytes,
        width: img.width,
        height: img.height,
        mime: img.mime,
        etag: img.etag,
        uploadedAt: now,
      })
      .where(eq(media.id, existing.id))
      .run();
  } else {
    await db.insert(media).values({ key, uploadedAt: now, ...img }).run();
  }

  // Portret bo'lsa — sayt uni ko'rishi uchun profil ishorasi yangilanadi.
  let photoPointer = "set";
  const prof = await db.select().from(profile).limit(1).get();
  if (key === "portrait" && prof) {
    await db.update(profile).set({ photoUrl: PORTRAIT_URL, updatedAt: now }).where(eq(profile.id, prof.id)).run();
  } else if (key !== "portrait") {
    photoPointer = "skipped";
  }

  invalidateSiteData();
  revalidatePath("/", "layout");
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    key,
    bytes: img.bytes,
    width: img.width,
    height: img.height,
    url: `/api/media/${key}`,
    replaced: Boolean(existing),
    photoUrl: photoPointer,
  });
}

export const PUT = POST;

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { key } = await ctx.params;
  if (!KEY_RE.test(key)) return bad("Noto'g'ri kalit", 400);

  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const row = await rowFor(key);
  if (!row) return NextResponse.json({ error: "Rasm topilmadi" }, { status: 404 });

  await db.delete(media).where(eq(media.id, row.id)).run();

  if (key === "portrait") {
    const prof = await db.select().from(profile).limit(1).get();
    if (prof) {
      await db
        .update(profile)
        .set({ photoUrl: "", updatedAt: new Date() })
        .where(eq(profile.id, prof.id))
        .run();
    }
  }

  invalidateSiteData();
  revalidatePath("/", "layout");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
