import { createCollectionRoutes } from "@/lib/crud";
import { testimonials } from "@/db/schema";
import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().max(120).default(""),
  text: z.string().min(1).max(2000),
  avatarInitials: z.string().max(6).default(""),
  order: z.number().int().default(0),
});

export const { GET, POST } = createCollectionRoutes(testimonials, testimonialSchema, testimonials.order);
