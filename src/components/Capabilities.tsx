import SectionHead from "@/components/ui/Section";
import { featuresOf, skillsByCategory, type Service, type Skill } from "@/lib/content";
import { t, tx, txEach, type Locale } from "@/lib/i18n-core";

/**
 * Capabilities — tahririy "qobiliyat indeksi" (Phase 3F).
 *
 * Har bir xizmat katta raqamli, hukmdor bilan ajratilgan qatorda: kuchli
 * sarlavha + aniq izoh + bir qatorga joylashtirilgan tayanch vositalar.
 * Ikona buluti / progress bar / badge yo'q. Pastda vositalar (skills)
 * guruhlab, "reyting emas, ishlatadigan asboblar" sifatida ixcham beriladi.
 *
 * Server component — harakat yo'q (faqat mavjud CSS reveal).
 */
export default function Capabilities({
  services,
  skills,
  locale = "uz",
}: {
  services: Service[];
  skills: Skill[];
  locale?: Locale;
}) {
  if (services.length === 0 && skills.length === 0) return null;

  const groups = skillsByCategory(skills);

  return (
    <section id="capabilities" className="u-section u-cv" data-narrative="light">
      <div className="u-container">
        <SectionHead
          index="04"
          eyebrow={t(locale, "capabilities.eyebrow")}
          title={
            <>
              {t(locale, "capabilities.titleBefore")} <span className="display-em">{t(locale, "capabilities.titleEm")}</span>
            </>
          }
          lead={t(locale, "capabilities.lead")}
        />

        {services.length > 0 ? (
          <ol className="cap-index">
            {services.map((s, i) => {
              const items = txEach(locale, featuresOf(s.features));
              return (
                <li key={s.id} className="cap-index__row reveal">
                  <span className="cap-index__num u-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="cap-index__body">
                    <h3 className="cap-index__title">{tx(locale, s.title)}</h3>
                    <p className="cap-index__desc">{tx(locale, s.description)}</p>
                    {items.length > 0 ? (
                      <p className="cap-index__features">{items.join("  ·  ")}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}

        {groups.length > 0 ? (
          <div className="cap-toolkit reveal">
            <div className="cap-toolkit__head">
              <h3 className="label label-accent">{t(locale, "capabilities.toolkit")}</h3>
              <p className="text-small text-ink-3">{t(locale, "capabilities.toolkitNote")}</p>
            </div>
            <dl className="cap-toolkit__groups">
              {groups.map((g) => (
                <div key={g.category} className="cap-toolkit__group">
                  <dt className="label">{tx(locale, g.category)}</dt>
                  <dd className="cap-toolkit__items">{g.items.map((s) => s.name).join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  );
}
