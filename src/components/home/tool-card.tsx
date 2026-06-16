"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Box, PenTool, GitBranch, Wind, Clock, Monitor, ChevronRight, LucideIcon } from "lucide-react";
import { LiquidGlass } from "@/components/layout/liquid-glass";
import { Badge } from "@/components/ui/badge";
import { ToolMeta } from "@/lib/types";
import { getDifficultyStars } from "@/lib/content";

const iconMap: Record<string, LucideIcon> = { Terminal, Box, PenTool, GitBranch, Wind };
const platformLabels: Record<string, string> = { windows: "Win", macos: "Mac", linux: "Linux" };

const accentColors: Record<string, { bg: string; border: string; text: string }> = {
  blue:   { bg: "hsla(218,80%,58%,0.10)", border: "hsla(218,80%,58%,0.22)", text: "hsl(218,80%,62%)" },
  emerald:{ bg: "hsla(160,70%,48%,0.10)", border: "hsla(160,70%,48%,0.22)", text: "hsl(160,70%,52%)" },
  purple: { bg: "hsla(265,75%,60%,0.10)", border: "hsla(265,75%,60%,0.22)", text: "hsl(265,75%,64%)" },
  amber:  { bg: "hsla(42,96%,60%,0.10)", border: "hsla(42,96%,60%,0.22)", text: "hsl(42,96%,64%)" },
  teal:   { bg: "hsla(172,70%,42%,0.10)", border: "hsla(172,70%,42%,0.22)", text: "hsl(172,70%,48%)" },
  cyan:   { bg: "hsla(190,80%,48%,0.10)", border: "hsla(190,80%,48%,0.22)", text: "hsl(190,80%,54%)" },
  violet: { bg: "hsla(270,70%,60%,0.10)", border: "hsla(270,70%,60%,0.22)", text: "hsl(270,70%,66%)" },
};

export function ToolCard({ tool }: { tool: ToolMeta; index: number }) {
  const Icon = iconMap[tool.icon] || Terminal;
  const colors = accentColors[tool.color] || accentColors.blue;
  const isComingSoon = tool.status === "coming-soon";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={isComingSoon ? "#" : `/${tool.id}/install`} className={`block h-full group ${isComingSoon ? "pointer-events-none" : ""}`}
        style={{ opacity: isComingSoon ? 0.5 : 1 }}>
        <LiquidGlass variant="medium" hover rounded="1rem" className="h-full">
          <div className="p-5">
            {/* 顶部微光条 */}
            <div className="absolute top-0 left-4 right-4 h-px opacity-40 group-hover:opacity-70 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${colors.text}, transparent)` }} />

            <div className="flex items-start justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl ring-1"
                style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}>
                <Icon className="h-6 w-6" />
              </div>
              {isComingSoon && (
                <Badge variant="secondary" className="text-[13px] px-2.5 py-1"
                  style={{ background:'var(--color-surface-overlay)', color:'var(--color-text-muted)', border:'1px solid var(--color-border-subtle)' }}>
                  即将上线
                </Badge>
              )}
            </div>

            <h3 className="text-[19px] font-bold tracking-tight mb-1.5" style={{color:'var(--color-text-primary)'}}>{tool.name}</h3>
            <p className="text-[15px] leading-relaxed line-clamp-2 mb-3" style={{color:'var(--color-text-secondary)'}}>{tool.description}</p>

            <div className="flex flex-wrap items-center gap-3 text-[14px] mb-3" style={{color:'var(--color-text-muted)'}}>
              <span style={{color: colors.text}}>{getDifficultyStars(tool.difficulty)}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{tool.estimatedTime}</span>
              <span className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5" />{tool.platforms.map(p => platformLabels[p]||p).join(" / ")}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["install","config","troubleshoot"].map(g => (
                <span key={g} className="text-[12px] px-2.5 py-1 rounded-md border transition-colors group-hover:border-[var(--color-border-strong)]"
                  style={{color:'var(--color-text-muted)',borderColor:'var(--color-border-subtle)',background:'var(--color-surface-raised)'}}>
                  {g==="install"?"安装":g==="config"?"配置":"排查"}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-1 text-[13px] font-medium opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              style={{color: colors.text}}>
              {isComingSoon ? "即将上线" : <>查看指南 <ChevronRight className="h-3.5 w-3.5" /></>}
            </div>
          </div>
        </LiquidGlass>
      </Link>
    </motion.div>
  );
}
