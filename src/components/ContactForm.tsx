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
      <div className="text-center py-4">
        <p className="text-[var(--blue2)] font-semibold mb-1">Xabaringiz yuborildi ✓</p>
        <p className="pf-muted text-sm">Tez orada javob beraman.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="pf-btn mt-4 text-sm"
        >
          Yana xabar yuborish
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        name="name"
        placeholder="Ismingiz"
        required
        maxLength={120}
        className="pf-input"
      />
      <input
        type="email"
        name="email"
        placeholder="Email manzilingiz"
        required
        maxLength={200}
        className="pf-input"
      />
      <textarea
        name="message"
        placeholder="Xabaringiz"
        required
        maxLength={4000}
        rows={4}
        className="pf-input resize-none"
      />
      {status === "error" ? <p className="text-red-400 text-sm">{errorMsg}</p> : null}
      <button type="submit" disabled={status === "loading"} className="pf-btn pf-btn-primary disabled:opacity-60">
        {status === "loading" ? "Yuborilmoqda..." : "Yuborish"}
      </button>
    </form>
  );
}
