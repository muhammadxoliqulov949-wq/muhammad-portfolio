import { NextRequest, NextResponse } from "next/server";
import { seed } from "@/db/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "72533dc414a5b3d4641ca7e877f8da20a25648c2e1da0af9";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== TOKEN) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const hasTursoUrl = Boolean(process.env.TURSO_DATABASE_URL);
  const hasTursoToken = Boolean(process.env.TURSO_AUTH_TOKEN);
  if (!hasTursoUrl || !hasTursoToken) {
    return NextResponse.json(
      { ok: false, error: "TURSO_DATABASE_URL yoki TURSO_AUTH_TOKEN Vercel env'da yo'q", hasTursoUrl, hasTursoToken },
      { status: 500 }
    );
  }

  await seed(true);
  return NextResponse.json({ ok: true, seeded: true, force: true, hasTursoUrl, hasTursoToken }, { headers: { "cache-control": "no-store" } });
}
