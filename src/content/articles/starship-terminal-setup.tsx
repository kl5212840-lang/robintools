import { CodeBlock } from "@/components/content/code-block";
import { Callout, Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderStarshipTerminalSetup() {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Starship 是一个跨 shell 的终端提示符工具——用 Rust 编写，单个二进制文件，配置文件只有一份 TOML。
        支持 Bash、Zsh、Fish、PowerShell、Cmd 等主流 shell，在 Windows、macOS、Linux 上行为一致。
      </p>

      <Callout type="info">
        <strong>写作环境</strong>：Windows 11 + PowerShell 7 + Starship v1.25.1（2026-06 验证）。
        不同平台安装方式不同，配置逻辑相同。
      </Callout>

      {/* ===== 一、安装 ===== */}
      <h2 id="install">一、安装</h2>
      <p>
        Windows 推荐 winget，一行完成。macOS / Linux 用各自包管理器或直接下载二进制。
      </p>

      <h3>Windows（winget）</h3>
      <CodeBlock language="powershell" code={`winget install --id Starship.Starship`} />

      <h3>Windows（Scoop）</h3>
      <CodeBlock language="powershell" code={`scoop install starship`} />

      <h3>macOS / Linux</h3>
      <CodeBlock language="bash" code={`# macOS (Homebrew)
brew install starship

# Linux (cargo)
cargo install starship --locked

# 或从 GitHub Releases 下载二进制：
# https://github.com/starship/starship/releases`} />

      <p className="mt-3">安装后验证：</p>
      <CodeBlock language="bash" code={`starship --version
# 输出示例: starship 1.25.1`} />

      {/* ===== 二、PowerShell 配置 ===== */}
      <h2 id="powershell">二、PowerShell 配置</h2>
      <p>
        安装 Starship 后，需要在 PowerShell 的 profile 文件中添加初始化脚本。
        Windows 上 PS5.1 和 PS7 的 profile 路径不同。
      </p>

      <Collapsible summary="PS5.1 vs PS7 的 profile 路径">
        <table className="w-full text-[15px] my-2" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>版本</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Profile 路径</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">PowerShell 5.1</td>
              <td className="py-2 pr-4"><code>$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1</code></td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">PowerShell 7</td>
              <td className="py-2 pr-4"><code>$HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1</code></td>
            </tr>
          </tbody>
        </table>
      </Collapsible>

      <h3>2.1 添加初始化脚本</h3>
      <p>
        在 profile 文件中添加一行。如果 profile 文件不存在，先创建：
      </p>
      <CodeBlock language="powershell" code={`# 创建 profile（如不存在）
if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }

# 用记事本打开编辑
notepad $PROFILE

# 添加以下内容：
Invoke-Expression (&starship init powershell)`} />

      <Callout type="warning" summary="PS7 旧版踩坑记录">
        <p>
          Starship v1.21.x 在 PS7 上存在一个 <code>StandardOutputEncoding</code> 相关 bug：
          <code>starship init powershell</code> 的输出在 PS7 中可能被截断，导致提示符加载失败。
        </p>
        <p className="mt-2">当时需要这样 workaround：</p>
        <CodeBlock language="powershell" code={`# PS7 旧版 workaround（v1.25.x 已不需要）
Invoke-Expression (& "C:\\Program Files\\starship\\bin\\starship.exe" init powershell --print-full-init | Out-String)`} />
        <p className="mt-2">
          此问题已在 v1.25.x 修复。如果已升级到 v1.25+，直接用 <code>Invoke-Expression (&starship init powershell)</code> 即可。
          这个踩坑记录保留在此，以便遇到相同症状时快速定位。
        </p>
      </Callout>

      <h3>2.2 使 profile 生效</h3>
      <CodeBlock language="powershell" code={`# 重新加载 profile
. $PROFILE

# 或重新打开终端窗口`} />

      {/* ===== 三、预设主题 ===== */}
      <h2 id="preset">三、预设主题</h2>
      <p>
        Starship 提供多个预设主题，可以直接使用或在此基础上修改。
      </p>
      <CodeBlock language="bash" code={`# 查看可用预设
starship preset --list

# 应用 Tokyo Night 预设（写入 ~/.config/starship.toml）
starship preset tokyo-night -o ~/.config/starship.toml

# Windows 上等价于
starship preset tokyo-night -o "$HOME\\.config\\starship.toml"`} />

      <Collapsible summary="其他预设主题">
        <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
          <li><strong>Pastel Powerline</strong> — 彩色 Powerline 风格</li>
          <li><strong>Nerd Font Symbols</strong> — 使用 Nerd Font 图标</li>
          <li><strong>No Nerd Fonts</strong> — 纯文本符号，无需安装额外字体</li>
          <li><strong>Bracketed Segments</strong> — 方括号分隔风格</li>
          <li><strong>Plain Text</strong> — 极简纯文本</li>
        </ul>
      </Collapsible>

      {/* ===== 四、常用配置速查 ===== */}
      <h2 id="config">四、常用配置速查</h2>
      <p>
        Starship 的配置文件是 <code>~/.config/starship.toml</code>（Windows 上为 <code>%USERPROFILE%\.config\starship.toml</code>）。
        以下列出常用模块的配置片段，可直接复制后按需修改。
      </p>

      <h3>4.1 提示符符号</h3>
      <CodeBlock language="toml" code={`[character]
success_symbol = "[>](bold green)"
error_symbol = "[x](bold red)"`} />

      <h3>4.2 目录显示</h3>
      <CodeBlock language="toml" code={`[directory]
truncation_length = 3        # 路径截断深度
truncate_to_repo = true       # 在 git 仓库根目录处截断
read_only = " ro"             # 只读标记`} />

      <h3>4.3 Git 分支与状态</h3>
      <CodeBlock language="toml" code={`[git_branch]
symbol = "git "
truncation_length = 20
truncation_symbol = "..."

[git_status]
ahead = ">"
behind = "<"
diverged = "<>"
renamed = "r"
deleted = "x"`} />

      <h3>4.4 语言版本显示</h3>
      <CodeBlock language="toml" code={`[nodejs]
symbol = "nodejs "
format = "via [$symbol($version )]($style)"

[python]
symbol = "py "

[golang]
symbol = "go "

[rust]
symbol = "rs "`} />

      <h3>4.5 命令执行时长</h3>
      <CodeBlock language="toml" code={`[cmd_duration]
min_time = 2000            # 超过 2 秒才显示
show_milliseconds = true`} />

      <Collapsible summary="修改配置后如何生效">
        <p>修改 <code>starship.toml</code> 后，重新打开终端或执行 <code>. $PROFILE</code> 即可看到效果。不需要重启 Starship 进程。</p>
      </Collapsible>

      {/* ===== 五、Claude Code 状态行集成 ===== */}
      <h2 id="statusline">五、Claude Code 状态行集成（v1.25.0+）</h2>
      <p>
        Starship v1.25.0 新增了 <code>starship statusline claude-code</code> 子命令，提供三个 Claude Code 专用模块：
      </p>

      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>模块</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>显示内容</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>claude_model</code></td>
            <td className="py-2 pr-4">当前使用的模型名</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>claude_context</code></td>
            <td className="py-2 pr-4">上下文使用百分比</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>claude_cost</code></td>
            <td className="py-2 pr-4">当次会话费用估算</td>
          </tr>
        </tbody>
      </table>

      <p>
        这个功能与 Claude HUD 插件的定位有重叠——HUD 是独立插件，数据更丰富（工具活动、子 Agent 状态、Todo 进度）；
        Starship statusline 是提示符内嵌，更轻量。两者可并存，也可按需二选一。
      </p>

      {/* ===== 六、验证 ===== */}
      <h2 id="verify">六、验证</h2>
      <p>完成以上步骤后，逐条确认：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><code>starship --version</code> 正常输出版本号</li>
        <li>打开一个新终端，提示符不再是默认的 <code>PS C:\...&gt;</code>，而是 Starship 格式</li>
        <li><code>$PROFILE</code> 文件中有 <code>Invoke-Expression (&starship init powershell)</code> 这一行</li>
        <li>进入一个 git 仓库目录，提示符显示当前分支名</li>
        <li>修改 <code>starship.toml</code> 中的 <code>success_symbol</code> 后重开终端，符号发生变化</li>
      </ol>

      <FreshnessNote>本文基于 Starship v1.25.1 + PowerShell 7 验证，写作日期 2026-06-11。</FreshnessNote>
    </div>
  );
}
