import Card from "./ui/Card";
import Icon, { type IconName } from "./ui/Icon";
import { featuresOf, type Service } from "@/lib/content";

const KNOWN: IconName[] = ["rocket", "layers", "gauge", "bot", "code", "database", "shield", "zap", "target", "pen"];

function iconFor(value: string): IconName {
  const v = (value || "").trim().toLowerCase();
  return (KNOWN as string[]).includes(v) ? (v as IconName) : "sparkle";
}

/**
 * Xizmatlar — bento (bitta katta + kichiklar) va **narx/muddat** bilan
 * (audit P1-10: "xizmatlar" bo'limi faqat matn edi, konversiya nuqtasi yo'q edi).
 * Ikonka emoji emas, `icon` maydoni endi ikonka kaliti (`rocket`, `layers`...).
 */
export default function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <div className="bento">
      {services.map((s, i) => {
        const features = featuresOf(s.features);
        const wide = i === 0;
        return (
          <div key={s.id} data-span={wide ? "wide" : "third"} className="reveal">
            <Card className={`flex h-full flex-col p-6 ${wide ? "md:p-8" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`grid shrink-0 place-items-center rounded-2 border border-line-1 bg-surface-2 text-accent-text ${
                    wide ? "size-12" : "size-10"
                  }`}
                >
                  <Icon name={iconFor(s.icon)} size={wide ? 21 : 17} />
                </span>
                <span className="text-right">
                  {s.priceFrom ? (
                    <span className="display block text-[17px] font-semibold whitespace-nowrap">{s.priceFrom}</span>
                  ) : null}
                  {s.delivery ? (
                    <span className="label mt-1 flex items-center justify-end gap-1.5">
                      <Icon name="clock" size={11} />
                      {s.delivery}
                    </span>
                  ) : null}
                </span>
              </div>

              <h3 className={`display mt-5 font-semibold ${wide ? "text-display-m" : "text-title"}`}>{s.title}</h3>
              <p className={`mt-2.5 text-ink-2 ${wide ? "text-lead" : "text-body"}`}>{s.description}</p>

              {features.length > 0 ? (
                <ul className={`mt-5 grid gap-2 ${wide ? "sm:grid-cols-2" : ""}`}>
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-small text-ink-2">
                      <Icon name="check" size={13} className="mt-0.5 shrink-0 text-accent-text" />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}

              <a href="#contact" className="link-underline mt-6 inline-flex text-small">
                Muhokama qilish
                <Icon name="arrow-up-right" size={13} />
              </a>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
