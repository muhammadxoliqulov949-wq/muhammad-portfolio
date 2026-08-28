type ExperienceItem = {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  order: number;
};

export default function Experience({ items }: { items: ExperienceItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="pf-timeline pl-10 space-y-8">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <span className="pf-dot" aria-hidden />
          <div className="pf-card pf-card-hover p-6">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h3 className="font-display text-lg font-bold">{item.role}</h3>
              <span className="pf-chip">{item.company}</span>
            </div>
            <p className="text-sm font-semibold text-[var(--blue3)]/80 mb-3">{item.period}</p>
            <p className="pf-muted text-sm leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
