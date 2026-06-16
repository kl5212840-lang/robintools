import { CodeBlock } from "@/components/content/code-block";
import { Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderSearchResearchFileProcessing() {
  return (
    <div className="wizard-content">
      {/* ===== 一、从聊天到干活 ===== */}
      <h2 id="intro">一、从&ldquo;聊天&rdquo;到&ldquo;干活&rdquo;</h2>
      <p>
        很多人把 Claude Code 当成终端版的 ChatGPT——输入问题、得到答案、复制粘贴到代码编辑器。这没有充分利用 Claude Code 的核心能力：<strong>它可以在本地直接读写文件、运行命令和管理项目，而不仅是返回文本建议</strong>。
      </p>

      <h3>场景速查：搜索 · 抓取 · 文件处理工具选型</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>场景</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>首选方案</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>零配置</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>是否需要 MCP</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>通用搜索</strong></td>
              <td className="py-2 pr-4">内置 WebSearch</td>
              <td className="py-2 pr-4">✅</td>
              <td className="py-2">否</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>深度搜索 / 交叉验证</strong></td>
              <td className="py-2 pr-4">Brave Search MCP / Tavily MCP</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">是</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>最新编程库文档</strong></td>
              <td className="py-2 pr-4">Context7 MCP</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">是</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>聚合多引擎搜索</strong></td>
              <td className="py-2 pr-4">SearXNG（自部署）</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">是</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>静态页面抓取</strong></td>
              <td className="py-2 pr-4">内置 WebFetch</td>
              <td className="py-2 pr-4">✅</td>
              <td className="py-2">否</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>JS 渲染页面 / SPA</strong></td>
              <td className="py-2 pr-4">Chrome DevTools MCP</td>
              <td className="py-2 pr-4">—</td>
              <td className="py-2">是</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>文件处理 / 格式转换</strong></td>
              <td className="py-2 pr-4">Claude Code 内置工具</td>
              <td className="py-2 pr-4">✅</td>
              <td className="py-2">否</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p><strong>本文聚焦三个最高频的实战场景</strong>：搜索调研、网页抓取、文件批处理。每个场景都有完整的配置步骤和可直接使用的 Prompt 模板。</p>

      {/* ===== 二、搜索与调研 ===== */}
      <h2 id="search">二、场景一：深度搜索与调研</h2>

      <h3>Claude Code 的搜索能力层级</h3>
      <p>
        Claude Code 的搜索不是&ldquo;帮你在 Google 上搜一下&rdquo;——它自动完成<strong>搜索 → 阅读 → 交叉验证 → 整理 → 输出</strong>的全流程。
      </p>

      <h4>三类搜索工具</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>工具</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>特点</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>安装</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>搜索方式</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>内置 WebSearch</strong></td>
              <td className="py-2 pr-4">开箱即用，零配置</td>
              <td className="py-2 pr-4">无需安装</td>
              <td className="py-2">Claude 自动发起 web 搜索</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>搜索 MCP</strong></td>
              <td className="py-2 pr-4">更强引擎，更多信息来源</td>
              <td className="py-2 pr-4">编辑 <code>~/.claude/settings.json</code> 的 <code>mcpServers</code> 字段</td>
              <td className="py-2">Brave/Tavily/Perplexity 等专业搜索引擎</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Context7 MCP</strong></td>
              <td className="py-2 pr-4">专查最新版本编程库文档</td>
              <td className="py-2 pr-4">编辑 <code>~/.claude/settings.json</code> 的 <code>mcpServers</code> 字段</td>
              <td className="py-2">直接查询 npm/pip/cargo 等包仓库的最新文档</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>实战：技术选型调研报告</h3>
      <p><strong>场景</strong>：你需要为一个新项目选择 AI Agent 开发框架（LangChain vs CrewAI vs AutoGen vs Claude Agent SDK vs OpenAI Agents SDK），写一份调研报告给团队评审。</p>
      <p><strong>传统方式耗时</strong>：2–3 小时（手动 Google → 打开 20+ 网页 → 阅读 → 手动整理表格）</p>
      <p><strong>Claude Code 方式</strong>——在终端输入：</p>
      <CodeBlock language="text" code={`帮我深度调研 2026 年主流的 AI Agent 开发框架，包括：
1. LangChain、CrewAI、AutoGen、Claude Agent SDK、OpenAI Agents SDK
2. 每个框架的核心理念、优劣势、适合场景
3. GitHub Star 数和社区活跃度（最近 6 个月趋势）
4. 给出你的推荐：适合个人开发者 vs 企业团队

具体要求：
- 整理成 Markdown 表格
- 每条关键信息标注来源链接
- 保存到 research/agent-frameworks-report.md
- 最后用一段话总结你的推荐理由`} />

      <p><strong>Claude Code 会自动做什么</strong>：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>并行搜索</strong>：同时搜索 5 个框架的最新信息（如果配了 SubAgent 会自动并行）</li>
        <li><strong>交叉验证</strong>：对于 GitHub Star 数这种关键数据，从多个来源确认</li>
        <li><strong>自动整理</strong>：生成结构化对比表格</li>
        <li><strong>标注来源</strong>：每条信息的原始链接都会保留</li>
        <li><strong>保存文件</strong>：自动创建 <code>research/</code> 目录并写入报告</li>
      </ol>
      <p><strong>预计耗时</strong>：5–10 分钟</p>

      <Collapsible summary="搜索调研输出示例：框架对比报告节选">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-muted)" }}>以下为 Claude Code 实际生成的调研报告片段（简化后）：</p>
        <CodeBlock language="markdown" code={`## AI Agent 框架对比报告 (2026-06)

| 框架 | GitHub Stars | 核心理念 | 最适合 | 学习曲线 |
|------|------------|---------|--------|---------|
| LangChain | 108k | 链式调用 + Agent 编排 | 企业级 RAG 应用 | 较陡 |
| CrewAI | 28k | 多 Agent 角色扮演协作 | 复杂工作流 | 中等 |
| AutoGen | 42k | 微软出品，对话驱动 | .NET 生态/微软用户 | 中等 |
| Claude Agent SDK | 18k | 原生 MCP + 工具扩展 | Claude 深度用户 | 较低 |
| OpenAI Agents SDK | 25k | 轻量 Agent 循环 | 快速原型 | 较低 |

## 推荐

- **个人开发者** → OpenAI Agents SDK（轻量、免费额度大）
- **企业团队** → LangChain（生态最全、生产案例最多）
- **Claude 用户** → Claude Agent SDK（原生 MCP，零切换成本）

> 数据来源标注在各条目原始链接中，此处省略。`} />
      </Collapsible>

      <h3>关键技巧：让搜索更精准</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>技巧</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>示例</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>明确输出格式</strong></td>
              <td className="py-2">&ldquo;整理成表格&rdquo;、&ldquo;输出为 Markdown&rdquo;、&ldquo;用 JSON 格式&rdquo;</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>指定保存路径</strong></td>
              <td className="py-2">&ldquo;保存到 research/xxx.md&rdquo;，Claude 会自动创建目录</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>要求标注来源</strong></td>
              <td className="py-2">&ldquo;每条数据标注来源链接&rdquo;、&ldquo;标注引用出处&rdquo;</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>指定对比维度</strong></td>
              <td className="py-2">&ldquo;从性能、生态、学习成本、价格四个维度对比&rdquo;</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>迭代深入</strong></td>
              <td className="py-2">看完初步结果后继续追问细节</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>善用并行</strong></td>
              <td className="py-2">&ldquo;帮我同时调研 A 和 B&rdquo;——Claude 自动启用 SubAgent</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>限定数据源</strong></td>
              <td className="py-2">价格等易变动信息建议指定：&ldquo;优先以各品牌官网实时定价页面为准&rdquo;</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 三、网页抓取 ===== */}
      <h2 id="scraping">三、场景二：网页内容抓取</h2>

      <div className="callout callout-danger">
        <strong>⚠️ 法律合规提醒</strong>：网页抓取功能仅限个人学习研究使用。使用前请遵守目标网站的 <code>robots.txt</code> 协议和相关版权声明。严禁恶意高频爬取、绕过反爬机制抓取付费内容、或将抓取内容用于商业再分发。违规使用可能导致法律风险。
      </div>

      <h3>三种抓取方案</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>方案</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>工具</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>原理</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>稳定性</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>适用场景</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>安装</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>A</strong></td>
              <td className="py-2 pr-4">内置 WebFetch</td>
              <td className="py-2 pr-4">HTTP 请求 → 转 Markdown</td>
              <td className="py-2 pr-4">★★★</td>
              <td className="py-2 pr-4">静态页面、博客、文档站</td>
              <td className="py-2">无需安装</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>B</strong></td>
              <td className="py-2 pr-4">Chrome DevTools MCP</td>
              <td className="py-2 pr-4">连接本地 Chrome 浏览器</td>
              <td className="py-2 pr-4">★★★★★</td>
              <td className="py-2 pr-4">JS 渲染页面、需登录页面、SPA</td>
              <td className="py-2"><code>npx</code> 安装</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>C</strong></td>
              <td className="py-2 pr-4">agent-browser</td>
              <td className="py-2 pr-4">独立无头浏览器</td>
              <td className="py-2 pr-4">★★☆</td>
              <td className="py-2 pr-4">需隔离环境</td>
              <td className="py-2">需额外安装</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>内置 WebFetch 的限制</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>大小限制</strong>：单个页面的抓取有内容大小上限，超长页面可能无法完整抓取，只返回前段内容</li>
        <li><strong>频次限制</strong>：短时间内连续发起大量 WebFetch 请求可能触发速率限制</li>
        <li><strong>JS 渲染不完整</strong>：对于完全依赖客户端 JS 渲染的 SPA 页面，WebFetch 可能抓取不到实际内容——此时应改用 Chrome DevTools MCP</li>
      </ul>

      <h3>Chrome DevTools MCP 的环境要求</h3>
      <div className="callout callout-warning">
        <strong>必须是原版 Google Chrome</strong>（正式版或 Beta 版均可）。绿色便携版、修改版、部分国产浏览器的 Chromium 内核版本可能因调试端口未开放而无法挂载。首次使用需在 Chrome 中开启远程调试端口。
      </div>

      <Collapsible summary="Chrome DevTools MCP 安装与配置">
        <p className="text-[14px] mt-2">安装：</p>
        <CodeBlock language="bash" code={`npm install -g @anthropic/mcp-server-chrome-devtools`} />
        <p className="text-[14px] mt-2">Claude Code 配置（<code>settings.json</code>）：</p>
        <CodeBlock language="json" code={`{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-chrome-devtools"],
      "env": {
        "CHROME_DEBUG_PORT": "9222"
      }
    }
  }
}`} />
        <p className="text-[14px] mt-2">启动 Chrome 时开启调试端口：</p>
        <CodeBlock language="bash" code={`# Windows
"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222

# macOS
/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222`} />
        <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          注意：Chrome DevTools MCP 需要原版 Chrome 在调试模式下运行。启动后 Chrome 会提示"浏览器正在被自动化软件控制"——这是正常状态。
        </p>
      </Collapsible>

      <h3>方案选择指南</h3>
      <CodeBlock language="text" code={`你要抓取的页面是哪种？

├─ 普通静态页面 → 方案 A（WebFetch）足够了
│   ⚠️ 超大页面可能抓取不全
│
├─ JavaScript 渲染页面（React/Vue SPA）→ 方案 B
│   ⚠️ 必须是原版 Chrome，绿色便携版无效
│
├─ 需要登录后查看的页面 → 方案 B
│   Claude 可以操作你已经登录的浏览器
│
└─ 需要隔离 → 方案 C（agent-browser）`} />

      <h3>实战：批量提取技术文档</h3>
      <p><strong>场景</strong>：把 React Hook Form 的完整 API 文档提取出来，保存为本地 Markdown。</p>
      <CodeBlock language="text" code={`请抓取 React Hook Form 的官方 API 文档：
1. 从 https://react-hook-form.com/api/useform 开始
2. 依次抓取 useForm、useController、useFieldArray、useWatch
   四个主要 Hook 的文档
3. 每个 Hook 提取：函数签名、参数说明、返回值类型、代码示例
4. 整合为一份 Markdown 文件，保存到 docs/react-hook-form-api.md`} />

      {/* ===== 四、文件批处理 ===== */}
      <h2 id="files">四、场景三：文件批处理</h2>

      <h3>Claude Code 能处理的文件操作</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>整理文件夹</strong>：按文件类型、修改日期、大小等维度自动归类</li>
        <li><strong>批量重命名</strong>：按规则一次性重命名大量文件</li>
        <li><strong>格式转换</strong>：JSON ↔ YAML ↔ CSV ↔ Markdown ↔ SQL</li>
        <li><strong>数据提取</strong>：从 Excel/CSV 中提取特定字段并转为结构化数据</li>
        <li><strong>文件内容分析</strong>：统计、查找、替换、去重</li>
      </ul>

      <h3>文件处理的能力边界</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>加密文件</strong>：受密码保护的压缩包、加密的 PDF、加密的 ZIP/RAR 等无法解析</li>
        <li><strong>权限锁定文件</strong>：被操作系统或其他程序独占锁定的文件无法操作</li>
        <li><strong>超大文件</strong>：超过 100MB 的单个文件建议先手动分片后再处理</li>
      </ul>

      <h3>实战：整理混乱的项目目录</h3>
      <CodeBlock language="text" code={`帮我整理 downloads/ 文件夹：
1. 按文件类型分类到子文件夹：
   images/、documents/、code/、archives/、other/
2. 对于 images/，按月份再细分
   （读取 EXIF 中的拍摄日期，没有 EXIF 按文件修改时间）
3. 对于 documents/，PDF 一类、Office 文档一类、其他一类
4. 整理前先列出操作计划让我确认，不要直接移动文件`} />

      <h3>实战：数据提取与格式转换</h3>
      <CodeBlock language="text" code={`读取 feedback.xlsx 文件：
1. 提取"评分"列 ≤ 2 的所有行（负面反馈）
2. 按"分类"列分组
3. 每组输出：分类名、数量、具体反馈列表
4. 保存为 JSON 文件：data/negative-feedback.json`} />

      <h3>文件处理的安全提醒</h3>
      <div className="callout callout-danger">
        <strong>⚠️ 操作安全提示</strong>：
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>让 Claude Code 执行<strong>批量删除、移动、覆盖</strong>等操作前，建议先对目标目录做一次完整备份</li>
          <li>在操作项目源码、系统配置文件、数据库文件等关键数据时，建议让 Claude <strong>先列出计划让你确认</strong>，不要直接让它执行</li>
          <li>&ldquo;清理&rdquo;、&ldquo;整理&rdquo;、&ldquo;归类&rdquo;这类指令存在歧义——Claude 对&ldquo;无用文件&rdquo;的判断可能与你的预期不同。始终使用两步法：① 列出计划 → ② 确认后执行</li>
          <li>绝对不要用模糊指令让 Claude 操作系统目录（如 <code>C:\Windows</code>、<code>/etc</code>、<code>/usr</code> 等）</li>
        </ul>
      </div>

      {/* ===== 五、竞品分析 ===== */}
      <h2 id="competitive">五、场景四：竞品分析与产品调研</h2>

      <h3>实战：AI 编程工具选型对比</h3>
      <CodeBlock language="text" code={`帮我调研 2026 年主流的 AI 编程工具
（Cursor、Windsurf、Claude Code、GitHub Copilot），从以下维度对比：

1. 定价（免费版限制、付费套餐价格）
   —— 优先以各品牌官网定价页面实时数据为准
2. 支持的底层模型（可以用哪些大模型）
3. 核心特色功能（每个工具独有的卖点）
4. IDE 支持（独立 IDE 还是插件？支持哪些 IDE？）
5. 适合什么人群

整理成 Markdown 对比表格，每条价格信息标注来源和更新时间。
保存到 research/ai-coding-tools-comparison-2026.md`} />

      <div className="callout callout-info">
        <strong>价格数据提示</strong>：大模型工具的价格变动频繁，建议在 prompt 中强调&ldquo;优先以各品牌官网定价页面实时数据为准&rdquo;而非依赖搜索引擎缓存的旧页面，以确保价格数据的时效性。
      </div>

      <h2 id="efficiency">六、效率提升参考</h2>
      <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>以下数据为常规规模任务在正常网络条件下的实测参考，实际耗时取决于任务复杂度、网络速度和 MCP 配置情况。</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>任务</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>传统方式耗时</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Claude Code 耗时</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>主要收益</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">5 个框架的技术选型调研</td>
              <td className="py-2 pr-4">2–3 小时</td>
              <td className="py-2 pr-4">5–10 分钟</td>
              <td className="py-2">无需手动打开 20+ 页面、自动标注来源</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">50 页技术文档提取整理</td>
              <td className="py-2 pr-4">1–2 小时</td>
              <td className="py-2 pr-4">3–5 分钟</td>
              <td className="py-2">自动抓取 + 结构化输出，无需逐页复制</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">200 个文件整理归类</td>
              <td className="py-2 pr-4">30–60 分钟</td>
              <td className="py-2 pr-4">2–3 分钟</td>
              <td className="py-2">批量操作，避免人工重复</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">竞品分析（5 款产品 × 6 维度）</td>
              <td className="py-2 pr-4">3–4 小时</td>
              <td className="py-2 pr-4">10–15 分钟</td>
              <td className="py-2">自动搜索 + 并行对比 + 生成表格</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout callout-info">
        <strong>数据说明</strong>：以上耗时数据为常规规模任务在正常网络条件下的实测参考。实际耗时取决于任务复杂度、网络速度、MCP 工具配置情况以及所使用模型版本。Claude Code 的优势主要在快速理解和小型操作，对 I/O 密集型的大型文件任务提升有限。
      </div>

      <Collapsible summary="新手常犯的 5 个错误">
      <p><strong>错误 1：Prompt 太模糊</strong></p>
      <p>❌ &ldquo;帮我调研一下 AI Agent 框架&rdquo;</p>
      <p>✅ &ldquo;帮我对比 LangChain、CrewAI、AutoGen、Claude Agent SDK、OpenAI Agents SDK 从核心理念、GitHub Star 数、适合场景三个维度进行对比，整理成表格，保存到 research/agent-frameworks.md&rdquo;</p>
      <p><strong>关键</strong>：告诉 Claude 你要什么格式、保存在哪里。</p>

      <p><strong>错误 2：不让 Claude 读项目代码</strong></p>
      <p>Claude Code 的最大优势是能<strong>自动读取你的项目代码</strong>。在 prompt 中引用项目中已有的文件路径和风格参考。</p>

      <p><strong>错误 3：一次性任务太复杂</strong></p>
      <p>一个 prompt 包含 10 个子任务会造成 Claude 的注意力分散。拆成 2–3 个子任务，每步确认后再继续。</p>

      <p><strong>错误 4：不保存结果到文件</strong></p>
      <p>Claude Code 的对话历史会随会话结束而消失。<strong>任何有价值的内容都应该保存到文件</strong>。每次都加上 <code>&ldquo;保存到 docs/xxx.md&rdquo;</code>。</p>

      <p><strong>错误 5：不安装搜索 MCP</strong></p>
      <p>内置 WebSearch 能用，但搜索 MCP（Brave Search + Tavily）在搜索质量和专业性上有提升。安装完成后，后续调研可复用该基础设施。</p>
      </Collapsible>
      <h2 id="path">七、使用建议</h2>
      <CodeBlock language="text" code={`第 1 步（立即）：
  用内置 WebSearch 试一次技术调研

第 2 步（今天）：
  安装 Brave Search MCP + Tavily MCP（共 5 分钟）

第 3 步（本周）：
  尝试文件批处理——整理一个杂乱的文件夹或提取 Excel 数据
  ⚠️ 操作前做好备份！

第 4 步（下周）：
  安装 Chrome DevTools MCP（如需抓取 JS 渲染页面）
  注意：需要原版 Chrome，绿色便携版不兼容
  尝试一次竞品分析，生成完整的调研报告`} />

      {/* ===== 八、总结 ===== */}
      <h2 id="summary">八、总结</h2>
      <p>Claude Code 的主要用途不是&ldquo;能聊天&rdquo;，而在于 <strong>&ldquo;能执行操作&rdquo;</strong>：</p>
      <ul className="list-disc pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>搜索调研</strong>：不用再手动 Google → 打开 20 个 tab → 复制粘贴。一次描述完成全流程</li>
        <li><strong>网页抓取</strong>：静态页面用内置 WebFetch（注意大小和频次限制），JS 页面用 Chrome DevTools MCP（需原版 Chrome）。建议遵守 robots.txt 和版权法规</li>
        <li><strong>文件处理</strong>：直接在项目中创建、修改、整理文件，结果是可直接使用的文件而非建议。删除和迁移操作前先备份</li>
      </ul>
      <p>这三个场景覆盖了开发者日常工作中相当比例的重复性操作。掌握它们，你可以把更多时间花在需要判断力的任务上。</p>

      <div className="callout callout-info">
        <strong>相关阅读</strong>：
        搭建私有搜索引擎做交叉验证 → <a href="/articles/searxng-doc-review-workflow" style={{ color: "var(--color-accent)" }}>《SearXNG 本地部署与 MCP 接入》</a>；
        扩展机制全览（MCP、Hook、Skill、SubAgent） → <a href="/articles/mcp-hook-skill-advanced" style={{ color: "var(--color-accent)" }}>《Claude Code 扩展机制》</a>；
        MCP 架构深度讲解 → <a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP》</a>。
      </div>

      <Collapsible summary="备注与免责声明">
        <hr className="my-6" style={{ borderColor: "var(--color-border-subtle)" }} />
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 1</strong>：本文中的 Prompt 模板基于 Claude Code v2.x 版本测试通过。MCP 服务器的可用性、免费额度以及内置 WebFetch 的功能限制均可能随 Claude Code 版本迭代而变更，实际操作请以官方最新文档为准。
        </p>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 2</strong>：文中所涉方案（网页抓取、文件批处理等）仅限个人学习研究用途。如需商用，请遵守中华人民共和国相关法律法规、目标网站的 robots.txt 协议以及各平台 API 服务协议中的商用条款。
        </p>
      </Collapsible>

      <FreshnessNote>基于 Claude Code v2.x 验证，写作日期 2026-06-12。</FreshnessNote>
    </div>
  );
}
