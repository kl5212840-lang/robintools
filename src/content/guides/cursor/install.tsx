import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCursorInstall(platform: Platform) {
  const isWin = platform === "windows";
  const isMac = platform === "macos";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        按照以下步骤在你的 {isWin ? "Windows" : isMac ? "macOS" : "Linux"} 系统上安装 Cursor。
      </p>

      <Callout type="info" summary="网络说明">
        Cursor 的安装和注册在国内可正常访问，无需科学上网。但 Pro 内置的 GPT-4 和 Claude 模型走海外服务器，<strong>需科学上网才能调用</strong>。免费版可搭配 DeepSeek 等国内模型直连使用（详见「配置指南」）。下载地址：<a href="https://cursor.com" target="_blank" rel="noopener">cursor.com <ExternalLink className="inline h-3 w-3" /></a>（国内直连）。
      </Callout>

      <h2 id="section-overview"><span className="step-badge">1</span>工具简介</h2>

      <p>
        <strong>Cursor 是一个桌面 IDE</strong>（集成开发环境），不是命令行工具。它基于 VS Code 深度定制，打开后是图形界面，和 VS Code 的布局和操作方式基本一致。如果你用过 VS Code，迁移到 Cursor 只需导入设置即可。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>产品</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>类型</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>界面</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合谁</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Cursor</strong>（本指南）</td>
              <td className="py-2 pr-4">桌面 IDE</td>
              <td className="py-2 pr-4">图形界面（类 VS Code）</td>
              <td className="py-2">喜欢 IDE、不想用命令行的开发者</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Claude Code</strong></td>
              <td className="py-2 pr-4">命令行 CLI</td>
              <td className="py-2 pr-4">终端</td>
              <td className="py-2">喜欢命令行、需要全栈开发能力的开发者</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Windsurf</strong></td>
              <td className="py-2 pr-4">桌面 IDE</td>
              <td className="py-2 pr-4">图形界面（类 VS Code）</td>
              <td className="py-2">和 Cursor 类似，多文件编辑更强</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible summary="选型建议 — Cursor vs Claude Code">
        <p style={{ color: "var(--color-text-muted)" }}>
          💡 如果你习惯在 IDE 里写代码、不喜欢记命令行——选 Cursor。如果你需要 AI 帮你管理 Git、跑命令、操作整个项目——选 Claude Code。两者可以同时用，互不冲突。
        </p>
      </Collapsible>

      <h2 id="section-prereqs"><span className="step-badge">2</span>系统要求与前置准备</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>系统</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>最低要求</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>备注</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Windows</strong></td>
              <td className="py-2 pr-4">Windows 10 或更高</td>
              <td className="py-2">64 位系统</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>macOS</strong></td>
              <td className="py-2 pr-4">macOS 10.15（Catalina）或更高</td>
              <td className="py-2">Intel 和 Apple Silicon（M1/M2/M3/M4）都支持</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Linux</strong></td>
              <td className="py-2 pr-4">主流发行版</td>
              <td className="py-2">Ubuntu 20.04+ / Fedora / Debian / Arch 等</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info" summary="前置准备">
        Cursor 不需要单独安装 Node.js 或 Python 等运行时。下载安装包后双击安装即可使用。这是它和 Claude Code、Codex CLI 的一个区别——不需要额外的系统依赖。
      </Callout>

      <h2 id="section-install"><span className="step-badge">3</span>下载与安装</h2>

      {isWin && (
        <>
          <h3>Windows 安装</h3>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>访问 <a href="https://cursor.com" target="_blank" rel="noopener">cursor.com <ExternalLink className="inline h-3 w-3" /></a>（国内可直连），网站会自动识别 Windows 系统</li>
            <li>点击 <strong>Download for Windows</strong>，下载 <code>CursorSetup-x64.exe</code> 安装包</li>
          </ol>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            下载完成后双击 .exe 文件，按向导完成安装。安装过程约 1-2 分钟。Cursor 会自动添加到开始菜单和桌面。
          </p>
          <Callout type="info" summary="安装位置">
            默认安装到 <code>C:\Users\你的用户名\AppData\Local\Programs\Cursor</code>。安装过程中可以选择不同的安装位置。不需要管理员权限。
          </Callout>
        </>
      )}
      {isMac && (
        <>
          <h3>macOS 安装</h3>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>访问 <a href="https://cursor.com" target="_blank" rel="noopener">cursor.com <ExternalLink className="inline h-3 w-3" /></a>（国内可直连），网站会自动识别 macOS 系统</li>
            <li>点击 <strong>Download for macOS</strong>，下载 <code>.dmg</code> 安装包</li>
          </ol>
          <CodeBlock language="bash" code={`# 双击 .dmg 文件\n# 将 Cursor 图标拖入 Applications 文件夹\n# 首次打开时，macOS 可能提示"无法验证开发者"\n# 去 系统设置 → 隐私与安全性 → 点击"仍要打开"`} />
          <Callout type="warning" summary="macOS 首次打开提示「无法验证开发者」">
            这是 macOS 的安全机制，不是安全问题。去<strong>系统设置 → 隐私与安全性</strong>，在页面底部会看到一条关于 Cursor 的提示，点击<strong>"仍要打开"</strong>即可。只做这一次，之后正常打开。如果找不到这个选项，到 B站搜索 "macOS 无法验证开发者 解决方法" 查看视频演示。
          </Callout>
        </>
      )}
      {!isWin && !isMac && (
        <>
          <h3>Linux 安装</h3>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>访问 <a href="https://cursor.com" target="_blank" rel="noopener">cursor.com <ExternalLink className="inline h-3 w-3" /></a>（国内可直连）</li>
            <li>网站提供两种格式：<strong>.AppImage</strong> 和 <strong>.deb</strong></li>
          </ol>
          <CodeBlock language="bash" code={`# 方式一：AppImage（推荐，所有发行版通用）\nchmod +x Cursor-*.AppImage\n./Cursor-*.AppImage\n\n# 方式二：.deb 包（Debian/Ubuntu）\nsudo dpkg -i cursor-*.deb\n# 如果提示缺少依赖：sudo apt install -f`} />
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>AppImage 是免安装的，双击就能运行。建议移动到 <code>~/.local/bin/</code> 或 <code>/opt/</code> 目录方便管理。</p>
        </>
      )}

      <h2 id="section-first-launch"><span className="step-badge">4</span>首次启动与 VS Code 导入</h2>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>打开 Cursor</strong>：{isWin ? "开始菜单搜索 Cursor，或在桌面双击图标" : isMac ? "在 Applications 文件夹中双击 Cursor，或 Spotlight 搜索 Cursor" : "在应用菜单中找到 Cursor，或在终端运行 Cursor"}</li>
        <li><strong>导入 VS Code 设置（推荐）</strong>：首次启动时 Cursor 会问你是否从 VS Code 导入。选<strong>"Import from VS Code"</strong>——它会自动迁移你的主题、快捷键、已安装的扩展和设置。迁移后 Cursor 的界面和 VS Code 保持高度一致。</li>
        <li>如果你没有装过 VS Code，选 &ldquo;Skip&rdquo; 跳过即可。</li>
      </ol>

      <Callout type="warning" summary="导入失败怎么办">
        如果首次启动时跳过了导入，之后想补导入：Cursor 菜单 → Settings → 搜索 &ldquo;VS Code&rdquo; → 点击 &ldquo;Import VS Code Settings&rdquo;。如果 VS Code 和 Cursor 安装在不同位置导致找不到，到 B站搜索 "Cursor 导入 VS Code 设置失败" 查看详细步骤。
      </Callout>

      <h2 id="section-auth"><span className="step-badge">5</span>注册与订阅</h2>

      <h3>5.1 注册账户</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Cursor 界面右上角点击头像图标 → 选择 <strong>Sign In</strong></li>
        <li>选择使用 <strong>Google</strong> 或 <strong>GitHub</strong> 账户登录（二选一，不需要两个都有）</li>
        <li>浏览器弹出授权页面 → 确认授权 → 回到 Cursor 即登录成功</li>
      </ol>

      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        登录遇到问题？查看{" "}
        <a href="/cursor/troubleshoot#login-failed" style={{ color: "var(--color-accent)" }}>故障排查</a>
      </p>

      <h2 id="section-verify-install"><span className="step-badge">6</span>验证安装</h2>
      <p>打开任意项目文件夹（或随便新建一个），测试 AI 功能：</p>
      <CodeBlock language="text" code={`# 按 Cmd+K（macOS）或 Ctrl+K（Windows/Linux）\n# 输入：给这行代码加个注释\n# → AI 应该给出修改建议\n\n# 按 Cmd+L（macOS）或 Ctrl+L（Windows/Linux）\n# 输入：分析这个文件的代码结构\n# → AI 应该回复分析结果`} />
      <p>AI 正常回复即安装成功 ✅。</p>

      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如遇问题，查看{" "}
        <a href="/cursor/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查</a>
      </p>

      <h2 id="section-next"><span className="step-badge">7</span>下一步：配置项目规则</h2>
      <p>安装完成后，建议立即配置项目规则，让 AI 理解你的项目技术栈和编码规范——这能显著提升 AI 补全的准确度：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>创建 <code>.cursor/rules/</code> 目录，在其中添加 <code>.mdc</code> 规则文件（推荐，支持按文件类型匹配触发）</li>
        <li>旧项目如已有 <code>.cursorrules</code> 单文件，建议迁移到新格式</li>
        <li>详见「配置指南」标签页，里面有完整的模板可复制</li>
      </ul>

      <Collapsible summary="外部资源">
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          💡 如果上述步骤遇到问题，建议到 B站或其他网络平台搜索 "Cursor 安装教程" 或 "Cursor 使用教程"，视频教程通常有更直观的演示。
        </p>
      </Collapsible>
    </div>
  );
}

/* ================================================================
   Cursor 安装指南
   ================================================================ */

export default renderCursorInstall;
