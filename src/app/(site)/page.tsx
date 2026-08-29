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

/**
 * Bosh sahifa — 10 bo'limli struktura (Identitet → Ishonch → Dalil → Harakat).
 *
 * Kontent siyosati: bu sahifada faqat DB'dagi haqiqiy ma'lumot chiqadi.
 * Bo'lim ma'lumoti bo'sh bo'lsa (masalan hozircha mijoz fikri yo'q), blok
 * umuman render bo'lmaydi — "te"lashtirilgan placeholder qo'ymaymiz.
 */
export const revalidate = 3600;

export default async function HomePage() {
  const { profile, projects, services, experience, skills, education, achievements } = await getSiteData();
  const study = education.find((e) => e.current);

  return (
    <>
      <Hero
        profile={profile}
        study={study ? `${study.status || "Talaba"} · ${study.institution}` : undefined}
      />

      <About profile={profile} />
      <Skills skills={skills} />
      <Experience items={experience} profile={profile} />
      <Projects projects={projects} />

      {services.length > 0 ? (
        <Section id="services" sunken>
          <SectionHead
            index="05"
            eyebrow="Xizmatlar"
            title={
              <>
                Bitta odam, lekin <span className="display-em">toʻliq sikl</span>
              </>
            }
            lead="Agentlik emasman — shuning uchun narx shabloni yoʻq: hajm, muddat va qiymat har loyihada suhbatda aniqlanadi. Evaziga har bosqichda ishlaydigan versiyani koʻrasiz."
          />
          <Services services={services} />
        </Section>
      ) : null}

      <Education items={education} />
      <Achievements items={achievements} />
      <Approach profile={profile} />
      <Contact profile={profile} />
    </>
  );
}
