import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function internalHref(href = "") {
  if (href === "./00-README-TOC.md") return "/";
  const part = href.match(/^\.\/(part-[^)#]+)\.md(#[^)]+)?$/);
  if (part) return `/part/${part[1]}${part[2] ?? ""}`;
  return href;
}

function Anchor({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const target = internalHref(href);
  if (target.startsWith("/") || target.startsWith("#")) {
    return <Link href={target} {...props}>{children}</Link>;
  }
  return <a href={target} rel="noreferrer" target="_blank" {...props}>{children}</a>;
}

export function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }]]}
      components={{
        h1: () => null,
        a: Anchor,
        table: ({ children: tableChildren }) => (
          <div className="table-scroll" role="region" aria-label="ตาราง เลื่อนแนวนอนได้" tabIndex={0}>
            <table>{tableChildren}</table>
          </div>
        ),
        pre: ({ children: preChildren }: { children?: ReactNode }) => (
          <div className="code-scroll" role="region" aria-label="โค้ดหรือแผนภาพ เลื่อนแนวนอนได้" tabIndex={0}>
            <pre>{preChildren}</pre>
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
