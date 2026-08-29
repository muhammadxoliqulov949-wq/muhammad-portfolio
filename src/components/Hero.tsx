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
 * Hero — birinchi ekran.
 *
 * Uslubiy qaror: sun'iy "I'm a passionate developer" kirish o'rniga
 * to'g'ridan-to'g'ri identitet (ism + kasb) va haqiqiy raqamlar.
 * O'ng tarafdagi suzuvchi panellar — uni aldashtiruvchi "3D grafika" emas,
 * uning haqiqiy ish oqimi (AI-assisted workflow) vizualizatsiyasi.
 */
type Props = { profile: Profile; study?: string; locale?: Locale };

export default function Hero({ profile: p, study, locale = "uz" }: Props) {
  const roles = txEach(locale, rolesOf(p));
  const socials = socialsOf(p);
  const steps = txEach(locale, listFrom(p.workflow));
  const resume = safeHref(p.resumeUrl);
  const portrait = portraitOf(p);

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
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="reveal">
            {p.badge ? (
              <p className="label mb-7 flex flex-wrap items-center gap-2.5">
                <span className="dot" aria-hidden />
                <span className="label-accent">{tx(locale, p.badge)}</span>
              </p>
            ) : null}

            <h1 className="display text-display-xl leading-[0.94]">
              {(p.fullName || "Muhammad").trim().split(/\s+/)[0]}
            </h1>

            <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold tracking-tight">
                <TitleMark title={p.title || roles[0] || "Student & AI Developer"} />
              </span>
              {roles.length > 1 ? (
                <Rotator
                  items={roles.slice(1)}
                  className="flex h-6 font-mono text-micro uppercase tracking-[0.14em] text-ink-3"
                />
              ) : null}
            </p>

            {p.bio ? <p className="mt-6 max-w-xl text-lead text-ink-2">{tx(locale, p.bio)}</p> : null}

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

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
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

          {/* Portret + ish oqimi panellari. Rasm DB'dan (`photoUrl`) yoki
              `public/media/portrait.*` faylidan olinadi; ikkalasi bo'lmasa
              monogram freym chiqadi — bo'sh/buzuq rasm ko'rsatilmaydi. */}
          <div className="reveal relative mx-auto w-full max-w-[440px] lg:max-w-none">
            <figure className="hero-photo">
              {portrait ? (
                <Image
                  src={portrait}
                  alt={`${p.fullName || "Muhammad Xoliqulov"} — ${t(locale, "hero.portrait")}`}
                  fill
                  priority
                  unoptimized={portrait.startsWith("/api/media/")}
                  sizes="(max-width: 1024px) 90vw, 440px"
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
                {p.location ? <span className="flex items-center gap-1.5 text-small text-ink-2">
                  <Icon name="pin" size={12} className="text-ink-3" />
                  {tx(locale, p.location)}
                </span> : null}
              </figcaption>
            </figure>

            <div className="hero-panels">
              <div className="hero-panel hero-panel--back" aria-hidden="true">
                <p className="label mb-2">{t(locale, "hero.ai")}</p>
                <p className="text-small text-ink-2">prompt · kod · izoh</p>
              </div>
              <div className="hero-panel hero-panel--mid" aria-hidden="true">
                <p className="label mb-3 flex items-center justify-between">
                  <span>muhammad / ielts.mock</span>
                  <span className="chip chip--accent !py-0.5 text-[10px]">PWA</span>
                </p>
                {steps.length > 0 ? (
                  <ol className="stack gap-2">
                    {steps.slice(0, 4).map((step, i) => (
                      <li key={step} className="flex items-start gap-2.5 text-small text-ink-2">
                        <span className="u-num mt-0.5 shrink-0 font-mono text-micro text-ink-3">0{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-small text-ink-3">{t(locale, "hero.workflowEmpty")}</p>
                )}
              </div>
              <div className="hero-panel hero-panel--front">
                <span className="chip" aria-hidden="true">
                  <Icon name="rocket" size={12} />
                  {t(locale, "hero.live")}
                </span>
                {safeHref(p.github) ? (
                  <a
                    href={safeHref(p.github) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-small"
                  >
                    GitHub
                    <Icon name="arrow-up-right" size={13} />
                  </a>
                ) : null}
              </div>
            </div>

            {stats.length > 0 ? (
              <dl className="hairline-x card card--flat mt-4 !rounded-3 px-4 py-1">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-small text-ink-2">{s.label}</dt>
                    <dd className="display u-num text-[19px] font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>

        {meta.length > 0 ? (
          <ul className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line-1 pt-6">
            {meta.map((m) => (
              <li key={m.text} className="flex items-center gap-2 text-small text-ink-2">
                <Icon name={m.icon} size={14} className="text-ink-3" />
                {m.text}
              </li>
            ))}
            {p.email ? (
              <li className="flex items-center gap-2 text-small text-ink-2">
                <Icon name="mail" size={14} className="text-ink-3" />
                <a href={`mailto:${p.email}`} className="link-underline">
                  {p.email}
                </a>
              </li>
            ) : null}
            {phoneHref(p.phone) ? (
              <li className="flex items-center gap-2 text-small text-ink-2">
                <Icon name="phone" size={14} className="text-ink-3" />
                <a href={phoneHref(p.phone) as string} className="link-underline">
                  {p.phone}
                </a>
              </li>
            ) : null}
            <li className="ml-auto hidden items-center gap-2 text-small text-ink-3 md:flex">
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

/** DB'dagi `title`ni H1 qiladi; `&` bo'lsa ikkinchi qism accent. Yangi matn yozilmaydi. */
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


