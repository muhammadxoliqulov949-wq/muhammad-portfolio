"use client";

import { useRef, useState, type FormEvent } from "react";
import Icon from "./ui/Icon";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Aloqa formasi.
 *
 * Audit tuzatishlari (P1-12, P0-4):
 *  - har maydonda inline xato, `aria-invalid` va `aria-describedby`;
 *  - umumiy holat `role="status"` / `role="alert"` bilan e'lon qilinadi;
 *  - xatoda fokus birinchi yaroqsiz maydonga o'tadi;
 *  - yuborish paytida `aria-busy` + takroriy yuborish bloklandi;
 *  - botlarga qarshi honeypot (ko'rinmaydi, fokussiz).
 */
export default function ContactForm({ successNote }: { successNote?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [general, setGeneral] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
    };

    const next: Errors = {};
    if (payload.name.length < 2) next.name = "Ismingizni yozing";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(payload.email)) next.email = "Email manzili noto'g'ri";
    if (payload.message.length < 12) next.message = "Kamida 12 belgi — loyihangiz haqida qisqacha yozing";
    setErrors(next);

    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setGeneral("");
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setGeneral(
          typeof data.error === "string"
            ? data.error
            : "Yuborib bo'lmadi. Bir necha daqiqadan so'ng qayta urinib ko'ring."
        );
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setGeneral("Internet aloqasi uzildi. Telegram orqali ham yozaverishingiz mumkin.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="grid size-11 place-items-center rounded-full bg-success-soft text-success">
          <Icon name="check" size={20} />
        </span>
        <div>
          <h3 className="display text-title font-semibold">Xabaringiz qabul qilindi</h3>
          <p className="mt-1.5 text-body text-ink-2">{successNote ?? "Rahmat! Tez orada javob beraman."}</p>
        </div>
        <button type="button" className="btn btn--sm" onClick={() => setStatus("idle")}>
          <Icon name="pencil" size={14} />
          Yana xabar yuborish
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="stack gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="cf-name"
          label="Ismingiz"
          hint="Kimligini bilish foydali"
          error={errors.name}
          name="name"
          autoComplete="name"
          maxLength={120}
          placeholder="Aziz Karimov"
        />
        <Field
          id="cf-email"
          label="Email"
          hint="Javob shu yerga boradi"
          error={errors.email}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={200}
          placeholder="aziz@company.uz"
        />
      </div>

      <Field
        id="cf-message"
        label="Loyihangiz"
        hint="Maqsad, muddat va taxminiy byudjet — yetarli"
        error={errors.message}
        name="message"
        as="textarea"
        rows={6}
        maxLength={4000}
        placeholder="Nima qilish kerak, qachongacha kerak va hozirgi holat qanday?"
      />

      {/* Honeypot: botlar to'ldiradi, odam ko'rmaydi */}
      <div aria-hidden className="absolute h-0 w-0 -left-[9999px] overflow-hidden">
        <label htmlFor="cf-website">Bu maydonni to&#39;ldirmang</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          className="btn btn--accent btn--lg"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <span className="spin" aria-hidden>
                <Icon name="zap" size={15} />
              </span>
              Yuborilmoqda…
            </>
          ) : (
            <>
              Xabarni yuborish
              <Icon name="arrow-right" size={15} />
            </>
          )}
        </button>
        <p className="text-small text-ink-3">Ma&apos;lumotlaringiz faqat javob berish uchun ishlatiladi.</p>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status === "loading" ? "Xabar yuborilmoqda" : ""}
      </p>
      {general ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-2 border border-danger/40 bg-danger-soft px-4 py-3 text-small text-danger"
        >
          <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
          {general}
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  as?: "input" | "textarea";
  type?: "text" | "email";
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email";
};

/** Label ↔ input bog'langan, xato holati ARIA bilan bog'langan maydon. */
function Field({
  id,
  name,
  label,
  hint,
  error,
  as = "input",
  type = "text",
  rows,
  maxLength,
  placeholder,
  autoComplete,
  inputMode,
}: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  const shared = {
    id,
    name,
    maxLength,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: "input",
    required: true,
  };

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea {...shared} rows={rows ?? 5} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} inputMode={inputMode} />
      )}
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
