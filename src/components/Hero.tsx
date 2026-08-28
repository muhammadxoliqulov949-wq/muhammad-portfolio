"use client";

import { useEffect, useRef, useState } from "react";

type ProfileData = {
  fullName: string;
  title: string;
  role2: string;
  role3: string;
  badge: string;
  bio: string;
  avatarInitials: string;
  photoUrl: string;
  email: string;
  telegram: string;
  github: string;
  linkedin: string;
  instagram: string;
  location: string;
  resumeUrl: string;
  statProjects: string;
  statExperience: string;
  statAvailability: string;
};

const ROLES = ["Full-stack dasturchi", "Veb-saytlar yarataman", "Admin panellar quraman", "Botlar yozaman"];

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 grid place-items-center rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.04)] text-[var(--muted)] hover:text-[var(--blue2)] hover:border-[rgba(0,183,255,0.45)] hover:-translate-y-0.5 transition-all"
    >
      {children}
    </a>
  );
}

function CountUp({ value }: { value: string }) {
  const [display, setDisplay] = useState(() => {
    const match = value.match(/^(\d+)(.*)$/);
    return match ? "0" : value;
  });
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = Number(match[1]);
    const suffix = match[2];

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const duration = 1300;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(`${Math.round(target * eased)}${suffix}`);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export default function Hero({ data }: { data: ProfileData }) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const initials = data.avatarInitials || "MX";

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Dekorativ orblar va to'r */}
      <div className="absolute inset-0 pf-grid-bg" aria-hidden />
      <div className="pf-orb w-[480px] h-[480px] -top-40 -right-32" style={{ background: "rgba(30,107,255,0.22)" }} aria-hidden />
      <div className="pf-orb w-[380px] h-[380px] top-1/3 -left-40" style={{ background: "rgba(0,183,255,0.13)" }} aria-hidden />

      <div className="pf-container relative z-10 pt-36 pb-10 md:pt-44 md:pb-6">
        <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
          {/* Chap taraf */}
          <div>
            <span className="pf-badge mb-6">{data.badge}</span>

            <h1 className="pf-title text-[clamp(38px,6.4vw,68px)] mb-5">
              Salom, men{" "}
              <span className="pf-grad-text">{data.fullName}</span>.
            </h1>

            <p className="font-display text-xl md:text-2xl font-semibold mb-5 min-h-[2.2rem]">
              <span className="text-white">{ROLES[roleIndex]}</span>
              <span className="pf-caret" aria-hidden />
            </p>

            <p className="pf-muted text-base md:text-lg max-w-xl mb-8">{data.bio}</p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a href="#projects" className="pf-btn pf-btn-primary">
                Loyihalarni ko&apos;rish
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </a>
              <a href="#contact" className="pf-btn">
                Bog&apos;lanish
              </a>
              {data.resumeUrl ? (
                <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" className="pf-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v12" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M4 19h16" />
                  </svg>
                  CV yuklab olish
                </a>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <SocialLink href={data.github} label="GitHub">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
              </SocialLink>
              <SocialLink href={data.linkedin} label="LinkedIn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
              </SocialLink>
              <SocialLink href={data.instagram} label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </SocialLink>
              <SocialLink href={data.telegram.startsWith("@") ? `https://t.me/${data.telegram.slice(1)}` : data.telegram} label="Telegram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.94 4.35a1.5 1.5 0 0 0-1.7-.57L2.8 10.02c-1.07.42-1.02 1.95.08 2.29l4.55 1.4 1.75 5.5c.3.94 1.5 1.16 2.12.4l2.54-3.1 4.36 3.2c.83.61 2.02.19 2.2-.78l2.27-13.26a1.5 1.5 0 0 0-.73-1.32zM8.98 12.93l9.07-5.68-7.6 6.98-.28 3.52-1.19-4.82z" />
                </svg>
              </SocialLink>
              <span className="pf-muted text-sm hidden sm:flex items-center gap-2 ml-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {data.location}
              </span>
            </div>
          </div>

          {/* O'ng taraf — avatar */}
          <div className="relative flex justify-center md:justify-end">
            <div className="pf-avatar-ring relative w-[280px] h-[320px] sm:w-[320px] sm:h-[370px]">
              <div className="absolute inset-0 rounded-[26px] overflow-hidden bg-[#0a1128] border border-[rgba(255,255,255,0.1)]">
                {data.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.photoUrl} alt={data.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <span className="font-display font-extrabold text-[110px] text-white/90 tracking-tight">
                      {initials}
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#050816] to-transparent" aria-hidden />
              </div>

              {/* Suzuvchi chiplar */}
              <div
                className="absolute -left-6 sm:-left-10 top-8 pf-card px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
                style={{ animation: "float-slow 5s ease-in-out infinite" }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Doim aloqada
              </div>
              <div
                className="absolute -right-3 sm:-right-8 bottom-10 pf-card px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
                style={{ animation: "float-slow 6s ease-in-out 1s infinite" }}
              >
                <span className="text-base">⚡</span> Tez va sifatli
              </div>
            </div>
          </div>
        </div>

        {/* Statistika bandi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 md:mt-20">
          {[
            { value: data.statProjects, label: "Bajarilgan loyihalar" },
            { value: data.statExperience, label: "Ish tajribasi" },
            { value: data.statAvailability, label: "Mavjudlik" },
          ].map((s) => (
            <div key={s.label} className="pf-card pf-card-hover p-5 text-center sm:text-left">
              <div className="font-display text-3xl md:text-4xl font-bold pf-grad-text">
                <CountUp value={s.value} />
              </div>
              <p className="pf-muted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
