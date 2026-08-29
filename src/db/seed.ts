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
 *  - Portret (`photoUrl` + media) force'da saqlanadi — egasi yuklagan rasm o'chmaydi.
 */

const FORCE = process.argv.includes("--force");

/* ────────────────────────── Profil ────────────────────────── */

const profileRow = {
  fullName: "Muhammad Xoliqulov",
  title: "Student & AI Developer",
  role2: "AI-assisted web development",
  role3: "Vibe coding — gʻoyadan deploygacha",
  badge: "Toshkent · Oʻzbekiston",
  bio: "Oʻzim oʻrgangan, AI yordamida toʻliq veb-ilova quradigan talabaman. Gʻoyani prototipga, prototipni ishlaydigan mahsulotga aylantiraman: kodni oʻqib chiqaman, buzaman, tuzataman va eʼlon qilaman.",
  avatarInitials: "MX",
  photoUrl: "",
  email: "muhammadxoliqulov949@gmail.com",
  phone: "+998 (99) 201-1177",
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
    "International OXUS Universitetida Iqtisodiyot va biznes boshqaruvi yoʻnalishida 1-kursman (2026–2030). Biznesga qarab oʻylash, tahlil, ijod va AI-assisted dasturlashni bitta ish oqimida tutaman.\n\n" +
    "Har qatorni qoʻlda yozadigan dasturchi emasman. AI vositalari bilan quraman, chiqqan kodni koʻrib chiqaman, xatoni topaman, sinayman va deploy qilaman. Shu usul gʻoyani tez ishlaydigan raqamli mahsulotga aylantiradi.\n\n" +
    "Oʻrganish, qurish va muammoni yechish menga yoqadi. Boshlagan ishni tugataman; aytgan narsani vaqtida qilaman — kechikish imkoniyatni yoʻqotadi.\n\n" +
    "Uzoq muddatdagi orzu (hozirgi yutuq emas): atrofimda oʻsishni xohlaydigan odamlar oʻqiydigan, ishlaydigan va birga vaqt oʻtkazadigan professional muhit — oʻz maktabim.",
  strengths:
    "Tez oʻrganish, Mustaqil oʻqish, Oʻzim boshlab oʻzim tugatish, Ijodiy yechim, Tahliliy fikrlash, Qatʻiyat, Masʻuliyatni olish, Murakkab masalalarni yoqtirish",
  interests: "Futbol, Taʼlim, Biznes, Texnologiya, Sunʼiy intellekt, Shaxsiy oʻsish, Muammoni yechish",
  principleWork: "Boshlagan narsani tugataman — yarim ishlangan loyiha natija hisoblanmaydi.",
  principleDelivery: "Aytgan ishni oʻz vaqtida qilish. Kechikish — imkoniyatni yoʻqotish.",
  workflow:
    "Talabni qogʻozga tushiraman | AI bilan tez prototip yigʻaman | Har bir qatorni oʻqib chiqaman | Buzilgan joyini topib tuzataman | Brauzer va telefonda sinayman | Vercelʼga chiqaraman",
  goals:
    "20+ professional loyiha qurish | Professional brend va blog | 5+ yirik kompaniya bilan ishlash | Oʻz onlayn kurslarim | Kuchli professional tarmoq | AI/web dasturchi sifatida chuqurlashish | Oʻrtacha oylik daromad 5000$ (maqsad — hozirgi holat emas)",
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
    role: "Loyihani AI yordamida mustaqil quraman — rivojlantirish, debug, test, integratsiya",
    impact: "Amaliyot, xatoni koʻrib chiqish va AI izohi — bitta joyda.",
    problem:
      "IELTSʼga tayyorlanishda ikki narsa kam: koʻp mashq qiladigan joy va javobingni tekshirib beradigan odam. Kurs hammaga mos kelavermaydi, mustaqil yozib tashlagan javobda esa xato qayerda — koʻrinmaydi.",
    approach:
      "Har bir boʻlim uchun alohida amaliyot moduli: savol → javob → natija tahlili. Keyin xatolarni qayta koʻrish va lugʻat qatlami. Yozma javobni yaxshilash uchun Gemini AI API. AI koʻp kod yozdi — men uni oʻqib chiqdim, tuzatdim va har bosqichni brauzerda sinadim. Service Worker bilan platforma oflayn ham ochiladi (PWA).",
    outcome:
      "Platforma jonli holda ishlaydi va faol rivojlantirilmoqda. Foydalanuvchilar soni yoki ball statistikasi eʼlon qilinmagan — bu oʻsayotgan mahsulot, tayyor raqam emas.",
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
  { name: "AI-assisted development", category: "AI & Development", context: "Gʻoyadan deploygacha bitta oqim", order: 0 },
  { name: "Vibe coding", category: "AI & Development", context: "Asosiy ish uslubim", order: 1 },
  { name: "AI API integration", category: "AI & Development", context: "IELTS.mockʼda Gemini API", order: 2 },
  { name: "Full-stack development", category: "AI & Development", context: "Interfeys + Node.js qatlami", order: 3 },
  { name: "Debugging", category: "AI & Development", context: "AI chiqargan kodni oʻqib, buzilganini topish", order: 4 },
  { name: "Testing", category: "AI & Development", context: "Har bosqichni qoʻlda va brauzerda sinash", order: 5 },
  { name: "Deployment", category: "AI & Development", context: "Vercel, domen va muhit oʻzgaruvchilari", order: 6 },
  { name: "AI-assisted product prototyping", category: "AI & Development", context: "Gʻoyani tez ishlaydigan versiyaga", order: 7 },

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

  { name: "AI-assisted UI/UX", category: "Design", context: "Maketdan kodgacha — AI bilan", order: 24 },
  { name: "Wireframing", category: "Design", context: "Sahifa tuzilmasi", order: 25 },
  { name: "Prototyping", category: "Design", context: "Bosiladigan maket", order: 26 },
  { name: "Typography & color", category: "Design", context: "Oʻqilishi va ierarxiya", order: 27 },
  { name: "CSS animations", category: "Design", context: "Yengil harakat, chalgʻitmaslik", order: 28 },
  { name: "Creative interface design", category: "Design", context: "Interfeysni mahsulotga moslash", order: 29 },

  { name: "Git", category: "Tools", context: "Versiya nazorati", order: 30 },
  { name: "GitHub", category: "Tools", context: "Kod ombori, PR", order: 31 },
  { name: "Vercel", category: "Tools", context: "Deploy va domen", order: 32 },
  { name: "Figma", category: "Tools", context: "Maket, wireframe, prototip", order: 33 },
  { name: "Canva", category: "Tools", context: "Tez vizual material", order: 34 },

  { name: "ChatGPT / GPT", category: "AI tools", context: "Kod va matn, tushuntirish", order: 40 },
  { name: "Claude", category: "AI tools", context: "Uzun fayllar, review", order: 41 },
  { name: "Gemini", category: "AI tools", context: "IELTS.mockʼda AI API", order: 42 },
  { name: "Perplexity", category: "AI tools", context: "Manba topish va tekshirish", order: 43 },
  { name: "Higgsfield", category: "AI tools", context: "Vizual materiallar", order: 44 },
  { name: "Arena AI", category: "AI tools", context: "Bir nechta modelni qiyoslash", order: 45 },

  { name: "Marketing", category: "Practice", context: "Amaliy, oʻrta daraja — 10+ mijoz", order: 50 },
  { name: "Business understanding", category: "Practice", context: "Hali rivojlanmoqda — universitet + frilans", order: 51 },
  { name: "Data analysis", category: "Practice", context: "Qaror va muammoni tahlil qilib yechish odatim", order: 52 },
];

/* ────────────────────────── Xizmatlar ────────────────────────── */

const serviceRows = [
  {
    title: "AI & Web Development",
    description:
      "Asosiy xizmat: gʻoyangizni ishlaydigan veb-ilovaga aylantiraman. Interfeys, backend, AI integratsiyasi va deploy — bitta odamdan, bosqichma-bosqich. Agentlik shabloni yoʻq.",
    icon: "bot",
    features:
      "AI-assisted prototip | Full-stack qurilish | AI API integratsiyasi | Test va debug | Vercelʼga chiqarish | Kodni tushuntirish",
    order: 0,
  },
  {
    title: "AI-powered web applications",
    description: "Modelni mahsulotga ulash: javobni yaxshilash, tahlil, mashq — foydalanuvchi koʻradigan oqim bilan.",
    icon: "sparkle",
    features: "Gemini / GPT API | Javobni tekshirish oqimi | Xarajatni nazorat | Xato holatlari",
    order: 1,
  },
  {
    title: "Business websites & landing pages",
    description: "Kompaniya yoki xizmat nima taklif qilishi aniq koʻrinsin, ariza yoki qoʻngʻiroq qabul qilinsin.",
    icon: "layers",
    features: "Landing yoki koʻp sahifa | Portfolio sayti | Mobil birinchi | Tez yuklanish",
    order: 2,
  },
  {
    title: "AI API integration",
    description: "Mavjud tizimga AI qoʻshish: chaqiruv serverda, kalit yashirin, javoblar saqlanadi.",
    icon: "zap",
    features: "Server tomonida chaqiruv | Kalitni yashirish | Limit va kesh | Xatolarni qayta ishlash",
    order: 3,
  },
  {
    title: "Full-stack web development",
    description: "Forma, roʻyxat, autentifikatsiya va admin — maʼlumot bazasi bilan birga ishlaydigan ilova.",
    icon: "code",
    features: "Auth | CRUD va admin panel | REST API | Deploy",
    order: 4,
  },
  {
    title: "UI/UX implementation",
    description: "Figma yoki sketsni javobgar interfeysga aylantirish — holatlar, tipografiya, mobil.",
    icon: "pen",
    features: "Responsive | Dark/light | Fokus va a11y | Yengil animatsiya",
    order: 5,
  },
  {
    title: "PWA development",
    description: "Sayt telefonda ilova kabi ochilsin: kesh, oflayn, eʼlonlashga tayyor qatlam.",
    icon: "gauge",
    features: "Service Worker | Manifest | Kesh strategiyasi | Offline holat",
    order: 6,
  },
  {
    title: "Website debugging & improvement",
    description: "Buzilgan, sekin yoki eski saytni tekshirib, ishlashini tiklash — yangisini vaʼda qilmasdan, mavjudini tuzatish.",
    icon: "target",
    features: "Xatoni topish | Performans | Mobil moslashuv | Kodni tozalash",
    order: 7,
  },
];

/* ────────────────────────── Tajriba ────────────────────────── */

const experienceRows = [
  {
    role: "Web Developer",
    company: "Frilans — mijoz buyurtmalari",
    period: "",
    description:
      "Soʻrov asosida 5 ta kichik sayt: biznes va landing. Dizayn, kod, test va eʼlon qilish — hammasi oʻzim, AI-assisted oqim bilan.",
    highlights: "5 ta sayt | HTML, CSS, JS, Node.js | Vercelʼda eʼlon | AI bilan tez prototip",
    current: false,
    order: 0,
  },
  {
    role: "Marketer",
    company: "Marketing agentligi",
    period: "",
    description: "Mijozlar uchun kontent va targʻibot. Kompaniya nomi berilmagan — shuning uchun yozilmagan.",
    highlights: "10+ mijoz | Talabni tushunish | Kontent va reklama matnlari",
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
    field: "Economics and Business Management",
    period: "2026–2030",
    status: "1-kurs talabasi",
    detail: "Iqtisodiyot va biznes boshqaruvi. Hozirgi holat: birinchi kurs.",
    current: true,
    order: 0,
  },
  {
    institution: "Umumtaʼlim maktabi",
    credential: "Oʻrta maʼlumot",
    field: "",
    period: "",
    status: "Tugatilgan",
    detail: "Maktab taʼlimi tugatilgan.",
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
    detail: "Sertifikat bilan tasdiqlangan daraja. Amaliy ishlatish: B2.",
    url: "",
    order: 0,
  },
  {
    title: "AI Developer va unga qoʻshni Google sertifikatlari",
    issuer: "Google",
    kind: "cert",
    year: "",
    detail: "AI yordamida dasturlash boʻyicha Google sertifikatlari. Alohida nomlar berilmagan.",
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

  const profiles = await db.select().from(schema.profile).all();
  if (profiles.length === 0) {
    await db.insert(schema.profile).values({ ...profileRow, updatedAt: new Date() }).run();
    console.log("✅ Profil yaratildi");
  } else if (FORCE) {
    const keepPhoto = profiles[0]?.photoUrl ?? "";
    await db
      .update(schema.profile)
      .set({ ...profileRow, photoUrl: keepPhoto || profileRow.photoUrl, updatedAt: new Date() })
      .run();
    console.log("♻️  Profil yangilandi (portret saqlanadi)");
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
