"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isNotFound = error?.digest && /404|not found/i.test(error.message ?? "");
  return (
    <main className="u-container flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="label mb-6 flex items-center gap-3" role="status">
        <span className={isNotFound ? "text-warn" : "text-danger"}>
          <Icon name="alert" size={14} />
        </span>
        <span className="label-accent">Xatolik</span>
      </p>
      <h1 className="display text-display-l max-w-xl">
        Nimadir <span className="display-em">to&apos;xtab</span> qoldi
      </h1>
      <p className="mt-5 max-w-lg text-lead text-ink-2">
        Sahifani qayta yuklab ko&apos;ring. Muammo davom etsa — menga yozing, tekshiraman.
      </p>
      {error?.digest ? (
        <p className="mt-4 font-mono text-micro uppercase tracking-wider text-ink-3">
          reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-9 flex flex-wrap gap-2.5">
        <button type="button" onClick={reset} className="btn btn--accent btn--lg">
          <Icon name="undo" size={15} />
          Qayta urinish
        </button>
        <Link href="/" className="btn btn--lg">
          Bosh sahifa
        </Link>
      </div>
    </main>
  );
}
