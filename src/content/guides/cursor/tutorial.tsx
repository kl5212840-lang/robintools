import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, Collapsible } from "../_shared";

function renderCursorTutorial(platform: Platform) {
  const ctrl = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <Collapsible summary="简介">
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Cursor 是基于 VS Code 的 AI-first 编辑器。本教程帮你快速掌握核心功能，从基本操作到实战工作流。
        </p>
      </Collapsible>

      <h2 id="section-tutorial-basics"><span className="step-badge">1</span>核心快捷键</h2>
      <h3>四种 AI 交互模式</h3>
      <p>Cursor 提供四种不同的 AI 交互方式，分别适用于不同场景：</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>快捷键</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>功能</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适用场景</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Tab</strong></td>
              <td className="py-2 pr-4">光标处智能代码补全</td>
              <td className="py-2">写代码时自动触发</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>{ctrl}+K</strong></td>
              <td className="py-2 pr-4">行内编辑器——选中代码后输入指令，在当前位置生成/修改</td>
              <td className="py-2">小范围编辑、重构选中代码</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>{ctrl}+L</strong></td>
              <td className="py-2 pr-4">侧边对话面板——与 AI 多轮对话，可 @ 引用上下文</td>
              <td className="py-2">理解代码、获取建议、调试</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>{ctrl}+I</strong></td>
              <td className="py-2 pr-4">Composer——多文件编辑器，一次操作多文件</td>
              <td className="py-2">跨文件功能开发、大范围重构</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>实操示例</h3>
      <CodeBlock language="text" code={`# {ctrl}+K 行内编辑（选中代码后输入）：
# "把这个函数改成 async/await 写法"
# "给这个变量改成更有意义的名字"
# "简化这段代码的逻辑"

# {ctrl}+L 侧边对话（在聊天面板中输入）：
# "解释一下 src/auth/login.ts 的认证流程"
# "这个项目用了哪些技术栈？"
# "帮我分析一下这个 PR 的代码变更"`} />

      <Callout type="info" summary="@ 符号技巧">
        在 {ctrl}+L 或 {ctrl}+I 中输入 <code>@</code> 可以引用文件、文件夹、代码片段、Git 历史、文档链接等，AI 会把这些作为上下文。例如 <code>@src/components</code> 引用整个组件目录。
      </Callout>

      <h2 id="section-tutorial-files"><span className="step-badge">2</span>Composer 多文件编辑</h2>
      <p>Composer（{ctrl}+I）是 Cursor 最核心的功能，可以一次性跨文件创建和修改：</p>
      <CodeBlock language="text" code={`# 在 Composer 中输入自然语言指令：

# 创建新功能
在 src/api/ 下创建用户注册接口，包括：
- POST /api/auth/register 路由
- 输入验证（邮箱、密码长度）
- Prisma 数据库操作
- JWT token 返回

# 跨文件重构
把项目里所有的 console.log 去掉，
把 var 改成 const/let，
同步更新相关的 TypeScript 类型定义`} />
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Composer 会先生成所有文件的修改方案，在右侧预览</li>
        <li>点击 <strong>Apply</strong> 一键应用所有修改，或逐个文件 <strong>Accept/Reject</strong></li>
        <li>修改不满意可以 <strong>Undo</strong>（{ctrl}+Z）回退</li>
      </ul>

      <h2 id="section-tutorial-git"><span className="step-badge">3</span>实战工作流</h2>
      <p>日常开发中最常用的四种工作流：</p>
      <h3>开发新功能</h3>
      <p>{ctrl}+I → 描述功能需求（含文件路径、数据模型、UI 要求）→ 审查生成的代码 → Apply → 运行测试</p>
      <h3>重构代码</h3>
      <p>选中目标代码 → {ctrl}+K → 描述重构目标（如"拆成两个函数"）→ 预览差异 → 接受</p>
      <h3>调试报错</h3>
      <p>选中报错信息/代码 → {ctrl}+L → "这个错误是什么原因？怎么修复？" → 获取分析和建议</p>
      <h3>学习项目</h3>
      <p>打开陌生项目 → {ctrl}+L → "解释一下这个项目的架构和入口文件" → @ 引用关键文件深入了解</p>

      <Callout type="warning" summary="最佳实践">
        在 Composer 做大型改动前，先用 Git 提交当前状态。Cursor 的 Undo 很强大但不是万能的。
      </Callout>

      <Collapsible summary="验证：确认 Cursor 工作流正常">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>快速自检：</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li><strong>Tab 补全</strong>：打开任一 .ts/.tsx 文件，开始输入 function，应出现灰字补全建议</li>
          <li><strong>{ctrl}+K 编辑</strong>：选中一段代码，按 {ctrl}+K，输入"重构这段代码"，AI 面板应弹出并返回修改</li>
          <li><strong>{ctrl}+I Composer</strong>：按 {ctrl}+I，描述一个简单需求（如"创建一个 Hello World 组件"），应生成文件列表预览</li>
          <li><strong>规则生效</strong>：在 {ctrl}+L 中 @ 引用一个规则文件，AI 回复应遵循规则中的编码风格</li>
        </ol>
      </Collapsible>

      <h2 id="section-tutorial-advanced"><span className="step-badge">4</span>工具选型建议</h2>
      <ul className="list-disc pl-5 space-y-2 text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>Cursor vs Windsurf</strong>：功能相似，Cursor 社区更大、插件生态更成熟。Windsurf 的 Cascade 在持续任务方面有独特优势</li>
        <li><strong>Cursor vs Claude Code</strong>：Cursor 适合可视化 IDE 用户和前端开发，Claude Code 适合终端发烧友和后端/全栈项目</li>
        <li><strong>组合使用</strong>：Cursor 写 UI + Claude Code 管理 Git/后端脚本 + Copilot 做轻量补全——三者互补</li>
      </ul>
    </div>
  );
}

export default renderCursorTutorial;
