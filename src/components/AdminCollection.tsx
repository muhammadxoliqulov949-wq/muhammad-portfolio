"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Field, { type FieldConfig } from "./ui/Field";
import Icon from "./ui/Icon";
import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import { useToast } from "./ui/Toast";

export type ColumnConfig = {
  /** `fields` dagi `name` — indeks bo'yicha emas, kalit bo'yicha xaritalanadi */
  key: string;
  label: string;
  kind?: "text" | "bool" | "number" | "image" | "long";
  /** Uzun matnli ustunlar uchun */
  clamp?: boolean;
};

type Props = {
  apiPath: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  emptyForm: Record<string, string | number | boolean>;
  /** Qator holatini PATCH bilan almashtirish (masalan `published`, `current`) */
  statusField?: { name: string; onLabel: string; offLabel: string };
  reorderable?: boolean;
  primary?: string;
};

type Row = { id: number } & Record<string, unknown>;

const json = (init: RequestInit) => ({ headers: { "Content-Type": "application/json" }, ...init });

/**
 * Admin CRUD'ning yagona ishlovchi qismi.
 *
 * Audit tuzatishlari (P0-2, P1-12, P2-20):
 *  - jadval ustunlari `listColumns[i] → fields[i]` indeks xaritasi emas,
 *    `key` bo'yicha olinadi (noto'g'ri ustun ko'rsatish xatosi yo'q);
 *  - `confirm()/alert()` o'rniga toast + inline tasdiqlash + **undo**;
 *  - qidiruv, skeleton, "xato" va "bo'sh" holatlari ajratilgan, qayta urinish;
 *  - tartibni ↑/↓ bilan almashtirish (drag'n'drop uchun klaviatura
 *    muqobili — WCAG 2.5.7);
 *  - saqlanmagan o'zgarishda sahifani tark etish ogohlantiradi;
 *  - xar bir maydon label bilan bog'langan va inline xato ko'rsatadi.
 */
export default function AdminCollection({
  apiPath,
  title,
  description,
  fields,
  columns,
  emptyForm,
  statusField,
  reorderable = true,
  primary = "title",
}: Props) {
  const { push, confirm } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({ ...emptyForm });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const dirty = useMemo(
    () => fields.some((f) => (form[f.name] ?? "") !== (emptyForm[f.name] ?? "")),
    [form, fields, emptyForm]
  );

  const [isPending, startTransition] = useTransition();
  // API yo'lini xavfsiz DOM id'siga aylantiramiz (`/api/projects` → `api-projects`)
  const slug = useMemo(() => apiPath.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, ""), [apiPath]);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetch(`${apiPath}?all=1`, { signal, cache: "no-store" });
        if (!res.ok) throw new Error(res.status === 401 ? "Sessiya eskirgan — qaytadan kiring." : "Ro'yxatni yuklab bo'lmadi.");
        const data: unknown = await res.json();
        setRows(Array.isArray(data) ? (data as Row[]) : []);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setLoadError((err as Error)?.message ?? "Tarmoq xatosi");
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [apiPath]
  );

  useEffect(() => {
    const ac = new AbortController();
    // load() ichidagi barcha setState chaqiruvlari `await`'dan keyin ishlaydi;
    // bu — mount'da bir martalik ma'lumot yuklash, render sikli emas.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  // Saqlanmagan o'zgarish (form ochiq va to'ldirilgan bo'lsa)
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      columns.some((c) => String(r[c.key] ?? "").toLowerCase().includes(q))
    );
  }, [rows, columns, query]);

  function startEdit(row: Row) {
    const next: Record<string, string | number | boolean> = {};
    for (const f of fields) next[f.name] = (row[f.name] as string | number | boolean) ?? emptyForm[f.name] ?? "";
    setForm(next);
    setEditingId(row.id);
    setFieldErrors({});
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  /** Qo'ldan chaqirilganda: skeleton + qayta yuklash */
  const reload = useCallback(() => {
    setLoading(true);
    setLoadError("");
    startTransition(() => {
      void load();
    });
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFieldErrors({});
  }

  function setField(name: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    try {
      const payload: Record<string, unknown> = { ...form };
      for (const f of fields) if (f.type === "number") payload[f.name] = Number(payload[f.name]) || 0;

      const res = await fetch(editingId ? `${apiPath}/${editingId}` : apiPath, {
        method: editingId ? "PUT" : "POST",
        ...json({ body: JSON.stringify(payload) }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 422 && data?.fields) setFieldErrors(data.fields);
        push({ variant: "error", title: data?.error || "Saqlab bo'lmadi", description: "Maydonlarni tekshirib qayta urinib ko'ring." });
        return;
      }

      push({ variant: "success", title: editingId ? "O'zgarish saqlandi" : "Qo'shildi" });
      resetForm();
      await load();
    } catch {
      push({ variant: "error", title: "Internet aloqasi uzilgan" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    const ok = await confirm({
      title: "O'chirilsinmi?",
      description: `${String(row[primary] ?? "")} — bu amalni qaytarish faqat "Bekor qilish" orqali mumkin.`,
      confirmLabel: "O'chirish",
      cancelLabel: "Saqlab qo'yish",
      danger: true,
    });
    if (!ok) return;

    const snapshot = { ...row };
    setBusyId(row.id);
    try {
      const res = await fetch(`${apiPath}/${row.id}`, { method: "DELETE", ...json({ body: "{}" }) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? "O'chirib bo'lmadi");
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      if (editingId === row.id) resetForm();
      push({
        variant: "info",
        title: "O'chirildi",
        description: String(snapshot[primary] ?? ""),
        actionLabel: "Qaytarish",
        onAction: async () => {
          const restorable: Record<string, unknown> = { ...snapshot };
          delete restorable.id;
          const r = await fetch(apiPath, { method: "POST", ...json({ body: JSON.stringify(restorable) }) });
          if (r.ok) {
            push({ variant: "success", title: "Qaytarildi" });
            await load();
          } else {
            push({ variant: "error", title: "Qaytarib bo'lmadi" });
          }
        },
      });
    } catch (err) {
      push({ variant: "error", title: (err as Error).message });
    } finally {
      setBusyId(null);
    }
  }

  async function toggleStatus(row: Row) {
    if (!statusField) return;
    setBusyId(row.id);
    try {
      const res = await fetch(`${apiPath}/${row.id}`, {
        method: "PATCH",
        ...json({ body: JSON.stringify({ [statusField.name]: !row[statusField.name] }) }),
      });
      if (!res.ok) throw new Error("Amalni bajarib bo'lmadi");
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [statusField.name]: !r[statusField.name] } : r)));
    } catch (err) {
      push({ variant: "error", title: (err as Error).message });
    } finally {
      setBusyId(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const a = next[index]!;
    const b = next[target]!;
    next[index] = b;
    next[target] = a;
    const previous = rows;
    setRows(next);
    try {
      const res = await fetch(`${apiPath}/reorder`, {
        method: "POST",
        ...json({ body: JSON.stringify({ ids: next.map((r) => r.id) }) }),
      });
      if (!res.ok) throw new Error("Tartibni saqlab bo'lmadi");
      await load();
    } catch (err) {
      setRows(previous);
      push({ variant: "error", title: (err as Error).message });
    }
  }

  return (
    <div className="stack gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-display-m">{title}</h1>
          {description ? <p className="mt-1.5 max-w-xl text-small text-ink-2">{description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <label htmlFor={`${slug}-search`} className="sr-only">
              Qidirish
            </label>
            <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              id={`${slug}-search`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidirish…"
              className="input !w-52 pl-9 text-small"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              formRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();
            }}
            className="btn btn--accent btn--sm"
          >
            <Icon name="plus" size={14} />
            Qo&apos;shish
          </button>
        </div>
      </div>

      <div ref={formRef}>
        <Card className="p-5" interactive={false}>
          <form onSubmit={onSubmit} noValidate className="stack gap-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="display text-title font-semibold">
                {editingId ? "Yozuvni tahrirlash" : "Yangi yozuv"}
              </h2>
              {dirty ? (
                <span className="chip chip--accent">
                  <Icon name="info" size={11} />
                  Saqlanmagan
                </span>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Field
                    {...f}
                    value={form[f.name] ?? ""}
                    error={fieldErrors[f.name]}
                    disabled={saving}
                    onChange={(v) => setField(f.name, v)}
                  />
                </div>
              ))}
            </div>

            {fieldErrors._ ? <p className="field__error">{fieldErrors._}</p> : null}

            <div className="flex flex-wrap items-center gap-2.5 border-t border-line-1 pt-4">
              <button type="submit" className="btn btn--accent" disabled={saving} aria-busy={saving}>
                <Icon name="save" size={15} />
                {saving ? "Saqlanmoqda…" : editingId ? "Saqlash" : "Qo'shish"}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="btn" disabled={saving}>
                  <Icon name="close" size={14} />
                  Bekor qilish
                </button>
              ) : null}
            </div>
          </form>
        </Card>
      </div>

      <Card className="overflow-hidden !rounded-3" interactive={false} aria-busy={isPending || undefined}>
        {loading ? (
          <div className="stack gap-2 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12" rounded="rounded-2" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <p className="flex items-center gap-2.5 text-body text-danger">
              <Icon name="alert" size={16} />
              {loadError}
            </p>
            <button type="button" onClick={reload} className="btn btn--sm">
              <Icon name="undo" size={14} />
              Qayta urinish
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center">
            <p className="display text-title font-semibold">{rows.length === 0 ? "Hali yozuv yo'q" : "Hech narsa topilmadi"}</p>
            <p className="mt-1.5 text-small text-ink-2">
              {rows.length === 0
                ? "Yuqoridagi forma orqali birinchi yozuvni qo'shing."
                : "Qidiruv so'zini o'zgartirib ko'ring."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-small">
              <caption className="sr-only">{title} ro‘yxati</caption>
              <thead>
                <tr className="border-b border-line-1 bg-canvas/60">
                  {reorderable ? <th scope="col" className="w-10 p-3" /> : null}
                  {columns.map((c) => (
                    <th key={c.key} scope="col" className="label whitespace-nowrap p-3 text-left">
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="p-3 text-right">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-line-1 transition-colors last:border-0 hover:bg-surface-2 ${
                      editingId === row.id ? "bg-accent-soft/40" : ""
                    }`}
                  >
                    {reorderable ? (
                      <td className="p-2 align-middle">
                        <span className="stack gap-0.5">
                          <button
                            type="button"
                            onClick={() => move(i, -1)}
                            disabled={busyId === row.id || i === 0 || query !== ""}
                            aria-label={`Yuqoriga: ${String(row[primary] ?? row.id)}`}
                            className="icon-btn !size-7 disabled:opacity-30"
                          >
                            <Icon name="chevron-up" size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(i, 1)}
                            disabled={busyId === row.id || i === rows.length - 1 || query !== ""}
                            aria-label={`Pastga: ${String(row[primary] ?? row.id)}`}
                            className="icon-btn !size-7 disabled:opacity-30"
                          >
                            <Icon name="chevron-down" size={12} />
                          </button>
                        </span>
                      </td>
                    ) : null}
                    {columns.map((c) => {
                      const value = row[c.key];
                      return (
                        <td key={c.key} className="p-3 align-top">
                          {c.kind === "bool" ? (
                            value ? (
                              <span className="chip chip--accent">Ha</span>
                            ) : (
                              <span className="text-ink-3">—</span>
                            )
                          ) : c.kind === "image" ? (
                            String(value || "") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={String(value)} alt="" className="h-9 w-14 rounded-1 border border-line-1 object-cover" loading="lazy" />
                            ) : (
                              <span className="text-ink-3">—</span>
                            )
                          ) : c.kind === "number" ? (
                            <span className="u-num">{String(value ?? "")}</span>
                          ) : (
                            <span className={c.clamp || c.kind === "long" ? "block max-w-[26rem] line-clamp-2 text-ink-2" : "font-medium"}>
                              {String(value ?? "")}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2 text-right whitespace-nowrap">
                      {statusField ? (
                        <button
                          type="button"
                          onClick={() => toggleStatus(row)}
                          disabled={busyId === row.id}
                          className="btn btn--ghost btn--sm mr-1"
                        >
                          {row[statusField.name] ? statusField.offLabel : statusField.onLabel}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="icon-btn !size-9 hover:text-accent-text"
                        aria-label={`Tahrirlash: ${String(row[primary] ?? row.id)}`}
                      >
                        <Icon name="pencil" size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(row)}
                        disabled={busyId === row.id}
                        className="icon-btn !size-9 hover:text-danger"
                        aria-label={`O'chirish: ${String(row[primary] ?? row.id)}`}
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-small text-ink-3">
        {rows.length} ta yozuv{query ? ` · ${visible.length} ta mos keldi` : ""}
      </p>
    </div>
  );
}
