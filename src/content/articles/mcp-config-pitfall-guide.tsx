import { CodeBlock } from "@/components/content/code-block";
import { Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderMCPConfigPitfallGuide() {
  return (
    <div className="wizard-content">
      {/* ===== 开篇 ===== */}
      <h2 id="intro">开篇：MCP 配置后如何生效的</h2>
      <p>
        在 Claude Code 中配置 MCP 服务器，表面上是编辑一个 JSON 文件，实际上涉及
        <strong>多层配置缓存、多文件优先级、一个已知 Bug、两种参数传递路径</strong>。
        任何一个环节出问题，结果都是同一个症状：MCP 工具调用失败但日志不告诉你为什么。
      </p>
      <p>
        本文以 Windows 环境下实际排错过程为基础，梳理 MCP 配置的全部易错点。
        <strong>macOS / Linux 用户大部分问题不适用</strong>——你们可以用官方 <code>claude mcp add</code> 命令直接搞定，
        但 backups 缓存的问题同样值得了解。
      </p>


      <Collapsible summary="AI 代劳">
        <div className="callout callout-info">
          本文包含的命令和配置均可交由 AI 编程工具（Claude Code、Codex CLI、Cursor 等）代劳——选取需要的部分发送即可。详见{" "}
          <a href="/articles/ai-pair-workflow" style={{ color: "var(--color-accent)" }}>「阅读本站前」</a>。
        </div>
      </Collapsible>

      {/* ===== 一、你应该用哪种方法？ ===== */}
      <h2 id="quick-decision">一、你应该用哪种方法？（快速决策）</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>你的平台</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>首选方法</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>理由</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>Windows</strong></td>
              <td className="py-2 pr-4"><code>claude mcp add</code> + <code>--env</code> + <code>cmd /c</code></td>
              <td className="py-2">官方 CLI 方法，env 变量通过项目级 <code>.claude.json</code> 传递</td>
            </tr>
            <tr>
              <td className="py-2 pr-4"><strong>macOS / Linux</strong></td>
              <td className="py-2 pr-4"><code>claude mcp add --env</code></td>
              <td className="py-2">官方命令，自动管理配置位置，env 注入稳定</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>🟢 Windows：claude mcp add（官方推荐）</h3>
      <p>
        <strong>不要手动编辑任何 JSON 文件。</strong> 使用 Claude Code 自带的 <code>claude mcp add</code> 命令：
      </p>
      <CodeBlock mode="unified" language="bash" code={`# Windows — 添加 MCP 服务器，配置写入 .claude.json（项目级）\nclaude mcp add 你的MCP名称 --env 变量名=值 -- cmd /c "npx -y 你的MCP包"`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        这个命令会自动将 MCP 配置写入项目级的 <code>.claude.json</code>，<code>--env</code> 通过 <code>env</code> 字段传环境变量。
        <strong>但有一个已知问题</strong>：<code>claude mcp add</code> 在 Windows 上会把 <code>/c</code> 误解析为路径 <code>C:/</code>。
        这是因为 Git for Windows 自带的 MSYS2/Cygwin 环境会把 POSIX 风格的 <code>/c</code> 自动转换为 Windows 路径 <code>C:/</code>——
        Claude Code 在 Windows 上的子进程通过 Git Bash 执行命令时触发此解析。添加后用 <code>claude mcp list</code> 或直接查看
        <code>.claude.json</code>，确认 <code>args</code> 中第一个元素是 <code>"/c"</code> 而不是 <code>"C:/"</code>。
        如果被截断了，手动编辑 <code>.claude.json</code> 改回来即可——只此一步，不需要反复摸索。
      </p>


      <Collapsible summary=".claude.json vs mcp.json 优先级说明">
        <div className="callout callout-info">
          <strong>.claude.json vs mcp.json — 以前不知道的坑</strong>：
          <code>claude mcp add</code> 写入的是 <strong>.claude.json 中当前项目对应的 mcpServers</strong>，
          而手动编辑 <code>~/.claude/mcp.json</code> 写入的是全局用户级。当两者同时存在同名条目时，
          <strong>.claude.json 中的项目级配置会覆盖 mcp.json</strong>。这就是为什么"我明明改对了 mcp.json，为什么还是不生效"——
          你改的是全局文件，但 Claude Code 读的是项目级覆盖。
          <strong>统一用 claude mcp add 管理，不要混用两种方式。</strong>
        </div>
      </Collapsible>

      <Collapsible summary="SearXNG 完整配置示例">
      <p>以下是添加 SearXNG 的完整命令和最终配置（将 <code>/path/to/your-project</code> 替换为你的实际项目路径）：</p>
      <CodeBlock mode="unified" language="bash" code={`# 在项目目录中执行（cd 到项目根目录后再跑 claude）\nclaude mcp add searxng --env SEARXNG_URL=http://localhost:8080 -- cmd /c "npx -y mcp-searxng"\n# 然后检查 .claude.json 中 args[0] 是否为 "/c"（不是 "C:/"）`} />
      <CodeBlock mode="unified" language="json" code={`// .claude.json → projects → "你的项目路径" → mcpServers\n"searxng": {\n  "type": "stdio",\n  "command": "cmd",\n  "args": ["/c", "npx -y mcp-searxng"],\n  "env": { "SEARXNG_URL": "http://localhost:8080" }\n}`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        验证方式：Docker 容器内 <code>curl localhost:8080/search?q=test&format=json</code> 返回 200 表示 SearXNG 正常，
        Claude Code 中调用搜索工具返回结果表示 MCP 配置成功。
        <strong>如果只看到 <code>MCP error -32603: Invalid URL</code>，不要慌——先检查 curl 是否通，再检查 config 中 args[0] 是不是 <code>"/c"</code>。</strong>
      </p>
      </Collapsible>

      <h3>🟢 macOS / Linux：claude mcp add --env</h3>
      <CodeBlock mode="unified" language="bash" code={`# 添加 MCP 服务器（自动写入正确位置）\nclaude mcp add brave-search --transport stdio --env BRAVE_API_KEY=你的Key -- npx -y @anthropic/mcp-server-brave-search\n\n# 查看已配置的 MCP\nclaude mcp list\n\n# 删除\nclaude mcp remove brave-search`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        原理：<code>claude mcp add</code> 是官方提供的 CLI 管理命令，自动将配置写入 <code>.claude.json</code> 的正确位置。
        macOS/Linux 上 <code>--env</code> 参数会稳定注入环境变量到 MCP 进程。
        <strong>不需要手动编辑任何 JSON 文件。</strong>
      </p>

      {/* ===== 二、其他配置方法（了解即可，不要首选使用） ===== */}
      <h2 id="alternative-methods">二、其他配置方法</h2>
      <p>
        以下方法在某些场景下可以用，但<strong>各有前提条件或平台限制</strong>。
        每个方法结尾标注了可用性——对照标签决定是否使用。
      </p>

      <h3>⚠️ 备选：node 直调 + --api-key（前提：包支持 CLI 参数）</h3>
      <p>
        绕过 npx 和 env 字段，用 <code>node</code> 直接运行包的入口文件，通过命令行参数传配置。
        命令行参数由操作系统保证传递给子进程，不依赖 Claude Code 的任何机制。
      </p>
      <CodeBlock mode="unified" language="json" code={`// 示例：volcengine-seedream-img-mcp（支持 --api-key 参数）
{
  "mcpServers": {
    "doubao-image": {
      "command": "node",
      "args": [
        "C:\\Users\\<your-user>\\AppData\\Roaming\\npm\\node_modules\\volcengine-seedream-img-mcp\\dist\\index.js",
        "--api-key",
        "你的Key"
      ]
    }
  }
}`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        <strong>前提：</strong>① 全局安装了这个包（<code>npm install -g</code>）；
        ② 知道包的入口文件路径（<code>npm root -g</code> 查看）；
        ③ 包支持 CLI 参数——像 <code>mcp-searxng</code> 只读环境变量的包，这个方法对它就无效。
      </p>
      <div className="callout callout-warning">
        <strong>⚠️ 适用条件</strong>：MCP 包支持 <code>--api-key</code> 等 CLI 参数的场景。不满足前提条件时请回到第一节的首选方案。
      </div>

      <h3>⚠️ 备选：手动编辑 .mcp.json + env 字段（仅 macOS/Linux）</h3>
      <p>
        macOS/Linux 用户可以手动编辑项目根目录的 <code>.mcp.json</code>，利用 <code>env</code> 字段传环境变量。
        Unix 系统上 env 注入较为稳定。这个文件可以加入 Git，团队共享。
      </p>
      <CodeBlock mode="unified" language="json" code={`// 仅 macOS/Linux — 项目根目录 ./.mcp.json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "你的Key"
      }
    }
  }
}`} />
      <div className="callout callout-warning">
        <strong>⚠️ 仅 macOS/Linux</strong>：Windows 用户不要用这个方案——<code>env</code> 字段在 Windows 上存在已知 Bug，详见下一节。
        macOS/Linux 用户注意：<code>.mcp.json</code> 是项目级配置，<code>~/.claude/mcp.json</code> 是全局配置。
      </div>

      <h3>⚠️ 仅限旧版备份：手动编辑 mcp.json + cmd /c set（fallback 方案）</h3>
      <p>
        如果因某些原因不能使用 <code>claude mcp add</code>，可以手动编辑 <code>~/.claude/mcp.json</code>，
        用 <code>cmd /c set</code> 在独立进程中传递环境变量。这是旧版推荐方案，仍然有效。
        <strong>但要注意：如果 .claude.json 中有同名条目，mcp.json 会被覆盖，改了也不生效。</strong>
      </p>
      <CodeBlock mode="unified" language="json" code={`// ~/.claude/mcp.json — 手动维护，注意不要与 .claude.json 冲突
{
  "mcpServers": {
    "brave-search": {
      "command": "cmd",
      "args": ["/c", "set BRAVE_API_KEY=你的Key && npx -y @anthropic/mcp-server-brave-search"]
    }
  }
}`} />
      <div className="callout callout-warning">
        <strong>⚠️ 先检查 .claude.json</strong>：手动编辑 mcp.json 之前，执行 <code>grep "mcpServers\|你的MCP名" ~/.claude.json</code>
        确认没有同名残留条目。如果有，删掉它，否则 mcp.json 里改再多也不会生效。
      </div>

      {/* ===== 三、backups 幽灵缓存 ===== */}
      <h2 id="backups-cache">三、配置修改后为什么不生效？—— backups 幽灵缓存</h2>
      <p>
        直觉中，改 <code>mcp.json</code> → 重启 Claude Code → 配置生效。但有一个
        <strong>官方文档从未提及的缓存机制</strong>经常破坏这个假设：
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>实际加载顺序</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>来源</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>性质</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>先读</strong></td>
              <td className="py-2 pr-4"><code>~/.claude/backups/*.backup.*</code></td>
              <td className="py-2" style={{ color: "var(--color-warning)" }}>⚠️ Bug 行为——会话恢复时自动还原旧配置</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>再读</strong></td>
              <td className="py-2 pr-4"><code>~/.claude.json</code> 中残留的 mcpServers</td>
              <td className="py-2" style={{ color: "var(--color-warning)" }}>⚠️ 旧版残留——如果同名服务器存在，覆盖 mcp.json</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4"><strong>最后读</strong></td>
              <td className="py-2 pr-4"><code>~/.claude/mcp.json</code> / <code>.mcp.json</code></td>
              <td className="py-2" style={{ color: "var(--color-text-secondary)" }}>你手动编辑的文件（但可能被上面两层覆盖）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout callout-danger">
        <strong>总结</strong>：backups 劫持配置是 <strong>Bug 行为，不是设计如此</strong>。
        官方 MCP 文档没有提到 backups 是配置来源。这个行为只在 Windows + 强制杀进程组合下容易触发——
        <code>taskkill /f</code> 强制终止 claude.exe 时，磁盘上的备份文件未正常清理，下次启动时被优先恢复。
      </div>

      <h3>如何知道配置被缓存劫持了？</h3>
      <p>检查进程链——MCP 进程收到的实际命令行参数：</p>
      <CodeBlock language="powershell" code={`# Windows — 查看 MCP 进程及其父进程链
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like '*你的MCP包名*' } |
  Select-Object ProcessId, ParentProcessId, CommandLine |
  Format-Table -AutoSize -Wrap`} />
      <CodeBlock language="bash" code={`# macOS / Linux
ps aux | grep -E '你的MCP包名' | grep -v grep`} />
      <p>
        如果进程命令行是 <code>npx -y 某个包</code> 而你写的是 <code>"command": "node"</code>，
        说明缓存未清理，旧配置仍在生效。<strong>进程是真实的——命令行的结果能反映出进程真实的逻辑链路。</strong>
      </p>

      <h3>如何清理</h3>
      <CodeBlock mode="unified" language="bash" code={`# 1. 修改 mcp.json 为正确配置
# 2. 删除 backups 缓存（Windows PowerShell）：
Remove-Item ~/.claude/backups/*.backup.*
# 3. 检查 ~/.claude.json 中无残留同名 mcpServers 条目
# 4. 彻底杀进程：
taskkill /f /im claude.exe      # Windows
pkill -f claude                 # macOS / Linux
# 5. 重新打开 Claude Code`} />

      <div className="callout callout-info">
        <strong>预防</strong>：不要用 <code>taskkill /f</code> 或 <code>kill -9</code> 强制终止 Claude Code。
        正常退出（<code>/exit</code> 或 <code>Ctrl+C</code>）时 backups 会被正确清理。
      </div>

      {/* ===== 四、其他隐性污染源 ===== */}
      <h2 id="hidden-pollution">四、其他隐性污染源</h2>

      <h3>1. Windows 用户级环境变量（注册表 HKCU\Environment）</h3>
      <p>
        当 MCP 报认证失败但 curl 直测 Key 有效时，排查往往停留在 shell profile（.bashrc / .zshrc），
        但这些文件往往是干净的。真正的污染源可能在 Windows 注册表：
      </p>
      <CodeBlock language="powershell" code={`# 检查 Windows 用户级环境变量
[Environment]::GetEnvironmentVariable('ARK_API_KEY', 'User')
# 如果返回旧 Key → 这就是污染源
# 清除：
[Environment]::SetEnvironmentVariable('ARK_API_KEY', $null, 'User')`} />
      <p>
        Windows 用户级环境变量存储在 <code>HKCU\Environment</code>，任何新启动的进程都会自动继承。
        <code>env | grep</code> 只能告诉你环境中有这个变量，不能告诉你它来自 shell profile 还是注册表。
      </p>

      <h3>2. bash wrapper 在 Windows 下 $HOME 解析异常</h3>
      <p>
        如果 MCP 用 bash 脚本启动，脚本内通过 <code>$HOME</code> 读取 Key 文件，
        MCP 进程 fork 时的 <code>$HOME</code> 可能与交互式 shell 不同，导致读不到文件或读到空值。
        <strong>原则：每多一层中间件就多一个故障点。</strong>
      </p>

      <h3>3. npx 吞掉 --api-key 参数</h3>
      <p>
        在 Windows 上，npx 通过 <code>cmd.exe</code> 包装启动，可能不把 <code>--api-key</code> 转发给下游 node 进程。
        验证方法同样是查看进程链——node 子进程的命令行中没有 <code>--api-key</code>，说明参数被中间层截断了。
        <code>node</code> 直调方案绕过了这个问题。
      </p>

      {/* ===== 五、诊断命令 ===== */}
      <h2 id="diagnosis">五、诊断命令速查</h2>
      <p>当 MCP 配置出现问题、工具调用报错时，按以下顺序执行。每一步都有可能直接定位到根因：</p>

      <CodeBlock mode="unified" language="powershell" code={`# === Windows 诊断 ===

# 1. 查看 MCP 进程链和完整命令行（优先排查）
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like '*你的MCP包名*' } |
  Select-Object ProcessId, ParentProcessId, CommandLine |
  Format-Table -AutoSize -Wrap

# 2. ⚠️ 检查 backups 是否缓存了旧配置（这步绝对不能跳过）
grep -l "mcpServers\|你的MCP包名" ~/.claude/backups/* 2>/dev/null

# 3. 检查 ~/.claude.json 是否残留旧 mcpServers
grep "mcpServers\|你的MCP包名" ~/.claude.json

# 4. 确认 mcp.json 内容
cat ~/.claude/mcp.json

# 5. 检查 Windows 用户级环境变量
[Environment]::GetEnvironmentVariable('SECRET_KEY', 'User')

# 6. 用 claude mcp list 查看 Claude Code 实际加载的配置
claude mcp list

# 7. curl 直测 Key 有效性（替换为你的 API 地址和 Key）
curl -s -w "\\nHTTP:%{http_code}" -X POST "https://你的API地址" \\
  -H "Authorization: Bearer 你的Key"`} />

      <div className="callout callout-warning">
        <strong>Windows 注意</strong>：诊断命令中的 <code>grep</code> 在原生 PowerShell 中不可用，需要 Git Bash 或 WSL 环境。
        PowerShell 替代：用 <code>Select-String</code> 替代 <code>grep</code>，用 <code>Get-ChildItem</code> 替代 <code>ls</code>。
      </div>

      <div className="callout callout-info">
        <strong>排查优先级</strong>：第 2 步（检查 backups）是最容易跳过但最关键的。
        实际排错中，大量时间被浪费在反复修改 mcp.json 上，而根因是 backups 中的旧配置从来未被清理。
      </div>

      {/* ===== 六、核心原则 ===== */}
      <h2 id="principles">六、核心原则</h2>

      <h3>1. 以进程实际参数为准</h3>
      <p>
        配置文件写什么只是声明，进程实际收到的命令行参数才反映真实状态。<code>Get-CimInstance Win32_Process</code>（Windows）或
        <code>ps aux</code>（macOS/Linux）比任何配置文件都可信。
      </p>

      <h3>2. 改配置 ≠ 配置生效</h3>
      <p>
        backups 幽灵缓存意味着只改 mcp.json 可能等于没改。先查进程链，再清缓存，最后验证。
      </p>

      <h3>3. "Key 有效" ≠ "MCP 收到了 Key"</h3>
      <p>
        curl 直测 Key 返回 200 只能排除"Key 本身无效"，不能证明 MCP 进程收到了它。排查时必须分开验证这两个环节。
      </p>

      <h3>4. "重启"不是关窗口</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>关闭终端窗口 ≠ 进程退出</li>
        <li>需要 <code>taskkill /f /im claude.exe</code>（Windows）或 <code>pkill -f claude</code>（macOS）</li>
        <li>即使杀了进程，backups 在磁盘上完好，重开后恢复旧配置——清缓存 + 杀进程都要做</li>
      </ul>

      <h3>5. Windows 下的优先级清单</h3>
      <p>Windows 排查顺序（按发现的难度递增）：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><code>mcp.json</code> 配置是否正确</li>
        <li>backups 缓存是否覆盖了 mcp.json</li>
        <li><code>.claude.json</code> 是否残留旧配置</li>
        <li>Windows 注册表环境变量（<code>HKCU\Environment</code>）</li>
        <li>npx 是否吞掉了命令行参数</li>
      </ol>

      <Collapsible summary="相关阅读">
        <div className="callout callout-info">
          <strong>相关阅读</strong>：
          关于 MCP 协议本身的架构、机制和工程实践，参见本站
        <a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP：模型上下文协议的架构、机制与工程实践》</a>。
        关于 Claude Code 的 MCP、Hook、Skill 等扩展机制，参见
        <a href="/articles/mcp-hook-skill-advanced" style={{ color: "var(--color-accent)" }}>《Claude Code 扩展机制：MCP、Hook、Skill、SubAgent 与 Memory》</a>。
      </div>
      </Collapsible>

      <FreshnessNote>本文基于 Claude Code v2.x + Windows 11 验证，写作日期 2026-06-12。</FreshnessNote>
    </div>
  );
}

