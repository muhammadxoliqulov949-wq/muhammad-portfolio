"use client";

import { useEffect, useState } from "react";
import Icon from "./ui/Icon";

/**
 * Mobil uchun yopishqoq CTA (audit P1-14).
 * Aloqa bo'limi ekranga kirganda yo'qoladi — ekranni bekor band qilmaydi.
 */
export default function MobileCTA({ label = "Loyihangizni muhokama qilish" }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | undefined;
    if (contact) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible(false);
        },
        { threshold: 0.08 }
      );
      io.observe(contact);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className={`mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-line-1 bg-canvas/92 px-[var(--gutter)] pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-[130%]"
      }`}
      aria-hidden={!visible}
    >
      <a href="/#contact" tabIndex={visible ? 0 : -1} className="btn btn--accent btn--lg w-full">
        <Icon name="mail" size={16} />
        {label}
      </a>
    </div>
  );
}
