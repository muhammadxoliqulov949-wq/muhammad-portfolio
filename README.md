# Portfolio — premium, to'liq backend + production-ready

Bu loyiha professional darajadagi portfolio: premium dizayn, ma'lumotlar bazasi, autentifikatsiya, kengaytirilgan admin panel, SEO va Vercel'ga **bitta linkda** deploy qilishga tayyor holat.

## Nima bor

- **Premium bir sahifalik dizayn** — Space Grotesk + Inter fontlar (self-hosted), scroll animatsiyalar, gradient aksentlar, marquee-lenta, typewriter effekt, sanoq statistikalar
- **Bo'limlar** — Hero, ko'nikmalar (animatsiyali progress bar), xizmatlar, tajriba (timeline), loyihalar (featured + grid), mijozlar fikri, aloqa, footer
- **Ma'lumotlar bazasi**: Turso (bulutli SQLite, Vercel'ning serverless muhitida ishlaydigan) — Drizzle ORM orqali
- **Admin panel** (`/admin`) — parol bilan himoyalangan: profil, loyihalar, ko'nikmalar, xizmatlar, tajriba, fikrlar (hammasi CRUD) + xabarlar
- **Autentifikatsiya** — bcrypt + JWT sessiya (httpOnly cookie)
- **Aloqa formasi** — real xabar yuboradi, DB'ga saqlaydi, rate-limit bilan himoyalangan
- **SEO** — to'liq meta teglar (Open Graph, Twitter Card), avtomatik OG-image, JSON-LD (Person schema), `robots.txt`, `sitemap.xml`, dinamik favicon
- **Xatolik sahifalari** — brand dizaynida 404 va xatolik chegarasi

---

## 1-qadam: Turso ma'lumotlar bazasini yaratish (tekin)

Turso — Vercel kabi serverless muhitlarda ishlaydigan bulutli SQLite xizmati.

1. https://turso.tech ga kiring, tekin hisob oching (GitHub orqali kirish mumkin)
2. Dashboard'da **"Create Database"** tugmasini bosing, nom bering (masalan `portfolio-db`), region tanlang (eng yaqinini)
3. Baza yaratilgach, **"Connect"** yoki **"Generate Token"** bo'limidan quyidagilarni oling:
   - **Database URL** — `libsql://...` bilan boshlanadi
   - **Auth Token** — uzun matn kalit
4. Bu ikkalasini vaqtincha biror joyga yozib qo'ying — 3-qadamda kerak bo'ladi

*(Agar CLI'ni afzal ko'rsangiz: `turso db create portfolio-db` va `turso db tokens create portfolio-db`)*

## 2-qadam: Kodni GitHub'ga yuklash

Agar GitHub'da repo yo'q bo'lsa:

1. https://github.com/new ga kiring, yangi repo yarating (masalan `portfolio-app`), **Public** yoki **Private** — farqi yo'q
2. Terminalda (bu papkada):

```bash
git init
git add .
git commit -m "Portfolio: backend, admin panel, SEO"
git branch -M main
git remote add origin https://github.com/FOYDALANUVCHI_NOMI/portfolio-app.git
git push -u origin main
```

`FOYDALANUVCHI_NOMI` va repo nomini o'zingizniki bilan almashtiring.

## 3-qadam: Vercel'ga deploy qilish

1. https://vercel.com ga kiring, GitHub orqali ro'yxatdan o'ting (agar yo'q bo'lsa)
2. **"Add New" → "Project"** tugmasini bosing
3. GitHub repongizni tanlang (`portfolio-app`) va **"Import"** bosing
4. **"Environment Variables"** bo'limini oching va quyidagilarni qo'shing:

| Nomi | Qiymati |
|---|---|
| `AUTH_SECRET` | Terminalda `openssl rand -base64 32` buyrug'i bilan generatsiya qiling |
| `ADMIN_EMAIL` | O'zingizning admin emailingiz |
| `ADMIN_PASSWORD` | Kuchli parol (faqat birinchi seed uchun kerak) |
| `TURSO_DATABASE_URL` | 1-qadamda olingan `libsql://...` manzil |
| `TURSO_AUTH_TOKEN` | 1-qadamda olingan token |
| `NEXT_PUBLIC_SITE_URL` | Deploy'dan keyin Vercel beradigan domen, masalan `https://portfolio-app.vercel.app` |

5. **"Deploy"** tugmasini bosing — 1-2 daqiqada tayyor bo'ladi
6. Deploy tugagach, Vercel sizga **bitta link** beradi (masalan `https://portfolio-app-xyz.vercel.app`) — shu link orqali istalgan joydan kirish mumkin

### Ma'lumotlar bazasini production'da to'ldirish (bir martalik)

Deploy qilingandan so'ng, Turso bazasi bo'sh bo'ladi — jadvallarni yaratish va admin hisobini o'rnatish kerak. Buni **lokal kompyuteringizdan**, production Turso ma'lumotlari bilan bajarasiz:

```bash
# .env faylida TURSO_DATABASE_URL va TURSO_AUTH_TOKEN ni production qiymatlariga vaqtincha o'zgartiring, so'ng:
npm run db:generate
npm run db:migrate
npm run db:seed
```

Bu buyruqlar Turso bazangizda jadvallarni yaratadi va admin hisobingizni o'rnatadi. Shundan so'ng saytingiz to'liq ishga tushadi.

### Domen ulash (ixtiyoriy)

Agar o'zingizning domeningiz bo'lsa (masalan `muhammad.uz`): Vercel loyihasida **Settings → Domains** bo'limidan domeningizni qo'shing va DNS sozlamalarini Vercel ko'rsatgandek o'zgartiring. Bu bepul va bir necha daqiqa vaqt oladi.

---

## Lokal development

```bash
npm install
cp .env.example .env
```

`.env` faylida `AUTH_SECRET` ni to'ldiring (`openssl rand -base64 32`). Lokalda `TURSO_*` o'zgaruvchilarini bo'sh qoldirsangiz bo'ladi — avtomatik ravishda `./data/app.db` fayli ishlatiladi.

```bash
npm run setup   # DB yaratish + boshlang'ich ma'lumotlar
npm run dev
```

Sayt: http://localhost:3000
Admin: http://localhost:3000/admin/login (`.env` dagi `ADMIN_EMAIL` / `ADMIN_PASSWORD` bilan)

---

## Loyiha tuzilishi

```
src/
  app/
    page.tsx                 # Asosiy sahifa (DB'dan o'qiydi, barcha bo'limlar)
    layout.tsx               # Fontlar + SEO metadata + JSON-LD
    opengraph-image.tsx      # Avtomatik OG-image
    icon.tsx                 # Dinamik favicon
    robots.ts / sitemap.ts   # SEO fayllari
    not-found.tsx / error.tsx  # Xatolik sahifalari
    admin/                   # Admin panel (profil, loyihalar, ko'nikmalar,
                             #   xizmatlar, tajriba, fikrlar, xabarlar)
    api/                     # Barcha backend endpointlar
  components/
    Header, Hero, Marquee, Skills, Services, Experience,
    Projects, Testimonials, Footer, ContactForm, Reveal,
    AdminCrudPage, LogoutButton
  db/
    schema.ts                # Drizzle jadval sxemalari (7 jadval)
    index.ts                 # Turso/lokal DB connection
    seed.ts                  # Boshlang'ich ma'lumotlar
  lib/
    auth.ts                  # JWT sessiya, parol xeshlash
    crud.ts                  # Qayta ishlatiladigan CRUD API fabrikasi
  proxy.ts                   # /admin himoyasi (middleware)
```

## Muhim eslatmalar

- `.env` faylini hech qachon git'ga qo'shmang (allaqachon `.gitignore`'da)
- `AUTH_SECRET` va `TURSO_AUTH_TOKEN` — bular maxfiy, hech kimga bermang
- Birinchi kirishdan so'ng admin parolini almashtirish tavsiya etiladi
- Hozircha faqat bitta admin hisobi qo'llab-quvvatlanadi
