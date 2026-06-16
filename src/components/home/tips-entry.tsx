"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function TipsEntry() {
  return (
    <Link href="/articles?category=tips" className="block h-full group">
      <div
        className="rounded-[1rem] p-5 h-full flex flex-col justify-between transition-colors duration-200 group-hover:brightness-95"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          minHeight: "100%",
        }}
      >
        <div>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mb-3"
            style={{
              background: "linear-gradient(135deg, hsla(42,96%,60%,0.18), hsla(218,80%,58%,0.18))",
              color: "var(--color-warning)",
              border: "1px solid hsla(42,96%,60%,0.28)",
            }}
          >
            <Zap className="h-5 w-5" />
          </div>

          <h3 className="text-[18px] font-bold tracking-tight mb-1.5" style={{ color: "var(--color-text-primary)" }}>
            效率与技巧
          </h3>
          <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>
            Token 精算、上下文管理、AI 协作方式 — 装好之后的进阶
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {["Token", "上下文", "协作", "提效"].map((t) => (
              <span
                key={t}
                className="text-[12px] px-2.5 py-1 rounded-md border transition-colors group-hover:border-[var(--color-border-strong)]"
                style={{
                  color: "var(--color-text-muted)",
                  borderColor: "var(--color-border-subtle)",
                  background: "var(--color-surface-raised)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div
          className="text-[13px] font-medium opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
          style={{ color: "var(--color-accent)" }}
        >
          浏览 →
        </div>
      </div>
    </Link>
  );
}
