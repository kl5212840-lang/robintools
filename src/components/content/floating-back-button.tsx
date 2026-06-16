"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingBackButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className="inline-flex items-center rounded-xl shadow-lg overflow-hidden"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-strong)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }}
          >
            {/* Back to list */}
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--color-surface-overlay)]"
              style={{ color: "var(--color-text-secondary)" }}
              title="返回文章列表"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">返回列表</span>
            </Link>

            {/* Divider */}
            <div
              className="h-5 w-px"
              style={{ background: "var(--color-border-subtle)" }}
            />

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--color-surface-overlay)]"
              style={{ color: "var(--color-text-secondary)" }}
              title="回到顶部"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">顶部</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
