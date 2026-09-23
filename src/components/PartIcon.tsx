import type { IconType } from "react-icons";
import {
  LuActivity, LuAtom, LuBlocks, LuBookOpenCheck, LuBot, LuBraces, LuBrainCircuit, LuChartColumn, LuChartNoAxesCombined,
  LuChartPie, LuCodeXml, LuCoins, LuCompass, LuContainer, LuDatabase, LuDatabaseZap, LuFileSearch, LuMessageSquareText, LuShapes, LuSparkles, LuTable2, LuGauge, LuGitBranch, LuGitCompareArrows, LuHexagon,
  LuKeyRound, LuLayers, LuLeaf, LuNetwork, LuPanelTop, LuRocket, LuRoute, LuSearchCode,
  LuServerCog, LuShieldCheck, LuShipWheel, LuSmartphone, LuSquareCode, LuTerminal,
  LuTestTubeDiagonal, LuTimer, LuWaypoints, LuWorkflow, LuWrench,
} from "react-icons/lu";

// One icon family (Lucide) everywhere, so every row has the same weight and size.
const icons: Record<number, IconType> = {
  0: LuWaypoints, 1: LuNetwork, 2: LuBraces, 3: LuAtom, 4: LuLayers,
  5: LuHexagon, 6: LuRoute, 7: LuShieldCheck, 8: LuDatabase,
  9: LuCodeXml, 10: LuLeaf, 11: LuTerminal, 12: LuSmartphone,
  13: LuContainer, 14: LuShipWheel, 15: LuRocket, 16: LuServerCog,
  17: LuBlocks, 18: LuTestTubeDiagonal, 19: LuGitBranch, 20: LuSearchCode,
  21: LuBrainCircuit, 22: LuGauge, 23: LuActivity, 24: LuWorkflow,
  25: LuBookOpenCheck, 26: LuPanelTop, 27: LuGitCompareArrows,
  28: LuWaypoints, 29: LuKeyRound, 30: LuTimer,
  31: LuTable2, 32: LuDatabaseZap, 33: LuChartColumn, 34: LuShapes,
  35: LuMessageSquareText, 36: LuFileSearch, 37: LuBot, 38: LuCoins, 39: LuCompass,
};

export function PartIcon({ number, className }: { number: number; className?: string }) {
  const Icon = icons[number] ?? LuSquareCode;
  return <Icon className={className} aria-hidden="true" />;
}

// Same order as the TOC sections (see sectionKinds in lib/content.ts).
export const categoryIcons = [LuNetwork, LuAtom, LuDatabase, LuContainer, LuChartNoAxesCombined, LuChartPie, LuSparkles, LuWrench];
