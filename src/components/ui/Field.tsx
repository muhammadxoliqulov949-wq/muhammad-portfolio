"use client";

import Icon from "./Icon";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "url" | "select" | "email";

export type FieldConfig = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  rows?: number;
  /** Karta kengligi (2 ustunli formada to'liq qator) */
  full?: boolean;
  options?: { value: string | number; label: string }[];
};

type Props = FieldConfig & {
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  error?: string;
  disabled?: boolean;
  idSuffix?: string;
};

/**
 * Forma maydoni — admin va sayt formalari uchun yagona komponent.
 *
 * Audit tuzatishlari (P0-4 / P2-19):
 *  - label `htmlFor` bilan inputga bog'langan (avval admin'da 20 ta label
 *    alohida turar, bosilganda fokusga o'tmasdi);
 *  - xato `aria-invalid` + `aria-describedby` bilan bog'lanadi;
 *  - `url` turida jonli preview (rasm/manzil) ko'rsatiladi;
 *  - barcha inputlar ≥44px balandlikda (WCAG 2.5.8).
 */
export default function Field({
  name,
  label,
  type = "text",
  required,
  hint,
  placeholder,
  min,
  max,
  rows,
  value,
  onChange,
  error,
  disabled,
  idSuffix = "",
  options,
}: Props) {
  const id = `f-${name}${idSuffix}`;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;

  if (type === "checkbox") {
    return (
      <label
        htmlFor={id}
        className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-2 border border-line-1 bg-canvas px-3.5 py-2.5 transition-colors hover:border-line-2"
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="size-[18px] accent-[var(--c-accent)]"
        />
        <span className="text-body font-medium">{label}</span>
        {hint ? <span className="text-small text-ink-3">— {hint}</span> : null}
      </label>
    );
  }

  const shared = {
    id,
    name,
    value: type === "number" ? String(value ?? "") : String(value ?? ""),
    placeholder,
    disabled,
    required,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    className: "input",
  };

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </label>

      {type === "textarea" ? (
        <textarea {...shared} rows={rows ?? 4} onChange={(e) => onChange(e.target.value)} />
      ) : type === "select" ? (
        <select {...shared} onChange={(e) => onChange(e.target.value)}>
          {(options ?? []).map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : type === "number" ? (
        <input
          {...shared}
          type="number"
          min={min}
          max={max}
          inputMode="numeric"
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      ) : (
        <input
          {...shared}
          type={type === "email" ? "email" : "text"}
          inputMode={type === "url" || type === "email" ? (type === "email" ? "email" : "url") : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {type === "url" && String(value ?? "").match(/^https?:\/\//) && /\.(png|jpe?g|webp|avif|gif)(\?.*)?$/i.test(String(value)) ? (
        <span className="mt-1 flex items-center gap-2 text-small text-ink-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={String(value)}
            alt=""
            className="h-9 w-14 rounded-1 border border-line-1 object-cover"
            loading="lazy"
          />
          Preview
        </span>
      ) : null}

      {hint ? (
        <span id={`${id}-hint`} className="text-small text-ink-3">
          {hint}
        </span>
      ) : null}

      {error ? (
        <span id={`${id}-err`} className="field__error">
          <Icon name="alert" size={13} />
          {error}
        </span>
      ) : null}
    </div>
  );
}
