import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CopyCodeButton } from "@/components/CopyCodeButton";

type HastNode = { type: string; value?: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] };

function internalHref(href = "") {
  if (href === "./00-README-TOC.md") return "/";
  const part = href.match(/^\.\/(part-[^)#]+)\.md(#[^)]+)?$/);
  if (part) return `/part/${part[1]}${part[2] ?? ""}`;
  return href;
}

function textOf(node?: HastNode): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

// Moves the "1." prefix of each h2 into its own span, after rehype-slug so heading ids stay the same.
function rehypeHeadingNumbers() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "h2") {
        const first = node.children?.[0];
        const match = first?.type === "text" ? first.value?.match(/^(\d+)([a-z]?)\.\s+/) : null;
        if (first && match) {
          first.value = first.value!.slice(match[0].length);
          node.children!.unshift({
            type: "element",
            tagName: "span",
            properties: { className: ["heading-number"], ariaHidden: "true" },
            children: [{ type: "text", value: match[1].padStart(2, "0") + match[2] }],
          });
        }
        return;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

const callouts = [
  { prefix: "ตำแหน่งในภาพใหญ่:", kind: "location", label: "LOCATION" },
  { prefix: "ให้มองภาพนี้ว่า", kind: "see", label: "SEE IT AS" },
  { prefix: "🧠 ภาพจำ", kind: "memory", label: "MEMORY" },
] as const;

function Callout({ node, children }: ComponentPropsWithoutRef<"blockquote"> & ExtraProps) {
  const text = textOf(node as HastNode).trim();
  const callout = callouts.find(({ prefix }) => text.startsWith(prefix)) ?? { kind: "note", label: "NOTE" };
  return (
    <blockquote className={`callout callout-${callout.kind}`}>
      <span className="callout-label" aria-hidden="true">{callout.label}</span>
      {children}
    </blockquote>
  );
}

function Anchor({ href, children, ...rest }: ComponentPropsWithoutRef<"a"> & ExtraProps) {
  // react-markdown passes the hast `node`; keep it off the DOM element.
  const { node, ...props } = rest;
  void node;
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
      rehypePlugins={[rehypeSlug, rehypeHeadingNumbers, [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }]]}
      components={{
        h1: () => null,
        a: Anchor,
        blockquote: Callout,
        table: ({ children: tableChildren }) => (
          <div className="table-scroll" role="region" aria-label="ตาราง เลื่อนแนวนอนได้" tabIndex={0}>
            <table>{tableChildren}</table>
          </div>
        ),
        pre: ({ children: preChildren }: { children?: ReactNode }) => (
          <div className="code-scroll">
            <div className="code-label"><span>DIAGRAM / CODE</span><CopyCodeButton /></div>
            <div className="code-body" role="region" aria-label="โค้ดหรือแผนภาพ เลื่อนแนวนอนได้" tabIndex={0}><pre>{preChildren}</pre></div>
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
