import SectionHead, { Section } from "./ui/Section";
import Icon, { type IconName } from "./ui/Icon";
import Card from "./ui/Card";
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

/** Ko'nikmalar — guruhlangan kartalar + badge. Foiz yo'q. */
export default function Skills({ skills, locale = "uz" }: { skills: Skill[]; locale?: Locale }) {
  if (skills.length === 0) return null;
  const groups = skillsByCategory(skills);

  return (
    <Section id="skills">
      <SectionHead
        index="02"
        eyebrow={t(locale, "skills.eyebrow")}
        title={
          <>
            {t(locale, "skills.titleBefore")} {t(locale, "skills.titleEm")}
          </>
        }
        lead={t(locale, "skills.lead")}
      />

      <div className="skills-board">
        {groups.map((g) => (
          <div key={g.category} className="reveal">
            <Card className="flex h-full flex-col p-5" interactive={false}>
              <h3 className="label mb-4 flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-2 border border-line-1 bg-surface-2 text-accent-text">
                  <Icon name={GROUP_ICON[g.category] ?? "target"} size={14} />
                </span>
                {tx(locale, g.category)}
                <span className="u-num ml-auto text-ink-3">{g.items.length}</span>
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <li key={s.id}>
                    <span className="chip" title={s.context ? tx(locale, s.context) : undefined}>
                      {s.name}
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
  );
}
