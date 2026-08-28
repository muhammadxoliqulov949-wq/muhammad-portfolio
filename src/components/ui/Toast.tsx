"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";

/**
 * Toast tizimi (audit P1-12: admin'da `alert()` va `confirm()` ishlatilgan,
 * odatiy holatlar esa oddiy matn qatorida ko'rsatilgan edi).
 *
 * `push()` — muvaffaqiyat/xabar; `confirm()` — Promise qaytaradigan
 * inline tasdiqlash oynasi (nativ `confirm()` o'rniga: brendga mos,
 * fokus tuzog'i va Escape bilan).
 */

type Variant = "success" | "error" | "info";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
  actionLabel?: string;
  onAction?: () => void;
};

type ConfirmRequest = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type Ctx = {
  push: (t: Omit<Toast, "id">) => void;
  confirm: (r: ConfirmRequest) => Promise<boolean>;
};

const ToastContext = createContext<Ctx | null>(null);

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast ToastProvider ichida chaqirilishi kerak");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const [request, setRequest] = useState<(ConfirmRequest & { resolve: (v: boolean) => void }) | null>(null);
  const seq = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++seq.current;
      setItems((prev) => [...prev.slice(-3), { ...t, id }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), t.actionLabel ? 8000 : 5000)
      );
    },
    [dismiss]
  );

  const confirm = useCallback((r: ConfirmRequest) => {
    return new Promise<boolean>((resolve) => setRequest({ ...r, resolve }));
  }, []);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ push, confirm }), [push, confirm]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast hududi */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end sm:p-6"
        role="region"
        aria-label="Bildirishnomalar"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`card card--flat pointer-events-auto flex w-full max-w-sm items-start gap-3 p-4 shadow-2 ${
              t.variant === "error" ? "border-l-2 border-l-danger" : t.variant === "success" ? "border-l-2 border-l-success" : ""
            }`}
          >
            <span
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                t.variant === "error" ? "bg-danger-soft text-danger" : t.variant === "success" ? "bg-success-soft text-success" : "bg-surface-2 text-ink-2"
              }`}
            >
              <Icon name={t.variant === "error" ? "alert" : t.variant === "success" ? "check" : "info"} size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold">{t.title}</p>
              {t.description ? <p className="mt-0.5 text-small text-ink-2">{t.description}</p> : null}
              {t.actionLabel ? (
                <button
                  type="button"
                  onClick={() => {
                    t.onAction?.();
                    dismiss(t.id);
                  }}
                  className="link-underline mt-2 text-small"
                >
                  {t.actionLabel}
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-ink-3 transition-colors hover:text-ink-1"
              aria-label="Bildirishnomani yopish"
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        ))}
      </div>

      {request ? <ConfirmDialog request={request} onClose={setRequest} /> : null}
    </ToastContext.Provider>
  );
}

function ConfirmDialog({
  request,
  onClose,
}: {
  request: ConfirmRequest & { resolve: (v: boolean) => void };
  onClose: (v: null) => void;
}) {
  const cancel = () => {
    request.resolve(false);
    onClose(null);
  };
  const accept = () => {
    request.resolve(true);
    onClose(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Bekor qilish"
        className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
        onClick={cancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="card relative w-full max-w-md p-6 shadow-3"
      >
        <h2 id="confirm-title" className="display text-title">
          {request.title}
        </h2>
        {request.description ? (
          <p id="confirm-desc" className="mt-2 text-body text-ink-2">
            {request.description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn--ghost" onClick={cancel} data-autofocus-exit>
            {request.cancelLabel ?? "Bekor qilish"}
          </button>
          <button
            type="button"
            ref={(el) => el?.focus()}
            className={`btn ${request.danger ? "btn--accent" : "btn--accent"}`}
            onClick={accept}
          >
            {request.confirmLabel ?? "Tasdiqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}
