"use client";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./ui/Icon";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import { t, type Locale } from "@/lib/i18n-core";

export type NavLink = { id: string; label: string };

type Props = {
  name: string;
  initials: string;
  links?: NavLink[] | null;
  ctaLabel?: string;
  locale?: Locale;
  portrait?: string | null;
};

/**
 * Sticky header — suzuvchi tab.
 * Asosiy 4 havola + «Yana» — 80rem da yo'qolmaydi.
 */
const PRIMARY = new Set(["about", "work", "services", "contact"]);

export default function Header({
  name,
  initials,
  links = [],
  ctaLabel,
  locale = "uz",
  portrait,
}: Props) {
  const items = useMemo(
    () =>
      (Array.isArray(links) ? links : []).filter(
        (l): l is NavLink => !!l && typeof l.id === "string" && l.id.length > 0,
      ),
    [links],
  );
  const cta = ctaLabel ?? t(locale, "hero.cta");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(items[0]?.id ?? "home");
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        setMoreOpen(false);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const nodes = items
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
  }, [items]);

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

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const go = (id: string) => {
    setOpen(false);
    setMoreOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const navLinks = items.filter((l) => l.id !== "home");
  const primary = navLinks.filter((l) => PRIMARY.has(l.id));
  const extra = navLinks.filter((l) => !PRIMARY.has(l.id));

  return (
    <header className={`site-header${scrolled || open ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <div className="site-header__bar">
        <Link
          href="/#home"
          onClick={(e) => {
            e.preventDefault();
            go(items[0]?.id ?? "home");
          }}
          className="site-header__brand"
          aria-current={active === "home" ? "page" : undefined}
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
              {initials || (typeof name === "string" && name ? name.slice(0, 2) : "MX").toUpperCase()}
            </span>
          )}
          <span className="display site-header__name">
            {typeof name === "string" && name ? name : "Portfolio"}
          </span>
        </Link>

        <nav aria-label={t(locale, "nav.sections")} className="site-header__nav">
          {primary.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(l.id);
              }}
              aria-current={active === l.id ? "page" : undefined}
              className="site-header__link"
            >
              {l.label}
            </a>
          ))}
          {extra.length > 0 ? (
            <div className="site-header__more" ref={moreRef}>
              <button
                type="button"
                className="site-header__link site-header__more-btn"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((v) => !v)}
              >
                {t(locale, "nav.more")}
                <Icon name="chevron-down" size={12} />
              </button>
              {moreOpen ? (
                <div className="site-header__more-panel" role="menu">
                  {extra.map((l) => (
                    <a
                      key={l.id}
                      href={`/#${l.id}`}
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        go(l.id);
                      }}
                      aria-current={active === l.id ? "page" : undefined}
                      className="site-header__more-item"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </nav>

        <div className="site-header__tools">
          <LangSwitch locale={locale} />
          <ThemeToggle locale={locale} />
          <Link
            href="/#contact"
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
            className="btn btn--accent btn--sm site-header__cta"
          >
            {cta}
          </Link>
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
              {items.map((l) => (
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
              <Link
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("contact");
                }}
                className="btn btn--accent btn--lg min-w-0 flex-1"
              >
                {cta}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
