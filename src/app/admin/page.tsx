"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Field, { type FieldConfig } from "@/components/ui/Field";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

type ProfileForm = Record<string, string | number | boolean>;

const groups: { title: string; note?: string; fields: FieldConfig[] }[] = [
  {
    title: "Kimmaniz",
    note: "Bu uchta kasb satri (title, 2-qator, 3-qator) bosh sahifadagi almashinuvchi satriga chiqadi.",
    fields: [
      { name: "fullName", label: "To'liq ism", required: true, placeholder: "Muhammad" },
      { name: "avatarInitials", label: "Initisiallar", placeholder: "MX", hint: "Favicon va monogram uchun", max: 4 },
      { name: "title", label: "Asosiy kasb", required: true, placeholder: "Full-stack dasturchi" },
      { name: "role2", label: "2-qator", placeholder: "Next.js va TypeScript bilan ishlayman" },
      { name: "role3", label: "3-qator", placeholder: "Telegram botlar va admin panellar" },
      { name: "badge", label: "Holat belgisi", placeholder: "2026 uchun 2 ta joy bo'sh" },
      { name: "bio", label: "Bio", type: "textarea", required: true, rows: 4 },
      { name: "photoUrl", label: "Portret URL", type: "url", hint: "Bo'sh bo'lsa monogram chiqadi" },
    ],
  },
  {
    title: "Aloqa",
    note: "Bo'sh qoldirilgan kanal saytda ko'rsatilmaydi — «yourname@example.com» kabi placeholder chiqmaydi.",
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      { name: "telegram", label: "Telegram", placeholder: "@username" },
      { name: "github", label: "GitHub profili", placeholder: "https://github.com/…" },
      { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/…" },
      { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
      { name: "location", label: "Shahar", placeholder: "Toshkent, O'zbekiston" },
      { name: "resumeUrl", label: "CV havolasi", type: "url", placeholder: "https://…/cv.pdf" },
      { name: "responseTime", label: "Javob vaqti", placeholder: "Odatda 12 soat ichida" },
      { name: "sinceYear", label: "Shu yildan amaliyotda", placeholder: "2022" },
    ],
  },
  {
    title: "Raqamlar",
    note: "Bosh sahifadagi «ledger» qatori. Ro'yxatga olish uchun emas — tekshiriladigan raqamlar.",
    fields: [
      { name: "statProjects", label: "Loyihalar", placeholder: "18 ta" },
      { name: "statExperience", label: "Tajriba", placeholder: "3 yil" },
      { name: "statAvailability", label: "Bandlik", placeholder: "2 ta joy" },
    ],
  },
];

const empty: ProfileForm = Object.fromEntries(
  groups.flatMap((g) => g.fields.map((f) => [f.name, ""]))
);

export default function AdminProfilePage() {
  const { push } = useToast();
  const [form, setForm] = useState<ProfileForm>(empty);
  const [baseline, setBaseline] = useState<ProfileForm>(empty);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Profilni yuklab bo'lmadi");
      const data = (await res.json()) as ProfileForm | null;
      const next = { ...empty, ...(data ?? {}) };
      setForm(next);
      setBaseline(next);
    } catch (err) {
      setLoadError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // load() ichidagi setState'lar faqat await'dan keyin ishlaydi.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 422 && data?.fields) setErrors(data.fields);
        push({ variant: "error", title: data?.error ?? "Saqlab bo'lmadi" });
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
        return;
      }
      const next = { ...empty, ...(data as ProfileForm) };
      setForm(next);
      setBaseline(next);
      push({ variant: "success", title: "Profil saqlandi", description: "Bosh sahifa 1 daqiqa ichida yangilanadi." });
    } catch {
      push({ variant: "error", title: "Internet aloqasi uzildi" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="stack gap-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-56" rounded="rounded-3" />
        <Skeleton className="h-56" rounded="rounded-3" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Card className="flex flex-wrap items-center justify-between gap-4 p-6" interactive={false}>
        <p className="flex items-center gap-2.5 text-danger">
          <Icon name="alert" size={16} />
          {loadError}
        </p>
        <button type="button" className="btn btn--sm" onClick={load}>
          <Icon name="undo" size={14} />
          Qayta urinish
        </button>
      </Card>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="stack gap-6 pb-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-display-m">Profil</h1>
          <p className="mt-1.5 text-small text-ink-2">
            Bosh sahifadagi matnlar, aloqa kanallari va statistika shu yerda boshqariladi.
          </p>
        </div>
        <Link href="/#home" className="btn btn--ghost btn--sm">
          <Icon name="eye" size={14} />
          Saytda ko&apos;rish
        </Link>
      </div>

      {groups.map((g, gi) => (
        <Card key={g.title} className="p-5 md:p-6" interactive={false}>
          <div className="mb-5 flex items-baseline gap-3 border-b border-line-1 pb-4">
            <span className="u-num font-mono text-micro text-accent-text">{String(gi + 1).padStart(2, "0")}</span>
            <h2 className="display text-title font-semibold">{g.title}</h2>
          </div>
          {g.note ? <p className="mb-5 max-w-2xl text-small text-ink-3">{g.note}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2 lg:col-span-3" : ""}>
                <Field
                  {...f}
                  idSuffix="-profile"
                  value={form[f.name] ?? ""}
                  error={errors[f.name]}
                  disabled={saving}
                  onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Sticky save bar — faqat o'zgarish bo'lsa chiqadi */}
      <div
        className={`sticky bottom-0 z-30 -mx-1 border-t border-line-1 bg-canvas/95 px-1 py-3 backdrop-blur-xl transition-opacity ${
          dirty ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!dirty}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-small text-ink-2">
            <Icon name="info" size={14} className="text-accent-text" />
            Saqlanmagan o&apos;zgarishlar bor
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn btn--sm" onClick={() => setForm(baseline)} disabled={saving}>
              <Icon name="undo" size={14} />
              Qaytarish
            </button>
            <button type="submit" className="btn btn--accent btn--sm" disabled={saving} aria-busy={saving}>
              <Icon name="save" size={14} />
              {saving ? "Saqlanmoqda…" : "Saqlash"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
