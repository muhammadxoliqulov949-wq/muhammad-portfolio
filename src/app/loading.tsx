import { HeroSkeleton, SectionSkeleton } from "@/components/ui/Skeleton";
import { getLocale } from "@/lib/i18n";

export default async function Loading() {
  const locale = await getLocale();
  return (
    <div>
      <HeroSkeleton locale={locale} />
      <SectionSkeleton />
    </div>
  );
}
