import { NextRequest } from "next/server";
import { collections } from "@/lib/collections";

const routes = collections.projects;

/** GET /api/projects — ochiq ro'yxat; ?all=1 (admin sessiyasi bilan) — hammasi. */
export const GET = (req: NextRequest) => routes.GET(req);

/** POST /api/projects — yangi yozuv (faqat admin, Origin tekshiruvi bilan). */
export const POST = (req: NextRequest) => routes.POST(req);
