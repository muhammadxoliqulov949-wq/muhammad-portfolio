"use client";

import { useEffect, useState, FormEvent } from "react";

type Profile = {
  fullName: string;
  title: string;
  role2: string;
  role3: string;
  badge: string;
  bio: string;
  avatarInitials: string;
  photoUrl: string;
  email: string;
  telegram: string;
  github: string;
  linkedin: string;
  instagram: string;
  location: string;
  resumeUrl: string;
  statProjects: string;
  statExperience: string;
  statAvailability: string;
};

const emptyProfile: Profile = {
  fullName: "",
  title: "",
  role2: "",
  role3: "",
  badge: "",
  bio: "",
  avatarInitials: "",
  photoUrl: "",
  email: "",
  telegram: "",
  github: "",
  linkedin: "",
  instagram: "",
  location: "",
  resumeUrl: "",
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

      setMessage({ type: "success", text: "Profil saqlandi ✓" });
    } catch {
      setMessage({ type: "error", text: "Tarmoq xatosi yuz berdi." });
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof Profile>(key: K, value: string) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) return <p className="pf-muted">Yuklanmoqda...</p>;

  const input = "pf-input";
  const label = "block text-sm pf-muted mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message ? (
        <p className={message.type === "success" ? "text-emerald-400" : "text-red-400"}>{message.text}</p>
      ) : null}

      <section className="pf-card p-5.5 space-y-4">
        <h2 className="text-lg font-bold">Asosiy ma&apos;lumotlar</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>To&apos;liq ism</label>
            <input className={input} value={profile.fullName} onChange={(e) => set("fullName", e.target.value)} required />
          </div>
          <div>
            <label className={label}>Asosiy kasb (title)</label>
            <input className={input} value={profile.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div>
            <label className={label}>Ikkinchi kasb (yozuv)</label>
            <input className={input} value={profile.role2} onChange={(e) => set("role2", e.target.value)} placeholder="Masalan: Veb-saytlar yarataman" />
          </div>
          <div>
            <label className={label}>Uchinchi kasb (yozuv)</label>
            <input className={input} value={profile.role3} onChange={(e) => set("role3", e.target.value)} placeholder="Masalan: Admin panellar quraman" />
          </div>
          <div>
            <label className={label}>Badge (tepa belgisi)</label>
            <input className={input} value={profile.badge} onChange={(e) => set("badge", e.target.value)} />
          </div>
          <div>
            <label className={label}>Avatar harflari</label>
            <input className={input} maxLength={4} value={profile.avatarInitials} onChange={(e) => set("avatarInitials", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Rasm URL (ixtiyoriy — avatar o&apos;rniga)</label>
            <input className={input} value={profile.photoUrl} onChange={(e) => set("photoUrl", e.target.value)} placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Bio (qisqa ta&apos;rif)</label>
            <textarea className={`${input} resize-none`} rows={4} value={profile.bio} onChange={(e) => set("bio", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="pf-card p-5.5 space-y-4">
        <h2 className="text-lg font-bold">Aloqa va ijtimoiy tarmoqlar</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Email</label>
            <input type="email" className={input} value={profile.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div>
            <label className={label}>Telegram</label>
            <input className={input} value={profile.telegram} onChange={(e) => set("telegram", e.target.value)} placeholder="@username" />
          </div>
          <div>
            <label className={label}>GitHub</label>
            <input className={input} value={profile.github} onChange={(e) => set("github", e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className={label}>LinkedIn</label>
            <input className={input} value={profile.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className={label}>Instagram</label>
            <input className={input} value={profile.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className={label}>Joylashuv</label>
            <input className={input} value={profile.location} onChange={(e) => set("location", e.target.value)} placeholder="Toshkent, O'zbekiston" />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>CV / Resume havolasi (ixtiyoriy)</label>
            <input className={input} value={profile.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)} placeholder="https://.../cv.pdf" />
          </div>
        </div>
      </section>

      <section className="pf-card p-5.5 space-y-4">
        <h2 className="text-lg font-bold">Statistikalar (bosh sahifa)</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>Loyihalar soni</label>
            <input className={input} value={profile.statProjects} onChange={(e) => set("statProjects", e.target.value)} placeholder="25+" />
          </div>
          <div>
            <label className={label}>Tajriba</label>
            <input className={input} value={profile.statExperience} onChange={(e) => set("statExperience", e.target.value)} placeholder="3 yil" />
          </div>
          <div>
            <label className={label}>Aloqadorlik</label>
            <input className={input} value={profile.statAvailability} onChange={(e) => set("statAvailability", e.target.value)} placeholder="Doim aloqada" />
          </div>
        </div>
      </section>

      <button type="submit" disabled={saving} className="pf-btn pf-btn-primary disabled:opacity-60">
        {saving ? "Saqlanmoqda..." : "Profilni saqlash"}
      </button>
    </form>
  );
}
