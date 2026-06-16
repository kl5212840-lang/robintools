import { CodeBlock } from "@/components/content/code-block";
import { Callout, Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderSuperpowersWorkflow() {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        Superpowers 是一个开源的 Claude Code 插件，包含 14 个结构化技能，强制 AI 编程助手按完整的软件工程流程工作——
        先澄清需求、再设计方案、拆解为可验证的小步、用 TDD 实现、最后独立审查。
        它解决的核心问题是：AI 倾向于"直接动手写代码"，跳过设计和验证环节。
      </p>

      <Callout type="info">
        <strong>写作环境</strong>：Claude Code v2.x + Superpowers（obra/superpowers），2026-06 验证。
        Superpowers 于 2025-10-09 发布，2026-01-15 进入 Anthropic 官方插件市场。
        本文内容基于官方市场版本，安装后所有技能自动可用。
      </Callout>

      <Callout type="info" summary="AI 代劳">
        本文包含的命令和配置均可交由 AI 编程工具（Claude Code、Codex CLI、Cursor 等）代劳——选取需要的部分发送即可。详见{" "}
        <a href="/articles/ai-pair-workflow" style={{"color": "var(--color-accent)"}}>「阅读本站前」</a>。
      </Callout>

      {/* ===== 一、安装 ===== */}
      <h2 id="install">一、安装</h2>

      <h3>方式一：官方市场（推荐）</h3>
      <CodeBlock language="bash" code={`/plugin install superpowers@claude-plugins-official`} />

      <h3>方式二：Superpowers 自有市场</h3>
      <CodeBlock language="bash" code={`# 添加市场
/plugin marketplace add obra/superpowers-marketplace
# 安装
/plugin install superpowers@superpowers-marketplace`} />

      <p>安装后重启 Claude Code 即可。输入 <code>/</code> 能看到以 <code>superpowers:</code> 开头的命令列表。</p>

      <Callout type="info">
        Superpowers 还支持 Codex CLI、Cursor、Gemini CLI、Copilot CLI、OpenCode 等平台。
        本文聚焦 Claude Code 上的使用方式，其他平台的适配细节见
        <a href="https://github.com/obra/superpowers" target="_blank" rel="noopener noreferrer">官方仓库</a>。
      </Callout>

      {/* ===== 二、技能概览 ===== */}
      <h2 id="skills">二、技能概览</h2>
      <p>
        14 个技能按开发阶段分为五组。Superpowers 的 <code>using-superpowers</code> 元技能充当路由器，
        自动判断当前处于哪个阶段、应该触发哪个技能，不需要手动指定。
      </p>

      <h3>2.1 设计阶段</h3>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>技能</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>作用</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>brainstorming</code></td>
            <td className="py-2 pr-4">苏格拉底式对话，逐层细化需求，产出设计文档</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 计划阶段</h3>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>技能</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>作用</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>writing-plans</code></td>
            <td className="py-2 pr-4">将设计拆解为 2-5 分钟可完成的微任务</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>executing-plans</code></td>
            <td className="py-2 pr-4">批次执行计划，每个批次结束后设置人工检查点</td>
          </tr>
        </tbody>
      </table>

      <h3>2.3 实现阶段</h3>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>技能</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>作用</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>test-driven-development</code></td>
            <td className="py-2 pr-4">强制 RED-GREEN-REFACTOR 循环，测试写在前，实现写在后</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>subagent-driven-development</code></td>
            <td className="py-2 pr-4">每个微任务派发独立子 Agent，完成后两阶段审查</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>dispatching-parallel-agents</code></td>
            <td className="py-2 pr-4">独立任务并行分发给多个子 Agent</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>using-git-worktrees</code></td>
            <td className="py-2 pr-4">为每个任务创建隔离的 git worktree 和新分支</td>
          </tr>
        </tbody>
      </table>

      <h3>2.4 验证阶段</h3>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>技能</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>作用</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>systematic-debugging</code></td>
            <td className="py-2 pr-4">四阶段根因分析：复现→定位→修复→验证修复</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>verification-before-completion</code></td>
            <td className="py-2 pr-4">完成前逐项验证，作为门控阻止未验证的代码合并</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>requesting-code-review</code></td>
            <td className="py-2 pr-4">生成独立审查子 Agent，按严重度分级反馈</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>receiving-code-review</code></td>
            <td className="py-2 pr-4">评估审查反馈，要求先验证再回应，禁止盲从</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>finishing-a-development-branch</code></td>
            <td className="py-2 pr-4">分支清理，展示 merge / PR / 保留 / 丢弃选项</td>
          </tr>
        </tbody>
      </table>

      <h3>2.5 元技能</h3>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>技能</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>作用</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>using-superpowers</code></td>
            <td className="py-2 pr-4">路由器，判断当前阶段并触发对应技能</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4"><code>writing-skills</code></td>
            <td className="py-2 pr-4">创建和测试自定义技能，扩展 Superpowers 体系</td>
          </tr>
        </tbody>
      </table>

      {/* ===== 三、code-review 技能详解 ===== */}
      <h2 id="code-review">三、code-review 技能详解</h2>

      <h3>3.1 requesting-code-review</h3>
      <p>
        任务完成后自动调度一个独立的审查子 Agent。审查者不参与实现过程，因此能发现实现者可能忽略的问题。
      </p>
      <p className="mt-2">审查输入：git SHA 范围 + 需求描述 + 实现笔记。审查输出按严重度三级分类：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px] mt-2" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>Critical</strong>：功能缺失、逻辑错误、安全漏洞。阻塞合并。</li>
        <li><strong>Important</strong>：可维护性问题、不一致的命名、缺少边界处理。建议修复后再合并。</li>
        <li><strong>Minor</strong>：格式问题、未使用的 import、可选的性能优化。</li>
      </ul>

      <h3>3.2 receiving-code-review</h3>
      <p>
        审查反馈回来后，这个技能约束 Claude 的回应方式。两条硬规则：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px] mt-2" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>禁止盲从</strong>：收到审查建议后必须先验证代码是否确实需要修改，再决定是否采纳。不允许直接说"你说得对"然后照改。</li>
        <li><strong>YAGNI 优先</strong>：审查者说"可以扩展这个功能支持 X"，但如果当前没有调用方，删除多余代码而非扩展。</li>
      </ul>

      <p className="mt-3">
        两级审查的设计要点在于：<strong>审查者是独立子 Agent</strong>，它不继承主会话的实现过程，因此判断不受实现过程的影响。
        这与在同一个会话中让 Claude "自己审查自己的代码"有本质区别——后者无法消除实现过程中的盲区。
      </p>

      {/* ===== 四、实际使用 ===== */}
      <h2 id="usage">四、实际使用</h2>

      <h3>4.1 触发方式</h3>
      <p>
        Superpowers 的技能按需自动触发，不需要手动调用。当你描述一个任务时，<code>using-superpowers</code> 元技能判断当前阶段并激活对应的子技能。
      </p>
      <p className="mt-2">也可以手动指定：</p>
      <CodeBlock language="bash" code={`# 手动触发头脑风暴
/superpowers:brainstorm

# 手动触发代码审查
/superpowers:request-code-review

# 执行计划
/superpowers:execute-plan`} />

      <h3>4.2 典型工作流</h3>
      <p>一次完整的 Superpowers 开发流程：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>描述需求 → <code>brainstorming</code> 启动，逐层细化，产出设计文档</li>
        <li>设计确认 → <code>writing-plans</code> 将设计拆为微任务列表</li>
        <li>计划确认 → <code>using-git-worktrees</code> 创建隔离分支</li>
        <li>开始实现 → <code>test-driven-development</code> 强制先写测试</li>
        <li>每个微任务 → <code>subagent-driven-development</code> 派发独立子 Agent</li>
        <li>全部完成 → <code>requesting-code-review</code> 两级审查</li>
        <li>审查通过 → <code>finishing-a-development-branch</code> 清理分支，准备合并</li>
      </ol>

      <Collapsible summary="这个流程比普通对话多花多少时间？">
        <p>
          设计+计划阶段比"直接写代码"多花 10-20 分钟。但对于多文件改动、有测试要求、或需要同事审查的项目，
          这部分前置时间通常能被后续减少的返工和审查轮次抵消。
          对于单文件微调或探索性任务，完整流程可能过重——参见下一节的适用场景建议。
        </p>
      </Collapsible>

      {/* ===== 五、与 HUD 的关系 ===== */}
      <h2 id="relation">五、与 HUD 的关系</h2>
      <p>
        <a href="/articles/claude-hud-setup" style={{ color: "var(--color-accent)" }}>Claude HUD</a> 和 Superpowers 互不冲突，解决的是不同层面的问题：
      </p>
      <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>维度</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Claude HUD</th>
            <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Superpowers</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--color-text-secondary)" }}>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4 font-medium" style={{ color: "var(--color-text-primary)" }}>性质</td>
            <td className="py-2 pr-4">可观测性工具</td>
            <td className="py-2 pr-4">工程纪律框架</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4 font-medium" style={{ color: "var(--color-text-primary)" }}>作用</td>
            <td className="py-2 pr-4">让你<strong>看见</strong> Claude 在做什么</td>
            <td className="py-2 pr-4">让 Claude <strong>按规范</strong> 做事</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4 font-medium" style={{ color: "var(--color-text-primary)" }}>显示位置</td>
            <td className="py-2 pr-4">终端输入行下方状态栏</td>
            <td className="py-2 pr-4">不显示——改变 Claude 的行为模式</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
            <td className="py-2 pr-4 font-medium" style={{ color: "var(--color-text-primary)" }}>并行安装</td>
            <td className="py-2 pr-4" colSpan={2}>互不冲突，可同时使用</td>
          </tr>
        </tbody>
      </table>

      <p>
        同时安装时，HUD 的状态行会显示 Superpowers 技能触发的工具活动（如"◐ brainstorming: 细化需求"）和子 Agent 进度。
      </p>

      {/* ===== 六、适用场景 ===== */}
      <h2 id="when">六、适用场景</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>项目特征</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>建议</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">多文件改动、需要测试</td>
              <td className="py-2 pr-4">完整流程收益最大</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">团队协作、需要审查</td>
              <td className="py-2 pr-4">code-review 技能独立审查，减少人工审查负担</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">复杂需求、容易偏离方向</td>
              <td className="py-2 pr-4">brainstorming + writing-plans 锁定需求范围</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">单文件微调、文案修改</td>
              <td className="py-2 pr-4">流程过重，直接用普通对话效率更高</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">探索性原型、未确定方向</td>
              <td className="py-2 pr-4">先用普通对话探索，方向确定后再启用 Superpowers</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 七、验证 ===== */}
      <h2 id="verify">七、验证</h2>
      <p>安装后逐条确认：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>输入 <code>/</code>，能看到 <code>superpowers:brainstorm</code> 等命令</li>
        <li>描述一个开发需求（如"给首页加一个搜索框"），Claude 在动手前先询问设计细节——说明 brainstorming 已触发</li>
        <li>让 Claude 完成一个小改动后，它主动提议进行代码审查——说明 requesting-code-review 已触发</li>
      </ol>

      <FreshnessNote>本文基于 Superpowers（obra/superpowers）官方市场版本验证，写作日期 2026-06-11。Superpowers 是社区维护的开源项目，功能可能随版本变化，以 <a href="https://github.com/obra/superpowers" target="_blank" rel="noopener noreferrer">GitHub 仓库</a> 最新文档为准。</FreshnessNote>
    </div>
  );
}
