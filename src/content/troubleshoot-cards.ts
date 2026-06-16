/**
 * Troubleshoot ProblemCard 数据索引
 *
 * 用途：报错速查（Cmd+K 反向索引）+ pre-push 一致性校验
 * 约束：每次在 troubleshoot.tsx 中新增/修改/删除 ProblemCard 时，必须同步更新此文件
 */

export interface TroubleshootCard {
  id: string;
  title: string;
  desc: string;
  toolId: string;
  toolName: string;
  searchText?: string;
  /** 对应 troubleshoot.tsx 文件的逻辑哈希，pre-push 用它校验一致性 */
}

export const allTroubleshootCards: TroubleshootCard[] = [
  // ===== Claude Code (22 cards) =====
  { id: "winget-package-not-found", title: "winget 找不到 Claude Code", desc: "Windows 上运行 winget install 提示找不到包。", toolId: "claude-code", toolName: "Claude Code", searchText: "winget install 包 找不到 安装" },
  { id: "powershell-permission-denied", title: "PowerShell 权限不足", desc: "运行安装脚本被阻止。", toolId: "claude-code", toolName: "Claude Code", searchText: "Set-ExecutionPolicy 管理员 权限 被阻止" },
  { id: "homebrew-not-installed", title: "Homebrew 未安装 (macOS)", desc: "终端提示 brew: command not found。", toolId: "claude-code", toolName: "Claude Code", searchText: "brew command not found Homebrew macOS" },
  { id: "command-not-found-after-install", title: "安装后 claude 命令不可用", desc: "终端提示 command not found。", toolId: "claude-code", toolName: "Claude Code", searchText: "command not found PATH 重启终端" },
  { id: "install-general-error", title: "安装综合报错", desc: "其他安装相关问题。", toolId: "claude-code", toolName: "Claude Code", searchText: "装不上 安装失败 报错" },
  { id: "no-response-after-startup", title: "启动后无响应", desc: "Claude Code 可以启动但发送消息后无回复。", toolId: "claude-code", toolName: "Claude Code", searchText: "无响应 无回复 没反应 发送消息后" },
  { id: "config-not-taking-effect", title: "配置文件不生效", desc: "修改 settings.json 后仍使用默认配置。", toolId: "claude-code", toolName: "Claude Code", searchText: "settings.json 不生效 无效 配置" },
  { id: "invalid-user-id-400", title: "400 Invalid user_id", desc: "API 返回 400 错误。", toolId: "claude-code", toolName: "Claude Code", searchText: "400 Invalid user_id DeepSeek CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC" },
  { id: "long-timeout", title: "长时间无响应超时", desc: "复杂任务执行到一半超时。", toolId: "claude-code", toolName: "Claude Code", searchText: "超时 timeout 无响应 复杂任务 长时间" },
  { id: "cc-switch-route-not-working", title: "CC Switch 路由不生效", desc: "开启 CC Switch 后 Claude Code 仍使用默认模型。", toolId: "claude-code", toolName: "Claude Code", searchText: "CC Switch 路由 不生效 默认模型 PROXY_MANAGED" },
  { id: "subagent-no-response", title: "子代理（subagent）无响应", desc: "并行任务或子代理不工作。", toolId: "claude-code", toolName: "Claude Code", searchText: "subagent 子代理 并行 无响应 CLAUDE_CODE_SUBAGENT_MODEL" },
  { id: "mcp-config-not-persisting", title: "MCP 配置修改后不生效", desc: "修改了 mcpServers 配置但工具列表没变，或反复被旧配置覆盖。", toolId: "claude-code", toolName: "Claude Code", searchText: "MCP mcpServers 不生效 backups 缓存 claude mcp list" },
  { id: "vscode-vs-cli-inconsistent", title: "VS Code 插件版与 CLI 版行为不一致", desc: "同样的项目，VS Code 插件版和终端 CLI 版的行为或配置效果不同。", toolId: "claude-code", toolName: "Claude Code", searchText: "VS Code 插件 CLI 不一致 行为不同" },
  { id: "network-unreachable", title: "安装或更新时网络不可达", desc: "访问 claude.ai 或 api.anthropic.com 提示连接超时或 DNS 解析失败。", toolId: "claude-code", toolName: "Claude Code", searchText: "连接超时 DNS 解析失败 网络不可达 科学上网 HTTPS_PROXY" },
  { id: "proxy-blocks-deepseek", title: "全局代理导致连不上", desc: "开了代理反而无法访问 DeepSeek。", toolId: "claude-code", toolName: "Claude Code", searchText: "代理 连不上 DeepSeek NO_PROXY" },
  { id: "desktop-workspace-download-failed", title: "Claude Desktop Workspace 下载失败", desc: "桌面版提示 Failed to start workspace。", toolId: "claude-code", toolName: "Claude Code", searchText: "Failed to start workspace Desktop 下载 VM 2.5GB" },
  { id: "cc-switch-routing-failed", title: "CC Switch 路由切换失败", desc: "启用路由时报错。", toolId: "claude-code", toolName: "Claude Code", searchText: "CC Switch 切换 路由 失败 detail" },
  { id: "desktop-blank-page", title: "桌面版启动后页面空白", desc: "Claude Desktop 打开后显示空白页面，无法正常使用。", toolId: "claude-code", toolName: "Claude Code", searchText: "桌面版 空白 白屏 Desktop 启动" },
  { id: "virtual-machine-platform-unavailable", title: "Virtual Machine Platform not available", desc: "Claude 的 Workspace 需要开启虚拟机平台，提示未启用。", toolId: "claude-code", toolName: "Claude Code", searchText: "VirtualMachinePlatform 虚拟机 Hyper-V 未启用" },
  { id: "workspace-start-failed", title: "Failed to start workspace", desc: "Claude 的 Cowork / Workspace 功能启动失败。", toolId: "claude-code", toolName: "Claude Code", searchText: "workspace 启动失败 Cowork VM 2.5GB" },
  { id: "full-uninstall-desktop", title: "完全卸载 Claude Desktop", desc: "需要彻底清除桌面版残留。", toolId: "claude-code", toolName: "Claude Code", searchText: "卸载 桌面版 残留 LOCALAPPDATA 清理" },
  { id: "msix-no-response", title: ".msix 安装包双击无反应", desc: "安装文件双击后没有反应。", toolId: "claude-code", toolName: "Claude Code", searchText: "msix 双击无反应 安装包 管理员" },

  // ===== Cursor (19 cards) =====
  { id: "login-failed", title: "无法登录", desc: "Google 或 GitHub 登录失败，浏览器弹窗后无响应。", toolId: "cursor", toolName: "Cursor", searchText: "登录 失败 Google GitHub OAuth 弹窗" },
  { id: "repeated-login-prompt", title: "登录后反复要求重新登录", desc: "明明登了，过一阵又弹出登录提示。", toolId: "cursor", toolName: "Cursor", searchText: "反复登录 token 过期 Sign Out 重新登录" },
  { id: "free-tier-ai-stopped", title: "免费版 AI 功能突然不可用", desc: "补全和对话都没反应了。", toolId: "cursor", toolName: "Cursor", searchText: "免费版 限制 次数 不可用 没反应 Pro" },
  { id: "ai-completion-disappeared", title: "AI 补全突然消失了", desc: "之前正常的 Tab 补全突然不出现。", toolId: "cursor", toolName: "Cursor", searchText: "补全 消失 Tab 扩展 冲突 Tabnine CodeGeeX" },
  { id: "editor-lag", title: "编辑器整体卡顿", desc: "大项目中 Cursor 响应明显变慢。", toolId: "cursor", toolName: "Cursor", searchText: "卡顿 慢 大项目 扩展 CPU 内存 indexing" },
  { id: "indexing-stuck", title: "索引（Indexing）卡死", desc: "打开项目后 Cursor 一直显示 Indexing，进度条不动。", toolId: "cursor", toolName: "Cursor", searchText: "Indexing 索引 卡死 不动 cursorignore Resync" },
  { id: "tab-completion-lag", title: "Tab 补全延迟大", desc: "写完代码后要等一两秒才出现灰色补全建议。", toolId: "cursor", toolName: "Cursor", searchText: "补全 延迟 慢 debounceDelay 网络" },
  { id: "high-memory-usage", title: "内存占用超过 3GB", desc: "任务管理器中 Cursor 内存占用持续增长。", toolId: "cursor", toolName: "Cursor", searchText: "内存 3GB 占用 高 Reload Window maxContextFiles" },
  { id: "composer-file-not-applied", title: "Composer 修改后文件没变化", desc: "Composer 生成了代码但文件没被改。", toolId: "cursor", toolName: "Cursor", searchText: "Composer Apply 文件 没变化 预览" },
  { id: "terminal-permission-denied", title: "终端命令执行无权限", desc: "让 Cursor 在终端运行命令时报 Permission denied。", toolId: "cursor", toolName: "Cursor", searchText: "Permission denied 终端 权限 Terminal Approvals" },
  { id: "cursor-rules-not-working", title: ".cursor/rules 修改后不生效", desc: "改了 .cursor/rules/ 下的 .mdc 文件但 AI 行为没变化。", toolId: "cursor", toolName: "Cursor", searchText: ".cursorrules mdc globs YAML Restart AI" },
  { id: "agent-mode-not-working", title: "Agent（Yolo）模式不工作", desc: "打开了 Agent 模式但 AI 还是只给建议不动手。", toolId: "cursor", toolName: "Cursor", searchText: "Agent Yolo 模式 不工作 不动手 Auto Execute" },
  { id: "composer-apply-introduces-bug", title: "Composer Apply 后引入新 Bug", desc: "Composer 生成的代码 Apply 后有语法错误或逻辑问题。", toolId: "cursor", toolName: "Cursor", searchText: "Composer Apply Bug 错误 语法错误 diff git stash" },
  { id: "agent-terminal-no-feedback", title: "Agent 模式终端命令执行后无反馈", desc: "Agent 运行了终端命令但没有显示输出或结果。", toolId: "cursor", toolName: "Cursor", searchText: "Agent 终端 无反馈 无输出 Terminal Output Capture" },
  { id: "settings-sync-failed", title: "设置同步失败", desc: "多设备间扩展和设置不同步。", toolId: "cursor", toolName: "Cursor", searchText: "同步 Settings Sync Force Upload Force Download" },
  { id: "extension-compatibility", title: "扩展兼容性问题", desc: "某个 VS Code 扩展在 Cursor 中行为异常。", toolId: "cursor", toolName: "Cursor", searchText: "扩展 兼容 VS Code 异常 禁用" },
  { id: "api-401-403", title: "API 返回 401 / 403", desc: "自定义 API Key 时报认证错误。", toolId: "cursor", toolName: "Cursor", searchText: "401 403 API Key 认证 无效 DeepSeek 过期" },
  { id: "api-request-timeout", title: "API 请求超时", desc: "自定义模型后每次请求都很慢甚至超时。", toolId: "cursor", toolName: "Cursor", searchText: "API 超时 慢 代理 proxy DeepSeek OpenAI" },
  { id: "model-quality-drop", title: "模型切换后 AI 回复质量明显下降", desc: "从内置模型切换到自定义模型后，补全不准确。", toolId: "cursor", toolName: "Cursor", searchText: "模型 切换 质量 下降 补全 Inline Completion Chat Model" },

  // ===== Codex CLI (13 cards) =====
  { id: "npm-install-failed", title: "npm 安装失败", desc: "npm install -g @openai/codex 报错。", toolId: "codex", toolName: "Codex CLI", searchText: "npm 安装失败 @openai/codex EACCES ETIMEDOUT yarn" },
  { id: "windows-limited-support", title: "Windows 原生支持有限", desc: "Codex CLI 在 Windows 上原生运行有问题。", toolId: "codex", toolName: "Codex CLI", searchText: "Windows WSL2 原生 支持 Ubuntu" },
  { id: "codex-command-not-found", title: "codex: command not found", desc: "安装后终端找不到 codex 命令。", toolId: "codex", toolName: "Codex CLI", searchText: "command not found codex PATH npm prefix" },
  { id: "reconnecting-loop", title: "Reconnecting 反复重连", desc: "Codex 不断显示 Reconnecting。", toolId: "codex", toolName: "Codex CLI", searchText: "Reconnecting 重连 websockets 网络 中转 openai_base_url" },
  { id: "api-key-auth-failed", title: "API Key 认证失败", desc: "配置了 API Key 但无法使用。", toolId: "codex", toolName: "Codex CLI", searchText: "API Key 认证 失败 401 403 curl 测试" },
  { id: "codex-config-not-working", title: "配置文件不生效", desc: "修改 config.toml 后设置未生效。", toolId: "codex", toolName: "Codex CLI", searchText: "config.toml 不生效 TOML 配置 重启" },
  { id: "toml-syntax-error", title: "config.toml 语法错误无法定位", desc: "终端提示 TOML parse error 但没有指出具体哪行有问题。", toolId: "codex", toolName: "Codex CLI", searchText: "TOML 语法错误 parse error 校验 python toml validator" },
  { id: "websocket-still-unstable", title: "supports_websockets=false 关掉后仍不稳定", desc: "关闭 WebSocket 后 Reconnecting 减少但仍偶尔断开。", toolId: "codex", toolName: "Codex CLI", searchText: "WebSocket 不稳定 偶尔断开 中转服务 超时" },
  { id: "domestic-model-404", title: "使用国产模型 API 时报 404 或 400", desc: "配置了 DeepSeek 等国产模型的 API 地址，但 Codex 返回 404 或 400 错误。", toolId: "codex", toolName: "Codex CLI", searchText: "404 400 国产模型 DeepSeek Responses API Chat Completions 协议" },
  { id: "sandbox-outside-access", title: "无法修改沙箱外文件", desc: "Codex 不能修改项目目录外的文件。", toolId: "codex", toolName: "Codex CLI", searchText: "沙箱 文件 外部 安全设计 不能修改" },
  { id: "sandbox-no-network", title: "沙箱无法联网", desc: "Codex 的沙箱环境不能访问外网。", toolId: "codex", toolName: "Codex CLI", searchText: "沙箱 联网 外网 安全 安装依赖" },
  { id: "danger-full-access-risk", title: "担心 Codex 误操作文件", desc: "Codex 在 danger-full-access 模式下拥有全盘访问权限，存在误删风险。", toolId: "codex", toolName: "Codex CLI", searchText: "danger-full-access 误删 全盘 安全 workspace-write Git" },

  // ===== GitHub Copilot (13 cards) =====
  { id: "copilot-login-not-working", title: "登录后仍不可用", desc: "GitHub 登录成功但 Copilot 不工作。", toolId: "copilot", toolName: "Copilot", searchText: "登录 不可用 Sign out Sign in 订阅 试用" },
  { id: "free-trial-requires-card", title: "免费试用需绑卡", desc: "30 天试用需要绑定支付方式。", toolId: "copilot", toolName: "Copilot", searchText: "试用 绑卡 支付 Student Pack 免费" },
  { id: "enterprise-org-restriction", title: "企业版限制", desc: "公司 GitHub 组织未启用 Copilot。", toolId: "copilot", toolName: "Copilot", searchText: "企业 组织 未启用 IT 管理员" },
  { id: "extension-installed-but-inactive", title: "扩展状态显示已安装但未激活", desc: "扩展列表中 Copilot 显示已安装，但图标为灰色或状态栏无 Copilot 图标。", toolId: "copilot", toolName: "Copilot", searchText: "扩展 已安装 未激活 灰色 Sign in 输出面板" },
  { id: "completion-not-appearing", title: "完全没有补全", desc: "写代码时无任何建议。", toolId: "copilot", toolName: "Copilot", searchText: "补全 没有 不出现 未启用 文件类型" },
  { id: "completion-quality-poor", title: "补全质量差", desc: "建议不准确。", toolId: "copilot", toolName: "Copilot", searchText: "补全 质量 不准确 上下文 注释" },
  { id: "completion-slow", title: "补全速度慢", desc: "建议出现延迟。", toolId: "copilot", toolName: "Copilot", searchText: "补全 慢 延迟 网络 超大文件 扩展冲突" },
  { id: "chat-panel-blank", title: "Copilot Chat 面板空白或打不开", desc: "Chat 面板不出现或空白。", toolId: "copilot", toolName: "Copilot", searchText: "Chat 面板 空白 打不开 Open Chat 输出面板 扩展" },
  { id: "chat-response-truncated", title: "Chat 回复的代码不完整或被截断", desc: "Copilot Chat 生成了一段代码但后半部分缺失。", toolId: "copilot", toolName: "Copilot", searchText: "Chat 回复 截断 不完整 continue 上下文窗口" },
  { id: "instructions-md-not-working", title: "instructions.md 写了但对 Chat 没影响", desc: "在项目根目录创建了 instructions.md 但 Chat 的回答风格没变化。", toolId: "copilot", toolName: "Copilot", searchText: "instructions.md copilot-instructions 不生效 Chat 内联补全" },
  { id: "corporate-proxy", title: "公司代理环境", desc: "企业网络下 Copilot 无法连接。", toolId: "copilot", toolName: "Copilot", searchText: "代理 企业 http.proxy 公司 网络" },
  { id: "intermittent-disconnect", title: "间歇性断开", desc: "补全时有时无。", toolId: "copilot", toolName: "Copilot", searchText: "断开 间歇 网络抖动 不稳定" },
  { id: "extension-conflict", title: "与其他扩展冲突", desc: "安装多个 AI 扩展后出问题。", toolId: "copilot", toolName: "Copilot", searchText: "扩展 冲突 AI 多个 禁用 竞争" },

  // ===== Cline (13 cards) =====
  { id: "extension-not-found", title: "VS Code 扩展搜不到", desc: "在扩展市场搜索 Cline 找不到，或搜出名称相似的不同扩展。", toolId: "cline", toolName: "Cline", searchText: "扩展 搜不到 saoudrizwan.claude-dev Cline Bot Inc" },
  { id: "cline-command-not-found", title: "npm 全局安装后 cline 命令不存在", desc: "npm install -g cline 成功但终端运行 cline 提示 command not found。", toolId: "cline", toolName: "Cline", searchText: "cline command not found PATH npm prefix 全局安装" },
  { id: "icon-not-appearing", title: "扩展安装后图标不出现", desc: "VS Code 左侧活动栏没有 Cline 的机器人图标。", toolId: "cline", toolName: "Cline", searchText: "图标 不出现 活动栏 已禁用 Reload Window" },
  { id: "npm-eacces", title: "npm 安装权限报错（EACCES）", desc: "npm install -g cline 时报 EACCES: permission denied。", toolId: "cline", toolName: "Cline", searchText: "EACCES 权限 npm nvm sudo 全局" },
  { id: "api-key-no-response", title: "API Key 填了但无响应", desc: "填入 API Key 后 Cline 不报错也不回复，一直转圈。", toolId: "cline", toolName: "Cline", searchText: "API Key 无响应 转圈 Base URL Provider OpenAI Compatible" },
  { id: "deepseek-401", title: "DeepSeek 配置后报 401", desc: "用 DeepSeek 作为 Provider 时报认证错误。", toolId: "cline", toolName: "Cline", searchText: "DeepSeek 401 认证 过期 Base URL platform.deepseek.com" },
  { id: "model-quality-poor", title: "模型回复质量差", desc: "AI 回复不准确、答非所问，或生成的代码有明显错误。", toolId: "cline", toolName: "Cline", searchText: "回复 质量 不准确 clinerules Plan Act 模型选择" },
  { id: "provider-switch-loses-context", title: "切换 Provider 后对话上下文丢失", desc: "换了一个 API Provider，之前的对话记录没了。", toolId: "cline", toolName: "Cline", searchText: "切换 Provider 上下文 丢失 对话 历史 Markdown 导出" },
  { id: "base-url-not-working", title: "Base URL 填写后不生效", desc: "OpenAI Compatible 模式下填了自定义 Base URL，但请求还是打到默认地址。", toolId: "cline", toolName: "Cline", searchText: "Base URL 不生效 https 刷新 重连 OpenAI Compatible" },
  { id: "ollama-connection-failed", title: "Ollama 本地模型连接不上", desc: "选择 Ollama Provider 后一直显示连接失败。", toolId: "cline", toolName: "Cline", searchText: "Ollama 连接 失败 localhost 11434 serve WSL IP" },
  { id: "mcp-connecting-stuck", title: "MCP 服务器添加后状态一直显示 Connecting", desc: "添加了 MCP 服务器配置，但始终连不上。", toolId: "cline", toolName: "Cline", searchText: "MCP Connecting 连接 绝对路径 cmd bat 输出面板" },
  { id: "mcp-tools-not-appearing", title: "MCP 工具不出现", desc: "MCP 服务器已连接，但 Cline 对话中无法调用该服务器的工具。", toolId: "cline", toolName: "Cline", searchText: "MCP 工具 不出现 tools/list 重启 环境变量 env" },
  { id: "mcp-server-crash", title: "MCP 服务器进程崩溃", desc: "MCP 服务器用着用着突然断开，状态变成 Error。", toolId: "cline", toolName: "Cline", searchText: "MCP 崩溃 断开 Error OOM 重启 并发" },

  // ===== Windsurf (18 cards) =====
  { id: "windsurf-login-failed", title: "登录失败", desc: "GitHub 或 Google 登录后浏览器弹窗无响应或提示错误。", toolId: "windsurf", toolName: "Windsurf", searchText: "登录 失败 GitHub Google 弹窗 Profiles" },
  { id: "windsurf-repeated-login", title: "登录后反复要求重新登录", desc: "每次打开 Windsurf 都要重新登录一次。", toolId: "windsurf", toolName: "Windsurf", searchText: "反复登录 token Codeium 会话 cookie Sign out" },
  { id: "vscode-import-failed", title: "无法导入 VS Code 设置", desc: "首次启动选择了 Import from VS Code 但什么都没导入。", toolId: "windsurf", toolName: "Windsurf", searchText: "导入 VS Code Import 设置 Profiles 扩展" },
  { id: "download-slow", title: "下载速度慢或安装失败", desc: "安装包下载异常缓慢，或安装过程中卡住。", toolId: "windsurf", toolName: "Windsurf", searchText: "下载 慢 安装失败 杀毒 360 Gatekeeper dmg" },
  { id: "initial-indexing-slow", title: "首次打开项目索引时间过长", desc: "打开中型以上项目后，CPU 占用很高且持续超过 5 分钟。", toolId: "windsurf", toolName: "Windsurf", searchText: "索引 CPU 占用 高 index.exclude codeiumignore" },
  { id: "supercomplete-lag", title: "Supercomplete 补全延迟高", desc: "写完代码后等很久才出现灰色补全建议，或候选项不够准确。", toolId: "windsurf", toolName: "Windsurf", searchText: "Supercomplete 延迟 慢 Suggestion Delay 标签页 Cascade" },
  { id: "windsurf-lag", title: "编辑器整体卡顿", desc: "大项目中使用 Windsurf 操作有明显延迟。", toolId: "windsurf", toolName: "Windsurf", searchText: "卡顿 慢 大项目 扩展 CPU watcherExclude" },
  { id: "high-memory", title: "内存占用超过 2GB", desc: "任务管理器中 Windsurf 内存占用持续增长。", toolId: "windsurf", toolName: "Windsurf", searchText: "内存 2GB 占用 Reload Window 标签页 Cascade" },
  { id: "cascade-no-response", title: "Cascade 不响应", desc: "Cascade 对话面板打开后输入指令无回复，或一直转圈。", toolId: "windsurf", toolName: "Windsurf", searchText: "Cascade 不响应 转圈 网络 Codeium 限额 重启" },
  { id: "supercomplete-not-showing", title: "Supercomplete 不显示", desc: "任何文件中都没有补全建议。", toolId: "windsurf", toolName: "Windsurf", searchText: "Supercomplete 不显示 未开启 扩展冲突 Copilot 语言 索引" },
  { id: "cascade-auto-mode-overreach", title: "Cascade 自动模式修改了不该改的文件", desc: "Cascade 自动模式执行任务后，一些无关的文件被改了。", toolId: "windsurf", toolName: "Windsurf", searchText: "Cascade 自动模式 误改 Manual Mode windsurfrules Git" },
  { id: "multi-file-edit-apply", title: "Multi-file Edit 修改后只有一个文件 Apply 了", desc: "Cascade 显示同时修改了 N 个文件，但实际只有第一个文件被应用。", toolId: "windsurf", toolName: "Windsurf", searchText: "Multi-file Apply All Accept Reject 批量 文件" },
  { id: "custom-api-key-not-working", title: "自定义 API Key 不生效", desc: "在 Settings → Models 中添加了自定义 Key 但 Cascade 仍用内置模型。", toolId: "windsurf", toolName: "Windsurf", searchText: "自定义 API Key 不生效 Default 模型选择器 供应商" },
  { id: "cascade-task-interrupted", title: "Cascade 长时间任务中断后无法恢复", desc: "让 Cascade 做一个复杂任务，中间系统休眠或关闭面板后回来，之前的工作找不到了。", toolId: "windsurf", toolName: "Windsurf", searchText: "任务 中断 休眠 关闭面板 上下文 丢失 Apply" },
  { id: "supercomplete-language-support", title: "Supercomplete 对特定语言支持较弱", desc: "TypeScript/Python 补全效果很好，但 Rust/Go/Java 补全不准确或压根不出建议。", toolId: "windsurf", toolName: "Windsurf", searchText: "语言 支持 Rust Go Java LSP Enabled Languages" },
  { id: "pro-not-unlocked", title: "Pro 已付费但功能未解锁", desc: "支付了 Pro 订阅但 Cascade 还是免费版限制。", toolId: "windsurf", toolName: "Windsurf", searchText: "Pro 付费 未解锁 Billing Active 支付宝 刷新" },
  { id: "free-trial-expired", title: "免费试用到期后功能降级", desc: "免费试用期结束后无法继续用 Cascade。", toolId: "windsurf", toolName: "Windsurf", searchText: "试用 到期 免费版 Supercomplete API Key 升级 Pro" },
  { id: "student-oss-free", title: "学生/开源项目能否免费", desc: "想用 Pro 功能但没有预算。", toolId: "windsurf", toolName: "Windsurf", searchText: "学生 开源 免费 Student Pack Cursor 替代" },
];
