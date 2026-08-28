type Props = {
  skills: { name: string }[];
};

export default function Marquee({ skills }: Props) {
  if (skills.length === 0) return null;

  const names = [...skills.map((s) => s.name), ...skills.map((s) => s.name)];

  return (
    <div className="relative py-10 pf-marquee-mask overflow-hidden border-y border-[var(--border)] bg-[rgba(8,12,26,0.5)]">
      <div className="pf-marquee-wrap">
        <div className="pf-marquee items-center gap-10">
          {names.map((name, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-lg font-semibold pf-muted">{name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue2)]/70" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
