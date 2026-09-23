# PART 5 — NODE.JS

> ตำแหน่งในภาพใหญ่: Runtime Layer — เครื่องยนต์ที่รัน JavaScript ฝั่ง server อยู่ใต้ Express/Next.js และอยู่เหนือระบบปฏิบัติการ

---

## 1. Big Picture

ก่อนปี 2009 JavaScript มีบ้านอยู่ที่เดียวคือ **browser**
มันเกิดมาเพื่อทำให้หน้าเว็บขยับได้ ไม่ได้เกิดมาเพื่อเปิดไฟล์ ไม่ได้เกิดมาเพื่อเปิด network port ไม่ได้เกิดมาเพื่อคุยกับ database

**Node.js คือการเอาเครื่องยนต์ JavaScript ของ Chrome ออกมาจาก browser แล้วต่อ "มือและเท้า" ให้มันใหม่ เพื่อให้มันทำงานบนเครื่อง server ได้**

มือและเท้าที่ว่าคือความสามารถที่ browser ไม่เคยให้ JavaScript:

| ความสามารถที่ Node.js เพิ่มให้ | ตัวอย่างการใช้จริง |
|---|---|
| อ่าน/เขียนไฟล์ (File System) | อ่าน config, เขียน log, ประมวลผลไฟล์ที่ user upload |
| เปิด network socket / เปิด port | ทำตัวเป็น HTTP server รับ request |
| คุยกับ database | ต่อ PostgreSQL / MongoDB / Redis |
| อ่าน environment variable / เรียก OS | อ่าน config ตาม environment, spawn process ลูก |
| จัดการ process ตัวเอง | รู้ว่าใช้ memory เท่าไร, จับ signal ตอนถูกสั่งปิด |

พูดแบบ HR ฟังรู้เรื่อง:

> "Node.js คือสภาพแวดล้อมที่ทำให้ภาษา JavaScript ซึ่งเดิมรันได้แค่ในเบราว์เซอร์ ออกมารันบนเครื่อง server ได้ ทำให้ทีมเขียนทั้งหน้าบ้านและหลังบ้านด้วยภาษาเดียว"

### ⚠️ Node.js ≠ Programming Language

นี่คือคำถามดักที่เจอบ่อยที่สุดในการสัมภาษณ์ และ junior ตอบผิดเยอะที่สุด

**Node.js ไม่ใช่ภาษา** — ภาษาคือ JavaScript
**Node.js ไม่ใช่ framework** — framework คือ Express / NestJS / Fastify
**Node.js คือ Runtime Environment** — สภาพแวดล้อมที่รันภาษา JavaScript

เทียบให้เห็นภาพ:

| สิ่งที่คนสับสน | ความจริง | เทียบกับโลก Java |
|---|---|---|
| Node.js เป็นภาษา? | ❌ JavaScript คือภาษา | Java = ภาษา |
| Node.js เป็นอะไร? | ✅ Runtime | JVM = runtime |
| Express เป็นอะไร? | Framework บน runtime | Spring Boot = framework |
| V8 เป็นอะไร? | Engine ที่แปล JS เป็น machine code | JIT compiler ใน JVM |

> **ประโยคที่ควรจำไปตอบ:** "JavaScript คือภาษา, V8 คือ engine ที่รันภาษานั้น, Node.js คือ runtime ที่เอา V8 มาห่อแล้วเพิ่มความสามารถระดับระบบปฏิบัติการให้ — เหมือน Java เป็นภาษาแล้ว JVM เป็น runtime"

### Node.js อยู่ตรงไหนในภาพใหญ่

```
[ไฟล์ .js ที่เราเขียน]
        ↓
[NODE.JS RUNTIME]
   ├── V8 Engine        ← แปลและรัน JavaScript
   ├── libuv            ← Event Loop + Thread Pool + I/O
   └── Node C++ API     ← fs, net, crypto, http
        ↓
[OPERATING SYSTEM]
   ├── File System
   ├── Network Socket
   └── CPU / Memory
```

> **ให้มองภาพนี้ว่า** "Node.js คือล่ามและคนรับใช้ที่ยืนอยู่ระหว่าง code JavaScript ของเรากับระบบปฏิบัติการ — code เราไม่เคยคุยกับ OS ตรง ๆ เลยสักครั้ง"

### ทำไม Node.js ถึงดังขึ้นมา

ไม่ใช่เพราะมัน "เร็วกว่า" ภาษาอื่น (งานคำนวณหนัก Java/Go/Rust เร็วกว่าชัดเจน) แต่เพราะมันเก่งเรื่องหนึ่งมาก: **รับ connection จำนวนมากที่ส่วนใหญ่แค่นั่งรอ I/O** — web application ทั่วไปเสียเวลาส่วนใหญ่ไปกับการ "รอ" database, รอ API ปลายทาง, รอไฟล์ Node.js ออกแบบมาให้ "ระหว่างรอ ไปทำอย่างอื่นก่อน" ทำให้ 1 process รับได้หลายพัน connection โดยไม่ต้องมี thread ละ connection

นี่คือเหตุผลที่ต้องเข้าใจ **Event Loop, Non-blocking I/O, CPU-bound vs I/O-bound** ให้แม่น เพราะมันคือจุดแข็งและจุดตายของ Node.js พร้อมกัน

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Runtime** | สภาพแวดล้อมที่รัน code | ตัวที่ทำให้ภาษาทำงานได้จริงบนเครื่อง |
| **V8** | เครื่องยนต์แปล JS | Engine ของ Google ที่แปล JavaScript → machine code |
| **libuv** | ฝ่ายวิ่งงานนอก | C library ที่ให้ Event Loop + Thread Pool + async I/O |
| **Event Loop** | คิวเรียกคิว | วงวนที่คอยหยิบงานที่เสร็จแล้วกลับเข้ามารันใน JS |
| **Call Stack** | กองงานที่ทำอยู่ | กองซ้อนของ function ที่กำลังทำงาน (มีเส้นเดียว) |
| **Single-threaded** | มีมือทำ JS มือเดียว | JavaScript ของเรารันบน thread เดียว |
| **Non-blocking I/O** | สั่งแล้วไม่ยืนรอ | สั่งงาน I/O แล้วไปทำอย่างอื่นต่อ รอ callback |
| **Blocking** | ยืนรอจนเสร็จ | หยุดทุกอย่างจนกว่างานนี้จะจบ |
| **I/O-bound** | งานที่เสียเวลาไปกับการรอ | อ่านไฟล์, query DB, ยิง API |
| **CPU-bound** | งานที่เสียเวลาไปกับการคิด | encrypt, resize รูป, sort ข้อมูลล้านแถว |
| **Thread Pool** | ทีมงานสำรองของ libuv | กลุ่ม thread (default 4) ที่ทำงาน I/O บางชนิด + crypto |
| **Worker Thread** | ลูกจ้าง JS อีกคน | thread แยกที่รัน JavaScript ได้จริง ใช้กับงาน CPU หนัก |
| **Process** | โปรแกรมที่กำลังรัน 1 ตัว | มี memory ของตัวเอง ไม่แชร์กับ process อื่น |
| **Cluster** | หลาย process ร่วมพอร์ตเดียว | วิธี scale Node ให้ใช้ CPU ได้หลาย core |
| **Heap** | คลังเก็บ object | memory ที่ V8 ใช้เก็บ object/closure |
| **Garbage Collector (GC)** | คนเก็บของที่ไม่มีใครใช้ | คืน memory ของ object ที่ไม่มีใครอ้างถึงแล้ว |
| **Memory Leak** | ของที่ทิ้งไม่ลง | memory ที่ควรถูกคืนแต่ยังมีคนถืออ้างอิงไว้ |
| **Stream** | ท่อส่งข้อมูลทีละก้อน | อ่าน/เขียนข้อมูลเป็นชิ้น ๆ ไม่ต้องโหลดทั้งก้อน |
| **Buffer** | ถังเก็บ byte ดิบ | โครงสร้างเก็บข้อมูล binary นอก heap ของ V8 |
| **Backpressure** | สัญญาณ "ช้าลงหน่อย" | ตัวรับช้ากว่าตัวส่ง ต้องบอกให้ต้นทางหยุดชั่วคราว |
| **Environment Variable** | ค่าที่มาจากภายนอก code | config ที่เปลี่ยนตาม environment โดยไม่แก้ code |
| **npm** | ร้านขายของและคนติดตั้ง | package manager + registry ของ Node |
| **package.json** | ใบระบุรายการของโปรเจกต์ | ชื่อ, script, dependency, engine ของโปรเจกต์ |
| **lock file** | ใบเสร็จที่ระบุเวอร์ชันเป๊ะ | ล็อกเวอร์ชันจริงที่ติดตั้ง เพื่อให้ทุกเครื่องเหมือนกัน |
| **Semantic Versioning** | major.minor.patch | กติกาเลขเวอร์ชันที่บอกว่า upgrade แล้วพังไหม |
| **Event Loop Blocking** | มือเดียวติดงานเดียว | งาน sync หนักทำให้ทุก request ค้างพร้อมกัน |
| **Graceful Shutdown** | ปิดร้านแบบสุภาพ | ปิดรับงานใหม่ แต่ทำงานที่ค้างให้จบก่อนดับ |

---

## 3. Mental Model

ให้มอง Node.js เป็น **ร้านอาหารที่มีพ่อครัวเอกคนเดียว แต่มีเด็กวิ่งงานหลายคน**

### 3.1 JavaScript ของคุณมี "มือ" เดียวเสมอ

ทุกบรรทัด JavaScript ที่คุณเขียน รันบน thread เดียวที่เรียกว่า main thread
ถ้าบรรทัดใดบรรทัดหนึ่งใช้เวลา 3 วินาทีแบบ synchronous ทั้ง server หยุด 3 วินาที
ไม่ใช่แค่ request ของคนนั้น — **ทุก request ที่กำลังค้างอยู่หยุดหมด**

นี่คือประโยคที่ต้องท่องให้ขึ้นใจ:
> "Node.js ไม่ได้ single-threaded ทั้งหมด — แต่ **JavaScript ของเรา** รันบน thread เดียว"

### 3.2 Node.js ไม่ได้มี thread เดียว (คนละเรื่องกับข้อ 3.1)

เบื้องหลัง libuv มี **thread pool** และ OS ยังมี async I/O ของตัวเอง
งานอย่างอ่านไฟล์, hash password ด้วย bcrypt, บีบอัด gzip → ถูกส่งออกไปทำนอก main thread
สิ่งที่รันบน main thread คือ **callback ที่กลับมาหลังงานเสร็จ** เท่านั้น

ดังนั้นคำตอบที่ถูกคือ: **"Node.js เป็น single-threaded event loop ที่มี thread pool อยู่ข้างหลัง"**

### 3.3 Node เก่งเรื่อง "รอ" ไม่ได้เก่งเรื่อง "คิด"

| งานแบบ | Node.js จัดการยังไง | เหมาะไหม |
|---|---|---|
| รอ database / ไฟล์ / API ปลายทาง | ปล่อยให้ OS รอ ตัวเองไปทำ request อื่น | ✅ เหมาะมาก |
| คำนวณ loop 10 ล้านรอบ / resize รูป | ต้องใช้ main thread คิดเอง ทุกคนรอ | ❌ ไม่เหมาะ |

> ถ้าจะจำประโยคเดียวจาก chapter นี้: **Node.js เร็วเพราะมันไม่ยืนรอ ไม่ใช่เพราะมันคิดเลขเร็ว**

### 3.4 ทุกอย่างที่ช้าควรเป็น "ท่อ" ไม่ใช่ "ถัง"

ไฟล์ 2GB ถ้าอ่านทั้งก้อนเข้า memory = ถัง (process อาจตายเพราะ heap เต็ม)
ถ้าอ่านทีละ chunk แล้วส่งต่อ = ท่อ (Stream) — memory คงที่ไม่ว่าไฟล์ใหญ่แค่ไหน

Mental model นี้ใช้กับทุกอย่างใน Node: upload, download, export CSV, proxy, log

### 3.5 Process เดียวใช้ CPU ได้ core เดียว

เครื่อง server 8 core แต่รัน Node 1 process = ใช้ได้จริง 1 core
การ scale Node จึงไม่ใช่การเพิ่ม thread แต่คือ **เพิ่ม process** (cluster / PM2 / หลาย container)
นี่คือจุดที่ Node ต่างจาก Java/Spring Boot อย่างชัดเจน

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำหลัก:
Node.js = ร้านอาหารที่มีพ่อครัวเอก 1 คน + เด็กวิ่งงาน 4 คน

[พ่อครัวเอก]        = Main Thread (รัน JavaScript ของเรา)
[เด็กวิ่งงาน 4 คน]   = libuv Thread Pool
[ใบสั่งที่เสร็จแล้ว]  = Callback Queue
[หัวหน้าเสิร์ฟ]      = Event Loop

ลูกค้าสั่ง  →  พ่อครัวรับออร์เดอร์  →  ส่งเด็กวิ่งไปซื้อของ
                     ↓
              พ่อครัวไปรับออร์เดอร์คนถัดไปทันที (ไม่ยืนรอ)
                     ↓
              เด็กวิ่งกลับมา → หัวหน้าเสิร์ฟเอาใบสั่งวางหน้าพ่อครัว
                     ↓
              พ่อครัวทำต่อให้จบ
```

> **ให้มองภาพนี้ว่า** "พ่อครัวไม่เคยยืนรอเด็กวิ่งงาน เขารับออร์เดอร์ใหม่ไปเรื่อย ๆ และจะกลับมาทำจานเดิมก็ต่อเมื่อของมาถึงมือแล้ว"

### ภาพจำต่อยอด — ทำไม CPU-bound ถึงพัง

```
🧠 ภาพจำ:
งาน CPU หนัก = พ่อครัวตัดสินใจนั่งปอกมันฝรั่ง 500 หัวเอง

[พ่อครัวปอกมันฝรั่ง]
        ↓
ไม่มีใครรับออร์เดอร์ใหม่
        ↓
ไม่มีใครรับจานที่เด็กวิ่งงานเอากลับมา
        ↓
ลูกค้าทั้งร้านรอหมด (แม้แต่คนที่สั่งแค่น้ำเปล่า)
```

> **ให้มองภาพนี้ว่า** "เด็กวิ่งงานมีหลายคนก็จริง แต่มีพ่อครัวคนเดียว ถ้าพ่อครัวติดงานยาว ทั้งร้านหยุดพร้อมกัน"

### ภาพจำที่สาม — Stream vs อ่านทั้งก้อน

```
🧠 ภาพจำ:
อ่านทั้งก้อน = ตักน้ำใส่ถังให้เต็มก่อนค่อยยกไป → ถังใหญ่เกินแรงยก = หกทั้งถัง (OOM)
Stream      = ต่อสายยางแล้วปล่อยน้ำไหล      → 1 ลิตรหรือ 1,000 ลิตรก็ใช้แรงเท่ากัน
```

> **ให้มองภาพนี้ว่า** "Stream ไม่ได้ทำให้ข้อมูลน้อยลง แต่ทำให้เราไม่ต้องถือข้อมูลทั้งหมดไว้ในมือพร้อมกัน"

### ตารางแปลงภาพจำเป็นคำตอบสัมภาษณ์

| คำถาม | ตอบด้วยภาพร้านอาหาร |
|---|---|
| Node.js single-threaded จริงไหม | พ่อครัวคนเดียว แต่ร้านมีเด็กวิ่งงานหลายคน |
| ทำไม Node รับ 10,000 connection ได้ | พ่อครัวไม่เคยยืนรอ ใช้เวลาไปกับการรับออร์เดอร์อย่างเดียว |
| ทำไม CPU-bound ทำให้ทุก request ช้า | พ่อครัวนั่งปอกมันฝรั่ง ไม่มีใครรับออร์เดอร์ |
| Worker Thread / Cluster ต่างกันยังไง | Worker = จ้างพ่อครัวเพิ่มในครัวหลัง / Cluster = เปิดสาขาเพิ่มใต้ป้ายเดียวกัน |
| Stream คืออะไร | เสิร์ฟทีละจาน ไม่ต้องรอทำครบ 100 จานแล้วค่อยยกออกทีเดียว |

---

## 5. How It Works

### 5.1 สถาปัตยกรรม Node.js เต็มรูปแบบ

```
        [ CODE JAVASCRIPT ของเรา ]
                    │
                    ▼
        ┌───────────────────────┐
        │   NODE.JS RUNTIME     │
        │                       │
        │  ┌─────────────────┐  │
        │  │    V8 ENGINE    │  │  ← parse / compile / execute JS
        │  │  Call Stack     │  │  ← มีเส้นเดียว
        │  │  Heap (memory)  │  │  ← object ทั้งหมดอยู่ที่นี่
        │  └────────┬────────┘  │
        │           │ เรียกงานที่ JS ทำเองไม่ได้
        │           ▼            │
        │  ┌─────────────────┐  │
        │  │   NODE C++ API  │  │  ← fs, net, http, crypto, zlib
        │  └────────┬────────┘  │
        │           ▼            │
        │  ┌─────────────────┐  │
        │  │      LIBUV      │  │
        │  │  Event Loop     │  │  ← วนหยิบงานที่เสร็จกลับเข้า JS
        │  │  Thread Pool(4) │  │  ← fs, dns, crypto, zlib
        │  └────────┬────────┘  │
        └───────────┼───────────┘
                    ▼
        ┌───────────────────────┐
        │  OPERATING SYSTEM     │
        │  epoll / kqueue / IOCP│  ← network I/O ใช้ของ OS ตรง ๆ
        │  Disk / Network / CPU │
        └───────────────────────┘
```

> **ให้มองภาพนี้ว่า** "V8 คือสมองที่คิดเป็นภาษา JavaScript ส่วน libuv คือแขนขาที่ไปติดต่อโลกภายนอกแทน แล้วเอาผลลัพธ์กลับมาวางให้สมองคิดต่อ"

### 5.2 ชีวิตของ 1 request ใน Node.js server

```
[Client ยิง HTTP มา]
        ↓
[OS รับ connection → แจ้ง libuv]
        ↓
[Event Loop หยิบขึ้นมา → เรียก callback ใน JS]
        ↓
[Main Thread รัน handler ของเรา]
        ↓
   เจอ query DB (I/O)
        ↓
[ส่งงานออกไปให้ OS/thread pool → ปล่อยมือทันที]
        ↓
[Main Thread ไปรับ request คนอื่นต่อ]   ← จุดที่ Node เก่ง
        ↓
   DB ตอบกลับ → เข้า queue
        ↓
[Event Loop หยิบ callback กลับเข้า Main Thread]
        ↓
[ตอบ response]
```

> **ให้มองภาพนี้ว่า** "request หนึ่งไม่ได้ครอบครอง thread ตลอดเวลาที่มันมีชีวิต มันครอบครองเฉพาะช่วงที่ต้องใช้สมองคิดเท่านั้น"

### 5.3 ใครไปลง Thread Pool ใครไม่ลง — เรื่องที่คนเข้าใจผิดที่สุด

หลายคนคิดว่า "async ทั้งหมด = ใช้ thread pool" ซึ่ง **ไม่จริง**

| ประเภทงาน | ใครทำจริง | ใช้ thread pool ไหม |
|---|---|---|
| HTTP / TCP / socket | OS (epoll/kqueue/IOCP) | ❌ ไม่ใช้ |
| อ่าน/เขียนไฟล์ (fs) | libuv thread pool | ✅ ใช้ |
| DNS lookup (`dns.lookup`) | libuv thread pool | ✅ ใช้ |
| `crypto.pbkdf2` / bcrypt (async) | libuv thread pool | ✅ ใช้ |
| zlib (gzip async) | libuv thread pool | ✅ ใช้ |
| `JSON.parse` ก้อนใหญ่ | Main thread | ❌ บล็อก event loop |
| `for` loop คำนวณหนัก | Main thread | ❌ บล็อก event loop |

**ผลที่ตามมาในงานจริง:** thread pool default มีแค่ 4
ถ้าระบบคุณ hash password ด้วย bcrypt พร้อมกัน 8 request → 4 ตัวหลังต้องเข้าคิวรอ
นี่คือคอขวดที่มองไม่เห็นจาก CPU graph และเป็นคำตอบระดับ senior

### 5.4 ทำไมงาน CPU หนัก "บล็อกทุก request"

```
เวลา →

แบบ I/O (ดี):
Req A  [รับ]──ส่งไป DB──────────────[ตอบ]
Req B        [รับ]──ส่งไป DB────────────[ตอบ]
Req C              [รับ]──ส่งไป DB──────────[ตอบ]
Main   ███░░░░░░░███░░░░░░░███░░░░░░░███     (█ = ใช้ CPU, ░ = ว่าง)

แบบ CPU-bound (พัง):
Req A  [รับ]████████████████████[ตอบ]
Req B        [รอ.......................][เพิ่งได้เริ่ม]
Req C              [รอ.................][ยังไม่ได้เริ่มเลย]
Main   ████████████████████████████████     (ไม่ว่างเลย)
```

> **ให้มองภาพนี้ว่า** "งาน I/O ทำให้ main thread ว่างเป็นช่วง ๆ จนแทรกคนอื่นได้ แต่งาน CPU กินมือหลักยาวรวดเดียว ทุกคนที่มาทีหลังจึงต้องต่อคิวหลังมัน"

เหตุผลเชิงกลไก 3 ข้อที่ต้องพูดได้:

1. **Callback ของคนอื่นถูกดองในคิว** — event loop ไม่มีสิทธิ์ preempt (ขัดจังหวะ) function ที่กำลังรันอยู่
2. **Connection ใหม่ไม่ถูก accept** — เพราะ accept ก็คือ callback ที่ต้องรันบน main thread
3. **Health check ก็ค้างด้วย** — ทำให้ load balancer คิดว่า service ตาย แล้วถอดออกจากวง → traffic ไปกองที่ instance ที่เหลือ → ล้มเป็นโดมิโน

### 5.5 ทางออกของงาน CPU-bound

```
                      ┌── Worker Thread  → คำนวณในโปรเซสเดียวกัน แต่คนละ thread
CPU-bound task ───────┼── Child Process  → เรียกโปรแกรมอื่น (เช่น ffmpeg, sharp)
                      ├── Queue + Worker → โยนเข้า queue ให้ service อื่นทำ (ดี ที่สุดถ้างานยาว)
                      └── ภาษาอื่น/service อื่น → งานคำนวณหนักจริงอย่าง ML ให้ Python/Go ทำ
```

> **ให้มองภาพนี้ว่า** "หลักการเดียวกันทั้งหมดคือ ย้ายงานที่ต้องคิดนานออกจากมือที่ต้องคอยรับแขก"

| ทางออก | เหมาะเมื่อ | ข้อควรระวัง |
|---|---|---|
| Worker Thread | งานคิดหนักแต่สั้น และต้องตอบใน request เดียวกัน | สร้าง worker มีต้นทุน ควรทำเป็น pool |
| Child Process | ต้องเรียกเครื่องมือภายนอก | คุม memory/timeout ไม่งั้นเกิด zombie process |
| Queue + Worker | งานยาว เช่น export รายงาน, ส่งอีเมลหมื่นฉบับ | ต้องมีวิธีแจ้งผลกลับ (polling/webhook/websocket) |
| แยกเป็น service | งาน CPU เป็นแกนหลักของระบบ | เพิ่มความซับซ้อนของ infra |

### 5.6 Process / Cluster — scale Node ให้ใช้ CPU ครบทุก core

```
                         ┌── Worker Process 1 (core 1)
[Port 3000] → Primary ───┼── Worker Process 2 (core 2)
                         ├── Worker Process 3 (core 3)
                         └── Worker Process 4 (core 4)

แต่ละ process มี: V8 ของตัวเอง / heap ของตัวเอง / event loop ของตัวเอง
ไม่แชร์ตัวแปรกันเด็ดขาด
```

> **ให้มองภาพนี้ว่า** "การ scale Node คือการเปิดร้านสาขาเพิ่ม ไม่ใช่การจ้างพ่อครัวเพิ่มในครัวเดิม — และของในครัวแต่ละสาขาไม่ได้แชร์กัน"

ผลที่ตามมาซึ่งเป็นคำถามสัมภาษณ์บ่อย:

| สิ่งที่คนมักทำ | ทำไมพังเมื่อมีหลาย process |
|---|---|
| เก็บ session ใน memory | request ถัดไปอาจเข้า process อื่นที่ไม่รู้จัก session นี้ |
| cache ใน object ธรรมดา | cache ไม่ตรงกันระหว่าง process |
| rate limit นับใน memory | นับแยกกัน → limit จริงกลายเป็น N เท่า |
| cron job ตั้งใน app | job ถูกยิงซ้ำเท่าจำนวน process |

**ทางแก้เดียวกันทั้งหมด:** ย้าย state ออกไปไว้ที่ Redis / database — นี่คือความหมายของคำว่า **stateless application**

### 5.7 Memory ใน Node.js

```
[PROCESS MEMORY]
   ├── V8 Heap          ← object, string, closure ของเรา (มีลิมิต)
   │     ├── New Space   ← object เกิดใหม่ เก็บกวาดบ่อย เร็ว
   │     └── Old Space   ← object ที่อยู่รอด เก็บกวาดนาน ๆ ครั้ง แพง
   ├── Stack            ← ตัวแปร primitive / call frame
   └── External / Buffer ← ข้อมูล binary อยู่นอก heap
```

> **ให้มองภาพนี้ว่า** "Heap คือโต๊ะทำงานที่มีขนาดจำกัด ถ้าเราวางของแล้วไม่เคยเก็บ สุดท้ายไม่เหลือที่วางของใหม่ แล้ว process ก็ตาย"

**Garbage Collector เก็บอะไร:** object ที่ "ไม่มีใครอ้างถึงแล้ว" — ส่วน **Memory Leak** คือ object ที่เราไม่ใช้แล้วแต่ยังมีใครบางคนถืออ้างอิงไว้ GC จึงไม่กล้าเก็บ

### 5.8 Stream และ Backpressure

```
[Readable]  →  [Transform]  →  [Writable]
 อ่านไฟล์        gzip           ส่งออก response

ถ้าปลายทางช้า:
[Readable] --หยุดชั่วคราว-- [Writable บอกว่าเต็มแล้ว]
        (นี่คือ backpressure)
```

> **ให้มองภาพนี้ว่า** "Stream คือสายพานที่ปลายทางสามารถยกมือบอกต้นทางว่า 'ช้าลงหน่อย ฉันตามไม่ทัน' ได้"

Stream มี 4 ชนิดที่ต้องรู้จัก:

| ชนิด | หน้าที่ | ตัวอย่าง |
|---|---|---|
| Readable | แหล่งข้อมูลขาเข้า | อ่านไฟล์, request body |
| Writable | ปลายทางขาออก | เขียนไฟล์, response |
| Duplex | อ่านก็ได้เขียนก็ได้ | TCP socket |
| Transform | อ่าน-แปลง-เขียน | gzip, encrypt, แปลง CSV |

**Buffer** คือกล่องเก็บ byte ดิบที่ stream ส่งกันไปมา — มันอยู่ **นอก V8 heap** จึงไม่ถูกจำกัดด้วย heap limit เดียวกัน แต่ถ้าสะสมมากก็ทำให้ process ตายได้เหมือนกัน

### 5.9 npm และ package.json

```
package.json         → "ฉันอยากได้อะไรบ้าง" (ระบุช่วงเวอร์ชัน เช่น ^4.18.0)
       ↓ npm install
package-lock.json    → "ที่ติดตั้งจริงคือเวอร์ชันนี้เป๊ะ ๆ" (4.18.2 + ลูกหลานทั้งหมด)
       ↓
node_modules/        → ของจริงที่อยู่บนดิสก์
```

> **ให้มองภาพนี้ว่า** "package.json คือใบสั่งอาหาร ส่วน lock file คือใบเสร็จที่บอกว่าวันนั้นได้ของล็อตไหนมาจริง ๆ"

ส่วนสำคัญของ package.json ที่ต้องอธิบายได้:

| field | ความหมาย | จุดที่สัมภาษณ์ชอบถาม |
|---|---|---|
| `dependencies` | ของที่ต้องมีตอน runtime | express, pg |
| `devDependencies` | ของที่ใช้แค่ตอน dev/build | typescript, jest, eslint |
| `scripts` | คำสั่งย่อของโปรเจกต์ | `npm run build`, `npm start` |
| `engines` | ระบุเวอร์ชัน Node ที่รองรับ | กัน "เครื่องผมรันได้" |
| `type` | `commonjs` หรือ `module` | ตัวกำหนดว่าใช้ `require` หรือ `import` |

**Semantic Versioning** `MAJOR.MINOR.PATCH` — `4.18.2` = ตรงเป๊ะ (เสี่ยงต่ำสุดแต่ต้องอัปเดตเอง), `~4.18.2` = patch เท่านั้น, `^4.18.2` = minor + patch (default ของ npm), `*` / `latest` = อะไรก็ได้ — **ห้ามใช้ใน production**

**`npm install` vs `npm ci`** — คำถามยอดฮิตของสาย DevOps

| | `npm install` | `npm ci` |
|---|---|---|
| ใช้ที่ไหน | เครื่อง dev | CI/CD, Docker build |
| lock file | แก้ไขได้ถ้าจำเป็น | ต้องมีและต้องตรง ไม่งั้น fail |
| node_modules เดิม | ใช้ต่อ | ลบทิ้งแล้วติดตั้งใหม่ |
| ผลลัพธ์ | อาจต่างกันในแต่ละครั้ง | เหมือนเดิมทุกครั้ง (reproducible) |

### 5.10 Environment Variable

```
[OS / Container / CI Secret]
          ↓
   process.env.XXX
          ↓
   [Config Object ของแอป]   ← อ่านและ validate ที่เดียวตอน start
          ↓
   [ใช้ทั่วทั้งแอป]
```

> **ให้มองภาพนี้ว่า** "env คือของที่ยื่นเข้ามาจากข้างนอกตอนเปิดโปรแกรม ไม่ใช่ของที่ฝังอยู่ใน code — code ชุดเดียวจึงรันได้ทั้ง dev, staging และ production"

หลักปฏิบัติที่ต้องพูดได้: **ห้าม commit `.env` เข้า git** (ใส่ `.env.example` ที่มีแต่ชื่อ key แทน) / **อ่าน env ที่จุดเดียวตอน boot** แล้วแปลงเป็น config object ไม่ใช่โปรย `process.env` ทั่วโปรเจกต์ / **validate ตอน start** — ถ้า `DATABASE_URL` หายควรตายตั้งแต่ตอน start ไม่ใช่ตอน request แรกตอนตีสาม / ค่าใน `process.env` เป็น **string เสมอ** (`"false"` เป็น truthy) / production จริงควรใช้ **secret manager** ไม่ใช่ไฟล์ .env วางบนเครื่อง

---

## 6. Example

### 6.1 ระบบ export รายงานที่ทำ server ล่มทั้งตัว

**สถานการณ์:** ระบบ admin มีปุ่ม "Export ยอดขายทั้งปี" ใช้งานเดือนละครั้ง
วันสิ้นปีมีคนกด 3 คนพร้อมกัน แล้ว **ทั้งระบบ** ใช้ไม่ได้ 40 วินาที รวมถึงหน้า login ของลูกค้า

**สาเหตุ:**

```
[กด Export]
     ↓
[query ข้อมูล 800,000 แถวมาไว้ใน memory]   ← ถังไม่ใช่ท่อ
     ↓
[วน loop แปลงเป็น CSV ด้วย string concat]  ← CPU-bound บน main thread
     ↓
[ส่งกลับทั้งก้อน]
```

ผลกระทบสองชั้นพร้อมกัน: heap พุ่ง + event loop ถูกบล็อก
ลูกค้าที่แค่จะ login ก็โดนหางเลข เพราะ callback ของเขาต่อคิวอยู่หลัง loop นั้น

**วิธีแก้ที่ตอบสัมภาษณ์ได้:** (1) เปลี่ยน query เป็น **cursor/stream** อ่านทีละ chunk (2) ต่อ **Transform stream** แปลงเป็น CSV ทีละแถวแล้ว pipe ลง response (3) ถ้ายังหนัก ย้ายเป็น **background job** ผ่าน queue แล้วส่งลิงก์ดาวน์โหลดทางอีเมล (4) ใส่ **rate limit** เฉพาะ endpoint นี้

ผลลัพธ์: memory คงที่ไม่ว่าข้อมูลกี่แถว และ main thread ว่างพอจะรับ request อื่นระหว่างทาง

### 6.2 Login ช้าลงเรื่อย ๆ ตอนคนเยอะ ทั้งที่ CPU ไม่เต็ม

**อาการ:** ช่วง peak การ login ใช้เวลา 4 วินาที แต่ CPU usage แค่ 45% — database ไม่ช้า network ปกติ

**สาเหตุ:** `bcrypt` แบบ async ไปลง **libuv thread pool ที่มีแค่ 4 slot** พอมี 40 request พร้อมกัน → 36 ตัวต้องรอคิว CPU ไม่เต็มเพราะคอขวดคือ "จำนวนช่องบริการ" ไม่ใช่ "กำลังการคำนวณ"

**วิธีแก้:** เพิ่ม `UV_THREADPOOL_SIZE` ให้สอดคล้องกับจำนวน core (ไม่ใช่ตั้งสูงลิ่วมั่ว ๆ) / ปรับ cost factor ของ bcrypt ให้สมดุลระหว่างความปลอดภัยกับ latency / scale ด้วยหลาย process เพื่อให้มี thread pool หลายชุด / ถ้ายังไม่พอให้แยกการ hash ออกเป็น auth service

**ประเด็นที่ทำให้คำตอบนี้ดูเป็น senior:** คุณอธิบายได้ว่าทำไม metric CPU ถึงไม่ชี้ปัญหา

### 6.3 Memory ค่อย ๆ ขึ้นจนโดน restart ทุก 2 วัน

**อาการ:** กราฟ memory เป็นขั้นบันไดขึ้นเรื่อย ๆ ไม่เคยลง สุดท้าย container โดน OOM kill

**ผู้ต้องสงสัยประจำใน Node.js:**

| สาเหตุ | ทำไมถึงรั่ว |
|---|---|
| Cache ใน `Map` ที่ไม่มี TTL / ไม่มีลิมิต | ไม่มีใครลบ → โตตลอดกาล |
| `addEventListener` / `on()` แล้วไม่ `off()` | listener ถือ closure ค้าง |
| `setInterval` ที่ไม่เคย clear | callback ถือ scope ไว้ตลอด |
| ตัวแปร global ที่เก็บ log/array สะสม | ไม่มีวันถูก GC เพราะ root อ้างอยู่ |
| Connection ที่ไม่ปิด | socket + buffer ค้าง |
| Closure ที่จับ object ใหญ่ไว้โดยไม่ตั้งใจ | เก็บทั้งก้อนเพราะใช้แค่ field เดียว |

**วิธีไล่:** เก็บ heap snapshot 2 จุด (ห่างกัน ~1 ชม. ช่วงมี traffic) แล้ว **compare** ดูว่า object ชนิดไหนเพิ่มขึ้นและใครเป็นคนถืออ้างอิง (retainer)

### 6.4 ขึ้น production แล้วพัง แต่เครื่อง dev ปกติ

สาเหตุที่พบบ่อยที่สุด 3 อย่าง และทั้งหมดเกี่ยวกับ chapter นี้: **(1)** เวอร์ชัน Node ไม่ตรงกัน → แก้ด้วย `engines` + ระบุ base image ให้ชัด **(2)** `npm install` ที่ CI ได้ dependency ใหม่กว่าเครื่อง dev → แก้ด้วย `npm ci` + commit lock file **(3)** ลืม env var ตัวหนึ่ง → แก้ด้วยการ validate env ตอน start ให้แอป fail ทันทีพร้อมบอกว่าขาดตัวไหน

---

## 7. Compare

### 7.1 Node.js vs สิ่งที่คนสับสนด้วยบ่อยที่สุด

| | Node.js | JavaScript | V8 | Express |
|---|---|---|---|---|
| คืออะไร | Runtime | ภาษา | Engine | Framework |
| ทำอะไร | ให้ JS คุยกับ OS ได้ | ไวยากรณ์และกฎของภาษา | แปล JS เป็น machine code | จัด routing + middleware |
| อยู่ตรงไหน | ห่อ V8 อีกที | รันอยู่ใน runtime | อยู่ใน Node | อยู่บน Node |
| ไม่มีมันแล้วเป็นไง | JS รันได้แต่ใน browser | ไม่มีอะไรจะรัน | Node รัน JS ไม่ได้ | ต้องเขียน routing เอง |

### 7.2 CPU-bound vs I/O-bound

| | I/O-bound | CPU-bound |
|---|---|---|
| เวลาหมดไปกับ | การรอ | การคำนวณ |
| ตัวอย่าง | query DB, อ่านไฟล์, เรียก API | hash, resize รูป, sort ล้านแถว, JSON ก้อนใหญ่ |
| Node.js เหมาะไหม | ✅ เหมาะมาก | ❌ ต้องออกแบบพิเศษ |
| อาการเมื่อโหลดสูง | latency ค่อย ๆ เพิ่ม | ทุก request ค้างพร้อมกัน |
| วิธีแก้ | เพิ่ม connection / เพิ่ม instance | worker thread / queue / แยก service |
| ตัวชี้วัดที่ควรดู | จำนวน connection, DB latency | event loop lag, CPU |

### 7.3 Single Thread / Thread Pool / Worker Thread / Cluster

| | Main Thread | libuv Thread Pool | Worker Thread | Cluster (หลาย Process) |
|---|---|---|---|---|
| รัน JavaScript ได้ไหม | ✅ | ❌ (C++ งาน I/O) | ✅ | ✅ |
| มีกี่ตัว | 1 | default 4 | เราสร้างเอง | ตามจำนวน core |
| แชร์ memory ไหม | — | — | แชร์ได้ผ่าน SharedArrayBuffer | ❌ ไม่แชร์เลย |
| ใช้กับงานอะไร | ทุกอย่างที่เป็น JS | fs, dns, crypto, zlib | CPU-bound ใน process เดียว | scale ให้ใช้ CPU ครบ core |
| ต้นทุน | — | มีอยู่แล้ว | ปานกลาง (สร้าง context ใหม่) | สูง (memory × N) |

### 7.4 Stream vs Buffer (อ่านทั้งก้อน)

| | อ่านทั้งก้อน (`readFile`) | Stream |
|---|---|---|
| Memory ที่ใช้ | เท่ากับขนาดข้อมูล | คงที่ (ขนาด chunk) |
| เริ่มส่งข้อมูลได้เมื่อ | อ่านครบทั้งหมดแล้ว | ได้ chunk แรก |
| เหมาะกับ | ไฟล์เล็ก เช่น config | ไฟล์ใหญ่, upload, proxy, export |
| ความซับซ้อนของ code | ต่ำ | สูงกว่า (ต้องจัดการ error/backpressure) |
| ความเสี่ยง | OOM ถ้าไฟล์ใหญ่ | ลืม handle error แล้ว stream ค้าง |

### 7.5 Node.js vs Java(Spring) vs Python — ในมุมโมเดลการทำงาน

| | Node.js | Java / Spring Boot | Python (sync) |
|---|---|---|---|
| โมเดลหลัก | Event loop + non-blocking | Thread ต่อ request (แบบดั้งเดิม) | Process/thread + GIL |
| เหมาะกับ | I/O เยอะ, real-time, API gateway | ระบบใหญ่, งานคำนวณ, enterprise | data, ML, script, API ทั่วไป |
| งาน CPU หนัก | ต้องย้ายออกจาก main thread | รับได้ดี (thread จริงหลายตัว) | ติด GIL ต้องใช้ multiprocessing |
| ใช้ CPU หลาย core | ต้องหลาย process | ได้ในตัว | ต้อง multiprocessing |
| จุดตาย | 1 บรรทัดหนัก ๆ ล้มทั้ง process | memory ต่อ thread, startup ช้ากว่า | GIL |

> อย่าตอบว่าตัวไหน "ดีกว่า" — ให้ตอบว่า **"Node เหมาะเมื่องานส่วนใหญ่เป็นการรอ I/O และทีมอยากใช้ภาษาเดียวทั้ง stack; ไม่เหมาะเมื่อแกนของระบบคือการคำนวณหนัก"**

### 7.6 CommonJS vs ES Module

| | CommonJS | ES Module |
|---|---|---|
| คำสั่ง | `require()` / `module.exports` | `import` / `export` |
| ตอนโหลด | runtime | static (วิเคราะห์ได้ก่อนรัน) |
| ตั้งค่า | default เดิมของ Node | `"type": "module"` หรือ `.mjs` |
| ข้อดี / ปัญหา | ecosystem เก่ารองรับหมด แต่ tree-shake ไม่ได้ | tree-shake ได้ แต่ผสมกับ CJS แล้วงอแง |

---

## 8. Common Mistakes

| ❌ ความเข้าใจผิด | ✅ ความจริง |
|---|---|
| "Node.js เป็นภาษาโปรแกรม" | เป็น runtime — ภาษาคือ JavaScript |
| "Node.js เร็วกว่า Java" | เร็วกว่าเฉพาะบางบริบท (I/O เยอะ) งานคำนวณช้ากว่าชัดเจน |
| "Node.js เป็น single thread ทั้งหมด" | JS ของเรา thread เดียว แต่ libuv มี thread pool ข้างหลัง |
| "ใส่ `async` แล้วงานจะไม่บล็อก" | `async` ไม่ทำให้ CPU-bound หายไป — loop 10 ล้านรอบใน async function ก็ยังบล็อก |
| "ใช้ `await` = ทำงานพร้อมกัน" | `await` ในลูปคือทำทีละตัว ถ้าต้องการพร้อมกันต้อง `Promise.all` |
| "ไฟล์เล็กอยู่แล้ว ใช้ readFile ได้" | ขนาดไฟล์ใน production ไม่เท่ากับเครื่อง dev เสมอ |
| "เก็บ cache ใน object ก็พอ" | พอมีหลาย process/container cache จะไม่ตรงกัน |
| "Memory ขึ้นเรื่อย ๆ = leak แน่นอน / restart ทุกคืนก็จบ" | อาจเป็นแค่ GC ยังไม่ทำงาน ต้องดูว่า **หลัง GC** ยังสูงไหม; restart แก้อาการไม่ได้แก้เหตุ |
| "`process.env` เอาไว้ใช้ตรงไหนก็ได้" | ควรอ่านและ validate ที่เดียวตอน start; ค่าเป็น string เสมอ |
| "commit .env ไว้จะได้ไม่หาย" | นี่คือช่องทางหลุด secret ที่พบบ่อยที่สุด |
| "`npm install` ใน CI ก็เหมือนกัน" | ควรใช้ `npm ci`; และห้ามลบ lock file ทิ้งเพราะ conflict |
| "`^` ปลอดภัย เพราะเป็น minor" | minor ก็ทำ breaking change ได้ในทางปฏิบัติ |
| "try/catch ครอบไว้ก็จับ error ได้ทุกแบบ" | error ใน callback แบบเก่าและ unhandled rejection ไม่เข้ามาใน try/catch นั้น |
| "Worker thread แชร์ตัวแปรกับ main ได้" | ไม่แชร์ scope — ส่งข้อมูลผ่าน message เท่านั้น (ยกเว้น SharedArrayBuffer) |
| "เพิ่ม `UV_THREADPOOL_SIZE` เยอะ ๆ ยิ่งเร็ว" | เกินจำนวน core จริงจะทำให้เกิด context switch เสียเปล่า |
| "process ตายก็ให้ PM2 restart จบ" | ต้องมี graceful shutdown ไม่งั้น request ที่ค้างจะถูกตัดกลางคัน |

---

## 9. Debugging

### 9.1 ลำดับการไล่ปัญหา "Node.js ช้า"

```
[1] ช้าที่ไหน — ทุก endpoint หรือบาง endpoint?
        ↓ ทุก endpoint พร้อมกัน = สงสัย event loop blocking
        ↓ เฉพาะบาง endpoint  = สงสัย DB / API ปลายทาง
[2] วัด Event Loop Lag
        ↓ lag สูง (หลายร้อย ms ขึ้นไป) = มีงาน sync หนัก
[3] ดู CPU
        ↓ CPU เต็ม + lag สูง = CPU-bound จริง
        ↓ CPU ไม่เต็ม + ช้า  = คอขวดอยู่ที่คิว (thread pool / connection pool)
[4] ดู Memory
        ↓ ขึ้นเรื่อย ๆ ไม่ลง = สงสัย leak
        ↓ GC ทำงานถี่มาก = heap ตึง ทำให้ช้าไปด้วย
[5] ดู Connection Pool ของ DB
        ↓ pool เต็ม = request ต่อคิวรอ connection
[6] ถ้ายังไม่เจอ → CPU profile หา function ที่กินเวลาสูงสุด
```

> **ให้มองภาพนี้ว่า** "การไล่ปัญหา Node เริ่มจากคำถามเดียวว่า 'ช้าทุกคนพร้อมกัน หรือช้าเฉพาะบางเส้นทาง' เพราะสองคำตอบนี้พาไปคนละทางเลย"

### 9.2 ตารางอาการ → สาเหตุที่ควรสงสัยก่อน

| อาการ | สงสัยอะไรก่อน | ตรวจยังไง |
|---|---|---|
| ทุก endpoint ช้าพร้อมกันเป็นช่วง ๆ | Event loop blocking | วัด event loop lag, CPU profile |
| ช้าเฉพาะตอนคนเยอะ แต่ CPU ไม่เต็ม | thread pool / connection pool เต็ม | ดูจำนวน connection, เวลารอ pool |
| Memory ขึ้นเรื่อย ๆ ไม่ลง | Memory leak | heap snapshot 2 จุดแล้ว compare |
| Process ตายเงียบ ๆ | OOM kill | ดู exit code / dmesg / event ของ container |
| `req.body` เป็น undefined | ลำดับ middleware | ตรวจว่า body parser อยู่ก่อน route |
| ทำงานได้บนเครื่อง dev แต่ prod พัง | Node version / env / lock file | เทียบ `node -v`, ตรวจ env, ใช้ `npm ci` |
| CPU 100% ตัวเดียวทั้งที่มี 8 core | มี process เดียว | ใช้ cluster / เพิ่ม replica |
| ข้อมูลไม่ตรงกันแบบสุ่ม | มีหลาย process แต่เก็บ state ใน memory | ย้าย state ไป Redis |
| Log หายตอน container ถูกปิด | ไม่มี graceful shutdown | จับ SIGTERM แล้วปิดให้เรียบร้อย |

### 9.3 เครื่องมือที่ควรพูดถึงได้ในห้องสัมภาษณ์

| เครื่องมือ | ใช้ตอบคำถามว่า |
|---|---|
| `node --inspect` + Chrome DevTools | "function ไหนกินเวลา / memory อยู่ที่ไหน" |
| Heap snapshot (compare 2 จุด) | "object ชนิดไหนเพิ่มขึ้นและใครถือมันไว้" |
| CPU profile / flame graph | "เวลาหมดไปกับ function ไหน" |
| Event loop lag metric | "event loop ถูกบล็อกอยู่ไหม" |
| `process.memoryUsage()` | "heap used / rss / external ตอนนี้เท่าไร" |
| APM / tracing + request id | "เวลาหมดไปที่ service ไหน และ log ไหนเป็นของ request เดียวกัน" |
| Load test (autocannon) | "ระบบเริ่มพังที่ throughput เท่าไร" |

### 9.4 Graceful Shutdown — สิ่งที่ junior ไม่ค่อยรู้

```
[Container/K8s ส่ง SIGTERM]
        ↓
[หยุดรับ connection ใหม่]
        ↓
[ปล่อยให้ request ที่ค้างอยู่ทำจนเสร็จ (มี timeout)]
        ↓
[ปิด DB pool / flush log / ปิด queue consumer]
        ↓
[process.exit(0)]
```

> **ให้มองภาพนี้ว่า** "การปิด service ที่ดีคือการปิดประตูหน้าร้านก่อน แล้วค่อยเสิร์ฟลูกค้าที่นั่งอยู่ให้เสร็จ ไม่ใช่ดับไฟทั้งร้านทันที"

ถ้าไม่ทำสิ่งนี้ ทุกครั้งที่ deploy จะมี request ที่ถูกตัดกลางคัน — และมันจะแสดงเป็น error 502 ที่หาสาเหตุไม่เจอ

---

## 10. Interview Questions

### 🟢 Junior

1. Node.js คืออะไร และทำไมถึงบอกว่ามันไม่ใช่ภาษาโปรแกรม
2. V8 คืออะไร เกี่ยวข้องกับ Node.js ยังไง
3. Node.js เป็น single-threaded จริงไหม อธิบาย
4. Blocking กับ Non-blocking ต่างกันยังไง ยกตัวอย่าง
5. I/O-bound กับ CPU-bound ต่างกันยังไง อย่างละ 2 ตัวอย่าง
6. `package.json` กับ `package-lock.json` ต่างกันยังไง ทำไมต้อง commit lock file
7. `dependencies` กับ `devDependencies` ต่างกันยังไง
8. Environment Variable คืออะไร ใช้ทำไม และทำไมห้าม commit ไฟล์ `.env`
9. Stream คืออะไร ทำไมอ่านไฟล์ใหญ่ ๆ ไม่ควรใช้ `readFile` และ Buffer ต่างจาก string ยังไง

### 🟡 Mid

11. อธิบายสถาปัตยกรรม Node.js ตั้งแต่ code JS ไปจนถึง OS
12. libuv ทำหน้าที่อะไรบ้าง
13. งานแบบไหนไปลง thread pool และแบบไหนไม่ลง ยกตัวอย่าง
14. ทำไมงาน CPU หนักบน main thread ทำให้ **ทุก** request ช้า ไม่ใช่แค่ request นั้น
15. ถ้าต้อง resize รูปใน Node.js จะออกแบบยังไงไม่ให้กระทบ request อื่น
16. Worker Thread ต่างจาก Child Process ยังไง เลือกใช้ตัวไหนเมื่อไร
17. Node.js ใช้ CPU หลาย core ได้ยังไง และมีผลอะไรกับการเก็บ session/cache
18. Memory Leak ใน Node.js เกิดจากอะไรได้บ้าง ยกตัวอย่าง 3 แบบ
19. Backpressure คืออะไร ถ้าไม่จัดการจะเกิดอะไรขึ้น
20. `npm install` กับ `npm ci` ต่างกันยังไง และ `^1.2.3` กับ `~1.2.3` เสี่ยงต่างกันยังไง
21. ถ้าแอปช้าแต่ CPU ไม่เต็ม คุณจะสงสัยอะไรบ้าง
22. CommonJS กับ ES Module ต่างกันยังไง

### 🔴 Senior

23. จะวัดและ monitor "event loop lag" ยังไง และค่าเท่าไรถือว่าเป็นปัญหาในบริบทของระบบคุณ
24. ระบบมี endpoint ที่ทำ CPU หนักจนทั้ง service ล่มเป็นระยะ ออกแบบทางแก้ตั้งแต่ระดับ code ถึง architecture
25. จะออกแบบ Node.js service ให้ scale แนวนอนได้ยังไง มีอะไรที่ต้องย้ายออกจาก process บ้าง
26. เจอ memory leak ใน production ที่ reproduce บนเครื่อง dev ไม่ได้ จะไล่ยังไงโดยไม่ทำให้ระบบล่ม
27. ออกแบบ graceful shutdown สำหรับ Node service ที่มีทั้ง HTTP และ queue consumer
28. ทีมจะอัปเกรด Node.js major version — วางแผนยังไงให้เสี่ยงน้อยที่สุด
29. Supply chain attack ผ่าน npm package เสี่ยงยังไง และป้องกันยังไงในระดับทีม
30. เมื่อไรควรเลือก Node.js สำหรับ service ใหม่ และเมื่อไรควรเลือกภาษาอื่น
31. `UV_THREADPOOL_SIZE` ควรตั้งเท่าไร และทำไมตั้งสูงมาก ๆ ไม่ได้ช่วยเสมอไป
32. ออกแบบระบบอัปโหลดไฟล์ 2GB ผ่าน Node.js ยังไงไม่ให้ memory ระเบิด และ secret ควรเข้าสู่ process ยังไงใน production

---

## 11. Answer Like a Developer

### โครงการตอบที่ใช้ได้กับเกือบทุกคำถาม Node.js

```
[1] นิยามสั้น 1 ประโยค
      ↓
[2] บอกกลไกเบื้องหลัง (V8 / libuv / event loop / process)
      ↓
[3] บอกผลกระทบต่อระบบจริง
      ↓
[4] ยกตัวอย่างจากงานที่เคยเจอ
      ↓
[5] บอก trade-off หรือขอบเขตที่ใช้ไม่ได้
```

> **ให้มองภาพนี้ว่า** "interviewer ไม่ได้อยากรู้ว่าคุณท่องนิยามได้ เขาอยากรู้ว่าคุณเคยเจอผลของมันจริงหรือเปล่า"

### ตัวอย่าง — "Node.js คืออะไร"

**อย่าตอบว่า:** "Node.js คือ JavaScript ฝั่ง server ครับ" (จบแค่นี้ = ได้คะแนนระดับ junior พอดี)

**ตอบแบบนี้:**

1. **นิยาม** — "Node.js คือ runtime ที่เอา V8 engine ของ Chrome มาห่อ แล้วเพิ่มความสามารถระดับ OS ให้ JavaScript เช่น อ่านไฟล์และเปิด network"
2. **กลไก** — "ข้างในมี V8 รัน JS บน thread เดียว และมี libuv ที่ให้ event loop กับ thread pool สำหรับงาน I/O"
3. **ผลต่อระบบ** — "โมเดลนี้ทำให้ 1 process รับ connection ที่รอ I/O ได้มากโดยไม่ต้องมี thread ต่อ connection"
4. **ตัวอย่าง** — "ระบบที่ผมทำเป็น API gateway ที่ส่วนใหญ่รอ service ปลายทาง Node จึงเหมาะมาก"
5. **trade-off** — "แต่ถ้ามีงานคำนวณหนัก ต้องย้ายออกไป worker thread หรือ queue ไม่งั้นบล็อกทุก request"

### ตัวอย่าง — "ทำไมงาน CPU หนักถึงกระทบทุก request"

ตอบเป็นเหตุเป็นผล ไม่ใช่ท่องว่า "เพราะ single thread":

> "เพราะ JavaScript ของเรารันบน thread เดียว และ event loop ไม่มีสิทธิ์ขัดจังหวะ function ที่กำลังทำงานอยู่ ตราบใดที่ function นั้นยังไม่คืนมือให้ event loop ทุก callback ที่พร้อมแล้วก็ต้องรอในคิว ผลคือ request ที่ทำแค่ query เบา ๆ ก็ช้าตามไปด้วย และที่อันตรายกว่านั้นคือ health check ก็ค้าง ทำให้ load balancer เข้าใจว่า instance ตายแล้วถอดออก traffic จึงไปกองที่ instance ที่เหลือจนล้มต่อกันเป็นโดมิโน"

ประโยคสุดท้ายคือสิ่งที่แยก mid ออกจาก junior — **การเชื่อม runtime เข้ากับ infrastructure**

### ประโยคที่ควรพูดและไม่ควรพูด

| ❌ อย่าพูด | ✅ พูดแบบนี้แทน |
|---|---|
| "Node.js เร็วเพราะ non-blocking" | "Node เร็วในงาน I/O เพราะไม่ถือ thread ไว้ระหว่างรอ — งานคำนวณกลับเป็นจุดอ่อน" |
| "ผมใช้ Node เป็น" | "ผมออกแบบ Node service ให้ scale แนวนอนและไม่บล็อก event loop ได้" |
| "Memory leak ผม restart เอา" | "ผมเก็บ heap snapshot เทียบสองช่วงเพื่อหา retainer ก่อน แล้วค่อยแก้ที่ต้นเหตุ" |
| "ไฟล์ไม่ใหญ่ ใช้ readFile ก็ได้" | "ผมใช้ stream เป็นค่าเริ่มต้นสำหรับข้อมูลที่ขนาดโตตามผู้ใช้" |
| "npm install ก็พอ" | "บนเครื่อง dev ใช้ install แต่บน CI ใช้ `npm ci` เพื่อให้ build เหมือนเดิมทุกครั้ง" |
| "ผมเก็บ session ไว้ใน memory" | "ผมเก็บ session ไว้นอก process เพราะ production มีหลาย instance" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้องสัมภาษณ์:

- **Node.js = Runtime ไม่ใช่ภาษา** — ภาษาคือ JavaScript, engine คือ V8, framework คือ Express
- โครงสร้าง: **JS → V8 → Node C++ API → libuv → OS**
- **JavaScript ของเรารันบน thread เดียว** แต่ libuv มี **thread pool (default 4)** อยู่ข้างหลัง
- network I/O ใช้ async ของ OS ตรง ๆ **ไม่กิน thread pool**; ส่วน **fs, dns, crypto, zlib กิน thread pool**
- **Node เก่งงานรอ (I/O-bound) ไม่เก่งงานคิด (CPU-bound)**
- งาน CPU หนักบน main thread = **ทุก request ค้าง** รวมถึง health check → load balancer ถอด instance → ล้มโดมิโน
- ทางแก้ CPU-bound: **Worker Thread / Child Process / Queue + Worker / แยก service**
- **1 process = 1 core** → scale ด้วย **cluster หรือหลาย container** ไม่ใช่เพิ่ม thread; และเมื่อมีหลาย process **ห้ามเก็บ state ใน memory** (session, cache, rate limit, cron) → ย้ายไป Redis/DB
- **Stream = ท่อ, readFile = ถัง** — ข้อมูลที่โตตามผู้ใช้ให้ใช้ stream เสมอ; **Backpressure** คือปลายทางบอกต้นทางให้ช้าลง; **Buffer** = byte ดิบนอก V8 heap
- **Memory leak** = ของที่ไม่ใช้แล้วแต่ยังมีคนถืออ้างอิง (cache ไม่มี TTL, listener ไม่ถูกลบ, `setInterval` ไม่ clear, global array) → ไล่ด้วย **heap snapshot 2 จุดแล้ว compare** ไม่ใช่เดา
- **env var** อ่านและ validate ที่เดียวตอน start, ค่าเป็น string เสมอ, ห้าม commit `.env`
- **package.json = ใบสั่ง, lock file = ใบเสร็จ**; CI ใช้ **`npm ci`**; `^` = minor+patch, `~` = patch อย่างเดียว, `latest` = ห้ามใน production
- **Graceful shutdown**: SIGTERM → หยุดรับใหม่ → ทำของค้างให้จบ → ปิด pool → exit
- ตัวชี้วัดที่ต้องมีสำหรับ Node: **event loop lag, heap used, RSS, CPU, จำนวน connection**

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **Node.js = Runtime ไม่ใช่ภาษา** — JavaScript คือภาษา, V8 คือ engine, libuv คือแขนขา, Express คือ framework
2. **พ่อครัวคนเดียว + เด็กวิ่งงาน 4 คน** — JS thread เดียว แต่มี thread pool ของ libuv อยู่ข้างหลัง
3. **Node เก่งเรื่องรอ ไม่เก่งเรื่องคิด** — I/O-bound ✅ / CPU-bound ต้องย้ายออกเป็น worker หรือ queue
4. **งาน CPU หนัก 1 จุด ล้มทั้ง process** — เพราะ event loop ขัดจังหวะ function ที่รันอยู่ไม่ได้ แม้แต่ health check ก็ค้าง
5. **Scale Node = เพิ่ม process ไม่ใช่เพิ่ม thread** — และเมื่อมีหลาย process ต้องเอา state ออกไปไว้ข้างนอก

### Keyword สั้น

**Runtime** → สภาพแวดล้อมที่รันภาษา
**V8** → เครื่องยนต์แปล JavaScript
**libuv** → event loop + thread pool + I/O
**Event Loop** → คนหยิบงานที่เสร็จแล้วกลับเข้า JS
**Non-blocking** → สั่งแล้วไม่ยืนรอ
**I/O-bound** → เสียเวลาไปกับการรอ
**CPU-bound** → เสียเวลาไปกับการคิด
**Thread Pool** → เด็กวิ่งงาน 4 คนของ libuv (fs/dns/crypto/zlib)
**Worker Thread** → พ่อครัวเพิ่มสำหรับงานคิดหนัก
**Process** → ร้านหนึ่งสาขา ไม่แชร์ memory กับสาขาอื่น
**Cluster** → เปิดหลายสาขาใต้ป้ายเดียว
**Heap** → โต๊ะทำงานที่มีขนาดจำกัด
**Memory Leak** → ของที่ไม่ใช้แต่ทิ้งไม่ลง
**Stream** → สายยาง ไม่ใช่ถัง
**Buffer** → ถัง byte ดิบนอก heap
**Backpressure** → ปลายทางบอกว่า "ช้าลงหน่อย"
**Environment Variable** → ค่าที่ยื่นเข้ามาจากข้างนอกตอน start
**package.json / lock file** → ใบสั่ง / ใบเสร็จที่ระบุเวอร์ชันเป๊ะ
**npm ci** → ติดตั้งแบบเดิมทุกครั้งสำหรับ CI
**Event Loop Blocking** → มือเดียวติดงานเดียว ทุกคนรอ
**Graceful Shutdown** → ปิดประตูหน้าร้านก่อน แล้วเสิร์ฟคนในร้านให้จบ

### Flow ที่ต้องวาดได้จากความจำ

```
[JavaScript Code]
        ↓
[V8]  Call Stack + Heap        ← thread เดียว
        ↓ งานที่ JS ทำเองไม่ได้
[Node C++ API]  fs / net / crypto
        ↓
[libuv]  Event Loop + Thread Pool(4)
        ↓
[OS]  epoll / kqueue / IOCP / Disk / Network
        ↓
   งานเสร็จ → callback เข้าคิว
        ↓
[Event Loop หยิบกลับเข้า Call Stack]
        ↓
[ตอบ Response]

(ถ้า Call Stack ติดงาน CPU ยาว → ทุกอย่างในภาพนี้หยุดพร้อมกัน)
```

> **ให้มองภาพนี้ว่า** "ทุกอย่างใน Node วิ่งกลับมาจบที่มือเดียวกันเสมอ หน้าที่ของเราคือทำให้มือนั้นว่างอยู่ตลอดเวลา"

---

[← สารบัญ](./00-README-TOC.md)
