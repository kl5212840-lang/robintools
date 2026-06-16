/**
 * 快速导航索引 — Cmd+K 搜索
 *
 * 默认视图：
 *   固定入口（7条）：5 工具 + 对比 + 笔记入口
 *   最新笔记（3条）：按日期倒序取最新文章，新增文章自动出现
 *
 * 搜索时匹配全部层级：tool / guide / step / article
 * 支持拼音首字母和全拼模糊搜索，如输入 "azzn" 或 "anzhuang" 均可匹配"安装指南"
 */
import { pinyin } from "pinyin-pro";
import { getAllTools, getGuideTypes } from "./content";
import { getAllStepEntries, type StepSearchEntry } from "@/content/guides/registry";
import { getAllArticles } from "@/content/articles";
import { allTroubleshootCards, type TroubleshootCard } from "@/content/troubleshoot-cards";

export interface NavItem {
  title: string;
  subtitle: string;
  href: string;
  keywords: string[];
  level: "tool" | "guide" | "step" | "article" | "troubleshoot";
}

/** 文章摘要截断长度 */
const SUMMARY_MAX = 60;

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

/** 构建完整导航索引 */
export function getNavIndex(): NavItem[] {
  const tools = getAllTools();
  const guideTypes = getGuideTypes();
  const items: NavItem[] = [];

  // 工具首页（level=tool）— 默认显示
  for (const tool of tools) {
    if (tool.status !== "ready") continue;
    items.push({
      title: tool.name,
      subtitle: tool.description,
      href: `/${tool.id}`,
      keywords: [tool.name, tool.nameZh, ...tool.platforms],
      level: "tool",
    });
  }

  // 独立页面（level=tool）
  items.push({
    title: "工具对比",
    subtitle: "多维度对比主流 AI 编程工具",
    href: "/compare",
    keywords: ["对比", "比较", "选择"],
    level: "tool",
  });
  items.push({
    title: "技术笔记",
    subtitle: "AI 编程工具的使用记录与配置参考",
    href: "/articles",
    keywords: ["笔记", "文章", "教程", "配置"],
    level: "tool",
  });

  // 工具指南（level=guide）— 搜索时匹配
  for (const tool of tools) {
    if (tool.status !== "ready") continue;
    const available = (tool as { availableGuides?: string[] }).availableGuides;
    const guides = available
      ? guideTypes.filter((g) => available.includes(g.id))
      : guideTypes;

    for (const guide of guides) {
      const typeInfo = guideTypes.find((g) => g.id === guide.id) || guide;
      items.push({
        title: `${tool.name} — ${typeInfo.nameZh}`,
        subtitle: tool.description,
        href: `/${tool.id}/${guide.id}`,
        keywords: [tool.name, tool.nameZh, typeInfo.nameZh, typeInfo.name],
        level: "guide",
      });
    }
  }

  // 实战文章（level=article）— 全文搜索，默认视图只取最新 3 篇
  const articles = getAllArticles();
  for (const a of articles) {
    items.push({
      title: a.title,
      subtitle: truncate(a.summary, SUMMARY_MAX),
      href: `/articles/${a.slug}`,
      keywords: a.tags,
      level: "article",
    });
  }

  // 步骤级索引（level=step）— 搜索时匹配
  const stepEntries: StepSearchEntry[] = getAllStepEntries();
  for (const s of stepEntries) {
    const extraKeywords = s.searchText ? s.searchText.split(/\s+/) : [];
    items.push({
      title: `${s.toolName} — ${s.stepLabel}`,
      subtitle: s.guideName,
      href: `/${s.toolId}/${s.guideType}#${s.anchorId}`,
      keywords: [s.stepLabel, s.guideName, s.toolName, ...extraKeywords],
      level: "step",
    });
  }

  // 报错速查（level=troubleshoot）— 搜索时匹配
  for (const card of allTroubleshootCards) {
    const extraKeywords = card.searchText ? card.searchText.split(/\s+/) : [];
    items.push({
      title: `${card.toolName} — ${card.title}`,
      subtitle: card.desc,
      href: `/${card.toolId}/troubleshoot#${card.id}`,
      keywords: [card.toolName, card.title, card.desc, ...extraKeywords],
      level: "troubleshoot",
    });
  }

  return items;
}

/** 归一化文本：去空格/符号/大小写，让 "VS Code" 匹配 "vscode" */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\-_\.\/\(\)\[\]\{\}#@!:,]+/g, "");
}

/**
 * 生成文本的拼音搜索索引。
 * 同时产出全拼和首字母，均去空格，用户输入"anzhuang"或"az"均可匹配"安装"。
 * pinyin-pro 只在构建时运行（getNavIndex 在 SSG 阶段调用），浏览器端无运行时开销。
 */
function pinyinIndex(text: string): string {
  try {
    const full = pinyin(text, { toneType: "none", type: "array" }).join("");
    const initials = pinyin(text, { pattern: "first", toneType: "none", type: "array" }).join("");
    return [full, initials].join(" ");
  } catch {
    return "";
  }
}

/** 构建条目的全文可搜索串（含拼音） */
function searchableText(item: NavItem): string {
  const base = normalize([item.title, item.subtitle, ...item.keywords].join(" "));
  const py = pinyinIndex([item.title, item.subtitle, ...item.keywords].join(" "));
  return [base, py].join(" ");
}

/** 默认视图显示的最新文章数 */
const DEFAULT_ARTICLE_COUNT = 3;

/** 过滤导航项 */
export function filterNav(query: string, items: NavItem[]): NavItem[] {
  if (!query.trim()) {
    // 默认视图：固定入口 + 最新 N 篇文章
    const tools = items.filter((item) => item.level === "tool");
    const latest = items.filter((item) => item.level === "article").slice(0, DEFAULT_ARTICLE_COUNT);
    return [...tools, ...latest];
  }
  const q = normalize(query);
  if (!q) return [];
  // 有搜索词时在所有层级中匹配
  return items.filter((item) => searchableText(item).includes(q));
}
