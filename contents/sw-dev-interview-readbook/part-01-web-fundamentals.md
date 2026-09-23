# PART 1 — WEB FUNDAMENTALS

> ตำแหน่งในภาพใหญ่: **ชั้นกลางระหว่าง Frontend กับ Backend** — ภาษาที่ทั้งสองฝั่งใช้คุยกัน ถ้าชั้นนี้ไม่แน่น จะ debug ระบบไม่เป็นเลย

---

## 1. Big Picture

Frontend รันอยู่บนเครื่องผู้ใช้ Backend รันอยู่บน server ของบริษัท — คนละเครื่อง คนละที่ อาจอยู่คนละทวีป

**คำถามคือ: สองฝั่งนี้คุยกันยังไง?**

คำตอบคือ **HTTP** — ภาษากลางของเว็บ

ลองนึกภาพง่าย ๆ ว่า HTTP คือ **การส่งจดหมาย**:

| ในจดหมาย | ใน HTTP | ตัวอย่าง |
|---|---|---|
| ที่อยู่ปลายทาง | URL | `https://api.shop.com/orders/123` |
| เจตนาว่าจะทำอะไร | Method | GET (ขอดู), POST (สร้างใหม่), DELETE (ลบ) |
| ข้อมูลบนซองจดหมาย | Header | ใครส่ง, token คืออะไร, เนื้อหาเป็นชนิดไหน |
| เนื้อจดหมาย | Body | `{ "name": "ข้าวผัด", "qty": 2 }` |
| จดหมายตอบกลับ | Response | สถานะ + ข้อมูล |
| ตราประทับผลลัพธ์ | Status Code | 200 (สำเร็จ), 404 (หาไม่เจอ), 500 (ฝั่งเราพัง) |

**กฎที่สำคัญที่สุดของ HTTP:**

> **Client ต้องเป็นฝ่ายเริ่มเสมอ และ Server ตอบกลับหนึ่งครั้งต่อหนึ่งคำขอ แล้วก็ลืมคุณทันที**

ที่ว่า "ลืมทันที" นี่แหละคือคำว่า **Stateless** — server ไม่จำว่าคุณเคยมาถามอะไรเมื่อกี้ ดังนั้นทุก request คุณต้องบอกใหม่หมดว่า "ฉันเป็นใคร" (นี่คือที่มาของ Cookie, Session และ Token)

ส่วน **REST** คือ "มารยาทการเขียน API" ที่คนส่วนใหญ่ตกลงใช้ร่วมกัน — ไม่ใช่กฎหมาย ไม่ใช่ technology แต่เป็นชุดข้อตกลงที่ทำให้คนอ่าน API แล้วเดาถูกโดยไม่ต้องอ่าน document

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย + ใช้ตอนไหน |
|---|---|---|
| **HTTP** | ภาษากลางของเว็บ | โปรโตคอลที่กำหนดว่า client กับ server จะส่งข้อความหากันในรูปแบบไหน |
| **HTTPS** | HTTP + เข้ารหัส | HTTP ที่ห่อด้วย TLS — ข้อมูลระหว่างทางถูกเข้ารหัส อ่านไม่ออกและแก้ไม่ได้ |
| **Request** | คำขอ | ข้อความที่ client ส่งไป: method + URL + header + body |
| **Response** | คำตอบ | ข้อความที่ server ส่งกลับ: status code + header + body |
| **Header** | ข้อมูลกำกับ | ข้อมูล "เกี่ยวกับ" ข้อความ เช่น ใครส่ง, ชนิดข้อมูล, token, cache |
| **Body** | เนื้อข้อมูล | ข้อมูลจริงที่ส่งไปหรือส่งกลับ ส่วนใหญ่เป็น JSON |
| **Query Parameter** | ตัวปรับแต่งคำขอ | ส่วนหลัง `?` ใช้กรอง/เรียง/แบ่งหน้า เช่น `?status=paid&page=2` |
| **Path Parameter** | ตัวระบุตัวตน | ส่วนหนึ่งของ path ที่ชี้ resource เฉพาะ เช่น `/orders/123` |
| **Cookie** | ป้ายชื่อที่ browser พกไว้ | ข้อมูลเล็ก ๆ ที่ server ฝากไว้กับ browser และ browser แนบกลับทุก request อัตโนมัติ |
| **Session** | ความจำฝั่ง server | สถานะผู้ใช้ที่เก็บไว้ที่ server โดยมี session id เป็นกุญแจ (มักเก็บใน cookie) |
| **Status Code** | รหัสผลลัพธ์ | ตัวเลข 3 หลักที่บอกว่าเกิดอะไรขึ้นกับ request นั้น |
| **URL** | ที่อยู่ของ resource | `https://api.shop.com:443/orders/123?full=true` |
| **Domain** | ชื่อที่คนอ่านได้ | `api.shop.com` — ชื่อแทน IP เพื่อให้คนจำได้ |
| **DNS** | สมุดโทรศัพท์ของเน็ต | ระบบแปลง domain → IP address |
| **IP Address** | เลขที่บ้านของเครื่อง | ที่อยู่ของเครื่องบนเครือข่าย เช่น `203.0.113.25` |
| **Port** | เลขห้องในบ้าน | ตัวเลขที่บอกว่าจะคุยกับโปรแกรมตัวไหนในเครื่องนั้น (80=HTTP, 443=HTTPS) |
| **REST** | สไตล์การออกแบบ API | ชุดข้อตกลงว่าจะมอง API เป็น "ทรัพยากร" แล้วใช้ HTTP method เป็นคำกริยา |
| **Resource** | สิ่งของในระบบ | สิ่งที่ API พูดถึง เช่น order, user, product — ใช้คำนาม พหูพจน์ |
| **Endpoint** | ประตูหนึ่งบาน | คู่ของ (method + path) ที่เรียกได้จริง เช่น `POST /orders` |
| **API Contract** | สัญญา | ข้อตกลงว่า request หน้าตาแบบไหน จะได้ response หน้าตาแบบไหน |
| **Stateless** | ไม่จำอะไรข้ามคำขอ | server ไม่เก็บบริบทของ request ก่อนหน้า ทุก request ต้องบอกตัวตนมาใหม่ |
| **Idempotent** | ทำซ้ำได้ผลเท่าเดิม | ยิงซ้ำกี่ครั้ง สถานะปลายทางเหมือนเดิม (GET, PUT, DELETE เป็น idempotent) |
| **TLS / SSL** | ชั้นเข้ารหัส | เทคโนโลยีที่ทำให้ HTTP กลายเป็น HTTPS |
| **CORS** | กติกาข้ามโดเมน | กฎของ browser ว่าเว็บจากโดเมนหนึ่งจะเรียก API อีกโดเมนได้แค่ไหน |

---

## 3. Mental Model

ให้มอง HTTP เป็น **"การสั่งของทางไปรษณีย์กับร้านที่ความจำสั้นมาก"**

ร้านนี้มีคุณสมบัติแปลก ๆ 3 ข้อ:

**1. ร้านจำคุณไม่ได้เลย (Stateless)**
ทุกครั้งที่คุณส่งจดหมายไป คุณต้องแนบบัตรประชาชนไปด้วยเสมอ เพราะร้านลืมคุณไปแล้วตั้งแต่จดหมายฉบับก่อน
→ นี่คือเหตุผลที่ทุก request ต้องแนบ Cookie หรือ Token

**2. ร้านตอบกลับด้วยรหัส ไม่ใช่คำบรรยาย (Status Code)**
ร้านไม่เขียนว่า "ขออภัย เราหาสินค้าไม่พบ" แต่ประทับตรา `404` แทน เพราะเครื่องต้องอ่านเข้าใจ ไม่ใช่แค่คน
→ รหัสหลักแรกบอกหมวด: 2=สำเร็จ, 3=ย้ายไปแล้ว, 4=คุณผิด, 5=เราผิด

**3. เจตนาอยู่บนซอง ไม่ใช่ในเนื้อจดหมาย (Method)**
คุณต้องเขียนไว้ที่หน้าซองว่าจะ "ขอดู" "สั่งใหม่" หรือ "ยกเลิก" — ร้านจะได้รู้ว่าต้องทำอะไรก่อนแกะซอง
→ นี่คือ GET / POST / DELETE

**ทีนี้ REST คืออะไรในภาพนี้?**

REST คือการตกลงว่า **"สิ่งของในร้านมีเลขรหัสชัดเจน และสิ่งที่คุณอยากทำกับมัน ให้บอกด้วยคำกริยามาตรฐาน"**

```
❌ ไม่ REST:  POST /getOrderById        (เอาคำกริยาไปใส่ใน URL)
❌ ไม่ REST:  POST /deleteOrder?id=123
✅ REST:     GET    /orders/123        (path = ของ, method = กริยา)
✅ REST:     DELETE /orders/123
```

**กฎที่ใช้ได้จริง:** *Path บอกว่า "ของอะไร" / Method บอกว่า "ทำอะไรกับมัน" / Query บอกว่า "เอาแบบไหน"*

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำที่ 1 — HTTP Request:
Method  = เจตนา   ("จะเอาไปทำอะไร")
URL     = ที่อยู่   ("ของชิ้นไหน")
Header  = ซองจดหมาย ("ใครส่ง เนื้อหาชนิดไหน")
Body    = เนื้อจดหมาย ("ข้อมูลจริง")

CLIENT
  ↓  Method + URL + Header + Body
SERVER
  ↓  Status + Header + Body
CLIENT
```

```
🧠 ภาพจำที่ 2 — Status Code:
2xx = "สำเร็จ"       👍
3xx = "ย้ายไปที่อื่น"  ➡️
4xx = "คุณส่งมาผิด"   🙋 (client ผิด)
5xx = "เราเองพัง"     🔥 (server ผิด)

จำเลขหลักแรกพอ ที่เหลือค่อยไล่
```

```
🧠 ภาพจำที่ 3 — 401 vs 403:
401 = "คุณเป็นใคร? ยังไม่ได้แสดงบัตร"   → ยามหน้าประตู
403 = "รู้แล้วว่าคุณเป็นใคร แต่ห้ามเข้า" → ยามที่ดูบัตรแล้วส่ายหัว
```

```
🧠 ภาพจำที่ 4 — Path vs Query:
Path  = เลขที่บ้าน   /orders/123     ← "หลังไหน"
Query = คำสั่งพิเศษ  ?sort=new&page=2 ← "เอาแบบไหน"
```

```
🧠 ภาพจำที่ 5 — Stateless:
Server = พนักงานที่ความจำเสื่อม
คุณต้องแสดงบัตรใหม่ทุกครั้งที่เดินเข้าไป

Request 1 → แสดงบัตร → ตอบ → ลืม
Request 2 → แสดงบัตร → ตอบ → ลืม
```

```
🧠 ภาพจำที่ 6 — HTTPS:
HTTP  = ส่งโปสการ์ด  (ใครหยิบมาก็อ่านได้)
HTTPS = ส่งในตู้เซฟล็อกกุญแจ (อ่านไม่ออก แก้ไม่ได้ และรู้ว่าส่งถึงร้านจริง)
```

---

## 5. How It Works

### 5.1 Flow เต็ม: Browser → DNS → Server → API → Response

```
[1] USER พิมพ์ / กดปุ่ม
        ↓
[2] BROWSER  ตรวจ cache ในเครื่องก่อน
        ↓  (ไม่มี cache)
[3] DNS LOOKUP   "app.shop.com คือ IP อะไร?"
        ↓        ถาม browser cache → OS cache → DNS resolver → root/TLD/authoritative
        ↓        ได้คำตอบ: 203.0.113.25
[4] TCP CONNECT  เปิดการเชื่อมต่อไปที่ 203.0.113.25 : 443
        ↓
[5] TLS HANDSHAKE  แลกกุญแจ + ตรวจ certificate ว่าเป็นร้านจริง
        ↓          (ขั้นนี้มีเฉพาะ HTTPS)
[6] HTTP REQUEST   GET /api/orders/123
        ↓          Header: Authorization, Accept, Cookie
[7] LOAD BALANCER  เลือกว่าจะส่งไป server เครื่องไหน
        ↓
[8] BACKEND ROUTE  จับคู่ว่า path นี้ใครดูแล
        ↓
[9] MIDDLEWARE     ตรวจ token → ตรวจ rate limit → validate input
        ↓
[10] BUSINESS LOGIC  ตรวจกฎธุรกิจ เช่น "order นี้เป็นของ user นี้จริงไหม"
        ↓
[11] DATABASE      SELECT * FROM orders WHERE id = 123
        ↓
[12] HTTP RESPONSE 200 OK
        ↓          Header: Content-Type: application/json
        ↓          Body:   { "id": 123, "status": "paid" }
[13] BROWSER       รับ response → parse JSON
        ↓
[14] FRONTEND      อัปเดต state
        ↓
[15] UI            หน้าจอเปลี่ยน
```

> **ให้มองภาพนี้ว่า** "ก่อนที่ข้อมูลจะกลับมาถึงตา มันต้องผ่านการหาที่อยู่ การสร้างท่อลับ การตรวจบัตร และการหยิบของจากคลัง — และแต่ละขั้นพังได้คนละแบบ"

**ตารางอ่านภาพนี้ให้เป็น (สำคัญตอน debug):**

| ขั้นที่พัง | อาการที่เห็น | มักเกิดจาก |
|---|---|---|
| 3 — DNS | `ERR_NAME_NOT_RESOLVED` | domain ผิด / DNS record ยังไม่ propagate |
| 4 — TCP | `ERR_CONNECTION_REFUSED` | server ไม่ได้รัน / port ผิด / firewall |
| 5 — TLS | `ERR_CERT_*` / คำเตือนไม่ปลอดภัย | certificate หมดอายุ / ชื่อไม่ตรง domain |
| 7 — LB | 502, 503 | ไม่มี backend ที่สุขภาพดีให้ส่งต่อ |
| 8 — Route | 404 | path ผิด หรือ route ไม่ได้ register |
| 9 — Auth | 401, 403, 429 | token หมดอายุ / สิทธิ์ไม่พอ / ยิงถี่เกิน |
| 10-11 — Logic/DB | 500, ช้ามาก | bug, query ช้า, N+1, connection pool หมด |

### 5.2 หน้าตา Request / Response ของจริง

```
REQUEST
────────────────────────────────────────
POST /api/orders?notify=true HTTP/1.1     ← Method + Path + Query
Host: api.shop.com                        ┐
Content-Type: application/json            │ Header
Authorization: Bearer eyJhbGci...         │  (ข้อมูลกำกับ)
Cookie: session_id=abc123                 ┘

{ "productId": 55, "qty": 2 }             ← Body (ข้อมูลจริง)
```

```
RESPONSE
────────────────────────────────────────
HTTP/1.1 201 Created                      ← Status Code
Content-Type: application/json            ┐ Header
Location: /api/orders/10293               ┘

{ "id": 10293, "status": "pending" }      ← Body
```

> **ให้มองภาพนี้ว่า** "Request และ Response มีโครงเหมือนกันเป๊ะ ต่างแค่บรรทัดแรก — ฝั่งขอบอกเจตนา ฝั่งตอบบอกผลลัพธ์"

### 5.3 Cookie และ Session ทำงานอย่างไร

```
ครั้งแรก — LOGIN
CLIENT  POST /login  { user, password }
              ↓
SERVER  ตรวจรหัสผ่านถูก → สร้าง session เก็บใน memory/Redis
              ↓
SERVER  Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax
              ↓
BROWSER เก็บ cookie ไว้เอง

ครั้งต่อ ๆ ไป — ทุก REQUEST
CLIENT  GET /api/me
        Cookie: session_id=abc123      ← browser แนบให้เองอัตโนมัติ
              ↓
SERVER  เอา abc123 ไปเปิดดูใน session store → "อ๋อ คนนี้คือ user 42"
              ↓
SERVER  200 OK { "name": "สมชาย" }
```

> **ให้มองภาพนี้ว่า** "Cookie คือบัตรคิวที่ร้านให้เราถือไว้ ส่วน Session คือแฟ้มข้อมูลจริงที่ร้านเก็บไว้เอง — บัตรคิวไม่มีข้อมูลอะไร มีแค่หมายเลขไว้เปิดแฟ้ม"

**แล้ว Stateless ไปไหน?** — นี่คือจุดที่ต้องเข้าใจให้ตรง:
HTTP **protocol** ยัง stateless อยู่ (แต่ละ request ไม่รู้จักกัน) แต่ **application** สร้างความต่อเนื่องขึ้นมาเองด้วยการให้ client แนบตัวตนมาทุกครั้ง

### 5.4 URL แยกส่วนอย่างไร

```
https :// api.shop.com : 443 /orders/123 ?full=true&lang=th #detail
  │         │            │      │           │                  │
  │         │            │      │           │                  └─ Fragment (browser เท่านั้น ไม่ส่งไป server)
  │         │            │      │           └──────────────────── Query Parameter
  │         │            │      └──────────────────────────────── Path (+ Path Parameter = 123)
  │         │            └─────────────────────────────────────── Port (443 = default ของ HTTPS)
  │         └──────────────────────────────────────────────────── Domain / Host
  └────────────────────────────────────────────────────────────── Protocol / Scheme
```

> **ให้มองภาพนี้ว่า** "URL คือที่อยู่เต็มรูปแบบ: ใช้ภาษาอะไรคุย ไปบ้านไหน เข้าห้องไหน หาของชิ้นไหน และขอแบบไหน"

---

## 6. Example — Scenario จากงานจริง

### Scenario A: ระบบจัดการคำสั่งซื้อ — ออกแบบ REST API ทั้งชุด

| สิ่งที่อยากทำ | Endpoint | Status ที่ควรได้ | หมายเหตุ |
|---|---|---|---|
| ดูรายการออเดอร์ทั้งหมดของฉัน | `GET /orders?status=paid&page=2&limit=20` | 200 | กรอง/แบ่งหน้าด้วย query |
| ดูออเดอร์เดียว | `GET /orders/123` | 200 หรือ 404 | ระบุตัวตนด้วย path |
| สร้างออเดอร์ใหม่ | `POST /orders` | **201** + header `Location` | 201 ไม่ใช่ 200 |
| แก้ที่อยู่จัดส่งอย่างเดียว | `PATCH /orders/123` | 200 | ส่งเฉพาะ field ที่แก้ |
| เขียนทับออเดอร์ทั้งก้อน | `PUT /orders/123` | 200 | ต้องส่ง field ครบทุกตัว |
| ยกเลิกออเดอร์ | `DELETE /orders/123` | **204** (ไม่มี body) | ลบซ้ำก็ยังคืน 204 ได้ |
| ดูรายการสินค้าในออเดอร์ | `GET /orders/123/items` | 200 | resource ซ้อน resource |
| สร้างออเดอร์ซ้ำเลข reference เดิม | `POST /orders` | **409 Conflict** | ชนกับสถานะปัจจุบัน |
| ส่งข้อมูลรูปแบบถูกแต่ค่าผิดกฎธุรกิจ | `POST /orders` | **422** | เช่น qty = -1 |
| ยิงถี่เกินไป | ทุก endpoint | **429** | พร้อม header `Retry-After` |

**สิ่งที่ interviewer สังเกตจากตารางนี้:**

1. ใช้ **คำนามพหูพจน์** (`/orders` ไม่ใช่ `/getOrder`)
2. **ไม่มีคำกริยาใน path** — กริยาอยู่ที่ method
3. รู้ว่า POST สำเร็จคืน **201** ไม่ใช่ 200
4. รู้ว่า DELETE สำเร็จคืน **204** (ไม่มีเนื้อหาจะส่งกลับ)
5. แยก **400 (รูปแบบผิด)** ออกจาก **422 (รูปแบบถูก แต่ผิดกฎธุรกิจ)** ได้

### Scenario B: "ลูกค้าบอกว่ากดปุ่มแล้วขึ้น 401 ทั้ง ๆ ที่เพิ่ง login"

ขั้นการสืบสวนจริงที่ควรตอบได้:

```
1. เปิด DevTools → Network → ดู request ที่ 401
2. ดูว่า request มี Header Authorization / Cookie แนบไปไหม
      ไม่มี → ปัญหาอยู่ที่ frontend หรือ cookie ไม่ถูกส่ง
      มี   → ไปข้อ 3
3. เอา token ไป decode ดูเวลา expire
      หมดอายุ → ปัญหาคือ refresh token flow
      ยังไม่หมด → ไปข้อ 4
4. เช็ก domain ของ cookie ตรงกับ domain ของ API ไหม
      ไม่ตรง → browser ไม่ส่ง cookie ข้ามโดเมน (ต้องตั้ง SameSite / credentials)
5. ยิง request เดียวกันด้วย curl/Postman
      ผ่าน → ปัญหาอยู่ฝั่ง browser (CORS / cookie flag)
      ไม่ผ่าน → ปัญหาอยู่ฝั่ง backend จริง
```

> **ให้มองภาพนี้ว่า** "การ debug 401 คือการไล่ถามว่า 'บัตรถูกพกไปด้วยไหม → บัตรยังไม่หมดอายุใช่ไหม → บัตรถูกอ่านที่ปลายทางไหม'"

### Scenario C: หน้า list สินค้าโหลดช้า 4 วินาที

| สมมติฐาน | ดูจากอะไร | ถ้าใช่ แก้ยังไง |
|---|---|---|
| Server คิดนาน | DevTools → Timing → **TTFB (Time To First Byte)** สูง | ปัญหาฝั่ง backend/DB — ดู query, index, N+1 |
| Payload ใหญ่เกิน | Size ของ response เป็น MB | ทำ pagination ด้วย query param, ส่งเฉพาะ field ที่ใช้ |
| ยิงหลาย request ซ้อนกัน | มี request เป็นสิบใน Network tab | รวมเป็น endpoint เดียว หรือทำ batch |
| DNS/TLS ช้า | Timing แสดง DNS/SSL ใช้เวลานาน | ใช้ CDN, เปิด keep-alive, ลดจำนวน domain |
| ไม่ได้ cache เลย | ไม่มี `Cache-Control` ใน response header | ใส่ cache header สำหรับข้อมูลที่ไม่ค่อยเปลี่ยน |

---

## 7. Compare

### 7.1 🔍 เจาะลึก: 401 vs 403 (คำถามยอดฮิตอันดับ 1)

| | **401 Unauthorized** | **403 Forbidden** |
|---|---|---|
| ความหมายจริง | **ยังไม่พิสูจน์ตัวตน** (ชื่อมันตั้งผิด จริง ๆ ควรชื่อ Unauthenticated) | **พิสูจน์ตัวตนแล้ว แต่ไม่มีสิทธิ์** |
| เกี่ยวกับ | Authentication — "คุณเป็นใคร" | Authorization — "คุณทำอันนี้ได้ไหม" |
| สาเหตุที่พบบ่อย | ไม่ได้แนบ token / token หมดอายุ / token ปลอม | role ไม่พอ / ไม่ใช่เจ้าของข้อมูล / ฟีเจอร์ถูกปิดสำหรับ plan นี้ |
| Client ควรทำอะไรต่อ | **ไป login ใหม่ หรือ refresh token** | **อย่า retry** — login ใหม่ก็ไม่ช่วย ต้องขอสิทธิ์เพิ่ม |
| UI ควรแสดงอะไร | เด้งไปหน้า login | "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้" |

**ตัวอย่างชัด ๆ:**
- ไม่ได้ login แล้วเปิด `/admin` → **401**
- login เป็น user ธรรมดาแล้วเปิด `/admin` → **403**

**คำถามต่อระดับ senior:** *"แล้วทำไมบางระบบส่ง 404 แทน 403?"*
> เพราะ 403 เป็นการยืนยันกลาย ๆ ว่า "ของชิ้นนี้มีอยู่จริง แต่คุณเข้าไม่ได้" ซึ่งเป็นการรั่วข้อมูล (information disclosure) — ระบบที่เข้มงวดจึงคืน **404** เพื่อไม่ให้ผู้โจมตีรู้ว่ามี resource นั้นอยู่ ข้อแลกเปลี่ยนคือ debug ยากขึ้นสำหรับผู้ใช้ที่สุจริต

### 7.2 🔍 เจาะลึก: PUT vs PATCH (คำถามยอดฮิตอันดับ 2)

| | **PUT** | **PATCH** |
|---|---|---|
| ความหมาย | **แทนที่ทั้งก้อน** (replace) | **แก้บางส่วน** (partial update) |
| ต้องส่งอะไร | ทุก field ของ resource | เฉพาะ field ที่อยากเปลี่ยน |
| ถ้าไม่ส่ง field หนึ่งมา | field นั้นควรกลายเป็นค่าว่าง/default | field นั้นคงเดิม ไม่ถูกแตะ |
| Idempotent | **ใช่** — ยิงซ้ำ 10 ครั้ง ผลเท่าเดิม | **ไม่รับประกัน** ขึ้นกับว่าออกแบบยังไง |
| ใช้ตอนไหน | ฟอร์มแก้ไขที่ส่งข้อมูลทั้งหน้ากลับมา | แก้ทีละ field เช่น toggle สถานะ, เปลี่ยนที่อยู่อย่างเดียว |

**ตัวอย่างที่เห็นภาพ:** ข้อมูล user เดิมคือ `{ name: "A", email: "a@x.com", phone: "081" }`

```
PUT /users/1  { "name": "B" }
→ ผลลัพธ์ที่ถูกต้องตามความหมาย: { name: "B", email: null, phone: null }
   (เพราะ PUT แปลว่า "ของใหม่ทั้งก้อนคืออันนี้")

PATCH /users/1  { "name": "B" }
→ ผลลัพธ์: { name: "B", email: "a@x.com", phone: "081" }
```

**กับดักที่ junior ตกบ่อย:** backend หลายระบบทำ PUT เป็นแบบ partial update (เหมือน PATCH) แล้วทีม frontend ก็เข้าใจผิดตาม
→ คำตอบระดับ mid-level: *"ในทางทฤษฎี PUT คือ replace แต่ในระบบจริงต้องดู API contract ว่าทีม backend implement แบบไหน และควรระบุให้ชัดใน document"*

**ทำไม PATCH ถึงอาจไม่ idempotent?** ถ้า PATCH เขียนว่า `{ "op": "increment", "field": "views" }` ยิงซ้ำ 3 ครั้งจะได้ค่าต่างกัน — นั่นคือตัวอย่างที่ไม่ idempotent

### 7.3 🔍 เจาะลึก: Path Parameter vs Query Parameter

| | **Path Parameter** | **Query Parameter** |
|---|---|---|
| หน้าตา | `/orders/123` | `/orders?status=paid&page=2` |
| ใช้บอกอะไร | **ตัวตนของ resource** — "ชิ้นไหน" | **วิธีเอา** — กรอง เรียง แบ่งหน้า |
| จำเป็นไหม | จำเป็น (ไม่มีก็คนละ endpoint) | ไม่จำเป็น (ไม่ใส่ก็ยังใช้ได้ มีค่า default) |
| ถ้าไม่เจอ | ควรคืน **404** | ควรคืน **400** ถ้าค่าผิดรูปแบบ หรือ 200 ที่ว่างเปล่า |
| มีผลกับ cache | เป็นคนละ URL คนละของ | เป็นคนละ URL ด้วย แต่มักใช้ร่วมกับ cache key |
| SEO / อ่านง่าย | อ่านสวย เป็นมิตรกับ SEO | ยาวและอ่านยากกว่า |

**กฎตัดสินใจ 1 บรรทัด:**
> ถ้าเอาออกแล้ว **ความหมายของ resource เปลี่ยนไปเลย** → ใช้ Path
> ถ้าเอาออกแล้ว **ยังเป็นของชุดเดิม แค่ได้ผลลัพธ์ต่างไป** → ใช้ Query

```
✅ /users/42/orders?status=paid&sort=-createdAt&page=1&limit=20
       └── path: ของ user คนไหน   └── query: เอาแบบไหน
```

**ข้อควรระวัง:** ห้ามใส่ข้อมูลอ่อนไหว (password, token, เลขบัตร) ใน query string เด็ดขาด เพราะมันจะไปโผล่ใน server log, browser history และ `Referer` header

### 7.4 🔍 เจาะลึก: HTTP vs HTTPS

| | **HTTP** | **HTTPS** |
|---|---|---|
| Port มาตรฐาน | 80 | 443 |
| การเข้ารหัส | ไม่มี — ส่งเป็นข้อความเปล่า | เข้ารหัสด้วย **TLS** |
| คนกลางอ่านได้ไหม | **อ่านได้ทั้งหมด** (WiFi ร้านกาแฟ, ISP) | อ่านไม่ออก |
| คนกลางแก้ข้อมูลได้ไหม | **แก้ได้** (แทรกโฆษณา/malware ได้จริง) | แก้ไม่ได้ ตรวจจับได้ทันที |
| รู้ได้ไหมว่าคุยกับร้านจริง | ไม่รู้ — ถูกปลอมได้ | รู้ ผ่าน **Certificate** ที่ CA รับรอง |
| มี overhead ไหม | ไม่มี | มี TLS handshake ตอนเริ่ม แต่หลังจากนั้นแทบไม่ต่าง |

**HTTPS ให้ 3 อย่าง (จำ 3 คำนี้ตอบสัมภาษณ์ได้เต็ม ๆ):**

| คุณสมบัติ | ความหมาย | ป้องกันอะไร |
|---|---|---|
| **Confidentiality** | คนกลางอ่านไม่ออก | ดักฟัง (eavesdropping) |
| **Integrity** | คนกลางแก้ไม่ได้ | แทรก/แก้ข้อมูลระหว่างทาง |
| **Authentication** | รู้ว่าเป็นเซิร์ฟเวอร์ตัวจริง | เว็บปลอม / Man-in-the-Middle |

```
TLS HANDSHAKE (แบบย่อ)
CLIENT  → "สวัสดี ผมรองรับการเข้ารหัสแบบเหล่านี้"
SERVER  → "เอาแบบนี้ และนี่คือ Certificate ของผม"
CLIENT  → ตรวจ Certificate กับ CA ที่เชื่อถือ → ตกลงกุญแจลับร่วมกัน
ทั้งคู่  → จากนี้คุยกันด้วยกุญแจลับ (เร็ว เพราะเป็น symmetric)
```

> **ให้มองภาพนี้ว่า** "TLS handshake คือการที่สองฝ่ายเช็กบัตรประชาชนกันครั้งเดียว แล้วตกลงรหัสลับไว้คุยกันต่อตลอดบทสนทนา"

**หมายเหตุสำคัญ:** HTTPS เข้ารหัส **เนื้อหา** แต่ **domain ที่คุณเข้า ยังถูกเห็นได้** (ผ่าน DNS และ SNI) — คำตอบระดับ senior ควรพูดเรื่องนี้ได้

### 7.5 HTTP Methods — ตารางรวม

| Method | ทำอะไร | มี Body ไหม | **Safe** (ไม่เปลี่ยนข้อมูล) | **Idempotent** | Status ที่พบบ่อย |
|---|---|---|---|---|---|
| **GET** | อ่านข้อมูล | ไม่ควรมี | ✅ | ✅ | 200, 404 |
| **POST** | สร้างใหม่ / สั่งให้ทำงาน | มี | ❌ | ❌ | 201, 400, 409, 422 |
| **PUT** | แทนที่ทั้งก้อน | มี | ❌ | ✅ | 200, 204, 404 |
| **PATCH** | แก้บางส่วน | มี | ❌ | ไม่รับประกัน | 200, 404, 422 |
| **DELETE** | ลบ | ไม่ค่อยมี | ❌ | ✅ | 204, 404 |
| **HEAD** | เหมือน GET แต่เอาแค่ header | ไม่มี | ✅ | ✅ | 200 |
| **OPTIONS** | ถามว่าทำอะไรได้บ้าง (ใช้ใน CORS preflight) | ไม่มี | ✅ | ✅ | 204 |

**คำถามสัมภาษณ์ที่ซ่อนอยู่:** *"POST idempotent ไหม? ถ้าไม่ จะทำให้ปลอดภัยยังไง"*
> POST ไม่ idempotent โดยธรรมชาติ — ยิง 2 ครั้งได้ 2 ออเดอร์ วิธีแก้มาตรฐานคือให้ client ส่ง **Idempotency-Key** มาใน header แล้ว server จำว่า key นี้เคยประมวลผลไปแล้ว ถ้ามาซ้ำให้คืนผลเดิมแทนที่จะสร้างใหม่

### 7.6 Status Code — ตารางรายตัวที่ต้องตอบได้

| Code | ชื่อ | แปลเป็นภาษาคน | ใช้ตอนไหนจริง ๆ |
|---|---|---|---|
| **200** | OK | "สำเร็จ นี่ข้อมูล" | GET สำเร็จ, PUT/PATCH สำเร็จและมีข้อมูลกลับ |
| **201** | Created | "สร้างให้แล้ว" | POST สร้าง resource ใหม่สำเร็จ ควรแนบ header `Location` |
| **204** | No Content | "สำเร็จ แต่ไม่มีอะไรจะส่งกลับ" | DELETE สำเร็จ, PUT ที่ไม่ต้องคืนข้อมูล |
| **301 / 302** | Moved / Found | "ย้ายถาวร / ย้ายชั่วคราว" | redirect HTTP → HTTPS (301), redirect หลัง login (302) |
| **304** | Not Modified | "ของยังเหมือนเดิม ใช้ cache เถอะ" | ใช้กับ `ETag` / `If-None-Match` เพื่อประหยัด bandwidth |
| **400** | Bad Request | "คุณส่งมาผิดรูปแบบ" | JSON พัง, ขาด field บังคับ, ชนิดข้อมูลผิด |
| **401** | Unauthorized | "คุณยังไม่ได้พิสูจน์ตัวตน" | ไม่มี token / token หมดอายุ |
| **403** | Forbidden | "รู้ว่าคุณเป็นใคร แต่ห้าม" | role ไม่พอ, ไม่ใช่เจ้าของข้อมูล |
| **404** | Not Found | "ไม่มีของชิ้นนี้" | id ไม่มีอยู่จริง, path ผิด |
| **405** | Method Not Allowed | "path ถูก แต่กริยาผิด" | ยิง DELETE ไปที่ endpoint ที่รับแค่ GET |
| **409** | Conflict | "ชนกับสถานะปัจจุบัน" | email ซ้ำ, แก้ข้อมูลที่คนอื่นแก้ไปก่อน, ยกเลิกออเดอร์ที่ส่งของแล้ว |
| **422** | Unprocessable Entity | "รูปแบบถูก แต่ผิดกฎธุรกิจ" | qty = -1, วันที่สิ้นสุดก่อนวันเริ่ม |
| **429** | Too Many Requests | "ยิงถี่เกินไป ใจเย็น" | rate limiting — ควรแนบ `Retry-After` |
| **500** | Internal Server Error | "โค้ดเราพัง" | unhandled exception, null pointer, bug |
| **502** | Bad Gateway | "คนกลางถาม upstream แล้วได้คำตอบเพี้ยน" | reverse proxy/LB ติดต่อ backend ไม่ได้ / backend ตาย |
| **503** | Service Unavailable | "ตอนนี้รับไม่ไหว/ปิดปรับปรุง" | ระบบล้น, กำลัง deploy, ไม่มี pod ที่ ready |
| **504** | Gateway Timeout | "คนกลางรอ upstream นานเกิน" | backend คิดนานเกิน timeout ของ proxy |

**เส้นแบ่งที่ interviewer ชอบทดสอบ:**

| คู่ที่สับสน | เส้นแบ่ง |
|---|---|
| 400 vs 422 | 400 = **parse ไม่ผ่าน/รูปแบบผิด** / 422 = **parse ผ่าน แต่ค่าผิดกฎ** |
| 401 vs 403 | 401 = ไม่รู้ว่าคุณเป็นใคร / 403 = รู้แล้วแต่ห้าม |
| 404 vs 403 | 404 = ไม่มี (หรือแกล้งบอกว่าไม่มีเพื่อความปลอดภัย) / 403 = มี แต่เข้าไม่ได้ |
| 409 vs 422 | 409 = **ชนกับสถานะ/ข้อมูลที่มีอยู่** / 422 = ค่าที่ส่งมาเองผิดกฎ |
| 500 vs 502 vs 503 | 500 = **โค้ดเราพัง** / 502 = **ปลายทางตอบเพี้ยนหรือตาย** / 503 = **รับไม่ไหวชั่วคราว** |

### 7.7 Cookie vs Session vs Token

| | **Cookie** | **Session** | **Token (JWT)** |
|---|---|---|---|
| เก็บที่ไหน | ที่ browser | ที่ server (memory/Redis/DB) | ที่ client (แต่ข้อมูลอยู่ในตัว token) |
| ใครส่ง | browser แนบให้อัตโนมัติ | ไม่ส่ง — ส่งแค่ session id | client ต้องแนบเอง (มัก `Authorization: Bearer`) |
| Server ต้องจำไหม | ไม่จำเป็น | **ต้องจำ** (stateful) | ไม่ต้องจำ (stateless) |
| ยกเลิกทันทีได้ไหม | — | **ได้** ลบ session ทิ้ง | **ยาก** ต้องมี blacklist หรือรอหมดอายุ |
| Scale หลายเครื่องยังไง | — | ต้องใช้ session store ร่วม เช่น Redis | scale ง่าย ทุกเครื่องตรวจเองได้ |
| ข้อควรระวัง | ต้องตั้ง `HttpOnly` `Secure` `SameSite` | session store ล่ม = ทุกคนหลุด login | token ใหญ่, ยกเลิกยาก, ห้ามใส่ข้อมูลลับ |

> รายละเอียดลึกเรื่อง JWT, Refresh Token, OAuth2 อยู่ใน **PART 7 — Authentication & Security**

### 7.8 REST vs สิ่งที่คนมักสับสน

| | **REST** | **สิ่งที่คนคิดว่าใช่แต่ไม่ใช่** |
|---|---|---|
| REST = JSON? | ไม่ — REST ไม่ได้บังคับรูปแบบข้อมูล จะเป็น XML ก็ได้ | JSON เป็นแค่ที่นิยม |
| REST = HTTP API? | ไม่ทุก HTTP API เป็น REST | API ที่ใช้ `POST /doEverything` คือ HTTP API แต่ไม่ REST |
| REST มี state ได้ไหม | **Server ต้องไม่เก็บ client state** ระหว่าง request | แต่ **resource state** ใน database เก็บได้แน่นอน |

---

## 8. Common Mistakes

| ❌ ความเข้าใจผิด | ✅ ความจริง |
|---|---|
| "200 แปลว่าทุกอย่างสำเร็จ" | ระบบที่ออกแบบไม่ดีคืน `200 { "error": "..." }` ได้ — ต้องดู body ด้วยเสมอ แต่ API ที่ดีไม่ควรทำแบบนั้น |
| "404 แปลว่า server ล่ม" | 404 แปลว่า server **ยังทำงานดี** แค่หา resource นั้นไม่เจอ — server ล่มจริงคือ 502/503 หรือติดต่อไม่ได้เลย |
| "500 แปลว่า client ส่งผิด" | 5xx = **ฝั่ง server ผิด** เสมอ ถ้า client ส่งผิดต้องเป็น 4xx — ถ้า input ผิดแล้วได้ 500 แปลว่า backend ลืมทำ validation |
| "Query parameter ปลอดภัยกว่าเพราะสั้น" | Query อยู่ใน URL → โผล่ใน log, browser history, `Referer` — **ห้ามใส่ข้อมูลลับ** |
| "ใส่ token ใน query ก็ได้เหมือนกัน" | ไม่ได้ — ต้องใส่ใน header เพราะ header ไม่ถูก log โดย default และไม่ติดใน history |
| "PUT กับ PATCH เหมือนกัน" | PUT = แทนที่ทั้งก้อน / PATCH = แก้บางส่วน — ต่างกันที่ "ถ้าไม่ส่ง field มา จะเกิดอะไรขึ้น" |
| "HTTPS ทำให้ระบบปลอดภัย" | HTTPS ป้องกันแค่ **ระหว่างทาง** ไม่ได้ป้องกัน SQL Injection, XSS, สิทธิ์ผิด หรือรหัสผ่านอ่อน |
| "Stateless แปลว่าเก็บข้อมูลไม่ได้" | Stateless = **server ไม่เก็บบริบทของ client ระหว่าง request** — ข้อมูลใน database เก็บได้ปกติ |
| "GET ส่ง body ได้เหมือน POST" | ในทางเทคนิคทำได้ แต่ proxy/cache/library หลายตัวจะทิ้ง body — **อย่าทำ** |
| "REST คือการใช้ JSON กับ HTTP" | REST คือ **สไตล์การออกแบบ** เน้น resource + method มาตรฐาน + stateless |
| "DELETE ซ้ำต้องได้ 404" | ได้ทั้งคู่ แต่ 204 เป็นมิตรกว่า เพราะ **สถานะปลายทางถูกต้องแล้ว** (idempotent) — ขอให้เลือกอย่างหนึ่งแล้วเขียนไว้ใน contract |
| "CORS error คือ backend พัง" | CORS เป็น **กลไกของ browser** — request มักไปถึง server แล้วด้วยซ้ำ แต่ browser บล็อกไม่ให้ JS อ่าน response (ทดสอบด้วย curl จะผ่าน) |
| "เปลี่ยน API contract นิดเดียวไม่เป็นไร" | การเปลี่ยนชื่อ field หรือชนิดข้อมูล = **breaking change** ต้องทำ versioning หรือแจ้งทีมล่วงหน้า |

---

## 9. Debugging

**ลำดับการไล่ปัญหาชั้น Web/HTTP:**

```
STEP 1  request ถูกยิงออกไปจริงไหม?
           → DevTools > Network  (ถ้าไม่มีเลย = ปัญหาอยู่ที่ JS ฝั่ง frontend)
   ↓
STEP 2  URL ถูกต้องไหม?
           → protocol / domain / path / query ครบไหม พิมพ์ผิดไหม
   ↓
STEP 3  Method ถูกไหม?
           → ได้ 405 = path ถูกแต่ method ผิด
   ↓
STEP 4  Header ครบไหม?
           → Content-Type, Authorization, Cookie
   ↓
STEP 5  Status Code บอกอะไร?
           → 4xx ขึ้นไปดูฝั่ง client ก่อน / 5xx ไปดู server log เลย
   ↓
STEP 6  Body ของ request/response หน้าตาเป็นยังไง?
           → เทียบกับ API contract ทีละ field
   ↓
STEP 7  ยิงด้วย curl / Postman ได้ผลเหมือนกันไหม?
           → ผ่าน = ปัญหาอยู่ที่ browser (CORS, cookie flag, cache)
           → ไม่ผ่าน = ปัญหาอยู่ฝั่ง backend จริง
   ↓
STEP 8  ถ้ายังไม่เจอ ดู Timing
           → DNS ช้า? TLS ช้า? TTFB ช้า? Download ช้า?
```

> **ให้มองภาพนี้ว่า** "การ debug HTTP คือการตรวจซองจดหมายทีละชั้น: ส่งออกไปไหม จ่าหน้าถูกไหม เขียนเจตนาถูกไหม แนบบัตรไหม และปลายทางตอบว่าอะไร"

### ตารางอาการ → สาเหตุที่พบบ่อยที่สุด

| อาการ | สาเหตุอันดับ 1 | เช็กอะไรก่อน |
|---|---|---|
| `CORS policy has blocked` | backend ไม่ได้ตั้ง `Access-Control-Allow-Origin` | ทดสอบด้วย curl — ถ้าผ่าน แปลว่าเป็น CORS ล้วน ๆ |
| 401 ทั้ง ๆ ที่เพิ่ง login | token ไม่ถูกแนบ หรือ cookie ข้าม domain ไม่ได้ | ดู Request Headers ใน Network tab |
| 403 เฉพาะบาง user | role / ownership check | ดู role ของ user นั้นใน DB |
| 404 เฉพาะบน production | route ไม่ได้ถูก deploy หรือ path มี prefix ต่าง (`/api`) | เทียบ route list ของ dev กับ prod |
| 415 Unsupported Media Type | ลืมใส่ `Content-Type: application/json` | ดู Request Headers |
| 429 | rate limit | ดู header `Retry-After` และปรับ retry ให้มี backoff |
| 500 แต่ log ว่าง | error ถูกกลืนโดย try-catch ที่ไม่ log | ตรวจ central error handler |
| 502 หลัง deploy | container ยังไม่ ready / crash loop | ดู pod status และ readiness probe |
| 503 ช่วง peak | scale ไม่พอ / connection pool หมด | ดู metric CPU, memory, DB connections |
| 504 | backend คิดนานกว่า timeout ของ proxy | หา query ช้า และตั้ง timeout ให้สมเหตุผล |
| หน้าเว็บโหลดแต่ข้อมูลเก่า | browser cache / CDN cache | ดู `Cache-Control` และลอง hard reload |
| ทำงานใน Postman แต่ browser ไม่ได้ | CORS / cookie `SameSite` / `credentials: include` | เทียบ request headers ของทั้งสองฝั่ง |

---

## 10. Interview Questions

### 🟢 Junior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| HTTP คืออะไร | โปรโตคอลที่ client กับ server ใช้คุยกัน — แบบ request/response |
| GET กับ POST ต่างกันยังไง | GET อ่าน ไม่มี body ไม่เปลี่ยนข้อมูล / POST สร้าง มี body เปลี่ยนข้อมูล |
| Status code หมวด 4xx กับ 5xx ต่างกันยังไง | 4xx = client ผิด / 5xx = server ผิด |
| 404 กับ 500 ต่างกันยังไง | 404 = ไม่เจอ resource (server ยังดี) / 500 = server พังข้างใน |
| URL ประกอบด้วยอะไรบ้าง | protocol, domain, port, path, query, fragment |
| Header กับ Body ต่างกันยังไง | header = ข้อมูลกำกับ / body = ข้อมูลจริง |
| DNS คืออะไร | ระบบแปลง domain เป็น IP |
| Cookie คืออะไร | ข้อมูลเล็ก ๆ ที่ server ฝากไว้กับ browser และถูกแนบกลับอัตโนมัติ |

### 🟡 Mid-level

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| **401 กับ 403 ต่างกันยังไง** | Authentication vs Authorization + client ควรทำอะไรต่อ (retry ได้/ไม่ได้) |
| **PUT กับ PATCH ต่างกันยังไง** | replace vs partial + เรื่อง idempotent + "ถ้าไม่ส่ง field มาจะเกิดอะไร" |
| **Path params กับ Query params ใช้ต่างกันตอนไหน** | ตัวตน vs การกรอง + กฎ "เอาออกแล้วความหมายเปลี่ยนไหม" |
| **HTTP กับ HTTPS ต่างกันยังไง** | Confidentiality / Integrity / Authentication + TLS handshake คร่าว ๆ |
| Stateless คืออะไร ทำไม HTTP ถึง stateless | scale ง่าย + ต้องแนบตัวตนทุก request + ที่มาของ cookie/token |
| Idempotent คืออะไร method ไหนบ้าง | GET, PUT, DELETE, HEAD เป็น idempotent / POST ไม่ใช่ + วิธีทำให้ POST ปลอดภัยด้วย Idempotency-Key |
| ออกแบบ REST API สำหรับระบบ order ให้หน่อย | คำนามพหูพจน์ + method เป็นกริยา + status code ถูกหมวด + nested resource |
| 400 กับ 422 ต่างกันยังไง | รูปแบบผิด vs ค่าผิดกฎธุรกิจ |
| CORS คืออะไร แก้ยังไง | กลไกของ browser ไม่ใช่ security ของ server + แก้ที่ backend header ไม่ใช่ปิดที่ browser |
| API Contract คืออะไร เปลี่ยนแล้วเกิดอะไร | สัญญา + breaking change + versioning |

### 🔴 Senior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| ทำไมบางระบบคืน 404 แทน 403 | information disclosure + trade-off ด้าน debuggability |
| ออกแบบ API ให้ client retry ได้อย่างปลอดภัยยังไง | Idempotency-Key + exponential backoff + `Retry-After` + แยก error ที่ retry ได้/ไม่ได้ |
| จะทำ API versioning ยังไง trade-off คืออะไร | URL versioning (`/v1/`) vs header versioning — ชัดเจน/cache ง่าย vs URL สะอาด/ผู้ใช้ไม่รู้ตัว |
| Session vs JWT เลือกยังไง | ยกเลิกทันทีได้ vs scale ง่าย — ขึ้นกับความต้องการ revoke และจำนวน service |
| Client เห็น 504 แต่ข้อมูลถูกบันทึกแล้ว จะออกแบบยังไง | idempotency + การให้ client เช็กสถานะได้ + อย่าให้ผู้ใช้ตัดสินใจจากแค่ HTTP status |
| ระบบล้นช่วง peak จะออกแบบ HTTP layer ยังไง | rate limiting (429 + Retry-After), graceful degradation (503 พร้อม maintenance page), circuit breaker |
| HTTPS ปกป้องอะไร ไม่ปกป้องอะไร | ป้องกันระหว่างทาง แต่ไม่ป้องกัน app-level vulnerability และ **domain ยังถูกเห็นได้** ผ่าน DNS/SNI |
| REST เหมาะกับทุกกรณีไหม | ไม่ — GraphQL เหมาะเมื่อ client ต้องการ field ไม่เหมือนกัน, gRPC เหมาะกับ service-to-service ที่ต้องการ latency ต่ำ — ทุกอย่างมี trade-off |

---

## 11. Answer Like a Developer

**โครงการตอบสำหรับคำถามประเภท "A กับ B ต่างกันยังไง":**

```
1. เส้นแบ่งหลัก 1 ประโยค     → "ต่างกันตรงที่..."
2. ผลกระทบกับ client        → "ดังนั้น frontend ควรทำ..."
3. ตัวอย่างจริง             → "เช่นตอนที่ผมเจอ..."
4. Trade-off / ข้อควรระวัง   → "แต่ในระบบจริงต้องระวัง..."
```

### ตัวอย่าง: "401 กับ 403 ต่างกันยังไง"

❌ **แบบท่องจำ:** "401 คือ Unauthorized ส่วน 403 คือ Forbidden"
(แปลชื่อเฉย ๆ — ไม่ได้แสดงความเข้าใจอะไรเลย)

✅ **แบบ developer:**
> "**401 คือ 'ยังไม่รู้ว่าคุณเป็นใคร' ส่วน 403 คือ 'รู้แล้วว่าคุณเป็นใคร แต่คุณทำอันนี้ไม่ได้'** — 401 เป็นเรื่อง authentication ส่วน 403 เป็นเรื่อง authorization
>
> ที่สำคัญคือ **client ควรทำต่างกัน**: เจอ 401 ควรลอง refresh token หรือเด้งไปหน้า login แต่เจอ 403 ต้องไม่ retry เพราะ login ใหม่กี่ครั้งก็ไม่ผ่าน ต้องแสดงข้อความว่าไม่มีสิทธิ์แทน
>
> ในโปรเจกต์ที่ผมเคยทำ เรามี interceptor ฝั่ง frontend ที่จับ 401 แล้วเรียก refresh token อัตโนมัติ แต่ตอนแรกเราดักรวม 403 เข้าไปด้วย ทำให้ผู้ใช้ที่สิทธิ์ไม่พอโดนเด้งไปหน้า login วนไม่รู้จบ — แก้โดยแยกการจัดการสอง status ออกจากกัน
>
> อีกจุดที่น่าสนใจคือ **บางระบบเลือกคืน 404 แทน 403** เพื่อไม่ให้ผู้โจมตีรู้ว่ามี resource นั้นอยู่จริง ข้อแลกเปลี่ยนคือผู้ใช้สุจริตจะงงว่าทำไมหาไม่เจอ"

### ตัวอย่าง: "PUT กับ PATCH ต่างกันยังไง"

✅ **แบบ developer:**
> "เส้นแบ่งง่าย ๆ คือ **'ถ้าผมไม่ส่ง field หนึ่งมา จะเกิดอะไรขึ้น'** — PUT คือแทนที่ทั้งก้อน field ที่ไม่ส่งควรกลายเป็นค่าว่าง ส่วน PATCH คือแก้เฉพาะที่ส่งมา field อื่นคงเดิม
>
> อีกมุมคือ PUT เป็น idempotent ยิงซ้ำกี่ครั้งผลเท่าเดิม ส่วน PATCH ไม่รับประกัน เช่นถ้า PATCH เขียนแบบ increment ยิงซ้ำ 3 ครั้งค่าจะต่างกัน
>
> แต่ในทางปฏิบัติ ผมเจอบ่อยมากว่าทีม backend implement PUT เป็น partial update — ดังนั้นสิ่งที่ผมทำเสมอคือ **ยืนยันกับ API contract ก่อน** ไม่ใช่เดาจากชื่อ method"

**3 ประโยคที่ทำให้ดูเป็นคนที่ทำงานจริง:**

1. "ผมจะดู Network tab ก่อนว่า status เท่าไหร่ แล้วค่อยตัดสินว่าปัญหาอยู่ฝั่งไหน"
2. "ในทางทฤษฎีเป็นแบบนี้ แต่ระบบจริงต้องดู API contract ที่ทีมตกลงกัน"
3. "การเปลี่ยนตรงนี้เป็น breaking change เราต้องคุยกับทีม frontend ก่อน"

---

## 12. One-Minute Review

- **HTTP** = ภาษาที่ client กับ server ใช้คุยกัน — client ถามก่อนเสมอ server ตอบครั้งเดียวแล้วลืม
- **Request** = Method + URL + Header + Body / **Response** = Status + Header + Body
- **Header** = ข้อมูลกำกับ / **Body** = ข้อมูลจริง
- **Path param** = ของชิ้นไหน (`/orders/123`) / **Query param** = เอาแบบไหน (`?page=2`)
- **Method**: GET อ่าน, POST สร้าง, PUT แทนทั้งก้อน, PATCH แก้บางส่วน, DELETE ลบ
- **Idempotent**: GET, PUT, DELETE ใช่ / POST ไม่ใช่ → แก้ด้วย Idempotency-Key
- **Status**: 2xx สำเร็จ, 3xx ย้าย, 4xx คุณผิด, 5xx เราผิด
- **401** = ไม่รู้ว่าคุณเป็นใคร / **403** = รู้แล้วแต่ห้าม
- **400** = รูปแบบผิด / **422** = รูปแบบถูกแต่ผิดกฎธุรกิจ / **409** = ชนกับสถานะปัจจุบัน
- **500** = โค้ดเราพัง / **502** = ปลายทางตอบเพี้ยน / **503** = รับไม่ไหว / **504** = รอนานเกิน
- **URL** = protocol + domain + port + path + query + fragment
- **DNS** แปลงชื่อเป็น IP / **Port** บอกว่าคุยกับโปรแกรมตัวไหน
- **HTTPS** = HTTP + TLS ให้ Confidentiality + Integrity + Authentication
- **REST** = มอง API เป็น resource (คำนามพหูพจน์) ใช้ method เป็นกริยา และ stateless
- **Stateless** = server ไม่จำบริบทข้าม request → ต้องแนบตัวตนมาทุกครั้ง (Cookie/Token)
- **Cookie** = บัตรคิวที่ browser พก / **Session** = แฟ้มจริงที่ server เก็บ
- **API Contract** = สัญญา — เปลี่ยนแล้วเป็น breaking change ต้องทำ versioning

---

## 13. Memory Card

### จำ 5 อย่าง

1. **Request = เจตนา + ที่อยู่ + ซอง + เนื้อหา** (Method + URL + Header + Body) และ Response มีโครงเดียวกัน
2. **Status code หลักแรกคือคำตอบ** — 2 สำเร็จ, 3 ย้าย, 4 คุณผิด, 5 เราผิด
3. **401 = ยังไม่รู้จักคุณ / 403 = รู้แล้วแต่ห้าม** — และ client ต้อง handle ต่างกัน
4. **Path = ของชิ้นไหน / Query = เอาแบบไหน** — เอาออกแล้วความหมายเปลี่ยนไหม คือเส้นแบ่ง
5. **Stateless คือหัวใจ** — server ไม่จำคุณ ทุก request ต้องแนบตัวตนมาใหม่เสมอ

### Keyword

- **HTTP** → ภาษากลางของเว็บ request/response
- **HTTPS** → HTTP + TLS: อ่านไม่ออก แก้ไม่ได้ รู้ว่าคุยกับตัวจริง
- **Request** → Method + URL + Header + Body
- **Response** → Status + Header + Body
- **Header** → ข้อมูลกำกับ (token, content-type, cache)
- **Body** → ข้อมูลจริง ส่วนใหญ่เป็น JSON
- **Query Param** → หลัง `?` กรอง/เรียง/แบ่งหน้า
- **Path Param** → ในเส้นทาง ระบุตัวตนของ resource
- **Cookie** → บัตรคิวที่ browser แนบให้อัตโนมัติ
- **Session** → แฟ้มผู้ใช้ที่ server เก็บไว้ มี session id เป็นกุญแจ
- **GET** → อ่าน / safe / idempotent
- **POST** → สร้าง / ไม่ idempotent → 201
- **PUT** → แทนทั้งก้อน / idempotent
- **PATCH** → แก้บางส่วน / ไม่รับประกัน idempotent
- **DELETE** → ลบ / idempotent → 204
- **200** → สำเร็จ มีข้อมูล
- **201** → สร้างสำเร็จ (+ header Location)
- **204** → สำเร็จ ไม่มี body
- **400** → รูปแบบผิด
- **401** → ยังไม่พิสูจน์ตัวตน
- **403** → พิสูจน์แล้วแต่ไม่มีสิทธิ์
- **404** → ไม่มีของชิ้นนี้
- **409** → ชนกับสถานะปัจจุบัน
- **422** → รูปแบบถูก แต่ผิดกฎธุรกิจ
- **429** → ยิงถี่เกิน (+ Retry-After)
- **500** → โค้ดฝั่งเราพัง
- **502** → ปลายทางตอบเพี้ยน/ตาย
- **503** → รับไม่ไหว/ปิดปรับปรุง
- **URL** → protocol + domain + port + path + query + fragment
- **Domain** → ชื่อที่คนอ่านได้
- **DNS** → สมุดโทรศัพท์ แปลงชื่อเป็น IP
- **IP** → เลขที่บ้านของเครื่อง
- **Port** → เลขห้อง (80 = HTTP, 443 = HTTPS)
- **REST** → resource เป็นคำนาม method เป็นกริยา และ stateless
- **Resource** → สิ่งของในระบบ ใช้คำนามพหูพจน์
- **Endpoint** → คู่ของ method + path ที่เรียกได้จริง
- **API Contract** → สัญญา request/response เปลี่ยนแล้วเป็น breaking change
- **Stateless** → server ไม่จำบริบทข้าม request
- **Idempotent** → ยิงซ้ำแล้วสถานะปลายทางเหมือนเดิม

---

[← สารบัญ](./00-README-TOC.md)
