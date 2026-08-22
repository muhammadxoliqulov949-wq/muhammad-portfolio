import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await db.select().from(schema.admins).all();
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db
      .insert(schema.admins)
      .values({
        email: adminEmail,
        passwordHash,
        name: "Admin",
        createdAt: new Date(),
      })
      .run();
    console.log(`✅ Admin yaratildi: ${adminEmail} / ${adminPassword}`);
    console.log("⚠️  Iltimos, birinchi kirishdan so'ng parolni almashtiring (yoki .env dagi ADMIN_PASSWORD ni o'zgartiring).");
  } else {
    console.log("ℹ️  Admin allaqachon mavjud, o'tkazib yuborildi.");
  }

  const existingProfile = await db.select().from(schema.profile).all();
  if (existingProfile.length === 0) {
    await db
      .insert(schema.profile)
      .values({
        fullName: "Muhammad",
        title: "Full-stack dasturchi",
        badge: "Portfolio sayt",
        bio: "Bu mening portfolio saytim. Bu yerda men o'zim haqimda, qilgan ishlarim va bog'lanish uchun ma'lumotlarimni joylayman.",
        avatarInitials: "MX",
        email: "yourname@example.com",
        telegram: "@yourusername",
        statProjects: "5+",
        statExperience: "2 yil",
        statAvailability: "24/7",
        updatedAt: new Date(),
      })
      .run();
    console.log("✅ Boshlang'ich profil yaratildi.");
  } else {
    console.log("ℹ️  Profil allaqachon mavjud, o'tkazib yuborildi.");
  }

  const existingProjects = await db.select().from(schema.projects).all();
  if (existingProjects.length === 0) {
    await db
      .insert(schema.projects)
      .values([
        {
          title: "Sayt 1",
          description: "Shaxsiy portfolio yoki CV sahifa.",
          link: "",
          order: 0,
          published: true,
          createdAt: new Date(),
        },
        {
          title: "Sayt 2",
          description: "Biznes yoki xizmatlar uchun landing page.",
          link: "",
          order: 1,
          published: true,
          createdAt: new Date(),
        },
        {
          title: "Sayt 3",
          description: "Blog yoki kichik mahsulot sahifasi.",
          link: "",
          order: 2,
          published: true,
          createdAt: new Date(),
        },
      ])
      .run();
    console.log("✅ Boshlang'ich loyihalar yaratildi.");
  } else {
    console.log("ℹ️  Loyihalar allaqachon mavjud, o'tkazib yuborildi.");
  }
}

seed()
  .then(() => {
    console.log("🎉 Seed jarayoni tugadi.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed xatosi:", err);
    process.exit(1);
  });
