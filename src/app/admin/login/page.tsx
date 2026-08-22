"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Kirishda xatolik yuz berdi.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi. Qayta urinib ko'ring.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="pf-card p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Admin panel</h1>
        <p className="pf-muted text-sm mb-6">Portfolio saytni boshqarish uchun kiring.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="pf-input"
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Parol"
            required
            className="pf-input"
            autoComplete="current-password"
          />
          {error ? <p className="text-red-400 text-sm">{error}</p> : null}
          <button type="submit" disabled={loading} className="pf-btn pf-btn-primary disabled:opacity-60 mt-2">
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}
