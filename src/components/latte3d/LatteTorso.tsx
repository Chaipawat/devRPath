"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";
import { placeSegment, zPoleSphere } from "./latteRig";

/**
 * One long body ellipsoid (local +z = forward) with chest and hip lobes just breaking its surface, plus a cream bib.
 * The lobes give a leaner house-cat silhouette instead of one plush ball.
 */
export function LatteTorso() {
  const { materials: m, dims, pose, tuning, rig } = useLatte();
  const torso = useRef<THREE.Group>(null);
  const geometry = useMemo(() => zPoleSphere(1, 40, 28), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const { w, h, l } = dims.torso;
  const belly = tuning.belly;
  const [sx, sy, sz] = pose.torso.scale ?? [1, 1, 1];

  useFrame(() => {
    const breath = 1 + rig.current.breathe * 0.012;
    torso.current?.scale.set(sx * breath, sy * breath, sz);
  });

  return (
    <group ref={torso} position={pose.torso.position} rotation={pose.torso.rotation}>
      {/* the middle grows with the belly too, so a chubby Latte stays one smooth pear, not stacked rolls */}
      <mesh geometry={geometry} position={[0, -h * (belly - 1) * 0.15, -l * (belly - 1) * 0.2]} scale={[w * (1 + (belly - 1) * 0.8), h * (1 + (belly - 1) * 0.5), l]} material={m.body} />
      <mesh geometry={geometry} position={[0, h * 0.06, l * 0.5]} scale={[w * 0.95, h * 0.95, l * 0.46]} material={m.body} />
      <mesh geometry={geometry} position={[0, -h * (belly - 1) * 0.3, -l * 0.48]} scale={[w * 1.03 * belly, h * 0.97 * belly, l * 0.5 * belly]} material={m.body} />
      <mesh geometry={geometry} position={[0, -h * 0.15, l * 0.82]} scale={[w * 0.62, h * 0.72, l * 0.24]} material={m.cream} />
    </group>
  );
}

/** Neck from the torso's neck anchor up into the head. */
export function LatteNeck() {
  const { materials: m, dims, skeleton } = useLatte();
  const neck = useRef<THREE.Mesh>(null);
  useEffect(() => {
    placeSegment(neck.current, skeleton.neck, skeleton.neck.clone().lerp(skeleton.head, 0.7), dims.neck.r, 0.6);
  }, [skeleton, dims]);
  return <mesh ref={neck} material={m.coat}><sphereGeometry args={[1, 24, 16]} /></mesh>;
}
