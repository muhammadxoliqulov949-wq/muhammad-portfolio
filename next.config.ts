import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preview (e2b / Arena) HMR va /_next so'rovlari localhost emas — ruxsat.
  allowedDevOrigins: ["*.e2b.app", "**.e2b.app", "*.arena.ai"],

  // @libsql/client tarkibidagi native bog'liqliklar Next.js'ning server
  // bundle'iga qo'shilmasligi kerak — bu Vercel'da (va boshqa Node.js
  // muhitlarida) to'g'ri ishlashi uchun zarur.
  serverExternalPackages: ["@libsql/client"],

  // Rasm optimallashtirish (audit P1-13): avval `next/image` ishlatilmagan va
  // `<img>` width/height'siz edi → LCP kechikishi va CLS. Admin'ga
  // istalgan HTTPS hosting'dan rasm qo'shish mumkin bo'lishi uchun hostname
  // ochiq; qattiqroq xavfsizlik kerak bo'lsa ro'yxatni toraytiring.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1200, 1600, 1920],
    minimumCacheTTL: 60 * 60 * 24,
  },

  experimental: {
    // Birinchi bo'yoqda CSS'ni inline qilish — FOUC'ni kesadi (1 sahifalik
    // sayt uchun arzon va sezilarli yaxshilanish).
    inlineCss: true,
  },
};

export default nextConfig;
