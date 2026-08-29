import { createHash } from "node:crypto";
import sharp, { type Metadata } from "sharp";

/**
 * Sayt rasmlari (portret) — saqlash va qayta ishlash mantig'i.
 *
 * Nega DB'da, fayl emas? Production Vercel'da fayl tizimi read-only, shuning
 * uchun «admin paneldan yuklangan rasm`public/media`ga yozilsa» ishlamasdi.
 * Base64 ko'rinishidagi JPEG (1100×1375, ~60–120 KB) SQLite/Turso'da erkin
 * yashaydi va sayt uni `/api/media/portrait` orqali oladi.
 */

export const PORTRAIT_KEY = "portrait";
/** `profile.photoUrl`ga yoziladigan manzil — saytdagi barcha portretlar shu yerdan. */
export const PORTRAIT_URL = `/api/media/${PORTRAIT_KEY}`;

/** Kirish hajmi chegarasi (bazada saqlanadigan nusxa ancha kichik bo'ladi). */
export const MAX_INPUT_BYTES = 8 * 1024 * 1024;

type Preset = { width: number; height: number; fit: "cover" | "inside"; position?: "attention" | "centre" };

const PRESETS: Record<string, Preset> = {
  // Portret: 4:5 freym, yuzni saqlab kesish
  portrait: { width: 1100, height: 1375, fit: "cover", position: "attention" },
  default: { width: 1400, height: 1400, fit: "inside" },
};

export class MediaError extends Error {}

export type ProcessedImage = {
  data: string;
  bytes: number;
  width: number;
  height: number;
  mime: string;
  etag: string;
};

/**
 * Xom rasm → saytiga mos nusxa. Noma'lum format/buzilgan fayl → MediaError
 * (admin formasi xabarni ko'rsatadi, server 500 bermaydi).
 */
export async function processImage(buf: Buffer, key: string): Promise<ProcessedImage> {
  if (buf.length > MAX_INPUT_BYTES) {
    throw new MediaError(`Rasm juda katta — ${Math.round(MAX_INPUT_BYTES / 1024 / 1024)} MB gacha qabul qilinadi`);
  }

  let meta: Metadata;
  try {
    meta = await sharp(buf, { failOn: "error" }).metadata();
  } catch {
    throw new MediaError("Fayl rasm sifatida o'qilmadi (jpg/png/webp kiriting)");
  }
  if (!meta.width || !meta.height) throw new MediaError("Rasm o'lchami aniqlanmadi");
  if (meta.format === "svg") throw new MediaError("SVG qabul qilinmaydi — jpg yoki png yetarli");
  if (meta.format === "tiff" || meta.format === "heif") {
    throw new MediaError(`${meta.format.toUpperCase()} faylni avval jpg/png'ga o'giring`);
  }

  const preset = PRESETS[key] ?? PRESETS.default;
  let out: Buffer;
  try {
    out = await sharp(buf, { failOn: "error" })
      .rotate() // EXIF orientatsiyasi — telefon rasmlari shu sababli teskari chiqadi
      .resize({
        width: preset.width,
        height: preset.height,
        fit: preset.fit,
        ...(preset.position ? { position: preset.position } : {}),
      })
      .jpeg({ quality: 86, mozjpeg: true, progressive: true })
      .toBuffer();
  } catch (e) {
    throw new MediaError(`Qayta ishlab bo'lmadi: ${(e as Error).message}`);
  }

  const after = await sharp(out).metadata();
  return {
    data: out.toString("base64"),
    bytes: out.length,
    width: after.width ?? preset.width,
    height: after.height ?? preset.height,
    mime: "image/jpeg",
    etag: createHash("sha1").update(out).digest("base64url").slice(0, 16),
  };
}

export function decodeMedia(data: string): Uint8Array {
  return new Uint8Array(Buffer.from(data, "base64"));
}

/** Brauzer/CDN uchun qisqa muddatli cache: almashtirilsa ~1 daqiqada ko'rinadi. */
export const MEDIA_CACHE = "public, max-age=60, stale-while-revalidate=600";
