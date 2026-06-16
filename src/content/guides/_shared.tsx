"use client";

/** Shared types, components, and utilities for all guide renderers */
import { createContext, useContext, useRef, useEffect } from "react";
import { AlertTriangle, Info, ExternalLink, ChevronRight } from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";

type Platform = "windows" | "macos" | "linux";
type ContentRenderer = (platform: Platform) => React.ReactElement;

export interface GuideEntry {
  steps: { id: string; label: string; anchorId: string; searchText?: string }[];
  render: ContentRenderer;
  showPlatformTabs?: boolean;
}

/* ================================================================
   展开/收起全局控制 Context
   ================================================================ */

const ExpandContext = createContext<boolean | null>(null);

export function ExpandProvider({ expandAll, children }: { expandAll: boolean | null; children: React.ReactNode }) {
  return <ExpandContext.Provider value={expandAll}>{children}</ExpandContext.Provider>;
}

/* ================================================================
   Collapsible — 原生 <details> 折叠组件
   ================================================================ */

export function Collapsible({
  summary,
  defaultOpen = false,
  keep = false,
  id,
  children,
}: {
  summary: string;
  defaultOpen?: boolean;
  keep?: boolean;
  id?: string;
  children: React.ReactNode;
}) {
  const expandAll = useContext(ExpandContext);
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current && expandAll !== null) {
      ref.current.open = expandAll;
    }
  }, [expandAll]);

  if (keep) return <>{children}</>;

  return (
    <details
      ref={ref}
      id={id}
      open={defaultOpen}
      className="collapsible-section my-4 rounded-xl border border-[var(--color-border-subtle)] [&[open]>summary>svg]:rotate-90"
      style={{ background: "var(--color-surface)" }}
    >
      <summary
        className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none text-[14px] font-medium transition-colors hover:text-[var(--color-accent)]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform" />
        {summary}
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  );
}

/* ================================================================
   公共组件 — Callout / ProblemCard / ConfigTable / FreshnessNote
   ================================================================ */

export function Callout({
  type = "info",
  summary,
  keep,
  children,
}: {
  type?: "info" | "warning" | "danger";
  summary?: string;
  keep?: boolean;
  children: React.ReactNode;
}) {
  const Icon = type === "warning" ? AlertTriangle : Info;
  const color =
    type === "warning"
      ? "var(--color-warning)"
      : type === "danger"
        ? "var(--color-danger)"
        : "var(--color-accent)";
  const bg =
    type === "warning"
      ? "hsla(42,96%,60%,0.06)"
      : type === "danger"
        ? "hsla(0,72%,60%,0.06)"
        : "hsla(218,80%,58%,0.06)";
  const border =
    type === "warning"
      ? "hsla(42,96%,60%,0.18)"
      : type === "danger"
        ? "hsla(0,72%,60%,0.18)"
        : "hsla(218,80%,58%,0.18)";

  const body = (
    <div className="flex items-start gap-3 text-[15px] leading-relaxed">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
      <div>{children}</div>
    </div>
  );

  // 折叠模式：Collapsible 提供外框，Callout 只保留颜色背景
  if (summary && !keep) {
    return (
      <Collapsible summary={summary}>
        <div className="rounded-lg p-3" style={{ background: bg }}>
          {body}
        </div>
      </Collapsible>
    );
  }

  // 独立模式：Callout 自己提供完整外框
  return (
    <div
      className="rounded-xl p-4 my-5 flex items-start gap-3 text-[15px] leading-relaxed"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
      <div>{children}</div>
    </div>
  );
}

export function ProblemCard({
  title,
  desc,
  solution,
  keep,
  id,
  defaultOpen,
}: {
  title: string;
  desc: string;
  solution: React.ReactNode;
  keep?: boolean;
  id?: string;
  defaultOpen?: boolean;
}) {
  const inner = (
    <>
      <h3
        className="text-[16px] font-semibold mb-2 flex items-center gap-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "var(--color-warning)" }} />
        {title}
      </h3>
      <p className="text-[15px] mb-2" style={{ color: "var(--color-text-secondary)" }}>
        {desc}
      </p>
      <div className="text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
        <strong style={{ color: "var(--color-text-primary)" }}>解决：</strong> {solution}
      </div>
    </>
  );

  if (keep) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
      >
        {inner}
      </div>
    );
  }

  return (
    <Collapsible summary={title} id={id} defaultOpen={defaultOpen}>
      <div className="rounded-lg p-3" style={{ background: "var(--color-surface)" }}>
        {inner}
      </div>
    </Collapsible>
  );
}

export function ConfigTable({ rows }: { rows: [string, string][] }) {
  return (
    <div
      className="rounded-xl p-5 my-5"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
    >
      <h3
        className="text-[15px] font-semibold mb-3 flex items-center gap-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        <Info className="h-4 w-4" style={{ color: "var(--color-accent)" }} />
        配置项说明
      </h3>
      <div className="grid gap-2.5 text-[14px]">
        {rows.map(([key, desc]) => (
          <div key={key} className="flex gap-3">
            <code className="shrink-0 text-[13px] font-mono" style={{ color: "var(--color-accent)" }}>
              {key}
            </code>
            <span style={{ color: "var(--color-text-muted)" }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 时效性提示 — 默认折叠。
 */
export function FreshnessNote({ children }: { children?: React.ReactNode }) {
  return (
    <Collapsible summary="时效性说明">
      <p className="text-[13px]" style={{ color: "var(--color-text-disabled)" }}>
        ⚠️ 以上信息可能已过时，请以各平台官方网站的最新公告和定价页面为准。
        {children}
      </p>
    </Collapsible>
  );
}
