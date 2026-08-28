import AdminCrudPage from "@/components/AdminCrudPage";

export default function AdminServicesPage() {
  return (
    <AdminCrudPage
      apiPath="/api/services"
      title="Xizmat"
      fields={[
        { name: "title", label: "Nomi", required: true, placeholder: "Masalan: Veb-sayt yaratish" },
        { name: "icon", label: "Belgi (emoji)", placeholder: "🚀" },
        { name: "description", label: "Tavsif", type: "textarea", required: true },
        { name: "order", label: "Tartib raqami", type: "number" },
      ]}
      emptyForm={{ title: "", icon: "🚀", description: "", order: 0 }}
      listColumns={["Belgi", "Nomi", "Tavsif", "Tartib"]}
    />
  );
}
