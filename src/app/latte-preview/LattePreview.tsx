"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { LatteModel } from "@/components/latte3d/LatteModel";
import type { LatteExpressionName, LattePoseName } from "@/components/latte3d/types";

const POSES: LattePoseName[] = ["sit", "stand", "side", "belly", "loaf", "typing"];

function Stage({ pose, expression, face, yaw }: { pose: LattePoseName; expression?: LatteExpressionName; face?: boolean; yaw: number }) {
  const r = face ? 0.9 : 2.6;
  const target: [number, number, number] = face ? [0, pose === "stand" ? 0.85 : 0.9, 0.1] : [0, 0.45, 0];
  const camera: [number, number, number] = [Math.sin(yaw) * r, target[1] + (face ? 0.05 : 0.5), Math.cos(yaw) * r];
  return (
    <Canvas camera={{ position: camera, fov: face ? 30 : 34 }} dpr={1.5}>
      <color attach="background" args={["#f4f1ea"]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[4, 7, 5]} intensity={2.1} />
      <directionalLight position={[-5, 3, -4]} intensity={0.55} color="#c9d4ff" />
      <LatteModel pose={pose} expression={expression} />
      <ContactShadows position={[0, 0, 0]} scale={4} blur={2.4} far={2} opacity={0.35} />
      <OrbitControls target={target} />
    </Canvas>
  );
}

export default function LattePreview() {
  // client-only page (ssr: false), so reading the URL during render is safe
  const params = new URLSearchParams(window.location.search);
  const pose = params.get("pose") as LattePoseName | null;
  const expression = (params.get("expr") as LatteExpressionName | null) ?? undefined;
  const yaw = Number(params.get("yaw") ?? 0.6);
  const face = params.has("face");
  if (pose) return <div style={{ width: "100vw", height: "100vh" }}><Stage pose={pose} expression={expression} face={face} yaw={yaw} /></div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, background: "#ddd" }}>
      {POSES.map((p) => (
        <div key={p} style={{ height: "48vh", position: "relative" }}>
          <Stage pose={p} expression={expression} face={face} yaw={yaw} />
          <span style={{ position: "absolute", left: 8, top: 6, font: "12px monospace" }}>{p}</span>
        </div>
      ))}
    </div>
  );
}
