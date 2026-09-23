import type { LatteExpression, LatteExpressionName, LattePose, LattePoseName, LatteTuning } from "./types";

/**
 * Likeness knobs. Nudge these first when Latte doesn't look like Latte;
 * poses are authored against the defaults, so keep big changes (>±15%) modest.
 */
export const LATTE_TUNING: LatteTuning = {
  headScale: 1.02,
  earScale: 1.1,
  eyeScale: 0.92,
  muzzleScale: 1.06,
  bodyLength: 1.12,
  bodyWidth: 0.94,
  belly: 1,
  legLength: 1,
  legThickness: 1,
  tailLength: 1.08,
  stripeStrength: 0.55,
};

export const LATTE_EXPRESSIONS: Record<LatteExpressionName, LatteExpression> = {
  // calm, observant, a touch sleepy — the default Latte face
  curious: { lidOpen: 0.9, lidTilt: 0.02, pupilWidth: 1, earSpread: 0.22, earBack: 0 },
  grumpy: { lidOpen: 0.58, lidTilt: 0.24, pupilWidth: 0.75, earSpread: 0.42, earBack: 0.22 },
  relaxed: { lidOpen: 0.04, lidTilt: -0.08, pupilWidth: 0.6, earSpread: 0.34, earBack: 0.1 },
};

const HALF_PI = Math.PI / 2;

// Coordinates: y up, facing +z, origin on the floor. Limb x is "outward from the midline".
export const LATTE_POSES: Record<LattePoseName, LattePose> = {
  sit: {
    root: { position: [0, 0, 0], rotation: [0, 0, 0] },
    torso: { position: [0, 0.35, -0.06], rotation: [-1.05, 0, 0] },
    head: { offset: [0, 0.17, 0.07], rotation: [-0.04, 0, 0] },
    frontLegs: { right: { paw: [0.08, 0.035, 0.25], bend: [0, 0, -1] } },
    backLegs: { right: { hock: [0.15, 0.04, -0.2], paw: [0.125, 0.03, 0.08], bend: [0, 0.4, 1] } },
    tail: { base: [-1.5, 0, -0.5], curl: [0.02, 0, -0.24], sway: [0, 0, 0.04] },
    expression: "curious",
  },
  stand: {
    root: { position: [0, 0, 0], rotation: [0, 0, 0] },
    torso: { position: [0, 0.6, 0.02], rotation: [-0.06, 0, 0] },
    head: { offset: [0, 0.15, 0.1], rotation: [-0.15, 0, 0] },
    frontLegs: { right: { paw: [0.09, 0.035, 0.3], bend: [0, 0, -1] } },
    backLegs: { right: { hock: [0.1, 0.14, -0.3], paw: [0.1, 0.035, -0.22], bend: [0, 0, 1] } },
    tail: { base: [-0.35, 0, 0], curl: [0.14, 0, 0], sway: [0, 0, 0.06] },
    expression: "curious",
  },
  // Lying on the left side: a stretched-out layout rolled 90° by root.
  side: {
    root: { position: [0, 0.2, 0], rotation: [0, 0, HALF_PI] },
    torso: { position: [0, 0, 0], rotation: [0, 0, 0] },
    head: { offset: [0.1, 0.03, 0.12], rotation: [0, 0, -1.2] },
    frontLegs: {
      right: { paw: [0, -0.26, 0.5], bend: [0, -0.5, -1] },
      left: { paw: [0.1, -0.3, 0.42], bend: [0, -0.5, -1] },
    },
    backLegs: {
      right: { hock: [0.02, -0.33, -0.36], paw: [0.02, -0.42, -0.27], bend: [0, -0.5, 1] },
      left: { hock: [0.12, -0.3, -0.4], paw: [0.12, -0.4, -0.32], bend: [0, -0.5, 1] },
    },
    tail: { base: [-HALF_PI, 0, 0.6], curl: [0.08, 0, -0.05], sway: [0.05, 0, 0] },
    expression: "relaxed",
  },
  // On its back, tipped a little to one side, paws folded up.
  belly: {
    root: { position: [0, 0.21, 0], rotation: [0, 0, Math.PI - 0.4] },
    torso: { position: [0, 0, 0], rotation: [0, 0, 0] },
    head: { offset: [-0.05, -0.13, 0.13], rotation: [0, 0, -1.9] },
    frontLegs: {
      right: { paw: [0.1, -0.3, 0.32], bend: [0, -1, -0.5] },
      left: { paw: [0.12, -0.28, 0.36], bend: [0, -1, -0.5] },
    },
    backLegs: { right: { hock: [0.16, -0.32, -0.2], paw: [0.14, -0.42, -0.1], bend: [0, -0.6, 1] } },
    tail: { base: [-1.3, 0, 0.3], curl: [0.12, 0, 0], sway: [0.08, 0, 0] },
    expression: "curious",
  },
  // Paws tucked, chin level, unimpressed.
  loaf: {
    root: { position: [0, 0, 0], rotation: [0, 0, 0] },
    torso: { position: [0, 0.2, 0], rotation: [0, 0, 0], scale: [1.08, 0.95, 0.92] },
    head: { offset: [0, 0.1, 0.1], rotation: [0.08, 0, 0] },
    frontLegs: { right: { paw: [0.045, 0.035, 0.27], bend: [0, 1, -0.3] } },
    backLegs: { right: { hock: [0.14, 0.04, -0.3], paw: [0.13, 0.03, -0.12], bend: [0, 0.3, 1] } },
    tail: { base: [-1.5, 0, -0.5], curl: [-0.05, 0, -0.26], sway: [0, 0, 0.03] },
    expression: "grumpy",
  },
  // Upright on the desk chair, reaching the keyboard (tuned for DevDeskScene3D's placement).
  typing: {
    root: { position: [0, 0, 0], rotation: [0, 0, 0] },
    torso: { position: [0, 0.4, -0.02], rotation: [-1.2, 0, 0] },
    head: { offset: [0, 0.16, 0.1], rotation: [-0.25, 0, 0] },
    // Latte sits on a cushion (scene y -0.56) so her shoulders clear the desk top; paws rest just above
    // the key tops (scene y 0.064) and elbows bend outward, never down into the desk.
    frontLegs: { right: { paw: [0.1, 0.588, 0.56], bend: [1, 0.3, -0.3] } },
    backLegs: { right: { hock: [0.15, 0.04, -0.15], paw: [0.13, 0.03, 0.12], bend: [0, 0.4, 1] } },
    tail: { base: [-1.5, 0, -0.5], curl: [0.02, 0, -0.2], sway: [0.02, 0, 0.07] },
    expression: "grumpy",
    collarAt: 0.02,
    typing: true,
  },
};
