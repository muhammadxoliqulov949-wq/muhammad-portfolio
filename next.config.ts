import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @libsql/client tarkibidagi native bog'liqliklar Next.js'ning server
  // bundle'iga qo'shilmasligi kerak — bu Vercel'da (va boshqa Node.js
  // muhitlarida) to'g'ri ishlashi uchun zarur.
  serverExternalPackages: ["@libsql/client"],
  // Live-preview muhitida (e2b.app) dev-server'ga cross-origin so'rovlarga ruxsat.
  allowedDevOrigins: ["*.e2b.app", "*.preview.app.github.dev"],
};

export default nextConfig;
