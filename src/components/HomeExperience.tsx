"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import type { BookSection } from "@/lib/content";
import { ContinueReading } from "@/components/ReadingMemory";
import { PartIcon, categoryIcons } from "@/components/PartIcon";

const KnowledgeScene3D = dynamic(() => import("@/components/KnowledgeScene3D"), { ssr: false });

const keywords = ["REACT", "NEXT.JS", "NODE.JS", "DATABASE", "DOCKER", "KUBERNETES", "SYSTEM DESIGN", "DEBUGGING", "SECURITY", "PERFORMANCE"];
const flow = [
  ["USER", "เริ่มต้นจากความต้องการของผู้ใช้", 0], ["FRONTEND", "แปลงข้อมูลเป็นประสบการณ์ที่ใช้งานได้", 3],
  ["API", "สัญญากลางที่เชื่อมทุกส่วนเข้าด้วยกัน", 1], ["BACKEND", "ประมวลผลกฎและตรรกะของระบบ", 5],
  ["DATABASE", "เก็บและเรียกคืนข้อมูลอย่างมีโครงสร้าง", 8], ["RESPONSE", "ส่งผลลัพธ์กลับอย่างรวดเร็วและเชื่อถือได้", 23],
] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: .75, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Constellation({ parts }: { parts: BookSection["parts"] }) {
  return <svg className="constellation" viewBox="0 0 620 560" role="img" aria-label="แผนที่ความรู้ 31 หัวข้อ">
    <g className="constellation-lines">{parts.slice(1).map((part, index) => { const a = index; const b = index + 1; const x1 = 70 + (a % 6) * 92; const y1 = 70 + Math.floor(a / 6) * 95; const x2 = 70 + (b % 6) * 92; const y2 = 70 + Math.floor(b / 6) * 95; return <line key={part.slug} x1={x1} y1={y1} x2={x2} y2={y2} />; })}</g>
    {parts.map((part, index) => { const x = 70 + (index % 6) * 92; const y = 70 + Math.floor(index / 6) * 95; return <Link key={part.slug} href={`/part/${part.slug}`} aria-label={`PART ${part.number} ${part.title}`}><g className="constellation-node" style={{ "--delay": `${index * 35}ms` } as React.CSSProperties}><circle cx={x} cy={y} r={index % 5 === 0 ? 14 : 9} /><text x={x} y={y + 30}>P{part.number}</text></g></Link>; })}
  </svg>;
}

export function HomeExperience({ sections }: { sections: BookSection[] }) {
  const reduce = useReducedMotion();
  const [canRender3D, setCanRender3D] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);
  const allParts = sections.flatMap((section) => section.parts);
  const { scrollYProgress } = useScroll();
  const footerY = useTransform(scrollYProgress, [0, 1], [80, -20]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 641px) and (prefers-reduced-motion: no-preference)");
    const update = () => setCanRender3D(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, [reduce]);
  useEffect(() => {
    const onScroll = () => { const y = window.scrollY; setNavHidden(y > lastY.current && y > 160); lastY.current = y; };
    window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <main id="main-content" className="home-main cinematic-home">
    <motion.header className="floating-nav" animate={{ y: !reduce && navHidden ? -110 : 0 }} transition={{ duration: .35 }}>
      <Link className="nav-brand" href="/"><span>DP</span>DEVPATH</Link><nav aria-label="เมนูหลัก"><a href="#paths">PATHS</a><a href="#highlights">HIGHLIGHTS</a></nav><span className="nav-index">INDEX / 31</span>
    </motion.header>

    <section className="cinema-hero">
      <div className="hero-poster-copy"><p className="hero-tag">● FRONTEND &nbsp; ● BACKEND &nbsp; ● INFRA &nbsp; ● KNOWLEDGE</p>
        <h1><span className="mask-line"><motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>Understand,</motion.span></span><span className="mask-line serif-signal"><motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: .8, delay: .09, ease: [.22, 1, .36, 1] }}>not memorize.</motion.span></span></h1>
        <p className="hero-lead">DevPath คือแผนที่ความรู้สำหรับนักพัฒนา ที่พาคุณเชื่อมทุกชั้นของระบบเข้าด้วยกัน ตั้งแต่ browser จนถึง production</p>
        <div className="hero-actions"><Link className="magnetic-button" href="/part/part-00-big-picture">START PART 0 <span>↗</span></Link><ContinueReading /></div>
      </div>
      <div className="hero-constellation">{canRender3D ? <KnowledgeScene3D parts={allParts} /> : <Constellation parts={allParts} />}<span className="orbit-label">31 CONNECTED CONCEPTS</span></div>
      <div className="hero-proof"><span><strong>31</strong> PARTS</span><span><strong>346</strong> KEYWORDS</span><span><strong>80</strong> KNOWLEDGE CHECKS</span></div>
    </section>

    <section className="marquee-section" aria-label="หัวข้อความรู้"><div className="marquee track-a">{[...keywords, ...keywords].map((word, i) => <span key={`${word}-${i}`}>{word}</span>)}</div><div className="marquee track-b">{[...keywords.slice().reverse(), ...keywords.slice().reverse()].map((word, i) => <span key={`${word}-${i}`}>{word} /</span>)}</div></section>

    <section className="request-story"><div className="story-sticky"><Reveal className="story-heading"><p className="kicker">ONE REQUEST / SIX LAYERS</p><h2>หนึ่งคลิก<br/><em>เดินทางไปไหนบ้าง?</em></h2></Reveal><div className="flow-track">{flow.map(([name, text, part], i) => <Reveal key={name} delay={i * .06} className="flow-step"><Link href={`/part/${allParts[part]?.slug}`}><span className="flow-icon"><PartIcon number={part}/></span><strong>{name}</strong><small>{text}</small><i>{String(i + 1).padStart(2, "0")}</i></Link></Reveal>)}</div></div></section>

    <section id="paths" className="paths-section"><Reveal><div className="section-title"><div><p className="kicker">CHOOSE YOUR PATH</p><h2>เรียนเป็นเส้นทาง<br/><em>เห็นเป็นภาพเดียว</em></h2></div><p>หกกลุ่มความรู้ที่เรียงจากรากฐานไปสู่การดูแลระบบจริง</p></div></Reveal><div className="path-grid">{sections.map((section, index) => { const Icon = categoryIcons[index]; return <Reveal key={section.kind} delay={index * .06}><article className={`path-card path-${index + 1}`}><div className="path-art"><Icon aria-hidden="true"/><span>{String(index + 1).padStart(2, "0")}</span></div><div className="path-meta"><span>{section.parts.length} PARTS</span><b>PATH / {String(index + 1).padStart(2, "0")}</b></div><h3>{section.title.replace(/^ส่วนที่\s*\d+\s*[—–-]\s*/, "")}</h3><ol>{section.parts.map((part) => <li key={part.slug}><Link href={`/part/${part.slug}`}><PartIcon number={part.number}/><span>{part.title}</span><i>↗</i></Link></li>)}</ol></article></Reveal>; })}</div></section>

    <section id="highlights" className="bento-section"><Reveal><p className="kicker">FIELD NOTES / TOOLS</p><h2>หยิบใช้ได้ทันที</h2></Reveal><div className="bento-grid">{[[20,"DEBUGGING FRAMEWORK","REPRODUCE → LOCATE → PROVE"],[27,"MASTER COMPARISON","A ↔ B"],[24,"SYSTEM DESIGN","USER → SCALE"],[29,"KEYWORD CHEAT SHEET","346 KEYWORDS"],[28,"MEMORY MAP","ONE CONNECTED MAP"]].map(([part,title,desc],i) => <Reveal key={String(title)} delay={i*.05} className={`bento-card bento-${i+1}`}><Link href={`/part/${allParts[Number(part)]?.slug}`}><PartIcon number={Number(part)}/><span>PART {part}</span><h3>{title}</h3><p>{desc}</p><i>EXPLORE ↗</i></Link></Reveal>)}</div></section>

    <section className="last-cta"><Reveal><p className="kicker">QUICK REVIEW</p><div className="countdown">30:00</div><h2>มีเวลาน้อย?<br/><em>เริ่มจากภาพรวมที่สำคัญ</em></h2><Link href="/part/part-30-last-30-minutes">อ่าน PART 30 <span>→</span></Link></Reveal></section>
    <footer className="giant-footer"><motion.div style={{ y: reduce ? 0 : footerY }}>DEVPATH</motion.div><p>UNDERSTAND THE SYSTEM. BUILD WITH INTENT.</p><nav><a href="#paths">PATHS</a><a href="#highlights">TOOLS</a><a href="#main-content">BACK TO TOP ↑</a></nav></footer>
  </main>;
}
