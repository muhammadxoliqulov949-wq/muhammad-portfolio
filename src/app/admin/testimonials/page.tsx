import AdminCrudPage from "@/components/AdminCrudPage";

export default function AdminTestimonialsPage() {
  return (
    <AdminCrudPage
      apiPath="/api/testimonials"
      title="Fikr"
      fields={[
        { name: "name", label: "Ism", required: true },
        { name: "role", label: "Lavozim / Kasb", placeholder: "Masalan: Kichik biznes egasi" },
        { name: "avatarInitials", label: "Avatar harflari", placeholder: "JA" },
        { name: "text", label: "Fikr matni", type: "textarea", required: true },
        { name: "order", label: "Tartib raqami", type: "number" },
      ]}
      emptyForm={{ name: "", role: "", avatarInitials: "", text: "", order: 0 }}
      listColumns={["Ism", "Lavozim", "Fikr", "Tartib"]}
    />
  );
}
