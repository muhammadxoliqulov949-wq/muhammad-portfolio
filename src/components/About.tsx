import SectionHead, { Section } from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import { interestsOf, listFrom, principlesOf, type Profile } from "@/lib/content";
import { t, tx, txEach, type Locale } from "@/lib/i18n-core";

/**
 * About — "kimman" bo'limi.
 *
 * Uslubiy qaror: o'n yillik tajribasi bo'lmagan odamni tajribali ko'rsatishga
 * urinish yo'q. Bu yerda haqiqiy pozitsiya: tez o'rganuvchi talaba, AI bilan
 * ishlaydigan amaliyotchi va mijoz oldida javobgarlik oladigan odam.
 */
export default function About({ profile: p, locale = "uz" }: { profile: Profile; locale?: Locale }) {
  const strengths = txEach(locale, listFrom(p.strengths));
  const interests = txEach(locale, interestsOf(p));
  const principles = txEach(locale, principlesOf(p));
  const paragraphs = (p.story || p.bio || "")
    .split(/\n{2,}/)
    .map((x) => tx(locale, x.trim()))
    .filter(Boolean);

  if (paragraphs.length === 0 && strengths.length === 0) return null;

  return (
    <Section id="about" sunken>
      <SectionHead
        index="01"
        eyebrow={t(locale, "about.eyebrow")}
        title={
          <>
            {t(locale, "about.titleBefore")}{" "}
            <span className="display-em">{t(locale, "about.titleEm")}</span> {t(locale, "about.titleAfter")}
          </>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        <div className="reveal stack gap-5">
          {paragraphs.map((par, i) => (
            <p key={i} className={i === 0 ? "text-lead" : "text-body text-ink-2"}>
              {par}
            </p>
          ))}

          {principles.length > 0 ? (
            <ul className="hairline-x mt-2 stack">
              {principles.map((line) => (
                <li key={line} className="flex items-start gap-3 py-3 text-body">
                  <Icon name="check" size={15} className="mt-1 shrink-0 text-accent-text" />
                  <span className="text-ink-1">{line}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="reveal stack gap-3">
          {strengths.length > 0 ? (
            <Card className="p-5" interactive={false}>
              <h3 className="label label-accent mb-3.5">{t(locale, "about.strengths")}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {strengths.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {interests.length > 0 ? (
            <Card className="p-5" interactive={false}>
              <h3 className="label label-accent mb-3.5">{t(locale, "about.interests")}</h3>
              <p className="text-small text-ink-2">
                {t(locale, "about.interestsNote")}{" "}
                {interests.join(", ")}.
              </p>
            </Card>
          ) : null}

          <Card className="p-5 !rounded-3" interactive={false}>
            <p className="flex items-start gap-3 text-small text-ink-2">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-accent-text" />
              <span>
                Bu saytda faqat haqiqiy maʼlumot bor: soxta mijoz iqtiboslari, oʻylab topilgan raqamlar
                yoki „yillar davomida expert“ kabi iboralar yoʻq. Bor narsa — qilingan ish va uni halol
                koʻrsatish.
              </span>
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
