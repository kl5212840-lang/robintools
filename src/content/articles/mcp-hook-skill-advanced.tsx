import Image from "next/image";
import archSrc from "@/../public/claude-architecture.png";
import { CodeBlock } from "@/components/content/code-block";
import { Collapsible } from "@/content/guides/_shared";

export function renderMCPHookSkillAdvanced() {
  return (
    <div className="wizard-content">
      {/* ===== 一、扩展体系全景 ===== */}
      <h2 id="overview">一、Claude Code 扩展体系全景</h2>
      <p>
        Claude Code 不是一个封闭的黑盒，而是一个开放的开发平台。通过 MCP（模型上下文协议）、Hook（钩子系统）、Skill（技能系统）、SubAgent（子代理）、Memory（记忆系统）和 Workflow（工作流）六大扩展机制，你可以将 Claude Code 从&ldquo;对话助手&rdquo;扩展为&ldquo;更高效的开发工具&rdquo;。
      </p>

      <figure className="my-6">
        <div
          className="rounded-xl overflow-hidden border"
          style={{
            borderColor: "var(--color-border-subtle)",
            background: "var(--color-surface)",
          }}
        >
          <Image
            src={archSrc}
            alt="Claude Code 扩展体系架构图：本体 → MCP/Hook/Skill/SubAgent 四模块 → Memory+CLAUDE.md+Workflow 共同底座 → 上下文配置底座"
            width={1662}
            height={1132}
            priority
            sizes="(max-width: 768px) 100vw, 720px"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <figcaption
          className="mt-2 text-center text-[13px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Claude Code 扩展体系架构
        </figcaption>
      </figure>

      <p>本文逐一讲解每个扩展机制，并提供可用的完整配置示例。</p>

      <div className="callout callout-warning">
        <strong>⚠️ 核心前提</strong>：
        <ul className="list-disc pl-5 mt-2 space-y-1 text-[14px]">
          <li><strong>Hook、Skill、Memory</strong>：属于 Claude Code 支撑层功能，由 CLI 工具本身调度，不依赖具体模型，API 替换后仍可正常使用</li>
          <li><strong>MCP 工具调用</strong>：依赖模型的 function calling 能力。DeepSeek、GLM 等国内模型<strong>支持</strong> function calling，MCP 可能正常工作，但工具选择和调度精度通常低于 Claude 原生——可能出现漏调、误调、或调用时参数拼接不完整</li>
          <li><strong>SubAgent</strong>：进程由 Claude Code 支撑层管理，但任务分解和结果汇总依赖模型推理质量，替换模型后效果会打折扣</li>
        </ul>
      </div>

      {/* ===== 二、MCP ===== */}
      <h2 id="mcp">二、MCP（模型上下文协议）— 工具扩展</h2>

      <h3>什么是 MCP</h3>
      <p>
        MCP（Model Context Protocol）是 Anthropic 于 2024 年 11 月推出的<strong>大模型工具扩展协议</strong>，核心理念是：让大模型自己决定何时需要调用外部工具，以及调用哪个工具来完成当前任务。
      </p>
      <p>
        与传统的 API 集成不同，MCP 下的大模型是<strong>主控者</strong>——它自己判断&ldquo;这个任务需要用到浏览器&rdquo;还是&ldquo;这个任务需要查询数据库&rdquo;，然后自主发起工具调用。你不需要在每次请求中手动指定使用什么工具。
      </p>

      <h3>MCP 可以连接什么</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>MCP 服务器</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>用途</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>典型使用场景</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">GitHub MCP</td>
              <td className="py-2 pr-4">管理仓库、Issue、PR、Actions</td>
              <td className="py-2">自动创建 Issue、审查 PR、触发 CI/CD</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">PostgreSQL MCP</td>
              <td className="py-2 pr-4">数据库查询与操作</td>
              <td className="py-2">直接在对话中查询和分析数据库数据</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Brave Search MCP</td>
              <td className="py-2 pr-4">网页搜索（Anthropic 官方推荐）</td>
              <td className="py-2">搜索最新技术文档和解决方案</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Tavily MCP</td>
              <td className="py-2 pr-4">技术文档搜索</td>
              <td className="py-2">搜索 API 文档、库函数的准确用法</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Context7 MCP</td>
              <td className="py-2 pr-4">实时编程库文档</td>
              <td className="py-2">查最新版本（非训练数据）的库文档</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Chrome DevTools MCP</td>
              <td className="py-2 pr-4">浏览器控制</td>
              <td className="py-2">抓取需要 JS 渲染的页面、自动化测试</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Perplexity MCP</td>
              <td className="py-2 pr-4">深度研究搜索</td>
              <td className="py-2">需要多轮搜索和综合分析的复杂问题</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>搜索方案全景对比</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>方案</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>前置条件</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>免费额度</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>搜索质量</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>最佳场景</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">内置 WebSearch</td>
              <td className="py-2 pr-4">无需配置</td>
              <td className="py-2 pr-4">无限制</td>
              <td className="py-2 pr-4">★★★</td>
              <td className="py-2">通用搜索</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Brave Search MCP</td>
              <td className="py-2 pr-4">注册 Brave Search API → 获取 Key → 编辑 settings.json</td>
              <td className="py-2 pr-4">2,000 次/月</td>
              <td className="py-2 pr-4">★★★★</td>
              <td className="py-2">常规搜索首选</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Tavily MCP</td>
              <td className="py-2 pr-4">注册 Tavily → 获取 API Key → 编辑 settings.json</td>
              <td className="py-2 pr-4">1,000 次/月</td>
              <td className="py-2 pr-4">★★★★★</td>
              <td className="py-2">技术/API 文档搜索</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Perplexity MCP</td>
              <td className="py-2 pr-4">注册 Perplexity → 获取 API Key → 编辑 settings.json</td>
              <td className="py-2 pr-4">按量付费</td>
              <td className="py-2 pr-4">★★★★★</td>
              <td className="py-2">深度研究、多轮搜索</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Context7 MCP</td>
              <td className="py-2 pr-4">编辑 settings.json 即可（无需 API Key）</td>
              <td className="py-2 pr-4">视版本</td>
              <td className="py-2 pr-4">★★★★</td>
              <td className="py-2">查最新版本文档</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><strong>建议</strong>：至少安装 Brave Search MCP（通用搜索）和 Tavily MCP（技术搜索），覆盖 90% 的日常搜索需求。</p>

      <h3>MCP 配置方法</h3>
      <p>
        MCP 服务器通过 <code>settings.json</code> 中的 <code>mcpServers</code> 字段配置。完整的安装步骤、多服务器配置示例、常见失败原因和排查方法见 <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>。
      </p>

      <h3>MCP 的边界与限制</h3>
      <p>MCP 的核心理念是&ldquo;扩展&rdquo;而非&ldquo;替换&rdquo;。MCP 不会改变 Claude 的推理能力，只是给 Claude 增加了可调用的外部工具。如果你的 Claude Code 本身无法正常工作（例如因为网络限制无法连接 Anthropic API），MCP 服务器也无法挽救——因为每个工具调用都是 Claude 推理决策的结果，推理本身必须发生在 Anthropic 服务器上。</p>
      <p><strong>主模型替换后的影响</strong>：使用 CC Switch 或 settings.json 接口替换将 Claude 代理到第三方模型后，MCP 工具调用<strong>取决于替换模型的 function calling 能力</strong>。DeepSeek、GLM 等主流模型均支持 function calling，MCP 通常可以工作，但工具选择精度和调用一致性不如 Claude 原生——可能出现同一 prompt 下有时调用有时不调用的情况。Hook、Skill、Memory 等 CLI 支撑层功能不受模型替换影响。</p>

      <div className="callout callout-info">
        <strong>深入阅读</strong>：
        MCP 协议架构原理 + JSON-RPC 消息流 → <a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP》</a>；
        MCP 配置实战避坑（backups 缓存、.claude.json 覆盖、Windows 诊断） → <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>。
      </div>
      <p><strong>Mac 版 CLI 端的额外情况</strong>：在 macOS 环境下，为保证 MCP 工具调用权限充足，建议从 <code>Terminal.app</code> 而非 VS Code 集成终端启动 Claude Code CLI。</p>

      {/* ===== 三、Hook ===== */}
      <h2 id="hook">三、Hook（钩子系统）— 在关键节点自动执行</h2>

      <h3>什么是 Hook</h3>
      <p>
        Hook 允许你在 Claude Code 会话的特定生命周期节点自动执行自定义脚本。你可以把它理解为 Claude Code 的&ldquo;事件监听器&rdquo;——当某件事发生时，自动触发你预设的操作。
      </p>

      <h3>Hook 的生命周期事件</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>事件</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>触发时机</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>典型用途</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>SessionStart</code></td>
              <td className="py-2 pr-4">会话开始时</td>
              <td className="py-2">加载项目配置、检查依赖、设置环境变量</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>PreToolUse</code></td>
              <td className="py-2 pr-4">Claude 调用工具前</td>
              <td className="py-2">权限校验、操作日志记录</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>PostToolUse</code></td>
              <td className="py-2 pr-4">Claude 调用工具后</td>
              <td className="py-2">结果处理、自动格式化</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>PreMessage</code></td>
              <td className="py-2 pr-4">Claude 生成回复前</td>
              <td className="py-2">插入上下文信息</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>Notification</code></td>
              <td className="py-2 pr-4">收到特定通知时</td>
              <td className="py-2">外部事件响应</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><code>Stop</code></td>
              <td className="py-2 pr-4">会话结束时</td>
              <td className="py-2">清理临时文件、保存状态</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>实战示例：Git 提交前自动 lint</h3>
      <p>这是一个生产环境可用的 Hook 配置——在 Claude Code 执行 git commit 前自动运行 lint 检查，不通过则阻止提交。</p>
      <p><strong>配置文件</strong>：<code>.claude/hooks/pre-commit.json</code></p>
      <CodeBlock language="json" code={`{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": {
        "tool": "Bash",
        "command_pattern": "git commit.*"
      },
      "action": {
        "type": "shell",
        "command": "npm run lint && npm run test -- --passWithNoTests"
      },
      "on_failure": "block",
      "message": "Lint 或测试未通过，提交已阻止。请修复后再提交。"
    }
  ]
}`} />

      <div className="callout callout-warning">
        <strong><code>on_failure: &ldquo;block&rdquo;</code> 的拦截范围</strong>：此设置<strong>仅拦截 bash/shell 类指令</strong>的执行。Claude Code 的原生内置工具（如文件读写、代码编辑等内置操作）不受 Hook 拦截，<code>block</code> 对它们无效。如果你的使用场景需要拦截内置工具调用，Hook 无法满足此需求。
      </div>

      <h3>实战示例：会话启动时自动加载项目信息</h3>
      <p><strong>配置文件</strong>：<code>.claude/hooks/session-start.json</code></p>
      <CodeBlock language="json" code={`{
  "hooks": [
    {
      "event": "SessionStart",
      "action": {
        "type": "shell",
        "command": "echo '当前分支: $(git branch --show-current) | 最近提交: $(git log -1 --oneline) | 修改文件: $(git diff --name-only)'"
      }
    }
  ]
}`} />
      <p>这样每次开启新会话时，Claude 自动获得当前的 Git 状态上下文。</p>

      <h3>Hook 配置位置</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>级别</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>路径</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>作用范围</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">项目级</td>
              <td className="py-2 pr-4"><code>.claude/hooks/</code></td>
              <td className="py-2">仅当前项目</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">用户级</td>
              <td className="py-2 pr-4"><code>~/.claude/hooks/</code></td>
              <td className="py-2">所有项目</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Hook 编写注意事项</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Hook 脚本必须可执行（Linux/macOS 下需 <code>chmod +x</code>）</li>
        <li>Hook 默认超时时间为 <strong>30 秒</strong>，超时会自动取消执行。用户可在 Hook 配置中通过 <code>timeout</code> 字段自定义超时值（单位：秒）</li>
        <li>Hook 的执行结果会显示在 Claude Code 的终端输出中</li>
        <li>不要在 Hook 中执行耗时操作，否则会阻塞 Claude Code 的主流程</li>
        <li><code>on_failure: &ldquo;block&rdquo;</code> 会阻止原始 shell 操作，<code>&ldquo;warn&rdquo;</code> 只会提示但允许继续</li>
      </ul>

      <Collapsible summary="生产级 Hook 示例：pre-commit 自动格式化 + SessionStart 日志">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-secondary)" }}><strong>示例 1：pre-commit 自动 ESLint 格式化</strong></p>
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          以下 Hook 在每次 commit 前自动运行 ESLint 检查，有错误则阻止提交：
        </p>
        <CodeBlock language="json" code={`// .claude/settings.json
{
  "hooks": {
    "pre-commit": [
      {
        "matcher": "*.{ts,tsx,js,jsx}",
        "command": "npx eslint --fix \"$CLAUDIO_FILE\"",
        "on_failure": "block"
      }
    ]
  }
}`} />
        <p className="text-[14px] mt-3" style={{ color: "var(--color-text-secondary)" }}><strong>示例 2：SessionStart 环境健康检查</strong></p>
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          每次启动 Claude Code 时自动检查 Node.js 版本和 Git 状态：
        </p>
        <CodeBlock language="bash" code={`# ~/.claude/hooks/session-check.sh (chmod +x)
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Git branch: $(git branch --show-current 2>/dev/null || echo 'not a git repo')"
echo "Disk free: $(df -h . | tail -1 | awk '{print $4}')"`} />
        <p className="text-[14px] mt-3" style={{ color: "var(--color-text-secondary)" }}><strong>示例 3：PostToolUse 操作日志</strong></p>
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          记录每次文件编辑操作到审计日志：
        </p>
        <CodeBlock language="json" code={`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "echo \"[$(date -Iseconds)] \$CLAUDIO_TOOL_NAME: \$CLAUDIO_FILE_PATH\" >> ~/.claude/audit.log"
      }
    ]
  }
}`} />
      </Collapsible>

      {/* ===== 四、Skill ===== */}
      <h2 id="skill">四、Skill（技能系统）— 可复用的专业化指令</h2>

      <h3>什么是 Skill</h3>
      <p>
        Skill 是可复用的、场景化的指令集。它告诉 Claude Code &ldquo;在执行特定类型的任务时，应该遵循什么流程、使用什么工具、输出什么格式&rdquo;。本质上，Skill 是将&ldquo;最佳实践&rdquo;固化为&ldquo;自动响应模式&rdquo;。
      </p>

      <h3>Skill 的类型</h3>
      <p>Claude Code 支持两类 Skill：</p>
      <p><strong>内置 Skill</strong>（运行环境提供）：PPT 制作 Skill、Skill Creator Skill 等</p>
      <p><strong>自定义 Skill</strong>（用户创建）：存放在 <code>.claude/skills/</code> 目录，可在 CLAUDE.md 或会话中调用，格式为 Markdown 或 JSON。</p>

      <h3>创建你的第一个自定义 Skill</h3>
      <p>假设你经常需要 Claude 帮你按照特定模板生成 API 接口代码。</p>
      <p><strong>文件</strong>：<code>.claude/skills/api-generator.md</code></p>
      <CodeBlock language="markdown" code={`---
name: api-generator
description: 按团队规范生成 REST API 接口代码
---

# API 接口生成器

## 适用范围
当用户要求"创建 API 接口"、"生成接口代码"
或"写一个 endpoint"时，自动激活。

## 工作流

1. **确认需求**
   - HTTP 方法和路径
   - 请求参数和响应格式
   - 是否需要身份验证

2. **生成代码**（遵循以下规范）
   - 使用 TypeScript，类型定义完整
   - 输入校验使用 Zod
   - 错误处理使用统一的错误码格式
   - 数据库查询使用 Prisma ORM

3. **同时生成**
   - 接口的主要代码文件
   - 对应的单元测试（Jest）
   - API 文档注释（JSDoc 格式）

## 输出格式
每生成一个接口，输出包含：
1. 接口文件路径和完整代码
2. 测试文件路径和完整代码
3. 简要的使用说明（3-5 条要点）`} />
      <p>创建完成后，在对话中输入 <code>/skill api-generator</code> 即可调用。</p>

      <h3>Skill 的自动触发与手动调用</h3>
      <p>Skill 支持两种激活方式：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>自动触发</strong>：Claude 根据 prompt 内容自动匹配相关的 Skill。但自动匹配机制偶有识别失误——当你的需求描述不够明确或与 Skill 的适用范围措辞不完全匹配时，Claude 可能不会自动激活 Skill，导致&ldquo;明明有 Skill 但没生效&rdquo;的困惑</li>
        <li><strong>手动调用</strong>：使用 <code>/skill &lt;name&gt;</code> 命令显式调用。对于复杂或关键任务，<strong>建议优先使用手动调用</strong>以确保 Skill 确实被加载</li>
      </ul>

      <h3>Skill 编写最佳实践</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>原则</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>说明</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>单一职责</strong></td>
              <td className="py-2">每个 Skill 只做一类事。不要写&ldquo;万能 Skill&rdquo;</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>触发描述清晰</strong></td>
              <td className="py-2">在&ldquo;适用范围&rdquo;中用具体的触发语句，帮助 Claude 准确匹配</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>步骤化</strong></td>
              <td className="py-2">用编号列表描述工作流，而不是大段文字</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>包含示例</strong></td>
              <td className="py-2">在 Skill 中附上典型的输入和期望输出</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>版本管理</strong></td>
              <td className="py-2">Skill 文件纳入 Git 管理，团队共享</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 五、SubAgent ===== */}
      <h2 id="subagent">五、SubAgent（子代理）— 并行处理多任务</h2>

      <h3>什么是 SubAgent</h3>
      <p>
        SubAgent 是 Claude Code 的并行任务执行机制。当遇到可以并行处理的任务时，Claude 会自动派发多个子代理同时工作，每个子代理独立执行一个子任务，完成后汇总结果。
      </p>

      <h3>何时触发 SubAgent</h3>
      <p>你不需要手动创建 SubAgent——在 prompt 中使用以下模式即可自动触发：</p>
      <CodeBlock language="text" code={`帮我同时调研 A 和 B
比对这三个方案的区别
并行检查以下 5 个文件的安全性`} />
      <p>关键词：<strong>&ldquo;同时&rdquo;、&ldquo;并行&rdquo;、&ldquo;一次性&rdquo;、&ldquo;一起&rdquo;</strong></p>

      <div className="callout callout-info">
        <strong>自动触发的局限</strong>：与 Skill 类似，SubAgent 的自动触发机制偶有识别失误——尤其是在任务规模较小、并行收益不明显时，Claude 可能选择顺序执行而非并行。如果你明确需要并行处理，建议在 prompt 中显式使用&ldquo;同时&rdquo;、&ldquo;并行&rdquo;等措辞来提升触发概率。
      </div>

      <h3>SubAgent 的适用场景</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>场景</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>示例 Prompt</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">并行调研</td>
              <td className="py-2">&ldquo;帮我同时调研 React 19 和 Vue 4 的新特性&rdquo;</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">批量文件处理</td>
              <td className="py-2">&ldquo;将这 10 个 JSON 文件一起转为 TypeScript 类型定义&rdquo;</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">多维度审查</td>
              <td className="py-2">&ldquo;并行审查这段代码的安全性、性能和可维护性&rdquo;</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">多语言输出</td>
              <td className="py-2">&ldquo;一次性生成英文、日文、韩文的 i18n 翻译文件&rdquo;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>SubAgent 的限制</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>SubAgent 有独立的上下文窗口，不会污染主会话上下文</li>
        <li>每个 SubAgent 完成任务后将结果返回给主 Claude，主 Claude 负责汇总</li>
        <li>SubAgent 之间不能互相通信</li>
        <li><strong>三重并发限制</strong>：SubAgent 的并发数量同时受制于三个因素——① 你的 Claude 订阅计划等级、② 本地硬件资源（CPU/内存/磁盘 I/O）、③ 当前会话的 token 预算。当其中任一资源紧张时，系统会自动降低并发数，这是正常现象而非故障。批量任务的实际并发数可能远低于你传入的任务数量</li>
      </ul>

      <Collapsible summary="SubAgent 运行机制与效率对比">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>SubAgent 是如何工作的</strong>：每个 SubAgent 是独立的进程（非 fork/线程），拥有独立的上下文窗口。
          主 Claude 生成一段系统指令（包含任务描述 + 必要的文件上下文），派发给子进程。
          子进程完成任务后返回结果给主 Claude，主 Claude 汇总并继续对话。
          子进程之间互不通信，不会互相污染上下文。
        </p>
        <p className="text-[14px] mt-3" style={{ color: "var(--color-text-secondary)" }}>
          <strong>Pro vs Max 用户的并发差异</strong>：Pro 用户通常限制在 2-3 个并发 SubAgent；
          Max 用户在理想条件下可支持 5-8 个并发。实际并发数还取决于当前会话的 token 预算和本地 CPU/内存资源。
        </p>
        <p className="text-[14px] mt-3" style={{ color: "var(--color-text-secondary)" }}>
          <strong>顺序执行 vs 并行执行的 wall-clock 对比（估算）</strong>：
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>任务</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>顺序（逐个做）</th>
                <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>并行（SubAgent）</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--color-text-secondary)" }}>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <td className="py-2 pr-4">3 个框架调研</td>
                <td className="py-2 pr-4">~15 分钟</td>
                <td className="py-2">~6 分钟</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <td className="py-2 pr-4">5 个文件安全审查</td>
                <td className="py-2 pr-4">~20 分钟</td>
                <td className="py-2">~8 分钟</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">10 个 JSON → TypeScript 类型</td>
                <td className="py-2 pr-4">~30 分钟</td>
                <td className="py-2">~10 分钟</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          以上为典型场景估算，实际耗时取决于任务复杂度、模型版本和资源可用性。并行任务的瓶颈通常是最后一个完成的 SubAgent（木桶效应）。
        </p>
      </Collapsible>

      {/* ===== 六、Memory 与 CLAUDE.md ===== */}
      <h2 id="memory">六、Memory 记忆系统与 CLAUDE.md</h2>

      <h3>Memory 系统</h3>
      <p>Claude Code 拥有一个持久化的记忆系统，存储在 <code>.claude/memory/</code> 目录下。它可以：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>自动记录你的偏好（使用的技术栈、命名风格等）</li>
        <li>记住你纠正过的问题（&ldquo;上次你说这个 API 应该用 v2 版本&rdquo;）</li>
        <li>跨会话保持项目相关的上下文</li>
      </ul>
      <p>记忆以 Markdown 文件形式存储，每个文件记录一个事实，带有 frontmatter 元数据。你可以手动添加/编辑记忆文件，Claude 也会自动写入重要信息。</p>

      <h3>CLAUDE.md — 项目的&ldquo;说明书&rdquo;</h3>
      <p><code>CLAUDE.md</code> 是 Claude Code 的<strong>项目配置文件</strong>，放在项目根目录下。它在每个会话启动时被自动读取，定义了项目的技术栈、编码规范、常用命令和项目特定的约束。</p>

      <h3>架构位置的正确理解</h3>
      <div className="callout callout-info">
        <strong>Memory 和 CLAUDE.md 是上下文配置底座，而非独立的执行引擎。</strong>它们的作用是：为 Claude 的推理提供持久化的背景信息、在会话启动时自动注入上下文从而减少重复说明。它们本身不执行任何代码或自动化操作——这与 MCP（外部工具调用）和 Hook（事件驱动的自动脚本）有关键差异，后两者是执行机制，前者是信息供给机制。
      </div>

      <h3>上下文管理命令</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>命令</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>作用</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>/compact</code></td>
              <td className="py-2">压缩当前会话历史（保留关键信息，释放上下文空间）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>/clear</code></td>
              <td className="py-2">清空当前会话历史</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>/reset</code></td>
              <td className="py-2">重置会话，包括所有中间状态</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><code>/context</code></td>
              <td className="py-2">查看当前上下文使用情况（已占用 token 数）</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 七、其他功能 ===== */}
      <h2 id="other-features">七、其他功能</h2>

      <h3>后台任务</h3>
      <p>Claude Code 支持将耗时任务（构建、测试、部署）放到后台执行，不阻塞对话。在命令末尾加上 <code>&</code> 即可在后台运行。</p>
      <CodeBlock language="text" code={`/tasks          # 查看所有后台任务的状态
/task <id>      # 查看特定任务的详细进度`} />

      <h3>Workflow（工作流）</h3>
      <p>预定义的自动化工作流，用于编排复杂的多步骤任务。工作流本质上是确定性的脚本（JavaScript），精确控制多个 SubAgent 的执行顺序和协作方式。</p>
      <CodeBlock language="text" code={`/workflows       # 列出所有可用工作流
/运行指定工作流   # 在 Claude Code 会话中通过对话触发`} />
      <p>Workflow 适合的场景：发布流程（lint → test → build → deploy → notify）、代码审查（静默扫描 → 分类 → 并行验证 → 汇总报告）、数据迁移（发现 → 生成迁移脚本 → 逐个执行 → 验证 → 回滚准备）。</p>

      <h3>图片处理</h3>
      <p>Claude Code 支持以下图片输入方式：直接拖入终端窗口、使用文件路径引用、通过 MCP 连接图像处理工具。图片可用于 UI 审查、截图分析、图表识别、设计评审等场景。</p>

      <h3>自定义别名</h3>
      <CodeBlock language="bash" code={`# 在 settings.json 中配置自定义别名（如支持），或使用 shell alias
# alias deploy="npm run lint && npm run build && git push origin main"`} />

      {/* ===== 八、综合实战 ===== */}
      <h2 id="workshop">八、综合实战：搭建一个完整的开发工作站</h2>

      <h3>目录结构</h3>
      <CodeBlock language="text" code={`项目根目录/
├── CLAUDE.md                  # 项目说明书（上下文配置底座）
├── .claude/
│   ├── skills/
│   │   ├── api-generator.md   # API 接口生成 Skill
│   │   └── code-review.md     # 代码审查 Skill
│   ├── hooks/
│   │   ├── pre-commit.json    # 提交前 lint 检查
│   │   └── session-start.json # 会话启动加载状态
│   └── memory/                # 自动记忆目录
│
└── ~/.claude/
    └── settings.json           # MCP 服务器配置（用户级，CLI/桌面共用）`} />

      <div className="callout callout-info">
        <strong>注意</strong>：MCP 配置统一放在 <code>~/.claude/settings.json</code>（Windows: <code>C:\Users\你的用户名\.claude\settings.json</code>）中，CLI 端和桌面端共用同一个配置文件。如果需要为某个项目单独配置 MCP，可以使用项目根目录的 <code>.claude/settings.local.json</code>（优先级更高）。
      </div>

      <h3>功能组合表</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>场景</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>涉及功能</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>效果</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">每天开始工作</td>
              <td className="py-2 pr-4">CLAUDE.md + SessionStart Hook + Memory</td>
              <td className="py-2">自动加载项目上下文、Git 状态、历史偏好</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">创建新接口</td>
              <td className="py-2 pr-4">api-generator Skill + Zod Schema</td>
              <td className="py-2">一次对话生成接口代码 + 测试 + 文档</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">提交代码前</td>
              <td className="py-2 pr-4">PreToolUse Hook（git commit 匹配）</td>
              <td className="py-2">自动运行 lint + test，不通过则阻止提交</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">调研新技术</td>
              <td className="py-2 pr-4">Brave Search MCP + Tavily MCP + SubAgent</td>
              <td className="py-2">并行搜索多个来源，交叉验证，生成调研报告</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">代码审查</td>
              <td className="py-2 pr-4">code-review Skill + SubAgent</td>
              <td className="py-2">并行审查安全性、性能、可维护性</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">部署发布</td>
              <td className="py-2 pr-4">Workflow</td>
              <td className="py-2">lint → test → build → deploy → 通知</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">上下文过长</td>
              <td className="py-2 pr-4">/compact</td>
              <td className="py-2">压缩历史，保留关键信息</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>渐进式搭建建议</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>第 1 周</strong>：写好 CLAUDE.md（描述项目和技术栈）→ 你会立刻感受到 Claude 的理解力提升</li>
        <li><strong>第 2 周</strong>：安装 1-2 个 MCP 服务器（Brave Search + 项目相关的数据库/API MCP）→ CLI 端和桌面端共用 settings.json，只需配置一次</li>
        <li><strong>第 3 周</strong>：添加 1-2 个 Hook（SessionStart + PreToolUse for git commit）→ 自动化重复检查</li>
        <li><strong>第 4 周</strong>：创建 1-2 个 Skill（高频重复任务的模板）→ 一致性提升。复杂任务建议手动 <code>/skill</code> 调用</li>
        <li><strong>之后</strong>：根据需要逐步添加更多 MCP、Hook、Skill、Workflow</li>
      </ol>

      {/* ===== 九、总结 ===== */}
      <h2 id="summary">九、总结</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>机制</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>概述</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>类比</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>MCP</strong></td>
              <td className="py-2 pr-4">让 Claude 调用外部工具</td>
              <td className="py-2">连接外部工具和服务</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Hook</strong></td>
              <td className="py-2 pr-4">在关键节点自动执行 shell 指令</td>
              <td className="py-2">CI/CD 的触发器</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Skill</strong></td>
              <td className="py-2 pr-4">可复用的专业模板</td>
              <td className="py-2">VS Code 的 Snippet</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>SubAgent</strong></td>
              <td className="py-2 pr-4">并行处理多任务（受三重限制）</td>
              <td className="py-2">多线程执行</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Memory + CLAUDE.md</strong></td>
              <td className="py-2 pr-4">上下文配置底座（非执行引擎）</td>
              <td className="py-2">项目的 onboarding doc</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Workflow</strong></td>
              <td className="py-2 pr-4">编排多步骤自动化</td>
              <td className="py-2">GitHub Actions</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>这些功能的主要用途不是单个功能有多强，而在于<strong>组合使用</strong>——一个配置合理的 Claude Code 工作站的开发效率可以高于默认配置。</p>

      <div className="callout callout-warning">
        <strong>但需要注意的前提是</strong>：MCP 工具调用和 SubAgent 任务执行的质量依赖模型推理能力。API 替换为国内模型后，Hook、Skill、Memory 等支撑层功能不受影响；MCP 通常可用但工具选择精度可能下降；SubAgent 的任务分解质量取决于替换模型的推理水平。
      </div>

      <Collapsible summary="备注与免责声明">
        <hr className="my-6" style={{ borderColor: "var(--color-border-subtle)" }} />
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 1</strong>：本文基于 2026 年 6 月 Claude Code v2.x 版本功能编写。MCP 服务器列表、Hook 事件类型、Skill 系统等均可能随 Claude Code 版本迭代而变更，实际操作请以官方最新文档为准。
        </p>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 2</strong>：文中所涉方案和配置仅限个人学习研究用途。如需商用，请遵守中华人民共和国相关法律法规以及各平台 API 服务协议中的商用条款。
        </p>
      </Collapsible>
    </div>
  );
}
