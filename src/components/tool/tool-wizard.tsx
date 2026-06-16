"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Monitor, Apple, Layout, FileText, ArrowLeft } from "lucide-react";
import { getGuideEntry } from "@/content/guides/registry";
import { ExpandProvider } from "@/content/guides/_shared";
import { LiquidGlass } from "@/components/layout/liquid-glass";
import { ExternalLinks } from "@/components/content/external-links";
import { cn } from "@/lib/utils";

type Platform = "windows" | "macos" | "linux";

const platformIcons: Record<Platform, typeof Monitor> = {
  windows: Monitor,
  macos: Apple,
  linux: Layout,
};

const platformNames: Record<Platform, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};


export function ToolWizard({ toolId, guideType }: { toolId: string; guideType: string }) {
  const entry = getGuideEntry(toolId, guideType);
  const steps = useMemo(() => entry?.steps || [], [entry]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("windows");
  const [expandAll, setExpandAll] = useState<boolean | null>(null);
  const scrollLock = useRef(false);

  // IntersectionObserver 追踪当前滚动到了哪个章节 — 和文章目录完全相同的方案
  useEffect(() => {
    const ids = steps.map((s) => s.anchorId);
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollLock.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const idx = ids.indexOf(visible[0].target.id);
          if (idx >= 0) setActiveStep(idx);
        }
      },
      { rootMargin: "-88px 0px -55% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [steps, guideType]);

  const scrollToSection = useCallback((anchorId: string, stepIndex: number) => {
    scrollLock.current = true;
    setActiveStep(stepIndex);

    const el = document.getElementById(anchorId);
    if (!el) { scrollLock.current = false; return; }

    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });

    const release = () => {
      scrollLock.current = false;
      document.removeEventListener("scrollend", release);
    };
    document.addEventListener("scrollend", release, { once: true });
    setTimeout(release, 600);
  }, []);

  return (
    <div className="guide-layout grid gap-6">
      {/* Sidebar — sticky glass card with anchor navigation */}
      <aside className="hidden md:block">
        <div className="sticky top-20 z-10" style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        <LiquidGlass variant="light" rounded="1.2rem" className="p-4">
          <h4 className="mb-4 text-[16px] font-semibold" style={{color: 'var(--color-text-secondary)'}}>
            本页导航
          </h4>
          <nav className="space-y-0.5">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => scrollToSection(step.anchorId, i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-[16px] leading-tight transition-colors duration-200 hover:bg-[var(--color-surface-overlay)]",
                    isActive ? "font-semibold" : ""
                  )}
                  style={{
                    background: isActive ? 'var(--color-accent-glow)' : 'transparent',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                >
                  <span className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors",
                  )} style={{
                    background: isActive ? 'var(--color-accent-glow)' : 'var(--color-surface-overlay)',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}>
                    {i + 1}
                  </span>
                  <span className="leading-tight truncate min-w-0" title={step.label}>{step.label}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0" style={{color: 'var(--color-accent)'}} />
                  )}
                </button>
              );
            })}
          </nav>

        </LiquidGlass>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        {/* Platform tabs — only shown for platform-aware guides */}
        {entry?.showPlatformTabs !== false ? (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-1.5">
              {(["windows", "macos", "linux"] as Platform[]).map((p) => {
                const PIcon = platformIcons[p];
                const isActive = selectedPlatform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    aria-label={`切换到 ${platformNames[p]} 平台`}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[15px] font-semibold transition-all duration-200",
                    )}
                    style={{
                      background: isActive ? 'var(--color-accent)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--color-text-muted)',
                      boxShadow: isActive ? '0 2px 8px var(--color-accent-glow)' : 'none',
                      pointerEvents: isActive ? 'none' : 'auto',
                    }}
                  >
                    <PIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{platformNames[p]}</span>
                  </button>
                );
              })}
              <span className="w-px h-6 mx-0.5" style={{ background: 'var(--color-border-subtle)' }} />
              <button
                onClick={() => setExpandAll(prev => prev === true ? false : true)}
                className="shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200"
                style={{
                  background: expandAll === true ? 'var(--color-accent-glow)' : 'transparent',
                  color: expandAll === true ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
                title={expandAll === true ? "收起所有折叠内容" : "展开所有折叠内容"}
              >
                {expandAll === true ? "📦 收起" : "📖 展开全部"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px]"
              style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-overlay)' }}>
              <span>🌐 本指南内容三端通用</span>
              <span className="w-px h-4 mx-0.5" style={{ background: 'var(--color-border-subtle)' }} />
              <button
                onClick={() => setExpandAll(prev => prev === true ? false : true)}
                className="rounded-md px-2 py-0.5 text-[13px] font-medium transition-all duration-200"
                style={{
                  background: expandAll === true ? 'var(--color-accent-glow)' : 'transparent',
                  color: expandAll === true ? 'var(--color-accent)' : 'var(--color-text-muted)',
                }}
                title={expandAll === true ? "收起所有折叠内容" : "展开所有折叠内容"}
              >
                {expandAll === true ? "📦 收起" : "📖 展开全部"}
              </button>
            </div>
          </div>
        )}

        {/* Inline step indicator — only on small screens */}
        <div className="md:hidden mb-6 -mx-1">
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => scrollToSection(step.anchorId, i)}
                  className={cn(
                    "flex items-center gap-2 shrink-0 rounded-full px-4 py-2.5 text-[14px] font-medium transition-all duration-200",
                  )}
                  style={{
                    scrollSnapAlign: "start",
                    background: isActive ? 'var(--color-accent)' : 'var(--color-surface-overlay)',
                    color: isActive ? '#fff' : 'var(--color-text-muted)',
                    boxShadow: isActive ? '0 2px 8px var(--color-accent-glow)' : 'none',
                  }}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-surface)',
                      color: isActive ? '#fff' : 'var(--color-text-muted)',
                    }}>
                    {i + 1}
                  </span>
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content card */}
        <div className="rounded-2xl p-6 sm:p-8" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-subtle)',
          overflowWrap: "anywhere",
          minWidth: 0,
        }}>
          {entry ? (
            <ExpandProvider expandAll={expandAll}>
              {entry.render(selectedPlatform)}
            </ExpandProvider>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'var(--color-accent-glow)' }}>
                <FileText className="h-7 w-7" style={{ color: 'var(--color-accent)' }} />
              </div>
              <p className="text-[16px] font-semibold mb-1" style={{color: 'var(--color-text-primary)'}}>内容正在编写中</p>
              <p className="text-[14px] mb-6" style={{color: 'var(--color-text-muted)'}}>该指南内容尚未完成，请稍后再来</p>
              <Link href={`/${toolId}`} className="inline-flex items-center gap-1.5 text-[15px] font-medium hover:underline underline-offset-4 transition-all" style={{ color: 'var(--color-accent)' }}>
                <ArrowLeft className="h-4 w-4" />
                返回 {toolId === 'claude-code' ? 'Claude Code' : toolId === 'codex' ? 'Codex CLI' : toolId === 'cursor' ? 'Cursor' : toolId === 'copilot' ? 'Copilot' : toolId === 'windsurf' ? 'Windsurf' : '首页'}
              </Link>
            </div>
          )}
        </div>

        {/* Inline external links — small screens only */}
        <div className="md:hidden mt-8">
          <ExternalLinks />
        </div>
      </div>

      {/* Right sidebar — external links, sticky */}
      <aside className="hidden md:block">
        <div className="sticky flex flex-col gap-5" style={{ top: "100px", maxHeight: "calc(100vh - 120px)" }}>
          <ExternalLinks />
        </div>
      </aside>
    </div>
  );
}
