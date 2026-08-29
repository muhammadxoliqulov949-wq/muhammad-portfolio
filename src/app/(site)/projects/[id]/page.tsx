import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import {
  featuresOf,
  galleryOf,
  getProjectById,
  getPublishedProjectIds,
  getSiteData,
  safeHref,
  techOf,
} from "@/lib/content";
import { getLocale, t, tx, txEach } from "@/lib/i18n";

/**
 * Case study sahifasi (audit P1-10: loyihalar faqat bir qatorli tavsif edi).
 * SSG + ISR: ochiq loyihalar build'da generatsiya qilinadi, yangilari
 * `dynamicParams` orqali talab bo'yicha.
 */
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const rows = await getPublishedProjectIds();
  return rows.map((r) => ({ id: String(r.id) }));
}

type Props = { params: Promise<{ id: string }> };

async function load(props: Props) {
  const { id } = await props.params;
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) notFound();
  const project = await getProjectById(num);
  if (!project || !project.published) notFound();
  return project;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await getSiteData();
  let title = t(await getLocale(), "archive.title");
  let description = "";
  try {
    const p = await load({ params });
    title = p.title;
    description = p.impact || p.description;
  } catch {
    return { title };
  }
  return {
    title,
    description,
    alternates: { canonical: `/projects/${(await params).id}` },
    openGraph: {
      title: `${title} — ${profile.fullName || "Portfolio"}`,
      description,
      type: "article",
      url: `/projects/${(await params).id}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const [project, locale] = await Promise.all([load({ params }), getLocale()]);
  const { projects, profile } = await getSiteData();
  const list = projects;
  const index = list.findIndex((p) => p.id === project.id);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;
  const cover = safeHref(project.image);
  const gallery = galleryOf(project.gallery);
  const tech = techOf(project.tech);
  const demo = safeHref(project.link);
  const code = safeHref(project.github);

  const features = txEach(locale, featuresOf(project.features));
  const blocks = [
    { title: t(locale, "case.problem"), body: tx(locale, project.problem), icon: "alert" as const },
    { title: t(locale, "case.solution"), body: tx(locale, project.approach), icon: "layers" as const },
    { title: t(locale, "case.outcome"), body: tx(locale, project.outcome), icon: "target" as const },
  ].filter((b) => b.body?.trim());

  return (
    <article className="pt-[calc(var(--header-h)+2.5rem)] pb-[var(--section-y)]">
      <div className="u-container max-w-[62rem]">
        <nav aria-label={t(locale, "case.crumbs")} className="label mb-8 flex items-center gap-2">
          <Link href="/" className="u-link-quiet">
            Portfolio
          </Link>
          <span className="text-ink-3">/</span>
          <Link href="/projects" className="u-link-quiet">
            {t(locale, "case.works")}
          </Link>
          <span className="text-ink-3">/</span>
          <span className="truncate text-ink-2">{project.title}</span>
        </nav>

        <header className="reveal">
          <p className="label mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {project.year ? <span className="u-num">{project.year}</span> : null}
            {project.role ? <span>{tx(locale, project.role)}</span> : null}
            {project.status ? (
              <span className="chip chip--accent !py-0.5 text-micro">
                <span className="dot" aria-hidden />
                {tx(locale, project.status)}
              </span>
            ) : null}
          </p>
          <h1 className="display text-display-l">{project.title}</h1>
          <p className="mt-5 max-w-prose text-lead text-ink-2">{tx(locale, project.description)}</p>

          {project.impact ? (
            <p className="mt-7 flex items-start gap-3 rounded-3 border border-line-1 bg-accent-soft/60 p-4">
              <Icon name="target" size={18} className="mt-0.5 shrink-0 text-accent-text" />
              <span className="text-body font-semibold">{tx(locale, project.impact)}</span>
            </p>
          ) : null}

          {(demo || code) && (
            <div className="mt-7 flex flex-wrap gap-2.5">
              {demo ? (
                <a href={demo} target="_blank" rel="noopener noreferrer" className="btn btn--accent">
                  {t(locale, "case.demo")}
                  <Icon name="arrow-up-right" size={15} />
                </a>
              ) : null}
              {code ? (
                <a href={code} target="_blank" rel="noopener noreferrer" className="btn">
                  <Icon name="github" size={15} />
                  {t(locale, "case.code")}
                </a>
              ) : null}
            </div>
          )}
        </header>

        <div className="relative mt-10 aspect-16/9 overflow-hidden rounded-4 border border-line-1 bg-surface-1">
          {cover ? (
            <Image
              src={cover}
              alt={`${project.title} — ${t(locale, "case.cover")}`}
              fill
              priority
              sizes="(min-width: 64rem) 62rem, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center bg-[radial-gradient(120%_100%_at_10%_0%,var(--c-accent-soft),transparent_60%)]"
              aria-hidden
            >
              <span className="display text-[clamp(4rem,12vw,8rem)] leading-none text-ink-2/60">
                {project.title.trim().charAt(0)}
              </span>
            </div>
          )}
        </div>

        {blocks.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blocks.map((b, i) => (
              <section key={b.title}>
                <h2 className="label mb-3 flex items-center gap-2">
                  <span className="u-num text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <span className="label-accent">{b.title}</span>
                </h2>
                <p className="text-body text-ink-2">{b.body}</p>
              </section>
            ))}
          </div>
        ) : null}

        {gallery.length > 0 ? (
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {gallery.map((src, i) => (
              <div key={src} className="relative aspect-16/10 overflow-hidden rounded-3 border border-line-1">
                <Image
                  src={src}
                  alt={`${project.title} — ${t(locale, "case.screen")} ${i + 1}`}
                  fill
                  sizes="(min-width: 40rem) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
        ) : null}

        {features.length > 0 ? (
          <section className="mt-12">
            <h2 className="label mb-4 flex items-center gap-2.5 border-b border-line-1 pb-3">
              <span className="label-accent">{t(locale, "case.features")}</span>
              <span className="u-num ml-auto text-ink-3">{features.length}</span>
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 rounded-2 border border-line-1 bg-surface-1 px-3.5 py-2.5 text-body">
                  <Icon name="check" size={14} className="mt-1.5 shrink-0 text-accent-text" />
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tech.length > 0 ? (
          <section className="mt-12 border-t border-line-1 pt-6">
            <h2 className="label mb-3.5">{t(locale, "case.tech")}</h2>
            <ul className="flex flex-wrap gap-1.5">
              {tech.map((item) => (
                <li key={item}>
                  <span className="chip">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <Card className="mt-12 flex flex-wrap items-center justify-between gap-4 p-6" interactive={false}>
          <div>
            <h2 className="display text-title font-semibold">{t(locale, "case.similar")}</h2>
            <p className="mt-1 text-small text-ink-2">
              {tx(locale, profile.responseTime) ||
                `${t(locale, "contact.formTitle")} — ${profile.telegram ? "Telegram (" + profile.telegram + ")" : "email"}.`}
            </p>
          </div>
          <Link href="/#contact" className="btn btn--accent">
            {t(locale, "case.discuss")}
            <Icon name="arrow-right" size={15} />
          </Link>
        </Card>

        <nav aria-label={t(locale, "case.other")} className="mt-12 grid gap-3 border-t border-line-1 pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/projects/${prev.id}`} className="card card--hover group flex items-center gap-3 p-4">
              <Icon name="arrow-right" size={16} className="rotate-180 text-ink-3" />
              <span className="min-w-0">
                <span className="label block">{t(locale, "case.prev")}</span>
                <span className="block truncate text-body font-medium group-hover:text-accent-text">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projects/${next.id}`} className="card card--hover group flex items-center justify-end gap-3 p-4 text-right">
              <span className="min-w-0">
                <span className="label block">{t(locale, "case.next")}</span>
                <span className="block truncate text-body font-medium group-hover:text-accent-text">{next.title}</span>
              </span>
              <Icon name="arrow-right" size={16} className="text-ink-3" />
            </Link>
          ) : null}
        </nav>
      </div>
    </article>
  );
}
