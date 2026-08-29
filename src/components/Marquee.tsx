"use client";

import { useState } from "react";
import Icon from "./ui/Icon";

/**
 * Texnologiya lentesi.
 * Audit tuzatishlari: hover-only "pause" o'rniga haqiqiy tugma
 * (aria-pressed), reduced-motion'da umumkan harakatlanmaydi, va
 * kontent skrinridder uchun bitta ro'yxat sifatida o'qiladi
 * (dublikat qatorlar aria-hidden).
 */
export default function Marquee({ names }: { names: string[] }) {
  const [paused, setPaused] = useState(false);
  const items = names.filter(Boolean);
  if (items.length < 4) return null;

  return (
    <div className="border-y border-line-1 bg-canvas-sunken/60">
      <div className="u-container flex items-center gap-4 py-3.5">
        <span className="label hidden shrink-0 items-center gap-2 sm:flex">
          <Icon name="layers" size={13} />
          Stack
        </span>

        <div className="marquee-mask relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee gap-8" data-paused={paused} aria-hidden>
            {[...items, ...items].map((n, i) => (
              <span key={`${n}-${i}`} className="flex shrink-0 items-center gap-8 whitespace-nowrap">
                <span className="font-mono text-small text-ink-2">{n}</span>
                <span className="size-1 rounded-full bg-line-2" />
              </span>
            ))}
          </div>
          {/* AT uchun toza ro'yxat */}
          <ul className="sr-only">
            {items.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          className="icon-btn shrink-0"
          aria-label={paused ? "Lentani davom ettirish" : "Lentani to'xtatish"}
          title={paused ? "Davom ettirish" : "To'xtatish"}
        >
          {paused ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 4l13 8-13 8z" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 4h4v16H7zM13 4h4v16h-4z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
