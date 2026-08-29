import SectionHead, { Section } from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import { goalsOf, highlightsOf, listFrom, type ExperienceItem, type Profile } from "@/lib/content";
import { t, tx, txEach, type Locale } from "@/lib/i18n-core";

/**
 * Soxta testimonial o'rniga: odamlar bilan qilingan ish (faqat berilgan raqamlar)
 * + ish oqimi + kelgusi 1–2 yil (reja, natija emas).
 */
export default function Approach({
  profile: p,
  experience = [],
  locale = "uz",
}: {
  profile: Profile;
  experience?: ExperienceItem[];
  locale?: Locale;
}) {
  const steps = txEach(locale, listFrom(p.workflow));
  const goals = txEach(locale, goalsOf(p));
  const people = experience
    .map((item) => {
      const metric = tx(locale, highlightsOf(item.highlights)[0]);
      if (!metric) return null;
      return { role: tx(locale, item.role), company: tx(locale, item.company), metric };
    })
    .filter((x): x is { role: string; company: string; metric: string } => !!x);

  if (steps.length === 0 && goals.length === 0 && people.length === 0) return null;

  return (
    <Section id="approach">
      <SectionHead
        index="08"
        eyebrow={t(locale, "approach.eyebrow")}
        title={
          <>
            {t(locale, "approach.titleBefore")} <span className="display-em">{t(locale, "approach.titleEm")}</span>
          </>
        }
        lead={t(locale, "approach.lead")}
      />

      {people.length > 0 ? (
        <ul className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((x) => (
            <li key={x.role}>
              <Card className="flex h-full flex-col gap-3 p-5" interactive={false}>
                <p className="display text-display-m leading-none">{x.metric}</p>
                <p>
                  <span className="block text-body font-semibold">{x.role}</span>
                  <span className="block text-small text-ink-3">{x.company}</span>
                </p>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
        {steps.length > 0 ? (
          <div>
            <p className="label label-accent mb-4">{t(locale, "approach.flow")}</p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {steps.map((step, i) => (
                <li key={step}>
                  <Card className="flex h-full items-start gap-4 p-5" interactive={false}>
                    <span className="display u-num shrink-0 text-[26px] leading-none text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body">{step}</span>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {goals.length > 0 ? (
          <Card className="flex flex-col p-6" interactive={false}>
            <p className="label label-accent mb-1">{t(locale, "approach.goals")}</p>
            <p className="mb-5 text-small text-ink-3">{t(locale, "approach.goalsNote")}</p>
            <ul className="hairline-x stack -my-1">
              {goals.map((g) => (
                <li key={g} className="flex items-start gap-2.5 py-2.5 text-body">
                  <Icon name="arrow-up-right" size={14} className="mt-1 shrink-0 text-accent-text" />
                  {g}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </Section>
  );
}
