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
        role2: "Veb-saytlar yarataman",
        role3: "Admin panellar quraman",
        badge: "Mavjud mijozlar uchun hamkorlik",
        bio: "Men g'oyalarni chiroyli, tez va ishonchli veb-ilovalarga aylantiraman. Dizayndan tortib backend'gacha — butun jarayonni boshqaraman. Sizning biznesingizga qiymat qo'shadigan raqamli mahsulot yaratish mening ishim.",
        avatarInitials: "MX",
        photoUrl: "",
        email: "yourname@example.com",
        telegram: "@yourusername",
        github: "https://github.com/",
        linkedin: "https://linkedin.com/in/",
        instagram: "https://instagram.com/",
        location: "Toshkent, O'zbekiston",
        resumeUrl: "",
        statProjects: "25+",
        statExperience: "3 yil",
        statAvailability: "Doim aloqada",
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
          title: "E-commerce Platformasi",
          description:
            "To'liq funksional onlayn-do'kon: mahsulot katalogi, savat, onlayn to'lov va buyurtmalarni boshqarish paneli. Admin orqali mahsulotlar, aksiyalar va statistika boshqariladi.",
          link: "",
          github: "https://github.com/",
          image: "",
          tech: "Next.js, Tailwind, SQLite",
          featured: true,
          order: 0,
          published: true,
          createdAt: new Date(),
        },
        {
          title: "CRM Dashboard",
          description:
            "Mijozlar bilan ishlash tizimi: kontaktlar bazasi, vazifalar, hisobotlar va grafiklar. Komanda bo'lib ishlash uchun rollar va huquqlar tizimi mavjud.",
          link: "",
          github: "https://github.com/",
          image: "",
          tech: "React, Node.js, PostgreSQL",
          featured: false,
          order: 1,
          published: true,
          createdAt: new Date(),
        },
        {
          title: "Landing Page — SaaS Startap",
          description:
            "Mahsulotni taqdim qiluvchi zamonaviy landing sahifa: animatsiyalar, SEO optimizatsiya va konversiyaga yo'naltirilgan struktura.",
          link: "",
          github: "https://github.com/",
          image: "",
          tech: "Next.js, Framer Motion, SEO",
          featured: false,
          order: 2,
          published: true,
          createdAt: new Date(),
        },
        {
          title: "Blog Platformasi",
          description:
            "Maqolalar yozish, kategorilar, izohlar va admin panelga ega to'liq blog tizimi. Markdown muharriri bilan qulay kontent boshqaruvi.",
          link: "",
          github: "https://github.com/",
          image: "",
          tech: "Next.js, Drizzle ORM, Markdown",
          featured: false,
          order: 3,
          published: true,
          createdAt: new Date(),
        },
        {
          title: "Telegram Bot + Web App",
          description:
            "Biznes jarayonlarni avtomatlashtiruvchi Telegram bot va uning ichki veb-ilovasi: buyurtmalar, to'lovlar va mijozlar bilan muloqot.",
          link: "",
          github: "https://github.com/",
          image: "",
          tech: "TypeScript, Telegram Bot API, SQLite",
          featured: false,
          order: 4,
          published: true,
          createdAt: new Date(),
        },
        {
          title: "Shaxsiy Finans Ilovasi",
          description:
            "Daromad va xarajatlarni kuzatuvchi ilova: kategoriyalar, oylik hisobotlar, diagrammalar va budjet rejalashtirish.",
          link: "",
          github: "https://github.com/",
          image: "",
          tech: "React, Chart.js, Node.js",
          featured: false,
          order: 5,
          published: true,
          createdAt: new Date(),
        },
      ])
      .run();
    console.log("✅ Boshlang'ich loyihalar yaratildi.");
  } else {
    console.log("ℹ️  Loyihalar allaqachon mavjud, o'tkazib yuborildi.");
  }

  const existingSkills = await db.select().from(schema.skills).all();
  if (existingSkills.length === 0) {
    await db
      .insert(schema.skills)
      .values([
        { name: "HTML / CSS", level: 95, category: "Frontend", order: 0 },
        { name: "JavaScript / TypeScript", level: 90, category: "Frontend", order: 1 },
        { name: "React / Next.js", level: 88, category: "Frontend", order: 2 },
        { name: "Tailwind CSS", level: 92, category: "Frontend", order: 3 },
        { name: "Node.js", level: 82, category: "Backend", order: 0 },
        { name: "SQL / Drizzle ORM", level: 85, category: "Backend", order: 1 },
        { name: "REST API", level: 88, category: "Backend", order: 2 },
        { name: "Git / GitHub", level: 90, category: "Asboblar", order: 0 },
        { name: "Docker", level: 70, category: "Asboblar", order: 1 },
        { name: "Figma", level: 78, category: "Dizayn", order: 0 },
        { name: "UI/UX asoslari", level: 80, category: "Dizayn", order: 1 },
      ])
      .run();
    console.log("✅ Ko'nikmalar yaratildi.");
  }

  const existingServices = await db.select().from(schema.services).all();
  if (existingServices.length === 0) {
    await db
      .insert(schema.services)
      .values([
        {
          title: "Veb-sayt yaratish",
          description:
            "Biznesingiz uchun zamonaviy, tez va mobil qurilmalarga mos veb-sayt. Dizayndan tortib deploy'gacha to'liq xizmat.",
          icon: "🚀",
          order: 0,
        },
        {
          title: "Admin panel",
          description:
            "Saytingizni o'zingiz boshqaring: ma'lumotlar, foydalanuvchilar va kontentni oddiy panel orqali tahrirlash imkoniyati.",
          icon: "⚙️",
          order: 1,
        },
        {
          title: "Telegram botlar",
          description:
            "Biznes jarayonlarni avtomatlashtiruvchi botlar: buyurtmalar, e'lonlar, so'rovnomalar va mijozlar bilan muloqot.",
          icon: "🤖",
          order: 2,
        },
        {
          title: "Saytni yangilash",
          description:
            "Mavjud saytingizni zamonaviy ko'rinishga keltiraman: dizayn, tezlik va SEO bo'yicha to'liq yangilanish.",
          icon: "✨",
          order: 3,
        },
      ])
      .run();
    console.log("✅ Xizmatlar yaratildi.");
  }

  const existingExperience = await db.select().from(schema.experience).all();
  if (existingExperience.length === 0) {
    await db
      .insert(schema.experience)
      .values([
        {
          role: "Full-stack dasturchi",
          company: "Freelance",
          period: "2024 — Hozir",
          description:
            "Turli sohalardagi mijozlar uchun veb-saytlar, admin panellar va Telegram botlar yaratib beraman. 25 dan ortiq loyihani muvaffaqiyatli topshirdim.",
          order: 0,
        },
        {
          role: "Frontend dasturchi",
          company: "IT kompaniya",
          period: "2023 — 2024",
          description:
            "Jamoa tarkibida mijozlar uchun interfeyslar yaratish, komponentlar kutubxonasini rivojlantirish va dizayn bilan hamkorlik qilish.",
          order: 1,
        },
        {
          role: "Veb-dasturlash kurslari",
          company: "O'qish",
          period: "2022 — 2023",
          description:
            "Veb-dasturlash asoslarini o'rgandim: HTML, CSS, JavaScript, React va backend texnologiyalari. Amaliy loyihalar ustida ishladim.",
          order: 2,
        },
      ])
      .run();
    console.log("✅ Tajriba yaratildi.");
  }

  const existingTestimonials = await db.select().from(schema.testimonials).all();
  if (existingTestimonials.length === 0) {
    await db
      .insert(schema.testimonials)
      .values([
        {
          name: "Jasur Aliyev",
          role: "Kichik biznes egasi",
          text: "Muhammad mening do'konim uchun sayt yaratib berdi. Natija kutilganimdan ham zo'r bo'ldi — mijozlar saytdan foydalanishni juda qulay deb aytishyapti. Buyurtmalar soni sezilarli oshdi.",
          avatarInitials: "JA",
          order: 0,
        },
        {
          name: "Dilnoza Karimova",
          role: "Startap asoschisi",
          text: "Loyihamizni qisqa muddatda, sifatli va katta e'tibor bilan bajardi. Har bir detalda mijoz manfaatini o'ylab ishlaydi. Hamkorlikdan juda mamnunman!",
          avatarInitials: "DK",
          order: 1,
        },
        {
          name: "Aziz Rahimov",
          role: "Marketing bo'yicha mutaxassis",
          text: "Saytimizni to'liq yangilab berdi: tezlik, dizayn va SEO — hammasi professional darajada. Kelajakda yana murojaat qilamiz, albatta.",
          avatarInitials: "AR",
          order: 2,
        },
      ])
      .run();
    console.log("✅ Fikrlar yaratildi.");
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
