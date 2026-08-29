"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_META, LOCALES, t, type Locale } from "@/lib/i18n-core";

/**
 * UZ / EN / RU — Tun/Kun oldida. Cookie + refresh, birinchi bo'yoqda to'g'ri til.
 */
export default function LangSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    try {
      localStorage.setItem("locale", next);
    } catch {
      /* private */
    }
    document.documentElement.lang = LOCALE_META[next].html;
    router.refresh();
  }

  return (
    <div className="lang-switch" role="group" aria-label={t(locale, "lang.aria")}>
      {LOCALES.map((id) => (
        <button
          key={id}
          type="button"
          className="lang-switch__btn"
          aria-pressed={locale === id}
          aria-label={LOCALE_META[id].name}
          onClick={() => choose(id)}
        >
          {LOCALE_META[id].label}
        </button>
      ))}
    </div>
  );
}
