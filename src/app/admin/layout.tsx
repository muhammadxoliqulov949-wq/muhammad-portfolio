import Link from "next/link";
import { cache } from "react";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";
import ToastProvider from "@/components/ui/Toast";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

/** Layout va sahifa bitta so'rovni bo'lishadi. */
const getUnread = cache(async (): Promise<number> => {
  const session = await getSession();
  if (!session) return 0;
  try {
    const rows = await db.select({ id: messages.id }).from(messages).where(eq(messages.read, false)).all();
    return rows.length;
  } catch {
    return 0;
  }
});

/**
 * Admin qobig'i.
 *  - ToastProvider: bildirishnoma va inline tasdiqlash oynasi;
 *  - navigatsiya mobil'da ham ishlaydi (admin nav strip);
 *  - unread xabarlar soni badge ko'rinishida.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  const unread = await getUnread();

  return (
    <ToastProvider>
      <a href="#admin-main" className="skip-link">
        Admin panel kontentiga o&apos;tish
      </a>
      <div className="flex min-h-dvh flex-col bg-canvas">
        <header className="sticky top-0 z-40 border-b border-line-1 bg-canvas/92 backdrop-blur-xl">
          <div className="u-container flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-2">
            <div className="flex min-w-0 items-center gap-4">
              <Link href="/admin" className="flex shrink-0 items-center gap-2.5 rounded-2">
                <span className="grid size-8 place-items-center rounded-2 bg-accent font-mono text-micro font-bold text-accent-ink">
                  AD
                </span>
                <span className="display text-[15px] font-semibold">
                  Admin panel
                </span>
              </Link>
              {session ? <div className="hidden min-w-0 flex-1 justify-center lg:flex"><AdminNav unreadCount={unread} /></div> : null}
            </div>

            <div className="flex items-center gap-2">
              <span className="label hidden items-center gap-1.5 sm:flex">
                <Icon name="shield" size={12} />
                {session ? session.email : "Mehmon"}
              </span>
              <Link href="/" className="btn btn--ghost btn--sm">
                <Icon name="eye" size={14} />
                Saytni ko&apos;rish
              </Link>
              {session ? <LogoutButton /> : null}
            </div>
          </div>

          {session ? (
            <div className="u-container border-t border-line-1 py-2 lg:hidden">
              <AdminNav unreadCount={unread} />
            </div>
          ) : null}
        </header>

        <main id="admin-main" className="u-container flex-1 py-8">
          {children}
        </main>

        <footer className="u-container border-t border-line-1 py-5 text-small text-ink-3">
          Kontent o&apos;zgarishi bosh sahifaga 1 daqiqa ichida chiqadi (ISR + revalidatePath).
        </footer>
      </div>
    </ToastProvider>
  );
}
