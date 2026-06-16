import { CodeBlock } from "@/components/content/code-block";
import { Collapsible } from "@/content/guides/_shared";

export function renderMCPDeepDive() {
  return (
    <div className="wizard-content">
      {/* ===== 开篇 ===== */}
      <h2 id="intro">开篇：MCP 在解决什么问题</h2>
      <p>
        关于 MCP（Model Context Protocol，模型上下文协议），开发者社区中有两种常见看法。一部分人认为 MCP 是重要进展：「MCP 让我们不用再手写胶水代码。」另一部分人觉得它没有新意：「这不就是把获取工具列表封装了一下吗？」
      </p>
      <p>
        这两种看法都有其道理，但也都有局限。在深入之前，需要先明确一点：<strong>MCP 不是让 AI 自动适配任意外部工具的通用方案，也不会自动把已有业务 API 变成 AI 工具。</strong>
      </p>

      <p><strong>MCP 的核心流程：</strong></p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>你对 Claude（Host）说：「查一下生产环境日志。」</li>
        <li>Claude 内置的 MCP Client 通过协议询问外部的 MCP Server：「你有相关资源或工具吗？」</li>
        <li>Server 回复：「我有一个叫 prod_logs 的资源。」</li>
        <li>Claude 提取资源，交给大模型去阅读分析，最后给你回答。</li>
      </ol>
      <p>在这整个过程中，你不需要为 Claude 单独写对接或爬取日志的胶水代码。</p>

      <div className="callout callout-info">
        <strong>如果用硬件打比方</strong>：MCP 提供的是「USB-C 的规范标准」，而不是「万能转换头」。你依然需要编写 MCP Server、定义参数 Schema、处理鉴权和业务逻辑。它的价值在于用一套共同标准，让 AI 开发者在对接外部系统时不再需要各自独立实现。
      </div>

      {/* ===== 一、核心概念 ===== */}
      <h2 id="core-concepts">一、核心概念：MCP 到底在规范什么？</h2>
      <p>
        很多人以为 MCP 只是用来「调接口」的。MCP 定义了<strong>三大核心能力</strong>，它不仅是动作的集合，也是资源与上下文的统管：
      </p>

      <h3>Tools（工具）：赋予模型「行动力」</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>本质</strong>：改变外部世界状态的可执行动作（Actions）。</li>
        <li><strong>特征</strong>：比如 <code>query_db()</code>、<code>restart_server()</code>。Server 必须提供严格的 JSON Schema，告诉大模型这个工具需要什么参数。</li>
      </ul>

      <h3>Resources（资源）：赋予模型「透视眼」</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>本质</strong>：供模型读取的上下文数据。</li>
        <li><strong>特征</strong>：比如 <code>file:///logs/app.log</code> 或 <code>postgres://users/schema</code>。注意：资源获取的具体方式（是通过直接读本地文件、调用内部 API 还是查库）取决于 Server 端的代码实现，MCP 只负责统一定义这些资源的数据结构。<strong>这种只读特性是 MCP 与传统 Plugin 最大的区别之一。</strong></li>
      </ul>

      <h3>Prompts（提示词模板）：赋予模型「规范化思维」</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>本质</strong>：服务端预定义的标准化指令模板。</li>
        <li><strong>特征</strong>：很多 MCP Server 甚至不提供具体的 Tool，只暴露如「企业代码审查标准模板」供宿主拉取，确保模型在特定场景下的输出符合业务规范。</li>
      </ul>

      <Collapsible summary="Tools/Resources/Prompts 具体示例">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-secondary)" }}>以下是各概念的 JSON Schema / 代码实例，展示实际使用时如何定义：</p>
        <p className="text-[14px] mt-3"><strong>Tools（JSON Schema 定义示例）</strong></p>
        <CodeBlock language="json" code={`{
  "name": "query_db",
  "description": "执行 SQL 查询，返回结果集",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "SELECT 语句，禁止 INSERT/UPDATE/DELETE"
      },
      "limit": { "type": "integer", "default": 100, "maximum": 1000 }
    },
    "required": ["query"]
  }
}`} />
        <p className="text-[14px] mt-3"><strong>Resources（URI 模式示例）</strong></p>
        <CodeBlock language="text" code={`# 文件资源 — file:// scheme
file:///var/log/nginx/access.log    → MCP Server 读取并返回日志内容

# 数据库资源 — URI 模版
postgres://db-prod/users/{user_id}/profile → 按 user_id 参数返回用户档案

# 配置资源 — 自定义 scheme
config://app/settings → 返回 JSON 格式的运行时配置`} />
        <p className="text-[14px] mt-3"><strong>Prompts（提示词模板示例）</strong></p>
        <CodeBlock language="json" code={`{
  "name": "code_review_standard",
  "description": "企业代码审查标准模板",
  "arguments": [
    { "name": "language", "description": "编程语言", "required": true }
  ]
}
// 使用效果：Host 拉取模板后，以指定 language 参数填充，
// 模型按模板规范输出审查意见`} />
      </Collapsible>

      {/* ===== 二、运行机制 ===== */}
      <h2 id="mechanism">二、运行机制：组件模型与协作流程</h2>
      <p>
        理解 MCP 需要理清各组件的边界。<strong>智能与执行被分离</strong>：
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>组件</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>职责</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Host（宿主）</strong></td>
              <td className="py-2">比如 Claude Desktop 或 Cursor，负责提供用户界面、会话管理以及最终的执行决策。</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>LLM（大模型）</strong></td>
              <td className="py-2">存在于云端或本地的唯一智能体，负责「理解意图」。</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>MCP Client（客户端）</strong></td>
              <td className="py-2">通常作为 SDK 或中间件直接内嵌在 Host 应用程序内部。<strong>它没有智能</strong>，只负责维护连接、动态发现服务端能力（Discovery）、发送调用请求并接收结果。</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>MCP Server（服务端）</strong></td>
              <td className="py-2">独立运行的轻量级外部程序，暴露出具体的业务能力。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible summary="MCP 消息流：JSON-RPC 请求/响应示例">
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-secondary)" }}>
          MCP 基于 <strong>JSON-RPC 2.0</strong> 协议通信。以下是一次完整工具调用的消息序列：
        </p>
        <p className="text-[14px] mt-3"><strong>1. 初始化握手 (initialize)</strong></p>
        <CodeBlock language="json" code={`// 请求: Client → Server
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": { "name": "Claude Code", "version": "2.0.0" }
  }
}

// 响应: Server → Client
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true },
      "prompts": { "listChanged": true }
    },
    "serverInfo": { "name": "deepseek-mcp-server", "version": "0.6.1" }
  }
}`} />
        <p className="text-[14px] mt-3"><strong>2. 工具发现 (tools/list)</strong></p>
        <CodeBlock language="json" code={`// 请求: Client → Server
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {} }

// 响应: Server → Client
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "chat_completion",
        "description": "调用 DeepSeek 模型进行对话补全",
        "inputSchema": {
          "type": "object",
          "properties": {
            "messages": { "type": "array", "description": "对话消息列表" },
            "model": { "type": "string", "default": "deepseek-v4-flash" }
          },
          "required": ["messages"]
        }
      }
    ]
  }
}`} />
        <p className="text-[14px] mt-3"><strong>3. 工具调用 (tools/call)</strong></p>
        <CodeBlock language="json" code={`// 请求: Client → Server
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "chat_completion",
    "arguments": {
      "messages": [
        { "role": "user", "content": "写一个 Python 冒泡排序" }
      ],
      "model": "deepseek-v4-flash"
    }
  }
}

// 响应: Server → Client
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      { "type": "text", "text": "def bubble_sort(arr):\\n    ..." }
    ]
  }
}`} />
        <p className="text-[14px] mt-2" style={{ color: "var(--color-text-muted)" }}>
          注意：以上是 stdio 传输模式（本地进程间通信）的消息格式。
          SSE 或 HTTP 传输模式下，消息会包装在 HTTP 请求体中，但 JSON-RPC 结构不变。
        </p>
      </Collapsible>

      <div className="callout callout-warning">
        <strong>与 Function Calling 的差异</strong>：Function Calling 是一种生成工具调用请求的机制（让大模型输出结构化的 JSON），最终是否执行、如何执行由 Host 决定并交由 MCP 协议管道调度；MCP 是统管系统交互的开放协议。没有 MCP，你需要为每个模型的 Function Calling 接口重复实现；没有 Function Calling，MCP 管道里就没有可以运输的指令。
      </div>

      <h3 id="mcp-vs-fc">MCP vs Function Calling vs Plugin：三种扩展模式的对比</h3>
      <p>MCP 常被拿来和 OpenAI 的 Function Calling 或 ChatGPT Plugin 比较。以下是三种模式的系统性对比：</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>维度</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>MCP</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>Function Calling</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>Plugin（ChatGPT）</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>制定者</strong></td>
              <td className="py-2 pr-4">Anthropic（开放标准）</td>
              <td className="py-2 pr-4">OpenAI</td>
              <td className="py-2">OpenAI</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>传输层</strong></td>
              <td className="py-2 pr-4">stdio / SSE / WebSocket / HTTP</td>
              <td className="py-2 pr-4">无独立传输—内嵌在 API 请求中</td>
              <td className="py-2">HTTP REST + OpenAPI Schema</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>工具发现</strong></td>
              <td className="py-2 pr-4">动态发现（tools/list, resources/list）</td>
              <td className="py-2 pr-4">手动声明（在 API 请求中指定 tools 数组）</td>
              <td className="py-2">清单文件（ai-plugin.json + OpenAPI）</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>上下文管理</strong></td>
              <td className="py-2 pr-4">Resources 提供只读上下文、Prompts 提供模板</td>
              <td className="py-2 pr-4">依赖用户 prompt 中插入</td>
              <td className="py-2">通过 API 返回值拼接</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>安全模型</strong></td>
              <td className="py-2 pr-4">用户批准（user consent）+ 工具级权限</td>
              <td className="py-2 pr-4">开发者自行实现</td>
              <td className="py-2">OAuth + 用户授权</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>跨 Host</strong></td>
              <td className="py-2 pr-4">一次编写，Claude/Cursor/Windsurf/Gemini CLI 通用</td>
              <td className="py-2 pr-4">各厂商实现不同，需适配</td>
              <td className="py-2">仅 ChatGPT</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>资源/状态</strong></td>
              <td className="py-2 pr-4">Resources（只读上下文）+ 状态持久化</td>
              <td className="py-2 pr-4">无状态（stateless）</td>
              <td className="py-2">通过 API 维护状态</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="transport">传输层：stdio vs SSE vs WebSocket</h3>
      <p>MCP 支持多种传输方式，选择取决于部署场景：</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>传输方式</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>适用场景</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>限制</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>stdio</strong></td>
              <td className="py-2 pr-4">本地 MCP Server，子进程通信。Claude Code 默认</td>
              <td className="py-2">仅本机，无法远程</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>SSE</strong></td>
              <td className="py-2 pr-4">远程 MCP Server，服务器→客户端推送。Cursor/Windsurf 支持</td>
              <td className="py-2">单向推送，客户端请求仍需 HTTP POST</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>Streamable HTTP</strong></td>
              <td className="py-2 pr-4">远程部署，双向通信。MCP 规范 2025 年新增</td>
              <td className="py-2">需要独立 HTTP 服务部署，运维成本增加</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== 三、行业痛点 ===== */}
      <h2 id="pain-points">三、行业痛点：实际使用的两项挑战</h2>
      <p>当机构开始接入 MCP 时，面临的主要困难不在协议本身：</p>

      <h3>上下文爆炸（Context Explosion）与工具选择失效</h3>
      <p>
        这是当前 Agent 架构中一个需要正视的问题。如果把企业内部的 ERP、CRM、GitLab 的几百个工具全挂进 MCP，Client 会在每次对话前将庞大的 Tool List 传给大模型。后果是：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>Token 消耗暴涨</strong></li>
        <li><strong>响应延迟翻倍</strong></li>
        <li><strong>Tool Selection Failure</strong>：由于候选工具过多、描述重叠，大模型挑花眼从而选错工具或产生幻觉</li>
      </ul>
      <p>
        因此，高级工程实践往往会引入 <strong>Tool Router（工具路由）</strong>或<strong>动态加载机制</strong>。
      </p>

      <h3>注册中心（Registry）与合规性（Compliance）</h3>
      <p>
        目前缺乏成熟的统一 MCP 注册中心。机构在将内部数据源暴露给 MCP Server 时，需要自行解决权限隔离、Token 鉴权和访问审计问题。
      </p>

      {/* ===== 四、主流工具接入 ===== */}
      <h2 id="tool-integration">四、主流 AI 工具的 MCP 接入方案指南</h2>

      <h3>Claude Desktop</h3>
      <p>Claude 的桌面端是跑通 MCP 的标准测试环境。</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>核心逻辑</strong>：修改 Claude 内部的 <code>claude_desktop_config.json</code>，让 Claude 在启动时拉起你的脚本。</li>
        <li><strong>传输解耦</strong>：目前阶段它主要强制采用 stdio（标准输入输出）进行本地进程间通信，但随着协议演进，未来 Host 端完全可能支持远程配置。</li>
      </ul>

      <h3>Cursor / Windsurf（IDE 场景）</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>核心逻辑</strong>：IDE 原生内置了 MCP 客户端配置面板。它展现了 MCP 在传输层（Transport）的灵活性：不仅支持本地 command 启动，也支持通过 SSE (Server-Sent Events) 连接远端的 MCP Server。</li>
        <li><strong>适用场景</strong>：将企业内部的代码审查规范以 Resources 形式挂载，或将团队自建的 API 测试沙盒以 Tools 形式注入到程序员的开发助手中。</li>
      </ul>

      {/* ===== 五、落地实战 ===== */}
      <h2 id="implementation">五、落地实战：标准 MCP Server 的开发与排坑</h2>
      <p>以下使用官方最新的 Python SDK（<code>mcp</code> 库）演示基础架构。</p>

      <h3>Server 结构代码（server.py）</h3>
      <CodeBlock language="python" code={`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my_enterprise_tools")

# 1. 暴露 Tool (改变状态/查询外部接口)
@mcp.tool()
def get_user_data(user_id: str) -> str:
    """
    根据用户ID查询内部系统用户状态。
    Args:
        user_id: 标准的员工工号，如 "EMP001"
    """
    return f"User {user_id} is Active."

# 2. 暴露 Resource (提供只读上下文)
@mcp.resource("config://app/settings")
def get_settings() -> str:
    """获取当前系统的核心配置项，供模型分析时参考"""
    # 这里的获取方式可以是读文件、也可以是调API，由开发者决定
    return '{"max_connections": 100, "timeout": 30}'

if __name__ == "__main__":
    mcp.run()`} />

      <h3>常见问题与排查指南</h3>

      <p><strong>痛点 1：Client 提示 &ldquo;Failed to connect&rdquo; 且没有日志</strong></p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>原因</strong>：stdio 通信要求标准输出 (stdout) 不含其他内容。如果代码中有 <code>print(&ldquo;Server started&rdquo;)</code>，这行文本会被混入 MCP 的 JSON RPC 协议流中，导致客户端解析错误。</li>
        <li><strong>解法</strong>：在 Server 代码中，<strong>不使用标准的 print()</strong>。所有日志应重定向到 stderr（标准错误）或外部文件。</li>
      </ul>

      <p><strong>痛点 2：找不到执行环境（Command not found）</strong></p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>原因</strong>：Host 在启动子进程时，并不完全继承你终端里的环境变量。</li>
        <li><strong>解法</strong>：在配置文件中，建议使用解释器或执行程序的<strong>绝对路径</strong>。例如：<code>&ldquo;command&rdquo;: &ldquo;/Users/admin/.pyenv/shims/python&rdquo;</code>。</li>
      </ul>

      <p><strong>痛点 3：工具调用效果差、模型频繁传错参数（Tool Selection Failure）</strong></p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>原因</strong>：Tool Schema 或 Description 定义模糊。例如描述写着「查询数据」，模型无法确定查询对象和字段格式。</li>
        <li><strong>解法</strong>：MCP 的核心是规范。需要详细编写工具注释（包括参数边界、默认值和业务含义）。这些注释会被转化为严格的 Schema 传给大模型，<strong>注释越清晰，调用错误率越低</strong>。</li>
      </ul>

      {/* ===== 快速上手 ===== */}
      <h2 id="quickstart">快速上手</h2>
      <p>
        MCP 的安装步骤和配置方法见 <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>，扩展机制全览见 <a href="/articles/mcp-hook-skill-advanced" style={{ color: "var(--color-accent)" }}>《Claude Code 扩展机制》</a>。
      </p>

      {/* ===== 结语 ===== */}
      <h2 id="conclusion">结语</h2>
      <p>
        <strong>MCP 解决的是标准化接入问题，而不是模型能力问题。</strong>它本身不创造智能。但如果标准被广泛采用，开发者可以不再为每个工具单独编写对接代码，把精力集中到模型优化和业务逻辑上。
      </p>

      <Collapsible summary="备注与免责声明">
        <hr className="my-6" style={{ borderColor: "var(--color-border-subtle)" }} />
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 1</strong>：本文基于 2026 年 6 月 MCP 协议公开规范与各工具当前版本编写。MCP 协议本身处于快速演进阶段，各 Host 应用的具体配置方式可能随版本迭代变更，请以官方最新文档为准。
        </p>
        <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
          <strong>备注 2</strong>：文中所涉代码示例和技术方案仅限个人学习研究用途。企业级部署请遵守所在组织的安全合规要求。
        </p>
      </Collapsible>
    </div>
  );
}
