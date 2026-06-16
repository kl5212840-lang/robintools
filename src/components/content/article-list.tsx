"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Tag, BookOpen, Search, X, ChevronDown, ChevronUp, Library } from "lucide-react";
import { pinyin } from "pinyin-pro";
import { LiquidGlass } from "@/components/layout/liquid-glass";
import { CATEGORY_META, type ArticleCategory } from "@/content/articles";

const TAG_MAX_VISIBLE = 8;

interface ArticleSummary {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: ArticleCategory;
  tags: string[];
}

function readParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

function pinyinMatch(text: string): string {
  try {
    const full = pinyin(text, { toneType: "none", type: "array" }).join("");
    const initials = pinyin(text, { pattern: "first", toneType: "none", type: "array" }).join("");
    return full + " " + initials;
  } catch { return ""; }
}

export function ArticleList({ articles, defaultCategory = "all", title = "知识库", description = "AI 编程工具的使用记录、配置参考与实践总结。" }: { articles: ArticleSummary[]; defaultCategory?: ArticleCategory | "all"; title?: string; description?: string }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | "all">(defaultCategory);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const q = query.trim().toLowerCase();

  // 从 URL 参数恢复分类 — 仅在 defaultCategory 为 "all" 时生效（否则由 defaultCategory 控制）
  useEffect(() => {
    if (defaultCategory === "all") {
      const cat = readParam("category");
      if (cat === "tips" || cat === "learn" || cat === "experience" || cat === "customize") {
        setActiveCategory(cat);
      }
    }
    const tag = readParam("tag");
    if (tag) setActiveTag(tag);
  }, [defaultCategory]);

  const allTags = useMemo(() => {
    const count = new Map<string, number>();
    for (const a of articles) {
      for (const t of a.tags) { count.set(t, (count.get(t) || 0) + 1); }
    }
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [articles]);

  const visibleTags = tagsExpanded ? allTags : allTags.slice(0, TAG_MAX_VISIBLE);
  const hiddenCount = allTags.length - TAG_MAX_VISIBLE;

  const filtered = (() => {
    let result = activeCategory === "all" ? articles : articles.filter((a) => a.category === activeCategory);
    if (activeTag) result = result.filter((a) => a.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()));
    if (q) {
      result = result.filter((a) => {
        const text = [a.title, a.summary, ...a.tags].join(" ");
        return text.toLowerCase().includes(q) || pinyinMatch(text).includes(q.toLowerCase());
      });
    }
    return result;
  })();

  const useGrid = filtered.length >= 2;
  const categories: (ArticleCategory | "all")[] = ["all", "tips", "learn", "experience", "customize"];

  return (
    <>
      {/* ======== HEADER ======== */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "var(--color-accent-glow)", color: "var(--color-accent)" }}>
            <Library className="h-5 w-5" />
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              {title}
            </h1>
            <span className="text-[15px] font-medium" style={{ color: "var(--color-text-muted)" }}>
              共 {articles.length} 篇
            </span>
          </div>
        </div>
        <p className="text-[16px]" style={{ color: "var(--color-text-secondary)" }}>
          {description}
        </p>
      </div>

      {/* ======== CATEGORY TABS ======== */}
      <div className="mt-6 flex flex-wrap items-center gap-2 animate-fade-up stagger-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const meta = cat === "all" ? { name: "全部", desc: "" } : CATEGORY_META[cat];
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveTag(null); }}
              className="rounded-xl px-4 py-2 text-[14px] font-semibold transition-all duration-200 border"
              style={{
                background: isActive ? "var(--color-accent)" : "var(--color-surface)",
                color: isActive ? "#fff" : "var(--color-text-muted)",
                borderColor: isActive ? "var(--color-accent)" : "var(--color-border-subtle)",
                cursor: isActive ? "default" : "pointer",
                pointerEvents: isActive ? "none" : "auto",
              }}
            >
              {meta.name}
              {cat !== "all" && (
                <span className="ml-1.5 text-[12px] opacity-70">
                  {articles.filter((a) => a.category === cat).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======== TAG CHIPS ======== */}
      {allTags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 animate-fade-up stagger-2">
          {visibleTags.map((tag) => {
            const isActive = activeTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(isActive ? null : tag)}
                className={`rounded-lg px-2.5 py-1 text-[12px] font-medium duration-150 border tag-chip ${isActive ? "tag-chip-active" : ""}`}
                title={`筛选标签: ${tag}`}
                style={{
                  background: "transparent",
                  color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                  borderColor: isActive ? "var(--color-accent)" : "var(--color-border-subtle)",
                }}
              >
                {tag}
                {isActive && <X className="inline h-3 w-3 ml-1 -mr-0.5 opacity-70" />}
              </button>
            );
          })}
          {hiddenCount > 0 && (
            <button
              onClick={() => setTagsExpanded(!tagsExpanded)}
              className="rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors duration-150 border"
              style={{
                color: "var(--color-text-muted)",
                borderColor: "var(--color-border-subtle)",
                background: "var(--color-surface-raised)",
              }}
            >
              {tagsExpanded ? (
                <>收起 <ChevronUp className="inline h-3 w-3 ml-0.5" /></>
              ) : (
                <>更多 +{hiddenCount} <ChevronDown className="inline h-3 w-3 ml-0.5" /></>
              )}
            </button>
          )}
        </div>
      )}

      {/* ======== SEARCH ======== */}
      <div className="mt-4 relative max-w-md animate-fade-up stagger-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索笔记标题、摘要或标签..."
          className="w-full rounded-xl py-2.5 pl-10 pr-9 text-[16px] outline-none transition-all border"
          style={{
            color: "var(--color-text-primary)",
            background: "var(--color-surface)",
            borderColor: query ? "var(--color-border-strong)" : "var(--color-border-subtle)",
          }}
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="清除搜索">
            <X className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
          </button>
        )}
      </div>
      {(query || activeTag) && (
        <p className="mt-2 text-[14px]" style={{ color: "var(--color-text-muted)" }}>
          找到 {filtered.length} 篇匹配的笔记
        </p>
      )}

      {/* ======== ARTICLE LIST ======== */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-up" style={{ color: "var(--color-text-muted)" }}>
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="text-[16px]">
            {(query || activeTag) ? "没有匹配的笔记，试试其他条件" : "笔记内容正在撰写中，敬请期待。"}
          </p>
        </div>
      ) : (
        <div
          className={
            useGrid
              ? "grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr mt-6 animate-fade-up stagger-3"
              : "space-y-4 mt-6 animate-fade-up stagger-3"
          }
        >
          {filtered.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="block group h-full">
              <LiquidGlass variant="light" rounded="1rem" hover className="h-full">
                <div className="p-6 flex flex-col" style={{ minHeight: "200px" }}>
                  <div className="mb-2">
                    <span className="inline-block rounded-lg px-2.5 py-0.5 text-[12px] font-medium"
                      style={{ background: "var(--color-accent-glow)", color: "var(--color-accent)" }}>
                      {CATEGORY_META[article.category].name}
                    </span>
                  </div>
                  <h2
                    className="text-[18px] font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {article.title}
                  </h2>
                  <p
                    className="text-[15px] leading-relaxed mb-4 line-clamp-3 flex-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[13px] flex-wrap mt-auto" style={{ color: "var(--color-text-muted)" }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      {article.tags.slice(0, 3).join(" · ")}
                    </span>
                    <span className="flex items-center gap-1 ml-auto font-medium" style={{ color: "var(--color-accent)" }}>
                      阅读 <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </LiquidGlass>
            </Link>
          ))}
        </div>
      )}

    </>
  );
}
