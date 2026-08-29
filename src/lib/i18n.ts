import { cookies } from "next/headers";
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

export async function getLocale(): Promise<Locale> {
  try {
    return parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  } catch {
    return DEFAULT_LOCALE;
  }
}
