import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <main id="main" className="u-container flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="label mb-6 flex items-center gap-3">
        <span className="u-num text-ink-3">404</span>
        <span className="h-px w-6 bg-line-2" aria-hidden />
        <span className="label-accent">Sahifa topilmadi</span>
      </p>
      <h1 className="display text-display-l max-w-xl">
        Bunday manzil <span className="display-em">yo&apos;q</span>
      </h1>
      <p className="mt-5 max-w-md text-lead text-ink-2">
        Havola eskirgan yoki manzil noto&apos;g&apos;ri yozilgan bo&apos;lishi mumkin. Quyidagilardan birini
        tanlang — uzoqqa ketmadim.
      </p>
      <div className="mt-9 flex flex-wrap gap-2.5">
        <Link href="/" className="btn btn--accent btn--lg">
          Bosh sahifa
          <Icon name="arrow-right" size={15} />
        </Link>
        <Link href="/projects" className="btn btn--lg">
          Ishlar
        </Link>
        <Link href="/#contact" className="btn btn--ghost btn--lg">
          Aloqa
        </Link>
      </div>
    </main>
  );
}
