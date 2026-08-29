"use client";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./ui/Icon";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import { t, type Locale } from "@/lib/i18n-core";

export type NavLink = { id: string; label: string };

type Props = {
  name: string;
  initials: string;
  links: NavLink[];
  ctaLabel?: string;
  locale?: Locale;
  /** `profile.photoUrl` yoki `public/media/portrait.*` — bo'lsa avatar chiqadi */
  portrait?: string | null;
};

/**
 * Sticky header — suzuvchi tab (island).
 * Yozuvlar va shriftlar o'zgarmaydi; faqat yuqori tabning tuzilishi.
 */
const SECONDARY_SECTIONS = new Set(["experience", "education", "achievements", "approach"]);

export default function Header({ name, initials, links, ctaLabel, locale = "uz", portrait }: Props) {
  const cta = ctaLabel ?? t(locale, "hero.cta");
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
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
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
      router.push(`/#${id}`);
    }
  };

  const navLinks = links.filter((l) => l.id !== "home");

  return (
    <header className={`site-header${scrolled || open ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <div className="site-header__bar">
        <a
          href="/#home"
          onClick={(e) => {
            e.preventDefault();
            go(links[0]?.id ?? "home");
          }}
          className="site-header__brand"
        >
          {portrait ? (
            <span className="site-header__avatar">
              <Image
                src={portrait}
                alt=""
                fill
                sizes="32px"
                className="object-cover object-top"
                priority
                unoptimized={portrait.startsWith("/api/media/")}
              />
            </span>
          ) : (
            <span className="site-header__mono">
              {initials || name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="display site-header__name">{name}</span>
        </a>

        <nav aria-label={t(locale, "nav.sections")} className="site-header__nav">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(l.id);
              }}
              aria-current={active === l.id ? "page" : undefined}
              className={`site-header__link${SECONDARY_SECTIONS.has(l.id) ? " site-header__link--more" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="site-header__tools">
          <LangSwitch locale={locale} />
          <ThemeToggle locale={locale} />
          <a
            href="/#contact"
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
            className="btn btn--accent btn--sm site-header__cta"
          >
            {cta}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="icon-btn site-header__menu"
            aria-label={open ? t(locale, "nav.menuClose") : t(locale, "nav.menuOpen")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t(locale, "nav.sections")}
            className="site-header__sheet"
          >
            <nav className="site-header__sheet-nav">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.id);
                  }}
                  aria-current={active === l.id ? "page" : undefined}
                  className="site-header__sheet-link"
                >
                  {l.label}
                  <Icon name="arrow-up-right" size={15} className="text-ink-3" />
                </a>
              ))}
            </nav>
            <div className="site-header__sheet-foot">
              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("contact");
                }}
                className="btn btn--accent btn--lg min-w-0 flex-1"
              >
                {cta}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
