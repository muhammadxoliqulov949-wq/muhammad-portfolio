import { db } from "@/db";
import { profile, projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const p = await db.select().from(profile).get();
  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.order))
    .all();

  const data = {
    fullName: p?.fullName ?? "Muhammad",
    title: p?.title ?? "Full-stack dasturchi",
    badge: p?.badge ?? "Oddiy portfolio sayt",
    bio: p?.bio ?? "",
    avatarInitials: p?.avatarInitials ?? "MX",
    email: p?.email ?? "yourname@example.com",
    telegram: p?.telegram ?? "@yourusername",
    statProjects: p?.statProjects ?? "5+",
    statExperience: p?.statExperience ?? "2 yil",
    statAvailability: p?.statAvailability ?? "24/7",
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(5,8,22,0.72)] border-b border-[var(--border)]">
        <div className="w-[92%] max-w-[1100px] mx-auto flex justify-between items-center py-4">
          <div className="text-xl font-extrabold tracking-wide">
            MY <span className="text-[var(--blue2)]">PORTFOLIO</span>
          </div>
          <nav className="hidden md:flex gap-6 pf-muted">
            <a href="#about" className="hover:text-[var(--text)]">
              Men haqimda
            </a>
            <a href="#projects" className="hover:text-[var(--text)]">
              Loyihalar
            </a>
            <a href="#contact" className="hover:text-[var(--text)]">
              Aloqa
            </a>
          </nav>
        </div>
      </header>

      <main className="w-[92%] max-w-[1100px] mx-auto flex-1">
        <section className="min-h-[85vh] grid md:grid-cols-[1.2fr_.8fr] gap-8 items-center py-12">
          <div>
            <div className="pf-badge mb-4">{data.badge}</div>
            <h1 className="text-[clamp(40px,7vw,72px)] leading-[1.05] mb-4 font-sans font-bold">
              Salom, men <span className="text-[var(--blue2)]">{data.fullName}</span>.
            </h1>
            <p className="pf-muted text-base">{data.bio}</p>
            <p className="pf-muted text-base mt-1">{data.title}</p>

            <div className="flex gap-3.5 flex-wrap mt-7">
              <a href="#projects" className="pf-btn pf-btn-primary">
                Loyihalar
              </a>
              <a href="#contact" className="pf-btn">
                Bog&apos;lanish
              </a>
            </div>
          </div>

          <div className="pf-card p-6">
            <div className="w-full aspect-square rounded-[20px] bg-gradient-to-br from-[#0d1a3d] via-[#123f82] to-[#00b7ff] grid place-items-center text-7xl font-black text-white">
              {data.avatarInitials}
            </div>
            <div className="grid grid-cols-3 gap-3.5 mt-4">
              <div className="pf-card text-center p-4">
                <strong className="block text-xl text-white mb-1">{data.statProjects}</strong>
                <span className="pf-muted text-sm">Loyiha</span>
              </div>
              <div className="pf-card text-center p-4">
                <strong className="block text-xl text-white mb-1">{data.statExperience}</strong>
                <span className="pf-muted text-sm">Tajriba</span>
              </div>
              <div className="pf-card text-center p-4">
                <strong className="block text-xl text-white mb-1">{data.statAvailability}</strong>
                <span className="pf-muted text-sm">Aloqa</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-10 pb-10">
          <h2 className="text-[28px] mb-4.5 font-bold">Men haqimda</h2>
          <div className="grid md:grid-cols-3 gap-4.5">
            <div className="pf-card p-5.5">
              <h3 className="mb-2.5 text-xl font-semibold">Dizayn</h3>
              <p className="pf-muted">Qora va ko&apos;k ranglarda zamonaviy ko&apos;rinish.</p>
            </div>
            <div className="pf-card p-5.5">
              <h3 className="mb-2.5 text-xl font-semibold">Responsive</h3>
              <p className="pf-muted">Telefon va kompyuterda yaxshi ko&apos;rinadi.</p>
            </div>
            <div className="pf-card p-5.5">
              <h3 className="mb-2.5 text-xl font-semibold">Backend</h3>
              <p className="pf-muted">Ma&apos;lumotlar bazasi va admin panel bilan boshqariladi.</p>
            </div>
          </div>
        </section>

        <section id="projects" className="py-10 pb-10">
          <h2 className="text-[28px] mb-4.5 font-bold">Loyihalar</h2>
          {projectList.length === 0 ? (
            <div className="pf-card p-6">
              <p className="pf-muted">Hozircha loyihalar qo&apos;shilmagan.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4.5">
              {projectList.map((proj) => (
                <div key={proj.id} className="pf-card p-5.5">
                  <h3 className="mb-2.5 text-xl font-semibold">{proj.title}</h3>
                  <p className="pf-muted">{proj.description}</p>
                  {proj.link ? (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[var(--blue2)] font-semibold"
                    >
                      Ko&apos;rish →
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="contact" className="py-10 pb-10">
          <h2 className="text-[28px] mb-4.5 font-bold">Aloqa</h2>
          <div className="grid md:grid-cols-2 gap-4.5">
            <div className="pf-card p-5.5">
              <p className="pf-muted mb-2">Email: {data.email}</p>
              <p className="pf-muted">Telegram: {data.telegram}</p>
            </div>
            <div className="pf-card p-5.5">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center pf-muted py-7 pb-10 border-t border-[var(--border)] mt-2.5">
        © 2026 {data.fullName} — Portfolio sayti
      </footer>
    </>
  );
}
