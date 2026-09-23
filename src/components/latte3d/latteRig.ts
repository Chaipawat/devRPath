import * as THREE from "three";
import type { LattePose, LatteSkeleton, LatteTuning, Vec3 } from "./types";

/** Base anatomy at tuning = 1. Units match the desk scene (the monitor is ~2 wide). */
export function latteDims(tuning: LatteTuning) {
  const leg = tuning.legLength;
  const thick = tuning.legThickness;
  return {
    torso: { w: 0.2 * tuning.bodyWidth, h: 0.22 * tuning.bodyWidth, l: 0.36 * tuning.bodyLength },
    frontLeg: { upper: 0.245 * leg, lower: 0.245 * leg, rUpper: 0.058 * thick, rLower: 0.05 * thick, paw: 0.05 * thick },
    backLeg: { femur: 0.24 * leg, tibia: 0.24 * leg, rThigh: 0.105 * thick, rShin: 0.05 * thick, rFoot: 0.038 * thick, paw: 0.053 * thick },
    tail: { segments: 12, length: 0.6 * tuning.tailLength, rBase: 0.05 * thick, rTip: 0.036 * thick },
    neck: { r: 0.12 * tuning.bodyWidth },
    belly: tuning.belly,
  };
}
export type LatteDims = ReturnType<typeof latteDims>;

export const UP = new THREE.Vector3(0, 1, 0);
const ORIGIN = new THREE.Vector3();
const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();

export const v3 = (v: Vec3) => new THREE.Vector3(v[0], v[1], v[2]);

/** Limb data uses "outward" x; flip it for the left side. */
export const sideVec = (v: Vec3, side: 1 | -1, out = new THREE.Vector3()) => out.set(v[0] * side, v[1], v[2]);

/** Rotation whose +z points along dir while +y stays as close to up as possible (no random roll). */
export function facing(dir: THREE.Vector3, up = UP) {
  const m = new THREE.Matrix4().lookAt(dir, ORIGIN, up);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

/** Stretch a unit sphere into an ellipsoid "bone" running from a to b, overlapping its joints a little. */
export function placeSegment(mesh: THREE.Object3D | null, a: THREE.Vector3, b: THREE.Vector3, radius: number, overlap = 0.6) {
  if (!mesh) return;
  tmp.copy(b).sub(a);
  const length = tmp.length();
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.scale.set(radius, length / 2 + radius * overlap, radius);
  mesh.quaternion.setFromUnitVectors(UP, tmp.normalize());
}

/** Two-bone IK: where the middle joint sits so root→mid→end reaches target, bending toward `bend`. */
export function solveTwoBone(root: THREE.Vector3, target: THREE.Vector3, l1: number, l2: number, bend: THREE.Vector3, out: THREE.Vector3) {
  tmp.copy(target).sub(root);
  const d = THREE.MathUtils.clamp(tmp.length(), Math.abs(l1 - l2) + 1e-4, (l1 + l2) * 0.999);
  const axis = tmp.normalize();
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  tmp2.copy(bend).addScaledVector(axis, -bend.dot(axis));
  if (tmp2.lengthSq() < 1e-8) tmp2.set(0, 0, -1);
  tmp2.normalize();
  return out.copy(root).addScaledVector(axis, a).addScaledVector(tmp2, h);
}

/** Posed torso → anchor points the legs, neck and tail hang off. */
export function buildSkeleton(pose: LattePose, dims: LatteDims): LatteSkeleton {
  const { w, h, l } = dims.torso;
  const [sx, sy, sz] = pose.torso.scale ?? [1, 1, 1];
  const matrix = new THREE.Matrix4().compose(
    v3(pose.torso.position),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...pose.torso.rotation)),
    new THREE.Vector3(1, 1, 1),
  );
  const at = (x: number, y: number, z: number) => new THREE.Vector3(x * w * sx, y * h * sy, z * l * sz).applyMatrix4(matrix);
  const neck = at(0, 0.5, 0.9);
  return {
    neck,
    head: neck.clone().add(v3(pose.head.offset)),
    shoulders: [at(0.6, -0.55, 0.62), at(-0.6, -0.55, 0.62)],
    // hips ride on the rump lobe, so a bigger belly pushes the haunches outward
    hips: [at(0.62 * dims.belly, -0.2, -0.55), at(-0.62 * dims.belly, -0.2, -0.55)],
    tailBase: at(0, 0.25, -0.98),
  };
}

/**
 * Head parts are authored against this cranium (head-local, facing +z) and the whole head group is
 * scaled by tuning.headScale, so eyes/ears/muzzle stay glued to it at any size.
 */
export const HEAD_R = 0.19;
export const HEAD_AXES = new THREE.Vector3(1.02, 0.93, 0.98).multiplyScalar(HEAD_R);

/** Point on the cranium surface in direction dir, plus the surface normal there. */
export function onHead(dir: THREE.Vector3) {
  const d = dir.clone().normalize();
  const k = 1 / Math.sqrt((d.x / HEAD_AXES.x) ** 2 + (d.y / HEAD_AXES.y) ** 2 + (d.z / HEAD_AXES.z) ** 2);
  const point = d.multiplyScalar(k);
  const normal = new THREE.Vector3(point.x / HEAD_AXES.x ** 2, point.y / HEAD_AXES.y ** 2, point.z / HEAD_AXES.z ** 2).normalize();
  return { point, normal };
}

/** Unit sphere with its poles on ±z, so a texture's rows wrap around the long axis like tabby bands. */
export function zPoleSphere(radius = 1, width = 40, height = 28) {
  return new THREE.SphereGeometry(radius, width, height).rotateX(Math.PI / 2);
}
