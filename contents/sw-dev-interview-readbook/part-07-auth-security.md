# PART 7 — AUTHENTICATION & SECURITY

> ตำแหน่งในภาพใหญ่: ชั้นระหว่าง Frontend กับ Business Logic — ด่านที่ตัดสินว่า "ใครเข้ามาได้" และ "เข้ามาแล้วทำอะไรได้"

---

## 1. Big Picture

ทุกระบบที่มีผู้ใช้มากกว่า 1 คน ต้องตอบคำถาม 2 ข้อนี้ทุกครั้งที่มี request เข้ามา:

| คำถาม | ศัพท์ | ตัวอย่าง |
|---|---|---|
| **"คุณคือใคร"** | Authentication (AuthN) | แสดงบัตรประชาชนที่เคาน์เตอร์โรงแรม |
| **"คุณทำสิ่งนี้ได้ไหม"** | Authorization (AuthZ) | คีย์การ์ดเปิดได้เฉพาะห้องของคุณ ไม่ใช่ห้องคนอื่น |

สองคำนี้คนสับสนกันมากที่สุดในโลก backend และเป็นคำถามสัมภาษณ์ที่ถูกถามบ่อยที่สุดในหมวดนี้

พูดแบบ HR ฟังรู้เรื่อง:

> "Authentication คือการพิสูจน์ตัวตน ส่วน Authorization คือการตรวจสิทธิ์ — ระบบต้องรู้ก่อนว่าคุณเป็นใคร ถึงจะบอกได้ว่าคุณทำอะไรได้"

### ทำไม Security เป็นเรื่องของ Developer ทุกคน ไม่ใช่แค่ทีม Security

เพราะช่องโหว่ส่วนใหญ่ **ไม่ได้เกิดจากการโดนแฮกเก่ง ๆ** แต่เกิดจากเรื่องพื้นฐานที่ developer ทำพลาด:

| ช่องโหว่ | เกิดจาก |
|---|---|
| ข้อมูล user หลุด | เก็บ password เป็น plain text หรือ hash ด้วยวิธีที่ไม่เหมาะ |
| Token ถูกขโมย | เก็บ token ผิดที่ + มีช่องโหว่ XSS |
| ใครก็ลบข้อมูลคนอื่นได้ | ลืมเช็ค authorization บน endpoint |
| Database ถูกอ่านทั้งตาราง | ต่อ string เข้าไปใน query โดยไม่ใช้ parameterized query |
| Secret รั่ว | commit `.env` ขึ้น git |

**ทุกข้อในตารางนี้คือความผิดพลาดของ developer ธรรมดา ไม่ใช่การโจมตีขั้นสูง**

### หลักคิด 4 ข้อของ Security ที่ต้องติดหัวก่อนอ่านต่อ

| หลักคิด | หมายความว่า |
|---|---|
| **Never trust user input** | ทุกอย่างที่มาจาก client ถือว่าไม่น่าเชื่อถือ รวมถึง header, cookie, hidden field |
| **Defense in depth** | อย่าพึ่งด่านเดียว — ถ้าด่านนั้นพัง ต้องยังมีด่านอื่นกันอยู่ |
| **Least privilege** | ให้สิทธิ์น้อยที่สุดเท่าที่งานต้องการ |
| **Fail securely** | เมื่อระบบพัง ต้องพังไปทางปฏิเสธ ไม่ใช่พังไปทางอนุญาต |

ข้อสุดท้ายสำคัญมากและ junior มักพลาด: ถ้า auth service ล่ม แล้วคุณเขียน `catch` ให้ผ่านไปเลย — นั่นคือคุณเปิดประตูทั้งระบบเวลาระบบมีปัญหา

### ภาพรวมว่าเรื่องในบทนี้เชื่อมกันอย่างไร

```
                    ┌── Session-based
Authentication ─────┤
(คุณคือใคร)          └── Token-based (JWT) ── Access + Refresh Token
        ↓                                              ↓
        │                                        OAuth2 / SSO
        ↓
Authorization ──── RBAC ── Role → Permission
(คุณทำอะไรได้)

ระหว่างทางทั้งหมด ต้องมี:
  Transport Security   → HTTPS / TLS
  Browser Rules        → CORS / SameSite / HttpOnly / Secure
  Input Safety         → Validation / Sanitization / Parameterized Query
  Abuse Protection     → Rate Limiting / Brute Force Protection
  Secret Handling      → Environment Variable / Secret Manager
```

> **ให้มองภาพนี้ว่า** "Authentication คือประตูหน้าบ้าน Authorization คือกุญแจแต่ละห้อง ส่วนที่เหลือคือรั้ว กล้องวงจรปิด และการไม่วางกุญแจสำรองไว้ใต้พรม"

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Authentication (AuthN)** | คุณคือใคร | พิสูจน์ตัวตน → ล้มเหลว = 401 |
| **Authorization (AuthZ)** | คุณทำอะไรได้ | ตรวจสิทธิ์ → ล้มเหลว = 403 |
| **Credential** | หลักฐานยืนยันตัว | username/password, API key, certificate |
| **Session** | server จำคุณได้ | server เก็บ state ของ user ไว้ฝั่งตัวเอง |
| **Session ID** | หมายเลขบัตรฝาก | key ที่ client ถือ เพื่อชี้ไปหา session ฝั่ง server |
| **Cookie** | ซองที่ browser พกให้อัตโนมัติ | ที่เก็บข้อมูลเล็ก ๆ ที่ browser แนบไปกับทุก request ของ domain นั้น |
| **JWT** | บัตรผ่านที่มีลายเซ็น | JSON Web Token — token ที่ตัวมันเองบรรจุข้อมูล + ลายเซ็น |
| **Claim** | ข้อความในบัตร | ข้อมูลที่อยู่ใน payload ของ JWT เช่น `sub`, `exp`, `role` |
| **Signature** | ลายเซ็นกันปลอม | ส่วนที่ทำให้รู้ว่า token ถูกแก้หรือไม่ |
| **Access Token** | บัตรผ่านอายุสั้น | ใช้เรียก API อายุสั้น (นาที) |
| **Refresh Token** | บัตรไว้ขอบัตรใหม่ | อายุยาว ใช้ขอ access token ใบใหม่ |
| **Token Rotation** | เปลี่ยนบัตรทุกครั้งที่ต่ออายุ | ใช้ refresh token แล้วออกใบใหม่ ยกเลิกใบเก่า |
| **Revoke** | ยกเลิกบัตร | ทำให้ token/session ใช้ไม่ได้ก่อนหมดอายุ |
| **Stateless** | server ไม่จำอะไร | ทุก request ต้องพกข้อมูลมาเอง |
| **OAuth2** | ขออนุญาตแทนการให้รหัสผ่าน | protocol ให้ app หนึ่งเข้าถึงข้อมูลใน service อื่นแทนผู้ใช้ |
| **OIDC** | OAuth2 + บอกว่าคุณเป็นใคร | OpenID Connect — ชั้น authentication บน OAuth2 |
| **SSO** | ล็อกอินครั้งเดียวใช้ได้หลายระบบ | Single Sign-On |
| **IdP** | ผู้ออกบัตรกลาง | Identity Provider เช่น Google, Azure AD, Keycloak |
| **RBAC** | สิทธิ์ตามตำแหน่ง | Role-Based Access Control |
| **Role** | ตำแหน่ง | กลุ่มของ permission เช่น admin, editor |
| **Permission** | สิทธิ์เฉพาะเรื่อง | เช่น `order:delete`, `user:read` |
| **ABAC** | สิทธิ์ตามเงื่อนไข | Attribute-Based — ตัดสินจาก attribute เช่น "เจ้าของข้อมูลเท่านั้น" |
| **Hashing** | แปลงทางเดียว | แปลงแล้วย้อนกลับไม่ได้ ใช้กับ password |
| **Salt** | เกลือโรยแต่ละคน | ค่าสุ่มต่อ user เพื่อไม่ให้ hash ซ้ำกัน |
| **bcrypt / argon2 / scrypt** | hash ที่ตั้งใจให้ช้า | algorithm สำหรับ password โดยเฉพาะ |
| **Work Factor / Cost** | ปรับความช้า | พารามิเตอร์ที่ทำให้การเดารหัสแพงขึ้น |
| **Encryption** | เข้ารหัสแบบย้อนได้ | ใช้กับข้อมูลที่ต้องอ่านกลับ เช่น เลขบัตร (ไม่ใช่ password) |
| **HTTPS / TLS** | ท่อที่ปิดผนึก | เข้ารหัสข้อมูลระหว่างทาง + ยืนยันว่า server เป็นตัวจริง |
| **Certificate** | บัตรประจำตัวของ server | เอกสารที่ CA เซ็นรับรอง domain |
| **CORS** | กฎของ browser ว่าข้าม origin ได้ไหม | Cross-Origin Resource Sharing |
| **Origin** | scheme + host + port | เช่น `https://app.example.com:443` |
| **Preflight** | ถามก่อนยิงจริง | OPTIONS request ที่ browser ส่งไปถามก่อน |
| **XSS** | ฝัง script ในหน้าเว็บ | Cross-Site Scripting |
| **CSRF** | ยืม cookie ผู้ใช้ไปยิง request | Cross-Site Request Forgery |
| **SQL Injection** | แทรกคำสั่งลงใน query | เกิดจากต่อ string เข้าไปใน SQL |
| **NoSQL Injection** | แทรก operator ลงใน query object | เกิดจากรับ object จาก user ตรง ๆ |
| **Parameterized Query** | แยกคำสั่งออกจากข้อมูล | วิธีป้องกัน injection ที่ถูกต้อง |
| **Input Validation** | ตรวจว่าข้อมูลถูกรูปแบบ | ปฏิเสธสิ่งที่ไม่อยู่ในรูปแบบที่อนุญาต |
| **Sanitization** | ล้างสิ่งอันตรายออก | ตัด/escape ส่วนที่เป็นอันตรายก่อนใช้งาน |
| **Output Encoding** | escape ตอนแสดงผล | วิธีหลักในการกัน XSS |
| **Rate Limiting** | จำกัดจำนวนครั้ง | กันยิงรัว |
| **Brute Force** | เดารหัสรัว ๆ | การลองรหัสซ้ำ ๆ จนเจอ |
| **Account Lockout** | ล็อกบัญชีชั่วคราว | มาตรการหลังพยายามล็อกอินผิดหลายครั้ง |
| **MFA / 2FA** | ยืนยันสองชั้น | รหัสผ่าน + อย่างอื่นที่ผู้ใช้มี |
| **HttpOnly** | JavaScript อ่านไม่ได้ | flag ของ cookie ที่กันการขโมยผ่าน XSS |
| **Secure** | ส่งเฉพาะบน HTTPS | flag ของ cookie |
| **SameSite** | ห้าม browser แนบ cookie ข้ามเว็บ | flag ของ cookie ที่กัน CSRF |
| **Secret Management** | จัดการความลับ | เก็บ key/password นอก code |
| **Principle of Least Privilege** | ให้สิทธิ์เท่าที่จำเป็น | ลด blast radius เมื่อโดนเจาะ |

---

## 3. Mental Model

### 3.1 มองเป็น "ด่าน 2 ชั้นที่สลับลำดับไม่ได้"

```
Request
   ↓
[ชั้น 1] AUTHENTICATION  → คุณคือใคร      → ไม่ผ่าน = 401
   ↓ (ได้ identity: req.user)
[ชั้น 2] AUTHORIZATION   → คุณทำได้ไหม     → ไม่ผ่าน = 403
   ↓
Business Logic
```

> **ให้มองภาพนี้ว่า** "ยังไม่รู้ว่าคุณเป็นใคร ก็ไม่มีทางรู้ว่าคุณมีสิทธิ์อะไร — เพราะฉะนั้นสองชั้นนี้สลับกันไม่ได้"

จำวิธีแยก 401 กับ 403 แบบนี้:

| Status | ประโยคที่ server พูด |
|---|---|
| **401 Unauthorized** | "ผมไม่รู้ว่าคุณเป็นใคร ไปล็อกอินมาก่อน" (ชื่อ status นี้ตั้งผิดมาแต่แรก มันควรชื่อ Unauthenticated) |
| **403 Forbidden** | "ผมรู้ว่าคุณเป็นใคร และคุณทำสิ่งนี้ไม่ได้" |

### 3.2 มอง Authentication เป็น "การแลกหลักฐานเป็นบัตรผ่าน"

```
Password (หลักฐานถาวร)
      ↓  ใช้ครั้งเดียวตอน login
Session ID / Token (บัตรผ่านชั่วคราว)
      ↓  ใช้ทุก request หลังจากนั้น
```

> **ให้มองภาพนี้ว่า** "เราไม่อยากให้ password วิ่งไปมาทุก request เลยแลกเป็นบัตรผ่านที่ยกเลิกได้และหมดอายุเองแทน"

นี่คือเหตุผลว่าทำไม access token ต้องอายุสั้น: **ถ้าบัตรผ่านหาย ความเสียหายจำกัดเวลา**

### 3.3 มอง Security เป็น "ชั้น ๆ ไม่ใช่สวิตช์"

Junior มักถามว่า "ระบบผมปลอดภัยหรือยัง" — คำถามนี้ไม่มีคำตอบแบบ ใช่/ไม่ใช่
ที่ถูกคือ **"ถ้าชั้นนี้พัง ยังเหลืออะไรกันอยู่"**

| ถ้าพัง | ยังเหลืออะไร |
|---|---|
| Token หลุด | อายุสั้น + revoke ได้ + ผูกกับ device/IP |
| Database หลุด | password เป็น hash + salt ที่ย้อนกลับไม่ได้ |
| มี XSS หลุดเข้ามา | token อยู่ใน HttpOnly cookie → script อ่านไม่ได้ |
| Cookie ถูกยืมไปยิงข้ามเว็บ | SameSite + CSRF token กันไว้ |
| มีคนเดารหัสรัว | rate limit + lockout + MFA |

**นี่คือ Defense in Depth และเป็นคำตอบที่ทำให้คุณดูเป็น mid-level ทันที**

### 3.4 มองการเก็บข้อมูลลับเป็น 3 ประเภทที่ห้ามสับสน

| ประเภท | ย้อนกลับได้ไหม | ใช้กับ | ห้ามใช้กับ |
|---|---|---|---|
| **Hashing** | ❌ ไม่ได้ | password | ข้อมูลที่ต้องอ่านกลับ |
| **Encryption** | ✅ ได้ (ถ้ามี key) | เลขบัตร, ข้อมูลส่วนตัวที่ต้องแสดงกลับ | password |
| **Encoding (Base64)** | ✅ ได้ (ไม่ต้องมี key) | ขนส่งข้อมูล | ไม่ใช่ security เลย |

**Base64 ไม่ใช่การเข้ารหัส** — ใครก็ถอดได้ ข้อนี้เป็นกับดักสัมภาษณ์ยอดฮิต และเป็นเหตุผลว่าทำไม payload ของ JWT อ่านได้โดยไม่ต้องมี key

---

## 4. 🧠 ภาพจำ

### ภาพจำที่ 1 — โรงแรม (Authentication vs Authorization)

```
🧠 ภาพจำ:
Authentication = เช็คอินที่เคาน์เตอร์ ยื่นบัตรประชาชน
Authorization  = คีย์การ์ดเปิดได้เฉพาะห้อง 507 กับฟิตเนส

[ยื่นบัตรประชาชน]  → พนักงานรู้ว่าคุณคือใคร      = Authentication
        ↓
[ได้คีย์การ์ด]      → บัตรผ่านชั่วคราว            = Session / Token
        ↓
[แตะเข้าห้อง 507]   → ผ่าน                       = Authorized
        ↓
[แตะเข้าห้อง 508]   → ไฟแดง                      = 403 Forbidden
        ↓
[ทำบัตรหาย]        → แจ้งเคาน์เตอร์ ยกเลิกบัตรใบเก่า = Revoke
        ↓
[เช็คเอาท์]         → บัตรใช้ไม่ได้อีก             = Logout / Expire
```

> **ให้มองภาพนี้ว่า** "บัตรประชาชนบอกว่าคุณเป็นใคร คีย์การ์ดบอกว่าคุณเข้าห้องไหนได้ — และการทำคีย์การ์ดหายไม่เท่ากับการทำบัตรประชาชนหาย"

### ภาพจำที่ 2 — Session vs JWT

```
🧠 ภาพจำ:
Session = ฝากกระเป๋าที่เคาน์เตอร์ แล้วถือ "บัตรคิว" ไว้
          ของจริงอยู่ที่เคาน์เตอร์ → เคาน์เตอร์ยกเลิกบัตรคิวเมื่อไหร่ก็ได้

JWT     = "บัตรผ่านที่ปั๊มตราประทับกันปลอม" แล้วยื่นให้คุณถือไปเลย
          ยามดูแค่ตราประทับว่าจริงไหม ไม่ต้องโทรกลับไปถามออฟฟิศ
          ข้อเสีย: ออฟฟิศยกเลิกบัตรที่ออกไปแล้วยาก เพราะยามไม่ได้โทรกลับมาถาม
```

> **ให้มองภาพนี้ว่า** "Session คือ server จำคุณ ส่วน JWT คือ server ไม่จำ แต่เชื่อลายเซ็นบนบัตรที่คุณถือมา"

### ภาพจำที่ 3 — XSS vs CSRF

```
🧠 ภาพจำ:
XSS  = มีคนแอบเอา "ลำโพงของปลอม" ไปติดในบ้านคุณ
       แล้วสั่งงานได้ทุกอย่างในบ้าน เพราะมันอยู่ในบ้านแล้ว
       → ผู้ร้ายรัน code ในหน้าเว็บของเรา

CSRF = มีคนปลอมจดหมายในนามคุณ ส่งไปที่ธนาคาร
       ธนาคารเห็นลายเซ็น (cookie) ที่ถูกต้อง เลยทำตาม
       → ผู้ร้ายไม่ได้เข้ามาในบ้าน แต่ยืม "ความเชื่อใจ" ของ browser ไปใช้
```

> **ให้มองภาพนี้ว่า** "XSS คือผู้ร้ายเข้ามาอยู่ในบ้านคุณ ส่วน CSRF คือผู้ร้ายอยู่นอกบ้านแต่ปลอมลายเซ็นคุณ"

### ภาพจำที่ 4 — Password Hashing + Salt

```
🧠 ภาพจำ:
Hash = เครื่องบดเนื้อ  → ใส่เนื้อเข้าไปได้ เอาเนื้อกลับออกมาไม่ได้
Salt = เครื่องเทศเฉพาะคน → สองคนใช้รหัสเดียวกัน แต่ผลลัพธ์ต่างกัน
Cost = ปรับให้เครื่องบดช้าลง → ผู้ร้ายลองเดาได้น้อยครั้งลงมากต่อวินาที

password + salt
      ↓
  bcrypt/argon2 (ช้าโดยตั้งใจ)
      ↓
  hash เก็บใน database
```

> **ให้มองภาพนี้ว่า** "เราไม่ได้เก็บรหัสผ่าน เราเก็บ 'ร่องรอย' ที่ตรวจสอบได้แต่ย้อนกลับไม่ได้ และเราจงใจทำให้กระบวนการนี้ช้าเพื่อให้การเดาไม่คุ้ม"

### ภาพจำที่ 5 — CORS

```
🧠 ภาพจำ:
CORS = กฎของ "ยามในตัวอาคาร browser" ไม่ใช่กฎของ server ปลายทาง

หน้าเว็บ A อยากเรียก API ของ B
      ↓
Browser ถาม B: "คุณอนุญาตให้ A เรียกไหม"
      ↓
B ตอบมาใน response header
      ↓
ถ้าไม่อนุญาต → Browser ไม่ให้ JavaScript อ่านผลลัพธ์
               (แต่ request อาจไปถึง server แล้ว!)
```

> **ให้มองภาพนี้ว่า** "CORS คือ browser ปกป้องผู้ใช้ ไม่ใช่ server ปกป้องตัวเอง — ปิด CORS ไม่ได้ทำให้ API ปลอดภัยขึ้นแม้แต่นิดเดียว"

---

## 5. How It Works

### 5.1 Login Flow (ต้องวาดได้จากความจำ)

```
[USER]
   │  กรอก email + password
   ↓
[LOGIN PAGE / CLIENT]
   │  POST /auth/login  (ผ่าน HTTPS เท่านั้น)
   ↓
[SERVER]
   │
   ├─→ [1] Rate limit check     ← กัน brute force ก่อนแตะ database
   │
   ├─→ [2] Input validation     ← รูปแบบ email ถูกไหม, ความยาวเกินไหม
   │
   ├─→ [3] หา user จาก email    ← ถ้าไม่เจอ อย่าบอกว่า "ไม่มี email นี้"
   │
   ↓
[VERIFY PASSWORD]
   │  เอา password ที่ส่งมา + salt ที่เก็บไว้
   │  ผ่าน bcrypt/argon2 แล้วเทียบกับ hash ใน database
   │  (ไม่มีขั้นตอน "ถอดรหัส" — hash ย้อนกลับไม่ได้)
   ↓
   ├─ ไม่ตรง → นับ failed attempt → ตอบ 401 ข้อความกลาง ๆ
   │            "email หรือ password ไม่ถูกต้อง"
   │
   └─ ตรง ↓
[ISSUE CREDENTIAL]
   │
   ├── แบบ Session: สร้าง session ฝั่ง server → ส่ง session ID ใน cookie
   │
   └── แบบ JWT:     เซ็น access token (อายุสั้น)
                    + refresh token (อายุยาว, เก็บ reference ฝั่ง server)
   ↓
[CLIENT]
   │  เก็บ credential (ทางที่ปลอดภัยที่สุด = HttpOnly cookie)
   ↓
[AUTHENTICATED REQUEST]
   │  ทุก request ถัดไปแนบ cookie/token
   ↓
[SERVER] → Authentication middleware → Authorization middleware → Business Logic
   ↓
[RESPONSE]
```

> **ให้มองภาพนี้ว่า** "การล็อกอินคือการยื่นหลักฐานถาวรครั้งเดียว เพื่อแลกเป็นบัตรผ่านชั่วคราวที่ใช้แทนกันได้ตลอด session"

จุดที่คนมักตอบไม่ครบตอนสัมภาษณ์ คือ **ขั้นตอน [1] rate limit** และ **ข้อความ error ที่ต้องกลาง ๆ**
ถ้าตอบว่า "ไม่มี email นี้ในระบบ" เท่ากับบอกผู้ไม่หวังดีว่า email ไหนมีอยู่จริง (user enumeration)

### 5.2 Session-based Authentication

```
LOGIN
[Client] ──login──→ [Server]
                       │ สร้าง session ในหน่วยความจำ/Redis/DB
                       │ session: { id: "abc123", userId: 42, exp }
                       ↓
[Client] ←─Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax

REQUEST ถัดไป
[Client] ──Cookie: sid=abc123──→ [Server]
                                    │ ค้นหา session "abc123" ใน store
                                    │ เจอ + ยังไม่หมดอายุ → รู้ว่าเป็น user 42
                                    ↓
                                 Business Logic

LOGOUT
[Client] ──logout──→ [Server] ── ลบ session ออกจาก store ──→ บัตรใช้ไม่ได้ทันที
```

> **ให้มองภาพนี้ว่า** "Session คือ server เก็บสมุดบันทึกว่าใครล็อกอินอยู่บ้าง และฉีกหน้านั้นทิ้งได้ทันทีเมื่อต้องการ"

**จุดแข็ง:** ยกเลิกได้ทันที ควบคุมได้เต็มที่
**จุดอ่อน:** server ต้องเก็บ state → ถ้ามีหลาย instance ต้องใช้ shared store (เช่น Redis) ไม่งั้น user จะหลุด login เมื่อ load balancer ส่งไปอีกเครื่อง

### 5.3 JWT (Token-based) Authentication

โครงสร้าง JWT มี 3 ส่วนคั่นด้วยจุด:

```
header . payload . signature

header    → บอกว่าใช้ algorithm อะไร
payload   → claims เช่น sub (user id), exp (หมดอายุ), role
signature → เซ็นด้วย secret/private key ของ server
```

**สำคัญมาก: header กับ payload เป็นแค่ Base64URL — ใครก็อ่านได้**
ดังนั้น **ห้ามใส่ข้อมูลลับใน JWT payload** (เลขบัตร, password, ข้อมูลส่วนบุคคลอ่อนไหว)
signature ป้องกันแค่ "การแก้ไข" ไม่ได้ป้องกัน "การอ่าน"

```
LOGIN
[Client] ──login──→ [Server]
                       │ เซ็น access token (เช่น อายุ 15 นาที)
                       │ ออก refresh token (เช่น อายุ 7 วัน) + เก็บ reference ฝั่ง server
                       ↓
[Client] ←── access token + refresh token

REQUEST ถัดไป
[Client] ──Authorization: Bearer <access>──→ [Server]
                                               │ verify signature ด้วย key
                                               │ เช็ค exp
                                               │ ไม่ต้องคุย database เลย
                                               ↓
                                            Business Logic
```

> **ให้มองภาพนี้ว่า** "JWT คือบัตรที่ตรวจได้ด้วยตัวมันเอง ยามแค่ดูตราประทับ ไม่ต้องโทรกลับไปถามออฟฟิศ — เร็วขึ้น แต่ออฟฟิศก็สั่งยกเลิกบัตรใบนั้นกลางคันได้ยากขึ้นด้วย"

### 5.4 Access Token + Refresh Token และ Rotation

ทำไมต้องมี 2 ใบ:

| Token | อายุ | เก็บที่ | ถ้าหลุด |
|---|---|---|---|
| Access Token | สั้น (นาที) | ส่งกับทุก request | เสียหายจำกัดเวลา |
| Refresh Token | ยาว (วัน–สัปดาห์) | ส่งเฉพาะตอนต่ออายุ | เสียหายหนัก → ต้อง revoke ได้ |

```
REFRESH FLOW พร้อม ROTATION

[Client] access token หมดอายุ
   ↓
[Client] ──refresh token (R1)──→ [Server]
                                    │ เช็คว่า R1 ยังมีอยู่ใน store และยังไม่ถูกใช้
                                    │
                                    ├─ ถูกต้อง → ออก access ใหม่ + refresh ใหม่ (R2)
                                    │            ทำลาย R1 ทิ้ง
                                    │
                                    └─ R1 เคยถูกใช้ไปแล้ว (reuse detected)
                                         ↓
                                       สงสัยว่า token ถูกขโมย
                                         ↓
                                       ยกเลิกทั้ง token family ของ user นี้
                                         ↓
                                       บังคับให้ login ใหม่
```

> **ให้มองภาพนี้ว่า** "refresh token ใช้ได้ครั้งเดียวเหมือนตั๋วแลกของ ถ้ามีคนเอาตั๋วใบเดิมมาใช้ซ้ำ แปลว่ามีตั๋วปลอมในระบบ — ต้องยกเลิกทั้งชุดทันที"

**Refresh token rotation + reuse detection คือคำตอบระดับ senior ของคำถาม "JWT revoke ไม่ได้ทำยังไง"**

### 5.5 ปัญหาการ Revoke JWT — และทางแก้จริง

JWT เป็น stateless แปลว่า server ไม่ได้จำว่าออก token ใบไหนไปบ้าง
ผลคือ **ถ้าจะยกเลิก token ที่ยังไม่หมดอายุ ทำไม่ได้โดยตรง**

สถานการณ์ที่ต้อง revoke จริงในงาน:

- ผู้ใช้กด logout
- ผู้ใช้เปลี่ยน password
- admin ระงับบัญชี
- เปลี่ยน role (เช่น ถอดสิทธิ์ admin)
- สงสัยว่า token ถูกขโมย

ทางแก้ที่ใช้จริง (ตอบให้ครบจะดูแข็งแรงมาก):

| วิธี | ทำอย่างไร | trade-off |
|---|---|---|
| **Access token อายุสั้นมาก** | 5–15 นาที | ช่องโหว่แคบลง แต่ไม่ได้หายไป ต้อง refresh บ่อย |
| **Denylist / Blocklist** | เก็บ jti ของ token ที่ถูกยกเลิกไว้ใน Redis จนกว่าจะหมดอายุ | ได้ผลจริง แต่ **กลายเป็น stateful** — ขัดกับเหตุผลที่เลือก JWT ตั้งแต่แรก |
| **Token version ต่อ user** | เก็บเลข version ใน DB, ใส่ใน claim; เปลี่ยน password = bump version | revoke ทุก token ของ user ได้ทีเดียว แต่ต้องอ่าน DB ทุก request |
| **Refresh token rotation** | ยกเลิกที่ชั้น refresh แทน | มาตรฐานที่ใช้จริงที่สุด แต่ access token ใบปัจจุบันยังใช้ได้จนหมดอายุ |
| **กลับไปใช้ session** | สำหรับ web app ที่ไม่ได้ต้อง cross-domain | ง่ายและปลอดภัยกว่าในหลายกรณี |

**ประโยคที่ควรพูดในห้องสัมภาษณ์:**

> "JWT ไม่ได้ revoke ไม่ได้ แต่วิธี revoke ทุกวิธีล้วนทำให้มัน stateful — ถ้าเราต้องการ revoke ทันทีเป็นหลัก ตั้งแต่แรกอาจควรใช้ session มากกว่า"

### 5.6 OAuth2 และ SSO

**OAuth2 ตอบโจทย์เดียว: ให้ app หนึ่งเข้าถึงข้อมูลใน service อื่นแทนผู้ใช้ โดยไม่ต้องมอบ password ให้**

```
[USER] อยากให้ App A เข้าถึงไฟล์ใน Service B
   ↓
[APP A] ส่ง user ไปหน้า login ของ B  (User Agent Redirect)
   ↓
[SERVICE B] user login ที่ B เอง  ← password ไม่เคยผ่านมือ App A
   ↓
[SERVICE B] ถาม user: "อนุญาตให้ App A อ่านไฟล์ของคุณไหม"  = Consent
   ↓  user กดอนุญาต
[SERVICE B] ส่ง authorization code กลับมาที่ App A
   ↓
[APP A] เอา code แลกเป็น access token (ยิงหลังบ้าน server-to-server)
   ↓
[APP A] ใช้ access token เรียก API ของ B ในขอบเขต (scope) ที่ได้รับเท่านั้น
```

> **ให้มองภาพนี้ว่า** "OAuth2 คือการให้กุญแจสำรองที่เปิดได้แค่บางห้องและหมดอายุเอง แทนการยื่นกุญแจบ้านทั้งพวงให้คนอื่น"

คำที่ต้องแยกให้ออก:

| คำ | คืออะไร |
|---|---|
| **OAuth2** | Authorization framework (มอบสิทธิ์เข้าถึงทรัพยากร) |
| **OIDC** | ชั้นที่วางบน OAuth2 เพื่อบอกว่า "ผู้ใช้คนนี้คือใคร" (ออก ID Token) |
| **SSO** | ประสบการณ์ที่ล็อกอินครั้งเดียวใช้ได้หลายระบบ (มักสร้างด้วย OIDC/SAML) |

**กับดักสัมภาษณ์:** "Login with Google คือ OAuth2 ใช่ไหม"
คำตอบที่ถูกกว่าคือ "การเข้าถึงข้อมูลใช้ OAuth2 แต่การ *ยืนยันว่าเป็นใคร* ใช้ OIDC ที่วางอยู่บน OAuth2 อีกที — OAuth2 เพียว ๆ ออกแบบมาเพื่อ authorization ไม่ใช่ authentication"

```
SSO ภาพรวม

              ┌── App 1 ──┐
[USER] → [IdP]├── App 2 ──┤ ทุก app เชื่อ IdP เดียวกัน
              └── App 3 ──┘
```

> **ให้มองภาพนี้ว่า** "SSO คือการมีฝ่ายทะเบียนกลางหนึ่งแห่ง ทุกแผนกไม่ต้องตรวจบัตรเอง แค่เชื่อใบรับรองจากฝ่ายทะเบียน"

**Trade-off ของ SSO:** สะดวกมากและจัดการ offboarding ได้ทีเดียว แต่ IdP กลายเป็น single point of failure — IdP ล่ม = ทุกระบบล็อกอินไม่ได้

### 5.7 Authorization: RBAC, Role, Permission

```
User ──มี──→ Role ──มี──→ Permission ──ควบคุม──→ Resource/Action

ตัวอย่าง:
สมชาย → role: "editor" → permissions: [article:read, article:write]
                                        ↓
                            เขียนบทความได้ แต่ลบบทความคนอื่นไม่ได้
```

> **ให้มองภาพนี้ว่า** "อย่าผูกสิทธิ์ไว้กับตัวคน ให้ผูกไว้กับตำแหน่ง แล้วค่อยแต่งตั้งคนเข้าตำแหน่ง — วันที่คนย้ายงาน คุณแก้ที่เดียว"

| แนวทาง | ตัดสินจาก | เหมาะเมื่อ |
|---|---|---|
| **RBAC** | role ของ user | สิทธิ์แบ่งตามตำแหน่งชัดเจน (ระบบส่วนใหญ่) |
| **ABAC** | attribute เช่น เจ้าของข้อมูล, แผนก, เวลา | เงื่อนไขซับซ้อน เช่น "แก้ได้เฉพาะเอกสารของแผนกตัวเอง" |
| **Ownership check** | user เป็นเจ้าของ resource นั้นไหม | แทบทุกระบบต้องมีคู่กับ RBAC |

**ข้อผิดพลาดที่พบบ่อยที่สุดในระบบจริง** คือมี RBAC แต่ลืม ownership check
ผลคือ user ที่มี role `customer` เหมือนกัน สามารถเรียก `GET /orders/999` ดูออเดอร์ของคนอื่นได้
(ช่องโหว่ประเภทนี้เรียกรวม ๆ ว่า broken object level authorization และพบบ่อยมากใน API จริง)

**กฎเหล็ก: ตรวจสิทธิ์ที่ฝั่ง server เสมอ และตรวจว่าเป็นเจ้าของข้อมูลนั้นจริงเสมอ** การซ่อนปุ่มใน UI ไม่ใช่การป้องกัน

### 5.8 Password Hashing

```
ตอน REGISTER
password ──+ salt (สุ่มต่อ user)──→ bcrypt/argon2/scrypt (ช้าโดยตั้งใจ)
                                          ↓
                                    hash เก็บใน DB

ตอน LOGIN
password ที่กรอก ──+ salt เดิม──→ algorithm เดิม ──→ เทียบกับ hash ที่เก็บไว้
                                                          ↓
                                                    ตรง / ไม่ตรง
```

> **ให้มองภาพนี้ว่า** "เราไม่เคยเก็บรหัสผ่านจริง เราเก็บผลลัพธ์ที่คำนวณย้อนกลับไม่ได้ และเราตรวจด้วยการคำนวณใหม่แล้วเทียบ"

**กฎที่ห้ามละเมิด:**

| ✅ ทำ | ❌ ห้ามทำ | เหตุผล |
|---|---|---|
| ใช้ **bcrypt / argon2 / scrypt** | ใช้ MD5, SHA-1, SHA-256 เปล่า ๆ | hash ทั่วไปออกแบบมาให้ *เร็ว* ซึ่งเป็นสิ่งที่ผู้เดารหัสต้องการพอดี |
| ใช้ **salt สุ่มต่อ user** (library ทำให้อัตโนมัติ) | salt เดียวกันทั้งระบบ / ไม่ใช้ salt | ถ้าไม่มี salt คนที่ใช้รหัสเดียวกันจะได้ hash เหมือนกัน และเทียบกับตารางที่คำนวณไว้ล่วงหน้าได้ |
| ปรับ **cost/work factor** ให้เหมาะกับเครื่อง | ใช้ค่า default ต่ำสุดตลอดไป | ฮาร์ดแวร์เร็วขึ้นทุกปี ต้องรีวิวเป็นระยะ |
| ใช้ **library มาตรฐาน** | เขียน crypto เอง | โอกาสพลาดสูงมากและตรวจไม่เจอจนสาย — **อย่าเขียน crypto เอง เด็ดขาด** |
| เทียบด้วยฟังก์ชัน compare ของ library | เทียบ string ด้วย `===` ตรง ๆ | ฟังก์ชันของ library จัดการเรื่องการเทียบอย่างปลอดภัยให้แล้ว |
| บังคับความยาวขั้นต่ำและเช็ครหัสที่รั่วแล้ว | บังคับกฎแปลก ๆ เช่นต้องมีสัญลักษณ์แต่จำกัดความยาว 12 ตัว | ความยาวสำคัญกว่าความซับซ้อน และการจำกัดความยาวสูงสุดต่ำเป็นสัญญาณว่าอาจไม่ได้ hash |

### 5.9 HTTPS / TLS

```
[CLIENT] ──── TLS Handshake ────→ [SERVER]
   │  1. ตกลงว่าจะใช้วิธีเข้ารหัสแบบไหน
   │  2. server ส่ง certificate มา
   │  3. client ตรวจว่า CA ที่เซ็นน่าเชื่อถือไหม + domain ตรงไหม + หมดอายุหรือยัง
   │  4. ตกลง key สำหรับ session นี้
   ↓
[ช่องทางที่เข้ารหัสแล้ว]
   ↓
ข้อมูลทุกอย่างหลังจากนี้ถูกเข้ารหัส: body, header, cookie, token
```

> **ให้มองภาพนี้ว่า** "HTTPS คือการส่งจดหมายในซองปิดผนึกผ่านท่อที่ล็อกไว้ และตรวจบัตรประจำตัวของปลายทางก่อนเริ่มคุย"

HTTPS ให้ 3 อย่าง:

| สิ่งที่ได้ | หมายความว่า |
|---|---|
| **Confidentiality** | คนกลางอ่านเนื้อหาไม่ได้ |
| **Integrity** | คนกลางแก้เนื้อหาระหว่างทางไม่ได้โดยไม่ถูกจับได้ |
| **Authentication (ของ server)** | ยืนยันว่าคุณคุยกับ domain นั้นจริง |

**สิ่งที่ HTTPS ไม่ได้ให้:** ไม่ได้ทำให้ code คุณปลอดภัย ไม่ได้กัน SQL injection ไม่ได้กัน XSS
มันปกป้อง "ระหว่างทาง" เท่านั้น

**Production ต้องเป็น HTTPS เสมอ** เพราะถ้าเป็น HTTP: token, cookie, password วิ่งเป็นข้อความเปิดบนเครือข่ายที่คุณควบคุมไม่ได้

### 5.10 CORS — จุดที่คนเข้าใจผิดมากที่สุด

**CORS ไม่ใช่ security feature ของ server — มันคือกฎที่ browser บังคับใช้เพื่อปกป้องผู้ใช้**

```
หน้าเว็บที่ https://app.example.com
      ↓ JavaScript เรียก https://api.other.com/data
[BROWSER]
      │ คนละ origin → ต้องเช็ค CORS
      │
      ├─ ถ้าเป็น request "ธรรมดา" (simple request)
      │     → ยิงไปเลย แล้วดู header ตอนตอบกลับ
      │        ถ้า Access-Control-Allow-Origin ไม่อนุญาต
      │        → browser "ไม่ให้ JavaScript อ่านผล" (แต่ request ถึง server แล้ว)
      │
      └─ ถ้าเป็น request ที่ซับซ้อนกว่า (custom header, method แปลก)
            → ส่ง OPTIONS ไปถามก่อน (Preflight)
               ↓
            server ตอบว่าอนุญาต origin/method/header ไหนบ้าง
               ↓
            อนุญาต → ค่อยยิงของจริง
            ไม่อนุญาต → browser บล็อกตั้งแต่ยังไม่ยิงของจริง
```

> **ให้มองภาพนี้ว่า** "CORS คือ browser ถามแทนผู้ใช้ว่า 'เว็บนี้เรียก API นี้ได้ไหม' — ไม่ใช่ server ตั้งกำแพงกันตัวเอง"

สิ่งที่ต้องพูดให้ถูกในห้องสัมภาษณ์:

| ความเข้าใจผิด | ความจริง |
|---|---|
| "ตั้ง CORS แล้ว API ปลอดภัยขึ้น" | ไม่เลย — `curl`, Postman, server อื่น ไม่สนใจ CORS เพราะไม่ใช่ browser |
| "เจอ CORS error แปลว่า server ปฏิเสธ request" | ไม่เสมอไป — server อาจประมวลผลไปแล้ว แต่ browser ไม่ให้ JS อ่านผล |
| "แก้ CORS ที่ frontend" | แก้ไม่ได้ — ต้องแก้ที่ response header ของ server |
| "ตั้ง `*` ไว้ก่อน เดี๋ยวค่อยแก้" | `*` ใช้ร่วมกับ credentials (cookie) ไม่ได้ และมักติดขึ้น production |

**Authorization ที่แท้จริงต้องอยู่ที่ server เสมอ** — CORS เป็นแค่กฎของ browser

### 5.11 XSS vs CSRF

#### XSS (Cross-Site Scripting)

**เกิดจากอะไร:** ระบบเอาข้อมูลที่ผู้ใช้ส่งมา ไปแสดงในหน้าเว็บโดยไม่ได้ทำให้มันเป็น "ข้อความธรรมดา" ทำให้ browser ตีความบางส่วนเป็น code แทนที่จะเป็นข้อความ

**ผลที่ตามมา:** code ที่ไม่ใช่ของเราทำงานในบริบทหน้าเว็บของเรา → อ่านอะไรก็ได้ที่ JavaScript อ่านได้ รวมถึง `localStorage`

**ป้องกันอย่างไร:**

| มาตรการ | หลักการ |
|---|---|
| **Output encoding / escaping** | ตอนแสดงผล ให้ทุกอย่างถูกปฏิบัติเป็นข้อความ ไม่ใช่ markup — framework สมัยใหม่ (React ฯลฯ) ทำให้โดย default |
| **ห้าม inject HTML ดิบจาก user** | หลีกเลี่ยงการใส่ HTML จาก user ตรง ๆ ถ้าจำเป็นต้อง sanitize ด้วย library ที่ผ่านการตรวจสอบแล้ว |
| **Content Security Policy (CSP)** | บอก browser ว่าโหลด/รัน script จากแหล่งไหนได้บ้าง = ด่านสำรองเมื่อด่านแรกพลาด |
| **HttpOnly cookie** | ทำให้ token ที่สำคัญอยู่นอกมือ JavaScript |
| **Validate input** | ลดพื้นที่ปัญหา แต่ **ไม่ใช่การป้องกันหลัก** — การป้องกันหลักคือตอน output |

> **ประเด็นที่ทำให้ดูเข้าใจลึก:** XSS แก้ที่ "ตอนแสดงผล" เป็นหลัก ไม่ใช่ "ตอนรับ input" เพราะข้อมูลเดียวกันปลอดภัยหรือไม่ ขึ้นกับว่าเอาไปวางในบริบทไหน (HTML body, attribute, URL, JS)

#### CSRF (Cross-Site Request Forgery)

**เกิดจากอะไร:** browser แนบ cookie ของ domain หนึ่งไปกับ request ที่ถูกกระตุ้นจากอีกเว็บหนึ่งโดยอัตโนมัติ ทำให้ server เห็น request ที่ "ดูเหมือนมาจากผู้ใช้ที่ล็อกอินอยู่"

**เงื่อนไขที่ทำให้เกิด:** ระบบพึ่ง cookie เพียงอย่างเดียวในการยืนยันตัวตน

```
เงื่อนไขของ CSRF:
[ผู้ใช้ล็อกอินค้างไว้]  +  [ระบบใช้ cookie อัตโนมัติ]  +  [ไม่มีมาตรการเพิ่ม]
                            ↓
                      request ปลอมผ่านได้
```

**ป้องกันอย่างไร:**

| มาตรการ | หลักการ |
|---|---|
| **SameSite cookie** | บอก browser ว่าอย่าแนบ cookie ไปกับ request ที่มาจากเว็บอื่น — ด่านแรกที่ได้ผลมากที่สุดในปัจจุบัน |
| **CSRF token** | ให้ server ออกค่าสุ่มที่เว็บอื่นไม่มีทางรู้ แล้วบังคับให้แนบมากับ request ที่เปลี่ยนแปลงข้อมูล |
| **ตรวจ Origin/Referer** | เช็คว่า request มาจาก origin ที่เราคาดหวัง |
| **ไม่ใช้ GET เปลี่ยนข้อมูล** | GET ต้องไม่มี side effect — ไม่งั้นแค่โหลดรูปก็ทำให้เกิด action ได้ |

**ถ้าใช้ Authorization header (Bearer token) แทน cookie ล้วน ๆ** ความเสี่ยง CSRF จะลดลงมาก เพราะ browser ไม่ได้แนบ header นั้นให้อัตโนมัติ — แต่แลกมาด้วยการที่ token ต้องอยู่ในที่ที่ JavaScript เข้าถึงได้ ซึ่งเปิดความเสี่ยง XSS แทน **นี่คือ trade-off ที่ต้องพูดให้ได้**

#### ตารางเทียบที่ต้องตอบได้

| | XSS | CSRF |
|---|---|---|
| ผู้ร้ายทำอะไร | ทำให้ script ทำงานในหน้าเว็บของเรา | ทำให้ browser ผู้ใช้ยิง request ที่ผู้ใช้ไม่ได้ตั้งใจ |
| อาศัยความเชื่อใจของใคร | ผู้ใช้เชื่อใจเว็บของเรา | เว็บของเราเชื่อใจ browser ของผู้ใช้ |
| ต้องล็อกอินอยู่ไหม | ไม่จำเป็น | ต้องล็อกอินค้างอยู่ |
| ป้องกันหลักด้วย | output encoding + CSP | SameSite + CSRF token |
| HttpOnly ช่วยไหม | ช่วย (กันขโมย cookie) | ไม่ช่วย (cookie ยังถูกแนบอัตโนมัติอยู่ดี) |
| ความรุนแรง | สูงมาก — ทำได้เกือบทุกอย่างที่ผู้ใช้ทำได้ | สูง แต่จำกัดที่ action ที่ยิงได้ |

**ประโยคจำ:** *XSS = code แปลกปลอมรันในเว็บเรา / CSRF = request แปลกปลอมมาจากเว็บอื่น*

### 5.12 SQL Injection และ NoSQL Injection

**สาเหตุร่วมของทั้งคู่: เอาข้อมูลจากผู้ใช้ไปปนกับ "คำสั่ง" จนระบบแยกไม่ออกว่าอันไหนข้อมูล อันไหนคำสั่ง**

```
ต้นเหตุ:
[User Input] ──ต่อ string เข้าไปตรง ๆ──→ [Query]
                                           ↓
                             ฐานข้อมูลตีความบางส่วนของ input เป็นคำสั่ง

วิธีแก้ที่ถูกต้อง:
[User Input] ──ส่งแยกเป็น parameter──→ [Query ที่มีโครงตายตัว]
                                           ↓
                             ฐานข้อมูลถือว่า input เป็น "ข้อมูล" เสมอ
```

> **ให้มองภาพนี้ว่า** "ปัญหาไม่ใช่ว่าผู้ใช้พิมพ์อะไรแปลก ๆ มา แต่คือเราปล่อยให้สิ่งที่ผู้ใช้พิมพ์กลายเป็นส่วนหนึ่งของคำสั่ง"

| มาตรการ | หลักการ |
|---|---|
| **Parameterized query / prepared statement** | มาตรการหลัก — แยกคำสั่งกับข้อมูลออกจากกันโดยสิ้นเชิง |
| **ใช้ ORM/query builder อย่างถูกวิธี** | ORM ช่วยได้ แต่ถ้าใช้ raw query ต่อ string เองก็ยังพังเหมือนเดิม |
| **Input validation (allowlist)** | โดยเฉพาะส่วนที่ parameterize ไม่ได้ เช่น ชื่อคอลัมน์สำหรับ sort — ต้องเทียบกับรายการที่อนุญาตเท่านั้น |
| **Least privilege ที่ระดับ DB user** | app ไม่ควรต่อ DB ด้วย account ที่ลบตารางได้ |
| **ไม่ส่ง DB error กลับไปหา client** | error ดิบเปิดเผยโครงสร้างภายใน |

**NoSQL Injection** เกิดจากคนละท่าแต่หลักการเดียวกัน: ระบบรับค่าจาก client แล้วเอาไปวางเป็น "เงื่อนไข query" ตรง ๆ ถ้า client ส่ง object แทนที่จะเป็น string ค่านั้นอาจกลายเป็น operator ของ query engine

ป้องกันด้วย:

- บังคับ type ให้แน่นอน (ถ้าคาดหวัง string ต้องเป็น string เท่านั้น)
- ใช้ schema validation ก่อนถึงชั้น query
- ห้ามโยน `req.body` ทั้งก้อนเข้าไปเป็นเงื่อนไข query
- ห้ามโยน `req.body` ทั้งก้อนเข้า update operation (mass assignment — user อาจแอบส่ง `role: "admin"` มาด้วย)

### 5.13 Rate Limiting / Brute Force Protection

```
[Request]
   ↓
[Rate Limiter]  ← นับตาม IP / user / API key ต่อหน้าต่างเวลา
   ↓ เกินโควต้า
[429 Too Many Requests] + Retry-After
```

> **ให้มองภาพนี้ว่า** "rate limit คือการจำกัดจำนวนคนที่เข้าคิวต่อชั่วโมง เพื่อให้ระบบไม่ล้มและการเดารหัสไม่คุ้มค่า"

จุดที่ต้องมีเป็นพิเศษ:

| Endpoint | ทำไม |
|---|---|
| `/auth/login` | กันการเดารหัสซ้ำ ๆ |
| `/auth/forgot-password` | กันการยิง email สแปมและการหา user |
| `/auth/refresh` | กันการลองใช้ refresh token |
| endpoint ที่แพง (export, report, search) | กัน resource exhaustion |

มาตรการเสริมที่ควรพูดถึง: **exponential backoff** (ยิ่งผิดยิ่งต้องรอนาน), **account lockout ชั่วคราว**, **CAPTCHA เมื่อผิดหลายครั้ง**, และ **MFA** ซึ่งเป็นมาตรการที่ได้ผลที่สุดในการกันการเข้าถึงบัญชีแม้รหัสผ่านจะรั่ว

**หมายเหตุสำคัญเวลาทำจริง:** ถ้ามี load balancer/reverse proxy อยู่หน้า service การนับตาม IP ต้องอ่าน IP จริงของผู้ใช้ให้ถูกวิธี ไม่งั้นคุณจะนับ IP ของ proxy แล้วบล็อกผู้ใช้ทั้งโลกพร้อมกัน — และต้องเชื่อ header นั้นเฉพาะเมื่อมาจาก proxy ที่เราควบคุมเท่านั้น

### 5.14 Secret Management

```
❌ ผิด:
code ──มี secret ฝังอยู่──→ git repository ──→ ทุกคนที่เข้าถึง repo เห็นหมด
                                              (และ history ลบยากมาก)

✅ ถูก:
code ──อ่านจาก──→ Environment Variable
                        ↑
                  Secret Manager / Vault / CI-CD secret store
                  (มี access control + audit log + rotation)
```

> **ให้มองภาพนี้ว่า** "code คือสิ่งที่ทุกคนอ่านได้ในที่สุด ส่วน secret คือสิ่งที่ควรมีคนเห็นน้อยที่สุด — สองอย่างนี้ห้ามอยู่ในที่เดียวกัน"

กฎที่ต้องจำ:

| กฎ | เหตุผล |
|---|---|
| `.env` ต้องอยู่ใน `.gitignore` เสมอ | กันการ commit โดยไม่ตั้งใจ |
| commit `.env.example` ที่มีแต่ชื่อ key | ทีมรู้ว่าต้องตั้งค่าอะไรบ้างโดยไม่หลุดค่าจริง |
| secret แต่ละ environment ต้องคนละค่า | dev หลุดไม่กระทบ production |
| **ถ้า secret เคยขึ้น git ถือว่ารั่วแล้ว** | ต้อง rotate (เปลี่ยนค่าใหม่) ไม่ใช่แค่ลบ commit เพราะ history ยังอยู่ |
| ห้าม log secret / token | log มักถูกส่งต่อไปยังระบบอื่นและเก็บไว้นาน |
| ห้ามใส่ secret ใน frontend bundle | ทุกอย่างที่ส่งไป browser ผู้ใช้เปิดดูได้หมด |
| ตั้งรอบ rotation | ลดความเสียหายเมื่อรั่วโดยไม่รู้ตัว |

**กับดักที่เจอบ่อย:** ตัวแปรที่ขึ้นต้นด้วย prefix สำหรับ frontend (เช่นใน Next.js/Vite) จะถูกฝังลงไปใน bundle ที่ผู้ใช้โหลด — **ห้ามเอา API secret ใส่ตรงนั้นเด็ดขาด** ตัวแปรกลุ่มนี้มีไว้สำหรับค่าที่เปิดเผยได้เท่านั้น

### 5.15 Cookie Flags: HttpOnly, Secure, SameSite

```
Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=...
```

| Flag | ป้องกันอะไร | ถ้าไม่ใส่ |
|---|---|---|
| **HttpOnly** | JavaScript อ่าน cookie ไม่ได้ | XSS ที่หลุดเข้ามาสามารถอ่าน session/token ได้ |
| **Secure** | ส่ง cookie เฉพาะบน HTTPS | cookie อาจวิ่งบน HTTP แบบเปิดเผย |
| **SameSite=Lax/Strict** | browser ไม่แนบ cookie ไปกับ request ข้ามเว็บ (Strict เข้มกว่า) | เปิดช่องให้ CSRF |
| **SameSite=None** | ต้องใช้คู่กับ Secure เมื่อจำเป็นต้องข้าม site จริง ๆ | ถ้าใช้โดยไม่จำเป็นคือลดการป้องกันลงเอง |
| **Domain / Path** | จำกัดขอบเขตที่ cookie ถูกส่งไป | cookie ถูกส่งไปกว้างเกินจำเป็น |
| **Max-Age / Expires** | จำกัดอายุ | session ค้างนานเกินไป |

> **ให้มองภาพนี้ว่า** "flag พวกนี้คือการบอก browser ว่า 'ซองนี้ห้ามให้ script เปิด ห้ามส่งทางที่ไม่ปลอดภัย และห้ามพกไปเว็บอื่น'"

### 5.16 เก็บ Token ที่ไหนดี — trade-off จริง

นี่คือคำถามที่ถูกถามบ่อยมากและ **ไม่มีคำตอบที่ถูกเสมอ** มีแต่ "ถูกเมื่อ..."

| ที่เก็บ | XSS อ่านได้ไหม | CSRF เสี่ยงไหม | ใช้ข้าม domain | เหมาะเมื่อ |
|---|---|---|---|---|
| **HttpOnly cookie** | ❌ อ่านไม่ได้ | ⚠️ เสี่ยง ต้องมี SameSite/CSRF token | ยุ่งยากกว่า ต้องตั้ง CORS + credentials | **Web app ปกติ โดยเฉพาะ same-site — เป็น default ที่แนะนำ** |
| **localStorage** | ⚠️ อ่านได้ทันทีถ้ามี XSS | ✅ ไม่เสี่ยงโดยตรง (ไม่ถูกแนบอัตโนมัติ) | ง่าย | SPA ที่คุย API ข้าม domain และยอมรับความเสี่ยง XSS แล้วมีมาตรการอื่นครบ |
| **sessionStorage** | ⚠️ เหมือน localStorage | ✅ | ง่าย | เหมือนบน แต่หายเมื่อปิดแท็บ |
| **ในหน่วยความจำ (ตัวแปร JS)** | ⚠️ ถ้ามี XSS ตอนนั้นยังอ่านได้ แต่ไม่ค้าง | ✅ | ง่าย | Access token อายุสั้น คู่กับ refresh token ใน HttpOnly cookie — **รูปแบบที่แข็งแรงในทางปฏิบัติ** |

**สรุปแบบที่ใช้ตอบสัมภาษณ์ได้เลย:**

> "ผมจะเก็บ refresh token ใน HttpOnly + Secure + SameSite cookie และเก็บ access token อายุสั้นไว้ในหน่วยความจำของ frontend เหตุผลคือ refresh token เป็นตัวที่หลุดแล้วเสียหายหนักที่สุด จึงต้องอยู่นอกมือ JavaScript ส่วน access token อายุสั้นพอที่ความเสี่ยงจำกัดได้ ข้อแลกเปลี่ยนคือผมต้องจัดการ CSRF สำหรับ cookie และต้อง refresh ใหม่ทุกครั้งที่ผู้ใช้รีเฟรชหน้า"

**ประโยคที่ไม่ควรพูด:** "เก็บใน localStorage ก็ปลอดภัยถ้าไม่มี XSS"
เพราะ security ไม่ตั้งอยู่บนสมมติฐานว่า "ถ้าไม่มีช่องโหว่" — ทั้งระบบต้องยังรอดแม้ด่านหนึ่งพลาด

---

## 6. Example — Scenario จากงานจริง

### Scenario A: ระบบ e-commerce — ใครดูออเดอร์ใครได้

**โจทย์:** ผู้ใช้ทั่วไปดูออเดอร์ตัวเองได้, admin ดูได้ทุกออเดอร์, พนักงานคลังดูได้เฉพาะสถานะจัดส่ง

ลำดับที่ระบบต้องทำเมื่อมี `GET /api/orders/12345`:

```
[1] Authentication    → token ถูกต้องไหม ได้ userId = 42
      ↓
[2] Authorization     → role ของ user 42 มีสิทธิ์ "order:read" ไหม
      ↓
[3] Ownership check   → order 12345 เป็นของ user 42 จริงไหม
      ↓               (ถ้า role = admin ให้ข้ามข้อนี้)
[4] Field filtering   → พนักงานคลังเห็นเฉพาะ field ที่เกี่ยวกับการจัดส่ง
      ↓
[5] Response
```

> **ให้มองภาพนี้ว่า** "การมีบัตรพนักงานไม่ได้แปลว่าเปิดลิ้นชักของเพื่อนร่วมงานได้ — ต้องเช็คทั้งตำแหน่งและความเป็นเจ้าของ"

**ข้อ [3] คือข้อที่ทีมลืมบ่อยที่สุด** และเป็นช่องโหว่ที่พบใน API จริงมากที่สุดข้อหนึ่ง เพราะทุกอย่างดูทำงานปกติในการทดสอบ — จนกว่าจะมีคนเปลี่ยนเลขใน URL

### Scenario B: ผู้ใช้กด "ออกจากระบบทุกอุปกรณ์"

ทีมใช้ JWT ล้วน อายุ 24 ชั่วโมง แล้ว PM ขอ feature นี้

**ปัญหา:** JWT ที่ออกไปแล้วยังใช้ได้อีกถึง 24 ชั่วโมง แม้กด logout

**ตัวเลือกและ trade-off:**

| ทางเลือก | ได้อะไร | เสียอะไร |
|---|---|---|
| ลดอายุ access token เหลือ 10 นาที + ใช้ refresh rotation | logout มีผลภายใน 10 นาที | ต้อง refresh บ่อยขึ้น, เพิ่ม traffic |
| เก็บ `tokenVersion` ต่อ user แล้ว bump ตอน logout | มีผลทันที | ต้องอ่าน DB/cache ทุก request → เสีย stateless |
| Denylist ใน Redis | มีผลทันที ควบคุมได้ละเอียด | เพิ่ม dependency และกลายเป็น stateful |
| ย้ายไป session | มีผลทันที ตรงไปตรงมา | ต้องแก้สถาปัตยกรรม, ต้องมี shared session store |

**สิ่งที่ interviewer อยากได้ยิน:** คุณรู้ว่าทุกทางมีต้นทุน และคุณเลือกจากความต้องการจริง ("ต้องมีผลทันทีจริงไหม หรือภายในไม่กี่นาทีก็พอ")

### Scenario C: ข้อมูล user รั่วจาก database backup

บริษัทหนึ่งทำ backup หลุด ผู้ไม่หวังดีได้ตาราง users ไปทั้งตาราง

| ถ้าระบบเก็บ password แบบ | ผลที่ตามมา |
|---|---|
| Plain text | ทุกบัญชีถูกยึดทันที และผู้ใช้ที่ใช้รหัสซ้ำกับที่อื่นก็เสียหายตามไปด้วย |
| MD5/SHA ธรรมดา ไม่มี salt | ถอดได้เกือบทั้งหมดในเวลาสั้นด้วยตารางที่คำนวณไว้ล่วงหน้า |
| bcrypt/argon2 + salt + cost เหมาะสม | การเดารหัสแพงมากจนไม่คุ้ม รหัสที่แข็งแรงยังปลอดภัย |

> **ให้มองภาพนี้ว่า** "การ hash ที่ถูกวิธีไม่ได้กันไม่ให้ข้อมูลรั่ว แต่มันทำให้ข้อมูลที่รั่วไปแทบไม่มีค่า"

**บทเรียนเชิงสถาปัตยกรรม:** สมมติเสมอว่าวันหนึ่ง database อาจรั่ว แล้วออกแบบให้ความเสียหายจำกัด — นี่คือ defense in depth ในทางปฏิบัติ

### Scenario D: Frontend เจอ CORS error ตอนย้ายขึ้น staging

Dev บ่นว่า "โค้ดเหมือนเดิมเป๊ะ แต่ขึ้น staging แล้ว CORS error"

ไล่ตามนี้:

1. Origin ของ staging ถูกเพิ่มในรายการที่ server อนุญาตหรือยัง (dev มักใส่แค่ `localhost`)
2. ถ้าส่ง cookie ด้วย: ฝั่ง client เปิดโหมดส่ง credentials หรือยัง และฝั่ง server ตั้ง `Access-Control-Allow-Credentials` ไหม
3. ถ้าส่ง credentials **ห้ามใช้ `*`** ต้องระบุ origin ชัดเจน
4. มี custom header (เช่น `Authorization`, `X-Request-Id`) ที่ต้องอนุญาตใน preflight ไหม
5. Preflight (OPTIONS) ถูก auth middleware ดักจนตอบ 401 ก่อนถึง CORS middleware หรือเปล่า — **ข้อนี้คือสาเหตุที่คนหาไม่เจอบ่อยที่สุด และเป็นเรื่องลำดับ middleware ตรง ๆ (ดู PART 6)**

---

## 7. Compare

### 7.1 Authentication vs Authorization

| | Authentication | Authorization |
|---|---|---|
| คำถาม | คุณคือใคร | คุณทำสิ่งนี้ได้ไหม |
| เกิดเมื่อ | ตอน login และตอน verify token/session ทุก request | หลังรู้ตัวตนแล้ว ก่อนทำ action |
| ล้มเหลว = status | 401 | 403 |
| ข้อมูลที่ใช้ | password, token, certificate, OTP | role, permission, ownership, attribute |
| เปลี่ยนบ่อยไหม | ค่อนข้างคงที่ | เปลี่ยนบ่อยตาม business rule |
| เก็บที่ | auth service / IdP | มักอยู่ใน business domain |
| ตัวอย่างพัง | ใครก็ปลอมเป็นคนอื่นได้ | user ธรรมดาลบข้อมูลคนอื่นได้ |

### 7.2 Session vs JWT — ตารางหลักของบทนี้

| หัวข้อ | Session (server-side) | JWT (stateless token) |
|---|---|---|
| **State อยู่ที่ไหน** | ที่ server (memory/Redis/DB) | อยู่ในตัว token ที่ client ถือ |
| **ทุก request ทำอะไร** | ค้น session จาก store | verify signature อย่างเดียว |
| **Revoke ทันที** | ✅ ลบ session ก็จบ | ❌ ทำไม่ได้โดยตรง ต้องเพิ่มกลไกซึ่งทำให้ stateful |
| **Scale หลาย instance** | ต้องมี shared store | ง่าย ไม่ต้องแชร์ state |
| **ขนาดที่ส่งทุก request** | เล็ก (แค่ ID) | ใหญ่กว่า (มี payload) |
| **เปลี่ยน role แล้วมีผลเมื่อไร** | ทันที (อ่านจาก store) | ต้องรอ token หมดอายุ หรือบังคับ refresh |
| **เหมาะกับ** | Web app ปกติ, ระบบที่ต้อง revoke ทันที, ระบบภายในองค์กร | API ที่หลาย service ต้องตรวจเอง, mobile, microservices, cross-domain |
| **จุดอ่อนที่ต้องระวัง** | store ล่ม = ล็อกอินไม่ได้ทั้งระบบ, เป็น bottleneck | token หลุดแล้วยกเลิกยาก, คนใส่ข้อมูลลับใน payload |
| **ต้นทุนแฝง** | ต้องดูแล session store | ต้องออกแบบ refresh/rotation ให้ถูก |

**วิธีตอบให้ดูเป็น mid-level:**

> "ผมไม่คิดว่า JWT ดีกว่า session โดยตัวมันเอง — JWT ดีกว่าเมื่อมีหลาย service ที่ต้อง verify เองโดยไม่อยากให้ทุกตัวไปถาม session store เดียวกัน แต่ถ้าเป็น web app ตัวเดียวที่ต้อง revoke ได้ทันที session เรียบง่ายและปลอดภัยกว่า และในทางปฏิบัติหลายทีมที่เลือก JWT สุดท้ายก็ต้องเพิ่ม store สำหรับ refresh token อยู่ดี ซึ่งแปลว่าได้ stateless ไม่เต็มร้อยตั้งแต่แรก"

### 7.3 Cookie vs Authorization Header

| | Cookie | Authorization Header |
|---|---|---|
| browser แนบให้อัตโนมัติ | ✅ | ❌ ต้องใส่เอง |
| เสี่ยง CSRF | ✅ เสี่ยง | ต่ำมาก |
| เสี่ยงถูกอ่านด้วย XSS | ❌ ถ้าเป็น HttpOnly | ✅ ถ้าเก็บใน storage ที่ JS อ่านได้ |
| ใช้กับ mobile app | ไม่ค่อยสะดวก | สะดวก |
| ข้าม domain | ต้องตั้ง CORS + SameSite ให้ถูก | ง่ายกว่า |
| เหมาะกับ | Web app | API / mobile / service-to-service |

### 7.4 Hashing vs Encryption vs Encoding

| | Hashing | Encryption | Encoding |
|---|---|---|---|
| ย้อนกลับได้ | ❌ | ✅ (ต้องมี key) | ✅ (ใครก็ได้) |
| ใช้ key | ไม่ (มี salt) | ใช้ | ไม่ใช้ |
| ใช้กับ | password | ข้อมูลที่ต้องอ่านกลับ | การขนส่งข้อมูล |
| เป็น security ไหม | ✅ | ✅ | ❌ ไม่ใช่เลย |
| ตัวอย่าง | bcrypt, argon2 | AES | Base64, URL encoding |

### 7.5 XSS vs CSRF vs SQL Injection

| | XSS | CSRF | SQL Injection |
|---|---|---|---|
| เกิดที่ชั้นไหน | Browser (frontend) | Browser + Server | Database layer |
| ต้นเหตุ | เอา input ไปแสดงผลโดยไม่ทำให้เป็นข้อความ | พึ่ง cookie อย่างเดียวในการยืนยันตัวตน | ปน input เข้ากับคำสั่ง query |
| ป้องกันหลัก | Output encoding + CSP | SameSite + CSRF token | Parameterized query |
| ป้องกันเสริม | HttpOnly, sanitize HTML | ตรวจ Origin, ไม่ใช้ GET เปลี่ยนข้อมูล | Least privilege, validation |
| ใครควรรับผิดชอบ | Frontend เป็นหลัก (แต่ backend ก็ต้องช่วย) | Backend เป็นหลัก | Backend |

### 7.6 RBAC vs ABAC vs ACL

| | RBAC | ABAC | ACL |
|---|---|---|---|
| ตัดสินจาก | role | attribute/เงื่อนไข | รายชื่อที่ผูกกับ resource แต่ละชิ้น |
| ตัวอย่าง | admin ลบได้ | แก้ได้เฉพาะเอกสารแผนกตัวเอง ในเวลาทำการ | ไฟล์นี้แชร์ให้ 3 คนนี้ |
| ข้อดี | เข้าใจง่าย จัดการง่าย | ยืดหยุ่นสูง | ละเอียดระดับชิ้นงาน |
| ข้อเสีย | role บานปลายเมื่อเงื่อนไขซับซ้อน | ออกแบบยาก ตรวจสอบยาก | จัดการเยอะเมื่อ resource เยอะ |
| เหมาะเมื่อ | ระบบส่วนใหญ่ | เงื่อนไขขึ้นกับบริบท | ระบบแชร์ไฟล์/เอกสาร |

### 7.7 OAuth2 vs OIDC vs SAML vs SSO

| | คืออะไร | ตอบโจทย์ |
|---|---|---|
| **OAuth2** | Authorization framework | ให้สิทธิ์เข้าถึงทรัพยากรแทนผู้ใช้ |
| **OIDC** | ชั้น identity บน OAuth2 | บอกว่า "ผู้ใช้คนนี้คือใคร" |
| **SAML** | มาตรฐาน SSO แบบเดิม (XML) | นิยมในองค์กร/ระบบ enterprise |
| **SSO** | ประสบการณ์การใช้งาน | ล็อกอินครั้งเดียวใช้หลายระบบ |

---

## 8. Common Mistakes

| # | สิ่งที่ Junior มักทำ | ทำไมอันตราย | ควรทำแทน |
|---|---|---|---|
| 1 | สับสน 401 กับ 403 | frontend ทำ flow ผิด (พาไป login ทั้งที่แค่สิทธิ์ไม่พอ) | 401 = ไม่รู้ว่าคุณเป็นใคร, 403 = รู้แล้วแต่ทำไม่ได้ |
| 2 | เช็คสิทธิ์แค่ที่ frontend (ซ่อนปุ่ม) | ยิง API ตรงก็ผ่านได้ | ตรวจสิทธิ์ที่ server ทุกครั้ง UI เป็นแค่ UX |
| 3 | มี role check แต่ไม่มี ownership check | user ดู/แก้ข้อมูลคนอื่นได้ด้วยการเปลี่ยนเลขใน URL | เช็คทั้ง role และความเป็นเจ้าของ resource |
| 4 | ใช้ MD5/SHA ธรรมดา hash password | เร็วเกินไป → เดาได้จำนวนมหาศาลต่อวินาที | ใช้ bcrypt / argon2 / scrypt เท่านั้น |
| 5 | ไม่ใช้ salt หรือใช้ salt ค่าเดียวทั้งระบบ | รหัสเดียวกันได้ hash เหมือนกัน เทียบกับตารางสำเร็จรูปได้ | ใช้ salt สุ่มต่อ user (library จัดการให้) |
| 6 | เขียน algorithm เข้ารหัสเอง | พลาดง่ายมากและมักไม่รู้ตัวจนสาย | **ห้ามเขียน crypto เอง** ใช้ library มาตรฐาน |
| 7 | เก็บ token ใน localStorage โดยไม่คิด | XSS หลุดเข้ามาเมื่อไหร่ token ถูกอ่านทันที | HttpOnly cookie หรือเก็บใน memory + refresh ใน cookie |
| 8 | ใส่ข้อมูลลับใน JWT payload | payload อ่านได้ด้วยใครก็ได้ | ใส่เฉพาะ id, exp, role พื้นฐาน |
| 9 | ไม่เช็ควันหมดอายุ / ไม่ตรวจ signature ให้ถูก algorithm | token ปลอมหรือหมดอายุยังใช้ได้ | ใช้ library verify และกำหนด algorithm ที่ยอมรับอย่างชัดเจน |
| 10 | Access token อายุยาวมาก (เป็นเดือน) | หลุดแล้วเสียหายยาวนาน | access สั้น + refresh rotation |
| 11 | Refresh token ไม่ rotate และ revoke ไม่ได้ | ถูกขโมยแล้วใช้ต่อได้ตลอด | rotation + reuse detection |
| 12 | ตั้ง CORS `*` แล้วคิดว่าปลอดภัยแล้ว | CORS ไม่ใช่ security ของ server และ `*` ใช้กับ credentials ไม่ได้ | ระบุ origin ที่อนุญาตจริง + ทำ authorization ที่ server |
| 13 | คิดว่า CORS กัน attacker ได้ | เครื่องมือที่ไม่ใช่ browser ไม่สนใจ CORS | security ต้องอยู่ที่ auth/authz ของ server |
| 14 | ต่อ string ทำ SQL query | เปิดช่อง injection | parameterized query เสมอ |
| 15 | โยน `req.body` ทั้งก้อนเข้า query/update | mass assignment — user แอบส่ง `role: "admin"` มาได้ | รับเฉพาะ field ที่อนุญาต (allowlist) |
| 16 | ส่ง error/stack trace ดิบกลับไปหา client | เปิดเผยโครงสร้างภายใน | ตอบข้อความกลาง ๆ และ log รายละเอียดฝั่ง server |
| 17 | ตอบ "ไม่มี email นี้ในระบบ" | บอกผู้ไม่หวังดีว่า email ไหนมีอยู่จริง | ข้อความเดียวกันทั้งสองกรณี |
| 18 | ไม่มี rate limit บน login | เปิดช่องให้เดารหัสซ้ำ ๆ | rate limit + backoff + lockout + MFA |
| 19 | รันบน HTTP ใน production | token/cookie/password วิ่งแบบเปิดเผย | HTTPS เสมอ + cookie flag `Secure` |
| 20 | commit `.env` ขึ้น git | secret รั่วถาวร (history ลบยาก) | `.gitignore` + secret manager + **rotate ถ้าเคยหลุด** |
| 21 | ใช้ secret เดียวกันทุก environment | dev หลุด = production พังด้วย | แยก secret ตาม environment |
| 22 | log token/password ลง log | log ถูกส่งต่อและเก็บนานกว่าที่คิด | mask ข้อมูลอ่อนไหวก่อน log เสมอ |
| 23 | คิดว่า HTTPS = ระบบปลอดภัยแล้ว | HTTPS ปกป้องแค่ระหว่างทาง | ยังต้องมี authz, validation, hashing ครบ |
| 24 | validate แค่ frontend | frontend ถูก bypass ได้ | validate ที่ server เสมอ |
| 25 | ไม่ใส่ cookie flag ให้ครบ | เปิดช่อง XSS/CSRF/สนิฟข้อมูล | HttpOnly + Secure + SameSite ครบ |
| 26 | `catch` ข้อผิดพลาดของ auth แล้วปล่อยผ่าน | ระบบมีปัญหา = ประตูเปิด | fail securely — ผิดพลาดต้องปฏิเสธ |
| 27 | ไม่อัปเดต dependency | ช่องโหว่ที่รู้กันแล้วยังเปิดอยู่ | สแกน dependency และอัปเดตเป็นรอบ |
| 28 | คิดว่า "ระบบเราเล็ก ไม่มีใครสนใจ" | การสแกนหาช่องโหว่เป็นแบบอัตโนมัติทั่วอินเทอร์เน็ต | ทำพื้นฐานให้ครบตั้งแต่วันแรก |

---

## 9. Debugging

### 9.1 อาการ: ล็อกอินแล้วแต่ยังโดน 401

```
[1] Client ส่ง credential มาจริงไหม → ดู Network tab
       (cookie ถูกแนบไหม / header Authorization มีไหม)
      ↓
[2] ถ้าเป็น cookie: cookie ถูก set สำเร็จไหม
       - โดน block เพราะไม่มี Secure บน HTTPS?
       - Domain/Path ผิด?
       - SameSite ทำให้ไม่ถูกแนบข้าม site?
      ↓
[3] ถ้าเป็น token: token หมดอายุหรือยัง (ดู exp)
      ↓
[4] Server verify ด้วย key/secret ตัวเดียวกับที่ใช้เซ็นไหม
       (คลาสสิก: dev กับ prod ใช้ secret คนละตัว)
      ↓
[5] Clock ของ server เพี้ยนไหม (exp/iat เพี้ยนตาม)
      ↓
[6] auth middleware ถูกใส่ซ้ำ หรือใส่ผิดลำดับไหม
```

> **ให้มองภาพนี้ว่า** "ไล่จาก 'client ส่งมาไหม' → 'server ได้รับไหม' → 'server อ่านออกไหม' → 'server ยอมรับไหม' ทีละขั้น อย่ากระโดด"

### 9.2 อาการ: 403 ทั้งที่ควรมีสิทธิ์

```
[1] req.user ถูก set จริงไหม (log ดู)
      ↓
[2] role/permission ใน token ตรงกับที่ endpoint ต้องการไหม
      ↓
[3] เพิ่งเปลี่ยน role ใน DB ใช่ไหม → token ใบเก่ายังถือ role เดิมอยู่
      ↓
[4] ติด ownership check หรือเปล่า (resource ไม่ใช่ของ user คนนี้)
      ↓
[5] ชื่อ permission สะกดตรงกันไหม (order:delete vs orders:delete)
```

ข้อ [3] เป็นอาการที่สร้างความสับสนมากที่สุดของ JWT — **แก้ role ใน database แล้วไม่มีผลจนกว่า token จะหมดอายุ**

### 9.3 อาการ: CORS error

```
[1] อ่าน error ให้ครบ — มันบอกว่าขาด header ตัวไหน
      ↓
[2] Origin ของ frontend อยู่ในรายการที่อนุญาตไหม
      ↓
[3] มี preflight (OPTIONS) ไหม → ดูว่า OPTIONS ตอบ 2xx หรือโดน 401
      ↓
[4] ถ้าส่ง cookie: client เปิด credentials + server allow credentials + ไม่ใช้ `*`
      ↓
[5] Custom header ถูกอนุญาตใน preflight ไหม
      ↓
[6] CORS middleware อยู่ "ก่อน" auth middleware ไหม (ดู PART 6)
```

**ข้อควรระวังในการแปลผล:** CORS error ไม่ได้แปลว่า server ปฏิเสธ — server อาจทำงานสำเร็จแล้ว แต่ browser ไม่ให้ JS อ่านผลลัพธ์ ให้ยืนยันด้วยการยิงจาก `curl` ว่าฝั่ง server ตอบอะไรจริง ๆ

### 9.4 อาการ: user หลุด login เป็นระยะ ๆ

```
[1] ใช้ session ใช่ไหม → มีหลาย instance แต่ไม่มี shared store หรือเปล่า
      ↓
[2] Session store restart แล้วข้อมูลหายไหม (in-memory)
      ↓
[3] Token อายุสั้นแต่ไม่มี refresh flow หรือเปล่า
      ↓
[4] Refresh flow ทำงานพร้อมกันหลาย request แล้ว rotate ชนกันไหม
      ↓
[5] Cookie โดนลบเพราะ domain/SameSite เปลี่ยนไหม
```

ข้อ [4] คือกับดักจริงของ refresh rotation: ถ้าหน้าเว็บยิง 5 request พร้อมกันแล้ว access token หมดอายุพอดี ทั้ง 5 จะพยายาม refresh พร้อมกัน แล้วตัวที่มาทีหลังจะเจอ token ที่ถูกใช้ไปแล้ว → ระบบคิดว่าถูกขโมย → เตะผู้ใช้ออก
วิธีแก้เชิงแนวคิด: ให้ฝั่ง client คิวการ refresh ให้เหลือครั้งเดียว และฝั่ง server เผื่อ grace period สั้น ๆ ให้ token ที่เพิ่ง rotate

### 9.5 อาการ: สงสัยว่ามีการเข้าถึงที่ไม่ควรเกิด

```
[1] มี audit log ไหม (ใคร ทำอะไร กับ resource ไหน เมื่อไร)
      ↓
[2] ดู pattern: IP เดิมยิงถี่ผิดปกติไหม / เวลาผิดปกติไหม
      ↓
[3] endpoint ไหนถูกเรียกด้วย id ที่ไล่เรียงกัน (สัญญาณของการไล่ดูข้อมูลคนอื่น)
      ↓
[4] ตรวจว่า endpoint นั้นมี ownership check ครบไหม
      ↓
[5] ถ้าสงสัยว่า credential รั่ว → revoke token ทั้ง family + บังคับเปลี่ยนรหัส + rotate secret
```

### 9.6 Checklist ก่อนขึ้น production

| หมวด | ต้องมี |
|---|---|
| Transport | HTTPS ทุก endpoint, cookie มี `Secure` |
| Password | bcrypt/argon2/scrypt + salt, ไม่มี password ใน log |
| Token | access สั้น, refresh rotate ได้, revoke ได้ในกรณีจำเป็น |
| Cookie | HttpOnly + Secure + SameSite ครบ |
| Authorization | ทุก endpoint มี authz + ownership check |
| Input | validate ที่ server ทุก endpoint, ใช้ parameterized query |
| Output | ไม่ส่ง stack trace/DB error ออกไป, escape ตอนแสดงผล |
| Abuse | rate limit บน login/refresh/forgot-password |
| Secret | ไม่มีใน git, แยกตาม environment, มีแผน rotation |
| Logging | มี audit log, ไม่ log ข้อมูลอ่อนไหว, มี request ID |
| Dependency | สแกนช่องโหว่และอัปเดตเป็นรอบ |

---

## 10. Interview Questions

### 🟢 Junior

1. Authentication กับ Authorization ต่างกันยังไง ยกตัวอย่าง
2. 401 กับ 403 ต่างกันยังไง ตอบตัวไหนเมื่อไร
3. ทำไมห้ามเก็บ password เป็น plain text
4. Hash กับ Encryption ต่างกันยังไง
5. Salt คืออะไร มีไว้ทำไม
6. Cookie คืออะไร ต่างจาก localStorage ยังไง
7. HTTPS ให้อะไรกับเราบ้าง
8. JWT ประกอบด้วยอะไรบ้าง และข้อมูลใน payload เป็นความลับไหม
9. CORS คืออะไร ทำไมถึงเจอ error นี้
10. อธิบาย login flow ตั้งแต่ user กรอกรหัสจนเรียก API ที่ต้องล็อกอินได้

### 🟡 Mid

11. Session กับ JWT ต่างกันยังไง เลือกใช้ตัวไหนเมื่อไร
12. ทำไมต้องมี refresh token ในเมื่อมี access token อยู่แล้ว
13. JWT revoke ไม่ได้ ถ้า user กด logout จะทำยังไง
14. เก็บ token ที่ไหนดีระหว่าง localStorage กับ HttpOnly cookie ข้อแลกเปลี่ยนคืออะไร
15. XSS กับ CSRF ต่างกันยังไง ป้องกันคนละแบบยังไง
16. HttpOnly, Secure, SameSite แต่ละตัวป้องกันอะไร
17. SQL Injection เกิดจากอะไรในเชิงหลักการ และป้องกันยังไงให้ถูกวิธี
18. RBAC คืออะไร ออกแบบ role/permission ยังไงไม่ให้บานปลาย
19. CORS เป็น security ของ server หรือไม่ เพราะอะไร
20. ทำไม rate limiting ถึงสำคัญกับ endpoint login เป็นพิเศษ
21. OAuth2 คืออะไร ต่างจาก OIDC ยังไง "Login with Google" ใช้อันไหน
22. ทำไมข้อความ error ตอน login ควรเป็นข้อความกลาง ๆ
23. secret ควรเก็บที่ไหน ถ้าเผลอ commit ขึ้น git แล้วต้องทำอะไรบ้าง

### 🔴 Senior

24. ออกแบบระบบ authentication สำหรับ web + mobile + partner API จะเลือกอะไรและเพราะอะไร
25. ระบบ microservices 10 ตัว จะทำ authentication/authorization ยังไงไม่ให้ทุกตัวต้องคุย DB เดียวกัน
26. Refresh token rotation ทำงานยังไง และจะจัดการปัญหา race condition ตอน client ยิงหลาย request พร้อมกันยังไง
27. ถ้าสงสัยว่า token ถูกขโมย จะออกแบบ incident response ยังไง
28. ออกแบบ permission model ให้รองรับทั้ง role และเงื่อนไขแบบ "เจ้าของข้อมูลเท่านั้น" ยังไง
29. ระบบเดิมใช้ hash password ด้วยวิธีที่ไม่ปลอดภัย จะย้ายไป bcrypt/argon2 ยังไงโดยไม่บังคับ user ทุกคนเปลี่ยนรหัสพร้อมกัน
30. จะทำ audit log ที่ใช้สืบสวนได้จริงยังไง และต้องระวังอะไรเรื่องข้อมูลส่วนบุคคล
31. อธิบายว่าทำไม "ปลอดภัย" ไม่ใช่สถานะ แต่เป็นชุดของชั้นป้องกัน — ยกตัวอย่างระบบที่คุณเคยออกแบบ
32. Zero Trust หมายความว่าอะไรในทางปฏิบัติสำหรับ service-to-service communication
33. จะจัดการ secret rotation โดยไม่ทำให้ service ล่มยังไง

---

## 11. Answer Like a Developer

### โครงการตอบคำถาม security ทุกข้อ

```
[1] นิยามสั้น 1 ประโยค
      ↓
[2] บอกว่ามันป้องกัน "อะไร" และ "จากใคร"
      ↓
[3] อธิบายกลไกสั้น ๆ ว่าทำไมถึงกันได้
      ↓
[4] บอกว่ามันไม่ได้กันอะไร (ขอบเขต)
      ↓
[5] บอก trade-off / สิ่งที่ต้องทำคู่กัน
```

> **ให้มองภาพนี้ว่า** "คำตอบ security ที่ดีต้องบอกทั้งสิ่งที่มันกันได้และสิ่งที่มันกันไม่ได้ — คนที่พูดแต่ข้อดีคือคนที่ยังไม่เคยเจอของจริง"

### ตัวอย่าง — "Session กับ JWT เลือกอะไร"

**❌ คำตอบที่อ่อน:** "ผมใช้ JWT ครับ เพราะมัน modern และ stateless"

**✅ คำตอบที่ดี:**

1. **นิยาม** — "Session คือ server เก็บ state ไว้เอง แล้ว client ถือแค่ ID ส่วน JWT คือ client ถือข้อมูลที่เซ็นแล้วไปเอง server ไม่ต้องจำ"
2. **แก้ปัญหาอะไร** — "JWT แก้ปัญหาที่ทุก service ต้องไปถาม session store เดียวกัน ซึ่งกลายเป็น bottleneck เมื่อมีหลาย service"
3. **กลไก** — "JWT ตรวจด้วย signature ทำให้ verify ได้โดยไม่ต้องคุย database"
4. **ขอบเขต** — "แลกมาด้วยการ revoke ที่ยาก เพราะ server ไม่ได้จำว่าออกใบไหนไป การเปลี่ยน role ก็ไม่มีผลทันที"
5. **trade-off + การตัดสินใจ** — "ถ้าเป็น web app เดียวที่ต้อง logout แล้วมีผลทันที ผมเลือก session ถ้าเป็นหลาย service หรือ mobile ผมเลือก JWT พร้อม access token อายุสั้นและ refresh rotation และผมจะพูดตรง ๆ ว่าพอเพิ่ม refresh store เข้าไป มันก็ไม่ได้ stateless เต็มร้อยแล้ว"

ข้อ 5 คือสิ่งที่ทำให้ interviewer รู้ว่าคุณเคยทำจริง

### ตัวอย่าง — "CORS คืออะไร"

**❌ อย่าตอบ:** "CORS คือ security ที่กันคนอื่นเรียก API เรา"

**✅ ตอบ:** "CORS คือกฎที่ browser บังคับใช้ เพื่อไม่ให้หน้าเว็บจาก origin หนึ่งอ่านผลลัพธ์จาก origin อื่นโดยที่ origin นั้นไม่ได้อนุญาต มันเป็นการปกป้องผู้ใช้ ไม่ใช่การปกป้อง server — เพราะเครื่องมือที่ไม่ใช่ browser ไม่สนใจ CORS เลย ดังนั้น authorization จริงต้องอยู่ที่ server เสมอ"

ประโยคปิดนี้คือสิ่งที่แยกคนที่เข้าใจจริงออกจากคนที่ท่องมา

### ตัวอย่าง — "เก็บ token ที่ไหน"

**✅ ตอบ:** "ไม่มีที่ที่ปลอดภัยสมบูรณ์ มีแต่การเลือกว่าจะรับความเสี่ยงด้านไหน — localStorage เสี่ยง XSS เพราะ JavaScript อ่านได้ ส่วน cookie เสี่ยง CSRF เพราะ browser แนบให้อัตโนมัติ ผมเลือก HttpOnly cookie เป็นหลักแล้วจัดการ CSRF ด้วย SameSite และ CSRF token เพราะ XSS มีผลกระทบกว้างกว่ามาก — ถ้ามี XSS เขาไม่ได้แค่ขโมย token แต่ทำอะไรก็ได้ในนามผู้ใช้"

### ประโยคที่ควรและไม่ควรพูด

| ❌ อย่าพูด | ✅ พูดแบบนี้แทน |
|---|---|
| "ระบบผมปลอดภัยแล้ว" | "ระบบผมมีการป้องกันหลายชั้น ชั้นที่ผมกังวลที่สุดคือ..." |
| "JWT ปลอดภัยกว่า session" | "JWT เหมาะกว่าเมื่อ... แต่ session เหมาะกว่าเมื่อ..." |
| "ผมเขียนฟังก์ชันเข้ารหัสเอง" | "ผมใช้ library มาตรฐานเพราะ crypto เป็นเรื่องที่พลาดแล้วไม่รู้ตัว" |
| "validate ที่ frontend พอ" | "validate สองฝั่ง — frontend เพื่อ UX, backend เพราะ frontend ถูก bypass ได้" |
| "CORS กัน hacker" | "CORS เป็นกฎของ browser ไม่ใช่ authorization" |
| "เราเป็นระบบเล็ก คงไม่มีใครมาแฮก" | "การสแกนช่องโหว่ทำแบบอัตโนมัติทั่วอินเทอร์เน็ต ขนาดระบบไม่ใช่เกราะ" |

---

## 12. One-Minute Review

- **Authentication = คุณคือใคร (401) / Authorization = คุณทำอะไรได้ (403)** — สลับลำดับไม่ได้
- Login flow: **User → Login → Rate limit → Validate → หา user → Verify password (hash) → ออก Token/Session → Client เก็บ → Authenticated Request**
- **Password ต้อง hash ด้วย bcrypt / argon2 / scrypt + salt เท่านั้น** ห้าม MD5/SHA ธรรมดา ห้ามเขียน crypto เอง
- Hash = ย้อนกลับไม่ได้ (password) / Encryption = ย้อนได้ (ข้อมูลที่ต้องอ่านกลับ) / **Base64 = ไม่ใช่ security**
- **Session** = server จำ → revoke ทันทีได้ แต่ต้องมี shared store
  **JWT** = server ไม่จำ → scale ง่าย แต่ **revoke ยาก** และเปลี่ยน role ไม่มีผลทันที
- แก้ปัญหา revoke JWT: access token อายุสั้น + **refresh token rotation + reuse detection** (หรือ denylist ซึ่งทำให้ stateful)
- **JWT payload อ่านได้โดยใครก็ตาม** — ห้ามใส่ข้อมูลลับ signature กันการแก้ ไม่ได้กันการอ่าน
- เก็บ token: **HttpOnly cookie** (กัน XSS ต้องจัดการ CSRF) vs **localStorage** (ไม่เสี่ยง CSRF แต่ XSS อ่านได้ทันที) — รูปแบบที่แข็งแรง: refresh ใน HttpOnly cookie + access ในหน่วยความจำ
- Cookie flags: **HttpOnly** (JS อ่านไม่ได้) + **Secure** (เฉพาะ HTTPS) + **SameSite** (กัน CSRF)
- **XSS = code แปลกปลอมรันในเว็บเรา** → แก้ที่ output encoding + CSP
  **CSRF = request แปลกปลอมจากเว็บอื่นยืม cookie** → แก้ที่ SameSite + CSRF token
- **Injection ทุกชนิดเกิดจากการปน input เข้ากับคำสั่ง** → แก้ด้วย parameterized query + บังคับ type + allowlist
- **CORS เป็นกฎของ browser ไม่ใช่ security ของ server** — authorization จริงอยู่ที่ server เสมอ
- **HTTPS ปกป้องแค่ระหว่างทาง** ไม่ได้ทำให้ code ปลอดภัย
- RBAC ต้องมาคู่กับ **ownership check** — ไม่งั้น user เปลี่ยนเลขใน URL แล้วดูข้อมูลคนอื่นได้
- **Rate limit บน login/refresh/forgot-password เสมอ** + backoff + MFA
- **Secret ห้ามอยู่ใน git** ถ้าเคยขึ้นแล้วถือว่ารั่ว = ต้อง rotate ไม่ใช่แค่ลบ commit
- Validate ที่ server เสมอ — frontend validation คือ UX ไม่ใช่ security
- **Fail securely** — ระบบพังต้องพังไปทางปฏิเสธ ไม่ใช่ทางอนุญาต

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **AuthN = คุณคือใคร (401) / AuthZ = คุณทำอะไรได้ (403)** — โรงแรม: บัตรประชาชน vs คีย์การ์ด
2. **Session = server จำคุณ (revoke ง่าย) / JWT = server เชื่อลายเซ็นบนบัตรคุณ (scale ง่าย แต่ revoke ยาก)** — แก้ด้วย access สั้น + refresh rotation
3. **Password = hash ด้วย bcrypt/argon2/scrypt + salt เท่านั้น** ห้าม MD5/SHA ธรรมดา ห้ามเขียน crypto เอง
4. **XSS = ผู้ร้ายเข้ามาอยู่ในบ้าน (แก้ที่ output encoding) / CSRF = ผู้ร้ายปลอมลายเซ็นจากนอกบ้าน (แก้ที่ SameSite + CSRF token)**
5. **CORS คือกฎของ browser ไม่ใช่ security ของ server** — ของจริงต้องตรวจสิทธิ์ที่ server และตรวจความเป็นเจ้าของข้อมูลด้วยเสมอ

### Keyword สั้น

**Authentication** → คุณคือใคร → 401
**Authorization** → คุณทำอะไรได้ → 403
**Session** → server จำ, revoke ทันที, ต้องมี shared store
**JWT** → client ถือบัตรเซ็นแล้ว, stateless, revoke ยาก
**Access Token** → บัตรอายุสั้น ใช้ทุก request
**Refresh Token** → บัตรอายุยาว ใช้ขอบัตรใหม่ ต้อง rotate
**Rotation** → ใช้ครั้งเดียว ใช้ซ้ำ = สงสัยถูกขโมย = ยกเลิกทั้งชุด
**OAuth2** → มอบสิทธิ์เข้าถึงแทนการให้ password
**OIDC** → OAuth2 + บอกว่าคุณเป็นใคร
**SSO** → ล็อกอินครั้งเดียวใช้หลายระบบ (IdP เป็น single point of failure)
**RBAC** → สิทธิ์ตามตำแหน่ง + ต้องมี ownership check ด้วย
**Hashing** → ทางเดียว ใช้กับ password
**Salt** → ค่าสุ่มต่อ user กัน hash ซ้ำ
**Encryption** → ย้อนได้ ใช้กับข้อมูลที่ต้องอ่านกลับ
**Base64** → ไม่ใช่ security
**HTTPS/TLS** → ปกป้องระหว่างทาง ไม่ได้ปกป้อง code
**CORS** → กฎของ browser ไม่ใช่กำแพงของ server
**XSS** → script แปลกปลอมในเว็บเรา → output encoding + CSP
**CSRF** → request ปลอมจากเว็บอื่น → SameSite + CSRF token
**SQL/NoSQL Injection** → input ปนกับคำสั่ง → parameterized query + บังคับ type
**Rate Limiting** → จำกัดจำนวนครั้ง กัน brute force
**HttpOnly** → JavaScript อ่าน cookie ไม่ได้
**Secure** → cookie ส่งเฉพาะ HTTPS
**SameSite** → ไม่แนบ cookie ข้ามเว็บ
**Secret Management** → ไม่อยู่ใน git, แยกตาม env, rotate เมื่อรั่ว
**Least Privilege** → ให้สิทธิ์เท่าที่จำเป็น
**Defense in Depth** → ด่านหนึ่งพัง ต้องมีด่านต่อไป
**Fail Securely** → พังแล้วต้องปฏิเสธ ไม่ใช่อนุญาต

### Flow ที่ต้องวาดได้จากความจำ

```
[USER]
   ↓ email + password (ผ่าน HTTPS)
[LOGIN]
   ↓
[SERVER]
   ↓ rate limit → validate → หา user
[VERIFY PASSWORD]   เทียบกับ hash (bcrypt/argon2 + salt)
   ↓ ผ่าน
[TOKEN / SESSION]   access สั้น + refresh ยาว  หรือ  session ใน store
   ↓
[CLIENT]            เก็บใน HttpOnly + Secure + SameSite cookie
   ↓
[AUTHENTICATED REQUEST]
   ↓
[AUTHENTICATION]  → คุณคือใคร   → ไม่ผ่าน = 401
   ↓
[AUTHORIZATION]   → คุณทำได้ไหม  → ไม่ผ่าน = 403
   ↓  (role + permission + ownership)
[BUSINESS LOGIC]
```

> **ให้มองภาพนี้ว่า** "เราแลกรหัสผ่านถาวรเป็นบัตรผ่านชั่วคราวเพียงครั้งเดียว แล้วหลังจากนั้นทุก request ต้องผ่านสองด่านเสมอ: ด่านที่ถามว่าคุณเป็นใคร และด่านที่ถามว่าคนแบบคุณทำสิ่งนี้ได้หรือเปล่า"

---

[← สารบัญ](./00-README-TOC.md)
