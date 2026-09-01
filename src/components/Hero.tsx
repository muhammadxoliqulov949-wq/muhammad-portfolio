import Icon from "./ui/Icon";
import CopyButton from "./ui/CopyButton";
import BuilderDesk from "./builder-desk/BuilderDesk";
import {
  rolesOf,
  safeHref,
  sectionHref,
  socialsOf,
  type Profile,
} from "@/lib/content";
import { t, tx, txEach, type Locale } from "@/lib/i18n-core";

const SOCIAL_ICON = {
  github: "github",
  linkedin: "linkedin",
  instagram: "instagram",
  telegram: "telegram",
  email: "mail",
  phone: "phone",
} as const;

/**
 * Hero — ism + kasb + ikkita CTA.
 * Portret bo'lmasa MX harfi o'rniga haqiqiy mahsulot (IELTS.mock) chiqadi.
 */
type Props = { profile: Profile; study?: string; locale?: Locale };

export default function Hero({ profile: p, study, locale = "uz" }: Props) {
  const roles = txEach(locale, rolesOf(p));
  const title = roles[0] || p.title || "Student & AI Developer";
  const extras = roles.slice(1);
  const socials = socialsOf(p, locale);
  const resume = safeHref(p.resumeUrl);
  const names = (p.fullName || "Muhammad").trim().split(/\s+/).filter(Boolean);
  const firstName = names[0] || "Muhammad";
  const lastName = names.slice(1).join(" ");

  const meta = [
    p.location ? { icon: "pin" as const, text: tx(locale, p.location) } : null,
    p.englishLevel ? { icon: "gauge" as const, text: `${t(locale, "hero.english")}: ${p.englishLevel}` } : null,
    study ? { icon: "sparkle" as const, text: study } : null,
  ].filter((x): x is { icon: "pin" | "gauge" | "sparkle"; text: string } => !!x);

  return (
    <section id="home" className="u-hero-lines relative overflow-x-clip pt-28 pb-[var(--section-y)] md:pt-36">
      <div className="u-container">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-20">
          <div className="reveal min-w-0">
            {p.badge ? (
              <p className="label mb-7 flex flex-wrap items-center gap-2.5">
                <span className="dot" aria-hidden />
                <span className="label-accent">{tx(locale, p.badge)}</span>
              </p>
            ) : null}

            <h1 className="hero-name">
              <span className="display hero-name__first">{firstName}</span>
              {lastName ? <span className="display hero-name__last">{lastName}</span> : null}
            </h1>

            <p className="mt-6 display text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold tracking-tight">
              {title}
            </p>
            {extras.length > 0 ? <p className="hero-roles mt-2">{extras.join(" · ")}</p> : null}

            {p.bio ? <p className="mt-7 max-w-[34rem] text-lead text-ink-2">{tx(locale, p.bio)}</p> : null}

            <div className="hero-actions mt-9 flex flex-wrap items-center gap-2.5">
              <a href={sectionHref("contact")} className="btn btn--accent btn--lg">
                {t(locale, "hero.cta")}
                <Icon name="arrow-right" size={16} />
              </a>
              <a href={sectionHref("work")} className="btn btn--lg">
                <Icon name="layers" size={16} />
                {t(locale, "hero.projects")}
              </a>
              {resume ? (
                <a href={resume} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">
                  <Icon name="download" size={16} />
                  {t(locale, "hero.cv")}
                </a>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target={s.key === "email" || s.key === "phone" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="icon-btn"
                >
                  <Icon name={SOCIAL_ICON[s.key]} size={17} />
                </a>
              ))}
              {p.email ? <CopyButton value={p.email} label={t(locale, "hero.copyEmail")} /> : null}
              {p.telegram ? (
                <CopyButton value={p.telegram.replace("@", "")} label={t(locale, "hero.copyTg")} />
              ) : null}
            </div>
          </div>

          <div className="reveal relative mx-auto w-full max-w-[34rem] lg:max-w-none lg:justify-self-end">
            <BuilderDesk />
          </div>
        </div>

        {meta.length > 0 ? (
          <ul className="hero-meta">
            {meta.map((m) => (
              <li key={m.text}>
                <Icon name={m.icon} size={14} className="text-ink-3" />
                {m.text}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
