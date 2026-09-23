import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { OnThisPage, OnThisPageMenu } from "@/components/OnThisPage";
import { ProgressBar } from "@/components/ProgressBar";
import { Sidebar } from "@/components/Sidebar";
import { ReadingTracker } from "@/components/ReadingMemory";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllParts, getPart, sectionLabels, type SectionKind } from "@/lib/content";
import { FloatingKeywords } from "@/components/home/FloatingKeywords";
import { SectionIcon } from "@/components/illustrations/SectionIcon";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllParts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/part/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const part = getPart(slug);
  return part ? {
    title: `PART ${part.number} — ${part.title}`,
    alternates: { canonical: `/part/${part.slug}` },
    openGraph: { url: `/part/${part.slug}`, title: `PART ${part.number} — ${part.title}` },
  } : {};
}

const pad = (number: number) => number.toString().padStart(2, "0");

// Accent pair per section kind, from the home page palette.
const kindAccents: Record<SectionKind, [accent: string, accent2: string]> = {
  foundation: ["#ff5a1f", "#e0a100"],
  frontend: ["#2f5bff", "#8a7dff"],
  backend: ["#12a37f", "#2f5bff"],
  infrastructure: ["#8a7dff", "#12a37f"],
  senior: ["#e0a100", "#ff5a1f"],
  data: ["#0fa3b1", "#12a37f"],
  ai: ["#c026d3", "#2f5bff"],
  toolkit: ["#e2477a", "#8a7dff"],
};

export default async function PartPage({ params }: PageProps<"/part/[slug]">) {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) notFound();
  const sectionHeadings = part.headings.filter((heading) => heading.level === 2);
  const [accent, accent2] = kindAccents[part.kind];

  return (
    <div className="reader-layout" style={{ "--accent": accent, "--accent-2": accent2 } as CSSProperties}>
      <FloatingKeywords count={63} seed={part.number * 7 + 3} className="reader-keywords" />
      <ReadingTracker part={{ slug: part.slug, number: part.number, title: part.title }} />
      <ProgressBar />
      <Sidebar parts={getAllParts()} activeSlug={slug} />
      <main id="main-content" className="reader-main">
        <OnThisPageMenu headings={sectionHeadings} />
        <article className="book-content">
          <header className="part-heading">
            <FloatingKeywords count={21} seed={part.number + 101} tone="dark" />
            <SectionIcon kind={part.kind} />
            <div className="part-number" aria-hidden="true">{pad(part.number)}</div>
            <div className="part-heading-copy">
              <p className="part-kicker">DEVPATH / PART {pad(part.number)}</p>
              <h1>{part.title}</h1>
              <p className="part-meta"><span>{part.sectionCount} sections</span><span>~{part.readMinutes} min read</span><span>ส่วน: {sectionLabels[part.kind]}</span></p>
            </div>
          </header>
          <MarkdownContent>{part.content}</MarkdownContent>
        </article>
        <nav aria-label="บทก่อนหน้าและบทถัดไป" className="chapter-nav">
          {part.previous ? (
            <Link className="chapter-card is-prev" href={`/part/${part.previous.slug}`}>
              <small><i aria-hidden="true">←</i> PART ก่อนหน้า</small>
              <strong><span>{pad(part.previous.number)}</span>{part.previous.title}</strong>
            </Link>
          ) : <span />}
          {part.next ? (
            <Link className="chapter-card is-next" href={`/part/${part.next.slug}`}>
              <small>PART ถัดไป <i aria-hidden="true">→</i></small>
              <strong><span>{pad(part.next.number)}</span>{part.next.title}</strong>
            </Link>
          ) : <span />}
        </nav>
        <Link className="toc-return" href="/">← สารบัญ</Link>
        <footer className="reader-footer"><SiteFooter /></footer>
      </main>
      <OnThisPage headings={sectionHeadings} />
    </div>
  );
}
