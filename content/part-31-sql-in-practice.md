# PART 31 — SQL IN PRACTICE

> ตำแหน่งในภาพใหญ่: Data & Analytics Layer — ชั้นที่เอา "ความจริง" ที่ database เก็บไว้ (PART 8) มาตอบคำถามธุรกิจ ถ้า SQL ผิดแม้แต่บรรทัดเดียว dashboard ทั้งบริษัทจะโกหกทุกคนแบบเนียน ๆ

---

## 1. Big Picture

PART 8 สอนว่า database **เก็บ** ความจริงยังไง
PART นี้สอนว่าจะ **ถาม** ความจริงนั้นยังไงให้ได้คำตอบที่ถูก

ลองนึกภาพวันจันทร์เช้า หัวหน้าถามคำถามง่าย ๆ ข้อเดียว:

> "เดือนที่แล้วเรามียอดขายเท่าไร และลูกค้าใหม่ซื้อซ้ำกี่เปอร์เซ็นต์?"

ฟังดูเหมือนเขียน `SUM` แล้วจบ แต่ในงานจริงมีกับดักซ่อนอยู่ทุกบรรทัด:

- JOIN `orders` กับ `order_items` แล้ว `SUM(total_amount)` → **ยอดขายเบิ้ลเป็น 3 เท่า** โดยไม่มี error สักตัว
- ใช้ `created_at` แบบ UTC ตัดวัน → order ช่วงตี 0–7 โมงเช้าเวลาไทย **ไปตกเดือนผิด**
- มี event ซ้ำจากระบบ retry (PART 16) → ลูกค้า "ซื้อซ้ำ" ทั้งที่จริง ๆ ซื้อครั้งเดียว
- `NOT IN` กับ subquery ที่มี NULL → **ได้ผลลัพธ์ 0 แถว** แล้วคุณรายงานว่า "ไม่มีลูกค้าหาย"

**นี่คือความจริงที่เจ็บที่สุดของ SQL: query ที่ผิดส่วนใหญ่ "รันผ่าน" และ "ได้ตัวเลขที่ดูสมเหตุสมผล"**
Bug ใน backend มักจะ crash ให้เห็น แต่ bug ใน SQL เชิง analytics มักจะ **เงียบ** แล้วไปโผล่ในห้องประชุมผู้บริหาร

**SQL in Practice → การเขียน query ที่ถูกต้องก่อน เร็วทีหลัง และพิสูจน์ได้ว่าตัวเลขเชื่อถือได้**

Chapter นี้แบ่งเป็น 3 ชั้น ตาม tagline **Query · Window · Quality**:

| ชั้น | ระดับ | เรื่องที่ต้องเรียน |
|---|---|---|
| **Query** — ถามให้ถูก | 🟢 Basic → 🟡 Mid | SELECT/WHERE/ORDER BY/LIMIT, ลำดับการทำงานจริง, Aggregate, GROUP BY/HAVING, **Grain**, NULL, JOIN, Fan-out, Semi/Anti-join, CTE, CASE WHEN |
| **Window** — ถามข้ามแถว | 🟡 Mid → 🔴 Advanced | ROW_NUMBER/RANK/DENSE_RANK, PARTITION BY, LAG/LEAD, Running total, Moving average, Frame (ROWS vs RANGE), Dedup, Top-N, Gaps & Islands, Date/Time zone |
| **Quality** — พิสูจน์ว่าถูก และเร็วพอ | 🔴 Advanced | Row count, Uniqueness, Null rate, Referential check, Reconciliation, EXPLAIN, Performance บนตารางใหญ่ |

**สิ่งที่ chapter นี้ไม่ทำซ้ำ:** transaction, isolation, lock, index internals (B-Tree), N+1, pagination — อยู่ใน **PART 8** แล้ว ที่นี่จะอ้างถึงเฉพาะตอนจำเป็น

### Dataset เดียวที่ใช้ทั้งบท

```
users                 orders                   order_items              events
─────                 ──────                   ───────────              ──────
id (PK)      ←──┐     id (PK)        ←──┐      id (PK)                  event_id
name            └──── user_id              └─── order_id                user_id
country               status                    product_id ──→ products event_type
created_at            total_amount              quantity       (id,     event_time (timestamptz)
                      created_at (timestamptz)  price_at_purchase name, ingested_at
                                                               category)
```

- `orders.status` มีค่า `'paid' | 'cancelled' | 'refunded' | 'pending'`
- `events` มาจาก tracking/queue จึง **มีโอกาสซ้ำ** (at-least-once delivery — ดู PART 16)
- ทุก timestamp เก็บเป็น UTC แต่ธุรกิจนับวันตามเวลาไทย (`Asia/Bangkok`, UTC+7)

> **ให้มองภาพนี้ว่า** "ตารางชุดนี้คือเวทีเดียวกันทั้งบท — ทุกกับดักที่เราจะเจอเกิดจากการถามตารางชุดนี้ผิดวิธี ไม่ใช่เพราะข้อมูลซับซ้อน"

---

## 2. Keywords

### 2.1 Query พื้นฐาน

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| SELECT | เลือก column ที่อยากเห็น | "ขอดูช่องไหน" |
| WHERE | กรองแถว **ก่อน** รวมกลุ่ม | ตะแกรงแรก |
| ORDER BY | เรียงผลลัพธ์ | ไม่ใส่ = ลำดับไม่รับประกัน |
| LIMIT | เอาแค่ N แถวแรก | ไม่มี ORDER BY = สุ่มแบบไม่ตั้งใจ |
| Logical Query Order | ลำดับที่ DB "คิด" จริง | FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY |
| Aggregate Function | ฟังก์ชันรวมหลายแถวเป็นค่าเดียว | COUNT / SUM / AVG / MIN / MAX |
| GROUP BY | จัดกลุ่มแถวที่มีค่าเหมือนกัน | 1 กลุ่ม = 1 แถวผลลัพธ์ |
| HAVING | กรอง **หลัง** รวมกลุ่ม | ตะแกรงที่สอง |
| Grain | 1 แถวของตารางนี้ = 1 อะไร | คำถามแรกก่อนเขียนทุก query |
| DISTINCT | ตัดแถวซ้ำ | มักเป็นยาแก้ปวด ไม่ใช่ยารักษา |

### 2.2 NULL และ JOIN

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| NULL | "ไม่รู้ค่า" ไม่ใช่ 0 ไม่ใช่ว่าง | ไม่รู้ ≠ ไม่มี |
| Three-valued Logic | ผลเปรียบเทียบมี TRUE / FALSE / UNKNOWN | `NULL = NULL` → UNKNOWN |
| COUNT(*) vs COUNT(col) | นับทุกแถว vs นับเฉพาะแถวที่ col ไม่ NULL | ดาว = ทุกแถว |
| COALESCE | เอาค่าแรกที่ไม่ NULL | ใส่ค่า default |
| NULLIF | ถ้าสองค่าเท่ากันให้เป็น NULL | กันหารด้วยศูนย์ |
| INNER JOIN | เอาเฉพาะที่มีคู่ | ถ่ายรูปเฉพาะคนที่มาทั้งคู่ |
| LEFT JOIN | ฝั่งซ้ายครบ ขวาไม่มีเป็น NULL | ซ้ายห้ามหาย |
| Fan-out | JOIN แล้วแถวงอก | 1 order × 3 item = 3 แถว |
| Double Counting | นับ/รวมซ้ำเพราะ fan-out | ยอดขายเบิ้ล |
| Semi-join | "มีคู่อย่างน้อย 1 ไหม" ไม่เอาข้อมูลอีกฝั่ง | EXISTS |
| Anti-join | "ไม่มีคู่เลย" | NOT EXISTS |
| CTE (WITH) | ตั้งชื่อผลลัพธ์ชั่วคราว | อ่านจากบนลงล่างเหมือนสูตรอาหาร |
| CASE WHEN | if/else ใน SQL | แปลงค่า / แยกกลุ่ม |
| Conditional Aggregation | รวมแบบมีเงื่อนไขใน query เดียว | SUM(CASE WHEN ...) / FILTER |

### 2.3 Window Functions และเวลา

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Window Function | คำนวณข้ามแถวโดย **ไม่ยุบแถว** | GROUP BY ที่ไม่กินแถว |
| PARTITION BY | แบ่ง window เป็นกลุ่ม | GROUP BY ของ window |
| ROW_NUMBER | เลขลำดับไม่ซ้ำ | 1,2,3,4 |
| RANK | ลำดับที่เสมอกันได้ แล้วกระโดด | 1,1,3 |
| DENSE_RANK | ลำดับที่เสมอกันได้ ไม่กระโดด | 1,1,2 |
| LAG / LEAD | ดูค่าแถวก่อนหน้า / ถัดไป | มองข้างหลัง / ข้างหน้า |
| Frame Clause | ขอบเขตแถวที่ window มองเห็น | ROWS / RANGE BETWEEN ... |
| ROWS vs RANGE | นับเป็นแถว vs นับเป็นค่า | RANGE รวมแถวที่ค่าเท่ากันไปด้วย |
| Dedup | ตัดข้อมูลซ้ำแบบเลือกได้ว่าเก็บตัวไหน | ROW_NUMBER() = 1 |
| Gaps & Islands | หาช่วงต่อเนื่อง / ช่วงขาด | วันที่ − ลำดับ = เลขเกาะ |
| Time Zone | เวลาเดียวกันแต่ปฏิทินต่างกัน | เก็บ UTC แสดง local |
| Half-open Interval | ช่วง `>= start AND < end` | ไม่ใช้ BETWEEN กับ timestamp |

### 2.4 Quality และ Performance

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Data Quality Check | query ที่ตรวจว่าข้อมูลเชื่อได้ | test ของข้อมูล |
| Uniqueness Check | key ต้องไม่ซ้ำ | GROUP BY key HAVING COUNT(*) > 1 |
| Null Rate | สัดส่วน NULL ใน column | column สำคัญ NULL พุ่ง = มีอะไรพัง |
| Referential Check | FK ชี้ไปหาของที่มีจริงไหม | orphan row |
| Reconciliation | เทียบตัวเลขกับแหล่งต้นทาง | ยอดใน dashboard = ยอดใน payment ไหม |
| EXPLAIN (ANALYZE) | ดูแผนการทำงานของ query | ถาม DB ว่า "คุณจะทำยังไง" |
| Partition / Partition Pruning | แบ่งตารางใหญ่ตามช่วง แล้วอ่านเฉพาะส่วนที่ต้องใช้ | เปิดเฉพาะลิ้นชักเดือนที่ถาม |
| Sargable | เงื่อนไขที่ใช้ index ได้ | อย่าเอาฟังก์ชันครอบ column |

---

## 3. Mental Model

### Mental Model หลัก: SQL คือ "สายพานโรงงาน" ไม่ใช่ประโยคภาษาอังกฤษ

เราเขียน SQL เริ่มจาก `SELECT` แต่ database **ไม่ได้ทำ SELECT ก่อน**
มันทำตามลำดับนี้เสมอ (logical order — planner อาจสลับวิธีทำจริงได้ แต่ผลลัพธ์ต้องเหมือนทำตามลำดับนี้):

```
เขียน:   SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT

ทำจริง:
  1. FROM / JOIN   ← เอาตารางมาต่อกัน (แถวอาจงอกตรงนี้!)
  2. WHERE         ← กรองทีละแถว
  3. GROUP BY      ← ยุบแถวเป็นกลุ่ม
  4. HAVING        ← กรองกลุ่ม
  5. SELECT        ← คำนวณ column / window function ทำงานตรงนี้
  6. DISTINCT
  7. ORDER BY      ← เรียง (ใช้ alias จาก SELECT ได้แล้ว)
  8. LIMIT         ← ตัดเหลือ N แถว
```

> **ให้มองภาพนี้ว่า** "ข้อมูลไหลผ่านสายพานทีละสถานี แต่ละสถานีเห็นเฉพาะของที่สถานีก่อนหน้าส่งมา — ถ้าเข้าใจลำดับนี้ คุณจะตอบได้เองว่าทำไม WHERE ใช้ alias ไม่ได้ ทำไม WHERE ใช้ COUNT ไม่ได้ และทำไม window function อยู่ใน WHERE ไม่ได้"

คำถามที่ลำดับนี้ตอบได้ทันที:

| คำถาม | คำตอบจากสายพาน |
|---|---|
| ทำไม `WHERE total_with_tax > 100` (alias จาก SELECT) error | WHERE (สถานี 2) ทำก่อน SELECT (สถานี 5) — alias ยังไม่เกิด |
| ทำไม `WHERE COUNT(*) > 5` error | ตอน WHERE ยังไม่มีกลุ่ม → ต้องใช้ HAVING |
| ทำไม `WHERE ROW_NUMBER() OVER(...) = 1` ไม่ได้ | window คำนวณที่ SELECT → ต้องห่อด้วย subquery/CTE ก่อนกรอง |
| ทำไม ORDER BY ใช้ alias ได้ | ORDER BY มาหลัง SELECT |

(หมายเหตุ: บาง DB เช่น PostgreSQL/MySQL ยอมให้ `GROUP BY` ใช้ alias ได้ และ Snowflake/BigQuery มี `QUALIFY` ไว้กรอง window ได้เลย — เป็นส่วนขยายเฉพาะ dialect ไม่ใช่มาตรฐาน)

### Mental Model ที่ 2: "Grain" — ก่อนเขียนทุก query ถามว่า 1 แถว = 1 อะไร

นี่คือ concept ที่แยกคนเขียน SQL ได้ กับคนเขียน SQL **ถูก**

| ตาราง / ผลลัพธ์ | Grain (1 แถว = ...) |
|---|---|
| `users` | 1 ผู้ใช้ |
| `orders` | 1 คำสั่งซื้อ |
| `order_items` | 1 สินค้าใน 1 คำสั่งซื้อ |
| `events` | 1 การกระทำ (แต่อาจซ้ำ!) |
| `orders JOIN order_items` | **1 สินค้าใน 1 คำสั่งซื้อ** — grain เปลี่ยนเป็นของตารางที่ละเอียดกว่า |
| `GROUP BY user_id` | 1 ผู้ใช้ |
| `GROUP BY user_id, DATE(created_at)` | 1 ผู้ใช้ต่อ 1 วัน |

**กฎทอง:** metric ต้องถูกรวมที่ grain ของมันเอง
`total_amount` เป็นของ grain "order" → ถ้าไปรวมที่ grain "order_item" = นับซ้ำ

> **ให้มองภาพนี้ว่า** "Grain คือหน่วยนับ — ถ้าคุณนับเงินเป็นใบ แต่มีคนเอาใบเดียวกันไปถ่ายเอกสาร 3 ครั้งแล้วใส่ปนมา คุณจะรวยขึ้น 3 เท่าบนกระดาษ"

### Mental Model ที่ 3: Correct → Clear → Fast (ตามลำดับนี้เท่านั้น)

```
1) Correct  — ตัวเลขถูกไหม? grain ถูกไหม? NULL จัดการแล้วไหม?
        ↓
2) Clear    — คนอื่นอ่านแล้วเข้าใจไหม? (CTE ตั้งชื่อดี ๆ)
        ↓
3) Fast     — ค่อย optimize ตอนวัดแล้วว่าช้า (EXPLAIN)
```

query ที่เร็วแต่ผิด **อันตรายกว่า** query ที่ช้าแต่ถูก เพราะคนจะเชื่อมันเร็วขึ้น

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำ:
SELECT           = เลือกช่องที่จะโชว์
WHERE            = ตะแกรงแรก กรองเม็ดทราย (แถว)
GROUP BY         = เทเม็ดทรายลงถังตามสี
HAVING           = ตะแกรงที่สอง กรองถัง
Grain            = หน่วยนับของตาราง "1 แถว = 1 อะไร"
NULL             = กล่องปิดฝา — ไม่รู้ว่าข้างในมีอะไร
INNER JOIN       = ถ่ายรูปคู่ เฉพาะคนที่มาทั้งคู่
LEFT JOIN        = ฝั่งซ้ายมาครบ ฝั่งขวาใครไม่มาก็เว้นที่ว่าง
Fan-out          = ถ่ายเอกสารใบเสร็จซ้ำแล้วเอาไปรวมยอด
EXISTS           = ถามแค่ "มีไหม" ไม่ต้องขนของมา
CTE              = สูตรอาหารแบ่งเป็นขั้น ๆ มีชื่อ
Window Function  = มองผ่านหน้าต่างไปยังแถวเพื่อนบ้าน โดยไม่ยุบแถวตัวเอง
PARTITION BY     = แบ่งห้อง แต่ละห้องมีหน้าต่างของตัวเอง
Frame            = ขนาดของหน้าต่าง (เห็นกี่แถว)
Data Quality     = ตรวจสุขภาพข้อมูลก่อนส่งให้หมอ (ผู้บริหาร) อ่าน
EXPLAIN          = ขอดูแผนที่ก่อนออกเดินทาง
```

### ภาพจำเจาะลึก: GROUP BY vs Window Function (ข้อนี้ต้องแม่น)

```
ข้อมูล:  user A: 100, 200    user B: 50

GROUP BY user_id + SUM          SUM() OVER (PARTITION BY user_id)
────────────────────            ─────────────────────────────────
A | 300                         A | 100 | 300
B |  50                         A | 200 | 300
                                B |  50 |  50
(แถวยุบเหลือ 1 ต่อกลุ่ม)          (แถวอยู่ครบ + มีค่ารวมแปะข้าง ๆ)
```

> **ให้มองภาพนี้ว่า** "GROUP BY คือการเทของรวมใส่ถังแล้วเหลือแค่ป้ายถัง ส่วน window function คือทุกชิ้นยังอยู่ แต่แต่ละชิ้นมีป้ายบอกว่าถังของมันหนักเท่าไร"

### ภาพจำ NULL: กล่องปิดฝา

```
กล่อง A (NULL) = กล่อง B (NULL) ?   → "ไม่รู้"  (ไม่ใช่ TRUE)
กล่อง A (NULL) > 5 ?                → "ไม่รู้"
NOT "ไม่รู้"                         → ยัง "ไม่รู้"
WHERE เอาเฉพาะ TRUE                  → "ไม่รู้" ถูกทิ้งเงียบ ๆ
```

🧠 ภาพจำ: **"NULL ติดต่อได้ — อะไรไปแตะ NULL ก็กลายเป็น NULL (ยกเว้นคนที่ออกแบบมาเพื่อรับมือ เช่น IS NULL, COALESCE, COUNT)"**

---

## 5. How It Works

### 5.1 🟢 SELECT / WHERE / ORDER BY / LIMIT — 4 ตัวแรกที่ใช้ทุกวัน

```sql
SELECT id, user_id, total_amount, created_at
FROM orders
WHERE status = 'paid'
  AND created_at >= '2026-08-01' AND created_at < '2026-09-01'
ORDER BY total_amount DESC, id
LIMIT 10;
```

"10 order ที่ยอดสูงสุดของเดือนสิงหาคม" — สังเกต 3 นิสัยที่ดี:

1. **เลือก column ที่ใช้จริง** ไม่ใช่ `SELECT *` (ประหยัด I/O และในระบบ columnar = ประหยัดเงินตรง ๆ)
2. **ช่วงเวลาแบบ half-open** `>= ต้นเดือน AND < ต้นเดือนถัดไป` — ไม่พลาดเสี้ยววินาทีสุดท้ายแบบ `BETWEEN ... '2026-08-31'`
3. **ORDER BY มี tie-breaker (`id`)** — ถ้ายอดเท่ากัน ผลลัพธ์จะเหมือนเดิมทุกครั้ง (deterministic)

⚠️ `LIMIT` โดยไม่มี `ORDER BY` = DB ส่งแถวไหนมาก็ได้ วันนี้ได้ชุดหนึ่ง พรุ่งนี้ได้อีกชุด

### 5.2 🟢 Aggregate + GROUP BY + HAVING

```sql
SELECT user_id,
       COUNT(*)          AS order_count,
       SUM(total_amount) AS revenue
FROM orders
WHERE status = 'paid'          -- กรองแถวก่อน
GROUP BY user_id
HAVING COUNT(*) >= 3           -- กรองกลุ่มทีหลัง
ORDER BY revenue DESC;
```

"ลูกค้าที่จ่ายเงินแล้วอย่างน้อย 3 order เรียงตามยอดซื้อ"

**กฎของ GROUP BY:** ทุก column ใน SELECT ต้องเป็น (1) column ที่อยู่ใน GROUP BY หรือ (2) อยู่ใน aggregate — ถ้าเลือก `name` โดยไม่ group มัน DB จะไม่รู้ว่าจะเอา name ของแถวไหนในกลุ่ม

**WHERE vs HAVING ในเชิง performance:** ถ้าเงื่อนไขกรองได้ตั้งแต่ระดับแถว ให้ใส่ใน WHERE เสมอ — กรองก่อนรวม = รวมน้อยลง

### 5.3 🟢 NULL semantics — กับดักที่เจอทุกสัปดาห์

| นิพจน์ | ผลลัพธ์ | ทำไม |
|---|---|---|
| `NULL = NULL` | UNKNOWN | ไม่รู้ทั้งคู่ จะบอกว่าเท่ากันได้ยังไง |
| `col = NULL` | UNKNOWN เสมอ | ต้องใช้ `col IS NULL` |
| `COUNT(*)` | นับทุกแถว | ไม่สนค่า |
| `COUNT(col)` | นับเฉพาะ col ที่ไม่ NULL | ใช้หา "กี่แถวที่มีค่า" |
| `COUNT(DISTINCT col)` | นับค่าไม่ซ้ำ ไม่รวม NULL | |
| `AVG(col)` | เฉลี่ยเฉพาะที่ไม่ NULL | ตัวหารเล็กลงเงียบ ๆ! |
| `SUM(col)` ที่ทุกแถวเป็น NULL | NULL (ไม่ใช่ 0) | ต้อง `COALESCE(SUM(col), 0)` |
| `100 + NULL` | NULL | NULL ติดต่อ |
| `WHERE status <> 'cancelled'` | **ไม่เอาแถวที่ status เป็น NULL** | NULL <> 'x' = UNKNOWN → ถูกทิ้ง |

**ตัวอย่างที่ทำตัวเลขเพี้ยนจริง:** สมมติ `discount` เป็น NULL สำหรับ order ที่ไม่มีส่วนลด
`AVG(discount)` จะได้ "ส่วนลดเฉลี่ยของ order ที่มีส่วนลด" ไม่ใช่ "ส่วนลดเฉลี่ยต่อ order"
ถ้าต้องการอย่างหลัง → `AVG(COALESCE(discount, 0))`

> **ให้มองภาพนี้ว่า** "ทุกครั้งที่เห็น column ที่ NULL ได้ ให้ถามว่า NULL ตรงนี้แปลว่า 'ศูนย์' หรือแปลว่า 'ไม่รู้' — สองความหมายนี้ให้ตัวเลขคนละเรื่อง และ SQL ไม่รู้แทนคุณ"

**Trade-off ของ COALESCE:** ใส่ 0 แทน NULL ทำให้ตัวเลขรวมได้ แต่ก็ **ลบร่องรอย** ว่าข้อมูลขาด — บางครั้งควรรายงาน "ไม่ทราบ" แยกออกมามากกว่าแอบใส่ 0

### 5.4 🟡 JOIN, LEFT JOIN pitfall และ Fan-out

(พื้นฐาน JOIN 4 แบบอยู่ใน PART 8 หัวข้อ 6.3 — ตรงนี้เน้นกับดักเชิง analytics)

**กับดักที่ 1: LEFT JOIN แล้วกรองฝั่งขวาใน WHERE**

```sql
-- ❌ ตั้งใจ: user ทุกคน + จำนวน order ที่ paid (0 ก็ต้องโชว์)
SELECT u.id, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid'        -- user ที่ไม่มี order มี o.status = NULL → ถูกทิ้ง!
GROUP BY u.id;

-- ✅ ย้ายเงื่อนไขฝั่งขวาไปไว้ใน ON
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
```

กฎจำ: **เงื่อนไขของตารางฝั่งขวาใน LEFT JOIN → ใส่ใน ON / เงื่อนไขของตารางฝั่งซ้าย → ใส่ใน WHERE**
และสังเกตว่าใช้ `COUNT(o.id)` ไม่ใช่ `COUNT(*)` — เพราะ `COUNT(*)` จะนับแถว NULL ของ user ที่ไม่มี order เป็น 1

**กับดักที่ 2: Fan-out → Double counting (ตัวที่แพงที่สุดในบทนี้)**

```
orders                      order_items
id | total_amount           order_id | product_id
1  | 900                    1        | A
                            1        | B
                            1        | C

orders JOIN order_items  →  1 | 900 | A
                            1 | 900 | B      ← 900 ถูกถ่ายเอกสาร 3 ครั้ง
                            1 | 900 | C

SUM(total_amount) = 2,700   ❌  (จริง ๆ คือ 900)
```

> **ให้มองภาพนี้ว่า** "JOIN กับตารางที่ grain ละเอียดกว่า = ทุกแถวของฝั่งหยาบถูกคัดลอกตามจำนวนลูก — metric ของฝั่งหยาบห้ามเอามา SUM หลัง JOIN"

**วิธีแก้ 3 ทาง (เรียงจากดีที่สุด):**

| วิธี | ทำยังไง | Trade-off |
|---|---|---|
| **Aggregate ก่อน JOIN** | สรุป `order_items` ให้เหลือ grain "order" ใน CTE ก่อน แล้วค่อย JOIN แบบ 1:1 | ถูกต้องและชัดที่สุด เขียนยาวขึ้นนิด |
| **รวมที่ grain ของ metric** | ถ้าอยากได้ยอดขาย ใช้ `SUM(quantity * price_at_purchase)` จาก items เอง | ต้องมั่นใจว่ายอดสองแหล่งตรงกัน (ส่วนลดระดับ order?) |
| `SUM(DISTINCT total_amount)` | ❌ **อย่าใช้** | 2 order ที่ยอดเท่ากันพอดีจะถูกรวมเหลือครั้งเดียว — ผิดแบบสุ่ม |

**สัญญาณเตือน fan-out:** เห็นตัวเองพิมพ์ `DISTINCT` เพื่อ "แก้ตัวเลขให้ดูถูก" = หยุดก่อน แล้วถามว่า grain เปลี่ยนตรงไหน

### 5.5 🟡 Semi-join / Anti-join — EXISTS, NOT EXISTS vs NOT IN

**Semi-join:** "user ที่เคยซื้ออย่างน้อย 1 ครั้ง"

```sql
SELECT u.id, u.name
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.status = 'paid');
```

ทำไมไม่ JOIN? เพราะ JOIN จะได้ user ซ้ำตามจำนวน order (fan-out อีกแล้ว) แล้วต้องมาแก้ด้วย DISTINCT
EXISTS ถามแค่ "มีไหม" เจอตัวแรกก็หยุด — ไม่ขนของมาและไม่งอกแถว

**Anti-join:** "user ที่ไม่เคยซื้อเลย" — และนี่คือกับดัก NULL ที่ดังที่สุด

```sql
-- ❌ อันตราย
WHERE u.id NOT IN (SELECT o.user_id FROM orders o)

-- ✅ ปลอดภัย
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)
```

**ทำไม NOT IN พัง:** ถ้า `orders.user_id` มี NULL แม้แต่ 1 แถว (เช่น guest checkout)

```
u.id NOT IN (1, 2, NULL)
= u.id <> 1 AND u.id <> 2 AND u.id <> NULL
= ...        AND ...        AND UNKNOWN
= UNKNOWN (หรือ FALSE)  สำหรับทุก u.id
→ ได้ 0 แถว เสมอ
```

> **ให้มองภาพนี้ว่า** "NOT IN คือการถามว่า 'คุณไม่ใช่ใครสักคนในรายชื่อนี้ใช่ไหม' — ถ้าในรายชื่อมีกล่องปิดฝาอยู่ใบเดียว ไม่มีใครตอบได้อย่างมั่นใจว่า 'ไม่ใช่'"

**กฎจำ:** anti-join ใช้ `NOT EXISTS` (หรือ `LEFT JOIN ... WHERE right.id IS NULL`) เสมอ — `NOT IN` ใช้ได้เฉพาะกับรายการค่าคงที่ หรือ column ที่ `NOT NULL` แน่ ๆ

### 5.6 🟡 Subquery vs CTE

```sql
WITH order_totals AS (          -- ขั้นที่ 1: grain = order
  SELECT order_id, SUM(quantity * price_at_purchase) AS items_amount
  FROM order_items
  GROUP BY order_id
),
paid_orders AS (                -- ขั้นที่ 2: กรองเฉพาะที่จ่ายแล้ว
  SELECT id, user_id FROM orders WHERE status = 'paid'
)
SELECT p.user_id, SUM(t.items_amount) AS revenue   -- ขั้นที่ 3: grain = user
FROM paid_orders p
JOIN order_totals t ON t.order_id = p.id
GROUP BY p.user_id;
```

อ่านจากบนลงล่างเหมือนสูตรอาหาร แต่ละขั้นมีชื่อและมี grain ชัด — นี่คือวิธีแก้ fan-out ในหัวข้อ 5.4 แบบเต็ม

| ประเด็น | Subquery | CTE (WITH) |
|---|---|---|
| อ่านง่าย | ซ้อนลึกแล้วอ่านยาก (อ่านจากในออกนอก) | อ่านบนลงล่าง ตั้งชื่อได้ |
| ใช้ซ้ำใน query เดียว | ต้องเขียนซ้ำ | อ้างชื่อซ้ำได้ |
| Performance | ปกติ planner optimize ได้ดี | DB สมัยใหม่ส่วนใหญ่ inline ได้เหมือน subquery; **PostgreSQL ก่อน v12 ทำ CTE เป็น "optimization fence"** (materialize เสมอ) |
| Recursive | ไม่ได้ | `WITH RECURSIVE` ทำ tree/hierarchy ได้ |
| เหมาะเมื่อ | เงื่อนไขสั้น ๆ เช่น `WHERE x IN (...)` | query analytics หลายขั้น |

**Trade-off:** CTE ช่วยให้คนอ่านง่าย แต่ในบาง engine การอ้าง CTE ซ้ำหลายครั้งอาจถูกคำนวณซ้ำหรือถูก materialize — ถ้าช้า ให้ EXPLAIN ดูก่อนจะสรุป

### 5.7 🟡 CASE WHEN และ Conditional Aggregation

**Pivot แบบง่าย — นับ order ทุกสถานะในแถวเดียวต่อวัน:**

```sql
SELECT DATE(created_at AT TIME ZONE 'Asia/Bangkok') AS order_date,
       COUNT(*)                                                AS all_orders,
       SUM(CASE WHEN status = 'paid'      THEN 1 ELSE 0 END)  AS paid,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)  AS cancelled,
       SUM(CASE WHEN status = 'paid' THEN total_amount END)   AS paid_revenue
FROM orders
GROUP BY 1;
```

อ่านตารางเดียวรอบเดียว ได้หลาย metric — แทนการยิง 4 query แล้วเอามา JOIN กัน
PostgreSQL มีรูปแบบที่อ่านง่ายกว่า: `COUNT(*) FILTER (WHERE status = 'paid')`

**คำนวณ rate ต้องระวัง 2 อย่าง:**

```sql
SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)::numeric
  / NULLIF(COUNT(*), 0) AS cancel_rate
```

1. **Integer division** — ใน PostgreSQL `3 / 10 = 0` ต้อง cast เป็น numeric ก่อน
2. **หารด้วยศูนย์** — `NULLIF(x, 0)` เปลี่ยน 0 เป็น NULL ผลจึงเป็น NULL แทน error

⚠️ `CASE` ที่ไม่มี `ELSE` จะคืน NULL — สำหรับ `SUM` ไม่เป็นไร แต่ถ้าเอาไป `AVG` ตัวหารจะผิด

### 5.8 🟡→🔴 Window Functions เจาะลึก

**โครงสร้าง:**

```
function() OVER (
    PARTITION BY ...     ← แบ่งห้อง (ไม่ใส่ = ทั้งตารางเป็นห้องเดียว)
    ORDER BY ...         ← เรียงในห้อง
    ROWS/RANGE BETWEEN ... AND ...   ← ขนาดหน้าต่าง (frame)
)
```

**ROW_NUMBER / RANK / DENSE_RANK — ต่างกันแค่ตอนเสมอ:**

```
revenue    ROW_NUMBER   RANK   DENSE_RANK
  500          1          1        1
  400          2          2        2
  400          3          2        2
  300          4          4        3
```

| ใช้ | เมื่อ |
|---|---|
| ROW_NUMBER | ต้องการ "ตัวเดียว" ต่อกลุ่มแน่ ๆ (dedup, latest record) — ใส่ tie-breaker ใน ORDER BY เสมอ ไม่งั้นเลือกตัวไหนก็ได้แบบสุ่ม |
| RANK | อันดับแบบกีฬา เสมอกันแล้วอันดับถัดไปกระโดด |
| DENSE_RANK | "สินค้า 3 ระดับราคาแรก" ที่ไม่อยากให้เลขกระโดด |

**LAG / LEAD — เปรียบเทียบกับแถวก่อนหน้า:**

```sql
SELECT user_id, created_at,
       created_at - LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at)
         AS gap_since_prev_order
FROM orders WHERE status = 'paid';
```

"ลูกค้าแต่ละคนกลับมาซื้อซ้ำห่างจากครั้งก่อนกี่วัน" — order แรกของแต่ละคนได้ NULL (ไม่มีแถวก่อนหน้า) ซึ่งถูกต้องแล้ว อย่ารีบ COALESCE เป็น 0

**Running total และ Moving average:**

```sql
SELECT order_date, daily_revenue,
       SUM(daily_revenue) OVER (ORDER BY order_date
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
       AVG(daily_revenue) OVER (ORDER BY order_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)         AS ma_7d
FROM daily_sales;
```

### 5.9 🔴 Frame Clause — ROWS vs RANGE (ตัวที่คนส่วนใหญ่ไม่รู้ว่ากำลังใช้)

**ความจริงที่ต้องรู้:** ถ้าใส่ `ORDER BY` ใน `OVER()` แต่ไม่ใส่ frame → default คือ
`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`

```
ข้อมูลระดับ order (มี 2 order วันเดียวกัน)

date     amount   ROWS running   RANGE running (default)
09-01     100        100              100
09-02      50        150              200    ← RANGE รวม "ทุกแถวที่ค่า ORDER BY เท่ากัน"
09-02      50        200              200
09-03      70        270              270
```

> **ให้มองภาพนี้ว่า** "ROWS นับเป็นจำนวนแถวจริง ๆ ส่วน RANGE นับตามค่า — แถวที่ค่าเท่ากัน RANGE ถือว่าเป็น 'แถวปัจจุบัน' พร้อมกันทั้งก้อน"

| ประเด็น | ROWS | RANGE |
|---|---|---|
| หน่วย | จำนวนแถว | ช่วงของค่าใน ORDER BY |
| ค่าที่เท่ากัน (ties) | แยกกัน ลำดับขึ้นกับ tie-breaker | รวมเป็นก้อนเดียว |
| `6 PRECEDING` | 6 **แถว** ก่อนหน้า | ใช้กับค่าเช่น `INTERVAL '6 days' PRECEDING` (รองรับไม่ทุก DB) |
| เหมาะกับ | running total ระดับแถว, moving average บนตารางที่มีครบทุกวัน | moving window ตามเวลาจริงเมื่อวันขาดได้ |

**กับดัก moving average:** `ROWS BETWEEN 6 PRECEDING` = 7 **แถว** ไม่ใช่ 7 **วัน**
ถ้าวันอาทิตย์ไม่มียอดขายเลย (ไม่มีแถว) หน้าต่างจะยืดไปกิน 8 วัน
ทางแก้: สร้าง **date spine** (เช่น `generate_series` ใน PostgreSQL) แล้ว LEFT JOIN ยอดขายเข้าไป ใส่ `COALESCE(revenue, 0)` ให้ทุกวันมีแถว — หรือใช้ RANGE แบบ interval ถ้า DB รองรับ

**กับดัก LAST_VALUE:** `LAST_VALUE(x) OVER (ORDER BY t)` ด้วย default frame จะได้ **ค่าของแถวปัจจุบัน** (หรือแถวสุดท้ายที่ค่า ORDER BY เท่ากับแถวปัจจุบัน) ไม่ใช่แถวสุดท้ายของ partition เพราะ frame หยุดที่ CURRENT ROW → ต้องระบุ `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`

### 5.10 🔴 Dedup และ Top-N per group — pattern เดียวกัน

**Dedup events ที่ซ้ำจาก retry (เก็บตัวที่ ingest ล่าสุด):**

```sql
WITH ranked AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY ingested_at DESC) AS rn
  FROM events
)
SELECT * FROM ranked WHERE rn = 1;
```

**Top 3 สินค้าขายดีต่อหมวด:**

```sql
WITH sales AS (
  SELECT p.category, p.id, SUM(oi.quantity) AS qty
  FROM order_items oi JOIN products p ON p.id = oi.product_id
  GROUP BY p.category, p.id
), ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY qty DESC, id) AS rn
  FROM sales
)
SELECT * FROM ranked WHERE rn <= 3;
```

สังเกต pattern: **ranking ใน CTE → กรองข้างนอก** เพราะ window คำนวณที่สถานี SELECT กรองใน WHERE ของ query เดียวกันไม่ได้ (หัวข้อ 3)
ถ้าอยากให้ "เสมอกันติดอันดับด้วย" เปลี่ยน ROW_NUMBER เป็น RANK — trade-off คืออาจได้มากกว่า 3 แถวต่อหมวด

### 5.11 🔴 Gaps & Islands — หาช่วงต่อเนื่อง

**โจทย์:** "user แต่ละคน login ติดต่อกันกี่วันสูงสุด (streak)"

**เทคนิค:** ถ้าวันที่ต่อเนื่อง `วันที่ − ลำดับที่` จะได้ค่าคงที่ = เลขประจำเกาะ

```
login_date   ROW_NUMBER   date − rn (วัน)     island
09-01            1        08-31              ┐
09-02            2        08-31              ├ เกาะที่ 1 (3 วัน)
09-03            3        08-31              ┘
09-05            4        09-01              ┐ ← 09-04 ขาด = gap
09-06            5        09-01              ┘ เกาะที่ 2 (2 วัน)
```

```sql
WITH days AS (
  SELECT DISTINCT user_id, DATE(event_time AT TIME ZONE 'Asia/Bangkok') AS d
  FROM events WHERE event_type = 'login'
), grp AS (
  SELECT user_id, d,
         d - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d))::int AS island
  FROM days
)
SELECT user_id, island, MIN(d) AS start_day, COUNT(*) AS streak
FROM grp GROUP BY user_id, island;
```

> **ให้มองภาพนี้ว่า** "วันที่กับเลขลำดับเดินหน้าพร้อมกันทีละ 1 — ตราบใดที่ไม่มีวันขาด ระยะห่างของมันจะเท่าเดิม พอวันขาดหนึ่งวัน ระยะห่างกระโดด = เริ่มเกาะใหม่"

**จุดสำคัญ:** ต้อง `DISTINCT` วันก่อน — ถ้า login 2 ครั้งในวันเดียว ลำดับจะเดินแต่วันไม่เดิน เกาะจะแตก
อีกวิธีที่ยืดหยุ่นกว่า: ใช้ `LAG` ดูว่าห่างจากแถวก่อนเกิน 1 วันไหม → ทำ flag 0/1 → running `SUM` ของ flag = เลขเกาะ (ใช้ได้กับ "session ที่ห่างกันเกิน 30 นาทีให้ตัดใหม่" ด้วย)

### 5.12 🔴 Date/Time และ Time Zone

**กฎ 4 ข้อที่กันตัวเลขผิดเดือน:**

| กฎ | ทำไม |
|---|---|
| เก็บเป็น UTC (`timestamptz`) | เวลาเดียวกันทั้งโลก ไม่มี DST มาหลอก |
| แปลงเป็น local **ก่อน** ตัดวัน | `DATE(created_at)` ตัดตาม UTC → order 06:30 น. เวลาไทยวันที่ 1 กลายเป็นวันที่ 31 ของเดือนก่อน |
| กรองช่วงด้วย half-open | `>= '2026-09-01 00:00+07' AND < '2026-10-01 00:00+07'` |
| อย่าครอบ column ด้วยฟังก์ชันตอนกรอง | `WHERE DATE(created_at) = ...` ทำให้ index บน `created_at` ใช้ไม่ได้ (non-sargable — ดู PART 8 หัวข้อ 5.2) |

```
event UTC:   2026-08-31 23:30 UTC
Bangkok:     2026-09-01 06:30 +07      ← ธุรกิจนับเป็นเดือนกันยายน
DATE(UTC):   2026-08-31                ← ❌ ไปตกเดือนสิงหาคม
```

**ท่าที่ถูก:** กรองด้วยขอบเขตที่แปลงเป็น UTC แล้ว (sargable) แต่ **GROUP BY** ด้วยวันที่ local

```sql
WHERE created_at >= TIMESTAMPTZ '2026-09-01 00:00+07'
  AND created_at <  TIMESTAMPTZ '2026-10-01 00:00+07'
GROUP BY DATE(created_at AT TIME ZONE 'Asia/Bangkok')
```

**Trade-off:** ถ้า report ถูกดูหลาย time zone ทางที่สะอาดกว่าคือทำตาราง/column `order_date_local` ไว้ล่วงหน้าตอน ETL — แลกกับการต้องดูแลว่ามันตรงกับ `created_at` เสมอ

---

## 6. Example — วันหนึ่งของคนทำ Analytics

### 6.1 โจทย์: "Revenue รายวันเดือนกันยายน + ยอดสะสม + ค่าเฉลี่ย 7 วัน"

ไล่คิดแบบ senior ทีละขั้น:

```
1. Grain ของผลลัพธ์?        → 1 แถว = 1 วัน (เวลาไทย)
2. Metric มาจาก grain ไหน?   → revenue เป็นของ order → รวมจาก orders ไม่ JOIN items
3. นิยามธุรกิจ?              → เฉพาะ paid? refunded หักไหม? → ถามก่อน อย่าเดา
4. วันที่ไม่มียอด?           → ต้องโชว์ 0 → ต้องมี date spine
5. Window frame?            → ROWS (เพราะ spine ทำให้ 1 แถว = 1 วันแน่นอน)
```

```sql
WITH spine AS (
  SELECT generate_series(DATE '2026-09-01', DATE '2026-09-30', INTERVAL '1 day')::date AS d
), daily AS (
  SELECT DATE(created_at AT TIME ZONE 'Asia/Bangkok') AS d, SUM(total_amount) AS revenue
  FROM orders
  WHERE status = 'paid'
    AND created_at >= TIMESTAMPTZ '2026-09-01 00:00+07'
    AND created_at <  TIMESTAMPTZ '2026-10-01 00:00+07'
  GROUP BY 1
)
SELECT s.d,
       COALESCE(dl.revenue, 0) AS revenue,
       SUM(COALESCE(dl.revenue, 0)) OVER (ORDER BY s.d ROWS UNBOUNDED PRECEDING) AS running,
       AVG(COALESCE(dl.revenue, 0)) OVER (ORDER BY s.d ROWS 6 PRECEDING)         AS ma_7d
FROM spine s LEFT JOIN daily dl ON dl.d = s.d
ORDER BY s.d;
```

> **ให้มองภาพนี้ว่า** "query ที่ดีเล่าเรื่องได้: สร้างปฏิทิน → สรุปยอดรายวัน → เอายอดวางลงปฏิทิน → คำนวณข้ามวัน — ทุกขั้นมีชื่อและ grain ชัด"

**Trade-off ที่ต้องพูด:** `ma_7d` ของ 6 วันแรกของเดือนเฉลี่ยจากไม่ถึง 7 วัน (เพราะไม่มีข้อมูลสิงหาคมในหน้าต่าง) — ถ้าต้องการความถูกต้องเต็มที่ ให้ดึงข้อมูลย้อนไปอีก 6 วันแล้วค่อยตัดทิ้งตอนแสดงผล

### 6.2 โจทย์: "Repeat purchase rate ของลูกค้าใหม่เดือนสิงหาคม"

**นิยามก่อนเขียน (สำคัญกว่า SQL):** ลูกค้าใหม่ = order paid แรกอยู่ในเดือนสิงหาคม / ซื้อซ้ำ = มี order paid ครั้งที่ 2 ภายใน 30 วันหลัง order แรก

```sql
WITH ranked AS (
  SELECT user_id, created_at,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at, id) AS n
  FROM orders WHERE status = 'paid'
), firsts AS (
  SELECT user_id, created_at AS first_at FROM ranked WHERE n = 1
    AND created_at >= TIMESTAMPTZ '2026-08-01 00:00+07'
    AND created_at <  TIMESTAMPTZ '2026-09-01 00:00+07'
), flagged AS (
  SELECT f.user_id,
         EXISTS (SELECT 1 FROM ranked r
                 WHERE r.user_id = f.user_id AND r.n = 2
                   AND r.created_at < f.first_at + INTERVAL '30 days') AS repeated
  FROM firsts f
)
SELECT COUNT(*) AS new_customers,
       COUNT(*) FILTER (WHERE repeated)::numeric / NULLIF(COUNT(*), 0) AS repeat_rate_30d
FROM flagged;
```

สิ่งที่ query นี้ทำถูก: หา "ครั้งแรก" ด้วย ROW_NUMBER จาก **ทุกช่วงเวลา** (ไม่ใช่เฉพาะสิงหาคม — ไม่งั้นลูกค้าเก่าที่กลับมาซื้อในสิงหาคมจะถูกนับเป็นลูกค้าใหม่), ใช้ semi-join (EXISTS) ไม่ให้แถวงอก, กันหารศูนย์ และ cast เป็น numeric

⚠️ **กับดักเงียบ:** ลูกค้าที่ซื้อครั้งแรกวันที่ 31 ส.ค. ยังไม่ครบ 30 วันถ้า query วันนี้ 2026-09-23 → rate จะต่ำเกินจริง (right-censoring) — ต้องบอก stakeholder หรือรอให้ window ครบก่อนรายงาน

### 6.3 โจทย์: Dashboard ยอดขายไม่ตรงกับทีมการเงิน (Reconciliation)

```
Dashboard:  ฿12,480,000      Finance (payment gateway):  ฿11,920,000
ต่าง 4.7% — หาให้เจอว่าส่วนต่างมาจากไหน
```

ไล่ทีละสมมติฐาน แต่ละข้อเป็น query สั้น ๆ:

| สมมติฐาน | Query ที่ใช้พิสูจน์ | ถ้าเจอแปลว่า |
|---|---|---|
| Fan-out | เทียบ `COUNT(*)` กับ `COUNT(DISTINCT order_id)` ใน query ของ dashboard | JOIN ทำแถวงอก |
| Order ซ้ำ | `GROUP BY id HAVING COUNT(*) > 1` | pipeline โหลดซ้ำ |
| Refund ไม่ถูกหัก | `SUM` แยกตาม status | นิยามต่างกัน ไม่ใช่ bug |
| Time zone | ตัดวันแบบ UTC vs Bangkok แล้วเทียบยอดวันขอบเดือน | ต่างกันแค่วันแรก/วันสุดท้าย |
| Record หายระหว่างระบบ | anti-join ด้วย `NOT EXISTS` ระหว่าง `orders` กับตาราง payment | order paid ที่ไม่มีเงินเข้าจริง (หรือกลับกัน) |

**ผลที่เจอบ่อยที่สุดในงานจริง:** ไม่ใช่ bug เดียว แต่เป็น 2–3 เรื่องรวมกัน เช่น refund ไม่หัก + time zone ขอบเดือน — วิธีแตกส่วนต่างให้เป็นชิ้น ๆ ที่อธิบายได้ (variance bridge) คือทักษะ senior ของงานนี้

### 6.4 Data Quality Checks — ชุดที่ควรรันก่อนเชื่อตารางใหม่ทุกครั้ง

```sql
-- 1) Row count เทียบวันก่อน / เทียบต้นทาง
SELECT DATE(created_at AT TIME ZONE 'Asia/Bangkok') AS d, COUNT(*) FROM orders
GROUP BY 1 ORDER BY 1 DESC LIMIT 14;

-- 2) Uniqueness ของ key
SELECT id, COUNT(*) FROM orders GROUP BY id HAVING COUNT(*) > 1;

-- 3) Null rate ของ column สำคัญ
SELECT AVG(CASE WHEN user_id IS NULL THEN 1.0 ELSE 0 END) AS null_rate_user_id FROM orders;

-- 4) Referential check (orphan)
SELECT COUNT(*) FROM order_items oi
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.id = oi.order_id);

-- 5) Business rule: ยอดใน order ต้องตรงกับผลรวม items
SELECT o.id FROM orders o JOIN (
  SELECT order_id, SUM(quantity * price_at_purchase) AS s FROM order_items GROUP BY order_id
) t ON t.order_id = o.id
WHERE ABS(o.total_amount - t.s) > 0.01;
```

| Check | จับปัญหาอะไร | Threshold ตัวอย่าง |
|---|---|---|
| Row count | pipeline ไม่รัน / รันซ้ำ / โหลดไม่ครบ | ต่างจากค่าเฉลี่ย 7 วันเกิน ±30% → alert |
| Uniqueness | โหลดซ้ำ, JOIN ใน ETL งอก | ต้องเป็น 0 เสมอ |
| Null rate | field หายเพราะ app เปลี่ยน schema | เทียบกับ baseline ไม่ใช่ต้อง 0 |
| Referential | ลำดับการโหลดผิด / ลบแม่แต่ลูกค้าง | 0 หรือยอมรับได้ภายในหน่วงเวลาหนึ่ง |
| Reconciliation | ตัวเลขเพี้ยนจากต้นทาง | ต่างไม่เกิน 0.5% หรือตามที่ตกลงกับ finance |

> **ให้มองภาพนี้ว่า** "Data quality check คือ unit test ของข้อมูล — โค้ดไม่เปลี่ยนก็จริง แต่ข้อมูลเปลี่ยนทุกวัน เพราะฉะนั้นต้องรันทุกวัน ไม่ใช่รันครั้งเดียวตอนเขียนเสร็จ"

**Trade-off:** check ละเอียดทุกตาราง = ค่า compute + alert fatigue (เตือนจนคนเลิกอ่าน) → เริ่มจากตารางที่ป้อน metric สำคัญ และตั้ง threshold จาก baseline จริง

---

## 7. Compare

### 7.1 คู่ที่สับสนบ่อยใน SQL เชิงใช้งาน

| คู่ที่สับสน | ต่างกันตรงไหน |
|---|---|
| **WHERE vs HAVING** | WHERE กรองแถวก่อนรวม / HAVING กรองกลุ่มหลังรวม — กรองได้ใน WHERE ให้ใส่ WHERE |
| **COUNT(\*) vs COUNT(col) vs COUNT(DISTINCT col)** | ทุกแถว / แถวที่ col ไม่ NULL / ค่าไม่ซ้ำที่ไม่ NULL |
| **GROUP BY vs Window Function** | ยุบแถว / แถวอยู่ครบแต่มีค่ารวมแปะข้าง |
| **ROW_NUMBER vs RANK vs DENSE_RANK** | 1,2,3,4 / 1,1,3,4 / 1,1,2,3 |
| **ROWS vs RANGE** | นับแถว / นับตามค่า (ties รวมก้อน) — default เมื่อมี ORDER BY คือ RANGE |
| **ON vs WHERE ใน LEFT JOIN** | ON = เงื่อนไขการจับคู่ (ซ้ายยังครบ) / WHERE = กรองหลัง JOIN (NULL ถูกทิ้ง) |
| **EXISTS vs IN** | ผลเหมือนกันในกรณีทั่วไป / EXISTS หยุดเมื่อเจอตัวแรก — planner สมัยใหม่มักทำให้เร็วพอกัน |
| **NOT EXISTS vs NOT IN** | NOT EXISTS ปลอดภัยกับ NULL / NOT IN เจอ NULL ในรายการ = ได้ 0 แถว |
| **JOIN vs EXISTS (semi-join)** | JOIN งอกแถวตามจำนวนคู่ / EXISTS ไม่งอก |
| **DISTINCT vs GROUP BY** | ผลเหมือนกันถ้าไม่มี aggregate / GROUP BY คำนวณ metric ได้ |
| **DISTINCT vs ROW_NUMBER dedup** | ซ้ำเป๊ะทุก column / ซ้ำตาม key แล้วเลือกเก็บตัวที่ต้องการ |
| **Subquery vs CTE** | ซ้อนอ่านจากใน / ตั้งชื่ออ่านบนลงล่าง — performance ใกล้กันใน DB สมัยใหม่ |
| **UNION vs UNION ALL** | UNION ตัดซ้ำ (ต้อง sort/hash = แพง) / UNION ALL ต่อกันเฉย ๆ — ถ้ารู้ว่าไม่ซ้ำใช้ ALL |
| **timestamp vs timestamptz** | ไม่รู้ time zone / รู้และเก็บเป็นจุดเวลาจริง — analytics ควรใช้ timestamptz |
| **BETWEEN vs half-open** | รวมทั้งสองขอบ (พลาดเสี้ยววินาทีสุดท้ายของวัน) / `>= start AND < end` ไม่พลาด ไม่ซ้อน |

### 7.2 OLTP query vs Analytics query

| ประเด็น | OLTP (แอป — PART 8) | Analytics (PART นี้) |
|---|---|---|
| ถามอะไร | แถวเดียว / ไม่กี่แถว "order #123" | ล้านแถว "ยอดขายรายเดือนตามประเทศ" |
| ความเร็วที่ต้องการ | มิลลิวินาที | วินาทีถึงนาทีรับได้ |
| Index | สำคัญที่สุด | ช่วยบ้าง แต่มัก full scan แบบ parallel/columnar |
| ตัวชี้วัดต้นทุน | latency ต่อ request | ข้อมูลที่ scan (bytes) + เวลารวม |
| ความเสี่ยงหลัก | lock, N+1, connection | **ตัวเลขผิดแบบเงียบ** (fan-out, NULL, time zone) |
| ที่รันที่เหมาะ | primary DB | read replica / data warehouse (อย่ารัน report หนัก ๆ บน primary) |

**ประโยคที่ต้องพูดได้:** "report query ใหญ่ ๆ ไม่ควรรันบน primary ของ production เพราะมันกิน CPU/IO แย่งกับ transaction ของผู้ใช้ — ย้ายไป read replica หรือ warehouse และยอมรับว่าข้อมูลจะช้ากว่าจริงเล็กน้อย (lag)"

---

## 8. Common Mistakes

| # | สิ่งที่ Junior มักเข้าใจผิด | ความจริง |
|---|---|---|
| 1 | "query รันผ่าน ได้ตัวเลข = ถูกแล้ว" | SQL ที่ผิดส่วนใหญ่รันผ่าน — ต้องเช็ค grain, row count และเทียบกับแหล่งอื่นเสมอ |
| 2 | "JOIN แล้ว SUM ได้เลย" | ถ้า JOIN กับตารางที่ grain ละเอียดกว่า metric ฝั่งหยาบจะถูกนับซ้ำ (fan-out) |
| 3 | "ตัวเลขเบิ้ล ใส่ DISTINCT ก็หาย" | DISTINCT ปิดอาการ ไม่ได้แก้สาเหตุ และ `SUM(DISTINCT)` ผิดเมื่อค่าบังเอิญเท่ากัน |
| 4 | "`col = NULL` ใช้เช็ค NULL ได้" | ได้ UNKNOWN เสมอ ต้องใช้ `IS NULL` |
| 5 | "`WHERE status <> 'cancelled'` ได้ทุกแถวที่ไม่ใช่ cancelled" | แถวที่ status เป็น NULL หายไปด้วย |
| 6 | "`NOT IN` กับ `NOT EXISTS` เหมือนกัน" | NOT IN เจอ NULL ในรายการ = ได้ 0 แถว |
| 7 | "LEFT JOIN แล้ว WHERE ฝั่งขวาได้" | กลายเป็น INNER JOIN — ย้ายเงื่อนไขไปที่ ON |
| 8 | "`AVG(col)` คือค่าเฉลี่ยต่อแถว" | AVG ข้าม NULL — ตัวหารคือจำนวนแถวที่มีค่า |
| 9 | "`DATE(created_at)` ตัดวันได้เลย" | ตัดตาม UTC ไม่ใช่เวลาไทย + ทำให้ index ใช้ไม่ได้ถ้าใช้ใน WHERE |
| 10 | "`LIMIT 10` ได้ 10 แถวแรก" | ไม่มี ORDER BY = ไม่มี "แรก" |
| 11 | "`ROWS 6 PRECEDING` = 7 วันล่าสุด" | = 7 แถว ถ้าวันขาดหน้าต่างจะยืด ต้องมี date spine |
| 12 | "running total ใส่แค่ `ORDER BY` ใน OVER ก็พอ" | default frame คือ RANGE — วันที่ซ้ำจะกระโดดพร้อมกัน ระบุ ROWS ถ้าต้องการทีละแถว |
| 13 | "ROW_NUMBER ไม่ต้องใส่ tie-breaker" | ค่าเท่ากันแล้ว DB เลือกตัวไหนก็ได้ — dedup รันสองครั้งได้ผลต่างกัน |
| 14 | "กรอง window function ใน WHERE ได้" | window คำนวณหลัง WHERE — ต้องห่อด้วย CTE (หรือใช้ QUALIFY ถ้า dialect มี) |
| 15 | "หาร COUNT กับ COUNT ได้เปอร์เซ็นต์" | integer division ได้ 0 + หารศูนย์ error — cast และ `NULLIF` |
| 16 | "`SELECT *` ใน warehouse ไม่เป็นไร เดี๋ยว LIMIT เอา" | ใน column store `LIMIT` มักไม่ลดข้อมูลที่ scan — จ่ายเต็มเหมือนเดิม |
| 17 | "รัน report บน production primary ได้ ก็แค่ SELECT" | SELECT ใหญ่กิน CPU/IO/memory แย่งผู้ใช้จริง และถือ snapshot นานได้ |

---

## 9. Debugging

### 9.1 Framework: "ตัวเลขไม่ถูก" ให้ไล่ตามลำดับนี้

```
1. นิยามตรงกันไหม?          → "revenue" ของเรากับของเขานับ refund/tax/status เหมือนกันไหม
        ↓
2. Grain ของผลลัพธ์คืออะไร?   → เขียนออกมาเป็นประโยค "1 แถว = ..."
        ↓
3. นับแถวทุกขั้นของ CTE      → COUNT(*) vs COUNT(DISTINCT key) หลังทุก JOIN
        ↓                       ถ้าไม่เท่ากัน = fan-out ตรงนั้น
4. ตรวจ NULL                 → column ที่ใช้ใน WHERE / JOIN / AVG มี NULL ไหม
        ↓
5. ตรวจเวลา                  → time zone, ขอบช่วง (BETWEEN?), ข้อมูลวันล่าสุดมาครบหรือยัง
        ↓
6. ตรวจซ้ำ                   → key ที่ควร unique ซ้ำไหม (event retry, โหลดซ้ำ)
        ↓
7. เจาะ 1 ตัวอย่าง            → เลือก order/user เดียว แล้วไล่ด้วยมือทุกขั้นเทียบกับต้นทาง
        ↓
8. Reconcile กับแหล่งอื่น     → ต่างเท่าไร แตกส่วนต่างเป็นชิ้นที่อธิบายได้
```

> **ให้มองภาพนี้ว่า** "ตัวเลขผิดเหมือนน้ำรั่ว — ไล่ตรวจทีละท่อ (ทีละ CTE) ว่าน้ำเข้าเท่าไรออกเท่าไร ท่อไหนน้ำเพิ่มผิดปกติคือท่อที่ JOIN ผิด"

**เทคนิคที่ได้ผลที่สุด (ข้อ 7):** เลือก **ตัวอย่างเดียว** เช่น order #1001 แล้วดูทุกแถวที่มันไปโผล่ในแต่ละขั้น — bug ที่ซ่อนในล้านแถวจะเห็นชัดทันทีในสามแถว

### 9.2 อ่าน EXPLAIN สำหรับ query analytics

```
Sort  (actual time=4210..4380 rows=30)
  Sort Method: quicksort
  -> HashAggregate  (actual time=4150..4200 rows=30)
       -> Hash Join  (rows=2,400,000)
            -> Seq Scan on order_items   (rows=9,800,000)       ← อ่านทั้งตาราง
            -> Hash
                 -> Index Scan on orders  (rows=310,000)
                      Index Cond: created_at >= ... AND < ...
```

อ่านจาก **ล่างขึ้นบน ในสุดออกนอก**: scan → join → aggregate → sort
node ที่ `actual time` กระโดดมากที่สุดคือจุดที่ต้องดู — ตรงนี้คือ Seq Scan 9.8 ล้านแถวของ `order_items` ทั้งที่ต้องการแค่ items ของ 310,000 orders

| คำที่เห็น | ความหมายเชิง analytics | ทำอะไรต่อ |
|---|---|---|
| Seq Scan บนตารางใหญ่ | อ่านทั้งตาราง — **ใน analytics ไม่ผิดเสมอไป** ถ้าต้องใช้ข้อมูลส่วนใหญ่จริง | ถามว่าต้องใช้ทุกแถวไหม กรองก่อนได้ไหม |
| Parallel Seq Scan | แบ่งหลาย worker อ่าน | ปกติของ query ใหญ่ |
| HashAggregate / GroupAggregate | รวมกลุ่มด้วย hash table / ด้วยการเรียง | Group ต้อง sort ก่อน — แพงถ้าไม่มี index เรียงให้ |
| Sort Method: external merge Disk | memory ไม่พอ sort ต้อง spill ลง disk | ลดแถวก่อน sort / เพิ่ม `work_mem` แบบระวัง |
| Hash Join ... Batches: > 1 | hash table ใหญ่เกิน memory | ลดข้อมูลฝั่งที่ถูก hash (aggregate ก่อน) |
| rows (estimate) ห่างจาก actual มาก | statistics เก่า planner เลือก join ผิด | `ANALYZE` ตาราง |
| Partitions / Subplans Removed | partition pruning ทำงาน | ถ้าไม่ขึ้น = เงื่อนไขไม่ตรง partition key |
| WindowAgg | window function ทำงาน ต้อง sort ตาม PARTITION BY + ORDER BY | window หลายอันที่ partition ต่างกัน = sort หลายรอบ |

**ใน warehouse (BigQuery/Snowflake):** ไม่ค่อยดูแผนแบบนี้ แต่ดู **bytes scanned, partitions scanned, spill** ใน query profile แทน — หลักการเดียวกัน: อ่านน้อยลง ขนน้อยลง

### 9.3 Performance สำหรับ analytics — ลำดับต้นทุนจากถูกไปแพง

| ท่า | ทำไมช่วย | Trade-off |
|---|---|---|
| **กรองให้เร็ว** (filter early) | ทุกแถวที่ทิ้งได้ตั้งแต่ scan ไม่ต้องผ่าน join/sort | ต้องแน่ใจว่ากรองไม่เปลี่ยนความหมาย (เช่น กรองฝั่งขวาของ LEFT JOIN) |
| **เลือกเฉพาะ column ที่ใช้** | row store ลด I/O / column store ลด bytes = ลดเงิน | query ยาวขึ้นนิด |
| **เงื่อนไข sargable** | `created_at >= X` ใช้ index/partition ได้ `DATE(created_at) = X` ไม่ได้ | ต้องคำนวณขอบเขตเวลาเอง |
| **Aggregate ก่อน JOIN** | JOIN ข้อมูลที่เล็กลงเป็นร้อยเท่า + แก้ fan-out ไปด้วย | — (แทบไม่มีข้อเสีย) |
| **UNION ALL แทน UNION** | ไม่ต้อง dedup | ต้องมั่นใจว่าไม่ซ้ำจริง |
| **Index สำหรับ filter ที่เลือกน้อยแถว** | เหมาะเมื่อดึง < ~5–10% ของตาราง | ถ้าดึงเกือบทั้งตาราง full scan เร็วกว่า index — planner รู้เรื่องนี้ (index internals ดู PART 8) |
| **Partition ตามเวลา** | query ช่วงเดือนเดียวอ่านแค่ partition เดียว | ต้องใส่เงื่อนไขบน partition key ทุกครั้ง, partition เล็กเกินไป = overhead |
| **ตารางสรุป / materialized view** | dashboard อ่านตารางเล็กที่คำนวณไว้แล้ว | ข้อมูลไม่ real-time + ต้องดูแลการ refresh (denormalization ใน PART 8) |
| **ย้ายไป read replica / warehouse** | ไม่แย่งทรัพยากรกับ production | lag + ค่าใช้จ่ายระบบเพิ่ม |

> **ให้มองภาพนี้ว่า** "optimize analytics คือการขนของให้น้อยที่สุด — ทิ้งแถวที่ไม่ใช้ให้เร็วที่สุด ทิ้ง column ที่ไม่ใช้ให้เร็วที่สุด และย่อข้อมูลก่อนเอาไปต่อกับคนอื่น"

---

## 10. Interview Questions

### 🟢 Junior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| WHERE กับ HAVING ต่างกันยังไง | กรองแถวก่อนรวม vs กรองกลุ่มหลังรวม + อธิบายด้วยลำดับการทำงาน |
| ลำดับการทำงานของ SQL เป็นยังไง | FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT + ตัวอย่างว่าทำไม alias ใช้ใน WHERE ไม่ได้ |
| COUNT(\*) กับ COUNT(col) ต่างกันยังไง | NULL ไม่ถูกนับใน COUNT(col) |
| ทำไม `col = NULL` ไม่ทำงาน | three-valued logic → ใช้ IS NULL |
| INNER JOIN กับ LEFT JOIN ต่างกันยังไง | มีคู่ทั้งสองฝั่ง vs ซ้ายครบ + ยกตัวอย่าง "user ที่ไม่มี order" |
| GROUP BY แล้ว SELECT column ที่ไม่ได้ group ได้ไหม | ไม่ได้ (ในมาตรฐาน) เพราะไม่รู้จะเอาค่าของแถวไหน |
| ทำไม LIMIT ต้องมาคู่กับ ORDER BY | ไม่งั้นผลไม่ deterministic |

### 🟡 Mid

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| JOIN แล้วยอดขายเบิ้ล เกิดจากอะไร แก้ยังไง | **grain** + fan-out + aggregate ก่อน JOIN + บอกว่า DISTINCT ไม่ใช่ทางแก้ |
| NOT IN กับ NOT EXISTS ต่างกันยังไง | NULL ในรายการทำให้ NOT IN ได้ 0 แถว → ใช้ NOT EXISTS |
| LEFT JOIN แล้วใส่เงื่อนไขใน WHERE ต่างจากใน ON ยังไง | WHERE ฝั่งขวาทำให้เป็น INNER JOIN |
| ROW_NUMBER / RANK / DENSE_RANK ต่างกันยังไง | วาดตัวอย่างค่าเสมอ + บอกว่าใช้ตัวไหนเมื่อไร |
| หา top 3 สินค้าต่อหมวดยังไง | PARTITION BY + ROW_NUMBER ใน CTE แล้วกรองข้างนอก + เรื่อง ties |
| ลบข้อมูลซ้ำแต่เก็บตัวล่าสุดยังไง | ROW_NUMBER() OVER (PARTITION BY key ORDER BY ts DESC) = 1 + tie-breaker |
| คำนวณ % เปลี่ยนแปลงจากเดือนก่อนยังไง | LAG + NULLIF + cast numeric |
| CTE กับ subquery ต่างกันยังไง | อ่านง่าย/ใช้ซ้ำ/recursive + performance ขึ้นกับ engine (materialize หรือ inline) |
| คำนวณยอดขายหลายสถานะใน query เดียวยังไง | conditional aggregation (SUM(CASE WHEN) / FILTER) |

### 🔴 Senior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| ROWS กับ RANGE ต่างกันยังไง default คืออะไร | default เมื่อมี ORDER BY = RANGE ... CURRENT ROW, ties รวมก้อน, moving average ต้อง date spine |
| หา streak login ต่อเนื่องสูงสุดยังไง | gaps & islands: DISTINCT วัน → date − ROW_NUMBER หรือ LAG + flag + running SUM |
| Dashboard ไม่ตรงกับตัวเลข finance จะทำยังไง | ตกลงนิยามก่อน → แตกส่วนต่าง (fan-out, dup, refund, time zone, missing records) → เจาะตัวอย่างเดียว → เอกสารนิยามกลาง |
| ออกแบบ data quality check สำหรับ pipeline ยังไง | row count, uniqueness, null rate, referential, reconciliation + threshold จาก baseline + alert fatigue |
| Report query ช้า 10 นาทีบนตาราง 500 ล้านแถว | EXPLAIN หา node ที่แพง → partition pruning → filter early → aggregate ก่อน JOIN → ตารางสรุป → ย้ายไป warehouse (ตามลำดับต้นทุน) |
| Time zone จัดการยังไงใน report หลายประเทศ | เก็บ UTC, แปลงก่อนตัดวัน, กรองแบบ sargable, พิจารณา column วันที่ local ที่คำนวณตอน ETL |
| ทำไมไม่ควรรัน analytics บน production primary | แย่งทรัพยากร + snapshot ยาว → ใช้ replica/warehouse และยอมรับ lag |

---

## 11. Answer Like a Developer

### โครงมาตรฐาน 4 จังหวะสำหรับคำถาม SQL

```
1. ถาม/ประกาศนิยามและ grain      "ขอยืนยันก่อนว่า 1 แถวของผลลัพธ์คือ ... และ revenue นับ ..."
        ↓
2. เล่าวิธีเป็นขั้น ๆ (CTE)       "ขั้นแรกผมสรุปเป็น grain order ก่อน แล้ว ..."
        ↓
3. ชี้กับดักที่ป้องกันไว้          "ผมใช้ NOT EXISTS แทน NOT IN เพราะ user_id อาจเป็น NULL"
        ↓
4. บอกวิธีพิสูจน์ + trade-off     "ผมจะเช็ค row count หลัง JOIN และเทียบกับยอดจาก payment"
```

> **ให้มองภาพนี้ว่า** "interviewer ไม่ได้รอดู syntax ที่สวย เขารอดูว่าคุณ 'ถามก่อนเขียน' และ 'พิสูจน์หลังเขียน' — สองอย่างนี้คือสิ่งที่ทำให้เชื่อตัวเลขของคุณได้"

### ตัวอย่างการตอบ: "JOIN orders กับ order_items แล้วยอดขายเบิ้ล เพราะอะไร"

**❌ คำตอบระดับท่องจำ:** "ใส่ DISTINCT ครับ"

**✅ คำตอบระดับที่อยากได้:**
> "เป็นปัญหา fan-out ครับ — `orders` มี grain เป็น 1 แถวต่อ 1 order แต่พอ JOIN กับ `order_items` grain เปลี่ยนเป็น 1 แถวต่อ 1 สินค้าใน order ถ้า order หนึ่งมี 3 สินค้า `total_amount` ก็ถูกคัดลอก 3 แถว แล้ว SUM ก็นับ 3 ครั้ง
> ผมจะแก้ด้วยการ aggregate `order_items` ให้เหลือ grain order ใน CTE ก่อน แล้วค่อย JOIN แบบ 1:1 หรือถ้า metric เป็นยอดสินค้าก็รวมจาก items โดยตรง
> ไม่ใช้ `SUM(DISTINCT)` เพราะ order ที่ยอดบังเอิญเท่ากันจะหายไป
> แล้วผมจะพิสูจน์ด้วยการเทียบ `COUNT(*)` กับ `COUNT(DISTINCT order_id)` หลัง JOIN และเทียบยอดรวมกับ query ที่ไม่ JOIN ครับ"

### คำพูดที่ทำให้ดูมีประสบการณ์

| สถานการณ์ | พูดแบบนี้ |
|---|---|
| ได้โจทย์ SQL สด ๆ | "ขอยืนยัน grain กับนิยามก่อนนะครับ — revenue หัก refund ไหม นับตามเวลาไทยใช่ไหม" |
| ถูกถามว่ามั่นใจตัวเลขไหม | "ผมเช็ค row count ทุกขั้นและ reconcile กับ source แล้ว ต่างกัน 0.2% ซึ่งมาจาก ..." |
| ถูกถามให้ optimize | "ผมดู EXPLAIN ก่อนว่าเวลาหายที่ node ไหน ส่วนใหญ่แก้ได้ด้วยการกรองให้เร็วขึ้นและ aggregate ก่อน JOIN" |
| ไม่รู้ dialect ที่เขาใช้ | "ใน PostgreSQL ผมใช้ FILTER / ถ้าเป็น BigQuery จะใช้ COUNTIF หรือ QUALIFY — หลักการเดียวกันครับ" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้องสัมภาษณ์:

- **SQL ที่ผิดส่วนใหญ่รันผ่าน** — Correct → Clear → Fast ตามลำดับเสมอ
- **ลำดับจริง:** FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT — อธิบายได้ว่าทำไม alias/aggregate/window ใช้ใน WHERE ไม่ได้
- **Grain = 1 แถวคือ 1 อะไร** — ถามก่อนเขียนทุก query / metric ต้องรวมที่ grain ของมัน
- **NULL = ไม่รู้:** `= NULL` ใช้ไม่ได้, `COUNT(col)` และ `AVG` ข้าม NULL, `<>` ทิ้งแถว NULL, `COALESCE` ใส่ค่า default อย่างรู้ตัว
- **LEFT JOIN:** เงื่อนไขฝั่งขวาใส่ใน ON ไม่ใช่ WHERE + ใช้ `COUNT(right.id)`
- **Fan-out:** JOIN กับตารางละเอียดกว่าแล้ว SUM = เบิ้ล → aggregate ก่อน JOIN, **DISTINCT ไม่ใช่ทางแก้**
- **Semi/Anti-join:** EXISTS ไม่งอกแถว / **NOT EXISTS แทน NOT IN** เพราะ NULL
- **CTE** = ขั้นตอนมีชื่อ อ่านง่าย / performance ขึ้นกับ engine
- **Conditional aggregation** = หลาย metric ใน scan เดียว + cast + NULLIF
- **Window** = คำนวณข้ามแถวไม่ยุบแถว: ROW_NUMBER (1234) / RANK (1134) / DENSE_RANK (1123), LAG/LEAD, running total, moving average
- **Frame:** default เมื่อมี ORDER BY = RANGE (ties รวมก้อน) / `ROWS 6 PRECEDING` = 7 แถว ไม่ใช่ 7 วัน → date spine
- **Dedup / Top-N** = ROW_NUMBER ใน CTE แล้วกรองข้างนอก + tie-breaker เสมอ
- **Gaps & Islands** = วันที่ − ลำดับ = เลขเกาะ (DISTINCT วันก่อน)
- **เวลา:** เก็บ UTC, แปลงก่อนตัดวัน, half-open interval, อย่าครอบ column ด้วยฟังก์ชันใน WHERE
- **Data quality:** row count, uniqueness, null rate, referential, reconciliation — รันทุกวันเหมือน test
- **ช้า:** EXPLAIN → filter early → เลิก SELECT * → aggregate ก่อน JOIN → partition → ตารางสรุป → warehouse

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **ถาม grain ก่อนเขียนทุก query** — "1 แถว = 1 อะไร" แก้ fan-out และ double counting ได้ครึ่งหนึ่งของโลก
2. **SQL ทำงานตามสายพาน FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY** — ตอบได้ทุกคำถาม "ทำไมใช้ตรงนี้ไม่ได้"
3. **NULL คือกล่องปิดฝา** — `IS NULL` ไม่ใช่ `= NULL`, `NOT EXISTS` ไม่ใช่ `NOT IN`, LEFT JOIN กรองฝั่งขวาที่ ON
4. **Window = GROUP BY ที่ไม่กินแถว** — ROW_NUMBER ใน CTE แล้วกรองข้างนอก, ระบุ frame เอง (ROWS) อย่าพึ่ง default
5. **ตัวเลขต้องพิสูจน์ได้** — row count, uniqueness, null rate, referential, reconcile กับต้นทาง แล้วค่อย optimize ด้วย EXPLAIN

### Keyword ย่อ

```
Logical Order  → FROM→WHERE→GROUP→HAVING→SELECT→ORDER→LIMIT
Grain          → 1 แถว = 1 อะไร
NULL           → ไม่รู้ ≠ 0
COUNT(*)       → ทุกแถว / COUNT(col) ข้าม NULL
LEFT JOIN      → กรองฝั่งขวาที่ ON
Fan-out        → JOIN แล้วแถวงอก → SUM เบิ้ล
Fix fan-out    → aggregate ก่อน JOIN (ไม่ใช่ DISTINCT)
EXISTS         → มีไหม ไม่งอกแถว
NOT IN + NULL  → 0 แถว → ใช้ NOT EXISTS
CTE            → สูตรอาหารเป็นขั้นมีชื่อ
Window         → ข้ามแถวไม่ยุบแถว
PARTITION BY   → แบ่งห้องของ window
ROW_NUMBER     → 1,2,3,4 (dedup / top-N)
Frame default  → RANGE ... CURRENT ROW (ties รวมก้อน)
ROWS 6 PREC    → 7 แถว ≠ 7 วัน → date spine
Islands        → วันที่ − ROW_NUMBER = เลขเกาะ
Time zone      → เก็บ UTC แปลงก่อนตัดวัน
Sargable       → อย่าครอบ column ด้วยฟังก์ชัน
DQ checks      → count / unique / null / FK / reconcile
EXPLAIN        → ล่างขึ้นบน หา node ที่เวลากระโดด
Partition      → อ่านเฉพาะลิ้นชักที่ถาม
Column store   → SELECT * = จ่ายเงินเพิ่ม
```

---

[← สารบัญ](./00-README-TOC.md)
