"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";

/**
 * A chain of joints, each rotated by the pose's curl plus a travelling sway wave, so the tail bends
 * along its length like a real one. Every third segment is striped → soft tabby rings.
 */
export function LatteTail() {
  const { materials: m, dims, pose, skeleton, rig } = useLatte();
  const joints = useRef<(THREE.Group | null)[]>([]);
  const { segments, length, rBase, rTip } = dims.tail;
  const seg = length / segments;
  const { base, curl, sway } = pose.tail;

  useFrame(() => {
    const t = rig.current.time;
    joints.current.forEach((joint, i) => {
      if (!joint) return;
      const [x, y, z] = i === 0 ? base : curl;
      // amplitude grows toward the tip; phase lags so the wave travels outward
      const wave = Math.sin(t * 2.1 - i * 0.5) * (0.3 + i / segments);
      joint.rotation.set(x + sway[0] * wave, y + sway[1] * wave, z + sway[2] * wave);
    });
  });

  let chain: ReactNode = (
    <mesh position={[0, seg, 0]} scale={rTip * 1.05} material={m.coat}><sphereGeometry args={[1, 14, 10]} /></mesh>
  );
  for (let i = segments - 1; i >= 0; i--) {
    const r = THREE.MathUtils.lerp(rBase, rTip, i / (segments - 1));
    chain = (
      <group ref={(el) => { joints.current[i] = el; }} position={i === 0 ? undefined : [0, seg, 0]}>
        <mesh position={[0, seg / 2, 0]} scale={[r, seg / 2 + r * 1.1, r]} material={i % 3 === 1 ? m.tailStripe : m.tailPlain}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
        {chain}
      </group>
    );
  }

  return <group position={skeleton.tailBase}>{chain}</group>;
}
