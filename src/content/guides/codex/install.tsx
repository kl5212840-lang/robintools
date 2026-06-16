import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCodexInstall(platform: Platform) {
  const isWin = platform === "windows";
  const isMac = platform === "macos";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        按照以下步骤在你的 {isWin ? "Windows" : isMac ? "macOS" : "Linux"} 系统上安装 Codex CLI。
      </p>

      <Callout type="info" summary="前置条件">
        需要 <strong>Node.js 22+</strong>（推荐）或 18+。Codex CLI 基于 Rust 开发（开源于 <a href="https://github.com/openai/codex" target="_blank" rel="noopener">github.com/openai/codex <ExternalLink className="inline h-3 w-3" /></a>），通过 npm 分发。认证方式有两种：<strong>ChatGPT 订阅登录</strong>（Plus / Pro / Team / Enterprise / Edu）或 <strong>API Key</strong>。
      </Callout>

      <Callout type="warning" summary="网络要求">
        Codex 需要访问 OpenAI 服务器进行 AI 推理。OpenAI 相关域名（<code>api.openai.com</code>、<code>platform.openai.com</code>）在国内无法直连，<strong>需开启科学上网</strong>。安装步骤本身（npm 下载）在国内可以完成。国内 API 接入方案（CC Switch / CCX / 中转站 / 手动配置）见<a href="/codex/config#section-cn-api">配置指南 → §4 国内 API 接入</a>。
      </Callout>

      <h2 id="section-overview"><span className="step-badge">1</span>工具简介</h2>

      <p>Codex CLI 的核心特点：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>沙箱安全</strong>：默认在隔离环境中运行，不能修改系统文件（这是安全设计，不是 Bug）</li>
        <li><strong>ChatGPT 订阅直接可用</strong>：已有 ChatGPT Plus/Pro 等订阅无需额外付费</li>
        <li><strong>开源</strong>：代码托管在 GitHub（github.com/openai/codex）</li>
        <li><strong>适用人群</strong>：ChatGPT 订阅用户、需要沙箱安全保障的开发者</li>
      </ul>
      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        与其他工具的横向对比见<a href="/compare" style={{ color: "var(--color-accent)" }}>工具对比表</a>。
      </p>

      <h2 id="section-prereqs"><span className="step-badge">2</span>安装前置依赖</h2>
      <p>Codex CLI 的核心依赖只有一个：<strong>Node.js</strong>。以下是各平台的安装方式：</p>

      {isWin && (
        <>
          <h3>2.1 安装 WSL2（Windows 用户必须先看）</h3>
          <Callout type="warning" summary="什么是 WSL2">
            WSL2（Windows Subsystem for Linux）是 Windows 自带的 Linux 子系统，让你在 Windows 里运行一个完整的 Linux 环境。Codex CLI 在 Windows 原生支持仍为实验性，<strong>建议通过 WSL2 使用</strong>，否则可能遇到兼容性问题。
          </Callout>
          <p>安装步骤：</p>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li><strong>以管理员身份打开 PowerShell</strong>：右键开始菜单 → Windows PowerShell（管理员）</li>
            <li>运行安装命令：</li>
          </ol>
          <CodeBlock language="powershell" code={`# 安装 WSL2（会自动安装 Ubuntu）\nwsl --install`} />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>这个命令会自动启用虚拟机平台、安装 WSL2 内核、并默认安装 Ubuntu 发行版。整个过程约 5–10 分钟。</p>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" start={3} style={{ color: "var(--color-text-secondary)" }}>
            <li><strong>重启电脑</strong>：安装完成后必须重启，WSL2 才能生效</li>
            <li><strong>首次启动 Ubuntu</strong>：重启后在开始菜单搜索 "Ubuntu"，打开后会提示创建用户名和密码（这个密码是 Linux 的密码，和 Windows 无关）</li>
            <li>WSL2 环境准备完毕。之后的 Node.js 安装和 Codex 安装都在 <strong>Ubuntu 终端</strong> 中操作</li>
          </ol>
          <Callout type="warning" keep>
            <strong>wsl --install 常见报错</strong>：如果提示 "请启用虚拟机平台" 或 "WSL2 内核未安装"，说明 Windows 版本过旧或缺少组件。这一步如果没搞好，后面全部做不了。
            <Collapsible summary="查看解决方案">
              <ol>
                <li>确保 Windows 10 版本 ≥ 2004 或 Windows 11</li>
                <li>在"启用或关闭 Windows 功能"中勾选 "Hyper-V" 和 "虚拟机平台"</li>
                <li>参考 <a href="https://learn.microsoft.com/zh-cn/windows/wsl/troubleshooting" target="_blank" rel="noopener">微软 WSL 官方排查文档 <ExternalLink className="inline h-3 w-3" /></a></li>
              </ol>
            </Collapsible>
          </Callout>

          <h3>2.2 在 WSL2 中安装 Node.js</h3>
          <p>打开 Ubuntu 终端，执行以下命令：</p>
          <CodeBlock language="bash" code={`# 更新包列表\nsudo apt update\n\n# 安装 Node.js 22.x（推荐版本）\n# 方法一：使用 NodeSource 官方源\ncurl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt install -y nodejs\n\n# 方法二：使用 nvm（版本管理更灵活，推荐）\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash\n# 关闭终端重新打开，然后：\nnvm install 22\nnvm use 22`} />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
            ⚠️ <code>raw.githubusercontent.com</code> 在国内可能间歇性无法访问。如遇超时，可通过代理访问，或改用方法一（NodeSource 官方源）安装 Node.js。
          </p>
        </>
      )}
      {isMac && (
        <>
          <h3>2.1 安装 Homebrew（已安装可跳过）</h3>
          <p>Homebrew 是 macOS 的包管理器，后续安装 Node.js 会用到。如果你还没装：</p>
          <CodeBlock language="bash" code={`# 安装 Homebrew\n# ⚠️ raw.githubusercontent.com 在国内可能无法访问\n# 如遇超时，可搜索"Homebrew 国内镜像安装"使用国内源\n/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`} />

          <h3>2.2 安装 Node.js</h3>
          <CodeBlock language="bash" code={`# 方法一：Homebrew（推荐）\nbrew install node@22\n\n# 方法二：从 nodejs.org 下载安装包\n# 访问 https://nodejs.org 下载 macOS 安装包（.pkg），双击安装`} />
        </>
      )}
      {!isWin && !isMac && (
        <>
          <h3>2.1 安装 Node.js</h3>
          <p>确保系统已安装 <strong>curl</strong> 和 <strong>git</strong>，然后安装 Node.js：</p>
          <CodeBlock language="bash" code={`# 安装基础工具（Debian/Ubuntu）\nsudo apt update && sudo apt install -y curl git\n\n# 安装 Node.js 22.x\ncurl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt install -y nodejs`} />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Fedora 用户：先运行 <code>sudo dnf install -y curl git</code>，再使用 nvm 安装 Node.js 22（推荐，版本管理更灵活）：<code>curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash</code>，重启终端后执行 <code>nvm install 22</code>。</p>
        </>
      )}

      <h3>{isWin ? "2.3" : isMac ? "2.3" : "2.2"} 验证 Node.js 安装</h3>
      <CodeBlock language="bash" code={`# 检查 Node.js 版本（应显示 v22.x.x 或更高）\nnode --version\n\n# 检查 npm 版本\nnpm --version`} />
      <p>如果显示版本号，说明 Node.js 安装成功 ✅。</p>
      <Callout type="warning" keep>
        {(() => {
          if (isWin) return <><strong>如果提示 "command not found"</strong>：① 关闭终端重新打开再试；② 确认你是在 Ubuntu 终端（WSL2）中操作，不是在 PowerShell 或 CMD 中。</>;
          if (isMac) return <><strong>如果提示 "command not found"</strong>：① 关闭终端重新打开再试；② 如果用 Homebrew 安装的，检查 /opt/homebrew/bin 是否在 PATH 中（运行 echo $PATH 查看）；③ 如果用 .pkg 安装的，重启终端后再试。</>;
          return <><strong>如果提示 "command not found"</strong>：① 关闭终端重新打开再试；② 检查安装是否成功：运行 which node 和 which npm 查看路径。</>;
        })()}。
      </Callout>

      <h2 id="section-install"><span className="step-badge">3</span>安装 Codex CLI</h2>
      <p>Codex CLI 通过 npm 安装（npm 是 Node.js 自带的包管理器，无需额外安装）：</p>

      <Callout type="warning" keep>
        <strong>国内用户注意</strong>：npm 官方源（<code>registry.npmjs.org</code>）在国内访问较慢。建议先切换到国内镜像源，下载速度会快很多。
      </Callout>
      <CodeBlock language="bash" code={`# 先切换 npm 镜像源（国内用户推荐）\nnpm config set registry https://registry.npmmirror.com\n\n# 全局安装 Codex CLI\nnpm install -g @openai/codex\n\n# 如需固定版本（CI/CD 环境）\nnpm install -g @openai/codex@0.131.0`} />

      {isMac && (
        <p style={{ marginTop: "1rem" }}>
          macOS 用户：Codex CLI 目前仅支持 npm 安装（<code>npm install -g @openai/codex</code>），不支持 Homebrew。
        </p>
      )}

      <Collapsible summary="可用 yarn / pnpm 安装">
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          也可使用 yarn / pnpm：<code>yarn global add @openai/codex</code> 或 <code>pnpm add -g @openai/codex</code>。
        </p>
      </Collapsible>
      <Callout type="warning" summary="如果 npm 安装报错">
        ① 最常见的错误是 <code>EACCES</code>（权限不足）——{isWin ? "WSL2 中" : ""}通常是 npm 全局目录权限问题，可到 B站搜索 "npm EACCES 权限修复" 解决；② 如提示 <code>ETIMEDOUT</code> 或 <code>ESOCKETTIMEDOUT</code>（网络超时），npm 镜像源可能没切成功，重新执行 <code>npm config set registry https://registry.npmmirror.com</code> 再试；③ 如提示 <code>node version</code> 相关错误，检查 node 版本是否 ≥ 18。
      </Callout>

      <h2 id="section-auth"><span className="step-badge">4</span>选择认证方式</h2>
      <p>Codex CLI 提供两种认证方式，任选其一：</p>

      <h3>方式一：ChatGPT 订阅登录（推荐）</h3>
      <p>适用于 ChatGPT Plus/Pro/Team/Enterprise/Edu 订阅用户。</p>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>在终端输入 <code>codex</code> 并回车</li>
        <li>浏览器会自动弹出 OpenAI 登录页面</li>
        <li>登录你的 ChatGPT 账号 → 授权 Codex CLI 访问</li>
        <li>浏览器显示 "登录成功" 后回到终端，Codex 已就绪</li>
      </ol>
      <Callout type="warning" keep>
        <strong>网络要求</strong>：OpenAI 登录页面（<code>auth.openai.com</code>）在国内无法直连。浏览器弹窗时需要<strong>确保浏览器走了科学上网</strong>，否则会出现页面无法加载或登录超时。
      </Callout>
      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        登录遇到问题？查看{" "}
        <a href="/codex/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查</a>
      </p>

      <h3>方式二：API Key</h3>
      <p>适用于有 OpenAI API Key 的用户（在 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">platform.openai.com/api-keys <ExternalLink className="inline h-3 w-3" /></a> 创建，按使用量计费）。</p>
      <CodeBlock language="bash" code={`# Bash / Zsh（macOS / Linux / WSL2）：\n# 用 read -rs 避免 API Key 记录到 shell 历史\nread -rs OPENAI_API_KEY && export OPENAI_API_KEY\n# 粘贴你的 API Key，按回车确认\n\n# PowerShell（Windows 原生终端）：\n# $env:OPENAI_API_KEY = "sk-你的密钥"\n\n# ⚠️ 绝对不要把 API Key 直接写在 ~/.bashrc 或代码文件里！`} />
      <Callout type="warning" summary="国内用户 — API Key 中转">
        OpenAI API 需要国外信用卡和科学上网。国内可使用中转服务（提供兼容 OpenAI 协议的 API 端点），将 <code>openai_base_url</code> 指向中转地址即可绕过网络限制。四种接入方案详见<a href="/codex/config#section-cn-api">配置指南 → §4 国内 API 接入</a>。
      </Callout>

      <h2 id="section-verify-install"><span className="step-badge">5</span>验证安装</h2>
      <CodeBlock language="bash" code={`# 检查版本号\ncodex --version\n\n# 进入项目目录，启动 Codex\ncd 你的项目目录\ncodex`} />
      <p>看到版本号和欢迎界面即安装成功 ✅。</p>
      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如遇报错，查看{" "}
        <a href="/codex/troubleshoot#codex-command-not-found" style={{ color: "var(--color-accent)" }}>故障排查</a>
      </p>

      <h2 id="section-sandbox"><span className="step-badge">6</span>了解沙箱模式（重要）</h2>
      <p>Codex CLI 的沙箱是它的<strong>核心安全机制</strong>——AI 默认在隔离环境中运行，不能修改你的系统文件。三种模式：</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>模式</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>权限范围</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合场景</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>read-only</code></td>
              <td className="py-2 pr-4">只能读文件，不能写任何东西</td>
              <td className="py-2">代码审查、分析项目</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><code>workspace-write</code></td>
              <td className="py-2 pr-4">可修改项目目录内的文件</td>
              <td className="py-2">日常开发（推荐）</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><code>danger-full-access</code></td>
              <td className="py-2 pr-4">全盘访问，无任何限制</td>
              <td className="py-2">⚠️ 不推荐，有误删风险</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Callout type="warning" keep>
        <strong>重要安全提醒</strong>：① 新手建议使用默认的 <code>workspace-write</code> 模式；② 绝对不要让 Codex 执行清理或删除文件夹的操作；③ 操作前用 Git 提交代码；④ <code>danger-full-access</code> 有全盘清空风险，除非你完全清楚后果，否则不要使用。沙箱模式在 <code>~/.codex/config.toml</code> 中配置（详见「配置指南」）。
      </Callout>

      <FreshnessNote>以上安装步骤涉及的版本号（Node.js 22+、Codex CLI v0.131.0）和 npm 镜像源验证于 2026-06。工具版本迭代频繁，建议以各项目官方文档为准。</FreshnessNote>
    </div>
  );
}

export default renderCodexInstall;
