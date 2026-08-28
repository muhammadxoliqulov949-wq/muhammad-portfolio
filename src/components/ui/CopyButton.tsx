"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type Props = {
  value: string;
  label?: string;
  className?: string;
};

/**
 * Bir bosishda nusxa olish (email / telegram username).
 * Skrinridder uchun `aria-live` e'lon beradi — clipboard API nativ
 * tasdiq oynasiz ishlaydi, shuning uchun o'zimiz vizual + audio-sifatli
 * fikr-mulohaza beramiz.
 */
export default function CopyButton({ value, label = "Nusxa olish", className = "" }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Eski/sifsiz kontekst (http) uchun zaxira yo'l
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`${label}: ${value}`}
        className={`icon-btn !size-9 shrink-0 ${className}`}
      >
        <Icon name={state === "copied" ? "check" : state === "failed" ? "alert" : "copy"} size={15} />
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Nusxa olindi" : state === "failed" ? "Nusxa olib bo'lmadi" : ""}
      </span>
    </>
  );
}
