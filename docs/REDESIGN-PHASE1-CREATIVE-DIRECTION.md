# PHASE 1 — Creative Direction Lock

**Date:** 2026-09-06
**Branch:** `arena/01a07900-muhammad-portfolio`
**Commit (baseline):** `062caddda293ccae04c004648ea93e514982cb0f`
**Baseline audit:** `docs/REDESIGN-PHASE0-AUDIT.md`
**Scope:** Creative direction + storyboard + design specification ONLY. No implementation. No `main` / Production changes.

> Labels used: **VF** = VERIFIED FACT (from Phase 0 audit / code), **DD** = DESIGN DECISION (locked), **REC** = RECOMMENDATION, **OQ** = OPEN QUESTION (requires approval).

---

## 1. Executive Creative Direction

**One-line direction (DD):**

> *A dark, cinematic "build process" that physically resolves into Muhammad's real product — then opens into a warm, editorial account of who he is and what he can do.*

The redesign fuses three influences into a single, coherent experience:

1. **Averlo-quality editorial discipline** — confidence from type, whitespace, hierarchy, and pacing, not from decoration.
2. **Cinematic energy from the video reference** — full-screen media treatment, scale, masking, and reveal transitions used as *storytelling*, not as a demo reel.
3. **Muhammad's real identity** — the "build → inspect → test → ship" workflow, the facts-only voice, the lime-on-dark editorial identity, and IELTS.mock as the single honest proof of work.

**The emotional arc (DD):** the visitor moves from *dark focus* (who he is, how he builds) → *revelation* (the build literally becomes the product) → *warm clarity* (what he can do, who he is, how to hire him). Every visual decision is subordinate to this arc.

**Guiding sentence (DD):** the site must say **"I build, inspect, test and ship real products"** — never **"I make flashy animations."** Motion is a delivery mechanism for that message, never the message itself.

---

## 2. Narrative Strategy

The homepage tells **one continuous story** in five acts (DD):

```
ACT 1 — WHO HE IS        →  Intro / Hero
ACT 2 — HOW HE BUILDS    →  Build Core
ACT 3 — WHAT IT PRODUCES →  Build Core → IELTS.mock transition + reveal
ACT 4 — WHAT HE CAN DO   →  Capabilities
ACT 5 — WHO HE IS + HOW  →  About + Contact
```

The narrative is grounded in the **verified** facts from Phase 0:

- **VF** — Muhammad's real workflow (from `profile.workflow`): *"Talabni qog'ozga tushiraman → AI bilan tez prototip → har qatorni o'qib chiqaman → buzilganini topib tuzataman → brauzer/telefonda sinayman → Vercel'ga chiqaraman."*
- **VF** — One published project: IELTS.mock (the only honest proof point).
- **VF** — Facts-only policy: no invented clients, metrics, or testimonials.

**Narrative rule (DD):** the cinematic layer may *illustrate* the workflow but may never *exaggerate* the facts. If the real workflow has six steps, the visual metaphor collapses them into five *states* (below), each mapped to real steps — never adding a step that doesn't exist.

---

## 3. Final Homepage Structure

Seven narrative beats (DD — locked, replaces the existing ten-section rhythm):

| Beat | Name | Primary content | Theme |
|---|---|---|---|
| 01 | Intro / Hero | Muhammad · "Student & AI Developer" · one CTA | Dark |
| 02 | Build Core | The build-process visual system (5 states) | Dark |
| 03 | Deployment → Product | Build Core resolves into the IELTS.mock surface | Dark → Light (transition) |
| 04 | IELTS.mock Reveal | Cinematic product case study | Light |
| 05 | Capabilities | Editorial services + skills, evidence-led | Light |
| 06 | About | Story, mindset, workflow credibility, goals | Light |
| 07 | Contact | Strong editorial closing + working form | Light |

**Decisions locked from Phase 0 evaluation (DD):**

- **No separate "Selected Projects" section.** IELTS.mock is the only published project (**VF**); a separate section would be empty. The reveal *is* the projects section.
- **Skills + Experience + Education + Achievements are consolidated.** Skills/Experience merge into **Capabilities**; Education/Achievements/goals fold into **About**. The existing ten-section repetitive rhythm is intentionally eliminated.
- **Workflow/`Approach` content is integrated, not duplicated.** See §11.

---

## 4. Build Core Concept

### 4.1 Physical / visual identity (DD)

The Build Core is a **"build strata"** — a vertical stack of layered, physical-feeling planes that represent the product coming into being. It is a **new design system** (Phase 0 verified none exists — **VF**), invented now, but semantically bound to Muhammad's real workflow.

| Attribute | Specification |
|---|---|
| **Overall silhouette** | A centered stack of 5 rectangular "strata" planes above a single "core slab." Reads like an architectural/engineering layer model or a peeled blueprint stack — not a machine. |
| **Geometry** | Flat planes, 16:10 or 16:9 proportion, rounded `radius-3` (14px) corners. Thin (visually ~6–10px depth) edges. |
| **Layers** | 5 strata (one per build state) + 1 base "core" slab. Layers separate (explode) and re-seal across states. |
| **Material language** | Matte paper-like surfaces: in dark mode, planes are `surface-2`/`surface-3` with `line-1` hairline borders and a subtle inner top-light (`sh-1` inset). No glossy/neon. |
| **Depth** | Achieved by z-separation + soft drop shadows (`sh-2`/`sh-3`), and a light CSS-3D `perspective` tilt on desktop only. Depth is "diagram depth," not 3D object depth. |
| **Lighting** | Single implied top-left key light; accent (lime) used as a *highlight*, never as a glow fill. |
| **Surface treatment** | Wireframe (dashed `line-2`) = pending; solid (`surface-2`) = active; sealed (tight hairline + accent seam) = validated. |
| **Labels** | JetBrains Mono micro labels, placed on connector leaders, not on the planes themselves. |
| **Connectors** | 1px hairline leader lines (SVG) from each stratum to its label; accent-colored only when a stratum is the *active* state. |
| **Validation marks** | Small, restrained "joint ticks" (short 45° corner ticks or a tight seam line) — **not** green checkmarks, not emoji. |
| **State indicators** | A mono state index (e.g. `01 ARRIVAL`) + a thin progress rule that fills as states advance. |

**Aesthetic boundary (DD):** the object must feel *technical, precise, editorial, premium, physically-credible*. It must **not** resemble gaming UI, cyberpunk, a spaceship, a sci-fi HUD, a fake terminal, or neon tech.

### 4.2 Geometry / layer rationale (DD)

Each stratum corresponds to a **real** workflow concept (mapped from `profile.workflow`, **VF**):

1. **Prototype** stratum (base, wide) — "AI bilan tez prototip"
2. **Review** stratum — "har qatorni o'qib chiqaman"
3. **Inspect/Debug** stratum — "buzilganini topib tuzataman"
4. **Test** stratum — "brauzer/telefonda sinayman"
5. **Deploy** stratum (top, resolves to product) — "Vercel'ga chiqaraman"

The base **core slab** represents the *idea / requirement* ("Talabni qog'ozga tushiraman") and remains stable under everything — the fixed ground truth the build sits on.

---

## 5. Build Core State System

Five states (DD). Each state = a scroll-scrubbed segment inside one pinned section (see §12 for scroll mechanics).

### STATE 1 — ARRIVAL
- **What is visible:** the core slab alone, dim and low-detail, centered; five faint wireframe strata stacked above it, unlabeled; the headline "How I build" + a single supporting line.
- **Object state:** inert, "unassembled," low contrast against background.
- **Camera/composition:** centered, slight CSS-3D perspective tilt (desktop), generous vertical whitespace.
- **Typography relationship:** large Fraunces headline above; the object is the visual subject; mono micro-label `00 ARRIVAL`.
- **Motion:** gentle opacity/translate-in of the core + headline; strata are static (they "await" activation).
- **Scroll behavior:** short scrub (~0.4 viewport-height); object settles into pin.

### STATE 2 — PROTOTYPE
- **What is visible:** the 5 strata become distinct; the **Prototype** stratum turns solid (active); the other four remain wireframe (pending). Slight layer fan-out (z-spacing increases).
- **Object state:** "early construction" — some parts resolved, others pending. **Deliberately not "broken"**: pending = wireframe/dashed, active = solid. No cracks, no error glitches.
- **Motion:** strata separate by a few px (translateZ/translateY), active stratum lifts toward viewer; label leader appears.
- **Typography:** mono `01 PROTOTYPE`; a one-line Fraunces caption tied to the real step.
- **Scroll:** scrubbed; ~0.8 viewport-height.

### STATE 3 — CODE REVIEW
- **What is visible:** strata **explode** into a separated "inspection" view (largest separation). Leader lines extend to mono labels (`prototip`, `tekshiruv`, `test`, `deploy`). The **Review** and **Inspect/Debug** strata are solid/active; selected surfaces get a subtle accent edge (not a fill).
- **Object state:** "under inspection." Controlled annotation, relationship lines, layer separation. **No fake source code, no fake terminal** — only real step names.
- **Motion:** smooth separation; leader lines draw in (SVG stroke-dashoffset); active surface edge highlights.
- **Typography:** mono `02 CODE REVIEW`; annotation labels in JetBrains Mono micro.
- **Scroll:** scrubbed; ~1.0 viewport-height.

### STATE 4 — VALIDATION
- **What is visible:** strata **re-align and seal**. Wireframes become solid; joint seams tighten; small "seal ticks" appear where layers meet. Geometry resolves to clean alignment. The accent appears only as a thin "sealed" seam + a validation tick per joint.
- **Object state:** "tested, confident, resolved." Stability conveyed by alignment + restraint — **not** green checkmarks.
- **Motion:** strata converge (translate back to stack), seams "zip" shut (scaleY/height on seam lines), ticks fade in.
- **Typography:** mono `03 VALIDATION`; caption referencing real test step.
- **Scroll:** scrubbed; ~0.8 viewport-height.

### STATE 5 — DEPLOYMENT
- **What is visible:** the strata **compress/merge into a single finished "product slab"** that now reads as a **borderless browser/viewport frame** (a deliberate echo of the existing `Device` primitive — **VF** it exists and works). The object has transitioned from *process* to *product*.
- **Object state:** "delivered." One clean, resolved surface, framed, empty — ready to receive the real UI.
- **Motion:** strata fold down into one plane (scaleY collapse + fade), the resulting frame's edge resolves to a hairline; frame brightens slightly as it "lights up."
- **Typography:** mono `04 DEPLOYMENT`; the word "deploy" / a short release line.
- **Scroll:** scrubbed; the final frames of this state **hand off directly into Beat 03** (the IELTS.mock surface).

---

## 6. Build Core → IELTS.mock Transition

**Chosen approach (DD):** *"Deployment package opens into the real UI."*

The Deployment state's finished product slab **becomes** the IELTS.mock viewport. Specifically:

1. The merged product slab (empty browser-frame) holds steady at center.
2. The frame's hairline border **resolves into refined browser chrome** (reusing the `Device` top-bar language — URL label `ielts-mock-v2.vercel.app`, three dots — **VF** this already exists).
3. The frame **expands** from centered size toward a large, near-full-bleed product surface (width grows toward the media grid width).
4. **The real IELTS.mock home screenshot scales/fades in inside the frame, top-anchored, undistorted.** It appears as the *literal output* of the build, not a separately introduced asset.
5. The theme begins its **dark → light** transition here (see §8): the "lit finished product" brings the light.

**Rejected alternatives (and why):**
- *Simple crossfade* — weak; loses the "process → product" causation.
- *Geometry flying off / reassembling mid-air* — risks feeling like an animation demo, not a product.
- *Planes aligning into a screenshot grid* — visually clever but threatens screenshot integrity and reads as decorative.

**Screenshot integrity rule (DD):** the IELTS.mock UI is **never distorted, skewed, blurred, or cropped beyond its natural top-anchored `object-cover object-top` crop** (same treatment the current site already uses — **VF**). Scale/translate/opacity only.

---

## 7. IELTS.mock Presentation System

IELTS.mock is a **cinematic case study**, not a portfolio card. Sequence (DD):

1. **What it is** — one-line Fraunces statement ("Interactive IELTS prep: practice, review, AI feedback.").
2. **Why it exists** — the problem statement from the real seed data (**VF**: "two things are missing: a place to practice a lot, and someone who checks your answer").
3. **Product experience** — the **dominant HOME screenshot**, near-full-bleed, borderless product surface with refined browser chrome.
4. **Key capabilities** — the real four modules + AI feedback + vocabulary (**VF**: Listening/Reading/Writing/Speaking, result analysis, error review, vocabulary, AI improvement). Presented as a restrained editorial list, **not** a giant icon grid.
5. **Real interface** — secondary screenshots (exam, plans) as a **layered gallery** with clear hierarchy (home = dominant; others = supporting).
6. **Result / status** — honest "actively in development" framing (**VF** the site already states this; never fabricate user counts or scores).

### 7.1 Screenshot presentation system (DD)

| Surface | Treatment |
|---|---|
| **Home screenshot (primary)** | Borderless product surface, ~`min(100%, 72rem)` wide, top-anchored, dominant. One hero asset. |
| **Secondary screenshots** | Layered/stacked editorial gallery at reduced scale (~60–70% of hero), each in a thin hairline frame, top-anchored, with mono captions. |
| **Browser frame** | Used only at the transition (Beat 03) and the hero surface; refined, hairline chrome, not heavy skeuomorphism. |
| **Floating physical panel** | Rejected for hero (fragile on mobile); allowed sparingly for a single secondary "quote/metric" callout if content exists. |
| **Editorial crop** | Used for supporting screens in the gallery; never for the primary (keep UI legible). |

**Capture targets (DD — for later asset work, not fabricated now):** ≥ **2560×1440** minimum, **3840×2160** ideal; one clean capture per module (Home, Listening, Reading, Writing, Speaking/AI feedback, Plans/Results) so the reveal never upscales blurry source. Phase 0 confirmed current files are 1376×768 (**VF**) — insufficient for aggressive full-screen use.

### 7.2 Mobile principle (DD — locked from Phase 0)

- Show the **complete 16:9 home screenshot first**, full-width, undistorted (no squeezed desktop thumbnails).
- Then transition to a **simple stacked gallery / case-study flow** for secondary screens.
- No parallax, no per-screen pinning on mobile.

---

## 8. Theme Journey

**Chosen arrangement (DD):** the candidate direction is **adopted** — it is the strongest.

| Phase | Theme | Rationale |
|---|---|---|
| Beat 01 Hero + Beat 02 Build Core | **Dark cinematic** | Focus, depth, "the build process" as a technical act. |
| Beat 03 (Deployment → IELTS.mock) | **Dark → Light transition** | The "lit finished product" metaphorically turns on the light. |
| Beat 04 IELTS.mock → Beat 07 Contact | **Warm light editorial** | Readability and human warmth for capabilities, about, contact. |

**Transition mechanics (DD):**

- **Location:** the transition is **anchored to the deployment→product moment** (end of Beat 02 / start of Beat 03), and **completes** by the time the IELTS.mock surface is fully revealed. It is a *scroll-scrubbed* cross-fade of the theme token layer, not a timed toggle.
- **Background behavior:** the `canvas`/`canvas-sunken` background and grain layer cross-fade; the dark hairline grid (existing `.u-hero-lines` — **VF**) dissolves.
- **Typography adaptation:** text colors flow through the existing semantic tokens (`ink-1/2/3`, `accent-text`) — **VF** the token system already supports both themes — so type adapts automatically; the *accent* remains lime in both themes (existing behavior).
- **Build Core relationship:** Build Core lives entirely in dark; it is gone (resolved into product) before light arrives — no Build Core object appears in light mode.
- **IELTS.mock relationship:** the reveal begins in dark and settles into light; the product surface is theme-neutral (real screenshot) so it anchors both.
- **Later editorial sections:** entirely light. No further theme oscillation.
- **Reduced-motion / no-theme-tool users:** the theme transition degrades to a single discrete swap at the boundary (no scrubbed cross-fade). The existing `prefers-color-scheme` + manual toggle (**VF**) must still work and win over the "narrative" default for users who explicitly chose a theme.

---

## 9. Typography System

**Decision (DD): keep the existing three fonts** (Fraunces, Inter, JetBrains Mono — **VF** already loaded and identity-defining). No new font families; refine scale and roles.

| Role | Font | Desktop | Mobile | Notes |
|---|---|---|---|---|
| **Display / hero name** | Fraunces | `clamp(3rem, 8vw, 7rem)`, line 0.9, `-0.04em` | `clamp(2.5rem, 14vw, 3.5rem)` | Largest single statement on the page |
| **Section title** | Fraunces | `clamp(2.25rem, 4.5vw, 4rem)`, line 1.0, `-0.03em` | `clamp(1.75rem, 8vw, 2.5rem)` | One per beat |
| **Display-em accent** | Fraunces italic (SOFT/WONK) | same size as title | same | One emphasized word/phrase per headline only |
| **Lead** | Inter | `clamp(1.0625rem, 1.25rem)`, line 1.66 | 1.0625rem | Section intros |
| **Body** | Inter | 0.9375–1rem, line 1.68 | 0.9375rem | max measure ~60ch |
| **Metadata / labels** | JetBrains Mono | 0.6875rem, `+0.14em`, uppercase | same | Eyebrows, dates, roles |
| **Technical labels** | JetBrains Mono | 0.75rem, tabular-nums | same | Build Core annotations, state index |
| **CTA** | Inter semibold | 0.9375rem (btn-lg), 0.8125rem (btn-sm) | same | Existing `.btn` scale (**VF**) |

**Rules (DD):**
- Maximum **6 type roles** on the page at any moment (avoid type sprawl).
- Ghost section numerals (`section-head__index`, **VF** already exists) are **amplified** for editorial rhythm, capped at ~5% opacity.
- No oversized "wall-of-type" hero beyond the name; hero supports the name, does not compete with it.

---

## 10. Grid & Spacing

| Token | Value | Decision |
|---|---|---|
| Max content width | `80rem` (keep `--container`) | **DD** — editorial width |
| Cinematic media width | `min(100vw, 96rem)` full-bleed for the reveal surface | **DD** — media may exceed container; text never does |
| Major gutter | `--gutter: clamp(1.15rem, 4vw, 2.5rem)` (keep) | **DD** |
| Section vertical spacing | `--section-y: clamp(4.75rem, 2.6rem + 8vw, 9.75rem)` (keep), **plus** dedicated cinematic sections use larger custom padding for pinned sequences | **DD** |
| Text measure | `max-width: 60ch` for body; lead ≤ 36rem | **DD** |
| Desktop composition | 12-col grid (existing `.bento` mental model) for content sections; centered single-column for cinematic beats | **DD** |
| Tablet (768–1024) | Content → 2-col; cinematic beats → centered, reduced tilt; media → full-width | **DD** |
| Mobile (375–430) | Single column; media full-bleed; no pinning | **DD** |

**Whitespace philosophy (DD):** Averlo-level quality comes from *leaving space empty on purpose*. Empty space is a design asset; do not fill it.

---

## 11. Workflow / Credibility Decision

**Decision (DD): NO separate workflow beat.**

- **Reason:** a dedicated workflow section would **duplicate** the Build Core narrative (Build Core *is* the workflow, cinematically). Repeating it as a flat list weakens both.
- **Integration instead:** the factual credibility the cinematic metaphor cannot carry is moved into **About**, as a compact **"How I actually work"** block: the real six-step workflow text (**VF**), the "now building IELTS.mock" banner (**VF**, from `Experience.tsx`), and the honesty note. The existing `Approach` content (principles, goals-as-plans, honesty framing) folds into About as well.
- This removes the `Approach` section's standalone redundancy while **preserving 100% of its factual content**.

---

## 12. Motion Philosophy

Three categories, with a hard priority order (DD): **A (narrative) > B (feedback) > C (decorative)**.

- **A — NARRATIVE (highest):** Build Core transformations; Build Core → IELTS.mock; theme transition; the reveal; major section entrances. These are the *only* places large motion is permitted.
- **B — INTERACTION FEEDBACK (secondary):** links, nav active states, buttons, hover/focus, project interactions. Keep the existing crisp transitions (**VF**).
- **C — DECORATIVE (lowest, near-zero):** at most **one** subtle branded "texture" (see restraint rules). The existing marquee/rotator/pulse loops (**VF**) are **cut or repurposed**, not carried forward.

**The site is not an animation demo (DD).**

---

## 13. Scroll Choreography

| Beat | Entry | Active | Exit | Pin | Approx. scroll | Handoff |
|---|---|---|---|---|---|---|
| 01 Hero | Intro resolves into name (1–2s perceived) | Name + CTA, hero media | Content scrolls away naturally | None | 1.0×vh | → Beat 02 |
| 02 Build Core | Section pins; core slab settles | 5 scrubbed states (Arrival→Deployment) | Final state merges to product slab | **One pin**, ~3.5–4×vh scrubbed | 4×vh | → Beat 03 (seamless) |
| 03 Transition | Product slab → frame expands | Frame fills with real screenshot; theme crosses | Surface reaches full-bleed | Brief (continuation of pin, then release) | 1.5×vh | → Beat 04 |
| 04 IELTS.mock | Reveal surface settles; case content enters | Editorial case sequence (what/why/capabilities/gallery/status) | Natural scroll | **No pin** (natural scroll) | ~4×vh | → Beat 05 |
| 05 Capabilities | Natural scroll; editorial entrances | Services + evidence | Natural | None | ~2.5×vh | → Beat 06 |
| 06 About | Natural scroll | Story + workflow block + goals | Natural | None | ~3×vh | → Beat 07 |
| 07 Contact | Natural scroll | Closing statement + channels + form | Page end | None | ~2×vh | — |

**Hard rules (DD):**
- **Exactly one pinned section** (Build Core + transition, treated as one continuous pin). Everything else scrolls naturally.
- **No scroll hijacking, no fake smooth-scroll library, no scroll-jacking "sections."** Native scroll always wins.
- Total pinned scroll ≤ ~6 viewport-heights so the page never feels "stuck."

---

## 14. Motion Vocabulary (restricted set)

**Allowed (DD):** `opacity`, `translate` (2D + controlled z), `scale`, `clip-path` (simple rectangle/window reveals), SVG stroke draw-in, layer separation, soft shadow depth, controlled ≤8° rotation (tilt only), subtle parallax (≤20px, desktop only), typography line/word reveal.

**Avoid (DD):** continuous infinite loops, cursor-following elements, physics/bounce, heavy `filter: blur()` / `backdrop-filter` chains, 3D flythroughs, layout-property animation (`width/height/top/left`), rotating objects, particle systems, per-element micro-animations.

**Cohesion rule (DD):** one easing family (`--ease-out-soft` cubic-bezier(0.22,1,0.36,1), **VF** existing) governs everything; scrub-based motion is linear by design. The whole site must feel authored by one hand.

---

## 15. Reduced-Motion Direction

`prefers-reduced-motion` is **non-negotiable** and is **not an afterthought** (Phase 0 verified a genuine global path exists — **VF**).

| Sequence | Reduced-motion equivalent |
|---|---|
| Intro | **Immediate** — name appears at once, no timed sequence. |
| Build Core | Static stacked diagram, **all five states rendered simultaneously as a labeled editorial figure** (no separation/re-seal, no pin scrub). Content + order preserved. |
| Build Core → IELTS.mock | Simple crossfade from the diagram to the screenshot (no expansion, no zoom). |
| Screenshot reveal | Screenshots render statically at final position; no scale/mask animation. |
| Theme transition | **Discrete** swap at the boundary (no scrubbed cross-fade). |
| Entrances / feedback | Existing global rule (durations → 0.01ms) already handles these (**VF**). |

**Rule (DD):** reduced-motion preserves **CONTENT** and **NARRATIVE ORDER**; it removes only movement. Nothing important is hidden or deferred. Any JS-driven timeline must **explicitly branch** on the media query (a CSS rule alone will not stop a rAF scrub loop).

---

## 16. Desktop Direction (~1440px+)

- **Hero:** large Fraunces name (up to ~7rem), left-aligned editorial composition, the object/product media on the right or as a full-width underlay; one primary CTA.
- **Build Core scale:** the strata stack occupies ~55–65% viewport height, centered, with generous side whitespace; CSS-3D perspective tilt (~6°) for depth.
- **Screenshot scale:** the IELTS.mock reveal surface spans ~`min(100%, 96rem)` — a genuine full-bleed product moment.
- **Pacing:** fewer, larger beats; whitespace is a feature.
- **Constraint:** assume a **mid-range** GPU, not unlimited (no continuous compositing, no large blur radii).

---

## 17. Tablet Direction (768–1024px)

- Content sections collapse to 2-column; cinematic beats stay **centered single-column**.
- Build Core: **tilt removed**, depth reduced to shadows only; choreography **simplified** (states still scrub, but separation distances halved).
- Screenshots: full-width, top-anchored; gallery stacks 2-up.
- Theme transition still scrubbed, but simplified (background + text crossfade only).
- Tablet must read as a **deliberate composition**, not compressed desktop.

---

## 18. Mobile Direction (375px / 430px)

Designed **independently**, prioritizing readability and stability:

- **Typography:** mobile scale from §9; short hero name, readable body (≥0.9375rem).
- **Perceived loading:** no long intro; instant name.
- **Build Core:** the choreography is **significantly simplified** — a static-to-lightly-entering stacked diagram with the 5 state labels; **meaning preserved, movement removed**. No pin, no parallax, no 3D.
- **Screenshot:** complete 16:9 home screenshot first (full-width, undistorted), then a simple stacked gallery. No squeezed thumbnails.
- **Navigation:** existing glass pill + sheet menu (**VF**) retained; MobileCTA retained.
- **Animation complexity:** opacity/translate entrances only; no continuous loops.
- **Touch:** ≥44px targets (**VF** already enforced); `touch-action: manipulation` (**VF** existing).

---

## 19. Performance Boundaries

- **Motion:** transform/opacity only; zero layout-triggering animation in scrub handlers.
- **No permanent animation loops** (marquee/rotator/pulse are removed/repurposed).
- **Assets:** lazy-load below the fold; `next/image` AVIF/WebP (**VF** configured); the reveal's primary screenshot is `priority` (LCP).
- **Video:** optional and **never required** for the experience; if used, a single short loop ≤ ~4 MB, `muted playsinline`, with a static poster fallback.
- **JS:** keep first-load ≤ ~250 KB gzip; incremental motion code ≤ ~35 KB gzip.
- **Client boundaries:** the cinematic spine (Build Core + transition + reveal) is **one client boundary** over otherwise static/ISR content; content sections stay server-rendered.
- **Reject rule (DD):** any effect whose runtime cost is disproportionate to its narrative value is rejected, no matter how impressive.

---

## 20. Technical Direction

**Recommended stack (DD):**

- **Framework:** existing Next.js 16 App Router — unchanged.
- **Styling:** existing Tailwind v4 + `@theme` token system — unchanged; new motion styles colocated in a dedicated module, not dumped into `globals.css`.
- **Build Core rendering:** **DOM + SVG + CSS transforms / CSS-3D.** No Canvas, no WebGL/Three.js (per locked strategy). SVG only for leader lines/stroke draw-ins.
- **Motion engine (REC, requires approval — OQ):** **GSAP + ScrollTrigger** for the pinned, scroll-scrubbed sequences (Build Core + transition + reveal).

  *Justification:* the Build Core is a **multi-element, stateful, pinned, scrubbed timeline** with precise per-property control and a reduced-motion branch. The current stack has **zero** motion tooling (**VF**), and CSS `animation-timeline: scroll()` is **not yet reliable cross-browser** (Chrome yes; Safari/Firefox partial) and cannot cleanly express a 5-state pinned sequence with a seamless hand-off and a `prefers-reduced-motion` branch without feature-detection gymnastics. GSAP ScrollTrigger provides pinning, scrubbed timelines, per-transform control, and `matchMedia` reduced-motion handling in a single, well-tested source of truth.

  *What cannot be done cleanly without it:* deterministic multi-state pin/scrub with seamless hand-off and reduced-motion parity.

  *Zero-dependency alternative (if approved differently):* `position: sticky` + IntersectionObserver + rAF interpolation — possible, but materially more hand-rolled code, lower fidelity, higher maintenance risk.

- **No new dependency is proposed other than GSAP (and only if approved).** `framer-motion` is *not* preferred here because ScrollTrigger's scroll-scrub/pin model is the better fit for this specific choreography. No installs occur in Phase 1.

---

## 21. Existing Technical Debt (deferred)

From Phase 0 (**VF**), **not fixed in Phase 1** — documented for later cleanup:

1. Dead CSS: `.hero-process`, `.hero-stats`, `.skills-strip`.
2. Unused dependency: `next-auth`.
3. `force-dynamic` vs ISR/SSG contradiction (esp. on `/projects/[id]`).

These must **not** distract from creative direction. They will be folded into the implementation plan's cleanup step.

---

## 22. Design Restraint Rules

The final redesign must **avoid**: generic AI gradients; excessive glassmorphism; neon cyberpunk; fake terminals; fake code; random floating cards; meaningless 3D objects; constant cursor-following gimmicks; excessive blur; animation on every element; unreadable oversized type; copying Averlo's layouts/branding; copying the video reference literally; sacrificing UX for spectacle.

**Every major visual decision must have a stated reason (DD).**

---

## 23. Full Homepage Storyboard

Legend for BUILD CORE STATE: `—` = n/a.

### BEAT 01 — INTRO / HERO

| Field | Spec |
|---|---|
| **STATE NAME** | Intro → Hero (Muhammad) |
| **SCROLL POSITION** | 0 (top) |
| **VISUAL COMPOSITION** | Dark canvas + hairline grid + radial accent (existing hero lines); large Fraunces name; "Student & AI Developer" lead; one primary CTA; subtle product hint (miniature IELTS.mock surface or portrait). |
| **PRIMARY COPY ROLE** | "I build, inspect, test and ship real products." |
| **BUILD CORE STATE** | — |
| **BACKGROUND / THEME** | Dark |
| **MOTION** | Intro: name resolves over ~1–2s (mask/line reveal). CTA + meta fade in. |
| **TRANSITION IN** | From intro texture (or immediate on reduced-motion / returning visit). |
| **TRANSITION OUT** | Scrolls away; hero grid dissolves into Beat 02 pin. |
| **DESKTOP** | Left-aligned name, right media. |
| **MOBILE** | Centered name, no intro delay, media below. |
| **REDUCED-MOTION** | Instant name; no timed reveal. |

### BEAT 02 — BUILD CORE (pinned, 5 states)

| Field | Spec |
|---|---|
| **STATE NAME** | Build Core (Arrival → Prototype → Code Review → Validation → Deployment) |
| **SCROLL POSITION** | ~1–5×vh (one continuous pin) |
| **VISUAL COMPOSITION** | Centered build-strata stack; headline above; mono state index; progress rule. |
| **PRIMARY COPY ROLE** | "How I build." |
| **BUILD CORE STATE** | All five (see §5) |
| **BACKGROUND / THEME** | Dark |
| **MOTION** | Scrub-driven strata separation/re-seal; SVG leader draw-in; seams zip; label reveals. |
| **TRANSITION IN** | Core slab settles from hero. |
| **TRANSITION OUT** | Deployment state merges strata → product slab (hands off to Beat 03). |
| **DESKTOP** | Full choreography, ~6° tilt. |
| **MOBILE** | Static-to-light stacked diagram, 5 labels, no pin. |
| **REDUCED-MOTION** | Static labeled figure, all states visible at once. |

### BEAT 03 — DEPLOYMENT → PRODUCT (theme transition)

| Field | Spec |
|---|---|
| **STATE NAME** | Deployment → IELTS.mock surface |
| **SCROLL POSITION** | ~5–6.5×vh (continuation, then pin release) |
| **VISUAL COMPOSITION** | Product slab → refined browser frame → expands to full-bleed; dark background begins to lift. |
| **PRIMARY COPY ROLE** | The result of the process. |
| **BUILD CORE STATE** | Deployment (final) |
| **BACKGROUND / THEME** | **Dark → Light** (scrubbed crossfade) |
| **MOTION** | Frame expand + screenshot scale/fade-in (top-anchored, undistorted). |
| **TRANSITION IN** | From merged product slab. |
| **TRANSITION OUT** | Surface locks full-bleed; pin releases into natural scroll. |
| **DESKTOP** | Full-bleed surface, ~96rem. |
| **MOBILE** | Simple crossfade diagram→screenshot; discrete theme swap. |
| **REDUCED-MOTION** | Discrete crossfade; discrete theme swap. |

### BEAT 04 — IELTS.MOCK REVEAL

| Field | Spec |
|---|---|
| **STATE NAME** | IELTS.mock case study |
| **SCROLL POSITION** | ~6.5–10.5×vh (natural scroll) |
| **VISUAL COMPOSITION** | Dominant home screenshot; then what/why statement, capability list, layered gallery (exam/plans), status. |
| **PRIMARY COPY ROLE** | "Practice, review, AI feedback — in one place." |
| **BUILD CORE STATE** | — |
| **BACKGROUND / THEME** | Light |
| **MOTION** | Editorial entrances only; gallery stack-in. |
| **TRANSITION IN** | From locked full-bleed surface. |
| **TRANSITION OUT** | Case content gives way to Capabilities. |
| **DESKTOP** | Full-bleed hero + 2-col capability/gallery layout. |
| **MOBILE** | Full 16:9 screenshot first → stacked gallery. |
| **REDUCED-MOTION** | Static screenshots, static list. |

### BEAT 05 — CAPABILITIES

| Field | Spec |
|---|---|
| **STATE NAME** | Capabilities / Services |
| **SCROLL POSITION** | ~10.5–13×vh |
| **VISUAL COMPOSITION** | Editorial services (existing 8 services, **VF**), condensed; each = capability + "what it enables" + evidence/context; no progress bars, no icon grid. |
| **PRIMARY COPY ROLE** | "What I can build for you." |
| **BUILD CORE STATE** | — |
| **BACKGROUND / THEME** | Light |
| **MOTION** | Entrances only. |
| **TRANSITION IN** | From reveal. |
| **TRANSITION OUT** | → About. |
| **DESKTOP** | Bento / 2-col editorial. |
| **MOBILE** | Single column. |
| **REDUCED-MOTION** | Static. |

### BEAT 06 — ABOUT

| Field | Spec |
|---|---|
| **STATE NAME** | About (story + credibility + goals) |
| **SCROLL POSITION** | ~13–16×vh |
| **VISUAL COMPOSITION** | Editorial story (real bio, **VF**); "How I actually work" block (real workflow text); skills/experience consolidated; education/achievements; goals-as-plans. |
| **PRIMARY COPY ROLE** | "Who I am, and how I work." |
| **BUILD CORE STATE** | — |
| **BACKGROUND / THEME** | Light |
| **MOTION** | Entrances only. |
| **TRANSITION IN** | From Capabilities. |
| **TRANSITION OUT** | → Contact. |
| **DESKTOP** | Two-column editorial. |
| **MOBILE** | Single column. |
| **REDUCED-MOTION** | Static. |

### BEAT 07 — CONTACT

| Field | Spec |
|---|---|
| **STATE NAME** | Contact / closing |
| **SCROLL POSITION** | ~16–18×vh |
| **VISUAL COMPOSITION** | Strong closing statement ("Let's build something real."); who should contact him / why / for what work; real channels (**VF**); working form (**VF**). |
| **PRIMARY COPY ROLE** | "Let's build something real." |
| **BUILD CORE STATE** | — |
| **BACKGROUND / THEME** | Light (closing, warm) |
| **MOTION** | Entrances only. |
| **TRANSITION IN** | From About. |
| **TRANSITION OUT** | Footer / end. |
| **DESKTOP** | Two-column (channels + form). |
| **MOBILE** | Single column; MobileCTA retained. |
| **REDUCED-MOTION** | Static. |

---

## 24. Visual Direction Specification

| Element | Direction (DD) |
|---|---|
| **Typography** | Fraunces display / Inter body / JetBrains Mono labels (unchanged families, refined scale — §9) |
| **Background** | Dark: `canvas` + hairline grid + radial lime accent (existing). Light: `canvas` paper + faint hairline. Grain retained in dark only (**VF**). |
| **Surfaces** | Matte `surface-1/2/3`; hairline `line-1` borders; minimal glassmorphism (header only) |
| **Borders** | 1px hairlines (`line-1` default, `line-2` emphasis) |
| **Radius philosophy** | Keep mixed radii (4/8/14/22); cards 14–22, chips 4–8, pills 999 |
| **Shadows** | `sh-1` inset top-light; `sh-2/3` soft depth (Build Core, reveal surface) |
| **Image treatment** | Top-anchored, undistorted; hairline frame; no heavy filters/vignettes |
| **Build Core materials** | Matte strata + wireframe pending + solid active + accent sealed seam (see §4) |
| **Technical labels** | JetBrains Mono micro, uppercase, `ink-2`/`ink-3`; accent only for active/validated |
| **Iconography** | Existing single `Icon` set (**VF**, 44 names, currentColor) — no new icon system |
| **Navigation** | Existing glass pill header + sheet menu (**VF**) retained; minor polish only |
| **CTA** | Existing `.btn` system (**VF**); primary lime accent, ghost secondary; one primary per view |
| **Cursor behavior** | Default cursor everywhere; **no** custom cursor / cursor-following effects |
| **Light/dark relationship** | Same tokens, same composition; theme is a *journey*, not an alternate skin; manual toggle still honored |

---

## 25. Locked / Open / Risks / Assets / Order (Phase 2 Readiness)

### LOCKED (should not change)
- Seven-beat structure; no separate "Selected Projects" section.
- Build Core = "build strata" (5 states) mapped to the real workflow; DOM+SVG+CSS-3D; no WebGL/Canvas.
- Build Core → IELTS.mock = "deployment opens into real UI," top-anchored undistorted screenshot.
- Dark → Light at the Deployment/IELTS.mock boundary; light for Capabilities/About/Contact.
- Keep existing three fonts, token system, Icon/Card/Device, Header/Footer/MobileCTA, Contact, i18n, a11y layer, facts-only voice.
- Reduced-motion: content + order preserved, movement removed; explicit JS branch.
- Exactly one pinned section; no scroll hijacking; transform/opacity motion only.

### OPEN (require approval)
1. **Motion library:** approve GSAP + ScrollTrigger (recommended), or go zero-dependency native (`sticky` + rAF + IntersectionObserver)?
2. **Video:** approve a single optional looping hero/build video (≤4 MB), or strictly stills-only?
3. **Hero media:** portrait vs. product-surface vs. both, and whether the mini IELTS.mock hint appears in the hero.
4. **Contact headline/positioning copy:** final wording of "Let's build something real" and the "who should contact me" framing.
5. **Build Core literal labels:** confirm the exact Uzbek/English/Russian wording for the 5 states (must match real workflow terms across all 3 locales).

### RISKS (design/technical)
- Over-animation of the Build Core (mitigate via §22 restraint + single-pin rule).
- Cross-browser scroll-timeline/pin reliability (mitigate via GSAP or feature-detected fallback).
- Mobile pinning jank (mitigate: no pin on mobile — §18).
- Reduced-motion parity for the JS scrub (mitigate: explicit branch + static diagram — §15).
- Light-theme legibility of the cinematic beats (mitigate: cinematic beats are dark; light only after the transition).

### REQUIRED ASSETS (before implementation)
- **Higher-resolution genuine IELTS.mock screenshots** — ≥2560×1440 (ideally 3840×2160), one per module (Home, Listening, Reading, Writing, Speaking/AI feedback, Plans/Results). Current 1376×768 files (**VF**) are insufficient.
- **High-resolution portrait** (current is DB-served, low-ish resolution — **VF** `/api/media/portrait`) if the portrait is used in the hero.
- **Optional:** a single short looping build/video clip, only if Q2 is approved as "yes."
- No fabricated replacement screens or invented content.

### RECOMMENDED IMPLEMENTATION ORDER (Phase 2+, not executed now)
1. Asset capture (screenshots) + token/token-refinement (no visual breakage).
2. Theme-journey mechanics (scroll-scrubbed dark→light + reduced-motion discrete path).
3. Build Core component (5 states, desktop) as an isolated, accessible, reduced-motion-aware module.
4. Build Core → IELTS.mock transition + reveal surface.
5. Hero + Intro.
6. Capabilities + About (content consolidation, existing data).
7. Contact closing + polish.
8. Tablet/mobile choreography pass.
9. Deferred cleanup (dead CSS, `next-auth`, `force-dynamic` strategy).
10. Perf/accessibility/reduced-motion validation + Lighthouse + smoke re-run.

---

*End of Phase 1. No implementation performed. Phase 2 is NOT started.*
