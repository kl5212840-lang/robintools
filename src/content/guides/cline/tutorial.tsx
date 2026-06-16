import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote } from "../_shared";

function renderClineTutorial(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        本教程假设你已完成 Cline 的安装和 API Key 配置。如果还没配置，请先查看「安装指南」和「配置指南」标签页。
      </p>

      <h2 id="section-tutorial-basics"><span className="step-badge">1</span>Plan / Act 双模式</h2>

      <p>Cline 的核心设计是 Plan 和 Act 分离——先想清楚再动手。</p>

      <h3>Plan 模式：探索与规划</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Plan 模式下 Cline 会分析代码库、提出方案，但<strong>不会执行任何修改</strong>。适合：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>接手陌生项目时先理解架构</li>
        <li>复杂需求在动手前确认方向</li>
        <li>代码审查时让 Cline 独立分析</li>
      </ul>
      <CodeBlock language="text" code={`# Plan 模式对话示例
> 分析这个项目的路由结构，告诉我哪些地方有循环依赖风险
> 现在我要加一个用户权限管理功能，先给方案不要写代码
> 这个 PR 改动涉及 8 个文件，帮我逐文件分析影响范围`} />

      <h3>Act 模式：执行与操作</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        确认 Plan 的方案后，切换到 Act 模式。每次修改前 Cline 会展示具体操作用户确认。
      </p>
      <CodeBlock language="text" code={`# Act 模式对话示例
> 按刚才的方案实现用户权限管理，分步来
> 根据刚才的代码审查结果，修复 3 个潜在 bug
> 批量重命名 src/components/ 下所有 .jsx 文件为 .tsx`} />

      <Callout type="info">
        <strong>最佳实践</strong>：涉及 3 个以上文件的改动，先 Plan 后 Act。Plan 省 Token（不需要回滚错误操作），Act 只执行确认过的步骤。不要在 Act 模式下做探索性分析。
      </Callout>

      <h2 id="section-tutorial-files"><span className="step-badge">2</span>MCP 深度使用</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        MCP 是 Cline 区别于其他 AI 工具的核心竞争力——它让 Cline 不只是编辑器助手，而是能连接外部系统的中枢。关于 MCP 协议原理，见<a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP》</a>；MCP 配置排查见<a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>。
      </p>

      <h3>常用 MCP 场景</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>场景</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>MCP 服务器</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>用法</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>数据库查询</strong></td>
              <td className="py-2 pr-4">PostgreSQL / SQLite MCP</td>
              <td className="py-2">Cline 直接查数据库验证数据结构</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>文档搜索</strong></td>
              <td className="py-2 pr-4">Context7 / Brave Search</td>
              <td className="py-2">写代码时实时查最新库文档</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>项目管理</strong></td>
              <td className="py-2 pr-4">Linear / GitHub Issues</td>
              <td className="py-2">从 Issue 自动生成实现代码</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>浏览器自动化</strong></td>
              <td className="py-2 pr-4">Playwright MCP</td>
              <td className="py-2">Cline 操控浏览器测试前端页面</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>文件系统</strong></td>
              <td className="py-2 pr-4">Filesystem MCP</td>
              <td className="py-2">跨项目目录读写文件</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>让 Cline 帮你创建 MCP 工具</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Cline 的特色能力——你可以直接要求它为你创建自定义 MCP 服务器：
      </p>
      <CodeBlock language="text" code={`# 示例：让 Cline 创建一个内部 API 的 MCP 服务器
> 我们公司有一个内部 API（https://api.internal.example.com/docs），
> 帮我创建一个 MCP 服务器，让 Cline 可以调用这个 API 的 3 个端点：
> GET /projects、GET /deployments、POST /deploy

# Cline 会生成完整的 MCP 服务器代码并帮你配置好`} />

      <h2 id="section-tutorial-git"><span className="step-badge">3</span>多代理协作</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Cline 的多代理系统可以将大任务分解给多个专业代理并行处理。Coordinator（协调者）分配任务，每个 Specialist（专家代理）在自己的上下文中独立工作。
      </p>

      <h3>典型协作模式</h3>
      <CodeBlock language="text" code={`# 协调者对话示例
> 我要实现一个完整的用户认证系统，包括：
> 1. 数据库 schema 设计
> 2. 后端 API 实现
> 3. 前端登录页面
> 4. 单元测试
> 你用多代理协作来做——coordinator 分配，specialist 各做一个

# Cline 会自动：
# - 启动 coordinator agent 分析需求并分解任务
# - 为每个子任务启动 specialist agent（各自独立上下文）
# - 各 specialist 完成后 coordinator 汇总结果`} />

      <Callout type="warning">
        <strong>成本注意</strong>：多代理协作 Token 消耗是单代理的 2-5 倍（每个 specialist 独立上下文）。建议任务 <strong>≥5 个独立文件改动</strong>且各子任务<strong>相互独立</strong>时才使用。小任务用单代理更高效。
      </Callout>

      <h3>多代理 vs 单代理对比</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>维度</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>单代理</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>多代理</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>适用规模</strong></td>
              <td className="py-2 pr-4">1-5 个文件</td>
              <td className="py-2">5+ 个文件，子任务独立</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Token 消耗</strong></td>
              <td className="py-2 pr-4">基准</td>
              <td className="py-2">2-5× 基准</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>并行度</strong></td>
              <td className="py-2 pr-4">串行</td>
              <td className="py-2">子任务并行执行</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>质量控制</strong></td>
              <td className="py-2 pr-4">靠对话迭代</td>
              <td className="py-2">Coordinator 自动汇总检查</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="section-tutorial-advanced"><span className="step-badge">4</span>定时任务与自动化</h2>

      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Cline 支持 Cron 定时任务——你可以设置周期性自动化操作，如每日 PR 摘要、依赖检查、文档归档等。
      </p>

      <h3>常见定时任务场景</h3>
      <CodeBlock language="text" code={`# 每日 PR 摘要
> 每天早上 9 点，检查过去 24 小时所有打开的 PR，
> 生成一份中文摘要发送到 Slack #engineering 频道

# 依赖更新检查
> 每周一中午 12 点，运行 npm outdated，
> 如果有大版本更新，列出 changelog 链接并 @team

# 代码质量日报
> 每天晚上 11 点，运行 eslint 和 tsc --noEmit，
> 统计错误数、警告数，生成趋势图数据`} />

      <Callout type="info">
        <strong>消息集成</strong>：Cline 原生支持 Slack、Telegram、Discord、Google Chat、WhatsApp 和 Linear 的消息通知。定时任务产出可以直接推送这些渠道。
      </Callout>

      <h3>Headless CLI 模式</h3>
      <p className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        Cline CLI 可以在 CI/CD 流水线中零交互运行，适合自动化脚本：
      </p>
      <CodeBlock language="bash" code={`# 管道输入（输出格式因 CLI 版本而异，需确认对应 flag）
echo "检查这个 PR 的代码质量" | cline

# CI/CD 中自动代码审查
cline "Review the changes in this PR and output a summary" > review.json

# 批量处理多个任务
cat tasks.txt | while read task; do
  echo "$task" | cline --output json >> results.jsonl
done`} />

      <Callout type="info">
        <strong>总结</strong>：Cline 的独特价值在于 MCP 深度集成 + 多代理协作 + 定时任务自动化。它不仅仅是一个代码补全工具——更像一个可编程的 AI 开发中台。适合需要高度自定义工作流的团队。
      </Callout>
      <FreshnessNote>以上 MCP 服务器列表、多代理协作功能及定时任务集成渠道（Slack/Telegram/Discord 等）验证于 2026-06。</FreshnessNote>
    </div>
  );
}

export default renderClineTutorial;
