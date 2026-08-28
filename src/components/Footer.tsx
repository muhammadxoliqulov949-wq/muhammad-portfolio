type Props = {
  fullName: string;
  initials: string;
  email: string;
  telegram: string;
  github: string;
  linkedin: string;
  instagram: string;
};

export default function Footer({ fullName, initials, email, telegram, github, linkedin, instagram }: Props) {
  const socials = [
    { href: github, label: "GitHub", icon: "🐙" },
    { href: linkedin, label: "LinkedIn", icon: "💼" },
    { href: instagram, label: "Instagram", icon: "📸" },
  ].filter((s) => s.href);

  return (
    <footer className="relative mt-16 border-t border-[var(--border)] bg-[rgba(4,7,18,0.6)] backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,183,255,0.5)] to-transparent" aria-hidden />
      <div className="pf-container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg grid place-items-center font-display font-extrabold text-sm text-white bg-[var(--grad)]">
            {initials}
          </span>
          <span className="font-display font-bold">
            {fullName}
            <span className="text-[var(--blue2)]">.</span>
          </span>
        </a>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 pf-muted text-sm">
          <a href="#skills" className="hover:text-[var(--text)] transition-colors">Ko&apos;nikmalar</a>
          <a href="#services" className="hover:text-[var(--text)] transition-colors">Xizmatlar</a>
          <a href="#projects" className="hover:text-[var(--text)] transition-colors">Loyihalar</a>
          <a href="#contact" className="hover:text-[var(--text)] transition-colors">Aloqa</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={telegram.startsWith("@") ? `https://t.me/${telegram.slice(1)}` : telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--border)] bg-[rgba(255,255,255,0.04)] pf-muted hover:text-[var(--blue2)] hover:border-[rgba(0,183,255,0.45)] transition-all"
          >
            ✈️
          </a>
          <a
            href={`mailto:${email}`}
            aria-label="Email"
            className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--border)] bg-[rgba(255,255,255,0.04)] pf-muted hover:text-[var(--blue2)] hover:border-[rgba(0,183,255,0.45)] transition-all"
          >
            ✉️
          </a>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--border)] bg-[rgba(255,255,255,0.04)] pf-muted hover:text-[var(--blue2)] hover:border-[rgba(0,183,255,0.45)] transition-all"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center pf-muted text-sm">
        © {new Date().getFullYear()} {fullName} — Portfolio sayti. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}
