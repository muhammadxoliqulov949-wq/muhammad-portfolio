"use client";

import { useEffect, useState, FormEvent } from "react";

type Profile = {
  fullName: string;
  title: string;
  badge: string;
  bio: string;
  avatarInitials: string;
  email: string;
  telegram: string;
  statProjects: string;
  statExperience: string;
  statAvailability: string;
};

const emptyProfile: Profile = {
  fullName: "",
  title: "",
  badge: "",
  bio: "",
  avatarInitials: "",
  email: "",
  telegram: "",
  statProjects: "",
  statExperience: "",
  statAvailability: "",
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data) setProfile({ ...emptyProfile, ...data });
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: data.error || "Saqlashda xatolik yuz berdi." });
        setSaving(false);
        return;
      }

      setMessage({ type: "success", text: "Profil muvaffaqiyatli saqlandi." });
    } catch {
      setMessage({ type: "error", text: "Tarmoq xatosi." });
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return <p className="pf-muted">Yuklanmoqda...</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Profil ma&apos;lumotlari</h1>
      <p className="pf-muted text-sm mb-6">
        Bu ma&apos;lumotlar saytning bosh sahifasida ko&apos;rinadi.
      </p>

      <form onSubmit={handleSubmit} className="pf-card p-6 flex flex-col gap-4">
        <Field label="To'liq ism">
          <input
            className="pf-input"
            value={profile.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
          />
        </Field>

        <Field label="Kasb / unvon">
          <input
            className="pf-input"
            value={profile.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </Field>

        <Field label="Badge matni (hero ustidagi kichik yorliq)">
          <input
            className="pf-input"
            value={profile.badge}
            onChange={(e) => update("badge", e.target.value)}
          />
        </Field>

        <Field label="Bio / tavsif">
          <textarea
            className="pf-input resize-none"
            rows={3}
            value={profile.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
        </Field>

        <Field label="Avatar harflari (masalan MX)">
          <input
            className="pf-input"
            value={profile.avatarInitials}
            onChange={(e) => update("avatarInitials", e.target.value)}
            maxLength={4}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input
              type="email"
              className="pf-input"
              value={profile.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </Field>
          <Field label="Telegram">
            <input
              className="pf-input"
              value={profile.telegram}
              onChange={(e) => update("telegram", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Loyihalar soni">
            <input
              className="pf-input"
              value={profile.statProjects}
              onChange={(e) => update("statProjects", e.target.value)}
            />
          </Field>
          <Field label="Tajriba">
            <input
              className="pf-input"
              value={profile.statExperience}
              onChange={(e) => update("statExperience", e.target.value)}
            />
          </Field>
          <Field label="Aloqa holati">
            <input
              className="pf-input"
              value={profile.statAvailability}
              onChange={(e) => update("statAvailability", e.target.value)}
            />
          </Field>
        </div>

        {message ? (
          <p className={message.type === "success" ? "text-[var(--blue2)] text-sm" : "text-red-400 text-sm"}>
            {message.text}
          </p>
        ) : null}

        <button type="submit" disabled={saving} className="pf-btn pf-btn-primary self-start disabled:opacity-60">
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="pf-muted text-sm">{label}</span>
      {children}
    </label>
  );
}
