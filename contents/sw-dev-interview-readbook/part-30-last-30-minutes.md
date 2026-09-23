# PART 30 — LAST 30 MINUTES BEFORE INTERVIEW

> ตำแหน่งในภาพใหญ่: Interview Mode — ภาพย่อของทั้งเล่ม อ่านจบใน 30 นาทีก่อนเดินเข้าห้อง

## 1. Big Picture

ตอนนี้ไม่ใช่เวลาเรียนเรื่องใหม่ แต่เป็นเวลา **"ปลุกของที่รู้อยู่แล้วให้ตื่น"**

ไฟล์นี้คือหน้าจอสรุปของทั้ง 30 PART อัดไว้ในที่เดียว:

- ศัพท์ที่ต้องพูดได้ทันทีโดยไม่ต้องคิด (Top 50)
- คำถามที่เจอบ่อยที่สุด พร้อม "แก่น" ที่ต้องพูดถึง (Top 20)
- Top 10 ของแต่ละหมวด ตั้งแต่ Comparison, Debugging, Architecture, Security, React/Next, Backend, Database, Docker/Kubernetes
- Checklist ก่อนเดินเข้าห้อง

**กติกาเดียวของการอ่านไฟล์นี้:** อ่านผ่าน ๆ ห้ามหยุดขุดลึก ถ้าเจอข้อไหนที่จำไม่ได้เลย ให้ทำเครื่องหมายไว้ แล้วใช้ "สูตรตอบเมื่อไม่รู้" ในหัวข้อ 11 แทนการพยายามท่องใหม่

### ⏱️ แผนเวลาอ่าน 30 นาที

| นาที | อ่านอะไร | เป้าหมาย |
|---|---|---|
| 0–5 | หัวข้อ 3 (Master Memory Map) + หัวข้อ 5 (Debugging Framework) | วางแผนที่ในหัวให้ครบก่อน ทุกอย่างที่เหลือจะมีที่เกาะ |
| 5–10 | หัวข้อ 2 (Top 50 Keywords) | พูดศัพท์ให้คล่องปาก อ่านคอลัมน์ "จำสั้นๆ" ออกเสียงในใจ |
| 10–17 | หัวข้อ 6.1 (Top 20 Questions) | ซ้อมโครงคำตอบ ไม่ใช่ท่องประโยค |
| 17–20 | หัวข้อ 6.2 (Top 10 Comparison) + 6.3 (Top 10 Debugging) | คำถามคู่เทียบ และคำถาม "ถ้าพังจะทำยังไง" คือของที่ออกบ่อยที่สุด |
| 20–26 | หัวข้อ 6.4–6.9 (Top 10 แต่ละหมวด) | อ่านเฉพาะหมวดที่ตรงกับตำแหน่งงานก่อน หมวดอื่นกวาดตา |
| 26–29 | หัวข้อ 11 (ก่อนเดินเข้าห้อง) | สูตรตอบ 4 จังหวะ + ประโยคเมื่อไม่รู้ + คำถามถามกลับ |
| 29–30 | หัวข้อ 13 (Memory Card) | ปิดหนังสือ หายใจลึก ๆ เดินเข้าห้อง |

```
[นาที 0]  แผนที่ใหญ่ + Debug Framework
    ↓
[นาที 5]  Top 50 Keywords
    ↓
[นาที 10] Top 20 Questions
    ↓
[นาที 17] Compare + Debug Scenarios
    ↓
[นาที 20] Top 10 รายหมวด
    ↓
[นาที 26] Checklist ก่อนเข้าห้อง
    ↓
[นาที 29] Memory Card → เข้าห้อง
```

> **ให้มองภาพนี้ว่า** "เหมือนวอร์มอัพก่อนลงสนาม — เริ่มจากยืดกล้ามเนื้อใหญ่ (ภาพรวม) ก่อน แล้วค่อยซ้อมท่าเฉพาะ (คำถาม) ไม่ใช่วิ่งเร็วสุดตั้งแต่นาทีแรก"

---

## 2. Keywords

### 🔑 Top 50 Keywords — ต้องพูดได้ภายใน 1 ประโยค

| # | Keyword | จำสั้นๆ |
|---|---|---|
| 1 | HTTP | ภาษากลางที่ client กับ server ใช้คุยกัน แบบถาม–ตอบ |
| 2 | REST API | ออกแบบ API รอบ "resource" + ใช้ HTTP Method บอกการกระทำ |
| 3 | Stateless | server ไม่จำอะไรระหว่าง request → เพิ่มเครื่องได้ |
| 4 | Status Code | 2xx สำเร็จ / 4xx client ผิด / 5xx server ผิด |
| 5 | 401 vs 403 | 401 = ไม่รู้ว่าคุณคือใคร / 403 = รู้แล้ว แต่ไม่มีสิทธิ์ |
| 6 | DNS | สมุดโทรศัพท์ แปลงชื่อ domain เป็น IP |
| 7 | Event Loop | พนักงานคนเดียวที่หยิบงานเสร็จแล้วมาทำต่อ ไม่ยืนรอ |
| 8 | Promise / async-await | สัญญาว่าจะมีผลลัพธ์ในอนาคต / เขียนให้อ่านเหมือนรอทีละบรรทัด |
| 9 | Closure | function ที่พกตัวแปรจากที่เกิดติดตัวไปด้วย |
| 10 | Component | function ที่รับข้อมูลแล้วคืนหน้าตา |
| 11 | Props vs State | พัสดุจากแม่ (แก้ไม่ได้) vs สมุดส่วนตัว (เปลี่ยนแล้วจอเปลี่ยน) |
| 12 | Re-render | React เรียก function ซ้ำ ≠ แก้ DOM เสมอไป |
| 13 | Virtual DOM / Reconciliation | พิมพ์เขียว → เทียบเก่า-ใหม่ → แก้เฉพาะที่ต่าง |
| 14 | useEffect | สะพานไปโลกนอก React + ต้องมี cleanup |
| 15 | Key | บัตรประชาชนของ item ใน list ห้ามใช้ index เมื่อมีลบ/แทรก/เรียง |
| 16 | Server State | ข้อมูลที่เจ้าของจริงคือ server → ใช้ TanStack Query ไม่ใช่ global store |
| 17 | SSR / SSG / ISR / CSR | วาดทุก request / วาดตอน build / build + หมดอายุ / browser วาดเอง |
| 18 | Server Component | โค้ดที่ browser ไม่เคยเห็น (≠ SSR) |
| 19 | Hydration | เสียบปลั๊กให้ HTML ที่ server วาดมา ให้กดได้ |
| 20 | Node.js | runtime ที่รัน JavaScript นอก browser ไม่ใช่ภาษา |
| 21 | Middleware | ด่านตรวจที่ request ต้องผ่านก่อนถึง handler |
| 22 | Controller / Service / Repository | รับ-ส่ง HTTP / คิด business / คุยกับ DB |
| 23 | Authentication vs Authorization | คุณคือใคร vs คุณทำอะไรได้ |
| 24 | JWT | บัตรที่ server เซ็นไว้ ตรวจลายเซ็นได้เลย revoke ยาก |
| 25 | Access / Refresh Token | บัตรอายุสั้นใช้ทุก request / บัตรอายุยาวใช้ขอบัตรใหม่ ต้อง rotate |
| 26 | Password Hashing + Salt | ทางเดียว ใช้ bcrypt/argon2 + ค่าสุ่มต่อ user |
| 27 | CORS | กฎของ browser ไม่ใช่กำแพงของ server |
| 28 | XSS / CSRF | script แปลกปลอมอยู่ในเว็บเรา / request ปลอมจากเว็บอื่น |
| 29 | SQL Injection | input ปนกับคำสั่ง → แก้ด้วย parameterized query |
| 30 | Index | สารบัญ — read เร็ว แต่ write ช้าและกินพื้นที่ |
| 31 | N+1 | 1 query แม่ + N query ลูก = คูณ round-trip |
| 32 | Transaction / ACID | ทั้งหมดหรือไม่เอาเลย / ทั้งก้อน-ไม่ผิดกฎ-ไม่แอบดู-ไม่คืนคำ |
| 33 | Race Condition | อ่าน–คิด–เขียน ไม่ atomic → เขียนทับกัน |
| 34 | Optimistic vs Pessimistic Lock | เช็ค version ตอนเขียน (ชนน้อย) vs ล็อกไว้ก่อน (ชนบ่อย) |
| 35 | Connection Pool | โต๊ะที่เปิดค้างไว้ ไม่ต้องจองใหม่ทุกครั้ง |
| 36 | Cache / Cache Aside / TTL | ตู้เย็น / ถามตู้ก่อนไม่มีค่อยไปหลังร้าน / วันหมดอายุ |
| 37 | Queue / Message Broker | ใบสั่งเสียบครัว / บุรุษไปรษณีย์ระหว่าง service |
| 38 | Load Balancer | คนโบกรถให้ไปช่องที่ว่าง |
| 39 | Horizontal vs Vertical Scaling | เพิ่มจำนวนเครื่อง (ต้อง stateless) vs เพิ่มพลังเครื่องเดิม (มีเพดาน) |
| 40 | Idempotency | กดปุ่มลิฟต์ซ้ำกี่ครั้งผลก็เดิม |
| 41 | Timeout / Retry / Circuit Breaker | หยุดรอ / ลองใหม่แบบรอนานขึ้น / ตัดไฟก่อนไฟไหม้ทั้งบ้าน |
| 42 | Microservices vs Modular Monolith | แยกบ้านจ่ายค่าไฟเอง vs ตึกเดียวแบ่งห้องชัด |
| 43 | Docker Image vs Container | แม่พิมพ์ / ขนมที่อบออกมาแล้วกำลังทำงาน |
| 44 | Kubernetes | ผู้จัดการที่รักษา actual state ให้ตรง desired state |
| 45 | Pod / Deployment / Service | หน่วยเล็กสุดที่รัน / คนคุมจำนวนและเวอร์ชัน / ที่อยู่คงที่ของกลุ่ม Pod |
| 46 | Liveness vs Readiness Probe | ตายหรือยัง (restart) vs พร้อมรับงานหรือยัง (ตัดออกจาก traffic) |
| 47 | CI / CD | รวมโค้ดแล้วเทสต์อัตโนมัติ / ส่งขึ้น environment อัตโนมัติ |
| 48 | Rollback / Canary / Blue-Green | ถอยกลับ / ปล่อยให้คนส่วนน้อยก่อน / สลับสองชุดทีเดียว |
| 49 | Logs / Metrics / Tracing | ทำไม / เมื่อไร-เท่าไร / ตรงไหนของเส้นทาง |
| 50 | Root Cause / Regression Test | จุดที่แก้แล้วไม่กลับมา / เทสต์ที่ต้องแดงก่อนแก้ |

---

## 3. Mental Model

มองทุกคำถามในห้องสัมภาษณ์ว่า **"มันอยู่ชั้นไหนของ request หนึ่งครั้ง"** แล้วตอบจากชั้นนั้น

### 🗺️ Master Memory Map (ย่อ)

```
[USER]
   ↓
[BROWSER]          DNS · HTTPS · Cookie · CORS
   ↓
[FRONTEND]         React · State · Re-render · Next.js (SSR/SSG/RSC)
   ↓
[HTTP / REST]      Method · Status Code · Stateless
   ↓
[GATEWAY / LB]     CDN · Load Balancer · Rate Limit
   ↓
[BACKEND]          Node.js · Express · Middleware · Controller→Service→Repo
   ↓
[AUTH]             AuthN (401) · AuthZ (403) · JWT / Session
   ↓
[CACHE / QUEUE]    Redis · TTL · Queue · Worker · Idempotency
   ↓
[DATABASE]         Index · Transaction · Lock · N+1 · Pool
   ↓
[DOCKER → K8S]     Image · Container · Pod · Deployment · Probe
   ↓
[CI/CD]            Build · Test · Deploy · Rollback
   ↓
[OBSERVABILITY]    Logs · Metrics · Tracing · Alert
```

> **ให้มองภาพนี้ว่า** "ทางเดินของ request หนึ่งครั้งจากนิ้วผู้ใช้ลงไปถึง database แล้วย้อนกลับ — ทุกศัพท์ในหนังสือเล่มนี้คือป้ายบอกทางของชั้นใดชั้นหนึ่งบนทางเดินนี้"

3 คำถามที่ใช้ได้กับทุกชั้น:

1. ชั้นนี้ **มีไว้แก้ปัญหาอะไร**
2. ชั้นนี้ **แลกอะไรไป** (trade-off)
3. ชั้นนี้ **พังแล้วเห็นอาการอะไร** และดูหลักฐานที่ไหน

---

## 4. ภาพจำ

```
🧠 ภาพจำ:
ห้องสัมภาษณ์ = การนำทัวร์ ไม่ใช่การสอบท่องจำ

ผู้สัมภาษณ์ชี้ไปที่จุดหนึ่งบนแผนที่
      ↓
เราบอกว่าจุดนี้อยู่ชั้นไหน ทำหน้าที่อะไร
      ↓
เล่าว่ามันเชื่อมกับชั้นก่อนหน้า/ถัดไปยังไง
      ↓
บอกว่าถ้าพังจะเห็นอะไร และแก้ยังไง
```

> **ให้มองภาพนี้ว่า** "คนที่นำทัวร์เก่งไม่ได้จำทุกอิฐทุกก้อน แต่รู้ว่าแต่ละห้องอยู่ตรงไหนและเดินไปหากันยังไง"

---

## 5. How It Works

### 🔧 Debugging Framework (ย่อ)

```
REPRODUCE      ทำให้พังซ้ำได้ตามสั่ง
    ↓
EXPECTED       ควรเกิดอะไร
    ↓
ACTUAL         เกิดอะไรจริง
    ↓
LOCATE         ปัญหาหยุดอยู่ชั้นไหน (Browser / API / DB / Infra)
    ↓
EVIDENCE       Log (ทำไม) · Metric (เมื่อไร) · Trace (ตรงไหน)
    ↓
HYPOTHESIS     ตั้งข้อเดาอย่างน้อย 3 ข้อ ที่พิสูจน์ผิดได้
    ↓
TEST           เปลี่ยนทีละอย่าง
    ↓
ROOT CAUSE     จุดที่แก้แล้วไม่กลับมา + อธิบายได้ว่าทำไมเพิ่งเกิด
    ↓
FIX            production: หยุดเลือดก่อน (rollback) แล้วค่อยแก้ให้ถูก
    ↓
REGRESSION     เทสต์ที่แดงก่อนแก้ เขียวหลังแก้
    ↓
MONITOR        ถ้ามันกลับมา เราต้องรู้ก่อนผู้ใช้
```

> **ให้มองภาพนี้ว่า** "นักสืบที่ลดพื้นที่ค้นหาลงทีละครึ่ง — ไม่เดาคนร้ายตั้งแต่แรก แต่ตัดคนที่มีหลักฐานว่าบริสุทธิ์ออกทีละคน"

### คำถาม 3 ข้อแรกเมื่อเจอโจทย์ "ระบบพัง"

| ถาม | ตัดอะไรออก |
|---|---|
| เกิดกับทุกคนหรือบางคน | แยกปัญหาระบบรวม vs ปัญหาเฉพาะข้อมูล/อุปกรณ์/สิทธิ์ |
| เริ่มเมื่อไร | ผูกกับเหตุการณ์ได้ (deploy, config, traffic) |
| ช่วงนั้นเปลี่ยนอะไรไหม | deploy / migration / config / dependency — ต้นเหตุอันดับหนึ่งของ production incident |

---

## 6. Example

### 6.1 🎯 Top 20 Interview Questions

| # | คำถาม | แก่นคำตอบ (1–2 บรรทัด) |
|---|---|---|
| 1 | พิมพ์ URL แล้วกด Enter เกิดอะไรขึ้น | DNS → TCP/TLS → HTTP Request → Server/Backend/DB → Response → Browser parse HTML/CSS/JS → render; บอกได้ว่าแต่ละชั้นช้า/พังได้ยังไง |
| 2 | Event Loop ทำงานยังไง | Call Stack ทำงาน sync ให้หมดก่อน → ล้าง Microtask (Promise) → หยิบ Macrotask (timer, I/O) ทีละตัว; งาน CPU หนักบล็อกทุกคน |
| 3 | State กับ Props ต่างกันยังไง | Props = ข้อมูลจากแม่ อ่านอย่างเดียว; State = ความจำของ component เอง เปลี่ยนแล้ว re-render |
| 4 | useEffect ใช้เมื่อไร | ใช้ซิงก์กับของนอก React (subscription, timer, DOM API) เท่านั้น; ไม่ใช่ที่คำนวณค่า และต้องมี cleanup |
| 5 | ทำไมหน้าเว็บ React ช้า แก้ยังไง | วัดก่อนด้วย Profiler → หาว่า re-render เกินหรือ list ยาวหรือ bundle ใหญ่ → แก้ตรงจุด (memo, virtualization, code splitting) |
| 6 | Server Component กับ SSR ต่างกันยังไง | SSR = HTML สร้างเมื่อไร; Server Component = โค้ดรันที่ไหน และ JS ไป client เท่าไร — คนละแกน |
| 7 | Hydration Error เกิดจากอะไร | HTML ที่ server วาด ≠ client วาดรอบแรก เช่น ใช้เวลา/random/window ตอน render; แก้ให้ค่าเหมือนกันหรือย้ายไปหลัง mount |
| 8 | Node.js เป็น single thread แล้วรับคนเยอะได้ยังไง | JavaScript รันเธรดเดียว แต่ I/O ส่งให้ OS/libuv ทำ แล้ว callback กลับมา; เหมาะ I/O-bound ไม่เหมาะ CPU-bound |
| 9 | Authentication กับ Authorization ต่างกันยังไง | AuthN = คุณคือใคร (ผิด → 401); AuthZ = ทำอะไรได้ (ผิด → 403); อย่าลืม ownership check |
| 10 | Session กับ JWT เลือกยังไง | Session: server จำ revoke ง่าย ต้องมี shared store; JWT: stateless scale ง่าย revoke ยาก → access สั้น + refresh rotation |
| 11 | เก็บ password ยังไง | hash ด้วย bcrypt/argon2 + salt; ห้าม encrypt, ห้าม MD5/SHA ธรรมดา, ห้ามเขียน crypto เอง |
| 12 | XSS กับ CSRF ต่างกันยังไง ป้องกันยังไง | XSS = script แปลกปลอมรันในเว็บเรา → output encoding + CSP; CSRF = request ปลอมจากเว็บอื่นอาศัย cookie → SameSite + CSRF token |
| 13 | Index คืออะไร ใส่ทุก column ได้ไหม | สารบัญที่ทำให้หาเร็ว แต่ทุก write ต้องอัปเดต index ด้วย → ใส่ตาม query pattern จริง ดูจาก query plan |
| 14 | N+1 คืออะไร แก้ยังไง | ดึงแม่ 1 ครั้ง แล้ววนดึงลูกทีละแถว → แก้ด้วย JOIN / batch (IN) / eager loading; สังเกตจาก query เดิมซ้ำ ๆ ใน trace |
| 15 | Transaction กับ Race Condition | Transaction = ทั้งหมดหรือไม่เลย; race แก้ที่ DB ด้วย atomic update, pessimistic lock หรือ optimistic version ไม่ใช่ if ในโค้ด |
| 16 | ใช้ Cache ยังไง มีปัญหาอะไร | Cache Aside + TTL; ปัญหาหลักคือข้อมูลเก่า → เขียนแล้วลบ cache, และระวัง stampede ตอน key หมดอายุพร้อมกัน |
| 17 | ทำให้ระบบรองรับคนมากขึ้นยังไง | วัดหา bottleneck ก่อน → ทำ backend stateless → horizontal scale หลัง LB → cache/CDN ลดโหลด → queue งานที่ไม่ต้องรอ → ดู DB เป็นลำดับท้าย |
| 18 | Docker กับ Kubernetes ต่างกันยังไง | Docker = แพ็กและรัน container; Kubernetes = จัดการ container จำนวนมากข้ามเครื่อง (scale, self-heal, rolling update) |
| 19 | push bug ขึ้น production แล้วทำยังไง | หยุดเลือดก่อน (rollback/feature flag) → สื่อสารทีม → หา root cause → fix + regression test → postmortem แบบไม่โทษคน |
| 20 | API ช้า จะเริ่มดูจากตรงไหน | จำกัดขอบเขต (ทุก endpoint? ตั้งแต่เมื่อไร?) → แยกเวลาว่าหายที่ network / server / DB / dependency ด้วย trace → ตั้ง 3 สมมติฐาน → แก้ → alert ที่ p95 |

### 6.2 ⚖️ Top 10 Comparison Questions

| # | A vs B | จำสั้น ๆ |
|---|---|---|
| 1 | 401 vs 403 | ไม่รู้จักคุณ vs รู้จักแต่ไม่ให้เข้า |
| 2 | PUT vs PATCH | แทนทั้งก้อน vs แก้บางฟิลด์ |
| 3 | Session vs JWT | server จำ (revoke ง่าย) vs client ถือบัตร (scale ง่าย revoke ยาก) |
| 4 | SSR vs CSR | server วาดให้ (SEO ดี first paint เร็ว) vs browser วาดเอง (โต้ตอบลื่น แต่หน้าแรกรอ JS) |
| 5 | Server Component vs Client Component | ไม่ส่ง JS ไป browser เข้าถึง DB ได้ vs มี state/event ได้ แต่เพิ่ม bundle |
| 6 | SQL vs NoSQL | schema ชัด + relation + transaction vs โครงยืดหยุ่น + scale แนวนอนง่าย — เลือกตามรูปข้อมูลและการ query |
| 7 | Optimistic vs Pessimistic Lock | ชนน้อย → เช็ค version ตอนเขียน vs ชนบ่อย → ล็อกก่อนแก้ |
| 8 | Monolith vs Microservices | deploy เดียว debug ง่าย vs แยกทีม/scale อิสระ แต่แลกด้วยความซับซ้อนของ network และ data |
| 9 | Docker vs VM | แชร์ kernel เบาและเร็ว vs จำลองทั้งเครื่อง แยกขาดกว่าแต่หนักกว่า |
| 10 | Merge vs Rebase | เก็บประวัติตามจริงมี merge commit vs ประวัติเป็นเส้นตรง แต่ห้าม rebase branch ที่คนอื่นใช้ร่วม |

### 6.3 🐞 Top 10 Debugging Scenarios

| # | อาการ | ไล่ชั้นไหนก่อน |
|---|---|---|
| 1 | หน้าเว็บขาว (white screen) | Browser Console → error ตอน render / chunk โหลดไม่ขึ้น → Network tab ดูไฟล์ JS 404 หรือไม่ → Error Boundary |
| 2 | API ช้า | Trace แยกเวลา → จำนวน query ต่อ request (N+1) → query plan (index) → latency ของ dependency ภายนอก |
| 3 | ได้ 500 เฉพาะบาง user | Log ด้วย request ID ของ user นั้น → ข้อมูลของ user ผิดรูป (null, field หาย) → edge case ใน service |
| 4 | Login ผ่านแต่เรียก API แล้ว 401 | Network tab ดูว่าแนบ token/cookie ไหม → cookie flag (SameSite/Secure/domain) → token หมดอายุ/refresh flow |
| 5 | CORS error | Response header ของ preflight (OPTIONS) → origin/credentials ที่ server อนุญาต — ไม่ใช่แก้ที่ frontend |
| 6 | Local ได้ แต่ production พัง | ต่างกันตรงไหน: env variable / secret / build mode / version dependency / network policy |
| 7 | Hydration Error ใน Next.js | หาค่าที่ server กับ client ต่างกัน: เวลา, random, window/localStorage, locale |
| 8 | Memory โตเรื่อย ๆ จน Pod restart | Metric memory ต่อเวลา → heap snapshot → listener/timer/cache ที่ไม่มีวันถูกลบ |
| 9 | Pod CrashLoopBackOff | ดู log ของ container รอบก่อน → event ของ Pod (OOMKilled? probe fail?) → config/secret ที่ต้องใช้ตอน start |
| 10 | ข้อมูลซ้ำ / ตัดเงินสองครั้ง | race condition หรือ retry ไม่มี idempotency → ดู log ว่ามีสอง request จริงไหม → idempotency key + unique constraint |

### 6.4 🏛️ Top 10 Architecture Concepts

| # | Concept | จำสั้น ๆ |
|---|---|---|
| 1 | Layered Architecture | แบ่งชั้นตามหน้าที่ ชั้นบนเรียกชั้นล่างเท่านั้น |
| 2 | Controller → Service → Repository | HTTP / business rule / data access — เปลี่ยนชั้นหนึ่งไม่ต้องรื้ออีกชั้น |
| 3 | Separation of Concerns | แต่ละส่วนมีเหตุผลเดียวที่ต้องเปลี่ยน |
| 4 | SOLID | 5 หลักที่ทำให้ class เปลี่ยนง่ายโดยไม่พังคนอื่น (เน้น S และ D ในห้องสัมภาษณ์) |
| 5 | Coupling / Cohesion | ผูกกันน้อย / ของที่เกี่ยวกันอยู่ด้วยกัน — เป้าคือ low coupling, high cohesion |
| 6 | Dependency Injection | ส่งของที่ต้องใช้เข้ามาจากข้างนอก → สลับตัวจริง/ตัวปลอมตอนเทสต์ได้ |
| 7 | Clean Architecture | business rule อยู่กลาง ไม่รู้จัก framework/DB |
| 8 | DRY / KISS / YAGNI | ไม่ซ้ำ / เรียบง่าย / ยังไม่ต้องใช้อย่าเพิ่งทำ — ต้องชั่งกันเอง |
| 9 | Technical Debt | ทางลัดวันนี้ที่ต้องจ่ายดอกเบี้ยทีหลัง — บันทึกไว้และมีแผนจ่าย |
| 10 | Modular Monolith | ตึกเดียวแต่แบ่งห้องชัด — จุดเริ่มต้นที่ดีก่อนคิดแยก microservices |

### 6.5 🛡️ Top 10 Security Concepts

| # | Concept | จำสั้น ๆ |
|---|---|---|
| 1 | AuthN vs AuthZ | คุณคือใคร vs คุณทำอะไรได้ |
| 2 | Ownership Check | มี role ยังไม่พอ ต้องเช็คว่าข้อมูลนี้เป็นของคุณจริง |
| 3 | Password Hashing + Salt | bcrypt/argon2 + ค่าสุ่มต่อ user |
| 4 | Access + Refresh Token Rotation | บัตรสั้นใช้งาน บัตรยาวใช้ครั้งเดียว ใช้ซ้ำ = ยกเลิกทั้งชุด |
| 5 | HttpOnly / Secure / SameSite | JS อ่านไม่ได้ / ส่งเฉพาะ HTTPS / ไม่แนบข้ามเว็บ |
| 6 | XSS | แก้ที่ output encoding + CSP |
| 7 | CSRF | แก้ที่ SameSite + CSRF token |
| 8 | Injection | parameterized query + validate type |
| 9 | Rate Limiting | จำกัดครั้งต่อช่วงเวลา กัน brute force และกันระบบตัวเองล่ม |
| 10 | Secret Management + Least Privilege | secret ไม่อยู่ใน git แยกตาม env rotate เมื่อรั่ว / ให้สิทธิ์เท่าที่จำเป็น |

### 6.6 ⚛️ Top 10 React / Next.js Concepts

| # | Concept | จำสั้น ๆ |
|---|---|---|
| 1 | UI = f(state) | อยากให้จอเปลี่ยน ให้เปลี่ยนข้อมูล ไม่แก้ DOM เอง |
| 2 | Render vs Commit | render = คิด (ถูก) / commit = แก้ DOM จริง (แพงกว่า) |
| 3 | useEffect + Cleanup | ซิงก์กับโลกนอก ทุกอย่างที่เปิดต้องปิด |
| 4 | Key | ตัวตนของ item ใช้ id ไม่ใช่ index |
| 5 | Lifting State / Context | ยกความจำไปพ่อแม่ร่วม / ตู้กลางประจำตึก (ไม่มี selector → re-render ทั้งตึก) |
| 6 | Server State vs Client State | ข้อมูลจาก server ใช้ TanStack Query / UI state ใช้ useState หรือ store |
| 7 | useMemo / useCallback / React.memo | ใช้เมื่อวัดแล้วคุ้ม ใส่มั่วคือขาดทุน |
| 8 | CSR / SSR / SSG / ISR | แกน "เวลา" — HTML สร้างเมื่อไร |
| 9 | Server / Client Component | แกน "สถานที่" — "use client" = ส่งโค้ดไป browser ด้วย |
| 10 | Caching + Revalidation / NEXT_PUBLIC_ | จำผลแล้วล้างตามเวลาหรือเหตุการณ์ / ตัวแปรที่ขึ้นป้ายหน้าร้าน ห้ามใส่ secret |

### 6.7 ⚙️ Top 10 Backend Concepts

| # | Concept | จำสั้น ๆ |
|---|---|---|
| 1 | Request Lifecycle | request → middleware → route → controller → service → repository → response |
| 2 | Middleware + Central Error Handler | ด่านตรวจเรียงกัน + จุดรับ error ที่เดียว ไม่ส่ง stack trace ให้ผู้ใช้ |
| 3 | Validation | ตรวจ input ที่ขอบระบบเสมอ อย่าเชื่อ frontend |
| 4 | Event Loop Blocking | งาน CPU หนักใน Node.js ทำให้ทุก request รอ → ย้ายไป worker/queue |
| 5 | Stateless + Horizontal Scaling | ไม่จำอะไรในเครื่อง → เพิ่มเครื่องหลัง LB ได้ |
| 6 | Cache Aside + TTL | อ่าน: ถาม cache ก่อน / เขียน: ลบ cache / TTL เป็นตาข่าย |
| 7 | Queue + Worker | งานที่ผู้ใช้ไม่ต้องรอ (ส่งเมล สร้าง report) ย้ายไปหลังร้าน |
| 8 | Resilience ชุด 5 | Timeout → Retry → Backoff → Idempotency → Circuit Breaker |
| 9 | Idempotency | retry โดยไม่มี idempotency = เครื่องผลิตข้อมูลซ้ำ |
| 10 | Eventual Consistency | เดี๋ยวก็ตรงกัน ใช้กับยอด like ได้ ใช้กับยอดเงินไม่ได้ |

### 6.8 🗄️ Top 10 Database Concepts

| # | Concept | จำสั้น ๆ |
|---|---|---|
| 1 | Primary / Foreign Key | ฉันคือใคร / ฉันชี้ไปหาใคร |
| 2 | Relationship 1:N / N:M | ฝั่ง many ถือ FK / ต้องมีตารางกลาง |
| 3 | JOIN | ต่อตารางในคำถามเดียว แทนการวนดึงทีละแถว |
| 4 | Index + Query Plan | สารบัญ + ให้ DB บอกว่าจะหาข้อมูลยังไง (ระวัง Seq Scan บนตารางใหญ่) |
| 5 | N+1 | คูณจำนวน round-trip ไม่ใช่ query ตัวเดียวช้า |
| 6 | Offset vs Cursor Pagination | ลึกแล้วช้า/ข้อมูลซ้ำได้ vs เร็วคงที่แต่ข้ามหน้าไม่ได้ |
| 7 | Transaction + ACID | ทั้งก้อน / ไม่ผิดกฎ / ไม่แอบดู / ไม่คืนคำ |
| 8 | Race Condition + Lock | แก้ที่ DB: atomic update / pessimistic / optimistic version |
| 9 | Connection Pool | จำกัดจำนวน connection ที่เปิดค้าง — pool เต็ม = request รอคิว |
| 10 | Normalization / Replication | เก็บที่เดียวกันข้อมูลขัดแย้ง / ก๊อปไว้อ่าน มี lag และไม่ใช่ backup |

### 6.9 🐳 Top 10 Docker / Kubernetes Concepts

| # | Concept | จำสั้น ๆ |
|---|---|---|
| 1 | Image ≠ Container | แม่พิมพ์ที่อ่านอย่างเดียว / ตัวที่รันจริงจากแม่พิมพ์ |
| 2 | Dockerfile + Layer Cache | สูตรสร้าง image / ขั้นที่เปลี่ยนน้อยไว้บนสุดเพื่อ build เร็ว |
| 3 | Volume | ข้อมูลที่ต้องอยู่รอดเมื่อ container ถูกลบ |
| 4 | Port Mapping / Network | เปิดประตูจากเครื่องเข้า container / container คุยกันด้วยชื่อ service |
| 5 | Docker Compose | รันหลาย container พร้อมกันบนเครื่องเดียว (ใช้ตอน dev) |
| 6 | Pod / Deployment / ReplicaSet | หน่วยรัน / คนคุมเวอร์ชันและ rolling update / คนคุมจำนวน |
| 7 | Service / Ingress | ที่อยู่คงที่ภายใน cluster / ประตูหน้าบ้านจากอินเทอร์เน็ตตาม domain/path |
| 8 | ConfigMap / Secret | config ทั่วไป / ค่าลับ — แยกจาก image |
| 9 | Liveness / Readiness Probe | ไม่ตอบ → restart / ยังไม่พร้อม → ไม่ส่ง traffic ให้ |
| 10 | Self Healing / Auto Scaling / Rolling Update | รักษา desired state / เพิ่มลด Pod ตามโหลด / เปลี่ยนเวอร์ชันทีละส่วนและ rollback ได้ |

---

## 7. Compare

คู่เทียบหลักอยู่ในหัวข้อ 6.2 แล้ว ตรงนี้คือ **"สูตรตอบคำถาม A vs B"** ใช้ได้กับทุกคู่:

```
1. A คืออะไร (1 ประโยค)
      ↓
2. B คืออะไร (1 ประโยค)
      ↓
3. ต่างกันที่แกนไหน (เวลา / สถานที่ / ใครจำข้อมูล / ต้นทุน)
      ↓
4. "A เหมาะเมื่อ... / B เหมาะเมื่อ..."
      ↓
5. ในงานจริงผมเคยเลือก... เพราะ...
```

> **ให้มองภาพนี้ว่า** "ผู้สัมภาษณ์ไม่ได้ถามว่าตัวไหนชนะ เขาถามว่าคุณรู้ไหมว่าสนามไหนเหมาะกับนักกีฬาคนไหน"

| ประโยคที่ห้ามพูด | พูดแบบนี้แทน |
|---|---|
| "A ดีกว่า B" | "A ดีกว่าเมื่อ... แต่แลกด้วย..." |
| "ใช้ microservices เพราะ scale ได้" | "เริ่มที่ modular monolith แล้วแยกเฉพาะส่วนที่มีเหตุผลจริง" |
| "NoSQL เร็วกว่า SQL" | "ขึ้นกับรูปข้อมูลและรูปแบบ query" |

---

## 8. Common Mistakes

| Mistake ในห้องสัมภาษณ์ | ทำไมเสียคะแนน | ทำแบบนี้แทน |
|---|---|---|
| ตอบนิยามแล้วหยุด | ไม่เห็นว่าใช้งานจริงเป็น | นิยาม → ใช้เมื่อไร → ตัวอย่าง → trade-off |
| ตอบโจทย์ debug ด้วย "restart ดูก่อน" | ฟังเหมือนไม่มีกระบวนการ | "ถ้ากระทบผู้ใช้ ผมจะ rollback หยุดเลือดก่อน แล้วค่อยสืบ" |
| กระโดดไปคำตอบโดยไม่ถามขอบเขต | อาจตอบผิดโจทย์ทั้งข้อ | ถาม 2–3 คำถามจำกัดขอบเขตก่อน |
| แกล้งรู้ | ผู้สัมภาษณ์จับได้เสมอ และทำให้ไม่น่าเชื่อถือทั้งการสัมภาษณ์ | บอกตรง ๆ แล้วเดาอย่างมีเหตุผล (หัวข้อ 11) |
| พูดศัพท์เยอะแต่เชื่อมไม่ได้ | ดูเหมือนท่องมา | ผูกศัพท์กับชั้นใน Memory Map เสมอ |
| ไม่พูดถึง production | ดูเหมือนเขียนโค้ดแต่ไม่เคยดูแลระบบ | ปิดท้ายด้วย test + monitor + rollback |
| เงียบนานตอนคิด | ผู้สัมภาษณ์ไม่รู้ว่าคุณคิดอะไร | คิดออกเสียง "ขอคิดแบบนี้ก่อนนะครับ..." |

---

## 9. Debugging

ถ้าโจทย์ในห้องเป็นแนว "ระบบพัง ทำยังไง" ให้ไล่ตามลำดับนี้เสมอ (รายละเอียดดู PART 20):

| ลำดับ | ทำอะไร | พูดในห้องว่า |
|---|---|---|
| 1 | จำกัดขอบเขต | "ทุกคนหรือบางคน / ตั้งแต่เมื่อไร / เปลี่ยนอะไรไป" |
| 2 | หยุดเลือด (ถ้ากระทบผู้ใช้) | "rollback หรือปิด feature flag ก่อน" |
| 3 | Locate ชั้น | "ตัด frontend ออกด้วยการยิง API ตรง แล้วดู log/trace ฝั่ง server" |
| 4 | ตั้ง 3 สมมติฐาน | "น่าจะเป็น A, B หรือ C — พิสูจน์ A ด้วย..., B ด้วย..." |
| 5 | Root Cause + Fix | "แก้ที่ต้นเหตุ ไม่ใช่ที่อาการ" |
| 6 | ป้องกันซ้ำ | "เพิ่ม regression test + alert" |

```
อาการ
  ↓
อยู่ชั้นไหน? ── Browser ── Console / Network tab
  │
  ├── API ────── Status Code / Log ด้วย Request ID
  │
  ├── DB ─────── Query Plan / จำนวน Query / Lock / Pool
  │
  └── Infra ──── Pod Event / Probe / Resource / Config
```

> **ให้มองภาพนี้ว่า** "ป้ายแยกทางสี่ทาง — ก่อนเปิดโค้ดไฟล์แรก ต้องรู้ก่อนว่าจะเลี้ยวทางไหน"

---

## 10. Interview Questions

คำถามครบชุดอยู่ในหัวข้อ 6.1 และ PART 25 ตรงนี้คือตัวอย่าง **1 ข้อต่อระดับ** ให้รู้ว่าแต่ละระดับเขาคาดหวังความลึกแค่ไหน

| ระดับ | คำถาม | เขาอยากเห็นอะไร |
|---|---|---|
| 🟢 Junior | "401 กับ 403 ต่างกันยังไง" | นิยามถูก + ยกตัวอย่างได้ (ยังไม่ login vs login แล้วแต่ไม่ใช่ admin) |
| 🟡 Mid | "ผู้ใช้กดจ่ายเงินสองครั้ง แล้วถูกตัดเงินสองรอบ จะแก้ยังไง" | เห็นว่าเป็น idempotency + race condition, เสนอ idempotency key + unique constraint + ปิดปุ่มฝั่ง UI เป็นชั้นเสริม |
| 🔴 Senior | "ระบบโตขึ้น 10 เท่าใน 3 เดือน จะเตรียมยังไง" | วัด bottleneck ก่อน, เรียงลำดับการลงทุน, พูด trade-off และความเสี่ยงของแต่ละขั้น, มี observability ก่อน scale |

---

## 11. Answer Like a Developer

### ✅ "ก่อนเดินเข้าห้อง" Checklist

**สูตรตอบ 4 จังหวะ** (ใช้ได้กับเกือบทุกคำถาม technical)

```
1. นิยามสั้น          มันคืออะไร แบบที่ HR ฟังรู้เรื่อง (1 ประโยค)
      ↓
2. ทำไมมี             ปัญหาที่มันแก้ ถ้าไม่มีจะเกิดอะไร
      ↓
3. ตัวอย่างที่เคยใช้    "ตอนทำ ... ผมใช้เพื่อ ..."
      ↓
4. Trade-off          แลกอะไรไป / ต้องระวังอะไร / ถ้าพังจะ debug ยังไง
```

> **ให้มองภาพนี้ว่า** "บันไดสี่ขั้น — ผู้สัมภาษณ์จะหยุดคุณที่ขั้นไหนก็ได้ แต่ถ้าคุณขึ้นถึงขั้นที่ 4 เองโดยไม่ต้องถูกถาม นั่นคือสัญญาณของระดับ Mid ขึ้นไป"

**ถ้าไม่รู้ ให้พูดแบบนี้** (อย่าเงียบ อย่าแกล้งรู้)

| สถานการณ์ | ประโยคที่ใช้ได้ |
|---|---|
| ไม่รู้เลย | "เรื่องนี้ผมยังไม่เคยใช้จริงครับ แต่ถ้าให้เดาจากหลักการ ผมคิดว่าน่าจะ... เพราะ..." |
| รู้ครึ่งเดียว | "ส่วนที่ผมมั่นใจคือ... ส่วนที่ยังไม่แน่ใจคือ... ถ้าเจอในงานจริงผมจะไปยืนยันจาก documentation" |
| โจทย์กว้างเกินไป | "ขอถามขอบเขตก่อนนะครับ — ผู้ใช้ประมาณเท่าไร / ต้องการ real-time ไหม / อะไรสำคัญที่สุด" |
| ตอบผิดไปแล้วรู้ตัว | "ขอแก้คำตอบเมื่อกี้ครับ ผมคิดว่าที่ถูกคือ... เพราะ..." |
| ต้องการเวลาคิด | "ขอคิดออกเสียงนะครับ..." แล้วพูดขั้นตอนความคิดออกมา |

**คำถามที่ควรถามกลับ** (เลือก 2–3 ข้อ)

| ถาม | ทำไมถามข้อนี้ดี |
|---|---|
| "ทีมนี้ deploy ขึ้น production บ่อยแค่ไหน และมีขั้นตอน rollback ยังไง" | แสดงว่าคิดแบบ production |
| "ตอนเกิด incident ทีมรู้ตัวจากอะไร และมี postmortem ไหม" | ถาม observability + วัฒนธรรมทีม |
| "Code review ในทีมเป็นแบบไหน" | แสดงว่าสนใจคุณภาพและการเรียนรู้ |
| "Technical debt ที่ใหญ่ที่สุดของระบบตอนนี้คืออะไร" | ได้ข้อมูลจริงของงาน + ดูมีวุฒิภาวะ |
| "ช่วง 3 เดือนแรก คนในตำแหน่งนี้ควรทำอะไรให้สำเร็จ" | รู้ความคาดหวัง และแสดงว่าตั้งใจทำงานจริง |

**เช็กตัวเองสุดท้าย**

- [ ] อธิบาย request หนึ่งครั้งตั้งแต่ user ถึง database ได้ใน 1 นาที
- [ ] พูด Debugging Framework ได้ครบโดยไม่ดู
- [ ] มีเรื่องเล่าจากงาน/โปรเจกต์จริง 2 เรื่อง: เรื่องที่แก้บั๊กยาก และเรื่องที่ต้องเลือก trade-off
- [ ] เตรียมคำถามถามกลับไว้แล้ว 2–3 ข้อ
- [ ] น้ำ ปากกา กระดาษ (หรือเช็ก mic/กล้อง/เน็ต ถ้าสัมภาษณ์ออนไลน์)

---

## 12. One-Minute Review

- ทุกคำถามคือ "ชั้นไหนของ request" → ตอบจากชั้นนั้น แล้วเชื่อมชั้นข้างเคียง
- ตอบ 4 จังหวะ: นิยามสั้น → ทำไมมี → ตัวอย่างที่เคยใช้ → trade-off (ดู PART 25 หัวข้อ 11)
- A vs B: ไม่มีตัวชนะ มีแต่ "เหมาะเมื่อ..."
- Debug: Reproduce → Expected/Actual → Locate → Evidence → 3 Hypothesis → Test → Root Cause → Fix → Regression → Monitor
- Production: หยุดเลือดก่อน (rollback) แล้วค่อยหาต้นเหตุ
- Security: AuthN 401 / AuthZ 403, hash password, CORS ไม่ใช่ security ของ server
- React: UI = f(state), useEffect ต้อง cleanup, server state ≠ global state
- Next.js: Server Component ≠ SSR (สถานที่ vs เวลา)
- Backend: stateless ก่อน scale, retry ต้องมี idempotency
- Database: index แลก write, N+1 = คูณ round-trip, race แก้ที่ DB
- Docker/K8s: Image ≠ Container, K8s รักษา desired state
- ไม่รู้ = บอกตรง ๆ + เดาอย่างมีเหตุผล

---

## 13. Memory Card

### จำ 5 อย่าง

1. **ทุกคำถามคือชั้นหนึ่งของ request** — ระบุชั้นก่อน แล้วค่อยตอบ
2. **ตอบ 4 จังหวะ** — นิยามสั้น → ทำไมมี → ตัวอย่าง → trade-off
3. **ไม่มี "ดีกว่า" มีแต่ "ดีกว่าเมื่อ..."** — พูดราคาที่จ่ายทุกครั้ง
4. **Debug = ลดพื้นที่ค้นหา** — ถามขอบเขต → หยุดเลือด → หาหลักฐาน → 3 สมมติฐาน → ป้องกันซ้ำ
5. **ไม่รู้ ไม่ใช่จุดจบ** — ความซื่อตรงและวิธีคิดมีคะแนนมากกว่าคำตอบที่ท่องมา

### Keyword

**Keyword:**
**Stateless** → กุญแจของการ scale
**401 / 403** → ไม่รู้จัก / ไม่ให้เข้า
**Re-render** → คิดใหม่ ไม่ใช่แก้ DOM เสมอ
**Server Component** → สถานที่ ไม่ใช่เวลา
**JWT** → scale ง่าย revoke ยาก
**Index** → read เร็ว write ช้า
**N+1** → คูณ round-trip
**Cache** → เร็วขึ้นแต่ของค้างตู้ได้
**Idempotency** → กดซ้ำผลเดิม
**Kubernetes** → รักษา desired state
**Rollback** → หยุดเลือดก่อนเสมอ
**Monitor** → ถ้ามันกลับมา ต้องรู้ก่อนผู้ใช้

---

[← สารบัญ](./00-README-TOC.md)
