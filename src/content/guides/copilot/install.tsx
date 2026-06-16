import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCopilotInstall(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        按照以下步骤在你的系统上安装 GitHub Copilot。本指南覆盖 VS Code、JetBrains IDE 和 Neovim 三种编辑器。
      </p>

      <Callout type="info" summary="网络说明">
        GitHub Copilot 在国内可直接使用，不需要科学上网。提供 30 天免费试用。支持支付宝付款。如果是学生或开源项目维护者，可免费获取。
      </Callout>

      <h2 id="section-overview"><span className="step-badge">1</span>工具简介</h2>

      <p>
        <strong>GitHub Copilot 是一个 IDE 扩展（插件）</strong>，不是一个独立的应用程序。它嵌入在你已有的编辑器里，以灰字补全和对话面板的形式提供 AI 辅助。你不装 IDE 就没法用 Copilot——这和 Cursor/Windsurf 不同（它们是自带 AI 的完整 IDE），和 Claude Code/Codex CLI 也不同（它们是命令行工具）。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>产品</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>类型</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>怎么用</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合谁</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>GitHub Copilot</strong>（本指南）</td>
              <td className="py-2 pr-4">IDE 扩展（插件）</td>
              <td className="py-2 pr-4">装在 VS Code/JetBrains/Neovim 里</td>
              <td className="py-2">已有常用 IDE、主要需要代码补全的开发者</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Cursor / Windsurf</strong></td>
              <td className="py-2 pr-4">完整 IDE</td>
              <td className="py-2 pr-4">下载后直接打开，AI 内置在里面</td>
              <td className="py-2">想要全能 AI IDE 的开发者</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Claude Code / Codex CLI</strong></td>
              <td className="py-2 pr-4">命令行工具</td>
              <td className="py-2 pr-4">在终端里输入指令</td>
              <td className="py-2">需要全栈自动化能力的开发者</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        💡 <strong>Copilot 的核心定位</strong>：它是目前覆盖面较广的代码补全工具，在写代码时自动给出建议，按 Tab 即可补全。但它不能像 Claude Code 那样管理 Git、运行命令、操作项目文件。部分开发者将 Copilot 和 Claude Code 配合使用——Copilot 负责补全，Claude Code 负责大任务。
      </p>

      <h2 id="section-prereqs"><span className="step-badge">2</span>你需要先有什么</h2>

      <p>安装 Copilot 之前，你需要有一个支持的编辑器：</p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>编辑器</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>支持情况</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐度</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>VS Code</strong></td>
              <td className="py-2 pr-4">完整支持，体验最好</td>
              <td className="py-2">⭐⭐⭐（推荐）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>JetBrains IDE</strong></td>
              <td className="py-2 pr-4">IntelliJ / PyCharm / WebStorm / GoLand 等全部支持</td>
              <td className="py-2">⭐⭐⭐</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Neovim</strong></td>
              <td className="py-2 pr-4">通过插件管理器安装</td>
              <td className="py-2">⭐⭐（适合 Vim 用户）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        <strong>前置依赖</strong>：Copilot 本身不需要安装 Node.js 或其他运行时。但你用的编辑器（如 VS Code）需要先装好。以下按编辑器分别说明安装方式。
      </Callout>

      {/* ===== VS Code ===== */}
      <h2 id="section-vscode"><span className="step-badge">3</span>方式一：VS Code 安装（推荐）</h2>

      <h3>3.1 安装 VS Code（如果还没有）</h3>
      <p>访问 <a href="https://code.visualstudio.com" target="_blank" rel="noopener">code.visualstudio.com <ExternalLink className="inline h-3 w-3" /></a>（国内可直连），下载对应系统的安装包，双击安装。安装过程约 2 分钟，无需特殊配置。</p>

      <h3>3.2 安装 Copilot 扩展</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开 VS Code</li>
        <li>按 <code>Ctrl+Shift+X</code>（macOS：<code>Cmd+Shift+X</code>）打开扩展面板</li>
        <li>搜索 <strong>"GitHub Copilot"</strong></li>
        <li>找到发布者为 <strong>GitHub</strong> 的扩展，点击 <strong>Install</strong></li>
        <li>安装完成后，VS Code 底部状态栏会出现 Copilot 图标</li>
      </ol>

      <Callout type="warning">
        <strong>注意区分</strong>：扩展商店里可能搜出多个 Copilot 相关扩展（如 Copilot Chat、Copilot Labs）。本指南装的是 <strong>GitHub Copilot</strong>（发布者 GitHub），这一个扩展同时包含代码补全和聊天功能。不要装错了。
      </Callout>

      <Callout type="warning">
        <strong>如果扩展安装失败</strong>：① 最常见的原因是 VS Code 版本过旧——确保 VS Code 更新到最新版（帮助 → 检查更新）；② 如果下载速度慢，说明 VS Code 扩展市场连接不畅，可到 B站搜索 "VS Code 扩展离线安装" 使用 .vsix 离线包安装；③ 如果提示和已有扩展冲突，先禁用其他 AI 补全扩展（如 Tabnine、CodeGeeX 等）再装 Copilot。
      </Callout>

      {/* ===== JetBrains ===== */}
      <h2 id="section-jetbrains"><span className="step-badge">4</span>方式二：JetBrains IDE 安装</h2>
      <p>支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand、PhpStorm、Rider 等全部 JetBrains IDE。</p>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开你的 JetBrains IDE</li>
        <li><strong>Settings</strong>（macOS：<strong>Preferences</strong>）→ <strong>Plugins</strong> → <strong>Marketplace</strong></li>
        <li>搜索 <strong>"GitHub Copilot"</strong> → 点击 <strong>Install</strong></li>
        <li>安装完成后 <strong>重启 IDE</strong></li>
        <li>重启后菜单栏出现 <strong>Tools → GitHub Copilot</strong> 选项</li>
      </ol>

      <Callout type="warning">
        <strong>JetBrains 常见问题</strong>：① 如果插件市场搜索不到，检查 IDE 版本（需要 2022.2 或更高）；② 安装后必须重启 IDE 才能看到 Copilot 菜单；③ 如果是公司电脑，可能需要联系 IT 开通插件市场访问权限。
      </Callout>

      {/* ===== Neovim ===== */}
      <h2 id="section-neovim"><span className="step-badge">5</span>方式三：Neovim 安装（适合 Vim 用户）</h2>
      <p>Neovim 用户通过插件管理器安装。需要 Node.js 18+ 环境。</p>

      <h3>使用 lazy.nvim（推荐）</h3>
      <CodeBlock language="lua" code={`-- 在 plugins.lua 或 lazy 配置目录中添加：\n{ "github/copilot.vim", lazy = false }`} />

      <h3>使用 vim-plug</h3>
      <CodeBlock language="vim" code={`" 在 init.vim 或 .vimrc 中添加：\nPlug 'github/copilot.vim'`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>添加后执行 <code>:PlugInstall</code>，安装完成后在 Neovim 中运行 <code>:Copilot setup</code>。</p>

      <Callout type="info">
        <strong>Neovim 用户注意</strong>：Copilot.vim 是社区维护的插件，和 VS Code 版的 Copilot Chat 功能不同（Vim 版主要提供代码补全，对话功能较有限）。如果你是 Vim/Neovim 用户且需要更完整的 AI 功能，建议搭配 Claude Code CLI 使用——Copilot 负责补全，Claude Code 负责对话和项目操作。
      </Callout>

      {/* ===== Auth ===== */}
      <h2 id="section-auth"><span className="step-badge">6</span>登录与激活</h2>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>安装扩展后，编辑器底部状态栏出现 Copilot 图标（VS Code / JetBrains）或运行 <code>:Copilot setup</code>（Neovim）</li>
        <li>点击图标 → 选择 <strong>Sign in to GitHub</strong></li>
        <li>浏览器弹出 GitHub 授权页面 → 登录你的 GitHub 账户 → 点击 <strong>Authorize GitHub Copilot</strong></li>
        <li>授权成功后回到编辑器，状态栏 Copilot 图标变亮表示登录成功</li>
      </ol>

      <Callout type="warning">
        <strong>登录常见问题</strong>：① GitHub 在国内可以直连但偶尔较慢，如果弹窗后一直加载中，等 30 秒左右；② 如果没有 GitHub 账户，先去 <a href="https://github.com/signup" target="_blank" rel="noopener">github.com/signup <ExternalLink className="inline h-3 w-3" /></a> 注册一个（国内可直连，不需要科学上网）；③ 如果浏览器没有自动弹出，VS Code 中按 F1 → 输入 "Copilot: Sign in" 手动触发；④ JetBrains 用户：Tools → GitHub Copilot → Login to GitHub。
      </Callout>

      <Callout type="warning">
        <strong>免费试用注意事项</strong>：30 天免费试用需要绑定支付方式（信用卡或 PayPal）。试用到期前可以取消，不会扣费。如果不方便绑定支付方式，可以申请 GitHub Student Pack 免费获取（需要学生认证）。支付宝付款仅支持个人版，从 github.com 的设置页面操作。
      </Callout>
      <FreshnessNote>以上试用政策验证于 2026-06。</FreshnessNote>

      {/* ===== Verify ===== */}
      <h2 id="section-verify-install"><span className="step-badge">7</span>验证安装</h2>
      <p>打开任意代码文件，用以下方式测试：</p>

      <h3>测试代码补全</h3>
      <CodeBlock language="javascript" code={`// 在编辑器中输入这段注释，然后按回车：\n// 写一个函数，接收一个数组，返回去重并排序后的新数组\n\n// 如果 Copilot 给出了灰色建议代码，说明补全正常 ✅`} />
      <p>按 <code>Tab</code> 接受建议，<code>Esc</code> 拒绝。<code>Alt+]</code> / <code>Alt+[</code> 查看下一条/上一条建议。</p>

      <h3>测试 Copilot Chat（对话）</h3>
      <p>按 <code>Cmd+Shift+I</code>（macOS）或 <code>Ctrl+Shift+I</code>（Windows/Linux）打开对话面板，输入：</p>
      <CodeBlock language="text" code={`解释一下这个文件的功能`} />
      <p>如果 AI 回复了分析结果，Chat 功能正常 ✅。</p>

      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        补全不出现？查看{" "}
        <a href="/copilot/troubleshoot#completion-not-appearing" style={{ color: "var(--color-accent)" }}>故障排查 → 补全问题</a>
      </p>

      <h2 id="section-next"><span className="step-badge">9</span>下一步：配置项目指令</h2>
      <p>在项目根目录创建 <code>.github/copilot-instructions.md</code> 文件，告诉 Copilot 你的编码规范：</p>
      <CodeBlock language="markdown" mode="unified" code={`# .github/copilot-instructions.md 示例\n\n## 编码风格\n- 使用 TypeScript 严格模式，禁止 any\n- 函数组件使用 export function，不用 export default\n- CSS 使用 Tailwind 原子类，不手写 .css\n\n## 项目约定\n- API 路由放在 src/app/api/ 下\n- 数据库查询使用 Prisma，不手写 SQL\n\n## Copilot 行为\n- 优先使用项目已有的工具函数\n- 复杂修改先输出方案，确认后再写代码`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        类似 Claude Code 的 <code>CLAUDE.md</code> 和 Cursor 的 <code>.cursor/rules/</code> 目录。建议提交到 Git 仓库，团队成员共享一致的 AI 规范。详见「配置指南」标签页。
      </p>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        💡 如果上述步骤遇到问题，建议到 B站或其他网络平台搜索 "GitHub Copilot 安装教程"，视频教程通常有更直观的演示。Copilot 故障排查请见本页的「故障排查」标签页。
      </p>
    </div>
  );
}

/* ================================================================
   Copilot 安装指南
   ================================================================ */

export default renderCopilotInstall;
