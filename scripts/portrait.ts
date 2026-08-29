import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import sharp from "sharp";

/**
 * Portret rasmini saytdagi joyiga qo'yish — bitta buyruq:
 *
 *   npm run portrait -- ./rasm.jpg
 *   npm run portrait -- https://site.com/rasm.jpg
 *   npm run portrait -- ./rasm.jpg --no-db --width 1200 --quality 90
 *
 * Nima qiladi:
 *  1) `.env` dan muhim kalitlarni o'qiydi (tsx .env'ni o'zi yuklamaydi);
 *  2) EXIF orientatsiyani to'g'irlaydi, 4:5 (standart 1100×1375) qilib
 *     "cover" bilan kesadi — kadrlash markazi yuzga yaqin bo'lishi uchun
 *     `position: attention` (yuz yuqoriroqda bo'lsa `--position north`);
 *  3) progressive JPEG (~200–400 KB) qilib `public/media/portrait.jpg`ga yozadi;
 *  4) `profile.photoUrl`ni `/media/portrait.jpg`ga qo'yadi (`--no-db` bilan
 *     o'tkazib yuboriladi) — admin panelda ham ko'rinib turishi uchun.
 *
 * Hech qanday rasm ixtir qilinmaydi: fayl bo'lmasa yoki o'qilmasa — xato.
 */

const OUT = join("public", "media", "portrait.jpg");
const KEYS = ["DATABASE_PATH", "TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"] as const;

/** tsx `.env`'ni yuklamaydi — lokal DB manzili noto'g'ri bo'lmasligi uchun. */
function loadEnv() {
  try {
    const raw = readFileSync(resolve(".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      if (!KEYS.includes(key as (typeof KEYS)[number]) || process.env[key]) continue;
      process.env[key] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* .env yo'q — muhit o'zgaruvchilari bo'sh qoladi */
  }
}

type Args = {
  src: string;
  width: number;
  height: number;
  quality: number;
  position: "attention" | "entropy" | "north" | "centre";
  out: string;
  setDb: boolean;
};

function parseArgs(argv: string[]): Args {
  const get = (name: string) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const src = argv.find((a) => !a.startsWith("--"));
  if (!src) {
    console.error(
      'Ishlatish: npm run portrait -- <fayl yoki https://URL> [--width 1100] [--quality 86] [--position north] [--no-db]'
    );
    process.exit(1);
  }
  const width = Math.max(400, Number(get("width")) || 1100);
  const position = (get("position") ?? "attention") as Args["position"];
  const height = Number(get("height")) || Math.round(width * 1.25);
  return {
    src,
    width,
    height,
    quality: Math.min(96, Math.max(60, Number(get("quality")) || 86)),
    position: ["attention", "entropy", "north", "centre"].includes(position) ? position : "attention",
    out: get("out") ?? OUT,
    setDb: !argv.includes("--no-db"),
  };
}

async function readSource(src: string): Promise<Buffer> {
  if (/^https?:\/\//i.test(src)) {
    const res = await fetch(src, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`yuklab bo'lmadi: HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!/^image\//i.test(type)) throw new Error(`bu rasm emas (content-type: ${type || "noma'lum"})`);
    return Buffer.from(await res.arrayBuffer());
  }
  const abs = resolve(src);
  const st = statSync(abs);
  if (!st.isFile()) throw new Error("bu fayl emas");
  if (st.size > 25 * 1024 * 1024) throw new Error("fayl 25 MB dan katta");
  return readFileSync(abs);
}

async function main() {
  loadEnv();
  const a = parseArgs(process.argv.slice(2));

  let buf: Buffer;
  try {
    buf = await readSource(a.src);
  } catch (e) {
    console.error(`✗ Rasm o'qilmadi: ${(e as Error).message}`);
    process.exit(1);
  }

  const meta = await sharp(buf, { failOn: "error" }).metadata();
  if (!meta.width || !meta.height) throw new Error("rasm o'lchami aniqlanmadi (buzilgan fayl?)");
  if (meta.format === "svg") throw new Error("SVG qo'llab-quvvatlanmaydi — jpg/png/webp kiriting");

  const out = await sharp(buf, { failOn: "error" })
    .rotate() // EXIF orientatsiyasi bo'yicha aylantirish
    .resize({ width: a.width, height: a.height, fit: "cover", position: a.position })
    .jpeg({ quality: a.quality, mozjpeg: true, progressive: true })
    .toBuffer();

  mkdirSync(dirname(a.out), { recursive: true });
  writeFileSync(a.out, out);

  const after = await sharp(out).metadata();
  console.log(
    `✓ ${basename(a.src)} (${meta.format}, ${meta.width}×${meta.height}, ${(buf.length / 1024).toFixed(0)} KB) → ` +
      `${a.out} (${after.width}×${after.height}, ${(out.length / 1024).toFixed(0)} KB, q=${a.quality}, crop=${a.position})`
  );

  if (!a.setDb) {
    console.log("ℹ️  DB yangilanmadi (--no-db). Sayt faylni baribir ko'radi: public/media/portrait.jpg");
    return;
  }

  try {
    const { db } = await import("../src/db/index");
    const { profile } = await import("../src/db/schema");
    const { eq } = await import("drizzle-orm");
    const rel = `/media/${basename(a.out)}`;
    const row = await db.select({ id: profile.id }).from(profile).limit(1).get();
    if (!row) {
      console.log("ℹ️  Profilda yozuv yo'q — `npm run db:seed` dan keyin qayta urining.");
      return;
    }
    await db.update(profile).set({ photoUrl: rel, updatedAt: new Date() }).where(eq(profile.id, row.id)).run();
    console.log(`✓ profile.photoUrl → ${rel} (admin → Profil da ham ko'rinadi)`);
  } catch (e) {
    console.log(`⚠️  DB yangilanmadi (${(e as Error).message.split("\n")[0]}). Rasm fayli yozilgan — sayt uni avtomatik oladi.`);
  }

  console.log("Saytni ko'rish: brauzerda Ctrl/Cmd+Shift+R (ISR 1 soatlik cache).");
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
