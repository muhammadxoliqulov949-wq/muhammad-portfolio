"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

/**
 * Admin login.
 *
 * Audit tuzatishlari: label↔input bog'lanishi, xato `role="alert"` bilan
 * e'lon qilinadi, parolni ko'rsatish tugmasi, urinishlar chegarasi haqida
 * aniq xabar va parolni tiklash yo'li (env orqali) ko'rsatilgan.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    const fe: { email?: string; password?: string } = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) fe.email = "Email manzilini to'g'ri kiriting";
    if (password.length < 6) fe.password = "Kamida 6 belgi";
    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) {
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Kirishda xatlik. Ko'p urinsangiz vaqtincha bloklanadi.");
        return;
      }
      router.replace("/admin/portrait");
      router.refresh();
    } catch {
      setError("Server bilan bog'lanib bo'lmadi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="u-container flex min-h-dvh items-center justify-center py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-2 bg-accent font-mono text-micro font-bold text-accent-ink">
            AD
          </span>
          <span className="display text-[15px] font-semibold">Admin panel</span>
        </Link>

        <div className="card p-6 md:p-8">
          <h1 className="display text-display-m">Kirish</h1>
          <p className="mt-2 text-small text-ink-2">
            Portretni o‘zingiz qo‘yasiz va istalgan payt almashtirasiz. Kirgach darhol rasm
            yuklash sahifasi ochiladi.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-7 stack gap-4">
            <div className="field">
              <label htmlFor="login-email" className="field__label">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                required
                className="input"
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={fieldErrors.email ? "login-email-err" : undefined}
                placeholder="admin@domain.uz"
              />
              {fieldErrors.email ? (
                <span id="login-email-err" className="field__error">
                  <Icon name="alert" size={13} />
                  {fieldErrors.email}
                </span>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="login-password" className="field__label">
                Parol
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="input pr-11"
                  aria-invalid={fieldErrors.password ? true : undefined}
                  aria-describedby={fieldErrors.password ? "login-password-err" : undefined}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-2 text-ink-3 transition-colors hover:text-ink-1"
                  aria-label={show ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  <Icon name="eye" size={16} />
                </button>
              </div>
              {fieldErrors.password ? (
                <span id="login-password-err" className="field__error">
                  <Icon name="alert" size={13} />
                  {fieldErrors.password}
                </span>
              ) : null}
            </div>

            {error ? (
              <p role="alert" className="flex items-start gap-2.5 rounded-2 border border-danger/40 bg-danger-soft px-4 py-3 text-small text-danger">
                <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
                {error}
              </p>
            ) : null}

            <button type="submit" className="btn btn--accent btn--lg w-full" disabled={busy} aria-busy={busy}>
              {busy ? (
                <>
                  <span className="spin" aria-hidden>
                    <Icon name="zap" size={15} />
                  </span>
                  Tekshirilmoqda…
                </>
              ) : (
                <>
                  Kirish
                  <Icon name="arrow-right" size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-small text-ink-3">
          Parolni unutdingizmi? Server muhitida <span className="font-mono text-ink-2">ADMIN_PASSWORD</span> ni
          o&apos;zgartiring va <span className="font-mono text-ink-2">npm run db:seed</span> ni <span className="font-mono text-ink-2">--force</span> bilan
          ishga tushiring — keyingi kirish yangi parol bilan bo&apos;ladi.
        </p>
      </div>
    </div>
  );
}
