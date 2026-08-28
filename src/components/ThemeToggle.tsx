"use client";

import { useEffect, useState } from "react";
import Icon from "./ui/Icon";

type Theme = "dark" | "light";

/**
 * Tema almashtirgich (audit P1-8: sayt dark-only edi).
 * Qiymat localStorage'da saqlanadi, `layout.tsx` dagi bootstrap skripti
 * uni bo'yashdan oldin o'qiydi → FOUC yo'q.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const read = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "light" || attr === "dark") return setTheme(attr);
      return setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    };
    read();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private rejim — e'tibor bermaymiz */
    }
    setTheme(next);
  }

  if (theme === null) {
    return <span className="icon-btn" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="icon-btn"
      aria-label={theme === "dark" ? "Yorug' temaga o'tish" : "Qorong' temaga o'tish"}
      title={theme === "dark" ? "Yorug' tema" : "Qorong' tema"}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
    </button>
  );
}
