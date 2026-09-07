import CinematicSpine from "@/components/cinematic/CinematicSpine";
import IntroHero from "@/components/cinematic/IntroHero";
import IeltsMockFeature from "@/components/IeltsMockFeature";
import Capabilities from "@/components/Capabilities";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { getSiteData } from "@/lib/content";
import { getLocale, tx } from "@/lib/i18n";

/**
 * Bosh sahifa — 7 beat'li tuzilma (Phase 3A).
 *
 * 1. Intro / Hero          (CinematicSpine → IntroHero)
 * 2. Build Core            (CinematicSpine → BuildCoreSection)
 * 3. Deployment → Product  (CinematicSpine → ProductTransition)
 * 4. IELTS.mock feature    (IeltsMockFeature)
 * 5. Capabilities          (Capabilities)
 * 6. About                 (About)
 * 7. Contact               (Contact)
 *
 * Sahifa asosan server-render; yagona yangi client chegarasi —
 * CinematicSpine. Content CMS'dan, ixtiro yo'q.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ profile, projects, services, skills, experience, education, achievements }, locale] =
    await Promise.all([getSiteData(), getLocale()]);

  const featured = projects[0] ?? null;
  const study = education.find((e) => e.current);

  return (
    <>
      <CinematicSpine project={featured} locale={locale}>
        <IntroHero
          profile={profile}
          locale={locale}
          study={
            study
              ? `${tx(locale, study.status || "Talaba")} · ${study.institution}`
              : undefined
          }
        />
      </CinematicSpine>

      <IeltsMockFeature project={featured} locale={locale} />

      <Capabilities services={services} skills={skills} locale={locale} />

      <About
        profile={profile}
        education={education}
        achievements={achievements}
        experience={experience}
        locale={locale}
      />

      <Contact profile={profile} locale={locale} />
    </>
  );
}
