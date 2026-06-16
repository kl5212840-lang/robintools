"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { LiquidGlass } from "@/components/layout/liquid-glass";
import { categories, tools } from "@/content/compare-data";

export default function ComparePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="mb-12 text-center animate-fade-up">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-accent-glow)] border border-[hsla(218,80%,58%,0.2)] px-5 py-2.5 text-[15px] font-medium text-[var(--color-accent)]">
          <Sparkles className="h-4 w-4" />
          多维度对比，帮你了解差异
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          AI 编程工具对比
        </h1>
        <p className="mt-4 text-[16px] text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          从价格、功能、国内可用性等维度对比主流 AI 编程工具，供你参考和决策。
        </p>
      </div>

      {/* Comparison Table */}
      <div className="relative mb-8">
      <div className="rounded-[1.2rem] overflow-hidden" style={{ background: "inherit" }}>
      <LiquidGlass variant="medium" rounded="1.2rem" noClip>
        <div className="overflow-x-auto" ref={scrollRef}>
        <table className="text-[14px] sm:text-[15px]" style={{ borderCollapse: "collapse", minWidth: "680px" }} aria-label="AI 编程工具全维度对比">
          <caption className="sr-only">AI 编程工具从类型、价格、AI 模型、安装难度、界面、网络可用性、Git 集成、文件操作、安全沙箱、扩展生态、适用场景等维度的对比</caption>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
              <th className="sticky left-0 z-10 py-4 px-4 text-left font-semibold" style={{ background: "var(--color-surface)", color: "var(--color-text-primary)" }}>
                维度
              </th>
              {tools.map((t) => (
                <th key={t.slug} className="py-4 px-3 text-center font-semibold min-w-[120px]" style={{ color: t.color }}>
                  <Link href={`/${t.slug}/install`} className="hover:underline">{t.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.key} style={{ borderBottom: i < categories.length - 1 ? "1px solid var(--color-border-subtle)" : "none" }}>
                <td className="sticky left-0 z-10 py-3.5 px-4 font-medium whitespace-nowrap" style={{ background: "var(--color-surface)", color: "var(--color-text-secondary)" }}>
                  {cat.label}
                </td>
                {tools.map((t) => {
                  const val = t.data[cat.key as keyof typeof t.data] || "−";
                  const isPositive = val.startsWith("✓") || val.startsWith("✅");
                  const isNegative = val === "−";
                  const isPriceRow = cat.key === "price";
                  const isFree = isPriceRow && (val.includes("免费") || val.includes("低价"));
                  const isPaid = isPriceRow && val.includes("$");
                  return (
                    <td key={t.slug} className="py-4 px-3 text-center" style={{ color: "var(--color-text-primary)" }}>
                      {isPositive ? (
                        <span className="inline-flex items-center gap-1" style={{ color: "var(--color-success)" }}>
                          <Check className="h-3.5 w-3.5" />
                          {val.replace(/^[✓✅]\s*/, "")}
                        </span>
                      ) : isNegative ? (
                        <span style={{ color: "var(--color-text-disabled)" }}>{val}</span>
                      ) : isFree ? (
                        <span style={{ color: "var(--color-success)" }}>{val}</span>
                      ) : isPaid ? (
                        <span style={{ color: "var(--color-text-primary)" }}>{val}</span>
                      ) : (
                        val
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </LiquidGlass>

      {/* Scroll arrow hint */}
      {showArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none flex items-center justify-end"
          style={{ background: "linear-gradient(90deg, transparent, var(--color-surface) 60%)" }}>
          <ChevronRight className="h-5 w-5 animate-pulse mr-1" style={{ color: "var(--color-text-muted)" }} />
        </div>
      )}
      </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-10">
        <p className="text-[15px] text-[var(--color-text-muted)] mb-6">
          不确定选哪个？Claude Code 的社区资源较丰富，是常见的入门选择。
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link href="/claude-code/install" className="btn-glass-primary">
            从 Claude Code 开始 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="text-[15px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
        <div className="mt-8 text-center">
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            内容验证于 2026-06
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--color-text-disabled)" }}>
            价格、版本号、功能特性以各工具官方网站最新信息为准
          </p>
        </div>
      </div>
    </div>
  );
}
