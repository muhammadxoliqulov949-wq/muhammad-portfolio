# Performance baseline

This project keeps three different measurements separate:

1. **Production request measurements** — TTFB, total document time, response cache headers, and same-origin HTML/JS/CSS/font/image transfers.
2. **Lighthouse lab measurements** — emulated mobile/desktop LCP, CLS and Total Blocking Time (an interaction proxy, not field INP).
3. **Field Core Web Vitals** — LCP, CLS and INP from CrUX or an installed RUM system. These are unavailable when the site has insufficient real-user data and must never be inferred from Lighthouse.

## Repeatable commands

Start a production build for local lab tests:

```bash
AUTH_SECRET="a-local-validation-secret-with-at-least-32-characters" npm run build
AUTH_SECRET="a-local-validation-secret-with-at-least-32-characters" npm start
```

In another terminal:

```bash
npm run perf:baseline -- http://localhost:3000
npm run perf:lighthouse:mobile -- http://localhost:3000
npm run perf:lighthouse:desktop -- http://localhost:3000
```

Measure the live deployment without changing it:

```bash
PERF_RUNS=5 npm run perf:baseline -- https://muhammad-portfolio-cyan.vercel.app/
```

Lighthouse writes ignored HTML/JSON reports to `reports/performance/`. The request baseline prints JSON to stdout, so CI may redirect it into an artifact if desired.

## Rendering decision

Public HTML intentionally remains request-rendered because the selected locale is an HTTP cookie and changes server-rendered text, metadata, JSON-LD and the document `lang`. Shared caching of that HTML without a locale-aware cache key could serve the wrong language.

The expensive locale-independent database reads are cached separately for one hour with the `portfolio-site-data` tag. Admin content/media mutations expire that tag immediately and continue to revalidate affected paths. This preserves locale correctness while removing repeated libSQL round trips from ordinary public requests.

## Phase 3A reference

The pre-change live audit measured approximately:

- median TTFB: 7.89 s from the audit region
- compressed HTML: 28.8 KB
- JavaScript referenced by the homepage: 248 KB compressed
- CSS: 15 KB compressed
- font files advertised as preload: 699 KB

These numbers are production request observations, not Lighthouse or CrUX results. Re-run the commands after each deployment; network location and cold starts affect request timing.
