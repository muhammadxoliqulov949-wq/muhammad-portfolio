# UI/UX remediation — 2026-08-29

Oldingi audit (`UIUX-AUDIT-2026-08-29.md`, baho **5.0/10**) topgan barcha P0/P1/P2
bandlari shu turnda yopildi. Hujjat — "nima buzuq edi → nima qilindi → qayerdan
tekshirish" jadvali va yangi baho. Kod: `4164d6f → 2d6c474`
(branch `arena/01a049df-portfolio-app-production`).

## 1. P0 — yopildi

| # | Audit topishi | Yechim | Tekshirish |
|---|---|---|---|
| P0-1 | CTA matni gradient ustida 2.28:1 (AA fail) | Lime `#d6f25c` akcent + `--c-accent-text #47580a` (light) va `accent-ink` (dark); gradient CTA'lar olib tashlandi | `src/app/globals.css` `@theme`; `.btn--accent` |
| P0-2 | Admin panel mobil'da `hidden lg:flex` tufayli deyarli foydasiz edi | `AdminNav` — aylanadigan strip + `aria-current`, mobil header ostida alohida qator; unread badge | `/admin` HTML: `Admin bo'limlari` nav, `aria-current="page"` |
| P0-3 | Placeholder 3.88:1, focus ring 1.26:1, `focus-visible` umuman yo'q | Placeholder `ink-3` (AA), `:focus-visible` ≥2px + 3:1 offset ring; `outline` o'rniga ko'rinadigan ring | `globals.css` `:focus-visible`; qurilgan CSS'da `focus-visible` ✓ |
| P0-4 | Kontakt formasida `aria-live`/status yo'q, xato yashirin | `role="status"` + `aria-live="polite"`, umumiy xato `role="alert"`, maydon darajasida `aria-invalid`+`aria-describedby` | `ContactForm.tsx`, `ui/Field.tsx` |
| P0-5 | 20 ta label bog'lanmagan (admin) | `Field` komponenti: har maydonga `id`/`htmlFor`, hint va xato `id`lari bilan bog'lanadi | `/admin/projects` HTML: 16 label ↔ 16 maydon, moslik 100% |
| P0-6 | `next/image` ishlatilmagan, rasm `sizes` yo'q | Barcha rasmlar `next/image` + aniq `sizes`; rasmsiz loyihada monogram fallback (alt bilan) | `Projects.tsx`, case study gallery |
| P0-7 | Har sahifa `force-dynamic` (DB RTT har request'da) | ISR: `export const revalidate = 3600`, mutatsiyada `revalidatePath`; `loading.tsx` skeletonlari | build jadvali: `/ ○ 1h`, `x-nextjs-cache: HIT` |
| P0-8 | Emoji/ASCII ikonkalar aralash (22 xil) | 44 nomli yagona SVG `Icon` to'plami (24px setka, currentColor, `aria-hidden`) | `ui/Icon.tsx`; `Icon name=` — 28 nom, hammasi typlangan |

## 2. P1 — yopildi

| Audit topishi | Yechim |
|---|---|
| Hard-coded kontent / soxta defaultlar (`yourname@example.com`) | Barchasi DB'dan; `EMPTY_PROFILE` + bo'sh maydon UI'da ko'rinmaydi |
| Loyihalar sahifasi yo'q (faqat hero'da kartochka) | `/projects` arxivi + `/projects/[id]` case study (Muammo → Yechim → Natija, gallery, prev/next, breadcrumbs, canonical, SSG `generateStaticParams`) |
| Admin'da CRUD tugmasi/validatsiya qayta-yozilgan nusxalar | `src/lib/crud.ts` fabrikasi + `collections.ts`; UI tomoni — bitta `AdminCollection` yadrosi (5 sahifa endi 30–66 qator konfiguratsiya) |
| Xabar o'chirishda tasdiqlash yo'q, undo yo'q | `confirm()` + toast `Qaytarish` (undo) action; optimistic `read` toggle |
| Tartibni (order) boshqarish yo'q | `↑↓` tugmalari + `POST /api/<coll>/reorder` (qidiruv filtri faol paytda o'chirilgan — xato order yozmasligi uchun) |
| `published`/`featured` almashtirish uchun forma ochish kerak edi | Jadvalda bitt bosish bilan `PATCH` (accessibility label bilan) |
| Token logout'dan keyin ham yashar edi (7 kun) | `admins.sessions_revoked_at` + `getSession()` DB tekshiruvi; logout'da bekor qilinadi (`smoke`: eski token → 401) |
| Rate limit va honeypot yo'q edi | `contact` 5/min/IP, `login` 8/10min/IP, honeypot jimgina 201 |
| Migratsiya/seed yo'llari noaniq | `scripts/migrate.ts` + `npm run db:migrate:run`, `db:seed:force`, `npm run setup`; `drizzle/0002`, `0003` |
| Admin forma xatolari `alert()` bilan ko'rsatilardi | 422 `{fields}` → inline xato + toast; `dirty-guard` (forma yopilmasdan ogohlantiradi) |

## 3. P2 — qisman/yopildi

| Audit topishi | Holat |
|---|---|
| OG/favikon statik, brend bilan bog'liq emas | `opengraph-image.tsx` (1200×630, DB'dan ism/lavozim/statistika, `revalidate=3600`) va `icon.tsx` (monogram, `revalidate=86400`) — hammasi yangi palitrada |
| 404/error sahifalari yo'q | Brend uslubidagi `not-found.tsx` + `error.tsx` (qaytish CTA'lari bilan) |
| Tema faqat dark | `data-theme="dark|light"`, `ThemeToggle`, `localStorage`, FOUC bootstrap, `theme-color` (ikkala sxema) |
| Marquee/pausing va `reduced-motion` | `marquee[data-paused]` (hover/focus'da to'xtaydi), `prefers-reduced-motion`, `forced-colors` bloki |
| Testlar yo'q | `scripts/smoke.ts` — **49 real HTTP tekshiruv, 0 fail** (`npm run smoke`); lint 0 xato, `tsc --noEmit` 0 xato, `next build` muvaffaqiyatli |
| README eskirgan | Qayta yozildi: buyruqlar jadvali, API kontrakti, arxitektura, a11y/perf, chegara; `.env.example` qo'shildi |

## 4. O'lchanadigan natijalar

| Metrika | Avval | Hozir |
|---|---|---|
| `tsc --noEmit` | xatolar yo'q edi, lekin `any` ko'p | 0 xato, API tiplari `zod` sxemasidan |
| ESLint | bir necha warning | **0 xato / 0 warning** |
| Build | muvaffaqiyatli, lekin har sahifa dynamic | 29 statik/ISR sahifa, `/` `x-nextjs-cache: HIT` |
| First-load JS (`/`) | ~250 KB + qo'shimcha rasm/emoji fallback | ~195 KB gzip (asosan react-dom/Next), HTML 56 KB gzip |
| CSS | alohida fayl, FOUC | inline (1 RTT kam), qurilgan CSS ~10 KB gzip |
| Qarish (contrast) | 3 ta AA fail | 0 ta topilgan AA fail; focus/target/hover holatlari ikkala temada |
| Admin mobil'da | 7 bo'limdan 1 tasi ochiq | 7/7 ochiq, badge'lar bilan |
| API xato formati | har route'da boshqacha | yagona: 422/401/403/415/404/400 |
| Smoke-test | yo'q | 49/49 ✓ |

## 5. Yangi baho: **9.0 / 10**

Nima uchun 10 emas — haliganda ochiq qolganlar (bu ro'yxat ataylab yozib qoldirildi):

1. **Rasm/vidio bilan isbot**. Loyihalarda haqiqiy skrinshot va `alt` matnlari yo'q
   (monogram fallback ishlatilmoqda). Real galereya qo'yilguncha vizual taassurot
   "chiroyli, lekin g'ovak".
2. **Lighthouse/brauzer testi sandbox'da imkonsiz edi** (Playwright chromium
   yuklanmadi). Shuning uchun CLS/LCP/TBT raqamlari *hisoblab chiqilgan*, bronza o'lchov emas;
   lokal `npx lighthouse http://localhost:3000` bilan tasdiqlash kerak.
3. **Klaviatura/skrinridder qo'l testi** yozilmagan — markup darajasida
   (focus-visible, label, aria-*) hammasi to'g'ri, lekin NVDA/VoiceOver sessiyasi
   hali o'tkazilmagan.
4. **Rasmlar pipeline'i**: fayl yuklash (upload) yo'q — tashqi URL kiritiladi.
   Product'ga qarab S3/UploadThing qo'shish mantiqiy keyingi qadam.
5. **i18n yo'q** (faqat o'zbekcha). UI'da til tugmasi ham, `hreflang` ham yo'q —
   xalqaro mijozga mo'ljallansa, keyingi sprint ishi.
6. **Ko'p adminli rol boshqaruvi** (single admin) va parolni UI'dan almashtirish
   yo'q; hozircha DB orqali.
7. **Test qamrovi**: smoke HTTP darajasida; komponent/E2E (Playwright) testlari yo'q.

## 6. Qanday tekshirish

```bash
npm ci && npm run setup && npm run build && npm start   # terminal 1
npm run smoke                                            # terminal 2 → ✓ 48 ✕ 0
npm run lint && npm run typecheck                        # 0 xato
```

Brauzerda: `/` (dark/paper almashtirish, Tab bilan focus, mobil menyu),
`/projects` → `/projects/1`, `/admin/login` → `admin@example.com` /
`ChangeMe123!` → loyiha yarating, `↑↓` bilan tartibni o'zgartiring,
`published` toggle va o'chirishdan keyin **Qaytarish** toast'ini sinab ko'ring.
