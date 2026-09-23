import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { OnThisPage } from "@/components/OnThisPage";
import { ProgressBar } from "@/components/ProgressBar";
import { Sidebar } from "@/components/Sidebar";
import { ReadingTracker } from "@/components/ReadingMemory";
import { getAllParts, getPart, getSectionKind } from "@/lib/content";
import { SectionIcon } from "@/components/illustrations/SectionIcon";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllParts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/part/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const part = getPart(slug);
  return part ? { title: `PART ${part.number} — ${part.title}` } : {};
}

export default async function PartPage({ params }: PageProps<"/part/[slug]">) {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) notFound();

  return (
    <div className="reader-layout">
      <ReadingTracker part={{ slug: part.slug, number: part.number, title: part.title }} />
      <ProgressBar />
      <Sidebar parts={getAllParts()} activeSlug={slug} />
      <main id="main-content" className="reader-main">
      <article className="book-content">
        <header className="part-heading">
          <SectionIcon kind={getSectionKind(part.number)} />
          <div><p>PART {part.number.toString().padStart(2, "0")}</p><h1>{part.title}</h1></div>
        </header>
        <MarkdownContent>{part.content}</MarkdownContent>
      </article>
      <nav aria-label="บทก่อนหน้าและบทถัดไป" className="chapter-nav">
        {part.previous ? <Link href={`/part/${part.previous.slug}`}>← PART {part.previous.number}<span>{part.previous.title}</span></Link> : <span />}
        {part.next ? <Link href={`/part/${part.next.slug}`}>PART {part.next.number} →<span>{part.next.title}</span></Link> : <span />}
      </nav>
      <Link className="toc-return" href="/">← สารบัญ</Link>
      </main>
      <OnThisPage headings={part.headings} />
    </div>
  );
}
