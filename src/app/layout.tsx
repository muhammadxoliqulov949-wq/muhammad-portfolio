import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { getSiteData, phoneHref, socialsOf } from "@/lib/content";
import { getLocale, LOCALE_META, t } from "@/lib/i18n";

/**
 * Shriftlar — audit P1-9: 9 ta static woff2 o'rniga 3 ta VARIABLE fayl.
 *   · Fraunces (display) — SOFT/WONK o'qlari bilan identitet beradi
 *   · Inter (UI/matn)
 *   · JetBrains Mono (leblar, sonlar, tex-log)
 */
const display = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const mono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  const name = profile.fullName || "Portfolio";
  const title = profile.title || "Student & AI Developer";
  const description = `${name} | ${title}. AI-assisted development, web development, AI-powered applications and freelance product work. Tashkent, Uzbekistan.`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} | ${title}`,
      template: `%s | ${name}`,
    },
    description,
    keywords: [
      "AI-assisted development",
      "AI web development",
      "veb-dasturlash",
      "freelance developer Toshkent",
      "React",
      "Node.js",
      "PWA",
      "Gemini API",
      "Oʻzbekiston",
    ],
    authors: [{ name }],
    creator: name,
    openGraph: {
      title: `${name} | ${title}`,
      description,
      url: siteUrl,
      siteName: `${name} — Portfolio`,
      locale: "uz_UZ",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${title}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
    { media: "(prefers-color-scheme: light)", color: "#f8f6f0" },
  ],
  colorScheme: "dark light",
};

/** FOUC'siz tema tanlovi: bo'yash CSS'dan oldin, localStorage + tizim sozlamasidan. */
const THEME_BOOTSTRAP = `(function(){try{var d=document.documentElement;var s=localStorage.getItem('theme');if(s==='light'||s==='dark'){d.setAttribute('data-theme',s);}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){d.setAttribute('data-theme','dark');}else{d.setAttribute('data-theme','light');}d.style.colorScheme=s==='light'?'light':(s==='dark'?'dark':'light dark');}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ profile, skills, services }, locale] = await Promise.all([getSiteData(), getLocale()]);
  const sameAs = socialsOf(profile)
    .filter((s) => s.key !== "email" && s.key !== "phone")
    .map((s) => s.href);

  /** JSON-LD — faqat to'ldirilgan maydonlar bilan (bo'sh "https://github.com" kabi
   *  qiymatlar strukturali ma'lumotga chiqmaydi). */
  const person: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName || "Portfolio",
    jobTitle: profile.title || "Student & AI Developer",
    description: profile.bio || undefined,
    url: siteUrl,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    telephone: phoneHref(profile.phone)?.replace(/^tel:/, "") || undefined,
    address: profile.location
      ? { "@type": "PostalAddress", addressLocality: profile.location.split(",")[0]?.trim() }
      : undefined,
    knowsAbout: skills.slice(0, 12).map((x) => x.name),
    makesOffer: services.slice(0, 8).map((x) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: x.title, description: x.description },
    })),
    sameAs,
  };

  return (
    <html
      lang={LOCALE_META[locale].html}
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {THEME_BOOTSTRAP}
        </Script>
      </head>
      <body className="flex min-h-full flex-col">
        {/* Skip-link: klaviatura bilan navigatsiya qiluvchilar uchun (audit P2-19) */}
        <a href="#main" className="skip-link">
          {t(locale, "skip")}
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </body>
    </html>
  );
}
