# PHASE 3D — DEPLOYMENT → IELTS.MOCK CINEMATIC REVEAL

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Start SHA:** `36a0df8` (Phase 3C-R1 validation baseline)
**Baseline docs:** Phase 0–2 + 3A/3B/3C/3C-R1 (all approved)

> Scope: Deployment → Product Frame → genuine IELTS.mock UI → full-bleed reveal + dark→light theme handoff. **NOT** the Phase 3E case-study redesign.

---

## 1. Transition architecture (Option B)

**Decision: Option B — a second, tightly-coupled reveal timeline + a second ScrollTrigger**, owned by `ProductTransition`, scoped via `gsap.matchMedia()` to desktop + no-reduced-motion.

- The Build Core timeline (`BuildCoreSection`, one `p ∈ [0,1]`) is **untouched** — its Deployment end-state (flat, axis-aligned, sealed) is the literal starting geometry for the reveal.
- The reveal introduces its own normalized progress `r ∈ [0,1]` on a **pinned** ProductTransition section (pin `start "top top"`, `end "+=250%"`, `scrub: true`, `anticipatePin: 1`, `invalidateOnRefresh: true`).
- The two triggers never overlap transforms: Build Core pins only `#build`; the reveal pins only `.product-transition`. No competing writes to the same property.
- **Determinism/reverse:** every numeric value (frame `scale`, viewport `clip-path`, deploy-label opacity, `--theme-progress`) is a scrubbed tween driven purely by `r`, so forward/reverse/fast-scroll/scrollbar-jump all resolve from the current scroll position with no sequencing dependency.

## 2. Phase 3C handoff

- `BuildCoreSection` and its timeline are byte-for-byte unchanged (no snap, no transform reset — its final frame is identical to Phase 3C).
- The reveal's `r=0` state is a **compact sealed frame** (`scale 0.42`, viewport fully clipped, screenshot hidden, "Deploy" echo-label visible) — a conceptual continuation of the sealed deployment package. Continuity cues: the localized deployment term (`build.deployment`), the accent color, and the "not-yet-opened" (hidden screenshot) state.

## 3. DOM changes (`ProductTransition.tsx`, now `"use client"`)

```
<section .product-transition data-product-reveal>
  .u-container
    p.product-transition__eyebrow            (featured label)
    .product-transition__stage               (pin stage, flex-centered)
      .product-transition__frame             (scale target)
        Device (dots + url chrome)
          .product-transition__viewport      (aspect-16/9, clip target)
            next/image  (genuine screenshot, fill, object-cover object-top)
      p.product-transition__deploy           (deploy echo-label, aria-hidden)
```

Refined from the Phase 3A shell (kept `Device`, kept `.product-transition__frame` as the transform target). No large decorative tree; ~6 new elements.

## 4. Reveal progress model (`r ∈ [0,1]`)

| Beat | `r` | What happens |
|---|---|---|
| Deployment hold | 0.00–0.18 | frame `scale 0.42`, viewport `clip inset(0 0 100% 0)`, deploy label visible |
| Frame formation | 0.18–0.42 | `scale 0.42 → 0.72` (package opens into a browser frame) |
| Screenshot reveal | 0.42–0.62 | viewport `clip → inset(0)` (top-down, no distortion); deploy label fades |
| Full-bleed | 0.62–0.85 | `scale 0.72 → 1.0` (product becomes dominant) |
| Settle + theme | 0.85–1.00 | `--theme-progress 0 → 1` (dark→light) |

## 5. Product-frame logic

The frame is a single scale target (`transform-origin: 50% 100%`, `will-change: transform`). Browser chrome is the existing minimal `Device` (3 dots + url label) — no fake Safari clone, no decorative URL bar. The screenshot is the hero.

## 6. Screenshot strategy

- Genuine `/media/ielts-mock-home.jpg` (1376×768), `next/image` `fill`, `priority`, `sizes="(min-width: 64rem) 80rem, 100vw"`, `object-fit: cover; object-position: 50% 0` (top-anchored).
- Aspect preserved (no stretch/warp); the 1376×768 vs 16:9 difference crops <1% of width — negligible. No fabricated overlays, no blur, no filters.

## 7. Clipping / masking strategy

`clip-path: inset()` on the viewport only (transform/clip-path-first). No SVG filters, no blur, no layout-animating width/height.

## 8. Full-bleed behavior

`scale 1.0` on a `max-width: 74rem` frame → the 16:9 screenshot spans the editorial container (~1184px at 1440), clearly dominant. Centered/anchored (bottom origin), ratio preserved, no edge distortion.

## 9. Theme transition

Single channel `--theme-progress` (Phase 2 architecture), scrubbed **on the `.cinematic-spine` root** (found via `closest()`). `[data-narrative="dark"]` now interpolates dark→light with `color-mix(in oklab, dark, light calc(var(--theme-progress) * 100%))`; at `--theme-progress: 0` it is pixel-identical to the Phase 3C dark palette. Verified: at `r=1` the spine background = `oklab(0.973…)` = `#f8f6f0`, exactly matching `#work` (`data-narrative="light"`). The reveal "turns on the light."

## 10. Manual-theme interaction

`--theme-progress` is scoped to the narrative spine and is scrubbed (reverts to 0 on reverse scroll). It never touches `<html data-theme>`, so the manual toggle remains authoritative for chrome + non-narrative sections. Verified: manual light → chrome light while narrative still dark→light; scrolling back up reverts the narrative to dark while manual stays light; no contradictory classes, no flicker.

## 11. Reverse scroll

Verified clean reversal: `r 1.0 → 0.0` correctly reverses clip (`inset(0)` → `inset(100%)`), scale (`1 → 0.42`), deploy opacity (`0 → 1`), and `--theme-progress` (`1 → 0`). No screenshot flicker, no stale clipping, no border-radius snap, no leftover frame, no transform discontinuity.

## 12. Fast scroll

Instant jumps (top/mid/end/frame) each resolve to the correct `clip`/`scale`/`--theme-progress` for that scroll position. No delayed animation continues after reversing (scrub-only).

## 13. Desktop behavior (1440×900)

Full choreography, pinned 2.5×vh scrub, ~59 FPS (median 17ms frame). Build Core pin (2 spacers total: build + reveal) unchanged.

## 14. Tablet behavior (768)

No pin, no timeline (`matchMedia` fails below 64rem): static frame + fully-visible screenshot in normal flow. Stable.

## 15. Mobile behavior (375/430)

No pin, no transform, no clip: complete 16:9 IELTS.mock screenshot first (frame 338×223 / 393×254 incl. chrome), normal flow, no horizontal overflow. Premium-simple; the screenshot is not hidden behind any interaction.

## 16. Reduced-motion behavior

`prefers-reduced-motion: reduce` → timeline never initializes: no pin, no morph, no clip, no blank spacer. Static frame + full screenshot immediately accessible.

## 17. Image performance

Single `priority` image (the home screenshot, which enters immediately after the spine). Gallery media (exam/plans) remain lazy in `IeltsMockFeature` — no preload of future media.

## 18. Layout shift

`aspect-ratio: 16/9` viewport + `Device` chrome give the frame stable dimensions; the screenshot is `fill` inside a known-ratio box (no loading collapse, no late dimension change). CLS minimal.

## 19. Accessibility

- Screenshot alt = `{title} — {work.cover}` (meaningful, localized).
- Frame chrome + deploy label are `aria-hidden`; the semantic project content (title/description/features) lives in `IeltsMockFeature` (not removed).
- Pin is positional only — no focus/keyboard trap; focus order unchanged.
- Reduced-motion path complete.

## 20. Locale behavior

`/`, `/en`, `/ru` validated: deploy echo-label (Deploy / Deployment / Деплой) and eyebrow (Asosiy loyiha / Main project / Главный проект) render correctly, no layout break, no horizontal overflow.

## 21. Failure handling

If the screenshot is absent (`project.image` empty) a textual placeholder is rendered. If the image fails to decode, the `aspect-16/9` viewport + `Device` background keep the frame geometry stable, and the eyebrow + downstream `IeltsMockFeature` provide textual context — no broken blank cinematic area, and no motion logic depends on image decode (the timeline animates the container, not the image).

## 22. Runtime validation

Real headless Chromium 149 (see 3C-R1 for the harness). Checked: desktop 1440×900 forward (6 beat samples), reverse, fast scroll, scrollbar jump, resize desktop↔tablet, tablet, 375px, 430px, reduced-motion, theme toggle (manual light/dark), `/en`, `/ru`, console, hydration. **All pass.** Console: only the pre-existing `401 /api/auth/me` (PortraitSlot admin check) — no hydration/GSAP/ScrollTrigger/React warnings.

## 23. Visual evidence

PNGs in `/home/user/validation/shots/`: `3d-deployment-end.png`, `3d-deploy-hold-r-0-05.png`, `3d-frame-form-r-0-30.png`, `3d-reveal-r-0-50.png`, `3d-reveal-mid-r-0-58.png`, `3d-full-bleed-r-0-72.png`, `3d-settled-r-0-95.png`, `3d-end-r-1-0.png`, `3d-tablet-768.png`, `3d-mobile-375.png`, `3d-mobile-430.png`, `3d-reduced-motion.png`. All non-blank and pairwise distinct (unique MD5 + varying sizes; hold ≈27KB → full-bleed ≈450KB). The agent cannot visually inspect pixels (no vision); visual *coherence* is asserted from exact computed geometry (scale/clip/opacity/theme) + distinctness metrics, with PNGs retained for human review. No scroll video was producible in this environment.

## 24. Files changed

- `src/components/cinematic/ProductTransition.tsx` — `"use client"`; reveal timeline + ScrollTrigger + refined DOM.
- `src/app/globals.css` — progressive `[data-narrative="dark"]` palette (`--theme-progress` + `color-mix`); reveal stage/frame/viewport/deploy styles.

## 25. Build / lint / tsc

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | 0 errors / 0 warnings |
| `npm run build` | success |

## 26. Known limitations

- **Continuity is conceptual, not a literal morph:** the reveal's `r=0` is a compact sealed *browser frame* (scale 0.42 + hidden screenshot + "Deploy" label) rather than a pixel-morph of the Build Core slab stack. This honors the "package → frame → UI" sequence while avoiding a fragile cross-section morph; a slab-echo treatment could strengthen the literal handoff in a later polish pass.
- **Theme switch is fast** (last 0.15 of `r`, ~337px) — intentional "turns on the light," but could be eased further if a softer ramp is preferred.
- **Asset quality:** the home screenshot is 1376×768 (~16:9); full-bleed at 1184px is slightly below 2× on high-DPI. Acceptable now; a higher-res export would sharpen the full-bleed climax (asset-quality limitation, documented rather than faked).
- `color-scheme` on the spine stays `dark` during the blend (no visual impact: custom scrollbars, no forms in the spine).

## 27. Phase 3E readiness

The reveal lands at a settled light state that is pixel-continuous with the existing `IeltsMockFeature` (`data-narrative="light"`), so Phase 3E can begin from a clean "real UI dominant, light editorial" foundation. No 3E work was done.

## 28. Git / Preview evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **Start SHA:** `36a0df8`
- **End SHA:** (this commit)
- **`main`:** untouched (`062cadd`)
- **Production:** untouched; no merge; no production deployment.
- **Preview:** none (no Vercel credentials in environment); validated on local `next start`.
