import { NextRequest } from "next/server";
import { collections } from "@/lib/collections";

const routes = collections.services;

/** POST /api/services/reorder — {{ ids: [3,1,2] }} — admin jadvalidagi ↑/↓ tugmalari. */
export const POST = (req: NextRequest) => routes.POST_Reorder(req);
