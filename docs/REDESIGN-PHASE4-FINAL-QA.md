# PHASE 4 — FINAL QA, ASSET READINESS & PREVIEW SIGN-OFF

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Start SHA:** `0bb81a2` (Phase 3H)
**`main`:** `062cadd` (untouched)

> Scope: final quality gate on the feature-complete redesigned homepage. No redesign, no new features, no merge, no production deployment.

---

## 1. Git state

Verified before any work: branch `arena/01a07900-muhammad-portfolio`, HEAD `0bb81a2`, `main` `062cadd`, working tree **clean** (no sandbox reset this time). Rollback point = `0bb81a2`. No history rewrite, no merge, no `main` touch.

## 2. Final viewport matrix

Extended matrix (14 widths), each with `scrollWidth ≤ clientWidth` **and** an element-right-edge scan (to defeat `overflow-x: clip` masking):

| Category | Widths | Result |
|---|---|---|
| Desktop | 1920, 1600, 1440, 1366, 1280 | ✅ no overflow, no clipping |
| Tablet | 1024, 834, 768 | ✅ no overflow |
| Mobile | 430, 414, 390, 375, 360, 320 | ✅ no overflow |

Typo readable, correct cinematic branch (pin ≥64rem), correct mobile/tablet simplification, stable screenshots, CTA behavior verified.

## 3. Cinematic QA

Desktop Hero → Build Core → Deployment → IELTS.mock reveal revalidated with slow/normal/fast/reverse/jump scroll and resize. Build Core state machine transitions correctly (arrival → prototype 0.48 → review 0.64 → validation 0.92 → deployment, then ProductTransition takes over). Pin-spacers add/remove cleanly; theme handoff verified (frame scale 0.42→1.0, `--theme-progress` 0→1, spine dark→light). Zero page errors during the full forward/reverse scroll. No motion changes needed.

## 4. Intro QA

First visit: overlay `aria-hidden` + `pointer-events:none` (never blocks). Repeat visit: `sessionStorage.__intro_seen === "1"` skips. Reload safe. Reduced-motion: suppressed. JS-disabled: overlay is `opacity:0` in CSS + hero is fully server-rendered (no blocked content). No layout shift, no focus trap, no hydration mismatch.

## 5. Reduced-motion QA

Full page under `prefers-reduced-motion: reduce`: no intro, no Build Core pin (0 pin-spacers), no ProductReveal morph, no spacers, no hidden/delayed content, complete editorial page (height 7398px). `.reveal` animation `none`. Release-quality.

## 6. Theme matrix

Default / manual light / manual dark × normal / reduced motion — all six combinations render correctly (`bodyBg` #f8f6f0 / #0a0c10, correct ink/border/form/button/nav/screenshot surfaces). User choice authoritative (`html[data-theme]`).

## 7. Locale matrix

uz / en / ru at 1440 / 768 / 375 / 320: correct headings, no locale-specific overflow, Russian long strings + long email wrap safely, no heading-level overflow. No locale feels like a broken secondary.

## 8. Accessibility

- Semantic: 1× `h1`, 1× `h2` per section, `main`/`nav` landmarks, semantic `ol/ul/dl`, real `<a href>`, no clickable divs.
- Focus: visible (2px outline, 3px offset, `--c-focus`); keyboard nav works; skip link present.
- Forms: 4 inputs with `label[for]`, `aria-invalid`/`aria-describedby`, `role=status`/`role=alert`.
- Images: 0 missing alt; decorative SVG `aria-hidden`; reduced-motion honored.
- **axe-core (wcag2a/aa):** 1 violation — `color-contrast` flags 3 `.cap-index__num` display numbers (opacity 0.22 over light bg, contrast 1.59). **Classification: MINOR / design-intentional.** These are `aria-hidden` decorative ghost numbers, redundant with the semantic `<ol>` ordering + `h3` titles; their faintness is the approved Phase 3F editorial design. No fix (would alter approved design).

## 9. ContactForm QA

Tested locally (writes to gitignored `data/app.db`, no external email): empty submit → 3 inline errors + focus to first invalid field; invalid email → email-only error ("Email manzili noto'g'ri"); valid submit → success state (form replaced, "again" button), row written to local DB. Honeypot + rate-limit + zod schema intact. Backend untouched.

## 10. Network / API

- `401 /api/auth/me` — **EXPECTED**: `PortraitSlot` checks admin session on mount; anonymous visitors get `{authenticated:false}` + 401 (correct REST semantics), no data leak, single lightweight request, no performance impact.
- No 404 / 500 / failed images / failed fonts / CORS issues.
- One benign `/?_rsc=… :: net::ERR_ABORTED` — a cancelled Next.js App Router RSC prefetch (superseded by the rendered HTML). **EXPECTED**, not a resource failure (all 6 sections present after settle).

## 11. Console

Only remaining console output: `[error] Failed to load resource: 401 (Unauthorized)` from the expected `/api/auth/me` probe. No React/hydration/GSAP/ScrollTrigger warnings, no runtime exceptions, no resource failures. **Classification: EXPECTED** (minor console noise).

## 12. Performance

`next start` baseline (1440): DCL 50ms, load 177ms, ~244KB JS, ~31KB images, 23 resources, 0 long tasks. **CLS 0.0022** (well under 0.1 threshold). No duplicate GSAP init, no layout thrash. No meaningful regression vs Phase 3G/3H baseline.

## 13. Layout stability

CLS 0.0022; stable image dimensions/aspect-ratios (next/image `fill` + ratio-based frames); fonts self-hosted; hero/cinematic/form stable. No significant post-load shift.

## 14. Browser coverage

**Tested: Chromium 149 (headless, real binary).** Firefox/WebKit/Safari tooling **not available** in this sandbox — not tested. Feature-risk notes: `color-mix(in oklab, …)` (Chrome 111+/FF 113+/Safari 16.2+), `clip-path: inset()` (universal), `animation-timeline: view()` (Chrome 115+; guarded by `@supports`, so non-supporting browsers render content fully visible — correct progressive enhancement). Pinned behavior is GSAP-driven (broadly supported).

## 15. Build / source validation

`npm run typecheck` ✅ · `npm run lint` ✅ · `npm run build` ✅ (clean). Source scan: no `console.log`/`debugger`/TODO/FIXME in client/component code (only CLI `seed.ts` logging); no localhost hardcoding in components; no benchmark/validation-only production code.

## 16. SEO

No regression: title, description, keywords, authors, Open Graph, Twitter card, robots (`index,follow`), canonical, `lang`, JSON-LD `Person` schema, single `h1` all present and correct. **Note:** `metadataBase`/canonical falls back to `http://localhost:3000` when `NEXT_PUBLIC_SITE_URL` is unset — a production config item (set that env var at deploy), not a redesign regression. Server-rendered content is crawlable (verified in raw HTML).

## 17. Security / privacy sanity

No secrets in client bundle; no admin-only data leaking (PortraitSlot renders nothing for guests); no unsafe HTML injection (React escaping + `safeHref`); auth is fail-closed in production (`getAuthSecret` throws on missing/short/known dev `AUTH_SECRET`); no debug endpoints exposed. Only `NEXT_PUBLIC_*` env reaches client. No destructive testing performed.

## 18. Temporary artifact audit

No redesign-specific placeholders/TODOs/debug styles/commented experiments. The old `.capabilities__*` block was fully replaced in 3F (no orphan CSS). Deferred (out of scope): unrelated dead CSS, `next-auth` cleanup, force-dynamic-vs-ISR, CMS refactor.

## 19. High-res asset readiness

Current assets (3 files, all 1376×768 = 16:9):

| Path | Role | Containers |
|---|---|---|
| `/media/ielts-mock-home.jpg` | `project.image` | ProductReveal full-bleed (`fill`, `sizes="(min-width:64rem) 80rem, 100vw"`) + case-gallery hero (`aspect-ratio:16/9`, `fill`) |
| `/media/ielts-mock-exam.jpg` | `project.gallery[0]` | case-gallery item (`aspect-ratio:16/10`, `fill`, `sizes="(min-width:640px) 50vw, 100vw"`) |
| `/media/ielts-mock-plans.jpg` | `project.gallery[1]` | case-gallery item (same) |

**Drop-in contract:** swap files at the same paths (or update `projects.image`/`projects.gallery` in CMS) at **2560×1440** (minimum) or **3840×2160** (preferred, both 16:9). Containers are ratio-based with `object-cover object-top` + `next/image`, so a swap requires **zero** component/layout/animation/CSS changes. *(Note: the Phase 3E doc's aspirational 6-screenshot list — Home/Listening/Reading/Writing/Speaking/Plans — exceeds the actual gallery, which renders exactly 3 frames: home + 2 gallery items. Listening/Reading/Writing/Speaking are `features` (capability list), not gallery items. The real drop-in set is 3 files.)*

## 20. Image quality classification

Current 1376×768 screenshots:
- **Technical release:** PASS (correct rendering, stable layout, no breakage).
- **Full-bleed reveal @1920 and @1440:** ACCEPTABLE TEMPORARY — resolution becomes the limiting factor at large viewports (1376px stretched to full-bleed), but framing/ratio are correct.
- **Final visual sign-off:** **BLOCKS** — the screenshots are the only item standing between the current state and a final "ship-quality" visual sign-off. No upscaling/AI-enhancement performed; no blur/filter masking.

## 21. Visual evidence

22 PNGs in `/home/user/validation/shots/`:
`4-01-desktop-1920`, `4-02-desktop-1440`, `4-03-hero`, `4-04-build-{arrival,prototype,review,validation}`, `4-09-product-frame`, `4-10-ielts-reveal-full`, `4-11-ieltsmock`, `4-12-capabilities`, `4-13-about`, `4-14-contact`, `4-15-tablet-1024`, `4-16-tablet-768`, `4-17-mobile-430`, `4-18-mobile-390`, `4-19-mobile-375`, `4-20-mobile-320`, `4-21-reduced-motion`, `4-22-manual-dark`, `4-23-manual-light`, `4-24-russian-mobile`.

All non-blank (verified byte-variety). Scroll-driven `.reveal` frozen to settled state for review. A desktop scroll recording was not produced (no screen-recording tooling in the sandbox).

## 22. Preview deployment

**Not created.** No Vercel credentials/project linkage in the sandbox (`gh` is GitHub-only; no `~/.vercel`, no `VERCEL_*` env). Documented limitation.

## 23. Blockers

**None.**

## 24. Majors / minors

- **MAJOR:** none.
- **MINOR:**
  1. axe `color-contrast` on 3 decorative `.cap-index__num` ghost numbers (design-intentional, `aria-hidden`).
  2. Console noise: 1× expected `401 /api/auth/me` + 1× benign RSC prefetch abort.
  3. `NEXT_PUBLIC_SITE_URL` must be set at deploy (else canonical/OG uses localhost).

## 25. Accepted limitations

1. Low-resolution IELTS.mock screenshots (1376×768) — block **final visual sign-off** only, not technical release; drop-in high-res swap is fully supported.
2. Chromium-only browser coverage (no Firefox/WebKit tooling).
3. No Preview deployment (no Vercel credentials).

## 26. Fixes made

**None** (no release-blocking defects found). The QA test submitted one message to the local gitignored dev DB (`data/app.db`) — not production, not committed.

## 27. Final acceptance decision

**B. READY EXCEPT FOR HIGH-RES ASSETS.**

Rationale (verified evidence): all 14 viewports clean; cinematic/reduced-motion/theme/locale matrices pass; a11y has zero serious/critical issues (one design-intentional minor); ContactForm validated end-to-end (local); console/network contain only expected items; performance stable (CLS 0.0022, ~244KB JS, no long tasks); build/lint/tsc clean; no secrets/debug artifacts. The **only** outstanding item for a final visual sign-off is swapping the 3 low-res IELTS.mock screenshots (1376×768) for 2560×1440/3840×2160 drop-ins — a zero-code change.

## 28. Production-readiness notes

- Technical release is unblocked; the high-res asset swap is a pure asset task (documented filenames/dimensions above).
- At deploy: set `AUTH_SECRET` (≥32 chars, non-dev) and `NEXT_PUBLIC_SITE_URL` (canonical/OG). DB on Turso via `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`, or local SQLite file.
- The redesign itself is complete and verified; no further code work is required for technical release.

## 29. Git evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **Start SHA:** `0bb81a2`
- **End SHA:** (this documentation commit)
- **`main`:** `062cadd` — untouched
- **Production:** untouched; **no merge**; **no deployment**; **no alias**.
