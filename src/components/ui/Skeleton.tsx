import { t, type Locale } from "@/lib/i18n-core";

/**
 * Skeleton — hero shaklini saqlaydi, CLS yo'q.
 */
export default function Skeleton({
  className = "",
  rounded = "rounded-3",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`bg-surface-2 ${rounded} animate-pulse-soft ${className}`}
      suppressHydrationWarning
    />
  );
}

export function HeroSkeleton({ locale = "uz" }: { locale?: Locale }) {
  return (
    <div className="pt-28 pb-[var(--section-y)]" aria-busy="true" aria-label={t(locale, "load")}>
      <div className="u-container">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,22rem)] lg:gap-16">
          <div>
            <Skeleton className="mb-7 h-3 w-40" />
            <Skeleton className="mb-2 h-16 w-4/5" rounded="rounded-2" />
            <Skeleton className="mb-8 h-12 w-3/5" rounded="rounded-2" />
            <Skeleton className="mb-3 h-4 w-full max-w-md" />
            <Skeleton className="mb-8 h-4 w-2/3 max-w-sm" />
            <Skeleton className="h-12 w-48" rounded="rounded-3" />
          </div>
          <Skeleton className="aspect-4/5 w-full max-w-[22rem] justify-self-end" rounded="rounded-[28px]" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="u-section">
      <div className="u-container">
        <Skeleton className="mb-4 h-3 w-28" />
        <Skeleton className="mb-8 h-9 w-2/3" />
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-28" rounded="rounded-4" />
          <Skeleton className="h-28" rounded="rounded-4" />
        </div>
      </div>
    </div>
  );
}
