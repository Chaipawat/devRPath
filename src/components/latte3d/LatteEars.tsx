"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";

/** Rounded-triangle ear profile (radius, height), spun on a lathe and flattened front-to-back. */
function earGeometry() {
  const profile = [[1, 0], [0.97, 0.25], [0.85, 0.5], [0.62, 0.74], [0.36, 0.9], [0.14, 0.985], [0, 1]];
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 24);
}

function Ear({ side, geometry }: { side: 1 | -1; geometry: THREE.BufferGeometry }) {
  const { materials: m, tuning, expression, rig } = useLatte();
  const ear = useRef<THREE.Group>(null);
  const width = 0.078 * tuning.earScale;
  const height = 0.15 * tuning.earScale;

  useFrame(() => {
    if (!ear.current) return;
    const { alert, earTwitch } = rig.current;
    const back = expression.earBack * (1 - alert);
    ear.current.rotation.set(-0.12 - back, side * (0.35 + back * 0.6), -side * (expression.earSpread * (1 - alert * 0.5) + (side > 0 ? earTwitch : 0)));
  });

  return (
    <group ref={ear} position={[side * 0.1, 0.122, -0.014]}>
      <mesh geometry={geometry} scale={[width, height, width * 0.42]} material={m.coat} />
      <mesh geometry={geometry} position={[0, 0.012, width * 0.3]} scale={[width * 0.7, height * 0.8, width * 0.18]} material={m.earInner} />
    </group>
  );
}

/** Large, alert ears; spread/back come from the expression, twitch from the rig. */
export function LatteEars() {
  const geometry = useMemo(() => earGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <>
      <Ear side={1} geometry={geometry} />
      <Ear side={-1} geometry={geometry} />
    </>
  );
}
