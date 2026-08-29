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
 * Til manbai: 1) cookie  2) proxy qo'ygan x-locale  3) default uz.
 * cookies()/headers() — static kesh o'rniga har so'rovda o'qiladi.
 */
export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const cookieVal = jar.get(LOCALE_COOKIE)?.value;
  if (cookieVal) return parseLocale(cookieVal);

  const headerVal = (await headers()).get("x-locale");
  if (headerVal) return parseLocale(headerVal);

  return DEFAULT_LOCALE;
}
