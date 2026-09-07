"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHead from "@/components/ui/Section";
import { t, type Locale } from "@/lib/i18n-core";

gsap.registerPlugin(ScrollTrigger);

/**
 * Build Core — "build strata" obyekti (Phase 3C motion).
 *
 * Bitta normallashtirilgan progress `p ∈ [0,1]` bitta GSAP timeline +
 * bitta ScrollTrigger orqali besh holatni boshqaradi:
 *   ARRIVAL (0–0.14) → PROTOTYPE (0.14–0.34) → CODE REVIEW (0.34–0.58)
 *   → VALIDATION (0.58–0.76) → DEPLOYMENT (0.76–1.0)
 *
 * Arxitektura (Phase 2):
 *   - Faqat desktop (≥64rem) + reduced-motion YO'Q da timeline ishlaydi.
 *   - Tablet/mobile/reduced-motion: pin YO'Q, scrub YO'Q — CSS statik holat.
 *   - Holat almashinuvi faqat klass (`--pending/--active/--validated`) orqali,
 *     DOM qayta tuzilmaydi; React har scroll freymda re-render QILMAYDI.
 *   - Content (i18n, CMS) motion holatidan ajralgan — faqat prop.
 */
const STEPS = ["s1", "s2", "s3", "s4", "s5"] as const;

/** State boundaries (normalized p) — Phase 2 approved ranges. */
const BOUNDS = [0.14, 0.34, 0.58, 0.76] as const;
const STATE_KEYS = ["arrival", "prototype", "review", "validation", "deployment"] as const;

export default function BuildCoreSection({ locale = "uz" }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const stateNames = STATE_KEYS.map((k) => t(locale, `build.${k}`));

    const mm = gsap.matchMedia();

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      const group = section.querySelector<HTMLElement>(".build-core__group");
      const strata = Array.from(section.querySelectorAll<HTMLElement>(".build-core__stratum"));
      const core = section.querySelector<HTMLElement>(".build-core__core");
      const labels = Array.from(section.querySelectorAll<HTMLElement>(".build-core__stratum .build-core__lbl"));
      const fill = section.querySelector<HTMLElement>(".build-core__progress-fill");
      const nameEl = section.querySelector<HTMLElement>(".build-core__meta-name");
      const numEl = section.querySelector<HTMLElement>(".build-core__meta-state .u-num");
      const viewport = section.querySelector<HTMLElement>(".build-core__viewport");
      const connLines = Array.from(section.querySelectorAll<SVGLineElement>(".build-core__connectors line"));
      if (!group || strata.length === 0) return;

      // --- Arrival asosiy holat (idempotent, CSS'dagi statik bilan mos) ---
      gsap.set(group, { rotateX: 6, scale: 0.96, transformOrigin: "50% 100%" });
      gsap.set(strata, { y: 0, z: 0 });
      if (core) gsap.set(core, { opacity: 0.72 });
      gsap.set(labels, { opacity: 0.55 });
      gsap.set(connLines, { opacity: 0 });

      let lastState = -1;
      /** p → 0..4 holat indeksi; faqat o'zgarganda DOM'ni yangilaydi. */
      const applyState = (p: number) => {
        const idx = p < BOUNDS[0] ? 0 : p < BOUNDS[1] ? 1 : p < BOUNDS[2] ? 2 : p < BOUNDS[3] ? 3 : 4;
        if (idx === lastState) return;
        lastState = idx;
        viewport?.setAttribute("data-state", STATE_KEYS[idx]);
        const clsFor = (i: number) =>
          idx === 0 ? "pending" : idx === 1 ? (i === 0 ? "active" : "pending") : idx === 2 ? (i <= 2 ? "active" : "pending") : "validated";
        strata.forEach((el, i) => {
          el.classList.remove("build-core__stratum--pending", "build-core__stratum--active", "build-core__stratum--validated");
          el.classList.add(`build-core__stratum--${clsFor(i)}`);
        });
        if (nameEl) nameEl.textContent = stateNames[idx];
        if (numEl) numEl.textContent = String(idx).padStart(2, "0");
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => applyState(self.progress),
          onRefresh: (self) => applyState(self.progress),
        },
      });

      // ARRIVAL (0 → 0.14): core slab settle-in (anchor), strata kutmoqda
      if (core) tl.to(core, { opacity: 1, duration: 0.14 }, 0);

      // PROTOTYPE (0.14 → 0.34): ozgina fan-out + label/lar oydinlashadi
      tl.to(strata, { y: (i) => i * 1.5, z: (i) => i * 2, duration: 0.2 }, 0.14);
      tl.to(labels, { opacity: 1, duration: 0.2 }, 0.14);

      // CODE REVIEW (0.34 → 0.58): maksimal ajralish + inspeksiya
      tl.to(strata, { y: (i) => i * 7, z: (i) => i * 10, duration: 0.24 }, 0.34);
      tl.to(group, { rotateX: 4, scale: 1.02, duration: 0.24 }, 0.34);
      tl.to(connLines, { opacity: 1, duration: 0.24 }, 0.34);

      // VALIDATION (0.58 → 0.76): qayta tekislash + muhrlanish
      tl.to(strata, { y: (i) => i * 1.5, z: (i) => i * 2, duration: 0.18 }, 0.58);
      tl.to(group, { scale: 1, duration: 0.18 }, 0.58);

      // DEPLOYMENT (0.76 → 1.0): siqilish + joylashish (3D'ga tayyor)
      tl.to(strata, { y: 0, z: 0, duration: 0.24 }, 0.76);
      tl.to(group, { rotateX: 0, duration: 0.24 }, 0.76);
      tl.to(labels, { opacity: 0.45, duration: 0.2 }, 0.76);
      tl.to(connLines, { opacity: 0.25, duration: 0.2 }, 0.76);

      // Progress qoidasi — to'liq span bo'ylab 0 → 100%
      if (fill) tl.fromTo(fill, { width: "0%" }, { width: "100%", duration: 1 }, 0);

      applyState(0);
    });

    return () => mm.revert();
  }, [locale]);

  return (
    <section ref={sectionRef} id="build" className="build-core u-section" aria-labelledby="build-title">
      <div className="u-container">
        <SectionHead
          index="02"
          eyebrow={t(locale, "build.eyebrow")}
          title={
            <>
              {t(locale, "build.titleBefore")} <span className="display-em">{t(locale, "build.titleEm")}</span>
            </>
          }
          lead={t(locale, "build.lead")}
        />

        <div className="build-core__viewport" data-state="arrival">
          <div className="build-core__object">
            <div className="build-core__scene">
              <div className="build-core__group">
                <svg
                  className="build-core__connectors"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line x1="2" y1="10" x2="40" y2="10" />
                  <line x1="2" y1="26" x2="40" y2="26" />
                  <line x1="2" y1="42" x2="40" y2="42" />
                  <line x1="2" y1="58" x2="40" y2="58" />
                  <line x1="2" y1="74" x2="40" y2="74" />
                </svg>

                <ol className="build-core__stack">
                  <li className="build-core__core">
                    <span className="build-core__idx u-num" aria-hidden="true">
                      00
                    </span>
                    <span className="build-core__lbl">{t(locale, "build.core")}</span>
                  </li>

                  {STEPS.map((key, i) => (
                    <li
                      key={key}
                      className="build-core__stratum build-core__stratum--pending"
                      data-step={i + 1}
                    >
                      <span className="build-core__idx u-num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="build-core__lbl">{t(locale, `build.${key}`)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="build-core__meta">
              <span className="build-core__meta-state">
                <span className="u-num" aria-hidden="true">
                  00
                </span>
                <span className="build-core__meta-name">{t(locale, "build.arrival")}</span>
              </span>
              <span className="build-core__progress" aria-hidden="true">
                <span className="build-core__progress-fill" />
              </span>
            </div>
          </div>

          <p className="sr-only">{t(locale, "build.sr")}</p>
        </div>
      </div>
    </section>
  );
}
