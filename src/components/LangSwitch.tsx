"use client";

import { useRouter } from "next/navigation";
import { LOCALE_META, LOCALES, t, type Locale } from "@/lib/i18n-core";
import { setLocale } from "@/lib/set-locale";

/** Bitta tugma: UZ → EN → RU, sahifa qayta yuklanmasdan. */
export default function LangSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();

  async function cycle() {
    const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];
    try {
      localStorage.setItem("locale", next);
    } catch {
      /* private */
    }
    await setLocale(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
  }

  return (
    <button
      type="button"
      className="lang-switch lang-switch__btn"
      aria-label={`${t(locale, "lang.aria")}: ${LOCALE_META[locale].name}`}
      title={LOCALE_META[locale].name}
      onClick={() => void cycle()}
    >
      {LOCALE_META[locale].label}
    </button>
  );
}
