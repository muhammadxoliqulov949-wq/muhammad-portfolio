import { existsSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { db } from "@/db";
import { achievements, education, experience, profile, projects, services, skills, testimonials } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

/**
 * Sayt ma'lumotlarini yuklash — bitta manba.
 *
 * Audit tuzatishlari:
 *  - 6 ta so'rov ketma-ket emas, PARALLELL (Promise.all) → serverless'da
 *    6× RTT o'rniga 1× RTT;
 *  - so'rovlar `unstable_cache`ga o'xshab qayta ishlanadi: sahifa
 *    `revalidate` bilan cachedan o'qiladi (mutatsiyada revalidatePath);
 *  - fallback'lar endi soxta ma'lumot ("yourname@example.com") EMAS — bo'sh
 *    qiymat "bu maydon to'ldirilmagan" degani va UI uni ko'rsatmaydi.
 */

export type Profile = typeof profile.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Service = typeof services.$inferSelect;
export type ExperienceItem = typeof experience.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type EducationItem = typeof education.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;

export const EMPTY_PROFILE: Profile = {
  id: 0,
  fullName: "",
  title: "",
  role2: "",
  role3: "",
  badge: "",
  bio: "",
  avatarInitials: "",
  photoUrl: "",
  email: "",
  telegram: "",
  github: "",
  linkedin: "",
  instagram: "",
  location: "",
  resumeUrl: "",
  responseTime: "",
  sinceYear: "",
  phone: "",
  englishLevel: "",
  story: "",
  strengths: "",
  interests: "",
  principleWork: "",
  principleDelivery: "",
  workflow: "",
  goals: "",
  statProjects: "",
  statExperience: "",
  statAvailability: "",
  updatedAt: new Date(0),
};

export type SiteData = {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  services: Service[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  education: EducationItem[];
  achievements: Achievement[];
};

/**
 * Barcha ochiq kontentni bitta parallell so'rov to'plamida oladi.
 * `cache()` — bir HTTP so'rovi ichida layout va sahifa bir marta o'qiydi.
 */
export const getSiteData = cache(async function getSiteData(): Promise<SiteData> {
  const [p, projectList, skillList, serviceList, experienceList, testimonialList, educationList, achievementList] =
    await Promise.all([
    db.select().from(profile).get(),
    db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(desc(projects.featured), asc(projects.order))
      .all(),
    db.select().from(skills).orderBy(asc(skills.order)).all(),
    db.select().from(services).orderBy(asc(services.order)).all(),
    db.select().from(experience).orderBy(asc(experience.order)).all(),
    db.select().from(testimonials).orderBy(asc(testimonials.order)).all(),
    db.select().from(education).orderBy(asc(education.order)).all(),
    db.select().from(achievements).orderBy(asc(achievements.order)).all(),
  ]);

  return {
    profile: p ?? EMPTY_PROFILE,
    projects: projectList,
    skills: skillList,
    services: serviceList,
    experience: experienceList,
    testimonials: testimonialList,
    education: educationList,
    achievements: achievementList,
  };
});

/**
 * Bitta loyihani o'qish. `cache()` — Request memoization: bitta so'rovda
 * `generateMetadata` va sahifaning o'zi bir xil id bilan ikki marta so'rasa,
 * DB'ga bitta so'rov ketadi.
 */
export const getProjectById = cache((id: number): Promise<Project | undefined> =>
  db.select().from(projects).where(eq(projects.id, id)).get()
);

export function getPublishedProjectIds(): Promise<{ id: number }[]> {
  return db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.order))
    .all();
}

/* ------------------------------------------------------------------ *
 * Derived / view-model yordamchilari
 * ------------------------------------------------------------------ */

/** Xavfsiz tashqi havola: `javascript:` va noma'lum sxemalarni qaytarmaydi. */
export function safeHref(value?: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  return null;
}

/** "@user" / "https://t.me/user" / bo'sh → href yoki null. */
export function telegramHref(telegram?: string | null): string | null {
  if (!telegram) return null;
  const t = telegram.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return safeHref(t);
  if (t.startsWith("@")) return `https://t.me/${t.slice(1)}`;
  return `https://t.me/${t}`;
}

/**
 * Portret rasmi. Ikki manba:
 *  1) admin → Profil → «Portret URL» (`/media/portrait.jpg` yoki https://…);
 *  2) `public/media/portrait.*` fayli — DB bo'sh bo'lsa ham avtomatik olinadi,
 *     ya'ni rasmni papkaga tashlab qo'yish kifoya (deploy qilingan versiyada
 *     ham fayl repo' bilan birga keladi).
 * Ikkalasi bo'lmasa `null` — komponent monogram freymini ko'rsatadi.
 */
const PORTRAIT_FILES = ["portrait.jpg", "portrait.jpeg", "portrait.png", "portrait.webp", "portrait.avif"];

export function portraitOf(p?: Partial<Profile> | null): string | null {
  const explicit = safeHref(p?.photoUrl);
  if (explicit) return explicit;
  for (const name of PORTRAIT_FILES) {
    try {
      if (existsSync(join(process.cwd(), "public", "media", name))) return `/media/${name}`;
    } catch {
      /* read-only yoki edge muhitida fs bo'lmasligi mumkin — monogram qoladi */
      break;
    }
  }
  return null;
}

/** Hero'dagi kasb satri — DB'dan (admin tahrirlay oladi, P0-1 tuzatildi). */
export function rolesOf(p: Profile): string[] {
  return [p.title, p.role2, p.role3].map((s) => (s ?? "").trim()).filter(Boolean);
}

export type Social = {
  key: "github" | "linkedin" | "instagram" | "telegram" | "email" | "phone";
  label: string;
  href: string;
};

export function socialsOf(p: Profile): Social[] {
  const items: Array<Social | null> = [
    p.github && safeHref(p.github) ? { key: "github", label: "GitHub", href: safeHref(p.github) as string } : null,
    p.linkedin && safeHref(p.linkedin)
      ? { key: "linkedin", label: "LinkedIn", href: safeHref(p.linkedin) as string }
      : null,
    p.instagram && safeHref(p.instagram)
      ? { key: "instagram", label: "Instagram", href: safeHref(p.instagram) as string }
      : null,
    telegramHref(p.telegram) ? { key: "telegram", label: "Telegram", href: telegramHref(p.telegram) as string } : null,
    p.email ? { key: "email", label: "Email", href: `mailto:${p.email}` } : null,
    phoneHref(p.phone) ? { key: "phone", label: "Telefon", href: phoneHref(p.phone) as string } : null,
  ];
  return items.filter((x): x is Social => x !== null);
}

/** "Frontend: React(4y)..." guruhlangan texnologiya to'plami. */
export function skillsByCategory(list: Skill[]): { category: string; items: Skill[] }[] {
  const map = new Map<string, Skill[]>();
  for (const s of list) {
    const key = s.category || "Boshqa";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return Array.from(map, ([category, items]) => ({ category, items }));
}

/** CSV/vergul ro'yxatini toza massivga. */
export const listFrom = (value?: string | null): string[] => toListSafe(value);

export const galleryOf = (value?: string | null): string[] =>
  toListSafe(value)
    .map((u) => safeHref(u))
    .filter((u): u is string => !!u);

export const techOf = (value?: string | null): string[] => toListSafe(value);

function toListSafe(value?: string | null): string[] {
  const raw = (value ?? "").trim();
  if (!raw) return [];
  // `|` yoki yangi qator bo'lsa — vergul raqam ichida (`$5,000`) va gap ichida qoladi.
  const parts = /[|\n]/.test(raw) ? raw.split(/[\n|]/) : raw.split(",");
  return parts.map((s) => s.trim()).filter(Boolean);
}

export const featuresOf = (value?: string | null): string[] => toListSafe(value);
export const strengthsOf = (p: Profile): string[] => toListSafe(p.strengths);
export const interestsOf = (p: Profile): string[] => toListSafe(p.interests);
export const workflowOf = (p: Profile): string[] => toListSafe(p.workflow);
export const goalsOf = (p: Profile): string[] => toListSafe(p.goals);

export const principlesOf = (p: Profile): string[] =>
  [p.principleWork, p.principleDelivery].map((x) => (x ?? "").trim()).filter(Boolean);

/** Telefon `tel:` havolasiga: boshidagi bo'sh joy/defislar olib tashlanadi. */
export function phoneHref(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^+0-9]/g, "");
  return digits.length >= 8 ? `tel:${digits}` : null;
}

export const ACHIEVEMENT_KINDS: Record<string, { label: string; icon: "target" | "sparkle" | "zap" }> = {
  cert: { label: "Sertifikatlar", icon: "target" },
  academic: { label: "Akademik", icon: "sparkle" },
  sport: { label: "Sport", icon: "zap" },
};

/** Yutuqlarni `kind` bo'yicha guruhlaydi (bo'sh guruh chiqmaydi). */
export function achievementsByKind(list: Achievement[]) {
  const order = ["cert", "academic", "sport"];
  const groups: { kind: string; label: string; items: Achievement[] }[] = [];
  for (const kind of order) {
    const items = list.filter((a) => (a.kind || "cert") === kind);
    if (items.length > 0) groups.push({ kind, label: ACHIEVEMENT_KINDS[kind]?.label ?? kind, items });
  }
  const rest = list.filter((a) => !order.includes(a.kind || "cert"));
  if (rest.length > 0) groups.push({ kind: "other", label: "Boshqa", items: rest });
  return groups;
}
export const highlightsOf = (value?: string | null): string[] => toListSafe(value);

/** Ichki bo'lim havolasi — `/projects` kabi sahifadan ham bosh sahifaga olib boradi. */
export function sectionHref(id: string): string {
  return `/#${id}`;
}

/** Sahifa uchun navigatsiya (bo'lim mavjud bo'lsagina ko'rsatiladi). */
export function sectionsOf(data: SiteData) {
  const hasApproach = Boolean(data.profile.workflow?.trim() || data.profile.goals?.trim());
  return [
    { id: "home", label: "Bosh sahifa" },
    { id: "about", label: "Kimman" },
    { id: "skills", label: "Ko'nikmalar", has: data.skills.length > 0 },
    { id: "experience", label: "Tajriba", has: data.experience.length > 0 },
    { id: "work", label: "Loyihalar", has: data.projects.length > 0 },
    { id: "services", label: "Xizmatlar", has: data.services.length > 0 },
    { id: "education", label: "Ta'lim", has: data.education.length > 0 },
    { id: "achievements", label: "Yutuqlar", has: data.achievements.length > 0 },
    { id: "approach", label: "Odamlar bilan", has: hasApproach || data.experience.length > 0 },
    { id: "contact", label: "Aloqa", has: true },
  ].filter((s) => s.has !== false);
}
