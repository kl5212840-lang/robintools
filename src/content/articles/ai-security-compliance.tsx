import { CodeBlock } from "@/components/content/code-block";
import { Callout, Collapsible, FreshnessNote } from "@/content/guides/_shared";

export function renderAiSecurityCompliance() {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        使用 AI 编程工具时，一个容易被忽视的问题是代码隐私。AI 工具通常需要读取项目文件来提供上下文，但如果不对读取范围加以限制，敏感信息（如 <code>.env</code> 中的密钥、商业逻辑代码、数据库备份）可能被意外上传到外部服务器。
      </p>
      <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        本文介绍如何在 Cursor 和 Claude Code 中配置安全边界，在享受 AI 提效的同时保护代码资产。
      </p>

      <h2 id="cursorignore">一、Cursor：配置 .cursorignore</h2>
      <p>
        注意：<code>.gitignore</code> 只能阻止 Git 提交，不能阻止 Cursor 的 AI 引擎读取文件。需要单独创建 <code>.cursorignore</code> 文件来指定 AI 不可读取的内容。
      </p>
      <p>在项目根目录创建 <code>.cursorignore</code>：</p>
      <CodeBlock language="text" mode="unified" code={`# 敏感配置与密钥
.env*
*.local.json
/secrets/
/credentials/

# 数据库与备份
*.sqlite
*.sqlite3
/backups/
/dumps/

# 依赖与构建产物（节约 Token + 防止索引卡死）
node_modules/
.next/
dist/
build/

# 大型静态资源
/public/uploads/
*.zip
*.tar.gz`} />

      <Callout type="info">
        <strong>注意</strong>：<code>.cursorignore</code> 的语法与 <code>.gitignore</code> 相同。文件创建后需要重启 Cursor 才能生效。
      </Callout>

      <h2 id="claude-security">二、Claude Code：安全配置</h2>
      <p>Claude Code 支持在 <code>CLAUDE.md</code> 或 <code>settings.json</code> 中配置读取权限限制。以下配置告诉 Claude Code 拒绝读取敏感文件，并对危险写操作请求人工确认：</p>

      <CodeBlock language="markdown" mode="unified" code={`# CLAUDE.md 安全声明

## 文件访问限制
- 禁止读取 .env 及 .env.* 文件
- 禁止读取 /secrets/ 目录下的任何文件
- 禁止读取 *.sqlite 及数据库备份文件

## 操作限制
- 对 /src 目录外的写操作需要人工确认
- 删除文件操作需要人工确认
- 执行 \`git push --force\` 等危险 Git 操作需要人工确认`} />

      <h2 id="privacy-mode">三、关闭代码训练（隐私模式）</h2>

      <h3>Cursor 隐私设置</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>打开 Cursor → Settings → General → Privacy Mode</li>
        <li>将 Privacy Mode 切换为 <strong>Enabled</strong></li>
        <li>开启后，你的代码片段和输入不会被用于模型训练</li>
      </ol>

      <Callout type="info">
        <strong>补充说明</strong>：通过 Anthropic / OpenAI 官方 API 提交的数据，根据其服务条款默认不参与模型训练。如果你使用的是企业版或 Team 版订阅，通常享有更强的数据隐私保护。
      </Callout>

      <h3>GitHub Copilot 隐私设置</h3>
      <p>如果你同时使用 Copilot：</p>
      <ol className="list-decimal pl-5 space-y-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <li>GitHub Settings → Copilot → 取消勾选 "Allow GitHub to use my code snippets for product improvement"</li>
        <li>企业版用户可以要求管理员在组织层面关闭此选项</li>
      </ol>

      <h2 id="checklist">四、安全配置清单</h2>
      <p>以下是一个可操作的检查清单，建议在新项目中逐项完成：</p>

      <div className="overflow-x-auto">
        <table className="w-full text-[15px] my-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>级别</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>配置项</th>
              <th className="text-left py-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>适用工具</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text-secondary)" }}>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">基础</td>
              <td className="py-2 pr-4"><code>.cursorignore</code> 屏蔽敏感文件</td>
              <td className="py-2">Cursor</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">基础</td>
              <td className="py-2 pr-4">CLAUDE.md 声明文件访问限制</td>
              <td className="py-2">Claude Code</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">强化</td>
              <td className="py-2 pr-4">Privacy Mode 开启</td>
              <td className="py-2">Cursor</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <td className="py-2 pr-4">强化</td>
              <td className="py-2 pr-4">Copilot 代码收集关闭</td>
              <td className="py-2">Copilot</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">审计</td>
              <td className="py-2 pr-4"><code>.cursorignore</code> 和 <code>.gitignore</code> 定期同步</td>
              <td className="py-2">全部</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="summary">五、常见疑问</h2>
      <p><strong>Q: .cursorignore 和 .gitignore 有什么区别？</strong></p>
      <p>.gitignore 控制 Git 的版本追踪范围，.cursorignore 控制 Cursor AI 的文件读取范围。两者互不影响。同时配置两个文件是最佳实践。</p>

      <p><strong>Q: 开启 Privacy Mode 后 AI 补全质量会下降吗？</strong></p>
      <p>不会。Privacy Mode 只阻止代码被用于模型训练，不影响 AI 读取项目上下文和生成补全的能力。</p>

      <FreshnessNote>本文基于 Cursor + Claude Code v2.x 验证，写作日期 2026-06-12。</FreshnessNote>
    </div>
  );
}
