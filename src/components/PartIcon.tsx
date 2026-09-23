import type { IconType } from "react-icons";
import {
  SiDocker, SiExpress, SiGit, SiJavascript, SiKubernetes, SiNextdotjs,
  SiNodedotjs, SiPostgresql, SiPython, SiReact, SiSpringboot,
} from "react-icons/si";
import {
  LuActivity, LuBlocks, LuBookOpenCheck, LuBrainCircuit, LuChartNoAxesCombined,
  LuCodeXml, LuDatabase, LuGauge, LuGitCompareArrows, LuKeyRound, LuNetwork,
  LuPanelTop, LuRocket, LuSearchCode, LuServerCog, LuShieldCheck, LuWaypoints,
  LuSquareCode, LuTestTubeDiagonal, LuTimer, LuWorkflow, LuWrench,
} from "react-icons/lu";

const icons: Record<number, IconType> = {
  0: LuWaypoints, 1: LuNetwork, 2: SiJavascript, 3: SiReact, 4: SiNextdotjs,
  5: SiNodedotjs, 6: SiExpress, 7: LuShieldCheck, 8: SiPostgresql,
  9: LuCodeXml, 10: SiSpringboot, 11: SiPython, 12: SiReact,
  13: SiDocker, 14: SiKubernetes, 15: LuRocket, 16: LuServerCog,
  17: LuBlocks, 18: LuTestTubeDiagonal, 19: SiGit, 20: LuSearchCode,
  21: LuBrainCircuit, 22: LuGauge, 23: LuActivity, 24: LuWorkflow,
  25: LuBookOpenCheck, 26: LuPanelTop, 27: LuGitCompareArrows,
  28: LuWaypoints, 29: LuKeyRound, 30: LuTimer,
};

export function PartIcon({ number, className }: { number: number; className?: string }) {
  const Icon = icons[number] ?? LuSquareCode;
  return <Icon className={className} aria-hidden="true" />;
}

export const categoryIcons = [LuNetwork, SiReact, LuDatabase, SiDocker, LuChartNoAxesCombined, LuWrench];
