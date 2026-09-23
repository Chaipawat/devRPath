# PART 6 — EXPRESS

> ตำแหน่งในภาพใหญ่: Backend Layer — ชั้นที่รับ HTTP Request จาก Frontend แล้วจัดเส้นทางให้ไปถึง Business Logic และ Database

---

## 1. Big Picture

ลองนึกภาพว่า Node.js คือ "เครื่องยนต์" ที่รัน JavaScript นอก browser ได้
แต่ Node.js เพียว ๆ ถ้าจะทำ web server ขึ้นมาหนึ่งตัว คุณต้องเขียนเองทุกอย่าง:

- อ่าน URL เองว่า path คืออะไร
- แยกเองว่าเป็น GET หรือ POST
- แปลง body ที่เป็น stream ให้เป็น object เอง
- เขียน response header เอง
- ถ้ามี 40 endpoint ก็ต้องเขียน if-else 40 ชั้นเอง

**Express คือชั้นบาง ๆ (thin layer) ที่วางทับบน HTTP module ของ Node.js เพื่อทำเรื่องน่าเบื่อพวกนี้ให้**

พูดแบบ HR ฟังรู้เรื่อง:

> "Express คือ framework ที่ช่วยจัดระเบียบว่า คำขอที่เข้ามาแต่ละแบบ ควรถูกส่งไปให้ code ส่วนไหนจัดการ และก่อนจะถึงตรงนั้นต้องผ่านการตรวจอะไรบ้าง"

คำที่ต้องจำให้แม่นคือคำว่า **"ผ่านการตรวจอะไรบ้าง"** เพราะนั่นคือ **Middleware** ซึ่งเป็นหัวใจทั้งหมดของ Express

### Express คืออะไรจริง ๆ (ในระดับที่ Senior อยากได้ยิน)

Express ไม่ใช่ framework ที่บังคับโครงสร้าง (unopinionated framework)
มันให้คุณแค่ 2 อย่างหลัก:

| สิ่งที่ Express ให้ | หมายความว่า |
|---|---|
| **Routing** | จับคู่ `HTTP Method + Path` → ฟังก์ชันที่จะทำงาน |
| **Middleware pipeline** | ท่อที่ request ไหลผ่านเป็นลำดับ ก่อนและหลังถึง route |

นอกนั้น — folder structure, การแยก layer, validation, error handling — **Express ไม่บังคับเลย**
นี่คือทั้งข้อดีและข้อเสีย และเป็นเหตุผลว่าทำไมคำถามสัมภาษณ์เรื่อง Express ส่วนใหญ่จึงไม่ใช่ "Express ทำอะไรได้" แต่เป็น **"คุณจะจัดระเบียบ project Express ยังไงไม่ให้พังตอนโตขึ้น"**

### Express อยู่ตรงไหนในภาพใหญ่

```
[BROWSER / MOBILE]
        ↓  HTTP Request
[NODE.JS RUNTIME]
        ↓
[EXPRESS]           ← ชั้นนี้: routing + middleware
        ↓
[BUSINESS LOGIC]    ← Service
        ↓
[DATA ACCESS]       ← Repository
        ↓
[DATABASE]
```

> **ให้มองภาพนี้ว่า** "Express คือแผนกต้อนรับของตึก มันไม่ได้ทำงานจริงให้คุณ แต่มันรู้ว่าคุณต้องขึ้นไปชั้นไหน และต้องผ่านการตรวจอะไรก่อนขึ้นลิฟต์"

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Express** | แผนกต้อนรับ | Web framework บน Node.js จัดการ routing + middleware |
| **Request (req)** | ใบคำขอ | object ที่รวมทุกอย่างที่ client ส่งมา (headers, body, params, query) |
| **Response (res)** | ใบตอบกลับ | object ที่ใช้ส่งข้อมูลกลับไปหา client |
| **next()** | "ส่งต่อด่านถัดไป" | ฟังก์ชันที่บอกว่า middleware ตัวนี้จบแล้ว ให้ไปตัวถัดไป |
| **Middleware** | ด่านตรวจ | ฟังก์ชันที่ทำงานระหว่างทาง req → route |
| **Route** | ป้ายบอกทาง | การจับคู่ `Method + Path` → handler |
| **Router** | ป้ายบอกทางรวมกลุ่ม | จับ route ที่เกี่ยวข้องมัดรวมเป็นไฟล์เดียว |
| **Handler** | คนรับงาน | ฟังก์ชันปลายทางที่ตอบ response |
| **Controller** | พนักงานหน้าเคาน์เตอร์ | รับ/ตรวจ input แปลงเป็นคำสั่ง แล้วส่งให้ Service |
| **Service** | ฝ่ายที่ทำงานจริง | Business logic ทั้งหมดอยู่ที่นี่ |
| **Repository** | คนคุยกับคลังเอกสาร | ชั้นที่รู้จัก database เพียงชั้นเดียว |
| **DTO** | แบบฟอร์มมาตรฐาน | Data Transfer Object — รูปร่างข้อมูลที่ส่งข้าม layer |
| **Validation** | ตรวจเอกสารก่อนรับเรื่อง | เช็คว่า input ถูกรูปแบบและอยู่ในขอบเขตไหม |
| **Sanitization** | ล้างสิ่งแปลกปลอม | ตัด/escape ข้อมูลอันตรายออกจาก input |
| **Error Handler** | ฝ่ายรับเรื่องร้องเรียน | middleware พิเศษ 4 พารามิเตอร์ `(err, req, res, next)` |
| **Central Error Handler** | ประตูออกเดียว | error ทุกจุดถูกรวมมาตอบที่เดียว |
| **Auth Middleware** | ด่านตรวจบัตร | ตรวจว่าเป็นใคร (authentication) |
| **Authorization Middleware** | ด่านตรวจสิทธิ์ | ตรวจว่าทำสิ่งนี้ได้ไหม (authorization) |
| **Body Parser** | คนแกะซอง | แปลง raw body → JavaScript object |
| **CORS Middleware** | ใบอนุญาตข้ามตึก | บอก browser ว่า origin ไหนเรียกได้ |
| **Rate Limiter** | จำกัดคนต่อคิว | จำกัดจำนวน request ต่อช่วงเวลา |
| **REST** | สไตล์ออกแบบ API | ใช้ resource + HTTP method สื่อความหมาย |
| **Idempotent** | ทำซ้ำได้ผลเดิม | GET/PUT/DELETE ควร idempotent, POST ไม่ใช่ |
| **Layered Architecture** | แบ่งชั้นความรับผิดชอบ | Controller / Service / Repository |
| **Separation of Concerns** | แต่ละคนทำเรื่องเดียว | หลักการเบื้องหลังการแยก layer |

---

## 3. Mental Model

ให้มอง Express เป็น **ท่อ (pipeline) ที่ request ไหลผ่านจากซ้ายไปขวา** ไม่ใช่ "กล่องที่มี function ข้างใน"

หัวใจมี 3 ข้อ:

### 3.1 ทุกอย่างใน Express คือ middleware

Route handler เองก็คือ middleware ที่บังเอิญเป็นตัวสุดท้ายที่ตอบ response
`express.json()` ก็คือ middleware
Error handler ก็คือ middleware (แค่รับ 4 พารามิเตอร์)

ถ้าจำข้อนี้ได้ข้อเดียว คุณตอบคำถาม Express ได้ 60% แล้ว

### 3.2 ลำดับสำคัญกว่าตัว middleware เอง

Express เดินจากบนลงล่าง **ตามลำดับที่คุณเขียน `app.use()`**
ไม่มี priority ไม่มี magic sorting
เขียนก่อน = ทำงานก่อน เสมอ

### 3.3 request มีจุดจบได้ 2 แบบเท่านั้น

| จุดจบ | เกิดเมื่อ |
|---|---|
| **ตอบ response** | มี `res.json()` / `res.send()` / `res.end()` |
| **โยน error** | `next(err)` หรือ throw ใน async แล้ว catch ส่งต่อ |

ถ้าไม่เกิดทั้งสองอย่าง = **request ค้าง** client รอจน timeout
นี่คือ bug คลาสสิกที่สุดของ Express: **ลืมเรียก `next()` และลืมตอบ response**

### 3.4 แต่ละ layer ต้อง "ไม่รู้จัก" สิ่งที่ไม่ใช่เรื่องของตัวเอง

| Layer | รู้จัก | ไม่ควรรู้จัก |
|---|---|---|
| Controller | HTTP (req/res/status code) | SQL, ORM, business rule ลึก ๆ |
| Service | Business rule | req, res, status code, SQL |
| Repository | Database/ORM | HTTP, business rule |

ถ้า Service ของคุณมีคำว่า `res.status(404)` แปลว่าเส้นแบ่งพังแล้ว

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำหลัก:
Middleware = ด่านตรวจสนามบิน

[ผู้โดยสาร]              = Request
   ↓
[เช็คอิน]                = Logger / Request ID
   ↓
[ตรวจบัตรประชาชน]        = Authentication
   ↓
[ตรวจว่าขึ้นไฟลท์นี้ได้ไหม] = Authorization
   ↓
[สแกนกระเป๋า]            = Validation / Sanitization
   ↓
[ขึ้นเครื่อง]             = Route → Controller
   ↓
[ถึงจุดหมาย]             = Response

ถ้าด่านไหนไม่ผ่าน → ถูกกันออกตรงนั้นทันที ไม่ต้องเดินต่อ
```

> **ให้มองภาพนี้ว่า** "request ไม่ได้วิ่งตรงเข้าหา business logic มันต้องเดินผ่านด่านทีละด่าน และด่านไหนก็หยุดมันได้"

### ต่อยอดภาพจำนี้ให้ใช้ตอบสัมภาษณ์

ภาพสนามบินนี้อธิบายเรื่องยาก ๆ ได้อีกหลายเรื่อง:

| คำถาม | ตอบด้วยภาพสนามบิน |
|---|---|
| ทำไมลำดับ middleware สำคัญ? | สแกนกระเป๋าก่อนตรวจบัตร = เสียเวลาสแกนกระเป๋าคนที่ไม่มีสิทธิ์ขึ้นเครื่องอยู่ดี |
| ทำไม auth ต้องมาก่อน authorization? | ยังไม่รู้ว่าคุณเป็นใคร จะรู้ได้ไงว่าคุณขึ้น business class ได้ |
| `next()` คืออะไร? | เจ้าหน้าที่ประทับตราแล้วบอก "ผ่านได้ ไปด่านหน้า" |
| `next(err)` คืออะไร? | "คนนี้มีปัญหา พาไปห้องสอบสวน" — ข้ามทุกด่านที่เหลือ ไปที่ error handler เลย |
| Central error handler คืออะไร? | ห้องสอบสวนห้องเดียวของทั้งสนามบิน ไม่ว่าถูกกันจากด่านไหนก็มาจบที่นี่ |
| ลืม `next()` = อะไร | เจ้าหน้าที่รับบัตรไปแล้วเดินหายไป ผู้โดยสารยืนรอตลอดกาล |
| Rate limiting | จำกัดจำนวนคนเข้าคิวต่อชั่วโมง |

### ภาพจำรอง — Layered Architecture = ร้านอาหาร

```
🧠 ภาพจำ:
Controller = พนักงานรับออร์เดอร์  (คุยกับลูกค้า ไม่เข้าครัว)
Service    = เชฟ                 (ทำอาหารจริง ไม่รู้จักลูกค้า)
Repository = คนเบิกของจากสต็อก    (รู้แค่ว่าของอยู่ชั้นไหน)
Database   = คลังวัตถุดิบ

Controller
     ↓
 Service
     ↓
Repository
     ↓
 Database
```

> **ให้มองภาพนี้ว่า** "เชฟไม่ควรต้องรู้ว่าลูกค้าจ่ายด้วยบัตรหรือเงินสด และพนักงานรับออร์เดอร์ไม่ควรต้องรู้ว่าเกลืออยู่ชั้นไหนในสต็อก"

---

## 5. How It Works

### 5.1 Request Lifecycle เต็มรูปแบบ

```
[CLIENT]
   │  HTTP Request
   ↓
[NODE HTTP SERVER]          รับ socket, แปลงเป็น req/res object
   ↓
[EXPRESS APP]
   ↓
┌──────────── MIDDLEWARE PIPELINE ────────────┐
│                                              │
│  [1] Security headers (helmet)               │
│        ↓                                     │
│  [2] CORS                                    │
│        ↓                                     │
│  [3] Body parser (express.json)              │
│        ↓                                     │
│  [4] Request ID / Logger                     │
│        ↓                                     │
│  [5] Rate limiter                            │
│        ↓                                     │
│  [6] Authentication  → req.user              │
│        ↓                                     │
│  [7] Authorization   → ตรวจ role/permission  │
│        ↓                                     │
│  [8] Validation      → ตรวจ body/params      │
│                                              │
└──────────────────────────────────────────────┘
   ↓
[ROUTE MATCH]      GET /api/orders/:id
   ↓
[CONTROLLER]       อ่าน req → เรียก service → แปลงผลเป็น response
   ↓
[SERVICE]          business rule ทั้งหมด
   ↓
[REPOSITORY]       query / ORM
   ↓
[DATABASE]
   ↓
   │  ผลลัพธ์ไหลย้อนกลับขึ้นมา
   ↓
[CONTROLLER]       res.status(200).json(...)
   ↓
[RESPONSE → CLIENT]

* ถ้าจุดไหนผิดพลาด → next(err) → กระโดดตรงไปที่ ↓
[CENTRAL ERROR HANDLER]  (err, req, res, next)
   ↓
[RESPONSE ERROR → CLIENT]
```

> **ให้มองภาพนี้ว่า** "request เดินเป็นเส้นตรงลงไปหา database แล้วเดินกลับขึ้นมา แต่ถ้าสะดุดตรงไหน มันจะกระโดดข้ามทุกอย่างไปโผล่ที่ห้องรับเรื่องร้องเรียนห้องเดียวเสมอ"

### 5.2 Middleware ทำงานยังไงในระดับ mechanism

Express เก็บ middleware ทั้งหมดไว้ใน **array เรียงตามลำดับที่ลงทะเบียน**
เมื่อ request เข้ามา Express จะเดิน array นั้นทีละตัว:

```
pseudocode (สั้นมาก):

stack = [mw1, mw2, mw3, routeHandler, errorHandler]
i = 0
next() → เรียก stack[i++] ตัวถัดไปที่ path ตรงกัน
```

หมายความว่า:

- **`next()` ไม่ได้ "return"** — มันคือการเรียกตัวถัดไป ดังนั้น code หลัง `next()` ยังทำงานต่อได้ (สาเหตุ bug `ERR_HTTP_HEADERS_SENT` บ่อยมาก)
- **ถ้าไม่เรียก `next()` และไม่ตอบ response** → pipeline หยุดนิ่ง = request ค้าง
- **`next(err)`** → Express ข้าม middleware ปกติทั้งหมดที่เหลือ กระโดดไปหา middleware ที่มี 4 พารามิเตอร์ตัวแรกที่เจอ

### 5.3 Middleware มีกี่ระดับ

```
Application-level    app.use(mw)                 → ทุก request
Router-level         router.use(mw)              → เฉพาะ router นั้น
Route-level          router.get('/x', mw, ctrl)  → เฉพาะ route นั้น
Built-in             express.json(), express.static()
Third-party          cors, helmet, morgan, express-rate-limit
Error-handling       (err, req, res, next)       → ต้องอยู่ล่างสุดเสมอ
```

> **ให้มองภาพนี้ว่า** "ด่านตรวจมีทั้งแบบตั้งที่ประตูใหญ่ของสนามบิน ตั้งเฉพาะโซน และตั้งเฉพาะเกทเดียว — เลือกให้ถูกระดับจะได้ไม่ตรวจซ้ำหรือตรวจเกินจำเป็น"

### 5.4 Central Error Handler

```
[Controller throw]──┐
[Service throw]─────┤
[Repository throw]──┼──→ next(err) ──→ [CENTRAL ERROR HANDLER]
[Validation fail]───┤                          ↓
[Auth fail]─────────┘                  แปลง error → HTTP status
                                               ↓
                                       log (พร้อม requestId)
                                               ↓
                                       ตอบ client ด้วย format เดียวกัน
```

> **ให้มองภาพนี้ว่า** "ไม่ว่าพังที่ชั้นไหน ทุก error ต้องออกทางประตูเดียว เพื่อให้ client เห็น format เดียว และ log มีรูปแบบเดียว"

ทำไมต้องรวมที่เดียว:

| เหตุผล | ผลลัพธ์ |
|---|---|
| Response format เดียวกันทั้งระบบ | Frontend เขียน error handling ครั้งเดียว |
| Log ครบทุก error | ไม่มี error เงียบหาย |
| ซ่อน internal detail | ไม่หลุด stack trace / SQL ออกไปหา client |
| แก้ที่เดียว | เปลี่ยน format หรือเพิ่ม alert ไม่ต้องไล่แก้ 50 ไฟล์ |

### 5.5 Flow ของ Validation

```
[Request Body]
      ↓
[Schema Validation]      รูปแบบถูกไหม (type, required, format, ขอบเขต)
      ↓  ผ่าน
[Sanitization]           ตัด field แปลกปลอม / trim / normalize
      ↓
[Controller]
      ↓
[Service]                Business rule validation
                         เช่น "ยอดคงเหลือพอไหม" "อีเมลนี้มีคนใช้แล้วหรือยัง"
```

> **ให้มองภาพนี้ว่า** "Validation มี 2 ชั้นคนละหน้าที่ — ชั้นแรกถามว่า 'ใบสมัครกรอกครบไหม' ชั้นที่สองถามว่า 'คุณสมบัติผ่านไหม'"

จุดที่คนตอบผิดในการสัมภาษณ์: คิดว่า validation มีชั้นเดียว
ความจริงคือ **schema validation อยู่ขอบนอก (Controller/Middleware) ส่วน business validation อยู่ใน Service** เพราะ business rule ต้องใช้ข้อมูลจาก database ซึ่ง Controller ไม่ควรไปแตะ

### 5.6 Authentication vs Authorization Middleware

```
[Request + Token]
      ↓
[AUTHENTICATION MIDDLEWARE]
      │  ตรวจ token ถูกต้อง / ยังไม่หมดอายุ
      │  หา user จาก token
      ↓  สำเร็จ → แปะ req.user
[AUTHORIZATION MIDDLEWARE]
      │  req.user มี role/permission ที่ต้องใช้กับ route นี้ไหม
      ↓  สำเร็จ
[ROUTE / CONTROLLER]

ล้มเหลวที่ชั้นแรก → 401 Unauthorized  (ไม่รู้ว่าคุณเป็นใคร)
ล้มเหลวที่ชั้นสอง → 403 Forbidden     (รู้ว่าคุณเป็นใคร แต่คุณทำไม่ได้)
```

> **ให้มองภาพนี้ว่า** "ชั้นแรกถามว่า 'คุณคือใคร' ชั้นที่สองถามว่า 'คนแบบคุณทำสิ่งนี้ได้หรือเปล่า' — ถามสลับกันไม่ได้"

(รายละเอียดลึกเรื่อง token/session/RBAC อยู่ใน PART 7)

---

## 6. Example — Scenario จากงานจริง

### Scenario A: ระบบสั่งอาหาร — `POST /api/orders`

**โจทย์:** ลูกค้ากดสั่งอาหาร ระบบต้องตัดสต็อก สร้าง order คิดส่วนลด และส่งอีเมลยืนยัน

ถ้าเขียนแบบ junior ทั่วไป ทุกอย่างจะกองอยู่ใน route handler เดียว 200 บรรทัด
ลองดูว่าถ้าแยก layer แล้วแต่ละชั้นถือ "ความรู้" อะไรบ้าง:

| Layer | ทำอะไรใน scenario นี้ | ไม่ทำอะไร |
|---|---|---|
| **Middleware** | ตรวจ token, ตรวจ role `customer`, validate body (มี items ไหม, quantity > 0 ไหม) | ไม่คิดส่วนลด ไม่แตะ DB |
| **Controller** | อ่าน `req.user.id` + `req.body` → เรียก `orderService.createOrder(...)` → แปลงผลเป็น `201 Created` | ไม่คิดราคา ไม่เขียน query |
| **Service** | เช็คสต็อกพอไหม, คิดส่วนลดตามโปรโมชัน, เริ่ม transaction, สั่ง repository บันทึก, ยิง event ส่งอีเมล | ไม่รู้ว่า HTTP status คืออะไร |
| **Repository** | `findProductsByIds`, `insertOrder`, `decrementStock` | ไม่รู้ว่าโปรโมชันคืออะไร |

**ผลที่ได้จริงในงาน:**

- วันหนึ่ง PM บอก "ขอเพิ่มช่องทางสั่งผ่าน LINE bot ด้วย"
  → คุณเขียน controller ใหม่ตัวเดียว เรียก `orderService.createOrder` ตัวเดิม **business logic ไม่ต้องแตะเลย**
- วันหนึ่ง DBA บอก "ย้ายจาก MySQL ไป PostgreSQL"
  → คุณแก้แค่ Repository
- วันหนึ่ง QA ถาม "เทสว่าส่วนลดคิดถูกไหมยังไง"
  → เทส Service ตรง ๆ ไม่ต้องยิง HTTP ไม่ต้องต่อ DB จริง (mock repository)

**นี่คือคำตอบของคำถาม "ทำไมต้องแยก Controller/Service/Repository" — ไม่ใช่เพราะสวย แต่เพราะ 3 ข้อข้างบนนี้เกิดขึ้นจริงทุกโปรเจกต์**

### Scenario B: ลำดับ middleware ผิด → production พัง

ทีมหนึ่งเขียนแบบนี้:

```
pseudocode:
app.use(rateLimiter)
app.use(authenticate)
app.use(express.json())      ← body parser อยู่หลัง auth
```

ผลคือ endpoint ที่ต้องอ่าน `req.body` ใน authenticate (เช่น refresh token ที่ส่งมาใน body) ได้ `req.body === undefined` ตลอด
Debug กัน 2 วันเพราะไปมองที่ frontend ว่า "ไม่ได้ส่ง body มา"

**บทเรียน:** ปัญหา middleware ส่วนใหญ่ไม่ใช่ middleware เขียนผิด แต่เป็น **ลำดับผิด**

### Scenario C: Error ไม่ถูกจับ → server ล่ม

```
pseudocode:
router.get('/users/:id', async (req, res) => {
  const user = await service.getUser(req.params.id)   ← ถ้า throw ที่นี่
  res.json(user)
})
```

ใน Express เวอร์ชันที่ไม่ได้จัดการ async error ให้อัตโนมัติ
promise rejection ในนี้ **จะไม่ไปถึง error handler** กลายเป็น unhandled rejection
ผลคือ request ค้าง client timeout และ log ไม่มีอะไรเลย

วิธีแก้เชิงแนวคิด: ห่อ async handler ทุกตัวด้วย wrapper ที่ `catch(next)` ให้อัตโนมัติ หรือใช้ Express เวอร์ชันที่รองรับ async error handling แล้ว — แต่ไม่ว่าทางไหน **ต้องรู้ว่าตัวเองใช้ทางไหนอยู่** อย่าเดา

---

## 7. Compare

### 7.1 Controller vs Service vs Repository

| | Controller | Service | Repository |
|---|---|---|---|
| **คำถามที่มันตอบ** | "request นี้ต้องทำอะไร และตอบอะไรกลับ" | "กฎธุรกิจว่ายังไง" | "ข้อมูลเก็บ/ดึงยังไง" |
| **รู้จัก HTTP ไหม** | ✅ รู้ | ❌ ไม่ควรรู้ | ❌ ไม่ควรรู้ |
| **รู้จัก SQL/ORM ไหม** | ❌ ไม่ควร | ❌ ไม่ควร | ✅ รู้ |
| **รู้จัก business rule ไหม** | ❌ ไม่ควร | ✅ รู้ | ❌ ไม่ควร |
| **เทสยังไง** | Integration test ยิง HTTP | Unit test (mock repo) | Integration test กับ DB จริง/test DB |
| **เปลี่ยนเมื่อ** | เปลี่ยน API contract | เปลี่ยนกฎธุรกิจ | เปลี่ยน database |
| **บรรทัดควรยาวแค่ไหน** | สั้นมาก (10–20 บรรทัด) | ยาวได้ | สั้น–กลาง |

### 7.2 Middleware vs Controller

| | Middleware | Controller |
|---|---|---|
| ใช้กับ | หลาย route | route เดียว |
| ตัวอย่างงาน | auth, log, CORS, rate limit, validate | ประกอบ response ของ endpoint นั้น |
| จบ request ได้ไหม | ได้ (แต่ปกติแค่ `next()`) | ได้ (หน้าที่หลัก) |
| รู้จัก business logic | ไม่ควร | นิดเดียว (แค่เรียก service) |

### 7.3 Express vs Framework อื่น

| | Express | NestJS | Fastify | Spring Boot |
|---|---|---|---|---|
| บังคับโครงสร้าง | ไม่บังคับเลย | บังคับมาก (module/DI) | ไม่บังคับ | บังคับมาก |
| เรียนรู้เร็ว | เร็วที่สุด | ช้ากว่า | เร็ว | ช้ากว่า |
| เหมาะเมื่อ | ทีมเล็ก / เริ่มเร็ว / ควบคุมเองได้ | ทีมใหญ่ / โปรเจกต์อายุยาว / อยากได้มาตรฐานเดียว | ต้องการ throughput สูงและ schema validation ในตัว | องค์กรที่ใช้ Java อยู่แล้ว |
| ความเสี่ยง | โครงสร้างพังถ้าไม่มีวินัยทีม | overhead สำหรับงานเล็ก | ecosystem เล็กกว่า Express | หนักสำหรับ service เล็ก |

> **ห้ามตอบว่า "NestJS ดีกว่า Express"** — ต้องตอบว่า "NestJS ดีกว่าเมื่อทีมใหญ่และต้องการโครงสร้างบังคับ แต่ Express ดีกว่าเมื่อทีมเล็กและต้องการเริ่มเร็วโดยควบคุมทุกอย่างเอง"

### 7.4 Validation Library แนวต่าง ๆ

| แนว | ทำงานตรงไหน | trade-off |
|---|---|---|
| Schema validator (Zod / Joi / Yup) | Middleware หรือต้น Controller | ชัดเจน reuse ได้ แต่ต้องเขียน schema แยก |
| Validator บน model/ORM | Repository/DB layer | จับได้แน่นอน แต่ error มาช้า (ถึง DB แล้ว) |
| Validate ด้วยมือใน Controller | Controller | เริ่มง่าย แต่ซ้ำซ้อนและหลุดง่ายเมื่อโตขึ้น |

**หลักคิด:** validate ให้เร็วที่สุดเท่าที่ทำได้ (fail fast) แต่ business rule ที่ต้องพึ่งข้อมูลใน DB ต้องอยู่ที่ Service เท่านั้น

### 7.5 REST API Design — ถูก vs ผิด

| ผิด | ถูก | เหตุผล |
|---|---|---|
| `POST /getUser?id=1` | `GET /users/1` | resource เป็นคำนาม, method บอกกริยา |
| `POST /deleteOrder` | `DELETE /orders/123` | ใช้ HTTP method ให้สื่อความหมาย |
| `GET /users/1/delete` | `DELETE /users/1` | GET ต้องไม่เปลี่ยนแปลงข้อมูล |
| `/user` บ้าง `/users` บ้าง | เลือก plural ให้เหมือนกันทั้งระบบ | consistency สำคัญกว่าถูกตามตำรา |
| ตอบ 200 พร้อม `{error: "..."}` | ตอบ 4xx/5xx ตามจริง | client ต้องเช็ค status ได้ |
| `GET /users` คืน 100,000 แถว | `GET /users?page=2&limit=20` | ต้องมี pagination เสมอ |
| เปลี่ยน response field แล้ว deploy เลย | ทำ versioning `/api/v1/...` | ไม่พัง client เก่า |

### 7.6 HTTP Method + ความหมายที่ต้องตอบได้

| Method | ใช้เมื่อ | Idempotent | ตัวอย่าง |
|---|---|---|---|
| GET | อ่านอย่างเดียว | ✅ | `GET /orders/1` |
| POST | สร้างใหม่ / สั่งให้เกิด action | ❌ | `POST /orders` |
| PUT | แทนที่ทั้ง resource | ✅ | `PUT /users/1` |
| PATCH | แก้บางส่วน | มักจะ ✅ แต่ไม่รับประกัน | `PATCH /users/1` |
| DELETE | ลบ | ✅ | `DELETE /users/1` |

**Idempotent → ยิงซ้ำกี่ครั้ง state ปลายทางเหมือนเดิม**
สำคัญมากตอนพูดเรื่อง retry: ถ้า network timeout แล้ว client retry, POST ที่ไม่ idempotent จะสร้าง order ซ้ำ — แก้ด้วย idempotency key

---

## 8. Common Mistakes

| # | สิ่งที่ Junior มักทำ | ทำไมถึงเป็นปัญหา | ควรทำแทน |
|---|---|---|---|
| 1 | ยัดทุกอย่างไว้ใน route handler | ไฟล์เดียว 500 บรรทัด, เทสไม่ได้, reuse ไม่ได้ | แยก Controller / Service / Repository |
| 2 | เรียก `res.json()` ใน Service | Service ผูกกับ HTTP ทันที ใช้ซ้ำจาก cron/queue ไม่ได้ | Service คืนค่า/โยน error ให้ Controller แปลงเป็น HTTP |
| 3 | วาง error handler ไว้บนสุด | Express เดินบนลงล่าง error handler ต้องอยู่ล่างสุด ไม่งั้นไม่มีอะไรวิ่งเข้ามันเลย | วางหลัง route ทั้งหมด |
| 4 | Error handler รับ 3 พารามิเตอร์ | Express ดูจากจำนวนพารามิเตอร์ ถ้าไม่ใช่ 4 ตัว มันคือ middleware ธรรมดา | ต้องเป็น `(err, req, res, next)` ครบ 4 |
| 5 | ลืม `next()` ใน middleware | request ค้างจน timeout โดยไม่มี error log | ทุก path ใน middleware ต้องจบด้วย response หรือ `next()` |
| 6 | เรียก `next()` แล้วเขียน code ต่อโดยไม่ `return` | อาจตอบ response ซ้ำ → `ERR_HTTP_HEADERS_SENT` | ใช้ `return next()` |
| 7 | วาง `express.json()` ไว้หลัง route | route อ่าน `req.body` ไม่ได้ | วาง body parser ก่อน route เสมอ |
| 8 | วาง auth middleware ไว้บนสุดของ app | `/health`, `/login` ก็โดน 401 ไปด้วย | ใส่ auth ระดับ router/route ไม่ใช่ระดับ app |
| 9 | วาง rate limiter หลัง auth | attacker ยิง request ไม่จำกัดให้ระบบไป verify token ทุกครั้ง = เปลืองทรัพยากร | rate limiter ควรอยู่ก่อน auth |
| 10 | ใช้ try/catch ในทุก controller แล้ว `res.status(500)` เอง | format error ไม่เหมือนกัน, log กระจัดกระจาย | โยนต่อไปหา central error handler |
| 11 | ส่ง `err.stack` กลับไปหา client | เปิดเผยโครงสร้างภายใน/ชื่อไฟล์/query | ตอบ message กลาง ๆ + log detail ฝั่ง server |
| 12 | Validate แค่ฝั่ง frontend | frontend ถูก bypass ได้ด้วยการยิง API ตรง | **ต้อง validate ฝั่ง server เสมอ** frontend คือ UX ไม่ใช่ security |
| 13 | ใช้ status 200 ตลอด แล้วใส่ `success: false` | client, proxy, monitoring แยกไม่ออกว่าพังหรือไม่ | ใช้ status code ตามความหมายจริง |
| 14 | ทำ business logic ใน middleware | middleware กลายเป็นที่ซ่อน logic ที่ไม่มีใครเทส | middleware ทำแค่งาน cross-cutting |
| 15 | สร้าง connection database ใหม่ทุก request | connection หมด pool, ระบบล่มตอน load สูง | ใช้ connection pool ตัวเดียวทั้ง app |
| 16 | ไม่ใส่ pagination ใน list endpoint | วันแรกเร็ว วันที่ข้อมูล 1 ล้านแถว server ตาย | ใส่ limit default เสมอ |
| 17 | แยกโฟลเดอร์ตามชนิดไฟล์อย่างเดียวจนหา feature ไม่เจอ | ต้องเปิด 5 โฟลเดอร์เพื่อแก้ feature เดียว | เมื่อโปรเจกต์โต ให้แยกตาม feature/module |
| 18 | เอา secret ใส่ใน code | หลุดขึ้น git | ใช้ environment variable / secret manager (PART 7) |

---

## 9. Debugging — ไล่ตามลำดับนี้

### 9.1 อาการ: request ค้าง ไม่มี response (client timeout)

```
[1] มี middleware ตัวไหนไม่เรียก next() และไม่ตอบ response ไหม
      ↓
[2] มี async ที่ throw แล้วไม่ถูก catch ไหม (unhandled rejection)
      ↓
[3] มี await ที่รอ external service ที่ไม่ตั้ง timeout ไหม
      ↓
[4] Database connection pool เต็มหรือเปล่า (รอ connection อยู่)
      ↓
[5] Event loop โดน block ด้วยงาน CPU หนักไหม (ดู PART 5)
```

> **ให้มองภาพนี้ว่า** "request ค้าง แปลว่ามีใครสักคนใน pipeline รับงานไปแล้วไม่ยอมส่งต่อและไม่ยอมตอบ — งานคือตามหาว่าใคร"

### 9.2 อาการ: ได้ 404 ทั้งที่ route มีอยู่

```
[1] path ตรงจริงไหม (ตัวพิมพ์เล็กใหญ่, / ท้าย, ขาด prefix ของ router)
      ↓
[2] app.use('/api', router) แล้วใน router เขียน '/api/users' ซ้ำหรือเปล่า
      ↓
[3] HTTP method ถูกไหม (frontend ส่ง POST แต่ประกาศ GET)
      ↓
[4] route ถูกประกาศ "หลัง" 404 handler หรือเปล่า
      ↓
[5] route แบบ dynamic บังคนอื่นไหม เช่น /users/:id ประกาศก่อน /users/me
```

ข้อ 5 เป็นกับดักคลาสสิก: `/users/:id` ที่ประกาศก่อนจะกลืน `/users/me` ไปด้วย เพราะ `me` ถูกมองเป็น `id`
**กฎ: route ที่เฉพาะเจาะจงกว่า ต้องประกาศก่อน route ที่กว้างกว่าเสมอ**

### 9.3 อาการ: `req.body` เป็น undefined / {}

```
[1] มี express.json() ไหม และอยู่ "ก่อน" route หรือเปล่า
      ↓
[2] Client ส่ง Content-Type: application/json มาไหม
      ↓
[3] เป็น form-data / multipart หรือเปล่า (ต้องใช้ parser คนละตัว)
      ↓
[4] Method เป็น GET หรือเปล่า (GET ไม่ควรมี body)
```

### 9.4 อาการ: ได้ 401 / 403 ทั้งที่ login แล้ว

```
[1] 401 หรือ 403? → 401 = token มีปัญหา, 403 = token โอเคแต่สิทธิ์ไม่พอ
      ↓
[2] Token ถูกส่งมาใน header จริงไหม (ดู request ใน Network tab)
      ↓
[3] Token หมดอายุหรือยัง
      ↓
[4] auth middleware ถูกใส่ใน route นี้จริงไหม / ใส่ซ้ำสองรอบไหม
      ↓
[5] req.user ถูก set จริงไหม (log ดูใน authorization middleware)
      ↓
[6] role/permission ที่ route ต้องการ ตรงกับที่ user มีไหม
```

### 9.5 อาการ: `ERR_HTTP_HEADERS_SENT`

```
[1] มีจุดไหนตอบ response 2 ครั้งในเส้นทางเดียวไหม
      ↓
[2] เรียก next() แล้วไม่ return แล้วยังเขียน res.json() ต่อไหม
      ↓
[3] error handler ตอบ response ทั้งที่ controller ตอบไปแล้ว
      ↓
[4] async callback ที่ resolve ช้า แล้วมาตอบซ้ำทีหลัง
```

### 9.6 อาการ: API ช้าลงเรื่อย ๆ เมื่อ traffic เพิ่ม

```
[1] ช้าที่ชั้นไหน → ใส่ timing log แยกเป็น Controller / Service / Repository
      ↓
[2] ถ้าช้าที่ Repository → ดู query, index, N+1 (PART 8)
      ↓
[3] ถ้าช้าที่ Service → มีการเรียก external API แบบ sequential ที่ควรทำขนานไหม
      ↓
[4] ถ้าช้าทุกชั้นเท่า ๆ กัน → event loop โดน block หรือ pod ทรัพยากรไม่พอ
      ↓
[5] ดู connection pool size กับจำนวน concurrent request
```

**หลักการเดียวที่ต้องจำ: อย่าเดาว่าช้าตรงไหน — วัดก่อนเสมอ** (measure before optimize)

### 9.7 เครื่องมือที่ควรพูดถึงตอนสัมภาษณ์

| เครื่องมือ/วิธี | ใช้ตอบคำถามว่า |
|---|---|
| Request ID middleware | "log บรรทัดไหนบ้างที่เป็นของ request เดียวกัน" |
| Structured log (JSON) | "ค้นหา error แบบมีเงื่อนไขได้ไหม" |
| Timing log ต่อ layer | "ช้าที่ชั้นไหน" |
| Health check endpoint | "service ยังมีชีวิตอยู่ไหม" (ดู PART 14) |
| Browser Network tab | "frontend ส่งอะไรมาจริง ๆ" |
| curl / Postman | "ปัญหาอยู่ที่ frontend หรือ backend" |

---

## 10. Interview Questions

### 🟢 Junior

1. Express คืออะไร และต่างจากการใช้ Node.js เปล่า ๆ ยังไง
2. Middleware คืออะไร ยกตัวอย่างที่ใช้จริง 3 อย่าง
3. `next()` ทำอะไร ถ้าไม่เรียกจะเกิดอะไรขึ้น
4. `req.params` `req.query` `req.body` ต่างกันยังไง ใช้ตอนไหน
5. ทำไมต้องมี `express.json()` และมันต้องอยู่ตรงไหนของ pipeline
6. 401 กับ 403 ต่างกันยังไง
7. GET กับ POST ต่างกันยังไงนอกจากชื่อ
8. REST API ที่ดี URL ควรหน้าตาเป็นยังไง

### 🟡 Mid

9. อธิบาย request lifecycle ของ Express ตั้งแต่ client ยิงมาจนได้ response
10. ทำไมต้องแยก Controller / Service / Repository — ถ้าไม่แยกจะเกิดอะไรขึ้น
11. Central error handler คืออะไร ทำไมต้องรวม error ไว้ที่เดียว
12. ถ้าลำดับ middleware เรียงผิด จะเกิดปัญหาอะไรได้บ้าง ยกตัวอย่าง 2 กรณี
13. Validation ควรอยู่ชั้นไหน — middleware, controller หรือ service เพราะอะไร
14. จัดการ async error ใน Express ยังไง ทำไมบางทีมันไม่เข้า error handler
15. Authentication middleware กับ Authorization middleware ต่างกันยังไง ลำดับต้องเป็นแบบไหน
16. ออกแบบ endpoint สำหรับ "ยกเลิกออเดอร์" ยังไง และทำไมไม่ใช้ `POST /cancelOrder`
17. Route `/users/me` กับ `/users/:id` ควรประกาศตัวไหนก่อน เพราะอะไร

### 🔴 Senior

18. โปรเจกต์ Express ที่มี 200 endpoint ควรจัดโครงสร้างโฟลเดอร์ยังไง และเปลี่ยนโครงสร้างตอนไหน
19. ถ้า Service ต้องเรียก Service อื่น จะกันไม่ให้เกิด circular dependency ยังไง
20. ระบบเดิมมี business logic กองอยู่ใน controller ทั้งหมด จะ refactor ยังไงโดยไม่หยุด release
21. ออกแบบ error contract ระหว่าง backend กับ frontend ยังไงให้ frontend จัดการได้ครั้งเดียวจบ
22. POST ที่ client retry เพราะ timeout ทำให้เกิด order ซ้ำ — แก้ยังไงในระดับ API design
23. เมื่อไรควรย้ายจาก Express ไป NestJS/Fastify และเมื่อไรไม่ควร
24. ทำ observability ให้ Express service ยังไง — log/metric/trace อะไรบ้างที่ขาดไม่ได้
25. Middleware ที่ทำงานหนัก (เช่น verify token ที่ต้องยิงไป auth server) จะลด latency ยังไง
26. จะทำ versioning ของ REST API ยังไง และจะ deprecate version เก่ายังไงไม่ให้ client พัง

---

## 11. Answer Like a Developer

### โครงการตอบที่ใช้ได้กับเกือบทุกคำถาม Express

```
[1] นิยามสั้น 1 ประโยค
      ↓
[2] บอกว่ามันแก้ปัญหาอะไร (ถ้าไม่มีมันจะลำบากยังไง)
      ↓
[3] อธิบาย flow สั้น ๆ
      ↓
[4] ยกตัวอย่างจากงานจริง
      ↓
[5] บอก trade-off / ข้อควรระวัง
```

> **ให้มองภาพนี้ว่า** "คำตอบที่ดีไม่ใช่การบอกว่ามันคืออะไร แต่คือการเล่าว่าโลกที่ไม่มีมันเป็นยังไง"

### ตัวอย่าง — "ทำไมต้องแยก Controller / Service / Repository"

**อย่าตอบว่า:** "เพราะเป็น best practice ครับ / เพราะ clean code"
(นี่คือคำตอบที่ interviewer ได้ยินทุกวันและไม่ได้บอกอะไรเลย)

**ตอบแบบนี้:**

1. **นิยาม** — "มันคือการแบ่งความรับผิดชอบ: Controller คุยกับ HTTP, Service ถือกฎธุรกิจ, Repository คุยกับ database"
2. **ปัญหาที่แก้** — "ถ้าไม่แยก business logic จะผูกติดกับ req/res ทำให้เรียกใช้จากที่อื่นไม่ได้ และเทสต้องยิง HTTP จริงทุกครั้ง"
3. **flow** — "request → controller อ่าน input → service ตัดสินใจ → repository ดึง/บันทึกข้อมูล → controller แปลงผลเป็น status code"
4. **ตัวอย่างจริง** — "ตอนที่ทีมต้องเพิ่มช่องทางสั่งซื้อผ่าน scheduled job เราเรียก service ตัวเดิมได้เลยเพราะมันไม่รู้จัก HTTP"
5. **trade-off** — "ข้อเสียคือสำหรับ CRUD ง่าย ๆ มันเพิ่มไฟล์และ boilerplate ผมเลยจะแยกเต็มรูปแบบเมื่อ logic เริ่มมีเงื่อนไขมากกว่าการ map ข้อมูลตรง ๆ"

ข้อ 5 คือสิ่งที่แยก mid-level ออกจาก junior — **การยอมรับว่าทุกอย่างมีต้นทุน**

### ตัวอย่าง — "ลำดับ middleware ผิดแล้วเกิดอะไร"

ตอบเป็น 3 กรณีที่เห็นภาพ:

| เรียงผิดแบบ | ผลที่เกิด |
|---|---|
| body parser อยู่หลัง route | `req.body` undefined ทั้งที่ client ส่งมาจริง |
| auth อยู่ก่อน rate limiter | ผู้ไม่หวังดียิงรัว ๆ ทำให้ระบบ verify token หนักโดยไม่จำเป็น |
| error handler อยู่ก่อน route | error ไม่มีทางเข้า handler เพราะมันอยู่ข้างบนไปแล้ว |
| auth ระดับ app อยู่เหนือ `/health` | health check โดน 401 → load balancer คิดว่า service ตาย → ถอด pod ออก |

กรณีสุดท้ายคือคำตอบที่ทำให้ interviewer พยักหน้า เพราะมันเชื่อม Express → Infrastructure

### ประโยคที่ควรพูดและไม่ควรพูด

| ❌ อย่าพูด | ✅ พูดแบบนี้แทน |
|---|---|
| "ผมใช้ Express เป็น" | "ผมออกแบบ layer และ middleware pipeline ของ Express service ได้" |
| "แยก layer เพราะ clean" | "แยก layer เพราะเทสง่ายขึ้นและเปลี่ยน database ได้โดยไม่แตะ business logic" |
| "error ผมใส่ try/catch ทุกที่" | "ผมโยน error ที่มี type ชัดเจนขึ้นไป แล้วแปลงเป็น HTTP ที่ central error handler ที่เดียว" |
| "validate ที่ frontend พอ" | "validate ทั้งสองฝั่ง — frontend เพื่อ UX, backend เพื่อความถูกต้องเพราะ frontend ถูก bypass ได้" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้องสัมภาษณ์:

- **Express = routing + middleware** วางทับ Node HTTP — นอกนั้นไม่บังคับอะไรเลย
- **ทุกอย่างคือ middleware** รวมถึง route handler และ error handler
- **ลำดับสำคัญที่สุด** — Express เดินจากบนลงล่างตามที่เขียน ไม่มีการเรียงใหม่
- ลำดับมาตรฐาน: **security header → CORS → body parser → log → rate limit → auth → authorization → validate → route → 404 → error handler (ล่างสุด)**
- `next()` = ไปด่านถัดไป, `next(err)` = กระโดดไป error handler, **ไม่เรียกทั้งคู่ = request ค้าง**
- Error handler ต้องมี **4 พารามิเตอร์** และอยู่ **ล่างสุด**
- แยก layer: **Controller = HTTP, Service = business rule, Repository = database**
  เหตุผลจริง 3 ข้อ: **เทสง่าย / reuse จากช่องทางอื่นได้ / เปลี่ยน database ได้**
- Service ห้ามรู้จัก `req`/`res`, Controller ห้ามรู้จัก SQL
- Validation มี 2 ชั้น: **schema (ขอบนอก)** และ **business rule (ใน service)**
- **Server-side validation บังคับเสมอ** — frontend validation คือ UX ไม่ใช่ security
- 401 = ไม่รู้ว่าคุณเป็นใคร, 403 = รู้แล้วแต่คุณทำไม่ได้
- REST: resource เป็นคำนาม, method บอกกริยา, list ต้องมี pagination, error ต้องใช้ status code จริง
- `/users/me` ต้องประกาศก่อน `/users/:id`
- POST ไม่ idempotent → retry แล้วซ้ำ → ใช้ idempotency key
- Folder structure: เริ่มแยกตาม layer, พอโตให้แยกตาม feature/module

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **Express = ท่อ ไม่ใช่กล่อง** — request ไหลผ่าน middleware ทีละด่านตามลำดับที่เขียน
2. **Middleware = ด่านตรวจสนามบิน** — ตรวจบัตรก่อนตรวจสิทธิ์ สแกนกระเป๋าทีหลัง เรียงผิดคือพัง
3. **`next()` คือประทับตราให้ผ่าน** — ไม่ประทับและไม่ตอบ = ผู้โดยสารยืนรอตลอดกาล
4. **Controller/Service/Repository = รับออร์เดอร์ / เชฟ / คนเบิกของ** — แยกเพื่อเทสง่าย reuse ได้ เปลี่ยน DB ได้
5. **Error ทุกจุดออกประตูเดียว** — central error handler อยู่ล่างสุด รับ 4 พารามิเตอร์

### Keyword สั้น

**Middleware** → ด่านตรวจระหว่างทาง
**next()** → ส่งต่อด่านถัดไป
**next(err)** → กระโดดไปห้องรับเรื่องร้องเรียน
**Route** → จับคู่ method + path
**Controller** → คุยกับ HTTP อย่างเดียว
**Service** → กฎธุรกิจอย่างเดียว
**Repository** → คุยกับ database อย่างเดียว
**Validation** → ตรวจรูปแบบที่ขอบนอก ตรวจกฎธุรกิจข้างใน
**Central Error Handler** → ประตูออกเดียวของทุก error
**Auth Middleware** → คุณเป็นใคร (401)
**Authorization Middleware** → คุณทำได้ไหม (403)
**Idempotent** → ยิงซ้ำผลเหมือนเดิม
**REST** → resource เป็นคำนาม method เป็นกริยา
**Layered Architecture** → แต่ละชั้นรู้เรื่องของตัวเองเท่านั้น

### Flow ที่ต้องวาดได้จากความจำ

```
Request
   ↓
Middleware (security → cors → body → log → limit → auth → authz → validate)
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
   ↓
Response

(ผิดพลาดที่ไหนก็ได้ → Central Error Handler → Response)
```

> **ให้มองภาพนี้ว่า** "งานของ Express คือพา request เดินลงบันไดทีละขั้นให้ถึง database แล้วพากลับขึ้นมา โดยมีทางหนีไฟเส้นเดียวไว้ใช้ตอนพัง"

---

[← สารบัญ](./00-README-TOC.md)
