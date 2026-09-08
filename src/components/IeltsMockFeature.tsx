import Image from "next/image";
import Link from "next/link";
import SectionHead from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { featuresOf, galleryOf, safeHref, techOf, type Project } from "@/lib/content";
import { t, tx, txEach, type Locale } from "@/lib/i18n-core";

/**
 * IeltsMockFeature — IELTS.mock case-study (Phase 3E, low-motion editorial).
 *
 * Phase 3D reveal'ning full-bleed yakuni shu bo'limga "oqib kiradi":
 * mahsulot identiteti → muammo → qanday ishlaydi → imkoniyatlar →
 * haqiqiy interfeys galereyasi → texnologiya → rol/holat.
 *
 * Faqat CMS'dagi haqiqiy ma'lumot (ixtiro qilingan metrika/raqam yo'q).
 * Server component — harakat/GSAP yo'q; faqat mavjud `.reveal` (CSS
 * scroll-driven) kirish. Content layoudan, layout motion'dan ajralgan.
 */
export default function IeltsMockFeature({
  project,
  locale = "uz",
}: {
  project: Project | null;
  locale?: Locale;
}) {
  if (!project) {
    return (
      <section id="work" className="u-section u-cv" data-narrative="light">
        <div className="u-container">
          <SectionHead
            index="03"
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

  const demo = safeHref(project.link);
  const code = safeHref(project.github);
  const tech = techOf(project.tech);
  const features = txEach(locale, featuresOf(project.features));
  const gallery = galleryOf(project.gallery);
  const homeImg = typeof project.image === "string" && project.image.trim() ? project.image : null;
  const status = project.status ? tx(locale, project.status) : null;

  return (
    <section id="work" className="u-section u-cv" data-narrative="light">
      <div className="u-container">
        <SectionHead
          index="03"
          eyebrow={t(locale, "work.eyebrow")}
          title={
            <>
              {t(locale, "work.titleBefore")} <span className="display-em">{t(locale, "work.titleEm")}</span>
            </>
          }
          lead={t(locale, "work.lead")}
          action={
            demo ? (
              <a href={demo} target="_blank" rel="noopener noreferrer" className="btn btn--sm">
                {t(locale, "work.demo")}
                <Icon name="external" size={14} />
              </a>
            ) : undefined
          }
        />

        {/* 1 · Mahsulot identiteti / overview */}
        <div className="case-hero">
          <div className="case-hero__id">
            <p className="label mb-5 flex items-center gap-2.5">
              <span className="dot" aria-hidden />
              <span className="label-accent">{t(locale, "work.featured")}</span>
            </p>
            <h3 className="display text-display-l">{project.title}</h3>
            <p className="mt-5 max-w-xl text-lead text-ink-2">{tx(locale, project.description)}</p>

            {(demo || code) && (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {demo ? (
                  <a href={demo} target="_blank" rel="noopener noreferrer" className="btn btn--accent">
                    {t(locale, "case.demo")}
                    <Icon name="external" size={14} />
                  </a>
                ) : null}
                {code ? (
                  <a href={code} target="_blank" rel="noopener noreferrer" className="btn">
                    <Icon name="github" size={14} />
                    {t(locale, "case.code")}
                  </a>
                ) : null}
              </div>
            )}

            {status ? (
              <p className="mt-7 flex items-center gap-2 text-small text-ink-2">
                <span className="dot" aria-hidden />
                {status}
              </p>
            ) : null}
          </div>

          {project.impact ? (
            <aside className="case-hero__impact" aria-label={t(locale, "case.solution")}>
              <span className="label label-accent">{t(locale, "case.solution")}</span>
              <p className="mt-4 text-lead">{tx(locale, project.impact)}</p>
            </aside>
          ) : null}
        </div>

        {/* 2 · Muammo / maqsad */}
        {project.problem ? (
          <div className="case-block">
            <h4 className="label label-accent">{t(locale, "case.problem")}</h4>
            <p className="case-block__lead mt-5 max-w-3xl text-lead text-ink-2">{tx(locale, project.problem)}</p>
          </div>
        ) : null}

        {/* 3 · Qanday ishlaydi + 4 · Imkoniyatlar */}
        <div className="case-block">
          <h4 className="label label-accent">{t(locale, "study.how")}</h4>
          {project.approach ? (
            <p className="case-block__lead mt-5 max-w-3xl text-lead text-ink-2">{tx(locale, project.approach)}</p>
          ) : null}

          {features.length > 0 ? (
            <>
              <p className="label mt-12 mb-5">{t(locale, "case.features")}</p>
              <ul className="case-capabilities">
                {features.map((f, i) => (
                  <li key={f} className="case-capabilities__item">
                    <span className="case-capabilities__idx u-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="case-capabilities__name">{f}</span>
                    <Icon name="check" size={15} className="case-capabilities__check text-accent-text" />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        {/* 5 · Haqiqiy interfeys galereyasi */}
        {(homeImg || gallery.length > 0) && (
          <div className="case-block">
            <h4 className="label label-accent">{t(locale, "study.gallery")}</h4>
            <div className="case-gallery mt-7">
              {homeImg ? (
                <figure className="case-gallery__hero">
                  <Image
                    src={homeImg}
                    alt={`${project.title} — ${t(locale, "work.cover")}`}
                    fill
                    sizes="(min-width: 1024px) 80rem, 100vw"
                    className="object-cover object-top"
                  />
                </figure>
              ) : null}

              {gallery.length > 0 ? (
                <div className="case-gallery__grid">
                  {gallery.map((src, i) => (
                    <figure key={src} className="case-gallery__item">
                      <Image
                        src={src}
                        alt={`${project.title} — ${t(locale, "case.screen")} ${i + 1}`}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                      />
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* 6 · Texnologiya */}
        {tech.length > 0 ? (
          <div className="case-block">
            <h4 className="label label-accent">{t(locale, "case.tech")}</h4>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {tech.map((item) => (
                <li key={item}>
                  <span className="chip">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* 7 · Rol + Natija/holat */}
        {(project.role || project.outcome || status) && (
          <div className="case-finish">
            {project.role ? (
              <div>
                <h4 className="label label-accent">{t(locale, "study.role")}</h4>
                <p className="mt-4 text-body text-ink-2">{tx(locale, project.role)}</p>
              </div>
            ) : null}

            {(project.outcome || status) ? (
              <div>
                <h4 className="label label-accent">{t(locale, "case.outcome")}</h4>
                {project.outcome ? <p className="mt-4 text-body text-ink-2">{tx(locale, project.outcome)}</p> : null}
                {status ? (
                  <p className="mt-4 flex items-center gap-2 text-small text-ink-2">
                    <span className="dot" aria-hidden />
                    <span className="label">{t(locale, "study.status")}</span>
                    {status}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}

        <Card className="mt-10 flex flex-wrap items-center justify-between gap-4 p-6" interactive={false}>
          <p className="flex items-start gap-3 text-body text-ink-2">
            <Icon name="info" size={16} className="mt-0.5 shrink-0 text-accent-text" />
            <span>{t(locale, "work.more")}</span>
          </p>
          <Link href="/#contact" className="btn btn--sm">
            {t(locale, "work.discuss")}
            <Icon name="arrow-right" size={14} />
          </Link>
        </Card>
      </div>
    </section>
  );
}
