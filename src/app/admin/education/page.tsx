import AdminCollection, { type ColumnConfig } from "@/components/AdminCollection";
import type { FieldConfig } from "@/components/ui/Field";

/**
 * Ta'lim — sayt bo'limi bilan bir xil struktura (bo'sh bo'lsa, bo'lim
 * sahifada ko'rsatilmaydi).
 */
const fields: FieldConfig[] = [
  { name: "institution", label: "O'quv muassasasi", required: true, placeholder: "International OXUS University" },
  { name: "credential", label: "Daraja", placeholder: "Bakalavr" },
  { name: "field", label: "Yo'nalish", placeholder: "Iqtisodiyot va biznes boshqaruvi" },
  { name: "period", label: "Davr", placeholder: "2026–2030", hint: "Chiziq bilan yozing" },
  { name: "status", label: "Holat", placeholder: "1-kurs talabasi" },
  { name: "detail", label: "Izoh", type: "textarea", rows: 3, placeholder: "Nima berayotgani yoki nima o'rgatgani" },
  { name: "current", label: "Hozirgi joyim (chip bilan ko'rsatiladi)", type: "checkbox" },
];

const columns: ColumnConfig[] = [
  { key: "institution", label: "Muassasa" },
  { key: "field", label: "Yo'nalish", kind: "long", clamp: true },
  { key: "period", label: "Davr" },
  { key: "status", label: "Holat" },
  { key: "current", label: "Joriy", kind: "bool" },
];

export default function AdminEducationPage() {
  return (
    <AdminCollection
      apiPath="/api/education"
      title="Ta'lim"
      description="Faqat haqiqiy ma'lumot: muassasa, yo'nalish, davr va holat."
      fields={fields}
      columns={columns}
      primary="institution"
      statusField={{ name: "current", onLabel: "Joriy emas", offLabel: "Joriy qilish" }}
      emptyForm={{
        institution: "",
        credential: "",
        field: "",
        period: "",
        status: "",
        detail: "",
        current: false,
      }}
    />
  );
}
