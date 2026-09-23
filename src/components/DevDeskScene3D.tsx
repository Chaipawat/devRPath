"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { LatteModel } from "@/components/latte3d/LatteModel";
import type { TypingSignal } from "@/components/latte3d/types";

const C = {
  ink: "#16140f", ink2: "#2a2722", paper: "#fbfaf7", paper2: "#e6e1d7", desk: "#e9e1d2",
  signal: "#ff5a1f", electric: "#2f5bff", green: "#12a37f", amber: "#e0a100",
  pot: "#c8694a",
};

type Seg = [text: string, color: string];

const K = "#ff8a5c", S = "#7fd1a8", F = "#8fa8ff", N = "#e8c060", P = "#f6f4ef", M = "#8f8a80";
const CODE: Seg[][] = [
  [["// devpath.ts — pair-coding with LATTE =^.^=", M]],
  [["import", K], [" { understand } ", P], ["from", K], [' "devpath"', S], [";", P]],
  [],
  [["const", K], [" you = { level: ", P], ['"junior"', S], [", xp: ", P], ["0", N], [" };", P]],
  [],
  [["for", K], [" (", P], ["const", K], [" part ", P], ["of", K], [" roadmap) {", P]],
  [["  await", K], [" ", P], ["understand", F], ["(part);", P], ["  // not memorize", M]],
  [["  you.xp += part.", P], ["keywords", F], [";", P]],
  [["}", P]],
  [],
  [["you.level = ", P], ['"senior"', S], [";", P], ["  // ✓ shipped", M]],
];
const CODE_LENGTH = CODE.reduce((sum, line) => sum + line.reduce((n, [text]) => n + text.length, 0) + 1, 0);

const TERMINAL: Seg[][] = [
  [["$ ", S], ["npm run dev", P]],
  [["▲ ready on localhost:3000", M]],
  [["$ ", S], ["git commit -m \"part 08\"", P]],
  [["$ ", S], ["docker compose up -d", P]],
  [["✓ 3 services running", S]],
  [["$ ", S], ["LATTE review --meow", P]],
  [["✓ 0 bugs · 3 naps", S]],
];

function monoFont() {
  return getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";
}

function useCanvasTexture(width: number, height: number) {
  const value = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    const ctx = canvas.getContext("2d")!;
    const paint = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      draw(ctx);
      texture.needsUpdate = true;
    };
    return { texture, paint };
  }, [width, height]);
  useEffect(() => () => value.texture.dispose(), [value]);
  return value;
}

function drawEditor(ctx: CanvasRenderingContext2D, typed: number, cursorOn: boolean, font: string) {
  const { width: w, height: h } = ctx.canvas;
  ctx.fillStyle = "#16140f";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#211e19";
  ctx.fillRect(0, 0, w, 46);
  [C.signal, C.amber, C.green].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(24 + i * 22, 23, 6.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#16140f";
  ctx.fillRect(100, 8, 176, 38);
  ctx.fillStyle = C.signal;
  ctx.fillRect(100, 8, 176, 3);
  ctx.textBaseline = "middle";
  ctx.font = `500 18px ${font}`;
  ctx.fillStyle = P;
  ctx.fillText("devpath.ts", 124, 28);
  ctx.fillStyle = M;
  ctx.fillText("main ●", w - 92, 24);

  // Walk the code once to find where the cursor sits, then paint.
  let remaining = typed;
  let cursor = { line: 0, x: 84 };
  ctx.font = `500 22px ${font}`;
  const lineHeight = 40;
  const top = 88;
  const lines = CODE.map((line, index) => {
    const reached = remaining >= 0;
    let x = 84;
    const parts = line.map(([text, color]) => {
      const shown = text.slice(0, Math.max(0, remaining));
      remaining -= text.length;
      const part = { text: shown, color, x };
      x += ctx.measureText(shown).width;
      return part;
    });
    if (reached) cursor = { line: index, x };
    remaining -= 1;
    return parts;
  });

  ctx.fillStyle = "#ffffff0a";
  ctx.fillRect(0, top + cursor.line * lineHeight - lineHeight / 2, w, lineHeight);
  lines.forEach((parts, index) => {
    const y = top + index * lineHeight;
    ctx.fillStyle = index === cursor.line ? "#b8b2a7" : "#57524a";
    ctx.textAlign = "right";
    ctx.fillText(String(index + 1), 52, y);
    ctx.textAlign = "left";
    parts.forEach(({ text, color, x }) => {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    });
  });
  if (cursorOn) {
    ctx.fillStyle = C.signal;
    ctx.fillRect(cursor.x + 1, top + cursor.line * lineHeight - 14, 3, 28);
  }

  ctx.fillStyle = C.electric;
  ctx.fillRect(0, h - 34, w, 34);
  ctx.font = `600 15px ${font}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`● DEVPATH   Ln ${cursor.line + 1}   TypeScript   UTF-8`, 20, h - 17);
}

function drawTerminal(ctx: CanvasRenderingContext2D, visible: number, cursorOn: boolean, font: string) {
  const { width: w, height: h } = ctx.canvas;
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1c1a17";
  ctx.fillRect(0, 0, w, 34);
  ctx.textBaseline = "middle";
  ctx.font = `600 15px ${font}`;
  ctx.fillStyle = M;
  ctx.fillText("zsh — ~/devpath", 18, 18);
  ctx.font = `500 19px ${font}`;
  let y = 64;
  let x = 18;
  TERMINAL.slice(0, visible).forEach((line) => {
    x = 18;
    line.forEach(([text, color]) => {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    });
    y += 34;
  });
  if (cursorOn) {
    ctx.fillStyle = S;
    ctx.fillRect(18, y - 11, 11, 22);
  }
}

function Monitor({ onType }: { onType: (active: boolean, keystroke: boolean) => void }) {
  const { texture, paint } = useCanvasTexture(1024, 600);
  const state = useRef({ t: 0, typed: -1, blink: false, font: "" });

  useFrame((_, delta) => {
    const s = state.current;
    if (!s.font) s.font = monoFont();
    s.t += Math.min(delta, 0.1);
    const typed = Math.min(CODE_LENGTH, Math.floor(s.t * 24));
    if (s.t > CODE_LENGTH / 24 + 3.5) s.t = 0;
    const blink = typed < CODE_LENGTH || Math.floor(s.t * 2) % 2 === 0;
    onType(typed < CODE_LENGTH, typed > s.typed);
    if (typed === s.typed && blink === s.blink) return;
    s.typed = typed;
    s.blink = blink;
    paint((ctx) => drawEditor(ctx, typed, blink, s.font));
  });

  return (
    <group position={[0, 1.02, -0.45]}>
      <RoundedBox args={[2.02, 1.24, 0.06]} radius={0.028} smoothness={4}>
        <meshStandardMaterial color={C.ink} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.01, 0.031]}>
        <planeGeometry args={[1.92, 1.125]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.72, -0.05]}>
        <boxGeometry args={[0.1, 0.5, 0.05]} />
        <meshStandardMaterial color={C.ink2} />
      </mesh>
      <RoundedBox args={[0.56, 0.03, 0.32]} radius={0.012} position={[0, -1.005, -0.02]}>
        <meshStandardMaterial color={C.ink2} />
      </RoundedBox>
      {/* sticky note: the one thing every dev desk has */}
      <mesh position={[0.86, -0.46, 0.035]} rotation={[0, 0, 0.08]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color="#ffd84d" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Laptop() {
  const { texture, paint } = useCanvasTexture(512, 320);
  const state = useRef({ t: 0, visible: -1, blink: false, font: "" });

  useFrame((_, delta) => {
    const s = state.current;
    if (!s.font) s.font = monoFont();
    s.t += Math.min(delta, 0.1);
    if (s.t > TERMINAL.length * 0.9 + 2.5) s.t = 0;
    const visible = Math.min(TERMINAL.length, Math.floor(s.t / 0.9));
    const blink = Math.floor(s.t * 2) % 2 === 0;
    if (visible === s.visible && blink === s.blink) return;
    s.visible = visible;
    s.blink = blink;
    paint((ctx) => drawTerminal(ctx, visible, blink, s.font));
  });

  return (
    <group position={[1.18, 0, 0.12]} rotation={[0, -0.38, 0]}>
      <RoundedBox args={[0.82, 0.03, 0.56]} radius={0.012} position={[0, 0.015, 0]}>
        <meshStandardMaterial color="#cfc9be" metalness={0.2} roughness={0.45} />
      </RoundedBox>
      <group position={[0, 0.03, -0.27]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[0.82, 0.54, 0.02]} radius={0.01} position={[0, 0.27, 0]}>
          <meshStandardMaterial color="#cfc9be" metalness={0.2} roughness={0.45} />
        </RoundedBox>
        <mesh position={[0, 0.275, 0.011]}>
          <planeGeometry args={[0.76, 0.475]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

const ROWS = 4;
const COLS = 13;
const KEYS = ROWS * COLS;
const keyColor = new THREE.Color(C.paper);
const pressColor = new THREE.Color(C.signal);

function Keyboard({ typing }: { typing: RefObject<TypingSignal> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const press = useRef(new Float32Array(KEYS));
  const seen = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    if (typing.current.pulses !== seen.current) {
      seen.current = typing.current.pulses;
      press.current[Math.floor(Math.random() * KEYS)] = 1;
    }
    for (let i = 0; i < KEYS; i++) {
      const p = (press.current[i] = Math.max(0, press.current[i] - delta * 5));
      dummy.position.set((i % COLS - (COLS - 1) / 2) * 0.082, 0.052 - p * 0.016, (Math.floor(i / COLS) - (ROWS - 1) / 2) * 0.082);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, color.copy(keyColor).lerp(pressColor, p));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <group position={[-0.12, 0, 0.3]}>
      <RoundedBox args={[1.14, 0.04, 0.38]} radius={0.015} position={[0, 0.02, 0]}>
        <meshStandardMaterial color={C.ink2} />
      </RoundedBox>
      <instancedMesh ref={mesh} args={[undefined, undefined, KEYS]}>
        <boxGeometry args={[0.066, 0.024, 0.066]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

function DeskChair() {
  return (
    <group>
      <RoundedBox args={[0.78, 0.09, 0.72]} radius={0.035} position={[-0.12, -0.82, 1.24]}><meshStandardMaterial color={C.ink} /></RoundedBox>
      <RoundedBox args={[0.72, 0.62, 0.08]} radius={0.035} position={[-0.12, -0.46, 1.64]} rotation={[0.1, 0, 0]}><meshStandardMaterial color={C.ink} /></RoundedBox>
      <RoundedBox args={[0.66, 0.09, 0.6]} radius={0.045} position={[-0.12, -0.735, 1.22]}><meshStandardMaterial color="#e8dcc8" roughness={0.9} /></RoundedBox>
      {/* round cushion that lifts Latte to keyboard height */}
      <mesh position={[-0.12, -0.625, 1.12]}><cylinderGeometry args={[0.3, 0.32, 0.13, 32]} /><meshStandardMaterial color="#f3b58a" roughness={0.9} /></mesh>
      <mesh position={[-0.12, -1.07, 1.24]}><cylinderGeometry args={[0.04, 0.04, 0.42, 12]} /><meshStandardMaterial color={C.ink2} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} position={[-0.12, -1.28, 1.24]} rotation={[0, a, 0]}>
            <mesh position={[0.2, 0, 0]}><boxGeometry args={[0.4, 0.04, 0.06]} /><meshStandardMaterial color={C.ink2} /></mesh>
            <mesh position={[0.38, -0.04, 0]}><sphereGeometry args={[0.04, 12, 12]} /><meshStandardMaterial color={C.ink} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

// Every 10s Latte turns round to check on you (head yaw is in her own frame; she faces the monitor).
const GLANCE = { yaw: -2.1, roll: 0.22, period: 10, at: 6.2, hold: 2.6 };
// Desk Latte: chubby enough to fill the chair, bigger head and eyes for the hero shot.
const DESK_LATTE = { bodyWidth: 1.25, belly: 1.18, headScale: 1.12, eyeScale: 1.0, legThickness: 1.15 };

function DeskProps() {
  return (
    <group>
      {/* desk */}
      <RoundedBox args={[3.5, 0.08, 1.55]} radius={0.03} position={[0, -0.04, 0]}><meshStandardMaterial color={C.desk} roughness={0.8} /></RoundedBox>
      {[[-1.62, -0.66], [1.62, -0.66], [-1.62, 0.66], [1.62, 0.66]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -0.72, z]}><cylinderGeometry args={[0.035, 0.035, 1.28, 12]} /><meshStandardMaterial color={C.ink} /></mesh>
      ))}

      {/* mouse + pad */}
      <mesh position={[0.62, 0.004, 0.36]}><boxGeometry args={[0.42, 0.008, 0.34]} /><meshStandardMaterial color={C.ink2} /></mesh>
      <mesh position={[0.64, 0.03, 0.38]} scale={[0.055, 0.028, 0.085]}><sphereGeometry args={[1, 20, 20]} /><meshStandardMaterial color={C.paper} /></mesh>

      {/* coffee */}
      <group position={[-0.95, 0, 0.42]}>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.09, 0.08, 0.2, 24]} /><meshStandardMaterial color={C.paper} /></mesh>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.092, 0.09, 0.035, 24]} /><meshStandardMaterial color={C.signal} /></mesh>
        <mesh position={[0, 0.198, 0]}><cylinderGeometry args={[0.078, 0.078, 0.006, 24]} /><meshStandardMaterial color="#4a2c1a" /></mesh>
        <mesh position={[-0.1, 0.1, 0]}><torusGeometry args={[0.05, 0.015, 8, 20]} /><meshStandardMaterial color={C.paper} /></mesh>
      </group>

      {/* books: the knowledge stack */}
      <group position={[-1.3, 0, 0.02]}>
        {[[C.electric, 0.06], [C.signal, -0.08], [C.green, 0.12], [C.ink, -0.03]].map(([color, r], i) => (
          <RoundedBox key={i} args={[0.56 - i * 0.03, 0.07, 0.38]} radius={0.012} position={[0, 0.036 + i * 0.072, 0]} rotation={[0, r as number, 0]}>
            <meshStandardMaterial color={color as string} roughness={0.7} />
          </RoundedBox>
        ))}
      </group>

      {/* plant */}
      <group position={[1.45, 0, -0.55]}>
        <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.13, 0.1, 0.22, 20]} /><meshStandardMaterial color={C.pot} roughness={0.8} /></mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.07, 0.36 + (i % 2) * 0.06, Math.sin(a) * 0.07]} rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]} scale={[0.07, 0.2, 0.035]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color={i % 2 ? C.green : "#0f8a6b"} roughness={0.7} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

const CHIPS: { text: string; position: [number, number, number]; color: string }[] = [
  { text: "</>", position: [-1.45, 1.85, -0.4], color: "#c2410c" },
  { text: "{ }", position: [1.35, 1.95, -0.6], color: C.electric },
  { text: "=>", position: [1.85, 0.95, 0.5], color: C.ink },
  { text: "SELECT *", position: [-1.95, 0.7, 0.2], color: "#0f7a5f" },
  { text: "git push", position: [0.3, 2.15, -0.7], color: C.ink },
  { text: "async", position: [-0.85, 2.3, -0.8], color: C.electric },
];

// Pill label drawn to a canvas so it lives inside WebGL (no DOM overlay per chip).
function Chip({ text, color, position }: { text: string; color: string; position: [number, number, number] }) {
  const { texture, paint } = useCanvasTexture(320, 96);
  useEffect(() => {
    const draw = (ctx: CanvasRenderingContext2D) => {
      const { width: w, height: h } = ctx.canvas;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `600 40px ${monoFont()}`;
      const pill = Math.min(w - 8, ctx.measureText(text).width + 56);
      ctx.beginPath();
      ctx.roundRect((w - pill) / 2, 12, pill, h - 24, (h - 24) / 2);
      ctx.fillStyle = "#fffdf9";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2 + 2);
    };
    paint(draw);
    document.fonts?.ready.then(() => paint(draw));
  }, [text, color, paint]);
  return (
    <sprite position={position} scale={[0.7, 0.21, 1]}>
      <spriteMaterial map={texture} transparent toneMapped={false} />
    </sprite>
  );
}

function FloatingChips() {
  return (
    <>
      {CHIPS.map((chip, i) => (
        <Float key={chip.text} speed={1.4 + i * 0.15} floatIntensity={0.8} rotationIntensity={0}>
          <Chip {...chip} />
        </Float>
      ))}
      <Float speed={2} floatIntensity={1.2} rotationIntensity={1.5}>
        <mesh position={[1.9, 1.75, 0.2]}><octahedronGeometry args={[0.12]} /><meshStandardMaterial color={C.signal} /></mesh>
      </Float>
      <Float speed={1.6} floatIntensity={1} rotationIntensity={1.2}>
        <mesh position={[-2.05, 1.5, -0.3]}><torusGeometry args={[0.1, 0.035, 12, 24]} /><meshStandardMaterial color={C.electric} /></mesh>
      </Float>
      <Float speed={1.8} floatIntensity={1} rotationIntensity={1.6}>
        <mesh position={[0.95, 2.6, -0.3]}><boxGeometry args={[0.13, 0.13, 0.13]} /><meshStandardMaterial color={C.amber} /></mesh>
      </Float>
    </>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const typing = useRef<TypingSignal>({ pulses: 0, active: true });
  const onType = useCallback((active: boolean, keystroke: boolean) => {
    typing.current.active = active;
    if (keystroke) typing.current.pulses += 1;
  }, []);
  useFrame((state, delta) => {
    if (!group.current) return;
    const target = state.pointer.x * 0.14 + Math.sin(state.clock.elapsedTime * 0.25) * 0.05;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 3, delta);
  });

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      <DeskProps />
      <Monitor onType={onType} />
      <Laptop />
      <Keyboard typing={typing} />
      <DeskChair />
      <LatteModel pose="typing" expression="curious" tuning={DESK_LATTE} typing={typing} glance={GLANCE} position={[-0.12, -0.56, 1.0]} rotation={[0, Math.PI, 0]} scale={1.15} />
      <FloatingChips />
      <ContactShadows position={[0, -1.33, 0.3]} scale={7} blur={2.6} far={3} opacity={0.32} />
    </group>
  );
}

export default function DevDeskScene3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  // Stop rendering once the hero scrolls away.
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="knowledge-scene dev-scene" role="img" aria-label="ภาพสามมิติของ Latte แมวส้มครีม กำลังเขียนโค้ดหน้าจอคอมพิวเตอร์">
      <Canvas dpr={[1, 1.75]} frameloop={inView ? "always" : "never"} camera={{ position: [3.3, 2.0, 4.5], fov: 42 }}>
        <ambientLight intensity={1.35} />
        <directionalLight position={[4, 7, 5]} intensity={2.1} />
        <directionalLight position={[-5, 3, -4]} intensity={0.55} color="#c9d4ff" />
        <pointLight position={[0, 1, 0.3]} intensity={1.4} distance={3} color="#9db2ff" />
        <Scene />
        <OrbitControls target={[0, 0.15, 0]} enableZoom={false} enablePan={false} minAzimuthAngle={0.1} maxAzimuthAngle={1.2} minPolarAngle={Math.PI * 0.28} maxPolarAngle={Math.PI * 0.48} />
      </Canvas>
    </div>
  );
}
