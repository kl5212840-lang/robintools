import { CodeBlock } from "@/components/content/code-block";
import { Callout, Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderCursorRulesClaudeMd() {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        你刚刚初始化了一个 Next.js 16 项目，打开 Cursor 让 AI 写一个页面。它认真地给你返回了 <code>getServerSideProps</code>——可你用的是 App Router。同样的场景在 Vue 3 项目中 AI 输出 Options API，在 esm 项目中 AI 用 <code>require()</code>。每次都浪费好几轮对话来纠正。
      </p>
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        <strong>这不是 AI 笨，是你没告诉它规则。</strong> 一行代码没改，加一个文件就能让这类问题减少大半。
      </p>

      <h2 id="how-it-works">一、原理：不是"训练"，是"声明"</h2>
      <p>项目规则文件相当于给 AI 的<strong>入职说明</strong>——它在开始工作前自动读一遍，知道这个项目用什么技术栈、禁止什么写法。你不说，AI 只能靠训练数据猜，训练数据里旧模式比新模式多得多。</p>

      <p>主流方案很简单：一个文件，放在项目根目录，AI 启动时自动读。</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>用 Cursor</strong> → 写 <code>.cursor/rules/*.mdc</code>（支持按文件类型触发）</li>
        <li><strong>用 Claude Code</strong> → 写 <code>CLAUDE.md</code> + <code>.claude/rules/*.md</code>（支持路径匹配）</li>
        <li><strong>两者都用的用户</strong> → 写 <code>CLAUDE.md</code> 就够了——Cursor 从 2025 年起原生读取</li>
      </ul>

      <h2 id="cursor-rules">二、Cursor：.cursor/rules/*.mdc</h2>

      <Callout type="warning">
        <strong>旧格式 vs 新格式</strong>：如果你还在用根目录的 <code>.cursorrules</code> 单文件，建议迁移到 <code>.cursor/rules/</code> 目录。旧格式的 Agent 模式下不生效（截至 2026-06），也无法按文件类型精准触发。
      </Callout>

      <p>在项目根目录创建 <code>.cursor/rules/</code> 文件夹，放入 <code>.mdc</code> 文件。每个文件分两部分：YAML 头部（控制触发条件）+ Markdown 正文（规则内容）。</p>

      <p>YAML 头部决定了规则的<strong>触发模式</strong>：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><code>alwaysApply: true</code> — 每次会话都加载。适合全局技术栈声明</li>
        <li><code>description + globs</code> — 打开匹配 globs 的文件时自动激活。适合特定文件类型的编码规范</li>
        <li>只有 <code>description</code>，无 globs — Agent 根据语义自行判断相关性</li>
        <li>三者都没有 — 仅手动触发（<code>@规则名</code>）</li>
      </ul>

      <h3>最小可用模板</h3>
      <p>创建 <code>.cursor/rules/tech-stack.mdc</code>（替换为自己的技术栈）：</p>
      <CodeBlock language="yaml" mode="unified" code={`---
description: 项目技术栈与编码规范（替换为你的实际技术栈）
alwaysApply: true
---

## 技术栈
- [你的框架] + [你的语言]
- [你的样式方案]

## 禁止事项
- [列2-3条在此项目中绝对不能出现的写法，如"禁止 class 组件""禁止 require()""禁止 axios 用 fetch"]
`} />

      <h3>进阶：按文件类型拆分</h3>
      <p>当项目变大，可以把全局规则和文件类型规则分开：</p>
      <CodeBlock language="yaml" mode="unified" code={`# .cursor/rules/react-components.mdc
---
description: React 组件编码规约
globs: ["src/components/**/*.tsx"]
alwaysApply: false
---

- 使用函数式组件 + hooks，不写 class 组件
- Props 类型定义放在组件文件内，不另建 .d.ts
- 一个文件只导出一个组件`} />

      <Collapsible summary="什么时候拆规则、什么时候合并">
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          3 条以内 → 一个 alwaysApply 文件足够。超过 10 条 → 按技术栈维度拆分（组件规范、API 规范、测试规范各一个 .mdc）。每条规则文件的上下文都会消耗 Token——不要为了"组织清晰"过度拆分。
        </p>
      </Collapsible>

      <h2 id="claude-md">三、Claude Code：CLAUDE.md + .claude/rules/</h2>
      <p>
        Claude Code 在每次会话启动时，自动读取项目根目录的 <code>CLAUDE.md</code>（全大写），作为第一条消息注入上下文。支持 <code>@path/to/file.md</code> 引用外部文件。
      </p>

      <h3>最小可用模板</h3>
      <CodeBlock language="markdown" mode="unified" code={`# CLAUDE.md

## 技术栈
- [你的框架 + 语言 + 样式方案]

## 构建命令
- \`npm run dev\` — 启动开发服务器
- \`npx tsc --noEmit\` — 类型检查

## 规则
- [2-3 条核心约束，如"不修改 schema 文件，走 migration"]
`} />

      <Callout type="info">
        <strong>精简原则</strong>：CLAUDE.md 每次会话都会被完整注入为上下文。控制在 200 行以内。超出后用 <code>@path/to/file</code> 拆分引用，或放到 <code>.claude/rules/*.md</code> 做按路径懒加载。
      </Callout>

      <h3>按路径拆分：.claude/rules/</h3>
      <p>Claude Code 也支持类似 Cursor 的按路径触发——在 <code>.claude/rules/</code> 目录放 <code>.md</code> 文件，YAML 头部声明 <code>paths</code>：</p>
      <CodeBlock language="yaml" mode="unified" code={`# .claude/rules/frontend.md
---
paths: "src/app/**,src/components/**"
---

- 组件使用函数式写法
- 样式使用 Tailwind 原子类，不写独立 CSS`} />
      <p>有 <code>paths</code> 的规则文件只在 Claude 读取匹配文件时才加载，不消耗每次会话的上下文配额。</p>

      <h2 id="tool-comparison">四、两个工具的规则文件怎么选</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}></th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Cursor</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>Claude Code</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>规则文件</strong></td>
              <td className="py-2 pr-4"><code>.cursor/rules/*.mdc</code></td>
              <td className="py-2"><code>CLAUDE.md</code> / <code>.claude/rules/*.md</code></td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>触发方式</strong></td>
              <td className="py-2 pr-4">alwaysApply / globs / Agent 判断 / 手动 @</td>
              <td className="py-2">启动全量注入 / paths 按需懒加载</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>读取对方规则</strong></td>
              <td className="py-2 pr-4">是 — 原生读取 <code>CLAUDE.md</code></td>
              <td className="py-2">否 — 不读 <code>.cursor/rules</code></td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Git 提交</strong></td>
              <td className="py-2 pr-4">建议提交，团队共享</td>
              <td className="py-2">提交 CLAUDE.md，.local.md 加 .gitignore</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>结论：如果你只用其中一个工具，按对应格式写即可。如果你两个都用，<strong>写 CLAUDE.md 就能覆盖两个工具的全局规则</strong>（Cursor 原生读取），把文件类型细分规则放到 .cursor/rules/（Cursor）或 .claude/rules/（Claude Code）。</p>

      <h2 id="verify">五、验证是否生效</h2>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>在项目里创建一个新文件，让 AI "帮我新建一个页面组件"</li>
        <li>检查生成的代码是否符合你规则文件里的约束</li>
        <li>如果不符合：检查规则文件路径是否正确、YAML 头部格式是否有语法错误、是否重启了编辑器或终端</li>
      </ol>
      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        一个快速自测 prompt：<code>"这个项目用什么技术栈？有哪些编码规范必须遵守？"</code>——AI 的回答应直接引用你规则文件中的内容。
      </p>

      <FreshnessNote>本文基于 Cursor（2026-06 版本）和 Claude Code v2.x 验证。规则系统的字段和行为可能随版本更新变化，建议以各工具官方文档为准。</FreshnessNote>
    </div>
  );
}
