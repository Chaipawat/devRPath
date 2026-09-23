"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

const storageKey = "readbook:last-part";
type SavedPart = { slug: string; number: number; title: string };

export function ReadingTracker({ part }: { part: SavedPart }) {
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(part)); } catch {} }, [part]);
  return null;
}

export function ContinueReading() {
  const saved = useSyncExternalStore(
    (onChange) => { window.addEventListener("storage", onChange); return () => window.removeEventListener("storage", onChange); },
    () => { try { return localStorage.getItem(storageKey); } catch { return null; } },
    () => null,
  );
  let part: SavedPart | null = null;
  try { if (saved) part = JSON.parse(saved); } catch {}
  if (!part) return null;
  return <Link className="continue-button" href={`/part/${part.slug}`}>อ่านต่อ <span>PART {part.number} — {part.title}</span><i aria-hidden="true">→</i></Link>;
}
