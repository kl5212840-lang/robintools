// Terminal recording types — 终端回放事件序列

export interface TerminalEvent {
  /** 从开始到事件发生的时间，单位 ms。不是间隔，pause/resume 不漂移 */
  t: number;
  /** input = 用户输入的命令，output = 系统输出 */
  type: "input" | "output";
  value: string;
}

export interface TerminalRecording {
  title: string;
  /** 提示符前缀，如 "PS C:\\>" 或 "$ " */
  prompt: string;
  events: TerminalEvent[];
}

// ============================================================
// 示例录制：Windows WinGet 安装 Claude Code
// ============================================================

export const wingetClaudeRecording: TerminalRecording = {
  title: "WinGet 安装 Claude Code",
  prompt: "PS> ",
  events: [
    { t: 0, type: "output", value: "PS C:\\Users\\robin> " },
    { t: 400, type: "input", value: "winget install Anthropic.ClaudeCode" },
    { t: 600, type: "output", value: "\r\n" },
    { t: 800, type: "output", value: "已找到 Claude Code [Anthropic.ClaudeCode] 版本 2.1.177.0\r\n" },
    { t: 1200, type: "output", value: "此应用程序由其所有者授权给你。\r\n" },
    { t: 1400, type: "output", value: "Microsoft 对第三方程序包概不负责，也不授予任何许可证。\r\n" },
    { t: 1800, type: "output", value: "正在下载 https://github.com/anthropics/claude-code/releases/download/v2.1.177/ClaudeCode.msix\r\n" },
    { t: 2500, type: "output", value: "  ████████░░░░░░░░░░  46%  12.4 MB / 27.1 MB  " },
    { t: 3200, type: "output", value: "\r  ██████████████████  100%  27.1 MB / 27.1 MB  \r\n\r\n" },
    { t: 3600, type: "output", value: "已成功安装。\r\n" },
    { t: 3800, type: "output", value: "PS C:\\Users\\robin> " },
    { t: 4200, type: "input", value: "claude --version" },
    { t: 4400, type: "output", value: "\r\nClaude Code v2.1.177 (npm + native)\r\n\r\n" },
    { t: 4600, type: "output", value: "PS C:\\Users\\robin> " },
  ],
};
