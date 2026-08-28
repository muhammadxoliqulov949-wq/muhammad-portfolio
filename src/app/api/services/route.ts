import { createCollectionRoutes } from "@/lib/crud";
import { services } from "@/db/schema";
import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(1000),
  icon: z.string().max(20).default("🚀"),
  order: z.number().int().default(0),
});

export const { GET, POST } = createCollectionRoutes(services, serviceSchema, services.order);
