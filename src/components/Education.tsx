import SectionHead, { Section } from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import type { EducationItem } from "@/lib/content";

/**
 * Ta'lim — fakultativ bo'lim: qator bo'lmasa komponent `null` qaytaradi,
 * shuning uchun bo'sh holat uchun "te"lashtirilgan matn ham kerak emas.
 */
export default function Education({ items }: { items: EducationItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section id="education">
      <SectionHead
        index="06"
        eyebrow="Ta'lim"
        title={
          <>
            Biznesni <span className="display-em">oʻqib</span>, kodni qurib yuraman
          </>
        }
        lead="Talabaman — shuning uchun bu bo'lim faqat haqiqatni yozadi: qayerda, nimani va qachongacha."
      />

      <ol className="grid gap-4 md:grid-cols-2">
        {items.map((e) => (
          <li key={e.id} className="reveal">
            <Card className="flex h-full flex-col gap-4 p-6" interactive={false}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="display text-title font-semibold">{e.institution}</h3>
                {e.current ? (
                  <span className="chip chip--accent">
                    <span className="dot" aria-hidden />
                    Hozir
                  </span>
                ) : null}
              </div>

              {(e.credential || e.field) && (
                <p className="text-body text-ink-2">
                  {[e.credential, e.field].filter(Boolean).join(" · ")}
                </p>
              )}

              {(e.period || e.status) && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-1 pt-3">
                  {e.period ? (
                    <p className="label flex items-center gap-2">
                      <Icon name="clock" size={12} />
                      <span className="u-num">{e.period}</span>
                    </p>
                  ) : null}
                  {e.status ? (
                    <p className="label flex items-center gap-2">
                      <Icon name="check" size={12} />
                      {e.status}
                    </p>
                  ) : null}
                </div>
              )}

              {e.detail ? <p className="text-small text-ink-2">{e.detail}</p> : null}
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
