# PART 32 — NOSQL

> ตำแหน่งในภาพใหญ่: Data Layer ฝั่ง "ไม่ใช่ตาราง" — ต่อยอดจาก PART 8 (Database) เมื่อข้อมูลโตเกินเครื่องเดียว หรือรูปร่างของการอ่านไม่เข้ากับ JOIN คุณจะเจอ database ตระกูล Document · Key-value · Graph · Wide-column · Search ที่แลก "ความยืดหยุ่นในการถาม" กับ "ความเร็วและการ scale ตาม access pattern ที่รู้ล่วงหน้า"

---

## 1. Big Picture

PART 8 สอนไว้แล้วว่า SQL vs NoSQL ต่างกันยังไงในระดับภาพรวม (schema แน่น vs ยืดหยุ่น, JOIN vs embed) — บทนี้จะไม่ทวนซ้ำ แต่จะลงไปตอบคำถามที่ PART 8 ทิ้งไว้:

- NoSQL **เกิดมาเพราะอะไร** ถ้า PostgreSQL ก็ดีอยู่แล้ว
- คำว่า "NoSQL" จริง ๆ มี **กี่ตระกูล** แต่ละตระกูลเก่งอะไร
- ออกแบบข้อมูลใน NoSQL **ต่างจาก SQL ตรงไหน** (ตรงนี้คือจุดที่คนพังเยอะที่สุด)
- เมื่อข้อมูลกระจายอยู่หลายเครื่อง **ความถูกต้องหายไปไหน** — consistency, CAP, quorum

### NoSQL เกิดมาเพราะอะไร

ช่วงปี 2005–2010 บริษัทอย่าง Google, Amazon, Facebook เจอปัญหาเดียวกัน:

```
ข้อมูลโตเกินเครื่องเดียว
        ↓
Relational DB scale แบบ vertical (ซื้อเครื่องใหญ่ขึ้น) ได้ถึงจุดหนึ่งแล้วตัน
        ↓
แบ่งข้อมูลไปหลายเครื่อง (sharding) → JOIN ข้ามเครื่อง + transaction ข้ามเครื่อง = ช้าและยากมาก
        ↓
"ถ้าเราตัด JOIN กับ transaction ข้ามเครื่องทิ้งไปเลย แล้วออกแบบให้ทุก query วิ่งไปเครื่องเดียว ล่ะ?"
        ↓
Bigtable (Google), Dynamo (Amazon) → ต้นตระกูลของ NoSQL ยุคใหม่
```

> **ให้มองภาพนี้ว่า** "NoSQL ไม่ได้เกิดเพราะ SQL ไม่ดี แต่เกิดเพราะบางบริษัทยอม 'ถามได้น้อยลง' เพื่อแลกกับ 'เก็บได้ไม่จำกัดและตอบเร็วคงที่' — มันคือการตัดความสามารถออก ไม่ใช่การเพิ่ม"

### ทุกอย่างในบทนี้ตอบ 3 คำถาม

| คำถาม | เรื่องที่ต้องเรียน |
|---|---|
| **1. เก็บแบบไหน** | Document, Key-value, Wide-column, Graph, Search, Time-series |
| **2. ออกแบบยังไง** | Query-first design, Embed vs Reference, Denormalization, Partition key, Hot partition, Secondary index, Single-table design |
| **3. ถูกต้องแค่ไหน** | Replication, Strong vs Eventual, Read-your-writes, Quorum, CAP, PACELC, Transaction limits |

### กฎทองของบทนี้

> **SQL: ออกแบบจาก "ข้อมูลคืออะไร" แล้วค่อยถามอะไรก็ได้ทีหลัง**
> **NoSQL: ออกแบบจาก "จะถามอะไร" แล้วเก็บข้อมูลให้ตอบคำถามนั้นได้ในการอ่านครั้งเดียว**

ถ้าจำได้แค่ประโยคนี้ประโยคเดียว คุณก็ตอบคำถาม NoSQL ในห้องสัมภาษณ์ได้เกินครึ่งแล้ว

---

## 2. Keywords

### 2.1 ตระกูลของ NoSQL

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| NoSQL | database ที่ไม่ได้ใช้โมเดลตาราง + JOIN เป็นหลัก | "Not only SQL" ไม่ใช่ "ห้าม SQL" |
| Document Store | เก็บข้อมูลเป็นก้อน JSON ทั้งก้อน | MongoDB, Firestore, Couchbase |
| Key-value Store | ให้ key มา ได้ value กลับไป แค่นั้น | Redis, DynamoDB, Memcached |
| Wide-column Store | ตารางที่แต่ละ partition มีแถวเรียงกันยาว ๆ | Cassandra, ScyllaDB, HBase, Bigtable |
| Graph Database | เก็บ "ความสัมพันธ์" เป็นพลเมืองชั้นหนึ่ง | Neo4j, Amazon Neptune |
| Node / Edge | จุด / เส้นเชื่อมในกราฟ | คน = node, "เป็นเพื่อน" = edge |
| Traversal | เดินตามเส้นในกราฟ | "เพื่อนของเพื่อนของฉัน" |
| Search Engine | database ที่เก่งเรื่องค้นข้อความ | Elasticsearch, OpenSearch |
| Inverted Index | สารบัญคำ → เอกสารที่มีคำนั้น | ดัชนีท้ายเล่มของหนังสือ |
| Analyzer | ตัวตัดคำ + แปลงคำก่อนเข้า index | "Running" → "run" |
| Time-series DB | เก็บค่าที่วัดตามเวลา | InfluxDB, TimescaleDB, Prometheus |

### 2.2 การออกแบบข้อมูล (Modeling)

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Access Pattern | รายการ "คำถาม" ที่ระบบจะถาม database | เขียนออกมาก่อน schema เสมอ |
| Query-first Design | ออกแบบ schema จากคำถาม ไม่ใช่จาก entity | ตรงข้ามกับ normalization |
| Embedding | เอาข้อมูลลูกยัดไว้ใน document แม่ | อ่านครั้งเดียวได้ครบ |
| Referencing | เก็บแค่ id แล้วไปดึงแยก | เหมือน FK แต่ไม่มีใครบังคับ |
| Denormalization | ตั้งใจเก็บข้อมูลซ้ำหลายที่ | อ่านเร็ว แต่ต้องตามแก้ทุกที่ |
| Fan-out on Write | ตอนเขียน ก๊อปไปหลายที่ล่วงหน้า | เขียนหนัก อ่านเบา |
| Unbounded Array | array ที่โตได้ไม่มีเพดาน | ระเบิดเวลาของ document |
| Single-table Design | ยัดทุก entity ไว้ตารางเดียว (DynamoDB) | PK/SK แบบ `USER#1` |
| Schema Evolution | การเปลี่ยนรูปร่างข้อมูลเมื่อเวลาผ่านไป | schemaless ≠ ไม่ต้อง migrate |
| Schema Version Field | field บอกว่า document นี้รุ่นไหน | `schemaVersion: 3` |
| TTL (Time To Live) | ให้ข้อมูลหมดอายุแล้วลบเอง | session, OTP, cache |

### 2.3 การกระจายข้อมูล (Distribution)

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Partition / Shard | ข้อมูลส่วนหนึ่งที่ถูกแบ่งไปเครื่องหนึ่ง | ชิ้นพิซซ่า |
| Partition Key / Shard Key | ค่าที่ใช้ตัดสินว่าข้อมูลไปอยู่เครื่องไหน | เลือกผิด = ย้ายยากมาก |
| Sort Key / Clustering Key | ลำดับของข้อมูลภายใน partition เดียวกัน | ใช้ทำ range query |
| Hash Partitioning | เอา key ไป hash แล้วกระจาย | กระจายดี แต่ range query ข้าม key ไม่ได้ |
| Hot Partition | partition เดียวโดนหนักกว่าคนอื่นมาก | คอขวดของทั้งระบบ |
| Secondary Index | index บน field ที่ไม่ใช่ partition key | GSI/LSI ใน DynamoDB |
| Scatter-Gather | query ที่ต้องถามทุก shard แล้วรวมผล | ช้าและแพงตามจำนวน shard |
| Replication Factor (N) | จำนวนสำเนาของข้อมูลแต่ละชิ้น | ปกติ 3 |
| Leader / Follower | เครื่องที่รับเขียน / เครื่องที่ก๊อปตาม | = Primary / Replica |
| Leaderless | ใครก็รับเขียนได้ (Dynamo-style) | Cassandra, ScyllaDB, Riak (ตัวบริการ DynamoDB ใช้ leader ต่อ partition) |

### 2.4 ความถูกต้อง (Consistency)

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Strong Consistency | อ่านเมื่อไรก็ได้ค่าล่าสุดเสมอ | เหมือนมีเครื่องเดียว |
| Eventual Consistency | สุดท้ายจะตรงกัน แต่ระหว่างนี้อาจเห็นค่าเก่า | "เดี๋ยวก็ตรง" |
| Read-your-writes | อย่างน้อยคนเขียนต้องเห็นของที่ตัวเองเขียน | กด save แล้วต้องเห็น |
| Quorum | เสียงข้างมากของสำเนา | R + W > N |
| Tunable Consistency | เลือกความถูกต้องได้ทีละ query | ONE / QUORUM / ALL |
| CAP Theorem | ตอน network ขาด ต้องเลือก C หรือ A | ไม่ใช่เลือก 2 จาก 3 ตามใจ |
| PACELC | ตอนปกติก็ต้องเลือก Latency หรือ Consistency | CAP ฉบับสมบูรณ์ |
| Network Partition | เครื่องในคลัสเตอร์คุยกันไม่ได้ | ไม่ใช่ "partition" ของข้อมูล |
| Polyglot Persistence | ใช้หลาย database ตามงาน | เครื่องมือถูกกับงาน |

---

## 3. Mental Model

### Model 1 — SQL คือ "ห้องสมุด" / NoSQL คือ "ตู้จดหมายที่ติดชื่อไว้แล้ว"

**ห้องสมุด (SQL):** หนังสือจัดเรียงตามหมวดอย่างเป็นระเบียบ ใครจะถามอะไรก็ได้ — "หนังสือทุกเล่มของผู้แต่งคนนี้ที่พิมพ์หลังปี 2010" บรรณารักษ์ (query planner) จะหาให้ แต่ยิ่งคำถามซับซ้อนยิ่งใช้เวลา

**ตู้จดหมาย (NoSQL):** ทุกช่องติดชื่อไว้แล้ว และ **ในช่องมีของครบที่เจ้าของช่องต้องใช้** เดินไปเปิดช่องเดียวจบ เร็วมาก เร็วเท่าเดิมไม่ว่าตึกจะมีกี่ชั้น — แต่ถ้าวันหนึ่งมีคนถามว่า "จดหมายทุกฉบับที่ส่งมาจากเชียงใหม่" คุณต้องเปิดทุกช่อง

> **ให้มองภาพนี้ว่า** "SQL เก่งตอบคำถามที่ยังไม่มีใครคิดออก NoSQL เก่งตอบคำถามที่รู้อยู่แล้วว่าจะถาม — เลือกผิดข้างเมื่อไร คุณจะรู้สึกว่า database ตัวนั้นแย่ ทั้งที่มันแค่ถูกใช้ผิดงาน"

### Model 2 — ทุกอย่างวนกลับมาที่ "partition key"

เมื่อข้อมูลอยู่หลายเครื่อง คำถามแรกของทุก read/write คือ **"ข้อมูลนี้อยู่เครื่องไหน"**

```
query มาพร้อม partition key?
   ├── ใช่  → ไปเครื่องเดียวตรง ๆ         = เร็ว คงที่ scale ได้ไม่จำกัด
   └── ไม่  → ต้องถามทุกเครื่อง (scatter)  = ช้า แพง ยิ่ง cluster ใหญ่ยิ่งแย่
```

นี่คือเหตุผลที่ Senior ถามเรื่อง partition key ก่อนเรื่องอื่นเสมอ — มันคือการตัดสินใจที่ **แก้ยากที่สุด** ในทั้งระบบ

### Model 3 — ข้อมูลกระจาย = ต้องเลือกว่าจะ "รอ" หรือ "ตอบเลย"

มีสำเนา 3 ชุดอยู่ 3 เครื่อง ตอนเขียน/อ่าน คุณมีสองทาง:

- **รอให้ทุกคน (หรือเสียงข้างมาก) ตอบรับ** → ถูกต้อง แต่ช้า และถ้าบางเครื่องติดต่อไม่ได้อาจต้องปฏิเสธ request
- **ตอบเลยจากเครื่องที่ใกล้ที่สุด** → เร็ว ทนเครื่องพังได้ แต่อาจได้ข้อมูลเก่า

ทุกเรื่อง consistency ในบทนี้ (CAP, PACELC, quorum, eventual) คือการ **ตั้งชื่อให้กับการเลือกข้อนี้** เท่านั้น

### Model 4 — "Schemaless" แปลว่า schema ย้ายบ้าน ไม่ใช่หายไป

Database ไม่บังคับ schema → **โค้ดของคุณต้องเป็นคนบังคับ** ทุก service ที่อ่านข้อมูลนี้ต้องรู้ว่า document หน้าตาแบบไหน ถ้ามี 5 รูปแบบปนกัน โค้ดทุกจุดต้องรับมือทั้ง 5 แบบ (PART 8 เตือนเรื่องนี้ไว้แล้ว — บทนี้จะสอนวิธีจัดการใน section 5.9)

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำ:
Document Store   = แฟ้มลูกค้า 1 แฟ้ม ใส่ทุกอย่างของลูกค้าคนนั้นไว้ในแฟ้มเดียว
Key-value Store  = ตู้ล็อกเกอร์ มีเบอร์ตู้ = key, ของในตู้ = value (ไม่สนว่าข้างในคืออะไร)
Wide-column      = สมุดบัญชีแยกเล่มต่อลูกค้า แต่ละเล่มเขียนเรียงตามวันที่ยาวไปเรื่อย ๆ
Graph DB         = กระดานสืบสวนในหนังตำรวจ รูปคนติดหมุด โยงกันด้วยเชือกแดง
Search Engine    = ดัชนีท้ายเล่ม: คำ → หน้าที่มีคำนั้น
Time-series      = กราฟชีพจรในโรงพยาบาล ค่าใหม่มาทุกวินาที ของเก่าบีบอัดทิ้งได้
Partition Key    = เลขตู้ ที่บอกว่าของอยู่ตึกไหน
Hot Partition    = ตู้ที่ทุกคนมารุมเปิดพร้อมกัน ส่วนตู้อื่นว่าง
Replication      = สำเนาแฟ้มที่สาขาอื่น
Eventual         = ข่าวลือ สุดท้ายทุกคนจะรู้ แต่ไม่ได้รู้พร้อมกัน
Quorum           = ประชุมที่ต้องมีเสียงข้างมากถึงจะนับมติ
TTL              = นมกล่องที่มีวันหมดอายุ ถึงเวลาก็ทิ้งเอง
```

### ภาพจำเจาะลึก: Embed vs Reference = "แฟ้มเดียว" vs "แฟ้มที่แปะโน้ตให้ไปหาแฟ้มอื่น"

```
Embed (ใส่ในแฟ้มเดียว)             Reference (แปะโน้ตชี้ไป)
┌─────────────────────┐           ┌────────────────┐     ┌──────────────┐
│ Order #555          │           │ Order #555     │     │ Customer #42 │
│  customer: สมชาย    │           │  customerId:42 │ ──→ │  name: สมชาย │
│  items: [ ... ]     │           │  itemIds:[...] │     └──────────────┘
│  address: ...       │           └────────────────┘
└─────────────────────┘
เปิดแฟ้มเดียวได้ครบ                  ต้องเปิด 2 แฟ้ม แต่ข้อมูลลูกค้าอยู่ที่เดียว
```

> **ให้มองภาพนี้ว่า** "Embed คือการถ่ายเอกสารข้อมูลลูกค้าใส่ทุกแฟ้ม order — อ่านสะดวก แต่ถ้าลูกค้าย้ายบ้าน คุณต้องไล่แก้ทุกแฟ้ม Reference คือแปะโน้ตว่าไปดูแฟ้มลูกค้า — แก้ที่เดียว แต่ต้องเดินไปเปิดอีกแฟ้มทุกครั้ง"

### ภาพจำเจาะลึก: CAP = "สาขาสองแห่งที่โทรศัพท์ขาด"

```
ธนาคารมี 2 สาขา ปกติโทรคุยกันตลอดเพื่ออัปเดตยอดเงิน
วันหนึ่งสายโทรศัพท์ขาด (network partition) ลูกค้ามาถอนเงินที่สาขา A

ทางเลือก C (Consistency): "ขอโทษค่ะ ติดต่อสาขา B ไม่ได้ ถอนไม่ได้ตอนนี้"   → ถูกต้อง แต่ไม่ให้บริการ
ทางเลือก A (Availability): "ได้ค่ะ ถอนเลย เดี๋ยวค่อยไปกระทบยอดทีหลัง"       → ให้บริการ แต่อาจถอนเกิน
```

**สายไม่ขาด = ไม่ต้องเลือก** — CAP บังคับให้เลือกเฉพาะตอนมี partition เท่านั้น (ซึ่ง PACELC จะมาเติมส่วนที่เหลือ)

---

## 5. How It Works

### 5.1 Document Store (MongoDB)

หน่วยข้อมูลคือ **document** (JSON/BSON) อยู่ใน **collection** — ส่วนนี้ PART 8 พูดไว้แล้ว สิ่งที่ต้องเพิ่มคือ "ทำไมมันเร็ว":

```json
{
  "_id": "order_555",
  "customer": { "id": 42, "name": "สมชาย" },
  "items": [
    { "sku": "A1", "qty": 2, "price": 150 },
    { "sku": "B7", "qty": 1, "price": 990 }
  ],
  "status": "paid"
}
```

- อ่าน order นี้ = **disk read ก้อนเดียว** ไม่มี JOIN 3 ตาราง
- index ได้ทั้ง field ปกติและ field ใน nested/array (`items.sku`)
- scale ด้วย **sharding ตาม shard key** + replica set (primary 1 ตัว secondary หลายตัว)

**ขอบเขตที่ต้องรู้:**

| ข้อจำกัด | ความหมายในงานจริง |
|---|---|
| document ใหญ่สุด 16 MB | array ที่โตไม่หยุด (comment ทั้งหมดของ post) จะชนเพดานนี้สักวัน |
| `$lookup` ทำ JOIN ได้แต่ไม่ใช่จุดแข็ง | ถ้าต้อง `$lookup` ทุก query แปลว่าออกแบบผิดตระกูล |
| atomic ต่อ document เดียวเสมอ | แก้หลาย field ใน document เดียว = ปลอดภัยโดยไม่ต้องมี transaction |
| multi-document transaction มีแล้ว | แต่ช้ากว่าและมีข้อจำกัดเวลา — ใช้เป็นทางหนีไฟ ไม่ใช่ทางหลัก |

> **ให้มองภาพนี้ว่า** "ใน document store 'หน่วยของความ atomic' กับ 'หน่วยของการอ่าน' คือก้อนเดียวกัน — ออกแบบให้ของที่ต้องเปลี่ยนพร้อมกันอยู่ใน document เดียวกัน แล้วคุณจะแทบไม่ต้องใช้ transaction"

### 5.2 Key-value Store (Redis, DynamoDB)

โมเดลที่ง่ายที่สุด: `GET key` → value, `PUT key value`

**Redis** (PART 16 ใช้เป็น cache ไปแล้ว) — มุมที่ต้องเพิ่มในบทนี้คือ "Redis ในฐานะ database":

| ประเด็น | สาระ |
|---|---|
| เก็บใน memory | เร็วระดับ sub-millisecond แต่ข้อมูลใหญ่ได้เท่า RAM (แพง) |
| มี data structure | String, Hash, List, Set, Sorted Set, Stream — ไม่ใช่แค่ string |
| persistence | RDB (snapshot เป็นช่วง) / AOF (log ทุกคำสั่ง) — ตั้งผิดแล้วไฟดับ = หายหลายวินาทีถึงหลายนาที |
| รันคำสั่งทีละคำสั่ง | คำสั่งเดี่ยวเป็น atomic เสมอ (`INCR` ไม่มี race) แต่คำสั่งช้าตัวเดียว (`KEYS *`) บล็อกทุกคน |
| Redis Cluster | แบ่ง key เป็น 16,384 slot กระจายไปหลาย node — คำสั่งที่แตะหลาย key ต้องอยู่ slot เดียวกัน (ใช้ hash tag `{user:42}`) |

**DynamoDB** — key-value + document ที่ AWS ดูแลให้ทั้งหมด:

```
Table: Orders
┌──────────────────┬───────────────────────────┬──────────────┐
│ Partition Key    │ Sort Key                  │ attributes   │
├──────────────────┼───────────────────────────┼──────────────┤
│ CUSTOMER#42      │ ORDER#2026-09-01#555      │ total: 1290  │
│ CUSTOMER#42      │ ORDER#2026-09-15#601      │ total: 300   │
│ CUSTOMER#77      │ ORDER#2026-09-02#560      │ total: 80    │
└──────────────────┴───────────────────────────┴──────────────┘
      ↑ ตัดสินว่าอยู่ partition ไหน       ↑ เรียงลำดับภายใน partition
```

- `Query` = ต้องระบุ partition key เสมอ แล้วกรองช่วงด้วย sort key ได้ (`begins_with`, `between`)
- `Scan` = อ่านทั้งตาราง — แพงและช้า ในงาน production ถือว่าเป็นกลิ่นของการออกแบบผิด
- item ใหญ่สุด 400 KB, แต่ละ partition มีเพดาน throughput ของตัวเอง (นี่คือที่มาของ hot partition)

### 5.3 Wide-column Store (Cassandra)

ชื่อ "wide-column" ทำให้งง ให้มองแบบนี้แทน: **ตารางที่ถูก hash กระจายตาม partition key และข้างใน partition เรียงแถวตาม clustering key**

```
PRIMARY KEY ((sensor_id), reading_time)
               ↑ partition     ↑ clustering (เรียงในก้อน)

node 1: sensor_A → [09:00, 09:01, 09:02, 09:03 ...]   ← อ่านช่วงเวลาได้เร็วมาก
node 2: sensor_B → [09:00, 09:01, ...]
node 3: sensor_C → [...]
```

| จุดเด่น | ราคาที่จ่าย |
|---|---|
| **เขียนเร็วมาก** (append ลง log + memtable แล้ว flush เป็นไฟล์ — โครงสร้าง LSM tree) | อ่านต้องรวมหลายไฟล์ ต้องมี compaction คอยรวมไฟล์เบื้องหลัง |
| leaderless — node ไหนก็รับเขียนได้ ไม่มีจุดตายจุดเดียว | consistency ต้องตั้งเองทีละ query |
| scale แนวนอนแบบเกือบเป็นเส้นตรง เพิ่ม node = เพิ่ม capacity | ไม่มี JOIN, ไม่มี ad-hoc query — **1 query pattern = 1 table** |
| multi-datacenter ในตัว | การลบสร้าง **tombstone** ที่ทำให้อ่านช้าถ้าลบเยอะ |

> **ให้มองภาพนี้ว่า** "Cassandra คือสายพานโรงงานที่รับของเข้าได้ไม่หยุด แต่คุณต้องบอกล่วงหน้าว่าจะหยิบของออกแบบไหน เพราะมันจัดของไว้ตามวิธีหยิบ ไม่ใช่ตามชนิดของ"

### 5.4 Graph Database (Neo4j)

**Property graph** = node (มี label + property) + edge/relationship (มี type + ทิศทาง + property)

```
 (สมชาย:User) ──[:FOLLOWS]──→ (สมหญิง:User) ──[:FOLLOWS]──→ (มานี:User)
       │                            │
  [:PURCHASED]                 [:PURCHASED]
       ↓                            ↓
 (กล้อง:Product) ←─[:SIMILAR_TO]─ (เลนส์:Product)
```

Cypher (ภาษา query ของ Neo4j) อ่านเหมือนวาดรูป:

```
MATCH (me:User {id: 1})-[:FOLLOWS]->()-[:FOLLOWS]->(fof) RETURN DISTINCT fof
```

แปล: "หาคนที่เพื่อนของฉันติดตาม" (friend-of-friend)

**ทำไม graph ชนะ SQL ในงานแบบนี้:**

```
SQL: หาเพื่อน 4 ชั้น = self-JOIN ตาราง follows 4 ครั้ง
     แต่ละ JOIN ต้องไปค้น index ของตารางทั้งตาราง → ยิ่งตารางใหญ่ยิ่งช้า

Graph: node แต่ละตัวถือ "pointer ไปหาเพื่อนบ้าน" ของมันเอง (index-free adjacency)
       เดิน 4 ก้าว = ตามลูกศร 4 ครั้ง → ต้นทุนขึ้นกับจำนวนเส้นที่เดินผ่าน ไม่ใช่ขนาดของทั้งกราฟ
```

**Graph ชนะเมื่อ:**

| สัญญาณ | ตัวอย่าง |
|---|---|
| คำถามมีคำว่า "เชื่อมกันกี่ชั้น" / "เส้นทาง" | friend-of-friend, shortest path, org chart ลึกไม่รู้จบ |
| ความสัมพันธ์สำคัญกว่าตัวข้อมูล | fraud detection (บัญชีที่ใช้เบอร์/อุปกรณ์เดียวกันเป็นวง) |
| ความลึกของการ traverse ไม่แน่นอน | recommendation "คนที่ซื้อสิ่งนี้ ซื้ออะไรต่อ" |
| schema ของความสัมพันธ์เปลี่ยนบ่อย | knowledge graph, permission graph |

**Graph แพ้เมื่อ:** ต้อง aggregate ทั้ง dataset (ยอดขายรวมรายเดือน), ข้อมูลเป็นตารางธรรมดา, ต้องการ write throughput สูงมาก หรือกราฟใหญ่จน shard ยาก (การตัดกราฟเป็นหลายเครื่องโดยไม่ให้เส้นข้ามเครื่องเยอะ เป็นปัญหาที่ยากมาก)

### 5.5 Search Engine (Elasticsearch)

หัวใจคือ **inverted index**:

```
เอกสาร:
  doc1: "รองเท้าวิ่ง Nike สีดำ"
  doc2: "รองเท้าหนัง สีดำ"
  doc3: "เสื้อวิ่ง Nike"

                ↓ analyzer (ตัดคำ, ตัวพิมพ์เล็ก, ตัดรากศัพท์)

Inverted Index:
  "รองเท้า" → [doc1, doc2]
  "วิ่ง"     → [doc1, doc3]
  "nike"    → [doc1, doc3]
  "สีดำ"    → [doc1, doc2]

ค้น "วิ่ง nike" → intersect [doc1, doc3] ∩ [doc1, doc3] → doc1, doc3 แล้วจัดอันดับด้วย relevance score
```

> **ให้มองภาพนี้ว่า** "B-Tree index ของ SQL คือสารบัญที่ถามว่า 'แถวนี้มีค่าอะไร' ส่วน inverted index คือดัชนีท้ายเล่มที่ถามกลับว่า 'คำนี้อยู่แถวไหนบ้าง' — นี่คือเหตุผลที่ `LIKE '%วิ่ง%'` ใน SQL ช้า แต่ search engine ตอบได้ทันที"

**สิ่งที่ต้องรู้ก่อนใช้จริง:**

| ประเด็น | ความจริง |
|---|---|
| Near real-time | เขียนแล้วค้นเจอหลัง refresh (~1 วินาที) ไม่ใช่ทันที |
| **ไม่ควรเป็น source of truth** | ใช้เป็น "สำเนาที่ค้นเก่ง" ของ DB หลัก sync ผ่าน CDC / queue |
| ภาษาไทยไม่มีช่องว่างระหว่างคำ | ต้องใช้ analyzer ที่ตัดคำไทยได้ ไม่งั้นค้นไม่เจอ |
| จำนวน primary shard ต้องคิดตั้งแต่สร้าง index | เปลี่ยนทีหลังต้อง reindex / split |
| mapping explosion | ปล่อยให้ field ใหม่ถูกสร้างอัตโนมัติไม่จำกัด → cluster memory บวม |

### 5.6 Time-series DB (สั้น ๆ)

ข้อมูลรูปแบบ `(metric, tags, timestamp, value)` ที่ **เขียนต่อท้ายตลอด แทบไม่แก้ย้อนหลัง** และถามเป็น **ช่วงเวลา** เสมอ

| เทคนิค | ทำเพื่อ |
|---|---|
| เก็บเรียงตามเวลา + บีบอัดค่าที่ใกล้กัน | ประหยัดพื้นที่ได้หลายเท่า |
| Downsampling | ข้อมูลเก่ากว่า 30 วัน เก็บแค่ค่าเฉลี่ยรายชั่วโมง |
| Retention policy | ข้อมูลเก่ากว่า X ลบทิ้งทั้งก้อน (ถูกกว่าลบทีละแถว) |

ตัวอย่าง: Prometheus (metrics ใน PART 23), InfluxDB, TimescaleDB (เป็น extension ของ PostgreSQL — แปลว่าบางครั้งคุณไม่ต้องออกจาก SQL เลย)

### 5.7 Partition Key, Hot Partition และ Secondary Index

**Partition key ที่ดี = cardinality สูง + กระจายโหลดเท่า ๆ กัน + อยู่ในทุก query หลัก**

| Partition key | ดีไหม | เพราะ |
|---|---|---|
| `user_id` | ✔ ส่วนใหญ่ดี | ค่ามีเยอะ โหลดกระจาย และ query ส่วนใหญ่ถามต่อ user |
| `country` | ✘ | ค่ามีน้อย ประเทศไทยก้อนเดียวใหญ่กว่าประเทศอื่นรวมกัน |
| `created_date` | ✘ | ทุก write วันนี้ลงก้อนเดียว = hot partition ตลอดวัน |
| `status` | ✘ | 3–4 ค่า และ `pending` ถูกแก้บ่อยสุด |
| `tenant_id` (SaaS) | ⚠ | ดีจนมีลูกค้ารายใหญ่ 1 ราย ที่ใหญ่กว่าคนอื่นร้อยเท่า |

**Hot partition เกิดขึ้นยังไง:**

```
        [partition A] ██
        [partition B] ██
        [partition C] ████████████████████████  ← ดาราดังโพสต์ / flash sale สินค้าเดียว
        [partition D] ██

ทั้งระบบรับโหลดได้ 4 เท่า แต่ C ตันก่อน → request ที่ไป C ถูก throttle ทั้งที่เครื่องอื่นว่าง
```

**วิธีแก้:**

| วิธี | ทำยังไง | ราคาที่จ่าย |
|---|---|---|
| Write sharding (salting) | ต่อท้าย key ด้วยเลขสุ่ม `item#123#0..9` | อ่านต้องถาม 10 ก้อนแล้วรวม |
| Cache ข้างหน้า | ของที่อ่านหนัก ๆ เก็บใน Redis/CDN | ข้อมูลเก่าได้ (PART 16) |
| Aggregate ก่อนเขียน | นับ like ใน memory/queue แล้วเขียนรวมทุก 1 วินาที | ตัวเลขช้ากว่าความจริงเล็กน้อย |
| เปลี่ยน partition key | ออกแบบใหม่ | ต้อง migrate ข้อมูลทั้งหมด — แพงที่สุด |

**Secondary Index — ถามด้วย field อื่นที่ไม่ใช่ partition key**

```
Local index (อยู่ใน shard เดียวกับข้อมูล)
   → เขียนเร็ว แต่ query ด้วย field นี้ต้องถามทุก shard (scatter-gather)

Global index (ตัว index เองถูก partition ด้วย field ใหม่)
   → query เร็ว ไปเครื่องเดียว แต่ index อัปเดตแบบ async = eventual consistency
```

ใน DynamoDB: **GSI** (Global Secondary Index) อ่านได้แค่ eventually consistent, **LSI** (Local) ต้องสร้างตอนสร้างตารางเท่านั้นและใช้ partition key เดิม
ทุก index = **เขียนเพิ่มอีกรอบ = จ่ายเงินเพิ่มอีกรอบ** — หลักเดียวกับ PART 8 แต่ใน cloud คุณเห็นมันในบิลทุกเดือน

### 5.8 Single-table Design (DynamoDB — ระดับ advanced)

แนวคิด: เพราะ DynamoDB ไม่มี JOIN ถ้าอยากได้ "customer + orders ทั้งหมดของเขา" ใน request เดียว → **เอาทั้งคู่ไปไว้ใน partition เดียวกัน**

```
PK              SK                        ข้อมูล
─────────────   ───────────────────────   ─────────────────────
CUSTOMER#42     PROFILE                   name, email
CUSTOMER#42     ORDER#2026-09-01#555      total, status
CUSTOMER#42     ORDER#2026-09-15#601      total, status
ORDER#555       ITEM#A1                   qty, price
ORDER#555       ITEM#B7                   qty, price

Query PK = CUSTOMER#42                      → ได้ profile + ทุก order ในครั้งเดียว
Query PK = CUSTOMER#42, SK begins_with ORDER#2026-09 → order เดือนกันยายน
```

- key ถูก "overload" — ความหมายของ PK/SK ขึ้นกับ prefix
- GSI ก็ overload ได้ (`GSI1PK`, `GSI1SK`) เพื่อรองรับ access pattern ที่ 2, 3, 4

| ได้อะไร | เสียอะไร |
|---|---|
| ทุก access pattern หลักเป็น `Query` ครั้งเดียว latency คงที่ | ตารางอ่านไม่ออกถ้าไม่มีเอกสารประกอบ — คนใหม่ในทีมงงแน่นอน |
| จำนวน request และค่าใช้จ่ายต่ำ | **เพิ่ม access pattern ใหม่ยาก** — บางครั้งต้อง backfill ทั้งตาราง |
| ข้อมูลที่อ่านด้วยกันอยู่ด้วยกัน | analytics / report ทำแทบไม่ได้ ต้อง export ไป warehouse |

> **ให้มองภาพนี้ว่า** "Single-table design คือการ 'pre-JOIN' ข้อมูลไว้ตั้งแต่ตอนเขียน — คุณจ่ายความซับซ้อนตอนออกแบบ เพื่อแลกกับการอ่านที่ถูกและเร็วตลอดไป คุ้มเมื่อ access pattern นิ่งแล้ว ไม่คุ้มตอน product ยังเปลี่ยนทุกสัปดาห์"

### 5.9 Schema Evolution ในที่ที่ไม่มี schema

ไม่มี `ALTER TABLE` แต่คุณยังต้องเปลี่ยนรูปร่างข้อมูล — ทางที่ใช้ได้จริง:

```
1. ใส่ schemaVersion ในทุก document       { "schemaVersion": 2, ... }
        ↓
2. โค้ดอ่านได้ทุกเวอร์ชันที่ยังมีอยู่        if v1 → แปลงเป็น v2 ในหน่วยความจำ
        ↓
3. Lazy migration                         อ่านเจอ v1 → เขียนกลับเป็น v2 เลย
        ↓
4. Backfill job ทีละ batch                ไล่แปลงของที่ไม่มีใครแตะ
        ↓
5. เมื่อไม่เหลือ v1 → ลบโค้ดอ่าน v1 ทิ้ง
```

**กฎเพิ่มเติม:**

- เพิ่ม field ใหม่ = ปลอดภัย (ของเก่าไม่มี → ใส่ default ตอนอ่าน)
- **เปลี่ยนชื่อ / เปลี่ยนความหมาย field = อันตราย** ทำแบบ expand → migrate → contract (เพิ่มตัวใหม่ เขียนทั้งสองตัว ย้ายคนอ่าน แล้วค่อยลบตัวเก่า)
- ใช้ validation ช่วย: MongoDB มี `$jsonSchema` validator, หรือ validate ที่ชั้น app ด้วย Zod/Joi ก่อนเขียนเสมอ

### 5.10 Replication, Consistency และ Quorum

PART 8 อธิบาย replication แบบ primary/replica กับ replication lag ไว้แล้ว NoSQL หลายตัวไปไกลกว่านั้นด้วย **leaderless + quorum**:

```
N = 3 สำเนา          W = ต้องมีกี่ตัวตอบรับตอนเขียน     R = ต้องถามกี่ตัวตอนอ่าน

เขียน W=2:  [node1 ✔ v2] [node2 ✔ v2] [node3 ✘ ยังเป็น v1]
อ่าน  R=2:  ถาม node2 + node3 → ได้ v2 กับ v1 → เลือกตัวใหม่กว่า = v2 ✔

R + W > N  (2 + 2 > 3)  → ชุดที่อ่านกับชุดที่เขียน "ต้องทับกันอย่างน้อย 1 ตัว" → เห็นค่าล่าสุด
```

> **ให้มองภาพนี้ว่า** "ถ้าคนเขียนบอกเสียงข้างมาก และคนอ่านก็ถามเสียงข้างมาก ยังไงสองกลุ่มนี้ต้องมีคนซ้ำกันอย่างน้อยหนึ่งคนที่รู้เรื่องล่าสุด"

| การตั้งค่า | ได้อะไร | เสียอะไร |
|---|---|---|
| W=1, R=1 | เร็วที่สุด ทนเครื่องพังดีสุด | อ่านค่าเก่าได้ง่าย (eventual) |
| W=QUORUM, R=QUORUM | เห็นค่าล่าสุดในกรณีปกติ | latency สูงขึ้น, ถ้าเครื่องตายเกินครึ่ง = ใช้งานไม่ได้ |
| W=ALL | ทุกสำเนาตรงกันแน่นอน | เครื่องเดียวตาย = เขียนไม่ได้เลย |

**ระดับ consistency ที่ต้องแยกให้ออก:**

| ระดับ | สัญญาอะไร | ตัวอย่างที่ต้องการ |
|---|---|---|
| Strong | ทุกคนเห็นค่าล่าสุดเหมือนมีเครื่องเดียว | ยอดเงิน, stock, username ห้ามซ้ำ |
| Read-your-writes | คนเขียนเห็นของตัวเองแน่ ๆ คนอื่นช้าได้ | แก้โปรไฟล์แล้วกลับมาหน้าเดิม |
| Monotonic reads | ไม่ย้อนเวลา — เห็น v2 แล้วจะไม่กลับไปเห็น v1 | กด refresh แล้ว comment ไม่หายไปโผล่ใหม่ |
| Eventual | สุดท้ายจะตรงกัน | จำนวน like, view count, feed |

(PART 16 เทียบ Strong vs Eventual ไว้ในมุม distributed system — ในบทนี้คือมุมว่า "database ตั้งค่ายังไง")

### 5.11 CAP และ PACELC ในภาษาคน

**CAP:** เมื่อเกิด **P**artition (network ระหว่าง node ขาด) ระบบต้องเลือกระหว่าง
- **C**onsistency — ปฏิเสธ request ดีกว่าตอบผิด
- **A**vailability — ตอบเสมอ ถึงข้อมูลอาจเก่า

**ความเข้าใจผิดที่เจอบ่อยที่สุด:** "เลือก 2 จาก 3" — ในระบบกระจายจริง network ขาดได้เสมอ **P ไม่ใช่ทางเลือก** คำถามจริงคือ "ตอนมันขาด คุณจะยอมเสีย C หรือเสีย A"

**PACELC** เติมส่วนที่ CAP ไม่พูด:

```
if (Partition)  → เลือก Availability  หรือ Consistency
else (ปกติ)     → เลือก Latency       หรือ Consistency
```

> **ให้มองภาพนี้ว่า** "CAP พูดถึงวันที่ฟ้าผ่า ซึ่งเกิดไม่บ่อย PACELC พูดถึงทุกวันปกติ — แม้ network ดี การรอให้ทุกสำเนาตรงกันก็ยังทำให้ช้าลงทุก request"

| ระบบ | ตอน Partition | ตอนปกติ | หมายเหตุ |
|---|---|---|---|
| Cassandra / DynamoDB (ค่า default) | A | L | ปรับให้เอน C ได้ด้วย quorum / strong read |
| MongoDB (write concern majority) | C | C | primary หายชั่วคราวระหว่าง election → เขียนไม่ได้ |
| PostgreSQL เครื่องเดียว + sync replica | C | C | ช้ากว่าแต่ถูกต้อง |

**อย่าท่องตารางนี้** — หลายระบบปรับได้ทีละ query ให้ตอบว่า "มันขึ้นกับการตั้งค่า" แล้วอธิบายว่าตั้งอะไร

### 5.12 Transaction ใน NoSQL และข้อจำกัด

| ระบบ | ทำได้แค่ไหน |
|---|---|
| ทุกตัว | atomic ต่อ **1 document / 1 item / 1 partition** เกือบเสมอ |
| MongoDB | multi-document ACID transaction ได้ (ข้าม shard ได้) แต่ช้ากว่า, มี time limit, และเพิ่มโอกาส conflict |
| DynamoDB | `TransactWriteItems` รวมหลาย item ได้ (มีเพดานจำนวน item) ราคาเป็น 2 เท่าของการเขียนปกติ |
| Cassandra | Lightweight Transaction (compare-and-set ผ่าน Paxos) ต่อ partition เดียว — ช้ากว่าเขียนปกติหลายเท่า |
| Redis | `MULTI/EXEC` รันต่อกันไม่ถูกแทรก แต่ **ไม่มี rollback** ถ้าคำสั่งกลางทางผิด / ใช้ Lua script เพื่อ atomic จริง |

**หลักคิด:** ถ้าออกแบบแล้วต้องใช้ transaction ข้ามหลาย document ทุก request → สัญญาณว่า **embed ผิด** หรือ **ควรใช้ SQL**
ทางออกอื่นเมื่อต้องข้าม boundary: **conditional write** (optimistic lock แบบ PART 8), **idempotency key**, หรือ **saga** (PART 16)

### 5.13 TTL — ให้ database ลบของเอง

| ระบบ | พฤติกรรมที่ต้องรู้ |
|---|---|
| Redis `EXPIRE` / `PEXPIRE` | แม่นระดับมิลลิวินาที ลบทั้งแบบ lazy (ตอนมีคนอ่าน) และสุ่มลบเบื้องหลัง |
| MongoDB TTL index | background job วิ่งทุก ~60 วินาที → หมดอายุแล้วยังเห็นได้สักพัก |
| DynamoDB TTL | ลบเบื้องหลังภายในหลักวัน และไม่เสียค่า write — **ห้ามพึ่งเพื่อความปลอดภัย** ต้องกรอง `expiresAt` ตอนอ่านเองด้วย |
| Cassandra TTL | หมดอายุ = สร้าง tombstone → TTL เยอะ ๆ ทำให้อ่านช้าได้ |

ใช้กับ: session, OTP, rate limit counter, cache, idempotency key, ข้อมูลที่กฎหมายกำหนดให้ลบ (แต่ต้องยืนยันว่าลบจริงตามเวลา)

---

## 6. Example — ออกแบบ NoSQL จาก access pattern จริง

### 6.1 Query-first design: ระบบสั่งอาหาร

**ขั้นที่ 1 — เขียน access pattern ออกมาก่อน (ห้ามข้าม)**

| # | Access pattern | ความถี่ |
|---|---|---|
| AP1 | ดูรายละเอียด order 1 ใบ (พร้อมรายการอาหาร) | สูงมาก |
| AP2 | ดู order ล่าสุดของลูกค้า 1 คน เรียงตามเวลา | สูง |
| AP3 | ร้านดู order ที่ status = `pending` ของร้านตัวเอง | สูง, ต้องสด |
| AP4 | admin ดูยอดขายรวมรายวันทุกร้าน | ต่ำ, ช้าได้ |

**ขั้นที่ 2 — ออกแบบให้แต่ละ pattern เป็นการอ่านครั้งเดียว**

```
AP1 → document order ที่ embed items ไว้ข้างใน (items อ่านพร้อม order เสมอ และมีจำนวนจำกัด)
AP2 → partition key = customerId, sort key = createdAt   (หรือ index {customerId, createdAt} ใน MongoDB)
AP3 → secondary index {restaurantId, status}   — ต้องสด → อ่านจาก primary / strong read
AP4 → ไม่ทำใน DB หลัก! ส่ง event ไป data warehouse / ตารางสรุปที่ worker คำนวณทุกคืน
```

> **ให้มองภาพนี้ว่า** "ขั้นแรกของการออกแบบ NoSQL ไม่ใช่การวาด ER diagram แต่คือการเขียนรายการคำถามพร้อมความถี่ — ตารางนี้คือ spec ที่สำคัญที่สุดของทั้งระบบ"

สังเกต AP4: **คำถามที่ไม่ตรงกับ access pattern หลัก ไม่ควรบังคับให้ NoSQL ตอบ** — ย้ายไปที่อื่นที่เก่งเรื่องนั้น

### 6.2 Embed หรือ Reference — ใช้คำถาม 4 ข้อนี้

| คำถาม | ถ้าใช่ → | ตัวอย่าง |
|---|---|---|
| อ่านด้วยกันเกือบทุกครั้งไหม | Embed | order + items |
| ลูกมีจำนวน **จำกัด** ไหม (ไม่โตไม่หยุด) | Embed | address ของ user (ไม่กี่อัน) |
| ลูกถูกแก้ **แยกจากแม่** บ่อยไหม | Reference | comment ของ post ที่ like/แก้ไขได้ |
| ลูกถูกแชร์ **หลายแม่** ไหม | Reference | product ที่อยู่ในหลายพัน order |

**ทางกลางที่ใช้บ่อยที่สุด — Extended reference:** เก็บ id + field ที่อ่านบ่อยและไม่ค่อยเปลี่ยน

```json
{ "_id": "order_555", "customer": { "id": 42, "name": "สมชาย" }, "items": [ ... ] }
```

ได้ชื่อลูกค้าโดยไม่ต้องดึงเพิ่ม และยังมี id ไว้ดึงรายละเอียดเต็มเมื่อต้องการ
**แต่ต้องตัดสินใจล่วงหน้า:** ถ้าลูกค้าเปลี่ยนชื่อ order เก่าต้องเปลี่ยนตามไหม? (ส่วนใหญ่ **ไม่ควร** — เหมือน `price_at_purchase` ใน PART 8 หัวข้อ 6.1)

**Anti-pattern คลาสสิก — Unbounded array:**

```
post document:
  comments: [ c1, c2, c3, ..., c250000 ]   ← post ไวรัล
```

ผล: document ใหญ่ขึ้นทุก comment → ทุกการอ่าน post ลาก comment ทั้งหมดมาด้วย → สุดท้ายชนเพดาน 16 MB
แก้: แยก collection `comments` (reference ด้วย `postId`) + embed แค่ `commentCount` และ 3 comment ล่าสุดไว้ใน post (pattern ชื่อ **subset**)

### 6.3 ราคาของ Denormalization — ตามแก้ให้ครบ

**สถานการณ์:** ชื่อร้านอาหารถูก denormalize ไปอยู่ใน 2 ล้าน order document และใน search index
วันหนึ่งร้านเปลี่ยนชื่อ

```
[restaurants] อัปเดตชื่อ
        ↓ ปล่อย event "RestaurantRenamed"
[queue]
        ↓
[worker] ไล่ update order ที่ยัง active ทีละ batch   ← ตัดสินใจ: order ที่จบแล้วไม่แก้ (เป็นประวัติ)
[worker] reindex ใน Elasticsearch
```

| ต้นทุนที่ต้องยอมรับ | ความหมาย |
|---|---|
| Write amplification | การแก้ 1 ครั้งกลายเป็นการเขียนหลักล้านครั้ง |
| ช่วงที่ข้อมูลไม่ตรงกัน | ระหว่าง worker ยังทำไม่เสร็จ บางหน้าเห็นชื่อเก่า บางหน้าเห็นชื่อใหม่ |
| ต้องมีเจ้าของ | ถ้าไม่มีใครรู้ว่าข้อมูลนี้ถูกก๊อปไปกี่ที่ วันหนึ่งจะมีที่ที่ลืมแก้ |
| ต้องมี reconciliation job | คอยไล่เช็คว่าสำเนาทุกที่ยังตรงกับต้นฉบับ |

**กฎที่ใช้ตัดสิน:** denormalize เฉพาะข้อมูลที่ **อ่านบ่อยมาก แต่เปลี่ยนน้อยมาก** — ชื่อร้าน ✔ / จำนวน stock ที่เปลี่ยนทุกวินาที ✘

### 6.4 Hot partition ในชีวิตจริง — ระบบนับ like

**โจทย์:** ศิลปินดังโพสต์ 1 ภาพ มีคนกด like 50,000 ครั้งต่อวินาที เก็บ counter ไว้ใน DynamoDB ที่ `PK = POST#999`

```
50,000 writes/s → partition เดียว → เพดาน throughput ของ partition → ThrottlingException
```

**แนวทางแก้ (เรียงตามความซับซ้อน):**

1. **Redis `INCR` ข้างหน้า** แล้ว flush ยอดรวมลง DynamoDB ทุก 1–5 วินาที → เร็วมาก แต่ถ้า Redis ล่มก่อน flush ยอดหายบางส่วน
2. **Write sharding:** เขียนไป `POST#999#0` ถึง `POST#999#19` แบบสุ่ม → อ่านยอดรวม = query 20 ก้อนแล้วบวก (หรือมี worker รวมไว้ให้)
3. **เก็บการ like เป็น event ลง stream** (PART 16: Kafka) แล้ว aggregate → ถูกต้องสุด ช้าสุด

**ประเด็นที่ต้องพูด:** จำนวน like **ไม่ต้อง strong consistency** — ผู้ใช้ไม่รู้หรอกว่ามัน 50,214 หรือ 50,230 การยอม eventual ตรงนี้คือสิ่งที่ทำให้ระบบรอด

### 6.5 Graph ในงานจริง — ตรวจจับบัญชีโกง

**โจทย์:** หาบัญชีที่ "เชื่อมโยงกัน" ผ่านเบอร์โทร / อุปกรณ์ / บัตรเครดิตเดียวกัน ไม่เกิน 3 ขั้น

```
(บัญชี A)─[:USES]→(อุปกรณ์ X)←[:USES]─(บัญชี B)─[:HAS_PHONE]→(เบอร์ 08x)←[:HAS_PHONE]─(บัญชี C)
```

- ใน SQL: self-JOIN หลายรอบผ่านตารางกลางหลายตาราง ความลึกไม่แน่นอน → query ยาวและช้าลงแรงเมื่อลึกขึ้น
- ใน Graph: `MATCH (a:Account {id:$id})-[*2..6]-(other:Account) RETURN DISTINCT other` (เชื่อมผ่านสิ่งกลาง 1 ขั้น = 2 เส้น → 3 ขั้น = สูงสุด 6 เส้น) → เดินตามเส้นเฉพาะที่เกี่ยวข้อง

**แต่อย่าย้ายทั้งระบบไป graph:** ข้อมูลบัญชี/ธุรกรรมหลักยังอยู่ใน SQL, graph เก็บเฉพาะ "ความสัมพันธ์" ที่ sync มา → นี่คือ **polyglot persistence**

### 6.6 Polyglot Persistence — หนึ่งระบบหลาย database

```
                       [APP / SERVICES]
        ┌─────────────┬──────┴──────┬──────────────┬──────────────┐
        ↓             ↓             ↓              ↓              ↓
  [PostgreSQL]    [Redis]     [Elasticsearch]   [Neo4j]     [Time-series]
  order, เงิน     session,      ค้นหาเมนู/ร้าน    แนะนำ/fraud    metrics
  source of truth cache, rate     (สำเนา)         (สำเนา)       ของระบบ
        │
        └──── CDC / event ────→ sync ไปยังสำเนาทั้งหมด
```

| ได้ | เสีย |
|---|---|
| แต่ละงานได้เครื่องมือที่เก่งที่สุด | ทีมต้องดูแล/monitor/backup หลายระบบ |
| scale แต่ละส่วนแยกกันได้ | ข้อมูลหลายสำเนา = ต้องจัดการ sync และความไม่ตรงกัน |
| | on-call ต้องรู้จักทุกตัว |

**หลักของ Senior:** "เริ่มจาก database เดียวให้นานที่สุด เพิ่มตัวใหม่เมื่อมีปัญหาที่วัดได้ และต้องบอกได้เสมอว่า **ตัวไหนคือ source of truth**"

---

## 7. Compare

### 7.1 ตระกูล NoSQL เทียบกันทีละมิติ

| ประเด็น | Document | Key-value | Wide-column | Graph | Search |
|---|---|---|---|---|---|
| ตัวอย่าง | MongoDB | Redis, DynamoDB | Cassandra | Neo4j | Elasticsearch |
| หน่วยข้อมูล | JSON document | key → value | partition → แถวเรียงกัน | node + edge | document + inverted index |
| ถามแบบไหนเก่ง | อ่าน/เขียนก้อนทั้งก้อน, query field ภายใน | lookup ด้วย key ตรง ๆ | write หนัก + range ตามเวลาภายใน partition | ความสัมพันธ์หลายชั้น | full-text, relevance, filter หลายมิติ |
| ถามแบบไหนแย่ | JOIN หลาย collection | อะไรก็ตามที่ไม่ใช่ key | ad-hoc query, JOIN | aggregate ทั้ง dataset | เป็น source of truth, transaction |
| use case | catalog, profile, CMS | cache, session, cart, counter | IoT, log, message history | social, recommendation, fraud | search box, log analytics |

### 7.2 Embed vs Reference

| ประเด็น | Embed | Reference |
|---|---|---|
| จำนวนการอ่าน | 1 ครั้ง | 2+ ครั้ง (หรือ `$lookup`) |
| Atomic update แม่+ลูก | ได้ฟรี | ต้องใช้ transaction |
| ข้อมูลซ้ำ | มี ถ้าลูกถูกแชร์ | ไม่มี |
| ขนาด document | โตตามลูก — ระวังเพดาน | คงที่ |
| เหมาะเมื่อ | อ่านด้วยกัน, ลูกจำกัด, ไม่แชร์ | ลูกโตไม่หยุด, แก้แยก, แชร์หลายที่ |

### 7.3 Strong vs Eventual vs Read-your-writes

| ประเด็น | Strong | Read-your-writes | Eventual |
|---|---|---|---|
| ใครเห็นค่าล่าสุด | ทุกคน ทันที | อย่างน้อยคนที่เขียน | ทุกคน... สักพัก |
| Latency | สูงสุด | กลาง | ต่ำสุด |
| ทนเครื่องพัง | น้อยสุด | กลาง | มากสุด |
| ใช้กับ | เงิน, stock, unique | โปรไฟล์, setting, draft | like, view, feed, analytics |

### 7.4 CAP vs PACELC

| ประเด็น | CAP | PACELC |
|---|---|---|
| พูดถึงช่วงไหน | ตอน network partition เท่านั้น | ทั้งตอน partition และตอนปกติ |
| trade-off | C vs A | (C vs A) + (L vs C) |
| จุดอ่อน | ไม่บอกอะไรเลยเกี่ยวกับ 99.9% ของเวลาที่ระบบปกติ | ละเอียดกว่า แต่ก็ยังเป็นแค่การจัดกลุ่มคร่าว ๆ |

### 7.5 คู่ที่สับสนบ่อย

| คู่ที่สับสน | ต่างกันตรงไหน |
|---|---|
| **Partition (ข้อมูล) vs Network Partition** | แบ่งข้อมูลไปหลายเครื่อง / network ระหว่างเครื่องขาด — ชื่อเหมือนกัน ความหมายคนละเรื่อง |
| **Partition key vs Primary key** | partition key บอก "อยู่เครื่องไหน" / primary key (PK+SK) บอก "คือ item ไหน" |
| **Sharding vs Replication** | แบ่งคนละส่วน (ช่วย write + ขนาด) / ก๊อปชุดเดิม (ช่วย read + ทนพัง) — ใช้คู่กันเสมอ |
| **GSI vs LSI** | partition ใหม่ + eventual + สร้างทีหลังได้ / partition เดิม + strong ได้ + ต้องสร้างตอนแรก |
| **Redis vs DynamoDB** | memory, เร็วสุด, ข้อมูลเท่า RAM / disk managed, ใหญ่ไม่จำกัด, ms หลักเดียว |
| **MongoDB vs PostgreSQL JSONB** | document-native + sharding ในตัว / SQL + JOIN + JSON ในตัวเดียว — ข้อมูลกึ่ง structured ขนาดกลาง JSONB มักพอ |
| **Elasticsearch vs DB index** | inverted index + relevance + near real-time / B-Tree + ค่าแน่นอน + ทันที |
| **TTL vs Cache eviction** | หมดเวลาแล้วลบ / ที่เต็มแล้วไล่ตัวที่ใช้น้อยออก (LRU) — ข้อมูลอาจหายก่อน TTL ถ้า memory เต็ม |

### 7.6 เมื่อไร **ไม่ควร** ใช้ NoSQL

| สัญญาณ | เพราะ |
|---|---|
| ยังไม่รู้ว่าจะ query อะไร / product ยังเปลี่ยนเร็ว | NoSQL ต้องรู้ access pattern ล่วงหน้า — SQL ยืดหยุ่นกว่าในเฟสนี้ |
| ข้อมูลเชื่อมกันเยอะ ต้อง JOIN หลายทาง | ต้อง denormalize ทุกทาง = หนี้มหาศาล |
| ต้องการ transaction ข้ามหลาย entity เป็นปกติ | การเงิน, บัญชี, การจอง — relational ทำได้ดีกว่ามาก |
| ต้องทำ report / ad-hoc analytics บ่อย | ส่วนใหญ่ต้อง export ออกไปทำที่อื่นอยู่ดี |
| ข้อมูลไม่ได้ใหญ่ขนาดนั้น | PostgreSQL เครื่องเดียวรับได้หลาย TB และหลายพัน QPS — "เผื่อ scale" ไม่ใช่เหตุผล |
| ทีมไม่มีใครเคยดูแลมัน | ต้นทุนการปฏิบัติงาน (backup, upgrade, tuning) คือต้นทุนจริง |

---

## 8. Common Mistakes

| # | สิ่งที่ Junior มักเข้าใจผิด | ความจริง |
|---|---|---|
| 1 | "NoSQL เร็วกว่า SQL" | เร็วกว่าเฉพาะ query ที่ตรงกับวิธีเก็บ — query ที่ไม่ตรงอาจช้ากว่า SQL หลายเท่า |
| 2 | "Schemaless เลยไม่ต้องออกแบบ" | ต้องออกแบบ **มากกว่า** SQL เพราะต้องรู้ access pattern ล่วงหน้า และ schema ไปอยู่ในโค้ดแทน |
| 3 | "ออกแบบ collection ตาม entity เหมือนตาราง SQL" | ได้ความยุ่งของ SQL (หลาย query ต่อหน้า) โดยไม่ได้ JOIN กับ FK มาช่วย — แย่ที่สุดทั้งสองโลก |
| 4 | "Embed ทุกอย่างไว้ใน document เดียว" | unbounded array โตจนชนเพดาน และทุกการอ่านลากข้อมูลไม่จำเป็นมาด้วย |
| 5 | "เลือก partition key ทีหลังก็ได้" | คือการตัดสินใจที่เปลี่ยนยากที่สุด — เปลี่ยน = ย้ายข้อมูลทั้งหมด |
| 6 | "ใช้ `created_date` / `status` เป็น partition key" | cardinality ต่ำหรือโหลดกระจุก = hot partition ตั้งแต่วันแรก |
| 7 | "Scan ทั้งตารางแล้วกรองในโค้ด ข้อมูลยังน้อยอยู่" | ใน DynamoDB จ่ายเงินตามที่อ่าน ไม่ใช่ตามที่ได้ — และข้อมูลจะไม่น้อยตลอดไป |
| 8 | "Secondary index สด เหมือน PK" | GSI / global index อัปเดตแบบ async — เขียนแล้วอ่านผ่าน index ทันทีอาจไม่เจอ |
| 9 | "CAP = เลือก 2 จาก 3" | P เลี่ยงไม่ได้ในระบบกระจาย — เลือก C หรือ A **เฉพาะตอนมี partition** |
| 10 | "Eventual consistency = ข้อมูลผิด" | แปลว่า "ช้า" ไม่ใช่ "ผิด" — แต่ต้องออกแบบ UX ให้รองรับช่วงที่ยังไม่ตรง |
| 11 | "MongoDB มี transaction แล้ว ใช้เหมือน PostgreSQL ได้เลย" | ได้ แต่ช้ากว่าและชนกันง่ายกว่า — ถ้าต้องใช้ทุก request แปลว่าออกแบบผิดหรือเลือก DB ผิด |
| 12 | "Redis `MULTI` คือ transaction ที่ rollback ได้" | ไม่มี rollback — คำสั่งที่ผ่านแล้วก็ผ่านไปแล้ว |
| 13 | "เอา Elasticsearch เป็น database หลักเลย" | ไม่ใช่ source of truth ที่ดี — ไม่มี transaction, refresh ไม่ทันที, reindex บ่อย |
| 14 | "ตั้ง TTL แล้วของหายตรงเวลาเป๊ะ" | หลายระบบลบเบื้องหลังแบบล่าช้า (Mongo ~1 นาที, DynamoDB หลักวัน) ต้องกรองตอนอ่านด้วย |
| 15 | "ใช้หลาย database ตั้งแต่วันแรกดูเป็นมืออาชีพ" | polyglot ที่ไม่มีเหตุผลรองรับ = ต้นทุน ops คูณจำนวน DB |
| 16 | "รับ query object จาก user ตรง ๆ ได้ เพราะไม่มี SQL injection" | มี **NoSQL injection** (`{"$gt": ""}`) — ดู PART 7 ต้อง validate type ทุก input |

---

## 9. Debugging

### 9.1 Framework: "NoSQL ช้า / throttle" ให้ไล่ตามลำดับนี้

```
1. ช้าทุก request หรือบาง key?          → บาง key = hot partition / hot key
        ↓                                 ทุก key = capacity / cluster / network
2. Query มี partition key ไหม?           → ไม่มี = scan / scatter-gather ทุก shard
        ↓
3. ใช้ index ถูกตัวไหม?                   → MongoDB: explain() ดู COLLSCAN vs IXSCAN
        ↓
4. document / item ใหญ่เกินไปไหม?         → อ่านก้อน 5 MB ทุกครั้งที่ต้องการ 1 field
        ↓
5. ดู metric ต่อ partition / shard        → โหลดเท่ากันไหม? มีตัวไหนแดงอยู่ตัวเดียว
        ↓
6. ดู consistency level ที่ใช้             → ใช้ ALL / strong โดยไม่จำเป็นไหม
        ↓
7. ดูงานเบื้องหลัง                        → compaction, rebalancing, index build, backup
```

> **ให้มองภาพนี้ว่า** "ใน NoSQL คำถามแรกไม่ใช่ 'query ช้าไหม' แต่คือ 'query นี้ไปกี่เครื่อง และเครื่องไหนเหนื่อยกว่าเพื่อน' — ปัญหาส่วนใหญ่คือการกระจายที่ไม่เท่ากัน ไม่ใช่เครื่องไม่แรงพอ"

### 9.2 ตารางอาการ → สาเหตุที่น่าสงสัยที่สุด

| อาการ | สงสัยอะไรก่อน | เช็คยังไง |
|---|---|---|
| Throttling ทั้งที่ capacity รวมยังเหลือ | **Hot partition** | ดู metric / contributor insights ว่า key ไหนโดนหนัก |
| query เร็วตอน dev ช้าตอน prod | **Scan / COLLSCAN** | `explain()` / ดูว่าใช้ `Scan` แทน `Query` |
| เขียนแล้วอ่านทันทีไม่เจอ | **อ่านจาก secondary / GSI / replica** | ดู read preference, consistency flag |
| ค้นใน search ไม่เจอของที่เพิ่งเพิ่ม | **refresh interval** / sync pipeline ช้า | ดู lag ของ CDC / queue ไป Elasticsearch |
| document โตเรื่อย ๆ จน write ช้าลง | **Unbounded array** | ดูขนาด document ใหญ่สุด / ค่าเฉลี่ย |
| Cassandra อ่านช้าหลังลบข้อมูลเยอะ | **Tombstone** | ดู tombstone warning ใน log |
| Redis ค้างทั้ง instance เป็นช่วง ๆ | **คำสั่ง O(N) ตัวใหญ่** (`KEYS *`, list ยาว) | slow log ของ Redis |
| Redis memory เต็ม key หายเอง | **eviction policy** | ดู `maxmemory` + policy + ใช้ TTL ถูกไหม |
| ข้อมูลเดียวกันไม่ตรงกันในสองหน้า | **denormalized copy ไม่ถูกอัปเดต** | หาว่าข้อมูลนี้ถูกก๊อปไปกี่ที่ + worker sync ล้มไหม |
| เขียนไม่ได้ช่วงสั้น ๆ แล้วกลับมาเอง | **leader election / failover** | ดู log ของ replica set / cluster ช่วงเวลานั้น |
| โค้ดพังเฉพาะบาง record | **schema หลายเวอร์ชันปนกัน** | ดูว่า record นั้นขาด field ไหน / schemaVersion เท่าไร |

### 9.3 เครื่องมือที่ต้องรู้จัก

| เครื่องมือ | ใช้ดูอะไร |
|---|---|
| MongoDB `explain("executionStats")` | ใช้ index ไหม (IXSCAN / COLLSCAN), docs examined vs returned |
| MongoDB profiler / slow query log | query ที่เกิน threshold |
| DynamoDB CloudWatch + Contributor Insights | throttle, consumed capacity, key ที่โดนหนักที่สุด |
| `nodetool` (Cassandra) | สถานะ node, compaction, tombstone |
| Redis `SLOWLOG`, `INFO`, `--bigkeys` | คำสั่งช้า, memory, key ใหญ่ผิดปกติ |
| Elasticsearch `_cat/shards`, `_explain` | shard กระจายเท่ากันไหม, ทำไม document นี้ได้ score นี้ |

---

## 10. Interview Questions

### 🟢 Junior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| NoSQL คืออะไร มีกี่แบบ | 4–5 ตระกูล + ตัวอย่าง + แต่ละตัวเก่งอะไร (ไม่ใช่แค่ "MongoDB") |
| MongoDB กับ Redis ต่างกันยังไง | document store บน disk ที่ query field ได้ / key-value ใน memory เน้นเร็ว |
| ทำไมถึงเลือก NoSQL แทน SQL | access pattern ชัด + scale แนวนอน + ข้อมูลรูปร่างยืดหยุ่น — **พร้อมบอกข้อเสีย** |
| Embed กับ Reference ต่างกันยังไง | อ่านครั้งเดียว vs ข้อมูลไม่ซ้ำ + ยกตัวอย่าง order/items |
| TTL คืออะไร ใช้ทำอะไร | ข้อมูลหมดอายุลบเอง + session/OTP/cache |
| Eventual consistency คืออะไร | สุดท้ายตรงกัน ระหว่างนี้อาจเห็นของเก่า + ตัวอย่าง like count |

### 🟡 Mid

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| ออกแบบ schema ใน NoSQL เริ่มจากอะไร | **เขียน access pattern ก่อน** + ความถี่ + ออกแบบให้แต่ละ pattern อ่านครั้งเดียว |
| เลือก partition key ยังไง | cardinality สูง + โหลดกระจาย + อยู่ในทุก query หลัก + ตัวอย่าง key ที่แย่ |
| Hot partition คืออะไร แก้ยังไง | อธิบายอาการ throttle ทั้งที่ capacity รวมเหลือ + write sharding / cache / aggregate พร้อมราคา |
| Denormalization มีราคาอะไร | write amplification + ช่วงไม่ตรงกัน + ต้องมีคนดูแลการ sync |
| Secondary index ใน DB กระจายทำงานยังไง | local = scatter-gather / global = query เร็วแต่ eventual |
| CAP คืออะไร | P เลี่ยงไม่ได้ + ตอน partition เลือก C หรือ A + ยกตัวอย่างธนาคารสองสาขา |
| Quorum คืออะไร | R + W > N แล้วทำไมถึงเห็นค่าล่าสุด + trade-off latency |
| Schemaless แล้วเปลี่ยน schema ยังไง | schemaVersion + อ่านได้หลายเวอร์ชัน + lazy migration + backfill + expand/contract |

### 🔴 Senior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| PACELC ต่างจาก CAP ยังไง ทำไมสำคัญกว่าในงานจริง | ตอนปกติก็ต้องแลก latency กับ consistency ทุก request + ยกตัวอย่างการตั้งค่า |
| ออกแบบ single-table ใน DynamoDB ให้ระบบ e-commerce | PK/SK overload, GSI overload, access pattern list + **บอกข้อเสีย**: เพิ่ม pattern ยาก, อ่านยาก, analytics ยาก |
| ระบบนับ like ของโพสต์ไวรัล 50k/s ออกแบบยังไง | hot key + Redis/sharded counter/stream + ยอม eventual อย่างมีเหตุผล |
| MongoDB มี transaction แล้ว ทำไมยังควรเลี่ยง | ช้ากว่า, conflict, time limit + ออกแบบ document boundary ให้ตรงกับ atomic boundary |
| เมื่อไรที่คุณจะ **ไม่** ใช้ NoSQL | access pattern ยังไม่นิ่ง, JOIN เยอะ, transaction ข้าม entity, ทีมไม่พร้อม ops, ข้อมูลไม่ได้ใหญ่ |
| Polyglot persistence ต้องระวังอะไร | source of truth ชัด, sync ผ่าน CDC/event, ความไม่ตรงกันระหว่างสำเนา, ต้นทุน ops |
| ต้องเปลี่ยน shard key ของระบบที่มีข้อมูล 5 TB ทำยังไง | dual-write / CDC ไปคลัสเตอร์ใหม่ → backfill → verify → สลับ read → สลับ write → มีแผน rollback |

---

## 11. Answer Like a Developer

### โครงตอบคำถาม NoSQL — 5 จังหวะ

```
1. Access pattern ก่อน          "ขอถามก่อนว่าระบบนี้อ่านแบบไหนบ่อยที่สุด..."
        ↓
2. เลือกตระกูลจาก pattern         "เพราะอ่านเป็นก้อนต่อ user เลยเหมาะกับ document / key-value"
        ↓
3. Partition key + โครงข้อมูล     "partition ด้วย userId, embed ส่วนที่อ่านพร้อมกัน"
        ↓
4. Consistency ที่ต้องการ          "ส่วนเงินต้อง strong ส่วน count ยอม eventual ได้"
        ↓
5. ราคาที่จ่าย + ทางหนี           "แลกกับ... ถ้าอนาคตต้อง report จะส่งไป warehouse"
```

> **ให้มองภาพนี้ว่า** "คำตอบ NoSQL ที่ดีเริ่มจากคำถาม ไม่ได้เริ่มจากชื่อ database — คนที่ตอบว่า 'ใช้ MongoDB ครับ' ในประโยคแรก คือคนที่ยังไม่ได้คิด"

### ตัวอย่างการตอบ: "ทำไมคุณถึงเลือก NoSQL"

**❌ คำตอบระดับท่องจำ:** "เพราะ NoSQL เร็วกว่าและ scale ได้ดีกว่าครับ"

**✅ คำตอบระดับที่อยากได้:**
> "ผมไม่ได้เริ่มจากว่าตัวไหนเร็วกว่าครับ ผมเริ่มจาก access pattern — ระบบ chat ของเราอ่านเกือบทั้งหมดเป็น 'ข้อความล่าสุด 50 ข้อความของห้องนี้' และเขียนหนักมากตอนคนใช้เยอะ
> ลักษณะนี้เข้ากับ wide-column อย่าง Cassandra (หรือ key-value อย่าง DynamoDB ที่ใช้ PK+SK แบบเดียวกัน) เพราะ partition ด้วย roomId แล้ว sort ด้วยเวลา อ่านครั้งเดียวได้เลย และ scale แนวนอนได้
> ส่วนที่ต้องยอมแลกคือเราถาม query แบบอื่นยาก เช่น 'ค้นข้อความทุกห้องที่มีคำนี้' เราเลยส่งสำเนาไป Elasticsearch แยก และข้อมูลบัญชีผู้ใช้กับการชำระเงินยังอยู่ใน PostgreSQL เพราะต้องการ transaction
> ความเสี่ยงที่ผมเฝ้าคือห้องที่ใหญ่มากจนเป็น hot partition ครับ ซึ่งเราแก้ด้วยการแบ่ง partition ตาม roomId + ช่วงวัน"

### ตัวอย่างการตอบ: "อธิบาย CAP ให้ฟังหน่อย"

> "CAP บอกว่าเวลา network ระหว่างเครื่องในระบบขาดกัน ระบบต้องเลือกว่าจะยังตอบ request ต่อแม้ข้อมูลอาจไม่ล่าสุด หรือจะปฏิเสธเพื่อไม่ให้ตอบผิด — ส่วน partition เองเลี่ยงไม่ได้ครับ มันเลยไม่ใช่การเลือก 2 จาก 3
> ในงานจริงผมคิดแบบ PACELC มากกว่า เพราะแม้ network ปกติ การรอให้ทุกสำเนายืนยันก็ทำให้ช้าลงทุก request
> เช่น ยอดเงินผมจะเลือก consistency แล้วยอมช้า แต่ view count ผมเลือก latency เพราะผิดไปนิดหน่อยไม่มีใครเสียหาย และ database หลายตัวให้เลือกได้ทีละ query ด้วย"

### คำพูดที่ทำให้ดูมีประสบการณ์

| สถานการณ์ | พูดแบบนี้ |
|---|---|
| ถูกถามให้ออกแบบ schema NoSQL | "ขอ list access pattern พร้อมความถี่ก่อนนะครับ เพราะ schema จะออกมาจากตรงนั้น" |
| ถูกถามว่า SQL หรือ NoSQL | "ถ้า access pattern ยังไม่นิ่ง ผมจะเริ่มจาก PostgreSQL ก่อน แล้วย้ายเฉพาะส่วนที่วัดได้ว่าเกินกำลัง" |
| ถูกถามเรื่อง denormalize | "ได้ครับ แต่ต้องตอบได้ว่าใครเป็นคน sync สำเนาเมื่อต้นฉบับเปลี่ยน และยอมไม่ตรงกันได้นานแค่ไหน" |
| ถูกถามเรื่อง consistency | "ขึ้นกับว่าข้อมูลส่วนนั้นผิดแล้วเสียหายแค่ไหนครับ — แยกเป็นรายส่วน ไม่ใช่ทั้งระบบ" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้องสัมภาษณ์:

- **NoSQL เกิดมาเพื่อ scale แนวนอน** โดยตัด JOIN และ transaction ข้ามเครื่องทิ้ง — มันคือการ "ถามได้น้อยลงเพื่อตอบได้เร็วและใหญ่ได้ไม่จำกัด"
- **5 ตระกูล:** Document (MongoDB), Key-value (Redis, DynamoDB), Wide-column (Cassandra), Graph (Neo4j), Search (Elasticsearch) + Time-series
- **Graph ชนะ** เมื่อคำถามคือ "เชื่อมกันกี่ชั้น" — เดินตามเส้น ไม่ต้อง JOIN ทั้งตาราง
- **Search engine = inverted index** (คำ → เอกสาร) ใช้เป็นสำเนาที่ค้นเก่ง ไม่ใช่ source of truth
- **Query-first design:** เขียน access pattern ก่อน schema เสมอ
- **Embed** เมื่ออ่านด้วยกัน + ลูกจำกัด / **Reference** เมื่อลูกโตไม่หยุด แก้แยก หรือแชร์หลายที่ — ระวัง unbounded array
- **Denormalization** = อ่านเร็ว แต่จ่ายด้วย write amplification + ช่วงไม่ตรงกัน + ต้องมีเจ้าของ sync
- **Partition key** = cardinality สูง + โหลดกระจาย + อยู่ในทุก query — เปลี่ยนยากที่สุด
- **Hot partition** = ก้อนเดียวเหนื่อย แก้ด้วย write sharding / cache / aggregate
- **Secondary index** local = scatter-gather / global = เร็วแต่ eventual
- **Single-table design** = pre-JOIN ไว้ตอนเขียน คุ้มเมื่อ pattern นิ่ง ไม่คุ้มเมื่อ product ยังเปลี่ยน
- **Consistency:** Strong / Read-your-writes / Eventual — เลือกรายส่วนตามความเสียหาย
- **Quorum:** R + W > N → เห็นค่าล่าสุด แลกกับ latency
- **CAP:** ตอน partition เลือก C หรือ A / **PACELC:** ตอนปกติเลือก L หรือ C
- **Transaction ใน NoSQL** มีได้แต่แพง — ออกแบบให้ atomic boundary = document boundary
- **Schemaless** = schemaVersion + อ่านได้หลายรุ่น + lazy migration + backfill
- **TTL** ลบช้ากว่าที่ตั้งได้ ต้องกรองตอนอ่านด้วย
- **ไม่ควรใช้ NoSQL** เมื่อ pattern ยังไม่นิ่ง, JOIN เยอะ, ต้อง transaction ข้าม entity, หรือข้อมูลไม่ได้ใหญ่จริง
- **Polyglot** ได้ แต่ต้องมี source of truth ชัดและจ่ายต้นทุน ops

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **NoSQL ออกแบบจาก "จะถามอะไร" ไม่ใช่ "ข้อมูลคืออะไร"** — access pattern มาก่อน schema เสมอ
2. **Partition key คือการตัดสินใจที่แพงที่สุด** — ผิดแล้วได้ hot partition และ scan ทุกเครื่อง
3. **Embed เมื่ออ่านด้วยกันและจำกัดขนาด / Reference เมื่อโตไม่หยุดหรือแชร์กัน** — denormalize มีราคาที่ต้องมีคนจ่าย
4. **CAP = ตอนสายขาดเลือก C หรือ A / PACELC = ตอนปกติเลือก Latency หรือ Consistency** — เลือกรายส่วนของข้อมูล
5. **NoSQL ไม่ใช่ค่า default** — ใช้เมื่อ pattern นิ่งและ scale จำเป็นจริง ที่เหลือ PostgreSQL มักพอ

### Keyword ย่อ

```
NoSQL          → ถามได้น้อยลง เพื่อ scale ได้ไม่จำกัด
Document       → แฟ้มลูกค้า 1 แฟ้ม (MongoDB)
Key-value      → ตู้ล็อกเกอร์ (Redis, DynamoDB)
Wide-column    → สมุดแยกเล่มต่อ key เรียงตามเวลา (Cassandra)
Graph          → กระดานสืบสวน เชือกแดงโยงคน (Neo4j)
Traversal      → เดินตามเส้น ไม่ JOIN ทั้งตาราง
Inverted Index → คำ → เอกสาร (Elasticsearch)
Time-series    → กราฟชีพจร + downsample + retention
Access Pattern → รายการคำถาม เขียนก่อน schema
Embed          → อ่านครั้งเดียว แต่ซ้ำ/โตได้
Reference      → ไม่ซ้ำ แต่ต้องอ่านหลายครั้ง
Unbounded Array→ ระเบิดเวลาของ document
Denormalize    → อ่านเร็ว / ตามแก้ทุกที่
Partition Key  → ข้อมูลอยู่เครื่องไหน (เปลี่ยนยากสุด)
Hot Partition  → ตู้ที่ทุกคนรุมเปิด → salting / cache
GSI            → index ข้ามเครื่อง เร็วแต่ eventual
Single-table   → pre-JOIN ไว้ตอนเขียน (PK/SK overload)
Strong         → ทุกคนเห็นค่าล่าสุด (ช้า)
Eventual       → เดี๋ยวก็ตรง (เร็ว)
Read-your-writes→ อย่างน้อยคนเขียนต้องเห็น
Quorum         → R + W > N
CAP            → สายขาด: C หรือ A
PACELC         → สายปกติ: L หรือ C
NoSQL Txn      → มีได้ แต่แพง — ออกแบบให้ไม่ต้องใช้
Schema Evolve  → schemaVersion + lazy migrate + backfill
TTL            → นมกล่องหมดอายุ (ลบช้ากว่าที่ตั้งได้)
Polyglot       → หลาย DB ตามงาน + source of truth ชัด
```

---

[← สารบัญ](./00-README-TOC.md)
