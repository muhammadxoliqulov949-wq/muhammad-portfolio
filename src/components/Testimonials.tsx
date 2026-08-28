type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatarInitials: string;
  order: number;
};

function Stars() {
  return (
    <div className="flex gap-1 text-amber-400 mb-4" aria-label="5 yulduz">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.26 6.86.8-5.07 4.68 1.35 6.76L12 17.3l-6.04 3.2 1.35-6.76L2.24 9.06l6.86-.8L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((t) => (
        <figure key={t.id} className="pf-card pf-card-hover p-6 flex flex-col">
          <span className="font-display text-5xl leading-none pf-grad-text mb-2" aria-hidden>
            &ldquo;
          </span>
          <Stars />
          <blockquote className="pf-muted text-[15px] leading-relaxed flex-1">{t.text}</blockquote>
          <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--border)]">
            <span className="w-11 h-11 grid place-items-center rounded-full font-display font-bold text-sm bg-gradient-to-br from-[var(--blue)] to-[var(--blue2)] text-white">
              {t.avatarInitials || t.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="pf-muted text-xs">{t.role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
