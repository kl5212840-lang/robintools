import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCursorTroubleshoot(_platform: Platform) {
  return (
    <div className="wizard-content">
      <Collapsible summary="简介">
        <p className="text-[16px] leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Cursor 编辑器使用过程中的常见问题及解决方案。按问题类型分为安装登录、性能卡顿、功能异常、模型连接四类。如果未覆盖你的问题，可查阅官方文档或到 B站搜索相关教程。
        </p>
      </Collapsible>

      <h2 id="section-ts-install"><span className="step-badge">1</span>安装与登录</h2>
      <div className="space-y-4">
        <ProblemCard id="login-failed" title="无法登录" desc="Google 或 GitHub 登录失败，浏览器弹窗后无响应。" solution="① 检查浏览器弹窗是否被拦截（地址栏右侧查看拦截提示）；② GitHub 国内可直连但可能较慢，等 20-30 秒，刷新后再试；③ 如果 GitHub 一直登不上去，换 Google 登录试试；④ Cmd+Shift+P 搜索 'Cursor: Sign Out' 先退出再重新登录；⑤ 企业网络可能拦截 GitHub OAuth——联系 IT 开通。" />
        <ProblemCard id="repeated-login-prompt" title="登录后反复要求重新登录" desc="明明登了，过一阵又弹出登录提示。" solution="通常是 auth token 过期。Cmd+Shift+P → 'Cursor: Sign Out' → 完全退出 Cursor（含系统托盘）→ 重新打开 → 登录。如果频繁出现，在 Settings 中搜索 'session' 查看当前会话状态。" />
        <ProblemCard id="free-tier-ai-stopped" title="免费版 AI 功能突然不可用" desc="补全和对话都没反应了。" solution="免费版每天有使用次数上限。用完会静默停止——没有明显提示。三种选择：① 等第二天自动重置；② 升级 Pro 解锁更多用量；③ Settings → Models 中填入自己的 API Key（免费版也可用自定义 Key）。" />
        <ProblemCard id="ai-completion-disappeared" title="AI 补全突然消失了" desc="之前正常的 Tab 补全突然不出现。" solution="① 检查 Cursor 底部状态栏 AI 图标是否亮着——灰色表示未连接；② 按 Cmd+Shift+P → 'Cursor: Restart AI' 重启 AI 服务；③ Settings → 搜索 'cursor.enable' 确认 AI 功能未被关闭；④ 检查是否误装了多个 AI 扩展（Tabnine、CodeGeeX 等会冲突），禁用其他 AI 补全扩展后重启 Cursor。" />
      </div>

      <h2 id="section-ts-config"><span className="step-badge">2</span>卡顿与性能</h2>
      <div className="space-y-4">
        <ProblemCard id="editor-lag" title="编辑器整体卡顿" desc="大项目中 Cursor 响应明显变慢。" solution="三步排查：① Cmd+Shift+P → 'Developer: Show Running Extensions'——按 CPU 占用排序，禁用占 CPU 超 5% 且不用的扩展；② Settings → 搜索 'cursor.indexing.exclude'，把 node_modules、.next、dist、build 加进去；③ Settings → 搜索 'cursor.maxMemory'，如果机器内存 ≥ 16GB，可尝试调大分配值（默认自动，改成 8192 MB）。" />
        <ProblemCard id="indexing-stuck" title="索引（Indexing）卡死" desc="打开项目后 Cursor 一直显示 'Indexing...'，进度条不动。" solution="项目文件太多或包含超大文件时索引可能卡住。① Cursor 右下角点击 'Indexing' 字样 → 暂停索引，手动 Resync Index；② 用 .cursorignore 排除图片、PDF、数据库文件等非代码内容（详见本站<a href='/articles/ai-security-compliance' style={{ color: 'var(--color-accent)' }}>安全配置文章</a>）；③ 如果卡死不动：Cmd+Shift+P → 'Developer: Reload Window' 强制重载。" />
        <ProblemCard id="tab-completion-lag" title="Tab 补全延迟大" desc="写完代码后要等一两秒才出现灰色补全建议。" solution="① 检查网络延迟——Cursor 需要实时请求 AI 服务器，国内高峰时段较慢；② Settings → Models → 把默认模型从 Claude Opus 换成速度更快的模型（如 Claude Sonnet 或自定义 DeepSeek）；③ 打开的文件不宜超过 15 个标签页，过多上下文会拖慢每次补全请求；④ Settings → 搜索 'cursor.debounceDelay'，默认 200ms，可调到 100ms（但 Token 消耗更快）。" />
        <ProblemCard id="high-memory-usage" title="内存占用超过 3GB" desc="任务管理器中 Cursor 内存占用持续增长。" solution="① 关闭不用的标签页（每个标签页持有独立上下文占用内存）；② 关掉不用的 Copilot/Composer 对话面板，长对话积累的上下文不释放；③ 定期用 Cmd+Shift+P → 'Developer: Reload Window' 释放累积的内存（项目中所有 AI 上下文会重置）；④ 如果经常超 4GB，配置 settings.json 中减小 'cursor.maxContextFiles' 限制每次上下文文件数。" />
      </div>

      <h2 id="section-ts-network"><span className="step-badge">3</span>功能异常</h2>
      <div className="space-y-4">
        <ProblemCard id="composer-file-not-applied" title="Composer 修改后文件没变化" desc="Composer 生成了代码但文件没被改。" solution="这是最常见的使用问题。Composer 不会自动写入文件——它只是预览。你必须手动点击每一个文件的 Apply 按钮（或一键 Apply All）才算应用。修改不满意可用 Cmd+Z 批量撤销。另外注意：被 .gitignore 排除的文件可能在 Composer 中不受影响——不是 Bug。" />
        <ProblemCard id="terminal-permission-denied" title="终端命令执行无权限" desc="让 Cursor 在终端运行命令时报 'Permission denied'。" solution="① 确认你是在正常的用户终端里使用 Cursor，不要以管理员/root 运行；② 检查 Composer 或 Chat 的权限模式——Settings → 'Cursor: Terminal Approvals'，设为 'on-request'（手动确认）确保每次命令执行前你能看到；③ Windows 用户：确认 Git Bash 已安装并在 Cursor 终端设置中设为默认 Shell。" />
        <ProblemCard id="cursor-rules-not-working" title=".cursor/rules 修改后不生效" desc="改了 .cursor/rules/ 下的 .mdc 文件但 AI 行为没变化。" solution="Cursor 的规则系统需要重启 AI 会话才能识别新规则：① Cmd+Shift+P → 'Cursor: Restart AI'；② 如果改的是 globs 匹配规则，确认文件路径在 globs 范围内（用 **/*.ts 不是 src/*.ts）；③ 检查 YAML 属性头格式——description 和 globs 冒号后必须有空格，缩进必须用空格不能 Tab。" />
        <ProblemCard id="agent-mode-not-working" title="Agent（Yolo）模式不工作" desc="打开了 Agent 模式但 AI 还是只给建议不动手。" solution="① Agent 模式需要单独开启——Settings → Features → Agent → Enable；② 在 Composer 中切换模式为 'Agent' 而非 'Normal'；③ Agent 的自动执行权限需要在 Settings 中独立配置 'Agent: Auto Execute'，不同模式（Normal vs Agent）的权限是分开管理的。" />
        <ProblemCard id="composer-apply-introduces-bug" title="Composer Apply 后引入新 Bug" desc="Composer 生成的代码 Apply 后有语法错误或逻辑问题。" solution="Composer 的修改不一定一次完美。① Apply 之前仔细看每个文件的 diff——红色是删除、绿色是新增——如果改动涉及你不熟悉的部分，先手动审查；② Apply 后立刻运行 tsc/lint 检查类型和语法错误——有错在 Composer 中继续追问让它修复；③ 大改动分步 Apply——先 Apply 第一部分 → 测试 → 再 Apply 第二部分，一次全 Apply 如果出问题难以定位是哪部分造成的；④ 不确定的改动先 git stash 暂存，Apply 后测试通过再 commit。" />
        <ProblemCard id="agent-terminal-no-feedback" title="Agent 模式终端命令执行后无反馈" desc="Agent 运行了终端命令但没有显示输出或结果。" solution="① 检查 Composer 面板底部的 Terminal 标签——命令输出在那里显示而非聊天区；② 有些长时间命令（如 npm install）Agent 等待完成后才在聊天区总结结果——耐心等待，不要重复发指令；③ 如果命令执行完 Terminal 标签为空：可能报错了但 Agent 没有正确捕获——在 Composer 中追问 '刚才那个命令的输出是什么？报错了吗？'；④ Settings → Features → Agent → 'Terminal Output Capture' 确认已开启。" />
        <ProblemCard id="settings-sync-failed" title="设置同步失败" desc="多设备间扩展和设置不同步。" solution="① 确认两台设备登录的是同一个 Cursor 账户（GitHub 或 Google 同一账号）；② Settings → Sync → 点击 'Check Sync Status' 查看最近同步时间和冲突文件数；③ 如果某台设备改了设置但另一台没过来：在那台设备上 Settings → Sync → 'Force Upload' → 等 1-2 分钟 → 另一台设备 'Force Download'。" />
        <ProblemCard id="extension-compatibility" title="扩展兼容性问题" desc="某个 VS Code 扩展在 Cursor 中行为异常。" solution="Cursor 基于 VS Code，绝大多数扩展可用，但个别扩展（尤其是深度依赖 VS Code 内部 API 的）可能不兼容。① 查看扩展的 GitHub Issues 搜索 'Cursor' 关键词；② 如扩展本身不更新了，在 Settings → Extensions 中搜索功能相似的替代扩展；③ 理论上所有 VS Code 扩展都可装，如果装了用不了——禁用再启用，重启 Cursor。仍不行只能在原版 VS Code 中装。" />
      </div>

      <h2 id="section-ts-model"><span className="step-badge">4</span>模型与 API 连接</h2>
      <div className="space-y-4">
        <ProblemCard id="api-401-403" title="API 返回 401 / 403" desc="自定义 API Key 时报认证错误。" solution="① 检查 API Key 完整无误（无多余空格或换行）；② DeepSeek 用户确认 API Key 在 platform.deepseek.com 后台状态为&ldquo;有效&rdquo;；③ 部分供应商的 Key 有有效期——检查是否过期；④ Settings → Models → 删除旧的 Key → 重新粘贴新 Key → Cmd+Shift+P → 'Cursor: Restart AI'。" />
        <ProblemCard id="api-request-timeout" title="API 请求超时" desc="自定义模型后每次请求都很慢甚至超时。" solution="① 检查所用 API 端点的可达性——浏览器访问 API 地址确认返回 200 而非超时；② DeepSeek 国内可直连，其他海外 API（OpenAI、Anthropic）需要代理——Settings 中搜索 'cursor.proxy'，配置代理地址（格式 http://127.0.0.1:7890）；③ 尝试把模型从 Opus 级别换成 Sonnet 级别，响应时间可缩短 3-5 倍。" />
        <ProblemCard id="model-quality-drop" title="模型切换后 AI 回复质量明显下降" desc="从内置模型切换到自定义模型后，补全不准确。" solution="不同模型的补全风格差异很大。① 代码补全场景建议用编码专用模型（如 Claude Sonnet、DeepSeek V4），不要用通用模型；② Settings → Features → 'Inline Completion' 和 'Chat Model' 可以分开配置——补全用速度快的模型，Chat/Composer 用推理强的模型；③ 如果差距大到不可接受，建议回到 Pro 订阅的内置模型——每月包含的模型质量和配额通常够用。" />
      </div>

      <Collapsible summary="外部资源">
        <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          💡 如果上述方案未能解决你的问题，建议到 B站或其他网络平台搜索 "Cursor + 你的报错信息"，视频教程通常有更详细的演示和最新的解决方案。
        </p>
      </Collapsible>
    </div>
  );
}

export default renderCursorTroubleshoot;
