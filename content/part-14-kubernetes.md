# PART 14 — KUBERNETES

> ตำแหน่งในภาพใหญ่: Infrastructure Layer — ชั้นที่รับ container จาก Docker (PART 13) ไป "รัน จริง ๆ บนเครื่องหลายเครื่อง" และดูแลให้ยังมีชีวิตอยู่ตลอดเวลา

---

## 1. Big Picture

ใน PART 13 เราเรียนว่า **Docker** ทำให้เราแพ็คโปรแกรมพร้อมของทุกอย่างลงเป็น **Image** แล้วรันเป็น **Container** ได้เหมือนกันทุกเครื่อง

ปัญหาคือ... Docker ตอบได้แค่คำถามเดียว:

> "จะรัน container **1 ตัว** บนเครื่อง **1 เครื่อง** ยังไง?"

แต่ระบบจริงในบริษัทไม่ได้หน้าตาแบบนั้น ระบบจริงหน้าตาแบบนี้:

- ต้องรัน container **20 ตัว** บนเครื่อง **5 เครื่อง**
- ถ้า container ตาย ต้อง **มีคนสร้างใหม่ให้ทันที** ตอนตีสาม โดยไม่มีใครตื่นมาแตะ
- ถ้าคนเข้าเว็บเยอะขึ้น ต้อง **เพิ่มจำนวน container อัตโนมัติ**
- ถ้าเครื่องใดเครื่องหนึ่ง **พัง** ต้องย้าย container ไปเครื่องอื่นเอง
- ตอน deploy version ใหม่ ต้อง **ไม่มี downtime** และถ้าพัง ต้อง **ย้อนกลับได้**
- Traffic จากอินเทอร์เน็ตต้อง **กระจาย** ไปยัง container หลายตัวอย่างเท่า ๆ กัน

ถ้าไม่มีเครื่องมือ เราต้องมีคนนั่งเฝ้า SSH เข้าเครื่อง แล้วพิมพ์ `docker run` ใหม่ทุกครั้งที่มีอะไรตาย — ซึ่งเป็นไปไม่ได้ในทางปฏิบัติ

**Kubernetes (K8s)** → "ระบบจัดการ container อัตโนมัติ" → มีไว้เพื่อเป็น **คนที่นั่งเฝ้าแทนเรา 24 ชั่วโมง**

ชื่อ Kubernetes มาจากภาษากรีกแปลว่า "นายท้ายเรือ / กัปตัน" และคำย่อ **K8s** มาจาก K + อักษร 8 ตัว + s

หัวใจของ Kubernetes ไม่ใช่ "คำสั่ง" แต่คือ **การประกาศ**:

> เราไม่ได้สั่งว่า "รัน container นี้เดี๋ยวนี้"
> เรา **ประกาศ** ว่า "ระบบนี้ต้องมี container แบบนี้ 3 ตัวตลอดเวลา"
> แล้ว Kubernetes จะพยายามทำให้เป็นจริงเองไปเรื่อย ๆ ไม่มีวันหยุด

เรียกแนวคิดนี้ว่า **Declarative** → "บอกผลลัพธ์ที่ต้องการ ไม่ใช่บอกขั้นตอน"

**สรุปด้วยประโยคเดียวสำหรับตอบสัมภาษณ์:**

> "Kubernetes คือ container orchestration platform ที่เราประกาศ desired state ลงไป แล้วมันจะคอยเทียบกับ actual state และแก้ให้ตรงกันตลอดเวลา ทำให้ได้ self healing, auto scaling, rolling update และ load balancing โดยไม่ต้องมีคนนั่งเฝ้า"

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Container Orchestration** | คนคุมวงออเคสตรา | การจัดการ container จำนวนมากบนหลายเครื่องให้ทำงานประสานกัน |
| **Kubernetes (K8s)** | ผู้จัดการโกดัง | ระบบ orchestration ที่นิยมที่สุด — รักษา desired state |
| **Cluster** | โกดังทั้งหลัง | กลุ่มเครื่องทั้งหมดที่ Kubernetes ดูแล (Control Plane + Nodes) |
| **Control Plane** | ห้องผู้จัดการ | สมองของ cluster — ตัดสินใจว่าอะไรควรรันที่ไหน |
| **Node** | เครื่อง 1 เครื่อง | server (จริงหรือ VM) ที่ใช้รัน Pod |
| **Pod** | กล่องหิ้วเล็กที่สุด | หน่วยเล็กที่สุดที่ K8s จัดการ — ห่อ container 1 ตัว (หรือมากกว่า) |
| **Container** | ตัวโปรแกรมจริง | process ที่รันจริงจาก Docker Image ข้างใน Pod |
| **Deployment** | ใบสั่งผลิต | บอกว่าต้องการ Pod แบบไหน กี่ตัว และจะอัปเดตยังไง |
| **ReplicaSet** | คนนับจำนวน | ตัวที่ Deployment ใช้ควบคุมให้จำนวน Pod ตรงตามที่ประกาศ |
| **Service** | เบอร์กลางของบริษัท | ชื่อ/IP ถาวรที่ชี้ไปยังกลุ่ม Pod ที่เปลี่ยนตลอดเวลา |
| **Ingress** | ประตูหน้าตึก | ตัวรับ traffic HTTP/HTTPS จากภายนอกแล้วแจกตาม path/domain |
| **ConfigMap** | ใบตั้งค่า | เก็บ config ที่ไม่ลับ แยกออกจาก image |
| **Secret** | ซองปิดผนึก (แต่ไม่ล็อก) | เก็บข้อมูลลับ — **เก็บเป็น base64 ซึ่งเป็นแค่การ encode ไม่ใช่ encrypt** |
| **Namespace** | ห้องแยกในโกดัง | แบ่ง cluster เป็นโซนตามทีม/environment |
| **Label / Selector** | ป้ายชื่อ / ตัวคัดป้าย | วิธีที่ Service หา Pod เจอ — จับคู่ด้วย label ไม่ใช่ IP |
| **Desired State** | สภาพที่เราอยากได้ | สิ่งที่เราประกาศไว้ใน YAML |
| **Actual State** | สภาพจริงตอนนี้ | สิ่งที่เกิดขึ้นจริงใน cluster |
| **Reconciliation Loop** | วงจรไล่ให้ตรง | loop ที่เทียบ desired กับ actual แล้วแก้ต่าง |
| **Self Healing** | ซ่อมตัวเอง | Pod ตาย → สร้างใหม่อัตโนมัติ |
| **Auto Scaling (HPA)** | เพิ่ม/ลดคนงานเอง | เพิ่มลดจำนวน Pod ตามภาระงาน |
| **Rolling Update** | เปลี่ยนทีละคน | deploy version ใหม่ทีละ Pod เพื่อไม่ให้ระบบล่ม |
| **Rollback** | ถอยกลับเวอร์ชันเดิม | ย้อนกลับไป version ก่อนหน้าเมื่อ deploy พัง |
| **Health Check** | ตรวจสุขภาพ | K8s ยิง request มาถามเป็นระยะว่า "ยังไหวไหม" |
| **Liveness Probe** | "ยังมีชีวิตไหม" | ถ้าไม่ผ่าน → **kill แล้วสร้างใหม่** |
| **Readiness Probe** | "พร้อมรับงานหรือยัง" | ถ้าไม่ผ่าน → **ถอดออกจาก Service ชั่วคราว ไม่ kill** |
| **Startup Probe** | "เพิ่งตื่น รอหน่อย" | กันไม่ให้ liveness ฆ่า app ที่ boot ช้า |
| **Load Balancing** | แจกงานให้เท่า ๆ กัน | กระจาย request ไปยัง Pod หลายตัว |
| **Requests / Limits** | ขอที่จอง / เพดาน | ทรัพยากรขั้นต่ำที่การันตี และเพดานสูงสุดที่ใช้ได้ |
| **OOMKilled** | ถูกฆ่าเพราะกินแรมเกิน | container ใช้ memory เกิน limit → ถูก kernel ฆ่าทันที |
| **CPU Throttle** | ถูกหรี่ความเร็ว | ใช้ CPU เกิน limit → ไม่ถูกฆ่า แต่ถูกทำให้ช้าลง |
| **kubectl** | รีโมทคอนโทรล | CLI ที่เราใช้คุยกับ cluster |
| **Manifest (YAML)** | ใบประกาศ | ไฟล์ที่เขียน desired state |
| **Scheduler** | คนจัดที่นอน | ตัวตัดสินว่า Pod ใหม่ควรไปลงที่ Node ไหน |
| **kubelet** | หัวหน้าคนงานประจำเครื่อง | agent บนทุก Node ที่รับคำสั่งมารัน container จริง |

---

## 3. Mental Model

ให้ทิ้งความคิดแบบ "สั่งงานทีละคำสั่ง" ออกไปก่อน

### 3.1 คิดแบบ Declarative ไม่ใช่ Imperative

| แบบ | เราพูดว่า | ตัวอย่าง |
|---|---|---|
| **Imperative** (สั่งขั้นตอน) | "ทำ 1-2-3 ตามนี้" | `docker run ...` แล้วถ้าตายค่อยรันใหม่เอง |
| **Declarative** (ประกาศผลลัพธ์) | "สภาพสุดท้ายต้องเป็นแบบนี้" | ประกาศว่า `replicas: 3` แล้วปล่อยให้ K8s จัดการ |

เปรียบเทียบง่าย ๆ:

- Imperative = สั่งคนขับรถ "เลี้ยวซ้าย ตรงไป เลี้ยวขวา"
- Declarative = บอก GPS ว่า "ฉันจะไปสยาม" แล้วมันหาทางเอง และถ้าเราหลงทาง มันจะคำนวณเส้นทางใหม่ให้เอง

**คำว่า "คำนวณเส้นทางใหม่ให้เองเมื่อหลงทาง" นี่แหละคือหัวใจของ Kubernetes**

### 3.2 Mental Model หลัก: Desired State vs Actual State

นี่คือสิ่งเดียวที่ถ้าเข้าใจ จะเข้าใจ Kubernetes ทั้งหมด

```
       [ YAML Manifest ]
              ↓  (kubectl apply)
      [ DESIRED STATE ]      ← "ฉันอยากได้ 3 Pods"
              ↓
   ┌─────────────────────┐
   │  KUBERNETES         │
   │  Reconciliation     │  ← เทียบ + แก้ต่าง ตลอดเวลา
   │  Loop (ทุกวินาที)    │
   └─────────────────────┘
              ↓
      [ ACTUAL STATE ]       ← "ตอนนี้มีจริง 2 Pods"
              ↓
      ต่างกัน → ลงมือแก้ → วนกลับไปเทียบใหม่
```

ให้มองภาพนี้ว่า Kubernetes คือพนักงานที่ถือใบสั่งแล้วเดินตรวจของในโกดังซ้ำ ๆ ไม่มีวันหยุด ถ้าของขาดไปจากใบสั่งเมื่อไร เขาจะเติมให้ครบทันทีโดยไม่ต้องมีใครบอก

**ตัวอย่างที่ต้องจำให้ขึ้นใจ:**

| เวลา | Desired State | Actual State | Kubernetes ทำอะไร |
|---|---|---|---|
| 10:00 | 3 Pods | 3 Pods | ไม่ทำอะไร (ตรงกันแล้ว) |
| 10:05 | 3 Pods | **2 Pods** (Pod หนึ่งตาย) | **สร้างเพิ่ม 1 Pod** |
| 10:06 | 3 Pods | 3 Pods | ไม่ทำอะไร (กลับมาตรงกัน) |
| 11:00 | 3 Pods | **5 Pods** (มีคนไปสร้างมือ) | **ลบทิ้ง 2 Pods** |

สังเกตว่า Kubernetes แก้ **ทั้งสองทิศทาง** — ขาดก็เติม เกินก็ลบ มันไม่ได้สนใจว่า "ทำไมถึงขาด" มันสนใจแค่ว่า "ตอนนี้ยังไม่ตรง"

> **ประโยคทองสำหรับสัมภาษณ์:** "Kubernetes ไม่ใช่เครื่องมือ deploy มันคือ control loop ที่พยายามลากระบบจริงเข้าหาสภาพที่เราประกาศไว้ตลอดเวลา"

### 3.3 คิดเป็นชั้น ๆ ซ้อนกัน

```
Cluster
  └── Node (เครื่อง)
        └── Pod (หน่วยเล็กที่สุดของ K8s)
              └── Container (โปรแกรมจริงจาก Docker Image)
```

ให้มองภาพนี้ว่า Cluster คือโกดังทั้งหลัง Node คือชั้นวางของแต่ละชั้น Pod คือกล่องที่วางบนชั้น และ Container คือสินค้าจริงที่อยู่ในกล่อง

**จุดที่ junior พลาดบ่อย:** Kubernetes **ไม่ได้จัดการ Container โดยตรง** มันจัดการ **Pod** ต่างหาก Container เป็นแค่สิ่งที่อยู่ข้างใน Pod อีกที

---

## 4. ภาพจำ

```
🧠 ภาพจำหลัก:

Docker      = กล่องสินค้า          (แพ็คของให้เหมือนกันทุกที่)
Kubernetes  = ผู้จัดการโกดัง       (ตัดสินใจว่ากล่องไหนวางชั้นไหน กี่กล่อง)

กล่องหาย → ผู้จัดการสั่งแพ็คใหม่ทันที
ของขายดี → ผู้จัดการสั่งเพิ่มกล่อง
ชั้นวางพัง → ผู้จัดการย้ายกล่องไปชั้นอื่น
```

ขยายภาพจำนี้ให้ครบทุก concept:

| ในโกดัง | ใน Kubernetes |
|---|---|
| โกดังทั้งหลัง | **Cluster** |
| ห้องผู้จัดการ | **Control Plane** |
| ชั้นวางของแต่ละชั้น | **Node** |
| กล่องที่วางบนชั้น | **Pod** |
| สินค้าในกล่อง | **Container** |
| ใบสั่ง "ต้องมีสินค้า A 3 กล่องเสมอ" | **Deployment** |
| พนักงานนับกล่องให้ครบ 3 | **ReplicaSet** |
| เคาน์เตอร์รับของที่มีเบอร์ถาวร | **Service** |
| ประตูหน้าโกดัง + ป้ายบอกทาง | **Ingress** |
| ใบตั้งค่าติดข้างกล่อง | **ConfigMap** |
| ซองลับติดข้างกล่อง | **Secret** |
| โซนแยกของแต่ละแผนก | **Namespace** |
| รปภ. เดินเคาะถามว่า "ยังไหวไหม" | **Liveness Probe** |
| พนักงานถามว่า "เปิดรับลูกค้าหรือยัง" | **Readiness Probe** |

🧠 **ภาพจำย่อยที่ต้องจำแยก — Liveness vs Readiness:**

```
Liveness Probe  = "ยังหายใจอยู่ไหม"   → ไม่ผ่าน = ฆ่าทิ้ง สร้างใหม่
Readiness Probe = "พร้อมรับลูกค้าไหม"  → ไม่ผ่าน = ปิดป้าย "ยังไม่เปิด" แต่ไม่ฆ่า

นึกภาพร้านอาหาร:
  Liveness  ไม่ผ่าน = เจ้าของร้านเป็นลม → เรียกรถพยาบาล เปลี่ยนคนใหม่
  Readiness ไม่ผ่าน = ร้านยังเตรียมของอยู่ → แขวนป้าย "ยังไม่เปิด" ไว้ก่อน
```

---

## 5. How It Works

### 5.1 เส้นทางของ request จากอินเทอร์เน็ตถึง code เรา

```
Internet
   ↓
[ INGRESS ]        ← ประตูหน้า: ดู domain/path แล้วเลือกปลายทาง
   ↓
[ SERVICE ]        ← เบอร์กลางถาวร + load balance
   ↓
[ DEPLOYMENT ]     ← ใบสั่งที่บอกว่า Pod ต้องหน้าตาแบบไหน กี่ตัว
   ↓
[ PODS ]           ← กล่องที่รันจริง (มีหลายตัว)
   ↓
[ CONTAINERS ]     ← โปรแกรมของเราที่รันจาก Docker Image
```

ให้มองภาพนี้ว่า request เดินจากประตูหน้าตึก ผ่านโอเปอเรเตอร์ที่รู้ว่าใครว่างอยู่ แล้วถูกส่งไปหาพนักงานคนใดคนหนึ่งที่พร้อมทำงานจริง

### 5.2 Service กระจาย traffic ไปหลาย Pod ยังไง

```
                  ┌── Pod ── Container
Internet → Service├── Pod ── Container
                  └── Pod ── Container
```

ให้มองภาพนี้ว่า Service คือเบอร์กลางของบริษัทที่ลูกค้าโทรเข้ามาเบอร์เดียว แล้วโอเปอเรเตอร์โอนสายไปหาพนักงานคนไหนก็ได้ที่ว่างอยู่

**ทำไมต้องมี Service ในเมื่อ Pod ก็มี IP อยู่แล้ว?**

เพราะ **IP ของ Pod เปลี่ยนตลอดเวลา** — Pod ตายแล้วเกิดใหม่ = ได้ IP ใหม่ ถ้าเราให้ frontend จำ IP ของ Pod ไว้ตรง ๆ พอ Pod ตายทีนึงระบบจะพังทันที

Service แก้ปัญหานี้ด้วยการเป็น **ชื่อและ IP ถาวร** แล้วใช้ **Label Selector** ในการหาว่า "ตอนนี้ Pod ตัวไหนบ้างที่ใส่ป้ายชื่อ `app=web`"

```
Service (selector: app=web)
      ↓  ค้นหาด้วยป้ายชื่อ ไม่ใช่ IP
Pod(app=web) / Pod(app=web) / Pod(app=web)
      ↑
Pod ตายเกิดใหม่ IP เปลี่ยน แต่ป้ายชื่อยังเหมือนเดิม → Service ยังหาเจอ
```

ให้มองภาพนี้ว่า Service ไม่ได้จำเลขที่บ้านของพนักงาน แต่จำว่า "ใครก็ตามที่ใส่เสื้อทีมสีฟ้า" ดังนั้นเปลี่ยนคนกี่รอบก็ยังหาเจอ

### 5.3 Deployment → ReplicaSet → Pod

```
[ DEPLOYMENT ]           "อยากได้ app version 2 จำนวน 3 ตัว"
      ↓ สร้างและควบคุม
[ REPLICASET ]           "หน้าที่ฉันคือทำให้มี Pod version 2 ครบ 3 ตัว"
      ↓ สร้างและควบคุม
[ POD ] [ POD ] [ POD ]
```

ให้มองภาพนี้ว่า Deployment คือผู้จัดการที่เขียนใบสั่ง ReplicaSet คือหัวหน้างานที่นับหัวคนให้ครบ และ Pod คือคนงานที่ทำงานจริง

**ทำไมต้องแยก Deployment กับ ReplicaSet?**

เพราะตอน **Rolling Update** Deployment จะสร้าง ReplicaSet **ตัวใหม่** ขึ้นมาแล้วค่อย ๆ ย้ายคนจากตัวเก่าไปตัวใหม่ ดังนั้น ReplicaSet ตัวเก่ายังอยู่ (แค่จำนวนเหลือ 0) — **นี่คือเหตุผลที่ rollback ทำได้เร็วมาก** เพราะแค่ปั๊มจำนวนของ ReplicaSet ตัวเก่ากลับขึ้นมา

### 5.4 Rolling Update ทำงานยังไง

```
ก่อน deploy:      [v1][v1][v1]              (3 Pods เก่า)
    ↓
ขั้นที่ 1:        [v1][v1][v1][v2]          ← สร้าง v2 ขึ้นมา 1 ตัว
    ↓  รอจน v2 ผ่าน readiness probe
ขั้นที่ 2:        [v1][v1][v2]              ← ลบ v1 ทิ้ง 1 ตัว
    ↓  ทำซ้ำ
ขั้นที่ 3:        [v1][v2][v2]
    ↓
เสร็จ:            [v2][v2][v2]              (ไม่มี downtime)
```

ให้มองภาพนี้ว่าเป็นการเปลี่ยนยางรถขณะรถยังวิ่งอยู่ — เปลี่ยนทีละล้อ ไม่ใช่ยกรถขึ้นแล้วถอดพร้อมกันทั้ง 4 ล้อ

**จุดสำคัญ:** ขั้นที่รอ "จน v2 ผ่าน readiness probe" คือสิ่งที่ทำให้ rolling update ปลอดภัยจริง ถ้าไม่มี readiness probe Kubernetes จะเข้าใจว่า Pod ใหม่พร้อมทันทีที่ process เริ่มรัน แล้วส่ง traffic เข้าไปทั้งที่ app ยังต่อ database ไม่เสร็จ → **ผู้ใช้เจอ error ระหว่าง deploy**

### 5.5 Self Healing

```
[ Pod ตาย / crash / เครื่องดับ ]
              ↓
  kubelet + Controller เห็นว่า Actual < Desired
              ↓
      [ Scheduler เลือก Node ที่ว่าง ]
              ↓
      [ สร้าง Pod ใหม่ ]
              ↓
  Actual State กลับมาเท่า Desired State
```

ให้มองภาพนี้ว่าระบบมีพนักงานสำรองเดินตรวจอยู่ตลอด พอเห็นเก้าอี้ว่าง เขาจะหาคนใหม่มานั่งแทนโดยไม่ต้องรอให้ใครสั่ง

### 5.6 Auto Scaling (HPA — Horizontal Pod Autoscaler)

```
[ Metrics: CPU 85% ]
        ↓
[ HPA เทียบกับเป้าที่ตั้งไว้ เช่น 50% ]
        ↓
[ เพิ่ม replicas: 3 → 6 ]
        ↓
[ Desired State เปลี่ยน → K8s สร้าง Pod เพิ่ม ]
        ↓
[ CPU ต่อ Pod ลดลง → ระบบกลับมานิ่ง ]
```

ให้มองภาพนี้ว่าเป็นร้านอาหารที่เห็นคิวยาวขึ้นแล้วเรียกพนักงานเพิ่มเข้ากะ พอคิวสั้นลงก็ให้กลับบ้าน

**คำศัพท์ที่มักถามต่อ:**

- **Horizontal Scaling** → เพิ่ม**จำนวน** Pod (K8s ถนัดเรื่องนี้)
- **Vertical Scaling** → เพิ่ม**ขนาด** CPU/RAM ของ Pod เดิม (ต้อง restart Pod)

---

## 6. Example

### สถานการณ์จริง: ระบบขายของออนไลน์ช่วง Flash Sale

บริษัทมีเว็บขายของ ทีมมี frontend (Next.js) + backend API (Spring Boot) + database ระบบเดิมรันด้วย `docker run` บน VM 2 เครื่อง

**ปัญหาที่เจอก่อนใช้ Kubernetes:**

| เหตุการณ์ | ผลที่เกิด |
|---|---|
| ตี 3 backend container memory leak แล้วตาย | เว็บล่ม 4 ชั่วโมงจนเช้าเพราะไม่มีใครตื่น |
| Flash sale คนเข้าพร้อมกัน 10 เท่า | ระบบรับไม่ไหว ต้องโทรตาม DevOps มา `docker run` เพิ่มมือ |
| Deploy version ใหม่ | ต้อง stop container เก่าก่อน → เว็บดับ 2 นาทีทุกครั้ง |
| Deploy แล้วพัง | ต้องหา image tag เก่าให้เจอ แล้วรันใหม่ (เสียเวลา 15 นาที) |

**หลังย้ายมา Kubernetes — ระบบเป็นแบบนี้:**

```
Internet
   ↓
[ INGRESS ]  shop.example.com
   ├── /            → [ Service: web ]     → [ Pods: Next.js × 3 ]
   └── /api         → [ Service: api ]     → [ Pods: Spring Boot × 4 ]
                                                    ↓
                                          [ Service: postgres (ภายนอก cluster) ]
```

ให้มองภาพนี้ว่า Ingress คือพนักงานต้อนรับหน้าตึกที่ดูว่าแขกจะไปแผนกไหน แล้วชี้ทางให้ถูกแผนกโดยแขกไม่ต้องรู้ว่าแผนกนั้นมีพนักงานกี่คน

**สิ่งที่เปลี่ยนไปในแต่ละเหตุการณ์:**

| เหตุการณ์ | Kubernetes จัดการอย่างไร |
|---|---|
| ตี 3 backend Pod ตาย | Liveness probe ไม่ผ่าน → kill → ReplicaSet เห็นว่าเหลือ 3 จาก 4 → สร้างใหม่ใน ~10 วินาที ไม่มีใครรู้เรื่อง |
| Flash sale | HPA เห็น CPU 90% → เพิ่ม Pod จาก 4 เป็น 12 อัตโนมัติ พอ sale จบก็ลดกลับมา |
| Deploy version ใหม่ | Rolling update เปลี่ยนทีละ Pod รอ readiness ผ่านก่อนค่อยลบตัวเก่า → downtime = 0 |
| Deploy แล้วพัง | `kubectl rollout undo` ย้อนกลับ ReplicaSet เดิมใน ~20 วินาที |
| Node 1 เครื่องพัง | Scheduler ย้าย Pod ทั้งหมดไป Node ที่เหลือเอง |

**Config และ Secret ในเคสนี้:**

```
ConfigMap  → API_BASE_URL, LOG_LEVEL, FEATURE_FLAG    (ไม่ลับ)
Secret     → DB_PASSWORD, JWT_SECRET, STRIPE_API_KEY  (ลับ)
        ↓ ทั้งคู่ถูกส่งเข้า Pod เป็น environment variable
[ Container ] อ่านค่าจาก env ตอน start
```

ให้มองภาพนี้ว่า Image คือกล่องสินค้าที่ปิดผนึกไว้แล้วเปลี่ยนไม่ได้ ส่วน ConfigMap/Secret คือใบแปะข้างกล่องที่บอกว่า "กล่องนี้ส่งไปสาขาไหน" ดังนั้นกล่องเดียวส่งได้ทุกสาขา

**นี่คือหลักการสำคัญ:** Image ต้องเหมือนกันทุก environment สิ่งที่ต่างกันคือ ConfigMap/Secret ที่แปะเข้าไป (เรื่องนี้จะต่อยอดใน PART 15 — CI/CD)

### สถานการณ์จริง: Namespace แบ่งโซน

บริษัทมี 3 ทีมใช้ cluster เดียวกัน

```
[ CLUSTER ]
  ├── namespace: dev        (ทีมพัฒนาเล่นได้เต็มที่)
  ├── namespace: staging    (ทดสอบก่อนขึ้นจริง)
  └── namespace: production (ของจริง เข้าถึงได้เฉพาะคนที่มีสิทธิ์)
```

ให้มองภาพนี้ว่า Namespace คือกำแพงกั้นห้องในออฟฟิศเดียวกัน — ใช้ไฟฟ้าและแอร์ร่วมกัน แต่คนแผนกหนึ่งเดินเข้าอีกแผนกไม่ได้ถ้าไม่มีบัตร

**ประโยชน์จริงของ Namespace:**

- ตั้งชื่อ resource ซ้ำกันได้ (มี Service ชื่อ `api` ได้ทั้งใน dev และ production)
- จำกัดโควตา CPU/RAM ต่อทีมได้ (ResourceQuota)
- กำหนดสิทธิ์ (RBAC) แยกกันได้ — dev เข้าไปแตะ production ไม่ได้

---

## 7. Compare

### 7.1 Docker vs Kubernetes (คำถามที่ถูกถามบ่อยที่สุดในบทนี้)

| หัวข้อ | Docker | Kubernetes |
|---|---|---|
| **หน้าที่หลัก** | สร้างและรัน container | จัดการ container จำนวนมาก |
| **ขอบเขต** | 1 เครื่อง | หลายเครื่อง (cluster) |
| **เปรียบเทียบ** | กล่องสินค้า | ผู้จัดการโกดัง |
| **container ตาย** | ตายก็ตายเลย (ถ้าไม่ตั้ง restart policy) | สร้างใหม่ให้อัตโนมัติ |
| **scale** | ต้องรัน `docker run` เองหลายรอบ | ประกาศ `replicas` หรือให้ HPA จัดการ |
| **deploy ไม่มี downtime** | ต้องทำเอง | Rolling update มีมาให้ |
| **load balancing** | ต้องตั้ง nginx เอง | Service มีให้ในตัว |
| **เป็นคู่แข่งกันไหม** | **ไม่ใช่** | **ไม่ใช่ — Kubernetes รัน container ที่ Docker สร้าง** |

> **ห้ามตอบว่า "Kubernetes ดีกว่า Docker"** เพราะเป็นคนละชั้นของปัญหา
> ตอบว่า: "Docker แก้ปัญหา packaging และ isolation ส่วน Kubernetes แก้ปัญหา orchestration — ปกติใช้ด้วยกัน"

**เมื่อไรที่ยังไม่ควรใช้ Kubernetes:**

| สถานการณ์ | เหตุผล |
|---|---|
| ระบบเล็ก 1-2 service ผู้ใช้ไม่เยอะ | ความซับซ้อนของ K8s แพงกว่าปัญหาที่แก้ |
| ทีมไม่มีคนดูแล cluster | K8s ต้องการคนที่เข้าใจ networking + storage |
| ต้องการขึ้นเร็วที่สุด | ใช้ PaaS หรือ managed container service ง่ายกว่า |

**เมื่อไรที่คุ้มมาก:** service หลายตัว ต้องการ high availability, auto scaling, และ deploy บ่อย

### 7.2 Pod vs Container

| หัวข้อ | Container | Pod |
|---|---|---|
| คืออะไร | process ที่รันจาก image | หน่วยเล็กสุดที่ K8s จัดการ |
| จำนวน | 1 image = 1 container | 1 Pod มีได้หลาย container |
| IP | ไม่มีของตัวเองใน Pod | **มี IP เดียวต่อ Pod** container ข้างในใช้ร่วมกัน |
| คุยกันภายใน | — | container ใน Pod เดียวกันคุยผ่าน `localhost` ได้ |
| K8s จัดการอะไร | ไม่ได้จัดการโดยตรง | **จัดการที่ระดับนี้** |

**ทำไม Pod มีหลาย container ได้?** สำหรับ **Sidecar Pattern** เช่น container หลักคือ app และมี container เสริมคอยเก็บ log ส่งออก หรือทำ proxy ให้ — แต่ **กรณีปกติ 1 Pod = 1 container**

### 7.3 Deployment vs ReplicaSet vs Pod

| | Pod | ReplicaSet | Deployment |
|---|---|---|---|
| หน้าที่ | รัน container | รักษาจำนวน Pod | จัดการ ReplicaSet + การอัปเดต |
| ตายแล้วเกิดใหม่เองไหม | **ไม่** (ถ้าสร้าง Pod เปล่า ๆ) | ได้ | ได้ |
| Rolling update ได้ไหม | ไม่ได้ | ไม่ได้ | **ได้** |
| Rollback ได้ไหม | ไม่ได้ | ไม่ได้ | **ได้** |
| ในงานจริงเราเขียนตัวไหน | แทบไม่เขียนตรง ๆ | แทบไม่เขียนตรง ๆ | **เขียนตัวนี้** |

### 7.4 Service vs Ingress

| หัวข้อ | Service | Ingress |
|---|---|---|
| ชั้นที่ทำงาน | L4 (TCP/IP + port) | L7 (HTTP — เห็น path และ host) |
| ทำอะไรได้ | ให้ IP ถาวร + load balance ภายใน | แจก traffic ตาม domain/path + จัดการ TLS |
| ตัวอย่าง | `api-service:8080` | `shop.com/api → api-service` |
| เปรียบเทียบ | เบอร์กลางของแผนก | ประตูหน้าตึก + ป้ายบอกทาง |
| ใช้คู่กันไหม | **ใช่ — Ingress ชี้ไปหา Service เสมอ** | ✔ |

**Service มีหลายชนิดที่ต้องรู้:**

| Type | ใช้เมื่อไร | เข้าจากภายนอกได้ไหม |
|---|---|---|
| **ClusterIP** (default) | คุยกันภายใน cluster เท่านั้น | ไม่ได้ |
| **NodePort** | เปิด port บนทุก Node (ใช้ตอน dev/test) | ได้ (แต่ไม่สวย) |
| **LoadBalancer** | ให้ cloud provider สร้าง LB ให้ | ได้ |
| **Ingress** (ไม่ใช่ Service type แต่ทำงานคู่กัน) | HTTP หลาย domain/path ในตัวเดียว | ได้ |

### 7.5 ConfigMap vs Secret

| หัวข้อ | ConfigMap | Secret |
|---|---|---|
| เก็บอะไร | config ทั่วไป | ข้อมูลลับ |
| ตัวอย่าง | `LOG_LEVEL=debug` | `DB_PASSWORD=...` |
| เก็บยังไง | plain text | **base64 encoded** |
| **เข้ารหัสจริงไหม** | ไม่ | **ไม่! base64 คือการ encode ไม่ใช่ encrypt** |
| ใครถอดได้ | ทุกคน | **ทุกคนที่อ่าน Secret ได้** (คำสั่งเดียว) |

> ⚠️ **จุดนี้คือกับดักสัมภาษณ์ที่คลาสสิกที่สุดของบทนี้**
> `base64` ออกแบบมาเพื่อ "แปลง binary ให้เป็นตัวอักษรที่ส่งได้ปลอดภัย" **ไม่ใช่เพื่อความลับ** ใครก็ถอดได้ใน 1 วินาทีโดยไม่ต้องใช้ key
> ดังนั้น Secret ของ K8s ป้องกันแค่ "คนเห็นผ่าน ๆ" ไม่ได้ป้องกัน "คนที่เข้าถึง cluster ได้"
>
> ถ้าต้องการความลับจริงต้องเพิ่ม: **Encryption at Rest** ที่ etcd, **RBAC** จำกัดสิทธิ์อ่าน Secret, หรือใช้ **External Secret Manager** (เช่น Vault / cloud secret manager)

### 7.6 Liveness vs Readiness vs Startup Probe

| | Liveness | Readiness | Startup |
|---|---|---|---|
| ถามว่า | "ยังมีชีวิตไหม" | "พร้อมรับ traffic ไหม" | "boot เสร็จหรือยัง" |
| **ไม่ผ่านแล้วเกิดอะไร** | **restart container** | **ถอดออกจาก Service** (ไม่ restart) | **หยุดนับ liveness ไว้ก่อน** |
| เหมาะกับปัญหา | deadlock, memory leak, hang | ยังต่อ DB ไม่เสร็จ, กำลัง warm up cache | app boot ช้า (เช่น JVM) |
| ควรเช็คอะไร | แค่ว่า process ยังตอบได้ (`/healthz`) | รวม dependency ที่จำเป็น (`/ready`) | เหมือน liveness แต่ให้เวลานานกว่า |

**⚠️ ตั้งผิดแล้วเกิดอะไร — ต้องตอบให้ได้:**

| ตั้งผิดแบบ | ผลที่เกิดจริง |
|---|---|
| **Liveness ไปเช็ค database ด้วย** | DB ล่มชั่วคราว → liveness ไม่ผ่านทุก Pod → **K8s ฆ่า Pod ทั้งหมดพร้อมกัน** → restart loop ทั้งระบบ ทั้งที่ app ไม่ได้พัง (DB ต่างหากที่พัง) |
| **Liveness timeout สั้นเกินไป** | ตอน traffic สูง app ตอบช้า → ถูกฆ่า → โหลดไปลงตัวที่เหลือ → ตัวที่เหลือช้าตาม → **ถูกฆ่าต่อกันเป็นโดมิโน** |
| **ไม่ตั้ง readiness เลย** | Pod ใหม่ได้รับ traffic ทั้งที่ยังต่อ DB ไม่เสร็จ → **ผู้ใช้เจอ 500 ทุกครั้งที่ deploy** |
| **ไม่ตั้ง startup probe กับ app ที่ boot ช้า** | liveness เริ่มนับทันที → app ยัง boot ไม่เสร็จก็ถูกฆ่า → **ไม่มีวันขึ้นได้เลย (CrashLoopBackOff นิรันดร์)** |

**กฎง่าย ๆ ที่ senior ใช้:**

> Liveness ต้อง**ตื้น** (เช็คแค่ตัวเอง) — Readiness ต้อง**ลึก** (เช็ค dependency ได้)
> เพราะ liveness ผิดพลาด = ฆ่าทิ้ง ส่วน readiness ผิดพลาด = แค่พักงาน ซึ่งกู้คืนได้ง่ายกว่ามาก

### 7.7 Requests vs Limits

| | Requests | Limits |
|---|---|---|
| ความหมาย | **ขั้นต่ำที่การันตี** | **เพดานสูงสุด** |
| ใช้ตอนไหน | Scheduler ใช้ตัดสินว่า Pod ลง Node ไหนได้ | Runtime ใช้บังคับตอนรัน |
| เปรียบเทียบ | จองที่นั่งไว้ | ห้ามกินเกินจานนี้ |
| **เกิน limit แล้ว (CPU)** | — | **ถูก throttle — ช้าลง แต่ไม่ตาย** |
| **เกิน limit แล้ว (Memory)** | — | **OOMKilled — ถูกฆ่าทันที ไม่มีการเตือน** |

**ทำไม CPU กับ Memory ต่างกัน?**

- **CPU เป็นทรัพยากรที่ "บีบได้" (compressible)** — แบ่งเวลาใช้ได้ ถ้าไม่พอก็แค่ช้าลง
- **Memory เป็นทรัพยากรที่ "บีบไม่ได้" (incompressible)** — ขอ 1GB แล้วไม่มีให้ ก็คือไม่มี ทางออกเดียวของ kernel คือ **ฆ่า process ทิ้ง**

```
CPU เกิน limit      → throttle → app ช้าลง → latency พุ่ง → ไม่มี log บอกว่าพัง
Memory เกิน limit   → OOMKilled → Pod restart → เห็นใน events ชัดเจน
```

ให้มองภาพนี้ว่า CPU เหมือนการแย่งกันใช้ถนน (รถติดแต่ยังไปถึง) ส่วน Memory เหมือนที่นั่งบนเครื่องบิน (ไม่มีที่นั่ง = ขึ้นไม่ได้เลย)

**บทเรียนระดับ senior:** อาการ "ระบบช้าโดยไม่มี error" มักเป็น **CPU throttle** ซึ่งหายากกว่า OOM มาก เพราะ OOM ทิ้งร่องรอยไว้ชัด แต่ throttle เงียบสนิท

---

## 8. Common Mistakes

### ❌ 1. คิดว่า Kubernetes มาแทน Docker

**ผิดตรงไหน:** เป็นคนละชั้น Docker สร้าง image และรัน container / Kubernetes สั่งว่าจะรัน container ตัวไหน ที่ไหน กี่ตัว
**ถูกคือ:** ใช้ด้วยกัน — Docker build image → push ขึ้น registry → Kubernetes ดึงไปรัน

### ❌ 2. คิดว่า Secret ของ Kubernetes ปลอดภัยเพราะเข้ารหัสแล้ว

**ผิดตรงไหน:** เป็นแค่ **base64 encode** ใครที่อ่าน Secret ได้ก็ถอดได้ทันที และ **ห้าม commit ไฟล์ Secret YAML ขึ้น git โดยเด็ดขาด** — คนมักคิดว่า "ก็มันเป็นตัวอักษรมั่ว ๆ ไม่น่าอ่านออก"
**ถูกคือ:** Secret แยก resource ไว้เพื่อให้จัดสิทธิ์ (RBAC) และเข้ารหัสที่ etcd ได้ต่างหาก ถ้าต้องการความปลอดภัยจริงต้องเปิด encryption at rest หรือใช้ external secret manager

### ❌ 3. สร้าง Pod ตรง ๆ แทนที่จะใช้ Deployment

**ผิดตรงไหน:** Pod เปล่า ๆ **ไม่มีใครดูแล** ตายแล้วตายเลย ไม่มี self healing ไม่มี rolling update
**ถูกคือ:** เขียน Deployment เสมอในงานจริง แล้วให้มันสร้าง Pod ให้

### ❌ 4. ให้ frontend ยิงตรงไปที่ IP ของ Pod

**ผิดตรงไหน:** IP ของ Pod เปลี่ยนทุกครั้งที่เกิดใหม่ วันนี้ทำงาน พรุ่งนี้พัง
**ถูกคือ:** ยิงผ่าน Service เสมอ — Service หา Pod ด้วย **label** ไม่ใช่ IP

### ❌ 5. ไม่ตั้ง Resource Requests / Limits เลย

**ผิดตรงไหน:** Pod จะแย่งทรัพยากรกันมั่ว Pod ตัวเดียวที่ memory leak สามารถกิน RAM จนทำให้ **Pod อื่นบน Node เดียวกันถูกฆ่าไปด้วย** และ Scheduler ก็ตัดสินใจผิดเพราะไม่รู้ว่า Pod ต้องการเท่าไร
**ถูกคือ:** ตั้ง requests ทุกครั้ง และตั้ง memory limit เสมอ (CPU limit ต้องคิดให้ดีเพราะ throttle ทำให้ latency พุ่งแบบเงียบ ๆ)

### ❌ 6. เอา liveness probe ไปเช็ค database

**ผิดตรงไหน:** DB สะดุดแค่ 10 วินาที → ทุก Pod ไม่ผ่าน liveness พร้อมกัน → ถูกฆ่าหมด → ระบบล่มทั้งที่ app ไม่มีอะไรผิด (เรียกว่า **cascading failure**)
**ถูกคือ:** liveness เช็คแค่ว่า process ตัวเองยังตอบไหว ส่วนการเช็ค dependency ให้อยู่ใน readiness

### ❌ 7. สับสนว่า readiness ไม่ผ่านแล้ว Pod จะถูก restart

**ผิดตรงไหน:** readiness ไม่ผ่าน = **ถอดออกจาก Service ชั่วคราว** Pod ยังอยู่ ยังเขียน log ได้ ยังเข้าไปดูได้
**ถูกคือ:** จำว่า liveness = ฆ่า / readiness = พักงาน

### ❌ 8. Hardcode config ลงใน Docker Image

**ผิดตรงไหน:** ต้อง build image ใหม่ทุกครั้งที่เปลี่ยน environment → image ของ staging กับ production ไม่ใช่ตัวเดียวกัน → **สิ่งที่ทดสอบไม่ใช่สิ่งที่ขึ้นจริง**
**ถูกคือ:** image เดียวใช้ได้ทุก environment โดยรับค่าผ่าน ConfigMap/Secret (ต่อยอดใน PART 15)

### ❌ 9. คิดว่า Auto Scaling แก้ปัญหาทุกอย่าง

**ผิดตรงไหน:** ถ้าคอขวดอยู่ที่ **database** การเพิ่ม Pod จะทำให้ **connection ไป DB เยอะขึ้น → DB ยิ่งพัง** เร็วขึ้น
**ถูกคือ:** scale ได้เฉพาะส่วนที่ stateless และต้องดูว่าคอขวดจริงอยู่ตรงไหนก่อน

### ❌ 10. คิดว่า Rolling Update ปลอดภัยโดยอัตโนมัติ

**ผิดตรงไหน:** ถ้าไม่มี readiness probe K8s จะนับว่า Pod ใหม่พร้อมทันทีที่ process เริ่ม แล้วลบ Pod เก่าทิ้ง → traffic วิ่งเข้า Pod ที่ยังไม่พร้อม
**ถูกคือ:** rolling update ปลอดภัยก็ต่อเมื่อ readiness probe บอกความจริง

### ❌ 11. ลืมว่า Pod เป็นสิ่งชั่วคราว แล้วเขียนไฟล์ลงใน container

**ผิดตรงไหน:** Pod ตายเมื่อไรไฟล์หายหมด และ Pod แต่ละตัวก็ไม่เห็นไฟล์ของกันด้วย
**ถูกคือ:** ออกแบบ app ให้ **stateless** — ไฟล์ไปอยู่ object storage, session ไปอยู่ Redis/DB

---

## 9. Debugging

เมื่อ "มันไม่ทำงาน" ใน Kubernetes ให้ไล่ตามลำดับนี้ จากนอกเข้าใน

```
1. Pod ขึ้นหรือยัง        → kubectl get pods
2. ทำไมไม่ขึ้น             → kubectl describe pod <name>   (ดู Events ท้ายสุด)
3. ขึ้นแล้วแต่พัง          → kubectl logs <name>
4. พังแล้ว restart วน     → kubectl logs <name> --previous
5. Service หา Pod เจอไหม  → kubectl get endpoints <service>
6. Ingress ชี้ถูกไหม       → kubectl describe ingress <name>
```

ให้มองภาพนี้ว่าเป็นการไล่หาปัญหาจากด้านนอกตึกเข้าไปข้างใน — ดูก่อนว่าตึกเปิดไหม แล้วค่อยดูว่าแผนกอยู่ไหม แล้วค่อยดูว่าพนักงานทำงานอยู่ไหม

### 9.1 อ่านสถานะ Pod ให้เป็น — นี่คือทักษะที่แยก junior กับ mid

| STATUS | แปลว่า | ให้ไปดูตรงไหน |
|---|---|---|
| **Pending** | ยังไม่ได้ลง Node เลย | ทรัพยากรไม่พอ / node selector ไม่ match / PVC ยังไม่พร้อม → `describe` ดู Events |
| **ContainerCreating** | กำลังเตรียม | ส่วนใหญ่กำลังดึง image — ถ้าค้างนานให้ดู network / image ใหญ่เกิน |
| **ImagePullBackOff** | ดึง image ไม่ได้ | ชื่อ/tag ผิด, registry ต้อง login, ไม่ได้ตั้ง imagePullSecret |
| **CrashLoopBackOff** | เปิด→ตาย→เปิด→ตาย | **app พังตอน start** หรือ **liveness/startup probe ตั้งผิด** → ดู `logs --previous` |
| **OOMKilled** | กิน memory เกิน limit | memory leak หรือ limit ตั้งต่ำเกินจริง |
| **Running แต่ 0/1 Ready** | รันอยู่แต่ readiness ไม่ผ่าน | **ไม่ได้รับ traffic** → ดูว่า `/ready` ตอบอะไร dependency พร้อมไหม |
| **Error / Completed** | process จบไปแล้ว | app ไม่ใช่ long-running process หรือจบเองเพราะ config ผิด |
| **Terminating ค้าง** | ลบไม่ลง | app ไม่ตอบ SIGTERM หรือมี finalizer ค้าง |

### 9.2 เคสจริง: "เว็บขึ้น 503 แต่ Pod แสดงว่า Running"

ไล่ตามลำดับนี้:

```
[ 503 ที่ browser ]
        ↓
1. Pod READY เป็น 1/1 หรือ 0/1 ?
        ↓ ถ้า 0/1 → readiness ไม่ผ่าน → นี่คือสาเหตุ
2. Service มี endpoint ไหม (kubectl get endpoints)
        ↓ ถ้าว่าง → label ของ Pod ไม่ตรงกับ selector ของ Service
3. port ของ Service ตรงกับ containerPort ไหม
        ↓ ถ้าไม่ตรง → traffic ไปผิด port
4. Ingress ชี้ไป Service ชื่อถูกไหม / TLS ตั้งครบไหม
```

ให้มองภาพนี้ว่าเป็นการเช็คสายโทรศัพท์ทีละต่อ — ปลายทางรับสายไหม โอเปอเรเตอร์รู้จักปลายทางไหม และเบอร์ที่กดถูกไหม

> **สาเหตุอันดับ 1 ของ "Service เรียกไม่ได้" คือ label ของ Pod ไม่ตรงกับ selector ของ Service** ให้เช็ค `kubectl get endpoints` ก่อนเสมอ — ถ้า endpoint ว่างเปล่า แปลว่า Service หา Pod ไม่เจอ ปัญหาอยู่ที่ label ไม่ใช่ที่ app

### 9.3 เคสจริง: "Pod restart ทุก 2 นาที"

```
1. kubectl describe pod → ดู "Last State: Terminated, Reason: ?"
        ├── Reason: OOMKilled   → memory ไม่พอ → เพิ่ม limit หรือหา leak
        ├── Reason: Error       → app crash เอง → ดู logs --previous
        └── Restart จาก Liveness → probe ตั้งเข้มเกิน หรือ app ช้าตอน load สูง
2. ถ้าเป็น liveness ให้ถามต่อ:
        - timeout สั้นไปไหม
        - initialDelay น้อยไปไหม (app boot ช้า)
        - probe ไปเช็ค dependency ภายนอกหรือเปล่า  ← ผิดบ่อยที่สุด
```

### 9.4 ชุดคำสั่งที่ควรจำ (ไม่ต้องท่อง แต่ต้องรู้ว่ามีอะไร)

| ต้องการรู้ | คำสั่ง |
|---|---|
| Pod ทั้งหมดเป็นยังไง | `kubectl get pods -o wide` |
| ทำไม Pod เป็นแบบนี้ | `kubectl describe pod <name>` ← **ดู Events ล่างสุดเสมอ** |
| app พูดอะไร | `kubectl logs <name>` |
| ก่อน restart มันพูดอะไร | `kubectl logs <name> --previous` ← **สำคัญมากตอน CrashLoop** |
| เข้าไปดูข้างใน | `kubectl exec -it <name> -- sh` |
| Service หา Pod เจอไหม | `kubectl get endpoints <service>` |
| เกิดอะไรขึ้นใน cluster | `kubectl get events --sort-by=.lastTimestamp` |
| deploy ไปถึงไหนแล้ว | `kubectl rollout status deployment/<name>` |
| ย้อนกลับ | `kubectl rollout undo deployment/<name>` |
| ใครกิน CPU/RAM | `kubectl top pods` |

**หลักคิดตอน debug:** `describe` ตอบว่า "**Kubernetes** คิดยังไงกับ Pod นี้" ส่วน `logs` ตอบว่า "**app ของเรา** พูดอะไร" — ปัญหาส่วนใหญ่ตอบได้จากสองคำสั่งนี้

---

## 10. Interview Questions

### 🟢 Junior

1. Kubernetes คืออะไร มีไว้แก้ปัญหาอะไร
2. Pod คืออะไร ต่างจาก Container อย่างไร
3. Cluster กับ Node ต่างกันยังไง
4. Deployment มีไว้ทำอะไร
5. Service มีไว้ทำอะไร ทำไมไม่ยิงตรงไปที่ Pod
6. ConfigMap กับ Secret ต่างกันอย่างไร
7. Self Healing ใน Kubernetes หมายถึงอะไร
8. Namespace มีไว้ทำไม
9. Docker กับ Kubernetes ต่างกันยังไง ใช้แทนกันได้ไหม
10. Rolling Update คืออะไร ทำไมถึงไม่มี downtime

### 🟡 Mid

11. อธิบาย Desired State vs Actual State และ Kubernetes ใช้แนวคิดนี้ยังไง
12. Liveness Probe กับ Readiness Probe ต่างกันยังไง ถ้าตั้งสลับกันจะเกิดอะไรขึ้น
13. Deployment, ReplicaSet, Pod สัมพันธ์กันยังไง ทำไมต้องมี ReplicaSet คั่นกลาง
14. Service หา Pod เจอได้ยังไงทั้งที่ IP ของ Pod เปลี่ยนตลอด
15. Service กับ Ingress ต่างกันยังไง ใช้อันไหนเมื่อไร
16. Service มีกี่ type แต่ละอันใช้ตอนไหน
17. Requests กับ Limits ต่างกันยังไง ถ้าตั้งแต่ limit ไม่ตั้ง requests จะเป็นยังไง
18. OOMKilled เกิดจากอะไร ต่างจาก CPU throttle ยังไง
19. Rollback ใน Kubernetes ทำงานยังไง ทำไมถึงเร็ว
20. HPA ทำงานยังไง และมีข้อจำกัดอะไร
21. Pod มีสถานะ Running แต่ READY 0/1 แปลว่าอะไร
22. CrashLoopBackOff เกิดจากอะไรได้บ้าง จะไล่ยังไง

### 🔴 Senior

23. Kubernetes Secret ปลอดภัยแค่ไหน ถ้าจะใช้ในงานจริงต้องเพิ่มอะไร
24. ถ้าเอา liveness probe ไปเช็ค database จะเกิดอะไรขึ้นตอน DB ล่ม 30 วินาที
25. ระบบ latency พุ่งขึ้น 3 เท่าแต่ไม่มี error log และไม่มี Pod restart เลย จะสงสัยอะไรก่อน
26. ทำไม memory เกิน limit ถึงถูกฆ่า แต่ CPU เกิน limit ถึงแค่ช้าลง
27. HPA เพิ่ม Pod เป็น 3 เท่าแล้ว แต่ระบบยิ่งช้าลง เป็นไปได้จากอะไร
28. จะออกแบบ application ยังไงให้เหมาะกับการรันบน Kubernetes (12-factor / stateless / graceful shutdown)
29. ตอน rolling update ผู้ใช้เจอ error เป็นช่วง ๆ ทั้งที่ Pod ใหม่ขึ้นครบ จะสืบยังไง
30. เมื่อไรที่ "ไม่ควร" ใช้ Kubernetes
31. ถ้า Pod ค้างที่ Terminating นานผิดปกติ เกิดจากอะไรได้บ้าง และเกี่ยวกับ SIGTERM ยังไง
32. อธิบายว่าทำไม Kubernetes ถึงเรียกว่าเป็น "control loop" ไม่ใช่ "deployment tool"

---

## 11. Answer Like a Developer

อย่าท่องประโยค ให้จำ **โครง** แล้วเติมเนื้อเอง

### โครงมาตรฐาน 4 ขั้น

```
1. มันคืออะไร (1 ประโยค)
2. มีไว้แก้ปัญหาอะไร (เล่าปัญหาก่อนมีมัน)
3. ทำงานยังไง (flow สั้น ๆ)
4. ข้อควรระวัง / trade-off (ตรงนี้คือสิ่งที่แยก mid กับ senior)
```

### ตัวอย่างการใช้โครง — "Kubernetes คืออะไร"

> **(1)** "Kubernetes คือ container orchestration platform ที่จัดการ container จำนวนมากบนหลายเครื่องให้เราครับ
> **(2)** ปัญหาก่อนหน้านี้คือ Docker รัน container ได้ แต่ถ้า container ตายตอนตีสาม ต้องมีคน SSH เข้าไปรันใหม่เอง พอ traffic พุ่งก็ต้องเพิ่มมือ
> **(3)** วิธีทำงานคือเราประกาศ desired state ลง YAML เช่นบอกว่าต้องมี 3 Pods แล้ว Kubernetes จะมี control loop คอยเทียบกับ actual state ถ้าเหลือ 2 ก็สร้างเพิ่ม 1 ทันที ซึ่งเป็นที่มาของ self healing, auto scaling และ rolling update
> **(4)** แต่ trade-off คือความซับซ้อนสูงมาก ถ้าระบบมีแค่ service เดียวและทีมไม่มีคนดูแล cluster การใช้ managed platform ธรรมดาอาจคุ้มกว่าครับ"

### ตัวอย่าง — "Liveness กับ Readiness ต่างกันยังไง"

> "Liveness ถามว่า 'ยังมีชีวิตอยู่ไหม' ถ้าไม่ผ่าน Kubernetes จะ **kill container แล้วสร้างใหม่**
> ส่วน Readiness ถามว่า 'พร้อมรับ traffic หรือยัง' ถ้าไม่ผ่านจะแค่ **ถอด Pod ออกจาก Service** ไม่ได้ฆ่า
> จุดที่ผมระวังมากคือ **ห้ามเอา liveness ไปเช็ค database** เพราะถ้า DB สะดุด 30 วินาที Pod ทุกตัวจะไม่ผ่านพร้อมกันแล้วถูกฆ่าหมด กลายเป็น cascading failure ทั้งที่ app ไม่ได้พังเลย
> หลักที่ผมใช้คือ liveness ต้องตื้น readiness ต้องลึก"

### ตัวอย่าง — "Kubernetes Secret ปลอดภัยไหม"

> "โดย default **ไม่ปลอดภัยเท่าที่ชื่อบอกครับ** เพราะ Secret เก็บเป็น **base64 ซึ่งเป็นการ encode ไม่ใช่ encrypt** ใครที่มีสิทธิ์อ่าน Secret ก็ถอดออกมาได้ในคำสั่งเดียว
> ประโยชน์จริงของการแยกเป็น Secret คือทำให้ **จำกัดสิทธิ์ด้วย RBAC** แยกจาก ConfigMap ได้ และเปิด **encryption at rest** ที่ etcd ได้ ถ้าเป็น production จริงผมจะใช้ external secret manager แล้ว sync เข้ามา และ **ไม่ commit ไฟล์ Secret ขึ้น git เด็ดขาด**"

### ตัวอย่าง — "ระบบช้าแต่ไม่มี error ไม่มี restart"

> "สิ่งแรกที่ผมสงสัยคือ **CPU throttling** ครับ
> เพราะ memory เกิน limit จะเห็นชัดว่า OOMKilled และ Pod restart แต่ CPU เกิน limit จะไม่ถูกฆ่า แค่ถูกหรี่ความเร็วลง ซึ่งเงียบมาก ไม่มี log ไม่มี event
> ผมจะดู metric throttling ของ container เทียบกับ CPU limit ที่ตั้งไว้ก่อน แล้วค่อยไปดูว่าคอขวดอยู่ที่ app หรือที่ downstream เช่น database
> ที่ต้องระวังคือถ้ารีบเพิ่ม replica โดยที่คอขวดอยู่ที่ DB จะยิ่งแย่ลง เพราะ connection ไป DB เพิ่มขึ้นตามจำนวน Pod ครับ"

### สิ่งที่ควรพูด / ไม่ควรพูด

| ✅ ควรพูด | ❌ ไม่ควรพูด |
|---|---|
| "Kubernetes ทำงานแบบ declarative ผ่าน control loop" | "Kubernetes คือเครื่องมือ deploy" |
| "Docker กับ K8s อยู่คนละชั้น ใช้คู่กัน" | "K8s ดีกว่า Docker" |
| "ผมจะดู `describe` ก่อนเพราะ Events บอกสาเหตุ" | "ก็ลอง restart ดูก่อนครับ" |
| "ต้องดูก่อนว่าคอขวดอยู่ตรงไหนแล้วค่อย scale" | "ถ้าช้าก็เพิ่ม Pod ครับ" |
| "K8s ไม่ได้เหมาะกับทุกโปรเจกต์" | "ทุกระบบควรใช้ K8s" |

---

## 12. One-Minute Review

**Kubernetes คือ** ระบบจัดการ container จำนวนมากบนหลายเครื่อง โดยเราประกาศ **desired state** แล้วมันคอยลาก **actual state** ให้มาตรงกันตลอดเวลา (reconciliation loop) — ผลพลอยได้คือ self healing, auto scaling, rolling update, load balancing

**ลำดับชั้น:** Cluster → Node → Pod → Container และ K8s จัดการที่ระดับ **Pod** ไม่ใช่ container

**เส้นทาง request:** Internet → Ingress → Service → Deployment → Pods → Containers

**Deployment** เขียนใบสั่ง → **ReplicaSet** นับหัวให้ครบ → **Pod** ทำงานจริง และการที่มี ReplicaSet คั่นกลางทำให้ **rollback เร็ว** เพราะ ReplicaSet ตัวเก่ายังอยู่

**Service** ใช้ **label selector** หา Pod ไม่ใช่ IP เพราะ IP ของ Pod เปลี่ยนตลอด — ถ้า `get endpoints` ว่าง แปลว่า label ไม่ตรง

**Probe:** liveness ไม่ผ่าน = **ฆ่าแล้วสร้างใหม่** / readiness ไม่ผ่าน = **ถอดออกจาก Service เฉย ๆ** → กฎคือ liveness ตื้น readiness ลึก

**Resource:** requests = ที่จอง (scheduler ใช้) / limits = เพดาน (runtime ใช้) → memory เกิน = **OOMKilled ตายทันที** / CPU เกิน = **throttle ช้าลงเงียบ ๆ**

**Secret** เป็นแค่ **base64 encode ไม่ใช่ encryption** → ต้องเสริมด้วย RBAC + encryption at rest + ห้าม commit ขึ้น git

**Docker vs K8s:** Docker = กล่องสินค้า / K8s = ผู้จัดการโกดัง — คนละชั้น ใช้คู่กัน

**Debug ตามลำดับ:** `get pods` → `describe pod` (ดู Events) → `logs` → `logs --previous` → `get endpoints`

---

## 13. Memory Card

**จำ 5 อย่าง**

1. **Desired State vs Actual State คือหัวใจทั้งหมด** — เราประกาศว่าอยากได้ 3 Pods ถ้าเหลือ 2 K8s สร้างเพิ่ม 1 ถ้าเกินเป็น 5 K8s ลบทิ้ง 2 มันวนเทียบตลอดเวลาไม่มีวันหยุด นี่คือที่มาของ self healing และ auto scaling ทั้งหมด
2. **Docker = กล่องสินค้า / Kubernetes = ผู้จัดการโกดัง** — คนละชั้นของปัญหา ไม่ใช่คู่แข่ง Docker แพ็คและรัน K8s ตัดสินใจว่ารันที่ไหนกี่ตัว
3. **Liveness ฆ่า / Readiness พักงาน** — liveness ต้องตื้น (เช็คแค่ตัวเอง) readiness ต้องลึก (เช็ค dependency ได้) เอา liveness ไปเช็ค DB เมื่อไร DB สะดุดจะฆ่า Pod ทั้ง cluster พร้อมกัน
4. **Memory เกิน limit = OOMKilled ตายทันที / CPU เกิน limit = throttle ช้าลงเงียบ ๆ** — เพราะ CPU บีบได้ memory บีบไม่ได้ อาการ "ช้าแต่ไม่มี error" ให้สงสัย CPU throttle ก่อน
5. **Secret ของ K8s เป็น base64 ไม่ใช่การเข้ารหัส** — ใครอ่าน Secret ได้ก็ถอดได้ทันที ต้องเสริม RBAC + encryption at rest และห้าม commit ขึ้น git เด็ดขาด

**Keyword**

- **Kubernetes (K8s)** → ระบบจัดการ container อัตโนมัติด้วยแนวคิด declarative
- **Container Orchestration** → การจัดการ container หลายตัวบนหลายเครื่องให้ประสานกัน
- **Cluster** → กลุ่มเครื่องทั้งหมดที่ K8s ดูแล
- **Control Plane** → สมองของ cluster ตัดสินใจว่าอะไรรันที่ไหน
- **Node** → เครื่อง 1 เครื่องใน cluster
- **Pod** → หน่วยเล็กสุดที่ K8s จัดการ มี IP เดียวต่อ Pod
- **Container** → โปรแกรมจริงที่รันอยู่ใน Pod
- **Deployment** → ใบสั่งที่บอกว่าต้องการ Pod แบบไหน กี่ตัว อัปเดตยังไง
- **ReplicaSet** → ตัวนับจำนวน Pod ให้ครบ (ตัวเก่ายังอยู่เพื่อ rollback)
- **Service** → ชื่อ/IP ถาวรที่หา Pod ด้วย label selector + load balance
- **ClusterIP / NodePort / LoadBalancer** → ประเภทของ Service ตามระดับการเปิดออกภายนอก
- **Ingress** → ประตูหน้า HTTP/HTTPS แจก traffic ตาม domain/path + จัดการ TLS
- **ConfigMap** → config ที่ไม่ลับ แยกออกจาก image
- **Secret** → ข้อมูลลับ **เก็บเป็น base64 ซึ่งไม่ใช่การเข้ารหัส**
- **Namespace** → โซนแยกใน cluster เดียว (dev / staging / production)
- **Label / Selector** → ป้ายชื่อ และวิธีคัดหา Pod — Service ใช้สิ่งนี้ ไม่ใช่ IP
- **Desired State / Actual State** → สภาพที่ประกาศไว้ กับ สภาพจริงตอนนี้
- **Reconciliation Loop** → วงจรเทียบ desired กับ actual แล้วแก้ต่างตลอดเวลา
- **Self Healing** → Pod ตาย → สร้างใหม่อัตโนมัติ
- **Auto Scaling (HPA)** → เพิ่ม/ลดจำนวน Pod ตาม metric
- **Horizontal / Vertical Scaling** → เพิ่มจำนวน Pod (K8s ถนัด) / เพิ่มขนาด CPU-RAM ของ Pod เดิม
- **Rolling Update** → เปลี่ยน version ทีละ Pod เพื่อไม่ให้ downtime
- **Rollback** → `rollout undo` ย้อนกลับ ReplicaSet เดิม
- **Health Check** → การที่ K8s ยิงถามสุขภาพ container เป็นระยะ
- **Liveness Probe** → "ยังมีชีวิตไหม" ไม่ผ่าน = **restart**
- **Readiness Probe** → "พร้อมรับงานไหม" ไม่ผ่าน = **ถอดออกจาก Service**
- **Startup Probe** → กันไม่ให้ liveness ฆ่า app ที่ boot ช้า
- **Load Balancing** → Service กระจาย request ไปยัง Pod หลายตัว
- **Requests / Limits** → ขั้นต่ำที่การันตี (Scheduler ใช้) / เพดานสูงสุด (Runtime ใช้)
- **OOMKilled** → ถูกฆ่าเพราะใช้ memory เกิน limit
- **CPU Throttle** → ถูกหรี่ความเร็วเพราะใช้ CPU เกิน limit (เงียบ ไม่มี log)
- **CrashLoopBackOff** → เปิดแล้วตายวนซ้ำ ให้ดู `logs --previous`
- **ImagePullBackOff / Pending** → ดึง image ไม่ได้ / ยังไม่ได้ลง Node (ทรัพยากรไม่พอ)
- **kubectl / Manifest (YAML)** → CLI ที่คุยกับ cluster / ไฟล์ที่เขียน desired state
- **Scheduler / kubelet** → ตัวเลือก Node ให้ Pod / agent ที่รัน container จริงบนทุก Node
- **Stateless** → ออกแบบ app ไม่ให้เก็บ state ในตัวเอง เพราะ Pod เป็นของชั่วคราว

---

[← สารบัญ](./00-README-TOC.md)
