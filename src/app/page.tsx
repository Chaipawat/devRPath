import Link from "next/link";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { SectionIcon } from "@/components/illustrations/SectionIcon";
import { getBookSections } from "@/lib/content";
import { ContinueReading } from "@/components/ReadingMemory";

export default function Home() {
  const sections = getBookSections();
  return <main id="main-content" className="home-main">
    <header className="home-header"><Link className="home-brand" href="/">SD / INTERVIEW READ BOOK</Link></header>
    <section className="hero"><div className="hero-copy">
      <p className="eyebrow">ฉบับอ่านทบทวนก่อนสัมภาษณ์งาน</p><h1>Software Developer<br />Interview Read Book</h1>
      <p>เข้าใจภาพใหญ่ เชื่อม Frontend → Backend → Database → Infrastructure และตอบคำถามสัมภาษณ์อย่างเป็นนักพัฒนา</p>
      <div className="hero-actions"><Link className="primary-button" href="/part/part-00-big-picture">เริ่มอ่าน PART 0 <span aria-hidden="true">→</span></Link><ContinueReading /></div>
      <dl className="book-stats"><div><dt>31</dt><dd>PART</dd></div><div><dt>6</dt><dd>หมวดหลัก</dd></div><div><dt>1</dt><dd>ภาพจำใหญ่</dd></div></dl>
    </div><HeroIllustration /></section>
    <section className="contents-section" aria-labelledby="contents-title">
      <div className="section-intro"><p className="eyebrow">BOOK MAP</p><h2 id="contents-title">เลือกเส้นทางที่อยากทบทวน</h2><p>เนื้อหาจัดตามสารบัญต้นฉบับ ตั้งแต่รากฐานไปจนถึงโหมดพร้อมเข้าสัมภาษณ์</p></div>
      <div className="section-grid">{sections.map((section, index) => <section className="section-card" key={section.kind}>
        <div className="section-card-heading"><SectionIcon kind={section.kind} /><div><span>0{index + 1}</span><h3>{section.title.replace(/^ส่วนที่\s*\d+\s*[—–-]\s*/, "")}</h3></div></div>
        <ol>{section.parts.map((part) => <li key={part.slug}><Link href={`/part/${part.slug}`}><span>PART {part.number}</span><strong>{part.title}</strong><i aria-hidden="true">→</i></Link></li>)}</ol>
      </section>)}</div>
    </section>
    <footer className="home-footer"><p>อ่านเพื่อเข้าใจ ไม่ใช่เพื่อท่อง</p><Link href="/part/part-00-big-picture">เริ่มต้นจากภาพใหญ่ →</Link></footer>
  </main>;
}
