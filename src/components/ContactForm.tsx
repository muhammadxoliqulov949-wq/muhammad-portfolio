"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Xatolik yuz berdi. Qayta urinib ko'ring.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Tarmoq xatosi. Internetni tekshiring.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full grid place-items-center bg-emerald-400/10 border border-emerald-400/40">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="font-display text-xl font-bold mb-2">Xabaringiz yuborildi ✓</p>
        <p className="pf-muted text-sm mb-6">Rahmat! Tez orada siz bilan bog&apos;lanaman.</p>
        <button type="button" onClick={() => setStatus("idle")} className="pf-btn text-sm">
          Yana xabar yuborish
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="cf-name" className="block text-sm pf-muted mb-1.5">
          Ismingiz
        </label>
        <input
          id="cf-name"
          type="text"
          name="name"
          placeholder="Masalan: Aziz"
          required
          maxLength={120}
          className="pf-input"
        />
      </div>
      <div>
        <label htmlFor="cf-email" className="block text-sm pf-muted mb-1.5">
          Email manzilingiz
        </label>
        <input
          id="cf-email"
          type="email"
          name="email"
          placeholder="aziz@example.com"
          required
          maxLength={200}
          className="pf-input"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="block text-sm pf-muted mb-1.5">
          Xabaringiz
        </label>
        <textarea
          id="cf-message"
          name="message"
          placeholder="Loyihangiz haqida qisqacha yozing..."
          required
          maxLength={4000}
          rows={5}
          className="pf-input resize-none"
        />
      </div>
      {status === "error" ? (
        <p className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3">{errorMsg}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="pf-btn pf-btn-primary w-full !py-3.5 disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Yuborilmoqda...
          </>
        ) : (
          <>
            Xabar yuborish
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
