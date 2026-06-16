import { CodeBlock } from "@/components/content/code-block";
import { Callout, Collapsible } from "@/content/guides/_shared";

export function renderTokenOptimization() {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Claude Code 的 Token 消耗中，输入 Token 通常占总量的 <strong>70%–85%</strong>，而输入的大头是上下文文件读取——不是你的 prompt。
        省 Token 的主战场是上下文管理，而非逐条润色 prompt。本文列出四种策略方向，每种有独立的适用场景，可叠加使用。
      </p>

      <Collapsible summary="适用场景">
        <div className="callout callout-info">
          <strong>适用场景</strong>：Claude Code API Key 用户关注成本控制，Pro/Max 订阅用户关注会话免于提前截断。
          本文讨论的是行为习惯和配置层面的优化，不涉及修改 Claude Code 源码或第三方 patch。<br />
          <strong>所有技巧基于 Claude Code v2.x 版本（2026-06）验证。</strong>
        </div>
      </Collapsible>

      {/* ===== 一、上下文管理 ===== */}
      <h2 id="context">一、上下文管理：减少重复输入</h2>
      <p>
        每一条新消息，Claude Code 都会将完整的对话历史重新提交给模型。控制上下文的体积和重复次数，是降低消耗的最直接手段。
      </p>

      <h3>1.1 合并消息</h3>
      <p>
        将多个独立需求合并为一条指令，避免分开发送造成对话历史反复重传。
      </p>
      <CodeBlock language="text" code={`# 分开（3 次完整重传）：
> 帮我把这篇内容总结一下
> 列出要点
> 起一个标题

# 合并（1 次重传）：
> 帮我把这篇内容总结一下，列出要点，并起一个标题`} />

      <h3>1.2 定期压缩上下文</h3>
      <p>
        <code>/compact</code> 将对话历史压缩为摘要，保留关键决策和代码片段，丢弃中间讨论过程。在上下文到达 <strong>50%</strong> 左右时手动触发效果最好——越早做越便宜，留下的有效信息也越多。
      </p>
      <CodeBlock language="bash" code={`# 查看当前上下文用量
/context

# 手动压缩
/compact

# 在 settings.json 中调整自动压缩阈值（默认 ~90%，建议调低）
"CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"`} />

      <h3>1.3 用 Rewind 回退替代纠错消息</h3>
      <p>
        Claude 执行结果不对时，发一条"不对，应该这样..."会让旧对话历史再次提交。用 <strong>Rewind</strong>（双击 Esc）回退到出错前的节点，重新发指令——错误分支不占用后续 Token。
      </p>

      <Collapsible summary="Rewind 与 /clear 的区别">
        <p>
          <strong>Rewind</strong>：回到对话历史的某个具体节点，之前的信息保留，之后的丢弃。适合"这次执行错了，回到上一步重来"。<br />
          <strong>/clear</strong>：清空整个对话，从头开始。适合"这个任务做完了，开始新任务"。<br />
          两者不互斥——Rewind 用于同一任务内的纠错，/clear 用于任务切换。
        </p>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          Rewind 不会影响手动编辑的文件，也不会影响通过 bash 命令修改的文件内容。
        </p>
      </Collapsible>

      <h3>1.4 按任务拆分会话</h3>
      <p>
        一个长会话做多个不相关任务 = 持续为已完成的对话付费。每个独立任务开新会话，任务完成后 <code>/clear</code> 释放上下文。如果确实需要延续，用 <code>/compact</code> 保留摘要、新建会话继续。
      </p>

      {/* ===== 二、配置减重 ===== */}
      <h2 id="config">二、配置减重：降低每次启动的固定开销</h2>
      <p>
        Claude Code 每次会话启动时会读取项目级配置文件。这些文件的体积直接影响每轮对话的基础 Token 成本。
      </p>

      <h3>2.1 精简 CLAUDE.md</h3>
      <p>
        CLAUDE.md 全部内容在每次会话启动时加载。超过 3000 Token 的 CLAUDE.md 会持续占用上下文空间。只保留 Claude 做决策时需要的信息：项目简介、技术栈、编码规范、关键注意事项。不要放详细教程、API 参考手册、或每个文件的描述。
      </p>

      <Collapsible summary="哪些内容不该放 CLAUDE.md">
        <ul>
          <li>冗长的安装教程 → 放 README.md</li>
          <li>API 参考手册 → 放独立文档，让 Claude 需要时去读</li>
          <li>每个文件的用途清单 → Claude 启动时自动扫描项目结构</li>
          <li>通用编程规范（如"用 TypeScript 严格模式"）→ 用 .claude/rules/ 按文件类型拆分</li>
        </ul>
      </Collapsible>

      <h3>2.2 用 Skills 替代大块指令</h3>
      <p>
        Skills 采用渐进式加载——启动时只读名称和描述（约 100 Token），Claude 判断当前任务需要时才加载完整内容。相比全量加载的 CLAUDE.md，Skills 不消耗固定开销。
      </p>
      <CodeBlock language="markdown" code={`# .claude/skills/code-review.md
---
description: 审查代码变更，检查安全、性能和规范
---
# Code Review Skill
## 检查项
- 安全：SQL 注入、XSS、敏感信息泄露
- 性能：N+1 查询、不必要重渲染
- 规范：命名一致性、TypeScript 严格模式`} />

      <h3>2.3 配置 .claudeignore</h3>
      <p>
        阻止 Claude 读取无关文件——每次文件读取都消耗 Token。排除 <code>node_modules</code>、<code>dist</code>、<code>.git</code>、大型二进制文件。
      </p>
      <CodeBlock language="text" code={`# .claudeignore — Claude Code 启动时自动加载
node_modules/
dist/
build/
.git/
*.min.js
*.lock
package-lock.json
pnpm-lock.yaml
coverage/
.next/
*.log`} />

      <h3>2.4 拆分项目规则</h3>
      <p>
        用 <code>.claude/rules/</code> 目录按文件路径拆分规则——Claude 在修改特定文件时才加载对应规则，而不是一次性读完所有规则。这比 CLI 用户的 CLAUDE.md 更省上下文。
      </p>

      <h3>2.5 限制 Bash 输出</h3>
      <p>
        <code>settings.json</code> 中设置 <code>BASH_MAX_OUTPUT_LENGTH</code> 限制命令输出长度，避免测试日志、构建输出等大量文本占用 Token。
      </p>
      <CodeBlock language="json" code={`// ~/.claude/settings.json
{
  "env": {
    "BASH_MAX_OUTPUT_LENGTH": "2000"
  }
}`} />

      {/* ===== 三、模型分层 ===== */}
      <h2 id="model">三、模型与推理分层：按任务复杂度选模型</h2>
      <p>
        不是所有任务都需要 Opus 级别的推理。根据任务复杂度选择模型，在不影响产出的前提下降低单次调用的 Token 成本。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>任务类型</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐模型</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>原因</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">架构设计、重构、复杂调试</td>
              <td className="py-2 pr-4">Opus</td>
              <td className="py-2">需要最强行推理</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">日常编码、代码审查</td>
              <td className="py-2 pr-4">Sonnet</td>
              <td className="py-2">能力足够、成本更低</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">简单修改、格式调整、注释补全</td>
              <td className="py-2 pr-4">Haiku</td>
              <td className="py-2">任务简单、高性价比</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">子代理（并行轻量任务）</td>
              <td className="py-2 pr-4">Haiku / Flash</td>
              <td className="py-2">高度并行、需要控制总成本</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible summary="模型切换方式">
        <p>
          用 <code>/model</code> 切换当前模型，或通过 CC Switch 的配置路由自动分发不同任务到不同模型。
        </p>
      </Collapsible>

      <h3>3.1 限制推理 Token</h3>
      <p>
        <code>CLAUDE_CODE_MAX_THINKING_TOKENS</code> 限制 Claude 在回复前的内部推理时间。复杂任务（架构设计）需要更多推理，日常任务（改函数名）不需要。
      </p>
      <CodeBlock language="json" code={`// ~/.claude/settings.json
"CLAUDE_CODE_MAX_THINKING_TOKENS": "4000"`} />

      {/* ===== 四、会话习惯 ===== */}
      <h2 id="habits">四、会话习惯：每次交互的边际优化</h2>

      <h3>4.1 用 /cost 和 /context 了解消耗</h3>
      <p>
        优化前先了解当前的消耗结构。<code>/cost</code> 显示本次会话的费用估算，<code>/context</code> 显示上下文用量分布。如果发现上下文长时间在 80% 以上，说明压缩策略需要调整。
      </p>

      <h3>4.2 避免让 Claude 读无关文件</h3>
      <p>
        明确指令范围——"分析这个项目的架构"比"看看这个项目"更能避免 Claude 逐文件扫描。发现 Claude 开始读无关文件时按 <code>Ctrl+C</code> 中断，修正指令后继续。
      </p>

      <h3>4.3 交互式确认前让 Claude 先讲计划</h3>
      <p>
        复杂任务（如跨文件重构）执行前先让 Claude 解释计划，确认方向正确后再让执行。避免"执行了一大圈全错了，重来"，旧对话全部浪费。
      </p>
      <CodeBlock language="text" code={`# 先确认方案
> 我想重构 src/utils 的工具函数，你先说明一下你的方案和涉及的文件，不要直接动手。

# 确认后执行
> 方案可以，开始。`} />

      <h3>4.4 Skill 使用前确认标准</h3>
      <p>
        使用 Skill 做多轮迭代时，先和 Claude 确认评分标准、迭代轮数和边界条件，减少"不对，重来"的反复消耗。
      </p>

      <h3>4.5 禁用不必要的权限</h3>
      <p>
        <code>settings.json</code> 中用 <code>permissions.deny</code> 阻止 Claude 读取不会被需要的目录，从源头减少文件读取。
      </p>
      <CodeBlock language="json" code={`// ~/.claude/settings.json
{
  "permissions": {
    "deny": [
      "Read(./node_modules/**)",
      "Read(./.git/**)",
      "Read(./dist/**)"
    ]
  }
}`} />

      {/* ===== 策略对比 ===== */}
      <h2 id="compare">策略对比</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>策略</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>生效时机</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>适用人群</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>改造成本</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>上下文管理</strong></td>
              <td className="py-2 pr-4">每次会话</td>
              <td className="py-2 pr-4">所有用户</td>
              <td className="py-2">行为习惯，一次配置</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>配置减重</strong></td>
              <td className="py-2 pr-4">每次启动</td>
              <td className="py-2 pr-4">有项目配置的用户</td>
              <td className="py-2">一次性配置</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>模型分层</strong></td>
              <td className="py-2 pr-4">每次调用</td>
              <td className="py-2 pr-4">API Key 用户（直接感知价格差异）</td>
              <td className="py-2">每次切换</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>会话习惯</strong></td>
              <td className="py-2 pr-4">每次交互</td>
              <td className="py-2 pr-4">所有用户</td>
              <td className="py-2">行为习惯</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible summary="备注与相关阅读">
        <hr className="my-6" style={{ borderColor: "var(--color-border-subtle)" }} />
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          以上技巧基于 Claude Code v2.x 版本（2026-06）验证。命令和配置项可能随版本更新变化，请以官方文档和 <code>claude --help</code> 为准。价格数据以 Anthropic 官方定价页和 DeepSeek 开放平台公告为准。
        </p>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>相关阅读</strong>：
          <a href="/articles/codebase-context-primer" style={{ color: "var(--color-accent)" }}>《AI 编程的上下文管理》</a>
          讨论了不同上下文引用方式的 Token 消耗对比；
          <a href="/articles/cursor-rules-claude-md" style={{ color: "var(--color-accent)" }}>《让 AI 停止生成过期代码》</a>
          介绍了 CLAUDE.md 和 .cursor/rules 的配置方法。
        </p>
      </Collapsible>
    </div>
  );
}
