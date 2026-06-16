import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderSparkInstall(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        GitHub Spark 是 GitHub 推出的自然语言应用构建工具——你描述想法，它生成完整的 Web 应用并自动部署。
      </p>

      <Callout type="info">
        <strong>网络说明</strong>：GitHub Spark 运行在浏览器中（github.com），国内可直连。无需安装任何本地软件，不需要 Node.js、Python 等运行时。
      </Callout>

      <h2 id="section-overview"><span className="step-badge">1</span>Spark 是什么，不是什么</h2>

      <p>
        <strong>GitHub Spark 是自然语言驱动的应用生成器</strong>。你不需要写代码——用中文描述你要什么应用，Spark 自动生成页面、处理样式、管理数据状态、并提供一键部署。它与 Copilot 同属 GitHub 生态，但定位完全不同。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>维度</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>GitHub Spark</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>Copilot</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>定位</strong></td>
              <td className="py-2 pr-4">从自然语言生成完整应用</td>
              <td className="py-2">辅助写代码、代码补全</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>产出</strong></td>
              <td className="py-2 pr-4">可直接部署的 Web 应用</td>
              <td className="py-2">代码片段、补全建议</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>运行环境</strong></td>
              <td className="py-2 pr-4">浏览器（github.com）</td>
              <td className="py-2">IDE 扩展</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>需要代码能力</strong></td>
              <td className="py-2 pr-4">不需要</td>
              <td className="py-2">需要</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>适合谁</strong></td>
              <td className="py-2 pr-4">想做原型/小工具的非开发者、快速验证想法的开发者</td>
              <td className="py-2">日常开发的程序员</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        <strong>Spark 适合什么场景？</strong>个人小工具、原型演示、内部管理面板、数据展示页面。不适合：复杂的后台系统（用户认证、数据库、支付等深度功能 Spark 目前覆盖不全）、已有大型项目的代码辅助（用 Copilot 或 Cursor）。
      </Callout>

      <h2 id="section-access"><span className="step-badge">2</span>访问 Spark</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Spark 是一个 Web 应用，不需要安装——浏览器打开 github.com，登录后即可使用。不同套餐均可访问，企业版额外支持管理员统一管控。
      </p>

      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>浏览器打开 <a href="https://github.com" target="_blank" rel="noopener">github.com <ExternalLink className="inline h-3 w-3" /></a>（国内可直连）</li>
        <li>登录 GitHub 账户（如没有，免费注册一个）</li>
        <li>顶部导航栏或 Copilot 菜单中找到 <strong>Spark</strong> 入口</li>
        <li>进入 Spark 仪表板，看到"Create a Spark"或类似新建按钮</li>
      </ol>

      <Callout type="warning">
        <strong>找不到入口？</strong>① 确认账户已登录；② Spark 功能可能正在逐步推出，尝试访问 github.com 后在 Copilot 下拉菜单查看；③ 企业用户需要管理员在组织设置中启用 Spark；④ 如果完全找不到，可在 GitHub 官方博客或 Changelog 中搜索 "Spark" 确认最新入口路径。
      </Callout>

      <h2 id="section-first"><span className="step-badge">3</span>创建第一个应用</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        用自然语言描述你想要的——中文完全支持。关键是 <strong>具体</strong>，不要说"做一个好看的工具"，要说清楚功能、样式、交互。
      </p>

      <CodeBlock language="text" mode="unified" code={`# 好的描述示例（具体、有功能、有风格）
创建一个食谱管理工具：
- 首页是食谱卡片列表，每张卡片显示菜名、烹饪时间、难度星级
- 点击卡片进入详情页，展示食材清单和步骤
- 右上角搜索框可以按菜名筛选
- 配色用暖色调，卡片圆角 12px，暗色背景

# 差的描述（太模糊）
做一个食谱网站`} />

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        输入描述后点击生成，Spark 会在几秒到几十秒内产出应用预览。
      </p>

      <Callout type="info">
        <strong>描述技巧速查</strong>：① 用什么技术不重要——Spark 自动选，不需要指定 React 还是 Vue；② 在描述末尾加样式要求（颜色、圆角、间距），Spark 会统一执行；③ 如果需要 AI 功能（如"自动生成摘要"），在描述中明确写出；④ 第一次描述尽量完整，后续用迭代精调。
      </Callout>

      <h2 id="section-verify-install"><span className="step-badge">4</span>预览与部署</h2>

      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>预览</strong>：生成完成后 Spark 右侧或全屏显示应用预览，可交互测试</li>
        <li><strong>迭代修改</strong>：输入新提示词继续调整——"把卡片改成三列布局"、"给搜索加一个清除按钮"</li>
        <li><strong>部署</strong>：点击 Deploy 按钮，Spark 自动发布为可公开访问的链接</li>
        <li><strong>分享</strong>：复制链接发给别人即可使用（接收方不需要登录或安装任何东西）</li>
      </ol>

      <Callout type="info">
        <strong>部署后的管理</strong>：已部署的应用在 Spark 仪表板中可见，支持重新部署更新、关闭分享、导出代码到 GitHub 仓库。
      </Callout>

      <Collapsible summary="验证：确认 Spark 应用正常运行">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>部署完成后逐条检查：</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li>在浏览器中打开部署链接，页面应正常加载（200 OK）</li>
          <li>测试应用核心功能：如果描述中包含"搜索"，确认搜索框工作；包含"按钮"，确认点击有响应</li>
          <li>用手机浏览器打开同样链接，确认移动端可访问（Spark 默认生成响应式布局）</li>
        </ol>
      </Collapsible>

      <h2 id="section-next"><span className="step-badge">5</span>下一步：写出高质量的 Prompt</h2>
      <p>
        Spark 的输出质量高度依赖你的描述质量。详细 Prompt 技巧和迭代策略见「配置指南」标签页。
      </p>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如果遇到使用问题，可查看「故障排查」标签页，或访问 GitHub 官方文档搜索 Spark 相关文章。
      </p>
    </div>
  );
}

export default renderSparkInstall;
