# PART 27 — MASTER COMPARISON TABLE

> ตำแหน่งในภาพใหญ่: Review Layer — รวมทุก "A vs B" ที่กระจายอยู่ทั้งเล่ม ตั้งแต่ Frontend → Backend → Database → Infrastructure → Workflow มาไว้ในที่เดียว ใช้ทบทวนก่อนเข้าห้องสัมภาษณ์

---

## 1. Big Picture

คำถามสัมภาษณ์ที่เจอบ่อยที่สุดในโลกคือคำถามรูปแบบ **"A ต่างจาก B อย่างไร"**

- "React กับ Next.js ต่างกันยังไง"
- "Session กับ JWT เลือกอะไร"
- "Docker กับ Kubernetes ต่างกันยังไง"
- "Merge กับ Rebase ใช้ตอนไหน"

ทำไมคนสัมภาษณ์ชอบถามแบบนี้? เพราะคำถามเปรียบเทียบ **แยกคนท่องออกจากคนเข้าใจได้เร็วที่สุด**

- คนท่องจะตอบ definition ของ A แล้วตาม definition ของ B — แต่ไม่ได้บอกว่า **ต่างกันที่มิติไหน**
- คนเข้าใจจะบอกว่า "ทั้งสองแก้ปัญหาอะไร" ก่อน แล้วค่อยบอกว่า "ต่างกันที่มิติ X, Y, Z" และจบด้วย "ผมเลือกตัวไหนเมื่อไร"

PART นี้รวม **25 คู่** ที่ถูกถามบ่อยที่สุด ทุกคู่มี 3 ส่วน:

1. **ตารางเทียบมิติที่ต่าง** — ไม่ใช่ลิสต์ข้อดีข้อเสีย แต่เป็นมิติเดียวกันเทียบกันแถวต่อแถว
2. **จำสั้น ๆ:** — ประโยคเดียวที่พูดออกมาได้ทันที
3. **เลือกตัวไหนเมื่อ:** — เงื่อนไขในการเลือก เพราะไม่มีตัวไหน "ดีกว่า" แบบไม่มี context

ถ้าอยากเข้าใจลึกของแต่ละคู่ ให้กลับไปอ่าน PART ต้นทาง (ระบุไว้ในหัวข้อ 7 ของแต่ละคู่)

---

## 2. Keywords

| Keyword | จำสั้นๆ | ความหมาย |
|---|---|---|
| Dimension (มิติ) | แกนที่ใช้เทียบ | ด้านที่ใช้เปรียบเทียบ เช่น "ทำงานที่ไหน", "เก็บ state ที่ไหน", "scale ยังไง" ต้องเทียบมิติเดียวกันเสมอ |
| Category Error | เทียบของคนละประเภท | เช่น เทียบ Node.js (runtime) กับ Java (ภาษา) ตรง ๆ โดยไม่บอกว่าเป็นคนละชั้น |
| Layer (ชั้น) | อยู่ชั้นไหนของ stack | บอกว่าของสองอย่างอยู่ชั้นเดียวกันหรือคนละชั้น เช่น React (UI library) อยู่ใต้ Next.js (framework) |
| Trade-off | ได้อย่างเสียอย่าง | ทุกตัวเลือกมีราคา ต้องบอกทั้งสิ่งที่ได้และสิ่งที่เสีย |
| Context | เงื่อนไขของงาน | ขนาดทีม, จำนวน user, deadline, ความรู้ของทีม, ข้อกำหนด SEO/security ฯลฯ ที่ทำให้คำตอบเปลี่ยน |
| Complementary | ใช้คู่กันได้ | บางคู่ไม่ใช่คู่แข่ง แต่ทำงานร่วมกัน เช่น Docker + Kubernetes, Node.js + Express |
| Alternative | ทางเลือกแทนกัน | คู่ที่ปกติเลือกอย่างใดอย่างหนึ่งในงานเดียวกัน เช่น Session vs JWT |
| Spectrum | สเปกตรัม | คู่ที่ไม่ใช่ขาวดำ มีตรงกลางได้ เช่น Monolith → Modular Monolith → Microservices |

---

## 3. Mental Model

ก่อนเทียบอะไร ให้ถามตัวเอง 3 คำถามตามลำดับ

```
[คำถาม A vs B]
      ↓
1. อยู่ชั้นเดียวกันไหม? (Layer)
      ↓
   ├── คนละชั้น → อธิบายว่า "ตัวหนึ่งอยู่บนอีกตัว / ใช้ร่วมกันได้"
   └── ชั้นเดียวกัน → ไปข้อ 2
      ↓
2. แก้ปัญหาเดียวกันไหม? (Problem)
      ↓
   ├── คนละปัญหา → อธิบายว่าแต่ละตัวแก้อะไร
   └── ปัญหาเดียวกัน → ไปข้อ 3
      ↓
3. ต่างกันที่มิติไหน และมิติไหนสำคัญกับ context นี้? (Trade-off)
```

ให้มองภาพนี้ว่า ก่อนเทียบสองอย่าง ต้องเช็คก่อนว่ามันเป็น "คู่แข่ง" หรือ "เพื่อนร่วมทีม" — ครึ่งหนึ่งของคู่ใน PART นี้จริง ๆ แล้วเป็นเพื่อนร่วมทีม

แบ่ง 25 คู่ตามประเภทความสัมพันธ์:

| ประเภท | ความหมาย | คู่ในหมวดนี้ |
|---|---|---|
| ต่างชั้น (Layer) | ตัวหนึ่งสร้างอยู่บนอีกตัว | React vs Next.js, Node.js vs Express, Docker vs Kubernetes, Docker Image vs Container |
| ต่างเป้าหมาย (Target) | หลักการคล้าย แต่ output คนละที่ | React vs React Native |
| ต่างแนวคิด (Concept) | ตอบคำถามคนละข้อ | Authentication vs Authorization, 401 vs 403, State vs Props |
| ทางเลือกแทนกัน (Alternative) | เลือกอย่างใดอย่างหนึ่งในงานเดียวกัน | Session vs JWT, SQL vs NoSQL, PUT vs PATCH, Polling vs WebSocket, Merge vs Rebase, Cookie vs LocalStorage, useMemo vs useCallback |
| ต่าง ecosystem | ภาษา/แพลตฟอร์มคนละตระกูล | Node.js vs Java, Express vs Spring Boot, Java vs JavaScript, Java vs Python |
| สเปกตรัม (Spectrum) | มีตรงกลาง เลือกผสมได้ | CSR/SSR/SSG/ISR, Monolith vs Microservices, Vertical vs Horizontal, Unit/Integration/E2E, VM vs Container, Server vs Client Component |

---

## 4. ภาพจำ

```
🧠 ภาพจำ:
การเปรียบเทียบ = การเลือกยานพาหนะ
ถามว่า "รถยนต์กับมอเตอร์ไซค์ อะไรดีกว่า" → ตอบไม่ได้
ถามว่า "ไปส่งของ 5 ชิ้นในซอยแคบ ตอนรถติด" → มอเตอร์ไซค์
ถามว่า "พาครอบครัว 5 คนไปต่างจังหวัด" → รถยนต์

คำถาม A vs B
      ↓
เพิ่ม Context
      ↓
คำตอบที่ชัดเจน
```

ให้มองภาพนี้ว่า คำถามเปรียบเทียบที่ไม่มี context ไม่มีคำตอบที่ถูก หน้าที่ของคุณคือเติม context ให้คำถามก่อนตอบ

```
🧠 ภาพจำคู่ต่างชั้น = บ้าน
React     = อิฐ (สร้าง UI ได้ แต่ต้องออกแบบบ้านเอง)
Next.js   = บ้านสำเร็จรูปที่ใช้อิฐ React (มีห้อง ท่อ ไฟ มาให้)
ถามว่า "อิฐกับบ้านต่างกันยังไง" → บ้านใช้อิฐ ไม่ใช่คู่แข่งกัน
```

ให้มองภาพนี้ว่า ถ้าสองสิ่งอยู่คนละชั้น คำตอบที่ถูกคือการอธิบายว่ามันซ้อนกันอย่างไร ไม่ใช่การเลือกข้าง

---

## 5. How It Works

### วิธีตอบคำถามเปรียบเทียบใน 60 วินาที

```
[1. Common Ground]  ทั้งสองอย่างเกี่ยวกับเรื่องอะไร (1 ประโยค)
        ↓
[2. Core Difference] ต่างกันที่แก่นอะไร (1 ประโยค = "จำสั้น ๆ")
        ↓
[3. Dimensions]     ยก 2–3 มิติจากตาราง
        ↓
[4. When to Use]    เลือกตัวไหนเมื่อ... (context)
        ↓
[5. Experience]     เคยใช้ตอนไหน (ถ้ามี)
```

ให้มองภาพนี้ว่า คำตอบเปรียบเทียบที่ดีเริ่มจาก "สิ่งที่เหมือน" ก่อน เพื่อให้คนฟังเห็นว่าคุณรู้ว่ามันอยู่ในเรื่องเดียวกัน แล้วค่อยแยกความต่าง และจบที่การเลือก

### แผนที่ของ 25 คู่ บน stack

```
[USER / Browser]
   ├── Cookie vs LocalStorage
   ├── Polling vs WebSocket
   ↓
[FRONTEND]
   ├── React vs Next.js / React vs React Native
   ├── CSR vs SSR vs SSG vs ISR / Server vs Client Component
   ├── State vs Props / useMemo vs useCallback
   ↓
[API / HTTP]
   ├── PUT vs PATCH / 401 vs 403
   ├── Authentication vs Authorization / Session vs JWT
   ↓
[BACKEND]
   ├── Node.js vs Express / Node.js vs Java / Express vs Spring Boot
   ├── Java vs JavaScript / Java vs Python
   ↓
[DATABASE]
   ├── SQL vs NoSQL
   ↓
[INFRASTRUCTURE]
   ├── Docker Image vs Container / Docker vs Kubernetes / VM vs Container
   ├── Monolith vs Microservices / Vertical vs Horizontal Scaling
   ↓
[WORKFLOW]
   └── Unit vs Integration vs E2E / Merge vs Rebase
```

ให้มองภาพนี้ว่า ทุกคู่มี "บ้าน" อยู่ชั้นใดชั้นหนึ่งของระบบ ถ้าจำได้ว่ามันอยู่ชั้นไหน จะอธิบายได้ว่ามันเกี่ยวกับส่วนอื่นยังไง

---

## 6. Example

### Scenario — Interviewer ถาม "Session กับ JWT ต่างกันยังไง"

**ตอบแบบท่อง:**

> "Session เก็บที่ server ส่วน JWT เก็บที่ client ครับ JWT ดีกว่าเพราะ stateless"

ปัญหา: บอกว่า "ดีกว่า" แบบไม่มี context และไม่ได้พูดถึงราคาที่ต้องจ่าย

**ตอบแบบเข้าใจ (ตามโครง 5 ขั้น):**

> "ทั้งสองเป็นวิธีจำว่า user คนนี้ login แล้วครับ (common ground)
> ต่างกันที่ว่า state ของการ login เก็บที่ server หรือฝังอยู่ใน token (core difference)
> Session ต้องมี store ฝั่ง server เช่น Redis แต่ revoke ง่าย แค่ลบ session ส่วน JWT server ตรวจ signature ได้เลยไม่ต้อง lookup แต่ revoke ก่อนหมดอายุยาก ต้องทำ blacklist หรือใช้ access token อายุสั้นคู่ refresh token (dimensions)
> ถ้าเป็นเว็บเดียวที่ต้องการ logout ทันทีและควบคุมง่าย ผมเลือก session ถ้ามีหลาย service หรือ mobile client ที่ต้อง verify แยกกัน JWT เหมาะกว่า (when to use)
> ที่เคยทำคือใช้ JWT อายุสั้นเก็บใน HttpOnly cookie คู่กับ refresh token ครับ (experience)"

---

## 7. Compare

### 7.1 React vs Next.js

> PART ต้นทาง: PART 03, PART 04

| มิติ | React | Next.js |
|---|---|---|
| ประเภท | UI Library | Full-stack Framework ที่สร้างบน React |
| ทำอะไรให้ | สร้าง component และจัดการ UI | routing, rendering (SSR/SSG/ISR), data fetching, API routes, optimization |
| Routing | ไม่มีในตัว (ใช้ library เพิ่ม) | มีในตัวแบบ file-based |
| Render ที่ไหน | ปกติฝั่ง browser (CSR) | เลือกได้ต่อหน้า: server, build time, หรือ client |
| SEO | ต้องทำเพิ่มเอง | ง่ายกว่าเพราะ render HTML ฝั่ง server ได้ |
| ต้องมี server ไหม | ไม่จำเป็น (static host ได้) | ถ้าใช้ SSR/ISR/Server Component ต้องมี runtime ฝั่ง server |

**จำสั้น ๆ:** React คือเครื่องมือสร้าง UI ส่วน Next.js คือ framework ที่ใช้ React แล้วเติม routing + rendering ฝั่ง server ให้ครบ

**เลือกตัวไหนเมื่อ:** React ล้วน (เช่นกับ Vite) เมื่อเป็น app หลัง login ที่ไม่ต้องการ SEO และอยาก deploy เป็น static — Next.js เมื่อต้องการ SEO, หน้าแรกโหลดเร็ว, หรืออยากได้ backend เล็ก ๆ ในโปรเจกต์เดียวกัน

### 7.2 React vs React Native

> PART ต้นทาง: PART 03, PART 12

| มิติ | React | React Native |
|---|---|---|
| Output | DOM ใน browser | Native UI component บน iOS/Android |
| Element พื้นฐาน | `div`, `span`, `button` | `View`, `Text`, `Pressable` |
| Styling | CSS | StyleSheet แบบ JS object (คล้าย CSS แต่ไม่ใช่ CSS) |
| Navigation | URL + router | stack/tab navigation (ไม่มี URL แบบเว็บโดยตรง) |
| Deploy | อัปเดต server แล้ว user ได้ทันที | ต้องผ่าน App Store / Play Store (ยกเว้นบางส่วนผ่าน OTA update) |
| สิ่งที่ใช้ร่วมกัน | concept เดียวกัน: component, props, state, hooks | เหมือนกัน |

**จำสั้น ๆ:** แนวคิดเดียวกัน (component + state) แต่ React วาดลง DOM ส่วน React Native วาดเป็น native UI ของมือถือ

**เลือกตัวไหนเมื่อ:** React เมื่อ product อยู่บนเว็บ — React Native เมื่อต้องการ app มือถือทั้ง iOS/Android จาก codebase เดียว และทีมถนัด React อยู่แล้ว (ถ้าต้องการ performance/feature native ลึกมาก อาจพิจารณา native โดยตรง)

### 7.3 Node.js vs Express

> PART ต้นทาง: PART 05, PART 06

| มิติ | Node.js | Express |
|---|---|---|
| ประเภท | JavaScript Runtime | Web Framework ที่รันบน Node.js |
| ทำอะไรให้ | รัน JS นอก browser, file system, network, event loop | routing, middleware, จัดการ request/response |
| ใช้โดยไม่มีอีกตัวได้ไหม | ได้ (ใช้ module `http` เขียน server เอง) | ไม่ได้ ต้องมี Node.js |
| ความสัมพันธ์ | พื้นที่ใช้สร้างบ้าน | บ้านที่สร้างบนพื้นนั้น |

**จำสั้น ๆ:** Node.js คือเครื่องยนต์ที่รัน JavaScript ส่วน Express คือโครงสำเร็จที่ทำให้เขียน web server บนเครื่องยนต์นั้นง่ายขึ้น

**เลือกตัวไหนเมื่อ:** ไม่ใช่การเลือกแทนกัน — ใช้ Node.js เสมอเมื่อรัน JS ฝั่ง server แล้วเลือกว่าจะใช้ Express (เรียบง่าย ยืดหยุ่น) หรือ framework อื่นเมื่อต้องการโครงสร้างมากกว่า

### 7.4 Node.js vs Java

> PART ต้นทาง: PART 05, PART 09

| มิติ | Node.js | Java |
|---|---|---|
| ชั้น | Runtime สำหรับภาษา JavaScript | ภาษา + แพลตฟอร์ม JVM |
| Concurrency model | Single-threaded event loop + non-blocking I/O | Multi-threaded (thread pool) และมี virtual threads ในเวอร์ชันใหม่ |
| งานที่เด่น | I/O-bound: API, real-time, BFF | งานองค์กรขนาดใหญ่, CPU-heavy, ระบบที่ต้องการ type เข้มงวด |
| งาน CPU หนัก | block event loop ต้องแยกไป worker | กระจาย thread ได้ตรง ๆ |
| Type system | Dynamic (เพิ่ม TypeScript ได้) | Static, strongly typed |
| Ecosystem | npm, เชื่อมกับ frontend ง่าย | Maven/Gradle, Spring, enterprise tooling |

**จำสั้น ๆ:** Node.js เด่นเรื่องงานรอ I/O เยอะด้วย event loop ส่วน Java เด่นเรื่องระบบใหญ่ที่ต้องการ type เข้ม และใช้หลาย thread ได้เต็มที่

**เลือกตัวไหนเมื่อ:** Node.js เมื่อทีมเป็น JS/TS ทั้ง stack, งานเป็น API/real-time ที่รอ I/O เป็นหลัก — Java เมื่อองค์กรมี ecosystem Java อยู่แล้ว, ระบบใหญ่หลายทีม, หรือมีงานคำนวณหนักที่ต้องใช้หลาย core

### 7.5 Express vs Spring Boot

> PART ต้นทาง: PART 06, PART 10

| มิติ | Express | Spring Boot |
|---|---|---|
| ภาษา | JavaScript/TypeScript | Java (หรือ Kotlin) |
| ปรัชญา | Minimal, unopinionated — เลือกทุกอย่างเอง | Opinionated, convention over configuration — มีโครงมาให้ |
| Dependency Injection | ไม่มีในตัว | เป็นแกนหลัก (IoC container) |
| สิ่งที่มีให้ในตัว | routing + middleware | web, data access, security, validation, config, monitoring (ผ่าน starter) |
| โครงสร้าง project | แต่ละทีมทำไม่เหมือนกัน | ค่อนข้างเป็นมาตรฐาน (Controller → Service → Repository) |
| เริ่มต้น | เร็ว เบา | ต้องเรียนรู้ concept เยอะกว่า แต่ได้ของครบ |

**จำสั้น ๆ:** Express ให้โครงเปล่าที่เบาและยืดหยุ่น ส่วน Spring Boot ให้บ้านสำเร็จที่มีกฎชัดและของครบ

**เลือกตัวไหนเมื่อ:** Express เมื่อต้องการ API เล็กถึงกลาง, ทีม JS, อยากคุมทุกอย่างเอง — Spring Boot เมื่อระบบใหญ่หลายทีม ต้องการมาตรฐานเดียวกันทั้งองค์กร และใช้ Java อยู่แล้ว

### 7.6 Java vs JavaScript

> PART ต้นทาง: PART 02, PART 09

| มิติ | Java | JavaScript |
|---|---|---|
| ความเกี่ยวข้อง | ชื่อคล้ายกันเพราะเหตุผลทางการตลาดในอดีต ภาษาคนละตระกูล | — |
| Typing | Static typing (ประกาศ type) | Dynamic typing |
| รันที่ไหน | JVM (compile เป็น bytecode) | Browser engine หรือ Node.js (interpret + JIT) |
| Paradigm หลัก | Class-based OOP | Multi-paradigm, prototype-based, functional ได้ดี |
| Concurrency | Threads | Event loop + async/await |
| ใช้ทำอะไร | Backend องค์กร, Android (ดั้งเดิม), big data | Frontend ทุกเว็บ, backend ผ่าน Node.js |

**จำสั้น ๆ:** ชื่อคล้ายแต่เป็นคนละภาษา — Java คือภาษา static type บน JVM ส่วน JavaScript คือภาษา dynamic ที่เป็นภาษาของ browser

**เลือกตัวไหนเมื่อ:** JavaScript/TypeScript เมื่อทำอะไรที่รันใน browser (ไม่มีทางเลือกอื่นจริงจัง) หรืออยากใช้ภาษาเดียวทั้ง stack — Java เมื่อทำ backend ในองค์กรที่ต้องการ type เข้มและ tooling enterprise

### 7.7 Java vs Python

> PART ต้นทาง: PART 09, PART 11

| มิติ | Java | Python |
|---|---|---|
| Typing | Static | Dynamic (มี type hints แต่ไม่บังคับตอนรัน) |
| ความกระชับของ code | ยาวกว่า ต้องประกาศเยอะ | สั้น อ่านง่าย |
| Performance ทั่วไป | มักเร็วกว่าในงาน CPU ด้วย JIT ของ JVM | ช้ากว่าใน pure Python แต่ library หลายตัวเขียนด้วย C |
| Concurrency | Multi-thread ใช้หลาย core ได้ | มีข้อจำกัดเรื่อง GIL ใน CPython มาตรฐาน สำหรับงาน CPU มักใช้ multiprocessing |
| จุดแข็งของ ecosystem | Enterprise backend, Spring | Data, ML/AI, scripting, automation, FastAPI/Django |

**จำสั้น ๆ:** Java เน้นความเข้มงวดและ performance สำหรับระบบใหญ่ ส่วน Python เน้นเขียนเร็ว อ่านง่าย และครอง ecosystem ด้าน data/AI

**เลือกตัวไหนเมื่อ:** Java เมื่อทำ backend ขนาดใหญ่ระยะยาว หลายทีม ต้องการ type safety — Python เมื่องานเกี่ยวกับ data/ML, script automation, prototype เร็ว หรือ API ที่ต้องใช้ library ด้าน AI

### 7.8 SQL vs NoSQL

> PART ต้นทาง: PART 08

| มิติ | SQL (Relational) | NoSQL |
|---|---|---|
| โครงสร้างข้อมูล | Table + row + column, schema ชัด | หลายแบบ: document, key-value, wide-column, graph |
| Schema | กำหนดก่อน เปลี่ยนต้อง migration | ยืดหยุ่นกว่า (แต่ app ยังต้องรู้โครงข้อมูล) |
| ความสัมพันธ์ | JOIN ระหว่าง table ได้ดี | มักออกแบบให้ข้อมูลที่ใช้คู่กันอยู่ด้วยกัน (denormalize) |
| Transaction | ACID เป็นจุดแข็งหลัก | แล้วแต่ระบบ หลายตัวรองรับ แต่มักมีข้อจำกัดมากกว่า |
| Scale | Vertical ง่าย, horizontal ทำได้แต่ซับซ้อนกว่า | หลายตัวออกแบบมาให้ scale horizontal ตั้งแต่แรก |
| Query | SQL มาตรฐาน ยืดหยุ่นมาก | แต่ละระบบมี API ของตัวเอง ออกแบบตาม access pattern |

**จำสั้น ๆ:** SQL เก่งเรื่องข้อมูลที่สัมพันธ์กันและต้องถูกต้องแบบ transaction ส่วน NoSQL เก่งเรื่องโครงข้อมูลยืดหยุ่นและ scale ตาม access pattern ที่รู้ล่วงหน้า

**เลือกตัวไหนเมื่อ:** SQL เมื่อข้อมูลมีความสัมพันธ์ซับซ้อน ต้องการ transaction (เงิน, order, stock) และ query หลากหลาย — NoSQL เมื่อ access pattern ชัดและเรียบ, ข้อมูลปริมาณมหาศาล, โครงข้อมูลเปลี่ยนบ่อย หรือเป็น cache/session/log

### 7.9 Session vs JWT

> PART ต้นทาง: PART 07

| มิติ | Session | JWT |
|---|---|---|
| เก็บ state ที่ไหน | Server (memory/Redis/DB) client ถือแค่ session ID | ข้อมูลอยู่ใน token ที่ client ถือ มี signature กันแก้ |
| Server ต้อง lookup ไหม | ต้อง ทุก request | ไม่ต้อง แค่ verify signature |
| Revoke / Logout ทันที | ง่าย ลบ session | ยาก ต้องรอหมดอายุ หรือทำ blacklist / อายุสั้น + refresh token |
| Scale หลาย server | ต้องมี shared session store | ง่ายกว่า เพราะ server ไม่ต้องจำ |
| ขนาดที่ส่งต่อ request | ID สั้น ๆ | token ยาวกว่า (มี payload) |
| ความเสี่ยงที่ต้องระวัง | Session fixation, CSRF (ถ้าใช้ cookie) | เก็บผิดที่ (เช่น localStorage) เสี่ยง XSS, ใส่ข้อมูลลับใน payload (payload แค่ encode ไม่ได้ encrypt) |

**จำสั้น ๆ:** Session = server จำ user ไว้ ส่วน JWT = user ถือบัตรที่ server เซ็นรับรองไว้แล้ว

**เลือกตัวไหนเมื่อ:** Session เมื่อเป็นเว็บเดียว ต้องการ revoke ทันทีและควบคุมง่าย — JWT เมื่อหลาย service ต้อง verify แยกกัน หรือมี mobile/third-party client (มักใช้ access token อายุสั้นคู่ refresh token)

### 7.10 Authentication vs Authorization

> PART ต้นทาง: PART 07

| มิติ | Authentication (AuthN) | Authorization (AuthZ) |
|---|---|---|
| คำถาม | "คุณคือใคร" | "คุณทำสิ่งนี้ได้ไหม" |
| ลำดับ | เกิดก่อน | เกิดหลัง AuthN |
| ข้อมูลที่ใช้ | password, OTP, OAuth, biometric | role, permission, policy, ownership |
| ถ้าล้มเหลว | 401 Unauthorized | 403 Forbidden |
| ตัวอย่าง | login ด้วย Google | user ธรรมดาเข้า admin panel ไม่ได้ |

**จำสั้น ๆ:** Authentication ยืนยันตัวตน ส่วน Authorization ตรวจสิทธิ์ — ต้องรู้ว่าเป็นใครก่อน ถึงจะรู้ว่าทำอะไรได้

**เลือกตัวไหนเมื่อ:** ไม่ใช่การเลือก — ระบบที่มีข้อมูลส่วนตัวต้องมีทั้งสองอย่าง และ AuthZ ต้องเช็คฝั่ง server เสมอ (ซ่อนปุ่มฝั่ง frontend ไม่ใช่ authorization)

### 7.11 PUT vs PATCH

> PART ต้นทาง: PART 01, PART 06

| มิติ | PUT | PATCH |
|---|---|---|
| ความหมาย | แทนที่ resource ทั้งก้อน | แก้บางส่วนของ resource |
| Body | ส่ง resource เต็ม | ส่งเฉพาะ field ที่เปลี่ยน |
| Field ที่ไม่ได้ส่ง | ตาม semantics ถือว่าถูกแทนที่ (อาจกลายเป็นค่าว่าง) | คงค่าเดิม |
| Idempotent | ใช่ ตาม HTTP spec | ไม่รับประกัน (เช่น patch แบบ "เพิ่มค่า +1" เรียกซ้ำผลเปลี่ยน) |
| ตัวอย่าง | อัปเดต profile ทั้งฟอร์ม | เปลี่ยนแค่ชื่อเล่น |

**จำสั้น ๆ:** PUT = เปลี่ยนทั้งก้อน ส่วน PATCH = แก้แค่บางส่วน

**เลือกตัวไหนเมื่อ:** PUT เมื่อ client มีข้อมูลเต็มและต้องการ idempotency ชัดเจน — PATCH เมื่อแก้ไม่กี่ field, resource ใหญ่ หรือหลายคนแก้คนละ field (ลดโอกาสทับข้อมูลคนอื่น)

### 7.12 401 vs 403

> PART ต้นทาง: PART 01, PART 07

| มิติ | 401 Unauthorized | 403 Forbidden |
|---|---|---|
| ความหมายจริง | ยังไม่ได้ยืนยันตัวตน หรือ token ไม่ถูกต้อง/หมดอายุ | รู้แล้วว่าเป็นใคร แต่ไม่มีสิทธิ์ |
| เกี่ยวกับ | Authentication | Authorization |
| client ควรทำ | login ใหม่ / refresh token | ไม่ต้อง login ใหม่ (ไม่ช่วย) แสดงว่าไม่มีสิทธิ์ |
| ตัวอย่าง | เรียก API โดยไม่แนบ token | user role viewer พยายามลบข้อมูล |

**จำสั้น ๆ:** 401 = "ไม่รู้ว่าคุณเป็นใคร" ส่วน 403 = "รู้ว่าเป็นใคร แต่ไม่ให้เข้า" (ชื่อ Unauthorized ของ 401 ชวนสับสน จริง ๆ คือ unauthenticated)

**เลือกตัวไหนเมื่อ:** ส่ง 401 เมื่อ credential ขาด/ผิด/หมดอายุ — ส่ง 403 เมื่อ credential ถูกแต่สิทธิ์ไม่พอ (บางระบบเลือกส่ง 404 แทน 403 เพื่อไม่ให้รู้ว่า resource มีอยู่)

### 7.13 CSR vs SSR vs SSG vs ISR

> PART ต้นทาง: PART 04

| มิติ | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| HTML สร้างตอนไหน | ใน browser หลังโหลด JS | บน server ทุก request | ตอน build | ตอน build แล้ว regenerate เป็นระยะ/ตามสั่ง |
| ความสดของข้อมูล | สด (fetch จาก client) | สดทุก request | ค้างตาม build ล่าสุด | สดตามรอบ revalidate |
| First load | ช้ากว่า (รอ JS) | เร็ว เห็นเนื้อหาเลย | เร็วมาก (serve จาก CDN) | เร็วมาก |
| SEO | อ่อนกว่า | ดี | ดี | ดี |
| ภาระ server | ต่ำ | สูง (render ทุกครั้ง) | ต่ำมาก | ต่ำ |
| ตัวอย่าง | dashboard หลัง login | หน้าที่ personalize ต่อ user | blog, docs, landing | หน้า product ที่ราคาเปลี่ยนเป็นระยะ |

**จำสั้น ๆ:** ต่างกันที่ "HTML ถูกสร้างเมื่อไรและที่ไหน" — CSR ใน browser, SSR ทุก request, SSG ตอน build, ISR ตอน build แล้วอัปเดตเป็นรอบ

**เลือกตัวไหนเมื่อ:** CSR เมื่อไม่ต้องการ SEO และ interactive สูง — SSR เมื่อต้องการ SEO และข้อมูลต้องสด/เฉพาะคน — SSG เมื่อเนื้อหาแทบไม่เปลี่ยน — ISR เมื่อหน้าเยอะและข้อมูลเปลี่ยนเป็นระยะแต่ไม่ต้องสดทุกวินาที (ใน Next.js เลือกผสมได้ต่อหน้า)

### 7.14 Server Component vs Client Component

> PART ต้นทาง: PART 04

| มิติ | Server Component | Client Component |
|---|---|---|
| รันที่ไหน | บน server เท่านั้น | render บน server ครั้งแรกได้ แล้ว hydrate และรันต่อใน browser |
| ส่ง JS ไป browser | ไม่ส่ง code ของ component | ส่ง JS bundle |
| useState / useEffect / event handler | ใช้ไม่ได้ | ใช้ได้ |
| เข้าถึง DB / secret โดยตรง | ได้ | ไม่ได้ (ห้ามใส่ secret) |
| ประกาศ | default ใน Next.js App Router | ต้องมี `"use client"` ที่ต้นไฟล์ |
| ใช้กับ | ดึงข้อมูล, แสดงผลคงที่ | ฟอร์ม, ปุ่ม, modal, อะไรที่ interactive |

**จำสั้น ๆ:** Server Component ทำงานบน server ไม่ส่ง JS ไป browser ส่วน Client Component ส่ง JS ไปเพื่อให้ interactive ได้

**เลือกตัวไหนเมื่อ:** Server Component เป็นค่าเริ่มต้นสำหรับส่วนที่ดึงข้อมูลและแสดงผล — เปลี่ยนเป็น Client Component เฉพาะส่วนที่ต้องมี state, event หรือ browser API และพยายามดัน `"use client"` ลงไปที่ component ใบให้เล็กที่สุด

### 7.15 State vs Props

> PART ต้นทาง: PART 03

| มิติ | State | Props |
|---|---|---|
| เจ้าของ | component ตัวเอง | parent ส่งลงมา |
| เปลี่ยนได้ไหม | ได้ ผ่าน setter (`setX`) | read-only จากมุมของ child |
| ทิศทาง | อยู่ภายใน | ไหลจากบนลงล่าง (one-way data flow) |
| เปลี่ยนแล้ว | component re-render | child re-render เมื่อ parent ส่งค่าใหม่ |
| ตัวอย่าง | ค่าใน input, modal เปิดอยู่ไหม | ชื่อ user ที่ส่งให้ `<Avatar>` แสดง |

**จำสั้น ๆ:** State คือความจำของตัวเองที่เปลี่ยนได้ ส่วน Props คือข้อมูลที่พ่อแม่ส่งมาให้และลูกห้ามแก้

**เลือกตัวไหนเมื่อ:** ใช้ State เมื่อข้อมูลเปลี่ยนตามการกระทำและ component นั้นเป็นเจ้าของ — ใช้ Props เมื่อข้อมูลมาจากข้างบน ถ้าหลาย component ต้องใช้ state เดียวกัน ให้ยก state ขึ้นไปที่ parent ร่วม (lift state up) แล้วส่งเป็น props

### 7.16 useMemo vs useCallback

> PART ต้นทาง: PART 03, PART 22

| มิติ | useMemo | useCallback |
|---|---|---|
| จำอะไร | **ผลลัพธ์** ของการคำนวณ | **ตัว function** |
| คืนค่า | value | function reference เดิม |
| ความสัมพันธ์ | — | เทียบเท่า useMemo ที่คืน function |
| ใช้แก้ปัญหา | การคำนวณหนักซ้ำทุก render, object/array ใหม่ทุก render | function ใหม่ทุก render ทำให้ child ที่ใช้ `React.memo` re-render หรือ effect รันซ้ำ |
| ราคา | เพิ่มความซับซ้อน + ต้องเปรียบเทียบ dependency | เหมือนกัน |

**จำสั้น ๆ:** useMemo จำ "ค่า" ส่วน useCallback จำ "ฟังก์ชัน" — ทั้งคู่เพื่อไม่ให้สร้างใหม่ทุก render

**เลือกตัวไหนเมื่อ:** useMemo เมื่อมีการคำนวณที่วัดได้ว่าหนัก หรือต้องการ reference ของ object คงที่ — useCallback เมื่อส่ง function ให้ child ที่ memo ไว้ หรือเป็น dependency ของ effect — ถ้าไม่มีปัญหา performance ที่วัดได้ ไม่ต้องใช้ทั้งคู่

### 7.17 Cookie vs LocalStorage

> PART ต้นทาง: PART 01, PART 07

| มิติ | Cookie | LocalStorage |
|---|---|---|
| ส่งไป server อัตโนมัติ | ใช่ ทุก request ไป domain นั้น | ไม่ ต้องแนบเอง |
| ขนาด | เล็ก (ประมาณ 4KB ต่อ cookie) | ใหญ่กว่ามาก (ระดับหลาย MB ขึ้นกับ browser) |
| JS อ่านได้ไหม | ได้ ยกเว้นตั้ง `HttpOnly` | ได้เสมอ |
| อายุ | ตั้ง `Expires`/`Max-Age` ได้ หรือหมดเมื่อปิด browser | อยู่จนกว่าจะลบ |
| Security ที่ต้องคิด | XSS ป้องกันด้วย HttpOnly, CSRF ป้องกันด้วย SameSite/CSRF token | ถ้าโดน XSS ขโมยได้ทันที |
| เหมาะกับ | auth token/session ID (แบบ HttpOnly + Secure + SameSite) | ค่าที่ไม่ลับ: theme, draft, preference |

**จำสั้น ๆ:** Cookie ถูกส่งไป server เองและซ่อนจาก JS ได้ ส่วน LocalStorage เก็บได้เยอะแต่ JS อ่านได้เสมอและไม่ถูกส่งไปเอง

**เลือกตัวไหนเมื่อ:** Cookie (HttpOnly) เมื่อเก็บสิ่งที่ใช้ยืนยันตัวตน — LocalStorage เมื่อเก็บ preference หรือข้อมูลไม่ลับฝั่ง client ที่ไม่ต้องส่งไป server

### 7.18 Docker Image vs Container

> PART ต้นทาง: PART 13

| มิติ | Docker Image | Container |
|---|---|---|
| คืออะไร | Template แบบ read-only (layer ของ file system + config) | Instance ที่กำลังรันจาก image |
| สถานะ | นิ่ง ไม่รัน | มี process ทำงานอยู่ (หรือหยุดแล้ว) |
| เปลี่ยนแปลง | immutable สร้างใหม่ด้วยการ build | มี writable layer ของตัวเอง แต่หายเมื่อลบ container (ถ้าไม่ใช้ volume) |
| จำนวน | 1 image | สร้างได้หลาย container จาก image เดียว |
| คำสั่งที่เกี่ยว | build, push, pull | run, stop, logs, exec |

**จำสั้น ๆ:** Image คือแม่พิมพ์ ส่วน Container คือขนมที่ออกมาจากแม่พิมพ์และกำลังถูกใช้งาน

**เลือกตัวไหนเมื่อ:** ไม่ใช่การเลือก — build และเก็บ version ที่ image (ส่งต่อระหว่าง environment) แล้วรันเป็น container ห้ามแก้ของใน container ที่รันอยู่แล้วคิดว่าจะคงอยู่ ให้แก้ Dockerfile แล้ว build ใหม่

### 7.19 Docker vs Kubernetes

> PART ต้นทาง: PART 13, PART 14

| มิติ | Docker | Kubernetes |
|---|---|---|
| ระดับ | สร้างและรัน container บนเครื่องหนึ่ง | จัดการ (orchestrate) container จำนวนมากบนหลายเครื่อง |
| ตอบคำถาม | "จะแพ็กและรัน app นี้ยังไง" | "จะรันหลาย copy, กระจายโหลด, self-heal, rolling update ยังไง" |
| Self-healing | ไม่มีในระดับ cluster | มี — container ตายก็สร้างใหม่ให้ตรง desired state |
| Scaling | ทำเองด้วยมือ/script | ประกาศจำนวน replica หรือ autoscale |
| ความซับซ้อน | ต่ำ | สูง ต้องมีคนดูแล cluster |
| ความสัมพันธ์ | สร้าง image | รัน container จาก image (ผ่าน container runtime) |

**จำสั้น ๆ:** Docker คือการแพ็กของใส่ตู้ container ส่วน Kubernetes คือท่าเรือที่จัดการตู้จำนวนมากให้อยู่ในที่ที่ควรอยู่

**เลือกตัวไหนเมื่อ:** Docker (+ Docker Compose) เมื่อรัน local dev หรือระบบเล็กบนไม่กี่เครื่อง — Kubernetes เมื่อมีหลาย service, ต้องการ auto-scaling/self-healing/zero-downtime deploy และมีคนพร้อมดูแล (หรือใช้ managed service)

### 7.20 VM vs Container

> PART ต้นทาง: PART 13

| มิติ | Virtual Machine | Container |
|---|---|---|
| Virtualize อะไร | Hardware — แต่ละ VM มี OS ของตัวเอง | OS — ใช้ kernel ร่วมกับ host |
| ขนาด | ใหญ่ (มี OS ทั้งตัว) | เล็กกว่ามาก |
| Start time | เป็นนาที (boot OS) | เป็นวินาทีหรือเร็วกว่า |
| Isolation | แข็งแรงกว่า | แยกระดับ process (namespace/cgroup) บางกว่า VM |
| รัน OS ต่างจาก host | ได้ (เช่น Windows บน Linux host) | ต้องใช้ kernel ที่เข้ากันกับ host |
| ใช้ร่วมกัน | บ่อยครั้ง container รันอยู่บน VM ใน cloud | — |

**จำสั้น ๆ:** VM จำลองทั้งเครื่องพร้อม OS ส่วน Container แยกแค่ process โดยใช้ kernel ร่วมกัน จึงเบาและเร็วกว่า

**เลือกตัวไหนเมื่อ:** VM เมื่อต้องการ isolation สูง, ต้องรัน OS ต่างชนิด หรือ legacy app ที่ต้องการทั้งเครื่อง — Container เมื่อต้องการ deploy app ให้เหมือนกันทุก environment, start เร็ว และรันหนาแน่นบน host เดียว

### 7.21 Monolith vs Microservices

> PART ต้นทาง: PART 17

| มิติ | Monolith | Microservices |
|---|---|---|
| Deploy | ทั้งระบบเป็นก้อนเดียว | แต่ละ service deploy แยก |
| การสื่อสารภายใน | function call ใน process | network (HTTP/gRPC/queue) — ช้ากว่าและพังได้ |
| Data | มักใช้ DB เดียว transaction ง่าย | แต่ละ service มี data ของตัวเอง ต้องรับมือ consistency ข้าม service |
| Scale | scale ทั้งก้อน | scale เฉพาะ service ที่ต้องการ |
| ความซับซ้อน operation | ต่ำ | สูง: observability, tracing, service discovery |
| การทำงานของทีม | ทีมเล็กทำงานเร็ว | หลายทีมทำงานอิสระต่อกันได้ |

**จำสั้น ๆ:** Monolith คือบ้านหลังเดียวที่ทุกห้องเชื่อมกัน ส่วน Microservices คือหมู่บ้านที่แต่ละบ้านอิสระ แต่ต้องสร้างถนนและระบบสื่อสารเอง

**เลือกตัวไหนเมื่อ:** Monolith (หรือ modular monolith) เมื่อทีมเล็ก, product ยังเปลี่ยนเร็ว, domain ยังไม่ชัด — Microservices เมื่อหลายทีมชนกันใน codebase เดียว, บางส่วนต้อง scale หรือ deploy แยกจริง และมีความพร้อมด้าน DevOps/observability

### 7.22 Vertical vs Horizontal Scaling

> PART ต้นทาง: PART 16, PART 17

| มิติ | Vertical (Scale Up) | Horizontal (Scale Out) |
|---|---|---|
| ทำอย่างไร | เพิ่ม CPU/RAM ให้เครื่องเดิม | เพิ่มจำนวนเครื่อง/instance |
| ต้องแก้ code ไหม | มักไม่ต้อง | app ควร stateless, ต้องมี load balancer |
| เพดาน | มีขีดจำกัดของเครื่องใหญ่สุด | ขยายได้ไกลกว่า |
| Single point of failure | ยังมี (เครื่องเดียว) | ลดลง (มีหลายตัว) |
| ต้นทุน | เครื่องใหญ่มากราคาสูงขึ้นเร็ว | จ่ายตามจำนวน แต่มีต้นทุนความซับซ้อน |
| เหมาะกับ | Database หลักในช่วงแรก, ระบบที่แยกยาก | Web/API server ที่ stateless |

**จำสั้น ๆ:** Vertical = เปลี่ยนเป็นเครื่องที่แรงขึ้น ส่วน Horizontal = เพิ่มจำนวนเครื่อง

**เลือกตัวไหนเมื่อ:** Vertical เมื่อต้องการแก้เร็ว ไม่อยากแก้ architecture หรือเป็น component ที่กระจายยาก (เช่น DB) — Horizontal เมื่อโหลดโตต่อเนื่อง ต้องการ high availability และ app เป็น stateless แล้ว

### 7.23 Polling vs WebSocket

> PART ต้นทาง: PART 01, PART 16

| มิติ | Polling | WebSocket |
|---|---|---|
| ใครเริ่มส่งข้อมูล | client ถามเป็นรอบ ๆ | ทั้งสองฝั่งส่งได้ตลอดเวลา (full-duplex) |
| Connection | request ใหม่ทุกครั้ง (หรือ long polling ค้างไว้จนมีข้อมูล) | connection เดียวค้างไว้ |
| ความสดของข้อมูล | ช้าได้ถึง 1 รอบ polling | เกือบ real-time |
| ภาระ | request เปล่าเยอะถ้าข้อมูลไม่ค่อยเปลี่ยน | ต้องจัดการ connection ค้าง, reconnect, scale แบบ stateful |
| Infra | ใช้ HTTP ปกติ cache/load balancer ง่าย | load balancer/proxy ต้องรองรับ connection ยาว |
| ทางเลือกตรงกลาง | — | Server-Sent Events (SSE) เมื่อ server ส่งทางเดียว |

**จำสั้น ๆ:** Polling = client ถามซ้ำ ๆ ว่ามีอะไรใหม่ไหม ส่วน WebSocket = เปิดสายค้างไว้ ใครมีเรื่องก็พูดได้ทันที

**เลือกตัวไหนเมื่อ:** Polling เมื่อข้อมูลเปลี่ยนไม่บ่อย รับความล่าช้าได้ (เช่นเช็คสถานะ export ทุก 5 วินาที) และอยากให้ infra ง่าย — WebSocket เมื่อต้องการ real-time สองทาง เช่น chat, collaborative editing, เกม (ถ้า server ส่งทางเดียว พิจารณา SSE)

### 7.24 Unit vs Integration vs E2E Test

> PART ต้นทาง: PART 18

| มิติ | Unit | Integration | E2E |
|---|---|---|---|
| ทดสอบอะไร | function/component เดี่ยว | หลายส่วนทำงานร่วมกัน (เช่น API + DB) | flow จริงของ user ผ่าน UI ทั้งระบบ |
| Dependency ภายนอก | mock/stub | ใช้ของจริงบางส่วน | ใช้ของจริงเกือบทั้งหมด |
| ความเร็ว | เร็วมาก | กลาง | ช้า |
| ความเปราะ (flaky) | ต่ำ | กลาง | สูง |
| ความมั่นใจต่อ user | ต่ำสุด (เฉพาะจุด) | กลาง | สูงสุด |
| จำนวนที่ควรมี (Test Pyramid) | เยอะที่สุด | กลาง | น้อยที่สุด เฉพาะ flow สำคัญ |

**จำสั้น ๆ:** Unit ตรวจชิ้นส่วน, Integration ตรวจว่าชิ้นส่วนต่อกันได้, E2E ตรวจว่า user ทำงานสำเร็จจริง

**เลือกตัวไหนเมื่อ:** Unit เมื่อทดสอบ logic ที่มีหลายเงื่อนไข (คำนวณราคา, validation) — Integration เมื่อทดสอบรอยต่อ (API กับ DB, service กับ service) — E2E เมื่อทดสอบ critical flow ที่พังไม่ได้ (login, checkout, payment) ใช้ผสมกันตาม pyramid ไม่ใช่เลือกอย่างเดียว

### 7.25 Merge vs Rebase

> PART ต้นทาง: PART 19

| มิติ | Merge | Rebase |
|---|---|---|
| ทำอะไร | รวมสอง branch โดยสร้าง merge commit | ย้าย commit ของเราไปต่อท้าย base ใหม่ (เขียน commit ใหม่) |
| History | เก็บตามจริง แตกกิ่งแล้วรวม | เป็นเส้นตรง อ่านง่าย |
| เปลี่ยน commit hash เดิมไหม | ไม่ | เปลี่ยน (สร้าง commit ใหม่) |
| ความปลอดภัยกับ branch ที่แชร์ | ปลอดภัย | อันตรายถ้า rebase branch ที่คนอื่นใช้อยู่แล้ว push force |
| แก้ conflict | ครั้งเดียวตอน merge | อาจต้องแก้ทีละ commit |

**จำสั้น ๆ:** Merge รักษาประวัติจริงไว้ทั้งหมด ส่วน Rebase เขียนประวัติใหม่ให้เป็นเส้นตรง

**เลือกตัวไหนเมื่อ:** Merge เมื่อรวม branch ที่แชร์กับคนอื่นหรือรวมเข้า main และอยากเก็บบริบทว่ามาจาก branch ไหน — Rebase เมื่ออัปเดต feature branch ส่วนตัวให้ทันกับ main ก่อนเปิด PR หรือจัด commit ให้สะอาด (กฎ: อย่า rebase branch สาธารณะที่คนอื่นใช้อยู่) — ทั้งนี้ให้ตามข้อตกลงของทีมเป็นหลัก

---

## 8. Common Mistakes

| ความผิดพลาด | ตัวอย่าง | ที่ถูก |
|---|---|---|
| ตอบว่าตัวหนึ่ง "ดีกว่า" แบบไม่มี context | "NoSQL ดีกว่าเพราะเร็ว" | "NoSQL เหมาะเมื่อ access pattern ชัดและต้อง scale horizontal แต่ถ้าต้อง transaction ข้าม table SQL เหมาะกว่า" |
| เทียบของคนละชั้นเหมือนคู่แข่ง | "จะใช้ Node.js หรือ Express ดี" | "Express รันบน Node.js ใช้ด้วยกัน คำถามจริงคือจะใช้ Express หรือ framework อื่น" |
| อธิบาย A จบแล้วอธิบาย B จบ | พูด definition สองก้อนแยกกัน | เทียบทีละมิติ: "เรื่อง X, A ทำแบบนี้ B ทำแบบนี้" |
| คิดว่า Docker กับ Kubernetes แข่งกัน | "บริษัทเราใช้ Kubernetes แทน Docker" | K8s รัน container จาก image ที่ build ด้วย Docker (หรือเครื่องมืออื่นที่ใช้มาตรฐานเดียวกัน) |
| สลับ 401 กับ 403 | ส่ง 403 ตอน token หมดอายุ | token หมดอายุ = 401, สิทธิ์ไม่พอ = 403 |
| คิดว่า JWT ปลอดภัยกว่า session เสมอ | "ใช้ JWT เพราะ secure" | ความปลอดภัยขึ้นกับการเก็บและการ revoke ไม่ใช่รูปแบบ token |
| ใส่ useMemo/useCallback ทุกที่ | wrap ทุก function | ใช้เมื่อวัดได้ว่ามีปัญหา render หรือต้องการ reference คงที่จริง |
| คิดว่า microservices = architecture ที่ทันสมัยกว่า | "จะ migrate เป็น microservices เพราะ scale ได้" | ถามก่อนว่าปัญหาจริงคืออะไร หลายปัญหาแก้ได้ใน monolith |
| คิดว่า PATCH idempotent เหมือน PUT | "PATCH retry ได้เสมอ" | PATCH ไม่รับประกัน ขึ้นกับ operation |
| rebase branch ที่แชร์ | rebase `develop` แล้ว force push | rebase เฉพาะ branch ส่วนตัว |
| เก็บ token ใน localStorage โดยไม่คิด | "ง่ายดี" | เข้าใจความเสี่ยง XSS และพิจารณา HttpOnly cookie |
| ทำ E2E test ครอบทุกอย่าง | test ช้า flaky จนทีมเลิกเชื่อ | E2E เฉพาะ critical flow ที่เหลือใช้ unit/integration |

---

## 9. Debugging

ในบริบทของ PART นี้ debugging คือ **เมื่อเลือกผิดฝั่งไปแล้ว อาการจะออกมาแบบไหน** — ใช้ย้อนหาได้ว่าปัญหาเกิดจากการเลือก technology หรือเปล่า

| อาการที่เจอ | อาจเป็นเพราะ | สิ่งที่ต้องไล่ดู |
|---|---|---|
| หน้าเว็บไม่ขึ้น Google, แชร์ลิงก์ไม่มี preview | ใช้ CSR กับหน้าที่ต้องการ SEO | ดู HTML ที่ server ส่งมา (view source) ว่ามีเนื้อหาไหม |
| Server CPU สูงตลอดทั้งที่ข้อมูลไม่ค่อยเปลี่ยน | ใช้ SSR กับหน้าที่ควรเป็น SSG/ISR | ดูว่าหน้าไหน render ใหม่ทุก request |
| Logout แล้วยังเรียก API ได้ | ใช้ JWT อายุยาวโดยไม่มี revoke | ดูอายุ token และกลไก refresh/blacklist |
| user login หลุดเมื่อ scale เป็นหลาย instance | เก็บ session ใน memory ของ server | ย้าย session ไป shared store เช่น Redis |
| Client วนลูป login ไม่จบ | ส่ง 401 ในกรณีที่ควรเป็น 403 | เช็ค logic ว่าแยก "ไม่รู้ตัวตน" กับ "ไม่มีสิทธิ์" |
| Field อื่นหายหลังอัปเดต | ใช้ PUT แต่ส่งข้อมูลไม่ครบ | ดู body ที่ส่ง และพิจารณาใช้ PATCH |
| ข้อมูลใน container หายหลัง restart | เก็บไฟล์ใน writable layer ของ container | ใช้ volume หรือ external storage |
| Deploy ใหม่แล้วไม่มีผล | แก้ใน container ที่รันอยู่ ไม่ได้ build image ใหม่ | เช็ค image tag ที่ deploy จริง |
| เพิ่ม instance แล้วไม่เร็วขึ้น | bottleneck อยู่ที่ DB ไม่ใช่ app server | ดู trace/metric ว่าเวลาไปหมดที่ไหน |
| Deploy service หนึ่งแล้วอีก service พัง | microservices ที่ coupling สูง (distributed monolith) | ดู contract ระหว่าง service และ versioning |
| Server รับ request เปล่าเยอะมาก | polling ถี่เกินกับข้อมูลที่เปลี่ยนไม่บ่อย | ลดความถี่ หรือเปลี่ยนเป็น SSE/WebSocket |
| ทีม push แล้ว history พัง commit หาย | rebase + force push บน branch ที่แชร์ | ดู reflog และตั้ง branch protection |
| Bundle ใหญ่ หน้าโหลดช้า (Next.js) | ใส่ `"use client"` ที่ component บนสุด ทำให้ทั้ง tree เป็น client | ดันขอบเขต client ลงไปที่ component ใบ |
| CI ช้าและ fail แบบสุ่ม | พึ่ง E2E test มากเกินไป | ย้าย logic test ลงไปเป็น unit/integration |

ลำดับคิดเวลาสงสัยว่า "เลือก technology ผิดหรือเปล่า":

```
[อาการ]
   ↓
[เป็นปัญหาของการใช้งาน (config/code) หรือของตัวเลือก?]
   ↓
   ├── การใช้งาน → แก้ config/code ก่อน (ส่วนใหญ่อยู่ตรงนี้)
   └── ตัวเลือกจริง → ย้อนดูมิติในตารางว่ามิติไหนที่ context เปลี่ยนไป
   ↓
[ถ้าต้องเปลี่ยน → วางแผน migration แบบค่อยเป็นค่อยไป]
```

ให้มองภาพนี้ว่า ส่วนใหญ่ปัญหาไม่ได้มาจากเลือกผิด แต่มาจากใช้ผิด — การเปลี่ยน technology ควรเป็นทางเลือกสุดท้าย และต้องบอกได้ว่ามิติไหนใน context ที่เปลี่ยนไป

---

## 10. Interview Questions

### 🟢 Junior

1. React กับ Next.js ต่างกันอย่างไร
2. State กับ Props ต่างกันอย่างไร
3. Authentication กับ Authorization ต่างกันอย่างไร
4. 401 กับ 403 ต่างกันอย่างไร
5. PUT กับ PATCH ต่างกันอย่างไร
6. Docker Image กับ Container ต่างกันอย่างไร
7. Java กับ JavaScript เกี่ยวข้องกันไหม
8. Node.js กับ Express ต่างกันอย่างไร

### 🟡 Mid

1. Session กับ JWT เลือกอะไรสำหรับเว็บ e-commerce ทำไม
2. CSR / SSR / SSG / ISR — หน้า product ที่มี 100,000 รายการควรใช้แบบไหน
3. Server Component กับ Client Component แบ่งอย่างไรในหน้าที่มีฟอร์ม
4. useMemo กับ useCallback ต่างกันอย่างไร และเมื่อไรไม่ควรใช้
5. Cookie กับ LocalStorage ควรเก็บ token ที่ไหน
6. SQL กับ NoSQL เลือกอย่างไรสำหรับระบบ order
7. Merge กับ Rebase ทีมคุณใช้แบบไหน ทำไม
8. Unit / Integration / E2E ควรมีสัดส่วนอย่างไร

### 🔴 Senior

1. Monolith กับ Microservices — ถ้า startup ของคุณโตเป็น 5 ทีม คุณจะตัดสินใจอย่างไร
2. Vertical กับ Horizontal Scaling — database ควร scale แบบไหนก่อน และเมื่อไรต้องเปลี่ยน
3. Docker กับ Kubernetes — บริษัทมี 3 service ควรใช้ Kubernetes ไหม
4. Node.js กับ Java — ถ้าต้องเลือก stack ใหม่ให้องค์กร คุณจะใช้เกณฑ์อะไร
5. Polling กับ WebSocket — ถ้าต้องทำ notification ให้ user หลักล้านคน คุณออกแบบอย่างไร
6. VM กับ Container — มีกรณีไหนที่คุณจะเลือก VM ทั้งที่ทีมใช้ container อยู่แล้ว

---

## 11. Answer Like a Developer

### โครงตอบคำถาม A vs B

```
1. Common Ground   → "ทั้งสองเกี่ยวกับ ..."
      ↓
2. Core Difference → "ต่างกันที่แก่น ..." (ใช้บรรทัด จำสั้น ๆ)
      ↓
3. 2–3 Dimensions  → เลือกมิติที่สำคัญที่สุดจากตาราง
      ↓
4. When to Use     → "ผมเลือก A เมื่อ ... และ B เมื่อ ..."
      ↓
5. Experience      → "ในงานที่ผ่านมา ผม ..."
```

ให้มองภาพนี้ว่า คำตอบเริ่มกว้างแล้วแคบลงเรื่อย ๆ จนถึงประสบการณ์จริง ถ้าเวลาหมดกลางทาง อย่างน้อยคนฟังก็ได้แก่นของคำตอบไปแล้ว

### กรณีพิเศษ

| สถานการณ์ | วิธีตอบ |
|---|---|
| คู่ต่างชั้น (เช่น Docker vs K8s) | บอกก่อนว่า "ไม่ใช่คู่แข่ง" แล้วอธิบายความสัมพันธ์ |
| ถามว่า "อันไหนดีกว่า" | ถามกลับหรือสมมติ context: "ขึ้นกับ ... ถ้า ... ผมเลือก ..." |
| ไม่เคยใช้ตัวใดตัวหนึ่ง | บอกตรง ๆ แล้วเทียบจากหลักการ: "ผมใช้ A มา ไม่เคยใช้ B ในงานจริง แต่เข้าใจว่า B ต่างที่ ..." |
| คู่ที่มีตรงกลาง (spectrum) | พูดถึงทางเลือกตรงกลางด้วย เช่น modular monolith, SSE, ISR |
| Interviewer ไม่เห็นด้วย | ยอมรับมุมของเขา แล้วบอกว่า context ไหนที่คำตอบของคุณยังเหมาะ |

### ประโยคเปิดที่ใช้ได้

- "สองตัวนี้จริง ๆ อยู่คนละชั้นครับ ..."
- "ทั้งคู่แก้ปัญหาเดียวกันคือ ... แต่ต่างกันที่ ..."
- "ไม่มีตัวไหนดีกว่าแบบเด็ดขาดครับ ขึ้นอยู่กับ ... ถ้าเป็นกรณี ... ผมจะเลือก ..."

---

## 12. One-Minute Review

- คำถาม A vs B ต้องเช็คก่อน: **คนละชั้น? คนละปัญหา? หรือทางเลือกแทนกัน?**
- **คู่ต่างชั้น (ใช้ร่วมกัน):** React/Next.js, Node.js/Express, Docker/Kubernetes, Image/Container
- **คู่ต่างแนวคิด:** AuthN (ใคร) / AuthZ (ทำได้ไหม), 401 (ไม่รู้ตัวตน) / 403 (ไม่มีสิทธิ์), State (ของตัวเอง) / Props (จากพ่อแม่)
- **Rendering:** CSR ใน browser, SSR ทุก request, SSG ตอน build, ISR build แล้วอัปเดตเป็นรอบ
- **Session** server จำ, **JWT** client ถือบัตรที่เซ็นแล้ว — revoke ง่าย vs verify ง่าย
- **PUT** ทั้งก้อน idempotent, **PATCH** บางส่วน ไม่รับประกัน idempotent
- **Cookie (HttpOnly)** สำหรับ auth, **LocalStorage** สำหรับ preference ที่ไม่ลับ
- **VM** จำลองทั้งเครื่อง, **Container** แยก process ใช้ kernel ร่วม
- **Monolith** เริ่มง่าย, **Microservices** แยกทีมได้แต่ต้องจ่ายค่า operation
- **Vertical** เครื่องแรงขึ้น, **Horizontal** เครื่องเยอะขึ้น (ต้อง stateless)
- **Unit/Integration/E2E** ใช้ผสมตาม pyramid, **Merge** รักษาประวัติ, **Rebase** เขียนประวัติใหม่
- ห้ามพูดว่า "ดีกว่า" — ให้พูดว่า **"เหมาะกว่าเมื่อ..."**

---

## 13. Memory Card

**จำ 5 อย่าง**

1. **เช็คชั้นก่อนเทียบ** — ครึ่งหนึ่งของคู่ที่ถูกถามไม่ใช่คู่แข่ง แต่ใช้ร่วมกัน
2. **เทียบทีละมิติ** ไม่ใช่อธิบาย A จบแล้วอธิบาย B
3. **ทุกคำตอบต้องจบด้วย "เลือกตัวไหนเมื่อ"** พร้อม context
4. **บอก trade-off เสมอ** — สิ่งที่ได้และสิ่งที่เสีย
5. **ใช้โครง 5 ขั้น:** Common Ground → Core Difference → Dimensions → When to Use → Experience

**Keyword:**

- React → UI library, Next.js → framework บน React
- Node.js → runtime, Express → framework บน Node.js
- Session → server จำ, JWT → client ถือบัตรที่เซ็นแล้ว
- 401 → ไม่รู้ว่าเป็นใคร, 403 → รู้แต่ไม่ให้เข้า
- CSR → browser, SSR → ทุก request, SSG → ตอน build, ISR → build แล้วอัปเดตเป็นรอบ
- Image → แม่พิมพ์, Container → ของที่ออกจากแม่พิมพ์
- Docker → แพ็กตู้, Kubernetes → ท่าเรือจัดการตู้
- Merge → รักษาประวัติ, Rebase → เขียนประวัติใหม่

---

[← สารบัญ](./00-README-TOC.md)
