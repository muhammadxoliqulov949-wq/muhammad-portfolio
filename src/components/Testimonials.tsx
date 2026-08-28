import SectionHead from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import { safeHref, type Testimonial } from "@/lib/content";

function Stars({ rating, name }: { rating: number; name: string }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <p className="mb-4 flex items-center gap-1.5">
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="star" size={13} className={i < value ? "text-accent-text" : "text-ink-3/50"} />
        ))}
      </span>
      <span className="sr-only">{name} baho berdi: 5 dan {value}</span>
      <span className="u-num font-mono text-micro text-ink-3">{value}.0/5</span>
    </p>
  );
}

/**
 * Mijozlar fikri — rating DB'dan (avval hamma joyda qattiq 5 yulduz edi,
 * bu "soxta ijtimoiy dalil" hissini berardi — audit P1-11).
 */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  const [first, ...rest] = items;

  return (
    <section id="testimonials" className="u-section u-cv">
      <div className="u-container">
        <SectionHead
          index="05"
          eyebrow="Fikrlar"
          title={
            <>
              Mijozlar <span className="display-em">nima deydi</span>
            </>
          }
          lead="Ism va lavozimlar rozilik bilan berilgan; baho — hamkorlik yakunidagi real baholat."
        />

        <div className="bento">
          <div data-span="wide" className="reveal">
            <Card className="flex h-full flex-col justify-between gap-6 p-6 md:p-8" interactive={false}>
              <div>
                <Icon name="quote" size={26} className="text-accent-text" />
                <blockquote className="display mt-4 text-display-m italic leading-snug">
                  {first.text}
                </blockquote>
              </div>
              <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-line-1 pt-5">
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-accent font-mono text-micro font-bold text-accent-ink">
                    {first.avatarInitials || first.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-body font-semibold">{first.name}</span>
                    <span className="block text-small text-ink-2">{first.role}</span>
                  </span>
                </span>
                <Stars rating={first.rating} name={first.name} />
              </figcaption>
            </Card>
          </div>

          {rest.map((t) => {
            const source = safeHref(t.sourceUrl);
            return (
              <div key={t.id} data-span="third" className="reveal">
                <Card className="flex h-full flex-col gap-4 p-5" interactive={false}>
                  <Stars rating={t.rating} name={t.name} />
                  <blockquote className="flex-1 text-body text-ink-2">{t.text}</blockquote>
                  <div className="flex items-center justify-between gap-3 border-t border-line-1 pt-4">
                    <span className="min-w-0">
                      <span className="block truncate text-small font-semibold">{t.name}</span>
                      <span className="block truncate text-small text-ink-3">{t.role}</span>
                    </span>
                    {source ? (
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn !size-9"
                        aria-label={`${t.name} haqidagi manbani ochish`}
                      >
                        <Icon name="external" size={14} />
                      </a>
                    ) : null}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
