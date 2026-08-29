import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, parseLocale, type Locale } from "./i18n-core";

export {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_META,
  LOCALES,
  parseLocale,
  t,
  tx,
  txEach,
  type Locale,
} from "./i18n-core";

/**
 * Til: proxy `x-locale` (URL ?lang= cookie'dan ustun), so'ng cookie, so'ng uz.
 * Layout searchParams o'qimaydi — header shu so'rovning tilini shu yerda oladi.
 */
export async function getLocale(): Promise<Locale> {
  const headerVal = (await headers()).get("x-locale");
  if (headerVal) return parseLocale(headerVal);

  const cookieVal = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (cookieVal) return parseLocale(cookieVal);

  return DEFAULT_LOCALE;
}
