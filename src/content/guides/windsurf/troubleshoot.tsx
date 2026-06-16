import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote } from "../_shared";

function renderWindsurfTroubleshoot(_platform: Platform) {
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
        Windsurf 编辑器使用过程中的常见问题及解决方案。按问题类型分为安装登录、性能卡顿、功能异常、订阅计费四类。如果未覆盖你的问题，可查阅官方文档或到 B站搜索相关教程。
      </p>

      <h2 id="section-ts-install"><span className="step-badge">1</span>安装与登录</h2>
      <div className="space-y-4">
        <ProblemCard id="windsurf-login-failed" title="登录失败" desc="GitHub 或 Google 登录后浏览器弹窗无响应或提示错误。" solution="① 检查浏览器弹窗是否被拦截（地址栏右侧查看拦截提示）；② GitHub 和 Google 国内均可直连但偶尔较慢，等 20-30 秒再试；③ 如果 GitHub 登录反复失败，试试 Google 登录——两者独立互不影响；④ 已登录过旧账户想换号：Settings → Profiles → 退出当前登录 → 重新认证。" />
        <ProblemCard id="windsurf-repeated-login" title="登录后反复要求重新登录" desc="每次打开 Windsurf 都要重新登录一次。" solution="通常是 token 过期时间配置问题。① 在 Codeium 账户设置页面（codeium.com/account）检查活跃会话数——如果超过 3 个，旧会话可能被自动踢出；② 尝试在 Windsurf 中完全退出登录 → 清除浏览器中 codeium.com 的 cookie → 重新登录；③ Settings → Profiles → 'Sign out everywhere' → 仅在这台设备上重新登录。" />
        <ProblemCard id="vscode-import-failed" title="无法导入 VS Code 设置" desc="首次启动选择了 Import from VS Code 但什么都没导入，或后续 Settings → Profiles 中找不到导入选项。" solution="① 前提：你的机器上必须确实装过 VS Code 且从未手动删除过配置目录。Windows 默认在 %APPDATA%/Code/User，macOS 在 ~/Library/Application Support/Code/User；② 如果 VS Code 装在非默认位置（如便携版），Windsurf 可能找不到——手动把 settings.json 和 keybindings.json 从 VS Code 配置目录复制到 Windsurf 对应目录（位置在 Settings → Profiles → 右上角 '...' → 'Open Profile Folder'）；③ 如果只是想迁移扩展，Settings → Extensions → 勾选你需要的扩展逐个安装（数量不多的话手动装更快）。" />
        <ProblemCard id="download-slow" title="下载速度慢或安装失败" desc="安装包下载异常缓慢，或安装过程中卡住。" solution="国内访问 codeium.com 通常正常。如果很慢：① 检查是否有后台下载软件占满带宽；② Windows 用户注意杀毒软件（360、火绒等）有时会拦截安装器——安装前暂时关闭实时防护；③ macOS 用户：如果 .dmg 打开后无法拖动，这是 macOS 的 Gatekeeper 限制——右键安装包 → 打开 → 再拖动到 Applications。" />
      </div>

      <h2 id="section-ts-config"><span className="step-badge">2</span>性能与卡顿</h2>
      <div className="space-y-4">
        <ProblemCard id="initial-indexing-slow" title="首次打开项目索引时间过长" desc="打开中型以上项目后，CPU 占用很高且持续超过 5 分钟。" solution="Windsurf 首次打开项目时会对所有代码文件建索引用于 Supercomplete 和 Cascade。① Settings → 搜索 'index.exclude' → 把 node_modules、.next、dist、build、__pycache__ 等生成目录排除；② 在项目根目录创建 .codeiumignore 文件（语法同 .gitignore）排除不需要 AI 索引的文件类型（如图片、音频、大型 JSON）；③ 索引完成后 CPU 会自动降下来——这只是一次性成本，后续打开同项目只需增量更新。" />
        <ProblemCard id="supercomplete-lag" title="Supercomplete 补全延迟高" desc="写完代码后等很久才出现灰色补全建议，或候选项不够准确。" solution="① 检查网络延迟——Windsurf 的补全依赖 Codeium 服务器，国内高峰时段可能较慢；② 打开的文件不宜过多，每次补全请求会拉取相关标签页的上下文——关闭不用的文件能显著提升响应速度；③ Settings → Supercomplete → 调整 'Suggestion Delay'（默认 200ms）——改太小可能浪费 Token 且准确度下降；④ Supercomplete 和 Cascade 的模型是独立的，Supercomplete 用轻量模型，不受 Cascade 模型选择影响。" />
        <ProblemCard id="windsurf-lag" title="编辑器整体卡顿" desc="大项目中使用 Windsurf 操作有明显延迟。" solution="Windsurf 在 VS Code 基础上增加了 AI 层，资源消耗确实略高于原生 VS Code。① Settings → 搜索 'extensions' → 用开发者工具（Help → Toggle Developer Tools → Performance）找出 CPU 占用最高的扩展并禁用；② Settings → 搜索 'files.watcherExclude' → 添加大目录；③ Cascade 保持打开但非活跃时也会占用上下文内存——不需要时关闭 Cascade 面板而非最小化。" />
        <ProblemCard id="high-memory" title="内存占用超过 2GB" desc="任务管理器中 Windsurf 内存占用持续增长。" solution="① 关闭不用的标签页和 Cascade 对话；② 如果同时打开多个项目窗口，每个窗口独立占用约 1-1.5GB——建议只保留一个项目窗口；③ Help → Toggle Developer Tools → Memory → 可以看内存快照，但不建议普通用户自行操作；④ 最简单的方式：定期用 Cmd+Shift+P → 'Developer: Reload Window' 释放内存（所有 AI 上下文会重置）。" />
      </div>

      <h2 id="section-ts-network"><span className="step-badge">3</span>功能异常</h2>
      <div className="space-y-4">
        <ProblemCard id="cascade-no-response" title="Cascade 不响应" desc="Cascade 对话面板打开后输入指令无回复，或一直转圈。" solution="① 检查网络——Cascade 需要连接 Codeium 服务器。可以访问 codeium.com 确认网络可达；② Cmd+Shift+P → 'Cascade: Restart' 重启 Cascade 后端；③ 检查是否在用免费版达到了限额——免费版有 Cascade 使用次数限制，超出后会静默停止；④ 如果持续不响应，完全退出 Windsurf（含系统托盘图标）→ 重新打开 → 先打开 Cascade 发句 'Hello' 测试。" />
        <ProblemCard id="supercomplete-not-showing" title="Supercomplete 不显示" desc="任何文件中都没有补全建议。" solution="① Settings → Supercomplete → 确认 'Enable Supercomplete' 已开启；② 检查是否装过多个 AI 补全扩展——同时开 Copilot 和 Supercomplete 可能造成补全冲突，建议只留一个；③ 确认当前文件类型被支持——Settings → Supercomplete → 'Enabled Languages' 查看支持的语言列表；④ Cmd+Shift+P → 'Supercomplete: Restart' 重启补全服务；⑤ 如果是新项目还没索引完，等索引完成后再试。" />
        <ProblemCard id="cascade-auto-mode-overreach" title="Cascade 自动模式修改了不该改的文件" desc="Cascade 自动模式执行任务后，一些无关的文件被改了。" solution="Cascade 的自动模式会自主决定修改哪些文件来完成任务，可能超出你预期。① Settings → Cascade → 切换为 'Manual Mode'（手动模式）——Cascade 每次修改前先问你确认；② 操作前用 Git 提交当前状态，如果改坏了用 git checkout 快速回滚；③ 在 .windsurfrules 文件中对 Cascade 声明&ldquo;只修改 src/ 下的文件&rdquo;，Cascade 会遵循规则限制修改范围。" />
        <ProblemCard id="multi-file-edit-apply" title="Multi-file Edit 修改后只有一个文件 Apply 了" desc="Cascade 显示同时修改了 N 个文件，但实际只有第一个文件被应用。" solution="Cascade 的 Multi-file Edit 修改不会自动 Apply——你需要逐个点击每个文件的 Accept/Reject，或点击 Apply All 一键应用全部修改。如果只接受了一个文件然后关了 Cascade 面板，其他文件的修改就丢失了。操作顺序：等 Cascade 输出完所有修改 → 先审查每个文件的 diff → 确认无误后点 Apply All。" />
        <ProblemCard id="custom-api-key-not-working" title="自定义 API Key 不生效" desc="在 Settings → Models 中添加了自定义 Key 但 Cascade 仍用内置模型。" solution="① 自定义 Key 只对指定的模型选项生效——在 Cascade 对话中需要手动选择对应模型（Cascade 面板顶部的模型选择器）；② 如果 Key 对应的供应商不是 OpenAI/Anthropic 等协议兼容的，Windsurf 可能无法识别——确保 API 端点提供与 OpenAI 兼容的接口；③ 检查 Key 对应的账户是否有余额；④ Settings → Models → 如果同一供应商配了多个 Key，只有设为 'Default' 的会生效。" />
        <ProblemCard id="cascade-task-interrupted" title="Cascade 长时间任务中断后无法恢复" desc="让 Cascade 做一个复杂任务，中间系统休眠或关闭面板后回来，之前的工作找不到了。" solution="① Cascade 面板关闭后上下文立即释放——如果你没点 Apply 或保存，已产生但未应用的修改会丢失；② 长时间任务分批执行——不要让 Cascade 一次性做太多事。做完一个子目标后手动 Apply → 在新的对话中开启下一个子目标；③ Cascade 面板底部有对话历史——可以找到之前的对话记录，但注意恢复历史对话 ≠ 恢复未 Apply 的修改；④ 关键操作前手动 git commit，看到 Apply 全部生效了之后再 commit 下一个。" />
        <ProblemCard id="supercomplete-language-support" title="Supercomplete 对特定语言支持较弱" desc="TypeScript/Python 补全效果很好，但 Rust/Go/Java 补全不准确或压根不出建议。" solution="Supercomplete 的多语言支持确实有差异，JavaScript/TypeScript/Python 是优化重点。① 确认该语言的文件扩展名在 Supercomplete 支持列表内（Settings → Supercomplete → 'Enabled Languages'）；② 对于支持较弱的语言，可以只用 Supercomplete 做行内快速补全，复杂逻辑交给 Cascade 对话处理；③ 如果某种语言完全不行，考虑为该语言安装专用 LSP（Language Server）——Supercomplete 可以利用 LSP 的上下文改进预测；④ 不能接受差距的话，在特定语言项目中可选择其他对该语言优化更好的工具（如 Rust 选 Cursor）。" />
      </div>

      <h2 id="section-ts-billing"><span className="step-badge">4</span>订阅与计费</h2>
      <div className="space-y-4">
        <ProblemCard id="pro-not-unlocked" title="Pro 已付费但功能未解锁" desc="支付了 Pro 订阅但 Cascade 还是免费版限制。" solution="① 确认付款已完成——登录 codeium.com/account → Billing 中查看订阅状态是否为 'Active'；② 有时候需要手动刷新——在 Windsurf 中 Settings → Profiles → 退出登录 → 重新登录触发授权更新；③ 如果支付宝付款后状态未更新，一般等 5-10 分钟刷新即可（支付回调有时延迟）。超 1 小时仍未生效：在 codeium.com 提交 Support Ticket。" />
        <ProblemCard id="free-trial-expired" title="免费试用到期后功能降级" desc="免费试用期结束后无法继续用 Cascade。" solution="免费版的 Cascade 有次数和时间限制。① 继续用 Supercomplete——免费版提供基本的代码补全功能（行内补全不限制）；② 如果有自己的 API Key，在 Settings → Models 中填入后通过选择自定义模型使用 Cascade；③ 如果觉得 Pro 性价比不错，可在 codeium.com/account 中升级。注意：Pro 按月订阅，支持随时取消。" />
        <ProblemCard id="student-oss-free" title="学生/开源项目能否免费" desc="想用 Pro 功能但没有预算。" solution="目前 Windsurf/Codeium 没有官方的学生免费计划或开源项目赞助计划。两个替代方案：① 使用免费版 + 自己的 API Key（如果已有 DeepSeek 或其他供应商的 Key）；② 切换到 Cursor（有学生 Pack 免费方案）或 Claude Code（自己配模型费用极低）。如果要长期用且费用敏感，建议组合方案：免费版 Windsurf 做补全 + Claude Code 做重活。" />
      </div>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        💡 如果上述方案未能解决你的问题，建议到 B站或其他网络平台搜索 "Windsurf + 你的报错信息"，视频教程通常有更详细的演示和最新的解决方案。
      </p>
    </div>
  );
}

export default renderWindsurfTroubleshoot;
