"use client";

import { useRef, useState, type FormEvent } from "react";
import Icon from "./ui/Icon";
import { t, type Locale } from "@/lib/i18n-core";

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
export default function ContactForm({
  successNote,
  locale = "uz",
}: {
  successNote?: string;
  locale?: Locale;
}) {
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
    if (payload.name.length < 2) next.name = t(locale, "form.nameErr");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(payload.email)) next.email = t(locale, "form.emailErr");
    if (payload.message.length < 12) next.message = t(locale, "form.messageErr");
    setErrors(next);

    if (Object.keys(next).length > 0) {
      const firstId = next.name ? "cf-name" : next.email ? "cf-email" : "cf-message";
      requestAnimationFrame(() => document.getElementById(firstId)?.focus());
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
        setGeneral(typeof data.error === "string" ? data.error : t(locale, "form.fail"));
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setGeneral(t(locale, "form.offline"));
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
          <h3 className="display text-title font-semibold">{t(locale, "form.okTitle")}</h3>
          <p className="mt-1.5 text-body text-ink-2">{successNote ?? t(locale, "contact.success")}</p>
        </div>
        <button type="button" className="btn btn--sm" onClick={() => setStatus("idle")}>
          <Icon name="pencil" size={14} />
          {t(locale, "form.again")}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="stack gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="cf-name"
          label={t(locale, "form.name")}
          hint={t(locale, "form.nameHint")}
          error={errors.name}
          name="name"
          autoComplete="name"
          maxLength={120}
          placeholder={t(locale, "form.phName")}
        />
        <Field
          id="cf-email"
          label={t(locale, "form.email")}
          hint={t(locale, "form.emailHint")}
          error={errors.email}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={200}
          placeholder={t(locale, "form.phEmail")}
        />
      </div>

      <Field
        id="cf-message"
        label={t(locale, "form.message")}
        hint={t(locale, "form.messageHint")}
        error={errors.message}
        name="message"
        as="textarea"
        rows={6}
        maxLength={4000}
        placeholder={t(locale, "form.phMsg")}
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
              {t(locale, "form.sending")}
            </>
          ) : (
            <>
              {t(locale, "form.send")}
              <Icon name="arrow-right" size={15} />
            </>
          )}
        </button>
        <p className="text-small text-ink-3">{t(locale, "form.privacy")}</p>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status === "loading" ? t(locale, "form.sending") : ""}
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
