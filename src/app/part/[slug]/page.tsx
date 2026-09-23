import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { OnThisPage, OnThisPageMenu } from "@/components/OnThisPage";
import { ProgressBar } from "@/components/ProgressBar";
import { Sidebar } from "@/components/Sidebar";
import { ReadingTracker } from "@/components/ReadingMemory";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllParts, getPart, sectionLabels } from "@/lib/content";
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

export default async function PartPage({ params }: PageProps<"/part/[slug]">) {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) notFound();
  const sectionHeadings = part.headings.filter((heading) => heading.level === 2);

  return (
    <div className="reader-layout">
      <ReadingTracker part={{ slug: part.slug, number: part.number, title: part.title }} />
      <ProgressBar />
      <Sidebar parts={getAllParts()} activeSlug={slug} />
      <main id="main-content" className="reader-main">
        <OnThisPageMenu headings={sectionHeadings} />
        <article className="book-content">
          <header className="part-heading">
            <SectionIcon kind={part.kind} />
            <div className="part-number" aria-hidden="true">{pad(part.number)}</div>
            <div className="part-heading-copy">
              <p>DEVPATH / PART {pad(part.number)}</p>
              <h1>{part.title}</h1>
              <p className="part-meta">{part.sectionCount} sections · ~{part.readMinutes} min read · ส่วน: {sectionLabels[part.kind]}</p>
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
