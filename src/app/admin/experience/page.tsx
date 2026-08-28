import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

const fields: FieldConfig[] = [
  { name: "role", label: "Lavozim", required: true, placeholder: "Full-stack dasturchi" },
  { name: "company", label: "Kompaniya", required: true, placeholder: "Mustaqil (frilans)" },
  { name: "period", label: "Davr", placeholder: "2023 — hozir" },
  { name: "description", label: "Qisqacha", type: "textarea", rows: 3 },
  { name: "highlights", label: "Yutuqlar", type: "textarea", rows: 3, placeholder: "18 ta loyiha\nO'rtacha 3 hafta", hint: "Har qator — bitta band" },
  { name: "current", label: "Hozirgi ish yeri", type: "checkbox" },
];

const columns: ColumnConfig[] = [
  { key: "role", label: "Lavozim" },
  { key: "company", label: "Kompaniya" },
  { key: "period", label: "Davr" },
  { key: "current", label: "Joriy", kind: "bool" },
];

export default function AdminExperiencePage() {
  return (
    <AdminCollection
      apiPath="/api/experience"
      title="Tajriba"
      description="Timeline'da chiziqlar bo'ylab ko'rsatiladi; yutuqlar ustun ko'rinishida chiqadi."
      fields={fields}
      columns={columns}
      primary="role"
      statusField={{ name: "current", onLabel: "Joriy emas", offLabel: "Joriy deb belgilash" }}
      emptyForm={{ role: "", company: "", period: "", description: "", highlights: "", current: false }}
    />
  );
}
