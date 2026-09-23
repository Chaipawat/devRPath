# PART 28 — MASTER MEMORY MAP

> ตำแหน่งในภาพใหญ่: ภาพรวมทั้งเล่ม — แผนที่ที่ร้อยทุก PART เข้าด้วยกันเป็นเส้นทางเดียว ตั้งแต่นิ้วผู้ใช้จนถึง dashboard ของทีม

---

## 1. Big Picture

อ่านมาถึงตรงนี้ คุณมีความรู้เป็นชิ้น ๆ อยู่ในหัวเต็มไปหมด — React ก็รู้, JWT ก็รู้, Index ก็รู้, Pod ก็รู้

แต่ในห้องสัมภาษณ์ คำถามที่แยก Junior ออกจาก Mid-level ไม่ค่อยถามทีละชิ้น
เขามักถามแบบนี้:

> "ผู้ใช้กดปุ่มสั่งซื้อหนึ่งครั้ง ช่วยเล่าหน่อยว่าเกิดอะไรขึ้นบ้าง ตั้งแต่ต้นจนจบ"

คำถามนี้ไม่มีคำตอบถูกข้อเดียว มันวัดว่าคุณ **มองเห็นทั้งเส้นทาง** หรือไม่
และรู้ไหมว่า **ถ้าพังตรงไหน จะเห็นอาการแบบไหน**

PART นี้จึงไม่สอนเรื่องใหม่ แต่เอาทุก PART มาวางเรียงเป็น **แผนที่เดียว**

```
[USER]
   ↓
[REACT / NEXT.JS / REACT NATIVE]          PART 3, 4, 12
   ↓
[HTTP / REST]                             PART 1
   ↓
[NODE.JS + EXPRESS | JAVA + SPRING BOOT | PYTHON]   PART 5, 6, 9, 10, 11
   ↓
[AUTHENTICATION / AUTHORIZATION]          PART 7
   ↓
[BUSINESS LOGIC]                          PART 6, 10, 17
   ↓
[CACHE / QUEUE]                           PART 16
   ↓
[DATABASE]                                PART 8
   ↓
[DOCKER]                                  PART 13
   ↓
[KUBERNETES]                              PART 14
   ↓
[CLOUD / PRODUCTION]                      PART 15, 24
   ↓
[LOGS / METRICS / TRACING]                PART 23
```

> **ให้มองภาพนี้ว่า** "นี่คือถนนเส้นเดียวที่ทุก request ต้องเดินผ่าน และทุก PART ในเล่มคือการอธิบายด่านใดด่านหนึ่งบนถนนเส้นนี้ หรืออธิบายวิธีดูแลถนนทั้งเส้น"

สังเกตว่ามี 2 ประเภท:

| ประเภท | คืออะไร | PART |
|---|---|---|
| **ชั้น (Layer)** | ด่านที่ request เดินผ่านจริง | 1, 3–14, 16 |
| **ทักษะข้ามชั้น (Cross-cutting)** | วิธีคิดที่ใช้กับทุกชั้น | 2, 15, 17–24 |
| **โหมดสัมภาษณ์** | วิธีพูดเรื่องทั้งหมดนี้ออกมา | 25–30 |

---

## 2. Keywords

| Keyword | จำสั้นๆ | ความหมาย |
|---|---|---|
| Layer | ด่านหนึ่งบนถนน | ส่วนของระบบที่รับผิดชอบงานเฉพาะอย่าง เช่น Frontend, Backend, Database |
| Request Path | เส้นทางคำขอ | ลำดับชั้นที่ request หนึ่งครั้งเดินผ่าน ไปและกลับ |
| Cross-cutting Concern | เรื่องที่ทุกชั้นต้องมี | เช่น Security, Logging, Error Handling ที่ไม่ได้อยู่ชั้นเดียว |
| Boundary | รอยต่อระหว่างชั้น | จุดที่ข้อมูลข้ามจากชั้นหนึ่งไปอีกชั้น — จุดที่พังบ่อยที่สุด |
| Contract | ข้อตกลงที่รอยต่อ | รูปแบบข้อมูลที่สองฝั่งตกลงกัน เช่น API Contract, Schema |
| Delivery Path | เส้นทางของโค้ด | จาก laptop → Git → CI → Image → Registry → Cluster |
| Feedback Loop | สัญญาณย้อนกลับ | Logs / Metrics / Traces ที่บอกว่าระบบจริงเป็นอย่างไร |
| Blast Radius | รัศมีความเสียหาย | ถ้าชั้นนี้พัง จะลามไปกี่ชั้น กี่ผู้ใช้ |
| Single Point of Failure | จุดเดียวที่พังแล้วล่มหมด | ชั้นที่ไม่มีตัวสำรอง |
| End-to-End | ตั้งแต่ต้นจนจบ | มองทั้งเส้น ไม่ใช่มองชั้นเดียว |

---

## 3. Mental Model

มองระบบทั้งหมดเป็น **3 เส้นทาง** ที่วิ่งซ้อนกันอยู่ตลอดเวลา

| เส้นทาง | อะไรวิ่ง | เกิดเมื่อไร | PART หลัก |
|---|---|---|---|
| **Request Path** | ข้อมูลของผู้ใช้ | ทุกครั้งที่ผู้ใช้กด | 1, 3–12, 16 |
| **Delivery Path** | โค้ดของเรา | ทุกครั้งที่ dev push | 13, 14, 15, 19 |
| **Feedback Path** | สัญญาณสุขภาพระบบ | ตลอดเวลา | 20, 22, 23 |

สิ่งที่ Senior มองต่างจาก Junior:

| Junior มองว่า | Senior มองว่า |
|---|---|
| "ผมทำ Frontend" | "ผมทำชั้นแรกของ request path และต้องรู้ว่าชั้นถัดไปคาดหวังอะไร" |
| "API ช้า" | "ช้าที่ชั้นไหน — network, auth, business logic, cache miss หรือ query" |
| "deploy เสร็จแล้ว" | "deploy เสร็จ แล้ว metrics หลัง deploy ยังปกติไหม" |
| "bug อยู่ในโค้ด" | "bug อาจอยู่ในโค้ด, config, data, infra หรือรอยต่อระหว่างชั้น" |

กฎทองของ PART นี้:

1. **ทุกชั้นมีหน้าที่เดียวที่ชัด** — ถ้าอธิบายหน้าที่ชั้นไม่ได้ใน 1 ประโยค แปลว่ายังไม่เข้าใจ
2. **ปัญหาส่วนใหญ่เกิดที่รอยต่อ** ไม่ใช่กลางชั้น
3. **ทุกชั้นต้องปล่อยร่องรอย** ให้ feedback path เห็น

---

## 4. ภาพจำ

```
🧠 ภาพจำ:
ระบบ Software = ร้านอาหารแบบครบวงจร

ลูกค้ากดสั่งบนแท็บเล็ต      = React / Next.js / React Native
ใบสั่งอาหารตามแบบฟอร์ม      = HTTP Request / REST
พนักงานรับออเดอร์           = Express / Spring Boot Controller
ตรวจบัตรสมาชิก + สิทธิ์ VIP   = Authentication / Authorization
เชฟปรุงตามสูตร              = Business Logic (Service)
ของที่เตรียมไว้หน้าเตา        = Cache (Redis)
ตั๋วคิวส่งไปครัวหลัง          = Queue (RabbitMQ / Kafka)
ห้องเก็บวัตถุดิบ             = Database
กล่องข้าวมาตรฐานทุกสาขา      = Docker Image
ผู้จัดการสาขาหลายสาขา        = Kubernetes
ตึก ไฟ น้ำ ค่าเช่า            = Cloud
กล้องวงจรปิด + ยอดขายรายชั่วโมง = Logs / Metrics / Tracing
```

```
ลูกค้าสั่ง
    ↓
รับออเดอร์ → ตรวจสิทธิ์ → ปรุง → หยิบของ/เข้าคิว → ห้องเก็บของ
    ↓
เสิร์ฟกลับ
    ↓
กล้องบันทึกทุกขั้น
```

> **ให้มองภาพนี้ว่า** "ถ้าอาหารมาช้า ผู้จัดการที่ดีจะไม่ตะโกนว่าครัวช้า แต่จะดูกล้องว่าช้าตรงรับออเดอร์ ตรงปรุง หรือตรงหาของในห้องเก็บ"

---

## 5. How It Works

### Diagram 1 — ภาพใหญ่ทั้งระบบ

```
                        ┌───────────── CLIENT ─────────────┐
                        │  Browser (React / Next.js)       │
[USER] ────────────────▶│  Mobile  (React Native)          │
                        └────────────────┬─────────────────┘
                                         ↓  HTTPS (PART 1, 7)
                        ┌────────────────┴─────────────────┐
                        │  DNS → CDN → Load Balancer        │  PART 1, 16, 24
                        │        → API Gateway / Ingress    │  PART 14, 16
                        └────────────────┬─────────────────┘
                                         ↓
                        ┌────────────────┴─────────────────┐
                        │  BACKEND                          │
                        │  Middleware → Auth → Controller   │  PART 5, 6, 7, 10, 11
                        │  → Service → Repository           │  PART 17
                        └───────┬──────────┬──────────┬─────┘
                                ↓          ↓          ↓
                            [CACHE]    [QUEUE]    [DATABASE]      PART 16, 8
                                           ↓
                                       [WORKER]                   PART 16
                        ┌──────────────────────────────────┐
                        │  ทั้งหมดรันใน Container (Docker)    │  PART 13
                        │  จัดการโดย Kubernetes บน Cloud      │  PART 14, 24
                        └──────────────────────────────────┘
                        ┌──────────────────────────────────┐
                        │  Logs / Metrics / Traces ทุกชั้น    │  PART 23
                        └──────────────────────────────────┘
```

> **ให้มองภาพนี้ว่า** "ระบบคือกล่องซ้อนกัน — request วิ่งผ่านกล่องแนวตั้ง ส่วน Docker, Kubernetes และ Observability คือกล่องแนวนอนที่ห่อทุกอย่างไว้"

### Diagram 2 — เส้นทาง request หนึ่งครั้ง: "ผู้ใช้กดปุ่มสั่งซื้อ"

เล่าเป็นเรื่องเดียว ตั้งแต่นิ้วแตะจนข้อมูลกลับมาแสดง

```
[1] นิ้วแตะปุ่ม "สั่งซื้อ"
      ↓   onClick → setState(loading) → re-render ปุ่มเป็น spinner      PART 3
[2] Frontend เรียก API
      ↓   fetch POST /orders + body + Authorization header              PART 1, 2
[3] DNS แปลง domain → IP, เปิด TLS                                      PART 1, 7
      ↓
[4] CDN / Load Balancer / Ingress ส่งต่อไป Pod ที่ว่าง                  PART 16, 14
      ↓
[5] Backend รับ request → Middleware (log, parse body, CORS)            PART 6
      ↓
[6] Auth Middleware ตรวจ JWT / Session → รู้ว่า "เป็นใคร"               PART 7
      ↓   ตรวจ Role → รู้ว่า "ทำได้ไหม"
[7] Validation ตรวจ input                                               PART 6, 7
      ↓
[8] Controller → Service (Business Logic: เช็ค stock, คำนวณราคา)       PART 6, 10, 17
      ↓
[9] Cache: ดึงราคาสินค้าจาก Redis (hit) หรือไป DB (miss)                PART 16
      ↓
[10] Database: เปิด Transaction → ตัด stock → สร้าง order → Commit     PART 8
      ↓
[11] Queue: ส่ง event "order_created" ให้ Worker ส่งอีเมลทีหลัง           PART 16
      ↓
[12] Response 201 Created + JSON กลับทางเดิม                            PART 1
      ↓
[13] Frontend รับ → update state → UI แสดง "สั่งซื้อสำเร็จ"             PART 3, 4
      ↓
[14] ทุกขั้นทิ้ง log + metric + span ที่มี Trace ID เดียวกัน              PART 23
```

> **ให้มองภาพนี้ว่า** "การกดปุ่มหนึ่งครั้งคือการส่งพัสดุที่ต้องผ่านด่านตรวจสิบกว่าด่าน และทุกด่านประทับตรา Trace ID เดียวกันไว้ เพื่อให้ตามรอยย้อนได้"

รายละเอียดสำคัญที่มักโดนถามต่อ:

| ขั้น | คำถามต่อยอดที่มักเจอ |
|---|---|
| 1 | ถ้าผู้ใช้กดซ้ำสองครั้ง จะกันอย่างไร? (disable ปุ่ม + Idempotency Key ฝั่ง backend) |
| 3 | HTTPS ป้องกันอะไร ไม่ป้องกันอะไร? |
| 6 | 401 กับ 403 ต่างกันอย่างไร? |
| 9 | ถ้าราคาเปลี่ยน cache จะเก่าไหม? (Cache Invalidation, TTL) |
| 10 | ถ้าสองคนซื้อชิ้นสุดท้ายพร้อมกัน? (Race Condition, Lock) |
| 11 | ทำไมไม่ส่งอีเมลใน request เลย? (Latency, Retry, Decoupling) |
| 14 | ถ้าช้า จะรู้ได้อย่างไรว่าช้าที่ขั้นไหน? (Distributed Tracing) |

### Diagram 3 — โค้ดจาก laptop → production

```
[LAPTOP]  เขียนโค้ด + unit test                         PART 18
   ↓  git commit / push branch                          PART 19
[GIT REPOSITORY]
   ↓  เปิด Pull Request → Code Review
[CI PIPELINE]  install → lint → test → build           PART 15
   ↓
[DOCKER BUILD]  Dockerfile → Image (tag = commit)       PART 13
   ↓
[REGISTRY]  เก็บ Image
   ↓
[CD]  deploy ไป Staging → Smoke Test                    PART 15, 18
   ↓  อนุมัติ
[KUBERNETES]  Rolling Update / Canary                   PART 14, 15
   ↓  Readiness Probe ผ่าน → รับ traffic
[PRODUCTION]
   ↓
[OBSERVE]  error rate / latency หลัง deploy              PART 23
   ↓  ถ้าแย่ลง
[ROLLBACK]  กลับ Image เวอร์ชันก่อน                       PART 14, 15, 19
```

> **ให้มองภาพนี้ว่า** "โค้ดไม่ได้กระโดดจากเครื่องเราไป production ทันที แต่ถูกบรรจุเป็นกล่องมาตรฐาน ผ่านด่านตรวจอัตโนมัติ แล้วค่อย ๆ วางแทนกล่องเก่า โดยมีทางถอยเสมอ"

### Diagram 4 — เส้นทางการไล่ปัญหาเมื่อเกิด incident

```
[ALERT]  error rate พุ่ง / ผู้ใช้แจ้ง                      PART 23
   ↓
[IMPACT]  กระทบใคร กี่คน ฟีเจอร์ไหน → ประกาศ incident      PART 23
   ↓
[RECENT CHANGE?]  มี deploy / config / migration ล่าสุดไหม   PART 15, 19
   ↓  ถ้าใช่ และสงสัย → Rollback ก่อน แล้วค่อยหา root cause
[DASHBOARD]  ดู Metrics: latency, error rate, CPU, memory   PART 22, 23
   ↓
[TRACE]  เปิด trace ที่ช้า/พัง → ชี้ว่าชั้นไหน                PART 23
   ↓
[LOGS]  กรองด้วย Trace ID / Request ID → ดู error จริง       PART 23
   ↓
[ไล่ทีละชั้น]
   Frontend → Network → LB → Backend → Auth → Cache → DB → Infra
   ↓
[HYPOTHESIS → TEST → ROOT CAUSE]                           PART 20
   ↓
[FIX + REGRESSION TEST]                                    PART 18, 20
   ↓
[MONITOR → POSTMORTEM]                                     PART 23
```

> **ให้มองภาพนี้ว่า** "เวลาระบบพัง ให้หยุดเลือดก่อน (rollback / mitigate) แล้วค่อยเป็นนักสืบ — ใช้ metrics บอกว่าพังเมื่อไร, trace บอกว่าพังที่ไหน, log บอกว่าพังเพราะอะไร"

### Diagram 5 — แผนที่ PART → ชั้น

```
ชั้น                        PART ที่อธิบายชั้นนี้
─────────────────────────────────────────────────────────
Big Picture                 0
User / Client               3 React · 4 Next.js · 12 React Native
Language Runtime            2 JavaScript
Protocol                    1 Web Fundamentals
Backend Runtime             5 Node.js · 9 Java · 11 Python
Backend Framework           6 Express · 10 Spring Boot · 11 (FastAPI/Django)
Security                    7 Authentication & Security
Business Logic              17 Architecture
Cache / Queue / Scaling     16 Advanced Backend
Data                        8 Database
Packaging                   13 Docker
Orchestration               14 Kubernetes
Delivery                    15 CI/CD · 19 Git
Quality                     18 Testing
Observe                     23 Observability
─────────── ทักษะข้ามทุกชั้น ───────────
Diagnose                    20 Debugging
Think                       21 Problem Solving
Speed                       22 Performance
Design                      24 System Design
─────────── โหมดสัมภาษณ์ ───────────
Speak                       25 Interview · 26 HR Vocabulary
Review                      27 Compare · 28 Memory Map · 29 Cheat Sheet · 30 Last 30 Min
```

> **ให้มองภาพนี้ว่า** "ถ้าคำถามสัมภาษณ์ถามถึงชั้นไหน ให้วิ่งไปเปิด PART ที่อยู่แถวเดียวกัน แล้วเสริมด้วย PART ข้ามชั้นเสมอ"

### Diagram 6 — ชั้นเดียวกัน ต่าง technology

```
                ┌── Node.js + Express      (JavaScript, I/O-bound, ทีม full-stack JS)
HTTP Request ──▶├── Java + Spring Boot      (Static typing, enterprise, ระบบใหญ่)
                └── Python + FastAPI/Django (เร็วในการเขียน, data / ML)
                          ↓
            ทั้งสามทำหน้าที่เดียวกัน: รับ request → auth → logic → data → response
```

> **ให้มองภาพนี้ว่า** "เปลี่ยนภาษาได้ แต่ชั้นไม่เปลี่ยน — ถ้าเข้าใจหน้าที่ของชั้น ก็ย้ายข้าม technology ได้"

### ตารางหลัก: ชั้น | technology | PART | คำถามสัมภาษณ์

| ชั้น | Technology | PART | คำถามสัมภาษณ์ที่มักออกจากชั้นนี้ |
|---|---|---|---|
| User / UI | React, Next.js, React Native | 3, 4, 12 | State กับ Props ต่างกันอย่างไร? ทำไม component re-render? Server Component ต่างจาก SSR อย่างไร? |
| Language | JavaScript | 2 | Event Loop ทำงานอย่างไร? Promise กับ async/await? Closure คืออะไร? |
| Protocol | HTTP / HTTPS / REST | 1 | 401 vs 403? PUT vs PATCH? Stateless หมายความว่าอะไร? |
| Edge | DNS, CDN, Load Balancer, API Gateway | 1, 16, 24 | พิมพ์ URL แล้วเกิดอะไรขึ้น? Load Balancer กับ Reverse Proxy ต่างกันอย่างไร? |
| Backend Runtime | Node.js, JVM, Python | 5, 9, 11 | Node.js single thread รับงานพร้อมกันได้อย่างไร? GIL คืออะไร? GC ทำงานอย่างไร? |
| Backend Framework | Express, Spring Boot, FastAPI | 6, 10, 11 | Middleware คืออะไร? Dependency Injection มีไว้ทำไม? Controller/Service/Repository แยกทำไม? |
| Security | JWT, Session, OAuth2, CORS | 7 | Authentication vs Authorization? เก็บ token ไว้ไหน? CSRF กับ XSS ต่างกันอย่างไร? |
| Business Logic | Service Layer, Clean Architecture | 17 | SOLID คืออะไร? Coupling vs Cohesion? Technical Debt จัดการอย่างไร? |
| Cache / Queue | Redis, RabbitMQ, Kafka | 16 | Cache Invalidation ทำอย่างไร? ทำไมต้องใช้ Queue? Idempotency คืออะไร? |
| Database | PostgreSQL, MySQL, MongoDB | 8 | SQL vs NoSQL? Index ทำงานอย่างไร? N+1 คืออะไร? Transaction / ACID? |
| Packaging | Docker | 13 | Image vs Container? Docker vs VM? Volume มีไว้ทำไม? |
| Orchestration | Kubernetes | 14 | Pod คืออะไร? Liveness vs Readiness? Rolling Update ทำงานอย่างไร? |
| Delivery | CI/CD, Git | 15, 19 | CI กับ CD ต่างกันอย่างไร? Blue-Green vs Canary? Merge vs Rebase? |
| Quality | Unit / Integration / E2E | 18 | Testing Pyramid? Mock vs Stub? ควรเขียน test แบบไหนก่อน? |
| Observe | Logs, Metrics, Tracing | 23 | Monitoring vs Observability? Trace ID มีไว้ทำไม? ทำ Postmortem อย่างไร? |
| Cross-cutting | Debugging, Performance, System Design | 20, 22, 24 | Production ช้าจะเริ่มไล่ที่ไหน? ออกแบบระบบ URL Shortener อย่างไร? |

---

## 6. Example

### Scenario A — "หน้า Order History โหลดช้า 8 วินาที"

เดินตามแผนที่ ไม่เดา:

| ชั้น | ตรวจอะไร | สิ่งที่พบ |
|---|---|---|
| Frontend | Network tab: request ไหนนาน | `GET /orders` ใช้ 7.8 วินาที — ไม่ใช่ปัญหา render |
| Edge | LB / Ingress latency | ปกติ ไม่กี่ ms |
| Backend | Trace ของ request นี้ | span "db query" กินเวลาเกือบทั้งหมด |
| Database | query plan | ไม่มี Index บน `user_id` + เกิด N+1 ดึง item ทีละ order |
| Fix | เพิ่ม Index + JOIN / batch query + Pagination | เหลือไม่ถึง 1 วินาที |
| Observe | ดู latency p95 หลัง deploy | ลดลงจริง |

PART ที่ใช้: 3 → 1 → 16 → 23 → 8 → 22 → 15

### Scenario B — "deploy แล้วผู้ใช้ login ไม่ได้บางคน"

| ชั้น | ตรวจอะไร | สิ่งที่พบ |
|---|---|---|
| Delivery | deploy ล่าสุด | เพิ่งเปลี่ยน config ของ JWT secret |
| Kubernetes | Pod ทุกตัวใช้ Secret เดียวกันไหม | Pod เก่ากับใหม่ใช้ secret คนละค่าระหว่าง rolling update |
| Security | token ที่ออกจาก Pod A ถูกตรวจที่ Pod B | signature ไม่ตรง → 401 |
| Mitigate | Rollback ก่อน | ผู้ใช้กลับมา login ได้ |
| Fix | วางแผน key rotation ให้รองรับ key เก่าและใหม่พร้อมกัน | ปลอดภัยทั้งระหว่างและหลัง deploy |

PART ที่ใช้: 15 → 14 → 7 → 23 → 20

### Scenario C — "ระบบสั่งซื้อช่วง flash sale ล่ม"

```
Traffic พุ่ง
   ↓
Backend Pod CPU เต็ม → Auto Scaling เพิ่ม Pod        PART 14
   ↓
Pod เพิ่ม → Connection ไป DB เพิ่ม → Connection Pool เต็ม   PART 8
   ↓
DB กลายเป็น Bottleneck
   ↓
แก้: Cache ข้อมูลสินค้า + Queue การสร้าง order + Rate Limit   PART 16
```

> **ให้มองภาพนี้ว่า** "การขยายชั้นหนึ่งโดยไม่ดูชั้นถัดไป เท่ากับย้ายรถติดจากถนนหนึ่งไปอีกถนนหนึ่ง"

---

## 7. Compare

| สิ่งที่มักสับสน | ความต่างเมื่อมองบนแผนที่ |
|---|---|
| Frontend vs Backend | Frontend อยู่เครื่องผู้ใช้ เชื่อไม่ได้; Backend อยู่เครื่องเรา เป็นที่ตัดสินใจจริง |
| Authentication vs Authorization | ด่านเดียวกัน แต่ถามคนละคำถาม: "เป็นใคร" กับ "ทำได้ไหม" |
| Cache vs Database | Cache = สำเนาเร็วแต่อาจเก่า; Database = แหล่งความจริง |
| Queue vs Direct Call | Direct = รอคำตอบทันที; Queue = ฝากงานไว้ทำทีหลัง |
| Docker vs Kubernetes | Docker = ทำกล่อง; Kubernetes = จัดการกล่องจำนวนมาก |
| CI vs CD | CI = ตรวจว่าโค้ดดี; CD = ส่งโค้ดที่ดีไปถึงผู้ใช้ |
| Monitoring vs Observability | Monitoring = รู้ว่าพัง; Observability = ถามต่อได้ว่าพังเพราะอะไร |
| Request Path vs Delivery Path | อันแรกคือข้อมูลผู้ใช้วิ่ง; อันหลังคือโค้ดเราวิ่ง |
| Layer vs Cross-cutting | Layer = ด่านบนถนน; Cross-cutting = กฎที่ทุกด่านต้องทำตาม |
| Performance vs Scalability | Performance = request เดียวเร็วไหม; Scalability = คนเยอะขึ้นยังรับไหวไหม |

---

## 8. Common Mistakes

| Mistake | ทำไมผิด | ควรคิดแบบไหน |
|---|---|---|
| ตอบ "เกิดอะไรขึ้นเมื่อกดปุ่ม" แค่ในชั้นที่ตัวเองทำ | ผู้สัมภาษณ์อยากเห็นว่าเข้าใจทั้งเส้น | เล่าทั้งเส้นก่อน แล้วค่อยลงลึกชั้นที่ถนัด |
| คิดว่า validation ฝั่ง Frontend พอแล้ว | Frontend ถูกข้ามได้เสมอ | Validate ซ้ำที่ Backend ทุกครั้ง |
| ใส่ Cache ทุกที่เพื่อความเร็ว | ได้ความเร็วแต่เสียความถูกต้อง | ถามก่อนว่าข้อมูลเก่าได้แค่ไหน |
| คิดว่า Kubernetes แก้ปัญหา performance ได้เอง | เพิ่ม Pod ไม่ช่วยถ้า DB เป็นคอขวด | หา bottleneck จริงก่อน scale |
| deploy แล้วไม่ดู metrics | ปัญหาจะมาถึงทีมผ่านลูกค้าแทน | ทุก deploy ต้องมีช่วงสังเกต |
| debug ด้วยการเดาและแก้โค้ดทันที | อาจแก้ผิดจุดหรือสร้าง bug ใหม่ | ใช้ Diagram 4 ไล่ทีละชั้นด้วยหลักฐาน |
| ท่องแต่ชื่อ technology | อธิบายไม่ได้ว่าอยู่ชั้นไหน ทำหน้าที่อะไร | ทุก technology ต้องตอบได้ว่า "อยู่ชั้นไหน แก้ปัญหาอะไร" |
| มองข้ามรอยต่อระหว่างชั้น | CORS, timeout, contract ไม่ตรง เกิดที่รอยต่อ | เวลา debug ให้สงสัยรอยต่อก่อน |

---

## 9. Debugging

เมื่อเจอปัญหาใด ๆ ให้ใช้แผนที่นี้เป็น checklist แบบ "บนลงล่าง"

| ลำดับ | ชั้น | คำถามแรกที่ต้องถาม | เครื่องมือ / หลักฐาน |
|---|---|---|---|
| 1 | Change | มีอะไรเปลี่ยนล่าสุดไหม? | Deploy history, Git log, config diff |
| 2 | User / UI | เกิดกับทุกคนหรือบางคน? browser/device ไหน? | Console, Network tab, error tracking |
| 3 | Network / Edge | request ถึง server ไหม? DNS/TLS/CORS ผ่านไหม? | Status code, LB log |
| 4 | Backend | request เข้าแล้วพังตรงไหน? | Log ด้วย Request ID, stack trace |
| 5 | Auth | 401 หรือ 403? token หมดอายุไหม? | Auth log, decode token |
| 6 | Business Logic | input แบบไหนที่ทำให้ผิด? | Reproduce ด้วย test case |
| 7 | Cache / Queue | cache เก่าไหม? queue ค้างไหม? | Hit rate, queue length, worker log |
| 8 | Database | query ช้า? lock? connection เต็ม? | Slow query log, query plan, pool metrics |
| 9 | Container / K8s | Pod restart? OOMKilled? probe fail? | Pod status, events, resource usage |
| 10 | Cloud | resource quota, network, region มีปัญหาไหม? | Cloud status, infra metrics |

หลักคิด:

- **Metrics → Traces → Logs** = กว้าง → ชี้จุด → ลงรายละเอียด (PART 23)
- **Mitigate ก่อน Root Cause** เมื่อผู้ใช้ได้รับผลกระทบ (PART 20)
- **ทุก fix ต้องมี regression test** (PART 18)

---

## 10. Interview Questions

### 🟢 Junior

1. ช่วยอธิบายว่า Frontend, Backend และ Database ทำหน้าที่อะไร และคุยกันอย่างไร
2. พิมพ์ URL ในเบราว์เซอร์แล้วกด Enter เกิดอะไรขึ้นบ้าง
3. REST API คืออะไร และอยู่ตรงไหนของระบบ
4. Docker ช่วยอะไรในการ deploy

### 🟡 Mid

1. ผู้ใช้กดปุ่มสั่งซื้อหนึ่งครั้ง ช่วยเล่าทุกขั้นตั้งแต่ต้นจนจบ
2. ถ้า API ช้า คุณจะหาอย่างไรว่าช้าที่ชั้นไหน
3. อธิบายขั้นตอนตั้งแต่ git push จนโค้ดขึ้น production
4. ทำไมต้องใช้ Cache และ Queue ใส่ไว้ตรงไหนของระบบ
5. Authentication และ Authorization อยู่ตรงไหนของ request flow

### 🔴 Senior

1. ถ้าต้องรองรับผู้ใช้เพิ่ม 10 เท่า ชั้นไหนจะพังก่อน และคุณจะเตรียมอย่างไร
2. เกิด incident ตอนตีสอง คุณจะนำทีมแก้อย่างไร
3. ระบบนี้มี Single Point of Failure ตรงไหนบ้าง จะลดอย่างไร
4. ออกแบบ observability ให้ทีมตอบได้ว่า "ผู้ใช้คนนี้ทำไมจ่ายเงินไม่ได้" ภายใน 5 นาที

---

## 11. Answer Like a Developer

### โครงตอบคำถาม "เล่าทั้งเส้นทาง"

```
1. วางภาพใหญ่ 1 ประโยค      → "request จะผ่าน client → edge → backend → data แล้วกลับ"
2. เดินทีละชั้นแบบสั้น        → ชั้นละ 1 ประโยค บอกหน้าที่
3. ชี้จุดที่น่าสนใจ 2–3 จุด     → auth, transaction, cache/queue
4. บอกว่าพังได้ตรงไหน         → race condition, timeout, cache เก่า
5. บอกว่าจะมองเห็นได้อย่างไร   → log, metric, trace ด้วย Trace ID
```

### โครงตอบคำถาม "ระบบช้า / พัง"

```
1. ถามขอบเขต     → ทุกคนหรือบางคน, เริ่มเมื่อไร, มี deploy ไหม
2. หยุดเลือดก่อน   → rollback / feature flag ถ้ากระทบผู้ใช้
3. วัดก่อนเดา     → metrics ชี้ช่วงเวลา, trace ชี้ชั้น, log ชี้สาเหตุ
4. ไล่ทีละชั้น     → ตามแผนที่ บนลงล่าง
5. แก้ + กันซ้ำ    → fix, regression test, alert, postmortem
```

### โครงตอบคำถาม "เลือก technology"

```
1. บอกว่าอยู่ชั้นไหน แก้ปัญหาอะไร
2. เทียบกับทางเลือกในชั้นเดียวกัน
3. บอก trade-off → "เหมาะเมื่อ..." ไม่ใช่ "ดีกว่า"
4. ผูกกับ context ทีม / ระบบ / ขนาด
```

---

## 12. One-Minute Review

- ระบบทั้งหมด = **ถนนเส้นเดียว**: User → UI → HTTP → Backend → Auth → Logic → Cache/Queue → DB แล้ววิ่งกลับ
- ทุกอย่างถูกห่อด้วย **Docker → Kubernetes → Cloud** และถูกมองด้วย **Logs / Metrics / Traces**
- มี **3 เส้นทาง**: Request Path (ข้อมูลผู้ใช้), Delivery Path (โค้ดเรา), Feedback Path (สัญญาณสุขภาพ)
- ปัญหาส่วนใหญ่เกิดที่ **รอยต่อระหว่างชั้น**
- เวลาพัง: **Mitigate → Metrics → Trace → Log → Root Cause → Fix → Regression Test → Postmortem**
- ทุก technology ต้องตอบได้ว่า **"อยู่ชั้นไหน แก้ปัญหาอะไร trade-off คืออะไร"**

---

## 13. Memory Card

**จำ 5 อย่าง**

1. **ถนนเส้นเดียว** — ทุก request เดินผ่านชั้นเดิมเสมอ ไปและกลับ
2. **หนึ่งชั้น หนึ่งหน้าที่** — อธิบายได้ใน 1 ประโยค
3. **รอยต่อพังบ่อยที่สุด** — CORS, timeout, contract, config
4. **โค้ดมีถนนของมันเอง** — laptop → Git → CI → Image → Registry → K8s → Observe → Rollback
5. **ทุกชั้นต้องทิ้งร่องรอย** — Trace ID เดียวร้อยทุกชั้นเข้าด้วยกัน

**Keyword:**
User → กดปุ่ม ;
UI → State เปลี่ยน ;
HTTP → คำขอ + สถานะ ;
Backend → Middleware → Controller → Service ;
Auth → เป็นใคร + ทำได้ไหม ;
Cache → สำเนาเร็ว ;
Queue → ฝากงานไว้ทำทีหลัง ;
Database → แหล่งความจริง ;
Docker → กล่องมาตรฐาน ;
Kubernetes → ผู้จัดการกล่อง ;
Observability → ตา หู ของทีม

---

[← สารบัญ](./00-README-TOC.md)
