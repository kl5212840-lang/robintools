import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCursorConfig(platform: Platform) {
  const cmdOrCtrl = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Cursor 默认使用内置模型，也支持接入第三方 API。本指南涵盖模型配置和使用技巧。
      </p>

      <h2 id="section-apikey"><span className="step-badge">1</span>模型与 API Key</h2>
      <p>Cursor 支持多种模型：</p>
      <ul className="list-disc pl-5 space-y-2 text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>内置模型</strong>：Cursor 自带 GPT-4 和 Claude 模型，Pro 用户可直接使用</li>
        <li><strong>自定义 API Key</strong>：Settings &gt; Models &gt; 填入你的 API Key（支持 OpenAI / Anthropic / Google 等）</li>
        <li><strong>国内用户</strong>：可使用 DeepSeek 等国内模型的 API Key，在 Settings 中配置</li>
      </ul>
      <Callout type="info" summary="Pro 订阅说明">
        付费后可解锁更多 AI 调用次数和更高优先级的模型访问。
      </Callout>

      <h2 id="section-config-file"><span className="step-badge">2</span>项目规则配置</h2>
      <p>推荐使用 <code>.cursor/rules/</code> 目录方式（新版），每个规则一个 <code>.mdc</code> 文件，可指定文件匹配模式和触发条件：</p>

      <h3>推荐方式：.cursor/rules 目录</h3>
      <p>在项目根目录创建 <code>.cursor/rules/</code> 文件夹，添加 <code>.mdc</code> 规则文件。示例一 — 通用编码规范：</p>
      <CodeBlock language="markdown" mode="unified" code={`# .cursor/rules/coding-style.mdc
---
description: 通用编码规范
globs: **/*.ts,**/*.tsx
---

## 编码规范
- 使用 TypeScript 严格模式
- 函数组件 + Hooks，不用 class 组件
- 导出具名函数，避免 default export`} />
      <p>示例二 — API 开发规范（仅对指定目录生效）：</p>
      <CodeBlock language="markdown" mode="unified" code={`# .cursor/rules/api-rules.mdc
---
description: API 开发规范
globs: src/api/**,src/server/**
---

## API 规范
- 使用 RESTful 风格
- 错误统一用 HttpException 抛出
- 所有端点需要 JWT 鉴权`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        <code>globs</code> 指定规则生效的文件范围；<code>description</code> 在 Cursor 设置中显示为规则名称。多个 <code>.mdc</code> 文件可按功能模块拆分管理。
      </p>

      <h3>旧版方式：单文件 .cursorrules（逐步淘汰）</h3>
      <p>旧的单文件 <code>.cursorrules</code> 仍然兼容（截至 2026 年 6 月），但不支持按文件类型触发。建议迁移到上述目录方式。已有旧文件的项目可参考本站<a href="/articles/cursor-rules-claude-md" style={{ color: "var(--color-accent)" }}>《让 AI 停止生成过期代码》</a>一文中的迁移说明。</p>

      <h2 id="section-verify-config"><span className="step-badge">3</span>验证配置 + 快捷键</h2>
      <p>完成 API Key 和项目规则配置后，逐条确认：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开 Settings → Models，确认模型列表中出现你配置的模型</li>
        <li>在 Composer（{cmdOrCtrl}+I）中输入"用 TypeScript 写一个工具函数"——生成成功说明模型正常</li>
        <li>在 Chat（{cmdOrCtrl}+L）中 @ 引用 <code>.cursor/rules/</code> 中的一个规则文件，检查规则是否生效：AI 应遵循规则中的编码风格</li>
      </ol>
      <Collapsible summary="验证：规则是否真的生效？">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>测试方法：故意写一段规则中禁止的代码（如规则要求不用 default export，故意写一段 default export），然后在 Composer 中让 AI"重构这段代码"——如果 AI 自动去掉了 default export，规则生效。</p>
      </Collapsible>
    </div>
  );
}

/* ================================================================
   Cursor 配置指南
   ================================================================ */

export default renderCursorConfig;
