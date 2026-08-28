import Image from "next/image";
import Link from "next/link";
import SectionHead from "./ui/Section";
import Card from "./ui/Card";
import Icon from "./ui/Icon";
import { safeHref, techOf, type Project } from "@/lib/content";

/** Loyiha rasmi yoki monogram fallback (buzuk rasm ko'rsatmaslik uchun). */
function Cover({ project, priority = false }: { project: Project; priority?: boolean }) {
  const img = safeHref(project.image);
  if (img) {
    return (
      <Image
        src={img}
        alt={`${project.title} — loyiha ko'rinishi`}
        fill
        priority={priority}
        sizes="(min-width: 64rem) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
      />
    );
  }
  return (
    <div
      className="grid h-full w-full place-items-center bg-[radial-gradient(130%_110%_at_15%_0%,var(--c-accent-soft),transparent_55%),linear-gradient(160deg,var(--c-surface-2),var(--c-surface-1))]"
      aria-hidden
    >
      <span className="display text-[clamp(3.5rem,8vw,6.5rem)] leading-none text-ink-2/60">
        {(project.title || "P").trim().charAt(0)}
      </span>
    </div>
  );
}

function Tags({ tech }: { tech: string | null }) {
  const items = techOf(tech).slice(0, 5);
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t}>
          <span className="chip">{t}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Loyihalar — bento (katta featured + qolganlari), har birida rol, yil va
 * **o'lchanadigan natija**. Kartalar case study sahifasiga o'tadi.
 *
 * Audit tuzatishlari: butun kartani `<a>` ichiga olish o'rniga "stretched
 * link" (ichida yana havolalar bo'lgani uchun invalid HTML va "yolg'on
 * affordance" yuzaga kelardi — P1-10), hamda `next/image` + `sizes`.
 */
export default function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <section id="work" className="u-section">
        <div className="u-container">
          <SectionHead index="01" eyebrow="Ishlar" title="Hali ochiq holatda" lead="Birinchi buyurtma uchun tayyorman — pastdagi forma orqali yozing." />
        </div>
      </section>
    );
  }

  const [featured, ...rest] = projects;
  const links: { href: string; label: string }[] = [];
  const demoHref = safeHref(featured.link);
  const codeHref = safeHref(featured.github);
  if (demoHref) links.push({ href: demoHref, label: "Jonli demo" });
  if (codeHref) links.push({ href: codeHref, label: "Kod" });

  return (
    <section id="work" className="u-section u-cv">
      <div className="u-container">
        <SectionHead
          index="01"
          eyebrow="Tanlangan ishlar"
          title={
            <>
              Uch yilda <span className="display-em">eng muhim</span> to&apos;rt tasi
            </>
          }
          lead="Har bir loyihada muammo, texnik yechim va raqam bilan natija ko'rsatilgan — kartani bosing."
          action={
            <Link href="/projects" className="btn btn--sm">
              Barcha ishlar
              <Icon name="arrow-up-right" size={14} />
            </Link>
          }
        />

        <div className="bento">
          <div data-span="full" className="reveal">
            <Card href={`/projects/${featured.id}`} className="group grid overflow-hidden !rounded-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              <div className="relative min-h-[240px] overflow-hidden border-b border-line-1 bg-surface-2 lg:border-b-0 lg:border-r">
                <Cover project={featured} priority />
                <span className="chip chip--accent absolute left-4 top-4 backdrop-blur-sm">
                  <Icon name="star" size={11} />
                  Asosiy loyiha
                </span>
              </div>

              <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
                <div>
                  <div className="label mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {featured.year ? <span className="u-num">{featured.year}</span> : null}
                    {featured.role ? <span>{featured.role}</span> : null}
                  </div>
                  <h3 className="display text-display-m">
                    {/* Stretched link: butun karta bosiladigan, lekin HTML valid */}
                    <span className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent-text transition-colors">
                      {featured.title}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-prose text-body text-ink-2">{featured.description}</p>
                </div>

                {featured.impact ? (
                  <p className="flex items-start gap-2.5 border-t border-line-1 pt-4 text-body">
                    <Icon name="target" size={16} className="mt-0.5 shrink-0 text-accent-text" />
                    <span>
                      <span className="font-semibold">{featured.impact}</span>
                    </span>
                  </p>
                ) : null}

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <Tags tech={featured.tech} />
                  <span className="flex items-center gap-3">
                    {links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--sm"
                      >
                        {l.label}
                        <Icon name="arrow-up-right" size={13} />
                      </a>
                    ))}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {rest.map((p) => (
            <div key={p.id} data-span="third" className="reveal">
              <Card href={`/projects/${p.id}`} className="group flex h-full flex-col overflow-hidden !rounded-4">
                <div className="relative aspect-16/10 overflow-hidden border-b border-line-1 bg-surface-2">
                  <Cover project={p} />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <div className="label mb-2.5 flex items-center gap-3">
                      {p.year ? <span className="u-num">{p.year}</span> : null}
                      {p.role ? <span className="truncate">{p.role}</span> : null}
                    </div>
                    <h3 className="display text-title font-semibold">
                      <span className="after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-accent-text">
                        {p.title}
                      </span>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-small text-ink-2">{p.description}</p>
                  </div>
                  {p.impact ? (
                    <p className="mt-auto flex items-start gap-2 border-t border-line-1 pt-3 text-small text-ink-2">
                      <Icon name="target" size={13} className="mt-0.5 shrink-0 text-accent-text" />
                      {p.impact}
                    </p>
                  ) : null}
                  <Tags tech={p.tech} />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
