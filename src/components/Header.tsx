"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#home", label: "Bosh sahifa" },
  { href: "#skills", label: "Ko'nikmalar" },
  { href: "#services", label: "Xizmatlar" },
  { href: "#projects", label: "Loyihalar" },
  { href: "#contact", label: "Aloqa" },
];

type Props = {
  fullName: string;
  initials: string;
};

export default function Header({ fullName, initials }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s!));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(5,8,22,0.82)] backdrop-blur-xl border-b border-[var(--border)] shadow-[0_10px_40px_rgba(2,6,23,0.45)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="pf-container flex justify-between items-center py-3.5">
        <a href="#home" className="flex items-center gap-2.5 group">
          <span className="w-10 h-10 rounded-xl grid place-items-center font-display font-extrabold text-white bg-[var(--grad)] shadow-[0_6px_20px_rgba(0,183,255,0.35)] transition-transform duration-300 group-hover:scale-105">
            {initials}
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            {fullName}
            <span className="text-[var(--blue2)]">.</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                active === l.href
                  ? "text-[var(--blue2)] bg-[rgba(0,183,255,0.08)]"
                  : "pf-muted hover:text-[var(--text)]"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="pf-btn pf-btn-primary ml-3 !py-2 !px-5 text-sm">
            Ish buyurtma qilish
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menyu"
          className="md:hidden w-10 h-10 grid place-items-center rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.04)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h10" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <nav className="md:hidden border-t border-[var(--border)] bg-[rgba(5,8,22,0.96)] backdrop-blur-xl px-6 py-4 flex flex-col gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl font-medium pf-muted hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.04)]"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className="pf-btn pf-btn-primary mt-2">
            Ish buyurtma qilish
          </a>
        </nav>
      ) : null}
    </header>
  );
}
