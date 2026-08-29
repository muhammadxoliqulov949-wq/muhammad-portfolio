import Image from "next/image";
import Icon from "./ui/Icon";
import Rotator from "./Rotator";
import CopyButton from "./ui/CopyButton";
import {
  listFrom,
  phoneHref,
  portraitOf,
  rolesOf,
  safeHref,
  socialsOf,
  type Profile,
} from "@/lib/content";

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
type Props = { profile: Profile; study?: string };

export default function Hero({ profile: p, study }: Props) {
  const roles = rolesOf(p);
  const socials = socialsOf(p);
  const steps = listFrom(p.workflow);
  const resume = safeHref(p.resumeUrl);
  const portrait = portraitOf(p);

  const stats = [
    { label: "Amaliy tajriba", value: p.statExperience },
    { label: "Mijozlar", value: p.statAvailability },
    { label: "Saytlar", value: p.statProjects },
  ].filter((s) => s.value);

  const meta = [
    p.location ? { icon: "pin" as const, text: p.location } : null,
    p.englishLevel ? { icon: "gauge" as const, text: `Ingliz tili: ${p.englishLevel}` } : null,
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
                <span className="label-accent">{p.badge}</span>
              </p>
            ) : null}

            <h1 className="display text-display-xl leading-[0.94]">
              Student &amp;{" "}
              <span className="display-em">AI Developer</span>
            </h1>

            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display text-[19px] font-semibold">{p.fullName || "Portfolio"}</span>
              {roles.length > 1 ? (
                <Rotator
                  items={roles.slice(1)}
                  className="flex h-6 font-mono text-micro uppercase tracking-[0.14em] text-ink-3"
                />
              ) : null}
            </p>

            {p.bio ? <p className="mt-6 max-w-xl text-lead text-ink-2">{p.bio}</p> : null}

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              <a href="#contact" className="btn btn--accent btn--lg">
                Keling, birga ishlaymiz
                <Icon name="arrow-right" size={16} />
              </a>
              <a href="#work" className="btn btn--lg">
                <Icon name="layers" size={16} />
                Loyihalarni ko&apos;rish
              </a>
              {resume ? (
                <a href={resume} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">
                  <Icon name="download" size={16} />
                  CV (PDF)
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
              {p.email ? <CopyButton value={p.email} label="Emailni nusxa olish" /> : null}
              {p.telegram ? (
                <CopyButton value={p.telegram.replace("@", "")} label="Telegramni nusxa olish" />
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
                  alt={`${p.fullName || "Muhammad Xoliqulov"} — portret`}
                  fill
                  priority
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
              <figcaption className="hero-photo__caption">
                <span className="text-body font-semibold">{p.fullName || "Portfolio"}</span>
                {p.location ? <span className="flex items-center gap-1.5 text-small text-ink-2">
                  <Icon name="pin" size={12} className="text-ink-3" />
                  {p.location}
                </span> : null}
              </figcaption>
            </figure>

            <div className="hero-panels" aria-hidden="true">
              <div className="hero-panel hero-panel--back">
                <p className="label mb-2">AI yordamchi</p>
                <p className="text-small text-ink-2">prompt · kod · izoh</p>
              </div>
              <div className="hero-panel hero-panel--mid">
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
                  <p className="text-small text-ink-3">Ish oqimi admin panelda sozlanadi.</p>
                )}
              </div>
              <div className="hero-panel hero-panel--front">
                <span className="chip">
                  <Icon name="rocket" size={12} />
                  Vercel&apos;da jonli
                </span>
                <a
                  href={safeHref(p.github) ?? "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-small"
                >
                  GitHub
                  <Icon name="arrow-up-right" size={13} />
                </a>
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
              Pastga suring
            </li>
          </ul>
        ) : null}
      </div>
    </section>
  );
}
