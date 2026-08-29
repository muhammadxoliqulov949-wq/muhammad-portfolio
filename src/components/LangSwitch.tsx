"use client";

import { useTransition } from "react";
import { LOCALE_COOKIE, LOCALE_META, LOCALES, t, type Locale } from "@/lib/i18n-core";
import { setLocale } from "@/lib/set-locale";

/**
 * UZ / EN / RU — Tun/Kun oldida.
 * Cookie server action orqali yoziladi, keyin to'liq reload — RSC keshini chetlab o'tadi.
 */
export default function LangSwitch({ locale }: { locale: Locale }) {
  const [pending, start] = useTransition();

  function choose(next: Locale) {
    if (next === locale || pending) return;
    start(async () => {
      try {
        await setLocale(next);
      } catch {
        document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
      }
      try {
        localStorage.setItem("locale", next);
      } catch {
        /* private */
      }
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.location.assign(url.pathname + url.search + url.hash);
    });
  }

  return (
    <div className="lang-switch" role="group" aria-label={t(locale, "lang.aria")} aria-busy={pending}>
      {LOCALES.map((id) => (
        <button
          key={id}
          type="button"
          className="lang-switch__btn"
          aria-pressed={locale === id}
          aria-label={LOCALE_META[id].name}
          disabled={pending}
          onClick={() => choose(id)}
        >
          {LOCALE_META[id].label}
        </button>
      ))}
    </div>
  );
}
