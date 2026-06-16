import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote } from "../_shared";

function renderClineConfig(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Cline 不会锁定单一 AI 提供商——它支持 Anthropic、OpenAI、Google、OpenRouter、DeepSeek、Ollama 等 20+ 个来源，可按需切换。
      </p>

      <h2 id="section-apikey"><span className="step-badge">1</span>选择 API 提供商</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        点击 VS Code 左侧 Cline 图标打开对话面板，顶部下拉菜单选择 <strong>API Provider</strong>。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>提供商</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>国内直连</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐模型</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合场景</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Anthropic</strong></td>
              <td className="py-2 pr-4">需中转</td>
              <td className="py-2 pr-4">Claude Opus / Sonnet</td>
              <td className="py-2">复杂推理、大型代码库重构</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>OpenAI</strong></td>
              <td className="py-2 pr-4">需中转</td>
              <td className="py-2 pr-4">GPT-4o / GPT-4.1</td>
              <td className="py-2">通用编程、快速开发</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>OpenRouter</strong></td>
              <td className="py-2 pr-4">直连</td>
              <td className="py-2 pr-4">200+ 模型任选</td>
              <td className="py-2">需要灵活切换模型、对比效果</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>DeepSeek</strong></td>
              <td className="py-2 pr-4">直连</td>
              <td className="py-2 pr-4">DeepSeek-V3 / R1</td>
              <td className="py-2">国内用户首选，成本低</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Google Gemini</strong></td>
              <td className="py-2 pr-4">需中转</td>
              <td className="py-2 pr-4">Gemini 2.5 Pro</td>
              <td className="py-2">超长上下文（1M+ token）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Ollama / LM Studio</strong></td>
              <td className="py-2 pr-4">本地</td>
              <td className="py-2 pr-4">本地模型</td>
              <td className="py-2">完全离线、数据不出本机</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>OpenAI 兼容</strong></td>
              <td className="py-2 pr-4">看供应商</td>
              <td className="py-2 pr-4">自定义</td>
              <td className="py-2">硅基流动、智谱等国产中转</td>
            </tr>
          </tbody>
        </table>
      </div>
      <FreshnessNote>以上直连情况验证于 2026-06，网络状况可能变化。</FreshnessNote>

      <h2 id="section-models"><span className="step-badge">2</span>模型配置</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        选定提供商后填入 API Key，Cline 会自动获取该提供商的可用模型列表。
      </p>

      <h3>DeepSeek 配置示例（国内推荐）</h3>
      <CodeBlock language="text" code={`API Provider: OpenAI Compatible
Base URL: https://api.deepseek.com
API Key: sk-xxxxxxxxxxxxxxxx
Model: deepseek-chat`} />

      <h3>OpenRouter 配置示例（多模型灵活切换）</h3>
      <CodeBlock language="text" code={`API Provider: OpenRouter
API Key: sk-or-v1-xxxxxxxxxxxxxxxx
Model: openrouter/auto（自动路由）
// 或指定模型如 anthropic/claude-sonnet-4`} />

      <Callout type="info">
        <strong>自定义 Base URL</strong>：选择 "OpenAI Compatible" 作为 Provider 时，可以填写任意兼容 OpenAI API 格式的地址。这意味着硅基流动、智谱、零一万物等国产模型平台都能接入。
      </Callout>

      <h2 id="section-rules"><span className="step-badge">3</span>项目规则</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        在项目根目录创建 <code>.clinerules</code> 文件，Cline 在每次对话中自动读取。类似 Claude Code 的 <code>CLAUDE.md</code> 和 Cursor 的 <code>.cursor/rules/</code>。
      </p>

      <CodeBlock language="markdown" mode="unified" code={`# .clinerules 示例

## 技术栈
React 19 + TypeScript + Tailwind CSS 4 + Next.js 16

## 编码规范
- 中文回复用户，代码注释用英文
- 组件用函数式写法，不写 class 组件
- 不引入新的 UI 框架（现有技术栈已覆盖）

## Cline 行为
- 修改代码前先说明计划
- 优先使用项目已有的工具函数
- 不要自动 git commit`} />

      <Callout type="info">
        <strong>规则文件位置</strong>：<code>.clinerules</code> 放在项目根目录即可，Cline 会自动检测。也支持放在 <code>.clinerules/</code> 目录下拆分为多个文件（如 <code>.clinerules/01-typescript.md</code>）。
      </Callout>

      <h2 id="section-mcp"><span className="step-badge">4</span>MCP 服务器</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Cline 内建 MCP 支持，可以连接数据库、调用 API、管理云资源。关于 MCP 协议的架构原理，见<a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP》</a>。
      </p>

      <h3>通过 CLI 管理 MCP</h3>
      <CodeBlock language="bash" code={`# 列出已安装的 MCP 服务器
cline mcp list

# 添加社区 MCP 服务器
cline mcp add <server-name>

# 查看 MCP 服务器状态
cline mcp status`} />

      <h3>VS Code 扩展中配置 MCP</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Cline 面板右上角齿轮图标 → <strong>MCP 服务器</strong></li>
        <li>点击 <strong>添加 MCP 服务器</strong></li>
        <li>填写名称、命令、参数</li>
        <li>保存后 Cline 自动连接该 MCP 服务器</li>
      </ol>

      <Callout type="info">
        <strong>社区 MCP 库</strong>：Cline 支持所有社区 MCP 服务器。GitHub 搜索 "modelcontextprotocol/servers" 可找到官方维护的服务列表，包括文件系统、数据库、网页搜索等。
      </Callout>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        配置问题可参考「故障排查」标签页，或搜索 "Cline 配置教程" 看视频演示。
      </p>
    </div>
  );
}

export default renderClineConfig;
