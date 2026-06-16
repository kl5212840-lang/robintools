import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCodexConfig(_platform?: string) {
  const configPathWin = "C:\\Users\\你的用户名\\.codex\\config.toml";
  const configPathUnix = "~/.codex/config.toml";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Codex 默认使用 OpenAI 官方 API。如直接访问受限，可通过中转服务或自定义网关实现稳定接入。
      </p>

      <h2 id="section-apikey"><span className="step-badge">1</span>获取 API 访问权限</h2>
      <p>两种认证方式任选其一：</p>
      <ol className="list-decimal pl-5 space-y-3 text-[16px]">
        <li>
          <strong>ChatGPT 订阅</strong>（推荐）：ChatGPT Plus/Pro/Team/Enterprise 订阅用户可直接使用。
          运行 <code>codex</code> 后浏览器自动弹出登录页面。
        </li>
        <li>
          <strong>API Key</strong>：访问 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">platform.openai.com/api-keys <ExternalLink className="inline h-3 w-3" /></a> 创建。
          按使用量付费，适合高频调用场景。
        </li>
      </ol>
      <Callout type="warning" summary="国内用户 — 无法直接访问 OpenAI API">
        如无法直连 OpenAI API，可跳到下方 <a href="#section-cn-api" style={{ color: "var(--color-accent)" }}>§4 国内 API 接入方案</a>：四种方式覆盖 CC Switch 本地路由、CCX 协议网关、中转站直连、手动 Provider 配置。——无需科学上网，无需海外信用卡。
      </Callout>

      <h2 id="section-config-file"><span className="step-badge">2</span>配置文件与环境变量</h2>
      <p>Codex 配置文件（用户级配置，项目级的 <code>.codex/config.toml</code> 不能覆盖 API 端点等关键字段）：</p>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        Windows：<code>{configPathWin}</code>　|　macOS / Linux：<code>{configPathUnix}</code>
      </p>
      <p>主要配置项：</p>
      <CodeBlock language="toml" mode="unified" code={`# Codex CLI 配置文件\n\n# 模型选择（可选：gpt-4o、o3-mini 等）\nmodel = "gpt-4o"\n\n# 自定义 API 端点（使用中转服务时修改此项）\nopenai_base_url = "https://api.openai.com/v1"\n\n# 沙箱模式：read-only | workspace-write | danger-full-access\nsandbox_mode = "workspace-write"\n\n# 审批策略：on-request | on-failure\napproval_policy = "on-request"\n\n# 如遇反复重连（Reconnecting），设为 false\nsupports_websockets = true`} />

      <Callout type="info" summary="字段说明">
        <code>openai_base_url</code> 是重定向 API 端点的关键字段，配合国内中转服务使用；<code>sandbox_mode</code> 控制文件系统访问权限——<code>workspace-write</code> 可修改工作区文件（推荐），<code>danger-full-access</code> 有全盘清空风险（⚠️ 慎用）；<code>approval_policy</code> 决定操作前是否需要人工确认；<code>supports_websockets</code> 设为 false 可解决反复重连（Reconnecting）问题。
      </Callout>

      <p>也可通过环境变量配置（环境变量优先级高于配置文件）：</p>
      <CodeBlock language="bash" code={`# 设置 API Key（推荐用 read -rs 避免记录到 shell 历史）\nread -rs OPENAI_API_KEY && export OPENAI_API_KEY\n\n# 自定义 API 端点（中转服务）\nexport OPENAI_BASE_URL="https://你的中转地址/v1"`} />

      <ConfigTable
        rows={[
          ["model", "使用的模型，默认 gpt-4o"],
          ["openai_base_url", "API 端点地址，使用中转服务时修改此项"],
          ["sandbox_mode", "沙箱模式：read-only / workspace-write / danger-full-access"],
          ["approval_policy", "操作审批策略：on-request（推荐）/ on-failure"],
          ["supports_websockets", "设为 false 可解决反复重连（Reconnecting）问题"],
        ]}
      />

      <Collapsible summary="安全提醒">
        <ul className="list-disc pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li>不要在命令行直接输入 <code>export OPENAI_API_KEY=sk-xxx</code>（会记录到 shell 历史）</li>
          <li>API Key 不要提交到 Git 仓库</li>
          <li>Codex 默认在沙箱中运行，不能修改沙箱外文件，这是安全设计不是 Bug</li>
        </ul>
      </Collapsible>

      <h2 id="section-network"><span className="step-badge">3</span>网络与连接</h2>
      <p>如遇到反复重连（Reconnecting），可在 config.toml 中设置 <code>supports_websockets = false</code>。如网络不稳导致频繁断开，参见下方 §4 接入国内 API 方案。</p>

      <h2 id="section-cn-api"><span className="step-badge">4</span>国内 API 接入方案</h2>

      <p>
        Codex CLI（v0.131.0 及以上）使用 OpenAI 专属的 <strong>Responses API</strong>（<code>/v1/responses</code>）
        与模型服务通信。而国内主流模型厂商——DeepSeek、智谱 GLM、Kimi、MiniMax 等——对外统一提供的是
        <strong>Chat Completions API</strong>（<code>/v1/chat/completions</code>）。
        两种协议请求体结构、流式 SSE 事件格式均不相同，直接改 <code>openai_base_url</code> 会导致 404 或 400。
      </p>
      <p>
        以下列出当前可用的几种配置方式。每种方式的适用场景和前提条件不同——没有通用的最佳方案，
        选择取决于你已有的工具链和使用的 API 供应商。
      </p>

      <FreshnessNote>以下方案涉及的版本号、功能说明和已知问题验证于 2026-06。工具迭代频繁，建议以各项目的官方文档为准。</FreshnessNote>

      <h3 id="section-cn-ccswitch">方案 A：CC Switch 本地路由</h3>

      <p>
        CC Switch 通过<strong>本地路由</strong>——在本机启动 HTTP 代理——将 Codex 的 Responses API 请求
        实时转换为供应商的 Chat Completions 格式。操作在 GUI 中完成，不需要手动编辑 Codex 配置文件。
        支持 DeepSeek、Kimi、MiniMax、硅基流动等 50+ 内置预设。
      </p>

      <p><strong>按以下步骤配置：</strong></p>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>从 <a href="https://www.ccswitch.io/zh/" target="_blank" rel="noopener">ccswitch.io <ExternalLink className="inline h-3 w-3" /></a> 下载安装 CC Switch</li>
        <li>打开 CC Switch，点击右上角 + 添加供应商，在预设列表中选择你的供应商，填写 API Key</li>
        <li>进入设置（齿轮图标）→ 路由 → 开启<strong>本地路由</strong>总开关</li>
        <li>在「路由启用」中打开 <strong>Codex</strong></li>
        <li>回到主界面，将 Codex 切到刚添加的供应商</li>
        <li>重新启动 Codex CLI</li>
      </ol>

      <Callout type="warning" summary="版本已知问题（2026-06）">
        CC Switch v3.16.0+ 引入了 Codex 本地路由功能，但多个用户在{" "}
        <a href="https://github.com/farion1231/cc-switch/issues" target="_blank" rel="noopener">GitHub Issues <ExternalLink className="inline h-3 w-3" /></a>
        {" "}反馈了配置数据切换后被覆盖、部分场景请求次数双倍计费等问题。v3.15 版本（不含本地路由）目前反馈较稳定。
        如遇异常可降级到 v3.15，或关注官方更新。所有版本可在{" "}
        <a href="https://www.ccswitch.io/zh/" target="_blank" rel="noopener">官网 <ExternalLink className="inline h-3 w-3" /></a> 下载。
      </Callout>

      <h3 id="section-cn-codexpp">方案 B：Codex++ 中转注入</h3>

      <p>
        <a href="https://github.com/BigPizzaV3/CodexPlusPlus" target="_blank" rel="noopener">Codex++ <ExternalLink className="inline h-3 w-3" /></a> 是基于 Rust + Tauri 开发的 Codex App（桌面版，即 Codex App）增强启动器，通过 Chromium DevTools Protocol 注入增强脚本，<strong>不修改 Codex 原始安装文件</strong>。其中转注入功能可在图形界面中切换 API 供应商——不需要编辑 config.toml。
      </p>

      <p><strong>按以下步骤配置：</strong></p>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>从 <a href="https://github.com/BigPizzaV3/CodexPlusPlus/releases" target="_blank" rel="noopener">GitHub Releases <ExternalLink className="inline h-3 w-3" /></a> 下载最新版（Windows 选 .exe 或 .msi，macOS 选对应芯片的 .dmg）</li>
        <li>安装后打开 <strong>Codex++ 管理工具</strong>（Tauri 控制面板）→ 添加供应商 API Key</li>
        <li>在管理工具中开启中转注入 → 选择目标供应商</li>
        <li>通过 <strong>Codex++</strong> 入口启动增强版 Codex</li>
      </ol>

      <Collapsible summary="非 API 功能（插件解锁 / 会话管理）">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-secondary)" }}>除中转注入外，Codex++ 还提供 Codex App 的 UI 增强：</p>
        <ul className="list-disc pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li><strong>插件解锁</strong>：API Key 模式下也能正常使用插件（这是官方缺失的入口）</li>
          <li><strong>会话管理</strong>：真正删除会话（非归档）+ Markdown 导出对话记录</li>
          <li><strong>项目管理</strong>：项目移动、Timeline 时间线、自定义脚本注入</li>
        </ul>
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>以上功能的详细操作见<a href="/codex/tutorial#section-tutorial-codexpp">使用教程</a>。</p>
      </Collapsible>

      <Callout type="info" summary="与方案 A（CC Switch）的区别">
        Codex++ 侧重 Codex App 的 UI 增强（插件、会话），中转注入是其附带功能，<strong>仅覆盖 Codex App</strong>——不影响同一机器的其他 AI 工具。CC Switch 侧重 API 路由，可统一管理多个 AI 工具的供应商切换。两者可以共存。
      </Callout>

      <h3 id="section-cn-ccx">方案 C：CCX 协议网关</h3>

      <p>
        CCX（<a href="https://github.com/BenedictKing/ccx" target="_blank" rel="noopener">GitHub <ExternalLink className="inline h-3 w-3" /></a>）
        是独立维护的 AI API 代理与协议转换网关，作为本地服务运行（支持 Node.js 或 Docker 部署）。
        适合需要同时管理 Claude Code、Codex、Gemini CLI 等多个工具的用户。
      </p>

      <p><strong>按以下步骤配置：</strong></p>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>安装 Node.js（LTS 版本）或 Docker</li>
        <li>部署 CCX 服务，设置访问密钥和端口</li>
        <li>在 CCX 管理界面添加 DeepSeek 等渠道，填写 API Key 和 base_url</li>
        <li>将 Codex 的 Provider 指向本地 CCX 地址（通过 CC Switch 或手动 config.toml）</li>
        <li>重新启动 Codex CLI</li>
      </ol>

      <Collapsible summary="与方案 A 的区别">
        <p>CCX 的配置步骤比 CC Switch 多——需要部署本地服务、管理配置文件。
        但它作为独立网关，各工具的配置互不干扰，排查问题时更容易隔离故障点。
        如果你已经使用 Docker 且需要多工具统一管理，CCX 提供了更高的透明度。</p>
      </Collapsible>

      <h3 id="section-cn-relay">方案 D：中转站直连</h3>

      <Collapsible summary="什么是中转站（API 代理）">
        <p>
          「中转站」（也称 API 代理/中转服务）是第三方提供的 API 转发服务。
          用户的请求先发到中转站，中转站再转发给模型供应商（如 OpenAI、DeepSeek），
          最后把响应返回给用户。对国内用户而言，中转站解决了两个问题：
          ① 网络——中转站服务器在可直连的网络环境中，用户不需要科学上网；
          ② 支付——支持支付宝/微信，不需要海外信用卡。
        </p>
        <p>
          <strong>注意</strong>：中转站能看到你的请求内容（包括代码）。
          选择时优先考虑有隐私承诺、数据加密的服务。使用中转站即表示你信任该服务商。
          本站列出的方案均以技术配置为主，不推荐也不评估任何特定中转服务——
          建议在使用前搜索该服务的用户反馈和隐私政策。
        </p>
      </Collapsible>

      <p>
        <strong>前提</strong>：部分国内中转服务已在服务端完成 Responses ↔ Chat Completions 协议转换，
        直接提供兼容 Codex 的端点。此时无需任何额外工具——只改 <code>openai_base_url</code> 即可。
      </p>

      <CodeBlock language="bash" code={`# 通过环境变量设置中转地址和 Key\nexport OPENAI_BASE_URL="https://你的中转地址/v1"\nexport OPENAI_API_KEY="你的中转Key"`} />

      <Callout type="warning" summary="前提确认">
        大多数中转站默认只提供 Chat Completions 端点，未做 Responses API 兼容。
        直接将 Chat 格式的地址写入 <code>openai_base_url</code> 会返回 404 或 400。
        配置前向中转服务确认是否支持 Codex（Responses API）。不支持则需用方案 A、B 或 C。
      </Callout>

      <h3 id="section-cn-config">方案 E：手动多 Provider 配置</h3>

      <p>
        Codex CLI 支持 <code>[model_providers]</code> 块自定义供应商，不依赖第三方工具——
        但需要理解字段含义。
      </p>

      <Callout type="warning" summary="wire_api = 'chat' 已于 2026-02 停用">
        Codex 在 2026 年 2 月正式移除该协议支持
        （<a href="https://github.com/openai/codex/discussions/7782" target="_blank" rel="noopener">GitHub 公告 <ExternalLink className="inline h-3 w-3" /></a>），
        目前 <code>wire_api</code> 只能为 <code>"responses"</code>。如看到的教程包含 <code>wire_api = "chat"</code>，已过时。
      </Callout>

      <p>以下为基本结构（具体字段因供应商而异）：</p>

      <CodeBlock language="toml" code={`# ~/.codex/config.toml\nmodel_provider = "my_provider"\n\n[model_providers.my_provider]\nname = "自定义供应商名称"\nbase_url = "https://你的API端点/v1"\nenv_key = "MY_API_KEY"\nwire_api = "responses"`} />

      <ConfigTable
        rows={[
          ["model_provider", "指定当前使用的供应商名称（对应 [model_providers.xxx] 中的名称）"],
          ["base_url", "API 端点地址"],
          ["env_key", "API Key 从哪个环境变量读取（避免 Key 写死在配置文件）"],
          ["wire_api", "通信协议，当前只支持 \"responses\""],
        ]}
      />

      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        完整字段说明见{" "}
        <a href="https://developers.openai.com/codex/config-advanced" target="_blank" rel="noopener">OpenAI 官方 Codex 配置文档 <ExternalLink className="inline h-3 w-3" /></a>。
      </p>

      <h3 id="section-cn-compare">方案对比</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>维度</th>
              <th className="text-left py-2 pr-3 font-semibold text-[14px]" style={{ color: "var(--color-text-primary)" }}>CC Switch</th>
              <th className="text-left py-2 pr-3 font-semibold text-[14px]" style={{ color: "var(--color-text-primary)" }}>Codex++</th>
              <th className="text-left py-2 pr-3 font-semibold text-[14px]" style={{ color: "var(--color-text-primary)" }}>CCX</th>
              <th className="text-left py-2 pr-3 font-semibold text-[14px]" style={{ color: "var(--color-text-primary)" }}>中转站直连</th>
              <th className="text-left py-2 font-semibold text-[14px]" style={{ color: "var(--color-text-primary)" }}>手动配置</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>配置方式</strong></td>
              <td className="py-2 pr-4">GUI 操作</td>
              <td className="py-2 pr-4">GUI 操作</td>
              <td className="py-2 pr-4">部署本地服务 + Web UI</td>
              <td className="py-2 pr-4">改一行地址</td>
              <td className="py-2">手写 TOML</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>需要额外工具</strong></td>
              <td className="py-2 pr-4">CC Switch</td>
              <td className="py-2 pr-4">Codex++</td>
              <td className="py-2 pr-4">Docker 或 Node.js</td>
              <td className="py-2 pr-4">无</td>
              <td className="py-2">无</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>协议转换位置</strong></td>
              <td className="py-2 pr-4">CC Switch 本地代理</td>
              <td className="py-2 pr-4">Codex++ 本地注入</td>
              <td className="py-2 pr-4">CCX 本地网关</td>
              <td className="py-2 pr-4">中转站服务端</td>
              <td className="py-2">不转换（需供应商兼容）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>覆盖范围</strong></td>
              <td className="py-2 pr-4">Claude Code / Codex 等</td>
              <td className="py-2 pr-4">仅 Codex App</td>
              <td className="py-2 pr-4">Claude Code / Codex 等</td>
              <td className="py-2 pr-4">仅 Codex</td>
              <td className="py-2">仅 Codex</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>附加功能</strong></td>
              <td className="py-2 pr-4">权限跳过</td>
              <td className="py-2 pr-4">插件解锁 / 会话管理</td>
              <td className="py-2 pr-4">统一网关管理</td>
              <td className="py-2 pr-4">无</td>
              <td className="py-2">可自定义全部参数</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>适用场景</strong></td>
              <td className="py-2 pr-4">新手 / 不想碰配置文件</td>
              <td className="py-2 pr-4">Codex App + 插件需求</td>
              <td className="py-2 pr-4">多工具统一管理</td>
              <td className="py-2 pr-4">有可信中转服务</td>
              <td className="py-2">精确控制 / 最小依赖</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="section-cn-troubleshoot">配置不生效时的排查思路</h3>

      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>确认 Codex 版本</strong>：<code>codex --version</code>，确保 v0.131.0+</li>
        <li><strong>确认 API Key 有效</strong>：用 <code>curl</code> 直接测试供应商端点，排除 Key 本身无效</li>
        <li><strong>确认协议转换层运行中</strong>：如果用 CC Switch / Codex++ / CCX，确保本地路由进程存活</li>
        <li><strong>查看 Codex 日志</strong>：通常位于 <code>~/.codex/logs/</code></li>
      </ol>

      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        以上步骤未解决问题时，建议到以下渠道以"报错信息 + 工具名"搜索最新讨论：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>搜索引擎以 "Codex + 你的报错信息" 或 "Codex 接入国产模型" 搜索最新讨论</li>
        <li><a href="https://github.com/farion1231/cc-switch/issues" target="_blank" rel="noopener">CC Switch GitHub Issues <ExternalLink className="inline h-3 w-3" /></a>（搜索版本号和报错）</li>
      </ul>

      <FreshnessNote>以上方案涉及的版本状态、协议兼容性说明验证于 2026-06。功能更新以各项目官网和 GitHub 为准。</FreshnessNote>
    </div>
  );
}

/* ================================================================
   Codex 配置指南
   ================================================================ */

export default renderCodexConfig;
