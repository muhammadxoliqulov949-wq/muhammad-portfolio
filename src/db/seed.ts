import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";

/**
 * Boshlang'ich kontent — MUHAMMAD XOLIQULOVNING HAQIQIY ma'lumotlari.
 *
 * Qoida (egasi talabi bilan): bu faylda faqat berilgan faktlar turadi.
 * Raqam, mijoz nomi, foiz, "yillar tajribasi" kabi hech narsa o'ylab
 * topilmagan; berilmagan maydon bo'sh qoldirilgan (UI bo'shni ko'rsatmaydi).
 *
 *  - Admin hisobi env'dan (ADMIN_EMAIL / ADMIN_PASSWORD).
 *  - `--force` bilan kontent qatorlari qayta yoziladi (admin va xabarlar qoladi).
 */

const FORCE = process.argv.includes("--force");

/* ────────────────────────── Profil ────────────────────────── */

const profileRow = {
  fullName: "Muhammad Xoliqulov",
  title: "Student & AI Developer",
  role2: "AI-assisted full-stack development",
  role3: "Vibe coding — gʻoyadan deploygacha",
  badge: "Toshkent · Oʻzbekiston",
  bio: "AI'ni tayyor javob beruvchi deb emas, ish sherigi deb ishlataman: gʻoyani tez yigʻaman, chiqqan kodni oʻqib chiqaman, buzaman, tuzataman va ishlaydigan mahsulotga yetkazaman.",
  avatarInitials: "MX",
  photoUrl: "",
  email: "muhammadxoliqulov949@gmail.com",
  phone: "+998 99 201 11 77",
  telegram: "@mukham_06",
  github: "https://github.com/muhammadxoliqulov949-wq",
  linkedin: "",
  instagram: "https://www.instagram.com/_mukhammad06/",
  location: "Toshkent, Oʻzbekiston",
  resumeUrl: "",
  responseTime: "",
  sinceYear: "",
  englishLevel: "B2",
  story:
    "Men International OXUS Universitetida Iqtisodiyot va biznes boshqaruvi yoʻnalishida oʻqiyman (2026–2030) va birinchi kursdayoq haqiqiy mijozlar uchun ishlab boʻlganman. Kod yozishni oʻzim oʻrgandim — kitobdan emas, ishlaydigan narsa qurish orqali.\n\n" +
    "Meni \"har bir qatorni qoʻlda yozadigan dasturchi\" deb tasvirlash toʻgʻri emas: men AI yordamida quraman, lekin AI yozgan kodni tekshirmasdan qabul qilmayman. Marshrut sodda: gʻoya → prototip → kodni oʻqib chiqish → buzilgan joyini topish → sinash → eʼlon qilish.\n\n" +
    "Marketing agentligida 10 dan ortiq mijoz bilan, futbol mashgʻulotlarida 30 dan ortiq bola bilan ishlash mendan ikki narsani qoldirdi: odam bilan aniq kelishish va soʻz berilgan sanani buzmaslik.",
  strengths:
    "Tez oʻrganish, Mustaqil oʻqish, Oʻzim boshlab oʻzim tugatish, Ijodiy yechim, Tahliliy fikrlash, Qatʻiyat, Masʻuliyatni olish, Muddatga rioya qilish",
  interests: "Futbol, Taʼlim, Biznes, Texnologiya, Sunʼiy intellekt, Shaxsiy oʻsish, Murakkab masalalar",
  principleWork: "Boshlagan narsani tugatgim keladi — yarim ishlangan loyiha natija hisoblanmaydi.",
  principleDelivery: "Aytgan ishni oʻz vaqtida qilish. Kechikish — imkoniyatni yoʻqotish.",
  workflow:
    "Talabni qogʻozga tushiraman | AI bilan tez prototip yigʻaman | Har bir qatorni oʻqib chiqaman | Buzilgan joyini topib tuzataman | Brauzer va telefonda sinayman | Vercelʼga chiqaraman",
  goals:
    "20+ professional loyiha qurish | Professional brend va blog yuritish | 5+ yirik kompaniya bilan ishlash | Oʻz onlayn kursimni yaratish | Kuchli professional muhit | AI/web dasturchi sifatida chuqurlashish",
  statProjects: "5 ta sayt",
  statExperience: "≈1,5 yil",
  statAvailability: "10+ mijoz",
};

/* ────────────────────────── Loyihalar ────────────────────────── */

const projectRows = [
  {
    title: "IELTS.mock",
    description:
      "IELTSʼga tayyorgarlik uchun interaktiv platforma: tinglash, oʻqish, yozish va gapirish amaliyoti, natija tahlili, xatoni qayta koʻrish, lugʻat ishlashi va AI yordamida javobni yaxshilash.",
    link: "https://ielts-mock-v2.vercel.app/",
    github: "https://github.com/muhammadxoliqulov949-wq/IELTS-mock-v2",
    image: "/media/ielts-mock-home.jpg",
    tech: "HTML, CSS, JavaScript, Node.js, REST API, Gemini AI API, PWA, Service Worker",
    year: "",
    role: "Loyihani AI yordamida mustaqil quraman",
    impact: "Amaliyot, xatoni koʻrib chiqish va AI izohi — bitta joyda.",
    problem:
      "IELTSʼga tayyorlanishda ikki narsa kam: koʻp mashq qiladigan joy va javobingni tekshirib beradigan odam. Kurs hammaga mos kelavermaydi, mustaqil yozib tashlagan javobda esa xato qayerda — koʻrinmaydi.",
    approach:
      "Har bir boʻlim uchun alohida amaliyot moduli bilan boshladim: savol → javob → natija tahlili. Keyin xatolarni qayta koʻrish va lugʻat qatlamini qoʻshdim. Yozma javobni yaxshilash uchun Gemini AI APIʼni uldim. AI koʻp kod yozdi — men uni oʻqib chiqdim, tuzatdim, boʻlinishlarni qayta yozdim va har bosqichni brauzerda sinadim. Service Worker bilan platforma oflayn ham ochiladi (PWA).",
    outcome:
      "Platforma jonli holda ishlaydi va faol rivojlantirilmoqda. Foydalanuvchilar soni yoki ball statistikasi hozircha eʼlon qilinmagan — bu oʻsayotgan mahsulot, tayyor raqam emas.",
    gallery: "/media/ielts-mock-exam.jpg | /media/ielts-mock-plans.jpg",
    status: "Ishlab chiqilmoqda — faol davom etmoqda",
    features:
      "Listening amaliyoti | Reading amaliyoti | Writing amaliyoti | Speaking amaliyoti | Natija tahlili | Xatoni qayta koʻrish | Lugʻat ishlashi | AI bilan javobni yaxshilash",
    featured: true,
    order: 0,
    published: true,
  },
];

/* ────────────────────────── Koʻnikmalar ────────────────────────── */

const skillRows = [
  // AI & Development
  { name: "AI-assisted development", category: "AI & Development", context: "Gʻoyadan deploygacha bitta oqim", order: 0 },
  { name: "Vibe coding", category: "AI & Development", context: "Asosiy ish uslubim", order: 1 },
  { name: "AI API integration", category: "AI & Development", context: "IELTS.mockʼda Gemini API", order: 2 },
  { name: "Full-stack development", category: "AI & Development", context: "Interfeys + Node.js qatlami", order: 3 },
  { name: "Debugging", category: "AI & Development", context: "AI chiqargan kodni oʻqib, buzilganini topish", order: 4 },
  { name: "Testing", category: "AI & Development", context: "Har bosqichni qoʻlda va brauzerda sinash", order: 5 },
  { name: "Deployment", category: "AI & Development", context: "Vercel, domen va muhit oʻzgaruvchilari", order: 6 },
  { name: "AI-assisted UI/UX design", category: "AI & Development", context: "Maketdan kodgacha — AI bilan", order: 7 },

  // Web
  { name: "HTML", category: "Web", context: "Tuzilma va semantika", order: 10 },
  { name: "CSS", category: "Web", context: "Uslub, animatsiya, grid", order: 11 },
  { name: "JavaScript", category: "Web", context: "Interaktivlik va API bilan ishlash", order: 12 },
  { name: "React", category: "Web", context: "Komponentli interfeys", order: 13 },
  { name: "Node.js", category: "Web", context: "Server, API va skriptlar", order: 14 },
  { name: "REST API", category: "Web", context: "Frontend ↔ backend kelishuvi", order: 15 },
  { name: "PWA", category: "Web", context: "Sayt ilova kabi ishlaydi", order: 16 },
  { name: "Service Worker", category: "Web", context: "Kesh va oflayn holat", order: 17 },
  { name: "Tailwind CSS", category: "Web", context: "Token asosida tez yigʻish", order: 18 },
  { name: "Responsive design", category: "Web", context: "Mobil → desktop, bitta kod", order: 19 },
  { name: "Authentication", category: "Web", context: "Sessiya va himoyalangan sahifalar", order: 20 },

  // Tools
  { name: "Git", category: "Tools", context: "Versiya nazorati", order: 30 },
  { name: "GitHub", category: "Tools", context: "Kod ombori, PR, Actions", order: 31 },
  { name: "Vercel", category: "Tools", context: "Deploy va domen", order: 32 },
  { name: "Figma", category: "Tools", context: "Maket, wireframe, prototip", order: 33 },
  { name: "Canva", category: "Tools", context: "Tez vizual material", order: 34 },

  // AI tools
  { name: "ChatGPT / GPT", category: "AI tools", context: "Kod va matn yozish, tushuntirish", order: 40 },
  { name: "Claude", category: "AI tools", context: "Uzun fayllar bilan ishlash, review", order: 41 },
  { name: "Gemini", category: "AI tools", context: "IELTS.mockʼda AI API sifatida", order: 42 },
  { name: "Perplexity", category: "AI tools", context: "Manba topish va tekshirish", order: 43 },
  { name: "Higgsfield", category: "AI tools", context: "Vizual va video materiallar", order: 44 },
  { name: "Arena AI", category: "AI tools", context: "Bir nechta modelni qiyoslash", order: 45 },
];

/* ────────────────────────── Xizmatlar ────────────────────────── */

const serviceRows = [
  {
    title: "AI & Web Development",
    description:
      "Asosiy xizmat: gʻoyani ishlaydigan veb-ilovaga aylantiraman. Interfeys, backend, AI integratsiyasi va deploy — bitta odamdan, bosqichma-bosqich.",
    icon: "bot",
    features:
      "Tez prototip | AI API integratsiyasi | Backend va REST API | Test va debug | Vercelʼga chiqarish | Kodni tushuntirib berish",
    order: 0,
  },
  {
    title: "AI veb-ilovalar",
    description: "AI modelini ishlatadigan ilovalar: savol-javob, matnni yaxshilash, tahlil va xulosalar.",
    icon: "sparkle",
    features: "Chat interfeysi | Prompt matni | Javobni tekshirish oqimi | Xarajatni nazorat qilish",
    order: 1,
  },
  {
    title: "Biznes sayti va landing",
    description: "Kompaniya yoki xizmat uchun sayt: nima taklif qilishingiz aniq koʻrinadi, ariza/qoʻngʻiroq qabul qilinadi.",
    icon: "layers",
    features: "Landing yoki koʻp sahifa | Kontent admin panelda | Tez yuklanish | Mobil birinchi",
    order: 2,
  },
  {
    title: "Portfolio va shaxsiy brend sayti",
    description: "Oʻz ishni koʻrsatib, mijozga olib keladigan shaxsiy sayt — loyihalar, xizmat va aloqa bir joyda.",
    icon: "pen",
    features: "Case study sahifalari | Admin panel | SEO asoslari | Kontakt formasi",
    order: 3,
  },
  {
    title: "AI API integratsiyasi",
    description: "Mavjud tizimga AI qoʻshish: chaqiruv server tomonida, javoblar saqlanadi, xatolar qayta ishlanadi.",
    icon: "zap",
    features: "Server tomonida chaqiruv | Kalitni yashirish | Limit va kesh | Xato holatlari",
    order: 4,
  },
  {
    title: "Full-stack veb-ilova",
    description: "Forma, roʻyxat, autentifikatsiya va admin panelli ilova — maʼlumot bazasi bilan birga.",
    icon: "code",
    features: "Auth (JWT + cookie) | CRUD va admin panel | DB sxemasi | REST API",
    order: 5,
  },
  {
    title: "PWA va oflayn rejim",
    description: "Saytni telefonda ilova kabi ishlashiga yetkazish: kesh, oflayn ochilish, eʼlonlashga tayyor qatlam.",
    icon: "gauge",
    features: "Service Worker | Manifest | Kesh strategiyasi | Offline holat",
    order: 6,
  },
  {
    title: "Saytni tuzatish va yaxshilash",
    description: "Buzilgan, ogʻir yoki eski saytni tekshirib, ishlashini va tezligini tiklash.",
    icon: "target",
    features: "Xatoni topish | Performans | Mobil moslashuv | Kodni tozalash",
    order: 7,
  },
  {
    title: "UI/UX implementatsiyasi",
    description: "Figma maketini toʻliq javobgar interfeysga aylantirish — holatlar, fokus va mobil bilan birga.",
    icon: "rocket",
    features: "Dizayn tokenlari | Dark/light rejim | A11y tekshiruvi | Mikro-harakatlar",
    order: 8,
  },
];

/* ────────────────────────── Tajriba ────────────────────────── */

const experienceRows = [
  {
    role: "Web Developer",
    company: "Frilans — mijoz buyurtmalari",
    period: "",
    description:
      "Buyurtma asosida kichik biznes saytlari va landing sahifalar: dizayn, kod, test va eʼlon qilish — hammasi oʻzim.",
    highlights: "5 ta sayt topshirilgan | HTML, CSS, JS va Node.js | Vercelʼda eʼlon qilingan | AI yordamida tez prototip",
    current: false,
    order: 0,
  },
  {
    role: "Marketer",
    company: "Marketing agentligi",
    period: "",
    description: "Mijozlar uchun kontent va targʻibot ishlarida qatnashdim.",
    highlights: "10+ mijoz bilan ishlash | Mijoz talabini tushunish | Kontent va reklama matnlari",
    current: false,
    order: 1,
  },
  {
    role: "Football coach",
    company: "Futbol mashgʻulotlari",
    period: "",
    description: "Bolalarga futbol oʻrgatdim — mashgʻulot rejasi va guruh bilan ishlash.",
    highlights: "30+ bola | Muntazam reja | Guruhni boshqarish",
    current: false,
    order: 2,
  },
  {
    role: "English tutor",
    company: "Ingliz tili darslari",
    period: "",
    description: "Ikki oʻquvchiga ingliz tilidan dars berdim.",
    highlights: "2 oʻquvchi | Grammatika va gaplashish amaliyoti",
    current: false,
    order: 3,
  },
];

/* ────────────────────────── Taʼlim ────────────────────────── */

const educationRows = [
  {
    institution: "International OXUS University",
    credential: "Bakalavr",
    field: "Iqtisodiyot va biznes boshqaruvi",
    period: "2026–2030",
    status: "1-kurs talabasi",
    detail:
      "Biznes, iqtisodiyot va boshqaruv asoslari. Texnologiyani biznes nuqtai nazaridan koʻrishni shu yoʻnalish oʻrgatdi: mahsulot nafaqat ishlashi, balki sotilishi kerak.",
    current: true,
    order: 0,
  },
  {
    institution: "Umumtaʼlim maktabi",
    credential: "Oʻrta maʼlumot",
    field: "",
    period: "",
    status: "Tugatilgan",
    detail: "Maktabda matematika va fizika boʻyicha shahar bosqichi olimpiadalarida qatnashganman.",
    current: false,
    order: 1,
  },
];

/* ────────────────────────── Yutuqlar ────────────────────────── */

const achievementRows = [
  {
    title: "CEFR B1 — ingliz tili",
    issuer: "Til sertifikati",
    kind: "cert",
    year: "",
    detail: "Sertifikat bilan tasdiqlangan daraja. Amaliy ishlatish darajam: B2.",
    url: "",
    order: 0,
  },
  {
    title: "AI Developer va unga qoʻshni Google sertifikatlari",
    issuer: "Google",
    kind: "cert",
    year: "",
    detail: "AI yordamida dasturlash boʻyicha Google tomonidan berilgan sertifikatlar.",
    url: "",
    order: 1,
  },
  {
    title: "Matematika olimpiadasi — shahar bosqichi, 3-oʻrin",
    issuer: "Maktab matematika olimpiadasi",
    kind: "academic",
    year: "",
    detail: "Maktab olimpiadasining shahar bosqichi.",
    url: "",
    order: 2,
  },
  {
    title: "Fizika olimpiadasi — shahar bosqichi, 6-oʻrin",
    issuer: "Maktab fizika olimpiadasi",
    kind: "academic",
    year: "",
    detail: "Maktab olimpiadasining shahar bosqichi.",
    url: "",
    order: 3,
  },
  {
    title: "DXX 2026 yirik futbol musobaqasi — 3-oʻrin",
    issuer: "DXX 2026",
    kind: "sport",
    year: "2026",
    detail: "",
    url: "",
    order: 4,
  },
];

/* Mijoz fikrlari ATAYLAB boʻsh: haqiqiy fikr berilmagan, soxta iqtibos yozmaymiz. */
const testimonialRows: Record<string, never>[] = [];

/* ────────────────────────── Mexanika ────────────────────────── */

/**
 * `--force` bilan qatorlar o'chirilib qayta yozilganda AUTOINCREMENT ham
 * nolga tushiriladi — aks holda har bir seed'da id'lar o'sib, `/projects/8`
 * kabi barqaror bo'lmagan URL'lar paydo bo'ladi (Turso'da ruxsat bo'lmasa
 * jimgina o'tkazib yuboriladi).
 */
async function resetSequence(table: string) {
  try {
    await db.run(sql.raw(`DELETE FROM sqlite_sequence WHERE name = '${table}'`));
  } catch {
    /* ba'zi muhitlarda sqlite_sequence'ga yozib bo'lmaydi */
  }
}

async function fillTable(label: string, table: AnySQLiteTable, rows: Record<string, unknown>[], seq?: string) {
  const existing = await db.select().from(table).all();
  if (existing.length > 0 && !FORCE) {
    console.log(`⏭️  ${label}: ${existing.length} ta yozuv mavjud, oʻtkazib yuborildi`);
    return;
  }
  if (existing.length > 0 && FORCE) {
    await db.delete(table).run();
    if (seq) await resetSequence(seq);
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
      .values({ email: adminEmail, passwordHash, name: "Muhammad", createdAt: new Date() })
      .run();
    console.log(`✅ Admin yaratildi: ${adminEmail} / ${adminPassword}`);
    console.log("⚠️  Birinchi kirishdan soʻng ADMIN_PASSWORD ni oʻzgartiring.");
  } else {
    console.log(`ℹ️  Admin allaqachon mavjud (${admins[0].email})`);
  }

  // 2) Profil (singleton)
  const profiles = await db.select().from(schema.profile).all();
  if (profiles.length === 0) {
    await db.insert(schema.profile).values({ ...profileRow, updatedAt: new Date() }).run();
    console.log("✅ Profil yaratildi");
  } else if (FORCE) {
    await db.update(schema.profile).set({ ...profileRow, updatedAt: new Date() }).run();
    console.log("♻️  Profil yangilandi");
  } else {
    console.log("⏭️  Profil mavjud, oʻtkazib yuborildi");
  }

  await fillTable("Loyihalar", schema.projects, projectRows.map((r) => ({ ...r, createdAt: new Date() })), "projects");
  await fillTable("Koʻnikmalar", schema.skills, skillRows, "skills");
  await fillTable("Xizmatlar", schema.services, serviceRows, "services");
  await fillTable("Tajriba", schema.experience, experienceRows, "experience");
  await fillTable("Taʼlim", schema.education, educationRows, "education");
  await fillTable("Yutuqlar", schema.achievements, achievementRows, "achievements");
  await fillTable("Mijozlar fikri", schema.testimonials, testimonialRows, "testimonials");

  console.log("🎉 Tayyor.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed xatosi:", err);
    process.exit(1);
  });
