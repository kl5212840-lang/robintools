import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderClaudeConfig(platform?: string) {
  const configPath = "~/.claude/settings.json";
  const configPathWin = "C:\\Users\\你的用户名\\.claude\\settings.json";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Claude Code 本身免费，但需要接入 AI 模型才能工作。以下是四种主流方案，按国内用户体验排序：<strong style={{ color: "var(--color-text-primary)" }}>首选 DeepSeek</strong>（国内直连、性价比最高、注册即用）、<strong style={{ color: "var(--color-text-primary)" }}>硅基流动</strong>（新用户送体验金、免实名）、<strong style={{ color: "var(--color-text-primary)" }}>智谱 AI</strong>（综合能力强、国产合规）、<strong style={{ color: "var(--color-text-primary)" }}>Claude 官方 API</strong>（模型最全、延迟最低、需科学上网）。本文以 DeepSeek 为主要示例，其余供应商的配置方式相同，只需替换对应的 API 地址和模型名即可。
      </p>

      <h2 id="section-apikey"><span className="step-badge">1</span>获取 API Key</h2>
      <h3>方案一：DeepSeek（国内推荐）</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[16px]">
        <li>打开 <a href="https://platform.deepseek.com" target="_blank" rel="noopener">DeepSeek 开放平台 <ExternalLink className="inline h-3 w-3" /></a></li>
        <li>注册账号 → 完成实名认证</li>
        <li>充值（支持自定义金额，最低 ¥1 起）</li>
        <li>左侧菜单 → API Keys → 创建新 Key → 立即复制保存</li>
      </ol>

      <h3>方案二：Claude 官方 API（海外用户）</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[16px]">
        <li>打开 <a href="https://console.anthropic.com" target="_blank" rel="noopener">Anthropic Console <ExternalLink className="inline h-3 w-3" /></a></li>
        <li>注册 Anthropic 账户（需海外手机号验证）</li>
        <li>充值预付费（最低 $5）或申请月结</li>
        <li>左侧菜单 → API Keys → 创建新 Key</li>
      </ol>
      <Callout type="info" summary="使用 Claude 官方 API">
        使用 Claude 官方 API 时，<code>ANTHROPIC_BASE_URL</code> 保持默认 <code>https://api.anthropic.com</code>，无需修改。海外直连延迟更低，模型支持最完整。但国内须科学上网。
      </Callout>

      <Callout type="warning" summary="重要">
        API Key 创建后通常只显示一次。请立即复制保存到安全的地方，不要分享或提交到 Git 仓库。
      </Callout>

      <h2 id="section-ccswitch"><span className="step-badge">2</span>CC Switch 图形化配置（推荐新手）</h2>
      <p>CC Switch 是一个跨平台桌面工具，通过拦截 Claude Code 的 API 请求将模型路由到你指定的国内供应商，<strong>无需手动编辑配置文件</strong>，适合不熟悉命令行的用户。</p>

      <h3>步骤</h3>
      <ol className="list-decimal pl-5 space-y-3 text-[16px]">
        <li>
          <strong>下载 CC Switch</strong>（最低版本 3.15.0）
          <ul className="list-disc pl-5 mt-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>从 <a href="https://www.ccswitch.io/zh/" target="_blank" rel="noopener">ccswitch.io</a> 下载（国内直达，点击下载跳转 GitHub）</li>
            <li>或直接访问 <a href="https://github.com/farion1231/cc-switch" target="_blank" rel="noopener">GitHub 仓库</a></li>
          </ul>
        </li>
        <li>
          <strong>配置 API Key</strong>
          <ul className="list-disc pl-5 mt-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>打开 CC Switch → 点击右上角 + 号</li>
            <li>选择供应商，填入 API Key</li>
            <li>DeepSeek 模型选 <code>deepseek-v4-pro[1m]</code>（旗舰）或 <code>deepseek-v4-flash[1m]</code>（快速）</li>
            <li>硅基流动模型选 <code>Pro/MiniMaxAI/MiniMax-M2.5</code></li>
          </ul>
        </li>
        <li>
          <strong>开启路由</strong>
          <ul className="list-disc pl-5 mt-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>CC Switch 主界面 → 选择 Claude Code → 打开左上角开关（变绿即生效）</li>
          </ul>
        </li>
        <li>
          <strong>（可选）开启跳过权限</strong>
          <ul className="list-disc pl-5 mt-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>点击"编辑通用配置"，写入：<br /><code>{`{"permissions":{"defaultMode":"bypassPermissions"}}`}</code></li>
            <li className="mt-1" style={{ color: "var(--color-warning)" }}><strong>⚠️ 安全提示</strong>：此设置将跳过所有权限申请，Claude Code 会自动执行所有操作而不询问确认。仅在完全信任的项目中使用。</li>
          </ul>
        </li>
      </ol>

      <Callout type="warning" summary="常见故障">
        如提示"切换路由状态失败: detail"，检查配置文件是否存在（<code>{configPathWin}</code> 或 <code>{configPath}</code>）。不存在则手动创建并写入：<br /><code>{`{"env":{"ANTHROPIC_AUTH_TOKEN":"PROXY_MANAGED"}}`}</code><br />然后完全退出 CC Switch（含右下角系统托盘）→ 重新打开 → 开启路由。
      </Callout>

      <Callout type="info" summary="注意">
        CC Switch 路由开启时会覆盖 <code>settings.json</code> 的手动配置。如果同时使用两者，以 CC Switch 为准。如果你更习惯手动管理配置，请看下一节方案 B。
      </Callout>

      <h2 id="section-config-file"><span className="step-badge">3</span>手动编辑配置文件（方案 B）</h2>
      <p>打开配置文件（文件不存在则手动创建）：</p>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        Windows：<code>{configPathWin}</code>　|　macOS / Linux：<code>{configPath}</code>
      </p>
      <CodeBlock language="json" mode="unified" code={`{\n  "env": {\n    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",\n    "ANTHROPIC_AUTH_TOKEN": "你的-DeepSeek-API-Key",\n    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",\n    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",\n    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",\n    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash[1m]",\n    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash[1m]",\n    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"\n  }\n}`} />

      <Callout type="info">
        <strong>配置说明</strong>：DeepSeek 通过 <code>/anthropic</code> 端点提供完整 Anthropic Messages API 兼容层。模型名末尾的 <code>[1m]</code> 表示 100 万 token 上下文窗口（DeepSeek V4 支持）。<code>CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1"</code> 是连接 DeepSeek 的<strong>必填项</strong>——不设此项会引发 <code>400 Invalid user_id</code> 错误（DeepSeek 端点 2026 年 5 月起要求此配置）。<code>CLAUDE_CODE_SUBAGENT_MODEL</code> 指定子代理（并行任务）使用的轻量模型。
      </Callout>

      <ConfigTable
        rows={[
          ["ANTHROPIC_BASE_URL", "API 端点地址（兼容 Anthropic 协议，注意不要用 /v1 路径）"],
          ["ANTHROPIC_AUTH_TOKEN", "你的 API Key"],
          ["ANTHROPIC_MODEL", "默认模型，[1m] = 100 万 token 上下文窗口"],
          ["ANTHROPIC_DEFAULT_OPUS_MODEL", "Opus 级别映射 → deepseek-v4-pro（最强推理）"],
          ["ANTHROPIC_DEFAULT_SONNET_MODEL", "Sonnet 级别映射 → deepseek-v4-pro（主力任务）"],
          ["ANTHROPIC_DEFAULT_HAIKU_MODEL", "Haiku 级别映射 → deepseek-v4-flash（轻量快速）"],
          ["CLAUDE_CODE_SUBAGENT_MODEL", "子代理模型 → deepseek-v4-flash（并行任务）"],
          ["CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "必填！设为 1 禁用非必要请求（解决 400 错误）"],
        ]}
      />

      <h2 id="section-verify-config"><span className="step-badge">4</span>验证配置</h2>
      <ol className="list-decimal pl-5 space-y-2 text-[16px]">
        <li>完全关闭终端，重新打开</li>
        <li>输入 <code>claude</code> 启动</li>
        <li>发送测试指令：<code>你好，请介绍一下自己</code></li>
        <li>如果正常回复，配置成功 ✅</li>
      </ol>
      <Collapsible summary="常见排查">
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          常见排查：① API Key 是否完整复制（无多余空格或换行）；② 账户余额是否充足；③ <code>ANTHROPIC_BASE_URL</code> 拼写是否正确（不要用 <code>/v1</code> 路径）；④ 浏览器访问 <code>https://api.deepseek.com</code> 确认网络可达；⑤ 遇到 <code>400 Invalid &apos;user_id&apos;</code> 确认已设置 <code>CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: &quot;1&quot;</code>。
        </p>
      </Collapsible>

      <h2 id="section-mcp-config"><span className="step-badge">5</span>MCP 服务配置（可选）</h2>
      <p>MCP（Model Context Protocol）让 Claude Code 连接搜索引擎、数据库、浏览器等外部工具。如果你暂时不需要，可以跳过本节——不影响基本使用。</p>

      <h3>Windows</h3>
      <p>推荐使用 Claude Code 自带的 CLI 命令（以 Brave Search 为例）：</p>
      <CodeBlock mode="unified" language="bash" code={`# 在项目目录中执行，自动将配置写入 .claude.json
claude mcp add brave-search --env BRAVE_API_KEY=你的API-Key -- cmd /c "npx -y @anthropic/mcp-server-brave-search"`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        <strong>⚠️ 添加后用 <code>claude mcp list</code> 验证</strong>——如果 <code>args</code> 第一个元素是 <code>"C:/"</code> 而不是 <code>"/c"</code>，说明 claude mcp add 把 <code>/c</code> 误解析了。编辑 <code>.claude.json</code> 手动改回即可。
      </p>
      <p>如果不用 CLI，也可手动编辑 <code>~/.claude/mcp.json</code>（文件不存在则手动创建）：</p>
      <CodeBlock mode="unified" language="json" code={`{
  "mcpServers": {
    "brave-search": {
      "command": "cmd",
      "args": [
        "/c",
        "set BRAVE_API_KEY=你的API-Key && npx -y @anthropic/mcp-server-brave-search"
      ]
    }
  }
}`} />
      <Callout type="info" summary="配置优先级注意">
        <code>.claude.json</code> 中的项目级 MCP 配置会覆盖 <code>mcp.json</code> 全局配置。如果你同时用了两种方式，以 <code>.claude.json</code> 为准。建议统一用 <code>claude mcp add</code> 管理。
      </Callout>

      <h3>macOS / Linux</h3>
      <p>终端运行（以 Brave Search 为例）：</p>
      <CodeBlock mode="unified" language="bash" code={`# 官方推荐方式 — 自动管理配置位置，无需手动编辑文件
claude mcp add brave-search --transport stdio --env BRAVE_API_KEY=你的API-Key -- npx -y @anthropic/mcp-server-brave-search`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        如需删除：<code>claude mcp remove brave-search</code>。查看当前所有 MCP：<code>claude mcp list</code>。
      </p>

      <h3>验证 MCP</h3>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>完全退出 Claude Code（含后台进程），重新启动</li>
        <li>输入 <code>/mcp</code> 确认新添加的服务显示为 <strong>connected ✓</strong></li>
        <li>发送测试指令验证工具可用，如 <code>搜索最新的 React 文档</code></li>
      </ol>

      <Collapsible summary="MCP 配置参考">
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          📖 MCP 配置涉及多层缓存、平台差异和已知 Bug——如果遇到配置不生效、修改后还是旧配置、进程链不符等问题，详见本站
          <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>。
        </p>
      </Collapsible>
    </div>
  );
}

export default renderClaudeConfig;
