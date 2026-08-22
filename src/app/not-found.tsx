import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <div className="pf-badge mb-4">404</div>
        <h1 className="text-[clamp(32px,6vw,56px)] font-bold mb-3">
          Sahifa <span className="text-[var(--blue2)]">topilmadi</span>
        </h1>
        <p className="pf-muted mb-8">
          Siz izlagan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
        </p>
        <Link href="/" className="pf-btn pf-btn-primary">
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
