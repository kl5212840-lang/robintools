import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, ChevronRight } from "lucide-react";
import { getArticle, getAllArticles } from "@/content/articles";
import { ReadingProgress } from "@/components/content/reading-progress";
import { TableOfContents } from "@/components/content/table-of-contents";
import { FloatingBackButton } from "@/components/content/floating-back-button";
import { LiquidGlass } from "@/components/layout/liquid-glass";
import { ExternalLinks } from "@/components/content/external-links";
import { ScrollIsolated } from "@/components/content/scroll-isolated";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | AI Tools Guide`,
    description: article.summary,
    openGraph: { title: article.title, description: article.summary },
    twitter: { title: article.title, description: article.summary },
  };
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <ReadingProgress />
      <FloatingBackButton />

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* ========== Enhanced breadcrumb ========== */}
        <nav className="mb-6 flex items-center gap-1.5 text-[14px] animate-fade-up" style={{ color: "var(--color-text-muted)" }}>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 font-medium transition-colors"
            style={{ color: "var(--color-accent)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            技术笔记
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-40" />
          <span className="truncate max-w-[320px]" style={{ color: "var(--color-text-primary)" }}>
            {article.title}
          </span>
        </nav>

        {/* ========== Inline ToC — small screens only ========== */}
        <div className="md:hidden animate-fade-up">
          <TableOfContents variant="inline" />
        </div>

        {/* ========== Desktop layout: ToC (left) + article (center) + ExternalLinks (right) ========== */}
        <div className="guide-layout grid gap-6">
          {/* Left sidebar — sticky ToC, matches guide detail page layout */}
          <aside className="hidden md:block">
            <div className="sticky flex flex-col gap-5" style={{ top: "100px", maxHeight: "calc(100vh - 120px)" }}>
              <LiquidGlass variant="light" rounded="1.2rem" className="p-4">
                <ScrollIsolated
                  className="flex flex-col flex-1 min-h-0"
                  style={{ overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}
                >
                  <TableOfContents variant="sidebar" />
                </ScrollIsolated>
              </LiquidGlass>
            </div>
          </aside>

          {/* Main content column */}
          <div className="min-w-0">
            <article className="animate-fade-up">
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: article.title,
                    description: article.summary,
                    datePublished: article.date,
                    dateModified: article.date,
                    author: { "@type": "Organization", name: "AI Tools Guide" },
                    publisher: { "@type": "Organization", name: "AI Tools Guide", url: "https://robinupup.com" },
                    mainEntityOfPage: `https://robinupup.com/articles/${article.slug}`,
                  }),
                }}
              />
              {/* Title + meta */}
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: "var(--color-text-primary)" }}>
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[13px]" style={{ color: "var(--color-text-muted)" }}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    {article.tags.join(" · ")}
                  </span>
                </div>
              </div>

              {/* Article body */}
              <div className="rounded-2xl p-6 sm:p-8" style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                overflowWrap: "anywhere",
                minWidth: 0,
              }}>
                {article.render()}
              </div>
            </article>

            {/* ========== AI协作提示 ========== */}
            <div className="mt-6 rounded-xl px-5 py-3 text-center text-[13px] leading-relaxed"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                color: "var(--color-text-muted)",
              }}>
              本文中的大部分命令和配置都可以交给 AI 编程工具执行——粘贴到对话框让它代劳。
              涉及密钥、浏览器操作或系统级修改的步骤除外。
              {slug !== "ai-pair-workflow" && (
                <Link
                  href="/articles/ai-pair-workflow"
                  className="ml-1 font-medium hover:underline underline-offset-4 transition-colors"
                  style={{ color: "var(--color-accent)" }}
                >
                  详见《从「动手做」到「指挥做」》
                </Link>
              )}
            </div>

            {/* Inline external links — small screens only */}
            <div className="md:hidden mt-8">
              <ExternalLinks />
            </div>

            {/* Bottom back link */}
            <div className="mt-10 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium hover:text-[var(--color-accent)] hover:underline underline-offset-4 transition-all duration-200"
                style={{ color: "var(--color-text-muted)" }}
              >
                <ArrowLeft className="h-4 w-4" />
                返回文章列表
              </Link>
            </div>
          </div>

          {/* Right sidebar — ExternalLinks, matches guide detail page layout */}
          <aside className="hidden md:block">
            <div className="sticky flex flex-col gap-5" style={{ top: "100px", maxHeight: "calc(100vh - 120px)" }}>
              <ExternalLinks />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
