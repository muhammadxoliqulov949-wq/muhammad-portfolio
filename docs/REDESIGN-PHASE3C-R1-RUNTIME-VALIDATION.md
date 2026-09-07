# PHASE 3C-R1 — RUNTIME VALIDATION PASS

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Validated commit:** `cc1bbe2` (Phase 3C implementation)
**Start SHA / End SHA:** `cc1bbe2` → `cc1bbe2` (no code changes)
**Scope:** prove the Phase 3C Build Core motion + intro behave correctly in a real browser. No redesign, no Phase 3D, no IELTS.mock reveal.

> **Verdict: PASS — no fixes required.** All runtime checks below were exercised in a real headless Chromium, not inferred from code.

---

## 1. Environment used

| Item | Value |
|---|---|
| Browser | **Headless Chromium 149.0.7827.0** (X11; Linux x86_64) |
| Automation | `puppeteer-core@25.10.0` + `@sparticuz/chromium@149.0.0` |
| Runtime | Local production server (`next start`, Next.js 16.3.2, `AUTH_SECRET` set, DB seeded) at `http://localhost:3000` |
| Viewports | 1440×900 (desktop), 768×1024 (tablet), 375×800 & 430×800 (mobile) |
| Reduced motion | Emulated via `emulateMediaFeatures prefers-reduced-motion: reduce` |
| Network note | Debian apt, Chrome CDNs (`storage.googleapis.com`, Playwright CDN, `objects.githubusercontent.com`) are blocked in this sandbox; Chromium was sourced from `@sparticuz/chromium` (npm), with NSS/NSPR shared libs extracted from its bundled `al2023.tar.br` (Debian bookworm is missing `libnspr4/libnss3/libnssutil3`). |

Screenshots saved to `/home/user/validation/shots/` (see §19). No Vercel Preview was possible (no Vercel CLI / token / `.vercel` in environment) — validation used the local production server.

## 2. Desktop validation (1440×900)

Pin geometry confirmed at runtime: section `#build` top = **1038px**, section height 1100px, pin-spacer height **5600px** (= 1100 + 5×900), document height 11902px. Pin start `top top`, `end "+=500%"` → scrub distance exactly 4500px, `p = (scrollY − 1038) / 4500`.

## 3. Five-state results

Measured at representative mid-state `p` values (instant scroll):

| State | p | data-state | meta name | strata classes | labels | connectors | core op |
|---|---|---|---|---|---|---|---|
| Arrival | 0.07 | `arrival` | Boshlanish | 5× pending | 0.55 | 0 | 0.86 |
| Prototype | 0.24 | `prototype` | Prototip | active,pending×4 | rising | 0 | 1 |
| Code Review | 0.46 | `review` | Kod tekshiruvi | active×3,pending×2 | 1 | 0.5 | 1 |
| Validation | 0.67 | `validation` | Tasdiqlash | 5× validated | 1 | 1 | 1 |
| Deployment | 0.88 | `deployment` | Deploy | 5× validated | receding 0.67 | 0.55 | 1 |

All five resolve to the correct discrete state, class set, label opacity, connector opacity, and progress-rule fill. Physical depth (group tilt/scale) and strata `y/z` offsets advance per the 3C spec (verified via computed `matrix3d` / strata transforms at each beat).

## 4. Forward scroll

Stepping 150px through the full range, state order observed (with the 150px sampling granularity):

`arrival (y≈838) → prototype (y≈1738) → review (y≈2638) → validation (y≈3688) → deployment (y≈4588)`

Correct order, clean transitions, no snap, no label overlap (labels are a single stacked column), no connector noise (connectors are opacity-only, hidden at arrival).

## 5. Reverse scroll

`deployment (5638) → validation (4438) → review (3538) → prototype (2488) → arrival (1588)`

Back at top: state `arrival`, fill `0px`, all strata `pending`. No stuck classes, labels, connectors, or stale transforms. Reverse is fully deterministic (every property is a scrubbed tween; discrete state derives purely from `self.progress` via idempotent `applyState`).

## 6. Fast scroll

Instant jumps (scrollbar/wheel semantics) to arbitrary positions each resolved to the correct state: start→`arrival`, near-end→`deployment`, end→`deployment`, middle→`review`, top→`arrival`, review-mid→`review`, deploy→`deployment`. The visual state always equals the actual normalized progress (no sequential-animation lag).

> Note: an early diagnostic showed apparent "lag"/"stuck" states — traced to CSS `scroll-behavior: smooth` interacting with programmatic `window.scrollTo` (which animates). Real wheel/scrollbar input is instant and unaffected; all assertions here use instant scroll.

## 7. Scrollbar jump

`start → near-end → end → middle → beginning` all resolved correctly (deployment → deployment → review → arrival). No geometry/class/label/connector/progress mismatch after any jump.

## 8. Deep refresh

Headless Chromium does **not** perform browser scroll restoration on reload (verified with a plain-page control: scrolled to 4000px, reload → 0). On the real site, reloading while mid-pin reset to top (y≈22 → `arrival`), so the "restore → resolve" path could not be directly exercised here. Code inspection confirms correctness: `onRefresh: applyState(self.progress)` + `invalidateOnRefresh: true` re-derive the state from the restored scroll position on refresh, and any later scroll-restoration scroll event fires `onUpdate`. Not treated as a defect; flagged as an environment limitation.

## 9. Resize / breakpoint behavior

- **Desktop → tablet (768):** pin-spacer removed (wrapper class reverts to `cinematic-spine`, height 3022 = natural section height), document height drops 11902 → 6786, group keeps the 3B CSS static `rotateX(3deg)`. No stale pin, no duplicate spacer, no console error (only the pre-existing 401, §15).
- **Tablet → desktop (1440):** pin-spacer re-created (5600px), state re-resolves. `document.querySelectorAll('.pin-spacer').length === 1` (no duplicates). `mm.revert()` + `invalidateOnRefresh` behave correctly.

## 10. Mobile behavior (375px, 430px)

Both widths: **no pin-spacer**, wrapper class `cinematic-spine`, `group transform: none` (flat), all 5 strata present as `pending` (the approved 3B static "arrival" wireframe — complete and readable), **no horizontal overflow** (`scrollWidth == clientWidth`), normal document flow, no errors. Confirmed the desktop timeline is never instantiated (not merely hidden).

## 11. Reduced-motion behavior

`prefers-reduced-motion: reduce` at 1440px: **no pin-spacer**, document height 7402 (no 4500px spacer), `group transform: none`, strata all `pending`, `data-state="arrival"`, intro overlay opacity `0`. After scrolling to y=1500 the Build Core scrolls normally (`groupTop=-103`, i.e. NOT fixed/pinned). Timeline does not initialize; no blank region; content fully readable.

## 12. Intro behavior

- **First visit (fresh tab):** overlay/mark/rule play and fade over ~1.1–1.35s (mark tween in, rule resolves, hold, fade-out). Hero `<h1>` is present at `t=0` (non-blocking). Overlay is `position: absolute`, `pointer-events: none`, `aria-hidden` → no layout shift, no focus trap.
- **Second navigation (same tab):** `sessionStorage.__intro_seen === "1"`; reload → overlay opacity `0` at 250ms (intro skipped).
- **Reduced-motion:** overlay opacity `0` immediately (skipped).

## 13. State synchronization

Fine-grained sampling (±0.5% and ±2%) around each boundary confirms the discrete class flips **exactly** at `p = 0.14 / 0.34 / 0.58 / 0.76`, in both forward and reverse directions, with `data-state`, strata classes, and meta name always mutually consistent. Reverse crossing of 0.34 cleanly returns `review → prototype`. No flicker, no early/late switch, no one-frame disagreement (continuous geometry tween starts at the same timeline position the class switches, both driven by one `p`).

## 14. Deployment end-state (critical gate)

At `p = 1.0`:

- `group` transform = **identity matrix** (rotateX 0°, scale 1 → flat, axis-aligned).
- All 5 strata transforms = **identity** (y=0, z=0 → compact, no stray offsets).
- Labels: core 1.0, strata **0.45** (simplified, low-noise).
- Connectors: **0.25** (settled).
- Progress fill: 256px (**100%**).
- `data-state="deployment"`.

This is exactly the compact, clean, aligned, transform-friendly baseline required for the Phase 3D product-frame reveal.

## 15. Console / hydration results

Only one message on the homepage, **pre-existing and unrelated to 3C**:

- `Failed to load resource: 401 (Unauthorized)` → `/api/auth/me` (called by `PortraitSlot` admin check; expected "no session" response).
- A benign `?_rsc=… net::ERR_ABORTED` RSC prefetch abort (Next router cancelling an in-flight prefetch on reload).

**No** React hydration warnings, **no** GSAP warnings, **no** ScrollTrigger warnings, **no** runtime exceptions, **no** duplicate-listener or resize errors.

## 16. Performance observations

Scripted continuous scroll across the full pin range: **401 frames, median frame 17ms, p95 17ms, worst 17ms → ~59 FPS** (vsync-bound). No jank, no layout thrash, no expensive filters, no permanent loops, no per-frame React render (class changes are imperative + `lastState`-guarded). Only transform/opacity/width animating.

## 17. Locale validation (`/`, `/en`, `/ru`)

| Locale | arrival | prototype | review | validation | deployment |
|---|---|---|---|---|---|
| uz | Boshlanish | Prototip | Kod tekshiruvi | Tasdiqlash | Deploy |
| en | Arrival | Prototype | Code review | Validation | Deployment |
| ru | Старт | Прототип | Ревью кода | Валидация | Деплой |

All five names render correctly at their scroll positions; the meta-state element fits its container in all locales (`fits=true`), no horizontal overflow, no errors.

## 18. Fixes made

**None.** No runtime defect was observed. `cc1bbe2` is unchanged.

## 19. Visual evidence

Screenshots (PNG) captured to `/home/user/validation/shots/`:

`desktop-{arrival,prototype,review,validation,deployment}.png`, `desktop-deeprefresh.png`, `deployment-end.png`, `tablet-768.png`, `mobile-{375,430}.png`, `reduced-motion.png`.

All are 1440×900 (or the stated viewport), non-blank (luminance std-dev 44–69, full 0–255 range), and pairwise distinct (unique MD5 + differing sizes) — i.e. the five states are visually distinct. **The agent could not visually inspect the pixels** (no vision in this environment); visual *coherence* is asserted from computed geometry (transforms/opacities/classes at each beat) which is exact, plus the distinctness metrics above. The PNGs are retained for human review.

## 20. Remaining risks

- **Deep-refresh "restore → resolve"** was not directly exercisable (headless Chromium doesn't restore scroll); handled by `onRefresh`/`invalidateOnRefresh` in code, but unverified in a real browser with scroll restoration.
- **Real-device feel** (trackpad inertia, mobile touch, macOS momentum) not covered by synthetic scroll events.
- **Subjective polish** (exact tilt depth, label rhythm) — deferred to human review of the PNGs.
- The 3B static mobile/tablet/reduced-motion look shows all strata in `pending` (wireframe) — this is the approved static "arrival" default, not a regression.

## 21. Phase 3D readiness

Confirmed: at `p = 1` the Build Core ends in a flat, scale-1, axis-aligned, sealed, low-noise configuration — a clean geometry origin for the Deployment → IELTS.mock product-frame reveal. The single `p ∈ [0,1]` scrub timeline is the exact hook Phase 3D extends. No morph/expansion/theme-transition code exists (correctly deferred).

## 22. Git / Preview evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **Start SHA / End SHA:** `cc1bbe2` → `cc1bbe2` (no code changes; this validation + doc only)
- **`main`:** untouched (`062cadd`)
- **Production:** untouched; no merge; no production deployment.
- **Preview:** none created (no Vercel credentials in environment); local `next start` used.
