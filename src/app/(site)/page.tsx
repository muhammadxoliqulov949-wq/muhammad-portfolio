import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import SectionHead, { Section } from "@/components/ui/Section";
import Services from "@/components/Services";
import Education from "@/components/Education";
import Achievements from "@/components/Achievements";
import Approach from "@/components/Approach";
import Contact from "@/components/Contact";
import { getSiteData } from "@/lib/content";
import { getLocale, t, tx } from "@/lib/i18n";

/**
 * Bosh sahifa — 10 bo'limli struktura (Identitet → Ishonch → Dalil → Harakat).
 *
 * Kontent siyosati: bu sahifada faqat DB'dagi haqiqiy ma'lumot chiqadi.
 * Bo'lim ma'lumoti bo'sh bo'lsa (masalan hozircha mijoz fikri yo'q), blok
 * umuman render bo'lmaydi — "te"lashtirilgan placeholder qo'ymaymiz.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ profile, projects, services, experience, skills, education, achievements }, locale] = await Promise.all([
    getSiteData(),
    getLocale(),
  ]);
  const study = education.find((e) => e.current);

  return (
    <>
      <Hero
        profile={profile}
        locale={locale}
        study={
          study
            ? `${tx(locale, study.status || "Talaba")} · ${study.institution}`
            : undefined
        }
      />

      <About profile={profile} locale={locale} />
      <Skills skills={skills} locale={locale} />
      <Experience items={experience} profile={profile} locale={locale} />
      <Projects projects={projects} locale={locale} />

      {services.length > 0 ? (
        <Section id="services" sunken>
          <SectionHead
            index="05"
            eyebrow={t(locale, "services.eyebrow")}
            title={
              <>
                {t(locale, "services.titleBefore")} {t(locale, "services.titleEm")}
              </>
            }
            lead={t(locale, "services.lead")}
          />
          <Services services={services} locale={locale} />
        </Section>
      ) : null}

      <Education items={education} locale={locale} />
      <Achievements items={achievements} locale={locale} />
      <Approach profile={profile} experience={experience} locale={locale} />
      <Contact profile={profile} locale={locale} />
    </>
  );
}
