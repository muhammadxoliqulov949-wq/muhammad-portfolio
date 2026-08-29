"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Field, { type FieldConfig } from "@/components/ui/Field";
import PortraitUpload from "@/components/PortraitUpload";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

type ProfileForm = Record<string, string | number | boolean>;

const groups: { title: string; note?: string; fields: FieldConfig[] }[] = [
  {
    title: "Kimmaniz",
    note: "Bu uchta kasb satri (title, 2-qator, 3-qator) bosh sahifadagi almashinuvchi satriga chiqadi.",
    fields: [
      { name: "fullName", label: "To'liq ism", required: true, placeholder: "Muhammad Xoliqulov" },
      { name: "avatarInitials", label: "Initisiallar", placeholder: "MX", hint: "Favicon va monogram uchun", max: 4 },
      { name: "title", label: "Asosiy kasb", required: true, placeholder: "Student & AI Developer" },
      { name: "role2", label: "2-qator", placeholder: "AI-assisted full-stack development" },
      { name: "role3", label: "3-qator", placeholder: "Vibe coding — gʻoyadan deploygacha" },
      { name: "badge", label: "Holat belgisi", placeholder: "Toshkent · Oʻzbekiston" },
      { name: "bio", label: "Bio (hero uchun 1-2 gap)", type: "textarea", required: true, rows: 4 },
      {
        name: "story",
        label: "About bo'limi uchun hikoya",
        type: "textarea",
        rows: 8,
        hint: "Xatboshilarni bo'sh qator bilan ajrating — har biri alohida paragraf bo'ladi",
        full: true,
      },
      {
        name: "photoUrl",
        label: "Portret URL",
        type: "url",
        hint: "/media/portrait.jpg (public/media papkasiga tashlanadi) yoki https://… Boʻsh bolsa monogram chiqadi",
      },
    ],
  },
  {
    title: "Aloqa",
    note: "Bo'sh qoldirilgan kanal saytda ko'rsatilmaydi — «yourname@example.com» kabi placeholder chiqmaydi.",
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Telefon", placeholder: "+998 99 201 11 77", hint: "Saytda tel: havolasi bo'ladi" },
      { name: "telegram", label: "Telegram", placeholder: "@username" },
      { name: "github", label: "GitHub profili", placeholder: "https://github.com/…" },
      { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/…", hint: "Hisob bo'lmasa — bo'sh qoldiring" },
      { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
      { name: "location", label: "Shahar", placeholder: "Toshkent, O'zbekiston" },
      { name: "resumeUrl", label: "CV havolasi", type: "url", placeholder: "https://…/cv.pdf" },
      { name: "englishLevel", label: "Ingliz tili darajasi", placeholder: "B2" },
      { name: "responseTime", label: "Javob vaqti", placeholder: "Ixtiyoriy", hint: "Aniq va'da bo'lmasa — bo'sh qoldiring" },
      { name: "sinceYear", label: "Shu yildan amaliyotda", placeholder: "Ixtiyoriy" },
    ],
  },
  {
    title: "Tamoyillar va oqim",
    note: "About bo'limi va hero panellari shu ro'yxatlardan oziqlanadi. Vergul yoki | bilan ajrating.",
    fields: [
      { name: "strengths", label: "Kuchli tomonlar", type: "textarea", rows: 2, placeholder: "Tez o'rganish, Qat'iyat, Muddatga rioya" },
      { name: "interests", label: "Qiziqishlar", placeholder: "Futbol, Ta'lim, Biznes, Texnologiya" },
      { name: "principleWork", label: "Ish tamoyili", placeholder: "Boshlagan narsani tugatish" },
      { name: "principleDelivery", label: "Topshirish tamoyili", placeholder: "Aytgan ishni o'z vaqtida qilish" },
      { name: "workflow", label: "Ish oqimi qadamlari", type: "textarea", rows: 2, placeholder: "Talabni yozish | Prototip | Kodni o'qish | Test | Deploy" },
      {
        name: "goals",
        label: "Kelgusi 1–2 yil: rejalar",
        type: "textarea",
        rows: 3,
        hint: "Saytda „reja, natija emas“ deb belgilanib chiqadi",
      },
    ],
  },
  {
    title: "Raqamlar",
    note: "Bosh sahifadagi «ledger» qatori. Faqat tekshiriladigan raqamlar — taxminiy emas.",
    fields: [
      { name: "statProjects", label: "Topshirilgan ishlar", placeholder: "5 ta sayt" },
      { name: "statExperience", label: "Amaliy tajriba", placeholder: "≈1,5 yil" },
      { name: "statAvailability", label: "Mijozlar", placeholder: "10+ mijoz" },
    ],
  },
];

const empty: ProfileForm = Object.fromEntries(
  groups.flatMap((g) => g.fields.map((f) => [f.name, ""]))
);

export default function AdminProfilePage() {
  const { push } = useToast();
  const router = useRouter();
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

      {/* Portret: fayl tanlash/sürülash/⌘V — yuklangan rasm DB'da saqlanadi
          (Vercel'da fayl tizimi read-only), sayt uni /api/media/portrait'dan oladi. */}
      <Card className="p-5 md:p-6" interactive={false}>
        <div className="mb-5 flex items-baseline gap-3 border-b border-line-1 pb-4">
          <span className="u-num font-mono text-micro text-accent-text">00</span>
          <h2 className="display text-title font-semibold">Portret</h2>
        </div>
        <PortraitUpload
          current={(form.photoUrl as string) || null}
          initials={(form.avatarInitials as string) || (form.fullName as string) || "M"}
          onChanged={(info) => {
            const url = info?.url ?? "";
            setForm((prev) => ({ ...prev, photoUrl: url }));
            setBaseline((prev) => ({ ...prev, photoUrl: url }));
            push({
              variant: "success",
              title: url ? "Portret yuklandi" : "Portret oʻchirildi",
              description: url && info?.bytes
                ? `${info.width}×${info.height}, ${Math.round(info.bytes / 1024)} KB — sayt 1 daqiqada yangilanadi`
                : "Sayt endi monogram freymni koʻrsatadi",
            });
            router.refresh();
          }}
          onError={(m) => push({ variant: "error", title: "Yuklab boʻlmadi", description: m })}
        />
      </Card>

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
