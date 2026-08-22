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
  badge: text("badge").notNull().default("Portfolio sayt"),
  bio: text("bio").notNull().default(""),
  avatarInitials: text("avatar_initials").notNull().default("MX"),
  email: text("email").notNull().default("yourname@example.com"),
  telegram: text("telegram").notNull().default("@yourusername"),
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
  order: integer("order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
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
