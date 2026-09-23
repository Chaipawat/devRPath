"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const C = {
  ink: "#16140f", ink2: "#2a2722", paper: "#fbfaf7", paper2: "#e6e1d7", desk: "#e9e1d2",
  signal: "#ff5a1f", electric: "#2f5bff", green: "#12a37f", amber: "#e0a100",
  pot: "#c8694a",
};

type Typing = { pulses: number; active: boolean };
type Seg = [text: string, color: string];

const K = "#ff8a5c", S = "#7fd1a8", F = "#8fa8ff", N = "#e8c060", P = "#f6f4ef", M = "#8f8a80";
const CODE: Seg[][] = [
  [["// devpath.ts — pair-coding with Mochi =^.^=", M]],
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
  [["$ ", S], ["mochi review --meow", P]],
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

function Keyboard({ typing }: { typing: RefObject<Typing> }) {
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

const UP = new THREE.Vector3(0, 1, 0);
const tmp = new THREE.Vector3();

// Stretch a unit cylinder so it runs from a to b.
function placeLimb(mesh: THREE.Mesh | null, a: THREE.Vector3, b: THREE.Vector3) {
  if (!mesh) return;
  tmp.copy(b).sub(a);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.scale.set(1, tmp.length(), 1);
  mesh.quaternion.setFromUnitVectors(UP, tmp.normalize());
}

// ───────── Mochi: cream-orange tabby with an AI backpack ─────────
const FUR = { light: "#f6dcb4", base: "#efc38a", mid: "#e2a765", dark: "#cf8645", cream: "#fbeedd", pink: "#f2a3a8", nose: "#ee9a9f" };
const PACK = { shell: "#a9b8dc", face: "#c9d3ec", dark: "#6f7fa8", glow: "#62f3ff" };

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// Painted fur: soft tabby bands + thousands of tiny strands so the sheen reads as fluff.
function furCanvas(kind: "body" | "head" | "tail") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const { width: w, height: h } = canvas;
  const rand = seeded(kind === "body" ? 3 : kind === "head" ? 17 : 29);
  ctx.fillStyle = FUR.base;
  ctx.fillRect(0, 0, w, h);

  // Lighter chest / muzzle facing the desk (u ≈ .75 on a three.js sphere).
  if (kind !== "tail") {
    const chest = ctx.createRadialGradient(w * 0.75, h * (kind === "head" ? 0.72 : 0.62), 10, w * 0.75, h * 0.6, w * 0.22);
    chest.addColorStop(0, FUR.cream);
    chest.addColorStop(1, "#fbeedd00");
    ctx.fillStyle = chest;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.lineCap = "round";
  if (kind === "tail") {
    for (let x = 30; x < w; x += 58) {
      ctx.strokeStyle = FUR.dark + "80";
      ctx.lineWidth = 24;
      ctx.filter = "blur(4px)";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 8, h);
      ctx.stroke();
    }
    ctx.filter = "none";
  } else {
    const bands = kind === "head" ? 5 : 8;
    for (let i = 0; i < bands; i++) {
      const y = (kind === "head" ? 18 : 40) + i * (kind === "head" ? 18 : 22);
      ctx.strokeStyle = (i % 2 ? FUR.mid : FUR.dark) + "66";
      ctx.lineWidth = 9 + rand() * 7;
      ctx.filter = "blur(3px)";
      // Stripes fade out over the chest so the front stays creamy.
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const u = x / w;
        const chestFade = Math.abs(u - 0.75) < 0.12;
        const yy = y + Math.sin(u * Math.PI * 10 + i) * 6;
        if (chestFade) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
      ctx.filter = "none";
    }
    if (kind === "head") {
      // the classic tabby "M" on the forehead
      ctx.strokeStyle = FUR.dark + "a6";
      ctx.lineWidth = 6;
      [-26, -10, 10, 26].forEach((dx) => {
        ctx.beginPath();
        ctx.moveTo(w * 0.75 + dx, 60);
        ctx.lineTo(w * 0.75 + dx * 0.6, 96);
        ctx.stroke();
      });
    }
  }

  for (let i = 0; i < 9000; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const light = rand() > 0.5;
    ctx.strokeStyle = light ? "#fff6e633" : "#b8733a26";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rand() - 0.5) * 3, y + 3 + rand() * 4);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function useFur(kind: "body" | "head" | "tail") {
  const texture = useMemo(() => furCanvas(kind), [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function FurMaterial({ map, color = "#ffffff" }: { map?: THREE.Texture; color?: string }) {
  return <meshPhysicalMaterial map={map} color={color} roughness={0.92} sheen={1} sheenRoughness={0.55} sheenColor="#fff1dc" />;
}

function Foreleg({ side, typing, fur }: { side: 1 | -1; typing: RefObject<Typing>; fur: THREE.Texture }) {
  const upper = useRef<THREE.Mesh>(null);
  const fore = useRef<THREE.Mesh>(null);
  const elbowMesh = useRef<THREE.Mesh>(null);
  const paw = useRef<THREE.Mesh>(null);
  const points = useMemo(() => ({
    shoulder: new THREE.Vector3(-0.12 + side * 0.18, 0.08, 0.86),
    elbow: new THREE.Vector3(-0.12 + side * 0.21, 0.01, 0.64),
    rest: new THREE.Vector3(-0.12 + side * 0.15, 0.085, 0.42),
    hand: new THREE.Vector3(),
  }), [side]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const bob = typing.current.active ? Math.max(0, Math.sin(t * 15 + (side > 0 ? 0 : 1.7))) * 0.024 : 0;
    const { shoulder, elbow, rest } = points;
    points.hand.copy(rest).add(tmp.set(Math.sin(t * 2.6 + side) * 0.018, bob, 0));
    placeLimb(upper.current, shoulder, elbow);
    placeLimb(fore.current, elbow, points.hand);
    elbowMesh.current?.position.copy(elbow);
    paw.current?.position.copy(points.hand);
  });

  return (
    <>
      <mesh ref={upper}><cylinderGeometry args={[0.075, 0.068, 1, 16]} /><FurMaterial map={fur} /></mesh>
      <mesh ref={elbowMesh}><sphereGeometry args={[0.07, 16, 16]} /><FurMaterial map={fur} /></mesh>
      <mesh ref={fore}><cylinderGeometry args={[0.064, 0.06, 1, 16]} /><FurMaterial map={fur} /></mesh>
      <mesh ref={paw} scale={[1.15, 0.75, 1.3]}><sphereGeometry args={[0.066, 20, 20]} /><FurMaterial color={FUR.cream} /></mesh>
    </>
  );
}

// Eye built from layered discs: green-gold iris, tall pupil, two catchlights.
function Eye({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 0.128, 0.035, -0.262]} rotation={[0.08, Math.PI - side * 0.4, 0]}>
      <mesh><circleGeometry args={[0.07, 32]} /><meshStandardMaterial color="#2a2418" roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.062, 32]} /><meshStandardMaterial color="#c9c46a" emissive="#6b7a2a" emissiveIntensity={0.25} roughness={0.25} /></mesh>
      <mesh position={[0, 0, 0.004]} scale={[0.62, 1, 1]}><circleGeometry args={[0.045, 32]} /><meshStandardMaterial color="#15130e" roughness={0.2} /></mesh>
      <mesh position={[-0.02, 0.022, 0.006]}><circleGeometry args={[0.014, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <mesh position={[0.018, -0.02, 0.006]}><circleGeometry args={[0.006, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>
    </group>
  );
}

function MochiHead() {
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const ears = useRef<(THREE.Group | null)[]>([]);
  const fur = useFur("head");

  useFrame(({ clock }, delta) => {
    if (!head.current || !eyes.current) return;
    const t = clock.elapsedTime;
    // Every 10s Mochi turns round to check on you, then goes back to "work".
    const phase = t % 10;
    const lookBack = phase > 6.2 && phase < 8.8;
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, lookBack ? -2.1 : Math.sin(t * 0.6) * 0.16, 4, delta);
    head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, lookBack ? 0.22 : Math.sin(t * 1.2) * 0.05, 4, delta);
    head.current.rotation.x = -0.12 + Math.sin(t * 3.8) * 0.018;
    const facingYou = Math.abs(head.current.rotation.y) > 1.5;
    // Slow blink; a content half-squint while looking at you.
    const blink = t % 3.6 < 0.14 ? 0.08 : facingYou ? 1.12 : 1;
    eyes.current.scale.y = THREE.MathUtils.damp(eyes.current.scale.y, blink, 18, delta);
    eyes.current.scale.x = THREE.MathUtils.damp(eyes.current.scale.x, facingYou ? 1.1 : 1, 8, delta);
    ears.current.forEach((ear, i) => {
      if (ear) ear.rotation.z = (i ? -1 : 1) * 0.32 + (facingYou ? Math.sin(t * 18 + i) * 0.12 : 0);
    });
  });

  return (
    <group ref={head} position={[-0.12, 0.46, 0.99]} scale={1.16}>
      <mesh scale={[1.14, 0.94, 1]}><sphereGeometry args={[0.3, 48, 48]} /><FurMaterial map={fur} /></mesh>
      {/* chubby cheeks + muzzle */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.07, -0.085, -0.235]} scale={[1, 0.8, 0.8]}><sphereGeometry args={[0.085, 24, 24]} /><FurMaterial color={FUR.cream} /></mesh>
      ))}
      <mesh position={[0, -0.13, -0.225]} scale={[1, 0.7, 0.8]}><sphereGeometry args={[0.055, 20, 20]} /><FurMaterial color={FUR.cream} /></mesh>
      <mesh position={[0, -0.045, -0.3]} scale={[1.3, 0.85, 0.8]}><sphereGeometry args={[0.024, 16, 16]} /><meshStandardMaterial color={FUR.nose} roughness={0.35} /></mesh>
      {/* whiskers */}
      {[-1, 1].flatMap((s) => [-0.02, 0, 0.02].map((dy, i) => (
        <mesh key={`${s}${i}`} position={[s * 0.2, -0.07 + dy, -0.22]} rotation={[0, s * 0.35, Math.PI / 2 + s * (dy * 6)]}>
          <cylinderGeometry args={[0.0022, 0.001, 0.2, 4]} />
          <meshBasicMaterial color="#fffaf2" />
        </mesh>
      )))}
      <group ref={eyes}>
        <Eye side={-1} />
        <Eye side={1} />
      </group>
      {/* ears: rounded shorthair ears with pink inside */}
      {[-1, 1].map((s, i) => (
        <group key={s} ref={(el) => { ears.current[i] = el; }} position={[s * 0.19, 0.22, 0.01]} rotation={[-0.15, 0, s * -0.32]}>
          <mesh scale={[1, 1, 0.55]}><coneGeometry args={[0.125, 0.21, 24]} /><FurMaterial color={FUR.base} /></mesh>
          <mesh position={[0, -0.015, -0.04]} scale={[0.7, 0.8, 0.3]}><coneGeometry args={[0.125, 0.21, 24]} /><meshStandardMaterial color={FUR.pink} roughness={0.8} /></mesh>
        </group>
      ))}
    </group>
  );
}

function packLabel() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = PACK.face;
  ctx.beginPath();
  ctx.roundRect(0, 0, 256, 320, 70);
  ctx.fill();
  ctx.fillStyle = PACK.dark;
  // cat-head logo
  ctx.beginPath();
  ctx.moveTo(88, 96); ctx.lineTo(96, 52); ctx.lineTo(118, 76); ctx.lineTo(138, 76); ctx.lineTo(160, 52); ctx.lineTo(168, 96);
  ctx.quadraticCurveTo(170, 140, 128, 142); ctx.quadraticCurveTo(86, 140, 88, 96);
  ctx.fill();
  ctx.font = "700 92px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AI", 128, 228);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function AiBackpack() {
  const label = useMemo(() => packLabel(), []);
  const glow = useRef<THREE.MeshStandardMaterial>(null);
  useEffect(() => () => label.dispose(), [label]);
  useFrame(({ clock }) => {
    if (glow.current) glow.current.emissiveIntensity = 1.6 + Math.sin(clock.elapsedTime * 2.2) * 0.7;
  });
  return (
    <group position={[-0.12, -0.16, 1.5]} rotation={[-0.12, 0, 0]} scale={1.12}>
      <RoundedBox args={[0.3, 0.36, 0.15]} radius={0.07} smoothness={5}><meshPhysicalMaterial color={PACK.shell} roughness={0.35} clearcoat={0.6} /></RoundedBox>
      <mesh position={[0, 0, 0.077]}><planeGeometry args={[0.22, 0.28]} /><meshStandardMaterial map={label} transparent roughness={0.4} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.152, 0, 0.02]}><boxGeometry args={[0.012, 0.22, 0.03]} /><meshStandardMaterial ref={s > 0 ? glow : undefined} color={PACK.glow} emissive={PACK.glow} emissiveIntensity={1.8} /></mesh>
      ))}
      {/* straps over the shoulders */}
      {[-1, 1].map((s) => (
        <mesh key={`strap${s}`} position={[s * 0.1, 0.2, -0.08]} rotation={[0.9, 0, 0]}><boxGeometry args={[0.04, 0.22, 0.015]} /><meshStandardMaterial color={PACK.dark} /></mesh>
      ))}
    </group>
  );
}

function StripedTail() {
  const tail = useRef<THREE.Group>(null);
  const fur = useFur("tail");
  const { geometry, tip } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.2, -0.04, 0.12), new THREE.Vector3(0.36, 0.12, 0.18),
      new THREE.Vector3(0.42, 0.38, 0.12), new THREE.Vector3(0.34, 0.54, 0.04),
    ]);
    return { geometry: new THREE.TubeGeometry(curve, 64, 0.058, 16), tip: curve.getPoint(1) };
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ clock }) => {
    if (!tail.current) return;
    const t = clock.elapsedTime;
    tail.current.rotation.y = Math.sin(t * 1.6) * 0.28;
    tail.current.rotation.z = Math.sin(t * 1.6 + 1) * 0.08;
  });
  return (
    <group ref={tail} position={[0.1, -0.6, 1.36]}>
      <mesh geometry={geometry}><FurMaterial map={fur} /></mesh>
      <mesh position={tip}><sphereGeometry args={[0.062, 20, 20]} /><FurMaterial color={FUR.mid} /></mesh>
    </group>
  );
}

function Mochi({ typing }: { typing: RefObject<Typing> }) {
  const bodyFur = useFur("body");
  return (
    <group>
      {/* chair + cushion */}
      <RoundedBox args={[0.78, 0.09, 0.72]} radius={0.035} position={[-0.12, -0.82, 1.24]}><meshStandardMaterial color={C.ink} /></RoundedBox>
      <RoundedBox args={[0.72, 0.62, 0.08]} radius={0.035} position={[-0.12, -0.46, 1.64]} rotation={[0.1, 0, 0]}><meshStandardMaterial color={C.ink} /></RoundedBox>
      <RoundedBox args={[0.66, 0.09, 0.6]} radius={0.045} position={[-0.12, -0.735, 1.22]}><meshStandardMaterial color="#e8dcc8" roughness={0.9} /></RoundedBox>
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

      {/* round, loaf-ish body + haunches */}
      <mesh position={[-0.12, -0.3, 1.1]} rotation={[-0.14, 0, 0]} scale={[0.4, 0.47, 0.4]}>
        <sphereGeometry args={[1, 48, 48]} />
        <FurMaterial map={bodyFur} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.12 + s * 0.25, -0.6, 1.12]} scale={[0.18, 0.15, 0.27]}><sphereGeometry args={[1, 24, 24]} /><FurMaterial map={bodyFur} /></mesh>
      ))}
      {/* collar + bell */}
      <mesh position={[-0.12, 0.16, 1.02]} rotation={[Math.PI / 2 - 0.25, 0, 0]}><torusGeometry args={[0.22, 0.03, 12, 40]} /><meshStandardMaterial color="#e0782f" roughness={0.55} /></mesh>
      <group position={[-0.12, 0.09, 0.8]}>
        <mesh><sphereGeometry args={[0.045, 24, 24]} /><meshStandardMaterial color="#e3b33c" metalness={0.85} roughness={0.22} /></mesh>
        <mesh position={[0, -0.022, -0.036]}><boxGeometry args={[0.006, 0.03, 0.01]} /><meshStandardMaterial color="#3a2a10" /></mesh>
      </group>
      <Foreleg side={-1} typing={typing} fur={bodyFur} />
      <Foreleg side={1} typing={typing} fur={bodyFur} />
      <MochiHead />
      <AiBackpack />
      <StripedTail />
    </group>
  );
}

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
  const typing = useRef<Typing>({ pulses: 0, active: true });
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
      <Mochi typing={typing} />
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
    <div ref={ref} className="knowledge-scene dev-scene" role="img" aria-label="ภาพสามมิติของ Mochi แมวส้มสะพายเป้ AI กำลังเขียนโค้ดหน้าจอคอมพิวเตอร์">
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
