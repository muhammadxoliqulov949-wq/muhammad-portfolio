import { NextRequest } from "next/server";
import { collections } from "@/lib/collections";

const routes = collections.achievements;

/** POST /api/achievements/reorder — { ids: [3,1,2] } — admin jadvalidagi ↑/↓ tugmalari. */
export const POST = (req: NextRequest) => routes.POST_Reorder(req);
