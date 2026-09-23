"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";
import { LattePaw } from "./LatteFrontLegs";
import { placeSegment, sideVec, solveTwoBone } from "./latteRig";

/** Hip → knee → hock (IK) → paw. The thigh segment is thick so it reads as the haunch when sitting. */
function HindLeg({ side }: { side: 1 | -1 }) {
  const { materials: m, dims, pose, skeleton } = useLatte();
  const thigh = useRef<THREE.Mesh>(null);
  const shin = useRef<THREE.Mesh>(null);
  const foot = useRef<THREE.Mesh>(null);
  const paw = useRef<THREE.Group>(null);
  const limb = (side < 0 && pose.backLegs.left) || pose.backLegs.right;
  const hip = skeleton.hips[side > 0 ? 0 : 1];
  const work = useMemo(() => ({ hock: new THREE.Vector3(), paw: new THREE.Vector3(), bend: new THREE.Vector3(), knee: new THREE.Vector3() }), []);
  const { femur, tibia, rThigh, rShin, rFoot, paw: pawSize } = dims.backLeg;

  // Static per pose today; kept in useFrame so hind-leg animation (walk, kick) can slot in later.
  useFrame(() => {
    sideVec(limb.hock, side, work.hock);
    sideVec(limb.paw, side, work.paw);
    sideVec(limb.bend, side, work.bend);
    solveTwoBone(hip, work.hock, femur, tibia, work.bend, work.knee);
    placeSegment(thigh.current, hip, work.knee, rThigh, 0.8);
    placeSegment(shin.current, work.knee, work.hock, rShin);
    placeSegment(foot.current, work.hock, work.paw, rFoot);
    paw.current?.position.copy(work.paw);
  });

  return (
    <>
      <mesh ref={thigh} material={m.legUpper}><sphereGeometry args={[1, 24, 16]} /></mesh>
      <mesh ref={shin} material={m.legUpper}><sphereGeometry args={[1, 16, 12]} /></mesh>
      <mesh ref={foot} material={m.legLower}><sphereGeometry args={[1, 16, 12]} /></mesh>
      <LattePaw size={pawSize} length={1.45} pawRef={paw} material={m.cream} />
    </>
  );
}

export function LatteBackLegs() {
  return (
    <>
      <HindLeg side={1} />
      <HindLeg side={-1} />
    </>
  );
}
