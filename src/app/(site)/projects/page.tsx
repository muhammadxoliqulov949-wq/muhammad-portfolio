import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SectionHead from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { getSiteData, safeHref, techOf } from "@/lib/content";
import { getLocale, t, tx } from "@/lib/i18n";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "archive.title"),
    description: t(locale, "archive.lead"),
    alternates: { canonical: "/projects" },
  };
}

/** Ishlar arxivi — bosh sahifada tanlanganlar, bu yerda hammasi. */
export default async function ProjectsIndexPage() {
  const [{ projects }, locale] = await Promise.all([getSiteData(), getLocale()]);

  const heading =
    projects.length === 1 ? (
      <>
        {t(locale, "archive.oneBefore")} <span className="display-em">{t(locale, "archive.oneEm")}</span>
      </>
    ) : (
      <>
        {projects.length} {t(locale, "archive.manyAfter")}{" "}
        <span className="display-em">{t(locale, "archive.manyEm")}</span>
      </>
    );

  return (
    <div className="pt-[calc(var(--header-h)+3rem)] pb-[var(--section-y)]">
      <div className="u-container">
        <SectionHead
          index="Arxiv"
          eyebrow={t(locale, "work.eyebrow")}
          title={heading}
          lead={t(locale, "archive.lead")}
          action={
            <Link href="/#contact" className="btn btn--sm">
              {t(locale, "archive.yours")}
              <Icon name="arrow-up-right" size={14} />
            </Link>
          }
        />

        {projects.length === 0 ? (
          <Card className="p-8 text-center" interactive={false}>
            <p className="text-ink-2">{t(locale, "archive.empty")}</p>
          </Card>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {projects.map((p) => {
              const img = safeHref(p.image);
              const tech = techOf(p.tech).slice(0, 4);
              return (
                <li key={p.id} className="reveal">
                  <Card href={`/projects/${p.id}`} className="group flex gap-5 p-4 md:p-5">
                    <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-2 border border-line-1 bg-surface-2 md:w-32">
                      {img ? (
                        <Image
                          src={img}
                          alt={`${p.title} — ${t(locale, "work.cover")}`}
                          fill
                          sizes="10rem"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span
                          className="display grid h-full place-items-center bg-[radial-gradient(120%_110%_at_15%_0%,var(--c-accent-soft),transparent_60%)] text-3xl text-ink-2"
                          aria-hidden
                        >
                          {p.title.trim().charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="label mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {p.year ? <span className="u-num">{p.year}</span> : null}
                        {p.role ? <span className="truncate">{tx(locale, p.role)}</span> : null}
                        {p.status ? (
                          <span className="chip ml-auto !py-0.5 text-micro">
                            <span className="dot" aria-hidden />
                            {tx(locale, p.status)}
                          </span>
                        ) : null}
                      </p>
                      <h2 className="display text-title font-semibold">
                        <span className="transition-colors group-hover:text-accent-text">{p.title}</span>
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-small text-ink-2">{tx(locale, p.description)}</p>
                      {p.impact ? (
                        <p className="mt-3 flex items-start gap-1.5 text-small text-accent-text">
                          <Icon name="target" size={13} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{tx(locale, p.impact)}</span>
                        </p>
                      ) : null}
                      {tech.length > 0 ? (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {tech.map((item) => (
                            <li key={item}>
                              <span className="chip">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        {projects.length < 3 ? (
          <Card className="mt-4 flex flex-wrap items-center justify-between gap-4 p-6 !rounded-3" interactive={false}>
            <p className="flex items-start gap-3 text-body text-ink-2">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-accent-text" />
              <span>{t(locale, "archive.short")}</span>
            </p>
            <Link href="/#contact" className="btn btn--sm">
              {t(locale, "archive.idea")}
              <Icon name="arrow-right" size={14} />
            </Link>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
