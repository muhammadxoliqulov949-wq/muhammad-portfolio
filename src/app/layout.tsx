import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad — Portfolio",
    template: "%s — Muhammad",
  },
  description: "Shaxsiy portfolio sayti — loyihalar, tajriba va aloqa ma'lumotlari.",
  openGraph: {
    title: "Muhammad — Portfolio",
    description: "Shaxsiy portfolio sayti — loyihalar, tajriba va aloqa ma'lumotlari.",
    url: siteUrl,
    siteName: "Muhammad — Portfolio",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Muhammad — Portfolio",
    description: "Shaxsiy portfolio sayti — loyihalar, tajriba va aloqa ma'lumotlari.",
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
    <html lang="uz" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
