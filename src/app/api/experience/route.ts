import { createCollectionRoutes } from "@/lib/crud";
import { experience } from "@/db/schema";
import { z } from "zod";

export const experienceSchema = z.object({
  role: z.string().min(1).max(120),
  company: z.string().min(1).max(120),
  period: z.string().max(80).default(""),
  description: z.string().max(2000).default(""),
  order: z.number().int().default(0),
});

export const { GET, POST } = createCollectionRoutes(experience, experienceSchema, experience.order);
