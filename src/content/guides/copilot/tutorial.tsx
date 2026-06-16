import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, Collapsible } from "../_shared";

function renderCopilotTutorial(platform: Platform) {
  const cmd = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Copilot 的核心是智能代码补全和对话。相比 CLI 工具，它的使用更"轻量"——安装即用，关键在于掌握 <strong>写出好的引导</strong> 的技巧。本节聚焦长期有效的实践方法。
      </p>

      <h2 id="section-tutorial-basics"><span className="step-badge">1</span>提升补全质量的技巧</h2>
      <h3>写注释引导 AI</h3>
      <p>Copilot 根据上下文推断你的意图。最有效的引导方式就是<strong>先写注释</strong>：</p>
      <CodeBlock language="javascript" code={`// ✅ 好的引导（清晰描述意图）
// 写一个函数，接收用户数组，返回按年龄降序排列的前10个用户
// 如果用户没有邮箱，跳过该用户

// ❌ 模糊的引导
// 处理用户数据`} />

      <h3>打开相关文件提供上下文</h3>
      <p>Copilot 会读取当前打开的标签页作为上下文。想要更精准的补全：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>写 API 路由时，打开类型定义文件（如 <code>types.ts</code>）</li>
        <li>写组件时，打开同目录下已有组件作为风格参考</li>
        <li><strong>不要</strong>打开无关文件，会干扰 Copilot 的判断</li>
      </ul>

      <h3>命名本身就是引导</h3>
      <p>函数名和变量名直接影响补全质量：</p>
      <CodeBlock language="typescript" code={`// ✅ 好的命名 → Copilot 自动补全合理逻辑
function validateUserEmail(email: string): boolean {
  // Copilot 会自动生成邮箱格式校验逻辑
}

// ❌ 模糊的命名 → Copilot 只能猜
function check(x: string): any {
  // Copilot 不知道你要做什么
}`} />

      <h2 id="section-tutorial-files"><span className="step-badge">2</span>Copilot Chat 对话模式</h2>
      <p>Cmd+Shift+I（macOS）或 Ctrl+Shift+I（Windows/Linux）打开 Chat 面板，功能远超补全：</p>
      <CodeBlock language="text" code={`# Chat 的常用场景：

# 解释代码
/explain 解释这段代码的逻辑

# 修复问题
/fix 这段代码有什么问题？帮我修复

# 生成测试
/tests 为这个函数生成单元测试

# 代码重构
选中一段代码 → "简化这段代码的逻辑"

# 项目理解
"这个项目用了什么技术栈？入口文件是哪个？"`} />
      <Callout type="info">
        <strong>Chat 技巧</strong>：在 Chat 中可以通过 <code>#file:文件名</code> 引用项目中的文件作为上下文，Copilot 会读取该文件内容参与对话。
      </Callout>

      <h2 id="section-tutorial-git"><span className="step-badge">3</span>项目级配置</h2>
      <h3>自定义指令文件</h3>
      <p>在项目根目录创建 <code>.github/copilot-instructions.md</code>，Copilot 会自动读取：</p>
      <CodeBlock language="markdown" mode="unified" code={`# .github/copilot-instructions.md

## 编码风格
- TypeScript 严格模式，禁止使用 any
- React 组件使用函数式写法，避免 class 组件
- 优先使用 Tailwind CSS，不手写 CSS 文件

## 项目约定
- API 路由放在 src/api/，按功能分文件夹
- 每个组件对应一个测试文件（__tests__/ 目录）

## Copilot 行为
- 复杂逻辑先输出伪代码或注释说明思路
- 优先复用项目已有的工具函数，不要重复造轮子`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        团队项目建议将此文件提交到 Git，确保所有人获得一致的 AI 编码体验。
      </p>

      <Collapsible summary="验证：补全 + Chat + instructions 正常工作">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>完成配置后逐条自检：</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li><strong>补全</strong>：打开 .ts 文件，输入 <code>// sort array alphabetically</code> 回车，应出现灰字补全。按 Tab 接受 → 代码写入文件</li>
          <li><strong>Chat</strong>：{cmd}+Shift+I → 输入 <code>/explain 解释这个项目的架构</code> → 应返回项目概述</li>
          <li><strong>instructions</strong>：在 Chat 中问"这个项目用的是什么编码风格？" → 回复应与 instructions.md 中的规范一致</li>
        </ol>
      </Collapsible>

      <h3>按语言/文件类型开关</h3>
      <p>VS Code 设置中搜索 <code>github.copilot.enable</code>，可为特定语言禁用 Copilot。例如在写 Markdown 或配置文件时关闭，避免不必要的补全干扰。</p>

      <h2 id="section-tutorial-advanced"><span className="step-badge">4</span>工具组合使用</h2>
      <p>Copilot 和其他工具的关系是<strong>互补</strong>而非替代：</p>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>场景</th>
            <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐工具</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4">日常写代码、轻量补全</td>
            <td className="py-2"><strong>Copilot</strong> — 最流畅的行内补全体验</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4">跨文件重构、创建新功能</td>
            <td className="py-2"><strong>Cursor</strong> 或 <strong>Windsurf</strong> — Composer 多文件编辑</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4">项目管理、Git 操作、终端自动化</td>
            <td className="py-2"><strong>Claude Code</strong> — 深度文件操作 + Git 集成</td>
          </tr>
          <tr>
            <td className="py-2 pr-4">已有 ChatGPT 订阅，需要沙箱安全</td>
            <td className="py-2"><strong>Codex CLI</strong> — 沙箱默认开启</td>
          </tr>
        </tbody>
      </table>

      <h2 id="section-tutorial-workflow"><span className="step-badge">5</span>实战工作流示例</h2>
      <p>以下是一个典型场景，展示如何组合前面的技巧：</p>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>规划</strong>：先想清楚要做什么功能，用自然语言在注释中描述</li>
        <li><strong>引导</strong>：写一个清晰的函数签名 + JSDoc 注释</li>
        <li><strong>补全</strong>：Copilot 自动生成函数体，Tab 接受</li>
        <li><strong>审查</strong>：仔细检查生成的代码逻辑，必要时用 <code>/explain</code> 理解不熟悉的部分</li>
        <li><strong>测试</strong>：选中函数 → <code>/tests</code> 自动生成单元测试</li>
        <li><strong>迭代</strong>：用 <code>#file</code> 引用相关文件，让 Copilot 基于全项目上下文做修改</li>
      </ol>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        关键原则：<strong>Copilot 是加速器，不是自动驾驶</strong>。每一行生成的代码都应经过你的审查和理解。
      </p>

      <Callout type="warning">
        <strong>Copilot 的边界</strong>：Copilot 擅长行内补全和单文件对话，但不具备以下能力——① 不能执行终端命令或操作文件系统；② 不能管理 Git 分支或创建 PR；③ 不能跨多个文件同步修改。遇到这些需求时，建议切换到 Claude Code 或 Cursor Composer。
      </Callout>

      <Callout type="info">
        <strong>总结</strong>：Copilot 的定位是 IDE 内的轻量助手。搭配 Cursor/Windsurf 做多文件编辑 + Claude Code 做 Git 工作流，三件套覆盖大部分开发场景。
      </Callout>
    </div>
  );
}

export default renderCopilotTutorial;
