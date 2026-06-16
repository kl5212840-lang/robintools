import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";

import { Callout, ProblemCard, ConfigTable, FreshnessNote, Collapsible } from "../_shared";

function renderCopilotTroubleshoot(platform: Platform) {
  const cmd = platform === "macos" ? "Cmd" : "Ctrl";
  return (
    <div className="wizard-content">
      <p className="text-[16px] leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
        GitHub Copilot 使用过程中的常见问题及解决方案。如果未覆盖你的问题，可查阅官方文档或到 B站搜索相关教程。
      </p>
      <h2 id="section-ts-install"><span className="step-badge">1</span>登录与激活</h2>
      <div className="space-y-4">
        <ProblemCard id="copilot-login-not-working" title="登录后仍不可用" desc="GitHub 登录成功但 Copilot 不工作。" solution={<><p style={{marginBottom: "0.5rem"}}>确认有有效订阅或试用。尝试重新登录：{cmd}+Shift+P → GitHub Copilot: Sign out，然后重新 Sign in。成功后状态栏会出现 Copilot 图标（黑白圆圈）。</p><Collapsible summary="验证修复"><CodeBlock language="text" code={`# 重新登录后检查：
1. VS Code 底部状态栏最右侧应出现 Copilot 图标（●）
2. 打开任一 .ts 文件，输入 "// sort array by" → 应弹出灰字补全
3. 如果图标仍为灰色：{${cmd}}+Shift+U → 选 "GitHub Copilot" → 查看错误日志`} /></Collapsible></>} />
        <ProblemCard id="free-trial-requires-card" title="免费试用需绑卡" desc="30 天试用需要绑定支付方式。" solution="试用期结束前可取消。如不方便绑卡，可考虑 GitHub Student Pack 免费获取。" />
        <ProblemCard id="enterprise-org-restriction" title="企业版限制" desc="公司 GitHub 组织未启用 Copilot。" solution="联系 IT/管理员启用。个人开发者可用个人版。" />
        <ProblemCard id="extension-installed-but-inactive" title="扩展状态显示已安装但未激活" desc="扩展列表中 Copilot 显示已安装，但图标为灰色或状态栏无 Copilot 图标。" solution={<><p style={{marginBottom: "0.5rem"}}>① 检查 VS Code 底部状态栏是否有 Copilot 图标——没有说明扩展未激活；② {cmd}+Shift+P → 'GitHub Copilot: Sign in' 手动触发登录；③ 如果登录后仍未激活，查看 VS Code 输出面板（{cmd}+Shift+U）→ 选择 'GitHub Copilot' 频道 → 查看具体错误原因；④ 重启 VS Code 后通常恢复正常。</p></>} />
      </div>
      <h2 id="section-ts-config"><span className="step-badge">2</span>补全问题</h2>
      <div className="space-y-4">
        <ProblemCard id="completion-not-appearing" title="完全没有补全" desc="写代码时无任何建议。" solution="确认扩展已启用；检查文件类型；检查网络（国内直连）。" />
        <ProblemCard id="completion-quality-poor" title="补全质量差" desc="建议不准确。" solution="打开更多相关文件提供上下文；先写注释描述意图。" />
        <ProblemCard id="completion-slow" title="补全速度慢" desc="建议出现延迟。" solution="检查网络延迟；避免超大文件；关闭其他 AI 扩展。" />
      </div>
      <h2 id="section-ts-chat"><span className="step-badge">3</span>Chat 对话问题</h2>
      <div className="space-y-4">
        <ProblemCard id="chat-panel-blank" title="Copilot Chat 面板空白或打不开" desc="按{` ${cmd}`}+I 后聊天面板不出现，或面板是空白的。" solution={<><p style={{marginBottom: "0.5rem"}}>① {cmd}+Shift+P → 'GitHub Copilot: Open Chat' 手动打开；② VS Code 输出面板 → 'GitHub Copilot' 频道查看是否有错误日志；③ Chat 需要独立扩展——确认 'GitHub Copilot Chat' 扩展也已安装（和补全扩展是两个独立的）；④ 某些旧版 VS Code 不支持 Chat 面板——更新 VS Code 到最新版本。</p></>} />
        <ProblemCard id="chat-response-truncated" title="Chat 回复的代码不完整或被截断" desc="Copilot Chat 生成了一段代码但后半部分缺失。" solution="① 输入 'continue' 或 '继续' 让 Copilot 接着输出；② 如果问题反复出现，减少单次提问的复杂度——拆成多个小问题分别问；③ Chat 的上下文窗口有限，粘贴太长代码会导致输出截断——只粘贴相关片段而非整个文件；④ 切换模型（如果有选项）——不同模型的输出长度限制不同。" />
        <ProblemCard id="instructions-md-not-working" title="instructions.md 写了但对 Chat 没影响" desc="在项目根目录创建了 instructions.md 但 Chat 的回答风格没变化。" solution={<><p style={{marginBottom: "0.5rem"}}>① instructions.md 只在 Chat 和 Copilot Edits 中生效，不影响内联补全（Inline Completion）；② 文件路径确认：必须是 .github/copilot-instructions.md 或项目根目录的 .github/instructions.md；③ 修改后需等 1-2 分钟生效——Copilot 后台需要重新索引项目文件；④ 如果还是不生效：{cmd}+Shift+P → 'Developer: Reload Window' 强制刷新。</p></>} />
      </div>
      <h2 id="section-ts-network"><span className="step-badge">4</span>网络与代理</h2>
      <div className="space-y-4">
        <ProblemCard id="corporate-proxy" title="公司代理环境" desc="企业网络下 Copilot 无法连接。" solution="VS Code 设置中配置 HTTP 代理：搜索 http.proxy，填入代理地址。" />
        <ProblemCard id="intermittent-disconnect" title="间歇性断开" desc="补全时有时无。" solution="通常是网络抖动。国内服务器较稳定，可检查本地网络。" />
        <ProblemCard id="extension-conflict" title="与其他扩展冲突" desc="安装多个 AI 扩展后出问题。" solution="建议同时只启用一个 AI 补全扩展，避免竞争。" />
      </div>

      <p className="mt-8 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
        💡 如果上述方案未能解决你的问题，建议到 B站或其他网络平台搜索 "GitHub Copilot + 你的报错信息"，视频教程通常有更详细的演示和最新的解决方案。
      </p>
      <FreshnessNote>以上免费试用条件、Student Pack 福利及订阅方案验证于 2026-06，具体以 GitHub 官方最新公告为准。</FreshnessNote>
    </div>
  );
}

export default renderCopilotTroubleshoot;
