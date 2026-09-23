"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";

const DevDeskScene3D = dynamic(() => import("@/components/DevDeskScene3D"), {
  ssr: false,
  loading: () => <div className="knowledge-scene is-loading" aria-hidden="true" />,
});

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={reduce ? { duration: 0 } : { duration: 0.75, delay, ease }}>{children}</motion.div>;
}

export function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, [reduce]);
  return null;
}

export function FloatingNav({ total }: { total: number }) {
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => { const y = window.scrollY; setHidden(y > lastY.current && y > 160); lastY.current = y; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The shell owns the centering transform; motion only animates the inner pill, so the two never fight.
  return (
    <div className="floating-nav-shell">
      <motion.header className="floating-nav" animate={{ y: !reduce && hidden ? -110 : 0 }} transition={{ duration: 0.35 }}>
        <Link className="nav-brand" href="/"><span>DP</span>DEVPATH</Link>
        <nav aria-label="เมนูหลัก"><a href="#levels">LEVELS</a><a href="#paths">PATHS</a><a href="#highlights">HIGHLIGHTS</a></nav>
        <span className="nav-index">INDEX / {total}</span>
      </motion.header>
    </div>
  );
}

export function HeroTitle() {
  const reduce = useReducedMotion();
  const line = (delay: number) => ({ initial: { y: "110%" }, animate: { y: 0 }, transition: reduce ? { duration: 0 } : { duration: 0.8, delay, ease } });
  return (
    <h1>
      <span className="mask-line"><motion.span {...line(0)}>Understand,</motion.span></span>
      <span className="mask-line serif-signal"><motion.span {...line(0.09)}>not memorize.</motion.span></span>
    </h1>
  );
}

// 3D only on wide screens that allow motion; everywhere else keep the static SVG passed in as `fallback`.
export function HeroScene({ fallback }: { fallback: ReactNode }) {
  const [canRender3D, setCanRender3D] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 981px) and (prefers-reduced-motion: no-preference)");
    const update = () => setCanRender3D(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return canRender3D ? <DevDeskScene3D /> : fallback;
}

// Reduced motion is handled in CSS: branching on useReducedMotion here would break hydration.
export function FooterWordmark() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [80, -20]);
  return <motion.div className="giant-wordmark" aria-hidden="true" style={{ y }}>DEVPATH</motion.div>;
}
