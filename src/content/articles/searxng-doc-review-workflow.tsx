import { CodeBlock } from "@/components/content/code-block";
import { FreshnessNote, Collapsible } from "../guides/_shared";

export function renderSearxngDocReviewWorkflow() {
  return (
    <div className="wizard-content">
      {/* ===== 开篇 ===== */}
      <h2 id="intro">开篇：SearXNG 是什么，为什么要自己部署</h2>
      <p>
        <a href="https://github.com/searxng/searxng" target="_blank" rel="noopener">SearXNG</a> 是一个开源<strong>元搜索引擎</strong>（meta search engine）——
        它本身不爬取网页，而是把用户查询转发给百度、必应、谷歌等上游引擎，聚合结果后统一返回。
        部署在本地 Docker 中，<strong>免费、无 API Key、无调用次数限制、无搜索历史泄漏</strong>。
      </p>
      <p>
        本文从零开始，完成 SearXNG 本地部署、中文引擎配置、JSON API 开启，
        再通过 MCP 协议接入 Claude Code，最后给出三个真实使用场景和一套搜索策略。
      </p>

      <div className="callout callout-info">
        <strong>读完可以带走</strong>：① 一个运行在本机的私有搜索引擎（Docker 容器部署）；
        ② 接入 Claude Code 的 MCP 配置（含 Windows 平台已知问题规避）；
        ③ 多引擎搜索的组合策略和调优方法。
      </div>

      <Collapsible summary="AI 代劳">
        <div className="callout callout-info">
          本文包含的命令和配置均可交由 AI 编程工具（Claude Code、Codex CLI、Cursor 等）代劳——选取需要的部分发送即可。详见{" "}
          <a href="/articles/ai-pair-workflow" style={{ color: "var(--color-accent)" }}>「阅读本站前」</a>。
        </div>
      </Collapsible>

      {/* ===== 一、SearXNG 部署 ===== */}
      <h2 id="searxng-deploy">一、SearXNG 本地部署</h2>
      <p>
        前置条件：Docker 已安装（Windows 使用 Docker Desktop + WSL2 后端，macOS 使用 Docker Desktop，Linux 使用 Docker Engine）。
        以下命令三端通用。
      </p>

      <h3>1.1 拉取镜像并启动</h3>
      <CodeBlock language="bash" code={`# 拉取镜像
docker pull searxng/searxng:latest

# 启动容器（将 settings.yml 挂载为 volume，方便后续修改）
docker run -d --name searxng \\
  -p 8080:8080 \\
  -v searxng-config:/etc/searxng \\
  searxng/searxng:latest

# 验证容器运行
docker ps --filter name=searxng`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        <strong>国内 Docker 镜像加速</strong>：如果 <code>docker pull</code> 极慢或超时，搜索 "Docker 国内镜像加速 2026" 获取当前可用的镜像站地址，
        写入 Docker Desktop Settings → Docker Engine → registry-mirrors。
      </p>

      <h3>1.2 配置：开启中文引擎 + JSON API</h3>
      <p>
        默认配置不会启用百度和 JSON API。需要导出 <code>settings.yml</code> 并修改——
        <strong>推荐用 volume mount 方式</strong>（容器删除后配置不丢失），不推荐 <code>docker exec vi</code>。
      </p>
      <CodeBlock language="bash" code={`# 1. 从容器中拷贝默认配置到宿主机
docker cp searxng:/etc/searxng/settings.yml ./settings.yml

# 2. 编辑 settings.yml（用任意编辑器）
# 3. 将修改后的文件挂载回容器
docker cp ./settings.yml searxng:/etc/searxng/settings.yml

# 4. 重启容器使配置生效
docker restart searxng`} />
      <p>需要改三个地方：</p>
      <CodeBlock language="yaml" code={`# 1. 开启 JSON API（MCP 接入必需）
search:
  formats:
    - html
    - json

# 2. 启用百度（默认 disabled: true）
engines:
  - name: baidu
    disabled: false
    timeout: 10.0          # 百度响应较慢，放宽超时

# 3. 设置默认语言为中文
server:
  secret_key: "替换为随机字符串"   # openssl rand -hex 32 生成
  default_locale: zh-Hans-CN`} />
      <p>
        <code>secret_key</code> 用于服务端会话加密，生产环境务必改为随机值（<code>openssl rand -hex 32</code> 生成）。
      </p>

      <h3>1.3 验证搜索引擎</h3>
      <CodeBlock language="bash" code={`# 验证 JSON API — 应返回搜索结果 JSON
curl "http://localhost:8080/search?q=hello&format=json"

# 验证百度引擎 — 搜索结果中应有 baidu 条目
curl "http://localhost:8080/search?q=测试&format=json&engines=baidu"`} />
      <p>如果返回 403，说明 <code>formats</code> 列表中缺少 <code>json</code>，回头检查 settings.yml。</p>

      <div className="callout callout-info">
        <strong>搜索引擎选择建议（国内环境）</strong>：
        必应（默认开启，国内直连）、百度（需手动开启，国内直连）、谷歌（默认开启，需科学上网）。
        推荐至少启用必应 + 百度——必应对英文技术资料覆盖好，百度对中文社区（CSDN、博客园、知乎）覆盖好。
      </div>

      {/* ===== 二、MCP 接入 ===== */}
      <h2 id="mcp-integration">二、接入 Claude Code MCP</h2>
      <p>
        SearXNG 有多个社区 MCP 服务器。本文使用 <code>mcp-searxng</code>
        （<a href="https://www.npmjs.com/package/mcp-searxng" target="_blank" rel="noopener">npm</a>），
        它提供两个工具：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><code>searxng_web_search</code> — 执行搜索，支持分页、语言、时间范围、安全搜索参数</li>
        <li><code>web_url_read</code> — 读取搜索结果中 URL 的全文内容</li>
      </ul>

      <h3>2.1 Windows 平台的 MCP 配置</h3>
      <p>
        不推荐手动编辑 JSON 配置文件。使用 Claude Code 自带的 <code>claude mcp add</code> 命令：
      </p>
      <CodeBlock language="bash" code={`# 在项目目录中执行
claude mcp add searxng --env SEARXNG_URL=http://localhost:8080 -- cmd /c "npx -y mcp-searxng"`} />
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
        <strong>⚠️ 常见坑</strong>：<code>claude mcp add</code> 在 Windows 上可能把 <code>/c</code> 误解析为 <code>C:/</code>。
        这是因为 Git for Windows 的 MSYS2/Cygwin 环境将 POSIX 路径 <code>/c</code> 自动转为 Windows 路径。
        添加后检查 <code>.claude.json</code> 中 <code>args</code> 第一个元素是否为 <code>"/c"</code>，如果变成 <code>"C:/"</code> 则手动改回。
      </p>
      <p>最终生效的配置（位于 <code>.claude.json</code> 中当前项目的 <code>mcpServers</code> 下）：</p>
      <CodeBlock language="json" code={`"searxng": {
  "type": "stdio",
  "command": "cmd",
  "args": ["/c", "npx -y mcp-searxng"],
  "env": { "SEARXNG_URL": "http://localhost:8080" }
}`} />

      <div className="callout callout-info">
        <strong>macOS / Linux 用户</strong>：env 注入是稳定的，直接用官方命令即可：
        <code>claude mcp add --env SEARXNG_URL=http://localhost:8080 -- npx -y mcp-searxng</code>
      </div>

      <h3>2.2 验证 MCP 连接</h3>
      <p>重启 Claude Code 后，输入 <code>/mcp</code> 确认 searxng 状态为 <strong>connected ✓</strong>。</p>
      <p>如果 connected 但搜索工具调用报错 "not configured"，手动验证 MCP 进程收到的 URL：</p>
      <CodeBlock language="bash" code={`# Windows — 手动启动 MCP 服务器，看打印的 SEARXNG_URL
cmd /c "set SEARXNG_URL=http://localhost:8080 && npx -y mcp-searxng"

# 期望输出（注意最后一行）：
# 🔍 MCP SearXNG Server v1.0.3 - Ready
# 🌐 SearXNG URL: http://localhost:8080     ← 如果是 "not configured" 则失败`} />

      {/* ===== 三、使用示例 ===== */}
      <h2 id="usage-examples">三、使用示例</h2>
      <p>SearXNG 接入 Claude Code 后，MCP 工具可以在对话中直接被 Claude Code 调用。以下是三个典型场景。</p>

      <h3>3.1 技术选型调研</h3>
      <p>
        同一个问题在不同搜索引擎中得到的结果侧重不同。例如搜 <code>Bun vs Node.js performance 2026</code>：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>百度</strong>：返回中文社区（掘金、SegmentFault、CSDN）的对比评测，侧重国内开发者的实际体验</li>
        <li><strong>必应</strong>：覆盖英文技术博客和 Microsoft 生态内容，对 npm 包的文档页面索引较好</li>
        <li><strong>谷歌</strong>：优先返回官方 benchmark 和 GitHub 仓库的 issue 讨论，时效性排序更强</li>
      </ul>
      <p>聚合三方的结果可以避免单一引擎的信息偏差——中文社区可能更关注生态兼容性，英文社区更关注裸性能数据。</p>

      <h3>3.2 报错排查</h3>
      <p>
        遇到一段报错信息时，直接粘贴到搜索中，跨社区对比解决方案。
        例如一段 Docker 启动报错 <code>Error response from daemon: Ports are not available</code>：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>百度会优先返回 CSDN/博客园的同类踩坑帖，包含中文环境下的操作步骤截图</li>
        <li>必应返回 Stack Overflow 和 Microsoft 官方文档中关于 Windows 端口占用的说明</li>
        <li>谷歌返回 GitHub Issues 中 Docker 项目的相关 bug report，可能包含官方回复</li>
      </ul>
      <p>三个答案源互相参照，可以判断哪个方案是"大多数情况下有效"的，哪个是特定环境下的 workaround。</p>

      <h3>3.3 API 参数或配置字段核实</h3>
      <p>
        需要确认某个 API 参数名或配置字段的准确写法时，分别在中文和英文社区搜索。
        例如查 <code>Next.js basePath</code> 的配置方式：
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>英文搜索结果直接指向 Next.js 官方 docs（<code>nextjs.org/docs</code>），信息最权威</li>
        <li>中文搜索结果可能包含国内开发者的实战文章，附带 Edge Case（如 <code>basePath</code> 与 <code>assetPrefix</code> 的区别和组合使用）</li>
      </ul>
      <p>两者结合——官方文档确认正确性，社区文章确认边界情况——比只看单源更可靠。</p>

      {/* ===== 四、搜索策略 ===== */}
      <h2 id="search-strategy">四、搜索策略与引擎调优</h2>

      <h3>4.1 引擎选择策略</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>场景</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>推荐引擎</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>原因</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">中文社区资料</td>
              <td className="py-2 pr-4">百度</td>
              <td className="py-2">对 CSDN、博客园、知乎、掘金的索引深度远超英文引擎</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">英文技术文档</td>
              <td className="py-2 pr-4">谷歌</td>
              <td className="py-2">时效性排序和官方 docs 召回率领先</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">GitHub Issues</td>
              <td className="py-2 pr-4">必应</td>
              <td className="py-2">对 GitHub 仓库的索引覆盖率较高（Microsoft 生态）</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">综合查全</td>
              <td className="py-2 pr-4">三引擎同时查</td>
              <td className="py-2">SearXNG 自动聚合，一次查询 = 三次搜索</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>4.2 搜索技巧</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>
          <strong>站点限定</strong>：<code>site:github.com 关键词</code> 将搜索限定在 GitHub；
          <code>site:csdn.net</code> 限定在 CSDN。排除噪音时特别有用。
        </li>
        <li>
          <strong>时间过滤</strong>：SearXNG JSON API 支持 <code>time_range</code> 参数
          （<code>day</code> / <code>month</code> / <code>year</code>），过滤掉过时信息。
          例如搜索 <code>q=claude-code-mcp&time_range=year</code> 只看一年内的内容。
        </li>
        <li>
          <strong>多关键词组合</strong>：先用宽泛词（如 <code>Docker 网络配置</code>）定位问题域，
          再用精确词（如 <code>docker bridge network iptables</code>）深入。
          SearXNG 的聚合特性让切换引擎的成本为零——同一组关键词在不同引擎中跑一次即可。
        </li>
        <li>
          <strong>语言参数</strong>：设置 <code>language: en</code> 强制返回英文结果，
          <code>language: zh</code> 返回中文结果。跨语言对比同一技术话题时很有用。
        </li>
      </ul>

      <h3>4.3 为什么用 SearXNG 而不是直接搜</h3>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>免费无 Key</strong>：不需要注册任何搜索 API 服务，Docker 一个容器跑起来就是搜索引擎</li>
        <li><strong>多引擎聚合</strong>：同一个查询同时覆盖百度 + 必应 + 谷歌，中英文资料一次返回</li>
        <li><strong>无跟踪</strong>：搜索请求从本机发出，搜索历史不过第三方服务器</li>
        <li><strong>可编程</strong>：JSON API 让 Claude Code 直接调用搜索结果，不需要手动打开浏览器</li>
        <li><strong>备选方案</strong>：如果暂时不想部署 SearXNG，Claude Code 内置的 WebSearch + WebFetch 也能完成大部分搜索需求——只是搜索源受限于单一引擎索引</li>
      </ul>

      {/* ===== 五、常见问题 ===== */}
      <h2 id="faq">五、常见问题</h2>

      <h3>Docker pull 超时或极慢</h3>
      <p>
        国内网络环境下，Docker Hub 的访问速度不稳定。配置 Docker 镜像加速器
        （Docker Desktop → Settings → Docker Engine → registry-mirrors），
        或在搜索引擎中搜 "Docker 国内镜像加速 2026" 获取当前可用的加速地址。
      </p>

      <h3>JSON API 返回 403</h3>
      <p>
        <code>settings.yml</code> 中 <code>search.formats</code> 列表缺少 <code>json</code>。
        添加后 <code>docker restart searxng</code> 即可。
      </p>

      <h3>MCP 显示 connected 但搜索失败</h3>
      <p>参考 2.2 节，手动启动 MCP 进程确认 <code>SEARXNG_URL</code> 是否正确传入。</p>
      <p>常见原因：</p>
      <ul className="list-disc pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>SearXNG 容器未启动（<code>docker ps --filter name=searxng</code> 确认）</li>
        <li>端口被占用（<code>netstat -ano | findstr 8080</code> 检查）</li>
        <li>Windows 下用了 <code>env</code> 块配置（参考 2.1 节的绕过方案）</li>
      </ul>

      <h3>修改 settings.yml 后不生效</h3>
      <p>
        如果使用的是 <code>docker cp</code> 方式修改，确认执行了 <code>docker restart searxng</code>。
        如果使用的是 volume mount（<code>-v ./settings.yml:/etc/searxng/settings.yml</code>），
        注意 SearXNG 在启动时会校验配置，有语法错误时容器会直接退出——先 <code>docker logs searxng</code> 查看错误信息。
      </p>


      <Collapsible summary="延伸阅读">
        <div className="callout callout-info">
          <strong>延伸阅读</strong>：
          本文使用的 MCP 配置方式（<code>cmd /c set</code>）背后涉及 Claude Code 的 env 块 Bug、backups 缓存机制和进程诊断方法，
          详细排查过程见
          <a href="/articles/mcp-config-pitfall-guide" style={{ color: "var(--color-accent)" }}>《MCP 配置避坑指南》</a>。
          SearXNG 的 Docker Compose 部署（含 Redis 缓存、Caddy 反向代理）见官方文档（github.com/searxng/searxng）。
          MCP 协议的基础概念和架构介绍见
          <a href="/articles/mcp-deep-dive" style={{ color: "var(--color-accent)" }}>《理解 MCP》</a>。
      </div>
      </Collapsible>

      <FreshnessNote>
        以上版本号、Docker 镜像标签、npm 包名及 GitHub Issue 状态验证于 2026-06。
      </FreshnessNote>
    </div>
  );
}
