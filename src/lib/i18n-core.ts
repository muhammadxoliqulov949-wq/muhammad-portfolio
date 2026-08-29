import { UI, CONTENT } from "./messages";

export const LOCALES = ["uz", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";
export const LOCALE_COOKIE = "portfolio_locale";

export const LOCALE_META: Record<Locale, { label: string; html: string; name: string }> = {
  uz: { label: "UZ", html: "uz", name: "Oʻzbekcha" },
  en: { label: "EN", html: "en", name: "English" },
  ru: { label: "RU", html: "ru", name: "Русский" },
};

export function parseLocale(value?: string | null): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}

type Leaf = string;
type Tree = { [key: string]: Leaf | Tree };

function lookup(tree: Tree, path: string): string | undefined {
  const parts = path.split(".");
  let cur: Leaf | Tree | undefined = tree;
  for (const p of parts) {
    if (!cur || typeof cur === "string") return undefined;
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function t(locale: Locale, key: string): string {
  return lookup(UI[locale] as Tree, key) ?? lookup(UI.uz as Tree, key) ?? key;
}

export function tx(locale: Locale, text?: string | null): string {
  const src = (text ?? "").trim();
  if (!src || locale === "uz") return src;
  return CONTENT[src]?.[locale] ?? src;
}

export function txEach(locale: Locale, items: string[]): string[] {
  return items.map((item) => tx(locale, item));
}
