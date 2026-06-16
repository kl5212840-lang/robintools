import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderClaudeTutorial(_platform: Platform) {
  return (
    <div className="wizard-content">
      <Collapsible summary="前置说明">
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          本教程假设你已完成 Claude Code 的安装和配置。如果还没配置，请先查看「配置指南」标签页。
        </p>
      </Collapsible>

      <h2 id="section-tutorial-basics"><span className="step-badge">1</span>基本操作入门</h2>
      <h3>启动 Claude Code</h3>
      <p>在终端进入你的项目目录，输入：</p>
      <CodeBlock language="bash" code={`# 进入项目目录\ncd 你的项目路径\n\n# 启动 Claude Code\nclaude`} />
      <p>首次启动会要求确认工作目录，选择「信任」即可。</p>

      <h3>基本对话模式</h3>
      <p>Claude Code 不只是聊天——它能直接操作你的文件。试几个例子：</p>
      <CodeBlock language="text" code={`# 询问项目信息\n这个项目是做什么的？分析一下项目结构\n\n# 创建文件\n帮我创建一个 README.md 文件\n\n# 修改代码\n把 src/app.ts 中的端口号改成 8080\n\n# 运行命令\n帮我运行测试，看看有没有失败的`} />

      <h3>三种执行模式</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>仅本次允许</strong>：只同意这一次操作，下次再问</li>
        <li><strong>本次会话始终允许</strong>：当前对话中不再询问同类操作（推荐）</li>
        <li><strong>拒绝</strong>：不执行，返回修改方案</li>
      </ul>
      <Callout type="info" summary="高效技巧">
        在 CC Switch 中开启「默认跳过权限申请」，Claude Code 将自动执行所有操作。适合信任的项目环境。
      </Callout>

      <h2 id="section-tutorial-files"><span className="step-badge">2</span>文件与项目管理</h2>
      <h3>让 Claude 理解你的项目</h3>
      <p>Claude Code 启动时会自动扫描项目结构，你可以直接问：</p>
      <CodeBlock language="text" code={`# 项目分析\n帮我分析这个项目的技术栈和架构\n\n# 查找代码\n找到所有处理用户登录的代码文件\n\n# 代码解释\n解释一下 src/auth/login.ts 这个文件做了什么\n\n# 依赖分析\n分析一下项目的依赖关系，有没有可以优化的地方`} />

      <h3>代码生成与修改</h3>
      <p>直接用自然语言描述需求：</p>
      <CodeBlock language="text" code={`# 创建新功能\n帮我创建一个用户注册 API，包括输入验证和数据库存储\n\n# 修改代码\n把 User 模型增加一个 phone 字段，同步更新数据库 migration\n\n# 重构代码\n把 src/utils 里的工具函数按功能拆分到不同的文件\n\n# 批量操作\n把项目中所有的 var 改成 const/let`} />
      <Callout type="warning" summary="重要">
        让 Claude 修改代码前，建议先用 Git 提交当前状态。这样如果修改不满意，可以通过 <code>git checkout</code> 或 <code>git reset</code> 回滚到之前的状态。
      </Callout>

      <h2 id="section-tutorial-context"><span className="step-badge">3</span>上下文与记忆管理</h2>
      <h3>CLAUDE.md——项目的&ldquo;说明书&rdquo;</h3>
      <p>在项目根目录创建 <code>CLAUDE.md</code> 文件，Claude 每次启动都会自动读取。类似的机制也存在于 Cursor（<code>.cursor/rules/</code>）和 Codex（<code>AGENTS.md</code>）——参见<a href="/articles/cursor-rules-claude-md" style={{ color: "var(--color-accent)" }}>《让 AI 停止生成过期代码》</a>中对项目规则文件的横向对比。</p>
      <CodeBlock language="markdown" mode="unified" code={`# CLAUDE.md 示例\n\n## 项目简介\nReact + Express 全栈电商应用\n\n## 技术栈\n- 前端: React 18 + TypeScript + Tailwind CSS\n- 后端: Express + Prisma + PostgreSQL\n- 测试: Vitest + Playwright\n\n## 编码规范\n- 使用 TypeScript 严格模式\n- 组件使用函数式写法\n- API 使用 RESTful 风格\n\n## 常用命令\n- pnpm dev: 启动开发服务器\n- pnpm test: 运行测试\n\n## 注意事项\n- 不要直接修改 prisma/schema.prisma，需要通过 migration`} />

      <h3>Memory 系统</h3>
      <p>Claude Code 会自动记住项目信息。存储位置：<code>.claude/memory/</code></p>
      <CodeBlock language="text" code={`# 让 Claude 记住重要信息\n记住：我们的 API 端口是 8080\n记住：生产环境用 PostgreSQL，本地用 SQLite\n\n# 查看已记住的内容\n帮我列出所有记忆`} />

      <h3>会话管理</h3>
      <CodeBlock language="bash" code={`# 继续上次会话\nclaude --continue\n\n# 压缩上下文（节省 token）\n/compact\n\n# 清空当前会话\n/clear`} />

      <h2 id="section-tutorial-git"><span className="step-badge">4</span>Git 工作流</h2>
      <p>Claude Code 深度集成了 Git：</p>
      <CodeBlock language="text" code={`# 创建分支\n帮我创建一个新分支 feature/user-login\n\n# 提交代码\n帮我提交这些修改，commit 信息用 "feat: add user login"\n\n# 查看历史\n帮我查看最近的 git 提交记录\n\n# Code Review\n帮我审查一下这个 PR 的代码`} />
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>让 Claude 分析代码变更并生成规范的 commit message</li>
        <li>出问题时用 <code>git checkout</code> 快速回滚</li>
        <li>创建 PR 前让 Claude 做 Code Review</li>
      </ul>

      <h2 id="section-tutorial-mcp"><span className="step-badge">5</span>MCP 服务扩展</h2>
      <p>MCP（Model Context Protocol，模型上下文协议）让 Claude Code 连接外部工具和服务。通过 MCP，Claude Code 可以直接搜索网页、操作数据库、控制浏览器、管理 GitHub 仓库等。关于 MCP 的架构原理，参见<a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP》</a>。</p>

      <h3>安装你的第一个 MCP：Brave Search</h3>
      <p>以最常用的 Brave Search（网页搜索）为例：</p>

      <p><strong>① 获取 API Key</strong></p>
      <p>访问 <a href="https://api.search.brave.com/" target="_blank" rel="noopener" style={{ color: "var(--color-accent)" }}>api.search.brave.com</a>，注册账号 → 选择 Free 套餐（每月 2,000 次免费）→ 复制 API Key。</p>

      <p><strong>② 添加 MCP 服务</strong></p>
      <p><strong>Windows —</strong> 使用 CLI 命令（推荐）：</p>
      <CodeBlock language="bash" code={`claude mcp add brave-search --env BRAVE_API_KEY=你的API-Key -- cmd /c "npx -y @anthropic/mcp-server-brave-search"`} />
      <Collapsible summary="Windows CLI 命令注意事项">
        <p style={{ color: "var(--color-text-muted)" }}>
          添加后检查 <code>.claude.json</code> 中 <code>args[0]</code> 是否为 <code>"/c"</code>——Git for Windows 的 MSYS2 环境可能把 <code>/c</code> 转为 <code>C:/</code>。如果被误解析，手动改回。
          也可手动编辑 <code>~/.claude/mcp.json</code>（见配置指南）。
        </p>
      </Collapsible>
      <p><strong>macOS / Linux —</strong> 终端运行：</p>
      <CodeBlock language="bash" code={`claude mcp add brave-search --transport stdio --env BRAVE_API_KEY=你的API-Key -- npx -y @anthropic/mcp-server-brave-search`} />

      <p><strong>③ 重启验证</strong></p>
      <p>完全退出 Claude Code 再重新打开，输入 <code>/mcp</code> 确认 <code>brave-search</code> 显示为 <strong>connected ✓</strong>。然后测试：</p>
      <CodeBlock language="text" code={`搜索最新的 React 19 文档`} />
      <p>Claude 回复中引用了搜索结果，说明安装成功。</p>

      <Callout type="info" summary="装好了想装更多？">
        其他 MCP 的安装流程类似，详见「配置指南」→ 「MCP 服务配置」。如果遇到配置不生效、反复改还是旧配置等问题，见本站
        <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>。
      </Callout>

<h2 id="section-tutorial-hook"><span className="step-badge">6</span>Hook 钩子系统</h2>
      <p>Hook 让你在 Claude Code 的生命周期关键节点自动执行脚本，实现开发流程自动化。Hook、Skill、SubAgent 等扩展机制的完整介绍见<a href="/articles/mcp-hook-skill-advanced" style={{ color: "var(--color-accent)" }}>《Claude Code 扩展机制》</a>。</p>

      <h3>常见使用场景</h3>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>场景</th>
            <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>说明</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><strong>代码提交前自动 Lint</strong></td>
            <td className="py-2">Claude 修改代码后触发 lint，有错自动修</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><strong>文件保存后触发测试</strong></td>
            <td className="py-2">修改完文件自动跑相关测试，即时反馈</td>
          </tr>
          <tr>
            <td className="py-2 pr-4"><strong>会话开始时加载配置</strong></td>
            <td className="py-2">每次启动 Claude Code 自动执行环境初始化脚本</td>
          </tr>
        </tbody>
      </table>

      <h3>配置位置</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>项目级</strong>：<code>.claude/hooks/</code> — 只对当前项目生效</li>
        <li><strong>用户级</strong>：<code>~/.claude/hooks/</code> — 对所有项目生效</li>
      </ul>

      <h3>其他高级功能速查</h3>
      <CodeBlock language="bash" code={`# Skills 技能系统
/skills                 # 查看所有可用技能

# 子代理（并行处理）
帮我同时调研 React Router v7 和 TanStack Router 的最新 API

# 后台任务
帮我后台运行 npm run build
/tasks                  # 查看后台任务列表

# 代码审查
/code-review            # 审查当前代码变更

# 图片处理
# 直接拖入截图到终端，Claude 可以分析 UI、识别报错信息`} />

      <h2 id="section-tutorial-practice"><span className="step-badge">7</span>实战案例</h2>
      <p>以下是几个开箱即用的实战 prompt，展示 Claude Code 实际工作场景中的用法。</p>

      <h3>技术选型调研</h3>
      <p>让 Claude Code 自动搜索、对比、输出结构化报告：</p>
      <CodeBlock mode="unified" language="markdown" code={`帮我深度调研 2026 年主流的 AI Agent 开发框架：
1. LangChain、CrewAI、AutoGen、Claude Agent SDK、OpenAI Agents SDK
2. 每个框架的核心理念、优劣势、适合场景
3. GitHub Star 数和社区活跃度
4. 给出推荐（适合个人开发者 vs 企业团队）

请标注每条信息的来源链接，保存到 research/agent-frameworks.md`} />
      <Collapsible summary="说明">
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>Claude Code 会自动并行搜索、交叉验证来源、生成结构化对比表格，效率远高于传统手动调研方式。</p>
      </Collapsible>

      <h3>竞品分析</h3>
      <CodeBlock mode="unified" language="markdown" code={`帮我调研 2026 年主流的 AI 代码编辑器，从以下维度对比：
- 产品：Cursor、Windsurf、Claude Code、GitHub Copilot
- 对比维度：价格、支持模型、核心特色功能、适合人群
整理成表格，保存到 research/ai-editors-comparison.md`} />

      <h3>网页爬取方案</h3>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>工具</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>原理</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>适用场景</th>
            <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐度</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><strong>Chrome DevTools MCP</strong></td>
            <td className="py-2 pr-4">连接本地 Chrome</td>
            <td className="py-2 pr-4">JS 渲染页面、需登录的页面</td>
            <td className="py-2">⭐⭐⭐</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><strong>WebFetch（内置）</strong></td>
            <td className="py-2 pr-4">HTTP 抓取 → 转 Markdown</td>
            <td className="py-2 pr-4">静态页面、文档</td>
            <td className="py-2">⭐⭐</td>
          </tr>
          <tr>
            <td className="py-2 pr-4"><strong>agent-browser</strong></td>
            <td className="py-2 pr-4">独立无头浏览器</td>
            <td className="py-2 pr-4">不与本地浏览器冲突</td>
            <td className="py-2">⭐⭐</td>
          </tr>
        </tbody>
      </table>

      <h3>文件批处理</h3>
      <CodeBlock language="text" code={`# 按类型整理文件夹\n帮我整理这个文件夹里的文件，按文件类型分类到不同子文件夹\n\n# 提取数据\n帮我读取这个 Excel 文件，提取其中的数据，保存为 JSON 格式\n\n# 格式转换\n帮我把这个 Markdown 文件转成 PDF\n\n# 批量重命名\n帮我把这个目录下所有 .jpeg 文件改成 .jpg`} />

      <Callout type="info" summary="效率建议">
        ① 写好 CLAUDE.md 让 Claude 理解项目；② 善用 Git 以便每次修改可追溯和回滚；③ 复杂任务拆成小步骤逐步确认；④ 要求标注来源方便信息核实；⑤ 不确定时先让 Claude 解释计划再执行。
      </Callout>
      <FreshnessNote>以上 MCP 服务器列表、Brave Search 免费配额、Hook 配置路径等验证于 2026-06，详情以官方文档为准。</FreshnessNote>
    </div>
  );
}

/* ================================================================
   Codex 故障排查
   ================================================================ */

export default renderClaudeTutorial;
