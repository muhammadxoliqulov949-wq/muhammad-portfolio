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

/**
 * Tanlangan holat html[data-theme] orqali CSS'da — React state yo'q.
 * Bootstrap skripti hydrationdan oldin data-theme qo'yadi, shuning uchun
 * server va client bir xil tugma daraxtini chizadi (hydration mismatch yo'q).
 */
export default function ThemeToggle({ locale = "uz" }: { locale?: Locale }) {
  return (
    <div className="theme-switch" role="group" aria-label={t(locale, "theme.group")}>
      <button
        type="button"
        className="theme-switch__btn"
        data-theme-set="dark"
        aria-label={t(locale, "theme.darkAria")}
        onClick={() => applyTheme("dark")}
      >
        <Icon name="moon" size={13} />
        <span className="theme-switch__label">{t(locale, "theme.dark")}</span>
      </button>
      <button
        type="button"
        className="theme-switch__btn"
        data-theme-set="light"
        aria-label={t(locale, "theme.lightAria")}
        onClick={() => applyTheme("light")}
      >
        <Icon name="sun" size={13} />
        <span className="theme-switch__label">{t(locale, "theme.light")}</span>
      </button>
    </div>
  );
}
