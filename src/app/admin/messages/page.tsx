"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type Filter = "all" | "unread";

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("uz-UZ", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

/**
 * Xabarlar.
 * Audit tuzatishlari: `if (cancelled) setLoading(true)` teskari mantiqi,
 * `res.ok` tekshirilmagani uchun xato bo'sh holat bilan chalkashib ketardi,
 * nativ `confirm()` va filtrlar yo'qligi — hammasi yo'q qilindi.
 */
export default function AdminMessagesPage() {
  const { push, confirm } = useToast();
  const [items, setItems] = useState<Message[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetch(`/api/messages?${filter === "unread" ? "unread=1&" : ""}limit=200`, {
          signal,
          cache: "no-store",
        });
        if (res.status === 401) throw new Error("Sessiya eskirgan — qaytadan kiring.");
        if (!res.ok) throw new Error("Xabarlarni yuklab bo'lmadi.");
        const data: unknown = await res.json();
        setItems(Array.isArray(data) ? (data as Message[]) : []);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") setError((err as Error).message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [filter]
  );

  useEffect(() => {
    const ac = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const unreadCount = useMemo(() => items.filter((m) => !m.read).length, [items]);

  async function toggleRead(m: Message) {
    // Optimistic: bosilganda darhol holat o'zgaradi
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: !x.read } : x)));
    const res = await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    if (!res.ok) {
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: m.read } : x)));
      push({ variant: "error", title: "Holatni saqlab bo'lmadi" });
    }
  }

  async function remove(m: Message) {
    const ok = await confirm({
      title: "Xabar o'chirilsinmi?",
      description: `${m.name} — ${m.email}`,
      confirmLabel: "O'chirish",
      danger: true,
    });
    if (!ok) return;
    const res = await fetch(`/api/messages/${m.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (!res.ok) {
      push({ variant: "error", title: "O'chirib bo'lmadi" });
      return;
    }
    const snapshot = m;
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    push({
      variant: "info",
      title: "Xabar o'chirildi",
      actionLabel: "Qaytarish",
      onAction: async () => {
        // Xabarni qaytarish uchun kontakt API'sidan foydalanamiz (yangi id bilan)
        const r = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: snapshot.name, email: snapshot.email, message: snapshot.message }),
        });
        if (r.ok) {
          push({ variant: "success", title: "Qaytarildi" });
          void load();
        } else {
          push({ variant: "error", title: "Qaytarib bo'lmadi" });
        }
      },
    });
  }

  return (
    <div className="stack gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-display-m">Xabarlar</h1>
          <p className="mt-1.5 text-small text-ink-2">
            Aloqa formasidan kelgan so&apos;rovlar. {unreadCount > 0 ? `${unreadCount} ta o'qilmagan.` : "Barchasi o'qilgan."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="chip gap-0.5 !p-0.5" role="group" aria-label="Filtr">
            {(["all", "unread"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setLoading(true);
                  setFilter(f);
                }}
                aria-pressed={filter === f}
                className={`min-h-[32px] rounded-1 px-3 font-mono text-micro uppercase tracking-wider transition-colors ${
                  filter === f ? "bg-accent text-accent-ink" : "text-ink-2 hover:text-ink-1"
                }`}
              >
                {f === "all" ? "Hammasi" : "O'qilmagan"}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { setLoading(true); void load(); }} className="icon-btn !size-9" aria-label="Yangilash">
            <Icon name="undo" size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="stack gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" rounded="rounded-3" />
          ))}
        </div>
      ) : error ? (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6" interactive={false}>
          <p className="flex items-center gap-2.5 text-danger">
            <Icon name="alert" size={16} />
            {error}
          </p>
          <button type="button" className="btn btn--sm" onClick={() => load()}>
            <Icon name="undo" size={14} />
            Qayta urinish
          </button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center" interactive={false}>
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-line-1 bg-surface-2 text-ink-3">
            <Icon name="mail" size={20} />
          </span>
          <p className="display text-title font-semibold">{filter === "unread" ? "O'qilmagan xabar yo'q" : "Hali xabar yo'q"}</p>
          <p className="mt-1.5 text-small text-ink-2">
            Forma yuborilgan hamma so&apos;rov shu yerda paydo bo&apos;ladi.
          </p>
        </Card>
      ) : (
        <ul className="hairline-x card overflow-hidden !rounded-3 px-0">
          {items.map((m) => {
            const open = openId === m.id;
            return (
              <li key={m.id} className={!m.read ? "bg-accent-soft/25" : undefined}>
                <div className="flex flex-wrap items-start gap-3 px-4 py-3.5 md:px-5">
                  {!m.read ? <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" aria-label="O'qilmagan" /> : null}
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : m.id)}
                    aria-expanded={open}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-body font-semibold">{m.name}</span>
                      <a
                        href={`mailto:${m.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="u-link-quiet text-small text-ink-2"
                      >
                        {m.email}
                      </a>
                      <span className="u-num ml-auto font-mono text-micro uppercase tracking-wider text-ink-3">
                        {fmtDate(m.createdAt)}
                      </span>
                    </span>
                    <span className={`mt-1.5 block whitespace-pre-line text-small text-ink-2 ${open ? "" : "line-clamp-2"}`}>
                      {m.message}
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-1">
                    {open ? (
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent("Sizning xabaringiz")}`} className="btn btn--sm">
                        <Icon name="mail" size={14} />
                        Javob berish
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleRead(m)}
                      className="icon-btn !size-9"
                      aria-label={m.read ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                      title={m.read ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                    >
                      <Icon name={m.read ? "eye" : "check"} size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(m)}
                      className="icon-btn !size-9 hover:text-danger"
                      aria-label={`O'chirish: ${m.name}`}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
