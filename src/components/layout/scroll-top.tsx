"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Article pages have their own unified floating action group
  const isArticlePage = pathname.startsWith("/articles/");

  useEffect(() => {
    if (isArticlePage) return;
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isArticlePage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible || isArticlePage) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-lg transition-all hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] hover:scale-105 animate-fade-in"
      aria-label="回到顶部"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
