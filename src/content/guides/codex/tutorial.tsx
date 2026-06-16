import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, Collapsible } from "../_shared";

function renderCodexTutorial(platform: Platform) {
  const ctrlKey = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <Collapsible summary="前置说明">
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          本教程假设你已完成 Codex CLI 的安装和配置。如果还没配置，请先查看「配置指南」标签页。
        </p>
      </Collapsible>

      <h2 id="section-tutorial-basics"><span className="step-badge">1</span>基本操作</h2>
      <h3>启动与对话</h3>
      <CodeBlock language="bash" code={`# 进入项目目录启动
cd 你的项目路径
codex

# 单次任务模式
codex "帮我创建一个 React 组件"

# 交互模式
codex`} />
      <p>Codex 会分析你的项目结构，然后进入对话模式。输入自然语言描述需求即可。</p>

      <Collapsible summary="验证：确认 Codex 正常工作">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>启动后输入以下测试提示词，观察 AI 是否能正确理解项目并给出响应：</p>
        <CodeBlock language="text" code={`# 在 codex 交互模式中输入
请分析一下这个项目的目录结构和技术栈

# 预期响应：Codex 应列出项目的主要目录、文件类型、并推断出使用的技术栈
# 如果 Codex 回答与项目实际不符 → 检查 config.toml 中的 openai_base_url 和 api_key 配置`} />
      </Collapsible>

      <h3>与 Claude Code 的操作差异</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>沙箱模式</strong>：Codex 默认使用沙箱隔离运行。推荐 <code>workspace-write</code> 模式——可修改项目目录内文件，不能触碰系统目录</li>
        <li><strong>审批机制</strong>：执行命令前 Codex 会先显示即将运行的命令，确认后才执行（可通过 approval_policy 配置）</li>
        <li><strong>项目隔离</strong>：不同文件夹 = 不同项目，可开启多个终端并行处理不同任务</li>
      </ul>
      <Callout type="info" summary="沙箱三种模式">
        <code>read-only</code>（只读，最安全）→ <code>workspace-write</code>（推荐，可修改项目文件）→ <code>danger-full-access</code>（全盘访问，⚠️ 有误删风险）。详见「配置指南」。
      </Callout>

      <h2 id="section-tutorial-files"><span className="step-badge">2</span>沙箱与项目管理</h2>
      <h3>项目隔离</h3>
      <p>每个文件夹是一个独立项目，Codex 会为每个项目维护独立的上下文：</p>
      <CodeBlock language="bash" code={`# 在不同项目间切换
cd ~/project-a && codex    # 项目 A
cd ~/project-b && codex    # 项目 B（独立的上下文）`} />

      <h3>多进程并行</h3>
      <p>同一项目可以开启多个 Codex 进程，并行处理不同任务：</p>
      <CodeBlock language="bash" code={`# 终端 1：前端开发
cd ~/my-project && codex
> 帮我优化前端的性能

# 终端 2：后端开发（同时运行）
cd ~/my-project && codex
> 帮我写一个用户认证的 API`} />

      <h2 id="section-tutorial-git"><span className="step-badge">3</span>Git 与工作流</h2>
      <p>Codex 可以帮你完成 Git 操作：</p>
      <CodeBlock language="text" code={`# 初始化 Git 仓库
帮我把这个项目初始化成 git 工程，排除 node_modules

# 自动提交
帮我提交代码，commit 信息用 "feat: add user API"

# 创建仓库
在 GitHub 上创建一个新仓库，把这个项目推上去
# 需要提供 GitHub 用户名和 Token`} />

      <Callout type="warning" summary="安全提醒">
        使用 Git 功能前，确保重要代码已有备份。不要让 Codex 执行 <code>git push --force</code> 等危险操作。
      </Callout>

      <Collapsible summary="Git 操作验证">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>Codex 执行 Git 操作后，手动确认结果：</p>
        <CodeBlock language="bash" code={`# 确认 commit 已生成
git log --oneline -3

# 确认 .gitignore 已创建且包含 node_modules
cat .gitignore | grep node_modules

# 确认 GitHub 仓库已创建（浏览器访问）
# https://github.com/你的用户名/仓库名`} />
      </Collapsible>

      <h2 id="section-tutorial-codexpp"><span className="step-badge">4</span>Codex++ 增强工具</h2>
      <p><a href="https://github.com/BigPizzaV3/CodexPlusPlus" target="_blank" rel="noopener">Codex++ <ExternalLink className="inline h-3 w-3" /></a> 是基于 Rust + Tauri 开发的第三方增强启动器，<strong>不修改原始安装文件</strong>，通过 Chromium DevTools Protocol 注入增强脚本：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>插件解锁</strong>：API Key 模式下也能正常使用插件（这是官方缺失的入口）</li>
        <li><strong>会话管理</strong>：真正删除会话（非归档）+ Markdown 导出对话记录</li>
        <li><strong>项目管理</strong>：项目移动、Timeline 时间线显示</li>
        <li><strong>中转注入</strong>：图形化管理多中转站和 API Key，自动路由到不同供应商</li>
        <li><strong>高级功能</strong>：自定义脚本注入、Zed 远程打开、Upstream worktree 智能创建</li>
        <li>Windows / macOS 双平台支持</li>
      </ul>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        下载与配置步骤见<a href="/codex/config#section-cn-codexpp">配置指南 → §4 方案 B Codex++</a>。
      </p>

      <h2 id="section-tutorial-advanced"><span className="step-badge">5</span>高级功能</h2>
      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        Codex 与 Claude Code 定位不同——Codex 默认沙箱保护更完善，Claude Code 文件操作更直接。详细对比见<a href="/compare" style={{ color: "var(--color-accent)" }}>工具对比表</a>。
      </p>

      <h3>Skills（技能系统）</h3>
      <p>Codex 支持 Skills，可以创建可复用的专业化指令。技能文件放在项目的 <code>.codex/skills/</code> 目录下。</p>

      <h3>Memory 系统</h3>
      <p>Codex 支持两种层级的项目说明文件：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>项目级</strong>：项目根目录创建 <code>AGENTS.md</code>（类似 Claude Code 的 CLAUDE.md），Codex 启动时自动读取</li>
        <li><strong>用户级</strong>：在 <code>~/.codex/</code> 目录下可放置全局配置文件，对所有项目生效</li>
      </ul>
      <p style={{ color: "var(--color-text-secondary)" }}>AGENTS.md 示例：</p>
      <CodeBlock language="markdown" mode="unified" code={`# AGENTS.md 示例

## 项目简介
React + Express 全栈电商应用

## 技术栈
- 前端: React 18 + TypeScript + Tailwind CSS
- 后端: Express + Prisma + PostgreSQL
- 测试: Vitest

## 编码规范
- 使用 TypeScript 严格模式
- 组件使用函数式写法
- API 使用 RESTful 风格

## 注意事项
- 不要直接修改 prisma/schema.prisma，需要通过 migration
- 前端路由在 src/routes.tsx 中定义`} />

      <Callout type="info" summary="总 结">
        Codex 适合已有 ChatGPT 订阅的用户，沙箱设计更安全但灵活性不如 Claude Code。两者可以配合使用——根据任务类型选择合适工具。
      </Callout>
    </div>
  );
}

/* ================================================================
   Codex 使用教程
   ================================================================ */

export default renderCodexTutorial;
