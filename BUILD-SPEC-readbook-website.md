# Build Spec — Interview Read Book Website (Next.js)

สร้างเว็บอ่านหนังสือจากไฟล์ Markdown ที่มีอยู่แล้ว สไตล์ **light minimalist + vector art** เข้าถึงง่าย อ่านสบายตา

## Input

- โฟลเดอร์ `sw-dev-interview-readbook/` มี 32 ไฟล์: `00-README-TOC.md` + `part-00-*.md` ถึง `part-30-*.md`
- ให้ copy ไว้ที่ `content/` ของโปรเจกต์ **ห้ามแก้เนื้อหา markdown**
- เนื้อหาเป็นภาษาไทย + keyword อังกฤษ มีตารางเยอะ และมี ASCII diagram ใน code block จำนวนมาก

## Stack

- Next.js (App Router, TypeScript, เวอร์ชัน stable ล่าสุด)
- Tailwind CSS + `@tailwindcss/typography`
- Markdown: `remark-gfm` (จำเป็น เพราะมีตาราง) + `rehype-slug` + `rehype-autolink-headings`
- Static generation ทุกหน้า (`generateStaticParams`) ไม่ต้องมี backend / database
- Deploy ได้บน Vercel หรือเป็น static export

## Routes

| Route | แสดงอะไร |
|---|---|
| `/` | หน้าแรก: ชื่อหนังสือ, คำอธิบาย 1–2 บรรทัด, รายการ PART แบ่งตาม 6 ส่วนของสารบัญ (render จาก `00-README-TOC.md`) |
| `/part/[slug]` | เนื้อหาแต่ละ PART เช่น `/part/part-03-react` |

## Layout

```
┌──────────────┬──────────────────────────┬────────────┐
│ Sidebar      │ เนื้อหา (max ~72ch)       │ On this    │
│ รายการ PART  │                          │ page (##)  │
│ 0–30         │                          │            │
└──────────────┴──────────────────────────┴────────────┘
```

- **Sidebar ซ้าย:** รายการ PART ทั้งหมด ไฮไลต์ PART ที่กำลังอ่าน มือถือให้ซ่อนเป็นปุ่มเมนู
- **ขวา:** สารบัญในหน้า สร้างจากหัวข้อ `##` (13 หัวข้อของแต่ละ chapter) ไฮไลต์หัวข้อที่เลื่อนมาถึง ซ่อนบนจอเล็ก
- **ท้ายหน้า:** ปุ่ม ← PART ก่อนหน้า / PART ถัดไป →
- **บนสุด:** แถบ reading progress บาง ๆ

## Design — Light Minimalist + Vector Art

**ธีมสว่างอย่างเดียว ไม่มี dark mode**

- **สี:** พื้นหลังออฟไวท์อุ่น `#FAF8F4` ตัวอักษรหลัก `#1F2937` ตัวอักษรรอง `#6B7280` สี accent หลัก 1 สี (เช่น teal `#0F766E`) และสีรองสำหรับภาพประกอบอีก 2 สีแบบพาสเทล (เช่น peach `#F4B393`, sky `#9CC5E0`)
- **ฟอนต์:** เนื้อหาใช้ `IBM Plex Sans Thai` หรือ `Noto Sans Thai` ผ่าน `next/font` ขนาด 18px, line-height 1.85 ส่วน code/diagram ใช้ `JetBrains Mono` หรือ `IBM Plex Mono`
- **ช่องว่าง:** เว้นเยอะ ขอบมน 12–16px เงาบางมากหรือไม่มีเลย เส้นแบ่ง 1px สีอ่อน

**Vector art (flat / line illustration)**

- ทำเป็น **inline SVG** เขียนเองในโปรเจกต์ ห้ามดึงภาพจากภายนอก และห้ามใช้ตัวละครหรือโลโก้ของแบรนด์จริง
- สไตล์: เส้นหนาเท่ากัน (stroke 2px) รูปทรงเรขาคณิตเรียบง่าย ใช้สีจาก palette ด้านบนเท่านั้น
- **Hero หน้าแรก:** ภาพคนนั่งอ่านหนังสือ มีกล่อง / ลูกศร / เซิร์ฟเวอร์ลอยรอบ ๆ สื่อถึง Frontend → Backend → Database
- **ไอคอน 6 ส่วนของสารบัญ:** Foundation = อิฐ, Frontend = หน้าต่างเบราว์เซอร์, Backend = เฟือง, Infrastructure = กล่องซ้อนกัน, คิดแบบ Senior = หลอดไฟ, Interview = ป้ายชื่อ
- **หัวของแต่ละ PART:** แถบภาพประกอบเล็ก ๆ ใช้ไอคอนของส่วนนั้นในสีอ่อน
- ภาพประกอบทุกชิ้นเป็นการตกแต่ง ให้ใส่ `aria-hidden="true"`

## Accessibility (ต้องผ่าน)

- contrast ตัวอักษรกับพื้นหลังผ่าน WCAG AA ทุกจุด (≥ 4.5:1 สำหรับเนื้อหา)
- ใช้งานด้วยคีย์บอร์ดได้ครบ มี focus ring ชัดเจน และมีลิงก์ "ข้ามไปเนื้อหา"
- เคารพ `prefers-reduced-motion`
- ปุ่มและลิงก์ที่กดบนมือถือมีขนาดอย่างน้อย 44×44px
- ใช้ HTML ที่มีความหมาย (`nav`, `main`, `article`, `aside`) และหัวข้อเรียงลำดับถูกต้อง

## Rendering ที่ต้องทำให้ถูก

1. **ASCII diagram:** ให้ code block เป็น `white-space: pre` เลื่อนแนวนอนได้เมื่อจอแคบ **ห้ามตัดบรรทัด** เพราะตัวอักษรกล่อง `┌ ├ └ │ ↓ →` จะเพี้ยนถ้า wrap
2. **ตาราง:** ครอบด้วย container ที่ scroll แนวนอนได้บนมือถือ ใส่เส้นแบ่งแถวบาง ๆ
3. **Blockquote `> ให้มองภาพนี้ว่า ...`:** ทำเป็น callout เบา ๆ (เส้นซ้าย + พื้นอ่อน)
4. **ลิงก์ภายใน:** แปลง `./part-03-react.md` → `/part/part-03-react` และ `./00-README-TOC.md` → `/`
5. **Emoji ในหัวข้อ** (🧠 🟢 🟡 🔴): แสดงตามปกติ ไม่ต้องแปลง

## Features

- **ค้นหา:** ค้นฝั่ง client จากชื่อ PART และหัวข้อ `##` / `###` (สร้าง index ตอน build ใช้ Fuse.js หรือ FlexSearch) เปิดด้วย `Ctrl/Cmd + K`
- **จำตำแหน่งที่อ่านล่าสุด** ด้วย localStorage (ครอบ try/catch) แสดงปุ่ม "อ่านต่อ" บนหน้าแรก
- **Print-friendly:** เวลาพิมพ์ให้ซ่อน sidebar และปุ่มต่าง ๆ

## โครงโปรเจกต์ (แนะนำ)

```
content/               ← ไฟล์ .md 32 ไฟล์
app/
  layout.tsx           ← ฟอนต์, theme, sidebar
  page.tsx             ← หน้าแรก
  part/[slug]/page.tsx ← หน้าเนื้อหา
lib/content.ts         ← อ่านไฟล์, สร้างลำดับ prev/next, ดึงหัวข้อ
components/            ← Sidebar, OnThisPage, Search, ProgressBar
  illustrations/       ← SVG: Hero + ไอคอน 6 ส่วน
```

## Acceptance Checklist

- [ ] build ผ่าน และสร้างหน้าได้ครบ 31 PART + หน้าแรก
- [ ] ASCII diagram ใน PART 14 (Kubernetes) และ PART 28 (Memory Map) เรียงตรง ไม่เพี้ยน ทั้งบน desktop และมือถือ
- [ ] ตารางใน PART 27 (Comparison) และ PART 29 (Cheat Sheet) อ่านได้บนมือถือกว้าง 375px
- [ ] ลิงก์ "← สารบัญ" ท้ายทุก PART กลับหน้าแรกได้
- [ ] prev/next เรียงถูกตั้งแต่ PART 0 ถึง 30
- [ ] ไม่มี dark mode และหน้าตาเหมือนเดิมแม้ระบบตั้งเป็น dark
- [ ] มี hero illustration บนหน้าแรก และไอคอน SVG ครบ 6 ส่วน
- [ ] ใช้งานด้วยคีย์บอร์ดล้วนได้ มี focus ring ชัดเจน
- [ ] ค้นหาคำว่า "401" แล้วเจอ PART 1 และ PART 20
- [ ] Lighthouse: Accessibility ≥ 95, Performance ≥ 90