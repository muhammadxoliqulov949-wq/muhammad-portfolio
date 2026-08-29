"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./ui/Icon";

/**
 * Portret yuklash — faqat admin paneli va admin kirgan holatda ko'rinadi.
 *
 * Nima qiladi: faylni tanlash/sürülib tashlash/qop-qo'yish (⌘/Ctrl+V) →
 * `POST /api/media/portrait` (multipart) → server rasmni 4:5 freymga kesib,
 * ~1100×1375 JPEG'ga aylantiradi va DB'ga saqlaydi. Rasm DB'da saqlanadi,
 * chunki Vercel'da fayl tizimi read-only.
 *
 * Bitta qoida: bu yerdagi hech narsa faylni brauzerda saqlab qolmaydi va
 * yuklanmagan holda eskinisini o'chirmaydi.
 */

const MAX_INPUT_MB = 8;

type Props = {
  /** Hozirgi portret manzili (`portraitOf()` natijasi) — bo'lmasa monogram */
  current?: string | null;
  /** Monogram uchun (rasm bo'lmagan holatda ko'rsatiladi) */
  initials?: string;
  /** Kichik rejim: dialog ichida (sarlavhasiz) */
  compact?: boolean;
  /** Muvaffaqiyatli yuklash/ochirishdan keyin (toast + router.refresh) */
  onChanged?: (info?: { url?: string; bytes: number; width: number; height: number }) => void;
  onError?: (message: string) => void;
};

type State = { kind: "idle" | "busy" | "error" | "done"; message?: string };

export default function PortraitUpload({ current, initials = "M", compact, onChanged, onError }: Props) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const busy = state.kind === "busy";

  useEffect(() => () => xhrRef.current?.abort(), []);

  const send = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setState({ kind: "error", message: "Faqat rasm fayllari: jpg, png yoki webp" });
        return;
      }
      if (file.size > MAX_INPUT_MB * 1024 * 1024) {
        setState({ kind: "error", message: `Fayl ${MAX_INPUT_MB} MB dan katta — avval siqib tashlang` });
        return;
      }

      const form = new FormData();
      form.append("file", file);

      // fetch'da yuklash progressi yo'q — shuning uchun XHR (katta fayl
      // tanlanganda «nimadir bo'lyaptimi» savoli qolmasligi uchun).
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      xhr.open("POST", "/api/media/portrait");
      xhr.responseType = "text";
      xhr.upload.onprogress = (e) => setProgress(e.lengthComputable ? Math.round((e.loaded / e.total) * 100) : 0);
      xhr.onload = () => {
        xhrRef.current = null;
        setProgress(0);
        if (xhr.status >= 200 && xhr.status < 300) {
          setState({ kind: "done", message: "Yuklandi — sayt 1 daqiqada yangilanadi" });
          let info: { url?: string; bytes: number; width: number; height: number } | undefined;
          try {
            info = JSON.parse(xhr.responseText);
          } catch {
            info = undefined;
          }
          onChanged?.(info);
        } else {
          let msg = `Yuklab bo'lmadi (HTTP ${xhr.status})`;
          try {
            const data = JSON.parse(xhr.responseText) as { error?: string; fields?: Record<string, string> };
            msg = data.fields?.file ?? data.error ?? msg;
          } catch {
            /* javob JSON bo'lmasa — umumiy xabar qoladi */
          }
          setState({ kind: "error", message: msg });
          onError?.(msg);
        }
      };
      xhr.onerror = () => {
        xhrRef.current = null;
        setProgress(0);
        setState({ kind: "error", message: "Aloqa uzildi — qayta urinib ko'ring" });
      };
      setState({ kind: "busy" });
      xhr.send(form);
    },
    [onChanged, onError]
  );

  const remove = useCallback(async () => {
    setState({ kind: "busy" });
    const res = await fetch("/api/media/portrait", { method: "DELETE" }).catch(() => null);
    if (res?.ok) {
      setState({ kind: "idle" });
      onChanged?.();
      return;
    }
    setState({ kind: "error", message: "O'chirib bo'lmadi" });
  }, [onChanged]);

  // Dialog/panela ochiq bo'lganda ⌘V bilan rasm qo'yish mumkin
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (!file) return;
      e.preventDefault();
      send(file);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [send]);

  const statusId = "portrait-status";

  return (
    <div className={compact ? "stack gap-3" : "stack gap-4"}>
      <div
        data-drag={dragging || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && !busy) send(file);
        }}
        className="portrait-drop relative overflow-hidden rounded-3 border border-dashed border-line-2 bg-surface-2 p-4"
      >
        <div className="flex items-center gap-4">
          <div className="portrait-preview relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-2 border border-line-1 bg-canvas">
            {current ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current} alt="Hozirgi portret" className="size-full object-cover" />
            ) : (
              <span className="grid size-full place-items-center font-mono text-[15px] font-bold text-ink-3">
                {initials.slice(0, 2).toUpperCase() || "M"}
              </span>
            )}
            {busy ? (
              <span className="absolute inset-x-0 bottom-0 h-1 bg-line-1">
                <span
                  className="block h-full bg-accent transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                  aria-hidden
                />
              </span>
            ) : null}
          </div>

          <div className="min-w-0 flex-1 stack gap-2.5">
            <p className="text-small text-ink-2">
              {current
                ? "Faylni bu yerga tashlang yoki tanlang — eski portret yangisiga almashtiriladi."
                : "Portret hozircha yoʻq. Faylni tashlang yoki tanlang — u 4:5 freymga avtomatik kesiladi."}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="btn btn--accent btn--sm"
              >
                <Icon name={busy ? "clock" : "arrow-up"} size={14} />
                {busy ? `Yuklanmoqda… ${progress ? `${progress}%` : ""}` : current ? "Almashtirish" : "Rasm tanlash"}
              </button>
              {current ? (
                <button type="button" onClick={remove} disabled={busy} className="btn btn--ghost btn--sm">
                  <Icon name="close" size={14} />
                  Oʻchirish
                </button>
              ) : null}
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) send(file);
                }}
              />
            </div>
            <p className="text-micro text-ink-3">
              jpg · png · webp · {MAX_INPUT_MB} MB gacha · {compact ? "yoki ⌘V" : "yoki bu yerga ⌘V bilan qoʻying"}
            </p>
          </div>
        </div>
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {state.message ?? ""}
      </p>
      {state.kind === "error" || state.kind === "done" ? (
        <p
          className={`text-small ${state.kind === "error" ? "text-danger" : "text-success"}`}
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
