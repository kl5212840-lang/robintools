import { CodeBlock } from "@/components/content/code-block";
import { Callout, Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderClaudeHUDSetup() {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Claude HUD 是一个 Claude Code 状态行插件，在终端输入行下方常驻显示上下文使用率、活跃工具、子 Agent 状态和 Todo 进度。
        由社区开发者 <a href="https://github.com/jarrodwatts/claude-hud" target="_blank" rel="noopener noreferrer">jarrodwatts</a> 维护，
        通过 Claude Code 原生 statusline API 实现，不需要独立窗口或 tmux。
      </p>

      <Callout type="info">
        <strong>写作环境</strong>：Windows 11 + PowerShell 7 + Claude Code v2.x + Claude HUD（2026-06 验证）。
      </Callout>

      {/* ===== 一、安装 ===== */}
      <h2 id="install">一、安装</h2>

      <h3>1.1 前提条件</h3>
      <p>Claude HUD 是一个 Node.js 进程，运行它的机器上需要安装 Node.js 18+。</p>
      <CodeBlock language="powershell" code={`# Windows — 如未安装 Node.js，先用 winget 安装
winget install OpenJS.NodeJS.LTS

# macOS
brew install node

# Linux
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs`} />

      <h3>1.2 三步安装</h3>
      <p>在 Claude Code 会话中依次执行以下命令：</p>
      <CodeBlock language="bash" code={`# 步骤 1：添加插件市场
/plugin marketplace add jarrodwatts/claude-hud

# 步骤 2：安装插件
/plugin install claude-hud

# 步骤 3：重新加载插件使安装生效
/reload-plugins

# 步骤 4：运行 setup 生成状态行配置
/claude-hud:setup`} />

      <Callout type="warning" summary="Linux 注意">
        <p>Linux 上 <code>/tmp</code> 可能是独立的 tmpfs 文件系统，插件安装时会报 <code>EXDEV: cross-device link not permitted</code> 错误。
        解决：在运行 <code>/plugin install</code> 之前设置 <code>TMPDIR=~/.cache/tmp</code>。</p>
      </Callout>

      <p>
        <code>/claude-hud:setup</code> 会自动检测平台、shell 和运行时，生成 statusline 配置写入 <code>~/.claude/settings.json</code>，然后提示重启 Claude Code。
        重启后终端输入行下方出现两行状态信息，安装完成。
      </p>

      {/* ===== 二、配置 ===== */}
      <h2 id="config">二、配置</h2>
      <p>
        安装后可通过交互式命令或直接编辑配置文件来调整显示内容。
      </p>

      <h3>2.1 交互式配置</h3>
      <CodeBlock language="bash" code={`/claude-hud:configure`} />
      <p>
        这个命令会引导你逐步选择：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>布局</strong>：Expanded（多行）或 Compact（单行）</li>
        <li><strong>预设</strong>：Full（全部显示）、Essential（核心信息）、Minimal（仅上下文条）</li>
        <li><strong>语言</strong>：英文（<code>en</code>）或中文（<code>zh-Hans</code>），影响标签文字</li>
        <li><strong>各元素开关</strong>：逐一开启或关闭工具活动、子 Agent、Todo、使用率等</li>
      </ul>

      <h3>2.2 配置文件</h3>
      <p>
        配置文件路径：<code>~/.claude/plugins/claude-hud/config.json</code>。交互式配置的结果写入这个文件，也可以直接编辑。
      </p>

      <Collapsible summary="主要配置项速查">
        <table className="w-full text-[15px] my-2" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>配置项</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>取值</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>说明</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>lineLayout</code></td>
              <td className="py-2 pr-4"><code>"expanded"</code> / <code>"compact"</code></td>
              <td className="py-2 pr-4">多行或单行布局</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>language</code></td>
              <td className="py-2 pr-4"><code>"en"</code> / <code>"zh-Hans"</code></td>
              <td className="py-2 pr-4">界面标签语言</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>elementOrder</code></td>
              <td className="py-2 pr-4">字符串数组</td>
              <td className="py-2 pr-4">元素排列顺序</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>pathLevels</code></td>
              <td className="py-2 pr-4">1-3</td>
              <td className="py-2 pr-4">路径显示深度</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>display.tools</code></td>
              <td className="py-2 pr-4">bool</td>
              <td className="py-2 pr-4">工具活动追踪</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>display.agents</code></td>
              <td className="py-2 pr-4">bool</td>
              <td className="py-2 pr-4">子 Agent 状态</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>display.todos</code></td>
              <td className="py-2 pr-4">bool</td>
              <td className="py-2 pr-4">Todo 进度</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>display.context</code></td>
              <td className="py-2 pr-4">bool</td>
              <td className="py-2 pr-4">上下文使用率条</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>display.usage</code></td>
              <td className="py-2 pr-4">bool</td>
              <td className="py-2 pr-4">使用率限制与时长</td>
            </tr>
          </tbody>
        </table>
      </Collapsible>

      {/* ===== 三、实际效果 ===== */}
      <h2 id="effect">三、实际效果</h2>
      <p>
        Expanded 布局下，状态行显示两行信息。示意如下：
      </p>
      <CodeBlock language="text" code={`[Opus] │ ai-tools-guide git:(master*)
上下文 ██████░░░░ 45% │ 使用率 ██░░░░░░░░ 25%（1h 30m / 5h）

# 当工具活跃时，第一行追加工具状态：
[Opus] │ ◐ Edit: auth.ts ✓ Read x3 │ ai-tools-guide git:(master*)
上下文 ██████░░░░ 45% │ 使用率 ██░░░░░░░░ 25%

# 当子 Agent 运行时：
[Opus] │ ◐ explore [haiku]: 查找认证代码 │ ai-tools-guide git:(master*)
上下文 ██████░░░░ 45% │ 使用率 ██░░░░░░░░ 25%

# Todo 进行中时：
[Opus] │ ▸ 修复认证漏洞（2/5）│ ai-tools-guide git:(master*)
上下文 ██████░░░░ 45% │ 使用率 ██░░░░░░░░ 25%`} />

      <p>
        Compact 布局将所有信息压缩到一行，适合窄终端或偏好简洁的场景。
      </p>

      <Callout type="warning" summary="使用率仅对 Claude 订阅用户可用">
        <p>
          「使用率」显示的数据来自 Claude Code 的 <code>rate_limits</code> 输入——只有 Pro/Max 订阅用户才会收到此数据。
          <strong>API Key 用户（包括 DeepSeek API、第三方 Key）没有 <code>rate_limits</code> 数据源</strong>，开了 <code>showUsage</code> 也不会显示，不是配置问题。
        </p>
      </Callout>

      <h3>核心价值</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>上下文可见</strong>：不再需要频繁敲 <code>/context</code> 查看用量，状态行实时更新</li>
        <li><strong>工具追踪</strong>：Claude 正在读哪个文件、编辑哪个文件，一目了然</li>
        <li><strong>子 Agent 监控</strong>：后台派出的子 Agent 状态不会丢失——状态行显示它在做什么、用哪个模型</li>
        <li><strong>用量感知</strong>：Token 速度和时长提示，帮助判断是否快触发限速</li>
      </ul>

      <Collapsible summary="HUD 与 /context 命令的区别">
        <p>
          <code>/context</code> 是一次性快照，需要手动执行。HUD 是实时更新（约每 300ms 刷新一次），始终显示在输入行下方。
          HUD 不替代 <code>/context</code>——后者展示更详细的 Token 分布（文件、工具调用、对话历史各自占比），
          HUD 提供的是持续可见的简要状态。
        </p>
      </Collapsible>

      {/* ===== 四、与 Superpowers 的关系 ===== */}
      <h2 id="relation">四、与其他工具的关系</h2>
      <p>
        HUD 是<strong>可观测性工具</strong>——让你<strong>看见</strong> Claude Code 在做什么。
        如果要让 Claude Code <strong>按工程规范做事</strong>（设计→计划→TDD→审查），需要工作流层面的工具，如
        <a href="/articles/superpowers-workflow" style={{ color: "var(--color-accent)" }}>Superpowers 工作流框架</a>。
        两者互不冲突，可以同时安装——HUD 让你看见流程，Superpowers 让流程有纪律。
      </p>

      <p>
        Starship v1.25.0 也提供了 <code>starship statusline claude-code</code> 子命令，能在提示符中嵌入模型名和上下文用量。
        与 HUD 相比更轻量，但不显示工具活动、子 Agent 状态和 Todo 进度。详见
        <a href="/articles/starship-terminal-setup" style={{ color: "var(--color-accent)" }}>终端美化指南</a>。
      </p>

      {/* ===== 五、验证 ===== */}
      <h2 id="verify">五、验证</h2>
      <p>安装完成后逐条确认：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Claude Code 输入行下方出现状态栏，显示模型名和上下文使用率</li>
        <li>执行 <code>/context</code>，状态行的百分比与命令输出一致</li>
        <li>让 Claude 读取一个文件，状态行出现文件读写活动</li>
        <li>触发一个子 Agent 任务（如让 Claude "探索这个目录结构"），状态行显示 Agent 名称和状态</li>
        <li>运行 <code>/claude-hud:configure</code> 切换布局后状态行立即变化</li>
      </ol>

      <FreshnessNote>本文基于 Claude Code v2.x + Claude HUD（jarrodwatts/claude-hud）验证，写作日期 2026-06-11。Claude HUD 是社区插件，功能可能随版本变化，以 <a href="https://github.com/jarrodwatts/claude-hud" target="_blank" rel="noopener noreferrer">GitHub 仓库</a> 最新文档为准。</FreshnessNote>
    </div>
  );
}
