import Hero from "@/components/Hero";
import SectionHead, { Section } from "@/components/ui/Section";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Toolbox from "@/components/Toolbox";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import { getSiteData } from "@/lib/content";

/**
 * Bosh sahifa.
 *
 * Audit P0-6: avval `force-dynamic` bilan har bir so'rov 6 ta DB so'rovini
 * ketma-ket bajarardi. Endi: ma'lumot parallell + sahifa ISR cache'da
 * (1 soat). Admin'dagi har bir mutatsiya `revalidatePath` bilan darhol
 * yangilaydi — ya'ni "kechikkan kontent" muammosi yo'q.
 */
export const revalidate = 3600;

export default async function HomePage() {
  const { profile, projects, services, experience, skills, testimonials } = await getSiteData();

  return (
    <>
      <Hero profile={profile} />

      {services.length > 0 ? (
        <Section id="services" sunken>
          <SectionHead
            index="02"
            eyebrow="Xizmatlar"
            title={
              <>
                G&apos;oyadan <span className="display-em">tayyor mahsulotgacha</span>
              </>
            }
            lead="Guruh yoki frilans — ish hajmini bosqichlarga bo'lib, aniq narx va sana bilan olaman."
          />
          <Services services={services} />
        </Section>
      ) : null}

      <Projects projects={projects} />
      <Experience items={experience} />
      <Toolbox skills={skills} />
      <Testimonials items={testimonials} />
      <Contact profile={profile} />
    </>
  );
}
