import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderClaudeTroubleshoot(_platform: Platform) {
  return (
    <div className="wizard-content">
      <Collapsible summary="简介">
        <p className="text-[16px] leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
          以下是 Claude Code 使用过程中的常见问题及解决方案。如果未覆盖你的问题，可查阅官方文档或 B站教程。
        </p>
      </Collapsible>

      <h2 id="section-ts-install"><span className="step-badge">1</span>安装常见问题</h2>
      <div className="space-y-4">
        <ProblemCard id="winget-package-not-found" title="winget 找不到 Claude Code" desc="Windows 上运行 winget install 提示找不到包。" solution="确保已安装 Git for Windows。如仍找不到，可用原生安装器代替——但 claude.ai 需要科学上网（如暂时没有条件，可到 B站或其他网络平台搜索 'Claude Code 国内安装' 或 'CC Switch 代装' 了解替代方案）。原生安装命令：在 PowerShell 运行 irm https://claude.ai/install.ps1 | iex" />
        <ProblemCard id="powershell-permission-denied" title="PowerShell 权限不足" desc="运行安装脚本被阻止。" solution="以管理员身份运行 PowerShell（右键 → 以管理员身份运行）。或先运行 Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" />
        <ProblemCard id="homebrew-not-installed" title="Homebrew 未安装 (macOS)" desc="终端提示 brew: command not found。" solution="先访问 brew.sh 安装 Homebrew（raw.githubusercontent.com 国内可能无法访问，可搜索{'Homebrew 国内镜像'}安装），或改用原生安装器（⚠️ 需科学上网）：curl -fsSL https://claude.ai/install.sh | bash" />
        <ProblemCard id="command-not-found-after-install" title="安装后 claude 命令不可用" desc="终端提示 command not found。" solution="关闭终端重新打开。检查 PATH 环境变量。Windows 用户确认 Git Bash 已安装并在 PATH 中。" />
        <ProblemCard id="install-general-error" title="安装综合报错" desc="其他安装相关问题。" solution={<>检查具体报错信息。英文提示通常可直接搜索到答案。如果无论如何都装不上，可尝试 <a href="https://www.ccswitch.io/zh/" target="_blank" rel="noopener">CC Switch 代装</a> 了解替代方案。</>} />
      </div>

      <h2 id="section-ts-config"><span className="step-badge">2</span>配置常见问题</h2>
      <div className="space-y-4">
        <ProblemCard id="no-response-after-startup" title="启动后无响应" desc="Claude Code 可以启动但发送消息后无回复。" solution="排查步骤：① 检查 API Key 完整无误；② 检查 DeepSeek 账户余额；③ 检查 ANTHROPIC_BASE_URL 正确（不要用 /v1 路径）；④ 浏览器访问 api.deepseek.com 确认可达；⑤ 确认 JSON 格式正确。" />
        <ProblemCard id="config-not-taking-effect" title="配置文件不生效" desc="修改 settings.json 后仍使用默认配置。" solution="① 检查 JSON 格式（无多余逗号、引号匹配），可在终端运行 python -m json.tool ~/.claude/settings.json 自动校验；② 确认文件路径正确；③ 完全退出 Claude Code（包括后台进程）后重新启动。" />
        <ProblemCard id="invalid-user-id-400" title={"400 Invalid &quot;user_id&quot;"} desc="API 返回 400 错误。" solution="在 settings.json 的 env 中添加 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: 1。这是 DeepSeek 端点的已知问题，2026 年 5 月起需要此配置。" />
        <ProblemCard id="long-timeout" title="长时间无响应超时" desc="复杂任务执行到一半超时。" solution="在 settings.json 的 env 中添加 timeout: 600000（10 分钟）。可根据任务复杂度调整。" />
        <ProblemCard id="cc-switch-route-not-working" title="CC Switch 路由不生效" desc="开启 CC Switch 后 Claude Code 仍使用默认模型。" solution="① 确认 CC Switch 版本 ≥ 3.15.0；② 检查 settings.json 中 ANTHROPIC_AUTH_TOKEN 为 PROXY_MANAGED；③ 完全退出 CC Switch（含系统托盘图标）后重新打开；④ CC Switch 开启时会覆盖 settings.json 手动配置，两者不要混用。" />
        <ProblemCard id="subagent-no-response" title="子代理（subagent）无响应" desc="并行任务或子代理不工作。" solution="确认 settings.json 中设置了 CLAUDE_CODE_SUBAGENT_MODEL（如 deepseek-v4-flash[1m]）。子代理需要独立模型配置，缺少此项时并行任务会失败。" />
        <ProblemCard id="mcp-config-not-persisting" title="MCP 配置修改后不生效" desc="修改了 mcpServers 配置但工具列表没变，或反复被旧配置覆盖。" solution="这是 Claude Code 的已知问题——backups 缓存（~/.claude/backups/）会劫持 MCP 配置的读取，优先级高于你手动编辑的 mcp.json。① 先用 claude mcp list 确认当前实际加载的配置——进程接收到的命令行参数就是实际生效的配置；② 如果与预期不符，检查 ~/.claude/backups/ 是否缓存了旧备份，删除过期的 backup 文件；③ 检查 ~/.claude.json（与项目同目录）中是否残留同名服务器的旧 mcpServers 条目——如有则同步修改或删除；④ 改完配置后完全退出 Claude Code（含后台进程）再重启。详见本站<a href='/articles/mcp-config-pitfall-guide' style={{ color: 'var(--color-accent)' }}>《MCP 配置避坑指南》</a>。" />
        <ProblemCard id="vscode-vs-cli-inconsistent" title="VS Code 插件版与 CLI 版行为不一致" desc="同样的项目，VS Code 插件版和终端 CLI 版的行为或配置效果不同。" solution="两种安装方式共享 settings.json 但权限模型不同。① VS Code 插件的终端权限受 VS Code 自身沙箱限制——某些系统级命令在插件中不可用；② 插件版的工作目录和 CLI 版可能不同——检查终端中的 pwd 确认路径；③ 插件版的 MCP 服务器进程由 VS Code 管理——如果 MCP 依赖特定环境变量，在 VS Code Settings 中配置而非系统级环境变量；④ 排查时先用 CLI 版测试——CLI 版环境更干净，能快速确定问题出在配置还是 VS Code 沙箱。" />
      </div>

      <h2 id="section-ts-network"><span className="step-badge">3</span>网络相关问题</h2>
      <div className="space-y-4">
        <ProblemCard id="network-unreachable" title="安装或更新时网络不可达" desc="访问 claude.ai 或 api.anthropic.com 提示连接超时或 DNS 解析失败。" solution={`这是国内网络环境的普遍情况——Anthropic 相关域名在中国大陆无法直连。如果已有科学上网工具，可在终端设置代理（以 Clash 为例，端口通常是 7890）：export HTTPS_PROXY=http://127.0.0.1:7890 && export HTTP_PROXY=http://127.0.0.1:7890。如果还没有科学上网工具，可到 B站或其他网络平台搜索"科学上网"或"Claude Code 国内网络"了解可行的解决方案。日常使用推荐配置 DeepSeek 等国内模型（详见配置指南），配置后无需科学上网即可正常使用 Claude Code。`} />
        <ProblemCard id="proxy-blocks-deepseek" title="全局代理导致连不上" desc="开了代理反而无法访问 DeepSeek。" solution="DeepSeek API 国内通常可直连。设置 NO_PROXY 排除：export NO_PROXY=api.deepseek.com,localhost,127.0.0.1" />
        <ProblemCard id="desktop-workspace-download-failed" title="Claude Desktop Workspace 下载失败" desc="桌面版提示 Failed to start workspace。" solution="需从 Anthropic 服务器下载约 2.5GB 的 Linux 环境文件，国内网络通常连不上。如不需要 Cowork 功能可忽略此消息。如需修复，可到 B站 或其他网络平台搜索 'Claude Desktop VM 文件' 查找热心用户分享的资源。" />
        <ProblemCard id="cc-switch-routing-failed" title="CC Switch 路由切换失败" desc="启用路由时报错。" solution="① 确保 CC Switch 版本 ≥ 3.15.0；② 检查 settings.json 存在且包含 ANTHROPIC_AUTH_TOKEN: PROXY_MANAGED；③ 完全退出 CC Switch（含托盘图标）后重新打开。" />
      </div>

      <h2 id="section-ts-desktop"><span className="step-badge">4</span>Desktop 桌面版专项 <span className="text-[12px] font-normal" style={{color:'var(--color-text-muted)'}}>（仅 Windows）</span></h2>
      <p className="text-[14px] mb-4" style={{color:'var(--color-text-muted)'}}>Claude Desktop 目前只有 Windows 版本，以下问题仅适用于 Windows 用户。macOS/Linux 用户请使用 CLI 或 VS Code 插件。</p>
      <div className="space-y-4">
        <ProblemCard id="desktop-blank-page" title="桌面版启动后页面空白" desc="Claude Desktop 打开后显示空白页面，无法正常使用。" solution="⚠️ 此问题暂无通用解决方案。尝试：① 完全退出 Claude Desktop（含托盘 + 任务管理器进程）；② 确保 CC Switch 版本 ≥ 3.15.0 且路由已开启；③ 重新打开 Claude Desktop；④ 如仍不行：完全卸载 → 重启电脑 → 重新安装。" />
        <ProblemCard id="virtual-machine-platform-unavailable" title="Virtual Machine Platform not available" desc="Claude 的 Workspace 需要开启虚拟机平台，提示未启用。" solution="三种方式：① 通过 Claude 页面提示操作；② 管理员 PowerShell 运行 Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -All -NoRestart；③ 手动：控制面板 → 程序和功能 → 启用或关闭 Windows 功能 → 勾选「Hyper-V」和「虚拟机平台」→ 重启。" />
        <ProblemCard id="workspace-start-failed" title="Failed to start workspace" desc="Claude 的 Cowork / Workspace 功能启动失败。" solution="原因是国内网络无法从 Anthropic 服务器下载约 2.5GB 的 Linux 环境文件（解压后约 13GB）。如果不需要 Cowork 功能可忽略此消息。如需修复：① 启用 Hyper-V 和虚拟机平台；② 获取 VM 文件包（可到 B站 或其他网络平台搜索 'Claude Desktop Workspace 文件' 查找资源）；③ 放入 Claude 指定目录；④ 务必先重启电脑再打开 Claude Desktop。" />
        <ProblemCard id="full-uninstall-desktop" title="完全卸载 Claude Desktop" desc="需要彻底清除桌面版残留。" solution="① 设置 → 应用 → 应用和功能 → 搜索 Claude → 卸载；② 删除 %LOCALAPPDATA%\Claude 目录（如有残留）；③ 检查任务管理器确认无 Claude 进程；④ 重启电脑完成清理。" />
        <ProblemCard id="msix-no-response" title={".msix 安装包双击无反应"} desc="安装文件双击后没有反应。" solution="以管理员身份运行安装包（右键 → 以管理员身份运行）。注意：桌面版无法指定安装位置，默认安装到系统盘。" />
      </div>

      <Collapsible summary="外部资源">
        <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          💡 如果上述方案未能解决你的问题，建议到 B站或其他网络平台搜索 "Claude Code + 你的报错信息"，视频教程通常有更详细的演示和最新的解决方案。
        </p>
      </Collapsible>
      <FreshnessNote>以上 CC Switch 版本要求（≥ 3.15.0）、DeepSeek 行为变更（2026-05 起）及 Desktop 平台限制验证于 2026-06。</FreshnessNote>
    </div>
  );
}

/* ================================================================
   Codex 完整内容
   ================================================================ */

export default renderClaudeTroubleshoot;
