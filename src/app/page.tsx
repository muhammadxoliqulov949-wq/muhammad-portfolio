import { db } from "@/db";
import { profile, projects, skills, services, experience, testimonials } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const p = await db.select().from(profile).get();
  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.order))
    .all();
  const skillList = await db.select().from(skills).orderBy(asc(skills.order)).all();
  const serviceList = await db.select().from(services).orderBy(asc(services.order)).all();
  const experienceList = await db.select().from(experience).orderBy(asc(experience.order)).all();
  const testimonialList = await db.select().from(testimonials).orderBy(asc(testimonials.order)).all();

  const data = {
    fullName: p?.fullName ?? "Muhammad",
    title: p?.title ?? "Full-stack dasturchi",
    role2: p?.role2 ?? "",
    role3: p?.role3 ?? "",
    badge: p?.badge ?? "Portfolio sayt",
    bio: p?.bio ?? "",
    avatarInitials: p?.avatarInitials ?? "MX",
    photoUrl: p?.photoUrl ?? "",
    email: p?.email ?? "yourname@example.com",
    telegram: p?.telegram ?? "@yourusername",
    github: p?.github ?? "",
    linkedin: p?.linkedin ?? "",
    instagram: p?.instagram ?? "",
    location: p?.location ?? "",
    resumeUrl: p?.resumeUrl ?? "",
    statProjects: p?.statProjects ?? "5+",
    statExperience: p?.statExperience ?? "2 yil",
    statAvailability: p?.statAvailability ?? "24/7",
  };

  const sortedProjects = [...projectList].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <>
      <Header fullName={data.fullName} initials={data.avatarInitials} />

      <main className="flex-1">
        <Hero data={data} />
        <Marquee skills={skillList} />

        {/* Ko'nikmalar */}
        <section id="skills" className="pf-container py-20 md:py-24">
          <Reveal>
            <Skills skills={skillList} bio={data.bio} location={data.location} email={data.email} />
          </Reveal>
        </section>

        {/* Xizmatlar */}
        <section id="services" className="relative py-20 md:py-24 border-y border-[var(--border)] bg-[rgba(8,12,26,0.4)]">
          <div className="pf-orb w-[420px] h-[420px] -top-24 right-0" style={{ background: "rgba(30,107,255,0.12)" }} aria-hidden />
          <div className="pf-container relative z-10">
            <Reveal className="mb-12">
              <span className="pf-kicker">Xizmatlar</span>
              <h2 className="pf-title text-[clamp(28px,4vw,42px)] mb-4">
                Sizga qanday <span className="pf-grad-text">yordam bera olaman?</span>
              </h2>
              <p className="pf-muted max-w-2xl">
                G&apos;oyadan to tayyor mahsulotgacha — butun jarayonni bir joyda boshqaraman. Aniq muddat va sifat kafolati bilan.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <Services services={serviceList} />
            </Reveal>
          </div>
        </section>

        {/* Tajriba */}
        <section id="experience" className="pf-container py-20 md:py-24">
          <Reveal className="mb-12">
            <span className="pf-kicker">Tajriba</span>
            <h2 className="pf-title text-[clamp(28px,4vw,42px)] mb-4">
              Ishlash <span className="pf-grad-text">yo&apos;lim</span>
            </h2>
            <p className="pf-muted max-w-2xl">Har bir bosqich meni bugungi darajamga olib keldi.</p>
          </Reveal>
          <Reveal delay={120}>
            <Experience items={experienceList} />
          </Reveal>
        </section>

        {/* Loyihalar */}
        <section id="projects" className="relative py-20 md:py-24 border-y border-[var(--border)] bg-[rgba(8,12,26,0.4)]">
          <div className="pf-orb w-[400px] h-[400px] top-0 -left-40" style={{ background: "rgba(0,183,255,0.1)" }} aria-hidden />
          <div className="pf-container relative z-10">
            <Reveal className="mb-12">
              <span className="pf-kicker">Loyihalar</span>
              <h2 className="pf-title text-[clamp(28px,4vw,42px)] mb-4">
                So&apos;nggi <span className="pf-grad-text">ishlarim</span>
              </h2>
              <p className="pf-muted max-w-2xl">
                Mana bir nechta loyihalarim — har biri o&apos;z muammosini hal qilish uchun ishlab chiqilgan.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <Projects projects={sortedProjects} />
            </Reveal>
          </div>
        </section>

        {/* Fikrlar */}
        <section id="testimonials" className="pf-container py-20 md:py-24">
          <Reveal className="mb-12">
            <span className="pf-kicker">Mijozlar fikri</span>
            <h2 className="pf-title text-[clamp(28px,4vw,42px)] mb-4">
              Ular <span className="pf-grad-text">mendan mamnun</span>
            </h2>
            <p className="pf-muted max-w-2xl">Hamkorlik qilgan mijozlarimning fikrlari — eng yaxshi tavsiya.</p>
          </Reveal>
          <Reveal delay={120}>
            <Testimonials items={testimonialList} />
          </Reveal>
        </section>

        {/* Aloqa */}
        <section id="contact" className="relative py-20 md:py-24 border-t border-[var(--border)] bg-[rgba(8,12,26,0.4)]">
          <div className="pf-grid-bg absolute inset-0" aria-hidden />
          <div className="pf-orb w-[460px] h-[460px] -bottom-32 -right-24" style={{ background: "rgba(30,107,255,0.14)" }} aria-hidden />
          <div className="pf-container relative z-10 grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <Reveal>
              <span className="pf-kicker">Aloqa</span>
              <h2 className="pf-title text-[clamp(30px,4.4vw,46px)] mb-5">
                Keling, birga <span className="pf-grad-text">ishlaymiz</span>
              </h2>
              <p className="pf-muted mb-8 max-w-lg">
                Loyihangiz haqida gapirib bering — men 24 soat ichida javob beraman. Dastlabki maslahat bepul.
              </p>

              <div className="space-y-3.5 mb-8">
                <a
                  href={`mailto:${data.email}`}
                  className="pf-card pf-card-hover p-4 flex items-center gap-4"
                >
                  <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-[rgba(0,183,255,0.1)] border border-[rgba(0,183,255,0.25)] text-lg">
                    ✉️
                  </span>
                  <div>
                    <p className="text-xs pf-muted uppercase tracking-wide font-semibold">Email</p>
                    <p className="font-semibold text-[15px]">{data.email}</p>
                  </div>
                </a>
                <a
                  href={data.telegram.startsWith("@") ? `https://t.me/${data.telegram.slice(1)}` : data.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pf-card pf-card-hover p-4 flex items-center gap-4"
                >
                  <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-[rgba(0,183,255,0.1)] border border-[rgba(0,183,255,0.25)] text-lg">
                    ✈️
                  </span>
                  <div>
                    <p className="text-xs pf-muted uppercase tracking-wide font-semibold">Telegram</p>
                    <p className="font-semibold text-[15px]">{data.telegram}</p>
                  </div>
                </a>
                <div className="pf-card p-4 flex items-center gap-4">
                  <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-[rgba(0,183,255,0.1)] border border-[rgba(0,183,255,0.25)] text-lg">
                    📍
                  </span>
                  <div>
                    <p className="text-xs pf-muted uppercase tracking-wide font-semibold">Joylashuv</p>
                    <p className="font-semibold text-[15px]">{data.location}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="pf-card p-7 md:p-8">
                <h3 className="font-display text-xl font-bold mb-1">Xabar qoldiring</h3>
                <p className="pf-muted text-sm mb-6">Quyidagi formani to&apos;ldiring — tez orada javob beraman.</p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer
        fullName={data.fullName}
        initials={data.avatarInitials}
        email={data.email}
        telegram={data.telegram}
        github={data.github}
        linkedin={data.linkedin}
        instagram={data.instagram}
      />
    </>
  );
}
