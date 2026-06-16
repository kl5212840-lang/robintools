"use client";

import { useState, useCallback } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { useToast } from "@/components/layout/toast";

interface CodeBlockProps {
  code: string;
  language?: string;
  mode?: "split" | "unified";
}

export function CodeBlock({ code, language = "bash", mode = "split" }: CodeBlockProps) {
  return (
    <div
      className="code-block group relative my-5 rounded-xl overflow-hidden"
      style={{
        background: "var(--code-bg, hsla(0,0%,0%,0.55))",
        border: "1px solid var(--color-border-default)",
        boxShadow: mode === "unified" ? "0 2px 8px var(--glass-shadow)" : "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center px-4 py-2"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <span
          className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Terminal className="h-3.5 w-3.5" />
          {language}
        </span>
        {mode === "unified"
          ? <UnifiedCopyButton code={code} />
          : <SplitCopyAllButton code={code} />
        }
      </div>

      {/* Body */}
      {mode === "unified" ? (
        <div className="overflow-x-auto px-4 py-3">
          <pre
            className="text-[15px] leading-relaxed font-mono whitespace-pre-wrap break-all"
            style={{
              color: "var(--code-text, hsl(240 8% 88%))",
              overflowWrap: "anywhere",
              wordBreak: "break-all",
              maxWidth: "100%",
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
      ) : (
        <div className="overflow-x-auto px-2 py-2">
          {code.split("\n").map((line, i) => {
            const t = line.trim();
            if (!t) return <div key={i} className="h-1.5" />;
            if (t.startsWith("#") || t.startsWith("//")) {
              return (
                <div key={i} className="flex items-center px-3 py-0.5">
                  <span className="text-[14px] font-mono leading-relaxed opacity-55 select-none break-all" style={{
                    color: "var(--color-text-muted)",
                    overflowWrap: "anywhere",
                    wordBreak: "break-all",
                  }}>
                    {line}
                  </span>
                </div>
              );
            }
            return <CodeLine key={i} line={line} />;
          })}
        </div>
      )}
    </div>
  );
}

function CodeLine({ line }: { line: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(line.trim());
    setCopied(true);
    toast.show("已复制到剪贴板");
    setTimeout(() => setCopied(false), 1800);
  }, [line, toast]);

  return (
    <div
      className="group/line flex items-center gap-2 px-3 py-0.5 rounded-md transition-colors"
      style={{ background: "var(--code-line-hover, rgba(255,255,255,0.03))" }}
    >
      <code
        className="flex-1 text-[15px] font-mono leading-relaxed whitespace-pre-wrap break-all"
        style={{
          color: "var(--code-text, hsl(240 8% 88%))",
          overflowWrap: "anywhere",
          wordBreak: "break-all",
          maxWidth: "100%",
        }}
      >
        {line}
      </code>
      <button
        onClick={handleCopy}
        aria-label={copied ? "已复制" : "复制此行"}
        className="shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-200 opacity-0 group-hover/line:opacity-100"
        style={{
          color: copied ? "#fff" : "var(--color-text-muted)",
          background: copied ? "var(--color-success)" : "transparent",
          minWidth: copied ? "64px" : "auto",
          justifyContent: "center",
        }}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            已复制
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            复制
          </>
        )}
      </button>
    </div>
  );
}

function SplitCopyAllButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  /** 去掉注释和空行，保留纯命令 */
  const stripComments = (raw: string): string =>
    raw
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        return t && !t.startsWith("#") && !t.startsWith("//");
      })
      .join("\n");

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(stripComments(code).trim());
    setCopied(true);
    toast.show("已复制全部命令（已去除注释）");
    setTimeout(() => setCopied(false), 2000);
  }, [code, toast]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "已复制" : "复制全部命令"}
      className="ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{
        color: copied ? "#fff" : "var(--color-text-muted)",
        background: copied ? "var(--color-success)" : "transparent",
        minWidth: copied ? "80px" : "auto",
        justifyContent: "center",
      }}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          已复制
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          复制全部
        </>
      )}
    </button>
  );
}

function UnifiedCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    toast.show("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  }, [code, toast]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "已复制" : "复制全部代码"}
      className="ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{
        color: copied ? "#fff" : "var(--color-text-muted)",
        background: copied ? "var(--color-success)" : "transparent",
        minWidth: copied ? "80px" : "auto",
        justifyContent: "center",
      }}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          已复制
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          复制全部
        </>
      )}
    </button>
  );
}
