"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";
import { placeSegment, sideVec, solveTwoBone } from "./latteRig";
import type { LatteMaterials } from "./LatteMaterials";

/** Oval paw with three toe bumps at the front. Shared with the back legs. */
export function LattePaw({ size, length = 1.35, pawRef, material }: { size: number; length?: number; pawRef: RefObject<THREE.Group | null>; material: LatteMaterials["cream"] }) {
  return (
    <group ref={pawRef}>
      <mesh scale={[size * 1.1, size * 0.72, size * length]} material={material}><sphereGeometry args={[1, 20, 14]} /></mesh>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * size * 0.5, -size * 0.12, size * (length - 0.18 - Math.abs(i) * 0.12)]} scale={size * 0.42} material={material}>
          <sphereGeometry args={[1, 12, 10]} />
        </mesh>
      ))}
    </group>
  );
}

function FrontLeg({ side }: { side: 1 | -1 }) {
  const { materials: m, dims, pose, skeleton, rig } = useLatte();
  const upper = useRef<THREE.Mesh>(null);
  const lower = useRef<THREE.Mesh>(null);
  const paw = useRef<THREE.Group>(null);
  const limb = (side < 0 && pose.frontLegs.left) || pose.frontLegs.right;
  const shoulder = skeleton.shoulders[side > 0 ? 0 : 1];
  const work = useMemo(() => ({ target: new THREE.Vector3(), bend: new THREE.Vector3(), elbow: new THREE.Vector3() }), []);
  const { upper: l1, lower: l2, rUpper, rLower, paw: pawSize } = dims.frontLeg;

  useFrame(() => {
    sideVec(limb.paw, side, work.target).y += rig.current.pawLift[side > 0 ? 0 : 1];
    sideVec(limb.bend, side, work.bend);
    solveTwoBone(shoulder, work.target, l1, l2, work.bend, work.elbow);
    placeSegment(upper.current, shoulder, work.elbow, rUpper);
    placeSegment(lower.current, work.elbow, work.target, rLower);
    paw.current?.position.copy(work.target);
  });

  return (
    <>
      <mesh ref={upper} material={m.legUpper}><sphereGeometry args={[1, 20, 14]} /></mesh>
      <mesh ref={lower} material={m.legLower}><sphereGeometry args={[1, 20, 14]} /></mesh>
      <LattePaw size={pawSize} pawRef={paw} material={m.cream} />
    </>
  );
}

/** Shoulder → elbow → paw via two-bone IK; paws bob with rig.pawLift (typing). */
export function LatteFrontLegs() {
  return (
    <>
      <FrontLeg side={1} />
      <FrontLeg side={-1} />
    </>
  );
}
