"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content";

export function OnThisPage({ headings }: { headings: Heading[] }) {
  const levelTwo = headings.filter((heading) => heading.level === 2);
  const [activeId, setActiveId] = useState(levelTwo[0]?.id ?? "");

  useEffect(() => {
    const elements = levelTwo.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -72% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [levelTwo]);

  return (
    <aside className="on-this-page">
      <p>ในหน้านี้</p>
      <nav aria-label="สารบัญในหน้านี้">
        <ol>
          {levelTwo.map((heading) => (
            <li key={heading.id}><a className={activeId === heading.id ? "active" : ""} href={`#${heading.id}`}>{heading.text}</a></li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
