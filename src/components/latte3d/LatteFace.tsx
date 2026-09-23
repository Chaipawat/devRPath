"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";
import { UP } from "./latteRig";

/** Muzzle, nose, mouth, cheeks and whiskers, in head-local space (facing +z). */
export function LatteFace() {
  const { materials: m, tuning } = useLatte();
  const k = tuning.muzzleScale;
  // a bigger muzzle also pushes forward, so it doesn't just swell into the cheeks
  const fwd = (k - 1) * 0.05;

  const whiskers = useMemo(() => [1, -1].flatMap((side) => [0.14, 0.02, -0.1].map((rise, i) => {
    const length = 0.21 - i * 0.02;
    const dir = new THREE.Vector3(side, rise, -0.32).normalize();
    const start = new THREE.Vector3(side * 0.045 * k, -0.072 + i * 0.008, 0.195 + fwd);
    return {
      key: `${side}${i}`,
      length,
      position: start.addScaledVector(dir, length / 2),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir),
    };
  })), [k, fwd]);

  return (
    <group>
      {/* soft cheek fluff, mostly sunk into the head, so the lower face isn't a perfect ball */}
      {[1, -1].map((s) => (
        <mesh key={`cheek${s}`} position={[s * 0.078, -0.064, 0.05]} scale={[0.088, 0.068, 0.08]} material={m.cheek}>
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
      ))}
      {/* nose bridge: a gentle slope from brow to nose in profile */}
      <mesh position={[0, -0.006, 0.154]} scale={[0.03, 0.048, 0.034]} material={m.coatLight}><sphereGeometry args={[1, 20, 14]} /></mesh>
      {/* whisker pads + chin: the noticeable muzzle */}
      {[1, -1].map((s) => (
        <mesh key={`pad${s}`} position={[s * 0.031 * k, -0.068, fwd + 0.168]} scale={[0.046 * k, 0.037 * k, 0.04 * k]} material={m.cream}>
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
      ))}
      <mesh position={[0, -0.104, fwd + 0.146]} scale={[0.038 * k, 0.024 * k, 0.034 * k]} material={m.cream}><sphereGeometry args={[1, 20, 14]} /></mesh>
      <mesh position={[0, -0.034, fwd + 0.198]} rotation={[-0.35, 0, 0]} scale={[0.023 * k, 0.014 * k, 0.015 * k]} material={m.nose}>
        <sphereGeometry args={[1, 20, 14]} />
      </mesh>
      {/* philtrum + a faint "w" mouth line under the pads */}
      <mesh position={[0, -0.057, fwd + 0.205]} material={m.mouth}><boxGeometry args={[0.0024, 0.024, 0.003]} /></mesh>
      {[1, -1].map((s) => (
        <mesh key={`lip${s}`} position={[s * 0.015, -0.074, fwd + 0.203]} rotation={[0, 0, Math.PI + s * 0.35]} material={m.mouth}>
          <torusGeometry args={[0.014, 0.0016, 6, 14, Math.PI * 0.7]} />
        </mesh>
      ))}
      {whiskers.map(({ key, length, position, quaternion }) => (
        <mesh key={key} position={position} quaternion={quaternion} material={m.whisker}>
          <cylinderGeometry args={[0.0011, 0.0022, length, 4]} />
        </mesh>
      ))}
    </group>
  );
}
