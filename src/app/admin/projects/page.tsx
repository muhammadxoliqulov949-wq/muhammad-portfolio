"use client";

import { useEffect, useState, FormEvent } from "react";

type Project = {
  id: number;
  title: string;
  description: string;
  link: string | null;
  order: number;
  published: boolean;
};

const emptyForm = { title: "", description: "", link: "", order: 0, published: true };

export default function AdminProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/projects?all=1");
    const data = await res.json();
    setProjectsList(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      link: p.link ?? "",
      order: p.order,
      published: p.published,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Xatolik yuz berdi.");
        setSaving(false);
        return;
      }

      cancelEdit();
      await load();
    } catch {
      setError("Tarmoq xatosi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu loyihani o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Loyihalar</h1>
      <p className="pf-muted text-sm mb-6">Portfolio saytdagi loyihalarni qo&apos;shing, tahrirlang yoki o&apos;chiring.</p>

      <form onSubmit={handleSubmit} className="pf-card p-6 flex flex-col gap-4 mb-8 max-w-2xl">
        <h2 className="font-semibold">{editingId ? "Loyihani tahrirlash" : "Yangi loyiha qo'shish"}</h2>

        <input
          className="pf-input"
          placeholder="Sarlavha"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="pf-input resize-none"
          rows={3}
          placeholder="Tavsif"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          className="pf-input"
          placeholder="Havola (ixtiyoriy) — https://..."
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 pf-muted text-sm">
            Tartib raqami
            <input
              type="number"
              className="pf-input w-20"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </label>
          <label className="flex items-center gap-2 pf-muted text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Saytda ko&apos;rinsin
          </label>
        </div>

        {error ? <p className="text-red-400 text-sm">{error}</p> : null}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="pf-btn pf-btn-primary disabled:opacity-60">
            {saving ? "Saqlanmoqda..." : editingId ? "Yangilash" : "Qo'shish"}
          </button>
          {editingId ? (
            <button type="button" onClick={cancelEdit} className="pf-btn">
              Bekor qilish
            </button>
          ) : null}
        </div>
      </form>

      {loading ? (
        <p className="pf-muted">Yuklanmoqda...</p>
      ) : projectsList.length === 0 ? (
        <p className="pf-muted">Hozircha loyihalar yo&apos;q.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projectsList.map((p) => (
            <div key={p.id} className="pf-card p-4 flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  {!p.published ? (
                    <span className="text-xs pf-muted border border-[var(--border)] rounded-full px-2 py-0.5">
                      Yashirilgan
                    </span>
                  ) : null}
                </div>
                <p className="pf-muted text-sm mt-1">{p.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(p)} className="pf-btn text-sm py-2 px-3">
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="pf-btn text-sm py-2 px-3 text-red-400 border-red-400/30"
                >
                  O&apos;chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
