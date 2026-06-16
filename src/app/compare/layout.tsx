import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "工具对比 — AI 开发工具横向对比",
  description:
    "Claude Code、Codex CLI、Cursor、GitHub Copilot、Windsurf 全方位对比：价格、模型、安装难度、界面、国内直连、Git 集成等维度。",
  openGraph: {
    title: "AI 开发工具横向对比 | AI Tools Guide",
    description:
      "Claude Code、Codex CLI、Cursor、GitHub Copilot、Windsurf 全方位对比：价格、模型、安装难度、界面、国内直连、Git 集成等维度。",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
