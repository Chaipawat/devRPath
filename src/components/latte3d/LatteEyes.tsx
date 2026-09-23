"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useLatte } from "./LatteContext";
import { facing, onHead, zPoleSphere } from "./latteRig";

const EYE_R = 0.04;
/** Both eyes aim at this head-local point, so they converge instead of staring in parallel. */
const GAZE = new THREE.Vector3(0, 0.02, 1.3);
const LID_SHUT = 0.9;
const LID_OPEN = -0.95;

/**
 * One eye, in its own frame (+z out of the head): iris ball, slit pupil, flat catchlights, and two lid
 * caps. The upper lid swings on x (blink / how open) and tilts on z (grumpy brow).
 */
function Eye({ side }: { side: 1 | -1 }) {
  const { materials: m, tuning, expression, rig } = useLatte();
  const r = EYE_R * tuning.eyeScale;
  const upper = useRef<THREE.Mesh>(null);
  const tilt = useRef<THREE.Group>(null);
  const pupil = useRef<THREE.Mesh>(null);

  const layout = useMemo(() => {
    const { point, normal } = onHead(new THREE.Vector3(side * 0.4, 0.14, 0.9));
    const center = point.addScaledVector(normal, -r * 0.48);
    const onBall = (x: number, y: number) => new THREE.Vector3(x, y, Math.sqrt(1 - x * x - y * y)).multiplyScalar(r * 1.01);
    const glint = onBall(-0.32, 0.36);
    const glintSmall = onBall(0.28, -0.26);
    return {
      center,
      look: facing(GAZE.clone().sub(center).normalize()),
      glint,
      glintQuat: facing(glint),
      glintSmall,
      glintSmallQuat: facing(glintSmall),
    };
  }, [side, r]);

  const geometry = useMemo(() => ({
    ball: zPoleSphere(r, 32, 24),
    upperLid: new THREE.SphereGeometry(r * 1.07, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    lowerLid: new THREE.SphereGeometry(r * 1.07, 32, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
  }), [r]);
  useEffect(() => () => Object.values(geometry).forEach((g) => g.dispose()), [geometry]);

  useFrame(() => {
    const state = rig.current;
    const open = THREE.MathUtils.lerp(expression.lidOpen, 1, state.alert) * (1 - state.blink);
    if (upper.current) upper.current.rotation.x = THREE.MathUtils.lerp(LID_SHUT, LID_OPEN, open);
    if (tilt.current) tilt.current.rotation.z = side * expression.lidTilt * (1 - state.alert * 0.7);
    if (pupil.current) pupil.current.scale.x = r * 0.3 * THREE.MathUtils.lerp(expression.pupilWidth, 1.25, state.alert);
  });

  return (
    <group position={layout.center} quaternion={layout.look}>
      <mesh geometry={geometry.ball} material={m.iris} />
      <mesh ref={pupil} position={[0, 0, r * 0.8]} scale={[r * 0.3, r * 0.6, r * 0.22]} material={m.pupil}>
        <sphereGeometry args={[1, 20, 16]} />
      </mesh>
      <mesh position={layout.glint} quaternion={layout.glintQuat} material={m.glint}><circleGeometry args={[r * 0.16, 12]} /></mesh>
      <mesh position={layout.glintSmall} quaternion={layout.glintSmallQuat} material={m.glint}><circleGeometry args={[r * 0.07, 8]} /></mesh>
      <group ref={tilt}>
        <mesh ref={upper} geometry={geometry.upperLid} material={m.lid}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.lidRim}><torusGeometry args={[r * 1.07, r * 0.05, 8, 24, Math.PI]} /></mesh>
        </mesh>
      </group>
      <mesh geometry={geometry.lowerLid} rotation={[LID_SHUT, 0, 0]} material={m.lid}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.lidRim}><torusGeometry args={[r * 1.07, r * 0.04, 8, 24, Math.PI]} /></mesh>
      </mesh>
    </group>
  );
}

export function LatteEyes() {
  return (
    <>
      <Eye side={1} />
      <Eye side={-1} />
    </>
  );
}
