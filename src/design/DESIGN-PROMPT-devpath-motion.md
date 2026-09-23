# Design Prompt — DevPath "Cinematic Editorial" Redesign

รีดีไซน์หน้าตาเว็บ DevPath (Next.js App Router) ให้มีลูกเล่นและ motion ระดับ showcase site
**แก้เฉพาะ UI / CSS / animation** ห้ามแตะเนื้อหาใน `content/`, routing และ `lib/content.ts`

---

## 1. Design Direction

**ชื่อสไตล์:** Cinematic Editorial — Light
ตัวอักษรใหญ่แบบนิตยสาร จัดวางเหมือนโปสเตอร์ มี motion ทุกครั้งที่ scroll และภาพหลักเป็น 3D ที่ขยับได้
แต่ **หน้าอ่านเนื้อหาต้องนิ่งและอ่านสบาย** — ลูกเล่นเต็มที่ที่หน้าแรก ส่วนหน้าอ่านใช้แค่ motion เบา ๆ

**ธีมสว่างเท่านั้น** ไม่มี dark mode

---

## 2. Design Tokens

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--paper` | `#F6F4EF` | พื้นหลังหลัก |
| `--paper-2` | `#EDEAE3` | พื้น section สลับ / การ์ด |
| `--ink` | `#0E0E0E` | ตัวอักษรหลัก, ปุ่ม primary |
| `--ink-soft` | `#55524C` | ตัวอักษรรอง |
| `--line` | `#D9D5CC` | เส้นแบ่ง 1px |
| `--signal` | `#FF5A1F` | accent หลัก (ใช้กับตัวใหญ่ ≥ 24px หรือพื้นหลังปุ่มเท่านั้น) |
| `--electric` | `#2F5BFF` | accent รอง: ลิงก์, node ใน 3D, focus ring |
| radius | 20px (การ์ด), 999px (pill) | |
| texture | film grain overlay 3–4% opacity ทั้งหน้า | ให้พื้นดูมีมิติ ไม่แบน |

**Typography**

- Display EN: `Inter Tight` 800 ตัวใหญ่มาก (clamp 56px → 160px) + `Instrument Serif` italic สำหรับคำเน้น
- ภาษาไทย: `Anuphan` หรือ `IBM Plex Sans Thai` (หัวข้อ 700, เนื้อหา 400 ขนาด 18px line-height 1.85)
- Label / tag / ตัวเลข: `JetBrains Mono` ตัวพิมพ์ใหญ่ letter-spacing 0.08em
- ห้ามใช้ monospace กับเนื้อหาภาษาไทยยาว ๆ

---

## 3. Motion Stack

- `motion` (Framer Motion) สำหรับ UI animation ทั้งหมด
- `lenis` สำหรับ smooth scroll (หน้าแรกเท่านั้น)
- `@react-three/fiber` + `@react-three/drei` สำหรับ hero 3D (โหลดแบบ dynamic import, `ssr: false`)
- easing หลัก: `cubic-bezier(0.22, 1, 0.36, 1)` ระยะเวลา 0.6–0.9s
- **กฎเหล็ก:** ถ้า `prefers-reduced-motion: reduce` → ปิด animation ทั้งหมด แสดงสถานะสุดท้ายทันที ปิด Lenis และแสดง hero เป็นภาพนิ่ง

---

## 4. หน้าแรก — 7 Sections

### 4.1 Hero — "Knowledge Constellation"

- **ซ้าย:** tag mono `● FRONTEND ● BACKEND ● INFRA ● INTERVIEW` สี `--signal`
  แล้วหัวเรื่อง 2 บรรทัด
  `Understand,` (Inter Tight 800)
  `not memorize.` (Instrument Serif italic สี `--signal`)
  ตัวอักษรเผยทีละคำด้วย **mask reveal** (เลื่อนขึ้นจากใต้เส้น stagger 0.08s)
- **ขวา / พื้นหลัง:** 3D graph ของ 31 จุด (1 จุด = 1 PART) เชื่อมกันด้วยเส้นบาง จัดกลุ่มเป็น 6 กลุ่มตามสารบัญ แต่ละกลุ่มคนละเฉด
  - หมุนช้า ๆ เอง และเอียงตามเมาส์เล็กน้อย (parallax)
  - hover ที่จุด → จุดขยาย + label ชื่อ PART แบบ mono / คลิก → ไปหน้า PART นั้น
  - มือถือหรือ reduced-motion → แสดงเป็น SVG นิ่งแทน
- **ปุ่ม:** `Start PART 0 ↗` (พื้นดำ pill) เป็น **magnetic button** คือปุ่มดูดเข้าหาเมาส์เมื่อเข้าใกล้ + ลูกศรหมุน 45° ตอน hover
  `↻ อ่านต่อ: <ชื่อ PART>` (outline pill)
- **ล่างสุด:** social-proof แบบ dev: `31 PARTS · 346 KEYWORDS · 80 INTERVIEW Q` ตัวเลข **count-up** ตอนเข้าจอ

### 4.2 Keyword Marquee

- แถบตัวหนังสือวิ่งไม่รู้จบ 2 แถวสวนทางกัน ดึง keyword จริงจาก PART 29
- แถวบน Inter Tight ตัวใหญ่ outline (ตัวกลวง) / แถวล่าง mono ตัวเล็ก
- hover แล้วหยุดวิ่ง และคำที่ชี้เปลี่ยนเป็นสีทึบ

### 4.3 "One Request" — Sticky Scroll Story

- section สูง ~300vh ภาพ diagram ค้างไว้กลางจอ (sticky) ขณะ scroll
- เส้น flow `User → Frontend → API → Backend → Database → Response` **วาดตัวเองตามการ scroll** (SVG stroke-dashoffset)
- แต่ละชั้นสว่างขึ้นทีละจุด พร้อมข้อความอธิบาย 1 ประโยคทางซ้าย และลิงก์ไป PART ที่เกี่ยวข้อง

### 4.4 Path Gallery — การ์ด 6 ส่วน

- เลย์เอาต์เหมือน template gallery: grid 3 คอลัมน์ (tablet 2, มือถือ 1)
- การ์ดแต่ละใบ: ภาพปก (illustration ของส่วนนั้น) + ชื่อส่วน + pill `6 PARTS` + หมวด mono ชิดขวา
- **Hover:** การ์ด tilt 3D เล็กน้อย ภาพ zoom 1.05 และ **custom cursor** เปลี่ยนเป็นวงกลมเขียนว่า `READ →`
- การ์ดโผล่เข้ามาแบบ stagger ตอน scroll ถึง

### 4.5 Bento Highlights

- bento grid ขนาดไม่เท่ากัน 5 ช่อง: Debugging Framework / Master Comparison / Interview Mode / Keyword Cheat Sheet / Memory Map
- แต่ละช่องมี micro-animation ของตัวเอง เช่น ช่อง Debugging แสดงขั้นตอนไฮไลต์วนทีละขั้น, ช่อง Comparison สลับ `A vs B` ทุก 2 วินาที

### 4.6 "Last 30 Minutes" CTA

- ตัวเลขนาฬิกาใหญ่ `30:00` แบบ mono นับถอยหลังจริงเมื่อ hover (เป็นลูกเล่น ไม่ใช่เวลาจริง)
- ข้อความ: `เหลือเวลาก่อนสัมภาษณ์?` + ปุ่ม `อ่าน PART 30 →`

### 4.7 Footer — Giant Wordmark

- คำว่า `DEVPATH` ตัวใหญ่เต็มความกว้างจอ แบบ outline สีจาง ขยับ parallax ขึ้นช้ากว่าการ scroll
- ลิงก์ย่อยเป็น mono ตัวเล็ก

---

## 5. Global UI

- **Navbar แบบ floating pill** ลอยกลางด้านบน มีพื้นโปร่งแสง + backdrop-blur ซ่อนตอน scroll ลง แล้วโผล่กลับตอน scroll ขึ้น
- **Command palette** (`Ctrl/Cmd + K`) เปิดเป็น modal กลางจอพร้อม scale-in animation
- **Custom cursor:** จุดเล็กตามเมาส์ ขยายเป็นวงกลมเมื่ออยู่บนลิงก์หรือการ์ด ใช้เฉพาะอุปกรณ์ที่มีเมาส์ (`pointer: fine`)
- **Page transition:** เปลี่ยนหน้าด้วย fade + slide up 12px
- **Link hover:** เส้นใต้วิ่งจากซ้ายไปขวา

---

## 6. หน้าอ่าน `/part/[slug]` — ลูกเล่นน้อยลงโดยตั้งใจ

- **Header ของ PART:** เลข PART ตัวใหญ่มาก (`03`) outline + ชื่อ PART แบบ mask reveal ครั้งเดียวตอนโหลด
- **แถบ progress:** เส้นบางสี `--signal` ด้านบน
- **หัวข้อ `##`:** fade-in เบา ๆ ตอนเลื่อนมาถึง แต่ **ห้าม animate ย่อหน้าเนื้อหา**
- **Code block / ASCII diagram:** การ์ดพื้น `--paper-2` มีแถบหัว mono `DIAGRAM` + ปุ่ม copy ห้ามตัดบรรทัด
- **Callout "ให้มองภาพนี้ว่า":** ขอบซ้ายสี `--electric` พื้นอ่อน มีไอคอนตาเล็ก ๆ
- **Prev / Next:** การ์ดใหญ่ 2 ใบท้ายหน้า hover แล้วลูกศรเลื่อนออก
- ไม่ใช้ smooth scroll (Lenis) ในหน้านี้ เพื่อไม่ให้การเลื่อนอ่านหนืด

---

## 7. Guardrails (ห้ามพลาด)

- [ ] Lighthouse หน้าแรก: Performance ≥ 85, Accessibility ≥ 95 / หน้าอ่าน: Performance ≥ 95
- [ ] 3D โหลดหลังหน้าแรกแสดงแล้ว และมี poster SVG ระหว่างรอ
- [ ] `prefers-reduced-motion` → ทุกอย่างนิ่ง และยังใช้งานได้ครบ
- [ ] มือถือ: ไม่มี custom cursor ไม่มี 3D และ marquee วิ่งช้าลง
- [ ] contrast ผ่าน WCAG AA และห้ามใช้ `--signal` กับตัวอักษรเล็กกว่า 24px
- [ ] ใช้คีย์บอร์ดได้ครบ มี focus ring สี `--electric` ชัดเจน
- [ ] animation ใช้เฉพาะ `transform` / `opacity` (ไม่ animate width/height/top)
- [ ] ภาพและ illustration ทั้งหมดสร้างเองในโปรเจกต์ ห้ามดึงไฟล์จากเว็บอื่น

---

## 8. ลำดับการทำ

1. ตั้ง tokens + ฟอนต์ + grain overlay
2. Navbar pill + custom cursor + page transition
3. Hero (ทำเวอร์ชัน SVG นิ่งก่อน แล้วค่อยเพิ่ม 3D)
4. Marquee → Sticky story → Gallery → Bento → CTA → Footer
5. ปรับหน้าอ่านตามข้อ 6
6. ไล่ Guardrails ทีละข้อ แล้วแคปหน้าจอ desktop + มือถือ 375px มาให้ดู
