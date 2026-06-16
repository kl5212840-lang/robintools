import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/content/articles";
import { ArticleList } from "@/components/content/article-list";

export const metadata: Metadata = {
  title: "定制 | AI Tools Guide",
  description: "终端美化与状态监控——让 AI 编程工具的体验更顺手",
};

export default function CustomizePage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* ======== ORIENTATION CARD ======== */}
      <Link href="/articles/ai-pair-workflow" className="block group mb-8 animate-fade-up">
        <div
          className="rounded-xl px-5 py-4 transition-colors duration-200 group-hover:brightness-95"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderLeft: "3px solid var(--color-accent)",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5 select-none">📖</span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold" style={{ color: "var(--color-text-primary)" }}>
                阅读本站前
              </p>
              <p className="text-[14px] mt-0.5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                本站所有指南默认面对"手动操作"场景，但实际上这些命令和配置都可以交给 AI 编程工具执行——
                粘贴到对话框让它代劳。了解如何从"动手做"切换到"指挥做"
                <ArrowRight className="inline h-3.5 w-3.5 ml-1 -mt-0.5" style={{ color: "var(--color-accent)" }} />
              </p>
            </div>
          </div>
        </div>
      </Link>

      <ArticleList
        articles={articles
          .filter((a) => a.slug !== "ai-pair-workflow")
          .map((a) => ({
            slug: a.slug,
            title: a.title,
            summary: a.summary,
            date: a.date,
            category: a.category,
            tags: a.tags,
          }))}
        defaultCategory="customize"
        title="定制"
        description="终端美化与状态监控——让 AI 编程工具的体验更顺手"
      />
    </div>
  );
}
