# Portfolio — premium dizayn, to'liq backend, production-ready

Professional darajadagi portfolio sayti: editorial (dark-first) dizayn tizimi, SQLite/Turso backend, JWT bilan himoyalangan admin panel, case study sahifalari, SEO va Vercel'ga **bitta linkda** deploy. Kontentning barchasi DB'dan keladi — saytni kod yozmasdan boshqarish mumkin.

## Nima bor

| Soha | Holat |
|---|---|
| Dizayn | O'z dizayn tizimi: 3 ta variable shrift (Fraunces / Inter / JetBrains Mono), dark-first palitra + paper rejimi, bento-grid, `display-em` akcent, hairline to'r foni. AI-default "gradient mavim-tus" yo'q. |
| Bo'limlar | Hero (otdi + 3 ta ish oqimi paneli), About (hikoya + tamoyillar + faktlar), Skills (4 guruh + marquee), Experience (timeline + raqamlar), Projects (featured + ro'yxat), Services, Education, Achievements, Approach (ish uslubi + *kelgusi* rejalar), Contact, Footer, mobil sticky CTA |
| Case study | `/projects` arxivi + `/projects/[id]` — SSG, muammo → yechim → natija, galleriya, oldingi/keyingi loyiha, breadcrumbs, canonical |
| Admin | Profil + 7 kollekisiya (loyihalar, koʻnikmalar, xizmatlar, tajriba, taʼlim, yutuqlar, mijozlar fikri) — CRUD, ↑↓ tartib, `published` toggle, qidiruv, skeleton, toast + undo, saqlanmagan o'zgarishdan ogohlantirish; xabarlar (filtr, optimistic read, reply); JWT login |
| API | Har kollekisiya uchun `GET / POST / PUT / PATCH / DELETE / reorder` — bitta fabrika (`src/lib/crud.ts`) orqali, bir xil xato kontraktilari |
| SEO | Metadata + Open Graph, **DB'dan generatsiya qilinadigan** `opengraph-image` va `icon`, JSON-LD (Person), `robots.txt`, `sitemap.xml`, canonical, `sitemap` revalidate |
| Xavfsizlik | httpOnly + sameSite cookie, DB asosidagi sessiya bekor qilish, Origin/CSRF tekshiruvi, JSON Content-Type majburiyati, rate limit, honeypot, barcha kirish `zod` sxemasida, `javascript:`/`data:` URL'lar kesiladi |
| A11y | WCAG 2.2 AA: focus-visible (≥3:1), 44px targetlar, `aria-live` statuslar, skip-link, `aria-current`, kontrast AA, `prefers-reduced-motion`, forced-colors |
| Performance | Statik/ISR (`revalidate = 3600`), `inlineCss`, `next/image` + aniq `sizes`, parallell DB so'rovlari, `cache()` memoization, first-load JS ~195 KB gzip (asosan React), HTML ~56 KB gzip |
| Tekshiruv | `npm run lint`, `npm run typecheck`, `npm run build`, **`npm run smoke`** — 54 ta real HTTP tekshiruv |

## Buyruqlar

| Buyruq | Nima qiladi |
|---|---|
| `npm run setup` | Migratsiya + boshlang'ich kontent (birinchi ishga tushirishda) |
| `npm run dev` | Lokal server (`http://localhost:3000`) |
| `npm run build` / `npm start` | Production build va server |
| `npm run lint` / `npm run typecheck` | ESLint (0 xato) / `tsc --noEmit` |
| `npm run db:generate` | Drizzle sxemasidan SQL migratsiya fayli |
| `npm run db:migrate:run` | `drizzle/` dagi migratsiyalarni qo'llash |
| `npm run db:migrate` | `generate` + qo'llash birga |
| `npm run db:seed` / `db:seed:force` | Boshlang'ich kontent / mavjud kontentni almashtirish |
| `npm run smoke` | Ishlayotgan serverga qarshi API + sahifa tekshiruvlari |

## 1-qadam: konfiguratsiya

```bash
npm ci
cp .env.example .env
```

| O'zgaruvchi | Izoh |
|---|---|
| `AUTH_SECRET` | **Majburiy.** `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Faqat birinchi seed uchun — admin shu ma'lumot bilan `admins` jadvaliga bcrypt hash bo'lib yoziladi |
| `DATABASE_URL` | Bo'sh bo'lsa `./data/app.db` ishlatiladi |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Serverless (Vercel) uchun — Turso/libsql |
| `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap va OG URL'lar uchun to'liq domen |

## 2-qadam: ma'lumotlar bazasi

```bash
npm run setup        # = db:migrate + db:seed
npm run dev
```

Sayt: `http://localhost:3000` · Admin: `http://localhost:3000/admin/login`

Lokal DB fayl `.gitignore`'da (`/data/*.db`), shuning uchun yangi klon'da `npm run setup` shart.
`data/` papkasi bo'lmasa `src/db/local.ts` uni o'zi yaratadi — qo'lda `mkdir -p data` endi kerak emas.

## 3-qadam: Turso + Vercel

1. **Turso** (tekin): <https://turso.tech> → *Create Database* → *Connect* dan `libsql://...` URL va token oling (`turso db create portfolio-db`, `turso db tokens create portfolio-db`).
2. **GitHub**: repongizi push qiling (`git push -u origin main`).
3. **Vercel**: *Add New → Project* → repo → *Environment Variables* ustiga 1-jadvaldagi barcha qiymatlarni yozing → *Deploy*.
4. **Bazani to'ldirish** (bir martalik): `.env` ichidagi `TURSO_*` ni production qiymatlariga vaqtincha o'zgartiring, so'ng `npm run db:migrate && npm run db:seed`. Shundan keyin `NEXT_PUBLIC_SITE_URL` ni deploy domeniga qo'yishni unutmang.
5. **Domen** (ixtiyoriy): Vercel → *Settings → Domains*.

> Vercel'da `data/app.db` yozib bo'lmaydi (read-only FS) — production uchun Turso yoki boshqa libsql manzili kerak.

## Arxitektura

```
src/
  app/
    layout.tsx                # shriftlar, metadata, tema bootstrap, JSON-LD, skip-link
    loading.tsx               # global route skeleton
    error.tsx / not-found.tsx # brend uslubidagi xatolik sahifalari
    opengraph-image.tsx       # 1200×630 OG (DB'dan: ism, lavozim, statistika)
    icon.tsx                  # monogram favicon (DB'dan)
    robots.ts / sitemap.ts
    (site)/                   # ochiq sayt — Header/Footer shu guruhda
      page.tsx                # bosh sahifa, revalidate = 3600
      projects/page.tsx       # arxiv
      projects/[id]/page.tsx  # case study (generateStaticParams)
    admin/                    # panel (layout: ToastProvider + nav + unread badge)
      page.tsx                # profil (3 guruh, sticky save bar)
      projects|skills|services|experience|testimonials  # AdminCollection konfiguratsiyasi
      messages/page.tsx       # xabarlar
      login/page.tsx
    api/                      # backend
  components/
    Hero, Projects, Services, Experience, Toolbox, Testimonials, Contact, Footer,
    Header, Marquee, Rotator, MobileCTA, ThemeToggle, BackToTop
    AdminCollection.tsx       # admin CRUD yadrosi (forma + jadval + toast + undo)
    AdminNav.tsx, LogoutButton.tsx
    ui/  Icon · Section · Card · Field · Skeleton · Toast · CopyButton
  db/    schema.ts · index.ts · seed.ts
  lib/   content.ts (o'qish) · schemas.ts (zod) · crud.ts (API fabrikasi)
         collections.ts (API konfiguratsiyasi) · auth.ts · security.ts
  proxy.ts                    # /admin va /api/method'lar uchun edge himoyasi
```

### Portret rasmi

Sayt portret uchun **ikki manbani** qo'llab-quvvatlaydi; ikkalasi ham bo'lmasa hero'da monogram freymi chiqadi — buzuq yoki soxta rasm hech qachon ko'rsatilmaydi:

1. `public/media/portrait.jpg` — faylni shu nom bilan papkaga tashlash kifoya (`jpg/jpeg/png/webp/avif`). Sayt uni DB'ga tegmasdan avtomatik oladi.
2. **admin → Profil → «Portret URL»** — `/media/portrait.jpg` yoki to'liq `https://…` URL (ustuvorlik shu maydonda).

Qayerda ko'rinadi: hero'dagi portret freymi (4:5 kadrlash, `object-position: 50% 22%`, `priority` → LCP), sticky header avatari va **OG kartochkadagi** monogram kvadrati. Tavsiya etilgan o'lcham: 1000–1200 px tomon, 200–400 KB.

```bash
public/media/portrait.jpg        # ← fayl shu yerga tashlanadi
```

**Ma'lumot oqimi:** `DB → src/lib/content.ts (cache + Promise.all) → RSC (HTML)`. Admin'da yozuv → `src/lib/crud.ts` → `revalidatePath('/', 'layout')` va tegishli yo'llar → sayt 1 daqiqada yangilanadi (ISR). `getSiteData` bitta React `cache()` ichida — har bir request'da 6 ta so'rov parallell.

## API kontrakti

| Yo'l | Metod | Ruxsat | Izoh |
|---|---|---|---|
| `/api/<kollekisiya>` | `GET` | ochiq | `?all=1` faqat admin'da (aks holda `published` filtri bilan) |
| `/api/<kollekisiya>` | `POST` | admin | muvaffaqiyat → `201` + yozuv |
| `/api/<kollekisiya>/[id]` | `PUT` | admin | to'liq yangilash |
| `/api/<kollekisiya>/[id]` | `PATCH` | admin | qisman (faqat sxemadagi kalitlar) |
| `/api/<kollekisiya>/[id]` | `DELETE` | admin | `{ ok: true }` yoki `404` |
| `/api/<kollekisiya>/reorder` | `POST` | admin | `{ ids: [3,1,2] }` → `order = indeks` |
| `/api/profile` | `GET` / `PUT` | GET ochiq, PUT admin | singleton profil |
| `/api/contact` | `POST` | ochiq | `201`; honeypot ham `201`; 5 daq/IP → `429` |
| `/api/messages` | `GET` | admin | `?unread=1&limit=1..200` |
| `/api/messages/[id]` | `PATCH` / `DELETE` | admin | `{ read: true }` / o'chirish |
| `/api/auth/login` | `POST` | ochiq | 8 urinish / 10 daq / IP → `429` |
| `/api/auth/logout`, `/api/auth/me` | `POST`, `GET` | — | chiqish (token ham bekor qilinadi) / holat |

Xato kontraktilari: `422 { error, fields: { maydon: "xabar" } }` (forma inline ko'rsatadi), `401`, `403` (Origin), `415` (tana JSON emas), `404`, `400`.

## Dizayn tizimi

- **Tokenlar** (`src/app/globals.css` → `@theme`): `canvas / surface-1..3 / canvas-sunken`, `ink-1..3`, `line-1/2`, `accent` (lime), `accent-ink`, `accent-text` (light rejimdagi kontrast uchun), `success/danger`, `rounded-1..4`, `shadow-1..3`.
- **Tipografika**: `display-xl..text-micro` + `.display`, `.display-em`, `.label`, `.label-accent`, `.u-num` (mono).
- **Tema**: `data-theme="dark|light"`, tanlov `localStorage.theme` da, FOUC oldini oluvchi inline skript; `prefers-color-scheme` default.
- **Harakat**: faqat CSS (`@supports (animation-timeline: view())`) — JS scroll-hijacking yo'q; `prefers-reduced-motion` hur qilinadi.
- Komponentlar: `.btn` (`--accent | --ghost | --lg | --sm`), `.icon-btn`, `.card`, `.bento`, `.chip`, `.field`, `.timeline`, `.skeleton`.

## Sifat tekshiruvi

```bash
npm run lint && npm run typecheck && npm run build   # uchasi ham 0 xato
npm run build && npm start                            # boshqa terminalda
npm run smoke                                         # 54 tekshiruv (server kerak)
```

`scripts/smoke.ts` qamrovi: sahifa statuslari, bo'lim kontenti (ta'lim, telefon, yutuqlar, soxta testimonial yo'qligi), hero panellari, skip-link/JSON-LD/tema bootstrap, case study bo'limlari + demo/GitHub havolalari va canonical, OG/icon/robots/sitemap, `/api/education` va `/api/achievements`, `published` filtri, Origin/CSRF, anonim yozishlar, login/noto'g'ri parol, CRUD + 422 + reorder, profil PUT, kontakt + honeypot + rate limit, xabarlar read/unread/delete, logout'dan keyin token bekor qilinishi.

## Kontent siyosati (muhim)

Saytdagi har bir gap DB'dan keladi va **faqt haqiqat**: ixtiro qilingan kompaniya nomi, mijoz soni, daromad, sertifikat yoki mijoz fikri yozilmaydi. Shuning uchun:

- `testimonials` jadvali ataylab bo'sh — bo'sh bo'lsa, «Mijozlar fikri» bo'limi sahifada umuman ko'rinmaydi.
- Loyihalar soni 3 tadan kam bo'lsa, `/projects` arxividagi sarlavha ham shunga moslashadi va «ko'proq loyiha ishlab chiqilmoqda» kartochkasi chiqadi (soxta to'ldiruvchi emas).
- Raqam bo'lmagan joyda raqam yo'q: `impact`/`outcome` bo'sh bo'lsa, case study'da tegishli bo'lim chiqmaydi.
- Kelgusi rejalar `profile.goals` da saqlanadi va saytda **reja** sifatida («reja, natija emas» deb) ko'rsatiladi — bajarilgan ish kabi taqdim etilmaydi.
- Admin formalaridagi placeholder'lar namunaviy matn, DB'ga yozilmaydi.

## Ma'lumotlar bazasi

8 jadval: `admins` (+ `sessions_revoked_at`), `profile`, `projects`, `services`, `skills`, `experience`, `education`, `achievements`, `testimonials`, `messages`.

**Kontent ustunlari (migration 0004–0006):**

| Jadval | Ustunlar |
|---|---|
| `profile` | `phone`, `english_level`, `story` (About), `strengths`/`interests`/`workflow`/`goals` (`,` yoki yangi qator bilan ajratiladi), `principle_work`, `principle_delivery` |
| `projects` | `status` (kartada chip), `features` (case study'da checklist) — ustunlardan tashqari `problem`, `approach`, `outcome`, `impact`, `gallery`, `demo_url`, `github_url` |
| `skills` | `name`, `category` (saytda guruh sarlavhasi), `context`, `years` (maydon saqlanadi, saytda ko'rsatilmaydi) |
| `education` | `institution`, `credential`, `field`, `period`, `status`, `detail`, `current`, `order` |
| `achievements` | `title`, `issuer`, `kind` (`cert`/`academic`/`sport`), `year`, `detail`, `url` («Tekshirish» havolasi), `order` |

Migratsiyalar `drizzle/` da va `npm run db:generate` bilan qo'shiladi; `npx drizzle-kit migrate` o'rniga `npm run db:migrate:run` ishlatiladi (libsql bilan ishonchliroq).

## Muhim eslatmalar va chegara

- `.env` va `data/*.db` git'ga qo'shilmaydi; `.env.example` namunasi bor.
- **Yangi klon** birinchi urinishda ham ishlaydi: `src/db/local.ts` `data/` papkasini yaratadi (avval `SQLITE_CANTOPEN` — code 14 — bilan qulaydi va xato matni sababni aytmadi).
- Admin hisobi bitta; parolni almashtirish uchun `admins.password_hash` ni yangilang (masalan `npx tsx -e "..."`) va sessiyalar avtomatik bekor qilinadi (logout ham shu qiladi).
- Rasmlar tashqi URL (S3/IMGUR/CDN) bilan beriladi — `image`/`photoUrl` maydonlari shunga mo'ljallangan; fayl yuklash UI'da yo'q.
- Sayt kontenti 1 soatlik ISR cache'da; admin'da "Saytni ko'rish" tugmasi shu sababli eski ko'rinishi mumkin (hard refresh: `Ctrl/Cmd+Shift+R`).
- Ogohlantirish dialoglari `window.confirm` asosida (toast bilan birga) — murakkab modal holat mashinasi ataylab qo'shmagan.
