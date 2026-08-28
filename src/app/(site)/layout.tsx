import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import { getSiteData, sectionsOf } from "@/lib/content";

/**
 * Sayt (public) qobig'i: header + footer bir marta, barcha ochiq
 * sahifalar uchun. `getSiteData()` React cache'i orqali layout va sahifa
 * bitta so'rov to'plamini bo'lishadi.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getSiteData();
  const links = sectionsOf(data).map(({ id, label }) => ({ id, label }));

  return (
    <>
      <Header name={data.profile.fullName || "Portfolio"} initials={data.profile.avatarInitials} links={links} />
      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>
      <Footer profile={data.profile} links={links} />
      <MobileCTA />
    </>
  );
}
