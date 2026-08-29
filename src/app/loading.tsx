import { SectionSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true">
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
