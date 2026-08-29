import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

/**
 * Yutuqlar — sertifikatlar, olimpiadalar, sport natijalari.
 * `url` to'ldirilsa saytda "Tekshirish" havolasi chiqadi (halollik uchun).
 */
const fields: FieldConfig[] = [
  { name: "title", label: "Nomi", required: true, placeholder: "CEFR B1 — ingliz tili" },
  { name: "issuer", label: "Beruvchi", placeholder: "Google" },
  {
    name: "kind",
    label: "Turi",
    type: "select",
    options: [
      { value: "cert", label: "Sertifikat" },
      { value: "academic", label: "Akademik" },
      { value: "sport", label: "Sport" },
    ],
    hint: "Saytda shu nom bilan guruhlanadi",
  },
  { name: "year", label: "Yil", placeholder: "2026", hint: "Bo'sh qoldirilsa ko'rsatilmaydi" },
  { name: "detail", label: "Izoh", type: "textarea", rows: 2 },
  { name: "url", label: "Tekshirish havolasi (URL)", type: "url", placeholder: "https://…" },
];

const columns: ColumnConfig[] = [
  { key: "title", label: "Yutuq" },
  { key: "issuer", label: "Beruvchi" },
  { key: "kind", label: "Turi" },
  { key: "year", label: "Yil", kind: "number" },
];

export default function AdminAchievementsPage() {
  return (
    <AdminCollection
      apiPath="/api/achievements"
      title="Yutuqlar"
      description="Hujjat yoki natija bilan tasdiqlanganlar. Tasdiqsiz da'volarni bu yozmang."
      fields={fields}
      columns={columns}
      primary="title"
      emptyForm={{ title: "", issuer: "", kind: "cert", year: "", detail: "", url: "" }}
    />
  );
}
