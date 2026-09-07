# PHASE 3B — BUILD CORE STATIC REFINEMENT + INTRO STRUCTURE

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Start SHA (Phase 3A approved commit):** `e6a2576`
**Rollback point:** `e6a2576`
**Baseline docs:** `REDESIGN-PHASE0-AUDIT.md`, `REDESIGN-PHASE1-CREATIVE-DIRECTION.md`, `REDESIGN-PHASE2-TECHNICAL-BLUEPRINT.md`, `REDESIGN-PHASE3A-IMPLEMENTATION.md`

> Scope: STATIC visual refinement only. No scroll motion, no GSAP, no pin, no ProductTransition morph, no theme scrub, no Canvas/WebGL. Phase 3C is not started.

---

## 1. Visual direction implemented

The Phase 3A flat "stacked card" shell was replaced with a **dimensional build-strata object** that reads as a physically-layered engineering diagram even in a single still frame. It is a vertical stack of five workflow **strata** resting on a solid, dimmer **core slab** (the requirement/idea), keyed to a thin left **registration spine**, tilted ~6° in CSS 3D on desktop.

The object now passes the Phase 3B bar: *if all animation were permanently disabled, it still looks intentionally designed and portfolio-grade.*

## 2. Silhouette

- A centered column (max-width 46rem) — deliberate, not a generic centered rectangle.
- **One dominant structural anchor:** the core slab (00 · Requirement) is solid, matte, wider in presence, and carries the only accent edge mark.
- Five strata stack above it, each separated by a 12px gap, sharing a left registration spine (`border-left` + per-layer tick) that makes the planes read as *mechanically related* rather than independently floating cards.
- The asymmetry comes from the contrast between the resolved core and the unresolved (wireframe) strata — a "stack awaiting assembly" — rather than arbitrary offsets, keeping the object elegant and at-a-glance legible.

## 3. Geometry

- Planes are rounded (`radius-3`, 14px), matte, with a **hard 2px bottom edge** (`0 2px 0 color-mix(canvas 82%, #000)`) that gives each slab a thin front-face "thickness" without extra DOM.
- Depth is **diagram depth, not 3D-object depth** (per Phase 1): `perspective: 1600px` + `rotateX(6deg)` on the scene group, `transform-origin: 50% 100%` so the stack leans back from its base.
- Soft drop shadows under each stratum (`0 16px 28px -26px`) separate the layers; the core slab uses the stronger `sh-2`.
- No translateZ fan is applied yet (faithful ARRIVAL: plane z = 0); the 3D reads from tilt + edges + shadows alone.

## 4. Material system (locked)

| Role | Treatment |
|---|---|
| **Core slab** | Solid matte `linear-gradient(surface-3 → surface-1)`, `line-2` hairline border, inner top-light (`sh-1` + 1px ink inset), `sh-2` drop |
| **Workflow planes (pending)** | Dashed `line-2` border + low-fill gradient (52%→34% surface) — wireframe cue |
| **Active surface** (future) | Solid `surface-3→1`, solid border, stronger shadow, accent left tick |
| **Validated surface** (future) | Tight hairline border, reduced shadow, thin accent seam |
| **Connectors** | 1px `line-2`, `non-scaling-stroke`, hidden at arrival |
| **Labels** | JetBrains Mono micro, uppercase, `ink-3` index / `ink-1` (pending: `ink-2`) name |
| **Edge marks** | 1px horizontal tick from each plane to the spine; accent 2px on the core |

Matte, restrained, low-gloss. Single implied top-left light. Accent (lime) used as a highlight only — **no** neon, chrome, glassmorphism, glow, or sci-fi plastic.

## 5. Strata system

Five strata, semantically bound to the real workflow (unchanged from Phase 1):

1. **Prototype** — AI-assisted prototype
2. **Review** — read every line
3. **Fix** — find and fix what's broken
4. **Test** — browser/phone validation
5. **Deploy** — ship to Vercel

Each is visually *related but not identical*: shared geometry/material, but the wireframe (pending) treatment and shared spine make them read as **stages of one system**, not five generic cards. At arrival all five are `--pending`; the core is the only resolved surface.

## 6. State visual vocabulary (implemented, inert)

| State | Class | Visual |
|---|---|---|
| **PENDING** | `.build-core__stratum--pending` | dashed border, low fill, `ink-2` label |
| **ACTIVE** | `.build-core__stratum--active` | solid fill, solid border, accent tick, stronger shadow |
| **VALIDATED** | `.build-core__stratum--validated` | tight hairline, reduced shadow, thin accent seam |

State changes are **class-only** (`--pending`/`--active`/`--validated`) plus the existing `data-state` on the viewport — no DOM restructuring required in Phase 3C. No green checkmarks; completion is conveyed by "sealed/resolved" edges.

## 7. Connector architecture

- An inline SVG (`.build-core__connectors`) with **5 leader `<line>` paths** is present and `aria-hidden="true"` + `focusable="false"`, but at `opacity: 0` (ARRIVAL state: connectors hidden). It is the structural home for Phase 3C leader-line draw-in.
- **Line spec (defined):** 1px, `vector-effect: non-scaling-stroke`, `line-2` stroke, accent-colored only on the active stratum (future).
- The **registration spine** (the vertical datum the leaders will attach to) is a CSS `border-left` on the stack — perfectly aligned by construction, zero cost. Each plane's `::before` is a 1px horizontal tick meeting the spine (the "anchor/join" point).
- No circuit-board lines, no waveforms, no random connectors — the spine + 5 ticks are the only connective marks, and each corresponds to a real stratum.

## 8. Labels

- Index: JetBrains Mono micro, `0.12em` tracking, `ink-3`, `00`–`05`.
- Name: `600` weight, `-0.01em` tracking; pending names are `ink-2` (quiet), core is `ink-1`.
- Casing: sentence (natural), matching the site's editorial voice — no ALL-CAPS shouting.
- Five names never compete: pending strata are deliberately dimmer; only the core slab carries accent emphasis.

## 9. Validation / edge marks

- Each stratum's left **registration tick** (1px `line-2`) is the restrained "alignment mark"; the core's tick is a 2px **accent** line (the sealed datum).
- The hard bottom edges + tight hairlines convey "resolved geometry" without checkmarks, badges, banners, or green glow.
- `--validated` reserves a thin accent seam for Phase 3C.

## 10. Progress rule

- A **thin horizontal fill bar** (`.build-core__progress`, 1px tall, max-width 16rem) sits in the meta row, currently at `width: 0%` (ARRIVAL).
- It is paired with the mono state index (`00 · Boshlanish/Arrival/Старт`) — a compact "stage index", **not** a 5-dot stepper and not an onboarding progress bar.
- Ready for scroll-driven fill in Phase 3C (single `--progress` channel, no new markup).

## 11. Hero refinement

- **Typography retained** from Phase 3A (already premium: Fraunces display-xl name with `-0.04em` tracking, quieter last name in `ink-2`, role line, `text-lead` bio). Reviewed against §16 — scale/line-height/text-width are balanced at 1440px (identity strong, not viewport-swallowing) and 375px (natural stack). No regression made.
- **Added the hero → Build Core scroll bridge:** a "Scroll down / Pastga suring / Вниз" affordance (`hero.scroll`) with a chevron, linked to `#build`, appended to the hero meta row (reusing the existing `.hero-meta__scroll` slot). This is the *early visual hint* of the process, kept clean rather than adding decorative strata motifs.

## 12. Intro structural readiness

- A lightweight **`.intro-overlay`** (`aria-hidden="true"`, `pointer-events: none`, `opacity: 0`) now sits over the hero: a centered Fraunces "M." identity mark + a thin accent rule.
- It is **fully inert** — invisible, non-blocking, no timing, no `sessionStorage`, no timeline, no delayed visibility. Phase 3C/3D will fade it *from* opacity 1 to reveal the already-rendered hero (no loader, no fake progress, no content delay).
- Hero content remains in the DOM from first paint (SSR), satisfying the "no separate loading page" rule.

## 13. Desktop composition (1440px target)

- Object max-width 46rem (~57% of the 80rem container), centered, generous section whitespace above/below.
- `perspective: 1600px`, `rotateX(6deg)`, origin bottom-center → subtle, premium lean; hero copy (identity) remains the primary subject above.
- The meta row (state index + progress rule) sits flat *outside* the tilted scene, anchoring the object.

## 14. Tablet behavior (768–1024)

- Tilt reduced to `rotateX(3deg)`; depth carried mostly by shadows + edges. Same DOM, no duplication.

## 15. Mobile behavior (≤767px, incl. 430/375)

- Tilt and perspective fully removed (`transform: none`); the object becomes a **flat, readable workflow diagram** in normal flow.
- Sequence → labels → hierarchy all preserved (same `<ol>`, same index + name). Slightly tighter min-heights and gutter for small screens.
- No pin, no parallax, no perspective-heavy interaction, no hidden/duplicated DOM.

## 16. Reduced-motion behavior

- `@media (prefers-reduced-motion: reduce)` sets the scene `transform: none`, so there is **zero** 3D tilt.
- The page is already complete at rest: readable workflow, no hidden state-dependent content, no blank pin spacers, no motion-only meaning. Reduced-motion users see the identical editorial diagram minus the tilt.

## 17. Accessibility

- The workflow is a **real `<ol>`** — screen readers read the five steps in order (plus the core "Requirement" label).
- A `sr-only` full-sentence description (`build.sr`, localized) provides plain-language meaning independent of the visual diagram.
- Decorative planes, the spine, the connector SVG, and the progress rule are `aria-hidden`; the connector SVG is also `focusable="false"`.
- Heading hierarchy intact (`h1` hero → `h2` "How I build" → no subheadings needed inside the object). Contrast uses existing `ink-*` tokens. Mobile reading order is logical (core → strata → state).

## 18. Performance notes

- No animation loops, no GSAP, no scroll logic, no filters, no SVG filter chains, no large media preload.
- Depth is pure CSS (one perspective + one rotateX + box-shadows + one inline SVG at opacity 0) — cheap to paint, GPU-friendly transforms only.
- DOM for the object: 1 core + 5 strata + 1 SVG + 1 meta row + 1 sr-only line (~20 nodes), within the Phase 2 budget.

## 19. Files changed

- `src/components/cinematic/BuildCoreSection.tsx` — rewritten into the strata object (core slab + 5 pending strata + connectors SVG + state/progress meta).
- `src/components/cinematic/IntroHero.tsx` — added inert `.intro-overlay` + hero→build scroll bridge.
- `src/lib/messages.ts` — added `build.arrival` (uz/en/ru).
- `src/app/globals.css` — replaced the 3A build-core shell with the strata material/depth/state system + responsive/reduced-motion rules; added `.intro-overlay` styles; refined `.product-transition__frame` material consistency (inner top-light).

## 20. Validation evidence

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **0 errors** |
| `npm run lint` (eslint) | **0 errors / 0 warnings** |
| `npm run build` (AUTH_SECRET set, DB seeded) | **success** |
| `npm start` + HTTP | `/` **200**; `/?lang=en` **200**; `/?lang=ru` **200** |
| Rendered structure (curl) | 1 `.build-core__core` + 5 `.build-core__stratum--pending` + 6 index/label pairs + 1 connectors SVG + state/progress meta; `data-state="arrival"`; `.intro-overlay` present; `hero-meta__scroll` present; section ids `home/build/work/capabilities/about/contact`; narrative regions 1 dark + 4 light |
| Locale sanity | uz "Boshlanish / Talab…/Prototip…Deploy"; en "Arrival / Requirement…/Prototype…Deploy"; ru "Старт" |
| Theme toggle | `theme-switch` markup present (behavior unchanged — no regression) |
| Reduced motion | CSS rule present (`.build-core__group { transform: none }`) |
| GSAP | **not installed** (only comments reference it) |
| Console/hydration | no browser tooling available — **not run**, not claimed |
| Visual inspection (device/Lighthouse) | **not performed** — no headless browser in this environment; structural validation only |

## 21. Known limitations

- **No visual/device inspection** was possible (no Chromium/Playwright binary). The composition is reasoned from the approved spec + validated structurally; a real browser pass is recommended before Phase 3C.
- CSS 3D `rotateX` can soften text rendering slightly on some engines; the tilt is small (6°→3°→0°) to keep it acceptable.
- The connector SVG leader geometry is placeholder (5 horizontal stubs at fixed fractions) since it is hidden at ARRIVAL; Phase 3C will compute real anchors.
- Screenshots remain 1376×768 (temporary dev assets, unchanged).

## 22. Phase 3C readiness

- The static strata object, material system, state classes, connector layer, progress rule, and intro overlay are all in place and inert.
- Phase 3C can proceed directly: add GSAP + ScrollTrigger (approved), wire `data-state` → `--pending/--active/--validated` toggles, drive `--z`/`--dy`/tilt/progress, and draw in the connector leaders — with **no structural restructuring**.

## 23. Git / Preview evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **Start SHA:** `e6a2576` (Phase 3A approved)
- **End SHA:** (this commit)
- **`main`:** untouched (`062cadd`)
- **Production:** untouched; no merge; no production deployment.
- **Dependencies:** none added.
