import { z } from "zod";

/**
 * API va admin formalar uchun yagona validatsiya manbayi.
 * Avval har bir route o'z sxemasiga ega edi — natijada admin formasi va
 * API bir-biridan farq qiladigan maydonlar paydo bo'lardi. Endi bitta manba.
 */

/** Faqat xavfsiz protokollar (XSS/`javascript:` havolalarini kesadi). */
export const safeUrl = (max = 1000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => v ?? "")
    .refine((v) => v === "" || /^(https?:|mailto:|tel:|\/)/i.test(v), {
      message: "Faqat https://, mailto:, tel: yoki /.. bilan boshlanadi",
    });

const str = (max: number, required = false) => {
  const base = z.string().trim().max(max);
  // Ixtiyoriy maydonlar kelmasa — bo'sh qator. Admin formasi maydonni
  // yubormasa ham API 422 qaytarmasligi kerak (DB ustuni NOT NULL, default '').
  return required ? base.min(1, "Bu maydon bo'sh bo'lmasin") : base.default("");
};

/** "a, b, c" ko'rinishidagi ro'yxatni massivga aylantiradi. */
export const toList = (value: string): string[] =>
  value
    .split(/[,\n|]/)
    .map((s) => s.trim())
    .filter(Boolean);

export const profileSchema = z.object({
  fullName: str(80, true),
  title: str(120, true),
  role2: str(120),
  role3: str(120),
  badge: str(60),
  bio: str(1200, true),
  avatarInitials: z.string().trim().max(4).default(""),
  photoUrl: safeUrl(1000),
  email: str(200, true).refine((v) => z.email().safeParse(v).success, {
    message: "To'g'ri email kiriting",
  }),
  telegram: str(80),
  github: str(120),
  linkedin: str(120),
  instagram: str(120),
  location: str(120),
  resumeUrl: safeUrl(1000),
  phone: z.string().trim().max(40).default(""),
  englishLevel: str(40),
  story: str(3000),
  strengths: str(1200),
  interests: str(600),
  principleWork: str(400),
  principleDelivery: str(400),
  workflow: str(1200),
  goals: str(2000),
  responseTime: str(60),
  sinceYear: z.string().trim().max(9).default(""),
  statProjects: str(40),
  statExperience: str(40),
  statAvailability: str(40),
});

export const projectSchema = z.object({
  title: str(160, true),
  description: str(600, true),
  link: safeUrl(500),
  github: safeUrl(500),
  image: safeUrl(1000),
  tech: str(400),
  year: z.string().trim().max(9).default(""),
  role: str(120),
  impact: str(200),
  problem: str(2000),
  approach: str(2000),
  outcome: str(2000),
  gallery: str(4000),
  status: str(80),
  features: str(2000),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).max(999).default(0),
  published: z.boolean().default(true),
});

export const skillSchema = z.object({
  name: str(60, true),
  years: z.number().int().min(0).max(60).default(0),
  context: str(160),
  category: str(40),
  order: z.number().int().min(0).max(999).default(0),
});

export const serviceSchema = z.object({
  title: str(80, true),
  description: str(600, true),
  icon: z.string().trim().max(40).default("sparkle"),
  priceFrom: str(60),
  delivery: str(60),
  features: str(600),
  order: z.number().int().min(0).max(999).default(0),
});

export const experienceSchema = z.object({
  role: str(120, true),
  company: str(120, true),
  period: str(80),
  description: str(1200),
  highlights: str(1200),
  current: z.boolean().default(false),
  order: z.number().int().min(0).max(999).default(0),
});

export const testimonialSchema = z.object({
  name: str(80, true),
  role: str(120),
  text: str(1200, true),
  avatarInitials: z.string().trim().max(4).default(""),
  rating: z.number().int().min(0).max(5).default(5),
  sourceUrl: safeUrl(500),
  order: z.number().int().min(0).max(999).default(0),
});

export const contactSchema = z.object({
  name: str(120, true),
  email: z.email().max(200),
  message: str(4000, true).refine((v) => v.length >= 12, {
    message: "Xabar kamida 12 belgi bo'lsin",
  }),
  /**
   * Honeypot: botlar to'ldiradigan yashirin maydon. Odatda `max(0)` qilib
   * qo'yishadi, lekin biz buni ataylab qabul qilamiz va javobda muvaffaqiyat
   * ko'rsatamiz — bot "ishladi" deb o'ylab spamni davom ettirmasligi uchun.
   */
  website: z.string().max(500).optional(),
});

export const educationSchema = z.object({
  institution: str(160, true),
  credential: str(120),
  field: str(160),
  period: str(60),
  status: str(80),
  features: str(2000),
  detail: str(1200),
  current: z.boolean().default(false),
  order: z.number().int().min(0).max(999).default(0),
});

export const achievementSchema = z.object({
  title: str(200, true),
  issuer: str(120),
  kind: z.enum(["cert", "academic", "sport"]).default("cert"),
  year: z.string().trim().max(9).default(""),
  detail: str(600),
  url: safeUrl(500),
  order: z.number().int().min(0).max(999).default(0),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type AchievementInput = z.infer<typeof achievementSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;

/** Zod xatolarini forma ko'rinishidagi { maydon: xabar } xaritasiga. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
