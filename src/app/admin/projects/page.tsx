import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

const fields: FieldConfig[] = [
  { name: "title", label: "Sarlavha", required: true, placeholder: "Chorsu Market — buyurtma platformasi" },
  { name: "year", label: "Yil", placeholder: "2025", hint: "Loyihalar saralashida ko'rinadi" },
  { name: "role", label: "Sizning rolingiz", placeholder: "Full-stack (dizayn + kod)" },
  { name: "impact", label: "Natija (raqam bilan)", placeholder: "Buyurtma vaqti 6 daqiqadan 2 daqiqaga tushdi", hint: "Kartada urg'uda ko'rsatiladi" },
  {
    name: "description",
    label: "Qisqa tavsif",
    type: "textarea",
    required: true,
    rows: 3,
    placeholder: "Loyiha nima qiladi va kim uchun?",
  },
  { name: "problem", label: "Muammo", type: "textarea", rows: 3, hint: "Case study: 01" },
  { name: "approach", label: "Yechim", type: "textarea", rows: 3, hint: "Case study: 02" },
  { name: "outcome", label: "Natija tafsiloti", type: "textarea", rows: 3, hint: "Case study: 03" },
  { name: "tech", label: "Stek", placeholder: "Next.js, TypeScript, Turso", hint: "Vergul bilan ajrating" },
  { name: "image", label: "Muqova rasmi (URL)", type: "url", placeholder: "https://…/cover.jpg", hint: "Bo'sh bo'lsa monogram ko'rsatiladi" },
  { name: "gallery", label: "Galereya (URL lar)", type: "textarea", rows: 2, placeholder: "https://…/1.jpg, https://…/2.jpg" },
  { name: "link", label: "Jonli demo (URL)", type: "url", placeholder: "https://demo.uz" },
  { name: "github", label: "Manba kodi (URL)", type: "url", placeholder: "https://github.com/…" },
  { name: "featured", label: "Asosiy loyiha (bosh sahifada katta)", type: "checkbox" },
  { name: "published", label: "Saytda ko'rsatilsin", type: "checkbox" },
];

const columns: ColumnConfig[] = [
  { key: "title", label: "Loyiha" },
  { key: "year", label: "Yil", kind: "number" },
  { key: "image", label: "Muqova", kind: "image" },
  { key: "impact", label: "Natija", kind: "long", clamp: true },
  { key: "published", label: "Chop etilgan", kind: "bool" },
];

export default function AdminProjectsPage() {
  return (
    <AdminCollection
      apiPath="/api/projects"
      title="Loyihalar"
      description="Har bir loyiha case study sifatida to'ldirilsa — ish beruvchi birinchi qatordan raqam ko'radi."
      fields={fields}
      columns={columns}
      primary="title"
      statusField={{ name: "published", onLabel: "Yashirish", offLabel: "Chop etish" }}
      emptyForm={{
        title: "",
        description: "",
        link: "",
        github: "",
        image: "",
        tech: "",
        year: "",
        role: "",
        impact: "",
        problem: "",
        approach: "",
        outcome: "",
        gallery: "",
        featured: false,
        published: true,
      }}
    />
  );
}
