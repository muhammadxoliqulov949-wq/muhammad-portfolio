import SectionHead from "./ui/Section";
import Icon from "./ui/Icon";
import Card from "./ui/Card";
import { highlightsOf, type ExperienceItem } from "@/lib/content";

/**
 * Tajriba — vertikal "ledger" (avvalgi timeline kartalari takrori o'rniga
 * hairline to'r + mono sana). `current` holati accent nuqta bilan.
 */
export default function Experience({ items }: { items: ExperienceItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="u-section u-cv">
      <div className="u-container">
        <SectionHead
          index="03"
          eyebrow="Tajriba"
          title={
            <>
              Uch yillik amaliyot,{" "}
              <span className="display-em">boʻlinishlar</span> bilan
            </>
          }
          lead="Har bosqichda nimani o'rganganimni va nimani qoldirib ketganimni aniq yozdim."
        />

        <ol className="timeline stack pl-8">
          {items.map((item) => {
            const highlights = highlightsOf(item.highlights);
            return (
              <li key={item.id} className="relative pb-9 last:pb-0">
                <span className="timeline-node" data-current={item.current} aria-hidden />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="display text-title font-semibold">{item.role}</h3>
                  <span className="text-body text-ink-2">{item.company}</span>
                  {item.current ? (
                    <span className="chip chip--accent">
                      <span className="dot" aria-hidden />
                      Hozir
                    </span>
                  ) : null}
                </div>
                {item.period ? (
                  <p className="mt-1 font-mono text-micro uppercase tracking-wider text-ink-3 u-num">{item.period}</p>
                ) : null}
                {item.description ? <p className="mt-3 max-w-2xl text-body text-ink-2">{item.description}</p> : null}
                {highlights.length > 0 ? (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((h) => (
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

        <Card className="mt-10 flex flex-wrap items-center justify-between gap-4 p-5 !rounded-3" interactive={false}>
          <p className="text-body text-ink-2">
            To&apos;liq tarixma va ma&apos;lumotnomani hohlasangiz — yuboraman.
          </p>
          <a href="#contact" className="btn btn--sm">
            So&apos;rash
            <Icon name="arrow-right" size={14} />
          </a>
        </Card>
      </div>
    </section>
  );
}
