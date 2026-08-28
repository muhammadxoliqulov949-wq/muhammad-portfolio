type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
};

export default function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {services.map((s) => (
        <div key={s.id} className="pf-card pf-card-hover p-6 group">
          <span className="w-14 h-14 grid place-items-center rounded-2xl text-2xl bg-gradient-to-br from-[rgba(30,107,255,0.18)] to-[rgba(0,183,255,0.1)] border border-[rgba(0,183,255,0.25)] mb-5 transition-transform duration-300 group-hover:scale-110">
            {s.icon}
          </span>
          <h3 className="font-display text-lg font-bold mb-2.5">{s.title}</h3>
          <p className="pf-muted text-sm leading-relaxed">{s.description}</p>
        </div>
      ))}
    </div>
  );
}
