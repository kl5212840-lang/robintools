import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, Collapsible } from "../_shared";

function renderSparkConfig(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Spark 的&ldquo;配置&rdquo;不是填 API Key 或改配置文件——而是掌握 Prompt 写作、迭代策略和部署选项，让 AI 产出符合你预期的应用。
      </p>

      <h2 id="section-prompt"><span className="step-badge">1</span>Prompt 写作技巧</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        好的 Prompt 包含四个要素：<strong>角色 + 功能 + 样式 + 约束</strong>。缺一个，AI 就只能猜。
      </p>

      <h3>四要素 Prompt 公式</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>要素</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>说明</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>示例</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>角色</strong></td>
              <td className="py-2 pr-4">这个应用干谁的活</td>
              <td className="py-2">"一个给团队用的每日站会记录工具"</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>功能</strong></td>
              <td className="py-2 pr-4">具体能做什么</td>
              <td className="py-2">"三个输入框（昨天做了什么、今天计划、遇到什么阻塞），提交后生成卡片列表"</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>样式</strong></td>
              <td className="py-2 pr-4">长什么样</td>
              <td className="py-2">"简洁白底卡片、蓝色主色调、适配手机屏幕"</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>约束</strong></td>
              <td className="py-2 pr-4">不能做什么、特殊要求</td>
              <td className="py-2">"不需要登录功能；数据存在本地浏览器即可；不要用动画效果"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>完整 Prompt 示例</h3>
      <CodeBlock language="text" mode="unified" code={`创建一个团队每日站会记录工具：
角色：给 5-10 人的敏捷团队用
功能：
  - 三个输入框：昨天做了什么、今天计划、遇到什么阻塞
  - 提交后在下方生成卡片列表，最新在最上面
  - 每张卡片显示人名（输入框右侧加一个人名输入）、时间和内容
  - 可以删除自己的卡片
样式：
  - 白色背景，深灰文字，蓝色 #2563EB 作为按钮色
  - 卡片圆角 8px，轻微阴影
  - 移动端优先设计，手机上好用
约束：
  - 数据存浏览器 localStorage，不需要后端
  - 不需要登录认证
  - 不要自动刷新动画`} />

      <Callout type="info">
        <strong>中文完全可用</strong>：Spark 支持中文 Prompt，不需要翻译成英文。用你最自然的表达方式，把四个要素说清楚就好。
      </Callout>

      <h2 id="section-iterate"><span className="step-badge">2</span>迭代与精调</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        第一次生成的结果很少完美——迭代是 Spark 工作流的核心。每轮迭代聚焦一个问题，不要一口气提 5 个改动。
      </p>

      <h3>迭代策略</h3>
      <CodeBlock language="text" code={`# 第一轮：产出后，先看整体布局
> 卡片列表改成三列网格布局，而不是竖向排列

# 第二轮：调具体组件
> 给卡片加一个"点赞"按钮，显示点赞数量

# 第三轮：调视觉
> 卡片背景改成浅灰 #f5f5f5，hover 时加深到 #e5e5e5

# 第四轮：修复细节
> 删除按钮太小了，做大一点，加确认弹窗`} />

      <Callout type="warning">
        <strong>迭代弯路</strong>：一次提太多改动（如"把布局改成三列，按钮换颜色，加一个导航栏，字体调大"）——Spark 可能只执行了部分，或在执行过程中引入新问题。一次一个改动，确认没问题再下一步。
      </Callout>

      <h2 id="section-deploy"><span className="step-badge">3</span>部署与发布</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Spark 内置部署能力，生成的应用可以一键发布为公网可访问的链接。
      </p>

      <h3>部署流程</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Spark 界面右上角或底部找到 <strong>Deploy</strong> 按钮</li>
        <li>点击后 Spark 自动构建并部署</li>
        <li>部署完成后获得一个公开 URL（如 <code>spark-app-xxxx.github.io</code>）</li>
        <li>URL 可以分享给任何人，接收方不需要登录或安装</li>
      </ol>

      <Collapsible summary="验证：确认 Prompt 优化生效">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>对比测试法：</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li>先用最简单的描述生成一版（如"做一个待办事项"）→ 记录效果</li>
          <li>再用标准四元素 Prompt 重新生成 → 对比是否显著改进（布局更合理、样式更统一）</li>
          <li>如果改进不明显 → 逐个检查 Prompt 元素是否完整（角色+功能+样式+约束）</li>
        </ol>
      </Collapsible>

      <h3>部署选项</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>公开链接</strong>：默认模式，任何有链接的人都可以访问</li>
        <li><strong>CLI 部署</strong>：支持命令行导出和手动部署（详见 GitHub 官方文档）</li>
        <li><strong>重新部署</strong>：修改应用后再次 Deploy，URL 不变，内容更新</li>
        <li><strong>停止分享</strong>：在 Spark 仪表板中关闭部署，链接立即失效</li>
      </ul>

      <Callout type="info">
        <strong>企业用户</strong>：管理员可以在组织设置中限制 Spark 部署目标（如仅允许部署到组织 GitHub Pages），防止数据外泄。
      </Callout>

      <h2 id="section-code"><span className="step-badge">4</span>导出与代码</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Spark 生成的每个应用都可以导出为完整代码，放入 GitHub 仓库继续开发。
      </p>

      <h3>导出方式</h3>
      <CodeBlock language="text" code={`# 方式一：导出到 GitHub 仓库
# Spark 界面 → Export → Create GitHub Repository
# 代码自动推送到你的 GitHub 账户

# 方式二：下载 ZIP
# Spark 界面 → Export → Download ZIP
# 下载完整的项目代码，本地解压即可`} />

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        导出后的代码是标准 Web 项目（HTML + CSS + JavaScript），可以在任何文本编辑器中继续修改。作为启动模板，省去从零搭建的重复工作。
      </p>

      <Callout type="info">
        <strong>Spark 的代码能直接用吗？</strong>能——经过测试导出的代码含完整的样式和交互。但作为 AI 生成的代码，建议你在正式投入生产前进行代码审查，重点检查安全性和性能。
      </Callout>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        Prompt 遇到问题可参考「故障排查」。更多技巧见「使用教程」标签页。
      </p>
    </div>
  );
}

export default renderSparkConfig;
