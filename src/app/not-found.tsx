import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { getLocale, t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <main id="main" className="u-container flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="label mb-6 flex items-center gap-3">
        <span className="u-num text-ink-3">404</span>
        <span className="h-px w-6 bg-line-2" aria-hidden />
        <span className="label-accent">{t(locale, "nf.label")}</span>
      </p>
      <h1 className="display text-display-l max-w-xl">
        {t(locale, "nf.titleBefore")} <span className="display-em">{t(locale, "nf.titleEm")}</span>
      </h1>
      <p className="mt-5 max-w-md text-lead text-ink-2">{t(locale, "nf.lead")}</p>
      <div className="mt-9 flex flex-wrap gap-2.5">
        <Link href="/" className="btn btn--accent btn--lg">
          {t(locale, "nf.home")}
          <Icon name="arrow-right" size={15} />
        </Link>
        <Link href="/projects" className="btn btn--lg">
          {t(locale, "nf.works")}
        </Link>
        <Link href="/#contact" className="btn btn--ghost btn--lg">
          {t(locale, "nf.contact")}
        </Link>
      </div>
    </main>
  );
}
