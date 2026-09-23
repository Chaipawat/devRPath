# PART 25 — INTERVIEW MODE

> ตำแหน่งในภาพใหญ่: Practice Layer — ห้องซ้อมก่อนเข้าห้องสัมภาษณ์จริง เอาทุก PART ที่ผ่านมามาแปลงเป็น "คำพูดที่ใช้ตอบได้"

---

## 1. Big Picture

ทุก PART ก่อนหน้านี้สอนให้ "เข้าใจ" — PART นี้สอนให้ "พูดออกมาได้ภายใน 60–90 วินาที"

คนจำนวนมากรู้เรื่องจริง แต่สอบตกเพราะ:

- รู้แต่เรียบเรียงไม่ทัน พูดวน พูดยาว แล้วหลุดประเด็น
- ตอบแค่ definition (What) ไม่ได้บอกว่า "มีไว้ทำไม" (Why) และ "เคยใช้ตอนไหน" (When)
- เจอคำถามที่ไม่เคยทำแล้วเดาแบบมั่ว จนคนสัมภาษณ์เลิกเชื่อคำตอบอื่นที่ตอบถูกไปแล้ว
- ตอบถูกแต่ไม่พูด trade-off เลย ทำให้ดูเหมือนยังไม่เคยเจอ production จริง

**Interview คือการทดสอบ "ความสามารถในการสื่อสาร engineering thinking" ไม่ใช่การทดสอบความจำ**

คนสัมภาษณ์ไม่ได้หาคนที่รู้ทุกอย่าง เขาหาคนที่:

1. รู้ในสิ่งที่บอกว่ารู้ (ไม่โม้)
2. ไม่รู้แล้วบอกว่าไม่รู้ แต่คิดต่อจากหลักการได้
3. ทำงานด้วยแล้วไม่สร้างปัญหาให้ทีม

PART นี้จึงจัดเป็น **คลังคำถาม 15 หมวด แยก 3 ระดับ** พร้อมคำตอบ 2 เวอร์ชัน (junior / mid-level) และ "คำตอบผิดที่คนตอบบ่อย" เพื่อให้ผู้อ่านรู้ว่ากับดักอยู่ตรงไหน

วิธีใช้ chapter นี้ที่ได้ผลที่สุด: **อ่านแค่บรรทัด `Q:` แล้วพูดออกเสียงก่อน** ค่อยเปิดดูเฉลย ถ้าอ่านเฉลยก่อนจะได้แค่ความรู้สึกว่า "ก็รู้อยู่แล้ว" ซึ่งเป็นความรู้สึกที่หลอกที่สุดในการเตรียมสัมภาษณ์

---

## 2. Keywords

| Keyword | จำสั้นๆ | ความหมาย / ใช้ทำไม |
|---|---|---|
| Screening | ด่านคัดออก | คุยสั้น ๆ กับ HR หรือ recruiter เช็คว่าโปรไฟล์ ตำแหน่ง เงินเดือน ตรงกันไหม ก่อนเปลืองเวลา engineer |
| Technical Interview | ด่านวัดของจริง | Engineer ถามเรื่อง technical ตรง ๆ ว่าเข้าใจจริงหรือท่องมา |
| Live Coding | เขียน code ให้ดูสด | วัดวิธีคิดระหว่างทาง มากกว่าวัดว่าโจทย์ผ่านหรือไม่ผ่าน |
| Take-home | โจทย์กลับไปทำ | วัดคุณภาพงานจริง โครงสร้าง project, test, README |
| System Design | ออกแบบระบบ | วัดว่าคิดเรื่อง scale / trade-off / failure เป็นไหม มักถาม mid ขึ้นไป |
| Behavioral | ถามพฤติกรรม | ถามเหตุการณ์ในอดีตเพื่อเดาพฤติกรรมในอนาคต เช่น "เล่าตอนที่ทำ production พัง" |
| Culture Fit | เข้ากับทีมไหม | วัดการสื่อสาร การรับ feedback การทำงานร่วมกัน |
| Expected Concept | สิ่งที่เขาอยากได้ยิน | keyword หรือ mental model ที่ผู้ถามตั้งใจเช็ค ถ้าไม่พูดคำนี้เขามักถือว่ายังไม่ผ่าน |
| Follow-up | คำถามต่อยอด | คำถามที่ตามมาหลังตอบ ใช้วัดว่าเข้าใจจริงหรือท่องมา |
| Signal | สัญญาณให้คะแนน | สิ่งที่ผู้สัมภาษณ์จดลงใบประเมิน เช่น "ถาม requirement ก่อนลงมือ" |
| Red Flag | สัญญาณลบ | พฤติกรรมที่ทำให้ตก เช่น โทษคนอื่น, มั่นใจในเรื่องที่ผิด, ไม่ยอมรับว่าไม่รู้ |
| Trade-off | ได้อย่างเสียอย่าง | หัวใจของคำตอบระดับ mid ขึ้นไป: เลือก A ได้อะไร เสียอะไร |
| STAR | โครงเล่าเรื่อง | Situation → Task → Action → Result ใช้ตอบคำถาม behavioral |
| Scope Question | ถามขอบเขต | คำถามที่เราถามกลับก่อนตอบ เพื่อจำกัดโจทย์ เป็น signal บวกเสมอ |
| Thinking Out Loud | คิดดัง ๆ | พูดกระบวนการคิดออกมา เพื่อให้ผู้สัมภาษณ์เห็นว่าเราคิดอย่างไร ไม่ใช่เงียบแล้วโผล่คำตอบ |
| Debrief | สรุปหลังสัมภาษณ์ | ทีมผู้สัมภาษณ์มาคุยกันว่าให้ผ่านไหม ใช้ note ที่จดระหว่างสัมภาษณ์ |
| Offer | ข้อเสนอจ้างงาน | ด่านสุดท้าย เงินเดือน ตำแหน่ง วันเริ่มงาน |
| Leveling | จัดระดับตำแหน่ง | บริษัทตัดสินว่าเราคือ junior / mid / senior จากคำตอบ ไม่ใช่จากจำนวนปีอย่างเดียว |

---

## 3. Mental Model

มองการสัมภาษณ์เป็น **"การเก็บหลักฐาน" ไม่ใช่ "การสอบข้อเขียน"**

ผู้สัมภาษณ์มีใบประเมินอยู่ในหัว 4 ช่อง และทุกคำตอบของเราคือหลักฐานที่ไปลงช่องใดช่องหนึ่ง

```
             ┌── Technical Depth   → รู้ลึกจริงไหม
คำตอบ 1 ข้อ ─┼── Practical Sense   → เคยเจอของจริงไหม
             ├── Communication     → อธิบายให้คนอื่นเข้าใจได้ไหม
             └── Collaboration     → ทำงานด้วยแล้วสบายใจไหม
```

ให้มองภาพนี้ว่า "หนึ่งคำตอบสามารถลงคะแนนได้หลายช่องพร้อมกัน — คำตอบที่ถูกแต่พูดไม่รู้เรื่องได้แค่ช่องเดียว"

Mental model ที่ต้องติดตัวเข้าห้องสัมภาษณ์:

| มองผิด | มองถูก |
|---|---|
| เขาจับผิดเรา | เขากำลังหาเหตุผลที่จะรับเรา แต่ต้องมีหลักฐาน |
| ต้องตอบให้ครบทุกข้อ | ตอบถูก 7 ข้อแบบลึก ดีกว่าตอบครึ่ง ๆ กลาง ๆ 10 ข้อ |
| ห้ามบอกว่าไม่รู้ | บอกว่าไม่รู้แล้วคิดต่อได้ = คะแนนบวก |
| คำถามยาก = เขาอยากให้ตก | คำถามยาก = เขากำลังหาเพดานของเรา เพื่อจัด level |
| เงียบคิดให้ได้คำตอบสวย ๆ | คิดดัง ๆ ให้เขาเห็นกระบวนการ เพราะเขาให้คะแนนกระบวนการด้วย |

**กฎที่สำคัญที่สุด:** ผู้สัมภาษณ์ที่ถามต่อลึกขึ้นเรื่อย ๆ จนเราตอบไม่ได้ ไม่ได้แปลว่าเราตก — เขาแค่กำลังหา "เพดาน" ของเรา ทุกคนมีเพดาน คนที่ตกคือคนที่ทำเหมือนตัวเองไม่มีเพดาน

---

## 4. ภาพจำ

```
🧠 ภาพจำ:
Interview = การขับรถให้ครูฝึกนั่งข้าง ๆ

ครูฝึกไม่ได้ดูว่ารถถึงที่หมายไหม
ครูฝึกดูว่า "มองกระจกก่อนเปลี่ยนเลนหรือเปล่า"

ถึงที่หมาย แต่ไม่มองกระจก = ตก
ยังไม่ถึงที่หมาย แต่ขับปลอดภัยทุกจังหวะ = ผ่าน

คำถาม
   ↓
กระบวนการคิดที่พูดออกมา   ← ตรงนี้คือคะแนน
   ↓
คำตอบสุดท้าย              ← ตรงนี้แค่ยืนยัน
```

อีกภาพจำหนึ่งสำหรับ "ควรตอบลึกแค่ไหน":

```
🧠 ภาพจำ:
คำตอบ = ภูเขาน้ำแข็ง

พูดออกไป 20%  → นิยาม + ตัวอย่าง + trade-off
เก็บไว้ 80%    → รายละเอียดที่รอ follow-up

ถ้าเทออกหมดในคำถามแรก เขาจะไม่รู้ว่าเรามีอะไรเหลือ
และเราจะไม่มีอะไรตอบตอน follow-up
```

---

## 5. How It Works

### 5.1 โครงสร้างการสัมภาษณ์ที่พบบ่อยที่สุด

```
[APPLY / RESUME]
      ↓
[1. SCREENING]        HR / Recruiter 20–30 นาที
      ↓
[2. TECHNICAL]        Engineer 45–90 นาที (ถาม + อาจ live coding)
      ↓
[3. TAKE-HOME]        (บางที่เท่านั้น) โจทย์กลับไปทำ 2–8 ชม.
      ↓
[4. SYSTEM DESIGN]    (mid ขึ้นไป) ออกแบบระบบบนกระดาน 45–60 นาที
      ↓
[5. CULTURE / MANAGER] คุยกับหัวหน้าทีม / คนในทีม
      ↓
[6. DEBRIEF]          ทีมผู้สัมภาษณ์มาคุยกันว่ารับไหม + level ไหน
      ↓
[7. OFFER]            เงินเดือน / ตำแหน่ง / วันเริ่ม
```

ให้มองภาพนี้ว่า "แต่ละด่านเป็นตะแกรงคนละขนาด — ด่านแรกกรองความเข้ากันได้ ด่านกลางกรองความสามารถ ด่านท้ายกรองความอยากทำงานด้วย"

### 5.2 แต่ละด่านวัดอะไร และคนสัมภาษณ์จดอะไรลงใบประเมิน

| ด่าน | ใครสัมภาษณ์ | วัดอะไรจริง ๆ | สิ่งที่เขาจดลงใบประเมิน |
|---|---|---|---|
| Screening | HR / Recruiter | ตำแหน่งตรงไหม เงินเดือนตรงไหม สื่อสารรู้เรื่องไหม | "อธิบายงานเก่าให้คนไม่ใช่ dev ฟังรู้เรื่อง" |
| Technical | Engineer | รู้จริงหรือท่องมา, ความลึกพอกับ level ไหม | "อธิบาย index ได้ + รู้ว่าทำไมการมี index เยอะเกินจึงแย่" |
| Live Coding | Engineer | วิธีคิด, การถาม requirement, การ debug ตัวเอง | "ถาม edge case ก่อนเขียน", "เจอ bug แล้วไล่ทีละขั้น ไม่สุ่มแก้" |
| Take-home | Engineer | คุณภาพงานจริง, การจัดโครงสร้าง, การเขียน test | "มี README บอกวิธีรัน + มี test ครอบ business logic" |
| System Design | Senior / Lead | คิดเรื่อง scale / failure / trade-off เป็นไหม | "ถาม traffic ก่อนวาด", "พูดถึงตอนที่ cache พัง" |
| Culture / Manager | Hiring Manager | รับ feedback ได้ไหม, โทษคนอื่นไหม, โตต่อได้ไหม | "เล่าเรื่อง production พังโดยไม่โทษใคร + บอกว่าแก้ระบบอย่างไร" |

### 5.3 เกณฑ์ให้คะแนนที่ใช้กันจริง (rubric แบบย่อ)

```
คำตอบหนึ่งข้อ
      ↓
┌─────────────────────────────────────────┐
│ ระดับ 1: ตอบไม่ได้ / ตอบผิดและมั่นใจ     │ ← Red flag
│ ระดับ 2: ตอบได้แต่แค่ definition        │ ← Junior
│ ระดับ 3: definition + ตัวอย่างจากงานจริง │ ← Junior ที่แข็ง
│ ระดับ 4: + trade-off + ตอบ follow-up ได้ │ ← Mid-level
│ ระดับ 5: + เชื่อมกับ system / business  │ ← Senior
└─────────────────────────────────────────┘
```

ให้มองภาพนี้ว่า "ระดับ 3 คือเส้นผ่านของ junior, ระดับ 4 คือเส้นผ่านของ mid — ความต่างคือคำว่า trade-off"

**สิ่งที่ทำให้ขึ้นจากระดับ 2 → 3 คือประโยคเดียวว่า "ตอนทำ project X ผมเจอ..."**
**สิ่งที่ทำให้ขึ้นจากระดับ 3 → 4 คือประโยคเดียวว่า "แต่ถ้าใช้แบบนี้จะแลกกับ..."**

### 5.4 เวลาที่ควรใช้ต่อคำตอบ

| ประเภทคำถาม | เวลาที่เหมาะ | ถ้าเกินจะเกิดอะไร |
|---|---|---|
| นิยามสั้น ("useState คืออะไร") | 20–40 วินาที | ยาวไปดูเหมือนกลบเกลื่อน |
| อธิบาย concept ("อธิบาย event loop") | 60–90 วินาที | เกิน 2 นาทีผู้ฟังเริ่มหลุด |
| เล่าประสบการณ์ (behavioral) | 90–120 วินาที | เกินแล้วจะจับประเด็นไม่ได้ |
| System design | ทั้ง session แต่ต้องมีจังหวะหยุดถาม | ถ้าพูดรวดเดียวจะเป็น monologue ไม่ใช่ design |

---

## 6. Example

> ส่วนนี้คือคลังคำถามหลักของ chapter — 15 หมวด แยก 🟢 Junior / 🟡 Mid-level / 🔴 Senior
> ทุกข้อมี 6 ช่องเหมือนกันหมด อ่านเฉพาะบรรทัด `Q:` ก่อน แล้วพูดออกเสียง ค่อยเปิดเฉลย

วิธีอ่านแต่ละช่อง:

| ช่อง | ใช้ทำอะไรตอนซ้อม |
|---|---|
| Expected Concept | keyword ที่ "ต้องหลุดออกจากปาก" ถ้าไม่พูดคำนี้ ผู้สัมภาษณ์มักถือว่ายังไม่ถึง |
| Short Answer | คำตอบ 20–40 วินาที ผ่านเส้นของ junior |
| Mid-level Answer | คำตอบที่มีบริบท + trade-off ผ่านเส้นของ mid |
| Common Wrong Answer | กับดัก — ถ้าเผลอพูดแบบนี้ ให้รู้ว่าผิดตรงไหน |
| Follow-up | คำถามถัดไปที่ควรเตรียมไว้ในใจ |

---

### 6.1 React

> ทบทวนเนื้อหาเต็มที่ [PART 03 — React](./part-03-react.md)

#### 🟢 Junior

**Q:** Props กับ State ต่างกันอย่างไร

- **Expected Concept:** ข้อมูลไหลทางเดียว (one-way data flow), props เป็นของ parent ส่งลงมา, state เป็นของ component เอง, การเปลี่ยน state ทำให้ re-render
- **Short Answer:** Props คือข้อมูลที่ parent ส่งเข้ามา component ลูกห้ามแก้เอง ส่วน State คือข้อมูลที่ component เป็นเจ้าของและเปลี่ยนได้ผ่าน setter เช่น `setCount` พอ state เปลี่ยน React จะ render component นั้นใหม่
- **Mid-level Answer:** มองว่า props เป็น "input ของฟังก์ชัน" ส่วน state เป็น "ความจำของ component" หลักคิดคือ state ควรอยู่ที่ component ต่ำสุดที่ทุกคนที่ใช้ข้อมูลนั้นเข้าถึงได้ ถ้าลูกสองตัวต้องใช้ข้อมูลเดียวกันก็ยก state ขึ้นไปที่ parent (lifting state up) แล้วส่งลงเป็น props trade-off คือยกขึ้นสูงเกินไปจะเกิด prop drilling และ re-render กว้างขึ้น จึงค่อยพิจารณา Context หรือ state library เมื่อจำเป็นจริง
- **Common Wrong Answer:** "Props แก้ไม่ได้ State แก้ได้" แล้วจบ — ถูกครึ่งเดียว ไม่ได้บอกว่าใครเป็นเจ้าของข้อมูลและการเปลี่ยนแปลงไหลอย่างไร อีกแบบที่ผิดคือบอกว่าแก้ state ตรง ๆ แบบ `state.count++` ได้ ซึ่ง React จะไม่รู้ว่าต้อง render ใหม่
- **Follow-up:** ถ้าลูกอยากเปลี่ยนค่าที่อยู่ใน parent ทำอย่างไร (ส่ง callback ลงไปเป็น props) / derived state คืออะไร ทำไมไม่ควรเก็บซ้ำใน state

**Q:** ทำไมต้องใส่ `key` เวลา render list และทำไมไม่ควรใช้ index

- **Expected Concept:** reconciliation, identity ของ element, การจับคู่ element เก่ากับใหม่
- **Short Answer:** `key` ช่วยให้ React รู้ว่า item ไหนเป็นตัวเดิม ตัวไหนเพิ่ม ตัวไหนลบ ควรใช้ id ที่ไม่ซ้ำและไม่เปลี่ยน เช่น id จาก database
- **Mid-level Answer:** ตอน render ใหม่ React เทียบ tree เก่ากับใหม่ ถ้าใช้ index เป็น key แล้ว list ถูกแทรก ลบ หรือเรียงใหม่ ตำแหน่งจะเลื่อน React จะคิดว่า item เดิมถูกแก้ไข ผลคือ state ภายในลูก เช่น ค่าใน input หรือ checkbox ไปติดผิดแถว index ใช้ได้เมื่อ list ไม่มีวันเปลี่ยนลำดับและไม่มี state ภายในแถว
- **Common Wrong Answer:** "ใส่เพื่อไม่ให้ console warning" หรือ "ใส่เพื่อให้เร็วขึ้น" — เรื่องหลักคือความถูกต้องของ identity ไม่ใช่ความเร็ว และการใช้ `Math.random()` เป็น key ผิดหนักกว่า index เพราะทุก render จะได้ element ใหม่หมด state หายทุกครั้ง
- **Follow-up:** เคยเจอ bug จาก key ไหม / ถ้าข้อมูลไม่มี id จะทำอย่างไร / เปลี่ยน key เพื่อ reset state ของ component ได้ไหม (ได้ เป็นเทคนิคที่ใช้จริง)

#### 🟡 Mid-level

**Q:** อธิบาย dependency array ของ `useEffect` และ cleanup function ใช้เมื่อไร

- **Expected Concept:** effect = sync กับระบบภายนอก, dependency array คือค่าที่ effect อ่าน, cleanup รันก่อน effect รอบถัดไปและตอน unmount, stale closure
- **Short Answer:** ไม่ใส่ array = รันทุก render, ใส่ `[]` = รันหลัง mount ครั้งเดียว, ใส่ `[a, b]` = รันเมื่อ a หรือ b เปลี่ยน ส่วน cleanup ใช้ยกเลิกสิ่งที่ effect สร้างไว้ เช่น clearInterval, removeEventListener, ยกเลิก request
- **Mid-level Answer:** มอง `useEffect` ว่าเป็นเครื่องมือ "sync component กับของนอก React" ไม่ใช่ lifecycle hook ดังนั้น dependency ต้องใส่ทุกค่าที่ effect อ่าน ถ้าไม่ใส่จะเกิด stale closure คืออ่านค่าเก่าค้าง cleanup สำคัญมากตอน fetch ข้อมูลตาม id ถ้าเปลี่ยน id เร็ว ๆ response เก่าอาจมาทีหลังแล้วทับข้อมูลใหม่ จึงต้องยกเลิกด้วย AbortController หรือ flag ใน cleanup และใน development ที่เปิด StrictMode React จะ mount → unmount → mount ซ้ำเพื่อช่วยจับ effect ที่ไม่มี cleanup
- **Common Wrong Answer:** "ใส่ `[]` ไว้ก่อนจะได้รันครั้งเดียว แล้วปิด eslint warning" — นี่คือต้นเหตุ stale closure อันดับหนึ่ง อีกข้อที่ผิดคือบอกว่า StrictMode ทำให้ production รัน effect สองรอบ จริง ๆ เกิดแค่ใน development
- **Follow-up:** ถ้า dependency เป็น object หรือ function ที่สร้างใหม่ทุก render จะเกิดอะไร / race condition ตอน fetch แก้อย่างไร / อะไรบ้างที่ไม่ควรอยู่ใน `useEffect` เลย (เช่น คำนวณค่าจาก props)

**Q:** Component re-render เมื่อไร และ `React.memo` / `useMemo` / `useCallback` ช่วยอะไร

- **Expected Concept:** re-render เกิดเมื่อ state ของตัวเองเปลี่ยน, parent re-render, context ที่ใช้อยู่เปลี่ยน; referential equality; memo มีต้นทุน
- **Short Answer:** Component render ใหม่เมื่อ state ตัวเองเปลี่ยน, parent render ใหม่ หรือ context ที่ใช้อยู่เปลี่ยน `React.memo` ข้ามการ render ถ้า props เหมือนเดิม `useMemo` จำผลคำนวณ `useCallback` จำ function ไว้ไม่ให้สร้างใหม่ทุกรอบ
- **Mid-level Answer:** `React.memo` เทียบ props แบบ shallow ถ้าส่ง object หรือ function ที่สร้างใหม่ทุก render ลงไป memo จะไร้ผล จึงต้องใช้ `useMemo`/`useCallback` ช่วยให้ reference คงที่ ทั้งสามตัวมีต้นทุนเรื่องความจำและความซับซ้อนของ code จึงควรใช้หลังวัดด้วย React DevTools Profiler แล้วเจอ component ที่ render แพงหรือบ่อยจริง บางครั้งวิธีที่ดีกว่าคือย้าย state ลงไปใกล้ที่ใช้ หรือส่ง children เข้ามาแทน เพื่อไม่ให้ส่วนใหญ่ของ tree ต้อง render ตาม
- **Common Wrong Answer:** "ใส่ `useMemo` ทุกที่จะเร็วขึ้น" — ผิด เพราะเพิ่ม overhead และทำให้ code อ่านยาก อีกข้อคือ "re-render แปลว่า DOM ถูกเขียนใหม่" ผิด เพราะ React render แล้วเทียบก่อน DOM จะถูกแก้เฉพาะจุดที่ต่าง
- **Follow-up:** จะรู้ได้อย่างไรว่า component ไหน render บ่อยเกิน / Context ที่เก็บค่าเยอะ ๆ ทำให้ช้าได้อย่างไร แก้ยังไง

#### 🔴 Senior

**Q:** หน้า dashboard React ช้ามาก ผู้ใช้บ่นว่ากดแล้วค้าง คุณจะไล่หาสาเหตุและวางแนวทางแก้อย่างไร

- **Expected Concept:** วัดก่อนแก้ (Profiler, Performance tab), แยกปัญหา network / JS execution / rendering, server state vs client state, list virtualization, code splitting
- **Short Answer:** เปิด React DevTools Profiler ดูว่า component ไหน render นานหรือบ่อย เปิด Network tab ดูว่ารอ API หรือเปล่า แล้วแก้จุดที่หนักที่สุดก่อน เช่น list ยาวใช้ virtualization, state ที่อยู่สูงเกินไปก็ย้ายลงมา
- **Mid-level Answer:** แยกก่อนว่า "ช้า" คือแบบไหน: โหลดครั้งแรกช้า (bundle ใหญ่ → code splitting, lazy load), กดแล้วค้าง (main thread ถูก block → ดู long task ใน Performance tab), หรือรอข้อมูล (API ช้า → ต้องไปแก้ backend หรือ cache) ปัญหาที่เจอบ่อยในระดับ architecture คือเอาข้อมูลจาก server ไปเก็บใน global state แล้วทุกอย่าง re-render ตาม การแยก server state ไปใช้เครื่องมืออย่าง TanStack Query ที่มี cache และ deduplicate ให้ แล้วเหลือ client state เฉพาะของ UI จะลดทั้ง bug และ render ที่ไม่จำเป็น สำหรับงานที่ต้องพิมพ์แล้ว filter list ใหญ่ ใช้ `useDeferredValue` หรือ `useTransition` ให้ input ตอบสนองก่อนได้ trade-off ของทุกทางคือความซับซ้อน จึงต้องมีตัวเลขก่อนและหลังแก้เสมอ
- **Common Wrong Answer:** "ใส่ `useMemo` ทุก component" หรือ "ย้ายไป framework อื่น" ทั้งที่ยังไม่ได้วัด — ผู้สัมภาษณ์ระดับ senior ต้องการเห็นกระบวนการ วัด → หาคอขวด → แก้ → วัดซ้ำ ไม่ใช่รายการเทคนิคที่จำมา
- **Follow-up:** ถ้า Profiler บอกว่า render เร็ว แต่ผู้ใช้ยังบอกว่าช้า จะดูอะไรต่อ / จะป้องกันไม่ให้ performance ถอยหลังอีกได้อย่างไร (performance budget, วัดใน CI, ติด monitoring ฝั่งผู้ใช้จริง)

---

### 6.2 Next.js

> ทบทวนเนื้อหาเต็มที่ [PART 04 — Next.js](./part-04-nextjs.md)

#### 🟢 Junior

**Q:** CSR, SSR และ SSG ต่างกันอย่างไร

- **Expected Concept:** HTML ถูกสร้างที่ไหนและเมื่อไร (browser / server ต่อ request / ตอน build), ผลต่อ SEO และความสดของข้อมูล
- **Short Answer:** CSR สร้างหน้าใน browser ด้วย JavaScript, SSR ให้ server สร้าง HTML ใหม่ทุก request, SSG สร้าง HTML ไว้ตั้งแต่ตอน build แล้วส่งไฟล์เดิมให้ทุกคน
- **Mid-level Answer:** เลือกจากคำถามสองข้อ "ข้อมูลเปลี่ยนบ่อยแค่ไหน" และ "ต้องการ SEO ไหม" หน้า blog หรือ marketing ใช้ SSG เพราะเร็วและวางบน CDN ได้ หน้าที่ข้อมูลเฉพาะผู้ใช้หรือเปลี่ยนตลอดใช้ SSR ซึ่งแลกกับภาระ server และ TTFB ที่ขึ้นกับความเร็ว backend ส่วน dashboard หลัง login ที่ไม่ต้อง SEO ใช้ CSR ได้ และยังมี ISR ที่อยู่ตรงกลาง คือ static แต่สร้างใหม่ตามรอบเวลาหรือเมื่อสั่ง revalidate
- **Common Wrong Answer:** "SSR ดีกว่าเสมอเพราะ SEO ดี" — ไม่มี context SSR ทุก request มีต้นทุน server และถ้า backend ช้า หน้าก็ช้าตาม อีกข้อที่ผิดคือ "SSG แก้ข้อมูลไม่ได้เลยจนกว่าจะ build ใหม่" ซึ่งไม่จริงถ้าใช้ ISR/revalidate
- **Follow-up:** หน้า product ของ e-commerce จะเลือกแบบไหน / hydration คืออะไร

**Q:** ทำไมถึงเลือกใช้ Next.js แทน React เปล่า ๆ

- **Expected Concept:** React เป็น UI library, Next.js เป็น framework ที่เพิ่ม routing, rendering strategy, data fetching, build optimization
- **Short Answer:** React จัดการแค่ UI ส่วน Next.js เพิ่ม file-based routing, SSR/SSG, API route, การ optimize รูปและ font มาให้ ทำให้ไม่ต้องประกอบเครื่องมือเองหลายตัว
- **Mid-level Answer:** เหตุผลหลักคือได้ทางเลือก render ต่อหน้า (บางหน้า static บางหน้า dynamic) ซึ่งช่วยทั้ง SEO และความเร็วโหลดครั้งแรก แต่แลกกับการต้องเข้าใจว่า code ส่วนไหนรันบน server ส่วนไหนรันบน browser และต้องมีที่ deploy ที่รัน Node ได้ถ้าใช้ SSR ถ้าเป็นแอปภายในหลัง login ทั้งหมดที่ไม่ต้อง SEO React + Vite อาจเรียบง่ายกว่า
- **Common Wrong Answer:** "Next.js เร็วกว่า React" — เทียบกันไม่ได้ตรง ๆ เพราะ Next.js ก็ใช้ React ความเร็วมาจากการเลือก rendering strategy ให้เหมาะ ไม่ได้มาจากชื่อ framework
- **Follow-up:** Next.js deploy แบบ static export ได้ไหม ข้อจำกัดคืออะไร / API route ใน Next.js ควรใช้แทน backend จริงไหม

#### 🟡 Mid-level

**Q:** Server Component กับ Client Component ต่างกันอย่างไร เลือกอย่างไร

- **Expected Concept:** App Router ใช้ Server Component เป็นค่าเริ่มต้น, `'use client'` คือเส้นแบ่ง, Server Component ใช้ state/effect/event handler ไม่ได้ แต่เข้าถึงข้อมูลฝั่ง server ได้และไม่ส่ง JS ของตัวเองไป browser
- **Short Answer:** Server Component render บน server ดึงข้อมูลจาก database หรือ API ได้ตรง ๆ และไม่เพิ่ม JavaScript ฝั่ง browser ส่วน Client Component ใส่ `'use client'` ไว้บนสุด ใช้ `useState`, `onClick` ได้ ใช้กับส่วนที่ต้องโต้ตอบ
- **Mid-level Answer:** หลักคิดคือให้ส่วนใหญ่เป็น Server Component แล้ว "ผลัก" `'use client'` ลงไปที่ใบของ tree ให้ต่ำที่สุด เช่น หน้า product ทั้งหน้าเป็น server แต่ปุ่ม Add to Cart เป็น client เพราะไฟล์ที่มี `'use client'` และทุกอย่างที่มัน import จะถูกรวมเข้า bundle ฝั่ง browser ข้อควรระวังคือ props ที่ส่งจาก server ไป client ต้อง serialize ได้ ส่ง function ธรรมดาไม่ได้ และต้องระวังไม่ให้ secret หรือ logic ฝั่ง server หลุดเข้าไฟล์ที่ถูก import จาก client
- **Common Wrong Answer:** "Server Component คือ SSR" — ไม่เหมือนกัน Client Component ก็ถูก pre-render เป็น HTML บน server ได้ (SSR) แล้วค่อย hydrate ความต่างคือ Server Component ไม่มี JS ของตัวเองส่งไป hydrate เลย
- **Follow-up:** ส่ง Server Component เป็น children ของ Client Component ได้ไหม (ได้ ผ่าน children/props) / hydration mismatch เกิดจากอะไร

**Q:** Caching และ revalidation ใน Next.js ทำงานอย่างไร เคยเจอปัญหาข้อมูลไม่อัปเดตไหม

- **Expected Concept:** มีหลายชั้น cache (data, rendered route, router cache ฝั่ง client), time-based vs on-demand revalidation, default เปลี่ยนตาม version
- **Short Answer:** Next.js cache ผลการ fetch และหน้าที่ render ไว้ได้ ถ้าอยากให้อัปเดตตามเวลาใช้ revalidate เป็นวินาที ถ้าอยากให้อัปเดตทันทีหลังแก้ข้อมูลใช้ `revalidatePath` หรือ `revalidateTag`
- **Mid-level Answer:** ปัญหา "แก้ข้อมูลใน admin แล้วหน้าเว็บไม่เปลี่ยน" มักเกิดจากหน้าถูก cache เป็น static โดยไม่รู้ตัว วิธีที่ใช้จริงคือ tag ข้อมูลตอน fetch แล้วเรียก `revalidateTag` หลัง mutation เพื่อล้างเฉพาะส่วนที่เกี่ยวข้อง trade-off คือ time-based ง่ายแต่ข้อมูลเก่าได้ถึงรอบเวลา ส่วน on-demand สดกว่าแต่ต้องจำให้เรียกทุกจุดที่แก้ข้อมูล อีกเรื่องที่ต้องพูดคือค่า default ของ caching เคยเปลี่ยนระหว่าง major version ดังนั้นต้องเช็ค docs ของ version ที่ project ใช้จริง ไม่ควรจำค่า default ข้าม version
- **Common Wrong Answer:** "ปิด cache ทุกหน้าไปเลยจะได้ไม่มีปัญหา" — แก้อาการแต่ทิ้งข้อดีหลักของ framework ภาระ server และ database จะเพิ่มทันที
- **Follow-up:** ข้อมูลเฉพาะผู้ใช้ (เช่น ตะกร้า) ถูก cache แล้วคนอื่นเห็นได้ไหม ป้องกันยังไง / cache ตั้งอยู่ที่ไหนบ้างถ้า deploy หลาย instance

#### 🔴 Senior

**Q:** ออกแบบหน้า product ของ e-commerce ที่มีสินค้าหลักแสนรายการด้วย Next.js — ส่วนไหน static ส่วนไหน dynamic

- **Expected Concept:** แยกข้อมูลตามความถี่การเปลี่ยนและความเป็นส่วนตัว, ISR + on-demand revalidate, ไม่ pre-build ทุกหน้า, ราคา/สต็อกแยก fetch, CDN
- **Short Answer:** รายละเอียดสินค้าและรูปเปลี่ยนไม่บ่อย ทำเป็น static แบบ ISR ส่วนราคาและสต็อกที่เปลี่ยนบ่อยดึงแยก ส่วนตะกร้าและข้อมูลผู้ใช้เป็น dynamic หรือฝั่ง client
- **Mid-level Answer:** เริ่มจากถาม traffic และความถี่การเปลี่ยนข้อมูลก่อน แล้วแบ่งเป็นสามชั้น: (1) เนื้อหาสินค้า pre-build เฉพาะสินค้ายอดนิยม ที่เหลือสร้างตอนมีคนเข้าครั้งแรกแล้ว cache ไว้ เพราะ build แสนหน้าทุก deploy ช้าเกินไป (2) ราคาและสต็อกที่ต้องสดเกือบ real-time ดึงแบบ dynamic หรือ stream แยกส่วน เพื่อไม่ให้ทั้งหน้าต้อง dynamic ตาม (3) ข้อมูลส่วนตัวต้องไม่อยู่ใน cache ที่แชร์กัน เมื่อ admin แก้สินค้าให้ส่ง webhook มาเรียก revalidate เฉพาะ tag ของสินค้านั้น trade-off คือระบบซับซ้อนขึ้นและต้องมี monitoring ว่า revalidate ล้มเหลวไหม และต้องยอมรับว่าราคาที่แสดงอาจช้ากว่าจริงเล็กน้อย จึงต้องเช็คราคาและสต็อกซ้ำตอน checkout ฝั่ง server เสมอ
- **Common Wrong Answer:** "ใช้ SSR ทั้งหน้าจะได้สดเสมอ" — ทุก request วิ่งถึง database ช่วง sale คนเข้าพร้อมกันระบบจะล่ม หรือ "SSG ทุกหน้าตอน build" ซึ่ง build time จะยาวมากและราคาเก่าจนกว่า deploy ใหม่
- **Follow-up:** ถ้า revalidate ล้มเหลวแล้วราคาผิดแสดงอยู่ครึ่งวันจะรู้ได้อย่างไร / ช่วง flash sale traffic 50 เท่าจะเตรียมอะไร

---

### 6.3 Node.js

> ทบทวนเนื้อหาเต็มที่ [PART 05 — Node.js](./part-05-nodejs.md)

#### 🟢 Junior

**Q:** Node.js เป็น single-threaded แล้วรับ request พร้อมกันหลายตัวได้อย่างไร

- **Expected Concept:** JavaScript รันบน thread เดียว, event loop, non-blocking I/O, งาน I/O ถูกส่งให้ OS หรือ thread pool ของ libuv
- **Short Answer:** Code JavaScript รันบน thread เดียวก็จริง แต่งาน I/O เช่น อ่านไฟล์ เรียก database ไม่ต้องรอ Node ส่งงานออกไปแล้วไปทำ request อื่นต่อ พองานเสร็จ callback จะถูกเข้าคิวให้ event loop หยิบมารัน
- **Mid-level Answer:** เพราะเวลาส่วนใหญ่ของ web server คือ "รอ" database หรือ network Node จึงรับได้หลาย request ด้วย thread เดียวโดยไม่ต้องสร้าง thread ต่อ request งาน network ใช้กลไก async ของ OS ส่วนงานบางประเภท เช่น file system, crypto บางตัว, DNS lookup ใช้ thread pool ของ libuv แต่จุดอ่อนคือถ้ามี code JavaScript ที่คำนวณหนัก ๆ นาน ๆ ทุก request จะรอหมด เพราะ thread ที่รัน JS มีตัวเดียว
- **Common Wrong Answer:** "Node เป็น multi-thread อยู่แล้ว เลยไม่มีปัญหาเรื่องงานหนัก" หรือตรงข้าม "Node ทำได้ทีละ request" — ทั้งสองผิด มันทำหลาย request พร้อมกันได้ในแง่ concurrency แต่ไม่ได้รัน JS ขนานกันใน thread เดียว
- **Follow-up:** อะไรทำให้ event loop ถูก block / concurrency กับ parallelism ต่างกันอย่างไร

**Q:** `dependencies` กับ `devDependencies` ต่างกันอย่างไร และ `package-lock.json` มีไว้ทำไม

- **Expected Concept:** ของที่ต้องใช้ตอนรันจริง vs ของที่ใช้ตอนพัฒนา/build, semver range, lock file ทำให้ install ได้ version เดิมทุกเครื่อง
- **Short Answer:** `dependencies` คือ package ที่ต้องใช้ตอนแอปรันจริง `devDependencies` ใช้แค่ตอนพัฒนา เช่น test framework, linter ส่วน lock file จด version ที่ติดตั้งจริงไว้ ทำให้ทุกคนและ CI ได้ version เดียวกัน
- **Mid-level Answer:** ใน `package.json` มักเขียนเป็น range เช่น `^1.2.0` ซึ่งยอมรับ minor/patch ที่ใหม่กว่า ถ้าไม่มี lock file สองเครื่องอาจได้ version ต่างกันแล้วเกิด "เครื่องผมรันได้" ใน CI จึงควรใช้ `npm ci` ซึ่งติดตั้งตาม lock file ตรง ๆ และ fail ถ้า lock ไม่ตรงกับ package.json ส่วนการแยก devDependencies ช่วยให้ production image เล็กลงเมื่อติดตั้งเฉพาะ production dependencies
- **Common Wrong Answer:** "lock file ไม่ต้อง commit เพราะ generate ใหม่ได้" — ผิด สำหรับแอป lock file ต้อง commit ไม่อย่างนั้นเสียความสามารถในการ build ซ้ำได้เหมือนเดิม
- **Follow-up:** `npm install` กับ `npm ci` ต่างกันอย่างไร / จะจัดการ security vulnerability ใน dependency อย่างไร

#### 🟡 Mid-level

**Q:** ถ้ามี endpoint ที่ต้องคำนวณหนัก ๆ (เช่น resize รูป, generate report) แล้วทำให้ API อื่นช้าไปด้วย จะแก้อย่างไร

- **Expected Concept:** CPU-bound task block event loop, worker_threads, แยกไปทำเป็น background job ผ่าน queue, scale process
- **Short Answer:** งานที่ใช้ CPU หนักจะ block event loop ทำให้ทุก request รอ แก้โดยย้ายงานออกไปทำที่อื่น เช่น worker thread หรือส่งเข้า queue ให้ worker process ทำ
- **Mid-level Answer:** เลือกตามลักษณะงาน: ถ้าต้องได้ผลทันทีและใช้เวลาไม่นาน ใช้ `worker_threads` ให้คำนวณบน thread อื่นแล้วส่งผลกลับมา ถ้าใช้เวลานานหรือผู้ใช้ไม่ต้องรอ เช่น generate report ให้ตอบ `202 Accepted` พร้อม job id แล้วส่งงานเข้า queue ให้ worker แยกทำ แล้วแจ้งผลทีหลัง วิธีหลังทน traffic พุ่งได้ดีกว่าและ retry ได้ แต่แลกกับระบบที่ซับซ้อนขึ้น ต้องมี queue, job status และ monitoring การใช้ cluster หรือเพิ่ม instance ช่วยเพิ่ม throughput ได้ แต่ถ้ายังคำนวณหนักใน process ที่รับ request ทุก instance ก็ยังโดน block เป็นช่วง ๆ
- **Common Wrong Answer:** "ครอบด้วย `async` / Promise ก็หายแล้ว" — ผิดชัดเจน การใส่ `async` ไม่ได้ย้ายงานไป thread อื่น loop คำนวณใน async function ก็ยัง block event loop เหมือนเดิม
- **Follow-up:** จะวัดได้อย่างไรว่า event loop ถูก block (event loop lag / delay) / worker_threads กับ child_process ต่างกันอย่างไร

**Q:** Stream ใน Node.js คืออะไร ทำไมควรใช้ตอนส่งไฟล์ใหญ่

- **Expected Concept:** อ่าน/เขียนเป็นชิ้น (chunk) แทนโหลดทั้งก้อนเข้า memory, pipe, backpressure
- **Short Answer:** Stream คือการส่งข้อมูลทีละชิ้น แทนที่จะอ่านไฟล์ทั้งไฟล์เข้า memory ก่อน ทำให้ส่งไฟล์ใหญ่ได้โดยใช้ memory น้อยและผู้รับเริ่มได้ข้อมูลเร็วขึ้น
- **Mid-level Answer:** ถ้าใช้วิธีอ่านทั้งไฟล์แล้วส่ง ไฟล์ 1GB กับผู้ใช้ 10 คนพร้อมกัน memory จะพุ่งจน process ล่ม stream แก้ด้วยการส่งเป็น chunk และมีกลไก backpressure คือถ้าฝั่งผู้รับช้า ฝั่งอ่านจะชะลอตาม ไม่ให้ข้อมูลกองใน memory ควรใช้ `pipeline` ซึ่งจัดการ error และปิด stream ทุกตัวให้เมื่อมีตัวใดพัง ใช้บ่อยกับ download/upload ไฟล์, export CSV จาก database, proxy ข้อมูล
- **Common Wrong Answer:** "Stream ทำให้เร็วขึ้นเสมอ" — ประโยชน์หลักคือคุม memory และเริ่มส่งได้ก่อน ไม่ใช่ความเร็วรวมเสมอไป และการใช้ `.pipe()` เปล่า ๆ โดยไม่จัดการ error อาจทำให้ stream ค้างหรือ resource รั่ว
- **Follow-up:** backpressure คืออะไร ถ้าไม่มีจะเกิดอะไร / จะ export ข้อมูลล้านแถวเป็น CSV อย่างไรไม่ให้ memory เต็ม

#### 🔴 Senior

**Q:** Node service บน production ใช้ memory เพิ่มขึ้นเรื่อย ๆ จนถูก restart ทุกไม่กี่ชั่วโมง จะไล่อย่างไร

- **Expected Concept:** แยก memory leak ออกจาก load ที่เพิ่มขึ้น, heap snapshot เทียบกัน, สาเหตุที่พบบ่อย (cache ไม่มีขอบเขต, event listener ไม่ถูกถอด, timer, closure ที่จับ object ใหญ่), mitigation ระหว่างหา
- **Short Answer:** ดู graph memory ว่าขึ้นแบบขั้นบันไดไม่ลงเลยหรือขึ้นตาม traffic ถ้าไม่ลงเลยน่าจะ leak จากนั้นเก็บ heap snapshot สองช่วงเวลามาเทียบว่า object ประเภทไหนเพิ่มขึ้น
- **Mid-level Answer:** ขั้นแรก mitigate ก่อนเพื่อหยุดผลกระทบ เช่น เพิ่ม replica หรือตั้ง restart ก่อนถึงขีดจำกัด แล้วค่อยหาต้นเหตุ ดูว่าเริ่มหลัง deploy ไหนเพื่อจำกัดขอบเขต code ที่เปลี่ยน จากนั้น reproduce ใน staging ด้วย load test แล้วเก็บ heap snapshot หลายจุดมาเทียบใน Chrome DevTools หา object ที่เพิ่มแล้วไม่ถูกเก็บ และดู retainer ว่าใครถือ reference อยู่ สาเหตุที่เจอบ่อยคือ in-memory cache ที่ไม่มี TTL หรือขนาดสูงสุด, event listener ที่ add ทุก request แต่ไม่ remove, setInterval ที่ไม่ clear, และการเก็บ request object ไว้ใน array แก้แล้วต้องเพิ่ม metric เฝ้า heap และตั้ง alert เพื่อรู้ตัวก่อนครั้งหน้า
- **Common Wrong Answer:** "เพิ่ม `--max-old-space-size` ให้สูงขึ้นก็จบ" — เป็นแค่การยืดเวลาก่อนพัง ถ้าเป็น leak จริงจะพังเหมือนเดิมแค่ช้าลง และอาจทำให้ GC หยุดนานขึ้นด้วย
- **Follow-up:** ถ้า heap ปกติแต่ RSS ยังขึ้น เป็นไปได้จากอะไร (Buffer, native memory นอก heap) / จะเก็บ heap snapshot บน production อย่างปลอดภัยได้อย่างไร (ทำให้ process หยุดชั่วคราวและใช้ memory เพิ่ม)

---

### 6.4 Express

> ทบทวนเนื้อหาเต็มที่ [PART 06 — Express](./part-06-express.md)

#### 🟢 Junior

**Q:** Middleware ใน Express คืออะไร และ `next()` ทำอะไร

- **Expected Concept:** function ที่ได้ `req, res, next`, ทำงานเป็นลำดับตามที่ประกาศ, ต้องจบ response หรือเรียก `next()`
- **Short Answer:** Middleware คือ function ที่อยู่ระหว่าง request กับ route handler ใช้ทำงานร่วม เช่น log, parse body, เช็ค login พอทำเสร็จต้องเรียก `next()` เพื่อส่งต่อ หรือส่ง response กลับไปเลย
- **Mid-level Answer:** Express เรียง middleware ตามลำดับที่ `app.use` ดังนั้นลำดับสำคัญมาก เช่น `express.json()` ต้องมาก่อน route ที่อ่าน `req.body` และ auth middleware ต้องมาก่อน route ที่ต้องป้องกัน ถ้า middleware ไม่เรียก `next()` และไม่ส่ง response request จะค้างจนหมดเวลา ถ้าเรียก `next(err)` Express จะข้ามไปหา error handler
- **Common Wrong Answer:** "Middleware คือ library เสริม" — สับสนระหว่าง package กับ concept middleware คือรูปแบบ function ใน pipeline หรืออีกแบบคือเรียกทั้ง `res.send()` แล้วยัง `next()` ต่อ ซึ่งจะเจอ error ส่ง header ซ้ำ
- **Follow-up:** จะใส่ middleware เฉพาะบาง route อย่างไร / ทำไม `req.body` ถึงเป็น `undefined`

**Q:** `req.params`, `req.query`, `req.body` ต่างกันอย่างไร

- **Expected Concept:** ตำแหน่งของข้อมูลใน HTTP request (path, query string, body), body ต้องมี parser
- **Short Answer:** `params` มาจาก path เช่น `/users/:id`, `query` มาจากหลังเครื่องหมาย `?` เช่น `?page=2`, `body` มาจากเนื้อหา request ของ POST/PUT และต้องใช้ `express.json()` ก่อนถึงจะอ่านได้
- **Mid-level Answer:** แนวปฏิบัติคือใช้ params ระบุ resource ตัวไหน ใช้ query สำหรับ filter/sort/pagination และใช้ body สำหรับข้อมูลที่จะสร้างหรือแก้ ทุกค่าจาก params และ query เป็น string เสมอ ต้องแปลงและ validate เอง และทั้งสามอย่างเป็นข้อมูลที่ผู้ใช้ควบคุมได้ จึงต้อง validate ด้วย schema ก่อนใช้ทุกครั้ง
- **Common Wrong Answer:** "ส่ง password ผ่าน query ก็ได้เพราะเป็น HTTPS" — HTTPS เข้ารหัสระหว่างทางก็จริง แต่ URL มักถูกเก็บใน log ของ server, proxy และ history ของ browser ข้อมูลลับจึงควรอยู่ใน body
- **Follow-up:** ถ้า `req.query.page` ไม่ใช่ตัวเลขจะเกิดอะไร / validate input ด้วยอะไร

#### 🟡 Mid-level

**Q:** จัดการ error ใน Express อย่างไรให้เป็นระบบ โดยเฉพาะ error จาก async function

- **Expected Concept:** error-handling middleware มี 4 argument, ประกาศไว้ท้ายสุด, Express 4 ไม่จับ rejected promise อัตโนมัติ ส่วน Express 5 ส่งต่อให้, แยก operational error กับ bug
- **Short Answer:** สร้าง middleware ที่รับ `(err, req, res, next)` วางไว้ท้ายสุด แล้วใน route ให้ส่ง error ด้วย `next(err)` จะได้จัดรูปแบบ response error ที่เดียว
- **Mid-level Answer:** ใน Express 4 ถ้า async handler throw หรือ promise reject โดยไม่ catch Express จะไม่ส่งไปที่ error handler ให้ ต้องครอบด้วย try/catch หรือ wrapper ที่เรียก `next(err)` ส่วน Express 5 จะส่ง rejected promise ไปให้ error handler เอง ในทางปฏิบัติควรมี error class ของเราเอง เช่น NotFound, Validation ที่มี status code ติดมา error handler จะ map เป็น response ที่สม่ำเสมอ log รายละเอียดพร้อม request id ไว้ฝั่ง server แต่ไม่ส่ง stack trace ให้ client บน production
- **Common Wrong Answer:** "ใส่ try/catch ในทุก route แล้ว `res.status(500).send(err)`" — กระจายการจัดการ error ไปทุกที่ response ไม่สม่ำเสมอ และส่ง error object ดิบให้ client อาจทำให้ข้อมูลภายในรั่ว
- **Follow-up:** error แบบไหนควรทำให้ process ตายแล้ว restart / `unhandledRejection` ควรจัดการอย่างไร

**Q:** จะจัดโครงสร้าง Express project ที่โตขึ้นเรื่อย ๆ อย่างไร

- **Expected Concept:** แยก layer: route → controller → service → repository, separation of concerns, test ได้ง่าย
- **Short Answer:** แยก route ไว้กำหนด path, controller อ่าน request และส่ง response, service เก็บ business logic, repository คุยกับ database
- **Mid-level Answer:** เป้าหมายคือให้ business logic ไม่ผูกกับ HTTP และ database ตรง ๆ เพื่อเรียกใช้ซ้ำได้ (เช่น ใช้ใน cron job) และ test ได้โดยไม่ต้องยิง HTTP พอ project ใหญ่ขึ้นมักจัดตาม feature (users/, orders/) แทนจัดตามประเภทไฟล์ เพราะแก้ feature หนึ่งจะอยู่ในโฟลเดอร์เดียว trade-off คือ project เล็กมากแยกหลาย layer จะดูเกินจำเป็น จึงควรเริ่มเรียบง่ายแล้วแยกเมื่อ logic เริ่มซับซ้อน
- **Common Wrong Answer:** "เขียนทุกอย่างใน route handler ก็พอ เร็วดี" — ใช้ได้ตอนเริ่ม แต่พอ logic ซ้ำกันหลายที่และต้องเขียน test จะต้องยิง HTTP และมี database จริงทุกครั้ง
- **Follow-up:** จะ inject dependency (เช่น database client) เข้า service อย่างไรให้ mock ได้ / validation ควรอยู่ layer ไหน

#### 🔴 Senior

**Q:** ต้องทำ rate limiting ให้ API ที่รันอยู่ 5 instance หลัง load balancer จะออกแบบอย่างไร

- **Expected Concept:** in-memory counter ไม่ใช้ร่วมกันข้าม instance, shared store (เช่น Redis), เลือก key (IP / user / API key), algorithm (fixed window / sliding window / token bucket), ตำแหน่งที่วาง (gateway vs app)
- **Short Answer:** ถ้าเก็บ counter ใน memory ของแต่ละ instance ผู้ใช้จะได้ limit คูณ 5 เพราะ request กระจายไปหลายเครื่อง ต้องเก็บ counter ไว้ที่ที่ใช้ร่วมกัน เช่น Redis
- **Mid-level Answer:** ออกแบบสามเรื่อง: (1) นับที่ไหน — Redis ที่ทุก instance เข้าถึงได้ ใช้คำสั่งแบบ atomic เพื่อไม่ให้นับพลาดเมื่อ request มาพร้อมกัน หรือย้ายไปทำที่ API gateway / reverse proxy ถ้ามี (2) นับตามอะไร — IP ใช้ได้กับ endpoint สาธารณะ แต่คนหลังบริษัทเดียวกันอาจใช้ IP เดียวกัน ถ้า login แล้วนับตาม user id ดีกว่า ต้องระวังการอ่าน IP จาก header เมื่ออยู่หลัง proxy ให้ตั้งค่า trust proxy ให้ถูก (3) ถ้า Redis ล่มจะทำอย่างไร — fail open (ปล่อยผ่าน) รักษา availability แต่เสี่ยงโดนยิง ส่วน fail closed ปลอดภัยแต่ระบบใช้ไม่ได้ ต้องเลือกตาม endpoint เช่น login ควรเข้มกว่า และควรตอบ `429 Too Many Requests` พร้อมบอกว่ารอได้เมื่อไร
- **Common Wrong Answer:** "ใช้ rate-limit middleware ตัวเดิมที่เก็บใน memory ก็พอ" — ไม่รู้ว่าแต่ละ instance มี memory ของตัวเอง หรือ "rate limit ป้องกัน DDoS ได้" ซึ่ง rate limit ใน app ช่วยได้จำกัด การโจมตีขนาดใหญ่ต้องป้องกันตั้งแต่ชั้น network/CDN
- **Follow-up:** fixed window มีปัญหาอะไรที่ขอบเวลา / จะให้ลูกค้าแต่ละ plan มี limit ต่างกันอย่างไร

---

### 6.5 Java

> ทบทวนเนื้อหาเต็มที่ [PART 09 — Java](./part-09-java.md)

#### 🟢 Junior

**Q:** `==` กับ `.equals()` ต่างกันอย่างไร

- **Expected Concept:** `==` เทียบ reference (สำหรับ object) / เทียบค่า (สำหรับ primitive), `.equals()` เทียบความหมายของค่าตามที่ class กำหนด
- **Short Answer:** กับ object `==` เช็คว่าเป็น object ตัวเดียวกันใน memory ไหม ส่วน `.equals()` เช็คว่าค่าข้างในเท่ากันไหม เช่นเทียบ String ต้องใช้ `.equals()`
- **Mid-level Answer:** ถ้า class ไม่ override `equals` จะได้พฤติกรรมเดียวกับ `==` จาก `Object` class ที่ใช้เป็นค่า เช่น DTO หรือ value object จึงต้อง override `equals` และ `hashCode` คู่กันเสมอ ไม่อย่างนั้นใช้เป็น key ใน HashMap หรือใส่ HashSet แล้วจะหาไม่เจอ กับดักที่เจอบ่อยคือ String literal บางครั้ง `==` ให้ `true` เพราะ string pool ทำให้คนคิดว่าใช้ได้ แต่ string ที่สร้างตอน runtime จะเป็นคนละ object
- **Common Wrong Answer:** "`==` เทียบค่า `.equals()` เทียบ type" หรือ "ใช้ `==` กับ String ได้เพราะลองแล้วได้ true" — ผลลัพธ์บังเอิญถูกจาก string pool ไม่ใช่เพราะเทียบค่า
- **Follow-up:** ทำไม override `equals` แล้วต้อง override `hashCode` ด้วย / `Integer` เทียบด้วย `==` มีกับดักอะไร (cache ค่าช่วงเล็ก ๆ ทำให้บางค่าได้ true บางค่าได้ false)

**Q:** Interface กับ Abstract class ต่างกันอย่างไร เลือกใช้เมื่อไร

- **Expected Concept:** implement ได้หลาย interface แต่ extends ได้ class เดียว, abstract class มี state (field) และ constructor ได้, interface เป็น contract, default method ตั้งแต่ Java 8
- **Short Answer:** Interface คือสัญญาว่า class ต้องมี method อะไรบ้าง class หนึ่ง implement ได้หลาย interface ส่วน abstract class เป็น class แม่ที่มี code บางส่วนและ field ได้ แต่ extends ได้ตัวเดียว
- **Mid-level Answer:** ใช้ interface เมื่ออยากกำหนดความสามารถ เช่น `PaymentGateway` ที่มีหลาย implementation และอยาก mock ใน test ได้ง่าย ใช้ abstract class เมื่อ class ลูกหลายตัวมี state และ logic ร่วมกันจริง ๆ ตั้งแต่ Java 8 interface มี default method ได้ ความต่างที่เหลือหลัก ๆ คือ interface เก็บ instance state ไม่ได้ ในงานจริงมักเริ่มจาก interface ก่อนเพราะยืดหยุ่นกว่า และใช้ composition แทน inheritance เมื่อทำได้
- **Common Wrong Answer:** "Interface มีแต่ method ว่าง ไม่มี code เลย" — ล้าสมัยตั้งแต่ Java 8 ที่มี default และ static method
- **Follow-up:** composition over inheritance หมายความว่าอะไร / ถ้า implement สอง interface ที่มี default method ชื่อเดียวกันจะเกิดอะไร (compile error จนกว่าจะ override เอง)

#### 🟡 Mid-level

**Q:** HashMap ทำงานอย่างไรข้างใน

- **Expected Concept:** array ของ bucket, `hashCode()` เลือก bucket, `equals()` หา key ใน bucket, collision, resize เมื่อเกิน load factor, bucket ที่ยาวมากถูกแปลงเป็น tree
- **Short Answer:** HashMap เอา `hashCode` ของ key มาคำนวณว่าจะเก็บใน bucket ไหน ถ้า key หลายตัวลง bucket เดียวกัน (collision) จะเก็บต่อกันแล้วใช้ `equals` หาตัวที่ตรง เลยหาค่าได้เร็วโดยเฉลี่ย O(1)
- **Mid-level Answer:** เมื่อจำนวน entry เกิน capacity × load factor (ค่าเริ่มต้น 0.75) จะขยาย array และกระจาย entry ใหม่ ซึ่งมีต้นทุน ถ้ารู้ขนาดล่วงหน้าควรกำหนด initial capacity ตั้งแต่ Java 8 bucket ที่มี collision เยอะเกินเกณฑ์จะถูกแปลงจาก linked list เป็น tree ทำให้กรณีแย่สุดดีขึ้นจาก O(n) เป็น O(log n) เรื่องที่ต้องระวังในงานจริงคือ key ต้อง immutable ถ้าแก้ field ที่ใช้คำนวณ hashCode หลังใส่ลง map แล้วจะหาไม่เจออีก และ HashMap ไม่ thread-safe
- **Common Wrong Answer:** "HashMap เรียงตามลำดับที่ใส่" — ไม่รับประกันลำดับ ถ้าต้องการลำดับการใส่ใช้ `LinkedHashMap` ต้องการเรียงตาม key ใช้ `TreeMap`
- **Follow-up:** ถ้า `hashCode` ของทุก object return ค่าเดียวกันจะเกิดอะไร / HashMap ใช้ `null` เป็น key ได้ไหม (ได้หนึ่งตัว) แล้ว ConcurrentHashMap ล่ะ (ไม่ได้)

**Q:** ถ้าหลาย thread ใช้ข้อมูลร่วมกัน ต้องระวังอะไร `synchronized`, `volatile` และ `ConcurrentHashMap` ต่างกันอย่างไร

- **Expected Concept:** race condition, atomicity vs visibility, `volatile` ให้ visibility แต่ไม่ให้ atomicity, lock granularity, concurrent collections
- **Short Answer:** ถ้าหลาย thread แก้ข้อมูลเดียวกันพร้อมกันผลอาจผิด (race condition) `synchronized` ให้เข้าได้ทีละ thread `volatile` ทำให้ทุก thread เห็นค่าล่าสุด ส่วน `ConcurrentHashMap` เป็น map ที่ออกแบบให้ใช้หลาย thread ได้ปลอดภัย
- **Mid-level Answer:** `count++` ดูเหมือนคำสั่งเดียวแต่จริง ๆ คืออ่าน-บวก-เขียน สาม thread ทำพร้อมกันค่าจะหาย ใส่ `volatile` ไม่ช่วยเพราะให้แค่ visibility ไม่ได้ทำให้ทั้งสามขั้นเป็น atomic ต้องใช้ `synchronized`, lock หรือ `AtomicInteger` สำหรับ map ถ้าใช้ `Collections.synchronizedMap` จะ lock ทั้ง map ทุก operation ส่วน `ConcurrentHashMap` ออกแบบให้หลาย thread ทำงานพร้อมกันได้ดีกว่า และมี method แบบ atomic อย่าง `computeIfAbsent`, `merge` แต่การเรียก `get` แล้วตามด้วย `put` แยกกันก็ยังเกิด race ได้แม้ใช้ ConcurrentHashMap
- **Common Wrong Answer:** "ใส่ `volatile` แล้วก็ thread-safe" หรือ "ใช้ ConcurrentHashMap แล้วทุกอย่างปลอดภัย" — ทั้งสองอย่างแก้ได้เฉพาะบางปัญหา check-then-act หลายขั้นยังต้องทำให้เป็น atomic เอง
- **Follow-up:** deadlock เกิดได้อย่างไรและป้องกันอย่างไร / ใน Spring bean เป็น singleton เรื่องนี้เกี่ยวอย่างไร

#### 🔴 Senior

**Q:** Java service บน production เจอ `OutOfMemoryError` เป็นระยะ จะวิเคราะห์และแก้อย่างไร

- **Expected Concept:** แยกประเภท OOM (heap / metaspace / native), heap dump, วิเคราะห์ด้วยเครื่องมืออย่าง Eclipse MAT, GC log, leak vs ขนาด heap ไม่พอ, container memory limit
- **Short Answer:** ดูข้อความ OOM ว่าเป็นแบบไหน เช่น Java heap space แล้วเปิดให้ JVM สร้าง heap dump ตอน OOM (`-XX:+HeapDumpOnOutOfMemoryError`) เอามาวิเคราะห์ว่า object อะไรกิน memory มากที่สุด
- **Mid-level Answer:** แยกสองกรณีก่อน: ถ้า heap หลัง GC ค่อย ๆ สูงขึ้นเรื่อย ๆ คือ leak เช่น static Map ที่ใช้เป็น cache แต่ไม่เคยลบ, ThreadLocal ที่ไม่ remove ใน thread pool, listener ที่ลงทะเบียนแล้วไม่ถอด แต่ถ้า heap พุ่งเป็นช่วง ๆ คือมีงานที่โหลดข้อมูลก้อนใหญ่ครั้งเดียว เช่น query ไม่มี pagination ดึงล้านแถวเข้า List วิเคราะห์ heap dump ด้วยเครื่องมือดู dominator tree และ path ไปยัง GC root ถ้ารันใน container ต้องเช็คว่า heap ที่ตั้งไว้สัมพันธ์กับ memory limit ของ container เพราะ JVM ใช้ memory นอก heap ด้วย ถ้าเกิน limit จะโดน kill (OOMKilled) โดยไม่มี Java OOM ให้เห็น การเพิ่ม heap เป็น mitigation ชั่วคราวได้แต่ไม่ใช่การแก้ต้นเหตุ
- **Common Wrong Answer:** "เรียก `System.gc()` บ่อย ๆ" — เป็นแค่คำแนะนำให้ JVM และไม่ช่วยเลยถ้า object ยังมี reference ค้างอยู่ เพราะ GC เก็บได้เฉพาะ object ที่ไม่มีใครอ้างถึงแล้ว
- **Follow-up:** Pod ถูก OOMKilled แต่ไม่มี Java OOM ใน log แปลว่าอะไร / GC pause ยาวส่งผลต่อ latency อย่างไร

---

### 6.6 Spring Boot

> ทบทวนเนื้อหาเต็มที่ [PART 10 — Spring Boot](./part-10-spring-boot.md)

#### 🟢 Junior

**Q:** Dependency Injection (DI) คืออะไร Spring ช่วยเรื่องนี้อย่างไร

- **Expected Concept:** Inversion of Control, object ไม่สร้าง dependency เอง, Spring container สร้างและประกอบ bean, constructor injection
- **Short Answer:** DI คือแทนที่ class จะ `new` ของที่ต้องใช้เอง ให้มีคนส่งเข้ามาให้ Spring เป็นคนสร้าง object (bean) แล้วใส่ให้ class ที่ต้องการอัตโนมัติ
- **Mid-level Answer:** ประโยชน์หลักคือ class ไม่ผูกกับ implementation ตรง ๆ ทำให้เปลี่ยนตัวจริงหรือใส่ mock ใน test ได้ง่าย แนวปฏิบัติที่แนะนำคือ constructor injection เพราะ dependency ชัดเจน field เป็น `final` ได้ และสร้าง object ใน unit test ได้โดยไม่ต้องมี Spring ถ้า constructor รับ dependency เยอะมากก็เป็นสัญญาณว่า class ทำหลายหน้าที่เกินไป
- **Common Wrong Answer:** "DI คือการใส่ `@Autowired`" — นั่นคือวิธีบอก Spring ไม่ใช่ concept และการใช้ field injection ทั่วไปทำให้ test ยากและซ่อน dependency
- **Follow-up:** ถ้ามี bean ที่ implement interface เดียวกันสองตัวจะเลือกอย่างไร (`@Qualifier`, `@Primary`) / circular dependency เกิดจากอะไร

**Q:** `@Component`, `@Service`, `@Repository`, `@Controller` และ `@RestController` ต่างกันอย่างไร

- **Expected Concept:** ทั้งหมดเป็น stereotype ที่ทำให้ถูก scan เป็น bean, บอกบทบาทของ layer, `@Repository` แปลง exception ของ persistence, `@RestController` = `@Controller` + `@ResponseBody`
- **Short Answer:** ทุกตัวทำให้ Spring สร้าง bean ให้ แต่ชื่อบอกหน้าที่ของ layer `@RestController` ใช้ทำ REST API เพราะ return ค่าเป็น body (เช่น JSON) ไม่ใช่ชื่อ view
- **Mid-level Answer:** ในเชิงเทคนิค `@Service` แทบไม่ต่างจาก `@Component` แต่ช่วยสื่อสารว่าเป็น business logic ส่วน `@Repository` มีพฤติกรรมเพิ่มคือแปลง exception เฉพาะของ database ให้เป็น `DataAccessException` ของ Spring การแยกบทบาทชัดทำให้ทีมรู้ว่า logic ควรอยู่ตรงไหน เช่น controller ไม่ควรมี business rule
- **Common Wrong Answer:** "`@Service` ทำให้ method มี transaction อัตโนมัติ" — ไม่จริง transaction ต้องมาจาก `@Transactional`
- **Follow-up:** ถ้าลืมใส่ annotation จะเจอ error อะไร / component scan หาจาก package ไหน

#### 🟡 Mid-level

**Q:** `@Transactional` ทำงานอย่างไร และมีกรณีไหนที่ใส่แล้วไม่ทำงาน

- **Expected Concept:** ทำงานผ่าน proxy, self-invocation ไม่ผ่าน proxy, default rollback เฉพาะ unchecked exception (RuntimeException และ Error), propagation
- **Short Answer:** `@Transactional` ทำให้ทุกคำสั่ง database ใน method อยู่ใน transaction เดียว ถ้าเกิด exception จะ rollback ทั้งหมด
- **Mid-level Answer:** Spring สร้าง proxy ครอบ bean ไว้ transaction จะเริ่มเมื่อเรียกผ่าน proxy เท่านั้น จึงมีกับดักสองข้อที่เจอบ่อย: (1) เรียก method `@Transactional` จาก method อื่นใน class เดียวกัน (self-invocation) จะไม่ผ่าน proxy transaction ไม่เริ่ม (2) ค่าเริ่มต้น rollback เฉพาะ RuntimeException และ Error ถ้า throw checked exception จะ commit ต้องกำหนด `rollbackFor` เอง อีกเรื่องที่ต้องระวังคือไม่ควรเรียก API ภายนอกที่ช้าไว้ใน transaction เพราะจะถือ connection และ lock ไว้นาน
- **Common Wrong Answer:** "ใส่ `@Transactional` ไว้ที่ไหนก็ rollback ได้เสมอ" — ไม่รู้เรื่อง proxy และกฎ rollback เป็นต้นเหตุ bug ข้อมูลไม่ครบบ่อยมาก
- **Follow-up:** propagation `REQUIRED` กับ `REQUIRES_NEW` ต่างกันอย่างไร / `readOnly = true` ช่วยอะไร

**Q:** Bean ใน Spring เป็น singleton โดย default หมายความว่าอะไร มีผลกับ thread safety อย่างไร

- **Expected Concept:** instance เดียวต่อ container, ถูกใช้ร่วมกันทุก request/thread, ห้ามเก็บ state ที่เปลี่ยนตาม request ใน field
- **Short Answer:** Spring สร้าง bean ตัวเดียวแล้วใช้ร่วมกันทั้งแอป ทุก request ใช้ object ตัวเดียวกัน
- **Mid-level Answer:** เพราะหลาย request วิ่งพร้อมกันบนหลาย thread แต่ใช้ bean ตัวเดียวกัน ถ้าเก็บข้อมูลของ request ไว้ใน field ของ service ข้อมูลของผู้ใช้คนหนึ่งจะไปโผล่ใน request ของอีกคนได้ หลักคือ bean ควรเป็น stateless ข้อมูลเฉพาะ request ให้ส่งผ่าน parameter หรือใช้ local variable ถ้าจำเป็นต้องมี state จริงค่อยพิจารณา scope อื่น เช่น request scope หรือใช้โครงสร้างข้อมูลที่ thread-safe
- **Common Wrong Answer:** "Singleton คือ thread-safe อยู่แล้วเพราะ Spring จัดการให้" — Spring แค่จัดการจำนวน instance ไม่ได้ทำให้ code ของเรา thread-safe
- **Follow-up:** prototype scope ต่างอย่างไร / ถ้า inject prototype bean เข้า singleton จะได้ instance ใหม่ทุกครั้งไหม (ไม่ ได้แค่ตอนสร้าง singleton)

#### 🔴 Senior

**Q:** API ที่ใช้ JPA/Hibernate ช้าลงมากเมื่อข้อมูลเยอะขึ้น ตรวจพบว่ามี query หลายร้อยตัวต่อ request จะอธิบายสาเหตุและแก้อย่างไร

- **Expected Concept:** N+1 query problem, LAZY loading, fetch join / EntityGraph / batch fetching, DTO projection, เปิด SQL log หรือ metric เพื่อจับ
- **Short Answer:** น่าจะเป็น N+1 คือ query รายการหลัก 1 ครั้ง แล้ววนดึงข้อมูลที่ผูกกันอีกทีละแถว N ครั้ง แก้ด้วย fetch join หรือ EntityGraph ให้ดึงมาทีเดียว
- **Mid-level Answer:** ยืนยันก่อนด้วย SQL log หรือ statistics ของ Hibernate ว่าจำนวน query โตตามจำนวนแถว จากนั้นเลือกวิธีแก้ตามกรณี: fetch join เหมาะกับความสัมพันธ์แบบ to-one หรือ collection เดียว แต่ fetch join collection พร้อม pagination จะทำให้ Hibernate ต้อง paginate ใน memory หรือได้ผลซ้ำ ในกรณีนั้น batch fetching (ดึงลูกทีละกลุ่มด้วย `IN`) มักเหมาะกว่า ถ้า API แค่แสดงผล การ query เป็น DTO projection เฉพาะ field ที่ต้องใช้ มักเร็วและชัดที่สุด การเปลี่ยนทุก relation เป็น EAGER ไม่ใช่ทางแก้ เพราะจะโหลดเกินในทุกที่ที่ใช้ entity นั้น สุดท้ายควรมี test หรือ metric ที่นับจำนวน query ต่อ request เพื่อไม่ให้ปัญหากลับมา
- **Common Wrong Answer:** "เปลี่ยนเป็น `FetchType.EAGER` ทั้งหมด" — ย้ายปัญหาไปที่อื่นและบางกรณียังเกิด N+1 อยู่ดี หรือ "ใส่ cache" ทั้งที่ยังไม่แก้ query ที่ผิดรูป
- **Follow-up:** `LazyInitializationException` เกิดจากอะไร / Open Session in View คืออะไร ทำไมหลายทีมปิดทิ้ง

---

### 6.7 Python

> ทบทวนเนื้อหาเต็มที่ [PART 11 — Python](./part-11-python.md)

#### 🟢 Junior

**Q:** `list` กับ `tuple` ต่างกันอย่างไร

- **Expected Concept:** mutable vs immutable, tuple ใช้เป็น key ของ dict ได้ถ้าข้างในเป็น hashable ทั้งหมด, สื่อความหมาย (ข้อมูลชุดคงที่)
- **Short Answer:** list แก้ไขได้ เพิ่มลบได้ ส่วน tuple สร้างแล้วแก้ไม่ได้ เหมาะกับข้อมูลชุดที่ไม่ควรเปลี่ยน เช่น พิกัด (x, y)
- **Mid-level Answer:** เพราะ tuple เป็น immutable จึงใช้เป็น key ของ dict หรือใส่ใน set ได้ (ถ้าทุกค่าข้างในเป็น hashable ด้วย) และใช้สื่อว่า "ข้อมูลชุดนี้มีโครงสร้างคงที่" เช่น function ที่ return หลายค่า แต่ต้องระวังว่า immutable แค่ระดับตัว tuple ถ้าข้างในมี list อยู่ list นั้นยังแก้ได้
- **Common Wrong Answer:** "tuple เร็วกว่ามาก เลยควรใช้แทน list ทุกที่" — ความต่างเรื่องความเร็วเล็กมากในงานทั่วไป การเลือกควรมาจากความหมายของข้อมูลและความต้องการแก้ไข
- **Follow-up:** dict ใช้ list เป็น key ได้ไหม เพราะอะไร / shallow copy กับ deep copy ต่างกันอย่างไร

**Q:** ทำไมไม่ควรใช้ list หรือ dict เป็นค่า default ของ argument เช่น `def add(item, items=[])`

- **Expected Concept:** default value ถูกสร้างครั้งเดียวตอนนิยาม function และใช้ร่วมกันทุกครั้งที่เรียก, ใช้ `None` เป็น sentinel
- **Short Answer:** ค่า default ถูกสร้างครั้งเดียวตอนประกาศ function ทุกครั้งที่เรียกโดยไม่ส่ง `items` จะได้ list ตัวเดิม ข้อมูลจากการเรียกครั้งก่อนจะค้างอยู่ ควรใช้ `items=None` แล้วสร้าง list ใหม่ข้างใน
- **Mid-level Answer:** เป็น bug ที่เงียบมาก เพราะเรียกครั้งแรกดูปกติ แต่ใน web service ที่ process อยู่ยาว ข้อมูลของ request หนึ่งอาจรั่วไปอีก request ได้ กฎเดียวกันใช้กับ object ที่ mutable ทุกชนิด linter หลายตัวจับให้ได้ จึงควรเปิดใช้ใน CI
- **Common Wrong Answer:** "Python สร้าง list ใหม่ทุกครั้งที่เรียก function" — เป็นความเข้าใจที่ทำให้เกิด bug นี้ตั้งแต่แรก
- **Follow-up:** ทำไม `None` ถึงเป็นทางออกมาตรฐาน / Python ส่ง argument แบบ by value หรือ by reference (ส่ง reference ของ object — object ที่ mutable จึงถูกแก้จากข้างใน function ได้)

#### 🟡 Mid-level

**Q:** GIL คืออะไร แล้วจะเลือกระหว่าง threading, multiprocessing และ asyncio อย่างไร

- **Expected Concept:** GIL ใน CPython ทำให้ Python bytecode รันทีละ thread, ไม่กระทบงาน I/O-bound มาก, CPU-bound ใช้ multiprocessing, asyncio เป็น concurrency บน thread เดียว
- **Short Answer:** GIL คือ lock ใน CPython ที่ให้ thread รัน Python code ได้ทีละตัว งานที่รอ I/O ใช้ threading หรือ asyncio ได้ งานคำนวณหนักควรใช้ multiprocessing เพื่อใช้หลาย CPU core
- **Mid-level Answer:** thread จะปล่อย GIL ระหว่างรอ I/O ดังนั้นงานเรียก API หรือ database พร้อมกันหลายตัว threading ก็ช่วยได้ asyncio เหมาะเมื่อมี connection พร้อมกันจำนวนมากเพราะเบากว่า thread แต่ทุก library ที่ใช้ต้องรองรับ async ด้วย ส่วนงาน CPU-bound เช่น ประมวลผลรูปหรือคำนวณหนัก ใช้ multiprocessing ซึ่งแลกกับ memory ที่เพิ่มและต้นทุนส่งข้อมูลข้าม process อีกทางคือใช้ library ที่ทำงานหนักใน C และปล่อย GIL ระหว่างคำนวณ เช่น NumPy หลาย operation นอกจากนี้ CPython รุ่นใหม่มี build แบบ free-threaded (ไม่มี GIL) ให้เลือก แต่ build มาตรฐานยังมี GIL และ library บางตัวอาจยังไม่รองรับ
- **Common Wrong Answer:** "Python ใช้ thread ไม่ได้เลยเพราะ GIL" — เกินจริง งาน I/O-bound ได้ประโยชน์จาก thread ชัดเจน หรือ "asyncio ทำให้งานคำนวณเร็วขึ้น" ซึ่งผิด asyncio ไม่ได้เพิ่ม parallelism
- **Follow-up:** ถ้าเรียก function ที่ block (เช่น `time.sleep` หรือ HTTP client แบบ sync) ใน `async def` จะเกิดอะไร / race condition ยังเกิดได้ไหมทั้งที่มี GIL (เกิดได้)

**Q:** Generator และ `yield` คืออะไร ใช้ทำอะไรในงานจริง

- **Expected Concept:** lazy evaluation, สร้างค่าทีละตัวเมื่อถูกขอ, ประหยัด memory, ใช้ได้รอบเดียว
- **Short Answer:** Generator คือ function ที่ใช้ `yield` ส่งค่าออกมาทีละตัว และหยุดรอจนกว่าจะถูกขอค่าถัดไป จึงไม่ต้องสร้างข้อมูลทั้งหมดไว้ใน memory
- **Mid-level Answer:** ใช้จริงเวลาอ่านไฟล์ log ขนาดหลาย GB ทีละบรรทัด หรือดึงข้อมูลจาก database ทีละ batch แล้วประมวลผลต่อเป็นขั้น ๆ (pipeline) memory คงที่ไม่ว่าข้อมูลใหญ่แค่ไหน ข้อควรระวังคือ generator วนได้รอบเดียว ถ้าต้องวนซ้ำต้องสร้างใหม่ และ error จะเกิดตอนวน ไม่ใช่ตอนเรียก function ทำให้ debug ยากขึ้นเล็กน้อย
- **Common Wrong Answer:** "Generator เร็วกว่า list" — จุดเด่นคือ memory และการเริ่มประมวลผลได้ก่อน ไม่ใช่ความเร็วรวม ถ้าข้อมูลเล็กและต้องใช้ซ้ำหลายรอบ list อาจเหมาะกว่า
- **Follow-up:** list comprehension กับ generator expression ต่างกันอย่างไร / ถ้าเรียก `len()` กับ generator จะเกิดอะไร (error เพราะไม่รู้ความยาวล่วงหน้า)

#### 🔴 Senior

**Q:** FastAPI service ตอบช้าเป็นช่วง ๆ เมื่อ traffic สูง ทั้งที่ CPU ไม่เต็ม สงสัยว่าเป็นเพราะอะไร จะตรวจสอบอย่างไร

- **Expected Concept:** blocking call ใน `async def` ทำให้ event loop ค้าง, FastAPI รัน `def` ธรรมดาใน threadpool, connection pool เต็ม, จำนวน worker process
- **Short Answer:** สาเหตุที่เจอบ่อยคือเรียก code ที่ block เช่น database driver แบบ sync หรือ `requests` ภายใน `async def` ทำให้ event loop หยุดรอ request อื่นก็ค้างตาม ทั้งที่ CPU ว่าง
- **Mid-level Answer:** อาการ "ช้าแต่ CPU ไม่เต็ม" แปลว่ากำลังรออะไรบางอย่าง ตรวจสามจุด: (1) endpoint ที่เป็น `async def` แต่เรียก library แบบ sync — event loop มีตัวเดียวต่อ worker ทุก request ใน worker นั้นจะรอ แก้โดยเปลี่ยนไปใช้ library แบบ async หรือประกาศ endpoint เป็น `def` ธรรมดาซึ่ง FastAPI จะรันใน threadpool ให้ (2) connection pool ของ database เล็กเกินไป request รอ connection (ดูจาก metric ของ pool หรือ timeout) (3) จำนวน worker process น้อยเกินไปเทียบกับ core เครื่องมือที่ใช้คือ tracing เพื่อดูว่าเวลาหายไปช่วงไหนของ request และเปิด debug mode ของ asyncio เพื่อ log callback ที่ใช้เวลานานเกินกำหนด trade-off ของการเปลี่ยนเป็น async ทั้งระบบคือต้องแน่ใจว่าทุก dependency รองรับ ถ้าผสมกันมั่ว ๆ จะแย่กว่าเขียน sync ธรรมดา
- **Common Wrong Answer:** "Python ช้าอยู่แล้ว ต้องเขียนใหม่เป็นภาษาอื่น" — ข้ามการวัดทั้งหมด และปัญหาแบบนี้ภาษาอื่นก็เจอได้ถ้าใช้ async ผิดวิธี
- **Follow-up:** จะเลือกจำนวน worker อย่างไร / ถ้าต้องเรียก library ที่มีแต่แบบ sync ใน async code จะทำอย่างไร (ส่งไปรันใน thread ด้วย `run_in_executor` หรือ `asyncio.to_thread`)

---

### 6.8 React Native

> ทบทวนเนื้อหาเต็มที่ [PART 12 — React Native](./part-12-react-native.md)

#### 🟢 Junior

**Q:** React Native ต่างจาก React บนเว็บอย่างไร

- **Expected Concept:** render เป็น native component ไม่ใช่ DOM, ใช้ `View`/`Text` แทน `div`/`span`, style ผ่าน object คล้าย CSS แต่ไม่ใช่ CSS จริง, Flexbox default เป็น column
- **Short Answer:** React Native ใช้แนวคิด component, props, state เหมือน React แต่ไม่มี DOM ต้องใช้ component อย่าง `View`, `Text`, `Image` ซึ่งถูกแปลงเป็น UI native ของ iOS และ Android จริง
- **Mid-level Answer:** สิ่งที่ต้องปรับตัวคือ styling ใช้ JavaScript object ที่หน้าตาคล้าย CSS แต่รองรับแค่บางส่วน ไม่มี cascade และ Flexbox มี `flexDirection` เริ่มต้นเป็น `column` ต่างจากเว็บ ข้อความทุกตัวต้องอยู่ใน `<Text>` การนำทางใช้ library เช่น React Navigation แทน URL และต้องคิดเรื่องที่เว็บไม่ค่อยเจอ เช่น permission, การทำงานตอนแอปอยู่ background และความต่างระหว่างสองแพลตฟอร์ม
- **Common Wrong Answer:** "React Native คือเว็บที่ห่อใน WebView" — ผิด นั่นคือแนวทางแบบ hybrid ส่วน React Native render native view จริง
- **Follow-up:** จะเขียน code ที่ต่างกันระหว่าง iOS กับ Android อย่างไร (`Platform`, ไฟล์ `.ios.js` / `.android.js`) / แชร์ code กับเว็บได้แค่ไหน

**Q:** Expo กับ React Native CLI (bare) ต่างกันอย่างไร

- **Expected Concept:** Expo เป็น framework และชุดเครื่องมือบน React Native, เริ่มเร็ว, build บน cloud ได้, ต้องการ native code เพิ่มได้ผ่าน config plugin / development build, bare ควบคุม native project เต็มที่
- **Short Answer:** Expo ช่วยให้เริ่ม project ได้เร็ว มี library และเครื่องมือ build/update ให้พร้อม ส่วน bare React Native ให้เราจัดการ project iOS/Android เองทั้งหมด
- **Mid-level Answer:** เดิมคนมองว่า Expo ใช้ native module เองไม่ได้ แต่ปัจจุบันใช้ development build และ config plugin เพิ่ม native code ได้ ทำให้ Expo เหมาะกับ project ส่วนใหญ่ bare เหมาะเมื่อต้องแก้ native project ลึก ๆ หรือต้องรวมกับแอป native เดิมที่มีอยู่ trade-off คือ Expo สะดวกกว่าแต่เราอยู่ในรูปแบบที่ Expo กำหนด ส่วน bare ยืดหยุ่นกว่าแต่ต้องดูแล Xcode, Gradle และการ upgrade เอง
- **Common Wrong Answer:** "Expo ใช้ได้แค่ทำ prototype เอาขึ้น production ไม่ได้" — เป็นความเข้าใจจากยุคก่อน แอป production จำนวนมากใช้ Expo
- **Follow-up:** Expo Go กับ development build ต่างกันอย่างไร / OTA update คืออะไร มีข้อจำกัดอะไร (อัปเดตได้เฉพาะ JS/asset ไม่ได้เปลี่ยน native code)

#### 🟡 Mid-level

**Q:** ถ้าต้องแสดง list สินค้า 5,000 รายการ ควรใช้ `ScrollView` หรือ `FlatList` เพราะอะไร

- **Expected Concept:** ScrollView render ลูกทั้งหมด, FlatList virtualize (render เฉพาะที่ใกล้ viewport), `keyExtractor`, ลด re-render ของ item
- **Short Answer:** ใช้ `FlatList` เพราะ render เฉพาะรายการที่อยู่บนจอและใกล้ ๆ ส่วน `ScrollView` จะ render ทุกรายการพร้อมกัน ทำให้ช้าและกิน memory
- **Mid-level Answer:** FlatList ช่วยได้มากแต่ยังต้องดูแลต่อ: ใส่ `keyExtractor` ด้วย id จริง, ทำ item component ให้เบาและใช้ `React.memo` ไม่ให้ทุก item render ใหม่เมื่อ parent เปลี่ยน, ไม่สร้าง function หรือ object ใหม่ใน `renderItem` โดยไม่จำเป็น ถ้าความสูงของ item คงที่ใช้ `getItemLayout` ให้เลื่อนไปตำแหน่งต่าง ๆ ได้เร็ว รูปควรมีขนาดพอดีกับที่แสดงและมี cache ถ้ายังไม่พอค่อยพิจารณา list library อื่นที่ recycle view แต่ต้องวัดก่อน `ScrollView` ยังเหมาะกับเนื้อหาสั้น ๆ ที่จำนวนแน่นอน
- **Common Wrong Answer:** "ใช้ ScrollView แล้วโหลดทีละ 50 รายการก็พอ" — ถ้าเลื่อนลงไปเรื่อย ๆ รายการที่โหลดแล้วยังถูก render ค้างอยู่ทั้งหมด ปัญหาจะกลับมาเมื่อข้อมูลสะสม
- **Follow-up:** ทำ pull-to-refresh และ infinite scroll อย่างไร / จะวัด frame drop ได้อย่างไร

**Q:** ควรเก็บ access token และ refresh token ในแอป mobile ไว้ที่ไหน

- **Expected Concept:** AsyncStorage ไม่ได้เข้ารหัส, ใช้ secure storage ของระบบ (iOS Keychain / Android Keystore) ผ่าน library, ลดอายุ token, ไม่ฝัง secret ของ server ในแอป
- **Short Answer:** ไม่ควรเก็บใน AsyncStorage เพราะไม่ได้เข้ารหัส ควรใช้ secure storage ของระบบ เช่น Keychain บน iOS และ Keystore บน Android ผ่าน library อย่าง expo-secure-store หรือ react-native-keychain
- **Mid-level Answer:** เครื่องที่ถูก root/jailbreak หรือ backup ที่ไม่เข้ารหัสอาจทำให้ข้อมูลใน AsyncStorage ถูกอ่านได้ secure storage ลดความเสี่ยงนี้ แต่ต้องออกแบบร่วมด้วย: access token อายุสั้น, refresh token หมุนใหม่ทุกครั้งที่ใช้ (rotation) และ server เพิกถอนได้ ส่วน API key ลับของ server ห้ามฝังในแอปเลย เพราะไฟล์แอปถูกแกะดูได้เสมอ อะไรที่ต้องลับจริงให้อยู่ที่ backend
- **Common Wrong Answer:** "เก็บใน AsyncStorage ก็ได้ เพราะแอปอื่นอ่านไม่ได้" — ถูกเฉพาะในเครื่องปกติ ไม่ครอบคลุมเครื่องที่ถูก root หรือการดึงข้อมูลจาก backup อีกข้อที่ผิดคือ "ซ่อน API key ด้วยการ obfuscate ก็ปลอดภัย"
- **Follow-up:** ถ้าผู้ใช้เปลี่ยนเครื่องหรือ logout จะจัดการ token อย่างไร / certificate pinning คืออะไร ข้อเสียคืออะไร

#### 🔴 Senior

**Q:** อธิบายความต่างระหว่าง architecture เดิมของ React Native (Bridge) กับ New Architecture และผลต่อการตัดสินใจในทีม

- **Expected Concept:** Bridge เดิมส่งข้อความ async แบบ serialize ข้าม JS กับ native, New Architecture ใช้ JSI ให้ JS เรียก native ผ่าน C++ ได้ตรง, Fabric (renderer ใหม่), TurboModules (native module ที่โหลดเมื่อใช้), ความเข้ากันได้ของ library
- **Short Answer:** แบบเดิม JS กับ native คุยกันผ่าน Bridge ที่ส่งข้อความ serialize แบบ async ถ้าคุยกันถี่จะเป็นคอขวด New Architecture ใช้ JSI ให้ JavaScript เรียก native ได้ตรงขึ้น พร้อม renderer ใหม่ชื่อ Fabric และ TurboModules
- **Mid-level Answer:** ผลที่เห็นได้คือการสื่อสารข้ามฝั่งมี overhead น้อยลง รองรับการเรียกแบบ synchronous ในกรณีที่จำเป็น native module โหลดเมื่อใช้จริงแทนโหลดทั้งหมดตอนเริ่มแอป และ Fabric รองรับ feature ของ React รุ่นใหม่ด้าน concurrent rendering ได้ดีขึ้น ในแง่การตัดสินใจของทีม คำถามหลักคือ library ที่เราใช้รองรับแล้วหรือยัง ถ้า native module ที่ทำเองหรือ library สำคัญยังไม่รองรับ ต้องวางแผน migrate เป็นขั้น ทดสอบบนเครื่องจริงทั้งสองแพลตฟอร์ม วัด startup time และ frame rate ก่อนและหลัง และแยก release ที่เปลี่ยน architecture ออกจาก release ที่มี feature ใหม่ เพื่อ rollback ได้ชัด เนื่องจากรายละเอียดการเปิด-ปิดและค่า default เปลี่ยนไปตาม version ต้องตรวจจาก docs ของ version ที่ใช้
- **Common Wrong Answer:** "New Architecture ทำให้แอปเร็วขึ้นทุกกรณี ควรเปิดทันที" — ถ้าคอขวดอยู่ที่ JS render หรือ network การเปลี่ยน architecture ไม่ช่วยมาก และถ้า library ไม่พร้อมอาจสร้าง crash ใหม่
- **Follow-up:** ถ้าต้องทำ animation ลื่น ๆ ที่ตอบสนองตาม gesture จะทำอย่างไรไม่ให้ JS thread เป็นคอขวด / จะ monitor crash ของแอปหลัง release อย่างไร

---

### 6.9 Database

> ทบทวนเนื้อหาเต็มที่ [PART 08 — Database](./part-08-database.md)

#### 🟢 Junior

**Q:** Primary Key กับ Foreign Key คืออะไร

- **Expected Concept:** PK ระบุแถวไม่ซ้ำและไม่เป็น null, FK อ้างอิง PK ของตารางอื่นเพื่อรักษา referential integrity
- **Short Answer:** Primary Key คือค่าที่ใช้ระบุแถวแต่ละแถวแบบไม่ซ้ำ เช่น `id` ของ user ส่วน Foreign Key คือคอลัมน์ที่ชี้ไปหา Primary Key ของอีกตาราง เช่น `orders.user_id` ชี้ไป `users.id`
- **Mid-level Answer:** FK ช่วยให้ database กันข้อมูลกำพร้า เช่น สร้าง order ของ user ที่ไม่มีอยู่จริงไม่ได้ และกำหนดได้ว่าลบ parent แล้วจะเกิดอะไร (ห้ามลบ / ลบตาม / set null) ต้องเลือกให้ตรง business เพราะ cascade delete อาจลบข้อมูลสำคัญเป็นทอด ๆ นอกจากนี้หลาย database ไม่ได้สร้าง index ให้คอลัมน์ FK อัตโนมัติ ถ้า join หรือลบบ่อยควรเพิ่ม index เอง
- **Common Wrong Answer:** "Foreign Key ทำให้ query เร็วขึ้น" — FK คือ constraint เรื่องความถูกต้อง ไม่ใช่ index ความเร็วมาจาก index ที่สร้างบนคอลัมน์นั้น
- **Follow-up:** ใช้ auto-increment กับ UUID เป็น PK ต่างกันอย่างไร / ทำไมบางทีมไม่ใช้ FK ใน database ที่ใหญ่มาก

**Q:** SQL (Relational) กับ NoSQL เลือกใช้อย่างไร

- **Expected Concept:** schema ชัดและความสัมพันธ์ซับซ้อน + transaction → relational, รูปแบบข้อมูลยืดหยุ่น / access pattern ชัด / scale แนวนอนง่าย → NoSQL บางประเภท, NoSQL มีหลายชนิด
- **Short Answer:** SQL เหมาะกับข้อมูลที่มีความสัมพันธ์และต้องการความถูกต้องสูง เช่น order และการเงิน NoSQL เหมาะกับข้อมูลที่โครงสร้างเปลี่ยนบ่อยหรือมีปริมาณสูงมากและ query แบบง่าย ๆ ตามรูปแบบที่รู้ล่วงหน้า
- **Mid-level Answer:** NoSQL ไม่ใช่ประเภทเดียว มีทั้ง document, key-value, wide-column, graph แต่ละแบบเก่งคนละงาน การเลือกควรเริ่มจาก access pattern: ถ้าต้อง join หลายตารางและต้องการ transaction ข้ามหลายแถว relational database ตอบโจทย์ ถ้ารู้ว่าอ่านด้วย key ตายตัวและต้องการ throughput สูง key-value หรือ document store เหมาะ trade-off ของ NoSQL หลายตัวคือต้องออกแบบข้อมูลตาม query ตั้งแต่แรกและ query ใหม่ที่ไม่ได้วางแผนไว้อาจทำยาก ในหลายระบบใช้ทั้งสองแบบร่วมกัน
- **Common Wrong Answer:** "NoSQL เร็วกว่าและ scale ได้ดีกว่า SQL เสมอ" หรือ "NoSQL ไม่มี schema เลยไม่ต้องออกแบบ" — schema ยังมีอยู่ แค่ย้ายไปอยู่ใน code ของแอป
- **Follow-up:** relational database scale ได้อย่างไร / document database เก็บความสัมพันธ์แบบ many-to-many อย่างไร

#### 🟡 Mid-level

**Q:** Index ทำงานอย่างไร และทำไมไม่ควรสร้าง index ทุกคอลัมน์

- **Expected Concept:** โครงสร้างแบบ B-tree ช่วยค้นหาโดยไม่ต้อง scan ทั้งตาราง, ต้นทุนตอนเขียนและพื้นที่, composite index และลำดับคอลัมน์ (leftmost prefix), ดูด้วย EXPLAIN
- **Short Answer:** Index เหมือนสารบัญของหนังสือ ช่วยให้ database หาแถวได้โดยไม่ต้องอ่านทั้งตาราง แต่ทุกครั้งที่ insert/update/delete ต้องอัปเดต index ด้วย จึงมีต้นทุนตอนเขียนและพื้นที่เก็บ
- **Mid-level Answer:** index ส่วนใหญ่เป็น B-tree ที่เรียงค่าไว้ จึงช่วยทั้งค้นหาค่าเท่ากับ ค้นช่วง และ ORDER BY สำหรับ composite index เช่น `(user_id, created_at)` ใช้ได้ดีกับ query ที่ filter `user_id` หรือ `user_id` + `created_at` แต่ถ้า filter แค่ `created_at` อย่างเดียวมักใช้ไม่ได้เต็มที่ ลำดับคอลัมน์จึงต้องออกแบบตาม query จริง index อาจไม่ถูกใช้ถ้าครอบคอลัมน์ด้วย function หรือ LIKE ที่ขึ้นต้นด้วย `%` วิธีตรวจคือใช้ EXPLAIN ดู query plan ว่าเป็น index scan หรือ full scan ตารางที่เขียนบ่อยมาก index เยอะเกินจะทำให้การเขียนช้าลงชัดเจน
- **Common Wrong Answer:** "ยิ่ง index เยอะยิ่งเร็ว" หรือ "ใส่ index แล้ว database จะใช้แน่นอน" — optimizer อาจเลือกไม่ใช้ถ้าคิดว่า scan ถูกกว่า เช่น คอลัมน์ที่มีค่าซ้ำเยอะมากหรือตารางเล็ก
- **Follow-up:** จะหา query ที่ช้าบน production ได้อย่างไร (slow query log) / covering index คืออะไร

**Q:** ถ้าผู้ใช้สองคนกดซื้อสินค้าชิ้นสุดท้ายพร้อมกัน จะป้องกันไม่ให้ขายเกินสต็อกอย่างไร

- **Expected Concept:** race condition แบบ read-then-write, transaction ไม่พอเสมอไปขึ้นกับ isolation level, atomic conditional update, row lock (`SELECT ... FOR UPDATE`), optimistic locking ด้วย version
- **Short Answer:** ถ้าอ่านสต็อกมาเช็คใน code แล้วค่อยลด สองคนอาจอ่านได้ 1 พร้อมกันแล้วลดทั้งคู่ ต้องให้ database ทำการเช็คและลดในคำสั่งเดียว เช่น update ที่มีเงื่อนไข `WHERE stock > 0` แล้วดูว่ามีแถวถูกแก้ไหม
- **Mid-level Answer:** มีสามแนวทาง: (1) atomic conditional update — ลดสต็อกด้วยเงื่อนไขในคำสั่งเดียว ถ้าจำนวนแถวที่ถูกแก้เป็น 0 แปลว่าหมด ง่ายและเร็วที่สุดสำหรับกรณีนี้ (2) pessimistic lock — `SELECT ... FOR UPDATE` ใน transaction เพื่อ lock แถว เหมาะเมื่อต้องทำหลายขั้นกับแถวนั้น แต่คนอื่นต้องรอ ช่วง flash sale จะเกิดคิวยาว (3) optimistic lock — มีคอลัมน์ version แล้ว update เฉพาะเมื่อ version ยังตรง ถ้าไม่ตรงให้ retry เหมาะเมื่อชนกันไม่บ่อย การห่อด้วย transaction อย่างเดียวที่ isolation ระดับ default ของหลาย database ไม่ได้กัน lost update แบบนี้เสมอไป ต้องเข้าใจว่า isolation level ที่ใช้กันอะไรได้บ้าง
- **Common Wrong Answer:** "ใส่ transaction ก็พอแล้ว" โดยไม่ได้ lock หรือไม่ได้ใช้ conditional update — ความเข้าใจที่ว่า transaction กันได้ทุกอย่างเป็นต้นเหตุ bug ขายเกินที่พบบ่อย
- **Follow-up:** isolation level แต่ละระดับป้องกันอะไร / ถ้าระบบมีหลาย service แต่ละตัวมี database ของตัวเองจะทำอย่างไร

#### 🔴 Senior

**Q:** Database หลักเริ่มรับไม่ไหว (CPU สูง, query ช้า) คุณจะวางแผน scale อย่างไร เรียงตามลำดับ

- **Expected Concept:** แก้ถูกและถูกก่อน (query/index) → connection pooling → cache → read replica (replication lag) → vertical scale → partitioning / sharding, วัดก่อนตัดสินใจ
- **Short Answer:** เริ่มจากหา query ที่หนักที่สุดแล้วแก้ด้วย index หรือเขียน query ใหม่ จากนั้นเพิ่ม cache สำหรับข้อมูลที่อ่านบ่อย แยกการอ่านไป read replica และถ้ายังไม่พอค่อยพิจารณา sharding
- **Mid-level Answer:** เรียงตามต้นทุนต่อผลลัพธ์: (1) ดู slow query และ query ที่ถูกเรียกบ่อยที่สุด มักพบว่า query ไม่กี่ตัวกินทรัพยากรส่วนใหญ่ แก้ index หรือ N+1 ได้ผลเร็วที่สุด (2) ตรวจ connection — แอปหลาย instance เปิด connection มากเกินทำให้ database เสียทรัพยากร ใช้ pooler ช่วย (3) cache ข้อมูลที่อ่านบ่อยแต่เปลี่ยนน้อย แลกกับปัญหา invalidation (4) read replica แบ่งภาระการอ่าน แต่ replication เป็น async ในหลายระบบ ผู้ใช้เพิ่งแก้ข้อมูลแล้วอ่านจาก replica อาจเห็นค่าเก่า ต้อง route การอ่านที่ต้องสดไปที่ primary (5) vertical scale เพิ่มเครื่องแรงขึ้น ง่ายแต่มีเพดานและค่าใช้จ่าย (6) partition ตารางใหญ่ตามเวลา หรือ shard ข้ามหลายเครื่อง ซึ่งเป็นการตัดสินใจที่ย้อนกลับยาก ทำให้ join และ transaction ข้าม shard ลำบาก และต้องเลือก shard key ให้กระจายงานได้สม่ำเสมอ ควรทำเมื่อข้ออื่นหมดทางแล้วจริง ๆ
- **Common Wrong Answer:** "ย้ายไป NoSQL" หรือ "shard เลย" เป็นคำตอบแรก — ข้ามขั้นที่ต้นทุนต่ำกว่ามาก และมักย้ายปัญหาไปที่ความซับซ้อนของแอป
- **Follow-up:** จะเลือก shard key อย่างไร hot shard คืออะไร / replication lag ส่งผลกับ UX แบบไหน แก้อย่างไร (read-your-own-writes)

---

### 6.10 Security

> ทบทวนเนื้อหาเต็มที่ [PART 07 — Auth & Security](./part-07-auth-security.md)

#### 🟢 Junior

**Q:** Authentication กับ Authorization ต่างกันอย่างไร

- **Expected Concept:** AuthN = ยืนยันว่าเป็นใคร, AuthZ = มีสิทธิ์ทำอะไร, 401 vs 403, ต้องเช็คฝั่ง server
- **Short Answer:** Authentication คือการยืนยันตัวตนว่าเป็นใคร เช่น login ส่วน Authorization คือการเช็คว่าคนนั้นมีสิทธิ์ทำสิ่งนี้ไหม เช่น เป็น admin ถึงลบ user ได้
- **Mid-level Answer:** ใน HTTP ถ้ายังไม่ยืนยันตัวตนหรือ token ไม่ถูกต้องมักตอบ `401 Unauthorized` ถ้ารู้ว่าเป็นใครแต่ไม่มีสิทธิ์ตอบ `403 Forbidden` จุดที่พลาดบ่อยคือเช็คแค่ role แต่ไม่เช็คความเป็นเจ้าของ เช่น user A เปลี่ยน id ใน URL เป็นของ user B แล้วเห็น order ของ B ได้ (IDOR / Broken Object Level Authorization) ต้องเช็คสิทธิ์ต่อ resource ทุกครั้งที่ server และการซ่อนปุ่มใน frontend ไม่ใช่ authorization
- **Common Wrong Answer:** "ซ่อนเมนู admin ใน frontend ก็พอ" — ใครก็เรียก API ตรงได้ การป้องกันต้องอยู่ที่ server
- **Follow-up:** RBAC คืออะไร / ถ้าจะให้สิทธิ์ละเอียดระดับ resource จะออกแบบอย่างไร

**Q:** ควรเก็บรหัสผ่านใน database อย่างไร

- **Expected Concept:** hash ไม่ใช่ encrypt, ใช้ algorithm ที่ช้าโดยตั้งใจสำหรับรหัสผ่าน (bcrypt, scrypt, Argon2), salt ต่อ user, ไม่ใช้ MD5/SHA ธรรมดา
- **Short Answer:** เก็บเป็น hash ด้วย algorithm สำหรับรหัสผ่านโดยเฉพาะ เช่น bcrypt หรือ Argon2 ซึ่งใส่ salt ให้แต่ละ user ตอน login ก็เอารหัสที่กรอกมา hash แล้วเทียบ ไม่เก็บรหัสจริงและไม่ควรถอดกลับได้
- **Mid-level Answer:** encryption ถอดกลับได้ถ้ามี key ซึ่งถ้า key รั่วรหัสทั้งหมดรั่วตาม จึงใช้ hash ทางเดียว แต่ hash ทั่วไปอย่าง SHA-256 คำนวณเร็วมาก ผู้โจมตีที่ได้ database ไปลองเดารหัสได้จำนวนมหาศาลต่อวินาที algorithm สำหรับรหัสผ่านจึงออกแบบให้ช้าและปรับ cost ได้ ส่วน salt ทำให้รหัสเดียวกันได้ hash ต่างกัน ใช้ตารางที่คำนวณไว้ล่วงหน้าไม่ได้ trade-off คือ cost สูงทำให้ login ใช้ CPU มากขึ้น ต้องตั้งให้พอดี และควรมี rate limit ที่ endpoint login ด้วย
- **Common Wrong Answer:** "เข้ารหัสด้วย AES แล้วเก็บ key ไว้ใน config" หรือ "ใช้ MD5 + salt ก็พอ" — อย่างแรกถอดได้ อย่างหลังเร็วเกินไปสำหรับการป้องกันการเดา
- **Follow-up:** ถ้าวันหนึ่งอยากเพิ่ม cost ของ hash จะทำกับ user เดิมอย่างไร (rehash ตอน login สำเร็จ) / pepper คืออะไร

#### 🟡 Mid-level

**Q:** XSS กับ CSRF ต่างกันอย่างไร และเกี่ยวกับการเลือกที่เก็บ token อย่างไร

- **Expected Concept:** XSS = script ของผู้โจมตีรันในหน้าเว็บเรา, CSRF = หลอกให้ browser ส่ง request ที่มี cookie ไปเอง, httpOnly cookie กัน JS อ่าน token, SameSite + CSRF token กัน CSRF, CSP
- **Short Answer:** XSS คือผู้โจมตีฝัง script ให้รันบนเว็บเรา ขโมยข้อมูลหรือทำแทนผู้ใช้ได้ CSRF คือเว็บอื่นหลอกให้ browser ส่ง request มาที่เว็บเรา โดยแนบ cookie ของผู้ใช้ไปอัตโนมัติ
- **Mid-level Answer:** ถ้าเก็บ token ใน localStorage script จาก XSS อ่านไปได้ทันที ถ้าเก็บใน cookie แบบ `HttpOnly` script อ่านไม่ได้ แต่ browser จะแนบ cookie ไปเองจึงต้องกัน CSRF ด้วย `SameSite` และ CSRF token สำหรับ request ที่เปลี่ยนข้อมูล ข้อสำคัญคือ httpOnly cookie ไม่ได้ทำให้ XSS ไม่อันตราย script ยังส่ง request แทนผู้ใช้จากหน้านั้นได้ จึงต้องป้องกัน XSS ที่ต้นทาง คือ escape output (React ทำให้โดย default ยกเว้นใช้ `dangerouslySetInnerHTML`), sanitize HTML ที่รับจากผู้ใช้ และตั้ง Content Security Policy
- **Common Wrong Answer:** "ใช้ HTTPS แล้วกันได้ทั้ง XSS และ CSRF" — HTTPS ป้องกันการดักระหว่างทาง ไม่เกี่ยวกับสองอย่างนี้ หรือ "CORS กัน CSRF ได้" ซึ่งไม่ครบ CORS คุมการอ่าน response ข้าม origin แต่ form submit แบบธรรมดายังถูกส่งออกไปได้
- **Follow-up:** CORS ทำงานอย่างไร preflight คืออะไร / SameSite `Lax` กับ `Strict` ต่างกันอย่างไร

**Q:** SQL Injection คืออะไร ใช้ ORM แล้วปลอดภัยหรือยัง

- **Expected Concept:** เอา input ไปต่อเป็น string ของ SQL, parameterized query / prepared statement, ORM ช่วยเมื่อใช้ query builder แต่ raw query ยังเสี่ยง, least privilege ของ database user
- **Short Answer:** SQL Injection คือผู้โจมตีใส่ข้อความที่กลายเป็นคำสั่ง SQL เพราะเราเอา input ไปต่อ string ตรง ๆ ป้องกันด้วย parameterized query ที่ส่งค่าแยกจากคำสั่ง
- **Mid-level Answer:** ORM ช่วยได้มากเพราะส่งค่าเป็น parameter ให้โดย default แต่ยังรั่วได้เมื่อใช้ raw query แล้วต่อ string เอง หรือเมื่อรับชื่อคอลัมน์สำหรับ sort จากผู้ใช้ เพราะชื่อคอลัมน์และชื่อตารางใช้ parameter ไม่ได้ ต้องใช้ allowlist อีกชั้นคือจำกัดสิทธิ์ของ database user ที่แอปใช้ ให้ทำได้แค่ที่จำเป็น เพื่อลดความเสียหายถ้าพลาด
- **Common Wrong Answer:** "escape เครื่องหมาย quote เองก็พอ" หรือ "ใช้ ORM แล้วไม่ต้องสนใจเรื่องนี้" — escape เองพลาดง่ายและพลาดตาม encoding ส่วน ORM ไม่ได้ป้องกัน raw query ที่เราต่อเอง
- **Follow-up:** NoSQL injection มีไหม (มี เช่น ส่ง object ที่เป็น operator แทนค่า) / จะหา SQL injection ใน code เก่าอย่างไร

#### 🔴 Senior

**Q:** ออกแบบระบบ login ด้วย JWT อย่างไรให้ logout ได้จริงและรับมือ token รั่วได้

- **Expected Concept:** JWT stateless ยกเลิกก่อนหมดอายุไม่ได้โดยตัวมันเอง, access token อายุสั้น + refresh token เก็บฝั่ง server, refresh token rotation และตรวจจับการใช้ซ้ำ, denylist ตาม jti เมื่อจำเป็น, trade-off กับ session แบบ server-side
- **Short Answer:** ให้ access token อายุสั้น เช่นไม่กี่นาที และใช้ refresh token ที่ server เก็บสถานะไว้ ตอน logout ให้ลบหรือเพิกถอน refresh token ฝั่ง server access token ที่เหลือจะหมดอายุเองในเวลาอันสั้น
- **Mid-level Answer:** JWT ตรวจได้ด้วยลายเซ็นโดยไม่ต้องถาม database จึงยกเลิกทันทีไม่ได้ ถ้าต้องการยกเลิกทันทีจริงต้องมีที่เก็บสถานะ เช่น denylist ตาม token id ใน Redis ซึ่งทำให้เสียความเป็น stateless ไปบางส่วน การออกแบบที่ใช้กันคือ refresh token rotation: ทุกครั้งที่ใช้ refresh token จะได้ตัวใหม่และตัวเก่าใช้ไม่ได้ ถ้ามีคนเอาตัวเก่ามาใช้ซ้ำแปลว่าอาจรั่ว ให้เพิกถอนทั้งชุดของ session นั้น เรื่องอื่นที่ต้องมี: ตรวจ algorithm ที่รับให้ตรงกับที่กำหนด ไม่รับ `none`, ตรวจ `exp`, `iss`, `aud`, ไม่ใส่ข้อมูลลับใน payload เพราะ payload แค่ encode ไม่ได้เข้ารหัส และมีแผนหมุน signing key สุดท้ายต้องพูดว่าถ้าเป็นเว็บแอปที่มี backend เดียว session cookie แบบดั้งเดิมอาจเรียบง่ายและยกเลิกได้ง่ายกว่า JWT เหมาะเมื่อมีหลาย service ที่ต้องตรวจ token เองโดยไม่เรียก auth server ทุกครั้ง
- **Common Wrong Answer:** "logout คือลบ token ใน client ก็จบ" — ถ้า token ถูกขโมยไปแล้ว ผู้โจมตียังใช้ได้จนหมดอายุ หรือ "JWT เข้ารหัสแล้วใส่ข้อมูลอะไรก็ได้" ซึ่งผิด JWT ที่ใช้กันทั่วไปแค่เซ็น ไม่ได้เข้ารหัส
- **Follow-up:** ถ้า signing key รั่วต้องทำอะไรบ้าง / OAuth 2.0 กับ OpenID Connect ต่างกันอย่างไร

---

### 6.11 Docker

> ทบทวนเนื้อหาเต็มที่ [PART 13 — Docker](./part-13-docker.md)

#### 🟢 Junior

**Q:** Image กับ Container ต่างกันอย่างไร

- **Expected Concept:** image = template แบบอ่านอย่างเดียว ประกอบจาก layer, container = instance ที่รันจาก image พร้อม layer ที่เขียนได้ของตัวเอง
- **Short Answer:** Image คือแม่แบบที่รวมแอปกับทุกอย่างที่ต้องใช้รัน ส่วน Container คือตัวที่รันขึ้นมาจาก image หนึ่ง image รันเป็นหลาย container ได้ เหมือน class กับ object
- **Mid-level Answer:** image ประกอบจาก layer ที่อ่านอย่างเดียวและใช้ร่วมกันได้ เมื่อรัน container Docker จะเพิ่ม layer ที่เขียนได้ไว้ด้านบน ไฟล์ที่ container เขียนจะอยู่ใน layer นั้น และหายไปเมื่อลบ container ข้อมูลที่ต้องเก็บจึงต้องใช้ volume และการแก้ config ในการรัน container แล้วไม่ build image ใหม่ ทำให้สภาพแวดล้อมแต่ละที่ไม่ตรงกัน ควรแก้ที่ Dockerfile เสมอ
- **Common Wrong Answer:** "Container คือ image ที่ถูก copy ไปทั้งก้อน" — container ไม่ได้ copy image แต่ใช้ layer เดิมร่วมกันแล้วเพิ่ม layer ที่เขียนได้ด้านบน จึงสร้างได้เร็วและประหยัดพื้นที่
- **Follow-up:** ทำไม `docker exec` เข้าไปแก้ไฟล์แล้ว deploy ใหม่ของที่แก้หายหมด / tag `latest` มีปัญหาอะไร

**Q:** Docker ต่างจาก Virtual Machine อย่างไร

- **Expected Concept:** container ใช้ kernel ของ host ร่วมกันและแยกด้วยกลไกของ OS (namespaces, cgroups), VM มี guest OS เต็มตัวบน hypervisor, container เบาและเร็วกว่าแต่การแยกขาดน้อยกว่า
- **Short Answer:** VM จำลองเครื่องทั้งเครื่องพร้อม OS ของตัวเอง ส่วน container แชร์ kernel ของเครื่อง host แยกแค่ process ไฟล์ และ network ทำให้เบาและเปิดได้เร็วกว่ามาก
- **Mid-level Answer:** เพราะแชร์ kernel container จึงเริ่มได้ในเวลาสั้นและรันได้หนาแน่นกว่าบนเครื่องเดียว แต่ trade-off คือการแยกขาดน้อยกว่า VM ถ้า kernel มีช่องโหว่ ผลกระทบกว้างกว่า งานที่ต้องแยก tenant ที่ไม่ไว้ใจกันอย่างเข้มงวดจึงอาจยังใช้ VM หรือ sandbox เพิ่ม และบน macOS/Windows การรัน Linux container จริง ๆ แล้วมี VM เล็ก ๆ อยู่ข้างหลัง ในงานจริงสองอย่างนี้มักใช้ร่วมกัน คือรัน container บน VM ของ cloud
- **Common Wrong Answer:** "Container คือ VM ขนาดเล็ก" — มองผิดตั้งแต่ mental model เพราะ container ไม่มี kernel ของตัวเอง
- **Follow-up:** ทำไมรัน Windows container บน Linux host ตรง ๆ ไม่ได้ / namespace กับ cgroup ทำหน้าที่อะไร

#### 🟡 Mid-level

**Q:** Build image ช้ามาก แก้ code บรรทัดเดียวก็ต้องรอติดตั้ง dependency ใหม่ทุกครั้ง จะแก้อย่างไร

- **Expected Concept:** layer caching, cache ถูกทำลายตั้งแต่ layer ที่เปลี่ยนลงไปทั้งหมด, copy ไฟล์ dependency ก่อน source, `.dockerignore`, multi-stage build
- **Short Answer:** เรียงลำดับใน Dockerfile ใหม่ ให้ copy แค่ไฟล์ dependency เช่น `package.json` และ lock file แล้วติดตั้งก่อน จากนั้นค่อย copy source code เพื่อให้ layer ติดตั้ง dependency ถูก cache ไว้
- **Mid-level Answer:** Docker ใช้ cache ทีละ layer ถ้า layer ไหนเปลี่ยน ทุก layer หลังจากนั้นต้อง build ใหม่ ถ้า copy ทั้ง project ก่อนติดตั้ง dependency แก้ไฟล์เดียวก็ทำให้ติดตั้งใหม่ทั้งหมด นอกจากเรียงลำดับแล้วควรมี `.dockerignore` กัน `node_modules`, `.git` และไฟล์ที่ไม่จำเป็นไม่ให้เข้า build context และใช้ multi-stage build คือ build ใน stage ที่มีเครื่องมือครบ แล้ว copy เฉพาะผลลัพธ์ไป stage สุดท้ายที่เล็ก ได้ image เล็กลงและมีเครื่องมือที่โจมตีได้น้อยลง ใน CI ต้องตั้งค่าให้ cache ข้ามการ build ด้วย ไม่อย่างนั้น runner ใหม่ทุกครั้งจะไม่มี cache
- **Common Wrong Answer:** "ใช้ `--no-cache` ทุกครั้งจะได้ชัวร์" — ทำให้ช้าที่สุดเท่าที่เป็นไปได้ ควรใช้เฉพาะเมื่อสงสัยว่า cache ผิดจริง
- **Follow-up:** base image แบบ alpine กับ slim มี trade-off อะไร / จะส่ง credential ของ private registry ตอน build อย่างปลอดภัยได้อย่างไร

**Q:** Container ถูกลบแล้วข้อมูล database หายหมด เกิดจากอะไร Volume กับ Bind mount ต่างกันอย่างไร

- **Expected Concept:** container filesystem เป็นแบบชั่วคราว, volume จัดการโดย Docker, bind mount ผูกกับ path บน host, ใช้ในสถานการณ์ต่างกัน
- **Short Answer:** ข้อมูลที่เขียนใน container อยู่ใน layer ของ container ลบ container ก็หาย ต้องเก็บไว้ใน volume ซึ่งอยู่แยกจากอายุของ container
- **Mid-level Answer:** volume สร้างและจัดการโดย Docker เหมาะกับข้อมูลของ database หรือไฟล์ที่แอปสร้างขึ้น ส่วน bind mount เอา folder จริงบนเครื่อง host ไปผูก เหมาะตอนพัฒนา เช่น mount source code ให้แก้แล้วเห็นผลทันที แต่ผูกกับโครงสร้างและ permission ของ host ทำให้ย้ายเครื่องยาก บน production ที่ใช้ orchestrator ข้อมูลถาวรมักย้ายไปใช้ storage ที่ platform จัดให้ หรือใช้ managed database ไปเลย และต้องมี backup แยก volume ไม่ใช่ backup
- **Common Wrong Answer:** "ใช้ `docker commit` เก็บข้อมูลลง image" — ทำให้ข้อมูลกับ image ปนกัน image ใหญ่ขึ้นเรื่อย ๆ และ build ซ้ำจาก Dockerfile ไม่ได้
- **Follow-up:** `docker compose down -v` ต่างจาก `down` อย่างไร / รัน database ใน container บน production ดีไหม

#### 🔴 Senior

**Q:** ก่อนเอา Docker image ขึ้น production คุณจะตรวจอะไรบ้างเพื่อให้ปลอดภัยและทำงานได้ดี

- **Expected Concept:** รันเป็น non-root, image เล็กและอัปเดต, scan ช่องโหว่, ไม่มี secret ใน image, pin version, healthcheck, จัดการ signal และ graceful shutdown, log ออก stdout, resource limit
- **Short Answer:** ไม่รันเป็น root ใช้ base image ที่เล็กและอัปเดตอยู่ scan ช่องโหว่ ไม่ใส่ password หรือ key ไว้ใน image และให้ log ออกทาง stdout
- **Mid-level Answer:** แบ่งเป็นสามกลุ่ม: (1) ความปลอดภัย — user ที่ไม่ใช่ root, multi-stage ให้ไม่มี compiler หรือเครื่องมือเกินจำเป็น, scan ใน CI, secret ต้องมาตอนรันผ่าน environment หรือ secret manager เพราะทุกอย่างที่ใส่ตอน build รวมถึง build arg สามารถถูกเห็นได้จาก layer หรือ history ของ image (2) ความถูกต้อง — pin version ของ base image และ dependency เพื่อให้ build ซ้ำได้เหมือนเดิม, tag image ด้วย version หรือ commit ไม่ใช่ `latest` (3) พฤติกรรมตอนรัน — process หลักต้องรับ SIGTERM แล้วปิดตัวอย่างนุ่มนวล ถ้าใช้ shell form ของ CMD shell อาจไม่ส่ง signal ต่อให้แอป ทำให้ถูก kill กลางคัน, มี health endpoint, log ออก stdout/stderr ให้ platform เก็บ, กำหนด memory/CPU limit และให้ runtime ของภาษารู้ขนาด limit นั้น
- **Common Wrong Answer:** "Container แยกจาก host อยู่แล้ว รันเป็น root ก็ไม่เป็นไร" — ถ้าหลุดออกจาก container ได้ root ใน container จะมีโอกาสทำความเสียหายกับ host มากกว่า
- **Follow-up:** จะหมุน secret โดยไม่ต้อง build image ใหม่อย่างไร / distroless image คืออะไร ข้อเสียเรื่อง debug คืออะไร

---

### 6.12 Kubernetes

> ทบทวนเนื้อหาเต็มที่ [PART 14 — Kubernetes](./part-14-kubernetes.md)

#### 🟢 Junior

**Q:** Pod, Container และ Deployment ต่างกันอย่างไร

- **Expected Concept:** Pod = หน่วยเล็กสุดที่ Kubernetes จัดการ มีได้หนึ่งหรือหลาย container ที่แชร์ network, Deployment = ประกาศจำนวน replica และจัดการ rollout ผ่าน ReplicaSet, desired state
- **Short Answer:** Container คือแอปที่รันอยู่ Pod คือกล่องที่ห่อ container (ส่วนใหญ่ตัวเดียว) ให้ Kubernetes จัดการ ส่วน Deployment บอกว่าอยากได้ Pod แบบนี้กี่ตัว และคอยสร้างใหม่ถ้ามีตัวไหนตาย
- **Mid-level Answer:** container ใน Pod เดียวกันแชร์ IP และคุยกันผ่าน localhost ได้ ใช้กับรูปแบบ sidecar เช่น container เก็บ log หรือ proxy ข้าง ๆ แอป Pod เองเป็นของชั่วคราว ตายแล้วถูกสร้างใหม่ได้ IP ใหม่ จึงไม่ควรสร้าง Pod ตรง ๆ แต่ให้ Deployment ดูแลผ่าน ReplicaSet ซึ่งทำให้ทำ rolling update และ rollback ได้ แอปที่ต้องมีตัวตนและ storage คงที่ต่อ instance เช่น database cluster ใช้ StatefulSet แทน
- **Common Wrong Answer:** "Pod คือ container" — ใกล้เคียงแต่ไม่ครบ ทำให้งงเมื่อเจอ Pod ที่มีหลาย container หรือ init container
- **Follow-up:** init container คืออะไร / ถ้าลบ Pod ที่อยู่ใต้ Deployment จะเกิดอะไร

**Q:** ทำไมต้องมี Service ใน Kubernetes เรียก Pod ด้วย IP ตรง ๆ ไม่ได้หรือ

- **Expected Concept:** Pod IP เปลี่ยนเมื่อถูกสร้างใหม่, Service ให้ชื่อ (DNS) และ IP คงที่, เลือก Pod ด้วย label selector, กระจาย traffic, ประเภท ClusterIP / NodePort / LoadBalancer
- **Short Answer:** Pod ถูกสร้างใหม่ได้ตลอดและ IP เปลี่ยนทุกครั้ง Service ให้ชื่อและ address ที่คงที่ แล้วส่ง traffic ไปหา Pod ที่ตรงกับ label ที่กำหนด
- **Mid-level Answer:** service อื่นเรียกด้วยชื่อ DNS ของ Service เช่น `orders` ใน namespace เดียวกัน ไม่ต้องรู้ว่าตอนนี้มีกี่ Pod อยู่ที่ไหน Service ส่ง traffic ให้เฉพาะ Pod ที่ ready แล้ว ถ้า label ไม่ตรงกับ selector Service จะไม่มี endpoint และ request จะล้มเหลว ประเภทที่ใช้บ่อยคือ ClusterIP สำหรับคุยกันภายใน ส่วนการเปิดออกภายนอกมักใช้ LoadBalancer หรือ Ingress ที่จัด routing ตาม host/path ได้หลาย service ผ่านทางเข้าเดียว
- **Common Wrong Answer:** "Service คือ Pod อีกตัวที่ทำหน้าที่ load balancer" — Service ไม่ใช่ Pod แต่เป็น object ที่บอกกฎ routing และถูกทำให้เกิดผลโดยส่วนประกอบ network ของ cluster
- **Follow-up:** Service ไม่มี endpoint จะ debug อย่างไร / Ingress ต่างจาก Service แบบ LoadBalancer อย่างไร

#### 🟡 Mid-level

**Q:** Liveness probe, Readiness probe และ Startup probe ต่างกันอย่างไร ตั้งผิดแล้วเกิดอะไร

- **Expected Concept:** liveness fail → restart container, readiness fail → เอาออกจาก Service endpoint แต่ไม่ restart, startup → ให้เวลาแอปที่เริ่มช้าก่อน probe อื่นเริ่ม, liveness ไม่ควรเช็ค dependency ภายนอก
- **Short Answer:** Liveness เช็คว่าแอปยังทำงานอยู่ไหม ถ้าไม่ผ่าน Kubernetes จะ restart container ส่วน Readiness เช็คว่าพร้อมรับ traffic ไหม ถ้าไม่ผ่านจะไม่ส่ง request มาแต่ไม่ restart
- **Mid-level Answer:** ความผิดพลาดที่ทำให้ระบบล่มทั้งกระดานคือเอาการเช็ค database ไปไว้ใน liveness พอ database ช้าชั่วคราว ทุก Pod fail liveness แล้ว restart พร้อมกัน ภาระยิ่งหนักกว่าเดิม liveness ควรเช็คแค่ว่า process ไม่ค้าง ส่วน readiness เช็คได้ว่าพร้อมให้บริการ แต่ต้องระวังเช็ค dependency ร่วมกันทุก Pod เพราะอาจทำให้ Pod หลุดจาก Service ทั้งหมดพร้อมกันเช่นกัน สำหรับแอปที่เริ่มนาน เช่น JVM ที่ต้อง warm up ถ้าไม่มี startup probe แล้ว liveness เริ่มเช็คเร็วเกินไป จะเกิด restart วนไม่รู้จบ
- **Common Wrong Answer:** "ตั้ง liveness กับ readiness ให้ชี้ endpoint เดียวกันที่เช็คทุกอย่าง" — รวมสองหน้าที่ที่ต่างกันเข้าด้วยกัน เป็นต้นเหตุ restart ที่ไม่จำเป็น
- **Follow-up:** CrashLoopBackOff เกิดจากอะไรได้บ้าง / probe มีผลต่อ rolling update อย่างไร

**Q:** ConfigMap กับ Secret ต่างกันอย่างไร Secret ปลอดภัยแค่ไหน

- **Expected Concept:** แยก config ออกจาก image, Secret โดย default แค่ encode base64 ไม่ได้เข้ารหัส, ต้องเปิด encryption at rest และคุมสิทธิ์ด้วย RBAC, พิจารณา external secret manager
- **Short Answer:** ทั้งสองใช้แยก config ออกจาก image ConfigMap เก็บค่าทั่วไป Secret เก็บค่าลับอย่าง password แต่ Secret แค่ encode เป็น base64 ซึ่งถอดกลับได้ทันที ไม่ได้เข้ารหัส
- **Mid-level Answer:** ความปลอดภัยของ Secret มาจากสิ่งที่ตั้งรอบ ๆ ไม่ใช่ตัว object: เปิด encryption at rest ในที่เก็บข้อมูลของ cluster, จำกัดสิทธิ์อ่าน Secret ด้วย RBAC ให้เฉพาะที่จำเป็น, ไม่ commit manifest ที่มี Secret จริงลง git (ใช้เครื่องมือเข้ารหัสหรือดึงจาก secret manager ภายนอก) อีกเรื่องคือถ้า inject เป็น environment variable ค่าจะไม่เปลี่ยนจนกว่า Pod จะ restart ถ้า mount เป็นไฟล์ Kubernetes จะอัปเดตไฟล์ให้หลังจากนั้นระยะหนึ่ง แต่แอปต้องอ่านไฟล์ใหม่เองด้วย
- **Common Wrong Answer:** "Secret เข้ารหัสแล้ว commit ลง git ได้" — base64 ไม่ใช่การเข้ารหัส ใครเห็นไฟล์ก็ถอดได้
- **Follow-up:** จะหมุน database password โดยไม่ downtime อย่างไร / ทำไม env var ที่เป็น secret ถึงเสี่ยงรั่วทาง log หรือ error report

#### 🔴 Senior

**Q:** จะ deploy version ใหม่บน Kubernetes อย่างไรให้ไม่มี request ล้มเหลวเลย (zero downtime)

- **Expected Concept:** rolling update (`maxUnavailable`, `maxSurge`), readiness probe ที่ถูกต้อง, graceful shutdown เมื่อได้ SIGTERM, ช่องว่างเวลาระหว่าง Pod ถูกลบกับ endpoint ถูกถอด (preStop), `terminationGracePeriodSeconds`, schema migration ที่เข้ากันได้ย้อนหลัง, PodDisruptionBudget
- **Short Answer:** ใช้ rolling update ให้ Pod ใหม่ขึ้นและผ่าน readiness ก่อนค่อยลบ Pod เก่า และให้แอปรับ SIGTERM แล้วทำ request ที่ค้างอยู่ให้เสร็จก่อนปิด
- **Mid-level Answer:** request ล้มระหว่าง deploy มักมาจากสามจุด: (1) Pod ใหม่รับ traffic ก่อนพร้อม — แก้ด้วย readiness probe ที่สะท้อนความพร้อมจริง (2) Pod เก่าถูกปิดทันทีทั้งที่ยังมี request — แอปต้องรับ SIGTERM หยุดรับงานใหม่และทำงานที่ค้างให้เสร็จภายใน grace period (3) การถอด Pod ออกจาก endpoint กับการส่ง SIGTERM เกิดขนานกัน traffic บางส่วนอาจยังวิ่งมาหา Pod ที่กำลังปิด จึงมักใส่ `preStop` ให้รอสั้น ๆ ก่อนเริ่มปิดตัว และต้องตั้ง grace period ให้ยาวพอ นอกเหนือจาก Kubernetes คือเรื่อง database: ช่วง rollout version เก่ากับใหม่รันพร้อมกัน schema ต้องใช้ได้กับทั้งสอง version จึงทำ migration แบบ expand → migrate → contract แยกเป็นหลาย release แล้วยังต้องมี metric error rate ระหว่าง rollout และตั้งให้ rollback ได้เร็ว หรือใช้ canary ส่ง traffic ส่วนน้อยไปก่อนถ้าความเสี่ยงสูง
- **Common Wrong Answer:** "ใช้ Deployment อยู่แล้วเลย zero downtime อัตโนมัติ" — rolling update เป็นแค่เครื่องมือ ถ้าแอปไม่ทำ graceful shutdown หรือ readiness ตั้งผิด ยังมี request ล้มทุกครั้งที่ deploy
- **Follow-up:** ถ้า migration ต้องเปลี่ยนชื่อคอลัมน์จะทำอย่างไรให้ไม่ downtime / canary กับ blue-green ต่างกันอย่างไร

---

### 6.13 Testing

> ทบทวนเนื้อหาเต็มที่ [PART 18 — Testing](./part-18-testing.md)

#### 🟢 Junior

**Q:** Unit test, Integration test และ E2E test ต่างกันอย่างไร

- **Expected Concept:** ขอบเขตที่ทดสอบ, ความเร็ว, ความเปราะ, ความมั่นใจที่ได้, test pyramid
- **Short Answer:** Unit test ทดสอบ function หรือ class เดียวแยกจากส่วนอื่น Integration test ทดสอบหลายส่วนทำงานร่วมกัน เช่น API กับ database E2E test ทดสอบทั้งระบบผ่านมุมผู้ใช้ เช่น เปิด browser แล้วกด
- **Mid-level Answer:** ยิ่งกว้างยิ่งมั่นใจว่าผู้ใช้ใช้ได้จริง แต่ก็ยิ่งช้า แพง และเปราะ แนวคิด test pyramid จึงแนะนำให้มี unit เยอะ integration พอประมาณ และ E2E เฉพาะ flow สำคัญ เช่น login และ checkout บางทีมโดยเฉพาะฝั่ง frontend เน้น integration มากกว่า เพราะ unit test ที่ mock ทุกอย่างอาจผ่านทั้งที่ของจริงพัง สัดส่วนที่เหมาะขึ้นกับว่า bug ของระบบนั้นมักเกิดที่ไหน
- **Common Wrong Answer:** "E2E ครอบคลุมที่สุด ควรเขียน E2E อย่างเดียว" — CI จะช้าและ test พังบ่อยด้วยเหตุผลที่ไม่ใช่ bug จนทีมเลิกเชื่อผล test
- **Follow-up:** ถ้ามีเวลาเขียน test ได้แค่ไม่กี่ตัวจะเขียนอะไรก่อน / test pyramid กับ testing trophy ต่างกันอย่างไร

**Q:** Mock คืออะไร ใช้เมื่อไร และมีความเสี่ยงอะไร

- **Expected Concept:** แทนที่ dependency ด้วยของปลอมที่ควบคุมได้, ใช้กับของที่ช้า ไม่แน่นอน หรือมีผลข้างเคียง, mock มากไปทำให้ test ผูกกับ implementation
- **Short Answer:** Mock คือของปลอมที่ใช้แทนของจริงใน test เช่น แทน API ภายนอกหรือ payment gateway ให้ตอบค่าที่เรากำหนด ทำให้ test เร็วและไม่ขึ้นกับระบบอื่น
- **Mid-level Answer:** เหมาะกับสิ่งที่อยู่นอกการควบคุม เช่น API ภายนอก, เวลา, ค่า random, การส่ง email ความเสี่ยงคือ mock ไม่ได้บอกว่าของจริงทำงานแบบนั้นจริง ถ้า API ภายนอกเปลี่ยน format test ยังผ่านแต่ production พัง และถ้า mock ทุก function ภายในด้วย test จะพังทุกครั้งที่ refactor แม้พฤติกรรมไม่เปลี่ยน หลักคือ mock ที่ขอบระบบ ไม่ mock ของภายในที่เราเป็นเจ้าของ และมี integration หรือ contract test เสริมสำหรับจุดเชื่อมต่อจริง
- **Common Wrong Answer:** "mock ทุกอย่างจะได้เป็น unit test แท้ ๆ" — test จะยืนยันแค่ว่า code เรียก function ตามที่เราเขียนไว้ ไม่ได้ยืนยันว่าผลลัพธ์ถูก
- **Follow-up:** mock, stub และ fake ต่างกันอย่างไร / จะ test code ที่ขึ้นกับเวลาปัจจุบันอย่างไร

#### 🟡 Mid-level

**Q:** Flaky test คืออะไร เกิดจากอะไร และจะจัดการอย่างไร

- **Expected Concept:** test ที่ผ่านบ้างไม่ผ่านบ้างโดย code ไม่เปลี่ยน, สาเหตุ (เวลา/timing, ลำดับ test, state ร่วม, network, ข้อมูลไม่แยก), ผลเสียต่อความเชื่อมั่น, แยกออกและแก้
- **Short Answer:** Flaky test คือ test ที่บางครั้งผ่านบางครั้งไม่ผ่านทั้งที่ code เหมือนเดิม มักเกิดจากการรอเวลาแบบ fix ค่า การพึ่ง network หรือ test ที่ใช้ข้อมูลร่วมกัน
- **Mid-level Answer:** สาเหตุที่เจอบ่อย: รอด้วย sleep แทนการรอเงื่อนไข, test ขึ้นกับลำดับการรันเพราะใช้ state หรือข้อมูลใน database ร่วมกัน, พึ่งเวลาจริงหรือ timezone, เรียก service ภายนอกจริง, และ async ที่ไม่ได้ await วิธีจัดการคือเก็บสถิติว่าตัวไหน flaky, แยกออกจาก pipeline หลักชั่วคราวพร้อม ticket และเจ้าของ แล้วแก้ที่ต้นเหตุ เช่น รอ element หรือ event แทนรอเวลา สร้างข้อมูลแยกต่อ test รัน test แบบสุ่มลำดับเพื่อจับ dependency ที่ซ่อนอยู่ ผลเสียจริงของ flaky test คือทีมเริ่มกด re-run จนเคยชิน แล้วมองข้าม failure ที่เป็น bug จริง
- **Common Wrong Answer:** "ตั้ง retry 3 ครั้งใน CI ก็จบ" — เป็น mitigation ชั่วคราวได้ แต่ถ้าไม่แก้ต้นเหตุจะซ่อน race condition ที่อาจเป็น bug ของ production จริง
- **Follow-up:** test ผ่านบนเครื่องแต่ fail บน CI มีสาเหตุอะไรได้บ้าง / จะแยกข้อมูลใน database ระหว่าง test อย่างไร

**Q:** Code coverage 100% แปลว่า code ไม่มี bug ไหม ควรตั้งเป้า coverage อย่างไร

- **Expected Concept:** coverage วัดว่าบรรทัดถูกรัน ไม่ได้วัดว่า assert ถูก, line vs branch coverage, ใช้หาจุดที่ไม่มี test มากกว่าเป็นเป้าหมาย, เน้น business logic สำคัญ
- **Short Answer:** ไม่ใช่ coverage บอกแค่ว่า code ถูกรันระหว่าง test แต่ไม่ได้บอกว่าเราตรวจผลลัพธ์ถูกหรือครอบคลุมทุกกรณี test ที่ไม่มี assert เลยก็ทำให้ coverage สูงได้
- **Mid-level Answer:** coverage มีประโยชน์ในการชี้ว่า "ส่วนไหนไม่มี test เลย" โดยเฉพาะ branch coverage ที่บอกว่าเงื่อนไข if/else ถูกทดสอบครบทั้งสองทางไหม แต่ถ้าตั้งเป็นตัวเลขบังคับ ทีมมักเขียน test แค่ให้ตัวเลขถึง แนวทางที่ได้ผลกว่าคือเน้น test ให้แน่นในส่วนที่เสี่ยงและสำคัญต่อธุรกิจ เช่น คำนวณเงิน สิทธิ์การเข้าถึง และใช้กฎว่า coverage ของ code ใหม่ไม่ควรต่ำลง ถ้าอยากวัดคุณภาพของ test จริง ๆ มี mutation testing ที่แก้ code ทีละจุดแล้วดูว่า test จับได้ไหม
- **Common Wrong Answer:** "ต้อง 100% ถึงจะปลอดภัย" หรือตรงข้าม "coverage ไม่มีประโยชน์" — ทั้งสองสุดโต่ง coverage เป็นเครื่องมือชี้จุด ไม่ใช่เป้าหมายในตัวเอง
- **Follow-up:** จะทำให้ทีมเขียน test ที่มีคุณภาพได้อย่างไร / ส่วนไหนของระบบที่ไม่คุ้มจะเขียน test

#### 🔴 Senior

**Q:** ระบบมี 8 microservices แต่ละทีมดูแลเอง E2E test ช้าและพังบ่อยจนไม่มีใครเชื่อ คุณจะวาง testing strategy ใหม่อย่างไร

- **Expected Concept:** ลด E2E เหลือ flow สำคัญ, contract testing ระหว่าง service, test ในระดับ service ด้วย dependency จริงที่ควบคุมได้, แยก test ตามความเร็วใน pipeline, test ใน production ด้วย monitoring / canary / synthetic check
- **Short Answer:** ลด E2E ให้เหลือเฉพาะ flow ที่สำคัญที่สุด แล้วเพิ่ม contract test เพื่อตรวจว่า API ระหว่าง service ยังตรงกัน ให้แต่ละ service ทดสอบตัวเองได้โดยไม่ต้องรันทั้งระบบ
- **Mid-level Answer:** ปัญหาหลักของ E2E ข้ามหลาย service คือทุก test ต้องการให้ทุก service อยู่ในสภาพพร้อมพร้อมกัน ความน่าจะเป็นที่อย่างใดอย่างหนึ่งพังจึงสูง แนวทาง: (1) แต่ละ service มี unit และ integration test ของตัวเองกับ database และ dependency ที่รันใน container ระหว่าง test (2) ใช้ consumer-driven contract testing ฝั่งผู้เรียกประกาศสิ่งที่คาดหวังจาก API ฝั่งผู้ให้บริการตรวจใน CI ของตัวเองว่ายังตอบตามนั้น ทำให้รู้ตัวก่อน deploy ว่าจะทำให้ใครพัง (3) เหลือ E2E ไม่กี่ตัวสำหรับ flow ที่ทำเงิน รันบน environment ที่เสถียรและใช้ข้อมูลที่จัดเตรียมเอง (4) ยอมรับว่า test ก่อน deploy จับไม่ได้ทุกอย่าง จึงต้องมี canary, feature flag, synthetic monitoring และ alert ที่ดีเพื่อจับหลัง deploy trade-off คือ contract testing ต้องการวินัยและเครื่องมือร่วมกันระหว่างทีม และต้องมีคนผลักดันช่วงแรก
- **Common Wrong Answer:** "เพิ่ม E2E ให้ครอบคลุมกว่าเดิม" หรือ "จ้าง QA มากดเพิ่ม" — ทำให้ feedback ช้าลงอีกและไม่แก้ปัญหาที่ test ผูกกันทั้งระบบ
- **Follow-up:** จะวัดได้อย่างไรว่า strategy ใหม่ดีขึ้น (เวลา CI, อัตรา flaky, bug ที่หลุดถึง production) / test data ใน environment ร่วมจัดการอย่างไร

---

### 6.14 Git

> ทบทวนเนื้อหาเต็มที่ [PART 19 — Git](./part-19-git.md)

#### 🟢 Junior

**Q:** `git fetch` กับ `git pull` ต่างกันอย่างไร

- **Expected Concept:** fetch ดึงข้อมูลจาก remote มาอัปเดต remote-tracking branch โดยไม่แตะ branch ที่ทำงานอยู่, pull = fetch + merge (หรือ rebase ถ้าตั้งค่า)
- **Short Answer:** `fetch` ดึงของใหม่จาก remote มาเก็บไว้ดูก่อน ยังไม่รวมเข้ากับ branch ที่เราทำงาน ส่วน `pull` คือ fetch แล้วรวมเข้ามาให้ทันที
- **Mid-level Answer:** fetch ปลอดภัยเสมอเพราะไม่เปลี่ยนไฟล์ที่เรากำลังทำ ใช้ดูก่อนว่ามีอะไรเปลี่ยน เช่นเทียบ branch ของเรากับ `origin/main` แล้วค่อยตัดสินใจว่าจะ merge หรือ rebase ส่วน pull ถ้า branch แยกทางกันจะสร้าง merge commit หรือ rebase ขึ้นกับการตั้งค่า บางทีมตั้งให้ pull เป็น rebase เพื่อให้ประวัติเป็นเส้นตรง
- **Common Wrong Answer:** "fetch คือ download โค้ดใหม่มาทับไฟล์ในเครื่อง" — fetch ไม่เปลี่ยน working directory เลย
- **Follow-up:** `origin/main` กับ `main` ต่างกันอย่างไร / pull แล้วเกิด conflict ทำอย่างไร

**Q:** เจอ merge conflict ต้องทำอย่างไร

- **Expected Concept:** conflict เกิดเมื่อสองฝั่งแก้บรรทัดเดียวกันหรือใกล้กัน, เปิดไฟล์ดู marker, ตัดสินใจจากความหมายของ code, test ก่อน commit, คุยกับเจ้าของอีกฝั่งถ้าไม่แน่ใจ
- **Short Answer:** เปิดไฟล์ที่ conflict ดูส่วนที่มีเครื่องหมาย `<<<<<<<`, `=======`, `>>>>>>>` เลือกหรือรวม code ให้ถูก ลบเครื่องหมายออก แล้ว `git add` และ commit (หรือ continue ถ้ากำลัง rebase)
- **Mid-level Answer:** ขั้นสำคัญไม่ใช่การลบ marker แต่คือเข้าใจว่าแต่ละฝั่งตั้งใจทำอะไร บางครั้งคำตอบที่ถูกคือเอาทั้งสองฝั่งรวมกันใหม่ ไม่ใช่เลือกฝั่งเดียว หลังแก้ต้องรัน test เพราะ code ที่ไม่มี conflict ในระดับข้อความอาจยังพังในระดับ logic ถ้าไม่แน่ใจให้ถามคนที่แก้อีกฝั่ง การป้องกันคือ merge หรือ rebase จาก main บ่อย ๆ และทำ PR ให้เล็ก
- **Common Wrong Answer:** "เลือก 'accept mine' ทั้งหมดให้จบ ๆ" — ทำให้งานของอีกคนหายไปเงียบ ๆ เป็นหนึ่งในวิธีที่ bug หายไปแล้วกลับมาใหม่
- **Follow-up:** ถ้าแก้ conflict แล้วรู้สึกว่าพัง จะยกเลิกการ merge อย่างไร (`git merge --abort`) / ทำไม PR ใหญ่ ๆ ถึง conflict บ่อย

#### 🟡 Mid-level

**Q:** `merge` กับ `rebase` ต่างกันอย่างไร ใช้เมื่อไร

- **Expected Concept:** merge รักษาประวัติจริงและสร้าง merge commit, rebase เขียนประวัติใหม่ให้เป็นเส้นตรง (commit ใหม่ hash ใหม่), ห้าม rebase branch ที่คนอื่นใช้ร่วม
- **Short Answer:** merge รวม branch โดยสร้าง commit ที่เชื่อมสองเส้นเข้าด้วยกัน ประวัติจริงอยู่ครบ ส่วน rebase ย้าย commit ของเราไปต่อท้าย branch ปลายทาง ทำให้ประวัติเป็นเส้นตรง
- **Mid-level Answer:** rebase สร้าง commit ใหม่ที่มี hash ใหม่ทั้งหมด ถ้าทำกับ branch ที่คนอื่น pull ไปแล้วแล้ว force push ประวัติของคนอื่นจะไม่ตรงกับ remote และงานอาจหาย กฎที่ใช้คือ rebase ได้กับ branch ส่วนตัวที่ยังไม่มีคนอื่นใช้ เช่นอัปเดต feature branch ให้ทันกับ main ก่อนเปิด PR แต่ branch ที่ใช้ร่วมกันให้ merge ถ้าจำเป็นต้อง force push branch ของตัวเอง ให้ใช้ `--force-with-lease` ซึ่งจะไม่ทับถ้ามีคนอื่น push เข้ามาระหว่างนั้น การเลือกระหว่าง squash, merge commit หรือ rebase ตอนรวม PR เป็นข้อตกลงของทีม
- **Common Wrong Answer:** "rebase ดีกว่าเพราะประวัติสวย ใช้ได้ทุกกรณี" — ไม่ได้พูดถึงความเสี่ยงของการเขียนประวัติใหม่บน branch ร่วม
- **Follow-up:** interactive rebase ใช้ทำอะไร / squash merge มีข้อดีข้อเสียอะไรต่อการหา bug ย้อนหลัง

**Q:** push commit ที่มี bug ขึ้น main ไปแล้ว จะย้อนอย่างไร `revert` กับ `reset` ต่างกันอย่างไร

- **Expected Concept:** revert สร้าง commit ใหม่ที่กลับผลของ commit เดิม ปลอดภัยกับ branch ที่ share แล้ว, reset ย้าย branch pointer กลับ (เขียนประวัติใหม่) ใช้กับงานในเครื่องที่ยังไม่ push, reflog ช่วยกู้
- **Short Answer:** ถ้า push ไปแล้วให้ใช้ `git revert` ซึ่งสร้าง commit ใหม่ที่ยกเลิกผลของ commit ที่มีปัญหา ประวัติเดิมยังอยู่ ส่วน `reset` ใช้กับ commit ที่ยังอยู่แค่ในเครื่องเรา
- **Mid-level Answer:** reset ย้าย branch กลับไปที่ commit ก่อนหน้า ถ้าทำกับ main ที่ share แล้วต้อง force push ซึ่งทำให้ทุกคนที่ pull ไปแล้วมีประวัติขัดกัน main ส่วนใหญ่จึงถูก protect ห้าม force push อยู่แล้ว revert จึงเป็นวิธีมาตรฐาน ถ้า commit ที่มีปัญหาเป็น merge commit ต้องระบุว่าจะยึดฝั่งไหนเป็นหลัก (`-m`) และต้องจำว่าถ้าจะ merge branch นั้นกลับเข้ามาใหม่ภายหลังอาจต้อง revert ตัว revert ก่อน สิ่งที่ควรรู้คือ `reset --hard` ในเครื่องที่ทำพลาดยังกู้ได้ผ่าน `git reflog` ตราบใดที่ commit เคยถูกสร้างไว้และยังไม่ถูกเก็บกวาด
- **Common Wrong Answer:** "reset --hard แล้ว force push main" — แก้ปัญหาหนึ่งแต่สร้างปัญหาให้ทั้งทีม หรือ "แก้ไฟล์กลับเองแล้ว commit ใหม่" ซึ่งทำได้แต่เสี่ยงลืมบางไฟล์และไม่สื่อว่าเป็นการย้อน commit ไหน
- **Follow-up:** ถ้าเผลอ commit API key ขึ้น repo แล้วจะทำอย่างไร (ต้องถือว่ารั่วแล้ว หมุน key ทันที การลบจากประวัติเป็นขั้นตอนรอง) / `reset --soft`, `--mixed`, `--hard` ต่างกันอย่างไร

#### 🔴 Senior

**Q:** ทีมกำลังเลือกระหว่าง GitFlow กับ Trunk-based development คุณจะแนะนำอย่างไร

- **Expected Concept:** GitFlow มี branch อายุยาว (develop, release, hotfix) เหมาะกับ release เป็นรอบ, trunk-based ใช้ branch สั้นและรวมเข้า main บ่อย ต้องมี CI แข็งแรงและ feature flag, ขึ้นกับความถี่ในการ release และความพร้อมของทีม
- **Short Answer:** ถ้าทีม deploy บ่อยและมี automated test ดี trunk-based ช่วยลด conflict และ release ได้เร็ว ถ้าต้อง release เป็นรอบและดูแลหลาย version พร้อมกัน เช่น แอป mobile หรือ software ที่ลูกค้าติดตั้งเอง GitFlow หรือรูปแบบที่มี release branch อาจเหมาะกว่า
- **Mid-level Answer:** ตัดสินจากสามคำถาม: (1) release บ่อยแค่ไหน ถ้าหลายครั้งต่อวัน branch อายุยาวจะเป็นภาระ (2) ต้องดูแลหลาย version ที่อยู่กับลูกค้าหรือไม่ (3) มี CI ที่เชื่อถือได้และ test เพียงพอหรือยัง trunk-based ไม่ได้แปลว่า push อะไรก็ได้เข้า main งานที่ยังไม่เสร็จต้องซ่อนด้วย feature flag ซึ่งมีต้นทุนต้องตามลบ flag เก่าทิ้ง ส่วน GitFlow ให้ความรู้สึกควบคุมได้แต่ branch ที่แยกกันนานทำให้ merge ใหญ่และหา bug ยาก ในทางปฏิบัติหลายทีมใช้แบบกลาง ๆ คือ main เดียว + feature branch อายุสั้น + PR review + ตัด release branch เฉพาะเมื่อจำเป็น ถ้าจะย้ายวิธีควรทำเป็นขั้นและวัดผล เช่น ระยะเวลาจาก commit ถึง production และจำนวน incident หลัง deploy
- **Common Wrong Answer:** "Trunk-based ดีกว่าเพราะบริษัทใหญ่ใช้" — อ้างตามคนอื่นโดยไม่ดู context ของทีมที่ยังไม่มี test และ CI รองรับ
- **Follow-up:** feature flag ที่ค้างนานสร้างปัญหาอะไร / จะทำ hotfix ใน trunk-based อย่างไร

---

### 6.15 Architecture

> ทบทวนเนื้อหาเต็มที่ [PART 17 — Architecture](./part-17-architecture.md)

#### 🟢 Junior

**Q:** Monolith กับ Microservices ต่างกันอย่างไร

- **Expected Concept:** monolith = deploy เป็นหน่วยเดียว, microservices = แยก service ที่ deploy และ scale อิสระ แต่ละตัวเป็นเจ้าของข้อมูลของตัวเอง, ต้นทุนของระบบกระจาย
- **Short Answer:** Monolith คือแอปก้อนเดียว deploy ทีเดียวทั้งหมด Microservices คือแบ่งระบบเป็นหลาย service เล็ก ๆ แต่ละตัว deploy และ scale แยกกันได้
- **Mid-level Answer:** microservices ช่วยให้หลายทีมทำงานและ deploy แยกกันได้โดยไม่รอกัน และ scale เฉพาะส่วนที่หนักได้ แต่แลกกับความซับซ้อนของระบบกระจาย: network ล่มได้ ต้องมี monitoring และ tracing ข้าม service, transaction ข้าม service ทำยาก, deploy และ debug ยากขึ้น สำหรับทีมเล็กหรือ product ที่ยังหา requirement อยู่ monolith ที่แบ่ง module ภายในชัดเจน (modular monolith) มักเหมาะกว่าและแยกออกทีหลังได้
- **Common Wrong Answer:** "Microservices ทันสมัยกว่า scale ได้ดีกว่า ควรใช้ตั้งแต่เริ่ม" — ไม่พูดถึงต้นทุน และ monolith ก็ scale แนวนอนได้โดยรันหลาย instance
- **Follow-up:** ถ้า microservices สองตัวต้องใช้ database เดียวกันเป็นปัญหาไหม / service ควรเล็กแค่ไหน

**Q:** REST API ที่ดีควรเป็นอย่างไร และ HTTP method ที่เป็น idempotent คืออะไร

- **Expected Concept:** resource เป็นคำนาม, ใช้ HTTP method ตามความหมาย, status code ที่ถูกต้อง, idempotent = เรียกซ้ำกี่ครั้งผลต่อ server เท่ากับเรียกครั้งเดียว (GET, PUT, DELETE), POST ไม่ idempotent โดยธรรมชาติ
- **Short Answer:** ใช้ URL เป็นคำนามแทน resource เช่น `/orders/123` และใช้ method บอกการกระทำ GET อ่าน POST สร้าง PUT/PATCH แก้ DELETE ลบ ตอบ status code ให้ตรงความหมาย เช่น 201 สร้างสำเร็จ 404 ไม่พบ Idempotent คือเรียกซ้ำหลายครั้งแล้วผลเหมือนเรียกครั้งเดียว
- **Mid-level Answer:** idempotency สำคัญในโลกจริงเพราะ network หลุดได้ client ไม่รู้ว่า request แรกสำเร็จหรือไม่ จึง retry GET, PUT และ DELETE ถูกออกแบบให้ retry ได้อย่างปลอดภัย แต่ POST สร้าง order ซ้ำได้ถ้า retry ระบบที่เกี่ยวกับเงินจึงใช้ idempotency key: client ส่ง key เฉพาะมากับ request server จำไว้ ถ้าเจอ key เดิมก็ตอบผลเดิมโดยไม่สร้างใหม่ เรื่องอื่นที่ API ที่ดีต้องมีคือ pagination, รูปแบบ error ที่สม่ำเสมอ และแผน versioning เมื่อต้องเปลี่ยนแบบไม่เข้ากันกับของเดิม
- **Common Wrong Answer:** "Idempotent คือ response เหมือนเดิมทุกครั้ง" — คำนิยามอยู่ที่ผลต่อสถานะของ server ไม่ใช่ response เช่น DELETE ครั้งที่สองอาจได้ 404 แต่สถานะของ server เหมือนเดิมคือ resource ไม่อยู่แล้ว
- **Follow-up:** PUT กับ PATCH ต่างกันอย่างไร / จะเปลี่ยน API โดยไม่ทำให้ client เก่าพังอย่างไร

#### 🟡 Mid-level

**Q:** จะใส่ cache ให้ API ที่อ่านข้อมูลบ่อยอย่างไร และจะจัดการข้อมูลเก่าใน cache อย่างไร

- **Expected Concept:** cache-aside pattern, TTL, invalidation เมื่อข้อมูลเปลี่ยน, cache stampede, cache อะไรได้/ไม่ได้, วัด hit rate
- **Short Answer:** ใช้ cache-aside คืออ่านจาก cache ก่อน ถ้าไม่มีค่อยอ่าน database แล้วเก็บลง cache พร้อม TTL เมื่อข้อมูลถูกแก้ให้ลบ key นั้นใน cache เพื่อให้อ่านใหม่ครั้งถัดไป
- **Mid-level Answer:** คำถามแรกคือ "ยอมให้ข้อมูลเก่าได้นานแค่ไหน" ถ้ายอมได้ไม่กี่วินาทีถึงนาที TTL อย่างเดียวก็พอและเรียบง่าย ถ้าต้องสดทันทีต้อง invalidate ตอนเขียน ซึ่งต้องระวังลำดับ: มักเขียน database ก่อนแล้วลบ cache ไม่ใช่อัปเดต cache ตรง ๆ เพื่อลดโอกาสข้อมูลค้างผิดเมื่อมีการเขียนพร้อมกัน ปัญหาที่เจอบน production คือ cache stampede — key ยอดนิยมหมดอายุแล้ว request จำนวนมากวิ่งไป database พร้อมกัน แก้ด้วยการให้ request เดียวไปโหลดขณะที่ตัวอื่นรอ หรือสุ่ม TTL ไม่ให้หมดพร้อมกัน ต้องระวังไม่ cache ข้อมูลเฉพาะผู้ใช้ด้วย key ที่ใช้ร่วมกัน และต้องออกแบบให้ระบบยังทำงานได้ (แม้ช้าลง) เมื่อ cache ล่ม
- **Common Wrong Answer:** "ใส่ cache แล้วเร็วขึ้นแน่นอน ใส่ทุก endpoint" — ถ้า hit rate ต่ำ cache เพิ่มแค่ latency และความซับซ้อน และข้อมูลเก่าอาจทำให้เกิด bug ทางธุรกิจ
- **Follow-up:** Redis ล่มแล้วระบบจะเป็นอย่างไร / cache ที่ระดับ CDN, application และ database ต่างกันอย่างไร

**Q:** Message Queue มีไว้ทำไม และต้องระวังอะไรเมื่อใช้

- **Expected Concept:** ทำงานแบบ asynchronous, decouple ผู้ส่งกับผู้รับ, รองรับ traffic พุ่ง (buffer), retry, at-least-once delivery ทำให้ต้องมี idempotent consumer, dead letter queue, ลำดับข้อความ
- **Short Answer:** Queue ใช้แยกงานที่ไม่ต้องทำทันทีออกไปทำเบื้องหลัง เช่น ส่ง email หลังสั่งซื้อ ผู้ส่งไม่ต้องรอ และถ้าฝั่งประมวลผลช้าหรือล่มชั่วคราว งานจะรออยู่ในคิวไม่หายไป
- **Mid-level Answer:** ข้อดีคือรับ traffic พุ่งได้โดยให้ worker ค่อย ๆ ทำ และแต่ละฝั่ง scale หรือล่มได้โดยไม่ลากกันไป แต่ระบบ queue ส่วนใหญ่รับประกันแบบ at-least-once คือข้อความอาจถูกส่งซ้ำ consumer จึงต้อง idempotent เช่น เช็คจาก id ของข้อความว่าเคยทำแล้วหรือยัง ข้อความที่ fail ซ้ำ ๆ ต้องไปอยู่ใน dead letter queue ไม่ให้ขวางคิว และต้องมี monitoring ความยาวคิวกับอายุข้อความ อีกปัญหาคือการเขียน database แล้วส่งข้อความเป็นสองขั้นแยกกัน ถ้าพังระหว่างกลางจะไม่ตรงกัน รูปแบบที่ใช้แก้คือ outbox pattern ที่บันทึกข้อความลงตารางใน transaction เดียวกับข้อมูลแล้วค่อยส่งออก
- **Common Wrong Answer:** "ใช้ queue แล้วรับประกันว่าข้อความจะถูกประมวลผลครั้งเดียวพอดี" — exactly-once end-to-end ทำได้ยากและมีเงื่อนไข ส่วนใหญ่ต้องออกแบบ consumer ให้รับการส่งซ้ำได้
- **Follow-up:** ถ้าต้องรักษาลำดับข้อความของลูกค้าคนเดียวกันจะทำอย่างไร / queue แบบ job queue กับ event streaming ต่างกันอย่างไร

#### 🔴 Senior

**Q:** บริษัทมี monolith อายุ 6 ปีที่ deploy ยากและทีมโตขึ้นเป็น 40 คน ผู้บริหารอยากย้ายไป microservices คุณจะเข้าหาเรื่องนี้อย่างไร

- **Expected Concept:** หาปัญหาจริงก่อน (deploy ช้า? ทีมชนกัน? scale?), modular monolith เป็นขั้นแรก, แยกตาม bounded context, strangler fig pattern, data ownership, saga แทน distributed transaction, platform พร้อมก่อน (CI/CD, observability), ทำทีละส่วนและวัดผล
- **Short Answer:** ถามก่อนว่าปัญหาจริงคืออะไร แล้วค่อย ๆ แยกทีละส่วนที่มีขอบเขตชัด โดยให้ของใหม่มารับหน้าที่แทนของเก่าทีละส่วน (strangler fig) ไม่เขียนใหม่ทั้งระบบทีเดียว
- **Mid-level Answer:** เริ่มจากทำให้ชัดว่า microservices แก้ปัญหาอะไร ถ้าปัญหาคือ deploy ช้าเพราะ test ช้าและไม่มี CI อาจแก้ได้ในตัว monolith เลย ถ้าปัญหาคือหลายทีมชนกันในโค้ดเดียว ขั้นแรกคือจัด module ภายในให้มีขอบเขตชัดตาม domain (bounded context) และห้ามเข้าถึงข้อมูลข้าม module ตรง ๆ เพราะถ้าแบ่ง module ในโค้ดเดียวยังไม่ได้ แยกเป็น service ก็จะได้ distributed monolith ที่แย่กว่าเดิม จากนั้นเลือกส่วนที่ขอบเขตชัดและเปลี่ยนบ่อยแยกออกก่อน ใช้ strangler fig ให้ traffic ของส่วนนั้นค่อย ๆ ย้ายไป service ใหม่ แต่ละ service ต้องเป็นเจ้าของข้อมูลของตัวเอง การทำงานข้าม service ใช้ saga กับ event แทน transaction เดียว ก่อนเริ่มต้องมี platform ขั้นต่ำคือ CI/CD ต่อ service, centralized logging, tracing และ alert trade-off ที่ต้องบอกผู้บริหารตรง ๆ คือช่วง migrate จะช้าลงก่อนเร็วขึ้น และต้องกำหนดตัวชี้วัด เช่น deploy frequency และ lead time เพื่อดูว่าคุ้มจริง
- **Common Wrong Answer:** "เขียนใหม่ทั้งหมดเป็น microservices ใน 6 เดือน" — big-bang rewrite มีความเสี่ยงสูงมาก ต้องทำ feature ใหม่ไปพร้อมกับตามทันของเก่า และมักใช้เวลานานกว่าแผนมาก
- **Follow-up:** distributed monolith คืออะไร สังเกตได้อย่างไร / saga แบบ choreography กับ orchestration ต่างกันอย่างไร / ข้อมูลที่หลาย service ต้องอ่านร่วมกันจะจัดการอย่างไร

---

## 7. Compare

### 7.1 คำตอบระดับ Junior / Mid / Senior ต่างกันตรงไหน (ตัวอย่างคำถามเดียวกัน: "Index คืออะไร")

| ระดับ | สิ่งที่พูด | สิ่งที่ผู้สัมภาษณ์จด |
|---|---|---|
| 🟢 Junior | "Index ช่วยให้ค้นหาเร็วขึ้น เหมือนสารบัญหนังสือ" | เข้าใจ concept พื้นฐาน |
| 🟢 Junior ที่แข็ง | + "ตอนทำ project ผมใส่ index ที่ email เพราะ login ต้องหาจาก email ทุกครั้ง" | เคยใช้จริง |
| 🟡 Mid-level | + "แต่ index ทำให้เขียนช้าลง และ composite index ต้องเรียงคอลัมน์ตาม query ผมเช็คด้วย EXPLAIN" | รู้ trade-off และวิธีตรวจ |
| 🔴 Senior | + "บนตารางที่เขียนหนักผมเลือกลด index ที่ไม่ถูกใช้ โดยดูจากสถิติการใช้ index ก่อนลบ และสร้าง index บนตารางใหญ่แบบไม่ lock ตาราง" | คิดถึงผลต่อ production และการ operate |

### 7.2 "ไม่รู้" แบบที่ได้คะแนน vs แบบที่เสียคะแนน

| แบบที่เสียคะแนน | แบบที่ได้คะแนน |
|---|---|
| เงียบนาน แล้วตอบ "ไม่ทราบครับ" | "ส่วนนี้ผมไม่เคยใช้ตรง ๆ แต่ขอลองคิดจากหลักการนะครับ..." |
| เดาด้วยความมั่นใจเต็มร้อย | บอกระดับความมั่นใจ: "ผมค่อนข้างแน่ใจเรื่อง A แต่ B ต้องไปเช็คเพิ่ม" |
| พูดศัพท์เยอะ ๆ ให้ดูเหมือนรู้ | พูดสิ่งที่รู้แน่ ๆ ให้ชัด แล้วบอกขอบเขตที่ไม่รู้ |
| เปลี่ยนเรื่องไปพูดสิ่งที่ตัวเองรู้ | ถามกลับเพื่อจำกัดโจทย์ แล้วค่อยตอบในขอบเขตนั้น |

### 7.3 Technical Interview vs System Design vs Behavioral

| | Technical | System Design | Behavioral |
|---|---|---|---|
| ถามอะไร | concept, code, debugging | ออกแบบระบบตามโจทย์ | เหตุการณ์ในอดีต |
| คำตอบที่ดีเริ่มจาก | นิยามสั้น ๆ | ถาม requirement และขนาดของระบบ | บริบทของเหตุการณ์ (STAR) |
| กับดัก | ตอบแค่ definition | วาด architecture ทันทีโดยไม่ถาม | เล่าแต่ "เรา" ไม่บอกว่า "ผม" ทำอะไร |
| สิ่งที่ชนะ | trade-off + ตัวอย่างจริง | พูดถึงจุดที่จะพังและวิธีรับมือ | สิ่งที่เรียนรู้และเปลี่ยนหลังจากนั้น |

### 7.4 ถามกลับ (Scope Question) ที่ดี vs ที่ไม่ดี

| ไม่ดี | ดี | เพราะอะไร |
|---|---|---|
| "ต้องใช้ภาษาอะไรครับ" (ทั้งที่โจทย์บอกแล้ว) | "input ว่างหรือเป็น null ได้ไหมครับ" | ถามเรื่อง edge case แสดงว่าคิดถึงความถูกต้อง |
| "ต้องทำให้ scale ไหมครับ" | "ผู้ใช้ประมาณกี่คน อ่านมากกว่าเขียนไหมครับ" | ตัวเลขทำให้การออกแบบมีฐาน |
| ไม่ถามอะไรเลยแล้วเริ่มทำ | "ขอสรุปโจทย์ก่อนนะครับว่า... ถูกไหม" | กันการตอบผิดโจทย์ทั้งข้อ |

---

## 8. Common Mistakes

| ความผิดพลาด | ทำไมเสียคะแนน | แก้อย่างไร |
|---|---|---|
| ท่องคำตอบเป็นประโยค | พอ follow-up เปลี่ยนมุมนิดเดียวก็ตอบไม่ได้ ผู้สัมภาษณ์รู้ทันทีว่าท่องมา | จำเป็น "โครง" 4 จังหวะ (ดูหัวข้อ 11) ไม่จำประโยค |
| ตอบยาวรวดเดียว 5 นาที | ผู้สัมภาษณ์ถามต่อไม่ได้ เสียเวลาคำถามอื่น | ตอบ 60–90 วินาทีแล้วถาม "ให้ลงรายละเอียดส่วนไหนต่อไหมครับ" |
| บอกว่า "A ดีกว่า B" โดยไม่มีเงื่อนไข | ฟังเหมือนยังไม่เคยเจอกรณีที่ A พัง | พูดว่า "A เหมาะกว่าเมื่อ... แต่ถ้า... B เหมาะกว่า" |
| โกหกว่าเคยใช้ | follow-up ข้อเดียวก็ถูกจับได้ และคำตอบอื่นที่ถูกก็หมดความน่าเชื่อ | พูดตามจริงว่าเคยใช้ระดับไหน เช่น "อ่าน docs และลองใน side project" |
| ใช้ "เรา" ตลอดตอนเล่าผลงาน | ไม่รู้ว่าผู้สมัครทำอะไรเอง | แยกให้ชัด "ทีมทำ X ส่วนผมรับผิดชอบ Y" |
| ตำหนิที่ทำงานเก่าหรือเพื่อนร่วมทีม | red flag เรื่อง culture ชัดที่สุด | เล่าเป็นข้อเท็จจริงและสิ่งที่ตัวเองเรียนรู้ |
| ไม่คิดดัง ๆ ตอน live coding | ผู้สัมภาษณ์ช่วยใบ้ไม่ได้ และไม่เห็นกระบวนการที่อาจได้คะแนน | พูดแผนก่อนเขียน พูดตอนเจอปัญหา |
| เขียน code ทันทีโดยไม่ถามโจทย์ | เสี่ยงทำผิดโจทย์ทั้งข้อ | สรุปโจทย์ ถาม edge case 1–2 ข้อ แล้วค่อยเริ่ม |
| ไม่มีคำถามถามกลับตอนท้าย | ดูเหมือนไม่สนใจงานจริง | เตรียม 2–3 คำถามเรื่องทีม วิธีทำงาน ความท้าทายของระบบ |
| พูดชื่อ technology เยอะแต่ไม่บอกเหตุผล | ดูเหมือนตามกระแส | ทุกชื่อที่พูดต้องมี "เพราะ..." ตามมา |
| เตรียมแค่ technical ไม่เตรียม behavioral | ตกด่าน culture ทั้งที่ technical ผ่าน | เตรียมเรื่องเล่า 5–6 เรื่องแบบ STAR (ดูหัวข้อ 10) |

---

## 9. Debugging

> ส่วนนี้คือการ "debug ตัวเอง" ระหว่างสัมภาษณ์ — ทุกคนเจอสถานการณ์เหล่านี้ คนที่ผ่านคือคนที่มีวิธีรับมือ

### 9.1 เจอคำถามที่ตอบไม่ได้

```
ได้ยินคำถาม
      ↓
ขอเวลาคิด 5–10 วินาที ("ขอคิดแป๊บนึงครับ")
      ↓
ทวนคำถาม / ถามให้ชัด ("หมายถึงในมุม ... ใช่ไหมครับ")
      ↓
แยก: ส่วนไหนรู้แน่ ส่วนไหนไม่รู้
      ↓
พูดส่วนที่รู้ให้ชัด → บอกส่วนที่ไม่รู้ตรง ๆ → คิดต่อจากหลักการดัง ๆ
```

ให้มองภาพนี้ว่า "เราไม่ได้ต้องการคำตอบที่ครบ เราต้องการให้ผู้สัมภาษณ์เห็นว่าเราคิดอย่างเป็นระบบแม้ไม่รู้คำตอบ"

ประโยคที่ใช้ได้จริง:

- "ขอทวนคำถามนิดนึงนะครับ คือถามว่า ... ใช่ไหมครับ"
- "ส่วน A ผมมั่นใจว่า ... ส่วน B ผมไม่แน่ใจ ขอคิดจากหลักการนะครับ"
- "ถ้าเจอเรื่องนี้ในงานจริง ผมจะเริ่มจากเช็ค ... แล้วดู docs ของ ..."

### 9.2 รู้ตัวว่าตอบผิดไปแล้ว

**แก้ทันทีที่รู้ตัว ไม่ต้องรอให้เขาจับได้** การแก้คำตอบตัวเองเป็น signal บวก เพราะแสดงว่าเราตรวจทานความคิดตัวเอง ซึ่งเป็นทักษะเดียวกับการ review code

```
รู้ตัวว่าพูดผิด
      ↓
"ขอแก้ข้อเมื่อกี้นะครับ ผมพูดว่า X แต่คิดดูอีกทีน่าจะเป็น Y เพราะ ..."
      ↓
อธิบายสั้น ๆ ว่าทำไม Y ถูก
      ↓
กลับเข้าเรื่องต่อ ไม่ต้องขอโทษยาว
```

ถ้าผู้สัมภาษณ์ถามย้อน "แน่ใจเหรอ" — **อย่าเปลี่ยนคำตอบทันทีเพราะกลัว** ให้ไล่เหตุผลใหม่อีกรอบ ถ้าเหตุผลยังแน่นก็ยืนยันอย่างสุภาพพร้อมเหตุผล ถ้าเจอจุดผิดก็แก้ บางครั้งเขาถามเพื่อดูว่าเรายืนบนเหตุผลหรือยืนบนความรู้สึก

### 9.3 ถูกถามเรื่องที่ไม่เคยทำ

**พูดตรง ๆ ว่าไม่เคยทำ แต่คิดจากหลักการได้ — ดีกว่าเดาลอย ๆ เสมอ**

การเดาลอย ๆ แล้วผิดทำให้เสียมากกว่าคำถามนั้นข้อเดียว เพราะผู้สัมภาษณ์จะเริ่มสงสัยคำตอบอื่นที่เราตอบถูกไปแล้วด้วย

```
"ไม่เคยใช้ Kafka ครับ"            ← ตรงนี้ถ้าจบแค่นี้ = 0 คะแนน
      ↓
"แต่เคยใช้ message queue อื่น"    ← หาสิ่งใกล้เคียงที่เคยทำ
      ↓
"เลยเข้าใจว่าเรื่องที่ต้องคิดคือ   ← ยกหลักการที่ใช้ได้ทั่วไป
 การส่งซ้ำ ลำดับข้อความ และ retry"
      ↓
"ส่วนรายละเอียดเฉพาะของ Kafka     ← บอกขอบเขตความรู้
 ผมต้องไปศึกษาเพิ่ม"
```

ให้มองภาพนี้ว่า "สะพานจากสิ่งที่ไม่รู้ ไปหาหลักการที่รู้ — ผู้สัมภาษณ์ให้คะแนนสะพาน"

### 9.4 ติดตอน live coding

| อาการ | ทำอะไร |
|---|---|
| คิดไม่ออกว่าจะเริ่มยังไง | เริ่มจากวิธีที่ง่ายที่สุดแม้ช้า (brute force) พูดว่า "ขอเริ่มจากวิธีตรง ๆ ก่อน แล้วค่อยปรับให้ดีขึ้น" |
| code รันไม่ผ่าน | อย่าสุ่มแก้ ลองไล่ด้วย input เล็ก ๆ ทีละบรรทัดออกเสียง |
| เวลาใกล้หมด | บอกว่าถ้ามีเวลาจะทำอะไรต่อ เช่น edge case ที่ยังไม่ได้จัดการ และ test ที่จะเขียน |
| ผู้สัมภาษณ์ใบ้ | รับ hint แล้วบอกว่าเข้าใจอะไรเพิ่ม การรับ feedback ได้ดีก็เป็นคะแนน |
| ลืม syntax | บอกตรง ๆ "จำชื่อ method ไม่แม่น แต่ตั้งใจจะทำ ..." ผู้สัมภาษณ์ส่วนใหญ่สนใจ logic มากกว่า |

### 9.5 ตื่นเต้นจนสมองว่าง

- หายใจช้า ๆ หนึ่งครั้ง แล้วทวนคำถามออกเสียง การพูดซ้ำช่วยให้สมองเริ่มทำงาน
- เขียน keyword ลงกระดาษหรือกระดาน 2–3 คำก่อนตอบ
- ใช้โครง 4 จังหวะในหัวข้อ 11 เป็นราวจับ — แม้ตื่นเต้น ขอแค่เริ่มจาก "นิยามสั้น" ได้ ที่เหลือจะตามมา

---

## 10. Interview Questions

> หมวดนี้คือคำถาม "นอก technical" ที่แทบทุกบริษัทถาม ใช้รูปแบบ 6 ช่องเดียวกับหัวข้อ 6

### 🟢 Junior

**Q:** แนะนำตัวเองหน่อย (Tell me about yourself)

- **Expected Concept:** สรุปสั้น 60–90 วินาทีที่เชื่อมประสบการณ์กับตำแหน่งนี้, ไม่ใช่อ่าน resume ทั้งหมด
- **Short Answer:** บอกตำแหน่งและประสบการณ์ปัจจุบันหนึ่งประโยค ผลงานที่ภูมิใจหนึ่งเรื่อง และเหตุผลที่สนใจตำแหน่งนี้หนึ่งประโยค
- **Mid-level Answer:** ใช้โครง ปัจจุบัน → จุดเด่น → อนาคต เช่น "ตอนนี้ทำ full-stack ดูแลระบบ order เรื่องที่ภูมิใจคือลดเวลาโหลดหน้าหลักจากการแก้ query และ cache ผมอยากทำงานที่ได้ดูระบบขนาดใหญ่ขึ้น ซึ่งตรงกับตำแหน่งนี้" เลือกเรื่องที่อยากให้เขาถามต่อ เพราะคำแนะนำตัวคือการเลือกหัวข้อสนทนาให้ตัวเอง
- **Common Wrong Answer:** เล่าตั้งแต่สมัยเรียนตามลำดับเวลา 5 นาที หรือเล่าเรื่องส่วนตัวที่ไม่เกี่ยวกับงาน — เสียเวลาและไม่ช่วยให้ผู้สัมภาษณ์รู้ว่าเราเหมาะกับตำแหน่งอย่างไร
- **Follow-up:** "เล่าเรื่องที่ภูมิใจให้ละเอียดขึ้นหน่อย" (ควรเตรียมไว้แล้ว) / "ทำไมถึงอยากย้ายงาน"

**Q:** เล่าถึง bug ที่แก้ยากที่สุดที่เคยเจอ

- **Expected Concept:** กระบวนการ debug ที่เป็นระบบ, reproduce → isolate → หาต้นเหตุ → แก้ → ป้องกัน, สิ่งที่เรียนรู้
- **Short Answer:** เล่าอาการ, วิธีที่ใช้หาต้นเหตุทีละขั้น, สาเหตุจริง และวิธีแก้ ใช้โครง STAR
- **Mid-level Answer:** จุดที่ทำให้คำตอบโดดเด่นคือขั้น "ป้องกันไม่ให้เกิดอีก" เช่น "หลังแก้ race condition ในการตัดสต็อก ผมเพิ่ม test ที่ยิง request พร้อมกัน และเพิ่ม alert เมื่อสต็อกติดลบ" และบอกว่าทางไหนที่ลองแล้วไม่ใช่ เพราะแสดงวิธีคิดตัดตัวเลือก
- **Common Wrong Answer:** เล่าเรื่องที่ bug หายไปเองหลัง restart โดยไม่รู้สาเหตุ หรือเล่าว่าสุ่มแก้จนผ่าน — เป็นเรื่องที่บอกว่ายังไม่มีวิธี debug ที่เป็นระบบ
- **Follow-up:** "ถ้าเจอแบบนี้อีกจะทำอะไรต่างจากเดิม" / "ใช้เครื่องมืออะไรช่วย"

### 🟡 Mid-level

**Q:** เล่าเหตุการณ์ที่คุณไม่เห็นด้วยกับเพื่อนร่วมทีมหรือหัวหน้าเรื่อง technical

- **Expected Concept:** ถกกันด้วยข้อมูล, ฟังเหตุผลอีกฝ่าย, disagree and commit, ไม่ทำให้เป็นเรื่องส่วนตัว
- **Short Answer:** เล่าว่าไม่เห็นด้วยเรื่องอะไร เหตุผลของทั้งสองฝ่าย วิธีที่ใช้ตัดสินใจ และผลลัพธ์
- **Mid-level Answer:** เรื่องที่ดีคือเรื่องที่แสดงว่าเราเปลี่ยนความเห็นได้เมื่อมีข้อมูล หรือโน้มน้าวด้วยข้อมูลได้ เช่น "ผมเสนอให้ทำ POC เล็ก ๆ วัดทั้งสองแนวทางก่อน ผลออกมาว่าแนวทางของเขาเหมาะกว่าในบริบทนี้ ผมก็ช่วยทำตามนั้นเต็มที่" หรือถ้าทีมเลือกทางที่เราไม่เห็นด้วย ก็บอกว่าเราบันทึกความเสี่ยงไว้แล้วยังทำเต็มที่ (disagree and commit)
- **Common Wrong Answer:** "ผมไม่เคยขัดแย้งกับใครเลย" — ฟังดูไม่จริงหรือไม่กล้าแสดงความเห็น หรือเล่าว่าสุดท้ายเราถูกและอีกฝ่ายผิดแบบดูถูกอีกฝ่าย
- **Follow-up:** "ถ้าหัวหน้าตัดสินใจแล้วคุณยังคิดว่าผิดจะทำอย่างไร" / "เคยเปลี่ยนความเห็นตัวเองไหม"

**Q:** เล่าเหตุการณ์ที่คุณทำ production พัง แล้วจัดการอย่างไร

- **Expected Concept:** ความรับผิดชอบ, ลดผลกระทบก่อน (rollback / mitigate), สื่อสารระหว่างเกิดเหตุ, หาต้นเหตุแบบ blameless, แก้ที่ระบบไม่ใช่แค่ที่คน
- **Short Answer:** เล่าว่าเกิดอะไร รู้ได้อย่างไร ทำอะไรเพื่อหยุดผลกระทบ แก้ต้นเหตุอย่างไร และเปลี่ยนอะไรเพื่อไม่ให้เกิดอีก
- **Mid-level Answer:** เรียงลำดับให้เห็นว่ารู้ความสำคัญ: หยุดเลือดก่อน (rollback) → แจ้งคนที่เกี่ยวข้อง → หาต้นเหตุ → แก้ระบบ เช่น "ผม deploy migration ที่ lock ตารางนาน ทำให้ checkout ค้าง 10 นาที ผม rollback และแจ้งทีมทันที หลังจากนั้นเสนอให้ migration บนตารางใหญ่ต้องผ่าน review และทดสอบกับข้อมูลขนาดใกล้จริงก่อน" จุดสำคัญคือยอมรับส่วนของตัวเองตรง ๆ แต่ไม่จบที่โทษตัวเอง ต้องจบที่การแก้กระบวนการ
- **Common Wrong Answer:** "ผมไม่เคยทำ production พัง" — สำหรับ mid-level ฟังดูเหมือนไม่เคยรับผิดชอบงานจริง หรือเล่าโดยโทษ QA หรือคนอื่น
- **Follow-up:** "ถ้าเกิดตอนตีสองแล้วไม่มีใครตอบ จะทำอย่างไร" / "postmortem ที่ดีหน้าตาเป็นอย่างไร"

### 🔴 Senior

**Q:** ถ้าได้เข้ามาในทีมนี้ 90 วันแรกคุณจะทำอะไร

- **Expected Concept:** เรียนรู้ก่อนเปลี่ยน, เข้าใจ business และระบบ, สร้างความเชื่อใจด้วยงานเล็กที่ส่งได้จริง, หาปัญหาที่มีผลสูงแล้วเสนอด้วยข้อมูล
- **Short Answer:** 30 วันแรกเรียนรู้ระบบ คน และ business ส่งงานเล็ก ๆ ให้ได้ 30 วันถัดไปรับงานที่ใหญ่ขึ้นและเริ่มเห็นจุดที่ปรับได้ 30 วันสุดท้ายเสนอและเริ่มแก้ปัญหาที่มีผลสูงหนึ่งเรื่อง
- **Mid-level Answer:** ระดับ senior ต้องแสดงว่าไม่เข้ามาเปลี่ยนทุกอย่างทันที: คุยกับคนในทีมและทีมที่เกี่ยวข้องเพื่อเข้าใจว่าทำไมระบบเป็นแบบนี้ อ่าน incident เก่าและ on-call ดูเพื่อหาจุดที่เจ็บจริง ส่ง PR เล็ก ๆ ในสัปดาห์แรก ๆ เพื่อเรียนรู้ขั้นตอนตั้งแต่ code ถึง production จากนั้นเลือกหนึ่งปัญหาที่มีข้อมูลรองรับ เช่น deploy ใช้เวลานาน แล้วเสนอแผนพร้อมตัวชี้วัด และถามผู้สัมภาษณ์กลับว่าทีมคาดหวังอะไรจาก senior คนนี้ใน 3 เดือนแรก
- **Common Wrong Answer:** "จะ refactor ระบบใหม่ทั้งหมดและเปลี่ยนมาใช้ technology X" — แสดงว่าตัดสินใจก่อนเข้าใจบริบท ซึ่งเป็น red flag สำหรับ senior
- **Follow-up:** "ถ้าเจอว่า code base มีปัญหาเยอะมาก จะจัดลำดับอย่างไร" / "จะช่วยให้ junior ในทีมโตขึ้นอย่างไร"

### คำถามที่ควรเตรียมไว้ถามผู้สัมภาษณ์กลับ

| คำถาม | ได้ข้อมูลอะไร |
|---|---|
| "งานแรก ๆ ที่คนในตำแหน่งนี้จะได้ทำคืออะไร" | เห็นภาพงานจริง ไม่ใช่แค่ job description |
| "ทีม deploy บ่อยแค่ไหน ใช้เวลาจาก merge ถึง production เท่าไร" | ความพร้อมของ CI/CD และวัฒนธรรม engineering |
| "ถ้ามี incident ทีมจัดการอย่างไร มี on-call ไหม" | ภาระงานนอกเวลาและวัฒนธรรม blameless |
| "ความท้าทายทาง technical ที่ใหญ่ที่สุดของทีมตอนนี้คืออะไร" | ได้หัวข้อให้แสดงความคิดต่อ และรู้ว่าจะเจออะไร |
| "วัดผลงานของตำแหน่งนี้อย่างไร" | ความคาดหวังที่ชัดเจน |

---

## 11. Answer Like a Developer

### 11.1 สูตรตอบ 4 จังหวะ

```
[1. นิยามสั้น]        1 ประโยค — มันคืออะไร
      ↓
[2. ทำไมมี]           ปัญหาที่มันแก้ ถ้าไม่มีจะเกิดอะไร
      ↓
[3. ตัวอย่างที่เคยใช้]  "ตอนทำ ... ผมใช้เพื่อ ..."
      ↓
[4. trade-off / ข้อควรระวัง]  "แต่ต้องระวัง ... / แลกกับ ..."
```

ให้มองภาพนี้ว่า "จังหวะ 1–2 ผ่านเส้น junior, จังหวะ 3 ทำให้น่าเชื่อ, จังหวะ 4 คือเส้นแบ่งระหว่าง junior กับ mid-level"

| จังหวะ | เวลา | ประโยคเปิดที่ใช้ได้ |
|---|---|---|
| 1. นิยามสั้น | ~10 วินาที | "พูดสั้น ๆ คือ ..." |
| 2. ทำไมมี | ~15 วินาที | "ที่ต้องมีเพราะถ้าไม่มี ..." |
| 3. ตัวอย่างที่เคยใช้ | ~20–30 วินาที | "ใน project ... ผมใช้ตอน ..." |
| 4. trade-off | ~15–20 วินาที | "ข้อที่ต้องระวังคือ ... เลยต้อง ..." |

ถ้าไม่เคยใช้จริง จังหวะ 3 ให้เปลี่ยนเป็น "ตัวอย่างที่มันเหมาะ" แล้วบอกตรง ๆ ว่ายังไม่เคยใช้ใน production

### 11.2 เดินให้ดู: "Docker คืออะไร ใช้ทำไม"

| จังหวะ | คำตอบ |
|---|---|
| 1. นิยามสั้น | "Docker คือเครื่องมือแพ็กแอปพร้อมทุกอย่างที่ต้องใช้รันเป็น image แล้วรันเป็น container ที่แยกจากกัน" |
| 2. ทำไมมี | "เพื่อแก้ปัญหา 'เครื่องผมรันได้' เพราะเวอร์ชัน runtime และ library บนแต่ละเครื่องไม่ตรงกัน" |
| 3. ตัวอย่างที่เคยใช้ | "ใน project ล่าสุดผมใช้ docker compose รัน API, PostgreSQL และ Redis ให้คนใหม่ในทีมเริ่มงานได้ด้วยคำสั่งเดียว และใช้ image เดียวกันตั้งแต่ CI จนถึง production" |
| 4. trade-off | "ข้อที่ต้องระวังคือข้อมูลใน container หายเมื่อลบ ต้องใช้ volume และไม่ควรใส่ secret ไว้ใน image เพราะดูย้อนได้จาก layer" |

ทำไมคำตอบนี้ดี: ใช้เวลาประมาณ 1 นาที มีทั้ง Why และ When และจังหวะ 4 เปิดทางให้ follow-up ที่เราเตรียมไว้แล้ว (volume, secret)

### 11.3 เดินให้ดู: "useEffect ใช้ทำอะไร"

| จังหวะ | คำตอบ |
|---|---|
| 1. นิยามสั้น | "useEffect คือ hook สำหรับ sync component กับสิ่งที่อยู่นอก React เช่น API, timer, event ของ browser" |
| 2. ทำไมมี | "เพราะการ render ควรเป็นแค่การคำนวณ UI จากข้อมูล ถ้าเรียก API ระหว่าง render จะเรียกซ้ำทุกครั้งที่ render จึงต้องแยก side effect ไปไว้ที่นี่" |
| 3. ตัวอย่างที่เคยใช้ | "ผมใช้ subscribe WebSocket ของหน้า chat ตอน mount แล้ว unsubscribe ใน cleanup และใช้ fetch ข้อมูลใหม่เมื่อ id ใน URL เปลี่ยน" |
| 4. trade-off | "ต้องใส่ dependency ให้ครบไม่อย่างนั้นจะอ่านค่าเก่า และตอน fetch ต้องยกเลิก request เก่าใน cleanup กัน race condition ส่วนการดึงข้อมูลจาก server ในแอปใหญ่ ผมมักใช้ library อย่าง TanStack Query แทนเพราะจัดการ cache และ loading ให้" |

ทำไมคำตอบนี้ดี: จังหวะ 1 ใช้คำว่า "sync" แทน "lifecycle" ซึ่งเป็น mental model ที่ถูกต้อง และจังหวะ 4 แสดงว่ารู้ว่าเมื่อไรไม่ควรใช้

### 11.4 เดินให้ดู: "Microservices คืออะไร" (กรณีที่ไม่เคยทำใน production)

| จังหวะ | คำตอบ |
|---|---|
| 1. นิยามสั้น | "Microservices คือการแบ่งระบบเป็นหลาย service ที่ deploy และ scale แยกกันได้ แต่ละตัวดูแลข้อมูลของตัวเอง" |
| 2. ทำไมมี | "ช่วยเมื่อทีมใหญ่ขึ้นจนหลายทีมแก้ code ก้อนเดียวกันแล้วชนกัน หรือบางส่วนของระบบต้อง scale ต่างจากส่วนอื่นมาก" |
| 3. ตัวอย่าง (ยังไม่เคยใช้จริง) | "ผมยังไม่เคยดูแล microservices ใน production ครับ งานที่ผ่านมาเป็น monolith แต่เราแยก module ตาม domain ไว้ และผมเคยแยกงานส่ง email ออกไปทำผ่าน queue ทำให้เห็นปัญหาแบบระบบกระจาย เช่น ข้อความส่งซ้ำ" |
| 4. trade-off | "สิ่งที่เข้าใจคือต้นทุนสูงขึ้นมาก ทั้ง network ที่พังได้, การ debug ข้าม service ที่ต้องมี tracing และ transaction ข้าม service ที่ทำยาก ถ้าทีมยังเล็ก ผมคิดว่า modular monolith น่าจะคุ้มกว่า" |

ทำไมคำตอบนี้ดี: บอกตรง ๆ ว่าไม่เคยทำ แต่เชื่อมไปหาประสบการณ์ใกล้เคียง (queue) แล้วใช้หลักการตอบ trade-off ได้ ผู้สัมภาษณ์จะเชื่อคำตอบนี้มากกว่าการเล่าประสบการณ์ที่แต่งขึ้น

### 11.5 ใช้สูตรนี้ซ้อมอย่างไร

1. สุ่มคำถามจากหัวข้อ 6 มา 1 ข้อ อ่านเฉพาะบรรทัด `Q:`
2. ตั้งเวลา 90 วินาที ตอบออกเสียงตาม 4 จังหวะ (อัดเสียงไว้ยิ่งดี)
3. เปิดเฉลย เช็คว่าพูด Expected Concept ครบไหม และเผลอพูดแบบ Common Wrong Answer หรือเปล่า
4. ตอบ Follow-up ต่ออีก 1 ข้อ
5. ทำวันละ 5 ข้อ วนให้ครบทุกหมวด ภายในสองสัปดาห์จะได้ซ้อมครบคลัง

---

## 12. One-Minute Review

- Interview วัด **กระบวนการคิดที่พูดออกมา** ไม่ใช่ความจำ
- ด่านหลัก: **Screening → Technical → System Design → Culture → Offer** แต่ละด่านวัดคนละเรื่อง
- เส้นผ่าน: Junior = นิยาม + ตัวอย่างจริง, Mid = + **trade-off**, Senior = + ผลต่อระบบและธุรกิจ
- ตอบด้วยสูตร **นิยามสั้น → ทำไมมี → ตัวอย่างที่เคยใช้ → trade-off** ใช้เวลาประมาณ 60–90 วินาที
- ไม่รู้ → บอกตรง ๆ แล้ว **คิดต่อจากหลักการ** / ตอบผิด → **แก้เองทันที** / ไม่เคยทำ → **เชื่อมไปหาสิ่งใกล้เคียงที่เคยทำ**
- ห้ามพูด "A ดีกว่า B" โดยไม่มี "เมื่อ..."
- เตรียม behavioral แบบ STAR 5–6 เรื่อง และคำถามถามกลับ 2–3 ข้อ
- ซ้อมโดยอ่านแค่ `Q:` แล้วพูดออกเสียงก่อนเปิดเฉลยเสมอ

---

## 13. Memory Card

**จำ 5 อย่าง**

1. ผู้สัมภาษณ์กำลังเก็บหลักฐานเพื่อรับเรา ไม่ได้จับผิด — คำถามยากคือการหาเพดาน ไม่ใช่การไล่ตก
2. สูตร 4 จังหวะ: นิยาม → ทำไม → ตัวอย่าง → trade-off
3. trade-off คือเส้นแบ่ง junior กับ mid
4. "ไม่เคยทำ แต่คิดจากหลักการได้ว่า..." ดีกว่าเดาลอย ๆ เสมอ
5. พูดสั้น เก็บรายละเอียดไว้รอ follow-up (ภูเขาน้ำแข็ง 20/80)

**Keyword:**

- **Screening** → กรองความเข้ากัน
- **Technical** → วัดความลึกจริง
- **System Design** → วัด scale / failure / trade-off
- **Culture** → วัดการทำงานร่วมกัน
- **Expected Concept** → คำที่ต้องหลุดจากปาก
- **Follow-up** → ตัววัดว่าท่องหรือเข้าใจ
- **STAR** → Situation → Task → Action → Result
- **Red Flag** → โกหก, โทษคนอื่น, มั่นใจในสิ่งที่ผิด

---

[← สารบัญ](./00-README-TOC.md)
