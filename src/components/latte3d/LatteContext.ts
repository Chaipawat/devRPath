import { createContext, useContext, type RefObject } from "react";
import type { LatteDims } from "./latteRig";
import type { LatteMaterials } from "./LatteMaterials";
import type { LatteExpression, LattePose, LatteRig, LatteSkeleton, LatteTuning } from "./types";

export type LatteContextValue = {
  pose: LattePose;
  expression: LatteExpression;
  tuning: LatteTuning;
  dims: LatteDims;
  skeleton: LatteSkeleton;
  materials: LatteMaterials;
  rig: RefObject<LatteRig>;
};

export const LatteContext = createContext<LatteContextValue | null>(null);

export function useLatte() {
  const value = useContext(LatteContext);
  if (!value) throw new Error("Latte parts must be rendered inside <LatteModel>");
  return value;
}
