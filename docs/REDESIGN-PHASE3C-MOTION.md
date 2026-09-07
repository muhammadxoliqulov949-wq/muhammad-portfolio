# PHASE 3C — BUILD CORE MOTION & SCROLL CHOREOGRAPHY

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Start SHA:** `3e6f9b5` (Phase 3B approved)
**Rollback point:** `3e6f9b5`
**Baseline docs:** `REDESIGN-PHASE0-AUDIT.md`, `REDESIGN-PHASE1-CREATIVE-DIRECTION.md`, `REDESIGN-PHASE2-TECHNICAL-BLUEPRINT.md`, `REDESIGN-PHASE3A-IMPLEMENTATION.md`, `REDESIGN-PHASE3B-STATIC-VISUAL.md`

> Scope: Build Core cinematic scroll motion + short hero intro. **NOT** the Deployment → IELTS.mock product reveal (Phase 3D).

---

## 1. GSAP version / dependency decision

- Installed **`gsap@3.15.0`** (latest stable at install time). `ScrollTrigger` is bundled in the `gsap` package (imported via `gsap/ScrollTrigger`, also 3.15.0).
- **License:** GSAP core + ScrollTrigger ship under the standard GreenSock license — free for this project (a personal portfolio is not a "GSAP-enhanced product" resold to multiple end-users). **No Club GSAP plugins** are used (e.g. `DrawSVGPlugin`, `SplitText` were deliberately avoided; connector reveal uses opacity, not stroke-draw).
- **No second scroll/animation library.** GSAP is the only motion dependency added. Verified to load correctly under the app's ESM resolution (Next.js webpack/turbopack); `gsap.registerPlugin`, `gsap.matchMedia`, `gsap.timeline` all present.

## 2. Timeline architecture

- **One GSAP timeline + one ScrollTrigger**, owned by `BuildCoreSection` (now a `"use client"` component). `CinematicSpine` remains the structural wrapper.
- Content state (i18n strings via `@/lib/i18n-core`, CMS data via serializable props) is fully **separate** from motion state (GSAP, inside `useLayoutEffect`). No DB access, no client CMS fetch, no motion state in the content model.
- No React state is updated per scroll frame. Class/`data-state` changes are applied imperatively via `classList`/`setAttribute`, guarded by a `lastState` cache so DOM writes only happen when the state index actually changes.

## 3. Normalized progress mapping

One `p ∈ [0,1]` from the ScrollTrigger (`self.progress`) drives everything.

| State | Range | Strata classes | `--y` fan (per-stratum) | `--z` (per-stratum) | tilt | scale |
|---|---|---|---|---|---|---|
| ARRIVAL | 0.00–0.14 | all pending | 0 | 0 | 6° | 0.96 |
| PROTOTYPE | 0.14–0.34 | s1 active | `i·1.5px` | `i·2px` | 6° | 0.96 |
| CODE REVIEW | 0.34–0.58 | s1–s3 active | `i·7px` | `i·10px` | 4° | 1.02 |
| VALIDATION | 0.58–0.76 | all validated | `i·1.5px` | `i·2px` | 4° | 1.0 |
| DEPLOYMENT | 0.76–1.00 | all validated | 0 | 0 | 0° | 1.0 |

State boundaries (`0.14 / 0.34 / 0.58 / 0.76`) live in a `BOUNDS` constant; tweens are positioned at absolute timeline times equal to these fractions (timeline duration is normalized to 1.0s, mapped linearly to the scroll range by `scrub: true`). Adjacent states share ~0.2 of transition (the tween spans), which is the "~0.04 overlap" semantics applied as crossfade.

## 4. Pin configuration

```
trigger: sectionRef (#build)
start: "top top"
end: "+=500%"        // ≈5 viewport-heights of scrub (Phase 2 approved)
pin: true
scrub: true          // direct deterministic scrubbing
anticipatePin: 1
invalidateOnRefresh: true
```

Only instantiated inside `gsap.matchMedia()` for `(min-width: 64rem) and (prefers-reduced-motion: no-preference)`, so no pin/spacer exists on tablet, mobile, or reduced-motion. The pin-spacer is created/removed by ScrollTrigger (and reverted by `mm.revert()`), so there is no manual spacer and no stale spacer after resize.

## 5. Arrival (0.00–0.14)

Core slab fades in from `opacity 0.72 → 1` (the "settle"); strata stay pending/wireframe; spine + edge marks present; labels dim (`0.55`); connectors hidden. A short hold — the object reads first, nothing explodes.

## 6. Prototype (0.14–0.34)

Strata fan out slightly (`y = i·1.5`, `z = i·2`); stratum 1 → `--active` (solid + accent tick) via `applyState`; labels resolve to full opacity. "First form" — controlled, no flying pieces.

## 7. Code Review (0.34–0.58)

Maximum separation (`y = i·7`, `z = i·10`); strata 1–3 → `--active`; group tilts 6°→4° and scales to 1.02 (inspection framing); connectors fade in; labels fully visible. The metaphor is inspection/understanding — **no fake code, terminal, typing, lasers, or cyberpunk effects**.

## 8. Validation (0.58–0.76)

Strata re-align (`y = i·1.5`, `z = i·2`); all strata → `--validated` (tight hairline + accent seam); scale settles to 1.0. Noise decreases; the system reads as resolved/confident — no green success effect, no checkmark celebration.

## 9. Deployment (0.76–1.00)

Strata compress (`y = 0`, `z = 0`); group tilt → 0° (flat, clean geometry baseline); labels recede (`opacity 0.45`); connectors settle (`opacity 0.25`). The object ends as a compact, sealed, axis-aligned package — a clean transform origin/geometry baseline for Phase 3D's product-frame reveal. **The IELTS.mock morph is NOT implemented.**

## 10. Connector choreography

The 5 inline SVG `<line>` leaders (placeholder geometry from 3B) animate via **opacity only**: hidden (0) at arrival → 1 during Code Review → 0.25 at Deployment. `aria-hidden="true"` + `focusable="false"`. Stroke-draw (`DrawSVGPlugin`/dashoffset) was avoided — no Club plugin, no per-line dash math — in favor of opacity, which §15 explicitly permits.

## 11. Label choreography

Labels animate as one group (`opacity 0.55 → 1 → 0.45`) — settle in, hold, recede. Per-state dominance is handled by the stratum classes (active labels `ink-1`, pending `ink-2`), not by constant label movement. The viewer never reads five competing labels at once.

## 12. Progress rule

`.build-core__progress-fill` tweens `width: 0% → 100%` across the full timeline (single linear tween at position 0, duration 1). No percentage counter, no stepper dots. The mono state index (`00 ARRIVAL` → `04 DEPLOYMENT`) is updated textually inside `applyState`.

## 13. Intro behavior

`IntroOverlay` (client) renders the existing `.intro-overlay` (centered Fraunces "M." mark + 1px accent rule, `aria-hidden`, `pointer-events: none`, CSS `opacity: 0` so it's invisible with JS disabled). On mount it plays, in ~1.1s: mark fades/rises in, rule scales in, ~0.4s hold, everything fades out. Non-blocking — the hero is fully in the DOM from first paint. No fake loader, spinner, percentage, or network dependency.

## 14. Session behavior

`sessionStorage["__intro_seen"]` (wrapped in try/catch for privacy-blocked storage): set on first play; repeat mounts in the same session skip the intro. No hydration mismatch (flag is read only inside `useLayoutEffect`, never during render). `prefers-reduced-motion` skips the intro automatically. Direct refresh replays (per-session policy, as Phase 2 defaulted).

## 15. Tablet behavior (768–1024)

No ScrollTrigger, no pin, no scrub (matchMedia fails below 64rem). CSS keeps the reduced `rotateX(3deg)` static tilt. State meaning is fully readable without scrubbing (all strata + labels present).

## 16. Mobile behavior (≤767px)

No ScrollTrigger, no pin, no pin-spacer, no CSS-3D choreography (`transform: none`). The object is the flat, normal-flow workflow diagram from 3B. The desktop timeline is never instantiated — not merely hidden.

## 17. Reduced-motion path

`prefers-reduced-motion: reduce` is part of the matchMedia query, so the timeline never initializes: no pin, no scrub, no intro, no blank spacer, no delayed content. The static Build Core (all strata + labels, CSS `transform: none`) remains complete.

## 18. Resize lifecycle

- `gsap.matchMedia()` scopes the timeline to the desktop query; `mm.revert()` (returned from the effect) tears down tweens, ScrollTrigger, and the pin-spacer on unmount / query mismatch.
- `invalidateOnRefresh: true` re-evaluates function-based values and re-syncs on refresh.
- `onUpdate` + `onRefresh` both call `applyState(self.progress)`, so the discrete state resolves correctly after resize/orientation and after a deep-scroll refresh.
- `useLayoutEffect` with `[locale]` dependency + `mm.revert()` cleanup prevents duplicate ScrollTriggers and detached contexts (StrictMode-safe in dev).

## 19. Reverse-scroll validation

Reverse scrolling is deterministic by construction: every numeric property is a scrub-synced tween (reversible), and discrete state derives purely from `self.progress` via `applyState` (idempotent, no stuck classes — the state is recomputed from `p` each update). No state may remain "stuck" because there is no forward-only `tl.call`/`add` sequencing.

## 20. Fast-scroll validation

Because the whole visual is a pure function of `p` (no sequential real-time animations), jumping top→end→middle→start resolves to the correct state immediately. The only real-time animation is the non-scroll intro (independent of the timeline).

## 21. Performance notes

- No React re-render in the scrub path; class/text changes are imperative and guarded by `lastState`.
- Transform/opacity-only animation (GSAP `y/z/rotateX/scale/opacity/width`); `width` on a 1px bar is the only layout-affecting property (cheap, single element).
- No `getBoundingClientRect`/layout reads in the scrub path (ScrollTrigger handles measurement internally). No filters, no SVG filters, no huge animated shadows, no loops.

## 22. Accessibility notes

- Semantic reading order unchanged (the `<ol>` + `sr-only` full-sentence description are untouched; motion never inserts/removes content nodes).
- Decorative connector SVG stays `aria-hidden` + `focusable="false"`.
- `applyState` mutates `data-state`/classes/text but nothing is in an `aria-live` region, so no screen-reader spam.
- Focus order is stable (no nodes are created/removed by the timeline); the pin does not trap keyboard navigation (ScrollTrigger pinning is purely positional).
- The intro is `aria-hidden` + `pointer-events: none` and never traps focus.

## 23. Files changed

- `package.json` / `package-lock.json` — add `gsap@3.15.0`.
- `src/components/cinematic/BuildCoreSection.tsx` — rewritten as client component: `useLayoutEffect` + `gsap.matchMedia` + one timeline + one ScrollTrigger + `applyState`.
- `src/components/cinematic/IntroOverlay.tsx` — **new** client component (session-gated ~1.1s intro).
- `src/components/cinematic/IntroHero.tsx` — render `<IntroOverlay />` instead of the static inert div.
- `src/components/cinematic/CinematicSpine.tsx` — comment update (motion now lives in BuildCoreSection).
- `src/lib/messages.ts` — add `build.prototype/review/validation/deployment` (uz/en/ru).
- `src/app/globals.css` — `transform-style: preserve-3d` on group + stack (for translateZ depth); `.intro-overlay` background removed (non-covering brand mark).

## 24. Build / runtime validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **0 errors** |
| `npm run lint` (eslint) | **0 errors / 0 warnings** |
| `npm run build` (AUTH_SECRET set, DB seeded) | **success** |
| `npm start` + HTTP | `/` **200**; `/?lang=en` **200**; `/?lang=ru` **200** |
| SSR structure | 1 core + 5 strata + state/progress meta + `.intro-overlay`; `data-state="arrival"`; state name localized (Boshlanish / Arrival / Старт) |
| GSAP ESM load | `registerPlugin`, `matchMedia`, `timeline`, ScrollTrigger 3.15.0 confirmed under ESM |
| Theme toggle / locale | unchanged behavior (no regression) |

## 25. Visual evidence

**Not captured.** No browser binary is available in this environment (Chrome/Chromium download to `storage.googleapis.com` / `googlechromelabs.github.io` is blocked → `ECONNRESET`; `jsdom`/`happy-dom` are not installed and would not exercise real pin/layout anyway). Therefore **scroll choreography, pinning, reverse/fast-scroll, resize, and the intro are NOT visually validated** — only statically reasoned + type/lint/build/SSR-checked. I do **not** claim cinematic quality from static inspection alone; a real-browser pass is required before sign-off.

## 26. Preview evidence

**None created.** No Vercel CLI, no `VERCEL_TOKEN`, and no `.vercel` project link are present in this environment, so a Preview deployment could not be made. A local production `npm start` was used for SSR validation instead.

## 27. Known limitations

- **Unverified at runtime:** pin height/framing (the section is slightly taller than a 900px viewport, so the meta/state row may sit near the fold during pin), translateZ depth perception, reverse/fast-scroll feel, and resize stability — all need a browser pass.
- Connector leader geometry is still the 3B placeholder (5 stubs at fixed fractions) since the reveal is opacity-only.
- Intro is the non-covering brand-mark variant (not the Phase 2 "dark canvas hold") — chosen for no-JS safety and non-blocking per §18; revisit in a visual pass if the dark hold is desired.
- `--theme-progress` was intentionally **not** added (Phase 3D concern).

## 28. Phase 3D readiness

- The Build Core now ends at `p = 1` in a **flat (0°), scale-1, axis-aligned, sealed** configuration — a clean origin for the Deployment → product-frame morph.
- The single ScrollTrigger/timeline (`p ∈ [0,1]`, scrub) is the exact hook Phase 3D will extend (the reveal slots after the DEPLOYMENT segment).
- No morph/expansion/theme-transition code exists yet — correctly deferred.

## 29. Git evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **Start SHA:** `3e6f9b5`
- **End SHA:** (this commit)
- **`main`:** untouched (`062cadd`)
- **Production:** untouched; no merge; no production deployment.
- **Dependencies added:** `gsap@3.15.0` only.
