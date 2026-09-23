"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchItem = { title: string; href: string; part: number };

export function Search({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const fuse = useMemo(() => new Fuse(items, { keys: ["title"], threshold: .35, ignoreLocation: true }), [items]);
  const results = query.trim() ? fuse.search(query.trim(), { limit: 12 }).map(({ item }) => item) : items.filter((item) => item.href.indexOf("#") < 0).slice(0, 8);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => { if (open) requestAnimationFrame(() => inputRef.current?.focus()); }, [open]);

  const keepFocusInside = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('input, button, a[href]');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return <>
    <button className="search-trigger print-hidden" type="button" onClick={() => setOpen(true)} aria-label="ค้นหาเนื้อหา">
      <span aria-hidden="true">⌕</span><span className="search-label">ค้นหา</span><kbd>⌘ K</kbd>
    </button>
    {open && <div className="search-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section ref={dialogRef} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" onKeyDown={keepFocusInside}>
        <h2 id="search-title" className="sr-only">ค้นหาในหนังสือ</h2>
        <div className="search-field"><span aria-hidden="true">⌕</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหา PART หรือหัวข้อ เช่น 401" aria-label="คำค้นหา" /><button type="button" onClick={() => setOpen(false)} aria-label="ปิดหน้าค้นหา">ESC</button></div>
        <div className="search-results" aria-live="polite">{results.length ? <ul>{results.map((item) => <li key={item.href}><Link href={item.href} onClick={() => { setOpen(false); setQuery(""); }}><span>PART {item.part}</span>{item.title}</Link></li>)}</ul> : <p>ไม่พบหัวข้อที่ค้นหา</p>}</div>
      </section>
    </div>}
  </>;
}
