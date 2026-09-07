# PHASE 2 — Technical Architecture & Implementation Blueprint

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Baseline SHA:** `062caddda293ccae04c004648ea93e514982cb0f` (both `HEAD` and `main` — unchanged)
**Authoritative inputs:** `docs/REDESIGN-PHASE0-AUDIT.md`, `docs/REDESIGN-PHASE1-CREATIVE-DIRECTION.md`
**Scope:** Architecture + blueprint ONLY. No homepage redesign implementation. No dependency installs (unless an isolated validation is strictly necessary and documented). No Phase 3.

> Labels: **VF** = VERIFIED FACT (Phase 0 audit / code), **TD** = TECHNICAL DECISION (locked), **REC** = RECOMMENDATION, **OR** = OPEN RISK.

---

## 1. Executive Technical Direction

The redesign is implemented as a **narrow, isolated cinematic spine** grafted onto the existing server-rendered, CMS-driven site — not a rewrite. Concretely:

- **One new client component** owns all scroll/motion state (Build Core → Deployment → IELTS.mock reveal → theme transition). Everything else stays server-rendered and largely untouched.
- **DOM + SVG + CSS transforms/CSS-3D** for the Build Core object. No Canvas, no WebGL (locked in Phase 1).
- **GSAP + ScrollTrigger** scoped strictly to the cinematic spine (decision in §7), with a zero-dependency fallback specified in case approval reverses.
- **Content/motion separation:** the existing CMS data model is consumed read-only; no animation state is coupled to backend code.
- **Reduced-motion is a first-class static path**, not a filter on top of the full timeline (§10).

The primary technical risk is **scroll-pin/scrub determinism** and **hydration boundaries**; the blueprint front-loads those.

---

## 2. Final Component Architecture

Derived from the current repository structure (**VF**: server components live in `src/components/*`, client components are the `"use client"` subset, homepage composes sections in `src/app/(site)/page.tsx`).

```
HomePage  (server — src/app/(site)/page.tsx, force-dynamic, unchanged shell)
├── Header                      (client — EXISTING, VF)
├── <main id="main">
│   ├── CinematicSpine          (client — NEW, the only new client boundary)
│   │   ├── IntroHero           (server-rendered markup; motion owned by parent)
│   │   │   ├── HeroIdentity    (reuse existing Hero content model)
│   │   │   └── IntroOverlay    (client-driven reveal layer, §11)
│   │   ├── BuildCoreSection    (pinned/scrubbed)
│   │   │   ├── BuildCoreViewport   (pin/sticky wrapper + scroll progress)
│   │   │   ├── BuildCoreObject     (DOM strata + core slab)
│   │   │   ├── BuildCoreLabels     (mono state index + annotation labels)
│   │   │   ├── BuildCoreConnectors (SVG leader lines)
│   │   │   └── BuildCoreProgress   (thin progress rule)
│   │   └── ProductTransition   (Deployment → IELTS.mock frame + theme crossfade)
│   ├── IeltsMockFeature        (server — reveal surface + case study markup)
│   ├── Capabilities            (server — NEW consolidated, low-motion)
│   ├── About                   (server — NEW consolidated, low-motion)
│   └── Contact                 (server — EXISTING, VF, retained)
├── Footer                      (server — EXISTING, VF)
└── MobileCTA                   (client — EXISTING, VF)
```

**Component responsibility table:**

| Component | Responsibility | Server/Client | Data deps | Props | Animation ownership | Responsive ownership | A11y responsibility | Reusable? |
|---|---|---|---|---|---|---|---|---|
| `CinematicSpine` | Scroll progress, GSAP timeline, theme-crossfade state, reduced-motion branch | **Client** | Receives serialized data (no DB) | `{ hero, project, screenshots }` | **Owns** all spine motion | Owns md/lg/xl branches | Provides static accessible equivalent | No (single narrative) |
| `IntroHero` | Hero markup + intro reveal | Server markup / client reveal | `profile` (from `getSiteData`) | `{ profile, project }` | Partial (intro reveal via parent) | Owns layout | h1, landmark, real text | No |
| `BuildCoreSection` | Pinned section shell | Client | static config | `{}` (fully static) | Scrub only (via parent timeline) | Owns pin vs static branch | `aria-hidden` on decorative object + text equivalent | No |
| `BuildCoreObject` | Strata/slab DOM + transforms | Client (transform via refs) | none | `{ progress }` | Transform application | Owns tilt removal | `role="img"` + label | No |
| `BuildCoreLabels` | State labels/index | Client | none | `{ activeState }` | Opacity/reveal | Owns stacking | Real text, not aria-hidden | No |
| `BuildCoreConnectors` | SVG leader lines | Client | none | `{ activeState }` | Stroke draw-in | Owns length | `aria-hidden="true"` | No |
| `ProductTransition` | Deployment→frame→screenshot + theme | Client | `project.image`, theme tokens | `{ project }` | Transform + theme crossfade | Owns full-bleed vs stacked | Frame alt text | No |
| `IeltsMockFeature` | Case study (what/why/capabilities/gallery/status) | **Server** | `project` (from CMS) | `{ project }` | None (CSS entrances) | Owns layout | Semantic sections, alt text | No |
| `Capabilities` | Services + skills editorial | **Server** | `services`, `skills` | `{ services, skills }` | None | Owns layout | Semantic, contrast | No |
| `About` | Story + workflow + education/achievements/goals | **Server** | `profile`, `experience`, `education`, `achievements` | `{ ... }` | None | Owns layout | Semantic | No |
| `Contact` | Channels + form | **Server** | `profile` | `{ profile }` | None (existing) | Existing | Existing (VF strong) | Yes (existing) |

**Key decisions (TD):**
- The homepage `page.tsx` **stays a server component**. It fetches `getSiteData()` once (**VF**: already `React cache()`-memoized, so layout + page share one read) and passes **plain serializable data** to `CinematicSpine`.
- No `"use client"` above the spine. Header/MobileCTA remain their own existing client islands.
- The spine does **not** fetch data client-side; it receives everything as props, eliminating a hydration/data-fetch risk.

---

## 3. Server / Client Boundaries

**Current client boundaries (VF):** `Header`, `Marquee`, `Rotator`, `MobileCTA`, `BackToTop`, `ContactForm`, `Toast`, `PortraitSlot`, `PortraitUpload`, admin components. The homepage sections are all server components.

**New required client boundary (TD):** `CinematicSpine` (and its children) — the only thing that genuinely needs runtime scroll/theme state.

**Avoidable client boundaries (TD):** `IeltsMockFeature`, `Capabilities`, `About`, `Contact` — these must **not** become client components. Their "entrance" motion is pure CSS (IntersectionObserver-driven if a threshold reveal is wanted, else the existing `.reveal` pattern — **VF**).

**Hydration risk points (OR + prevention):**
- Risk: the spine renders server HTML that differs from the first client render (progress starts at 0 vs mid-page on direct-link). **Prevention:** spine renders a **deterministic initial state** (ARRIVAL) server-side and only mutates via GSAP after hydration; use `useLayoutEffect` for initial measure and guard against `window` access server-side. No `Math.random`, no `Date`, no `window` in render.
- Risk: theme bootstrap (`data-theme`) vs spine's narrative theme. **Prevention:** spine does not write `data-theme`; it drives a **scoped** theme override (see §12), leaving the existing FOUC bootstrap (**VF**) authoritative.

---

## 4. Build Core DOM Architecture

**Object hierarchy (TD):**

```
BuildCoreViewport (sticky/pin wrapper, overflow: clip)
└── BuildCoreScene (transform parent: perspective + tilt)
    ├── CoreSlab            (div — stable base "idea" plane)
    ├── StrataStack         (div — transform-origin: center)
    │   ├── Stratum.Prototype   (div)
    │   ├── Stratum.Review      (div)
    │   ├── Stratum.Inspect     (div)
    │   ├── Stratum.Test        (div)
    │   └── Stratum.Deploy      (div)
    ├── Connectors (svg)    (single inline SVG, 5 leader paths)
    ├── Labels (div)        (5 mono labels, absolutely positioned)
    ├── ProgressRule (div)  (thin fill bar)
    └── StateIndex (div)    (mono "00–04" indicator)
```

**Node budget (TD):** ~14 structural DOM nodes + ≤5 label nodes + 1 SVG with ≤5 paths + 1 progress bar. **No hundreds of decorative nodes.** Each stratum is a single `<div>`; wireframe vs solid is a CSS class, not extra nodes.

**Division of responsibility (TD):**

| Concern | Owner |
|---|---|
| Strata geometry (planes, borders, radius, wireframe/solid) | CSS (`.stratum`, `.stratum--pending`, `.stratum--active`, `.stratum--sealed`) |
| Depth/transform (translateZ, scale, separation) | CSS custom properties driven by GSAP (`.stratum { transform: translateZ(var(--z,0)) translateY(var(--dy,0)) }`) |
| Leader lines / stroke draw-in | SVG `<path>` with `stroke-dasharray` animated |
| Seam "zip" + validation ticks | CSS pseudo-elements (`::before`/`::after`) or SVG |
| Accent sealed seam | CSS `border-color` / `box-shadow` inset |
| State index / labels | Real text nodes |

**Transform hierarchy (TD):**
- `BuildCoreScene` carries `perspective` + the single tilt `rotateX(6deg) rotateY(0)` (desktop only).
- Each `Stratum` carries its own `translateY/translateZ/opacity` in its local coordinate space (isolation: `transform-style: preserve-3d` only on the stack, `isolation: isolate` on siblings).
- `transform-origin: 50% 100%` on strata so separation fans from the base (reads as "layers lifting off the core"), not the center.

**Stacking contexts (TD):** each stratum is its own stacking context (`isolation: isolate`); z-order = DOM order (Prototype lowest, Deploy top). Accent seams render inside their stratum so they never bleed across layers.

**Overflow (TD):** `BuildCoreViewport { overflow: clip }` so exploded strata never cause horizontal/vertical page overflow during scrub (**VF** the site already uses `overflow-x: clip` at the html/body level as a safety net).

---

## 5. Build Core State Model

Deterministic, data-driven (TD). A single `state` value `0..4` maps to `ARRIVAL | PROTOTYPE | CODE_REVIEW | VALIDATION | DEPLOYMENT`. **All visual attributes derive from one small explicit table** — no ad-hoc animation branches.

| Attribute | ARRIVAL | PROTOTYPE | CODE_REVIEW | VALIDATION | DEPLOYMENT |
|---|---|---|---|---|---|
| Core slab | visible, dim | visible | visible | visible | merges |
| Strata wireframe→solid | all wireframe | Prototype solid | Prototype+Review+Inspect solid | all solid | all solid, compressed |
| Plane separation (`--dy`) | 0 | 6px | 28px (max) | 6px (re-align) | 0 (merged) |
| Plane z (`--z`) | 0 | 8px | 40px | 8px | 0 |
| Plane opacity | 0.45 | active 1.0 / pending 0.55 | active 1.0 / pending 0.7 | 1.0 | 1.0 (collapsed) |
| Label visibility | index only | `01 PROTOTYPE` | all 5 labels | 4 step labels (sealed) | `04 DEPLOYMENT` |
| Connector visibility | hidden | 1 leader | 5 leaders (draw-in) | leaders fade to seams | hidden (merged) |
| Validation marks | none | none | none | seam ticks ×4 | sealed surface |
| Accent seam | none | none | edge highlight on inspected | seam accent on all joints | single sealed accent seam |
| Camera tilt | 6° | 6° | 4° | 4° | 0° |
| Object scale | 0.96 | 1.0 | 1.02 | 1.0 | 1.0 |
| Theme | dark | dark | dark | dark | dark→light handoff |

**Interpolation rule (TD):** between states, GSAP tweens the numeric channels (`--dy`, `--z`, opacity, tilt, scale); discrete attributes (wireframe/solid class, label text, validation ticks) switch at state boundaries with short (≤0.15s-equivalent) crossfades. This keeps the object *always in a coherent configuration*, never a half-broken state.

---

## 6. Scroll Progress Model

One normalized progress `p ∈ [0,1]` for the full Build Core → Deployment timeline (TD). The pin covers **~5 viewport-heights** of scrub (Phase 1: total pinned scroll ≤ 6×vh).

**Threshold mapping (TD):**

| Range | State | Notes |
|---|---|---|
| 0.00 – 0.14 | ARRIVAL | object settles; ~hold |
| 0.14 – 0.34 | PROTOTYPE | first lift |
| 0.34 – 0.58 | CODE REVIEW | max separation |
| 0.58 – 0.76 | VALIDATION | re-align + seal |
| 0.76 – 1.00 | DEPLOYMENT | merge + hand off to ProductTransition |

**Transition overlap (TD):** each state transition overlaps the previous by **0.04** (e.g. Arrival→Prototype blends across 0.12–0.16). Within the overlap, numeric channels tween; discrete switches occur at the mid-point (0.14).

**Hold periods (TD):** ARRIVAL holds for the first ~0.10 (the object is at rest before motion begins); no other holds — the sequence should feel continuous, not stop-motion.

**Determinism requirements (TD):**

- **Slow scroll:** progress is a pure function of scroll position → identical result regardless of speed.
- **Fast scroll / scrollbar jump:** same function; no velocity-based state, so a jump lands at the correct configuration instantly.
- **Reverse:** the function is invertible by construction (monotonic scrub), so reversing replays the exact inverse.
- **Direction change mid-tween:** GSAP scrubbed timelines are position-driven (not duration-driven), so they handle direction reversal natively — the blueprint relies on `scrub` (not `scrub: 1` smoothing that would introduce lag). Prefer `scrub: true` (direct) for determinism.
- **Resize/reflow:** `ScrollTrigger.refresh()` + `invalidateOnRefresh` so `start`/`end` recompute; numeric state re-derives from the new scroll position (no cached absolute offsets).

---

## 7. GSAP Decision

**Final recommendation (TD): APPROVE GSAP + ScrollTrigger**, scoped to the cinematic spine only.

**Evaluation against actual needs:**

| Need | GSAP+ScrollTrigger | Zero-dependency (`sticky` + rAF + IntersectionObserver) |
|---|---|---|
| Pinned timeline complexity | Native `pin`, `scrub`, start/end | Hand-rolled pin spacing + scrub math |
| Scrub synchronization | Built-in, position-driven | Manual scroll→progress mapping |
| Reverse scrolling | Native, monotonic | Manual (doable but error-prone) |
| Direction changes | Native (position-driven) | Manual |
| Resize handling | `invalidateOnRefresh` + `refresh()` | Manual re-measure |
| Reduced-motion branching | `ScrollTrigger.matchMedia()` / `gsap.matchMedia()` | Manual media-query branching |
| Maintainability | One declarative timeline, widely understood | More bespoke code, higher bus-factor |
| React 19 / Next 16 | `useGSAP` + `gsap.context()` scoping is the established pattern | N/A |
| Bundle cost | ~`gsap`+`ScrollTrigger` ≈ 20–24 KB gzip (unlicensed concern applies to commercial reuse — see OR) | ~0 KB |
| Cleanup | `ctx.revert()` | manual listener cleanup |
| Mobile disabling | `matchMedia` | manual |
| Timeline sequencing | One coherent timeline | multiple observers/state machines |

**Conclusion:** GSAP + ScrollTrigger is the right tool for **one pinned, scrubbed, stateful, multi-property timeline with a reduced-motion branch and a seamless hand-off** — precisely the Build Core + ProductTransition spine. The zero-dependency path is *feasible* but materially more hand-rolled code for lower fidelity and higher maintenance risk.

**Allowed scope (TD — hard boundary):**
- `BuildCoreSection` pinned/scrubbed timeline.
- `ProductTransition` transformation.
- The theme-crossfade scrub (if implemented via GSAP values — see §12).

**Explicitly NOT allowed (TD):** GSAP for trivial fades, section entrances, nav, buttons, the marquee/rotator, or any editorial section. Those use existing CSS / IntersectionObserver (**VF** pattern).

**License note (OR):** GSAP is free for many uses but the **"no-charge" terms exclude some commercial products**. Muhammad's portfolio is a personal/marketing site (self-promotion, not a paid software product), which typically falls within no-charge use — but this must be confirmed against the current GSAP license before shipping. This is a real risk to flag, not a blocker for a portfolio.

**Install status (TD):** NOT installed in Phase 2.

---

## 8. GSAP Timeline Architecture

**Structure (TD):** **one master timeline** for the entire spine (Build Core + ProductTransition), driven by **one ScrollTrigger**, with `matchMedia`-scoped variants. Not a chain of independent ScrollTriggers.

```
// conceptual (not shipped in Phase 2)
gsap.matchMedia()
  .add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: buildCoreRef,
        start: "top top",
        end: "+=" + SPINE_DISTANCE,        // ≈ 5 × viewport height
        pin: true,
        scrub: true,                         // direct, deterministic
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
      defaults: { ease: "none" },            // scrub ⇒ linear position mapping
    });
    tl
      // ARRIVAL..DEPLOYMENT strata tweens (CSS var --dy/--z, opacity, tilt, scale)
      // DEPLOYMENT merge
      // ProductTransition: frame expand + screenshot scale + theme crossfade
    ctx.add(tl); // via gsap.context scoping
    return () => {}; // matchMedia revert
  })
  .add("(prefers-reduced-motion: reduce)", () => { /* static path, no timeline */ })
  .add("(max-width: 767px)", () => { /* mobile: no pin — see §9 */ });
```

**Ownership rules (TD):**
- **`scrollTrigger` owned once**, inside `CinematicSpine`; children expose refs, not their own triggers.
- **`scrub: true`** (direct) for determinism; do **not** use `scrub: 1`/`scrub: 2` smoothing (introduces lag/desync on fast scroll).
- **`pin: true`** only on the desktop variant. Pin spacing is ScrollTrigger's responsibility; never hardcode pin spacer height.
- **`invalidateOnRefresh: true`** so resize re-measures start/end.
- **Start/end:** `start: "top top"`, `end: "+=" + spineDistance` where `spineDistance = 5 * 100vh` (in px at runtime for reliability).

**Cleanup / React integration (TD):**
- Use `useGSAP` (`@gsap/react`) or `useLayoutEffect` + `gsap.context(() => {...}, scopeRef)`. `ctx.revert()` on unmount/cleanup.
- All refs scoped to the spine; no global selectors (`gsap.to(".stratum")` is forbidden — use scoped refs).
- Guard against SSR: instantiate the timeline only after mount (inside the effect), never during render.

**Media-query handling (TD):** `gsap.matchMedia()` (or `ScrollTrigger.matchMedia()`) owns the desktop / tablet / mobile / reduced-motion branches. Each branch is fully self-contained and reverted on breakpoint change — no leaked listeners.

---

## 9. Responsive Motion Architecture

**Three explicit branches (TD), not CSS-hiding:**

| Breakpoint | Pin | 3D | Choreography |
|---|---|---|---|
| **Desktop ≥ 1024px** | Yes (one pin, 5×vh) | Yes (≤6° tilt) | Full scrubbed states + ProductTransition |
| **Tablet 768–1024px** | **No pin** (or pin only if validated — see OR) | No | Scrubbed states with halved separation, no tilt, natural scroll (sticky-free) |
| **Mobile ≤ 767px** | **No** | **No** | No scrub; Build Core = **static stacked diagram** (all 5 states visible, labels shown); normal document flow |

**Architectural branching (TD):**

- The **render tree** is shared; the **motion branch** is selected by `matchMedia` at runtime. This means the DOM/markup is identical across breakpoints (good for hydration + a11y), and only the *animation configuration* differs.
- Desktop-only tilt/scene wrapper uses CSS `@media` to disable `perspective`/`transform` below 1024px (a CSS concern), while `matchMedia` disables the *timeline*.
- **Mobile "simplified diagram":** the same strata render as a compact stacked figure (fixed small separation, all labels visible) — achieved by setting the final static transform configuration and never attaching a ScrollTrigger. This preserves meaning without re-implementing the object.
- **Tablet decision (OR):** the recommendation is **no pin on tablet** (pin on mid-size screens is the highest-friction case for scroll feel). If Phase 3D validation shows acceptable performance, a *reduced-distance* pin may be reconsidered — but the default is unpinned.

---

## 10. Reduced-Motion Architecture

**Detection (TD):** `window.matchMedia("(prefers-reduced-motion: reduce)")`, read **once** at mount inside the spine and passed down; **also** used to gate the GSAP `matchMedia` branch (GSAP's own `prefers-reduced-motion` support via `matchMedia`). No `prefers-reduced-motion` value is needed server-side — the static path is the *same markup*, so SSR HTML is already correct for reduced-motion users before hydration.

**Layout / flicker avoidance (TD):**
- The reduced-motion render is **the same DOM** as the full-motion render, in a static configuration. There is **no pin** and **no blank pinned region** (pin is only created by the desktop timeline, which is never instantiated under reduced motion). This is the core guarantee: reduced-motion users never see a reserved pin spacer.
- No content is hidden; no `aria-hidden` on the accessible text equivalent.

**Per-sequence behavior (TD):**

| Sequence | Reduced-motion |
|---|---|
| Intro | Skipped; hero renders fully visible immediately |
| Build Core | Static stacked figure: all 5 strata + labels visible as an editorial diagram; `role="img"` + concise caption |
| Deployment → Product | Single static transition: diagram → screenshot with a simple opacity swap (no expansion/zoom) |
| Theme transition | Discrete swap at the boundary (single paint) |
| IELTS.mock reveal | Screenshots at final positions; no scale/mask animation |
| Entrances/feedback | Existing global rule (durations → 0.01ms, **VF**) |

**Guarantee (TD):** the reduced-motion page reads as a **normal premium editorial portfolio** — same content, same order, zero movement, zero blank pinned space.

---

## 11. Hero / Intro Architecture

**Decision (TD):** a **single intro layer over the hero**, not a separate route/loader.

- **Structure:** `IntroOverlay` is a `position: absolute; inset: 0` layer **on top of the already-rendered hero**. The hero content is in the DOM from first paint (SSR) — the intro only *reveals* it. There is **no content blocked behind a network fetch**.
- **Duration:** ~1–2s perceived: the overlay holds the dark canvas for ~0.6s then a line/mask reveal of the name (~0.4–0.6s) and CTAs fade in. Total ≤ ~1.5s.
- **No fake percentage, no spinner, no "loading" language.** The overlay is a branded dark surface with the wordmark (or just the canvas + a thin accent rule) — a *transition*, not a loader.
- **First vs repeat visit (TD):** use `sessionStorage` flag `__intro_seen` so the intro plays **once per session**. Returning visitors in the same session skip to the hero. This is a single-line, safe heuristic (not cookies, not localStorage identity). **OQ:** whether repeat *across* sessions (i.e., always show once per session vs once ever) is desired — default is per-session.
- **Reduced-motion:** overlay is never rendered; hero shows immediately.
- **SSR implications:** overlay renders as plain markup (opacity 1) server-side to avoid a flash; a `useEffect` adds the `is-intro-done` class that fades it out. If JS is disabled, the overlay must be **transparent/pass-through** (or `aria-hidden` + `pointer-events: none`) so content is never trapped. Simplest robust choice: overlay is `aria-hidden="true"` and `pointer-events: none` from the start (it is purely decorative), so even a stalled script cannot block the hero.

---

## 12. Theme Transition System

**Recommendation (TD): a section-scoped "narrative theme" overlay, layered on top of the existing token system — not a rewrite of theme handling.**

- **Existing facts (VF):** theme is `data-theme="dark|light"` on `<html>` + CSS custom properties (`--c-*`) + a FOUC bootstrap + a manual `ThemeToggle`. The manual toggle and `prefers-color-scheme` must keep working.
- **Design:** introduce a **`data-narrative-theme`** scoped attribute (or a `.theme-journey` wrapper element) that applies a **local** set of CSS custom properties overriding `canvas`/`surface`/`ink`/`accent` tokens *within the spine and the reveal sections only*. This is a **CSS custom-property scoping** problem, not a JS toggle.
- **Mechanics:** the light "editorial" values are defined once as tokens; the transition crossfades them. Two implementation options:
  1. **CSS-only bridge (REC default):** a fixed `background-color`/`color` transition on a `.theme-bridge` surface whose opacity is driven by the scroll progress (via GSAP, a single tween of a CSS var `--theme-progress: 0→1` that interpolates `color-mix()` values). This keeps the whole transition to **one numeric channel**.
  2. Gradient bridge: a full-bleed gradient overlay that dissolves — simpler but heavier paint. Use only if option 1 proves visually insufficient.
- **Stability on reverse scroll (TD):** because the theme value is a **pure function of scroll progress** (one var, monotonic in `p`), reversing scroll reverses it deterministically. No timed toggles, no `setTimeout`.
- **Relationship to manual toggle (TD):** the narrative theme is applied **only within the spine+reveal wrapper** and **yields** to an explicit user theme choice. If the user has set `data-theme="light"`, the narrative dark opening does not fight it (the opening is still dark *as art direction* within its own scoped surface, but global chrome — header/footer — respects the user's choice). This is the cleanest compromise and avoids a hard dependency between the cinematic spine and the existing theme system.

---

## 13. IELTS.mock Reveal Architecture

**DOM/animation structure (TD):**

```
ProductTransition
└── ProductFrame          (div — the deployment "slab" that becomes the browser frame)
    ├── FrameChrome       (refined Device top-bar: dots + URL label — reuse Device language, VF)
    └── ScreenshotSurface (div, aspect-ratio 16/9, overflow: clip, transform-origin: top center)
        └── <Image />     (next/image, real home screenshot, object-cover object-top, priority)
```

**Specifications (TD):**

- **Frame structure:** a single div whose border/radius/bg transitions from the "product slab" to refined hairline chrome. `Device` (**VF**) is reused as a *visual reference*, but the reveal builds its own frame so the transformation is animatable.
- **Aspect-ratio:** `aspect-ratio: 16/9` on `ScreenshotSurface`; the image is `fill` (so it adopts the frame's ratio with zero CLS — the existing pattern, **VF**).
- **`next/image` strategy:** `fill`, `priority` (this is the LCP-adjacent hero asset), `sizes="(min-width: 1024px) 96rem, 100vw"`, default AVIF/WebP (**VF** configured). `object-cover object-top` to preserve the top-anchored crop.
- **Transform path:** `ProductFrame` starts centered at "slab" scale (~0.6, width ~40rem) and expands to full-bleed (`width: min(100%, 96rem)`); the image itself only does `scale 0.94 → 1` + `opacity 0 → 1`. **No filter animation** (no blur/contrast) on the image.
- **Clipping/masking:** `overflow: clip` on the frame; the "expand" is a `scale` + `width`-via-transform (not `width` property animation, which would trigger layout). To avoid layout-thrash, animate `transform: scale()` on a fixed-size surface and let `clip` reveal it.
- **Top anchoring:** `object-position: top` throughout — the UI's top nav bar stays in view during the reveal, keeping the interface recognizable.
- **Expansion behavior:** the frame expands horizontally toward the container and vertically to a comfortable height (≤ ~72vh), never distorting the 16:9 ratio (scale is uniform).
- **Reverse animation:** the entire path is scrubbed, so reversing scroll shrinks the frame back to the slab (deterministic).
- **Distortion guarantee (TD):** the screenshot is never skewed, rotated beyond a few degrees, cropped past its natural top crop, or filtered. Only `scale` + `opacity` + clip.

---

## 14. IELTS.mock Case Study Architecture

After the reveal, the case study is **server-rendered, low-motion editorial** (TD). Reuses the **existing** case-study content model (**VF**: `projects` table has `problem`, `approach`, `outcome`, `impact`, `features`, `gallery`, `tech`, `demo_url`, `github_url`, `status`).

**Structure (TD):**

1. **Overview** — title + one-line description + `impact` callout (existing data).
2. **Purpose / problem** — `problem` text (real: "two things are missing…").
3. **Capabilities** — `features` as a restrained list (the 4 modules + AI feedback + vocabulary), **not** an icon grid.
4. **Real screenshots** — `gallery` images in a layered editorial gallery (home dominant already shown in reveal; secondary = exam, plans).
5. **Status / result** — `status` ("Ishlab chiqilmoqda — faol davom etmoqda"), honest framing, **no fabricated metrics**.
6. **Technical details (optional)** — `tech` chips + `demo_url`/`github_url` buttons.

**Data source (TD):** all content comes from the existing CMS (`projects` via `getSiteData`/`getProjectById`); the only *static presentation* additions are section eyebrow labels and layout — no invented facts.

**Note:** this is the **homepage** case-study block. The existing full `/projects/[id]` page (**VF**) remains unchanged and remains the deep-dive destination.

---

## 15. Asset Strategy

**IELTS.mock screenshots (required — not fabricated):**

| Asset | Purpose | Target |
|---|---|---|
| Home | Primary reveal + hero | **2560×1440 min / 3840×2160 ideal** |
| Listening | Supporting gallery | 2560×1440 min |
| Reading | Supporting gallery | 2560×1440 min |
| Writing | Supporting gallery | 2560×1440 min |
| Speaking / AI feedback | Supporting gallery | 2560×1440 min |
| Plans / Results | Supporting gallery | 2560×1440 min |

**Format (TD):** capture lossless source (PNG), then serve optimized **AVIF** with **WebP** fallback via `next/image` (**VF** already configured for both). **No transparency needed** (screenshots are opaque full-bleed). Source PNGs stay in the repo or an asset store; only optimized derivatives ship to the browser.

**`next/image` sizing (TD):** home screenshot `sizes="(min-width: 1024px) 96rem, 100vw"` + `priority`; gallery screenshots `sizes="(min-width: 640px) 50vw, 100vw"` + lazy. Reuse the existing `deviceSizes` config (**VF**).

**Responsive variants (TD):** rely on `next/image` deviceSizes (420–1920) rather than hand-cutting variants.

**Portrait (TD):** if the portrait is used in the hero, require a **≥1600×2000** source (4:5) replacing the current DB-served low-res (**VF** `/api/media/portrait`). The existing `portraitOf()` fallback chain (**VF**) stays untouched.

**Preload/lazy (TD):** primary home screenshot = `priority` (LCP); everything else lazy; optional video (if later approved) is lazy + `poster` + `muted playsinline`.

**No AI-fabricated screenshots (TD).**

---

## 16. Typography Implementation

**Fonts preserved (TD):** Fraunces (display), Inter (body), JetBrains Mono (labels) — all already loaded via Fontsource (**VF**). **No new display font is necessary**; Phase 1 locked keeping them.

**CSS variable mapping (TD)** — extend the existing `@theme` (**VF**), not a parallel system:

| Role | Variable | Value (desktop / mobile) |
|---|---|---|
| Display / hero name | `--text-hero` | `clamp(3rem, 8vw, 7rem)` / `clamp(2.5rem, 14vw, 3.5rem)`, line 0.9, `-0.04em` |
| Section title | `--text-display-l` (existing) | `clamp(2.25rem, 4.5vw, 4rem)` / `clamp(1.75rem, 8vw, 2.5rem)` |
| Lead | `--text-lead` (existing) | `clamp(1.0625rem, 1.25rem)` line 1.66 |
| Body | `--text-body` (existing) | 0.9375rem, line 1.68, measure 60ch |
| Metadata | `--text-micro` (existing) | 0.6875rem, `+0.14em`, uppercase |
| Technical labels | `--text-micro` + tabular-nums | 0.75rem |
| CTA | `.btn` scale (existing) | unchanged |

**Rules (TD):** fluid `clamp()` everywhere; `text-wrap: balance` on headings and `pretty` on body (already set globally — **VF**); `font-optical-sizing: auto` on display. **No new font payload**, no new families, ≤6 type roles visible at once.

---

## 17. Grid / Spacing Tokens

**Tokens (TD — extend existing `body` CSS vars, VF):**

| Token | Value |
|---|---|
| `--container` | `80rem` (content max width) |
| `--media-max` | `96rem` (cinematic full-bleed width) |
| `--gutter` | `clamp(1.15rem, 4vw, 2.5rem)` (existing) |
| `--section-y` | `clamp(4.75rem, 2.6rem + 8vw, 9.75rem)` (existing) |
| `--cinematic-y` | larger padding for pinned/cinematic sections (e.g. `clamp(6rem, 10vw, 12rem)`) |
| `--measure` | `60ch` (body) / `36rem` (lead) |
| mobile padding | `--gutter` floor 1.15rem |

**Rules (TD):** content columns = 12-col (existing `.bento` mental model); media may exceed `--container` up to `--media-max`; text never exceeds `--container`. **No arbitrary per-section spacing** — all spacing derives from the token set.

---

## 18. Navigation Behavior

**Adaptation (TD):** the existing glass-pill header (**VF**) is retained; its only change is **theme-aware contrast within the narrative journey**.

- **Dark hero / Build Core:** header keeps the dark glass treatment (current behavior).
- **Theme transition:** header background crossfades to the light `surface` via the **same scoped `--theme-progress` channel** (§12) so the whole chrome transitions coherently. Header *itself* does not own a separate animation.
- **Light editorial:** header uses light glass; contrast re-verified (the existing light-theme header rules are already defined — **VF**).
- **Sticky/fixed:** unchanged (`position: fixed`, pill, `is-solid` on scroll — **VF**).
- **Active-state logic:** unchanged (IntersectionObserver section tracking — **VF**). The section IDs map to the new 7-beat structure.
- **Reduced-motion:** header switches discretely with the theme; no scroll-linked background animation.
- **No gimmicks:** no hide-on-scroll, no shrink-to-logo, no cursor effects.

---

## 19. Editorial Sections (Capabilities / About / Contact)

**All three are server components, low-motion (TD).**

| Section | Server/Client | Data source | Reusable components | Motion level | Section tokens | Mobile |
|---|---|---|---|---|---|---|
| Capabilities | Server | `services`, `skills` (CMS) | `Card`, `Icon`, `SectionHead` (existing) | CSS entrances only | light `surface`, `--section-y` | single column |
| About | Server | `profile`, `experience`, `education`, `achievements` | `Card`, `SectionHead` | CSS entrances only | light, `--section-y` | single column |
| Contact | Server | `profile` | Existing `Contact` + `ContactForm` (**VF**) | none (existing) | light, sunken | existing |

**Rule (TD):** **no GSAP timelines** in these sections. Entrances use the existing `.reveal` / IntersectionObserver pattern (**VF**) or simple CSS. They consume CMS data read-only and do not import any motion module.

---

## 20. Performance Budget

| Metric | TARGET | WARNING | FAIL |
|---|---|---|---|
| JS added by redesign (gzip) | ≤ 35 KB | 36–50 KB | > 50 KB |
| Total first-load JS | ≤ 250 KB | 250–300 KB | > 300 KB |
| GSAP + ScrollTrigger (if approved) | ≤ 24 KB | 24–30 KB | > 30 KB |
| Continuous animation loops | 0 permanent | ≤ 1 (spine scrub only) | > 1 |
| Layout reads/writes in scroll path | 0 (transform/opacity only) | 1–2 batched via rAF | unbatched writes |
| Initial-viewport image payload | ≤ 400 KB | 400–800 KB | > 800 KB |
| Total screenshot payload (all modules) | ≤ 1.2 MB (lazy) | 1.2–2 MB | > 2 MB |
| Font families | 3 (unchanged) | 4 | > 4 |
| Build Core DOM nodes | ≤ 20 | 20–40 | > 40 (decorative) |
| Pinned scroll distance | ≤ 6 × viewport | 6–8× | > 8× |

**Rule (TD):** transform/opacity-only motion; no permanent loops; lazy below fold; controlled client boundaries (§3). Any effect with disproportionate cost for marginal narrative value is **rejected**.

---

## 21. Accessibility Requirements

- **Semantic headings:** `h1` (hero name) → one `h2` per beat → `h3` for cards. Maintained across the 7 beats.
- **Landmarks:** `<header>`, `<main>`, `<footer>`, `<nav aria-label>`, section landmarks preserved.
- **Keyboard:** skip-link (**VF**), focus-visible rings (**VF**), no focus traps introduced (the spine adds no modal), scroll-spine is **not** keyboard-dependent (content is scrollable normally).
- **Link/button semantics:** CTAs are `<a>`/`<button>`; the build-core object is **not** interactive (no tab stops inside it).
- **Screenshot alt text:** each real screenshot gets descriptive alt (e.g. "IELTS.mock — home screen with practice modules"). The decorative frame/chrome is `aria-hidden`.
- **Decorative SVG:** connectors, seams, progress rule are `aria-hidden="true"` + `focusable="false"`.
- **Build Core screen-reader behavior (TD):** the animated object is `role="img"` with an `aria-label` summarizing the diagram; a **visually-hidden textual equivalent** lists the 5 real workflow steps in order (the facts from `profile.workflow`, **VF**). Screen readers get the *meaning*, not the animation.
- **Reduced-motion:** §10 (static path, no blank pin region, no hidden content).
- **Contrast:** narrative dark/light surfaces use the existing AA-verified tokens (**VF**); re-verify the transition mid-state and light chrome.
- **Theme transition:** no flashing (`prefers-reduced-motion` → discrete swap; no >3 flashes/second during crossfade).

---

## 22. SEO / Metadata Preservation

**No SEO rewrite in Phase 2. Risks to monitor (OR):**

- The cinematic spine adds **client-rendered transforms** — but all text content stays in SSR HTML, so crawlers see the full narrative. **Prevention:** keep all copy in server markup; never put real content inside Canvas/WebGL (none is used) or behind a client-only mount.
- Existing `metadata` (`generateMetadata`, **VF**), JSON-LD Person (**VF**), `opengraph-image`, `icon`, `robots`, `sitemap`, canonical (**VF**) are **not touched**.
- Locale routes: i18n (**VF**) is preserved; new UI strings (state labels, section headings) must be added to `messages.ts` in all 3 locales.
- **Hydration-first-paint text:** the hero name must be present in SSR HTML (it is — overlay only reveals, §11), so LCP text and social previews are unaffected.

---

## 23. CMS / Backend Integration

**Separation principle (TD): CONTENT DATA ≠ PRESENTATION/MOTION STATE.**

- `CinematicSpine` receives **serialized content** (hero fields, the featured project, screenshot URLs) as props from the server `page.tsx`. It does **not** import `@/lib/content`, `@/db`, or any API.
- Motion state (scroll progress, active build state, theme progress) is **ephemeral, client-only**, derived from scroll — never persisted, never sent to the backend.
- The CMS (schema, admin, API factory, `getSiteData`) is **not redesigned**. No new tables are required for Phase 2's scope (screenshots are static assets or existing `projects.image`/`gallery` fields — **VF**).
- If richer per-module screenshot data is ever needed, it can be a *future* `gallery`/media extension; **not** in this blueprint's scope.

---

## 24. Deferred Technical Debt

From Phase 0 (**VF**). **Not fixed now; addressed at a designated later point** (folded into Phase 3H integration cleanup):

| Debt | Address in |
|---|---|
| Dead CSS (`.hero-process`, `.hero-stats`, `.skills-strip`) | Phase 3H (after new sections stabilize) |
| Unused `next-auth` dependency | Phase 3H (with lockfile-only change + smoke re-run) |
| `force-dynamic` vs ISR/SSG contradiction (esp. `/projects/[id]`) | Post-launch rendering-strategy task (separate from the redesign; do not entangle) |

---

## 25. Failure Mode Matrix

| Risk | Cause | Prevention | Validation |
|---|---|---|---|
| Hydration mismatch | Spine renders client-only initial state | Deterministic SSR initial (ARRIVAL); no `window`/`Math.random` in render | `next build` + manual "no console hydration error" check |
| ScrollTrigger lifecycle bug | Unreverted triggers on unmount/route-change | `gsap.context()` + `ctx.revert()` + `matchMedia` scoping | Route navigation + unmount check; no stray listeners |
| Pinned-section height issues | Pin spacer miscalc / content resize | `invalidateOnRefresh`, `anticipatePin`, no hardcoded height | Resize browser during pin; verify no gap/overlap |
| Mobile accidental pinning | Desktop timeline leaks to mobile | `matchMedia` branch strictly ≤767px = no pin | 375px/430px manual + device mode |
| Reverse-scroll desync | Smoothing (`scrub: 1`) or velocity state | `scrub: true` direct; progress = f(scroll) | Fast up/down scroll; scrollbar jump |
| Screenshot aspect-ratio bug | Wrong `object-fit`/ratio | `aspect-ratio: 16/9` + `fill` + `object-top` | Verify no stretch/letterbox at all widths |
| Dark/light contrast failure | Mid-transition low contrast | Tokens AA-verified; re-check transition midpoint | Contrast audit at ~50% theme progress |
| Reduced-motion blank space | Pin spacer reserved under reduced motion | Pin never instantiated under reduced motion | Emulate reduced-motion; confirm no blank region |
| Image payload regression | 4K assets unoptimized | `next/image` AVIF + sizes + lazy | Lighthouse; network tab |
| Layout shift (CLS) | Reveal changing layout | aspect-ratio reserved; transform-only animation | Lighthouse CLS + visual |
| Route/data coupling | Spine importing CMS directly | Props-only serialized data | Code review: no `@/lib/content` import in spine |
| Browser differences (Safari/Firefox) | CSS-3D/`color-mix`/scroll features | Feature-detect + static fallback (existing pattern) | Cross-browser matrix (§27) |

---

## 26. Phase 3 Implementation Breakdown

*(Refined from Phase 1's suggested order. NOT executed now.)*

| Phase | Scope | Files likely touched | Acceptance criteria | Risks | Must NOT do |
|---|---|---|---|---|---|
| **3A — Foundation** | Extend tokens (cinematic, media, typography); add `messages.ts` strings (3 locales); scaffold `CinematicSpine` skeleton (static) | `globals.css`, `messages.ts`, new `components/cinematic/*` | Build passes; tokens render; no visual change to existing sections | Token collisions | Change existing sections; touch CMS |
| **3B — Build Core static object** | Render strata/slab/labels/connectors as static diagram (all states visible) | `cinematic/BuildCore*` | Object renders correctly dark; mobile diagram correct; a11y text present | DOM bloat | Add motion |
| **3C — Build Core motion** | GSAP timeline, pin/scrub, 5-state tween, matchMedia branches | `cinematic/BuildCore*`, `CinematicSpine` | Deterministic scrub; reverse correct; reduced-motion static; resize stable | Pin/scroll bugs | Animate outside spine |
| **3D — Deployment → IELTS.mock reveal** | ProductFrame expand + screenshot + theme crossfade | `cinematic/ProductTransition*` | Seamless hand-off; screenshot undistorted; theme stable on reverse | Aspect/contrast | Filter animation on image |
| **3E — IELTS.mock case study** | Server editorial case block (content from CMS) | `components/IeltsMockFeature` (new server) | Case renders; gallery hierarchy; honest status | Fake metrics (must not add) | Client-ify it |
| **3F — Editorial sections** | Build Capabilities + About (consolidate existing data) | `components/Capabilities`, `components/About` (rewrite) | Sections render; no progress bars/icon grids | Content loss during consolidation | Delete `Approach`/`Skills`/`Experience` data |
| **3G — Mobile / reduced-motion** | Verify branches, static diagram, no-pin mobile, discrete theme | cross-cutting | 375/430/tablet clean; reduced-motion = editorial | Accidental pin | Hide content |
| **3H — Integration polish** | Deferred debt cleanup, perf/a11y validation, smoke + Lighthouse | cleanup list (§24) | 0 lint/type errors; smoke green; budgets met | Regression | New features |

**Each phase ends with a rollback point** (§28).

---

## 27. Testing Strategy

| Check | Type | Method |
|---|---|---|
| Desktop Chromium (1440) | MANUAL + RUNTIME | Dev server + browser; verify scrub/pin/reveal |
| Desktop Firefox | MANUAL | Scroll determinism, CSS-3D, `color-mix` |
| Desktop Safari (if env) | MANUAL | Same; esp. scroll performance |
| 375px / 430px mobile | MANUAL + VISUAL | Device mode + real device if available; no pin, readable screenshots |
| Tablet 768–1024 | MANUAL | Unpinned choreography |
| Reduced-motion | MANUAL + RUNTIME | Emulate; confirm static editorial path, no blank region |
| Keyboard | MANUAL | Tab order, skip-link, no focus traps |
| Resize / reflow | MANUAL + RUNTIME | Resize during pin; `ScrollTrigger.refresh` |
| Fast scroll / scrollbar jump | MANUAL | Deterministic landing state |
| Reverse scroll | MANUAL | Exact inverse replay |
| Direct navigation (mid-page anchor) | MANUAL | No broken initial state |
| Locale variants (uz/en/ru) | AUTOMATED (smoke) | `npm run smoke` extended to new strings |
| Screenshot load failure | MANUAL | `next/image` fallback; alt text present |
| CLS / LCP / TBT | AUTOMATED (lighthouse) | `npm run perf:lighthouse:*` |
| Build / type / lint | AUTOMATED | `npm run build`, `typecheck`, `lint` |

---

## 28. Preview / Git Strategy

**Rules (TD), recorded for Phase 3+:**

- All work on an **isolated feature branch** (this session's `arena/01a07900-muhammad-portfolio`; future implementation may use a new derived branch — but never `main`).
- **`main` untouched** throughout; baseline SHA recorded: **`062caddda293ccae04c004648ea93e514982cb0f`**.
- **Preview environment only** (e2b/Arena live preview); **no Production deployment**, no production homepage change.
- **Small, reviewable commits**, one logical change per commit; evidence (screenshots/Lighthouse output) attached per phase.
- **Rollback point after every approved phase** (a tagged/noted commit to revert to).
- No dependency installs in Phase 2; GSAP install (if approved) happens **only at the start of Phase 3C** with the decision documented.

---

## 29. Locked Decisions

1. Seven-beat homepage; cinematic spine is the only new client boundary.
2. Build Core = DOM + SVG + CSS transforms/CSS-3D (no Canvas/WebGL).
3. GSAP + ScrollTrigger **approved in scope** (Build Core + ProductTransition + theme crossfade only) — pending the license note in §7.
4. One master timeline + one ScrollTrigger + `matchMedia`; `scrub: true` (direct); `invalidateOnRefresh`.
5. Scroll progress model: 5 states, thresholds in §6; pinned distance ≤ 6×vh.
6. Desktop pinned; tablet/mobile unpinned; mobile = static diagram.
7. Reduced-motion = static editorial path (no pin, no blank region, content preserved).
8. Theme = scoped narrative overlay via one `--theme-progress` channel; yields to manual toggle.
9. IELTS.mock reveal = frame expand + uniform scale/opacity; no filter animation; top-anchored undistorted screenshot.
10. Editorial sections (Capabilities/About/Contact) remain server components, no GSAP.
11. Assets: stills-first, AVIF/WebP via `next/image`, home screenshot `priority`; no AI-fabricated screens.
12. CMS/backend, SEO metadata, i18n, a11y layer, tokens, Icon/Card/Device, Header/Footer/MobileCTA — all preserved.

## 30. Open Risks

1. **GSAP licensing** for commercial self-promotion (confirm no-charge terms before ship) — OR.
2. **Tablet pin** decision (default unpinned; may revisit) — OR.
3. **Intro repeat policy** (per-session vs once-ever) — OQ.
4. **`color-mix()`/CSS-3D cross-browser** coverage; feature-detected fallback required — OR.
5. **Higher-resolution screenshots not yet captured** — the reveal is specced but will render with current 1376×768 (**VF**) until new assets land; do not ship aggressive full-bleed with the current files.
6. **Reduced-motion + manual theme toggle interaction** at the transition boundary — needs a validation pass.

## 31. Phase 3 Readiness

**The creative + technical direction is ready for implementation planning → Phase 3 can begin**, with these preconditions:

- **GSAP decision confirmed** (approve scope + license check) before Phase 3C.
- **New screenshots captured** before Phase 3D/3E ship (or ship with a visibly-limited reveal and upgrade assets later).
- **OQ items** (§30) resolved where they block code (intro repeat policy, tablet pin).

*End of Phase 2. No homepage redesign implemented. No dependencies installed. Phase 3 is NOT started.*
