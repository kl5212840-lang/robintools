"use client";

import { ReactNode, useState, useCallback, useRef } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  variant?: "light" | "medium" | "heavy";
  className?: string;
  rounded?: string;
  hover?: boolean;
  noClip?: boolean;
  /** 覆盖默认模糊值 */
  blur?: string;
  /** 覆盖背景（如移动端需更深背景时使用） */
  bg?: string;
  /** 是否启用动态光源跟随鼠标 */
  dynamicLight?: boolean;
}

export function LiquidGlass({
  children,
  variant = "medium",
  className = "",
  rounded = "1rem",
  hover = false,
  noClip = false,
  blur: blurOverride,
  bg: bgOverride,
  dynamicLight = false,
}: LiquidGlassProps) {
  const blurAmount = blurOverride || { light: "12px", medium: "14px", heavy: "4px" }[variant];
  const bgValue = bgOverride || `var(--glass-gradient-${variant})`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [lightPos, setLightPos] = useState({ x: "50%", y: "50%" });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dynamicLight || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x: `${x}%`, y: `${y}%` });
    setTilt({
      rx: -((e.clientY - rect.top - rect.height / 2) / rect.height) * 6,
      ry: ((e.clientX - rect.left - rect.width / 2) / rect.width) * 6,
    });
  }, [dynamicLight]);

  const handleMouseLeave = useCallback(() => {
    if (!dynamicLight) return;
    setLightPos({ x: "50%", y: "50%" });
    setTilt({ rx: 0, ry: 0 });
  }, [dynamicLight]);

  return (
    <div
      ref={cardRef}
      className={`${className} ${hover ? "liquid-glass-hover" : ""}`}
      suppressHydrationWarning
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: noClip ? "visible" : "hidden",
        borderRadius: rounded,
        // === 核心：SVG 折射滤镜注入 backdrop 管道 ===
        backdropFilter: `url(#glass-refraction) blur(${blurAmount}) saturate(120%)`,
        WebkitBackdropFilter: `url(#glass-refraction) blur(${blurAmount}) saturate(120%)`,
        // 基底微光渐变 — 由 CSS 变量驱动，自动适配主题
        background: bgValue,
        // 多层阴影（厚度感）— 主题适配值由 CSS 变量提供
        boxShadow: `var(--glass-shine-${variant}), var(--glass-shadow-${variant})`,
        border: "var(--glass-border-refraction)",
        transform: dynamicLight ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` : undefined,
        transition: dynamicLight ? "transform 0.5s ease" : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
      }}
    >
      {/* 动态高光层：随鼠标游走的径向渐变 */}
      {dynamicLight && (
        <div
          style={{
            position: "absolute",
            zIndex: 2,
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            background: `radial-gradient(circle 280px at ${lightPos.x} ${lightPos.y}, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* 边缘高光微拟物线 */}
      <div
        style={{
          position: "absolute",
          zIndex: 3,
          inset: "1px",
          borderRadius: `calc(${rounded} - 1px)`,
          pointerEvents: "none",
          border: "1px solid transparent",
          background: `linear-gradient(135deg, rgba(255,255,255,0.4), transparent 60%, rgba(255,255,255,0.15)) border-box`,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          opacity: 0.9,
        }}
      />

      {/* z=3: 内容层 */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 简化版 SVG 滤镜 — 仅用于 backdrop-filter 管道 */
export function LiquidGlassFilter() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "fixed", pointerEvents: "none", zIndex: -1 }}
    >
      <filter
        id="glass-refraction"
        x="-10%" y="-10%" width="120%" height="120%"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.015"
          numOctaves="2"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="28"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
