import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    { path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad — Full-stack dasturchi | Portfolio",
    template: "%s — Muhammad",
  },
  description:
    "Muhammad — full-stack dasturchi. Zamonaviy veb-saytlar, admin panellar va Telegram botlar yarataman. Loyihalar, tajriba va aloqa ma'lumotlari.",
  keywords: [
    "portfolio",
    "dasturchi",
    "full-stack",
    "veb-sayt",
    "uzbekistan",
    "frontend",
    "backend",
    "react",
    "next.js",
  ],
  authors: [{ name: "Muhammad" }],
  creator: "Muhammad",
  openGraph: {
    title: "Muhammad — Full-stack dasturchi | Portfolio",
    description:
      "Zamonaviy veb-saytlar, admin panellar va Telegram botlar. Loyihalarim va tajribam bilan tanishing.",
    url: siteUrl,
    siteName: "Muhammad — Portfolio",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad — Full-stack dasturchi | Portfolio",
    description: "Zamonaviy veb-saytlar, admin panellar va Telegram botlar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050816",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`h-full antialiased ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad",
              jobTitle: "Full-stack dasturchi",
              url: siteUrl,
              sameAs: [
                "https://github.com/",
                "https://linkedin.com/in/",
                "https://instagram.com/",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
