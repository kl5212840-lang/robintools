import { CodeBlock } from "@/components/content/code-block";
import { Callout, FreshnessNote } from "@/content/guides/_shared";

export function renderCodebaseContextPrimer() {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        AI 编程工具的核心能力之一是理解项目上下文。但上下文是一把双刃剑——给得太少，AI 缺乏足够信息作出准确判断；给得太多，Token 迅速耗尽，回复质量反而下降。本文介绍如何精准控制 AI 的上下文范围，用较小的 Token 消耗获得更准确的回答。
      </p>

      <h2 id="context-scope">一、上下文范围与 Token 成本</h2>
      <p>不同 AI 工具提供了不同粒度的上下文引用方式。选择合适的方式直接影响回复质量和 Token 消耗：</p>
      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        <strong>使用方式</strong>：以下 <code>@</code> 引用语法为 <strong>Cursor</strong> 的 Chat / Composer 输入框功能——在对话框中输入 <code>@</code> 即可搜索文件/文件夹。
        Claude Code 不使用 <code>@</code> 语法，直接在 prompt 中描述文件路径或名称即可。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>引用方式</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>扫描范围</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Token 消耗</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合场景</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>@Files</strong></td>
              <td className="py-2 pr-4">指定的一到多个文件</td>
              <td className="py-2 pr-4">低</td>
              <td className="py-2">精准修改已知文件、修复局部 Bug</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>@Folders</strong></td>
              <td className="py-2 pr-4">整个目录</td>
              <td className="py-2 pr-4">中低</td>
              <td className="py-2">针对特定模块进行整体重构</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>@Definitions</strong></td>
              <td className="py-2 pr-4">跨文件的类型/函数定义</td>
              <td className="py-2 pr-4">中等</td>
              <td className="py-2">追踪 API 或组件的调用链路</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>@Codebase</strong></td>
              <td className="py-2 pr-4">全局向量索引</td>
              <td className="py-2 pr-4">高</td>
              <td className="py-2">首次接手陌生项目、全局架构分析</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warning">
        <strong>关于 @Codebase</strong>：这是消耗 Token 最大的引用方式。仅在首次接手陌生项目、或需要全局架构级重构时使用。日常的局部修改使用 @Files 或 @Folders 即可。
      </Callout>

      <h2 id="question-formula">二、高效提问公式</h2>
      <p>模糊的提问得到的答案也是模糊的。一个结构清晰的提问应该包含三个要素：</p>

      <div className="rounded-xl p-5 my-5" style={{ background: "var(--color-accent-glow)", border: "1px solid var(--color-accent-glow)" }}>
        <p className="text-[18px] font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
          [明确动作] + [精准上下文] + [输出约束]
        </p>
      </div>

      <h3>对比示例</h3>
      <CodeBlock language="text" mode="unified" code={`# 不推荐的提问方式
"帮我看看这个侧边栏怎么加个按钮，为什么老报错？"
# 问题：AI 不知道"这个侧边栏"是哪个文件，开始猜测上下文

# 推荐的提问方式
"在 @sidebar.tsx 中新增一个外部跳转按钮。参考 @types.ts 中的
导航项类型定义。保持现有的液态玻璃样式，不要修改其他既有逻辑。"`} />

      <p>推荐的提问同时满足了三个要素：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>明确动作</strong>：新增一个外部跳转按钮</li>
        <li><strong>精准上下文</strong>：@sidebar.tsx + @types.ts</li>
        <li><strong>输出约束</strong>：保持玻璃样式，不修改其他逻辑</li>
      </ul>

      <h2 id="index-sync">三、索引同步问题</h2>
      <p>AI 工具的代码索引不是实时更新的。在以下操作后，索引可能过期：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>切换 Git 分支</li>
        <li>批量删除或移动文件</li>
        <li>大规模重构目录结构</li>
      </ul>

      <Callout type="warning">
        <strong>操作建议</strong>：在上述操作后，在 IDE 设置中手动触发 "Resync Index"（重新索引）。否则 AI 会基于旧的缓存数据进行检索，导致生成过期的代码。
      </Callout>

      <h2 id="practice">四、分场景实践建议</h2>

      <h3>场景一：修复已知 Bug</h3>
      <p>使用 <strong>@Files</strong> 引用出问题的文件 + 相关类型定义文件。例如：</p>
      <CodeBlock language="text" code={`"@components/UserList.tsx 组件在数据为空时抛出 TypeError。参考 @types/user.ts 中的 User 类型定义，添加空数据保护逻辑。"`} />

      <h3>场景二：新增功能</h3>
      <p>使用 <strong>@Folders</strong> 引用相关模块目录，让 AI 了解已有的代码风格：</p>
      <CodeBlock language="text" code={`"在 @src/app/api/ 下新增一个 /users/[id] 的 GET 端点。参考 @src/lib/ 中的数据库查询工具函数，返回 JSON 格式的用户信息。"`} />

      <h3>场景三：接手陌生项目</h3>
      <p>首次接触项目时，可以分步使用上下文：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>先用 <strong>@Codebase</strong> 问："概述这个项目的技术栈和目录结构"</li>
        <li>然后用 <strong>@Folders</strong> 深入感兴趣的模块</li>
        <li>具体修改时切换为 <strong>@Files</strong></li>
      </ol>

      <FreshnessNote>本文基于 Cursor + Claude Code v2.x 验证，写作日期 2026-06-12。</FreshnessNote>
    </div>
  );
}
