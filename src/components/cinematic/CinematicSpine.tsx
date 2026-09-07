"use client";

import type { ReactNode } from "react";
import BuildCoreSection from "./BuildCoreSection";
import ProductTransition from "./ProductTransition";
import type { Project } from "@/lib/content";
import type { Locale } from "@/lib/i18n-core";

/**
 * CinematicSpine — bosh sahifaning kinematik qismini o'rab turuvchi
 * client chegara. Phase 3C da scroll-motion BuildCoreSection ichida
 * (bitta GSAP timeline + bitta ScrollTrigger) yashaydi; bu yerda faqat
 * server'da render qilingan IntroHero (`children`) + BuildCoreSection +
 * ProductTransition tarkibi saqlanadi.
 *
 * Muhim: DB yoki CMS'ga tegmaydi — hamma ma'lumot serializable prop.
 */
export default function CinematicSpine({
  children,
  project,
  locale,
}: {
  children: ReactNode;
  project: Project | null;
  locale: Locale;
}) {
  return (
    <div className="cinematic-spine" data-narrative="dark">
      {children}
      <BuildCoreSection locale={locale} />
      <ProductTransition project={project} locale={locale} />
    </div>
  );
}
