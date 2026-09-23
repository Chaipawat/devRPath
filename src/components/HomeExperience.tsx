import Link from "next/link";
import type { CSSProperties } from "react";
import { sectionLabels, type BookSection } from "@/lib/content";
import { ContinueReading } from "@/components/ReadingMemory";
import { PartIcon, categoryIcons } from "@/components/PartIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { DevDeskSVG } from "@/components/home/DevDeskSVG";
import { FloatingKeywords } from "@/components/home/FloatingKeywords";
import { FloatingNav, FooterWordmark, HeroScene, HeroTitle, Reveal, SmoothScroll } from "@/components/home/HomeIslands";

const levels = [
  ["WEB", "<h1>Hello, web</h1>", "HTML, HTTP และการทำงานของ browser", 1, "#7fd1a8"],
  ["LOGIC", "const add = (a, b) => a + b;", "คิดเป็นขั้นตอนด้วย JavaScript", 2, "#e8c060"],
  ["UI", "const [n, setN] = useState(0);", "สร้างหน้าจอที่ตอบสนองด้วย React", 3, "#8fa8ff"],
  ["API", "app.get(\"/users\", handler);", "ออกแบบ API ด้วย Node + Express", 6, "#b3a8ff"],
  ["DATA", "SELECT * FROM users\nWHERE active = true;", "เก็บและดึงข้อมูลให้ถูกวิธี", 8, "#ff9a6b"],
  ["SHIP", "docker compose up -d", "แพ็กระบบแล้วส่งขึ้น production", 13, "#ff7a45"],
  ["SCALE", "replicas: 10  # scale out", "ออกแบบระบบให้รองรับผู้ใช้จำนวนมาก", 24, "#ff5a1f"],
] as const;
const stack = ["HTML", "JS", "React", "Node", "SQL", "Docker", "K8s"];
// One accent + three signature keywords per learning path (same order as the sections).
const pathArt = [
  ["#ff5a1f", ["HTTP", "DNS", "let x"]],
  ["#2f5bff", ["<JSX />", "useState", "SSR"]],
  ["#12a37f", ["REST", "SELECT", "JWT"]],
  ["#8a7dff", ["docker", "k8s", "CI/CD"]],
  ["#e0a100", ["SOLID", "test()", "git"]],
  ["#16140f", ["Q&A", "cheat", "30:00"]],
] as const;
const flow = [
  ["USER", "เริ่มต้นจากความต้องการของผู้ใช้", 0, "click(\"สั่งซื้อ\")", "0ms", "#ff5a1f"],
  ["FRONTEND", "แปลงข้อมูลเป็นประสบการณ์ที่ใช้งานได้", 3, "fetch(\"/api/orders\")", "+4ms", "#2f5bff"],
  ["API", "สัญญากลางที่เชื่อมทุกส่วนเข้าด้วยกัน", 1, "POST /api/orders\nHTTP/1.1", "+18ms", "#8a7dff"],
  ["BACKEND", "ประมวลผลกฎและตรรกะของระบบ", 5, "validate(order)\n  .then(save)", "+31ms", "#16140f"],
  ["DATABASE", "เก็บและเรียกคืนข้อมูลอย่างมีโครงสร้าง", 8, "INSERT INTO orders\nVALUES (…);", "+62ms", "#12a37f"],
  ["RESPONSE", "ส่งผลลัพธ์กลับอย่างรวดเร็วและเชื่อถือได้", 23, "201 Created\n{ id: 1042 }", "84ms", "#e0a100"],
] as const;
const highlights = [
  [20, "DEBUGGING FRAMEWORK", "REPRODUCE → LOCATE → PROVE"], [27, "MASTER COMPARISON", "A ↔ B"], [24, "SYSTEM DESIGN", "USER → SCALE"],
  [29, "KEYWORD CHEAT SHEET", "346 KEYWORDS"], [28, "MEMORY MAP", "ONE CONNECTED MAP"],
] as const;

export function HomeExperience({ sections }: { sections: BookSection[] }) {
  const allParts = sections.flatMap((section) => section.parts);
  // Sections are ordered by topic (0,1,2,3,4,12,5…), so look parts up by number, never by array index.
  const hrefFor = (number: number) => `/part/${allParts.find((part) => part.number === number)?.slug ?? ""}`;

  return <main id="main-content" className="home-main cinematic-home">
    <SmoothScroll />
    <FloatingNav total={allParts.length} />

    <section className="cinema-hero">
      <FloatingKeywords count={49} seed={11} />
      <div className="hero-poster-copy"><p className="hero-prompt"><span>~/devpath</span> <b>$</b> learn --from basics --to production<i aria-hidden="true" /></p>
        <HeroTitle />
        <p className="hero-lead">DevPath คือแผนที่ความรู้สำหรับนักพัฒนา ที่พาคุณเชื่อมทุกชั้นของระบบเข้าด้วยกัน ตั้งแต่ browser จนถึง production</p>
        <div className="hero-actions"><Link className="magnetic-button" href="/part/part-00-big-picture">START PART 0 <span>↗</span></Link><ContinueReading /></div>
      </div>
      <div className="hero-constellation hero-scene">
        <HeroScene fallback={<DevDeskSVG />} />
        <div className="scene-caption">
          <strong><i aria-hidden="true" /> MOCHI IS CODING / {allParts.length} PARTS</strong>
          <ul aria-label="สิ่งที่จะได้เรียน">{stack.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <div className="hero-proof"><span><strong>31</strong> PARTS</span><span><strong>346</strong> KEYWORDS</span><span><strong>80</strong> KNOWLEDGE CHECKS</span></div>
    </section>

    <section id="levels" className="levels-section">
      <FloatingKeywords count={35} seed={29} tone="dark" />
      <Reveal className="levels-head"><div><p className="kicker">LEVEL UP / BASICS → ADVANCED</p><h2>จาก Hello World<br/><em>ถึง Production</em></h2></div><p>ทุกบรรทัดโค้ดคือหนึ่งขั้นบันได เริ่มจากพื้นฐานที่จับต้องได้ แล้วค่อยขยับไปสู่ระบบจริงที่ต้องรองรับผู้ใช้จำนวนมาก</p></Reveal>
      <ol className="level-stairs">{levels.map(([name, code, text, part, color], i) => <li key={name} className="level-card" style={{ "--i": i, "--c": color } as CSSProperties}><Reveal delay={i * .06}><Link href={hrefFor(part)}><span className="level-top"><b>LV.{String(i + 1).padStart(2, "0")}</b><span>{name}</span></span><code>{code}</code><small>{text}</small><i>PART {String(part).padStart(2, "0")} ↗</i></Link></Reveal></li>)}</ol>
      <div className="level-scale" aria-hidden="true"><span>BEGINNER</span><span>INTERMEDIATE</span><span>ADVANCED</span></div>
    </section>

    <section className="request-story trace-section">
      <FloatingKeywords count={28} seed={53} />
      <Reveal className="levels-head trace-head"><div><p className="kicker">ONE REQUEST / SIX LAYERS</p><h2>หนึ่งคลิก<br/><em>เดินทางไปไหนบ้าง?</em></h2></div><p>ตามหนึ่ง request ตั้งแต่ผู้ใช้กดปุ่ม ผ่านทุกชั้นของระบบ จนได้ผลลัพธ์กลับมา ทั้งหมดนี้เกิดขึ้นในเวลาไม่ถึงหนึ่งวินาที</p></Reveal>
      <div className="trace-wire" aria-hidden="true"><span /></div>
      <ol className="trace-track">{flow.map(([name, text, part, code, ms, color], i) => <li key={name} className="trace-step" style={{ "--c": color, "--i": i } as CSSProperties}><Reveal delay={i * .06}><Link href={hrefFor(part)}><span className="trace-top"><span className="flow-icon"><PartIcon number={part}/></span><b>{String(i + 1).padStart(2, "0")}</b></span><strong>{name}</strong><code>{code}</code><small>{text}</small><span className="trace-foot"><i>{ms}</i><em>PART {String(part).padStart(2, "0")} ↗</em></span></Link></Reveal></li>)}</ol>
      <p className="trace-total" aria-hidden="true"><span>REQUEST</span><b /><span>TOTAL 84ms · 201 CREATED</span></p>
    </section>

    <section id="paths" className="paths-section">
      <FloatingKeywords count={28} seed={71} />
      <Reveal className="levels-head trace-head paths-head"><div><p className="kicker">CHOOSE YOUR PATH / {sections.length} PATHS · {allParts.length} PARTS</p><h2>เรียนเป็นเส้นทาง<br/><em>เห็นเป็นภาพเดียว</em></h2></div><div className="paths-aside"><p>หกกลุ่มความรู้ที่เรียงจากรากฐานไปสู่การดูแลระบบจริง เลือกเริ่มจากเส้นทางที่ใช่ หรือไล่ตามลำดับทีละขั้น</p><ol className="path-rail" aria-label="ลำดับเส้นทาง">{sections.map((section, index) => <li key={section.kind} style={{ "--c": pathArt[index]?.[0] ?? "#ff5a1f" } as CSSProperties}><a href={`#path-${section.kind}`}><i aria-hidden="true" />{sectionLabels[section.kind]}</a></li>)}</ol></div></Reveal>
      <div className="path-grid">{sections.map((section, index) => { const Icon = categoryIcons[index]; return <Reveal key={section.kind} delay={index * .06}><article id={`path-${section.kind}`} className={`path-card path-${index + 1}`} style={{ "--c": pathArt[index]?.[0] ?? "#ff5a1f" } as CSSProperties}><div className="path-visual" aria-hidden="true"><i className="path-tile"><Icon/></i>{pathArt[index]?.[1].map((tag, j) => <b key={tag} className={`path-tag tag-${j + 1}`}>{tag}</b>)}<code>$ cd paths/{section.kind}</code><strong>{String(index + 1).padStart(2, "0")}</strong></div><div className="path-meta"><span>{section.parts.length} PARTS</span><b>PATH / {String(index + 1).padStart(2, "0")}</b></div><h3>{section.title.replace(/^ส่วนที่\s*\d+\s*[—–-]\s*/, "")}</h3><ol>{section.parts.map((part) => <li key={part.slug}><Link href={`/part/${part.slug}`}><PartIcon number={part.number}/><span>{part.title}</span><i>↗</i></Link></li>)}</ol></article></Reveal>; })}</div></section>

    <section id="highlights" className="bento-section"><Reveal><p className="kicker">FIELD NOTES / TOOLS</p><h2>หยิบใช้ได้ทันที</h2></Reveal><div className="bento-grid">{highlights.map(([part, title, desc], i) => <Reveal key={title} delay={i * .05} className={`bento-card bento-${i + 1}`}><Link href={hrefFor(part)}><PartIcon number={part}/><span>PART {part}</span><h3>{title}</h3><p>{desc}</p><i>EXPLORE ↗</i></Link></Reveal>)}</div></section>

    <section className="last-cta"><Reveal><p className="kicker">QUICK REVIEW</p><div className="countdown">30:00</div><h2>มีเวลาน้อย?<br/><em>เริ่มจากภาพรวมที่สำคัญ</em></h2><Link href="/part/part-30-last-30-minutes">อ่าน PART 30 <span>→</span></Link></Reveal></section>
    <footer className="giant-footer"><FooterWordmark /><p>UNDERSTAND THE SYSTEM. BUILD WITH INTENT.</p><nav aria-label="ลิงก์ท้ายหน้า"><a href="#paths">PATHS</a><a href="#highlights">TOOLS</a><a href="#main-content">BACK TO TOP ↑</a></nav><SiteFooter /></footer>
  </main>;
}
