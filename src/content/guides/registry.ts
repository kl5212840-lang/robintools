/**
 * 指南内容注册表 v3 — Split-TSX 架构
 * 每个工具的每个指南类型 = 独立文件
 * 新增工具只需新建文件夹 + 4 个文件 + 在此添加导入即可
 */
import type { GuideEntry } from "./_shared";

// Claude Code
import renderClaudeInstall from "./claude-code/install";
import renderClaudeConfig from "./claude-code/config";
import renderClaudeTroubleshoot from "./claude-code/troubleshoot";
import renderClaudeTutorial from "./claude-code/tutorial";

// Codex CLI
import renderCodexInstall from "./codex/install";
import renderCodexConfig from "./codex/config";
import renderCodexTroubleshoot from "./codex/troubleshoot";
import renderCodexTutorial from "./codex/tutorial";

// Cursor
import renderCursorInstall from "./cursor/install";
import renderCursorConfig from "./cursor/config";
import renderCursorTroubleshoot from "./cursor/troubleshoot";
import renderCursorTutorial from "./cursor/tutorial";

// GitHub Copilot
import renderCopilotInstall from "./copilot/install";
import renderCopilotConfig from "./copilot/config";
import renderCopilotTroubleshoot from "./copilot/troubleshoot";
import renderCopilotTutorial from "./copilot/tutorial";

// Windsurf
import renderWindsurfInstall from "./windsurf/install";
import renderWindsurfConfig from "./windsurf/config";
import renderWindsurfTroubleshoot from "./windsurf/troubleshoot";
import renderWindsurfTutorial from "./windsurf/tutorial";

// Cline
import renderClineInstall from "./cline/install";
import renderClineConfig from "./cline/config";
import renderClineTroubleshoot from "./cline/troubleshoot";
import renderClineTutorial from "./cline/tutorial";

// GitHub Spark
import renderSparkInstall from "./github-spark/install";
import renderSparkConfig from "./github-spark/config";
import renderSparkTroubleshoot from "./github-spark/troubleshoot";
import renderSparkTutorial from "./github-spark/tutorial";

/** 全局注册表 */
export const guideRegistry: Record<string, Record<string, GuideEntry>> = {
  "claude-code": {
    install: {
      steps: [
        { id: "overview", label: "安装方式选择", anchorId: "section-overview", searchText: "cli vscode desktop 原生安装 npm不再推荐 winget homebrew 对比" },
        { id: "prereqs", label: "安装前置依赖", anchorId: "section-prereqs", searchText: "git homebrew curl wsl2 winget node bash 命令行" },
        { id: "install", label: "CLI 命令行安装", anchorId: "section-install", searchText: "powershell bash irm iex install.ps1 install.sh 自动更新 curl" },
        { id: "vscode", label: "VS Code 插件安装", anchorId: "section-vscode", searchText: "vscode vsix 扩展 extension 离线安装 ide 图形界面 marketplace" },
        { id: "desktop", label: "Desktop 桌面版", anchorId: "section-desktop", searchText: "msix exe 桌面版 cowork workspace hyper-v 虚拟机 2.5gb 离线" },
        { id: "verify", label: "验证安装", anchorId: "section-verify-install", searchText: "version command-not-found path 检查版本 终端 启动 CLI VS Code 图标 桌面版 启动" },
        { id: "first-run", label: "首次运行（CLI）", anchorId: "section-first-run", searchText: "首次 启动 信任 目录 apikey 欢迎 测试 连通性" },
      ],
      render: renderClaudeInstall,
      showPlatformTabs: true,
    },
    config: {
      steps: [
        { id: "apikey", label: "获取 API Key", anchorId: "section-apikey", searchText: "deepseek 硅基流动 智谱 apikey 实名认证 充值 anthropic console 海外" },
        { id: "ccswitch", label: "CC Switch 图形化配置", anchorId: "section-ccswitch", searchText: "cc-switch 路由 模型选择 跳过权限 bypassPermissions proxy 图形化 中转" },
        { id: "config", label: "手动编辑配置文件", anchorId: "section-config-file", searchText: "settings.json env base_url auth_token model haiku opus sonnet subagent effort timeout 1m" },
        { id: "verify", label: "验证配置", anchorId: "section-verify-config", searchText: "测试 验证 启动 错误排查 400 user_id 无响应 余额 网络" },
        { id: "mcp", label: "MCP 服务配置", anchorId: "section-mcp-config", searchText: "mcp brave search cmd set claude mcp add env 环境变量" },
      ],
      render: renderClaudeConfig,
      showPlatformTabs: false,
    },
    troubleshoot: {
      steps: [
        { id: "install", label: "安装常见问题", anchorId: "section-ts-install", searchText: "winget 找不到 powershell 权限 homebrew npm 安装失败 command-not-found path 卸载" },
        { id: "config", label: "配置常见问题", anchorId: "section-ts-config", searchText: "无响应 不生效 400 user_id 超时 timeout cc-switch 子代理 subagent 路由" },
        { id: "network", label: "网络相关问题", anchorId: "section-ts-network", searchText: "代理 proxy https_proxy 全局代理 直连 no_proxy workspace 下载失败 2.5gb" },
        { id: "desktop", label: "Desktop 桌面版专项", anchorId: "section-ts-desktop", searchText: "msix 页面空白 hyper-v 虚拟机 virtualmachine 卸载 残留 管理员 仅windows" },
      ],
      render: renderClaudeTroubleshoot,
      showPlatformTabs: false,
    },
    tutorial: {
      steps: [
        { id: "basics", label: "基本操作入门", anchorId: "section-tutorial-basics", searchText: "启动 claude 对话 聊天 权限 允许 拒绝 本次会话 仅本次 始终允许" },
        { id: "files", label: "文件与项目管理", anchorId: "section-tutorial-files", searchText: "文件 项目 创建 修改 重构 批量 代码生成 分析 技术栈" },
        { id: "context", label: "上下文与记忆", anchorId: "section-tutorial-context", searchText: "claude.md memory 记忆 会话 compact clear 继续 压缩 token" },
        { id: "git", label: "Git 工作流", anchorId: "section-tutorial-git", searchText: "git commit pr branch merge 分支 提交 审查 code-review log checkout" },
        { id: "mcp", label: "MCP 服务扩展", anchorId: "section-tutorial-mcp", searchText: "mcp 服务器 brave search tavily context7 chrome devtools github websearch perplexity" },
        { id: "hook", label: "Hook 钩子系统", anchorId: "section-tutorial-hook", searchText: "hooks 钩子 lint 测试 自动化 生命周期 脚本 skills 技能 alias 别名 子代理 后台任务" },
        { id: "practice", label: "实战案例", anchorId: "section-tutorial-practice", searchText: "调研 竞品 爬取 批量 文件批处理 webfetch 技术选型 agent 框架" },
      ],
      render: renderClaudeTutorial,
      showPlatformTabs: false,
    },
  },

  codex: {
    install: {
      steps: [
        { id: "nodejs", label: "安装方式选择", anchorId: "section-overview", searchText: "codex cli openai 命令行 工具 是什么 对比" },
        { id: "prereqs", label: "安装 Node.js", anchorId: "section-prereqs", searchText: "nodejs node lts 版本 nvm 22 rust wsl2" },
        { id: "install", label: "安装 Codex CLI", anchorId: "section-install", searchText: "npm yarn pnpm homebrew brew 全局安装 0.131.0 rust rewrite" },
        { id: "auth", label: "选择认证方式", anchorId: "section-auth", searchText: "chatgpt oauth 登录 浏览器 apikey read bashrc powershell 环境变量 export" },
        { id: "verify", label: "验证安装", anchorId: "section-verify-install", searchText: "version 版本 启动 验证 codex 命令" },
        { id: "sandbox", label: "了解沙箱模式", anchorId: "section-sandbox", searchText: "沙箱 安全 隔离 读写 审批 模式 sandbox_mode" },
      ],
      render: renderCodexInstall,
      showPlatformTabs: true,
    },
    config: {
      steps: [
        { id: "apikey", label: "获取 API 访问", anchorId: "section-apikey", searchText: "chatgpt plus pro team enterprise oauth platform.openai.com apikey 订阅 中转" },
        { id: "config", label: "配置文件与变量", anchorId: "section-config-file", searchText: "config.toml model openai_base_url sandbox_mode approval_policy supports_websockets o4-mini gpt-4o gpt-5.1 环境变量" },
        { id: "network", label: "网络与连接", anchorId: "section-network", searchText: "reconnecting 重连 websocket 网络 连接" },
        { id: "cn-api", label: "国内 API 接入", anchorId: "section-cn-api", searchText: "国产模型 deepseek kimi glm minimax ccswitch codex++ ccx 中转站直连 自定义provider wire_api responses" },
      ],
      render: renderCodexConfig,
      showPlatformTabs: false,
    },
    troubleshoot: {
      steps: [
        { id: "install", label: "安装常见问题", anchorId: "section-ts-install", searchText: "npm 安装失败 cache clean yarn wsl2 command-not-found path 全局安装" },
        { id: "config", label: "配置常见问题", anchorId: "section-ts-config", searchText: "reconnecting 重连 websocket apikey 认证 base_url openai_base_url toml 不生效" },
        { id: "sandbox", label: "沙箱与安全", anchorId: "section-ts-sandbox", searchText: "沙箱 只读 read-only workspace-write danger-full-access 误删 全盘清空 备份 git" },
      ],
      render: renderCodexTroubleshoot,
      showPlatformTabs: false,
    },
    tutorial: {
      steps: [
        { id: "basics", label: "基本操作", anchorId: "section-tutorial-basics", searchText: "codex 启动 命令 交互 单次任务 对话 沙箱模式 审批 approval" },
        { id: "sandbox", label: "沙箱与项目管理", anchorId: "section-tutorial-files", searchText: "沙箱 项目隔离 多进程 并行 上下文 文件夹" },
        { id: "git", label: "Git 与工作流", anchorId: "section-tutorial-git", searchText: "git commit pr push 初始化 提交 github token" },
        { id: "advanced", label: "高级功能", anchorId: "section-tutorial-advanced", searchText: "skills 技能 agents.md memory 记忆 codex++ 对比 定时任务 cron 增强" },
      ],
      render: renderCodexTutorial,
      showPlatformTabs: false,
    },
  },

  windsurf: {
    install: {
      steps: [
        { id: "overview", label: "Windsurf 是什么", anchorId: "section-overview", searchText: "windsurf cursor 对比 ide cascade 是什么 选型" },
        { id: "prereqs", label: "系统要求与前置准备", anchorId: "section-prereqs", searchText: "dmg exe appimage codeium.com windsuf 下载 系统要求" },
        { id: "first-launch", label: "首次启动", anchorId: "section-first-launch", searchText: "首次 启动 导入 vscode 设置 扩展" },
        { id: "install", label: "下载与安装", anchorId: "section-install", searchText: "下载 安装 dmg exe appimage download codeium.com 安装包" },
        { id: "auth", label: "注册与订阅", anchorId: "section-auth", searchText: "注册 订阅 免费 pro 15美元 google github 计费" },
        { id: "verify", label: "开始使用", anchorId: "section-verify-install", searchText: "cascade supercomplete multi-file 补全 cmd+l cmd+i 多文件" },
        { id: "next", label: "下一步", anchorId: "section-next", searchText: "项目规则 配置 cascaderules 下一步 规则" },
      ],
      render: renderWindsurfInstall,
      showPlatformTabs: true,
    },
    config: {
      steps: [
        { id: "models", label: "模型与订阅", anchorId: "section-apikey", searchText: "免费 pro 15 自定义 apikey deepseek openai anthropic google 订阅" },
        { id: "cascade", label: "Cascade 设置", anchorId: "section-config-file", searchText: "cascade 自动模式 手动模式 上下文 终端访问 设置" },
        { id: "rules", label: "项目规则", anchorId: "section-rules", searchText: "windsurfrules mdc 项目规则 编码规范 cascade 行为" },
      ],
      render: renderWindsurfConfig,
      showPlatformTabs: false,
    },
    tutorial: {
      steps: [
        { id: "basics", label: "基本操作", anchorId: "section-tutorial-basics", searchText: "cmd+l cmd+i supercomplete tab cascade 对话 composer 多文件 @ 引用" },
        { id: "cascade", label: "Cascade 深度使用", anchorId: "section-tutorial-files", searchText: "multi-file edit 多文件 自动模式 手动模式 continue 上下文" },
        { id: "workflow", label: "工作流技巧", anchorId: "section-tutorial-git", searchText: "新功能 bug 修复 代码审查 pr 学习 工作流 调试" },
        { id: "compare", label: "与其他工具配合", anchorId: "section-tutorial-advanced", searchText: "claude code codex cursor 组合 选型 对比 配合" },
      ],
      render: renderWindsurfTutorial,
      showPlatformTabs: false,
    },
    troubleshoot: {
      steps: [
        { id: "install", label: "安装与登录", anchorId: "section-ts-install", searchText: "下载慢 登录失败 google github 导入设置 vscode" },
        { id: "performance", label: "性能与卡顿", anchorId: "section-ts-config", searchText: "启动慢 卡顿 性能 扩展 内存 cpu 延迟 索引 补全" },
        { id: "features", label: "功能问题", anchorId: "section-ts-network", searchText: "cascade 不响应 supercomplete 不显示 composer 多文件 出错" },
        { id: "billing", label: "订阅与计费", anchorId: "section-ts-billing", searchText: "订阅 计费 免费 升级 付费 pro 账单" },
      ],
      render: renderWindsurfTroubleshoot,
      showPlatformTabs: false,
    },
  },

  cursor: {
    install: {
      steps: [
        { id: "overview", label: "Cursor 是什么", anchorId: "section-overview", searchText: "cursor windsurf claude code ide 是什么 对比 选型" },
        { id: "prereqs", label: "系统要求", anchorId: "section-prereqs", searchText: "cursor.com dmg exe appimage 下载 系统要求 macos windows linux 导入 vscode" },
        { id: "install", label: "下载与安装", anchorId: "section-install", searchText: "下载 安装 dmg exe appimage 版本 安装包" },
        { id: "first-launch", label: "首次启动与导入", anchorId: "section-first-launch", searchText: "首次 启动 导入 vscode 设置 扩展 主题" },
        { id: "auth", label: "注册与订阅", anchorId: "section-auth", searchText: "google github 登录 注册 免费 pro 20 美元 订阅 apikey" },
        { id: "verify", label: "验证使用", anchorId: "section-verify-install", searchText: "cmd+k cmd+l ctrl+k ctrl+l 对话 补全 测试 验证" },
        { id: "next", label: "下一步", anchorId: "section-next", searchText: "项目规则 cursorrules 配置 下一步" },
      ],
      render: renderCursorInstall,
      showPlatformTabs: true,
    },
    config: {
      steps: [
        { id: "models", label: "模型与 API Key", anchorId: "section-apikey", searchText: "gpt-4 claude deepseek openai anthropic google 自定义 apikey pro 500次 免费" },
        { id: "rules", label: "项目规则配置", anchorId: "section-config-file", searchText: "cursorrules mdc rules 目录 globs 编码规范 ai行为" },
        { id: "tips", label: "使用技巧", anchorId: "section-verify-config", searchText: "cmd+k cmd+l cmd+i @ 引用 composer agent 多文件 tab 补全" },
      ],
      render: renderCursorConfig,
      showPlatformTabs: false,
    },
    tutorial: {
      steps: [
        { id: "basics", label: "基本操作", anchorId: "section-tutorial-basics", searchText: "tab cmd+k cmd+l cmd+i 补全 行内编辑 对话 composer 四种模式" },
        { id: "composer", label: "Composer 多文件编辑", anchorId: "section-tutorial-files", searchText: "composer cmd+i 多文件 apply accept reject undo 跨文件" },
        { id: "workflow", label: "实战工作流", anchorId: "section-tutorial-git", searchText: "新功能 重构 调试 学习 bug 修复 代码审查 pr 工作流" },
        { id: "compare", label: "工具选型建议", anchorId: "section-tutorial-advanced", searchText: "cursor windsurf claude code copilot 对比 组合 选型" },
      ],
      render: renderCursorTutorial,
      showPlatformTabs: false,
    },
    troubleshoot: {
      steps: [
        { id: "install", label: "安装与登录", anchorId: "section-ts-install", searchText: "下载慢 登录失败 google github 免费版 次数限制 pro" },
        { id: "slow", label: "卡顿与性能", anchorId: "section-ts-config", searchText: "卡顿 慢 性能 内存 扩展 补全延迟 高内存 标签页" },
        { id: "bugs", label: "常见问题", anchorId: "section-ts-network", searchText: "composer 不生效 apply 设置同步 sync 扩展兼容性" },
        { id: "model", label: "模型与 API", anchorId: "section-ts-model", searchText: "模型 api 连接 401 认证 代理 超时" },
      ],
      render: renderCursorTroubleshoot,
      showPlatformTabs: false,
    },
  },

  copilot: {
    install: {
      steps: [
        { id: "overview", label: "Copilot 是什么", anchorId: "section-overview", searchText: "copilot cursor windsurf 对比 自动补全 chat 选型" },
        { id: "prereqs", label: "前置准备", anchorId: "section-prereqs", searchText: "vscode jetbrains neovim 系统要求 github 账号" },
        { id: "vscode", label: "VS Code 安装", anchorId: "section-vscode", searchText: "vscode marketplace 扩展 安装" },
        { id: "jetbrains", label: "JetBrains 安装", anchorId: "section-jetbrains", searchText: "jetbrains intellij pycharm plugin marketplace 插件 安装" },
        { id: "neovim", label: "Neovim 安装", anchorId: "section-neovim", searchText: "neovim lazy.nvim vim-plug 插件 安装" },
        { id: "auth", label: "登录与激活", anchorId: "section-auth", searchText: "github 登录 授权 免费试用 30天 绑卡" },
        { id: "subscription", label: "订阅与免费试用", anchorId: "section-subscription", searchText: "免费试用 30天 订阅 个人版 商业版 企业版 student pack 开源 免费" },
        { id: "verify", label: "验证安装", anchorId: "section-verify-install", searchText: "tab esc 注释 补全 alt+] alt+[ 灰色 建议 接受 拒绝" },
        { id: "next", label: "下一步", anchorId: "section-next", searchText: "配置 项目 指令 instructions.md 自定义" },
      ],
      render: renderCopilotInstall,
      showPlatformTabs: false,
    },
    config: {
      steps: [
        { id: "subscription", label: "订阅与计费", anchorId: "section-apikey", searchText: "个人版 商业版 企业版 10美元 19美元 39美元 免费 student 支付宝" },
        { id: "settings", label: "高级设置", anchorId: "section-config-file", searchText: "github.copilot.enable 启用 禁用 语言 文件类型 延迟 隐私 模型 指令 instructions.md" },
        { id: "shortcuts", label: "快捷键与技巧", anchorId: "section-shortcuts", searchText: "tab esc alt+] alt+[ ctrl+enter cmd+i chat 快捷键 注释引导 上下文" },
      ],
      render: renderCopilotConfig,
      showPlatformTabs: false,
    },
    tutorial: {
      steps: [
        { id: "completion", label: "补全技巧", anchorId: "section-tutorial-basics", searchText: "注释 引导 命名 类型 上下文 文件 相关 补全质量 函数名" },
        { id: "chat", label: "Copilot Chat 对话", anchorId: "section-tutorial-files", searchText: "cmd+i chat explain fix tests 重构 #file 引用 对话" },
        { id: "config", label: "项目级配置", anchorId: "section-tutorial-git", searchText: "instructions.md 项目指令 编码规范 自定义 语言 开关" },
        { id: "combine", label: "工具组合使用", anchorId: "section-tutorial-advanced", searchText: "cursor windsurf claude code codex 组合 搭配 场景 轻量 补全 重构" },
        { id: "workflow", label: "实战工作流", anchorId: "section-tutorial-workflow", searchText: "实战 工作流 示例 全流程 新功能 调试 重构" },
      ],
      render: renderCopilotTutorial,
      showPlatformTabs: false,
    },
    troubleshoot: {
      steps: [
        { id: "auth", label: "登录与激活", anchorId: "section-ts-install", searchText: "登录 激活 sign-out sign-in 订阅 绑卡 企业版 组织 试用" },
        { id: "completion", label: "补全问题", anchorId: "section-ts-config", searchText: "无补全 质量差 速度慢 延迟 上下文 代理 扩展冲突" },
        { id: "chat", label: "Chat 对话问题", anchorId: "section-ts-chat", searchText: "chat 对话 不响应 无回复 cmd+i 引用 上下文" },
        { id: "network", label: "网络与代理", anchorId: "section-ts-network", searchText: "代理 proxy http.proxy 公司网络 断开 间歇 冲突 扩展 直连" },
      ],
      render: renderCopilotTroubleshoot,
      showPlatformTabs: false,
    },
  },

  cline: {
    install: {
      steps: [
        { id: "overview", label: "安装方式选择", anchorId: "section-overview", searchText: "vscode cli npm jetbrains 扩展 命令行 选择 对比" },
        { id: "vscode", label: "VS Code 扩展安装", anchorId: "section-vscode", searchText: "marketplace saoudrizwan.claude-dev 扩展 离线 搜索 安装" },
        { id: "cli", label: "CLI 命令行安装", anchorId: "section-cli", searchText: "npm i -g cline nodejs 全局安装 headless 无头模式 ci/cd" },
        { id: "verify", label: "验证安装", anchorId: "section-verify-install", searchText: "启动 检查 版本 侧栏 图标 cline 命令 终端" },
        { id: "next", label: "下一步", anchorId: "section-next", searchText: "配置 apikey 模型 provider 下一步" },
      ],
      render: renderClineInstall,
      showPlatformTabs: true,
    },
    config: {
      steps: [
        { id: "apikey", label: "选择 API 提供商", anchorId: "section-apikey", searchText: "anthropic openai google openrouter aws bedrock ollama lm studio deepseek 自定义 apikey" },
        { id: "models", label: "模型配置", anchorId: "section-models", searchText: "模型 选择 openai_base_url base_url 兼容 中转 切换 provider" },
        { id: "rules", label: "项目规则", anchorId: "section-rules", searchText: "clinerules 项目规则 编码规范 行为 指导 .clinerules" },
        { id: "mcp", label: "MCP 服务器", anchorId: "section-mcp", searchText: "mcp 服务器 数据库 api 工具 管理 cline mcp 社区 自定义" },
      ],
      render: renderClineConfig,
      showPlatformTabs: false,
    },
    troubleshoot: {
      steps: [
        { id: "install", label: "安装常见问题", anchorId: "section-ts-install", searchText: "扩展 找不到 安装失败 npm 权限 command-not-found node 版本" },
        { id: "config", label: "配置常见问题", anchorId: "section-ts-config", searchText: "apikey 不生效 模型 无响应 401 认证 余额 base_url 连接" },
        { id: "mcp", label: "MCP 连接问题", anchorId: "section-ts-mcp", searchText: "mcp 无法连接 超时 配置 路径 权限 进程 崩溃" },
      ],
      render: renderClineTroubleshoot,
      showPlatformTabs: false,
    },
    tutorial: {
      steps: [
        { id: "basics", label: "Plan/Act 模式", anchorId: "section-tutorial-basics", searchText: "plan act 计划 执行 审批 探索 策略 模式 切换" },
        { id: "mcp", label: "MCP 深度使用", anchorId: "section-tutorial-files", searchText: "mcp 数据库 查询 api 工具 社区 服务器 自定义 创建" },
        { id: "multi-agent", label: "多代理协作", anchorId: "section-tutorial-git", searchText: "multi-agent coordinator 协调 委托 团队 专家 代理 并行" },
        { id: "scheduled", label: "定时任务与自动化", anchorId: "section-tutorial-advanced", searchText: "cron 定时 日程 自动化 pr 依赖 归档 消息 通知 监控" },
      ],
      render: renderClineTutorial,
      showPlatformTabs: false,
    },
  },

  "github-spark": {
    install: {
      steps: [
        { id: "overview", label: "Spark 是什么，不是什么", anchorId: "section-overview", searchText: "github spark 是什么 copilot 区别 应用 构建 定位 web" },
        { id: "access", label: "访问 Spark", anchorId: "section-access", searchText: "github.com spark 登录 导航 仪表板 浏览器 入口" },
        { id: "first", label: "创建第一个应用", anchorId: "section-first", searchText: "描述 自然语言 输入 创建 生成 应用 第一个" },
        { id: "verify", label: "验证与部署", anchorId: "section-verify-install", searchText: "预览 部署 发布 链接 分享 运行 测试" },
        { id: "next", label: "下一步", anchorId: "section-next", searchText: "prompt 写作 技巧 迭代 优化 下一步" },
      ],
      render: renderSparkInstall,
      showPlatformTabs: false,
    },
    config: {
      steps: [
        { id: "prompt", label: "Prompt 写作技巧", anchorId: "section-prompt", searchText: "提示词 prompt 描述 有效 具体 清晰 样式 功能 上下文" },
        { id: "iterate", label: "迭代与精调", anchorId: "section-iterate", searchText: "修改 迭代 调整 改进 追加 样式 布局 重写" },
        { id: "deploy", label: "部署与发布", anchorId: "section-deploy", searchText: "部署 发布 链接 域名 公开 私有 分享 团队" },
        { id: "code", label: "导出与代码", anchorId: "section-code", searchText: "导出 代码 下载 github clone 仓库 源码" },
      ],
      render: renderSparkConfig,
      showPlatformTabs: false,
    },
    troubleshoot: {
      steps: [
        { id: "generation", label: "生成结果不符合预期", anchorId: "section-ts-generation", searchText: "生成 质量 不符 预期 描述 不准确 样式 错误 布局" },
        { id: "deploy", label: "部署失败", anchorId: "section-ts-deploy", searchText: "部署 失败 错误 链接 404 发布 超时 无法访问" },
        { id: "limit", label: "限制与配额", anchorId: "section-ts-limit", searchText: "限制 配额 免费版 次数 付费 tier 功能 容量" },
      ],
      render: renderSparkTroubleshoot,
      showPlatformTabs: false,
    },
    tutorial: {
      steps: [
        { id: "basics", label: "从想法到应用", anchorId: "section-tutorial-basics", searchText: "想法 概念 应用 创建 原型 迭代 从头 完整 流程" },
        { id: "styling", label: "样式与 UI 定制", anchorId: "section-tutorial-styling", searchText: "样式 设计 主题 颜色 布局 响应式 ui 定制 美化" },
        { id: "data", label: "数据与状态管理", anchorId: "section-tutorial-data", searchText: "数据 状态 存储 数据库 表单 api 交互 后端" },
        { id: "advanced", label: "进阶场景", anchorId: "section-tutorial-advanced", searchText: "ai 功能 协作 github 工作流 模板 复用" },
      ],
      render: renderSparkTutorial,
      showPlatformTabs: false,
    },
  },
};

/** 获取工具的指南条目 */
export function getGuideEntry(toolId: string, guideType: string): GuideEntry | null {
  const toolGuides = guideRegistry[toolId];
  if (!toolGuides) return null;
  return toolGuides[guideType] || null;
}

/** 搜索索引用：导出所有步骤数据（纯文本，不包含 JSX render 函数） */
export interface StepSearchEntry {
  toolId: string;
  toolName: string;
  guideType: string;
  guideName: string;
  stepId: string;
  stepLabel: string;
  anchorId: string;
  searchText?: string;
}
export function getAllStepEntries(): StepSearchEntry[] {
  const entries: StepSearchEntry[] = [];
  const toolsMap: Record<string, string> = {
    "claude-code": "Claude Code",
    codex: "Codex CLI",
    cursor: "Cursor",
    copilot: "Copilot",
    windsurf: "Windsurf",
    cline: "Cline",
    "github-spark": "GitHub Spark",
  };
  const guideMap: Record<string, string> = {
    install: "安装指南",
    config: "配置指南",
    troubleshoot: "故障排查",
    tutorial: "使用教程",
  };
  for (const [toolId, guides] of Object.entries(guideRegistry)) {
    for (const [guideType, entry] of Object.entries(guides)) {
      for (const step of entry.steps) {
        entries.push({
          toolId,
          toolName: toolsMap[toolId] || toolId,
          guideType,
          guideName: guideMap[guideType] || guideType,
          stepId: step.id,
          stepLabel: step.label,
          anchorId: step.anchorId,
          searchText: step.searchText,
        });
      }
    }
  }
  return entries;
}
