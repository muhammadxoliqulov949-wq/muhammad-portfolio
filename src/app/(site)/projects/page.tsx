import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SectionHead from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { getSiteData, safeHref, techOf } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Barcha ishlar",
  description: "Tanlangan loyihalar ro'yxati: rol, yil, stek va o'lchanadigan natija bilan.",
  alternates: { canonical: "/projects" },
};

/** Ishlar arxivi — bosh sahifada faqat tanlanganlar, bu yerda hammasi. */
export default async function ProjectsIndexPage() {
  const { projects } = await getSiteData();

  return (
    <div className="pt-[calc(var(--header-h)+3rem)] pb-[var(--section-y)]">
      <div className="u-container">
        <SectionHead
          index="Arxiv"
          eyebrow="Barcha ishlar"
          title={
            <>
              {projects.length} ta loyiha,{" "}
              <span className="display-em">har birida natija</span>
            </>
          }
          lead="Har bir karta case study'ga o'tadi: muammo → yechim → raqam bilan natija."
          action={
            <Link href="/#contact" className="btn btn--sm">
              Shunga o&apos;xshash ish
              <Icon name="arrow-up-right" size={14} />
            </Link>
          }
        />

        {projects.length === 0 ? (
          <Card className="p-8 text-center" interactive={false}>
            <p className="text-ink-2">Hozircha chop etilgan loyiha yo‘q.</p>
          </Card>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {projects.map((p) => {
              const img = safeHref(p.image);
              const tech = techOf(p.tech).slice(0, 4);
              return (
                <li key={p.id} className="reveal">
                  <Card href={`/projects/${p.id}`} className="group flex gap-5 p-4 md:p-5">
                    <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-2 border border-line-1 bg-surface-2 md:w-32">
                      {img ? (
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="10rem"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="display grid h-full place-items-center text-3xl text-ink-2/70" aria-hidden>
                          {p.title.trim().charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="label mb-1.5 flex items-center gap-3">
                        {p.year ? <span className="u-num">{p.year}</span> : null}
                        {p.role ? <span className="truncate">{p.role}</span> : null}
                      </p>
                      <h2 className="display text-title font-semibold">
                        <span className="after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-accent-text">
                          {p.title}
                        </span>
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-small text-ink-2">{p.description}</p>
                      {p.impact ? (
                        <p className="mt-3 flex items-start gap-1.5 text-small text-accent-text">
                          <Icon name="target" size={13} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{p.impact}</span>
                        </p>
                      ) : null}
                      {tech.length > 0 ? (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {tech.map((t) => (
                            <li key={t}>
                              <span className="chip">{t}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
