import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote } from "../_shared";

function renderClineInstall(platform: Platform) {
  const isWin = platform === "windows";
  const isMac = platform === "macos";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        按照以下步骤在你的 {isWin ? "Windows" : isMac ? "macOS" : "Linux"} 系统上安装 Cline。
      </p>

      <Callout type="info">
        <strong>网络说明</strong>：Cline 扩展从 VS Code Marketplace 安装，国内可直连。使用 AI 功能时需要配置 API Key（支持 DeepSeek 等国内供应商）。
      </Callout>

      <h2 id="section-overview"><span className="step-badge">1</span>工具简介</h2>

      <p>
        <strong>Cline 有 3 种安装方式</strong>：VS Code 扩展（最常用，图形界面）、CLI 命令行（无头模式，适合 CI/CD）、JetBrains 插件。三者共享相同的 API 配置，选择最适合你的即可。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>安装方式</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>类型</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>核心特色</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合谁</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>VS Code 扩展</strong>（推荐）</td>
              <td className="py-2 pr-4">编辑器扩展</td>
              <td className="py-2 pr-4">图形界面 + Plan/Act 双模式 + 多代理协作</td>
              <td className="py-2">日常开发主力，需要交互式 AI 辅助</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>CLI 命令行</strong></td>
              <td className="py-2 pr-4">终端工具</td>
              <td className="py-2 pr-4">无头模式 + JSON 输出 + 管道集成</td>
              <td className="py-2">CI/CD 流水线、自动化脚本、批处理</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>JetBrains 插件</strong></td>
              <td className="py-2 pr-4">IDE 插件</td>
              <td className="py-2 pr-4">IntelliJ / PyCharm 内集成</td>
              <td className="py-2">JetBrains 用户</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="section-vscode"><span className="step-badge">2</span>VS Code 扩展安装（推荐）</h2>

      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开 VS Code</li>
        <li>点击左侧活动栏的<strong>扩展图标</strong>（或按 <code>Ctrl+Shift+X</code> / <code>Cmd+Shift+X</code>）</li>
        <li>在搜索框中输入 <code>saoudrizwan.claude-dev</code>（Cline 的扩展 ID）</li>
        <li>找到 <strong>Cline</strong>（作者 Cline Bot Inc.），点击 <strong>安装</strong></li>
        <li>安装完成后，左侧活动栏会出现 Cline 图标（机器人图标）</li>
      </ol>

      <Callout type="info">
        <strong>扩展 ID</strong>：<code>saoudrizwan.claude-dev</code>。这是 Cline 在 VS Code Marketplace 中的唯一标识，直接搜这个 ID 可以精准定位，避免搜到名称相似的扩展。
      </Callout>

      <h2 id="section-cli"><span className="step-badge">3</span>CLI 命令行安装</h2>

      <Callout type="info">
        <strong>前置要求</strong>：需要 Node.js 18+。如果不确定版本，先运行 <code>node --version</code> 检查。未安装的话先装 Node.js LTS。
      </Callout>

      <CodeBlock language="bash" code={`# 全局安装 Cline CLI
npm install -g cline

# 安装后检查版本
cline --version`} />

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        CLI 安装完成后，终端中直接可用 <code>cline</code> 命令。支持管道输入和 JSON 输出，适合集成到自动化流程中。
      </p>

      <Callout type="warning">
        <strong>Windows 注意</strong>：如果遇到 <code>command not found</code>，检查 npm 全局安装路径是否在系统 PATH 中。运行 <code>npm config get prefix</code> 查看全局路径，确保该路径下的 <code>bin</code>（或 Windows 下的该目录本身）在环境变量中。
      </Callout>

      <h2 id="section-verify-install"><span className="step-badge">4</span>验证安装</h2>

      <h3>VS Code 扩展验证</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>VS Code 左侧活动栏出现 Cline 图标（机器人图标）</li>
        <li>点击图标，侧边栏展开 Cline 对话面板</li>
        <li>首次使用时，Cline 会提示配置 API Provider</li>
      </ol>

      <h3>CLI 验证</h3>
      <CodeBlock language="bash" code={`# 检查 CLI 是否正常
cline --version
# 应输出版本号，如 3.x.x

# 简单交互测试（输入后回车）
echo "Hello from Cline CLI" | cline`} />

      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如遇报错，查看{" "}
        <a href="/cline/troubleshoot" style={{ color: "var(--color-accent)" }}>故障排查</a>
      </p>

      <h2 id="section-next"><span className="step-badge">5</span>下一步：配置 API Key</h2>
      <p>
        安装完成后 Cline 还不能直接用——需要配置 API Key 才能调用 AI 模型。Cline 支持 20+ 模型提供商，包括 Anthropic、OpenAI、Google、OpenRouter、DeepSeek 等。
      </p>
      <p>
        点击左侧 Cline 图标 → 在对话面板顶部选择 API Provider → 填入 API Key。详细步骤见「配置指南」标签页。
      </p>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如果上述步骤遇到问题，可查看 Cline 官方文档（docs.cline.bot）或到 GitHub Issues 搜索类似问题。
      </p>
    </div>
  );
}

export default renderClineInstall;
