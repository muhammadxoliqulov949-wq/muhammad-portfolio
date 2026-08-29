import Image from "next/image";
import Link from "next/link";
import SectionHead from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import { featuresOf, safeHref, techOf, type Project } from "@/lib/content";

/** Loyiha rasmi yoki monogram panel (buzuk yoki soxta rasm ko'rsatmaslik uchun). */
function Cover({ project, priority = false }: { project: Project; priority?: boolean }) {
  const img = safeHref(project.image);
  if (img) {
    return (
      <Image
        src={img}
        alt={`${project.title} — loyiha koʻrinishi`}
        fill
        priority={priority}
        sizes="(min-width: 64rem) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
      />
    );
  }
  return (
    <div className="grid h-full w-full place-content-center gap-3 bg-[radial-gradient(130%_110%_at_15%_0%,var(--c-accent-soft),transparent_55%),linear-gradient(160deg,var(--c-surface-2),var(--c-surface-1))] px-6 py-8">
      <span className="display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-ink-1">
        {(project.title || "P").trim().charAt(0)}
      </span>
      <span className="font-mono text-micro uppercase tracking-[0.16em] text-ink-3">
        {project.link ? new URL(project.link).host.replace(/^www\./, "") : project.title}
      </span>
    </div>
  );
}

function TechChips({ tech, limit = 6 }: { tech: string | null; limit?: number }) {
  const items = techOf(tech).slice(0, limit);
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t}>
          <span className="chip">{t}</span>
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
export default function Projects({ projects, index = "04" }: { projects: Project[]; index?: string }) {
  if (projects.length === 0) {
    return (
      <section id="work" className="u-section u-cv">
        <div className="u-container">
          <SectionHead
            index={index}
            eyebrow="Loyihalar"
            title={
              <>
                Hozircha <span className="display-em">ochiq</span> loyiha yoʻq
              </>
            }
            lead="Yangi ishlar tayyor bo'lishi bilan shu bo'limga qo'shiladi."
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
          eyebrow="Loyihalar"
          title={
            <>
              Bitta mahsulot, <span className="display-em">toʻliq ochiq</span>
            </>
          }
          lead="Bu yerda chiroyli maketlar to'plami yo'q — bitta haqiqiy platforma bor: u ishlaydi, rivojlantirilmoqda va uni qanday qurganim ochiq ko'rsatilgan."
          action={
            <Link href="/projects" className="btn btn--sm">
              Barcha loyihalar
              <Icon name="arrow-up-right" size={14} />
            </Link>
          }
        />

        <div className="bento">
          <div data-span="full" className="reveal">
            <Card
              href={`/projects/${featured.id}`}
              className="group grid overflow-hidden !rounded-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            >
              <div className="relative min-h-[260px] overflow-hidden border-b border-line-1 bg-surface-2 lg:border-b-0 lg:border-r">
                <Cover project={featured} priority />
                <span className="chip chip--accent absolute left-4 top-4 backdrop-blur-sm">
                  <Icon name="star" size={11} />
                  Asosiy loyiha
                </span>
              </div>

              <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
                <div>
                  <div className="label mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {featured.year ? <span className="u-num">{featured.year}</span> : null}
                    {featured.role ? <span>{featured.role}</span> : null}
                    {featured.status ? (
                      <span className="chip ml-auto !py-0.5 text-micro">
                        <span className="dot" aria-hidden />
                        {featured.status}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="display text-display-m">
                    {/* Stretched link: butun karta bosiladigan, lekin HTML valid */}
                    <span className="after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-accent-text">
                      {featured.title}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-prose text-body text-ink-2">{featured.description}</p>
                </div>

                {featured.impact ? (
                  <p className="flex items-start gap-2.5 border-t border-line-1 pt-4 text-body">
                    <Icon name="target" size={16} className="mt-0.5 shrink-0 text-accent-text" />
                    <span className="font-semibold">{featured.impact}</span>
                  </p>
                ) : null}

                {featuresOf(featured.features).length > 0 ? (
                  <ul className="grid gap-x-5 gap-y-1.5 border-t border-line-1 pt-4 sm:grid-cols-2">
                    {featuresOf(featured.features)
                      .slice(0, 6)
                      .map((f) => (
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
                        Jonli demo
                        <Icon name="external" size={13} />
                      </a>
                    ) : null}
                    {codeHref ? (
                      <a
                        href={codeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--sm"
                      >
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
              <Card href={`/projects/${p.id}`} className="group flex h-full flex-col overflow-hidden !rounded-4">
                <div className="relative aspect-16/10 overflow-hidden border-b border-line-1 bg-surface-2">
                  <Cover project={p} />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <div className="label mb-2.5 flex items-center gap-3">
                      {p.year ? <span className="u-num">{p.year}</span> : null}
                      {p.role ? <span className="truncate">{p.role}</span> : null}
                    </div>
                    <h3 className="display text-title font-semibold">
                      <span className="after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-accent-text">
                        {p.title}
                      </span>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-small text-ink-2">{p.description}</p>
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
              <span>
                Koʻproq loyiha yoʻq — chunki ular hali ishlab chiqilmoqda. Tayyor boʻlgach shu
                boʻlimga qoʻshiladi; oldindan vaʼda qilinmagan sana yoʻq.
              </span>
            </p>
            <a href="#contact" className="btn btn--sm">
              Sizning gʻoyangizni muhokama qilish
              <Icon name="arrow-right" size={14} />
            </a>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
