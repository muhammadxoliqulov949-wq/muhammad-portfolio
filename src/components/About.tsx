import Icon from "@/components/ui/Icon";
import {
  achievementsByKind,
  goalsOf,
  highlightsOf,
  interestsOf,
  listFrom,
  principlesOf,
  safeHref,
  strengthsOf,
  type Achievement,
  type EducationItem,
  type ExperienceItem,
  type Profile,
} from "@/lib/content";
import { t, tx, txEach, type Locale } from "@/lib/i18n-core";

/**
 * About — bitta tahririy hikoya (Phase 3F, resume-dump emas).
 *
 * Katta ochilish bayonoti → hikoya + kuchli tomonlar/qiziqishlar →
 * tanlangan faktlar ustuni (tajriba/ta'lim/yutuqlar, karta emas —
 * hukmdorli qatorlar) → kelgusi yo'nalish.
 *
 * Portret yo'q (CMS'da `photoUrl` bo'sh, `public/media/portrait.*` yo'q) —
 * shuning uchun soxta portret yasalmaydi; identitet matn orqali beriladi.
 * Server component — harakat yo'q.
 */
export default function About({
  profile: p,
  education,
  achievements,
  experience,
  locale = "uz",
}: {
  profile: Profile;
  education: EducationItem[];
  achievements: Achievement[];
  experience: ExperienceItem[];
  locale?: Locale;
}) {
  const paragraphs = (p.story || p.bio || "")
    .split(/\n{2,}/)
    .map((x) => tx(locale, x.trim()))
    .filter(Boolean);
  const strengths = txEach(locale, strengthsOf(p));
  const interests = txEach(locale, interestsOf(p));
  const principles = txEach(locale, principlesOf(p));
  const workflow = txEach(locale, listFrom(p.workflow));
  const goals = txEach(locale, goalsOf(p));
  const achGroups = achievementsByKind(achievements).map((g) => ({
    ...g,
    label: t(locale, `achievements.${g.kind}`),
  }));

  const hasAny =
    paragraphs.length > 0 ||
    strengths.length > 0 ||
    interests.length > 0 ||
    principles.length > 0 ||
    workflow.length > 0 ||
    experience.length > 0 ||
    education.length > 0 ||
    achievements.length > 0 ||
    goals.length > 0;
  if (!hasAny) return null;

  return (
    <section id="about" className="u-section u-cv" data-narrative="light">
      <div className="u-container">
        {/* Ochilish bayonoti — SectionHead o'rniga katta display sarlavha */}
        <div className="about-open">
          <p className="label mb-6 flex items-center gap-3">
            <span className="u-num text-ink-3">05</span>
            <span className="h-px w-8 bg-line-2" aria-hidden />
            <span className="label-accent">{t(locale, "about.eyebrow")}</span>
          </p>
          <h2 className="display about-statement">
            {t(locale, "about.titleBefore")} <span className="display-em">{t(locale, "about.titleEm")}</span>{" "}
            {t(locale, "about.titleAfter")}
          </h2>
        </div>

        <div className="about-grid">
          {/* Hikoya ustuni */}
          <div className="about-narrative reveal">
            {paragraphs.map((par, i) => (
              <p key={i} className={i === 0 ? "about-lede" : "text-body text-ink-2"}>
                {par}
              </p>
            ))}

            {strengths.length > 0 ? (
              <div className="about-sub">
                <h3 className="label label-accent">{t(locale, "about.strengths")}</h3>
                <ul className="about-strengths">
                  {strengths.map((s) => (
                    <li key={s} className="about-strengths__item">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {interests.length > 0 ? (
              <div className="about-sub">
                <h3 className="label">{t(locale, "about.interests")}</h3>
                <p className="about-interests">{interests.join(" · ")}</p>
                <p className="mt-2 text-small text-ink-3">{t(locale, "about.interestsNote")}</p>
              </div>
            ) : null}
          </div>

          {/* Tanlangan faktlar ustuni */}
          <aside className="about-facts reveal">
            <h3 className="label label-accent">{t(locale, "about.facts")}</h3>
            {principles.length > 0 ? (
              <ul className="about-principles">
                {principles.map((line) => (
                  <li key={line} className="about-principles__item">
                    <span className="about-principles__mark" aria-hidden="true" />
                    <span className="text-lead">{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {experience.length > 0 ? (
              <div className="about-sub">
                <h3 className="label label-accent">{t(locale, "experience.eyebrow")}</h3>
                <ol className="about-facts__list">
                  {experience.map((item) => {
                    const highlights = txEach(locale, highlightsOf(item.highlights));
                    return (
                      <li key={item.id} className="about-facts__row">
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="font-semibold text-ink-1">{tx(locale, item.role)}</span>
                            <span className="text-body text-ink-2">{tx(locale, item.company)}</span>
                          </p>
                          {item.description ? (
                            <p className="mt-1 text-small text-ink-2">{tx(locale, item.description)}</p>
                          ) : null}
                          {highlights.length > 0 ? (
                            <p className="mt-1.5 text-small text-ink-3">{highlights.join(" · ")}</p>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : null}

            {education.length > 0 ? (
              <div className="about-sub">
                <h3 className="label label-accent">{t(locale, "education.eyebrow")}</h3>
                <ol className="about-facts__list">
                  {education.map((e) => (
                    <li key={e.id} className="about-facts__row">
                      <p className="font-semibold text-ink-1">{e.institution}</p>
                      <p className="mt-1 text-small text-ink-2">
                        {[e.credential, e.field].filter(Boolean).map((x) => tx(locale, x)).join(" · ")}
                      </p>
                      {e.status ? (
                        <p className="mt-1 flex items-center gap-2 text-small text-ink-3">
                          {e.current ? <span className="dot" aria-hidden /> : <Icon name="check" size={12} className="text-ink-3" />}
                          {tx(locale, e.status)}
                          {e.period ? <span className="u-num font-mono text-micro">· {e.period}</span> : null}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {achGroups.length > 0 ? (
              <div className="about-sub">
                <h3 className="label label-accent">{t(locale, "achievements.eyebrow")}</h3>
                <ol className="about-facts__list">
                  {achGroups.flatMap((g) =>
                    g.items.map((a) => {
                      const url = safeHref(a.url);
                      return (
                        <li key={a.id} className="about-facts__row">
                          <p className="text-body font-medium text-ink-1">{tx(locale, a.title)}</p>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-ink-3">
                            {a.issuer ? <span>{tx(locale, a.issuer)}</span> : null}
                            {a.year ? <span className="u-num font-mono text-micro">{a.year}</span> : null}
                            {url ? (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="u-link-quiet">
                                {t(locale, "achievements.verify")}
                                <Icon name="arrow-up-right" size={12} />
                              </a>
                            ) : null}
                          </p>
                        </li>
                      );
                    }),
                  )}
                </ol>
              </div>
            ) : null}
          </aside>
        </div>

        {/* Kelgusi yo'nalish */}
        <div className="about-direction reveal">
          {workflow.length > 0 ? (
            <div className="about-sub">
              <h3 className="label label-accent">{t(locale, "approach.flow")}</h3>
              <ol className="about-workflow">
                {workflow.map((step, i) => (
                  <li key={step} className="about-workflow__item">
                    <span className="about-workflow__num u-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {goals.length > 0 ? (
            <div className="about-sub">
              <h3 className="label label-accent">{t(locale, "approach.goals")}</h3>
              <p className="mb-4 text-small text-ink-3">{t(locale, "approach.goalsNote")}</p>
              <ul className="about-goals">
                {goals.map((g) => (
                  <li key={g} className="about-goals__item">
                    <Icon name="arrow-up-right" size={14} className="mt-0.5 shrink-0 text-accent-text" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="about-honesty">
            <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-accent-text" />
            <span>{t(locale, "about.honesty")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
