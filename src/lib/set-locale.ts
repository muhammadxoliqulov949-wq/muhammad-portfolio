"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, parseLocale, type Locale } from "@/lib/i18n-core";

/** Tilni http cookie'ga yozadi — keyingi so'rovda getLocale() o'qiydi. */
export async function setLocale(next: string): Promise<Locale> {
  const locale = parseLocale(next);
  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return locale;
}
