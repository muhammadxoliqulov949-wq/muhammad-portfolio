import { NextRequest, NextResponse } from "next/server";
import { getSession, type SessionPayload } from "./auth";

/**
 * Xavfsizlik yordamchilari.
 *
 * Sessiya httpOnly cookie'da saqlanganligi uchun (Bearer token emas),
 * state-changing so'rovlar CSRF hujumiga ochiq bo'lishi mumkin — shuning
 * uchun har bir yozish endpointi `Origin`/`Sec-Fetch-Site` ni tekshiradi.
 */

export function isSameOrigin(req: NextRequest): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = req.headers.get("origin");
  if (!origin) return true; // curl/server-side va sans-origin formalar
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/**
 * Admin huquqini tekshiradi. Ruxsat berilmasa javobni qaytaradi — chaqiruvchi
 * `if (deny) return deny;` ko'rinishida ishlatadi.
 */
export function requireAdmin(
  req: NextRequest,
  opts: { /** `multipart/form-data` (rasm yuklash) JSON talabini yengillashtiradi */ allowMultipart?: boolean } = {}
): Promise<NextResponse | SessionPayload | null> {
  return (async () => {
    if (!isSameOrigin(req)) {
      return NextResponse.json({ error: "Manba tekshiruvi muvaffaqiyatsiz" }, { status: 403 });
    }
    // JSON Content-Type faqat tanasi bor so'rovlar uchun talab qilinadi —
    // `fetch(url, { method: "DELETE" })` tanasiz keladi va unda CT bo'lmaydi.
    if (req.method !== "GET" && req.method !== "HEAD") {
      const len = Number(req.headers.get("content-length") ?? "0");
      const ct = req.headers.get("content-type") ?? "";
      const allowed = opts.allowMultipart && ct.includes("multipart/form-data");
      if (len > 0 && !allowed && !ct.includes("application/json")) {
        return NextResponse.json({ error: "Content-Type: application/json bo'lishi kerak" }, { status: 415 });
      }
    }
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
    }
    return session;
  })();
}

/** So'rov IP manzilini (rate limit uchun) ishonchli olish. */
export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Kichik, in-memory sliding-window rate limiter.
 * Bitta instance uchun yetarli; serverless'da instance'lar soni cheklangan
 * bo'lgani uchun amalga oshirish darajasi sifatida foydali.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const list = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  buckets.set(key, list);
  if (buckets.size > 500) {
    // xotira o'sib ketmasligi uchun eski klavlarni tozalash
    for (const [k, v] of buckets) {
      if (!v.length || now - (v[v.length - 1] ?? 0) > windowMs * 2) buckets.delete(k);
    }
  }
  return list.length > limit;
}

export const tooMany = (retryAfterSec = 60) =>
  NextResponse.json(
    { error: `Juda ko'p urinish. ${retryAfterSec} soniyadan so'ng qayta urinib ko'ring.` },
    { status: 429, headers: { "retry-after": String(retryAfterSec) } }
  );
