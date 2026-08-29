import type { MetadataRoute } from "next";
import { getPublishedProjectIds } from "@/lib/content";

/**
 * Sitemap — bosh sahifa + ishlar arxivi + har bir case study.
 * `revalidate` tufayli bu ham DB'ga urib-turmaydi.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  let ids: { id: number }[] = [];
  try {
    ids = await getPublishedProjectIds();
  } catch {
    // DB mavjud bo'lmasa ham sitemap ishlashi kerak
  }

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...ids.map((p) => ({
      url: `${base}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
