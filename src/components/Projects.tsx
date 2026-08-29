import Image from "next/image";
import Link from "next/link";
import SectionHead from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import Device from "./ui/Device";
import { featuresOf, safeHref, techOf, type Project } from "@/lib/content";
import { t, tx, txEach, type Locale } from "@/lib/i18n-core";

/** Loyiha rasmi brauzer-ramkada; rasm bo'lmasa — host, harf emas. */
function Cover({ project, locale, priority = false }: { project: Project; locale: Locale; priority?: boolean }) {
  const img = safeHref(project.image);
  const host = hostOf(project.link);
  return (
    <Device label={host || project.title} className="absolute inset-0">
      {img ? (
        <Image
          src={img}
          alt={`${project.title} — ${t(locale, "work.cover")}`}
          fill
          priority={priority}
          sizes="(min-width: 64rem) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.015]"
        />
      ) : (
        <div className="grid h-full min-h-[220px] w-full place-content-center gap-2 bg-[radial-gradient(130%_110%_at_15%_0%,var(--c-accent-soft),transparent_55%),linear-gradient(160deg,var(--c-surface-2),var(--c-surface-1))] px-6">
          <span className="font-mono text-small text-ink-2">{host || project.title}</span>
        </div>
      )}
    </Device>
  );
}

function hostOf(link: string | null | undefined): string | null {
  const href = safeHref(link);
  if (!href) return null;
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function TechChips({ tech, limit = 6 }: { tech: string | null; limit?: number }) {
  const items = techOf(tech).slice(0, limit);
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <span className="chip">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Loyihalar — bitta ham bo'lsa, halol ko'rsatiladi.
 *
 * Auditdan keyingi pozitsiya: "20 ta loyiha" ro'yxatini yig'ish o'rniga bitta
 * haqiqiy mahsulot to'liq ochib beriladi (holati, texnologiyasi, demo va kodi
 * bilan). Boshqa loyihalar haqida va'da yozilmagan — ular tayyor bo'lganda
 * DB'dan chiqadi.
 */
export default function Projects({
  projects,
  index = "04",
  locale = "uz",
}: {
  projects: Project[];
  index?: string;
  locale?: Locale;
}) {
  if (projects.length === 0) {
    return (
      <section id="work" className="u-section u-cv">
        <div className="u-container">
          <SectionHead
            index={index}
            eyebrow={t(locale, "work.eyebrow")}
            title={
              <>
                {t(locale, "work.emptyTitleBefore")} <span className="display-em">{t(locale, "work.emptyTitleEm")}</span>{" "}
                {t(locale, "work.emptyTitleAfter")}
              </>
            }
            lead={t(locale, "work.emptyLead")}
          />
        </div>
      </section>
    );
  }

  const [featured, ...rest] = projects;
  const demoHref = safeHref(featured.link);
  const codeHref = safeHref(featured.github);

  return (
    <section id="work" className="u-section u-cv">
      <div className="u-container">
        <SectionHead
          index={index}
          eyebrow={t(locale, "work.eyebrow")}
          title={
            <>
              {t(locale, "work.titleBefore")} <span className="display-em">{t(locale, "work.titleEm")}</span>
            </>
          }
          lead={t(locale, "work.lead")}
          action={
            <Link href="/projects" className="btn btn--sm">
              {t(locale, "work.all")}
              <Icon name="arrow-up-right" size={14} />
            </Link>
          }
        />

        <div className="bento">
          <div data-span="full" className="reveal">
            <Card
              href={`/projects/${featured.id}`}
              hitLabel={t(locale, "more")}
              className="group grid overflow-hidden !rounded-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            >
              <div className="relative min-h-[260px] overflow-hidden border-b border-line-1 bg-surface-2 lg:border-b-0 lg:border-r">
                <Cover project={featured} locale={locale} priority />
                <span className="chip chip--accent absolute left-4 top-4 backdrop-blur-sm">
                  <Icon name="star" size={11} />
                  {t(locale, "work.featured")}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
                <div>
                  <div className="label mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {featured.year ? <span className="u-num">{featured.year}</span> : null}
                    {featured.role ? <span>{tx(locale, featured.role)}</span> : null}
                    {featured.status ? (
                      <span className="chip ml-auto !py-0.5 text-micro">
                        <span className="dot" aria-hidden />
                        {tx(locale, featured.status)}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="display text-display-m">
                    <span className="transition-colors group-hover:text-accent-text">{featured.title}</span>
                  </h3>
                  <p className="mt-3 max-w-prose text-body text-ink-2">{tx(locale, featured.description)}</p>
                </div>

                {featured.impact ? (
                  <p className="flex items-start gap-2.5 border-t border-line-1 pt-4 text-body">
                    <Icon name="target" size={16} className="mt-0.5 shrink-0 text-accent-text" />
                    <span className="font-semibold">{tx(locale, featured.impact)}</span>
                  </p>
                ) : null}

                {featuresOf(featured.features).length > 0 ? (
                  <ul className="grid gap-x-5 gap-y-1.5 border-t border-line-1 pt-4 sm:grid-cols-2">
                    {txEach(locale, featuresOf(featured.features).slice(0, 6)).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-small text-ink-2">
                        <Icon name="check" size={13} className="mt-0.5 shrink-0 text-accent-text" />
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <TechChips tech={featured.tech} />
                  <span className="flex flex-wrap items-center gap-2">
                    {demoHref ? (
                      <a
                        href={demoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--accent btn--sm"
                      >
                        {t(locale, "work.demo")}
                        <Icon name="external" size={13} />
                      </a>
                    ) : null}
                    {codeHref ? (
                      <a href={codeHref} target="_blank" rel="noopener noreferrer" className="btn btn--sm">
                        <Icon name="github" size={13} />
                        GitHub
                      </a>
                    ) : null}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {rest.map((p) => (
            <div key={p.id} data-span="third" className="reveal">
              <Card href={`/projects/${p.id}`} hitLabel={t(locale, "more")} className="group flex h-full flex-col overflow-hidden !rounded-4">
                <div className="relative aspect-16/10 overflow-hidden border-b border-line-1 bg-surface-2">
                  <Cover project={p} locale={locale} />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <div className="label mb-2.5 flex items-center gap-3">
                      {p.year ? <span className="u-num">{p.year}</span> : null}
                      {p.role ? <span className="truncate">{tx(locale, p.role)}</span> : null}
                    </div>
                    <h3 className="display text-title font-semibold">
                      <span className="transition-colors group-hover:text-accent-text">{p.title}</span>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-small text-ink-2">{tx(locale, p.description)}</p>
                  </div>
                  <TechChips tech={p.tech} limit={4} />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {rest.length === 0 ? (
          <Card className="mt-4 flex flex-wrap items-center justify-between gap-4 p-6 !rounded-3" interactive={false}>
            <p className="flex items-start gap-3 text-body text-ink-2">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-accent-text" />
              <span>{t(locale, "work.more")}</span>
            </p>
            <a href="/#contact" className="btn btn--sm">
              {t(locale, "work.discuss")}
              <Icon name="arrow-right" size={14} />
            </a>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
