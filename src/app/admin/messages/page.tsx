"use client";

import { useEffect, useState } from "react";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/messages");
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) setLoading(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function markRead(id: number, read: boolean) {
    await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu xabarni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Xabarlar</h1>
      <p className="pf-muted text-sm mb-6">Aloqa formasi orqali yuborilgan xabarlar.</p>

      {loading ? (
        <p className="pf-muted">Yuklanmoqda...</p>
      ) : messages.length === 0 ? (
        <p className="pf-muted">Hozircha xabarlar yo&apos;q.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {messages.map((m) => (
            <div key={m.id} className={`pf-card p-4 ${m.read ? "opacity-70" : ""}`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold">
                    {m.name} <span className="pf-muted font-normal">— {m.email}</span>
                  </p>
                  <p className="pf-muted text-xs mt-0.5">{new Date(m.createdAt).toLocaleString("uz-UZ")}</p>
                </div>
                {!m.read ? (
                  <span className="text-xs bg-[var(--blue2)] text-black rounded-full px-2 py-0.5 shrink-0">
                    Yangi
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm">{m.message}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => markRead(m.id, !m.read)} className="pf-btn text-sm py-2 px-3">
                  {m.read ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
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
