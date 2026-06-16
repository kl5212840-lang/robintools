import { ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";
import { Callout, Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderDeepSeekGuide() {
  return (
    <div className="wizard-content">
      {/* ===== 一、方案背景 ===== */}
      <h2 id="background">一、方案背景与核心前提</h2>
      <p>
        本方案旨在解决 Claude Code 开发成本过高的问题——通过 Anthropic 官方 MCP（模型上下文协议）实现<strong>双模型协同</strong>：Claude 保留全部核心推理能力，DeepSeek 作为外部工具承担重复性任务，在不损失核心开发能力的前提下，<strong>将整体 API 成本降低约 55%</strong>（CRUD 密集型任务降幅更大）。
      </p>

      <div className="callout callout-warning">
        <strong>⚠️ 建议先理解</strong>：本文讨论的是 MCP 挂载方案（Claude + DeepSeek 协同），不是 API 替换方案（用 DeepSeek 完全替代 Claude）。两者的工作原理、适用场景和限制完全不同。混淆这两者会导致&ldquo;配置成功但不生效&rdquo;的困惑。
      </div>

      <Collapsible summary="AI 代劳">
        <div className="callout callout-info">
          本文包含的命令和配置均可交由 AI 编程工具（Claude Code、Codex CLI、Cursor 等）代劳——选取需要的部分发送即可。详见{" "}
          <a href="/articles/ai-pair-workflow" style={{ color: "var(--color-accent)" }}>「阅读本站前」</a>。
        </div>
      </Collapsible>

      {/* ===== 二、API vs MCP ===== */}
      <h2 id="api-vs-mcp">二、核心概念讲解：API vs MCP</h2>

      <h3>API（应用程序编程接口）</h3>
      <p>
        API 是一种通用的标准化跨系统通信协议。在大模型领域，API 的典型用法是：<strong>客户端向模型服务商发请求 → 服务商执行推理 → 返回结果</strong>。整个过程中客户端不参与任何推理逻辑，仅作为输入输出的交互界面。
      </p>

      <h3>MCP（模型上下文协议）</h3>
      <p>
        MCP 是 Anthropic 于 2024 年 11 月专为大模型推出的<strong>工具扩展协议</strong>。其核心理念是让大模型自主调用外部工具来增强自身能力，而不是替换自身。
      </p>
      <p>
        与 API 的关键差异：<strong>MCP 不是让一个模型替代另一个模型，而是让外部服务成为大模型的&ldquo;手脚&rdquo;</strong>。大模型仍然是整个流程的主控者，负责决策、规划和判断，仅在需要特定能力时主动调用外部工具。
      </p>

      <h3>概念与方案的对应关系</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>方案</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>本质</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">API 替换方案（CC Switch / 手动改 settings.json）</td>
              <td className="py-2"><strong>用 DeepSeek 完全替代 Claude 的推理</strong>。Claude 仅作为前端界面，所有推理由 DeepSeek 独立完成。</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>MCP 挂载方案（本文方案）</strong></td>
              <td className="py-2"><strong>DeepSeek 作为 Claude 的外部工具</strong>。Claude 是主控者，仅在需要时主动调用 DeepSeek 完成特定任务。</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 三、两种方案对比 ===== */}
      <h2 id="comparison">三、两种主流结合方案的核心差异</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>对比维度</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>API 替换方案</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>MCP 挂载方案（本文）</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>核心推理引擎</strong></td>
              <td className="py-2 pr-4">DeepSeek</td>
              <td className="py-2">Claude（主）+ DeepSeek（辅）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>是否需 Claude API</strong></td>
              <td className="py-2 pr-4">不需要</td>
              <td className="py-2"><strong>必须</strong>（Claude 是主控者）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>架构设计/复杂推理</strong></td>
              <td className="py-2 pr-4">DeepSeek 完成（能力有降级）</td>
              <td className="py-2">Claude 原生完成（无损）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>合规性</strong></td>
              <td className="py-2 pr-4">接口兼容方案，非官方支持</td>
              <td className="py-2">基于 Anthropic 公开协议</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>国内网络要求</strong></td>
              <td className="py-2 pr-4">无需科学上网</td>
              <td className="py-2"><strong>必须能访问 Anthropic API</strong></td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>成本节省</strong></td>
              <td className="py-2 pr-4">~90%（Claude API 完全不用）</td>
              <td className="py-2">~55%（Claude 只做高价值任务）</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 四、关键问题 ===== */}
      <h2 id="network-clarification">四、关键澄清：国内网络环境下的方案有效性</h2>

      <div className="callout callout-danger">
        <strong>明确结论</strong>：如果你<strong>无法访问 Anthropic API</strong>（包括网络限制导致 Claude Code 本身无法正常使用），<strong>本 MCP 挂载方案无效</strong>，且不会带来任何能力提升。
      </div>

      <h3>技术原理</h3>
      <p>MCP 挂载方案的工作流程：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>用户向 Claude Code 发送请求</li>
        <li><strong>Claude Code 将请求发送至 Anthropic 服务器进行推理</strong> ← 核心步骤</li>
        <li>Claude 判断是否需要调用外部工具</li>
        <li>如需调用 → 本地 MCP 服务器 → DeepSeek API → 返回结果 → Claude 整合</li>
      </ol>
      <p>从流程可以看出：<strong>如果第 2 步无法完成（Claude 本身不能联网推理），整个流程在第 2 步就中断了</strong>，根本无法到达调用 DeepSeek 的环节。</p>

      <h3>常见误区</h3>
      <p>很多用户误以为 MCP 挂载是&ldquo;把 DeepSeek 的能力加到 Claude 里，让 Claude 变成 DeepSeek&rdquo;。这是完全错误的理解：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>MCP 是工具扩展，不是模型替换</strong></li>
        <li>它不会改变 Claude 的推理能力，只是给 Claude 增加了一个可调用的工具</li>
        <li>没有 Claude 的核心推理能力，这个工具就没有任何存在的意义</li>
      </ul>

      <div className="callout callout-info">
        <strong>网络环境选择建议</strong>：能访问 Claude API → 用本文 MCP 方案（兼顾能力与成本）；无法访问 Claude API → 用 API 替换方案（CC Switch 或手动配置，参见配置指南）；本地开发环境 → 考虑本地部署开源模型。
      </div>

      {/* ===== 五、前置准备 ===== */}
      <h2 id="prerequisites">五、前置准备</h2>
      <ol className="list-decimal pl-5 space-y-2 text-[16px]">
        <li>安装最新版 Claude Code（桌面端 / 命令行端均可）</li>
        <li><strong>确保能正常访问 Anthropic API</strong> 并拥有可用的 Claude 账号</li>
        <li>注册 DeepSeek 账号并获取 API 密钥：<a href="https://platform.deepseek.com/" target="_blank" rel="noopener">platform.deepseek.com <ExternalLink className="inline h-3 w-3" /></a></li>
        <li>确保系统已安装 Node.js 18 及以上版本</li>
      </ol>

      {/* ===== 六、部署步骤 ===== */}
      <h2 id="deployment">六、完整部署步骤</h2>

      <div className="callout callout-info">
        <strong>npm 包来源</strong>：本文使用的 <code>deepseek-mcp-server</code> 由社区维护（GitHub: DMontgomery40/deepseek-mcp-server），
        MIT 协议开源，提供 chat_completion、list_models、get_user_balance 等 6 个工具。
        另一个流行选择是 <code>@arikusi/deepseek-mcp-server</code>（支持 reasoning、多轮会话、成本追踪），可按需切换。
        两个包均可通过 <code>npx</code> 直接运行，无需手动 clone。
      </div>

      <h3>6.1 安装 MCP DeepSeek 服务器</h3>
      <p>在终端执行以下命令全局安装。如果不想全局安装，可跳过此步，配置中直接用 <code>npx -y deepseek-mcp-server</code>：</p>

      <h4>Windows（PowerShell）</h4>
      <CodeBlock language="powershell" code={`npm install -g deepseek-mcp-server`} />

      <h4>macOS / Linux</h4>
      <CodeBlock language="bash" code={`npm install -g deepseek-mcp-server`} />

      <h3>6.2 配置文件编写</h3>
      <p>编辑 <code>~/.claude/settings.json</code>（Windows: <code>%USERPROFILE%\.claude\settings.json</code>），添加 <code>mcpServers</code> 块：</p>

      <CodeBlock language="json" mode="unified" code={`{
  "mcpServers": {
    "deepseek": {
      "command": "npx",
      "args": ["-y", "deepseek-mcp-server"],
      "env": {
        "DEEPSEEK_API_KEY": "你的-DeepSeek-API-Key"
      }
    }
  }
}`} />

      <Callout type="warning" summary="Windows 用户注意">
        <ul className="list-disc pl-5 space-y-1 text-[14px]">
          <li>如果 <code>npx</code> 提示找不到命令，将 <code>command</code> 改为 <code>npx.cmd</code></li>
          <li>如果仍不生效，检查 <code>.claude.json</code>（项目级）是否覆盖了 <code>settings.json</code>（全局）——详见{" "}
            <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>MCP 配置避坑指南</a>
          </li>
        </ul>
      </Callout>

      <h3>6.3 验证部署</h3>
      <CodeBlock language="text" code={`# 重启 Claude Code 后输入
/mcp

# 成功输出示例：
#  deepseek (stdio) ✓ connected
#     Tools: chat_completion, completion, list_models,
#            get_user_balance, reset_conversation, list_conversations

# 如果未显示 deepseek → 检查 settings.json 路径和 JSON 语法

# 测试第一次调用
使用 DeepSeek 工具生成一个 Python 冒泡排序函数，并解释复杂度`} />

      <Collapsible summary="首次使用实录：一个完整的对话示例">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-muted)" }}>以下是一次真实会话的简化还原（Claude Opus + DeepSeek V4 Flash）：</p>
        <CodeBlock language="text" code={`用户：
> 使用 DeepSeek 工具，帮我写一个 TypeScript 的防抖函数 debounce，
> 要支持 leading/trailing 选项和 cancel 方法

Claude 回应：
我先让 DeepSeek 生成这个防抖函数的基础实现。
[调用 deepseek → chat_completion]

DeepSeek 返回：
export function debounce<T extends (...args: any[]) => any>(
  fn: T, delay: number, options?: { leading?: boolean; trailing?: boolean }
): T & { cancel: () => void } { ... }

Claude 继续：
DeepSeek 给了基础实现。我审查后发现几点需要修正：
1. TypeScript 泛型约束可以更严格
2. cancel 方法的 this 绑定需要箭头函数
3. 建议加 AbortSignal 支持用于现代用法
以下是优化后的最终版本：...

💡 要点：
- Claude 始终在审查和整合 DeepSeek 的输出，不是直接返回
- 需要显性写出"使用 DeepSeek 工具"，不然 Claude 不会调用
- 复杂逻辑（AbortSignal 支持）由 Claude 补充，DeepSeek 做不到`} />
      </Collapsible>

      <Collapsible summary="成本计算">
        <p className="text-[14px] mt-2">以下为一次典型开发会话的 Token 分布估算（基于 Claude Opus + DeepSeek V4 Pro 定价）：</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>任务类型</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>执行者</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Input Token</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Output Token</th>
                <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>费用 (USD)</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--color-text-secondary)" }}>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <td className="py-2 pr-4">架构设计、代码审查</td>
                <td className="py-2 pr-4">Claude Opus</td>
                <td className="py-2 pr-4">20,000</td>
                <td className="py-2 pr-4">3,000</td>
                <td className="py-2">$0.375</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <td className="py-2 pr-4">CRUD、测试、文档生成</td>
                <td className="py-2 pr-4">DeepSeek V4 Pro</td>
                <td className="py-2 pr-4">30,000</td>
                <td className="py-2 pr-4">8,000</td>
                <td className="py-2">$0.020</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <td className="py-2 pr-4"><strong>双模型合计</strong></td>
                <td className="py-2 pr-4" colSpan={3}></td>
                <td className="py-2"><strong>$0.395</strong></td>
              </tr>
              <tr>
                <td className="py-2 pr-4" style={{ color: "var(--color-text-muted)" }}>对照：全部 Claude Opus</td>
                <td className="py-2 pr-4" style={{ color: "var(--color-text-muted)" }}>Claude Opus</td>
                <td className="py-2 pr-4" style={{ color: "var(--color-text-muted)" }}>50,000</td>
                <td className="py-2 pr-4" style={{ color: "var(--color-text-muted)" }}>11,000</td>
                <td className="py-2" style={{ color: "var(--color-text-muted)" }}>$0.885</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>实际节省</strong>：($0.885 - $0.395) / $0.885 ≈ <strong>55%</strong>。节省幅度取决于任务中可委托给 DeepSeek 的比例——架构密集型会话节省较少，CRUD 密集型会话节省更多。
        </p>
      </Collapsible>

      {/* ===== 七、使用规范 ===== */}
      <h2 id="usage-rules">七、上线使用规范</h2>

      <h3>7.1 ⚠️ 强制显性调用规则</h3>
      <p>Claude 默认<strong>不会主动调用新挂载的工具</strong>——这是导致&ldquo;配置成功但不生效&rdquo;的最主要原因。所有需要使用 DeepSeek 的请求，<strong>需要加入显性调用指令</strong>。</p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>✅ 正确（会触发 DeepSeek）</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>❌ 错误（不会触发）</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>使用 DeepSeek 工具生成用户登录接口的代码</code></td>
              <td className="py-2"><code>生成用户登录接口的代码</code></td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>调用 DeepSeek 修复以下代码中的语法错误</code></td>
              <td className="py-2"><code>修复以下代码中的语法错误</code></td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><code>让 DeepSeek 编写这个组件的单元测试</code></td>
              <td className="py-2"><code>编写这个组件的单元测试</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>7.2 任务分工建议</h3>
      <p>为实现能力与成本的最优平衡，建议按以下原则分配：</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Claude 原生执行（高价值）</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>委托 DeepSeek（低价值）</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">项目整体架构设计</td>
              <td className="py-2">简单函数与类的编写</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">复杂业务逻辑拆解</td>
              <td className="py-2">重复的 CRUD 操作代码生成</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">代码安全审核与性能优化</td>
              <td className="py-2">单元测试编写</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">跨模块接口设计</td>
              <td className="py-2">文档与注释生成</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">疑难问题排查与调试</td>
              <td className="py-2">代码格式化与重构</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>7.3 最佳实践</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>会话开始时明确分工</strong>：&ldquo;接下来的开发中，所有简单代码生成任务都使用 DeepSeek 工具完成，架构设计和代码审核由你自己执行&rdquo;</li>
        <li><strong>复杂功能先设计再实现</strong>：让 Claude 给出设计方案 → DeepSeek 根据方案生成具体代码</li>
        <li><strong>DeepSeek 代码必须审核</strong>：所有 DeepSeek 生成的代码，先经 Claude 审查后再使用</li>
      </ul>

      {/* ===== 八、安全 ===== */}
      <h2 id="security">八、安全与运维规范</h2>
      <ul className="list-disc pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>API 密钥管理</strong>：密钥存储在环境变量中，禁止硬编码或提交到版本控制系统</li>
        <li><strong>预算控制</strong>：在 DeepSeek 平台设置每日调用预算上限，达到上限自动停止</li>
        <li><strong>日志管理</strong>：开启 Claude Code 调用日志功能，保留完整工具调用记录</li>
        <li><strong>版本更新</strong>：定期更新 MCP 服务器与 Claude Code 版本，获取最新安全修复</li>
        <li><strong>权限控制</strong>：不要将配置好的 Claude Code 实例共享给他人</li>
      </ul>

      {/* ===== 九、排查 ===== */}
      <h2 id="troubleshoot">九、常见问题排查</h2>
      <div className="space-y-4">
        <div className="callout callout-danger">
          <strong>❌ /mcp 看不到 deepseek 工具</strong><br />
          检查 settings.json 路径是否正确（Windows: <code>%USERPROFILE%\.claude\settings.json</code>）；确认 JSON 语法有效（逗号、括号配对数）；<code>npm list -g deepseek-mcp-server</code> 确认包已安装；完全退出并重启 Claude Code。
        </div>
        <div className="callout callout-warning">
          <strong>⚠️ 配置正确但 Claude 不调用 DeepSeek</strong><br />
          确保请求中包含<strong>显性调用指令</strong>（如"使用 DeepSeek 工具..."）。如果文中已写明但仍不调用，尝试 `/compact` 后重新发送——长会话中早期上下文会压制新工具触发。
        </div>
        <div className="callout callout-danger">
          <strong>❌ Windows 提示 "npx 不是内部或外部命令"</strong><br />
          确保 Node.js 已安装（<code>node --version</code>）；检查 Node.js 是否在 PATH 中（重启终端）；配置文件中的 <code>command</code> 用 <code>npx.cmd</code> 代替 <code>npx</code>。
        </div>
        <div className="callout callout-warning">
          <strong>⚠️ DeepSeek API 返回 401 / 403 错误</strong><br />
          检查 API Key 是否完整（DeepSeek 控制台 → API Keys → 复制）；确认 Key 未过期、未在控制台被撤销；检查 DeepSeek 账户余额是否充足（<code>get_user_balance</code> 工具可查询）。
        </div>
        <div className="callout callout-warning">
          <strong>⚠️ DeepSeek 返回乱码或截断</strong><br />
          DeepSeek V4 系列支持最长 384K 输出，但默认 <code>max_tokens</code> 可能较低。在 MCP 配置的 <code>env</code> 中加 <code>DEEPSEEK_DEFAULT_MODEL</code> 指定模型。
        </div>
        <div className="callout callout-info">
          <strong>💡 修改配置后仍然不生效？</strong><br />
          这是 MCP 配置的常见问题——backups 缓存或 <code>.claude.json</code> 项目级配置覆盖了你的 settings.json。
          详见{" "}
          <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>MCP 配置避坑指南</a>（第三节：备份缓存、第四节：诊断命令）。
        </div>
      </div>

      {/* ===== 十、总结 ===== */}
      <h2 id="summary">十、总结</h2>
      <p>
        本方案基于 Anthropic <strong>官方 MCP 协议</strong>实现，是目前能正常使用 Claude API 的用户兼顾能力与成本的最优选择。与 API 替换方案相比：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>保留了 Claude Code 的全部核心推理能力（架构设计、代码审核、复杂调试）</li>
        <li>将重复性代码任务委托给 DeepSeek，大幅降低 API 成本（约 55%）</li>
        <li>基于官方协议，<strong>不存在合规风险</strong>，不担心被封禁</li>
        <li>Claude 始终是主控者，DeepSeek 生成的代码经过 Claude 审核后才使用</li>
      </ul>

      <div className="callout callout-info">
        <strong>选择建议</strong>：能正常访问 Claude API → 使用本文 MCP 方案（保留能力 + 降本）；无法访问 Claude API → 使用 API 替换方案（CC Switch / 手动配置 settings.json，参见
        <a href="/articles/domestic-model-access" style={{ color: "var(--color-accent)" }}>国内模型接入指南</a>）。
      </div>

      <div className="callout callout-info">
        <strong>延伸阅读</strong>：
        MCP 协议架构与工作原理 → <a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP》</a>；
        MCP 配置避坑（backups 缓存、.claude.json 覆盖） → <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>；
        Claude Code 扩展机制全览 → <a href="/articles/mcp-hook-skill-advanced" style={{ color: "var(--color-accent)" }}>《Claude Code 扩展机制》</a>。
      </div>

      <FreshnessNote>本文基于 Claude Code v2.x + DeepSeek API 验证，写作日期 2026-06-12。</FreshnessNote>
    </div>
  );
}
