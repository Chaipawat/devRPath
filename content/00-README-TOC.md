# 📘 Software Developer Interview Read Book

**ฉบับอ่านทบทวนก่อนสัมภาษณ์งาน**
สำหรับตำแหน่ง **Frontend Engineer / Full-stack Developer** ระดับ **Junior → Mid-level**
(เนื้อหาอธิบายลึกถึงระดับ Senior เพื่อให้เข้าใจที่มาที่ไปจริง)

---

## หนังสือเล่มนี้เขียนขึ้นเพื่ออะไร

หนังสือเล่มนี้ **ไม่ใช่** หนังสือท่อง syntax
มันคือหนังสือที่ทำให้คุณ:

| อ่านจบแล้วคุณจะ | หมายความว่า |
|---|---|
| ไม่ต้องจำ syntax | เข้าใจ concept และ mental model แทน |
| อธิบายศัพท์ technical ให้ HR ฟังได้ | พูดภาษาคนก่อน แล้วค่อยใส่ศัพท์ |
| ตอบ technical interview ได้ | รู้ว่าคำถามแต่ละข้อ "เขาอยากฟังอะไร" |
| เจอปัญหาแล้วรู้ว่าเริ่มคิดจากตรงไหน | มี debugging framework ติดหัว |
| เชื่อม Frontend → Backend → DB → Infra ได้ | เห็นภาพใหญ่ ไม่ใช่เห็นเป็นชิ้น ๆ |

---

## 🧠 ภาพจำใหญ่ของทั้งเล่ม

```
[USER]
   ↓
[BROWSER / MOBILE]
   ↓
[FRONTEND]        React / Next.js / React Native
   ↓
[HTTP / REST]
   ↓
[BACKEND]         Node.js + Express / Java + Spring Boot / Python
   ↓
[AUTH]            Authentication / Authorization
   ↓
[BUSINESS LOGIC]
   ↓
[CACHE / QUEUE]   Redis / RabbitMQ / Kafka
   ↓
[DATABASE]        PostgreSQL / MySQL / MongoDB
   ↓
[DOCKER]
   ↓
[KUBERNETES]
   ↓
[CLOUD / PRODUCTION]
   ↓
[LOGS / METRICS / TRACING]
```

> **ให้มองภาพนี้ว่า** "คำขอหนึ่งครั้งของผู้ใช้ ต้องเดินผ่านด่านเหล่านี้ทีละชั้น และงานของเราคือรู้ว่าแต่ละชั้นทำอะไร พังได้อย่างไร และวัดผลได้ตรงไหน"

ทุก PART ในหนังสือเล่มนี้ = **หนึ่งชั้นในภาพนี้** หรือ **หนึ่งทักษะที่ใช้ดูแลภาพนี้**

---

## 📐 ทุก Chapter ใช้โครงเดียวกัน 13 หัวข้อ

| # | หัวข้อ | ตอบคำถามว่า |
|---|---|---|
| 1 | Big Picture | เรื่องนี้คืออะไรในภาษาคนธรรมดา |
| 2 | Keywords | ศัพท์ที่ต้องรู้ + วิธีจำสั้น ๆ |
| 3 | Mental Model | ควรมองเรื่องนี้ในหัวแบบไหน |
| 4 | 🧠 ภาพจำ | Analogy ที่จำได้ทันที |
| 5 | How It Works | Flow แบบ ASCII Diagram |
| 6 | Example | Scenario จากงานจริง |
| 7 | Compare | เปรียบเทียบสิ่งที่มักสับสน |
| 8 | Common Mistakes | สิ่งที่ Junior มักเข้าใจผิด |
| 9 | Debugging | พังแล้วไล่ดูอะไรตามลำดับ |
| 10 | Interview Questions | 🟢 Junior / 🟡 Mid / 🔴 Senior |
| 11 | Answer Like a Developer | โครงสร้างการตอบ ไม่ใช่บทท่อง |
| 12 | One-Minute Review | ทบทวนใน 1 นาที |
| 13 | Memory Card | จำ 5 อย่าง + Keyword สั้น |

และทุก concept สำคัญจะถูกตอบด้วย **6 คำถามหลัก**:
มันคืออะไร → มีไว้ทำไม → ทำงานอย่างไร → ใช้เมื่อไร → ต่างจากของใกล้เคียงยังไง → พังแล้ว debug ยังไง

---

## 📚 สารบัญ

### ส่วนที่ 1 — รากฐาน (Foundation)

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 0 | Software Engineering Big Picture | [part-00](./part-00-big-picture.md) | Software, Application, Web/Mobile App, Frontend, Backend, Full-stack, Client, Server, Database, API, Network, Infrastructure, Request→Response, แผนที่ว่าแต่ละ technology อยู่ตรงไหน |
| 1 | Web Fundamentals | [part-01](./part-01-web-fundamentals.md) | HTTP/HTTPS, Request, Response, Header, Body, Query/Path Parameter, Cookie, Session, HTTP Methods (GET/POST/PUT/PATCH/DELETE), Status Code 2xx–5xx, 401 vs 403, PUT vs PATCH, URL, Domain, DNS, IP, Port, REST API, Resource, Endpoint, API Contract, Stateless |
| 2 | JavaScript Fundamental Concept | [part-02](./part-02-javascript.md) | Runtime, Call Stack, Heap, Event Loop, Callback, Promise, async/await, Microtask/Macrotask, Sync/Async, Mutable/Immutable, Reference/Value, Scope, Closure, Error Handling, Blocking vs Non-blocking, Concurrency vs Parallelism |

### ส่วนที่ 2 — Frontend

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 3 | React | [part-03](./part-03-react.md) | Component, Component Tree, Props, State, Event, Render/Re-render, Virtual DOM, DOM, Reconciliation, Hooks (useState/useEffect/useRef/useMemo/useCallback/useContext), Lifecycle, Controlled/Uncontrolled, Lifting State Up, Prop Drilling, Context, Local/Global/Server State, Redux/Zustand/TanStack Query, Performance, Key, Error Boundary, Forms, **React Interview Trap** |
| 4 | Next.js | [part-04](./part-04-nextjs.md) | Framework vs Library, App Router, Routing/Nested/Dynamic Route, Layout, Server Component vs Client Component, CSR/SSR/SSG/ISR, Hydration & Hydration Error, Data Fetching, Caching, Revalidation, Middleware, Route Handler, Metadata/SEO, Image Optimization, Server Action, Environment Variables, Security, **Server Component ≠ SSR** |
| 12 | React Native | [part-12](./part-12-react-native.md) | React vs React Native, RN vs Native App, DOM vs Native UI, Navigation (Stack/Tab/Modal), Native Module, Bridge / New Architecture, Camera/Location/Bluetooth, Permission, App Lifecycle, Deep Link/Universal Link, Push Notification, Storage, FlatList, Mobile Performance, Build & Release |

### ส่วนที่ 3 — Backend

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 5 | Node.js | [part-05](./part-05-nodejs.md) | Node.js ≠ ภาษา, Runtime, V8, libuv, Event Loop, I/O, Non-blocking, Thread/Worker Thread, CPU-bound vs I/O-bound, Process, Memory, Streams, Buffer, Environment Variable, npm, package.json, Event Loop Blocking, Memory Leak |
| 6 | Express | [part-06](./part-06-express.md) | Request Lifecycle, Middleware, Route, Controller, Service, Repository, Validation, Error Handling, Central Error Handler, Auth Middleware, REST API Design, Folder Architecture |
| 7 | Authentication & Security | [part-07](./part-07-auth-security.md) | Authentication vs Authorization, Session, Cookie, JWT, Access/Refresh Token, OAuth2, SSO, RBAC, Password Hashing, Salt, HTTPS/TLS, CORS, CSRF, XSS, SQL/NoSQL Injection, Rate Limiting, Brute Force, Input Validation, Sanitization, Secret Management, HttpOnly/Secure/SameSite, Login Flow |
| 8 | Database | [part-08](./part-08-database.md) | SQL vs NoSQL, PostgreSQL/MySQL/MongoDB, Table/Row/Column, Document/Collection, Primary/Foreign Key, Relationship, JOIN, Index, Query, N+1, Pagination (Offset/Cursor), Transaction, ACID, Isolation, Race Condition, Lock (Optimistic/Pessimistic), Connection Pool, Normalization, Replication |
| 9 | Java Fundamentals | [part-09](./part-09-java.md) | JVM/JDK/JRE, Compile, Bytecode, Static Typing, OOP 4 Pillars, Class/Object, Interface vs Abstract Class, Exception, Garbage Collection, Thread, Concurrency, Collection (List/Set/Map), Stack vs Heap, Java vs JavaScript, Java vs Python |
| 10 | Spring / Spring Boot | [part-10](./part-10-spring-boot.md) | Spring vs Spring Boot, IoC, Dependency Injection, Bean, Component, Controller/Service/Repository, Entity vs DTO, JPA/Hibernate, ORM, Spring Security, Configuration, Auto Configuration, Actuator, Request Flow, Express vs Spring Boot |
| 11 | Python | [part-11](./part-11-python.md) | Dynamic Typing, Interpreter, List/Tuple/Dict/Set, Module/Package, pip, Virtual Environment, Exception, Generator, Iterator, Asyncio, GIL, FastAPI/Django/Flask, Python vs Java, Python vs Node.js |

### ส่วนที่ 4 — Infrastructure & Delivery

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 13 | Docker | [part-13](./part-13-docker.md) | Container, Image, Dockerfile, Build/Run, Registry, Docker Hub, Volume, Network, Port Mapping, Environment Variable, Docker Compose, Docker vs VM, **Image ≠ Container** |
| 14 | Kubernetes | [part-14](./part-14-kubernetes.md) | Container Orchestration, Cluster/Node/Pod/Container, Deployment, ReplicaSet, Service, Ingress, ConfigMap/Secret, Namespace, Auto Scaling, Self Healing, Rolling Update/Rollback, Health Check, Liveness/Readiness Probe, Load Balancing, Docker vs Kubernetes |
| 15 | CI/CD | [part-15](./part-15-cicd.md) | CI, CD, Pipeline, Build/Lint/Test, Artifact, Docker Build, Registry, Deployment, Environment (Dev/Staging/Prod), Rollback, Blue-Green, Canary, Full Flow จาก git push → production |

### ส่วนที่ 5 — คิดแบบ Senior

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 16 | Advanced Backend | [part-16](./part-16-advanced-backend.md) | Caching, Redis, Cache Aside, Cache Invalidation, TTL, Queue, Message Broker, RabbitMQ/Kafka, Worker, Background Job, WebSocket, Polling/Long Polling, Load Balancer, Reverse Proxy, API Gateway, CDN, Horizontal/Vertical Scaling, Stateless/Stateful, Monolith/Modular Monolith/Microservices, Distributed System, Idempotency, Retry, Timeout, Exponential Backoff, Circuit Breaker, Rate Limiting, Event Driven, Eventual Consistency |
| 17 | Software Architecture | [part-17](./part-17-architecture.md) | Layered Architecture, MVC, Clean Architecture, Controller/Service/Repository, Separation of Concerns, SOLID, DRY/KISS/YAGNI, Coupling/Cohesion, Dependency, Dependency Injection, Technical Debt, Refactoring, Design Pattern (Factory/Strategy/Observer/Adapter/Repository) |
| 18 | Testing | [part-18](./part-18-testing.md) | Testing Pyramid, Unit/Integration/E2E, Mock/Stub/Spy, Test Case, Happy Path/Edge Case/Negative Case, Regression, Smoke, Load/Stress Test, Frontend/Backend/API Testing, QA vs Developer Testing |
| 19 | Git | [part-19](./part-19-git.md) | Git Mental Model, Repository, Commit, Branch, Merge vs Rebase, Pull Request, Conflict, Revert/Reset, Cherry Pick, Git Flow, Trunk Based Development, **Scenario: push bug ขึ้น production แล้วทำยังไง** |
| 20 | Debugging | [part-20](./part-20-debugging.md) | **Debugging Framework หลักของเล่ม** (Reproduce → Expected → Actual → Locate → Evidence → Hypothesis → Test → Root Cause → Fix → Regression Test → Monitor) + 10 scenario จริง |
| 21 | Problem Solving | [part-21](./part-21-problem-solving.md) | Process การแก้โจทย์, Data Structure (Array/String/HashMap/Set/Stack/Queue/Linked List/Tree/Graph), Pattern (Two Pointer, Sliding Window, Binary Search, Prefix Sum, Hashing, DFS, BFS, Recursion, Greedy, DP), Big O |
| 22 | Performance | [part-22](./part-22-performance.md) | Frontend (Network/Rendering/Re-render/Bundle/Image/Lazy Loading/Code Splitting), Backend (CPU/Memory/I/O/Database), Database (Query/Index/N+1/Connection Pool), Infrastructure (Scaling/Load Balancer/Cache), **Measure Before Optimize** |
| 23 | Observability | [part-23](./part-23-observability.md) | Logs, Metrics, Tracing, Monitoring vs Observability, Latency, Throughput, Error Rate, CPU/Memory, Request ID/Trace ID, APM, Health Check, Incident, Postmortem |
| 24 | System Design Fundamentals | [part-24](./part-24-system-design.md) | จาก User → LB → Backend → Cache → DB แล้วค่อยเพิ่ม CDN/API Gateway/Queue/Worker/Object Storage/WebSocket + 12 ขั้นตอนการคิด System Design |

### ส่วนที่ 6 — Data & Analytics

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 31 | SQL in Practice | [part-31](./part-31-sql-in-practice.md) | Logical Query Order, Aggregate, GROUP BY/HAVING, Grain, NULL, JOIN & Fan-out, Semi/Anti Join, CTE, Window Function, Dedup, Top-N per Group, Gaps & Islands, Data Quality Check, EXPLAIN |
| 32 | NoSQL | [part-32](./part-32-nosql.md) | Document, Key-value, Wide-column, Graph, Search Engine, Query-first Design, Embed vs Reference, Partition Key, Hot Partition, Consistency, CAP/PACELC, Polyglot Persistence |
| 33 | Data Analysis | [part-33](./part-33-data-analysis.md) | Metric Definition, North Star/Input/Guardrail, Event Tracking, Funnel, Cohort & Retention, Segmentation, Correlation vs Causation, Simpson's Paradox, A/B Testing, Decision Memo |
| 34 | Data Modeling | [part-34](./part-34-data-modeling.md) | OLTP vs OLAP, Grain, Fact/Dimension, Star vs Snowflake, SCD, ETL vs ELT, Warehouse/Lake/Lakehouse, Layered Model, Data Contract, Lineage, Data Quality Test |

### ส่วนที่ 7 — Applied AI

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 35 | LLM Foundations | [part-35](./part-35-llm-foundations.md) | Token, Context Window, Temperature, System/User Message, Prompt as Spec, Few-shot, Structured Output, Tool Calling, Hallucination, Eval, Prompt Injection |
| 36 | RAG | [part-36](./part-36-rag.md) | Indexing/Query Pipeline, Chunking, Embedding, Vector DB, Hybrid Search, Rerank, Permission-aware Retrieval, Grounding & Citation, RAG Eval, RAG vs Fine-tuning |
| 37 | AI Agents | [part-37](./part-37-ai-agents.md) | Agent Loop, Workflow vs Agent, Tool Design, Agent Patterns, Memory, Multi-agent, MCP, Guardrails, Human-in-the-loop, Indirect Prompt Injection, Agent Eval |
| 38 | Token & AI Ops | [part-38](./part-38-ai-ops.md) | Token Billing, Cost Estimation, Latency/TTFT, Streaming, Prompt Caching, Model Routing, Fallback, Rate Limit, Budget Guard, LLM Observability, Prompt Versioning, PII |
| 39 | Model Guide | [part-39](./part-39-model-guide.md) | Model Tiers, Selection Criteria, Reasoning Mode, OpenAI/Claude/Gemini/Open-weight, Model Bake-off, Provider Abstraction, Migration Checklist, Self-hosting |

### ส่วนที่ 8 — โหมดสัมภาษณ์ (อ่านก่อนเข้าห้อง)

| PART | ชื่อ | ไฟล์ | เนื้อหาหลัก |
|---|---|---|---|
| 25 | Interview Mode | [part-25](./part-25-interview-mode.md) | คำถามแยก 🟢 Junior / 🟡 Mid / 🔴 Senior ทุกหมวด พร้อม Expected Concept, Short Answer, Mid-level Answer, Common Wrong Answer, Follow-up |
| 26 | HR Technical Vocabulary | [part-26](./part-26-hr-vocabulary.md) | ศัพท์ที่ HR / Technical Interviewer พูด: Scalable, Maintainable, Reliable, Fault Tolerant, Highly Available, Loosely Coupled, Idempotent, Latency, Throughput, Bottleneck, Race Condition, Memory Leak, Technical Debt, Legacy Code, Regression, Root Cause, Hotfix, Rollback ฯลฯ พร้อมตัวอย่างประโยคใช้จริง |
| 27 | Master Comparison Table | [part-27](./part-27-comparison.md) | ตารางเทียบใหญ่ 25+ คู่ที่มักถูกถาม |
| 28 | Master Memory Map | [part-28](./part-28-memory-map.md) | ภาพรวมทั้งหมดเป็น diagram เดียว + อธิบายว่าแต่ละ technology เชื่อมกันอย่างไร |
| 29 | Final Keyword Cheat Sheet | [part-29](./part-29-keyword-cheatsheet.md) | Keyword 200+ คำ: `Keyword \| จำสั้นๆ \| หมวด` |
| 30 | Last 30 Minutes Before Interview | [part-30](./part-30-last-30-minutes.md) | Top 50 Keywords, Top 20 Questions, Top 10 ของทุกหมวด — อ่านจบใน 30 นาที |

---

## 🗺️ แนะนำลำดับการอ่าน

| สถานการณ์ | อ่านอะไร |
|---|---|
| มีเวลา 2 สัปดาห์ | PART 0 → 30 ตามลำดับ วันละ 2 PART (PART 31–39 อ่านต่อเมื่อพร้อม) |
| มีเวลา 3 วัน | PART 0, 1, 2, 3, 4, 5, 6, 7, 8, 20, 27, 29 |
| มีเวลา 1 วัน | PART 0, 20, 25, 27, 28, 29 |
| เหลือ 30 นาที | PART 30 อย่างเดียว |
| สัมภาษณ์ Frontend | PART 0–4, 12, 18, 20, 22, 25, 27 |
| สัมภาษณ์ Full-stack | PART 0–8, 13–17, 20, 24, 25, 27 |
| สัมภาษณ์กับ HR (ไม่ใช่ dev) | PART 26 + PART 29 |
| สาย Data / Analytics | PART 8, 31–34, 22 |
| ทำ feature AI / LLM | PART 35–39, 23 |

---

## ✅ กฎที่หนังสือเล่มนี้ยึด

1. ไม่ท่อง syntax — code มีเฉพาะ pseudocode สั้นมาก
2. เน้น **Why** และ **How** มากกว่า What
3. ทุก concept ใหญ่มี ภาพจำ + flow + example + interview question + common mistake
4. เทียบ technology ที่มักสับสนเสมอ
5. บอก **trade-off** เสมอ — ไม่มีคำว่า "A ดีกว่า B" แบบไม่มี context
6. เน้น production thinking / debugging thinking / problem solving / mental model

---

*เขียนในรูปแบบ "Senior Engineer ติว Developer ก่อนสัมภาษณ์" — อ่านเพื่อเข้าใจ ไม่ใช่เพื่อท่อง*
