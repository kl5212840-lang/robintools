"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, FileText, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNavIndex, filterNav, type NavItem } from "@/lib/search";

const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);
const modKey = isMac ? "⌘" : "Ctrl";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<NavItem[]>([]);

  // Update results whenever open or query changes
  useEffect(() => {
    if (!open) return;
    const items = getNavIndex();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(filterNav(query, items));
    setActiveIndex(0);
  }, [query, open]);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      navigate(results[activeIndex].href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Trigger button — desktop: full button, mobile: icon only */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-border-strong)] md:px-3 md:py-1.5 px-0 py-0 h-11 w-11 md:h-auto md:w-auto justify-center md:justify-start text-[13px]"
        aria-label="搜索"
        style={{ color: "var(--color-text-muted)" }}
      >
        <Search className="h-4 w-4 md:h-3.5 md:w-3.5" />
        <span className="hidden lg:inline">搜索...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-mono" style={{ background: "var(--color-surface-overlay)" }}>
          {modKey}K
        </kbd>
      </button>

      {/* Overlay + panel — Portal to body to escape LiquidGlass stacking context */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="fixed left-1/2 top-[20%] z-[101] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--color-border-strong)] shadow-2xl"
                  style={{ background: "var(--color-surface)" }}
                >
                  {/* Input */}
                  <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3">
                    <Search className="h-4 w-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="搜索工具或指南..."
                      className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-[var(--color-text-disabled)]"
                      style={{ color: "var(--color-text-primary)" }}
                    />
                    <kbd className="rounded px-1.5 py-0.5 text-[11px] font-mono" style={{ background: "var(--color-surface-overlay)", color: "var(--color-text-muted)" }}>
                      ESC
                    </kbd>
                  </div>

                  {/* Results */}
                  <div className="max-h-80 overflow-y-auto p-2">
                    {results.length === 0 ? (
                      <p className="px-3 py-8 text-center text-[14px]" style={{ color: "var(--color-text-muted)" }}>
                        没有找到匹配的结果
                      </p>
                    ) : (
                      results.map((item, i) => (
                        <button
                          key={item.href}
                          onClick={() => navigate(item.href)}
                          className="flex w-full items-center gap-3 rounded-lg text-left transition-colors"
                          style={{
                            background: i === activeIndex ? "var(--color-accent-glow)" : "transparent",
                            padding: item.level === "step" ? "6px 12px 6px 28px" : "10px 12px",
                          }}
                          onMouseEnter={() => setActiveIndex(i)}
                        >
                          {item.level === "article" ? (
                            <FileText className="h-4 w-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                          ) : item.level === "troubleshoot" ? (
                            <Wrench className="h-4 w-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                          ) : null}
                          <span className="flex-1 min-w-0">
                            <span className={`block font-medium truncate ${item.level === "step" ? "text-[14px]" : "text-[15px]"}`} style={{ color: "var(--color-text-primary)" }}>
                              {item.level === "step" ? <span style={{ color: "var(--color-text-muted)", marginRight: "4px" }}>›</span> : null}
                              {item.title}
                            </span>
                            <span className="block text-[12px] mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
                              {item.subtitle}
                            </span>
                          </span>
                          <CornerDownLeft className="h-3 w-3 shrink-0 opacity-40" style={{ color: "var(--color-text-muted)" }} />
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
