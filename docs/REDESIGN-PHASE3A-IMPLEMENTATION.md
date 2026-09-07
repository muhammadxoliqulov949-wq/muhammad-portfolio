# PHASE 3A — Foundation, Tokens & Structural Implementation

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Start SHA (production baseline / `main`):** `062caddda293ccae04c004648ea93e514982cb0f`
**Rollback point:** `60c6352` ("docs: Phase 0 audit, Phase 1 creative direction, Phase 2 technical blueprint")
**Baseline docs:** `REDESIGN-PHASE0-AUDIT.md`, `REDESIGN-PHASE1-CREATIVE-DIRECTION.md`, `REDESIGN-PHASE2-TECHNICAL-BLUEPRINT.md`

> Scope: structural foundation ONLY. No Build Core motion, no GSAP, no cinematic product transform, no final polish. Deferred items remain deferred.

---

## 1. What was implemented

The homepage was restructured from a repetitive **ten-section** rhythm into the approved **seven-beat** architecture, with a single intentional new client boundary (`CinematicSpine`). The new structure reads coherently **without any motion**: if all animation were disabled, the page is still usable, accessible, and intentional.

Seven beats now render in order:

1. **Intro / Hero** — `IntroHero` (server) inside `CinematicSpine`.
2. **Build Core** — `BuildCoreSection` (static shell).
3. **Deployment → Product** — `ProductTransition` (static shell).
4. **IELTS.mock** — `IeltsMockFeature` (server, editorial case study).
5. **Capabilities** — `Capabilities` (server, services + toolkit).
6. **About** — `About` (server, consolidated story/workflow/experience/education/achievements/goals).
7. **Contact** — `Contact` (server, existing, now in the light narrative region).

## 2. Component architecture

```
HomePage (server, src/app/(site)/page.tsx)
├── CinematicSpine (client — the ONLY new client boundary)
│   ├── IntroHero        (server markup, passed as children)
│   ├── BuildCoreSection (static shell; motion deferred to 3C)
│   └── ProductTransition (static shell; transform deferred to 3D)
├── IeltsMockFeature (server)
├── Capabilities       (server)
├── About              (server)
└── Contact            (server, existing)
```

- `CinematicSpine` is `"use client"` and receives **serializable props** (`project`, `locale`) plus server-rendered `children` (IntroHero). No DB/CMS import, no client-side fetching, no animation state.
- Everything else remains server-rendered. `Header`, `Footer`, `MobileCTA` are unchanged existing client islands.

## 3. Files changed

**Created (7):**
- `src/components/cinematic/CinematicSpine.tsx`
- `src/components/cinematic/IntroHero.tsx`
- `src/components/cinematic/BuildCoreSection.tsx`
- `src/components/cinematic/ProductTransition.tsx`
- `src/components/IeltsMockFeature.tsx`
- `src/components/Capabilities.tsx`
- `docs/REDESIGN-PHASE3A-IMPLEMENTATION.md`

**Modified (7):**
- `src/app/(site)/page.tsx` — rewritten to the seven-beat composition.
- `src/components/About.tsx` — consolidated editorial About.
- `src/components/Contact.tsx` — added `data-narrative="light"`.
- `src/components/Header.tsx` — `PRIMARY` nav set updated.
- `src/lib/content.ts` — `sectionsOf()` now returns the 6-beat nav.
- `src/lib/messages.ts` — added `nav.build`/`nav.capabilities` + `build` + `capabilities` blocks (uz/en/ru).
- `src/app/globals.css` — narrative theme regions + Build Core + transition + capabilities styles + layout tokens.

**Superseded (retained, not deleted — removal deferred to Phase 3H cleanup):**
`Hero.tsx`, `Skills.tsx`, `Experience.tsx`, `Services.tsx`, `Education.tsx`, `Achievements.tsx`, `Approach.tsx`, `Projects.tsx` are no longer imported by the homepage. They still compile (verified by `tsc`) and are intentionally left in place to avoid destructive cleanup in this phase.

## 4. Token system

- Reused the existing `@theme` semantic tokens (`canvas/surface/ink/line/accent`, `radius-*`, `shadow-*`, `section-y`, `gutter`, `container`).
- Added layout tokens on `body`: `--media-max: 96rem`, `--measure: 60ch`.
- Added **narrative theme regions** (`[data-narrative="dark"]`, `[data-narrative="light"]`) that scope the dark/light palette to a subtree. These mirror the existing `:root` (dark) and `[data-theme="light"]` values. The manual `data-theme` toggle on `<html>` still governs global chrome (header/footer); narrative regions carry the locked dark→light art direction.
- No arbitrary colors/spacing are scattered in components; all new styles use the token variables.

## 5. Build Core static architecture

- `BuildCoreSection` renders a semantic **`<ol>`** of five build steps + one "requirement" core, each as a `build-core__row` with a decorative `aria-hidden` plane (`build-core__plane`), a mono index, and a real label.
- `data-state="arrival"` is present on the viewport for future animation; no state machine exists yet.
- DOM is small (~6 rows, ~20 nodes) and inspectable. No Canvas/WebGL/SVG decorations beyond CSS.
- The `<ol>` with real text labels **is** the screen-reader equivalent (steps read in process order). `build.sr` (full-sentence description) is defined in `messages.ts` and reserved for the 3C animated object's `aria-label`.

## 6. ProductTransition shell

- `ProductTransition` renders the static "deployment → product" handoff: a `Device` browser frame (reused primitive) with a `data-product-frame` wrapper (future transform target), containing the real IELTS.mock home screenshot via `next/image` (`fill`, `priority`, `object-cover object-top`, `aspect-16/9`).
- No expansion, no morph, no scroll behavior. The frame previews the intended handoff only.

## 7. IELTS.mock structure

- `IeltsMockFeature` is the readable case study (the cinematic reveal is `ProductTransition`'s future job, so the home screenshot is not duplicated here).
- Content areas: title + description + impact + demo/GitHub + status → "Problem" (real) → "What the platform does" (real feature list) → supporting gallery (exam/plans screenshots) → honest "more coming" + discuss CTA.
- All data from CMS (`project`); no fabricated metrics. Swappable for higher-res screenshots later (no structural change needed).

## 8. Responsive behavior

- Grids collapse to single column at `48rem`/`64rem` (existing breakpoints). Capabilities toolkit goes 1→2→3 columns.
- No pinned region, no fixed-height spacer, no duplicate CSS-only mobile experience — the same markup reflows.
- **Validation note:** responsive behavior was verified **structurally** (server-rendered HTML + existing fluid CSS), not in a real browser/device. No screenshots taken.

## 9. Reduced-motion behavior

- No motion-dependent content, no blank pinned regions, no hidden narrative steps. The page is fully static/editorial at rest.
- The Build Core `<ol>` is understandable without animation (it is the static, labeled diagram).
- `prefers-reduced-motion` global rule (existing) is untouched and still applies to any CSS `.reveal`.

## 10. Accessibility notes

- Semantic landmarks and heading hierarchy: `h1` (hero) → `h2` (SectionHead per beat) → `h3`/`h4` (sub-blocks/items).
- Build Core decorative planes are `aria-hidden`; the ordered list is real, readable text.
- Screenshots have descriptive `alt`; decorative device chrome is `aria-hidden`.
- Existing skip-link, focus-visible, keyboard nav, and contrast tokens are preserved.

## 11. Validation results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **0 errors** |
| `npm run lint` (eslint) | **0 errors / 0 warnings** |
| `npm run build` | **success** (27/27 static pages), Turbopack compile + TypeScript pass |
| `npm start` + HTTP checks | `/` **200**; `/projects` **200**; `/projects/1` **200**; `/?lang=en` **200** |
| Rendered structure | All six section IDs (`home`,`build`,`work`,`capabilities`,`about`,`contact`) present; 1 dark + 4 light narrative regions; Build Core rows + product frame + IELTS.mock title present |
| Server logs | No errors/warnings during requests |
| Hydration | Not verified in a browser (no headless browser available) — marked UNKNOWN |
| Visual / device / Lighthouse | **Not performed** (no browser tooling) — not claimed |

## 12. Known issues / limitations

- **Screenshots remain 1376×768** (`public/media/ielts-mock-*.jpg`) — treated as temporary dev assets; the reveal is specced for ≥2560×1440 later.
- **Theme nuance (open, deferred to 3B/3C):** narrative regions apply the locked art direction (dark opening / light editorial) as scoped overrides; the manual toggle still works for global chrome, but the exact "user preference wins during the scroll-driven transition" behavior is finalized when `--theme-progress` lands.
- Orphaned legacy section components remain (see §3) — intentional, to be removed in 3H.
- `build.sr` i18n string is currently unused by markup (reserved for 3C).

## 13. Deferred items (untouched, as required)

Dead CSS cleanup (`hero-process`/`hero-stats`/`skills-strip`), unused `next-auth`, `force-dynamic` vs ISR issue, GSAP install + timeline, final screenshot capture, final hero intro motion, final contact copy, optional video, Canvas/WebGL.

## 14. Phase 3B readiness

- The component tree, client boundary, and static Build Core / ProductTransition shells are in place and compile cleanly.
- Phase 3B (Build Core static object refinement + intro structure) can proceed without restructuring.
- GSAP is **not installed**; its install is deferred to 3C per the blueprint.

## 15. Git / Preview evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **Start SHA:** `062caddda293ccae04c004648ea93e514982cb0f` (`main` baseline — untouched)
- **Rollback point:** `60c6352` (planning docs committed)
- **Preview:** none created (local validation only; no Vercel deployment).
- **Dependencies:** none added (`npm ci` only, to install the existing lockfile for build/type validation).
- **`main`:** NOT modified. **Production:** NOT modified.
