"use client";

import { useEffect, useState } from "react";

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox";
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
};

type Item = { id: number } & Record<string, string | number | boolean | null>;

type Props = {
  apiPath: string;
  title: string;
  fields: FieldConfig[];
  emptyForm: Record<string, string | number | boolean>;
  listColumns: string[];
};

export default function AdminCrudPage({ apiPath, title, fields, emptyForm, listColumns }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch(apiPath);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(item: Item) {
    setEditingId(item.id);
    const next: Record<string, string | number | boolean> = {};
    for (const f of fields) {
      next[f.name] = item[f.name] ?? emptyForm[f.name];
    }
    setForm(next);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
  }

  function setField(name: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: Record<string, unknown> = { ...form };
    for (const f of fields) {
      if (f.type === "number") payload[f.name] = Number(payload[f.name]) || 0;
    }

    try {
      const res = await fetch(editingId ? `${apiPath}/${editingId}` : apiPath, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Saqlashda xatolik");
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Haqiqatan ham o'chirilsinmi?")) return;
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xatolik yuz berdi");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="pf-card p-5.5 space-y-4">
        <h2 className="text-lg font-bold">
          {editingId ? "Tahrirlash" : `${title} qo'shish`}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) =>
            f.type === "textarea" ? (
              <div key={f.name} className="sm:col-span-2">
                <label className="block text-sm pf-muted mb-1.5">{f.label}</label>
                <textarea
                  value={String(form[f.name] ?? "")}
                  onChange={(e) => setField(f.name, e.target.value)}
                  required={f.required}
                  rows={3}
                  placeholder={f.placeholder}
                  className="pf-input resize-none"
                />
              </div>
            ) : f.type === "checkbox" ? (
              <label key={f.name} className="flex items-center gap-2.5 text-sm pf-muted self-end">
                <input
                  type="checkbox"
                  checked={Boolean(form[f.name])}
                  onChange={(e) => setField(f.name, e.target.checked)}
                  className="w-4 h-4 accent-[var(--blue2)]"
                />
                {f.label}
              </label>
            ) : (
              <div key={f.name}>
                <label className="block text-sm pf-muted mb-1.5">{f.label}</label>
                <input
                  type={f.type === "number" ? "number" : "text"}
                  value={String(form[f.name] ?? "")}
                  onChange={(e) => setField(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)}
                  required={f.required}
                  min={f.min}
                  max={f.max}
                  placeholder={f.placeholder}
                  className="pf-input"
                />
              </div>
            )
          )}
        </div>
        {error ? <p className="text-red-400 text-sm">{error}</p> : null}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="pf-btn pf-btn-primary disabled:opacity-60">
            {saving ? "Saqlanmoqda..." : editingId ? "Saqlash" : "Qo'shish"}
          </button>
          {editingId ? (
            <button type="button" onClick={cancelEdit} className="pf-btn">
              Bekor qilish
            </button>
          ) : null}
        </div>
      </form>

      <div className="pf-card overflow-x-auto">
        {loading ? (
          <p className="pf-muted p-5.5">Yuklanmoqda...</p>
        ) : items.length === 0 ? (
          <p className="pf-muted p-5.5">Hozircha ma&apos;lumot yo&apos;q.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left pf-muted">
                {listColumns.map((c) => (
                  <th key={c} className="p-3.5 font-semibold whitespace-nowrap">
                    {c}
                  </th>
                ))}
                <th className="p-3.5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0">
                  {listColumns.map((c, i) => {
                    const key = fields[i]?.name ?? c;
                    const val = item[key];
                    return (
                      <td key={c} className="p-3.5">
                        {typeof val === "boolean" ? (val ? "✅" : "—") : String(val ?? "")}
                      </td>
                    );
                  })}
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-[var(--blue2)] hover:underline mr-3"
                    >
                      Tahrirlash
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:underline">
                      O&apos;chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
