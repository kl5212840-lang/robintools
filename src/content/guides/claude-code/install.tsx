import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderClaudeInstall(platform: Platform) {
  const isWin = platform === "windows";
  const isMac = platform === "macos";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        按照以下步骤在你的 {isWin ? "Windows" : isMac ? "macOS" : "Linux"} 系统上安装 Claude Code。
      </p>
      <p className="text-[16px] leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
        三种安装方式（CLI / VS Code 插件 / Desktop 桌面版）的配置文件共用（{isWin ? `Windows：<code>C:\\Users\\你的用户名\\.claude\\settings.json</code>` : isMac ? `macOS：<code>~/.claude/settings.json</code>` : `Linux：<code>~/.claude/settings.json</code>`}），配一次多处生效。下方按安装方式分别介绍。
      </p>

      <Collapsible summary="npm 安装已标记弃用（详情）">
        <Callout type="warning">
        <strong>npm 安装已标记弃用</strong>：自 v2.1.15（2026 年 1 月）起，官方不再推荐 <code>npm install -g @anthropic-ai/claude-code</code>，原生安装器成为首选。npm 包仍正常更新（最新版 2.1.177），仍可正常使用，只是存在依赖冲突和权限问题的可能。如已用 npm 安装，运行 <code>claude install</code> 即可一键迁至原生版——无需重装，所有配置完整保留。
        </Callout>
      </Collapsible>
      <FreshnessNote>以上 npm 弃用状态、版本号验证于 2026-06-17。</FreshnessNote>

      <h2 id="section-prereqs"><span className="step-badge">1</span>安装前置依赖</h2>
      {isWin && (
        <>
          <p>需要 <strong>Git for Windows</strong>：提供 Bash 命令行环境，Claude Code 的原生安装脚本依赖 Bash 执行。同时也用于 Git 版本管理：</p>
          <CodeBlock language="powershell" code={`# 安装 Git for Windows\nwinget install Git.Git`} />
          <Collapsible summary="安装后验证">
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
              执行后应看到：下载进度条 → "已成功安装"。安装后需<strong>重启终端</strong>使 Git 生效。重启后运行 <code>git --version</code>，应输出 <code>git version 2.4x.x</code>。
            </p>
          </Collapsible>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            卡在这一步？查看{" "}
            <a href="/claude-code/troubleshoot#winget-package-not-found" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>
        </>
      )}
      {isMac && (
        <>
          <p>macOS 需要 <strong>Homebrew</strong> 包管理器（已安装可跳过）：</p>
          <CodeBlock language="bash" code={`# 安装 Homebrew\n# ⚠️ raw.githubusercontent.com 在国内可能无法访问\n# 如遇超时，可搜索"Homebrew 国内镜像安装"使用国内源\n/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`} />
          <Collapsible summary="安装后验证">
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
              执行后应看到：安装脚本提示 → 输入密码 → "Installation successful!"。安装完成后运行 <code>brew --version</code> 应输出 <code>Homebrew 4.x.x</code>。
            </p>
          </Collapsible>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            卡在这一步？查看{" "}
            <a href="/claude-code/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>
        </>
      )}
      {!isWin && !isMac && (
        <>
          <p>确保系统已安装 <strong>curl</strong>、<strong>git</strong> 和 <strong>Node.js 18+</strong>：</p>
          <CodeBlock language="bash" code={`# Debian/Ubuntu\nsudo apt update && sudo apt install -y curl git\n\n# 安装 Node.js 22.x（推荐）\n# 先清理可能残留的旧版 libnode-dev（否则 dpkg 会冲突）\nsudo apt purge -y libnode-dev nodejs nodejs-dev 2>/dev/null\ncurl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt install -y nodejs\n\n# 验证安装\ngit --version && node --version\n# git 应输出版本号如 git version 2.x.x\n# node 应输出版本号如 v22.x.x`} />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Fedora 用户：<code>sudo dnf install -y curl git nodejs</code>。Arch 用户：<code>sudo pacman -S curl git nodejs</code>。
          </p>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            卡在这一步？查看{" "}
            <a href="/claude-code/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>
        </>
      )}

      <h2 id="section-install"><span className="step-badge">2</span>CLI 命令行安装</h2>

	{isWin && (
        <Collapsible summary="网络要求（详情）">
        <Callout type="warning" keep>
          <strong>网络要求</strong>：方式一（原生安装器）需要访问 <code>claude.ai</code> 下载安装脚本，该域名在国内无法直连，<strong>需开启科学上网</strong>。如果暂时没有科学上网条件，请使用<strong>方式二（WinGet，微软 CDN 国内可直连）</strong>或<strong>方式三（npm，需 Node.js）</strong>。安装完成后，模型的 API 配置还涉及网络问题，详见「配置指南」。
        </Callout>
        </Collapsible>
      )}
      {isMac && (
        <Collapsible summary="网络要求（详情）">
        <Callout type="warning" keep>
          <strong>网络要求</strong>：方式一（原生安装器）需要访问 <code>claude.ai</code> 下载安装脚本，该域名在国内无法直连，<strong>需开启科学上网</strong>。如果暂时没有科学上网条件，请使用<strong>方式二（Homebrew，GitHub 源国内可能较慢）</strong>或<strong>方式三（npm，需 Node.js）</strong>。安装完成后，模型的 API 配置还涉及网络问题，详见「配置指南」。
        </Callout>
        </Collapsible>
      )}
      {(!isWin && !isMac) && (
        <Collapsible summary="网络要求（详情）">
        <Callout type="warning" keep>
          <strong>网络要求</strong>：方式一（原生安装器）需要访问 <code>claude.ai</code> 下载安装脚本，该域名在国内无法直连，<strong>需开启科学上网</strong>。如果暂时没有科学上网条件，请使用<strong>方式二（apt / dnf / apk 仓库安装，<code>downloads.claude.ai</code> 国内可能较慢）</strong>或<strong>方式三（npm，需 Node.js）</strong>。安装完成后，模型的 API 配置还涉及网络问题，详见「配置指南」。
        </Callout>
        </Collapsible>
      )}

      <p>选择以下方式之一（推荐原生安装器，支持自动更新）：</p>

      {isWin && (
        <>
          <h3>方式一：原生安装器（推荐，需科学上网）</h3>
          <CodeBlock language="powershell" code={`# 在 PowerShell 中运行（非管理员也可）\nirm https://claude.ai/install.ps1 | iex`} />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>CMD 用户：请使用 PowerShell 脚本安装（<code>powershell -c "irm https://claude.ai/install.ps1 | iex"</code>），或安装 Git Bash 后使用上方 Bash 命令。</p>
          <Collapsible summary="预期输出">
            <p>执行后应看到：下载进度 → 安装完成提示 → 版本号。整个过程约 10–30 秒。</p>
          </Collapsible>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            如遇报错，查看{" "}
            <a href="/claude-code/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>

          <h3>方式二：WinGet（无需科学上网，推荐国内用户）</h3>
          <CodeBlock language="powershell" code={`# WinGet 安装（手动更新）\nwinget install Anthropic.ClaudeCode\n\n# 更新：winget upgrade Anthropic.ClaudeCode`} />
          <p>执行后应看到：搜索包 → 下载进度条 → "已成功安装"。</p>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            如遇报错，查看{" "}
            <a href="/claude-code/troubleshoot#winget-package-not-found" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>
        </>
      )}
      {isMac && (
        <>
          <h3>方式一：原生安装器（推荐，需科学上网）</h3>
          <CodeBlock language="bash" code={`# 原生安装器（自动更新）\ncurl -fsSL https://claude.ai/install.sh | bash\n\n# 如需测试版\ncurl -fsSL https://claude.ai/install.sh | bash -s latest`} />
          <Collapsible summary="预期输出">
            <p>执行后应看到：下载进度 → "Claude Code installed" → 版本号。约 5–15 秒。</p>
          </Collapsible>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            如遇报错，查看{" "}
            <a href="/claude-code/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>

          <h3>方式二：Homebrew（国内可直连但较慢）</h3>
          <CodeBlock language="bash" code={`# Homebrew 安装（手动更新）\nbrew install --cask claude-code\n\n# 更新：brew upgrade claude-code`} />
          <Collapsible summary="预期输出">
            <p>执行后应看到：下载进度 → 🍺 图标 → "claude-code was successfully installed!"。</p>
          </Collapsible>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            如遇报错，查看{" "}
            <a href="/claude-code/troubleshoot#homebrew-not-installed" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>
        </>
      )}
      {!isWin && !isMac && (
        <>
          <h3>方式一：原生安装器（需科学上网）</h3>
          <CodeBlock language="bash" code={`# 原生安装器（自动更新）\ncurl -fsSL https://claude.ai/install.sh | bash`} />
          <Collapsible summary="预期输出">
            <p>执行后应看到：下载进度 → 安装完成 → 版本号。</p>
          </Collapsible>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            如遇报错，查看{" "}
            <a href="/claude-code/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查 → 安装问题</a>
          </p>


          <h3>方式二：apt / dnf / apk 仓库安装（签名仓库，无需科学上网）</h3>
          <Collapsible summary="apt / dnf / apk 仓库安装命令">
      <CodeBlock language="bash" code={`# Debian/Ubuntu（apt 仓库，stable 通道）\nsudo install -d -m 0755 /etc/apt/keyrings\nsudo curl -fsSL https://downloads.claude.ai/keys/claude-code.asc \\\\\n  -o /etc/apt/keyrings/claude-code.asc\necho "deb [signed-by=/etc/apt/keyrings/claude-code.asc] https://downloads.claude.ai/claude-code/apt/stable stable main" \\\\\n  | sudo tee /etc/apt/sources.list.d/claude-code.list\nsudo apt update && sudo apt install -y claude-code\n\n# Fedora/RHEL（dnf 仓库，stable 通道）\nsudo tee /etc/yum.repos.d/claude-code.repo <<EOF\n[claude-code]\nname=Claude Code\nbaseurl=https://downloads.claude.ai/claude-code/rpm/stable\nenabled=1\ngpgcheck=1\ngpgkey=https://downloads.claude.ai/keys/claude-code.asc\nEOF\nsudo dnf install -y claude-code\n\n# Alpine（apk 仓库）\nwget -O /etc/apk/keys/claude-code.rsa.pub \\\\\n  https://downloads.claude.ai/keys/claude-code.rsa.pub\necho "https://downloads.claude.ai/claude-code/apk/stable" >> /etc/apk/repositories\napk update && apk add claude-code`} />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            升级：apt — <code>sudo apt update && sudo apt upgrade claude-code</code>；dnf — <code>sudo dnf upgrade claude-code</code>；apk — <code>apk update && apk upgrade claude-code</code>。仓库安装不会自动更新，需手动运行升级命令。
          </p>
      </Collapsible>
        </>
      )}

      {isWin && (
        <Callout type="info" summary="PowerShell vs CMD 区别">
          看到 <code>PS C:\&gt;</code> 表示在 PowerShell 中，用 <code>irm</code> 命令；看到 <code>C:\&gt;</code> 表示在 CMD 中，用 <code>curl</code> 命令。在 PowerShell 中用 CMD 语法会报错，反之亦然。不确定的话关闭当前窗口，Win+R 输入 <code>powershell</code> 打开干净的 PowerShell。
        </Callout>
      )}

      <h3>方式三：npm 安装（三端通用）</h3>
      <p>
        npm 是 Claude Code 最早的安装方式。自 v2.1.15 起，官方已将其标记为弃用，推荐原生安装器代替，但 npm 包仍正常更新（截至 2026-06 最新版 2.1.177），仍在维护。当原生安装器或包管理器不可用时，可通过 npm 安装。
      </p>

      {(!isWin && !isMac) && (
        <>
          <p className="text-[15px] font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>先配置 npm 全局安装目录（避免 sudo）</p>
          <Callout type="warning">
            全局安装 npm 包默认写入系统目录，普通用户无写入权限，会报 <code>EACCES: permission denied, mkdir</code>。一步配好用户级目录，以后用 <code>npm install -g</code> 不再需要 <code>sudo</code>：
            <CodeBlock language="bash" code={`# 创建用户级全局安装目录\nmkdir -p ~/.npm-global\n\n# 配置 npm\nnpm config set prefix ~/.npm-global\n\n# 将该目录的 bin 加入 PATH（追加到 ~/.bashrc 或 ~/.zshrc）\necho 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc\nsource ~/.bashrc`} />
          </Callout>
        </>
      )}

      <Collapsible summary="国内用户：先切换镜像源再安装">
        <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
          <code>registry.npmjs.org</code> 在国内可能很慢或无法连接。安装前先切换到以下任一国内镜像（推荐淘宝源）：
        </p>
        <CodeBlock language="bash" code={`# 推荐：淘宝源\nnpm config set registry https://registry.npmmirror.com\n\n# 验证切换成功\nnpm config get registry\n# 应输出：https://registry.npmmirror.com/`} />
        <Collapsible summary="其他镜像源（华为云 / 腾讯云）">
          <CodeBlock language="bash" code={`# 华为云\nnpm config set registry https://mirrors.huaweicloud.com/repository/npm/\n\n# 腾讯云\nnpm config set registry https://mirrors.cloud.tencent.com/npm/\n\n# 恢复官方源\nnpm config set registry https://registry.npmjs.org`} />
        </Collapsible>
      </Collapsible>

      <CodeBlock language="bash" code={`# 切换镜像源后执行安装（Windows / macOS / Linux 通用，需 Node.js 18+）\nnpm install -g @anthropic-ai/claude-code\n\n# 验证安装\nclaude --version\n# 应输出版本号如 2.1.x`} />

      <Callout type="info" summary="迁移到原生安装">
        如后续想切换至官方推荐的原生安装，在终端运行 <code>claude install</code> 即可一键迁移。所有配置、会话、记忆完整保留，无需卸载重装。
      </Callout>

      <h2 id="section-vscode"><span className="step-badge">3</span>VS Code 插件安装</h2>
      <p>适合习惯在 IDE 中工作的开发者，界面友好、操作直观。支持 {isWin ? "Windows" : isMac ? "macOS" : "Linux"} 平台。</p>
      <h3>在线安装</h3>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开 VS Code</li>
        <li>扩展商店搜索 <strong>"Claude Code"</strong>（发布者 Anthropic）</li>
        <li>点击安装 → 左侧出现 Claude Code 图标即成功</li>
      </ol>
      <Collapsible summary="验证">
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          验证：安装后 VS Code 左侧活动栏会出现一个 Claude Code 图标（对话气泡 + 终端图标组合样式）。点击图标会打开 Claude Code 面板。
        </p>
      </Collapsible>
      <h3>离线安装（国内网络不好时）</h3>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>下载对应平台的离线包（可到 B站或其他网络平台搜索 "Claude Code 离线安装" 查找资源）</li>
        <li>VS Code → 扩展 → ... → "从 VSIX 安装" → 选择下载的文件</li>
        <li>验证：左侧出现 Claude Code 图标，打开文件时右上角也有图标</li>
      </ol>
      <Callout type="warning" summary="注意">
        VS Code 插件扩展市场在国内可直连，一般不需要离线安装。如果下载速度慢，等一会儿就好（扩展包体积不大）。离线安装包版本可能不是最新的，优先尝试在线安装。
      </Callout>
      <Collapsible summary="可选设置">
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          可选：VS Code 设置 → 搜索 <code>claudeCode.disableLoginPrompt</code> → 勾选，禁用登录提示。
        </p>
      </Collapsible>

      <h2 id="section-desktop"><span className="step-badge">4</span>Desktop 桌面版安装</h2>
      {isWin ? (
        <>
          <p>适合不需要命令行的 Windows 用户，提供独立的桌面应用体验。</p>
          <h3>在线安装（需全程科学上网）</h3>
          <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>官网 <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a> 下载 <code>Claude Setup.exe</code></li>
            <li>双击运行（本质是引导下载器，需联网拉取安装包 <code>Claude.msix</code>）</li>
          </ol>
          <h3>离线安装（无需科学上网，推荐国内用户）</h3>
          <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>直接获取 <code>Claude.msix</code> 安装包（可到 B站或其他网络平台搜索 "Claude Desktop 安装包" 查找）</li>
            <li>双击安装（注意：<strong>无法指定安装位置</strong>）</li>
            <li>适用于 Windows 桌面版（从 claude.ai/download 下载最新版）</li>
          </ol>
          <Callout type="warning" summary="桌面版特别说明">
            Cowork / Workspace 功能需要沙盒化 Linux 环境，需从 Anthropic 服务器下载约 2.5GB 文件（解压后约 13GB）。国内网络通常连不上，可手动下载文件放入指定目录（见故障排查页）。如果不需要 Cowork 功能，此错误不影响常规对话。
          </Callout>
        </>
      ) : isMac ? (
        <Callout type="info">
          <strong>macOS 用户</strong>：Claude Desktop 提供 macOS 版本。访问 <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download <ExternalLink className="inline h-3 w-3" /></a> 下载 <code>Claude.dmg</code>，双击打开后拖入 Applications 文件夹即可。下载需要科学上网。
        </Callout>
      ) : (
        <Callout type="info">
          <strong>Linux 用户</strong>：Claude Desktop 目前仅提供 Windows 和 macOS 版本。Linux 用户请使用 CLI 命令行或 VS Code 插件方式安装 Claude Code。
        </Callout>
      )}

      <h2 id="section-verify-install"><span className="step-badge">5</span>验证安装</h2>
      <p>根据你选择的安装方式，验证方法不同：</p>

      <h3>如果装的是 CLI 命令行</h3>
      <CodeBlock language="bash" code={`# 检查版本号\nclaude --version\n\n# 进入项目目录启动\ncd 你的项目目录\nclaude`} />
      <Collapsible summary="正常情况">
        <p><strong>正常情况</strong>：<code>claude --version</code> 应输出版本号，格式如 <code>Claude Code v2.x.x</code>。</p>
      </Collapsible>
      <p>看到版本号和欢迎界面即安装成功 ✅。</p>

      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如遇报错，查看{" "}
        <a href="/claude-code/troubleshoot#command-not-found-after-install" style={{ color: "var(--color-accent)" }}>故障排查</a>
      </p>

      <h3>如果装的是 VS Code 插件</h3>
      <p>安装后 VS Code 左侧活动栏会出现 Claude Code 图标（对话气泡 + 终端图标组合）。点击图标打开 Claude Code 面板，能看到对话输入框即安装成功 ✅。</p>

      <h3>如果装的是 Desktop 桌面版</h3>
      <p>{isWin ? "开始菜单或桌面双击 Claude 图标，应用正常启动并显示欢迎页即安装成功 ✅。" : isMac ? "从启动台或 Applications 文件夹双击 Claude 图标，应用正常启动并显示欢迎页即安装成功 ✅。" : "桌面版目前仅提供 Windows 和 macOS 版本。"}</p>

      <h2 id="section-first-run"><span className="step-badge">6</span>首次运行（CLI 用户）</h2>
      <p>如果你装的是<strong>CLI 命令行</strong>版本，第一次运行 <code>claude</code> 时，按以下顺序出现：</p>
      <ol className="list-decimal pl-5 space-y-3 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>
          <strong>工作目录确认</strong>：Claude Code 会问你 "是否信任当前目录？"——选 <strong>Yes / Trust</strong>。这个提示只在当前目录第一次出现。
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Claude Code 需要访问项目文件才能工作，不信任的话 AI 看不到你的代码。</p>
        </li>
        <li>
          <strong>API Key 验证</strong>：如果还没配置 API Key（settings.json），Claude Code 会提示你配置。按照「配置指南」操作即可。
        </li>
        <li>
          <strong>欢迎界面</strong>：配置成功后出现 Claude Code 的欢迎界面和输入提示符，可以直接输入指令了。
        </li>
      </ol>

      <Callout type="info" summary="第一次使用建议">
        启动后先输入 <code>你好，介绍一下你自己</code> 测试连通性。如果 AI 正常回复，说明安装和配置都成功了。如果发送后长时间无响应或报错，参考「故障排查」标签页。
      </Callout>
      <Collapsible summary="VS Code / Desktop 用户提示">
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          VS Code 插件和 Desktop 桌面版用户可跳过本节——验证已在第 6 步完成。
        </p>
      </Collapsible>


      <Collapsible summary="更多参考：Claude Code 中文站">
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          <a href="https://claude-zh.cn/" target="_blank" rel="noopener">Claude Code 中文站 <ExternalLink className="inline h-3 w-3" /></a> 是社区维护的 Claude Code 中文教程，涵盖安装指引、命令参考、高级配置等内容。安装方式侧重于镜像加速和一行命令快速跑通，作为本指南的补充参考。
        </p>
      </Collapsible>
    </div>
  );
}

export default renderClaudeInstall;
