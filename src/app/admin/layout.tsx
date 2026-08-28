import { getSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)]">
        <div className="w-[92%] max-w-[1100px] mx-auto flex justify-between items-center py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-extrabold">
              Admin <span className="text-[var(--blue2)]">panel</span>
            </Link>
            {session ? (
              <nav className="hidden lg:flex gap-5 pf-muted text-sm">
                <Link href="/admin" className="hover:text-[var(--text)]">
                  Profil
                </Link>
                <Link href="/admin/projects" className="hover:text-[var(--text)]">
                  Loyihalar
                </Link>
                <Link href="/admin/skills" className="hover:text-[var(--text)]">
                  Ko&apos;nikmalar
                </Link>
                <Link href="/admin/services" className="hover:text-[var(--text)]">
                  Xizmatlar
                </Link>
                <Link href="/admin/experience" className="hover:text-[var(--text)]">
                  Tajriba
                </Link>
                <Link href="/admin/testimonials" className="hover:text-[var(--text)]">
                  Fikrlar
                </Link>
                <Link href="/admin/messages" className="hover:text-[var(--text)]">
                  Xabarlar
                </Link>
              </nav>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="pf-muted text-sm hover:text-[var(--text)]">
              Saytni ko&apos;rish ↗
            </Link>
            <Link
              href="/admin/messages"
              className="lg:hidden text-sm text-[var(--blue2)] hover:underline"
            >
              Xabarlar
            </Link>
            {session ? <LogoutButton /> : null}
          </div>
        </div>
      </header>
      <main className="w-[92%] max-w-[1100px] mx-auto flex-1 py-8">{children}</main>
    </div>
  );
}
