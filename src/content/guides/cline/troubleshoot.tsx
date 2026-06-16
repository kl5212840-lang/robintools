import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote } from "../_shared";

function renderClineTroubleshoot(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
        Cline 使用过程中的常见问题及解决方案。按问题类型分为安装、配置、MCP 三类。如果未覆盖你的问题，可查阅官方文档（docs.cline.bot）或到 GitHub Issues 搜索。
      </p>

      <h2 id="section-ts-install"><span className="step-badge">1</span>安装常见问题</h2>
      <div className="space-y-4">
        <ProblemCard id="extension-not-found" title="VS Code 扩展搜不到" desc="在扩展市场搜索 Cline 找不到，或搜出名称相似的不同扩展。" solution="直接搜扩展 ID：saoudrizwan.claude-dev。这是 Cline 的唯一标识，不会被名称混淆。在扩展搜索框中粘贴这个 ID 即可精准定位。注意区分作者名——正确作者是 Cline Bot Inc.。" />
        <ProblemCard id="cline-command-not-found" title="npm 全局安装后 cline 命令不存在" desc="npm install -g cline 成功但终端运行 cline 提示 command not found。" solution={`① 检查 npm 全局安装路径是否在系统 PATH 中：运行 npm config get prefix 查看路径；② Windows：将该路径加入系统环境变量 PATH；③ macOS/Linux：确认 export PATH="$(npm config get prefix)/bin:$PATH" 在 ~/.bashrc 或 ~/.zshrc 中；④ 改完 PATH 后重启终端生效。`} />
        <ProblemCard id="icon-not-appearing" title="扩展安装后图标不出现" desc="VS Code 左侧活动栏没有 Cline 的机器人图标。" solution="① 在扩展面板确认 Cline 状态为'已启用'而非'已禁用'；② 右键该扩展 → 扩展设置 → 确认没有工作区级别的禁用；③ Cmd+Shift+P → 'Developer: Reload Window' 强制重载窗口；④ 仍不出现：卸载扩展 → 重启 VS Code → 重新安装。" />
        <ProblemCard id="npm-eacces" title="npm 安装权限报错（EACCES）" desc="npm install -g cline 时报 EACCES: permission denied。" solution="macOS/Linux：不要用 sudo npm install -g（会产生更多权限问题）。推荐用 nvm 管理 Node.js，nvm 的全局安装目录在用户目录下，不需要 sudo。Windows：以管理员身份运行终端，或改用 nvm-windows。" />
      </div>

      <h2 id="section-ts-config"><span className="step-badge">2</span>配置常见问题</h2>
      <div className="space-y-4">
        <ProblemCard id="api-key-no-response" title="API Key 填了但无响应" desc="填入 API Key 后 Cline 不报错也不回复，一直转圈。" solution="① 检查 API Key 是否完整（无多余空格、换行）；② 确认 Base URL 是否匹配所选 Provider——选 OpenAI Compatible 时需要手动填 Base URL；③ 浏览器访问 API 地址确认可达（国内直连测试 —— DeepSeek API 可直连，OpenAI/Anthropic 需中转）；④ 检查 API 账户余额是否充足；⑤ 切换 Provider 再切回来，强制刷新连接。" />
        <ProblemCard id="deepseek-401" title="DeepSeek 配置后报 401" desc="用 DeepSeek 作为 Provider 时报认证错误。" solution="① 确认在 platform.deepseek.com → API Keys 后台 Key 状态为'有效'（非'已过期'）；② DeepSeek 的 Base URL 填写 https://api.deepseek.com（注意不要加 /v1 后缀，Cline 会自动拼接）；③ 刚创建的 Key 需要等 1-2 分钟生效；④ 确认账户余额 > 0（新用户有免费额度）。" />
        <ProblemCard id="model-quality-poor" title="模型回复质量差" desc="AI 回复不准确、答非所问，或生成的代码有明显错误。" solution="① 检查选的模型是否适合编程——推荐 Claude Sonnet 或 DeepSeek-V3，不要用通用对话模型；② .clinerules 文件是否写了清晰的技术栈说明——Cline 的代码质量高度依赖项目规则；③ 描述任务时尽量具体——附上文件路径、错误信息、预期行为，不要只说'帮我改一下'；④ 在 Plan 模式下先让 Cline 解释计划，确认方向后再切换到 Act 模式执行。" />
        <ProblemCard id="provider-switch-loses-context" title="切换 Provider 后对话上下文丢失" desc="换了一个 API Provider，之前的对话记录没了。" solution="这是预期行为。不同 Provider 之间上下文不共享——Cline 的对话历史绑定在当前的 Provider + Model 组合上。切换前如果需要保留上下文，用右上角导出按钮保存对话为 Markdown。" />
        <ProblemCard id="base-url-not-working" title="Base URL 填写后不生效" desc="OpenAI Compatible 模式下填了自定义 Base URL，但请求还是打到默认地址。" solution="① 确认 Base URL 以 https:// 开头；② 不要在末尾加 /v1/chat/completions 等路径——Cline 自动拼接 API 路径，你只要填到域名+端口级别即可（如 https://api.deepseek.com）；③ 改完 Base URL 后点击面板右上角刷新按钮重连。" />
        <ProblemCard id="ollama-connection-failed" title="Ollama 本地模型连接不上" desc="选择 Ollama Provider 后一直显示连接失败。" solution="① 确认 Ollama 服务已启动——终端运行 ollama serve；② 确认模型已拉取——ollama list 查看已安装模型；③ Cline 的 Base URL 填 http://localhost:11434（注意是 http 不是 https）；④ Windows 用户：如果 Ollama 装在 WSL 中，Base URL 要填 WSL 的 IP 地址而非 localhost。" />
      </div>

      <h2 id="section-ts-mcp"><span className="step-badge">3</span>MCP 连接问题</h2>
      <div className="space-y-4">
        <ProblemCard id="mcp-connecting-stuck" title="MCP 服务器添加后状态一直显示 'Connecting'" desc="添加了 MCP 服务器配置，但始终连不上。" solution="① 在终端手动运行 MCP 服务器的启动命令，确认该服务器本身可以正常启动；② 检查命令路径是否正确——不要用相对路径，用绝对路径（如 /usr/local/bin/mcp-server 而非 ./mcp-server）；③ Windows 用户：确认 .cmd 或 .bat 后缀已写全；④ 查看 VS Code 输出面板（Cmd+Shift+U）→ 选择 'Cline' 频道 → 查看 MCP 连接的具体错误日志。MCP 配置的系统性排查方法见<a href='/articles/mcp-config-pitfall-guide' style={{ color: 'var(--color-accent)' }}>《MCP 配置避坑指南》</a>。" />
        <ProblemCard id="mcp-tools-not-appearing" title="MCP 工具不出现" desc="MCP 服务器已连接，但 Cline 对话中无法调用该服务器的工具。" solution="① 确认 MCP 服务器注册的工具列表非空——在终端运行该 MCP 服务器看是否输出了 tools/list 响应；② Cline 面板中点击'MCP 服务器'→ 点击该服务器名称 → 查看已注册的工具数量；③ 重启 Cline 对话（新对话才会加载最新 MCP 工具列表）；④ 有些 MCP 服务器需要环境变量——确认已在 MCP 配置中设置了 env 字段。" />
        <ProblemCard id="mcp-server-crash" title="MCP 服务器进程崩溃" desc="MCP 服务器用着用着突然断开，状态变成 'Error'。" solution="① 检查 MCP 服务器是否有内存泄漏——长时间运行后占用内存过大导致 OOM；② 检查是否有并发冲突——多个 Cline 对话同时调用同一 MCP 服务器可能导致状态混乱；③ 在 MCP 服务器配置中添加 restart 策略（如配置 auto-restart on failure）；④ 更新 MCP 服务器到最新版本。" />
      </div>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        如果上述方案未能解决你的问题，可到 Cline GitHub Issues（github.com/cline/cline/issues）搜索类似问题，或查阅官方文档 docs.cline.bot。
      </p>
    </div>
  );
}

export default renderClineTroubleshoot;
