"use client";

import { useEffect, useState } from "react";
import Icon from "./ui/Icon";
import { t, type Locale } from "@/lib/i18n-core";

type Theme = "dark" | "light";

const COLORS: Record<Theme, string> = { dark: "#0a0c10", light: "#f8f6f0" };

function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", next);
  root.style.colorScheme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private rejim */
  }
  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
    el.setAttribute("content", COLORS[next]);
    el.removeAttribute("media");
  });
  window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
}

export default function ThemeToggle({ locale = "uz" }: { locale?: Locale }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const read = (): Theme => {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "light" || attr === "dark") return attr;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    setTheme(read());
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  function choose(next: Theme) {
    applyTheme(next);
    setTheme(next);
  }

  if (theme === null) {
    return <span className="theme-switch" aria-hidden />;
  }

  return (
    <div className="theme-switch" role="group" aria-label={t(locale, "theme.group")}>
      <button
        type="button"
        className="theme-switch__btn"
        aria-pressed={theme === "dark"}
        aria-label={t(locale, "theme.darkAria")}
        onClick={() => choose("dark")}
      >
        <Icon name="moon" size={13} />
        <span className="theme-switch__label">{t(locale, "theme.dark")}</span>
      </button>
      <button
        type="button"
        className="theme-switch__btn"
        aria-pressed={theme === "light"}
        aria-label={t(locale, "theme.lightAria")}
        onClick={() => choose("light")}
      >
        <Icon name="sun" size={13} />
        <span className="theme-switch__label">{t(locale, "theme.light")}</span>
      </button>
    </div>
  );
}
