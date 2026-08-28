import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";

/**
 * Boshlang'ich ma'lumotlar.
 *
 *  - Admin hisobini env'dan oladi (ADMIN_EMAIL / ADMIN_PASSWORD).
 *  - Kontent namunaviy, lekin case-study formatida: har loyihada rol, yil,
 *    metrik natija va muammo→yechim→natija matni bor.
 *  - `--force` bilan ishga tushirilsa, kontent qatorlari qayta yoziladi
 *    (admin hisobi va xabarlar saqlanadi).
 */

const FORCE = process.argv.includes("--force");

const profileRow = {
  fullName: "Muhammad",
  title: "Full-stack dasturchi",
  role2: "Next.js va TypeScript bilan ishlayman",
  role3: "Telegram botlar va admin panellar quraman",
  badge: "2026 uchun 2 ta joy bo'sh",
  bio: "Toshkentda yashovchi mustaqil dasturchiman. Zamonaviy veb-ilovalar, ichki admin panellar va Telegram botlar yarataman — dizaynni ham, kodni ham birga olib boraman.",
  avatarInitials: "MX",
  photoUrl: "",
  email: "salom@muhammad.uz",
  telegram: "@muhammad_dev",
  github: "https://github.com/muhammadxoliqulov949-wq",
  linkedin: "",
  instagram: "",
  location: "Toshkent, O'zbekiston",
  resumeUrl: "",
  responseTime: "Odatda 12 soat ichida javob beraman",
  sinceYear: "2022",
  statProjects: "18 ta",
  statExperience: "3 yil",
  statAvailability: "2 ta joy",
};

const skillRows = [
  { name: "React", category: "Frontend", years: 3, context: "11 ta loyihada" },
  { name: "Next.js (App Router)", category: "Frontend", years: 3, context: "Bu sayt shunda" },
  { name: "TypeScript", category: "Frontend", years: 2, context: "Barcha yangi loyihalarda" },
  { name: "Tailwind CSS", category: "Frontend", years: 3, context: "Dizayn tizimlari bilan" },
  { name: "Node.js", category: "Backend", years: 3, context: "API va botlar" },
  { name: "Drizzle ORM", category: "Backend", years: 1, context: "SQLite / Turso" },
  { name: "REST API dizayni", category: "Backend", years: 2, context: "Zod bilan validatsiya" },
  { name: "Auth (JWT + httpOnly)", category: "Backend", years: 2, context: "Admin panellar" },
  { name: "Git va GitHub Actions", category: "Asboblar", years: 3, context: "Deploy avtomatsiyasi" },
  { name: "Figma", category: "Asboblar", years: 2, context: "Makетdan kodgacha" },
  { name: "Vercel", category: "Asboblar", years: 2, context: "Edge funksiyalar" },
  { name: "Lighthouse / a11y audit", category: "Asboblar", years: 1, context: "90+ ball maqsadi" },
].map((s, i) => ({ ...s, level: 0, order: i }));

const serviceRows = [
  {
    title: "Landing sahifa",
    description: "Biznes yoki shaxsiy xizmat uchun tezkor, konversiyaga mo'ljallangan bir sahifa.",
    icon: "rocket",
    priceFrom: "$350 dan",
    delivery: "5–7 ish kun",
    features: "2 variant makет | Animatsiyalar va mikro-interaktsiya | Formalar + DB | SEO va OG kartochka | Lighthouse 95+ tekshiruvi",
    order: 0,
  },
  {
    title: "Portfolio yoki korporativ sayt",
    description: "Kontent admin panelda boshqariladigan, ko'p bo'limli sayt.",
    icon: "layers",
    priceFrom: "$700 dan",
    delivery: "2–3 hafta",
    features: "Dizayn tizimi (tokenlar) | Admin panel (CRUD) | Blog yoki case study | Ko'p tillilik imkoniyati | 3 oy texnik yordam",
    order: 1,
  },
  {
    title: "Admin panel va API",
    description: "Ichki jarayonlar uchun dashboard: jadvallar, filtr, rol va audit izi bilan.",
    icon: "gauge",
    priceFrom: "$1 200 dan",
    delivery: "3–5 hafta",
    features: "Auth va sessiya xavfsizligi | Zod validatsiyali REST API | Jadval: qidiruv, saralash, sahifalash | CSV eksport | Test va migratsiyalar",
    order: 2,
  },
  {
    title: "Telegram bot",
    description: "Buyurtma, to'lov yoki qo'llab-quvvatlashni botga chiqarish.",
    icon: "bot",
    priceFrom: "$400 dan",
    delivery: "1–2 hafta",
    features: "Buyurtma oqimi | Admin panel bilan bog'lash | To'lov integratsiyasi | Xabar navbatlari | Log va monitoring",
    order: 3,
  },
];

const experienceRows = [
  {
    role: "Full-stack dasturchi",
    company: "Mustaqil (frilans)",
    period: "2023 — hozir",
    description:
      "Kichik biznes va startaplar bilan ishlayman: g'oyadan to production'gacha — dizayn, frontend, backend va deploy.",
    highlights:
      "18 ta yetkazilgan loyiha | O'rtacha qaytish vaqti 3 hafta | 6 mijoz takroriy buyurtma berdi",
    current: true,
    order: 0,
  },
  {
    role: "Frontend dasturchi",
    company: "Web studiya (shartnoma asosida)",
    period: "2022 — 2023",
    description: "Mijoz loyihalarini Figma maketidan React komponentlariga aylantirish, adaptiv va a11y nazorati.",
    highlights: "24 ta makетdan ishga tushirilgan sahifa | Komponent kutubxonasi joriy etildi",
    current: false,
    order: 1,
  },
  {
    role: "O'z o'qishi va shaxsiy loyihalar",
    company: "O'z-o'zidan + amaliyot",
    period: "2021 — 2022",
    description: "JavaScript, React va asosiy backend tushunchalari; ilk botlar va ochiq kodga hissa.",
    highlights: "Birinchi Telegram bot (500+ foydalanuvchi) | 40+ ochiq commit",
    current: false,
    order: 2,
  },
];

const projectRows = [
  {
    title: "Chorsu Market — onlayn buyurtma platformasi",
    description:
      "Bozor sotuvchilari uchun buyurtma qabul qilish va statusni kuzatish tizimi: mijoz bot orqali buyurtma beradi, sotuvchi admin panelda boshqaradi.",
    tech: "Next.js, TypeScript, Drizzle, Turso, Telegram Bot API",
    year: "2025",
    role: "Full-stack (dizayn + kod)",
    impact: "Buyurtma rasmiylashtiruvi 6 daqiqadan 2 daqiqaga qisqardi",
    problem:
      "Buyurtmalar telefon va messenjerda qo'lda yozib borilardi: xatolar, yo'qolgan manzillar va kechikishlar kuniga 20+ holatga chiqardi.",
    approach:
      "Buyurtma holati (yangi → yig'ilmoqda → yetkazildi) uchun yagona holat-mashinasi, Telegram bot orqali qisqa forma, sotuvchilar uchun mobil moslashuvchi admin panel va navbatli bildirimlar.",
    outcome:
      "Uch oyda 1 400+ buyurtma raqamli oqimdan o'tdi, yo'qolgan buyurtma holati 0 ga tushdi, sotuvchilar o'rtacha 1.5 soat/hafta tejadi.",
    featured: true,
    order: 0,
    published: true,
    link: "",
    github: "",
    image: "",
    gallery: "",
  },
  {
    title: "Ideal Marmar — ishlab chiqarish admin paneli",
    description:
      "Marmar plitalari buyurtmalari, kesish rejasi va yetkazib berish muddatlarini boshqaradigan ichki dashboard.",
    tech: "Next.js, Zod, SQLite, Recharts",
    year: "2025",
    role: "Backend + UI",
    impact: "Reja tuzish 2 soatdan 15 daqiqaga tushdi",
    problem: "Buyurtmalar Excel'da yuritilardi, bir xil plita ikki marta band qilingan holatlar bo'lgan.",
    approach: "Bandliqni tekshiruvno yagona jadval, konfliktogohlantirish, CSV import va audit izi (kim, qachon o'zgartirdi).",
    outcome: "Ikki marta band qilish holatlari yo'qoldi; ombor hisoboti avtomatik yuboriladi.",
    featured: false,
    order: 1,
    published: true,
    link: "",
    github: "",
    image: "",
    gallery: "",
  },
  {
    title: "Uy-joy e'lonlari boti",
    description:
      "Kirayga uy e'lonlarini Telegram kanalga chiqarish va moderatsiya qilish boti; moderatori admin panel orqali tasdiqlaydi.",
    tech: "Node.js, grammY, SQLite, Vercel cron",
    year: "2024",
    role: "Backend",
    impact: "Kuniga 90+ e'lon, moderatsiya o'rtacha 4 daqiqa",
    problem: "Kanal administratorlari e'lonlarni qo'lda ko'chirar, spam aralashib ketardi.",
    approach: "Forma orqali keladigan e'lonlarga spam-hujum filtr va navbat; takroriy e'lonlarni matn o'xshashligi bo'yicha belgilash.",
    outcome: "Kanalda spam 80% ga kamaydi, moderatorlar soni 4 tadan 1 taga tushdi.",
    featured: false,
    order: 2,
    published: true,
    link: "",
    github: "",
    image: "",
    gallery: "",
  },
  {
    title: "Bu sayt — portfolio + CMS",
    description:
      "O'zingiz to'liq boshqaradigan portfolio: kontent bazada, qolgan qismi statik cacheda, dark/light tema va to'liq a11y bilan.",
    tech: "Next.js 16, Tailwind v4, Drizzle + Turso, jose, Zod",
    year: "2026",
    role: "Dizayn tizimi + kod",
    impact: "Lighthouse a11y 100 · LCP < 1.8s · 1 ta murakkab deploy",
    problem:
      "Ko'p portfolio'larda chiroyli dizayn bilan kontent boshqaruvi ajralib qoladi: sayt egasi matnini o'zgartira olmaydi yoki admin panel mobil'da ishlamaydi.",
    approach:
      "Dizayn tokenlari (dark-first + paper), CSS scroll-driven animatsiya (JS gidratsiyasiz), revalidate bilan cache va admin'da revalidatePath; har bir CRUD maydoni Zod sxemasida.",
    outcome: "Kontent 5 daqiqada admin paneldan yangilanadi, sayt cache'da qoladi, tema va til sozlamalari foydalanuvchi tanlovida.",
    featured: false,
    order: 3,
    published: true,
    link: "",
    github: "https://github.com/muhammadxoliqulov949-wq/portfolio-app-production",
    image: "",
    gallery: "",
  },
];

const testimonialRows = [
  {
    name: "Aziz Rustamov",
    role: "Chorsu Market, asoschisi",
    text: "Buyurtma oqimini bir oyda to'liq raqamlik qildik. Eng qadoniqli — har hafta nima o'zgarayotgini aniq ko'rib turdik, savol qolmadi.",
    avatarInitials: "AR",
    rating: 5,
    sourceUrl: "",
    order: 0,
  },
  {
    name: "Dilnoza Karimova",
    role: "Ideal Marmar, ombor menejeri",
    text: "Excel bilan kurashdan keyin dashboard hayotimizni o'zgartirdi. Mobil'dan ham ishlatamiz — omborda kompyuter yo'q.",
    avatarInitials: "DK",
    rating: 5,
    sourceUrl: "",
    order: 1,
  },
  {
    name: "Sardor Yo'ldoshev",
    role: "Kanal administratori",
    text: "Bot ishga tushgach spam deyarli qolmadi. Muddat bo'yicha bitta kechikish bo'lgan edi, ogohlantirib qo'ydi.",
    avatarInitials: "SY",
    rating: 4,
    sourceUrl: "",
    order: 2,
  },
];

/**
 * Jadvalni namunaviy kontent bilan to'ldiradi.
 * Mavjud yozuvlar saqlanadi, `--force` berilsa — qayta yoziladi.
 */
async function fillTable(
  label: string,
  // Drizzle generigini qo'lda yozish shart emas: bu yerda barcha jadvallar
  // bir xil ishlaydi, qiymatlar yuqoridagi massivlarda tekshirilgan.
  table: AnySQLiteTable,
  rows: Record<string, unknown>[]
) {
  const existing = await db.select().from(table).all();
  if (existing.length > 0 && !FORCE) {
    console.log(`ℹ️  ${label}: ${existing.length} ta yozuv bor, o'tkazib yuborildi (--force bilan qayta yoziladi)`);
    return;
  }
  if (existing.length > 0 && FORCE) {
    await db.delete(table).run();
  }
  if (rows.length > 0) {
    await db.insert(table).values(rows as never).run();
  }
  console.log(`✅ ${label}: ${rows.length} ta yozuv`);
}

async function seed() {
  console.log(FORCE ? "🌱 Seed (--force: kontent qayta yoziladi)" : "🌱 Seed");

  // 1) Admin hisobi
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const admins = await db.select().from(schema.admins).all();
  if (admins.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db
      .insert(schema.admins)
      .values({ email: adminEmail, passwordHash, name: "Admin", createdAt: new Date() })
      .run();
    console.log(`✅ Admin yaratildi: ${adminEmail} / ${adminPassword}`);
    console.log("⚠️  Birinchi kirishdan so'ng ADMIN_PASSWORD ni o'zgartiring.");
  } else {
    console.log(`ℹ️  Admin allaqachon mavjud (${admins[0].email})`);
  }

  // 2) Profil (singleton)
  const profiles = await db.select().from(schema.profile).all();
  if (profiles.length === 0) {
    await db.insert(schema.profile).values({ ...profileRow, updatedAt: new Date() }).run();
    console.log("✅ Profil yaratildi");
  } else if (FORCE) {
    await db.update(schema.profile).set(profileRow).run();
    console.log("♻️  Profil yangilandi");
  } else {
    console.log("⏭️  Profil mavjud, o'tkazib yuborildi");
  }

  await fillTable("Ko'nikmalar", schema.skills, skillRows);
  await fillTable("Xizmatlar", schema.services, serviceRows);
  await fillTable("Tajriba", schema.experience, experienceRows);
  await fillTable("Loyihalar", schema.projects, projectRows.map((p) => ({ ...p, createdAt: new Date() })));
  await fillTable("Mijozlar fikri", schema.testimonials, testimonialRows);

  console.log("🎉 Tayyor.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed xatosi:", err);
    process.exit(1);
  });
