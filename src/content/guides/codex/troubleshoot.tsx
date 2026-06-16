import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, Collapsible } from "../_shared";

function renderCodexTroubleshoot(_platform: Platform) {
  return (
    <div className="wizard-content">
      <Collapsible summary="简介">
        <p className="text-[16px] leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Codex CLI 常见问题及解决方案。配置文件位于 <code>~/.codex/config.toml</code>（macOS/Linux）或 <code>C:\Users\你的用户名\.codex\config.toml</code>（Windows）。
        </p>
      </Collapsible>

      <h2 id="section-ts-install"><span className="step-badge">1</span>安装常见问题</h2>
      <div className="space-y-4">
        <ProblemCard id="npm-install-failed" title="npm 安装失败" desc="npm install -g @openai/codex 报错。" solution={<><p style={{marginBottom: "0.5rem"}}>确认 Node.js 版本 &gt;= 18。国内用户先换镜像源：npm config set registry https://registry.npmmirror.com。再清除 npm 缓存：npm cache clean --force。或用 yarn：yarn global add @openai/codex</p><Collapsible summary="验证安装成功"><CodeBlock language="bash" code={`# 确认 codex 在 PATH 中
codex --version
# 应输出：0.x.x（版本号）

# 确认全局安装位置
npm list -g --depth=0 | grep codex
# 应输出：@openai/codex@x.x.x`} /></Collapsible></>} />
        <ProblemCard id="windows-limited-support" title="Windows 原生支持有限" desc="Codex CLI 在 Windows 上原生运行有问题。" solution="建议使用 WSL2（Windows 自带的 Linux 子系统，不会影响原系统）。开启方法：管理员 PowerShell 运行 wsl --install，重启后在 Microsoft Store 搜索 Ubuntu 安装，之后在 WSL2 中按 Linux 方式安装 Node.js 和 Codex。WSL 官方文档：https://learn.microsoft.com/zh-cn/windows/wsl/" />
        <ProblemCard id="codex-command-not-found" title="codex: command not found" desc="安装后终端找不到 codex 命令。" solution={<><p style={{marginBottom: "0.5rem"}}>关闭终端重新打开。检查 npm 全局安装路径是否在 PATH 中。运行 npm list -g --depth=0 确认已安装。</p><Collapsible summary="PATH 修复命令"><CodeBlock language="bash" code={`# 查看 npm 全局安装路径
npm config get prefix
# 应输出类似：/usr/local 或 C:\\Users\\用户名\\AppData\\Roaming\\npm

# 确认 codex 在该路径下
ls "$(npm config get prefix)/bin/codex"   # macOS/Linux
dir "$(npm config get prefix)\\codex.cmd" # Windows (PowerShell)`} /></Collapsible></>} />
      </div>

      <h2 id="section-ts-config"><span className="step-badge">2</span>配置常见问题</h2>
      <div className="space-y-4">
        <ProblemCard id="reconnecting-loop" title="Reconnecting 反复重连" desc="Codex 不断显示 Reconnecting。" solution="先在 config.toml 中添加 supports_websockets = false。如仍不行，可能是网络无法稳定连接 OpenAI 服务器——国内环境建议使用中转服务（API 代理），将 openai_base_url 指向中转地址。配置步骤见「配置指南」→「国内 API 接入方案」。" />
        <ProblemCard id="api-key-auth-failed" title="API Key 认证失败" desc="配置了 API Key 但无法使用。" solution={<><p style={{marginBottom: "0.5rem"}}>① 确认 API Key 正确（无多余空格）；② 确认 OpenAI 账户有余额；③ 检查 openai_base_url 配置正确；④ 尝试用 curl 测试 API 连通性。</p><Collapsible summary="curl 测试命令 + 预期输出"><CodeBlock language="bash" code={`# 测试 OpenAI API 连通性
curl -s -w "\\nHTTP:%{http_code}" https://api.openai.com/v1/models \\
  -H "Authorization: Bearer sk-你的API-Key"

# 成功应返回：HTTP:200 + JSON 模型列表
# 401 表示 Key 无效；403 表示账户权限不足
# 000 表示网络不通——检查代理或换中转地址

# 如果使用中转服务，替换 URL：
curl -s -w "\\nHTTP:%{http_code}" https://你的中转地址/v1/models \\
  -H "Authorization: Bearer 你的API-Key"`} /></Collapsible></>} />
        <ProblemCard id="codex-config-not-working" title="配置文件不生效" desc="修改 config.toml 后设置未生效。" solution="① 检查 TOML 格式正确；② 确认 config.toml 文件路径正确（见页面顶部说明）；③ 完全退出 Codex 后重新启动。" />
        <ProblemCard id="toml-syntax-error" title="config.toml 语法错误无法定位" desc="终端提示 TOML parse error 但没有指出具体哪行有问题。" solution={<><p style={{marginBottom: "0.5rem"}}>TOML 格式对缩进和引号敏感。① 在终端运行 python -m toml ~/.codex/config.toml 自动校验（如有 Python）；② 在线搜索 'TOML validator' 把内容粘进去检查；③ 常见错误：字符串值用了单引号但内部包含单引号、数组缺少逗号、布尔值写成大写（True/False 应为 true/false）；④ 配置项名区分大小写——参考官方示例确保变量名无误。</p><Collapsible summary="TOML 校验命令 + 错误示例"><CodeBlock language="bash" code={`# Python 校验（推荐）
python -m toml ~/.codex/config.toml

# 如果输出 "TOML is valid"，格式无误
# 如果输出类似 "TOMLDecodeError: Invalid... at line 5, col 12"
# → 打开 config.toml，检查第 5 行第 12 个字符

# 常见错误示例：
# ❌ supports_websockets = True    （应写为 true）
# ✅ supports_websockets = true
# ❌ openai_base_url = 'https://xxx'（含中文引号）
# ✅ openai_base_url = "https://xxx"`} /></Collapsible></>} />
        <ProblemCard id="websocket-still-unstable" title="supports_websockets=false 关掉后仍不稳定" desc="关闭 WebSocket 后 Reconnecting 减少但仍偶尔断开。" solution="① 检查网络是否同时访问多个海外服务——国内到 OpenAI 的连接本身不稳定，中转服务的质量是关键；② 尝试在 config.toml 中调大超时时间（如果支持）；③ 如果一直断断续续，建议完全切换到中转服务——将 openai_base_url 指向国内可达的 API 代理地址，稳定性会有明显提升；④ 同时开两个终端各跑一个 Codex 进程可能互相影响——建议同一项目只开一个。" />
        <ProblemCard id="domestic-model-404" title="使用国产模型 API 时报 404 或 400" desc="配置了 DeepSeek 等国产模型的 API 地址，但 Codex 返回 404 或 400 错误。" solution="Codex 使用 Responses API，大多数国产模型只提供 Chat Completions API——两种协议不兼容。直接改 openai_base_url 会导致此错误。详见「配置指南」→「国内 API 接入方案」中的协议转换说明和四种接入方式。" />
      </div>

      <h2 id="section-ts-sandbox"><span className="step-badge">3</span>沙箱与安全</h2>
      <div className="space-y-4">
        <ProblemCard id="sandbox-outside-access" title="无法修改沙箱外文件" desc="Codex 不能修改项目目录外的文件。" solution="这是 Codex 的默认安全设计。将需要操作的文件放在项目目录内。Codex 默认启用沙箱，不能修改系统文件。" />
        <ProblemCard id="sandbox-no-network" title="沙箱无法联网" desc="Codex 的沙箱环境不能访问外网。" solution="这也是安全设计。如需联网功能（如安装依赖），在 prompt 中明确说明，Codex 会在沙箱外执行安装命令。敏感操作会先征求确认。" />
        <ProblemCard id="danger-full-access-risk" title="担心 Codex 误操作文件" desc="Codex 在 danger-full-access 模式下拥有全盘访问权限，存在误删风险。" solution="① 日常使用 workspace-write 模式（仅可修改项目目录内文件），不要随意切换到 danger-full-access；② 操作前用 Git 提交代码；③ 遇到不确定的删除或清理操作时选择「拒绝」；④ 重要项目定期备份。" />
      </div>
    </div>
  );
}

/* ================================================================
   Codex 故障排查
   ================================================================ */

export default renderCodexTroubleshoot;
