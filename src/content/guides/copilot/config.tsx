import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCopilotConfig(platform: Platform) {
  const cmd = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        GitHub Copilot 的配置和使用技巧，帮助你最大化利用这个工具。
      </p>

      <h2 id="section-apikey"><span className="step-badge">1</span>订阅与计费</h2>
      <div className="space-y-3 text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        <p>Copilot 提供个人版、商业版和企业版订阅方案，也对学生和开源项目维护者免费开放。</p>
        <p>国内可直接使用，不需要科学上网。支持支付宝付款。</p>
      </div>
      <Callout type="info">
        国内可直接使用，不需要科学上网。支持支付宝付款。
      </Callout>

      <h2 id="section-config-file"><span className="step-badge">2</span>高级设置</h2>
      <p>VS Code 设置中搜索 Copilot 可配置：</p>
      <ul className="list-disc pl-5 space-y-1 text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>启用/禁用</strong>：按语言或文件类型开关 Copilot</li>
        <li><strong>建议延迟</strong>：调整补全建议的出现速度</li>
        <li><strong>隐私设置</strong>：个人版可选关闭代码片段收集</li>
        <li><strong>模型选择</strong>：可选择不同的 GPT 模型变体</li>
      </ul>

      <h3>项目指令文件</h3>
      <p>在项目根目录创建 <code>.github/copilot-instructions.md</code>，Copilot 会自动读取并遵循其中的规范：</p>
      <CodeBlock language="markdown" mode="unified" code={`# .github/copilot-instructions.md 示例

## 编码风格
- 使用 TypeScript 严格模式，禁止 any
- 函数组件使用 export function，不用 export default
- CSS 使用 Tailwind 原子类，不手写 .css

## 项目约定
- API 路由放在 src/app/api/ 下
- 数据库查询使用 Prisma，不手写 SQL
- 用户认证统一用 NextAuth.js

## Copilot 行为
- 优先使用项目已有的工具函数，不要重复造轮子
- 复杂修改先输出方案，确认后再写代码`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        类似 Claude Code 的 <code>CLAUDE.md</code> 和 Cursor 的 <code>.cursor/rules/</code> 目录。建议提交到 Git 仓库，团队成员共享一致的 AI 编码规范。
      </p>

      <h2 id="section-shortcuts"><span className="step-badge">3</span>验证配置 + 快捷键</h2>
      <p>完成订阅和 instructions.md 配置后，逐条确认：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开一个 .ts 文件，输入 <code>// 写一个函数：接收字符串数组，按长度降序排列</code> 然后回车——应出现灰字补全建议，说明补全正常</li>
        <li>{cmd}+Shift+I 打开 Chat 面板，输入 <code>/explain 选中这段代码</code>——应返回代码解释</li>
        <li>修改 <code>.github/copilot-instructions.md</code> 中的编码风格后，在 Chat 中问"这个项目的 TypeScript 风格是什么"——回复应与 instructions 一致</li>
      </ol>
      <Collapsible summary="验证：instructions.md 是否真的生效？">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>测试方法：在 instructions 中写入一条独特规则（如「所有变量命名使用 camelCase，回复中请用 🐫 emoji 作为标记」），然后在 Chat 中问一个编码问题——如果回复中出现 🐫，说明 instructions 生效。</p>
      </Collapsible>
    </div>
  );
}

/* ================================================================
   Copilot 配置指南
   ================================================================ */

export default renderCopilotConfig;
