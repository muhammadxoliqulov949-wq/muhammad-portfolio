import Image from "next/image";
import Icon from "./ui/Icon";
import Rotator from "./Rotator";
import CopyButton from "./ui/CopyButton";
import { rolesOf, safeHref, socialsOf, telegramHref, type Profile } from "@/lib/content";

const SOCIAL_ICON = {
  github: "github",
  linkedin: "linkedin",
  instagram: "instagram",
  telegram: "telegram",
  email: "mail",
} as const;

/**
 * Hero — birinchi ekran.
 *
 * Audit tuzatishlari:
 *  - "Hi, I'm X" o'rniga qiymat taklifi (2026 portfolio konvensiyasi);
 *  - kasb satri DB'dan (P0-1);
 *  - cheksiz suzuvchi chip'lar, aylanuvchi konus-gradient va blinking kursor
 *    olib tashlandi — harakatlar funksional;
 *  - avatar `next/image` bilan: LCP + CLS (P1-13);
 *  - statistika 3 ta bir xil karta o'rniga "ledger" qatori (ritm uchun).
 */
export default function Hero({ profile: p }: { profile: Profile }) {
  const roles = rolesOf(p);
  const socials = socialsOf(p);
  const photo = safeHref(p.photoUrl);
  const resume = safeHref(p.resumeUrl);
  const stats = [
    { label: "Yetkazilgan loyihalar", value: p.statProjects },
    { label: "Amaliyot tajribasi", value: p.statExperience },
    { label: "Hozirgi bandlik", value: p.statAvailability },
  ].filter((s) => s.value);

  const meta = [
    p.location ? { icon: "pin" as const, text: p.location } : null,
    p.sinceYear ? { icon: "clock" as const, text: `${p.sinceYear}-yildan amaliyotda` } : null,
    p.responseTime ? { icon: "zap" as const, text: p.responseTime } : null,
  ].filter((x): x is { icon: "pin" | "clock" | "zap"; text: string } => !!x);

  return (
    <section id="home" className="u-hero-lines relative overflow-clip pt-32 pb-[var(--section-y)] md:pt-40">
      <div className="u-container">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="reveal">
            {p.badge ? (
              <p className="label mb-7 flex flex-wrap items-center gap-2.5">
                <span className="dot" aria-hidden />
                <span className="label-accent">{p.badge}</span>
              </p>
            ) : null}

            <h1 className="display text-display-xl">
              G&apos;oyani <span className="display-em">ishlaydigan</span> mahsulotga
              aylantiraman.
            </h1>

            {roles.length > 0 ? (
              <Rotator
                items={roles}
                className="mt-7 flex h-7 font-mono text-small uppercase tracking-[0.12em] text-ink-2"
              />
            ) : null}

            {p.bio ? <p className="mt-6 max-w-xl text-lead text-ink-2">{p.bio}</p> : null}

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              <a href="#work" className="btn btn--accent btn--lg">
                Ishlarni ko&apos;rish
                <Icon name="arrow-right" size={16} />
              </a>
              <a href="#contact" className="btn btn--lg">
                <Icon name="mail" size={16} />
                Bog&apos;lanish
              </a>
              {resume ? (
                <a href={resume} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">
                  <Icon name="download" size={16} />
                  CV (PDF)
                </a>
              ) : null}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target={s.key === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="icon-btn"
                >
                  <Icon name={SOCIAL_ICON[s.key]} size={17} />
                </a>
              ))}
              {p.email ? <CopyButton value={p.email} label="Emailni nusxa olish" /> : null}
              {p.telegram ? <CopyButton value={p.telegram.replace("@", "")} label="Telegramni nusxa olish" /> : null}
            </div>
          </div>

          {/* Portret */}
          <div className="reveal relative mx-auto w-full max-w-[380px] lg:max-w-none">
            <div className="card relative overflow-hidden !rounded-4 p-0">
              <div className="relative aspect-[4/5] w-full bg-surface-2">
                {photo ? (
                  <Image
                    src={photo}
                    alt={p.fullName ? `${p.fullName} portreti` : "Portret"}
                    fill
                    priority
                    sizes="(min-width: 64rem) 34vw, 88vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[radial-gradient(120%_100%_at_20%_0%,var(--c-accent-soft),transparent_60%)]">
                    <span className="display text-[clamp(5rem,14vw,9rem)] leading-none text-ink-1">
                      {p.avatarInitials || (p.fullName || "P").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line-1 px-4 py-3">
                <span className="label">{p.fullName || "Portfolio"}</span>
                {telegramHref(p.telegram) ? (
                  <a
                    href={telegramHref(p.telegram) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-small"
                  >
                    {p.telegram}
                    <Icon name="arrow-up-right" size={13} />
                  </a>
                ) : null}
              </div>
            </div>

            {stats.length > 0 ? (
              <dl className="hairline-x card card--flat mt-3 !rounded-3 px-4 py-1">
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
