# PHASE 3G — RESPONSIVE, REDUCED-MOTION & CROSS-DEVICE INTEGRATION PASS

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Start SHA:** `7f5ad8c` (Phase 3F re-applied)
**`main`:** `062cadd` (untouched)

> Scope: validate and refine the COMPLETE redesigned homepage (all seven beats) across desktop, tablet, mobile, reduced-motion, theme modes, and locales. Integration/quality pass — **no** redesign, no new sections, no new cinematic sequences, no Phase 3H.

---

## 1. Git verification

The Phase 3G safety gate found a contradiction and the turn was stopped for recovery first: the sandbox `.git` had been **re-cloned again**, so both redesign commits (`357ef3f`, `57859e3`) were gone and the working tree sat at the end-of-Phase-3E state with the 3F work missing. After the user chose "re-do Phase 3F then run 3G":

- Re-committed the intact 3A–3E tree as `ca2a7d0` (fresh recovery baseline; no history rewrite).
- Re-applied Phase 3F faithfully → `7f5ad8c` (build/tsc/lint verified).
- `main` remained `062cadd` throughout; Production untouched.

Phase 3G baseline = `7f5ad8c`.

## 2. Viewport matrix

Tested (real headless Chromium 149, automated `scrollWidth ≤ clientWidth` + element-edge overflow scan):

| Category | Widths |
|---|---|
| Desktop | 1920, 1440, 1280, 1024 |
| Tablet | 834, 768 |
| Mobile | 430, 390, 375, 360, 320 |

All pass — **zero horizontal overflow at every width** in uz/en/ru (including an element-level scan that is not masked by `overflow-x: clip`).

## 3. Full-page flow

All seven beats render in order at every width: Hero → Build Core → Product reveal → IELTS.mock → Capabilities → About → Contact. Indices `04 → 05 → 06` carry the editorial half. No rhythm breaks, no dead spaces, no overlap. (Evidence: full-page screenshots per width.)

## 4. Hero

Hero display name scales correctly (`hero-name__first` 97.6px @1920 → 45.6px @320; `hero-name__last` 68px → 32px); the semantic `h1.hero-name` is a small wrapper with visible large spans — no clipping, no orphan-line collapse at 320px, identity remains legible. Supporting copy and CTA present. Intro overlay is `aria-hidden` + `pointer-events:none` (never blocks).

## 5. Build Core desktop

Verified at 1440/1024: GSAP `matchMedia("(min-width: 64rem) and (prefers-reduced-motion: no-preference)")` active → 2 pin-spacers present; the build section reaches `position: fixed` mid-pin (correct). Labels/connectors readable, no clipping, no z-index conflict.

## 6. Build Core tablet / mobile

At 768/834/390/430/375/360/320: **no pin** (0 pinned triggers), normal document flow, flat readable diagram, no stale transforms, no oversized empty region, no horizontal overflow. Section height collapses to ~7000px (vs ~12400px desktop-pinned) — as designed.

## 7. Product reveal

Desktop: frame + screenshot present, `IELTS.mock` alt text set, image lazy-loaded, 16:9 ratio retained. Tablet/mobile: static/light reveal (no fragile pin below 64rem), screenshot readable, no morph, no clipping.

## 8. IELTS.mock case study

Home-dominant gallery hierarchy intact; 4 images all lazy-loaded with meaningful alt text (0 missing-alt). Two-column structures collapse cleanly at mobile; no chip soup; healthy measure. (Carried forward unchanged from Phase 3E.)

## 9. Capabilities

Numbered editorial rows: large numbers (`clamp(2.5rem…3.75rem)`, opacity 0.22) collapse to a stacked layout below 47.99rem and do not collide with titles; descriptions/features wrap; toolkit `dl` stays readable (1→2→3 columns); row separators aligned.

## 10. About

Statement wraps cleanly (max-width 24ch); paragraphs at healthy measure; facts column collapses below 64rem; strengths/interests/workflow/goals grids reflow; no giant multi-screen heading blocks at 320px.

## 11. Contact

Telegram primary CTA + email secondary + quiet metadata all present; form preserved (4 inputs, labelled, no overflow at 375/430/768/1440). **Fix (3G):** long email `muhammadxoliqulov949@gmail.com` previously overflowed at 320px (327px button > 320px viewport, masked by `overflow-x: clip`); now wraps via `overflow-wrap: anywhere`.

## 12. Navigation

Sticky frosted-glass pill header reads on both the dark opening and light sections (light canvas pill + dark ink in light theme; dark pill + light ink in dark theme). Locale switch, theme toggle, mobile menu, brand all present. **Fix (3G):** the three header controls (lang, theme, menu) were 26×26px on touch devices — below comfortable tap size.

## 13. Typography

All `clamp()` values behave at 320px and 1920px extremes: hero 45–98px, capability numbers 32–60px, About statement 33–64px, Contact headline 36–68px. No aggressive/oversized fluid scaling; no clipping.

## 14. Spacing

`--section-y` token drives vertical rhythm; ruled rows (`--c-line-1`) keep editorial ledger feel; grids break at 40/48/64rem. No per-viewport arbitrary spacers were needed.

## 15. Overflow

Strict test: `scrollWidth ≤ clientWidth` **and** an element-right-edge scan (to defeat `overflow-x: clip` masking) at 320/360/375/390/430/768/1024/1440/1920 in all 3 locales. Only pre-fix offender was the contact email button; now 0 offenders everywhere.

## 16. Mobile viewport behavior

No fragile `vh` usage inherited by mobile (cinematic pins are desktop-only, ≥64rem); `min-height: 100dvh` on body with `safe-area-inset` padding. Address-bar-safe; no hidden content below the fold.

## 17. Touch

Buttons/nav controls/locale/theme/form all use `touch-action: manipulation`. **Fix (3G):** header controls 26px → **40px** (`--tab-ctrl`), with the mono label and icons scaled proportionally so the larger targets don't look empty. CTA/back-to-top remain ≥36px; mobile sheet links are 48px.

## 18. Reduced motion

Full page under `prefers-reduced-motion: reduce`: intro suppressed, `.reveal` animation `none`, no pinned Build Core (matchMedia excludes), no product morph, no empty spacers, no delayed screenshots, all content visible (page height 7398px — complete editorial site).

## 19. Theme matrix

Default (light), manual dark, manual light — all three render across all seven beats with correct token colors (`bodyBg` = `#f8f6f0` / `#0a0c10`), borders, muted text, CTAs, gallery frames, nav. Reduced-motion + manual dark/light combos also verified (no narrative-theme vs user-preference fight).

## 20. Locale matrix

uz/en/ru at 1440/768/375 (plus 320 for en/ru): correct translated headings, no locale-specific overflow, long Russian text and email wrap safely. All seven `section[id]` present per locale.

## 21. Intro edge cases

First visit: overlay renders `opacity` managed by GSAP but is `aria-hidden` + `pointer-events:none` (never blocks). Second visit: `sessionStorage.__intro_seen === "1"` skips. Reduced-motion: no intro. Reload/direct-nav safe.

## 22. Resize lifecycle

1440 → 768 → 390 → 1440 and 1024 → 900 → 1024 (across the 64rem pin boundary): ScrollTrigger cleanly adds/removes pin-spacers, no stale transforms, no stuck inline styles (11 static inline transforms are unrelated inline SVGs/positions, stable), no overflow after any resize, no duplicate timelines.

## 23. Orientation

430×932 → 932×430 → 430×932: no overflow, no blank gaps, correct responsive branch, readable screenshots.

## 24. Scroll stability

Slow/fast/reverse/jump scroll with zero page errors; `scrollWidth` stays bounded; pin state resolves correctly.

## 25. Image behavior

4 images (home + 3 gallery) all `loading="lazy"`, all with meaningful alt text, stable aspect ratios, no layout collapse. Low-resolution source assets remain a documented limitation (not upscaled).

## 26. Form behavior

ContactForm at 375/430/768/1440: 4 inputs, `label[for]` present for every input, submit button 155px wide, no overflow. Backend/DB behavior untouched (no integration bug found).

## 27. Accessibility

Landmarks present (`main`, `nav`); single `h1`; one `h2` per section (`build/work/capabilities/about/contact` = 1 each, `home` uses the hero h1); semantic `ol/ul/dl`; real `<a href>`; no clickable divs; visible focus (existing global); decorative SVG `aria-hidden`; form labels; screenshot alt text. Pinned desktop visuals don't disturb reading order (semantic tree is stable regardless of pin).

## 28. Performance

`next start` baseline (1440): DOMContentLoaded 148ms, load 230ms, ~244KB JS, ~31KB images, 21 resources. No scroll frame drops observed, no duplicate GSAP init, no long tasks, no image payload spikes.

## 29. Fixes made

1. **Contact email overflow @320px** — `.contact-cta .btn` now `white-space: normal; overflow-wrap: anywhere; max-width: 100%; height: auto` so the long email address wraps instead of clipping.
2. **Touch-target sizing** — header `--tab-ctrl` 26px → 40px (mobile/tablet only; desktop stays 32px); lang-switch label and theme/menu icons scaled to match.

No other changes. No redesign, no new sections, no motion changes, no new dependencies.

## 30. Files changed

- `src/app/globals.css` (+25 / −2): the two fixes above (`.contact-cta .btn` wrap; `--tab-ctrl` 40px + icon scaling).

## 31. Build / lint / tsc

`npm run typecheck` ✅ · `npm run lint` ✅ · `npm run build` ✅ (all clean, after fixes).

## 32. Runtime validation

Rebuilt the headless-Chromium harness (`puppeteer-core@25.10.0` + `@sparticuz/chromium@149.0.0`, binary + AL2023 NSS libs re-extracted to `/tmp`; working launch args `--no-sandbox --no-zygote --disable-gpu --disable-dev-shm-usage`).

Automated suites:
- `validate3g.mjs` — **35/35 pass** (overflow ×11 widths, locale ×9, theme ×3, reduced-motion, reduced+theme ×2, structure, form ×4, intro ×2, resize).
- `validate3g2.mjs` — **8/9 pass** (the single "FAIL" is a false negative: `window.ScrollTrigger` isn't exposed by the bundle; the pin was verified independently via pin-spacers + `position: fixed`).
- Pin/breakpoint/orientation/overflow-scan/hero-typography/email-fix/touch-fix all verified separately.

## 33. Visual evidence

16 PNGs in `/home/user/validation/shots/`:

- Desktop full-page: `3g-desktop-{1920,1440,1280}.png`
- Tablet full-page: `3g-tablet-{1024,768}.png`
- Mobile full-page: `3g-mobile-{430,390,375,320}.png`
- Special: `3g-reduced-motion.png`, `3g-manual-dark.png`, `3g-manual-light.png`, `3g-russian-mobile-375.png`
- Targeted: `3g-buildcore-desktop.png`, `3g-productreveal-desktop.png`, `3g-contact-mobile-390.png`

All non-blank with verified dimensions. Scroll-driven `.reveal` is frozen to its settled state for review (progressive-enhancement animation, not content-hiding). The agent has no vision; coherence is asserted from computed DOM/geometry + the freeze override, with PNGs retained for human review.

## 34. Known limitations

- Low-resolution IELTS.mock screenshots remain (documented asset limitation; not upscaled).
- `window.ScrollTrigger` is not observable from the page (bundled), so pin verification relies on DOM pin-spacers/`position: fixed`.
- No Vercel credentials in the sandbox → no Preview deployment; validated on local `next start`.
- The one pre-existing anonymous `401 /api/auth/me` (admin session probe) appears in console — not a regression.

## 35. Phase 3H readiness

The complete homepage reads as one coherent responsive product: seven beats intact, desktop cinematic system intact (pin at ≥64rem), tablet simplified, mobile intentional, reduced-motion complete, themes/locales stable, navigation readable, typography/spacing correct, touch targets comfortable, images stable, ContactForm functional, no hydration/runtime regressions, no new dependency. Ready for Phase 3H. **Phase 3H was NOT started.**

## 36. Git / Preview evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **Start SHA:** `7f5ad8c` (Phase 3F re-applied)
- **End SHA:** (this 3G commit)
- **`main`:** `062cadd` — untouched
- **Production:** untouched; no merge; no deployment/alias.
- **Preview:** none (no Vercel credentials); local `next start`.
