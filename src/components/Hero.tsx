import Image from "next/image";
import Icon from "./ui/Icon";
import PortraitSlot from "./PortraitSlot";
import CopyButton from "./ui/CopyButton";
import Device from "./ui/Device";
import {
  portraitOf,
  rolesOf,
  safeHref,
  sectionHref,
  socialsOf,
  type Profile,
  type Project,
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

function hostOf(link: string | null | undefined): string | null {
  const href = safeHref(link);
  if (!href) return null;
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Hero — ism + kasb + ikkita CTA.
 * Portret bo'lmasa MX harfi o'rniga haqiqiy mahsulot (IELTS.mock) chiqadi.
 */
type Props = { profile: Profile; study?: string; locale?: Locale; featured?: Project };

export default function Hero({ profile: p, study, locale = "uz", featured }: Props) {
  const roles = txEach(locale, rolesOf(p));
  const title = roles[0] || p.title || "Student & AI Developer";
  const extras = roles.slice(1);
  const socials = socialsOf(p, locale);
  const resume = safeHref(p.resumeUrl);
  const portrait = portraitOf(p);
  const names = (p.fullName || "Muhammad").trim().split(/\s+/).filter(Boolean);
  const firstName = names[0] || "Muhammad";
  const lastName = names.slice(1).join(" ");
  const cover = featured ? safeHref(featured.image) : null;
  const demo = featured ? safeHref(featured.link) : null;
  const code = featured ? safeHref(featured.github) : null;

  const meta = [
    p.location ? { icon: "pin" as const, text: tx(locale, p.location) } : null,
    p.englishLevel ? { icon: "gauge" as const, text: `${t(locale, "hero.english")}: ${p.englishLevel}` } : null,
    study ? { icon: "sparkle" as const, text: study } : null,
  ].filter((x): x is { icon: "pin" | "gauge" | "sparkle"; text: string } => !!x);

  return (
    <section id="home" className="u-hero-lines relative overflow-clip pt-28 pb-[var(--section-y)] md:pt-36">
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

          <div className="reveal relative mx-auto w-full max-w-[28rem] lg:max-w-none lg:justify-self-end">
            {portrait ? (
              <figure className="hero-photo">
                <Image
                  src={portrait}
                  alt={`${p.fullName || "Muhammad Xoliqulov"} — ${t(locale, "hero.portrait")}`}
                  fill
                  priority
                  unoptimized={portrait.startsWith("/api/media/")}
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="hero-photo__img"
                />
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
            ) : featured ? (
              <div className="hero-product">
                <PortraitSlot current={portrait} initials={p.avatarInitials || p.fullName} />
                <Device label={hostOf(featured.link) || featured.title}>
                  <div className="relative aspect-16/10">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${featured.title} — ${t(locale, "work.cover")}`}
                        fill
                        priority
                        sizes="(max-width: 1024px) 90vw, 480px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-surface-2">
                        <span className="font-mono text-small text-ink-2">{featured.title}</span>
                      </div>
                    )}
                  </div>
                </Device>
                <div className="hero-product__bar">
                  <div className="min-w-0">
                    <p className="label label-accent mb-1">{t(locale, "work.featured")}</p>
                    <p className="truncate text-body font-semibold">{featured.title}</p>
                  </div>
                  <span className="flex shrink-0 flex-wrap gap-2">
                    {demo ? (
                      <a href={demo} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--sm">
                        {t(locale, "work.demo")}
                        <Icon name="external" size={13} />
                      </a>
                    ) : null}
                    {code ? (
                      <a href={code} target="_blank" rel="noopener noreferrer" className="btn btn--sm">
                        <Icon name="github" size={13} />
                        GitHub
                      </a>
                    ) : null}
                  </span>
                </div>
              </div>
            ) : (
              <figure className="hero-photo">
                <div className="hero-photo__mono" aria-hidden="true">
                  <span className="display text-display-l font-semibold tracking-tight">
                    {(p.avatarInitials || p.fullName || "M").trim().slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <PortraitSlot current={portrait} initials={p.avatarInitials || p.fullName} />
              </figure>
            )}
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
