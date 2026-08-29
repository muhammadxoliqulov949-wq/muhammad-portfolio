"use client";

import { usePathname } from "next/navigation";
import { LOCALE_META, LOCALES, t, type Locale } from "@/lib/i18n-core";
import { setLocale } from "@/lib/set-locale";

/**
 * UZ / EN / RU — Tun/Kun oldida.
 * To'liq hujjat navigatsiyasi: App Router layout'i searchParams o'zgarganda
 * qayta chizilmaydi, shuning uchun soft refresh tilni yangilamaydi.
 */
export default function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";

  function choose(next: Locale) {
    if (next === locale) return;
    try {
      localStorage.setItem("locale", next);
    } catch {
      /* private */
    }
    void setLocale(next);
    const url = new URL(window.location.href);
    url.pathname = pathname;
    url.searchParams.set("lang", next);
    window.location.assign(url.pathname + url.search + url.hash);
  }

  return (
    <div className="lang-switch" role="group" aria-label={t(locale, "lang.aria")}>
      {LOCALES.map((id) => (
        <button
          key={id}
          type="button"
          className="lang-switch__btn"
          aria-pressed={locale === id ? "true" : "false"}
          aria-label={LOCALE_META[id].name}
          onClick={() => choose(id)}
        >
          {LOCALE_META[id].label}
        </button>
      ))}
    </div>
  );
}
