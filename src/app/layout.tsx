import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "../styles/cinematic.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const sans = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DevPath — Developer Knowledge Base",
    template: "%s | DevPath",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName,
    title: "DevPath — Developer Knowledge Base",
    description: siteDescription,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "DevPath — Understand, not memorize." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPath — Developer Knowledge Base",
    description: siteDescription,
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">ข้ามไปเนื้อหา</a>
        {children}
        <p className="site-copyright">© 2026 Chaipawat. All rights reserved.</p>
        <a
          className="creator-mark"
          href="https://github.com/Chaipawat"
          target="_blank"
          rel="noreferrer"
          aria-label="สร้างโดย Chaipawat — เปิด GitHub ในแท็บใหม่"
        >
          <span>BUILT BY</span> CHAIPAWAT <i aria-hidden="true">↗</i>
        </a>
        <Analytics />
      </body>
    </html>
  );
}
