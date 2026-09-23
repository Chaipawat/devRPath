"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LatteBackLegs } from "./LatteBackLegs";
import { LatteCollar } from "./LatteCollar";
import { LatteContext, type LatteContextValue } from "./LatteContext";
import { LatteFrontLegs } from "./LatteFrontLegs";
import { LatteHead } from "./LatteHead";
import { useLatteMaterials } from "./LatteMaterials";
import { LATTE_EXPRESSIONS, LATTE_POSES, LATTE_TUNING } from "./LattePosePresets";
import { buildSkeleton, latteDims } from "./latteRig";
import { LatteTail } from "./LatteTail";
import { LatteNeck, LatteTorso } from "./LatteTorso";
import type { LatteModelProps, LatteRig } from "./types";

const damp = THREE.MathUtils.damp;

/** Blink roughly every 3.7s, with an occasional double blink. */
function blinkAt(t: number) {
  const cycle = t % 3.7;
  const pulse = (start: number) => (cycle > start && cycle < start + 0.16 ? Math.sin(((cycle - start) / 0.16) * Math.PI) : 0);
  return Math.max(pulse(0), Math.floor(t / 3.7) % 3 === 2 ? pulse(0.3) : 0);
}

/**
 * Latte, the real-life cream tabby, as a modular rig: pick a pose preset and an expression, tweak
 * proportions via `tuning` (see LATTE_TUNING). Faces +z with the origin on the floor under the body.
 */
export function LatteModel({ pose: poseName = "sit", expression: expressionName, scale = 1, tuning: tuningOverrides, animate = true, typing, glance, position, rotation }: LatteModelProps) {
  const pose = LATTE_POSES[poseName];
  const expression = LATTE_EXPRESSIONS[expressionName ?? pose.expression];
  const tuningKey = JSON.stringify(tuningOverrides ?? {});
  // Keyed on the serialised overrides so an inline `tuning={{...}}` doesn't rebuild the rig every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tuning = useMemo(() => ({ ...LATTE_TUNING, ...tuningOverrides }), [tuningKey]);
  const materials = useLatteMaterials(tuning.stripeStrength);
  const rig = useRef<LatteRig>({ time: 0, blink: 0, headYaw: 0, headPitch: 0, headRoll: 0, alert: 0, earTwitch: 0, breathe: 0, pawLift: [0, 0] });

  const value = useMemo<LatteContextValue>(() => {
    const dims = latteDims(tuning);
    return { pose, expression, tuning, dims, skeleton: buildSkeleton(pose, dims), materials, rig };
  }, [pose, expression, tuning, materials]);

  useFrame(({ clock }, delta) => {
    const r = rig.current;
    if (!animate) return;
    const t = (r.time = clock.elapsedTime);
    const dt = Math.min(delta, 0.1);

    let yaw = Math.sin(t * 0.6) * 0.1;
    let pitch = Math.sin(t * 0.9) * 0.025;
    let roll = Math.sin(t * 0.45) * 0.04;
    let alert = 0;
    if (glance && (t % glance.period) > glance.at && (t % glance.period) < glance.at + glance.hold) {
      yaw = glance.yaw;
      pitch = glance.pitch ?? 0;
      roll = glance.roll ?? 0;
      alert = 1;
    }
    r.headYaw = damp(r.headYaw, yaw, 4, dt);
    r.headPitch = damp(r.headPitch, pitch, 4, dt);
    r.headRoll = damp(r.headRoll, roll, 4, dt);
    r.alert = damp(r.alert, alert, 5, dt);
    r.blink = blinkAt(t);
    // ears flick while she's watching you, and now and then on their own
    r.earTwitch = r.alert > 0.5 || t % 5.3 < 0.25 ? Math.sin(t * 20) * 0.12 : 0;
    r.breathe = Math.sin(t * 2.2);

    const typingNow = pose.typing && (typing?.current.active ?? true) && r.alert < 0.5;
    r.pawLift[0] = typingNow ? Math.max(0, Math.sin(t * 15)) * 0.03 : 0;
    r.pawLift[1] = typingNow ? Math.max(0, Math.sin(t * 15 + 1.7)) * 0.03 : 0;
  });

  return (
    <LatteContext.Provider value={value}>
      <group position={position} rotation={rotation} scale={scale}>
        <group position={pose.root.position} rotation={pose.root.rotation}>
          <LatteTorso />
          <LatteNeck />
          <LatteCollar />
          <LatteHead />
          <LatteFrontLegs />
          <LatteBackLegs />
          <LatteTail />
        </group>
      </group>
    </LatteContext.Provider>
  );
}
