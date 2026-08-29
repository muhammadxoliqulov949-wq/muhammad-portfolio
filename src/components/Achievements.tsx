import SectionHead, { Section } from "./ui/Section";
import Icon from "./ui/Icon";
import { achievementsByKind, safeHref, type Achievement } from "@/lib/content";
import { t, tx, type Locale } from "@/lib/i18n-core";

/**
 * Yutuqlar — ataylab "ko'rsatsiz" dizayn: sertifikatlar va olimpiada
 * natijalari ro'yxat ko'rinishida, medali-grafika va 3D kartochkalarsiz.
 * (Egasi topshig'i: bu bo'limni overdesign qilish mumkin emas.)
 */
export default function Achievements({ items, locale = "uz" }: { items: Achievement[]; locale?: Locale }) {
  if (items.length === 0) return null;
  const groups = achievementsByKind(items).map((g) => ({
    ...g,
    label: t(locale, `achievements.${g.kind}`),
  }));

  return (
    <Section id="achievements">
      <SectionHead
        index="07"
        eyebrow={t(locale, "achievements.eyebrow")}
        title={
          <>
            {t(locale, "achievements.titleBefore")} {t(locale, "achievements.titleEm")}{" "}
            {t(locale, "achievements.titleAfter")}
          </>
        }
        lead={t(locale, "achievements.lead")}
      />

      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.kind}>
            <h3 className="label mb-4 flex items-center gap-2.5 border-b border-line-1 pb-3">
              <Icon name="target" size={13} className="text-accent-text" />
              {g.label}
              <span className="u-num ml-auto text-ink-3">{g.items.length}</span>
            </h3>
            <ul className="hairline-x stack">
              {g.items.map((a) => {
                const url = safeHref(a.url);
                return (
                  <li key={a.id} className="py-3.5">
                    <p className="text-body font-medium">{tx(locale, a.title)}</p>
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
                    {a.detail ? <p className="mt-1.5 text-small text-ink-2">{tx(locale, a.detail)}</p> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
