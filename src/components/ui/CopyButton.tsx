"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type Props = {
  value: string;
  label?: string;
  className?: string;
};

type PolicyDoc = Document & {
  permissionsPolicy?: { allowsFeature: (feature: string) => boolean };
  featurePolicy?: { allowsFeature: (feature: string) => boolean };
};

/** Preview iframe ota-sahifasi clipboard-write ni yopsachi — writeText umuman chaqirilmasin. */
function inEmbeddedFrame(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function clipboardApiAllowed(): boolean {
  if (typeof navigator === "undefined" || !window.isSecureContext) return false;
  if (typeof navigator.clipboard?.writeText !== "function") return false;
  if (inEmbeddedFrame()) {
    const doc = document as PolicyDoc;
    try {
      if (doc.permissionsPolicy?.allowsFeature) {
        return doc.permissionsPolicy.allowsFeature("clipboard-write");
      }
      if (doc.featurePolicy?.allowsFeature) {
        return doc.featurePolicy.allowsFeature("clipboard-write");
      }
    } catch {
      /* ignore */
    }
    return false;
  }
  return true;
}

function copyWithExecCommand(value: string) {
  const ta = document.createElement("textarea");
  ta.value = value;
  ta.setAttribute("readonly", "");
  ta.setAttribute("aria-hidden", "true");
  ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, value.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } finally {
    ta.remove();
  }
  if (!ok) throw new Error("copy failed");
}

/**
 * Bir bosishda nusxa olish (email / telegram username).
 * Skrinridder uchun `aria-live` e'lon beradi — clipboard API nativ
 * tasdiq oynasiz ishlaydi, shuning uchun o'zimiz vizual + audio-sifatli
 * fikr-mulohaza beramiz.
 */
export default function CopyButton({ value, label = "Nusxa olish", className = "" }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      if (clipboardApiAllowed()) {
        await navigator.clipboard.writeText(value);
      } else {
        copyWithExecCommand(value);
      }
      setState("copied");
    } catch {
      try {
        copyWithExecCommand(value);
        setState("copied");
      } catch {
        setState("failed");
      }
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
