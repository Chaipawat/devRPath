"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";
import { facing } from "./latteRig";

const Z = new THREE.Vector3(0, 0, 1);

/** Gold bell with its slot, hanging from a small ring. Swings a little with the head. */
export function LatteBell({ position, quaternion }: { position: THREE.Vector3; quaternion: THREE.Quaternion }) {
  const { materials: m, rig } = useLatte();
  const bell = useRef<THREE.Group>(null);
  useFrame(() => {
    if (bell.current) bell.current.rotation.z = Math.sin(rig.current.time * 3) * 0.06 + rig.current.headRoll * 0.4;
  });
  return (
    <group position={position} quaternion={quaternion}>
      <group ref={bell}>
        <mesh position={[0, 0.012, 0]} rotation={[0, Math.PI / 2, 0]} material={m.bell}><torusGeometry args={[0.009, 0.003, 6, 16]} /></mesh>
        <mesh position={[0, -0.028, 0]} material={m.bell}><sphereGeometry args={[0.032, 24, 18]} /></mesh>
        <mesh position={[0, -0.042, 0.027]} material={m.bellSlot}><boxGeometry args={[0.005, 0.022, 0.008]} /></mesh>
        <mesh position={[0, -0.03, 0.028]} material={m.bellSlot}><sphereGeometry args={[0.005, 8, 6]} /></mesh>
      </group>
    </group>
  );
}

/** Orange band round the neck, perpendicular to the neck axis, bell at the front. */
export function LatteCollar() {
  const { materials: m, dims, skeleton, pose } = useLatte();
  const layout = useMemo(() => {
    const axis = skeleton.head.clone().sub(skeleton.neck).normalize();
    const center = skeleton.neck.clone().lerp(skeleton.head, pose.collarAt ?? 0.24);
    const radius = dims.neck.r;
    // "front" = forward-and-down, flattened onto the collar plane
    const front = new THREE.Vector3(0, -0.3, 1).addScaledVector(axis, -new THREE.Vector3(0, -0.3, 1).dot(axis)).normalize();
    return {
      center,
      radius,
      quaternion: new THREE.Quaternion().setFromUnitVectors(Z, axis),
      bell: center.clone().addScaledVector(front, radius + 0.012),
      bellQuat: facing(front, axis),
    };
  }, [skeleton, dims, pose]);

  return (
    <>
      <mesh position={layout.center} quaternion={layout.quaternion} scale={[1, 1, 1.8]} material={m.collar}>
        <torusGeometry args={[layout.radius, 0.02, 12, 48]} />
      </mesh>
      <LatteBell position={layout.bell} quaternion={layout.bellQuat} />
    </>
  );
}
