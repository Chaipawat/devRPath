# PART 13 — DOCKER

> ตำแหน่งในภาพใหญ่: Infrastructure Layer — ชั้นที่ห่อ "แอปที่เราเขียนเสร็จแล้ว" ให้กลายเป็นของที่ยกไปรันที่ไหนก็ได้เหมือนกันทุกเครื่อง

---

## 1. Big Picture

ก่อนจะรู้ว่า Docker คืออะไร ต้องรู้ก่อนว่ามันเกิดมาเพื่อแก้ปัญหาอะไร

ปัญหานั้นมีชื่อเล่นที่ developer ทุกคนเคยพูด:

> **"แต่เครื่องผมรันได้นะ" (It works on my machine)**

ทำไมถึงเกิด? เพราะแอปหนึ่งตัวไม่ได้มีแค่ code ของเรา มันพ่วงสิ่งเหล่านี้มาด้วยเสมอ:

| สิ่งที่แอปต้องพึ่ง | ตัวอย่างที่ทำให้พัง |
|---|---|
| Runtime version | เครื่อง dev ใช้ Node 20, server ใช้ Node 16 → syntax ใหม่พัง |
| System library | เครื่อง dev มี `libssl` เวอร์ชันหนึ่ง server มีอีกเวอร์ชัน |
| OS / distro | dev ใช้ macOS, production ใช้ Linux → path, permission ต่างกัน |
| Environment variable | เครื่อง dev มี `.env` ครบ server ลืมใส่ 1 ตัว |
| ลำดับการติดตั้ง | คนหนึ่งลง package เพิ่มตอน debug แล้วลืมจดลง README |

สรุปคือ **แอปหนึ่งตัวไม่ได้ทำงานได้ด้วยตัวเอง มันทำงานได้เพราะ "สภาพแวดล้อม" รอบตัวมันถูกต้อง**
ปัญหาคือสภาพแวดล้อมนั้นอยู่ในหัวคน อยู่ในเครื่องใครเครื่องมัน ไม่ได้อยู่ใน git

**Docker คือเครื่องมือที่ทำให้ "สภาพแวดล้อม" กลายเป็นไฟล์ที่ commit ลง git ได้ และยกไปรันที่ไหนก็ได้เหมือนกันเป๊ะ**

พูดแบบ HR ฟังรู้เรื่อง:

> "Docker คือการห่อแอปพร้อมทุกอย่างที่มันต้องใช้ในการทำงาน ให้เป็นกล่องมาตรฐานกล่องเดียว เมื่อยกกล่องนี้ไปวางบนเครื่องไหน มันก็ทำงานเหมือนเดิม ทีมจึงเลิกเสียเวลากับปัญหา 'เครื่องผมรันได้ แต่ server รันไม่ได้'"

พูดแบบ developer ฟัง:

> "Docker คือ container runtime ที่ใช้ความสามารถของ Linux kernel (namespace + cgroups) แยก process ให้เห็นระบบไฟล์ เห็น network และใช้ resource แยกจากกัน โดยไม่ต้องยก OS ทั้งก้อนเหมือน VM"

### ⚠️ Image ≠ Container (จำข้อนี้ก่อนอย่างอื่นทั้งหมด)

นี่คือคำถามที่ถูกถามบ่อยที่สุดในหัวข้อ Docker และ junior ตอบผิดเยอะที่สุด
คนส่วนใหญ่ใช้สองคำนี้สลับกันมั่วจนโดนจับได้ทันทีในห้องสัมภาษณ์

| | **Image** | **Container** |
|---|---|---|
| มันคืออะไร | **แม่พิมพ์** — ไฟล์ที่ถูก build เสร็จแล้ว | **ของจริงที่ถูกปั๊มออกมาจากแม่พิมพ์** |
| สถานะ | **อ่านอย่างเดียว (read-only)** เปลี่ยนไม่ได้ | **รันอยู่ / หยุดอยู่** มี state ของตัวเอง |
| อยู่ที่ไหน | บน disk / บน registry | ในหน่วยความจำของเครื่องที่รัน |
| สร้างจากอะไร | จาก **Dockerfile** ผ่านคำสั่ง `build` | จาก **Image** ผ่านคำสั่ง `run` |
| มีได้กี่อัน | 1 image | สร้างได้ **ไม่จำกัด** container จาก image เดียว |
| เทียบกับ programming | **Class** | **Object / Instance** |
| เทียบกับของจริง | แม่พิมพ์ขนมไข่ | ขนมไข่ที่ปั๊มออกมาแต่ละชิ้น |
| ลบแล้วเกิดอะไร | ต้อง build หรือ pull ใหม่ | สร้างใหม่จาก image เดิมได้ทันที |

```
[Dockerfile]      ← สูตร (เราเขียนเอง commit ลง git)
      │  docker build
      ▼
[IMAGE]           ← แม่พิมพ์ อ่านอย่างเดียว เปลี่ยนไม่ได้
      │  docker run
      ├──────────► [Container A]   ← ของจริงกล่องที่ 1
      ├──────────► [Container B]   ← ของจริงกล่องที่ 2
      └──────────► [Container C]   ← ของจริงกล่องที่ 3
```

> **ให้มองภาพนี้ว่า** "Dockerfile คือสูตรอาหาร Image คือแม่พิมพ์ที่ทำตามสูตรเสร็จแล้ว ส่วน Container คือขนมแต่ละชิ้นที่ปั๊มออกมาจากแม่พิมพ์นั้น"

ประโยคที่ควรจำไปตอบ:

> "Image เป็น read-only template ที่ build ครั้งเดียวแล้วไม่เปลี่ยน ส่วน Container คือ running instance ของ image นั้น หนึ่ง image สร้างได้หลาย container และ container มี writable layer ของตัวเองซ้อนอยู่บน image — พอลบ container ชั้นนั้นหายไป แต่ image ยังอยู่ครบ"

### Docker อยู่ตรงไหนในภาพใหญ่

```
[CODE ที่เราเขียน]
        ↓
[DOCKERFILE]          ← ประกาศว่าแอปต้องการอะไรบ้าง
        ↓  build
[IMAGE]               ← ของสำเร็จรูป ยกไปไหนก็ได้
        ↓  push
[REGISTRY]            ← คลังเก็บ image (Docker Hub / ECR / GHCR)
        ↓  pull
[SERVER / CI / K8s]
        ↓  run
[CONTAINER]           ← แอปที่กำลังทำงานจริง
```

> **ให้มองภาพนี้ว่า** "Docker เปลี่ยนการ deploy จาก 'ไปติดตั้งของบน server' ให้กลายเป็น 'ยกกล่องที่สร้างเสร็จแล้วไปวาง'"

---

## 2. Keywords

| Keyword | จำสั้น ๆ | ความหมาย / ใช้ทำอะไร |
|---|---|---|
| **Docker** | เครื่องทำกล่องมาตรฐาน | platform สำหรับ build / ship / run แอปในรูป container |
| **Container** | กล่องที่รันอยู่จริง | process ที่ถูกแยกออกมาให้เห็นระบบไฟล์และ network ของตัวเอง |
| **Image** | แม่พิมพ์ | template แบบ read-only ที่ใช้สร้าง container |
| **Dockerfile** | สูตรอาหาร | ไฟล์ข้อความที่บอกทีละขั้นว่าจะประกอบ image ยังไง |
| **Build** | ทำตามสูตรจนได้แม่พิมพ์ | `docker build` → แปลง Dockerfile เป็น Image |
| **Run** | ปั๊มของจากแม่พิมพ์ | `docker run` → สร้าง container จาก Image แล้วเริ่มทำงาน |
| **Layer** | ชั้นของแม่พิมพ์ | แต่ละคำสั่งใน Dockerfile สร้าง layer หนึ่งชั้น ใช้ซ้ำได้ |
| **Layer Cache** | ชั้นที่ไม่ต้องทำใหม่ | ถ้า input ของ layer ไม่เปลี่ยน Docker ใช้ของเดิม → build เร็ว |
| **Base Image** | ฐานราก | image ที่เราเริ่มต่อยอด เช่น `node:20-alpine` |
| **Registry** | คลังเก็บแม่พิมพ์ | ที่เก็บ image ให้ทุกเครื่อง pull ไปใช้ |
| **Docker Hub** | คลังสาธารณะ | registry สาธารณะที่ default ของ Docker |
| **Tag** | ป้ายชื่อเวอร์ชัน | `myapp:1.4.2` — ชื่อ + เวอร์ชันของ image |
| **Volume** | ตู้เก็บของนอกกล่อง | ที่เก็บข้อมูลที่ต้องอยู่รอดแม้ container ถูกลบ |
| **Bind Mount** | ยืมโฟลเดอร์จากเครื่องจริง | map โฟลเดอร์บนเครื่อง host เข้าไปใน container |
| **Network** | สายแลนของกล่อง | เครือข่ายเสมือนที่ให้ container คุยกันด้วย "ชื่อ" |
| **Port Mapping** | เจาะรูให้โลกภายนอก | เชื่อม port ของเครื่อง host → port ใน container |
| **Environment Variable** | ค่าที่ยื่นเข้ามาตอนเปิดกล่อง | config ที่เปลี่ยนตาม environment โดยไม่ต้อง build ใหม่ |
| **Docker Compose** | ใบสั่งชุดใหญ่ | ไฟล์เดียวที่ประกาศหลาย container + network + volume พร้อมกัน |
| **Multi-stage Build** | ห้องครัวแยกจากจานเสิร์ฟ | build ใน stage หนึ่ง แล้วคัดเฉพาะผลลัพธ์ไป stage สุดท้าย |
| **.dockerignore** | ของที่ห้ามใส่ลงกล่อง | บอกว่าไฟล์ไหนไม่ต้องส่งเข้า build context |
| **Build Context** | กองของที่ยกให้ช่าง | โฟลเดอร์ที่ถูกส่งให้ Docker daemon ตอน build |
| **Ephemeral** | ของใช้แล้วทิ้ง | container ถูกลบได้ตลอดเวลา ข้างในไม่ควรเก็บของสำคัญ |
| **Writable Layer** | ชั้นกระดาษไขของ container | ชั้นบนสุดที่ container เขียนได้ หายไปพร้อม container |
| **ENTRYPOINT / CMD** | คำสั่งตอนเปิดกล่อง | บอกว่า container เริ่มทำงานด้วยคำสั่งอะไร |
| **Healthcheck** | ตรวจชีพจร | คำสั่งที่บอกว่ากล่องนี้ยัง "ใช้งานได้จริง" ไหม |
| **Namespace** | กำแพงมองเห็น | กลไก Linux ที่ทำให้ container เห็นแค่ของตัวเอง |
| **cgroups** | โควต้าทรัพยากร | กลไก Linux ที่จำกัด CPU / memory ของ container |
| **Virtual Machine (VM)** | บ้านทั้งหลัง | จำลองเครื่องทั้งเครื่องพร้อม OS ของตัวเอง |
| **Hypervisor** | คนแบ่งบ้าน | ชั้นซอฟต์แวร์ที่แบ่งเครื่องจริงออกเป็นหลาย VM |

---

## 3. Mental Model

### 3.1 Docker ไม่ได้ "จำลองเครื่อง" มันแค่ "กั้นห้อง"

นี่คือจุดที่แยก junior ออกจาก mid-level ทันที

Container **ไม่ใช่** เครื่องคอมพิวเตอร์เล็ก ๆ
Container คือ **process ธรรมดาบน Linux kernel ของเครื่อง host** ที่ถูกจับใส่กำแพง 2 ชั้น:

| กลไก | หน้าที่ | ผลที่เห็น |
|---|---|---|
| **Namespace** | จำกัด "สิ่งที่มองเห็น" | container เห็น process ของตัวเอง เห็น filesystem ของตัวเอง เห็น network ของตัวเอง |
| **cgroups** | จำกัด "สิ่งที่ใช้ได้" | container ใช้ CPU / memory ได้ไม่เกินโควต้าที่ตั้ง |

แปลว่า container **ไม่มี kernel ของตัวเอง** มันยืม kernel ของเครื่อง host ใช้
นี่คือเหตุผลเดียวที่อธิบายได้ทุกอย่าง: ทำไม container เบา ทำไมสตาร์ทใน 1 วินาที และทำไม container Linux รันบน kernel Windows ตรง ๆ ไม่ได้ (ต้องมี Linux VM บาง ๆ ซ่อนอยู่ข้างหลัง)

### 3.2 Container คือ "ของใช้แล้วทิ้ง" (Ephemeral)

ให้ตั้งสมมติฐานไว้เลยว่า:

> **container ของเราอาจถูกฆ่าทิ้งเมื่อไรก็ได้ โดยไม่บอกล่วงหน้า**

deploy ใหม่ → ลบทิ้งสร้างใหม่
เครื่องเต็ม → ถูกย้ายไปเครื่องอื่น
crash → ถูกสร้างใหม่อัตโนมัติ

ดังนั้นกฎเหล็กคือ **อะไรที่หายไม่ได้ ห้ามอยู่ในกล่อง** ต้องออกไปอยู่ที่ volume หรือ database หรือ object storage

### 3.3 Image ต้อง "เหมือนกันทุก environment" — ตัวที่เปลี่ยนคือ config

ผิด: build image แยกกันสำหรับ dev / staging / prod
ถูก: build **image เดียว** แล้วเปลี่ยนพฤติกรรมด้วย **environment variable**

```
        [IMAGE  myapp:1.4.2]     ← ตัวเดียว build ครั้งเดียว
                 │
   ┌─────────────┼─────────────┐
   ▼             ▼             ▼
[dev]        [staging]      [prod]
ENV ต่างกัน   ENV ต่างกัน    ENV ต่างกัน
```

> **ให้มองภาพนี้ว่า** "ของที่เราทดสอบผ่านใน staging ต้องเป็นก้อนเดียวกันเป๊ะกับที่ขึ้น production ไม่ใช่ของที่ build ใหม่แล้วหวังว่าจะเหมือน"

ถ้า build ใหม่ทีละ environment แปลว่าสิ่งที่ทดสอบผ่านกับสิ่งที่ขึ้นจริง **ไม่ใช่ของชิ้นเดียวกัน** ซึ่งทำลายเหตุผลทั้งหมดของการใช้ Docker

### 3.4 Dockerfile คือ "เอกสารที่รันได้"

เวลาคนใหม่เข้าทีมแล้วถามว่า "ต้องลงอะไรบ้าง" คำตอบที่ดีที่สุดคือชี้ไปที่ Dockerfile
มันคือ README ที่โกหกไม่ได้ เพราะถ้ามันผิด build ก็พังทันที

---

## 4. 🧠 ภาพจำ

```
🧠 ภาพจำหลัก: โรงงานทำขนม

Dockerfile  =  สูตรขนม (กระดาษ)
docker build=  ช่างทำแม่พิมพ์ตามสูตร
Image       =  แม่พิมพ์ (แข็ง เปลี่ยนไม่ได้ ก๊อปส่งต่อได้)
Registry    =  คลังเก็บแม่พิมพ์ที่ทุกสาขายืมได้
docker run  =  ปั๊มขนมออกมา 1 ชิ้น
Container   =  ขนมชิ้นนั้น (กินหมดแล้วทิ้ง ปั๊มใหม่ได้เสมอ)
Volume      =  ตู้เย็นที่อยู่นอกโรงงาน ขนมหายแต่ของในตู้ไม่หาย
```

ภาพจำรอง แยกตามเรื่องที่มักสับสน:

```
🧠 Docker vs VM

VM        = ยกบ้านทั้งหลังไป  (มีห้องครัว ห้องน้ำ ระบบไฟของตัวเอง = OS เต็ม)
Container = เช่าห้องในคอนโด   (ใช้ระบบน้ำ-ไฟกลางของตึก = kernel ของ host)

        VM                        CONTAINER
   ┌───────────┐              ┌───────────┐
   │   App     │              │   App     │
   │  Guest OS │  ← หนัก      │  (ไม่มี OS)│  ← เบา
   └───────────┘              └───────────┘
   Hypervisor                 Docker Engine
   Host OS + Kernel           Host OS + Kernel  ← ใช้ร่วมกัน
```

> **ให้มองภาพนี้ว่า** "VM คือการยกบ้านทั้งหลังไปตั้ง ส่วน Container คือการเช่าห้องในตึกที่มีระบบกลางอยู่แล้ว จึงเข้าอยู่ได้เร็วกว่ามากและเปลืองพื้นที่น้อยกว่ามาก"

```
🧠 Container = กล่องกระดาษที่เขียนทับได้ วางบนแม่พิมพ์ที่เขียนไม่ได้

   ┌──────────────────────────┐
   │  Writable Layer          │  ← container เขียนตรงนี้ (หายเมื่อลบ)
   ├──────────────────────────┤
   │  Layer: COPY app code    │ ┐
   ├──────────────────────────┤ │
   │  Layer: npm install      │ ├─ IMAGE (read-only ใช้ร่วมกันได้)
   ├──────────────────────────┤ │
   │  Layer: base node:alpine │ ┘
   └──────────────────────────┘
```

> **ให้มองภาพนี้ว่า** "container คือกระดาษไขแผ่นบาง ๆ ที่วางทับบนภาพพิมพ์ เขียนเล่นบนกระดาษไขได้ตามใจ แต่พอฉีกทิ้ง ภาพพิมพ์ข้างล่างยังเหมือนเดิมทุกเส้น"

---

## 5. How It Works

### 5.1 Flow หลัก: Dockerfile → Image → Container

```
[เขียน Dockerfile]
        ↓
[docker build -t myapp:1.0 .]
        │
        ├─ อ่าน Build Context (โฟลเดอร์ปัจจุบัน ลบสิ่งที่อยู่ใน .dockerignore)
        ├─ ทำทีละคำสั่ง แต่ละคำสั่ง = 1 layer
        └─ ถ้า layer ไหนเคยทำแล้วและ input ไม่เปลี่ยน → ใช้ cache
        ↓
[IMAGE  myapp:1.0]   ← read-only
        ↓
[docker push registry/myapp:1.0]
        ↓
[REGISTRY]
        ↓
[docker pull บน server]
        ↓
[docker run -p 8080:3000 -e NODE_ENV=production myapp:1.0]
        ↓
[CONTAINER กำลังทำงาน]
```

> **ให้มองภาพนี้ว่า** "เรา build ของครั้งเดียวที่เครื่อง CI แล้วส่งของชิ้นเดิมนั้นไปทุกที่ ไม่ใช่ให้ทุกเครื่องประกอบของเองแล้วลุ้นว่าจะเหมือนกัน"

### 5.2 Dockerfile — คำสั่งที่ต้องรู้จริง

pseudocode สั้น ๆ (Dockerfile จริงของ Node app):

```
FROM node:20-alpine        # เริ่มจากฐานอะไร
WORKDIR /app               # ทำงานในโฟลเดอร์ไหนข้างใน container
COPY package*.json ./      # คัดลอกเฉพาะไฟล์ dependency ก่อน
RUN npm ci                 # ติดตั้ง (layer นี้ cache ได้นาน)
COPY . .                   # ค่อยคัดลอก source code
CMD ["node", "server.js"]  # คำสั่งตอน container เริ่มทำงาน
```

อธิบายทีละบรรทัดแบบที่ต้องตอบได้ในห้องสัมภาษณ์:

| คำสั่ง | ทำอะไร | เหตุผลที่วางตรงนี้ |
|---|---|---|
| `FROM` | เลือก base image | กำหนด OS + runtime ที่มีมาให้ |
| `WORKDIR` | ตั้งโฟลเดอร์ทำงาน | ดีกว่า `cd` เพราะมีผลกับทุกคำสั่งถัดไป |
| `COPY package*.json` | คัดลอกเฉพาะรายชื่อ dependency | **จุดสำคัญของ cache** — ดูข้อ 5.3 |
| `RUN npm ci` | ติดตั้ง dependency ตอน build | `ci` ใช้ lock file เป๊ะ ผลลัพธ์ซ้ำได้ |
| `COPY . .` | คัดลอก source ทั้งหมด | code เปลี่ยนบ่อยที่สุด จึงต้องอยู่ล่างสุด |
| `CMD` | คำสั่งเริ่มต้นตอน run | เป็น default ที่ override ได้ตอน `docker run` |

### 5.3 Layer Cache — เหตุผลที่ลำดับใน Dockerfile สำคัญมาก

Docker build ทีละ layer และจำผลของทุก layer ไว้
กฎเดียวที่ต้องจำ:

> **ถ้า layer ไหนเปลี่ยน layer ที่อยู่ "ใต้ลงมา" ทั้งหมดต้องทำใหม่หมด**

```
เขียนผิด (ช้า)                      เขียนถูก (เร็ว)
─────────────────                   ─────────────────
FROM node                           FROM node
COPY . .        ← code เปลี่ยน      COPY package*.json ./
RUN npm install ← ต้องลงใหม่ทุกครั้ง RUN npm ci       ← cache อยู่
                                    COPY . .         ← เปลี่ยนแค่ชั้นบน
```

> **ให้มองภาพนี้ว่า** "ให้เอาของที่ไม่ค่อยเปลี่ยนไว้ข้างล่าง เอาของที่เปลี่ยนทุกวันไว้ข้างบน เหมือนจัดกระเป๋าเดินทางให้ของที่ต้องหยิบบ่อยอยู่ชั้นบนสุด"

ผลลัพธ์จริง: แก้ code 1 บรรทัดแล้ว build ใหม่ — แบบเขียนถูกใช้เวลาไม่กี่วินาที แบบเขียนผิดต้อง `npm install` ใหม่ทุกครั้ง

### 5.4 Multi-stage Build — ทำให้ image เล็กและปลอดภัยขึ้น

ปัญหา: เครื่องมือที่ใช้ **ตอน build** (compiler, dev dependency, test tool) ไม่มีประโยชน์ **ตอน run**
ถ้าปล่อยไว้ image จะใหญ่และมีของที่ผู้โจมตีเอาไปใช้ต่อได้

```
┌─ STAGE 1: builder ──────────────┐
│ FROM node:20 AS builder         │
│ RUN npm ci      ← dev deps ครบ  │
│ RUN npm run build               │
│ ผลลัพธ์: /app/dist              │
└────────────┬────────────────────┘
             │ COPY --from=builder /app/dist ./dist
             ▼
┌─ STAGE 2: runtime ──────────────┐
│ FROM node:20-alpine             │
│ ติดตั้งเฉพาะ production deps    │
│ ได้เฉพาะ dist ที่ build เสร็จ    │  ← image สุดท้ายเล็กลงมาก
└─────────────────────────────────┘
```

> **ให้มองภาพนี้ว่า** "ห้องครัวรกแค่ไหนก็ได้ แต่สิ่งที่ยกออกไปเสิร์ฟคือจานอาหาร ไม่ใช่ทั้งห้องครัว"

ประโยชน์ที่ต้องพูดได้ 3 ข้อ:

1. **image เล็ก** → pull เร็ว deploy เร็ว ประหยัดค่าเก็บ
2. **ปลอดภัยขึ้น** → ไม่มี compiler / ไม่มี dev tool / attack surface เล็กลง
3. **ไม่หลุด secret ตอน build** → ของใน stage แรกไม่ติดไปกับ image สุดท้าย

### 5.5 .dockerignore และ Build Context

ตอนสั่ง `docker build .` Docker จะ **ส่งทั้งโฟลเดอร์** ไปให้ daemon ก่อน นั่นคือ build context
ถ้าไม่กัน `node_modules`, `.git`, ไฟล์ log, ไฟล์ media ก็จะถูกส่งไปด้วยทั้งหมด

| ไฟล์ที่ควรใส่ใน `.dockerignore` | เหตุผล |
|---|---|
| `node_modules` | หนักมาก และต้องติดตั้งใหม่ใน container อยู่แล้ว |
| `.git` | ไม่จำเป็นตอน run และมีประวัติ commit ทั้งหมด |
| `.env`, `*.pem`, `*.key` | **กัน secret หลุดเข้า image** |
| `dist`, `build` | ของเก่าที่ค้างอยู่อาจถูกคัดลอกทับของใหม่ |
| `*.log`, `coverage`, `tmp` | ขยะที่ทำให้ context ใหญ่และ cache พัง |

ผลข้างเคียงที่สำคัญ: ถ้าไม่มี `.dockerignore` แล้ว `node_modules` เปลี่ยน → build context เปลี่ยน → **cache พังทั้งที่ code ไม่ได้แก้**

### 5.6 Port Mapping — ทำไมเปิดเว็บแล้วไม่ขึ้น

container มี network ของตัวเอง โลกภายนอกเข้าไม่ถึงจนกว่าเราจะ "เจาะรู"

```
[Browser: localhost:8080]
        ↓
[HOST machine  port 8080]
        ↓  -p 8080:3000     (ซ้าย = host, ขวา = container)
[CONTAINER     port 3000]
        ↓
[แอปเรา listen 0.0.0.0:3000]   ← ต้อง 0.0.0.0 ไม่ใช่ 127.0.0.1
```

> **ให้มองภาพนี้ว่า** "port mapping คือการเจาะช่องจากถนนหน้าตึกเข้าไปยังห้องเบอร์หนึ่งเท่านั้น ห้องอื่นในตึกยังไม่มีใครเข้าถึงได้"

กับดักที่เจอบ่อยมาก: แอป listen `127.0.0.1` ซึ่งใน container แปลว่า "แค่ในกล่องนี้เท่านั้น" ข้างนอกต่อไม่ติดแม้ map port ถูกแล้ว — ต้อง listen `0.0.0.0`

### 5.7 Volume — ที่เก็บของที่ไม่หายไปกับกล่อง

container เขียนไฟล์ลง writable layer ได้ แต่ **ลบ container = ข้อมูลหาย**

```
[Container: postgres]
        │ เขียนข้อมูลลง /var/lib/postgresql/data
        ▼
   ┌─────────────────────┐
   │  VOLUME (นอกกล่อง)  │  ← อยู่รอดแม้ container ถูกลบ/สร้างใหม่
   └─────────────────────┘
        ▲
[Container: postgres ตัวใหม่]  ← ต่อ volume เดิม ข้อมูลยังอยู่ครบ
```

> **ให้มองภาพนี้ว่า** "กล่องเปลี่ยนใบได้เรื่อย ๆ แต่ตู้เซฟตั้งอยู่ข้างนอกกล่องเสมอ"

สองแบบที่ต้องแยกให้ออก:

| | **Volume** | **Bind Mount** |
|---|---|---|
| ใครจัดการที่เก็บ | Docker จัดการให้ | เราชี้ path บนเครื่อง host เอง |
| ใช้ตอนไหน | **production** — data ของ database, ไฟล์ upload | **development** — map source code เข้าไปให้ hot reload |
| ย้ายเครื่องง่ายไหม | ง่ายกว่า มีคำสั่ง backup / restore ให้ | ผูกกับ path ของเครื่องนั้น |
| ความเสี่ยง | ต่ำ | เผลอ map ทับของใน container ได้ |

### 5.8 Network — ให้ container คุยกันด้วย "ชื่อ"

เมื่อ container อยู่ network เดียวกัน มันเรียกกันด้วย **ชื่อ service** ได้เลย ไม่ต้องรู้ IP

```
        ┌──── docker network: app-net ────┐
        │                                  │
[api] ──┼──► เรียก  postgres:5432  ────────┼──► [db]
        │                                  │
[api] ──┼──► เรียก  redis:6379    ─────────┼──► [cache]
        └──────────────────────────────────┘
                    ▲
            -p 8080:3000 (เจาะรูเฉพาะ api)
                    │
              [โลกภายนอก]
```

> **ให้มองภาพนี้ว่า** "container ในเครือข่ายเดียวกันเหมือนคนในออฟฟิศเดียวกัน เรียกกันด้วยชื่อได้เลย ส่วนคนนอกตึกต้องเข้าทางประตูที่เราเปิดไว้เท่านั้น"

จุดที่มักพลาด: ใน `docker-compose` อย่าใช้ `localhost` เพื่อเรียก service อื่น เพราะ `localhost` ใน container หมายถึง "ตัวเอง" ต้องใช้ **ชื่อ service** แทน

### 5.9 Environment Variable — config ที่เปลี่ยนโดยไม่ต้อง build ใหม่

```
[IMAGE เดียว]
    │
    ├─ run + ENV DB_HOST=dev-db       → พฤติกรรมแบบ dev
    ├─ run + ENV DB_HOST=staging-db   → พฤติกรรมแบบ staging
    └─ run + ENV DB_HOST=prod-db      → พฤติกรรมแบบ production
```

> **ให้มองภาพนี้ว่า** "image คือเครื่องใช้ไฟฟ้าเครื่องเดียวกัน ส่วน environment variable คือปลั๊กที่เสียบคนละห้อง"

กฎที่ต้องพูดให้ได้ในสัมภาษณ์:

- **ห้าม `ENV SECRET=...` ใน Dockerfile** เพราะค่านั้นถูกฝังลง layer ของ image และใครที่ pull image ไปก็อ่านได้
- secret ต้องถูก **ฉีดตอน runtime** ผ่าน env / secret manager / mounted file
- `.env` ต้องอยู่ใน `.dockerignore` และห้าม commit

### 5.10 Registry & Tag — ของชิ้นนี้คือเวอร์ชันไหน

```
[CI build เสร็จ]
      ↓
docker tag  myapp:<git-sha>          ← ชี้กลับไปหา commit ได้เป๊ะ
      ↓
docker push registry/myapp:<git-sha>
      ↓
[SERVER pull tag เดียวกันนั้นไป run]
```

> **ให้มองภาพนี้ว่า** "ทุกกล่องที่ส่งออกจากโรงงานต้องมีเลขล็อตที่สาวกลับไปหาสูตรที่ใช้ทำมันได้เสมอ"

ทำไมห้ามใช้ `latest` บน production:

| ปัญหาของ `latest` | ผลที่เกิดจริง |
|---|---|
| ไม่บอกว่าเป็นเวอร์ชันไหน | rollback ไม่ได้ เพราะไม่รู้ว่าจะกลับไปตัวไหน |
| เปลี่ยนความหมายได้ตลอด | สองเครื่อง pull `latest` คนละเวลา ได้คนละของ |
| debug ยาก | เห็น bug แล้วสาวกลับไปหา commit ไม่ได้ |

### 5.11 Docker Compose — หลายกล่องที่ต้องขึ้นพร้อมกัน

แอปจริงไม่ได้มี container เดียว อย่างน้อยมี api + database + cache
Compose คือไฟล์ประกาศเดียวที่บอกว่าระบบทั้งชุดหน้าตาแบบไหน

```
docker-compose.yml
   ├── service: api    (build จาก Dockerfile, ports 8080:3000, depends_on db)
   ├── service: db     (image postgres, volume db-data)
   └── service: cache  (image redis)
            ↓
    docker compose up
            ↓
[network เดียว + volume + container ครบชุดขึ้นพร้อมกัน]
```

> **ให้มองภาพนี้ว่า** "Dockerfile บอกวิธีทำกล่องหนึ่งใบ ส่วน Compose บอกว่าทั้งระบบต้องมีกล่องอะไรบ้าง ต่อสายกันยังไง"

ขอบเขตที่ต้องรู้: Compose เหมาะกับ **เครื่องเดียว** (dev / demo / ระบบเล็ก) ถ้าต้องกระจายหลายเครื่อง + auto-restart + auto-scale นั่นคืองานของ **Kubernetes**

### 5.12 กฎ production ที่ต้องทำเสมอ

| กฎ | เหตุผล | ถ้าไม่ทำจะเจออะไร |
|---|---|---|
| ใช้ base image เล็ก (alpine / slim / distroless) | ลด attack surface + pull เร็ว | image หลาย GB, deploy ช้า, ช่องโหว่เยอะ |
| Multi-stage build | แยกของ build ออกจากของ run | dev tool และ source code ติดไปกับ production |
| pin เวอร์ชัน base image | build ซ้ำได้ผลเดิม | วันหนึ่ง build แล้วพังทั้งที่ code ไม่แก้ |
| **ไม่รันเป็น root** (`USER app`) | ถ้าโดนเจาะ ผู้โจมตีไม่ได้สิทธิ์สูงสุด | container escape กลายเป็นปัญหาระดับเครื่อง |
| **ห้ามใส่ secret ลง image** | layer อ่านย้อนได้ทั้งหมด | key หลุดตอนที่ image ถูกแชร์ |
| ตั้ง memory / CPU limit | กันกล่องเดียวกินทั้งเครื่อง | เพื่อนบ้านล่มตามไปด้วย (noisy neighbor) |
| มี healthcheck | ให้ระบบรู้ว่ากล่องยังใช้ได้จริง | container ยัง "รัน" อยู่แต่ตอบ request ไม่ได้ |
| container ต้อง stateless | container คือของใช้แล้วทิ้ง | ข้อมูลหายตอน deploy ครั้งถัดไป |
| log ออก stdout/stderr | ให้ระบบเก็บ log กลางอ่านได้ | log ค้างในกล่อง หาย |
| จัดการ SIGTERM ให้ดี | ปิดงานที่ค้างให้จบก่อนตาย | request ที่กำลังทำอยู่ถูกตัดกลางคัน |

---

## 6. Example — สถานการณ์จากงานจริง

### 6.1 ทีมใหม่เข้างานวันแรก

**ก่อนใช้ Docker:** developer ใหม่ใช้เวลาครึ่งวันถึงหนึ่งวันลง Node, ลง PostgreSQL เวอร์ชันที่ตรงกับทีม, ลง Redis, ตั้งค่า `.env` ตามที่รุ่นพี่บอกปากเปล่า แล้วยังเจอ error ที่ไม่มีใครเคยเจอ

**หลังใช้ Docker:** clone repo แล้วสั่ง `docker compose up` ครั้งเดียว ได้ api + db + cache ครบ เวอร์ชันตรงกับทุกคนในทีม

สิ่งที่เปลี่ยนจริง ๆ ไม่ใช่ความเร็ว แต่คือ **ทุกคนในทีมรันของชุดเดียวกัน** bug ที่เจอจึงเป็น bug จริง ไม่ใช่ bug จากความต่างของเครื่อง

### 6.2 Deploy pipeline ที่ใช้จริงในบริษัท

```
[Developer push code]
        ↓
[CI: run test]
        ↓
[CI: docker build -t myapp:<git-sha> .]
        ↓
[CI: docker push → registry]
        ↓
[Deploy staging: pull myapp:<git-sha> → run]
        ↓
[ทดสอบผ่าน]
        ↓
[Deploy production: pull "image ก้อนเดิม" → run]   ← ไม่ build ใหม่
```

> **ให้มองภาพนี้ว่า** "ของที่ผ่าน QA กับของที่ขึ้น production ต้องเป็นก้อนเดียวกันเป๊ะ ไม่ใช่ของที่ทำใหม่ตามสูตรเดียวกัน"

### 6.3 เคสจริง: image 1.2 GB → 180 MB

อาการ: deploy แต่ละครั้งช้ามาก เพราะทุก server ต้อง pull image ขนาดใหญ่

ไล่ดูแล้วเจอ 4 จุด:

| ปัญหาที่เจอ | วิธีแก้ | ผล |
|---|---|---|
| ใช้ base image เต็ม (`node:20`) | เปลี่ยนเป็น `node:20-alpine` ใน stage สุดท้าย | เล็กลงมาก |
| ไม่มี `.dockerignore` | `node_modules` + `.git` ถูกส่งเข้า context | build เร็วขึ้นและ cache ไม่พังมั่ว |
| ไม่มี multi-stage | dev dependency + source ติดไปด้วย | ตัดออกได้ทั้งก้อน |
| `COPY . .` อยู่บนสุด | ย้ายลงล่าง แยก `COPY package*.json` ขึ้นก่อน | build ซ้ำจากหลายนาทีเหลือไม่กี่วินาที |

บทเรียนที่ต้องพูดได้: **ขนาด image ไม่ใช่เรื่องความสวยงาม มันคือเวลา deploy, ค่าเก็บข้อมูล และจำนวนช่องโหว่ที่ต้องตามปิด**

### 6.4 เคสจริง: ข้อมูล database หายหลัง deploy

อาการ: deploy เวอร์ชันใหม่แล้วข้อมูลผู้ใช้หายเกลี้ยง

สาเหตุ: container ของ PostgreSQL ถูกรันโดยไม่ผูก volume ข้อมูลทั้งหมดจึงอยู่ใน writable layer ของ container
deploy = ลบ container เก่า สร้างใหม่ = **writable layer หายไปพร้อมข้อมูล**

แก้: ผูก volume ให้ path เก็บข้อมูลของ database และตั้งกฎทีมว่า **stateful service ทุกตัวต้องประกาศ volume เสมอ**

---

## 7. Compare — ตารางเทียบสิ่งที่มักสับสน

### 7.1 Image vs Container (ข้อที่ต้องตอบได้แบบไม่ลังเล)

| หัวข้อ | Image | Container |
|---|---|---|
| นิยาม | template อ่านอย่างเดียว | instance ที่กำลังทำงานของ image |
| เขียนได้ไหม | ❌ | ✅ (writable layer ชั้นบนสุด) |
| สร้างด้วยคำสั่ง | `docker build` | `docker run` |
| เก็บที่ไหน | disk / registry | runtime ของเครื่อง |
| ตายแล้วเกิดอะไร | ไม่ตายเอง ต้องลบเอง | หยุด/ถูกลบได้ตลอดเวลา |
| อุปมา | class / แม่พิมพ์ / สูตรที่ทำเสร็จ | object / ขนมที่ปั๊มออกมา |

### 7.2 Docker vs Virtual Machine

| หัวข้อ | Container (Docker) | Virtual Machine |
|---|---|---|
| แยกกันด้วยอะไร | namespace + cgroups ของ kernel | hypervisor จำลอง hardware |
| มี OS ของตัวเองไหม | ❌ ใช้ kernel ของ host | ✅ มี Guest OS เต็ม |
| ขนาดทั่วไป | หลักสิบ–หลักร้อย MB | หลัก GB |
| เวลาสตาร์ท | วินาที | หลายสิบวินาที–นาที |
| ระดับการแยก (isolation) | ต่ำกว่า (แชร์ kernel) | **สูงกว่า** |
| เหมาะกับเมื่อไร | แอปหลายตัวบนเครื่องเดียว, deploy บ่อย, microservices | ต้องการ OS ต่างชนิด, ต้องการ isolation เข้มงวด, งานที่ compliance บังคับ |
| ข้อควรระวัง | kernel ร่วมกัน → ช่องโหว่ kernel กระทบทุก container | ใช้ทรัพยากรมากกว่ามาก |

สรุปแบบมี context (ห้ามตอบว่าอันไหน "ดีกว่า" ลอย ๆ):

> "Container ดีกว่าเมื่อเราต้องการ deploy บ่อยและรันหลาย service บนเครื่องเดียวอย่างคุ้มทรัพยากร ส่วน VM ดีกว่าเมื่อเราต้องการ isolation ระดับ kernel หรือจำเป็นต้องรัน OS คนละชนิด — ในระบบจริงมักใช้ทั้งคู่ คือ container รันอยู่ข้างใน VM อีกที"

### 7.3 Volume vs Bind Mount vs COPY

| | COPY (ตอน build) | Volume | Bind Mount |
|---|---|---|---|
| ข้อมูลอยู่ที่ไหน | ฝังใน image | Docker จัดการให้นอก container | โฟลเดอร์บนเครื่อง host |
| เปลี่ยนตอน run ได้ไหม | ❌ ต้อง build ใหม่ | ✅ | ✅ |
| อยู่รอดหลังลบ container | ✅ (แต่เป็นของเดิมเสมอ) | ✅ | ✅ |
| ใช้กับอะไร | source code, asset | ข้อมูล database, ไฟล์ upload | source code ตอน dev เพื่อ hot reload |

### 7.4 CMD vs ENTRYPOINT

| | CMD | ENTRYPOINT |
|---|---|---|
| ความหมาย | คำสั่ง **ตั้งต้น** ที่ override ได้ง่าย | คำสั่ง **หลัก** ที่ตั้งใจให้ติดถาวร |
| ตอน `docker run image echo hi` | ถูกแทนที่ด้วย `echo hi` | ยังรัน entrypoint เดิม ส่ง `echo hi` เป็น argument |
| ใช้เมื่อ | image ทั่วไปที่คนอาจอยากรันคำสั่งอื่น | image ที่ทำหน้าที่เดียวเหมือน executable |

### 7.5 Docker Compose vs Kubernetes

| | Docker Compose | Kubernetes |
|---|---|---|
| ขอบเขต | **หนึ่งเครื่อง** | **คลัสเตอร์หลายเครื่อง** |
| เหมาะกับ | dev environment, demo, ระบบเล็ก | production ที่ต้อง scale / self-heal |
| เรียนรู้ยากไหม | ง่าย | สูงชัน |
| ทำอะไรไม่ได้ | auto-scale, rolling update ข้ามเครื่อง, self-healing เต็มรูป | — |
| ความสัมพันธ์ | ทั้งคู่ใช้ **image** ตัวเดียวกัน | image ที่ build ด้วย Docker ใช้ได้ทันที |

---

## 8. Common Mistakes — สิ่งที่ junior มักเข้าใจผิด

| # | ความเข้าใจผิด | ความจริง |
|---|---|---|
| 1 | "Docker คือ VM แบบเบา ๆ" | Docker **ไม่ได้จำลอง OS** มันแค่กั้น process ด้วย namespace + cgroups และใช้ kernel ของ host |
| 2 | ใช้คำว่า image กับ container สลับกัน | image = แม่พิมพ์ read-only / container = instance ที่รันอยู่ ถ้าพูดสลับ ผู้สัมภาษณ์จับได้ทันที |
| 3 | เก็บข้อมูลไว้ใน container | container คือ ephemeral — ลบเมื่อไรข้อมูลหายเมื่อนั้น ต้องใช้ volume |
| 4 | ใส่ secret ลง Dockerfile ด้วย `ENV` | ค่าถูกฝังใน layer อ่านย้อนได้ ต้องฉีดตอน runtime เท่านั้น |
| 5 | ใช้ `latest` บน production | rollback ไม่ได้ และแต่ละเครื่องอาจได้คนละของ ต้อง tag ด้วย version หรือ git sha |
| 6 | `COPY . .` ไว้บนสุดของ Dockerfile | ทำให้ cache พังทุกครั้งที่แก้ code แม้แต่บรรทัดเดียว |
| 7 | ไม่มี `.dockerignore` | `node_modules` + `.git` ถูกส่งเข้า build context → ช้า, image ใหญ่, เสี่ยง secret หลุด |
| 8 | รัน container เป็น root โดยไม่คิด | ถ้าถูกเจาะ ผู้โจมตีได้สิทธิ์สูงสุดใน container และเพิ่มโอกาส escape |
| 9 | ใช้ `localhost` เรียก container อื่นใน compose | `localhost` ใน container = ตัวมันเอง ต้องเรียกด้วย **ชื่อ service** |
| 10 | แอป listen `127.0.0.1` แล้วงงว่าทำไม port mapping ไม่ทำงาน | ต้อง listen `0.0.0.0` เพื่อรับ traffic จากนอก container |
| 11 | `docker exec` เข้าไปแก้ไฟล์ใน container แล้วคิดว่าแก้ถาวร | ของที่แก้อยู่ใน writable layer พอสร้าง container ใหม่ก็หาย — ต้องแก้ที่ Dockerfile |
| 12 | คิดว่า build บนเครื่องตัวเองแล้วส่งขึ้น server เป็นเรื่องปกติ | ต้องให้ CI build เพื่อให้ผลลัพธ์ซ้ำได้และตรวจสอบย้อนหลังได้ |
| 13 | คิดว่า image เล็ก-ใหญ่ไม่สำคัญ | มันคือเวลา deploy, ค่าเก็บ, และจำนวนช่องโหว่ที่ต้องตามปิด |
| 14 | ไม่ตั้ง resource limit | container ตัวเดียวกิน memory จนเครื่องทั้งเครื่องล่ม |
| 15 | คิดว่า Docker Compose ใช้ทำ production ขนาดใหญ่ได้ | Compose อยู่บนเครื่องเดียว ไม่มี self-healing / auto-scale ข้ามเครื่อง |

---

## 9. Debugging — ถ้าส่วนนี้มีปัญหา ไล่ดูอะไรตามลำดับ

### 9.1 Container เปิดแล้วดับทันที

```
[docker ps -a → เห็น Exited (1)]
        ↓
[docker logs <container>]        ← ขั้นแรกเสมอ อ่าน error จริงก่อนเดา
        ↓
   error อะไร?
        ├─ "cannot find module"      → COPY ไม่ครบ / build ไม่สำเร็จ
        ├─ "permission denied"       → รันด้วย user ที่ไม่มีสิทธิ์ path นั้น
        ├─ "connect ECONNREFUSED"    → เรียก service อื่นก่อนมันพร้อม
        └─ ไม่มี error แต่ exit 0    → process หลักจบงานแล้วจบเลย (ไม่ได้ค้างรอ)
```

> **ให้มองภาพนี้ว่า** "container มีชีวิตอยู่ได้ตราบเท่าที่ process หลักของมันยังทำงานอยู่ พอ process นั้นจบ กล่องก็ดับทันที"

### 9.2 เปิดเว็บไม่ขึ้นทั้งที่ container รันอยู่

ไล่ตามลำดับนี้ ห้ามข้าม:

1. `docker ps` — container ยังรันอยู่จริงไหม
2. เช็ค port mapping ถูกด้านไหม (`-p host:container` ซ้าย host ขวา container)
3. แอป listen `0.0.0.0` หรือเปล่า (ถ้า `127.0.0.1` ข้างนอกเข้าไม่ถึง)
4. `docker exec -it <c> sh` แล้วลองยิงเข้า `localhost:<port>` **จากในกล่อง** — ถ้าในกล่องเข้าไม่ได้ ปัญหาอยู่ที่แอป ไม่ใช่ Docker
5. ถ้าในกล่องเข้าได้แต่ข้างนอกไม่ได้ → ปัญหาอยู่ที่ port mapping / firewall

### 9.3 Container คุยกันไม่ได้

```
[api เรียก db แล้ว ECONNREFUSED]
        ↓
[อยู่ network เดียวกันไหม?]  → docker network inspect
        ↓ ใช่
[เรียกด้วย "ชื่อ service" หรือ localhost?] → ต้องเป็นชื่อ service
        ↓ ถูกแล้ว
[db พร้อมรับ connection แล้วยัง?]  ← depends_on รอแค่ "start" ไม่ได้รอ "พร้อม"
        ↓
[ต้องมี healthcheck หรือ retry ฝั่งแอป]
```

> **ให้มองภาพนี้ว่า** "การที่กล่อง database ถูกเปิดขึ้นมาแล้ว ไม่ได้แปลว่ามันพร้อมรับแขก แอปเราต้องเผื่อใจรอและลองใหม่ได้"

### 9.4 Build ช้าผิดปกติ

| อาการ | สาเหตุที่เจอบ่อย | วิธีตรวจ |
|---|---|---|
| ทุกครั้งต้อง `npm install` ใหม่ | `COPY . .` อยู่ก่อน `RUN npm ci` | อ่านลำดับใน Dockerfile |
| ขั้นตอน "sending build context" นานมาก | ไม่มี `.dockerignore` | ดูขนาด context ที่ log บอก |
| cache หายหลังเปลี่ยนเครื่อง/CI | CI ไม่ได้เก็บ cache ข้าม build | ตั้ง cache ใน CI |

### 9.5 Image ใหญ่เกินไป

```
[docker history <image>]     ← ดูว่า layer ไหนหนัก
        ↓
   layer ไหนใหญ่?
        ├─ base image ใหญ่        → เปลี่ยนเป็น alpine / slim
        ├─ dev dependency ติดมา   → ทำ multi-stage build
        ├─ ไฟล์ cache ของ package → ลบใน RUN เดียวกัน (คนละ RUN ไม่ช่วย)
        └─ ไฟล์ media / .git      → ใส่ .dockerignore
```

> **ให้มองภาพนี้ว่า** "layer ที่ถูกสร้างแล้วลบของทิ้งในคำสั่งถัดไป ของนั้นยังอยู่ในชั้นเดิมเสมอ เหมือนลบไฟล์แล้วแต่ถังขยะยังไม่ถูกเท"

### 9.6 ข้อมูลหายหลัง restart

1. ข้อมูลนั้นถูกเขียนลง path ที่ผูก volume ไว้หรือเปล่า
2. volume ที่ประกาศชี้ไปที่ path เดียวกับที่แอป/database เขียนจริงไหม
3. เผลอ `docker compose down -v` ไหม (`-v` = ลบ volume ด้วย)
4. เป็น anonymous volume ที่ถูกสร้างใหม่ทุกครั้งหรือเปล่า

---

## 10. Interview Questions

### 🟢 Junior

1. Docker คืออะไร แก้ปัญหาอะไรให้ทีม
2. **Image กับ Container ต่างกันอย่างไร** (คำถามยอดฮิตที่สุด)
3. Dockerfile คืออะไร ใช้ทำอะไร
4. `docker build` กับ `docker run` ต่างกันอย่างไร
5. Registry / Docker Hub คืออะไร
6. Port mapping `-p 8080:3000` หมายความว่าอะไร ตัวเลขไหนคือ host
7. Volume มีไว้ทำไม ถ้าไม่ใช้จะเกิดอะไรขึ้น
8. Environment variable ใน Docker ใช้ตอนไหน

### 🟡 Mid-level

1. Docker ต่างจาก Virtual Machine อย่างไร และเลือกใช้อันไหนเมื่อไร
2. Layer cache ทำงานยังไง ทำไมลำดับคำสั่งใน Dockerfile จึงสำคัญ
3. Multi-stage build คืออะไร ช่วยอะไรบ้าง 3 ข้อ
4. `.dockerignore` มีไว้ทำไม ถ้าไม่มีจะเกิดอะไร
5. ทำไมไม่ควรใช้ tag `latest` บน production
6. Volume กับ Bind Mount ต่างกันอย่างไร ใช้ตัวไหนตอนไหน
7. Docker Compose ใช้ทำอะไร ต่างจาก Kubernetes อย่างไร
8. container คุยกันข้าม service ยังไง ทำไมใช้ `localhost` ไม่ได้
9. จะทำให้ image เล็กลงได้ด้วยวิธีอะไรบ้าง
10. CMD กับ ENTRYPOINT ต่างกันอย่างไร

### 🔴 Senior

1. อธิบายว่า container ถูกแยกออกจากกันด้วยกลไกอะไรของ Linux และ isolation ของมันต่างจาก VM อย่างไรในเชิงความปลอดภัย
2. จะออกแบบ build/deploy pipeline อย่างไรให้ "ของที่ทดสอบผ่าน" กับ "ของที่ขึ้น production" เป็นก้อนเดียวกันแน่นอน
3. จะจัดการ secret ใน container อย่างไรให้ไม่รั่วลง image และไม่รั่วลง log
4. ทำไมการรัน container ด้วย root จึงเสี่ยง และจะออกแบบให้ไม่ต้องใช้ root อย่างไร
5. container ถูกสั่งปิดระหว่างที่ยังมี request ค้างอยู่ จะออกแบบ graceful shutdown อย่างไร
6. ระบบ deploy แล้ว container restart วนซ้ำ (crash loop) จะไล่หาสาเหตุอย่างไรเป็นลำดับ
7. จะออกแบบ strategy เรื่อง image tag และ retention ใน registry อย่างไรสำหรับทีมที่ deploy วันละหลายครั้ง
8. ข้อจำกัดของ Docker Compose คืออะไร และจุดไหนคือสัญญาณว่าทีมควรย้ายไป Kubernetes
9. base image ที่ pin ไว้มี CVE ใหม่ จะมีกระบวนการอะไรให้ image ทั้งองค์กรถูก patch โดยไม่พังของใคร
10. อธิบายว่าทำไม "container เป็น stateless" ถึงเป็นข้อกำหนดเชิงสถาปัตยกรรม ไม่ใช่แค่ best practice

---

## 11. Answer Like a Developer

### โครงการตอบ 4 ชั้น (ใช้ได้กับทุกคำถาม Docker)

```
[1] มันคืออะไร — 1 ประโยค
      ↓
[2] มันแก้ปัญหาอะไร — เล่าปัญหาก่อนมี
      ↓
[3] มันทำงานยังไง — flow สั้น ๆ
      ↓
[4] ในงานจริงต้องระวังอะไร — production thinking
```

> **ให้มองภาพนี้ว่า** "ผู้สัมภาษณ์ไม่ได้อยากรู้ว่าเราท่องนิยามได้ไหม แต่อยากรู้ว่าเราเคยเจอปัญหาที่เครื่องมือนี้แก้จริงหรือเปล่า"

### ตัวอย่างที่ 1 — "Image กับ Container ต่างกันยังไง"

**คำตอบที่อ่อน:** "Image คือ template ส่วน container คือตัวที่รัน"  (จบแค่นี้ = ท่องมา)

**คำตอบที่ดี (ตอบตามโครง 4 ชั้น):**

1. "Image คือ template แบบ read-only ที่ build จาก Dockerfile ส่วน container คือ running instance ของ image นั้น เหมือน class กับ object"
2. "เหตุผลที่แยกกันคือ image ต้องเปลี่ยนไม่ได้ เพื่อให้ของที่เราทดสอบกับของที่ deploy เป็นก้อนเดียวกันแน่ ๆ"
3. "ตอน `docker run` Docker จะเอา writable layer มาวางทับบน image แล้วเริ่ม process ให้ — ดังนั้นหนึ่ง image สร้าง container ได้ไม่จำกัด และแต่ละตัวมี state ของตัวเอง"
4. "ผลที่ตามมาในงานจริงคือ อะไรที่เขียนลง container จะหายเมื่อ container ถูกลบ ข้อมูลที่ต้องอยู่รอดจึงต้องออกไปอยู่ที่ volume หรือ database เสมอ — ผมเคยเจอเคสข้อมูลหายหลัง deploy เพราะ database container ไม่ได้ผูก volume"

### ตัวอย่างที่ 2 — "Docker ต่างจาก VM ยังไง"

1. "VM จำลอง hardware แล้วมี Guest OS ของตัวเอง ส่วน container ใช้ kernel ของ host ร่วมกัน แล้วแยกกันด้วย namespace กับ cgroups"
2. "ผลคือ container เบากว่า สตาร์ทเร็วกว่า และรันได้หลายตัวบนเครื่องเดียวอย่างคุ้มกว่า"
3. "แต่ isolation ของ VM แข็งแรงกว่า เพราะแยกถึงระดับ kernel"
4. "เลือกยังไงขึ้นกับ context — ถ้าต้อง deploy บ่อยและรันหลาย service ผมเลือก container ถ้า workload ต้องการ isolation เข้มหรือต้อง OS คนละชนิดผมเลือก VM ในระบบจริงมักใช้ทั้งคู่คือ container รันอยู่ใน VM อีกที"

### ตัวอย่างที่ 3 — "จะทำให้ image เล็กลงยังไง"

ตอบเป็นลำดับความคุ้มค่า ไม่ใช่พ่นรายการ:

1. "เริ่มจากดูก่อนว่าอะไรหนักด้วย `docker history`"
2. "ส่วนใหญ่คุ้มที่สุดคือ multi-stage build เพราะตัดทั้ง dev dependency และ build tool ออกได้ทีเดียว"
3. "ต่อมาคือเปลี่ยน base image เป็น alpine หรือ slim ใน stage สุดท้าย"
4. "แล้วค่อยเก็บรายละเอียด — `.dockerignore`, รวมคำสั่ง RUN ที่สร้างไฟล์ชั่วคราวกับที่ลบทิ้งไว้ใน layer เดียวกัน"
5. "ทั้งหมดนี้จุดประสงค์ไม่ใช่ความสวย แต่คือ deploy เร็วขึ้นและมีช่องโหว่ให้ตามปิดน้อยลง"

### ประโยคที่ใช้ได้เสมอเมื่อไม่แน่ใจ

- "ผมขอตอบเป็นหลักการก่อน แล้วถ้าจำเป็นค่อยลงรายละเอียดคำสั่ง"
- "อันนี้ผมคงต้องดู log จริงก่อน แต่ลำดับที่ผมจะไล่คือ..."
- "ทั้งสองแบบใช้ได้ ขึ้นกับว่าทีมให้น้ำหนักกับอะไรมากกว่า — ถ้า... ผมจะเลือก..."

---

## 12. One-Minute Review

อ่านรอบเดียวก่อนเดินเข้าห้องสัมภาษณ์:

- **Docker แก้ปัญหา "works on my machine"** ด้วยการทำให้สภาพแวดล้อมกลายเป็นไฟล์ที่ commit ได้
- **Dockerfile → Image → Container** คือสูตร → แม่พิมพ์ → ของจริง
- **Image = read-only template, Container = running instance** หนึ่ง image สร้างได้หลาย container
- **Container ไม่ใช่ VM** — ไม่มี kernel ของตัวเอง ใช้ namespace + cgroups กั้น จึงเบาและเร็ว
- **VM isolation แข็งแรงกว่า, Container เบาและ deploy เร็วกว่า** — เลือกตาม context ไม่มีตัวไหนดีกว่าลอย ๆ
- **Layer cache**: ของที่ไม่ค่อยเปลี่ยนไว้ล่าง ของที่เปลี่ยนบ่อยไว้บน → `COPY package*.json` ก่อน `COPY . .`
- **Multi-stage build** ตัด build tool ออกจาก image สุดท้าย → เล็กลงและปลอดภัยขึ้น
- **.dockerignore** กัน `node_modules` / `.git` / `.env` ไม่ให้เข้า build context
- **Container คือ ephemeral** — ข้อมูลที่หายไม่ได้ต้องไปอยู่ volume
- **Network**: container คุยกันด้วย "ชื่อ service" ไม่ใช่ `localhost`
- **Port mapping** `-p host:container` และแอปต้อง listen `0.0.0.0`
- **ENV คือทางเปลี่ยน config โดยไม่ build ใหม่** — image เดียวใช้ได้ทุก environment
- **ห้ามใส่ secret ลง image, ห้ามรันเป็น root, ห้ามใช้ tag `latest` บน production**
- **Compose = เครื่องเดียว, Kubernetes = หลายเครื่อง** แต่ใช้ image ก้อนเดียวกัน

---

## 13. Memory Card

### จำ 5 อย่างนี้พอ

1. **Dockerfile = สูตร, Image = แม่พิมพ์, Container = ของจริงที่ปั๊มออกมา** — พูดสามคำนี้ให้ถูกที่ ถูกเวลา ก็ผ่านครึ่งทางแล้ว
2. **Image ≠ Container** — image อ่านอย่างเดียวและใช้ซ้ำได้ไม่จำกัด ส่วน container มี writable layer ของตัวเองที่หายไปพร้อมกับมัน
3. **Container ไม่ใช่ VM** — ไม่มี OS ของตัวเอง ใช้ kernel ของ host แล้วกั้นด้วย namespace + cgroups จึงเบาและสตาร์ทเร็ว
4. **Container คือของใช้แล้วทิ้ง** — อะไรที่หายไม่ได้ต้องอยู่ที่ volume / database ไม่ใช่ในกล่อง
5. **Build ครั้งเดียว รันได้ทุกที่** — image ก้อนเดียวไปทุก environment เปลี่ยนพฤติกรรมด้วย environment variable เท่านั้น

### Keyword สั้น

**Docker** → เครื่องมือห่อแอป + สภาพแวดล้อมให้เป็นกล่องมาตรฐาน
**Dockerfile** → สูตรที่ commit ลง git ได้
**Image** → แม่พิมพ์ read-only build ครั้งเดียว
**Container** → instance ของ image ที่กำลังรัน
**Layer** → ชั้นของ image หนึ่งคำสั่ง = หนึ่งชั้น
**Layer Cache** → ชั้นที่ input ไม่เปลี่ยน ใช้ของเดิมได้
**Base Image** → ฐานที่เราต่อยอด เล็กไว้ก่อน
**Build Context** → กองไฟล์ที่ส่งให้ daemon ตอน build
**.dockerignore** → บอกว่าอะไรห้ามเข้า context
**Registry / Docker Hub** → คลังเก็บ image ให้ทุกเครื่อง pull
**Tag** → เลขล็อตของ image ห้ามใช้ `latest` บน prod
**Multi-stage Build** → build ห้องหนึ่ง เสิร์ฟอีกห้องหนึ่ง
**Volume** → ตู้เซฟนอกกล่อง ข้อมูลอยู่รอด
**Bind Mount** → ยืมโฟลเดอร์จาก host ใช้ตอน dev
**Network** → คุยกันด้วยชื่อ service ไม่ใช่ localhost
**Port Mapping** → `-p host:container` + listen `0.0.0.0`
**Environment Variable** → เปลี่ยน config โดยไม่ build ใหม่
**Ephemeral** → กล่องถูกลบเมื่อไรก็ได้
**Writable Layer** → ชั้นบนสุดของ container หายพร้อมกล่อง
**Namespace** → กำแพง "มองเห็นอะไร"
**cgroups** → โควต้า "ใช้ได้เท่าไร"
**Docker Compose** → หลายกล่องบนเครื่องเดียว
**Kubernetes** → หลายกล่องข้ามหลายเครื่อง
**Secret** → ฉีดตอน runtime ห้ามฝังใน image
**USER (non-root)** → ลดความเสียหายเมื่อถูกเจาะ

### Flow ที่ต้องวาดได้จากความจำ

```
[Dockerfile]
      │ docker build   (ทีละ layer, ใช้ cache ถ้า input ไม่เปลี่ยน)
      ▼
[IMAGE : read-only]
      │ docker push / pull
      ▼
[REGISTRY]
      │
      ▼
[docker run  -p 8080:3000  -e ENV=...  -v data:/var/lib/...]
      │
      ├── Writable Layer   ← หายเมื่อลบ container
      ├── Volume           ← อยู่รอด
      ├── Network          ← คุยกับ container อื่นด้วยชื่อ
      └── Port Mapping     ← ประตูเดียวที่โลกภายนอกเข้าได้
      ▼
[CONTAINER กำลังทำงาน]
```

> **ให้มองภาพนี้ว่า** "เราสร้างแม่พิมพ์ครั้งเดียวแล้วส่งไปทุกที่ ส่วนกล่องที่ปั๊มออกมาเป็นของชั่วคราวเสมอ — ของสำคัญทุกอย่างต้องถูกวางไว้นอกกล่อง"

---

[← สารบัญ](./00-README-TOC.md)
