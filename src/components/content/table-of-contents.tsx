"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TocItem {
  id: string;
  title: string;
  number?: string;
}

interface TableOfContentsProps {
  /** "sidebar" = desktop sticky right rail | "inline" = mobile collapsible block */
  variant: "sidebar" | "inline";
  /** CSS selector to scope heading extraction (e.g. ".wizard-content") */
  containerSelector?: string;
}

export function TableOfContents({
  variant,
  containerSelector = ".wizard-content",
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollLock = useRef(false);

  // --- Extract h2[id] headings from the scoped container ---
  useEffect(() => {
    // Small delay to ensure DOM is painted (SSR → hydration)
    const raf = requestAnimationFrame(() => {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      const headings = container.querySelectorAll("h2[id]");
      const extracted: TocItem[] = [];
      headings.forEach((h) => {
        const text = h.textContent || "";
        // Detect Chinese-numbered headings like "一、xxx" or "二、xxx"
        const match = text.match(/^([一二三四五六七八九十]+)、(.+)/);
        extracted.push({
          id: h.id,
          title: match ? match[2] : text,
          number: match ? match[1] : undefined,
        });
      });
      setItems(extracted);
    });
    return () => cancelAnimationFrame(raf);
  }, [containerSelector]);

  // --- IntersectionObserver: track which heading is in view ---
  useEffect(() => {
    if (items.length === 0) return;

    // Disconnect previous observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (scrollLock.current) return;
        // Find the heading closest to the top of the viewport among visible ones
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // rootMargin: account for sticky nav + some breathing room
        rootMargin: "-100px 0px -55% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  // --- Smooth scroll to heading ---
  const scrollTo = useCallback((id: string) => {
    scrollLock.current = true;
    setActiveId(id);

    const el = document.getElementById(id);
    if (!el) { scrollLock.current = false; return; }

    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });

    const release = () => {
      scrollLock.current = false;
      document.removeEventListener("scrollend", release);
    };
    document.addEventListener("scrollend", release, { once: true });
    setTimeout(release, 600);
  }, []);

  if (items.length === 0) return null;

  // ==================== SIDEBAR (desktop) ====================
  if (variant === "sidebar") {
    return (
      <nav
        className="flex flex-col gap-1"
      >
        <h4
          className="text-[12px] font-semibold mb-1 uppercase tracking-wider px-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          目录
        </h4>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              title={item.title}
              className="block w-full text-left rounded-md transition-colors border-l-2 py-1.5 px-3 text-[13px] leading-snug truncate"
              style={{
                color: isActive
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
                background: isActive
                  ? "var(--color-accent-glow)"
                  : "transparent",
                borderLeftColor: isActive
                  ? "var(--color-accent)"
                  : "transparent",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {item.number && (
                <span className="mr-1 opacity-60">{item.number}.</span>
              )}
              {item.title}
            </button>
          );
        })}
      </nav>
    );
  }

  // ==================== INLINE (mobile) ====================
  return (
    <div className="mb-5">
      <div
        className="flex gap-2 overflow-x-auto pb-1.5"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex items-center gap-1.5 shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200"
              style={{
                scrollSnapAlign: "start",
                background: isActive ? "var(--color-accent)" : "var(--color-surface-overlay)",
                color: isActive ? "#fff" : "var(--color-text-muted)",
                boxShadow: isActive ? "0 2px 8px var(--color-accent-glow)" : "none",
                border: isActive ? "none" : "1px solid var(--color-border-subtle)",
              }}
            >
              {item.number && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.2)" : "var(--color-surface)",
                    color: isActive ? "#fff" : "var(--color-text-muted)",
                  }}>
                  {item.number}
                </span>
              )}
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
