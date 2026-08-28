import SectionHead, { Section } from "./ui/Section";
import Icon from "./ui/Icon";
import Marquee from "./Marquee";
import { skillsByCategory, type Skill } from "@/lib/content";

type Props = { skills: Skill[] };

/**
 * Toolbox — "Ko'nikmalar: React 95%" progress-barlar o'rniga (audit P1-11:
 * foizlar sub'ektiv va ish beruvchi ishonmaydigan ko'rsatkich).
 * Buning o'rniga: necha yil ishlagan + qayerda qo'llagan (evidence).
 */
export default function Toolbox({ skills }: Props) {
  if (skills.length === 0) return null;
  const groups = skillsByCategory(skills);
  const totalYears = Math.max(...skills.map((s) => s.years || 0), 0);

  return (
    <>
      <Marquee names={skills.map((s) => s.name)} />

      <Section id="toolbox">
        <SectionHead
          index="04"
          eyebrow="Toolbox"
          title={
            <>
              Asboblar va texnologiyalar,{" "}
              <span className="display-em">qoʻllangan joyida</span>
            </>
          }
          lead={
            <>
              Roʻyxat uzoq — lekin har bir qator ostida necha yil va qaysi loyihada
              ishlatganim turadi. {totalYears > 0 ? `Eng uzoq ishlagan texnologiyam — ${totalYears} yil.` : ""}
            </>
          }
        />

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.category}>
              <h3 className="label mb-4 flex items-center gap-2.5 border-b border-line-1 pb-3">
                <Icon name="target" size={13} className="text-accent-text" />
                {g.category}
                <span className="u-num ml-auto text-ink-3">{g.items.length}</span>
              </h3>
              <ul className="hairline-x stack">
                {g.items.map((s) => (
                  <li key={s.id} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span className="min-w-0">
                      <span className="block text-body font-medium">{s.name}</span>
                      {s.context ? <span className="block text-small text-ink-3">{s.context}</span> : null}
                    </span>
                    {s.years > 0 ? (
                      <span className="u-num shrink-0 font-mono text-micro uppercase tracking-wider text-ink-2">
                        {s.years} yil
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
