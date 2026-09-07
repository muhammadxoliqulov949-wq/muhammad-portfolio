"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Device from "@/components/ui/Device";
import type { Project } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n-core";

gsap.registerPlugin(ScrollTrigger);

function hostOf(link: string | null | undefined): string | null {
  if (!link) return null;
  const v = link.trim();
  if (!/^https?:/i.test(v)) return null;
  try {
    return new URL(v).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * ProductTransition — Deployment → IELTS.mock cinematic reveal (Phase 3D).
 *
 * Build Core Deployment (Phase 3C, p=1) qanday tugasa, shu yerda shunday
 * boshlanadi: muhrlangan "paket" (kichik freym) → mahsulot ramkasi →
 * haqiqiy skrinshot ochiladi → full-bleed → dark→light tema o'tishi.
 *
 * Arxitektura (Option B, Phase 3D §3): Build Core'ning timeline'iga
 * aralashmaydigan, lekin u bilan mahkam bog'langan IKKINCHI timeline +
 * IKKINCHI ScrollTrigger (faqat desktop + reduced-motion yo'q). Bitta
 * normallashgan reveal progress `r ∈ [0,1]` barcha xususiyatni boshqaradi;
 * `--theme-progress` kanali orqali dark→light tema o'tadi (spine'da).
 *   - r 0.00–0.18  Deployment ushlanishi (paket)
 *   - r 0.18–0.42  Ramka shakllanishi
 *   - r 0.42–0.62  Skrinshot ochilishi (top-down clip)
 *   - r 0.62–0.85  Full-bleed kengayishi
 *   - r 0.85–1.00  O'rnashish + tema → light
 *
 * Tablet/mobile/reduced-motion: timeline YO'Q, pin YO'Q — statik freym +
 * skrinshot normal oqimda (CSS yordamida yengil entrance).
 */
export default function ProductTransition({
  project,
  locale = "uz",
}: {
  project: Project | null;
  locale?: Locale;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const spine = section.closest<HTMLElement>(".cinematic-spine");
    const frame = section.querySelector<HTMLElement>(".product-transition__frame");
    const viewport = section.querySelector<HTMLElement>(".product-transition__viewport");
    const deploy = section.querySelector<HTMLElement>(".product-transition__deploy");
    if (!frame || !viewport) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
      // r=0 boshlang'ich holat (Phase 3C deployment'ga vizual davom)
      gsap.set(frame, { scale: 0.42, transformOrigin: "50% 100%", opacity: 1 });
      gsap.set(viewport, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(deploy, { opacity: 1 });
      if (spine) gsap.set(spine, { "--theme-progress": 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // r 0.18 → 0.42 : ramka shakllanishi (paket → brauzer freym)
      tl.to(frame, { scale: 0.72, duration: 0.24 }, 0.18);

      // r 0.42 → 0.62 : skrinshot ochilishi (top-down, distortion yo'q)
      tl.to(viewport, { clipPath: "inset(0 0 0% 0)", duration: 0.2 }, 0.42);
      tl.to(deploy, { opacity: 0, duration: 0.16 }, 0.42);

      // r 0.62 → 0.85 : full-bleed kengayishi
      tl.to(frame, { scale: 1, duration: 0.23 }, 0.62);

      // r 0.85 → 1.00 : tema → light ("mahsulot chiroqni yoqadi")
      if (spine) tl.to(spine, { "--theme-progress": 1, duration: 0.15 }, 0.85);
    });

    return () => mm.revert();
  }, []);

  if (!project) return null;

  const img =
    typeof project.image === "string" && project.image.trim() ? project.image : null;
  const host = hostOf(project.link);

  return (
    <section
      ref={sectionRef}
      className="product-transition"
      data-product-reveal
      aria-label={project.title || "Product"}
    >
      <div className="u-container">
        <p className="label product-transition__eyebrow">
          <span className="dot" aria-hidden />
          <span className="label-accent">{t(locale, "work.featured")}</span>
        </p>

        <div className="product-transition__stage">
          <div className="product-transition__frame" data-product-frame>
            <Device label={host || project.title}>
              <div className="product-transition__viewport">
                {img ? (
                  <Image
                    src={img}
                    alt={`${project.title} — ${t(locale, "work.cover")}`}
                    fill
                    priority
                    sizes="(min-width: 64rem) 80rem, 100vw"
                    className="product-transition__img"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-surface-2">
                    <span className="font-mono text-small text-ink-2">{host || project.title}</span>
                  </div>
                )}
              </div>
            </Device>
          </div>

          <p className="product-transition__deploy" aria-hidden="true">
            <span className="u-num">{t(locale, "build.deployment")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
