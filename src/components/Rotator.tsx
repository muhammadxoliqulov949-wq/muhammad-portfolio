"use client";

import { useEffect, useState } from "react";

/**
 * Kasb satrlarini almashinib ko'rsatadi (DB'dan: title / role2 / role3).
 *
 * Audit tuzatishlari:
 *  - oldin matn qattiq yozilgan `ROLES` massividan olinardi — admin
 *    tahrirlagan `role2/role3` saytda hech qachon ko'rinmas edi (P0-1);
 *  - cheksiz blinking kursor olib tashlandi (e'tibor bo'luvchi, ekranni
 *    o'qiyotganlar uchun bezovta);
 *  - skrinridder barcha variantlarni bir marta oladi: harakat `aria-hidden`,
 *    to'liq ro'yxat esa `sr-only` ichida.
 */
export default function Rotator({ items, className = "" }: { items: string[]; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 3200);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <p className={`relative ${className}`}>
      <span className="sr-only">{items.join(" · ")}</span>
      <span aria-hidden className="inline-grid">
        {items.map((text, i) => (
          <span
            key={text}
            className="col-start-1 row-start-1 transition-opacity duration-500"
            style={{ opacity: i === index ? 1 : 0, gridArea: "1 / 1" }}
          >
            {text}
          </span>
        ))}
      </span>
    </p>
  );
}
