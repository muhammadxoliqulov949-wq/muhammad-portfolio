import Icon from "./ui/Icon";
import BackToTop from "./BackToTop";
import { sectionHref, socialsOf, type Profile } from "@/lib/content";
import { t, tx, type Locale } from "@/lib/i18n-core";

type Props = {
  profile: Profile;
  links: { id: string; label: string }[];
  locale?: Locale;
};

const ICON = {
  github: "github",
  linkedin: "linkedin",
  instagram: "instagram",
  telegram: "telegram",
  email: "mail",
  phone: "phone",
} as const;

export default function Footer({ profile: p, links, locale = "uz" }: Props) {
  const socials = socialsOf(p, locale);

  return (
    <footer className="border-t border-line-1 bg-canvas-sunken/50">
      <div className="u-container py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-start">
          <div>
            <p className="display text-display-m">
              {p.fullName ? `${p.fullName}.` : "Portfolio."}{" "}
              <span className="display-em">{t(locale, "footer.more")}</span>
            </p>
            {p.title ? <p className="mt-2 text-small text-ink-2">{tx(locale, p.title)}</p> : null}
          </div>

          <nav aria-label={t(locale, "nav.sections")} className="grid grid-cols-2 gap-x-6 gap-y-1.5 md:justify-items-end">
            {links.map((l) => (
              <a key={l.id} href={sectionHref(l.id)} className="u-link-quiet justify-self-start py-1 text-small text-ink-2 hover:text-ink-1 md:justify-self-end">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end md:gap-2.5">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target={s.key === "email" || s.key === "phone" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="icon-btn"
              >
                <Icon name={ICON[s.key]} size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line-1 pt-6">
          <p className="text-small text-ink-3">
            © {new Date().getFullYear()} {p.fullName || "Portfolio"} · {t(locale, "footer.made")}
          </p>
          <BackToTop locale={locale} />
        </div>
      </div>
    </footer>
  );
}
