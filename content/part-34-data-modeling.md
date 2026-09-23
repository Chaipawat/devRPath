# PART 34 — DATA MODELING

> ตำแหน่งในภาพใหญ่: Data & Analytics — ชั้นที่อยู่ "ถัดจาก" database ของ app (PART 08) คือการจัดรูปข้อมูลใหม่ให้คนถามคำถามธุรกิจได้ถูกและเร็ว ก่อนจะถูกเอาไปเขียน SQL (PART 31) และวิเคราะห์ (PART 33) — ถ้าชั้นนี้ผิด ทุก dashboard ในบริษัทผิดพร้อมกันโดยไม่มีใครรู้ตัว

---

## 1. Big Picture

ลองนึกภาพระบบ e-commerce เดิมจาก PART 08 ผ่านไป 1 ปี แล้ว CEO ถามว่า

> "ยอดขายเดือนที่แล้ว แยกตามภูมิภาคของลูกค้า เทียบกับปีก่อน โตขึ้นเท่าไร?"

Developer คนแรกทำสิ่งที่ง่ายที่สุด: เขียน query ยิงเข้า production database ตรง ๆ JOIN `orders` + `order_items` + `users` + `addresses` แล้ว GROUP BY

ผลที่เกิดขึ้นจริง:

1. **Query รัน 4 นาที** และกิน CPU ของ DB จนหน้า checkout ช้าไปทั้งระบบ
2. **ตัวเลขผิด** — ลูกค้าที่ย้ายจากเชียงใหม่ไปกรุงเทพเมื่อเดือนที่แล้ว ทำให้ยอดขายปีก่อนทั้งหมดของเขาถูกนับเป็น "กรุงเทพ" ย้อนหลัง
3. **ทีม Marketing ได้ตัวเลขไม่เท่าทีม Finance** — เพราะอีกทีมนับ order ที่ถูก cancel ด้วย อีกทีมไม่นับ

ทั้ง 3 ปัญหานี้ไม่ใช่เรื่อง SQL เขียนไม่เก่ง แต่เป็นเรื่อง **Data Modeling**

**Data Modeling (สำหรับงาน analytics) → การออกแบบรูปร่างข้อมูล ให้คนถามคำถามธุรกิจได้ง่าย ได้คำตอบเดียวกัน และไม่ไปรบกวนระบบที่ลูกค้ากำลังใช้งาน**

นิยามนี้มี 3 ส่วน และคือ 3 เรื่องใหญ่ของ chapter นี้:

| ส่วนของนิยาม | เรื่องที่ต้องเรียน |
|---|---|
| ถามได้ง่ายและเร็ว | OLTP vs OLAP, Grain, Fact, Dimension, Star Schema, Wide Table |
| ได้คำตอบเดียวกัน (ถูกต้องตามเวลา) | Conformed Dimension, Surrogate Key, SCD, Semantic Layer, Data Quality Test |
| ไม่รบกวนระบบจริง + ไว้ใจได้ระยะยาว | ETL/ELT, Warehouse/Lake/Lakehouse, Layered Model, Incremental, Idempotent, Data Contract, Lineage |

> **ให้มองภาพนี้ว่า** "database ของ app ถูกออกแบบมาเพื่อ **จดบันทึก** ทีละรายการให้เร็วและถูก ส่วน data model ถูกออกแบบมาเพื่อ **อ่านสรุป** ทีละล้านรายการให้เร็วและตรงกัน — สองงานนี้ขัดกันเอง จึงต้องมีคนละที่"

---

## 2. Keywords

### 2.1 พื้นฐาน: ระบบและรูปร่างข้อมูล

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| OLTP | ระบบที่ app ใช้เขียน/อ่านทีละรายการ | สมุดจดรายการ |
| OLAP | ระบบที่ใช้สรุปข้อมูลจำนวนมาก | เครื่องคิดเลขยักษ์ |
| Data Warehouse | ฐานข้อมูลสำหรับ analytics ที่มี schema ชัด | ห้องสมุดที่จัดหมวดแล้ว |
| Data Lake | ที่กองไฟล์ดิบทุกแบบไว้ราคาถูก | โกดังของ |
| Lakehouse | lake ที่มี table format + transaction แบบ warehouse | โกดังที่มีระบบบัญชีของ |
| Columnar Storage | เก็บข้อมูลเป็นคอลัมน์ ไม่ใช่เป็นแถว | อ่านเฉพาะช่องที่ใช้ |
| Dimensional Modeling | ออกแบบเป็น fact + dimension | แนวคิดของ Kimball |
| Grain | 1 แถวของ fact แทน "อะไร" หนึ่งอย่าง | ประกาศก่อนเสมอ |
| Fact Table | ตารางเก็บเหตุการณ์ + ตัวเลข | กริยา + จำนวน |
| Dimension Table | ตารางเก็บบริบทไว้หั่น/กรอง | ใคร ที่ไหน อะไร เมื่อไร |
| Measure | ตัวเลขใน fact ที่เอาไปรวม | ยอดเงิน, จำนวนชิ้น |
| Star Schema | fact อยู่กลาง dimension ล้อมรอบ | ดาว 1 ชั้น |
| Snowflake Schema | dimension ถูก normalize แตกต่ออีกชั้น | เกล็ดหิมะหลายชั้น |

### 2.2 Fact และ Key

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Transaction Fact | 1 แถว = 1 เหตุการณ์ | ใบเสร็จทีละใบ |
| Periodic Snapshot Fact | 1 แถว = สถานะ ณ ช่วงเวลา | ถ่ายรูปทุกสิ้นวัน |
| Accumulating Snapshot Fact | 1 แถว = 1 กระบวนการ ถูก update ตามขั้น | บัตรสะสมแสตมป์ |
| Factless Fact | fact ที่ไม่มีตัวเลข มีแค่ว่าเกิดขึ้น | เช็คชื่อเข้าเรียน |
| Additive Measure | บวกได้ทุกมิติ | ยอดขาย |
| Semi-additive Measure | บวกได้บางมิติ ห้ามบวกข้ามเวลา | ยอดคงเหลือ |
| Non-additive Measure | บวกไม่ได้เลย ต้องคำนวณใหม่ | อัตราส่วน, % |
| Natural Key | key ที่มาจากระบบต้นทาง | `customer_id` ของ app |
| Surrogate Key | key ที่ warehouse สร้างเอง | เลขประจำ "เวอร์ชัน" |
| Conformed Dimension | dimension ตัวเดียวที่ทุก fact ใช้ร่วมกัน | นิยามเดียวทั้งบริษัท |
| SCD | วิธีจัดการ dimension ที่ค่าเปลี่ยนตามเวลา | ประวัติเปลี่ยนอย่างไร |
| SCD Type 1 | เขียนทับ ไม่เก็บประวัติ | ลบกระดานแล้วเขียนใหม่ |
| SCD Type 2 | เพิ่มแถวใหม่ต่อเวอร์ชัน | เก็บทุกหน้าของประวัติ |
| SCD Type 3 | เพิ่มคอลัมน์ "ค่าก่อนหน้า" | จำได้แค่ครั้งเดียว |
| Bridge Table | ตารางเชื่อม many-to-many ใน dimensional model | ตารางกลางพร้อม weight |
| One Big Table (OBT) | JOIN ทุกอย่างไว้เป็นตารางกว้างตารางเดียว | สะดวก แต่ซ้ำเยอะ |

### 2.3 Pipeline และความน่าเชื่อถือ

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| ETL | แปลงก่อนแล้วค่อยโหลด | ล้างผักก่อนเข้าตู้ |
| ELT | โหลดดิบก่อน แล้วแปลงใน warehouse | เข้าตู้ก่อน ค่อยล้าง |
| Raw / Staging Layer | ข้อมูลดิบ + ทำความสะอาดขั้นต่ำ | ของเพิ่งมาส่ง |
| Intermediate Layer | ชั้นประกอบ logic กลาง | ครัวเตรียมของ |
| Mart | ตารางพร้อมใช้ของแต่ละโดเมน | จานที่เสิร์ฟ |
| Incremental Model | ประมวลผลเฉพาะข้อมูลใหม่ | ไม่ต้องทำใหม่ทั้งหมด |
| Idempotent Pipeline | รันซ้ำกี่รอบผลก็เหมือนเดิม | กดซ้ำได้ไม่พัง |
| Backfill | รันย้อนหลังเพื่อเติม/แก้ข้อมูลเก่า | ซ่อมอดีต |
| Late-arriving Data | ข้อมูลที่มาช้ากว่าเวลาที่เกิดจริง | จดหมายมาถึงช้า |
| Data Contract | ข้อตกลงระหว่างผู้ผลิตกับผู้ใช้ข้อมูล | API contract ของ data |
| Schema Evolution | การเปลี่ยน schema อย่างมีระเบียบ | migration ของ data |
| Breaking Change | การเปลี่ยนที่ทำให้ปลายทางพัง | ลบ/เปลี่ยนความหมาย column |
| Data Lineage | แผนที่ว่าข้อมูลไหลมาจากไหนไปไหน | แผนผังท่อน้ำ |
| Data Quality Test | การเช็คว่าข้อมูลถูกตามกติกา | unit test ของข้อมูล |
| Freshness | ข้อมูลใหม่ล่าสุดเมื่อไร | นมหมดอายุหรือยัง |
| Semantic / Metrics Layer | ที่นิยาม metric ครั้งเดียวให้ทุกเครื่องมือใช้ | พจนานุกรมตัวเลข |

---

## 3. Mental Model

### Mental Model หลัก: "เขียนแบบสมุดจด อ่านแบบรายงาน"

database ของ app (PART 08) ถูก **normalize** เพื่อให้ **เขียน** ถูกต้อง — ข้อมูลอยู่ที่เดียว แก้ที่เดียว ไม่ขัดแย้ง
แต่คำถาม analytics แทบทุกข้อคือ **อ่านข้อมูลหลายล้านแถว แล้วรวม** — ถ้าต้อง JOIN 8 ตารางทุกครั้ง ช้า ผิดง่าย และคนทั่วไปเขียนไม่ได้

Data model สำหรับ analytics จึง **จงใจ denormalize แบบมีระเบียบ** — ไม่ใช่ยัดทุกอย่างมั่ว ๆ แต่จัดเป็นแค่ 2 ชนิด:

```
FACT      = "เกิดอะไรขึ้น + เท่าไร"         (กริยา + ตัวเลข)   → ยาวมาก ผอม
DIMENSION = "กับใคร ที่ไหน อะไร เมื่อไร"    (คำนาม + คำคุณศัพท์) → สั้น กว้าง
```

> **ให้มองภาพนี้ว่า** "ทุกคำถามธุรกิจมีรูปเดียวกัน — 'ขอ [ตัวเลข] แยกตาม [บริบท] กรองด้วย [บริบท]' ตัวเลขมาจาก fact บริบทมาจาก dimension ออกแบบให้ตรงรูปนี้ แล้วคำถามทุกข้อจะเขียนง่ายเอง"

### Mental Model ที่ 2: 4 คำถามตามลำดับ (ของ Kimball) — ห้ามข้ามข้อ 2

```
1) Business process อะไร?        → เช่น "การขาย", "การจัดส่ง", "สต็อกคงคลัง"
        ↓
2) Grain คืออะไร?                 → "1 แถว = 1 รายการสินค้าในใบสั่งซื้อ"   ← ประกาศก่อนเสมอ
        ↓
3) Dimension อะไรบ้าง?           → date, customer, product, store
        ↓
4) Fact/Measure อะไรบ้าง?         → quantity, net_amount, discount
```

ถ้ายังตอบข้อ 2 ไม่ได้เป็นประโยคเดียว **อย่าเพิ่งสร้างตาราง** — ปัญหาตัวเลขเบิ้ล ตัวเลขหาย ครึ่งหนึ่งในวงการเกิดจากตารางที่ไม่มีใครรู้ว่า 1 แถวแทนอะไร

### Mental Model ที่ 3: Data คือ "product" ที่มีผู้ใช้ ไม่ใช่ผลพลอยได้ของ app

ทันทีที่มี dashboard ของ CFO อ่านตารางของคุณ ตารางนั้นคือ **API สาธารณะ** แล้ว
การ rename column ใน app โดยไม่บอกใคร = การ break API ของทีมอื่น เหมือนกับ breaking change ของ REST API ใน PART 01

> "ถ้าคุณไม่อยากให้ใครพึ่งพาข้อมูลของคุณ อย่าปล่อยให้เขาอ่านมัน — ถ้าปล่อยแล้ว ต้องมี contract"

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำ:
OLTP             = แคชเชียร์ที่คิดเงินลูกค้าทีละคน (ต้องเร็ว ต้องไม่ผิด)
OLAP             = นักบัญชีที่สรุปใบเสร็จทั้งปีตอนสิ้นเดือน
Fact             = ใบเสร็จ (เกิดอะไร เท่าไร)
Dimension        = สมุดทะเบียน (ลูกค้าคนนี้คือใคร สินค้านี้คืออะไร)
Grain            = "ใบเสร็จ 1 บรรทัด = สินค้า 1 รายการ" — ตกลงกันก่อนนับ
Star Schema      = ใบเสร็จวางกลางโต๊ะ สมุดทะเบียนวางรอบ ๆ
Surrogate Key    = เลขหน้าในสมุดทะเบียน (ไม่ใช่เลขบัตรประชาชน)
SCD Type 2       = สมุดทะเบียนที่ไม่ลบของเก่า แต่เขียนบรรทัดใหม่พร้อมวันที่
Data Lake        = โกดังที่โยนกล่องทุกอย่างเข้าไปก่อน
Warehouse        = ร้านที่จัดของขึ้นชั้นพร้อมป้ายราคา
Staging → Mart   = ของมาส่ง → ครัวเตรียม → จานเสิร์ฟ
Idempotent       = กดปุ่ม "ทำรายงานเดือนนี้" 5 ครั้ง ได้รายงานเดียวกัน ไม่ใช่ยอดคูณ 5
Data Contract    = สัญญาส่งของ: ส่งอะไร หน้าตาแบบไหน ส่งกี่โมง ใครรับผิดชอบ
Lineage          = ผังท่อน้ำ — น้ำขุ่นที่ก๊อกไหน ไล่กลับไปหาต้นท่อได้
Semantic Layer   = พจนานุกรมว่า "ยอดขาย" แปลว่าอะไร ใช้เล่มเดียวทั้งบริษัท
```

### ภาพจำเจาะลึก: Grain = "หน่วยนับ" ของใบเสร็จ (ข้อนี้สำคัญที่สุดของทั้งบท)

```
ใบเสร็จเดียวกัน อ่านได้ 3 grain:

grain = ใบสั่งซื้อ           → 1 แถวต่อ order              (100 แถว)
grain = รายการสินค้าในใบ     → 1 แถวต่อ order_item         (340 แถว)
grain = การจัดส่งแต่ละกล่อง   → 1 แถวต่อ shipment           (150 แถว)
```

> **ให้มองภาพนี้ว่า** "grain คือการตกลงว่า 'นับอะไรเป็น 1' ถ้าเอา ค่าส่ง (ระดับ order) ไปใส่ทุกบรรทัดของตาราง grain = order_item แล้ว SUM — ค่าส่งจะถูกนับซ้ำเท่าจำนวนสินค้าในใบทันที"

**กฎเหล็ก:** measure ทุกตัวในตารางเดียวกันต้องอยู่ที่ grain เดียวกัน ถ้าตัวเลขเกิดคนละ grain → แยก fact table หรือกระจาย (allocate) ลงอย่างมีกติกา อย่าคัดลอกซ้ำ

---

## 5. How It Works

### 5.1 ภาพรวม: ข้อมูลเดินทางจาก app ไปถึง dashboard

```
[APP DB (OLTP)]   [EVENTS / LOGS]   [SaaS: CRM, Payment, Ads]
      │                 │                    │
      └──── extract (CDC / batch / API) ─────┘
                        ↓
[RAW]            สำเนาดิบ ไม่แก้อะไร ย้อนกลับมาดูได้เสมอ
                        ↓
[STAGING]        rename, cast type, แก้ timezone, dedupe — 1 source : 1 model
                        ↓
[INTERMEDIATE]   JOIN / business logic ที่ใช้ร่วมกัน
                        ↓
[MARTS]          fact_* และ dim_* ตาม business process
                        ↓
[SEMANTIC LAYER] นิยาม metric: revenue, active_user, conversion
                        ↓
[BI / NOTEBOOK / REVERSE ETL / ML]
```

> **ให้มองภาพนี้ว่า** "ยิ่งลงไปข้างล่าง ข้อมูลยิ่งสะอาดและยิ่งมีความหมายทางธุรกิจ — แต่ยิ่งข้างบน ยิ่งใกล้ความจริงดิบที่ใช้ตรวจสอบย้อนหลังได้ อย่าทิ้งชั้น raw เด็ดขาด"

**ทำไมต้องแยกชั้น (ไม่ใช่เพราะ tool บอกให้แยก):**

| ชั้น | ทำไมต้องมี | ถ้าไม่มีจะเกิดอะไร |
|---|---|---|
| Raw | เก็บหลักฐาน replay ได้ | logic ผิดแล้วกู้ไม่ได้ ต้องดึงจากต้นทางใหม่ (ซึ่งอาจลบไปแล้ว) |
| Staging | ทำความสะอาดที่เดียว | ทุก query ต้องจำว่า `amount` เป็นสตางค์ timezone เป็น UTC — ลืมทีคือผิด |
| Intermediate | logic กลางเขียนครั้งเดียว | นิยาม "order ที่สำเร็จ" ถูกก๊อปไป 12 ที่ แก้ไม่ครบ |
| Mart | ตารางพร้อมใช้ที่คนนอกทีมเข้าใจ | ทุกคนต้องรู้โครงสร้าง app DB เพื่อถามคำถามง่าย ๆ |

### 5.2 ทำไม OLAP ใช้ columnar storage

```
คำถาม: SUM(net_amount) ของปี 2025  (ตาราง 50 คอลัมน์ 1,000 ล้านแถว)

Row store (OLTP):
[id|date|cust|prod|...|net_amount|...]  ← อ่านทั้งแถว 50 ช่อง เพื่อใช้ 2 ช่อง
[id|date|cust|prod|...|net_amount|...]

Column store (OLAP):
date:       [2025-01-01, 2025-01-01, ...]  ← อ่านแค่ 2 คอลัมน์นี้
net_amount: [120.00, 89.50, ...]            ← และบีบอัดได้ดีมากเพราะค่าคล้ายกัน
```

> **ให้มองภาพนี้ว่า** "row store เก่งเมื่อต้องการ 'ทุกอย่างของ 1 รายการ' (หน้า order detail) ส่วน column store เก่งเมื่อต้องการ 'ช่องเดียวของทุกรายการ' (รวมยอด) — นี่คือเหตุผลเชิงกายภาพที่ app DB ไม่ควรเป็น analytics DB"

**Trade-off:** column store update ทีละแถวแพงมาก — มันถูกออกแบบให้ append เป็นก้อน ไม่ใช่ให้ app มา UPDATE stock ทีละชิ้น

### 5.3 Star Schema หน้าตาเป็นอย่างไร

```
                      ┌──────────────────┐
                      │   dim_date       │
                      │ date_key (PK)    │
                      │ date, month,     │
                      │ quarter, is_holiday│
                      └────────┬─────────┘
                               │
┌──────────────────┐  ┌────────┴──────────┐  ┌──────────────────┐
│  dim_customer    │  │  fact_sales       │  │  dim_product     │
│ customer_sk (PK) ├──┤ date_key    (FK)  ├──┤ product_sk (PK)  │
│ customer_id (NK) │  │ customer_sk (FK)  │  │ product_id (NK)  │
│ region, segment  │  │ product_sk  (FK)  │  │ category, brand  │
│ valid_from/to    │  │ store_sk    (FK)  │  └──────────────────┘
└──────────────────┘  │ order_id (degenerate)│
                      │ quantity           │
                      │ net_amount         │
                      │ discount_amount    │
                      └────────┬──────────┘
                               │
                      ┌────────┴─────────┐
                      │   dim_store      │
                      └──────────────────┘

grain ของ fact_sales = 1 แถวต่อ 1 รายการสินค้าใน 1 order
```

> **ให้มองภาพนี้ว่า** "fact อยู่ตรงกลางเป็นตารางยาวและผอม (FK + ตัวเลข) ส่วน dimension ล้อมรอบเป็นตารางสั้นและกว้าง (ข้อความอธิบาย) — ทุก query คือ 'fact JOIN dimension ที่ต้องการ แล้ว GROUP BY attribute'"

สังเกต `order_id` ใน fact: มันไม่มี dimension ของตัวเองเพราะไม่มี attribute อะไรเพิ่ม เรียกว่า **degenerate dimension** — เก็บไว้ใน fact ตรง ๆ เพื่อใช้ group/ไล่กลับไปหา order ได้

### 5.4 Fact 3 แบบ

| แบบ | 1 แถว = | เขียนแบบไหน | ตัวอย่าง | คำถามที่ตอบได้ดี |
|---|---|---|---|---|
| **Transaction** | 1 เหตุการณ์ | insert อย่างเดียว | ขาย 1 รายการ, คลิก 1 ครั้ง, ชำระเงิน 1 ครั้ง | "เกิดขึ้นกี่ครั้ง รวมเท่าไร" |
| **Periodic Snapshot** | สถานะ ณ สิ้นช่วง (วัน/เดือน) | insert ทุกรอบ | สต็อกคงเหลือสิ้นวัน, ยอดเงินในบัญชีสิ้นเดือน | "ณ วันนั้นมีเท่าไร แนวโน้มเป็นยังไง" |
| **Accumulating Snapshot** | 1 กระบวนการตั้งแต่ต้นจนจบ | insert แล้ว **update** ตามขั้น | order: สั่ง → จ่าย → แพ็ค → ส่ง → ถึง | "ขั้นไหนช้า ใช้เวลากี่วันระหว่างขั้น" |

```
Accumulating snapshot ของ order #1001
order_id | ordered_at | paid_at | shipped_at | delivered_at | days_to_ship
1001     | 03-01      | 03-01   | NULL       | NULL         | NULL      ← วันแรก
1001     | 03-01      | 03-01   | 03-04      | NULL         | 3         ← update
1001     | 03-01      | 03-01   | 03-04      | 03-06        | 3         ← update
```

🧠 ภาพจำ: **Transaction = กล้องวงจรปิดบันทึกทุกเหตุการณ์ / Periodic = ถ่ายรูปห้องทุกเที่ยงคืน / Accumulating = บัตรสะสมแสตมป์ที่ปั๊มเพิ่มทีละช่อง**

### 5.5 Additive / Semi-additive / Non-additive

| ชนิด | บวกข้ามมิติไหนได้ | ตัวอย่าง | ถ้าทำผิดจะเกิดอะไร |
|---|---|---|---|
| **Additive** | ทุกมิติ | ยอดขาย, จำนวนชิ้น | — (ปลอดภัย) |
| **Semi-additive** | บวกข้ามลูกค้า/สาขาได้ **แต่ห้ามบวกข้ามเวลา** | ยอดคงเหลือ, จำนวนสต็อก, จำนวน subscriber | SUM ยอดคงเหลือ 30 วัน = ได้ตัวเลขใหญ่ 30 เท่าที่ไม่มีความหมาย → ต้องใช้ค่าสิ้นงวด หรือ AVG |
| **Non-additive** | บวกไม่ได้เลย | conversion rate, margin %, ราคาต่อหน่วย | ค่าเฉลี่ยของ % ≠ % ของผลรวม |

**กับดัก non-additive ที่เจอจริง:**

```
สาขา A: ขาย 10 ใบ จาก 100 visit  = 10%
สาขา B: ขาย 90 ใบ จาก 300 visit  = 30%

AVG(%)       = (10% + 30%) / 2     = 20%   ✘ ผิด
SUM/SUM      = 100 / 400           = 25%   ✔ ถูก
```

**หลักปฏิบัติ:** ใน fact ให้เก็บ **ส่วนประกอบ** (orders, visits) ไม่ใช่เก็บ % สำเร็จรูป แล้วคำนวณอัตราส่วนตอนท้ายใน semantic layer

### 5.6 Surrogate Key vs Natural Key

```
ระบบต้นทาง:  customer_id = "C-1001"          ← natural key (business key)
Warehouse:   customer_sk = 58213             ← surrogate key (เลขที่ warehouse ออกเอง)
```

**ทำไมไม่ใช้ natural key ตรง ๆ:**

1. **SCD Type 2** — ลูกค้า C-1001 มีได้หลายแถว (หลายเวอร์ชัน) natural key จึงไม่ unique อีกต่อไป
2. **หลายระบบต้นทางชนกัน** — CRM ใช้ `1001` ระบบ POS ก็ใช้ `1001` แต่เป็นคนละคน
3. **ต้นทางเปลี่ยน key ได้** — migrate ระบบแล้ว id ใหม่หมด
4. **แถวพิเศษ** — `-1 = Unknown` สำหรับ fact ที่ยังหา dimension ไม่เจอ (late-arriving)

**Trade-off:** surrogate key ต้องมีขั้นตอน lookup ตอนโหลด fact (natural key → surrogate key ณ เวลานั้น) ซึ่งทำให้ pipeline ซับซ้อนขึ้นและต้องโหลด dimension ก่อน fact เสมอ — หลายทีมสมัยใหม่ใช้ hash ของ `natural_key + valid_from` เป็น surrogate key เพื่อไม่ต้องพึ่ง sequence

### 5.7 Slowly Changing Dimension (SCD) — ตัวอย่างเดียวเห็นครบ 3 แบบ

**เหตุการณ์:** ลูกค้า "สมชาย" (C-1001) อยู่ **เชียงใหม่** ซื้อของ 5,000 บาทเมื่อ ม.ค. แล้วย้ายไป **กรุงเทพ** 1 มี.ค. แล้วซื้ออีก 3,000 บาท

**SCD Type 1 — เขียนทับ**

```
customer_sk | customer_id | name  | region
58213       | C-1001      | สมชาย | กรุงเทพ      ← เชียงใหม่หายไปจากโลก
```

ยอดขายตามภูมิภาค: กรุงเทพ 8,000 / เชียงใหม่ 0 — **ประวัติถูกเขียนใหม่ย้อนหลัง**
เหมาะกับ: การแก้คำผิด, ข้อมูลที่ไม่มีใครวิเคราะห์ตามเวลา (เบอร์โทร)

**SCD Type 2 — เพิ่มแถวใหม่**

```
customer_sk | customer_id | region   | valid_from | valid_to   | is_current
58213       | C-1001      | เชียงใหม่ | 2024-05-10 | 2025-02-28 | false
60977       | C-1001      | กรุงเทพ   | 2025-03-01 | 9999-12-31 | true
```

fact ของ ม.ค. ชี้ `58213`, fact ของ มี.ค. ชี้ `60977`
ยอดขายตามภูมิภาค: เชียงใหม่ 5,000 / กรุงเทพ 3,000 — **ถูกต้องตามความจริง ณ เวลาที่ขาย**
เหมาะกับ: attribute ที่ใช้วิเคราะห์และเปลี่ยนได้ (ภูมิภาค, segment, tier, ผู้จัดการฝ่ายขาย)

**SCD Type 3 — เพิ่มคอลัมน์ค่าก่อนหน้า**

```
customer_sk | customer_id | region_current | region_previous
58213       | C-1001      | กรุงเทพ         | เชียงใหม่
```

จำได้แค่ 1 ครั้งก่อนหน้า พอย้ายอีกครั้ง (ครั้งที่ 2) ค่า "เชียงใหม่" ก็หายไปเลย
เหมาะกับ: การเปลี่ยนใหญ่ครั้งเดียวที่อยากเทียบ "แบบเก่า vs แบบใหม่" เช่น การจัดเขตขายใหม่ทั้งบริษัท

> **ให้มองภาพนี้ว่า** "Type 1 = ลบกระดานเขียนใหม่ / Type 2 = เก็บทุกหน้าของสมุดพร้อมวันที่ / Type 3 = จดโน้ตข้าง ๆ ว่า 'เดิมเคยเป็น...' ได้แค่บรรทัดเดียว"

| | Type 1 | Type 2 | Type 3 |
|---|---|---|---|
| เก็บประวัติ | ไม่เก็บ | ครบทุกเวอร์ชัน | 1 ขั้นก่อนหน้า |
| ขนาดตาราง | คงที่ | โตตามจำนวนการเปลี่ยน | คงที่ |
| ความซับซ้อน | ต่ำสุด | สูง (ต้อง lookup ตามเวลา, ต้องมี `is_current`) | ปานกลาง |
| ความเสี่ยง | ตัวเลขอดีตเปลี่ยนโดยไม่มีใครรู้ | JOIN ลืมกรอง → นับคนซ้ำ | ประวัติเกิน 1 ขั้นหาย |

**ในงานจริง:** dimension เดียวกันใช้ผสมได้ — `region` เป็น Type 2 แต่ `phone` เป็น Type 1
**คำถามที่ต้องถามธุรกิจก่อนเลือก:** "ถ้าลูกค้าย้ายภูมิภาค ยอดขายเก่าของเขาควรอยู่ภูมิภาคไหน?" — คำตอบนั้นคือ SCD type

### 5.8 Conformed Dimension

```
fact_sales ─────┐
fact_returns ───┼──→ dim_customer (ตัวเดียว นิยามเดียว)
fact_support ───┘
```

ถ้าทีม Sales มี `dim_customer` ของตัวเอง ทีม Support มีอีกตัว แล้วนิยาม "ลูกค้า VIP" ไม่เหมือนกัน → **ไม่มีวันเทียบยอดขายกับจำนวน ticket ต่อลูกค้าได้ถูก**

Conformed dimension = dimension ที่ทุก fact ใช้ร่วมกัน ความหมายเดียว key เดียว ทำให้ "drill across" ข้าม business process ได้
**Trade-off:** ต้องมีเจ้าของกลางและต้องตกลงนิยามข้ามทีม — ช้ากว่าให้แต่ละทีมทำเอง แต่ถ้าไม่ทำ บริษัทจะมี "ความจริง" หลายเวอร์ชัน

### 5.9 ETL vs ELT

```
ETL:  [SOURCE] → extract → [TRANSFORM SERVER] → load → [WAREHOUSE]
                           แปลงก่อน โหลดแต่ของที่สะอาด

ELT:  [SOURCE] → extract → load → [WAREHOUSE: raw] → transform (SQL) → [marts]
                                  โหลดดิบก่อน แปลงข้างใน
```

ELT กลายเป็นมาตรฐานเพราะ cloud warehouse แยก storage กับ compute และ storage ถูกมาก — เก็บ raw ไว้ได้ แล้ว **แก้ logic แล้วรันใหม่จาก raw ได้เสมอ**
แต่ ETL ยังมีที่ยืน: ต้อง **ลบ/mask PII ก่อนเข้า** warehouse ตามกฎหมาย, ข้อมูลใหญ่มากที่ต้องกรองก่อน, หรือ transform ที่ SQL ทำไม่ได้ดี

### 5.10 Incremental + Idempotent

**Full refresh:** ลบแล้วสร้างใหม่ทั้งตารางทุกรอบ — ง่าย ถูกเสมอ แต่แพงและช้าเมื่อข้อมูลโต
**Incremental:** ประมวลผลเฉพาะช่วงที่เปลี่ยน — ถูกและเร็ว แต่ซับซ้อนและผิดได้เงียบ ๆ

```
Incremental ที่ "ไม่ idempotent" (อันตราย):
  INSERT INTO fact_sales SELECT ... WHERE date = '2025-03-01'
  รันซ้ำ 2 รอบ (retry หลัง timeout) → ยอดวันนั้นเบิ้ล 2 เท่า

Incremental ที่ idempotent:
  DELETE FROM fact_sales WHERE date = '2025-03-01'      ┐ ทำใน transaction เดียว
  INSERT INTO fact_sales SELECT ... WHERE date = '2025-03-01'  ┘ หรือใช้ MERGE / overwrite partition
  รันกี่รอบก็ได้ผลเดียวกัน
```

> **ให้มองภาพนี้ว่า** "pipeline ที่ดีคือ 'ทำให้ partition นี้เป็นแบบนี้' ไม่ใช่ 'เพิ่มสิ่งนี้เข้าไป' — ประโยคแรกรันซ้ำได้ ประโยคหลังรันซ้ำคือบั๊ก"

หลักเดียวกับ idempotency ของ API ใน PART 16 — retry ต้องปลอดภัย เพราะ scheduler **จะ** retry แน่นอน

**Backfill** คือรันย้อนหลังเป็นช่วง ๆ (เช่น แก้ logic แล้วรันใหม่ 2 ปีย้อนหลัง) — ทำได้ปลอดภัยก็ต่อเมื่อ pipeline idempotent และแบ่ง partition ตามวัน ถ้าไม่ idempotent การ backfill = การเพิ่มข้อมูลซ้ำ

### 5.11 Late-arriving Data

ข้อมูลที่ "เกิด" เมื่อวาน แต่ "มาถึง" วันนี้ — มือถือ offline แล้วส่ง event ทีหลัง, ระบบ partner ส่งไฟล์ช้า, refund ย้อนหลัง

```
event_time     = เวลาที่เกิดจริง     (ใช้วิเคราะห์)
ingested_at    = เวลาที่มาถึงเรา     (ใช้ทำ incremental)

ถ้า incremental กรองด้วย event_time >= เมื่อวาน  → event ที่มาช้าของ 3 วันก่อน หายเงียบ
วิธีแก้: กรองด้วย ingested_at + มี lookback window (เช่น ประมวลผลซ้ำ 3 วันล่าสุดทุกรอบ)
        แล้ว upsert ด้วย key ที่ unique → ซ้ำก็ไม่เบิ้ล
```

**Late-arriving dimension:** fact มาถึงแต่ยังไม่มีลูกค้าคนนั้นใน `dim_customer` → ใส่ `customer_sk = -1 (Unknown)` หรือสร้าง "inferred member" แถวว่าง ๆ ไว้ก่อน แล้วค่อยเติม attribute เมื่อข้อมูลมาถึง — **ห้าม INNER JOIN แล้วทิ้ง fact** เพราะยอดขายจะหายไปจากรายงาน

**Trade-off ของ lookback window:** ยิ่งยาว ยิ่งจับของมาช้าได้ครบ แต่ยิ่งแพงและตัวเลขของวันเก่ายิ่ง "ขยับ" ได้ — ต้องบอกผู้ใช้ว่าตัวเลขกี่วันล่าสุดยังไม่ final

---

## 6. Example — ออกแบบ data model ให้ E-commerce จริง

### 6.1 โจทย์

ต่อจากตาราง `users / orders / order_items / products` ใน PART 08
ธุรกิจต้องการ: ยอดขายรายวันตามหมวดสินค้าและภูมิภาค, อัตราคืนสินค้า, สต็อกคงเหลือ, เวลาจัดส่งเฉลี่ย

### 6.2 ขั้นที่ 1–2: Business process + Grain

| Business process | Fact table | Grain (ประโยคเดียว) | ชนิด |
|---|---|---|---|
| การขาย | `fact_order_items` | 1 แถว = 1 สินค้าใน 1 order | Transaction |
| การคืนสินค้า | `fact_returns` | 1 แถว = 1 สินค้าที่ถูกคืน 1 ครั้ง | Transaction |
| สต็อก | `fact_inventory_daily` | 1 แถว = 1 สินค้า × 1 คลัง × 1 วัน | Periodic snapshot |
| การจัดส่ง | `fact_order_fulfillment` | 1 แถว = 1 order ตลอดวงจรชีวิต | Accumulating snapshot |

สังเกตว่า **ไม่มี "fact_everything"** — 4 business process = 4 fact ที่ grain ต่างกัน แต่ใช้ `dim_date`, `dim_product`, `dim_customer` ร่วมกัน (conformed)

### 6.3 ขั้นที่ 3–4: ปัญหาค่าส่ง — ตัวเลขคนละ grain

`shipping_fee` อยู่ระดับ order แต่ `fact_order_items` อยู่ระดับ item — มี 3 ทางเลือก:

| ทางเลือก | ผล | Trade-off |
|---|---|---|
| ก๊อป shipping_fee ใส่ทุก item | SUM แล้วเบิ้ล | ❌ ผิด ห้ามทำ |
| Allocate ตามสัดส่วนราคา | item 60% ได้ค่าส่ง 60% | บวกกลับได้ครบ แต่ต้องตกลงกติกา allocation กับ Finance |
| แยก `fact_orders` (grain = order) | ค่าส่งอยู่ที่ของมัน | ถูกที่สุด แต่มี fact เพิ่มอีกตัว และคนต้องรู้ว่าจะใช้ตัวไหน |

### 6.4 SQL ที่ได้ (สั้นเพราะ model ดี)

```sql
SELECT d.month, c.region, SUM(f.net_amount) AS revenue
FROM fact_order_items f
JOIN dim_date d     ON d.date_key = f.date_key
JOIN dim_customer c ON c.customer_sk = f.customer_sk
GROUP BY d.month, c.region
```

เพราะ fact ชี้ surrogate key ของ **เวอร์ชันลูกค้า ณ วันที่ซื้อ** (SCD2) คำถาม "ยอดตามภูมิภาค ณ เวลาที่ขาย" จึงได้คำตอบถูกโดยไม่ต้องเขียน logic เวลาเลย
ถ้าธุรกิจอยากได้ "ยอดตามภูมิภาค **ปัจจุบัน** ของลูกค้า" ก็ JOIN ผ่าน `customer_id` ไปหาแถว `is_current = true` แทน — **model เดียวตอบได้ทั้ง 2 คำถาม** แต่ต้องตั้งชื่อ metric ให้ชัดว่าเป็นแบบไหน (เทคนิค SQL ละเอียดดู PART 31)

### 6.5 Bridge Table — many-to-many ใน dimensional model (Advanced)

**โจทย์:** สินค้า 1 ชิ้นอยู่ได้หลาย "แคมเปญ" พร้อมกัน / 1 order ใช้ได้หลายคูปอง / บัญชีธนาคาร 1 บัญชีมีเจ้าของร่วมหลายคน

```
fact_order_items ──→ dim_product ──→ bridge_product_campaign ──→ dim_campaign
                     product_sk       product_sk | campaign_sk | weight
                                      101        | 7           | 0.5
                                      101        | 9           | 0.5
```

**ปัญหาที่ bridge ทำให้เกิด:** JOIN ผ่าน bridge แล้ว row ของ fact **ถูกคูณ** ตามจำนวนแคมเปญ

```
ยอดขายสินค้า 101 = 1,000
JOIN ผ่าน bridge → ได้ 2 แถว (แคมเปญ 7, 9) → SUM = 2,000   ✘ ตัวเลขรวมเบิ้ล
```

**ทางออก 2 แบบ:**

| วิธี | ผล | เหมาะเมื่อ |
|---|---|---|
| **Weighted** — `SUM(net_amount * weight)` | ยอดรวมทุกแคมเปญ = 1,000 พอดี | ต้องการยอดที่บวกกลับได้ (allocation) |
| **Impact** — ไม่ถ่วงน้ำหนัก | แต่ละแคมเปญ "เกี่ยวกับ" 1,000 | อยากรู้ว่าแคมเปญแตะยอดเท่าไร โดยยอมรับว่ารวมกันไม่ได้ |

> **ให้มองภาพนี้ว่า** "bridge table คือตารางกลางของ N:M แบบเดียวกับ `order_items` ใน PART 08 แต่ในโลก analytics มันมีคำถามเพิ่มหนึ่งข้อที่ต้องตอบเสมอ — 'ถ้า 1 ยอดขายเกี่ยวกับ 2 สิ่ง จะแบ่งเครดิตยังไง'"

### 6.6 One Big Table (OBT) — ยอม denormalize ให้สุด

```
obt_order_items: order_id | order_date | month | customer_region | customer_segment |
                 product_category | brand | quantity | net_amount | ... (120 คอลัมน์)
```

| ข้อดี | ข้อเสีย |
|---|---|
| ผู้ใช้ไม่ต้อง JOIN — ลาก field ใน BI ได้เลย | ข้อมูลซ้ำมหาศาล ขนาดใหญ่ขึ้น |
| column store บีบอัดค่าซ้ำได้ดี + ไม่มี JOIN = เร็ว | dimension เปลี่ยน (Type 1) ต้อง rebuild ทั้งตาราง |
| เหมาะกับ dashboard เฉพาะเรื่อง | grain ผสมกันง่ายมาก — คนชอบยัด column ระดับ order เข้ามา |
| | ไม่มี conformed dimension → ทุก OBT นิยามลูกค้าเอง |

**หลักปฏิบัติ:** สร้าง star schema เป็น **แกนกลางที่ถูกต้อง** ก่อน แล้วค่อยสร้าง OBT เป็น **มุมมองปลายทาง** จาก star (build จาก fact + dim) สำหรับ use case ที่ต้องการความเร็ว — อย่าให้ OBT เป็น source of truth

### 6.7 Data Contract — เมื่อทีม app จะ rename column

**เหตุการณ์จริง:** ทีม backend เปลี่ยน `orders.status` จากค่า `'paid'` เป็น `'PAYMENT_CONFIRMED'` ตอน deploy วันศุกร์ เช้าวันจันทร์ dashboard ยอดขายเป็น 0 ทั้งบริษัท — ไม่มี error สักตัว เพราะ SQL ยังรันได้ แค่ `WHERE status = 'paid'` ไม่เจออะไร

Data contract คือการตกลงให้ชัดล่วงหน้า 4 เรื่อง:

| ส่วนของ contract | ตัวอย่าง |
|---|---|
| **Schema** | column `status` เป็น string, not null, ค่าที่ยอมรับ: `pending / paid / cancelled / refunded` |
| **Semantics** | `paid` = ตัดเงินสำเร็จแล้ว ยังไม่หักคืน / `amount` เป็นบาท รวม VAT |
| **SLA** | ข้อมูลของวันก่อนหน้าพร้อมก่อน 06:00 / ล่าช้าได้ไม่เกิน 1 ชม. / ความครบถ้วน ≥ 99.9% |
| **Ownership** | เจ้าของ: ทีม Checkout / ช่องทางแจ้ง / ต้องแจ้งล่วงหน้ากี่วันถ้าจะเปลี่ยน |

**Breaking vs Non-breaking change:**

| Non-breaking (ปล่อยได้) | Breaking (ต้องมีแผน) |
|---|---|
| เพิ่ม column ใหม่ที่ nullable | ลบ / rename column |
| เพิ่มค่าใหม่ใน enum **ถ้า** ผู้ใช้ตกลงว่าจะรับค่าที่ไม่รู้จักได้ | เปลี่ยน type (`int` → `string`) |
| ขยายความยาว string | เปลี่ยน **ความหมาย** (`amount` จากก่อน VAT เป็นรวม VAT) — อันตรายที่สุดเพราะ schema ไม่เปลี่ยนเลย |
| | เปลี่ยน grain (จาก 1 แถวต่อ order เป็นต่อ item) |

**วิธีทำ breaking change อย่างมีระเบียบ (schema evolution):** เหมือน expand–contract migration ใน PART 15
1) เพิ่ม column/เวอร์ชันใหม่คู่กับของเดิม → 2) ปลายทางย้ายมาใช้ของใหม่ → 3) ประกาศ deprecate พร้อมวันที่ → 4) ลบของเก่า

**Trade-off:** contract ทำให้ทีม app ช้าลงเล็กน้อยทุกครั้งที่เปลี่ยน แต่แลกกับการไม่ต้องมีคนนั่งไล่ว่าทำไม dashboard ของ CFO เป็นศูนย์ ถ้าบังคับ contract เข้ม ๆ กับทุกตาราง ทีมจะหนีไปทำ side channel — เริ่มจากตารางที่มีผู้ใช้สำคัญก่อน

### 6.8 Data Quality Test ที่ควรมีตั้งแต่วันแรก

| Test | เช็คอะไร | จับบั๊กแบบไหน |
|---|---|---|
| **unique** | `order_item_id` ใน fact ไม่ซ้ำ | pipeline รันซ้ำแล้วเบิ้ล, JOIN ทำ row คูณ |
| **not null** | `customer_sk`, `date_key`, `net_amount` ต้องมีค่า | lookup dimension ไม่เจอ, ต้นทางส่งค่าว่าง |
| **relationships** | ทุก `product_sk` ใน fact ต้องมีใน `dim_product` | orphan fact, dimension โหลดไม่ทัน |
| **accepted values** | `status` ∈ {pending, paid, cancelled, refunded} | ต้นทางเปลี่ยน enum (เคส 6.7) |
| **freshness** | `MAX(ingested_at)` ต้องไม่เก่ากว่า 2 ชม. | pipeline ตายเงียบ dashboard โชว์ข้อมูลเมื่อวาน |
| **volume / anomaly** | จำนวนแถววันนี้ไม่ควรต่างจากค่าเฉลี่ยเกิน ±50% | ข้อมูลหายครึ่งหนึ่งแต่ test อื่นผ่านหมด |
| **reconciliation** | ยอดรวมใน mart ≈ ยอดในระบบต้นทาง/บัญชี | logic filter ผิด |

> **ให้มองภาพนี้ว่า** "data test คือ unit test ของข้อมูล (PART 18) — แต่ต่างกันที่ code เปลี่ยนเมื่อเรา deploy ส่วนข้อมูลเปลี่ยนทุกวันเองโดยไม่ขออนุญาต test จึงต้องรัน **ทุกครั้งที่ pipeline รัน** ไม่ใช่แค่ตอน CI"

**Trade-off:** test เยอะ = ปลอดภัยแต่ alert เยอะจนคนเลิกดู (alert fatigue) — กำหนด severity: test ที่ fail แล้วต้อง **หยุด pipeline** (unique ของ fact) vs test ที่แค่ **เตือน** (volume ต่างจากปกติ)

### 6.9 Semantic / Metrics Layer

ปัญหา: "revenue" ถูกนิยามใน BI 4 ตัว, notebook 20 อัน, spreadsheet อีกนับไม่ถ้วน — บางที่หัก refund บางที่ไม่หัก บางที่รวม VAT

```
metric: net_revenue
  source: fact_order_items
  expression: SUM(net_amount) - SUM(refund_amount)
  filters: order_status IN ('paid','refunded')
  dimensions: date, region, category
  owner: Finance
```

นิยามครั้งเดียว ทุกเครื่องมือเรียกใช้ชื่อเดียวกัน → ได้ตัวเลขเดียวกัน
**Trade-off:** เพิ่มอีกชั้นที่ต้องดูแลและเรียนรู้, ผูกกับ tool บางตัว, และคำถาม ad-hoc แปลก ๆ อาจทำไม่ได้ผ่าน layer — ใช้กับ metric หลัก (KPI บริษัท) ก่อน อย่าพยายามใส่ทุกอย่าง (วิธีใช้ metric ในงานวิเคราะห์ดู PART 33)

### 6.10 Data Lineage

```
app_db.orders ─→ raw.orders ─→ stg_orders ─┐
                                           ├─→ int_order_items_enriched ─→ fact_order_items ─→ metric: net_revenue ─→ Dashboard "CEO Weekly"
app_db.order_items ─→ raw.order_items ─→ stg_order_items ─┘
```

ใช้ 2 ทิศ:
- **ไล่ขึ้น (root cause):** dashboard ผิด → ไล่กลับไปหาว่าพังที่ชั้นไหน
- **ไล่ลง (impact analysis):** จะลบ column `orders.coupon_code` → กระทบ model/dashboard ไหนบ้าง ต้องแจ้งใคร

---

## 7. Compare

### 7.1 OLTP vs OLAP

| ประเด็น | OLTP (app database) | OLAP (warehouse) |
|---|---|---|
| งานหลัก | เขียน/อ่านทีละรายการ | อ่านสรุปหลายล้านแถว |
| ตัวอย่าง query | "ดึง order #1001" | "ยอดขายรายเดือน 3 ปี ตามภูมิภาค" |
| ผู้ใช้ | ลูกค้าหลายพันคนพร้อมกัน | analyst / dashboard / job ไม่กี่สิบตัว |
| Schema | normalized (3NF) | dimensional (star) / denormalized |
| Storage | row-based | columnar |
| Latency ที่ต้องการ | มิลลิวินาที | วินาทีถึงนาทีรับได้ |
| ข้อมูล | สถานะปัจจุบัน | ประวัติทั้งหมด |
| Transaction | ACID เข้มข้น ต่อแถว | batch load, append เป็นก้อน |

**ทำไม app DB ไม่ควรเป็น analytics DB (ต้องพูดได้ครบ 4 ข้อ):**
1. **แย่งทรัพยากร** — query รายงานหนัก ๆ ทำให้ checkout ช้า (แม้ใช้ read replica ก็ยังเจอ lag และ replica ก็ไม่ใช่ columnar)
2. **ไม่มีประวัติ** — app เก็บแค่สถานะล่าสุด ที่อยู่เก่าของลูกค้าถูก UPDATE ทับไปแล้ว
3. **ไม่มีข้อมูลจากที่อื่น** — ยอดโฆษณา, payment gateway, CRM ไม่ได้อยู่ใน app DB
4. **Schema เปลี่ยนตามใจ app** — ทีม app ต้อง refactor ได้อิสระโดยไม่ทำ report ทั้งบริษัทพัง

**Trade-off ของการแยก:** มีค่าใช้จ่ายเพิ่ม, ข้อมูลไม่ real-time (latency เป็นนาทีถึงชั่วโมง), และต้องมีคนดูแล pipeline — บริษัทเล็กมากที่มี query รายงานไม่กี่ตัว อ่านจาก read replica ไปก่อนก็สมเหตุสมผล

### 7.2 Star vs Snowflake

| ประเด็น | Star | Snowflake |
|---|---|---|
| Dimension | แบน (denormalized) — `dim_product` มี category, brand ในตัว | แตกต่อ — `dim_product → dim_category → dim_department` |
| จำนวน JOIN | น้อย | มากกว่า |
| ความง่ายสำหรับผู้ใช้ | สูง | ต่ำกว่า |
| พื้นที่ | ซ้ำบ้าง (แต่ dimension เล็กอยู่แล้ว) | ประหยัดกว่าเล็กน้อย |
| การแก้ hierarchy | ต้องอัปเดตหลายแถว | แก้ที่เดียว |
| ใช้เมื่อ | ค่า default ที่ดีเกือบทุกกรณี | hierarchy ใหญ่มาก / ใช้ร่วมหลาย dimension / tool บังคับ |

**สิ่งที่ Senior พูด:** "ใน columnar warehouse พื้นที่ที่ประหยัดจาก snowflake แทบไม่มีความหมาย แต่ความซับซ้อนที่เพิ่มให้ผู้ใช้มีความหมายมาก — เลยเริ่มที่ star"

### 7.3 Warehouse vs Lake vs Lakehouse

| ประเด็น | Data Warehouse | Data Lake | Lakehouse |
|---|---|---|---|
| เก็บอะไร | ตาราง structured ที่ผ่านการจัดแล้ว | ไฟล์ทุกแบบ: CSV, JSON, Parquet, รูป, log | ไฟล์ใน object storage + table format (transaction, schema) |
| Schema | schema-on-write | schema-on-read | ทั้งสองแบบ ตามชั้น |
| จุดเด่น | เร็ว ใช้ SQL ง่าย governance ดี | ถูกมาก เก็บได้ทุกอย่าง เหมาะกับ ML | เก็บถูกแบบ lake + ACID/time travel แบบ warehouse |
| ความเสี่ยง | แพงเมื่อข้อมูลดิบมหาศาล, ไม่เหมาะกับไฟล์ไม่มีโครงสร้าง | กลายเป็น **data swamp** — ไม่มีใครรู้ว่าไฟล์ไหนคืออะไร | ซับซ้อนในการ operate, ecosystem ยังเปลี่ยนเร็ว |
| เหมาะกับ | BI / reporting เป็นหลัก | raw archive, ML, ข้อมูลหลากหลาย | องค์กรที่ต้องการทั้ง BI และ ML บนข้อมูลชุดเดียว |

> **ให้มองภาพนี้ว่า** "เรื่องนี้เป็นเรื่อง storage และ governance — dimensional modeling ยังต้องทำเหมือนเดิมไม่ว่าจะอยู่บนอะไร เปลี่ยน platform ไม่ได้แก้ปัญหา grain ผิด"

### 7.4 ETL vs ELT

| ประเด็น | ETL | ELT |
|---|---|---|
| แปลงที่ไหน | server/engine ก่อนโหลด | ใน warehouse หลังโหลด |
| เก็บ raw | มักไม่เก็บ | เก็บ → replay ได้ |
| แก้ logic ย้อนหลัง | ต้องดึงจากต้นทางใหม่ | รัน transform ใหม่จาก raw |
| ความเป็นส่วนตัว | กรอง PII ก่อนเข้าได้ | PII เข้า warehouse ก่อน ต้องคุม access ให้ดี |
| ใครเขียน | data engineer (โค้ด) | analytics engineer/analyst ก็ได้ (SQL) |

### 7.5 คู่ที่สับสนบ่อย

| คู่ที่สับสน | ต่างกันตรงไหน |
|---|---|
| **Normalization (PART 08) vs Dimensional modeling** | normalize เพื่อ **เขียน** ถูก / dimensional เพื่อ **อ่านสรุป** ง่าย — ไม่ได้ขัดกัน ใช้คนละที่ |
| **Fact vs Dimension** | fact = เหตุการณ์ + ตัวเลข (ยาว) / dimension = บริบท (กว้าง) |
| **Grain vs Primary Key** | grain = ความหมายของ 1 แถวในภาษาธุรกิจ / PK = คอลัมน์ที่ทำให้ unique ทางเทคนิค — PK คือการ implement grain |
| **Surrogate vs Natural Key** | surrogate = warehouse ออกเอง ต่อเวอร์ชัน / natural = จากต้นทาง ต่อ entity |
| **SCD2 vs Snapshot** | SCD2 เก็บ **เฉพาะตอนเปลี่ยน** / snapshot เก็บ **ทุกงวด** แม้ไม่เปลี่ยน |
| **Incremental vs Idempotent** | incremental = ทำแค่ส่วนใหม่ (เรื่องต้นทุน) / idempotent = รันซ้ำได้ผลเดิม (เรื่องความถูก) — ต้องมีทั้งคู่ |
| **Data Contract vs Schema** | schema = รูปร่าง / contract = รูปร่าง + ความหมาย + SLA + เจ้าของ |
| **Lineage vs Data Catalog** | lineage = ข้อมูลไหลไปไหน / catalog = มีข้อมูลอะไร ใครดูแล แปลว่าอะไร |
| **Semantic Layer vs View** | view = SQL ที่บันทึกไว้ / semantic layer = นิยาม metric + dimension ที่ tool ประกอบ query ให้ตามคำถาม |
| **Freshness vs Latency** | freshness = ข้อมูลล่าสุดเก่าแค่ไหน / latency = query ตอบช้าแค่ไหน |

---

## 8. Common Mistakes

| # | สิ่งที่ Junior มักเข้าใจผิด | ความจริง |
|---|---|---|
| 1 | "ต่อ BI เข้า production DB ตรง ๆ ก็ได้ ง่ายดี" | แย่ง resource กับลูกค้า ไม่มีประวัติ ไม่มีข้อมูลจากระบบอื่น และ schema เปลี่ยนเมื่อไรรายงานพัง |
| 2 | "สร้างตารางก่อน เดี๋ยวค่อยคิดว่า 1 แถวคืออะไร" | ไม่ประกาศ grain = ตัวเลขเบิ้ล/หายแน่นอน ประกาศเป็นประโยคเดียวก่อนเสมอ |
| 3 | "ใส่ค่าส่ง (ระดับ order) ไว้ทุกแถวของ item สะดวกดี" | SUM แล้วนับซ้ำ — measure ต้องอยู่ grain เดียวกับตาราง |
| 4 | "SUM ยอดคงเหลือรายวันทั้งเดือน" | semi-additive ห้ามบวกข้ามเวลา ใช้ค่าสิ้นงวดหรือค่าเฉลี่ย |
| 5 | "เฉลี่ย conversion rate ของแต่ละสาขา" | non-additive ต้อง SUM ตัวตั้ง / SUM ตัวหาร เก็บส่วนประกอบไว้ใน fact |
| 6 | "ใช้ Type 1 ทุก dimension ง่ายสุด" | ตัวเลขในอดีตเปลี่ยนเงียบ ๆ รายงานเดือนที่แล้วที่ส่งผู้บริหารไปแล้วจะไม่ตรงกับที่ดูวันนี้ |
| 7 | "JOIN SCD2 ด้วย natural key ก็ได้" | ลูกค้าที่มี 3 เวอร์ชันถูกนับ 3 ครั้ง ต้อง JOIN ด้วย surrogate key หรือกรองช่วงเวลา/`is_current` |
| 8 | "INSERT ข้อมูลใหม่ต่อท้ายทุกรอบก็พอ" | retry ครั้งเดียว = ข้อมูลเบิ้ล pipeline ต้อง idempotent (overwrite partition / MERGE) |
| 9 | "incremental กรองด้วย event_time ของเมื่อวาน" | late-arriving data หายเงียบ ใช้ ingested_at + lookback window |
| 10 | "INNER JOIN fact กับ dimension เสมอ" | fact ที่ dimension ยังมาไม่ถึงหายไปจากยอดรวม ใช้แถว Unknown (-1) |
| 11 | "OBT ตารางเดียวจบ ไม่ต้องมี star" | ข้อมูลซ้ำ grain ปน rebuild แพง ไม่มีนิยามกลาง — ใช้เป็นปลายทาง ไม่ใช่แกนกลาง |
| 12 | "ย้ายไป lakehouse แล้วปัญหาข้อมูลจะหาย" | platform ไม่แก้ grain ผิดหรือนิยามไม่ตรงกัน — modeling ยังต้องทำ |
| 13 | "rename column ใน app เป็นเรื่องภายในทีม" | ถ้ามีคนอ่านข้อมูลอยู่ มันคือ breaking change ของ data contract |
| 14 | "pipeline ไม่ error แปลว่าข้อมูลถูก" | บั๊กข้อมูลส่วนใหญ่ **ไม่ error** — ต้องมี test unique / not null / accepted values / freshness / volume |
| 15 | "ทุกทีมนิยาม revenue เองได้ ยืดหยุ่นดี" | ประชุมผู้บริหารจะหมดเวลาไปกับการเถียงว่าตัวเลขใครถูก — นิยาม metric หลักที่เดียว |
| 16 | "ใช้ dbt แล้วแปลว่ามี data model ที่ดี" | tool ช่วยจัดระเบียบ แต่ grain, SCD, contract ต้องคิดเอง — tool ที่ดีกับ model ที่ผิดก็ได้ตัวเลขผิดที่เป็นระเบียบ |

---

## 9. Debugging

### 9.1 Framework: "ตัวเลขใน dashboard ผิด" ให้ไล่ตามลำดับนี้

```
1. ผิดเทียบกับอะไร?              → นิยามคนละแบบหรือเปล่า (รวม VAT? หัก refund? timezone?)
        ↓                          ครึ่งหนึ่งของเคสจบที่ข้อนี้
2. ข้อมูลสดไหม?                  → เช็ค freshness: MAX(ingested_at), pipeline รันล่าสุดเมื่อไร
        ↓
3. ผิดทุกช่วงหรือบางช่วง?        → บางวัน = ข้อมูลหาย/เบิ้ลในบาง partition
        ↓                          ทั้งหมด = logic/นิยามผิด
4. เช็ค grain                    → COUNT(*) vs COUNT(DISTINCT key) ต่างกัน = row ถูกคูณ
        ↓
5. เช็ค JOIN                     → JOIN แล้วจำนวนแถวเปลี่ยนไหม (fan-out / แถวหาย)
        ↓
6. ไล่ lineage ขึ้นไปทีละชั้น      → mart → intermediate → staging → raw → source
        ↓                          ชั้นแรกที่ตัวเลขไม่ตรงกับต้นทาง = จุดที่พัง
7. เช็ค upstream change          → ต้นทางเพิ่มค่า enum / เปลี่ยน type / เปลี่ยนความหมายหรือเปล่า
        ↓
8. แก้ → backfill ช่วงที่ผิด → เพิ่ม test ที่จะจับได้ครั้งหน้า → แจ้งผู้ใช้
```

> **ให้มองภาพนี้ว่า** "ไล่จาก 'นิยาม' ไปหา 'ข้อมูล' — เพราะตัวเลขที่ 'ผิด' ส่วนใหญ่คือตัวเลขที่ถูกตามนิยามอีกแบบ และถ้าข้อมูลผิดจริง ให้เดินย้อน lineage ทีละชั้นจนเจอชั้นแรกที่ไม่ตรง"

### 9.2 ตารางอาการ → สาเหตุที่น่าสงสัยที่สุด

| อาการ | สงสัยอะไรก่อน | เช็คยังไง |
|---|---|---|
| ยอดสูงเกินจริงเป็นเท่าตัวพอดี | **pipeline รันซ้ำ / ไม่ idempotent** | นับ duplicate ของ key ใน partition วันนั้น |
| ยอดสูงเกินแบบไม่เป็นเท่า | **JOIN fan-out** (bridge, SCD2 ไม่กรอง, dimension มี key ซ้ำ) | นับแถวก่อน/หลัง JOIN, test unique บน dimension |
| ยอดต่ำกว่าระบบต้นทาง | **INNER JOIN ทิ้ง fact** / late-arriving / filter ผิด | LEFT JOIN แล้วดูแถวที่ dimension เป็น NULL |
| ตัวเลขเดือนที่แล้วเปลี่ยนเอง | **SCD Type 1** / backfill / late data | ดูประวัติ dimension, ดู log การ backfill |
| Dashboard เป็น 0 หรือว่างทันที | **upstream เปลี่ยน enum/schema** หรือ pipeline ตาย | accepted values test, freshness, dbt/job log |
| วันนี้ยอดต่ำแปลก ๆ พรุ่งนี้ปกติ | **ข้อมูลยังมาไม่ครบ** (late-arriving) | เทียบ event_time vs ingested_at ของวันนั้น |
| สองทีมได้ตัวเลขไม่เท่ากัน | **นิยาม metric ต่างกัน** / คนละ dimension | ขอ SQL ของทั้งคู่มาวางเทียบ filter ทีละบรรทัด |
| ยอดรายวันไม่ตรงกับยอดรายเดือน | **timezone** (UTC vs Asia/Bangkok) | ดูยอดของวันแรก/วันสุดท้ายของเดือน |
| % รวมทั้งบริษัทไม่ตรงกับค่าเฉลี่ยของสาขา | **non-additive** ถูกเฉลี่ย | คำนวณใหม่แบบ SUM/SUM |
| query บน mart ช้าขึ้นเรื่อย ๆ | ไม่มี partition/clustering, full refresh ตารางใหญ่ | ดู bytes scanned, เปลี่ยนเป็น incremental + partition ตามวัน |

### 9.3 Query ตรวจ grain ที่ใช้บ่อยที่สุด

```sql
SELECT order_item_id, COUNT(*)
FROM fact_order_items
GROUP BY order_item_id
HAVING COUNT(*) > 1
```

ถ้ามีผลลัพธ์แม้แถวเดียว = grain พัง ทุกตัวเลขที่มาจากตารางนี้ไม่น่าเชื่อถือจนกว่าจะแก้

---

## 10. Interview Questions

### 🟢 Junior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| OLTP กับ OLAP ต่างกันยังไง | งานเขียนทีละแถว vs อ่านสรุปหลายล้านแถว + row vs columnar + normalized vs dimensional |
| Fact table กับ Dimension table คืออะไร | fact = เหตุการณ์ + ตัวเลข / dimension = บริบทไว้หั่นและกรอง + ยกตัวอย่างการขาย |
| Star schema คืออะไร | fact กลาง dimension รอบ ๆ + ทำไม JOIN น้อยเลยใช้ง่าย |
| ETL กับ ELT ต่างกันยังไง | แปลงก่อน vs หลังโหลด + ELT เก็บ raw ไว้ replay ได้ |
| Data warehouse กับ data lake ต่างกันยังไง | structured/schema-on-write vs ไฟล์ทุกแบบ/schema-on-read + ความเสี่ยง data swamp |
| ทำไมไม่ query จาก production DB เลย | แย่ง resource, ไม่มีประวัติ, ไม่มีข้อมูลจากที่อื่น, schema เปลี่ยนตาม app |

### 🟡 Mid

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| Grain คืออะไร ทำไมต้องประกาศก่อน | ความหมายของ 1 แถว + ตัวอย่างค่าส่งที่เบิ้ลเมื่อปน grain |
| SCD Type 1/2/3 ต่างกันยังไง ใช้เมื่อไร | ตัวอย่างลูกค้าย้ายภูมิภาค + ผลต่อยอดขายย้อนหลัง + เลือกตามคำถามธุรกิจ |
| ทำไมต้องใช้ surrogate key | SCD2 ทำให้ natural key ไม่ unique, หลาย source ชนกัน, แถว Unknown + trade-off เรื่อง lookup |
| Additive / semi-additive / non-additive คืออะไร | ยอดขาย / ยอดคงเหลือห้ามบวกข้ามเวลา / % ต้อง SUM/SUM |
| Fact 3 แบบมีอะไรบ้าง | transaction, periodic snapshot, accumulating snapshot + ตัวอย่างและคำถามที่แต่ละแบบตอบ |
| Star vs Snowflake เลือกยังไง | star เป็น default ใน columnar, snowflake เมื่อ hierarchy ใหญ่/ใช้ร่วม |
| Idempotent pipeline คืออะไร ทำยังไง | รันซ้ำผลเดิม + overwrite partition / MERGE + เชื่อมกับการ retry และ backfill |
| Data quality test ควรมีอะไรบ้าง | unique, not null, relationships, accepted values, freshness + volume + severity |

### 🔴 Senior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| ออกแบบ data model สำหรับ e-commerce ตั้งแต่ศูนย์ | business process → grain → dimension → fact, conformed dimension, แยก fact ตาม grain, SCD ตามคำถามธุรกิจ, ชั้น raw→mart |
| ทีม app เปลี่ยน schema แล้ว dashboard พังบ่อย จะแก้ยังไง | data contract (schema/semantics/SLA/owner), breaking vs non-breaking, expand–contract, test ที่ต้นทาง, lineage สำหรับ impact analysis — ทั้งเรื่องคนและเรื่อง tech |
| รับมือ late-arriving data ยังไง | event_time vs ingested_at, lookback window + upsert, inferred member/Unknown row, ประกาศว่าตัวเลขกี่วันล่าสุดยังไม่ final |
| Many-to-many ใน dimensional model จัดการยังไง | bridge table + ปัญหา fan-out + weighted vs impact + ต้องตกลงกติกาแบ่งเครดิตกับธุรกิจ |
| Star schema vs One Big Table เลือกยังไง | star เป็นแกนที่ถูกต้อง OBT เป็นปลายทางที่เร็ว + ต้นทุน rebuild, grain ปน, ไม่มีนิยามกลาง |
| ผู้บริหารสองคนได้ revenue ไม่เท่ากัน จะแก้ระยะยาวยังไง | ไล่นิยามก่อน → conformed dimension + semantic/metrics layer + owner ของ metric + governance ไม่ใช่แค่แก้ query |
| ต้อง backfill 2 ปีหลังแก้ logic ทำยังไงให้ปลอดภัย | idempotent + partition ตามวัน + รันเป็นช่วง + เทียบก่อน/หลัง + แจ้งผู้ใช้ว่าตัวเลขอดีตจะเปลี่ยน + ดู cost |

---

## 11. Answer Like a Developer

### โครงมาตรฐาน 4 จังหวะ (เหมือน PART 08 แต่เพิ่มคำถามธุรกิจ)

```
1. นิยามสั้น 1 ประโยค              "X คือ ..."
        ↓
2. คำถามธุรกิจที่มันตอบ/ปัญหาที่แก้   "มันมีไว้เพื่อให้ตอบได้ว่า ..."
        ↓
3. ตัวอย่างที่มีตัวเลข               "เช่นลูกค้าย้ายจาก ... ยอด 5,000 จะไปอยู่ ..."
        ↓
4. Trade-off                        "แต่แลกกับ ... เลยใช้เมื่อ ..."
```

> **ให้มองภาพนี้ว่า** "คำถาม data modeling เกือบทุกข้อ คำตอบที่ดีต้องมี 'ตัวเลขตัวอย่าง' เพราะบั๊กของเรื่องนี้คือตัวเลขผิด — ถ้าอธิบายได้ว่าตัวเลขเบิ้ลหรือหายยังไง คนฟังจะรู้ทันทีว่าคุณเคยเจอจริง"

### ตัวอย่างการตอบ: "SCD Type 2 คืออะไร"

**❌ คำตอบระดับท่องจำ:** "SCD Type 2 คือการเพิ่มแถวใหม่เวลาข้อมูลเปลี่ยนครับ"

**✅ คำตอบระดับที่อยากได้:**
> "SCD Type 2 คือวิธีเก็บประวัติของ dimension โดยเพิ่มแถวใหม่ทุกครั้งที่ attribute ที่เราสนใจเปลี่ยน แต่ละแถวมี surrogate key ของตัวเองพร้อม valid_from, valid_to ครับ
> มันมีไว้ตอบคำถามแบบ 'ยอดขายตามภูมิภาค ณ เวลาที่ขาย' เช่นลูกค้าอยู่เชียงใหม่ซื้อ 5,000 แล้วย้ายไปกรุงเทพซื้ออีก 3,000 — ถ้าเขียนทับแบบ Type 1 ยอด 8,000 จะไปอยู่กรุงเทพหมด รายงานปีที่แล้วเปลี่ยนเองย้อนหลัง
> แต่ Type 2 ตารางโตขึ้นเรื่อย ๆ, ตอนโหลด fact ต้อง lookup เวอร์ชันที่ถูก และถ้าใครไป JOIN ด้วย natural key ลูกค้าจะถูกนับซ้ำ ผมเลยใช้ Type 2 เฉพาะ attribute ที่ธุรกิจวิเคราะห์ตามเวลาจริง ๆ ส่วนอย่างเบอร์โทรใช้ Type 1 ครับ"

### ตัวอย่างการตอบ: "ทำไมไม่ทำ report จาก production database"

> "ได้ในช่วงแรกครับ ถ้ามีรายงานไม่กี่ตัวอ่านจาก read replica ก็พอ แต่พอโตจะเจอ 4 เรื่อง — query หนักไปแย่ง resource กับลูกค้า, app เก็บแค่สถานะล่าสุดเลยไม่มีประวัติ, ข้อมูลจากระบบอื่นเช่น ads หรือ payment ไม่ได้อยู่ในนั้น และทีม app เปลี่ยน schema ได้ตลอด
> เลยแยกไป warehouse ที่เป็น columnar โหลดแบบ ELT เก็บ raw ไว้ แล้ว model เป็น star schema ข้างใน แลกกับข้อมูลที่ช้าลงเป็นนาทีถึงชั่วโมงและมี pipeline ต้องดูแลครับ"

### คำพูดที่ทำให้ดูมีประสบการณ์

| สถานการณ์ | พูดแบบนี้ |
|---|---|
| ถูกให้ออกแบบตาราง | "ขอเริ่มจากประกาศ grain ก่อนครับ — 1 แถวของตารางนี้คือ..." |
| ถูกถามเรื่องตัวเลขไม่ตรง | "ผมจะเช็คนิยามก่อนว่าเทียบของเดียวกันไหม แล้วค่อยไล่ lineage ทีละชั้น" |
| ถูกถามเรื่อง SCD | "ขึ้นกับว่าธุรกิจอยากให้ยอดในอดีตอยู่กับค่าเก่าหรือค่าปัจจุบันครับ" |
| ถูกถามเรื่อง tool (dbt, Airflow, Spark) | "tool ช่วยเรื่องระเบียบและการรัน แต่หลักคือ layer, idempotency, test — ใช้ tool ไหนก็ต้องมีสามอย่างนี้" |
| ถูกถามเรื่องการเปลี่ยน schema | "ถือว่าเป็น contract ครับ เพิ่มก่อน ย้ายผู้ใช้ แล้วค่อยลบ ไม่ rename ตรง ๆ" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้องสัมภาษณ์:

- **OLTP** = จดทีละรายการ normalized row store / **OLAP** = สรุปหลายล้านแถว dimensional columnar — **app DB ไม่ใช่ analytics DB** (แย่ง resource / ไม่มีประวัติ / ไม่มีข้อมูลอื่น / schema เปลี่ยนตาม app)
- **Kimball 4 ขั้น:** business process → **grain** → dimension → fact — **grain ประกาศก่อนเสมอ** เป็นประโยคเดียว
- **Fact** = เหตุการณ์ + ตัวเลข (ยาว ผอม) / **Dimension** = บริบท (สั้น กว้าง) / **Star** = default, **Snowflake** เมื่อ hierarchy ใหญ่จริง
- **Fact 3 แบบ:** transaction (ทุกเหตุการณ์) / periodic snapshot (ทุกงวด) / accumulating snapshot (1 กระบวนการ update ตามขั้น)
- **Measure:** additive บวกได้หมด / semi-additive **ห้ามบวกข้ามเวลา** / non-additive ต้อง **SUM/SUM**
- **Surrogate key** เพราะ SCD2, หลาย source, key ต้นทางเปลี่ยน, แถว Unknown
- **SCD 1** เขียนทับ (ประวัติเปลี่ยน) / **SCD 2** เพิ่มแถว (ถูกตามเวลา แต่ระวังนับซ้ำ) / **SCD 3** เก็บค่าก่อนหน้า 1 ขั้น
- **Conformed dimension** = นิยามเดียวทุก fact ใช้ร่วม / **Bridge** = N:M ระวัง fan-out ใช้ weight
- **OBT** = เร็วและง่าย แต่เป็นปลายทาง ไม่ใช่แกนกลาง
- **ELT** เก็บ raw แล้ว transform ใน warehouse / **Warehouse vs Lake vs Lakehouse** = เรื่อง storage ไม่ได้แทน modeling
- **Layer:** raw → staging → intermediate → marts → semantic
- **Incremental** = ประหยัด / **Idempotent** = รันซ้ำได้ผลเดิม — ต้องมีทั้งคู่ถึง backfill ได้ปลอดภัย
- **Late-arriving:** ใช้ ingested_at + lookback + upsert + แถว Unknown
- **Data contract** = schema + semantics + SLA + owner / breaking change ทำแบบ expand–contract
- **Test:** unique, not null, relationships, accepted values, freshness (+ volume, reconciliation)
- ตัวเลขผิด: **นิยาม → freshness → grain → JOIN → ไล่ lineage → upstream change → backfill + เพิ่ม test**

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **App DB เพื่อเขียน Warehouse เพื่ออ่านสรุป** — normalize ที่หนึ่ง dimensional อีกที่หนึ่ง ไม่ได้ขัดกัน
2. **Grain ก่อนทุกอย่าง** — measure ทุกตัวต้องอยู่ grain เดียวกับตาราง ไม่งั้นเบิ้ล
3. **Fact = ตัวเลข Dimension = บริบท** — semi-additive ห้ามบวกข้ามเวลา, % ต้อง SUM/SUM
4. **SCD เลือกจากคำถามธุรกิจ** — "ยอดเก่าควรอยู่กับค่าเก่าหรือค่าใหม่?" Type 2 ต้องใช้ surrogate key
5. **Pipeline ต้อง idempotent + มี test + มี contract** — บั๊กข้อมูลส่วนใหญ่ไม่ error มันแค่ผิดเงียบ ๆ

### Keyword ย่อ

```
OLTP          → จดทีละรายการ (row, normalized)
OLAP          → สรุปทีละล้าน (columnar, dimensional)
Grain         → 1 แถว = อะไร (ประกาศก่อน)
Fact          → เหตุการณ์ + ตัวเลข
Dimension     → ใคร ที่ไหน อะไร เมื่อไร
Star          → fact กลาง dim รอบ (default)
Snowflake     → dim แตกต่อ (JOIN เยอะ)
Transaction F → ทุกเหตุการณ์
Periodic F    → ถ่ายรูปทุกงวด
Accumulating F→ บัตรสะสมแสตมป์
Additive      → บวกได้หมด
Semi-additive → ห้ามบวกข้ามเวลา
Non-additive  → SUM/SUM
Surrogate Key → เลขของเวอร์ชัน
Natural Key   → เลขจากต้นทาง
SCD1          → เขียนทับ
SCD2          → เพิ่มแถว + valid_from/to
SCD3          → คอลัมน์ค่าก่อนหน้า
Conformed Dim → นิยามเดียวทั้งบริษัท
Bridge        → N:M + weight (ระวัง fan-out)
OBT           → ตารางกว้าง = ปลายทาง ไม่ใช่แกน
ETL / ELT     → แปลงก่อนโหลด / โหลดก่อนแปลง
Lake/WH/LH    → โกดัง / ร้านจัดชั้น / โกดังมีบัญชี
Layers        → raw → staging → intermediate → marts
Incremental   → ทำแค่ส่วนใหม่
Idempotent    → รันซ้ำผลเดิม
Backfill      → ซ่อมอดีต (ต้อง idempotent)
Late-arriving → ingested_at + lookback + Unknown row
Data Contract → schema + ความหมาย + SLA + เจ้าของ
Lineage       → ผังท่อน้ำ (ไล่ขึ้นหาสาเหตุ ไล่ลงหาผลกระทบ)
DQ Tests      → unique / not null / relationships / accepted / freshness
Semantic Layer→ พจนานุกรมตัวเลข
```

---

[← สารบัญ](./00-README-TOC.md)
