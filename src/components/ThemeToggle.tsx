"use client";

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

/** Bitta tugma: tun ↔ kun. */
export default function ThemeToggle({ locale = "uz" }: { locale?: Locale }) {
  return (
    <button
      type="button"
      className="theme-switch theme-switch__btn"
      aria-label={t(locale, "theme.group")}
      onClick={() => {
        const cur = document.documentElement.getAttribute("data-theme");
        applyTheme(cur === "light" ? "dark" : "light");
      }}
    >
      <span className="theme-switch__moon">
        <Icon name="moon" size={14} />
      </span>
      <span className="theme-switch__sun">
        <Icon name="sun" size={14} />
      </span>
    </button>
  );
}
