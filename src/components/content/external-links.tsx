"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, ChevronDown, MessageCircle, Video, Code } from "lucide-react";

interface LinkItem {
  name: string;
  url: string;
  desc: string;
}

const aiPlatforms: LinkItem[] = [
  { name: "豆包", url: "https://www.doubao.com", desc: "字节跳动 AI 对话助手" },
  { name: "DeepSeek", url: "https://chat.deepseek.com", desc: "深度求索 AI 对话" },
  { name: "通义千问", url: "https://tongyi.aliyun.com/qianwen", desc: "阿里云 AI 助手" },
  { name: "Kimi", url: "https://kimi.moonshot.cn", desc: "月之暗面长文本助手" },
  { name: "元宝", url: "https://yuanbao.tencent.com", desc: "腾讯 AI 助手" },
];

const videoPlatforms: LinkItem[] = [
  { name: "B站搜索教程", url: "https://search.bilibili.com/all?keyword=Claude+Code+%E6%95%99%E7%A8%8B", desc: "视频演示 + 疑难解答" },
];

const codingTools: LinkItem[] = [
  { name: "Cursor", url: "https://cursor.com", desc: "AI 编辑器 · 多文件重构" },
  { name: "Windsurf", url: "https://codeium.com/windsurf", desc: "AI IDE · Cascade 代理" },
  { name: "Claude Code", url: "https://claude.ai/code", desc: "命令行 AI 编程助手" },
  { name: "GitHub Copilot", url: "https://github.com/features/copilot", desc: "IDE 代码补全插件" },
  { name: "Codex CLI", url: "https://github.com/openai/codex", desc: "OpenAI 沙箱编程工具" },
];

function LinkRow({ item }: { item: LinkItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg px-3 py-2 transition-colors hover:bg-[var(--color-surface-overlay)] group"
    >
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
          {item.name}
        </span>
        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-text-muted)" }} />
      </div>
      <div className="text-[12px] truncate mt-0.5" style={{ color: "var(--color-text-muted)" }}>
        {item.desc}
      </div>
    </a>
  );
}

export function ExternalLinks() {
  const [showTools, setShowTools] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toolsPopoverRef = useRef<HTMLDivElement>(null);
  const toolsTriggerRef = useRef<HTMLButtonElement>(null);
  const aiContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Close tools popover on outside click
  useEffect(() => {
    if (!showTools) return;
    const handleClick = (e: MouseEvent) => {
      if (
        toolsPopoverRef.current &&
        !toolsPopoverRef.current.contains(e.target as Node) &&
        toolsTriggerRef.current &&
        !toolsTriggerRef.current.contains(e.target as Node)
      ) {
        setShowTools(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTools]);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Title + description */}
      <div className="mb-3">
        <h4 className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--color-text-primary)" }}>
          有疑问？来这里找答案
        </h4>
        <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          如果对本站内容有疑问，推荐到视频或其他知识性平台寻求解决方法，也可直接向 AI 提问获得参考性回答（注意分辨 AI 回答的正确性）
        </p>
      </div>

      <div className="space-y-0.5">
        {/* Video — always visible, first */}
        <div className="flex items-center gap-1.5 px-1 mb-1">
          <Video className="h-3 w-3" style={{ color: "var(--color-text-muted)" }} />
          <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            视频教程
          </span>
        </div>
        {videoPlatforms.map((item) => (
          <LinkRow key={item.name} item={item} />
        ))}

        <div className="my-2" style={{ borderTop: "1px solid var(--color-border-subtle)" }} />

        {/* AI Platforms — inline expand/collapse */}
        <div>
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-1.5 px-1 w-full text-left hover:opacity-80 transition-opacity rounded py-0.5"
          >
            <MessageCircle className="h-3 w-3" style={{ color: showAI ? "var(--color-accent)" : "var(--color-text-muted)" }} />
            <span
              className="text-[11px] font-medium uppercase tracking-wider"
              style={{ color: showAI ? "var(--color-accent)" : "var(--color-text-muted)" }}
            >
              国内 AI 平台
            </span>
            <ChevronDown
              className={`h-3 w-3 ml-auto transition-transform duration-200 ${showAI ? "rotate-180" : ""}`}
              style={{ color: showAI ? "var(--color-accent)" : "var(--color-text-muted)" }}
            />
          </button>
          {showAI && (
            <div ref={aiContentRef} className="pt-0.5">
              {aiPlatforms.map((item) => (
                <LinkRow key={item.name} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="my-2" style={{ borderTop: "1px solid var(--color-border-subtle)" }} />

        {/* AI Coding Tools — popover (unchanged) */}
        <div className="relative">
          <button
            ref={toolsTriggerRef}
            onClick={() => setShowTools(!showTools)}
            className="flex items-center gap-1.5 px-1 w-full text-left hover:opacity-80 transition-opacity rounded py-0.5"
          >
            <Code className="h-3 w-3" style={{ color: showTools ? "var(--color-accent)" : "var(--color-text-muted)" }} />
            <span
              className="text-[11px] font-medium uppercase tracking-wider"
              style={{ color: showTools ? "var(--color-accent)" : "var(--color-text-muted)" }}
            >
              AI 编程工具
            </span>
            <ChevronDown
              className={`h-3 w-3 ml-auto transition-transform duration-200 ${showTools ? "rotate-180" : ""}`}
              style={{ color: showTools ? "var(--color-accent)" : "var(--color-text-muted)" }}
            />
          </button>

          {/* Popover — desktop: opens left of sidebar, mobile: opens above */}
          {showTools && (
            <div
              ref={toolsPopoverRef}
              className="absolute z-50 rounded-xl p-2 shadow-xl animate-scale-in"
              style={{
                ...(isMobile
                  ? { left: 0, bottom: "100%", width: "100%", marginBottom: "4px" }
                  : { right: "calc(100% + 8px)", bottom: 0, width: "220px" }),
                maxHeight: "60vh",
                overflowY: "auto",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-strong)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
            >
              {codingTools.map((item) => (
                <LinkRow key={item.name} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
