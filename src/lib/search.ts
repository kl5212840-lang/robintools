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
  /** 用于 snippet 生成的纯文本正文（不参与搜索索引） */
  searchContent?: string;
  /** filterNav 时填充，匹配关键词的上下文片段 */
  snippet?: string;
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
      searchContent: tool.description,
    });
  }

  // 独立页面（level=tool）
  items.push({
    title: "工具对比",
    subtitle: "多维度对比主流 AI 编程工具",
    href: "/compare",
    keywords: ["对比", "比较", "选择"],
    level: "tool",
    searchContent: "多维度对比 Claude Code、Codex CLI、Cursor、GitHub Copilot 等主流 AI 编程工具的功能、价格与适用场景",
  });
  items.push({
    title: "技术笔记",
    subtitle: "AI 编程工具的使用记录与配置参考",
    href: "/articles",
    keywords: ["笔记", "文章", "教程", "配置"],
    level: "tool",
    searchContent: "AI 编程工具的使用记录与配置参考——安装教程、MCP 排错、终端美化、Token 优化等实战笔记",
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
        searchContent: typeInfo.description || tool.description,
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
      searchContent: a.summary,
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
      searchContent: s.searchText,
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
      searchContent: card.searchText,
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

/**
 * 根据原始查询词在条目 searchContent 中生成上下文片段。
 * 仅在 searchContent 存在原始查询词、且匹配位置不在 subtitle 已展示的头部区域时生成。
 */
function generateSnippet(query: string, content?: string, subtitle?: string): string | undefined {
  if (!content || content.length < 20) return undefined;
  const rawQuery = query.trim();
  if (!rawQuery) return undefined;

  const idx = content.toLowerCase().indexOf(rawQuery.toLowerCase());
  if (idx === -1) return undefined;

  // 跳过已被 subtitle 覆盖的头部区域（subtitle 通常展示前 60 字左右）
  const HEAD_COVERED = 60;
  if (subtitle && idx < HEAD_COVERED && content.startsWith(subtitle.replace(/…$/, "").slice(0, HEAD_COVERED))) {
    return undefined;
  }

  const SNIPPET_RADIUS = 35;
  const start = Math.max(0, idx - SNIPPET_RADIUS);
  const end = Math.min(content.length, idx + rawQuery.length + SNIPPET_RADIUS);

  let s = content.slice(start, end);
  if (start > 0) s = "…" + s;
  if (end < content.length) s = s + "…";
  return s;
}

/** 默认视图显示的最新文章数 */
const DEFAULT_ARTICLE_COUNT = 3;

/** 结果层级排序权重：越小越靠前 */
const LEVEL_PRIORITY: Record<NavItem["level"], number> = {
  article:      0,  // 文章标题匹配，最精准
  troubleshoot: 1,  // 报错卡 desc 匹配
  guide:        2,  // 指南
  step:         3,  // 步骤
  tool:         4,  // 工具描述匹配，最泛
};

/** 过滤导航项 */
export function filterNav(query: string, items: NavItem[]): NavItem[] {
  if (!query.trim()) {
    const tools = items.filter((item) => item.level === "tool");
    const latest = items.filter((item) => item.level === "article").slice(0, DEFAULT_ARTICLE_COUNT);
    return [...tools, ...latest];
  }
  const q = normalize(query);
  if (!q) return [];

  let matched = items
    .filter((item) => searchableText(item).includes(q))
    .sort((a, b) => LEVEL_PRIORITY[a.level] - LEVEL_PRIORITY[b.level]);

  // 去重：tool 级已匹配的工具，跳过其 guide 级条目（避免同一段 tool.description 重复展示）
  const matchedToolRoots = new Set(
    matched.filter((i) => i.level === "tool").map((i) => i.href)
  );
  matched = matched.filter((item) => {
    if (item.level !== "guide") return true;
    const toolRoot = item.href.replace(/\/[^/]+$/, ""); // /cline/install → /cline
    return !matchedToolRoots.has(toolRoot);
  });

  return matched.map((item) => ({
    ...item,
    snippet: generateSnippet(query, item.searchContent, item.subtitle),
  }));
}
