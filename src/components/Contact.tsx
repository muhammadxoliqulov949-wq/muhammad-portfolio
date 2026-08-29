import { Suspense } from "react";
import SectionHead from "./ui/Section";
import Icon, { type IconName } from "./ui/Icon";
import CopyButton from "./ui/CopyButton";
import ContactForm from "./ContactForm";
import Card from "./ui/Card";
import { phoneHref, safeHref, telegramHref, type Profile } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n-core";

/**
 * Aloqa bo'limi — saytdagi asosiy konversiya nuqtasi.
 *
 * Talab: hech qanday "ishlamaydigan" forma yoki soxta havola bo'lmasin.
 * Shu sababli har bir kanal haqiqiy va bosiladigan: email → mailto,
 * telefon → tel:, Telegram/Instagram/GitHub → to'g'ri profil.
 * Forma esa DB'ga yozadi (admin panelda ko'rinadi) — bu haqida ataylab
 * "xabaringiz email'ga yuboriladi" deyilmaydi.
 */
export default function Contact({ profile: p, locale = "uz" }: { profile: Profile; locale?: Locale }) {
  const tg = telegramHref(p.telegram);
  const phone = phoneHref(p.phone);

  type Channel = {
    icon: IconName;
    label: string;
    value: string;
    href: string | null;
    copy: string;
    external?: boolean;
  };

  const channels: Channel[] = [];
  if (p.email) {
    channels.push({
      icon: "mail",
      label: "Email",
      value: p.email,
      href: safeHref(`mailto:${p.email}`),
      copy: p.email,
    });
  }
  if (p.phone && phone) {
    channels.push({
      icon: "phone",
      label: t(locale, "contact.phone"),
      value: p.phone,
      href: phone,
      copy: p.phone,
    });
  }
  if (tg && p.telegram) {
    channels.push({
      icon: "telegram",
      label: "Telegram",
      value: p.telegram,
      href: tg,
      copy: p.telegram.replace("@", ""),
      external: true,
    });
  }
  if (p.instagram) {
    const ig = safeHref(p.instagram);
    if (ig) {
      channels.push({
        icon: "instagram",
        label: "Instagram",
        value: p.instagram.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
        href: ig,
        copy: "",
        external: true,
      });
    }
  }
  if (p.github) {
    const gh = safeHref(p.github);
    if (gh) {
      channels.push({
        icon: "github",
        label: "GitHub",
        value: p.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
        href: gh,
        copy: "",
        external: true,
      });
    }
  }

  const steps: { title: string; text: string }[] = [
    { title: t(locale, "contact.step1t"), text: t(locale, "contact.step1") },
    { title: t(locale, "contact.step2t"), text: t(locale, "contact.step2") },
    { title: t(locale, "contact.step3t"), text: t(locale, "contact.step3") },
  ];

  return (
    <section id="contact" className="u-sunken u-section u-cv border-t border-line-1">
      <div className="u-container">
        <SectionHead
          index="09"
          eyebrow={t(locale, "contact.eyebrow")}
          title={
            <>
              {t(locale, "contact.titleBefore")} <span className="display-em">{t(locale, "contact.titleEm")}</span>
            </>
          }
          lead={t(locale, "contact.lead")}
          action={
            tg ? (
              <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn--accent">
                <Icon name="telegram" size={16} />
                {t(locale, "contact.tg")}
              </a>
            ) : null
          }
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
                            target={c.external ? "_blank" : undefined}
                            rel={c.external ? "noopener noreferrer" : undefined}
                            className="u-link-quiet block truncate text-body font-medium"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <span className="block truncate text-body font-medium">{c.value}</span>
                        )}
                      </span>
                    </span>
                    {c.copy ? <CopyButton value={c.copy} label={`${c.label} — ${t(locale, "contact.copy")}`} /> : null}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-2">
              {p.englishLevel ? (
                <span className="flex items-center gap-2">
                  <Icon name="sparkle" size={14} className="text-ink-3" />
                  {t(locale, "contact.english").replace("{level}", p.englishLevel)}
                </span>
              ) : null}
              <span className="flex items-center gap-2">
                <Icon name="clock" size={14} className="text-ink-3" />
                {t(locale, "contact.tz")}
              </span>
            </div>

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
              <p className="text-small text-ink-2">{t(locale, "contact.lock")}</p>
            </Card>
          </div>

          <div className="reveal">
            <Card className="p-6 md:p-8" interactive={false}>
              <h3 className="display text-title mb-1 font-semibold">{t(locale, "contact.formTitle")}</h3>
              <p className="mb-6 text-small text-ink-2">{t(locale, "contact.formLead")}</p>
              <Suspense fallback={null}>
                <ContactForm locale={locale} successNote={t(locale, "contact.success")} />
              </Suspense>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
