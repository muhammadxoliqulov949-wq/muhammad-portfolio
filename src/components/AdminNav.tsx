"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADMIN_LINKS = [
  { href: "/admin/portrait", label: "Portret" },
  { href: "/admin", label: "Profil" },
  { href: "/admin/projects", label: "Loyihalar" },
  { href: "/admin/services", label: "Xizmatlar" },
  { href: "/admin/experience", label: "Tajriba" },
  { href: "/admin/skills", label: "Ko'nikmalar" },
  { href: "/admin/education", label: "Ta'lim" },
  { href: "/admin/achievements", label: "Yutuqlar" },
  { href: "/admin/testimonials", label: "Fikrlar" },
  { href: "/admin/messages", label: "Xabarlar" },
];

/**
 * Admin navigatsiyasi — mobil'da gorizontal aylanadigan strip.
 * Audit P0-2: avval `hidden lg:flex` edi va telefon'da 7 bo'limdan 6 tasiga
 * kirib bo'lmas edi.
 */
export default function AdminNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin bo'limlari"
      className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0"
    >
      {ADMIN_LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-[44px] shrink-0 items-center gap-2 rounded-2 px-3.5 text-small font-medium transition-colors ${
              active ? "bg-accent-soft text-accent-text" : "text-ink-2 hover:bg-surface-2 hover:text-ink-1"
            }`}
          >
            {l.label}
            {l.href === "/admin/messages" && unreadCount > 0 ? (
              <span className="u-num grid size-5 place-items-center rounded-full bg-accent text-micro font-bold text-accent-ink">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
