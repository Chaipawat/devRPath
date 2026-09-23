import type { RefObject } from "react";
import type * as THREE from "three";

export type Vec3 = [number, number, number];

export type LattePoseName = "sit" | "stand" | "side" | "belly" | "loaf" | "typing";
export type LatteExpressionName = "curious" | "grumpy" | "relaxed";

/** Proportion multipliers (1 = base anatomy). The knobs to chase likeness with. */
export type LatteTuning = {
  headScale: number;
  earScale: number;
  eyeScale: number;
  muzzleScale: number;
  bodyLength: number;
  bodyWidth: number;
  /** Size of the belly/rump lobe: >1 = a chubbier, pear-shaped cat. */
  belly: number;
  legLength: number;
  legThickness: number;
  tailLength: number;
  /** 0 = plain coat, 1 = strong tabby stripes. */
  stripeStrength: number;
};

/** Paw target + the direction the middle joint should bend towards (both in model space). */
export type LimbTarget = { paw: Vec3; bend: Vec3 };
export type HindLimbTarget = { hock: Vec3; paw: Vec3; bend: Vec3 };

/** Per-side limb data. x is measured outward from the midline, so one value works for both sides. */
export type Sided<T> = { right: T; left?: T };

/**
 * A pose, in model space: y up, the cat faces +z, origin on the ground under the body.
 * Lying poses keep a standing-style layout and roll the whole body with `root`.
 */
export type LattePose = {
  root: { position: Vec3; rotation: Vec3 };
  torso: { position: Vec3; rotation: Vec3; scale?: Vec3 };
  /** Head centre = neck anchor + offset; rotation is the resting head orientation. */
  head: { offset: Vec3; rotation: Vec3 };
  frontLegs: Sided<LimbTarget>;
  backLegs: Sided<HindLimbTarget>;
  /** base: orientation of the first tail joint; curl: rotation added at every joint; sway: per-joint animation amplitude. */
  tail: { base: Vec3; curl: Vec3; sway: Vec3 };
  expression: LatteExpressionName;
  /** Where the collar sits between neck anchor (0) and head centre (1). Defaults to 0.24. */
  collarAt?: number;
  /** Front paws bob with the typing signal. */
  typing?: boolean;
};

export type LatteExpression = {
  /** 1 = wide open, 0 = shut. */
  lidOpen: number;
  /** Tilts the upper lid down toward the nose (grumpy) or away (soft). */
  lidTilt: number;
  pupilWidth: number;
  earSpread: number;
  earBack: number;
};

/** Mutable per-frame animation state. The model writes it; the parts read it in their own useFrame. */
export type LatteRig = {
  time: number;
  blink: number;
  headYaw: number;
  headPitch: number;
  headRoll: number;
  /** 0..1: how much the cat is paying attention to you (opens the eyes, perks the ears). */
  alert: number;
  earTwitch: number;
  breathe: number;
  pawLift: [right: number, left: number];
};

/** Anchor points on the posed torso, in model space. */
export type LatteSkeleton = {
  neck: THREE.Vector3;
  head: THREE.Vector3;
  shoulders: [THREE.Vector3, THREE.Vector3];
  hips: [THREE.Vector3, THREE.Vector3];
  tailBase: THREE.Vector3;
};

export type TypingSignal = { pulses: number; active: boolean };

/** Every `period` seconds, from `at` for `hold` seconds, the head turns by yaw/roll (e.g. to look at the camera). */
export type LatteGlance = { yaw: number; roll?: number; pitch?: number; period: number; at: number; hold: number };

export type LatteModelProps = {
  pose?: LattePoseName;
  /** Defaults to the pose's own expression. */
  expression?: LatteExpressionName;
  scale?: number;
  tuning?: Partial<LatteTuning>;
  animate?: boolean;
  typing?: RefObject<TypingSignal>;
  glance?: LatteGlance;
  position?: Vec3;
  rotation?: Vec3;
};
