# PART 33 — DATA ANALYSIS

> ตำแหน่งในภาพใหญ่: Data & Analytics Layer — ชั้นที่เอาข้อมูลที่ระบบเก็บไว้ (PART 8) และ query ออกมาได้ (PART 31) มาตอบคำถามธุรกิจ แล้วเปลี่ยนเป็น "การตัดสินใจ" ถ้า PART 23 ตอบว่า "ระบบยังทำงานดีไหม" chapter นี้ตอบว่า "สิ่งที่เราสร้างมันได้ผลไหม และควรทำอะไรต่อ"

---

## 1. Big Picture

ลองนึกภาพวันจันทร์เช้า PM เดินมาที่โต๊ะแล้วถามว่า

> "หน้า checkout ใหม่ที่ปล่อยไปเมื่อวันพฤหัส มันดีขึ้นไหม?"

Developer ส่วนใหญ่ตอบได้แค่ว่า "error rate ปกติครับ latency ก็ปกติ" — ซึ่ง **ถูกแต่ไม่ได้ตอบคำถาม**
เพราะเขาไม่ได้ถามว่าระบบยังรันอยู่ไหม เขาถามว่า **"คนซื้อของมากขึ้นหรือน้อยลง และเราควรเก็บ feature นี้ไว้หรือถอยกลับ"**

นี่คือความต่างระหว่าง 2 โลก:

| โลก | คำถาม | ตัวอย่าง metric | อยู่ PART ไหน |
|---|---|---|---|
| Technical metrics (Observability) | ระบบ **ทำงาน** ปกติไหม | latency, error rate, CPU | PART 23 |
| Business / Product metrics (Data Analysis) | สิ่งที่ทำ **ได้ผล** ไหม | conversion rate, retention, revenue per user | PART 33 (บทนี้) |

**Data Analysis → การวิเคราะห์ข้อมูล → กระบวนการเปลี่ยนคำถามธุรกิจให้เป็นตัวเลขที่นิยามชัด แล้วใช้ตัวเลขนั้นช่วยตัดสินใจ โดยรู้ว่าตัวเลขนั้นเชื่อได้แค่ไหน**

นิยามนี้มี 3 ส่วน และคือ 3 เรื่องใหญ่ของ chapter นี้:

| ส่วนของนิยาม | เรื่องที่ต้องเรียน |
|---|---|
| คำถาม → ตัวเลขที่นิยามชัด | Metric definition, North Star / Input / Guardrail, Event tracking, Tracking plan |
| ตัวเลข → คำตอบ | Funnel, Cohort, Retention, Segmentation, Median/Percentile, Correlation vs Causation, Bias |
| คำตอบ → การตัดสินใจ (อย่างรู้ความไม่แน่นอน) | A/B testing, Significance, Power, SRM, Dashboard, Decision memo |

ทำไม developer ต้องรู้เรื่องนี้ ทั้งที่มี data analyst อยู่แล้ว?

1. **Developer เป็นคนยิง event** — ถ้า tracking ผิดตั้งแต่ต้น analyst เก่งแค่ไหนก็วิเคราะห์ข้อมูลขยะ
2. **Developer เป็นคนเขียน query** — SQL ที่ JOIN ผิดหนึ่งบรรทัด ทำให้ conversion rate เพี้ยนไป 2 เท่าได้เงียบ ๆ
3. **Developer ระดับ Senior ต้องพิสูจน์ผลงานตัวเอง** — "ผมทำ feature X" สู้ไม่ได้กับ "ผมทำ feature X แล้ว activation rate ขึ้น 4 จุด วัดด้วย A/B test"

**ถ้าคุณจำได้ประโยคเดียว: ตัวเลขที่ไม่มีนิยามชัด = ความเห็นที่แต่งตัวเป็นข้อเท็จจริง**

---

## 2. Keywords

### 2.1 Metric & Tracking

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Metric | ตัวเลขที่เราตกลงกันว่าจะวัด | ต้องมี นิยาม + หน่วย + ช่วงเวลา |
| Numerator / Denominator | ตัวตั้ง / ตัวหาร | "อะไร ÷ ของอะไร" ต้องพูดได้ทั้งคู่ |
| Time Window | ช่วงเวลาที่นับ | วันไหนถึงวันไหน, นับตาม timezone ไหน |
| Unit of Analysis | หน่วยที่นับ | นับเป็น user, session, order หรือ device |
| North Star Metric | ตัวเลขหลักตัวเดียวของ product | สะท้อนคุณค่าที่ลูกค้าได้จริง |
| Input Metric | ตัวเลขที่ทีมขยับได้ตรง ๆ | คันโยกที่ดัน North Star |
| Guardrail Metric | ตัวเลขที่ห้ามแย่ลง | รั้วกั้นไม่ให้ชนะแบบโกง |
| Vanity Metric | ตัวเลขที่ดูดีแต่ไม่ช่วยตัดสินใจ | ยอดสะสม, pageview ดิบ |
| Leading Indicator | ตัวเลขที่ขยับก่อน | บอกอนาคต แต่มี noise |
| Lagging Indicator | ตัวเลขที่ขยับทีหลัง | บอกความจริง แต่รู้ช้า |
| Event | 1 การกระทำที่ถูกบันทึก | "ใคร ทำอะไร เมื่อไร ที่ไหน" |
| Event Property | รายละเอียดของ event | `plan=pro`, `source=email` |
| User ID / Anonymous ID | ตัวระบุคน | ก่อน login กับหลัง login ต้องผูกกันได้ |
| Tracking Plan | สัญญาว่าจะยิง event อะไรบ้าง | API contract ของข้อมูล analytics |

### 2.2 Analysis Techniques

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Funnel | ขั้นตอนที่ user ต้องผ่านไปถึงเป้าหมาย | กรวยที่แคบลงทุกขั้น |
| Step Conversion | % ที่ผ่านจากขั้นหนึ่งไปขั้นถัดไป | ดูว่ารั่วที่ขั้นไหน |
| Drop-off | คนที่หลุดออกระหว่างทาง | 1 − step conversion |
| Time-to-Convert | ใช้เวลานานแค่ไหนกว่าจะผ่าน funnel | median ดีกว่า average |
| Cohort | กลุ่มคนที่เริ่มพร้อมกัน | "รุ่น" ของ user |
| Retention | คนยังกลับมาใช้อยู่ไหม | ตัวชี้วัดว่า product มีคุณค่าจริง |
| N-day Retention | กลับมาในวันที่ N พอดี | Day 7 = กลับมาวันที่ 7 |
| Rolling (Unbounded) Retention | กลับมาในวันที่ N หรือหลังจากนั้น | ตัวเลขสูงกว่าหรือเท่ากับ N-day เสมอ |
| Retention Curve | กราฟ retention ตามเวลา | ดูว่า "แบน" หรือ "ลงถึงศูนย์" |
| Segmentation | แบ่งกลุ่มเพื่อเทียบ | ค่าเฉลี่ยรวมซ่อนความจริง |
| Median / Percentile | ค่ากลาง / ค่า ณ ตำแหน่ง | ทนต่อ outlier กว่า average |
| Outlier | ค่าที่ผิดปกติสุดโต่ง | ลูกค้าเจ้าเดียวซื้อ 1 ล้าน |

### 2.3 Causation & Bias

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Correlation | สองอย่างขยับไปด้วยกัน | ไม่ได้แปลว่าอันหนึ่งทำให้อีกอันเกิด |
| Causation | อันหนึ่งเป็นเหตุของอีกอัน | พิสูจน์ด้วย experiment |
| Confounder | ตัวแปรที่สามที่ทำให้ทั้งคู่ขยับ | "ตัวการเบื้องหลัง" |
| Simpson's Paradox | ทุกกลุ่มย่อยดีขึ้น แต่รวมแล้วแย่ลง | สัดส่วนกลุ่มเปลี่ยน |
| Selection Bias | กลุ่มที่เราดูไม่ใช่ตัวแทน | คนที่เลือกเองต่างจากคนทั่วไป |
| Survivorship Bias | ดูแต่คนที่รอด | คนที่เลิกใช้ไม่อยู่ในข้อมูล |

### 2.4 Experimentation & Communication

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| A/B Test | สุ่มแบ่งคนเป็นกลุ่มแล้วเทียบ | วิธีมาตรฐานพิสูจน์ causation |
| Randomization Unit | หน่วยที่ถูกสุ่ม | user / session / device / บริษัท |
| Sample Size | จำนวนคนที่ต้องมีในการทดลอง | ต้องคำนวณก่อนเริ่ม |
| Statistical Power | โอกาสที่จะเจอผล ถ้าผลมีอยู่จริง | ปกติตั้ง 80% |
| MDE | ผลต่างเล็กที่สุดที่อยากตรวจเจอ | ยิ่งเล็ก ยิ่งต้องใช้คนเยอะ |
| p-value / Significance | ความน่าจะเป็นที่เห็นผลขนาดนี้หรือสุดโต่งกว่า ถ้าจริง ๆ ไม่มีผล | ต่ำ = ไม่น่าใช่ดวง |
| Confidence Interval | ช่วงค่าที่ผลจริงน่าจะอยู่ | บอกขนาดผล + ความไม่แน่นอน |
| Peeking Problem | แอบดูผลแล้วหยุดเมื่อเห็นว่าชนะ | ทำให้ false positive พุ่ง |
| Novelty Effect | คนลองของใหม่เพราะมันใหม่ | ผลช่วงแรกสูงเกินจริง |
| SRM (Sample Ratio Mismatch) | สัดส่วนคนในแต่ละกลุ่มไม่ตรงที่ตั้ง | สัญญาณว่าการทดลองพัง |
| Attribution | ให้เครดิตยอดขายกับช่องทางไหน | first-touch / last-touch / multi-touch |
| Decision Memo | เอกสารสรุปผลเพื่อตัดสินใจ | คำตอบก่อน หลักฐานทีหลัง |

---

## 3. Mental Model

### Mental Model หลัก: Analysis คือ "loop" ไม่ใช่ "report"

Junior มองว่างาน data คือ "ดึงตัวเลขมาทำกราฟ" — ถ้ามองแบบนั้น คุณจะผลิต dashboard ที่ไม่มีใครเปิด

ให้มองว่ามันคือ loop 5 ขั้น:

```
   ┌──────────────────────────────────────────────────┐
   ↓                                                  │
[QUESTION]   "ทำไม signup ลดลง?"  (คำถามที่ผูกกับการตัดสินใจ)
   ↓
[HYPOTHESIS] "เพราะหน้า form ใหม่ยาวขึ้น"  (คำตอบที่เดาไว้ก่อน + พิสูจน์ผิดได้)
   ↓
[DATA]       funnel ก่อน/หลัง, แยก device, ดู tracking ถูกไหม
   ↓
[ANSWER]     "drop-off ที่ step 2 เพิ่ม 12 จุด เฉพาะ mobile"
   ↓
[DECISION]   "ย่อ form บน mobile แล้ววัดด้วย A/B test" ─────┘
```

> **ให้มองภาพนี้ว่า** "ทุกการวิเคราะห์เริ่มจากคำถามที่มีการตัดสินใจรออยู่ปลายทาง และจบที่การตัดสินใจที่สร้างคำถามใหม่ — ถ้าตัวเลขไม่เปลี่ยนการตัดสินใจของใครเลย มันคือเรื่องน่ารู้ ไม่ใช่ analysis"

**คำถามทดสอบก่อนเริ่มงานทุกครั้ง:** "ถ้าผลออกมาเป็น X เราจะทำอะไร ถ้าออกมาเป็น Y เราจะทำอะไรต่างไป?"
ถ้าตอบว่า "ทำเหมือนเดิมทั้งสองกรณี" → ไม่ต้องวิเคราะห์ ประหยัดเวลาทุกคน

### Mental Model ที่ 2: Metric คือ "function" ที่ต้องมี signature ครบ

Developer เข้าใจเรื่องนี้ง่ายที่สุดถ้ามองเป็นโค้ด:

```
conversion_rate(
    numerator   = users ที่ทำ order_completed อย่างน้อย 1 ครั้ง,
    denominator = users ที่ทำ checkout_started,
    unit        = distinct user_id,
    window      = ภายใน 24 ชม. หลัง checkout_started,
    period      = 1–30 ก.ย. ตามเวลา Asia/Bangkok,
    filters     = ไม่รวม internal/test account, ไม่รวม bot
)
```

> **ให้มองภาพนี้ว่า** "metric ที่นิยามไม่ครบก็เหมือน function ที่ไม่มี type — คนสองคนเรียกชื่อเดียวกัน แต่ได้ผลคนละค่า แล้วเถียงกันในห้องประชุมว่าใครผิด"

คำว่า "conversion rate 3%" ในบริษัทเดียวกัน อาจหมายถึง order/session, order/visitor, buyer/signup — ตัวเลขต่างกันได้ 5 เท่า **ทุกคนถูกหมด แค่ไม่ได้วัดสิ่งเดียวกัน**

### Mental Model ที่ 3: ทุกตัวเลขคือ "ความจริง + noise + bias"

```
ตัวเลขที่เห็น = ผลจริง + ความผันผวนตามธรรมชาติ (noise) + ความเอียงจากวิธีเก็บ/เลือกข้อมูล (bias)
```

- **Noise** แก้ด้วยข้อมูลที่มากขึ้น / ช่วงเวลาที่ยาวขึ้น / สถิติ
- **Bias** แก้ด้วยข้อมูลที่มากขึ้น **ไม่ได้** — ข้อมูลเอียงล้านแถวก็ยังเอียง ต้องแก้ที่วิธีเก็บและวิธีเลือกกลุ่ม

ประโยคที่ Senior พูด: "ก่อนถามว่าตัวเลขขึ้นเพราะอะไร ให้ถามก่อนว่าตัวเลขขึ้นจริงไหม — เพราะ tracking พัง, bot, หรือวันหยุด ก็ทำให้กราฟขยับได้พอกัน"

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำ:
Metric            = เครื่องชั่งที่ทุกคนตกลงกันว่าจะใช้เครื่องเดียวกัน
North Star        = ดาวเหนือ — ทิศที่ทั้งเรือมุ่งไป
Input Metric      = พายและใบเรือ — สิ่งที่ลูกเรือขยับได้จริง
Guardrail         = ราวกันตกของสะพาน — วิ่งเร็วได้ แต่ห้ามตก
Vanity Metric     = จำนวน follower — ดูดีบนสไลด์ จ่ายเงินเดือนไม่ได้
Funnel            = กรวยกรองน้ำ — ใส่เข้า 100 ออกมา 3 หาว่ารั่วตรงไหน
Cohort            = รุ่นนักเรียน — รุ่นปี 2025 เทียบกับรุ่นปี 2026
Retention Curve   = ถังน้ำรั่ว — รั่วแล้วหยุดที่ระดับหนึ่ง หรือรั่วจนหมดถัง
Confounder        = คนเชิดหุ่นหลังฉาก — หุ่นสองตัวขยับพร้อมกันเพราะมือเดียวกัน
A/B Test          = การทดลองยาแบบสุ่ม — กลุ่มได้ยาจริง vs ยาหลอก
Peeking           = โยนเหรียญจนกว่าจะออกหัว 3 ครั้งติดแล้วประกาศว่าเหรียญโกง
SRM               = ตาชั่งเอียงตั้งแต่ก่อนชั่ง — ผลชั่งอะไรก็เชื่อไม่ได้
Decision Memo     = ใบสั่งยา — บอกว่าให้ทำอะไร ไม่ใช่แค่ผลแล็บ
```

### ภาพจำเจาะลึก: Correlation vs Causation = "ไอศกรีมกับคนจมน้ำ"

```
ยอดขายไอศกรีม ↑   ───── ขยับพร้อมกัน ─────   จำนวนคนจมน้ำ ↑
        ↑                                          ↑
        └──────────── อากาศร้อน (Confounder) ───────┘
```

> **ให้มองภาพนี้ว่า** "ไอศกรีมไม่ได้ทำให้คนจมน้ำ — หน้าร้อนทำให้เกิดทั้งสองอย่าง การห้ามขายไอศกรีมจึงไม่ช่วยใครเลย"

เวอร์ชันในงานจริงที่เจอบ่อยมาก:

| สิ่งที่เห็นใน data | ข้อสรุปที่ผิด | Confounder ที่น่าจะใช่ |
|---|---|---|
| คนที่ใช้ feature "Dark mode" retention สูงกว่า 2 เท่า | "บังคับเปิด dark mode ให้ทุกคน" | power user เป็นคนที่หาเจอ setting นี้ — เขา retain สูงอยู่แล้ว |
| คนที่เปิด push notification ซื้อบ่อยกว่า | "ขอ permission ถี่ ๆ" | คนที่ชอบแอปอยู่แล้วถึงยอมเปิด |
| คนที่ติดต่อ support มี churn สูง | "support ทำให้ลูกค้าหนี" | คนที่เจอปัญหาถึงติดต่อ support |

**ประโยคที่ต้องพูดได้ใน interview:**
"Correlation บอกว่าควรสงสัยอะไร แต่ causation ต้องพิสูจน์ด้วยการทดลองที่สุ่ม — เพราะการสุ่มคือวิธีเดียวที่ทำให้ confounder กระจายเท่ากันทั้งสองกลุ่มโดยที่เราไม่ต้องรู้ว่ามันคืออะไร"

---

## 5. How It Works

### 5.1 ข้อมูลเดินทางจากปุ่มกด ถึงการตัดสินใจอย่างไร

```
[USER กดปุ่ม]
      ↓
[CLIENT / SERVER]   track("order_completed", { order_id, amount, currency })
      ↓
[EVENT COLLECTOR]   Segment / RudderStack / PostHog / endpoint ของเราเอง
      ↓
[RAW EVENTS]        ตาราง events ดิบ (append-only, ซ้ำได้, มาช้าได้)
      ↓
[TRANSFORM]         dedupe, ผูก anonymous_id → user_id, กรอง bot/test  (PART 34)
      ↓
[MODELED TABLES]    fact_orders, dim_users, daily_active_users
      ↓
[QUERY / METRIC]    SQL ที่นิยาม metric (PART 31)
      ↓
[DASHBOARD / ANALYSIS]
      ↓
[DECISION]
```

> **ให้มองภาพนี้ว่า** "ตัวเลขบน dashboard คือปลายท่อที่ยาวมาก ทุกข้อต่อรั่วได้ — ตัวเลขผิดส่วนใหญ่ไม่ได้ผิดที่สถิติ แต่ผิดที่ข้อต่อตรงกลาง: event ไม่ยิง ยิงซ้ำ ผูก user ผิด หรือ JOIN ผิด"

### 5.2 North Star / Input / Guardrail ทำงานร่วมกันอย่างไร

```
                    ┌──────────────────────────────┐
                    │  NORTH STAR                  │
                    │  "จำนวน order ที่ส่งถึงมือ     │
                    │   ลูกค้าต่อสัปดาห์"            │
                    └──────────────┬───────────────┘
              ┌────────────────────┼────────────────────┐
              ↓                    ↓                    ↓
      [INPUT] คนมาใหม่       [INPUT] conversion      [INPUT] ซื้อซ้ำ
      (ทีม Growth)           (ทีม Checkout)          (ทีม CRM)

   ════ GUARDRAILS (ห้ามแย่ลง) ═══════════════════════════════
      refund rate · page latency p95 · unsubscribe rate · support tickets
```

| ประเภท | หน้าที่ | ตัวอย่าง | คำเตือน |
|---|---|---|---|
| North Star | บอกทิศของทั้งบริษัท | weekly active buyers | ขยับช้า ทีมเดียวขยับเองไม่ได้ |
| Input | สิ่งที่ทีมขยับได้ในสัปดาห์นี้ | checkout conversion | ต้องพิสูจน์ว่ามันดัน North Star จริง |
| Guardrail | กันไม่ให้ชนะแบบทำลายของอื่น | refund rate, latency | ถ้าไม่มี ทีมจะ optimize จนของพัง |

**ทำไมต้องมี guardrail:** "Goodhart's Law — เมื่อตัวเลขกลายเป็นเป้าหมาย มันจะเลิกเป็นตัววัดที่ดี"
ตั้งเป้า signup อย่างเดียว → ทีมตัด email verification ทิ้ง → signup พุ่ง, bot พุ่ง, ของจริงไม่เพิ่ม

### 5.3 Leading vs Lagging

```
เวลา →
  วันที่ 1        วันที่ 7          วันที่ 30          วันที่ 90
[activation]  → [week-1 retention] → [first purchase] → [revenue / churn]
  LEADING ←───────────────────────────────────────────→ LAGGING
  รู้เร็ว / noise สูง / อาจไม่สัมพันธ์กับผลจริง        รู้ช้า / เชื่อได้ / สายเกินจะแก้
```

> **ให้มองภาพนี้ว่า** "Lagging คือผลสอบปลายภาค Leading คือคะแนนการบ้านรายสัปดาห์ — การบ้านช่วยเตือนเร็ว แต่ต้องพิสูจน์ก่อนว่าคนที่ทำการบ้านดีสอบได้ดีจริง"

**Trade-off:** ใช้ leading ทำให้ตัดสินใจเร็ว แต่ถ้าเลือก leading ที่ไม่สัมพันธ์กับ lagging จริง จะ optimize ของผิดไปทั้งไตรมาส

### 5.4 Event Tracking Design — ยิง event ให้วิเคราะห์ได้

**โครงของ event ที่ดี:**

```
event:       "checkout_started"            ← object_action, past tense, snake_case
user_id:     "u_9281"                      ← null ถ้ายังไม่ login
anonymous_id:"a_77f1..."                   ← มีเสมอ ใช้ผูกก่อน/หลัง login
timestamp:   "2026-09-23T03:14:07Z"        ← UTC เสมอ แปลง timezone ตอนวิเคราะห์
properties:
  cart_value:  1290                        ← ตัวเลขเป็นตัวเลข ไม่ใช่ string
  currency:    "THB"
  item_count:  3
  source:      "cart_page"
context:
  platform: "ios", app_version: "5.2.0"    ← ช่วยตอน debug ว่าพังเฉพาะ version ไหน
```

**กฎการตั้งชื่อที่ช่วยชีวิต:**

| กฎ | ดี | แย่ |
|---|---|---|
| object + action (past tense) | `order_completed` | `clickBuyBtn`, `purchase` |
| ชื่อบอก "ความหมาย" ไม่ใช่ UI | `signup_completed` | `green_button_clicked` |
| 1 ความหมาย = 1 event, แยกด้วย property | `button_clicked {name: "share"}` | `share_button_clicked_v2_new` |
| ยิงจาก server เมื่อเป็น "ความจริงทางธุรกิจ" | `order_completed` ยิงหลังจ่ายเงินสำเร็จ | ยิงจาก client ตอนกดปุ่ม (ยังไม่รู้ว่าจ่ายผ่านไหม) |

**Tracking Plan = API contract ของ analytics**

| event | ยิงเมื่อไร | properties (type) | ยิงจาก | owner |
|---|---|---|---|---|
| `signup_completed` | สร้าง account สำเร็จ | method (enum: email/google) | server | team-auth |
| `checkout_started` | เข้าหน้า checkout | cart_value (number), item_count (int) | client | team-checkout |
| `order_completed` | payment ยืนยันแล้ว | order_id (string), amount (number), currency | server | team-checkout |

> **ให้มองภาพนี้ว่า** "Tracking plan คือ schema ของข้อมูลที่ยังไม่เกิด — ถ้าไม่เขียนไว้ อีก 6 เดือนจะมี `purchase`, `Purchase`, `order_done`, `checkout_success` ที่แปลว่าอย่างเดียวกันแต่นับไม่เท่ากัน"

**Client vs Server tracking — trade-off:**

| | Client-side | Server-side |
|---|---|---|
| เห็นอะไร | พฤติกรรม UI ละเอียด (scroll, click, view) | ความจริงทางธุรกิจ (จ่ายเงินสำเร็จ) |
| ความแม่นยำ | โดน ad blocker, ปิดแท็บก่อนส่ง, หายได้ 10–30% | แม่นกว่ามาก |
| ใช้กับ | engagement, UX funnel | revenue, order, subscription |

### 5.5 Funnel ทำงานอย่างไร

```
visited_product      10,000  ██████████████████████████ 100%
        ↓  step conv 30%     ← drop-off ใหญ่สุดเชิงสัดส่วน (หลุด 70%)
added_to_cart         3,000  ████████                    30%
        ↓  step conv 50%
checkout_started      1,500  ████                        15%
        ↓  step conv 40%
order_completed         600  ██                           6%  (overall conversion)
```

| ตัวเลข | สูตร | ใช้ตอบว่า |
|---|---|---|
| Step conversion | step N ÷ step N−1 | รั่วที่ขั้นไหน |
| Overall conversion | step สุดท้าย ÷ step แรก | funnel ทั้งเส้นดีแค่ไหน |
| Drop-off | 1 − step conversion | เสียคนไปกี่ % ที่ขั้นนั้น |
| Time-to-convert | median(เวลา step สุดท้าย − step แรก) | คนลังเลนานไหม |

**การตัดสินใจเชิงนิยามที่ต้องเลือก (และต้องเขียนไว้):**

| คำถาม | ตัวเลือก | ผลกระทบ |
|---|---|---|
| ต้องทำตามลำดับไหม | Ordered vs Unordered | ordered ได้ตัวเลขต่ำกว่า แต่สะท้อน flow จริง |
| ต้องจบภายในเวลาเท่าไร | conversion window 1 ชม. / 1 วัน / 7 วัน | window ยาว = ตัวเลขสูงขึ้น แต่ cohort ล่าสุดยัง "ไม่ครบ" |
| นับหน่วยอะไร | user vs session | user-based มักสูงกว่า session-based (ไม่ใช่เสมอไป) |
| ข้าม step ได้ไหม | strict vs loose | คนที่ "ซื้อเลย" จากหน้า product หายไปจาก strict funnel |

**Funnel แบบ SQL ให้เห็นภาพ (ordered, window 1 วัน, หน่วย = user):**

```sql
WITH s1 AS (
  SELECT user_id, MIN(ts) AS t1 FROM events
  WHERE event = 'checkout_started' AND ts >= '2026-09-01' AND ts < '2026-10-01'
  GROUP BY user_id
),
s2 AS (
  SELECT s1.user_id, MIN(e.ts) AS t2
  FROM s1 JOIN events e ON e.user_id = s1.user_id
   AND e.event = 'order_completed'
   AND e.ts >= s1.t1 AND e.ts < s1.t1 + INTERVAL '1 day'   -- ordered + window
  GROUP BY s1.user_id
)
SELECT COUNT(*) AS started,
       (SELECT COUNT(*) FROM s2) AS completed,
       ROUND(100.0 * (SELECT COUNT(*) FROM s2) / COUNT(*), 1) AS conv_pct
FROM s1;
```

จุดที่ต้องสังเกต: `MIN(ts)` (เอาครั้งแรก), `e.ts >= s1.t1` (ต้องเกิดหลัง), `INTERVAL '1 day'` (window) — 3 บรรทัดนี้คือ "นิยาม" ที่ซ่อนอยู่ในโค้ด (รายละเอียด CTE / window function อยู่ใน PART 31)

### 5.6 Cohort และ Retention ทำงานอย่างไร

**Cohort table (แต่ละแถว = รุ่นที่ signup สัปดาห์เดียวกัน):**

```
              Week 0   Week 1   Week 2   Week 3   Week 4
Cohort 1 ก.ย.  100%     42%      31%      27%      25%
Cohort 8 ก.ย.  100%     45%      33%      29%      —
Cohort 15 ก.ย. 100%     51%      38%      —        —      ← onboarding ใหม่ปล่อย 15 ก.ย.
Cohort 22 ก.ย. 100%     50%      —        —        —      ← เพิ่งมีแค่ Week 1 ห้ามเทียบ week อื่น
```

> **ให้มองภาพนี้ว่า** "อ่านตามแถว = รุ่นนี้รั่วเร็วแค่ไหน / อ่านตามคอลัมน์ = รุ่นใหม่ดีกว่ารุ่นเก่าไหม ที่อายุเท่ากัน — การเทียบที่ยุติธรรมต้องเทียบคนที่ 'อายุเท่ากัน' เสมอ"

**N-day vs Rolling retention:**

| แบบ | นิยาม "Day 7 retained" | ตัวเลข | ใช้เมื่อ |
|---|---|---|---|
| N-day (classic) | active **ในวันที่ 7 พอดี** | ต่ำกว่า, noise สูง | แอปใช้รายวัน (social, game) |
| Bracket / range | active ในช่วงวันที่ 7–13 | กลาง ๆ, เสถียร | แอปใช้รายสัปดาห์ |
| Rolling (unbounded) | active **วันที่ 7 หรือหลังจากนั้น** | สูงสุด, ลดลงเองไม่ได้ย้อนหลัง (ข้อมูลใหม่ทำให้ตัวเลขเก่าเปลี่ยน) | ดูว่ายัง "ไม่หายไปเลย" |

**Retention curve — รูปร่างบอกอนาคตของ product:**

```
100%│█
    │ █
    │  ██
    │    ███
 25%│       ████████████████   ← แบนลง = มีกลุ่มที่ได้คุณค่าจริง (product-market fit)
    │
    │  ██
    │    ███
    │       ████
  0%│           ██████▁▁▁▁▁▁   ← ลงจนเกือบศูนย์ = ถังรั่ว เทน้ำ (marketing) เพิ่มก็ไม่ช่วย
    └──────────────────────── เวลา
```

**Retention แบบ SQL (Week-N retention ต่อ cohort):**

```sql
WITH cohort AS (
  SELECT user_id, DATE_TRUNC('week', MIN(ts)) AS cohort_week
  FROM events WHERE event = 'signup_completed' GROUP BY user_id
),
activity AS (
  SELECT DISTINCT user_id, DATE_TRUNC('week', ts) AS active_week
  FROM events WHERE event = 'session_started'   -- นิยาม "active" ต้องตกลงกันก่อน
)
SELECT c.cohort_week,
       (EXTRACT(EPOCH FROM a.active_week - c.cohort_week) / 604800)::int AS week_n,  -- PostgreSQL; dialect อื่นใช้ DATE_DIFF(..., WEEK)
       COUNT(DISTINCT a.user_id) AS retained
FROM cohort c JOIN activity a ON a.user_id = c.user_id
                             AND a.active_week >= c.cohort_week
GROUP BY 1, 2 ORDER BY 1, 2;
```

แล้วหารด้วยขนาด cohort (week_n = 0) เพื่อเป็น % — จุดสำคัญคือ **"active" แปลว่าอะไร** (เปิดแอป? ทำ action หลัก?) ซึ่งเปลี่ยนตัวเลขได้มหาศาล

### 5.7 Average vs Median vs Percentile

```
ยอดซื้อต่อ order (บาท): 200, 250, 300, 300, 350, 400, 450, 500, 500, 95,000
                                                                    ↑ ลูกค้าองค์กร 1 เจ้า

Average = 9,825   ← ไม่มีใครซื้อยอดนี้จริงเลย
Median  = 375     ← คนตรงกลางซื้อเท่านี้
p90     = ~9,950  ← 10% บนสุดดึงสูงมาก
```

> **ให้มองภาพนี้ว่า** "ค่าเฉลี่ยของคนในห้อง 10 คน จะกลายเป็นมหาเศรษฐีทันทีที่ Elon Musk เดินเข้ามา — ทั้งที่ไม่มีใครในห้องรวยขึ้นเลย"

| ใช้ | เมื่อ |
|---|---|
| Average (mean) | ข้อมูลกระจายสมมาตร / ต้องการยอดรวม (revenue = avg × n) |
| Median | ข้อมูลเบ้ (เงิน, เวลา, จำนวนครั้ง) — อยากรู้ "คนทั่วไป" |
| Percentile (p90, p99) | สนใจหาง เช่น ลูกค้าที่รอนานที่สุด / ลูกค้ารายใหญ่ |

**Outlier: ห้ามลบทิ้งแบบเงียบ ๆ** — ให้ถามก่อนว่าเป็น (1) bug/bot/test ⇒ กรองออกพร้อมเขียนเหตุผล หรือ (2) ลูกค้าจริงที่สำคัญ ⇒ เก็บไว้แต่วิเคราะห์แยก / ใช้ median / capping (winsorize) พร้อมบอกว่าทำ

### 5.8 A/B Test ทำงานอย่างไร

```
[USERS ทั้งหมดที่เข้าเงื่อนไข]
        ↓
[RANDOM ASSIGNMENT]  hash(user_id + experiment_id) % 100
        ↓                               ↓
   < 50 → CONTROL (A)              ≥ 50 → TREATMENT (B)
   หน้า checkout เดิม              หน้า checkout ใหม่
        ↓                               ↓
[วัด primary metric + guardrails ตามระยะเวลาที่คำนวณไว้]
        ↓
[CHECK SRM] → สัดส่วน 50/50 จริงไหม? ถ้าไม่ → หยุด หา bug ก่อน
        ↓
[เทียบผล: ขนาดผล + confidence interval + p-value]
        ↓
[DECISION: ship / ไม่ ship / ทดลองต่อ]
```

> **ให้มองภาพนี้ว่า** "การสุ่มคือการโยนเหรียญให้ทุกคน — ทำให้สองกลุ่มเหมือนกันทุกอย่างทั้งที่เรารู้และไม่รู้ ต่างกันแค่สิ่งเดียวที่เราเปลี่ยน ผลต่างที่เห็นจึงมาจากสิ่งนั้น (หรือจากดวง ซึ่งสถิติช่วยบอกว่าดวงได้แค่ไหน)"

**องค์ประกอบที่ต้องตัดสินใจก่อนเริ่ม (เขียนลงเอกสารก่อน กด start):**

| เรื่อง | คำถาม | ทำไมสำคัญ |
|---|---|---|
| Hypothesis | เปลี่ยนอะไร คาดว่า metric ไหนขยับทางไหน เพราะอะไร | กันการหาเหตุผลย้อนหลัง |
| Randomization unit | สุ่มเป็น user / session / device / บริษัท | สุ่ม session แต่ user เห็นทั้ง A และ B = ผลปน |
| Primary metric | ตัวเดียวที่ใช้ตัดสิน | ดู 20 metric แล้วเลือกตัวที่ชนะ = หลอกตัวเอง |
| Guardrails | อะไรห้ามแย่ลง | ชนะ conversion แต่ refund พุ่ง = แพ้ |
| MDE + sample size | ผลเล็กสุดที่คุ้มจะเจอ → ต้องใช้คนเท่าไร | กำหนดระยะเวลาทดลอง |
| Duration | อย่างน้อย 1–2 รอบสัปดาห์เต็ม | พฤติกรรมวันธรรมดา ≠ เสาร์อาทิตย์ |

### 5.9 Sample size & Power — เข้าใจแบบไม่ต้องจำสูตร

**4 ตัวที่ดึงกันไปมา:**

```
ผลที่อยากตรวจจับเล็กลง (MDE ↓)       →  ต้องใช้คนมากขึ้นมาก (ประมาณ 1/MDE²)
baseline ต่ำ (เช่น conv 1%)          →  ต้องใช้คนมากขึ้น
อยากมั่นใจมากขึ้น (power ↑, α ↓)     →  ต้องใช้คนมากขึ้น
metric ผันผวนสูง (revenue/user)      →  ต้องใช้คนมากขึ้น
```

ตัวอย่างคร่าว ๆ: baseline conversion 5% อยากตรวจเจอการขยับ 10% แบบสัมพัทธ์ (5.0% → 5.5%) ที่ power 80%, α 5% → ต้องใช้ราว **3 หมื่นคนต่อกลุ่ม**
ถ้าอยากเจอขยับแค่ 5% สัมพัทธ์ → ต้องใช้ราว **4 เท่า** (ครึ่งหนึ่งของผล = สี่เท่าของคน)

> **ให้มองภาพนี้ว่า** "Power คือขนาดของแว่นขยาย — ผลเล็กต้องใช้แว่นใหญ่ (คนเยอะ) ถ้าแว่นเล็กเกินแล้วมองไม่เห็นอะไร ไม่ได้แปลว่าไม่มีอะไร แปลว่าแว่นเล็กไป"

**Trade-off ที่ต้องพูด:** traffic น้อย → ต้องเลือกทดสอบเฉพาะการเปลี่ยนแปลงใหญ่ หรือใช้ metric ที่อยู่ใกล้การเปลี่ยนแปลงมากขึ้น (เช่น step conversion แทน revenue) หรือยอมรับว่าจะตัดสินใจด้วยหลักฐานที่อ่อนกว่า

### 5.10 Statistical significance ในภาษาคน

**p-value = "ถ้าจริง ๆ แล้วของใหม่ไม่ได้ต่างจากของเดิมเลย โอกาสที่เราจะเห็นผลต่างขนาดนี้ (หรือมากกว่า) เพราะดวงล้วน ๆ คือเท่าไร"**

| พูดแบบนี้ ✅ | ห้ามพูดแบบนี้ ❌ |
|---|---|
| "p = 0.03 แปลว่าถ้าไม่มีผลจริง โอกาสเห็นผลต่างขนาดนี้มีราว 3% — เลยไม่น่าใช่แค่ดวง" | "มีโอกาส 97% ที่ B ดีกว่า A" |
| "ผลอยู่ที่ +2.1% (95% CI: +0.4% ถึง +3.8%)" | "B ชนะ 2.1%" (ไม่บอกความไม่แน่นอน) |
| "ไม่ significant = ยังพิสูจน์ไม่ได้ว่าต่าง" | "ไม่ significant = ไม่มีผล" |
| "significant แต่ผลแค่ +0.1% ไม่คุ้มค่า maintain" | "significant = ต้อง ship" |

> **ให้มองภาพนี้ว่า** "Statistical significance ตอบว่า 'มันเป็นดวงไหม' แต่ไม่ได้ตอบว่า 'มันใหญ่พอจะสนใจไหม' — ต้องดู confidence interval คู่กันเสมอ"

### 5.11 กับดักของ A/B test ที่ทำให้ผลโกหก

**1. Peeking Problem — แอบดูแล้วหยุดเมื่อชนะ**

```
วันที่ 1: p = 0.30   ไม่หยุด
วันที่ 2: p = 0.12   ไม่หยุด
วันที่ 3: p = 0.04   ← "ชนะแล้ว! ship!"   ❌
วันที่ 7: p = 0.41   (ถ้ารอจนครบ จะเห็นว่าไม่มีผลจริง)
```

ถ้าดูทุกวันแล้วหยุดทันทีที่ p < 0.05 โอกาส false positive จาก 5% จะพุ่งไปหลายเท่าตัว (ดูบ่อยพอก็อาจถึง 20–30%)
**แก้:** กำหนด sample size และวันจบไว้ก่อน / ถ้าต้องดูระหว่างทาง ใช้ sequential testing ที่ออกแบบมาให้ดูได้ (หลาย platform มีให้)

**2. Novelty / Primacy Effect**
- Novelty: user คลิกของใหม่เพราะมัน "ใหม่" → ผลสัปดาห์แรกสูง แล้วค่อย ๆ ลด
- Primacy: user เก่าชินของเดิม → ผลช่วงแรกแย่ แล้วค่อย ๆ ดีขึ้น
**แก้:** รันนานพอ, ดูผลแยกตามสัปดาห์, แยก new user vs existing user

**3. SRM (Sample Ratio Mismatch)**
ตั้ง 50/50 แต่ได้ 50,000 vs 47,800 → ต่างกันเกินกว่าที่ดวงจะอธิบายได้ (เช็คด้วย chi-square test)
สาเหตุบ่อย: treatment crash แล้วไม่ยิง event, redirect ทำ event หาย, bot filter ทำงานไม่เท่ากัน, assignment เกิดหลังเงื่อนไขบางอย่าง
**กฎ: เจอ SRM = ห้ามอ่านผล ต้องหา bug ก่อน** — เพราะกลุ่มที่หายไปไม่ได้หายแบบสุ่ม

**4. Multiple comparisons** — ดู 20 metric หรือ 20 segment ที่ α 5% โดยเฉลี่ยจะ "ชนะ" 1 ตัวเพราะดวง
**แก้:** มี primary metric ตัวเดียว, ที่เหลือเป็น exploratory แล้วยืนยันด้วยการทดลองรอบใหม่

**5. Interference / Network effect** — marketplace, social: คนกลุ่ม B ที่ได้ส่วนลดไปแย่งของจากกลุ่ม A → สองกลุ่มไม่อิสระต่อกัน
**แก้:** สุ่มระดับใหญ่ขึ้น (เมือง / ช่วงเวลา) แลกกับ sample size ที่น้อยลง

### 5.12 Attribution — ใครได้เครดิต

```
user journey:  [เห็นโฆษณา FB] → [ค้น Google] → [อ่าน email] → [ซื้อ]

First-touch  → FB ได้ 100%
Last-touch   → Email ได้ 100%
Linear       → คนละ 33%
Time-decay   → Email มากสุด FB น้อยสุด
```

| Model | ข้อดี | ข้อเสีย |
|---|---|---|
| First-touch | ให้เครดิตช่องทางที่พาคนใหม่เข้ามา | ไม่เห็นว่าอะไรปิดการขาย |
| Last-touch | ง่าย, default ของหลายเครื่องมือ | ช่องทาง "ปิดการขาย" (brand search, email) ดูดีเกินจริง |
| Multi-touch | ยุติธรรมกว่าในเชิงความรู้สึก | ยังเป็นแค่กติกาที่เราเลือก ไม่ใช่ causation |
| Incrementality test (holdout) | วัด causation จริง | ต้องยอมไม่ยิงโฆษณาใส่คนกลุ่มหนึ่ง แพงและช้า |

**ประโยคที่ Senior พูด:** "Attribution model ทุกแบบคือกติกาการแบ่งเครดิต ไม่ใช่การพิสูจน์ว่าช่องทางไหนสร้างยอดขาย ถ้าจะรู้ว่าช่องทางไหนทำให้เกิดยอดขายเพิ่มจริง ต้องทำ holdout test"

---

## 6. Example — วิเคราะห์ "conversion ตก" ตั้งแต่คำถามถึง decision memo

### 6.1 โจทย์

วันจันทร์ PM แจ้ง: **"Checkout conversion สัปดาห์ที่แล้วตกจาก 40% เหลือ 34% หลังปล่อยหน้า checkout ใหม่ ควร rollback ไหม?"**

### 6.2 ขั้นที่ 1 — ทำให้คำถามชัดก่อนแตะ SQL

| ถามกลับ | คำตอบที่ได้ |
|---|---|
| conversion นี้นิยามว่าอะไร | `order_completed` ÷ `checkout_started`, distinct user, window 24 ชม. |
| เทียบกับอะไร | สัปดาห์ก่อนหน้า (before/after — ไม่ใช่ A/B test) |
| การตัดสินใจที่รออยู่ | rollback หรือไม่ ภายในวันพุธ |
| ถ้าตกจริง 6 จุด เสียเท่าไร | ~1.2 ล้านบาท/สัปดาห์ → คุ้มที่จะใช้เวลาวิเคราะห์ 1 วัน |

### 6.3 ขั้นที่ 2 — ตรวจว่าตัวเลขตกจริง ก่อนถามว่าตกเพราะอะไร

```
1. Event ยังยิงครบไหม?        → เทียบจำนวน order_completed ใน analytics กับตาราง orders ใน DB
2. นิยามเปลี่ยนไหม?           → หน้าใหม่ยิง checkout_started ตอนไหน? (เดิมยิงตอนกดปุ่ม ใหม่ยิงตอนเปิดหน้า?)
3. traffic mix เปลี่ยนไหม?     → มี campaign ใหม่ดึงคนคุณภาพต่ำเข้ามาไหม
4. seasonality?               → สัปดาห์ที่แล้วมีวันหยุดยาวไหม
```

**สิ่งที่เจอ:** จำนวน order จริงใน DB **ลดลงแค่ 3%** แต่ `checkout_started` **เพิ่มขึ้น 12%**
→ หน้าใหม่ยิง `checkout_started` ทั้งตอน "เปิดหน้า" และตอน "refresh" — **ตัวหารบวม**

> **ให้มองภาพนี้ว่า** "ส่วนใหญ่ของ 'conversion ตก' (ราว 4.6 จาก 6 จุด) ไม่ได้มาจากลูกค้าเปลี่ยนพฤติกรรม แต่มาจากเราเปลี่ยนวิธีนับ — ตรวจเครื่องชั่งก่อนตัดสินว่าน้ำหนักขึ้น"

### 6.4 ขั้นที่ 3 — แก้นิยามให้เทียบกันได้ แล้ว segment

หลัง dedupe `checkout_started` ให้เหลือครั้งแรกต่อ user ต่อวัน:

| Segment | ก่อน | หลัง | เปลี่ยน |
|---|---|---|---|
| **รวม** | 40.0% | 38.6% | −1.4 จุด |
| Desktop | 46% | 47% | +1 |
| iOS | 41% | 41% | 0 |
| **Android** | 33% | 26% | **−7** |

แล้ว segment Android ต่อด้วย app version / step ใน funnel → drop-off พุ่งที่ step "เลือกวิธีจ่ายเงิน" เฉพาะ Android WebView เวอร์ชันเก่า
เปิด error log (PART 23) เจอ JS error `Intl.NumberFormat` ไม่ support บน WebView เก่า → ปุ่ม "ยืนยัน" render ไม่ขึ้น

### 6.5 ขั้นที่ 4 — ระวัง Simpson's Paradox ระหว่างทาง

ถ้าไม่ segment อาจเจอภาพนี้ได้ด้วย:

| | สัปดาห์ก่อน | สัปดาห์นี้ |
|---|---|---|
| Desktop | 50% (จาก 8,000 คน) | **52%** (จาก 4,000 คน) |
| Mobile | 30% (จาก 2,000 คน) | **32%** (จาก 6,000 คน) |
| **รวม** | **46%** | **40%** ← ตกทั้งที่ทุกกลุ่มดีขึ้น! |

สาเหตุ: สัดส่วนคนเปลี่ยน (campaign ใหม่ดึงคน mobile ซึ่ง conversion ต่ำกว่าโดยธรรมชาติ)
> **ให้มองภาพนี้ว่า** "ค่ารวมคือค่าเฉลี่ยถ่วงน้ำหนัก — ถ้าน้ำหนักเปลี่ยน ค่ารวมเปลี่ยนได้ทั้งที่ทุกกลุ่มไม่ได้แย่ลงเลย"

### 6.6 ขั้นที่ 5 — Decision Memo

```
หัวเรื่อง: Checkout ใหม่ — ไม่ rollback, hotfix Android WebView

คำตอบ (บรรทัดแรกเสมอ)
  ไม่ rollback ทั้งหมด — conversion ที่ตกส่วนใหญ่มาจาก tracking ซ้ำ
  ส่วนที่ตกจริงอยู่ที่ Android WebView เก่า (ปุ่มยืนยันไม่ render) → hotfix วันนี้

หลักฐาน
  • order จริงใน DB −3% (ขณะที่ conversion บน dashboard ตก 15% เชิงสัมพัทธ์ เพราะตัวหารบวม)
  • หลังแก้ dedupe: รวม −1.4 จุด / Android −7 จุด / Desktop +1 / iOS 0
  • JS error rate บน Android WebView < v90 พุ่งตั้งแต่วัน release

ความไม่แน่นอน
  • เป็น before/after ไม่ใช่ A/B → seasonality ยังแยกไม่ออก 100%
  • ผล Desktop +1 จุด อยู่ในระดับ noise ปกติของรายสัปดาห์ (±1.5) — ยังสรุปไม่ได้ว่าหน้าใหม่ดีกว่า

สิ่งที่จะทำ
  1. hotfix polyfill วันนี้ (owner: team-checkout)
  2. แก้ event ให้ยิงครั้งเดียวต่อ session + เพิ่มใน tracking plan
  3. รัน A/B test หน้าใหม่ vs เก่า 2 สัปดาห์ เพื่อวัดผลจริง
  4. เพิ่ม alert: order ใน DB vs order_completed ใน analytics ต่างกัน > 5%

จะกลับมาทบทวนเมื่อ: ผล A/B ครบ 2 สัปดาห์ (วันที่ 7 ต.ค.)
```

> **ให้มองภาพนี้ว่า** "Decision memo คือ 'คำตอบก่อน หลักฐานทีหลัง ความไม่แน่นอนตรงไปตรงมา และมีคนรับผิดชอบกับวันที่' — ผู้บริหารอ่านแค่ 3 บรรทัดแรกก็ต้องตัดสินใจได้"

### 6.7 ตัวอย่างเสริม: สื่อสารความไม่แน่นอนให้คนไม่ใช่สาย data

| แทนที่จะพูด | ให้พูดว่า |
|---|---|
| "p-value 0.07 ครับ" | "มีสัญญาณว่าดีขึ้น แต่ยังไม่ชัดพอจะตัดออกว่าเป็นดวง ถ้าอยากมั่นใจต้องรันต่ออีก 1 สัปดาห์" |
| "CI คือ −0.5% ถึง +4%" | "กรณีแย่สุดคือแทบไม่เปลี่ยน กรณีดีสุดคือดีขึ้น 4% — ไม่มีสัญญาณว่าแย่ลงอย่างมีนัยยะ" |
| "ข้อมูลไม่พอ" | "ด้วย traffic ตอนนี้ เราจะเห็นผลได้ก็ต่อเมื่อมันขยับเกิน 8% — ถ้าผลจริงเล็กกว่านั้น test นี้จะมองไม่เห็น" |
| "ขึ้น 50%!" | "ขึ้นจาก 2 เป็น 3 คนต่อวัน — เร็วเกินไปที่จะสรุป" (บอก base เสมอ) |

---

## 7. Compare

### 7.1 Metric ที่มักสับสน

| คู่ที่สับสน | ต่างกันตรงไหน |
|---|---|
| **Technical metric vs Business metric** | latency/error rate บอกว่าระบบทำงาน (PART 23) / conversion/retention บอกว่า product ได้ผล |
| **North Star vs Input** | North Star = ผลลัพธ์ที่ทั้งบริษัทมุ่ง ขยับช้า / Input = คันโยกที่ทีมขยับได้เอง |
| **Input vs Guardrail** | Input = อยากให้ขึ้น / Guardrail = ห้ามแย่ลง |
| **Actionable vs Vanity** | actionable เปลี่ยนการตัดสินใจได้ / vanity แค่ดูดี (total signups สะสม ขึ้นอย่างเดียว ไม่เคยลง) |
| **Leading vs Lagging** | leading รู้เร็วแต่ต้องพิสูจน์ความสัมพันธ์ / lagging เชื่อได้แต่รู้ช้า |
| **Rate vs Count** | count โตตาม traffic / rate เทียบข้ามช่วงเวลาได้ — ต้องรายงานคู่กัน |
| **Absolute vs Relative change** | 5% → 6% = +1 จุด (absolute) = +20% (relative) — ต้องบอกว่าพูดแบบไหน |
| **DAU vs MAU vs DAU/MAU** | DAU/MAU = stickiness — ใช้บ่อยแค่ไหนในหนึ่งเดือน |

### 7.2 Analysis technique

| ประเด็น | Funnel | Cohort / Retention | Segmentation |
|---|---|---|---|
| ตอบคำถาม | "รั่วที่ขั้นไหน" | "คนยังอยู่ไหม รุ่นใหม่ดีกว่ารุ่นเก่าไหม" | "กลุ่มไหนต่าง" |
| มิติหลัก | ลำดับขั้นตอน | เวลานับจากจุดเริ่ม | คุณสมบัติของคน/บริบท |
| กับดัก | window/ordering ต่างกัน = ตัวเลขต่าง | cohort ล่าสุดยังไม่ครบเวลา | แบ่งเยอะเกิน = เจอ "ผล" จากดวง |
| ใช้เมื่อ | flow ที่มีเป้าหมายชัด (signup, checkout) | วัดคุณค่าระยะยาว | หาสาเหตุหลังเห็นตัวเลขรวมขยับ |

### 7.3 วิธีหา causation

| วิธี | ความน่าเชื่อ | ต้นทุน | ใช้เมื่อ |
|---|---|---|---|
| Before / After | ต่ำ — ปนกับ seasonality, campaign, ข่าว | ต่ำสุด | ทดลองไม่ได้ / change เล็ก / ต้องรีบ |
| Correlation ใน observational data | ต่ำ — confounder เต็มไปหมด | ต่ำ | หา hypothesis |
| Quasi-experiment (diff-in-diff, holdout ตามเมือง) | กลาง | กลาง | สุ่มระดับ user ไม่ได้ |
| A/B test (randomized) | สูง | สูง — ต้องมี traffic, infra, เวลา | การตัดสินใจสำคัญ / แก้ย้อนยาก |

**ประโยคที่ใช้ตอบ:** "ไม่ใช่ทุกการเปลี่ยนแปลงต้อง A/B test — ถ้าเป็น bug fix หรือ change ที่ rollback ง่ายและเสี่ยงต่ำ before/after + monitoring ก็พอ แต่ถ้าการตัดสินใจแพงและย้อนยาก ต้องใช้หลักฐานที่แข็งแรงกว่า"

### 7.4 Bias ที่มักสับสน

| Bias | อาการ | ตัวอย่าง |
|---|---|---|
| **Selection bias** | กลุ่มที่ดูไม่ใช่ตัวแทนของทั้งหมด | ส่ง survey ให้ user ที่ active → "ลูกค้าพอใจ 90%" |
| **Survivorship bias** | ดูแต่คนที่รอด | "ลูกค้าที่อยู่มา 2 ปีชอบ feature X" — คนที่เกลียด X ออกไปแล้ว |
| **Confounding** | ตัวแปรที่สามทำให้ทั้งคู่ขยับ | power user ใช้ feature X และ retain สูง |
| **Simpson's paradox** | ทุกกลุ่มย่อยไปทางหนึ่ง ค่ารวมไปอีกทาง | สัดส่วน mobile/desktop เปลี่ยน |
| **Novelty effect** | ผลช่วงแรกไม่ใช่ผลระยะยาว | คลิก UI ใหม่เพราะมันใหม่ |

### 7.5 Dashboard ที่ดี vs Dashboard ที่ไม่มีใครเปิด

| Dashboard ที่ถูกทิ้ง | Dashboard ที่ drive action |
|---|---|
| 40 กราฟ ทุกอย่างที่ query ได้ | 5–8 ตัวเลข ผูกกับเป้าหมายของทีม |
| ตัวเลขลอย ๆ ไม่มี context | มี target, ช่วงปกติ, เทียบช่วงก่อน |
| ไม่รู้ว่าใครเป็นเจ้าของ | มี owner และนิยาม metric ลิงก์ได้ |
| เห็นตัวเลขตกแล้วไม่รู้ต้องทำอะไร | ทุกตัวมีคำตอบว่า "ถ้าตัวนี้ตก ใครต้องทำอะไร" |
| ค่ารวมตัวเดียว | drill-down ได้ตาม segment หลัก |
| ไม่มีสัญญาณว่าข้อมูลสด/ครบไหม | แสดง "ข้อมูลล่าสุดถึงเวลา..." และ data quality check |

---

## 8. Common Mistakes

| # | สิ่งที่ Junior มักเข้าใจผิด | ความจริง |
|---|---|---|
| 1 | "conversion rate ก็คือ conversion rate" | ต้องบอก numerator / denominator / unit / window / filter — ไม่งั้นทุกคนวัดคนละอย่าง |
| 2 | "ยิง event ทุกอย่างไว้ก่อน เดี๋ยวค่อยคิดว่าจะใช้อะไร" | ได้ event ขยะเป็นพันที่ไม่มีใครเชื่อ — ต้องเริ่มจากคำถามแล้วออกแบบ tracking plan |
| 3 | "ยิง `purchase` จาก client ตอนกดปุ่มก็พอ" | กดปุ่มไม่ได้แปลว่าจ่ายเงินสำเร็จ + ad blocker ทำหาย — ความจริงทางธุรกิจยิงจาก server |
| 4 | "ใช้ค่าเฉลี่ยก็พอ" | ข้อมูลเงินและเวลาเบ้เสมอ ลูกค้าเจ้าเดียวลากค่าเฉลี่ยทั้งระบบได้ — ดู median / percentile คู่กัน |
| 5 | "ตัวเลขขึ้นหลังปล่อย feature แปลว่า feature ได้ผล" | before/after ปนกับ seasonality, campaign, bug tracking — ไม่ใช่ causation |
| 6 | "คนที่ใช้ feature X retain สูง ดังนั้น X ทำให้ retain" | selection bias / confounder — คนที่ retain อยู่แล้วถึงเจอ X |
| 7 | "A/B test เห็น p < 0.05 วันที่ 3 หยุดได้เลย" | peeking problem — false positive พุ่ง ต้องรันตาม sample size ที่คำนวณไว้ |
| 8 | "ไม่ significant แปลว่าไม่มีผล" | แปลว่ายังพิสูจน์ไม่ได้ — อาจ power ไม่พอ ต้องดู CI |
| 9 | "significant แปลว่าต้อง ship" | ผลอาจเล็กจนไม่คุ้ม หรือ guardrail แย่ลง — significance ≠ importance |
| 10 | "ไม่ต้องเช็ค SRM ก็ได้ ระบบสุ่มให้แล้ว" | SRM คือสัญญาณว่า assignment หรือ tracking พัง — เจอแล้วผลทั้งหมดเชื่อไม่ได้ |
| 11 | "ดู 20 metric แล้วรายงานตัวที่ชนะ" | multiple comparisons — ดวงล้วน ๆ ก็ชนะ 1 ใน 20 ได้ |
| 12 | "cohort สัปดาห์นี้ retention ต่ำกว่ารุ่นก่อน" | อาจยังไม่ครบเวลา — ต้องเทียบที่อายุเท่ากันเท่านั้น |
| 13 | "ขึ้น 200%!" | ขึ้นจาก 1 เป็น 3 — บอก absolute number และ base เสมอ |
| 14 | "ลบ outlier ออกให้กราฟสวย" | outlier อาจเป็นลูกค้ารายใหญ่ที่สำคัญที่สุด — ตัดสินใจอย่างมีเหตุผลและเขียนไว้ |
| 15 | "ทำ dashboard ให้ครบทุกตัวเลข" | dashboard ที่ไม่ผูกกับการตัดสินใจ = ไม่มีใครเปิด — เริ่มจาก "ใครจะทำอะไรเมื่อเห็นตัวนี้" |
| 16 | "COUNT(*) หลัง JOIN ก็ได้จำนวน user" | JOIN 1:N ทำให้ row ซ้ำ — ใช้ `COUNT(DISTINCT user_id)` และเช็คว่า grain ของตารางคืออะไร (PART 34) |

---

## 9. Debugging

ในบทนี้ "debug" คือ **"ตัวเลขดูแปลก / metric ขยับ — ต้องเช็คอะไรตามลำดับ"**

### 9.1 Framework: "Metric ขยับ" ให้ไล่ตามลำดับนี้

```
1. ขยับจริงไหม?                 → เทียบกับช่วงปกติ (noise ±เท่าไร) อย่าตื่นกับทุกจุด
        ↓
2. ข้อมูลครบและสดไหม?           → pipeline delay, ข้อมูลวันล่าสุดยังไม่ครบ, backfill ค้าง
        ↓
3. Tracking พังไหม?             → event หาย/ซ้ำ, ชื่อเปลี่ยน, release ใหม่, SDK update
        ↓                         เทียบ analytics กับ source of truth (ตาราง orders ใน DB)
4. นิยามเปลี่ยนไหม?             → query เปลี่ยน, filter เปลี่ยน, timezone, ตัวหารเปลี่ยน
        ↓
5. Mix เปลี่ยนไหม?              → traffic source, device, ประเทศ, คนใหม่ vs คนเก่า (Simpson)
        ↓
6. ปัจจัยภายนอก?               → วันหยุด, ต้นเดือน/สิ้นเดือน, คู่แข่ง, ข่าว, outage
        ↓
7. Segment หาจุดที่ขยับ        → แตก device / version / ประเทศ / funnel step
        ↓
8. ตั้ง hypothesis ของสาเหตุจริง → แล้วหาหลักฐานยืนยัน (log, session replay, A/B)
```

> **ให้มองภาพนี้ว่า** "ไล่จาก 'เครื่องมือวัด' ไปหา 'สิ่งที่ถูกวัด' — ส่วนใหญ่ตัวเลขที่ขยับแรง ๆ แบบกะทันหันคือเครื่องวัดพัง ไม่ใช่พฤติกรรมคนเปลี่ยน เพราะพฤติกรรมคนหลักแสนเปลี่ยนพร้อมกันในวันเดียวยากมาก"

### 9.2 ตารางอาการ → สาเหตุที่น่าสงสัยที่สุด

| อาการ | สงสัยอะไรก่อน | เช็คยังไง |
|---|---|---|
| metric ตก/ขึ้นแรงในวันเดียว | **tracking / release / pipeline** | ดู release log, เทียบ event count กับ DB |
| ตัวเลขวันล่าสุดต่ำผิดปกติทุกวัน | **ข้อมูลยังมาไม่ครบ (late data)** | ดูเวลา ingestion ล่าสุด, ไม่รายงานวันที่ยังไม่ปิด |
| conversion เกิน 100% | **ตัวตั้งกับตัวหารนับคนละหน่วย** / event ตัวหารหาย | เช็ค unit (user vs session) และ event ตัวหาร |
| ยอด user ใน dashboard ไม่ตรงกับ DB | **anonymous_id ไม่ถูกผูก / bot / test account** | นับ distinct user_id แยก anonymous, กรอง internal |
| ตัวเลขสองทีมไม่ตรงกัน | **นิยามต่าง** (window, timezone, filter) | เอา SQL ของทั้งสองมาเทียบบรรทัดต่อบรรทัด |
| ค่าเฉลี่ยกระโดดแต่ median นิ่ง | **outlier** | ดู top 10 ค่าสูงสุด |
| ทุก segment ดีขึ้น แต่รวมแย่ลง | **Simpson's paradox / mix shift** | ดูสัดส่วนของแต่ละ segment |
| ผลรวมหลัง JOIN สูงเกินจริง | **fan-out จาก JOIN 1:N** | เช็ค grain แล้ว aggregate ก่อน JOIN (อย่าใช้ DISTINCT ปิดอาการ — PART 31) |
| กลางคืนตัวเลขแปลก / วันแรกของเดือนแปลก | **timezone** (UTC vs Asia/Bangkok) | ดูว่า `DATE(ts)` ตัดวันตาม timezone ไหน |
| A/B test กลุ่มไม่เท่ากัน | **SRM** | chi-square test, ดูว่าหายที่ platform/browser ไหน |
| A/B ชนะช่วงแรกแล้วค่อย ๆ หาย | **novelty effect / peeking** | plot ผลแยกรายวัน/สัปดาห์ |

### 9.3 Checklist ตรวจ query ก่อนส่งตัวเลขให้ใคร

| เช็ค | ทำไม |
|---|---|
| Grain ของแต่ละตารางคืออะไร (1 row = อะไร) | กัน JOIN ซ้ำ (ดู PART 34) |
| ใช้ `COUNT(DISTINCT ...)` ถูกหน่วยไหม | user vs event vs session |
| Timezone ตรงกับที่ธุรกิจใช้ไหม | วันของไทยเริ่ม 17:00 UTC ของวันก่อน |
| กรอง test / internal / bot แล้วหรือยัง | internal user อาจเป็น 5% ของ traffic ช่วงแรก |
| ช่วงเวลาปิดครบแล้วหรือยัง | วันนี้ยังไม่จบ = ตัวเลขต่ำเสมอ |
| NULL ถูกจัดการยังไง | `AVG` ข้าม NULL, `COUNT(col)` ไม่นับ NULL |
| ตัวเลขรวม reconcile กับ source of truth ได้ไหม | revenue ใน analytics vs ระบบบัญชี |
| Sanity check: ตัวเลขอยู่ในช่วงที่สมเหตุสมผลไหม | conversion 90% ในหน้า landing = น่าจะผิด |

---

## 10. Interview Questions

### 🟢 Junior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| Metric ที่ดีต้องมีอะไรบ้าง | numerator / denominator / unit / time window / filter + ผูกกับการตัดสินใจ |
| Funnel คืออะไร | ขั้นตอนสู่เป้าหมาย + step conversion + drop-off + ยกตัวอย่าง checkout |
| Retention คืออะไร วัดยังไง | คนกลับมาใช้ไหม + cohort + Day N + ต้องนิยามว่า "active" คืออะไร |
| Average กับ median ต่างกันยังไง ใช้ตอนไหน | median ทนต่อ outlier + ข้อมูลเงิน/เวลาเบ้ |
| Vanity metric คืออะไร | ดูดีแต่ไม่เปลี่ยนการตัดสินใจ + ยกตัวอย่าง total signups สะสม |
| ถ้าต้องเพิ่ม tracking ให้ปุ่มสั่งซื้อ จะออกแบบ event ยังไง | ชื่อ object_action + properties + user_id + ยิงจาก server เมื่อจ่ายสำเร็จ |
| Correlation กับ causation ต่างกันยังไง | ยกตัวอย่าง confounder + บอกว่าพิสูจน์ causation ด้วยการสุ่ม |

### 🟡 Mid

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| North Star / Input / Guardrail ต่างกันยังไง | ลำดับชั้น + ทำไมต้องมี guardrail (Goodhart's Law) + ตัวอย่างจริง |
| Conversion ตก 5 จุดเมื่อวาน จะทำยังไง | ไล่ตามลำดับ: จริงไหม → ข้อมูลครบไหม → tracking → นิยาม → mix → segment (**ไม่กระโดดไปหาสาเหตุทางธุรกิจทันที**) |
| N-day กับ rolling retention ต่างกันยังไง | วันที่ N พอดี vs วันที่ N หรือหลังจากนั้น + rolling ≥ N-day เสมอ |
| ออกแบบ A/B test ให้หน้า checkout ใหม่ | hypothesis, randomization unit, primary metric, guardrails, sample size, duration, SRM check |
| Peeking problem คืออะไร | ดูผลซ้ำแล้วหยุดเมื่อชนะ → false positive พุ่ง + แก้ด้วย fixed horizon หรือ sequential test |
| p-value 0.03 แปลว่าอะไร | อธิบายถูก ไม่พูดว่า "97% ที่ B ดีกว่า" + ต้องดูขนาดผล/CI |
| Simpson's paradox คืออะไร เคยเจอไหม | ทุกกลุ่มดีขึ้นแต่รวมแย่ลงเพราะ mix เปลี่ยน + ตัวอย่าง mobile/desktop |
| เขียน SQL หา funnel conversion | ordered + window + distinct user + ครั้งแรก (MIN) — อธิบายว่าแต่ละเงื่อนไขคือนิยาม |

### 🔴 Senior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| Traffic น้อย A/B test ไม่ได้ จะตัดสินใจยังไง | MDE ใหญ่ขึ้น / metric ที่ใกล้ change / quasi-experiment / holdout / ยอมรับหลักฐานที่อ่อนกว่า + บอกความเสี่ยงให้ชัด |
| A/B test เจอ SRM ทำยังไง | หยุดอ่านผล + หาสาเหตุ (assignment, crash, redirect, bot filter) + ทำไมผลเชื่อไม่ได้ (หายไม่สุ่ม) |
| Marketplace test ส่วนลด ทำไม A/B ปกติอาจผิด | interference ระหว่างกลุ่ม + สุ่มระดับเมือง/ช่วงเวลา + trade-off sample size |
| เลือก North Star ให้ product B2B SaaS | สะท้อนคุณค่าที่ลูกค้าได้ (ไม่ใช่ revenue ตรง ๆ) + ขยับได้จาก input + มี guardrail + trade-off ของแต่ละตัวเลือก |
| สองทีมรายงาน DAU ไม่ตรงกัน แก้ในระดับองค์กรยังไง | metric layer / semantic layer กลาง + นิยามเดียว + owner + tracking plan + data contract (PART 34) |
| Attribution model ไหนดีที่สุด | ไม่มี — ทุก model คือกติกาแบ่งเครดิต + incrementality/holdout เพื่อหา causation |
| สื่อสารผลที่ไม่แน่นอนกับผู้บริหารยังไง | คำตอบก่อน + ขนาดผล + ช่วงความไม่แน่นอน + ต้นทุนของการผิดทั้งสองทาง + ข้อเสนอว่าจะลดความไม่แน่นอนยังไง |

---

## 11. Answer Like a Developer

### โครงมาตรฐาน 4 จังหวะ สำหรับคำถาม data

```
1. ทำให้คำถามชัด           "ก่อนอื่นขอนิยามก่อนว่า X วัดยังไง และเรากำลังจะตัดสินใจอะไร"
        ↓
2. ตรวจเครื่องวัด           "ผมจะเช็คก่อนว่าตัวเลขเปลี่ยนจริง ไม่ใช่ tracking หรือนิยามเปลี่ยน"
        ↓
3. วิเคราะห์ + หา causation  "แล้ว segment ดูว่าขยับที่ไหน ถ้าต้องพิสูจน์ว่าเป็นเพราะ feature จะใช้ A/B test"
        ↓
4. ตัดสินใจ + ความไม่แน่นอน "ข้อสรุปคือ... ความมั่นใจระดับ... สิ่งที่ยังไม่รู้คือ... จะทำต่อคือ..."
```

> **ให้มองภาพนี้ว่า** "คนที่ตอบคำถาม data ได้ดี ไม่ใช่คนที่รู้สถิติเยอะที่สุด แต่คือคนที่ถามว่า 'ตัวเลขนี้นับยังไง' ก่อน และพูดว่า 'เรามั่นใจแค่ไหน' ตอนจบ"

### ตัวอย่างการตอบ: "Conversion ตกเมื่อวาน จะทำยังไง"

**❌ คำตอบระดับท่องจำ:** "ผมจะดูว่า user ไม่ชอบอะไรใน UI ใหม่แล้วแก้ครับ"

**✅ คำตอบระดับที่อยากได้:**
> "อย่างแรกผมจะเช็คว่ามันตกจริงไหมครับ — ดูว่าอยู่นอกช่วงผันผวนปกติหรือเปล่า และข้อมูลเมื่อวานเข้ามาครบหรือยัง
> จากนั้นเช็คเครื่องวัด เทียบจำนวน order ใน analytics กับตาราง orders ใน database ถ้าไม่ตรงกันแปลว่า tracking มีปัญหา ไม่ใช่ลูกค้า แล้วดูว่ามี release หรือเปลี่ยน query ในช่วงนั้นไหม
> ถ้าตัวเลขจริง ผมจะดูว่า traffic mix เปลี่ยนไหม เพราะถ้ามี campaign ดึงคน mobile เข้ามาเยอะ ค่ารวมตกได้ทั้งที่แต่ละกลุ่มไม่ได้แย่ลง
> แล้ว segment ตาม device, version, funnel step จนเจอจุดที่ขยับจริง แล้วค่อยหาหลักฐานจาก error log หรือ session replay
> สุดท้ายสรุปเป็นข้อเสนอพร้อมบอกว่ามั่นใจแค่ไหน เช่น 'hotfix ได้เลยเพราะเจอ bug ชัด' หรือ 'ยังไม่ชัด เสนอรัน A/B test 2 สัปดาห์'"

### ตัวอย่างการตอบ: "p-value คืออะไร" (แบบให้ HR ก็เข้าใจ)

> "สมมติเราทดสอบปุ่มสีใหม่แล้วเห็นว่ากลุ่มปุ่มใหม่ซื้อมากกว่า 2% คำถามคือมันดีจริง หรือแค่บังเอิญสุ่มได้คนที่ชอบซื้อมาอยู่กลุ่มนั้นมากกว่า
> p-value บอกว่า ถ้าปุ่มใหม่ไม่ได้ต่างอะไรเลย โอกาสที่เราจะเห็นผลต่างขนาดนี้เพราะความบังเอิญคือเท่าไร — ถ้าต่ำ เช่น 1–3% ก็แปลว่าไม่น่าใช่ความบังเอิญ
> แต่ผมจะดูคู่กับขนาดผลเสมอครับ เพราะผลที่ไม่ใช่ความบังเอิญแต่เล็กมากจนไม่คุ้มค่า maintain ก็ไม่ควร ship"

### คำพูดที่ทำให้ดูมีประสบการณ์

| สถานการณ์ | พูดแบบนี้ |
|---|---|
| ถูกถามตัวเลขลอย ๆ | "ขอถามนิยามก่อนนะครับ ตัวหารคืออะไร และนับช่วงไหน" |
| เห็นตัวเลขขยับแรง | "ก่อนหาสาเหตุ ขอเช็คก่อนว่า tracking กับ pipeline ปกติ" |
| มีคนอ้าง correlation | "น่าสนใจครับ แต่อาจมี confounder เช่น... ถ้าจะพิสูจน์ ต้องทดลองแบบสุ่ม" |
| ผล A/B ไม่ชัด | "ยังพิสูจน์ไม่ได้ว่าต่าง ด้วย sample ตอนนี้เราจะเห็นผลได้ก็ต่อเมื่อขยับเกิน X%" |
| ถูกขอทำ dashboard | "ใครจะดู และเห็นตัวไหนตกแล้วจะทำอะไรครับ ผมจะเริ่มจากตรงนั้น" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้องสัมภาษณ์:

- **Analysis = loop** Question → Hypothesis → Data → Answer → Decision — ถ้าผลไม่เปลี่ยนการตัดสินใจ ไม่ต้องวิเคราะห์
- **Metric ต้องนิยามครบ:** numerator / denominator / unit / window / filter / timezone
- **North Star** = ทิศของบริษัท / **Input** = คันโยกของทีม / **Guardrail** = ห้ามแย่ลง (Goodhart's Law)
- **Vanity** ดูดีแต่ไม่ช่วยตัดสินใจ / **Leading** รู้เร็ว noise สูง / **Lagging** เชื่อได้แต่รู้ช้า
- **Event** = ใคร ทำอะไร เมื่อไร + properties / ความจริงทางธุรกิจยิงจาก **server** / มี **tracking plan** เป็น contract
- **Funnel** = step conversion + drop-off + time-to-convert — ordered/window/unit คือนิยามที่ต้องเขียนไว้
- **Cohort** เทียบคนที่อายุเท่ากัน / **N-day** vs **rolling** retention / curve ที่ **แบนลง** = มีคุณค่าจริง
- **Median/percentile** สำหรับข้อมูลเบ้ / outlier ห้ามลบเงียบ ๆ
- **Correlation ≠ Causation** / ระวัง **confounder, Simpson's paradox, selection & survivorship bias**
- **A/B test** = สุ่มเพื่อพิสูจน์ causation: hypothesis, unit, primary metric, guardrails, sample size ก่อนเริ่ม
- **p-value** = โอกาสเห็นผลขนาดนี้ถ้าไม่มีผลจริง ≠ โอกาสที่ B ดีกว่า / ดู **CI** และขนาดผลเสมอ
- กับดัก: **peeking, novelty effect, SRM, multiple comparisons, interference**
- **Attribution** = กติกาแบ่งเครดิต ไม่ใช่ causation — ใช้ holdout ถ้าจะรู้ผลจริง
- Metric ขยับ: **จริงไหม → ข้อมูลครบไหม → tracking → นิยาม → mix → ภายนอก → segment → hypothesis**
- **Decision memo:** คำตอบก่อน → หลักฐาน → ความไม่แน่นอน → สิ่งที่จะทำ + owner + วันที่

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **ตัวเลขที่ไม่มีนิยามชัด = ความเห็นที่แต่งตัวเป็นข้อเท็จจริง** — ตัวตั้ง / ตัวหาร / หน่วย / ช่วงเวลา
2. **ตรวจเครื่องชั่งก่อนตัดสินว่าน้ำหนักขึ้น** — metric ขยับแรงส่วนใหญ่คือ tracking / pipeline / นิยามเปลี่ยน
3. **Correlation บอกว่าควรสงสัยอะไร การสุ่มบอกว่าอะไรเป็นเหตุ** — ระวัง confounder และ Simpson's paradox
4. **A/B test ตัดสินใจทุกอย่างก่อนกด start** — sample size, primary metric, guardrails, ห้าม peek, เช็ค SRM
5. **Significant ≠ สำคัญ, ไม่ significant ≠ ไม่มีผล** — สื่อสารด้วยขนาดผล + ช่วงความไม่แน่นอน + การตัดสินใจ

### Keyword ย่อ

```
Metric        → function ที่ต้องมี signature ครบ
North Star    → ดาวเหนือของทั้งบริษัท
Input         → คันโยกที่ทีมขยับได้
Guardrail     → ราวกันตก ห้ามแย่ลง
Vanity        → ดูดีบนสไลด์ ตัดสินใจไม่ได้
Leading       → การบ้านรายสัปดาห์ (เร็ว / noise)
Lagging       → สอบปลายภาค (ช้า / เชื่อได้)
Event         → ใคร ทำอะไร เมื่อไร + properties
Tracking Plan → API contract ของ analytics
Funnel        → กรวย หาว่ารั่วขั้นไหน
Drop-off      → 1 − step conversion
Cohort        → รุ่น เทียบที่อายุเท่ากัน
Retention     → ถังรั่ว แบนลง = ดี
Median        → คนตรงกลาง ทน outlier
Confounder    → คนเชิดหุ่นหลังฉาก
Simpson       → ทุกกลุ่มดีขึ้น รวมแย่ลง (mix เปลี่ยน)
Survivorship  → ดูแต่คนที่รอด
A/B Test      → สุ่มเพื่อพิสูจน์เหตุ
Power         → ขนาดแว่นขยาย
p-value       → โอกาสเห็นผลนี้ถ้าไม่มีผลจริง
CI            → ช่วงที่ผลจริงน่าจะอยู่
Peeking       → โยนเหรียญจนกว่าจะชนะ
Novelty       → ของใหม่ถูกคลิกเพราะใหม่
SRM           → ตาชั่งเอียง ห้ามอ่านผล
Attribution   → กติกาแบ่งเครดิต ≠ causation
Decision Memo → คำตอบก่อน หลักฐานทีหลัง
```

---

[← สารบัญ](./00-README-TOC.md)
