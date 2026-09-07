# PHASE 3F — EDITORIAL SECTIONS: CAPABILITIES · ABOUT · CONTACT

**Date:** 2026-09-07
**Branch:** `arena/01a07900-muhammad-portfolio`
**Baseline:** `ca2a7d0` (recovered Phase 3A–3E, build-verified)
**Predecessors:** Phase 0–2 + 3A/3B/3C/3C-R1/3D/3E (all approved)

> Scope: polish the three remaining editorial homepage sections — **CAPABILITIES → ABOUT → CONTACT** — to the same premium, light/editorial quality as Build Core (3C), the product reveal (3D) and the IELTS.mock case study (3E). Low-motion, server-rendered, truthful, locale-stable. **NOT** Phase 3G.

> **Motion constraint (non-negotiable):** CSS-only `.reveal` + the existing IntersectionObserver are the only allowed motion. No new GSAP timelines, no pinning, no parallax, no 3D cards, no looping, no cursor gimmicks.

> **Note (git re-created):** the sandbox `.git` was re-cloned between Phase 3E and 3F, dropping the prior `357ef3f`/`57859e3` commits. The 3A–3E working tree was re-committed as `ca2a7d0` (recovery baseline), then this Phase 3F work was re-applied on top. No history was rewritten and `main` (`062cadd`) was never touched.

---

## 1. Summary & scope

Three sections were rewritten end-to-end as editorial compositions:

| Section | Before | After (3F) |
|---|---|---|
| Capabilities | skill grid (`SectionHead` + card wall) | editorial **capability index** (numbered ruled rows) + restrained **toolkit** |
| About | resume-dump of fields | editorial **narrative** (statement → story → selected facts → direction) |
| Contact | card-centric form block | decisive **final state** (one primary CTA, quiet metadata, spacious composition, preserved DB form) |

All three remain **server components**; no new client data fetching and no client components were added purely for animation.

## 2. Capabilities — architecture

`Capabilities.tsx` (server component, `id="capabilities"`, `data-narrative="light"`) renders:

1. `SectionHead` — index `04` (the single `h2`).
2. `.cap-index` — an `<ol>` of capability rows: large display **number** (`.cap-index__num`, `opacity: 0.22`), `h3` title, description, features joined with `" · "`.
3. `.cap-toolkit` — a `dl` of skill groups: accent label + "not a ranking" note, then category `dt` + dot-joined tool names `dd`.

No icons, no progress bars, no badge walls, no skill clouds.

## 3. Capabilities — content mapping

| UI | Source |
|---|---|
| row title | `service.title` |
| row description | `service.description` |
| row features | `service.features` (CSV → `featuresOf`) |
| toolkit category | `skill.category` (`skillsByCategory`) |
| toolkit items | `skill.name` |

Seed truth: **8 services**, **39 skills** across 6 categories.

## 4. About — architecture

`About.tsx` (server component, `id="about"`) drops `SectionHead`/`Card` for custom editorial markup:

1. `.about-open` — mono index `05` + `.about-statement` display `h2`.
2. `.about-grid` — `.about-narrative` (story → strengths → interests) + `.about-facts` aside (principles → experience/education/achievements as ruled rows).
3. `.about-direction` — `.about-workflow` numbered steps + `.about-goals`, closing `.about-honesty`.

The aside carries an `h3` "Tanlangan faktlar / Selected facts / Избранные факты" (`about.facts`).

## 5. About — content mapping

| UI | Source |
|---|---|
| story | `profile.story` (fallback `profile.bio`) |
| strengths | `strengthsOf(profile)` |
| interests | `interestsOf(profile)` + `about.interestsNote` |
| principles | `principlesOf(profile)` |
| experience | `experience` (role, company, description, highlights) |
| education | `education` (institution, credential, field, status, period) |
| achievements | `achievementsByKind` (title, issuer, year, verify link) |
| workflow | `listFrom(profile.workflow)` |
| goals | `goalsOf(profile)` |
| honesty | `about.honesty` |

`hasAny` guard returns `null` when every source is empty.

## 6. Contact — architecture

`Contact.tsx` (server component, `id="contact"`, `u-sunken u-section` + `border-t`) is the decisive final state:

1. `.contact-final` — mono index `06` + `.contact-headline` display `h2` + `.contact-lead`.
2. `.contact-cta` — **one primary CTA** (Telegram, `btn--accent btn--lg`) + email secondary (`btn btn--lg`).
3. `.contact-meta` — quiet ruled row: phone / Instagram / GitHub + English level + timezone.
4. `.contact-grid` — `.contact-steps` (3 indexed steps + `.contact-lock`) beside `.contact-form__card` wrapping the existing `ContactForm` in `<Suspense>`.

`ContactForm` is preserved unchanged (DB-backed, real validation/a11y); only the wrapper changed.

## 7. Contact — content mapping

| UI | Source |
|---|---|
| Telegram CTA | `profile.telegram` (`telegramHref`) |
| email CTA | `profile.email` (`mailto:`) |
| metadata | `profile.phone` / `profile.instagram` / `profile.github` |
| English level | `profile.englishLevel` |
| timezone | `contact.tz` |
| steps | `contact.step1/2/3` + `step1t/2t/3t` |
| honesty | `contact.lock` |
| form | `ContactForm` (unchanged) |

## 8. Portrait strategy

`profile.photoUrl` is `""` and no `public/media/portrait.*` exists — **no portrait is rendered, enlarged, upscaled or synthesized**. Identity is carried by text. A portrait can be added later by swapping the CMS `photoUrl` + dropping an asset, with no code change.

## 9. CTA hierarchy

Exactly **one primary CTA**: Telegram. Email is secondary. Other channels are quiet metadata links. Runtime: `accent=1`, total `.contact-cta` buttons = 2, Telegram first.

## 10. Footer continuity

Contact uses `u-sunken` + `border-t border-line-1`, flowing into the footer without a seam. Footer untouched.

## 11. Section rhythm

- **Capabilities** — dense index of 8 ruled rows + quiet 2–3 column toolkit.
- **About** — asymmetric two-column narrative + full-width direction band.
- **Contact** — short intro (headline + CTA + meta) + asymmetric steps/form split.

Indices `04 → 05 → 06` carry the count. Shared primitives are relaxed, not deleted.

## 12. Typography

Display statements (`.about-statement`, `.contact-headline`) use `.display` + `.display-em`; indices use `--font-mono` micro labels; capability numbers use `--font-display` at `clamp(2.5rem, 1.5rem + 3vw, 3.75rem)` with `opacity: 0.22`. No new fonts.

## 13. Spacing

`--section-y` for vertical rhythm; ruled rows via `border-top: var(--c-line-1)`; grids use `minmax(0, 1fr)` breaking at `40/48/64rem`.

## 14. Theme consistency

Only theme tokens (`--c-ink-*`, `--c-surface-1`, `--c-line-*`, `--c-accent`, `--c-canvas-sunken`). No hard-coded light colors; adapts to manual dark automatically.

## 15. Responsive behavior

Capabilities index collapses below `47.99rem`; toolkit 1→2→3 cols; About grid collapses below `64rem`; Contact grid collapses below `64rem`. No horizontal overflow verified.

## 16. Reduced motion

Only CSS scroll-driven `.reveal` (`animation-timeline: view()` in `@supports`); `prefers-reduced-motion: reduce` disables it entirely. No new JS animation.

## 17. Accessibility

One `h2` per section + labelled `h3`s; semantic `ol`/`ul`/`dl`; real `<a href>`; no clickable divs; meaningful alts; visible focus. Removed unused `CopyButton` (email is a real `mailto:` link).

## 18. Locales

All strings via `t/tx/txEach` (uz/en/ru), resolved via `x-locale` → `portfolio_locale` cookie, switched with `?lang=`. Two new keys added (`about.facts`, `contact.how`) in all three locales.

## 19. Performance & server boundaries

All server components; no new client components/data fetching; sections retain `.u-cv` (`content-visibility: auto`); no new image assets.

## 20. Files changed

- `src/components/Capabilities.tsx` — capability index + toolkit.
- `src/components/About.tsx` — editorial narrative.
- `src/components/Contact.tsx` — decisive final state (removed `CopyButton`).
- `src/app/globals.css` — replaced `.capabilities__*` with `.cap-index*`/`.cap-toolkit*`; appended `.about-*`/`.contact-*`.
- `src/lib/messages.ts` — added `about.facts` + `contact.how` (uz/en/ru).

## 21. Runtime validation

`tsc --noEmit` ✅ · `eslint` ✅ · `next build` ✅. Headless-Chromium checks: 3 locales, no horizontal overflow (5 widths), theme toggle, manual dark/light, reduced-motion, heading hierarchy, semantics, single Telegram CTA — all pass (only the pre-existing anonymous `401 /api/auth/me` admin probe).

## 22. Visual evidence

17 PNGs in `/home/user/validation/shots/` (full-page + section crops across viewports/themes/locales). *(Lost with the sandbox reset; re-captured during Phase 3G, which supersedes them.)*

## 23. Limitations

No portrait (by design); scroll-driven `.reveal` is progressive-enhancement only; toolkit lists all 39 skills verbatim (framed as non-ranking); no Vercel credentials → no Preview deployment (validated on local `next start`).

## 24. Phase 3G readiness

Capabilities reads as a capability index, About as a narrative, Contact as one clear final CTA; rhythm varied; truthful, server-rendered, locale-stable, a11y-strong. Build Core (3C), the reveal (3D) and the case study (3E) are untouched. Ready for the Phase 3G responsive/integration pass.

## 25. Git evidence

- **Branch:** `arena/01a07900-muhammad-portfolio`
- **`main`:** untouched at `062cadd`
- **Production:** untouched; no merge; no deployment.
- **Phase 3G:** not started here.
