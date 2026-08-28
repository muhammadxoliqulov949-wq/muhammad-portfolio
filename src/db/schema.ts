import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Ma'lumotlar sxemasi.
 *
 * Auditdan keyingi qo'shimchalar:
 *  - profile: responseTime, sinceYear (halol "meta" qatori uchun)
 *  - projects: case study maydonlari (year, role, impact, problem, approach,
 *    outcome, gallery) — "bir qatorli tavsif" muammosini yechadi
 *  - skills: % bar o'rniga tajriba yili + kontekst (evidence-based)
 *  - services: narx/oraliq va muddat (konversiya uchun raqam)
 *  - testimonials: haqiqiy rating + manba havolasi
 *  - experience: `current` va `highlights`
 */

// Admin foydalanuvchi (auth uchun)
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default("Admin"),
  /**
   * Shu vaqtdan (epoch ms) oldin imzolangan barcha JWT'lar yaroqsiz — logout va
   * parolni almashtirish shu ustunni yangilaydi. Stateless tokenlarni bekor
   * qilishning yagona ishonchli yo'li. Sekund emas, **millisekund** saqlanadi:
   * `iat` sekund aniqligida chiqib-kirish bir sekunda to'g'ri kelsa, token
   * adolat bilan yaroqsiz bo'lmay qolardi.
   */
  sessionsRevokedAt: integer("sessions_revoked_at"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Profil (singleton — faqat 1 qator)
export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull().default("Muhammad"),
  title: text("title").notNull().default("Full-stack dasturchi"),
  role2: text("role2").notNull().default(""),
  role3: text("role3").notNull().default(""),
  badge: text("badge").notNull().default(""),
  bio: text("bio").notNull().default(""),
  avatarInitials: text("avatar_initials").notNull().default("MX"),
  photoUrl: text("photo_url").notNull().default(""),
  email: text("email").notNull().default(""),
  telegram: text("telegram").notNull().default(""),
  github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  location: text("location").notNull().default(""),
  resumeUrl: text("resume_url").notNull().default(""),
  responseTime: text("response_time").notNull().default(""),
  sinceYear: text("since_year").notNull().default(""),
  statProjects: text("stat_projects").notNull().default(""),
  statExperience: text("stat_experience").notNull().default(""),
  statAvailability: text("stat_availability").notNull().default(""),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Loyihalar (case study formatida)
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").default(""),
  github: text("github").default(""),
  image: text("image").default(""),
  tech: text("tech").default(""),
  year: text("year").notNull().default(""),
  role: text("role").notNull().default(""),
  impact: text("impact").notNull().default(""),
  problem: text("problem").notNull().default(""),
  approach: text("approach").notNull().default(""),
  outcome: text("outcome").notNull().default(""),
  gallery: text("gallery").notNull().default(""),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Ko'nikmalar — % bar yo'q: yil + qayerda qo'llanganligi ko'rsatiladi
export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  level: integer("level").notNull().default(0),
  years: integer("years").notNull().default(0),
  context: text("context").notNull().default(""),
  category: text("category").notNull().default("Frontend"),
  order: integer("order").notNull().default(0),
});

// Xizmatlar — narx oraliq va muddat bilan
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("sparkles"),
  priceFrom: text("price_from").notNull().default(""),
  delivery: text("delivery").notNull().default(""),
  features: text("features").notNull().default(""),
  order: integer("order").notNull().default(0),
});

// Ish tajribasi
export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  company: text("company").notNull(),
  period: text("period").notNull().default(""),
  description: text("description").notNull().default(""),
  highlights: text("highlights").notNull().default(""),
  current: integer("current", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
});

// Mijoz fikrlari
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  text: text("text").notNull(),
  avatarInitials: text("avatar_initials").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  sourceUrl: text("source_url").notNull().default(""),
  order: integer("order").notNull().default(0),
});

// Aloqa formasi orqali kelgan xabarlar
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
