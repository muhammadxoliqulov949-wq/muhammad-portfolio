/**
 * Skeleton'lar — audit P1: `loading.tsx` umuman yo'q edi, shuning uchun
 * kechikkan so'rovda oq ekran ko'rinardi. Skeleton kontent o'lchamini
 * saqlaydi → CLS yo'q.
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
      role="status"
      aria-live="polite"
      aria-label="Kontent yuklanmoqda"
      className={`bg-surface-2 ${rounded} animate-pulse-soft ${className}`}
      suppressHydrationWarning
    />
  );
}

export function SectionSkeleton() {
  return (
    <div className="u-section">
      <div className="u-container">
        <Skeleton className="mb-4 h-3 w-28" />
        <Skeleton className="mb-8 h-9 w-2/3" />
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-40" rounded="rounded-4" />
          <Skeleton className="h-40" rounded="rounded-4" />
          <Skeleton className="h-40" rounded="rounded-4" />
        </div>
      </div>
    </div>
  );
}
