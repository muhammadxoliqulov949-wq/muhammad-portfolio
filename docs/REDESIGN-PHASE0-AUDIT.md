# PHASE 0 — Portfolio Audit & Redesign Foundation

**Date:** 2026-09-06
**Branch:** `arena/01a07900-muhammad-portfolio`
**Commit:** `062caddda293ccae04c004648ea93e514982cb0f`
**Scope:** Audit + planning ONLY. No redesign, no implementation, no `main` / Production changes.

> Legend used throughout: **VF** = VERIFIED FACT (read in code / observed directly), **OBS** = OBSERVATION (inferred from reading), **REC** = RECOMMENDATION, **UNK** = UNKNOWN / REQUIRES VALIDATION.

---

## 1. Executive Summary

The current portfolio is a **technically mature, content-honest, editorial dark-first site** with a strong engineering foundation: Next.js 16 App Router (React 19), a Drizzle + libSQL/Turso backend, a full admin CMS, i18n (uz/en/ru), and rigorous accessibility/performance discipline. It self-reports "9.3/10" and, on engineering grounds, that is broadly credible.

The **gap is visual and cinematic, not structural**. The site currently reads as a *clean bento-grid resume* — well-typeset, restrained, and trustworthy — but it is **not a premium motion experience**. Motion is almost entirely a single CSS scroll-driven fade (`.reveal`), a marquee, and one perspective tilt on the featured-project device. There is:

- **No "Build Core" component.** The concept does not exist anywhere in the codebase (no component, no canvas/WebGL, no scroll-synchronized sequence, no conceptual state machine). It is a *future* design idea, not a *current* asset to preserve.
- **No cinematic IELTS.mock reveal.** IELTS.mock is presented as a standard featured card (browser-frame + screenshot + text column). It is honest and well-built but generic in presentation.
- **No video, no canvas, no WebGL, no animation library.** This is both a weakness (no cinematic energy) and a strength (nothing to tear down; a clean, low-risk baseline).

**Bottom line:** the redesign does not need to *rescue* a fragile codebase; it needs to *add a motion/cinematic layer* on top of a solid, already-production-ready foundation. The main engineering risk is that the current architecture is built around **`force-dynamic` request rendering + a fixed one-hour data cache**, which is excellent for a CMS-driven resume but a poor fit for a scroll-synchronized cinematic sequence that wants long, GPU-composited, scroll-pinned sections.

---

## 2. Current Architecture

### 2.1 Stack (VF — from `package.json`, configs, imports)

| Concern | Finding |
|---|---|
| Framework | **Next.js 16.3.2**, App Router (`src/app`) |
| Runtime | **React 19.2.8**, `react-dom` 19.2.8 |
| Language | TypeScript 5 (`strict: true`, `moduleResolution: bundler`, `@/*` path alias) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`) + a 1,836-line `globals.css` with custom `@theme` tokens and BEM-style component classes |
| DB | **Drizzle ORM 0.45** + **@libsql/client** (SQLite file locally, Turso on Vercel) |
| Auth | **jose** (JWT), **bcryptjs**; custom session (`portfolio_admin_session` cookie), DB-based revocation |
| Validation | **zod v4** for all API input |
| Fonts | **@fontsource-variable**: Fraunces (full axes), Inter, JetBrains Mono |
| Images | **next/image** (AVIF/WebP), **sharp** 0.35 |
| Motion | **None** (no framer-motion / GSAP / Lenis / Three). Pure CSS + tiny hand-rolled JS |
| i18n | Custom `src/lib/i18n*` (uz/en/ru), cookie + `?lang`, 942-line `messages.ts` |
| Misc | `next-auth@beta` **present in deps but unused** (VF — no imports) → dead dependency |
| Tests | `scripts/smoke.ts` (54 HTTP checks), `lint`, `typecheck`, Lighthouse/perf scripts |

### 2.2 Routing & rendering (VF)

- `src/app/layout.tsx` — root layout; **`export const dynamic = "force-dynamic"`** (locale is a cookie → per-request render). Injects theme-bootstrap inline script + JSON-LD Person.
- `src/app/(site)/layout.tsx` — public shell (Header/Footer/MobileCTA), also `force-dynamic`.
- `src/app/(site)/page.tsx` — homepage; `force-dynamic`; composes 10 sections from DB.
- `src/app/(site)/projects/page.tsx` + `projects/[id]/page.tsx` — archive + case study.
- `src/app/admin/**` — CMS (login + 7 collections + messages + portrait).
- `src/app/api/**` — REST API via a single CRUD factory (`src/lib/crud.ts`).
- `src/proxy.ts` — edge middleware: locale resolution + admin JWT gate.

**Contradiction worth flagging (OBS):** `projects/[id]/page.tsx` declares `generateStaticParams()` **and** `dynamic = "force-dynamic"` + `dynamicParams = true`. With `force-dynamic`, the route renders per-request and `generateStaticParams` is effectively inert at runtime — the "SSG + ISR" intent documented in README is not actually in effect for this route. Same latent tension exists site-wide: README claims ISR/`revalidate=3600`, but `layout.tsx` and `page.tsx` both force dynamic rendering. The *data* layer is cached (`unstable_cache`, 1h), the *page render* is not.

### 2.3 Data / content (VF)

- Single source of truth: `src/lib/content.ts` → `readSiteData` (`unstable_cache`, `revalidate: 3600`, tag `portfolio-site-data`), wrapped in React `cache()`. 8 tables read in **parallel** via `Promise.all`.
- Content policy (enforced): **facts only** — no invented clients/numbers/testimonials. Empty testimonials table is intentional; missing sections render `null`.
- 9 tables: `admins`, `profile`, `projects`, `services`, `skills`, `experience`, `education`, `achievements`, `testimonials`, `messages`. Migrations `0000`–`0007`.

### 2.4 Component architecture (VF)

- **Server components** for all public sections: `Hero`, `About`, `Skills`, `Experience`, `Projects`, `Services`, `Education`, `Achievements`, `Approach`, `Contact`, `Footer`.
- **Client components** (lean, `"use client"`): `Header`, `Marquee`, `Rotator`, `MobileCTA`, `BackToTop`, `ContactForm`, `Toast`, `PortraitSlot`, `PortraitUpload`, admin components.
- **Reusable UI primitives**: `ui/Section` (`Section`, `SectionHead`, `MetaRow`), `ui/Card` (stretched-link hit area), `ui/Device` (browser frame), `ui/Icon` (single typed SVG set, 44 names), `ui/Field`, `ui/Skeleton`, `ui/Toast`, `ui/CopyButton`.
- **No duplicated components** — the admin CRUD was already deduplicated into `AdminCollection.tsx` + `lib/crud.ts` + `lib/collections.ts` (a genuine strength).

### 2.5 State management (VF)

- **No global state library.** Theme = `data-theme` attribute + `localStorage`; locale = cookie. Client interactivity is localized `useState`/`useEffect` inside the handful of client components.

### 2.6 Assets (VF)

- `public/media/`: 3 IELTS.mock screenshots (**1376×768**, 65–83 KB each, ~215 KB total), plus a `README.txt`. **No portrait file is committed** — the portrait is served from the DB via `/api/media/portrait` (confirmed live).
- No video files. No WebGL/Canvas assets. No sprite sheets.

### 2.7 Architecture to PRESERVE vs IMPROVE

**Preserve (strong, hard-won):**
- Content-as-data model + admin CMS + API factory (don't touch).
- Design-token system (`@theme` semantic tokens, dark-first + paper theme).
- Accessibility layer (skip-link, focus-visible, `prefers-reduced-motion`, forced-colors, contrast tokens).
- `content-visibility: auto` (`.u-cv`) perf strategy.
- i18n architecture.
- `Icon`/`Card`/`Device` primitives.

**Eventually improve (do NOT fix in Phase 0):**
- Resolve the `force-dynamic` vs ISR/SSG contradiction (decide a real strategy per route).
- Remove dead deps (`next-auth`) and dead CSS (`hero-process`, `hero-stats`, `skills-strip` — verified 0 usages).
- Replace the 1,836-line `globals.css` monolith with a more modular approach *when* motion is introduced.
- Image pipeline: screenshots are JPEG 1376×768 only; no AVIF source, no 2×/retina, no 16:9/4:5 variants.

---

## 3. Homepage Audit (section by section)

Order of sections as rendered (VF from `page.tsx`): Hero → About → Skills → Experience → Projects → Services → Education → Achievements → Approach → Contact (+ Header, Footer, MobileCTA).

| # | Section (id) | Purpose | Visual quality | UX / hierarchy | Motion | Verdict |
|---|---|---|---|---|---|---|
| 1 | **Hero** (`#home`) | Name, roles, bio, CTAs, socials, portrait/featured-product, meta row | Clean, strong type scale (Fraunces `display-xl` up to 6.1rem), tasteful grid backdrop + radial accent | Good hierarchy; 2–3 CTAs; social proof via meta (location/B2/study) | `.reveal` fade only; one static perspective tilt on `.hero-product` | **REFINE** (keep layout, upgrade entrance) |
| 2 | **About** (`#about`) | Story paragraphs + principles + strengths/interests chips | Plain but honest; long text block risks scan-fatigue | Paragraph-led, low visual rhythm; chips are flat | fade only | **REFINE** (more editorial layout) |
| 3 | **Skills** (`#skills`) | 6 grouped chip cards + note | Consistent but visually monotonous (6 near-identical cards) | Clear grouping, low hierarchy contrast | fade only | **REBUILD** (merge into "Capabilities") |
| 4 | **Experience** (`#experience`) | Timeline of 4 roles + "now: IELTS.mock" banner | Simple vertical timeline; metric chips work well | Good; banner effectively bridges to projects | fade only | **REFINE** (fold into About/Capabilities) |
| 5 | **Projects** (`#work`) | Featured IELTS.mock + archive link | Featured card (browser frame + text column) is competent but **generic** — reads as a portfolio card, not a product reveal | Good info density; demo/GitHub/features/impact all present | fade + hover scale (1.5%) | **REBUILD** (cinematic reveal target) |
| 6 | **Services** (`#services`) | 8 service cards in bento (1 wide + 7 thirds) | Consistent bento; first card "wide" gives hierarchy; price/delivery present | Dense — 8 cards is a lot of repeated structure | fade only | **REFINE** (become "Capabilities/Services") |
| 7 | **Education** (`#education`) | 2 institution cards | Fine; low-stakes | Clear | fade only | **PRESERVE** (content) / fold visually |
| 8 | **Achievements** (`#achievements`) | Grouped list (cert/academic/sport) | Deliberately un-flashy (owner directive) | Clean grouped lists | fade only | **PRESERVE** (restraint is intentional) |
| 9 | **Approach** (`#approach`) | Workflow steps + goals (marked as plans, not results) | Good; numbered steps + goal card | Strong, on-brand honesty | fade only | **PRESERVE** (identity-defining honesty) |
| 10 | **Contact** (`#contact`) | Channels + working form (writes to DB) | Solid; form in card, channels list | Excellent conversion focus | fade only | **PRESERVE** |
| — | **Header** | Fixed glass pill nav, lang/theme, mobile sheet | Premium, well-executed | Strong; active-section tracking via IntersectionObserver | subtle; scroll listener (rAF-throttled) | **PRESERVE** |
| — | **Footer** | Name + nav + socials + back-to-top | Clean | Standard | none | **PRESERVE** |
| — | **MobileCTA** | Sticky bottom CTA (mobile only) | Good | Good (hides at contact) | slide on scroll threshold | **PRESERVE** |

**Critical structural observation (OBS):** the homepage currently has **10 content sections**. This is a *resume* density, not a *premium portfolio* density. Every section uses the identical `SectionHead` + `reveal` pattern, which produces a **flat, repetitive visual rhythm** — good for information, weak for memorability. The redesign's single biggest lever is **section consolidation and pacing**, not more decoration.

**Typography (VF):** Fraunces (display, full SOFT/WONK axes) + Inter (body) + JetBrains Mono (labels). Fluid scale from `text-micro` (0.6875rem) to `display-xl` (clamp to 6.1rem). Sound and distinctive.

**Spacing (VF):** `--section-y: clamp(4.75rem, 2.6rem + 8vw, 9.75rem)` — generous. `--gutter` fluid. `--container: 80rem`. Consistent.

**Responsiveness (OBS, static analysis only — no browser run):** fluid type + clamp, grid collapses at `48rem`/`64rem`, hero photo `max-width:20rem` on `<30rem`, sticky header sheet for mobile. Looks disciplined; **no real-device verification was possible in this sandbox** (UNK).

---

## 4. Build Core Audit

**HEADLINE FINDING — VF: There is no "Build Core" in the codebase.**

A full-text search across `src/` for `build core` / `build-core` / `buildcore` / `canvas` / `webgl` / `three` / `framer` / `gsap` / `lenis` / `useScroll` returns **zero relevant hits**. There is:

- No dedicated component, no SVG/CSS/CSS-3D "core" construction, no layered scene.
- No canvas or WebGL context anywhere.
- No scroll-synchronized sequence (no `useScroll`, no `animation-timeline: scroll()` — the only scroll-driven mechanism is `animation-timeline: view()` for the generic `.reveal` fade).
- No state machine for "Arrival → Prototype → Code Review → Validated Product → Deployment → IELTS.mock Reveal → Cinematic Exit".

**What DOES exist (the closest current analogues, VF):**

1. **`.hero-product`** — the featured IELTS.mock shown in a `Device` browser frame with a static CSS 3D transform `perspective(1200px) rotateY(-6deg) rotateX(2deg)` (neutralized < 64rem and under `prefers-reduced-motion`).
2. **`.hero-process` / `.hero-stats` CSS rules** — **dead code** (0 component usages). They appear to be remnants of an earlier "hero with 3 workflow panels + stats" design referenced in the README, since removed/refactored into the `Approach` section. This is evidence the *conceptual seed* of a "build/process" idea existed but was **flattened** during prior remediation phases.
3. The `Approach` section's numbered workflow steps (in DB `profile.workflow`): *"Talabni qog'ozga tushiraman → AI bilan tez prototip → har qatorni o'qib chiqaman → buzilganini topib tuzataman → brauzer/telefonda sinayman → Vercel'ga chiqaraman"* — this is the **authentic, factual version** of the "build process" narrative.

**Implications for the redesign:**

- The "Build Core" and its conceptual states are a **new build**, not a preservation target. Nothing existing needs to be protected here except the *narrative truth* of Muhammad's real workflow (which lives in `profile.workflow` and must remain factually accurate).
- The build-core states listed in the brief (Arrival, Prototype, Code Review, Validated Product, Deployment, IELTS.mock Reveal, Cinematic Exit) map **remarkably well** onto Muhammad's real, self-described workflow. This is the strongest opportunity in the whole redesign: a cinematic sequence that is *also literally true* to how he works ("AI bilan prototip → qatorni o'qib chiqaman → test → deploy"), rather than a fabricated agency process.
- Technically, introducing a scroll-pinned, layer-rich, possibly Canvas/WebGL sequence is the **single largest new engineering surface** and the main source of redesign risk (see Risk Map).

**Geometry / materials / lighting / depth:** none currently (UNK for future — no decisions made).

---

## 5. IELTS.mock Audit

**Current presentation (VF):**
- **Homepage**: featured card in `#work` — `Device` browser frame, `next/image` cover (`/media/ielts-mock-home.jpg`), "Asosiy loyiha" chip, title, description, impact callout, 6 feature checks, tech chips, Demo + GitHub buttons. Card links to `/projects/4`.
- **Case study page** (`/projects/4`): breadcrumbs → header (year/role/status chip, `display-l` title, description, impact banner, Demo/GitHub) → cover in device frame (16:9) → Problem/Solution/Outcome blocks → gallery (2 images, 16:10) → features list → tech chips → similar-project CTA → prev/next nav.

**Assets (VF):** 3 JPEGs, all **1376×768** (~1.79:1 ≈ 16:9), 65–83 KB each. These are **full-browser screenshots** (top-anchored `object-cover object-top`).

**Assessment:**

| Dimension | Finding | Verdict |
|---|---|---|
| Screenshot quality | 1376×768 is adequate for a 1× card but **undersized for a cinematic full-bleed reveal** (would blur at 2×/retina or large hero). No AVIF, no mobile crop. | **REPLACE/UPGRADE** |
| Aspect ratios | Single 16:9-ish ratio reused everywhere; no device-specific crops (hero vs gallery vs card all use one file). | **REFINE** |
| Loading | `next/image` + explicit `sizes` + `priority` on featured cover = correct; no preload of the gallery. | **PRESERVE approach** |
| Reveal sequence | None — instant static card. | **REBUILD** (cinematic target) |
| Hierarchy | Good (impact + features + dual CTA) but identical to any generic portfolio card. | **REFINE within reveal** |
| Relationship to Build Core | None — the two are disconnected. The brief wants IELTS.mock to be the *climax of* the build sequence. | **REBUILD linkage** |
| Desktop vs mobile | Static, so safe — but a cinematic reveal needs a **dedicated mobile choreography** (see §7). | **PLAN** |
| Performance | 3 images ≈ 215 KB total; negligible today. A cinematic reveal (higher-res stills, possibly motion) will raise this meaningfully. | **PLAN budget** |

**To make IELTS.mock feel like a premium product case study (REC),** it needs: higher-resolution screenshots (≥2560×1440 source, downscaled via `next/image`), distinct crops (hero 16:9, "exam" 4:5 or 16:10, "plans" 16:10), a staged reveal sequence (device arrival → UI states → result/analysis → AI feedback), and a clear narrative connection to the build process. None of this exists yet; none of it is blocked by current code.

---

## 6. Motion System Audit

**Complete inventory of current motion (VF):**

| Animation | Trigger | Duration / easing | Scroll-dep. | Tech | GPU/CPU | Category |
|---|---|---|---|---|---|---|
| `.reveal` fade+translateY(18px) | enters viewport | `linear` across `view()` range `entry 2%→32%` | **Yes** (scroll-driven) | CSS `animation-timeline: view()` | GPU (opacity/transform) | A — narrative (entrance) |
| `.marquee` | continuous (auto) | `38–40s linear infinite`; pause on hover/focus | No | CSS keyframes | GPU (transform) | C — decorative |
| `pulse-soft` | continuous | 2.6s ease-in-out | No | CSS keyframes | GPU (opacity) | C — decorative (sparingly used) |
| `spin-slow` (`.spin`) | continuous | 0.9s linear | No | CSS keyframes | GPU | B — feedback (loading) |
| `.hero-photo` img hover scale 1.025 | hover | 0.8s ease | No | CSS transition | GPU | B — feedback |
| `.hero-product` 3D tilt | static (not animated) | — | No | CSS transform | GPU | C — decorative |
| Button hover/active press | hover/click | 0.14–0.2s | No | CSS transition | GPU | B — feedback |
| `Rotator` role cycle | JS interval | **3.2s**, opacity 500ms | No | `setInterval` + CSS opacity | minor CPU + repaint | C — decorative |
| Header solid-on-scroll | scroll | rAF-throttled | **Yes** (threshold 12px) | JS `scroll` listener + rAF | minor CPU (throttled) | B — feedback |
| MobileCTA slide | scroll threshold 420px | 300ms transform | **Yes** (threshold) | JS `scroll` listener | minor CPU | B — feedback |
| Theme/color transitions | theme switch | 0.4s background/color | No | CSS transition | GPU | B — feedback |
| `link-underline` | hover/focus | 0.35s | No | CSS | GPU | B — feedback |

**Findings (OBS/REC):**

- **Motion is 90% Category B (feedback) + C (decorative), ~10% A (narrative).** The only "narrative" motion is the entrance fade, which is identical for every section and therefore carries **no narrative meaning** — it's really decorative pacing, not storytelling.
- **No competing animations, no layout-triggering animation, no expensive filters/blur loops, no continuous DOM writes.** This is disciplined and should be *preserved as a baseline*, but it is also why the site feels static.
- **Scroll listeners** are limited to 2 (Header, MobileCTA), both threshold-gated and passive; Header is rAF-throttled. Low risk.
- **`animation-timeline: view()`** is a progressive-enhancement choice: content is fully visible without JS/CSS support (good). But it has **no synchronized multi-element choreography** — you cannot drive a pinned "build core" sequence with `view()` alone; that will need scroll progress (JS) or `animation-timeline: scroll()` + sticky positioning.
- **`prefers-reduced-motion`** is handled globally and correctly (nukes durations to 0.01ms, un-hides `.reveal`, stops marquee). The `Rotator` also respects it in JS. This is a **genuine production-ready path** that the cinematic redesign must preserve.

**Recommendation for the future motion mix:** shift the balance decisively toward **Category A (narrative)** — one or two signature scroll-driven sequences (Build Core → IELTS.mock reveal) with high intent — while keeping Category B feedback crisp and *cutting* most Category C (marquee/pulse/rotate are currently "motion for motion's sake"). Premium work reads as **fewer, larger, purposeful moments**, not more small animations.

---

## 7. Responsive / Mobile Audit

**Constraints:** no browser/device runtime was available in this sandbox (no `node_modules`, no Playwright). All findings below are **static analysis (OBS)**; real-viewport verification is **UNK / REQUIRES VALIDATION**.

Representative widths mapped against breakpoints in CSS (`30rem`/`40rem`/`47.99rem`/`48rem`/`63.99rem`/`64rem`/`80rem`):

| Width | Breakpoint | Current behavior (static) | Notes |
|---|---|---|---|
| 375px | `<30rem`/`<48rem` | Hero actions full-width; photo capped 20rem; bento → 1 col; hero-product tilt off; sticky header sheet menu | Touch targets ≥44px (verified in CSS); MobileCTA appears |
| 430px | `<48rem` | Same 1-col collapse | Fine |
| 768px | `≥48rem` | bento → 2 col; skills-board → 2 col; timeline unchanged | Mid-tablet OK |
| 1024px | `≥64rem` | Desktop nav shows; bento → 12-col; hero 2-col; product tilt on | Transition point |
| 1440px+ | `≥80rem` | skills-board → 3 col; full container | Good |

**Specific observations:**

- **Section heights / scroll length:** with 10 sections at `--section-y` up to 9.75rem padding each, **mobile scroll length is very long** (~10–12 viewport-lengths). A cinematic redesign that *adds* pinned/scroll sequences on mobile risks making this worse. **Dedicated mobile choreography is required**, not optional.
- **Navigation:** the fixed glass pill + sheet menu is genuinely good and should survive. Active-section tracking (IntersectionObserver) works with anchor-based sections.
- **Touch targets:** 44px buttons, 44px icon-btns, 48px sheet links — correct (VF).
- **Overflow:** `overflow-x: clip` + `max-width:100%` on html/body guards horizontal scroll (VF); hero 3D tilt is neutralized < 64rem (VF).
- **Where a dedicated mobile choreography will be REQUIRED (REC):** Build Core sequence (pin/parallax is heavy on mobile), IELTS.mock cinematic reveal (full-bleed stills + stagger), any hero entrance, and the marquee (already wraps to static list under reduced-motion — a good pattern to reuse).
- **Layout stability:** portrait and featured image both use `aspect-ratio` + `fill` → no CLS from images (VF pattern); fonts are variable w/ unicode-range but **not** `font-display` tuned beyond default (OBS — potential FOUT, minor).

---

## 8. Performance Audit

**Measurable evidence is limited** — no build was run (no deps installed) and Lighthouse was not executed in this sandbox. Historical baselines exist in `docs/PERFORMANCE-BASELINE.md` (Phase 3A, production request observations). I treat those as **prior measurements, not re-verified here**.

**Documented prior baselines (OBS, from repo docs):**
- First-load JS ≈ 195 KB gzip (mostly React/Next).
- Compressed HTML ≈ 56 KB gzip.
- CSS ≈ 10–15 KB gzip.
- Fonts advertised for preload ≈ 699 KB (mitigated by Fontsource unicode-range).
- Median TTFB 7.89 s from a specific audit region (cold-start / region-bound → flagged as a concern, not a code defect).

**Static bottleneck analysis (OBS/REC):**

| Area | Finding | Severity |
|---|---|---|
| JS bundle | Small, framework-dominated; no animation lib yet. **A cinematic layer will be the new main JS cost.** | LOW today → MEDIUM after motion |
| Rendering | `force-dynamic` on layout + homepage = **no static/ISR HTML** for public pages despite the data cache. Repeated server render per request. | MEDIUM (SEO/scale) |
| Images | 3 JPEGs ~215 KB, served through `next/image` (AVIF/WebP). Good. Higher-res reveal assets will raise this. | LOW today → MEDIUM |
| Video | None. If the "cinematic" direction uses video, bandwidth becomes the #1 new risk. | N/A now → HIGH if adopted |
| Fonts | 3 variable families; Fraunces full-axis is heavier than necessary (SOFT/WONK kept intentionally for identity). | LOW–MEDIUM |
| Canvas/WebGL | None. | N/A now → HIGH if adopted |
| Animation loops | Only 1 `setInterval` (Rotator, 3.2s) + rAF in header scroll. Clean. | LOW |
| Event listeners | Scroll ×2 (passive, threshold-gated), IntersectionObserver ×2, click/keydown in header sheet. Clean. | LOW |
| DOM complexity | 10 sections, bento grids; `.u-cv` `content-visibility` on heavy sections. Reasonable. | LOW |
| Lazy loading | `next/image` default lazy (below fold); `priority` on LCP image. Correct. | LOW |
| Code splitting | App Router automatic route splitting; admin routes separate. Client islands are small. | GOOD |
| Preloading | Fonts preloaded (prior doc); no image/video preload for a future reveal. | UNK |
| Dead weight | `next-auth` unused dep; dead CSS blocks (`hero-process`, `hero-stats`, `skills-strip`). | LOW (cleanup) |

**The central performance question for the redesign (REC):** a cinematic scroll experience and the current `force-dynamic` CMS architecture pull in **opposite directions**. The redesign must decide — likely per-route: keep the CMS-driven sections request-rendered, but make the cinematic homepage (or its motion shell) static/ISR with a client-side hydration boundary, so the pinned sequences are not re-rendered server-side every visit.

---

## 9. Accessibility Audit

The existing site is **unusually strong** on a11y. Verified in code (VF):

- **Semantic structure**: `<header>/<main>/<footer>`, `<nav aria-label>`, `<article>` on case study, real `<h1>`→`<h2>`→`<h3>` hierarchy, `<ol>` for timelines/steps, `<ul>` for lists, `<dl>` for meta/stats.
- **Heading hierarchy**: `h1` (hero name) → `h2` (section titles via `SectionHead`) → `h3` (cards) — consistent.
- **Keyboard**: skip-link to `#main`; focus-visible ≥2px + 3:1 offset ring; `scroll-margin` so focus isn't hidden under the fixed header; Escape closes header sheet + "more" menu; focus trap-ish behavior (focus returns on close).
- **ARIA**: `aria-current="page"`, `aria-expanded`, `aria-controls`, `role="dialog"`/`aria-modal` on mobile sheet, `aria-live="polite"` + `role="alert"` on form, `aria-invalid` + `aria-describedby`, `aria-pressed` on marquee pause, `sr-only` duplicate-list patterns for marquee/rotator.
- **Contrast**: semantic tokens; prior audit reported 0 AA failures; `prefers-contrast: more` + `forced-colors: active` overrides present.
- **Targets**: 44px buttons/inputs/icons (verified).
- **Reduced motion**: global `prefers-reduced-motion: reduce` block + JS checks in `Rotator` + `hero-product` tilt neutralization + marquee static fallback. **This is a genuine, production-ready reduced-motion path.**

**Gaps / risks for the cinematic redesign (REC):**

- **Screen-reader narrative of a visual "build" sequence is undefined.** If the future Build Core is Canvas/WebGL/visual-only, its meaning must be mirrored in accessible text (aria-live or a visually-hidden transcript). This is the **#1 a11y risk** of the whole redesign.
- Rotator swaps roles with opacity but the `sr-only` version lists all roles — fine; a cinematic reveal must apply the same "one accessible reading" discipline.
- The global reduced-motion rule (durations → 0.01ms) will **kill** any JS-driven scroll timeline unless the future motion code **explicitly branches** on `prefers-reduced-motion` (CSS media query alone won't stop a `requestAnimationFrame` scroll loop). This must be a hard requirement in Phase 1's technical boundaries.
- No keyboard/AT runtime test has ever been run (prior doc admits this; UNK).

---

## 10. Averlo Reference Analysis

Source: `https://www.averlo.co/` (fetched 2026-09-06). Averlo is an "AI-native studio" marketing site. Its structure: hero with a **big editorial headline + auto-scrolling project marquee (repeated `hero-orbit-portrait` tiles)**, numbered service blocks (01–04) with large screenshots, a long "Work we are proud of" image grid, a "From first call to final launch" process strip, FAQs, and a strong final CTA ("Stop losing customers online").

**Principles extracted:**

| Principle | Detail |
|---|---|
| Editorial scale | One huge, confident headline; type does the heavy lifting |
| Image-led work showcase | Full-bleed project screenshots dominate; text is secondary |
| Continuous motion as texture | Marquee/orbit rows give constant low-cost motion (not scroll-jacked) |
| Numbered, systematic sections | `01/02/03` indexing creates rhythm and "process" trust |
| Generous whitespace | Sections breathe; few elements per screen |
| Single clear CTA at the end | One primary ask, high contrast |
| Restraint in color | Near-monochrome + one accent |

**Worth adapting (REC):**

1. **Editorial headline scale** — Muhammad's hero currently has a strong name treatment; it can go *larger* and *more editorial* without copying Averlo.
2. **Image-led, text-secondary work presentation** — especially for IELTS.mock: let the product screenshots lead.
3. **Numbered section system** — Muhammad already has this (`01`–`09` via `SectionHead.index`); it can be *amplified* (bigger ghost numerals already exist in `.section-head__index`).
4. **Continuous, low-cost "texture" motion** (marquee-style) as a *thin* layer — but Muhammad's should feel like a *dev/terminal/AI* texture, not an agency asset reel.
5. **Fewer, larger sections; strong final CTA** — aligns directly with the "consolidate 10 → ~8 sections" recommendation.

**Not appropriate (would weaken Muhammad's identity):**

1. **The "AI-native studio selling to startups" voice** — Muhammad's authentic voice is "student who builds with AI, honestly." Averlo's aggressive conversion copy ("Stop losing customers") would ring false against his content policy.
2. **A 9-client work grid** — Muhammad has **one** real public project (IELTS.mock). Any "full portfolio wall" is impossible and would violate the facts-only policy.
3. **Averlo's literal visual style** (orbit tiles, specific screenshots, "Est. 2022" studio framing) — copying this turns the site into a clone.
4. **Agency service taxonomy** (Web Design / SEO / Paid Ads) — Muhammad's services are developer services; keep his own.
5. **Assumed client logos / social proof** — he has none and (correctly) refuses to fabricate them.

---

## 11. Preservation Map

| Current Element | Decision | Reason | Risk | Future Action |
|---|---|---|---|---|
| Content-as-data + admin CMS + API factory | **PRESERVE** | Hard-won, fully working, identity-critical | Low | Leave untouched; add any new fields via migration |
| Design-token system (`@theme` + semantic tokens) | **PRESERVE** | Foundation for any restyle | Low | Extend tokens, don't replace |
| Accessibility layer (skip-link, focus, reduced-motion, forced-colors) | **PRESERVE** | Production-ready; non-negotiable | Low | Make it a hard gate for new motion |
| `content-visibility` (`.u-cv`) perf strategy | **PRESERVE** | Effective, low-cost | Low | Reapply to new long sections |
| i18n (uz/en/ru, cookie+param) | **PRESERVE** | Works; content is multilingual | Low | Keep; new UI strings need 3 locales |
| `Icon` / `Card` / `Device` / `Field` primitives | **PRESERVE** | Clean, deduplicated | Low | Reuse in new sections |
| Header (glass pill nav, active tracking, sheet) | **PRESERVE** | Excellent, on-brand | Low | Minor polish only |
| Footer + MobileCTA + BackToTop | **PRESERVE** | Solid | Low | Keep |
| Contact section + working form | **PRESERVE** | Only real conversion point | Low | Keep; may re-style |
| Approach section (honesty/workflow/goals) | **PRESERVE** | Identity-defining honesty | Medium | Keep; its workflow text feeds Build Core |
| Achievements section | **PRESERVE** | Owner-directed restraint | Low | Keep as-is |
| Hero (name/roles/bio/CTA structure) | **REFINE** | Good bones, lacks entrance energy | Medium | Bigger editorial type + staged entrance |
| About section | **REFINE** | Dense text, low rhythm | Medium | Editorial two-column layout |
| Experience timeline | **REFINE** | Works; could fold into About/Capabilities | Low | Condense or merge |
| Skills (6 chip cards) | **REBUILD** | Monotonous; low hierarchy | Medium | Merge into "Capabilities" |
| Services (8-card bento) | **REFINE** | Solid but dense | Medium | Become "Capabilities/Services", fewer visual repeats |
| Education | **PRESERVE** | Factual, low-stakes | Low | Fold visually into About |
| **Projects / IELTS.mock featured card** | **REBUILD** | Generic card; must become cinematic climax | High | Cinematic reveal, richer assets |
| Case study page (`/projects/[id]`) | **REFINE** | Good structure | Low | Higher-res assets + lighter motion |
| `.reveal` scroll-fade system | **REFINE** | Safe but meaningless per-section | Low | Replace with fewer, intentional narrative moments |
| Marquee / Rotator / pulse / spin | **REBUILD/REDUCE** | Decorative; no narrative purpose | Low | Cut or repurpose as branded texture |
| `.hero-product` 3D tilt | **REFINE** | Current sole "depth" effect | Low | Evolve into reveal sequence |
| **Dead CSS** (`hero-process`, `hero-stats`, `skills-strip`) | **REMOVE** | 0 usages (VF) | Low | Cleanup during redesign |
| **Dead dep** `next-auth` | **REMOVE** | Unused (VF) | Low | Cleanup |
| `force-dynamic` vs ISR/SSG contradiction | **REBUILD (strategy)** | Confusing, undermines scale | Medium | Decide per-route rendering in Phase 1 |
| Fonts (3 variable families) | **PRESERVE** | Identity | Medium | Possibly trim Fraunces axes |
| Image pipeline (single 1376×768 JPEGs) | **REBUILD** | Undersized for cinematic | Medium | Higher-res + crop variants |

---

## 12. Redesign Risk Map

| Risk | Rating | Mitigation |
|---|---|---|
| Visual overdesign | **HIGH** | Lock a motion budget in Phase 1; 2–3 signature moments max; review against "premium restraint" bar |
| Excessive animation | **HIGH** | Category-A-first rule (§6); cap simultaneous animations; global reduced-motion gate |
| Poor mobile performance | **HIGH** | Dedicated mobile choreography; disable pin/parallax < 48rem; test on low-end device |
| Hydration issues | **MEDIUM** | Keep cinematic shell as client boundary over static/ISR content; avoid re-render churn |
| Scroll synchronization | **HIGH** | Prefer CSS scroll-timeline where possible; rAF + transform-only; no layout writes in scroll handler |
| Video bandwidth | **HIGH** (if adopted) | Prefer high-res stills + GPU compositing over video; lazy + preload budget if video is chosen |
| Canvas/WebGL complexity | **HIGH** (if adopted) | Consider DOM/SVG/CSS-3D first; Canvas only if required; DPR-capped; fallback for no-WebGL |
| Accessibility | **HIGH** | Transcript/`aria-live` mirror of any visual sequence; keyboard parity; reduced-motion branch in JS |
| Reduced-motion | **HIGH** | Explicit JS branch — CSS-only won't stop rAF loops; verify a static equivalent |
| SEO | **MEDIUM** | Preserve semantic HTML + headings + JSON-LD; keep content in markup (not canvas text) |
| Maintainability | **MEDIUM** | Encapsulate motion in a small, typed module; avoid inline imperative spaghetti |
| Browser compatibility | **MEDIUM** | `animation-timeline` not universal → feature-detect with static fallback (already the pattern) |
| Deployment risk | **LOW** | No infra change needed; new assets via `next/image`/existing media route |

---

## 13. Recommended Target Architecture

**Evaluate the proposed flow** (INTRO → HERO → BUILD CORE → SELECTED PROJECTS → IELTS.MOCK REVEAL → CAPABILITIES → ABOUT → CONTACT):

The proposed structure is **sound and, crucially, maps onto Muhammad's real content**, but I recommend two modifications with evidence:

1. **Merge "SELECTED PROJECTS" into the IELTS.mock reveal.** There is exactly **one** published project (VF). A separate "Selected Projects" section would be empty or would duplicate IELTS.mock. Until more projects ship, the homepage should treat IELTS.mock as the single flagship reveal, and the `/projects` archive (which already handles "only one project" gracefully) remains the catch-all. *Evidence: `Projects.tsx` already renders a "more coming" honesty card when `rest.length === 0`.*

2. **Collapse Skills + Experience + Education into "Capabilities" and "About".** Ten sections produces a flat, resume-like rhythm (§3). The content policy (facts only) means Skills/Education/Achievements are *lists of facts*, which present better consolidated. Recommended final order:

```
INTRO (branded load texture — new, optional, reduced-motion-safe)
  ↓
HERO (Muhammad — name, roles, one strong CTA)
  ↓
BUILD CORE (cinematic build-process sequence, driven by real workflow text)
  ↓
IELTS.MOCK CINEMATIC REVEAL (the climax; product-as-hero)
  ↓
CAPABILITIES / SERVICES (developer services, condensed)
  ↓
ABOUT MUHAMMAD (story + skills + experience + education + achievements)
  ↓
CONTACT (unchanged conversion point)
```

This is **7 beats** instead of 10, with one clear climax. `Approach`'s workflow/goals text feeds the Build Core narrative; `Achievements` stays as a restrained sub-block (owner directive).

**Rendering recommendation (REC):** split by nature —
- **Motion shell (INTRO → BUILD CORE → IELTS.MOCK REVEAL):** static/ISR markup + a client-side motion boundary; no per-request server render for the cinematic spine.
- **Content sections (HERO static parts, CAPABILITIES, ABOUT, CONTACT):** keep the current request-rendered, data-cached approach (locale correctness).

This resolves the `force-dynamic` tension *and* gives the cinematic layer a fast, stable hydration base.

---

## 14. Phase 1 Readiness Plan (inputs required — DO NOT EXECUTE)

**What to preserve (locked):**
- CMS/data layer, design tokens, a11y layer, i18n, Icon/Card/Device primitives, Header/Footer/MobileCTA, Contact, Approach content, Achievements restraint, facts-only policy.

**What to redesign (approved direction):**
- Hero (editorial scale + staged entrance).
- Projects → cinematic IELTS.mock reveal.
- Skills/Services/Experience/Education consolidation into Capabilities + About.
- Motion system: shift to narrative-first; cut decorative loops.

**Visual references to influence (study, don't copy):**
- Averlo (editorial headline scale, image-led work, numbered rhythm, final CTA) — *principles only*.
- The provided cinematic reference video (high-energy transitions, product reveal pacing) — *pacing/energy only*.
- Muhammad's existing identity: Fraunces + Inter + JetBrains Mono, lime accent, dark-first + paper, hairline grid, bento.

**Recommended technical boundaries:**
- No scroll-hijacking (preserve native scroll; use sticky + scroll-timeline/rAF).
- Transform/opacity only for composited motion; no layout-triggering properties.
- CSS `animation-timeline` first, JS rAF only where scroll-timeline can't express the choreography.
- No mandatory video; prefer high-res stills + GPU compositing.
- No Canvas/WebGL unless DOM/SVG/CSS-3D is provably insufficient.
- Every motion layer must have a `prefers-reduced-motion` static equivalent (JS branch included).

**Recommended motion boundaries:**
- ≤3 signature narrative moments; each with a single focus.
- Cap simultaneous animated elements; disable pin/parallax on mobile.
- No infinite loops except a single branded "texture" (optional, pausable, reduced-motion-safe).

**Desktop/mobile differences:**
- Desktop: full cinematic sequence (build core + reveal).
- Mobile: shortened, non-pinned choreography; product stills with subtle stagger; no parallax; keep MobileCTA.

**Performance budget (draft, to be validated in Phase 1):**
- Keep first-load JS ≤ ~250 KB gzip; incremental motion cost ≤ ~30–40 KB.
- New image weight: reveal stills ≤ ~600 KB total (lazy), LCP image still `priority` + `fetchPriority`.
- TTFB: investigate the 7.89 s regional cold-start (region/DB), target ≤ 1 s warm.

**Unresolved decisions requiring approval (ask in Phase 1):**
1. Is video acceptable for the IELTS.mock reveal, or stills-only? (bandwidth/quality trade-off)
2. Canvas/WebGL vs DOM/CSS-3D for Build Core?
3. Confirm the 7-beat structure and the Skills/Services consolidation.
4. Confirm the "honesty" voice stays dominant over cinematic polish (no invented clients/metrics).
5. Light theme: how cinematic can the reveal be without breaking "paper" mode?
6. Whether the INTRO (load texture) is wanted at all, given its reduced-motion/perf cost.

---

## 15. Files inspected

`package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.env.example`, `.gitignore`, `README.md`, `drizzle.config.ts`, `eslint.config.mjs`,
`src/app/globals.css`, `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx`, `src/app/(site)/projects/page.tsx` (via tree), `src/app/(site)/projects/[id]/page.tsx`,
`src/components/{Hero,About,Skills,Experience,Projects,Services,Education,Achievements,Approach,Contact,ContactForm,Footer,Header,Marquee,Rotator,MobileCTA,BackToTop,PortraitSlot}.tsx`,
`src/components/ui/{Section,Card,Device,Icon,Field,Skeleton,Toast,CopyButton}.tsx`,
`src/lib/{content,schemas,crud,collections,auth,security,media,messages,i18n,i18n-core,set-locale,env}.ts`,
`src/db/{schema,index,local,seed}.ts`, `src/proxy.ts`, `drizzle/*.sql`, `scripts/{smoke,migrate,portrait,performance-baseline,run-lighthouse}.ts/.mjs`,
`docs/{PERFORMANCE-BASELINE,UIUX-REMEDIATION-2026-08-29}.md`, `public/media/*` (3 JPEGs + README).

## 16. Commands / tests executed

- `git status`, `git branch -a`, `git log --oneline`, `git rev-parse HEAD` — branch/commit verification.
- `find` / `wc -l` — file inventory and size profile.
- `grep -rin` for `build core`, `ielts`, `canvas/webgl/three/framer/gsap/lenis/useScroll`, `next-auth`, `<video`, dead-CSS class usage.
- Node JPEG header parser — measured the 3 IELTS.mock images (1376×768, 65–83 KB).
- `fetch_page` on `https://muhammad-portfolio-cyan.vercel.app/` (live production, read-only) and `https://www.averlo.co/` (reference).

**Not executed** (no dependencies installed; would be a build/install, not an audit): `npm ci`, `npm run build`, `npm run smoke`, `npm run lint`, `npm run typecheck`, Lighthouse. These are documented in-repo as previously passing (0 errors, 54/54 smoke) but were **not re-run in this session**.

## 17. Current git branch

`arena/01a07900-muhammad-portfolio`

## 18. Current commit SHA

`062caddda293ccae04c004648ea93e514982cb0f`

## 19. Confirmation — `main` not modified

**CONFIRMED.** No commits were created; no files were changed on `main`. Working tree was clean at start and only this new audit document was added (uncommitted, on `arena/01a07900-muhammad-portfolio`).

## 20. Confirmation — Production not modified

**CONFIRMED.** No deployment was created, no Vercel/Production action taken, no production homepage changed. The live site (`muhammad-portfolio-cyan.vercel.app`) was only **read** (HTTP GET) for audit purposes.

---

*End of Phase 0. Phase 1 (Creative Direction Lock) is NOT started.*
