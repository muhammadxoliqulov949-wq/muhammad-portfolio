import { Suspense } from "react";
import Icon, { type IconName } from "./ui/Icon";
import ContactForm from "./ContactForm";
import { phoneHref, safeHref, telegramHref, type Profile } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n-core";

/**
 * Aloqa bo'limi — saytning yakuniy tahririy holati (Phase 3F).
 *
 * Bitta asosiy CTA (Telegram), email ikkilamchi; qolgan kanallar ixcham
 * metadata qatori. Katta yakuniy sarlavha + keng bo'shliq; forma yon ustunda
 * saqlanadi (DB'ga yozadi, soxta havola yo'q).
 *
 * Server component — harakat yo'q.
 */
export default function Contact({ profile: p, locale = "uz" }: { profile: Profile; locale?: Locale }) {
  const tg = telegramHref(p.telegram);
  const phone = phoneHref(p.phone);
  const emailHref = p.email ? safeHref(`mailto:${p.email}`) : null;

  type Channel = { icon: IconName; label: string; value: string; href: string | null; external?: boolean };
  const secondary: Channel[] = [];
  if (p.phone && phone) secondary.push({ icon: "phone", label: t(locale, "contact.phone"), value: p.phone, href: phone });
  if (p.instagram) {
    const ig = safeHref(p.instagram);
    if (ig) secondary.push({ icon: "instagram", label: "Instagram", value: p.instagram.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: ig, external: true });
  }
  if (p.github) {
    const gh = safeHref(p.github);
    if (gh) secondary.push({ icon: "github", label: "GitHub", value: p.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: gh, external: true });
  }

  const steps: { title: string; text: string }[] = [
    { title: t(locale, "contact.step1t"), text: t(locale, "contact.step1") },
    { title: t(locale, "contact.step2t"), text: t(locale, "contact.step2") },
    { title: t(locale, "contact.step3t"), text: t(locale, "contact.step3") },
  ];

  return (
    <section id="contact" className="u-sunken u-section u-cv border-t border-line-1" data-narrative="light">
      <div className="u-container">
        {/* Yakuniy sarlavha + bitta asosiy CTA */}
        <div className="contact-final">
          <p className="label mb-7 flex items-center gap-3">
            <span className="u-num text-ink-3">06</span>
            <span className="h-px w-8 bg-line-2" aria-hidden />
            <span className="label-accent">{t(locale, "contact.eyebrow")}</span>
          </p>

          <h2 className="display contact-headline">
            {t(locale, "contact.titleBefore")} <span className="display-em">{t(locale, "contact.titleEm")}</span>
          </h2>
          <p className="contact-lead">{t(locale, "contact.lead")}</p>

          <div className="contact-cta">
            {tg ? (
              <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--lg">
                <Icon name="telegram" size={16} />
                {t(locale, "contact.tg")}
              </a>
            ) : null}
            {emailHref && p.email ? (
              <a href={emailHref} className="btn btn--lg">
                <Icon name="mail" size={16} />
                {p.email}
              </a>
            ) : null}
          </div>

          <div className="contact-meta">
            {secondary.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <Icon name={c.icon} size={14} className="text-ink-3" />
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="u-link-quiet"
                  >
                    {c.value}
                  </a>
                ) : (
                  <span>{c.value}</span>
                )}
              </span>
            ))}
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
        </div>

        {/* Qanday boshlanadi + forma */}
        <div className="contact-grid">
          <div className="contact-steps reveal">
            <h3 className="label label-accent">{t(locale, "contact.how")}</h3>
            <ol className="contact-steps__list">
              {steps.map((s, i) => (
                <li key={s.title} className="contact-steps__item">
                  <span className="contact-steps__num u-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-1">{s.title}</p>
                    <p className="mt-1 text-small text-ink-2">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="contact-lock">
              <Icon name="shield" size={15} className="mt-0.5 shrink-0 text-accent-text" />
              <span>{t(locale, "contact.lock")}</span>
            </p>
          </div>

          <div className="contact-form reveal">
            <div className="contact-form__card">
              <h3 className="display text-title mb-1 font-semibold">{t(locale, "contact.formTitle")}</h3>
              <p className="mb-6 text-small text-ink-2">{t(locale, "contact.formLead")}</p>
              <Suspense fallback={null}>
                <ContactForm locale={locale} successNote={t(locale, "contact.success")} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
