import Icon, { type IconName } from "./Icon";

type Props = {
  /** "01" kabi raqam — editural indeks uslubini beradi */
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** O'ng tarafdagi amallar (masalan "Barchasi →") */
  action?: React.ReactNode;
  id?: string;
  className?: string;
};

/**
 * Bo'lim sarlavhasi: raqam + mono leybel + Fraunces sarlavha + lead matn.
 * Barcha bo'limlar bitta shablonni ishlatadi — vizual ritm shundan keladi.
 */
export default function SectionHead({ index, eyebrow, title, lead, action, className = "" }: Props) {
  return (
    <header className={`section-head mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14 ${className}`}>
      <div className="relative max-w-2xl">
        {index ? (
          <span className="section-head__index u-num" aria-hidden>
            {index}
          </span>
        ) : null}
        <div className="label mb-4 flex items-center gap-3">
          {index ? <span className="text-ink-3 u-num">{index}</span> : null}
          <span className="h-px w-8 bg-line-2" aria-hidden />
          <span className="label-accent">{eyebrow}</span>
        </div>
        <h2 className="display text-display-l">{title}</h2>
        {lead ? <p className="mt-5 max-w-xl text-lead text-ink-2">{lead}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-3">{action}</div> : null}
    </header>
  );
}

/** Bo'lim qobig'i: bir xil vertikal ritm + cheklangan kenglik. */
export function Section({
  id,
  children,
  sunken = false,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  sunken?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`u-section u-cv relative ${sunken ? "u-sunken border-y border-line-1" : ""} ${className}`}
    >
      <div className="u-container">{children}</div>
    </section>
  );
}

/** Kichik "meta" qatori (yil / rol / natija kabi) — kartalar uchun. */
export function MetaRow({ items }: { items: { label: string; value: string; icon?: IconName }[] }) {
  const visible = items.filter((i) => i.value);
  if (visible.length === 0) return null;
  return (
    <dl className="flex flex-wrap gap-x-7 gap-y-3">
      {visible.map((i) => (
        <div key={i.label} className="min-w-0">
          <dt className="label mb-1 flex items-center gap-1.5">
            {i.icon ? <Icon name={i.icon} size={12} /> : null}
            {i.label}
          </dt>
          <dd className="text-body font-semibold">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
