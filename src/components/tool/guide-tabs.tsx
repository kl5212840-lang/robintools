"use client";

import { useEffect } from "react";
import { Download, Settings, Wrench, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiquidGlass } from "@/components/layout/liquid-glass";
import { ToolWizard } from "@/components/tool/tool-wizard";
import type { GuideType } from "@/lib/types";

interface Props {
  toolId: string;
  activeGuide: string;
  guideTypes: GuideType[];
}

export function GuideTabs({ toolId, activeGuide, guideTypes }: Props) {

  // Expand problem card from URL hash — handles 3 scenarios:
  // 1. Navigate from install page (activeGuide change triggers effect)
  // 2. Direct page load with hash (mount + activeGuide = troubleshoot)
  // 3. Back/forward or in-page anchor (hashchange / popstate)
  useEffect(() => {
    if (activeGuide !== "troubleshoot") return;

    const expandFromHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const el = document.getElementById(hash.slice(1));
      if (!(el instanceof HTMLDetailsElement)) return;
      el.open = true;
      // Double rAF: frame 1 for React render, frame 2 for layout after expand
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 88;
          window.scrollTo({ top, behavior: "smooth" });
        });
      });
    };

    const timer = setTimeout(expandFromHash, 120);
    window.addEventListener("hashchange", expandFromHash);
    window.addEventListener("popstate", expandFromHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", expandFromHash);
      window.removeEventListener("popstate", expandFromHash);
    };
  }, [activeGuide]);

  return (
    <Tabs
      defaultValue={activeGuide}
      className="animate-fade-up stagger-2"
    >
      <LiquidGlass variant="light" rounded="1rem" className="mb-10 p-1.5">
        <TabsList className="h-auto gap-1 bg-transparent p-0" variant="line">
          {guideTypes.map((gt) => (
            <TabsTrigger
              key={gt.id}
              value={gt.id}
              className="gap-1.5 sm:gap-2.5 rounded-lg sm:rounded-xl px-2 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-[16px] font-semibold whitespace-nowrap transition-all duration-200 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)] data-active:!text-white data-active:!bg-[var(--color-accent)] data-active:shadow-lg data-active:shadow-[var(--color-accent-glow)] data-active:scale-[1.02] data-active:cursor-default data-active:pointer-events-none data-active:ring-2 data-active:ring-[var(--color-accent)]/25 data-active:hover:!bg-[var(--color-accent)]"
            >
              {gt.id === "install" && <Download className="h-[18px] w-[18px]" />}
              {gt.id === "config" && <Settings className="h-[18px] w-[18px]" />}
              {gt.id === "troubleshoot" && <Wrench className="h-[18px] w-[18px]" />}
              {gt.id === "tutorial" && <BookOpen className="h-[18px] w-[18px]" />}
              {gt.nameZh}
            </TabsTrigger>
          ))}
        </TabsList>
      </LiquidGlass>

      {guideTypes.map((gt) => (
        <TabsContent key={gt.id} value={gt.id}>
          <ToolWizard toolId={toolId} guideType={gt.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
