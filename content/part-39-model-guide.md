# PART 39 — MODEL GUIDE

> ตำแหน่งในภาพใหญ่: Applied AI — ชั้น "เลือกสมอง" ของระบบ AI ต่อจาก PART 35–38 คือเรารู้แล้วว่าจะเอา LLM ไปทำอะไร (prompt, RAG, tool, agent, eval) บทนี้ตอบว่า **จะใช้โมเดลตัวไหน จ่ายเท่าไร และจะเปลี่ยนตัวยังไงโดยระบบไม่พัง** — OpenAI · Claude · Gemini · Open-weight

---

## 1. Big Picture

ลองนึกภาพทีมที่ทำ chatbot ตอบลูกค้าภาษาไทย วันแรกทุกคนถามคำถามเดียวกัน

> "ใช้โมเดลไหนดีที่สุด?"

คำถามนี้ **ผิดตั้งแต่ตั้งโจทย์** เพราะไม่มีโมเดลไหน "ดีที่สุด" แบบไม่มี context — เหมือนถามว่า "รถคันไหนดีที่สุด" โดยไม่บอกว่าจะขนของ แข่ง หรือขับในเมือง

คำถามที่ถูกคือ:

> "สำหรับ **งานนี้** บน **ข้อมูลของเรา** ภายใต้ **งบ latency และ privacy ที่เรามี** โมเดลไหนผ่านเกณฑ์ด้วยต้นทุนต่ำที่สุด?"

นี่คือเหตุผลที่บทนี้สำคัญในงานจริง:

1. **ค่าใช้จ่ายของ LLM โตตาม traffic ตรง ๆ** — เลือกโมเดลใหญ่เกินจำเป็นกับงานที่ยิงวันละล้านครั้ง = บิลต่างกันเป็นสิบเท่า
2. **โมเดลเปลี่ยนเร็วกว่า library ทุกตัวที่คุณเคยใช้** — รุ่นใหม่ออกทุกไม่กี่เดือน รุ่นเก่าถูก deprecate มีวันปิดจริง ถ้าโค้ดผูกกับรุ่นเดียว วันหนึ่งคุณ **ถูกบังคับ migrate**
3. **โมเดลคนละตัว พฤติกรรมคนละแบบ** — prompt เดิม ใส่โมเดลใหม่ ผลลัพธ์อาจดีขึ้นในภาพรวมแต่พังในเคสที่คุณสนใจ

**Model Selection → การเลือกโมเดล → กระบวนการวัดว่าโมเดลไหน "พอดี" กับงาน ด้วยข้อมูลจริง แล้วออกแบบระบบให้เปลี่ยนโมเดลได้โดยไม่เจ็บ**

นิยามนี้มี 3 ส่วน = 3 หัวข้อใหญ่ของบท:

| ส่วนของนิยาม | เรื่องที่ต้องเรียน |
|---|---|
| รู้ว่ามีตัวเลือกอะไร | Tier (frontier / balanced / fast / open-weight), vendor, cloud marketplace, reasoning mode |
| วัดด้วยข้อมูลจริง | มิติที่ต้องดู, eval set, blind comparison, cost & latency, bake-off |
| เปลี่ยนได้โดยไม่เจ็บ | provider abstraction, gateway, migration checklist, deprecation, fallback |

> ⚠️ **หมายเหตุสำคัญ:** ชื่อรุ่น ราคา context window และ rate limit **เปลี่ยนเร็วมาก** — ข้อมูลรุ่นในบทนี้เป็น snapshot ณ ก.ย. 2026 เท่านั้น ก่อนตัดสินใจจริง **ต้องเช็ค docs, pricing page และ deprecation page ทางการของแต่ละ vendor เสมอ** คุณค่าของบทนี้อยู่ที่ **วิธีเลือก** ซึ่งใช้ได้อีกหลายปี ไม่ใช่ที่ชื่อรุ่น

---

## 2. Keywords

### 2.1 ชนิดของโมเดลและผู้ให้บริการ

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| LLM | โมเดลภาษาขนาดใหญ่ | สมองที่เดาคำถัดไปเก่งมาก |
| Model Tier | ระดับของโมเดลในตระกูลเดียวกัน | ใหญ่-กลาง-เล็ก ของค่ายเดียวกัน |
| Frontier Model | รุ่นท็อปของค่าย | ฉลาดสุด แพงสุด ช้าสุด |
| Balanced Model | รุ่นกลาง | ตัวทำงานหลักของ production ส่วนใหญ่ |
| Small / Fast Model | รุ่นเล็ก | ถูก เร็ว เหมาะงานง่ายปริมาณมาก |
| Reasoning Model | โมเดลที่ "คิดก่อนตอบ" | ใช้ token คิดเพิ่มเพื่อตอบงานยาก |
| Thinking / Reasoning Mode | โหมดคิดนานที่เปิด-ปิดได้ | ฉลาดขึ้นแลกกับช้าลงและแพงขึ้น |
| Reasoning Effort / Budget | ปุ่มกำหนดว่าให้คิดมากแค่ไหน | หมุนได้ตามความยากของงาน |
| Open-weight Model | โมเดลที่ปล่อยไฟล์ weight ให้โหลด | เอาไปรันเองได้ (เช่น ตระกูล Llama, Mistral, Qwen) |
| Self-hosting | รันโมเดลบนเครื่อง/GPU ของเราเอง | คุมเองทั้งหมด ดูแลเองทั้งหมด |
| Cloud Marketplace | ซื้อโมเดลหลายค่ายผ่าน cloud ที่ใช้อยู่ | Azure, AWS Bedrock, Google Vertex |
| Model ID | ชื่อรุ่นที่ใส่ใน API จริง | สตริงที่ต้อง pin ให้ชัด |
| Model Alias | ชื่อเล่นที่ชี้ไปรุ่นล่าสุด | สะดวก แต่ชี้ไปรุ่นใหม่เมื่อไรก็ได้ |
| Snapshot / Pinned Version | รุ่นที่ล็อกวันที่ไว้ | พฤติกรรมไม่เปลี่ยนใต้เท้าเรา |
| Deprecation | ประกาศเลิกใช้รุ่นนั้น | มีวันปิดจริง ต้องวางแผนย้าย |

### 2.2 มิติที่ใช้ตัดสินใจ

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Token | หน่วยนับข้อความของโมเดล | เงินและเวลาคิดเป็น token |
| Input Token / Output Token | token ขาเข้า / ขาออก | ราคามักไม่เท่ากัน ขาออกมักแพงกว่า |
| Context Window | ปริมาณข้อความสูงสุดที่ใส่ได้ต่อครั้ง | โต๊ะทำงาน — ใหญ่ไม่ได้แปลว่าอ่านละเอียด |
| Latency | เวลารอคำตอบ | ผู้ใช้รู้สึกได้ทันที |
| TTFT (Time to First Token) | เวลาจนเห็นคำแรก | สำคัญกับ chat ที่ stream |
| Multimodality | รับ/ส่งได้หลายชนิด (ภาพ เสียง ไฟล์) | ไม่ใช่ทุกรุ่นทำได้เท่ากัน |
| Tool Use / Function Calling | โมเดลเรียกฟังก์ชันของเราได้ | หัวใจของ agent |
| Structured Output | บังคับคำตอบเป็น JSON ตาม schema | เรื่อง reliability ไม่ใช่ความฉลาด |
| Instruction Following | ทำตามคำสั่งได้ตรงแค่ไหน | ตัวชี้ว่า prompt ย้ายค่ายได้ง่ายไหม |
| Tokenizer Efficiency | ภาษาหนึ่งกิน token มากน้อยแค่ไหน | ภาษาไทยมักกิน token มากกว่าอังกฤษ — วัดเอง |
| Rate Limit | เพดานคำขอ/token ต่อนาที | ต้องมีตัวเลขก่อนวันเปิดตัว ไม่ใช่หลัง |
| Data Retention / Privacy Terms | vendor เก็บข้อมูลเรานานแค่ไหน เอาไปเทรนไหม | อ่านสัญญา ไม่ใช่อ่านข่าว |
| Data Residency / Region | ข้อมูลถูกประมวลผลที่ประเทศไหน | บางอุตสาหกรรมเป็นข้อบังคับ |
| Safety / Refusal Behavior | ปฏิเสธคำขอแบบไหน บ่อยแค่ไหน | ปฏิเสธเกิน = งานเดิน ไม่ได้ |
| Prompt Caching | cache ส่วนต้นของ prompt ที่ซ้ำ | ลดต้นทุนและ latency ของ prompt ยาว |
| Batch API | ส่งงานไม่ด่วนเป็นก้อน | ถูกลงแลกกับรอนาน |

### 2.3 กระบวนการเลือกและดูแล

| Keyword | ภาษาคน | จำสั้น ๆ |
|---|---|---|
| Eval Set | ชุดโจทย์จริงพร้อมเกณฑ์ตัดสิน | ข้อสอบของเราเอง |
| Bake-off | เอาโมเดลหลายตัวมาแข่งบนงานเรา | ประกวดบนสนามเรา ไม่ใช่สนามเขา |
| Blind Comparison | ให้คะแนนโดยไม่รู้ว่าคำตอบมาจากรุ่นไหน | กันอคติยี่ห้อ |
| LLM-as-Judge | ใช้โมเดลอีกตัวช่วยให้คะแนน | ถูกและเร็ว แต่ต้อง calibrate กับคน |
| Leaderboard / Benchmark | ตารางคะแนนสาธารณะ | ใช้ตัดตัวเลือก ไม่ใช่ใช้ตัดสิน |
| Cost per Task | ต้นทุนต่องานที่สำเร็จ 1 ชิ้น | ตัวเลขที่ธุรกิจเข้าใจ |
| Provider Abstraction | ชั้นกลางที่ทำให้เปลี่ยนค่ายได้ | Adapter pattern ของ LLM |
| LLM Gateway | proxy กลางคุมทุก call | routing, key, log, budget ที่เดียว |
| Model Routing / Cascade | ส่งงานง่ายไปรุ่นเล็ก งานยากไปรุ่นใหญ่ | จ่ายแพงเฉพาะตอนจำเป็น |
| Fallback | สำรองไปรุ่น/ค่ายอื่นเมื่อพัง | กัน outage และ rate limit |
| Vendor Lock-in | ติดค่ายจนย้ายไม่ได้ | เกิดจาก feature เฉพาะค่าย ไม่ใช่แค่ SDK |
| Migration | ย้ายรุ่นหรือย้ายค่าย | ต้อง re-eval ทุกครั้ง |
| Shadow Traffic | ส่งงานจริงไปรุ่นใหม่คู่ขนานโดยไม่ตอบผู้ใช้ | ทดสอบบนของจริงแบบไม่เสี่ยง |

---

## 3. Mental Model

### Mental Model หลัก: โมเดลคือ "พนักงานที่เราจ้างผ่านเอเจนซี" ไม่ใช่ library

อย่ามองโมเดลเป็น dependency แบบ `lodash` ที่ติดตั้งแล้วจบ — มันมีนิสัย 3 อย่างที่ library ไม่มี:

- **ไม่ deterministic** — ถามเหมือนเดิม อาจตอบไม่เหมือนเดิม
- **เปลี่ยนตัวเองได้** — alias ชี้ไปรุ่นใหม่ vendor ปรับรุ่นเดิม หรือประกาศปิดรุ่น
- **ต้นทุนผันแปรตามการใช้** — ไม่ใช่จ่ายครั้งเดียว แต่จ่ายทุก token

ให้มองว่าคุณกำลัง **จ้างพนักงานผ่านเอเจนซี**:

- เอเจนซี = vendor (OpenAI, Anthropic, Google, หรือตัวคุณเองถ้า self-host)
- พนักงานอาวุโส/กลาง/จูเนียร์ = model tier
- ค่าจ้างคิดเป็นชั่วโมง = คิดเป็น token
- สัญญาจ้างมีวันหมด = deprecation
- สัมภาษณ์ด้วยงานจริง = eval set / bake-off

> **ให้มองภาพนี้ว่า** "ไม่มีบริษัทไหนจ้างหัวหน้าวิศวกรมานั่งคัดแยกอีเมล — เลือกคนให้ตรงงาน สัมภาษณ์ด้วยงานจริง แล้วเขียนสัญญาให้เปลี่ยนคนได้เมื่อจำเป็น"

### Mental Model ที่ 2: ถาม 4 คำถามตามลำดับ

```
1) งานนี้ "ยาก" แค่ไหน?                 → ตัด tier ที่ไม่จำเป็นทิ้ง
         ↓
2) มี "ข้อบังคับแข็ง" อะไรบ้าง?          → privacy / region / latency / multimodal
         ↓                                (ตัดตัวที่ไม่ผ่านทิ้งทันที ไม่ต้องวัด)
3) บนข้อมูลเรา ตัวไหน "ผ่านเกณฑ์"?      → eval set + blind comparison
         ↓
4) ในตัวที่ผ่าน ตัวไหน "ถูกและเร็ว" สุด? → cost per task + p95 latency
```

> **ให้มองภาพนี้ว่า** "เลือกโมเดลคือการกรองเป็นชั้น — ข้อบังคับแข็งกรองก่อน คุณภาพบนงานจริงกรองต่อ แล้วต้นทุนเป็นตัวตัดสินสุดท้าย ไม่ใช่เอาตัวที่คะแนน leaderboard สูงสุดแล้วจบ"

### Mental Model ที่ 3: "Good enough + cheapest" ชนะ "best" เกือบทุกครั้งใน production

Junior ถามว่า "ตัวไหนฉลาดที่สุด"
Senior ถามว่า "**ตัวที่ถูกที่สุดที่ยังผ่านเกณฑ์** คือตัวไหน และถ้ามันพังเราจะ fallback ไปไหน"

ทำไม? เพราะคุณภาพเหนือเกณฑ์ที่ผู้ใช้รับรู้ได้ **ไม่มีใครจ่ายเงินให้** แต่ต้นทุนและ latency ที่เพิ่มขึ้น **ทุกคนรู้สึก**

### Mental Model ที่ 4: เลือกโมเดลไม่ใช่การตัดสินใจครั้งเดียว

```
เลือก → ใช้งาน → วัดต่อเนื่อง → รุ่นใหม่ออก / รุ่นเก่าจะปิด → re-eval → ย้าย → วนใหม่
```

ถ้าออกแบบระบบเหมือนจะใช้โมเดลนี้ตลอดไป — คุณกำลังสร้างหนี้ทางเทคนิคที่มีวันครบกำหนดชำระแน่นอน

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำ:
LLM               = พนักงานที่จ้างผ่านเอเจนซี
Vendor            = เอเจนซีจัดหาคน
Frontier model    = ที่ปรึกษาอาวุโส (เก่งสุด แพงสุด นัดยากสุด)
Balanced model    = พนักงานประจำมือดี (งานส่วนใหญ่ของบริษัท)
Small/Fast model  = พนักงานพาร์ทไทม์คล่องมือ (งานซ้ำ ๆ ปริมาณมาก)
Open-weight       = ซื้อตัวมาทำงานในบริษัทเอง (ต้องหาโต๊ะ หาเงินเดือน ดูแลเอง)
Reasoning mode    = บอกให้ "คิดก่อนพูด" — รอบคอบขึ้น แต่คิดนาน คิดเงินตามเวลาคิด
Context window    = ขนาดโต๊ะทำงาน (โต๊ะใหญ่ไม่ได้แปลว่าอ่านทุกแผ่น)
Token             = นาทีที่คิดค่าจ้าง
Eval set          = ข้อสอบจากงานจริงของบริษัท
Leaderboard       = เกรดจากมหาวิทยาลัย (ใช้คัดใบสมัคร ไม่ใช่ตัดสินรับเข้า)
Gateway           = ฝ่าย HR กลางที่ทุกทีมต้องผ่านเวลาจ้าง
Deprecation       = สัญญาจ้างหมดอายุ
Fallback          = พนักงานสำรองเวลาคนหลักลาป่วย
```

### ภาพจำเจาะลึก: Leaderboard = เกรดมหาวิทยาลัย (ข้อนี้ต้องจำให้แม่นที่สุด)

```
ผู้สมัคร A  เกรด 3.95  สัมภาษณ์งานจริง: ตอบลูกค้าไทยแข็งทื่อ ใช้ศัพท์ผิดบริบท
ผู้สมัคร B  เกรด 3.60  สัมภาษณ์งานจริง: ตอบตรงประเด็น สุภาพ ถูกนโยบายบริษัท
ผู้สมัคร C  เกรด 3.40  สัมภาษณ์งานจริง: ตอบดีพอ ๆ B ค่าจ้างถูกกว่าครึ่ง
```

> **ให้มองภาพนี้ว่า** "Benchmark วัดข้อสอบกลางที่ใครก็ทำได้ แต่งานของคุณคือข้อสอบเฉพาะที่ไม่มีใครเคยเห็น — เกรดใช้คัดคนเข้ารอบ แต่คนที่จะได้งานต้องผ่านสัมภาษณ์ด้วยงานจริง"

**ทำไม leaderboard ใช้ตัดสินไม่ได้** — ส่วนที่ Junior ส่วนใหญ่ตอบไม่ได้:

| ปัญหาของเกรด | ปัญหาของ benchmark จริง ๆ |
|---|---|
| ข้อสอบไม่เหมือนงานจริง | งานของคุณมี format, ภาษา, domain, นโยบายเฉพาะ |
| นักศึกษาอาจเคยเห็นข้อสอบเก่า | benchmark สาธารณะอาจรั่วเข้าไปในข้อมูลเทรน (contamination) |
| เกรดไม่บอกค่าจ้าง | คะแนนไม่บอก cost per task และ latency |
| เกรดวัดตอนสอบ ไม่ใช่ตอนทำงานหนัก | ไม่ได้วัด rate limit, ความนิ่งของ JSON, พฤติกรรมตอนโดน prompt แปลก ๆ |

**ประโยคที่ต้องพูดได้ใน interview:**
"ผมใช้ leaderboard แค่คัดตัวเลือกเข้ารอบ แล้วตัดสินด้วย eval set ที่สร้างจากงานจริงของเรา วัดทั้งคุณภาพ ต้นทุนต่องาน และ p95 latency"

---

## 5. How It Works

### 5.1 LLM call หนึ่งครั้งเดินทางอย่างไร (แบบมี gateway)

```
[APPLICATION CODE]         เรียก llm.generate(task="support_reply", input)
        ↓
[PROVIDER ABSTRACTION]     แปลง request กลาง → format ของ vendor
        ↓
[LLM GATEWAY]              auth, budget, rate limit, log, routing, cache
        ↓
   ┌────┴──────────────┬──────────────────┐
   ↓                   ↓                  ↓
[VENDOR A API]    [VENDOR B API]    [SELF-HOSTED / CLOUD MARKETPLACE]
   ↓                   ↓                  ↓
[TOKENIZE → MODEL (+ thinking ถ้าเปิด) → DETOKENIZE / STREAM]
        ↓
[GATEWAY]                  นับ token, วัด latency, เก็บ trace
        ↓
[ABSTRACTION]              แปลง response กลับเป็น format กลาง + validate schema
        ↓
[APPLICATION CODE]
```

> **ให้มองภาพนี้ว่า** "แอปไม่ควรรู้ว่ากำลังคุยกับค่ายไหน — มันขอ 'งาน' ชื่อหนึ่ง แล้วชั้นกลางเลือกโมเดลให้ นั่นคือสิ่งที่ทำให้เปลี่ยนโมเดลได้ด้วยการแก้ config ไม่ใช่แก้โค้ดทั้ง repo"

**ทุก call มีต้นทุน 3 ก้อนที่ต้องวัด:**

```
cost per call  = (input tokens × ราคา input) + (output tokens × ราคา output)
                 + (thinking tokens × ราคาที่ vendor คิด — มักคิดเหมือน output)
latency        = network + queue + TTFT + (output tokens ÷ tokens/sec)
cost per task  = cost per call × จำนวน call ต่องาน ÷ อัตราสำเร็จ
```

บรรทัดสุดท้ายสำคัญที่สุด: โมเดลถูกที่ **ต้อง retry บ่อย** หรือ **ต้องให้คนแก้บ่อย** อาจแพงกว่าโมเดลแพงที่ทำถูกในครั้งเดียว

### 5.2 Model Tier — บันไดสี่ขั้น

```
          ┌────────────────────────────┐
  แพง ↑   │ FRONTIER / LARGE REASONING │  งานยาก หลายขั้น เดิมพันสูง
  ช้า     ├────────────────────────────┤
          │ BALANCED                   │  งานทั่วไปของ production
          ├────────────────────────────┤
  ถูก     │ FAST / SMALL               │  classify, extract, route, สรุปสั้น
  เร็ว ↓  ├────────────────────────────┤
          │ OPEN-WEIGHT / SELF-HOSTED  │  ทุก tier ก็มี — คุมข้อมูลเอง ดูแลเอง
          └────────────────────────────┘
```

> **ให้มองภาพนี้ว่า** "เริ่มจากขั้นกลาง ถ้าไม่ผ่านเกณฑ์ค่อยขึ้น ถ้าผ่านสบาย ๆ ลองลง — อย่าเริ่มจากบนสุดแล้วไม่เคยลองลงเลย"

| Tier | เหมาะกับ | จุดอ่อนที่ต้องรู้ |
|---|---|---|
| Frontier / Large reasoning | coding ซับซ้อน, agent หลายขั้น, วิเคราะห์เอกสารยาว, งานที่ผิดแล้วแพง | แพง ช้า rate limit มักต่ำกว่า ใช้กับ traffic สูงแล้วบิลบาน |
| Balanced | chatbot, RAG ทั่วไป, สรุป, เขียน, tool use ปกติ | บางงานยากจริงจะเริ่มพลาดขั้นตอน |
| Fast / Small | classification ปริมาณมาก, extraction ง่าย, routing, autocomplete | reasoning หลายขั้นอ่อน, ทำตามคำสั่งซับซ้อนพลาดง่ายกว่า |
| Open-weight | ข้อมูลห้ามออกนอกองค์กร, fine-tune ลึก, ปริมาณมหาศาลคงที่ | ต้องดูแล GPU / serving / scaling / security เอง |

### 5.3 Reasoning / Thinking Mode — ฉลาดขึ้นแลกกับอะไร

```
ไม่เปิด thinking:
[PROMPT] ──→ [ANSWER]                         เร็ว ถูก

เปิด thinking:
[PROMPT] ──→ [คิด... คิด... คิด...] ──→ [ANSWER]
              ↑ token ส่วนนี้คิดเงิน และเพิ่ม latency
              (บางค่ายไม่แสดงให้เห็นเต็ม ๆ แต่ยังคิดเงิน)
```

> **ให้มองภาพนี้ว่า** "Thinking คือการจ่ายค่าจ้างให้พนักงานนั่งคิดก่อนตอบ — คุ้มมากกับโจทย์ยาก เสียเงินฟรีกับคำถามว่า 'ร้านเปิดกี่โมง'"

| ประเด็น | สาระ |
|---|---|
| ได้อะไร | ความแม่นขึ้นในงานหลายขั้น: คณิต, logic, coding, planning, วิเคราะห์เอกสารซับซ้อน |
| เสียอะไร | latency เพิ่ม (บางครั้งจากวินาทีเป็นหลายสิบวินาที), token เพิ่ม, คาดเดาต้นทุนยากขึ้น |
| ปุ่มที่มี | หลายค่ายให้ตั้ง effort/budget ได้ — ชื่อ parameter และหน่วยต่างกันแต่ละค่าย |
| ใช้เมื่อ | eval แสดงว่าเปิดแล้วคุณภาพเพิ่มจนผ่านเกณฑ์ **และ** งานรับ latency ได้ |
| ไม่ควรใช้เมื่อ | chat real-time, voice, classification ง่าย, autocomplete |
| กับดัก | เปิดทุก request "เผื่อไว้" → บิลพุ่งโดยคุณภาพแทบไม่ต่าง |

**สิ่งที่ต้องพูดได้ระดับ Mid:** "reasoning เป็น **ปุ่มต่อ request** ไม่ใช่คุณสมบัติที่เลือกครั้งเดียว — ผมเปิดเฉพาะ task ที่ eval พิสูจน์แล้วว่าคุ้ม และตั้ง effort ต่ำสุดที่ยังผ่าน"

### 5.4 Vendor Landscape — ใครมีอะไร

**ภาพรวมเชิงโครงสร้าง (ส่วนนี้เปลี่ยนช้า ใช้ได้นาน):**

| ผู้ให้บริการ | ตระกูลโมเดล | ลักษณะการแบ่ง tier | ช่องทางใช้งาน |
|---|---|---|---|
| OpenAI | GPT family (+ โมเดลเฉพาะทาง เช่น ภาพ เสียง) | รุ่นท็อป / รุ่นเน้น coding-agent / รุ่นประหยัดปริมาณมาก | API ตรง, Azure |
| Anthropic | Claude family | Fable (ความสามารถสูงสุด) / Opus (ใหญ่) / Sonnet (กลาง) / Haiku (เล็ก-เร็ว) | API ตรง, AWS Bedrock, Google Vertex AI (และช่องทางอื่นตามที่ประกาศ) |
| Google | Gemini family | Pro (ใหญ่) / Flash (กลาง-เร็ว) / Flash-Lite (ถูกสุด) + Live/เสียง/ภาพ | Gemini API, Vertex AI |
| Open-weight | Llama, Mistral, Qwen, Gemma ฯลฯ | หลายขนาดตั้งแต่เล็กมากถึงใหญ่มาก | รันเอง, หรือผ่าน cloud marketplace / inference provider |

**Snapshot ชื่อรุ่น (ณ ก.ย. 2026) — ใช้เป็นตัวอย่าง ไม่ใช่คำแนะนำ:**

| Vendor | ชื่อรุ่น (API id) | vendor วางตำแหน่งไว้ว่า (สรุปจาก docs) |
|---|---|---|
| Anthropic | Claude Fable 5.1 (`claude-fable-5-1`) | รุ่นความสามารถสูงสุดของค่าย ณ ก.ย. 2026 — เช็คราคาและรายละเอียดใน docs |
| Anthropic | Claude Opus 5.5 (`claude-opus-5-5`) | tier ใหญ่ |
| Anthropic | Claude Sonnet 5 (`claude-sonnet-5`) | tier กลาง |
| Anthropic | Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | tier เล็ก-เร็ว |
| OpenAI | GPT-6 Astra (`gpt-6-astra`) | รุ่นที่เก่งที่สุด สำหรับงานยากครบวงจร |
| OpenAI | GPT-6 Sol (`gpt-6-sol`) | งาน coding ซับซ้อนและ agentic workflow |
| OpenAI | GPT-6 Luna (`gpt-6-luna`) | รุ่นประหยัด สำหรับงานเฉพาะจุดปริมาณมาก |
| Google | Gemini 3.1 Pro (`gemini-3.1-pro-preview`) | tier Pro (สถานะ preview) |
| Google | Gemini 3.8 Flash (`gemini-3.8-flash`) | tier Flash (stable) |
| Google | Gemini 3.5 Flash-Lite (`gemini-3.5-flash-lite`) | tier Flash-Lite (stable) |

> ⚠️ ตารางนี้ **จะล้าสมัยเร็ว** — ชื่อ id, สถานะ preview/stable, ราคา และ context window ต้องเช็คจากหน้า models / pricing / deprecations ทางการของแต่ละค่ายทุกครั้งก่อนใช้ บทนี้จงใจ **ไม่ใส่ราคาและคะแนน benchmark** เพราะมันเปลี่ยนเร็วกว่ารอบการอ่านหนังสือ

**สังเกตสิ่งที่ไม่เปลี่ยน:** ทุกค่ายแบ่งเป็น "ใหญ่ / กลาง / เล็ก" เหมือนกันหมด ชื่อเปลี่ยนทุกปี แต่ **รูปทรงของการเลือก** เหมือนเดิม — นั่นคือสิ่งที่ต้องจำ

### 5.5 Cloud Marketplace — ใช้โมเดลผ่าน cloud ที่มีอยู่

```
[YOUR APP ใน AWS] ──→ [AWS Bedrock]   ──→ Claude, Llama, Mistral, ...
[YOUR APP ใน Azure] ─→ [Azure AI]      ──→ GPT family, open-weight, ...
[YOUR APP ใน GCP] ──→ [Vertex AI]     ──→ Gemini, Claude, open-weight, ...
```

> **ให้มองภาพนี้ว่า** "Marketplace คือการจ้างพนักงานเอเจนซีผ่านฝ่ายจัดซื้อเดิมของบริษัท — สัญญา บิล IAM และ network เป็นของ cloud ที่คุณใช้อยู่แล้ว"

| ข้อดี | ข้อแลก |
|---|---|
| ใช้ IAM, VPC, billing, compliance เดิมขององค์กร | feature ใหม่บางอย่างอาจมาถึงช้ากว่า API ตรงของ vendor |
| ข้อมูลอยู่ใน region / สัญญา cloud เดิม | ชื่อรุ่น, parameter, rate limit อาจต่างจาก API ตรง |
| ใช้เครดิต/commitment ที่มีกับ cloud | ต้องขอ quota แยก บางรุ่นต้องขอเปิดใช้ก่อน |
| สลับหลายค่ายในที่เดียว | SDK/format อาจเป็นของ cloud ไม่ใช่ของ vendor |

**คำถามที่ต้องถามทีม:** "ข้อจำกัดของเราคือ feature ใหม่ล่าสุด หรือคือ compliance และ procurement?" — ถ้าเป็นอย่างหลัง marketplace มักชนะ

### 5.6 Open-weight & Self-hosting — ได้อะไร เสียอะไร

```
API ของ vendor:          [APP] ──→ [VENDOR]           จ่ายตาม token, ไม่มี ops
Self-host open-weight:   [APP] ──→ [INFERENCE SERVER บน GPU ของเรา]
                                    ↑ ต้องดูแล: GPU, autoscaling, batching,
                                      quantization, monitoring, patch, security
```

> **ให้มองภาพนี้ว่า** "Self-host คือเลิกเช่ารถ แล้วซื้อรถมาเอง — ถูกกว่าถ้าขับทุกวันเยอะ ๆ แต่ต้องจ่ายค่าที่จอด ประกัน และเปลี่ยนยางเอง แม้วันที่ไม่ได้ขับ"

| ประเด็น | API (managed) | Self-host open-weight |
|---|---|---|
| ต้นทุน | ผันแปรตาม token | คงที่ตาม GPU ที่เปิดไว้ — ว่างก็จ่าย |
| คุ้มเมื่อ | traffic ไม่แน่นอน / ปริมาณน้อย-กลาง | ปริมาณสูงและนิ่ง จน GPU ถูกใช้เต็ม |
| Privacy | ขึ้นกับสัญญา vendor | ข้อมูลไม่ออกจากระบบเรา |
| คุณภาพสูงสุด | มักได้รุ่นท็อปก่อน | ขึ้นกับรุ่น open-weight ที่มีตอนนั้น |
| Ops burden | แทบศูนย์ | สูงมาก: serving, scaling, upgrade, on-call |
| Customization | จำกัดตามที่ vendor เปิด | fine-tune / quantize / แก้ได้ลึก |
| License | ตามสัญญา API | **ต้องอ่าน license ของแต่ละรุ่น** — "open-weight" ไม่ได้แปลว่าใช้เชิงพาณิชย์ได้ทุกกรณี |

**ต้นทุนที่คนลืม:** เวลาของวิศวกรที่ดูแล GPU cluster ต้องนับเป็นต้นทุนของโมเดลด้วย

### 5.7 Deprecation Lifecycle — โมเดลก็มีวันเกษียณ

```
[PREVIEW / BETA] → [STABLE / GA] → [LEGACY / ประกาศ deprecate] → [SHUTDOWN]
    ทดลองได้         ใช้ production     เริ่มนับถอยหลัง              เรียกแล้ว error
    อาจเปลี่ยน       pin version        ต้องมีแผนย้าย
```

> **ให้มองภาพนี้ว่า** "ทุกรุ่นที่คุณใช้วันนี้ มีวันปิดอยู่ในอนาคตแล้ว แค่ยังไม่ประกาศ — ระบบที่ดีจึงออกแบบให้ย้ายได้ตั้งแต่วันแรก"

**สิ่งที่ต้องทำเป็นนิสัย:**

1. **Pin model id ที่เจาะจง** ใน production — alias ที่ชี้ "รุ่นล่าสุด" ใช้ได้ตอน prototype
2. **Subscribe หน้า deprecation / changelog** ของทุกค่ายที่ใช้ ใส่วันปิดลงปฏิทินทีม
3. **อย่าใช้ preview model ใน production** ถ้าไม่ยอมรับว่ามันอาจเปลี่ยนหรือหายไป
4. **เก็บ eval set ให้พร้อมรัน** — วันประกาศ deprecate คือวันที่ต้องรัน ไม่ใช่วันที่เริ่มสร้าง

---

## 6. Example — Bake-off เลือกโมเดลให้ Chatbot ภาษาไทยจริง

### 6.1 โจทย์

บริษัท e-commerce ต้องการ chatbot ตอบลูกค้าภาษาไทย ใช้ RAG ดึงนโยบายคืนสินค้า (ดู PART 36) และเรียก tool เช็คสถานะ order

**ข้อบังคับแข็ง (hard constraints):**

| ข้อบังคับ | ค่า |
|---|---|
| Latency | p95 time-to-first-token < 2 วินาที (chat แบบ stream) |
| Privacy | ข้อมูลลูกค้าห้ามถูกนำไปเทรน ต้องมีสัญญา zero/short retention |
| Region | ต้องใช้ผ่าน cloud ที่บริษัทมีสัญญาอยู่ |
| ภาษา | ตอบไทยสุภาพ ใช้ศัพท์ถูกบริบท ไม่ปนอังกฤษมั่ว |
| Format | tool call ต้องเป็น JSON ถูก schema ≥ 99% |
| Volume | ประมาณ 200,000 บทสนทนา/เดือน |

> **ให้มองภาพนี้ว่า** "เขียนข้อบังคับแข็งก่อนเปิดดูโมเดลตัวไหน — ไม่อย่างนั้นคุณจะเผลอปรับเกณฑ์ให้เข้ากับโมเดลที่ชอบ"

### 6.2 ขั้นตอน Bake-off ทั้งเส้น

```
1. เขียน hard constraints          → ตัดตัวที่ไม่ผ่านทิ้งโดยไม่ต้องวัด
        ↓
2. คัด shortlist 3–5 ตัว           → ข้ามค่าย + ข้าม tier (ใช้ leaderboard/docs ตรงนี้ได้)
        ↓
3. สร้าง eval set จากงานจริง       → 100–300 เคส จาก log จริง (ลบข้อมูลส่วนตัว)
        ↓
4. เขียน rubric                    → "ดี" คืออะไร วัดได้
        ↓
5. ปรับ prompt ให้แต่ละตัวพอสมควร  → ไม่ใช่ prompt เดียวยัดทุกตัว
        ↓
6. รันทุกตัว เก็บ output + token + latency
        ↓
7. Blind grading                   → คน + LLM-as-judge (ที่ calibrate แล้ว)
        ↓
8. คำนวณ cost per task + p95 latency
        ↓
9. เลือก "ตัวถูกที่สุดที่ผ่านเกณฑ์" + ตัว fallback
        ↓
10. Shadow traffic / canary ก่อนเปิดเต็ม
```

### 6.3 สร้าง Eval Set — หัวใจของทั้งบท

**Eval set ที่ดีต้องมีเคส 4 กลุ่ม:**

| กลุ่ม | สัดส่วนคร่าว ๆ | ตัวอย่าง |
|---|---|---|
| Happy path | ~50% | "ของยังไม่มาส่งเลยค่ะ order 12345" |
| Edge case | ~25% | ภาษาพูด/สะกดผิด/ปนอังกฤษ, ถามหลายเรื่องในข้อความเดียว, order id ผิดรูปแบบ |
| Policy / safety | ~15% | ขอคืนเงินนอกเงื่อนไข, ถามข้อมูลลูกค้าคนอื่น, พยายาม prompt injection |
| Tool & format | ~10% | ต้องเรียก tool ถูกตัว ส่ง argument ถูก schema |

**กฎทอง:**

1. **มาจาก log จริง** ไม่ใช่ให้ LLM แต่งขึ้นเองทั้งหมด (แต่งเสริมได้ แต่ต้องมีของจริงเป็นแกน)
2. **มี golden answer หรือ rubric ต่อเคส** — ไม่งั้นไม่มีทางรู้ว่าตัวไหนชนะ
3. **เก็บเป็น version** เหมือน code — วันที่ต้อง migrate คุณจะรันมันซ้ำ
4. **เพิ่มเคสทุกครั้งที่เจอ bug ใน production** — eval set คือ regression test ของ LLM

**Rubric ตัวอย่าง (ให้คะแนน 0–2 ต่อข้อ):**

```
ถูกต้องตามนโยบาย        0 / 1 / 2
ตอบตรงคำถาม ครบทุกประเด็น 0 / 1 / 2
ภาษาไทยเป็นธรรมชาติ สุภาพ 0 / 1 / 2
เรียก tool ถูก / JSON ถูก  ผ่าน / ไม่ผ่าน   ← hard fail
ไม่แต่งข้อมูลที่ไม่มีใน context  ผ่าน / ไม่ผ่าน   ← hard fail
```

### 6.4 Blind Comparison — กันอคติยี่ห้อ

```
คำตอบจาก Model A ─┐
คำตอบจาก Model B ─┼─→ [สลับลำดับ + ซ่อนชื่อ] ─→ ผู้ให้คะแนนเห็นแค่ "คำตอบ 1, 2, 3"
คำตอบจาก Model C ─┘
```

> **ให้มองภาพนี้ว่า** "ถ้ากรรมการรู้ว่าคำตอบไหนมาจากรุ่นแพงสุด เขาจะหาเหตุผลให้มันชนะเสมอ — การซ่อนชื่อคือการบังคับให้ตัดสินจากงาน"

**ข้อควรระวังของ LLM-as-Judge:**

| ความเสี่ยง | วิธีรับมือ |
|---|---|
| Judge ชอบคำตอบยาว | ใส่ใน rubric ว่า "กระชับ" เป็นคะแนน |
| Judge ชอบลำดับแรก (position bias) | สลับลำดับแล้วตัดสินสองรอบ |
| Judge ลำเอียงเข้าค่ายตัวเอง | ใช้ judge คนละค่ายกับผู้เข้าแข่ง หรือหลาย judge |
| Judge ภาษาไทยไม่แม่น | ให้คนไทยตรวจ sample 10–20% แล้วเทียบว่า judge ตรงกับคนไหม |

### 6.5 ผลลัพธ์ (ตัวเลขสมมติเพื่อสอนวิธีอ่าน ไม่ใช่ผลจริงของรุ่นใด)

| ตัวแข่ง | Tier | คะแนนคุณภาพ | Hard fail | p95 TTFT | cost per task (สัมพัทธ์) |
|---|---|---|---|---|---|
| Model A | Frontier + thinking | 94% | 0.5% | 6.5 s ❌ | 10× |
| Model B | Frontier ไม่เปิด thinking | 92% | 0.8% | 1.8 s | 6× |
| Model C | Balanced (ค่ายที่ 2) | 90% | 1.2% | 1.1 s | 2× |
| Model D | Balanced (ค่ายที่ 3) | 88% | 3.5% ❌ | 0.9 s | 1.8× |
| Model E | Small | 79% ❌ | 6.0% ❌ | 0.5 s | 1× |

เกณฑ์ที่ตั้งไว้ก่อน: คุณภาพ ≥ 88%, hard fail ≤ 1.5%, p95 TTFT < 2 s

**อ่านผล:**

- **A** คุณภาพสูงสุด แต่ **ตก latency** — ตัดทิ้ง ต่อให้ leaderboard สวยแค่ไหน
- **D** คุณภาพผ่าน แต่ **tool JSON พังบ่อย** — structured output reliability เป็น hard fail
- **E** ถูกสุดแต่คุณภาพไม่ถึง — แต่ **เก็บไว้ใช้กับงานย่อย** เช่น จัดหมวดข้อความก่อนเข้า bot
- **B vs C** ผ่านทั้งคู่ C ด้อยกว่า 2 จุด แต่ถูกกว่า 3 เท่า → **เลือก C เป็นตัวหลัก B เป็นตัวรับเคสยาก**

> **ให้มองภาพนี้ว่า** "ผู้ชนะไม่ใช่ตัวที่คะแนนสูงสุด แต่คือตัวที่ถูกที่สุดในกลุ่มที่ผ่านเกณฑ์ — และตัวที่แพ้ก็ยังมีงานที่เหมาะกับมัน"

### 6.6 Routing / Cascade — ใช้หลายตัวพร้อมกัน

```
[ข้อความลูกค้า]
      ↓
[Model E: small]  จัดหมวด + วัดความยาก         ← ถูกมาก ทุกข้อความผ่านตรงนี้
      ↓
  ┌───┴────────────────┬────────────────────┐
  ↓                    ↓                    ↓
ง่าย (FAQ)          ปกติ                   ซับซ้อน / เสี่ยง (ขอคืนเงินนอกเงื่อนไข)
[Model C]          [Model C]              [Model B] หรือส่งให้คน
```

**Pseudocode สั้น ๆ:**

```
route = small.classify(msg)            # "faq" | "normal" | "hard"
model = config.models[route]           # อยู่ใน config ไม่ใช่ hardcode
reply = llm.generate(model, prompt[route], msg)
if !valid(reply): reply = llm.generate(config.fallback, ...)
```

**Trade-off ของ cascade:** ประหยัดได้มาก แต่มีจุดพังเพิ่ม (classifier จัดผิด = งานยากไปตกที่ตัวเล็ก) — ต้องมี eval ของ **ตัว router เอง** ด้วย

### 6.7 Provider Abstraction — กัน lock-in แต่อย่าหลอกตัวเอง

```
[APP] → llm.generate(task, messages, tools, schema)   ← interface กลาง
              ↓
   ┌──────────┼──────────┐
[Adapter A] [Adapter B] [Adapter C]                   ← แปลงเป็น format แต่ละค่าย
```

(Adapter Pattern เดียวกับ PART 17)

**สิ่งที่ abstraction ทำได้ดี:**

- messages / system prompt / temperature / max tokens
- tool definition พื้นฐาน, structured output พื้นฐาน
- retry, timeout, fallback, logging, นับ token, budget

**สิ่งที่ abstraction ทำให้เท่ากันไม่ได้ (ข้อจำกัดที่ต้องพูดใน interview):**

| ต่างกันตรงไหน | ทำไมซ่อนไม่ได้ |
|---|---|
| Prompt ที่ได้ผลดี | แต่ละรุ่นตอบสนองต่อ style ของ prompt ต่างกัน |
| Reasoning / thinking control | ชื่อ parameter, หน่วย, การแสดงผล ต่างกัน |
| Prompt caching | กลไก, วิธีระบุ, การคิดเงินต่างกัน |
| Structured output | ความเข้มของการบังคับ schema และ subset ของ JSON Schema ต่างกัน |
| Multimodal input | ชนิดไฟล์ ขนาด วิธีส่ง ต่างกัน |
| Built-in tools / agent features | แต่ละค่ายมี feature เฉพาะของตัวเอง |
| Error & rate limit semantics | status code, header, retry-after ต่างกัน |
| Safety behavior | ปฏิเสธคนละแบบ คนละเกณฑ์ |

> **ให้มองภาพนี้ว่า** "Abstraction คือปลั๊กแปลงไฟ — เสียบได้ทุกประเทศ แต่ไม่ได้ทำให้เครื่องใช้ไฟฟ้าทุกเครื่องทำงานเหมือนกัน"

**หลักปฏิบัติของ Senior:** abstraction บาง ๆ ที่ **ยอมให้มีช่องทางใช้ feature เฉพาะค่าย** (escape hatch) ดีกว่า abstraction หนาที่บังคับทุกค่ายเหลือ feature ตัวหารร่วมน้อยที่สุด — lock-in จริง ๆ ไม่ได้อยู่ที่ SDK แต่อยู่ที่ **prompt, eval และ feature เฉพาะค่ายที่คุณใช้** ซึ่งต้องจัดการด้วยการมี eval set ไม่ใช่ด้วยโค้ด

### 6.8 Migration Checklist — เปลี่ยนรุ่นหรือเปลี่ยนค่าย

**สถานการณ์:** vendor ประกาศว่ารุ่นที่ใช้อยู่จะปิดในอีก 3 เดือน หรือมีรุ่นใหม่ที่อาจถูกกว่า

```
□ 1. อ่าน migration guide / changelog ของ vendor — มี breaking change อะไร
□ 2. รัน eval set เดิมกับรุ่นใหม่ ด้วย prompt เดิม       → ได้ baseline
□ 3. Re-tune prompt สำหรับรุ่นใหม่ แล้วรันอีกรอบ
□ 4. เช็ค output format: JSON, ความยาว, markdown, ภาษา, การขึ้นต้น/ลงท้าย
□ 5. เช็ค tool calling: เลือก tool ถูกไหม เรียกถี่ขึ้น/น้อยลงไหม
□ 6. เช็ค parameter ที่ถูกเปลี่ยน/เลิก (เช่น การตั้ง sampling, thinking)
□ 7. คำนวณ cost per task ใหม่ (tokenizer ใหม่ อาจนับ token ภาษาไทยต่างเดิม)
□ 8. เช็ค latency p50/p95 และ rate limit / quota ของรุ่นใหม่ในบัญชีเรา
□ 9. เช็ค safety/refusal บนเคส policy
□ 10. เช็ค privacy terms / region ของรุ่นใหม่ยังเหมือนเดิมไหม
□ 11. Shadow traffic → canary % เล็ก → เพิ่มทีละขั้น (ดู PART 15)
□ 12. เก็บรุ่นเก่าไว้เป็น rollback จนกว่าจะถึงวันปิดจริง
□ 13. อัปเดต dashboard / alert ให้แยก metric ตาม model id
```

> **ให้มองภาพนี้ว่า** "เปลี่ยนโมเดล = deploy ระบบใหม่ ไม่ใช่เปลี่ยน string หนึ่งบรรทัด — ต้องมี test, canary และ rollback เหมือน deploy code"

**ประโยคที่ต้องจำ:** "รุ่นใหม่ **ดีกว่าโดยเฉลี่ย** ไม่ได้แปลว่า **ดีกว่าบนงานของเรา** — ต้อง re-eval ทุกครั้ง"

### 6.9 Decision Matrix ตาม Use Case

| Use case | Tier เริ่มต้นที่ควรลอง | มิติที่ให้น้ำหนักมากสุด | Reasoning mode | หมายเหตุ |
|---|---|---|---|---|
| Chatbot ลูกค้า | Balanced | TTFT, ภาษา, safety, tool use | ปิด / ต่ำ | ใช้ cascade ส่งเคสยากขึ้นรุ่นใหญ่ |
| Extraction (ดึงข้อมูลจากเอกสาร) | Small → Balanced | structured output reliability, ความแม่นยำ field | ปิด | วัด field-level accuracy ไม่ใช่ "ดูแล้วโอเค" |
| Coding assistant / code agent | Frontier หรือรุ่นที่ vendor วางไว้สำหรับ coding | คุณภาพหลายขั้น, context window, tool use | เปิดตามความยาก | ต้นทุนต่อ task สูงแต่แทนเวลาคนได้มาก |
| RAG ถาม-ตอบเอกสาร | Balanced | faithfulness (ไม่แต่ง), อ้างอิงแหล่ง, context ยาว | ต่ำ-กลาง | คุณภาพ retrieval สำคัญกว่าขนาดโมเดล (PART 36) |
| Agent หลายขั้นตอน | Frontier / Balanced ที่ tool use แข็ง | tool use reliability, การวางแผน, ความนิ่ง | กลาง-สูง | วัดทั้ง trajectory ไม่ใช่แค่คำตอบสุดท้าย |
| Classification ปริมาณมาก | Small / Open-weight | ราคา, throughput, ความสม่ำเสมอ | ปิด | batch API หรือ self-host เมื่อปริมาณนิ่ง |
| Voice / real-time | รุ่นที่ออกแบบมาเพื่อ realtime/live | latency มาก่อนทุกอย่าง | ปิด | thinking นาน = บทสนทนาเงียบ ผู้ใช้วางสาย |
| ข้อมูลอ่อนไหวสูง (สุขภาพ การเงิน) | ตามคุณภาพที่ต้องการ | privacy terms, region, audit | ตามงาน | marketplace ใน cloud เดิม หรือ self-host |

> **ให้มองภาพนี้ว่า** "ตารางนี้บอกแค่ว่า 'ลองจากตรงไหน' — คำตอบสุดท้ายยังต้องมาจาก eval ของคุณเสมอ"

---

## 7. Compare

### 7.1 Frontier vs Balanced vs Small

| ประเด็น | Frontier | Balanced | Small / Fast |
|---|---|---|---|
| คุณภาพงานยาก | สูงสุด | ดี | จำกัด |
| Latency | ช้าสุด | ปานกลาง | เร็วสุด |
| ราคา/token | แพงสุด | กลาง | ถูกสุด |
| Rate limit | มักต่ำกว่า | กลาง | มักสูงกว่า |
| เหมาะกับ | งานยาก เดิมพันสูง ปริมาณน้อย | งานหลักของ production | งานง่าย ปริมาณมาก / router |
| ความเสี่ยง | บิลพุ่ง latency เกิน | บางเคสยากพลาด | พลาดคำสั่งซับซ้อน |

**สิ่งที่ต้องไม่พูดใน interview:** "ใช้รุ่นใหญ่สุดไว้ก่อน ปลอดภัยดี"
**สิ่งที่ควรพูดแทน:** "เริ่มจากรุ่นกลางเป็น baseline แล้วขยับขึ้นลงตาม eval — จ่ายแพงเฉพาะส่วนที่พิสูจน์แล้วว่าต้องใช้"

### 7.2 Reasoning ON vs OFF

| ประเด็น | Reasoning ON | Reasoning OFF |
|---|---|---|
| งานหลายขั้น / logic | ดีขึ้นชัด | พลาดง่ายกว่า |
| งานง่าย | แทบไม่ต่าง แต่แพงขึ้น | พอ |
| Latency | เพิ่มมาก คาดเดายาก | ต่ำ คาดเดาได้ |
| ต้นทุน | เพิ่มตาม thinking token | ต่ำ |
| UX | ต้องมี loading / progress | ตอบทันที |

### 7.3 API ตรง vs Cloud Marketplace vs Self-host

| ประเด็น | API ตรงของ vendor | Cloud Marketplace | Self-host open-weight |
|---|---|---|---|
| Feature ใหม่ | เร็วสุด | อาจช้ากว่า | ขึ้นกับรุ่นที่ปล่อย |
| Compliance / IAM | ต้องทำสัญญาใหม่ | ใช้ของ cloud เดิม | คุมเองเต็มที่ |
| Ops | ต่ำ | ต่ำ | สูงมาก |
| โครงสร้างต้นทุน | ต่อ token | ต่อ token (+ commitment) | ต่อ GPU-ชั่วโมง |
| เปลี่ยนค่าย | ต้องมี adapter | สลับในที่เดียวง่ายกว่า | เปลี่ยน weight ได้ แต่ต้อง re-deploy |

### 7.4 Closed vs Open-weight

| ประเด็น | Closed (API) | Open-weight |
|---|---|---|
| ความสามารถสูงสุด | มักนำหน้า | ตามหลัง/ไล่ทันแล้วแต่ช่วงเวลา |
| ข้อมูล | ส่งออกไปหา vendor (ตามสัญญา) | อยู่ในบ้านเรา |
| Fine-tune | จำกัดตามที่ vendor เปิด | ทำได้ลึก |
| Deprecation | vendor เป็นคนกำหนด | weight อยู่กับเรา ไม่มีใครปิด |
| ต้นทุนแฝง | แทบไม่มี | ทีม ops, GPU ว่าง, security patch |

### 7.5 ตารางคู่ที่สับสนบ่อย

| คู่ที่สับสน | ต่างกันตรงไหน |
|---|---|
| **Benchmark vs Eval set** | Benchmark = ข้อสอบกลางของโลก / Eval set = ข้อสอบจากงานเรา — ตัดสินด้วยตัวหลัง |
| **Context window vs Memory** | Context = ที่ใส่ต่อ request (ลืมเมื่อจบ) / Memory = ระบบที่เราสร้างเองเพื่อจำข้าม request |
| **Context ใหญ่ vs ใช้ context ได้ดี** | ใส่ได้เยอะ ≠ หาเจอทุกจุด — ต้องวัดกับเอกสารยาวจริง |
| **Alias vs Pinned version** | Alias = เปลี่ยนใต้เท้าได้ / Pinned = นิ่ง แต่มีวันปิด |
| **Open-weight vs Open-source** | Open-weight = ปล่อย weight / Open-source เต็มรูปอาจรวมข้อมูลและโค้ดเทรน — license ต่างกัน |
| **Abstraction vs Gateway** | Abstraction = library ในโค้ด / Gateway = service กลางที่ทุก call ผ่าน (มีทั้งคู่ได้) |
| **Fallback vs Routing** | Fallback = ใช้เมื่อตัวหลักพัง / Routing = เลือกตัวตามลักษณะงานตั้งแต่ต้น |
| **Price per token vs Cost per task** | ราคาต่อ token ถูก ≠ ต้นทุนต่องานถูก ถ้าใช้ token เยอะกว่าหรือต้อง retry บ่อยกว่า |
| **Latency vs Throughput** | Latency = รอนานแค่ไหน / Throughput = พ่นคำตอบเร็วแค่ไหนหรือรับงานพร้อมกันได้เท่าไร |

---

## 8. Common Mistakes

| # | สิ่งที่ Junior มักเข้าใจผิด | ความจริง |
|---|---|---|
| 1 | "ดู leaderboard แล้วเลือกอันดับ 1 เลย" | leaderboard ไม่ได้วัดงาน ภาษา format และต้นทุนของคุณ — ใช้คัดเข้ารอบเท่านั้น |
| 2 | "ใช้รุ่นใหญ่สุดทุกงาน ปลอดภัยดี" | จ่ายแพงเกินจำเป็นหลายเท่า + latency สูง + rate limit ต่ำ |
| 3 | "ราคาต่อ token ถูกกว่า = ถูกกว่า" | ต้องดู cost per task: token ต่องาน, retry, อัตราสำเร็จ, thinking token |
| 4 | "ทดสอบ 5 prompt ด้วยตาแล้วพอ" | 5 เคสไม่พอเห็นความต่าง — ต้องมี eval set หลักร้อยจากงานจริง และ rubric |
| 5 | "ใช้ prompt เดียวเทียบทุกโมเดลถึงจะยุติธรรม" | prompt ที่ถูกจูนกับรุ่นหนึ่งทำให้รุ่นอื่นเสียเปรียบ — ควรจูนแต่ละตัวพอสมควร |
| 6 | "เปลี่ยนรุ่นแค่แก้ model id บรรทัดเดียว" | format, tool behavior, ราคา, rate limit, safety เปลี่ยนได้หมด — ต้อง re-eval + canary |
| 7 | "ใช้ alias `latest` ใน production สะดวกดี" | พฤติกรรมเปลี่ยนโดยไม่มี deploy ใด ๆ — bug ที่ไม่มี commit ให้ย้อน |
| 8 | "เปิด thinking ทุก request คุณภาพจะดีขึ้น" | งานง่ายแทบไม่ต่าง แต่บิลและ latency เพิ่มจริง |
| 9 | "context window 1M token = ยัดเอกสารทั้งหมดได้เลย" | แพง ช้า และหาจุดสำคัญไม่เจอเสมอ — RAG/การคัด context ยังจำเป็น |
| 10 | "ใช้ abstraction แล้วไม่ติด lock-in แน่นอน" | lock-in อยู่ที่ prompt, eval และ feature เฉพาะค่ายด้วย ไม่ใช่แค่ SDK |
| 11 | "ภาษาไทยทุกรุ่นก็พอ ๆ กัน" | คุณภาพภาษาไทยและจำนวน token ต่อข้อความต่างกันมาก — ต้องวัดบนข้อความไทยจริง |
| 12 | "Self-host ถูกกว่าเพราะไม่ต้องจ่ายต่อ token" | GPU ว่างก็จ่าย + เวลาวิศวกร + on-call — คุ้มเมื่อปริมาณสูงและนิ่งเท่านั้น |
| 13 | "Open-weight = ใช้เชิงพาณิชย์ได้ฟรีทุกกรณี" | แต่ละรุ่นมี license ต่างกัน ต้องอ่านเงื่อนไขเอง |
| 14 | "ส่งข้อมูลลูกค้าเข้า API ได้เลย vendor ใหญ่ปลอดภัย" | ต้องอ่าน data retention, การนำไปเทรน, region ในสัญญาจริง และทำตามกฎหมายที่เกี่ยวข้อง |
| 15 | "เลือกเสร็จแล้วจบ" | รุ่นใหม่ออก รุ่นเก่าปิด ราคาเปลี่ยน — model selection คือ process ต่อเนื่อง |
| 16 | "rate limit ค่อยดูตอน traffic มา" | วันเปิดตัวคือวันที่เจอ 429 ทั้งระบบ — ขอ quota และมี fallback ก่อน |

---

## 9. Debugging

### 9.1 Framework: "เปลี่ยนโมเดลแล้วระบบแย่ลง" ให้ไล่ตามลำดับนี้

```
1. แย่ลงจริงไหม / แย่ตรงไหน?         → รัน eval set เทียบรุ่นเก่า-ใหม่ อย่าเชื่อความรู้สึก
        ↓
2. แย่ทุกเคสหรือบางกลุ่ม?            → ทุกเคส = config/prompt/parameter ผิด
        ↓                              บางกลุ่ม = พฤติกรรมรุ่นต่างกันในงานนั้น
3. เป็นปัญหา format หรือ content?    → JSON พัง/ยาวเกิน/ภาษาปน vs ตอบผิดเนื้อหา
        ↓
4. เช็ค request ที่ส่งจริง            → model id, max tokens, thinking, tools, system prompt ครบไหม
        ↓
5. เช็ค token & cost                 → tokenizer ใหม่นับต่าง? thinking token พุ่ง?
        ↓
6. เช็ค latency & error               → 429 rate limit, timeout, overloaded, region
        ↓
7. เช็คฝั่ง vendor                    → status page, changelog, deprecation notice
        ↓
8. แก้ → เพิ่มเคสนั้นเข้า eval set → canary ใหม่
```

> **ให้มองภาพนี้ว่า** "ไล่จากหลักฐานไปหาสาเหตุ — ยืนยันด้วย eval ก่อน แยกว่าเป็นปัญหา format หรือความฉลาด แล้วค่อยดู request, ต้นทุน, และฝั่ง vendor ตามลำดับ"

### 9.2 ตารางอาการ → สาเหตุที่น่าสงสัยที่สุด

| อาการ | สงสัยอะไรก่อน | เช็คยังไง |
|---|---|---|
| คุณภาพเปลี่ยนทั้งที่ไม่มี deploy | **ใช้ alias** ที่ชี้ไปรุ่นใหม่ | ดู model id ที่ response ตอบกลับมา / pin version |
| JSON parse error พุ่งหลังย้ายรุ่น | **structured output ต่างกัน** | เปิดใช้โหมด schema ของค่ายนั้น + validate + retry |
| คำตอบถูกตัดกลางคัน | **max output tokens ต่ำ** หรือ thinking กิน budget | ดู stop reason / finish reason |
| บิลพุ่งทั้งที่ traffic เท่าเดิม | **thinking token / tokenizer ใหม่ / prompt ยาวขึ้น** | แยก input/output/thinking token ต่อ task ใน dashboard |
| latency p95 พุ่ง | **thinking เปิด / คำตอบยาวขึ้น / region ไกล** | วัด TTFT แยกจากเวลารวม |
| 429 ช่วง peak | **rate limit / quota** | ดู header ของ rate limit + ขอเพิ่ม quota + fallback + backoff (PART 16) |
| ภาษาไทยแปลก ปนอังกฤษ | **รุ่นใหม่ไม่เก่งไทยเท่า / prompt ไม่ระบุภาษา** | eval เฉพาะกลุ่มภาษาไทย + ระบุภาษาใน system prompt |
| ปฏิเสธคำขอปกติบ่อยขึ้น | **safety behavior ต่างกัน** | รันเคส policy + ปรับ system prompt ให้บอกบริบทธุรกิจชัด |
| tool ถูกเรียกผิดตัว / ถี่เกิน | **tool-use behavior ต่างกัน** | ปรับ description ของ tool + eval แบบ trajectory |
| ใช้ผ่าน marketplace แล้วบาง parameter ไม่ทำงาน | **feature ยังไม่รองรับบน platform นั้น** | เช็ค docs ของ cloud ไม่ใช่ docs ของ vendor อย่างเดียว |
| error "model not found" กะทันหัน | **รุ่นถูกปิด (shutdown)** | เช็ค deprecation page — และตั้ง alert ล่วงหน้าครั้งหน้า |

### 9.3 Metric ที่ต้องมีบน dashboard (แยกตาม model id เสมอ)

| Metric | ใช้ดูอะไร |
|---|---|
| Eval score ตาม version | คุณภาพก่อน-หลังเปลี่ยนรุ่น/prompt |
| Input / output / thinking tokens ต่อ task | ต้นทุนจริง และจับ token พุ่ง |
| Cost per task / ต่อวัน | งบประมาณ + alert เมื่อเกิน |
| p50 / p95 TTFT และเวลารวม | ประสบการณ์ผู้ใช้ |
| Error rate แยกชนิด (429, 5xx, timeout, parse fail) | ปัญหาฝั่ง vendor vs ฝั่งเรา |
| Fallback rate | ตัวหลักพังบ่อยแค่ไหน |
| User feedback (👍/👎), escalation rate | คุณภาพจากผู้ใช้จริง |

(ดู PART 23 เรื่อง logs / metrics / tracing — LLM call ก็คือ span หนึ่งใน trace)

---

## 10. Interview Questions

### 🟢 Junior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| Model tier คืออะไร ทำไมต้องมีหลายขนาด | ใหญ่-กลาง-เล็ก แลกคุณภาพกับราคาและ latency + เลือกตามงาน |
| Token คืออะไร เกี่ยวกับค่าใช้จ่ายยังไง | หน่วยนับข้อความ + input/output คิดราคาต่างกัน + ไทยมักกิน token มากกว่า |
| Context window คืออะไร | ปริมาณสูงสุดต่อ request + **ใหญ่ไม่ได้แปลว่าใช้ได้ดีทุกจุด** |
| Open-weight ต่างจากใช้ API ยังไง | รันเองได้ คุมข้อมูลได้ แต่ต้องดูแล infra เอง |
| ทำไมไม่ควรใช้รุ่นใหญ่สุดกับทุกงาน | ต้นทุน + latency + rate limit — งานง่ายไม่ต้องใช้ |
| ทำไมต้อง pin model version | กันพฤติกรรมเปลี่ยนเงียบ ๆ + รู้ว่าต้องย้ายเมื่อไร |

### 🟡 Mid

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| จะเลือกโมเดลให้ feature ใหม่ยังไง | hard constraints → shortlist → eval set จากงานจริง → blind grading → cost per task + p95 → ตัวถูกสุดที่ผ่าน |
| สร้าง eval set ยังไง | log จริง + edge/policy/format case + rubric/golden answer + version + เพิ่มเคสจาก bug |
| Reasoning mode ควรเปิดเมื่อไร | งานหลายขั้นที่ eval พิสูจน์ว่าคุ้ม + รับ latency ได้ + ตั้ง effort ต่ำสุดที่ผ่าน |
| ทำไม leaderboard ใช้ตัดสินไม่ได้ | ไม่ตรงงาน, contamination, ไม่วัด cost/latency/format/ภาษาไทย |
| LLM-as-judge มีข้อควรระวังอะไร | position/length/self bias + ต้อง calibrate กับคน + judge ต่างค่าย |
| จะลดค่าใช้จ่าย LLM ยังไงโดยคุณภาพไม่ตก | routing/cascade, ลดขนาด prompt, prompt caching, batch API, ลดรุ่นเมื่อ eval ผ่าน, ปิด thinking งานง่าย |
| API ตรง vs cloud marketplace เลือกยังไง | feature ใหม่ vs compliance/IAM/billing เดิม + ต้องเช็คว่า feature รองรับบน platform ไหม |

### 🔴 Senior

| คำถาม | เขาอยากฟังอะไร |
|---|---|
| ออกแบบระบบให้เปลี่ยน vendor ได้ยังไง | abstraction บาง + gateway + config-driven routing + eval set เป็นสินทรัพย์หลัก + **ยอมรับข้อจำกัดของ abstraction** (prompt/feature/caching ต่างกัน) + escape hatch |
| Vendor ประกาศปิดรุ่นใน 90 วัน จะทำยังไง | migration checklist: re-eval, re-tune prompt, format, cost, rate limit, privacy, shadow → canary → rollback + ปรับ process ให้ครั้งหน้าไม่ตกใจ |
| เมื่อไรควร self-host | ปริมาณสูงและนิ่ง, ข้อบังคับ privacy แข็ง, ต้อง fine-tune ลึก — ชั่งกับ GPU cost + ops + ความสามารถที่อาจตามหลัง + license |
| ระบบใช้ LLM วันละล้าน request บิลบาน จะวิเคราะห์ยังไง | แยก cost ตาม task/model/token type → หา task ที่แพงสุด → ดูว่าใช้ tier เกินงานไหม → cascade/caching/batch/ตัด prompt → re-eval ทุกการเปลี่ยน |
| จะรับประกันคุณภาพในระบบที่โมเดลไม่ deterministic ยังไง | eval ใน CI, schema validation + retry, guardrail, monitoring แยกตาม model id, human review sample, fallback |
| มี multi-vendor แล้วต้องระวังอะไรเรื่อง data | privacy terms แต่ละค่ายต่างกัน, region, audit log, ไม่ fallback ข้อมูลอ่อนไหวไปค่ายที่ไม่ผ่าน compliance |
| Agent หลายขั้นตอน เลือกโมเดลต่างกับ chatbot ยังไง | tool-use reliability และความนิ่งหลายขั้นสำคัญกว่าความลื่นของภาษา + วัด trajectory + ต้นทุนต่อ task รวมทุกขั้น + อาจผสมรุ่นใหญ่วางแผน รุ่นเล็กทำขั้นย่อย |

---

## 11. Answer Like a Developer

### โครงมาตรฐาน 4 จังหวะ (ใช้กับคำถาม model selection ได้เกือบทุกข้อ)

```
1. เริ่มจากข้อบังคับของงาน      "ขึ้นกับว่างานนี้ต้องการ ... ครับ"
        ↓
2. วิธีวัด ไม่ใช่ชื่อรุ่น         "ผมจะวัดด้วย eval set จากงานจริง ..."
        ↓
3. ตัวอย่างจากงานจริง           "ตอนทำ ... เราเจอว่า ..."
        ↓
4. Trade-off + แผนเปลี่ยน        "แลกกับ ... และออกแบบให้ย้ายได้ด้วย ..."
```

> **ให้มองภาพนี้ว่า** "คนที่ตอบด้วยชื่อรุ่นจะตกยุคในหกเดือน คนที่ตอบด้วยวิธีเลือกจะถูกต้องไปอีกหลายปี — interviewer อยากฟังแบบหลัง"

### ตัวอย่างการตอบ: "จะเลือก LLM ตัวไหนให้ chatbot ของเรา"

**❌ คำตอบระดับท่องจำ:** "ใช้ตัวที่ล่าสุดและเก่งที่สุดครับ เพราะ benchmark สูงสุด"

**✅ คำตอบระดับที่อยากได้:**
> "ผมจะเริ่มจากข้อบังคับก่อนครับ เช่น latency ที่ผู้ใช้รับได้ ข้อมูลลูกค้าออกนอกประเทศได้ไหม ต้องตอบภาษาไทยระดับไหน และปริมาณต่อเดือนเท่าไร — ตัวที่ไม่ผ่านข้อบังคับตัดทิ้งเลย
> จากนั้นคัด 3–4 ตัวข้ามค่ายและข้าม tier แล้ววัดด้วย eval set ที่ดึงจากแชทจริง มี edge case กับเคส policy ให้คะแนนแบบ blind แล้วคำนวณ cost per task กับ p95 latency
> ที่งานเก่าเราเจอว่ารุ่นกลางผ่านเกณฑ์เกือบเท่ารุ่นใหญ่ แต่ถูกกว่าหลายเท่า เลยใช้รุ่นกลางเป็นตัวหลัก ส่งเคสยากขึ้นรุ่นใหญ่ และใช้รุ่นเล็กจัดหมวดข้อความก่อน
> แต่ต้องยอมรับว่าโมเดลเปลี่ยนเร็ว ผมเลยวาง abstraction กับ gateway ไว้ pin version และเก็บ eval set ไว้รันทุกครั้งที่จะเปลี่ยนรุ่นครับ"

### ตัวอย่างการตอบ: "ทำไมไม่ใช้ abstraction library แล้วถือว่าไม่ติด vendor"

> "abstraction ช่วยเรื่องโค้ดครับ เช่น format ของ messages, retry, fallback แต่ lock-in จริง ๆ อยู่ที่อื่นด้วย — prompt ที่จูนกับรุ่นหนึ่ง, feature เฉพาะค่ายอย่าง caching หรือ reasoning control, และพฤติกรรมของ structured output ที่ต่างกัน
> ผมเลยทำ abstraction บาง ๆ ที่ยังเปิดช่องให้ใช้ feature เฉพาะค่ายได้ และถือว่าสิ่งที่ทำให้ย้ายได้จริงคือ eval set ที่รันซ้ำได้ ไม่ใช่ interface ที่สวย"

### คำพูดที่ทำให้ดูมีประสบการณ์ (ใช้ได้จริง ไม่ใช่ท่อง)

| สถานการณ์ | พูดแบบนี้ |
|---|---|
| ถูกถามว่ารุ่นไหนดีสุด | "ขึ้นกับงานครับ ผมจะวัดบน eval ของเราก่อน เพราะ benchmark กลางไม่ได้วัดข้อมูลเรา" |
| ถูกถามเรื่องต้นทุน | "ผมดู cost per task ไม่ใช่ราคาต่อ token เพราะรวม retry และ thinking token ด้วย" |
| ถูกถามชื่อรุ่นที่ไม่รู้จัก | "ผมยังไม่ได้ลองรุ่นนั้นครับ แต่จะวางมันเข้า bake-off แบบเดียวกับตัวอื่น" |
| ถูกถามเรื่อง trade-off | "มันแลกระหว่างคุณภาพกับ latency และต้นทุน ในงานนี้ผมให้น้ำหนัก ... เพราะ ..." |
| ถูกถามเรื่องอนาคต | "ผมถือว่าทุกรุ่นมีวันปิด เลยออกแบบให้ย้ายได้ตั้งแต่วันแรก" |

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเข้าห้องสัมภาษณ์:

- **ไม่มีโมเดลที่ดีที่สุด** มีแต่ตัวที่ **ถูกที่สุดในกลุ่มที่ผ่านเกณฑ์ของงานนี้**
- **Tier:** Frontier (ยาก/แพง/ช้า) → Balanced (งานหลัก) → Small (ง่าย/ถูก/เร็ว) → Open-weight (คุมเอง ดูแลเอง)
- **มิติที่ต้องดู:** คุณภาพบนข้อมูลเรา, reasoning, latency (TTFT/p95), ราคา input/output, context window, multimodal, tool use & structured output, ภาษาไทย, safety, privacy & region, rate limit, ecosystem
- **Reasoning mode** = ฉลาดขึ้นแลกกับช้าและแพงขึ้น — เปิดเป็นราย task ที่ eval พิสูจน์ว่าคุ้ม
- **Vendor:** OpenAI (GPT), Anthropic (Claude), Google (Gemini), open-weight (Llama, Mistral, Qwen ฯลฯ), marketplace (Azure, Bedrock, Vertex) — ชื่อรุ่นเปลี่ยนเร็ว **เช็ค docs ทางการเสมอ**
- **Leaderboard ใช้คัดเข้ารอบ ไม่ใช่ตัดสิน** — ตัดสินด้วย eval set จากงานจริง + blind comparison
- **Cost per task** > ราคาต่อ token (รวม retry, thinking, อัตราสำเร็จ)
- **Routing/Cascade** = งานง่ายไปรุ่นเล็ก งานยากไปรุ่นใหญ่ + ต้อง eval ตัว router ด้วย
- **Abstraction/Gateway** ลด lock-in ในโค้ด แต่ **prompt, feature, พฤติกรรม ต่างกันจริง** — ทรัพย์สินที่ทำให้ย้ายได้คือ eval set
- **Migration** = deploy ระบบใหม่: re-eval, re-tune prompt, format, cost, rate limit, privacy, shadow → canary → rollback
- **Deprecation** มีวันปิดจริง — pin version, subscribe changelog, อย่าใช้ preview ใน production
- **Self-host** คุ้มเมื่อปริมาณสูงนิ่ง/privacy แข็ง — แลกกับ GPU cost, ops, license

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **โมเดล = พนักงานที่จ้างผ่านเอเจนซี** — เลือกคนให้ตรงงาน จ่ายตามเวลา สัญญามีวันหมด
2. **ถูกที่สุดที่ผ่านเกณฑ์ ชนะ เก่งที่สุด** — hard constraints → eval → cost per task + p95
3. **Leaderboard = เกรดมหาลัย / Eval set = สัมภาษณ์งานจริง** — ตัดสินด้วยอย่างหลังเสมอ
4. **Reasoning เป็นปุ่มต่อ task** ไม่ใช่เปิดทิ้งไว้ — ฉลาดขึ้นแลกกับช้าและแพง
5. **ทุกรุ่นมีวันปิด** — pin version + abstraction บาง + gateway + eval set พร้อมรัน = ย้ายได้ไม่เจ็บ

### Keyword ย่อ

```
Frontier      → ที่ปรึกษาอาวุโส: เก่ง แพง ช้า
Balanced      → พนักงานประจำ: งานหลักของ production
Small/Fast    → พาร์ทไทม์คล่องมือ: งานง่ายปริมาณมาก
Open-weight   → ซื้อตัวมาเอง: คุมข้อมูล ดูแลเอง อ่าน license
Reasoning     → คิดก่อนพูด: แม่นขึ้น แพงขึ้น ช้าลง
Token         → นาทีที่คิดค่าจ้าง (ไทยมักกินเยอะกว่า)
Context       → ขนาดโต๊ะ ≠ อ่านทุกแผ่น
TTFT          → รอจนเห็นคำแรก
Structured    → JSON ตาม schema = reliability
Rate limit    → เพดานต่อนาที ขอก่อนเปิดตัว
Privacy/Region→ อ่านสัญญา ไม่ใช่อ่านข่าว
Marketplace   → จ้างผ่านฝ่ายจัดซื้อเดิม (Azure/Bedrock/Vertex)
Leaderboard   → คัดเข้ารอบ ไม่ใช่ตัดสิน
Eval set      → ข้อสอบจากงานจริง = regression test ของ LLM
Blind         → ซ่อนชื่อรุ่น กันอคติยี่ห้อ
Judge         → LLM ให้คะแนน ต้อง calibrate กับคน
Cost/task     → ตัวเลขที่ธุรกิจเข้าใจ
Cascade       → ง่ายไปเล็ก ยากไปใหญ่
Fallback      → ตัวสำรองเมื่อหลักพัง
Abstraction   → ปลั๊กแปลงไฟ: เสียบได้ ไม่ได้ทำให้เหมือนกัน
Gateway       → HR กลาง: key, budget, log, routing
Alias         → เปลี่ยนใต้เท้า / Pinned → นิ่งแต่มีวันปิด
Deprecation   → สัญญาหมด → re-eval → canary → ย้าย
Self-host     → ซื้อรถเอง: ถูกเมื่อขับเยอะ แพงเมื่อจอดทิ้ง
```

---

[← สารบัญ](./00-README-TOC.md)
