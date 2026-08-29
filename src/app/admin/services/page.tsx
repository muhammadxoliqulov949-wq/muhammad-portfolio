import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

const iconOptions = [
  { value: "rocket", label: "rocket — raketa" },
  { value: "layers", label: "layers — qatlamlar" },
  { value: "gauge", label: "gauge — asboblar" },
  { value: "bot", label: "bot — bot" },
  { value: "code", label: "code — kod" },
  { value: "database", label: "database — baza" },
  { value: "shield", label: "shield — himoya" },
  { value: "pen", label: "pen — dizayn" },
  { value: "sparkles", label: "sparkle — universal" },
];

const fields: FieldConfig[] = [
  { name: "title", label: "Nomi", required: true, placeholder: "Landing sahifa" },
  { name: "icon", label: "Ikonka", type: "select", options: iconOptions, hint: "Emoji o'rniga SVG ikonka" },
  { name: "priceFrom", label: "Narx (dan)", placeholder: "$350 dan" },
  { name: "delivery", label: "Muddat", placeholder: "5–7 ish kun" },
  { name: "description", label: "Tavsif", type: "textarea", required: true, rows: 3 },
  { name: "features", label: "Nimalar kiradi", type: "textarea", rows: 4, placeholder: "2 variant makет\nFormalar + DB\nSEO", hint: "Har qator — bitta band" },
];

const columns: ColumnConfig[] = [
  { key: "title", label: "Xizmat" },
  { key: "priceFrom", label: "Narx" },
  { key: "delivery", label: "Muddat" },
  { key: "description", label: "Tavsif", kind: "long", clamp: true },
];

export default function AdminServicesPage() {
  return (
    <AdminCollection
      apiPath="/api/services"
      title="Xizmatlar"
      description="Narx oralig'i va muddat — mijoz saytini «qimmat» qilib ko'rsatish uchun emas, suhbatni tezlashtirish uchun."
      fields={fields}
      columns={columns}
      primary="title"
      emptyForm={{ title: "", description: "", icon: "sparkles", priceFrom: "", delivery: "", features: "" }}
    />
  );
}
