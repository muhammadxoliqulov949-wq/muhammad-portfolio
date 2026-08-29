import SectionHead, { Section } from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import { goalsOf, listFrom, type Profile } from "@/lib/content";

/**
 * Ish oqimi + rejalar.
 *
 * Bu bo'lim eski "Mijozlar fikri" o'rnida: haqiqiy iqtiboslar bo'lmagani uchun
 * ularni o'ylab topish o'rniga, Muhammadning real ishlash tarzi va hozirgi
 * yoʻnalishi koʻrsatiladi. "Kelgusi 1-2 yil" bloki ataylab ajratilgan —
 * reja natija sifatida o'qilmasligi kerak.
 */
export default function Approach({ profile: p }: { profile: Profile }) {
  const steps = listFrom(p.workflow);
  const goals = goalsOf(p);
  if (steps.length === 0 && goals.length === 0) return null;

  return (
    <Section id="approach">
      <SectionHead
        index="08"
        eyebrow="Ishlash uslubim"
        title={
          <>
            AI bilan tez, lekin <span className="display-em">tekshirib</span> yuraman
          </>
        }
        lead="Har bir loyihada bosqichlar bir xil — shu tufayli „tayyor“ degan soʻzning maʼnosi aniq."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
        {steps.length > 0 ? (
          <ol className="grid gap-3 sm:grid-cols-2">
            {steps.map((step, i) => (
              <li key={step}>
                <Card className="flex h-full items-start gap-4 p-5" interactive={false}>
                  <span className="display u-num shrink-0 text-[26px] leading-none text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body">{step}</span>
                </Card>
              </li>
            ))}
          </ol>
        ) : null}

        {goals.length > 0 ? (
          <Card className="flex flex-col p-6" interactive={false}>
            <p className="label label-accent mb-1">Kelgusi 1–2 yil</p>
            <p className="mb-5 text-small text-ink-3">
              Bu — <span className="font-medium text-ink-2">reja</span>, bajarilgan ish emas.
            </p>
            <ul className="hairline-x stack -my-1">
              {goals.map((g) => (
                <li key={g} className="flex items-start gap-2.5 py-2.5 text-body">
                  <Icon name="arrow-up-right" size={14} className="mt-1 shrink-0 text-accent-text" />
                  {g}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </Section>
  );
}
