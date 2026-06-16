import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, Collapsible } from "../_shared";

function renderWindsurfTutorial(platform: Platform) {
  const ctrl = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Windsurf 是 Codeium 推出的 AI-first IDE，内置 <strong>Cascade AI 代理</strong>。本教程帮你从入门到精通，掌握 Windsurf 的核心功能。
      </p>

      <h2 id="section-tutorial-basics"><span className="step-badge">1</span>核心操作</h2>
      <h3>三大 AI 功能</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>功能</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>快捷键</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>说明</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Supercomplete</strong></td>
              <td className="py-2 pr-4">Tab</td>
              <td className="py-2">智能代码补全，类似 Copilot。光标处自动建议</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Cascade</strong></td>
              <td className="py-2 pr-4">{ctrl}+L</td>
              <td className="py-2">AI 对话面板，可读写多文件、搜索代码库、理解项目</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Cascade 多文件编辑</strong></td>
              <td className="py-2 pr-4">{ctrl}+L</td>
              <td className="py-2">多文件编辑模式——一条指令同时修改多个文件</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>实操示例</h3>
      <CodeBlock language="text" code={`# Cascade 对话（{ctrl}+L）：
"帮我分析一下这个项目的文件结构和技术栈"
"这个函数有什么潜在的性能问题？"
"帮我写一个 README，描述项目的安装和使用方式"

# @ 引用上下文：
"@src/components/Header.tsx 帮我给这个组件加一个搜索框"
"对比一下 @src/utils/old.ts 和 @src/utils/new.ts 的区别"`} />

      <Callout type="info">
        <strong>@ 符号技巧</strong>：在 Cascade 中输入 <code>@</code> 可引用文件、文件夹甚至整个目录树。选中代码后按 {ctrl}+L 会自动将选中内容作为上下文带入对话。
      </Callout>

      <h2 id="section-tutorial-files"><span className="step-badge">2</span>Cascade 深度使用</h2>
      <h3>多文件编辑（Multi-file Edit）</h3>
      <p>这是 Windsurf 区别于其他 IDE 的核心能力。Cascade 多文件编辑（{ctrl}+L）可以一次修改多个文件：</p>
      <CodeBlock language="text" code={`# 在 Cascade 多文件编辑 中描述跨文件需求：

"帮我创建一个用户注册功能：
1. src/types/user.ts — 定义 User 类型
2. src/api/auth/register.ts — POST 注册接口
3. src/components/SignUp.tsx — 注册表单组件
4. 更新 src/middleware.ts 添加路由鉴权"`} />
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>Windsurf 会自动保持文件间的一致性（如类型定义变更时同步更新所有引用）</li>
        <li>在 Settings &gt; Cascade 中可切换<strong>自动模式</strong>（直接修改）和<strong>手动模式</strong>（每次确认）</li>
        <li><strong>Continue 模式</strong>：Cascade 可连续执行复杂的多步任务，无需反复输入指令</li>
      </ul>

      <h2 id="section-tutorial-git"><span className="step-badge">3</span>实战工作流</h2>
      <h3>开发新功能</h3>
      <p>Cascade（{ctrl}+L）→ 描述需求，让 AI 给出方案 → 确认方案后切换到 Cascade 多文件编辑（{ctrl}+L）→ 输入实现指令 → 审查 diff → 一键 Apply</p>
      <h3>修复 Bug</h3>
      <p>选中报错代码 → {ctrl}+L → "这个代码有什么问题？帮我修复" → Cascade 分析根因 → 应用建议</p>
      <h3>学习代码</h3>
      <p>打开陌生项目 → {ctrl}+L → "解释这个项目的整体架构" → 追问具体模块 → @ 引用关键文件深入理解</p>
      <h3>代码审查</h3>
      <p>在 PR 或 diff 页面 → {ctrl}+L → "审查这些变更，指出潜在问题和改进建议"</p>

      <Callout type="warning">
        <strong>注意</strong>：大型重构建议分步执行，每次检查 diff 后再继续。Cascade 虽然强大，但复杂任务仍需要人工审查。
      </Callout>

      <h2 id="section-tutorial-advanced"><span className="step-badge">4</span>工具配合与选型</h2>
      <ul className="list-disc pl-5 space-y-2 text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>Windsurf + Claude Code</strong>：Windsurf 做前端开发（UI 预览方便），Claude Code 管理 Git 和后端脚本</li>
        <li><strong>Windsurf + Codex</strong>：沙箱需求场景用 Codex，常规开发用 Windsurf</li>
        <li><strong>选型建议</strong>：习惯 VS Code → Windsurf 或 Cursor。喜欢终端 → Claude Code。已有 ChatGPT → Codex</li>
        <li><strong>不要过度纠结</strong>：五款工具都可以完成日常开发，选一个用熟比来回切换更重要</li>
      </ul>

      <Collapsible summary="验证：确认 Cascade 正常工作">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>逐条自检：</p>
        <ol className="list-decimal pl-5 space-y-1 text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          <li><strong>Supercomplete</strong>：打开任一文件，输入 <code>function sortByDate</code>，应出现灰字补全</li>
          <li><strong>Cascade 对话</strong>：{ctrl}+L → 输入"解释这个项目的结构"→ 应返回项目结构概述</li>
          <li><strong>多文件编辑</strong>：{ctrl}+L 切换到多文件模式 → 输入"创建一个 Hello World 组件"→ 右侧应出现文件列表预览，点击 Apply 后文件生成</li>
        </ol>
      </Collapsible>
    </div>
  );
}

export default renderWindsurfTutorial;
