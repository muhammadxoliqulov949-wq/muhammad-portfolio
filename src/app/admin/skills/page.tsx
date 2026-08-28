import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

const fields: FieldConfig[] = [
  { name: "name", label: "Texnologiya", required: true, placeholder: "Next.js" },
  { name: "category", label: "Guruh", placeholder: "Frontend", hint: "Toolbox bo'limida shu nom bilan guruhlanadi" },
  { name: "years", label: "Necha yil", type: "number", min: 0, max: 60, hint: "Foiz emas — yil so'raladi" },
  { name: "context", label: "Qayerda qo'lladingiz", placeholder: "11 ta loyihada" },
];

const columns: ColumnConfig[] = [
  { key: "name", label: "Texnologiya" },
  { key: "category", label: "Guruh" },
  { key: "years", label: "Yil", kind: "number" },
  { key: "context", label: "Kontekst", kind: "long", clamp: true },
];

export default function AdminSkillsPage() {
  return (
    <AdminCollection
      apiPath="/api/skills"
      title="Toolbox"
      description="Foizli progress-barlar olib tashlandi: har bir texnologiya uchun yil va qo'llangan joyi ko'rsatiladi."
      fields={fields}
      columns={columns}
      primary="name"
      emptyForm={{ name: "", category: "Frontend", years: 0, context: "" }}
    />
  );
}
