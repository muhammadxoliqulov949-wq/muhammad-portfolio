import AdminCrudPage from "@/components/AdminCrudPage";

export default function AdminExperiencePage() {
  return (
    <AdminCrudPage
      apiPath="/api/experience"
      title="Tajriba"
      fields={[
        { name: "role", label: "Lavozim", required: true, placeholder: "Masalan: Frontend dasturchi" },
        { name: "company", label: "Kompaniya / Joy", required: true },
        { name: "period", label: "Davr", placeholder: "2024 — Hozir" },
        { name: "description", label: "Tavsif", type: "textarea" },
        { name: "order", label: "Tartib raqami", type: "number" },
      ]}
      emptyForm={{ role: "", company: "", period: "", description: "", order: 0 }}
      listColumns={["Lavozim", "Kompaniya", "Davr", "Tartib"]}
    />
  );
}
