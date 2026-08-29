import SectionHead, { Section } from "./ui/Section";
import Icon, { type IconName } from "./ui/Icon";
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
 * Ko'nikmalar — 6 ta teng karta o'rniga ixcham taxta: guruh + nom + kontekst.
 */
export default function Skills({ skills, locale = "uz" }: { skills: Skill[]; locale?: Locale }) {
  if (skills.length === 0) return null;
  const groups = skillsByCategory(skills);
  const names = skills.map((s) => s.name).filter(Boolean);

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

      {names.length > 0 ? (
        <p className="skills-strip label mb-8">
          <span className="skills-strip__label">{t(locale, "strip.label")}</span>
          <span className="skills-strip__list">{names.join("  ·  ")}</span>
        </p>
      ) : null}

      <div className="skills-board">
        {groups.map((g) => (
          <section key={g.category} className="skills-board__group reveal">
            <h3 className="label mb-3 flex items-center gap-2">
              <Icon name={GROUP_ICON[g.category] ?? "target"} size={13} className="text-accent-text" />
              {tx(locale, g.category)}
              <span className="u-num ml-auto text-ink-3">{g.items.length}</span>
            </h3>
            <ul className="hairline-x stack">
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
          </section>
        ))}
      </div>

      <p className="mt-6 flex flex-wrap items-center gap-2 text-small text-ink-3">
        <Icon name="info" size={14} />
        {t(locale, "skills.note")}
      </p>
    </Section>
  );
}
