"use client";

import { useRef, type ReactNode } from "react";

interface ScrollIsolatedProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 滚动隔离容器 — 鼠标悬停时滚轮只滚动容器内部，不触发页面滚动。
 * 当内容高度未超出容器时，正常透传滚轮事件给页面。
 */
export function ScrollIsolated({ children, className, style }: ScrollIsolatedProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    const el = ref.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    // If content fits entirely in the container, let the page scroll
    if (scrollHeight <= clientHeight) return;

    // Dampen scroll speed — sidebar is narrow, raw deltaY is too fast
    const dampened = e.deltaY * 0.35;

    // If scrolling down and not yet at the container bottom, absorb the scroll
    if (e.deltaY > 0 && !atBottom) {
      e.preventDefault();
      el.scrollBy({ top: dampened, behavior: "smooth" });
    }
    // If scrolling up and not yet at the container top, absorb the scroll
    else if (e.deltaY < 0 && !atTop) {
      e.preventDefault();
      el.scrollBy({ top: dampened, behavior: "smooth" });
    }
    // Otherwise (at boundary), let the event bubble to the page
  };

  return (
    <div ref={ref} className={className} style={style} onWheel={handleWheel}>
      {children}
    </div>
  );
}
