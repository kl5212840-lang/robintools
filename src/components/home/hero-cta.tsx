"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LiquidGlass } from "@/components/layout/liquid-glass";

export function HeroCTA() {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="inline-block"
    >
      <Link href="/claude-code/install" className="block">
        <LiquidGlass variant="medium" rounded="1.2rem" hover>
          <div className="flex flex-col items-center gap-2 px-10 py-5 min-w-[260px]">
            <span className="text-[18px] font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              开始配置
            </span>
            <span className="flex items-center gap-2 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
              从 Claude Code 开始，逐步完成配置
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </LiquidGlass>
      </Link>
    </motion.div>
  );
}
