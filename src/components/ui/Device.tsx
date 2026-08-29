import type { ReactNode } from "react";

/** Brauzer-ramka — loyiha ekranini mahsulot sifatida ko'rsatadi, harf-monogram emas. */
export default function Device({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label?: string | null;
  className?: string;
}) {
  return (
    <div className={`device ${className}`.trim()}>
      <div className="device__bar" aria-hidden>
        <span className="device__dots">
          <i />
          <i />
          <i />
        </span>
        {label ? <span className="device__url">{label}</span> : null}
      </div>
      <div className="device__screen">{children}</div>
    </div>
  );
}
