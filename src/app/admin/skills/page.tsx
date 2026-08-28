import AdminCrudPage from "@/components/AdminCrudPage";

export default function AdminSkillsPage() {
  return (
    <AdminCrudPage
      apiPath="/api/skills"
      title="Ko'nikma"
      fields={[
        { name: "name", label: "Nomi", required: true, placeholder: "Masalan: React" },
        { name: "category", label: "Kategoriya", required: true, placeholder: "Frontend / Backend / Asboblar" },
        { name: "level", label: "Daraja (0–100)", type: "number", min: 0, max: 100 },
        { name: "order", label: "Tartib raqami", type: "number" },
      ]}
      emptyForm={{ name: "", category: "Frontend", level: 80, order: 0 }}
      listColumns={["Nomi", "Kategoriya", "Daraja", "Tartib"]}
    />
  );
}
