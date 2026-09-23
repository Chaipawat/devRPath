import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <div className="not-found-orbit" aria-hidden="true"><span /><span /><span /></div>
      <p className="kicker">DEVPATH / LOST NODE</p>
      <h1>4<span>0</span>4</h1>
      <h2>เส้นทางนี้ยังไม่มีในแผนที่</h2>
      <p>หน้าที่คุณกำลังตามหาอาจถูกย้าย หรือยังไม่ได้เชื่อมเข้ากับ DevPath</p>
      <Link href="/">กลับไปหน้าแรก <span aria-hidden="true">↗</span></Link>
    </main>
  );
}
