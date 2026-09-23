import "server-only";

import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

const contentDirectory = path.join(process.cwd(), "content");

export type Heading = { level: 2 | 3; text: string; id: string };

export type SectionKind = "foundation" | "frontend" | "backend" | "infrastructure" | "senior" | "toolkit";

export type PartSummary = {
  number: number;
  slug: string;
  title: string;
  description: string;
  kind: SectionKind;
  keywordCount: number;
};

export type Part = PartSummary & {
  content: string;
  headings: Heading[];
  sectionCount: number;
  readMinutes: number;
  previous: PartSummary | null;
  next: PartSummary | null;
};

export type BookSection = {
  title: string;
  kind: SectionKind;
  parts: PartSummary[];
};

export const sectionLabels: Record<SectionKind, string> = {
  foundation: "Foundation",
  frontend: "Frontend",
  backend: "Backend",
  infrastructure: "Infrastructure",
  senior: "Senior",
  toolkit: "Interview Toolkit",
};

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

function partFiles() {
  return fs
    .readdirSync(contentDirectory)
    .filter((file) => /^part-\d{2}-.*\.md$/.test(file))
    .sort((a, b) => Number(a.slice(5, 7)) - Number(b.slice(5, 7)));
}

// The TOC lists every part in normal case ("Web Fundamentals"), while each file's H1 is uppercase.
function tocTitles() {
  const toc = fs.readFileSync(path.join(contentDirectory, "00-README-TOC.md"), "utf8");
  return new Map(
    [...toc.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+)\|/gm)].map((match) => [Number(match[1]), cleanInlineMarkdown(match[2])]),
  );
}

// Body rows of the tables under the "Keywords" heading.
function countKeywords(content: string) {
  const section = content.split(/^##\s+\d+\.\s*Keywords?\b.*$/im)[1]?.split(/^##\s/m)[0] ?? "";
  const rows = section.split("\n").filter((line) => line.startsWith("|"));
  const separators = rows.filter((line) => /^\|[\s|:-]+\|$/.test(line)).length;
  return Math.max(0, rows.length - separators * 2);
}

// Thai has no spaces between words, so estimate from characters outside code blocks.
function estimateReadMinutes(content: string) {
  const prose = content.replace(/```[\s\S]*?```/g, "").replace(/[#>*|`_-]/g, "");
  const code = content.match(/```[\s\S]*?```/g)?.join("").length ?? 0;
  return Math.max(1, Math.round(prose.length / 900 + code / 2400));
}

export function getAllParts(): PartSummary[] {
  const titles = tocTitles();
  return partFiles().map((file) => {
    const content = fs.readFileSync(path.join(contentDirectory, file), "utf8");
    const number = Number(file.slice(5, 7));
    const rawTitle = content.match(/^#\s+(.+)$/m)?.[1] ?? `PART ${number}`;
    const title = titles.get(number) ?? cleanInlineMarkdown(rawTitle.replace(/^PART\s+\d+\s*[—–-]\s*/i, ""));
    return {
      number,
      slug: file.replace(/\.md$/, ""),
      title,
      description: "",
      kind: getSectionKind(number),
      keywordCount: countKeywords(content),
    };
  });
}

export function getPart(slug: string): Part | null {
  const summaries = getAllParts();
  const index = summaries.findIndex((part) => part.slug === slug);
  if (index === -1) return null;

  const summary = summaries[index];
  const content = fs.readFileSync(path.join(contentDirectory, `${slug}.md`), "utf8");
  const slugger = new GithubSlugger();
  const headings = [...content.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => {
    const text = cleanInlineMarkdown(match[2].replace(/\s+#+$/, ""));
    return { level: match[1].length as 2 | 3, text, id: slugger.slug(text) };
  });

  return {
    ...summary,
    content,
    headings,
    sectionCount: headings.filter((heading) => heading.level === 2).length,
    readMinutes: estimateReadMinutes(content),
    previous: summaries[index - 1] ?? null,
    next: summaries[index + 1] ?? null,
  };
}

const sectionKinds: SectionKind[] = [
  "foundation",
  "frontend",
  "backend",
  "infrastructure",
  "senior",
  "toolkit",
];

export function getSectionKind(number: number): SectionKind {
  if (number <= 2) return "foundation";
  if ([3, 4, 12].includes(number)) return "frontend";
  if (number <= 11) return "backend";
  if (number <= 15) return "infrastructure";
  if (number <= 24) return "senior";
  return "toolkit";
}

export function getBookSections(): BookSection[] {
  const toc = fs.readFileSync(path.join(contentDirectory, "00-README-TOC.md"), "utf8");
  const tocBody = toc.split("## 📚 สารบัญ")[1]?.split("## 🗺️")[0] ?? "";
  const blocks = tocBody.split(/^###\s+/m).slice(1);
  const allParts = new Map(getAllParts().map((part) => [part.number, part]));

  return blocks.slice(0, 6).map((block, index) => {
    const [rawTitle, ...lines] = block.split("\n");
    const parts = lines
      .map((line) => line.match(/^\|\s*(\d+)\s*\|\s*([^|]+)\|[^|]*\]\(\.\/(part-[^)]+)\.md\)\s*\|\s*([^|]+)\|/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => ({
        ...(allParts.get(Number(match[1])) as PartSummary),
        title: cleanInlineMarkdown(match[2]),
        description: cleanInlineMarkdown(match[4]),
        slug: match[3],
      }));

    const title = index === 5 ? "ส่วนที่ 6 — เครื่องมือทบทวนและต่อยอด" : rawTitle.trim();
    return { title, kind: sectionKinds[index], parts };
  });
}

export function getSearchIndex() {
  return getAllParts().flatMap((summary) => {
    const part = getPart(summary.slug)!;
    return [
      { title: `PART ${summary.number} — ${summary.title}`, href: `/part/${summary.slug}`, part: summary.number },
      ...part.headings.map((heading) => ({
        title: heading.text,
        href: `/part/${summary.slug}#${heading.id}`,
        part: summary.number,
      })),
    ];
  });
}
