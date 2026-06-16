/**
 * 文章模块 — 独立于工具指南的技术笔记
 * 支持标签关联工具，搜索自动覆盖
 */
import type { ReactElement } from "react";
import { renderDeepSeekGuide } from "./deepseek-guide";
import { renderDomesticModelAccess } from "./domestic-model-access";
import { renderMCPHookSkillAdvanced } from "./mcp-hook-skill-advanced";
import { renderSearchResearchFileProcessing } from "./search-research-file-processing";
import { renderMCPDeepDive } from "./mcp-deep-dive";
import { renderCursorRulesClaudeMd } from "./cursor-rules-claude-md";
import { renderCodebaseContextPrimer } from "./codebase-context-primer";
import { renderAiPairWorkflow } from "./ai-pair-workflow";
import { renderAiSecurityCompliance } from "./ai-security-compliance";
import { renderMCPConfigPitfallGuide } from "./mcp-config-pitfall-guide";
import { renderSearxngDocReviewWorkflow } from "./searxng-doc-review-workflow";
import { renderTokenOptimization } from "./token-optimization";
import { renderStarshipTerminalSetup } from "./starship-terminal-setup";
import { renderClaudeHUDSetup } from "./claude-hud-setup";
import { renderSuperpowersWorkflow } from "./superpowers-workflow";

export interface Article {
  slug: string;
  title: string;
  summary: string;
  date: string;           // "2026-06-05"
  category: ArticleCategory;
  tags: string[];          // 关联工具ID + 主题标签
  render: () => ReactElement;
}

export type ArticleCategory = "tips" | "learn" | "experience" | "customize";

export const CATEGORY_META: Record<ArticleCategory, { id: ArticleCategory; name: string; desc: string }> = {
  tips:       { id: "tips",       name: "技巧类", desc: "怎么做、怎么做得更好" },
  learn:      { id: "learn",      name: "科普类", desc: "理解概念与运行机制" },
  experience: { id: "experience", name: "经验类", desc: "真实踩坑与排错复盘" },
  customize:  { id: "customize",  name: "定制",   desc: "终端美化与工具配置" },
};

/** 文章注册表 — 按日期倒序排列 */
export const articleRegistry: Article[] = [
  {
    slug: "superpowers-workflow",
    title: "Superpowers 工作流框架：让 AI 编程助手按工程规范做事",
    summary: "Superpowers 是 Claude Code 的 14 技能工作流框架，强制 AI 走完设计→计划→TDD→审查→验证的完整工程流程。本文介绍安装、技能概览、code-review 两级审查机制，以及与 Claude HUD 的分工。",
    date: "2026-06-11",
    category: "tips",
    tags: ["claude-code", "superpowers", "工作流", "审查", "TDD", "插件"],
    render: renderSuperpowersWorkflow,
  },
  {
    slug: "claude-hud-setup",
    title: "Claude HUD 安装与配置：终端状态行实时监控上下文与工具活动",
    summary: "Claude HUD 在终端输入行下方显示上下文使用率、活跃工具、子 Agent 状态和 Todo 进度。本文介绍三步安装、交互式配置、预设选择和平台注意事项。",
    date: "2026-06-11",
    category: "customize",
    tags: ["claude-code", "claude-hud", "监控", "状态行", "效率", "插件"],
    render: renderClaudeHUDSetup,
  },
  {
    slug: "starship-terminal-setup",
    title: "终端美化：Starship 跨 Shell 提示符的安装与配置",
    summary: "Starship 是一个 Rust 编写的跨 shell 提示符工具，单个二进制、一份 TOML 配置、所有 shell 行为一致。本文覆盖 Windows 安装、PS7 profile 配置、预设主题、常用模块速查和 Claude Code 状态行集成。",
    date: "2026-06-11",
    category: "customize",
    tags: ["claude-code", "终端", "Starship", "PowerShell", "美化", "配置"],
    render: renderStarshipTerminalSetup,
  },
  {
    slug: "token-optimization",
    title: "Claude Code Token 消耗的核心策略：从上下文管理到模型分层",
    summary: "输入 Token 通常占总量的 70%–85%，而输入的大头是上下文文件读取。本文从上下文管理、配置减重、模型分层和会话习惯四个方向介绍减少 Token 消耗的策略。",
    date: "2026-06-11",
    category: "tips",
    tags: ["claude-code", "效率", "Token", "上下文"],
    render: renderTokenOptimization,
  },
  {
    slug: "ai-pair-workflow",
    title: "从「动手做」到「指挥做」：AI 编程工具的协作方式",
    summary: "本站文章中的命令、配置和文件操作默认以「你手动执行」的视角编写。但在实际使用中，这些操作都可以交给 AI 编程工具来执行——粘贴到对话框，让它代劳。你负责决策和审查，工具负责操作。",
    date: "2026-06-10",
    category: "tips",
    tags: ["claude-code", "cursor", "codex", "copilot", "效率", "协作"],
    render: renderAiPairWorkflow,
  },
  {
    slug: "searxng-doc-review-workflow",
    title: "SearXNG 本地部署与 MCP 接入：搭建私有搜索引擎做技术文档交叉验证",
    summary: "从零部署 SearXNG 聚合百度+必应+谷歌，绕过 Windows env 块 Bug 接入 Claude Code MCP。演示逐条交叉验证技术文档中命令、路径和版本的完整工作流。",
    date: "2026-06-10",
    category: "experience",
    tags: ["searxng", "claude-code", "搜索", "审查", "docker", "mcp", "排错"],
    render: renderSearxngDocReviewWorkflow,
  },
  {
    slug: "mcp-config-pitfall-guide",
    title: "Claude Code MCP 配置避坑指南：配置优先级、Key 传递与进程诊断",
    summary: "决策流程选对配置方法 → 避开 env 块已知 Bug（GitHub #1254）→ 理解 backups 幽灵缓存 → 诊断进程链和隐性污染源。附分平台首选方案和完整诊断命令集。",
    date: "2026-06-08",
    category: "experience",
    tags: ["claude-code", "mcp", "windows", "调试", "配置", "排错"],
    render: renderMCPConfigPitfallGuide,
  },
  {
    slug: "cursor-rules-claude-md",
    title: "让 AI 停止生成过期代码：.cursor/rules 与 CLAUDE.md 配置",
    summary: "介绍 Cursor 的 .cursor/rules/*.mdc 规则文件（含 YAML 属性头）和 Claude Code 的 CLAUDE.md 的配置方法。通过项目规则文件告诉 AI 当前技术栈，避免生成 Pages Router 旧代码或 Vue 2 语法。",
    date: "2026-06-06",
    category: "tips",
    tags: ["cursor", "claude-code", "规则", "配置", "规范性"],
    render: renderCursorRulesClaudeMd,
  },
  {
    slug: "codebase-context-primer",
    title: "AI 编程的上下文管理：@Files、@Folders 与提问技巧",
    summary: "比较 @Files、@Folders、@Definitions、@Codebase 四种上下文引用方式的 Token 消耗和适用场景。提供结构化的提问公式，以及索引同步的注意事项。",
    date: "2026-06-06",
    category: "tips",
    tags: ["cursor", "claude-code", "提问技巧", "效率", "上下文"],
    render: renderCodebaseContextPrimer,
  },
  {
    slug: "ai-security-compliance",
    title: "AI 编程工具的安全配置：防止敏感代码被索引上传",
    summary: "介绍 .cursorignore 的配置方法、CLAUDE.md 的安全声明、Privacy Mode 开启步骤，以及 Copilot 代码收集的关闭方式。附带可操作的安全配置清单。",
    date: "2026-06-06",
    category: "learn",
    tags: ["cursor", "claude-code", "copilot", "安全", "合规", "隐私"],
    render: renderAiSecurityCompliance,
  },
  {
    slug: "mcp-deep-dive",
    title: "理解 MCP：模型上下文协议的架构、机制与工程实践",
    summary: "介绍 MCP 的 Tools/Resources/Prompts 三大核心基座，对比 Function Calling 和 Plugin 在设计思路上的差异。含 JSON-RPC 消息流示例和 stdio/SSE/HTTP 传输层说明。",
    date: "2026-06-05",
    category: "learn",
    tags: ["mcp", "claude-code", "cursor", "windsurf", "claude-desktop", "协议", "架构"],
    render: renderMCPDeepDive,
  },
  {
    slug: "domestic-model-access",
    title: "Claude Code 国内模型接入：三种方案的配置与对比",
    summary: "介绍 CC Switch、手动配置 settings.json、Agent 代装三种 API 协议兼容转接方式，覆盖 DeepSeek、硅基流动、智谱等供应商的价格参考与配置示例。适用于无法直接访问 Anthropic API 的场景。",
    date: "2026-06-05",
    category: "tips",
    tags: ["claude-code", "deepseek", "国内模型", "CC Switch", "API", "接入"],
    render: renderDomesticModelAccess,
  },
  {
    slug: "mcp-hook-skill-advanced",
    title: "Claude Code 扩展机制：MCP、Hook、Skill、SubAgent 与 Memory",
    summary: "介绍 Claude Code 的六种扩展机制：MCP（模型上下文协议）、Hook（钩子系统）、Skill（技能系统）、SubAgent（子代理）、Memory 记忆系统和 Workflow 工作流。包含配置示例和搭建步骤。",
    date: "2026-06-05",
    category: "learn",
    tags: ["claude-code", "mcp", "hook", "skill", "subagent", "memory", "workflow", "进阶"],
    render: renderMCPHookSkillAdvanced,
  },
  {
    slug: "search-research-file-processing",
    title: "Claude Code 使用示例：搜索调研、网页抓取与文件批处理",
    summary: "三个使用场景的记录：深度搜索与技术选型调研、网页内容抓取（三种方案比较）、文件批处理与数据提取。包含 Prompt 示例和实际使用数据。",
    date: "2026-06-05",
    category: "tips",
    tags: ["claude-code", "搜索", "爬虫", "文件处理", "实战", "效率"],
    render: renderSearchResearchFileProcessing,
  },
  {
    slug: "deepseek-claude-code-guide",
    title: "Claude Code MCP 挂载 DeepSeek：双模型协同方案",
    summary: "通过 MCP 协议将 DeepSeek 注册为 Claude Code 的外部工具。Claude 负责架构设计和推理，DeepSeek 承担重复性代码生成。含部署步骤、成本算例和常见排查。",
    date: "2026-06-05",
    category: "tips",
    tags: ["claude-code", "deepseek", "mcp", "降本", "双模型", "协同"],
    render: renderDeepSeekGuide,
  },
];

/** 获取所有文章 */
export function getAllArticles(): Article[] {
  return articleRegistry;
}

/** 按 slug 获取单篇文章 */
export function getArticle(slug: string): Article | undefined {
  return articleRegistry.find((a) => a.slug === slug);
}
