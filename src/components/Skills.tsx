import SectionHead, { Section } from "./ui/Section";
import Icon, { type IconName } from "./ui/Icon";
import Card from "./ui/Card";
import Marquee from "./Marquee";
import { skillsByCategory, type Skill } from "@/lib/content";
import { t, tx, type Locale } from "@/lib/i18n-core";

const GROUP_ICON: Record<string, IconName> = {
  "AI & Development": "bot",
  Web: "code",
  Design: "pen",
  Tools: "gauge",
  "AI tools": "sparkle",
  Practice: "target",
};

/**
 * Ko'nikmalar — "React 95%" kabi foizli progress-barlar o'rniga (bunday
 * raqamlar hech narsani isbotlamaydi). To'rt guruh, har birida asbob va
 * uni nimaga ishlataman degan izoh.
 */
export default function Skills({ skills, locale = "uz" }: { skills: Skill[]; locale?: Locale }) {
  if (skills.length === 0) return null;
  const groups = skillsByCategory(skills);

  return (
    <>
      <Marquee names={skills.map((s) => s.name)} />

      <Section id="skills">
        <SectionHead
          index="02"
          eyebrow={t(locale, "skills.eyebrow")}
          title={
            <>
              {t(locale, "skills.titleBefore")} <span className="display-em">{t(locale, "skills.titleEm")}</span>
            </>
          }
          lead={t(locale, "skills.lead")}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <div key={g.category} className="reveal">
              <Card className="flex h-full flex-col p-6">
                <h3 className="label mb-5 flex items-center gap-2.5 border-b border-line-1 pb-4">
                  <span className="grid size-7 place-items-center rounded-2 border border-line-1 bg-surface-2 text-accent-text">
                    <Icon name={GROUP_ICON[g.category] ?? "target"} size={14} />
                  </span>
                  {tx(locale, g.category)}
                  <span className="u-num ml-auto text-ink-3">{g.items.length}</span>
                </h3>
                <ul className="hairline-x stack -mt-1">
                  {g.items.map((s) => (
                    <li key={s.id} className="flex items-baseline justify-between gap-4 py-2.5">
                      <span className="min-w-0">
                        <span className="block text-body font-medium">{s.name}</span>
                        {s.context ? (
                          <span className="mt-0.5 block text-small text-ink-3">{tx(locale, s.context)}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        <p className="mt-6 flex flex-wrap items-center gap-2 text-small text-ink-3">
          <Icon name="info" size={14} />
          {t(locale, "skills.note")}
        </p>
      </Section>
    </>
  );
}
