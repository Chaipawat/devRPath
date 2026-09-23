# PART 10 — SPRING / SPRING BOOT

> ตำแหน่งในภาพใหญ่: Backend Layer — framework ฝั่ง Java ที่รับ request ต่อจาก Frontend แล้วคุยกับ Database

---

## 1. Big Picture

ถ้า **Java** (PART 9) คือ "ภาษา" Spring คือ **"ชุดเครื่องมือและกฎการประกอบร่างโปรแกรม"** ที่ทำให้เราเขียน backend ขนาดใหญ่ได้โดยไม่ต้องต่อสายไฟเองทุกเส้น

ลองนึกภาพว่าคุณต้องเขียน backend ด้วย Java เปล่า ๆ คุณจะต้องเขียนเองทั้งหมดนี้:

- เปิด socket รับ HTTP
- แปลง JSON → Object
- เปิด/ปิด connection ไปหา database
- เริ่ม/commit/rollback transaction
- ตรวจ token ว่า user คนนี้เป็นใคร มีสิทธิ์อะไร
- สร้าง object แต่ละตัวแล้วส่งให้กันเอง (`new` กันเป็นทอด ๆ)

Spring เข้ามาบอกว่า **"เรื่องพวกนี้ผมจัดการให้ คุณเขียนแค่ business logic พอ"**

แล้ว **Spring Boot** คืออะไร? Spring แบบเดิม (ราว ๆ ปี 2005–2013) ทรงพลังมาก แต่ **config ยาวมาก** ต้องเขียน XML เป็นร้อยบรรทัดกว่าจะรันได้ Spring Boot คือชั้นที่ครอบ Spring อีกที ด้วยปรัชญาว่า

> "ถ้าคุณไม่บอกอะไรเป็นพิเศษ ผมจะเดา config ที่คนส่วนใหญ่ใช้ให้เลย และถ้าคุณอยากเปลี่ยน ค่อยมาเขียนทับ"

เรียกปรัชญานี้ว่า **Convention over Configuration** → "ใช้ค่ามาตรฐานก่อน ปรับทีหลัง"

**สรุปด้วยประโยคเดียวสำหรับตอบสัมภาษณ์:**

> "Spring คือ framework ที่จัดการวงจรชีวิตของ object และ infrastructure ให้เรา (IoC/DI) ส่วน Spring Boot คือ Spring ที่มี auto-configuration + embedded server + starter dependency ทำให้เริ่มโปรเจกต์ได้เร็วโดยแทบไม่ต้อง config"

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Spring Framework** | กล่องเครื่องมือ | ชุด library หลักของ Java enterprise — แกนคือ IoC Container |
| **Spring Boot** | Spring ที่ประกอบมาให้แล้ว | ครอบ Spring ด้วย auto-config + embedded server เพื่อเริ่มงานเร็ว |
| **IoC (Inversion of Control)** | กลับด้านการควบคุม | เราไม่ `new` object เอง ให้ container สร้างและส่งให้ |
| **DI (Dependency Injection)** | ส่งของที่ต้องใช้มาให้ | วิธี "ทำ IoC" จริง — ฉีด dependency เข้า constructor/field |
| **IoC Container** | โกดังเก็บ object | ที่เก็บและจ่าย Bean ทั้งหมดของ app |
| **Bean** | object ที่ Spring ดูแล | object ที่ถูกสร้าง จัดการวงจรชีวิต และฉีดให้คนอื่นโดย Spring |
| **@Component** | "นี่คือ Bean" | บอก Spring ให้สแกนเจอแล้วสร้างเป็น Bean |
| **@Controller / @RestController** | ประตูหน้าบ้าน | รับ HTTP request แปลงเป็นการเรียก method |
| **@Service** | สมองธุรกิจ | ที่อยู่ของ business logic |
| **@Repository** | คนคุยกับ DB | ชั้นเข้าถึงข้อมูล |
| **@Configuration / @Bean** | ประกาศ Bean ด้วยมือ | สำหรับ object ที่เราสร้างเองไม่ได้มาจาก scan |
| **Entity** | หน้าตาแถวใน DB | class ที่ map 1:1 กับ table |
| **DTO (Data Transfer Object)** | หน้าตาข้อมูลที่ส่งออก/รับเข้า | ตัวกลางระหว่างโลกภายนอกกับโลกภายใน |
| **ORM (Object-Relational Mapping)** | แปลง object ↔ table | แนวคิดการ map class กับ relational DB |
| **JPA** | ข้อตกลง/สเปก | Java Persistence API — เป็น **specification** ไม่ใช่ implementation |
| **Hibernate** | คนทำงานจริงตาม JPA | implementation ของ JPA ที่ Spring Boot ใช้เป็น default |
| **Spring Data JPA** | ผู้ช่วยเขียน query | สร้าง implementation ของ Repository ให้อัตโนมัติจากชื่อ method |
| **Spring Security** | ยามหน้าประตู | จัดการ Authentication + Authorization ผ่าน filter chain |
| **Authentication** | คุณเป็นใคร | พิสูจน์ตัวตน |
| **Authorization** | คุณทำอะไรได้ | ตรวจสิทธิ์ |
| **Auto Configuration** | เดา config ให้ | ดูว่ามี library อะไรใน classpath แล้วตั้งค่าให้อัตโนมัติ |
| **Starter** | ชุดของที่ขายรวม | dependency ก้อนเดียวที่ลากของที่เกี่ยวข้องมาครบ เช่น `spring-boot-starter-web` |
| **application.yml / properties** | ไฟล์ตั้งค่า | เก็บ config ภายนอก code |
| **Profile** | สลับชุด config | dev / staging / prod ใช้ค่าคนละชุด |
| **Actuator** | เครื่องวัดสุขภาพ | endpoint สำเร็จรูป เช่น health, metrics, info |
| **@Transactional** | เปิด-ปิด transaction ให้ | ครอบ method ด้วย transaction ผ่าน proxy |
| **Proxy** | ตัวแทนที่ห่ออีกชั้น | object ที่ Spring สร้างครอบ Bean เพื่อแทรกพฤติกรรมพิเศษ |
| **N+1 Query** | ยิง query เกินจำเป็น | ปัญหาคลาสสิกของ ORM เวลาโหลดความสัมพันธ์ |
| **Embedded Server** | เซิร์ฟเวอร์ติดมาในตัว | Tomcat ฝังมาใน jar — รันด้วย `java -jar` ได้เลย |

---

## 3. Mental Model

มองเรื่องนี้ในหัวเป็น **3 ชั้นซ้อนกัน**:

```
[ Spring Boot ]   ← ชั้นอำนวยความสะดวก (auto-config, starter, embedded server)
       ↓
[ Spring Framework ]  ← ชั้นแกนกลาง (IoC Container, DI, AOP, Transaction)
       ↓
[ Java / JVM ]    ← ชั้นภาษาและ runtime
```

> **ให้มองภาพนี้ว่า** "Spring Boot ไม่ได้มาแทน Spring มันคือ Spring ที่มีคนประกอบและตั้งค่าเริ่มต้นไว้ให้แล้ว"

**หลักคิดที่ต้องติดหัว 3 ข้อ:**

1. **โปรแกรม Spring ไม่ได้เริ่มจาก `main` แล้ว `new` ไล่ลงไป** — มันเริ่มจาก container สแกนหา Bean ทั้งหมด สร้างให้ครบ ต่อสายให้เสร็จ *ก่อน* จะรับ request แรก
2. **โค้ดของเราคือ "ช่องว่าง" ที่เสียบเข้าไปในโครงของ framework** ไม่ใช่โครงที่เรียก framework (นี่คือความหมายจริงของคำว่า Inversion)
3. **หลายอย่างที่ดู "มหัศจรรย์" จริง ๆ คือ proxy** — `@Transactional`, `@Cacheable`, security check ทั้งหมดทำงานเพราะ Spring ห่อ Bean ของเราไว้อีกชั้น (เก็บไว้ใช้ตอบข้อ 8 Common Mistakes)

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำที่ 1 — IoC / DI = ร้านอาหาร

เขียน Java เปล่า ๆ  = เชฟต้องไปตลาดซื้อของเอง ทุกครั้ง ทุกวัตถุดิบ
Spring (IoC/DI)     = มีฝ่ายจัดซื้อเตรียมของวางไว้ให้ เชฟแค่ "บอกว่าต้องใช้อะไร"

เชฟ (Service) ไม่รู้ว่าของมาจากไหน รู้แค่ว่า "ของที่ขอ อยู่ในมือแล้ว"
```

จุดสำคัญของภาพนี้: เชฟ (Service) **ไม่ผูกกับร้านค้าเจ้าใดเจ้าหนึ่ง** → วันหน้าเปลี่ยน supplier (เปลี่ยน implementation ของ Repository / เปลี่ยนเป็น mock ตอนเขียน test) ก็ไม่ต้องแก้โค้ดเชฟ นี่คือ **"ประโยชน์จริง" ของ DI ที่ต้องพูดในห้องสัมภาษณ์** ไม่ใช่แค่ "ไม่ต้อง new"

```
🧠 ภาพจำที่ 2 — Bean = ของในโกดังบริษัท

Bean       = ของที่บริษัทซื้อมาแล้ว ติดสติกเกอร์ เก็บในโกดัง
Container  = โกดัง + คนเบิกของ
@Component = สติกเกอร์ที่แปะว่า "ชิ้นนี้เก็บเข้าโกดังนะ"

พนักงาน (class) ไม่ต้องซื้อของเอง → เขียนใบเบิก (constructor parameter) แล้วของมาเอง
```

```
🧠 ภาพจำที่ 3 — Spring Boot = ชุดโต๊ะสำเร็จรูป vs ไม้กับตะปู

Spring แบบเดิม = ได้ไม้ ตะปู ค้อน แล้วประกอบโต๊ะเอง (ยืดหยุ่นสุด แต่ช้า)
Spring Boot     = ได้โต๊ะประกอบเสร็จ 90% เหลือขันน็อตนิดหน่อย
                  (อยากเปลี่ยนขาโต๊ะก็ยังถอดเปลี่ยนได้)
```

```
🧠 ภาพจำที่ 4 — Entity vs DTO = พนักงานจริง vs นามบัตร

Entity = แฟ้มประวัติพนักงานฉบับเต็ม (มีเงินเดือน เลขบัตรประชาชน)
DTO    = นามบัตร (ชื่อ ตำแหน่ง เบอร์ — เท่าที่ให้คนนอกเห็นได้)

ส่งแฟ้มเต็มให้ลูกค้า = ข้อมูลหลุด
```

```
🧠 ภาพจำที่ 5 — @Transactional = ประตูอัตโนมัติที่มีเซนเซอร์อยู่ "ข้างนอก" ห้อง

คนเดินจากข้างนอกเข้ามา → เซนเซอร์จับได้ → ประตูเปิด (เริ่ม transaction)
แต่ถ้าคุณอยู่ "ในห้องอยู่แล้ว" แล้วเดินไปอีกมุมห้อง → เซนเซอร์ไม่จับ (self-invocation ไม่ทำงาน)
```

---

## 5. How It Works

### 5.1 Flow หลัก: Request → Database → Response

```
[CLIENT]  (Browser / Mobile / Postman)
   ↓ HTTP Request  POST /api/orders  { ... JSON ... }
[EMBEDDED TOMCAT]                    รับ socket, parse HTTP
   ↓
[SPRING SECURITY FILTER CHAIN]       ใครมา? มีสิทธิ์ไหม? (401/403 จบที่นี่)
   ↓
[DISPATCHER SERVLET]                 ประตูกลาง หา handler ที่ตรง URL
   ↓
[HANDLER MAPPING]                    /api/orders + POST → OrderController.create()
   ↓
[ARGUMENT RESOLVER]                  JSON → DTO (Jackson) + @Valid ตรวจ input
   ↓
[@RestController]                    OrderController — รับ/ตอบ ไม่คิดเอง
   ↓
[@Service]                           OrderService — business logic + @Transactional
   ↓
[@Repository]                        OrderRepository (Spring Data JPA)
   ↓
[JPA / HIBERNATE]                    แปลง method/Entity → SQL, จัดการ cache ระดับ session
   ↓
[CONNECTION POOL]                    HikariCP ยืม connection จาก pool
   ↓
[DATABASE]                           PostgreSQL / MySQL
   ↑
   ↑ ResultSet → Entity → (map) → DTO → JSON
[CLIENT]  201 Created
```

> **ให้มองภาพนี้ว่า** "หนึ่ง request คือการเดินผ่านด่านเป็นทอด ๆ โดยแต่ละด่านมีหน้าที่เดียว และถ้า request พังเราต้องรู้ว่ามันตายที่ด่านไหน"

### 5.2 Flow ตอน Boot (ทำไม app ถึง "รู้จัก" ทุกอย่าง)

```
java -jar app.jar
   ↓
[main() → SpringApplication.run()]
   ↓
[COMPONENT SCAN]        ไล่หา @Component/@Service/@Repository/@Controller ใน package
   ↓
[AUTO CONFIGURATION]    เห็น spring-boot-starter-web ใน classpath → ตั้ง Tomcat + Jackson
                        เห็น driver ของ PostgreSQL + spring-data-jpa → ตั้ง DataSource + EntityManager
   ↓
[CREATE BEANS]          สร้าง Bean ทั้งหมด เรียงตามลำดับ dependency
   ↓
[INJECT DEPENDENCIES]   ต่อสาย: Controller ← Service ← Repository
   ↓
[WRAP WITH PROXY]       Bean ที่มี @Transactional/@Cacheable/@PreAuthorize ถูกห่อด้วย proxy
   ↓
[START EMBEDDED TOMCAT] เปิด port 8080 พร้อมรับ request
```

> **ให้มองภาพนี้ว่า** "Spring Boot ใช้เวลาตอนเริ่มโปรแกรมประกอบร่างทุกอย่างให้เสร็จก่อน เพื่อที่ตอนรับ request จริงจะได้ไม่ต้องคิดอะไรอีก"

### 5.3 IoC / DI — ก่อนและหลัง

```
ไม่มี DI:
[Controller] --new--> [Service] --new--> [Repository] --new--> [DataSource]
  ทุกคน "รู้จักวิธีสร้าง" คนถัดไป → ผูกกันแน่น เปลี่ยนยาก test ยาก

มี DI:
                    [ IoC CONTAINER ]
                     /      |      \
                 สร้าง    สร้าง    สร้าง
                   ↓        ↓        ↓
            [Repository] [Service] [Controller]
                   └──ฉีด──┘   └──ฉีด──┘
  ทุกคน "รู้แค่ว่าต้องใช้อะไร" ไม่รู้ว่าใครสร้าง → ผูกกันหลวม สลับ/mock ได้
```

> **ให้มองภาพนี้ว่า** "DI คือการย้ายหน้าที่ 'สร้างของ' ออกจากคนที่ 'ใช้ของ' เพื่อให้คนใช้ของเปลี่ยนของได้โดยไม่ต้องแก้ตัวเอง"

Pseudocode สั้น ๆ (constructor injection — แบบที่แนะนำ):

```
@Service
class OrderService {
  private final OrderRepository repo;          // final = บังคับว่าต้องมี
  OrderService(OrderRepository repo) { ... }   // Spring ฉีดให้ตอนสร้าง
}
```

อธิบาย: `OrderService` **ไม่เคยเขียนคำว่า `new OrderRepository()`** เลย มันแค่ประกาศว่า "ฉันทำงานไม่ได้ถ้าไม่มีสิ่งนี้" ตอน test เราจึงยัด mock repository เข้าไปแทนได้ทันที

### 5.4 Spring Security Filter Chain

```
Request
   ↓
[ CORS Filter ]
   ↓
[ CSRF Filter ]            (มักปิดเมื่อเป็น stateless REST API + JWT)
   ↓
[ Authentication Filter ]  อ่าน JWT / Session → สร้าง Authentication object
   ↓
[ SecurityContextHolder ]  เก็บ "ใครคือคนนี้" ไว้ให้ชั้นล่างใช้ได้ตลอด request
   ↓
[ Authorization Filter ]   role/permission พอไหม → ไม่พอ = 403
   ↓
[ DispatcherServlet → Controller ]
```

> **ให้มองภาพนี้ว่า** "Security ของ Spring คือยามหลายคนยืนเรียงหน้าประตู ตรวจทีละเรื่อง ถ้าไม่ผ่านด่านไหน request ก็ไม่มีวันไปถึง Controller เลย"

**จุดที่มือใหม่สับสนบ่อยและเป็นคำถามสัมภาษณ์:**

- **401 Unauthorized** = "ไม่รู้ว่าคุณเป็นใคร" (ไม่มี token / token หมดอายุ) → ปัญหา **Authentication**
- **403 Forbidden** = "รู้ว่าคุณเป็นใคร แต่คุณไม่มีสิทธิ์" → ปัญหา **Authorization**

### 5.5 JPA / Hibernate / ORM — ใครเป็นใคร

```
[ โค้ดเรา ]  userRepository.findByEmail("a@b.com")
     ↓
[ Spring Data JPA ]  อ่านชื่อ method → สร้าง implementation ให้อัตโนมัติ
     ↓
[ JPA ]              specification — นิยาม EntityManager, @Entity, JPQL (ไม่ทำงานเอง)
     ↓
[ Hibernate ]        implementation จริง — แปลงเป็น SQL, จัดการ Persistence Context
     ↓
[ JDBC ]             มาตรฐานการคุย DB ของ Java
     ↓
[ DATABASE ]         SELECT * FROM users WHERE email = ?
```

> **ให้มองภาพนี้ว่า** "JPA คือกฎหมาย Hibernate คือตำรวจที่บังคับใช้กฎหมายนั้น และ Spring Data JPA คือเลขาที่เขียนเอกสารให้เราอัตโนมัติ"

**Persistence Context** → "พื้นที่จำของ Hibernate ภายใน transaction หนึ่ง ๆ" — Entity ที่โหลดมาแล้วถูกจำไว้ ถ้าคุณแก้ค่าใน field ของมัน Hibernate จะ **ออก UPDATE ให้เองตอนจบ transaction** โดยที่คุณไม่ต้องสั่ง save (เรียกว่า **dirty checking**) เรื่องนี้ทั้งมีประโยชน์และเป็นกับดัก — เพราะบางคน "แก้ Entity เล่น ๆ" แล้วข้อมูลเปลี่ยนจริงใน DB

---

## 6. Example — Scenario จากงานจริง

### Scenario A: "สร้างคำสั่งซื้อพร้อมตัดสต็อก"

โจทย์: `POST /api/orders` ต้อง (1) เช็คสต็อก (2) ตัดสต็อก (3) บันทึก order (4) ส่ง event แจ้งเตือน

โครงที่ Senior จะวาง:

| ชั้น | ทำอะไร | ไม่ทำอะไร |
|---|---|---|
| `OrderController` | รับ `CreateOrderRequest` (DTO), `@Valid`, คืน `OrderResponse` | ไม่แตะ Repository, ไม่มี if ธุรกิจ |
| `OrderService` | ตรวจสต็อก → ตัดสต็อก → สร้าง order (ครอบด้วย `@Transactional`) | ไม่รู้จักเรื่อง HTTP, ไม่รู้จัก status code |
| `OrderRepository` | `save()`, `findById()` | ไม่มี business rule |
| `Entity Order/Product` | map กับ table | ไม่ถูกส่งออกไปหา client ตรง ๆ |

**จุดตัดสินใจที่สัมภาษณ์ชอบถาม:** "ส่งอีเมล/แจ้งเตือน ควรอยู่ใน `@Transactional` ไหม?"
คำตอบระดับ mid/senior: **ไม่ควร** เพราะถ้าส่งอีเมลสำเร็จแล้ว transaction rollback ทีหลัง อีเมลถอนคืนไม่ได้ → ควรทำ **หลัง commit** (เช่นใช้ event ที่ฟังหลัง transaction สำเร็จ หรือโยนเข้า queue)

### Scenario B: "หน้ารายการ order ช้ามาก"

หน้า `GET /api/orders` โหลด 100 orders แต่ละ order มี `customer` และ `items`
ดู log แล้วพบว่ามี SQL ยิงออกไป **201 ครั้ง** — นี่คือ **N+1 problem**

```
1 query : SELECT * FROM orders                        ← ได้ 100 orders
   ↓ แล้ว Hibernate ต้องไปเอา customer ของแต่ละ order
100 query : SELECT * FROM customers WHERE id = ?       ← ทีละตัว
100 query : SELECT * FROM order_items WHERE order_id=? ← ทีละตัว
```

> **ให้มองภาพนี้ว่า** "ORM ซ่อน SQL ไว้จนดูสวย แต่ถ้าเราไม่บอกว่าจะใช้ข้อมูลลูกด้วย มันจะวิ่งไปหยิบทีละชิ้นเหมือนเดินกลับบ้านเอาของทีละอย่าง 100 รอบ"

**ทางแก้ (ต้องพูดได้อย่างน้อย 2 ทาง):**

| ทางแก้ | หลักการ | ข้อควรระวัง |
|---|---|---|
| `JOIN FETCH` / `@EntityGraph` | ดึงลูกมาพร้อมพ่อใน query เดียว | ถ้า fetch หลาย collection พร้อมกันจะเกิด cartesian product ข้อมูลบวม |
| Batch fetching | รวมการดึงลูกเป็นก้อน (IN clause) แทนทีละตัว | จำนวน query ลดจาก N เหลือ N/batch ไม่ใช่ 1 |
| เขียน query เองแล้ว map เป็น DTO | คุมสิ่งที่ดึงได้ 100% | เสียความสะดวกของ ORM |
| `FetchType.LAZY` เป็นค่าเริ่มต้นเสมอ | ป้องกันการลากข้อมูลมาโดยไม่ตั้งใจ | ต้องระวัง `LazyInitializationException` เมื่อใช้นอก transaction |

### Scenario C: "Deploy ขึ้น prod แล้ว config ต่างจาก dev"

ใช้ **Profile**: `application-dev.yml`, `application-prod.yml` แล้วตอนรันส่ง `SPRING_PROFILES_ACTIVE=prod`
ส่วนของลับ (password, secret key) **ห้ามอยู่ในไฟล์ที่ commit** → ต้องมาจาก environment variable / secret manager
Spring Boot อ่าน config ตามลำดับความสำคัญ: **command line > environment variable > application-{profile}.yml > application.yml** → "ของที่อยู่นอกสุด ชนะของที่อยู่ใน jar" เป็นหลักการที่ควรจำ

### Scenario D: "ทีม DevOps ขอ endpoint เช็คสุขภาพ"

เปิด **Actuator** → ได้ `/actuator/health` (ใช้ทำ Kubernetes liveness/readiness probe), `/actuator/metrics`, `/actuator/info`
คำเตือนระดับ production: **ต้องปิดหรือป้องกัน endpoint ที่อ่อนไหว** เช่น `/actuator/env`, `/actuator/heapdump` เพราะเปิดเผย config และหน่วยความจำ — ข้อนี้คือคำตอบที่ทำให้ดู "คิดเรื่อง production จริง"

---

## 7. Compare

### 7.1 Express vs Spring Boot (ตารางหลักของบทนี้)

| หัวข้อ | Express (Node.js) | Spring Boot (Java) |
|---|---|---|
| ประเภท | Library/minimal framework — ต่อเติมเอง | Full framework — มีมาให้ครบ |
| ภาษา / Typing | JavaScript (dynamic) หรือ TypeScript | Java (static typing, compile-time check) |
| ปรัชญา | "เลือกเอง ประกอบเอง" (unopinionated) | "ทำตามแบบมาตรฐาน" (opinionated) |
| การประกอบ object | `require`/`import` แล้ว new เองหรือใช้ factory | IoC Container + DI อัตโนมัติ |
| โครงสร้างโปรเจกต์ | ไม่บังคับ — แต่ละทีมไม่เหมือนกัน | มี convention ชัด (Controller/Service/Repository) |
| Routing | `app.get('/x', handler)` | `@GetMapping("/x")` บน method |
| ชั้นก่อนถึง handler | Middleware chain | Filter chain + Interceptor + DispatcherServlet |
| Validation | เลือก library เอง (zod, joi, class-validator) | Bean Validation (`@Valid`, `@NotNull`) มาในตัว |
| Database access | Prisma / TypeORM / Sequelize / raw SQL (เลือกเอง) | JPA + Hibernate เป็น default (หรือ JDBC/MyBatis) |
| Transaction | จัดการเอง / ผ่าน ORM API | `@Transactional` ประกาศบน method |
| Concurrency model | Single-thread event loop + non-blocking I/O | Thread pool (หรือ virtual thread ใน Java รุ่นใหม่) |
| จุดแข็งงานประเภท | I/O-bound, real-time, ทีมเล็ก, เริ่มเร็ว | โดเมนซับซ้อน, ทีมใหญ่, องค์กร/ธนาคาร, transaction หนัก |
| จุดอ่อน | โครงหลวม → โปรเจกต์ใหญ่มักเละถ้าไม่มีวินัย | เรียนรู้ยากกว่า, boot ช้ากว่า, กินแรมมากกว่า |
| Startup time / Memory | เริ่มเร็ว กินแรมน้อย | เริ่มช้ากว่า กินแรมมากกว่า (แลกกับ throughput และ tooling) |
| Error handling | central error middleware (`(err,req,res,next)`) | `@ControllerAdvice` + `@ExceptionHandler` |
| Ecosystem ด้าน enterprise | ต้องหาเอง | Security / Batch / Cloud / Data มาจากเจ้าเดียว เข้ากันได้ |

**วิธีตอบเมื่อถูกถาม "อันไหนดีกว่า":** ห้ามตอบลอย ๆ ต้องตอบว่า
> "Express ดีกว่าเมื่อทีมเล็ก โจทย์เป็น I/O-bound และอยากได้ความยืดหยุ่น/เริ่มเร็ว ส่วน Spring Boot ดีกว่าเมื่อโดเมนซับซ้อน ทีมใหญ่ ต้องการ convention ที่ทุกคนเข้าใจตรงกัน และต้องการ transaction/security ที่เป็นมาตรฐาน"

### 7.2 Spring vs Spring Boot

| หัวข้อ | Spring Framework | Spring Boot |
|---|---|---|
| คืออะไร | แกนกลาง: IoC, DI, AOP, Transaction | ชั้นครอบ Spring เพื่อความเร็วในการเริ่มงาน |
| Configuration | ต้องตั้งเองเยอะ (XML หรือ Java Config) | Auto Configuration เดาให้จาก classpath |
| Dependency | ต้องเลือก version เองให้เข้ากัน | Starter คุม version ให้ครบชุด |
| Server | ต้อง deploy เป็น WAR ลง Tomcat ภายนอก | Embedded Tomcat — `java -jar` ได้เลย |
| เหมาะกับ | ระบบเก่า / ต้องการคุมทุกจุด | ระบบใหม่ / microservice / container |
| ความสัมพันธ์ | เป็นฐาน | **ใช้ Spring อยู่ข้างใน** ไม่ได้แทนที่ |

### 7.3 Entity vs DTO

| หัวข้อ | Entity | DTO |
|---|---|---|
| ผูกกับอะไร | โครงสร้าง **table ใน DB** | **สัญญา API (contract)** กับ client |
| เปลี่ยนเมื่อไร | เมื่อ schema DB เปลี่ยน | เมื่อ API ต้องการข้อมูลต่างไป |
| มี annotation | `@Entity`, `@Column`, `@OneToMany` | validation เช่น `@NotBlank` |
| ส่งออกไปหา client | **ไม่ควร** | ใช่ |
| ความเสี่ยงถ้าใช้ผิด | หลุด field ลับ (password hash), เกิด lazy loading ตอน serialize, แก้ DB แล้ว API พังทันที | แทบไม่มี — แลกกับต้องเขียน mapping เพิ่ม |

**ประโยคเด็ดสำหรับสัมภาษณ์:** "การส่ง Entity ออกไปตรง ๆ คือการผูก schema ของ database เข้ากับ public API ของเรา วันที่ rename column เดียว client ทุกเจ้าพังพร้อมกัน"

### 7.4 JPA vs Hibernate vs Spring Data JPA

| | JPA | Hibernate | Spring Data JPA |
|---|---|---|---|
| คืออะไร | Specification (interface) | Implementation | ชั้นช่วยเหนือ JPA |
| ทำงานเองได้ไหม | ไม่ได้ | ได้ | ไม่ — เรียก JPA ต่อ |
| ให้อะไรเรา | `EntityManager`, `@Entity`, JPQL | สร้าง SQL, cache, dirty checking | สร้าง Repository อัตโนมัติจากชื่อ method, paging, spec |

### 7.5 @Component vs @Service vs @Repository vs @Controller

| Annotation | ทางเทคนิค | ความหมายเชิงสื่อสาร | พิเศษ |
|---|---|---|---|
| `@Component` | เป็น Bean | "อะไรก็ได้ที่ Spring ดูแล" | — |
| `@Service` | = `@Component` | "ที่นี่คือ business logic" | — |
| `@Repository` | = `@Component` | "ที่นี่คุยกับ DB" | แปลง exception ของ DB เป็น `DataAccessException` ของ Spring |
| `@Controller` | = `@Component` | "ที่นี่รับ HTTP" | ทำงานกับ view resolver |
| `@RestController` | = `@Controller` + `@ResponseBody` | "รับ HTTP แล้วตอบ JSON" | แปลง return value เป็น JSON อัตโนมัติ |

**คำถามกับดัก:** "ถ้าทั้งหมดเท่ากับ `@Component` แล้วทำไมต้องแยก?" → ตอบว่า **เพื่อสื่อสารเจตนากับมนุษย์และให้ framework/เครื่องมือรู้บทบาทของชั้นนั้น** (และ `@Repository` มีพฤติกรรมเพิ่มจริงเรื่องการแปลง exception)

### 7.6 Constructor Injection vs Field Injection

| | Constructor Injection | Field Injection (`@Autowired` บน field) |
|---|---|---|
| ทำ `final` ได้ | ได้ | ไม่ได้ |
| Test ง่ายไหม | ง่าย — new ด้วย mock ได้เลย | ยาก — ต้องพึ่ง reflection/Spring |
| มองเห็น dependency | ชัด — ดู constructor รู้ทันทีว่าใช้อะไรบ้าง | ซ่อน — dependency บวมโดยไม่รู้ตัว |
| Circular dependency | พังตั้งแต่ตอน start (ดี — รู้เร็ว) | อาจซ่อนไว้จนเจอตอน runtime |
| คำแนะนำ | **ใช้ตัวนี้** | เลี่ยง |

---

## 8. Common Mistakes

**1. คิดว่า Spring Boot เป็นคนละอย่างกับ Spring**
Spring Boot **คือ Spring** ที่มี auto-config ครอบ ถ้าตอบว่า "Spring Boot มาแทน Spring" จะถูกมองว่ายังไม่เข้าใจ

**2. เข้าใจ DI แค่ว่า "ไม่ต้อง new"**
ประโยชน์จริงคือ **ลด coupling** → เปลี่ยน implementation ได้ + เขียน unit test ได้โดยไม่ต้องต่อ DB จริง

**3. ยัด business logic ไว้ใน Controller**
Controller ที่มี `if` เงื่อนไขธุรกิจ 30 บรรทัด = ย้ายไป GraphQL/gRPC/CLI ไม่ได้เลย และ test ยาก

**4. ส่ง Entity ออกเป็น response ตรง ๆ**
เสี่ยงข้อมูลหลุด + ผูก DB schema กับ API + เกิด `LazyInitializationException` ตอน serialize

**5. กับดัก `@Transactional` — ข้อนี้ถามบ่อยมาก**

`@Transactional` **ไม่ใช่เวทมนตร์ที่ฝังอยู่ในโค้ดของคุณ** — Spring สร้าง **proxy** ห่อ Bean ของคุณไว้ แล้ว transaction เริ่ม/จบ "ที่ผิวของ proxy" ไม่ใช่ในตัว method

```
[ Caller ] → [ PROXY (เปิด transaction) ] → [ Your Bean.methodA() ]
                                                   ↓ this.methodB()   ← เรียกตัวเอง
                                             [ Your Bean.methodB() ]  ← ไม่ผ่าน proxy!
```

> **ให้มองภาพนี้ว่า** "transaction เกิดตอนของเข้าประตูหน้าบ้าน ถ้าเดินภายในบ้านจากห้องหนึ่งไปอีกห้อง ไม่มีใครมาเปิดประตูให้อีกรอบ"

กับดักที่ตามมา 4 ข้อ:

| กับดัก | เกิดอะไรขึ้น | ทางแก้ |
|---|---|---|
| **Self-invocation** — `this.methodB()` ในคลาสเดียวกัน | `@Transactional` บน `methodB` ไม่ทำงานเลย | แยก method ไปคลาสอื่น แล้ว inject เข้ามา |
| **ใส่บน method ที่ไม่ใช่ `public`** (proxy แบบเดิม) | ไม่ถูก proxy → ไม่มี transaction | ใช้ public method เป็นขอบ transaction |
| **จับ exception เองแล้วกลืน** | โดย default rollback เฉพาะ **unchecked exception** — ถ้าคุณ `catch` แล้วไม่ throw ต่อ จะ commit ทั้งที่ล้มเหลว | อย่ากลืน exception / ระบุ `rollbackFor` |
| **ครอบงานช้าไว้ใน transaction** (เรียก API ภายนอก, ส่งอีเมล) | ถือ DB connection ค้างนาน → connection pool หมด | ทำหลัง commit / โยนเข้า queue |

**6. คิดว่า `@Transactional` = lock ข้อมูล**
มันแค่กำหนดขอบเขต transaction ส่วนเรื่อง race condition ยังต้องคิดเรื่อง **isolation level** และ **optimistic lock (`@Version`) / pessimistic lock** ต่างหาก

**7. ไม่รู้ว่า JPA สร้าง query อะไรออกไป**
ผลคือ N+1 โผล่ตอน production — Junior มักไม่เคยเปิด `show-sql` ดูเลยสักครั้ง

**8. ใช้ `FetchType.EAGER` เพราะ "แก้ LazyInitializationException ได้"**
แก้อาการชั่วคราว แต่สร้างปัญหาถาวร — ทุก query จะลากข้อมูลที่ไม่ได้ใช้มาด้วยทุกครั้ง

**9. ใช้ `ddl-auto: update` บน production**
ปล่อยให้ Hibernate แก้ schema เองอันตรายมาก (ลบ/เปลี่ยน column โดยไม่ได้ review) → production ควรใช้ migration tool (Flyway/Liquibase) และตั้งค่าเป็น `validate` หรือ `none`

**10. เปิด Actuator ทุก endpoint แบบไม่ป้องกัน**
`/actuator/env` เปิดเผย config, `/actuator/heapdump` ดาวน์โหลดหน่วยความจำได้ → ต้องจำกัดด้วย security

**11. สับสน 401 กับ 403** (ดูข้อ 5.4)

**12. คิดว่า `@RestController` ต่างจาก `@Controller` โดยสิ้นเชิง**
จริง ๆ คือ `@Controller` + `@ResponseBody` เท่านั้น

---

## 9. Debugging — พังแล้วไล่ดูอะไรตามลำดับ

### 9.1 หลักคิดกลาง: "ตายที่ด่านไหน"

```
Client → Tomcat → Security → Dispatcher → Controller → Service → Repository → Hibernate → DB
   ①        ②         ③          ④            ⑤          ⑥           ⑦            ⑧      ⑨
```

> **ให้มองภาพนี้ว่า** "การ debug Spring Boot คือการหาว่า request เดินไปได้ถึงด่านที่เท่าไหร่แล้วหยุด"

วิธีหา: ใส่ log ที่ต้นทาง Controller ถ้า log **ไม่ขึ้นเลย** แปลว่าตายก่อนถึง ⑤ (ส่วนใหญ่คือ security หรือ route ไม่ตรง)

### 9.2 ตารางอาการ → สาเหตุ → ที่ต้องดู

| อาการ | สาเหตุที่พบบ่อย | ไล่ดูตามลำดับ |
|---|---|---|
| App start ไม่ขึ้น: `NoSuchBeanDefinition` | class ไม่ถูก component scan (อยู่นอก package ของ main) / ลืม annotation | โครงสร้าง package → annotation → `@ComponentScan` |
| `UnsatisfiedDependencyException` | มี Bean ชนิดเดียวกันหลายตัว หรือไม่มีเลย | อ่าน message ให้จบ → `@Qualifier` / `@Primary` |
| Circular dependency ตอน start | A ต้องการ B, B ต้องการ A | รื้อ design แยกความรับผิดชอบ (ไม่ใช่แค่ใส่ `@Lazy`) |
| 404 ทั้งที่เขียน endpoint แล้ว | path ซ้อนผิด / ลืม `@RequestMapping` ระดับ class / controller ไม่เป็น Bean | log ของ handler mapping ตอน start |
| 401 ทุก request | token ไม่ถูกส่ง / filter chain กันหมด / ลืม permitAll | Spring Security config → ดู header จริงที่ client ส่ง |
| 403 เฉพาะบาง user | role ไม่ตรงกับที่ `@PreAuthorize` ต้องการ / prefix `ROLE_` ไม่ตรง | เนื้อใน token → authority ที่ map จริง |
| 400 Bad Request ตลอด | DTO field ไม่ตรงกับ JSON / validation ไม่ผ่าน | log validation error → เทียบ JSON กับ DTO |
| 500 แต่ response ไม่บอกอะไร | exception ไม่ถูกจัดการ | `@ControllerAdvice` + stack trace บรรทัดแรกที่เป็นโค้ดเรา |
| API ช้ามาก | N+1 / ไม่มี index / connection pool หมด | เปิด `show-sql` นับจำนวน query → `EXPLAIN` → ดู metric ของ Hikari |
| `LazyInitializationException` | เข้าถึง collection นอก transaction (มัก serialize Entity) | ใช้ DTO + `JOIN FETCH` แทนการเปิด transaction ยาวขึ้น |
| ข้อมูลไม่ถูก save ทั้งที่ไม่ error | transaction rollback เงียบ / proxy ไม่ทำงาน (self-invocation) | ตรวจว่า method ถูกเรียกจากภายนอกคลาสไหม → log transaction |
| ข้อมูลเปลี่ยนเองโดยไม่ได้สั่ง save | dirty checking ของ Persistence Context | อย่าแก้ Entity ที่ managed ถ้าไม่ตั้งใจ |
| แอปค้าง ไม่ตอบอะไรเลย | connection pool หมด / thread ถูก block | `/actuator/metrics` → thread dump |
| ขึ้น prod แล้วพัง แต่ dev ปกติ | profile / env var ไม่ตรง | เช็ค active profile → ลำดับความสำคัญของ config |

### 9.3 เครื่องมือประจำตัว

| เครื่องมือ | ใช้ตอน |
|---|---|
| `show-sql` + format + log ของ binder | อยากรู้ว่า Hibernate ยิง SQL อะไร กี่ครั้ง |
| `/actuator/health`, `/actuator/metrics` | ตรวจสุขภาพ, connection pool, memory |
| `--debug` ตอน start | ดูรายงาน auto-configuration ว่าอะไรถูกเปิด/ไม่ถูกเปิด **เพราะอะไร** |
| Thread dump / Heap dump | แอปค้าง หรือสงสัย memory leak |
| Log ของ Spring Security ระดับ DEBUG | ไล่ดูว่าตายที่ filter ตัวไหน |

---

## 10. Interview Questions

### 🟢 Junior

1. Spring Boot คืออะไร ต่างจาก Spring อย่างไร
2. Dependency Injection คืออะไร มีประโยชน์อย่างไร
3. Bean คืออะไร
4. `@Controller` กับ `@RestController` ต่างกันอย่างไร
5. `@Service` กับ `@Repository` ต่างกันอย่างไร
6. Entity กับ DTO ต่างกันอย่างไร ทำไมไม่ส่ง Entity ออกไปเลย
7. JPA กับ Hibernate ต่างกันอย่างไร
8. Request เดินทางจาก client ไปถึง database ผ่านอะไรบ้าง
9. 401 กับ 403 ต่างกันอย่างไร
10. Auto Configuration คืออะไร

### 🟡 Mid

1. IoC คืออะไร "Inversion" หมายถึงกลับด้านอะไร
2. ทำไมถึงแนะนำ constructor injection มากกว่า field injection
3. `@Transactional` ทำงานอย่างไรเบื้องหลัง
4. ทำไมเรียก method ที่มี `@Transactional` ในคลาสเดียวกันแล้วไม่ทำงาน
5. N+1 problem คืออะไร ตรวจเจอได้อย่างไร แก้อย่างไรบ้าง (ตอบให้ได้ 2+ วิธี)
6. `FetchType.LAZY` กับ `EAGER` เลือกอย่างไร
7. Bean scope singleton หมายความว่าอะไร แล้วมันปลอดภัยกับ multi-thread ไหม
8. จัดการ exception แบบรวมศูนย์ใน Spring Boot ทำอย่างไร
9. Spring Security ตรวจ authentication ตรงไหนของ flow
10. จัดการ config ต่าง environment อย่างไร แล้ว secret เก็บที่ไหน
11. Actuator มีไว้ทำไม และมีข้อควรระวังอะไรบน production
12. Express กับ Spring Boot ต่างกันอย่างไร จะเลือกอันไหนเมื่อไร

### 🔴 Senior

1. ถ้าต้องอธิบายให้ทีมว่าทำไม `@Transactional` ถึงพลาดได้บ่อย จะอธิบายอย่างไร (proxy, self-invocation, rollback rule, scope ของ transaction)
2. ระบบมี latency สูงขึ้นหลัง deploy จะไล่หาสาเหตุอย่างไรตั้งแต่ HTTP ถึง DB
3. ออกแบบชั้น Service/Repository อย่างไรให้ test ได้โดยไม่ต้องมี DB จริง
4. เมื่อไรควรเลิกใช้ JPA แล้วเขียน SQL เอง
5. Singleton Bean ที่เก็บ state ภายในจะเกิดปัญหาอะไรใน production
6. ออกแบบ transaction boundary อย่างไรเมื่อมีการเรียก external API ร่วมด้วย
7. จะออกแบบ error contract ของ REST API อย่างไรให้ frontend ใช้งานได้จริง
8. ระบบเดิมเป็น monolith Spring Boot จะแยกเป็น service ย่อยต้องคิดเรื่องอะไรก่อน
9. Connection pool ควรตั้งขนาดเท่าไร คิดจากอะไร
10. อธิบายว่า auto-configuration ทำงานอย่างไร และถ้ามันเดาผิดจะ override อย่างไร

---

## 11. Answer Like a Developer

**โครงการตอบ 4 จังหวะ (ใช้ได้กับทุกคำถามในบทนี้):**

```
1) นิยามสั้น 1 ประโยค
2) บอกว่า "มีไว้แก้ปัญหาอะไร"
3) ยกตัวอย่างจากงานจริง / flow
4) ปิดด้วย trade-off หรือกับดักที่เคยเจอ
```

**ตัวอย่างที่ 1 — "DI คืออะไร"**

> (1) DI คือการที่ object ไม่สร้าง dependency ของตัวเอง แต่รับเข้ามาจากภายนอก
> (2) มีไว้เพื่อลด coupling — คนใช้ของไม่ต้องรู้ว่าของมาจากไหน
> (3) เช่น `OrderService` ประกาศว่าต้องใช้ `OrderRepository` ผ่าน constructor เวลาเขียน unit test ผมยัด mock เข้าไปแทนได้เลยโดยไม่ต้องต่อ DB
> (4) ข้อแลกเปลี่ยนคือ flow ของโปรแกรมอ่านยากขึ้นสำหรับคนใหม่ เพราะมองไม่เห็นว่าใครสร้างอะไร ต้องพึ่ง convention และ IDE

**ตัวอย่างที่ 2 — "@Transactional ทำงานยังไง"**

> (1) มันคือ annotation ที่บอกให้ Spring ครอบ method นี้ด้วย transaction
> (2) มีไว้เพื่อไม่ต้องเขียน begin/commit/rollback เอง
> (3) เบื้องหลัง Spring สร้าง proxy ห่อ Bean ไว้ — transaction เปิดตอนเข้าที่ proxy และ commit ตอนออก
> (4) กับดักที่ผมเคยเจอคือเรียก method ตัวเองในคลาสเดียวกัน แล้ว transaction ไม่ทำงานเพราะไม่ผ่าน proxy กับอีกเรื่องคือ default จะ rollback เฉพาะ unchecked exception ถ้าเรา catch แล้วกลืนไว้ มันจะ commit ทั้งที่งานล้มเหลว

**ตัวอย่างที่ 3 — "Express กับ Spring Boot เลือกอันไหน"**

> "ขึ้นกับโจทย์กับทีมครับ ถ้างานเป็น I/O-bound เยอะ ทีมเล็ก อยากเริ่มเร็วและยืดหยุ่น Express ตอบโจทย์กว่า แต่ถ้าโดเมนซับซ้อน มีกฎธุรกิจเยอะ ทีมใหญ่ที่ต้องการโครงเดียวกันทุกคน และต้องการ transaction/security เป็นมาตรฐาน Spring Boot จะได้เปรียบ เพราะ convention ช่วยให้โค้ดของทุกคนหน้าตาเหมือนกัน"

**สิ่งที่ไม่ควรตอบ:**

- "Spring Boot ดีกว่า Express" (ไม่มี context)
- "Spring Boot ใช้ง่ายเพราะไม่ต้อง config" (ตื้นเกินไป — ต้องบอกว่า *เพราะ auto-configuration ดู classpath*)
- "JPA คือ Hibernate" (ผิด — spec vs implementation)

---

## 12. One-Minute Review

- **Spring** = framework แกนกลางที่จัดการ object ให้เราผ่าน **IoC Container**
- **IoC** = กลับด้านการควบคุม เราไม่สร้าง object เอง framework สร้างให้
- **DI** = วิธีทำ IoC จริง — ฉีด dependency เข้ามา (ใช้ **constructor injection**)
- **Bean** = object ที่ Spring สร้างและดูแลวงจรชีวิต default scope คือ **singleton** (ห้ามเก็บ state ที่เปลี่ยนแปลงไว้ข้างใน)
- **Spring Boot** = Spring + **auto configuration** + **starter** + **embedded server**
- **ชั้นมาตรฐาน**: Controller (รับ/ตอบ) → Service (คิด) → Repository (คุย DB)
- **Entity** = ผูกกับ table, **DTO** = ผูกกับ API contract — อย่าสลับกัน
- **JPA** = spec, **Hibernate** = implementation, **Spring Data JPA** = ตัวช่วยสร้าง repository
- **@Transactional** ทำงานผ่าน **proxy** → self-invocation ไม่ทำงาน, rollback default เฉพาะ unchecked exception
- **N+1** = ORM ยิง query ลูกทีละตัว → แก้ด้วย `JOIN FETCH` / `@EntityGraph` / batch / DTO projection
- **Spring Security** = filter chain — 401 คือไม่รู้จักคุณ, 403 คือรู้จักแต่ไม่มีสิทธิ์
- **Actuator** = health/metrics สำหรับ production — แต่ต้องป้องกัน endpoint อ่อนไหว
- **Express vs Spring Boot** = ยืดหยุ่น/เริ่มเร็ว vs convention/ครบเครื่องสำหรับโดเมนซับซ้อน

---

## 13. Memory Card

**จำ 5 อย่าง**

1. **Spring = IoC Container** — เราไม่ `new` เอง container สร้างและต่อสายให้ (Spring Boot คือ Spring ที่ตั้งค่าให้แล้ว)
2. **ชั้นมาตรฐาน 3 ชั้น** — Controller รับ/ตอบ, Service คิด, Repository คุย DB และ **Entity ≠ DTO**
3. **JPA คือสเปก Hibernate คือคนทำงาน** — และ ORM จะยิง SQL ที่เรามองไม่เห็น จึงต้องเปิด `show-sql` ดูเสมอ
4. **@Transactional ทำงานผ่าน proxy** — เรียกตัวเองในคลาสเดียวกัน = ไม่มี transaction / catch แล้วกลืน = commit ทั้งที่พัง
5. **N+1 คือค่าเริ่มต้นที่ต้องระวัง** — ไม่ใช่ bug ของ JPA แต่เป็นผลของการไม่บอกว่าจะใช้ข้อมูลลูกด้วย

**Keyword**

- **Spring** → framework แกนกลาง จัดการ object ให้
- **Spring Boot** → Spring + auto config + starter + embedded server
- **IoC** → กลับด้านการควบคุม framework เป็นคนเรียกเรา
- **DI** → ส่ง dependency เข้ามาแทนที่จะสร้างเอง
- **Bean** → object ที่ Spring ดูแล (default singleton)
- **@Component** → สติกเกอร์บอกว่า "เก็บเข้า container"
- **@Service** → ที่อยู่ของ business logic
- **@Repository** → ชั้นคุยกับ database
- **@RestController** → รับ HTTP ตอบ JSON
- **Entity** → หน้าตาแถวใน table
- **DTO** → หน้าตาข้อมูลที่ตกลงกับ client
- **ORM** → แปลง object ↔ table
- **JPA** → specification
- **Hibernate** → implementation ของ JPA
- **Persistence Context** → พื้นที่จำ Entity ภายใน transaction (dirty checking)
- **@Transactional** → ขอบเขต transaction ผ่าน proxy
- **N+1** → 1 query หลัก + N query ลูก
- **Spring Security** → filter chain: authentication แล้ว authorization
- **401** → ไม่รู้ว่าคุณเป็นใคร / **403** → รู้แต่ไม่มีสิทธิ์
- **Auto Configuration** → เดา config จาก classpath
- **Starter** → dependency ก้อนรวม
- **Profile** → ชุด config ต่อ environment
- **Actuator** → endpoint สุขภาพ/metric
- **Proxy** → ตัวห่อ Bean เพื่อแทรกพฤติกรรม
- **Embedded Server** → Tomcat ฝังใน jar

---

[← สารบัญ](./00-README-TOC.md)
