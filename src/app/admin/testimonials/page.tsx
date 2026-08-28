import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

const fields: FieldConfig[] = [
  { name: "name", label: "Ism", required: true, placeholder: "Aziz Karimov" },
  { name: "role", label: "Lavozim / kompanya", placeholder: "Chorsu Market, asoschisi" },
  { name: "avatarInitials", label: "Initisiallar", max: 4, placeholder: "AK" },
  { name: "rating", label: "Baho (0–5)", type: "number", min: 0, max: 5, hint: "Haqiqiy baho — hammasi 5 bo'lishi shart emas" },
  { name: "text", label: "Fikr", type: "textarea", required: true, rows: 4 },
  { name: "sourceUrl", label: "Manba (ixtiyoriy)", type: "url", placeholder: "https://…" },
];

const columns: ColumnConfig[] = [
  { key: "name", label: "Mijoz" },
  { key: "role", label: "Lavozim", kind: "long", clamp: true },
  { key: "rating", label: "Baho", kind: "number" },
  { key: "text", label: "Fikr", kind: "long", clamp: true },
];

export default function AdminTestimonialsPage() {
  return (
    <AdminCollection
      apiPath="/api/testimonials"
      title="Mijozlar fikri"
      description="Rozilik bilan olingan fikrlarni ism va lavozim bilan kiriting — ishonch shu yerda."
      fields={fields}
      columns={columns}
      primary="name"
      emptyForm={{ name: "", role: "", text: "", avatarInitials: "", rating: 5, sourceUrl: "" }}
    />
  );
}
