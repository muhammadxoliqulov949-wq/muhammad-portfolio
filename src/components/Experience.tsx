import SectionHead from "./ui/Section";
import Icon from "./ui/Icon";
import { highlightsOf, type ExperienceItem, type Profile } from "@/lib/content";

/**
 * Tajriba — haqiqiy, lekin «korporativ» boʻlmagan roʻyxat.
 *
 * Boʻlim kampaniya nomlarini emas, mijoz bilan ishlangan haqiqiy raqamlarni
 * oldinga chiqaradi: har yozuvdagi birinchi `highlights` bandi koʻrsatkich
 * boʻlib chiqadi. Sarlavhadagi davr ham DB'dan olinadi (`statExperience`) —
 * komponentda ixtirilgan sana qolmaydi.
 */
export default function Experience({ items, profile }: { items: ExperienceItem[]; profile: Profile }) {
  if (items.length === 0) return null;

  const span = profile.statExperience.trim();

  return (
    <section id="experience" className="u-section u-cv">
      <div className="u-container">
        <SectionHead
          index="03"
          eyebrow="Tajriba"
          title={
            span ? (
              <>
                {span} — {items.length} yoʻnalishda, <span className="display-em">mijoz bilan</span>
              </>
            ) : (
              <>
                {items.length} yoʻnalishda, <span className="display-em">mijoz bilan</span>
              </>
            )
          }
          lead="Bu roʻyxat katta kompaniyalar tarixi emas. Bu — har birida jonli odamlar bilan kelishib, ular kutgan natijani oʻz vaqtida topshirish tajribasi."
        />

        <ol className="timeline stack pl-8">
          {items.map((item) => {
            const highlights = highlightsOf(item.highlights);
            const metric = highlights[0];
            const rest = highlights.slice(1);
            return (
              <li key={item.id} className="relative pb-9 last:pb-0">
                <span className="timeline-node" data-current={item.current} aria-hidden />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <h3 className="display text-title font-semibold">{item.role}</h3>
                  <span className="text-body text-ink-2">{item.company}</span>
                  {metric ? (
                    <span className="chip chip--accent ml-auto">
                      <Icon name="sparkle" size={11} />
                      {metric}
                    </span>
                  ) : null}
                </div>
                {item.period ? (
                  <p className="mt-1 font-mono text-micro uppercase tracking-wider text-ink-3 u-num">
                    {item.period}
                  </p>
                ) : null}
                {item.description ? (
                  <p className="mt-3 max-w-2xl text-body text-ink-2">{item.description}</p>
                ) : null}
                {rest.length > 0 ? (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-small text-ink-2">
                        <Icon name="check" size={13} className="mt-0.5 shrink-0 text-accent-text" />
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-3 border border-line-1 bg-surface-1 px-5 py-4">
          <p className="flex items-center gap-2.5 text-small text-ink-2">
            <span className="dot" aria-hidden />
            Hozirda: <span className="font-medium text-ink-1">IELTS.mock</span> platformasini
            rivojlantirish davom etmoqda
          </p>
          <a href="/#work" className="link-underline ml-auto text-small">
            Loyihani koʻrish
            <Icon name="arrow-right" size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
