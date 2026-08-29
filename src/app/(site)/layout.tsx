import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import { getSiteData, portraitOf, sectionsOf } from "@/lib/content";
import { getLocale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

/**
 * Sayt (public) qobig'i: header + footer bir marta, barcha ochiq
 * sahifalar uchun. `getSiteData()` React cache'i orqali layout va sahifa
 * bitta so'rov to'plamini bo'lishadi.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [data, locale] = await Promise.all([getSiteData(), getLocale()]);
  const links = sectionsOf(data, locale).map(({ id, label }) => ({ id, label }));

  return (
    <>
      <Header
        name={data.profile.fullName || "Portfolio"}
        initials={data.profile.avatarInitials}
        links={links}
        locale={locale}
        portrait={portraitOf(data.profile)}
      />
      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>
      <Footer profile={data.profile} links={links} locale={locale} />
      <MobileCTA label={t(locale, "hero.cta")} />
    </>
  );
}
