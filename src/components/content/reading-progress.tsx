"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function ReadingProgress() {
  const raw = useMotionValue(0);
  const scaleX = useSpring(raw, { stiffness: 100, damping: 30 });

  useEffect(() => {
    document.documentElement.style.setProperty("--navbar-top", "2px");
    return () => { document.documentElement.style.removeProperty("--navbar-top"); };
  }, []);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      raw.set(h > 0 ? window.scrollY / h : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [raw]);

  return (
    <>
      {/* 轨道底层：磨砂背景挡住 2px 间隙，防止页面内容穿透 */}
      <div
        className="fixed top-0 left-0 right-0 z-[109] h-[2px]"
        style={{
          backdropFilter: "blur(4px) saturate(180%)",
          WebkitBackdropFilter: "blur(4px) saturate(180%)",
          background: "var(--color-surface)",
        }}
      />
      {/* 进度指示条 — 亮色用 accent 深蓝，暗色用浅蓝，各带微弱发光 */}
      <motion.div
        style={{ scaleX, background: "var(--color-progress-bar)" }}
        className="fixed top-0 left-0 right-0 z-[110] h-[2px] origin-left"
        aria-hidden="true"
      >
        <div className="absolute inset-0 opacity-60" style={{
          boxShadow: "0 0 6px 1px var(--color-progress-bar-glow)",
        }} />
      </motion.div>
    </>
  );
}
