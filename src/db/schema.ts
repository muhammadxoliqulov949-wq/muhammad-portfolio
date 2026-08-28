import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Admin foydalanuvchi (auth uchun)
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default("Admin"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Profil ma'lumotlari (singleton - faqat 1 qator bo'ladi)
export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull().default("Muhammad"),
  title: text("title").notNull().default("Full-stack dasturchi"),
  role2: text("role2").notNull().default("Veb-saytlar yarataman"),
  role3: text("role3").notNull().default("Admin panellar quraman"),
  badge: text("badge").notNull().default("Portfolio sayt"),
  bio: text("bio").notNull().default(""),
  avatarInitials: text("avatar_initials").notNull().default("MX"),
  photoUrl: text("photo_url").notNull().default(""),
  email: text("email").notNull().default("yourname@example.com"),
  telegram: text("telegram").notNull().default("@yourusername"),
  github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  location: text("location").notNull().default("Toshkent, O'zbekiston"),
  resumeUrl: text("resume_url").notNull().default(""),
  statProjects: text("stat_projects").notNull().default("5+"),
  statExperience: text("stat_experience").notNull().default("2 yil"),
  statAvailability: text("stat_availability").notNull().default("24/7"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Loyihalar
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").default(""),
  github: text("github").default(""),
  image: text("image").default(""),
  tech: text("tech").default(""),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Ko'nikmalar (skill)
export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  level: integer("level").notNull().default(80), // 0-100
  category: text("category").notNull().default("Frontend"),
  order: integer("order").notNull().default(0),
});

// Xizmatlar (service)
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("🚀"),
  order: integer("order").notNull().default(0),
});

// Tajriba (work history)
export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  company: text("company").notNull(),
  period: text("period").notNull().default(""),
  description: text("description").notNull().default(""),
  order: integer("order").notNull().default(0),
});

// Mijoz fikrlari (testimonial)
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  text: text("text").notNull(),
  avatarInitials: text("avatar_initials").notNull().default(""),
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
