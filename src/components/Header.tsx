"use client";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./ui/Icon";
import ThemeToggle from "./ThemeToggle";

export type NavLink = { id: string; label: string };

type Props = {
  name: string;
  initials: string;
  links: NavLink[];
  ctaLabel?: string;
  /** `profile.photoUrl` yoki `public/media/portrait.*` — bo'lsa avatar chiqadi */
  portrait?: string | null;
};

/**
 * Sticky header.
 * Audit tuzatishlari:
 *  - mobil menyu endi `role="dialog"` + aria-expanded/controls, Escape bilan
 *    yopiladi, ochilganda fokusga o'tadi va scroll qulanadi (P2-19);
 *  - aktiv bo'lim `aria-current` bilan belgilanadi;
 *  - backdrop-blur faqat scroll qilinganda (GPU tejamkorligi);
 *  - barcha targetlar ≥44px.
 */
/** kenglik tor bo'lganda yashirinadigan qo'shimcha bo'limlar */
const SECONDARY_SECTIONS = new Set(["about", "education", "achievements", "approach"]);

export default function Header({ name, initials, links, ctaLabel = "Let's Work Together", portrait }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(links[0]?.id ?? "home");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const nodes = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [links]);

  // Mobil panel: Escape + fokus boshqaruvi + scroll lokki
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Boshqa sahifadamiz (masalan case study) — bosh sahifaning o'sha
      // bo'limiga yo'naltiramiz.
      router.push(`/#${id}`);
    }
  };

  const navLinks = links.filter((l) => l.id !== "home");

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-line-1 bg-canvas/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="u-container flex items-center justify-between gap-2 sm:gap-4" style={{ minHeight: "var(--header-h)" }}>
        <a
          href="/#home"
          onClick={(e) => {
            e.preventDefault();
            go(links[0]?.id ?? "home");
          }}
          className="group flex items-center gap-2.5 rounded-2"
        >
          {portrait ? (
            <span className="relative size-9 overflow-hidden rounded-2 ring-1 ring-line-2">
              <Image src={portrait} alt="" fill sizes="36px" className="object-cover object-top" priority unoptimized={portrait.startsWith("/api/media/")} />
            </span>
          ) : (
            <span className="grid size-9 place-items-center rounded-2 bg-accent font-mono text-[11px] font-bold tracking-tight text-accent-ink">
              {initials || name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="display max-w-[42vw] truncate text-[15px] font-semibold tracking-tight sm:max-w-[14rem] lg:max-w-none">
            {name}
          </span>
        </a>

        {/* Desktop nav: lg'da asosiy 5 bo'lim, xl'da hammasi. 9 havolani
            1024px sig'dirish — matnni siqib yuborardi. */}
        <nav aria-label="Sahifa bo'limlari" className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l, i) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(l.id);
              }}
              aria-current={active === l.id ? "true" : undefined}
              className={`relative h-11 items-center gap-1.5 rounded-2 px-3 text-small font-medium transition-colors ${
                SECONDARY_SECTIONS.has(l.id) ? "hidden xl:flex" : "flex"
              } ${active === l.id ? "text-ink-1" : "text-ink-2 hover:text-ink-1"}`}
            >
              <span className="font-mono text-micro text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
              {active === l.id ? (
                <span className="absolute inset-x-3 -bottom-px h-px bg-accent" aria-hidden />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="/#contact" onClick={(e) => { e.preventDefault(); go("contact"); }} className="btn btn--accent btn--sm hidden sm:inline-flex">
            {ctaLabel}
            <Icon name="arrow-right" size={15} />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="icon-btn lg:hidden"
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Sahifa bo'limlari"
          className="lg:hidden"
        >
          <nav className="hairline-x max-h-[70vh] overflow-y-auto border-t border-line-1 bg-canvas/95 px-[var(--gutter)] py-2 backdrop-blur-xl">
            {links.map((l, i) => (
              <a
                key={l.id}
                href={`/#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
                aria-current={active === l.id ? "true" : undefined}
                className="flex min-h-[52px] items-center justify-between gap-4 py-3 text-lead"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-micro text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </span>
                <Icon name="arrow-up-right" size={16} className="text-ink-3" />
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2 border-t border-line-1 px-[var(--gutter)] py-4">
            <ThemeToggle />
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
              className="btn btn--accent btn--lg min-w-0 flex-1"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
