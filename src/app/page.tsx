import { Sparkles, Zap, Shield, Globe } from "lucide-react";
import { HeroCTA } from "@/components/home/hero-cta";
import { ToolCard } from "@/components/home/tool-card";
import { TipsEntry } from "@/components/home/tips-entry";
import { CustomizeEntry } from "@/components/home/customize-entry";
import { getReadyTools, getAllTools } from "@/lib/content";

export default function HomePage() {
  const readyTools = getReadyTools();
  const allTools = getAllTools();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
      {/* Hero */}
      <section className="mb-12 text-center">
        {/* Badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-accent-glow)] border border-[hsla(218,80%,58%,0.2)] px-5 py-2.5 text-[15px] font-medium text-[var(--color-accent)] animate-fade-in">
          <Sparkles className="h-4 w-4" />
          中文 AI 编程工具一站式配置指南
        </div>

        {/* Title */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl animate-fade-up">
          AI 开发工具
          <br />
          <span className="gradient-text">配置全攻略</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed animate-fade-up stagger-2" style={{color: 'var(--color-text-secondary)'}}>
          7 款主流 AI 编程工具的安装配置指南与知识库。覆盖终端美化、MCP 调试、Token 优化和跨平台方案。提供可复制的命令参考，支撑多平台开发和问题排查。
        </p>

        {/* CTA Buttons — 玻璃态 */}
        <div className="mt-8 animate-fade-up stagger-3">
          <HeroCTA />
        </div>

        {/* Feature badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[15px] animate-fade-up stagger-4" style={{color: 'var(--color-text-secondary)'}}>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" style={{color: 'var(--color-warning)'}} />
            逐步引导，命令可直接复制
          </span>
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4" style={{color: 'var(--color-success)'}} />
            Windows / macOS / Linux 跨平台覆盖
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4" style={{color: 'hsl(262 70% 62%)'}} />
            涵盖安装、配置、排查与进阶
          </span>
        </div>
      </section>

      {/* 开始之前 — 装备 + 技巧 */}
      <section className="mb-20 border-t pt-12" style={{ borderColor: "var(--color-border-subtle)" }}>
        <div className="mb-6">
          <h2 className="text-[22px] font-bold" style={{ color: "var(--color-text-primary)" }}>
            开始之前
          </h2>
          <p className="mt-1 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
            装好工具只是第一步——终端美化与效率技巧，让 AI 编程体验更进一步
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 auto-rows-fr">
          <div className="animate-fade-up stagger-1">
            <CustomizeEntry />
          </div>
          <div className="animate-fade-up stagger-2">
            <TipsEntry />
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-[22px] font-bold" style={{color: 'var(--color-text-primary)'}}>
              选择你的工具
            </h2>
            <p className="mt-1 text-[15px]" style={{color: 'var(--color-text-secondary)'}}>
              主流 AI 编程工具，从安装到进阶
            </p>
          </div>
          <span className="text-[14px] rounded-lg px-3 py-1.5" style={{
            color: 'var(--color-text-secondary)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-subtle)',
          }}>
            {readyTools.length} 个就绪
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {readyTools.map((tool, i) => (
            <div key={tool.id} className={`animate-fade-up stagger-${i + 1}`}>
              <ToolCard tool={tool} index={i} />
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        {allTools.filter((t) => t.status === "coming-soon").length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-[18px] font-semibold" style={{color: 'var(--color-text-muted)'}}>
                即将上线
              </h2>
              <div className="h-px flex-1" style={{background: 'var(--color-border-subtle)'}} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 opacity-45 hover:opacity-60 transition-opacity">
              {allTools
                .filter((t) => t.status === "coming-soon")
                .map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
