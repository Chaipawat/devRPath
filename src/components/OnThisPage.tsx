"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import type { Heading } from "@/lib/content";

function useActiveHeading(headings: Heading[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  // Active = the last heading that has scrolled past the top band (headings use scroll-margin-top: 5rem).
  useEffect(() => {
    const elements = headings.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let frame = 0;
    const update = () => {
      frame = 0;
      const passed = elements.filter((element) => element.getBoundingClientRect().top <= 140);
      const current = passed.at(-1) ?? elements[0];
      if (current) setActiveId(current.id);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [headings]);

  return activeId;
}

export function OnThisPage({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);
  const listRef = useRef<HTMLOListElement>(null);
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const link = listRef.current?.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(activeId)}"]`);
    if (link) setIndicator({ top: link.offsetTop, height: link.offsetHeight });
  }, [activeId]);

  return (
    <aside className="on-this-page">
      <p>ในหน้านี้</p>
      <nav aria-label="สารบัญในหน้านี้">
        {indicator && <span className="otp-indicator" aria-hidden="true" style={{ transform: `translateY(${indicator.top}px)`, height: indicator.height }} />}
        <ol ref={listRef}>
          {headings.map((heading) => (
            <li key={heading.id}><a className={activeId === heading.id ? "active" : ""} aria-current={activeId === heading.id ? "location" : undefined} href={`#${heading.id}`}>{heading.text}</a></li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

// Below 1180px the right rail is hidden, so the same list becomes a sticky dropdown above the article.
export function OnThisPageMenu({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const active = headings.find((heading) => heading.id === activeId) ?? headings[0];

  return (
    <details ref={detailsRef} className="otp-menu print-hidden">
      <summary>
        <span className="otp-menu-label">ในหน้านี้</span>
        <span className="otp-menu-current">{active?.text}</span>
        <LuChevronDown aria-hidden="true" />
      </summary>
      <nav aria-label="สารบัญในหน้านี้ (มือถือ)">
        <ol>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a className={activeId === heading.id ? "active" : ""} href={`#${heading.id}`} onClick={() => detailsRef.current?.removeAttribute("open")}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
