import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote } from "../_shared";

function renderWindsurfInstall(platform: Platform) {
  const isWin = platform === "windows";
  const isMac = platform === "macos";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        按照以下步骤在你的 {isWin ? "Windows" : isMac ? "macOS" : "Linux"} 系统上安装 Windsurf。
      </p>

      <Callout type="info">
        <strong>网络说明</strong>：Windsurf 在国内可直接使用，不需要科学上网。注册、下载、日常使用均正常访问。免费版提供基本 AI 功能，Pro 版按需付费。
      </Callout>

      <h2 id="section-overview"><span className="step-badge">1</span>工具简介</h2>

      <p>
        <strong>Windsurf 是一个桌面 IDE</strong>，和 Cursor 一样基于 VS Code 深度定制。它的核心卖点是 <strong>Cascade AI 代理</strong>——能持续执行多步任务的 AI，不只补全代码，更能像 Claude Code 一样自动修改多个文件。如果你想要 IDE 的图形界面 + 接近 CLI 工具的自动化能力，Windsurf 在两者之间取得了较好的平衡。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>产品</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>类型</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>核心特色</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合谁</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Windsurf</strong>（本指南）</td>
              <td className="py-2 pr-4">桌面 IDE</td>
              <td className="py-2 pr-4">Cascade 持续多步任务 + 多文件编辑</td>
              <td className="py-2">需要 IDE 界面但想要自动化能力的开发者</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Cursor</strong></td>
              <td className="py-2 pr-4">桌面 IDE</td>
              <td className="py-2 pr-4">代码补全体验更好 + Composer 多文件编辑</td>
              <td className="py-2">更看重补全质量、Tab 补全的开发者</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Claude Code</strong></td>
              <td className="py-2 pr-4">命令行 CLI</td>
              <td className="py-2 pr-4">全栈开发 + Git 工作流 + MCP 扩展</td>
              <td className="py-2">喜欢命令行的专业开发者</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        💡 <strong>选型建议</strong>：Windsurf 和 Cursor 非常相似，都是 VS Code 的 AI 改造版。Windsurf 的 Cascade 在多步持续性任务上更有优势（"帮我把这个功能从设计到实现"），Cursor 的代码补全更灵敏精准。不确定选哪个的话，两个都有免费版，可以都下载试用后再决定。
      </p>

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
              <td className="py-2">Intel 和 Apple Silicon 都支持</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Linux</strong></td>
              <td className="py-2 pr-4">主流发行版</td>
              <td className="py-2">Ubuntu 20.04+ / Fedora / Debian / Arch 等</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        <strong>前置准备</strong>：Windsurf 不需要单独安装 Node.js 或 Python 等运行时。下载安装包后双击安装即可使用。
      </Callout>

      <h2 id="section-install"><span className="step-badge">3</span>下载与安装</h2>

      {isWin && (
        <>
          <h3>Windows 安装</h3>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>访问 <a href="https://codeium.com/windsurf" target="_blank" rel="noopener">codeium.com/windsurf <ExternalLink className="inline h-3 w-3" /></a>（国内可直连）</li>
            <li>点击 <strong>Download for Windows</strong>，下载 <code>.exe</code> 安装包</li>
          </ol>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            下载完成后双击 .exe 文件，按向导完成安装。安装过程约 1-2 分钟。Windsurf 会自动添加到开始菜单。
          </p>
        </>
      )}
      {isMac && (
        <>
          <h3>macOS 安装</h3>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>访问 <a href="https://codeium.com/windsurf" target="_blank" rel="noopener">codeium.com/windsurf <ExternalLink className="inline h-3 w-3" /></a>（国内可直连）</li>
            <li>点击 <strong>Download for macOS</strong>，下载 <code>.dmg</code> 安装包</li>
          </ol>
          <CodeBlock language="text" code={`# 双击 .dmg 文件\n# 将 Windsurf 图标拖入 Applications 文件夹\n# 首次打开时如果提示"无法验证开发者"：\n# 系统设置 → 隐私与安全性 → 点击"仍要打开"`} />
          <Callout type="warning">
            <strong>macOS 安全提示</strong>：首次打开 Windsurf 时如果提示"无法验证开发者"——去<strong>系统设置 → 隐私与安全性</strong>，在页面底部找到关于 Windsurf 的提示，点击<strong>"仍要打开"</strong>。如果找不到，到 B站搜索 "macOS 无法验证开发者 解决方法"。
          </Callout>
        </>
      )}
      {!isWin && !isMac && (
        <>
          <h3>Linux 安装</h3>
          <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            <li>访问 <a href="https://codeium.com/windsurf" target="_blank" rel="noopener">codeium.com/windsurf <ExternalLink className="inline h-3 w-3" /></a>（国内可直连）</li>
            <li>下载 <strong>.AppImage</strong> 格式（推荐，所有发行版通用）</li>
          </ol>
          <CodeBlock language="bash" code={`# AppImage 免安装，赋予执行权限就能运行\nchmod +x Windsurf-*.AppImage\n./Windsurf-*.AppImage\n\n# 建议移动到统一目录方便管理\nmv Windsurf-*.AppImage ~/.local/bin/windsurf`} />
        </>
      )}

      <h2 id="section-first-launch"><span className="step-badge">4</span>首次启动与 VS Code 导入</h2>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>打开 Windsurf</strong>：{isWin ? "开始菜单搜索 Windsurf，或双击桌面图标" : isMac ? "在 Applications 文件夹中双击 Windsurf" : "终端运行或从应用菜单打开"}</li>
        <li><strong>导入 VS Code 设置</strong>：首次启动时 Windsurf 会问你是否从 VS Code 导入。选<strong>"Import from VS Code"</strong>——它会迁移你的主题、快捷键、扩展、设置等</li>
        <li>如果你没有装过 VS Code，选 &ldquo;Skip&rdquo; 跳过。之后在 Settings → Profiles 中也可以补导入</li>
      </ol>

      <Callout type="warning">
        <strong>导入失败</strong>：如果首次跳过了导入，后续在 Settings → Profiles → Import Profile → From VS Code 可以补导入。如果找不到 VS Code 的配置路径导致导入失败，到 B站搜索 "Windsurf 导入 VS Code 配置" 查看解决方法。
      </Callout>

      <h2 id="section-auth"><span className="step-badge">5</span>注册与订阅</h2>

      <h3>5.1 注册 Codeium 账户</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Windsurf 界面右下角或右上角点击人头图标</li>
        <li>选择使用 <strong>Google</strong> 或 <strong>GitHub</strong> 登录（任选其一）</li>
        <li>浏览器弹出授权页面 → 确认 → 回到 Windsurf 即登录成功</li>
      </ol>

      <Callout type="warning">
        <strong>登录失败排查</strong>：Google 和 GitHub 国内可直连但可能较慢。① 检查浏览器弹窗是否被拦截；② 如果 GitHub 加载慢，耐心等待（通常 10–30 秒）；③ GitHub 如果登不上尝试换成 Google 登录；④ 都不行到 B站搜索 "Windsurf 登录失败" 查找解决方案。
      </Callout>

      <h2 id="section-verify-install"><span className="step-badge">6</span>验证安装 — 了解三大核心功能</h2>
      <p>Windsurf 有三个核心 AI 功能，逐个测试确认安装成功：</p>

      <h3>① Supercomplete：智能代码补全</h3>
      <p>打开任意文件，开始写代码——Windsurf 会自动给出灰字补全建议。按 <code>Tab</code> 接受。这是自动触发的，不需要按任何快捷键。</p>

      <h3>② Cascade：AI 对话面板（Cmd+L / Ctrl+L）</h3>
      <p>Cascade 是 Windsurf 的核心功能——一个能<strong>读写多文件、搜索代码库、执行持续性任务</strong>的 AI 代理。</p>
      <CodeBlock language="text" code={`# 按 Cmd+L（macOS）或 Ctrl+L（Windows/Linux）打开 Cascade\n# 输入测试指令：\n解释这个项目的结构\n\n# 如果 AI 回复了分析结果，Cascade 正常 ✅`} />

      <h3>③ Cascade 多文件编辑（Cmd+L / Ctrl+L）</h3>
      <p>Cascade 可以一次修改多个文件，保持一致性——特别适合跨文件重构。</p>
      <CodeBlock language="text" code={`# 按 Cmd+L（macOS）或 Ctrl+L（Windows/Linux）打开 Cascade 多文件编辑\n# 输入测试指令：\n在 src/ 下创建一个 HelloWorld 组件\n\n# 如果 AI 创建了文件，Cascade 正常 ✅`} />

      <Callout type="warning">
        <strong>如果某个功能不工作</strong>：① <strong>Supercomplete 不出现</strong>——检查 Settings → Supercomplete 是否已启用；检查是否在其他 AI 扩展冲突；② <strong>Cascade 无响应</strong>——检查网络连接；确认账户已登录且有效；尝试重启 Windsurf；③ <strong>Cascade 修改后文件没变化</strong>——确认点击了 Apply 按钮（Cascade 的修改都需要手动 Apply 才生效，这是安全设计不是 Bug）；④ 仍不行到 B站搜索 "Windsurf + 你的问题" 查找视频排查。
      </Callout>

      <h2 id="section-next"><span className="step-badge">7</span>下一步：配置项目规则</h2>
      <p>安装完成后，建议在项目根目录创建 <code>.windsurfrules</code> 文件，告诉 AI 你的技术栈和编码规范：</p>
      <CodeBlock language="markdown" mode="unified" code={`# .windsurfrules 示例\n\n## 技术栈\nReact 18 + TypeScript + Tailwind CSS\n\n## 编码规范\n- 使用 const/let，不用 var\n- 组件用函数式写法\n- 按功能组织文件目录\n\n## Cascade 行为\n- 修改代码前先说明计划\n- 优先使用项目已有的工具函数`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        类似 Claude Code 的 <code>CLAUDE.md</code> 和 Cursor 的 <code>.cursor/rules/</code> 目录。详见「配置指南」标签页。
      </p>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        💡 如果上述步骤遇到问题，建议到 B站或其他网络平台搜索 "Windsurf 安装教程" 或 "Windsurf 使用教程"，视频教程通常有更直观的演示。
      </p>
    </div>
  );
}

/* ================================================================
   Windsurf 安装指南
   ================================================================ */

export default renderWindsurfInstall;
