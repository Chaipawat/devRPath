# PART 4 — NEXT.JS

> ตำแหน่งในภาพใหญ่: Frontend Layer (ที่ยื่นขาข้ามไปฝั่ง Server) — React ที่มี "เครื่องยนต์ฝั่งเซิร์ฟเวอร์" ติดมาให้แล้ว

---

## 1. Big Picture

ถ้า **React** คือ "เครื่องมือวาดหน้าจอ" — **Next.js** คือ "โรงงานทั้งโรง" ที่มีเครื่องวาดหน้าจออยู่ข้างใน แล้วเติมของที่ React ไม่มีให้เข้าไปอีกเป็นกอง

React เพียว ๆ ตอบคำถามได้ข้อเดียว: *"ข้อมูลชุดนี้ ควรกลายเป็น UI หน้าตาแบบไหน"*
แต่พอทำงานจริง จะเจอคำถามอีกสิบข้อที่ React ไม่ตอบให้

| คำถามที่เจอจริงตอนทำงาน | React เพียว ๆ ตอบให้ไหม | Next.js ตอบให้ |
|---|---|---|
| หน้า `/products/123` ต้องไปโผล่ที่ไฟล์ไหน | ❌ ต้องลง react-router เอง | ✅ File-based routing |
| อยากให้ Google เห็นเนื้อหาในหน้า | ❌ crawler เจอหน้าเปล่า | ✅ SSR / SSG |
| อยากดึงข้อมูลจาก database ตรง ๆ ไม่ผ่าน API | ❌ ทำไม่ได้ โค้ดอยู่ที่ browser | ✅ Server Component |
| อยากให้รูปเล็กลงอัตโนมัติตามขนาดจอ | ❌ ทำมือ | ✅ `next/image` |
| อยากมี backend endpoint เล็ก ๆ ในโปรเจกต์เดียวกัน | ❌ ต้องแยก server | ✅ Route Handler |
| อยากเช็ค login ก่อนเข้าเพจ ตั้งแต่ยังไม่ถึง React | ❌ | ✅ Middleware |
| อยาก cache หน้าไว้ แล้ว refresh ทุก 60 วินาที | ❌ | ✅ ISR / Revalidation |

**Next.js คืออะไรในหนึ่งประโยค**

> Framework ที่เอา React มาวางไว้ตรงกลาง แล้วเติม routing, rendering strategy, data fetching, caching, image optimization, backend endpoint และ deployment convention เข้าไป เพื่อให้ทำ production web app ได้ครบในโปรเจกต์เดียว

แต่จุดที่ทำให้ Next.js "ต่างจาก React จริง ๆ" **ไม่ใช่ feature** — มันคือประโยคนี้:

> **โค้ดของคุณไม่ได้รันที่ browser อย่างเดียวอีกต่อไป**

โค้ดบางส่วนรันบน **server** บางส่วนรันบน **browser** และการที่คุณ *รู้ว่าชิ้นไหนรันที่ไหน* คือหัวใจของ Next.js ยุค App Router ทั้งหมด — และคือที่มาของคำถามสัมภาษณ์ Next.js กว่าครึ่ง

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Framework** | "บ้านสำเร็จรูป" | ชุดเครื่องมือที่กำหนดโครงให้แล้ว เราเติมเนื้อ — *framework เรียกโค้ดเรา* |
| **Library** | "อิฐ" | เครื่องมือชิ้นเดียวที่เราเรียกใช้ — *เราเรียก library* |
| **App Router** | "โฟลเดอร์ = URL" | ระบบ routing ยุคใหม่ ใช้โฟลเดอร์ `app/` กำหนด URL และเป็น Server Component by default |
| **Pages Router** | "รุ่นเก่า" | ระบบ routing เดิมใช้โฟลเดอร์ `pages/` — ทุก component เป็น Client Component |
| **Routing** | "แผนที่ URL" | การจับคู่ URL → หน้า/โค้ดที่ต้องรัน |
| **Nested Route** | "โฟลเดอร์ซ้อนโฟลเดอร์" | URL ซ้อนชั้น เช่น `/dashboard/settings/profile` |
| **Dynamic Route** | "ช่องว่างใน URL" | URL ที่มีส่วนเปลี่ยนได้ เช่น `/products/[id]` |
| **Layout** | "กรอบที่ไม่หายตอนเปลี่ยนหน้า" | UI ที่ครอบหลายหน้า และ **ไม่ re-render ใหม่** ตอน navigate ภายในกรอบเดียวกัน |
| **Server Component** | "โค้ดที่ browser ไม่เคยเห็น" | Component ที่รันบน server เท่านั้น และ **ไม่ส่ง JS ของตัวเองไป client เลย** |
| **Client Component** | "โค้ดที่ต้องยกไปวางบนโต๊ะ browser" | Component ที่ต้องมี interactivity จึงต้องส่ง JS ไปรันที่ browser (`"use client"`) |
| **CSR** | "browser วาดเอง" | Client-Side Rendering — server ส่ง HTML เปล่า + JS แล้ว browser วาด |
| **SSR** | "วาดใหม่ทุก request" | Server-Side Rendering — server สร้าง HTML ตอนมี request เข้ามา |
| **SSG** | "วาดไว้ตอน build" | Static Site Generation — สร้าง HTML ตอน build แล้วเสิร์ฟไฟล์เดิมให้ทุกคน |
| **ISR** | "SSG ที่มีวันหมดอายุ" | Incremental Static Regeneration — static แต่สร้างใหม่เป็นระยะโดยไม่ต้อง build ทั้งเว็บ |
| **Hydration** | "เสียบปลั๊กให้ HTML" | เอา JS ไปผูก event เข้ากับ HTML ที่ server ส่งมา ให้กดได้จริง |
| **Hydration Error** | "server วาด ≠ client วาด" | HTML จาก server ไม่ตรงกับที่ React วาดที่ client รอบแรก |
| **Data Fetching** | "ไปเอาข้อมูล" | ใน App Router ทำได้ทั้งฝั่ง server (แตะ DB ตรงได้) และฝั่ง client |
| **Caching** | "จำคำตอบไว้ ไม่ต้องไปถามซ้ำ" | เก็บผลลัพธ์ไว้ใช้ซ้ำ — Next.js มีหลายชั้นทับกัน |
| **Revalidation** | "ล้างของเก่า" | บอกว่า cache หมดอายุ — ทำตามเวลา (time-based) หรือตามเหตุการณ์ (on-demand) |
| **Middleware** | "รปภ. หน้าตึก" | โค้ดที่รันก่อนถึง route จริง ใช้ redirect / auth gate / rewrite |
| **Route Handler** | "API endpoint ในบ้านเดียวกัน" | ไฟล์ที่ export ฟังก์ชันตาม HTTP method เพื่อเป็น backend endpoint |
| **Server Action** | "ปุ่มบน client เรียกฟังก์ชัน server" | กลไกที่ให้ form/ปุ่ม เรียกโค้ดฝั่ง server ได้โดยไม่ต้องเขียน API เอง |
| **Metadata** | "ป้ายบอกตัวตนของหน้า" | title / description / og image ที่ Next.js แปะลง `<head>` |
| **SEO** | "ทำให้ Google อ่านออก" | ให้เนื้อหาเห็นได้ตั้งแต่ HTML แรก |
| **Image Optimization** | "รูปที่พอดีกับจอ" | `next/image` ปรับขนาด / format / lazy load ให้อัตโนมัติ |
| **Environment Variable** | "ค่าที่เปลี่ยนตามที่ deploy" | ค่า config นอกโค้ด — `NEXT_PUBLIC_*` = สาธารณะ, ที่เหลือ = server-only |
| **RSC Payload** | "พิมพ์เขียวของ UI" | ผลลัพธ์ที่ Server Component ส่งไป client — ไม่ใช่ JS แต่เป็นคำอธิบายว่า UI หน้าตาแบบไหน |
| **Streaming** | "ทยอยเสิร์ฟ" | ส่ง HTML ออกเป็นส่วน ๆ ไม่ต้องรอครบทั้งหน้า |

---

## 3. Mental Model

### Mental Model #1 — Next.js = React + คำถาม 2 ข้อ

ทุกครั้งที่เขียนโค้ดใน Next.js ให้ถามในหัว 2 คำถามนี้เสมอ:

```
คำถามที่ 1: โค้ดชิ้นนี้ "รันที่ไหน"    → Server? Client? หรือทั้งสอง?
คำถามที่ 2: HTML นี้ "ถูกวาดตอนไหน"   → ตอน build? ตอน request? หรือตอน browser โหลดเสร็จ?
```

- คำถามที่ 1 = เรื่องของ **Server Component vs Client Component**
- คำถามที่ 2 = เรื่องของ **SSG / ISR / SSR / CSR**

**สองคำถามนี้เป็นคนละแกน ไม่ใช่เรื่องเดียวกัน** — และนี่คือที่มาของหัวข้อ "Server Component ≠ SSR" ในข้อ 5 ซึ่งเป็นคำถามสัมภาษณ์ที่คัดคนได้จริง

### Mental Model #2 — คิดแบบ "server ก่อน แล้วค่อยเจาะหน้าต่างให้ client"

```
ทุก component เป็น Server Component โดยปริยาย
        ↓
เจอจุดที่ต้อง "กดแล้วมีอะไรเกิดขึ้นทันที" (state / event / browser API)
        ↓
ถึงค่อยติดป้าย "use client" ที่จุดนั้น
        ↓
JS ที่ส่งไป browser = เฉพาะกิ่งที่ติดป้าย
```

> **ให้มองภาพนี้ว่า** "เขียน Next.js คือการเริ่มจากฝั่ง server ทั้งหมด แล้วค่อย ๆ เจาะหน้าต่างเล็ก ๆ ให้ browser เข้ามาแตะเท่าที่จำเป็นจริง ๆ"

### Mental Model #3 — Cache คือ "ชั้น ๆ ไม่ใช่สวิตช์เดียว"

Junior มักคิดว่า cache = เปิด/ปิด แต่ Next.js มี cache หลายชั้นทับกัน คิดเป็นชั้นจะ debug ง่ายขึ้นมาก

```
Browser / CDN
      ↓
Router Cache          (RSC Payload ที่ client เคยโหลด)
      ↓
Full Route Cache      (HTML + RSC Payload ของทั้งหน้า)
      ↓
Data Cache            (ผลของ fetch แต่ละอัน ข้าม request)
      ↓
Request Memoization   (fetch URL ซ้ำใน request เดียว = ยิงครั้งเดียว)
      ↓
ของจริง (DB / External API)
```

> **ให้มองภาพนี้ว่า** "ข้อมูลที่ผู้ใช้เห็น อาจมาจากชั้นใดชั้นหนึ่งใน 5 ชั้นนี้ — เวลาข้อมูลไม่อัปเดต ให้ไล่ถามทีละชั้นว่าใครเก็บของเก่าไว้"

### Mental Model #4 — หน้าเว็บมี 2 จังหวะเสมอ

```
จังหวะที่ 1: "เห็น"   → HTML มาถึง ผู้ใช้อ่านได้ แต่กดไม่ได้
จังหวะที่ 2: "กดได้"  → JS มาถึง + hydrate เสร็จ
```

งานของ Next.js developer = ทำให้จังหวะที่ 1 มาเร็วที่สุด และช่องว่างระหว่าง 1 กับ 2 สั้นที่สุด

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำ #1 — React vs Next.js
React    = เครื่องยนต์
Next.js  = รถทั้งคัน (เครื่องยนต์ + ล้อ + พวงมาลัย + GPS + ไฟหน้า)
ซื้อเครื่องยนต์มาเปล่า ๆ ก็ขับไปไหนไม่ได้
```

```
🧠 ภาพจำ #2 — Framework vs Library
Library   = เราเป็นคนโทรหาเขา   (You call the library)
Framework = เขาเป็นคนโทรหาเรา   (The framework calls you)

Library:    "ฉันอยากวาดกราฟ" → เรียก chart.draw()
Framework:  วางไฟล์ไว้ตรงตำแหน่งที่เขากำหนด → เขาจะมาเรียกเอง
```

```
🧠 ภาพจำ #3 — Server Component vs Client Component
Server Component = "เชฟในครัว"       ลูกค้าไม่เคยเห็นสูตร เห็นแต่จานที่เสิร์ฟ
Client Component = "เครื่องปรุงบนโต๊ะ" ต้องยกไปวางบนโต๊ะลูกค้าจริง ๆ ลูกค้าถึงปรุงเองได้

สูตรอาหาร (โค้ด Server Component) → ไม่ออกจากครัว    → bundle เล็ก
ขวดพริกไทย (โค้ด Client Component) → ต้องยกไปวางบนโต๊ะ → bundle ใหญ่ขึ้น
```

```
🧠 ภาพจำ #4 — Hydration
HTML จาก server = "หุ่นโชว์ในตู้กระจก"  หน้าตาเหมือนของจริง แต่กดไม่ได้
JS ที่ตามมาทีหลัง = "การเสียบปลั๊ก"       กดได้แล้ว

HTML มาก่อน  → เห็นเร็ว แต่กดไม่ได้
JS มาทีหลัง  → กดได้
ช่วงระหว่างนั้น = ช่วงที่ user กดแล้วไม่มีอะไรเกิดขึ้น
```

```
🧠 ภาพจำ #5 — Rendering Strategy
SSG = "พิมพ์หนังสือไว้ล่วงหน้า"      ใครมาก็หยิบเล่มเดิม
ISR = "หนังสือที่พิมพ์ใหม่ทุกเดือน"   หยิบเล่มเดิม แต่ถึงรอบก็พิมพ์ใหม่
SSR = "เขียนจดหมายใหม่ทุกครั้งที่มีคนขอ"
CSR = "ส่งกระดาษเปล่า + ปากกา ให้ผู้อ่านเขียนเอง"
```

```
🧠 ภาพจำ #6 — NEXT_PUBLIC_
NEXT_PUBLIC_XXX = "เขียนบนป้ายหน้าร้าน"  ใครเดินผ่านก็อ่านได้
DATABASE_URL    = "เก็บในลิ้นชักหลังร้าน" พนักงานเท่านั้นที่เห็น

เอาของในลิ้นชักไปเขียนบนป้าย = ความลับหลุด และ "ลบทีหลังไม่ได้"
```

```
🧠 ภาพจำ #7 — Middleware
Middleware = รปภ. หน้าตึก
ทำได้ 3 อย่างเท่านั้น: ปล่อยเข้า / ไล่ไปที่อื่น / พาเข้าประตูอื่น
รปภ. ไม่ได้ทำบัญชีบริษัท → อย่าเอา business logic ไปใส่
```

---

## 5. How It Works

### 5.1 Flow หลัก — Request → Hydration (ต้องอธิบายได้ในห้องสัมภาษณ์)

```
[BROWSER]  user พิมพ์ URL / คลิกลิงก์
      ↓
[MIDDLEWARE]  รันก่อนใคร — เช็ค cookie, redirect, rewrite
      ↓
[NEXT SERVER]  จับคู่ URL → route ในโฟลเดอร์ app/
      ↓
[CACHE CHECK]  หน้านี้มีใน Full Route Cache ไหม? ── มี ──┐
      ↓ ไม่มี                                            │
[SERVER COMPONENT]  รันโค้ด component บน server          │
      ↓                                                  │
[DATA]  fetch API / query DB ตรง ๆ (ผ่าน Data Cache)     │
      ↓                                                  │
[RENDER]  ได้ HTML + RSC Payload                         │
      ↓                                                  │
[STREAM]  ทยอยส่ง HTML ออกไป  ←──────────────────────────┘
      ↓
[BROWSER]  แสดง HTML ทันที (เห็นเนื้อหาแล้ว แต่ยังกดไม่ได้)
      ↓
[JS BUNDLE]  โหลด JS เฉพาะของ Client Component
      ↓
[HYDRATION]  React ผูก event listener เข้ากับ HTML เดิม
      ↓
[INTERACTIVE]  กดได้ / state ทำงาน / useEffect รัน
```

> **ให้มองภาพนี้ว่า** "Next.js พยายามให้ผู้ใช้ *เห็น* หน้าเว็บให้เร็วที่สุดก่อน แล้วค่อยทยอยทำให้มัน *กดได้* ทีหลัง"

### 5.2 App Router — โฟลเดอร์กลายเป็น URL อย่างไร

```
app/
 ├─ layout.tsx            → กรอบครอบทั้งเว็บ (root layout)
 ├─ page.tsx              → /
 ├─ about/
 │   └─ page.tsx          → /about
 ├─ dashboard/
 │   ├─ layout.tsx        → กรอบครอบทุกหน้าใน /dashboard
 │   ├─ page.tsx          → /dashboard
 │   └─ settings/
 │       └─ page.tsx      → /dashboard/settings      ← Nested Route
 ├─ products/
 │   └─ [id]/
 │       └─ page.tsx      → /products/123            ← Dynamic Route
 └─ api/
     └─ orders/
         └─ route.ts      → /api/orders              ← Route Handler
```

> **ให้มองภาพนี้ว่า** "โครงสร้างโฟลเดอร์ก็คือ sitemap ของเว็บ — อยากรู้ว่า URL ไหนอยู่ไฟล์ไหน ให้อ่านชื่อโฟลเดอร์ไล่ลงไปตามลำดับ"

**ไฟล์พิเศษที่ต้องรู้จัก**

| ไฟล์ | หน้าที่ | ใช้ตอนไหน |
|---|---|---|
| `page.tsx` | เนื้อหาของ URL นั้น | ทุก URL ที่เข้าได้ต้องมี |
| `layout.tsx` | กรอบที่ครอบหน้าลูก ๆ | Navbar / Sidebar ที่ไม่ควรกระพริบตอนเปลี่ยนหน้า |
| `loading.tsx` | UI ระหว่างรอ | ให้ user เห็น skeleton แทนหน้าขาว |
| `error.tsx` | UI ตอนพัง | Error Boundary ของ segment นั้น (ต้องเป็น Client Component) |
| `not-found.tsx` | UI 404 | หา resource ไม่เจอ |
| `route.ts` | API endpoint | ต้องการ backend endpoint |
| `template.tsx` | เหมือน layout แต่ re-mount ทุกครั้ง | ต้องการ animation ตอนเปลี่ยนหน้า |

**Dynamic Route มี 3 แบบที่ควรรู้**

| รูปแบบ | จับอะไร | ตัวอย่าง |
|---|---|---|
| `[id]` | หนึ่งช่วง | `/products/123` |
| `[...slug]` | หลายช่วง (catch-all) | `/docs/a/b/c` |
| `[[...slug]]` | หลายช่วง หรือไม่มีเลย | `/docs` และ `/docs/a/b` |

### 5.3 Layout ทำงานอย่างไร (Nested Layout)

```
RootLayout  (app/layout.tsx)
    └── DashboardLayout  (app/dashboard/layout.tsx)
            └── SettingsPage  (app/dashboard/settings/page.tsx)
```

เวลาเปลี่ยนจาก `/dashboard` → `/dashboard/settings`:

```
RootLayout       → คงอยู่ ไม่ re-render
DashboardLayout  → คงอยู่ ไม่ re-render  (sidebar ไม่กระพริบ, scroll ไม่เด้ง)
page เท่านั้น     → เปลี่ยน
```

> **ให้มองภาพนี้ว่า** "Layout คือกรอบรูป ส่วน page คือรูปในกรอบ — เปลี่ยนรูปได้โดยไม่ต้องถอดกรอบลงมาทำใหม่"

นี่ไม่ใช่แค่เรื่องความสวย แต่เป็นเรื่อง **performance** — layout ที่มี component หนัก ๆ จะไม่ถูกคำนวณใหม่ทุกครั้งที่เปลี่ยนหน้า

### 5.4 Rendering Strategy — "วาดตอนไหน"

```
เวลาเดินจากซ้ายไปขวา →

BUILD TIME           REQUEST TIME            AFTER LOAD (browser)
    │                     │                        │
   SSG                   SSR                      CSR
    │                     │                        │
 สร้าง HTML          สร้าง HTML ใหม่           browser วาดเอง
 ครั้งเดียว           ทุก request               ด้วย JS
    │
   ISR  ── เริ่มเป็น SSG แล้วสร้างใหม่เป็นระยะ ──→
```

> **ให้มองภาพนี้ว่า** "แกนนี้คือ *เวลาที่ HTML ถูกสร้าง* — ยิ่งซ้ายยิ่งเร็วและถูก แต่ข้อมูลยิ่งเก่า ยิ่งขวายิ่งสดแต่เปลืองและช้ากว่า"

### 5.5 Hydration Flow แบบละเอียด

```
[SERVER]  render → HTML string + RSC Payload
      ↓
[NETWORK]
      ↓
[BROWSER]  paint HTML   ← ผู้ใช้เห็นเนื้อหาแล้ว
      ↓
[BROWSER]  ดาวน์โหลด JS bundle ของ Client Component
      ↓
[REACT]    render tree ที่ client รอบแรก
      ↓
[REACT]    เทียบกับ DOM ที่มีอยู่
      ↓
    ตรงกัน? ── ใช่ ──→ ผูก event listener → ✅ Interactive
      │
      └── ไม่ตรง ──→ ⚠️ Hydration Error → React ทิ้ง HTML เดิมแล้ววาดใหม่ที่ client
```

> **ให้มองภาพนี้ว่า** "Hydration คือการที่ React ตรวจว่า 'ของที่ server ส่งมา' กับ 'ของที่ฉันจะวาดเอง' เหมือนกันไหม ถ้าเหมือนก็แค่เสียบปลั๊ก ถ้าไม่เหมือนก็ต้องรื้อทำใหม่"

---

### 5.6 🔥 เจาะลึก — Server Component ≠ SSR

> **หัวข้อนี้แยก "คนเคยใช้ Next.js" ออกจาก "คนเข้าใจ Next.js"**
> ถ้าตอบข้อนี้ได้ชัด ผู้สัมภาษณ์จะเชื่อว่าคุณเข้าใจ architecture ไม่ใช่แค่ copy tutorial

#### (ก) ทำไมคนถึงสับสน

เพราะทั้งคู่มีคำว่า "Server" และทั้งคู่ "เกี่ยวกับการรันบน server" — แต่ **มันตอบคนละคำถาม**

```
SSR              ตอบคำถาม →  "HTML ถูกสร้าง เมื่อไร?"
                             (แกน: เวลา / WHEN)

Server Component ตอบคำถาม →  "โค้ดชิ้นนี้ รันที่ไหน + ส่ง JS ไป client แค่ไหน?"
                             (แกน: สถานที่ / WHERE + ขนาด JS)
```

**มันเป็นคนละแกนกัน ไม่ใช่ทางเลือกแทนกัน** — เหมือนถามว่า "รถสีแดง กับ รถเกียร์ออโต้ อันไหนดีกว่า" มันคนละเรื่อง

#### (ข) SSR คืออะไรกันแน่ — เรื่องของ "จังหวะเวลา"

- **มันคืออะไร:** การสร้าง HTML ที่ฝั่ง server ณ ตอนที่มี request เข้ามา แทนที่จะให้ browser สร้างเอง
- **มีไว้ทำไม:** ให้ผู้ใช้เห็นเนื้อหาเร็ว และให้ crawler อ่านเนื้อหาได้จาก HTML ตรง ๆ
- **ทำงานอย่างไร:** server รัน component → ได้ HTML string → ส่งไป → browser paint → JS ตามมา → hydrate
- **ใช้เมื่อไร:** หน้าที่ข้อมูลต่างกันทุกคน/ทุกครั้ง และยังต้องการให้เห็นเนื้อหาเร็ว
- **จุดสำคัญที่คนลืม:** SSR มีมาตั้งแต่ **ก่อน** Server Component จะเกิด — Next.js Pages Router ทำ SSR ได้ตั้งนานแล้ว ทั้งที่ทุก component เป็น Client Component ล้วน ๆ

#### (ค) Server Component คืออะไรกันแน่ — เรื่องของ "โค้ดอยู่ที่ไหน"

- **มันคืออะไร:** component ที่โค้ดของมัน **รันบน server เท่านั้น** และ **ไม่ถูกส่งไปเป็น JS ที่ browser เลย**
- **มีไว้ทำไม:** ลดขนาด JS bundle + ให้เข้าถึง resource ฝั่ง server (DB, filesystem, secret) ได้ตรง ๆ
- **ทำงานอย่างไร:** รันบน server → ได้ผลลัพธ์เป็น **RSC Payload** (คำอธิบาย UI ไม่ใช่โค้ด) → ส่งไป client → React ประกอบเป็น UI
- **ใช้เมื่อไร:** ทุกที่ที่ไม่ต้องการ interactivity — แสดงข้อมูล, layout, ดึงข้อมูล
- **จุดสำคัญที่คนลืม:** ต่อให้หน้านั้นเป็น **SSG** (สร้างตอน build ไม่มี request เลย) Server Component ก็ยังเป็น Server Component อยู่ดี

#### (ง) ตารางเทียบแบบตรง ๆ

| ประเด็น | SSR | Server Component |
|---|---|---|
| ตอบคำถามว่า | HTML ถูกสร้าง **เมื่อไร** | โค้ดรัน **ที่ไหน** |
| หน่วยของเรื่อง | ทั้ง **หน้า** (route) | **แต่ละ component** |
| ส่ง JS ของ component นั้นไป client ไหม | **ส่ง** (ต้องส่งเพื่อ hydrate) | **ไม่ส่ง** |
| มีก่อน/หลัง | มีมานาน (Pages Router ก็ทำได้) | ของใหม่ มากับ React Server Components |
| ผลต่อ bundle size | ไม่ลด (บางทีเพิ่มด้วยซ้ำ) | **ลดอย่างมีนัยสำคัญ** |
| เข้าถึง DB ตรง ๆ ได้ไหม | ไม่ได้ในตัว component (ทำได้แค่ใน `getServerSideProps` ซึ่งอยู่นอก component) | ได้ ในตัว component เลย |
| ใช้ `useState` / `onClick` ได้ไหม | ได้ (เพราะเป็น client component ที่แค่ pre-render) | **ไม่ได้** |
| เกี่ยวกับ Hydration ไหม | เกี่ยวมาก — ต้อง hydrate ทั้งหน้า | ตัวมันเองไม่ต้อง hydrate เลย |
| เป็น "กลยุทธ์" หรือ "ชนิดของ component" | กลยุทธ์การ render | ชนิดของ component |

#### (จ) ภาพสองแกน — ที่ทำให้เข้าใจทันที

```
                     แกน "JS ส่งไป client แค่ไหน"
                                ↑
                    น้อย  │  Server Component
                          │   (โค้ดไม่ไป client)
                          │
        ──────────────────┼──────────────────→  แกน "HTML สร้างเมื่อไร"
                          │                      SSG → ISR → SSR → CSR
                    เยอะ  │  Client Component
                          │   (โค้ดต้องไป client)
                                ↓
```

> **ให้มองภาพนี้ว่า** "หน้าเว็บหนึ่งหน้าเลือกได้พร้อมกันสองแกน — จะให้ HTML เกิดตอนไหน (แกนนอน) และจะยอมส่ง JS ไป browser แค่ไหน (แกนตั้ง)"

#### (ฉ) ตัวอย่าง 4 เคสที่พิสูจน์ว่ามันคนละเรื่อง

| Case | Server Component? | Rendering | อธิบาย |
|---|---|---|---|
| หน้า `/about` ที่เป็น static | ✅ ใช่ | **SSG** | มี Server Component แต่ **ไม่มี SSR เลย** เพราะ HTML สร้างตอน build |
| หน้า `/dashboard` ดึงข้อมูลสด | ✅ ใช่ | **SSR** | มีทั้งสองพร้อมกัน |
| Pages Router + `getServerSideProps` | ❌ ไม่ใช่ | **SSR** | มี SSR แต่ **ไม่มี Server Component เลย** — ทุกอันเป็น client |
| `"use client"` component ในหน้า SSR | ❌ ไม่ใช่ | **SSR** | Client Component ก็ถูก **pre-render บน server** ได้ ← จุดที่คนงงที่สุด |

#### (ช) จุดตายที่ต้องเข้าใจ — `"use client"` ไม่ได้แปลว่า "รันแค่ที่ client"

```
"use client"  แปลว่า → "ส่งโค้ดนี้ไป client ด้วย"
              ไม่ได้แปลว่า → "รันเฉพาะที่ client"

Client Component = รัน 2 ที่
   รอบที่ 1: บน server (pre-render เพื่อสร้าง HTML เริ่มต้น)
   รอบที่ 2+: บน browser (ตลอดไป หลัง hydrate)

Server Component = รัน 1 ที่
   บน server เท่านั้น จบ ไม่มีรอบสอง
```

นี่คือเหตุผลที่โค้ดแบบ `const w = window.innerWidth` ใน Client Component **ยังพังอยู่** ทั้งที่ใส่ `"use client"` แล้ว — เพราะมันถูกรันบน server รอบแรก ซึ่งไม่มี `window`

#### (ซ) ทำไม Server Component ลด bundle ได้จริง แต่ SSR ไม่ลด

```
SSR อย่างเดียว:
  server รัน component → ได้ HTML
  แต่ยังต้องส่ง "โค้ดของ component นั้น" ไป client เพื่อ hydrate
  → HTML + JS ทั้งก้อน

Server Component:
  server รัน component → ได้ RSC Payload
  โค้ดของ component ไม่ถูกส่งไปเลย (รวมถึง library ที่มัน import ด้วย)
  → HTML + RSC Payload (ไม่มี JS ของ component นั้น)
```

> **ให้มองภาพนี้ว่า** "SSR คือการ *ทำการบ้านให้ก่อน* แต่ยังต้องส่งตำราไปให้ด้วย ส่วน Server Component คือการ *ทำการบ้านให้ แล้วเก็บตำราไว้เอง*"

ตัวอย่างที่เห็นผลชัด: ถ้าใช้ library แปลง markdown ขนาดใหญ่ใน Server Component — library นั้น **ไม่ถูกส่งไป browser เลย** แต่ถ้าอยู่ใน Client Component ต่อให้หน้าเป็น SSR ก็ต้องส่งไปทั้งก้อน

#### (ฌ) สรุป 4 บรรทัดสำหรับตอบสัมภาษณ์

```
SSR              = เรื่องของ "เมื่อไร" → HTML ถูกสร้างตอนมี request
Server Component = เรื่องของ "ที่ไหน" → โค้ดรันบน server และ JS ไม่ถูกส่งไป client
Client Component = "ส่งไปด้วย" ไม่ใช่ "รันแค่ที่ client" — มันรันทั้งสองที่
SSG/ISR/SSR/CSR = แกนเวลา  |  Server/Client Component = แกนสถานที่
```

---

### 5.7 Data Fetching

| วิธี | รันที่ไหน | ใช้เมื่อไร | ข้อควรระวัง |
|---|---|---|---|
| `fetch()` ใน Server Component | server | ข้อมูลที่ต้องการตั้งแต่ render แรก / ต้อง SEO | ระวังพฤติกรรม cache |
| query DB ตรง ๆ ใน Server Component | server | มี DB อยู่ใกล้ ไม่อยากเขียน API ซ้อน | ห้ามเผลอย้าย component นี้ไปเป็น client |
| fetch ใน Client Component (`useEffect` / TanStack Query) | browser | ข้อมูลที่ขึ้นกับ interaction / real-time / infinite scroll | เกิด waterfall + ไม่ช่วย SEO |
| Route Handler แล้วให้ client เรียก | server (ผ่าน HTTP) | ต้อง expose ให้ mobile app หรือ third-party | เพิ่ม network hop โดยไม่จำเป็นถ้าใช้ในหน้าเดียวกัน |

**Waterfall vs Parallel** — ปัญหาที่เจอบ่อยที่สุดของการ fetch ฝั่ง server

```
Waterfall (ช้า):           Parallel (เร็ว):
fetch A                    fetch A ┐
  ↓ รอ                     fetch B ├─ ยิงพร้อมกัน
fetch B                    fetch C ┘
  ↓ รอ                        ↓
fetch C                     รอพร้อมกันครั้งเดียว
รวม = A+B+C                 รวม = max(A,B,C)
```

> **ให้มองภาพนี้ว่า** "ถ้าข้อมูลสามชุดไม่ต้องรอกัน อย่าต่อคิวให้มัน — สั่งพร้อมกันแล้วรอทีเดียว"

### 5.8 Caching — 4 ชั้นที่ต้องแยกออกจากกัน

| ชั้น | เก็บอะไร | อยู่ที่ไหน | ล้างอย่างไร |
|---|---|---|---|
| Request Memoization | ผลของ `fetch` URL ซ้ำใน request เดียว | server, ต่อ request | จบ request ก็หาย |
| Data Cache | ผลของ `fetch` ข้าม request | server, ถาวร | `revalidate` / `revalidateTag` |
| Full Route Cache | HTML + RSC Payload ของทั้งหน้า | server, ถาวร | `revalidatePath` / redeploy |
| Router Cache | RSC Payload ที่ client เคยโหลด | browser, ชั่วคราว | `router.refresh()` / เวลาผ่านไป |

> ⚠️ **ข้อควรระวังที่คำถามสัมภาษณ์ชอบดัก:** พฤติกรรม cache ที่เป็น default ของ `fetch` **เปลี่ยนไปมาระหว่าง Next.js แต่ละรุ่นหลัก** ถ้าถูกถามให้ตอบเชิงหลักการว่า *"ผมไม่พึ่ง default แต่จะระบุ caching option ให้ชัดในโค้ดเสมอ แล้วตรวจจาก build output ว่าหน้านั้นออกมาเป็น static หรือ dynamic"* — ปลอดภัยและถูกต้องกว่าการท่องค่า default

### 5.9 Revalidation — 2 แบบ

```
Time-based:   ตั้งเวลา เช่น 60 วินาที → ครบเวลาแล้วค่อยไปเอาใหม่
              เหมาะกับ: ข้อมูลที่เก่าได้บ้าง เช่น รายการสินค้า, บทความ

On-demand:    admin กดแก้ข้อมูล → ยิงสัญญาณล้าง cache ทันที
              เหมาะกับ: ข้อมูลที่ต้องอัปเดตทันทีหลังแก้ เช่น ราคา, สต็อก
```

> **ให้มองภาพนี้ว่า** "time-based คือนมที่มีวันหมดอายุ ส่วน on-demand คือคุณเดินไปเทนมทิ้งเองตอนรู้ว่ามันเสีย"

**จุดที่ต้องเข้าใจ:** revalidate ส่วนใหญ่หมายถึง *"คนถัดไปที่เข้ามาจะได้ของใหม่"* ไม่ใช่ *"คนที่กำลังดูอยู่จะเห็นของใหม่ทันที"*

### 5.10 Middleware

```
Request
   ↓
[MIDDLEWARE]   ← รันก่อนทุกอย่าง บน runtime ที่จำกัด
   ├─ ผ่าน     → ไปต่อที่ route ปกติ
   ├─ redirect → ส่งไป /login
   └─ rewrite  → เปลี่ยน URL ภายในโดย user ไม่เห็น
```

> **ให้มองภาพนี้ว่า** "Middleware คือ รปภ. หน้าตึก ที่ตัดสินใจได้แค่ ปล่อยเข้า / ไล่ไปที่อื่น / พาเข้าประตูอื่น — ไม่ใช่ที่ทำ business logic หนัก ๆ"

| ✅ เหมาะกับ | ❌ ไม่ควรใช้ทำ |
|---|---|
| auth gate เบื้องต้น (มี cookie ไหม) | query DB |
| redirect ตาม locale / geo | ตรวจสิทธิ์ละเอียดแทนชั้น data |
| A/B test | logic ซับซ้อนที่ใช้เวลานาน |
| เพิ่ม/แก้ header | อ่านไฟล์, ใช้ Node API ที่ runtime ไม่รองรับ |

### 5.11 Route Handler

- **มันคืออะไร:** ไฟล์ `route.ts` ที่ export ฟังก์ชันชื่อ `GET` / `POST` / `PUT` / `DELETE` เพื่อกลายเป็น HTTP endpoint
- **มีไว้ทำไม:** มี backend เล็ก ๆ ในโปรเจกต์เดียวกัน ไม่ต้องตั้ง server แยก
- **ใช้เมื่อไร:** webhook จาก third-party, endpoint ที่ mobile app ต้องเรียก, proxy ซ่อน API key, file upload
- **ไม่ต้องใช้เมื่อไร:** ถ้าแค่ดึงข้อมูลมาแสดงในหน้าเดียวกัน — Server Component ดึงตรง ๆ ได้เลย ไม่ต้องอ้อมผ่าน HTTP

### 5.12 Server Action (concept)

- **มันคืออะไร:** ฟังก์ชันฝั่ง server ที่ **เรียกได้จาก component ฝั่ง client เหมือนเรียกฟังก์ชันธรรมดา** (มาร์กด้วย `"use server"`)
- **มีไว้ทำไม:** ลดพิธีกรรม — เดิมต้องเขียน API route + fetch + จัดการ loading/error เอง
- **ทำงานอย่างไร:** Next.js สร้าง endpoint ให้อัตโนมัติเบื้องหลัง เวลาเรียกจริงคือการยิง HTTP ไป server แล้วรันฟังก์ชันนั้น

```
[BUTTON on client]
      ↓ เรียกเหมือนฟังก์ชันธรรมดา
[NEXT สร้าง network request ให้อัตโนมัติ]
      ↓
[SERVER รันฟังก์ชันจริง → แตะ DB ได้]
      ↓
[ส่งผลกลับ + revalidate cache ที่เกี่ยวข้อง]
      ↓
[UI อัปเดต]
```

> **ให้มองภาพนี้ว่า** "Server Action ทำให้ปุ่มบนหน้าเว็บเรียกฟังก์ชันใน server ได้เหมือนเรียกฟังก์ชันข้างบ้าน แต่เบื้องหลังมันคือ HTTP request อยู่ดี"

> ⚠️ **Security ที่ห้ามลืม:** Server Action = **endpoint สาธารณะโดยปริยาย** ใครก็ยิงได้ ต้องตรวจ authentication และ authorization ในตัว action เองทุกครั้ง อย่าคิดว่า "ปุ่มนี้ซ่อนไว้แล้วปลอดภัย"

### 5.13 Metadata & SEO

| เรื่อง | ทำอย่างไร | ทำไมสำคัญ |
|---|---|---|
| title / description | export `metadata` จาก layout หรือ page | Google แสดงผลตรงนี้ |
| Dynamic metadata | `generateMetadata()` ที่ดึงข้อมูลจริงมาใส่ | หน้า `/products/[id]` ต้องมี title ตามสินค้า |
| Open Graph | ใส่ `openGraph` ใน metadata | แชร์ลง social แล้วมีรูป/หัวข้อสวย |
| sitemap / robots | ไฟล์เฉพาะที่ Next.js รู้จัก | บอก crawler ว่ามีหน้าอะไรบ้าง |
| เนื้อหาต้องอยู่ใน HTML | ใช้ Server Component / SSR / SSG | ถ้าเนื้อหาโผล่หลัง `useEffect` crawler อาจไม่เห็น |
| Semantic HTML | `<h1>` เดียว, `<main>`, `alt` ในรูป | ช่วยทั้ง SEO และ accessibility |

### 5.14 Image Optimization

```
รูปต้นฉบับ 4000px
      ↓
[resize]        → ส่งขนาดที่พอดีกับจอจริง (มือถือได้รูปเล็ก)
      ↓
[format]        → แปลงเป็น format สมัยใหม่ถ้า browser รองรับ
      ↓
[lazy load]     → รูปที่ยังไม่ถึงตายังไม่โหลด
      ↓
[reserve space] → จองพื้นที่ไว้ก่อน → หน้าไม่กระโดด (ไม่เกิด layout shift)
```

> **ให้มองภาพนี้ว่า** "next/image คือช่างตัดรูปอัตโนมัติ ที่ตัดรูปให้พอดีกับจอของคนดูแต่ละคน แทนที่จะส่งรูปใหญ่ก้อนเดียวให้ทุกคน"

**เงื่อนไขที่ต้องรู้:** ต้องประกาศ `width`/`height` หรือใช้ `fill` เพื่อให้จองพื้นที่ได้ และถ้าใช้รูปจากโดเมนภายนอกต้องประกาศโดเมนนั้นใน config ก่อน

### 5.15 Environment Variables & Security ⚠️

```
NEXT_PUBLIC_XXX   →  ถูก "ฝังลงใน JS bundle" ตอน build
                  →  ใครเปิด DevTools ก็เห็น
                  →  = ข้อมูลสาธารณะ 100%

XXX (ไม่มี prefix) →  อยู่บน server เท่านั้น
                   →  Server Component / Route Handler / Server Action อ่านได้
                   →  Client Component อ่านได้เป็น undefined
```

| ตัวแปร | ใส่ `NEXT_PUBLIC_` ได้ไหม | เหตุผล |
|---|---|---|
| URL ของ API สาธารณะ | ✅ ได้ | เป็นข้อมูลที่ browser ต้องรู้อยู่แล้ว |
| Google Analytics ID | ✅ ได้ | ออกแบบมาให้เปิดเผย |
| Feature flag ทั่วไป | ✅ ได้ | ไม่ใช่ความลับ |
| `DATABASE_URL` | ❌ **เด็ดขาด** | = ยกฐานข้อมูลให้คนทั้งอินเทอร์เน็ต |
| `JWT_SECRET` | ❌ **เด็ดขาด** | ใครก็ปลอม token ได้ |
| Payment secret key | ❌ **เด็ดขาด** | = ยกกระเป๋าเงินให้ |
| API key ของ third-party | ❌ **เด็ดขาด** | ต้อง proxy ผ่าน Route Handler แทน |

> ⚠️ **ประโยคที่ต้องพูดในห้องสัมภาษณ์ให้ได้:** "การหลุดของ secret ไป client bundle **ย้อนกลับไม่ได้** — ต่อให้ deploy ใหม่ ค่าเก่าก็อาจถูกเก็บไว้ในเครื่องคนอื่นหรือใน CDN cache แล้ว ทางแก้เดียวคือ **rotate secret ทันที** ไม่ใช่แค่ลบตัวแปร"

**Security checklist อื่นของ Next.js**

| ความเสี่ยง | ป้องกันอย่างไร |
|---|---|
| เผลอ import โค้ดฝั่ง server เข้า Client Component | แยกไฟล์ให้ชัด และมาร์ก server-only module |
| Server Action ถูกยิงตรงโดยไม่ผ่าน UI | ตรวจ auth + validate input ในตัว action เสมอ |
| Middleware เป็นด่านเดียวที่กัน | ตรวจสิทธิ์ซ้ำที่ชั้นข้อมูลด้วยเสมอ |
| ข้อมูลลับหลุดผ่าน props ไป Client Component | props ที่ส่ง Server → Client ถูก serialize ไป client ทั้งหมด = เห็นได้ |
| Error message เปิดเผย stack trace | จัดการ error ให้ส่งข้อความกลาง ๆ ใน production |

---

## 6. Example — Scenario จากงานจริง

### Scenario 1 — เว็บ e-commerce ที่ต้องติดอันดับ Google

**โจทย์:** หน้ารายละเอียดสินค้า `/products/[id]` ต้อง (1) Google เห็นเนื้อหา (2) โหลดเร็ว (3) ราคาไม่เก่าเกิน 1 นาที (4) ปุ่ม "เพิ่มลงตะกร้า" กดได้

**วิธีคิด:**

```
เนื้อหาสินค้า (ชื่อ, รายละเอียด, รูป) → Server Component + ISR (revalidate 60)
ราคา + สต็อก                        → fetch ใน Server Component, revalidate สั้น
ปุ่มเพิ่มลงตะกร้า + ตัวนับจำนวน       → Client Component เล็ก ๆ ("use client")
Metadata (title/og)                 → generateMetadata() ดึงชื่อสินค้าจริง
รูปสินค้า                            → next/image
```

```
/products/123
      ↓
[SERVER COMPONENT]  ProductPage — ดึงข้อมูลสินค้า
      ├── <ProductInfo />       Server Component  → JS ไป client: 0
      ├── <ProductImages />     Server Component  → JS ไป client: 0
      └── <AddToCartButton />   Client Component  → JS ไป client: เฉพาะปุ่มนี้
```

> **ให้มองภาพนี้ว่า** "หน้านี้เป็น server เกือบทั้งหน้า มีแค่ปุ่มเดียวที่ยอมส่ง JS ไป browser — bundle จึงเล็กมาก แต่ยังกดได้"

**สิ่งที่อธิบายในสัมภาษณ์ได้:** SEO ได้เพราะเนื้อหาอยู่ใน HTML, เร็วเพราะ static + cache, ข้อมูลไม่เก่าเพราะ revalidate, bundle เล็กเพราะ Server Component

### Scenario 2 — Dashboard หลัง login

```
[MIDDLEWARE]  ไม่มี session cookie → redirect /login
      ↓
[LAYOUT] (Server)  Sidebar — ไม่ re-render ตอนเปลี่ยนเมนู
      ↓
[PAGE] (Server)    query DB ด้วย user id จาก session → dynamic rendering
      ↓
[<Chart />] (Client)  ต้อง interact ได้ จึงต้องเป็น client
```

> **ให้มองภาพนี้ว่า** "หน้าหลัง login คือหน้าที่ยอมแลกความเร็วของ static กับความถูกต้องของข้อมูลเฉพาะคน"

**จุดที่ต้องระวังและต้องพูดให้ได้:** ข้อมูลเฉพาะ user **ห้ามเข้า Full Route Cache** ต้องบังคับให้หน้าเป็น dynamic และ **ต้องตรวจสิทธิ์ที่ชั้น query ด้วย** ไม่ใช่พึ่ง middleware อย่างเดียว

### Scenario 3 — Blog ของบริษัท

```
บทความไม่ค่อยเปลี่ยน        → SSG (generateStaticParams ล่วงหน้า)
แก้บทความแล้วอยากเห็นทันที   → on-demand revalidation จาก CMS webhook
หน้า /blog listing          → ISR
ปุ่ม share / comment        → Client Component
```

**Trade-off ที่ต้องบอก:** SSG เร็วและถูกที่สุด แต่ถ้าบทความมีหลักแสนหน้า build จะนานมาก — จึงต้องผสมกับ ISR แบบ "สร้างตอนมีคนเข้าครั้งแรก" แทนที่จะ build ล่วงหน้าทั้งหมด

### Scenario 4 — เว็บที่เรียก third-party API ที่มี secret key

**ผิด:**

```
Client Component → fetch("https://api.xxx.com", { key: NEXT_PUBLIC_API_KEY })
→ key อยู่ใน bundle → ใครก็ขโมยไปใช้ได้ → บิลมาเป็นแสน
```

**ถูก:**

```
[CLIENT]  fetch("/api/proxy")
      ↓
[ROUTE HANDLER on server]  อ่าน API_KEY (server-only env)
      ↓
[THIRD-PARTY API]
      ↓
ส่งเฉพาะข้อมูลที่จำเป็นกลับไป client
```

> **ให้มองภาพนี้ว่า** "เวลามีของลับ ให้ browser คุยกับเซิร์ฟเวอร์ของเราเท่านั้น แล้วให้เซิร์ฟเวอร์เราเป็นคนไปคุยกับข้างนอกแทน"

---

## 7. Compare — ตารางเทียบสิ่งที่มักสับสน

### 7.1 React vs Next.js

| ประเด็น | React | Next.js |
|---|---|---|
| ประเภท | Library | Framework |
| Routing | ไม่มี (ลง react-router เอง) | มีในตัว (file-based) |
| โค้ดรันที่ไหน | browser เท่านั้น | server + browser |
| SEO | ยาก ต้องทำเพิ่ม | ทำมาให้ |
| Backend endpoint | ไม่มี | Route Handler |
| Image optimize | ไม่มี | `next/image` |
| อิสระในการเลือกเครื่องมือ | สูงมาก | ถูกกำหนดโครงมากกว่า |
| เหมาะกับ | widget, ฝังในเว็บเดิม, app ที่อยู่หลัง login ล้วน | เว็บ production ที่ต้อง SEO / performance / ทีมใหญ่ |

### 7.2 Framework vs Library

| | Library | Framework |
|---|---|---|
| ใครเรียกใคร | **เราเรียกมัน** | **มันเรียกเรา** (Inversion of Control) |
| อิสระ | สูง | ต่ำกว่า แต่มีมาตรฐาน |
| ตัวอย่าง | React, lodash, axios | Next.js, Spring Boot, Django |
| ข้อดี | ยืดหยุ่น เลือกเองได้หมด | เริ่มเร็ว ทีมเข้าใจตรงกัน |
| ข้อเสีย | ต้องตัดสินใจเองเยอะ ทีมใหญ่จะเขียนไม่เหมือนกัน | ออกนอกกรอบยาก ต้องเรียน convention |

### 7.3 CSR vs SSR vs SSG vs ISR

| | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| HTML สร้างตอน | browser โหลดเสร็จ | ทุก request | build time | build + สร้างใหม่ตามรอบ |
| เห็นเนื้อหาเร็ว | ช้าสุด | เร็ว | เร็วสุด | เร็วสุด |
| SEO | แย่ | ดี | ดีที่สุด | ดีที่สุด |
| ความสดของข้อมูล | สดเสมอ | สด | เก่าตั้งแต่ build | เก่าได้ไม่เกิน N วินาที |
| ภาระ server | ต่ำ | **สูง** | ต่ำมาก | ต่ำ |
| เหมาะกับ | dashboard หลัง login | หน้าที่ข้อมูลต่างกันทุกคน | landing, docs, blog | สินค้า, ข่าว, รายการที่เปลี่ยนบ้าง |
| Trade-off | เร็วเฉพาะหลังโหลด JS | เปลืองที่สุด scale ยากสุด | ข้อมูลเก่า, build นาน | ยอมรับข้อมูลเก่าได้ระดับหนึ่ง |

### 7.4 Server Component vs Client Component

| | Server Component | Client Component |
|---|---|---|
| ประกาศอย่างไร | default ใน App Router | ใส่ `"use client"` บนสุดของไฟล์ |
| รันที่ไหน | server เท่านั้น | **server หนึ่งรอบ (pre-render) + client** |
| useState / useEffect | ❌ | ✅ |
| onClick / event handler | ❌ | ✅ |
| `window` / `localStorage` | ❌ | ✅ (แต่ต้องอยู่ใน useEffect) |
| `async/await` ในตัว component | ✅ | จำกัด |
| query DB / อ่าน secret | ✅ | ❌ (และห้ามทำ) |
| JS ส่งไป client | **0** | ตามขนาดโค้ด + library ที่ import |
| ใช้เมื่อไร | แสดงข้อมูล, layout, ดึงข้อมูล | ปุ่ม, form, modal, animation, chart |

### 7.5 App Router vs Pages Router

| | Pages Router (`pages/`) | App Router (`app/`) |
|---|---|---|
| Component default | Client | **Server** |
| Data fetching | `getServerSideProps` / `getStaticProps` (นอก component) | `async` ในตัว component |
| Layout | ทำเองด้วย `_app` | `layout.tsx` ซ้อนชั้นได้ |
| Loading UI | ทำเอง | `loading.tsx` |
| Streaming | ไม่มี | มี |
| ความคุ้นเคยของทีม | สูง (ของเดิม) | ต้องเรียน mental model ใหม่ |

### 7.6 Middleware vs Route Handler vs Server Action

| | Middleware | Route Handler | Server Action |
|---|---|---|---|
| รันเมื่อไร | ก่อนถึง route | เมื่อมีคนยิง URL นั้น | เมื่อ client เรียกฟังก์ชัน |
| ใช้ทำ | redirect / rewrite / header | REST endpoint | mutation จาก form / ปุ่ม |
| เหมาะกับ | auth gate, locale, A/B | webhook, mobile API, proxy | สร้าง/แก้/ลบข้อมูลในเว็บตัวเอง |
| ข้อจำกัด | runtime จำกัด ห้ามงานหนัก | ต้องเขียน fetch ฝั่ง client เอง | ต้องตรวจ auth เองเสมอ |

### 7.7 Hydration vs Rendering vs Pre-rendering

| คำ | หมายถึง |
|---|---|
| Rendering | การแปลง component → UI (เกิดได้ทั้ง server และ client) |
| Pre-rendering | การ render ล่วงหน้าที่ server เพื่อให้ได้ HTML (ครอบทั้ง SSG และ SSR) |
| Hydration | การเอา JS ไปผูก event เข้ากับ HTML ที่ pre-render มาแล้ว |

---

## 8. Common Mistakes — สิ่งที่ Junior มักเข้าใจผิด

| # | เข้าใจผิดว่า | ความจริง |
|---|---|---|
| 1 | Server Component = SSR | คนละแกน — SSR = "เมื่อไร", Server Component = "ที่ไหน + ส่ง JS เท่าไร" |
| 2 | `"use client"` = รันแค่ที่ client | แปลว่า "ส่งโค้ดไป client ด้วย" — ตอน SSR ยังถูกรันบน server หนึ่งรอบ |
| 3 | ใส่ `"use client"` ที่ root layout ก็ได้ ง่ายดี | = ทั้งเว็บกลายเป็น client, bundle บวม, เสียประโยชน์ App Router ทั้งหมด |
| 4 | Next.js = SSR เสมอ | Next.js เลือกได้หลายแบบ และหลายหน้ากลายเป็น static โดยที่คุณไม่ได้สั่ง |
| 5 | `NEXT_PUBLIC_` เป็นแค่ prefix เฉย ๆ | = ประกาศให้โลกรู้ ฝังใน bundle ถาวร |
| 6 | Middleware ป้องกันหน้าได้แล้ว ปลอดภัย | Middleware กันการ "เข้าหน้า" ไม่ได้กันการ "เข้าถึงข้อมูล" — ต้องตรวจซ้ำที่ชั้น data |
| 7 | ข้อมูลไม่อัปเดต = bug ของ Next.js | มักเป็น cache ชั้นใดชั้นหนึ่ง ต้องไล่ทีละชั้น |
| 8 | Hydration Error เป็นแค่ warning ข้ามได้ | แปลว่า server กับ client เห็นโลกไม่ตรงกัน — เปลือง performance และมักตามด้วย bug จริง |
| 9 | ใช้ `<img>` ธรรมดาก็เหมือนกัน | เสีย auto-resize, format, lazy load และเสี่ยง layout shift |
| 10 | fetch ทุกอย่างใน `useEffect` เหมือน React เดิม | ข้อมูลที่ต้องการตอน render แรก ควร fetch ที่ server |
| 11 | ส่ง props อะไรก็ได้จาก Server → Client Component | props ถูก serialize ไป client = **ห้ามส่งของลับ** และส่งฟังก์ชัน/คลาสไม่ได้ |
| 12 | Server Action ปลอดภัยเพราะเรียกจากปุ่มเราเอง | มันคือ endpoint สาธารณะ ใครก็ยิงได้ |
| 13 | `layout.tsx` = แค่ที่วาง Navbar | มันคือหน่วยที่ **ไม่ re-render** ตอน navigate — เป็นเรื่อง performance ด้วย |
| 14 | `revalidate` แล้ว user เห็นข้อมูลใหม่ทันที | มักหมายถึง "คนถัดไปที่เข้ามาจะได้ของใหม่" |
| 15 | ต้องมี Route Handler ถึงจะดึงข้อมูลได้ | Server Component ดึง DB ตรง ๆ ได้ ไม่ต้องอ้อม HTTP |
| 16 | Client Component ต้องอยู่ใต้ Client Component เท่านั้น | Server Component ส่งเป็น `children` เข้าไปใน Client Component ได้ — เทคนิคสำคัญที่ลด bundle |

---

## 9. Debugging — พังแล้วไล่ดูอะไรตามลำดับ

### 9.1 อาการ: Hydration Error

```
ขั้นที่ 1  อ่าน error ว่ามันบอก element ไหน / text ไหนไม่ตรง
      ↓
ขั้นที่ 2  ถาม: "ค่านี้ server กับ client ได้ค่าเดียวกันไหม?"
      ↓
ขั้นที่ 3  ไล่ผู้ต้องสงสัยมาตรฐาน:
           • new Date() / Date.now()          → คนละเวลา / คนละ timezone
           • Math.random() / uuid()            → ได้คนละค่าแน่นอน
           • localStorage / window / navigator → server ไม่มี
           • typeof window !== "undefined"     → ทำให้ render รอบแรกไม่ตรงกัน
           • HTML ผิดโครงสร้าง เช่น <div> ใน <p> → browser แก้ DOM ให้เอง
           • browser extension ที่แทรก DOM
      ↓
ขั้นที่ 4  วิธีแก้ที่ถูกต้อง:
           • ค่าที่เป็นของ client เท่านั้น → ย้ายไป useEffect (render หลัง mount)
           • ค่าเวลา → ส่ง timestamp ดิบจาก server แล้ว format ที่ client
           • จำเป็นจริง ๆ → suppressHydrationWarning เฉพาะจุดเล็ก ๆ เท่านั้น
```

> **ให้มองภาพนี้ว่า** "Hydration Error เกือบทั้งหมดมาจากค่าที่ 'ไม่แน่นอน' หรือ 'มีเฉพาะที่ browser' ถูกใช้ตอน render รอบแรก"

### 9.2 อาการ: ข้อมูลไม่อัปเดตทั้งที่แก้ใน DB แล้ว

```
1. hard refresh + ปิด browser cache      → ยังเก่า?
2. เช็ค Router Cache ที่ client           → ลอง router.refresh() หรือเปิด tab ใหม่
3. เช็ค Full Route Cache                 → หน้านี้ถูก build เป็น static หรือเปล่า
4. เช็ค Data Cache ของ fetch นั้น         → ตั้ง revalidate / no-store ไว้อย่างไร
5. เช็ค CDN ข้างหน้า                      → CDN cache HTML ไว้หรือเปล่า
6. ยิง API ตรง ๆ ด้วย curl                → ถ้า API ยังส่งของเก่า = ปัญหาอยู่ที่ backend ไม่ใช่ Next
```

### 9.3 อาการ: `window is not defined` / `localStorage is not defined`

```
สาเหตุ: โค้ดที่ใช้ browser API ถูกรันบน server
      ↓
เช็ค 1: ไฟล์นี้มี "use client" ไหม
      ↓
เช็ค 2: ถึงมี "use client" แล้ว โค้ดนั้นอยู่นอก useEffect หรือเปล่า
        (Client Component ยังถูก pre-render บน server รอบแรก!)
      ↓
แก้: ย้ายโค้ดที่แตะ browser API เข้าไปใน useEffect
     หรือ dynamic import แบบปิด SSR สำหรับ component ที่พึ่ง browser ล้วน ๆ
```

### 9.4 อาการ: Bundle ใหญ่ / หน้าโหลดช้า

```
1. ดู build output ว่าแต่ละ route ขนาดเท่าไร และเป็น static หรือ dynamic
2. หา "use client" ที่อยู่สูงเกินไปใน tree → ดันลงไปให้ลึกที่สุด
3. ดู library หนัก ๆ ที่ถูก import เข้า Client Component → ย้ายไป server ถ้าทำได้
4. รูป → ใช้ next/image หรือยัง
5. component หนักที่ไม่ได้ใช้ทันที → dynamic import
6. วัดจริงด้วย Lighthouse / DevTools Network — อย่าเดา
```

### 9.5 อาการ: หน้าที่ควรเป็น static กลับกลายเป็น dynamic

```
เช็คว่าในหน้านั้นมีการใช้สิ่งเหล่านี้หรือไม่:
  • cookies() / headers()
  • searchParams
  • fetch ที่สั่งไม่ให้ cache
  • ประกาศ dynamic = "force-dynamic"
→ ของพวกนี้ "บังคับ" ให้หน้าเป็น dynamic เพราะผลลัพธ์ต่างกันทุก request
```

### 9.6 อาการ: TTFB สูงบนหน้า SSR

```
1. วัดก่อนว่าช้าที่ไหน — network? server render? data?
2. ดู data fetching → เป็น waterfall หรือเปล่า
3. ดู query DB → มี N+1 ไหม / มี index ไหม
4. ดู external API → เรา block รอมันอยู่หรือเปล่า
5. พิจารณา Streaming + Suspense → ส่งส่วนที่พร้อมออกไปก่อน
6. พิจารณาเปลี่ยนเป็น ISR ถ้าข้อมูลเก่าได้บ้าง
```

### 9.7 Checklist ก่อนขึ้น production

```
□ ไม่มี secret ใดอยู่ใน NEXT_PUBLIC_
□ Server Action ทุกตัวตรวจ auth + validate input
□ สิทธิ์การเข้าถึงข้อมูลถูกตรวจที่ชั้น data ไม่ใช่แค่ middleware
□ หน้าที่มีข้อมูลเฉพาะ user ไม่ถูก cache ข้ามคน
□ metadata / og image ครบในหน้าสำคัญ
□ error.tsx และ not-found.tsx มีครบ
□ ตรวจ build output ว่าหน้าไหน static หน้าไหน dynamic ตรงกับที่ตั้งใจ
```

---

## 10. Interview Questions

### 🟢 Junior

1. Next.js ต่างจาก React อย่างไร
2. Framework กับ Library ต่างกันอย่างไร ยกตัวอย่าง
3. App Router กำหนด URL จากอะไร
4. Dynamic Route คืออะไร ใช้ตอนไหน
5. `layout.tsx` กับ `page.tsx` ต่างกันอย่างไร
6. CSR / SSR / SSG ต่างกันอย่างไร
7. Hydration คืออะไร
8. ทำไมต้องใช้ `next/image` แทน `<img>`
9. `NEXT_PUBLIC_` คืออะไร
10. Route Handler คืออะไร ใช้ทำอะไร
11. `loading.tsx` กับ `error.tsx` มีไว้ทำไม

### 🟡 Mid

1. **Server Component กับ SSR ต่างกันอย่างไร** (ข้อนี้ถามบ่อยที่สุด)
2. `"use client"` ทำอะไรกันแน่ และควรวางตรงไหนของ tree
3. Client Component ถูกรันบน server ด้วยหรือไม่ เพราะอะไร
4. ISR ทำงานอย่างไร ต่างจาก SSG อย่างไร
5. Next.js มี cache กี่ชั้น แต่ละชั้นล้างอย่างไร
6. Time-based กับ on-demand revalidation ต่างกันอย่างไร เลือกอย่างไร
7. Middleware เหมาะกับงานแบบไหน และ **ไม่** เหมาะกับงานแบบไหน
8. Hydration Error เกิดจากอะไรได้บ้าง เจอแล้วไล่ยังไง
9. จะเลือก rendering strategy ให้แต่ละหน้าอย่างไร ยกตัวอย่างเว็บจริง
10. Server Action ต่างจาก Route Handler อย่างไร เลือกใช้ตัวไหนเมื่อไร
11. ข้อมูลอะไรที่ **ห้าม** ส่งเป็น props จาก Server Component ไป Client Component
12. Nested Layout ช่วยเรื่อง performance อย่างไร

### 🔴 Senior

1. อธิบายว่า RSC Payload คืออะไร ทำไมมันไม่ใช่ HTML และไม่ใช่ JS bundle
2. ถ้าหน้าหนึ่งเป็น SSG แต่ component ข้างในเป็น Server Component ทั้งหมด — SSR เกิดขึ้นตรงไหน
3. ทำไม Server Component ลด bundle size ได้จริง ในขณะที่ SSR ไม่ลด
4. Streaming + Suspense ช่วยอะไร และแลกอะไรไป
5. ออกแบบ caching strategy ให้เว็บ e-commerce ที่มีสินค้า 500,000 รายการ ราคาเปลี่ยนทุก 5 นาที
6. ทีมเผลอ commit payment secret key ลงใน `NEXT_PUBLIC_` แล้วขึ้น production — จัดการอย่างไร ทั้งเชิงเทคนิคและเชิงกระบวนการ
7. จะป้องกัน Server Action ไม่ให้ถูก abuse อย่างไร
8. เว็บที่ TTFB สูงมากบนหน้า SSR — ไล่หาสาเหตุอย่างไร
9. เมื่อไรที่ **ไม่ควร** ใช้ Next.js
10. ถ้าต้อง migrate จาก Pages Router ไป App Router ในระบบใหญ่ จะวางแผนอย่างไร
11. เทคนิค "ส่ง Server Component เป็น children ให้ Client Component" แก้ปัญหาอะไร

---

## 11. Answer Like a Developer

### โครงมาตรฐานในการตอบ

```
1. นิยามสั้น 1 ประโยค (ภาษาคน)
2. บอกว่ามีไว้แก้ปัญหาอะไร
3. อธิบาย flow คร่าว ๆ
4. ยกตัวอย่างจากงานจริง
5. บอก trade-off
6. ปิดด้วยว่า "ถ้ามีปัญหา ผมจะไล่ดูจาก..."
```

### ตัวอย่าง — "Server Component กับ SSR ต่างกันอย่างไร"

**โครงคำตอบ (ไม่ใช่บทท่อง — ปรับคำได้):**

1. *แยกแกนให้ชัดก่อน:* "สองอันนี้ตอบคนละคำถามครับ SSR ตอบว่า HTML ถูกสร้าง **เมื่อไร** ส่วน Server Component ตอบว่าโค้ดรัน **ที่ไหน** และส่ง JS ไป client แค่ไหน"
2. *ยกหลักฐานว่าเป็นคนละเรื่อง:* "Pages Router ทำ SSR ได้ตั้งนานโดยไม่มี Server Component เลย และในทางกลับกัน หน้า static ที่เป็น SSG ก็มี Server Component ได้โดยไม่มี SSR เกิดขึ้นเลย"
3. *ชี้ผลลัพธ์ที่ต่างกันจริง:* "ผลที่ต่างชัดที่สุดคือ bundle size — SSR ไม่ลด JS ที่ส่งไป client เพราะยังต้อง hydrate ทั้งหน้า แต่ Server Component ลดจริงเพราะโค้ดมันไม่ถูกส่งไปเลย รวมถึง library ที่มัน import ด้วย"
4. *ดักจุดที่คนพลาด:* "และ `use client` ไม่ได้แปลว่ารันเฉพาะที่ client นะครับ มันแปลว่าส่งโค้ดไปด้วย ตอน SSR มันยังถูกรันบน server หนึ่งรอบอยู่ — นี่คือเหตุผลที่เขียน `window` ตรง ๆ ใน Client Component แล้วยังพัง"
5. *ปิดด้วยการใช้งานจริง:* "เวลาออกแบบหน้า ผมจะเลือกสองแกนแยกกัน — เลือก rendering strategy ตามความสดของข้อมูล และเลือก server/client component ตาม interactivity"

### ตัวอย่าง — "ทำไมไม่ควรใส่ secret ใน NEXT_PUBLIC_"

1. "เพราะ `NEXT_PUBLIC_` ถูก **ฝังลงใน JS bundle ตอน build** ใครเปิด DevTools ก็อ่านได้"
2. "มันไม่ใช่แค่ 'ไม่ดี' แต่เป็น **ย้อนกลับไม่ได้** — ค่านั้นอาจถูก cache ไว้ที่ CDN หรือในเครื่องผู้ใช้แล้ว"
3. "ถ้าเกิดขึ้นจริง ขั้นแรกคือ **rotate secret ทันที** ไม่ใช่แค่ลบตัวแปรแล้ว deploy ใหม่"
4. "วิธีที่ถูกคือเก็บเป็น env ปกติ แล้วให้ Route Handler หรือ Server Action ทำหน้าที่ proxy เรียก third-party แทน client"
5. "และป้องกันเชิงกระบวนการด้วย secret scanner ใน CI กับ code review checklist"

### ประโยคที่ควรใช้ให้ติดปาก

| สถานการณ์ | ประโยค |
|---|---|
| ถูกถามว่าอันไหนดีกว่า | "ขึ้นกับว่าข้อมูลต้องสดแค่ไหน และหน้านั้นต้อง SEO ไหมครับ" |
| ไม่แน่ใจค่า default | "ผมไม่พึ่ง default ครับ ผมจะระบุ caching option ให้ชัดและตรวจจาก build output" |
| ถูกถามเรื่อง performance | "ผมจะวัดก่อนครับ ดู build output กับ Lighthouse แล้วค่อยแก้จุดที่ใหญ่ที่สุด" |
| ถูกถามเรื่อง security | "ผมจะไม่เชื่อ client เลยครับ ตรวจสิทธิ์ที่ชั้นข้อมูลเสมอ" |
| ถูกถามเรื่องที่ไม่รู้ | "ส่วนนั้นผมยังไม่เคยทำ production ครับ แต่หลักการที่ผมเข้าใจคือ..." |

### สิ่งที่ห้ามพูด

| ❌ อย่าพูด | ✅ พูดแทนว่า |
|---|---|
| "Next.js เร็วกว่า React" | "Next.js render ฝั่ง server ได้ จึงเห็นเนื้อหาเร็วกว่าและ SEO ดีกว่าในเคสที่..." |
| "Server Component คือ SSR" | "คนละแกนครับ อันหนึ่งเรื่องเวลา อีกอันเรื่องสถานที่" |
| "ใส่ use client หมดเลยก็ได้" | "ผมจะดัน use client ลงไปให้ลึกที่สุดเท่าที่ทำได้ เพื่อให้ bundle เล็ก" |
| "ผมใช้ SSR ทุกหน้า" | "ผมเลือกต่อหน้า — หน้า static ใช้ SSG หน้าที่ข้อมูลเฉพาะคนใช้ dynamic" |
| "Middleware กันหมดแล้ว" | "Middleware เป็นด่านแรก แต่ผมตรวจสิทธิ์ซ้ำที่ชั้นข้อมูลด้วยเสมอ" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้อง:

- **Next.js = React + routing + rendering strategy + data fetching + caching + backend endpoint**
- **Framework เรียกเรา / Library เราเรียกมัน**
- **App Router: โฟลเดอร์ = URL, ทุกอย่างเป็น Server Component by default**
- **Layout ไม่ re-render ตอนเปลี่ยน page ภายในกรอบเดียวกัน**
- **2 แกนที่ต้องแยกให้ขาด**
  - แกนเวลา = SSG → ISR → SSR → CSR (HTML เกิดเมื่อไร)
  - แกนสถานที่ = Server Component vs Client Component (โค้ดรันที่ไหน + ส่ง JS เท่าไร)
- **Server Component ≠ SSR** — SSG ก็มี Server Component ได้ / Pages Router มี SSR ได้โดยไม่มี Server Component
- **`"use client"` = "ส่งโค้ดไป client ด้วย" ไม่ใช่ "รันแค่ที่ client"**
- **Hydration = เสียบปลั๊กให้ HTML — Hydration Error = server กับ client วาดไม่ตรงกัน**
- **Cache 4 ชั้น: Request Memo → Data Cache → Full Route Cache → Router Cache**
- **Revalidation 2 แบบ: ตามเวลา / ตามเหตุการณ์ — และมักมีผลกับ "คนถัดไป"**
- **Middleware = รปภ. หน้าตึก ไม่ใช่ที่ทำ business logic และไม่ใช่ด่านสุดท้ายของ security**
- **`NEXT_PUBLIC_` = สาธารณะ 100% หลุดแล้วย้อนไม่ได้ ต้อง rotate**
- **Server Action = endpoint สาธารณะ ต้องตรวจ auth เองเสมอ**
- **ข้อมูลที่ต้องการตอน render แรก → fetch ที่ server ไม่ใช่ใน useEffect**

---

## 13. Memory Card

```
🧠 จำ 5 อย่างนี้พอ

1. Next.js = React + โครงทั้งโรงงาน (routing / rendering / data / cache / endpoint)
2. สองแกนไม่ใช่แกนเดียว:
   เวลา = SSG/ISR/SSR/CSR   |   สถานที่ = Server/Client Component
3. Server Component ≠ SSR
   SSR = HTML สร้างเมื่อไร   |   Server Component = โค้ดรันที่ไหน + JS ไป client เท่าไร
4. "use client" = "ส่งโค้ดไป client ด้วย" (ยังรันบน server หนึ่งรอบ)
5. NEXT_PUBLIC_ = ป้ายหน้าร้าน — secret ห้ามขึ้นป้าย หลุดแล้วต้อง rotate
```

```
Keyword:
Framework        → มันเรียกเรา
Library          → เราเรียกมัน
App Router       → โฟลเดอร์ = URL, server-first
Nested Route     → โฟลเดอร์ซ้อนโฟลเดอร์
Dynamic Route    → [id] ช่องว่างใน URL
Layout           → กรอบที่ไม่ re-render
Server Component → โค้ดที่ browser ไม่เคยเห็น
Client Component → โค้ดที่ต้องยกไปวางบนโต๊ะ browser
CSR              → browser วาดเอง
SSR              → วาดใหม่ทุก request
SSG              → วาดไว้ตอน build
ISR              → SSG ที่มีวันหมดอายุ
Hydration        → เสียบปลั๊กให้ HTML
Hydration Error  → server วาด ≠ client วาด
Data Cache       → จำผล fetch ข้าม request
Full Route Cache → จำทั้งหน้า
Router Cache     → client จำ RSC Payload ไว้
Revalidation     → ล้างของเก่า (เวลา / เหตุการณ์)
Middleware       → รปภ. หน้าตึก
Route Handler    → API endpoint ในบ้านเดียวกัน
Server Action    → ปุ่ม client เรียกฟังก์ชัน server
Metadata         → ป้ายบอกตัวตนของหน้า
next/image       → ช่างตัดรูปอัตโนมัติ
NEXT_PUBLIC_     → ป้ายหน้าร้าน (สาธารณะ)
RSC Payload      → พิมพ์เขียวของ UI ไม่ใช่ JS
Streaming        → ทยอยเสิร์ฟ ไม่รอครบทั้งหน้า
```

```
🧠 ภาพสุดท้ายที่ต้องวาดได้ในหัว

Request → Middleware → Next Server → Server Component → Data
                                            ↓
                                          HTML
                                            ↓
                                        Browser
                                            ↓
                                        Hydration
                                            ↓
                                       Interactive
```

> **ให้มองภาพนี้ว่า** "ผู้ใช้ได้เห็นหน้าเว็บก่อน แล้วค่อยได้กดหน้าเว็บ — และงานของเราคือทำให้ช่องว่างระหว่างสองจังหวะนั้นสั้นที่สุด"

---

[← สารบัญ](./00-README-TOC.md)
