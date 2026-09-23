import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** Latte's palette, sampled from the reference photos. */
export const LATTE_COLORS = {
  cream: "#f2dcbd",
  coat: "#e7b67d",
  coatLight: "#efcb9c",
  stripe: "#cf8a4c",
  stripeDeep: "#bd763c",
  nose: "#e7a29e",
  mouth: "#c9968a",
  earPink: "#e8b1a9",
  irisInner: "#cfcca3",
  iris: "#a9b59d",
  irisEdge: "#5c6352",
  pupil: "#15130f",
  lidRim: "#8a5c3a",
  collar: "#e0782f",
  bell: "#e3b33c",
  bellSlot: "#3a2a10",
  whisker: "#fffaf2",
} as const;

const C = LATTE_COLORS;

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function canvas2d(width: number, height: number, fill: string) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, width, height);
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Thousands of tiny light/dark strands so the sheen reads as fur instead of plastic.
function strands(ctx: CanvasRenderingContext2D, count: number, rand: () => number) {
  const { width: w, height: h } = ctx.canvas;
  ctx.lineWidth = 1;
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    ctx.strokeStyle = rand() > 0.5 ? "#fff8ea30" : "#b8733a22";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rand() - 0.5) * 3, y + 3 + rand() * 4);
    ctx.stroke();
  }
}

const alpha = (hex: string, a: number) => hex + Math.round(THREE.MathUtils.clamp(a, 0, 1) * 255).toString(16).padStart(2, "0");

/** Head sphere (poles ±y): the face is at u = .25, so canvas x = w/4 is the middle of the face. */
function headTexture(stripes: number) {
  const { canvas, ctx } = canvas2d(512, 256, C.coat);
  const rand = seeded(17);
  const face = 128;

  // warmer crown, creamy lower face and cheeks
  const crown = ctx.createLinearGradient(0, 0, 0, 120);
  crown.addColorStop(0, alpha(C.stripe, 0.35));
  crown.addColorStop(1, alpha(C.stripe, 0));
  ctx.fillStyle = crown;
  ctx.fillRect(0, 0, 512, 120);
  const muzzle = ctx.createRadialGradient(face, 180, 8, face, 170, 120);
  muzzle.addColorStop(0, C.cream);
  muzzle.addColorStop(0.55, alpha(C.cream, 0.8));
  muzzle.addColorStop(1, alpha(C.cream, 0));
  ctx.fillStyle = muzzle;
  ctx.fillRect(0, 60, 512, 196);

  ctx.lineCap = "round";
  ctx.filter = "blur(2px)";
  // the tabby "M": fine lines rising from between the eyes over the crown
  [-26, -13, 0, 13, 26].forEach((dx, i) => {
    ctx.strokeStyle = alpha(C.stripeDeep, Math.min(1, stripes * (i === 2 ? 1.4 : 1.1)));
    ctx.lineWidth = i === 2 ? 5 : 4;
    ctx.beginPath();
    ctx.moveTo(face + dx * 0.6, 92);
    ctx.quadraticCurveTo(face + dx, 60, face + dx * 1.3, 22);
    ctx.stroke();
  });
  // cheek swooshes running back from the outer eye corners
  [-1, 1].forEach((s) => {
    [0, 1].forEach((k) => {
      ctx.strokeStyle = alpha(C.stripe, stripes * 0.7);
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(face + s * 50, 112 + k * 16);
      ctx.quadraticCurveTo(face + s * 70, 108 + k * 18, face + s * 92, 116 + k * 20);
      ctx.stroke();
    });
  });
  // soft bands over the back of the head
  for (let x = face + 110; x < face + 402; x += 30) {
    ctx.strokeStyle = alpha(C.stripe, stripes * 0.45);
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(x, 10);
    ctx.quadraticCurveTo(x + 6, 70, x - 4, 140);
    ctx.stroke();
  }
  ctx.filter = "none";
  strands(ctx, 9000, rand);
  return toTexture(canvas);
}

/**
 * Torso ellipsoid (poles ±z, see zPoleSphere): rows run front → back, the spine is at x = 3w/4, the belly at w/4.
 * Stripes are horizontal bands that wrap round the body and fade out toward the cream belly.
 */
function bodyTexture(stripes: number) {
  const { canvas, ctx } = canvas2d(512, 256, C.coat);
  const rand = seeded(3);

  const bands = document.createElement("canvas");
  bands.width = 512;
  bands.height = 256;
  const b = bands.getContext("2d")!;
  b.filter = "blur(4px)";
  // uneven spacing, width and breaks so it reads as tabby markings, not rings
  let y = 40;
  for (let i = 0; i < 8; i++) {
    y += 18 + rand() * 12;
    b.strokeStyle = alpha(i % 2 ? C.stripe : C.stripeDeep, stripes * 0.6);
    b.lineWidth = 4 + rand() * 5;
    b.setLineDash([60 + rand() * 90, 12 + rand() * 30]);
    b.lineDashOffset = rand() * 100;
    b.beginPath();
    for (let x = 0; x <= 512; x += 8) b.lineTo(x, y + Math.sin((x / 512) * Math.PI * 6 + i * 1.7) * 6);
    b.stroke();
  }
  b.setLineDash([]);
  // mask the bands: strongest along the spine, gone on the belly
  b.filter = "none";
  b.globalCompositeOperation = "destination-in";
  const mask = b.createLinearGradient(0, 0, 512, 0);
  mask.addColorStop(0, "#000000aa");
  mask.addColorStop(0.25, "#00000000");
  mask.addColorStop(0.45, "#000000aa");
  mask.addColorStop(0.75, "#000000ff");
  mask.addColorStop(1, "#000000aa");
  b.fillStyle = mask;
  b.fillRect(0, 0, 512, 256);

  const belly = ctx.createLinearGradient(0, 0, 512, 0);
  belly.addColorStop(0, alpha(C.cream, 0.25));
  belly.addColorStop(0.25, C.cream);
  belly.addColorStop(0.45, alpha(C.cream, 0));
  ctx.fillStyle = belly;
  ctx.fillRect(0, 0, 512, 256);
  ctx.drawImage(bands, 0, 0);
  const spine = ctx.createLinearGradient(0, 0, 512, 0);
  spine.addColorStop(0.62, alpha(C.stripe, 0));
  spine.addColorStop(0.75, alpha(C.stripe, stripes * 0.3));
  spine.addColorStop(0.88, alpha(C.stripe, 0));
  ctx.fillStyle = spine;
  ctx.fillRect(0, 0, 512, 256);
  strands(ctx, 9000, rand);
  return toTexture(canvas);
}

/** Leg/tail segments (poles along the bone; row 0 is the far end). */
function ringTexture(kind: "upper" | "lower" | "tailStripe" | "tailPlain", stripes: number) {
  const { canvas, ctx } = canvas2d(256, 128, C.coat);
  const rand = seeded(kind.length * 7);
  ctx.filter = "blur(3px)";
  if (kind === "upper" || kind === "lower") {
    [38, 70].forEach((y) => {
      ctx.strokeStyle = alpha(C.stripe, stripes * 0.25);
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y + 4);
      ctx.stroke();
    });
  }
  if (kind === "tailStripe") {
    ctx.fillStyle = alpha(C.stripe, stripes * 0.9);
    ctx.fillRect(0, 44, 256, 40);
  }
  ctx.filter = "none";
  if (kind === "lower") {
    // cream "socks" toward the paw
    const sock = ctx.createLinearGradient(0, 0, 0, 60);
    sock.addColorStop(0, C.cream);
    sock.addColorStop(1, alpha(C.cream, 0));
    ctx.fillStyle = sock;
    ctx.fillRect(0, 0, 256, 60);
  }
  strands(ctx, 2600, rand);
  return toTexture(canvas);
}

/** Eyeball (poles ±z): row 0 is the centre of the cornea, so rows are concentric rings and columns radiate. */
function irisTexture() {
  const { canvas, ctx } = canvas2d(256, 128, C.irisEdge);
  const rand = seeded(41);
  const iris = ctx.createLinearGradient(0, 0, 0, 44);
  iris.addColorStop(0, C.irisInner);
  iris.addColorStop(0.35, C.irisInner);
  iris.addColorStop(0.8, C.iris);
  iris.addColorStop(1, C.irisEdge);
  ctx.fillStyle = iris;
  ctx.fillRect(0, 0, 256, 44);
  // radial fibres
  for (let i = 0; i < 180; i++) {
    const x = rand() * 256;
    ctx.strokeStyle = rand() > 0.5 ? "#ffffff22" : "#4d563f2e";
    ctx.lineWidth = 1 + rand();
    ctx.beginPath();
    ctx.moveTo(x, 6 + rand() * 8);
    ctx.lineTo(x + (rand() - 0.5) * 4, 30 + rand() * 12);
    ctx.stroke();
  }
  return toTexture(canvas);
}

export function createLatteMaterials(stripeStrength: number) {
  const fur = (params: THREE.MeshPhysicalMaterialParameters) =>
    new THREE.MeshPhysicalMaterial({ roughness: 0.92, sheen: 0.6, sheenRoughness: 0.5, sheenColor: "#ffe2bf", ...params });
  const s = stripeStrength;
  return {
    head: fur({ map: headTexture(s) }),
    body: fur({ map: bodyTexture(s) }),
    legUpper: fur({ map: ringTexture("upper", s) }),
    legLower: fur({ map: ringTexture("lower", s) }),
    tailStripe: fur({ map: ringTexture("tailStripe", s) }),
    tailPlain: fur({ map: ringTexture("tailPlain", s) }),
    coat: fur({ color: C.coat }),
    coatLight: fur({ color: C.coatLight }),
    lid: fur({ color: "#ecc596" }),
    cheek: fur({ color: "#efd2aa" }),
    cream: fur({ color: C.cream }),
    earInner: new THREE.MeshStandardMaterial({ color: C.earPink, roughness: 0.75 }),
    nose: new THREE.MeshStandardMaterial({ color: C.nose, roughness: 0.35 }),
    mouth: new THREE.MeshBasicMaterial({ color: C.mouth }),
    iris: new THREE.MeshPhysicalMaterial({ map: irisTexture(), roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03 }),
    pupil: new THREE.MeshStandardMaterial({ color: C.pupil, roughness: 0.1 }),
    glint: new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    lidRim: new THREE.MeshStandardMaterial({ color: C.lidRim, roughness: 0.6 }),
    collar: new THREE.MeshStandardMaterial({ color: C.collar, roughness: 0.55 }),
    bell: new THREE.MeshStandardMaterial({ color: C.bell, metalness: 0.45, roughness: 0.28, emissive: "#6b4a00", emissiveIntensity: 0.35 }),
    bellSlot: new THREE.MeshStandardMaterial({ color: C.bellSlot }),
    whisker: new THREE.MeshBasicMaterial({ color: C.whisker, transparent: true, opacity: 0.85 }),
  };
}

export type LatteMaterials = ReturnType<typeof createLatteMaterials>;

export function useLatteMaterials(stripeStrength: number) {
  const materials = useMemo(() => createLatteMaterials(stripeStrength), [stripeStrength]);
  useEffect(() => () => {
    Object.values(materials).forEach((material) => {
      if ("map" in material) material.map?.dispose();
      material.dispose();
    });
  }, [materials]);
  return materials;
}
