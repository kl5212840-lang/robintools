import { CodeBlock } from "@/components/content/code-block";
import { Collapsible } from "@/content/guides/_shared";

export function renderDomesticModelAccess() {
  return (
    <div className="wizard-content">
      {/* ===== 一、背景 ===== */}
      <h2 id="background">一、背景：为什么需要国内模型接入</h2>
      <p>
        Claude Code 是 Anthropic 推出的 AI 编程助手 CLI 工具，默认使用 Claude 系列模型（Opus/Sonnet/Haiku）。但在国内网络环境下，开发者通常面临两个问题：
      </p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>网络限制</strong>：部分用户无法直接访问 Anthropic API 端点（<code>https://api.anthropic.com</code>）</li>
        <li><strong>成本高昂</strong>：Claude API 按 token 计费，高强度开发场景下单月费用可达数百美元</li>
      </ol>
      <p>
        解决方案：将国内大模型（DeepSeek、智谱 GLM、硅基流动等）通过 API 协议兼容转接方式接入 Claude Code，作为 Claude 的推理替代引擎。这种方式不依赖 Anthropic 官方 MCP 协议，而是通过修改 Claude Code 的 API 请求目标来实现接口替换。
      </p>

      <div className="callout callout-danger">
        <strong>⚠️ 重要声明</strong>：本 API 替换方案仅限个人学习研究使用，严禁用于搭建代理服务倒卖 API 或任何商业化经营行为。
      </div>

      <p>本文将覆盖<strong>三种主流方案</strong>，从图形化工具到手动配置，每种方案都包含完整步骤、配置说明和故障排查。</p>

      <div className="callout callout-danger">
        <strong>⚠️ 重要警告：API 替换会影响扩展功能的使用体验</strong>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-[14px]">
          <li><strong>MCP 工具调用</strong>：DeepSeek、GLM 等主流模型支持 function calling，MCP <strong>通常可以工作</strong>，但工具选择精度和调度一致性不如 Claude 原生——同一 prompt 下可能出现有时调用有时不调用的情况</li>
          <li><strong>Hook、Skill、Memory</strong>：属于 Claude Code 支撑层功能，由 CLI 工具本身调度，<strong>不受模型替换影响</strong>，可正常使用</li>
          <li><strong>SubAgent</strong>：进程由支撑层管理，但任务分解和结果汇总质量取决于模型推理能力，替换后效果会打折扣</li>
          <li>如果你需要完整保留 Claude 的工具调度能力，请使用 MCP 挂载方案（Claude + 国内模型协同），参见 <a href="/articles/deepseek-claude-code-guide" style={{ color: "var(--color-accent)" }}>《双模型协同方案》</a></li>
        </ul>
      </div>

      <Collapsible summary="AI 代劳">
        <div className="callout callout-info">
          本文包含的命令和配置均可交由 AI 编程工具（Claude Code、Codex CLI、Cursor 等）代劳——选取需要的部分发送即可。详见{" "}
          <a href="/articles/ai-pair-workflow" style={{ color: "var(--color-accent)" }}>「阅读本站前」</a>。
        </div>
      </Collapsible>

      {/* ===== 二、三种方案概览 ===== */}
      <h2 id="overview">二、三种方案概览</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>方案</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>工具</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>适用人群</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>难度</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>核心原理</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>A. CC Switch 图形化</strong></td>
              <td className="py-2 pr-4">CC Switch</td>
              <td className="py-2 pr-4">新手 / 不想动配置文件</td>
              <td className="py-2 pr-4">⭐</td>
              <td className="py-2">GUI 拦截 Claude Code 发往 <code>api.anthropic.com</code> 的请求，路由到第三方 API 供应商</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>B. 手动配置 settings.json</strong></td>
              <td className="py-2 pr-4">无额外工具</td>
              <td className="py-2 pr-4">熟悉命令行 / 追求极致可控</td>
              <td className="py-2 pr-4">⭐⭐</td>
              <td className="py-2">直接修改配置文件中的 API 端点和密钥</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>C. 国内 Agent 代装</strong></td>
              <td className="py-2 pr-4">WorkBuddy 等</td>
              <td className="py-2 pr-4">无需命令行经验</td>
              <td className="py-2 pr-4">⭐</td>
              <td className="py-2">用 AI Agent 自动安装 Claude Code + 配置</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout callout-info">
        <strong>与 MCP 挂载方案的区别</strong>：本文属于 API 协议兼容转接（用第三方模型替代 Claude 推理）。如能正常访问 Anthropic API，建议优先考虑 MCP 挂载方案以实现能力无损——详见 <a href="/articles/deepseek-claude-code-guide" style={{ color: "var(--color-accent)" }}>《双模型协同方案》</a>。
      </div>

      {/* ===== 三、方案 A ===== */}
      <h2 id="plan-a">三、方案 A：CC Switch 图形化接入（适合不熟悉命令行的用户）</h2>

      <h3>原理</h3>
      <p>
        CC Switch 是一个跨平台桌面应用，通过本地代理技术拦截 Claude Code 发往 <code>api.anthropic.com</code> 域名的 API 请求，将其路由到你指定的第三方 API 供应商（DeepSeek、智谱、Kimi、硅基流动等）。整个过程不需要手动编辑任何 JSON 配置文件。
      </p>
      <div className="callout callout-info">
        <strong>说明</strong>：CC Switch 的全局路由<strong>仅拦截 <code>api.anthropic.com</code> 这一个域名的请求</strong>，不会劫持整机网络流量或影响其他应用程序的网络连接。
      </div>

      <h3>安装与配置</h3>
      <p><strong>第一步：下载 CC Switch</strong></p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>从 <a href="https://www.ccswitch.io/zh/" target="_blank" rel="noopener">ccswitch.io</a> 下载（国内直达，点击下载跳转 GitHub）；或直接访问 <a href="https://github.com/farion1231/cc-switch" target="_blank" rel="noopener">GitHub 仓库</a>（版本 ≥ 3.15.0）</li>
        <li>Windows 使用 <code>.zip</code>（解压即用）或 <code>.msi</code>（安装版）</li>
        <li>macOS 使用 <code>.dmg</code></li>
      </ul>

      <p><strong>第二步：获取 API Key</strong></p>
      <p>选择以下任一供应商注册并获取密钥：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>DeepSeek</strong>（推荐）：访问 platform.deepseek.com，注册 → 充值 → 创建 API Key</li>
        <li><strong>硅基流动</strong>（零成本体验）：访问 siliconflow.cn，注册 → 实名认证 → 获取 API 密钥。新用户赠送 ¥16 体验金</li>
        <li><strong>智谱 AI</strong>：访问 open.bigmodel.cn，注册后获取 API Key</li>
        <li><strong>MiniMax</strong>、<strong>Kimi</strong>、<strong>百川</strong> 等流程类似</li>
      </ul>

      <p><strong>第三步：配置 CC Switch</strong></p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开 CC Switch → 点击右上角 <strong>&ldquo;+&rdquo;</strong> 号</li>
        <li>选择供应商（如 DeepSeek），填入 API Key</li>
        <li>根据供应商设置推荐模型名称：</li>
      </ol>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>供应商</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐模型（旗舰）</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐模型（轻量）</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>上下文长度</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">DeepSeek</td>
              <td className="py-2 pr-4"><code>deepseek-v4-pro[1m]</code></td>
              <td className="py-2 pr-4"><code>deepseek-v4-flash[1m]</code></td>
              <td className="py-2">100 万 token</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">硅基流动</td>
              <td className="py-2 pr-4"><code>Pro/MiniMaxAI/MiniMax-M2.5</code></td>
              <td className="py-2 pr-4"><code>Pro/Qwen/Qwen3-Coder-480B</code></td>
              <td className="py-2">视模型而定</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">智谱</td>
              <td className="py-2 pr-4"><code>GLM-5.1</code></td>
              <td className="py-2 pr-4"><code>GLM-5.1-Flash</code></td>
              <td className="py-2">200K token</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout callout-info">
        <strong>关于 <code>[1m]</code> 后缀</strong>：DeepSeek 的 V4 系列模型支持 100 万 token 上下文，<code>[1m]</code> 表示启用完整上下文。如不需要长上下文，可以省略以降低延迟。
      </div>

      <p><strong>第四步：开启路由</strong></p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>CC Switch 主界面 → 选择 Claude Code → 打开左上角开关（变绿即为启用）</li>
        <li>如果报&ldquo;切换路由状态失败&rdquo;，参考下方故障排查</li>
      </ul>

      <p><strong>第五步（推荐）：跳过权限确认</strong></p>
      <p>在 CC Switch 中点击&ldquo;编辑通用配置&rdquo;，写入：</p>
      <CodeBlock language="json" code={`{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}`} />
      <p>此配置跳过 Claude Code 每次操作前的权限询问，大幅提升使用流畅度。如果你希望保留安全确认，可跳过此步。</p>

      <h3>故障排查</h3>
      <p><strong>问题：切换路由状态失败（报 {`{detail}`}）</strong></p>
      <p>这是 CC Switch 最常见的问题，根源是 Claude Code 的 settings.json 中缺少必要的认证标记。</p>
      <p>解决方法：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>检查 <code>C:\Users\&lt;用户名&gt;\.claude\settings.json</code>（macOS/Linux 为 <code>~/.claude/settings.json</code>）是否存在</li>
        <li>如果不存在，手动创建该文件，填入：</li>
      </ol>
      <CodeBlock language="json" code={`{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "PROXY_MANAGED"
  }
}`} />
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" start={3} style={{ color: "var(--color-text-secondary)" }}>
        <li>退出 CC Switch（包括右下角系统托盘中的图标）</li>
        <li>重新打开 CC Switch → 开启路由</li>
      </ol>

      <p><strong>问题：路由开启后依然失败</strong></p>
      <p>除上述 settings.json 缺失外，还需排查以下因素：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>部分防火墙或杀毒软件（如 Windows Defender 防火墙、360 安全卫士、火绒等）可能拦截 CC Switch 的本地代理端口，导致路由无法生效。遇到此情况，请在防火墙或杀毒软件中将 CC Switch 添加为信任程序</li>
        <li>确认 CC Switch 版本 ≥ 3.15.0</li>
        <li>确认供应商的 API Key 有效且余额充足</li>
        <li>确认已选择正确的模型名称</li>
        <li>重启 Claude Code（CLI 端用 <code>exit</code> 退出后重新打开，桌面端退出后重新启动）</li>
      </ul>

      <Collapsible summary="验证：判断 CC Switch 是否配置成功">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-secondary)" }}>
          配置完成后，用以下提示词测试：
        </p>
        <CodeBlock language="text" code={`你现在用的是什么模型？请回答你的模型名称和版本号。`} />
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>预期结果</strong>：Claude Code 回复的是 DeepSeek / GLM / 你配置的模型名称，而不是 "Claude Opus"<br />
          <strong>未生效的迹象</strong>：回复是 "I am Claude, developed by Anthropic" 或提到 "Claude Opus/Sonnet"——说明路由未生效
        </p>
      </Collapsible>

      {/* ===== 四、方案 B ===== */}
      <h2 id="plan-b">四、方案 B：手动配置 settings.json（追求极致可控）</h2>

      <h3>原理</h3>
      <p>
        Claude Code 在启动时会读取用户目录下的 <code>settings.json</code> 配置文件。通过修改该文件中的环境变量，可以直接指定 API 端点和模型，从而实现 API 协议兼容转接——接入任意兼容 Anthropic API 格式的第三方模型。
      </p>

      <h3>配置文件位置</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>操作系统</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>路径</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Windows</td>
              <td className="py-2"><code>C:\Users\&lt;用户名&gt;\.claude\settings.json</code></td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">macOS</td>
              <td className="py-2"><code>~/.claude/settings.json</code></td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Linux</td>
              <td className="py-2"><code>~/.claude/settings.json</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Claude Code 的 CLI 端和 VS Code 插件端<strong>共用</strong>同一份配置。</p>

      <div className="callout callout-info">
        <strong>注意</strong>：Claude Desktop 桌面端使用独立的配置文件路径，桌面端的 API 接口替换配置需要在 CC Switch 中完成，不能通过 settings.json 修改。
      </div>

      <h3>DeepSeek 接入配置（完整版）</h3>
      <CodeBlock language="json" code={`{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的 DeepSeek API Key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash[1m]",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}`} />

      <Collapsible summary="关于 CLAUDE_CODE_EFFORT_LEVEL">
        <div className="callout callout-warning">
          <strong>关于 <code>CLAUDE_CODE_EFFORT_LEVEL</code></strong>：此参数用于控制推理深度，在 DeepSeek 等第三方模型接入场景下<strong>不一定被支持</strong>（取决于第三方服务端是否实现了该字段）。如果你的场景不需要精细控制推理强度，可省略此项。如遇到 400 错误，尝试删除该配置后重试。
        </div>
      </Collapsible>

      <Collapsible summary="各配置项详解">
      <h3>各配置项详解</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>配置项</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>必填</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>说明</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>ANTHROPIC_BASE_URL</code></td>
              <td className="py-2 pr-4">✅</td>
              <td className="py-2">API 端点地址。各家模型提供兼容 Anthropic 格式的接口</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>ANTHROPIC_AUTH_TOKEN</code></td>
              <td className="py-2 pr-4">✅</td>
              <td className="py-2">你的 API Key。各家供应商的密钥格式不同，从供应商后台获取</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>ANTHROPIC_MODEL</code></td>
              <td className="py-2 pr-4">✅</td>
              <td className="py-2">默认使用的模型名称。这是最主要的配置项</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td>
              <td className="py-2 pr-4">推荐</td>
              <td className="py-2">当 Claude Code 尝试调用 Opus 级别的能力时使用的模型。建议映射到你高性能的模型</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td>
              <td className="py-2 pr-4">推荐</td>
              <td className="py-2">主力工作模型</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td>
              <td className="py-2 pr-4">推荐</td>
              <td className="py-2">轻量快速任务模型</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><code>CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC</code></td>
              <td className="py-2 pr-4">建议</td>
              <td className="py-2">设为 <code>&ldquo;1&rdquo;</code> 可禁用非必要的网络请求（如遥测、更新检查）</td>
            </tr>
          </tbody>
        </table>
      </div>
      </Collapsible>

      <h3>其他供应商的配置</h3>
      <Collapsible summary="硅基流动 / 智谱配置">
      <p><strong>硅基流动（SiliconFlow）</strong></p>
      <CodeBlock language="json" code={`{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.siliconflow.cn/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的硅基流动 API Key",
    "ANTHROPIC_MODEL": "Pro/MiniMaxAI/MiniMax-M2.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "Pro/MiniMaxAI/MiniMax-M2.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "Pro/Qwen/Qwen3-Coder-480B",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "Pro/Qwen/Qwen3-Coder-480B"
  }
}`} />

      <p><strong>智谱 AI（GLM）</strong></p>
      <CodeBlock language="json" code={`{
  "env": {
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/paas/v4/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的智谱 API Key",
    "ANTHROPIC_MODEL": "GLM-5.1",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "GLM-5.1",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "GLM-5.1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "GLM-5.1-Flash"
  }
}`} />
      </Collapsible>

      <h3>重要提醒</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>CC Switch 会覆盖 settings.json</strong>：如果 CC Switch 的路由开关处于开启状态，它会覆盖你手动写入的 settings.json 配置。两者同时使用时以 CC Switch 为准</li>
        <li><strong>API Key 是敏感信息</strong>：不要将包含 API Key 的 settings.json 提交到 Git 仓库。建议将 API Key 存储在环境变量中</li>
        <li><strong>CLI 端和 VS Code 插件共用配置</strong>：在 settings.json 中修改后，两个端都会生效，无需重复配置</li>
      </ul>

      {/* ===== 五、方案 C ===== */}
      <h2 id="plan-c">五、方案 C：国内 Agent 代装（无需命令行经验）</h2>

      <h3>原理</h3>
      <p>使用国内的 AI Agent 产品（如 WorkBuddy）来全自动完成 Claude Code 的安装和基础配置。整个过程不需要手动操作命令行，适合无需命令行经验的开发者。</p>

      <Collapsible summary="操作步骤与局限性">
        <h3>操作步骤</h3>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>安装 Agent 工具</strong>：访问 workbuddy.cn（或其他国内 Agent 产品），下载安装</li>
        <li><strong>登录并切换模式</strong>：登录后切换到&ldquo;代码开发&rdquo;模式</li>
        <li><strong>发送安装指令</strong>：</li>
      </ol>
      <CodeBlock language="text" code={`帮我安装 Claude Code。
如果是 macOS 用 Homebrew 安装。
如果是 Windows 用 winget 安装：winget install Anthropic.ClaudeCode
遇到问题自行安装依赖或解决。`} />
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" start={4} style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>授权执行</strong>：当 Agent 遇到权限申请时，点击&ldquo;同意运行&rdquo;</li>
        <li><strong>等待完成</strong>：通常 5–10 分钟，安装过程全自动</li>
        <li><strong>配置模型</strong>：安装完成后，再按照方案 A 或方案 B 配置要使用的模型</li>
      </ol>

      <h3>局限性</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Agent 代装只解决安装问题，后续的模型配置仍需手动完成</li>
        <li>Agent 工具本身可能有使用门槛（注册、配置等）</li>
        <li>不是所有 Agent 产品都支持此类操作，需要选择支持&ldquo;代码开发&rdquo;模式的产品</li>
        <li><strong>老旧 Windows 系统兼容性</strong>：部分老旧版本 Windows（如 Windows 10 早期版本、LTSC 版）大概率缺失 <code>winget</code> 包管理器。Agent 通过 <code>winget</code> 安装时会失败，需先手动安装 <code>winget</code>（从 Microsoft Store 安装&ldquo;应用安装程序&rdquo;）或改用其他方式安装 Claude Code。此外，部分系统可能缺少 VC++ 运行库、.NET Framework 等基础依赖，同样需手动预装</li>
      </ul>
      </Collapsible>

      {/* ===== 六、模型与价格速查 ===== */}
      <h2 id="pricing">六、国内模型与价格速查</h2>
      <p className="text-[14px] mb-2" style={{ color: "var(--color-text-muted)" }}>价格采集于 2026-06，以各平台官网实时报价为准。</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>供应商</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐模型</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>输入价格 (¥/$)</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>输出价格 (¥/$)</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>特色</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">DeepSeek</td>
              <td className="py-2 pr-4"><code>v4-pro[1m]</code></td>
              <td className="py-2 pr-4">¥3 / $0.44</td>
              <td className="py-2 pr-4">¥6 / $0.87</td>
              <td className="py-2">高性价比，1M 上下文</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">DeepSeek</td>
              <td className="py-2 pr-4"><code>v4-flash[1m]</code></td>
              <td className="py-2 pr-4">¥1 / $0.14</td>
              <td className="py-2 pr-4">¥2 / $0.28</td>
              <td className="py-2">轻量低价，日常够用</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">硅基流动</td>
              <td className="py-2 pr-4"><code>MiniMax-M2.5</code></td>
              <td className="py-2 pr-4" colSpan={2}>免费额度（新用户送 ¥16）</td>
              <td className="py-2">零成本体验</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">智谱</td>
              <td className="py-2 pr-4"><code>GLM-5.1</code></td>
              <td className="py-2 pr-4">¥6 / $0.85</td>
              <td className="py-2 pr-4">¥24 / $3.40</td>
              <td className="py-2">综合能力强</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">MiniMax</td>
              <td className="py-2 pr-4"><code>MiniMax-M2.5</code></td>
              <td className="py-2 pr-4">¥4 / $0.57</td>
              <td className="py-2 pr-4">¥16 / $2.28</td>
              <td className="py-2">长文本处理优秀</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Kimi</td>
              <td className="py-2 pr-4"><code>Moonshot-v1-128k</code></td>
              <td className="py-2 pr-4">¥8 / $1.14</td>
              <td className="py-2 pr-4">¥16 / $2.28</td>
              <td className="py-2">超长上下文</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">百川</td>
              <td className="py-2 pr-4"><code>Baichuan4</code></td>
              <td className="py-2 pr-4">¥10 / $1.43</td>
              <td className="py-2 pr-4">¥20 / $2.85</td>
              <td className="py-2">中文理解力强</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* ===== 七、方案选择决策 ===== */}
      <h2 id="decision">七、方案选择决策</h2>
      <CodeBlock language="text" code={`┌─ 你能正常访问 Anthropic API 吗？
│
├─ 能 ──→ 优先考虑 MCP 挂载方案（能力无损，降本 70%）
│          本文的 API 替换方案会导致核心推理能力降级
│          且 MCP 工具调用精度可能下降
│
└─ 不能 ──→ 你需要 API 替换方案（本文）
             │
             ├─ 不熟悉命令行，不想碰命令行？
             │   └─→ 方案 C（Agent 代装）→ 方案 A（CC Switch）
             │       注意：老旧 Windows 可能需手动安装系统依赖
             │
             ├─ 愿意用图形界面配置？
             │   └─→ 方案 A（CC Switch）· 推荐
             │
             └─ 追求极致可控，不介意编辑 JSON？
                 └─→ 方案 B（手动配置 settings.json）
                     Windows 下记得开启"显示隐藏的项目"`} />

      <h3>简洁版建议</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>你的情况</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐方案</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">新手 / 不想折腾</td>
              <td className="py-2">方案 A（CC Switch）+ DeepSeek</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">零成本体验</td>
              <td className="py-2">方案 A（CC Switch）+ 硅基流动（新用户 ¥16）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">熟练开发者</td>
              <td className="py-2">方案 B（手动配置）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">无需命令行经验</td>
              <td className="py-2">方案 C（Agent 代装）→ 方案 A</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">追求高性能效果</td>
              <td className="py-2">方案 B + DeepSeek v4-pro[1m]</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 八、常见问题 ===== */}
      <h2 id="faq">八、常见问题</h2>
      <Collapsible summary="常见问题">

      <p><strong>Q: CC Switch 和 settings.json 可以同时使用吗？</strong></p>
      <p>A: 可以，但 CC Switch 的路由开启后会覆盖 settings.json 的配置，以 CC Switch 为准。不建议同时使用两者，容易造成混淆。</p>

      <p><strong>Q: 切换模型后 Claude Code 的能力会下降多少？</strong></p>
      <p>A: 取决于你接入的模型。DeepSeek v4-pro 在代码生成任务上接近 Claude Sonnet 水平，但在架构设计、复杂推理方面仍有差距。硅基流动上的一些开源模型差距更大。这是接口替换方案的根本局限——你失去了 Claude 的核心推理能力。Hook、Skill、Memory 等 CLI 支撑层功能不受影响；MCP 通常可用但工具调度精度可能下降。</p>

      <p><strong>Q: settings.json 修改后不生效怎么办？</strong></p>
      <p>A: 检查以下几点：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>文件路径是否正确（Windows 下 <code>.claude</code> 是隐藏文件夹——需在资源管理器中开启&ldquo;显示隐藏的项目&rdquo;）</li>
        <li>JSON 格式是否合法（终端运行 <code>python -m json.tool ~/.claude/settings.json</code> 可自动校验）</li>
        <li>是否退出了 Claude Code 后重新打开（CLI 端执行 <code>exit</code>，桌面端检查任务管理器是否有残留进程）</li>
      </ul>

      <p><strong>Q: CC Switch 会影响其他使用 Anthropic API 的工具吗？</strong></p>
      <p>A: CC Switch 只拦截 <code>api.anthropic.com</code> 域名的请求，默认只影响 Claude Code。不会劫持整机网络流量或影响其他应用程序。</p>

      <p><strong>Q: DeepSeek 的 <code>[1m]</code> 后缀是什么？必须加吗？</strong></p>
      <p>A: <code>[1m]</code> 表示启用 100 万 token 上下文窗口。加上的好处是支持超长对话和超大代码库分析，缺点是首 token 延迟略高。日常开发可以不使用 <code>[1m]</code>，需要处理长上下文时再加上。</p>

      <p><strong>Q: 使用接口替换后 MCP 还能用吗？</strong></p>
      <p>A: 取决于替换模型是否支持 function calling，详见<a href="#background" style={{ color: "var(--color-accent)" }}>文首重要声明</a>。</p>
      </Collapsible>

      {/* ===== 九、总结 ===== */}
      <h2 id="summary">九、总结</h2>
      <p>三种方案各有适用场景：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>CC Switch</strong> 是最省心的选择，图形化操作，内置了多家供应商的配置模板</li>
        <li><strong>手动配置</strong> 提供最大灵活性，适合需要精细控制模型选择和参数的开发者</li>
        <li><strong>Agent 代装</strong> 帮助不熟悉命令行用户跨越安装门槛</li>
      </ul>
      <p>
        但需要始终牢记：本文介绍的 API 协议兼容转接方案<strong>本质上是放弃了 Claude 的核心推理能力</strong>，用国内模型的推理替换了 Claude 的推理。如果你能正常访问 Anthropic API，建议优先考虑 MCP 挂载方案（详见 <a href="/articles/deepseek-claude-code-guide" style={{ color: "var(--color-accent)" }}>《双模型协同方案》</a>），它能让你在保留 Claude 全部能力的同时大幅降低成本。
      </p>

      <div className="callout callout-info">
        <strong>相关阅读</strong>：
        MCP 挂载 DeepSeek 实现双模型协同（保能力 + 降本） → <a href="/articles/deepseek-claude-code-guide" style={{ color: "var(--color-accent)" }}>《双模型协同方案》</a>；
        MCP 配置避坑（backups 缓存、.claude.json 覆盖、Windows 诊断） → <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>。
      </div>

      <Collapsible summary="备注与免责声明">
        <hr className="my-6" style={{ borderColor: "var(--color-border-subtle)" }} />
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 1</strong>：本文基于 2026 年 6 月 Claude Code v2.x 版本与各厂商公开接口信息编写。各厂商的定价、API 接口规范、模型名称以及 Claude Code 软件功能均可能随版本迭代发生变更，实际操作请以各平台官方最新文档为准。
        </p>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 2</strong>：文中所涉方案仅限个人学习研究用途。如需商用，请遵守中华人民共和国相关法律法规以及各平台 API 服务协议中的商用条款。
        </p>
      </Collapsible>
    </div>
  );
}
