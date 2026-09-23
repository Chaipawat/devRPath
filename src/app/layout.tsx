import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "../styles/cinematic.css";

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
  title: {
    default: "DevPath — Developer Knowledge Base",
    template: "%s | DevPath",
  },
  description: "คลังความรู้และเส้นทางการเรียนรู้สำหรับ Software Developer ตั้งแต่พื้นฐานจนถึงระบบ Production",
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
        <a
          className="creator-mark"
          href="https://github.com/Chaipawat"
          target="_blank"
          rel="noreferrer"
          aria-label="สร้างโดย Chaipawat — เปิด GitHub ในแท็บใหม่"
        >
          <span>BUILT BY</span> CHAIPAWAT <i aria-hidden="true">↗</i>
        </a>
      </body>
    </html>
  );
}
