import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

const fields: FieldConfig[] = [
  { name: "name", label: "Texnologiya", required: true, placeholder: "Next.js" },
  {
    name: "category",
    label: "Guruh",
    placeholder: "Web",
    hint: "Saytda 4 guruh: AI & Development, Web, Tools, AI tools",
  },
  { name: "context", label: "Nima uchun kerak", placeholder: "Server, API va skriptlar" },
];

const columns: ColumnConfig[] = [
  { key: "name", label: "Texnologiya" },
  { key: "category", label: "Guruh" },
  { key: "context", label: "Kontekst", kind: "long", clamp: true },
];

export default function AdminSkillsPage() {
  return (
    <AdminCollection
      apiPath="/api/skills"
      title="Ko'nikmalar"
      description="Foizli progress-bar yo'q — har bir asbob uchun uni nimaga ishlatishingiz yoziladi."
      fields={fields}
      columns={columns}
      primary="name"
      emptyForm={{ name: "", category: "Web", context: "" }}
    />
  );
}
