import { NextRequest } from "next/server";
import { collections } from "@/lib/collections";

const routes = collections.achievements;

type Ctx = { params: Promise<{ id: string }> };

export const PUT = (req: NextRequest, ctx: Ctx) => routes.PUT_ID(req, ctx.params);
export const PATCH = (req: NextRequest, ctx: Ctx) => routes.PATCH_ID(req, ctx.params);
export const DELETE = (req: NextRequest, ctx: Ctx) => routes.DELETE_ID(req, ctx.params);
