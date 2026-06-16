import { CodeBlock } from "@/components/content/code-block";
import { FreshnessNote } from "@/content/guides/_shared";

export function renderAiPairWorkflow() {
  return (
    <div className="wizard-content">
      <h2 id="intro">开篇</h2>
      <p>
        本站所有指南和文章中的命令、配置、文件操作，都是以<strong>"你手动执行"</strong>的视角编写的。
        但在实际使用 AI 编程工具时，你可以把这些操作交给工具来执行——
        把命令粘贴到对话框，AI 工具会替你跑。你负责<strong>决策和审查</strong>，工具负责操作。
      </p>
      <p>
        这不是"偷懒"——让工具执行重复性操作（启动容器、编辑配置、运行编译），
        你可以把注意力留在真正需要判断的地方：方案选择、结果验证、安全审查。
      </p>

      <h2 id="how">一、怎么"指挥"</h2>
      <p>
        文章中写的是：
      </p>
      <CodeBlock language="bash" code={`docker run -d --name searxng -p 8080:8080 searxng/searxng:latest`} />
      <p>
        你实际操作时：复制这段命令 → 粘贴到 AI 工具对话框 → 说"帮我执行"。
        工具会执行命令、读取输出、判断成败。如果失败，它会根据错误信息调整后重试——
        整个过程你只需要确认关键步骤。
      </p>
      <p>
        对于配置文件（JSON、YAML 等），同样不用手动编辑。
        告诉 AI "把以下配置写入 ~/.claude/mcp.json"，它会定位路径、合并内容、验证语法。
        比手动编辑少了两个常见出错点：路径拼错、逗号漏写。
      </p>

      <h2 id="suitable">二、哪些操作适合交给 AI</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>适合程度</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>操作类型</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>示例</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4" style={{ color: "var(--color-accent)" }}>适合</td>
              <td className="py-2 pr-4">容器操作、包管理、git 查看、配置编辑、curl、编译检查</td>
              <td className="py-2"><code>docker run</code>、<code>npm ci</code>、<code>git status</code>、<code>npx tsc --noEmit</code></td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4" style={{ color: "var(--color-warning)" }}>需审查后批准</td>
              <td className="py-2 pr-4">文件删除、git push、权限修改、系统服务、安装新包</td>
              <td className="py-2"><code>rm -rf</code>、<code>git push</code>、<code>npm install &lt;新包&gt;</code>、<code>chmod</code>、<code>systemctl</code></td>
            </tr>
            <tr>
              <td className="py-2 pr-4" style={{ color: "var(--color-danger)" }}>不适合</td>
              <td className="py-2 pr-4">密钥输入、浏览器操作、交互式 CLI、GUI 操作</td>
              <td className="py-2">API Key、注册登录、<code>passwd</code>、IDE 设置点击</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="tools">三、主流 AI 编程工具的协作方式</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>工具</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>形式</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>能力范围</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Claude Code</td>
              <td className="py-2 pr-4">终端 CLI</td>
              <td className="py-2">执行命令、读写文件、操作 git、运行脚本——覆盖本站几乎所有操作</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">Cursor</td>
              <td className="py-2 pr-4">IDE 内嵌（Chat / Composer）</td>
              <td className="py-2">文件编辑、终端命令、代码生成——覆盖大部分命令和所有配置编辑</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Codex / Copilot</td>
              <td className="py-2 pr-4">IDE 插件</td>
              <td className="py-2">侧重代码补全和 Chat，终端命令能力因产品版本而异</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="safety">四、安全边界</h2>
      <ul className="list-disc pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>
          <strong>API Key 和密码自己输入</strong>——不要粘贴到对话框。
          可以通过环境变量（<code>.env</code>）或工具自身的配置界面注入，不经过 AI 工具的文字通道。
        </li>
        <li>
          <strong>涉及 <code>sudo</code> 或系统级修改的命令</strong>，AI 执行前会征求确认——审阅后再批准。
          如果看不懂命令的作用，先问 AI 解释清楚，再决定是否放行。
        </li>
        <li>
          <strong>浏览器操作仍需手动</strong>——注册账号、登录控制台、点击网页按钮，
          这些 AI 工具无法代劳（除非使用了浏览器自动化插件）。
        </li>
        <li>
          <strong>git push 和部署操作</strong>，建议自己执行最后一步。
          让 AI 帮你准备好 commit 内容和推送目标分支，你确认后亲手 push。
        </li>
      </ul>

      <FreshnessNote>本文基于 Claude Code v2.x + Cursor 验证，写作日期 2026-06-12。</FreshnessNote>
    </div>
  );
}
