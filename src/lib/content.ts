import { ToolsRegistry, ToolMeta, GuideType } from "./types";
import toolsData from "@/content/tools.json";

export function getToolsRegistry(): ToolsRegistry {
  return toolsData as ToolsRegistry;
}

export function getTool(id: string): ToolMeta | undefined {
  return (toolsData as ToolsRegistry).tools.find((t) => t.id === id);
}

export function getAllTools(): ToolMeta[] {
  return (toolsData as ToolsRegistry).tools;
}

export function getReadyTools(): ToolMeta[] {
  return (toolsData as ToolsRegistry).tools.filter((t) => t.status === "ready");
}

export function getGuideTypes(): GuideType[] {
  return (toolsData as ToolsRegistry).guideTypes;
}

export function getAvailableGuideTypes(toolId: string): GuideType[] {
  const tool = getTool(toolId);
  if (!tool) return [];
  const available = (tool as { availableGuides?: string[] }).availableGuides;
  if (!available || available.length === 0) return getGuideTypes();
  return getGuideTypes().filter((g) => available.includes(g.id));
}

export function getDifficultyLabel(level: number): string {
  switch (level) {
    case 1:
      return "简单";
    case 2:
      return "中等";
    case 3:
      return "困难";
    default:
      return "未知";
  }
}

export function getDifficultyStars(level: number): string {
  return "●".repeat(level) + "○".repeat(3 - level);
}

/** 工具 accent 颜色 — tools.json color 字段 → HSL 值，新增颜色只需在此加一行 */
export const accentColors: Record<string, string> = {
  blue:    "hsl(218,80%,58%)",
  emerald: "hsl(160,70%,48%)",
  purple:  "hsl(265,75%,60%)",
  amber:   "hsl(42,96%,60%)",
  cyan:    "hsl(190,80%,48%)",
  violet:  "hsl(270,70%,60%)",
  teal:    "hsl(172,70%,42%)",
};

