"use client";

import Link from "next/link";
import { useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import type { PartSummary } from "@/lib/content";
import { PartIcon } from "@/components/PartIcon";

export function Sidebar({ parts, activeSlug }: { parts: PartSummary[]; activeSlug: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="mobile-menu print-hidden" type="button" aria-expanded={open} aria-controls="book-sidebar" onClick={() => setOpen(!open)}>
        {open ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />} สารบัญ
      </button>
      {open && <button className="sidebar-backdrop" aria-label="ปิดสารบัญ" onClick={() => setOpen(false)} />}
      <aside id="book-sidebar" className={`book-sidebar ${open ? "is-open" : ""}`}>
        <Link className="book-mark" href="/" onClick={() => setOpen(false)}>
          <span>DEVPATH</span>
          Developer Knowledge Base
        </Link>
        <nav aria-label="สารบัญทุกบท">
          <ol>
            {parts.map((part) => (
              <li key={part.slug}>
                <Link href={`/part/${part.slug}`} aria-current={activeSlug === part.slug ? "page" : undefined} onClick={() => setOpen(false)}>
                  <PartIcon number={part.number} className="sidebar-part-icon" />
                  <span>{part.number.toString().padStart(2, "0")}</span><b>{part.title}</b>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </>
  );
}
