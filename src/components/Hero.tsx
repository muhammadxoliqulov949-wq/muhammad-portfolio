import Image from "next/image";
import Icon from "./ui/Icon";
import PortraitSlot from "./PortraitSlot";
import Rotator from "./Rotator";
import CopyButton from "./ui/CopyButton";
import {
  listFrom,
  phoneHref,
  portraitOf,
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
 * Hero — editorial spread, not an agency splash.
 * Identity first (student name), craft second (frame, type, one process card).
 */
type Props = { profile: Profile; study?: string; locale?: Locale };

export default function Hero({ profile: p, study, locale = "uz" }: Props) {
  const roles = txEach(locale, rolesOf(p));
  const socials = socialsOf(p, locale);
  const steps = txEach(locale, listFrom(p.workflow));
  const resume = safeHref(p.resumeUrl);
  const portrait = portraitOf(p);
  const names = (p.fullName || "Muhammad").trim().split(/\s+/).filter(Boolean);
  const firstName = names[0] || "Muhammad";
  const lastName = names.slice(1).join(" ");

  const stats = [
    { label: t(locale, "hero.exp"), value: tx(locale, p.statExperience) },
    { label: t(locale, "hero.clients"), value: tx(locale, p.statAvailability) },
    { label: t(locale, "hero.sites"), value: tx(locale, p.statProjects) },
  ].filter((s) => s.value);

  const meta = [
    p.location ? { icon: "pin" as const, text: tx(locale, p.location) } : null,
    p.englishLevel ? { icon: "gauge" as const, text: `${t(locale, "hero.english")}: ${p.englishLevel}` } : null,
    study ? { icon: "sparkle" as const, text: study } : null,
  ].filter((x): x is { icon: "pin" | "gauge" | "sparkle"; text: string } => !!x);

  return (
    <section id="home" className="u-hero-lines relative overflow-clip pt-28 pb-[var(--section-y)] md:pt-36">
      <div className="u-container">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-16 xl:gap-20">
          <div className="reveal">
            {p.badge ? (
              <p className="label mb-8 flex flex-wrap items-center gap-2.5">
                <span className="dot" aria-hidden />
                <span className="label-accent">{tx(locale, p.badge)}</span>
              </p>
            ) : null}

            <h1 className="hero-name">
              <span className="display hero-name__first">{firstName}</span>
              {lastName ? <span className="display-em hero-name__last">{lastName}</span> : null}
            </h1>

            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display text-[clamp(1.2rem,2vw,1.65rem)] font-semibold tracking-tight">
                <TitleMark title={p.title || roles[0] || "Student & AI Developer"} />
              </span>
              {roles.length > 1 ? (
                <Rotator
                  items={roles.slice(1)}
                  className="flex h-6 font-mono text-micro uppercase tracking-[0.14em] text-ink-3"
                />
              ) : null}
            </p>

            {p.bio ? <p className="mt-7 max-w-[36rem] text-lead text-ink-2">{tx(locale, p.bio)}</p> : null}

            <div className="hero-actions mt-10 flex flex-wrap items-center gap-2.5">
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

          <div className="reveal relative mx-auto w-full max-w-[420px] lg:max-w-none lg:justify-self-end">
            <figure className="hero-photo">
              {portrait ? (
                <Image
                  src={portrait}
                  alt={`${p.fullName || "Muhammad Xoliqulov"} — ${t(locale, "hero.portrait")}`}
                  fill
                  priority
                  unoptimized={portrait.startsWith("/api/media/")}
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="hero-photo__img"
                />
              ) : (
                <div className="hero-photo__mono" aria-hidden="true">
                  <span className="display text-display-l font-semibold tracking-tight">
                    {(p.avatarInitials || p.fullName || "M").trim().slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <PortraitSlot current={portrait} initials={p.avatarInitials || p.fullName} />

              <figcaption className="hero-photo__caption">
                <span className="text-body font-semibold">{p.fullName || "Portfolio"}</span>
                {p.location ? (
                  <span className="flex items-center gap-1.5 text-small text-ink-2">
                    <Icon name="pin" size={12} className="text-ink-3" />
                    {tx(locale, p.location)}
                  </span>
                ) : null}
              </figcaption>
            </figure>

            {steps.length > 0 ? (
              <aside className="hero-process" aria-label={t(locale, "hero.ai")}>
                <p className="label label-accent mb-3">{t(locale, "hero.ai")}</p>
                <ol className="hero-process__list">
                  {steps.slice(0, 4).map((step, i) => (
                    <li key={step}>
                      <span className="u-num font-mono text-micro text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </aside>
            ) : null}

            {stats.length > 0 ? (
              <dl className="hero-stats">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd className="display u-num">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
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
            {p.email ? (
              <li>
                <Icon name="mail" size={14} className="text-ink-3" />
                <a href={`mailto:${p.email}`} className="link-underline">
                  {p.email}
                </a>
              </li>
            ) : null}
            {phoneHref(p.phone) ? (
              <li>
                <Icon name="phone" size={14} className="text-ink-3" />
                <a href={phoneHref(p.phone) as string} className="link-underline">
                  {p.phone}
                </a>
              </li>
            ) : null}
            <li className="hero-meta__scroll">
              <span className="animate-pulse-soft" aria-hidden>
                <Icon name="chevron-down" size={14} />
              </span>
              {t(locale, "hero.scroll")}
            </li>
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function TitleMark({ title }: { title: string }) {
  const parts = title.split(/\s*&\s*/).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return <>{title}</>;
  return (
    <>
      {parts[0]} &{" "}
      <span className="display-em">{parts.slice(1).join(" & ")}</span>
    </>
  );
}
