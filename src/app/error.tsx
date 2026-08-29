"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { parseLocale, t, type Locale } from "@/lib/i18n-core";

function subscribe() {
  return () => {};
}

function localeFromDom(): Locale {
  return parseLocale(document.documentElement.lang);
}

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useSyncExternalStore(subscribe, localeFromDom, () => "uz" as Locale);
  const after = t(locale, "err.titleAfter");

  return (
    <main className="u-container flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="label mb-6 flex items-center gap-3" role="status">
        <span className="text-danger">
          <Icon name="alert" size={14} />
        </span>
        <span className="label-accent">{t(locale, "err.label")}</span>
      </p>
      <h1 className="display text-display-l max-w-xl">
        {t(locale, "err.titleBefore")} <span className="display-em">{t(locale, "err.titleEm")}</span>
        {after ? ` ${after}` : ""}
      </h1>
      <p className="mt-5 max-w-lg text-lead text-ink-2">{t(locale, "err.lead")}</p>
      {error?.digest ? (
        <p className="mt-4 font-mono text-micro uppercase tracking-wider text-ink-3">
          reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-9 flex flex-wrap gap-2.5">
        <button type="button" onClick={reset} className="btn btn--accent btn--lg">
          <Icon name="undo" size={15} />
          {t(locale, "err.retry")}
        </button>
        <Link href="/" className="btn btn--lg">
          {t(locale, "err.home")}
        </Link>
      </div>
    </main>
  );
}
