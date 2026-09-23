"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { LatteEars } from "./LatteEars";
import { LatteEyes } from "./LatteEyes";
import { LatteFace } from "./LatteFace";
import { useLatte } from "./LatteContext";
import { HEAD_AXES } from "./latteRig";

/** Cranium + face + eyes + ears. Resting orientation comes from the pose; the rig adds turn/tilt on top. */
export function LatteHead() {
  const { materials: m, tuning, skeleton, pose, rig } = useLatte();
  const head = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!head.current) return;
    const [x, y, z] = pose.head.rotation;
    const { headPitch, headYaw, headRoll } = rig.current;
    // Yaw first so a big turn (glancing back) doesn't skew the pitch.
    head.current.rotation.set(x + headPitch, y + headYaw, z + headRoll, "YXZ");
  });

  return (
    <group ref={head} position={skeleton.head}>
      <group scale={tuning.headScale}>
        <mesh scale={HEAD_AXES} material={m.head}><sphereGeometry args={[1, 48, 32]} /></mesh>
        <LatteFace />
        <LatteEyes />
        <LatteEars />
      </group>
    </group>
  );
}
