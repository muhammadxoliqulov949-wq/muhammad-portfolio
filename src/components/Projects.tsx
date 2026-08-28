type Project = {
  id: number;
  title: string;
  description: string;
  link: string | null;
  github: string | null;
  image: string | null;
  tech: string | null;
  featured: boolean;
  order: number;
  published: boolean;
};

function TechChips({ tech }: { tech: string }) {
  if (!tech) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (
          <span key={t} className="pf-chip">
            {t}
          </span>
        ))}
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0d1a3d] via-[#123f82] to-[#00b7ff] grid place-items-center relative overflow-hidden">
      <div className="pf-grid-bg absolute inset-0 opacity-60" aria-hidden />
      <span className="relative font-display font-extrabold text-6xl text-white/90 tracking-tight">
        {project.title.slice(0, 1)}
      </span>
    </div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="pf-card p-8 text-center">
        <p className="pf-muted">Hozircha loyihalar qo&apos;shilmagan.</p>
      </div>
    );
  }

  const [featured, ...rest] = projects;

  return (
    <div className="space-y-8">
      {/* Featured loyiha */}
      <a
        href={featured.link || "#projects"}
        target={featured.link ? "_blank" : undefined}
        rel={featured.link ? "noopener noreferrer" : undefined}
        className="pf-card pf-card-hover group overflow-hidden grid lg:grid-cols-2 !p-0"
      >
        <div className="relative h-56 lg:h-full min-h-[220px] overflow-hidden">
          <ProjectVisual project={featured} />
          <span className="absolute top-4 left-4 pf-badge !bg-[rgba(5,8,22,0.7)] backdrop-blur">
            ⭐ Asosiy loyiha
          </span>
        </div>
        <div className="p-7 lg:p-9 flex flex-col justify-center">
          <h3 className="font-display text-2xl md:text-[28px] font-bold mb-3 group-hover:text-[var(--blue2)] transition-colors">
            {featured.title}
          </h3>
          <p className="pf-muted">{featured.description}</p>
          <TechChips tech={featured.tech ?? ""} />
          <div className="flex gap-4 mt-6">
            {featured.link ? (
              <span className="inline-flex items-center gap-2 font-semibold text-[var(--blue2)]">
                Demoni ko&apos;rish
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </span>
            ) : null}
            {featured.github ? (
              <span className="inline-flex items-center gap-2 font-semibold pf-muted hover:text-[var(--text)]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
                Kod
              </span>
            ) : null}
          </div>
        </div>
      </a>

      {/* Qolgan loyihalar */}
      {rest.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rest.map((p) => (
            <div key={p.id} className="pf-card pf-card-hover group overflow-hidden flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <ProjectVisual project={p} />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-lg font-bold mb-2 group-hover:text-[var(--blue2)] transition-colors">
                  {p.title}
                </h3>
                <p className="pf-muted text-sm flex-1">{p.description}</p>
                <TechChips tech={p.tech ?? ""} />
                <div className="flex gap-5 mt-5 pt-4 border-t border-[var(--border)]">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--blue2)] hover:underline"
                    >
                      Demo
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" />
                        <path d="M9 7h8v8" />
                      </svg>
                    </a>
                  ) : null}
                  {p.github ? (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold pf-muted hover:text-[var(--text)]"
                    >
                      Kod
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
