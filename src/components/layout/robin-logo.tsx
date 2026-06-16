"use client";

import Image from "next/image";
import robinLogoSrc from "@/../public/robin-logo.png";

/**
 * Robin Tools — 知更鸟几何徽章 Logo
 *
 * 崩铁知更鸟灵感：盾形轮廓 + 金色光环 + 紫色主调 + 音符/铃铛
 * 侧视图鸟形，几何扁平风格
 */
export function RobinLogo({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={robinLogoSrc}
      alt="Robin Tools"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
