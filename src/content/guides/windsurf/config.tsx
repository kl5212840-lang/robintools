import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderWindsurfConfig(platform: Platform) {
  const ctrl = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Windsurf 的 Cascade AI 代理默认使用内置模型，也支持自定义配置。
      </p>

      <h2 id="section-apikey"><span className="step-badge">1</span>模型与订阅</h2>
      <ul className="list-disc pl-5 space-y-2 text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>免费版</strong>：提供基本 AI 功能（代码补全 + 有限次数的 Cascade 对话）</li>
        <li><strong>Pro 版</strong>：无限 AI 交互 + 高级模型 + 优先支持</li>
        <li><strong>自定义模型</strong>：Settings &gt; Models 中可添加自己的 API Key（支持 OpenAI / Anthropic / Google 等）</li>
      </ul>
      <Callout type="info">
        国内可直接使用 Windsurf 的内置模型，不需要科学上网。如需使用自定义 API Key，可使用 DeepSeek 等国内供应商。
      </Callout>

      <h2 id="section-config-file"><span className="step-badge">2</span>Cascade 设置</h2>
      <p>Cascade 是 Windsurf 的核心 AI 代理。在 Settings &gt; Cascade 中可配置：</p>
      <ul className="list-disc pl-5 space-y-2 text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>自动模式</strong>：Cascade 自动执行代码修改（类似 Claude Code 的权限跳过）</li>
        <li><strong>手动模式</strong>：每次修改前询问确认</li>
        <li><strong>上下文范围</strong>：控制 Cascade 读取多少项目文件作为上下文</li>
        <li><strong>终端访问</strong>：是否允许 Cascade 运行终端命令</li>
      </ul>

      <h2 id="section-rules"><span className="step-badge">3</span>项目规则</h2>
      <p>在项目根目录创建 <code>.windsurfrules</code> 文件：</p>
      <CodeBlock language="markdown" mode="unified" code={`# .windsurfrules 示例

## 技术栈
React 18 + TypeScript + Tailwind CSS

## 编码规范
- 使用 const/let，不用 var
- 组件用函数式写法
- 按功能组织文件

## Cascade 行为
- 修改代码前先说明计划
- 优先使用项目中已有的工具函数`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        类似 Claude Code 的 CLAUDE.md 和 Cursor 的 .cursor/rules/ 目录。
      </p>

      <Callout type="info">
        <strong>特色功能</strong>：Windsurf 的 Multi-file Edit 可以一次修改多个文件并保持一致性，特别适合跨文件重构。Cascade 支持 &quot;Continue&quot; 模式，可以持续执行复杂的多步任务。
      </Callout>

      <Collapsible summary="验证：确认自定义 API Key 生效">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>配置 API Key 后：</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li>Settings → Models → 检查模型列表是否出现你配置的模型</li>
          <li>按 {ctrl}+L 打开 Cascade，输入"你现在用的是什么模型？"——应返回你配置的模型名而非默认模型</li>
          <li>如果返回的是默认模型名 → 检查 API Key 格式和 base_url 配置</li>
        </ol>
      </Collapsible>
    </div>
  );
}

/* ================================================================
   Windsurf 配置指南
   ================================================================ */

export default renderWindsurfConfig;
