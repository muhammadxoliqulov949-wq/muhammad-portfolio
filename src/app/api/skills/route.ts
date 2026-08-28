import { createCollectionRoutes } from "@/lib/crud";
import { skills } from "@/db/schema";
import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1).max(80),
  level: z.number().int().min(0).max(100).default(80),
  category: z.string().min(1).max(60).default("Frontend"),
  order: z.number().int().default(0),
});

export const { GET, POST } = createCollectionRoutes(skills, skillSchema, skills.order);
