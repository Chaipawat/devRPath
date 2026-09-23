# PART 11 — PYTHON

> ตำแหน่งในภาพใหญ่: Backend Layer + Automation/Data/AI Layer — ภาษาที่อยู่ได้หลายชั้นของระบบ

---

## 1. Big Picture

Python คือภาษาที่ออกแบบโดยมีเป้าหมายว่า **"โค้ดถูกอ่านบ่อยกว่าถูกเขียน"** ดังนั้นไวยากรณ์ของมันจึงพยายามใกล้เคียงภาษาอังกฤษ ตัดวงเล็บปีกกาทิ้ง แล้วใช้ **indentation (การเยื้อง)** เป็นตัวบอกขอบเขตของ block แทน

แต่เหตุผลที่ Python สำคัญกับ developer สาย web ไม่ใช่เพราะ syntax สวย — มันสำคัญเพราะ **มันเป็นภาษาที่คุณจะเจอในสามที่พร้อมกัน**:

```
[ BACKEND API ]      FastAPI / Django / Flask
[ AUTOMATION ]       script ทำงานซ้ำ ๆ, ETL, DevOps tool, scraping
[ DATA / AI ]        pandas, numpy, model training, LLM tooling
```

> **ให้มองภาพนี้ว่า** "Python คือภาษากลางที่ทีม backend ทีม data และทีม AI ใช้ร่วมกันได้ ทำให้มันกลายเป็นกาวเชื่อมระหว่างระบบ"

**สิ่งที่คนสัมภาษณ์อยากได้ยินจากคุณจริง ๆ** ไม่ใช่ "Python เขียนง่าย" แต่คือคุณเข้าใจสามเรื่องนี้:

1. **Dynamic typing** — ความยืดหยุ่นแลกกับ error ที่เจอตอน runtime ไม่ใช่ตอน compile
2. **Interpreter** — โค้ดถูกแปลและรันโดยล่าม ไม่ได้ถูก compile เป็น machine code ตรง ๆ → ช้ากว่าภาษา compile แต่เปลี่ยนแก้ได้เร็ว
3. **GIL** — ข้อจำกัดเรื่อง thread ที่ทำให้ multithread **ไม่ช่วยงาน CPU-bound** (แต่ยังช่วย I/O-bound) — ข้อนี้คือคำถามคัดคนจริง

**ประโยคเดียวสำหรับสัมภาษณ์:**

> "Python เป็นภาษา interpreted แบบ dynamic typing ที่เน้น readability และมี ecosystem กว้างมาก จุดแข็งคือพัฒนาเร็วและใช้ได้ทั้ง backend/automation/data ส่วนข้อจำกัดหลักคือความเร็วต่อ operation และ GIL ที่ทำให้งาน CPU-bound ต้องแก้ด้วย process หรือ native library แทน thread"

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Interpreter** | ล่ามแปลสด | โปรแกรมที่อ่านและรันโค้ด Python (CPython คือตัวมาตรฐาน) |
| **CPython** | ตัวจริงที่คนใช้ | implementation หลักของ Python เขียนด้วยภาษา C |
| **Bytecode (.pyc)** | ภาษากลางก่อนรัน | Python แปลงเป็น bytecode แล้วให้ VM รัน (ไม่ใช่ machine code) |
| **Dynamic Typing** | ไม่ต้องประกาศชนิด | ชนิดข้อมูลผูกกับ "ค่า" ไม่ใช่ "ตัวแปร" ตรวจตอน runtime |
| **Strong Typing** | ไม่แปลงชนิดมั่ว | `"1" + 1` = error ไม่ใช่ `"11"` (ต่างจาก JavaScript) |
| **Type Hint** | ป้ายบอกชนิด | `def f(x: int) -> str` — ไม่บังคับตอนรัน ใช้กับ mypy/IDE/FastAPI |
| **List** | กล่องเรียงลำดับ แก้ได้ | `[1,2,3]` — mutable, ordered |
| **Tuple** | กล่องเรียงลำดับ แก้ไม่ได้ | `(1,2,3)` — immutable, ใช้เป็น key ของ dict ได้ |
| **Dictionary (dict)** | สมุดคู่ key→value | lookup เร็วเฉลี่ย O(1) |
| **Set** | ถุงของไม่ซ้ำ | ตรวจสมาชิก/ตัดซ้ำได้เร็ว ไม่มีลำดับที่รับประกัน |
| **Module** | ไฟล์ .py หนึ่งไฟล์ | หน่วยย่อยที่ import ได้ |
| **Package** | โฟลเดอร์ของ module | รวม module เป็นชุด |
| **pip** | คนไปหยิบของจากคลัง | ตัวติดตั้ง package จาก PyPI |
| **PyPI** | คลังของกลาง | Python Package Index |
| **Virtual Environment** | กล่องแยกของแต่ละโปรเจกต์ | แยก dependency ไม่ให้ชนกันข้ามโปรเจกต์ |
| **requirements.txt / lock** | ใบรายการของ | บันทึกว่าโปรเจกต์นี้ใช้อะไร version ไหน |
| **Exception** | ข้อผิดพลาดที่โยนขึ้นมา | จัดการด้วย `try / except / else / finally` |
| **EAFP** | ทำไปก่อน ผิดค่อยจับ | สไตล์ Python: "Easier to Ask Forgiveness than Permission" |
| **Iterator** | ตัวเดินทีละก้าว | object ที่มี `__next__()` — ให้ค่าถัดไปจนหมด |
| **Iterable** | ของที่เดินได้ | object ที่ให้ iterator ได้ (`for` วนได้) |
| **Generator** | สายพานที่ผลิตตามสั่ง | ฟังก์ชันที่ใช้ `yield` — ผลิตค่าทีละตัว ไม่เก็บทั้งหมดในหน่วยความจำ |
| **Comprehension** | สร้าง list/dict ในบรรทัดเดียว | `[x*2 for x in nums]` |
| **Decorator** | กระดาษห่อฟังก์ชัน | ฟังก์ชันที่ห่อฟังก์ชันอื่นเพื่อเพิ่มพฤติกรรม (`@app.get(...)`) |
| **Context Manager** | เปิดแล้วปิดให้แน่ | `with open(...) as f:` — ปิดทรัพยากรอัตโนมัติ |
| **GIL (Global Interpreter Lock)** | ตั๋วใบเดียวของล่าม | ล็อกที่ยอมให้ thread เดียวรัน Python bytecode ได้ในเวลาหนึ่ง |
| **asyncio** | คิวงานรอ I/O | concurrency แบบ single-thread ด้วย event loop + `async/await` |
| **Coroutine** | ฟังก์ชันที่หยุดกลางคันได้ | ฟังก์ชัน `async def` |
| **multiprocessing** | จ้างคนเพิ่มเป็นคน ๆ | แยก process จริง หลบ GIL ได้ |
| **CPU-bound** | งานคิดหนัก | คำนวณ เข้ารหัส ประมวลผลภาพ |
| **I/O-bound** | งานรอหนัก | รอ DB, รอ API, รออ่านไฟล์ |
| **WSGI / ASGI** | มาตรฐานต่อ web server | WSGI = sync (Flask/Django เดิม), ASGI = async (FastAPI) |
| **FastAPI** | เร็ว + type hint | framework async ที่สร้าง OpenAPI docs อัตโนมัติ |
| **Django** | มาครบทั้งบ้าน | framework ครบชุด: ORM, admin, auth |
| **Flask** | เล็กและอิสระ | micro-framework ประกอบเอง |
| **PEP 8** | กฎการเขียนให้อ่านง่าย | style guide มาตรฐานของ Python |
| **GC / Reference Count** | นับคนถือของ | Python เก็บขยะด้วย ref count + cycle collector |

---

## 3. Mental Model

มอง Python ในหัวเป็น **"ล่ามที่ทำงานทีละบรรทัด และทุกอย่างเป็น object"**

```
[ source.py ]
     ↓  parse
[ AST ]  โครงสร้างต้นไม้ของโค้ด
     ↓  compile
[ BYTECODE (.pyc) ]
     ↓  execute
[ PYTHON VIRTUAL MACHINE (CPython) ]
     ↓  เรียกของจริง
[ C LIBRARY / OS ]
```

> **ให้มองภาพนี้ว่า** "Python ไม่ได้แปลงเป็นภาษาเครื่องแบบ C/Java แต่แปลงเป็น bytecode ให้ล่ามเดินอ่านทีละคำสั่ง จึงยืดหยุ่นมากแต่จ่ายค่าความเร็วต่อคำสั่ง"

**3 หลักคิดที่ต้องติดหัว:**

1. **ตัวแปรคือ "ป้ายชื่อ" ไม่ใช่ "กล่อง"**
```
a = [1,2,3]
b = a          # b ไม่ได้ copy — b คือป้ายอีกใบที่ชี้ของชิ้นเดียวกัน
b.append(4)    # a เปลี่ยนตามด้วย
```
เรื่องนี้เป็นต้นตอบั๊กอันดับหนึ่งของ junior ในงานจริง

2. **ทุกอย่างเป็น object** — ฟังก์ชันก็เป็น object จึงส่งเป็น argument, เก็บใน list, ห่อด้วย decorator ได้

3. **Python ตัดสินใจแลก "ความเร็วรัน" กับ "ความเร็วเขียน"** เมื่อโจทย์คือความเร็วจริง ๆ ทางออกมาตรฐานไม่ใช่ "เขียน Python ให้เก่งขึ้น" แต่คือ **"ผลักงานหนักลงไปที่ native library (numpy/C extension) หรือแยก process"**

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำที่ 1 — Interpreter vs Compiler

Compiler (Java/C) = แปลหนังสือทั้งเล่มก่อน แล้วค่อยให้คนอ่าน  (ช้าตอนแปล เร็วตอนอ่าน)
Interpreter (Python) = ล่ามยืนแปลสดทีละประโยค              (เริ่มได้ทันที แต่ช้ากว่าต่อประโยค)

แปลสด → พิมพ์ผิดตรงบรรทัด 500 จะรู้ตอน "อ่านถึง" เท่านั้น  ← นี่คือที่มาของ runtime error
```

```
🧠 ภาพจำที่ 2 — GIL = ไมโครโฟนตัวเดียวในห้องประชุม

มีคน (thread) 8 คนในห้อง แต่มีไมค์แค่ 1 ตัว
พูด (รัน Python bytecode) ได้ทีละคนเท่านั้น

งานคิดหนัก (CPU-bound)  = ทุกคนอยากพูดตลอด → แย่งไมค์ → เพิ่มคนไม่ช่วย
งานรอ (I/O-bound)       = พูดแป๊บเดียวแล้วนั่งรอ DB ตอบ → วางไมค์ให้คนอื่น → เพิ่มคนช่วยได้
ทางออกงานคิดหนัก        = เปิดห้องประชุมเพิ่ม (process) หรือส่งงานให้คนนอกที่ไม่ต้องใช้ไมค์ (native lib)
```

```
🧠 ภาพจำที่ 3 — List vs Generator = ซื้อของทั้งคันรถ vs สายพานโรงงาน

List      = ขนของมาเก็บในบ้านให้ครบก่อน แล้วค่อยหยิบใช้   (เปลืองที่ แต่หยิบซ้ำได้)
Generator = สายพานส่งของมาทีละชิ้นตอนที่ขอ                 (ประหยัดที่ แต่ผ่านไปแล้วผ่านเลย)

อ่านไฟล์ log 10 GB ด้วย list = แรมระเบิด
อ่านด้วย generator = ใช้แรมเท่าบรรทัดเดียว
```

```
🧠 ภาพจำที่ 4 — Virtual Environment = กล่องเครื่องมือประจำโปรเจกต์

ไม่มี venv = เครื่องมือทุกโปรเจกต์กองรวมกันบนโต๊ะเดียว
             โปรเจกต์ A ต้องการไขควงรุ่นเก่า โปรเจกต์ B รุ่นใหม่ → ตีกัน
มี venv    = แต่ละโปรเจกต์มีกล่องของตัวเอง ไม่ยุ่งกัน
```

```
🧠 ภาพจำที่ 5 — Dynamic Typing = กล่องที่ไม่มีป้ายเขียนว่าใส่อะไรได้

ยืดหยุ่นมาก ใส่อะไรก็ได้
แต่ตอนเปิดกล่องแล้วเจอของผิดประเภท = พังตอนนั้นเลย ไม่มีใครเตือนล่วงหน้า
Type hint = การเอาปากกามาเขียนป้ายแปะเอง (คนอ่านกับ IDE ได้ประโยชน์ แต่ไม่มียามบังคับ)
```

---

## 5. How It Works

### 5.1 จากโค้ดถึงผลลัพธ์

```
[ เขียน a.py ]
     ↓
[ python a.py ]
     ↓
[ Parser → AST ]           ตรวจ syntax (ผิดตรงนี้ = SyntaxError ก่อนรันเลย)
     ↓
[ Compile → Bytecode ]     เก็บไว้ใน __pycache__ เพื่อรันครั้งหน้าเร็วขึ้น
     ↓
[ PVM รัน bytecode ]       ตรวจชนิดข้อมูล "ตอนรัน" → TypeError เกิดตรงนี้
     ↓
[ ผลลัพธ์ / Exception ]
```

> **ให้มองภาพนี้ว่า** "Python ตรวจให้แค่ว่าเขียนถูกไวยากรณ์ไหม ส่วนเรื่องชนิดข้อมูลถูกหรือเปล่า มันจะรู้ก็ต่อเมื่อเดินไปถึงบรรทัดนั้นจริง ๆ"

### 5.2 GIL — ทำไม thread ถึงไม่ช่วยเสมอ

```
CPU-bound ด้วย threading (ไม่ช่วย):
Core1: [T1 คำนวณ][  รอ  ][T3 คำนวณ][  รอ  ]
Core2: [   ว่าง   ][   ว่าง   ][   ว่าง   ]   ← core อื่นว่างเพราะไม่มีไมค์
รวมเวลา ≈ เท่าเดิม (หรือช้าลงเพราะ overhead การสลับ)

I/O-bound ด้วย threading (ช่วยมาก):
T1: [ยิง query]........รอ DB........[อ่านผล]
T2:      [ยิง query]........รอ DB........[อ่านผล]
T3:           [ยิง query]........รอ DB........
     ↑ ระหว่าง "รอ" GIL ถูกปล่อย → คนอื่นทำงานต่อได้

CPU-bound ด้วย multiprocessing (ช่วย):
Process1 (GIL ของตัวเอง): [คำนวณเต็มที่]  → Core1
Process2 (GIL ของตัวเอง): [คำนวณเต็มที่]  → Core2
```

> **ให้มองภาพนี้ว่า** "GIL ไม่ได้ห้าม thread เกิด แต่ห้ามให้มีมากกว่าหนึ่ง thread รันคำสั่ง Python พร้อมกัน — ดังนั้นมันทำร้ายเฉพาะงานที่ 'คิด' ไม่ใช่งานที่ 'รอ'"

**ทางออกของ CPU-bound 3 ทาง (ต้องตอบได้ครบ):**

| ทางออก | หลักการ | เหมาะเมื่อ | ข้อแลก |
|---|---|---|---|
| **multiprocessing** | แยก process แต่ละตัวมี GIL ของตัวเอง | คำนวณหนัก แบ่งงานเป็นก้อนได้ | กินแรมมาก, ส่งข้อมูลข้าม process ต้อง serialize |
| **Native library** (numpy, pandas, C extension) | โค้ดหนักอยู่ในภาษา C ซึ่ง **ปล่อย GIL** ระหว่างทำงาน | งานตัวเลข/เมทริกซ์/ประมวลผลข้อมูล | ต้องเขียนในรูปแบบ vectorized ไม่ใช่ loop |
| **แยกไป service ภาษาอื่น / queue + worker** | ย้ายงานหนักออกจาก request path | งานหนักมากและนาน | ระบบซับซ้อนขึ้น |

และสำหรับ I/O-bound ทางออกคือ **asyncio** หรือ **thread pool** ซึ่งได้ผลดีอยู่แล้วโดยไม่ต้องหนี GIL

> หมายเหตุเชิงหลักการ: ชุมชน Python กำลังพัฒนาทิศทางให้ interpreter ทำงานได้โดยไม่ต้องมี GIL (free-threaded build) แต่ในงานจริงส่วนใหญ่วันนี้ **ยังต้องออกแบบโดยสมมติว่ามี GIL** — ตอบแบบนี้จะดูอัปเดตและไม่เสี่ยงผิด

### 5.3 asyncio — concurrency แบบไม่ใช้ thread

```
[ EVENT LOOP ]  ← คนคุมคิวงาน
     │
     ├─ coroutine A : await db.query()   → ยังไม่เสร็จ → พักไว้ ปล่อย loop ทำงานอื่น
     ├─ coroutine B : await http.get()   → ยังไม่เสร็จ → พักไว้
     └─ coroutine C : คำนวณล้วน ๆ 3 วินาที  ← ❗ บล็อก loop ทั้งระบบ
```

> **ให้มองภาพนี้ว่า** "asyncio คือพนักงานคนเดียวที่เก่งเรื่องสลับงานตอนรอ ไม่ใช่การจ้างคนเพิ่ม — ถ้าใครสักคนนั่งคิดเลขยาว ๆ ไม่ยอมปล่อยคิว ทุกคนหยุดหมด"

หลักที่ต้องจำ 3 ข้อ:

- `async def` = **coroutine** เรียกเฉย ๆ ไม่ทำงาน ต้อง `await` หรือโยนเข้า loop
- ใน `async` function **ห้ามเรียกฟังก์ชัน blocking** (เช่น library DB แบบ sync, `time.sleep`) ต้องใช้เวอร์ชัน async หรือโยนไป thread pool
- asyncio แก้ปัญหา **I/O-bound** ไม่ได้แก้ **CPU-bound** (GIL ยังอยู่ และ loop มีเส้นเดียว)

### 5.4 Iterator vs Generator

```
for x in data:
   ↓ Python เรียก iter(data)  → ได้ ITERATOR
   ↓ เรียก next(iterator) ซ้ำ ๆ
   ↓ เมื่อหมด → โยน StopIteration → for จบเงียบ ๆ
```

> **ให้มองภาพนี้ว่า** "`for` ของ Python ไม่ได้วนด้วยเลข index แต่ขอของชิ้นถัดไปจนกว่าจะไม่มีให้ขอ"

Pseudocode สั้น (generator):

```
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.strip()      # ส่งทีละบรรทัด ไม่โหลดทั้งไฟล์
```

อธิบาย: `yield` ทำให้ฟังก์ชัน **หยุดค้างไว้** แล้วกลับมาทำต่อจากจุดเดิมเมื่อถูกขอค่าถัดไป → ใช้แรมคงที่ไม่ว่าไฟล์จะใหญ่แค่ไหน

### 5.5 Module / Package / pip / venv

```
project/
├── venv/                 ← กล่องเครื่องมือเฉพาะโปรเจกต์นี้
├── requirements.txt      ← ใบรายการของ
└── app/                  ← PACKAGE
    ├── __init__.py
    ├── main.py           ← MODULE
    └── services/
        └── order.py      ← MODULE
```

```
[ import app.services.order ]
     ↓
[ sys.path ]  ไล่หาตามลำดับ: โฟลเดอร์ปัจจุบัน → venv/site-packages → standard library
     ↓
[ โหลด + รันไฟล์ 1 ครั้ง แล้ว cache ไว้ใน sys.modules ]
```

> **ให้มองภาพนี้ว่า** "import คือการไปหาไฟล์ตามเส้นทางที่กำหนดไว้ แล้วรันมันหนึ่งครั้ง — ครั้งต่อไปหยิบของที่จำไว้ ดังนั้นโค้ดระดับบนสุดของ module จะทำงานตอน import ไม่ใช่ตอนเรียกใช้"

### 5.6 Exception Flow

```
try:
    เสี่ยงพัง
except ValueError as e:      ← จับเฉพาะที่คาดไว้
    จัดการ / log / แปลงเป็น error ของ domain
else:
    ทำต่อเมื่อไม่พัง
finally:
    เก็บกวาดเสมอ (ปิดไฟล์ ปล่อย connection)
```

> **ให้มองภาพนี้ว่า** "Python ชอบให้ลองทำไปก่อนแล้วค่อยจับพลาด (EAFP) มากกว่าจะเช็คเงื่อนไขล่วงหน้าทุกอย่าง แต่การจับต้องจับให้ตรงตัว ไม่ใช่กวาดทุกอย่างใส่ตะกร้าเดียว"

---

## 6. Example — Scenario จากงานจริง

### Scenario A: "ทำ API ให้ frontend เรียก"

โจทย์: ทีม frontend ต้องการ `GET /users/{id}` และอยากได้ API doc ที่ไม่ล้าสมัย

เลือก **FastAPI** เพราะ:

| เหตุผล | อธิบาย |
|---|---|
| ใช้ type hint เป็น contract | ประกาศ model ครั้งเดียว ได้ทั้ง validation + doc |
| สร้าง OpenAPI/Swagger อัตโนมัติ | frontend เปิดดูได้เอง ลดการถามกันไปมา |
| async native (ASGI) | รับงาน I/O-bound จำนวนมากได้ดี |

กับดักที่เจอจริง: ทีมเขียน `async def` ทุก endpoint แต่ข้างในเรียก library DB แบบ **sync** → event loop ถูกบล็อก → throughput แย่กว่าเขียน sync ธรรมดาเสียอีก
**บทเรียน:** `async` ไม่ได้ทำให้เร็วขึ้นเอง มันเร็วขึ้นเมื่อ **ทั้งเส้นทางเป็น async จริง**

### Scenario B: "รายงานสรุปยอดขายรายวันช้า 40 นาที"

สาเหตุที่พบ: โค้ดวน loop ทีละแถวใน Python เพื่อคำนวณ 5 ล้านแถว

```
[ อ่านทั้งหมดเข้า list ] → [ for แถวละ 1 ครั้ง คำนวณใน Python ] → [ เขียนไฟล์ ]
        ↑ แรมพุ่ง                ↑ GIL + interpreter overhead เต็ม ๆ
```

ทางแก้ตามลำดับที่ควรคิด (นี่คือ **วิธีคิด** ที่สัมภาษณ์อยากได้):

| ลำดับ | ทำอะไร | เหตุผล |
|---|---|---|
| 1 | วัดก่อนว่าช้าตรงไหน (profile) | ห้ามเดา — อาจช้าที่ query ไม่ใช่ที่คำนวณ |
| 2 | ผลักการ aggregate ลงไปที่ database | DB ทำ group by เก่งกว่า Python มาก |
| 3 | ถ้ายังต้องคำนวณใน Python ใช้ pandas/numpy (vectorized) | งานหนักลงไปทำใน C ซึ่งปล่อย GIL |
| 4 | อ่านด้วย generator แทน list | แรมคงที่ ไม่ระเบิด |
| 5 | ถ้ายังไม่พอ → multiprocessing แบ่งก้อน | หลบ GIL ใช้หลาย core จริง |
| 6 | ถ้ามันไม่ควรอยู่ใน request → ย้ายเป็น background job | ผู้ใช้ไม่ควรนั่งรอ 40 นาที |

### Scenario C: "รันบนเครื่องผมได้ แต่บน server พัง"

อาการคลาสสิก: `ModuleNotFoundError` หรือ behavior ต่างกัน

```
[ เครื่อง dev ]  Python 3.x + package ที่เคย pip install ไว้นานแล้ว (global)
[ server ]       Python คนละ minor version + ไม่มี package บางตัว
```

> **ให้มองภาพนี้ว่า** "ถ้าไม่ล็อกสภาพแวดล้อมไว้ คำว่า 'โค้ดเดียวกัน' ไม่ได้แปลว่า 'ระบบเดียวกัน'"

ทางแก้มาตรฐาน: **venv + requirements ที่ pin version + Docker image ที่ระบุ Python version ชัดเจน**

### Scenario D: "เขียน automation ให้ทีม ops"

งานจริงที่ Python ถูกใช้บ่อยที่สุดในบริษัท:

- ดึงไฟล์จาก SFTP มาแปลงรูปแบบแล้วยัดเข้า DB (ETL)
- เรียก API หลายเจ้ามาเทียบข้อมูลแล้วส่งรายงานเข้า Slack
- script ตรวจ config / ทำความสะอาดข้อมูล / migrate ข้อมูลครั้งเดียว

จุดที่ต้องพูดให้ดูเป็นมืออาชีพ: **script ที่รันซ้ำได้ต้อง idempotent** (รันซ้ำแล้วผลลัพธ์เหมือนเดิม ไม่สร้างข้อมูลซ้ำ) และต้องมี log + exit code ที่ถูกต้อง เพราะมันจะถูกเอาไปต่อกับ cron/CI

### Scenario E: "ทำ AI/LLM feature"

Python เป็น default ของสาย AI ไม่ใช่เพราะภาษาเร็ว แต่เพราะ **library ที่หนักจริงเขียนด้วย C/C++/CUDA แล้วให้ Python เป็นหน้ากากเรียกใช้**

```
[ Python code ]  ← เราเขียนแค่ชั้นบาง ๆ นี้
      ↓
[ numpy / torch ]  ← งานหนักอยู่ในนี้ (native, ปล่อย GIL)
      ↓
[ CPU / GPU ]
```

> **ให้มองภาพนี้ว่า** "Python ในงาน AI ทำหน้าที่เป็นรีโมตคอนโทรล ไม่ใช่เครื่องยนต์ — เครื่องยนต์อยู่ในโค้ด native ข้างล่าง"

---

## 7. Compare

### 7.1 Python vs Java (ตารางหลัก)

| หัวข้อ | Python | Java |
|---|---|---|
| Typing | Dynamic + strong (type hint เสริมได้) | Static + strong (บังคับตอน compile) |
| ตรวจ error ชนิดข้อมูล | ตอน runtime (เจอเมื่อรันถึง) | ตอน compile (เจอก่อนรัน) |
| การรัน | Interpreter → bytecode → PVM | Compile → bytecode → JVM (+ JIT) |
| ความเร็วต่อ operation | ช้ากว่า | เร็วกว่า (JIT optimize ระหว่างรัน) |
| ความยาวโค้ดต่องานเดียวกัน | สั้นกว่าชัดเจน | ยาวกว่า (verbose) |
| Concurrency | GIL → thread ไม่ช่วย CPU-bound, ใช้ process/async | Thread จริง ใช้หลาย core ได้ |
| การจัดการหน่วยความจำ | Reference counting + cycle GC | Generational GC |
| โครงสร้างโปรเจกต์ | อิสระ ขึ้นกับทีม | มี convention แข็ง (package/ชั้น) |
| Ecosystem เด่น | Data, AI, automation, scripting, web | Enterprise backend, Android, ระบบใหญ่ที่อยู่นาน |
| ทีมใหญ่ + โค้ดอายุยาว | ต้องพึ่งวินัย + type hint + test | compiler ช่วยกันพลาดให้เยอะ |
| เริ่มโปรเจกต์ใหม่ | เร็วมาก | ช้ากว่า แต่โครงชัดตั้งแต่ต้น |
| Deploy | ต้องคุม env/venv ให้ดี | jar เดียวจบ (กับ Spring Boot) |

**สรุปแบบพูดได้:** "Python ได้เปรียบเมื่อต้องการความเร็วในการพัฒนาและงานสาย data/AI ส่วน Java ได้เปรียบเมื่อระบบใหญ่ อายุยาว ทีมเยอะ และต้องการให้ compiler จับพลาดให้ตั้งแต่ก่อนรัน"

### 7.2 Python vs Node.js (ตารางหลัก)

| หัวข้อ | Python | Node.js |
|---|---|---|
| ภาษา | Python | JavaScript / TypeScript |
| โมเดล concurrency เริ่มต้น | Sync เป็นค่าเริ่มต้น (async ต้องเลือกใช้) | Async/non-blocking เป็นค่าเริ่มต้น |
| Event loop | มีเมื่อใช้ asyncio | มีตลอดเวลา เป็นแกนของ runtime |
| ข้อจำกัด multi-core | GIL → ใช้ multiprocessing | Single thread → ใช้ cluster / worker_threads |
| CPU-bound | ต้องหนีไป process/native lib | บล็อก event loop ทั้งตัว ต้องหนีไป worker thread |
| I/O-bound | ดีเมื่อใช้ asyncio/threads | ดีมากโดยธรรมชาติ |
| Typing | dynamic + type hint (ไม่บังคับ) | dynamic; TypeScript ให้ static ตอน compile |
| แชร์ภาษากับ frontend | ไม่ได้ | ได้ (จุดแข็งใหญ่ของทีม full-stack) |
| จุดแข็ง ecosystem | data, AI, ML, automation, scientific | web/real-time, tooling frontend, serverless |
| Package manager | pip + venv | npm / pnpm + node_modules |
| Framework ยอดนิยม | FastAPI / Django / Flask | Express / NestJS / Fastify |
| เหมาะเมื่อ | ระบบต้องต่อกับ data/ML, ทีมถนัด Python | ระบบ real-time, ทีมเดียวกันทำทั้ง front/back |

### 7.3 List vs Tuple vs Set vs Dict

| | List | Tuple | Set | Dict |
|---|---|---|---|---|
| รูปแบบ | `[1,2,3]` | `(1,2,3)` | `{1,2,3}` | `{"k": v}` |
| แก้ได้ (mutable) | ได้ | **ไม่ได้** | ได้ | ได้ |
| มีลำดับ | มี | มี | ไม่รับประกัน | คงลำดับที่ใส่ (พฤติกรรมปัจจุบัน) |
| ค่าซ้ำ | ได้ | ได้ | **ไม่ได้** | key ซ้ำไม่ได้ |
| เช็ค "มีอยู่ไหม" | ช้า O(n) | ช้า O(n) | **เร็ว O(1) เฉลี่ย** | เร็ว O(1) เฉลี่ย (ที่ key) |
| ใช้เป็น key ของ dict | ไม่ได้ | **ได้** | ไม่ได้ | ไม่ได้ |
| ใช้เมื่อ | ลำดับข้อมูลที่เปลี่ยนได้ | ข้อมูลชุดคงที่ / คืนหลายค่า | ตัดซ้ำ / ตรวจสมาชิก | จับคู่ key→value |

**คำถามกับดัก:** "จะเช็คว่า id นี้อยู่ในรายการ 100,000 ตัวไหม ใช้อะไร" → ตอบ **set** (O(1)) ไม่ใช่ list (O(n))

### 7.4 FastAPI vs Django vs Flask

| หัวข้อ | FastAPI | Django | Flask |
|---|---|---|---|
| ปรัชญา | async + type hint first | batteries included | micro, ประกอบเอง |
| มาตรฐานเซิร์ฟเวอร์ | ASGI (async) | WSGI เป็นหลัก (รองรับ async บางส่วน) | WSGI |
| ORM | เลือกเอง (มัก SQLAlchemy) | **Django ORM มาในตัว** | เลือกเอง |
| Admin panel | ไม่มี | **มีให้ใช้ทันที** | ไม่มี |
| Auth ระบบผู้ใช้ | ทำเอง/ประกอบ | มาในตัว | ทำเอง |
| API docs | **อัตโนมัติ (OpenAPI)** | ต้องเพิ่ม library | ต้องเพิ่ม library |
| เหมาะเมื่อ | API service, microservice, งาน I/O หนัก | เว็บครบวงจร มีหลังบ้าน CMS/แอดมิน | โปรเจกต์เล็ก, prototype, คุมเองทุกอย่าง |
| ข้อแลก | ต้องเข้าใจ async ให้ดี ไม่งั้นพังเงียบ | โครงใหญ่ ผูกกับวิธีของ Django | ต้องตัดสินใจเองเยอะ โตแล้วอาจไม่มีมาตรฐาน |

### 7.5 Thread vs Process vs Asyncio (สรุปการเลือก)

| งาน | เลือก | เพราะ |
|---|---|---|
| รอ API/DB จำนวนมาก | asyncio (หรือ thread pool) | GIL ถูกปล่อยตอนรอ |
| คำนวณหนัก | multiprocessing / native lib | หลบ GIL ใช้หลาย core |
| ผสมทั้งสอง | async สำหรับ I/O + ส่งงานหนักไป process pool | แยกตามธรรมชาติของงาน |
| งานหนักและนานมาก | queue + worker แยกออกจาก API | ไม่ให้ผู้ใช้รอ และ scale แยกได้ |

---

## 8. Common Mistakes

**1. คิดว่า "Python ช้า" แปลว่าใช้กับ production ไม่ได้**
ความจริง: ระบบส่วนใหญ่คอขวดอยู่ที่ **I/O และ database** ไม่ใช่ที่ CPU ของภาษา — Python ช้ากว่า Java ต่อ operation จริง แต่บ่อยครั้งไม่ใช่ปัจจัยชี้ขาด

**2. เข้าใจ GIL ผิดว่า "Python ใช้หลาย thread ไม่ได้"**
ผิด — สร้าง thread ได้ และ **ช่วยจริงกับ I/O-bound** สิ่งที่ทำไม่ได้คือให้หลาย thread รัน Python bytecode พร้อมกันเพื่อเร่ง CPU-bound

**3. คิดว่าใส่ `async` แล้วจะเร็วขึ้นเอง**
ถ้าข้างในยังเรียกของ blocking (library sync, `time.sleep`, คำนวณยาว) → บล็อก event loop ทั้งระบบ แย่กว่าเดิม

**4. Mutable default argument**
```
def add(item, bucket=[]):   # ❗ list ตัวเดียวถูกใช้ร่วมกันทุกครั้งที่เรียก
```
ค่า default ถูกสร้าง **ครั้งเดียวตอนนิยามฟังก์ชัน** → ข้อมูลจากการเรียกก่อนหน้าค้างมา (ใช้ `None` แล้วสร้างข้างในแทน)

**5. `b = a` แล้วคิดว่าได้ copy**
ได้แค่ป้ายชื่ออีกใบที่ชี้ของเดิม (ดูข้อ 3) — ต้อง copy ตั้งใจ และระวัง shallow vs deep copy

**6. `except:` เปล่า ๆ หรือ `except Exception: pass`**
กลืน error ทุกชนิดรวมถึงที่ไม่ควรกลืน → production พังแบบเงียบ ๆ หาสาเหตุไม่เจอ ควรจับให้ตรง type และ log เสมอ

**7. ไม่ใช้ virtual environment**
ติดตั้ง package ลง global ทั้งเครื่อง → โปรเจกต์ชนกัน และ reproduce ไม่ได้

**8. `requirements.txt` ไม่ pin version**
วันดีคืนดี dependency อัปเดตแล้ว build พังทั้งที่โค้ดเราไม่เปลี่ยน

**9. โหลดทั้งไฟล์/ทั้งตารางเข้า memory**
`lines = f.readlines()` กับไฟล์ 5 GB = process ตาย → ใช้ generator / อ่านเป็นก้อน

**10. คิดว่า type hint บังคับตอนรัน**
Python **ไม่ตรวจ type hint ตอน runtime** (ยกเว้น framework อย่าง FastAPI/pydantic ที่ validate ให้เอง) ต้องใช้ mypy ใน CI ถ้าอยากให้ถูกบังคับจริง

**11. ใช้ `list` เพื่อเช็คสมาชิกในข้อมูลขนาดใหญ่**
`if x in big_list` = O(n) ทุกครั้ง → ใช้ `set`

**12. ลืมว่าโค้ดระดับบนสุดของ module ทำงานตอน import**
เขียน `connect_db()` ไว้นอกฟังก์ชัน → พอ import ก็ต่อ DB ทันที ทั้งตอนรัน test ด้วย

---

## 9. Debugging — พังแล้วไล่ดูอะไรตามลำดับ

### 9.1 ลำดับสากล

```
[ อ่าน Traceback จาก "ล่างขึ้นบน" ]
        ↓ บรรทัดล่างสุด = ชนิด error + ข้อความ
        ↓ ไล่ขึ้นหา "ไฟล์ของเรา" บรรทัดแรก (ไม่ใช่ของ library)
[ Reproduce ให้ได้เล็กที่สุด ]
        ↓
[ ตรวจชนิด/ค่าของข้อมูลจริง ณ จุดนั้น ]
        ↓
[ ตรวจ environment (venv/version/env var) ]
        ↓
[ ถ้าเป็นเรื่องช้า → profile ก่อน อย่าเดา ]
```

> **ให้มองภาพนี้ว่า** "Traceback ของ Python คือรอยเท้าย้อนหลัง — ตัวที่พังอยู่ล่างสุด ส่วนต้นเหตุมักอยู่ในบรรทัดของเราที่อยู่เหนือขึ้นไป"

### 9.2 ตารางอาการ → สาเหตุ → ที่ต้องดู

| อาการ | สาเหตุที่พบบ่อย | ไล่ดูตามลำดับ |
|---|---|---|
| `ModuleNotFoundError` | ไม่ได้ activate venv / ชื่อ package ≠ ชื่อ import / path ผิด | `which python` → `pip list` → โครงสร้างโฟลเดอร์ |
| `ImportError: circular import` | สอง module import กันไปมา | ดูกราฟการ import → ย้าย import เข้าในฟังก์ชัน หรือรื้อโครง |
| `TypeError: NoneType ...` | ฟังก์ชันคืน `None` โดยไม่ตั้งใจ (ลืม return) | ไล่ย้อนว่าค่ามาจากไหน → print/type ที่ต้นทาง |
| `KeyError` / `IndexError` | สมมติว่าข้อมูลมีครบ | ตรวจข้อมูลจริงจาก source → ใช้ `.get()` พร้อม default |
| `AttributeError` | เข้าใจชนิดข้อมูลผิด (dynamic typing) | `type(x)` ตรงจุดนั้น → เพิ่ม type hint กันซ้ำ |
| ข้อมูลเปลี่ยนเองแปลก ๆ | ส่ง mutable object เข้าไปแล้วถูกแก้ / mutable default arg | หาใครถืออ้างอิงชิ้นเดียวกันบ้าง |
| แรมพุ่งจนโดน kill | โหลดทั้งก้อนเข้า memory / เก็บ list สะสมในลูป | เปลี่ยนเป็น generator → วัดด้วย memory profiler |
| ช้าผิดปกติ | loop ระดับ Python บนข้อมูลใหญ่ / N+1 query | profile (cProfile) → ดู query → พิจารณา vectorize |
| ใช้ thread แล้วไม่เร็วขึ้นเลย | งานเป็น CPU-bound + GIL | เปลี่ยนเป็น multiprocessing / native lib |
| async แล้วช้ากว่าเดิม | มี blocking call ใน coroutine | หา library sync ที่ซ่อนอยู่ → ย้ายไป thread pool |
| งานค้าง ไม่มี error | deadlock / `await` สิ่งที่ไม่มีวันเสร็จ / timeout ไม่ตั้ง | ใส่ timeout ทุก external call → ดู stack ของ task |
| dev ผ่าน prod พัง | version/env var/dependency ต่างกัน | เทียบ `pip freeze` → ตรวจ Docker image → ตรวจ env |
| error หายไปเฉย ๆ | `except: pass` | ค้นหา except เปล่าในโปรเจกต์ |

### 9.3 เครื่องมือประจำตัว

| เครื่องมือ | ใช้เมื่อ |
|---|---|
| `logging` (ไม่ใช่ `print`) | production — มี level, ส่งเข้า log aggregator ได้ |
| `pdb` / debugger ของ IDE | อยากหยุดดูค่าจริงกลางทาง |
| `cProfile` / py-spy | หาว่าเวลาหมดไปกับฟังก์ชันไหน |
| memory profiler / `tracemalloc` | สงสัยแรมรั่ว |
| `mypy` | ดัก type error ก่อน runtime |
| `pytest` | เขียน test ให้บั๊กไม่กลับมา |

---

## 10. Interview Questions

### 🟢 Junior

1. Python เป็นภาษาแบบ compile หรือ interpret อธิบาย
2. Dynamic typing คืออะไร ข้อดีข้อเสีย
3. List กับ Tuple ต่างกันอย่างไร
4. Set มีไว้ทำไม ต่างจาก List อย่างไร
5. Dictionary ใช้ตอนไหน
6. Module กับ Package ต่างกันอย่างไร
7. pip คืออะไร ใช้ทำอะไร
8. Virtual environment คืออะไร ทำไมต้องใช้
9. `try/except/finally` ทำงานอย่างไร
10. Python ใช้ทำอะไรได้บ้างในบริษัทหนึ่ง ๆ
11. Type hint คืออะไร บังคับตอนรันไหม

### 🟡 Mid

1. Iterator กับ Generator ต่างกันอย่างไร ใช้ Generator ตอนไหน
2. `yield` ทำงานอย่างไร
3. GIL คืออะไร กระทบอะไรบ้าง
4. งาน CPU-bound กับ I/O-bound ต่างกันอย่างไร แต่ละแบบ Python ควรใช้วิธีไหน
5. asyncio ทำงานอย่างไร ต่างจาก thread อย่างไร
6. Decorator คืออะไร เคยใช้ทำอะไร
7. Mutable default argument คือปัญหาอะไร
8. Shallow copy กับ deep copy ต่างกันอย่างไร
9. FastAPI กับ Django เลือกอย่างไร
10. WSGI กับ ASGI ต่างกันอย่างไร
11. Python กับ Node.js ต่างกันอย่างไร จะเลือกอันไหนเมื่อไร
12. จะทำให้ environment ของ dev กับ prod เหมือนกันได้อย่างไร

### 🔴 Senior

1. ระบบ Python ทำงานช้าลงเรื่อย ๆ จะไล่หาสาเหตุอย่างไรตั้งแต่ต้นจนจบ
2. มีงานคำนวณหนักที่ต้องเร็วขึ้น 10 เท่า จะเลือกทางไหนและเพราะอะไร
3. อธิบายว่าทำไม `async def` ถึงอาจทำให้ระบบแย่ลงได้
4. Python เหมาะ/ไม่เหมาะกับระบบแบบไหน และเราจะลดข้อเสียได้อย่างไร
5. โปรเจกต์ Python ขนาดใหญ่ทีม 20 คน จะกันไม่ให้ dynamic typing สร้างหนี้เทคนิคได้อย่างไร
6. ออกแบบ batch job ที่ประมวลผลข้อมูล 100 ล้านแถวโดยไม่ทำให้แรมระเบิด
7. อธิบายการจัดการหน่วยความจำของ Python และกรณีที่เกิด memory leak ได้ทั้งที่มี GC
8. จะออกแบบ error handling ของ service Python ให้ debug ได้ใน production อย่างไร
9. เมื่อไรควรย้ายงานบางส่วนออกจาก Python ไปภาษาอื่น

---

## 11. Answer Like a Developer

**โครงการตอบ 4 จังหวะ:**

```
1) นิยามสั้น
2) ผลกระทบจริงกับระบบ
3) ตัวอย่าง/สถานการณ์
4) trade-off หรือทางแก้
```

**ตัวอย่างที่ 1 — "GIL คืออะไร"** (คำถามคัดคนของบทนี้)

> (1) GIL คือล็อกใน CPython ที่ยอมให้มีเพียง thread เดียวรัน Python bytecode ได้ในเวลาหนึ่ง
> (2) ผลคือ multithread **ไม่ช่วยเร่งงาน CPU-bound** เพราะ thread ต้องผลัดกันถือล็อก แต่ **ยังช่วยงาน I/O-bound** เพราะระหว่างรอ I/O GIL ถูกปล่อยให้คนอื่นทำงาน
> (3) เช่น ยิง API 100 เส้นพร้อมกัน ใช้ thread หรือ asyncio ก็เร็วขึ้นชัดเจน แต่ถ้าเป็นการคำนวณ hash 100 ล้านรอบ เพิ่ม thread แล้วเวลาเท่าเดิมหรือแย่ลง
> (4) ทางออกงาน CPU-bound มีสามทาง: ใช้ multiprocessing เพื่อให้แต่ละ process มี GIL ของตัวเอง, ผลักงานลงไปที่ native library อย่าง numpy ที่ปล่อย GIL ระหว่างทำงานใน C, หรือย้ายงานนั้นออกไปเป็น worker/service แยก

**ตัวอย่างที่ 2 — "ทำไมต้องใช้ venv"**

> "เพราะ dependency ของแต่ละโปรเจกต์ต้องการ version ไม่เท่ากัน ถ้าลง global ทั้งเครื่อง วันที่โปรเจกต์ใหม่ต้องการ library รุ่นใหม่ โปรเจกต์เก่าจะพังทันที venv ทำให้แต่ละโปรเจกต์มีชุดของตัวเอง และทำให้เรา reproduce สภาพแวดล้อมเดียวกันบน server ได้ ซึ่งเป็นเหตุผลเดียวกับที่เราใช้ Docker ในขั้นถัดไป"

**ตัวอย่างที่ 3 — "Python vs Node.js"**

> "ถ้าระบบต้องต่อกับงาน data หรือ ML ผมเลือก Python เพราะ ecosystem อยู่ตรงนั้นหมด แต่ถ้าเป็น real-time หรือทีมเดียวกันทำทั้ง frontend และ backend ผมเลือก Node เพราะได้ภาษาเดียวกันทั้งระบบ ในแง่ concurrency ทั้งคู่จำกัดที่ core เดียวโดยธรรมชาติ Python ติด GIL ส่วน Node เป็น single-thread event loop ทางแก้ก็คล้ายกันคือแยก process/worker"

**สิ่งที่ไม่ควรตอบ:**

- "GIL ทำให้ Python ใช้ thread ไม่ได้" (ผิด)
- "async เร็วกว่า sync" (ไม่มี context — เร็วกว่าเฉพาะงาน I/O-bound ที่ async ทั้งเส้น)
- "Python ช้า เลยใช้ทำ production ไม่ได้" (ผิดและแสดงว่าไม่รู้ว่าคอขวดจริงอยู่ที่ไหน)

---

## 12. One-Minute Review

- **Python** = interpreted, dynamic typing, strong typing, เน้น readability
- ตัวแปรคือ **ป้ายชื่อ** ไม่ใช่กล่อง → `b = a` ไม่ใช่การ copy
- **List** แก้ได้ / **Tuple** แก้ไม่ได้ / **Set** ไม่ซ้ำ + ค้นเร็ว / **Dict** คู่ key→value
- **Module** = ไฟล์, **Package** = โฟลเดอร์ของ module, **pip** = ตัวติดตั้ง, **venv** = กล่องแยก dependency
- **Generator (`yield`)** = ผลิตทีละชิ้น ประหยัดแรม — หัวใจของการประมวลผลข้อมูลใหญ่
- **Exception** ให้จับให้ตรงชนิด อย่าใช้ `except: pass`
- **GIL** = หนึ่ง thread รัน bytecode ได้ในเวลาหนึ่ง → กระทบ **CPU-bound** ไม่กระทบ **I/O-bound** มาก
- ทางออก CPU-bound = **multiprocessing / native library / แยก worker**
- **asyncio** = event loop เดียว เก่งเรื่อง I/O — ห้ามมี blocking call ข้างใน
- **FastAPI** (API + async + docs), **Django** (ครบวงจร), **Flask** (เล็ก ประกอบเอง)
- **Python vs Java** = พัฒนาเร็ว/ยืดหยุ่น vs compile ช่วยจับพลาด + thread จริง
- **Python vs Node** = ecosystem data/AI vs ภาษาเดียวกับ frontend + async โดยกำเนิด
- Debug: อ่าน traceback จากล่างขึ้นบน → reproduce เล็กสุด → ตรวจชนิดข้อมูล → ตรวจ env → **profile ก่อน optimize**

---

## 13. Memory Card

**จำ 5 อย่าง**

1. **Python = ล่ามแปลสด + dynamic typing** → เขียนเร็ว แต่ error ชนิดข้อมูลมาเจอตอน runtime จึงต้องพึ่ง test + type hint
2. **ตัวแปรคือป้ายชื่อ** → การส่ง object ไปมาคือส่ง "อ้างอิง" ระวังของถูกแก้โดยไม่ตั้งใจ
3. **GIL กระทบ CPU-bound ไม่กระทบ I/O-bound** → CPU หนักให้ใช้ process หรือ native lib, I/O หนักให้ใช้ asyncio/thread
4. **Generator คือเครื่องมือประหยัดแรมประจำตัว** → ข้อมูลใหญ่แค่ไหนก็ไหลผ่านทีละชิ้นได้
5. **venv + pin version = ความหมายของคำว่า "รันได้เหมือนกันทุกเครื่อง"**

**Keyword**

- **Interpreter** → ล่ามที่รันโค้ดทีละคำสั่ง
- **Bytecode** → ภาษากลางที่ PVM รัน
- **Dynamic Typing** → ชนิดผูกกับค่า ตรวจตอนรัน
- **Strong Typing** → ไม่แปลงชนิดให้เอง
- **Type Hint** → ป้ายบอกชนิด ไม่บังคับตอนรัน
- **List** → เรียงลำดับ แก้ได้
- **Tuple** → เรียงลำดับ แก้ไม่ได้
- **Set** → ไม่ซ้ำ ค้นเร็ว
- **Dict** → key → value
- **Module / Package** → ไฟล์ / โฟลเดอร์ของไฟล์
- **pip / PyPI** → ตัวติดตั้ง / คลังกลาง
- **venv** → กล่อง dependency ต่อโปรเจกต์
- **Exception** → error ที่โยนขึ้นมาให้จับ
- **EAFP** → ลองก่อน ผิดค่อยจับ
- **Iterator** → ตัวให้ค่าถัดไป
- **Generator** → ฟังก์ชัน `yield` ผลิตทีละชิ้น
- **Decorator** → ห่อฟังก์ชันเพื่อเพิ่มพฤติกรรม
- **Context Manager** → `with` เปิดแล้วปิดให้แน่
- **GIL** → ไมโครโฟนตัวเดียวของ interpreter
- **CPU-bound / I/O-bound** → งานคิด / งานรอ
- **multiprocessing** → แยก process หลบ GIL
- **asyncio** → event loop สำหรับงานรอ
- **Coroutine** → ฟังก์ชันที่หยุดกลางคันได้
- **WSGI / ASGI** → มาตรฐาน sync / async
- **FastAPI / Django / Flask** → API+async / ครบวงจร / เล็กและอิสระ

---

[← สารบัญ](./00-README-TOC.md)
