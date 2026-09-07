# PHASE 3E — IELTS.MOCK CASE STUDY & PRODUCT PRESENTATION

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Baseline docs:** Phase 0–2 + 3A/3B/3C/3C-R1/3D (all approved)

> Scope: complete the IELTS.mock product case-study that follows the Phase 3D cinematic reveal. Low-motion editorial. **NOT** Phase 3F.

> **Environment note (git):** the sandbox's `.git` was re-cloned between Phase 3D and 3E, so the prior commit objects (`e6a2576`…`2c5ad70`) are no longer present and the branch pointer was reset to `062cadd` (= `main`). All Phase 3A–3D **files were recovered intact** in the working tree and are re-committed together with Phase 3E below. No code was lost.

---

## 1. Case-study architecture

Single server component `IeltsMockFeature` (`id="work"`, `data-narrative="light"`) rendering a 7-beat editorial sequence:

1. **Product identity / overview** (`.case-hero`) — name, definition, status, demo/GitHub CTAs + impact pull-statement.
2. **Problem / purpose** (`.case-block`) — `project.problem`.
3. **How it works + capabilities** (`.case-block`) — `project.approach` narrative + the 8 `project.features` as a numbered list.
4. **Real interface gallery** (`.case-block`) — home dominant + 2 secondary screens.
5. **Technical** (`.case-block`) — `project.tech` as chips.
6. **Role + Status/Result** (`.case-finish`) — `project.role`, `project.outcome`, `project.status`.
7. **CTA** — "no more projects yet" honesty line + contact link.

`SectionHead` provides the `h2`; the product name is `h3`; block labels are `h4` (logical hierarchy, verified).

## 2. Content / data mapping

Every rendered string comes from the CMS `projects` row (IELTS.mock) via `tx/txEach` — nothing hardcoded:

| UI | CMS field |
|---|---|
| name | `project.title` |
| definition | `project.description` |
| purpose/impact | `project.impact` |
| problem | `project.problem` |
| how it works | `project.approach` |
| capabilities | `project.features` (8, CSV) |
| gallery | `project.gallery` (exam, plans) + `project.image` (home) |
| tech | `project.tech` (8) |
| role | `project.role` |
| outcome | `project.outcome` |
| status | `project.status` |

Content / layout / motion are fully separated (server component, no motion state).

## 3. Product overview

`IELTS.mock` + definition ("interactive IELTS-prep platform: listening/reading/writing/speaking practice, result analysis, error review, vocabulary, AI-assisted answer improvement") + status ("Ishlab chiqilmoqda — faol davom etmoqda" / In development) + demo/GitHub. The impact line ("Practice, error review and AI feedback — in one place") is presented as an accent-bordered pull-statement.

## 4. Problem / purpose

Uses `project.problem` verbatim (translated): the two real gaps in self-prep — "a place to practice a lot" and "someone to check your answer" — no invented market claims, no "revolutionizing education."

## 5. Capabilities

The 8 truthful feature names (Listening/Reading/Writing/Speaking practice + Results analysis + Error review + Vocabulary learning + AI-assisted answer improvement) presented as a numbered 2-column list. No per-feature "does/matters" microcopy was fabricated; the product-level "why" is carried by `project.impact`. No generic icon grid.

## 6. Screenshot hierarchy

HOME = dominant (full-width 16:9 in the gallery, and already the full-bleed climax of the Phase 3D reveal). Secondary (exam, plans) = supporting 2-col. All genuine `/media/ielts-mock-*.jpg`.

## 7. Gallery structure

`.case-gallery`: a dominant full-width home view + a 2-column (desktop) / stacked (mobile) grid of the two secondary screens. No carousel, no tilted/floating/perspective mockups, no fake chrome beyond the existing minimal `Device` bar used in the reveal.

## 8. Technical story

`project.approach` (already carries the build narrative: module-per-section, Gemini API for writing feedback, "AI wrote a lot of the code — I read it, fixed it, tested each step", Service Worker/PWA offline) + the 8 `project.tech` items as plain `chip`s. No stack-logo graveyard, no tech shown "just because."

## 9. Role / contribution

`project.role` verbatim: "Loyihani AI yordamida mustaqil quraman — rivojlantirish, debug, test, integratsiya" (I build it independently with AI — development, debug, test, integration). No implied team members or clients. Reinforces "I build, inspect, test and ship."

## 10. Status / result

`project.outcome` ("platform works live, actively developed; user counts/score stats not published — a growing product, not a finished number") + `project.status`. No fabricated success metrics.

## 11. Desktop layout

1440×900: `SectionHead` → `.case-hero` (2-col: identity | impact) → full-width editorial `.case-block`s → `.case-finish` (2-col). Strong whitespace, hairline borders, large readable screenshots. Verified no horizontal overflow.

## 12. Tablet layout

1024/768: `case-hero` collapses to single column below 64rem; capabilities stay 2-col ≥48rem; gallery grid 2-col ≥48rem. No cramped multi-column. Verified no overflow.

## 13. Mobile layout

375/430: everything stacks; home screenshot full-width (16:9), secondary screens full-width; capabilities 1-col. Readable, no overflow. Complete real Home screenshot appears first (it is the gallery hero and the reveal climax).

## 14. Reduced-motion behavior

The whole case study is server-rendered static content; the only motion is the existing CSS scroll-driven `.reveal` (which `prefers-reduced-motion: reduce` already disables via the global `@media` rule). No content depends on reveal timing; nothing hidden. Verified at reduced-motion: content fully present, images load.

## 15. Accessibility

- Logical heading hierarchy h2 → h3 → h4 (verified).
- Meaningful, localized alt text (`IELTS.mock — loyiha koʻrinishi`, `… — ekran 1/2`).
- Decorative dots/check icons are `aria-hidden`; real images are not hidden.
- Semantic `<ul>` for capabilities/tech; `<figure>` for screenshots.
- Contrast via the light narrative tokens; keyboard links with clear purpose (demo/code).

## 16. Image / performance strategy

- Only the reveal's home screenshot uses `priority` (it enters right after the cinematic spine).
- All gallery images (`home`, `exam`, `plans`) use default `loading="lazy"` — verified: exam/plans load only on scroll into view; no accidental preload of all media.
- Stable `aspect-ratio` containers (16:9 hero, 16:10 items) → minimal CLS.

## 17. Locale behavior

`/`, `/en`, `/ru` verified: "Muammo/Problem/Проблема", capabilities ("Listening amaliyoti/Listening practice/Практика Listening"), "Mening hissam/My role/Моя роль", gallery ("Haqiqiy interfeys/The real interface/Реальный интерфейс"). No layout break from longer copy; no horizontal overflow in any locale.

## 18. Files changed

- `src/components/IeltsMockFeature.tsx` — rewritten as the 7-beat editorial case study (server component).
- `src/app/globals.css` — appended `.case-hero/.case-block/.case-capabilities/.case-gallery/.case-finish` styles.
- `src/lib/messages.ts` — added `study.{how,gallery,role,status}` to uz/en/ru.
- (plus the recovered Phase 3A–3D files, re-committed due to the git reset — see note above.)

## 19. Validation

Real headless Chromium 149 (rebuilt harness). Checked: desktop 1440/1024, tablet 768, mobile 430/375, reduced-motion, theme toggle, `/en`, `/ru`, hydration/console, screenshot lazy-loading, layout stability (no horizontal overflow at any width). **All pass.** Console shows only the pre-existing `401 /api/auth/me` (PortraitSlot admin check).

## 20. Visual evidence

PNGs in `/home/user/validation/shots/`: `3e-opening.png`, `3e-capabilities.png`, `3e-gallery-home.png`, `3e-technical-status.png`, `3e-tablet-1024.png`, `3e-tablet-768.png`, `3e-mobile-430.png`, `3e-mobile-375.png`, `3e-reduced-motion.png`. All 9 non-blank and pairwise unique (distinct MD5). The agent cannot visually inspect pixels (no vision); coherence is asserted from computed DOM/geometry + distinctness, with PNGs retained for human review.

## 21. Asset limitations

Current screenshots are 1376×768 (≈16:9). They are treated as temporary; not upscaled or AI-"enhanced."

## 22. High-resolution replacement plan

Recommended export specs (swap-in without layout change — the containers are ratio-based):

| Asset | Minimum | Preferred |
|---|---|---|
| Home | 2560×1440 | 3840×2160 |
| Listening | 2560×1440 | 3840×2160 |
| Reading | 2560×1440 | 3840×2160 |
| Writing | 2560×1440 | 3840×2160 |
| Speaking | 2560×1440 | 3840×2160 |
| Plans | 2560×1440 | 3840×2160 |

To swap: replace files in `public/media/` and update `projects.image` / `projects.gallery` in the CMS. No code/layout change required.

## 23. Phase 3F readiness

The case study is a complete, truthful editorial product story that settles naturally from the Phase 3D reveal (light narrative, shared screenshot geometry, home-dominant hierarchy). Ready to hand off to Phase 3F.

## 24. Git / Preview evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **`main`:** untouched (`062cadd`)
- **Production:** untouched; no merge; no production deployment.
- **Preview:** none (no Vercel credentials); validated on local `next start`.
- **Git recovery:** see note at top — Phase 3A–3D files re-committed with Phase 3E.
