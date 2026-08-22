"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <div className="pf-badge mb-4">Xatolik</div>
        <h1 className="text-[clamp(28px,5vw,44px)] font-bold mb-3">
          Nimadir <span className="text-[var(--blue2)]">noto&apos;g&apos;ri</span> ketdi
        </h1>
        <p className="pf-muted mb-8">Sahifani yuklashda kutilmagan xatolik yuz berdi.</p>
        <button onClick={() => reset()} className="pf-btn pf-btn-primary">
          Qayta urinib ko&apos;rish
        </button>
      </div>
    </div>
  );
}
