import SectionHead from "./ui/Section";
import Icon from "./ui/Icon";
import CopyButton from "./ui/CopyButton";
import ContactForm from "./ContactForm";
import Card from "./ui/Card";
import { safeHref, telegramHref, type Profile } from "@/lib/content";

/**
 * Aloqa bo'limi.
 *
 * Audit tuzatishlari:
 *  - email/telegram bo'sh bo'lsa blok umuman chiqmaydi (avval
 *    "yourname@example.com" kabi placeholder chiqib qolardi — P1-7);
 *  - nusxa olish tugmasi (mikro-interaktsiya, foydali);
 *  - javob vaqti va ish jarayoni qadamlari — "konversiyasiz" bo'limni
 *    ishlaydigan CTA'ga aylantiradi.
 */
export default function Contact({ profile: p }: { profile: Profile }) {
  const tg = telegramHref(p.telegram);
  type Channel = { icon: "mail" | "telegram" | "pin"; label: string; value: string; href: string | null; copy: string };

  const channels: Channel[] = [];
  if (p.email) {
    channels.push({ icon: "mail", label: "Email", value: p.email, href: safeHref(`mailto:${p.email}`), copy: p.email });
  }
  if (tg && p.telegram) {
    channels.push({ icon: "telegram", label: "Telegram", value: p.telegram, href: tg, copy: p.telegram.replace("@", "") });
  }
  if (p.location) {
    channels.push({ icon: "pin", label: "Joylashuv", value: p.location, href: null, copy: "" });
  }

  const steps = [
    { title: "Qisqa suhbat", text: "15 daqiqalik qo'ng'iroq yoki yozishma — maqsad va cheklovlar." },
    { title: "Taklif va narx", text: "Ish hajmi, bosqichlar, aniq sana va fix narx." },
    { title: "Haftalik demo", text: "Har juma ishlaydigan versiya; to'lov bosqichma-bosqich." },
  ];

  return (
    <section id="contact" className="u-sunken u-section u-cv border-t border-line-1">
      <div className="u-container">
        <SectionHead
          index="06"
          eyebrow="Aloqa"
          title={
            <>
              Keling, bitta <span className="display-em">aniq</span> ishni qilaylik
            </>
          }
          lead={p.responseTime || "Loyihangizni tahlil qilib, 1 ish kunida taklif bilan qaytaman."}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="reveal stack gap-6">
            {channels.length > 0 ? (
              <ul className="hairline-x card card--flat overflow-hidden !rounded-3 px-5 py-1">
                {channels.map((c) => (
                  <li key={c.label} className="flex items-center justify-between gap-3 py-3.5">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-2 border border-line-1 bg-surface-2 text-ink-2">
                        <Icon name={c.icon} size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="label block">{c.label}</span>
                        {c.href ? (
                          <a
                            href={c.href}
                            target={c.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="u-link-quiet block truncate text-body font-medium"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <span className="block truncate text-body font-medium">{c.value}</span>
                        )}
                      </span>
                    </span>
                    {c.copy ? <CopyButton value={c.copy} label={`${c.label} — nusxa olish`} /> : null}
                  </li>
                ))}
              </ul>
            ) : null}

            <ol className="stack gap-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-3.5">
                  <span className="u-num mt-0.5 font-mono text-micro text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-body font-semibold">{s.title}</span>
                    <span className="block text-small text-ink-2">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <Card className="flex items-start gap-3 !rounded-3 p-4" interactive={false}>
              <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-accent-text" />
              <p className="text-small text-ink-2">
                Shartnoma, kod egalligi va manba fayllari — hammasi buyurtma boshida
                aniq qilib qo&apos;yiladi.
              </p>
            </Card>
          </div>

          <div className="reveal">
            <Card className="p-6 md:p-8" interactive={false}>
              <h3 className="display text-title mb-1 font-semibold">Xabar qoldiring</h3>
              <p className="mb-6 text-small text-ink-2">
                Forma orqali yuborilgan hamma xabar admin panelda ko&apos;rinadi.
              </p>
              <ContactForm successNote={p.responseTime ? `Rahmat! ${p.responseTime}.` : undefined} />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
