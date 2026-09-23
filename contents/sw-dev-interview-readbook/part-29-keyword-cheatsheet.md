# PART 29 — FINAL KEYWORD CHEAT SHEET

> ตำแหน่งในภาพใหญ่: โหมดทบทวน — ศัพท์ทุกชั้นของระบบ ย่อเหลือคำละไม่กี่คำ อ่านเร็วก่อนเข้าห้องสัมภาษณ์

**จำนวน keyword ทั้งหมด: 346 คำ ใน 25 หมวด** (Repository และ Service ปรากฏ 2 ครั้ง เพราะมีความหมายต่างกันตามหมวด)

---

## 1. Big Picture

หนังสือทั้งเล่มมีศัพท์หลายร้อยคำ ในห้องสัมภาษณ์คุณไม่มีเวลาเปิดทีละ PART

หน้านี้คือ **"บัตรคำ" ของทั้งเล่ม** — ทุกคำย่อเหลือไม่เกินประมาณ 6 คำ
ถ้าอ่านคำไหนแล้วอธิบายต่อไม่ได้ภายใน 30 วินาที ให้กลับไปเปิด PART ของหมวดนั้น

---

## 2. Keywords

### Web / HTTP (PART 1)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| HTTP | ภาษาที่ client คุยกับ server | Web/HTTP |
| HTTPS | HTTP + เข้ารหัส TLS | Web/HTTP |
| Request | คำขอจาก client | Web/HTTP |
| Response | คำตอบจาก server | Web/HTTP |
| Header | ข้อมูลกำกับ request | Web/HTTP |
| Body | เนื้อข้อมูลที่ส่ง | Web/HTTP |
| Query Parameter | ตัวกรองหลัง ? | Web/HTTP |
| Path Parameter | ระบุ resource ใน URL | Web/HTTP |
| GET | อ่านข้อมูล | Web/HTTP |
| POST | สร้างข้อมูลใหม่ | Web/HTTP |
| PUT | แทนที่ทั้งก้อน | Web/HTTP |
| PATCH | แก้บางส่วน | Web/HTTP |
| DELETE | ลบข้อมูล | Web/HTTP |
| Status Code | ผลลัพธ์เป็นตัวเลข | Web/HTTP |
| 2xx | สำเร็จ | Web/HTTP |
| 4xx | client ผิด | Web/HTTP |
| 5xx | server ผิด | Web/HTTP |
| DNS | ชื่อ → IP | Web/HTTP |
| REST API | Resource + HTTP Method | Web/HTTP |
| Endpoint | ที่อยู่ของ API | Web/HTTP |
| Stateless | server ไม่จำ request ก่อน | Web/HTTP |

### JavaScript (PART 2)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Call Stack | ลำดับฟังก์ชันที่กำลังรัน | JavaScript |
| Heap | ที่เก็บ object | JavaScript |
| Event Loop | ย้ายงานรอ → Stack | JavaScript |
| Callback | ฟังก์ชันที่เรียกทีหลัง | JavaScript |
| Promise | สัญญาว่าจะมีผล | JavaScript |
| async/await | เขียน async เหมือน sync | JavaScript |
| Microtask | คิวด่วน (Promise) | JavaScript |
| Macrotask | คิวปกติ (setTimeout) | JavaScript |
| Closure | ฟังก์ชันจำ scope เดิม | JavaScript |
| Scope | ขอบเขตการมองเห็นตัวแปร | JavaScript |
| Immutable | ไม่แก้ของเดิม สร้างใหม่ | JavaScript |
| Reference | ชี้ไปที่ object เดียวกัน | JavaScript |
| Non-blocking | ไม่รอ ทำอย่างอื่นต่อ | JavaScript |

### React (PART 3)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| React | UI Component Library | React |
| Component | ชิ้นส่วน UI ใช้ซ้ำได้ | React |
| Props | Parent → Child | React |
| State | Data → UI | React |
| Re-render | State เปลี่ยน → วาดใหม่ | React |
| Virtual DOM | สำเนา DOM ในหน่วยความจำ | React |
| Reconciliation | เทียบของเก่ากับใหม่ | React |
| useState | เก็บ state ใน component | React |
| useEffect | ทำ side effect หลัง render | React |
| useRef | จำค่า ไม่ trigger render | React |
| useMemo | จำผลคำนวณ | React |
| useCallback | จำฟังก์ชัน | React |
| Context | ส่งข้อมูลข้ามหลายชั้น | React |
| Prop Drilling | ส่ง props ทะลุหลายชั้น | React |
| Lifting State Up | ย้าย state ขึ้นไปหาพ่อ | React |
| Key | ป้ายชื่อ item ใน list | React |
| Controlled Component | React คุมค่า input | React |
| Error Boundary | จับ error ใน component tree | React |
| Server State | ข้อมูลที่มาจาก API | React |

### Next.js (PART 4)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Next.js | React Framework ครบวงจร | Next.js |
| App Router | route ตามโฟลเดอร์ | Next.js |
| Layout | โครงหน้าที่ใช้ร่วมกัน | Next.js |
| Dynamic Route | route มีตัวแปร | Next.js |
| Server Component | render บน server เท่านั้น | Next.js |
| Client Component | มี state / event ในเบราว์เซอร์ | Next.js |
| CSR | render ในเบราว์เซอร์ | Next.js |
| SSR | render ทุก request | Next.js |
| SSG | render ตอน build | Next.js |
| ISR | SSG + อัปเดตเป็นระยะ | Next.js |
| Hydration | HTML นิ่ง → กดได้ | Next.js |
| Hydration Error | HTML server ≠ client | Next.js |
| Revalidation | ล้าง cache ให้สดใหม่ | Next.js |
| Middleware (Next.js) | ด่านก่อนเข้า route | Next.js |
| Route Handler | API ใน Next.js | Next.js |
| Server Action | เรียกฟังก์ชัน server จาก form | Next.js |

### Node.js (PART 5)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Node.js | JS Runtime นอกเบราว์เซอร์ | Node.js |
| V8 | engine แปล JS | Node.js |
| libuv | จัดการ I/O แบบ async | Node.js |
| I/O-bound | รออ่าน/เขียนเป็นหลัก | Node.js |
| CPU-bound | คำนวณหนัก | Node.js |
| Worker Thread | thread แยกสำหรับงานหนัก | Node.js |
| Event Loop Blocking | งานหนักขวางทุก request | Node.js |
| Stream | ส่งข้อมูลทีละก้อน | Node.js |
| Buffer | ข้อมูล binary ดิบ | Node.js |
| npm | ตัวจัดการ package | Node.js |
| package.json | บัตรประจำตัวโปรเจกต์ | Node.js |
| Memory Leak | หน่วยความจำโตไม่หยุด | Node.js |

### Express (PART 6)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Express | Web Framework บน Node.js | Express |
| Middleware | ด่านกลางทาง request | Express |
| next() | ส่งต่อด่านถัดไป | Express |
| Route | URL + Method → Handler | Express |
| Controller | รับ request ตอบ response | Express |
| Service | ที่อยู่ของ business logic | Express |
| Repository | คุยกับ database | Express |
| Validation | ตรวจ input ก่อนใช้ | Express |
| Central Error Handler | จับ error ที่เดียว | Express |
| Auth Middleware | ตรวจ token ก่อนเข้า route | Express |

### Security (PART 7)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Authentication | Who are you? | Security |
| Authorization | What can you do? | Security |
| Session | server จำว่าใคร login | Security |
| Cookie | ข้อมูลเล็กที่เบราว์เซอร์เก็บ | Security |
| JWT | token ที่เซ็นรับรอง | Security |
| Access Token | บัตรผ่านอายุสั้น | Security |
| Refresh Token | ใช้ขอ access token ใหม่ | Security |
| OAuth2 | ให้สิทธิ์ผ่านบุคคลที่สาม | Security |
| SSO | login ครั้งเดียวใช้หลายระบบ | Security |
| RBAC | สิทธิ์ตาม role | Security |
| Password Hashing | เก็บรหัสแบบย้อนกลับไม่ได้ | Security |
| Salt | สุ่มเติมก่อน hash | Security |
| CORS | เบราว์เซอร์คุมข้าม origin | Security |
| CSRF | หลอกให้ส่ง request แทน | Security |
| XSS | ฝัง script ลงหน้าเว็บ | Security |
| SQL Injection | ฝังคำสั่งลง query | Security |
| Rate Limiting | จำกัดจำนวนครั้ง | Security |
| HttpOnly | JS อ่าน cookie ไม่ได้ | Security |
| SameSite | กัน cookie ข้ามเว็บ | Security |
| Secret Management | เก็บกุญแจให้ปลอดภัย | Security |

### Database (PART 8)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| SQL | ตารางมี schema ชัด | Database |
| NoSQL | โครงยืดหยุ่น | Database |
| Primary Key | ตัวระบุแถวไม่ซ้ำ | Database |
| Foreign Key | ชี้ไปตารางอื่น | Database |
| JOIN | รวมข้อมูลหลายตาราง | Database |
| Index | Faster Search | Database |
| N+1 Query | query ซ้ำในลูป | Database |
| Offset Pagination | ข้าม N แถว | Database |
| Cursor Pagination | ต่อจากตัวสุดท้าย | Database |
| Transaction | All or Nothing | Database |
| ACID | กฎความถูกต้องของ transaction | Database |
| Isolation | transaction ไม่กวนกัน | Database |
| Race Condition | แย่งกันแก้พร้อมกัน | Database |
| Optimistic Lock | เช็ค version ตอนบันทึก | Database |
| Pessimistic Lock | ล็อกก่อนแก้ | Database |
| Connection Pool | ใช้ connection ซ้ำ | Database |
| Normalization | แยกตารางลดซ้ำซ้อน | Database |
| Replication | สำเนา database | Database |

### Java (PART 9)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| JVM | เครื่องรัน bytecode | Java |
| JDK | ชุดเครื่องมือพัฒนา Java | Java |
| JRE | ชุดรัน Java | Java |
| Bytecode | โค้ดกลางก่อนรัน | Java |
| Static Typing | ตรวจ type ตอน compile | Java |
| Encapsulation | ซ่อนข้อมูลภายใน | Java |
| Inheritance | สืบทอดจากแม่ | Java |
| Polymorphism | เรียกเหมือนกัน ทำต่างกัน | Java |
| Abstraction | เห็นแค่สิ่งที่จำเป็น | Java |
| Interface | สัญญาว่าต้องมีเมธอด | Java |
| Abstract Class | แม่แบบครึ่งเดียว | Java |
| Garbage Collection | เก็บขยะหน่วยความจำอัตโนมัติ | Java |
| Checked Exception | ต้องจัดการ error ตอน compile | Java |

### Spring Boot (PART 10)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Spring Boot | Spring ตั้งค่าให้พร้อมใช้ | Spring Boot |
| IoC | framework สร้าง object ให้ | Spring Boot |
| Dependency Injection | ส่งของที่ต้องใช้เข้ามา | Spring Boot |
| Bean | object ที่ Spring ดูแล | Spring Boot |
| Auto Configuration | ตั้งค่าอัตโนมัติจาก dependency | Spring Boot |
| Entity | ตาราง database เป็น class | Spring Boot |
| DTO | ข้อมูลส่งผ่าน API | Spring Boot |
| JPA | มาตรฐาน ORM ของ Java | Spring Boot |
| Hibernate | ตัว implement JPA | Spring Boot |
| ORM | object ↔ ตาราง | Spring Boot |
| Spring Security | ด่าน auth ของ Spring | Spring Boot |
| Actuator | endpoint ดูสุขภาพแอป | Spring Boot |

### Python (PART 11)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Dynamic Typing | type รู้ตอนรัน | Python |
| Interpreter | อ่านแล้วรันทีละส่วน | Python |
| List | ลำดับ แก้ได้ | Python |
| Tuple | ลำดับ แก้ไม่ได้ | Python |
| Dict | key → value | Python |
| Virtual Environment | แยก package ต่อโปรเจกต์ | Python |
| pip | ติดตั้ง package | Python |
| Generator | สร้างค่าทีละตัว | Python |
| Asyncio | async ใน Python | Python |
| GIL | หนึ่ง thread รัน Python ทีละตัว | Python |
| FastAPI | API framework เร็ว มี type | Python |
| Django | framework ครบชุด | Python |

### React Native (PART 12)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| React Native | React → Native UI | React Native |
| Native UI | component จริงของมือถือ | React Native |
| Native Module | เรียกความสามารถเครื่อง | React Native |
| Bridge | สะพาน JS ↔ Native (แบบเดิม) | React Native |
| New Architecture | JS คุย Native ตรงขึ้น | React Native |
| Stack Navigation | ซ้อนหน้าแบบกองไพ่ | React Native |
| Tab Navigation | สลับหน้าด้วยแท็บ | React Native |
| Permission | ขออนุญาตใช้ฟีเจอร์เครื่อง | React Native |
| App Lifecycle | foreground / background | React Native |
| Deep Link | ลิงก์เปิดหน้าในแอป | React Native |
| Push Notification | แจ้งเตือนจาก server | React Native |
| FlatList | list ยาวแบบประหยัด | React Native |

### Docker (PART 13)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Docker | บรรจุแอปเป็นกล่อง | Docker |
| Image | Blueprint | Docker |
| Container | Running Image | Docker |
| Dockerfile | สูตรสร้าง image | Docker |
| Layer | ชั้นของ image cache ได้ | Docker |
| Registry | คลังเก็บ image | Docker |
| Volume | ข้อมูลอยู่รอดหลัง container ตาย | Docker |
| Port Mapping | port เครื่อง → port container | Docker |
| Docker Network | container คุยกัน | Docker |
| Docker Compose | รันหลาย container พร้อมกัน | Docker |
| Docker vs VM | แชร์ kernel vs มี OS เต็ม | Docker |

### Kubernetes (PART 14)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Kubernetes | ผู้จัดการ container | Kubernetes |
| Cluster | กลุ่มเครื่องทั้งหมด | Kubernetes |
| Node | เครื่องหนึ่งใน cluster | Kubernetes |
| Pod | Smallest K8s Unit | Kubernetes |
| Deployment | ประกาศว่าต้องการกี่ Pod | Kubernetes |
| ReplicaSet | รักษาจำนวน Pod | Kubernetes |
| Service | ที่อยู่คงที่ของกลุ่ม Pod | Kubernetes |
| Ingress | ประตูจากภายนอก | Kubernetes |
| ConfigMap | config ไม่ลับ | Kubernetes |
| Secret | config ลับ | Kubernetes |
| Namespace | แบ่งห้องใน cluster | Kubernetes |
| Liveness Probe | ยังมีชีวิตไหม ไม่ก็ restart | Kubernetes |
| Readiness Probe | พร้อมรับ traffic ไหม | Kubernetes |
| HPA | เพิ่มลด Pod อัตโนมัติ | Kubernetes |
| Self Healing | พังแล้วสร้างใหม่เอง | Kubernetes |
| Rolling Update | ทยอยเปลี่ยน Pod | Kubernetes |

### CI/CD (PART 15)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| CI | รวมโค้ดบ่อย ตรวจอัตโนมัติ | CI/CD |
| CD | ส่งโค้ดถึงผู้ใช้อัตโนมัติ | CI/CD |
| Pipeline | สายพานขั้นตอน | CI/CD |
| Artifact | ผลลัพธ์จาก build | CI/CD |
| Staging | ซ้อมก่อน production | CI/CD |
| Production | ระบบที่ผู้ใช้จริงใช้ | CI/CD |
| Rollback | ถอยกลับเวอร์ชันก่อน | CI/CD |
| Blue-Green | สลับสองชุดทันที | CI/CD |
| Canary | ปล่อยให้คนส่วนน้อยก่อน | CI/CD |
| Feature Flag | เปิดปิดฟีเจอร์ไม่ต้อง deploy | CI/CD |

### Advanced Backend (PART 16)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Cache | สำเนาเร็ว อาจเก่า | Advanced Backend |
| Redis | in-memory key-value | Advanced Backend |
| Cache Aside | miss → ดึง DB → เก็บ | Advanced Backend |
| Cache Invalidation | ลบ cache เมื่อข้อมูลเปลี่ยน | Advanced Backend |
| TTL | อายุของ cache | Advanced Backend |
| Queue | ฝากงานทำทีหลัง | Advanced Backend |
| Message Broker | ตัวกลางส่งข้อความ | Advanced Backend |
| Kafka | event log ที่อ่านซ้ำได้ | Advanced Backend |
| Worker | ตัวหยิบงานจาก queue | Advanced Backend |
| WebSocket | ท่อสองทางค้างไว้ | Advanced Backend |
| Load Balancer | กระจาย traffic | Advanced Backend |
| Reverse Proxy | ตัวแทนหน้า server | Advanced Backend |
| API Gateway | ประตูรวมของทุก API | Advanced Backend |
| CDN | เก็บไฟล์ใกล้ผู้ใช้ | Advanced Backend |
| Horizontal Scaling | เพิ่มจำนวนเครื่อง | Advanced Backend |
| Vertical Scaling | เพิ่มสเปกเครื่อง | Advanced Backend |
| Idempotency | ทำซ้ำ ผลเท่าเดิม | Advanced Backend |
| Retry | ลองใหม่เมื่อพลาด | Advanced Backend |
| Exponential Backoff | รอนานขึ้นทุกครั้ง | Advanced Backend |
| Circuit Breaker | ตัดวงจรเมื่อปลายทางพัง | Advanced Backend |
| Eventual Consistency | ตรงกันในที่สุด | Advanced Backend |

### Architecture (PART 17)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Layered Architecture | แบ่งชั้นตามหน้าที่ | Architecture |
| MVC | Model View Controller | Architecture |
| Clean Architecture | logic ไม่พึ่ง framework | Architecture |
| Separation of Concerns | แต่ละส่วนทำเรื่องเดียว | Architecture |
| SOLID | 5 หลักออกแบบ class | Architecture |
| DRY | อย่าเขียนซ้ำ | Architecture |
| KISS | ทำให้เรียบง่าย | Architecture |
| YAGNI | ยังไม่ต้องใช้ อย่าทำ | Architecture |
| Coupling | ผูกกันแน่นแค่ไหน | Architecture |
| Cohesion | ของในกล่องเกี่ยวกันแค่ไหน | Architecture |
| Monolith | ทุกอย่างในแอปเดียว | Architecture |
| Microservices | แยกเป็นบริการเล็ก | Architecture |
| Design Pattern | วิธีแก้ปัญหาที่เจอซ้ำ | Architecture |
| Strategy Pattern | สลับวิธีทำได้ | Architecture |
| Observer Pattern | แจ้งผู้ติดตามเมื่อเปลี่ยน | Architecture |

### Testing (PART 18)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Testing Pyramid | unit เยอะ E2E น้อย | Testing |
| Unit Test | ทดสอบชิ้นเล็กแยกเดี่ยว | Testing |
| Integration Test | ทดสอบหลายส่วนต่อกัน | Testing |
| E2E Test | ทดสอบแบบผู้ใช้จริง | Testing |
| Mock | ของปลอมที่ตรวจการเรียก | Testing |
| Stub | ของปลอมคืนค่าตายตัว | Testing |
| Spy | แอบดูการเรียกของจริง | Testing |
| Edge Case | กรณีขอบ | Testing |
| Regression Test | กันบั๊กเก่ากลับมา | Testing |
| Smoke Test | เช็คว่าระบบหลักยังรอด | Testing |
| Load Test | ทดสอบรับโหลดปกติ | Testing |

### Git (PART 19)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Repository | คลังโค้ดพร้อมประวัติ | Git |
| Commit | snapshot ของโค้ด | Git |
| Branch | เส้นงานแยก | Git |
| Merge | รวมสาย เก็บประวัติ | Git |
| Rebase | ย้ายฐาน ประวัติเป็นเส้นตรง | Git |
| Pull Request | ขอรวมโค้ด + review | Git |
| Conflict | แก้บรรทัดเดียวกัน | Git |
| Revert | commit ใหม่ที่ยกเลิกของเก่า | Git |
| Reset | ย้ายตัวชี้ branch ถอยหลัง | Git |
| Cherry Pick | หยิบ commit เดียวมาใช้ | Git |
| Trunk Based | รวมเข้า main บ่อย | Git |

### Debugging (PART 20)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Reproduce | ทำให้เกิดซ้ำได้ | Debugging |
| Expected vs Actual | ควรเป็น vs เป็นจริง | Debugging |
| Hypothesis | สมมติฐานที่ทดสอบได้ | Debugging |
| Root Cause | ต้นเหตุจริง | Debugging |
| Symptom | อาการที่เห็น | Debugging |
| Stack Trace | เส้นทาง error | Debugging |
| Breakpoint | หยุดโค้ดดูค่า | Debugging |
| Binary Search Debugging | ผ่าครึ่งหาจุดพัง | Debugging |
| Mitigation | หยุดเลือดก่อน | Debugging |
| Hotfix | แก้ด่วนบน production | Debugging |

### Problem Solving (PART 21)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Big O | ความเร็วเมื่อข้อมูลโต | Problem Solving |
| HashMap | หาด้วย key ทันที | Problem Solving |
| Set | เก็บค่าไม่ซ้ำ | Problem Solving |
| Stack | เข้าหลังออกก่อน | Problem Solving |
| Queue (DS) | เข้าก่อนออกก่อน | Problem Solving |
| Tree | โครงแตกกิ่ง | Problem Solving |
| Graph | จุดเชื่อมเส้น | Problem Solving |
| Two Pointer | สองตัวชี้เดินหากัน | Problem Solving |
| Sliding Window | หน้าต่างเลื่อนต่อเนื่อง | Problem Solving |
| Binary Search | ผ่าครึ่งในข้อมูลเรียง | Problem Solving |
| Prefix Sum | ผลรวมสะสมล่วงหน้า | Problem Solving |
| DFS | ลงลึกก่อน | Problem Solving |
| BFS | กวาดทีละชั้น | Problem Solving |
| Recursion | ฟังก์ชันเรียกตัวเอง | Problem Solving |
| Greedy | เลือกดีสุดทีละขั้น | Problem Solving |
| Dynamic Programming | จำคำตอบย่อยไม่คิดซ้ำ | Problem Solving |

### Performance (PART 22)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Measure Before Optimize | วัดก่อนแก้ | Performance |
| Bundle Size | ขนาดไฟล์ JS ที่โหลด | Performance |
| Code Splitting | แบ่งโหลดเป็นส่วน | Performance |
| Lazy Loading | โหลดเมื่อจำเป็น | Performance |
| Memoization | จำผลลัพธ์ไว้ใช้ซ้ำ | Performance |
| Debounce | รอหยุดพิมพ์ค่อยทำ | Performance |
| Throttle | ทำได้ไม่เกินความถี่ | Performance |
| Profiling | วัดว่าเวลาหายไปไหน | Performance |
| Bottleneck | คอขวด | Performance |
| Query Optimization | ทำ query ให้เบาลง | Performance |

### Observability (PART 23)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Observability | ถามระบบได้ว่าเกิดอะไร | Observability |
| Monitoring | เฝ้าดูสิ่งที่รู้ล่วงหน้า | Observability |
| Logs | บันทึกเหตุการณ์ | Observability |
| Metrics | ตัวเลขตามเวลา | Observability |
| Tracing | ตามรอย request ข้ามบริการ | Observability |
| Trace ID | รหัสร้อยทุกชั้น | Observability |
| Span | ช่วงหนึ่งใน trace | Observability |
| Latency | เวลาตอบหนึ่งครั้ง | Observability |
| Throughput | จำนวนงานต่อวินาที | Observability |
| Error Rate | สัดส่วน request พัง | Observability |
| p95 / p99 | latency ของกลุ่มช้าสุด | Observability |
| APM | เครื่องมือดูประสิทธิภาพแอป | Observability |
| Alert | แจ้งเตือนเมื่อผิดปกติ | Observability |
| Incident | เหตุระบบมีปัญหา | Observability |
| Postmortem | สรุปบทเรียนไม่โทษคน | Observability |

### System Design (PART 24)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Requirement | ระบบต้องทำอะไร | System Design |
| Non-functional Requirement | เร็ว ทน ปลอดภัยแค่ไหน | System Design |
| Capacity Estimation | ประเมินปริมาณคร่าว ๆ | System Design |
| Object Storage | เก็บไฟล์ใหญ่ | System Design |
| Sharding | แบ่งข้อมูลหลายเครื่อง | System Design |
| Read Replica | สำเนาไว้อ่าน | System Design |
| Single Point of Failure | จุดเดียวพังล่มหมด | System Design |
| CAP Theorem | เลือกได้สองในสาม | System Design |
| Trade-off | ได้อย่างเสียอย่าง | System Design |
| High Availability | ล่มน้อยที่สุด | System Design |

### HR Vocabulary (PART 26)

| Keyword | จำสั้นๆ | หมวด |
|---|---|---|
| Scalable | โตได้ไม่พัง | HR Vocabulary |
| Maintainable | แก้ง่าย ดูแลง่าย | HR Vocabulary |
| Reliable | ทำงานถูกต่อเนื่อง | HR Vocabulary |
| Fault Tolerant | พังบางส่วนยังทำงาน | HR Vocabulary |
| Loosely Coupled | ผูกกันหลวม แยกเปลี่ยนได้ | HR Vocabulary |
| Technical Debt | หนี้จากทางลัด | HR Vocabulary |
| Legacy Code | โค้ดเก่าที่ยังต้องดูแล | HR Vocabulary |
| Refactoring | จัดโค้ดใหม่ พฤติกรรมเดิม | HR Vocabulary |
| Ownership | รับผิดชอบจนจบ | HR Vocabulary |
| Stakeholder | คนที่ได้รับผลกระทบ | HR Vocabulary |
| Code Review | ตรวจโค้ดกันก่อนรวม | HR Vocabulary |
| Deadline Trade-off | เวลา vs คุณภาพ vs ขอบเขต | HR Vocabulary |

---

## 3. Mental Model

มองทุก keyword ว่าเป็น **"ป้ายบอกทาง"** บนแผนที่ PART 28 — แต่ละคำต้องตอบได้ 3 อย่าง: อยู่ชั้นไหน, แก้ปัญหาอะไร, ถ้าพังจะเห็นอาการอะไร

---

## 4. ภาพจำ

```
🧠 ภาพจำ:
Cheat Sheet = บัตรคำศัพท์ก่อนสอบ
ด้านหน้า = Keyword
ด้านหลัง = จำสั้นๆ
พลิกไม่ออก = กลับไปอ่าน PART นั้น
```

---

## 5. How It Works

```
อ่าน Keyword
     ↓
พูด "จำสั้นๆ" ออกเสียง
     ↓
ขยายเป็น 1 ประโยค + ตัวอย่างงานจริง
     ↓
ติด? → เปิด PART ตามวงเล็บของหมวด
```

> **ให้มองภาพนี้ว่า** "ตารางนี้ไม่ใช่ที่เรียน แต่เป็นที่ตรวจว่าตัวเองจำอะไรไม่ได้"

---

## 6. Example

ผู้สัมภาษณ์ถาม "Idempotency คืออะไร" → จำสั้นๆ: "ทำซ้ำ ผลเท่าเดิม" → ขยาย: "กดจ่ายเงินซ้ำสองครั้งจากเน็ตหลุด ระบบต้องตัดเงินครั้งเดียว โดยใช้ Idempotency Key"

---

## 7. Compare

| คู่ที่สับสน | จำสั้นๆ |
|---|---|
| Authentication vs Authorization | เป็นใคร vs ทำอะไรได้ |
| Image vs Container | แม่พิมพ์ vs ตัวที่กำลังรัน |
| Props vs State | ข้อมูลจากพ่อ vs ข้อมูลของตัวเอง |
| Liveness vs Readiness | ยังมีชีวิต vs พร้อมรับงาน |
| Merge vs Rebase | เก็บประวัติ vs ประวัติเส้นตรง |
| Latency vs Throughput | เร็วต่อครั้ง vs ปริมาณต่อวินาที |

---

## 8. Common Mistakes

- ท่องคำ "จำสั้นๆ" แต่ยกตัวอย่างงานจริงไม่ได้
- ใช้ HR Vocabulary ลอย ๆ เช่น "ระบบผม scalable" โดยไม่บอกว่า scale อย่างไร

---

## 9. Debugging

ถ้าอ่านแล้วอธิบายไม่ได้: หาหมวด → เปิด PART ในวงเล็บ → อ่านหัวข้อ 2 Keywords และ 13 Memory Card ของ PART นั้นก่อน

---

## 10. Interview Questions

- 🟢 Junior: ให้อธิบาย keyword เดี่ยว เช่น "Index คืออะไร"
- 🟡 Mid: ให้เทียบคู่ เช่น "SSR ต่างจาก SSG อย่างไร"
- 🔴 Senior: ให้ร้อยหลาย keyword เป็นเรื่องเดียว เช่น "ใช้ Cache, Queue, Idempotency แก้ flash sale อย่างไร"

---

## 11. Answer Like a Developer

```
จำสั้นๆ 1 ประโยค → มีไว้ทำไม → ตัวอย่างงานจริง → trade-off / ข้อควรระวัง
```

---

## 12. One-Minute Review

อ่านเฉพาะคอลัมน์ Keyword แล้วปิดคอลัมน์ขวา พูดความหมายเอง — คำไหนติด ทำเครื่องหมายไว้ อ่านซ้ำเฉพาะคำนั้นใน PART 30

---

## 13. Memory Card

**จำ 5 อย่าง**

1. ทุก keyword = อยู่ชั้นไหน + แก้ปัญหาอะไร
2. จำสั้น ๆ ก่อน แล้วขยายด้วยตัวอย่างงานจริง
3. คู่ที่สับสนต้องเทียบได้ทันที
4. HR Vocabulary ต้องมีหลักฐานประกอบเสมอ
5. ติดคำไหน กลับไปที่ PART ในวงเล็บ

**Keyword:** Authentication → Who are you? ; Authorization → What can you do? ; Index → Faster Search ; Transaction → All or Nothing ; Pod → Smallest K8s Unit

---

[← สารบัญ](./00-README-TOC.md)
