"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const SEEN_KEY = "__intro_seen";

/**
 * IntroOverlay — ~1.1 soniyalik brend intro (Phase 3C).
 *
 * Bloklamaydi: hero to'liq DOM'da (SSR), overlay faqat dekorativ mark
 * (`M.` + accent rule), `aria-hidden` + `pointer-events: none`, CSS'da
 * `opacity: 0` (JS'siz ham ko'rinmaydi).
 *   - reduced-motion → intro yo'q (yashirin qoladi).
 *   - sessiyada ko'rilgan → intro yo'q.
 *   - aks holda: mark + rule kirib, ~0.4s ushlanib, chiqib ketadi.
 *
 * Soxta loader/foiz/spinner yo'q; tarmoq kerak emas.
 */
export default function IntroOverlay() {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* sessionStorage bloklangan bo'lsa — intro har safar o'ynaydi (zararsiz) */
    }
    if (reduced || seen) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignorable */
    }

    const mark = el.querySelector<HTMLElement>(".intro-overlay__mark");
    const rule = el.querySelector<HTMLElement>(".intro-overlay__rule");

    const tl = gsap.timeline();
    tl.set(el, { opacity: 1 });
    if (mark) tl.fromTo(mark, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0);
    if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 0.08);
    tl.to(el, { opacity: 0, duration: 0.45, ease: "power1.in" }, "+=0.42");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className="intro-overlay" aria-hidden="true">
      <span className="intro-overlay__mark display">M.</span>
      <span className="intro-overlay__rule" />
    </div>
  );
}
