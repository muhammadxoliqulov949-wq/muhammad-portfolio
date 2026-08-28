import { createCollectionRoutes, type CollectionConfig } from "./crud";
import { experience, projects, services, skills, testimonials } from "@/db/schema";
import { experienceSchema, projectSchema, serviceSchema, skillSchema, testimonialSchema } from "./schemas";

/**
 * Barcha ochiq/koleksiya API'lari shu yerda konfiguratsiyalanadi.
 * Route fayllari faqat qayta eksport qiladi — bir xatti-harakat, bir joyda.
 */

const HOME = ["/", "/projects"];

const configs = {
  skills: {
    label: "Ko'nikmalar",
    table: skills,
    schema: skillSchema,
    orderColumn: skills.order,
    revalidatePaths: HOME,
  },
  services: {
    label: "Xizmatlar",
    table: services,
    schema: serviceSchema,
    orderColumn: services.order,
    revalidatePaths: HOME,
  },
  experience: {
    label: "Tajriba",
    table: experience,
    schema: experienceSchema,
    orderColumn: experience.order,
    revalidatePaths: HOME,
  },
  testimonials: {
    label: "Mijozlar fikri",
    table: testimonials,
    schema: testimonialSchema,
    orderColumn: testimonials.order,
    revalidatePaths: HOME,
  },
  projects: {
    label: "Loyihalar",
    table: projects,
    schema: projectSchema,
    orderColumn: projects.order,
    // Ochiq ro'yxatda faqat chop etilganlar; admin ?all=1 bilan hammasini oladi
    publicFilter: projects.published,
    revalidatePaths: ["/", "/projects", "/projects/[id]"],
  },
} satisfies Record<string, CollectionConfig>;

export const collections = {
  skills: createCollectionRoutes(configs.skills),
  services: createCollectionRoutes(configs.services),
  experience: createCollectionRoutes(configs.experience),
  testimonials: createCollectionRoutes(configs.testimonials),
  projects: createCollectionRoutes(configs.projects),
} as const;
